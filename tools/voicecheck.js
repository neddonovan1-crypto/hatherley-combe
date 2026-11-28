#!/usr/bin/env node
/* Reads the game's prose and reports where it drifts from docs/voice/VOICE.md.
   Usage: node tools/voicecheck.js [--all]
   Errors (exit 1): dashes and banned words. Everything else is advice. */
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '..', 'src');
const FILES = ['events1.js', 'events2.js', 'events3.js', 'events4.js', 'events5.js', 'castle.js', 'traits.js', 'data.js', 'engine.js', 'estate.js', 'common.js', 'farmworks.js', 'endings.js', 'ventpapers.js', 'ui.js'].filter(f => fs.existsSync(path.join(SRC, f)));
const showAll = process.argv.includes('--all');

// Hard rules. These fail the run.
const BANNED = ['genuinely', 'straightforward', 'moreover', 'furthermore', 'it is worth noting',
  'delve', 'tapestry', 'testament to', 'navigate the', 'in a world where', 'little did'];

// Words and senses the years 1795 to 1815 did not have. Dates are from memory: check before arguing.
const ANACHRONISMS = {
  'cost of living': 'late Victorian. Say "the price of provisions".',
  'living wage': '1870s. Say "a wage a man can live on", or name the sum.',
  'bogeyman': 'later. The nursery had Boney, Raw-head and Bloody-bones, the bugbear.',
  'scientist': '1834. Natural philosopher, botanist, chymist.',
  'weekend': 'Say "from Saturday to Monday".',
  'lunch\\b': 'Nuncheon, or a cold collation. Dinner is at four.',
  'sideburns': 'Whiskers.',
  'okay': 'No.', 'hello': 'Halloo, or "your servant".',
  'boycott': '1880.', 'sabotage': '1910.', 'deadline': 'American, 1860s.',
  'feedback': 'No.', 'background': 'Modern in the personal sense.',
  'researched': 'He has "made enquiries" or "been at pains to learn".',
  'contacted': 'He wrote, waited upon, or sent to.',
  'staff': 'For servants say the household, the people, the servants.',
  'police': 'Constable, the watch, a Bow Street officer.',
  'detective': '1840s.', 'blackmail': 'Say hush-money.',
  'envelope': 'Letters are folded and sealed with a wafer.',
  'sacked': 'Turned off, turned away, discharged.',
  'boss': 'Master.', 'teenage': 'No.', 'nostalgi': 'A disease of Swiss soldiers.',
  'empath': 'Fellow-feeling, sensibility.', 'paranoi': 'No.', 'mesmeris': 'Animal magnetism, if at all.',
  'scored as a draw': 'Modern sporting idiom.', 'in the same breath': 'Tired.',
  'a sense of proportion': 'Modern idiom.', 'political education': 'Modern phrase.',
  'out of work': 'Fine in itself, but "put out of work" as a joke is modern.',
  'unhinged quality': 'Modern construction.', 'officially': 'Used as a modern deadpan.'
};

// Habits of the present text. Counted per event and reported when over the ration.
const SIMILE = /\b(like an?|as if|as though|as a man|as one who|as men)\b/gi;
const WHICH = /, which (is|was|in|tells|means)\b/gi;
const HINDSIGHT = /\b(for the rest of (his|her|their) (life|lives|service)|years later|until 18\d\d|in about the year|will run for|you do not learn until|will speak of it until)\b/gi;

function strings(code){ const out = []; const re = /`((?:[^`\\]|\\.)*)`/g; let m;
  while ((m = re.exec(code))) if (/[a-z] [a-z]/.test(m[1]) && m[1].length > 60) out.push(m[1]);
  return out; }
function sentences(s){ return s.replace(/\$\{[^}]*\}/g, 'x').split(/(?<=[.!?”])\s+/).filter(x => x.trim()); }
// The tail: a statement, a comma, then a comment hung on the end. The owner's chief complaint.
const TAIL = /,\s+(and|but|which|who|whom|whose|as|though|so that|like|having|being|not|or)\b[^,;:]*[.!?]”?$/i;
// Staccato: the narrator in sentences of six and eight words. Speech, bills and the pocket-book are left out of the count.
function pace(s){ const ss = sentences(s.replace(/“[^”]*”/g, '')).map(x => x.trim().split(/\s+/).length).filter(n => n > 1);
  let run = 0, worst = 0; for (const n of ss) { run = n <= 9 ? run + 1 : 0; if (run > worst) worst = run; }
  return [ss.reduce((a, b) => a + b, 0), ss.length, worst]; }
function tails(s){ const ss = sentences(s.replace(/“[^”]*”/g, 'Q')); return [ss.filter(x => TAIL.test(x.trim())).length, ss.length]; }

let errors = 0; const rows = []; const tot = {events:0, simile:0, which:0, punch:0, strings:0, hind:0, stac:0};
for (const f of FILES) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8');
  const parts = code.split(/(?=ev\(\{ id:')/);
  for (const part of parts) {
    const idm = part.match(/^ev\(\{ id:'(\w+)'/); const id = f + (idm ? ':' + idm[1] : '');
    const ss = strings(part); if (!ss.length) continue;
    const text = ss.join('\n'); const notes = [];
    if (/[—–]/.test(text)) { notes.push('ERROR dash'); errors++; }
    for (const b of BANNED) if (text.toLowerCase().includes(b)) { notes.push('ERROR banned: ' + b); errors++; }
    for (const a in ANACHRONISMS) { const re = new RegExp('\\b' + a, 'i'); if (re.test(text)) notes.push('period: "' + a + '". ' + ANACHRONISMS[a]); }
    const sim = (text.match(SIMILE) || []).length, wh = (text.match(WHICH) || []).length, hind = (text.match(HINDSIGHT) || []).length;
    let tl = 0, sn = 0; for (const x of ss) { const [a, b] = tails(x); tl += a; sn += b; }
    if (idm) { tot.events++; tot.simile += sim; tot.which += wh; tot.punch += tl; tot.strings += sn; tot.hind += hind; }
    if (idm && sim > 2) notes.push('similes: ' + sim + ' (ration is one, two at a pinch)');
    if (idm && wh > 1) notes.push('", which is" deflations: ' + wh);
    if (idm && sn >= 8 && tl > sn / 2) notes.push('statement, comma, aside: ' + tl + ' of ' + sn + ' sentences end after a comma and a joiner. Read each: a member that carries the action on is well, a remark upon the fact is not');
    let pw = 0, pn = 0, pr = 0; for (const x of ss) { if (/^In your pocket-book|^“/.test(x)) continue; const [a, b, c] = pace(x); pw += a; pn += b; pr = Math.max(pr, c); }
    if (idm && pn >= 6 && (pw / pn < 13 || pr >= 4)) { tot.stac++; notes.push('staccato: ' + (pw / pn).toFixed(0) + ' words to a sentence, ' + pr + ' short ones running (write in periods; three short running is the limit)'); }
    if (hind) notes.push('hindsight: the narrator knows the future ' + hind + ' time' + (hind > 1 ? 's' : ''));
    if (notes.length || showAll) rows.push([id, notes]);
  }
}
for (const [id, notes] of rows) { console.log(id); for (const n of notes) console.log('   ' + n); }
console.log('\n' + tot.events + ' events. Per event: ' + (tot.simile / tot.events).toFixed(1) + ' similes, '
  + (tot.which / tot.events).toFixed(1) + ' which-deflations, ' + Math.round(100 * tot.punch / tot.strings) + '% of sentences end on a hung clause, '
  + tot.hind + ' lapses into hindsight in all. ' + tot.stac + ' events still staccato.');
if (errors) { console.log(errors + ' hard error' + (errors > 1 ? 's' : '') + '.'); process.exit(1); }

/* The engine: seasons, ledger, undertakings, and the reckoning. */
let S = null;
const SAVE_KEY = 'hatherley-combe-save-v1';

const F = k => S.flags[k];
function fl(k, v = true){ S.flags[k] = v; }
function add(d){ for (const k in d){ if (k === 'money') S.money += d[k]; else S[k] = clamp(S[k] + d[k], 0, 100); } }
function meet(id){ S.chars[id].met = true; }
function reg(id, n, note){ const c = S.chars[id]; c.met = true; c.r = clamp(c.r + n, -5, 5); if (note) c.notes.push(note + ', ' + S.year); }
function later(id, delay){ S.queue.push({id, at: S.t + delay}); }

function kittyRole(){ const k = S.flags.kitty || 'free';
  if (k === 'vane') return 'Mrs Vane, wherever the regiment is';
  if (k === 'pinch') return F('kittyWidow') ? 'Mr Pinch’s widow, and rich' : 'Mrs Pinch, at Clifton';
  if (k === 'oakes') return F('oakesVicar') ? 'Mrs Oakes, at the vicarage' : 'Mrs Oakes, over the schoolhouse';
  if (k === 'dubreuil') return 'Madame Dubreuil, near Saint-Malo';
  return 'Your daughter, ' + (17 + S.year - 1795) + (F('kittyBotanist') ? ', botanist' : ''); }
function edmundRole(){ const e = S.flags.edmund, y = S.year;
  if (F('edmundDead')) return 'Killed at Waterloo, June 1815';
  if (!e) return 'Your son, ' + (19 + y - 1795);
  if (e === 'army') return (F('major') ? 'Major' : y < 1800 ? 'Ensign' : y < 1807 ? 'Lieutenant' : 'Captain') + ', 52nd Foot';
  if (e === 'navy') return (y < 1801 ? 'Master’s mate' : y < 1811 ? 'Lieutenant' : 'Commander') + ', Royal Navy';
  if (e === 'church') return F('edmundVicar') ? 'Vicar of Hatherley' : y < 1800 ? 'Reading for orders at Oriel' : 'A curate in Hampshire, waiting';
  if (e === 'militia') return 'Captain, Berkshire Militia';
  if (e === 'farmer') return 'Farming Kennet Bottom';
  return 'At home, learning the estate'; }

/* Estate works. Long business, commissioned whenever the squire pleases, paid by instalments in the quarter's accounts.
   They run alongside the seasons and do not use up the season's undertaking. */
const MAX_WORKS = 2;
const PROJECTS = {
  enclosure:{ name:'The Hatherley Inclosure Bill', seasons:3, cost:() => F('allotments') ? 1400 : 1200, hidden:true,
    blurb:`A private Act of Parliament, a surveyor and three commissioners.`, gain:'Church Farm worth a third more; the common allotted to you',
    done:() => { fl('enclosed'); add({goodwill: F('allotments') ? -6 : -16, standing:3}); if (!F('allotments')) reg('pryor',-2,'Lost his cow-gate when the common was enclosed'); later('commonRiot', 1);
      return F('allotments') ? `The Hatherley Inclosure Act has the Royal Assent. The award is read out in the vestry: so many acres to you, so many to Lord Cullerne, so many in lieu of tithe, and sixty in acre plots to the cottagers. The rest of the common, which was everybody’s, now belongs to somebody.` : `The Hatherley Inclosure Act has the Royal Assent, with forty others that session. The award is read out in the vestry: so many acres to you, so many to Lord Cullerne, so many in lieu of tithe; and to nineteen cottagers who could show no deed, nothing, the law having no column for “always”.`; }},
  drain:{ name:'Drain and marl the clay at Kennet Bottom', seasons:2, cost:() => F('hartoppFriend') ? 420 : 520,
    blurb:`Nine miles of stone drains under fields that have been a pond since the Conquest.`, gain:'Kennet Bottom in fair order',
    done:() => { return `The drains are in at Kennet Bottom: nine miles of them, laid in stone and blackthorn, and for the first time since the Flood a man may cross the low fields in March and keep both boots.`; }},
  fourcourse:{ name:'Put the home farm under the Norfolk four-course', seasons:1, cost:() => F('hartoppFriend') ? 200 : 260,
    blurb:`Wheat, turnips, barley, clover. No field to lie idle, and no carter to like it.`, gain:'Yields and rents up',
    done:() => { S.improve += 1; reg('hartopp',1); return `Wheat, turnips, barley, clover, and round again. The fallow year is abolished on the home farm. The old carter looks on a field that never rests as he would on a man who never sleeps: with awe, and an expectation of judgment.`; }},
  mill:{ name:'Rebuild Hatherley Mill with an iron wheel', seasons:2, cost:() => 420,
    blurb:`The present wheel was old when your grandfather was young, and grinds as he chewed.`, gain:'Kennet Bottom worth more; the parish pleased',
    done:() => { fl('newMill'); add({goodwill:3}); return `The new wheel turns at Hatherley Mill: cast iron, from a foundry at Reading, eighteen feet across and painted red. It grinds in a morning what the old one managed in a day. Pocock the miller walks round it twice with his hands behind him and says that it will never last, which from Pocock is a psalm of thanksgiving.`; }},
  cottages:{ name:'Build six brick cottages on the Kintbury lane', seasons:2, cost:() => 360,
    blurb:`In place of six that are held up chiefly by the ivy.`, gain:'Goodwill',
    done:() => { fl('cottages'); add({goodwill:9}); return `Six cottages stand finished on the Kintbury lane: brick, tiled, two bedrooms, a bread oven and a pigsty apiece. The families who are to have them walk through in silence, touching the walls. One woman asks whether the upstairs is included.`; }},
  school:{ name:'Endow a dame school in the old tithe barn', seasons:1, cost:() => 160,
    blurb:`Letters, the catechism and plain sewing, for forty children who at present have none of the three.`, gain:'Goodwill',
    done:() => { fl('school'); add({goodwill:6}); if (!F('gallDead')) reg('gall',-1); return `The school opens in the tithe barn with forty children, one slate between two, and old Hannah Gurney’s niece to teach them their letters, their catechism and knitting, all at once. ${F('gallDead') ? 'The farmers hold' : 'Dr Gall holds'} that reading will only make the poor discontented. They were discontented before. Now they can spell it.`; }},
  road:{ name:'Mend the Kintbury road, and the bridge with it', seasons:1, cost:() => 240,
    blurb:`It has swallowed two carts and a curate’s pony. The parish is bound by law to repair it, and has been since Queen Anne.`, gain:'Goodwill and standing',
    done:() => { fl('road'); add({goodwill:3, standing:3}); return `The Kintbury road is made: flints broken small, rammed and cambered, with a ditch either side and a bridge that no longer has to be taken at a run. The carrier now calls twice a week. The first stranger to drive over it without getting down to look is pointed out to children.`; }},
  front:{ name:'New-front the Hall in Bath stone', seasons:3, cost:() => 900,
    blurb:`A portico, a pediment and six columns, in the correct taste, across a house that has none.`, gain:'Standing; Henrietta',
    done:() => { fl('newFront'); add({standing:9, family:4}); reg('henrietta',2,'You gave the Hall a front she could ask people to'); return `The scaffolding comes down. Hatherley Hall now presents to the park a front of Bath stone, with six Ionic columns and a pediment bearing your arms, behind which the same old house goes on smoking from every chimney. It is rather like a bishop’s hat on a farmer. Henrietta has the Tamworths to dinner within the week, and receives them on the steps.`; }},
  pinery:{ name:'Build a pinery and raise pine-apples', seasons:1, cost:() => 200,
    blurb:`A glass house, a pit of tanner’s bark, and a gardener who does nothing else. Each fruit takes two years and costs about what a ewe does.`, gain:'Standing; the household',
    done:() => { fl('pinery'); add({standing:4, family:2}); return `The first pine-apple is cut. It has taken two years, forty loads of bark and the whole attention of a Scotchman. It is not eaten. It is placed in the middle of the table, where the county admires it through eleven dinners, and when it can no longer decently be shown, it is lent to the Lovedays.`; }},
  oaks:{ name:'Plant forty acres of oak for the Navy', seasons:1, cost:() => 120,
    blurb:`A seventy-four takes two thousand grown oaks. Somebody must plant them, and wait.`, gain:'Standing; posterity',
    done:() => { fl('oaks'); add({standing:2}); return `Forty acres of acorns are dibbled in on Gallows Piece, for the wooden walls of England. They will be fit for ship timber in about the year 1920. You find this very restful to think about.`; }},
  icehouse:{ name:'Sink an ice-house in the north shrubbery', seasons:1, cost:() => 140,
    blurb:`A brick egg underground, filled from the carp pond in January.`, gain:'The household',
    done:() => { fl('icehouse'); add({family:5}); reg('henrietta',1); return `The ice-house is sunk: a brick egg under a mound of earth. It is filled in January from the carp pond, and in July Henrietta serves a lemon ice to the Tamworths with the face of a general accepting a surrender.`; }}
};
const projCost = id => Math.round(PROJECTS[id].cost() * (T('bred') ? 0.85 : 1) / 10) * 10;
function startProject(id){ const p = PROJECTS[id]; S.works.push({id, left:p.seasons, per:Math.round(projCost(id) / p.seasons)}); S.projectsDone[id] = 'begun'; }
/* What the page needs to know about works. */
function worksInHand(){ return S.works.map(w => ({id:w.id, name:PROJECTS[w.id].name, left:w.left, per:w.per})); }
function worksDone(){ return Object.keys(PROJECTS).filter(id => S.projectsDone[id] === 'done').map(id => ({id, name:PROJECTS[id].name})); }
function worksList(){ const busy = S.works.filter(w => !PROJECTS[w.id].hidden).length;
  return Object.keys(PROJECTS).filter(id => (!PROJECTS[id].hidden || S.projectsDone[id]) && (S.projectsDone[id] || !PROJECTS[id].if || PROJECTS[id].if())).map(id => { const p = PROJECTS[id], cost = projCost(id), per = Math.round(cost / p.seasons);
    const state = S.projectsDone[id] === 'done' ? 'done' : S.projectsDone[id] === 'begun' ? 'inHand' : 'open'; const w = S.works.find(x => x.id === id);
    let why = '';
    if (state === 'open') { if (S.phase === 'end' || S.dead) why = 'The books are closed.';
      else if (busy >= MAX_WORKS) why = 'Two works in hand already. There is one estate carpenter, and he is on both.';
      else if (S.money < per) why = 'The purse will not stand the first instalment of ' + fmt(per) + '.'; }
    return {id, name:p.name, blurb:p.blurb, gain:p.gain, cost, seasons:p.seasons, per,
      note:fmt(cost) + (p.seasons > 1 ? ', in ' + p.seasons + ' quarterly instalments' : ''), state, left:w ? w.left : 0, can:state === 'open' && !why, why}; }); }
function beginWork(id){ const w = worksList().find(x => x.id === id); if (!w || !w.can) return false;
  startProject(id); S.journal.unshift({when:stamp(), title:'Works', did:'Put in hand: ' + PROJECTS[id].name});
  save(); render(); return true; }

function newGame(first, sur, traits){
  S = { name:(first + ' ' + sur).trim(), sur, t:0, year:FIRST_YEAR, season:0, phase:'ledger',
    money:900, mortgage:4000, standing:40, goodwill:50, family:60,
    improve:0, rentPolicy:1, rentAdj:1, poorMult:1, game:3, canal:0, yearIncome:0,
    farms:startFarms(), letQueue:[], payQueue:[], flags:{}, chars:{}, queue:[], seen:{}, journal:[], works:[], projectsDone:{}, dead:null,
    ledger:[], notes:[], pending:null, vignette:null, outcome:null, priceSeen:[] };
  for (const id in PEOPLE) S.chars[id] = {r:PEOPLE[id].r, met:PEOPLE[id].met, notes:[]};
  S.traits = (traits || []).filter(id => traitById(id));
  for (const id of S.traits) traitById(id).apply();
  for (const id in S.chars) S.chars[id].notes = S.chars[id].notes.map(n => n.replace(/, 1795$/, ''));
  beginSeason();
}

function halfRent(){ return rentalNow() / 2; }

function beginSeason(){
  const y = S.year, q = S.season, P = PRICES[y], pi = P / 75;
  const L = []; S.notes = [];
  const line = (label, amt) => { amt = Math.round(amt); if (amt) { L.push([label, amt]); S.money += amt; } };
  if (q === 0) { S.yearIncome = 0; if (!S.priceSeen.includes(y)) S.priceSeen.push(y); }
  estateSync();
  if (q === 0 || q === 2) rentDay(line);
  ventureTick(line);
  if (q === 1) { const w = 100 + (F('merino') ? (y < 1811 ? 110 : 15) : 0) + (F('merinoRam') ? 15 : 0); line('The wool clip', w); S.yearIncome += w;
    if (F('merino') && y === 1811) S.notes.push('The merino mania has burst. Rams bought at forty guineas go to the butcher at forty shillings.'); }
  if (q === 2) { const qtrs = Math.round(140 * WEATHER[y] * (1 + 0.06 * S.improve)); const v = qtrs * P / 20; line('Home farm wheat, ' + qtrs + ' qrs at ' + P + 's.', v); S.yearIncome += v; }
  if (S.canal && y >= 1810) { line('Kennet & Avon dividend', 7 * S.canal); }
  line('Household, stables and servants', -((280 + S.standing * 1.6) * (T('figures') ? 0.9 : 1) * (T('captain') && !F('crewGone') ? 0.9 : 1) * (1 + 0.027 * (y - 1795)) - (F('bricked') ? 3 : 0)));
  if (S.mortgage > 0) line('Interest on the mortgage', -S.mortgage * (F('cheapCredit') ? 0.04 : 0.05) / 4);
  if (F('skrine')) line('Miss Skrine’s sixth per cent', -5);
  if (F('pompey') && q === 0 && y <= 1799) S.notes.push('Mr Stroud of Bath has viewed the pug Pompey and found him alive.');
  if (F('wages')) line('Home farm wages above the common rate', -30);
  if (F('crabbeSkims') && !F('crabbeGone') && !T('figures')) line('“Sundries” (Mr Crabbe)', -45);
  if (F('mp') && q === 0) line('Lodgings in Half Moon Street for the session', -160);
  for (const w of S.works.slice()) { line(PROJECTS[w.id].name, -w.per); w.left--;
    if (w.left <= 0) { S.works.splice(S.works.indexOf(w), 1); S.projectsDone[w.id] = 'done'; S.notes.push(PROJECTS[w.id].done()); S.journal.unshift({when:stamp(), title:'Works', did:'Finished: ' + PROJECTS[w.id].name}); } }
  if (q === 3) {
    line('Poor rate', -130 * S.poorMult * pi * (F('speen') ? 1.6 : 1));
    line('Land tax', -110);
    if (T('court') && !F('courtLost') && !F('courtSold')) line('Salary as Deputy Keeper of the Swans', 90);
    if (T('play')) line('Losses at whist and hazard', -(70 + Math.floor(Math.random() * 12) * 10));
    if (T('gout') && !F('goutEased')) { add({family:-3}); S.notes.push('The gout has you by the foot from Advent to Candlemas. The household walks on tiptoe, and is shouted at for it.'); }
    if (y >= 1799 && y !== 1802) { const rate = y <= 1801 ? 0.1 : y <= 1805 ? 0.05 : 0.1; line('Income tax at ' + (rate * 100) + ' per cent', -S.yearIncome * rate * (F('taxDodge') ? 0.5 : 1)); }
  }
  if (S.money < 0) { line('Interest on tradesmen’s bills and notes of hand', S.money * 0.03); add({standing:-1}); S.notes.push('You are living on credit. Wyvern has noticed.'); }
  // Nothing keeps without tending: regard, like a hedge, grows out.
  if (S.t > 0) { const dear = P >= 95 && !F('soup') && !F('wages');
    add({standing: S.standing > 60 ? -2 : -1, goodwill: (S.goodwill > 60 ? -2 : -1) - (dear ? 1 : 0), family: S.family > 60 ? -2 : -1});
    if (dear && q === 3) S.notes.push('Bread at famine price. The parish looks at the Hall, and counts its chimneys.'); }
  S.ledger = L;
  S.news = NEWS[y + '-' + q] || null;
  creditCheck();
  S.pending = pickEvent();
  S.vignette = S.pending ? null : pick(VIGNETTES[q]);
  S.phase = 'ledger';
  save();
}

const FIXED = {};
function indexEvents(){ for (const e of EVENTS){ if (e.fixed) for (const k of [].concat(e.fixed)) (FIXED[k] = FIXED[k] || []).push(e); } }
const lab = c => typeof c.t === 'function' ? c.t() : c.t;
const byId = id => EVENTS.find(e => e.id === id);

function pickEvent(){
  const due = S.queue.filter(x => x.at <= S.t);
  for (const d of due){ S.queue.splice(S.queue.indexOf(d), 1); const e = byId(d.id); if (e && (!e.cond || e.cond())) { S.queue.forEach(x => { if (x.at <= S.t) x.at = S.t + 1; }); return e.id; } }
  const fx = FIXED[S.year + '-' + S.season];
  if (fx) for (const e of fx) if (!e.cond || e.cond()) return e.id;
  if (!chance(0.8)) return null;
  const pool = EVENTS.filter(e => !e.fixed && !e.follow && S.year >= (e.from || 0) && S.year <= (e.to || 9999)
    && (S.seen[e.id] === undefined || (e.repeatGap && S.t - S.seen[e.id] >= e.repeatGap)) && (!e.cond || e.cond()));
  if (!pool.length) return null;
  let tot = pool.reduce((a, e) => a + (e.weight || 1), 0), r = Math.random() * tot;
  for (const e of pool){ r -= (e.weight || 1); if (r <= 0) return e.id; }
  return pool[0].id;
}

function snapshot(){ const c = {}; for (const id in S.chars) c[id] = S.chars[id].r; return {money:S.money, standing:S.standing, goodwill:S.goodwill, family:S.family, c}; }
function deltas(b){ const out = [];
  const dm = Math.round(S.money - b.money); if (dm) out.push(['Purse ' + (dm > 0 ? '+' : '') + fmt(dm).replace('−', '−'), dm > 0]);
  for (const [k, label] of [['standing','Standing'],['goodwill','Goodwill'],['family','Household']]){ const d = S[k] - b[k]; if (d) out.push([label + (d > 0 ? ' rises' : ' falls') + (Math.abs(d) >= 8 ? ' sharply' : ''), d > 0]); }
  for (const id in S.chars){ const d = S.chars[id].r - b.c[id]; if (d) out.push([PEOPLE[id].name + (d > 0 ? (d > 2 ? ' is won over' : ' warms') : (d < -2 ? ' will not forget this' : ' cools')), d > 0]); }
  return out; }

function stamp(){ return SEASONS[S.season] + ' ' + S.year; }

function choose(i){
  const e = byId(S.pending); const ch = e.choices.filter(c => !c.if || c.if())[i]; const b = snapshot(); const did = lab(ch);
  S.seen[e.id] = S.t;
  const text = ch.go();
  S.journal.unshift({when:stamp(), title:e.title, did});
  S.outcome = {title:e.title, text, d:deltas(b)}; S.phase = 'outcome'; save(); render();
}

const UNDERTAKINGS = [
  { id:'ride', t:'Ride round the tenancies', hint:'Goodwill', go:() => { add({goodwill: T('gout') && !F('goutEased') ? 2 : 4}); return pick([
      `You ride the eleven farms in a day and a half and are given, in order: cider, perry, a cold pie, more cider, advice about your horse, and a dog you did not ask for.`,
      `At Kennet Bottom the Widow Harris shows you the place where her roof lets in the rain, and then, that there may be no mistake, the rain. You promise a thatcher. She looks at you as one who has been promised thatchers before.`,
      `A wet week in the saddle learning the names of children. By Friday you have thirty-one, three of whom were christened after your uncle, which tells you something about your uncle.`,
      `You walk the bounds of Starveall with its tenant, who points out every gate that wants hanging and describes each as “your gate, sir”. The hedges, which are in good order, are “my hedges”.`]); }},
  { id:'dine', t:'Dine the county', note:'£70', hint:'Standing', go:() => { add({money:-70, standing:4}); return pick([
      `Three removes for sixteen. The Bishop’s chaplain eats like a man provisioning for a siege. Lady Cullerne calls your turbot “very brave”, and you lie awake wondering what she meant.`,
      `Dinner at the Tamworths’, at the Lovedays’, at Hartopp’s, and then at your own table, where Mrs Bunce sends up a haunch hung until it can very nearly speak. The county pronounces it excellent. The county has no sense of smell.`,
      `A ball at the Wyvern Assembly Rooms, of which you are steward, and therefore answerable for the candles, the negus, and the moment at which old Mrs Loveday sits down on the fiddler’s bow.`,
      `You give a venison dinner to nine magistrates and a colonel. By the second bottle the war is won; by the third, the harvest is saved; by the fourth, nobody can find the door.`]); }},
  { id:'sessions', t:'Sit on the bench at Quarter Sessions', hint:'Standing', go:() => { const g = pick([-2, 0, 2, 3]); add({standing: T('silver') ? 5 : 3, goodwill:g}); return pick([
      `You sentence a man to be whipped for stealing a goose and a woman to a month for stealing it back from him. The goose is produced in evidence, and bites the clerk.`,
      `A bastardy case, in which three men of Kintbury are each named as the father, and each swears upon oath that it was one of the other two. You order all three to pay. It is as near to justice as you will come this year.`,
      `A long day in the Shire Hall deciding who must mend a bridge that every parish in the hundred says belongs to the next. By evening it is settled that the bridge belongs to no one, which is what the bridge has always suspected.`,
      `You license eleven alehouses, refuse a twelfth, and remove a pauper to the parish of her birth, forty miles off, where they will prove that she was born in a wagon and send her back.`]); }},
  { id:'home', t:'Keep at home with the family', hint:'Household', go:() => { add({family:5}); const a = [
      `You stay at home and play backgammon with Henrietta, who cheats with such grace that you would not stop her for the world.`,
      `A week of wet afternoons in the library. You read Tom Jones for the sixth time; Henrietta nets a purse, and tells you between rows what is wrong with every family in Berkshire, beginning with the As.`,
      `You teach the dogs nothing, shoot nothing, decide nothing, and enjoy it more than anything since Christmas.`];
      if ((S.flags.kitty || 'free') === 'free') a.push(`Kitty reads Mrs Radcliffe aloud after dinner, doing all the voices. The wicked monk sounds exactly like ${F('gallDead') ? 'the late Dr Gall' : 'Dr Gall'}. Nobody remarks on it and everybody notices.`);
      return pick(a); }},
  { id:'town', t:'Go up to London for the Season', note:'£350', hint:'Standing, Household', if:() => S.season === 0, go:() => { add({money:-350, standing:6, family:4}); reg('henrietta',1); return pick([
      `A house in Upper Brook Street for ten weeks. You see Mrs Siddons as Lady Macbeth and are afraid of her for a fortnight. Henrietta is presented at a Drawing Room, in hoops and feathers, and comes home walking sideways out of habit.`,
      `London. You are jostled at the Opera, overcharged at Tattersall’s, and cut by a duke who mistook you for somebody else and, on finding out, cut you again in your own right. Henrietta has never been happier.`,
      `Ten weeks of routs, at which three hundred people stand on a staircase for two hours, in order to say that they were there. You say that you were there. It was very hot.`]); }},
  { id:'retrench', t:'Retrench', note:'+£130', hint:'Costs Standing and Household', go:() => { add({money:130, standing:-3, family:-3}); return pick([
      `You sell the second carriage, two hunters, and the claret your uncle laid down against a christening that never happened. Henrietta calls it “living like curates”, in a voice which suggests she has seen how curates live, and blames you for that too.`,
      `One footman is let go, the hot-house fires are put out, and the family dines on mutton four days in seven. The pine-apples die. Mrs Bunce wears black for them.`,
      `You shut up the east wing and sell the timber in Cuckoo Copse. The woodmen are a month about it, and the rooks, turned out, sit on the Hall roof and discuss you.`]); }}
];

function undertakingOptions(){
  const o = UNDERTAKINGS.filter(u => !u.if || u.if()).map(u => ({t:u.t, note:u.note, hint:u.hint, run:() => { const r = u.go(); return r; }}));
  return o;
}
function undertake(i){ const u = undertakingOptions()[i]; const b = snapshot(); const text = u.run();
  S.journal.unshift({when:stamp(), title:'The season’s undertaking', did:u.t});
  S.outcome = {title:u.t, text, d:deltas(b)}; S.phase = 'undone'; save(); render(); }

function next(){
  if (S.phase === 'ledger') { if (S.dead) return finish(); S.phase = S.pending ? 'event' : 'undertake'; }
  else if (S.phase === 'outcome') { if (S.dead) return finish(); S.phase = 'undertake'; }
  else if (S.phase === 'undone') { S.t++; if (S.t >= (LAST_YEAR - FIRST_YEAR + 1) * 4) return finish(); S.year = FIRST_YEAR + Math.floor(S.t / 4); S.season = S.t % 4; beginSeason(); }
  save(); render(); window.scrollTo({top:0, behavior:'smooth'});
}
function finish(){ S.phase = 'end'; save(); render(); window.scrollTo({top:0}); }

function setRent(v){ S.rentPolicy = v; setRentAll(v); save(); render(); }
function mortgage(d){ if (d < 0 && S.money >= 500 && S.mortgage >= 500) { S.mortgage -= 500; S.money -= 500; } if (d > 0 && canBorrow()) { S.mortgage += 500; S.money += 500; } save(); render(); }

/* ---------- the reckoning ---------- */
function reckoning(){
  const net = S.money - S.mortgage, k = S.flags.kitty || 'free', e = S.flags.edmund, P = [];
  if (S.dead === 'duel') { P.push(`DIED, on Thursday last, on Hatherley Down, by the visitation of a pistol ball, ${S.name}, Esquire, of Hatherley Combe in this county, in the ${S.year - 1795 + 46}th year of his age. The coroner’s jury, composed of gentlemen who understood the matter perfectly, returned a verdict of misadventure while shooting rooks.`);
    P.push(`Captain Vane has gone abroad for his health. The deceased is succeeded in his estates by his widow, who is said to have remarked that she had always told him so.`);
    return {title:'Shot at Dawn', P, score:null}; }
  if (S.dead === 'ruin') { P.push(`TO BE SOLD BY AUCTION, by Mr Skinner, at the George Inn, Wyvern: the capital freehold estate of HATHERLEY COMBE, comprising a mansion house of fifty-four windows, eleven farms, a water corn mill${F('enclosed') ? ', and four hundred acres of newly enclosed land' : ', with rights over an extensive common'}; by order of the mortgagees.`);
    P.push(`${S.name}, Esquire, late of that place, is understood to have removed with his family to Douglas, in the Isle of Man, where the King’s writ for debt does not run, and where he may be seen most mornings on the pier, looking at England.`);
    P.push(`The principal purchaser is expected to be the Earl of Cullerne.`);
    return {title:'Sold Up', P, score:null}; }

  P.push(`${S.name}, Esquire, has now held Hatherley Combe one-and-twenty years, and the county, which was not consulted at the time, has had leisure to form a view.`);
  if (T('captain')) P.push(F('crewGone') ? `He was a sea officer once, and still comes downstairs sideways. The Dryads who followed him ashore are long since back afloat; he reads the Navy List for their ships.` : `His house is the only one in Berkshire where dinner is announced by a boatswain’s pipe, and where a guest who is late for it is logged.`);
  if (T('play')) P.push(`He is known at every card table between Reading and Bath, and welcome at all of them, as a man is welcome who loses.`);
  if (T('enemy')) P.push(S.chars.cullerne.r >= 1 ? `It is counted a wonder that he and Lord Cullerne now speak, the matter of the pointer having lain between them for near fifty years.` : `Lord Cullerne has not forgiven the pointer, and it is now thought that he will be buried unreconciled, beside the dog.`);
  P.push(net > 4000 ? `He is richer than his uncle was, which nobody had thought possible and several think indecent. The estate stands clear by some ${fmt(net)}.`
    : net > -1500 ? `His affairs balance, more or less, in the way that a man balances on a gate. Set the mortgage against the purse and there is ${net >= 0 ? fmt(net) + ' to the good' : fmt(-net) + ' wanting'}, which for a landed gentleman at the end of a great war is a species of triumph.`
    : `His debts are spoken of in Wyvern with something approaching awe: ${fmt(-net)} at the last computation, secured upon every acre, and Mr Tidmarsh’s successors are observed to raise their hats to him rather lower each year, as to a monument.`);
  P.push(S.goodwill >= 68 ? `In Hatherley, where memories are long and patience short, he is called a fair man, which is the highest thing they say there of anybody not yet dead.`
    : S.goodwill >= 42 ? `In Hatherley he is thought no worse than most and better than some. They touch their hats and mean about half of it, which is the customary proportion.`
    : `In Hatherley they have a song about him. It has nine verses and is not sung when he is in the room.`);
  if (F('enclosed')) P.push(F('allotments') ? `He enclosed the common, and left every cottage its acre; the cottagers, weighing the acre against the common, have decided to remember both.` : `He enclosed the common. The hedges are grown up now, and children are being born in the parish who do not know there was ever anything there but fields. Their grandmothers tell them.`);
  else P.push(`Hatherley Common lies open still, to the grief of every improver in Berkshire and the satisfaction of some forty cows.`);
  if (F('speen')) P.push(`He was of the party at the Pelican in the year ’95, and may live to hear the Speenhamland scale cursed by the men who pay it and the men who draw it, with equal warmth.`);
  if (F('wages')) P.push(`He paid his labourers nine shillings when his neighbours paid seven, and has been forgiven it by almost all of them.`);
  P.push(S.standing >= 70 ? `Among the gentry he is a man of weight. Lord Cullerne calls him “a coming man”, though he has been coming these twenty years.`
    : S.standing >= 40 ? `Among the gentry he is received everywhere and consulted nowhere, an enviable condition.`
    : `Among the gentry he is asked to large parties.`);
  if (F('mp')) P.push(`He sits for the borough of Wyvern, and has spoken in the House twice, once by mistake.`);
  // children
  const kl = {vane:`His daughter is Mrs Vane, ${F('kittySettled') ? 'living at Northampton on forty pounds a year that her husband cannot touch, which is the only circumstance in the marriage anybody praises' : 'and follows the Captain from garrison to garrison, one town ahead of his creditors'}.`,
    pinch:F('kittyManumit') ? `His daughter, the widow of Mr Pinch of Bristol, gave freedom to three hundred persons in Jamaica at the cost of most of her fortune, and is thought in Clifton to be out of her mind and in Hatherley to be the pick of the family.` : F('kittyWidow') ? `His daughter is the widow of Mr Pinch of Bristol, and very rich. She does not speak of how.` : `His daughter is Mrs Pinch, of Clifton, and has everything that money can buy her.`,
    oakes:`His daughter married the ${F('oakesVicar') ? 'vicar, who was then the curate' : 'curate, who is the curate still'}. She has five children, no carriage, and the look of a woman who was right.`,
    dubreuil:`His daughter is Madame Dubreuil, of Saint-Malo, and keeps bees. The county has almost forgiven it.`,
    free:F('kittyBotanist') ? `His daughter is unmarried, and has an orchid named for her in Sowerby’s Botany, which is more than can be said for the Miss Tamworths.` : `His daughter is unmarried and lives at home. She is thirty-eight. She is very good with the dogs.`};
  P.push(kl[k]);
  if (F('edmundDead')) P.push(`His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur} of the 52nd, lies in the orchard of a farm in Brabant, with a great many others. There is a tablet in Hatherley church. His mother has had the pew moved so as to face it.`);
  else if (e === 'army') P.push(`His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur}, ${S.flags.edmundFate || 'served through the Peninsula'}, and is home, on half-pay, teaching the Volunteers’ old serjeant how the thing is really done.`);
  else if (e === 'navy') P.push(`His son commands a sloop of war, at present laid up, there being nobody left to fight, and is ashore at Hatherley walking the terrace eight paces each way from habit.`);
  else if (e === 'church') P.push(F('edmundVicar') ? `His son is vicar of the parish, and preaches short.` : `His son is in orders, in Hampshire, and writes on Sundays.`);
  else if (e === 'farmer') P.push(`His son farms Kennet Bottom better than it has ever been farmed, and has given him three grandchildren, one of whom bites.`);
  else if (e === 'militia') P.push(`His son came home from the Militia a captain, with a straight back and an Irish wife.`);
  else P.push(`His son is at home still. He is forty, and manages everything, and is waiting.`);
  if (F('oaks')) P.push(`He planted forty acres of oak on Gallows Piece for the Royal Navy. It will be ready when the Navy, by all appearances, has gone over to iron.`);
  if (F('soldLiving')) P.push(`He sold the living of Hatherley to a wine merchant, and the Bishop has not dined with him since.`);
  if (F('vaccinated')) P.push(`There has been no smallpox in the parish these ten years, since he sat on a kitchen chair on the green and had his arm scratched before them all.`);
  if (F('soup')) P.push(`The old people still judge every soup they are given against the soup of 1800.`);
  if (F('hoarder')) P.push(`It is remembered in the cottages that his wheat left the parish in three wagons, in the dearth, in daylight.`);
  if (S.chars.pryor.r >= 3) P.push(`Jem Pryor, who has taken game off the estate for thirty years, has let it be known that anyone else who tries it will answer to him.`);
  else if (S.chars.pryor.r <= -3) P.push(`Jem Pryor has not been seen in the parish lately. Neither have a good many of the pheasants.`);
  if (F('cornFor')) P.push(`He put his name to the Corn Bill, and the loaf is dear.`);
  if (F('cornAgainst')) P.push(`He set his name against the Corn Bill, almost alone among the landed gentlemen of the county, and has been “the Loaf” at Cullerne Castle ever since.`);

  let score = Math.round(S.standing * 0.25 + S.goodwill * 0.4 + S.family * 0.35 + clamp(net / 400, -12, 12));
  score = clamp(score, 0, 100);
  let title = 'A Tolerable Squire';
  if (S.goodwill >= 68 && S.family >= 55) title = 'The Good Squire of Hatherley';
  else if (net > 8000 && S.goodwill < 36) title = 'The Rack-Renter';
  else if (S.standing >= 72 && S.goodwill < 50) title = 'A Coming Man';
  else if (S.goodwill < 30) title = 'The Man in the Song';
  else if (S.family < 30) title = 'Master of an Empty House';
  else if (S.goodwill >= 60) title = 'A Fair Man';
  P.push(`He is ${S.year - 1795 + 46}, and in tolerable health. He has been heard to say that the next twenty years cannot possibly be as troublesome as the last. We wish him joy of the opinion.`);
  return {title, P, score};
}

/* ---------- saving ---------- */
function save(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (err) {} }
function load(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.chars && s.phase) { if (!s.works) { s.works = s.project ? [s.project] : []; delete s.project; } return s; } } catch (err) {} return null; }
function wipe(){ try { localStorage.removeItem(SAVE_KEY); } catch (err) {} S = null; render(); }

/* The engine: seasons, ledger, undertakings, and the reckoning. */
let S = null;
const SAVE_KEY = 'hatherley-combe-save-v1', SAVE_BACKUP = 'hatherley-combe-save-before', SAVE_VERSION = 2;   // the key keeps its old name so that estates begun on earlier builds are found

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
  if (F('edmundDead')) return S.flags.edmundRoleDead || 'Killed at Waterloo, June 1815';
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
  enclosure:{ fx:["+ Church Farm worth a third more to let", "+ The common, to fence into a farm", "+ Standing", "− Goodwill, hard"], effects:`Church Farm is worth a third more to let. The common can then be fenced into a new farm. Tithe ends. Goodwill falls hard, less so if the cottagers have allotments.`, name:'The Hatherley Inclosure Bill', line:'Parliament divides the open fields and the common among the owners. Each takes his share and hedges it.', seasons:3, cost:() => F('allotments') ? 1400 : 1200, if:() => S.year >= 1797,
    blurb:`A private Act of Parliament, a surveyor and three commissioners.`, gain:'Church Farm worth a third more; the common allotted to you',
    done:() => { fl('enclosed'); add({goodwill: F('allotments') ? -6 : -16, standing:3}); if (!F('allotments')) reg('pryor',-2,'Lost his cow-gate when the common was enclosed'); later('commonRiot', 1);
      return F('allotments') ? `The Hatherley Inclosure Act having had the Royal Assent, the three Commissioners sit in the vestry, with the surveyor’s map pinned to the table; and their clerk reads the award to as many of the parish as the room will hold.

“To ${S.name}, Esquire, four hundred acres. To the Right Honourable the Earl of Cullerne, one hundred and ninety. To the Vicar, in lieu of all tithes, one hundred and ten. To the cottagers, sixty plots of one acre each.”

He rolls up the map; and the common, which was green upon the old one, is upon this ruled into parcels, and numbered.` : `The Hatherley Inclosure Act has the Royal Assent, with those of forty other parishes in the same session; so that the Commissioners, who sit in the vestry with the surveyor’s map pinned to the table, have the business by heart, and their clerk reads the award without once looking at it.

“To ${S.name}, Esquire, four hundred acres. To the Right Honourable the Earl of Cullerne, one hundred and ninety. To the Vicar, in lieu of all tithes, one hundred and ten. To nineteen persons claiming by custom, who have produced no deed, nothing.”

Jem Pryor stands up at the back, with his hat in his hand, and says that there has been a cow of his name upon that common since Queen Anne.

“Have you that in writing?” says the clerk.`; }},
  drain:{ fx:["+ Kennet Bottom up to fair order", "+ About a sixth more rent"], effects:`Kennet Bottom comes up from neglected to fair order: worth about a sixth more to let.`, name:'Drain and marl the clay at Kennet Bottom', line:'Trenches cut a yard deep across the low fields carry the water to the brook. Marl from the pit is spread after.', seasons:2, cost:() => F('hartoppFriend') ? 420 : 520,
    blurb:`Nine miles of stone drains under the low fields. They stand in water from November to May.`, gain:'Kennet Bottom in fair order',
    done:() => { return `The last trench is filled at Kennet Bottom, where there are now nine miles of drain under the low fields, laid with stone, and with blackthorn over the stone; and the water, which stood upon that clay from November to May, runs out into the brook at the bottom of every field.

You walk the ground from end to end in February, behind ${steward()}; and you come home in both your boots.`; }},
  fourcourse:{ fx:["+ Home farm wheat", "+ Every farm worth a little more"], effects:`Home farm wheat up by about a sixteenth. Every farm worth a fortieth more to let.`, name:'Put the home farm under the Norfolk four-course', line:'A rotation of crops from Mr Coke’s county. The sheep are folded on the turnips and dung the ground for barley.', seasons:1, cost:() => F('hartoppFriend') ? 200 : 260,
    blurb:`Wheat, turnips, barley, clover. No field lies fallow.`, gain:'Yields and rents up',
    done:() => { S.improve += 1; reg('hartopp',1); return `The home farm is laid out in four shifts, of wheat, turnips, barley and clover, each to follow the other round; and as the sheep are to be folded upon the turnips, and to dung the ground for the barley, there is this year, for the first time since the fields had names, no fallow.

The old carter is found at the gate of Twelve Acres, looking over it at the turnips.

“That ground ent had a rest since Lady Day twelvemonth, sir.”

He shuts the gate, though it was shut already, and goes back to his horses.`; }},
  mill:{ fx:["+ Kennet Bottom worth a sixteenth more", "+ Goodwill"], effects:`Kennet Bottom worth a sixteenth more to let. Goodwill rises.`, name:'Rebuild Hatherley Mill with an iron wheel', line:'The corn mill on the Kennet grinds for the whole parish. Its elm wheel comes out and a cast one goes in.', seasons:2, cost:() => 420,
    blurb:`The present wheel is of elm. Your grandfather’s father put it in.`, gain:'Kennet Bottom worth more; the parish pleased',
    done:() => { fl('newMill'); add({goodwill:3}); return `The new wheel is turning at Hatherley Mill: of cast iron, from the foundry at Reading, eighteen feet across, and painted red; and it grinds before noon what the elm wheel, which your grandfather’s father put in, ground between light and dark.

Pocock the miller walks twice round it with his hands behind him, and stops where the water comes off the buckets.

“Her’ll never last,” he says.`; }},
  cottages:{ fx:["+ Goodwill, a good deal"], effects:`Goodwill rises a good deal.`, name:'Build six brick cottages on the Kintbury lane', line:'Six dwellings of brick and tile for labouring families, each with a garden. The old ones are pulled down.', seasons:2, cost:() => 360,
    blurb:`Six on the lane are past mending. The ivy holds up two of them.`, gain:'Goodwill',
    done:() => { fl('cottages'); add({goodwill:9}); return `Six cottages stand finished upon the Kintbury lane, of brick, under tile, with two bedrooms, a bread oven and a pigsty to each; and upon the Saturday the six families who are to have them are let in, to walk through.

Nobody speaks. The men put the flat of their hands against the walls, as they would to a horse; and one woman, who has got as far as the foot of the stairs, stops there with her youngest upon her arm.

“Is the upstairs ours and all, sir?”`; }},
  school:{ fx:["+ Goodwill", "− Dr Gall"], effects:`Goodwill rises. Dr Gall cools.`, name:'Endow a dame school in the old tithe barn', line:'A woman of the parish teaches the labourers’ children their letters. You find the room, the slates and her wages.', seasons:1, cost:() => 160,
    blurb:`Letters, the catechism and plain sewing for forty children.`, gain:'Goodwill',
    done:() => { fl('school'); add({goodwill:6}); if (!F('gallDead')) reg('gall',-1); return `The school is opened in the old tithe barn, with forty children upon the forms, twenty slates between them, and Hannah Gurney’s niece to teach letters, the catechism and knitting.

“Reading will only make them discontented,” says ${F('gallDead') ? 'old Dewey' : 'Dr Gall'}.

Upon the Friday a word of six letters is found chalked on ${F('gallDead') ? 'his yard gate' : 'the vicarage gate'}, in a round hand, and correctly spelt.`; }},
  road:{ fx:["+ Goodwill", "+ Standing"], effects:`Goodwill and standing both rise.`, name:'Mend the Kintbury road, and the bridge with it', line:'Two miles of parish road to Kintbury are dug out and laid with broken flint. The bridge is rebuilt in brick.', seasons:1, cost:() => 240,
    blurb:`Last winter it took two carts and the curate’s pony. The parish has been bound to mend it since Queen Anne.`, gain:'Goodwill and standing',
    done:() => { fl('road'); add({goodwill:3, standing:3}); return `The Kintbury road is made: two miles of it, with the flints broken small, rammed, and cambered to a ditch upon either side; and the bridge, off which the curate’s pony went last winter, has a parapet of brick.

The carrier, who used to come when he could, calls upon Tuesdays and Fridays; and a post-chaise has gone through Hatherley at a trot, with every child in the street running after it as far as the bridge.`; }},
  front:{ fx:["+ Standing, a good deal", "+ Henrietta", "+ Household"], effects:`Standing rises a good deal. Henrietta and the household pleased.`, name:'New-front the Hall in Bath stone', line:'Masons face the park side of the Hall in cut stone, over the old red brick. The sash windows stay where they are.', seasons:3, cost:() => 900,
    blurb:`A portico, a pediment and six columns across the park front.`, gain:'Standing; Henrietta',
    done:() => { fl('newFront'); add({standing:9, family:4}); reg('henrietta',2,'You gave the Hall a front she could ask people to'); return `The scaffolding is struck; and the Hall, which had nothing to show the park but red brick and a row of sashes, shows it a front of Bath stone, with six Ionic columns, and a pediment in which your arms are cut a yard high. Behind the pediment the old chimneys smoke as they did.

Henrietta has the Tamworths to dinner upon the Thursday, and receives them on the steps.`; }},
  pinery:{ fx:["+ Standing", "+ Household"], effects:`Standing rises. The household pleased.`, name:'Build a pinery and raise pine-apples', line:'A heated glass house in the kitchen garden for growing pine-apples. The fruit goes to table at your own dinners.', seasons:1, cost:() => 200,
    blurb:`A glass house, a pit of tanner’s bark and a Scotch gardener. A pine-apple takes two years.`, gain:'Standing; the household',
    done:() => { fl('pinery'); add({standing:4, family:2}); return `The first pine-apple is cut, having had to itself two years, forty loads of tanner’s bark, and a Scotchman.

As nobody at Hatherley can be brought to put a knife into it, it stands in the middle of the table through eleven dinners; and upon the morning after the eleventh the Lovedays send their man over, with a basket and a note, to borrow it.`; }},
  oaks:{ fx:["+ Standing"], effects:`Standing rises a little.`, name:'Plant forty acres of oak for the Navy', line:'Acorns are set in rows on Gallows Piece and fenced against rabbits. The King’s dockyards buy such timber when it is grown.', seasons:1, cost:() => 120,
    blurb:`A seventy-four takes two thousand grown oaks.`, gain:'Standing; posterity',
    done:() => { fl('oaks'); add({standing:2}); return `Forty acres of Gallows Piece are dibbled with acorns, in rows, and fenced against the rabbits; and the nurseryman from Newbury, standing in the middle of them with his bill in his hand, gives it as his opinion that they will be fit for the King’s yards in a hundred and twenty years.

You ask him to say it again, and he says it again.

You ride home at a walk.`; }},
  icehouse:{ fx:["+ Household", "+ Henrietta"], effects:`The household pleased. Henrietta warms.`, name:'Sink an ice-house in the north shrubbery', line:'A deep brick chamber roofed with earth. Ice cut in winter lies there in straw until the cook wants it in August.', seasons:1, cost:() => 140,
    blurb:`A brick egg under ground, filled from the carp pond in a hard frost.`, gain:'The household',
    done:() => { fl('icehouse'); add({family:5}); reg('henrietta',1); return `The ice-house is sunk in the north shrubbery, a brick egg under a mound of earth, with its door to the north; and the men have orders to fill it from the carp pond upon the first morning that the ice will bear a barrow.

Henrietta, who has written to Gunter’s in Berkeley Square for a receipt for lemon ice, has asked the Tamworths for August.`; }}
};
const projCost = id => Math.round(PROJECTS[id].cost() * (T('bred') ? 0.85 : 1) / 10) * 10;
function startProject(id){ const p = PROJECTS[id]; S.works.push({id, left:p.seasons, per:Math.round(projCost(id) / p.seasons)}); S.projectsDone[id] = 'begun'; }
/* What the page needs to know about works. */
function worksInHand(){ return S.works.map(w => ({id:w.id, name:PROJECTS[w.id].name, left:w.left, per:w.per})); }
function worksDone(){ return Object.keys(PROJECTS).filter(id => S.projectsDone[id] === 'done').map(id => ({id, name:PROJECTS[id].name})); }
function worksList(){ const busy = S.works.filter(w => !PROJECTS[w.id].hidden).length;
  return Object.keys(PROJECTS).filter(id => (!PROJECTS[id].hidden || S.projectsDone[id]) && (S.projectsDone[id] || soldWhy(PROJECTS[id]) || !PROJECTS[id].if || PROJECTS[id].if())).map(id => { const p = PROJECTS[id], cost = projCost(id), per = Math.round(cost / p.seasons);
    const state = S.projectsDone[id] === 'done' ? 'done' : S.projectsDone[id] === 'begun' ? 'inHand' : 'open'; const w = S.works.find(x => x.id === id);
    const off = state === 'open' && !!soldWhy(p); let why = '';
    if (state === 'open') { if (off) why = soldWhy(p);
      else if (S.phase === 'end' || S.dead) why = 'The books are closed.';
      else if (busy >= MAX_WORKS) why = 'Two works in hand already. There is one estate carpenter, and he is on both.';
      else if (S.money < per) why = 'The purse will not stand the first instalment of ' + fmt(per) + '.'; }
    return {id, name:p.name, blurb:p.blurb, line:p.line, gain:p.gain, effects:p.effects || p.gain, fx:typeof p.fx === 'function' ? p.fx() : p.fx, cost, seasons:p.seasons, per,
      note:fmt(cost) + (p.seasons > 1 ? ', in ' + p.seasons + ' quarterly instalments' : ''), state, off, left:w ? w.left : 0, can:state === 'open' && !why, why}; }); }
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
  if (q === 2) { const qtrs = Math.round(140 * WEATHER[y] * (1 + 0.06 * S.improve) * (1 + houseOf('labour').wheat)); const v = qtrs * P / 20; line('Home farm wheat, ' + qtrs + ' qrs at ' + P + 's.', v); S.yearIncome += v; }
  if (S.canal && y >= 1810) { line('Kennet & Avon dividend', 7 * S.canal); }
  householdQuarter(line); homeFarmCosts(line);
  if (typeof castleQuarter === 'function') castleQuarter(line);
  if (S.mortgage > 0) line('Interest on the mortgage', -S.mortgage * (F('cheapCredit') ? 0.04 : 0.05) / 4);
  if (F('skrine')) line('Miss Skrine’s sixth per cent', -5);
  if (F('pompey') && q === 0 && y <= 1799) S.notes.push('Mr Stroud of Bath has viewed the pug Pompey and found him alive.');
  if (F('wages')) line('Home farm wages above the common rate', -30);
  if (F('crabbeSkims') && !F('crabbeGone') && !T('figures')) line('“Sundries” (Mr Crabbe)', -45);
  if (F('mp') && q === 0) line('Lodgings in Half Moon Street for the session', -160);
  if (F('kittyAllowance') && q === 0) line('Mrs Vane, her allowance', -80);
  for (const w of S.works.slice()) { line(PROJECTS[w.id].name, -w.per); w.left--;
    if (w.left <= 0) { S.works.splice(S.works.indexOf(w), 1); S.projectsDone[w.id] = 'done'; S.notes.push(PROJECTS[w.id].done()); S.journal.unshift({when:stamp(), title:'Works', did:'Finished: ' + PROJECTS[w.id].name}); } }
  if (q === 3) {
    line('Poor rate', -130 * S.poorMult * pi * (F('speen') ? 1.6 : 1));
    line('Land tax', -110);
    if (T('court') && !F('courtLost') && !F('courtSold')) line('Salary as Deputy Keeper of the Swans', 90);
    if (T('play')) line('Losses at whist and hazard', -(70 + Math.floor(Math.random() * 12) * 10));
    if (T('gout') && !F('goutEased')) { add({family:-3}); S.notes.push('The gout has you by the foot from Advent to Candlemas. The household goes on tiptoe. You shout at them for creeping.'); }
    if (y >= 1799 && y !== 1802) { const rate = y <= 1801 ? 0.1 : y <= 1805 ? 0.05 : 0.1; line('Income tax at ' + (rate * 100) + ' per cent', -S.yearIncome * rate * (F('taxDodge') ? 0.5 : 1)); }
  }
  if (S.money < 0) { line('Interest on tradesmen’s bills and notes of hand', S.money * 0.03); add({standing:-1}); S.notes.push('You are living on credit. Wyvern has noticed.'); }
  // Nothing keeps without tending: regard, like a hedge, grows out.
  if (S.t > 0) { const dear = P >= 95 && !F('soup') && !F('wages') && house('labour') !== 'high';
    regardQuarter(line);
    if (dear && q === 3) S.notes.push('Bread at famine price. The parish looks at the Hall, and counts its chimneys.'); }
  S.ledger = L;
  S.news = NEWS[y + '-' + q] || null;
  creditCheck();
  S.pending = pickEvent();
  S.vignette = S.pending ? null : vignette(q);
  S.phase = 'ledger';
  save();
}

const FIXED = {};
function indexEvents(){ for (const e of EVENTS){ if (e.fixed) for (const k of [].concat(e.fixed)) (FIXED[k] = FIXED[k] || []).push(e); } }
const lab = c => typeof c.t === 'function' ? c.t() : c.t;
const byId = id => EVENTS.find(e => e.id === id);

/* While Henrietta is at Bath, a wandering paper that has her in it at the Hall is not drawn. The test reads the
   event's own source, so new papers need no marking. Letters from Gay Street are exempt. */
const HEN = /Henrietta/;
function atHall(e){ if (e.hen === undefined) e.hen = e.id !== 'gayStreet' && (e.id === 'henrietta' || e.id === 'bath' || HEN.test(String(Object.getOwnPropertyDescriptor(e, 'text').value || '') + e.choices.map(c => String(c.go)).join('')));
  return e.hen; }
function pieceAtHall(p){ if (p.hen === undefined) p.hen = HEN.test(String(p.x) + ['a', 'b', 'c'].map(k => String(p[k] || '')).join('') + (p.o || []).map(c => String(c.go)).join('')); return p.hen; }
function pickEvent(){
  // A dated event keeps its date. Anything queued for the same season waits one.
  const dated = (FIXED[S.year + '-' + S.season] || []).find(e => !e.cond || e.cond());
  if (dated) { S.queue.forEach(x => { if (x.at <= S.t) x.at = S.t + 1; }); return dated.id; }
  const due = S.queue.filter(x => x.at <= S.t);
  for (const d of due){ S.queue.splice(S.queue.indexOf(d), 1); const e = byId(d.id); if (e && (!e.cond || e.cond())) { S.queue.forEach(x => { if (x.at <= S.t) x.at = S.t + 1; }); return e.id; } }
  const fx = FIXED[S.year + '-' + S.season];
  if (fx) for (const e of fx) if (!e.cond || e.cond()) return e.id;
  if (!chance(0.8)) return null;
  const away = F('henriettaAway');
  const pool = EVENTS.filter(e => !e.fixed && !e.follow && !(away && atHall(e)) && S.year >= (e.from || 0) && S.year <= (e.to || 9999)
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

/* What a season's undertaking returns. Each outcome has a stable id (a woodcut may be hung on it at art/undertakings/<id>),
   an optional test w() for when it can happen, and its text x(). Nothing here changes a sum: the undertaking pays the same whichever is drawn.
   Written in the Hatherley hand (docs/voice/VOICE.md). */
const tenantOf = id => { const f = S.farms && S.farms.find(x => x.id === id); return f && !f.void ? f : null; };
const called = f => /^Widow/.test(f.tenant) ? 'the ' + f.tenant : f.tenant;
const Called = f => /^Widow/.test(f.tenant) ? 'The ' + f.tenant : f.tenant;
const sheHe = f => f.she ? 'She' : 'He';
// The Thornes hold Long Barrow of the squire: not sold, not let over their heads, not broken.
const thorneHolds = () => { const f = tenantOf('longbarrow'); return !!f && /Thorne$/.test(f.tenant); };
// Where the parish gathers: the common while it lies open, the green once it is inclosed.
const ground = () => F('enclosed') ? 'the green' : 'the common';
const keepsCarriage = () => estIdx() > 0;
const nth = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const let1 = test => (S.farms || []).find(f => !f.void && test(f));
const wheatNow = () => PRICES[S.year] || 76;
const dear = () => wheatNow() >= 100, cheap = () => wheatNow() < 60;
const kittyHome = () => (S.flags.kitty || 'free') === 'free';
const edmundAt = () => F('edmundDead') ? 'dead' : (S.flags.edmund || 'home');
const crewAboard = () => T('captain') && !F('crewGone');
const gouty = () => T('gout') && !F('goutEased');
const swans = () => T('court') && !F('courtLost') && !F('courtSold');

const OUTCOMES = {
  fishing:[
    {id:'fishing-club', x:() => `Six tradesmen of Reading, who dine together once a month as the Friends of the Angle, give ten pounds a rod for the water between the mill tail and Kennet bridge; and Mudge, by the terms of the paper, nails up a board at either end of it.

They come out upon the Saturday in two gigs, with a ham, and a boy to carry the landing net; and by evening they have killed fourteen trout, the largest of two pounds, and have turned off the bank the miller’s two sons, who have fished the mill tail since they could stand.

On Sunday morning the board at the bridge is found in the river.`},
    {id:'fishing-attorney', x:() => `A gentleman of Lincoln’s Inn takes the water for May and June at sixty pounds, puts up at the George, and is upon the bank each morning by six, in a coat of nine pockets, with a fly of his own tying.

On the fourth day he finds that he is not alone there; and as you are the nearest magistrate, and it is your river, he brings into the justice room, before you have breakfasted, a boy of nine, and one dace upon a hazel twig.

“I ask only for the law, sir.”

The Act lies open upon the table. You fine the boy a shilling; and his mother, who has waited in the yard, pays it in halfpence.`}],
  grazing:[
    {id:'grazing-bullocks', x:() => `For seventy pounds, paid down in Reading notes, a butcher of that town has the grass of the park until Michaelmas; and upon the Monday he turns into it sixty Welsh bullocks, which have walked from Brecon, and which discover, by Wednesday, the one place in the sunk fence where a bullock may get up.

Henrietta receives her morning callers in the breakfast parlour, upon the north side of the house.

“We are grown quite a Smithfield,” she tells Mrs Loveday; and at noon she has the drawing-room blinds drawn down.`},
    {id:'grazing-horses', x:() => `A dealer of Reading, who buys for the cavalry, has seventy young horses to summer before they are fit to be shown to a colonel; and as he gives a pound a head for the park, and pays it before a hoof is through the gate, the bargain is struck in the stable yard in a quarter of an hour.

They bark four of the limes your uncle planted. Upon the Thursday, the gate of the drying ground having been left open by somebody whom nobody will name, they are found among the week’s wash; from which Mrs Bunce recovers eleven of the twelve damask napkins.`}],
  shooting:[
    {id:'shooting-deputation', x:() => `Mr Sheldrake, a wine merchant of Mark Lane, gives a hundred pounds for the season’s shooting; and as the law allows no man to kill a pheasant who has not a hundred a year in land, you sign a deputation, by which he becomes, for the purposes of the Act, your gamekeeper.

He comes down by the Bath coach with two friends, a hamper, and a gun in a green baize bag; and on the first of October, between Hanger Wood and the turnpike, in yellow gaiters, the three of them kill nine brace.

“That fellow in the gaiters,” says Lord Cullerne, at Wyvern market. “Whose is he?”

“He has taken my shooting, my lord.”

“Taken it. Has he.”

His card for the battue does not come.`},
    {id:'shooting-post', x:() => `The Morning Post has it upon the Tuesday, between a cure for the scurvy and a pair of carriage horses:

“TO BE LET, for the Season, the SHOOTING over a Gentleman’s Estate in Berkshire, of Two Thousand Acres, well stocked with Pheasants and Hares; Fifty-eight Miles from Hyde Park Corner. Apply to Mr Skinner, at the George, Wyvern. None but Principals will be treated with.”

It is taken within the week, at a hundred pounds, by two brothers in the Russia trade. But every gentleman within ten miles takes in the Morning Post, and can reckon fifty-eight miles from Hyde Park Corner as well as another; so that at the Sessions dinner you are asked by four persons, one after the other, whether the house goes with it.`}],
  underwood:[
    {id:'underwood-hurdles', x:() => `Eleven acres of hazel in Cuckoo Copse, being of twelve years’ growth, are sold standing to a hurdle-maker of Hungerford for eighty pounds; and he brings six men, who cut it to the stool, and tie up everything thicker than a finger.

The women of the lane have had their firing out of that copse by leave of three squires. They come upon the Monday with their aprons, and find it in faggots, counted, and marked with raddle; and the hurdle-maker’s price, which he tells them very civilly, is four shillings the hundred.`},
    {id:'underwood-poles', x:() => `The ash poles under the oaks in Hanger Wood go to a hop-planter from Farnham, at eighty pounds for the fall; and he sends for them, in the first week of a wet December, three waggons of four horses each.

They go out by the Kintbury lane, loaded, nine times in the fortnight. When they have done, the lane is such that Mudge leads his pony along the top of the bank; and the Kintbury carrier, having looked at it from his seat, sets down the parish’s parcels a mile and a half off, at the turnpike.`}],
  ride:[
    {id:'ride-cider', x:() => `You ride round the tenancies in a day and a half, and are given cider, and then perry, and a cold pie, and cider again. At the last farm the tenant lifts your horse’s off fore, and tells you what he would do; and at the mill you are given a dog.`},
    {id:'ride-thatch', w:() => tenantOf('kennet') && tenantOf('kennet').tenant === 'Widow Harris', x:() => `At Kennet Bottom the Widow Harris takes you up her stairs, to show you the hole in the thatch; and while you stand under it, it comes on to rain.

“I will send the thatcher, Mrs Harris.”

“So the old Squire said, sir.”`},
    {id:'ride-names', x:() => `It is a wet week in the saddle, in the course of which you learn the children’s names at every farm; and by Friday you have thirty-one, three of the boys having been christened Barnaby.`},
    {id:'ride-gates', w:() => tenantOf('church'), x:() => { const f = tenantOf('church'), he = f.she ? 'she' : 'he'; return `You walk the bounds of Church Farm with ${called(f)}; and as the custom of the estate lays the gates and gate-posts upon the landlord, and the hedges and ditches upon the tenant, ${he} stops at every gate that hangs by one hinge, and waits until you have looked at it.

“Your gate, sir.”

There are five of them. Between the third and the fourth the quickset has been cut and laid the whole length of the lane, with every pleacher bound down to its stake; and here ${he} does not stop, but walks a little slower.

“My hedges,” ${he} says.

You tell ${steward()} to send the carpenter upon Monday, with oak for five gates; and at the last of them ${called(f)} holds it open for you, lifting it by the top bar.`; }},
    {id:'ride-lambing', w:() => S.season === 0 && tenantOf('longbarrow'), x:() => `It is lambing at Long Barrow, where the shepherd has not been to bed since Tuesday; and you hold the lantern for an hour in the fold, while there come twins, and then a single, and then a dead one.

The shepherd skins the dead lamb, and ties the skin upon an orphan, and puts it to the ewe; who smells it twice, and lets it suck.`},
    {id:'ride-rooks', w:() => S.season === 0 && tenantOf('church'), x:() => `It is barley sowing, when there is a boy in every field with a wooden clapper, at twopence a day, to keep the rooks off.

At Church Farm the boy is seven, and is asleep under the hedge, with the clapper in his hand, while the rooks walk the drills behind the sower.

You wake him with your whip handle, and do not tell the farmer.`},
    {id:'ride-hay', w:() => S.season === 1, x:() => `It is hay week. You ride into Kennet Meadow at noon, and the mowers stop, and look at you.

You get down, and take a rake, and rake for an hour; and though by two your hands are blistered, nobody remarks upon it.

But at four, when the beer comes round, it comes to you before the foreman.`},
    {id:'ride-shearing', w:() => S.season === 1 && tenantOf('longbarrow'), x:() => `It is shearing at Long Barrow, with six men upon the barn floor, of whom a good one clips forty in a day.

You are handed the shears. Your ewe takes eleven minutes, and goes out with a ruff round her neck, and one bare leg.

The catcher brings you another; and you give him back the shears.`},
    {id:'ride-harvest', w:() => S.season === 2 && tenantOf('church'), x:() => { const f = tenantOf('church'); return `It is harvest week. Church Farm has forty acres standing, and the glass falling; and ${called(f)} has every hand out, the carter’s wife binding, and the curate’s boy.

You send four men over from the home farm for three days.

“What do I owe for them, sir?”

“Nothing.”

${sheHe(f)} writes it in the book all the same.`; }},
    {id:'ride-michaelmas', w:() => S.season === 2, x:() => `It is Michaelmas, and you ride the farms the week before the rent; at each of which you are shown something that has gone wrong, a lame horse, or a blighted piece of beans, or a roof.

At the third farm you are shown the same lame horse, it having been led across the fields while you dined.`},
    {id:'ride-frost', w:() => S.season === 3, x:() => { const f = let1(() => true); return `There is a hard frost, and the lanes ring. You ride to ${f ? f.name : 'the far farm'} to look at the ditches.

There is a fire in the kitchen, and elder wine in a mug; and one pane of the window being mended with a page of the Reading Mercury, you read the price of wheat upon it.

It is the price of four years ago.`; }},
    {id:'ride-threshing', w:() => S.season === 3 && !F('thresher') && tenantOf('church'), x:() => `You stop at every barn, where there are two men to a floor, stroke and stroke, and the chaff hanging in the doorway.

At Church Farm the taller man, when you come in, misses his time; and the flail takes the other upon the knuckles.

He says a word. Then he says “sir”.`},
    {id:'ride-dear', w:() => dear() && tenantOf('church'), x:() => `Wheat is at ${wheatNow()} shillings. At Church Farm there is a new gig in the cart shed, and in the parlour a piano-forte, which came from Reading on Tuesday.

At the cottages by the pound the children are eating barley bannock; and one of them holds his up, to show you.

You ride home between the two.`},
    {id:'ride-cheap', w:() => cheap(), x:() => `Wheat is at ${wheatNow()} shillings; and every tenant meets you at his gate, with his hat in his hand, and a slate ready, upon which are the rent, and the tithe, and the poor rate, and the total chalked large at the foot.

You are shown four slates in one morning. The sums differ, but the handwriting is the same.`},
    {id:'ride-arrears', w:() => let1(f => f.arrears >= 1), x:() => { const f = let1(x => x.arrears >= 1); return `The rent is behind at ${f.name}; and you ride into the yard at ten.

${Called(f)} is ${f.she ? 'in the dairy with the door shut' : 'on the barn roof with a bundle of straw'}. ${sheHe(f)} does not come ${f.she ? 'out' : 'down'}; and you speak of the rent for ten minutes to ${f.she ? 'a door' : 'a pair of boots'}.

A girl brings you plum cake upon a plate, and you eat it on your horse.`; }},
    {id:'ride-neglect', w:() => let1(f => f.cond <= 1), x:() => { const f = let1(x => x.cond <= 1); return `At ${f.name} the barn door hangs by one hinge, and the nettles in the rickyard reach your stirrup, and under the elm there is a wagon without a wheel.

${Called(f)} follows your eye round the yard.

“It was so when I came, sir.”`; }},
    {id:'ride-highorder', w:() => let1(f => f.cond >= 3), x:() => { const f = let1(x => x.cond >= 3); return `${f.name} is in high order, with the yard swept, and the hedges laid, and the dung in a square heap.

${Called(f)} walks you over ninety acres of turnips in drills, and does not let you off one field; so that you are two hours late for dinner, and Henrietta has dined.`; }},
    {id:'ride-quickset', w:() => F('enclosed'), x:() => `You ride the new inclosures upon the old common, where the quickset is knee high, and planted by line, and the surveyor’s pegs are still in the ground.

At the far corner an old woman is cutting furze, as she has cut it there forty years.

You ride by on the other side of the hedge.`},
    {id:'ride-geese', w:() => !F('enclosed'), x:() => `You cross the common, among forty cows, a donkey, and Jem Pryor’s geese.

The geese stand in the road; and the gander coming at your horse with his neck out, you go round by the pond.`},
    {id:'ride-gout', w:() => gouty(), x:() => `You cannot get a boot on, and go round the farms in the gig, with the foot upon a cushion.

At each gate the tenant comes out to the wheel, and looks at the foot, and tells you what cured his father.

Goose grease. A split pigeon, laid on warm. Bath.`},
    {id:'ride-coxswain', w:() => crewAboard() && tenantOf('church'), x:() => { const f = tenantOf('church'); return `Tarbuck rides behind you upon the cob, never having sat a horse before this year.

At Church Farm he looks over the rickyard.

“Them stacks is stowed all anyhow, sir.”

${Called(f)} asks what your man said; and you say that he admired the ricks.`; }},
    {id:'ride-barley', w:() => T('stranger') && S.season === 1 && tenantOf('church'), x:() => `There is a field in ear at Church Farm.

“A fine piece of wheat,” you say.

“Barley, sir.”

“Fine barley.”

The carter walks round to the far side of his wagon, where his shoulders shake.`},
    {id:'ride-ewes', w:() => T('bred'), x:() => `At the sheep pens you open a ewe’s mouth.

“Full-mouthed. Who sold her to you as a two-tooth?”

The tenant names a dealer at Ilsley fair. You look at six more, and find that nine in the score are old ewes.

He walks beside your horse to the gate, and asks what you think of his barley.`},
    {id:'ride-pond', w:() => T('beloved'), x:() => `At the mill the miller’s mother is upon the bench by the door, who is past eighty.

“I mind you in that pond,” she says. “You went in after a moorhen’s nest. Your uncle’s man had you out by the breeches.”

The miller’s children are listening; and so is the miller.`},
    {id:'ride-cottages', w:() => F('cottages'), x:() => `You stop at the new cottages upon the Kintbury lane, every one of which has a pig, and four have beans up the wall.

At the end house a woman is scrubbing the step, though it is white already; and she scrubs it while you sit there, and is scrubbing it still when you look back from the turn.`},
    {id:'ride-house', w:() => F('workhouse'), x:() => `You ride by the House of Industry, where an old man, breaking flints in the yard, takes off his hat.

You know him. He was carter at Church Farm thirty years.

You touch your own hat, not having meant to.`},
    {id:'ride-school', w:() => F('school'), x:() => `You look in at the school in the tithe barn, and forty children stand up.

The mistress has the biggest boy read to you; who reads the Tenth Commandment with his finger under the words, and gets as far as the ox.

“Nor his ass,” says a girl of six, from the back.`},
    {id:'ride-edmund', w:() => edmundAt() === 'farmer', x:() => `You ride to Edmund’s last, and find him in the yard in his shirt, drenching a cow.

“Hold her head, sir.”

You hold her head, and the cow treads upon your foot.

Sophia brings out beer for two.`}
  ],
  dine:[
    {id:'dine-turbot', x:() => `There are three removes, for sixteen; and the Bishop’s chaplain is helped twice to the turbot, and three times to the saddle.

“Your turbot is very brave,” says Lady Cullerne.

At two in the morning you are awake, turning the word over.`},
    {id:'dine-haunch', x:() => `You dine at the Tamworths’, and at the Lovedays’, and at Hartopp’s; and then the county dines with you.

Mrs Bunce sends up a haunch that has hung five weeks, which old Mr Tamworth calls the best he ever ate. The dogs will not come into the room.`},
    {id:'dine-ball', x:() => `You are steward of the ball at the Wyvern Assembly Rooms. Candles, £3 4s. Negus, £2 10s. Three fiddlers at half a guinea.

At eleven old Mrs Loveday sits down upon the first fiddler’s bow. A new bow, 7s. 6d.`},
    {id:'dine-magistrates', x:() => `There is venison, for nine magistrates and a colonel.

At the second bottle the Colonel takes Paris, and at the third the Chairman gets the harvest in; and at the fourth Mr Tamworth walks into the china closet, and wishes the company good night.`},
    {id:'dine-nopastry', w:() => dear(), x:() => `Wheat is at ${wheatNow()} shillings; and you give the county a dinner with no flour in it, having no pies, and no puddings, and rice in place of bread.

Lord Cullerne looks down the table for the tart.

“There is none, my lord. It is the King’s wish.”

He takes a third helping of the goose.`},
    {id:'dine-snow', w:() => S.season === 3, x:() => `It snows from four o’clock. Sixteen sit down; and at eleven the coachmen send in word that the lane is stopped.

Sixteen stay the night, and there are eleven beds.

Mr Loveday has the billiard table, and says at breakfast that he never slept better.`},
    {id:'dine-partridge', w:() => S.season === 2, x:() => `You have forty brace of partridge hanging, and the county dines upon them, in a soup, and roasted, and in a pie.

Old Mr Tamworth finds a shot in his, and lays it upon the edge of his plate; and by the cheese he has eleven in a row.`},
    {id:'dine-wasps', w:() => S.season === 1, x:() => `It being too hot for the dining-room, you dine the county upon the lawn, under an awning, on cold fowls, a salmon, and syllabubs.

With the second course come the wasps.

One walks across Lady Cullerne’s glove; and she does not look at it, but goes on speaking of the Princess of Wales.`},
    {id:'dine-lamb', w:() => S.season === 0, x:() => `It is the first lamb of the year, and the first asparagus, and sixteen sit down.

The asparagus is counted in the kitchen, at a hundred and twelve heads, which is seven apiece.

The Bishop’s chaplain takes fifteen; and Mrs Bunce hears of it before the cloth is drawn.`},
    {id:'dine-walnuts', w:() => S.year >= 1803 && S.year <= 1805 && keepsCarriage(), x:() => `The ladies withdraw, and Colonel Tamworth lays out the invasion upon the cloth.

The walnuts are the French. The salt is Dover. The decanter is Lord Keith.

At midnight the footman clears France into a napkin.`},
    {id:'dine-regrets', w:() => S.chars.cullerne.r <= -2, x:() => `You ask Lord Cullerne for the Tuesday, and his lordship regrets; and you ask him for the Thursday week, and his lordship regrets.

Fourteen sit down, the chair upon Henrietta’s right being filled by the apothecary from Wyvern.

He is very good company. Henrietta does not hear a word he says.`},
    {id:'dine-earl', w:() => S.chars.cullerne.r >= 2 && keepsCarriage(), x:() => `Lord Cullerne takes Henrietta in, and stays until one.

In the hall he says that he has not laughed so much since the Regency Bill; and both footmen hearing him, it is all over Wyvern by breakfast.`},
    {id:'dine-swans', w:() => swans(), x:() => `Somebody asks after the swans.

“There are none at present,” you say.

“Then what does the Deputy Keeper do?” says the Bishop’s chaplain.

“He draws ninety pounds, sir.”

Lord Cullerne laughs first; and then the table may.`},
    {id:'dine-whist', w:() => T('play'), x:() => `There are cards after tea, whist at guinea points.

Your partner is a clergyman’s widow from Hungerford, who trumps your ace twice; and your opponents are her sister, and her sister’s husband.

You lose the price of the dinner over again; and the widow asks when you next dine the county.`},
    {id:'dine-lobscouse', w:() => crewAboard(), x:() => `Pascoe sends up lobscouse for a remove, which nobody ordered.

The Bishop’s chaplain, taking it for a ragoût, is helped twice, and asks for the receipt.

“Salt beef, biscuit, onions,” says Tarbuck, from behind his chair. “And slush, your reverence.”`},
    {id:'dine-ice', w:() => F('icehouse') && S.season === 1, x:() => `It is July, and you give them lemon ice in the blue glasses.

“From Gunter’s?” says Lady Cullerne.

“From the north shrubbery,” says Henrietta; and she tells her how deep it is sunk, and how many loads of straw.`},
    {id:'dine-onefootman', w:() => typeof estIdx === 'function' && estIdx() === 0, x:() => `You dine the county upon a retrenched household, with one man to wait on sixteen; who is also the groom, and has not had time to change his boots.

“An excellent soup,” says Mr Tamworth. “Is there horse in it?”`},
    {id:'dine-pitt', w:() => T('whig') && S.year <= 1805, x:() => `The cloth is drawn, and Colonel Tamworth rises.

“Mr Pitt.”

You lift your glass, and do not drink; and fourteen gentlemen watch it go down full.

Hartopp reaches across, and drinks it for you.`},
    {id:'dine-grace', w:() => !F('gallDead'), x:() => `Dr Gall says grace, in Latin, for four minutes by the hall clock; so that at Amen the soup has a skin upon it.

Dr Gall is helped first.`},
    {id:'dine-guilford', w:() => T('soldier'), x:() => `Over the port a young ensign of the Militia asks whether you were ever in action.

Old Mr Tamworth gets up, and goes to look at a picture, and Mr Loveday follows him.

You begin with the weather upon the morning of the fifteenth of March.`}
  ],
  sessions:[
    {id:'sessions-goose', x:() => `A man has stolen a goose, and you order him whipped; and a woman having stolen it back from him, she has one month.

The goose is brought into court in a hamper, and bites the clerk.`},
    {id:'sessions-three', x:() => `There is a bastardy case from Kintbury, in which the girl names three men; each of whom takes the oath, and swears that it was one of the other two.

You make the order upon all three, at eighteen pence a week between them.`},
    {id:'sessions-bridge', x:() => `You are all day in the Shire Hall over a bridge, which each parish in the hundred swears to belong to the next; and when the surveyor unrolls a map of 1740, the bridge is upon the fold.

The Bench rises at six; and tonight the bridge has no owner.`},
    {id:'sessions-wagon', x:() => `You license eleven alehouses, and refuse the twelfth.

You sign an order removing Ann Giles, pauper, to Andover, the parish of her birth, which is forty miles; and the overseer of Andover, who has written already, says that she was born in a wagon.`},
    {id:'sessions-bread', w:() => dear(), x:() => `The calendar is all bread. A woman took a loaf from a baker’s board in Newbury, and a man a peck of flour at the mill, and a boy pulled turnips.

“What is the quartern loaf today?” says the Chairman.

“One and fivepence, sir.”

He writes it at the head of his paper; and then he calls the first case.`},
    {id:'sessions-snares', w:() => S.season === 3 || S.season === 2, x:() => `There are eleven cases under the Game Laws, one after another, and every gentleman upon the Bench preserves.

The eleventh is a boy with two wires in his hat, to whom Lord Cullerne’s keeper swears; and Lord Cullerne sits upon your left.

Three months.`},
    {id:'sessions-substitute', x:() => `It is a militia day, and forty balloted men come up with their reasons; one being lame, and one having six children, and one a substitute outside, holding his horse.

The substitute has had ten guineas, and you pass him.

“He was passed at Marlborough in March,” says the clerk. “For Wiltshire.”`},
    {id:'sessions-leg', w:() => S.year >= 1798, x:() => `There are passes all morning. A sailor’s wife is walking from Plymouth to Hull, with two children, and a discharged soldier has one eye; and you sign for a penny a mile.

Then there comes a man with a wooden leg, which he lost at Camperdown.

“Which leg did you lose at the Epiphany Sessions?” says the clerk.`},
    {id:'sessions-sweep', x:() => `A parish apprentice, who is nine, has run from a chimney sweeper in Newbury; and the Chairman has him take off his shirt.

The Bench looks at his back, and then at the master.

The indentures are cancelled, and the parish has the boy again, at one and six a week.`},
    {id:'sessions-weights', x:() => `The inspector lays eleven weights upon the table, from a grocer’s in Wyvern, who supplies the Hall.

You take up the pound, and it wants an ounce and a half.

He is fined forty shillings. Henrietta says that she will change her grocer; but there is no other grocer in Wyvern.`},
    {id:'sessions-words', w:() => S.year <= 1801, x:() => `A cobbler of Hungerford is charged with seditious words, having said in the Bear that the King was a German, and Mr Pitt a pump.

Three witnesses heard him, each of whom had first drunk at his cost.

He has one month; for which he thanks the Bench, and says that he will say it lower.`},
    {id:'sessions-rue', w:() => S.season === 1, x:() => `It is Midsummer Sessions. The windows of the Shire Hall will not open, and there was fever in the Bridewell last month; so that the Bench sits with rue and vinegar upon the desk, and the prisoners are brought up two at a time, and kept by the door.

The business is done by one, which was never before done by four.`},
    {id:'sessions-loaf', x:() => `A labourer from Shefford, who has a wife, five children, and six shillings, appeals against his overseer.

“He has the scale,” says the overseer.

The man has brought the loaf, and sets it upon the clerk’s table. It is the week’s bread; and it is Tuesday.`},
    {id:'sessions-rate', w:() => T('silver'), x:() => `The Bench divides upon a new county gaol, nine for, and nine against; and you get up, and speak for ten minutes.

The gaol is carried by three.

“Very handsome,” says the Chairman, in the passage. “Which side had you meant to take?”`},
    {id:'sessions-hassock', w:() => gouty(), x:() => `You sit with the foot upon a hassock, and each prisoner looks at it as he comes up.

Before noon you commit eleven, the clerk never having entered so many in a morning.

At one the foot eases; and the twelfth man is discharged with a caution.`},
    {id:'sessions-horse', w:() => S.season === 0, x:() => `It is Easter Sessions. A dealer has sold a Wyvern farmer a horse warranted sound, which in a fortnight has gone lame upon all four legs.

The horse is walked up and down before the Shire Hall, the whole Bench going out to the steps; where nine magistrates give nine opinions.

The dealer has gone before you come in again.`},
    {id:'sessions-drum', w:() => S.year >= 1803 && S.year <= 1813, x:() => `A recruiting serjeant is charged by a mother, whose son, being fifteen, and drunk, took the shilling at Newbury fair.

The serjeant says that the lad gave his age as eighteen; and the boy says that he cannot remember what he gave.

You send for the parish register. Fifteen. The serjeant has his shilling back.`}
  ],
  home:[
    {id:'home-backgammon', x:() => `You stay at home, and play backgammon with Henrietta every evening; who moves a man with her sleeve when you look at the fire.

You look at the fire a good deal.`},
    {id:'home-alphabet', w:() => !ended('library'), x:() => `It rains all the week; and you read Tom Jones in the library, for the sixth time, while Henrietta nets a purse.

Between rows she tells you what is amiss with the families of Berkshire, taking them by the alphabet; and on Friday she is at the Lovedays.`},
    {id:'home-pocketbook', x:() => `“At home all this Week. Shot nothing, signed nothing, taught the Dogs nothing. Dined each Day upon what there was. Have not passed a better Week since Christmas.”`},
    {id:'home-radcliffe', w:() => kittyHome(), x:() => `Kitty reads Mrs Radcliffe aloud after dinner, and does every voice, the wicked monk having ${F('gallDead') ? 'the late Dr Gall’s' : 'Dr Gall’s'} cough.

Henrietta counts her stitches. Nobody looks up.`},
    {id:'home-brewing', x:() => `“Did not stir beyond the Garden all the Week. Brewed a Hogshead of strong Beer on Tuesday. Bottled off the Gooseberry Wine, 3 Dozen. My Wife beat me at Cribbage five Nights of the six. Paid her 0. 4. 0.”`},
    {id:'home-carpets', w:() => S.season === 0, x:() => `Henrietta has the drawing-room carpet up to be beaten; and then the curtains come down, and then the sweep comes; so that for a week you are moved from room to room with your newspaper.

On Saturday a housemaid finds you in the still-room, and asks if you want anything.`},
    {id:'home-cedar', w:() => S.season === 1, x:() => `It is hot; and the family sits under the cedar with a jug of orgeat, nobody reading.

At four a wasp gets into the jug, and Henrietta sends for another jug.

You enter it in your pocket-book, there being nothing else to enter.`},
    {id:'home-nutting', w:() => S.season === 2, x:() => `You go nutting in Cuckoo Copse with Henrietta, who has not been since she was fifteen.

She tears her gown upon a bramble, and says nothing about it; and you come home at dusk with a peck of hazel nuts.

Mrs Bunce looks at the gown, and then at you.`},
    {id:'home-fish', w:() => S.season === 3, x:() => `It snows, and the family is shut in nine days, playing at speculation every night for mother-of-pearl fish.

Upon the ninth night Henrietta turns up the ace of trumps three deals running.

You owe her four hundred fish, and she has it written down.`},
    {id:'home-rabbits', w:() => edmundAt() === 'home', x:() => `You walk the Down with Edmund, and two guns. He kills seven rabbits, and you two; and he carries the nine.

Going home he asks how the farms were let in his great-uncle’s time, and you tell him.

He knew it already. He lets you finish.`},
    {id:'home-pin', w:() => edmundAt() === 'army' || edmundAt() === 'navy', x:() => `Henrietta keeps the map of Europe open upon the library table, with a pin in it for Edmund, which she moves when a letter comes.

This week there is no letter.

She comes in each morning before breakfast, and looks at the pin, and goes out again.`},
    {id:'home-stocking', w:() => edmundAt() === 'dead', x:() => `It is a quiet week. Henrietta sits in the window with her work, a grey stocking, which she began before the letter came.

On Thursday you see her unpick a row, and on Friday knit it again.

You sit with her, and neither of you has a book.`},
    {id:'home-flea', w:() => F('kittyBotanist') && kittyHome(), x:() => `Kitty has the microscope upon the breakfast table, with a flea under it.

She makes you look, and then Henrietta, who looks for some time, and rings the bell.

The dogs are washed before noon.`},
    {id:'home-linen', w:() => !kittyHome(), x:() => `Henrietta goes up to count the linen in Kitty’s old room, and is gone an hour.

You find her sitting upon the bed, with the press open, and nothing counted.

You count it together. Fourteen pair of sheets.`},
    {id:'home-coverley', w:() => T('lovematch'), x:() => `Henrietta has the fiddler up from the Bell, without telling you why; but it is, by the calendar, the day of the Newbury assembly.

You dance Sir Roger de Coverley in the hall, there being only the two of you, while the housemaids watch through the baize door.

You are both out of breath at the third figure.`},
    {id:'home-drip', w:() => T('portion'), x:() => `It rains at dinner; and a drop falls upon the cloth, between the mutton and Henrietta.

She looks at the drop, and then at the ceiling, and moves the mustard pot under it.

Nothing is said. You send for the slater on Monday.`},
    {id:'home-flannel', w:() => gouty(), x:() => `The foot is in flannel, upon a stool; and Henrietta reads you the Mercury, from the first advertisement to the last.

You are civil as far as the price of oats. Then the dog is sent out, and then the footman.

Henrietta finishes the column.`},
    {id:'home-sextant', w:() => crewAboard(), x:() => `At noon you take the sextant up to the leads, Tarbuck holding the watch; and you make the Hall fifty-one degrees, twenty-four minutes North, as it was on Tuesday.

“Has the house moved?” says Henrietta at dinner.`},
    {id:'home-indians', w:() => T('soldier'), x:() => `After dinner you tell the curate about Guilford Court House.

Henrietta takes up her work at “It was a wet morning”; at “the colours” her lips move with yours; and she puts in the Indians before you come to them.`},
    {id:'home-barleybread', w:() => dear(), x:() => `Henrietta brings the house books to the library. Flour last year, £31. Flour this year, £58. Candles are up a third.

She has put the servants’ hall upon barley bread two days in the week, and the parlour too.

You eat it at dinner, and say that it is very good.`},
    {id:'home-swing', w:() => edmundAt() === 'farmer' && S.year >= 1809, x:() => `Edmund’s children are at the Hall for the week, and you have a swing put up on the cedar.

The eldest goes too high, and is sick; the second falls off; and the youngest bites the gardener.

Henrietta has not been so happy since the wedding.`}
  ],
  town:[
    {id:'town-siddons', x:() => `You take a house in Upper Brook Street for ten weeks. You see Mrs Siddons in Lady Macbeth, and for a fortnight after sleep with a candle.

Henrietta goes to the Drawing Room in a hoop and feathers; and for three days she comes through every door sideways.`},
    {id:'town-duke', x:() => `You are in London; where a man treads upon you at the Opera, and Tattersall’s sells you a bay with a spavin.

A duke cuts you in St James’s Street, having taken you for another man; and being told your name, he cuts you again.

Henrietta puts all of it in her letters to Mrs Tamworth.`},
    {id:'town-staircase', x:() => `There are ten weeks of routs. At Lady Salt’s three hundred people stand upon a staircase from ten until midnight; and being upon the ninth stair, you do not reach the drawing-room.

Next morning you leave your card, to say that you were there.`},
    {id:'town-vauxhall', w:() => S.year <= 1805, x:() => `You go to Vauxhall, of the three thousand lamps; where you pay four shillings for a plate of ham, and can read the Morning Post through a slice.

The Duchess of Devonshire goes by with her party, and Henrietta counts the feathers.

Eleven.`},
    {id:'town-candles', w:() => S.year === 1814, x:() => `The news comes from Paris upon a Saturday, that Bonaparte has abdicated.

On Monday night there are candles in every window of Brook Street, and a crowd goes down the street breaking the dark ones.

Your landlady has put six candles to a pane; and she puts them on your bill. £2.`},
    {id:'town-burdett', w:() => S.year === 1810, x:() => `Sir Francis Burdett is to go to the Tower, and the crowd holds Piccadilly; and your hackney coach is stopped at Albemarle Street, where a man puts his head in at the window.

“Burdett for ever?”

“By all means,” you say.

He chalks a B upon the door. Ten minutes after, the Life Guards ride by; and the coachman rubs it off with his sleeve.`},
    {id:'town-coat', x:() => `Your tailor in Conduit Street shows you the new cut, which has no lace, and hardly any skirts, and a collar standing up to the ears.

You order it in blue.

Upon your first Sunday at Hatherley you wear it to church; and the dogs bark at you in the yard.`},
    {id:'town-levee', w:() => swans() && S.year <= 1810, x:() => `You go to the Levee. The King comes down the line, and stops.

“${S.sur}, what, what? Swans, hey? How are the swans?”

“Very well, sir.”

“How many? How many?”

“A good many, sir.”

He passes on to a bishop.`},
    {id:'town-brooks', w:() => T('play'), x:() => `You look in at Brooks’s for a quarter of an hour.

You come out at six, when a milk-woman is crying her milk in St James’s Street; and you have nine guineas, and a viscount’s note of hand.

Tidmarsh will not discount the viscount.`},
    {id:'town-partners', w:() => kittyHome() && S.year <= 1805, x:() => `Kitty has eleven partners at Lady Salt’s ball; and Henrietta writes each name in her pocket-book, with his acres beside it.

Seven are younger sons, and two are in the Foot, and one is a Whig.

The eleventh asked twice. He has a living in Norfolk, and a mother.`},
    {id:'town-admiralty', w:() => T('captain'), x:() => `You call at the Admiralty, where there are forty post-captains in the waiting-room before you, and not one of them has a ship.

The porter knows every man by name. Their Lordships will write.

You leave your card upon the pile, and it is a tall pile.`},
    {id:'town-turner', w:() => S.year >= 1801, x:() => `Henrietta takes you to the Exhibition at Somerset House, of nine hundred pictures, among which you count forty-one gentlemen holding horses.

In the next room a Mr Turner has painted a storm at sea.

“It wants finishing,” says a lady beside you.

Henrietta stands before it a long while, and says nothing in the coach.`},
    {id:'town-prices', w:() => dear(), x:() => `You are in London in a dear year. The quartern loaf is one and tenpence at the baker’s in Mount Street; and your landlady has a notice in the hall, that lodgers find their own bread.

At Lady Salt’s there are four hundred to supper, and rolls at every plate.

Henrietta puts two in her reticule.`}
  ]
};
let LAST_CUT = null;
/* Draws an outcome that fits the season and has not been seen, or was seen longest ago. */
function outcome(kind){ let all = OUTCOMES[kind].filter(o => !o.w || o.w()); S.did = S.did || {};
  if (F('henriettaAway')) { const here = all.filter(o => !HEN.test(String(o.x))); if (here.length) all = here; }
  const fresh = all.filter(o => S.did[o.id] === undefined);
  const pool = fresh.length ? fresh : all.slice().sort((a, b) => S.did[a.id] - S.did[b.id]).slice(0, Math.max(1, Math.ceil(all.length / 3)));
  // a piece that needs something particular (a season, a trait, a farm) is three times as likely as one that could happen any year
  const bag = []; for (const o of pool) { bag.push(o); if (o.w) bag.push(o, o); }
  const o = pick(bag); S.did[o.id] = S.t; LAST_CUT = o.id; return o.x(); }

const UNDERTAKINGS = [
  { id:'ride', t:'Ride round the tenancies', hint:'Goodwill', go:() => { duty('ride'); add({goodwill: T('gout') && !F('goutEased') ? pick([1, 2]) : 2}); return outcome('ride'); }},
  { id:'dine', t:'Dine the county', note:'£35', hint:'Standing', go:() => { duty('county'); add({money:-35, standing:2}); return outcome('dine'); }},
  { id:'sessions', t:'Sit on the bench at Quarter Sessions', hint:'Standing', go:() => { duty('county'); const g = pick([-1, 0, 0, 1]); add({standing: T('silver') ? 3 : 2, goodwill:g}); return outcome('sessions'); }},
  { id:'home', t:'Keep at home with the family', hint:'Household', go:() => { duty('home'); add({family:3}); return outcome('home'); }},
  { id:'town', t:'Go up to London for the Season', note:'£350', hint:'Standing, Household', if:() => S.season === 0, go:() => { duty('county'); duty('home'); add({money:-350, standing:3, family:3}); reg('henrietta',1); return outcome('town'); }},
  /* Four ways of raising a little money off the estate, one to each season, and each paid for in somebody's good opinion. */
  { id:'fishing', t:'Let the fishing in the Kennet', note:'+£60', hint:'Costs Standing and Goodwill', if:() => S.season === 0, go:() => { add({money:60, standing:-1, goodwill:-2}); return outcome('fishing'); }},
  { id:'grazing', t:'Let the grass of the park', note:'+£70', hint:'Costs Household', if:() => S.season === 1, go:() => { add({money:70, family:-3}); return outcome('grazing'); }},
  { id:'shooting', t:'Let the shooting to a London man', note:'+£100', hint:'Costs Standing', if:() => S.season === 2, go:() => { add({money:100, standing:-3}); reg('cullerne', -1, 'You let your shooting for money'); return outcome('shooting'); }},
  { id:'underwood', t:'Sell a fall of underwood', note:'+£80', hint:'Costs Goodwill', if:() => S.season === 3, go:() => { add({money:80, goodwill:-3}); return outcome('underwood'); }},
  { id:'retrench', t:'Retrench', note:'+£130', hint:'Costs Standing and Household', go:() => { add({money:130, standing:-3, family:-3}); return pick([
      `You sell the second carriage and two hunters. You sell the claret your uncle laid down for a christening. There was no christening.

“We are to live like curates,” says Henrietta. She says it at dinner, before the servants.`,
      `One footman is turned off. The hot-house fires are let out. Mutton four days in seven.

The pine-apples die within the week. Mrs Bunce puts a black ribbon in her cap.`,
      `You shut up the east wing. You sell the timber in Cuckoo Copse. The woodmen are a month felling it.

The rooks come over to the Hall roof. They are there each morning when you go out.`]); }}
];

/* Two undertakings to a quarter, no one of them twice. He may let the rest of a season go. */
const RIDES = 2;
function ridesLeft(){ return !S || S.phase === 'end' ? 0 : Math.max(0, RIDES - (S.rides || 0)); }
function undertakingOptions(){ const rode = S.rode || [];
  const o = UNDERTAKINGS.filter(u => u.id !== 'retrench' && !rode.includes(u.id) && (!u.if || u.if())).map(u => ({id:u.id, t:u.t, note:u.note, hint:u.hint, run:() => { const r = u.go(); return r; }}));
  o.push({id:'rest', t:(S.rides || 0) ? 'Let the rest of the season go' : 'Let the season go', hint:'−Standing, −Goodwill, −Household', run:() => ''});
  return o;
}
function undertake(i){ const u = undertakingOptions()[i]; if (!u) return;
  if (u.id === 'rest') { add({standing:-1, goodwill:-1, family:-1}); S.rides = RIDES; S.phase = 'undone'; return next(); }
  const b = snapshot(); LAST_CUT = null; const text = u.run();
  S.rides = (S.rides || 0) + 1; S.rode = (S.rode || []).concat(u.id);
  S.journal.unshift({when:stamp(), title:'The season’s undertaking', did:u.t});
  S.outcome = {title:u.t, text, d:deltas(b), cut:LAST_CUT}; S.phase = 'undone'; save(); render(); }

/* A paper waits from quarter day until it is answered, and the squire may sell the farm or clear the debt it speaks of in the meantime. A paper that has lost its occasion is withdrawn. */
function pendingStands(){ const e = S.pending && byId(S.pending); if (!e) return false; if (e.follow && e.cond && !e.cond()) return false;
  try { e.text(); e.choices.filter(c => !c.if || c.if()).forEach(c => { lab(c); if (typeof c.note === 'function') c.note(); }); } catch (err) { return false; } return true; }
function next(){
  if (S.phase === 'ledger') { if (S.dead) return finish(); if (S.pending && !pendingStands()) S.pending = null; S.phase = S.pending ? 'event' : 'undertake'; }
  else if (S.phase === 'outcome') { if (S.dead) return finish(); S.phase = 'undertake'; }
  else if (S.phase === 'undone' && ridesLeft() > 0 && !S.dead) S.phase = 'undertake';
  else if (S.phase === 'undone') { S.rides = 0; S.rode = []; S.t++; if (S.t >= (LAST_YEAR - FIRST_YEAR + 1) * 4) return finish(); S.year = FIRST_YEAR + Math.floor(S.t / 4); S.season = S.t % 4; beginSeason(); }
  save(); render(); window.scrollTo({top:0, behavior:'smooth'});
}
function finish(){ S.phase = 'end'; if (typeof strikeEnding === 'function') strikeEnding(); save(); render(); window.scrollTo({top:0}); }

function setRent(v){ S.rentPolicy = v; setRentAll(v); save(); render(); }
function mortgage(d){ if (d < 0 && S.money >= 500 && S.mortgage >= 500) { S.mortgage -= 500; S.money -= 500; } if (d > 0 && canBorrow()) { S.mortgage += 500; S.money += borrowGets(); } save(); render(); }

/* ---------- the reckoning ---------- */
function reckoning(){
  const net = S.money - S.mortgage + ownLandValue(), k = S.flags.kitty || 'free', e = S.flags.edmund, P = []; const end = ending();
  if (S.dead === 'duel') { P.push(`DIED, on Thursday last, on Hatherley Down, of a pistol ball, ${S.name}, Esquire, of Hatherley Combe in this county, in the ${nth(S.year - 1795 + 46)} year of his age. The Coroner’s jury sat one quarter of an hour. Verdict, Misadventure while shooting rooks.`);
    P.push(`Captain Vane has gone abroad for his health. The estates pass to the widow. She is reported to have said that she told him so.`);
    return {title:end.title, P, score:null, end}; }
  if (S.dead === 'ruin') { P.push(`TO BE SOLD BY AUCTION, by Mr Skinner, at the George Inn, Wyvern, by order of the Mortgagees: the capital Freehold Estate of HATHERLEY COMBE, comprising a Mansion House of fifty-four windows, ${['no','one','two','three','four','five','six','seven','eight','nine'][(S.farms || []).length] || 'several'} Farm${(S.farms || []).length === 1 ? '' : 's'}, a Water Corn Mill${F('enclosed') ? ', and four hundred acres of newly inclosed Land' : ', with Rights over an extensive Common'}. Particulars of Mr Spurling, Attorney, Wyvern.`);
    P.push(end.news);
    P.push(`The Earl of Cullerne is expected to bid.`);
    return {title:end.title, P, score:null, end}; }

  P.push(`${S.name}, Esquire, has now held Hatherley Combe one-and-twenty years. This paper has made enquiry in the county.`);
  if (T('captain')) P.push(F('crewGone') ? `He was a sea officer. He still goes down a staircase backwards. His old Dryads are afloat again. He follows their ships in the Navy List.` : `Dinner at the Hall is announced by a boatswain’s pipe. A guest who comes late is entered in the log.`);
  if (T('play')) P.push(`He is known at every card table between Reading and Bath. He is welcome at all of them. He loses.`);
  if (T('enemy')) P.push(S.chars.cullerne.r >= 1 ? `He and Lord Cullerne now speak. The matter of the pointer lay between them near fifty years.` : `Lord Cullerne has not forgiven the pointer. The dog has been dead forty years.`);
  P.push(net > 4000 ? `He is a richer man than his uncle was. The estate stands clear by some ${fmt(net)}.`
    : net > -1500 ? `His affairs balance. Set the mortgage against the purse and there is ${net >= 0 ? fmt(net) + ' to the good' : fmt(-net) + ' wanting'}. Few landed gentlemen can show as much at the end of this war.`
    : `His debts are put at ${fmt(-net)}, secured upon every acre. The clerks at Tidmarsh’s take off their hats when he passes the Bank.`);
  P.push(S.goodwill >= 68 ? `In Hatherley they call him a fair man. We could not learn that they say it of any other gentleman living.`
    : S.goodwill >= 42 ? `In Hatherley hats are touched to him. We heard no harm of him there and no great good.`
    : `In Hatherley there is a song about him. It has nine verses. It is not sung when he is by.`);
  if (F('enclosed')) P.push(F('allotments') ? `He inclosed the common. He left an acre to every cottage. Both are remembered.` : `He inclosed the common. The quickset hedges are grown up. There are children in the parish who never saw it open. Their grandmothers show them where the cows stood.`);
  else P.push(`Hatherley Common lies open still. Some forty cows are turned out upon it.`);
  if (F('speen')) P.push(`He was of the party at the Pelican in ’95. The Speenhamland scale is cursed today by the men who pay it. It is cursed by the men who draw it.`);
  if (F('wages')) P.push(`He paid his labourers nine shillings when his neighbours paid seven. Most of his neighbours speak to him again.`);
  P.push(S.standing >= 70 ? `Among the gentry he is a man of weight. Lord Cullerne calls him “a coming man”. His Lordship first said so in 1796.`
    : S.standing >= 40 ? `Among the gentry he is received everywhere. His opinion is not much asked.`
    : `Among the gentry he is asked to the large parties.`);
  if (F('mp')) P.push(`He sits for the borough of Wyvern. He has spoken in the House twice. The second time he had risen to leave.`);
  // children
  const kl = {vane:F('kittyAllowance') ? `His daughter is Mrs Vane. She keeps a school for young ladies over the stationer’s at Wyvern. The Captain is believed to be in Dublin.` : F('kittyNorthampton') ? `His daughter is Mrs Vane. She makes lace at Northampton with the Captain’s mother. Her boy is at the Hall.` : `His daughter is Mrs Vane. ${F('kittySettled') ? 'She lives at Northampton on forty pounds a year. Her husband cannot touch it.' : 'She follows the Captain from garrison to garrison. His creditors follow one town behind.'}`,
    pinch:F('kittyManumit') ? `His daughter is the widow of Mr Pinch of Bristol. She has given freedom to three hundred persons in Jamaica. It took the greater part of her fortune. Clifton thinks her out of her mind. Hatherley thinks her the pick of the family.` : F('kittyWidow') ? `His daughter is the widow of Mr Pinch of Bristol. She is very rich. She does not say where the money came from.` : `His daughter is Mrs Pinch, of Clifton. She keeps two carriages.`,
    oakes:`His daughter married the ${F('oakesVicar') ? 'curate. He is now the vicar' : 'curate. He is the curate still'}. She has five children and no carriage. She has not once said she is sorry.`,
    dubreuil:`His daughter is Madame Dubreuil, of Saint-Malo. She keeps bees. Mrs Tamworth has begun to ask after her.`,
    free:F('kittyBotanist') ? `His daughter is unmarried. An orchid of her finding is figured in Sowerby’s English Botany. Her name is printed under it.` : `His daughter is unmarried and lives at home. She is thirty-eight. She is very good with the dogs.`};
  P.push(kl[k]);
  if (F('privyChamber')) P.push(`He is a Gentleman of the Privy Chamber to the Prince Regent. There is no salary and no duty.`);
  else if (F('princeLoan')) P.push(`The Prince Regent owes him a thousand pounds.`);
  if (F('crimcon')) P.push(`The case of ${S.sur} against the Earl of Cullerne is in the law reports. Mrs ${S.sur} lives at Hatherley. They dine together.`);
  if (S.flags.heir === 'kitty') P.push(`The land is settled on his daughter.`);
  if (S.flags.heir === 'cousin') P.push(`The heir is a button-maker of Birmingham. He has asked twice about the chimneys.`);
  if (F('edmundDead') && S.flags.edmundTomb) P.push(S.flags.edmundTomb);
  else if (F('edmundDead')) P.push(`His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur} of the 52nd, lies in the orchard of a farm in Brabant. There is a tablet in Hatherley church. His mother has had the pew moved to face it.`);
  else if (e === 'army') P.push(`His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur}, ${S.flags.edmundFate || 'served through the Peninsula'}. He is home on half-pay. He has the Volunteers’ old serjeant out on the lawn at six, learning the new drill.`);
  else if (e === 'navy') P.push(`His son commands a sloop of war. She is laid up. He is ashore at Hatherley. He walks the terrace eight paces each way.`);
  else if (e === 'church') P.push(F('edmundVicar') ? `His son is vicar of the parish. His sermons are twelve minutes.` : `His son is in orders, in Hampshire. He writes on Sundays.`);
  else if (e === 'farmer') P.push(`His son farms Kennet Bottom. There are three grandchildren. One of them bites.`);
  else if (e === 'militia') P.push(`His son came home from the Militia a captain. He brought a wife with him from Dover.`);
  else P.push(`His son is at home still. He is forty. He manages everything. He waits.`);
  if (F('oaks')) P.push(`He planted forty acres of oak on Gallows Piece for the Navy. The trees do not yet reach the keeper’s shoulder.`);
  if (F('soldLiving')) P.push(`He sold the living of Hatherley to a wine merchant. The Bishop has not dined at the Hall since.`);
  if (F('vaccinated')) P.push(`He had his arm scratched for the cow-pox on a kitchen chair on the green, before the whole parish. There has been no smallpox in Hatherley since.`);
  if (F('soup')) P.push(`The old people of the parish measure every soup against the soup of 1800.`);
  if (F('hoarder')) P.push(`In the dearth his wheat left the parish in three wagons, by daylight. The cottages have the date.`);
  if (S.chars.pryor.r >= 3) P.push(`Jem Pryor has taken game off the estate for thirty years. He has let it be known that no other man is to try.`);
  else if (S.chars.pryor.r <= -3) P.push(`Jem Pryor has not been seen in the parish lately. The keeper is short some two hundred pheasants.`);
  if (F('cornFor')) P.push(`He put his name to the Corn Bill. The quartern loaf is at a shilling.`);
  if (F('cornAgainst')) P.push(`He set his name against the Corn Bill. Few landed gentlemen of the county did. At Cullerne Castle he is called “the Loaf”.`);

  let score = Math.round(S.standing * 0.25 + S.goodwill * 0.4 + S.family * 0.35 + clamp(net / 400, -12, 12));
  score = clamp(score, 0, 100);
  const title = end.title;
  P.push(`He is ${S.year - 1795 + 46}, and in tolerable health. He has been heard to say that the next twenty years cannot be as troublesome as the last.`);
  return {title, P, score, end};
}

/* ---------- saving ---------- */
/* The book is written to the browser at every choice and every quarter, and again when the page is put away.
   A save carries the number of the build that wrote it. An older one is mended, never thrown out: mend() runs the numbered steps it has missed,
   then fills in whatever a new estate would have and the old one lacks, so a part added since (a person, a farm's new column, a whole table) cannot break it.
   Add a step to MENDS and raise SAVE_VERSION only when something must be renamed or reshaped; a plain addition needs nothing. */
let NOSAVE = false, SAVE_FAILED = false, ASKED_KEEP = false;
const MENDS = {
  1: s => { if (!s.works) { s.works = s.project ? [s.project] : []; delete s.project; } }
};
function save(){ if (NOSAVE || !S) return; S.v = SAVE_VERSION;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); SAVE_FAILED = false; } catch (err) { SAVE_FAILED = true; }
  /* Safari clears a site's storage after a week unvisited unless asked to keep it. */
  if (!ASKED_KEEP) { ASKED_KEEP = true; try { if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {}); } catch (err) {} } }
function freshState(){ const keep = S, was = NOSAVE; let f = null; NOSAVE = true; try { newGame('Thomas', 'Merridew', []); f = S; } catch (err) {} S = keep; NOSAVE = was; return f; }
function mend(s){ const from = s.v || 1;
  for (let v = from; v < SAVE_VERSION; v++) if (MENDS[v]) MENDS[v](s);
  const f = freshState(); if (!f) return s;
  for (const k in f) if (s[k] === undefined) s[k] = f[k];
  for (const id in f.chars) { if (!s.chars[id]) s.chars[id] = f.chars[id]; else for (const k in f.chars[id]) if (s.chars[id][k] === undefined) s.chars[id][k] = f.chars[id][k]; }
  for (const x of (s.farms || [])) { const t = f.farms.find(y => y.id === x.id) || f.farms[0]; for (const k in t) if (x[k] === undefined && (k === 'lease' || k === 'level' || t.id === x.id)) x[k] = JSON.parse(JSON.stringify(t[k])); }
  /* a farm sold under an early build left no record of itself; the works that belonged to it need its name */
  if (s.farms) for (const x of f.farms) if (!s.farms.some(y => y.id === x.id) && !(s.soldFarms && s.soldFarms[x.id])) (s.soldFarms = s.soldFarms || {})[x.id] = x;
  /* what a later build has dropped is taken quietly out of the book */
  const known = id => { try { return !!byId(id); } catch (err) { return false; } };
  s.queue = (s.queue || []).filter(q => q && known(q.id));
  s.works = (s.works || []).filter(w => w && PROJECTS[w.id]);
  if (s.pending && !known(s.pending)) { s.pending = null; if (s.phase === 'event') s.phase = 'undertake'; }
  if ((s.phase === 'outcome' || s.phase === 'undone') && !s.outcome) s.phase = 'undertake';
  s.v = SAVE_VERSION; return s; }
function load(){ let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); if (!raw) return null; const s = JSON.parse(raw);
    if (s && s.chars && s.phase) { if ((s.v || 1) !== SAVE_VERSION) { try { localStorage.setItem(SAVE_BACKUP, raw); } catch (err) {} } return mend(s); } }
  catch (err) { try { if (raw) localStorage.setItem(SAVE_BACKUP, raw); } catch (e2) {} }
  return null; }
function wipe(){ try { localStorage.removeItem(SAVE_KEY); } catch (err) {} S = null; render(); }
if (typeof addEventListener === 'function') { addEventListener('pagehide', () => save()); addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); }); }

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
  enclosure:{ fx:["+ Church Farm worth a third more to let", "+ The common, to fence into a farm", "+ Standing", "− Goodwill, hard"], effects:`Church Farm is worth a third more to let. The common can then be fenced into a new farm. Tithe ends. Goodwill falls hard, less so if the cottagers have allotments.`, name:'The Hatherley Inclosure Bill', seasons:3, cost:() => F('allotments') ? 1400 : 1200, hidden:true,
    blurb:`A private Act of Parliament, a surveyor and three commissioners.`, gain:'Church Farm worth a third more; the common allotted to you',
    done:() => { fl('enclosed'); add({goodwill: F('allotments') ? -6 : -16, standing:3}); if (!F('allotments')) reg('pryor',-2,'Lost his cow-gate when the common was enclosed'); later('commonRiot', 1);
      return F('allotments') ? `The Hatherley Inclosure Act has the Royal Assent. The Commissioners read the award in the vestry.

To ${S.name}, Esquire, 400 acres. To the Earl of Cullerne, 190. To the Vicar in lieu of tithe, 110. To the cottagers, sixty plots of one acre.

The clerk rolls up the map. There is no common on it.` : `The Hatherley Inclosure Act has the Royal Assent. Forty other parishes had theirs in the same session. The Commissioners read the award in the vestry.

To ${S.name}, Esquire, 400 acres. To the Earl of Cullerne, 190. To the Vicar in lieu of tithe, 110. To nineteen cottagers who could show no deed, nothing.

Jem Pryor stands up at the back. His family has turned a cow out there since Queen Anne.

“Have you that in writing?” says the clerk.`; }},
  drain:{ fx:["+ Kennet Bottom up to fair order", "+ About a sixth more rent"], effects:`Kennet Bottom comes up from neglected to fair order: worth about a sixth more to let.`, name:'Drain and marl the clay at Kennet Bottom', seasons:2, cost:() => F('hartoppFriend') ? 420 : 520,
    blurb:`Nine miles of stone drains under the low fields. They stand in water from November to May.`, gain:'Kennet Bottom in fair order',
    done:() => { return `The drains are in at Kennet Bottom. There are nine miles of them, laid with stone and blackthorn.

You walk the low fields from end to end. Your boots come home on your feet.`; }},
  fourcourse:{ fx:["+ Home farm wheat", "+ Every farm worth a little more"], effects:`Home farm wheat up by about a sixteenth. Every farm worth a fortieth more to let.`, name:'Put the home farm under the Norfolk four-course', seasons:1, cost:() => F('hartoppFriend') ? 200 : 260,
    blurb:`Wheat, turnips, barley, clover. No field lies fallow.`, gain:'Yields and rents up',
    done:() => { S.improve += 1; reg('hartopp',1); return `Wheat, turnips, barley, clover. Then wheat again. There is no fallow on the home farm this year.

The old carter stands at the gate of Twelve Acres.

“That ground ent had a rest since Lady Day twelvemonth, sir.”

He shakes his head at it.`; }},
  mill:{ fx:["+ Kennet Bottom worth a sixteenth more", "+ Goodwill"], effects:`Kennet Bottom worth a sixteenth more to let. Goodwill rises.`, name:'Rebuild Hatherley Mill with an iron wheel', seasons:2, cost:() => 420,
    blurb:`The present wheel is of elm. Your grandfather’s father put it in.`, gain:'Kennet Bottom worth more; the parish pleased',
    done:() => { fl('newMill'); add({goodwill:3}); return `The new wheel turns at Hatherley Mill. It is cast iron, from the foundry at Reading. Eighteen feet across. Painted red.

It grinds before noon what the old wheel ground in a day. Pocock the miller walks round it twice with his hands behind him.

“Her’ll never last,” he says.`; }},
  cottages:{ fx:["+ Goodwill, a good deal"], effects:`Goodwill rises a good deal.`, name:'Build six brick cottages on the Kintbury lane', seasons:2, cost:() => 360,
    blurb:`Six on the lane are past mending. The ivy holds up two of them.`, gain:'Goodwill',
    done:() => { fl('cottages'); add({goodwill:9}); return `Six cottages stand on the Kintbury lane. Brick walls. Tiled roofs. Two bedrooms, a bread oven and a pigsty to each.

The six families walk through on Saturday. Nobody speaks. They put their hands on the walls.

One woman stops at the foot of the stairs.

“Is the upstairs ours and all, sir?”`; }},
  school:{ fx:["+ Goodwill", "− Dr Gall"], effects:`Goodwill rises. Dr Gall cools.`, name:'Endow a dame school in the old tithe barn', seasons:1, cost:() => 160,
    blurb:`Letters, the catechism and plain sewing for forty children.`, gain:'Goodwill',
    done:() => { fl('school'); add({goodwill:6}); if (!F('gallDead')) reg('gall',-1); return `The school opens in the tithe barn. Forty children. Twenty slates. Hannah Gurney’s niece has them for letters, the catechism and knitting.

“Reading will only make them discontented,” says ${F('gallDead') ? 'old Dewey' : 'Dr Gall'}.

On Friday there is a word chalked on ${F('gallDead') ? 'his yard gate' : 'the vicarage gate'}. It is spelt correctly.`; }},
  road:{ fx:["+ Goodwill", "+ Standing"], effects:`Goodwill and standing both rise.`, name:'Mend the Kintbury road, and the bridge with it', seasons:1, cost:() => 240,
    blurb:`Last winter it took two carts and the curate’s pony. The parish has been bound to mend it since Queen Anne.`, gain:'Goodwill and standing',
    done:() => { fl('road'); add({goodwill:3, standing:3}); return `The Kintbury road is made. Flints broken small, rammed and cambered. A ditch on either side. The bridge has a parapet.

The carrier calls twice a week now. On Tuesday a post-chaise goes through at a trot. The children run out to look at it.`; }},
  front:{ fx:["+ Standing, a good deal", "+ Henrietta", "+ Household"], effects:`Standing rises a good deal. Henrietta and the household pleased.`, name:'New-front the Hall in Bath stone', seasons:3, cost:() => 900,
    blurb:`A portico, a pediment and six columns across the park front.`, gain:'Standing; Henrietta',
    done:() => { fl('newFront'); add({standing:9, family:4}); reg('henrietta',2,'You gave the Hall a front she could ask people to'); return `The scaffolding comes down. The Hall has a front of Bath stone, six Ionic columns and a pediment with your arms cut in it. Behind it the old chimneys smoke as before.

Henrietta has the Tamworths to dinner on Thursday. She receives them on the steps.`; }},
  pinery:{ fx:["+ Standing", "+ Household"], effects:`Standing rises. The household pleased.`, name:'Build a pinery and raise pine-apples', seasons:1, cost:() => 200,
    blurb:`A glass house, a pit of tanner’s bark and a Scotch gardener. A pine-apple takes two years.`, gain:'Standing; the household',
    done:() => { fl('pinery'); add({standing:4, family:2}); return `The first pine-apple is cut. It has had two years, forty loads of bark and a Scotchman to itself.

Nobody eats it. It stands in the middle of the table through eleven dinners. Then the Lovedays send to borrow it.`; }},
  oaks:{ fx:["+ Standing"], effects:`Standing rises a little.`, name:'Plant forty acres of oak for the Navy', seasons:1, cost:() => 120,
    blurb:`A seventy-four takes two thousand grown oaks.`, gain:'Standing; posterity',
    done:() => { fl('oaks'); add({standing:2}); return `Forty acres of acorns are dibbled in on Gallows Piece.

The nurseryman from Newbury says they will make ship timber in a hundred and twenty years. You ask him to say it again.

You ride home at a walk.`; }},
  icehouse:{ fx:["+ Household", "+ Henrietta"], effects:`The household pleased. Henrietta warms.`, name:'Sink an ice-house in the north shrubbery', seasons:1, cost:() => 140,
    blurb:`A brick egg under ground, filled from the carp pond in a hard frost.`, gain:'The household',
    done:() => { fl('icehouse'); add({family:5}); reg('henrietta',1); return `The ice-house is sunk in the north shrubbery. It is a brick egg under a mound of earth. The men are to fill it from the carp pond at the first hard frost.

Henrietta has written to Gunter’s for a receipt for lemon ice. She has asked the Tamworths already.`; }}
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
    return {id, name:p.name, blurb:p.blurb, gain:p.gain, effects:p.effects || p.gain, fx:typeof p.fx === 'function' ? p.fx() : p.fx, cost, seasons:p.seasons, per,
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
  householdQuarter(line); homeFarmCosts(line);
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
    if (T('gout') && !F('goutEased')) { add({family:-3}); S.notes.push('The gout has you by the foot from Advent to Candlemas. The household goes on tiptoe. You shout at them for creeping.'); }
    if (y >= 1799 && y !== 1802) { const rate = y <= 1801 ? 0.1 : y <= 1805 ? 0.05 : 0.1; line('Income tax at ' + (rate * 100) + ' per cent', -S.yearIncome * rate * (F('taxDodge') ? 0.5 : 1)); }
  }
  if (S.money < 0) { line('Interest on tradesmen’s bills and notes of hand', S.money * 0.03); add({standing:-1}); S.notes.push('You are living on credit. Wyvern has noticed.'); }
  // Nothing keeps without tending: regard, like a hedge, grows out.
  if (S.t > 0) { const dear = P >= 95 && !F('soup') && !F('wages');
    add({goodwill: (S.goodwill > 60 ? -2 : -1) - (dear ? 1 : 0), family: S.family > 60 ? -2 : -1});
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
  // A dated event keeps its date. Anything queued for the same season waits one.
  const dated = (FIXED[S.year + '-' + S.season] || []).find(e => !e.cond || e.cond());
  if (dated) { S.queue.forEach(x => { if (x.at <= S.t) x.at = S.t + 1; }); return dated.id; }
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

/* What a season's undertaking returns. Each outcome has a stable id (a woodcut may be hung on it at art/undertakings/<id>),
   an optional test w() for when it can happen, and its text x(). Nothing here changes a sum: the undertaking pays the same whichever is drawn.
   Written in the Hatherley hand (docs/voice/VOICE.md). */
const tenantOf = id => { const f = S.farms && S.farms.find(x => x.id === id); return f && !f.void ? f : null; };
const called = f => /^Widow/.test(f.tenant) ? 'the ' + f.tenant : f.tenant;
const Called = f => /^Widow/.test(f.tenant) ? 'The ' + f.tenant : f.tenant;
const sheHe = f => f.she ? 'She' : 'He';
const let1 = test => (S.farms || []).find(f => !f.void && test(f));
const wheatNow = () => PRICES[S.year] || 76;
const dear = () => wheatNow() >= 100, cheap = () => wheatNow() < 60;
const kittyHome = () => (S.flags.kitty || 'free') === 'free';
const edmundAt = () => F('edmundDead') ? 'dead' : (S.flags.edmund || 'home');
const crewAboard = () => T('captain') && !F('crewGone');
const gouty = () => T('gout') && !F('goutEased');
const swans = () => T('court') && !F('courtLost') && !F('courtSold');

const OUTCOMES = {
  ride:[
    {id:'ride-cider', x:() => `You ride round the tenancies in a day and a half. You are given cider. Then perry. A cold pie. Cider again. At the last farm the tenant lifts your horse’s off fore and tells you what he would do. At the mill you are given a dog.`},
    {id:'ride-thatch', w:() => tenantOf('kennet') && tenantOf('kennet').tenant === 'Widow Harris', x:() => `At Kennet Bottom the Widow Harris takes you up her stairs. She shows you the hole in the thatch. It comes on to rain while you stand under it.

“I will send the thatcher, Mrs Harris.”

“So the old Squire said, sir.”`},
    {id:'ride-names', x:() => `A wet week in the saddle. At every farm you learn the children’s names. By Friday you have thirty-one. Three of the boys were christened Barnaby.`},
    {id:'ride-gates', w:() => tenantOf('church'), x:() => { const f = tenantOf('church'); return `You walk the bounds of Church Farm with ${called(f)}. ${sheHe(f)} stops at every gate that wants hanging.

“Your gate, sir.”

The hedges are new laid.

“My hedges,” ${f.she ? 'she' : 'he'} says.`; }},
    {id:'ride-lambing', w:() => S.season === 0 && tenantOf('longbarrow'), x:() => `Long Barrow in lambing. The shepherd has not been to bed since Tuesday. You hold the lantern for an hour in the fold.

Twins. Then a single. Then a dead one.

The shepherd skins the dead lamb. He ties the skin on an orphan and puts it to the ewe. She smells it twice. She lets it suck.`},
    {id:'ride-rooks', w:() => S.season === 0 && tenantOf('church'), x:() => `Barley sowing. In every field there is a boy with a wooden clapper to keep the rooks off. He has twopence a day.

At Church Farm the boy is seven. He is asleep under the hedge with the clapper in his hand. The rooks walk the drills behind the sower.

You wake him with your whip handle. You do not tell the farmer.`},
    {id:'ride-hay', w:() => S.season === 1, x:() => `Hay week. You ride into Kennet Meadow at noon. The mowers stop and look at you.

You get down and take a rake. You rake for an hour. By two your hands are blistered. Nobody remarks on it.

At four the beer comes round. It comes to you before the foreman.`},
    {id:'ride-shearing', w:() => S.season === 1 && tenantOf('longbarrow'), x:() => `Shearing at Long Barrow. Six men on the barn floor. A good man clips forty in a day.

You are handed the shears. Your ewe takes eleven minutes. She goes out with a ruff round her neck and one bare leg.

The catcher brings you another. You give him back the shears.`},
    {id:'ride-harvest', w:() => S.season === 2 && tenantOf('church'), x:() => { const f = tenantOf('church'); return `Harvest week. Church Farm has forty acres standing and the glass is falling. ${Called(f)} has every hand out. The carter’s wife is binding. So is the curate’s boy.

You send four men over from the home farm for three days.

“What do I owe for them, sir?”

“Nothing.”

${sheHe(f)} writes it in the book all the same.`; }},
    {id:'ride-michaelmas', w:() => S.season === 2, x:() => `Michaelmas. You ride the farms the week before the rent. At each one you are shown something that has gone wrong. A lame horse. A blighted piece of beans. A roof.

At the third farm you are shown the same lame horse. It was led across the fields while you dined.`},
    {id:'ride-frost', w:() => S.season === 3, x:() => { const f = let1(() => true); return `Hard frost. The lanes ring. You ride to ${f ? f.name : 'the far farm'} to look at the ditches.

There is a fire in the kitchen and elder wine in a mug. One pane of the window is mended with a page of the Reading Mercury. You read the price of wheat on it.

It is the price of four years ago.`; }},
    {id:'ride-threshing', w:() => S.season === 3 && !F('thresher') && tenantOf('church'), x:() => `You stop at every barn. Two men to a floor, stroke and stroke. The chaff hangs in the doorway.

At Church Farm the taller man misses his time when you come in. The flail takes the other on the knuckles.

He says a word. Then he says “sir”.`},
    {id:'ride-dear', w:() => dear() && tenantOf('church'), x:() => `Wheat is at ${wheatNow()} shillings. At Church Farm there is a new gig in the cart shed. There is a piano-forte in the parlour. It came from Reading on Tuesday.

At the cottages by the pound the children are eating barley bannock. One of them holds his up to show you.

You ride home between the two.`},
    {id:'ride-cheap', w:() => cheap(), x:() => `Wheat is at ${wheatNow()} shillings. Every tenant meets you at his gate with his hat in his hand.

Each has a slate ready. The rent. The tithe. The poor rate. The total is chalked large at the foot.

You are shown four slates in one morning. The sums differ. The handwriting is the same.`},
    {id:'ride-arrears', w:() => let1(f => f.arrears >= 1), x:() => { const f = let1(x => x.arrears >= 1); return `${f.name}. The rent is behind. You ride into the yard at ten.

${Called(f)} is ${f.she ? 'in the dairy with the door shut' : 'on the barn roof with a bundle of straw'}. ${sheHe(f)} does not come ${f.she ? 'out' : 'down'}. You speak of the rent for ten minutes to ${f.she ? 'a door' : 'a pair of boots'}.

A girl brings you plum cake on a plate. You eat it on your horse.`; }},
    {id:'ride-neglect', w:() => let1(f => f.cond <= 1), x:() => { const f = let1(x => x.cond <= 1); return `At ${f.name} the barn door hangs by one hinge. The nettles in the rickyard reach your stirrup. There is a wagon without a wheel under the elm.

${Called(f)} follows your eye round the yard.

“It was so when I came, sir.”`; }},
    {id:'ride-highorder', w:() => let1(f => f.cond >= 3), x:() => { const f = let1(x => x.cond >= 3); return `${f.name} is in high order. The yard is swept. The hedges are laid. The dung is in a square heap.

${Called(f)} walks you over ninety acres of turnips in drills. You are not let off one field.

You are two hours late for dinner. Henrietta has dined.`; }},
    {id:'ride-quickset', w:() => F('enclosed'), x:() => `You ride the new inclosures on the old common. The quickset is knee high and planted by line. The surveyor’s pegs are still in the ground.

At the far corner an old woman is cutting furze. She has cut it there forty years.

You ride by on the other side of the hedge.`},
    {id:'ride-geese', w:() => !F('enclosed'), x:() => `You cross the common. Forty cows. A donkey. Jem Pryor’s geese.

The geese stand in the road. The gander comes at your horse with his neck out.

You go round by the pond.`},
    {id:'ride-gout', w:() => gouty(), x:() => `You cannot get a boot on. You go round the farms in the gig with the foot on a cushion.

At each gate the tenant comes out to the wheel. Each looks at the foot. Each tells you what cured his father.

Goose grease. A split pigeon, laid on warm. Bath.`},
    {id:'ride-coxswain', w:() => crewAboard() && tenantOf('church'), x:() => { const f = tenantOf('church'); return `Tarbuck rides behind you on the cob. He had not sat a horse before this year.

At Church Farm he looks over the rickyard.

“Them stacks is stowed all anyhow, sir.”

${Called(f)} asks what your man said. You say he admired the ricks.`; }},
    {id:'ride-barley', w:() => T('stranger') && S.season === 1 && tenantOf('church'), x:() => `There is a field in ear at Church Farm.

“A fine piece of wheat,” you say.

“Barley, sir.”

“Fine barley.”

The carter walks round to the far side of his wagon. His shoulders shake.`},
    {id:'ride-ewes', w:() => T('bred'), x:() => `At the sheep pens you open a ewe’s mouth.

“Full-mouthed. Who sold her to you as a two-tooth?”

The tenant names a dealer at Ilsley fair. You look at six more. Nine in the score are old ewes.

He walks beside your horse to the gate. He asks what you think of his barley.`},
    {id:'ride-pond', w:() => T('beloved'), x:() => `At the mill the miller’s mother is on the bench by the door. She is past eighty.

“I mind you in that pond,” she says. “You went in after a moorhen’s nest. Your uncle’s man had you out by the breeches.”

The miller’s children are listening. So is the miller.`},
    {id:'ride-cottages', w:() => F('cottages'), x:() => `You stop at the new cottages on the Kintbury lane. Every one has a pig. Four have beans up the wall.

At the end house a woman is scrubbing the step. The step is white already.

She scrubs it while you sit there. She is scrubbing it when you look back from the turn.`},
    {id:'ride-house', w:() => F('workhouse'), x:() => `You ride by the House of Industry. An old man is breaking flints in the yard. He takes off his hat.

You know him. He was carter at Church Farm thirty years.

You touch your own hat. You had not meant to.`},
    {id:'ride-school', w:() => F('school'), x:() => `You look in at the school in the tithe barn. Forty children stand up.

The mistress has the biggest boy read to you. He reads the Tenth Commandment with his finger under the words. He gets as far as the ox.

“Nor his ass,” says a girl of six from the back.`},
    {id:'ride-edmund', w:() => edmundAt() === 'farmer', x:() => `You ride to Edmund’s last. He is in the yard in his shirt, drenching a cow.

“Hold her head, sir.”

You hold her head. The cow treads on your foot.

Sophia brings out beer for two.`}
  ],
  dine:[
    {id:'dine-turbot', x:() => `Three removes for sixteen. The Bishop’s chaplain is helped twice to the turbot and three times to the saddle.

“Your turbot is very brave,” says Lady Cullerne.

At two in the morning you are awake. You are turning the word over.`},
    {id:'dine-haunch', x:() => `You dine at the Tamworths’. You dine at the Lovedays’. You dine at Hartopp’s. Then the county dines with you.

Mrs Bunce sends up a haunch that has hung five weeks. Old Mr Tamworth calls it the best he ever ate. The dogs will not come into the room.`},
    {id:'dine-ball', x:() => `You are steward of the ball at the Wyvern Assembly Rooms. Candles, £3 4s. Negus, £2 10s. Three fiddlers at half a guinea.

At eleven old Mrs Loveday sits down on the first fiddler’s bow. A new bow, 7s. 6d.`},
    {id:'dine-magistrates', x:() => `Venison for nine magistrates and a colonel.

At the second bottle the Colonel takes Paris. At the third the Chairman gets the harvest in. At the fourth Mr Tamworth walks into the china closet and wishes the company good night.`},
    {id:'dine-nopastry', w:() => dear(), x:() => `Wheat is at ${wheatNow()} shillings. You give the county a dinner with no flour in it. No pies. No puddings. Rice in place of bread.

Lord Cullerne looks down the table for the tart.

“There is none, my lord. It is the King’s wish.”

He takes a third helping of the goose.`},
    {id:'dine-snow', w:() => S.season === 3, x:() => `It snows from four o’clock. Sixteen sit down. At eleven the coachmen send in word that the lane is stopped.

Sixteen stay the night. There are eleven beds.

Mr Loveday has the billiard table. He says at breakfast that he never slept better.`},
    {id:'dine-partridge', w:() => S.season === 2, x:() => `You have forty brace of partridge hanging. The county dines on them.

Partridge soup. Partridge roast. Partridge in a pie.

Old Mr Tamworth finds a shot in his. He lays it on the edge of his plate. By the cheese he has eleven in a row.`},
    {id:'dine-wasps', w:() => S.season === 1, x:() => `It is too hot for the dining-room. You dine the county on the lawn under an awning. Cold fowls, a salmon, syllabubs.

With the second course come the wasps.

One walks across Lady Cullerne’s glove. She does not look at it. She goes on speaking of the Princess of Wales.`},
    {id:'dine-lamb', w:() => S.season === 0, x:() => `The first lamb of the year and the first asparagus. Sixteen sit down.

The asparagus is counted in the kitchen. A hundred and twelve heads. Seven apiece.

The Bishop’s chaplain takes fifteen. Mrs Bunce hears of it before the cloth is drawn.`},
    {id:'dine-walnuts', w:() => S.year >= 1803 && S.year <= 1805, x:() => `The ladies withdraw. Colonel Tamworth lays out the invasion on the cloth.

The walnuts are the French. The salt is Dover. The decanter is Lord Keith.

At midnight the footman clears France into a napkin.`},
    {id:'dine-regrets', w:() => S.chars.cullerne.r <= -2, x:() => `You ask Lord Cullerne for the Tuesday. His lordship regrets. You ask him for the Thursday week. His lordship regrets.

Fourteen sit down. The chair on Henrietta’s right is filled by the apothecary from Wyvern.

He is very good company. Henrietta does not hear a word he says.`},
    {id:'dine-earl', w:() => S.chars.cullerne.r >= 2, x:() => `Lord Cullerne takes Henrietta in. He stays until one.

In the hall he says he has not laughed so much since the Regency Bill. Both footmen hear him.

It is all over Wyvern by breakfast.`},
    {id:'dine-swans', w:() => swans(), x:() => `Somebody asks after the swans.

“There are none at present,” you say.

“Then what does the Deputy Keeper do?” says the Bishop’s chaplain.

“He draws ninety pounds, sir.”

Lord Cullerne laughs first. Then the table may.`},
    {id:'dine-whist', w:() => T('play'), x:() => `Cards after tea. Whist at guinea points.

Your partner is a clergyman’s widow from Hungerford. She trumps your ace twice. Your opponents are her sister and her sister’s husband.

You lose the price of the dinner over again. The widow asks when you next dine the county.`},
    {id:'dine-lobscouse', w:() => crewAboard(), x:() => `Pascoe sends up lobscouse for a remove. Nobody ordered it.

The Bishop’s chaplain takes it for a ragoût. He is helped twice. He asks for the receipt.

“Salt beef, biscuit, onions,” says Tarbuck from behind his chair. “And slush, your reverence.”`},
    {id:'dine-ice', w:() => F('icehouse') && S.season === 1, x:() => `July. You give them lemon ice in the blue glasses.

“From Gunter’s?” says Lady Cullerne.

“From the north shrubbery,” says Henrietta.

She tells her how deep it is sunk. She tells her how many loads of straw.`},
    {id:'dine-onefootman', w:() => typeof estIdx === 'function' && estIdx() === 0, x:() => `You dine the county on a retrenched household. One man waits on sixteen. He is also the groom.

He has not had time to change his boots.

“An excellent soup,” says Mr Tamworth. “Is there horse in it?”`},
    {id:'dine-pitt', w:() => T('whig') && S.year <= 1805, x:() => `The cloth is drawn. Colonel Tamworth rises.

“Mr Pitt.”

You lift your glass. You do not drink. Fourteen gentlemen watch it go down full.

Hartopp reaches across and drinks it for you.`},
    {id:'dine-grace', w:() => !F('gallDead'), x:() => `Dr Gall says grace. It is in Latin. It lasts four minutes by the hall clock.

The soup has a skin on it at Amen.

Dr Gall is helped first.`},
    {id:'dine-guilford', w:() => T('soldier'), x:() => `Over the port a young ensign of the Militia asks whether you were ever in action.

Old Mr Tamworth gets up and goes to look at a picture. Mr Loveday follows him.

You begin with the weather on the morning of the fifteenth of March.`}
  ],
  sessions:[
    {id:'sessions-goose', x:() => `A man has stolen a goose. You order him whipped. A woman stole it back from him. One month.

The goose is brought into court in a hamper. It bites the clerk.`},
    {id:'sessions-three', x:() => `A bastardy case from Kintbury. The girl names three men. Each takes the oath. Each swears it was one of the other two.

You make the order on all three. Eighteen pence a week between them.`},
    {id:'sessions-bridge', x:() => `All day in the Shire Hall over a bridge. Each parish in the hundred swears it belongs to the next. The surveyor unrolls a map of 1740. The bridge is on the fold.

The Bench rises at six. Tonight the bridge has no owner.`},
    {id:'sessions-wagon', x:() => `You license eleven alehouses. You refuse the twelfth.

You sign an order removing Ann Giles, pauper, to Andover, the parish of her birth. It is forty miles. The overseer of Andover has written already. He says she was born in a wagon.`},
    {id:'sessions-bread', w:() => dear(), x:() => `The calendar is all bread. A woman took a loaf from a baker’s board in Newbury. A man took a peck of flour at the mill. A boy pulled turnips.

“What is the quartern loaf today?” says the Chairman.

“One and fivepence, sir.”

He writes it at the head of his paper. Then he calls the first case.`},
    {id:'sessions-snares', w:() => S.season === 3 || S.season === 2, x:() => `Eleven cases under the Game Laws, one after another. Every gentleman on the Bench preserves.

The eleventh is a boy with two wires in his hat. Lord Cullerne’s keeper swears to him. Lord Cullerne sits on your left.

Three months.`},
    {id:'sessions-substitute', x:() => `A militia day. Forty balloted men come up with their reasons. One is lame. One has six children. One has a substitute outside, holding his horse.

The substitute has had ten guineas. You pass him.

“He was passed at Marlborough in March,” says the clerk. “For Wiltshire.”`},
    {id:'sessions-leg', w:() => S.year >= 1798, x:() => `Passes all morning. A sailor’s wife is walking from Plymouth to Hull with two children. A discharged soldier has one eye. You sign for a penny a mile.

Then a man with a wooden leg. He lost it at Camperdown.

“Which leg did you lose at the Epiphany Sessions?” says the clerk.`},
    {id:'sessions-sweep', x:() => `A parish apprentice has run from a chimney sweeper in Newbury. He is nine. The Chairman has him take off his shirt.

The Bench looks at his back. Then it looks at the master.

The indentures are cancelled. The parish has the boy again at one and six a week.`},
    {id:'sessions-weights', x:() => `The inspector lays eleven weights on the table. They are from a grocer’s in Wyvern. He supplies the Hall.

You take up the pound. It wants an ounce and a half.

Fined forty shillings. Henrietta says she will change her grocer. There is no other grocer in Wyvern.`},
    {id:'sessions-words', w:() => S.year <= 1801, x:() => `A cobbler of Hungerford is charged with seditious words. He said in the Bear that the King was a German and Mr Pitt was a pump.

Three witnesses heard him. Each had drunk at his cost first.

One month. He thanks the Bench. He says he will say it lower.`},
    {id:'sessions-rue', w:() => S.season === 1, x:() => `Midsummer Sessions. The windows of the Shire Hall will not open. There was fever in the Bridewell last month.

The Bench sits with rue and vinegar on the desk. The prisoners are brought up two at a time and kept by the door.

The business is done by one. It was never before done by four.`},
    {id:'sessions-loaf', x:() => `A labourer from Shefford appeals against his overseer. He has a wife, five children and six shillings.

“He has the scale,” says the overseer.

The man has brought the loaf. He sets it on the clerk’s table. It is the week’s bread. It is Tuesday.`},
    {id:'sessions-rate', w:() => T('silver'), x:() => `The Bench divides on a new county gaol. Nine for, nine against. You get up. You speak for ten minutes.

The gaol is carried by three.

“Very handsome,” says the Chairman in the passage. “Which side had you meant to take?”`},
    {id:'sessions-hassock', w:() => gouty(), x:() => `You sit with the foot on a hassock. Each prisoner looks at it as he comes up.

Before noon you commit eleven. The clerk has never entered so many in a morning.

At one the foot eases. The twelfth man is discharged with a caution.`},
    {id:'sessions-horse', w:() => S.season === 0, x:() => `Easter Sessions. A dealer has sold a Wyvern farmer a horse warranted sound. It has gone lame on all four legs in a fortnight.

The horse is walked up and down before the Shire Hall. The whole Bench goes out to the steps. Nine magistrates give nine opinions.

The dealer has gone before you come in again.`},
    {id:'sessions-drum', w:() => S.year >= 1803 && S.year <= 1813, x:() => `A recruiting serjeant is charged by a mother. Her son took the shilling at Newbury fair. He is fifteen and was drunk.

The serjeant says the lad gave his age as eighteen. The boy says he cannot remember what he gave.

You send for the parish register. Fifteen. The serjeant has his shilling back.`}
  ],
  home:[
    {id:'home-backgammon', x:() => `You stay at home. You play backgammon with Henrietta every evening. She moves a man with her sleeve when you look at the fire.

You look at the fire a good deal.`},
    {id:'home-alphabet', x:() => `Rain all the week. You read Tom Jones in the library for the sixth time. Henrietta nets a purse.

Between rows she tells you what is amiss with the families of Berkshire. She takes them by the alphabet. On Friday she is at the Lovedays.`},
    {id:'home-pocketbook', x:() => `“At home all this Week. Shot nothing, signed nothing, taught the Dogs nothing. Dined each Day upon what there was. Have not passed a better Week since Christmas.”`},
    {id:'home-radcliffe', w:() => kittyHome(), x:() => `Kitty reads Mrs Radcliffe aloud after dinner. She does every voice. The wicked monk has ${F('gallDead') ? 'the late Dr Gall’s' : 'Dr Gall’s'} cough.

Henrietta counts her stitches. Nobody looks up.`},
    {id:'home-brewing', x:() => `“Did not stir beyond the Garden all the Week. Brewed a Hogshead of strong Beer on Tuesday. Bottled off the Gooseberry Wine, 3 Dozen. My Wife beat me at Cribbage five Nights of the six. Paid her 0. 4. 0.”`},
    {id:'home-carpets', w:() => S.season === 0, x:() => `Henrietta has the drawing-room carpet up to be beaten. Then the curtains come down. Then the sweep comes.

You are moved from room to room with your newspaper for a week.

On Saturday a housemaid finds you in the still-room. She asks if you want anything.`},
    {id:'home-cedar', w:() => S.season === 1, x:() => `Hot. The family sits under the cedar with a jug of orgeat. Nobody reads.

At four a wasp gets into the jug. Henrietta sends for another jug.

You enter it in your pocket-book. There is nothing else to enter.`},
    {id:'home-nutting', w:() => S.season === 2, x:() => `You go nutting in Cuckoo Copse with Henrietta. She has not been since she was fifteen.

She tears her gown on a bramble. She says nothing about it. You come home at dusk with a peck of hazel nuts.

Mrs Bunce looks at the gown. Then she looks at you.`},
    {id:'home-fish', w:() => S.season === 3, x:() => `Snow. The family is shut in nine days. You play at speculation every night for mother-of-pearl fish.

On the ninth night Henrietta turns up the ace of trumps three deals running.

You owe her four hundred fish. She has it written down.`},
    {id:'home-rabbits', w:() => edmundAt() === 'home', x:() => `You walk the Down with Edmund and two guns. He kills seven rabbits. You kill two. He carries the nine.

Going home he asks how the farms were let in his great-uncle’s time. You tell him.

He knew it already. He lets you finish.`},
    {id:'home-pin', w:() => edmundAt() === 'army' || edmundAt() === 'navy', x:() => `Henrietta keeps the map of Europe open on the library table. There is a pin in it for Edmund. She moves the pin when a letter comes.

This week there is no letter.

She comes in each morning before breakfast. She looks at the pin. She goes out again.`},
    {id:'home-stocking', w:() => edmundAt() === 'dead', x:() => `A quiet week. Henrietta sits in the window with her work. It is a grey stocking. She began it before the letter came.

On Thursday you see her unpick a row. On Friday she knits it again.

You sit with her. Neither of you has a book.`},
    {id:'home-flea', w:() => F('kittyBotanist') && kittyHome(), x:() => `Kitty has the microscope on the breakfast table. There is a flea under it.

She makes you look. Then Henrietta. Henrietta looks for some time.

She rings the bell. The dogs are washed before noon.`},
    {id:'home-linen', w:() => !kittyHome(), x:() => `Henrietta goes up to count the linen in Kitty’s old room. She is gone an hour.

You find her sitting on the bed. The press is open. Nothing is counted.

You count it together. Fourteen pair of sheets.`},
    {id:'home-coverley', w:() => T('lovematch'), x:() => `Henrietta has the fiddler up from the Bell. She has not told you why. It is the day of the Newbury assembly, by the calendar.

You dance Sir Roger de Coverley in the hall. There are only the two of you. The housemaids watch through the baize door.

You are both out of breath at the third figure.`},
    {id:'home-drip', w:() => T('portion'), x:() => `It rains at dinner. A drop falls on the cloth between the mutton and Henrietta.

She looks at the drop. She looks at the ceiling. She moves the mustard pot under it.

Nothing is said. You send for the slater on Monday.`},
    {id:'home-flannel', w:() => gouty(), x:() => `The foot is in flannel on a stool. Henrietta reads you the Mercury from the first advertisement to the last.

You are civil as far as the price of oats. Then the dog is sent out. Then the footman.

Henrietta finishes the column.`},
    {id:'home-sextant', w:() => crewAboard(), x:() => `At noon you take the sextant up to the leads. Tarbuck holds the watch.

You make the Hall fifty-one degrees, twenty-four minutes North. It was the same on Tuesday.

“Has the house moved?” says Henrietta at dinner.`},
    {id:'home-indians', w:() => T('soldier'), x:() => `After dinner you tell the curate about Guilford Court House.

Henrietta takes up her work at “It was a wet morning”. At “the colours” her lips move with yours.

She puts in the Indians before you come to them.`},
    {id:'home-barleybread', w:() => dear(), x:() => `Henrietta brings the house books to the library. Flour last year, £31. Flour this year, £58. Candles are up a third.

She has put the servants’ hall on barley bread two days in the week. She has put the parlour on it too.

You eat it at dinner. You say it is very good.`},
    {id:'home-swing', w:() => edmundAt() === 'farmer' && S.year >= 1809, x:() => `Edmund’s children are at the Hall for the week. You have a swing put up on the cedar.

The eldest goes too high and is sick. The second falls off. The youngest bites the gardener.

Henrietta has not been so happy since the wedding.`}
  ],
  town:[
    {id:'town-siddons', x:() => `You take a house in Upper Brook Street for ten weeks. You see Mrs Siddons in Lady Macbeth. You sleep with a candle for a fortnight after.

Henrietta goes to the Drawing Room in a hoop and feathers. For three days she comes through every door sideways.`},
    {id:'town-duke', x:() => `London. A man treads on you at the Opera. Tattersall’s sells you a bay with a spavin.

A duke cuts you in St James’s Street. He has taken you for another man. He is told your name. He cuts you again.

Henrietta puts all of it in her letters to Mrs Tamworth.`},
    {id:'town-staircase', x:() => `Ten weeks of routs. At Lady Salt’s three hundred people stand on a staircase from ten until midnight. You are on the ninth stair. You do not reach the drawing-room.

Next morning you leave your card to say you were there.`},
    {id:'town-vauxhall', w:() => S.year <= 1805, x:() => `Vauxhall. Three thousand lamps. You pay four shillings for a plate of ham. You can read the Morning Post through a slice.

The Duchess of Devonshire goes by with her party. Henrietta counts the feathers.

Eleven.`},
    {id:'town-candles', w:() => S.year === 1814, x:() => `The news comes from Paris on a Saturday. Bonaparte has abdicated.

On Monday night there are candles in every window of Brook Street. A crowd goes down the street breaking the dark ones.

Your landlady has put six candles to a pane. She puts them on your bill. £2.`},
    {id:'town-burdett', w:() => S.year === 1810, x:() => `Sir Francis Burdett is to go to the Tower. The crowd holds Piccadilly. Your hackney coach is stopped at Albemarle Street.

A man puts his head in at the window.

“Burdett for ever?”

“By all means,” you say.

He chalks a B on the door. The Life Guards ride by ten minutes after. The coachman rubs it off with his sleeve.`},
    {id:'town-coat', x:() => `Your tailor in Conduit Street shows you the new cut. No lace. Hardly any skirts. The collar stands up to the ears.

You order it in blue.

On your first Sunday at Hatherley you wear it to church. The dogs bark at you in the yard.`},
    {id:'town-levee', w:() => swans() && S.year <= 1810, x:() => `You go to the Levee. The King comes down the line. He stops.

“${S.sur}, what, what? Swans, hey? How are the swans?”

“Very well, sir.”

“How many? How many?”

“A good many, sir.”

He passes on to a bishop.`},
    {id:'town-brooks', w:() => T('play'), x:() => `You look in at Brooks’s for a quarter of an hour.

You come out at six. A milk-woman is crying her milk in St James’s Street. You have nine guineas and a viscount’s note of hand.

Tidmarsh will not discount the viscount.`},
    {id:'town-partners', w:() => kittyHome() && S.year <= 1805, x:() => `Kitty has eleven partners at Lady Salt’s ball. Henrietta writes each name in her pocket-book with his acres beside it.

Seven are younger sons. Two are in the Foot. One is a Whig.

The eleventh asked twice. He has a living in Norfolk and a mother.`},
    {id:'town-admiralty', w:() => T('captain'), x:() => `You call at the Admiralty. Forty post-captains are in the waiting-room before you. Not one has a ship.

The porter knows every man by name. Their Lordships will write.

You leave your card on the pile. It is a tall pile.`},
    {id:'town-turner', w:() => S.year >= 1801, x:() => `Henrietta takes you to the Exhibition at Somerset House. Nine hundred pictures. You count forty-one gentlemen holding horses.

In the next room a Mr Turner has painted a storm at sea.

“It wants finishing,” says a lady beside you.

Henrietta stands before it a long while. She says nothing in the coach.`},
    {id:'town-prices', w:() => dear(), x:() => `London in a dear year. The quartern loaf is one and tenpence at the baker’s in Mount Street. Your landlady has a notice in the hall. Lodgers find their own bread.

At Lady Salt’s there are four hundred to supper. There are rolls at every plate.

Henrietta puts two in her reticule.`}
  ]
};
let LAST_CUT = null;
/* Draws an outcome that fits the season and has not been seen, or was seen longest ago. */
function outcome(kind){ const all = OUTCOMES[kind].filter(o => !o.w || o.w()); S.did = S.did || {};
  const fresh = all.filter(o => S.did[o.id] === undefined);
  const pool = fresh.length ? fresh : all.slice().sort((a, b) => S.did[a.id] - S.did[b.id]).slice(0, Math.max(1, Math.ceil(all.length / 3)));
  // a piece that needs something particular (a season, a trait, a farm) is three times as likely as one that could happen any year
  const bag = []; for (const o of pool) { bag.push(o); if (o.w) bag.push(o, o); }
  const o = pick(bag); S.did[o.id] = S.t; LAST_CUT = o.id; return o.x(); }

const UNDERTAKINGS = [
  { id:'ride', t:'Ride round the tenancies', hint:'Goodwill', go:() => { add({goodwill: T('gout') && !F('goutEased') ? 2 : 4}); return outcome('ride'); }},
  { id:'dine', t:'Dine the county', note:'£70', hint:'Standing', go:() => { add({money:-70, standing:4}); return outcome('dine'); }},
  { id:'sessions', t:'Sit on the bench at Quarter Sessions', hint:'Standing', go:() => { const g = pick([-2, 0, 2, 3]); add({standing: T('silver') ? 5 : 3, goodwill:g}); return outcome('sessions'); }},
  { id:'home', t:'Keep at home with the family', hint:'Household', go:() => { add({family:5}); return outcome('home'); }},
  { id:'town', t:'Go up to London for the Season', note:'£350', hint:'Standing, Household', if:() => S.season === 0, go:() => { add({money:-350, standing:6, family:4}); reg('henrietta',1); return outcome('town'); }},
  { id:'retrench', t:'Retrench', note:'+£130', hint:'Costs Standing and Household', go:() => { add({money:130, standing:-3, family:-3}); return pick([
      `You sell the second carriage and two hunters. You sell the claret your uncle laid down for a christening. There was no christening.

“We are to live like curates,” says Henrietta. She says it at dinner, before the servants.`,
      `One footman is turned off. The hot-house fires are let out. Mutton four days in seven.

The pine-apples die within the week. Mrs Bunce puts a black ribbon in her cap.`,
      `You shut up the east wing. You sell the timber in Cuckoo Copse. The woodmen are a month felling it.

The rooks come over to the Hall roof. They are there each morning when you go out.`]); }}
];

function undertakingOptions(){
  const o = UNDERTAKINGS.filter(u => u.id !== 'retrench' && (!u.if || u.if())).map(u => ({t:u.t, note:u.note, hint:u.hint, run:() => { const r = u.go(); return r; }})).concat(estOptions());
  return o;
}
function undertake(i){ const u = undertakingOptions()[i]; const b = snapshot(); LAST_CUT = null; const text = u.run();
  S.journal.unshift({when:stamp(), title:'The season’s undertaking', did:u.t});
  S.outcome = {title:u.t, text, d:deltas(b), cut:LAST_CUT}; S.phase = 'undone'; save(); render(); }

function next(){
  if (S.phase === 'ledger') { if (S.dead) return finish(); S.phase = S.pending ? 'event' : 'undertake'; }
  else if (S.phase === 'outcome') { if (S.dead) return finish(); S.phase = 'undertake'; }
  else if (S.phase === 'undone') { S.t++; if (S.t >= (LAST_YEAR - FIRST_YEAR + 1) * 4) return finish(); S.year = FIRST_YEAR + Math.floor(S.t / 4); S.season = S.t % 4; beginSeason(); }
  save(); render(); window.scrollTo({top:0, behavior:'smooth'});
}
function finish(){ S.phase = 'end'; save(); render(); window.scrollTo({top:0}); }

function setRent(v){ S.rentPolicy = v; setRentAll(v); save(); render(); }
function mortgage(d){ if (d < 0 && S.money >= 500 && S.mortgage >= 500) { S.mortgage -= 500; S.money -= 500; } if (d > 0 && canBorrow()) { S.mortgage += 500; S.money += borrowGets(); } save(); render(); }

/* ---------- the reckoning ---------- */
function reckoning(){
  const net = S.money - S.mortgage + ownLandValue(), k = S.flags.kitty || 'free', e = S.flags.edmund, P = [];
  if (S.dead === 'duel') { P.push(`DIED, on Thursday last, on Hatherley Down, of a pistol ball, ${S.name}, Esquire, of Hatherley Combe in this county, in the ${S.year - 1795 + 46}th year of his age. The Coroner’s jury sat one quarter of an hour. Verdict, Misadventure while shooting rooks.`);
    P.push(`Captain Vane has gone abroad for his health. The estates pass to the widow. She is reported to have said that she told him so.`);
    return {title:'Shot at Dawn', P, score:null}; }
  if (S.dead === 'ruin') { P.push(`TO BE SOLD BY AUCTION, by Mr Skinner, at the George Inn, Wyvern, by order of the Mortgagees: the capital Freehold Estate of HATHERLEY COMBE, comprising a Mansion House of fifty-four windows, eleven Farms, a Water Corn Mill${F('enclosed') ? ', and four hundred acres of newly inclosed Land' : ', with Rights over an extensive Common'}. Particulars of Mr Spurling, Attorney, Wyvern.`);
    P.push(`${S.name}, Esquire, late of that place, has removed with his family to Douglas in the Isle of Man. The King’s writ for debt does not run there. He walks on the pier most mornings.`);
    P.push(`The Earl of Cullerne is expected to bid.`);
    return {title:'Sold Up', P, score:null}; }

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
  const kl = {vane:`His daughter is Mrs Vane. ${F('kittySettled') ? 'She lives at Northampton on forty pounds a year. Her husband cannot touch it.' : 'She follows the Captain from garrison to garrison. His creditors follow one town behind.'}`,
    pinch:F('kittyManumit') ? `His daughter is the widow of Mr Pinch of Bristol. She has given freedom to three hundred persons in Jamaica. It took the greater part of her fortune. Clifton thinks her out of her mind. Hatherley thinks her the pick of the family.` : F('kittyWidow') ? `His daughter is the widow of Mr Pinch of Bristol. She is very rich. She does not say where the money came from.` : `His daughter is Mrs Pinch, of Clifton. She keeps two carriages.`,
    oakes:`His daughter married the ${F('oakesVicar') ? 'curate. He is now the vicar' : 'curate. He is the curate still'}. She has five children and no carriage. She has not once said she is sorry.`,
    dubreuil:`His daughter is Madame Dubreuil, of Saint-Malo. She keeps bees. Mrs Tamworth has begun to ask after her.`,
    free:F('kittyBotanist') ? `His daughter is unmarried. An orchid of her finding is figured in Sowerby’s English Botany. Her name is printed under it.` : `His daughter is unmarried and lives at home. She is thirty-eight. She is very good with the dogs.`};
  P.push(kl[k]);
  if (F('edmundDead')) P.push(`His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur} of the 52nd, lies in the orchard of a farm in Brabant. There is a tablet in Hatherley church. His mother has had the pew moved to face it.`);
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
  let title = 'A Tolerable Squire';
  if (S.goodwill >= 68 && S.family >= 55) title = 'The Good Squire of Hatherley';
  else if (net > 8000 && S.goodwill < 36) title = 'The Rack-Renter';
  else if (S.standing >= 72 && S.goodwill < 50) title = 'A Coming Man';
  else if (S.goodwill < 30) title = 'The Man in the Song';
  else if (S.family < 30) title = 'Master of an Empty House';
  else if (S.goodwill >= 60) title = 'A Fair Man';
  P.push(`He is ${S.year - 1795 + 46}, and in tolerable health. He has been heard to say that the next twenty years cannot be as troublesome as the last.`);
  return {title, P, score};
}

/* ---------- saving ---------- */
function save(){ try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (err) {} }
function load(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.chars && s.phase) { if (!s.works) { s.works = s.project ? [s.project] : []; delete s.project; } return s; } } catch (err) {} return null; }
function wipe(){ try { localStorage.removeItem(SAVE_KEY); } catch (err) {} S = null; render(); }

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

const PROJECTS = {
  enclosure:{ name:'The Hatherley Inclosure Bill', seasons:3, cost:() => F('allotments') ? 1400 : 1200, hidden:true,
    done:() => { fl('enclosed'); add({goodwill: F('allotments') ? -6 : -16, standing:3}); if (!F('allotments')) reg('pryor',-2,'Lost his cow-gate when the common was enclosed'); later('commonRiot', 1);
      return F('allotments') ? `The Hatherley Inclosure Act has the Royal Assent. The Commissioners read the award in the vestry.

To ${S.name}, Esquire, 400 acres. To the Earl of Cullerne, 190. To the Vicar in lieu of tithe, 110. To the cottagers, sixty plots of one acre.

The clerk rolls up the map. There is no common on it.` : `The Hatherley Inclosure Act has the Royal Assent. Forty other parishes had theirs in the same session. The Commissioners read the award in the vestry.

To ${S.name}, Esquire, 400 acres. To the Earl of Cullerne, 190. To the Vicar in lieu of tithe, 110. To nineteen cottagers who could show no deed, nothing.

Jem Pryor stands up at the back. His family has turned a cow out there since Queen Anne.

“Have you that in writing?” says the clerk.`; }},
  drain:{ name:'Drain and marl the clay at Kennet Bottom', seasons:2, cost:() => F('hartoppFriend') ? 420 : 520,
    done:() => { S.improve += 2; return `The drains are in at Kennet Bottom. There are nine miles of them, laid with stone and blackthorn.

You walk the low fields from end to end. Your boots come home on your feet.`; }},
  fourcourse:{ name:'Put the home farm under the Norfolk four-course', seasons:1, cost:() => F('hartoppFriend') ? 200 : 260,
    done:() => { S.improve += 1; reg('hartopp',1); return `Wheat, turnips, barley, clover. Then wheat again. There is no fallow on the home farm this year.

The old carter stands at the gate of Twelve Acres.

“That ground ent had a rest since Lady Day twelvemonth, sir.”

He shakes his head at it.`; }},
  cottages:{ name:'Build six brick cottages on the Kintbury lane', seasons:2, cost:() => 360,
    done:() => { fl('cottages'); add({goodwill:9}); return `Six cottages stand on the Kintbury lane. Brick walls. Tiled roofs. Two bedrooms, a bread oven and a pigsty to each.

The six families walk through on Saturday. Nobody speaks. They put their hands on the walls.

One woman stops at the foot of the stairs.

“Is the upstairs ours and all, sir?”`; }},
  oaks:{ name:'Plant forty acres of oak for the Navy', seasons:1, cost:() => 120,
    done:() => { fl('oaks'); add({standing:2}); return `Forty acres of acorns are dibbled in on Gallows Piece.

The nurseryman from Newbury says they will make ship timber in a hundred and twenty years. You ask him to say it again.

You ride home at a walk.`; }},
  icehouse:{ name:'Sink an ice-house in the north shrubbery', seasons:1, cost:() => 140,
    done:() => { fl('icehouse'); add({family:5}); reg('henrietta',1); return `The ice-house is sunk in the north shrubbery. It is a brick egg under a mound of earth. The men are to fill it from the carp pond at the first hard frost.

Henrietta has written to Gunter’s for a receipt for lemon ice. She has asked the Tamworths already.`; }}
};
function startProject(id){ const p = PROJECTS[id]; const cost = p.cost(); S.project = {id, left:p.seasons, per:Math.round(cost / p.seasons)}; S.projectsDone[id] = 'begun'; }

function newGame(first, sur){
  S = { name:(first + ' ' + sur).trim(), sur, t:0, year:FIRST_YEAR, season:0, phase:'ledger',
    money:900, mortgage:4000, standing:40, goodwill:50, family:60,
    improve:0, rentPolicy:1, rentAdj:1, poorMult:1, game:3, canal:0, yearIncome:0,
    flags:{}, chars:{}, queue:[], seen:{}, journal:[], project:null, projectsDone:{}, dead:null,
    ledger:[], notes:[], pending:null, vignette:null, outcome:null, priceSeen:[] };
  for (const id in PEOPLE) S.chars[id] = {r:PEOPLE[id].r, met:PEOPLE[id].met, notes:[]};
  beginSeason();
}

function halfRent(){ return 810 * S.rentPolicy * S.rentAdj * (1 + 0.05 * S.improve) * (F('enclosed') ? 1.3 : 1); }

function beginSeason(){
  const y = S.year, q = S.season, P = PRICES[y], pi = P / 75;
  const L = []; S.notes = [];
  const line = (label, amt) => { amt = Math.round(amt); if (amt) { L.push([label, amt]); S.money += amt; } };
  if (q === 0) { S.yearIncome = 0; if (!S.priceSeen.includes(y)) S.priceSeen.push(y); }
  if (q === 0 && [1800, 1805, 1810].includes(y)) { S.rentAdj *= 1.12; S.notes.push('Leases fallen in have been re-let at war prices. The rental rises by an eighth.'); }
  if (q === 0 || q === 2) {
    let a = (S.rentPolicy - 1) * 0.7 + Math.max(0, 0.95 - pi) * 0.5 + (45 - S.goodwill) / 350;
    if (S.t >= 79 && !F('abated')) a += F('abatedHalf') ? 0.1 : 0.22;
    a = clamp(a, 0, 0.5);
    const due = halfRent(), got = due * (1 - a);
    line(QUARTER[q] + ' rents received', got); S.yearIncome += got;
    if (a > 0.04) S.notes.push('Rents in arrear this half-year: ' + fmt(due - got) + '.');
    if (S.rentPolicy > 1) add({goodwill:-4}); else if (S.rentPolicy < 1) add({goodwill:2});
  }
  if (q === 1) { const w = 100 + (F('merino') ? (y < 1811 ? 110 : 15) : 0) + (F('merinoRam') ? 15 : 0); line('The wool clip', w); S.yearIncome += w;
    if (F('merino') && y === 1811) S.notes.push('The merino mania has burst. Rams bought at forty guineas go to the butcher at forty shillings.'); }
  if (q === 2) { const qtrs = Math.round(140 * WEATHER[y] * (1 + 0.06 * S.improve)); const v = qtrs * P / 20; line('Home farm wheat, ' + qtrs + ' qrs at ' + P + 's.', v); S.yearIncome += v; }
  if (S.canal && y >= 1810) { line('Kennet & Avon dividend', 7 * S.canal); }
  line('Household, stables and servants', -((280 + S.standing * 1.6) * (1 + 0.022 * (y - 1795)) - (F('bricked') ? 3 : 0)));
  if (S.mortgage > 0) line('Interest on the mortgage', -S.mortgage * (F('cheapCredit') ? 0.04 : 0.05) / 4);
  if (F('wages')) line('Home farm wages above the common rate', -30);
  if (F('crabbeSkims') && !F('crabbeGone')) line('“Sundries” (Mr Crabbe)', -45);
  if (F('mp') && q === 0) line('Lodgings in Half Moon Street for the session', -160);
  if (S.project) { line(PROJECTS[S.project.id].name, -S.project.per); S.project.left--;
    if (S.project.left <= 0) { const id = S.project.id; S.project = null; S.projectsDone[id] = 'done'; S.notes.push(PROJECTS[id].done()); } }
  if (q === 3) {
    line('Poor rate', -130 * S.poorMult * pi * (F('speen') ? 1.6 : 1));
    line('Land tax', -110);
    if (y >= 1799 && y !== 1802) { const rate = y <= 1801 ? 0.1 : y <= 1805 ? 0.05 : 0.1; line('Income tax at ' + (rate * 100) + ' per cent', -S.yearIncome * rate * (F('taxDodge') ? 0.5 : 1)); }
  }
  if (S.money < 0) { line('Interest on tradesmen’s bills and notes of hand', S.money * 0.03); add({standing:-1}); S.notes.push('You are living on credit. Wyvern has noticed.'); }
  // Nothing keeps without tending: regard, like a hedge, grows out.
  if (S.t > 0) { const dear = P >= 95 && !F('soup') && !F('wages');
    add({standing: S.standing > 60 ? -2 : -1, goodwill: (S.goodwill > 60 ? -2 : -1) - (dear ? 1 : 0), family: S.family > 60 ? -2 : -1});
    if (dear && q === 3) S.notes.push('Bread at famine price. The parish looks at the Hall, and counts its chimneys.'); }
  S.ledger = L;
  S.news = NEWS[y + '-' + q] || null;
  S.pending = pickEvent();
  S.vignette = S.pending ? null : pick(VIGNETTES[q]);
  S.phase = 'ledger';
  if (S.money < -3000) { S.dead = 'ruin'; }
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
  { id:'ride', t:'Ride round the tenancies', hint:'Goodwill', go:() => { add({goodwill:4}); return pick([
      `You ride the eleven farms in a day and a half. You are given cider. Then perry. A cold pie. Cider again. At Starveall the tenant lifts your horse’s off fore and tells you what he would do. At the mill you are given a dog.`,
      `At Kennet Bottom the Widow Harris takes you up her stairs. She shows you the hole in the thatch. It comes on to rain while you stand under it.

“I will send the thatcher, Mrs Harris.”

“So the old Squire said, sir.”`,
      `A wet week in the saddle. At every farm you learn the children’s names. By Friday you have thirty-one. Three of the boys were christened Barnaby.`,
      `You walk the bounds of Starveall with the tenant. He stops at every gate that wants hanging.

“Your gate, sir.”

The hedges are new laid.

“My hedges,” he says.`]); }},
  { id:'dine', t:'Dine the county', note:'£70', hint:'Standing', go:() => { add({money:-70, standing:4}); return pick([
      `Three removes for sixteen. The Bishop’s chaplain is helped twice to the turbot and three times to the saddle.

“Your turbot is very brave,” says Lady Cullerne.

At two in the morning you are awake. You are turning the word over.`,
      `You dine at the Tamworths’. You dine at the Lovedays’. You dine at Hartopp’s. Then the county dines with you.

Mrs Bunce sends up a haunch that has hung five weeks. Old Mr Tamworth calls it the best he ever ate. The dogs will not come into the room.`,
      `You are steward of the ball at the Wyvern Assembly Rooms. Candles, £3 4s. Negus, £2 10s. Three fiddlers at half a guinea.

At eleven old Mrs Loveday sits down on the first fiddler’s bow. A new bow, 7s. 6d.`,
      `Venison for nine magistrates and a colonel.

At the second bottle the Colonel takes Paris. At the third the Chairman gets the harvest in. At the fourth Mr Tamworth walks into the china closet and wishes the company good night.`]); }},
  { id:'sessions', t:'Sit on the bench at Quarter Sessions', hint:'Standing', go:() => { const g = pick([-2, 0, 2, 3]); add({standing:3, goodwill:g}); return pick([
      `A man has stolen a goose. You order him whipped. A woman stole it back from him. One month.

The goose is brought into court in a hamper. It bites the clerk.`,
      `A bastardy case from Kintbury. The girl names three men. Each takes the oath. Each swears it was one of the other two.

You make the order on all three. Eighteen pence a week between them.`,
      `All day in the Shire Hall over a bridge. Each parish in the hundred swears it belongs to the next. The surveyor unrolls a map of 1740. The bridge is on the fold.

The Bench rises at six. Tonight the bridge has no owner.`,
      `You license eleven alehouses. You refuse the twelfth.

You sign an order removing Ann Giles, pauper, to Andover, the parish of her birth. It is forty miles. The overseer of Andover has written already. He says she was born in a wagon.`]); }},
  { id:'home', t:'Keep at home with the family', hint:'Household', go:() => { add({family:5}); const a = [
      `You stay at home. You play backgammon with Henrietta every evening. She moves a man with her sleeve when you look at the fire.

You look at the fire a good deal.`,
      `Rain all the week. You read Tom Jones in the library for the sixth time. Henrietta nets a purse.

Between rows she tells you what is amiss with the families of Berkshire. She takes them by the alphabet. On Friday she is at the Lovedays.`,
      `“At home all this Week. Shot nothing, signed nothing, taught the Dogs nothing. Dined each Day upon what there was. Have not passed a better Week since Christmas.”`];
      if ((S.flags.kitty || 'free') === 'free') a.push(`Kitty reads Mrs Radcliffe aloud after dinner. She does every voice. The wicked monk has ${F('gallDead') ? 'the late Dr Gall’s' : 'Dr Gall’s'} cough.

Henrietta counts her stitches. Nobody looks up.`);
      return pick(a); }},
  { id:'town', t:'Go up to London for the Season', note:'£350', hint:'Standing, Household', if:() => S.season === 0, go:() => { add({money:-350, standing:6, family:4}); reg('henrietta',1); return pick([
      `You take a house in Upper Brook Street for ten weeks. You see Mrs Siddons in Lady Macbeth. You sleep with a candle for a fortnight after.

Henrietta goes to the Drawing Room in a hoop and feathers. For three days she comes through every door sideways.`,
      `London. A man treads on you at the Opera. Tattersall’s sells you a bay with a spavin.

A duke cuts you in St James’s Street. He has taken you for another man. He is told your name. He cuts you again.

Henrietta puts all of it in her letters to Mrs Tamworth.`,
      `Ten weeks of routs. At Lady Salt’s three hundred people stand on a staircase from ten until midnight. You are on the ninth stair. You do not reach the drawing-room.

Next morning you leave your card to say you were there.`]); }},
  { id:'retrench', t:'Retrench', note:'+£130', hint:'Costs Standing and Household', go:() => { add({money:130, standing:-3, family:-3}); return pick([
      `You sell the second carriage and two hunters. You sell the claret your uncle laid down for a christening. There was no christening.

“We are to live like curates,” says Henrietta. She says it at dinner, before the servants.`,
      `One footman is turned off. The hot-house fires are let out. Mutton four days in seven.

The pine-apples die within the week. Mrs Bunce puts a black ribbon in her cap.`,
      `You shut up the east wing. You sell the timber in Cuckoo Copse. The woodmen are a month felling it.

The rooks come over to the Hall roof. They are there each morning when you go out.`]); }}
];

function undertakingOptions(){
  const o = UNDERTAKINGS.filter(u => !u.if || u.if()).map(u => ({t:u.t, note:u.note, hint:u.hint, run:() => { const r = u.go(); return r; }}));
  if (!S.project) for (const id in PROJECTS){ const p = PROJECTS[id]; if (p.hidden || S.projectsDone[id]) continue;
    o.push({t:p.name, note:fmt(p.cost()) + (p.seasons > 1 ? ' over ' + p.seasons + ' seasons' : ''), hint:'A work', project:true, run:() => { startProject(id); return `The work is put in hand. ${F('crabbeGone') ? 'Lark' : 'Crabbe'} brings the estimate in his best copperplate. It is two pages. You sign at the foot of the first.`; }}); }
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

function setRent(v){ S.rentPolicy = v; save(); render(); }
function mortgage(d){ if (d < 0 && S.money >= 500 && S.mortgage >= 500) { S.mortgage -= 500; S.money -= 500; } if (d > 0 && S.mortgage < 9000) { S.mortgage += 500; S.money += 500; } save(); render(); }

/* ---------- the reckoning ---------- */
function reckoning(){
  const net = S.money - S.mortgage, k = S.flags.kitty || 'free', e = S.flags.edmund, P = [];
  if (S.dead === 'duel') { P.push(`DIED, on Thursday last, on Hatherley Down, of a pistol ball, ${S.name}, Esquire, of Hatherley Combe in this county, in the ${S.year - 1795 + 46}th year of his age. The Coroner’s jury sat one quarter of an hour. Verdict, Misadventure while shooting rooks.`);
    P.push(`Captain Vane has gone abroad for his health. The estates pass to the widow. She is reported to have said that she told him so.`);
    return {title:'Shot at Dawn', P, score:null}; }
  if (S.dead === 'ruin') { P.push(`TO BE SOLD BY AUCTION, by Mr Skinner, at the George Inn, Wyvern, by order of the Mortgagees: the capital Freehold Estate of HATHERLEY COMBE, comprising a Mansion House of fifty-four windows, eleven Farms, a Water Corn Mill${F('enclosed') ? ', and four hundred acres of newly inclosed Land' : ', with Rights over an extensive Common'}. Particulars of Mr Spurling, Attorney, Wyvern.`);
    P.push(`${S.name}, Esquire, late of that place, has removed with his family to Douglas in the Isle of Man. The King’s writ for debt does not run there. He walks on the pier most mornings.`);
    P.push(`The Earl of Cullerne is expected to bid.`);
    return {title:'Sold Up', P, score:null}; }

  P.push(`${S.name}, Esquire, has now held Hatherley Combe one-and-twenty years. This paper has made enquiry in the county.`);
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
function load(){ try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.chars && s.phase) return s; } catch (err) {} return null; }
function wipe(){ try { localStorage.removeItem(SAVE_KEY); } catch (err) {} S = null; render(); }

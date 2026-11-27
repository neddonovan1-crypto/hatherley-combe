/* The rent roll. The squire does not farm these acres. He sets the terms on which other people do.
   Numbers and reasoning: docs/economy/DESIGN.md. The paper model they were balanced on: tools/econsim.js. */

// Wheat before the game opens. It only feeds the trailing averages.
const WHEAT_BEFORE = {1785:43,1786:40,1787:42,1788:46,1789:53,1790:55,1791:49,1792:43,1793:49,1794:52};
const wheatOf = y => PRICES[y] || WHEAT_BEFORE[y] || 76;
const trail = (y, n) => { let s = 0; for (let i = 1; i <= n; i++) s += wheatOf(y - i); return s / n; };
/* Two indices, both 1.0 for the rent a farm in fair order paid in 1795.
   market(y): what the farm would fetch if let this Lady Day. Bidders reason from the last five years, and rents never fell of their own accord while the war lasted.
   means(y): what a tenant can find out of the harvest of year y. The same long view, knocked about by that year's price and weather. */
const warRise = y => 0.02 * Math.min(y, 1813) - 0.02 * 1795 - 0.06 * Math.max(0, y - 1813);
const structOf = y => 0.55 + 0.45 * trail(y, 5) / 50 + warRise(y);
const MARKET = {};
for (let y = FIRST_YEAR; y <= LAST_YEAR + 1; y++){
  const view = y > 1813 ? 0.6 * trail(y, 5) + 0.4 * wheatOf(y - 1) : trail(y, 5), m = 0.55 + 0.45 * view / 50 + warRise(y);
  MARKET[y] = y === FIRST_YEAR ? 1 : y <= 1813 ? Math.min(Math.max(m, MARKET[y - 1]), MARKET[y - 1] * 1.07) : m; }
const market = y => MARKET[y] || 1;
function means(y){ const pe = 0.55 * wheatOf(y) + 0.45 * trail(y, 3), wf = 1 - (1 - (WEATHER[y] || 1)) * 0.3;
  return structOf(y) * Math.pow(pe / trail(y, 5), 1.7) * wf; }

const COND = [0.70, 0.85, 1.0, 1.15, 1.30];
const ORDER_W = ['Ruinous', 'Neglected', 'In fair order', 'In good order', 'In high order'];
const MEANS_W = ['Nothing laid by', 'Pinched', 'Getting by', 'Easy', 'Warm'];
const LEVEL = {easy:0.88, fair:1.0, rack:1.13};
const MAX_FARMS = 5;
const INCOMERS = [['Mr Lanfear', 'Lambourn'], ['Mr Wicks', 'Hungerford'], ['Mr Goddard', 'Aldbourne'], ['Mr Ilsley', 'Speen'], ['Mr Nalder', 'Chieveley'], ['Mr Chivers', 'Shefford'], ['Mr Tubb', 'Inkpen'], ['Mr Hazell', 'Boxford']];
const five = n => Math.round(n / 5) * 5;

function startFarms(){ return [
  // base: the 1795 rent the farm would bear in fair order.
  {id:'longbarrow', name:'Long Barrow', acres:600, base:590, cond:2, rent:540, lease:{type:'term', ends:1802, years:14}, level:'fair', K:700, arrears:0, tenant:'Mr Thorne'},
  {id:'kennet', name:'Kennet Bottom', acres:500, base:560, cond:1, rent:470, lease:{type:'will'}, level:'fair', K:200, arrears:0, tenant:'Widow Harris', she:true},
  {id:'church', name:'Church Farm', acres:550, base:610, cond:2, rent:610, lease:{type:'will'}, level:'fair', K:500, arrears:0, tenant:'Mr Froome', common:true}
]; }
const NEW_FARMS = {
  coldharbour:{name:'Coldharbour', acres:400, base:420, cond:2, tenant:'Mr Buckeridge'},
  starveall:{name:'Starveall', acres:180, base:105, cond:1, tenant:'Mr Dewey'},
  commonpiece:{name:'Common Piece', acres:300, base:230, cond:1}
};
const farm = id => S.farms.find(f => f.id === id);
function incomer(){ const used = S.farms.map(f => f.tenant), free = INCOMERS.filter(n => !used.includes(n[0])); return pick(free.length ? free : INCOMERS); }
function addFarm(id, o){ if (farm(id) || S.farms.length >= MAX_FARMS) return null;
  const d = NEW_FARMS[id], f = Object.assign({id, name:d.name, acres:d.acres, base:d.base, cond:d.cond, level:'fair', arrears:0, own:true, lease:{type:'will'}, tenant:d.tenant || incomer()[0]}, o || {});
  if (!f.rent) f.rent = five(0.95 * lettingValue(f, S.year)); if (f.K === undefined) f.K = 0.5 * f.rent;
  S.farms.push(f); return f; }
const mortCap = () => S.mortCap || 9000;

/* What makes one farm worth more than its acres: its order, the works done on it, the common gone. */
function farmF(f){ let x = COND[f.cond] * (f.mult || 1) * (1 + 0.025 * Math.min(S.improve, 10));
  if (f.common && F('enclosed')) x *= 1.3;
  if (f.id === 'kennet') x *= (F('newMill') ? 1.06 : 1) * (F('meadows') ? 1.08 : 1);
  return x; }
const lettingValue = (f, y) => five(market(y) * farmF(f) * f.base);
const rentDue = f => f.rent * S.rentAdj * (f.rebate ? 0.8 : 1);
const pro = f => f.she ? {he:'she', He:'She', him:'her', his:'her'} : {he:'he', He:'He', him:'him', his:'his'};

/* Older events and works speak in flags. This turns what they said into farms. */
function estateSync(){
  if (!S.farms) { S.farms = startFarms(); S.letQueue = []; S.payQueue = []; }
  const lb = farm('longbarrow'), kb = farm('kennet');
  if (lb && S.seen.thorneLease !== undefined && !lb.thorneDone) { lb.thorneDone = true; lb.arrears = 0; delete lb.void;
    lb.lease = {type:'term', ends:S.year + 7, years:7}; lb.since = S.year;
    if (F('nephewFarm')) { S.rentAdj /= 0.96; lb.rent = five(lb.rent * 0.96); lb.tenant = F('crabbeGone') ? 'Mr Pyke' : 'young Mr Crabbe'; lb.she = false; lb.K = 0.2 * lb.rent; lb.cond = Math.max(0, lb.cond - 1); }
    else { lb.tenant = 'Mrs Thorne'; lb.she = true; } }
  if (kb && S.projectsDone.drain === 'done' && !kb.drained) { kb.drained = true; kb.cond = Math.max(kb.cond, 2); }
  if (kb && F('edmund') === 'farmer' && kb.tenant !== 'Edmund') { kb.tenant = 'Edmund'; kb.she = false; kb.arrears = 0; delete kb.void; kb.since = S.year;
    kb.rent = five(0.88 * lettingValue(kb, S.year)); kb.lease = {type:'term', ends:S.year + 14, years:14}; kb.K = kb.rent; }
  if (F('starveall') && !farm('starveall') && !S.starveallDone) { S.starveallDone = true; S.rentAdj /= 1.09; addFarm('starveall'); }
}

/* Lady Day business: leases run out, rents from year to year are moved, farms mend or go back. */
function ladyDay(){ const y = S.year, st = steward(), up = [];
  for (const f of S.farms){ if (f.void) continue; const p = pro(f);
    if (f.rebate && y >= f.rebate) delete f.rebate;
    if (f.lease.type !== 'will' && y >= f.lease.ends) { f.lease = {type:'will'}; f.level = 'fair'; askLet(f.id, 'out'); continue; }
    if (f.lease.type === 'will' && !S.letQueue.some(x => x.id === f.id)) { const target = LEVEL[f.level] * lettingValue(f, y), was = f.rent;
      f.rent = five(target > f.rent ? Math.min(target, f.rent * 1.12) : Math.max(target, f.rent * 0.9));
      if (f.rent !== was) up.push(f.name + ' to ' + fmt(f.rent));
      if (f.level === 'rack' && f.cond > 0 && chance(0.12)) { f.cond--; S.notes.push(`${f.name} is going back. ${st} counted three fields in wheat after wheat.`); }
      else if (f.level !== 'rack' && f.cond < 2 && f.id !== 'kennet' && chance(0.2)) f.cond++; }
    const secure = f.lease.type !== 'will' && f.lease.ends - y >= 5 && f.lease.years >= 14;
    if (secure && f.K > 1.4 * f.rent && f.cond >= 1 && f.cond < 4) { f.K -= 0.9 * f.rent; f.cond++;
      S.notes.push(`${f.tenant} has drained and fenced at ${f.name} at ${p.his} own cost. ${st} enters the farm as ${ORDER_W[f.cond].toLowerCase()}.`); } }
  if (up.length) S.notes.push('Rents from year to year, moved this Lady Day: ' + up.join('; ') + '.'); }

function relet(f){ const n = incomer(); f.cond = Math.max(0, f.cond - 1); f.tenant = n[0]; f.she = false; f.arrears = 0; f.lease = {type:'will'}; f.level = 'fair'; f.since = S.year; delete f.void; delete f.rebate;
  f.rent = five(0.9 * lettingValue(f, S.year)); f.K = 0.3 * f.rent;
  S.notes.push(`${f.name} is let again, to ${n[0]} of ${n[1]}, from year to year at ${fmt(f.rent)}.`); }
function quit(f){ f.void = 2; f.arrears = 0; if (f.tenant === 'Mrs Thorne') reg('thorne', -2, 'Broke at Long Barrow under your rent'); }

/* The two rent days. Called from beginSeason with the ledger's own line(). */
function rentDay(line){
  estateSync();
  const y = S.year, q = S.season, hy = q === 0 ? y - 1 : y;   // Lady Day rents are paid out of last year's harvest
  if (q === 0) ladyDay();
  let racked = 0, easy = 0, n = 0, asked = false;
  for (const f of S.farms){
    const able = means(hy) * farmF(f) * f.base * (0.94 + S.goodwill / 800);
    if (f.void) { const v = Math.max(-0.075 * f.base, 0.175 * (able - 0.4 * f.base)); line(f.name + ', in hand', v); S.yearIncome += Math.round(v); f.void--; if (!f.void) relet(f); continue; }
    if (f.lease.type === 'corn') f.rent = five(LEVEL[f.lease.level] * 0.86 * f.base * farmF(f) * (0.5 * means(hy) + 0.5 * market(y)));
    const due = rentDue(f) / 2, surplus = able / 2 - due, val = lettingValue(f, y); let got = due;
    n++; if (rentDue(f) > 1.06 * val) racked++; else if (rentDue(f) < 0.92 * val) easy++;
    if (surplus >= 0) { const back = Math.min(f.arrears, surplus * 0.5); f.arrears -= back; got += back; f.K = Math.min(1.6 * f.rent, f.K + 0.3 * (surplus - back)); }
    else { f.K += surplus; if (f.K < 0) { const short = Math.min(due, -f.K); f.K = 0; got -= short; f.arrears += short;
      if (short >= 1) S.notes.push(`${f.tenant} of ${f.name} is ${fmt(short)} short this half-year.`); } }
    line(f.name + ', ' + f.tenant, got); S.yearIncome += Math.round(got);
    if (f.arrears > 0.9 * f.rent) { S.notes.push(`${f.tenant} has left ${f.name} owing ${fmt(f.arrears)}. The key was on a nail in the porch. The farm is in hand.`); quit(f); add({goodwill:-3}); }
    else if (!asked && f.arrears > 0.25 * f.rent && (f.asked === undefined || S.t - f.asked >= 4) && !S.payQueue.includes(f.id)) { asked = true; f.asked = S.t; S.payQueue.push(f.id); later('cannotPay', 0); }
  }
  if (n) add({goodwill: Math.round(-4 * racked / n + 2 * easy / n)});
}

/* ---------- what the book shows, and what the squire may do from it ---------- */
function tenureOf(f){ if (f.void) return 'In hand'; const l = f.lease;
  return l.type === 'will' ? 'From year to year' : (l.type === 'corn' ? 'Corn rent' : 'Lease') + ' to Lady Day ' + l.ends; }
function rentRoll(){ estateSync(); const y = S.year, open = S.phase !== 'end' && !S.dead;
  return S.farms.map(f => { const will = !f.void && f.lease.type === 'will', waiting = S.letQueue.some(x => x.id === f.id);
    return {id:f.id, name:f.name, acres:f.acres, tenant:f.void ? '' : f.tenant, rent:f.void ? 0 : Math.round(rentDue(f)), value:lettingValue(f, y),
      tenure:tenureOf(f), order:ORDER_W[f.cond], means:f.void ? '' : MEANS_W[Math.min(4, Math.floor(f.K / Math.max(1, f.rent) / 0.3))],
      arrears:Math.round(f.arrears), level:f.level, own:!!f.own, abated:!!f.rebate, waiting, canLevel:open && will && !waiting, canOffer:open && will && !waiting}; }); }
const LAND = {longbarrow:'Down and sheepwalk', kennet:'Wet clay, with the mill', church:'Strips in the open field', coldharbour:'Sound loam beyond the turnpike', starveall:'Thin chalk on the hill', commonpiece:'New ground off the common'};
/* For the Farms leaf of the book. held is ready to print; the rest is there for the page to draw as it likes. */
function farmsList(){ return rentRoll().map(f => { const bits = [f.tenure === 'In hand' ? 'In hand, no tenant' : f.tenure, f.order];
    if (f.abated) bits.push('A fifth abated'); if (f.arrears) bits.push('In arrear ' + fmt(f.arrears)); if (f.waiting) bits.push('Terms to be settled this quarter');
    return Object.assign(f, {land:(f.id === 'church' && F('enclosed') ? 'Inclosed arable' : LAND[f.id]), tenant:f.tenant || 'No tenant', held:bits.join('. ')}); }); }
const rentalNow = () => rentRoll().reduce((a, f) => a + f.rent, 0);
/* The old three-way rent policy still answers: it sets every farm held from year to year. */
function setRentAll(v){ const lvl = v < 1 ? 'easy' : v > 1 ? 'rack' : 'fair'; for (const f of S.farms) if (!f.void && f.lease.type === 'will') f.level = lvl; }
function setLevel(id, lvl){ const f = farm(id); if (!f || !LEVEL[lvl] || f.void || f.lease.type !== 'will') return; f.level = lvl; save(); render(); }
function askLet(id, why){ if (S.letQueue.some(x => x.id === id)) return; S.letQueue.push({id, why}); later('leaseFalls', 0); }
function offerLease(id){ const f = farm(id); if (!f || f.void || f.lease.type !== 'will') return; askLet(id, 'offer');
  S.journal.unshift({when:stamp(), title:'Rent roll', did:'Sent word to ' + f.tenant + ' about a lease of ' + f.name}); save(); render(); }

/* ---------- papers ---------- */
function letting(){ while (S.letQueue && S.letQueue.length){ const x = S.letQueue[0], f = farm(x.id); if (f && !f.void && f.lease.type === 'will') return {f, why:x.why}; S.letQueue.shift(); } return null; }
function owing(){ while (S.payQueue && S.payQueue.length){ const f = farm(S.payQueue[0]); if (f && !f.void && f.arrears >= 1) return f; S.payQueue.shift(); } return null; }
function sign(f, type, years, level, rent){ f.lease = type === 'will' ? {type:'will'} : {type, ends:S.year + years, years, level}; f.level = level; if (rent) f.rent = rent; if (!f.since) f.since = 1788; S.letQueue.shift(); }
const covenants = `no two white straw crops together, no hay or straw sold off the farm, the hedges kept`;

ev({ id:'leaseFalls', follow:true, cond:() => !!letting(),
  get title(){ const x = letting(); return x ? 'The Letting of ' + x.f.name : 'A Letting'; },
  text:() => { const {f, why} = letting(), p = pro(f), st = steward(), val = lettingValue(f, S.year);
    if (f.tenant === 'Mrs Thorne') meet('thorne');
    if (why === 'offer') return `You have sent word to ${f.tenant} that ${p.he} may have a lease of ${f.name}. ${p.He} holds it from year to year at ${fmt(f.rent)}.

${p.He} comes up to the Hall on Saturday in ${p.his} market coat. ${st} has the valuation ready on a half sheet. He puts the farm at ${fmt(val)} on a lease. A stranger, he says, would give ${fmt(five(val * 1.13))}.

“What term, sir?” says ${f.tenant}.`;
    return `The lease of ${f.name} ${S.season === 0 ? 'is out this Lady Day' : 'ran out at Lady Day'}. ${f.tenant} has had the ${f.acres} acres at ${fmt(f.rent)} a year.

${st} has walked the farm and brings his valuation on a half sheet. He puts it at ${fmt(val)} to a good tenant on a lease. He has two letters in his pocket from men who would give ${fmt(five(val * 1.13))}.

${f.tenant} is in the hall. ${p.He} has brought the old lease with ${p.him}.`; },
  choices:[
    {t:() => letting().why === 'offer' ? 'Leave things as they are.' : `Let ${pro(letting().f).him} hold on from year to year.`, note:'The rent moves each Lady Day', go:() => { const {f} = letting(), p = pro(f); sign(f, 'will', 0, 'fair');
      return `Nothing is signed. ${f.tenant} pays the half-year and asks whether the barn roof is ${p.his} to mend or yours. ${steward()} enters ${f.name} in the book as held from year to year.`; }},
    {t:'A lease of seven years.', note:() => fmt(lettingValue(letting().f, S.year)) + ' a year', go:() => { const {f} = letting(), r = lettingValue(f, S.year); sign(f, 'term', 7, 'fair', r);
      return `The lease is engrossed on one skin at Wyvern and read over in the steward’s room. ${f.tenant} signs. The rent is ${fmt(r)} until Lady Day ${S.year + 7}.`; }},
    {t:'A lease of fourteen years.', note:() => fmt(lettingValue(letting().f, S.year)) + ' a year', go:() => { const {f} = letting(), r = lettingValue(f, S.year); sign(f, 'term', 14, 'fair', r); add({goodwill:1});
      return `Fourteen years. ${steward()} reads the covenants aloud: ${covenants}. ${f.tenant} signs below your name. The rent is ${fmt(r)} until Lady Day ${S.year + 14}.`; }},
    {t:'Fourteen years at an easy rent, the tenant to drain and fence.', note:() => fmt(five(0.88 * lettingValue(letting().f, S.year))) + ' a year', go:() => { const {f} = letting(), p = pro(f), r = five(0.88 * lettingValue(f, S.year)); sign(f, 'term', 14, 'easy', r); add({goodwill:3});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 1, 'You gave her fourteen years at a rent she could mend the farm on');
      return `The rent is set at ${fmt(r)} for fourteen years. ${f.tenant} covenants to lay stone drains in the wet grounds and to plant quick along the lane. ${p.He} asks to take the lease home and read it.

On Monday there are two loads of stone at ${p.his} gate.`; }},
    {t:'Advertise the farm and take the best bidder.', note:() => fmt(five(1.13 * lettingValue(letting().f, S.year))) + ', seven years, a new tenant', go:() => { const {f} = letting(), r = five(1.13 * lettingValue(f, S.year)), old = f.tenant, n = incomer();
      if (old === 'Mrs Thorne') reg('thorne', -4, 'You advertised Long Barrow over her head'); if (old === 'Edmund') { reg('edmund', -3, 'You let Kennet Bottom over his head'); add({family:-6}); }
      f.tenant = n[0]; f.she = false; f.K = 0.3 * r; f.arrears = 0; f.since = S.year; sign(f, 'term', 7, 'rack', r); add({goodwill:-5});
      return `The notice is in the Mercury two Saturdays running. Nine letters come. The best is from a ${n[0]} of ${n[1]}, who offers ${fmt(r)} and has not seen the farm.

${old} leaves with two wagons and a crate of fowls. ${n[0]} signs for seven years.`; }},
    {t:'Fourteen years at a corn rent.', note:'The rent rises and falls with wheat at Wyvern', go:() => { const {f} = letting(); sign(f, 'corn', 14, 'fair');
      f.rent = five(0.86 * f.base * farmF(f) * (0.5 * means(S.year - 1) + 0.5 * market(S.year))); add({goodwill:2});
      return `The rent of ${f.name} is fixed in wheat and not in money. Each rent day ${steward()} is to take the Wyvern price and work the sum. He works it now, twice. This year it comes to ${fmt(f.rent)}.

${f.tenant} asks to see the working, and signs.`; }}
  ]});

ev({ id:'cannotPay', follow:true, cond:() => !!owing(),
  get title(){ const f = owing(); return f ? 'Arrears at ' + f.name : 'Arrears'; },
  text:() => { const f = owing(), p = pro(f), st = steward(), a = fmt(f.arrears);
    if (f.tenant === 'Mrs Thorne') meet('thorne');
    return (S.t + f.acres) % 2 ? `${f.tenant} is ${a} behind with the rent of ${f.name}. ${p.He} comes up on rent day and counts what ${p.he} has on to the table in notes and silver.

“That is what the corn made, sir,” ${p.he} says. “There is no more till the lambs are sold.”

${st} has the arrears book open. There is a pencil cross against the name.` : `${st} brings the arrears book. ${f.tenant} of ${f.name} owes ${a} and has sent a boy with a note in place of the money.

The note says the wheat was sold at ${PRICES[S.year]}s. the quarter and the poor rate was paid out of it first. It asks for time.

“There are eleven beasts and two ricks down there, sir,” says ${st}. “They would cover it.”`; },
  choices:[
    {t:'Forgive the arrears.', note:() => 'Strike off ' + fmt(owing().arrears), go:() => { const f = owing(), p = pro(f), a = fmt(f.arrears); f.arrears = 0; S.payQueue.shift(); add({goodwill:3});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 1, 'You struck off her arrears');
      return `${steward()} draws his pen through ${a}. ${f.tenant} watches him do it. ${p.He} says the gate on the lane will be hung by Sunday.`; }},
    {t:'Forgive them, and take a fifth off the rent for two years.', note:() => fmt(Math.round(owing().rent * S.rentAdj * 0.8)) + ' a year until ' + (S.year + 2), if:() => !owing().rebate, go:() => { const f = owing(); f.arrears = 0; f.rebate = S.year + 2; f.K += 0.1 * f.rent; S.payQueue.shift(); add({goodwill:5});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 2, 'You abated her rent when wheat fell');
      return `The arrears are struck off. The rent is to be ${fmt(Math.round(rentDue(f)))} until Lady Day ${f.rebate}. ${steward()} writes the figure on a slip. ${f.tenant} folds the slip twice and puts it in an inside pocket.`; }},
    {t:'Let the arrears stand over.', note:'Owed still', go:() => { const f = owing(), a = fmt(f.arrears); S.payQueue.shift();
      return `The ${a} is carried forward. ${steward()} writes “stands over” in the margin. ${f.tenant} thanks you and goes out by the yard door.`; }},
    {t:'Distrain. Send the bailiff for the stock.', note:'The farm falls in hand', go:() => { const f = owing(), p = pro(f), got = Math.round(Math.min(f.arrears, 0.45 * f.rent) / 5) * 5, who = f.tenant; S.payQueue.shift();
      if (who === 'Mrs Thorne') reg('thorne', -4, 'You sold her up for the rent'); if (who === 'Edmund') { reg('edmund', -4, 'You distrained on your own son'); add({family:-10}); }
      add({money:got, goodwill:-7}); quit(f);
      return `The bailiff goes down on Monday with two men and a cart. The sale is held in the yard on Thursday. The beasts, the ricks and the implements make ${fmt(got)}.

${who} goes to a brother at Speen. ${f.name} is in hand, and ${steward()} has put a man in to feed what is left.`; }}
  ]});

/* ---------- works that belong to a place ---------- */
PROJECTS.meadows = { name:'Float the water meadows at Kennet Bottom', seasons:2, cost:() => 300,
  blurb:`Hatches, carriers and drains, to lay the Kennet over forty acres from Christmas to Lady Day.`, gain:'Kennet Bottom worth more to let',
  done:() => { fl('meadows'); return `The hatches are drawn at Kennet Bottom for the first time. The water stands an inch deep over forty acres. There is grass for the ewes in March.`; }};
PROJECTS.commonpiece = { name:'Fence Common Piece and build a farmhouse', seasons:2, cost:() => 1000, if:() => F('enclosed') && !farm('commonpiece') && S.farms.length < MAX_FARMS,
  blurb:`Three hundred acres of the old common, staked out by the award. No hedge, no barn, no house.`, gain:'A new farm to let',
  done:() => { const f = addFarm('commonpiece', {own:false}); if (!f) return `The quick is planted round Common Piece. The land is laid to Church Farm.`;
    return `The quick is planted round Common Piece and the farmhouse has its roof on. ${f.tenant} takes the three hundred acres from year to year at ${fmt(f.rent)}. He begins by burning the furze.`; }};

/* ---------- credit, and ruin by stages ---------- */
// Years when Consols yielded five per cent or more. The law holds a mortgage to five, so nobody lends on land.
const TIGHT = [1797, 1798, 1799, 1803, 1804, 1805, 1812, 1813, 1815];
const moneyTight = y => TIGHT.includes(y);
const canBorrow = () => S.mortgage < mortCap() && !moneyTight(S.year);
const borrowWhy = () => moneyTight(S.year) ? 'The Funds pay five per cent this year. Mr Tidmarsh has nothing to lend on land.' : S.mortgage >= mortCap() ? 'The estate will carry no more.' : '';
const salePrice = f => Math.round(26 * (f.void ? 0.9 * lettingValue(f, S.year) : rentDue(f)) / 10) * 10;
const boughtFarm = () => S.farms.filter(f => f.own).sort((a, b) => b.base - a.base)[0];
const edmundSigns = () => farm('longbarrow') && !F('edmundDead') && S.chars.edmund.r > -3 && !F('soldLongBarrow');
function sellFarm(f){ const p = salePrice(f); S.farms.splice(S.farms.indexOf(f), 1); S.money += p; return p; }
/* Called each quarter before the season's paper is chosen. Bills first, then the tradesmen, then the land, then the packet to Douglas. */
function creditCheck(){
  const first = id => { S.queue = S.queue.filter(x => x.id !== id); S.queue.unshift({id, at:S.t}); };
  if (S.money < -3000) { if (boughtFarm() || edmundSigns()) first('hammer'); else S.dead = 'ruin'; }
  else if (S.money < -1500 && (S.stoppedAt === undefined || S.t - S.stoppedAt >= 8)) { S.stoppedAt = S.t; first('georgeMeeting'); }
  if (S.season === 0 && moneyTight(S.year) && !moneyTight(S.year - 1)) S.notes.push('Consols are below sixty. Mr Tidmarsh writes that he can find nothing on mortgage while the Funds pay better than five per cent.');
}

ev({ id:'georgeMeeting', follow:true, cond:() => S.money < -800, title:'The Meeting at the George',
  text:() => `${steward()} brings a paper up from Wyvern. It is signed by the butcher, the chandler, the coal merchant, the saddler and nine others.

They met at the George on Tuesday. They are owed ${fmt(-S.money)} between them. They have resolved to send nothing more to the Hall until it is paid.

Mrs Bunce has asked what she is to do about Sunday’s joint.`,
  choices:[
    {t:'Borrow it from Mr Tidmarsh on the land.', note:() => 'Mortgage +' + fmt(Math.ceil(-S.money / 500) * 500), if:() => canBorrow() && S.mortgage + Math.ceil(-S.money / 500) * 500 <= mortCap(), go:() => { const a = Math.ceil(-S.money / 500) * 500; S.mortgage += a; S.money += a;
      return `Mr Tidmarsh finds ${fmt(a)} in a week at five per cent. ${steward()} drives into Wyvern with the notes and pays every name on the paper at his own door. The butcher’s boy is at the kitchen door before the gig is back.`; }},
    {t:'Fell the oaks in Hanger Wood.', note:() => '+' + fmt(Math.round(75 * (1 + 0.035 * (S.year - 1795))) * 10), if:() => (S.timber === undefined ? 3 : S.timber) > 0, go:() => { const t = Math.round(75 * (1 + 0.035 * (S.year - 1795))) * 10; S.timber = (S.timber === undefined ? 3 : S.timber) - 1; add({money:t, standing:-3});
      return `The timber merchant from Reading goes through Hanger Wood with a scribing iron and marks two hundred oaks. He pays ${fmt(t)} down. The sawyers dig their pit that week. The fall can be heard from the terrace.`; }},
    {t:'Put down the carriage and shut up half the house.', note:'+£300', go:() => { add({money:300, standing:-6, family:-6}); reg('henrietta', -1, 'You put down her carriage');
      return `The carriage horses go to Reading fair. Two footmen and the under-gardener are paid off at the month. The dining-room shutters are closed and the family dines in the breakfast parlour.

The chandler is paid in part.`; }},
    {t:'Ask them to wait.', go:() => { add({standing:-5});
      return `${steward()} carries the answer down. The paper is read aloud at the George. On Saturday the butcher sends the joint, with a bill pinned to the cloth. The bill is marked “ready money”.`; }}
  ]});

ev({ id:'hammer', follow:true, cond:() => S.money < -2000 && (boughtFarm() || edmundSigns()), title:'A Sale by Order',
  text:() => `You owe ${fmt(-S.money)} in Wyvern and Reading on bills and notes of hand. Two of the holders have taken out writs.

Mr Tidmarsh comes out from the bank and asks for the estate map. He unrolls it on the library table and stands the inkwell on one corner.

“Something must go, sir,” he says. “The question is what.”`,
  choices:[
    {t:() => 'Sell ' + boughtFarm().name + '.', note:() => 'About ' + fmt(salePrice(boughtFarm())) + '. It is your own to sell', if:() => !!boughtFarm(), go:() => { const f = boughtFarm(), p = sellFarm(f); add({standing:-5});
      return `${f.name} is put up at the George by Mr Skinner in one lot. It is knocked down at ${fmt(p)} to a brewer from Reading. Mr Tidmarsh pays off the writs the same afternoon and brings you a draft for the balance.`; }},
    {t:'Sell Long Barrow out of the settlement.', note:() => 'About ' + fmt(salePrice(farm('longbarrow'))) + '. Edmund must sign', if:() => !!edmundSigns(), go:() => { const p = sellFarm(farm('longbarrow')), off = Math.max(0, Math.min(S.mortgage, Math.floor((S.money - 200) / 500) * 500)); S.mortgage -= off; S.money -= off; fl('soldLongBarrow'); add({standing:-8, family:-12}); reg('edmund', -2, 'You sold Long Barrow out of his inheritance'); reg('cullerne', 1);
      return `The deed of consent goes to Edmund by the post. It comes back signed in three weeks. There is no letter with it.

Long Barrow is sold by private treaty to Lord Cullerne’s agent for ${fmt(p)}. ${off ? `The mortgagees take ${fmt(off)} of it. ` : ''}The estate map is sent to Wyvern to be drawn again.`; }},
    {t:'Sell nothing.', go:() => { S.dead = 'ruin';
      return `Mr Tidmarsh rolls up the map. He says he is sorry for it. The writs are served on Thursday.`; }}
  ]});

/* ---------- ventures: each can make him, and each can break him ---------- */
const wageIdx = y => 0.55 + 0.45 * trail(y, 5) / 50;
const vent = id => S.vent && S.vent[id];
const live = id => vent(id) && !vent(id).ended;
const VENTURES = {
  plough:{ name:'Plough up the down', where:'Long Barrow', cost:250, if:() => !!farm('longbarrow'),
    well:'The farm is worth a quarter more to let, from the first crop.', ill:'The shepherd says there are seven crops in that turf and no more.',
    begin:() => { farm('longbarrow').mult = 1.25; }, state:v => 'In corn since ' + v.year,
    endLabel:'Lay it down to grass', endCost:300, end:v => { const lb = farm('longbarrow'); v.heal = S.year + 5; if (lb) lb.mult = S.year - v.year > 7 ? 0.8 : 1;
      return `The down at Long Barrow is sown with sainfoin and rye-grass. The shepherd says it will be five years before it carries a flock.`; }},
  merino:{ name:'Merinos', where:'The home farm', cost:420, if:() => S.year >= 1800,
    well:'Fine wool worth £110 more at each clip, and rams that sell to gentlemen.', ill:'The price of a ram is whatever gentlemen will give this year.',
    begin:() => { fl('merino'); }, state:v => 'A flock since ' + v.year,
    endLabel:'Sell the flock', end:() => { const y = S.year, p = y <= 1805 ? 400 : y <= 1810 ? 400 + 200 * (y - 1805) : 60; fl('merino', false); S.money += p;
      return `The merino flock is sold at Reading. It makes ${fmt(p)}.`; }},
  peat:{ name:'Cut the peat', where:'Kennet Bottom', cost:300, if:() => !!farm('kennet'),
    well:'About £170 a year in peat and ashes, for nine years or ten.', ill:'The peat lies under the best of the meadow.', state:v => 'Digging since ' + v.year },
  forage:{ name:'Forage for the barracks', where:'The estate', cost:200, if:() => S.year < 1814,
    well:'£130 a year, as long as there is cavalry at Reading.', ill:'The contract binds you to deliver at the price agreed, in peace or war.', state:v => 'Under contract since ' + v.year,
    endLabel:'Give up the contract', end:() => `The forage contract is given up. The commissary has found a man at Theale.` },
  thresher:{ name:'A threshing machine', where:'The home farm', cost:120, if:() => S.year >= 1803 && !F('thresher'),
    well:'Saves about £50 a year in winter wages.', ill:'Six men thresh in your barn from Martinmas to Lady Day. They have no other work.',
    begin:() => { fl('thresher'); add({goodwill:-4}); }, state:v => 'In the great barn since ' + v.year },
  bank:{ name:'A partner’s share in the Wyvern Bank', where:'The estate', cost:1000,
    well:'Fifteen per cent, and a seat in the bank parlour.', ill:'Every partner answers for the notes with all he has.', state:v => 'A partner since ' + v.year,
    endLabel:'Withdraw from the bank', canEnd:() => !moneyTight(S.year), endWhy:'No partner can be let go while money is tight.',
    end:() => { S.money += 1000; return `You have withdrawn from the Wyvern Bank. Mr Tidmarsh repays the £1,000 and takes your name off the notes.`; }},
  spa:{ name:'The Hatherley Spa', where:'The estate', cost:1800,
    well:'If the waters take, £300 a year rising to £750.', ill:'Bath is thirty miles off, and Cheltenham had the King.',
    begin:v => { const r = Math.random(); v.fate = r < 0.3 ? 'hit' : r < 0.8 ? 'dull' : 'flop'; }, state:v => 'A pump room since ' + v.year,
    endLabel:'Shut the pump room', end:() => `The pump room is shut and the attendant paid off. The spring runs into the ditch as before.` }
};
function venturesList(){ const open = S.phase !== 'end' && !S.dead;
  return Object.keys(VENTURES).map(id => { const d = VENTURES[id], v = vent(id), state = !v ? 'open' : v.ended ? 'ended' : 'inHand';
    let why = ''; if (state === 'open') { if (!open) why = 'The books are closed.'; else if (d.if && !d.if()) why = 'Not to be had at present.'; else if (S.money < d.cost) why = 'The purse will not stand ' + fmt(d.cost) + '.'; }
    const canEnd = open && state === 'inHand' && !!d.end && (!d.canEnd || d.canEnd()) && S.money >= (d.endCost || 0);
    return {id, name:d.name, where:d.where, cost:d.cost, well:d.well, ill:d.ill, state, can:state === 'open' && !why, why,
      note:state === 'inHand' ? d.state(v) : state === 'ended' ? (v.how || 'Given up') + ', ' + v.ended : '',
      canEnd, endLabel:state === 'inHand' && d.end ? d.endLabel + (d.endCost ? ', ' + fmt(d.endCost) : '') : '', endWhy:state === 'inHand' && d.end && !canEnd && d.canEnd && !d.canEnd() ? d.endWhy : ''}; }); }
function beginVenture(id){ const x = venturesList().find(v => v.id === id); if (!x || !x.can) return false; const d = VENTURES[id];
  S.vent = S.vent || {}; const v = S.vent[id] = {year:S.year, t:S.t}; S.money -= d.cost; if (d.begin) d.begin(v);
  S.journal.unshift({when:stamp(), title:'Ventures', did:'Ventured ' + fmt(d.cost) + ': ' + d.name}); save(); render(); return true; }
function endVenture(id){ const x = venturesList().find(v => v.id === id); if (!x || !x.canEnd) return false; const d = VENTURES[id], v = vent(id);
  S.money -= d.endCost || 0; v.ended = S.year; v.how = d.endLabel; const said = d.end(v);
  S.journal.unshift({when:stamp(), title:'Ventures', did:d.endLabel + '. ' + said}); save(); render(); return true; }
function stopVenture(id, how){ const v = vent(id); v.ended = S.year; v.how = how; }

/* The quarter's reckoning of every venture in hand. */
function ventureTick(line){ if (!S.vent) return; const y = S.year, q = S.season, n = id => y - vent(id).year, st = steward(), earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  const lb = farm('longbarrow'), kb = farm('kennet');
  if (vent('plough') && lb && q === 0) { const v = vent('plough');
    if (!v.ended) { lb.mult = n('plough') <= 7 ? 1.25 : 0.7; if (n('plough') === 8) S.notes.push(`The wheat on the down at Long Barrow has come up thin and yellow. ${st} has taken near half off his valuation of the farm.`); }
    else if (lb.mult !== 1 && y >= v.heal) { lb.mult = 1; S.notes.push('There are sheep on the down at Long Barrow again.'); } }
  if (live('merino') && q === 1 && y >= 1806 && y <= 1810 && n('merino') >= 1) earn('Merino rams sold at the shearing', 150);
  if (live('merino') && !F('merino')) stopVenture('merino', 'The flock gone');
  if (live('peat') && q === 2 && n('peat') >= 1) { if (n('peat') <= 9) earn('Peat and ashes from Kennet Bottom', 170 * (0.8 + 0.4 * Math.random()));
    else { stopVenture('peat', 'Dug out'); if (kb && !F('meadows')) kb.cond = Math.max(0, kb.cond - 1);
      S.notes.push(`The peat at Kennet Bottom is dug out. Forty acres of the old meadow are water and rushes.${F('meadows') ? ' The floated meadows above are untouched.' : ''}`); } }
  if (live('forage') && q === 3 && n('forage') >= 1) {
    if (y === 1802 || y === 1814) { line('Forage left on hand at the peace', -220); S.notes.push('The cavalry have marched out of Reading barracks. The hay bought for them is sold at Newbury for what it will fetch.'); if (y === 1814) stopVenture('forage', 'Ended with the war'); }
    else if (chance(0.1)) { line('Forage refused by the commissary', -60); S.notes.push('The commissary has refused two loads of hay as mouldy.'); }
    else earn('Forage contract, Reading barracks', 130); }
  if (live('thresher') && q === 3) { earn('Wages saved by the threshing machine', 45 * wageIdx(y));
    if (y >= 1811 && S.goodwill < 45 && chance(0.25)) { stopVenture('thresher', 'Broken and burnt'); line('The great barn, and the machine in it', -300); add({goodwill:-2});
      S.notes.push('The threshing machine was broken up in the night and the great barn fired. Nobody in Hatherley saw anything.'); } }
  if (live('bank')) { const v = vent('bank');
    if (q === 3) { earn('Share of profits, Wyvern Bank', 150); add({standing:1}); }
    if (q === 1 && ((y === 1797 && chance(0.2)) || (y === 1810 && chance(0.15))) && v.year < y) { line('Paid in to meet a run on the Wyvern Bank', -500); S.notes.push('There was a run on the Wyvern Bank on Saturday. Each partner has paid in £500 to meet it.'); }
    if (q === 2 && y === 1815 && chance(0.45)) { const c = 1500 + Math.round(Math.random() * 25) * 100; stopVenture('bank', 'The bank broke'); line('Call on the partners of the Wyvern Bank', -c); add({standing:-8});
      S.notes.push(`The Wyvern Bank stopped payment on Tuesday. The shutters are up and there is a crowd in the market place holding its notes. Your share of ${fmt(1000)} is gone and the partners are called on for ${fmt(c)} each.`); } }
  if (live('spa') && q === 2 && n('spa') >= 1) { const v = vent('spa'), k = n('spa');
    if (v.fate === 'hit') { earn('Hatherley Spa, the season', Math.min(750, 300 + 75 * (k - 1))); if (k === 1) { add({standing:4}); S.notes.push('A physician at Bath has published a pamphlet on the Hatherley waters. Eleven families have taken lodgings in the village for the season.'); } }
    else if (v.fate === 'dull') { earn('Hatherley Spa, the season', 90); if (k === 1) S.notes.push('The pump room at Hatherley Spa took £90 this season. Most of it came from Wyvern people on Sundays.'); }
    else { line('Hatherley Spa, the attendant and the fires', -60); if (k === 1) S.notes.push('Nine persons drank the waters at Hatherley Spa this season. One of them has written to the Mercury about the taste.'); } }
}

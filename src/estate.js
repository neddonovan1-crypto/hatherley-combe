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
const MAX_FARMS = 8;
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
  commonpiece:{name:'Common Piece', acres:300, base:230, cond:1},
  rooksnest:{name:'Rooksnest', acres:350, base:330, cond:2, tenant:'Mr Dance'},
  withymead:{name:'Withy Mead', acres:220, base:300, cond:2, tenant:'Mr Puzey'},
  maddle:{name:'Maddle Farm', acres:700, base:480, cond:1, tenant:'Mr Spanswick'}
};
const farm = id => S.farms.find(f => f.id === id);
function incomer(){ const used = S.farms.map(f => f.tenant), free = INCOMERS.filter(n => !used.includes(n[0])); return pick(free.length ? free : INCOMERS); }
function addFarm(id, o){ if (farm(id) || S.farms.length >= MAX_FARMS) return null;
  const d = NEW_FARMS[id], f = Object.assign({id, name:d.name, acres:d.acres, base:d.base, cond:d.cond, level:'fair', arrears:0, own:true, lease:{type:'will'}, tenant:d.tenant || incomer()[0]}, o || {});
  if (!f.rent) f.rent = five(0.95 * lettingValue(f, S.year)); if (f.K === undefined) f.K = 0.5 * f.rent;
  S.farms.push(f); return f; }
/* What the land will carry on mortgage moves with the land. Settled farms carry a little over a quarter of twenty years' purchase of their letting value, since a life tenant can charge only so much;
   a farm bought outright carries two thirds. Sell a farm and the ceiling comes down; buy one, drain one or see rents rise and it goes up. */
const mortCap = () => Math.floor(S.farms.reduce((a, f) => a + (f.own ? 2 / 3 : SETTLED_CARRIES) * 20 * lettingValue(f, S.year), 0) / 500) * 500;
const SETTLED_CARRIES = 0.27;

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
  if (kb && F('edmund') === 'farmer' && kb.tenant !== 'Edmund' && !kb.edmundOut) { kb.tenant = 'Edmund'; kb.she = false; kb.arrears = 0; delete kb.void; kb.since = S.year;
    kb.rent = five(0.88 * lettingValue(kb, S.year)); kb.lease = {type:'term', ends:S.year + 14, years:14}; kb.K = kb.rent; }
  bubbleClock();
  if (!S.offered && S.t >= 6) { S.offered = true; later('farmOffered', 0); }
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
      if (f.level === 'rack' && f.cond > 0 && chance(0.12)) { f.cond--; S.notes.push(`${f.name} is going back: ${st} has counted three fields there in wheat after wheat.`); }
      else if (f.level !== 'rack' && f.cond < 2 && f.id !== 'kennet' && chance(0.2)) f.cond++; }
    const secure = f.lease.type !== 'will' && f.lease.ends - y >= 5 && f.lease.years >= 14;
    const bound = !!f.lease.drain && f.cond < 4;   // an easy lease carries a covenant to drain and fence, and it is kept the first year
    if (bound) delete f.lease.drain;
    if (bound || (secure && f.K > 1.4 * f.rent && f.cond >= 1 && f.cond < 4)) { if (!bound) f.K -= 0.9 * f.rent; f.cond++;
      S.notes.push(`${f.tenant} ${bound ? mendOf(f).done : 'has drained and fenced'} at ${f.name} at ${p.his} own cost; and ${st} enters the farm as ${ORDER_W[f.cond].toLowerCase()}.`); } }
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
    const able = means(hy) * farmF(f) * f.base * (0.86 + S.goodwill / 350);
    if (f.flush) f.K = Math.max(f.K, 2 * f.rent);   // a post-captain with a prize in the agent's hands pays reliably until the peace (src/events4.js)
    if (f.void) { const v = Math.max(-0.075 * f.base, 0.175 * (able - 0.4 * f.base)); line(f.name + ', in hand', v); S.yearIncome += Math.round(v); f.void--; if (!f.void) relet(f); continue; }
    if (f.lease.type === 'corn') f.rent = five(LEVEL[f.lease.level] * 0.86 * f.base * farmF(f) * (0.5 * means(hy) + 0.5 * market(y)));
    const due = rentDue(f) / 2, surplus = able / 2 - due, val = lettingValue(f, y); let got = due;
    n++; if (rentDue(f) > 1.06 * val) racked++; else if (rentDue(f) < 0.92 * val) easy++;
    if (surplus >= 0) { const back = Math.min(f.arrears, surplus * 0.5); f.arrears -= back; got += back; f.K = Math.min(1.6 * f.rent, f.K + 0.3 * (surplus - back)); }
    else { f.K += surplus; if (f.K < 0) { const short = Math.min(due, -f.K); f.K = 0; got -= short; f.arrears += short;
      if (short >= 1) S.notes.push(`${f.tenant} of ${f.name} is ${fmt(short)} short this half-year.`); } }
    line(f.name + ', ' + f.tenant, got); S.yearIncome += Math.round(got);
    if (f.arrears > 0.9 * f.rent) { S.notes.push(`${f.tenant} is gone from ${f.name}, owing ${fmt(f.arrears)}; the key was found upon a nail in the porch, and the farm is in hand.`); quit(f); add({goodwill:-3}); }
    else if (!asked && f.arrears > 0.25 * f.rent && (f.asked === undefined || S.t - f.asked >= 4) && !S.payQueue.includes(f.id)) { asked = true; f.asked = S.t; S.payQueue.push(f.id); later('cannotPay', 0); }
  }
  if (S.trust) { const d = S.trust * (CONSOL_YIELD[y] || 5) / 200; line('Dividends from the trustees of the settlement', d); S.yearIncome += Math.round(d); }
  if (n) add({goodwill: Math.round(-4 * racked / n + 2 * easy / n)});
}

/* ---------- what the book shows, and what the squire may do from it ---------- */
function tenureOf(f){ if (f.void) return 'In hand'; const l = f.lease;
  return l.type === 'will' ? 'From year to year' : (l.type === 'corn' ? 'Corn rent' : 'Lease') + ' to Lady Day ' + l.ends; }
function rentRoll(){ estateSync(); const y = S.year, open = S.phase !== 'end' && !S.dead;
  return S.farms.map(f => { const will = !f.void && f.lease.type === 'will', waiting = S.letQueue.some(x => x.id === f.id);
    return {id:f.id, name:f.name, acres:f.acres, tenant:f.void ? '' : f.tenant, rent:f.void ? 0 : Math.round(rentDue(f)), value:lettingValue(f, y),
      tenure:tenureOf(f), order:ORDER_W[f.cond], means:f.void ? '' : MEANS_W[Math.min(4, Math.floor(f.K / Math.max(1, f.rent) / 0.3))],
      arrears:Math.round(f.arrears), level:f.level, own:!!f.own, abated:!!f.rebate, waiting, canLevel:open && will && !waiting, canOffer:open && will && !waiting,
      state:f.void ? 'hand' : will ? 'will' : f.lease.type, ends:will || f.void ? 0 : f.lease.ends, toRun:will || f.void ? 0 : Math.max(0, f.lease.ends - y)}; }); }
const LAND = {longbarrow:'Down and sheepwalk', kennet:'Wet clay, with the mill', church:'Strips in the open field', coldharbour:'Sound loam beyond the turnpike', starveall:'Thin chalk on the hill', commonpiece:'New ground off the common', rooksnest:'Mixed land under the hanger', withymead:'Meadow and osiers on the Lambourn', maddle:'Open down, nine miles from a market'};
/* For the Farms leaf of the book. held is ready to print; the rest is there for the page to draw as it likes. */
function farmsList(){ return rentRoll().map(f => { const bits = [f.tenure === 'In hand' ? 'In hand, no tenant' : f.tenure, f.order];
    if (f.abated) bits.push('A fifth abated'); if (f.arrears) bits.push('In arrear ' + fmt(f.arrears)); if (f.waiting) bits.push('Terms to be settled this quarter');
    const s = sellState(f.id);
    return Object.assign(f, s, {evict:evictCost(f.id), land:(f.id === 'church' && F('enclosed') ? 'Inclosed arable' : LAND[f.id]), tenant:f.tenant || 'No tenant', held:bits.join('. ')}); }); }
/* Turning a tenant out. It may be done to any let farm at any time, and it is dear: the parish takes it hard and remembers it, the county thinks the less of a landlord who does it,
   a lease must be bought out at half a year's rent, arrears are lost, and the farm lies in hand a year before it lets again in worse order.
   evictCost(id) is what the page prints on the button. evictTenant(id, quiet) does it and returns what happened, or false. With quiet set it keeps no journal and draws nothing, for use from an event. */
const TENANT_IS = f => /Thorne/.test(f.tenant) ? 'thorne' : f.tenant === 'Edmund' ? 'edmund' : /Crabbe/.test(f.tenant) ? 'crabbe' : '';
function evictCost(id){ const f = farm(id), open = S.phase !== 'end' && !S.dead; if (!f) return {can:false, fx:[]};
  const can = open && !f.void && !!f.tenant && !S.letQueue.some(x => x.id === id), buy = f.lease.type === 'will' ? 0 : five(rentDue(f) / 2), who = TENANT_IS(f);
  const fx = [MINUS + (f.she ? '15' : '12') + ' Goodwill', MINUS + '4 Standing', MINUS + ' The parish remembers it', MINUS + ' In hand a year, then let in worse order'];
  if (buy) fx.push(MINUS + fmt(buy) + ' to buy out the lease'); if (f.arrears >= 1) fx.push(MINUS + fmt(f.arrears) + ' of arrears lost');
  if (who === 'thorne') fx.push(MINUS + ' Abigail Thorne'); if (who === 'edmund') fx.push(MINUS + ' Edmund', MINUS + ' Henrietta', MINUS + '8 Household'); if (who === 'crabbe') fx.push(MINUS + ' Mr Crabbe');
  return {can, fx, buy, why:can ? '' : !open ? 'The books are closed.' : f.void || !f.tenant ? 'There is no tenant to turn out.' : 'Terms are being settled this quarter.'}; }
function evictTenant(id, quiet){ const c = evictCost(id); if (!c.can) return false; const f = farm(id), p = pro(f), who = TENANT_IS(f), was = f.tenant, st = steward();
  S.money -= c.buy; add({goodwill: f.she ? -15 : -12, standing:-4}); S.evicted = (S.evicted || 0) + 1;
  if (who === 'thorne') reg('thorne', -4, 'Turned out of Long Barrow'); if (who === 'crabbe' && !F('crabbeGone')) reg('crabbe', -3, 'His nephew turned out of Long Barrow');
  if (who === 'edmund') { reg('edmund', -4, 'Turned out of Kennet Bottom by his father'); reg('henrietta', -2, 'You turned Edmund out of his farm'); add({family:-8}); f.edmundOut = true; }
  f.void = 2; f.arrears = 0; f.lease = {type:'will'}; f.level = 'fair'; delete f.rebate; S.payQueue = S.payQueue.filter(x => x !== id);
  const said = `${st} serves the notice at ${f.name} upon the Tuesday; and ${was}, having read it through in the yard, folds it, and puts it in ${p.his} pocket.

The stock is sold upon the Friday week, by a Wyvern auctioneer standing in a wagon; and by the month’s end the house is shut, the key hangs in the estate office, and the farm is in hand.`;
  if (!quiet) { S.journal.unshift({when:stamp(), title:'The Rent Roll', did:'Turned out ' + was + ' of ' + f.name}); save(); render(); }
  return said; }
const rentalNow = () => rentRoll().reduce((a, f) => a + f.rent, 0);
/* The old three-way rent policy still answers: it sets every farm held from year to year. */
function setRentAll(v){ const lvl = v < 1 ? 'easy' : v > 1 ? 'rack' : 'fair'; for (const f of S.farms) if (!f.void && f.lease.type === 'will') f.level = lvl; }
function setLevel(id, lvl){ const f = farm(id); if (!f || !LEVEL[lvl] || f.void || f.lease.type !== 'will') return; f.level = lvl; save(); render(); }
function askLet(id, why){ if (S.letQueue.some(x => x.id === id)) return; S.letQueue.push({id, why}); later('leaseFalls', 0); }
function offerLease(id){ const f = farm(id); if (!f || f.void || f.lease.type !== 'will') return; askLet(id, 'offer');
  S.journal.unshift({when:stamp(), title:'Rent roll', did:'Sent word to ' + f.tenant + ' about a lease of ' + f.name}); save(); render(); }

/* A lease granted from the farm's own paper, there and then. The terms are the choices of the letting paper after its first, which is to leave things alone;
   leaseTerms(id) lists them with what each does to the rent, and grantLease(id, i) signs one and returns what was said. S.leaseSaid keeps the last for the page to print under the farm. */
function asLetting(id, fn){ const x = {id, why:'offer'}; S.letQueue.unshift(x); try { return fn(byId('leaseFalls')); } finally { const i = S.letQueue.indexOf(x); if (i >= 0) S.letQueue.splice(i, 1); } }
function leaseTerms(id){ const f = farm(id); if (!f || f.void || f.lease.type !== 'will' || S.phase === 'end' || S.dead || S.letQueue.some(x => x.id === id)) return [];
  return asLetting(id, e => e.choices.slice(1).map((c, i) => ({i, label:lab(c), note:typeof c.note === 'function' ? c.note() : c.note || ''}))); }
function grantLease(id, i){ if (!leaseTerms(id)[i]) return false; const f = farm(id);
  const said = asLetting(id, e => { const c = e.choices[i + 1], did = lab(c), text = c.go(); S.journal.unshift({when:stamp(), title:'The Letting of ' + f.name, did}); return text; });
  S.leaseSaid = {id, t:S.t, text:said}; save(); render(); return said; }

/* ---------- papers ---------- */
function letting(){ while (S.letQueue && S.letQueue.length){ const x = S.letQueue[0], f = farm(x.id); if (f && !f.void && f.lease.type === 'will') return {f, why:x.why}; S.letQueue.shift(); } return null; }
function owing(){ while (S.payQueue && S.payQueue.length){ const f = farm(S.payQueue[0]); if (f && !f.void && f.arrears >= 1) return f; S.payQueue.shift(); } return null; }
function sign(f, type, years, level, rent){ f.lease = type === 'will' ? {type:'will'} : {type, ends:S.year + years, years, level}; f.level = level; if (rent) f.rent = rent; if (!f.since) f.since = 1788; S.letQueue.shift(); }
/* What a choice on the letting paper does to the rent now paid: the change, not the rent itself, which the squire has already. */
/* The rent itself, and after it what that is against the rent now paid. */
const rentNote = (f, r, tail) => { const d = r - f.rent; return fmt(r) + ' a year (' + (d > 0 ? '+' + fmt(d) : d < 0 ? '−' + fmt(-d) : 'as it stands') + '), ' + tail; };
const willNext = f => { const v = lettingValue(f, S.year); return five(v > f.rent ? Math.min(v, f.rent * 1.12) : Math.max(v, f.rent * 0.9)); };
const cornNow = f => five(0.86 * f.base * farmF(f) * (0.5 * means(S.year - 1) + 0.5 * market(S.year)));
const LONG_LEASE = 0.96;   // fourteen years are bought with a twenty-fifth off the rent
const covenants = `no two white straw crops together, no hay or straw sold off the farm, the hedges kept`;
/* What each farm most wants doing, and what an easy lease binds its tenant to do. t: upon the choice; cov: in the lease; seen: the Monday after; done: at Lady Day. */
const MEND = {
  longbarrow:{t:'to puddle the down pond and turf the fold-banks', cov:'to puddle the pond upon the down afresh with clay and straw, and to turf the banks of the sheep-fold', seen:p => `a cart of clay stands at the down pond, and two men are treading straw into it`, done:'has puddled the pond upon the down and turfed the fold-banks'},
  kennet:{t:'to scour the ditches to the river', cov:'to scour every ditch between the lane and the Kennet, and to cut the pollards that have fallen across them', seen:p => `four men are in the long ditch, to the waist`, done:'has scoured the ditches down to the Kennet and cut the fallen pollards'},
  church:{t:'to plash the hedges and hang new gates', cov:'to plash the hedges upon the glebe side, and to hang eleven new gates of oak', seen:p => `a hedger from Kintbury is in the glebe hedge with his bill`, done:'has plashed the hedges and hung eleven oak gates'},
  coldharbour:{t:'to pick the flints and stone the farm road', cov:'to pick the flints off the upper fields, and to lay them in the farm road', seen:p => `every child at Coldharbour is in the upper field with a basket`, done:'has picked the upper fields and laid the flints in the farm road'},
  starveall:{t:'to stub up the gorse', cov:'to stub up the gorse from the thirty acres under the wood, and to burn it where it lies', seen:p => `there is smoke under the wood until dark`, done:'has stubbed and burnt the gorse under the wood'},
  commonpiece:{t:'to level the ant-hills and the old ridges', cov:'to cut and carry the ant-hills, and to plough down the old ridges', seen:p => `a team is upon the old ridges, going across them`, done:'has cut the ant-hills and ploughed the old ridges level'},
  rooksnest:{t:'to thatch the barn and the stable anew', cov:`to thatch the barn and the stable anew, with wheat straw of the farm’s own growing`, seen:p => `the thatcher’s ladder is against the barn`, done:'has new thatched the barn and the stable'},
  withymead:{t:'to mow out the rushes and open the grips', cov:'to mow the rushes from the mead twice in every summer, and to open the grips', seen:p => `a man is in the mead with a spade, opening the first grip`, done:'has mown the rushes twice and opened the grips'},
  maddle:{t:'to clean the old arable of couch', cov:'to fallow the old arable, and to fork out and burn the couch', seen:p => `the couch is burning in forty heaps upon the old arable`, done:'has fallowed the old arable and burnt the couch in heaps'}
};
const mendOf = f => MEND[f.id] || {t:'to drain and fence', cov:'to lay stone drains in the wet grounds, and to plant quick along the lane', seen:p => `there are two loads of stone at ${p.his} gate`, done:'has drained and fenced'};

ev({ id:'leaseFalls', follow:true, cond:() => !!letting(),
  get title(){ const x = letting(); return x ? 'The Letting of ' + x.f.name : 'A Letting'; },
  text:() => { const {f, why} = letting(), p = pro(f), st = steward(), val = lettingValue(f, S.year);
    if (f.tenant === 'Mrs Thorne') meet('thorne');
    if (why === 'offer') return `You have sent word to ${f.tenant}, who holds ${f.name} from year to year at ${fmt(f.rent)}, that ${p.he} may have a lease of it.

${p.He} comes up to the Hall on Saturday in ${p.his} market coat, by which time ${st} has the valuation ready upon a half sheet; and this puts the farm at ${fmt(val)} upon a lease, though a stranger, he says, would give ${fmt(five(val * 1.13))}.

“What term, sir?” says ${f.tenant}.`;
    return `The lease of ${f.name} ${S.season === 0 ? 'is out this Lady Day' : 'ran out at Lady Day'}, ${f.tenant} having had the ${f.acres} acres at ${fmt(f.rent)} a year.

${st} has walked the farm, and brings his valuation upon a half sheet, by which he puts it at ${fmt(val)} to a good tenant upon a lease; and he has two letters in his pocket from men who would give ${fmt(five(val * 1.13))}.

${f.tenant} is in the hall, and has brought the old lease with ${p.him}.`; },
  choices:[
    {t:() => letting().why === 'offer' ? 'Leave things as they are.' : `Let ${pro(letting().f).him} hold on from year to year.`, note:() => rentNote(letting().f, willNext(letting().f), 'and moved again each Lady Day'), go:() => { const {f} = letting(), p = pro(f); sign(f, 'will', 0, 'fair');
      return `Nothing is signed. ${f.tenant} pays the half-year, and asks whether the barn roof is ${p.his} to mend or yours; and ${steward()} enters ${f.name} in the book as held from year to year.`; }},
    {t:'A lease of seven years.', note:() => rentNote(letting().f, lettingValue(letting().f, S.year), 'fixed for seven years'), go:() => { const {f} = letting(), r = lettingValue(f, S.year); sign(f, 'term', 7, 'fair', r);
      return `The lease, being engrossed upon one skin at Wyvern, is read over in the steward’s room, and ${f.tenant} signs. The rent is ${fmt(r)} until Lady Day ${S.year + 7}.`; }},
    {t:'A lease of fourteen years.', note:() => rentNote(letting().f, five(LONG_LEASE * lettingValue(letting().f, S.year)), 'fixed for fourteen years. +Goodwill; the tenant improves the farm in time'), go:() => { const {f} = letting(), r = five(LONG_LEASE * lettingValue(f, S.year)); sign(f, 'term', 14, 'fair', r); add({goodwill:2});
      return `Fourteen years being agreed upon, ${steward()} reads the covenants aloud: ${covenants}. ${f.tenant} signs below your name, and the rent is ${fmt(r)} until Lady Day ${S.year + 14}.`; }},
    {t:() => `Fourteen years at an easy rent, the tenant ${mendOf(letting().f).t}.`, note:() => rentNote(letting().f, five(0.88 * lettingValue(letting().f, S.year)), 'fixed for fourteen years. +Goodwill; the farm a step better by Lady Day'), go:() => { const {f} = letting(), p = pro(f), r = five(0.88 * lettingValue(f, S.year)); sign(f, 'term', 14, 'easy', r); f.lease.drain = true; add({goodwill:3});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 1, 'You gave her fourteen years at a rent she could mend the farm on');
      return `The rent is set at ${fmt(r)} for fourteen years, ${f.tenant} covenanting ${mendOf(f).cov}; and ${p.he} asks to take the lease home and read it.

On Monday ${mendOf(f).seen(p)}.`; }},
    {t:'Advertise the farm and take the best bidder.', note:() => rentNote(letting().f, five(1.13 * lettingValue(letting().f, S.year)), 'fixed for seven years, with a new tenant. −Goodwill'), go:() => { const {f} = letting(), r = five(1.13 * lettingValue(f, S.year)), old = f.tenant, n = incomer();
      if (old === 'Mrs Thorne') reg('thorne', -4, 'You advertised Long Barrow over her head'); if (old === 'Edmund') { reg('edmund', -3, 'You let Kennet Bottom over his head'); add({family:-6}); }
      f.tenant = n[0]; f.she = false; f.K = 0.3 * r; f.arrears = 0; f.since = S.year; sign(f, 'term', 7, 'rack', r); add({goodwill:-5});
      return `The notice being in the Mercury two Saturdays running, nine letters come; of which the best is from a ${n[0]} of ${n[1]}, who offers ${fmt(r)}, and has not seen the farm.

${old} leaves with two wagons and a crate of fowls, and ${n[0]} signs for seven years.`; }},
    {t:'Fourteen years at a corn rent.', note:() => rentNote(letting().f, cornNow(letting().f), 'this year, and after that as wheat sells at Wyvern. +Goodwill'), go:() => { const {f} = letting(); sign(f, 'corn', 14, 'fair');
      f.rent = cornNow(f); add({goodwill:2});
      return `The rent of ${f.name} is fixed in wheat, and not in money; so that each rent day ${steward()} is to take the Wyvern price, and work the sum. He works it now, twice, and this year it comes to ${fmt(f.rent)}.

${f.tenant} asks to see the working, and signs.`; }}
  ]});

ev({ id:'cannotPay', follow:true, cond:() => !!owing(),
  get title(){ const f = owing(); return f ? 'Arrears at ' + f.name : 'Arrears'; },
  text:() => { const f = owing(), p = pro(f), st = steward(), a = fmt(f.arrears);
    if (f.tenant === 'Mrs Thorne') meet('thorne');
    return (S.t + f.acres) % 2 ? `${f.tenant}, being ${a} behind with the rent of ${f.name}, comes up on rent day, and counts what ${p.he} has on to the table in notes and silver.

“That is what the corn made, sir,” ${p.he} says. “There is no more till the lambs are sold.”

${st} has the arrears book open, with a pencil cross against the name.` : `${st} brings the arrears book. ${f.tenant} of ${f.name} owes ${a}, and has sent a boy with a note in place of the money; and the note, having said that the wheat was sold at ${PRICES[S.year]}s. the quarter, and that the poor rate was paid out of it first, asks for time.

“There are eleven beasts and two ricks down there, sir,” says ${st}. “They would cover it.”`; },
  choices:[
    {t:'Forgive the arrears.', note:() => 'Strike off ' + fmt(owing().arrears), go:() => { const f = owing(), p = pro(f), a = fmt(f.arrears); f.arrears = 0; S.payQueue.shift(); add({goodwill:3});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 1, 'You struck off her arrears');
      return `${steward()} draws his pen through ${a}, and ${f.tenant}, having watched him do it, says the gate on the lane will be hung by Sunday.`; }},
    {t:'Forgive them, and take a fifth off the rent for two years.', note:() => '+' + fmt(Math.round(owing().rent * S.rentAdj * 0.8)) + ' a year until ' + (S.year + 2), if:() => !owing().rebate, go:() => { const f = owing(); f.arrears = 0; f.rebate = S.year + 2; f.K += 0.1 * f.rent; S.payQueue.shift(); add({goodwill:5});
      if (f.tenant === 'Mrs Thorne') reg('thorne', 2, 'You abated her rent when wheat fell');
      return `The arrears are struck off, and the rent is to be ${fmt(Math.round(rentDue(f)))} until Lady Day ${f.rebate}. ${steward()} writes the figure upon a slip, and ${f.tenant}, having folded the slip twice, puts it in an inside pocket.`; }},
    {t:'Let the arrears stand over.', note:'Owed still', go:() => { const f = owing(), a = fmt(f.arrears); S.payQueue.shift();
      return `The ${a} is carried forward, ${steward()} writing “stands over” in the margin; and ${f.tenant} thanks you, and goes out by the yard door.`; }},
    {t:'Distrain. Send the bailiff for the stock.', note:'The farm falls in hand', go:() => { const f = owing(), p = pro(f), got = Math.round(Math.min(f.arrears, 0.45 * f.rent) / 5) * 5, who = f.tenant; S.payQueue.shift();
      if (who === 'Mrs Thorne') reg('thorne', -4, 'You sold her up for the rent'); if (who === 'Edmund') { reg('edmund', -4, 'You distrained on your own son'); add({family:-10}); }
      add({money:got, goodwill:-7}); quit(f);
      return `The bailiff goes down on Monday with two men and a cart, and the sale being held in the yard on Thursday, the beasts, the ricks, and the implements make ${fmt(got)}.

${who} goes to a brother at Speen. ${f.name} is in hand, and ${steward()} has put a man in to feed what is left.`; }}
  ]});

/* ---------- works that belong to a place ---------- */
PROJECTS.meadows = { fx:["+ Kennet Bottom worth a twelfth more to let"], effects:`Kennet Bottom is worth about a twelfth more to let, for good. Saves the meadow if the peat is ever dug.`, name:'Float the water meadows at Kennet Bottom', line:'Channels carry the river over the grass all winter and keep the frost off it. The ewes have a bite a month early.', seasons:2, cost:() => 300,
  blurb:`Hatches, carriers and drains, to lay the Kennet over forty acres from Christmas to Lady Day.`, gain:'Kennet Bottom worth more to let',
  done:() => { fl('meadows'); return `The hatches are drawn at Kennet Bottom for the first time, upon a frosty morning; and by noon the river lies an inch deep over forty acres of grass, and runs off at the bottom into its own bed. The shepherd reckons upon a bite for the ewes by the first week of March.`; }};
PROJECTS.commonpiece = { fx:["+ A new farm of 300 acres", "+£250 a year or so in rent"], effects:`A sixth, seventh or eighth farm of 300 acres, let at about £250 a year to begin.`, name:'Fence Common Piece and build a farmhouse', line:'Your allotment of the old common, as the award left it. It is hedged with quick, and a house and barn are built.', seasons:2, cost:() => 1000, if:() => F('enclosed') && !farm('commonpiece') && S.farms.length < MAX_FARMS,
  blurb:`Three hundred acres of the old common, staked out by the award. No hedge, no barn, no house.`, gain:'A new farm to let',
  done:() => { const f = addFarm('commonpiece', {own:false}); if (!f) return `The quick is planted round Common Piece, and the land laid to Church Farm.`;
    return `The quick is planted round Common Piece, the farmhouse has its roof on, and ${f.tenant} has taken the three hundred acres from year to year at ${fmt(f.rent)}; and before there is a stick of furniture in the house, the furze is burning.`; }};
/* The church. Three works for the vestry, and the tithe lease among the ventures. */
const parson = () => !F('gallDead') ? 'Dr Gall' : F('oakesVicar') ? 'Mr Oakes' : F('edmundVicar') ? 'Edmund' : F('spragg') ? 'Mr Spragg' : 'The Vicar';
const parsonId = () => !F('gallDead') ? 'gall' : F('oakesVicar') ? 'oakes' : F('edmundVicar') ? 'edmund' : '';
PROJECTS.bells = { fx:['+5 Goodwill', '+1 Standing'], effects:`Goodwill rises. Standing rises a little.`, name:'Recast the tenor bell and rehang the ring', line:'The tenor bell is cracked and the frame under it is rotten. A founder at Aldbourne recasts the one. A carpenter rehangs all five.', seasons:1, cost:() => 180,
  blurb:`The tenor is cracked from lip to crown. The ringers make do with four.`, gain:'Goodwill',
  done:() => { fl('bells'); add({goodwill:5, standing:1}); return `The tenor comes home from the founder’s at Aldbourne upon a timber wagon, weighing eleven hundredweight, with the year and your name cast round her shoulder; and the carpenter having hung all five in a new frame, the ringers, for whom a barrel has been set in the tower, ring them upon the Sunday until it is empty, in two hours and forty minutes.

“Her do speak,” says the sexton.`; }};
PROJECTS.churchroof = { fx:() => ['+4 Goodwill', '+2 Standing'].concat(parsonId() ? ['+1 ' + parson()] : []), effects:`Goodwill and standing both rise. The parson is obliged.`, name:'New lead on the church roof, and the tower pointed', line:'The nave is the parish’s to keep up, by a rate on every occupier. You pay the plumber and the mason yourself.', seasons:2, cost:() => 260,
  blurb:`Rain comes in over the font. The churchwardens talk of a rate of ninepence in the pound.`, gain:'Goodwill and standing',
  done:() => { fl('churchRoof'); add({goodwill:4, standing:2}); if (parsonId()) reg(parsonId(), 1, 'You leaded the church roof at your own charge');
    return `The plumber casts his sheets upon a bed of sand in the churchyard, and four tons of new lead go up the ladders, while the mason rakes out the joints of the tower, and points them with lime; and as the bills go to the Hall, the vestry, which met upon the Tuesday to make a rate, finds that it has none to make, enters as much in the book, and adjourns to the Bell.

On Sunday the bucket is gone from beside the font.`; }};
PROJECTS.pew = { fx:['+3 Standing', '+2 Household', '−2 Goodwill'], effects:`Standing rises. The household is pleased. Goodwill falls a little.`, name:'A new Hall pew, with a stove', line:'The family pew is raised a step, panelled in oak and hung with green curtains. A small iron stove stands in the corner.', seasons:1, cost:() => 90,
  blurb:`The old pew is deal. The door has dropped on its hinges.`, gain:'Standing; the household',
  done:() => { fl('hallPew'); add({standing:3, family:2, goodwill:-2}); return `The joiner has the Hall pew finished by the Saturday, in oak panels shoulder high, with green baize curtains upon a brass rail, and a stove in the corner, whose pipe goes out through the north window.

On Sunday the family sits warm; and the two rows behind, who formerly saw the parson, see the curtains, and the top of the sounding board.

Old Dewey moves to the gallery stairs.

“I can hear un from here,” he says.`; }};


/* ---------- credit, and ruin by stages ---------- */
// Years when Consols yielded five per cent or more. The law holds a mortgage to five, so nobody lends on land.
const TIGHT = [1797, 1798, 1799, 1803, 1804, 1805, 1812, 1813, 1815];
const moneyTight = y => TIGHT.includes(y);
/* Credit never shuts altogether. When the bank will not lend at the legal five per cent, a private lender will, and his attorney takes a tenth for finding him.
   When the land will carry no more, there is still an annuity on the squire's life, and the oaks. */
const capWithout = f => { const i = S.farms.indexOf(f); S.farms.splice(i, 1); const c = mortCap(); S.farms.splice(i, 0, f); return c; };
const canBorrow = () => S.mortgage + 500 <= mortCap();
const borrowGets = () => moneyTight(S.year) || F('cut') ? 450 : 500;
const borrowNote = () => !canBorrow() ? '' : F('cut') && !moneyTight(S.year) ? 'Mr Tidmarsh is not at home to you. A lender at Newbury will find £500 on the land, and his attorney keeps £50 of it.' : moneyTight(S.year) ? 'Money is tight. A private lender at Newbury will find £500 on the land, and his attorney keeps £50 of it.' : 'Mr Tidmarsh lends at five per cent.';
const borrowWhy = () => canBorrow() ? '' : 'The land will carry no more on mortgage. An annuity may still be sold, or timber.';
const FLIP = 12;   // seasons
const lately = f => !!f.paid && S.t - f.boughtT < FLIP;
const grossPrice = f => { const g = Math.round((moneyTight(S.year) ? 17 : 20) * (f.void ? 0.9 * lettingValue(f, S.year) : Math.min(rentDue(f), lettingValue(f, S.year))) / 10) * 10; return lately(f) ? Math.min(g, f.paid) : g; };
/* A farm under lease is sold with the tenant bought out: a year's rent, and a quarter more for each further year he had to run, up to three years. */
const buyOut = f => f.void || f.lease.type === 'will' ? 0 : Math.round(Math.min(3, 1 + 0.25 * Math.max(0, f.lease.ends - S.year - 1)) * f.rent / 10) * 10;
const salePrice = f => Math.max(0, grossPrice(f) - buyOut(f));
const boughtFarm = () => S.farms.filter(f => f.own).sort((a, b) => b.base - a.base)[0];
const settledFarm = () => S.farms.length > 1 ? S.farms.filter(f => !f.own && f.tenant !== 'Edmund').sort((a, b) => b.base - a.base)[0] : null;
const edmundSigns = () => settledFarm() && (F('edmundDead') || S.chars.edmund.r > -3);
function conveyFarm(f){ const p = salePrice(f); S.farms.splice(S.farms.indexOf(f), 1);
  for (const id in VENTURES) if (VENTURES[id].of === f.id && live(id)) { stopVenture(id, 'Sold with the farm'); if (id === 'plough') delete f.mult; } S.money += p; S.soldFarms = S.soldFarms || {}; S.soldFarms[f.id] = f; return p; }
/* Called each quarter before the season's paper is chosen. Bills first, then the tradesmen, then the land, then the packet to Douglas. */
function creditCheck(){
  const first = id => { S.queue = S.queue.filter(x => x.id !== id); S.queue.unshift({id, at:S.t}); };
  if (S.money < -3000) { if (boughtFarm() || edmundSigns()) first('hammer'); else S.dead = 'ruin'; }
  else if (S.money < -1500 && (S.stoppedAt === undefined || S.t - S.stoppedAt >= 8)) { S.stoppedAt = S.t; first('georgeMeeting'); }
  if (S.season === 0 && moneyTight(S.year) && !moneyTight(S.year - 1)) S.notes.push('Consols are below sixty. Mr Tidmarsh writes that he can find nothing on mortgage while the Funds pay better than five per cent. An attorney at Newbury knows a private lender, at a price.');
}

ev({ id:'georgeMeeting', follow:true, cond:() => S.money < -800, title:'The Meeting at the George',
  text:() => `${steward()} brings a paper up from Wyvern, signed by the butcher, the chandler, the coal merchant, the saddler, and nine others; who, having met at the George on Tuesday, and being owed ${fmt(-S.money)} between them, have resolved to send nothing more to the Hall until it is paid.

Mrs Bunce has asked what she is to do about Sunday’s joint.`,
  choices:[
    {t:'Borrow it from Mr Tidmarsh on the land.', note:() => '+' + fmt(Math.ceil(-S.money / 500) * 500) + ' on mortgage', if:() => !moneyTight(S.year) && S.mortgage + Math.ceil(-S.money / 500) * 500 <= mortCap(), go:() => { const a = Math.ceil(-S.money / 500) * 500; S.mortgage += a; S.money += a;
      return `Mr Tidmarsh finds ${fmt(a)} in a week at five per cent.; and ${steward()}, driving into Wyvern with the notes, pays every name upon the paper at his own door. The butcher’s boy is at the kitchen door before the gig is back.`; }},
    {t:'Fell the oaks in Hanger Wood.', note:() => '+' + fmt(Math.round(75 * (1 + 0.035 * (S.year - 1795))) * 10), if:() => (S.timber === undefined ? 3 : S.timber) > 0, go:() => { const t = Math.round(75 * (1 + 0.035 * (S.year - 1795))) * 10; S.timber = (S.timber === undefined ? 3 : S.timber) - 1; add({money:t, standing:-3});
      return `The timber merchant from Reading goes through Hanger Wood with a scribing iron, and having marked two hundred oaks, pays ${fmt(t)} down. The sawyers dig their pit that week; and the fall can be heard from the terrace.`; }},
    {t:'Put down the carriage and shut up half the house.', note:() => '+£200, and ' + fmt(estCost(estIdx(), S.year) - estCost(estIdx() - 1, S.year)) + ' a year saved', if:() => estIdx() > 0, go:() => { stepEst(-1); add({money:200, standing:-2});
      return `The carriage horses go to Reading fair; two footmen and the under-gardener are paid off at the month; and the dining-room shutters being closed, the family dines in the breakfast parlour.

The chandler is paid in part.`; }},
    {t:'Ask them to wait.', go:() => { add({standing:-5});
      return `${steward()} carries the answer down, and the paper is read aloud at the George. On Saturday the butcher sends the joint, with a bill pinned to the cloth, and the bill marked “ready money”.`; }}
  ]});

ev({ id:'hammer', follow:true, cond:() => S.money < -2000 && (boughtFarm() || edmundSigns()), title:'A Sale by Order',
  text:() => `You owe ${fmt(-S.money)} in Wyvern and Reading upon bills and notes of hand, and two of the holders have taken out writs.

Mr Tidmarsh, coming out from the bank, asks for the estate map; and having unrolled it upon the library table, stands the inkwell upon one corner.

“Something must go, sir,” he says. “The question is what.”`,
  choices:[
    {t:() => 'Sell ' + boughtFarm().name + '.', note:() => 'About ' + fmt(salePrice(boughtFarm())) + '. It is your own to sell', if:() => !!boughtFarm(), go:() => { const f = boughtFarm(), p = conveyFarm(f); add({standing:-5});
      return `${f.name} is put up at the George by Mr Skinner in one lot, and knocked down at ${fmt(p)} to a brewer from Reading; and Mr Tidmarsh, having paid off the writs the same afternoon, brings you a draft for the balance.`; }},
    {t:() => 'Sell ' + settledFarm().name + ' out of the settlement.', note:() => 'About ' + fmt(salePrice(settledFarm())) + (F('edmundDead') ? '. The trustees must sign' : '. Edmund must sign'), if:() => !!edmundSigns(), go:() => { const f = settledFarm(), p = conveyFarm(f), r = settleProceeds(p, 200), off = r.off; if (f.id === 'longbarrow') fl('soldLongBarrow'); add({standing:-8, family:-12}); if (!F('edmundDead')) reg('edmund', -2, 'You sold ' + f.name + ' out of his inheritance'); reg('cullerne', 1);
      return `${F('edmundDead') ? 'The trustees meet in Lincoln’s Inn and sign the deed, and their clerk sends it down by the mail.' : 'The deed of consent goes to Edmund by the post, and comes back signed in three weeks, with no letter in it.'}

${f.name} is sold by private treaty to Lord Cullerne’s agent for ${fmt(p)}. ${off ? `The mortgagees take ${fmt(off)} of it. ` : ''}${r.trust ? `The trustees of the settlement put ${fmt(r.trust)} into the Three per Cents${F('edmundDead') ? '' : ' in Edmund’s name'}. ` : ''}The estate map is sent to Wyvern to be drawn again.`; }},
    {t:'Sell nothing.', go:() => { S.dead = 'ruin';
      return `Mr Tidmarsh rolls up the map, and says he is sorry for it. The writs are served on Thursday.`; }}
  ]});

/* ---------- ventures: each can make him, and each can break him ---------- */
const wageIdx = y => 0.55 + 0.45 * trail(y, 5) / 50;
const vent = id => S.vent && S.vent[id];
const live = id => vent(id) && !vent(id).ended;
const VENTURES = {
  plough:{ fx:["+ Long Barrow lets a quarter higher, seven years", "− Three tenths lower after that", "−£300 to lay it down again"], risk:3, odds:{"well": 0.35, "dull": 0.25, "ill": 0.4}, effects:`Long Barrow lets a quarter higher for seven years. After that it lets three tenths lower until the down is laid to grass again, which costs £300 and takes five years.`, name:'Plough up the down', line:'The sheep walk on Long Barrow has never been broken. It is pared, burnt and sown with wheat.', where:'Long Barrow', cost:250, if:() => !!farm('longbarrow'),
    well:'The farm is worth a quarter more to let, from the first crop.', ill:'The shepherd says there are seven crops in that turf and no more.',
    begin:() => { farm('longbarrow').mult = 1.25; }, state:v => 'In corn since ' + v.year,
    endLabel:'Lay it down to grass', endCost:300, end:v => { const lb = farm('longbarrow'); v.heal = S.year + 5; if (lb) lb.mult = S.year - v.year > 7 ? 0.8 : 1;
      return `The down at Long Barrow is sown with sainfoin and rye-grass. The shepherd says it will be five years before it carries a flock.`; }},
  merino:{ fx:["+£110 a year in wool", "+£150 a year in rams, 1806 to 1810", "+£400 to £1,400 if sold in time", "− Worth £60 once the fashion ends"], risk:3, odds:{"well": 0.4, "dull": 0.3, "ill": 0.3}, effects:`About £110 more wool each summer, and £150 a year in rams from 1806. The flock sells for £400 to £1,400 while the fashion lasts. If the fashion ends, the wool and the flock are worth next to nothing.`, name:'Merinos', line:'Spanish sheep of the King’s breed, small and close-woolled. You buy a ram and forty ewes from a flock in Wiltshire.', where:'The home farm', cost:420, no:() => S.year < 1800 ? 'Not before 1800. The King has the only flock in England, and has not yet parted with a ram.' : '',
    well:'Fine wool worth £110 more at each clip, and rams that sell to gentlemen.', ill:'The price of a ram is whatever gentlemen will give this year.',
    begin:() => { fl('merino'); }, state:v => 'A flock since ' + v.year,
    endLabel:'Sell the flock', end:v => { const y = S.year, p = y > 1810 ? 60 : Math.min(y <= 1805 ? 400 : 400 + 200 * (y - 1805), 400 + 200 * (y - v.year)); fl('merino', false); S.money += p;
      return `The merino flock is sold at Reading. It makes ${fmt(p)}.`; }},
  peat:{ fx:["+£170 a year, nine years", "− Kennet Bottom falls a grade after"], risk:2, odds:{"well": 0.6, "dull": 0.2, "ill": 0.2}, effects:`About £170 a year for nine years. Then the peat is gone and Kennet Bottom falls a grade, unless the water meadows have been floated.`, name:'Cut the peat', line:'Peat lies six feet deep under the river meadow. It is cut in summer, dried and sold in Newbury for firing.', where:'Kennet Bottom', cost:300, if:() => !!farm('kennet'),
    well:'About £170 a year in peat and ashes, for nine years or ten.', ill:'The peat lies under the best of the meadow.', state:v => 'Digging since ' + v.year },
  forage:{ fx:["+£130 in a year of war", "−£60 for a refused load", "−£220 in a year of peace"], risk:1, odds:{"well": 0.75, "dull": 0.15, "ill": 0.1}, effects:`£130 in a year of war. A refused delivery now and then, £60 lost. £220 lost in any year of peace.`, name:'Forage for the barracks', line:'A contract with the commissary at Reading. You deliver hay, oats and straw to the cavalry barracks at a fixed price.', where:'The estate', cost:200, no:() => S.year >= 1814 ? 'The commissary signs no new contract after 1813, the cavalry being upon their way home.' : '',
    well:'£130 a year, as long as there is cavalry at Reading.', ill:'The contract binds you to deliver at the price agreed, in peace or war.', state:v => 'Under contract since ' + v.year,
    endLabel:'Give up the contract', end:() => `The forage contract is given up; and the commissary, it appears, has found a man at Theale.` },
  thresher:{ fx:["+£50 a year in wages saved", "− Goodwill", "−£300 if the barn is fired"], risk:2, odds:{"well": 0.6, "dull": 0.2, "ill": 0.2}, effects:`Saves about £50 a year. Goodwill falls. From 1811, if the parish is ill disposed, the barn may be fired: £300 lost.`, name:'A threshing machine', line:'A Scotch machine of drum and beaters, turned by two horses in the great barn. It threshes what six men did with flails.', where:'The home farm', cost:120, no:() => F('thresher') ? 'There is one in the great barn already.' : S.year < 1803 ? 'Not before 1803, when the Reading foundry first undertakes to build one.' : '',
    well:'Saves about £50 a year in winter wages.', ill:'Six men thresh in your barn from Martinmas to Lady Day. They have no other work.',
    begin:() => { fl('thresher'); add({goodwill:-4}); }, state:v => 'In the great barn since ' + v.year },
  bank:{ fx:["+£150 a year", "+ Standing", "−£500 in a run", "−£2,500 to £5,000 if the bank breaks"], risk:4, odds:{"well": 0.45, "dull": 0.1, "ill": 0.45}, effects:`£150 a year and standing. A run on the bank may cost £500. If the bank breaks you lose the £1,000 and are called on for £1,500 to £4,000 more. You may withdraw only when money is easy.`, name:'A partner’s share in the Wyvern Bank', line:'Mr Tidmarsh’s bank at Wyvern issues its own notes. You put in a thousand pounds and sign as a partner.', where:'The estate', cost:1000,
    well:'Fifteen per cent, and a seat in the bank parlour.', ill:'Every partner answers for the notes with all he has.', state:v => 'A partner since ' + v.year,
    endLabel:'Withdraw from the bank', canEnd:() => !moneyTight(S.year), endWhy:'No partner can be let go while money is tight.',
    end:() => { S.money += 1000; return `You have withdrawn from the Wyvern Bank. Mr Tidmarsh repays the £1,000 and takes your name off the notes.`; }},
  spa:{ fx:["+£300 a year rising to £750, if the waters take", "+£90 a year if they half take", "−£60 a year if they fail"], risk:3, odds:{"well": 0.3, "dull": 0.5, "ill": 0.2}, effects:`If the waters take: £300 a year rising to £750, and standing. If they half take: £90 a year. If they fail: £60 a year lost until the pump room is shut.`, name:'The Hatherley Spa', line:'The spring below the Hall tastes of iron. You build a pump room over it and lodgings for invalids who come to drink.', where:'The estate', cost:1800,
    well:'If the waters take, £300 a year rising to £750.', ill:'Bath is thirty miles off, and Cheltenham had the King.',
    begin:v => { const r = Math.random(); v.fate = r < 0.3 ? 'hit' : r < 0.8 ? 'dull' : 'flop'; }, state:v => 'A pump room since ' + v.year,
    endLabel:'Shut the pump room', end:() => `The pump room is shut and the attendant paid off. The spring runs into the ditch as before.` }
};
/* Why a venture cannot be begun: the farm it belongs to is not held, or the year or the state of the parish forbids it. Each venture says so itself in no(). */
const ventFarm = (id, d) => d.farm || d.of || '';
function ventNo(id, d){ const fid = ventFarm(id, d);
  if (fid && !farm(fid)) { const nm = landFor(fid).name, sale = typeof farmsForSale === 'function' && farmsForSale().find(f => f.id === fid);
    return sale ? nm + ' is not yours. It is to be bought for ' + fmt(sale.price) + ', and this may be begun the day it is conveyed.' : fid === 'commonpiece' ? 'Common Piece is not yet a farm. The common must first be inclosed, and your allotment of it fenced.' : nm + ' is not yours, and nobody at present offers it for sale.'; }
  if (d.no) return d.no();
  return d.if && !d.if() ? 'Not to be had this year.' : ''; }
function venturesList(){ const open = S.phase !== 'end' && !S.dead;
  return Object.keys(VENTURES).map(id => { const d = VENTURES[id], v = vent(id), state = !v ? 'open' : v.ended ? 'ended' : 'inHand';
    const off = state === 'open' && !!soldWhy(d); let why = ''; if (state === 'open') { if (off) why = soldWhy(d); else if (!open) why = 'The books are closed.'; else if (ventNo(id, d)) why = ventNo(id, d); else if (S.money < d.cost) why = 'The purse will not stand ' + fmt(d.cost) + '.'; }
    const canEnd = open && state === 'inHand' && !!d.end && (!d.canEnd || d.canEnd()) && S.money >= (d.endCost || 0);
    return {id, name:d.name, where:d.where, line:d.line, cost:d.cost, well:d.well, ill:d.ill, effects:d.effects, fx:fxOf(d.fx), risk:d.risk, odds:d.odds, state, off, notYet:state === 'open' && !off && open && !!ventNo(id, d), can:state === 'open' && !why, why,
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

/* ---------- the establishment: what the Hall costs to keep, and what the county thinks of it ---------- */
const EST = [
  {id:'retrenched', name:'a retrenched household', cost:700, standing:25, line:`Half the rooms are shut and the carriage is put down. A cook, one maid and a boy.`},
  {id:'plain', name:'a plain establishment', cost:1000, standing:42, line:`A cook, two maids, a man and a gardener. One joint a day, and company once a month.`},
  {id:'handsome', name:'a handsome establishment', cost:1400, standing:60, line:`A butler, a footman and a housekeeper. Two courses at dinner, a carriage and pair, and the county asked to dine.`},
  {id:'splendid', name:'a splendid establishment', cost:2000, standing:80, line:`Eleven indoor servants in livery and a French cook. Wax candles in every room and the house open to the county.`}
];
const estIdx = () => Math.max(0, EST.findIndex(e => e.id === (S.est || 'plain')));
const priceRise = y => 1 + 0.032 * (y - FIRST_YEAR);
const estCost = (i, y) => Math.round(EST[i].cost * priceRise(y) * (T('figures') ? 0.9 : 1) * (T('captain') && !F('crewGone') ? 0.9 : 1) / 10) * 10;
function establishment(){ const i = estIdx(); return {id:EST[i].id, name:EST[i].name, cost:estCost(i, S.year), levels:EST.map((e, k) => ({id:e.id, name:e.name, cost:estCost(k, S.year), now:k === i}))}; }
const EST_DOWN = [
  `The carriage is sold, and the horses with it; three servants are paid off at the month; and the family dines upon one course in the breakfast parlour. Henrietta returns such calls as may be returned on foot.`,
  `The second footman goes, and the under-gardener with him; the claret is kept for company; and Henrietta, having gone through Mrs Bunce’s book line by line, strikes out the wax candles.`,
  `The man cook is given his wages and his coach fare, and the house in Brook Street is given up at Lady Day; but there are still two footmen in the hall.`];
const EST_UP = [null,
  `The shutters are opened in the dining room. A footman is hired at Wyvern, and a pair of carriage horses bought at Reading fair for sixty guineas.`,
  `A second footman is hired, and put into livery; the carriage is new painted, with the arms upon the door; and Henrietta sends out cards for a dinner of sixteen.`,
  `A man cook comes down from London at eighty guineas a year. There are four horses to the carriage and a house taken in Brook Street for the season. The Mercury notices the family’s arrival in town.`];
const EST_SETUP = [0, 150, 250, 400];
function stepEst(d){ const i = estIdx() + d; S.est = EST[i].id;
  if (d < 0) { add({standing:-4, family:i === 0 ? -6 : -4}); reg('henrietta', -1, i === 0 ? 'You sold her carriage' : undefined); return EST_DOWN[i]; }
  add({money:-EST_SETUP[i], standing:3, family:4}); reg('henrietta', 1); return EST_UP[i]; }
/* Altering the establishment takes the season. These join the season's undertakings. */
function estOptions(){ const i = estIdx(), y = S.year, o = [];
  if (i > 0) o.push({t:'Reduce to ' + EST[i - 1].name, note:'Saves ' + fmt(estCost(i, y) - estCost(i - 1, y)) + ' a year', hint:'Costs Standing and Household', run:() => stepEst(-1)});
  if (i < EST.length - 1) o.push({t:'Set up ' + EST[i + 1].name, note:fmt(estCost(i + 1, y) - estCost(i, y)) + ' a year more, and ' + fmt(EST_SETUP[i + 1]) + ' down', hint:'Standing, Household', run:() => stepEst(1)});
  return o; }
/* The quarter's cost of the Hall, and the pull of the establishment on the county's opinion. */
function householdQuarter(line){ const i = estIdx(), tgt = clamp(EST[i].standing + societyMark() - 6 * (S.settledSold || 0), 5, 95);
  if (S.annuities) line(S.annuities > 1 ? 'Annuities on your life, ' + numWords(S.annuities) : 'Annuity on your life', -25 * S.annuities);
  line('The Hall: ' + EST[i].name, -(estCost(i, S.year) / 4 - (F('bricked') ? 3 : 0)));
  if (T('jointure')) line('Your uncle’s widow, her jointure', -30);
  if (T('taste')) line('Milliners and mantua-makers', -30);
  if (T('bottle')) line('The wine merchant', -10);
  if (T('lawsuit') && S.season === 3) line('Costs in the matter of the pew', -40);
  if (T('brother') && S.season === 0) line('Lent to Henrietta’s brother', -(40 + Math.floor(Math.random() * 12) * 10));
  { const sc = houseCost('schoolroom'); if (sc) line(sc > 0 ? 'The schoolroom: governess and masters' : 'Saved by sending the governess away', -sc / 4); }
  { const sv = houseCost('servants'), sb = houseCost('stables'); if (sv) line(sv > 0 ? 'Servants’ wages above the county rate' : 'Saved on servants’ wages', -sv / 4); if (sb) line(sb > 0 ? 'The stables: corn, a second groom, the farrier' : 'Saved in the stables', -sb / 4); }
  if (S.t > 0) societyQuarter(line); }
/* The home farm pays its men by the week, and the vicar his tenth. */
const weekWage = y => Math.round(9 * wageIdx(y) / wageIdx(FIRST_YEAR));
function homeFarmCosts(line){ const y = S.year, s = weekWage(y);
  const paid = s + houseOf('labour').shillings; line('Home farm wages, nine men at ' + paid + 's. the week', -(9 * paid * 13 / 20) * (live('thresher') ? 0.94 : 1));
  if (S.season === 3 && !F('enclosed')) line('Tithe on the home farm', -45 * PRICES[y] / 75, 'For the year.'); }

/* ---------- the land market: buy at any time, sell any farm ---------- */
const MARKET_FARMS = ['coldharbour', 'rooksnest', 'withymead', 'maddle'];
const landFor = id => (S.soldFarms && S.soldFarms[id]) || Object.assign({id, level:'fair', arrears:0, lease:{type:'will'}}, NEW_FARMS[id]);
const askPrice = (f, years) => Math.round((years || (moneyTight(S.year) ? 19 : 22)) * lettingValue(f, S.year) / 10) * 10;
const loanOn = price => moneyTight(S.year) ? 0 : Math.floor(price * 0.6 / 100) * 100;   // the bank lends half on the farm itself, when it lends at all
function farmsForSale(){ estateSync(); const open = S.phase !== 'end' && !S.dead;
  const ids = MARKET_FARMS.concat(Object.keys(S.soldFarms || {}).filter(id => !MARKET_FARMS.includes(id))).filter(id => !farm(id));
  return ids.map(id => { const f = landFor(id), price = askPrice(f), trust = Math.min(S.trust || 0, price), loan = loanOn(price - trust), down = price - trust - loan;
    const why = !open ? 'The books are closed.' : S.farms.length >= MAX_FARMS ? 'Eight farms is as much as one steward can ride.' : S.money < down ? 'The purse will not stand ' + fmt(down) + ' down.' : '';
    return {id, name:f.name, land:LAND[id], acres:f.acres, price, down, loan, trust, order:ORDER_W[f.cond], value:lettingValue(f, S.year), can:!why, why}; }); }
function takeFarm(id, loan, paid){ const f = landFor(id); f.paid = paid; f.boughtT = S.t; if (S.soldFarms) delete S.soldFarms[id];
  Object.assign(f, {own:true, arrears:0, level:'fair', lease:{type:'will'}, since:S.year}); delete f.void; delete f.rebate; if (!f.tenant || f.tenant === 'Edmund') f.tenant = incomer()[0];
  f.rent = five(0.95 * lettingValue(f, S.year)); f.K = 0.5 * f.rent; if (loan) S.mortgage += loan;
  S.farms.push(f); return f; }
function buyFarm(id){ const x = farmsForSale().find(r => r.id === id); if (!x || !x.can) return false;
  S.money -= x.down; const f = takeFarm(id, x.loan, x.price); if (x.trust) { S.trust -= x.trust; if (x.trust >= x.price / 2) { f.own = false; S.settledSold = Math.max(0, (S.settledSold || 0) - 1); } }
  S.journal.unshift({when:stamp(), title:'Land', did:'Bought ' + f.name + ', ' + f.acres + ' acres, for ' + fmt(x.price) + (x.loan ? ', ' + fmt(x.loan) + ' of it on mortgage' : '') + (x.trust ? ', ' + fmt(x.trust) + ' of it the trustees’ money' : '')}); save(); render(); return true; }
function sellState(id){ const f = farm(id), open = S.phase !== 'end' && !S.dead, settled = !f.own;
  const why = !open ? 'The books are closed.' : S.farms.length <= 1 ? 'The last farm cannot be sold.' : f.tenant === 'Edmund' && !f.void ? 'Edmund farms it himself.' : settled && !F('edmundDead') && S.chars.edmund.r <= -3 ? 'Settled land. Edmund will not sign.' : '';
  const sp = settled ? splitSettled(salePrice(f), S.money, 0) : {free:salePrice(f), off:0, trust:0};
  return {canSell:!why, sellPrice:salePrice(f), sellGross:grossPrice(f), sellPayout:buyOut(f), sellToYou:sp.free, sellToMortgage:sp.off, sellToTrust:sp.trust, sellWhy:why, settled,
    sellEffects:(buyOut(f) ? 'The tenant is paid ' + fmt(buyOut(f)) + ' to give up the lease. ' : '') + (settled ? 'Settled land: Edmund must sign. The price clears your debts and the mortgage. The rest goes to the trustees, who keep it in the Funds for Edmund and pay you the dividends. Standing and the household suffer, and the estate will carry ' + fmt(mortCap() - capWithout(f)) + ' less on mortgage.' : 'Your own to sell. The money is yours. Standing falls a little.')}; }
/* Settled land is not the squire's to spend. Its price clears what he owes, then the mortgage, and the rest goes to the trustees of the settlement,
   who hold it in the Funds for Edmund and pay the squire the dividends. floor: the cash he is left holding when he was in debt. */
function splitSettled(p, before, floor){ const free = Math.min(p, Math.max(0, floor - before)), off = Math.min(S.mortgage, p - free); return {free, off, trust:p - free - off}; }
function settleProceeds(p, floor){ const r = splitSettled(p, S.money - p, floor); S.money -= p - r.free; S.mortgage -= r.off; S.trust = (S.trust || 0) + r.trust; S.settledSold = (S.settledSold || 0) + 1; return r; }
const trustFund = () => ({sum:S.trust || 0, income:Math.round((S.trust || 0) * (CONSOL_YIELD[S.year] || 5) / 100)});
function sellFarm(id){ const f = farm(id); if (!f || !sellState(id).canSell) return false; const settled = !f.own, p = conveyFarm(f);
  let r = null; if (settled) { r = settleProceeds(p, 0); add({standing:-5, family:-8}); if (!F('edmundDead')) reg('edmund', -2, 'You sold ' + f.name + ' out of his inheritance'); if (f.id === 'longbarrow') fl('soldLongBarrow'); }
  else add({standing:-2});
  if (f.tenant === 'Mrs Thorne') reg('thorne', -1, 'You sold Long Barrow over her head');
  const off = Math.min(S.mortgage, Math.max(0, S.mortgage - mortCap())); S.mortgage -= off; S.money -= off;
  S.journal.unshift({when:stamp(), title:'Land', did:'Sold ' + f.name + ' for ' + fmt(p) + (r ? (r.off ? '. ' + fmt(r.off) + ' to the mortgagees' : '') + (r.trust ? '. ' + fmt(r.trust) + ' to the trustees of the settlement' : '') : off ? '. The mortgagees took ' + fmt(off) : '')}); save(); render(); return true; }

/* A fourth farm, early and on easy terms. Once, in the second year. */
const offerId = () => ['coldharbour', 'rooksnest'].find(id => !farm(id));
ev({ id:'farmOffered', follow:true, cond:() => !!offerId() && S.farms.length < MAX_FARMS, title:'The Executors’ Offer',
  text:() => { const f = landFor(offerId()), p = askPrice(f, 13);
    return `Mr Ayliffe of ${f.name} died at Bath in February, having left the farm to three nieces in equal shares; and the nieces want money.

Their attorney rides over from Newbury, and will take ${fmt(p)} for the ${f.acres} acres, if the conveyance is signed this term; for put up at the George, he says, it would fetch ${fmt(askPrice(f))}, and take till Christmas.

${f.tenant} has the farm from year to year at ${fmt(five(0.95 * lettingValue(f, S.year)))}. Mr Tidmarsh has sent a note by the attorney, to say that he will lend the whole sum upon the farm itself at five per cent.`; },
  choices:[
    {t:'Buy it on Mr Tidmarsh’s money.', note:() => fmt(askPrice(landFor(offerId()), 13)) + ', all of it on mortgage', go:() => { const p = askPrice(landFor(offerId()), 13), f = takeFarm(offerId(), p, p); add({standing:2});
      return `The conveyance is signed in the attorney’s office at Newbury, where Mr Tidmarsh’s clerk counts ${fmt(p)} in notes on to the table, and the attorney counts them again.

${steward()} rules a new page in the book, and writes “${f.name}” at the head of it.`; }},
    {t:'Buy it with your own money.', note:() => fmt(askPrice(landFor(offerId()), 13)), if:() => S.money >= askPrice(landFor(offerId()), 13), go:() => { const p = askPrice(landFor(offerId()), 13); S.money -= p; const f = takeFarm(offerId(), 0, p); add({standing:2});
      return `You give the attorney a draft upon Tidmarsh’s for ${fmt(p)}, and he, having read it twice, puts it in his pocket-book.

${f.name} is yours from quarter day, and ${f.tenant} sends up a goose.`; }},
    {t:'Let it go to the hammer.', go:() => { const f = landFor(offerId());
      return `The attorney bows, and rides back to Newbury; and on Saturday ${f.name} is in the Mercury, to be sold by private contract, the price asked being ${fmt(askPrice(f))}.`; }}
  ]});

/* ---------- more works ---------- */
PROJECTS.barns = { fx:["+ Church Farm up a grade", "+ About a seventh more rent"], effects:`Church Farm goes up a grade: worth about a seventh more to let.`, name:'A new barn and yards at Church Farm', line:'A tiled barn with a plank threshing floor, and walled yards where the cattle winter on straw.', seasons:2, cost:() => 450, if:() => !!farm('church') && farm('church').cond < 4,
  blurb:`The old barn is thatch on crucks. The corn is threshed on an earth floor and the beasts winter in the lane.`, gain:'Church Farm in better order',
  done:() => { const f = farm('church'); if (!f) return `The barn is finished. The farm it stands on is no longer yours.`; f.cond = Math.min(4, f.cond + 1);
    return `The new barn at Church Farm is tiled, with a threshing floor of oak plank and yards walled round for forty beasts. ${f.void ? 'It stands empty until the farm is let' : f.tenant + ' has carried the wheat in'}.`; }};
PROJECTS.chalk = { fx:["+ Long Barrow up a grade", "+ About a seventh more rent"], effects:`Long Barrow goes up a grade: worth about a seventh more to let.`, name:'Chalk the thin ground at Long Barrow', line:'Chalk is dug from pits on the down and spread over the sour fields. Frost breaks it and the plough turns it in.', seasons:2, cost:() => 350, if:() => !!farm('longbarrow') && farm('longbarrow').cond < 4,
  blurb:`Pits sunk on the down, and the chalk drawn out and spread at two hundred loads to the acre.`, gain:'Long Barrow in better order',
  done:() => { const f = farm('longbarrow'); if (!f) return `The chalking is finished. The farm is no longer yours.`; f.cond = Math.min(4, f.cond + 1);
    return `Four pits are open upon the down at Long Barrow, and the chalk out of them lies white over ninety acres, where the frost has broken it small; and ${steward()} enters the farm as ${ORDER_W[f.cond].toLowerCase()}.`; }};

/* ---------- more ventures ---------- */
const CONSOL_YIELD = {1795:4.52,1796:4.88,1797:5.91,1798:5.93,1799:5.09,1800:4.70,1801:4.90,1802:4.23,1803:5.14,1804:5.25,1805:5.07,1806:4.89,1807:4.77,1808:4.52,1809:4.38,1810:4.41,1811:4.67,1812:5.01,1813:5.11,1814:4.52,1815:5.04};
const consolPrice = y => 300 / (CONSOL_YIELD[y] || 5);
const atWar = y => y !== 1802;
Object.assign(VENTURES, {
  funds:{ fx:["+£25 a year or so", "+ or − the price of the day when sold"], risk:0, odds:{"well": 0.4, "dull": 0.4, "ill": 0.2}, effects:`About £25 a year in dividends. Sold at the price of the day, which has stood anywhere between 50 and 71.`, name:'Five hundred pounds in the Three per Cents', line:'Government stock, entered in your name in the books at the Bank. It pays three pounds a year on every hundred.', where:'The Bank of England', cost:500,
    well:'The dividend is paid in January and July, in war or peace.', ill:'The price moves with every despatch from the Continent.',
    begin:v => { v.stock = Math.round(500 / consolPrice(S.year) * 10) * 10; }, state:v => fmt(v.stock) + ' stock, worth ' + fmt(v.stock * consolPrice(S.year) / 100) + ' today',
    endLabel:'Sell out of the Funds', end:v => { const p = Math.round(v.stock * consolPrice(S.year) / 100); S.money += p;
      return `Mr Tidmarsh’s London agent has sold ${fmt(v.stock)} Three per Cents at ${Math.round(consolPrice(S.year))}. It comes to ${fmt(p)}.`; }},
  malthouse:{ fx:["+£90 a year", "+£140 when barley is cheap", "−£40 in a year of famine prices", "+£400 if sold"], risk:1, odds:{"well": 0.7, "dull": 0.15, "ill": 0.15}, effects:`£90 a year, £140 when wheat is under seventy shillings. £40 lost in a year of famine prices. Sells for £400.`, name:'A malthouse at Wyvern', line:'A kiln and two malting floors at Wyvern. Barley is steeped, sprouted and dried there for the brewers.', where:'The estate', cost:700,
    well:'About £90 a year, and more when barley is cheap.', ill:'In a dear year the justices stop the malting to save the grain for bread.', state:v => 'Malting since ' + v.year,
    endLabel:'Sell the malthouse', end:() => { S.money += 400; return `The malthouse is sold to a brewer at Newbury for £400, with the kiln and the cistern.`; }},
  brickkiln:{ fx:["+£60 a year", "+£120 in a year of building"], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`£60 a year, £120 in a year when works are in hand.`, name:'A brick kiln at Kennet Bottom', line:'The clay at Kennet Bottom burns to a sound red brick. You build a kiln by the pit and hire a brickmaker.', where:'Kennet Bottom', cost:350, if:() => !!farm('kennet'),
    well:'£60 a year, and twice that in any year you are building.', ill:'No carrier will take bricks beyond Wyvern at the price.', state:v => 'Burning since ' + v.year },
  privateer:{ fx:["+£300 to £1,200 for a prize", "−£80 for a refit", "− The share lost if she is taken", "+£250 if sold"], risk:3, odds:{"well": 0.35, "dull": 0.2, "ill": 0.45}, effects:`In a year of war: perhaps a prize, £300 to £1,200 to your share. Perhaps a refit, £80. Perhaps she is taken and the share is lost. Sells for £250.`, name:'A sixteenth of a Bristol privateer', line:'The Hetty sails from Bristol under a letter of marque to take French merchantmen. Her owners divide what the prizes fetch.', where:'The Hetty, 14 guns', cost:600, no:() => S.year >= 1814 ? 'No letters of marque are granted after 1813.' : !atWar(S.year) ? 'No letters of marque are granted in a year of peace. She may be had again when the war is renewed.' : '',
    well:'A sixteenth of whatever she takes.', ill:'She carries fourteen guns. A French frigate carries forty.', state:v => 'At sea since ' + v.year,
    endLabel:'Sell the share', end:() => { S.money += 250; return `Your sixteenth of the Hetty is sold on the Bristol quay for £250.`; }}
});
const ventureTickOne = ventureTick;
ventureTick = function(line){ ventureTickOne(line); if (!S.vent) return; const y = S.year, q = S.season, P = PRICES[y], earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  if (live('funds') && q % 2 === 0) earn('Dividend on the Three per Cents', vent('funds').stock * 0.015);
  if (live('malthouse') && q === 3 && y > vent('malthouse').year) { if (P >= 100) { line('The malthouse, standing empty', -40); S.notes.push('The justices have asked the maltsters to stop steeping while bread is at this price. The malthouse at Wyvern has been shut since Christmas.'); } else earn('The malthouse at Wyvern', 90 + (P < 70 ? 50 : 0)); }
  if (live('brickkiln') && q === 1 && y > vent('brickkiln').year) earn('Bricks from the Kennet Bottom kiln', S.works.length ? 120 : 60);
  if (live('privateer') && q === 2 && y > vent('privateer').year) { const r = Math.random();
    if (!atWar(y)) S.notes.push('The Hetty is laid up at Bristol for the peace. Her guns are in store.');
    else if (r < 0.12) { stopVenture('privateer', 'Taken'); S.notes.push('The Bristol agents write that the Hetty was taken off Ushant by a French frigate, and that her people are at Brest; your sixteenth is lost.'); }
    else if (r < 0.30) { const prize = (3 + Math.floor(Math.random() * 10)) * 100; earn('A sixteenth of the Hetty’s prize money', prize); S.notes.push('The Hetty has sent a brig into Bristol with hides and cochineal. The Admiralty Court has condemned ship and cargo as prize.'); }
    else if (r < 0.45) line('The Hetty, refitting', -80);
    if (y >= 1814 && live('privateer')) { stopVenture('privateer', 'Paid off at the peace'); S.money += 150; S.notes.push('The Hetty is paid off and sold out of the service. Your sixteenth of the hull comes to £150.'); } }
};

/* Three things to be done beyond the park pale: a gate on the London road, a race meeting and a telegraph station on the Down. Each moves a mark while it stands (see marks()). */
const telegraphWanted = y => y >= 1796 && y <= 1813 && y !== 1802;
Object.assign(VENTURES, {
  turnpike:{ fx:["+£35 a year in tolls", "+2 Standing", "−2 Goodwill", "+£400 if sold"], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`About £35 a year in tolls. Standing rises a little. Goodwill falls a little while the gate stands. The share sells for £400.`, name:'A turnpike gate on the London road', line:'A white gate across the London road, a keeper’s cottage and a painted board of tolls. The trust takes your five hundred pounds.', where:'The London road', cost:500,
    well:'About £35 a year out of the tolls, and a trustee’s seat at the George.', ill:'Every cart from Hatherley to Wyvern market pays at the gate.', state:v => 'Taking toll since ' + v.year,
    endLabel:'Sell the share', end:() => { S.money += 400; return `Your share in the Wyvern Turnpike Trust is sold to Mr Tidmarsh for £400. The gate-keeper is told on Monday.`; }},
  racecourse:{ fx:["+3 Standing", "+1 Goodwill", "−£60 a year for the Plate"], risk:0, odds:{"well": 0.8, "dull": 0.2, "ill": 0}, effects:`Two days’ racing on the Down every August. Standing rises, and goodwill a little, while the meeting is kept up. The Hatherley Plate and the ordinary cost £60 a year.`, name:'A race meeting on the Down', line:'A course roped out on the Down, with a judge’s box and a stand of boards. The horses run in heats.', where:'The Down', cost:300,
    well:'A two-mile course on the old turf. The county comes for two days in August.', ill:'A Plate of fifty pounds must be found every year.', state:v => 'Run every August since ' + v.year,
    endLabel:'Give up the meeting', end:() => `The meeting is given up; the posts and rails are sold to Mr Hartopp for hurdles, and the stand goes for firewood.` },
  telegraph:{ fx:["+£25 a year while the war lasts", "+1 Standing"], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`The Admiralty pays £25 a year for an acre on the Down while the war lasts. Standing rises a little.`, name:'An Admiralty telegraph on the Down', line:'A wooden hut with six shutters in a frame on its roof. It passes the Admiralty’s signals from London to the ports.', where:'The Down', cost:15, no:() => telegraphWanted(S.year) ? '' : S.year < 1796 ? 'Not until 1796, when the Admiralty carries its line of shutters across the Down.' : S.year > 1813 ? 'The Admiralty takes no new ground after 1813.' : 'The Admiralty has shut its line for the peace, and will want the ground again when the war is renewed.',
    well:'£25 a year from the Navy Board for one acre of turf.', ill:'A lieutenant and two seamen live in a hut on your hill. They have a telescope.', state:v => 'Six shutters on the hill since ' + v.year }
});
VENTURES.tithes = { fx:() => ['+£60 a year, clear of the rent', '−3 Goodwill'].concat(F('gallDead') ? [] : ['+1 Dr Gall']), risk:0, odds:{"well": 0.8, "dull": 0.2, "ill": 0}, effects:`About £60 a year clear, after the vicar has his rent. Goodwill falls while your wagon takes the tenth. The lease ends if the parish is inclosed.`, name:'The vicar’s tithes, on lease', line:'The vicar is owed a tenth of every crop in the parish. He lets the gathering of it to you for a fixed sum a year.', where:'The church', cost:150, no:() => F('enclosed') ? 'The award gave the vicar land in place of his tithes, and there are none left to lease.' : '',
  well:'About £60 a year clear, after the vicar has his three hundred.', ill:'Your wagon stands in every farmer’s gateway at harvest and takes the tenth shock.',
  begin:() => { if (!F('gallDead')) reg('gall', 1, 'You took the tithes off his hands'); }, state:v => 'Gathering the tenth since ' + v.year,
  endLabel:'Give up the lease', end:() => `The tithe lease is given up. ${parson()} sends his own wagon round the parish again at harvest.` };
const ventureTickTwo = ventureTick;
ventureTick = function(line){ ventureTickTwo(line); if (!S.vent) return; const y = S.year, q = S.season, earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  if (live('turnpike') && q === 1 && y > vent('turnpike').year) earn('Tolls at the London road gate', 35);
  if (live('racecourse') && q === 2 && y > vent('racecourse').year) line('The Hatherley Plate, and the ordinary', -60);
  if (live('tithes')) { if (F('enclosed')) { stopVenture('tithes', 'Ended by the award'); S.notes.push('The award gives the vicar land in place of his tithes, so that your lease of them is at an end; and the tithe wagon is sold at Wyvern.'); }
    else if (q === 3 && y > vent('tithes').year) earn('The tithes, over the vicar’s rent', 60); }
  if (live('telegraph') && q === 3 && y > vent('telegraph').year) {
    if (y >= 1814) { stopVenture('telegraph', 'Shut at the peace'); S.notes.push('The Admiralty has shut the telegraph, and the lieutenant is gone upon half-pay; the frame and the hut upon the Down are left to you, for the carting.'); }
    else if (y === 1802) S.notes.push('The shutters on the Down are lashed down for the peace. The Navy Board pays no rent this year.');
    else earn('The Navy Board, for the telegraph ground', 25); }
};

/* ---------- society: what money buys in the county and in town, and what can be sold out of the house ---------- */
/* mark: how far the thing raises (or, sold, lowers) the level the county's opinion settles at. keep: its cost a year in 1795 money. */
const SOCIETY = {
  plate:{ fx:["+£420 if sold", "− Standing, if sold", "− Henrietta, if sold"], effects:`Sold: £420. Standing settles four lower. Henrietta and the household take it hard.`, name:'The family plate', line:'The silver for the dining table, bought by four generations and engraved with the rooks.', where:'The strong room', heir:true, mark:4, held:'In the strong room',
    well:'Two tureens, four dozen plates and the Queen Anne salvers, with the arms on every piece.', ill:'Henrietta counts it herself on the first of the month.',
    endLabel:'Send it to Rundell’s to be sold', sell:420, end:() => { add({family:-4}); reg('henrietta', -2, 'You sold the plate'); return `The plate goes up to Ludgate Hill in two chests, where Rundell’s pay for it by weight, at five and sixpence the ounce; and dinner at the Hall is served upon Staffordshire ware.`; }},
  cellar:{ fx:["+£260 if sold", "− Standing, if sold"], effects:`Sold: £260. Standing settles two lower.`, name:'Your uncle’s cellar', line:'Your uncle laid down a pipe of port every second year. The bins run the length of the east wing.', where:'Under the east wing', heir:true, mark:2, held:'Ninety dozen, laid down',
    well:'Port of 1775, claret, and a pipe of Madeira that has been twice to the Indies.', ill:'The county has been drinking it for twenty years and knows the bins.',
    endLabel:'Sell it to a wine merchant', sell:260, end:() => `A wine merchant from Reading takes the whole cellar at a valuation, and carries it away in three wagons; the butler keeps the key.` },
  hunters:{ fx:["−£60 a year to keep", "+£180 if sold", "− Standing, if sold"], effects:`Kept: £60 a year. Sold: £180, standing settles three lower, the household a little put out. No harriers without them.`, name:'Four hunters', line:'Four horses bred to gallop and jump, kept for the hunting field and used for nothing else.', where:'The stables', heir:true, mark:3, held:'In the stables', keep:60,
    well:'They carry you with the Craven twice a week from November.', ill:'Each eats as much as a labourer earns.',
    endLabel:'Send them to Tattersall’s', sell:180, end:() => { add({family:-2}); return `The four hunters go up to Hyde Park Corner with a groom, and make forty-five guineas apiece under Mr Tattersall’s hammer; and you go to the next meet upon the cob.`; }},
  library:{ fx:["+£240 if sold", "− Household, if sold", "− Kitty, if sold"], effects:`Sold: £240. Standing settles one lower. The household minds, and Kitty most.`, name:'The library', line:'A long room on the north side, shelved to the cornice. Your grandfather bought most of the books and the globes.', where:'The Hall', heir:true, mark:1, held:'Two thousand volumes',
    well:'Your grandfather’s county histories, the sermons, and a first folio of something.', ill:'Nobody has had the top shelves down since 1760.',
    endLabel:'Sell it to a London bookseller', sell:240, end:() => { add({family:-3}); if ((S.flags.kitty || 'free') === 'free') reg('kitty', -1, 'You sold the library'); return `A bookseller from Pall Mall is three days in the library, with a ladder and a clerk, and takes everything but the sermons; after which the shelves are dusted, and the door is kept shut.`; }},
  chariot:{ fx:["+ Standing", "+ Henrietta", "−£50 a year to keep", "+£80 if sold"], effects:`Standing settles three higher. Henrietta pleased. £50 a year to keep. Sells for £80.`, name:'A new chariot from Long Acre', line:'A closed carriage for two, hung on steel springs and drawn by a pair. The coachmaker wants eight weeks.', where:'The coach house', cost:190, keep:50, mark:3, held:'In the coach house', verb:'Order it',
    well:'Yellow panels, the arms on the door, and springs that let Henrietta arrive unshaken.', ill:'There is a duty on it, on the horses, and on the man who drives.',
    begin:() => { add({family:2}); reg('henrietta', 1, 'You bought her a London chariot'); },
    endLabel:'Sell it', sell:80, end:() => { reg('henrietta', -1); return `The chariot is sold to a coach master at Reading for eighty pounds. He paints out the arms the same week.`; }},
  portraits:{ fx:["+ Standing", "+ Henrietta", "+ Household"], effects:`Standing settles two higher. Henrietta and the household pleased. Nothing to keep.`, name:'Two portraits by Mr Beechey', line:'Mr Beechey is portrait painter to the Queen. Your likeness and Henrietta’s go on two canvases, fifty inches by forty.', where:'The dining room', cost:130, mark:2, held:'Over the sideboard', verb:'Sit for him',
    well:'Yourself in a brown coat, and Henrietta with a harp she does not play.', ill:'Sixty guineas each, and five sittings in Harley Street.',
    begin:() => { add({family:3}); reg('henrietta', 1, 'You had her painted by Beechey'); }},
  cup:{ fx:["+ Standing", "−£50 every year"], effects:`Standing settles two higher. £50 every year until you stop.`, name:'A cup at Newbury races', line:'A silver-gilt cup with your name on the foot, given each year to the owner of the winning horse.', where:'The county', cost:50, keep:50, mark:2, held:'Given yearly', verb:'Give it',
    well:'Fifty guineas in silver gilt, run for in your name every August.', ill:'A cup once given is looked for every year.',
    endLabel:'Give no cup this year', sell:0, end:() => `The stewards of the course are told there will be no Hatherley Cup. The race is run for a sweepstake.` },
  harriers:{ fx:["+ Standing", "−£210 a year to keep", "− Goodwill", "+£130 if sold"], effects:`Standing settles five higher. £210 a year to keep. Goodwill falls a little. Sells for £130.`, name:'A pack of harriers', line:'Hounds bred to hunt the hare. They go out two days a week over your own farms and your neighbours’.', where:'Kennels at the home farm', cost:320, keep:210, mark:5, held:'Twenty couple', verb:'Buy the pack', if:() => !ended('hunters'), ifWhy:'You have no horses to follow them on.',
    well:'Twenty couple, a huntsman and a whipper-in. The young men of the county come to you.', ill:'They are fed on horseflesh and oatmeal every day of the year, and they run over growing corn.',
    begin:() => { add({goodwill:-2}); },
    endLabel:'Sell the pack', sell:130, end:() => `The harriers are sold to a gentleman in Hampshire, and the huntsman goes with them; the kennels are let to a man who keeps pigs.` },
  townhouse:{ fx:["+ Standing", "+ Henrietta", "+ Household", "−£260 a year to keep", "+£520 if sold"], effects:`Standing settles six higher. Henrietta much pleased. £260 a year to keep. The lease sells for £520.`, name:'A house in Upper Brook Street', line:'A narrow house near Grosvenor Square, held on lease. The family goes up to it in the spring for the season.', where:'London', cost:900, keep:260, mark:6, held:'On lease', verb:'Take the lease',
    well:'Three windows wide, on lease, with a door Henrietta may write on her cards.', ill:'The servants there are paid all the year and the house is lived in for ten weeks.',
    begin:() => { fl('townHouse'); add({family:4}); reg('henrietta', 2, 'You took a house in town'); },
    endLabel:'Sell the lease', sell:520, end:() => { fl('townHouse', false); add({family:-3}); reg('henrietta', -2, 'You gave up the house in town'); return `The lease of the Brook Street house is sold to an East India captain. The furniture comes down by the wagon.`; }},
  operabox:{ fx:["+ Standing", "+ Henrietta", "−£210 every season"], effects:`Standing settles three higher. Henrietta pleased. £210 every season.`, name:'A box at the King’s Theatre', line:'The King’s Theatre is the Italian opera house. A box there is hired for the season, Tuesdays and Saturdays.', where:'The Haymarket', cost:210, keep:210, mark:3, held:'For the season', verb:'Subscribe', if:() => held('townhouse'), ifWhy:'A box wants a house in town to go home to.',
    well:'Second tier, six chairs. Everyone Henrietta wishes to be seen by is opposite.', ill:'Two hundred guineas, every season, whether Catalani sings or not.',
    begin:() => { reg('henrietta', 1); },
    endLabel:'Give up the box', sell:0, end:() => `The box is given up at the end of the season. It is taken the same day by a banker’s wife.` },
  presentation:{ fx:["+ Kitty’s prospects", "+ Household", "+ Standing"], effects:`Kitty is out in the world. The household pleased. Standing settles one higher.`, name:'Present Kitty at a Drawing Room', line:'The Queen holds her Drawing Rooms at St James’s. A girl led up to her in court dress may afterwards go into company.', where:'St James’s', cost:260, mark:1, held:'Presented', verb:'Present her', if:() => (S.flags.kitty || 'free') === 'free', ifWhy:'She is spoken for.',
    well:'A hoop, a train, three feathers, and her name called to the Queen.', ill:'The gown is worn once.',
    begin:() => { fl('kittyPresented'); add({family:3}); reg('kitty', 1); reg('henrietta', 1); }},
  deputy:{ fx:["+ Standing", "+ Lord Cullerne"], effects:`Standing settles four higher. Lord Cullerne a little warmer. Nothing to keep.`, name:'A Deputy Lieutenant’s commission', line:'The Lord Lieutenant names gentlemen of the county to act under him. They raise the militia and sign its returns.', where:'The county', cost:90, mark:4, held:'In commission', verb:'Take it out', needs:() => [standNeed(50, 'The Lord Lieutenant names none but gentlemen of settled consequence in the county')],
    well:'A scarlet coat with silver lace, and your name in the list after the peers.', ill:'Fees to the Clerk of the Peace, and the uniform at your own charge.',
    begin:() => { reg('cullerne', 1); }},
  knight:{ fx:["+ Standing", "+ Henrietta", "+ Household"], effects:`Standing settles six higher. Henrietta is Lady. Nothing to keep.`, name:'A knighthood', line:'A knighthood is not to be bought: it falls to the gentleman whom the county sends up to the Levee with its loyal address, upon whose shoulder the King lays a sword; and it does not pass to Edmund.', where:'St James’s', cost:110, mark:6, held:'Sir, and Lady', verb:'Carry up the address',
    needs:() => [standNeed(58, 'The county must choose you to carry its address, and it chooses a man of whom it thinks well')].concat(held('baronet') ? [{t:'A baronet is Sir already, and cannot be knighted into the bargain.', ok:false}] : []),
    well:'You carry the county’s loyal address to the Levee and rise Sir. Henrietta is Lady from that day.', ill:'A hundred guineas in fees to the Heralds, the Lord Chamberlain’s office and eleven doorkeepers.',
    begin:() => { fl('knight'); add({family:5}); reg('henrietta', 2, 'You made her Lady'); }},
  baronet:{ fx:["+ Standing, a great deal", "+ Henrietta", "+ Household", "+ Edmund"], effects:`Standing settles ten higher. Henrietta gets what she hoped for. Edmund inherits the title.`, name:'A baronetcy', line:'A baronetcy is asked of the King by his Minister, who asks it for gentlemen whose names he has reason to know: a Member who votes with him, or one of the first men of a county. It passes under the Great Seal, upon vellum, in a red box; and Edmund is Sir after you.', where:'The Patent Office', cost:1200, mark:10, held:'By patent, to heirs male', verb:'Pay the fees',
    needs:() => { const n = Math.round(S.standing), poll = [1796, 1802, 1806, 1807, 1812].find(y => y > S.year);
      return [{ok:!!F('mp') || S.standing >= 68, t:F('mp') ? 'The Minister must know your name. You sit for Wyvern, and he counts your vote.' : S.standing >= 68 ? 'The Minister must know your name. Your standing in the county is ' + n + ', and at 68 he cannot help knowing it.'
        : 'The Minister must know your name, and does not. He would know it if you sat for Wyvern' + (poll ? ', which is next polled in ' + poll : '') + '; or if your standing in the county, which is ' + n + ', were 68.'}]; },
    well:'Sir, by patent, and Edmund Sir after you.', ill:'The fees on the patent are near twelve hundred pounds. What the Minister expects besides is not written down.',
    begin:() => { fl('baronet'); add({family:8}); reg('henrietta', 3, 'You made her a baronet’s lady'); reg('edmund', 1); }}
};
/* What an honour asks for beside its fees. Each row is a sentence and whether the squire answers it; the page prints them all, and the lot is refused while any is wanting. */
const standNeed = (at, because) => { const n = Math.round(S.standing); return {ok:S.standing >= at, t:because + ': a standing of ' + at + ' or better. Yours is ' + n + '.'}; };
function socNeeds(id){ const d = SOCIETY[id]; if (!d.needs) return null;
  return d.needs().concat(d.cost ? [{ok:S.money >= d.cost, t:fmt(d.cost) + ' in your purse, for the fees. You have ' + fmt(Math.max(0, Math.floor(S.money))) + '.'}] : []); }
const socLacks = id => { const n = socNeeds(id); if (!n) return ''; const x = n.find(r => !r.ok); return x ? x.t : ''; };
const soc = id => S.soc && S.soc[id];
const ended = id => !!(soc(id) && soc(id).ended);
const held = id => !ended(id) && (SOCIETY[id].heir || !!soc(id));
const societyMark = () => Object.keys(SOCIETY).reduce((a, id) => a + (held(id) && !SOCIETY[id].heir ? SOCIETY[id].mark : ended(id) && SOCIETY[id].heir ? -SOCIETY[id].mark : 0), 0);
const socKeep = id => Math.round((SOCIETY[id].keep || 0) * priceRise(S.year) / 10) * 10;
function societyList(){ const open = S.phase !== 'end' && !S.dead;
  return Object.keys(SOCIETY).map(id => { const d = SOCIETY[id], state = ended(id) ? 'ended' : held(id) ? 'inHand' : 'open', keep = socKeep(id);
    const needs = state === 'open' ? socNeeds(id) : null;
    const why = state !== 'open' ? '' : !open ? 'The books are closed.' : needs && socLacks(id) ? socLacks(id) : d.if && !d.if() ? d.ifWhy : S.money < d.cost ? 'The purse will not stand ' + fmt(d.cost) + '.' : '';
    const canEnd = open && state === 'inHand' && !!d.end;
    return {id, house:!!d.house, name:d.name, where:d.where, line:d.line, cost:d.cost || 0, keep, sell:d.sell || 0, well:d.well, ill:d.ill, effects:d.effects, fx:societyFx(id), needs, state, can:state === 'open' && !why, why, verb:d.verb || 'Pay for it',
      held:state === 'inHand' ? d.held : '', note:state === 'inHand' ? (keep ? 'Costs ' + fmt(keep) + ' a year to keep' : d.heir ? 'Came with the house' : 'Since ' + soc(id).year) : state === 'ended' ? (d.sell ? 'Sold' : 'Given up') + ', ' + soc(id).ended : keep ? fmt(keep) + ' a year to keep' : '',
      canEnd, endLabel:state === 'inHand' && d.end ? d.endLabel + (d.sell ? ', ' + fmt(d.sell) : '') : '', endWhy:''}; }); }
function beginSociety(id){ const x = societyList().find(r => r.id === id); if (!x || !x.can) return false; const d = SOCIETY[id];
  S.soc = S.soc || {}; S.soc[id] = {year:S.year}; S.money -= d.cost; add({standing:Math.ceil(d.mark / 2)}); if (d.begin) d.begin();
  S.journal.unshift({when:stamp(), title:'Society', did:d.name + ', ' + fmt(d.cost)}); save(); render(); return true; }
function endSociety(id){ const x = societyList().find(r => r.id === id); if (!x || !x.canEnd) return false; const d = SOCIETY[id];
  S.soc = S.soc || {}; S.soc[id] = Object.assign(S.soc[id] || {year:FIRST_YEAR}, {ended:S.year}); S.money += d.sell || 0; add({standing:-Math.ceil(d.mark / 2)}); const said = d.end();
  if (id === 'townhouse' && held('operabox') && soc('operabox')) S.soc.operabox.ended = S.year;
  if (id === 'hunters' && held('harriers') && soc('harriers')) { S.soc.harriers.ended = S.year; S.money += SOCIETY.harriers.sell; }
  S.journal.unshift({when:stamp(), title:'Society', did:d.endLabel + '. ' + said}); save(); render(); return true; }
/* The quarter's cost of keeping what is kept. */
function societyQuarter(line){ for (const id in SOCIETY) if (held(id) && SOCIETY[id].keep) line(SOCIETY[id].name, -socKeep(id) / 4); }
/* Land he bought is his own, and counts in what he is worth. Settled land is Edmund's, and does not. */
const ownLandValue = () => S.farms.filter(f => f.own).reduce((a, f) => a + salePrice(f), 0);

/* ---------- the Brazil Association: a bubble in four papers, 1808 to 1810 ---------- */
/* Three fates, fixed when the prospectus arrives and hidden. made: the ship comes home full. glut: the market breaks with the rest in 1810.
   gone: the secretary goes abroad and the proprietors answer for the debts. The letter of 1809 tells which, to anyone who reads it closely. */
const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
function numWords(n){ n = Math.round(n); if (n === 0) return 'nothing';
  const under = k => { const h = Math.floor(k / 100), r = k % 100, a = []; if (h) a.push((h === 1 ? 'a' : ONES[h]) + ' hundred'); if (r) a.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : '')); return a.join(' and '); };
  if (n >= 1100 && n < 2000 && n % 100 === 0) return ONES[n / 100] + ' hundred';
  const th = Math.floor(n / 1000), r = n % 1000;
  return (th ? under(th).replace(/^a hundred/, 'one hundred') + ' thousand' : '') + (th && r ? (r < 100 ? ' and ' : ' ') : '') + (r ? (th ? under(r).replace(/^a hundred/, 'one hundred') : under(r)) : ''); }
const pounds = n => numWords(n) + ' pounds';
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);
const bub = () => S.bub || {shares:0};
function bubbleClock(){ if (!S.bub && S.t >= 52 && S.t <= 54) { const r = Math.random(); S.bub = {shares:0, fate:r < 0.2 ? 'made' : r < 0.65 ? 'glut' : 'gone'}; later('bubbleTip', 0); }
  const b = S.bub; if (!b) return;
  if (!b.done && S.t >= 61) { b.done = true;
    if (b.shares > 0) later('bubbleEnd', 0);
    else if (b.fate === 'made') S.notes.push('The Brazil Association has paid its proprietors two hundred and fifty pounds a share. Hartopp held twenty.');
    else if (b.fate === 'glut') S.notes.push('Brickwood’s bank has stopped in London, and five Manchester houses after it; and Brazils, for which Hartopp gave seventy, are at twenty.');
    else S.notes.push('The Brazil Association has stopped, and its secretary is at Calais; the proprietors are called on for seventy pounds a share, and Hartopp is upon the register for twenty.'); }
  if (b.kept && S.t >= 72) { const p = 35 * b.kept; S.money += p; b.kept = 0; S.notes.push(`The Brazil Association is wound up, the proprietors being paid thirty-five pounds a share; and ${pounds(p)} is passed to your account at Tidmarsh’s.`); } }

ev({ id:'bubbleTip', follow:true, cond:() => !!S.bub && !S.bub.tipped, title:'The Brazil Association',
  text:() => `A printed paper comes by the London mail under a frank, being four pages, with a map of South America upon the fourth.

“THE BRAZIL ASSOCIATION, for supplying the Dominions of His Royal Highness the PRINCE REGENT of PORTUGAL with British Manufactures. Capital £200,000, in Shares of £50 each. The Court of Lisbon being now happily removed to RIO DE JANEIRO, and the Ports of that vast Continent opened to our Flag, the Directors have chartered three Ships. A Dividend of Twenty per Cent. is confidently expected upon the first Returns. Early Application is recommended to Mr Quill, Secretary, at the Jerusalem Coffee-house, Cornhill.”

Hartopp, having had one too, brings it over folded in his hat.

“I have been to Marlborough, sir. I know a cold collation when I read one.”

Henrietta has read the list of Directors, in which there is a baronet, and two Members.`,
  choices:[
    {t:'Take ten shares.', note:'£500', go:() => { const b = S.bub; b.tipped = true; b.shares = 10; b.paid = 500; S.money -= 500; later('bubbleRise', 3);
      return `You write to Mr Quill for ten shares, and enclose a draft upon Tidmarsh’s for five hundred pounds.

The scrip comes back in a week, engraved with a ship under full sail, and a native holding a cornucopia; and Mr Quill begs to add that the list closed on Friday, three times over.`; }},
    {t:'Take thirty.', note:'£1,500', if:() => S.money >= 1500, go:() => { const b = S.bub; b.tipped = true; b.shares = 30; b.paid = 1500; S.money -= 1500; later('bubbleRise', 3); reg('henrietta', 1);
      return `You write to Mr Quill for thirty shares, and enclose a draft upon Tidmarsh’s for fifteen hundred pounds; and Mr Tidmarsh pays it, but sends a note with the pass-book, asking whether the figure is right.

The scrip comes in a week, in thirty sheets, each having a ship under full sail, and a native holding a cornucopia.`; }},
    {t:'Put it behind the clock.', go:() => { S.bub.tipped = true; later('bubbleRise', 3);
      return `You put it behind the clock upon the chimney-piece.

On market day Mr Tidmarsh says that nine of his customers have drawn upon him for Cornhill in a week, and that one of them is the rector of Kintbury.`; }}
  ]});

ev({ id:'bubbleRise', follow:true, cond:() => !!S.bub && !S.bub.rose && !S.bub.done, title:'Brazils at Ninety',
  text:() => { const n = bub().shares;
    return `The Mercury prints the price of shares below the price of corn, and this Saturday it reads: “Brazil Association, £50 paid, 90.”

${n ? `Your ${numWords(n)} shares, having cost ${pounds(S.bub.paid)} in the spring, would fetch ${pounds(90 * n)} to-day.` : `The ten shares you did not take would fetch nine hundred pounds to-day.`}

Mr Quill has written to the proprietors, that the Three Brothers has cleared from Bristol for Rio with hardware, Manchester cottons, and four hundred pair of skates; and that a second issue is to be made at the market price.

Hartopp bought twenty at seventy, and told nobody until they were at eighty.`; },
  choices:[
    {t:'Sell them all.', note:() => '+' + fmt(90 * bub().shares), if:() => bub().shares > 0, go:() => { const b = S.bub, n = b.shares, p = 90 * n; b.rose = true; b.shares = 0; S.money += p; fl('bubbleOut');
      return `Tidmarsh’s London agent sells the ${numWords(n)} at ninety. ${cap1(pounds(p))} is passed to your account, less his eighth per cent.

Hartopp asks you at the Bench whether you are unwell.`; }},
    {t:'Sell half.', note:() => '+' + fmt(45 * bub().shares), if:() => bub().shares > 0, go:() => { const b = S.bub, n = b.shares / 2, p = 90 * n; b.rose = true; b.shares = n; S.money += p; later('bubbleCall', 3);
      return `${cap1(numWords(n))} are sold at ninety, and ${pounds(p)} goes to your account; the rest of the scrip stays in the deed box.`; }},
    {t:'Hold.', if:() => bub().shares > 0, go:() => { S.bub.rose = true; later('bubbleCall', 3);
      return `The scrip stays in the deed box; and on Saturdays you turn to the share list before the corn.`; }},
    {t:() => bub().shares ? 'Take as many again at ninety.' : 'Buy ten at ninety.', note:() => fmt(90 * (bub().shares || 10)), if:() => S.money >= 90 * (bub().shares || 10), go:() => { const b = S.bub, n = b.shares || 10, had = b.shares; b.rose = true; b.shares += n; b.paid = (b.paid || 0) + 90 * n; S.money -= 90 * n; later('bubbleCall', 3);
      return `Mr Quill allots you ${numWords(n)} of the second issue at ninety, and you send ${pounds(90 * n)}.

The new scrip has the same ship; but the native has been given a second cornucopia.${had ? '' : ' Hartopp says he is glad to see you come to your senses.'}`; }},
    {t:'Leave it alone.', if:() => !bub().shares, go:() => { S.bub.rose = true;
      return `You leave it alone; and Henrietta, reading the share list aloud at breakfast on Saturdays, goes down to Brazils, and stops there.`; }}
  ]});

ev({ id:'bubbleCall', follow:true, cond:() => !!S.bub && S.bub.shares > 0 && !S.bub.called && !S.bub.done, title:'A Call of Ten Pounds',
  text:() => { const b = S.bub, bad = b.fate === 'gone', price = bad ? 75 : 95;
    return `A letter from Cornhill. ${bad ? 'It is not franked, and the postboy wants eightpence for it.' : 'It is franked by one of the Members.'}

“Sir, I am directed to acquaint you that the Court of Directors have this Day made a Call of Ten Pounds per Share, payable on or before the 1st proximo, the Three Brothers being detained at Rio for want of a Return Cargo. ${bad ? 'The Dividend declared at Midsummer will be satisfied in new Shares.' : 'A Dividend Warrant for Three Pounds per Share is enclosed.'} I have the Honour to be, &c., J. QUILL, Sec.”

Brazils are at ${numWords(price)} in Saturday’s paper, that were at a hundred and ten in July.

${steward()} has worked the call upon your ${numWords(b.shares)} shares, and it comes to ${pounds(10 * b.shares)}.`; },
  choices:[
    {t:'Pay the call.', note:() => fmt(10 * bub().shares), go:() => { const b = S.bub; b.called = true; S.money -= 10 * b.shares; b.paid += 10 * b.shares; if (b.fate !== 'gone') S.money += 3 * b.shares;
      return `You send the draft, and a receipt comes back by return, signed by a clerk, Mr Quill being at Bristol upon the Association’s business.`; }},
    {t:'Sell at the price in the paper.', note:() => 'About ' + fmt((bub().fate === 'gone' ? 73 : 94) * bub().shares), go:() => { const b = S.bub, n = b.shares, at = b.fate === 'gone' ? 73 : 94, p = at * n; b.called = true; b.shares = 0; S.money += p + (b.fate !== 'gone' ? 3 * n : 0); fl('bubbleOut');
      return `The agent sells at ${numWords(at)}, and writes that buyers were shy of so many together, and that the call goes with the shares. ${cap1(pounds(p))} is passed to your account.`; }},
    {t:'Send nothing, and let the shares be forfeit.', go:() => { const b = S.bub; b.called = true; b.shares = 0; add({standing:-2});
      return `You do not answer; and in November the Courier prints a list of proprietors in default, in which your name stands between a hop factor and a clergyman of Devizes.

The shares are declared forfeit to the Association.`; }}
  ]});

ev({ id:'bubbleEnd', follow:true, cond:() => !!S.bub && S.bub.shares > 0 && !S.bub.ended,
  get title(){ const f = bub().fate; return f === 'made' ? 'The Three Brothers' : f === 'glut' ? 'Brazils at Twenty' : 'Mr Quill Is Not at Cornhill'; },
  text:() => { const b = S.bub, n = b.shares;
    if (b.fate === 'made') return `Hartopp rides into the yard without his hat.

The Three Brothers is in King Road, below Bristol, with hides, tallow, eleven hundred bags of cotton, and Spanish dollars in kegs under the captain’s cot; having sold her whole outward cargo at Rio in a fortnight, to the Court.

The Directors have declared a return of two hundred and fifty pounds a share, and mean to wind up while the price holds.

You have ${numWords(n)} shares. ${steward()} works the sum twice, and it is ${pounds(250 * n)}.`;
    if (b.fate === 'glut') return `Brickwood’s bank has stopped in London, and five Manchester houses in the South American trade have stopped after it, so that every share upon the list has fallen.

The Three Brothers came home in May with half a cargo of hides; and her captain says that the warehouses at Rio are full of English goods to the rafters, and that there is nobody left there to buy them.

Brazils are at twenty. You have ${numWords(n)} shares, and they have cost you ${pounds(b.paid)}.

Mr Quill writes that the Association will trade on in a smaller way.`;
    return `The office at the Jerusalem Coffee-house is shut, Mr Quill having gone down to Dover upon the 9th, since when he has not written.

The Three Brothers sold her cargo at Rio for less than the freight, and the Association’s bills having come back unpaid from three houses, an attorney in Bucklersbury writes on behalf of the holders.

“The Association was never incorporated by Charter or Act. Every Proprietor upon the Register is therefore answerable for its Engagements as a Partner, to the whole Extent of his Property.”

He names the sum, and it is seventy pounds a share. You are upon the register for ${numWords(n)}.`; },
  choices:[
    {t:'Take the money.', note:() => '+' + fmt(250 * bub().shares), if:() => bub().fate === 'made', go:() => { const b = S.bub, p = 250 * b.shares; b.ended = true; b.shares = 0; fl('bubbleMade'); add({money:p, standing:3, family:4}); reg('henrietta', 1); reg('hartopp', 1);
      return `The draft is upon Smith, Payne and Smiths, and Mr Tidmarsh holds it up to the window before he enters it.

Henrietta asks what a house in town costs; and Hartopp has a new prospectus in his hat, for lighting Reading with the smoke of coal.`; }},
    {t:'Take it, and pay down the mortgage.', note:() => '+' + fmt(250 * bub().shares) + ', off the debt', if:() => bub().fate === 'made' && S.mortgage > 0, go:() => { const b = S.bub, p = 250 * b.shares, off = Math.min(S.mortgage, Math.floor(p / 100) * 100); b.ended = true; b.shares = 0; fl('bubbleMade'); S.mortgage -= off; add({money:p - off, standing:3, family:2}); reg('hartopp', 1);
      return `The draft is upon Smith, Payne and Smiths, and Mr Tidmarsh, writing off ${pounds(off)} of the mortgage with his own pen, blots it.

“I had not thought to see that money again, sir,” he says. “From Brazil least of all.”`; }},
    {t:'Sell at twenty.', note:() => '+' + fmt(20 * bub().shares), if:() => bub().fate === 'glut', go:() => { const b = S.bub, p = 20 * b.shares; b.ended = true; b.shares = 0; S.money += p;
      return `The agent sells at twenty, and ${pounds(p)} is passed to your account.

The scrip goes to the buyer, though Kitty had asked for one sheet, for the ship.`; }},
    {t:'Keep them.', if:() => bub().fate === 'glut', go:() => { const b = S.bub; b.ended = true; b.kept = b.shares; b.shares = 0;
      return `The scrip stays in the deed box, under the canal share; and in the autumn the Mercury drops Brazils from its list, to make room for the price of oats.`; }},
    {t:'Pay it.', note:() => fmt(70 * bub().shares), if:() => bub().fate === 'gone', go:() => { const b = S.bub, p = 70 * b.shares; b.ended = true; b.shares = 0; fl('bubbleBurnt'); add({money:-p, standing:-1});
      return `You pay ${pounds(p)} to the attorney in Bucklersbury, who sends a release upon stamped paper.

Hartopp has paid too, and does not bring anything over in his hat that winter.`; }},
    {t:'Offer ten shillings in the pound, for a quick end.', note:() => fmt(35 * bub().shares) + ', if they take it', if:() => bub().fate === 'gone', go:() => { const b = S.bub, n = b.shares, ok = chance(0.5); b.ended = true; b.shares = 0; fl('bubbleBurnt'); add({money:-(ok ? 35 : 70) * n - 60, standing:-3});
      return ok ? `Your attorney at Newbury offers ten shillings in the pound, money down; and the holders, meeting at the London Tavern, take it. It costs you ${pounds(35 * n)}, and sixty for the attorney.

The Courier prints the composition, with the names.` : `Your attorney at Newbury offers ten shillings in the pound; but the holders, meeting at the London Tavern, and having seen a map of Hatherley, refuse it.

You pay ${pounds(70 * n)}, and sixty for the attorney.`; }}
  ]});

/* ---------- the rungs of credit, for the book ---------- */
const timberLeft = () => S.timber === undefined ? 3 : S.timber;
const timberNow = () => Math.round(75 * (1 + 0.035 * (S.year - FIRST_YEAR))) * 10;
function creditList(){ const open = S.phase !== 'end' && !S.dead, shut = open ? '' : 'The books are closed.', n = S.annuities || 0, g = borrowGets();
  return [
    {id:'mortgage', name:'Borrow £500 on the land', line:'A lender advances money on the security of the estate. The deeds lie with his attorney until he is paid.', gets:g, verb:'Borrow', can:open && canBorrow(), why:shut || borrowWhy(), note:borrowNote(),
      effects:'Five per cent a year until it is paid off. The estate will carry ' + fmt(mortCap()) + ' in all.' + (g < 500 ? ' This year £50 of every £500 goes to the attorney who finds the lender.' : ''),
      fx:['+' + fmt(g), '−£25 a year in interest']},
    {id:'repay', name:'Pay off £500 of the mortgage', line:'A draft on Tidmarsh’s bank for five hundred pounds goes to the lender. His attorney writes the payment on the deed.', gets:-500, verb:'Pay off', can:open && S.money >= 500 && S.mortgage >= 500, why:shut || (S.mortgage < 500 ? 'Nothing is owing.' : S.money < 500 ? 'There is not £500 in hand.' : ''), note:'',
      effects:'Saves £25 a year in interest.', fx:['−£500', '+£25 a year saved']},
    {id:'annuity', name:'Sell an annuity on your life', line:'A deed binding you to pay a hundred a year for life. The office has a surgeon examine you before it signs.', gets:700, verb:'Sell one', can:open && n < 4, why:shut || (n >= 4 ? 'Nobody will buy a fifth on one life.' : ''), note:n ? cap1(numWords(n)) + ' granted already' : '',
      effects:'A London office pays £700 down. You pay £100 a year for as long as you live. It is outside the usury law and needs no land.', fx:['+£700', '−£100 a year for life']},
    {id:'redeem', name:'Buy back an annuity', line:'The office names its price for giving up the deed. The parchment comes back with the seals cut off.', gets:-800, verb:'Buy it back', can:open && n > 0 && S.money >= 800, why:shut || (!n ? 'None is granted.' : S.money < 800 ? 'There is not £800 in hand.' : ''), note:'',
      effects:'The office takes £800 to cancel the deed.', fx:['−£800', '+£100 a year saved']},
    {id:'timber', name:'Fell the oaks in Hanger Wood', line:'Hanger Wood is oak of your great-grandfather’s planting. A merchant buys the trees standing and fells them with his own men.', gets:timberNow(), verb:'Send for the timber merchant', can:open && timberLeft() > 0, why:shut || (timberLeft() ? '' : 'There is nothing left standing worth the felling.'), note:timberLeft() + ' falls left',
      effects:'Two hundred oaks, paid for standing. Standing in the county falls. There are three falls in the wood and no more in your lifetime.', fx:['+' + fmt(timberNow()), '− Standing']}
  ]; }
function takeCredit(id){ const x = creditList().find(r => r.id === id); if (!x || !x.can) return false; let did = x.name;
  if (id === 'mortgage') { S.mortgage += 500; S.money += x.gets; }
  else if (id === 'repay') { S.mortgage -= 500; S.money -= 500; }
  else if (id === 'annuity') { S.annuities = (S.annuities || 0) + 1; S.money += 700; add({standing:-1}); }
  else if (id === 'redeem') { S.annuities--; S.money -= 800; }
  else if (id === 'timber') { S.timber = timberLeft() - 1; add({money:x.gets, standing:-3}); }
  S.journal.unshift({when:stamp(), title:'Credit', did}); save(); render(); return true; }

/* ---------- effects in figures, for the book to print ---------- */
const fxOf = x => typeof x === 'function' ? x() : x;
const MINUS = '−';
/* What a farm would let for if something about it were changed, less what it lets for now. */
function rentGain(id, change){ const f = farm(id); if (!f) return 0; const now = lettingValue(f, S.year), was = {cond:f.cond, mult:f.mult}; change(f); const then = lettingValue(f, S.year); f.cond = was.cond; f.mult = was.mult; if (was.mult === undefined) delete f.mult; return then - now; }
const whenOf = id => { const f = farm(id); return f && !f.void && f.lease.type !== 'will' ? ', once the lease is out in ' + f.lease.ends : ''; };
const rentLine = (id, gain) => gain > 0 ? ['+' + fmt(gain) + ' a year in rent' + whenOf(id)] : gain < 0 ? [MINUS + fmt(-gain) + ' a year in rent'] : [];
const share = (id, part) => { const f = farm(id); return f ? five(lettingValue(f, S.year) * part) : 0; };
const allRents = part => five(S.farms.reduce((a, f) => a + lettingValue(f, S.year), 0) * part);
Object.assign(PROJECTS.enclosure, {fx:() => rentLine('church', share('church', 0.3)).concat(['+3 Standing', MINUS + (F('allotments') ? '6' : '16') + ' Goodwill', '+ The common, to fence into a farm'])});
Object.assign(PROJECTS.drain, {fx:() => rentLine('kennet', rentGain('kennet', f => { f.cond = Math.max(f.cond, 2); }))});
Object.assign(PROJECTS.fourcourse, {fx:() => ['+' + fmt(Math.round(140 * 0.06 * PRICES[S.year] / 20 / 5) * 5) + ' a year in home farm wheat', '+' + fmt(allRents(0.025)) + ' a year in rent, across the farms']});
Object.assign(PROJECTS.mill, {fx:() => rentLine('kennet', share('kennet', 0.06)).concat(['+3 Goodwill'])});
Object.assign(PROJECTS.cottages, {fx:['+9 Goodwill']});
Object.assign(PROJECTS.school, {fx:['+6 Goodwill', MINUS + '1 Dr Gall']});
Object.assign(PROJECTS.road, {fx:['+3 Goodwill', '+3 Standing']});
Object.assign(PROJECTS.front, {fx:['+9 Standing', '+4 Household', '+2 Henrietta']});
Object.assign(PROJECTS.pinery, {fx:['+4 Standing', '+2 Household']});
Object.assign(PROJECTS.oaks, {fx:['+2 Standing']});
Object.assign(PROJECTS.icehouse, {fx:['+5 Household', '+1 Henrietta']});
Object.assign(PROJECTS.meadows, {fx:() => rentLine('kennet', share('kennet', 0.08))});
Object.assign(PROJECTS.commonpiece, {fx:() => ['+' + fmt(five(0.95 * lettingValue(landFor('commonpiece'), S.year))) + ' a year in rent', '+ A farm of 300 acres']});
Object.assign(PROJECTS.barns, {fx:() => rentLine('church', rentGain('church', f => { f.cond = Math.min(4, f.cond + 1); }))});
Object.assign(PROJECTS.chalk, {fx:() => rentLine('longbarrow', rentGain('longbarrow', f => { f.cond = Math.min(4, f.cond + 1); }))});
Object.assign(VENTURES.plough, {fx:() => ['+' + fmt(share('longbarrow', 0.25)) + ' a year in rent, for seven years' + whenOf('longbarrow'), MINUS + fmt(share('longbarrow', 0.3)) + ' a year in rent after that', MINUS + '£300 to lay it down again']});
Object.assign(VENTURES.peat, {fx:() => ['+£170 a year, for nine years'].concat(F('meadows') ? [] : [MINUS + fmt(-rentGain('kennet', f => { f.cond = Math.max(0, f.cond - 1); })) + ' a year in rent when it is dug out'])});
Object.assign(VENTURES.thresher, {fx:() => ['+' + fmt(Math.round(45 * wageIdx(S.year))) + ' a year in wages saved', MINUS + '4 Goodwill', MINUS + '£300 if the barn is fired']});
Object.assign(VENTURES.bank, {fx:['+£150 a year', '+1 Standing a year', MINUS + '£500 in a run', MINUS + '£2,500 to £5,000 if the bank breaks']});
Object.assign(VENTURES.spa, {fx:['+£300 a year rising to £750, if the waters take', '+4 Standing, if they take', '+£90 a year if they half take', MINUS + '£60 a year if they fail']});
Object.assign(VENTURES.funds, {fx:() => ['+' + fmt(Math.round(500 / consolPrice(S.year) * 3)) + ' a year in dividends', '+ or ' + MINUS + ' the price of the day when sold. It is ' + Math.round(consolPrice(S.year)) + ' now']});
const SOCIETY_FX = {
  plate:[MINUS + '4 Household if sold', MINUS + '2 Henrietta if sold'], hunters:[MINUS + '2 Household if sold'], library:[MINUS + '3 Household if sold', MINUS + '1 Kitty if sold'],
  chariot:['+2 Household', '+1 Henrietta'], portraits:['+3 Household', '+1 Henrietta'], harriers:[MINUS + '2 Goodwill'], townhouse:['+4 Household', '+2 Henrietta'], operabox:['+1 Henrietta'],
  presentation:['+3 Household', '+1 Kitty', '+1 Henrietta'], deputy:['+1 Lord Cullerne'], knight:['+5 Household', '+2 Henrietta'], baronet:['+8 Household', '+3 Henrietta', '+1 Edmund'] };
function societyFx(id){ const d = SOCIETY[id], k = socKeep(id), x = SOCIETY_FX[id] || [];
  if (d.heir) return (d.sell ? ['+' + fmt(d.sell) + ' if sold'] : []).concat([MINUS + d.mark + ' Standing if sold'], x, k ? [MINUS + fmt(k) + ' a year to keep'] : []);
  return ['+' + d.mark + ' Standing'].concat(x, k ? [MINUS + fmt(k) + ' a year to keep'] : [], d.sell ? ['+' + fmt(d.sell) + ' if sold'] : []); }

/* A work or venture that belongs to one farm stays on its page when the farm is sold, greyed, with the reason. */
const soldWhy = d => d && d.of && !farm(d.of) ? landFor(d.of).name + ' is sold.' : '';
for (const [id, of] of [['drain', 'kennet'], ['mill', 'kennet'], ['meadows', 'kennet'], ['barns', 'church'], ['chalk', 'longbarrow']]) PROJECTS[id].of = of;
for (const [id, of] of [['plough', 'longbarrow'], ['peat', 'kennet'], ['brickkiln', 'kennet']]) VENTURES[id].of = of;

/* ---------- standing, goodwill and peace ----------
   Each of the three has a mark it settles at, set by how the squire lives: his establishment and honours, his rents and what he has built for the parish,
   his wife's regard and the state of the purse. What he does in a season lifts a figure above its mark for a while, and it sinks back, faster the higher it stands.
   One undertaking a season will not hold all three up. To keep a figure high he must move its mark, and every mark is moved with money or at the cost of another.
   Below a line each of the three bites: the parish breaks and burns, the county shuts its doors and the bank calls for its money, and Henrietta goes to Bath. */
function marks(){ const i = estIdx(), why = {standing:[], goodwill:[], family:[]}; const put = (k, n, t) => { if (n) why[k].push((n > 0 ? '+' : MINUS) + Math.abs(n) + ' ' + t); return n; };
  let st = EST[i].standing; why.standing.push(EST[i].standing + ' ' + cap1(EST[i].name));
  st += put('standing', societyMark(), 'Society'); st += put('standing', -6 * (S.settledSold || 0), 'Settled land sold');
  st += put('standing', live('turnpike') ? 2 : 0, 'A trustee of the turnpike'); st += put('standing', live('racecourse') ? 3 : 0, 'Hatherley races'); st += put('standing', live('telegraph') ? 1 : 0, 'The Admiralty on the Down'); st += put('standing', F('hallPew') ? 1 : 0, 'The Hall pew'); st += put('standing', F('churchRoof') ? 1 : 0, 'The church roof');
  st += put('standing', F('wages') ? -2 : 0, 'The farmers dislike your wages'); st += put('standing', idle('county', 2) ? -4 : 0, 'Not seen in the county this half-year'); st += put('standing', S.money < 0 ? -4 : 0, 'Living on credit'); st += put('standing', F('henriettaAway') ? -5 : 0, 'Henrietta at Bath');
  let g = 44; why.goodwill.push('44 The parish as you found it');
  const rack = S.farms.filter(f => f.level === 'rack').length, easy = S.farms.filter(f => f.level === 'easy').length;
  g += put('goodwill', -4 * Math.min(4, rack), 'Rack rents'); g += put('goodwill', 2 * Math.min(4, easy), 'Easy rents'); g += put('goodwill', idle('ride', 2) ? -5 : 0, 'The tenants have not seen you this half-year');
  g += put('goodwill', F('cottages') ? 4 : 0, 'The cottages'); g += put('goodwill', F('school') ? 3 : 0, 'The school'); g += put('goodwill', F('wages') ? 5 : 0, 'Wages by the loaf'); g += put('goodwill', F('soup') ? 2 : 0, 'The soup kitchen');
  g += put('goodwill', F('enclosed') ? (F('allotments') ? -3 : -9) : 0, 'The common inclosed'); g += put('goodwill', vent('thresher') && !vent('thresher').ended ? -5 : 0, 'The threshing machine');
  g += put('goodwill', live('turnpike') ? -2 : 0, 'The gate on the London road'); g += put('goodwill', live('racecourse') ? 1 : 0, 'Hatherley races'); g += put('goodwill', F('bells') ? 2 : 0, 'The bells'); g += put('goodwill', F('churchRoof') ? 1 : 0, 'The church roof'); g += put('goodwill', F('hallPew') ? -1 : 0, 'The Hall pew'); g += put('goodwill', live('tithes') ? -3 : 0, 'Your wagon takes the tenth'); g += put('goodwill', -4 * Math.min(2, S.evicted || 0), 'Tenants turned out');
  g += put('goodwill', held('harriers') ? -2 : 0, 'Harriers over the wheat'); g += put('goodwill', i === 3 ? -4 : i === 0 ? 2 : 0, i === 3 ? 'A splendid house in a hungry parish' : 'A plain table');
  g += put('goodwill', PRICES[S.year] >= 95 && !F('soup') && !F('wages') && house('labour') !== 'high' ? -8 : 0, 'Bread at famine price');
  let fm = 45; why.family.push('45 The house as you found it'); fm += put('family', idle('home', 1) ? -6 : 0, 'You have not kept at home this quarter');
  fm += put('family', 3 * S.chars.henrietta.r, 'Henrietta’s regard'); fm += put('family', F('edmundDead') ? 0 : S.chars.edmund.r, 'Edmund’s regard');
  fm += put('family', [-8, 0, 4, 7][i], cap1(EST[i].name)); fm += put('family', F('newFront') ? 3 : 0, 'The new front'); fm += put('family', F('icehouse') ? 2 : 0, 'The ice-house');
  fm += put('family', S.money < 0 ? -6 : 0, 'Duns at the door'); fm += put('family', T('gout') && !F('goutEased') ? -4 : 0, 'The gout');
  for (const dial in HOUSE) { const h = houseOf(dial), nm = HOUSE[dial].name + ', ' + h.label.toLowerCase(); st += put('standing', h.standing || 0, nm); g += put('goodwill', h.goodwill || 0, nm); fm += put('family', h.family || 0, nm); }
  if (typeof castleMark === 'function') for (const [k, n, t] of castleMark()) { const v = put(k, n, t); if (k === 'standing') st += v; else if (k === 'goodwill') g += v; else fm += v; }
  // what the squire was born or married to stays with him: each choice at the start moves its mark for good by what its card says
  const born = {standing:st, goodwill:g, family:fm}; for (const k in TRAIT_MARK) for (const id in TRAIT_MARK[k]) if (T(id) && !(id === 'court' && (F('courtLost') || F('courtSold'))) && !(id === 'captain' && k === 'family' && F('crewGone'))) born[k] += put(k, TRAIT_MARK[k][id], traitById(id).name);
  return {standing:clamp(born.standing, 5, 95), goodwill:clamp(born.goodwill, 5, 95), family:clamp(born.family, 5, 95), why}; }
const TRAIT_MARK = {
  standing:{soldier:5, captain:4, court:12, connexions:15, enemy:-3, whig:-10, dean:6, hunt:7, trade:-12, oxford:-4, lawsuit:-4},
  goodwill:{beloved:15, stranger:-12, hunt:-3},
  family:{captain:-5, lovematch:12, portion:-12, mother:-10, bottle:-6} };
const SINK = 7, HOLD = 3;   // regard well earned holds: nothing is lost within three of the mark, and beyond that a point a season for every seven; above eighty it is harder kept
/* The three duties: the tenancies, the county, the family. Each goes stale if the squire lets it lie. */
const idle = (k, seasons) => S.t - ((S.duty && S.duty[k]) || 0) >= seasons;
function duty(k){ S.duty = S.duty || {}; S.duty[k] = S.t; }
function regardQuarter(line){ const m = marks(), q = S.season, d = {};
  for (const k of ['standing', 'goodwill', 'family']) { const over = S[k] - m[k]; d[k] = over > HOLD ? -Math.ceil((over - HOLD) / SINK) - (S[k] > 80 ? 1 : 0) : over <= -20 ? 2 : over <= -5 ? 1 : 0; }
  add(d);
  // the parish
  if (S.goodwill < 38 && !F('sullen')) { fl('sullen'); S.notes.push(`No hat is touched in Hatherley street this morning; and the eleven men who stand at the door of the Bell, as you ride by, look at the road.`); }
  else if (S.goodwill >= 46 && F('sullen')) fl('sullen', false);
  if (F('sullen')) { if (S.goodwill < 28 && S.seen.rickFire === undefined && !S.queue.some(x => x.id === 'rickFire')) later('rickFire', 1);
    if (q === 3 || (S.goodwill < 22 && q === 1)) { const [what, cost] = pick([['Gates lifted and hedges broken in the night', 35], ['A hayrick fired at the home farm', 95], ['Harness cut in the cart-house', 25], ['Two ewes found with their throats cut', 6], ['Young oaks barked in Hanger Wood', 40]]); line(what, -cost); } }
  // the county
  if (S.standing < 33 && !F('cut')) { fl('cut'); S.notes.push(`The Tamworths give a ball at Wyvern, for which no card comes to the Hall.`); }
  else if (S.standing >= 40 && F('cut')) fl('cut', false);
  if (F('cut') && S.standing < 24 && q === 1 && S.mortgage >= 500) { line('Mr Tidmarsh calls in £500 of his principal', -500); S.mortgage -= 500; S.notes.push(`Mr Tidmarsh writes for five hundred pounds of his principal, and gives six weeks.`); }
  if (S.standing >= 70 && q === 1) line('Subscriptions: the Infirmary, the hunt, the Assembly Rooms', -Math.round((S.standing - 52) * 3 / 5) * 5);
  // the house
  if (S.family < 35 && !F('henriettaAway')) { fl('henriettaAway'); reg('henrietta', -1, 'Went to Bath sooner than stay in the house'); S.notes.push(`Henrietta has her trunks brought down, having taken lodgings in Gay Street, Bath; for how long, she does not say.`); }
  else if (S.family >= 46 && F('henriettaAway')) { fl('henriettaAway', false); S.notes.push(`A chaise from Bath sets Henrietta down at the door. Mrs Bunce has had the fire lit in the blue room since Tuesday.`); }
  if (F('henriettaAway')) line('Lodgings in Gay Street, Bath, and a chair', -55); }

/* ---------- the household page ----------
   The establishment, three rates of pay, and the things that came with the house. Each rate is low, standard or high.
   A rate moves a mark for as long as it stands, costs or saves money every quarter, and stings or pleases once on the day it is changed. */
const HOUSE = {
  servants:{name:'Servants’ wages', base:250, what:'The indoor people: butler, cook, footmen, maids',
    low:{label:'Low', name:'A fifth under the county rate', cost:-50, family:-5, once:{family:-3}},
    standard:{label:'Standard', name:'The county rate: a cook at fourteen guineas, a footman at twenty-four'},
    high:{label:'High', name:'A quarter over, with tea and beer money', cost:65, family:4, once:{family:2}}},
  labour:{name:'Labourers’ wages', what:'Nine men on the home farm',
    low:{label:'Low', name:'Two shillings under the going rate', shillings:-2, goodwill:-6, wheat:-0.04, once:{goodwill:-3}},
    standard:{label:'Standard', name:'The going rate', shillings:0, wheat:0},
    high:{label:'High', name:'Two shillings over the going rate', shillings:2, goodwill:5, standing:-2, wheat:0.03, once:{goodwill:2}}},
  stables:{name:'The stables', base:300, what:'Coach horses, hacks, grooms and corn',
    low:{label:'Low', name:'One groom, and hay', cost:-50, standing:-3, once:{standing:-2}},
    standard:{label:'Standard', name:'As your uncle kept them'},
    high:{label:'High', name:'A second groom, oats and new harness', cost:70, standing:4, once:{standing:2}}},
  schoolroom:{name:'The schoolroom', base:32, what:'Kitty’s education, while she is at home', if:() => kittyHome(), gone:'Kitty has left the schoolroom.',
    low:{label:'Low', name:'No governess. Henrietta hears her lessons', cost:-32, family:-4, once:{family:-2}, kitty:-1},
    standard:{label:'Standard', name:'A governess at thirty guineas'},
    high:{label:'High', name:'A governess at sixty, and masters from Reading for music and drawing', cost:75, family:3, standing:2, once:{family:2}, kitty:1}} };
const houseOn = dial => !HOUSE[dial].if || HOUSE[dial].if();
const house = dial => (houseOn(dial) && S.house && S.house[dial]) || 'standard';
const houseOf = dial => Object.assign({cost:0, shillings:0, wheat:0}, HOUSE[dial][house(dial)]);
const houseCost = dial => Math.round((houseOf(dial).cost || 0) * priceRise(S.year) / 20) * 20;   // a year, at this year's prices
/* What a rate comes to in a year, all told. The Hall's line in the account already holds the standard rates; these figures show its parts. */
const houseBase = dial => houseOn(dial) && HOUSE[dial].base ? Math.round(HOUSE[dial].base * priceRise(S.year) / 5) * 5 : 0;
function houseYear(dial, lvl){ const h = HOUSE[dial][lvl];
  if (dial === 'labour') return Math.round(9 * (weekWage(S.year) + (h.shillings || 0)) * 52 / 20 / 5) * 5;
  return houseBase(dial) + Math.round((h.cost || 0) * priceRise(S.year) / 20) * 20; }
const signed = (n, t) => (n > 0 ? '+' : MINUS) + Math.abs(n) + ' ' + t;
const METER = {standing:'Standing', goodwill:'Goodwill of the parish', family:'Peace of the household'};
function houseFx(dial, lvl){ const h = HOUSE[dial][lvl], out = [], y = S.year;
  if (h.cost) { const c = Math.round(h.cost * priceRise(y) / 20) * 20; out.push((c > 0 ? MINUS : '+') + fmt(Math.abs(c)) + ' a year'); }
  if (h.shillings) { const c = Math.round(9 * Math.abs(h.shillings) * 52 / 20 / 5) * 5; out.push((h.shillings > 0 ? MINUS : '+') + fmt(c) + ' a year, nine men at ' + (weekWage(y) + h.shillings) + 's. the week'); }
  for (const k in METER) if (h[k]) out.push(signed(h[k], METER[k])); if (h.kitty) out.push(signed(h.kitty, 'in Kitty’s regard'));
  if (h.wheat) out.push(signed(Math.round(h.wheat * 100), '% home farm wheat').replace(' %', '%'));
  return out.length ? out : ['No change']; }
function setHousehold(dial, lvl){ const row = householdList().wages.find(w => w.id === dial), o = row && row.levels.find(l => l.id === lvl); if (!o || !o.can) return false;
  const order = ['low', 'standard', 'high'], up = order.indexOf(lvl) > order.indexOf(house(dial)), h = HOUSE[dial];
  S.house = S.house || {}; S.houseT = S.houseT || {}; const was = house(dial); S.house[dial] = lvl; S.houseT[dial] = S.t;
  // the day's sting or pleasure: going down hurts by the lower rung's figure, going up pleases by the higher one's
  const once = up ? (h[lvl].once || h[was].once && Object.fromEntries(Object.entries(h[was].once).map(([k, v]) => [k, Math.ceil(-v / 2)]))) : (h[lvl].once || h[was].once && Object.fromEntries(Object.entries(h[was].once).map(([k, v]) => [k, -v])));
  if (once) add(once); if (h[lvl].kitty) reg('kitty', h[lvl].kitty, h[lvl].kitty > 0 ? 'You gave her masters for music and drawing' : 'You sent her governess away');
  S.journal.unshift({when:stamp(), title:'Household', did:h.name + ': ' + h[lvl].name.charAt(0).toLowerCase() + h[lvl].name.slice(1)}); save(); render(); return true; }
function setEstablishment(id){ const row = householdList().establishment.find(e => e.id === id); if (!row || !row.can) return false;
  const text = stepEst(EST.findIndex(e => e.id === id) - estIdx()); S.estT = S.t; S.notes.push(text);
  S.journal.unshift({when:stamp(), title:'Household', did:(row.verb === 'Set up' ? 'Set up ' : 'Reduced to ') + row.name}); save(); render(); return true; }
function householdList(){ const open = S.phase !== 'end' && !S.dead, i = estIdx(), y = S.year, shut = open ? '' : 'The books are closed.';
  const FAM = [-8, 0, 4, 7], GW = [2, 0, 0, -4];
  const establishment = EST.map((e, k) => { const d = k - i, dc = estCost(k, y) - estCost(i, y), fx = [];
    if (d) { fx.push((dc > 0 ? MINUS : '+') + fmt(Math.abs(dc)) + ' a year'); if (d > 0) fx.push(MINUS + fmt(EST_SETUP[k]) + ' to set up');
      fx.push(signed(e.standing - EST[i].standing, 'Standing')); if (FAM[k] - FAM[i]) fx.push(signed(FAM[k] - FAM[i], METER.family)); if (GW[k] - GW[i]) fx.push(signed(GW[k] - GW[i], METER.goodwill)); }
    const why = !d ? '' : shut || (Math.abs(d) > 1 ? 'One step at a time.' : S.estT === S.t ? 'The house has been turned over once this season.' : d > 0 && S.money < EST_SETUP[k] ? 'The purse will not stand ' + fmt(EST_SETUP[k]) + ' down.' : '');
    return {id:e.id, line:e.line, name:cap1(e.name), cost:estCost(k, y), now:!d, verb:d > 0 ? 'Set up' : d < 0 ? 'Reduce' : '', can:!!d && !why, why, fx:d ? fx : [MINUS + fmt(estCost(k, y)) + ' a year']}; });
  const wages = Object.keys(HOUSE).map(dial => ({id:dial, name:HOUSE[dial].name, what:HOUSE[dial].what, now:house(dial), off:!houseOn(dial),
    levels:['low', 'standard', 'high'].map(lvl => { const now = house(dial) === lvl, why = now ? '' : shut || (!houseOn(dial) ? HOUSE[dial].gone : '') || ((S.houseT || {})[dial] === S.t ? 'Changed once this season already.' : '');
      return {id:lvl, label:HOUSE[dial][lvl].label, name:HOUSE[dial][lvl].name, now, can:!now && !why, why, fx:houseFx(dial, lvl), yearly:houseYear(dial, lvl)}; })}));
  const parts = houseBase('servants') + houseBase('stables') + houseBase('schoolroom'); for (const e of establishment) e.table = e.cost - parts;
  const lots = societyList().filter(r => SOCIETY[r.id].house);
  return {establishment, wages, lots, cost:estCost(i, y) + houseCost('servants') + houseCost('stables') + houseCost('schoolroom'), total:estCost(i, y) + houseCost('servants') + houseCost('stables') + houseCost('schoolroom') + houseYear('labour', house('labour'))}; }
for (const id of ['plate', 'cellar', 'hunters', 'library']) SOCIETY[id].house = true;

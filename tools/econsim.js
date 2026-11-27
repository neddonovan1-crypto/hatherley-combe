#!/usr/bin/env node
/* A paper model of the proposed Hatherley economy (docs/economy/DESIGN.md).
   Stands apart from src/: it touches nothing the game loads. Run: node tools/econsim.js [lives] [--tables]
   Money in pounds, one step per year, 1795 to 1815. */
const Y0 = 1795, Y1 = 1815;
// Wheat, shillings the quarter. 1795 on is the game's own table; 1790-94 only feeds the trailing averages.
const WHEAT = {1790:55,1791:49,1792:43,1793:49,1794:52,1795:75,1796:78,1797:53,1798:51,1799:69,1800:113,1801:119,1802:69,1803:58,1804:62,1805:89,1806:79,1807:75,1808:81,1809:97,1810:106,1811:95,1812:126,1813:109,1814:74,1815:65};
const WEATHER = {1795:0.78,1796:1.0,1797:1.05,1798:1.1,1799:0.74,1800:0.7,1801:0.98,1802:1.05,1803:1.0,1804:0.95,1805:0.95,1806:1.0,1807:1.0,1808:0.95,1809:0.85,1810:0.9,1811:0.88,1812:0.8,1813:1.28,1814:1.05,1815:1.1};
// Yield on 3 per cent Consols, per cent (Bank of England series via FRED, LTCYUKA).
const CONSOL_YIELD = {1795:4.52,1796:4.88,1797:5.91,1798:5.93,1799:5.09,1800:4.70,1801:4.90,1802:4.23,1803:5.14,1804:5.25,1805:5.07,1806:4.89,1807:4.77,1808:4.52,1809:4.38,1810:4.41,1811:4.67,1812:5.01,1813:5.11,1814:4.52,1815:5.04};
const consolPrice = y => 300 / CONSOL_YIELD[y];            // price of 100 nominal
const moneyTight = y => CONSOL_YIELD[y] >= 5.0;              // the Funds pay more than the law lets a mortgage pay

const trail = (y, n) => { let s = 0; for (let i = 1; i <= n; i++) s += WHEAT[y - i]; return s / n; };
/* Two indices, both 1.0 for the rent a farm in fair order paid in 1795.
   market(y): what the farm fetches if let this Lady Day. Bidders reason from the last five years with an eye
   on last harvest, and rents never fell of their own accord while the war lasted.
   cap(y): what a tenant can find this year. The same long view, knocked about by this year's price and
   weather. His wages, rates and tithe follow the five-year average, so they lag him on the way down. */
const war = y => 0.02 * Math.min(y, 1813) - 0.02 * 1795 - 0.06 * Math.max(0, y - 1813);   // the general rise of everything, and its going
const struct = y => 0.55 + 0.45 * trail(y, 5) / 50 + war(y);
const MARKET = {}; for (let y = Y0; y <= Y1 + 1; y++){ if (!WHEAT[y]) WHEAT[y] = 76; if (!WEATHER[y]) WEATHER[y] = 0.75;
  const view = y > 1813 ? 0.6 * trail(y, 5) + 0.4 * WHEAT[y - 1] : trail(y, 5);
  const m = 0.55 + 0.45 * view / 50 + war(y); MARKET[y] = y === Y0 ? 1 : y <= 1813 ? Math.min(Math.max(m, MARKET[y - 1]), MARKET[y - 1] * 1.07) : m; }
const market = y => MARKET[y];
function cap(y){ const pe = 0.55 * WHEAT[y] + 0.45 * trail(y, 3), wf = 1 - (1 - WEATHER[y]) * 0.3;
  return struct(y) * Math.pow(pe / trail(y, 5), 1.7) * wf; }

const COND = [0.70, 0.85, 1.0, 1.15, 1.30];                  // ruinous, neglected, fair, good, high order
const LEVEL = {easy:0.88, fair:1.0, rack:1.13};

function estate(){ return [
  // base = the 1795 rent the farm would bear in fair order (cond 2). Three farms to begin; never more than five.
  {id:'longbarrow', name:'Long Barrow',   acres:600, base:590, cond:2, rent:540, lease:{type:'term', ends:1802}, K:700, common:false},
  {id:'kennet',     name:'Kennet Bottom', acres:500, base:560, cond:1, rent:470, lease:{type:'will'}, K:200, common:false},
  {id:'church',     name:'Church Farm',   acres:550, base:610, cond:2, rent:610, lease:{type:'will'}, K:500, common:true}
]; }
/* Farms that come to market. Bought land lies outside the settlement: it is the squire's own, to mortgage or sell. */
const FOR_SALE = {
  starveall:  {name:'Starveall',   acres:450, base:260, cond:1, years:[1798, 1803], yp:21},   // a neighbour sold up in a tight year: cheap, if you have the money
  coldharbour:{name:'Coldharbour', acres:400, base:420, cond:2, years:[1807, 1811], yp:28}    // the open market, at the going price
};
const priceOf = (id, y) => Math.round(FOR_SALE[id].base * COND[FOR_SALE[id].cond] * market(y) * FOR_SALE[id].yp / 10) * 10;
const SUSTAIN = 1.45;   // what rents will bear once the peace has settled, for valuing land at the reckoning

let seed = 1; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;

const WORKS = { // cost, years in hand
  drain:{cost:520, yrs:1}, fourcourse:{cost:260, yrs:1}, mill:{cost:420, yrs:1}, meadows:{cost:300, yrs:1},
  enclosure:{cost:2400, yrs:3}, flock:{cost:200, yrs:1}, cottages:{cost:360, yrs:1}, school:{cost:160, yrs:1},
  road:{cost:240, yrs:1}, front:{cost:900, yrs:2}, pinery:{cost:200, yrs:1}, icehouse:{cost:140, yrs:1}, oaks:{cost:120, yrs:1}
};
const EST = {retrenched:{cost:800, standing:25}, plain:{cost:1100, standing:42}, handsome:{cost:1500, standing:60}, splendid:{cost:2100, standing:80}};

function life(strategy, log){
  const S = {cash:900, mortgage:4000, annuities:0, funds:0, farms:estate(), standing:40, goodwill:50,
    heart:55, course:'old', done:{}, inHand:[], est:'plain', repairs:true, ruin:null, timberLeft:3, vent:{}, sold:[], crises:0, worst:900, mortCap:9000, enclosed:false};
  const P = strategy;
  if (P.fourth) S.farms.push({id:'coldharbour', name:'Coldharbour', acres:400, base:420, cond:2, rent:400, lease:{type:'term', ends:1806}, K:500, common:false, own:true}), S.mortgage += 3000, S.mortCap += 3000;   // the trait, and the money the uncle borrowed to buy it: a fourth farm, bought by the uncle and outside the settlement
  for (let y = Y0; y <= Y1; y++){
    const st = P.plan(S, y) || {}; let inc = 0, out = 0; const L = {};
    if (st.est) S.est = st.est; if (st.course && (st.course !== 'four' || S.done.fourcourse)) S.course = st.course; if (st.repairs !== undefined) S.repairs = st.repairs;
    // ---- rents
    let rents = 0, arrearsNow = 0;
    for (const f of S.farms){
      if (S.sold.includes(f.id)) continue;
      const condF = (f.mult || 1) * COND[f.cond] * (f.common && S.enclosed ? (S.bigChurch ? 1.5 : 1.3) : 1) * (f.id === 'kennet' ? (S.done.mill ? 1.06 : 1) * (S.done.meadows ? 1.08 : 1) : 1);
      const able = cap(y) * condF * f.base * (0.94 + S.goodwill / 800);
      const mkt = market(y) * condF * f.base;
      if (f.void){ // in hand after a tenant broke: farmed badly by a bailiff, then re-let low
        rents += Math.max(-0.15 * f.base, 0.35 * (able - 0.4 * f.base)); f.void--; if (!f.void){ f.rent = Math.round(0.9 * mkt); f.lease = {type:'will'}; f.K = 0.3 * f.rent; f.cond = Math.max(0, f.cond - 1); } continue; }
      // letting
      if (f.lease.type === 'term' && y >= f.lease.ends) f.lease = {type:'will', fresh:true};
      const want = P.let ? P.let(S, y, f) : null; // {type:'will'|'term'|'corn', years, level}
      if (f.lease.type === 'will'){
        if (want && want.type === 'term' && (f.lease.fresh || want.convert)){ f.rent = Math.round(LEVEL[want.level] * mkt); f.lease = {type:'term', ends:y + want.years, years:want.years}; if (want.level === 'rack') f.K = Math.min(f.K, 0.4 * f.rent); }
        else if (want && want.type === 'corn'){ f.lease = {type:'corn', ends:y + (want.years || 14), years:14, level:want.level}; }
        else { const lvl = LEVEL[(want && want.level) || 'fair']; const target = lvl * mkt; f.rent = Math.round(target > f.rent ? Math.min(target, f.rent * 1.12) : Math.max(target, f.rent * 0.9)); delete f.lease.fresh; }
      }
      if (f.lease.type === 'corn') f.rent = Math.round(LEVEL[f.lease.level || 'fair'] * 0.86 * f.base * condF * (0.5 * cap(y) + 0.5 * market(y)));
      // the tenant's year
      let got = f.rent; const surplus = able - f.rent;
      if (surplus >= 0) f.K = Math.min(1.6 * f.rent, f.K + surplus * 0.3); else { f.K += surplus; if (f.K < 0){ const short = Math.min(f.rent, -f.K); f.K = 0;
          const pol = (P.distress && P.distress(S, y, f)) || 'abate';
          if (pol === 'abate'){ got -= short; S.goodwill = Math.min(100, S.goodwill + 1); arrearsNow += short; }
          else { got -= short; f.arrears = (f.arrears || 0) + short; arrearsNow += short; S.goodwill -= 2; if (f.arrears > 0.9 * f.rent){ f.void = 1; f.arrears = 0; S.goodwill -= 3; L.broke = (L.broke || 0) + 1; } } } }
      // who keeps the place up
      const secure = (f.lease.type === 'term' || f.lease.type === 'corn') && f.lease.ends - y >= 5 && (f.lease.years || 14) >= 14;
      if (secure && f.K > 1.4 * f.rent && f.cond < 4 && f.cond >= 1){ f.K -= 0.9 * f.rent; f.cond++; }
      if (!secure && !S.repairs && rnd() < 0.08 && f.cond > 0) f.cond--;
      if (f.lease.type === 'will' && S.repairs && f.cond < 2 && f.id !== 'kennet' && rnd() < 0.2) f.cond++;
      rents += got;
    }
    { const live = S.farms.filter(f => !S.sold.includes(f.id)); const racked = live.filter(f => f.rent > 1.06 * market(y) * COND[f.cond] * f.base * (f.common && S.enclosed ? 1.3 : 1)).length / live.length, easy = live.filter(f => f.rent < 0.92 * market(y) * COND[f.cond] * f.base).length / live.length;
      S.goodwill += -5 * racked + 2 * easy - (S.goodwill > 60 ? 1 : 0); S.goodwill = Math.max(0, Math.min(100, S.goodwill)); }
    L.rents = Math.round(rents); inc += rents; L.arrears = Math.round(arrearsNow);
    // ---- home farm, 200 acres
    const wageIdx = 0.55 + 0.45 * trail(y, 5) / 50, hy = (0.72 + 0.0055 * S.heart) * WEATHER[y] * (0.9 + S.goodwill / 500);
    let hf;
    if (st.letHome || S.letHome){ S.letHome = true; hf = 190 * market(y); }
    else {
      const C = {old:{wheat:67, barley:45, sheep:0, heart:-1, lab:1.0}, four:{wheat:50, barley:50, sheep:1, heart:+3, lab:1.08}, corn:{wheat:105, barley:40, sheep:0, heart:-7, lab:1.12}}[S.course];
      const wq = C.wheat * 2.6 * hy * (S.course === 'four' ? 1.10 : 1), bq = C.barley * 3.6 * hy * (S.course === 'four' ? 1.12 : 1);
      let gross = wq * WHEAT[y] / 20 + bq * WHEAT[y] * 0.52 / 20 + (C.sheep ? (S.done.flock ? 160 : 100) * (0.6 + 0.4 * WHEAT[y] / 75) : 40);
      if (st.hold && y < Y1) gross += wq * (WHEAT[y + 1] - WHEAT[y]) / 20 * 0.5 - wq * WHEAT[y] / 20 * 0.04, S.goodwill -= (WHEAT[y] >= 95 ? 5 : 0);
      const costs = (340 * wageIdx * C.lab * (st.wages === 'high' ? 1.15 : 1) + 170 * (0.6 + 0.4 * trail(y, 3) / 50)) + 45 /*tithe to Dr Gall*/ * (S.titheFree ? 0 : WHEAT[y] / 75);
      hf = gross - costs; S.heart = Math.max(5, Math.min(100, S.heart + C.heart));
      if (st.wages === 'high') S.goodwill = Math.min(100, S.goodwill + 1.5);
    }
    L.home = Math.round(hf); inc += hf;
    // ---- woods: underwood every year; timber only when sent for
    const wood = 130 * (0.7 + 0.3 * trail(y, 3) / 50); inc += wood; L.wood = Math.round(wood);
    if (st.fell && S.timberLeft > 0){ const t = 750 * (1 + 0.035 * (y - 1795)); inc += t; S.timberLeft--; S.standing -= 3; L.timber = Math.round(t); }
    // ---- ventures: each can make him or break him, and each has a year to get out
    { const V = S.vent, v = st.vent || {}, lb = S.farms.find(f => f.id === 'longbarrow'); let vi = 0, vo = 0;
      // plough the down for wheat: a quarter more rent for seven years, then the thin soil is done
      if (v.plough === 'on' && !V.plough){ V.plough = {since:y}; vo += 250; }
      if (V.plough && !V.plough.off){ const n = y - V.plough.since; if (v.plough === 'off'){ V.plough.off = y; vo += 300; lb.mult = n > 7 ? 0.8 : 1; V.plough.heal = y + 5; } else lb.mult = n <= 7 ? 1.25 : 0.7; }
      if (V.plough && V.plough.off && y >= V.plough.heal) lb.mult = 1;
      // merinos: wool, then rams at fancy prices, then 1811
      if (v.merino === 'buy' && !V.merino && y >= 1800){ V.merino = {}; vo += 420; }
      if (V.merino && !V.merino.sold){ vi += (y < 1811 ? 110 : 15) + (y >= 1806 && y <= 1810 ? 150 : 0);
        if (v.merino === 'sell'){ V.merino.sold = y; vi += y <= 1805 ? 400 : y <= 1810 ? 400 + 200 * (y - 1805) : 60; } }
      // peat at Kennet Bottom: nine good years, and the meadow is gone when it is dug out
      if (v.peat && !V.peat){ V.peat = {since:y}; vo += 300; }
      if (V.peat){ const n = y - V.peat.since; if (n >= 1 && n <= 9) vi += 170 * (0.8 + 0.4 * rnd()); if (n === 10 && !S.done.meadows){ const k = S.farms.find(f => f.id === 'kennet'); k.cond = Math.max(0, k.cond - 1); } }
      // forage for the barracks: steady money while there is a war
      if (v.forage && !V.forage){ V.forage = true; vo += 200; }
      if (V.forage && !V.forageDone){ if (v.forage === 'out') V.forageDone = true; else if (y === 1802 || y === 1814) vo += 220; else if (rnd() < 0.1) vo += 60; else vi += 130; if (y === 1814) V.forageDone = true; }
      // a threshing machine: saves wages until somebody comes for it in the night
      if (v.thresher && !V.thresher && y >= 1803){ V.thresher = true; vo += 120; S.goodwill -= 4; }
      if (V.thresher && !V.thresherGone){ vi += 45 * wageIdx; if (y >= 1811 && S.goodwill < 45 && rnd() < 0.25){ V.thresherGone = true; vo += 300; L.outrage = 300; } }
      // a partner's share in the Wyvern Bank: fifteen per cent, and every acre answerable for its notes
      if (v.bank === 'in' && !V.bank){ V.bank = {}; vo += 1000; }
      if (V.bank && !V.bank.out){ vi += 150; S.standing += 0.5;
        if (v.bank === 'out' && !moneyTight(y)){ V.bank.out = y; vi += 1000; }
        else if ((y === 1797 && rnd() < 0.2) || (y === 1810 && rnd() < 0.15)){ vo += 500; L.call = 'a run on the bank, 500'; }
        else if (y === 1815 && rnd() < 0.45){ const c = 1500 + Math.round(rnd() * 2500); vo += c; V.bank.out = y; V.bank.broke = true; L.call = 'THE BANK STOPS, ' + (1000 + c) + ' lost'; } }
      // the Hatherley Spa: a spring, a pump room, and the question of whether anybody comes
      if (v.spa && !V.spa){ const r = rnd(); V.spa = {since:y, fate: r < 0.3 ? 'hit' : r < 0.8 ? 'dull' : 'flop'}; vo += 1800; }
      if (V.spa && y > V.spa.since){ const n = y - V.spa.since; V.spa.pays = V.spa.fate === 'hit' ? Math.min(750, 250 + 70 * n) : V.spa.fate === 'dull' ? 70 : -50; vi += V.spa.pays; if (V.spa.fate === 'hit') S.standing += 0.7; }
      inc += vi; out += vo; L.vent = Math.round(vi - vo); }
    // ---- the Funds
    const div = S.funds * 0.03; inc += div; L.funds = Math.round(div);
    // ---- outgoings
    const infl = 1 + 0.032 * (Math.min(y, 1813) - 1795);   // the household's prices follow the country's
    const house = EST[S.est].cost * infl; out += house; L.house = Math.round(house);
    S.standing += (EST[S.est].standing - S.standing) * 0.25;
    const interest = S.mortgage * 0.05 + S.annuities * (100 / 720); out += interest; L.interest = Math.round(interest);
    const poor = 130 * (WHEAT[y] / 75) * (1.25 - S.goodwill / 200) * (S.enclosed && !S.done.allot ? 1.2 : 1); out += poor;
    const landTax = S.ltRedeemed ? 0 : 110; out += landTax;
    const assessed = {retrenched:35, plain:60, handsome:95, splendid:150}[S.est] * (y >= 1798 ? 2 : 1); out += assessed;
    const rep = S.repairs ? 0.055 * 1620 * (0.7 + 0.3 * trail(y, 3) / 50) : 0; out += rep;
    const steward = P.audit ? 0 : 60;   // Mr Crabbe's sundries, where nobody adds the column twice out += steward;
    const taxRate = (y >= 1799 && y <= 1801) ? 0.1 : (y >= 1803 && y <= 1805) ? 0.05 : y >= 1806 ? 0.1 : 0; const itax = taxRate * Math.max(0, rents + hf + wood + div - interest); out += itax;
    L.taxes = Math.round(poor + landTax + assessed + itax); L.repairs = Math.round(rep);
    // ---- what walks into the hall: the event deck, in bulk. Mean about 170 a year, fat-tailed.
    let ev = 60 + rnd() * 160 + (rnd() < 0.12 ? 300 + rnd() * 500 : 0); ev *= {retrenched:0.7, plain:1, handsome:1.25, splendid:1.6}[S.est];
    if (y === 1796) ev += P.commission === undefined ? 450 : P.commission;           // Edmund
    if (y === 1801) ev += P.portion === undefined ? 1500 : P.portion;                // Kitty
    ev *= 0.75 + 0.25 * infl; if (S.goodwill < 25 && rnd() < 0.3){ const o = 150 + rnd() * 350; ev += o; L.outrage = Math.round(o); }   // a rick, a ewe, a keeper's head
    if (st.extra) ev += st.extra;                                                    // London, an election, a sheriff's year
    out += ev; L.events = Math.round(ev);
    // ---- works
    for (const id of (st.works || [])){ if (S.done[id] || S.inHand.find(w => w.id === id)) continue; S.inHand.push({id, left:WORKS[id].yrs, per:WORKS[id].cost / WORKS[id].yrs}); }
    let wk = 0; for (const w of S.inHand.slice()){ wk += w.per; if (--w.left <= 0){ S.inHand.splice(S.inHand.indexOf(w), 1); S.done[w.id] = y; finish(S, w.id, y); } }
    out += wk; L.works = Math.round(wk);
    if (st.bride && !S.farms.find(f => f.id === 'coldharbour') && S.standing >= 50 && S.farms.filter(f => !S.sold.includes(f.id)).length < 5){ const d = FOR_SALE.coldharbour;   // Edmund marries land
      S.farms.push({id:'coldharbour', name:d.name, acres:d.acres, base:d.base, cond:2, rent:Math.round(d.base * market(y) * 0.9), lease:{type:'term', ends:y + 6}, K:d.base, common:false, own:true}); S.allowance = 300; L.bought = 'Coldharbour comes with the bride'; }
    if (S.allowance) out += S.allowance * infl;
    let bought = 0; if (st.buy && FOR_SALE[st.buy] && FOR_SALE[st.buy].years.includes(y) && !S.farms.find(f => f.id === st.buy) && S.farms.filter(f => !S.sold.includes(f.id)).length < 5){
      const d = FOR_SALE[st.buy], price = priceOf(st.buy, y), left = Math.round(price * 2 / 3 / 500) * 500;   // the seller leaves two-thirds on the land at five per cent
      S.farms.push({id:st.buy, name:d.name, acres:d.acres, base:d.base, cond:d.cond, rent:Math.round(d.base * COND[d.cond] * market(y)), lease:{type:'will', fresh:true}, K:0.5 * d.base, common:false, own:true, paid:price});
      S.mortgage += left; S.mortCap += left; bought = price - left; L.bought = d.name + ' for ' + price; }
    // ---- money
    S.cash += inc - out - bought;
    if (st.redeemLT && !S.ltRedeemed && S.cash > 2100){ S.cash -= 110 * 1.1 / 0.03 * consolPrice(y) / 100; S.ltRedeemed = true; }
    if (st.buyFunds && S.cash > st.buyFunds.keep){ const spend = S.cash - st.buyFunds.keep; S.funds += spend / consolPrice(y) * 100; S.cash -= spend; }
    if (st.repay && S.cash > st.repay.keep && S.mortgage > 0){ const r = Math.min(S.mortgage, Math.floor((S.cash - st.repay.keep) / 500) * 500); S.mortgage -= r; S.cash -= r; }
    // the mortgagee wants his money when the Funds pay better than the law allows him
    if (moneyTight(y) && S.mortgage > 3000 && rnd() < 0.3){ const call = 1000; L.called = call;
      if (S.cash >= call + 300){ S.cash -= call; S.mortgage -= call; }
      else if (S.funds * consolPrice(y) / 100 >= call){ S.funds -= call / consolPrice(y) * 100; S.mortgage -= call; }
      else if (S.standing >= 55){ /* a friend takes the assignment */ }
      else { S.mortgage -= call; S.annuities += call; } }
    // borrowing to cover a hole: mortgage if it can be had, else the Funds, timber, annuity, tradesmen
    if (S.cash < 0){ S.crises++;
      if (S.funds > 0){ const need = Math.min(-S.cash + 200, S.funds * consolPrice(y) / 100); S.funds -= need / consolPrice(y) * 100; S.cash += need; }
      const cover = (S.mortgage + S.annuities) * 0.05 / Math.max(1, rents);
      while (S.cash < 0 && !moneyTight(y) && S.mortgage < S.mortCap && cover < 0.45){ S.mortgage += 500; S.cash += 500; }
      if (S.cash < 0 && S.timberLeft > 0 && P.fellInNeed !== false){ S.cash += 750 * (1 + 0.035 * (y - 1795)); S.timberLeft--; S.standing -= 3; }
      while (S.cash < -300 && S.annuities < 3600){ S.annuities += 720; S.cash += 720; }
      if (S.cash < 0){ out += -S.cash * 0.12; S.cash *= 1.12; S.standing -= 3; }
      if (S.cash < -1500){ // execution in the house: an outlying farm goes at 26 years' purchase, if one is left to go
        const live = S.farms.filter(f => !S.sold.includes(f.id) && !f.void); const f = live.find(f => f.own) || (live.length > 2 ? live.find(f => f.id === 'longbarrow') || live[0] : null);
        if (f){ S.cash += f.rent * 26 * (moneyTight(y) ? 0.9 : 1); S.sold.push(f.id); S.standing -= 8; L.sold = f.name; }
        else { S.ruin = y; break; } } }
    S.worst = Math.min(S.worst, S.cash);
    if (log) log(y, L, S, Math.round(inc), Math.round(out));
  }
  const liveF = S.farms.filter(f => !S.sold.includes(f.id)); const rental = liveF.reduce((a, f) => a + f.rent, 0);
  const sustain = liveF.reduce((a, f) => a + Math.min(f.rent || 1e9, SUSTAIN * COND[f.cond] * f.base * (f.common && S.enclosed ? 1.3 : 1)), 0);
  const lost = S.farms.filter(f => S.sold.includes(f.id) && !f.own).length;
  const vent = (S.vent.spa ? (S.vent.spa.pays || 0) : 0) + (S.vent.bank && !S.vent.bank.out ? 150 : 0) + (S.vent.merino && !S.vent.merino.sold ? 15 : 0);
  const clear = Math.round(vent + sustain + (S.letHome ? 190 * SUSTAIN : 450) + 150 + S.funds * 0.03 - S.mortgage * 0.05 - S.annuities * (100 / 720) + Math.max(0, S.cash) * 0.03);
  return {farms:liveF.length, sustain:Math.round(sustain), lost, clear, ruin:S.ruin, net:Math.round(S.cash + S.funds * consolPrice(Math.min(Y1, S.ruin || Y1)) / 100 - S.mortgage - S.annuities), rental, sold:S.sold.length, crises:S.crises, standing:Math.round(S.standing), goodwill:Math.round(S.goodwill), debt:S.mortgage + S.annuities, worst:Math.round(S.worst)};
}
function finish(S, id, y){ const f = k => S.farms.find(x => x.id === k);
  if (id === 'drain'){ f('kennet').cond = 2; f('kennet').lease = {type:'will', fresh:true}; }
  if (id === 'enclosure'){ S.enclosed = true; S.titheFree = true; S.goodwill -= S.done.cottages ? 8 : 16;
    if (S.farms.filter(x => !S.sold.includes(x.id)).length < 5) S.farms.push({id:'common', name:'Common Piece', acres:300, base:230, cond:1, rent:0, lease:{type:'will', fresh:true}, K:80, common:false, void:2, own:true}); else S.bigChurch = true;
    f('church').lease = {type:'will', fresh:true}; }
  if (id === 'cottages') S.goodwill += 9; if (id === 'school') S.goodwill += 6; if (id === 'road'){ S.goodwill += 3; S.standing += 3; }
  if (id === 'front') S.standing += 9; if (id === 'pinery') S.standing += 4; if (id === 'oaks') S.standing += 2;
}

/* ---- twelve squires ---- */
const SQUIRES = {
  'The Sitter':      {plan:(S, y) => ({est:'plain'}), let:(S, y, f) => ({type:'term', years:14, level:'fair'})},
  'Sitter, four farms':{fourth:true, plan:(S, y) => ({est:'plain'}), let:(S, y, f) => ({type:'term', years:14, level:'fair'})},
  'The Careful Man': {audit:true, portion:1000, plan:(S, y) => ({est: y < 1799 ? 'retrenched' : 'plain', works: y === 1799 ? ['drain'] : y === 1802 ? ['fourcourse'] : [], course:'four', repay:{keep:500}, buyFunds: y === 1797 || y === 1798 ? {keep:300} : null}), let:(S, y, f) => ({type:'corn', level:'fair'})},
  'The Improver':    {audit:true, plan:(S, y) => ({est:'plain', course:'four', wages:'high', works: y === 1795 ? ['drain'] : y === 1796 ? ['fourcourse'] : y === 1797 ? ['flock'] : y === 1799 ? ['mill'] : y === 1800 ? ['meadows','cottages'] : y === 1802 ? ['enclosure'] : y === 1806 ? ['school'] : [], repay: y > 1806 ? {keep:600} : null}), let:(S, y, f) => ({type:'term', years:14, level:'fair'})},
  'The Engrosser':   {audit:true, portion:2000, plan:(S, y) => ({est: y < 1798 ? 'retrenched' : y < 1803 ? 'plain' : 'handsome', course:'four', works: y === 1796 ? ['drain'] : y === 1799 ? ['fourcourse'] : y === 1801 ? ['flock','meadows'] : y === 1808 ? ['enclosure'] : [], buy: y === 1798 ? 'starveall' : null, bride: y === 1805, repay: y > 1801 ? {keep:600} : null}), let:(S, y, f) => y < 1808 ? {type:'term', years:14, level:'fair'} : {type:'corn', level:'fair'}},
  'The Great Man':   {fourth:true, audit:true, plan:(S, y) => ({est: y < 1804 ? 'plain' : 'handsome', course:'four', wages:'high', works: y === 1795 ? ['drain'] : y === 1796 ? ['fourcourse'] : y === 1797 ? ['flock'] : y === 1799 ? ['meadows'] : y === 1800 ? ['cottages'] : y === 1801 ? ['enclosure'] : y === 1806 ? ['mill'] : [], repay: y > 1804 ? {keep:600} : null}), let:(S, y, f) => ({type:'term', years:14, level:'fair'})},
  'The Shrewd Projector':{audit:true, plan:(S, y) => ({est:'plain', course:'four', works: y === 1795 ? ['drain'] : y === 1797 ? ['fourcourse'] : y === 1800 ? ['meadows'] : y === 1802 ? ['enclosure'] : [], repay: y > 1806 ? {keep:600} : null,
      vent:{plough: y === 1796 ? 'on' : y === 1803 ? 'off' : null, merino: y === 1801 ? 'buy' : y === 1809 ? 'sell' : null, peat: y === 1798, forage: y === 1796 ? true : y === 1813 ? 'out' : null, bank: y === 1799 ? 'in' : y === 1811 ? 'out' : null, spa: y === 1806}}), let:(S, y, f) => ({type:'will', level:'fair'})},
  'The Projector':   {plan:(S, y) => ({est: y < 1803 ? 'plain' : 'handsome', course:'corn', works: y === 1797 ? ['drain'] : [],
      vent:{plough: y === 1796 ? 'on' : null, merino: y === 1801 ? 'buy' : null, peat: y === 1798, forage: y === 1796, thresher: y === 1803, bank: y === 1799 ? 'in' : null, spa: y === 1806}}), let:(S, y, f) => ({type:'term', years:7, level:'rack'}), distress:() => 'hold'},
  'The Rack-Renter': {audit:true, plan:(S, y) => ({est:'plain', course:'corn', hold:true, buyFunds:{keep:500}}), let:(S, y, f) => ({type:'will', level:'rack'}), distress:() => 'hold'},
  'The Figure':      {plan:(S, y) => ({est: y < 1802 ? 'handsome' : 'splendid', works: y === 1796 ? ['icehouse'] : y === 1798 ? ['front'] : y === 1801 ? ['pinery'] : [], extra: (y % 3 === 0 ? 350 : 0) + (y === 1807 ? 3500 : 0)}), let:(S, y, f) => ({type:'will', level:'fair'})},
  'Buys Everything': {plan:(S, y) => ({est:'handsome', course:'four', works:Object.keys(WORKS).slice((y - 1795) * 2, (y - 1795) * 2 + 2), buy: y === 1804 ? 'starveall' : y === 1811 ? 'coldharbour' : null}), let:(S, y, f) => ({type:'term', years:7, level:'fair'})},
  'The Late Convert':{plan:(S, y) => ({est: y < 1808 ? 'plain' : 'handsome', course: y < 1808 ? 'old' : 'corn', works: y === 1808 ? ['drain','mill'] : y === 1809 ? ['enclosure'] : y === 1810 ? ['meadows','front'] : [], buy: y === 1811 ? 'coldharbour' : null}), let:(S, y, f) => y >= 1809 ? {type:'term', years:7, level:'rack', convert:true} : {type:'will', level:'fair'}, distress:() => 'hold'}
};

const args = process.argv.slice(2), N = +(args.find(a => /^\d+$/.test(a)) || 2000);
if (args.includes('--tables')){
  console.log('year wheat capacity market consols yield tight');
  for (let y = Y0; y <= Y1; y++) console.log(y, String(WHEAT[y]).padStart(4), cap(y).toFixed(2).padStart(6), market(y).toFixed(2).padStart(6), consolPrice(y).toFixed(0).padStart(5), CONSOL_YIELD[y].toFixed(2), moneyTight(y) ? 'tight' : '');
}
const one = args.find(a => a.startsWith('--life='));
if (one){ const nm = one.slice(7); seed = 7; console.log(nm); console.log('year  rents  home  wood | house intst taxes evnts works  vent |   cash  mortg annty funds | notes');
  life(SQUIRES[nm], (y, L, S, inc, out) => console.log(y, String(L.rents).padStart(6), String(L.home).padStart(5), String(L.wood + (L.timber || 0)).padStart(5), '|', String(L.house).padStart(5), String(L.interest).padStart(5), String(L.taxes).padStart(5), String(L.events).padStart(5), String(L.works).padStart(5), String(L.vent || 0).padStart(6), '|', String(Math.round(S.cash)).padStart(6), String(S.mortgage).padStart(6), String(S.annuities).padStart(5), String(Math.round(S.funds)).padStart(5), '|', [L.arrears ? 'arrears ' + L.arrears : '', L.broke ? L.broke + ' tenant broke' : '', L.called ? 'mortgage called' : '', L.call || '', L.outrage ? 'outrage ' + L.outrage : '', L.sold ? 'SOLD ' + L.sold : '', L.bought ? 'BOUGHT ' + L.bought : ''].filter(Boolean).join(', '))); }
if (!one){
  console.log(`\n${N} lives each. Clear income = what the estate will bring in a settled year after 1815, interest paid. He begins on about 1,950 a year with three farms.`);
  console.log('squire'.padEnd(18), 'sold up  lost a farm  farms  clear income (10th..median..90th)   paper rents  debt 1815  goodwill');
  for (const nm in SQUIRES){ const R = []; for (let i = 0; i < N; i++){ seed = i * 7919 + 13; R.push(life(SQUIRES[nm])); }
    const alive = R.filter(r => !r.ruin), q = (k, p) => { const a = alive.map(r => r[k]).sort((a, b) => a - b); return a.length ? a[Math.floor(p * (a.length - 1))] : NaN; };
    console.log(nm.padEnd(18), (100 * R.filter(r => r.ruin).length / N).toFixed(0).padStart(5) + '%', (100 * R.filter(r => r.lost || r.ruin).length / N).toFixed(0).padStart(10) + '%', String(q('farms', .5)).padStart(6), (q('clear', .1) + '..' + q('clear', .5) + '..' + q('clear', .9)).padStart(26), String(q('rental', .5)).padStart(19), String(q('debt', .5)).padStart(10), String(q('goodwill', .5)).padStart(9)); }
}

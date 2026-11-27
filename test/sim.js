// Plays many random lives straight through the engine, to shake out runtime errors.
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = ['data','traits','engine','events1','events2','events3','estate'].map(f => fs.readFileSync(path.join(__dirname,'../src',f+'.js'),'utf8')).join('\n');
const ctx = {console, Math, JSON, localStorage:{setItem(){},getItem(){return null},removeItem(){}}, window:{scrollTo(){}}};
ctx.render = () => {}; vm.createContext(ctx);
vm.runInContext(src + '\nindexEvents(); this.api={societyList,beginSociety,endSociety,ownLandValue,farmsForSale,buyFarm,sellFarm,establishment,venturesList,beginVenture,endVenture,farmsList,rentRoll,setLevel,offerLease,worksList,beginWork,worksInHand,worksDone,TRAITS,TRAIT_GROUPS,pointsLeft,newGame,next,choose,undertake,undertakingOptions,byId,reckoning,get S(){return S},EVENTS};', ctx);
const STRAT = process.argv[3] || 'random';
const A = ctx.api, runs = +process.argv[2] || 300, seen = {}, ends = {}, stats = {money:0, sc:0, n:0}, farms = {n:0, count:0}, rent13 = [], vent = {}, est = {}, land = {bought:0, sold:0, max:0}, socs = {}, bubs = {};
for (let i = 0; i < runs; i++){
  let tr=[]; for (let k=0;k<30;k++){ tr=[]; for (const [g] of A.TRAIT_GROUPS){ const o=A.TRAITS.filter(t=>t.group===g); if (Math.random()<.6) tr.push(o[Math.floor(Math.random()*o.length)].id); } if (A.pointsLeft(tr)>=0) break; tr=[]; } A.newGame('Thomas','Merridew',tr); let guard = 0;
  while (A.S.phase !== 'end' && guard++ < 2000){
    const S = A.S;
    if (S.phase === 'event'){ const e = A.byId(S.pending); seen[e.id] = (seen[e.id]||0)+1; const t = e.text(); if (/undefined|NaN|\[object/.test(t)) throw new Error('bad text '+e.id+': '+t);
      const cs = e.choices.filter(c => !c.if || c.if()); if (!cs.length) throw new Error('no choices '+e.id); A.choose(Math.floor(Math.random()*cs.length));
      if (/undefined|NaN|\[object/.test(A.S.outcome.text)) throw new Error('bad outcome '+e.id+': '+A.S.outcome.text); }
    else if (S.phase === 'undertake' && STRAT !== 'random'){ const o = A.undertakingOptions(), keep = o.map((x,i)=>i).filter(i => !/^(Reduce to|Set up) /.test(o[i].t)), up = o.findIndex(x => /^Set up /.test(x.t)); A.undertake(STRAT === 'figure' && up >= 0 ? up : keep[Math.floor(Math.random()*keep.length)]); }
    else if (S.phase === 'undertake'){ if (Math.random()<.15){ const w=A.worksList().filter(x=>x.can); if (w.length) A.beginWork(w[Math.floor(Math.random()*w.length)].id); } A.worksInHand(); A.worksDone(); { const fs2=A.farmsForSale(); if (/undefined|NaN/.test(JSON.stringify(fs2))) throw new Error('bad market '+JSON.stringify(fs2)); for (const f of fs2) if (f.can && Math.random()<.1){ A.buyFarm(f.id); land.bought++; } for (const f of A.farmsList()) if (f.canSell && Math.random()<.004){ A.sellFarm(f.id); land.sold++; } land.max=Math.max(land.max, A.farmsList().length); } { const sl=A.societyList(); if (/undefined|NaN/.test(JSON.stringify(sl))) throw new Error('bad society '+JSON.stringify(sl)); for (const x of sl){ if (x.can && Math.random()<.03){ A.beginSociety(x.id); socs[x.id]=(socs[x.id]||0)+1; } else if (x.canEnd && Math.random()<.01) A.endSociety(x.id); } } { const vl=A.venturesList(); if (/undefined|NaN/.test(JSON.stringify(vl))) throw new Error('bad ventures '+JSON.stringify(vl)); for (const v of vl){ if (v.can && Math.random()<.03){ A.beginVenture(v.id); vent[v.id]=(vent[v.id]||0)+1; } else if (v.canEnd && Math.random()<.03) A.endVenture(v.id); } } { if (/undefined|NaN/.test(JSON.stringify(A.farmsList()))) throw new Error('bad farmsList'); const rr=A.rentRoll(); for (const f of rr){ if (/undefined|NaN/.test(JSON.stringify(f))) throw new Error('bad roll '+JSON.stringify(f)); if (f.canLevel && Math.random()<.04) A.setLevel(f.id, ['easy','fair','rack'][Math.floor(Math.random()*3)]); if (f.canOffer && Math.random()<.02) A.offerLease(f.id); } farms.n++; farms.count+=rr.length; if (S.year===1813&&S.season===2) rent13.push(rr.reduce((a,f)=>a+f.rent,0)); }  const o = A.undertakingOptions(); A.undertake(Math.floor(Math.random()*o.length)); if (/undefined|NaN/.test(A.S.outcome.text)) throw new Error('bad undertaking'); }
    else { A.next(); if (/undefined|NaN|\[object/.test(JSON.stringify(A.S.notes)+JSON.stringify(A.S.ledger))) throw new Error('bad quarter '+JSON.stringify(A.S.notes)+JSON.stringify(A.S.ledger)); }
  }
  est[A.establishment().id]=(est[A.establishment().id]||0)+1; { const f=A.S.flags; bubs[f.bubbleMade?'made':f.bubbleBurnt?'burnt':f.bubbleOut?'sold out':'other']=(bubs[f.bubbleMade?'made':f.bubbleBurnt?'burnt':f.bubbleOut?'sold out':'other']||0)+1; } const r = A.reckoning(); if (/undefined|NaN/.test(JSON.stringify(A.S.notes)+JSON.stringify(A.S.journal.slice(0,40)))) throw new Error('bad note '+JSON.stringify(A.S.notes)); if (/undefined|NaN|\[object/.test(r.P.join(' '))) throw new Error('bad reckoning: '+r.P.join(' '));
  ends[r.title] = (ends[r.title]||0)+1; if (r.score !== null){ stats.money += A.S.money - A.S.mortgage + A.ownLandValue(); stats.sc += r.score; stats.n++; }
}
console.log('endings', ends); const fin=A.S;  console.log('avg net', Math.round(stats.money/stats.n), 'avg score', Math.round(stats.sc/stats.n));
console.log('sales by order', seen.hammer||0, '| meetings at the George', seen.georgeMeeting||0, 'in', runs, 'lives');
const never = A.EVENTS.filter(e => !seen[e.id]).map(e => e.id); console.log('never seen:', never.join(', ') || 'none');
console.log('events per life', (Object.values(seen).reduce((a,b)=>a+b,0)/runs).toFixed(1));

console.log('farms held, average', (farms.count/farms.n).toFixed(2), '| rental at Michaelmas 1813, average', Math.round(rent13.reduce((a,b)=>a+b,0)/Math.max(1,rent13.length)));
console.log('ventures begun', JSON.stringify(vent));
console.log('establishment at the end', JSON.stringify(est));
console.log('land', JSON.stringify(land));
console.log('society bought', JSON.stringify(socs));
console.log('the bubble', JSON.stringify(bubs));

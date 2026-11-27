// Plays many random lives straight through the engine, to shake out runtime errors.
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = ['data','traits','engine','events1','events2','events3','estate'].map(f => fs.readFileSync(path.join(__dirname,'../src',f+'.js'),'utf8')).join('\n');
const ctx = {console, Math, JSON, localStorage:{setItem(){},getItem(){return null},removeItem(){}}, window:{scrollTo(){}}};
ctx.render = () => {}; vm.createContext(ctx);
vm.runInContext(src + '\nindexEvents(); this.api={farmsList,rentRoll,setLevel,offerLease,worksList,beginWork,worksInHand,worksDone,TRAITS,TRAIT_GROUPS,pointsLeft,newGame,next,choose,undertake,undertakingOptions,byId,reckoning,get S(){return S},EVENTS};', ctx);
const A = ctx.api, runs = +process.argv[2] || 300, seen = {}, ends = {}, stats = {money:0, sc:0, n:0}, farms = {n:0, count:0}, rent13 = [];
for (let i = 0; i < runs; i++){
  let tr=[]; for (let k=0;k<30;k++){ tr=[]; for (const [g] of A.TRAIT_GROUPS){ const o=A.TRAITS.filter(t=>t.group===g); if (Math.random()<.6) tr.push(o[Math.floor(Math.random()*o.length)].id); } if (A.pointsLeft(tr)>=0) break; tr=[]; } A.newGame('Thomas','Merridew',tr); let guard = 0;
  while (A.S.phase !== 'end' && guard++ < 2000){
    const S = A.S;
    if (S.phase === 'event'){ const e = A.byId(S.pending); seen[e.id] = (seen[e.id]||0)+1; const t = e.text(); if (/undefined|NaN|\[object/.test(t)) throw new Error('bad text '+e.id+': '+t);
      const cs = e.choices.filter(c => !c.if || c.if()); if (!cs.length) throw new Error('no choices '+e.id); A.choose(Math.floor(Math.random()*cs.length));
      if (/undefined|NaN|\[object/.test(A.S.outcome.text)) throw new Error('bad outcome '+e.id+': '+A.S.outcome.text); }
    else if (S.phase === 'undertake'){ if (Math.random()<.15){ const w=A.worksList().filter(x=>x.can); if (w.length) A.beginWork(w[Math.floor(Math.random()*w.length)].id); } A.worksInHand(); A.worksDone(); { if (/undefined|NaN/.test(JSON.stringify(A.farmsList()))) throw new Error('bad farmsList'); const rr=A.rentRoll(); for (const f of rr){ if (/undefined|NaN/.test(JSON.stringify(f))) throw new Error('bad roll '+JSON.stringify(f)); if (f.canLevel && Math.random()<.04) A.setLevel(f.id, ['easy','fair','rack'][Math.floor(Math.random()*3)]); if (f.canOffer && Math.random()<.02) A.offerLease(f.id); } farms.n++; farms.count+=rr.length; if (S.year===1813&&S.season===2) rent13.push(rr.reduce((a,f)=>a+f.rent,0)); }  const o = A.undertakingOptions(); A.undertake(Math.floor(Math.random()*o.length)); if (/undefined|NaN/.test(A.S.outcome.text)) throw new Error('bad undertaking'); }
    else A.next();
  }
  const r = A.reckoning(); if (/undefined|NaN|\[object/.test(r.P.join(' '))) throw new Error('bad reckoning: '+r.P.join(' '));
  ends[r.title] = (ends[r.title]||0)+1; if (r.score !== null){ stats.money += A.S.money - A.S.mortgage; stats.sc += r.score; stats.n++; }
}
console.log('endings', ends); const fin=A.S;  console.log('avg net', Math.round(stats.money/stats.n), 'avg score', Math.round(stats.sc/stats.n));
console.log('sales by order', seen.hammer||0, '| meetings at the George', seen.georgeMeeting||0, 'in', runs, 'lives');
const never = A.EVENTS.filter(e => !seen[e.id]).map(e => e.id); console.log('never seen:', never.join(', ') || 'none');
console.log('events per life', (Object.values(seen).reduce((a,b)=>a+b,0)/runs).toFixed(1));

console.log('farms held, average', (farms.count/farms.n).toFixed(2), '| rental at Michaelmas 1813, average', Math.round(rent13.reduce((a,b)=>a+b,0)/Math.max(1,rent13.length)));

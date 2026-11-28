// Plays the built page through at desk and phone widths, by way of the plan and its plates, taking shots into the folder given. Usage: node tools/play.js <folder>. Wants "overflow d 0", "overflow m 0", "errors []".
const {chromium}=require('playwright');
(async()=>{const d=process.argv[2];const b=await chromium.launch();
const errs=[];
for (const [tag,vp] of [['d',{width:1360,height:900}],['m',{width:400,height:800}]]){
 const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errs.push(tag+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(tag+' console: '+m.text())});
 await p.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));await p.waitForTimeout(1500);
 await p.screenshot({path:`${d}/${tag}0-intro.png`,fullPage:true});
 await p.click('#keys'); await p.waitForTimeout(300); await p.click('#takeit');await p.waitForTimeout(400);
 await p.screenshot({path:`${d}/${tag}1-plan.png`});
 await p.evaluate(()=>openBook());await p.waitForTimeout(400);
 await p.screenshot({path:`${d}/${tag}2-ledger.png`,fullPage:true});
 await p.evaluate(()=>shutBook());await p.waitForTimeout(400);
 await p.click('#cart .act');await p.waitForTimeout(600);
 await p.screenshot({path:`${d}/${tag}2-called.png`});
 await p.click('#cart .act');await p.waitForTimeout(400);
 await p.screenshot({path:`${d}/${tag}3-plate.png`});
 await p.click('#plate .choice');await p.waitForTimeout(400);
 await p.screenshot({path:`${d}/${tag}4-outcome.png`});
 await p.evaluate(()=>next());await p.waitForTimeout(400);
 await p.screenshot({path:`${d}/${tag}5-undertake.png`});
 if(tag==='d'){ for(const t of ['farms','ventures','works','persons','daybook']){await p.evaluate(t=>openBook(t),t);await p.waitForTimeout(200);await p.screenshot({path:`${d}/d6-${t}.png`});} await p.evaluate(()=>shutBook());
  // play on to find a non-bill event and the end
  let letter=false; for(let i=0;i<600;i++){ const ph=await p.evaluate(()=>S.phase); if(ph==='end')break;
   if(ph==='event'){ const bill=await p.evaluate(()=>BILLS.has(S.pending)); if(!bill&&!letter){letter=true;await p.screenshot({path:`${d}/d7-letter.png`,fullPage:true});} await p.evaluate(()=>choose(0)); }
   else if(ph==='undertake') await p.evaluate(()=>undertake(0)); else await p.evaluate(()=>next()); }
  await p.waitForTimeout(300); await p.screenshot({path:`${d}/d8-end.png`,fullPage:true});
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth); console.log('overflow d',ov); }
 else { const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth); console.log('overflow m',ov); }
}
console.log('errors',errs);await b.close();})();

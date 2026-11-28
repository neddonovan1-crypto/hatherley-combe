const fs=require('fs'),vm=require('vm'),path=require('path');
// Saves written by older builds are loaded into this one and played to the end. Usage: node test/oldsaves.js [commit ...]
// Each commit named is built from git into a temporary folder; with none named, four builds that were on the Netlify alpha are tried.
const os=require('os'),cp=require('child_process');const ROOT=path.join(__dirname,'..');
function oldDir(c){ const d=fs.mkdtempSync(path.join(os.tmpdir(),'hc-'+c+'-')); cp.execSync(`git archive ${c} src build.sh | tar -x -C "${d}"`,{cwd:ROOT}); return d; }
function world(dir){ const order=fs.readFileSync(path.join(dir,'build.sh'),'utf8').match(/JS="([^"]+)"/)[1].split(' ');
 const src=order.map(f=>fs.readFileSync(path.join(dir,f),'utf8')).join('\n'); let store={};
 const ctx={console,Math,JSON,localStorage:{setItem(k,v){store[k]=v},getItem(k){return k in store?store[k]:null},removeItem(k){delete store[k]}},window:{scrollTo(){}},navigator:{}};
 ctx.render=()=>{}; vm.createContext(ctx);
 vm.runInContext(src+'\nindexEvents(); this.api={get S(){return S},setS(x){S=x},newGame,choose,undertake,next,byId,undertakingOptions,load:typeof load==="function"?load:null,all:()=>{const o=[];for(const f of ["farmsList","worksList","venturesList","societyList","householdList","creditList","castleList","farmsForSale","reckoning"]) if(typeof this[f]==="function"||eval("typeof "+f)==="function") o.push(JSON.stringify(eval(f)()));return o.join("")}};',ctx);
 return {A:ctx.api,store:()=>store,put:(k,v)=>{store[k]=v}}; }
function step(A){ const S=A.S; if(S.phase==='end')return false;
 if(S.phase==='event'){const e=A.byId(S.pending);const n=e.choices.filter(c=>!c.if||c.if()).length;A.choose(Math.floor(Math.random()*n));}
 else if(S.phase==='undertake'){const o=A.undertakingOptions();A.undertake(Math.floor(Math.random()*o.length));}
 else A.next(); return true; }
let ok=0,bad=0;
const COMMITS=process.argv.slice(2).length?process.argv.slice(2):['ea0f6d3','923dad9','a54dbf0','6436165'];
for(const c of COMMITS){ const dir=oldDir(c); for(let run=0;run<60;run++){
 const stop=[0,1,2,3,5,8,13,21,34,55,89,144,200][run%13]+Math.floor(Math.random()*3);
 const old=world(dir); old.A.newGame('Thomas','Merridew',[]);
 try{ for(let i=0;i<stop;i++) if(!step(old.A))break; }catch(e){ continue; }
 const raw=old.store()['hatherley-combe-save-v1']; const was=JSON.parse(raw);
 const nw=world(ROOT); nw.put('hatherley-combe-save-v1',raw);
 try{ const s=nw.A.load(); if(!s||s.t!==was.t||s.money!==was.money||s.phase!==was.phase&&was.pending) throw new Error('not resumed: '+(s&&s.t+' '+s.phase)+' was '+was.t+' '+was.phase);
  if(!nw.store()['hatherley-combe-save-before']) throw new Error('no copy kept');
  nw.A.setS(s); let g=0; const out=nw.A.all(); if(/undefined|NaN/.test(out)) throw new Error('bad lists');
  while(step(nw.A)&&g++<3000){ if(g%7===0){ const o=nw.A.all(); if(/NaN/.test(o)) throw new Error('NaN in lists'); } }
  if(nw.A.S.phase!=='end') throw new Error('never ended'); ok++; }
 catch(e){ bad++; if(bad<12) console.log(c,stop,was.phase,was.pending,(e.stack||'').split('\n').slice(0,3).join(' | ').slice(0,400)); } } }
console.log('old saves mended and played out', ok, '| failed', bad); process.exit(bad ? 1 : 0);

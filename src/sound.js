/* The sounds of the house. Files are in sound/, their makers in SOUNDS.md.
   Loaded last: it wraps render, start, resume, choose, undertake, showTab and showWho, and alters nothing in them.
   The house is silent until Sound is turned on in the corner of the desk. The choice is remembered. */
const Sound = (() => {
  const DIR = 'sound/', VOL = .6, AIR = .45, LAP = 2.5, KEY = 'hatherley-quiet';
  let muted = true; try { muted = localStorage.getItem(KEY) !== '0'; } catch (err) {}
  let ctx = null, master = null, live = false, airName = '', airWant = '', airTok = 0, airBus = null, airTag = null;
  const bufs = {};
  const fetchBuf = name => bufs[name] || (bufs[name] = fetch(DIR + name + '.mp3').then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); }).then(a => ctx.decodeAudioData(a)).catch(() => null));
  // Where the page cannot fetch (opened from a folder), plain audio elements stand in.
  const tag = (name, vol, delay, loop) => { const a = new Audio(DIR + name + '.mp3'); a.volume = Math.min(1, VOL * vol); a.loop = !!loop; setTimeout(() => { if (!muted) a.play().catch(() => {}); }, delay * 1000); return a; };

  function play(name, vol = 1, delay = 0){ if (muted || !live) return;
    fetchBuf(name).then(b => { if (muted) return; if (!b) return void tag(name, vol, delay);
      const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = vol; s.connect(g).connect(master); s.start(ctx.currentTime + delay); }); }

  // The air of the place: one long recording at a time, lapped over itself so that the join is not heard.
  function air(name){ airWant = name; if (!live || muted || ctx.state !== 'running') name = ''; if (name === airName) return; airName = name; const tok = ++airTok;
    if (airBus) { const g = airBus; g.gain.setTargetAtTime(0, ctx.currentTime, .7); setTimeout(() => g.disconnect(), 5000); airBus = null; }
    if (airTag) { airTag.pause(); airTag = null; }
    if (!name) return;
    fetchBuf(name).then(b => { if (tok !== airTok) return; if (!b) { airTag = tag(name, AIR, 0, true); return; }
      const bus = ctx.createGain(); bus.gain.value = 0; bus.gain.setTargetAtTime(AIR, ctx.currentTime, 1.2); bus.connect(master); airBus = bus;
      const lap = at => { if (tok !== airTok) return; const s = ctx.createBufferSource(), g = ctx.createGain(), end = at + b.duration; s.buffer = b;
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(1, at + LAP); g.gain.setValueAtTime(1, end - LAP); g.gain.linearRampToValueAtTime(0, end);
        s.connect(g).connect(bus); s.start(at); setTimeout(() => lap(end - LAP), Math.max(0, (end - LAP - ctx.currentTime - 1) * 1000)); };
      lap(ctx.currentTime); }); }

  // Browsers keep an audio context asleep until the reader touches something, and Safari will let it doze off again.
  // So every touch, click and key tries to wake it, and the air begins only once it is truly awake.
  function wake(){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    if (!live) { ctx = new AC(); master = ctx.createGain(); master.gain.value = muted ? 0 : VOL; master.connect(ctx.destination); live = true;
      ctx.onstatechange = () => air(airWant); }
    if (ctx.state !== 'running') { const p = ctx.resume(); if (p && p.then) p.then(() => air(airWant), () => {}); } else air(airWant); }
  function quiet(q){ muted = q; try { localStorage.setItem(KEY, q ? '1' : '0'); } catch (err) {}
    if (!q) wake(); if (master) master.gain.setTargetAtTime(q ? 0 : VOL, ctx.currentTime, .05); air(airWant); }
  return {play, air, wake, quiet, get muted(){ return muted; }};
})();

(() => {
  const page = v => Sound.play('page' + (1 + Math.floor(Math.random() * 3)), v || .8);
  // What announces a paper. Handbills are a leaf turned; anybody else knocks unless named here.
  const ARRIVES = {crowd:['election', 'election96', 'jubilee', 'trafalgar', 'waterloo', 'peace'], mob:['commonRiot', 'ludd', 'crew', 'press'], toll:['gallDies', 'pinchDies'],
    carriage:['dubreuil', 'dubreuilReturns', 'vaneDines', 'vaneBall', 'bath', 'paris', 'elope', 'edmundHome'], shot:['battue']};
  const cueFor = id => { for (const k in ARRIVES) if (ARRIVES[k].includes(id)) return k; return BILLS.has(id) ? 'page' : 'knocker'; };
  const POWDER = new Set(['duel', 'edmundDuel', 'poacher', 'smugglers', 'manTraps']);
  // Rooks in spring and summer, wind in autumn, the fire in winter. A ruined harvest rains from June to Michaelmas.
  const airNow = () => !S ? 'rooks' : S.phase === 'end' || S.season === 3 ? 'fire' : S.season > 0 && WEATHER[S.year] <= .8 ? 'rain' : S.season === 2 ? 'wind' : 'rooks';
  let leaf = -2, paper = '', phase = '', last = '';
  function heard(){ Sound.air(airNow());
    if (!S) { leaf = -2; paper = phase = last = ''; return; }
    if (S.t !== leaf) { if (leaf > -2 && S.phase === 'ledger') { page(); Sound.play('bell', .45, .5); } leaf = S.t; }
    if (S.phase === 'event') { const p = S.t + ':' + S.pending; if (p !== paper) { paper = p; last = S.pending; const c = cueFor(S.pending); if (c === 'page') page(); else Sound.play(c, c === 'crowd' || c === 'mob' ? .6 : .8, .15); } }
    else paper = '';
    if (S.phase !== phase) {
      if (S.phase === 'outcome' && POWDER.has(last) && /\b(fired?|pistols?|shot|gun)\b/i.test(S.outcome.text)) Sound.play('shot', .8, .7);
      if (S.phase === 'undone' && /^town-/.test(S.outcome.cut || '')) Sound.play('carriage', .6, .3);
      if (S.phase === 'end') Sound.play(S.dead ? 'toll' : 'seal', .8, .3);
      phase = S.phase; } }

  const wrap = (name, fn) => { const f = window[name]; if (typeof f === 'function') window[name] = function(){ return fn(() => f.apply(this, arguments)); }; };
  wrap('render', go => { const r = go(); try { heard(); } catch (err) {} return r; });
  wrap('start', go => { const was = S; const r = go(); if (S && S !== was) Sound.play('seal'); return r; });
  wrap('resume', go => { const r = go(); if (S) page(); return r; });
  // A choice that moves money is paid on the table. Any other is written down.
  const paid = go => { const m = S ? S.money : 0, r = go(); Sound.play(S && Math.abs(S.money - m) >= 1 ? 'coins' : 'quill', .7); return r; };
  wrap('choose', paid); wrap('undertake', paid);
  wrap('showTab', go => { page(.5); return go(); }); wrap('showWho', go => { page(.5); return go(); });
  // The small ink buttons: mortgage, works, farms, ventures, society.
  let purse = 0;
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.inkbtn, .lv button')) purse = S ? S.money : 0; }, true);
  document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.inkbtn, .lv button'); if (b && S) Sound.play(Math.abs(S.money - purse) >= 1 ? 'coins' : 'quill', .6); });
  for (const ev of ['pointerdown', 'pointerup', 'mousedown', 'touchend', 'click', 'keydown']) document.addEventListener(ev, Sound.wake, true);
  document.addEventListener('visibilitychange', () => Sound.air(document.hidden ? '' : airNow()));

  // The one control: a word in the corner of the desk.
  const b = document.createElement('button'); b.id = 'hush'; b.type = 'button';
  const show = () => { b.textContent = Sound.muted ? 'Sound off' : 'Sound on'; b.setAttribute('aria-pressed', String(!Sound.muted)); };
  b.onclick = () => { Sound.quiet(!Sound.muted); show(); if (!Sound.muted) Sound.play('bell', .6); }; show();
  const st = document.createElement('style');
  st.textContent = '#hush{position:fixed;top:6px;right:10px;z-index:5;background:none;border:0;padding:4px 6px;cursor:pointer;font-family:var(--caps);font-size:.72rem;letter-spacing:.12em;color:#d9c9a3;opacity:.8}#hush:hover,#hush:focus-visible{opacity:1}#hush[aria-pressed="false"]{text-decoration:line-through}';
  document.head.appendChild(st); document.body.appendChild(b);
  heard();
})();

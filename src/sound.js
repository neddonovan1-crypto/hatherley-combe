/* The sounds of the house. Files are in sound/, their makers in SOUNDS.md.
   Loaded last: it wraps render, start, resume, choose, undertake, showTab and showWho, and alters nothing in them.
   The house is silent until Sound is turned on in the corner of the desk. The choice is remembered. */
const Sound = (() => {
  // Plain audio elements, one to a recording. Safari would not play the same files through the Web Audio API, and plays these.
  const DIR = 'sound/', VOL = .6, AIR = .45, KEY = 'hatherley-quiet';
  const NAMES = ['seal', 'page1', 'page2', 'page3', 'quill', 'coins', 'bell', 'toll', 'rook', 'rooks', 'rain', 'wind', 'fire', 'carriage', 'crowd', 'mob', 'shot', 'knocker', 'knock'];
  let muted = true; try { muted = localStorage.getItem(KEY) !== '0'; } catch (err) {}
  let blessed = false, airName = '', airWant = '', airEl = null;
  const els = {}, tally = {ok:0, bad:0, err:''};
  const el = name => els[name] || (els[name] = Object.assign(new Audio(DIR + name + '.mp3'), {preload:'auto'}));
  const fail = (name, err) => { tally.bad++; tally.err = name + ': ' + (err && err.message || err); };
  // An iPhone ignores the volume of an element and plays everything at full, so there the long airs are left out.
  const fixed = (() => { try { const t = new Audio(); t.volume = .5; return t.volume !== .5; } catch (err) { return true; } })();

  // A browser lets an element play unasked only after it has once been played inside a touch. So at the first touch
  // with sound on, every element is played muted for an instant and stopped. After that they answer to the game.
  function wake(){ if (muted) return; blessed = true;
    for (const n of NAMES) { const a = el(n); if (a.ok || a.asking || a.live) continue; a.asking = true; a.muted = true;
      const done = () => { a.ok = true; a.asking = false; if (!a.live) { a.pause(); try { a.currentTime = 0; } catch (err) {} } a.muted = false; };
      const no = err => { a.asking = false; a.muted = false; fail(n, err); };
      try { const p = a.play(); if (p && p.then) p.then(done, no); else done(); } catch (err) { no(err); } }
    air(airWant); }

  function play(name, vol = 1, delay = 0){ if (muted || !blessed) return;
    const go = () => { if (muted) return; const a = el(name); a.live = true; a.muted = false; a.loop = false; a.volume = Math.min(1, VOL * vol); try { a.currentTime = 0; } catch (err) {}
      try { const p = a.play(); if (p && p.then) p.then(() => { tally.ok++; a.ok = true; }, err => fail(name, err)); } catch (err) { fail(name, err); } };
    if (delay) setTimeout(go, delay * 1000); else go(); }

  // The air of the place: one long recording, looped, eased in and out.
  const ease = (a, to, secs, then) => { clearInterval(a.fade); const from = a.volume, t0 = Date.now();
    a.fade = setInterval(() => { const k = Math.min(1, (Date.now() - t0) / (secs * 1000)); a.volume = Math.max(0, Math.min(1, from + (to - from) * k)); if (k >= 1) { clearInterval(a.fade); if (then) then(); } }, 60); };
  function air(name){ airWant = name; if (!blessed || muted || fixed) name = ''; if (name === airName) return; airName = name;
    if (airEl) { const old = airEl; airEl = null; ease(old, 0, 1, () => old.pause()); }
    if (!name) return;
    const a = el(name); a.live = true; a.muted = false; a.loop = true; a.volume = 0; airEl = a;
    try { const p = a.play(); if (p && p.then) p.then(() => { tally.ok++; }, err => fail(name, err)); } catch (err) { fail(name, err); }
    ease(a, VOL * AIR, 2); }

  function quiet(q){ muted = q; try { localStorage.setItem(KEY, q ? '1' : '0'); } catch (err) {}
    if (q) { air(''); for (const n in els) if (els[n] !== airEl) els[n].pause(); } else wake();
    if (!q) air(airWant); }
  // For when somebody hears nothing: shown when the pointer rests on the control.
  const report = () => !blessed ? 'Sound not yet woken by a touch' : `Plain audio. ${tally.ok} played, ${tally.bad} refused${tally.err ? ' (' + tally.err + ')' : ''}. Air: ${airName || (fixed ? 'left out on this device' : 'none')}`;
  const ring = () => play('bell', .6);
  return {play, air, wake, quiet, report, ring, get muted(){ return muted; }};
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
  for (const ev of ['click', 'keydown', 'touchend']) document.addEventListener(ev, Sound.wake, true);
  document.addEventListener('visibilitychange', () => Sound.air(document.hidden ? '' : airNow()));

  // The one control: a word in the corner of the desk.
  const b = document.createElement('button'); b.id = 'hush'; b.type = 'button';
  const show = () => { b.textContent = Sound.muted ? 'Sound off' : 'Sound on'; b.setAttribute('aria-pressed', String(!Sound.muted)); };
  b.onclick = () => { Sound.quiet(!Sound.muted); show(); if (!Sound.muted) Sound.ring(); }; b.onpointerenter = () => { b.title = Sound.report(); }; show();
  const st = document.createElement('style');
  st.textContent = '#hush{position:fixed;top:6px;right:10px;z-index:5;background:none;border:0;padding:4px 6px;cursor:pointer;font-family:var(--caps);font-size:.72rem;letter-spacing:.12em;color:#d9c9a3;opacity:.8}#hush:hover,#hush:focus-visible{opacity:1}#hush[aria-pressed="false"]{text-decoration:line-through}';
  document.head.appendChild(st); document.body.appendChild(b);
  heard();
})();

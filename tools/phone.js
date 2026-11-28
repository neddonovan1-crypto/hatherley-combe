// Plays whole lives by real taps on an emulated phone, and reports script errors, taps that did nothing, sideways overflow and map tickets lying on one another.
// Lay the site out and serve it first: tools/site.sh <folder>; (cd <folder> && python3 -m http.server 8765). Then: node tools/phone.js "iPhone 13" 2
// Any Playwright device name will do ("iPhone SE", "iPhone 13 landscape", "Pixel 7"). Wants dead 0, overflow samples 0, label overlaps [], errors [].
const {chromium, devices} = require('playwright');
(async () => {
  const b = await chromium.launch();
  const dev = process.argv[2], lives = +process.argv[3];
  const ctx = await b.newContext({...devices[dev]});
  const p = await ctx.newPage();
  const errs = []; const ovl = new Set(); let over = 0, taps = 0, dead = 0;
  p.on('pageerror', e => errs.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push('c: ' + m.text()); });
  await p.goto('http://localhost:8765/'); await p.waitForTimeout(1200);
  const key = () => p.evaluate(() => {
    if (!S) return 'none|' + (typeof OPENAT === 'string' ? OPENAT : '');   // the opening has two plates, and no estate behind either
    const pl = document.querySelector('#plate'), lp = document.getElementById('lastplate');
    return [S.t, S.phase, S.pending, S.used, PLATEUP, SHEET, VIEW, pl ? pl.innerText.length : 0, lp ? lp.hidden : ''].join('|');
  });
  const tap = async sel => {
    const k = await key();
    const els = await p.$$(sel); const vis = [];
    for (const e of els) { if (await e.isVisible() && await e.isEnabled()) vis.push(e); }
    if (!vis.length) return false;
    const e = vis[Math.floor(Math.random() * vis.length)];
    try { await e.tap({timeout: 3000}); }
    catch (x) { errs.push('untappable ' + sel + ' ' + k + ' ' + x.message.split('\n')[0]); dead++; return false; }
    taps++; await p.waitForTimeout(60);
    if (await key() === k) { await p.waitForTimeout(250); if (await key() === k) { dead++; errs.push('dead tap ' + sel + ' at ' + k); } }
    return true;
  };
  const measure = () => p.evaluate(() => {
    const o = document.documentElement.scrollWidth - innerWidth;
    if (VIEW !== 'plan' || SHEET || PLATEUP) return {o, out: []};
    const L = [...document.querySelectorAll('#land .lbl.tag, #land .key')].map(e => { const r = e.getBoundingClientRect(); return {n: e.dataset.k, x: r.x, y: r.y, w: r.width, h: r.height}; });
    const out = [];
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) {
      const a = L[i], c = L[j];
      const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x), oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
      if (ox > 3 && oy > 3) out.push(a.n + '/' + c.n + ' ' + Math.round(ox) + 'x' + Math.round(oy));
    }
    return {o, out};
  });
  for (let L = 0; L < lives; L++) {
    await tap('#keys'); await p.waitForTimeout(400); await tap('#takeit'); await p.waitForTimeout(600);
    for (let i = 0; i < 1500; i++) {
      const s = await p.evaluate(() => S ? {ph: S.phase, up: PLATEUP, view: VIEW, sheet: SHEET} : null);
      if (!s) break;
      if (i % 25 === 0) { const m = await measure(); if (m.o > 0) over++; m.out.forEach(x => ovl.add(x)); }
      if (s.ph === 'end') break;
      if (s.view === 'book') { if (!await tap('#stage .go')) await p.evaluate(() => next()); continue; }
      if (s.up) {
        if (!await tap('#plate .choice')) if (!await tap('#plate .go')) { errs.push('plate with no button ' + await key()); await p.evaluate(() => S.phase === 'event' ? choose(0) : next()); }
        continue;
      }
      if (s.ph === 'undertake' && s.sheet === 'season') { if (!await tap('#sheet .choice')) { errs.push('season sheet no choice'); await p.evaluate(() => undertake(0)); } continue; }
      if (s.sheet) { await tap('#sheet .shut'); continue; }
      if (Math.random() < .06) { await tap('#land .lbl.tag'); continue; }
      if (!await tap('#cart .act')) { errs.push('no act ' + await key()); await p.evaluate(() => next()); }
    }
    const end = await p.evaluate(() => S && [S.t, S.phase, S.year]);
    console.log('life', L, 'ended', end);
    if (end && end[1] === 'end') { await p.waitForTimeout(500); if (!await tap('#lastplate .go')) errs.push('no last plate'); await p.waitForTimeout(300); await tap('#stage .go'); } else { await tap('#cart .wipeask'); await tap('#cart .wipe .yes'); }
    await p.waitForTimeout(400);
    const back = await p.evaluate(() => [S === null, document.querySelector('#plan').hidden, !!document.querySelector('#keys')]);
    if (back.some(x => !x)) errs.push('no opening after the end ' + back);
  }
  console.log(dev, 'taps', taps, 'dead', dead, 'overflow samples', over, 'label overlaps', [...ovl]);
  console.log('errors', [...new Set(errs)].slice(0, 25));
  await b.close();
})();

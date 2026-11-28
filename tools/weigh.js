// Weighs what the page sends for: opens a laid-out site (tools/site.sh) at desk and phone, and counts the files and bytes fetched while the will is read,
// when the estate is taken, and when the first paper is opened. The page itself is counted as a host would send it, gzipped. Usage: node tools/weigh.js <site folder>.
const {chromium} = require('playwright'), http = require('http'), fs = require('fs'), path = require('path'), zlib = require('zlib');
const root = path.resolve(process.argv[2] || '.');
const TYPES = {html:'text/html; charset=utf-8', jpg:'image/jpeg', png:'image/png', webp:'image/webp', avif:'image/avif', mp4:'video/mp4', mp3:'audio/mpeg', ogg:'audio/ogg'};
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])), g = f.endsWith('/') ? f + 'index.html' : f;
  fs.readFile(g, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, {'content-type': TYPES[g.split('.').pop()] || 'application/octet-stream'}); r.end(d); }); });
srv.listen(0, async () => { const url = 'http://127.0.0.1:' + srv.address().port + '/', b = await chromium.launch(), errs = [];
  for (const [tag, o] of [['desk', {viewport:{width:1920, height:1080}}], ['small', {viewport:{width:1366, height:768}}], ['phone', {viewport:{width:390, height:800}, deviceScaleFactor:3, isMobile:true, hasTouch:true}]]) {
    const c = await b.newContext(o), p = await c.newPage(); let n = 0, bytes = 0, miss = [], by = {};
    p.on('pageerror', e => errs.push(tag + ': ' + e.message));
    p.on('response', async r => { if (r.status() === 404) miss.push(r.url()); try { let d = await r.body(); if (/html/.test(r.headers()['content-type'] || '')) d = zlib.gzipSync(d); n++; bytes += d.length; const k = r.url().slice(url.length).split('?')[0].split('/').slice(0, -1).join('/') || 'page'; by[k] = (by[k] || 0) + d.length; } catch (err) {} });
    const say = what => console.log(`${tag.padEnd(5)} ${what.padEnd(22)} ${String(n).padStart(4)} files ${(bytes / 1048576).toFixed(2).padStart(6)} MB`);
    await p.goto(url); await p.waitForTimeout(4000); say('the will is read'); console.log('      ' + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => k + ' ' + Math.round(v / 1024) + 'K').join(', '));
    await p.click('#keys'); await p.waitForTimeout(300); await p.click('#takeit'); await p.waitForTimeout(4000); say('the estate is taken');
    await p.click('#cart .act'); await p.waitForTimeout(600); await p.click('#cart .act'); await p.waitForTimeout(2500); say('the first paper opens');
    if (miss.length) console.log(tag, 'not found:', miss);
    await c.close(); }
  console.log('errors', errs); await b.close(); srv.close(); });

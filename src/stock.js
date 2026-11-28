/* The stock and the traffic on the plan. Each creature is a strip of drawn frames (art/plan/s/<name>-walk.webp, cut by tools/stock/cut.py):
   a walking cycle, then the head going down, then a few frames of grazing. The page moves them; nothing here is a fixed loop.
   Beasts keep to pasture. GRASS is the sheet at 150 by 100, one bit a square, set where there is open grass clear of water, hedge, road and corn (tools/stock/mask.py). */
const GRASS = (() => { const s = atob('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADP/AAAAAAAAAAAAAAAAAAAAD////gAAAAAAAAAAAAAAAAAAI///w8AAAAAAAAAAAAAAAAAAH////gYAAAAAAAAAAAAAAAf/z////zgQAAAAAf/8AAGAAAAf//8///gwwAAAAAH//h3iAAAAI//gf//gf4AAAAAD//3+AAAAAAD+AP//gf+AAAAAD///8AAAAAAAAAP//g//AAAAADn//8AAAAAAAAAA//B//8AAAADD//8AAAAAAAAAAA/A///gAAAAD9+cAAAAAAAAAAAfA///wAAAADg4MAAAAAAAAAAAIAf//4AAYAHAAOAAAAAcAAAAAAAdx/8AB4IcAAP4AAAv/8AAAAAAAA+f8AYOAAAfwAAf//+AAAAAAAAYAAAEcAAAPgAAf///wAAAAAAAAAAAAwAAAAAAAfAP//wAAAAAAAAAAAAAAAAAAAeAH//8AAAAAAAAAAAAAAAAAAAcAD//8AAAAAAAAAAAAAAAAGAAYAD//+AAAAAAAAAAAAAAAAOAAcAD//+AAAAAAAAAAAAAAAAOAAeAD//4AAAAAAAAAAAAAAAAeAAfAH//wAAAAAAAAAAAAAAAAOAAfz//+AAAAAAAAAAAAAAAAAeAAf///8APAAAAAAAAADwAAAAeAAf///4AOAAAAAAAAAGAAAAAAAAf///wAEAAAAAAAAAcAAAAAAAAf///gAAAAAAAAAAAcAAQAAAAAf///gAAAAAAAAAAAAAAMAAAAAf//8AeAAAAAAAAAAAAAMAAAAAY+Z4AMgAAAAAAAAAAAAGAAAAAAcAgAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAP4AAOAAAAAAAAAAAAAAAAAAAAD8AAeAAAAAAAAAAAAAAAAAAAAAGAA+AAAAAAAAAAAAAAAAAAAAAAwP/AGAAAAAAAAAAAAAAAAAAAAH//hAAAAAAAAAAAAAAAAAAAAAAd/gAAAAAAAAAAAAAAAHgAAAAAAHwAAAAAAAAAAAAAAAf4AAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAABGAAB/AAAAAAAAAAAAAAAAAAAB/wADmAAAAAAAAAAAAAAAAAAAB/4AAAAAAAAAAAMAAAAAAAAAAA/8AAAAAAAAAB/+AAAAAAAAAAAf+AAAAAAAAAAG8AAAAAAAAAAAf/AAAAAAAAAAAAAGAAAAAAAAAD/AAAAAAAAAAAAA+AAAAAAAAAB8AAAAAAAAAAAABeAAAAAAAAAAAAAAAAAAAAAAA+OAAAAAAAAAAAAAACAAAAAAAAcAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAIAAAAAP/gAAAAAAAAAAAAAAAA8AAAAAP/4AAAAAAAAAAAAAAAD+AAAAAD/8AAAAAAAeAAAAAAAH8AAAAAB/8AAAAAAB+AAAAAAAH4AAAAAA/8AAAAAAB+AAAAAAAAAAACDsAH8AAAAAAB+AAAAAAAAAAAH/+AA+AAAAAGA+AAAAAAAAAAAH//AAfAAAAAGA+AAAAAAAAAAAH/8AAfgAAAAOAeAAAAAAAAAAAHz4AAPwAAAA4AYAAAAAAAAAADPgAAAH4A/ADAAgAAAAAAAAAADuAAAAD+P/gwAAAAAAAAAAAAAAAAAAAD///2AAAAAAAAAAAAAAAAAAAAB/f/8AACAAAAAAAAAAAAAAAAAAOP4wAAEAAAAAAAAAAAAAAAAAAAHwAAAYAAAAAAAAAAAAAAAAAAADgAADAAAAAAAAAAAAAAAAAAAAAgAAsAAAAAAAAIAAAAAAAAAAAAAAAIAAAAAAAAfgAAAAAAQAAAAAAAAAAAAAAAA/AAAAAAAPwAAAAAAAAAAAAAAA/gAAADAAcgAAAAAYAAAAAAAAA/wAAAHgA4AAwAAD8AAAAAAAAAfwAAAH/twAAfgAH+AAAAAAAAAAwAAAD//wAAEAAB/+AAAAAAAAAIAAAD/8AAAAAAA//gAAAAAAAAEAAAH/4AAAAAAA//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'), a = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; })();
const onGrass = (x, y) => { const c = Math.floor(x * 1.5), r = Math.floor(y); if (c < 0 || c > 149 || r < 0 || r > 99) return false; const i = r * 150 + c; return !!(GRASS[i >> 3] & (128 >> (i & 7))); };
/* n: frames in the strip. walk, down, nib: how many of each. r: height over breadth of one frame. w: breadth of a frame in hundredths of the sheet.
   beat: seconds for one walking cycle. stride: ground covered in a cycle, in breadths of the frame. */
const STRIPS = {
  cow1:{n:21, walk:10, down:5, nib:6, r:74 / 160, w:4.3, beat:1.9, stride:.3},
  cow2:{n:21, walk:10, down:5, nib:6, r:67 / 160, w:4.3, beat:2, stride:.3},
  horse:{n:21, walk:10, down:5, nib:6, r:105 / 160, w:3.7, beat:1.7, stride:.36},
  sheep:{n:19, walk:8, down:5, nib:6, r:59 / 110, w:2.3, beat:1.3, stride:.3},
  coach:{n:8, walk:8, r:118 / 360, w:6.8, beat:.5},
  /* The coach again, as it is seen on a road that runs down the sheet: coming on and going away, at a slant (q, r) and nearly end on (f, a). */
  coachq:{n:8, walk:8, r:199 / 300, w:5.6, beat:.5},
  coachr:{n:8, walk:8, r:212 / 300, w:5.6, beat:.5},
  coachf:{n:8, walk:8, r:347 / 130, w:2.1, beat:.5},
  coacha:{n:8, walk:8, r:345 / 130, w:2.1, beat:.5},
  wagon:{n:10, walk:10, r:108 / 320, w:5.1, beat:1.4}
};
/* Herds. s: the strip. at: the middle of their ground. reach: how far they stray from it. k: how many. on: when they are out. */
const HERDS = [
  {s:'sheep', at:[17, 31], reach:9, k:6, on:() => openCommon()},
  {s:'sheep', at:[9.5, 36.5], reach:5, k:3, on:() => openCommon()},
  {s:'sheep', at:[32, 15.5], reach:8, k:4},
  {s:'sheep', at:[45.5, 17], reach:6, k:3},
  {s:'cow1', at:[59, 68], reach:6, k:1, on:() => S.season < 3},
  {s:'cow2', at:[62, 71], reach:6, k:1, on:() => S.season < 3},
  {s:'cow1', at:[72, 78], reach:6, k:1, on:() => S.season < 3},
  {s:'cow2', at:[47, 73.5], reach:5, k:1, on:() => S.season < 3},
  {s:'horse', at:[48.5, 89.5], reach:5, k:1, on:() => S.season < 3}
];
/* Roads. Each is walked one way, then after a wait the other, and the thing fades at either end where the road leaves the sheet or goes into a yard.
   pts: left, top, in hundredths. grow: breadth at the far end over breadth at the near, for a road coming down the sheet. secs: a journey.
   views: the drawings of the thing. side is drawn travelling left. q comes on down the sheet to the left and r goes away up it to the right, both at about ROAD_SLANT degrees; f comes straight down and a goes straight up.
   Whichever lies nearest the road is shown, and turned the few degrees that remain, so that a carriage always points the way it goes. */
const ROAD_SLANT = 28;
const ROADS = [
  {s:'coach', views:{side:'coach', q:'coachq', r:'coachr', f:'coachf', a:'coacha'}, secs:34, grow:[.5, 1], wait:[14, 50], pts:[[93.6, 19.4], [94.9, 22.4], [94.3, 25.4], [92.2, 28.4], [90.7, 31.6], [90.1, 35.4], [90.5, 39.4], [91.6, 43.4], [93.2, 47.2], [95.6, 50.4]]},
  {s:'wagon', views:{side:'wagon'}, secs:62, grow:[1, 1], wait:[20, 70], pts:[[93.4, 48.9], [88, 50.5], [82, 52], [77, 52.1], [71, 50.4], [68.2, 48.4]]}
];
/* Ground the stock must keep off: whatever has been built or set going, save the pieces that are themselves grass. */
const STOCK_FREE = ['london', 'common', 'sheepwalk', 'meadows', 'drain', 'paddock', 'hall-old', 'hall-front', 'parterre', 'parterre-old', 'carriage', 'carriage-old'];
let STOCK_SHUT = [], STOCK_KEY = '';
const stockOK = (x, y) => onGrass(x, y) && !STOCK_SHUT.some(b => x > b[0] - .6 && x < b[0] + b[2] + .6 && y > b[1] - .6 && y < b[1] + b[3] + .6);
const stockClear = (a, b) => { const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 4); for (let i = 1; i <= n; i++) if (!stockOK(a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n)) return false; return true; };
const STOCK = new Map();
const rnd = (a, b) => a + Math.random() * (b - a);
/* A spot on the herd's ground. The sheet is seen from above and aslant, so the ground is twice as broad as it is deep. */
function stockSpot(h, from){ for (let i = 0; i < 24; i++) { const a = rnd(0, 6.283), d = h.reach * Math.sqrt(Math.random()), p = [h.at[0] + Math.cos(a) * d, h.at[1] + Math.sin(a) * d * .5];
    if (!stockOK(p[0], p[1])) continue;
    if (from && (Math.abs(p[1] - from[1]) > Math.abs(p[0] - from[0]) * .6 || Math.hypot(p[0] - from[0], p[1] - from[1]) < 1.2 || !stockClear(from, p))) continue;
    return p; } return null; }
function stockHTML(calm){ let h = '';
  HERDS.forEach((g, gi) => { if ((g.on && !g.on()) || !ART.has('plan/s/' + g.s + '-walk.webp')) return; for (let i = 0; i < g.k; i++) h += stockEl(g.s, 'h' + gi + '.' + i); });
  ROADS.forEach((g, gi) => { if (!calm && ART.has('plan/s/' + g.s + '-walk.webp')) h += roadEl(g, 'r' + gi); });
  return h; }
/* Each creature has two faces laid one upon the other, looking left and looking right, and only one is shown. Turning it by a transform made some browsers draw the strip afresh, and the beast went out for a moment as it turned. */
const stockEl = (s, id) => { const t = STRIPS[s], face = `style="background-image:url(${artAt('plan/s/' + s + '-walk.webp')});background-size:${t.n * 100}% 100%"`; return `<i class="stock" data-b="${id}" style="aspect-ratio:${(1 / t.r).toFixed(3)}"><b ${face}></b><b class="r" ${face}></b></i>`; };
const stockFace = (s, t) => `style="background-image:url(${artAt('plan/s/' + s + '-walk.webp')});background-size:${t.n * 100}% 100%"`;
const roadViews = g => Object.values(g.views).filter(s => STRIPS[s] && ART.has('plan/s/' + s + '-walk.webp'));
const roadEl = (g, id) => `<i class="stock road" data-b="${id}">${roadViews(g).map(s => `<b data-s="${s}" ${stockFace(s, STRIPS[s])}></b><b class="r" data-s="${s}" ${stockFace(s, STRIPS[s])}></b>`).join('')}</i>`;
/* Which drawing suits a heading, whether it is to be shown in the glass, and how far it must be turned. vx, vy: the way it goes across the sheet, right and down. */
function roadView(g, vx, vy){ const have = roadViews(g), steep = Math.atan2(Math.abs(vy), Math.abs(vx)) * 57.2958, right = vx > 0, down = vy > 0, turn = (down ? 1 : -1) * (right ? 1 : -1);
  const end = down ? g.views.f : g.views.a, slant = down ? g.views.q : g.views.r;
  if (steep > 52 && have.includes(end)) return {s:end, flip:false, rot:(90 - steep) * (down ? -1 : 1) * (right ? 1 : -1), foot:56};
  if (steep > 18 && have.includes(slant)) return {s:slant, flip:down ? right : !right, rot:Math.max(-24, Math.min(24, steep - ROAD_SLANT)) * turn, foot:74};
  return {s:g.views.side, flip:right, rot:Math.min(steep, 20) * turn, foot:94}; }
function roadShow(el, v, x, y, frame, size, fade){ const t = STRIPS[v.s], st = el.style;
  st.left = x.toFixed(2) + '%'; st.top = y.toFixed(2) + '%'; st.width = (t.w * size).toFixed(2) + '%'; st.aspectRatio = (1 / t.r).toFixed(3); st.translate = '-50% -' + v.foot + '%'; st.rotate = v.rot.toFixed(1) + 'deg';
  const at = (t.n > 1 ? frame / (t.n - 1) * 100 : 0) + '%';
  for (const b of el.children) { const on = b.dataset.s === v.s && b.classList.contains('r') === v.flip; if (on) b.style.backgroundPositionX = at; b.style.opacity = on ? 1 : 0; }
  st.opacity = fade; st.visibility = 'visible'; }
const stockFar = y => .74 + y * .0042;
function stockShow(el, t, x, y, frame, left, size, fade){ const st = el.style;
  st.left = x.toFixed(2) + '%'; st.top = y.toFixed(2) + '%'; st.width = (t.w * size).toFixed(2) + '%';
  const at = (t.n > 1 ? frame / (t.n - 1) * 100 : 0) + '%', a = el.firstChild.style, b = el.lastChild.style;
  a.backgroundPositionX = at; b.backgroundPositionX = at; a.opacity = left ? 1 : 0; b.opacity = left ? 0 : 1; st.opacity = fade; st.visibility = 'visible'; }
/* One beast: it grazes, lifts its head, walks to another spot on its own ground, puts its head down again. */
function stockBeast(o, h, t, dt){
  if (!o.p || (o.key !== STOCK_KEY && !stockOK(o.p[0], o.p[1]))) { o.p = stockSpot(h); if (!o.p) return false; o.mode = 'nib'; o.t = rnd(0, 20); o.c = rnd(0, 9); o.left = Math.random() < .5; }
  o.key = STOCK_KEY; o.c += dt; o.t -= dt;
  if (o.mode === 'nib') { if (o.t <= 0) { const to = stockSpot(h, o.p); if (to) { o.to = to; o.mode = 'up'; o.c = 0; } else o.t = rnd(4, 10); }
    const k = Math.floor(o.c * 2.6) % (t.nib * 2 - 2); o.f = t.walk + t.down + (k < t.nib ? k : t.nib * 2 - 2 - k); }
  else if (o.mode === 'up') { const k = Math.floor(o.c * 7); if (k >= t.down) { o.mode = 'walk'; o.c = 0; o.left = o.to[0] < o.p[0]; o.f = 0; } else o.f = t.walk + t.down - 1 - k; }
  else if (o.mode === 'down') { const k = Math.floor(o.c * 7); if (k >= t.down) { o.mode = 'nib'; o.c = 0; o.t = rnd(7, 30); } else o.f = t.walk + k; }
  else { const sp = t.w * stockFar(o.p[1]) * t.stride / t.beat, dx = o.to[0] - o.p[0], dy = o.to[1] - o.p[1], d = Math.hypot(dx, dy), go = sp * dt;
    if (d <= go) { o.p = o.to; o.mode = 'down'; o.c = 0; } else { o.p = [o.p[0] + dx / d * go, o.p[1] + dy / d * go]; }
    o.f = Math.floor(o.c / t.beat * t.walk) % t.walk; }
  return true; }
/* A carriage: along the road, a wait out of sight, and back the way it came. */
function stockRoad(o, g, t, dt){
  if (!o.len) { o.seg = []; o.len = 0; for (let i = 1; i < g.pts.length; i++) { const d = Math.hypot(g.pts[i][0] - g.pts[i - 1][0], (g.pts[i][1] - g.pts[i - 1][1]) * 1.5); o.seg.push(d); o.len += d; } o.u = rnd(0, 1); o.back = Math.random() < .5; o.wait = 0; o.c = 0; }
  if (o.wait > 0) { o.wait -= dt; return false; }
  o.c += dt; o.u += dt / g.secs;
  if (o.u >= 1) { o.u = 0; o.v = null; o.back = !o.back; o.wait = rnd(g.wait[0], g.wait[1]); return false; }
  const u = o.back ? 1 - o.u : o.u; let d = u * o.len, i = 0; while (i < o.seg.length - 1 && d > o.seg[i]) d -= o.seg[i++];
  const a = g.pts[i], b = g.pts[i + 1], k = o.seg[i] ? d / o.seg[i] : 0;
  o.p = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; o.size = g.grow[0] + (g.grow[1] - g.grow[0]) * u;
  /* its heading is taken a little before and a little behind, so that it comes round a bend by degrees */
  const p0 = roadAt(o, g, u * o.len - 1.3), p1 = roadAt(o, g, u * o.len + 1.3), way = o.back ? -1 : 1, v = roadView(g, (p1[0] - p0[0]) * 1.5 * way, (p1[1] - p0[1]) * way);
  /* and it does not change one drawing for another, and back, upon a road that lies between the two */
  if (!o.v || o.v.s === v.s) { o.v = v; o.hold = 0; } else if ((o.hold += dt) > .7) { o.v = v; o.hold = 0; }
  o.fade = Math.min(1, o.u / .06, (1 - o.u) / .06); o.left = !o.back; o.f = Math.floor(o.c / t.beat * t.walk) % t.walk; return true; }
function roadAt(o, g, d){ d = Math.max(0, Math.min(o.len, d)); let i = 0; while (i < o.seg.length - 1 && d > o.seg[i]) d -= o.seg[i++];
  const a = g.pts[i], b = g.pts[i + 1], k = o.seg[i] ? Math.min(1, d / o.seg[i]) : 0; return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
let STOCK_AT = 0;
function stockTick(now){ requestAnimationFrame(stockTick);
  const dt = Math.min(.5, (now - STOCK_AT) / 1000); if (dt < .08) return; STOCK_AT = now; stockStep(dt); }
/* Twelve times a second is enough for beasts this small, and suits a drawing. */
function stockStep(dt){
  if (document.hidden || typeof S === 'undefined' || !S) return; const els = document.querySelectorAll('#land .stock'); if (!els.length) return;
  const key = piecesOn().join(); if (key !== STOCK_KEY) { STOCK_KEY = key; STOCK_SHUT = key.split(',').filter(id => PLAN_BOX[id] && !STOCK_FREE.includes(id)).map(id => PLAN_BOX[id]); }
  const calm = CALM();
  for (const el of els) { const id = el.dataset.b, road = id[0] === 'r', g = (road ? ROADS : HERDS)[parseInt(id.slice(1))], t = STRIPS[g.s]; let o = STOCK.get(id); if (!o) STOCK.set(id, o = {});
    const up = road ? stockRoad(o, g, t, dt) : stockBeast(o, g, t, calm ? 0 : dt);
    if (!up) { el.style.visibility = 'hidden'; continue; }
    if (road) roadShow(el, o.v, o.p[0], o.p[1], o.f || 0, o.size, o.fade); else stockShow(el, t, o.p[0], o.p[1], o.f || 0, o.left, stockFar(o.p[1]), 1); } }
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(stockTick);

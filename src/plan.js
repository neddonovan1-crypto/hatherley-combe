/* The plan of the estate. Between quarter days the squire is out of the book and on his land: the places on the plan are the menu,
   and whatever happens to him is struck off as a numbered plate. The book (ui.js) is opened on quarter day and at the end. */
let VIEW = 'book', SHEET = '', PLATEUP = false, PROGRESS = -1, PSTEP = '', SEC = '', ROUND = false, CALLKEY = '', CALLAT = '';
const isBuilt = id => typeof worksList === 'function' && worksList().some(w => w.id === id && w.state === 'done');
const isLive = id => typeof venturesList === 'function' && venturesList().some(v => v.id === id && v.state === 'inHand');
const isKept = id => typeof societyList === 'function' && societyList().some(v => v.id === id && v.state === 'inHand');
const footing = () => typeof establishment === 'function' ? establishment().id : 'plain';
const farmAt = id => (typeof farmsList === 'function' && farmsList().some(f => f.id === id)) || (typeof farmsForSale === 'function' && farmsForSale().some(f => f.id === id));

/* n: the name lettered on the plan. at: where the lettering sits, in hundredths of the sheet. pic: the aquatint shown on the place's paper. */
const PLACES = {
  hall:{n:'Hatherley Hall', at:[50.5, 58.6], pic:() => isBuilt('front') ? 'places/hall-new-front' : 'frontispiece'},
  home:{n:'The Home Farm', at:[67, 45], pic:() => 'places/estate-office'},
  longbarrow:{n:'Long Barrow', at:[42.5, 27.2], farm:'longbarrow', pic:() => 'places/long-barrow-farm'},
  kennet:{n:'Kennet Bottom', at:[75.5, 68.4], farm:'kennet', pic:() => isBuilt('drain') ? 'places/kennet-bottom-drained' : 'places/kennet-bottom-flood'},
  church:{n:'Church Farm', at:[33.5, 68.6], farm:'church', pic:() => 'places/twelve-acres'},
  vestry:{n:'The Church', at:[21.5, 40.6], pic:() => 'places/church-and-vestry'},
  common:{n:'The Common', at:[15, 33.5], farm:'commonpiece', pic:() => farmAt('commonpiece') ? 'places/common-piece' : F('enclosed') ? 'places/common-enclosed' : 'places/common'},
  mill:{n:'The Mill', at:[65, 80.5], pic:() => isBuilt('mill') ? 'places/mill-new' : 'places/mill-old'},
  lane:{n:'Kintbury Lane', at:[8.6, 51.2], pic:() => isBuilt('road') ? 'places/kintbury-lane-mended' : 'places/kintbury-lane'},
  copse:{n:'Cuckoo Copse', at:[75.5, 46.4], pic:() => 'places/cuckoo-copse'},
  hanger:{n:'Hanger Wood', at:[61, 21.6], pic:() => 'places/gallows-piece'},
  down:{n:'The Down', at:[48.6, 11.4], pic:() => 'places/down-beacon'},
  castle:{n:'Cullerne Castle', at:[88.6, 14.4], pic:() => 'places/cullerne-castle'},
  london:{n:'London', at:[77.5, 6.6], pic:() => 'places/london-season'},
  wyvern:{n:'Wyvern', at:[93.2, 41.2], pic:() => 'places/market-place'},
  turnpike:{n:'The London Road', at:[92.6, 27], pic:() => 'places/milestone'},
  rooksnest:{n:'Rooksnest', at:[66, 26.2], farm:'rooksnest', if:() => farmAt('rooksnest'), pic:() => 'places/rooksnest-farm'},
  coldharbour:{n:'Coldharbour', at:[82.5, 22.6], farm:'coldharbour', if:() => farmAt('coldharbour'), pic:() => 'places/coldharbour-farm'},
  withymead:{n:'Withy Mead', at:[29, 79], farm:'withymead', if:() => farmAt('withymead'), pic:() => 'places/withy-mead'},
  maddle:{n:'Maddle Farm', at:[11.5, 22.8], farm:'maddle', if:() => farmAt('maddle'), pic:() => 'places/maddle-farm'},
  starveall:{n:'Starveall', at:[88, 58.6], farm:'starveall', if:() => farmAt('starveall'), pic:() => 'places/starveall'}
};
/* Every work, venture, undertaking and person belongs to one place. What is not named here is found at the Hall, or for ventures at Wyvern. */
const WORK_AT = {drain:'kennet', meadows:'kennet', fourcourse:'home', mill:'mill', cottages:'lane', road:'lane', school:'vestry', oaks:'hanger', timber:'hanger', barns:'church', chalk:'down', enclosure:'common', bells:'vestry', churchroof:'vestry', pew:'vestry'};
const VENT_AT = {plough:'longbarrow', merino:'down', thresher:'home', peat:'kennet', brickkiln:'kennet', spa:'hall', turnpike:'turnpike', racecourse:'down', telegraph:'down', tithes:'vestry'};
const UNDER_AT = {ride:'lane', sessions:'wyvern', town:'london'};
const LIVES_AT = {gall:'vestry', oakes:'vestry', cullerne:'castle', pryor:'common', thorne:'longbarrow', vane:'wyvern', hartopp:'wyvern', pinch:'turnpike', dubreuil:'turnpike'};
const COUNTY_LOTS = new Set(['cup', 'harriers', 'deputy']);
const workAt = id => WORK_AT[id] || 'hall', ventAt = id => VENT_AT[id] || 'wyvern', underAt = id => UNDER_AT[id] || 'hall', livesAt = id => LIVES_AT[id] || 'hall';
const forSale = id => typeof farmsForSale === 'function' && farmsForSale().some(f => f.id === id);
/* Whether a place has any paper to show. A place with none is only lettering on the sheet. */
function placeHas(id){ const p = PLACES[id]; if (id === 'hall' || id === 'wyvern' || id === 'london') return true; if (p.farm && farmAt(p.farm)) return true;
  if (S.phase === 'undertake' && undertakingOptions().some(u => underAt(u.id) === id)) return true;
  if (typeof worksList === 'function' && worksList().some(w => workAt(w.id) === id)) return true;
  if (id === 'hanger' && typeof creditList === 'function' && creditList().some(c => c.id === 'timber')) return true;
  if (typeof venturesList === 'function' && venturesList().some(v => ventAt(v.id) === id)) return true;
  return Object.keys(S.chars).some(k => S.chars[k].met && PEOPLE[k] && livesAt(k) === id); }
const placeOn = id => { const p = PLACES[id]; return p && (!p.if || p.if()); };
const pane = () => innerWidth <= 1080 || innerWidth < innerHeight;

/* Where the business of the quarter is to be found. A printed notice is posted in the town. A name in the title settles it; then where the caller lives; then the first place named. */
const SIGNS = [[/Kennet/, 'kennet'], [/Long Barrow/, 'longbarrow'], [/Church Farm/, 'church'], [/Starveall/, 'starveall'], [/\bmill(er)?\b/i, 'mill'], [/\bcommon\b|inclosure/i, 'common'], [/copse|poach|\bhares?\b|pheasant|keeper|snare/i, 'copse'],
  [/beacon|\bdowns?\b/i, 'down'], [/Cullerne Castle|the Castle/, 'castle'], [/vestry|church|vicar|tithe|sermon/i, 'vestry'], [/Wyvern|market|the George|\bbank\b|Sessions|the bench|hustings/i, 'wyvern'],
  [/London|turnpike|\bcoach\b|Bath\b|Reading|the mail/i, 'turnpike'], [/cottage|Kintbury|\blane\b/i, 'lane'], [/\bwoods?\b|timber|\boaks?\b/i, 'hanger'], [/home farm|stackyard|\bricks?\b|thresh/i, 'home']];
function eventPlace(e){ const k = S.t + ':' + e.id; if (k === CALLKEY) return CALLAT; CALLKEY = k;
  const hit = t => { for (const [re, at] of SIGNS) if (re.test(t) && placeOn(at)) return at; return ''; };
  if (BILLS.has(e.id)) return CALLAT = 'wyvern';
  const text = e.text(), who = whoOf(e.title + ' ' + text);
  return CALLAT = hit(e.title) || (who && livesAt(who) !== 'hall' ? livesAt(who) : '') || hit(text.slice(0, 320)) || 'hall'; }

/* ---------- which view is up ---------- */
function planSync(){ if (!S) { VIEW = 'book'; SHEET = ''; PLATEUP = false; PROGRESS = -1; PSTEP = ''; return; }
  if (!S.plates) S.plates = [];
  const k = S.t + ':' + S.phase + ':' + S.pending; if (k === PSTEP) return; PSTEP = k;
  VIEW = (S.phase === 'ledger' && S.dead) || S.phase === 'end' ? 'book' : 'plan'; PLATEUP = S.phase === 'outcome' || S.phase === 'undone'; PROGRESS = -1; ROUND = false;
  if (PLATEUP || VIEW === 'book') { SHEET = ''; WHO = ''; }
  if (PLATEUP) strike(); }
function shutBook(){ VIEW = 'plan'; WHO = ''; render(); }
function openBook(t){ VIEW = 'book'; SHEET = ''; WHO = ''; TAB = t || 'accounts'; LEAFUP = !t; render(); window.scrollTo({top:0}); }
function goPlace(id){ SHEET = SHEET === id && !WHO ? '' : id; WHO = ''; SEC = ''; ROUND = false; drawPlan(); if (SHEET && PLACES[id]) showOnPlan(id); }
function shutSheet(){ SHEET = ''; WHO = ''; drawPlan(); }
function callOn(){ PLATEUP = true; SHEET = ''; WHO = ''; drawPlan(); }
function plateDown(){ PLATEUP = false; drawPlan(); }
function showProgress(i){ PROGRESS = i === undefined ? Math.max(0, S.plates.length - 1) : i; drawPlate(); }
function shutProgress(){ PROGRESS = -1; drawPlate(); }
function showOnPlan(id){ if (!pane()) return; const w = $('landwrap'), l = $('land'), p = PLACES[id]; requestAnimationFrame(() => w.scrollTo({left:l.offsetWidth * p.at[0] / 100 - w.clientWidth / 2, behavior:'smooth'})); }

/* ---------- the plates ---------- */
const eventCut = e => (e.cut && artURL('events/' + e.cut()) && 'events/' + e.cut()) || (artURL('events/' + e.id) && 'events/' + e.id) || '';
const placeCut = at => { const p = PLACES[at]; return (p && p.pic && artURL(p.pic()) && p.pic()) || 'seasons/' + S.season; };
/* An outcome is struck off once, with its number, and kept for the Progress. */
function strike(){ const key = S.t + ':' + S.phase; if (S.plates.length && S.plates[S.plates.length - 1].key === key) return;
  const o = S.outcome, j = S.journal[0] || {}, under = S.phase === 'undone';
  const src = under ? (o.cut && artURL('undertakings/' + o.cut) ? 'undertakings/' + o.cut : placeCut('hall')) : (S.plateCut || placeCut('hall'));
  S.plates.push({key, title:o.title, src, did:j.did || '', pub:quarterDay(), say:sayOf(o.text)}); delete S.plateCut; save(); }
const imprint = pub => `Publish’d as the Act directs, ${esc(pub)}`;
/* The words in the balloon are the first thing said aloud in the text, cut to its first sentence if it runs long. Nothing is written for it. */
function sayOf(text){ const m = /“([^”]{8,})”/.exec(String(text || '').replace(/<[^>]+>/g, '')); if (!m) return ''; let q = m[1].trim();
  if (q.length > 96) { const cut = /^(.{12,96}?[.!?])(\s|$)/.exec(q); if (!cut) return ''; q = cut[1]; }
  return q.replace(/,$/, '.'); }
/* The balloon issues from the speaker's mouth. SAY_AT holds where that is on each cut, in hundredths; a cut with nobody on it gets no balloon. */
function balloonHTML(src, say){ const at = say && ART.has('ui/balloon.png') && typeof SAY_AT === 'object' ? SAY_AT[src] : null; if (!at) return '';
  const [mx, my] = at, k = 497 / 900 * 1.5, w = Math.max(36, Math.min(42, (my - 3) / k)), h = w * k, flip = mx > 56;
  const left = flip ? Math.max(1, mx - 1.5 - w) : Math.min(99 - w, mx + 1.5), top = Math.max(1, my - 1.5 - h);
  return `<q class="balloon${flip ? ' flip' : ''}" style="left:${left.toFixed(1)}%;top:${top.toFixed(1)}%;width:${w.toFixed(1)}%"><span>${esc(say)}</span></q>`; }
function printHTML(n, src, title, pub, say){ return `<figure class="print"><div class="mark"><span class="pn">Plate ${n}</span><div class="cutwrap">${pic(src, title)}${balloonHTML(src, say)}</div><figcaption><b>${esc(title)}</b><small>${imprint(pub)}</small></figcaption></div></figure>`; }
function plateViewHTML(){
  if (S.phase === 'event') { const e = byId(S.pending), bill = BILLS.has(e.id), text = e.text(), who = bill ? null : whoOf(e.title + ' ' + text), cs = e.choices.filter(c => !c.if || c.if());
    const src = eventCut(e) || placeCut(eventPlace(e)); S.plateCut = src;
    return `${printHTML(S.plates.length + 1, src, e.title, quarterDay(), sayOf(text))}
      <div class="pside"><article class="sheet${bill ? ' bill' : ''}">${who ? `<div class="from">${medal(who)}<p class="kicker">${esc(stamp())}. ${esc(PEOPLE[who].name)}</p></div>` : `<p class="kicker">${esc(stamp())}</p>`}<div class="prose">${paras(text)}</div></article>
      <div class="answer"><p class="inhand"><span>Your purse <b class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</b></span><span>Outstanding mortgage <b class="neg">${fmt(S.mortgage)}</b></span><button class="quiet" onclick="plateDown()">Look over the plan</button></p>
      <div class="choices">${cs.map((c, i) => `<button class="choice" onclick="choose(${i})"><span>${esc(lab(c))}</span>${noteOf(c)}</button>`).join('')}</div></div></div>`; }
  const o = S.outcome, p = S.plates[S.plates.length - 1] || {src:placeCut('hall'), pub:quarterDay()};
  return `${printHTML(S.plates.length, p.src, o.title, p.pub, p.say)}
    <div class="pside"><article class="sheet came"><p class="kicker">${esc(stamp())}</p><div class="prose lead">${paras(o.text)}</div>
      ${o.d.length ? `<ul class="deltas">${o.d.map(([t, up]) => `<li class="${up ? 'up' : 'down'}">${esc(t)}</li>`).join('')}</ul>` : ''}</article>
    <div class="answer"><div class="row"><button class="go" onclick="next()"><span>${S.dead ? 'And then' : S.phase === 'undone' ? (S.t === 83 ? 'Close the books' : 'Turn the page') : 'Carry on'}</span></button></div></div></div>`; }
/* The Progress: every plate struck so far, a dozen to the leaf, and any one of them taken up to look at. */
function progressHTML(){ const P = S.plates, i = Math.max(0, Math.min(P.length - 1, PROGRESS)), per = 8, leaf = Math.floor(i / per), from = leaf * per, leaves = Math.ceil(P.length / per), p = P[i];
  if (!p) return `<div class="progress"><h2>The Progress</h2><p class="fine">No plate is struck yet.</p><button class="inkbtn" onclick="shutProgress()">Put them away</button></div>`;
  return `<div class="progress">${printHTML(i + 1, p.src, p.title, p.pub, p.say)}
    <div class="pside"><h2>${esc(S.name)}, His Progress</h2><p class="did">${esc(p.did)}</p>
      <div class="thumbs">${P.slice(from, from + per).map((q, k) => `<button aria-pressed="${from + k === i}" onclick="showProgress(${from + k})">${pic(q.src, q.title)}<span>${from + k + 1}</span></button>`).join('')}</div>
      <p class="leafs">${leaves > 1 ? `<button class="quiet" onclick="showProgress(${Math.max(0, from - per)})" ${leaf ? '' : 'disabled'}>Earlier</button><span>${from + 1} to ${Math.min(P.length, from + per)} of ${P.length}</span><button class="quiet" onclick="showProgress(${Math.min(P.length - 1, from + per)})" ${leaf < leaves - 1 ? '' : 'disabled'}>Later</button>` : `<span>${P.length} of 84</span>`}</p>
      <button class="inkbtn" onclick="shutProgress()">Put them away</button></div></div>`; }
function drawPlate(){ const el = $('plate'), up = S && (PROGRESS >= 0 || (VIEW === 'plan' && PLATEUP && S.phase !== 'undertake'));
  el.hidden = !up; document.body.classList.toggle('plateup', !!up); if (!up) { el.innerHTML = ''; return; }
  const key = PROGRESS >= 0 ? 'p' : PSTEP;
  el.className = PROGRESS >= 0 ? 'gallery' : S.phase === 'event' ? 'asks' : 'tells';
  el.innerHTML = `<div class="pcard">${PROGRESS >= 0 ? progressHTML() : plateViewHTML()}</div>`;
  if (el.dataset.key !== key) { el.dataset.key = key; el.scrollTop = 0; const s = el.querySelector('.pside'); if (s) s.scrollTop = 0; const b = el.querySelector('.choice, .go'); if (b) b.focus({preventScroll:true}); } }

/* ---------- the sheet of the plan ---------- */
/* The pieces drawn on over the base sheet: what has been built, what is ventured, how the house is kept, and the soldiers in war time. */
function piecesOn(){ const on = [], y = S.year, est = footing();
  on.push('london');
  if (F('enclosed')) on.push('common');
  for (const id of ['drain', 'fourcourse', 'mill', 'cottages', 'school', 'road', 'pinery', 'oaks', 'icehouse', 'meadows', 'barns', 'chalk']) if (isBuilt(id)) on.push(id);
  for (const id of ['plough', 'merino', 'peat', 'thresher', 'brickkiln', 'malthouse', 'spa', 'turnpike', 'racecourse', 'telegraph']) if (isLive(id)) on.push(id);
  if (isLive('merino')) on.push('sheepwalk');
  if (isKept('hunters')) on.push('paddock'); if (isKept('harriers')) on.push('kennels');
  if (est === 'splendid') on.push('parterre'); if (isKept('chariot') || est === 'handsome' || est === 'splendid') on.push('carriage');
  if (y < 1802 || (y >= 1803 && y <= 1813) || (y === 1815 && S.season < 2)) on.push('camp');
  if (F('volunteers') && !F('enclosed')) on.push('butts');
  on.push(isBuilt('front') ? 'hall-front' : 'hall-old'); const lay = Object.keys(PLAN_BOX); return on.sort((a, b) => lay.indexOf(a) - lay.indexOf(b)); }
const pieceURL = id => { const q = S.season; for (const p of ['plan/f/' + id + '-' + q, 'plan/f/' + id, 'plan/' + id + '-' + q, 'plan/' + id.replace('hall-', '') + '-' + q]) { const u = artURL(p); if (u) return u; } return ''; };
const armsOf = () => isKept('baronet') ? 'baronet' : isKept('knight') ? 'knight' : 'esquire';
/* The sheet is laid in three layers, each redrawn only when its own contents change, so that the moving things do not start again at every touch. */
const CALM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
function landArtHTML(){ const q = S.season;
  const pieces = piecesOn().map(id => { const u = pieceURL(id), b = PLAN_BOX[id]; return u && b ? `<img class="piece" src="${u}" alt="" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%" onerror="this.remove()">` : ''; }).join('');
  return `<img class="base" src="${artURL('plan/' + q)}" alt="A plan of the manor of Hatherley Combe" draggable="false">${pieces}`; }
/* Stock and traffic. s: the drawing. at: where its feet stand. w: its breadth in hundredths of the sheet. f: faces right. go: how it moves. */
const BEASTS = [
  {s:'sheep5', at:[19.5, 28], w:3.5, go:'graze', on:() => openCommon()},
  {s:'shepherd', at:[23, 27.4], w:2, on:() => openCommon()},
  {s:'sheep3', at:[9.5, 37.5], w:2.7, f:1, go:'graze', on:() => openCommon()},
  {s:'sheep5', at:[33, 17.2], w:2.6, f:1, go:'graze'},
  {s:'sheep3', at:[44.5, 21.6], w:2.1, go:'graze'},
  {s:'cow1', at:[79, 78.4], w:2.6, go:'graze', on:() => S.season < 3},
  {s:'cow2', at:[83.6, 80.4], w:2.6, f:1, go:'graze', on:() => S.season < 3},
  {s:'cow1', at:[62.6, 70.6], w:2.4, f:1, go:'graze', on:() => S.season < 3},
  {s:'horse', at:[74.5, 34.6], w:2.4, go:'graze', on:() => S.season < 3},
  {s:'boat', at:[73, 86], w:3.7, go:'drift', on:() => S.season < 3},
  {s:'coach', at:[90.3, 37], w:4.8, go:'coach'},
  {s:'wagon', at:[80, 51.7], w:4.3, go:'wagon'}
];
const openCommon = () => !F('enclosed') && !farmAt('commonpiece');
function landMotHTML(){ const calm = CALM();
  /* Two small loops laid on in multiply: the rooks over the park, who leave when the new front goes up, and the smoke of the Hall chimneys. */
  const moving = calm ? '' : ['smoke'].concat(isBuilt('front') ? [] : ['rooks']).map(id => { const b = PLAN_BOX[id]; return b && ART.has('plan/' + id + '.mp4') ? `<video class="mot" src="art/plan/${id}.mp4" autoplay muted loop playsinline disablepictureinpicture style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%"></video>` : ''; }).join('');
  /* The mill wheel is a drawing turned by the page, laid over the wheel on the sheet. The new mill has its own wheel in another place, so it stops. */
  const wheel = ART.has('plan/wheel.webp') && !isBuilt('mill') ? `<i class="wheel${calm ? ' calm' : ''}"><img src="art/plan/wheel.webp" alt=""></i>` : '';
  const beasts = BEASTS.map((b, i) => (b.on && !b.on()) || !ART.has('plan/s/' + b.s + '.webp') ? '' : `<img class="beast${b.go && !calm ? ' ' + b.go : ''}" src="art/plan/s/${b.s}.webp" alt="" style="left:${b.at[0]}%;top:${b.at[1]}%;width:${b.w}%;--f:${b.f ? -1 : 1};animation-delay:-${(i * 7.3) % 40}s;animation-duration:${b.go === 'graze' ? 38 + (i * 11) % 30 + 's' : ''}">`).join('');
  return wheel + beasts + moving; }
function landLblHTML(){
  const arms = artURL('arms/' + armsOf());
  const caller = S.phase === 'event' && !PLATEUP ? eventPlace(byId(S.pending)) : '';
  const free = S.phase === 'undertake' ? new Set(undertakingOptions().map(u => underAt(u.id))) : new Set();
  const labels = Object.keys(PLACES).filter(placeOn).map(id => { const p = PLACES[id];
    if (caller !== id && !placeHas(id)) return `<span class="lbl mute" style="left:${p.at[0]}%;top:${p.at[1]}%"><span>${esc(p.n)}</span></span>`;
    return `<button class="lbl tag${SHEET === id ? ' on' : ''}${caller === id ? ' called' : ''}" style="left:${p.at[0]}%;top:${p.at[1]}%" ${caller === id ? 'onclick="callOn()"' : `onclick="goPlace('${id}')"`}>${caller === id ? `<i class="fist"><img src="art/plan/hand.webp" alt="You are wanted here"></i>` : free.has(id) ? `<i class="stir">${pic('icons/ride', '')}</i>` : ''}${p.farm && forSale(p.farm) ? '<em>For sale</em>' : ''}<span>${esc(p.n)}</span></button>`; }).join('');
  return `${arms ? `<img class="arms ${armsOf()}" src="${arms}" alt="The arms of ${esc(S.sur || 'the family')}">` : ''}${labels}`; }

const SEASON_ICON = ['lady-day', 'midsummer', 'michaelmas', 'christmas'];
function cueHTML(){ const cue = (line, label, act) => `<div class="next"><p>${line}</p><button class="act" onclick="${act}"><span>${label}</span></button></div>`;
  if (S.phase === 'ledger') { let net = 0; for (const [, a] of S.ledger) net += a;
    return cue(`${esc(QUARTER[S.season])} account: ${net ? amt(net, net) : fmt(0)}`, 'Begin the quarter', 'next()'); }
  if (S.phase === 'event') { const e = byId(S.pending), id = eventPlace(e), at = PLACES[id].n.replace(/^The /, 'the '), bill = BILLS.has(e.id);
    return cue(bill ? `A notice is posted at ${esc(at)}.` : `You are wanted at ${esc(at)}.`, bill ? 'Read the notice' : id === 'hall' ? 'Go in' : `Go to ${esc(at)}`, 'callOn()'); }
  if (S.phase === 'undertake') return cue('The season is yours.', 'Choose its business', "goPlace('season')");
  return ''; }
function cartHTML(){ const vig = (icon, label, v, words) => `<div class="vig${v < 40 ? ' low' : ''}">${pic('icons/' + icon, '')}<span>${label}</span><b>${esc(band(v, words))}</b><i><u style="width:${Math.max(0, Math.min(100, v))}%"></u></i></div>`;
  return `<div class="day">${pic('icons/' + SEASON_ICON[S.season], '')}<b>${esc(QUARTER[S.season])}</b><span>${S.year} · fo. ${Math.min(S.t + 1, 84)} of 84</span></div>
    <div class="purse"><span>Your purse</span><b class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</b><span>Outstanding mortgage <i>${fmt(S.mortgage)}</i></span></div>
    <div class="vigs">${vig('standing', 'Standing', S.standing, STANDING_W)}${vig('goodwill', 'Goodwill', S.goodwill, GOODWILL_W)}${vig('household', 'Household', S.family, FAMILY_W)}</div>
    ${cueHTML()}
    <div class="foot"><button onclick="openBook()">The ledger</button><button onclick="showProgress()" ${S.plates.length ? '' : 'disabled'}>The Progress${S.plates.length ? ` <small>${S.plates.length}</small>` : ''}</button></div>`; }

/* ---------- the paper of a place ---------- */
function underHTML(at){ if (S.phase !== 'undertake') return ''; const o = undertakingOptions();
  const rows = o.map((c, i) => at && underAt(c.id) !== at ? '' : `<button class="choice" onclick="undertake(${i})"><span>${esc(c.t)}${hintHTML(c.hint)}</span>${noteOf(c)}</button>`).join('');
  return rows ? `<div class="choices">${rows}</div>` : ''; }
function sheetHTML(){ const id = SHEET, shut = `<button class="shut" onclick="shutSheet()" aria-label="Put the paper away">×</button>`;
  if (id === 'season') return `${shut}<h2>The Season Is Yours</h2><div class="prose"><p>${['Nothing more', 'One thing more', 'Two things more', 'Three things'][typeof ridesLeft === 'function' ? Math.max(0, Math.min(3, ridesLeft())) : 1]} may be undertaken this quarter. Works on the estate may be put in hand at any time.</p></div>${underHTML('')}`;
  if (id === 'memo') return `${shut}<h2>${esc('Mr ' + steward())}’s Memoranda</h2><div class="memo">
      ${meter('Standing in the county', S.standing, STANDING_W, 'standing', 'cut', 'Cut by the county')}
      ${meter('Goodwill of the parish', S.goodwill, GOODWILL_W, 'goodwill', 'sullen', 'The parish is sullen')}
      ${meter('Peace of the household', S.family, FAMILY_W, 'family', 'henriettaAway', 'Henrietta is away')}
      ${S.traits && S.traits.length ? `<p class="fine born">The squire: ${S.traits.map(t => esc(traitById(t).name)).join('. ')}.</p>` : ''}</div>`;
  const p = PLACES[id]; if (!p) return '';
  if (WHO && S.chars[WHO] && S.chars[WHO].met) return `${shut}<h2>${esc(p.n)}</h2>${peopleHTML().replace('All persons', esc(p.n))}`;
  const secs = [], sec = (key, title, html) => { if (html) secs.push([key, title, html]); };
  const works = typeof worksList === 'function' && (worksList().some(w => workAt(w.id) === id) || (id === 'hanger' && typeof creditList === 'function' && creditList().some(c => c.id === 'timber')));
  const vents = typeof venturesList === 'function' ? venturesList().filter(v => ventAt(v.id) === id) : [];
  const folk = Object.keys(S.chars).filter(k => S.chars[k].met && PEOPLE[k] && livesAt(k) === id);
  sec('under', 'The season’s undertaking', underHTML(id));
  if (p.farm && farmAt(p.farm)) sec('farm', 'The Rent Roll', farmsHTML(p.farm));
  if (id === 'hall' && typeof householdList === 'function') sec('house', 'The Household', householdHTML());
  if (works) sec('works', 'Works', worksHTML(w => workAt(w) === id));
  if (vents.length) sec('vents', 'Ventures', lotsHTML(vents, true, 'beginVenture', 'endVenture', 'Venture it'));
  /* What is bought in town is found in London; what is bought in the county, at Wyvern. */
  if ((id === 'london' || id === 'wyvern') && typeof societyList === 'function') sec('soc', 'Figure and Consequence', lotsHTML(societyList().filter(r => !r.house && COUNTY_LOTS.has(r.id) === (id === 'wyvern')), true, 'beginSociety', 'endSociety', 'Pay for it'));
  if (id === 'wyvern') { sec('wheat', 'Wheat at Wyvern Market', chartHTML()); if (typeof creditList === 'function' && S.phase !== 'end') sec('bank', 'Tidmarsh’s Bank', `<dl class="bal"><div><dt>Owing, limit ${fmt(mortCap())}</dt><dd class="owe">${fmt(S.mortgage)}</dd></div>${creditHTML()}</dl>${raiseHTML(['annuity', 'redeem'])}`); }
  if (folk.length) sec('folk', 'Persons', `<ul class="people">${folk.map(k => { const c = S.chars[k], q = PEOPLE[k]; return `<li><button onclick="showWho('${k}')">${medal(k)}<span class="pp"><b>${esc(q.name)}</b><small>${esc(q.role())}</small><span class="r r${c.r + 5}">${REGARD[c.r + 5]}</span></span></button></li>`; }).join('')}</ul>`);
  const open = secs.some(s => s[0] === SEC) ? SEC : secs.length ? secs[0][0] : '';
  const glb = id === 'hall' ? (isBuilt('front') && ART.has('hall/hall-front.glb') ? 'hall-front' : ART.has('hall/hall-old.glb') ? 'hall-old' : '') : '';
  const view = glb && ROUND ? `<figure class="plate round"><model-viewer src="art/hall/${glb}.glb" alt="Hatherley Hall" camera-controls auto-rotate rotation-per-second="14deg" camera-orbit="30deg 68deg auto" shadow-intensity=".6" exposure="1.05" interaction-prompt="none" disable-zoom></model-viewer></figure>`
    : `<figure class="plate has">${platePic(p.pic && artURL(p.pic()) ? p.pic() : 'seasons/' + S.season, p.n)}${glb ? `<button class="turn" onclick="turnHall()">In the round</button>` : ''}</figure>`;
  return `${shut}<h2>${esc(p.n)}</h2>${view}
    ${secs.map(([k, t, h]) => `<details class="sec" name="sec" ${k === open ? 'open' : ''} ontoggle="if(this.open)SEC='${k}'"><summary>${t}</summary><div>${h}</div></details>`).join('')}`; }
/* The model of the Hall is fetched only when asked for. */
function turnHall(){ ROUND = true; if (!window.customElements || !customElements.get('model-viewer')) { const s = document.createElement('script'); s.type = 'module'; s.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js'; s.onerror = () => { ROUND = false; drawPlan(); }; document.head.appendChild(s); } drawPlan(); }

let LANDKEY = '';
function drawPlan(){ const on = !!S && VIEW === 'plan'; document.body.classList.toggle('planview', on); $('plan').hidden = !on; drawPlate(); if (!on) { LANDKEY = ''; return; }
  const land = $('land'), sheet = $('sheet'), p = PLACES[SHEET];
  /* the sheet itself is redrawn only when what is on it changes, so the moving picture does not start again at every touch */
  const key = JSON.stringify([S.season, piecesOn(), armsOf(), S.phase, S.pending, PLATEUP, SHEET, Object.keys(PLACES).filter(placeOn)]);
  if (!$('landart')) land.innerHTML = '<div id="landart"></div><div id="landmot"></div><div id="landlbl"></div>';
  for (const [k, h] of [['landart', landArtHTML()], ['landmot', landMotHTML()], ['landlbl', landLblHTML()]]) { const el = $(k); if (el._h !== h) { el._h = h; el.innerHTML = h; } }
  if (key !== LANDKEY) { const first = !LANDKEY; LANDKEY = key;
    const to = S.phase === 'event' && !PLATEUP ? eventPlace(byId(S.pending)) : first ? 'hall' : ''; if (to && pane()) requestAnimationFrame(() => { const w = $('landwrap'); w.scrollLeft = land.offsetWidth * PLACES[to].at[0] / 100 - w.clientWidth / 2; }); }
  $('cart').innerHTML = cartHTML();
  const top = sheet.scrollTop, was = sheet.dataset.key, now = SHEET + ':' + WHO;
  sheet.hidden = !SHEET; $('plan').classList.toggle('sheeton', !!SHEET); sheet.className = p && p.at[0] > 56 ? 'left' : 'right';
  sheet.innerHTML = SHEET ? sheetHTML() : ''; sheet.dataset.key = now; sheet.scrollTop = was === now ? top : 0; }
addEventListener('keydown', e => { if (e.key !== 'Escape' || !S) return; if (PROGRESS >= 0) shutProgress(); else if (SHEET && VIEW === 'plan' && !PLATEUP) shutSheet(); });

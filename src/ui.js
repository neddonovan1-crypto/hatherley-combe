/* The page: Mr Crabbe's book. The standing account on the left-hand page, the paper in hand on the right. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paras = t => t.split(/\n\n+/).map(p => '<p>' + esc(p) + '</p>').join('');
const band = (v, words) => words[Math.min(words.length - 1, Math.floor(v / (100 / words.length)))];
let TAB = 'accounts', LEAF = -1;
const TABS = [['accounts', 'Accounts'], ['farms', 'Farms'], ['works', 'Works'], ['ventures', 'Ventures'], ['persons', 'Persons'], ['wheat', 'Wheat'], ['daybook', 'Day-Book']];
// Public business is printed and posted; private business comes by hand. These arrive as handbills.
const BILLS = new Set(['speen','flour','powder','bank','defence','incomeTax','dearth','census','boulogne','beacon','trafalgar','abolition','election','election96','jubilee','peace','cornLaw','waterloo']);
const quarterDay = () => QUARTER[S.season] + ' ' + S.year;

// Pictures. build.sh lists what is in art/; anything missing falls back to an ornament drawn here.
const artURL = p => { for (const x of ['.jpg', '.webp', '.png']) if (ART.has(p + x)) return 'art/' + p + x; return ''; };
const pic = (p, alt) => { const u = artURL(p); return u ? `<img src="${u}" alt="${esc(alt || '')}" onerror="this.remove()">` : ''; };
function medal(id, big){ const n = PEOPLE[id].name; return `<span class="medal${big ? ' big' : ''}"><span aria-hidden="true">${esc(n.split(' ').pop()[0])}</span>${pic('portraits/' + id, n)}</span>`; }
function whoOf(text){ let best = null, at = Infinity;
  for (const id in PEOPLE){ if (!S.chars[id]) continue; const i = text.indexOf(PEOPLE[id].name.split(' ').pop()); if (i >= 0 && i < at) { at = i; best = id; } }
  return best; }
function sceneSVG(q){ const C = [['#cddfdd','#b6cc9c','#98b97f','#7c9f69'], ['#cde2ea','#c3cd8a','#a6b668','#5d884d'], ['#e7dab9','#d6b97b','#c39954','#b0672e'], ['#dde2e6','#eff1ee','#e0e4e2','#6b6258']][q], k = '#4b3a2a';
  const tree = (x, y, s) => q === 3 ? `<path d="M${x} ${y}v${-34 * s}m0 ${14 * s}l${-11 * s} ${-13 * s}m${11 * s} ${5 * s}l${12 * s} ${-14 * s}m${-12 * s} ${-2 * s}l${-6 * s} ${-11 * s}m${6 * s} ${4 * s}l${7 * s} ${-9 * s}" fill="none" stroke="${k}" stroke-width="1.5"/>`
    : `<path d="M${x} ${y}v${-14 * s}" stroke="${k}" stroke-width="2"/><g fill="${C[3]}" stroke="${k}" stroke-width="1"><circle cx="${x - 10 * s}" cy="${y - 17 * s}" r="${9 * s}"/><circle cx="${x + 10 * s}" cy="${y - 16 * s}" r="${9 * s}"/><circle cx="${x}" cy="${y - 25 * s}" r="${13 * s}"/></g>`;
  let sky = ''; for (let y = 8; y < 130; y += 7) sky += `<path d="M${(y * 37) % 90} ${y}h${150 + (y * 53) % 240}m60 0h${80 + (y * 29) % 200}" stroke="${k}" stroke-width=".5" opacity=".28"/>`;
  let win = ''; for (let i = 0; i < 5; i++) win += `<rect x="${302 + i * 21.5}" y="127" width="9" height="11"/><rect x="${302 + i * 21.5}" y="144" width="9" height="${i === 2 ? 18 : 11}"/>`;
  return `<svg viewBox="0 0 700 260" role="img" aria-label="Hatherley Hall and its park in ${SEASONS[q].toLowerCase()}"><rect width="700" height="260" fill="${C[0]}"/>${sky}
    <circle cx="565" cy="${[62, 44, 84, 104][q]}" r="20" fill="#f4e6b0" stroke="${k}" stroke-width=".8"/>
    <path d="M0 150C120 108 240 120 360 142S600 108 700 136V260H0Z" fill="${C[1]}" stroke="${k}" stroke-width="1"/>
    <g stroke="${k}" stroke-width="1"><rect x="302" y="104" width="9" height="16" fill="#cdbf9c"/><rect x="389" y="104" width="9" height="16" fill="#cdbf9c"/><rect x="292" y="118" width="116" height="46" fill="#ece1c6"/><path d="M328 118l22-17 22 17z" fill="#ece1c6"/><path d="M286 118h128" stroke-width="2"/></g><g fill="${k}" opacity=".75">${win}</g>
    ${tree(246, 176, .8)}${tree(456, 174, .8)}
    <path d="M0 192C160 166 300 186 430 179S620 170 700 186V260H0Z" fill="${C[2]}" stroke="${k}" stroke-width="1"/>
    <path d="M40 214c120-14 220 6 330-2s200-16 300-4" fill="none" stroke="${k}" stroke-width=".8" stroke-dasharray="2 5"/>
    ${tree(112, 206, 1.6)}${tree(176, 196, 1.1)}${tree(528, 192, 1.25)}${tree(612, 208, 1.75)}</svg>`; }
function plateHTML(q, src, cap){ return `<figure class="plate">${sceneSVG(q)}${pic(src, cap)}</figure>`; }

function render(){
  const stage = $('stage');
  document.body.classList.toggle('intro', !S);
  if (!S) { LEAF = -1; stage.classList.remove('turn');
    stage.innerHTML = `<figure class="plate band">${sceneSVG(1)}${pic('frontispiece', 'Hatherley Hall from the park')}</figure>` + introHTML();
    const told = document.createElement('div'); told.className = 'opening'; const form = stage.querySelector('#begin'); while (form.parentNode.firstElementChild !== form) told.appendChild(form.parentNode.firstElementChild);
    $('verso').innerHTML = '<p class="titlepage">Hatherley Combe<small>A squire’s seasons, 1795 to 1815</small></p>'; $('verso').appendChild(told);
    $('tabs').innerHTML = ''; syncTraits(); fitLeaf(); return; }
  { const d = document.querySelector('.desk'); d.style.zoom = ''; d.style.maxWidth = ''; }
  if (S.t !== LEAF) { if (LEAF >= 0 && S.phase === 'ledger') { stage.classList.remove('turn'); void stage.offsetWidth; stage.classList.add('turn'); } LEAF = S.t; }
  stage.innerHTML = ({ledger:ledgerHTML, event:eventHTML, outcome:outcomeHTML, undertake:undertakeHTML, undone:outcomeHTML, end:endHTML})[S.phase]();
  drawBook();
  const n = (LAST_YEAR - FIRST_YEAR + 1) * 4; $('ribbon').style.height = Math.round(60 + 420 * Math.min(S.t + 1, n) / n) + 'px';
  const first = stage.querySelector('button'); if (first && S.phase !== 'ledger') first.focus({preventScroll:true});
}
/* the opening is sized to the window, so the will and the choosing are read without scrolling */
function fitLeaf(){ const d = document.querySelector('.desk'); d.style.zoom = ''; d.style.maxWidth = ''; if (S || innerWidth <= 1080) return;
  const room = innerHeight - 34, wide = Math.min(1420, innerWidth - 32); let z = 1;
  for (let i = 0; i < 5; i++){ const h = d.getBoundingClientRect().height; if (h <= room && i) break; z = Math.max(.7, Math.min(1, z * room / h)); d.style.zoom = z.toFixed(3); d.style.maxWidth = Math.round(wide / z) + 'px'; } }
addEventListener('resize', fitLeaf); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLeaf);
function drawBook(){ $('verso').innerHTML = versoHTML();
  $('tabs').innerHTML = TABS.map(([id, n]) => `<button aria-pressed="${TAB === id}" onclick="showTab('${id}')">${pic('icons/' + id)}${n}</button>`).join(''); }
function showTab(t){ TAB = t; drawBook(); }

function introHTML(){ const has = !!load();
  return `<article class="card opening">
    <p class="kicker">Berkshire, Lady Day 1795</p>
    <h2>An Inheritance</h2>
    <p>Your uncle Barnaby died at his own table on Michaelmas Day. He was seventy-one. The Bishop was on his right. The syllabub had just come in.</p>
    <p>Mr Spurling the attorney read the will in the library a week later. It took four minutes. Everything comes to you.</p>
    <p>Hatherley Combe. Two thousand one hundred acres of chalk and clay. Eleven farms let to tenants. A water mill. A common where forty cottagers keep a cow apiece. A house with fifty-four windows and eleven chimneys. Nine of the chimneys smoke. A mortgage of four thousand pounds at five per cent.</p>
    <p>The steward met your carriage at the lodge this morning. His name is Crabbe. He had the keys in one hand and the rent book in the other. He gave you the keys.</p>
    <p>Henrietta is upstairs counting bedrooms. She had hoped you would be a baronet by now. Kitty is seventeen and has found the library. Edmund is nineteen. He has found your uncle’s sword over the hall chimney-piece and is trying to get it out of the scabbard.</p>
    <p>England has been at war with France for two years. The quartern loaf was sevenpence when it began. It is elevenpence today.</p>
    <p>You have twenty-one years. They come one season at a time.</p>
    <form id="begin" class="names" onsubmit="event.preventDefault(); start();">
      <label for="first">Christian name</label><input id="first" value="Thomas" maxlength="18" autocomplete="off">
      <label for="sur">Surname</label><input id="sur" value="Merridew" maxlength="18" autocomplete="off">
      <fieldset class="traits">
        <legend>What manner of man inherits</legend>
        <p class="fine">You have <b id="pts">${pointsLeft(pickList())}</b> <span id="ptsw">points</span> in hand. An advantage costs them; a burden pays them back. Leave all five alone to start as plain as your uncle left you.</p>
        ${TRAIT_GROUPS.map(([g, label, plain]) => `<div class="pickrow"><label for="pick-${g}">${label}</label>
          <select id="pick-${g}" onchange="setPick('${g}', this.value)"><option value="">${plain}</option>${TRAITS.filter(t => t.group === g).map(t => `<option value="${t.id}"${PICKS[g] === t.id ? ' selected' : ''}>${esc(t.name)} (${t.cost > 0 ? 'costs ' + t.cost : 'gives ' + (-t.cost)})</option>`).join('')}</select>
          <p class="pickblurb" id="blurb-${g}"></p></div>`).join('')}
      </fieldset>
      <div class="row"><button class="go" id="takeit" type="submit">Take possession</button>${has ? '<button class="quiet" type="button" onclick="resume()">Resume the estate you left</button>' : ''}</div>
    </form>
  </article>`; }
let PICKS = {};
const pickList = () => Object.values(PICKS).filter(Boolean);
function setPick(g, id){ PICKS[g] = id || null; syncTraits(); }
function syncTraits(){ if (!$('pts')) return; const left = pointsLeft(pickList());
  for (const [g] of TRAIT_GROUPS){ const t = PICKS[g] && traitById(PICKS[g]); $('blurb-' + g).innerHTML = t ? esc(t.blurb) + ' <span>' + esc(t.effect) + '</span>' : ''; }
  $('pts').textContent = left; $('ptsw').textContent = Math.abs(left) === 1 ? 'point' : 'points'; $('pts').classList.toggle('neg', left < 0);
  $('takeit').disabled = left < 0; $('takeit').textContent = left < 0 ? 'Overdrawn. Give something up, or take on a burden' : 'Take possession'; }
function start(){ if (pointsLeft(pickList()) < 0) return; const f = ($('first').value || 'Thomas').trim(), s = ($('sur').value || 'Merridew').trim(); newGame(f, s, pickList()); render(); window.scrollTo({top:0}); }
function resume(){ const s = load(); if (s) { S = s; render(); } }

const runhead = (l, r, m) => `<p class="runhead"><span>${l}</span>${m ? `<span>${m}</span>` : ''}<span>${r}</span></p>`;
const noteOf = c => c.note ? `<em>${esc(typeof c.note === 'function' ? c.note() : c.note)}</em>` : '';

function accountHTML(){ let rows = '', tot = 0;
  const cells = a => `<td class="n l">${a < 0 ? '<span class="sr">paid </span>' : ''}${Math.abs(a).toLocaleString('en-GB')}</td><td class="n z">0</td><td class="n z">0</td>`;
  for (const [l, a] of S.ledger){ tot += a; rows += `<tr class="${a < 0 ? 'neg' : ''}"><td>${esc(l)}</td>${cells(a)}</tr>`; }
  rows += `<tr class="total${tot < 0 ? ' neg' : ''}"><td>Carried to the purse</td>${cells(tot)}</tr>`;
  return `<div class="tablewrap"><table class="acct"><thead><tr><th>Particulars</th><th class="n l">£</th><th class="n">s.</th><th class="n">d.</th></tr></thead><tbody>${rows}</tbody></table></div>`; }

function ledgerHTML(){
  const warn = S.dead === 'ruin' ? `<p class="note bad">The tradesmen of Wyvern met at the George on Tuesday. They resolved to give the Hall no more credit. No hand was raised against it. The mortgagees have sent a man to look at the roof.</p>` : '';
  return `${runhead('Papers received this quarter', 'Cr.')}
    ${plateHTML(S.season, 'seasons/' + S.season, 'Hatherley in ' + SEASONS[S.season].toLowerCase())}
    <p class="platecap"><span>Hatherley, ${esc(stamp())}</span><span>fo. ${Math.min(S.t + 1, 84)} of 84</span></p>
    <p class="kicker">${esc(quarterDay())}. ${esc('Mr ' + steward())} presents the quarter</p>
    <h2>The Accounts</h2>
    <div class="narrow">${accountHTML()}</div>
    ${S.notes.map(n => `<p class="note">${esc(n)}</p>`).join('')}${warn}
    ${S.news ? `<aside class="sheet clip"><span>The Reading Mercury</span><p>${esc(S.news)}</p></aside>` : ''}
    ${S.vignette ? `<div class="prose vignette">${paras(S.vignette)}</div>` : ''}
    <div class="row"><button class="go" onclick="next()"><span>${S.dead ? 'Face the creditors' : S.pending ? 'See who is waiting in the hall' : 'Decide how to spend the season'}</span></button></div>`; }

function eventHTML(){ const e = byId(S.pending); const cs = e.choices.filter(c => !c.if || c.if()); const bill = BILLS.has(e.id), text = e.text(), who = bill ? null : whoOf(e.title + ' ' + text);
  return `${runhead(bill ? 'Posted this quarter' : 'Papers received this quarter', 'Cr.')}
    <article class="sheet${bill ? ' bill' : ''}">
      ${who ? `<div class="from">${medal(who, true)}<div><p class="kicker">${esc(stamp())}. ${esc(PEOPLE[who].name)}</p><h2>${esc(e.title)}</h2></div></div>` : `<p class="kicker">${esc(stamp())}</p><h2>${esc(e.title)}</h2>`}
      <div class="prose">${pic('events/' + e.id, '')}${paras(text)}</div>
    </article>
    <h3 class="orn">Your answer</h3>
    <div class="choices">${cs.map((c, i) => `<button class="choice" onclick="choose(${i})"><span>${esc(lab(c))}</span>${noteOf(c)}</button>`).join('')}</div>`; }

function outcomeHTML(){ const o = S.outcome;
  return `${runhead(S.phase === 'undone' ? 'The season’s undertaking' : 'What came of it', 'Cr.')}
    <p class="kicker">${esc(stamp())}</p><h2>${esc(o.title)}</h2><div class="swell"></div>
    <div class="prose lead">${paras(o.text)}</div>
    ${o.d.length ? `<ul class="deltas">${o.d.map(([t, up]) => `<li class="${up ? 'up' : 'down'}">${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="row"><button class="go" onclick="next()"><span>${S.dead ? 'And then' : S.phase === 'undone' ? (S.t === 83 ? 'Close the books' : 'Turn the page') : 'Carry on'}</span></button></div>`; }

function undertakeHTML(){ const o = undertakingOptions();
  return `${runhead('The season’s undertaking', 'Cr.')}
    <p class="kicker">${esc(stamp())}</p><h2>The Season Is Yours</h2>
    <div class="prose"><p>You may undertake one thing this season. Works on the estate may be put in hand at any time.</p></div>
    <div class="choices">${o.map((c, i) => `<button class="choice" onclick="undertake(${i})"><span>${esc(c.t)}<small>${esc(c.hint || '')}</small></span>${noteOf(c)}</button>`).join('')}</div>`; }

function endHTML(){ const r = reckoning();
  return `${runhead('Pasted inside the back board', 'Finis')}
    <article class="sheet bill ending">
      <p class="kicker">From the Reading Mercury and Oxford Gazette, ${S.dead ? esc(stamp()) : 'January 1816'}</p>
      <h2>${esc(r.title)}</h2>
      <div class="prose">${r.P.map(p => '<p>' + esc(p) + '</p>').join('')}</div>
      ${r.score !== null ? `<p class="score">Esteem of the county <b>${r.score}</b><span> in the hundred</span></p>` : ''}
    </article>
    <div class="row"><button class="go" onclick="wipe()"><span>Inherit again</span></button></div>`; }

function meter(label, v, words){ return `<div class="meter${v < 40 ? ' low' : ''}"><span>${label}</span><i><u style="width:${v}%"></u></i><b>${esc(band(v, words))}</b></div>`; }

function versoHTML(){
  const head = runhead('Dr.', `fo. ${Math.min(S.t + 1, 84)}`, `Hatherley Combe, in Account with ${esc(S.name)}, Esq.`);
  if (TAB === 'farms') return head + `<h2 class="qtitle">The Rent Roll${typeof farmsList === 'function' ? '' : '<sup>specimen</sup>'}</h2>` + farmsHTML();
  if (TAB === 'ventures') return head + `<h2 class="qtitle">Ventures${typeof venturesList === 'function' ? '' : '<sup>specimen</sup>'}</h2>` + venturesHTML();
  if (TAB === 'works') return head + `<h2 class="qtitle">Works on the Estate</h2>` + worksHTML();
  if (TAB === 'persons') return head + `<h2 class="qtitle">Persons of Consequence</h2>` + peopleHTML();
  if (TAB === 'wheat') return head + `<h2 class="qtitle">Wheat at Wyvern Market</h2>` + chartHTML();
  if (TAB === 'daybook') return head + `<h2 class="qtitle">The Squire’s Day-Book</h2>` + journalHTML();
  const pol = [[0.9, 'Indulgent'], [1, 'Customary'], [1.2, 'Rack']], over = S.phase === 'end';
  return head + `<h2 class="qtitle">${esc(QUARTER[S.season])} Quarter, ${S.year}</h2>
    ${accountHTML()}
    <dl class="bal"><div><dt>In hand</dt><dd class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</dd></div><div><dt>Owing on the mortgage</dt><dd class="owe">${fmt(S.mortgage)}</dd></div>
      ${over ? '' : `<div class="mort" role="group" aria-label="Mortgage"><button class="inkbtn" onclick="mortgage(-1)" ${S.money >= 500 && S.mortgage >= 500 ? '' : 'disabled'}>Pay off £500</button><button class="inkbtn" onclick="mortgage(1)" ${S.mortgage < (typeof mortCap === 'function' ? mortCap() : 9000) ? '' : 'disabled'}>Borrow £500</button></div>`}</dl>
    <div class="memo"><h3 class="orn">${esc('Mr ' + steward())}’s memoranda</h3>
      ${meter('Standing in the county', S.standing, STANDING_W)}
      ${meter('Goodwill of the parish', S.goodwill, GOODWILL_W)}
      ${meter('Peace of the household', S.family, FAMILY_W)}
      ${S.traits && S.traits.length ? `<p class="fine born">The squire: ${S.traits.map(id => esc(traitById(id).name)).join('. ')}.</p>` : ''}</div>
    ${over ? '' : `<div class="rents" role="group" aria-label="Rent policy"><h3>Rents</h3>${pol.map(([v, n]) => `<button class="${S.rentPolicy === v ? 'on' : ''}" aria-pressed="${S.rentPolicy === v}" onclick="setRent(${v})">${n}</button>`).join('')}
      <p class="fine">Half-year rental due: ${fmt(halfRent())}.</p></div>`}`; }

function worksHTML(){ const list = worksList(), hand = list.filter(w => w.state === 'inHand'), open = list.filter(w => w.state === 'open'), done = list.filter(w => w.state === 'done');
  const whys = [...new Set(open.map(w => w.why))], common = whys.length === 1 && whys[0];
  return `${common ? `<p class="note bad">${esc(common)}</p>` : ''}<div class="lots">
    ${hand.map(w => `<div class="lot hand"><b>${esc(w.name)}</b><span>${w.left} season${w.left > 1 ? 's' : ''} more</span></div>`).join('')}
    ${open.map(w => `<details name="lot"><summary><b>${esc(w.name)}</b><span>${fmt(w.cost)}</span></summary><div><p>${esc(w.blurb)}</p><p class="terms">${esc(w.note)}. ${esc(w.gain)}.${w.why && !common ? ` <em>${esc(w.why)}</em>` : ''}</p><button class="inkbtn" onclick="beginWork('${w.id}')" ${w.can ? '' : 'disabled'}>Put in hand</button></div></details>`).join('')}
    ${done.map(w => `<div class="lot done"><b>${esc(w.name)}</b><span>Finished</span></div>`).join('')}</div>`; }

/* Farms and Ventures. The engine will supply farmsList() and venturesList(); until it does these leaves show the economy design's opening figures and move nothing. */
const DRAFT_FARMS = [
  {name: 'Long Barrow', land: 'Down and sheepwalk', acres: 600, tenant: 'Abigail Thorne', rent: 540, held: 'On lease, falling in 1802'},
  {name: 'Kennet Bottom', land: 'Wet clay, with the mill', acres: 500, tenant: 'Widow Harris', rent: 470, held: 'At will. Neglected'},
  {name: 'Church Farm', land: 'Strips in the open field', acres: 550, tenant: 'Not yet let', rent: 610, held: 'At will'}];
const DRAFT_VENTURES = [
  {name: 'Plough up the down', where: 'Long Barrow', cost: 250, well: 'The farm lets a quarter higher, at once.'},
  {name: 'Merinos', where: 'The home farm', cost: 420, well: 'Wool worth £110 more a year, and rams at fancy prices.'},
  {name: 'Cut the peat', where: 'Kennet Bottom', cost: 300, well: 'About £170 a year in peat and ashes.'},
  {name: 'Forage for the barracks', where: 'The estate', cost: 200, well: '£130 a year, as long as there is cavalry at Reading.'},
  {name: 'A threshing machine', where: 'The home farm', cost: 120, well: 'Saves about £50 a year in wages.'},
  {name: 'A partner’s share in the Wyvern Bank', where: 'The estate', cost: 1000, well: 'Fifteen per cent, and a seat in the bank parlour.'},
  {name: 'The Hatherley Spa', where: 'The estate', cost: 1800, well: 'If the waters take, £300 a year rising to £750.'}];
function farmsHTML(){ const live = typeof farmsList === 'function', list = live ? farmsList() : DRAFT_FARMS, sum = list.reduce((a, f) => a + f.rent, 0);
  return `<table class="acct roll"><thead><tr><th>Farm and tenant</th><th class="n">Acres</th><th class="n l">£ a year</th></tr></thead><tbody>
    ${list.map(f => `<tr><td>${esc(f.name)}<small>${esc(f.land)}. ${esc(f.tenant)}.</small><em>${esc([f.held, f.order, f.arrears ? fmt(f.arrears) + ' in arrear' : ''].filter(Boolean).join('. '))}</em>
      ${live && f.canLevel ? `<span class="lv" role="group" aria-label="Rent">${[['easy', 'Easy'], ['fair', 'Fair'], ['rack', 'Rack']].map(([v, n]) => `<button class="${f.level === v ? 'on' : ''}" aria-pressed="${f.level === v}" onclick="setLevel('${f.id}', '${v}')">${n}</button>`).join('')}${f.canOffer ? `<button onclick="offerLease('${f.id}')">Offer a lease</button>` : ''}</span>` : ''}</td><td class="n">${f.acres}</td><td class="n l">${f.rent}</td></tr>`).join('')}
    <tr class="total"><td>The rental</td><td class="n">${list.reduce((a, f) => a + f.acres, 0)}</td><td class="n l">${sum.toLocaleString('en-GB')}</td></tr></tbody></table>`; }
function venturesHTML(){ const live = typeof venturesList === 'function', list = live ? venturesList() : DRAFT_VENTURES;
  return `<div class="lots">${list.map(v => `<details name="lot"><summary><b>${esc(v.name)}</b><span>${fmt(v.cost)}</span></summary><div><p>${esc(v.well)}</p><p class="terms">${esc(v.where)}.</p>${live && v.id ? `<button class="inkbtn" onclick="beginVenture('${v.id}')" ${v.can ? '' : 'disabled'}>Venture it</button>` : ''}</div></details>`).join('')}</div>`; }

function peopleHTML(){
  return `<ul class="people">${Object.keys(S.chars).filter(id => S.chars[id].met).map(id => { const c = S.chars[id], p = PEOPLE[id]; const note = c.notes[c.notes.length - 1];
    return `<li title="${esc(p.role() + (note ? '. ' + note : ''))}">${medal(id)}<div><b>${esc(p.name)}</b><small>${esc(p.role())}</small><span class="r r${c.r + 5}">${REGARD[c.r + 5]}</span></div></li>`; }).join('')}</ul>`; }

function chartHTML(){ const W = 300, H = 110, pad = 18, n = LAST_YEAR - FIRST_YEAR + 1, bw = (W - pad) / n; let bars = '';
  const yOf = v => H - 16 - (v / 130) * (H - 28);
  for (let y = FIRST_YEAR; y <= S.year; y++){ const v = PRICES[y], x = pad + (y - FIRST_YEAR) * bw;
    bars += `<rect x="${x.toFixed(1)}" y="${yOf(v).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(H - 16 - yOf(v)).toFixed(1)}" class="${y === S.year ? 'now' : ''}"><title>${y}: ${v}s. the quarter</title></rect>`; }
  return `<p class="wheat"><b>${PRICES[S.year]}</b>shillings the quarter. ${PRICES[S.year] >= 100 ? 'Famine price.' : PRICES[S.year] >= 80 ? 'Dear.' : PRICES[S.year] >= 65 ? 'Middling.' : 'Cheap. The farmers are in mourning.'}</p>
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Price of wheat by year, in shillings the quarter">
    <line x1="${pad}" x2="${W}" y1="${yOf(80)}" y2="${yOf(80)}" class="rule"/><text x="${W}" y="${yOf(80) - 3}" text-anchor="end">80s.</text>
    <line x1="${pad}" x2="${W}" y1="${H - 16}" y2="${H - 16}" class="axis"/>${bars}
    <text x="${pad}" y="${H - 3}">1795</text><text x="${W}" y="${H - 3}" text-anchor="end">1815</text></svg>`; }

function journalHTML(){
  return `${S.journal.length ? `<ol class="daybook">${S.journal.slice(0, 12).map(j => `<li><time>${esc(j.when)}</time><span><b>${esc(j.title)}.</b> ${esc(j.did)}</span></li>`).join('')}</ol>` : '<p class="fine">Nothing entered yet.</p>'}
    ${S.phase !== 'end' ? '<div class="row"><button class="quiet" onclick="askWipe(this)">Abandon this estate and begin again</button></div>' : ''}`; }
function askWipe(b){ if (b.dataset.sure) return wipe(); b.dataset.sure = 1; b.textContent = 'Certain? Press again to give it all up'; }

function boot(data){ indexEvents(); if (data && data.S) S = data.S; render(); }
if (window.claude && window.claude.hot && window.claude.hot.snapshot) { try { window.claude.hot.snapshot(() => ({S})); } catch (err) {} }
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(boot); else boot((window.claude && window.claude.hot && window.claude.hot.data) || {});

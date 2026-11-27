/* The page: Mr Crabbe's book. The standing account on the left-hand page, the paper in hand on the right. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paras = t => t.split(/\n\n+/).map(p => (/^[A-Za-z]/.test(p) ? '<p>' : '<p class="nocap">') + esc(p) + '</p>').join('');
const band = (v, words) => words[Math.min(words.length - 1, Math.floor(v / (100 / words.length)))];
let TAB = 'accounts', LEAF = -1, PAPER = '', WHO = '', MORE = false;
/* The book is opened on quarter day. Works, ventures, the household and society are found at their places on the plan (plan.js). */
const TABS = [['accounts', 'Accounts'], ['farms', 'Farms'], ['persons', 'Persons'], ['daybook', 'Day-Book']];
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
const platePic = (src, cap) => { const u = artURL(src); return u ? `<img src="${u}" alt="${esc(cap || '')}" onerror="this.parentNode.classList.remove('has');this.remove()">` : ''; };
function plateHTML(q, src, cap){ const i = platePic(src, cap); return `<figure class="plate${i ? ' has' : ''}">${sceneSVG(q)}${i}</figure>`; }
[0, 1, 2, 3].forEach(i => { const u = artURL('seasons/' + i); if (u) new Image().src = u; });

let STEP = '', LEAFUP = true;
function render(){
  const stage = $('stage');
  document.body.classList.toggle('intro', !S);
  if (typeof planSync === 'function') planSync();
  if (!S) { LEAF = -1; stage.classList.remove('turn');
    stage.innerHTML = `<figure class="plate band${artURL('frontispiece') ? ' has' : ''}">${sceneSVG(1)}${platePic('frontispiece', 'Hatherley Hall from the park')}</figure>` + introHTML();
    const told = document.createElement('div'); told.className = 'opening'; const form = stage.querySelector('#begin'); while (form.parentNode.firstElementChild !== form) told.appendChild(form.parentNode.firstElementChild);
    $('verso').innerHTML = '<p class="titlepage">Hatherley Combe<small>A squire’s seasons, 1795 to 1815</small></p>'; $('verso').appendChild(told);
    $('tabs').innerHTML = ''; syncTraits(); fitLeaf(); return; }
  { const d = document.querySelector('.desk'); d.style.zoom = ''; d.style.maxWidth = ''; }
  if (S.t !== LEAF) { if (LEAF >= 0 && S.phase === 'ledger') { stage.classList.remove('turn'); void stage.offsetWidth; stage.classList.add('turn'); } LEAF = S.t; }
  { const k = S.t + ':' + S.phase + ':' + S.pending; if (k !== STEP) { STEP = k; LEAFUP = true; if (innerWidth <= 1080) window.scrollTo({top:0}); } }
  stage.innerHTML = S.phase === 'end' ? endHTML() : ledgerHTML();
  drawBook();
  if (typeof drawPlan === 'function') drawPlan();
  const n = (LAST_YEAR - FIRST_YEAR + 1) * 4; $('ribbon').style.height = Math.round(60 + 420 * Math.min(S.t + 1, n) / n) + 'px';
}
/* the opening is sized to the window, so the will and the choosing are read without scrolling */
function fitLeaf(){ const d = document.querySelector('.desk'); d.style.zoom = ''; d.style.maxWidth = ''; if (S || innerWidth <= 1080) return;
  const room = innerHeight - 34, wide = Math.min(1420, innerWidth - 32); let z = 1;
  for (let i = 0; i < 5; i++){ const h = d.getBoundingClientRect().height; if (h <= room && i) break; z = Math.max(.7, Math.min(1, z * room / h)); d.style.zoom = z.toFixed(3); d.style.maxWidth = Math.round(wide / z) + 'px'; } }
addEventListener('resize', fitLeaf); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitLeaf);
function drawBook(){ $('verso').innerHTML = versoHTML();
  document.body.classList.toggle('reading', TAB === 'paper'); document.body.classList.toggle('leafup', LEAFUP);
  const leaf = ['leaf', S.phase === 'end' ? 'Finis' : 'The Quarter'];
  $('tabs').innerHTML = [leaf].concat(TABS).map(([id, n]) => `<button class="${id === 'leaf' || id === 'paper' ? 'leaf' : ''}${id === 'leaf' ? ' phone' : ''}" aria-pressed="${TAB === id}" onclick="showTab('${id}')">${pic('icons/' + id)}${n}</button>`).join(''); }
/* On a phone one page shows at a time: LEAFUP is the paper in hand, otherwise the tab chosen. */
function showTab(t){ LEAFUP = t === 'leaf' || t === 'paper'; if (t !== 'leaf') TAB = t; WHO = ''; drawBook(); if (innerWidth <= 1080) window.scrollTo({top:0}); }
function showWho(id){ WHO = id; if (typeof VIEW !== 'undefined' && VIEW === 'plan') drawPlan(); else drawBook(); }

function introHTML(){ const has = !!load();
  return `<article class="card opening">
    <p class="kicker">Berkshire, Lady Day 1795</p>
    <h2>An Inheritance</h2>
    <p>Your uncle Barnaby died at his own table on Michaelmas Day. He was seventy-one. The Bishop was on his right. The syllabub had just come in.</p>
    <p>Mr Spurling the attorney read the will in the library a week later. It took four minutes. Everything comes to you.</p>
    <p>Hatherley Combe. Two thousand one hundred acres of chalk and clay. Three farms let to tenants. A water mill. A common where forty cottagers keep a cow apiece. A house with fifty-four windows and eleven chimneys. Nine of the chimneys smoke. A mortgage of four thousand pounds at five per cent.</p>
    <p>The steward met your carriage at the lodge this morning. His name is Crabbe. He had the keys in one hand and the rent book in the other. He gave you the keys.</p>
    <p>Henrietta is upstairs counting bedrooms. She had hoped you would be a baronet by now. Kitty is seventeen and has found the library. Edmund is nineteen. He has found your uncle’s sword over the hall chimney-piece and is trying to get it out of the scabbard.</p>
    <p>England has been at war with France for two years. The quartern loaf was sevenpence when it began. It is elevenpence today.</p>
    <p>You have twenty-one years. They come one season at a time.</p>
    <form id="begin" class="names" onsubmit="event.preventDefault(); start();">
      <label for="first">Christian name</label><input id="first" value="Thomas" maxlength="18" autocomplete="off">
      <label for="sur">Surname</label><input id="sur" value="Merridew" maxlength="18" autocomplete="off">
      <fieldset class="traits">
        <legend>What manner of man inherits</legend>
        <div id="picks">${picksHTML()}</div>
      </fieldset>
      <div class="row"><button class="go" id="takeit" type="submit">Take possession</button>${has ? '<button class="quiet" type="button" onclick="resume()">Resume the estate you left</button>' : ''}</div>
    </form>
  </article>`; }
let PICKS = {};
const pickList = () => Object.values(PICKS).filter(Boolean);
/* Favours: three to begin. An advantage spends one or two, a burden earns them back. Each row opens a list; what cannot be afforded is greyed. */
const favour = n => n ? `<span class="fav ${n > 0 ? 'neg' : 'pos'}">${n > 0 ? '−' : '+'}${'●'.repeat(Math.abs(n))}</span>` : '';
function picksHTML(){ const left = pointsLeft(pickList());
  return `<p class="favours"><span>Favours in hand</span><b id="pts" aria-label="${left}">${'●'.repeat(Math.max(0, left))}<i>${'○'.repeat(Math.max(0, TRAIT_POINTS - Math.max(0, left)))}</i></b><small>An advantage spends them. A burden earns them back.</small></p>
    ${TRAIT_GROUPS.map(([g, label, plain], gi) => { const cur = PICKS[g] && traitById(PICKS[g]), room = left + (cur ? cur.cost : 0);
      const opt = (id, name, cost, fx) => `<button type="button" role="option" aria-selected="${(PICKS[g] || '') === id}" ${cost > room ? 'disabled' : ''} onclick="setPick('${g}', '${id}')"><b>${esc(name)}</b>${favour(cost)}${fx && fx.length ? `<small>${fx.map(t => `<i class="${t[0] === '+' ? 'pos' : 'neg'}">${esc(t)}</i>`).join('')}</small>` : ''}</button>`;
      return `<div class="pickrow"><span class="plabel" id="pl-${g}">${label}</span><details class="pick${gi >= TRAIT_GROUPS.length - 3 ? ' up' : ''}" name="pick"><summary aria-labelledby="pl-${g}"><b>${esc(cur ? cur.name : plain)}</b>${cur ? favour(cur.cost) : ''}</summary>
        <div class="opts" role="listbox">${opt('', plain, 0, '')}${[1, -1].map(sg => `<div>${TRAITS.filter(t => t.group === g && Math.sign(t.cost) === sg).map(t => opt(t.id, t.name, t.cost, t.fx)).join('')}</div>`).join('')}</div></details>
        <p class="pickblurb">${cur ? esc(cur.blurb) + ' <span>' + esc(cur.effect) + '</span>' : ''}</p></div>`; }).join('')}`; }
function setPick(g, id){ PICKS[g] = id || null; if ($('picks')) { $('picks').innerHTML = picksHTML(); fitLeaf(); } }
function syncTraits(){ if ($('picks')) $('picks').innerHTML = picksHTML(); }
document.addEventListener('click', e => { if (!e.target.closest('details.pick')) document.querySelectorAll('details.pick[open]').forEach(d => d.open = false); });
function start(){ if (pointsLeft(pickList()) < 0) return; const f = ($('first').value || 'Thomas').trim(), s = ($('sur').value || 'Merridew').trim(); newGame(f, s, pickList()); render(); window.scrollTo({top:0}); }
function resume(){ const s = load(); if (s) { S = s; render(); } }

const runhead = (l, r, m) => `<p class="runhead"><span>${l}</span>${m ? `<span>${m}</span>` : ''}<span>${r}</span></p>`;
/* A choice's sum: a plus or "Saves" or a sale is money in and goes green; a bare sum is money out and goes red. Rents on a letting are money in. */
const RENT_PAPERS = new Set(['leaseFalls', 'cannotPay']);
function noteOf(c){ if (!c.note) return ''; const n = typeof c.note === 'function' ? c.note() : c.note, M = /[+−-]?(£[\d,]+|\d+ guineas?|\d+s\.(?: \d+d\.)?)/g;
  if (/^Mortgage /.test(n) || !n.match(M)) return `<em>${esc(n)}</em>`;
  const rent = S.phase === 'event' && RENT_PAPERS.has(S.pending) && / a year/.test(n) && !/^Strike/.test(n);
  const gain = /^(\+|Saves|About)/.test(n) || rent;
  return `<em>${esc(n).replace(M, (m, a) => { const g = /^\+/.test(m) ? true : /^[−-]/.test(m) ? false : gain; return `<span class="amt ${g ? 'pos' : 'neg'}">${g ? '+' : '−'}${a}</span>`; })}</em>`; }

function accountHTML(){ let rows = '', tot = 0;
  const cells = a => `<td class="n l">${a < 0 ? '<span class="sr">paid </span>' : ''}${Math.abs(a).toLocaleString('en-GB')}</td><td class="n z">0</td><td class="n z">0</td>`;
  for (const [l, a] of S.ledger){ tot += a; rows += `<tr class="${a < 0 ? 'neg' : ''}"><td>${esc(l)}</td>${cells(a)}</tr>`; }
  rows += `<tr class="total${tot < 0 ? ' neg' : ''}"><td>Carried to the purse</td>${cells(tot)}</tr>`;
  return `<div class="tablewrap"><table class="acct"><thead><tr><th>Particulars</th><th class="n l">£</th><th class="n">s.</th><th class="n">d.</th></tr></thead><tbody>${rows}</tbody></table></div>`; }

/* The right-hand leaf, under the plate: what the quarter came to, and what was lately done. */
function digestHTML(){ let inn = 0, out = 0; for (const [, a] of S.ledger) { if (a > 0) inn += a; else out -= a; }
  const net = inn - out, last = S.journal.slice(0, 3);
  return `<div class="digest"><dl class="bal slim"><div><dt>Received</dt><dd>${inn ? amt(inn, 1) : fmt(0)}</dd></div><div><dt>Paid away</dt><dd>${out ? amt(out, -1) : fmt(0)}</dd></div><div><dt>The quarter</dt><dd>${net ? amt(net, net) : fmt(0)}</dd></div></dl>
    ${last.length ? `<h3 class="orn">Lately</h3><ol class="daybook">${last.map(j => `<li><time>${esc(j.when)}</time><span><b>${esc(j.title)}.</b> ${esc(j.did)}</span></li>`).join('')}</ol>` : ''}</div>`; }
function ledgerHTML(){
  const warn = S.dead === 'ruin' ? `<p class="note bad">The tradesmen of Wyvern met at the George on Tuesday. They resolved to give the Hall no more credit. No hand was raised against it. The mortgagees have sent a man to look at the roof.</p>` : '';
  return `${runhead('Papers received this quarter', 'Cr.')}
    ${plateHTML(S.season, 'seasons/' + S.season, 'Hatherley in ' + SEASONS[S.season].toLowerCase())}
    <p class="platecap"><span>Hatherley, ${esc(stamp())}</span><span>fo. ${Math.min(S.t + 1, 84)} of 84</span></p>
    ${S.notes.map(n => `<p class="note">${esc(n)}</p>`).join('')}${warn}
    ${S.news ? `<aside class="sheet clip"><span>The Reading Mercury</span><p>${esc(S.news)}</p></aside>` : ''}
    ${S.vignette ? `<div class="prose vignette">${paras(S.vignette)}</div>` : ''}
    ${digestHTML()}
    <div class="row">${S.dead ? `<button class="go" onclick="next()"><span>Face the creditors</span></button>` : `<button class="go" onclick="shutBook()"><span>Shut the book</span></button>`}</div>`; }

function paperHTML(){ const e = byId(S.pending), bill = BILLS.has(e.id), text = e.text(), who = bill ? null : whoOf(e.title + ' ' + text);
  return `${runhead(bill ? 'Posted this quarter' : 'Papers received this quarter', `fo. ${Math.min(S.t + 1, 84)}`)}
    <article class="sheet${bill ? ' bill' : ''}">
      ${who ? `<div class="from">${medal(who, true)}<div><p class="kicker">${esc(stamp())}. ${esc(PEOPLE[who].name)}</p><h2>${esc(e.title)}</h2></div></div>` : `<p class="kicker">${esc(stamp())}</p><h2>${esc(e.title)}</h2>`}
      <div class="prose">${(e.cut && pic('events/' + e.cut(), '')) || pic('events/' + e.id, '')}${paras(text)}</div>
    </article>`; }
function eventHTML(){ const e = byId(S.pending); const cs = e.choices.filter(c => !c.if || c.if());
  return `${runhead('Your answer', 'Cr.')}
    <dl class="bal slim"><div><dt>In hand</dt><dd class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</dd></div><div><dt>Owing on the mortgage</dt><dd class="owe">${fmt(S.mortgage)}</dd></div></dl>
    <div class="choices">${cs.map((c, i) => `<button class="choice" onclick="choose(${i})"><span>${esc(lab(c))}</span>${noteOf(c)}</button>`).join('')}</div>`; }

function outcomeHTML(){ const o = S.outcome;
  return `${runhead(S.phase === 'undone' ? 'The season’s undertaking' : 'What came of it', 'Cr.')}
    <p class="kicker">${esc(stamp())}</p><h2>${esc(o.title)}</h2><div class="swell"></div>
    <div class="prose lead">${o.cut ? pic('undertakings/' + o.cut, '') : ''}${paras(o.text)}</div>
    ${o.d.length ? `<ul class="deltas">${o.d.map(([t, up]) => `<li class="${up ? 'up' : 'down'}">${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="row"><button class="go" onclick="next()"><span>${S.dead ? 'And then' : S.phase === 'undone' ? (S.t === 83 ? 'Close the books' : 'Turn the page') : 'Carry on'}</span></button></div>`; }

function undertakeHTML(){ const o = undertakingOptions();
  return `${runhead('The season’s undertaking', 'Cr.')}
    <p class="kicker">${esc(stamp())}</p><h2>The Season Is Yours</h2>
    <div class="prose"><p>${['Nothing more', 'One thing more', 'Two things more', 'Three things'][typeof ridesLeft === 'function' ? Math.max(0, Math.min(3, ridesLeft())) : 1]} may be undertaken this quarter. Works on the estate may be put in hand at any time.</p></div>
    <div class="choices">${o.map((c, i) => `<button class="choice" onclick="undertake(${i})"><span>${esc(c.t)}<small>${esc(c.hint || '')}</small></span>${noteOf(c)}</button>`).join('')}</div>`; }

function endHTML(){ const r = reckoning();
  return `${runhead('Pasted inside the back board', 'Finis')}
    ${typeof endPlateHTML === 'function' ? endPlateHTML() : ''}
    <article class="sheet bill ending">
      <p class="kicker">From the Reading Mercury and Oxford Gazette, ${S.dead ? esc(stamp()) : 'January 1816'}</p>
      <h2>${esc(r.title)}</h2>
      <div class="prose">${r.P.map(p => '<p>' + esc(p) + '</p>').join('')}</div>
      ${r.score !== null ? `<p class="score">Esteem of the county <b>${r.score}</b><span> in the hundred</span></p>` : ''}
    </article>
    <div class="row"><button class="go" onclick="wipe()"><span>Inherit again</span></button>${S.plates && S.plates.length ? `<button class="quiet" onclick="showProgress()">The Progress, in ${S.plates.length} plates</button>` : ''}</div>`; }

function meter(label, v, words, key, flag, trouble){ const m = typeof marks === 'function' && key ? marks() : null, at = m ? Math.max(0, Math.min(100, m[key])) : null;
  const bar = `<i><u style="width:${v}%"></u>${at === null ? '' : `<s style="left:${at}%" title="Settles at ${at}"></s>`}</i>`, bad = flag && F(flag) ? `<em>${trouble}</em>` : '';
  if (!m) return `<div class="meter${v < 40 ? ' low' : ''}"><span>${label}</span>${bar}<b>${esc(band(v, words))}</b></div>`;
  return `<details name="lot" class="meter${v < 40 ? ' low' : ''}"><summary><span>${label}${bad}</span>${bar}<b>${esc(band(v, words))}</b></summary>
    <ul class="fx"><li>Stands at ${Math.round(v)}, settles at ${at}</li>${m.why[key].map(t => `<li class="${/^\+/.test(t) ? 'pos' : /^[−-]/.test(t) ? 'neg' : ''}">${esc(t)}</li>`).join('')}</ul></details>`; }

function versoHTML(){
  const head = runhead('Dr.', `fo. ${Math.min(S.t + 1, 84)}`, `Hatherley Combe, in Account with ${esc(S.name)}, Esq.`);
  if (TAB === 'paper' && S.phase === 'event') return paperHTML();
  if (TAB === 'farms') return head + `<h2 class="qtitle">The Rent Roll${typeof farmsList === 'function' ? '' : '<sup>specimen</sup>'}</h2>` + farmsHTML();
  if (TAB === 'ventures') return head + `<h2 class="qtitle">Ventures${typeof venturesList === 'function' ? '' : '<sup>specimen</sup>'}</h2><p class="lede">Money put out at hazard. Some of it comes home every year and some is never seen again.</p>` + venturesHTML();
  if (TAB === 'society') return head + `<h2 class="qtitle">Figure and Consequence${typeof societyList === 'function' ? '' : '<sup>specimen</sup>'}</h2><p class="lede">What the county sees of you. Most of it costs something every year to keep.</p>` + societyHTML();
  if (TAB === 'household' && typeof householdList === 'function') return head + `<h2 class="qtitle">The Household</h2>` + householdHTML();
  if (TAB === 'works') return head + `<h2 class="qtitle">Works on the Estate</h2><p class="lede">Building and mending, paid for by the quarter. Two may be in hand at once.</p>` + worksHTML();
  if (TAB === 'persons') return head + `<h2 class="qtitle">Persons of Consequence</h2>` + peopleHTML();
  if (TAB === 'wheat') return head + `<h2 class="qtitle">Wheat at Wyvern Market</h2>` + chartHTML();
  if (TAB === 'daybook') return head + `<h2 class="qtitle">The Squire’s Day-Book</h2>` + journalHTML();
  const over = S.phase === 'end';
  return head + `<h2 class="qtitle">${esc(QUARTER[S.season])} Quarter, ${S.year}</h2>
    ${accountHTML()}
    <dl class="bal purse"><div><dt>In hand</dt><dd class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</dd></div><div><dt>Owing${typeof mortCap === 'function' ? `, limit ${fmt(mortCap())}` : ' on the mortgage'}</dt><dd class="owe">${fmt(S.mortgage)}</dd></div>
      ${over || typeof creditList === 'function' ? '' : `<div class="mort" role="group" aria-label="Mortgage"><button class="inkbtn" onclick="mortgage(-1)" ${S.money >= 500 && S.mortgage >= 500 ? '' : 'disabled'}>Pay off £500</button><button class="inkbtn" onclick="mortgage(1)" ${(typeof canBorrow === 'function' ? canBorrow() : S.mortgage < 9000) ? '' : `disabled title="${esc(typeof borrowWhy === 'function' ? borrowWhy() : '')}"`}>Borrow £500</button></div>`}${over || typeof creditList !== 'function' ? '' : creditHTML()}</dl>
    <div class="wheatbox"><h3 class="orn">Wheat at Wyvern Market</h3><div>${chartHTML()}</div></div>
    <div class="memo"><h3 class="orn">${esc('Mr ' + steward())}’s memoranda</h3>
      ${meter('Standing in the county', S.standing, STANDING_W, 'standing', 'cut', 'Cut by the county')}
      ${meter('Goodwill of the parish', S.goodwill, GOODWILL_W, 'goodwill', 'sullen', 'The parish is sullen')}
      ${meter('Peace of the household', S.family, FAMILY_W, 'family', 'henriettaAway', 'Henrietta is away')}
      ${S.traits && S.traits.length ? `<p class="fine born">The squire: ${S.traits.map(id => esc(traitById(id).name)).join('. ')}.</p>` : ''}</div>`; }

/* Money in the lists: green with a plus where it comes in, red with a minus where it goes out. */
const amt = (n, sign) => `<span class="amt ${sign > 0 ? 'pos' : 'neg'}">${sign > 0 ? '+' : '−'}${fmt(Math.abs(n))}</span>`;
const tint = (t, sign) => esc(t).replace(/£[\d,]+/g, m => `<span class="amt ${sign > 0 ? 'pos' : 'neg'}">${sign > 0 ? '+' : '−'}${m}</span>`);
const fxHTML = v => v.fx && v.fx.length ? `<ul class="fx">${v.fx.map(t => `<li class="${/^\+/.test(t) ? 'pos' : /^[−-]/.test(t) ? 'neg' : ''}">${esc(t)}</li>`).join('')}</ul>` : '';
function hazardHTML(v){
  if (v.odds) { const o = v.odds, pc = x => Math.round((x || 0) * 100); return `<span class="hazard"><span>Hazard</span><span class="oddsbar" role="img" aria-label="${pc(o.well)} in 100 well, ${pc(o.dull)} middling, ${pc(o.ill)} ill"><i class="w" style="flex:${pc(o.well)}"></i><i class="d" style="flex:${pc(o.dull)}"></i><i class="l" style="flex:${pc(o.ill)}"></i></span></span>`; }
  if (!Number.isFinite(v.risk)) return '';
  return `<span class="hazard" role="img" aria-label="Hazard ${v.risk} of 4"><span>Hazard</span>${[1, 2, 3, 4].map(i => `<i class="pip${i <= v.risk ? ' on' : ''}"></i>`).join('')}</span>`; }
function creditHTML(){ const all = creditList(), by = id => all.find(c => c.id === id);
  const b = (c, label) => c ? `<button type="button" onclick="takeCredit('${c.id}')" ${c.can ? '' : `disabled title="${esc(c.why || '')}"`}>${label} ${amt(c.gets, c.gets)}</button>` : '';
  return `<div class="creditbox">${b(by('mortgage'), 'Borrow more')}${b(by('repay'), 'Pay off principal')}</div>`; }
/* The dearer ways of raising money: the oaks at the foot of Works, the annuity at the foot of Society. */
function raiseHTML(ids){ if (typeof creditList !== 'function') return ''; const rest = creditList().filter(c => ids.includes(c.id)); if (!rest.length) return '';
  return `<h3 class="orn">Raising money</h3><div class="lots">${rest.map(c => `<details name="lot"><summary><b>${esc(c.name)}</b><span>${c.gets ? amt(c.gets, c.gets) : ''}</span></summary><div>${fxHTML(c)}<p class="terms">${esc(c.note || '')}${c.why && !c.can ? ` <em>${esc(c.why)}</em>` : ''}</p><button class="inkbtn" onclick="takeCredit('${c.id}')" ${c.can ? '' : 'disabled'}>${esc(c.verb)}</button></div></details>`).join('')}</div>`; }
function worksHTML(at){ const list = worksList().filter(w => !at || at(w.id)), hand = list.filter(w => w.state === 'inHand'), open = list.filter(w => w.state === 'open'), done = list.filter(w => w.state === 'done');
  const whys = [...new Set(open.map(w => w.why))], common = whys.length === 1 && whys[0];
  return `${common ? `<p class="note bad">${esc(common)}</p>` : ''}<div class="lots">
    ${hand.map(w => `<div class="lot hand"><b>${esc(w.name)}</b><span>${w.left} season${w.left > 1 ? 's' : ''} more</span></div>`).join('')}
    ${open.map(w => `<details name="lot"${w.off ? ' class="off"' : ''}><summary><b>${esc(w.name)}</b><span>${amt(w.cost, -1)}</span></summary><div>${fxHTML(w) || `<p>${esc(w.gain)}.</p>`}<p class="terms">${tint(w.note, -1)}.${w.why && !common ? ` <em>${esc(w.why)}</em>` : ''}</p><button class="inkbtn" onclick="beginWork('${w.id}')" ${w.can ? '' : 'disabled'}>Put in hand</button></div></details>`).join('')}
    ${done.map(w => `<div class="lot done"><b>${esc(w.name)}</b><span>Finished</span></div>`).join('')}</div>${at && !at('timber') ? '' : raiseHTML(['timber'])}`; }

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
function farmsHTML(only){ const live = typeof farmsList === 'function', list = live ? farmsList() : DRAFT_FARMS, sale = live && typeof farmsForSale === 'function' ? farmsForSale() : [];
  const lv = f => !f.canLevel ? '' : `<span class="lv" role="group" aria-label="Rent">${[['easy', 'Easy'], ['fair', 'Fair'], ['rack', 'Rack']].map(([v, n]) => `<button class="${f.level === v ? 'on' : ''}" aria-pressed="${f.level === v}" onclick="setLevel('${f.id}', '${v}')">${n}</button>`).join('')}</span>`;
  const raised = f => f.sellToYou === undefined ? f.sellPrice : f.sellToYou + (f.sellToMortgage || 0), sum = f => raised(f) ? amt(raised(f), 1) : fmt(0), tf = typeof trustFund === 'function' ? trustFund() : null;
  const held = f => `<details name="lot"><summary><b>${esc(f.name)} <small>${amt(f.rent, 1)} a year</small></b><span>${f.sellPrice ? `<i class="tag">Sell</i>${sum(f)}` : fmt(f.rent)}</span></summary><div><p>${esc(f.land)}, ${f.acres} acres. ${esc(f.tenant)}.</p><p class="terms">${esc([f.held, f.arrears ? fmt(f.arrears) + ' in arrear' : ''].filter(Boolean).join('. '))}.${f.sellWhy ? ` <em>${esc(f.sellWhy)}</em>` : ''}</p>${f.sellPrice ? `<ul class="fx">${f.sellToYou === undefined ? `<li class="pos">+${fmt(f.sellPrice)} if sold</li>` : `${f.sellToYou ? `<li class="pos">+${fmt(f.sellToYou)} in hand if sold</li>` : ''}${f.sellToMortgage ? `<li class="pos">+${fmt(f.sellToMortgage)} off the mortgage if sold</li>` : ''}${raised(f) ? '' : '<li>Settled land. The price goes to the trustees</li>'}`}<li class="neg">−${fmt(f.rent)} a year in rent</li></ul>` : ''}${lv(f)}
    <span class="acts">${f.canOffer ? `<button class="inkbtn" onclick="offerLease('${f.id}')">Offer a lease</button>` : ''}${f.sellPrice ? `<button class="inkbtn" onclick="sellFarm('${f.id}')" ${f.canSell ? '' : 'disabled'}>Sell for ${sum(f)}</button>` : ''}</span>
    ${f.evict && f.evict.can ? `<details class="evict"><summary>Notice to quit</summary>${fxList(f.evict.fx)}<button class="inkbtn" onclick="evictTenant('${f.id}')">Serve it</button></details>` : ''}</div></details>`;
  const lot = f => `<details name="lot"><summary><b>${esc(f.name)}</b><span><i class="tag">Buy</i>${amt(f.price, -1)}</span></summary><div><p>${esc(f.land)}, ${f.acres} acres.${f.order ? ' ' + esc(f.order) + '.' : ''}</p>${f.value ? `<ul class="fx"><li class="neg">−${fmt(f.price)} to buy</li><li class="pos">+${fmt(f.value)} a year in rent</li></ul>` : ''}<p class="terms">${f.down !== undefined ? amt(f.down, -1) + ' down' + (f.loan ? ', ' + amt(f.loan, -1) + ' on mortgage' : '') + '.' : ''}${f.why ? ` <em>${esc(f.why)}</em>` : ''}</p><button class="inkbtn" onclick="buyFarm('${f.id}')" ${f.can ? '' : 'disabled'}>Buy it</button></div></details>`;
  if (only) { const f = list.find(x => x.id === only), s = sale.find(x => x.id === only); return `<div class="lots flat">${f ? held(f) : s ? lot(s) : ''}</div>`.replace('<details name="lot">', '<details name="lot" open>'); }
  return `<dl class="bal slim"><div><dt>The rental</dt><dd>${amt(list.reduce((a, f) => a + f.rent, 0), 1)}</dd></div><div><dt>Acres let</dt><dd>${list.reduce((a, f) => a + f.acres, 0).toLocaleString('en-GB')}</dd></div><div><dt>Farms</dt><dd>${list.length} of 8</dd></div></dl>
    <div class="lots flat">${list.map(held).join('')}</div>${sale.length ? `<h3 class="orn">To be had</h3><div class="lots">${sale.map(lot).join('')}</div>` : ''}`; }
/* One list serves Ventures and Society: a name and a price, opened one at a time. */
function lotsHTML(list, live, begin, end, verb){
  const row = v => v.state === 'ended' ? `<div class="lot done"><b>${esc(v.name)}</b><span>${esc(v.note || 'Ended')}</span></div>`
    : `<details name="lot"${v.off ? ' class="off"' : ''}><summary><b>${esc(v.name)}</b><span>${v.state === 'inHand' ? esc(v.held || 'In hand') : v.cost ? amt(v.cost, -1) : fmt(0)}</span></summary><div>${fxHTML(v) || `<p>${esc(v.well || '')}${v.ill ? ' ' + esc(v.ill) : ''}</p>`}${hazardHTML(v)}<p class="terms">${tint([v.where, v.note].filter(Boolean).join('. ').replace(/\.$/, ''), -1)}${v.where || v.note ? '.' : ''}${v.why ? ` <em>${esc(v.why)}</em>` : ''}${v.endWhy ? ` <em>${esc(v.endWhy)}</em>` : ''}</p>
      ${!live ? '' : v.state === 'inHand' ? (v.endLabel ? `<button class="inkbtn" onclick="${end}('${v.id}')" ${v.canEnd ? '' : 'disabled'}>${tint(v.endLabel, end === 'endSociety' ? 1 : -1)}</button>` : '') : `<button class="inkbtn" onclick="${begin}('${v.id}')" ${v.can ? '' : 'disabled'}>${esc(v.verb || verb)}</button>`}</div></details>`;
  return `<div class="lots">${list.map(row).join('')}</div>`; }
function venturesHTML(){ const live = typeof venturesList === 'function'; return lotsHTML(live ? venturesList() : DRAFT_VENTURES, live, 'beginVenture', 'endVenture', 'Venture it'); }
const DRAFT_SOCIETY = [
  {name: 'A knighthood', cost: 1500, well: 'Sir Thomas, and Lady Merridew.'},
  {name: 'A coach and four, with the arms on the door', cost: 420, well: 'Seen at every door in the county.'},
  {name: 'A house in Bath for the season', cost: 300, well: 'Henrietta among people.'},
  {name: 'A pack of harriers', cost: 260, well: 'Forty gentlemen to breakfast twice a week.'},
  {name: 'A commission for Edmund', cost: 450, well: 'An ensigncy in a marching regiment.'},
  {name: 'The family plate', cost: 600, state: 'inHand', held: 'In the strong room', well: 'It would fetch about six hundred pounds at Rundell’s.'}];
function societyHTML(){ const live = typeof societyList === 'function'; return lotsHTML(live ? societyList().filter(r => !r.house || typeof householdList !== 'function') : DRAFT_SOCIETY, live, 'beginSociety', 'endSociety', 'Pay for it') + raiseHTML(['annuity', 'redeem']); }

/* The Household: the footing the house is kept on, what its people are paid, and what is kept in it. */
const fxList = fx => fx && fx.length ? `<ul class="fx">${fx.map(t => `<li class="${/^\+/.test(t) ? 'pos' : /^[−-]/.test(t) ? 'neg' : ''}">${esc(t)}</li>`).join('')}</ul>` : '';
function householdHTML(){ const h = householdList(), yearly = t => /a year/.test(t), pounds = t => { const m = /^([+−-])£([\d,]+)/.exec(t); return m ? (m[1] === '+' ? 1 : -1) * +m[2].replace(/,/g, '') : 0; };
  const rest = fx => fxList((fx || []).filter(t => !yearly(t) && t !== 'No change')), fig = n => n > 0 ? amt(n, 1) : n < 0 ? amt(n, -1) : fmt(0);
  const whyOf = list => { const y = list.find(l => !l.now && l.why); return y ? `<p class="terms"><em>${esc(y.why)}</em></p>` : ''; };
  let total = -h.cost;
  const est = `<div class="seg n${h.establishment.length}">${h.establishment.map(e => `<button type="button" class="rung${e.now ? ' now' : ''}" onclick="setEstablishment('${e.id}')" ${e.can ? '' : 'disabled'}${e.why ? ` title="${esc(e.why)}"` : ''}><b>${esc(e.name)}</b><span class="yr">${fig(-e.cost)}</span>${e.now ? '' : rest(e.fx)}</button>`).join('')}</div>${whyOf(h.establishment)}`;
  const wages = h.wages.map(w => { const cur = w.levels.find(l => l.now), money = l => pounds((l.fx || []).find(yearly) || '');
    if (cur && w.id === 'labour' && !w.off) total += money(cur);
    return `<div class="dial${w.off ? ' off' : ''}"><b>${esc(w.name)}</b><div class="seg n3">${w.levels.map(l => `<button type="button" class="rung${l.now ? ' now' : ''}" onclick="setHousehold('${w.id}', '${l.id}')" ${l.can ? '' : 'disabled'} title="${esc(l.why || l.name)}"><b>${esc(l.label)}</b><span class="yr">${fig(money(l))}</span>${rest(l.fx)}</button>`).join('')}</div>${whyOf(w.levels)}</div>`; }).join('');
  const lots = h.lots.map(v => { const fx = rest(v.fx), keep = v.keep ? `<small>${fmt(v.keep)} a year to keep</small>` : '';
    const seg = v.state === 'ended' ? `<button type="button" class="rung now" disabled><b>${esc(v.note || 'Sold')}</b></button>`
      : v.state === 'inHand' ? `<button type="button" class="rung now" disabled><b>Kept</b>${keep}</button><button type="button" class="rung" onclick="endSociety('${v.id}')" ${v.canEnd ? '' : 'disabled'}><b>${v.sell ? 'Sell' : 'Give up'}</b>${v.sell ? `<span class="yr">${amt(v.sell, 1)}</span>` : ''}</button>`
      : `<button type="button" class="rung" onclick="beginSociety('${v.id}')" ${v.can ? '' : 'disabled'}${v.why ? ` title="${esc(v.why)}"` : ''}><b>Buy</b><span class="yr">${v.cost ? amt(v.cost, -1) : fmt(0)}</span>${keep}${fx}</button><button type="button" class="rung now" disabled><b>Not kept</b></button>`;
    return `<div class="dial"><b>${esc(v.name)}</b><div class="seg n2">${seg}</div>${v.state === 'open' && v.why ? `<p class="terms"><em>${esc(v.why)}</em></p>` : ''}</div>`; }).join('');
  return `<div class="hh lots flat"><p class="hhsum"><b>${fig(total)}</b><small>A year</small></p>
    <h3 class="orn">The footing of the house</h3>${est}<h3 class="orn">Wages and keep</h3>${wages}
    ${h.lots.length ? `<h3 class="orn">Kept in the house</h3>${lots}` : ''}</div>`; }

const regardScale = c => `<span class="scale ${c.r > 0 ? 'pos' : c.r < 0 ? 'neg' : ''}" role="img" aria-label="Regard ${c.r + 6} of 11">${REGARD.map((_, i) => `<i class="${i <= c.r + 5 ? 'on' : ''}"></i>`).join('')}</span>`;
function peopleHTML(){
  if (WHO && S.chars[WHO] && S.chars[WHO].met) { const c = S.chars[WHO], p = PEOPLE[WHO], full = pic('portraits/' + WHO, p.name), notes = c.notes.slice().reverse();
    return `<div class="who">${full ? `<figure class="plate">${full}</figure>` : medal(WHO, true)}<div><h3>${esc(p.name)}</h3><p class="role">${esc(p.role())}</p>
      <p class="regard"><span class="r r${c.r + 5}">${REGARD[c.r + 5]}</span>${regardScale(c)}</p>
      ${p.bio ? `<p class="bio">${esc(typeof p.bio === 'function' ? p.bio() : p.bio)}</p>` : ''}
      ${notes.length ? `<ul class="dealings">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : `<p class="role">No dealings entered.</p>`}
      <button class="inkbtn" onclick="showWho('')">All persons</button></div></div>`; }
  return `<ul class="people">${Object.keys(S.chars).filter(id => S.chars[id].met).map(id => { const c = S.chars[id], p = PEOPLE[id];
    return `<li><button onclick="showWho('${id}')">${medal(id)}<span class="pp"><b>${esc(p.name)}</b><small>${esc(p.role())}</small><span class="r r${c.r + 5}">${REGARD[c.r + 5]}</span>${regardScale(c)}</span></button></li>`; }).join('')}</ul>`; }

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

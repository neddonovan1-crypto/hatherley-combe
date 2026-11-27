/* The page: drawing the state on to paper. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const paras = t => t.split(/\n\n+/).map(p => '<p>' + esc(p) + '</p>').join('');
const band = (v, words) => words[Math.min(words.length - 1, Math.floor(v / (100 / words.length)))];

function render(){
  const stage = $('stage');
  if (!S) { document.body.classList.add('intro'); stage.innerHTML = introHTML(); $('side').innerHTML = ''; $('journal').innerHTML = ''; $('plate').innerHTML = 'Lady Day, 1795'; drawTimeline(0); return; }
  document.body.classList.remove('intro');
  $('plate').innerHTML = S.phase === 'end' ? 'The Reckoning' : esc(QUARTER[S.season]) + ' <span>' + esc(stamp()) + '</span>';
  drawTimeline(S.t);
  stage.innerHTML = ({ledger:ledgerHTML, event:eventHTML, outcome:outcomeHTML, undertake:undertakeHTML, undone:outcomeHTML, end:endHTML})[S.phase]();
  $('side').innerHTML = S.phase === 'end' ? '' : sideHTML();
  $('journal').innerHTML = journalHTML();
  const first = stage.querySelector('button'); if (first && S.phase !== 'ledger') first.focus({preventScroll:true});
}

function drawTimeline(t){ const n = (LAST_YEAR - FIRST_YEAR + 1) * 4; let h = '';
  for (let y = FIRST_YEAR; y <= LAST_YEAR; y += 5) h += `<i style="left:${((y - FIRST_YEAR) * 4 / n * 100).toFixed(2)}%">${y}</i>`;
  $('timeline').innerHTML = `<b style="width:${(Math.min(t + 1, n) / n * 100).toFixed(2)}%"></b>${h}`; }

function introHTML(){ const has = !!load();
  return `<article class="card opening">
    <p class="kicker">Berkshire, Lady Day 1795</p>
    <h2>An Inheritance</h2>
    <p>Your uncle Barnaby is dead at seventy-one, face down in a syllabub at his own Michaelmas dinner, which the county agreed was how he would have wished to go, though perhaps not in front of the Bishop.</p>
    <p>He has left you Hatherley Combe: two thousand one hundred acres of chalk and clay, eleven tenant farms, a mill, a common that nobody owns and everybody uses, a house with a smoking chimney in every room but the one you want, a mortgage of four thousand pounds, and a steward named Crabbe who smiles as a ledger would, if it could.</p>
    <p>England has been two years at war with the French Republic. Bread is dear and growing dearer. You have a wife, Henrietta, who had hoped for a baronet; a daughter, Kitty, seventeen, who has read every novel in the Newbury circulating library and believed most of them; and a son, Edmund, nineteen, who wants very badly to be shot at.</p>
    <p>You have twenty-one years, a season at a time. Nobody will tell you what a good squire is. Several people will tell you what a bad one is, afterwards.</p>
    <form id="begin" class="names" onsubmit="event.preventDefault(); start();">
      <label for="first">Christian name</label><input id="first" value="Thomas" maxlength="18" autocomplete="off">
      <label for="sur">Surname</label><input id="sur" value="Merridew" maxlength="18" autocomplete="off">
      <fieldset class="traits">
        <legend>What manner of man inherits</legend>
        <p class="fine">You have <b id="pts">${pointsLeft(PICKS)}</b> <span id="ptsw">${pointsLeft(PICKS) === 1 ? 'point' : 'points'}</span> to lay out. Advantages cost them. Encumbrances pay them back. Take none, if you prefer to start as plain as your uncle left you.</p>
        <h3>Advantages</h3><div class="tgrid">${TRAITS.filter(t => t.cost > 0).map(traitHTML).join('')}</div>
        <h3>Encumbrances</h3><div class="tgrid">${TRAITS.filter(t => t.cost < 0).map(traitHTML).join('')}</div>
      </fieldset>
      <div class="row"><button class="go" id="takeit" type="submit">Take possession</button>${has ? '<button class="quiet" type="button" onclick="resume()">Resume the estate you left</button>' : ''}</div>
    </form>
  </article>`; }
let PICKS = [];
function traitHTML(t){ const on = PICKS.includes(t.id);
  return `<button type="button" class="trait${on ? ' on' : ''}" id="trait-${t.id}" aria-pressed="${on}" onclick="toggleTrait('${t.id}')">
    <span class="tn">${esc(t.name)}<i>${t.cost > 0 ? 'costs ' + t.cost : 'gives ' + (-t.cost)}</i></span><span class="tb">${esc(t.blurb)}</span><span class="te">${esc(t.effect)}</span></button>`; }
function toggleTrait(id){ const t = traitById(id);
  if (PICKS.includes(id)) PICKS = PICKS.filter(x => x !== id); else { PICKS = PICKS.filter(x => x !== t.excl); PICKS.push(id); }
  syncTraits(); }
function syncTraits(){ const left = pointsLeft(PICKS);
  for (const t of TRAITS){ const b = $('trait-' + t.id); if (!b) continue; const on = PICKS.includes(t.id); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }
  $('pts').textContent = left; $('ptsw').textContent = Math.abs(left) === 1 ? 'point' : 'points'; $('pts').classList.toggle('neg', left < 0);
  $('takeit').disabled = left < 0; $('takeit').textContent = left < 0 ? 'Overdrawn: shed an advantage or take on a burden' : 'Take possession'; }
function start(){ if (pointsLeft(PICKS) < 0) return; const f = ($('first').value || 'Thomas').trim(), s = ($('sur').value || 'Merridew').trim(); newGame(f, s, PICKS.slice()); render(); window.scrollTo({top:0}); }
function resume(){ const s = load(); if (s) { S = s; render(); } }

function ledgerHTML(){ let rows = '', tot = 0;
  for (const [l, a] of S.ledger){ tot += a; rows += `<tr><td>${esc(l)}</td><td class="${a < 0 ? 'neg' : 'pos'}">${fmt(a)}</td></tr>`; }
  rows += `<tr class="total"><td>Carried to the purse</td><td class="${tot < 0 ? 'neg' : 'pos'}">${fmt(tot)}</td></tr>`;
  const warn = S.dead === 'ruin' ? `<p class="note bad">The tradesmen of Wyvern have met at the George and resolved, unanimously, to give no further credit. The mortgagees have sent a man to look at the roof.</p>` : '';
  return `<article class="card">
    <p class="kicker">${esc(QUARTER[S.season])} ${S.year}. ${esc(F('crabbeGone') ? 'Mr Lark' : 'Mr Crabbe')} presents the quarter</p>
    <h2>The Accounts</h2>
    <div class="tablewrap"><table class="ledger">${rows}</table></div>
    ${S.notes.map(n => `<p class="note">${esc(n)}</p>`).join('')}${warn}
    ${S.news ? `<aside class="news"><span>The Reading Mercury</span>${esc(S.news)}</aside>` : ''}
    ${S.vignette ? `<div class="prose vignette">${paras(S.vignette)}</div>` : ''}
    <div class="row"><button class="go" onclick="next()">${S.dead ? 'Face the creditors' : S.pending ? 'See who is waiting in the hall' : 'Decide how to spend the season'}</button></div>
  </article>`; }

function eventHTML(){ const e = byId(S.pending); const cs = e.choices.filter(c => !c.if || c.if());
  return `<article class="card">
    <p class="kicker">${esc(stamp())}</p><h2>${esc(e.title)}</h2>
    <div class="prose">${paras(e.text())}</div>
    <div class="choices">${cs.map((c, i) => `<button class="choice" onclick="choose(${i})"><span>${esc(lab(c))}</span>${c.note ? `<em>${esc(c.note)}</em>` : ''}</button>`).join('')}</div>
  </article>`; }

function outcomeHTML(){ const o = S.outcome;
  return `<article class="card">
    <p class="kicker">${esc(stamp())}</p><h2>${esc(o.title)}</h2>
    <div class="prose">${paras(o.text)}</div>
    ${o.d.length ? `<ul class="deltas">${o.d.map(([t, up]) => `<li class="${up ? 'up' : 'down'}">${esc(t)}</li>`).join('')}</ul>` : ''}
    <div class="row"><button class="go" onclick="next()">${S.dead ? 'And then' : S.phase === 'undone' ? (S.t === 83 ? 'Close the books' : 'Let the season turn') : 'Carry on'}</button></div>
  </article>`; }

function undertakeHTML(){ const o = undertakingOptions();
  return `<article class="card">
    <p class="kicker">${esc(stamp())}</p><h2>The Season Is Yours</h2>
    <div class="prose"><p>${S.project ? esc(PROJECTS[S.project.id].name) + ' is in hand, and will want ' + S.project.left + ' more season' + (S.project.left > 1 ? 's' : '') + '. For the rest, one undertaking, and only one.' : 'One undertaking, and only one. A squire who tries to do two things in a season does both badly and is late for dinner.'}</p></div>
    <div class="choices">${o.map((c, i) => `<button class="choice${c.project ? ' work' : ''}" onclick="undertake(${i})"><span>${esc(c.t)}<small>${esc(c.hint || '')}</small></span>${c.note ? `<em>${esc(c.note)}</em>` : ''}</button>`).join('')}</div>
  </article>`; }

function endHTML(){ const r = reckoning();
  return `<article class="card ending">
    <p class="kicker">From the Reading Mercury and Oxford Gazette, ${S.dead ? esc(stamp()) : 'January 1816'}</p>
    <h2>${esc(r.title)}</h2>
    <div class="prose">${r.P.map(p => '<p>' + esc(p) + '</p>').join('')}</div>
    ${r.score !== null ? `<p class="score">Esteem of the county <b>${r.score}</b><span> in the hundred</span></p>` : ''}
    <div class="row"><button class="go" onclick="wipe()">Inherit again</button></div>
  </article>`; }

function meter(label, v, words){ return `<div class="meter"><div><span>${label}</span><b>${esc(band(v, words))}</b></div><i><u style="width:${v}%"></u></i></div>`; }

function sideHTML(){
  const pol = [[0.9, 'Indulgent'], [1, 'Customary'], [1.2, 'Rack']];
  const people = Object.keys(S.chars).filter(id => S.chars[id].met).map(id => { const c = S.chars[id], p = PEOPLE[id]; const note = c.notes[c.notes.length - 1];
    return `<li><div><b>${esc(p.name)}</b><span class="r r${c.r + 5}">${REGARD[c.r + 5]}</span></div><small>${esc(p.role())}</small>${note ? `<q>${esc(note)}</q>` : ''}</li>`; }).join('');
  return `<section class="panel">
      <h3>The Estate</h3>
      <dl class="money"><div><dt>Purse</dt><dd class="${S.money < 0 ? 'neg' : ''}">${fmt(S.money)}</dd></div><div><dt>Mortgage</dt><dd>${fmt(S.mortgage)}</dd></div></dl>
      <div class="seg" role="group" aria-label="Mortgage"><button onclick="mortgage(-1)" ${S.money >= 500 && S.mortgage >= 500 ? '' : 'disabled'}>Pay off £500</button><button onclick="mortgage(1)" ${S.mortgage < 9000 ? '' : 'disabled'}>Borrow £500</button></div>
      ${meter('Standing in the county', S.standing, STANDING_W)}
      ${meter('Goodwill of the parish', S.goodwill, GOODWILL_W)}
      ${meter('Peace of the household', S.family, FAMILY_W)}
      <h4>Rents</h4>
      <div class="seg" role="group" aria-label="Rent policy">${pol.map(([v, n]) => `<button class="${S.rentPolicy === v ? 'on' : ''}" onclick="setRent(${v})">${n}</button>`).join('')}</div>
      <p class="fine">Half-year rental due: ${fmt(halfRent())}. ${S.rentPolicy > 1 ? 'Rack-rents pay until they don’t.' : S.rentPolicy < 1 ? 'They drink your health at the audit.' : 'As your uncle left them.'}</p>
      ${S.traits && S.traits.length ? `<h4>The squire</h4><p class="fine born">${S.traits.map(id => esc(traitById(id).name)).join('. ')}.</p>` : ''}
    </section>
    <section class="panel"><h3>Wheat at Wyvern Market</h3>${chartHTML()}</section>
    <section class="panel"><h3>Persons of Consequence</h3><ul class="people">${people}</ul></section>`; }

function chartHTML(){ const W = 300, H = 110, pad = 18, n = LAST_YEAR - FIRST_YEAR + 1, bw = (W - pad) / n; let bars = '';
  const yOf = v => H - 16 - (v / 130) * (H - 28);
  for (let y = FIRST_YEAR; y <= S.year; y++){ const v = PRICES[y], x = pad + (y - FIRST_YEAR) * bw;
    bars += `<rect x="${x.toFixed(1)}" y="${yOf(v).toFixed(1)}" width="${(bw - 2).toFixed(1)}" height="${(H - 16 - yOf(v)).toFixed(1)}" class="${y === S.year ? 'now' : ''}"><title>${y}: ${v}s. the quarter</title></rect>`; }
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Price of wheat by year, in shillings the quarter">
    <line x1="${pad}" x2="${W}" y1="${yOf(80)}" y2="${yOf(80)}" class="rule"/><text x="${W}" y="${yOf(80) - 3}" text-anchor="end">80s.</text>
    <line x1="${pad}" x2="${W}" y1="${H - 16}" y2="${H - 16}" class="axis"/>${bars}
    <text x="${pad}" y="${H - 3}">1795</text><text x="${W}" y="${H - 3}" text-anchor="end">1815</text></svg>
    <p class="fine">This year: <b>${PRICES[S.year]}s.</b> the quarter. ${PRICES[S.year] >= 100 ? 'Famine price.' : PRICES[S.year] >= 80 ? 'Dear.' : PRICES[S.year] >= 65 ? 'Middling.' : 'Cheap. The farmers are in mourning.'}</p>`; }

function journalHTML(){ if (!S.journal.length) return '';
  return `<h3>The Squire’s Day-Book</h3><ol>${S.journal.slice(0, 14).map(j => `<li><time>${esc(j.when)}</time><span><b>${esc(j.title)}.</b> ${esc(j.did)}</span></li>`).join('')}</ol>
    ${S.phase !== 'end' ? '<button class="quiet" onclick="askWipe(this)">Abandon this estate and begin again</button>' : ''}`; }
function askWipe(b){ if (b.dataset.sure) return wipe(); b.dataset.sure = 1; b.textContent = 'Certain? Press again to give it all up'; }

function boot(data){ indexEvents(); if (data && data.S) S = data.S; render(); }
if (window.claude && window.claude.hot && window.claude.hot.snapshot) { try { window.claude.hot.snapshot(() => ({S})); } catch (err) {} }
if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(boot); else boot((window.claude && window.claude.hot && window.claude.hot.data) || {});

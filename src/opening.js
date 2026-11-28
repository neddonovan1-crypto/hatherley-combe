/* The opening. Two plates are struck before the first quarter: the will is read, and then the heir is made.
   They are laid out as every later plate is (plan.css), so that the game begins in the hand it goes on in. */
let OPENAT = 'will', OPENROW = '', LASTROW = '', PICKS = {};
/* Where the attorney's mouth is on the first cut, and where his words hang: hundredths of the cut, as in SAY_AT. */
const OPEN_SAY = {mouth:[34.6, 51.2], seat:[29, 3, 27, 25]};
const pickList = () => Object.values(PICKS).filter(Boolean);
/* Favours: three to begin. An advantage spends one or two, a burden earns them back; what cannot be afforded is greyed. */
const favour = n => n ? `<span class="fav ${n > 0 ? 'neg' : 'pos'}">${n > 0 ? '−' : '+'}${'●'.repeat(Math.abs(n))}</span>` : '';

function openingSaid(){ const [mx, my] = OPEN_SAY.mouth, [x, y, w, h] = OPEN_SAY.seat;
  if (!ART.has('ui/balloon.png')) return '';
  return `<q class="balloon said"><b style="left:${x}%;top:${y}%;width:${w}%;height:${h}%;visibility:visible"><span><i>And the residue, sir, real and personal, is yours.</i></span></b><svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true"><path d="${balloonTail(mx, my, x, y, w, h)}"/></svg></q>`; }

function willHTML(){ const has = !!load();
  return `<p class="series">A Squire’s Progress, in eighty-four Plates<b>Hatherley Combe</b></p>
    <div class="pcard">
      <figure class="print"><div class="mark"><span class="pn">Plate the First</span><div class="cutwrap">${pic('opening/will', 'The will is read')}${openingSaid()}</div>
        <figcaption><b>The Will is Read</b><small>${imprint('Michaelmas 1794')}</small></figcaption></div></figure>
      <div class="pside"><article class="sheet"><p class="kicker">Hatherley, in Berkshire</p><div class="prose">
        <p>Your uncle Barnaby died at his own table upon Michaelmas Day, between the goose and the syllabub, with the Bishop of Salisbury upon his right hand. His will is read in the library on the Tuesday following; and Mr Spurling the attorney, who has had it in a tin box these nineteen years, is four minutes about it.</p>
        <p>There are four cousins, who have come ninety miles between them to hear it; and they go out again by the library door with a mourning ring, a gilt snuff-box, a likeness of the deceased in crayons, and the pike of nineteen pounds which he took out of the Kennet in ’78, in its glass case. The pug is left to nobody.</p>
        <p class="nocap">“And the residue, sir, real and personal, is yours.”</p>
        <p class="nocap">It is two thousand one hundred acres of chalk and clay, in three farms and a mill; a house of fifty-four windows, of which Mr Pitt taxes every one; and a mortgage of four thousand pounds, at five per cent. Mr Spurling, who has taken the keys of it out of the tin box in two bunches, puts one into each of your hands, and bows.</p>
      </div></article>
      <div class="answer"><div class="choices"><button class="choice" id="keys" onclick="openHeir()"><span>Wish your cousins a safe journey.</span></button></div>
        ${has ? '<button class="quiet" type="button" onclick="resume()">Resume the estate you left</button>' : ''}</div></div>
    </div>`; }

function heirHTML(){
  return `<div class="pcard">
      <figure class="print"><div class="mark"><span class="pn">Plate the Second</span><div class="cutwrap">${pic('opening/heir', 'The heir')}</div>
        <figcaption><form id="begin" class="signed" onsubmit="event.preventDefault(); start();"><input id="first" value="Thomas" maxlength="18" autocomplete="off" spellcheck="false" aria-label="Christian name" oninput="nameFit()"><input id="sur" value="Merridew" maxlength="18" autocomplete="off" spellcheck="false" aria-label="Surname" oninput="nameFit()"><b>, Esq.</b><i id="namefit" aria-hidden="true"></i></form>
          <small>${imprint('Lady Day 1795')}</small></figcaption></div></figure>
      <div class="pside"><article class="sheet"><p class="kicker">Lady Day 1795</p><div class="prose">
        <p>It is Lady Day before you come down to take possession. Henrietta is gone through the house with a pencil, counting bedrooms; Kitty, who is seventeen, disputes the library window with Edmund, who is nineteen; and Mr Crabbe the steward waits in the hall with the rent book. Upstairs your man has laid out everything you own upon one chair, and stands before the glass with a coat in each hand, waiting to be told what manner of man he is to dress.</p></div>
        <div id="picks">${picksHTML()}</div></article>
      <div class="answer"><div class="row"><button class="go" id="takeit" type="submit" form="begin"><span>Take possession</span></button></div></div></div>
    </div>`; }

/* Each heading is a printed row. One opens at a time, upon the page, with the advantages to the left and the burdens to the right;
   and the row last settled keeps its paragraph under it. */
function picksHTML(){ const left = pointsLeft(pickList());
  return `<p class="favours"><span>Favours in hand</span><b id="pts" aria-label="${left}">${'●'.repeat(Math.max(0, left))}<i>${'○'.repeat(Math.max(0, TRAIT_POINTS - Math.max(0, left)))}</i></b></p>
    ${TRAIT_GROUPS.map(([g, label, plain]) => { const cur = PICKS[g] && traitById(PICKS[g]), room = left + (cur ? cur.cost : 0), open = OPENROW === g;
      const opt = (id, name, cost, fx) => `<button type="button" role="option" aria-selected="${(PICKS[g] || '') === id}" ${cost > room ? 'disabled' : ''} onclick="setPick('${g}', '${id}')"><b>${esc(name)}</b>${favour(cost)}${fx && fx.length ? `<small>${fx.map(t => `<i class="${signOf(t) || 'neg'}">${esc(t)}</i>`).join('')}</small>` : ''}</button>`;
      return `<div class="orow${open ? ' open' : ''}"><button type="button" class="ohead" aria-expanded="${open}" onclick="openRow('${g}')"><span>${label}</span><b>${esc(cur ? cur.name : plain)}</b>${cur ? favour(cur.cost) : ''}</button>
        ${open ? `<div class="oopts" role="listbox" aria-label="${label}"><p class="ohd"><span>${label}</span><button type="button" onclick="openRow('${g}')" aria-label="Shut the list">×</button></p>${opt('', plain, 0, '')}${[1, -1].map(sg => `<div>${TRAITS.filter(t => t.group === g && Math.sign(t.cost) === sg).map(t => opt(t.id, t.name, t.cost, t.fx)).join('')}</div>`).join('')}</div>`
          : LASTROW === g && cur ? `<p class="pickblurb">${esc(cur.blurb)}</p>` : ''}</div>`; }).join('')}`; }
function drawPicks(){ const el = $('picks'); if (el) el.innerHTML = picksHTML(); }
function openRow(g){ OPENROW = OPENROW === g ? '' : g; drawPicks(); }
function setPick(g, id){ PICKS[g] = id || null; OPENROW = ''; LASTROW = g; drawPicks(); }

/* The name is the title of the plate, and each word of it is as broad as what is written there. */
function nameFit(){ const m = $('namefit'); if (!m) return; for (const id of ['first', 'sur']) { const el = $(id); m.textContent = el.value || 'M'; el.style.width = Math.ceil(m.getBoundingClientRect().width) + 4 + 'px'; } }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(nameFit);

function drawOpening(){ const el = $('opening'); if (!el) return;
  if (S) { if (!el.hidden) { el.hidden = true; el.innerHTML = ''; } OPENAT = 'will'; OPENROW = ''; return; }
  const key = OPENAT; if (!el.hidden && el.dataset.key === key) return;
  el.hidden = false; el.dataset.key = key; el.className = OPENAT; el.innerHTML = OPENAT === 'heir' ? heirHTML() : willHTML(); el.scrollTop = 0; nameFit();
  if (typeof warm === 'function') warm([artURL('opening/heir'), artURL('opening/will')]); }
function openHeir(){ OPENAT = 'heir'; drawOpening(); const b = $('first'); if (b && innerWidth > 700) b.select(); }
function start(){ if (pointsLeft(pickList()) < 0) return; const f = ($('first').value || '').trim() || 'Thomas', s = ($('sur').value || '').trim() || 'Merridew'; newGame(f, s, pickList()); render(); window.scrollTo({top:0}); }
function resume(){ const s = load(); if (s) { S = s; render(); } }

/* The title of the plan, lettered upon the sheet beside the arms, in the name of whoever now has it. */
function cartoucheHTML(){ const k = armsOf(), n = k === 'esquire' ? S.name + ', Esq.' : 'Sir ' + S.name + (k === 'baronet' ? ', Bart.' : ', Knt.');
  return `<p class="cartouche ${k}" data-k="cartouche"><small>A Plan of the Manor of</small><b>Hatherley Combe</b><small>in the County of Berks, the Estate of</small><i>${esc(n)}</i></p>`; }

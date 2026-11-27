/* Interim Works panel for the side column. The Steward's Book layout replaces this with its own Works tab. */
function worksPanelHTML(){ const list = worksList(); const hand = list.filter(w => w.state === 'inHand'), open = list.filter(w => w.state === 'open'), done = list.filter(w => w.state === 'done');
  const row = w => `<li class="work ${w.state}"><div><b>${esc(w.name)}</b>${w.state === 'open' ? `<button onclick="beginWork('${w.id}')" ${w.can ? '' : 'disabled'} title="${esc(w.why)}">Begin</button>` : ''}</div>
    <small>${w.state === 'inHand' ? w.left + ' season' + (w.left > 1 ? 's' : '') + ' more, at ' + fmt(w.per) + ' the quarter' : w.state === 'done' ? 'Finished' : esc(w.note) + '. ' + esc(w.gain) + '.'}</small>${w.state === 'open' ? `<q>${esc(w.blurb)}</q>` : ''}</li>`;
  const blocked = open.find(w => w.why);
  return `<section class="panel works"><h3>Works</h3>
    <p class="fine">Begin them when you please. They are paid for in the quarter's accounts and do not cost you the season.</p>
    ${hand.length ? `<ul class="people">${hand.map(row).join('')}</ul>` : ''}
    <details${hand.length >= MAX_WORKS ? '' : ' open'}><summary>${open.length} that might be put in hand</summary>${blocked && open.every(w => w.why === blocked.why) ? `<p class="fine">${esc(blocked.why)}</p>` : ''}<ul class="people">${open.map(row).join('')}</ul></details>
    ${done.length ? `<details><summary>${done.length} finished</summary><ul class="people">${done.map(row).join('')}</ul></details>` : ''}
  </section>`; }

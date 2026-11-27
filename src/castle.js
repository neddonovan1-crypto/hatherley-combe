/* ---------- the Castle ----------
   What the squire owes the Earl of Cullerne, and what may be had of him. Found on the plan at Cullerne Castle.
   Three standing matters, each set one of three ways: the burgage votes, suit at his court, the game in Cuckoo Copse.
   A setting moves a mark for as long as it stands (see marks() in estate.js), may cost money every quarter, and moves his lordship's regard by the
   difference between where it stood and where it stands, so that nothing is gained by turning it to and fro.
   Cuckoo Copse and sixty acres under it are copyhold of his Manor of Nether Cullerne: hence the quit rent, the suit, and his keepers in the copse.
   Written in the Hatherley hand (docs/voice/VOICE.md). */
const MANOR_PRICE = 2200, MANOR_RENTS = 60, QUIT_RENT = 7, NOTE_LENT = 1500, NOTE_BACK = 1650;
function castle(){ if (!S.castle) S.castle = {votes:'own', court:'essoin', game:'suffer', at:{}}; return S.castle; }
const CASTLE = {
  votes:{name:'Your three burgage votes', order:['castle', 'own', 'against'], rest:'own', if:() => !F('mp'), gone:'You sit for Wyvern yourself.',
    castle:{label:'The Castle’s', name:'Promised to Mr Bligh, under your hand', standing:3, cull:1, mem:'You promised Bligh your three votes',
      said:() => `You write to the Castle that Mr Bligh may reckon upon your three votes whenever a writ shall come down; and on Thursday a brace of pheasants is left at the kitchen door, with his lordship’s card tied about the neck of the cock.`},
    own:{label:'Your own', name:'Promised to nobody until the writ comes', cull:0,
      said:() => `Your votes, you write, are promised to nobody; and after three days the Castle returns, by a groom who does not dismount, his lordship’s compliments.`},
    against:{label:'Against him', name:'Promised to any gentleman who will oppose Mr Bligh', standing:-3, goodwill:3, cull:-2, mem:'You promised your votes against his nephew',
      said:() => `As it is known in Wyvern before dinner that your three votes are to be had by any gentleman who will oppose the Castle, the landlord of the George takes off his hat to you across the market place; and Lord Cullerne’s agent, who is standing beside him, puts his own on.`}},
  court:{name:'Suit at his lordship’s court', order:['attend', 'essoin', 'stay'], rest:'essoin', if:() => !castle().free && !castle().manor, gone:'You owe no suit at the Castle.',
    attend:{label:'Attend', name:'Answer to your name in the Castle hall, among his copyholders', family:-2, cull:1, mem:'You did suit at his court in person',
      said:() => `The Court Baron of Nether Cullerne is held in the Castle hall at eleven; and when the agent, reading down the roll between a wheelwright and a maltster, comes to your name, you answer to it, and are set down as present for Cuckoo Copse and sixty acres.

Henrietta dines that day in her own room.`},
    essoin:{label:() => 'Send ' + steward(), name:'Essoined at fourpence a court', cull:0,
      said:() => `${steward()} rides to the Castle with fourpence, is essoined for you in due form, and dines afterwards with the copyholders upon cold beef.`},
    stay:{label:'Stay away', name:'Amerced six pounds at every court, for default of suit', cost:12, bill:'Amercements at the Castle court', goodwill:1, cull:-1, mem:'You would not do suit at his court',
      said:() => `The roll is called at the Castle without you, and without ${steward()}; and the agent, having waited while a man might count twenty, writes against your name a default, and under it an amercement of six pounds.`}},
  game:{name:'The game in Cuckoo Copse', order:['join', 'suffer', 'warn'], rest:'suffer', if:() => !castle().manor, gone:'The game in Cuckoo Copse is your own.',
    join:{label:'Preserve', name:'Feed the pheasants with his keepers, and take a gun at the battue', cost:40, bill:'Barley and watchers at Cuckoo Copse', standing:3, goodwill:-3, cull:1, mem:'You took a gun at his battue',
      said:() => `Mudge and the Castle keepers lay barley along the rides of Cuckoo Copse; and on the first of October you stand at the corner of it with a gun, between his lordship and a clergyman from Hungerford, while forty pheasants, which have fed since Lady Day upon the wheat of three farms, are driven over your heads.`},
    suffer:{label:'Suffer it', name:'His keepers walk the copse, as in your uncle’s time', cull:0,
      said:() => `Word goes to the Castle that things at Cuckoo Copse shall be as they were; and by Saturday his lordship’s keepers are walking the rides again, with their dogs at heel and their guns under their arms.`},
    warn:{label:'Warn off', name:'A board at each gate, and an attorney’s notice', cost:20, bill:'Mr Spurling, in the matter of the copse', standing:-2, goodwill:3, cull:-2, mem:'You warned his keepers out of Cuckoo Copse',
      said:() => `Boards are nailed up at both gates of Cuckoo Copse; and when the Castle keepers come down the ride on Tuesday, Mudge meets them with a notice in Mr Spurling’s hand; which the elder of them, having read it through with his finger, folds twice and puts into his hat.`}} };
const castleOn = dial => !CASTLE[dial].if || CASTLE[dial].if();
const castleAt = dial => (castleOn(dial) && castle()[dial]) || CASTLE[dial].rest;
const castleOf = dial => CASTLE[dial][castleAt(dial)];
const castleLow = () => { const c = castle(); return !!c.low && S.t <= c.low; };
const castleUntil = () => { const t = castle().low; return QUARTER[t % 4] + ' ' + (FIRST_YEAR + Math.floor(t / 4)); };
const freePrice = () => { const p = clamp(450 - 60 * S.chars.cullerne.r, 250, 800); return castleLow() ? Math.round(p / 20) * 10 : p; };
const londonCost = () => Math.max(80, Math.round(S.mortgage * 0.03 / 10) * 10);
const letterTo = () => ({army:'the Horse Guards', navy:'a Lord of the Admiralty', church:'the Bishop of Salisbury'})[E()] || '';

/* What the Castle adds to the marks: rows of [meter, points, the reason shown]. */
function castleMark(){ const c = castle(), out = [];
  for (const dial in CASTLE) { const h = castleOf(dial), nm = CASTLE[dial].name + ': ' + (typeof h.label === 'function' ? h.label() : h.label).toLowerCase(); for (const k of ['standing', 'goodwill', 'family']) if (h[k]) out.push([k, h[k], nm]); }
  if (c.manor) { out.push(['standing', 4, 'Lord of the Manor of Nether Cullerne']); out.push(['goodwill', c.noHeriot ? 4 : 2, 'Your own court at the Bell']); }
  else if (c.free) out.push(['standing', 1, 'Cuckoo Copse made freehold']);
  if (F('castleDebt')) out.push(['standing', -3, 'The Castle holds your mortgage']);
  return out; }

function castleFx(dial, lvl){ const h = CASTLE[dial][lvl], out = [], d = (h.cull || 0) - (castleOf(dial).cull || 0);
  for (const k of ['standing', 'goodwill', 'family']) if (h[k]) out.push((h[k] > 0 ? '+' : '−') + Math.abs(h[k]) + ' ' + ({standing:'Standing', goodwill:'Goodwill of the parish', family:'Peace of the household'})[k]);
  if (d) out.push((d > 0 ? '+' : '−') + Math.abs(d) + ' Lord Cullerne'); if (d < 0 && F('castleDebt')) out.push('−£300 of his principal called in');
  return out; }
function castleList(){ const c = castle(), open = S.phase !== 'end' && !S.dead, shut = open ? '' : 'The books are closed.', r = S.chars.cullerne.r;
  const dials = Object.keys(CASTLE).map(dial => { const D = CASTLE[dial], on = castleOn(dial), bound = dial === 'votes' && c.bound && S.t < c.bound;
    return {id:dial, name:D.name, off:!on, gone:on ? '' : D.gone, levels:D.order.map(lvl => { const h = D[lvl], now = castleAt(dial) === lvl;
      const why = now ? '' : shut || (!on ? D.gone : '') || (bound ? 'His lordship’s letter for Edmund is not yet three years old.' : '') || (c.at[dial] === S.t ? 'Changed once this season already.' : '');
      return {id:lvl, label:typeof h.label === 'function' ? h.label() : h.label, name:h.name, now, can:!now && !why, why, yearly:h.cost || 0, fx:castleFx(dial, lvl)}; })}; });
  const lot = (id, o) => { const why = o.state !== 'open' ? '' : shut || o.why || (S.money < o.cost ? 'The purse will not stand ' + fmt(o.cost) + '.' : ''); return Object.assign({id, cost:0, verb:'Buy', can:o.state === 'open' && !why}, o, {why}); };
  const lots = [];
  if (letterTo() && !F('edmundDead')) lots.push(lot('letter', {name:'His lordship’s letter for Edmund', line:'Two lines to ' + letterTo() + ', under his own frank.', verb:'Ask it', state:c.letter ? 'done' : 'open', note:c.letter ? 'Written, ' + c.letter : '',
    why:r < 0 ? 'His lordship is not at home to you.' : F('mp') ? 'He writes no letters for the Member who sits in his nephew’s place.' : '', fx:['+1 Edmund', '+2 Peace of the household', 'Your three votes are the Castle’s for three years']}));
  if (!c.manor) lots.push(lot('enfranchise', {name:'Cuckoo Copse made freehold', line:'The copse and sixty acres under it, released from his manor by deed. His lordship names the price.', cost:freePrice(), state:c.free ? 'done' : 'open', note:c.free ? 'Enfranchised, ' + c.free : '',
    fx:['+' + fmt(QUIT_RENT) + ' a year, the quit rent', '+1 Standing', 'No suit at his court']}));
  lots.push(lot('manor', {name:'The Manor of Nether Cullerne', line:'The court, the rolls, eleven copyholders, and free warren over the copse.', cost:MANOR_PRICE, state:c.manor ? 'done' : 'open', note:c.manor ? 'Conveyed, ' + c.manor : castleLow() ? 'Offered until ' + castleUntil() : '',
    why:castleLow() ? '' : 'His lordship does not sell.', fx:['+' + fmt(MANOR_RENTS) + ' a year in quit rents and fines', '+4 Standing', '+2 Goodwill of the parish', 'His keepers leave Cuckoo Copse', '−1 Lord Cullerne']}));
  if (F('castleDebt')) lots.push(lot('redeem', {name:'The mortgage out of his hands', line:'An office in Lombard Street will lend upon the same land, at the same five per cent.', cost:londonCost(), verb:'Borrow in London', state:'open',
    why:F('cut') ? 'No office will lend to a man whom his own county has cut.' : '', fx:['+3 Standing', '−1 Lord Cullerne']}));
  return {regard:r, word:REGARD[r + 5], said:c.said || '', debt:!!F('castleDebt'), owing:F('castleDebt') ? S.mortgage : 0, low:castleLow(), dials, lots}; }

/* He who holds the mortgage may call some of it in when he is crossed. */
function castleCross(n){ if (F('castleDebt') && S.mortgage > 0) castle().call = Math.max(castle().call || 0, n); }
function setCastle(dial, lvl){ const row = castleList().dials.find(d => d.id === dial), o = row && row.levels.find(l => l.id === lvl); if (!o || !o.can) return false;
  const c = castle(), h = CASTLE[dial][lvl], d = (h.cull || 0) - (castleOf(dial).cull || 0);
  c[dial] = lvl; c.at[dial] = S.t; if (d) reg('cullerne', d, d < 0 || h.cull > 0 ? h.mem : undefined);
  c.said = h.said(); if (d < 0 && F('castleDebt') && S.mortgage > 0) { castleCross(300); c.said += `\n\nBy the next post the agent writes for three hundred pounds of his lordship’s principal, to be paid at the Castle upon quarter day.`; }
  S.journal.unshift({when:stamp(), title:'The Castle', did:CASTLE[dial].name + ': ' + h.name.charAt(0).toLowerCase() + h.name.slice(1)}); save(); render(); return true; }
function manorDeed(){ const c = castle(); c.manor = S.year; delete c.low; S.money -= MANOR_PRICE; add({standing:2}); reg('cullerne', -1, 'You bought Nether Cullerne of him when he was pressed'); later('courtBaron', 1);
  return `The Manor of Nether Cullerne is conveyed to you at Mr Spurling’s office for ${pounds(MANOR_PRICE)}, with its court, its rolls in a tin box, its eleven copyholders, and the right of free warren; and upon the same afternoon his lordship’s keepers are seen carrying their traps out of Cuckoo Copse on a hand-barrow.`; }
function takeCastle(id){ const x = castleList().lots.find(l => l.id === id); if (!x || !x.can) return false; const c = castle();
  if (id === 'letter') { c.letter = S.year; if (castleAt('votes') !== 'castle') reg('cullerne', 1 - (castleOf('votes').cull || 0), 'You promised Bligh your three votes'); c.votes = 'castle'; c.bound = S.t + 12; reg('edmund', 1, 'You got him Lord Cullerne’s letter'); add({family:2});
    c.said = `His lordship writes two lines to ${letterTo()} upon Edmund’s behalf, sands them, and franks the cover with his own hand; and having done so, he keeps the letter upon his knee.

“Bligh’ll be wantin’ your three, when the time comes.”

You say that Mr Bligh shall have them, and the letter is given you.`; }
  if (id === 'enfranchise') { const p = x.cost; S.money -= p; c.free = S.year; add({standing:1});
    c.said = `His lordship names ${pounds(p)}, and will not hear of less; and for that sum, by a deed which his agent is four months in drawing, Cuckoo Copse and the sixty acres under it are released from suit, service, heriot and quit rent for ever.`; }
  if (id === 'manor') c.said = manorDeed();
  if (id === 'redeem') { const p = x.cost; S.money -= p; fl('castleDebt', false); c.call = 0; reg('cullerne', -1, 'You took your mortgage out of his hands');
    c.said = `A house in Lombard Street takes up the mortgage at five per cent, and charges ${pounds(p)} for its surveyor, its solicitor and the stamps; and his lordship’s agent, to whom the principal is paid by a draft upon London, reads the draft twice before he will write a receipt for it.`; }
  S.journal.unshift({when:stamp(), title:'The Castle', did:x.name + (x.cost ? ', ' + fmt(x.cost) : '')}); save(); render(); return true; }

/* The quarter's reckoning with the Castle. */
function castleQuarter(line){ const c = castle(); c.said = '';
  if (S.season === 2 && !c.free && !c.manor) line('Quit rent to the Manor of Nether Cullerne', -QUIT_RENT);
  for (const dial in CASTLE) { const h = castleOf(dial); if (h.cost) line(h.bill, -h.cost / 4); }
  if (c.manor) line('Quit rents and fines, Manor of Nether Cullerne', (c.noHeriot ? MANOR_RENTS - 15 : MANOR_RENTS) / 4);
  if (c.call) { const n = Math.min(c.call, S.mortgage); c.call = 0; if (n > 0 && F('castleDebt')) { line('Lord Cullerne calls in ' + fmt(n) + ' of his principal', -n); S.mortgage -= n; S.notes.push(`${cap1(pounds(n))} of the principal is paid at the Castle upon his lordship’s demand; and the agent, in giving his receipt, hopes that Mr ${S.sur} is well.`); } }
  if (F('castleDebt') && S.mortgage <= 0) { fl('castleDebt', false); S.notes.push(`The last of the mortgage is paid at the Castle, and ${steward()} brings the deeds of Hatherley home before him upon the saddle, in a tin box.`); }
  if (c.note && S.t >= c.note) { delete c.note; line('Lord Cullerne takes up his note of hand', NOTE_BACK); S.notes.push(`Lord Cullerne takes up his note of hand upon the very day it falls due, with the interest reckoned to a shilling; and a haunch of venison comes over in the same cart.`); }
  if (c.low && S.t > c.low) { delete c.low; if (!c.manor) S.notes.push(`The Manor of Nether Cullerne is no longer to be had; for his lordship has sold four farms in Wiltshire in its stead, and the white paint is wearing off the oaks in the Castle park.`); }
  if (c.nm === undefined) c.nm = 30 + Math.floor(Math.random() * 28);
  if (!c.nmDone && S.t >= c.nm && S.t <= 72) { c.nmDone = true; later('newmarket', 0); }
  if (!c.debtAsked && !F('castleDebt') && S.t >= 6 && S.t <= 76 && S.mortgage >= 1500 && S.chars.cullerne.r <= -2 && chance(0.4)) { c.debtAsked = true; later('castleMortgage', 0); } }

/* A promise is remembered at the poll. Whatever the squire does there, the Earl's regard tells which way he went. */
function castlePoll(was){ const c = castle(), r = S.chars.cullerne.r; let out = '';
  if (castleAt('votes') === 'castle' && r < was) { c.votes = 'own'; delete c.bound; add({standing:-4}); reg('cullerne', -1, 'You promised him your votes in writing, and broke the promise');
    out += `\n\nYour letter, promising Mr Bligh your three votes, is in the agent’s pocket-book; and on market day he reads it aloud at the ordinary of the George, to nine farmers and a clergyman, between the mutton and the cheese.`; }
  else if (castleAt('votes') === 'against' && r > was) { c.votes = 'own'; add({goodwill:-3});
    out += `\n\nIn Pig Lane, where your word against the Castle had been taken for as good as a guinea, eleven doors are shut as you ride by; and a boy calls after you the price of venison.`; }
  if (r < was && F('castleDebt') && S.mortgage > 0) { castleCross(500);
    out += `\n\nBy the Friday post the agent writes for five hundred pounds of his lordship’s principal, to be paid at the Castle upon quarter day.`; }
  return out; }
for (const id of ['election96', 'election']) { const e = EVENTS.find(x => x.id === id); if (e) for (const ch of e.choices) { const go = ch.go; ch.go = () => { const was = S.chars.cullerne.r, text = go(); return text + castlePoll(was); }; } }

const NM_MEETING = ['CRAVEN MEETING', 'JULY MEETING', 'FIRST OCTOBER MEETING', 'HOUGHTON MEETING'];
ev({ id:'newmarket', follow:true, title:'A Match Over the Beacon Course',
  text:() => `The Mercury has it in the column next the price of oats.

“NEWMARKET ${NM_MEETING[S.season]}. On Tuesday the Earl of CULLERNE’s grey Colt, Burgage, 8st. 2lb., was beat half a Length over the Beacon Course by Lord Rookhope’s Tinker, in a Match for 4000 gs. It is confidently reported that upwards of Eleven Thousand Guineas changed Hands upon the Event; and that a Noble Owner of this County was not among the Receivers.”

Before the week is out the Castle carriage horses are advertised at Tattersall’s; a man in a brown coat, whom nobody knows, is three days in the park with a pot of white paint, setting a mark upon every oak above two feet through; and on Saturday his lordship’s agent, who never before came to Hatherley without sending first, is shown into the justice room with his hat in his hand.

“His lordship,” says the agent, “has some small outlying properties, which he finds it inconvenient to keep. The Manor of Nether Cullerne is one. I am to say that it would not be offered to a stranger.”`,
  choices:[
    {t:'Buy the manor.', note:() => fmt(MANOR_PRICE), if:() => !castle().manor && S.money >= MANOR_PRICE, go:() => { const deed = manorDeed();
      return `“And the price?”

“Two-and-twenty hundred, sir, and the conveyance at your charge.” He has it ready upon a paper, and does not look at the paper.

${deed}`; }},
    {t:'Lend his lordship fifteen hundred pounds upon his note.', note:() => fmt(NOTE_LENT), if:() => S.money >= NOTE_LENT, go:() => { const c = castle(); S.money -= NOTE_LENT; c.note = S.t + 8; c.low = S.t + 6; reg('cullerne', 3, 'You lent him fifteen hundred pounds after Newmarket, and said nothing');
      return `You write a draft upon Tidmarsh’s for fifteen hundred pounds, and take his lordship’s note of hand at two years, with interest at five per cent; and the agent, who came in with his hat in his hand, goes out with it upon his head.

On Monday the man in the brown coat is gone from the park, and the paint is left upon the oaks.

The manor, the agent has let fall in going, is still to be had of his lordship until ${castleUntil()}.`; }},
    {t:'Say that you will consider of it.', go:() => { const c = castle(); c.low = S.t + 6;
      return `“His lordship is in no haste,” says the agent; and he names ${castleUntil()} as the day after which the manor must go to Mr Skinner’s hammer at the George, with the Wiltshire farms.

He declines a glass of wine. From the window you see him stop his horse at the gate of Cuckoo Copse, and sit a full minute looking in.`; }}
  ]});

ev({ id:'castleMortgage', follow:true, cond:() => S.mortgage >= 1000 && !F('castleDebt'), title:'An Assignment',
  text:() => `Among the letters at breakfast is one from Mr Tidmarsh, written out by a clerk, and signed by himself.

“Wyvern, Thursday.
Sir, I beg leave to acquaint you that the mortgage upon your Hatherley estate, standing at ${fmt(S.mortgage)}, was upon Tuesday last assigned by this house, for value received, to the Right Honourable the Earl of Cullerne; to whose agent the interest will in future be payable upon the usual days. The terms are in no respect altered.
I am, Sir, your most obedient humble servant,
J. Tidmarsh.”

As a banker parts with a sound security only when somebody has paid him more than it is worth, you are at no loss to know who rode into Wyvern on Tuesday; and you recollect that his lordship, at the last Sessions, asked very particularly after your hay.`,
  choices:[
    {t:'Pay the interest at the Castle.', go:() => { fl('castleDebt');
      return `On quarter day ${steward()} carries the interest to the Castle instead of to Wyvern; and the agent, having counted it, enters it in a book bound in green vellum, upon a page which has your name at the head and nothing else written under it.

“His lordship desires his compliments,” says the agent, “and hopes he shall see Mr ${S.sur} in his place at the poll.”`; }},
    {t:'Borrow in London, and pay the Earl off.', note:() => fmt(londonCost()), go:() => { const p = londonCost(); add({money:-p}); reg('cullerne', -1, 'You paid him off sooner than owe him');
      return `Mr Spurling goes up to town by the Tuesday mail, and is nine days gone; at the end of which an insurance office in Lombard Street has lent upon Hatherley at five per cent, and has charged, for its surveyor, its solicitor and the stamps, ${pounds(p)}.

The Earl has his principal by a draft upon London within the month. At the next Sessions he asks after your hay again.`; }},
    {t:'Wait upon his lordship, and ask what he means by it.', go:() => { fl('castleDebt'); reg('cullerne', 1, 'You came and asked him to his face about the mortgage');
      return `You find him in the stable yard, with his hand upon the knee of a grey colt.

“Mean by it? Don’t mean anythin’. Tidmarsh wanted money, and I’d some lyin’.” He sets the leg down. “Safer with a neighbour, ain’t it? A banker’ll call a man in. I shan’t.”

He looks at you for the first time.

“Not while we’re friends.”

You ride home by Cuckoo Copse, where two of his keepers, who are sitting upon the gate, get down and open it for you.`; }}
  ]});

ev({ id:'courtBaron', follow:true, cond:() => !!castle().manor, title:'Your Own Court',
  text:() => `The first Court Baron of the Manor of Nether Cullerne under its new lord is held in the long room of the Bell; and ${steward()} sits as steward of it, with the rolls out of their tin box before him, and a new pen.

Eleven copyholders answer to their names. The twelfth name is that of Amos Tubb, hedger, who was buried at Candlemas; and as his widow now comes to be admitted to the cottage and the rood of garden, which are held at a rent of one shilling and a fat hen, there falls due to the lord, by the custom of the manor, a heriot of the best beast.

The widow Tubb has one beast, and it is a cow.

${steward()} turns the roll about, and shows you the place with his thumb.

“It was always taken, sir. His lordship’s agent took a bay horse of your uncle.”`,
  choices:[
    {t:'Take the cow.', note:'+£9', go:() => { add({money:9, goodwill:-4});
      return `“Let the custom be observed.”

The cow is driven up to the home farm on Thursday by the widow herself; and when the cowman has her by the horn, the widow unties the halter, which is of plaited straw, and carries it home again.

${steward()} enters nine pounds in the book, under Casual Profits of the Manor.`; }},
    {t:'Take a shilling in lieu, and give the copyholders their dinner.', note:'£4', go:() => { add({money:-4, goodwill:3});
      return `“A shilling in lieu of heriot,” you say; and ${steward()}, after waiting to learn whether you will say anything further, writes it.

As the widow has not a shilling about her, the landlord of the Bell lends it across the bar; upon which she is admitted tenant by the rod, the rod being ${steward()}’s ruler. Afterwards the eleven dine at your charge upon boiled beef, and drink the lord of the manor in the Bell’s own beer.`; }},
    {t:'Do away with heriots in the manor for ever.', note:'£15 a year less', go:() => { castle().noHeriot = true; add({goodwill:5, standing:-1});
      return `${steward()} lays down his pen.

“For ever, sir?”

“For ever.”

He takes it up again, and writes; and the eleven put their marks under it, the wheelwright alone signing his name.

It is known at the Castle before Sunday.

“He’ll be givin’ ’em votes next,” says Lord Cullerne.`; }}
  ]});

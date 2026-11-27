/* How the life ends. One ending is chosen from where the squire stands when the book is shut: by ruin, by a pistol ball, or at the
   close of 1815. Each has its own plate at art/endings/<id>, struck as the last of The Progress.
   The table is read from the top and the first ending whose test holds is taken, so the order is the order of precedence.
   The book reads ending(); the page shows endPlateHTML() above the cutting from the Mercury. */
const endNet = () => S.money - S.mortgage + (typeof ownLandValue === 'function' ? ownLandValue() : 0);
const endHas = id => typeof held === 'function' && typeof SOCIETY !== 'undefined' && SOCIETY[id] && !SOCIETY[id].heir && held(id);
const endTitled = () => endHas('baronet') || endHas('knight');
const endFront = () => !!(F('newFront') || (S.projectsDone && S.projectsDone.front === 'done'));
const endWorks = () => Object.keys(S.projectsDone || {}).filter(id => S.projectsDone[id] === 'done').length;
const endGrand = () => endTitled() || S.standing >= 68 || (S.est === 'splendid');
const endFirst = () => S.name.split(' ')[0];
const endSir = () => 'Sir ' + endFirst();
const endVicar = () => F('edmundVicar') ? 'Edmund' : F('oakesVicar') ? 'Mr Oakes' : F('gallDead') ? 'The vicar' : 'Dr Gall';
const endCount = n => ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] || String(n);
const endAway = () => !!F('henriettaAway');

const ENDINGS = [
  /* ---------- by a pistol ball ---------- */
  { id:'duel', title:'Shot at Dawn', did:'Met Captain Vane on Hatherley Down.', if:() => S.dead === 'duel',
    text:() => `The surgeon has a green baize bag. He sets it down in the wet grass and does not open it.

The lieutenant with the clean gloves picks up both pistols. He wipes them and lays them in their case. Captain Vane is already in the chaise.

A shepherd comes over the Down with forty ewes. He takes off his hat. The ewes go round you on both sides.` },

  /* ---------- sold up: four ways out of the Hall ---------- */
  { id:'tenant', title:'A Tenant on His Own Land', did:'Sold up, and stayed in the parish.', if:() => S.dead === 'ruin' && S.goodwill >= 58,
    news:() => `${S.name}, Esquire, late of that place, has taken the bailiff’s house at Church Farm, at a rent of twenty pounds.`,
    text:() => `Three wagons are at the door on the morning of the sale. Nobody sent for them. The tenants load what Mr Skinner has left and carry it to the bailiff’s house at Church Farm.

The rent of the house is twenty pounds a year. The purchaser’s agent takes it at Lady Day and writes you a receipt.

On Sunday you walk to church. The Hall pew has a new lock on the door. The blacksmith moves along his bench.

“There’s room here, sir.”` },
  { id:'bath', title:'The Second Floor in Gay Street', did:'Sold up, and went to Bath on Henrietta’s money.', if:() => S.dead === 'ruin' && S.family >= 52 && !endAway(),
    news:() => `${S.name}, Esquire, late of that place, has removed with his lady to Bath.`,
    text:() => `Mrs Tamworth has the first floor in Gay Street. You have the second. There are forty-one stairs and she has counted them for you.

Henrietta’s settlement brings two hundred a year. The creditors cannot touch it. She has told the landlady so, and the butcher.

You drink the waters at eight in the morning, when the Pump Room is empty. In the evening Henrietta does the accounts on the tea table. She allows you sixpence a week for the newspaper room.

“We shall do,” she says.` },
  { id:'bench', title:'A Room in the King’s Bench', did:'Sold up, and taken for debt.', if:() => S.dead === 'ruin' && S.standing < 42 && S.goodwill < 45,
    news:() => `${S.name}, Esquire, late of that place, is lodged in the King’s Bench Prison, at the suit of nine tradesmen of Wyvern and a coachmaker of Long Acre.`,
    text:() => `The turnkey at the King’s Bench wants half a crown for the room and a shilling for the key of it.

There are two beds. The other is a hop factor’s from the Borough. He has been here since the Peace of Amiens. He shows you the racket court, the pump, and the window where the beer is passed in.

“You’ll want a chair,” he says. “I can let you have a chair at fourpence a week.”

Mr Spurling writes on Tuesday. The sale is made up. The creditors are to have fourteen shillings in the pound.` },
  { id:'soldup', title:'Sold Up', did:'Sold up, and crossed to the Isle of Man.', if:() => S.dead === 'ruin',
    news:() => `${S.name}, Esquire, late of that place, has removed with his family to Douglas in the Isle of Man. The King’s writ for debt does not run there. He walks on the pier most mornings.`,
    text:() => `The Liverpool packet lands you at Douglas with nine trunks. One of them holds the rent books.

There are forty English gentlemen in the town. They meet on the pier at ten. Each of them asks what you owed. You tell them. Two of them bow lower the next morning.

The lodging is fourteen shillings a week with fish. From the window you can see England on a clear day. There have been three clear days since Michaelmas.` },

  /* ---------- the close of 1815 ---------- */
  { id:'hollow', title:'Splendour on Credit', did:'Kept a great figure on borrowed money.', if:() => endGrand() && endNet() < -2500,
    text:() => `Forty sit down at the Hall on Twelfth Night. There are two courses and a dessert. The pineapple is hired from a fruiterer in Reading at half a guinea. It goes back on Thursday.

Lord Cullerne has the chair on your right. The footmen are in new liveries. The tailor who made them is in the servants’ hall with his bill. The wine merchant sits beside him. Mrs Bunce has given them both cold beef.

Mr Tidmarsh is among the company. He counts the candles.` },
  { id:'baronet', title:'The Bloody Hand over the Door', did:'A baronet, behind six columns.', if:() => endHas('baronet') && endFront(),
    text:() => `A mason is on a ladder over the great door with a mallet. He has the red hand of Ulster to cut into the shield on the pediment. He has chalked it in backwards and rubs it out with his sleeve.

The six columns are of Bath stone, the colour of a new loaf. The rooks left the elms the week the scaffolding came. They have not been back.

Mrs Bunce has the servants out on the steps in a row.

“Good morning, ${endSir()}.”

“Good morning, ${endSir()}.”

The boot boy says it wrong and is sent to the end of the row.` },
  { id:'rackrent', title:'The Rack-Renter', did:'Grew rich, and was not thanked for it.', if:() => endNet() > 8000 && S.goodwill < 40,
    text:() => `Rent day. ${steward()} has the table set across the door of the estate office. The tenants come up to it one at a time.

Every farm on the roll pays to the day. The sum is entered and ruled off before noon. There is no audit dinner this year. Each man has a glass of beer in the yard and drinks it standing.

In the afternoon you ride down the lane. A woman at the pump turns her back. Her three children turn theirs.

The purse stands at ${fmt(S.money)}.` },
  { id:'good', title:'The Good Squire of Hatherley', did:'Held Hatherley one-and-twenty years, and was liked.', if:() => S.goodwill >= 68 && S.family >= 55,
    text:() => `Snow in the night. By nine the lane is dug out from the village to the Hall door. Nobody was sent for.

Eleven men stand at the back door with spades. Mrs Bunce gives them beer. They will not take the shilling.

The ringers have had the bells up since seven. They ring one-and-twenty rounds. It is a round for every year you have had the place. The treble is cracked and you paid for the rope.

${endAway() ? 'You stand at the window and count them.' : 'Henrietta counts on her fingers and makes it twenty-two.'}` },
  { id:'knight', title:'The Loyal Address', did:'Rose a Sir.', if:() => endTitled(),
    text:() => `The Wyvern carrier brings a letter directed to ${endSir()} ${S.sur}, ${endHas('baronet') ? 'Baronet' : 'Knight'}. He asks ninepence for it. He has always asked eightpence.

The engraver has sent two hundred cards with Lady ${S.sur} on them in the copperplate hand. ${endAway() ? 'They lie on the hall table. Henrietta is in Gay Street.' : 'Henrietta leaves them at thirteen houses in one morning. At four of those houses she was not at home to anybody last year.'}

In church ${endVicar() === 'The vicar' ? 'the vicar' : endVicar()} prays for the King, the Prince Regent and all the nobility. He looks at the Hall pew when he comes to it.` },
  { id:'member', title:'The Member for Wyvern', did:'Sat for the borough.', if:() => !!F('mp'),
    text:() => `Fourteen people are in the hall before breakfast. Each has a letter in his hand. A Member may frank ten in a day. You write your name across ten corners. The other four are told to come tomorrow.

At noon a clerk rides over with a paper. It sets out how the Member for Wyvern will vote upon the Property Tax. You had not been asked.

The London coach leaves the George at six. Your place is taken inside. The borough has paid for it.` },
  { id:'acres', title:'From the Down to the River', did:'Added farm to farm.', if:() => S.farms.length >= 6,
    text:() => `The surveyor from Reading unrolls the new plan on the dining table. It hangs over both ends. He asks for two chairs.

There are ${endCount(S.farms.length)} farms on it, each in its own colour. Your uncle’s plan showed three. It is still on the office wall, under the almanack.

You set out at eight to ride the boundary. At four the light goes. You are at the far hedge and the Hall is six miles off. The tenant’s wife gives you a bed. She has had it aired since Tuesday.` },
  { id:'empty', title:'Master of an Empty House', did:'Kept the house and lost the household.', if:() => S.family < 30 || endAway(),
    text:() => `Dinner is laid for one at the end of the long table. The other eleven chairs stand against the wall in holland covers.

${endAway() ? 'Henrietta is in Gay Street. She writes on the first of the month. The letter is about the linen.' : 'Henrietta dines upstairs on a tray. She sends down to ask whether the fire in the blue room may be lit.'}

The butler brings the port and stays by the door. You ask him the news of the servants’ hall.

“The kitchen cat has kittened, sir.”

The clock in the hall strikes nine. You count it.` },
  { id:'song', title:'The Man in the Song', did:'Was sung about at the Bell.', if:() => S.goodwill < 30,
    text:() => `You come through Hatherley at dusk on the cob. They are singing in the Bell. The window is open an inch.

You know the tune. It is “The Vicar of Bray”. The words are new. There are nine verses and your name ends every one.

The singing stops when the cob’s shoes strike the bridge. A boy on the churchyard wall goes on alone for two lines. Somebody takes him down by the leg.

At the lodge gate you find you are humming it.` },
  { id:'cut', title:'Not at Home', did:'Was dropped by the county.', if:() => S.standing < 33,
    text:() => `The chaise is out four mornings in the first week of the year. You leave a card at nine houses. At each the footman looks at the card and then at the horses. His lady is not at home. At Cullerne Castle there is a face at the morning-room window.

No card comes back. The silver tray in the hall has one letter on it. It is from a hatter at Reading.

The Wyvern assembly is held on the nineteenth. You read of it in the Mercury on the twenty-second.` },
  { id:'debts', title:'Mr Tidmarsh’s Tin Box', did:'Kept the land, and owed for all of it.', if:() => endNet() < -1500,
    text:() => `Mr Tidmarsh comes out from Wyvern on the first Monday of the quarter. He does not send his clerk. He walks through the house with his hands behind him. He stops at the damp in the east passage.

The interest is ${fmt(Math.round(S.mortgage / 20))} a year. It leaves on quarter day before the butcher is paid.

“A fine property,” says Mr Tidmarsh on the steps. He says it to the roof.

You have kept the land. The deeds are at the Bank, in a tin box with your name on the lid.` },
  { id:'warm', title:'A Warm Man', did:'Left the estate richer than he found it.', if:() => endNet() > 9000,
    text:() => `Three gentlemen call in one week. Each admires the dogs. Each stays to dinner. Over the port each asks for the loan of five hundred pounds until harvest.

At the Bank Mr Tidmarsh gives you the chair by the fire and shuts the door himself. He asks your opinion of Exchequer bills.

${steward()} casts the year. Clear of every charge, there is ${fmt(Math.round(endNet() / 100) * 100)} to the good. He writes the sum, blots it, and writes it again larger.` },
  { id:'improver', title:'The Improver', did:'Drained, built and mended.', if:() => endWorks() >= 5,
    text:() => `Mr Hartopp brings nine gentlemen of the Bath and West Society in two chaises. They walk the estate from ten until three. Mr Hartopp goes before them backwards and talks.

One gentleman measures a turnip with a tape. Another puts a stone from the mended road in his pocket.

At dinner they vote you the Society’s silver medal. It may be had of the secretary on payment of the engraver.

The old carter watches the chaises go down the drive.

“They never asked what un cost,” he says.` },
  { id:'dynasty', title:'Three Generations at Table', did:'Saw his grandchildren at the Hall.', if:() => !F('edmundDead') && (S.flags.edmund === 'farmer' || F('edmundMarried')) && S.family >= 55,
    text:() => `Fourteen sit down on Twelfth Night. Five of them are under ten years old.

Edmund carves. You carved last year. Nobody has remarked on it.

The smallest grandchild is put in your uncle’s chair on two volumes of the county history. He bites the footman who brings the pudding.

After dinner ${endAway() ? 'Kitty' : 'Henrietta'} has the family Bible down. There is half a page left under your name. She rules a line across it for the next.` },
  { id:'funds', title:'A Gentleman in the Funds', did:'Sold the farms and lived on the dividends.', if:() => S.farms.length <= 1,
    text:() => `The dividends are paid at the Bank of England on the fifth of January. The trustees send a draft by Tuesday’s mail. ${steward()} has nothing else to enter this quarter. He enters it slowly.

After breakfast you walk to the park pale. It takes eleven minutes. The wheat on the far side is a Reading brewer’s. His man touches his hat and goes on hedging.

Three per cent. Consols are at sixty. In the Mercury you look for the price of them before you look for the deaths.` },
  { id:'button', title:'The Button-Maker’s Expectations', did:'Kept it all for a cousin in Birmingham.', if:() => S.flags.heir === 'cousin',
    text:() => `Your cousin comes from Birmingham by the coach, outside. He has a two-foot rule in his coat.

He measures the dining room. He counts the chimneys from the lawn and writes the number on his cuff. He asks Mrs Bunce what the coals come to.

At dinner he asks after your health. He asks again at breakfast.

“You look uncommon well, cousin.”

He takes the outside place home. It is four shillings cheaper.` },
  { id:'tolerable', title:'A Tolerable Squire', did:'Held Hatherley one-and-twenty years.', if:() => true,
    text:() => `Rain on quarter day. The rents are in by four. Two of them are a pound short.

You dine at three on a boiled fowl. Afterwards you sleep in the chair with the Mercury over your face. The news in it is nine days old.

${steward()} casts the one-and-twenty years on a single sheet. Received, so much. Laid out, so much. The difference would buy a good horse.

At six the dogs are let in.` }
];

/* The ending as things stand: {id, title, did, text, news, plate}. */
function ending(){ const e = ENDINGS.find(x => x.if()) || ENDINGS[ENDINGS.length - 1];
  return {id:e.id, title:e.title, did:e.did, text:e.text(), news:e.news ? e.news() : '', plate:'endings/' + e.id}; }

/* Struck once, when the book is shut for good, so that the ending is the last plate of The Progress. It is then held up over the book. */
function strikeEnding(){ if (!S) return; if (!S.plates) S.plates = [];
  if (!S.plates.some(p => p.key === 'end')) { const e = ending(), src = typeof artURL === 'function' && !artURL(e.plate) ? 'frontispiece' : e.plate;
    S.plates.push({key:'end', title:e.title, src, did:e.did, pub:S.dead ? SEASONS[S.season] + ' ' + S.year : 'January 1816', say:''}); }
  showLastPlate(); }

/* The last plate is held up in its own frame, laid out as the other plates are: the print, and beside it what is seen that day. */
function showLastPlate(){ if (typeof document === 'undefined' || !S || S.phase !== 'end') return;
  let el = document.getElementById('lastplate'); if (!el) { el = document.createElement('div'); el.id = 'lastplate'; document.body.appendChild(el); }
  const e = ending(), u = artURL(e.plate) || artURL('frontispiece'), n = (S.plates || []).length, when = S.dead ? stamp() : 'January 1816';
  el.innerHTML = `<div class="pcard"><figure class="print"><div class="mark"><span class="pn">${n ? 'Plate ' + n + ', and the last' : 'The last plate'}</span><div class="cutwrap">${u ? `<img src="${u}" alt="${esc(e.title)}">` : ''}</div><figcaption><b>${esc(e.title)}</b><small>Publish’d as the Act directs, ${esc(when)}</small></figcaption></div></figure>
    <div class="pside"><article class="sheet came"><p class="kicker">${esc(when)}</p><div class="prose lead">${paras(e.text)}</div></article>
    <div class="answer"><div class="row"><button class="go" onclick="shutLastPlate()"><span>Read the Mercury</span></button></div></div></div></div>`;
  el.hidden = false; document.body.classList.add('plateup'); el.scrollTop = 0; const b = el.querySelector('.go'); if (b) b.focus({preventScroll:true}); }
function shutLastPlate(){ const el = document.getElementById('lastplate'); if (el) { el.hidden = true; el.innerHTML = ''; } document.body.classList.remove('plateup'); }

/* On the last leaf of the book, the way back to the plate. */
function endPlateHTML(){ return `<p class="lastlink"><button class="quiet" onclick="showLastPlate()">${esc(ending().title)}: the last plate</button></p>`; }

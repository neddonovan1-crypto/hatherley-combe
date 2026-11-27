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
    text:() => `The surgeon, having set down his green baize bag in the wet grass, does not open it.

The lieutenant with the clean gloves picks up both pistols, and having wiped them, lays them in their case; but Captain Vane is already in the chaise.

A shepherd coming over the Down with forty ewes takes off his hat; and the ewes go round you upon both sides.` },

  /* ---------- sold up: four ways out of the Hall ---------- */
  { id:'tenant', title:'A Tenant on His Own Land', did:'Sold up, and stayed in the parish.', if:() => S.dead === 'ruin' && S.goodwill >= 58,
    news:() => `${S.name}, Esquire, late of that place, has taken the bailiff’s house at Church Farm, at a rent of twenty pounds.`,
    text:() => `Upon the morning of the sale there are three wagons at the door, that nobody sent for; and into these the tenants load what Mr Skinner has left, and carry it to the bailiff’s house at Church Farm.

The rent of the house is twenty pounds a year, and the purchaser’s agent, taking it at Lady Day, writes you a receipt.

On Sunday you walk to church, where the Hall pew is found to have a new lock upon the door; and the blacksmith moves along his bench.

“There’s room here, sir.”` },
  { id:'bath', title:'The Second Floor in Gay Street', did:'Sold up, and went to Bath on Henrietta’s money.', if:() => S.dead === 'ruin' && S.family >= 52 && !endAway(),
    news:() => `${S.name}, Esquire, late of that place, has removed with his lady to Bath.`,
    text:() => `Mrs Tamworth has the first floor in Gay Street, and you the second, to which there are forty-one stairs; and she has counted them for you.

Henrietta’s settlement brings two hundred a year, and being beyond the reach of the creditors, has been mentioned by her as such to the landlady, and to the butcher.

You drink the waters at eight in the morning, when the Pump Room is empty; and in the evening Henrietta does the accounts upon the tea table, out of which she allows you sixpence a week for the newspaper room.

“We shall do,” she says.` },
  { id:'bench', title:'A Room in the King’s Bench', did:'Sold up, and taken for debt.', if:() => S.dead === 'ruin' && S.standing < 42 && S.goodwill < 45,
    news:() => `${S.name}, Esquire, late of that place, is lodged in the King’s Bench Prison, at the suit of nine tradesmen of Wyvern and a coachmaker of Long Acre.`,
    text:() => `The turnkey at the King’s Bench wants half a crown for the room, and a shilling for the key of it.

There are two beds, the other being that of a hop factor from the Borough, who has been here since the Peace of Amiens; and who shows you the racket court, the pump, and the window where the beer is passed in.

“You’ll want a chair,” he says. “I can let you have a chair at fourpence a week.”

Mr Spurling writes on Tuesday that the sale is made up, and that the creditors are to have fourteen shillings in the pound.` },
  { id:'soldup', title:'Sold Up', did:'Sold up, and crossed to the Isle of Man.', if:() => S.dead === 'ruin',
    news:() => `${S.name}, Esquire, late of that place, has removed with his family to Douglas in the Isle of Man. The King’s writ for debt does not run there. He walks on the pier most mornings.`,
    text:() => `The Liverpool packet lands you at Douglas with nine trunks, one of them holding the rent books.

There are forty English gentlemen in the town, who meet upon the pier at ten; and each of them having asked what you owed, and been told, two of them bow lower the next morning.

The lodging is fourteen shillings a week with fish, and has a window from which England may be seen upon a clear day. There have been three clear days since Michaelmas.` },

  /* ---------- the close of 1815 ---------- */
  { id:'hollow', title:'Splendour on Credit', did:'Kept a great figure on borrowed money.', if:() => endGrand() && endNet() < -2500,
    text:() => `Forty sit down at the Hall upon Twelfth Night to two courses and a dessert, the pineapple in the midst of it being hired from a fruiterer in Reading at half a guinea, and to go back on Thursday.

Lord Cullerne has the chair upon your right, and the footmen are in new liveries; but the tailor who made them is in the servants’ hall with his bill, and the wine merchant beside him, and Mrs Bunce has given them both cold beef.

Mr Tidmarsh, being among the company, counts the candles.` },
  { id:'baronet', title:'The Bloody Hand over the Door', did:'A baronet, behind six columns.', if:() => endHas('baronet') && endFront(),
    text:() => `A mason is upon a ladder over the great door with a mallet, having the red hand of Ulster to cut into the shield upon the pediment; and finding he has chalked it in backwards, he rubs it out with his sleeve.

The six columns are of Bath stone, the colour of a new loaf. The rooks left the elms the week the scaffolding came, and have not been back.

Mrs Bunce has the servants out upon the steps in a row.

“Good morning, ${endSir()}.”

“Good morning, ${endSir()}.”

The boot boy, saying it wrong, is sent to the end of the row.` },
  { id:'rackrent', title:'The Rack-Renter', did:'Grew rich, and was not thanked for it.', if:() => endNet() > 8000 && S.goodwill < 40,
    text:() => `Rent day. ${steward()} has the table set across the door of the estate office, and the tenants come up to it one at a time.

Every farm upon the roll pays to the day, and the sum is entered and ruled off before noon; and there being no audit dinner this year, each man has a glass of beer in the yard, and drinks it standing.

In the afternoon you ride down the lane, where a woman at the pump turns her back, and her three children turn theirs.

The purse stands at ${fmt(S.money)}.` },
  { id:'good', title:'The Good Squire of Hatherley', did:'Held Hatherley one-and-twenty years, and was liked.', if:() => S.goodwill >= 68 && S.family >= 55,
    text:() => `Snow having fallen in the night, the lane is by nine o’clock dug out from the village to the Hall door, though nobody was sent for.

Eleven men stand at the back door with spades, to whom Mrs Bunce gives beer; but they will not take the shilling.

The ringers have had the bells up since seven, and ring one-and-twenty rounds, being a round for every year you have had the place. The treble is cracked, and you paid for the rope.

${endAway() ? 'You stand at the window and count them.' : 'Henrietta counts on her fingers and makes it twenty-two.'}` },
  { id:'knight', title:'The Loyal Address', did:'Rose a Sir.', if:() => endTitled(),
    text:() => `The Wyvern carrier brings a letter directed to ${endSir()} ${S.sur}, ${endHas('baronet') ? 'Baronet' : 'Knight'}, for which he asks ninepence, having always asked eightpence.

The engraver has sent two hundred cards with Lady ${S.sur} upon them in the copperplate hand. ${endAway() ? 'They lie upon the hall table, Henrietta being in Gay Street.' : 'Henrietta leaves them at thirteen houses in one morning, at four of which there was nobody at home to her last year.'}

In church ${endVicar() === 'The vicar' ? 'the vicar' : endVicar()} prays for the King, the Prince Regent, and all the nobility, and looks at the Hall pew when he comes to it.` },
  { id:'member', title:'The Member for Wyvern', did:'Sat for the borough.', if:() => !!F('mp'),
    text:() => `Fourteen people are in the hall before breakfast, each with a letter in his hand; and a Member being allowed to frank ten in a day, you write your name across ten corners, and the other four are told to come tomorrow.

At noon a clerk rides over with a paper, setting out how the Member for Wyvern will vote upon the Property Tax. You had not been asked.

The London coach leaves the George at six, and your place is taken inside, the borough having paid for it.` },
  { id:'acres', title:'From the Down to the River', did:'Added farm to farm.', if:() => S.farms.length >= 6,
    text:() => `The surveyor from Reading unrolls the new plan upon the dining table; and finding that it hangs over both ends, asks for two chairs.

There are ${endCount(S.farms.length)} farms upon it, each in its own colour, where your uncle’s plan showed three; and that is still upon the office wall, under the almanack.

You set out at eight to ride the boundary, and at four, when the light goes, are at the far hedge, with the Hall six miles off. The tenant’s wife gives you a bed, having had it aired since Tuesday.` },
  { id:'empty', title:'Master of an Empty House', did:'Kept the house and lost the household.', if:() => S.family < 30 || endAway(),
    text:() => `Dinner is laid for one at the end of the long table, the other eleven chairs standing against the wall in holland covers.

${endAway() ? 'Henrietta is in Gay Street, and writes upon the first of the month; and the letter is about the linen.' : 'Henrietta dines upstairs upon a tray, and sends down to ask whether the fire in the blue room may be lit.'}

The butler, having brought the port, stays by the door; and you ask him the news of the servants’ hall.

“The kitchen cat has kittened, sir.”

The clock in the hall strikes nine, and you count it.` },
  { id:'song', title:'The Man in the Song', did:'Was sung about at the Bell.', if:() => S.goodwill < 30,
    text:() => `You come through Hatherley at dusk upon the cob, and they are singing in the Bell, with the window open an inch.

The tune you know, for it is “The Vicar of Bray”; but the words are new, and of the nine verses your name ends every one.

When the cob’s shoes strike the bridge the singing stops, except that a boy upon the churchyard wall goes on alone for two lines, until somebody takes him down by the leg.

At the lodge gate you find you are humming it.` },
  { id:'cut', title:'Not at Home', did:'Was dropped by the county.', if:() => S.standing < 33,
    text:() => `The chaise is out four mornings in the first week of the year, and you leave a card at nine houses; at each of which the footman looks at the card, and then at the horses, and his lady is not at home. At Cullerne Castle there is a face at the morning-room window.

No card comes back; and the silver tray in the hall has one letter upon it, from a hatter at Reading.

The Wyvern assembly is held upon the nineteenth, and you read of it in the Mercury upon the twenty-second.` },
  { id:'debts', title:'Mr Tidmarsh’s Tin Box', did:'Kept the land, and owed for all of it.', if:() => endNet() < -1500,
    text:() => `Mr Tidmarsh comes out from Wyvern upon the first Monday of the quarter, not sending his clerk; and having walked through the house with his hands behind him, he stops at the damp in the east passage.

The interest is ${fmt(Math.round(S.mortgage / 20))} a year, and leaves upon quarter day before the butcher is paid.

“A fine property,” says Mr Tidmarsh upon the steps; but he says it to the roof.

You have kept the land. The deeds are at the Bank, in a tin box with your name upon the lid.` },
  { id:'warm', title:'A Warm Man', did:'Left the estate richer than he found it.', if:() => endNet() > 9000,
    text:() => `Three gentlemen call in one week, of whom each admires the dogs, each stays to dinner, and each, over the port, asks for the loan of five hundred pounds until harvest.

At the Bank Mr Tidmarsh gives you the chair by the fire, and shuts the door himself, and asks your opinion of Exchequer bills.

${steward()} casts the year, and finds that, clear of every charge, there is ${fmt(Math.round(endNet() / 100) * 100)} to the good; and having written the sum, and blotted it, he writes it again larger.` },
  { id:'improver', title:'The Improver', did:'Drained, built and mended.', if:() => endWorks() >= 5,
    text:() => `Mr Hartopp brings nine gentlemen of the Bath and West Society in two chaises, who walk the estate from ten until three, Mr Hartopp going before them backwards, and talking.

One gentleman measures a turnip with a tape, and another puts a stone from the mended road in his pocket.

At dinner they vote you the Society’s silver medal, that may be had of the secretary upon payment of the engraver.

The old carter watches the chaises go down the drive.

“They never asked what un cost,” he says.` },
  { id:'dynasty', title:'Three Generations at Table', did:'Saw his grandchildren at the Hall.', if:() => !F('edmundDead') && (S.flags.edmund === 'farmer' || F('edmundMarried')) && S.family >= 55,
    text:() => `Fourteen sit down upon Twelfth Night, of whom five are under ten years old.

Edmund carves, where last year you carved; and nobody has remarked upon it.

The smallest grandchild, being put in your uncle’s chair upon two volumes of the county history, bites the footman who brings the pudding.

After dinner ${endAway() ? 'Kitty' : 'Henrietta'} has the family Bible down; and there being half a page left under your name, she rules a line across it for the next.` },
  { id:'funds', title:'A Gentleman in the Funds', did:'Sold the farms and lived on the dividends.', if:() => S.farms.length <= 1,
    text:() => `The dividends are paid at the Bank of England upon the fifth of January, and the trustees send a draft by Tuesday’s mail. ${steward()} has nothing else to enter this quarter, and enters it slowly.

After breakfast you walk to the park pale, a matter of eleven minutes. The wheat upon the far side is a Reading brewer’s, whose man touches his hat, and goes on hedging.

Three per cent. Consols are at sixty; and in the Mercury you look for the price of them before you look for the deaths.` },
  { id:'button', title:'The Button-Maker’s Expectations', did:'Kept it all for a cousin in Birmingham.', if:() => S.flags.heir === 'cousin',
    text:() => `Your cousin comes from Birmingham by the coach, outside, with a two-foot rule in his coat.

Having measured the dining room, he counts the chimneys from the lawn, and writes the number upon his cuff, and asks Mrs Bunce what the coals come to.

At dinner he asks after your health, and at breakfast he asks again.

“You look uncommon well, cousin.”

He takes the outside place home, it being four shillings cheaper.` },
  { id:'tolerable', title:'A Tolerable Squire', did:'Held Hatherley one-and-twenty years.', if:() => true,
    text:() => `Rain upon quarter day; but the rents are in by four, though two of them are a pound short.

You dine at three upon a boiled fowl, and afterwards sleep in the chair with the Mercury over your face, the news in it being nine days old.

${steward()} casts the one-and-twenty years upon a single sheet: received, so much; laid out, so much; and the difference would buy a good horse.

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

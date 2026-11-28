/* Venture papers. Twelve of the ventures open a paper of their own, with a plate, upon the day they are undertaken; and each of the twelve
   sends a second paper to the Hall a season or more afterwards, with something to be decided.
   The first kind is held up over the plan (ventPaper) and struck into The Progress; its plate is art/ventures/<venture id>.jpg.
   The second kind is an ordinary follow-on event, queued from the quarter's reckoning while the venture stands; its plate is art/events/<event id>.jpg.
   Nothing here alters what a venture costs or pays. The sums moved by the second papers are their own.
   Written in the Hatherley hand (docs/voice/VOICE.md). The first words spoken in each paper go into the balloon, so they belong to whoever is drawn speaking. */
const vicarNow = () => { const p = parson(); return p === 'The Vicar' ? 'the Vicar' : p; };
const neutralFlag = () => S.year < 1812 ? {flag:'American', ship:'Fair American', home:'a citizen of Salem', proof:'an American consul, and a baptismal register from Salem'} : {flag:'Swedish', ship:'Enigheten', home:'a subject of Sweden', proof:'a Swedish consul, and a baptismal register from Gothenburg'};

const VENT_PAPERS = {
  telegraph:{ title:'Six Shutters upon the Down',
    text:() => `The station comes up from the Wyvern wharf in two wagons, with every board of it numbered at Deptford; and before the second wagon is unloaded there stands upon the highest of your turf a hut no bigger than a hay-cart, having upon its roof a frame of timber twenty feet tall, in which six shutters, each the size of a barn door, are hung in two rows upon pins.

With it come Lieutenant Tregear, of the Royal Navy, who was a midshipman in the Queen Charlotte upon the First of June; two seamen, who have their hammocks slung from the rafters within the hour; and a pair of telescopes, one looking east and one west, neither of which is to want an eye at it between sunrise and dark.

“Sixty-three changes, sir; and I am not at liberty to tell you what any one of them signifies.”

He shows you the ropes notwithstanding. One man at the east glass calls what the shutters upon Inkpen hill are doing, his fellow hauls the same upon your own, and the hill to the westward takes it from you; by which means, the Lieutenant says, an order has gone down from the Admiralty to the Port Admiral, and his answer come up again, in the time that the First Lord took to eat an egg.

The Navy Board has one acre, for as long as the war shall last and six months after, at twenty-five pounds a year. At one o’clock the six shutters clap open together, that being the hour sent down from London; the Lieutenant sets his watch by it, and you set yours.` },

  racecourse:{ title:'Hatherley Races',
    text:() => `${steward()} is three days upon the Down with a chain and a boy, at the end of which he has found two miles of turf with only one rabbit-hole in them, and has marked the hole with a stick. Posts are set at every furlong. A judge’s box, upon four legs, is put up opposite the last of them; and beside it the Wyvern carpenter raises a stand of deal boards, in three tiers, for those who will give a shilling to see over the heads of those who will not.

“She’ll carry sixty, sir, if they keeps still.”

The bill is printed at Wyvern by the hundred, and is upon every inn door between Hungerford and Reading within the week:

“HATHERLEY RACES. On Tuesday the 14th of August will be run for, upon Hatherley Down, a PLATE of FIFTY POUNDS, the Gift of ${S.name}, Esquire, by any Horse, Mare or Gelding; the best of three Two-mile Heats. To start at Twelve. No less than three reputed running Horses to start, or no Race. An ORDINARY each Day at the Bell. No Person to erect a Booth upon the Down who has not first agreed with the Clerk of the Course.”

The first application for a booth comes from the landlord of the Bell; and the second from a person at Reading, who describes his stock in trade as a table, three thimbles and a pea.` },

  turnpike:{ title:'The Wyvern Trust',
    text:() => `You are sworn a trustee of the Wyvern road at the George, between the cheese and the port, with your hand upon the Act; and your five hundred pounds, for which the treasurer writes a receipt upon the table-cloth side of his book, are laid out that same month in flints, in a gate of five bars, and in a cottage of six sides with a window to each, built where the Hatherley lane comes out upon the London road.

The gate is let to Serjeant Maggs, late of the Marines, who has a pension, a wooden leg, and a wife; and it is the wife who comes out to the first cart, which is Pocock the miller’s.

“Threepence, Mr Pocock; and I shall know the horse again.”

She has it from the board above her door, where the trust has had its tolls painted in white upon black:

“For every Horse or Beast drawing any Coach, Chariot or Chaise, 4½d. For every Horse drawing any Wagon or Cart, 3d. For every Horse, laden or unladen, and not drawing, 1d. For every Drove of Oxen or Neat Cattle, 10d. the Score. For every Drove of Calves, Hogs, Sheep or Lambs, 5d. the Score.”

The miller, who has driven that road for thirty years and paid nothing, reads the board through from the top; and he then counts her out twelve farthings, one at a time, upon the upper bar of the gate.` },

  sheepfair:{ title:'A Fair by Charter',
    text:() => `The grant lies at the bottom of your uncle’s tin box, under the fire policy: a skin of parchment no larger than a pocket-handkerchief, from which there hangs, by a plait of faded silk, a seal of brown wax as broad as a saucer. ${steward()} is a whole morning upon the Latin; and reports that King Henry the Sixth, in the twenty-fourth year of his reign, gave to the lord of Hatherley and to his heirs for ever a fair upon the common, to be held upon the eve, the day and the morrow of Saint Michael, with all the tolls, stallage and pennage belonging to the same.

No man living has seen it held. Hurdles are bought notwithstanding, enough to pen four thousand sheep; the Bell lays in a hogshead of gin; and the Wyvern crier has a paper and half a crown, to cry the day at Wyvern, at Newbury and at East Ilsley.

“O yes! O yes! A fair at Hatherley, by grant of King Henry the Sixth!”

A drover at the back of the crowd enquires whether King Henry will be there himself; and the crier, having looked upon both sides of his paper, replies that it does not say.` },

  warren:{ title:'Silver-Greys',
    text:() => `Thirty acres of the furze are banked round with turf to the height of five feet, and a lodge of two rooms is built at the gate. The warrener comes from Aldbourne Chase upon his own legs, with a lurcher at his heel, a bag of ferrets about his neck, and forty fathom of net over one shoulder. His name is Enos Rudd; and he has been thirty years among rabbits without, so far as can be learnt, having formed a good opinion of one.

The stock follows him in a wagon: two hundred couple of silver-greys, in hampers, whose skins are to go to the hatters at eighteenpence, and their carcases by the Newbury coach to Leadenhall. They are tipped out within the bank upon a Tuesday.

“They’ll bide, sir. A rabbit don’t stray from where he’s fed.”

Upon the Thursday one of them is found by Sukey Pryor in her garden, a quarter of a mile outside the bank, sitting among the winter greens.` },

  gravel:{ title:'A Screen and a Cart',
    text:() => `Under two feet of furze and black earth, at the lower end of the common, there lie nine feet of flint gravel; and as the soil of a common belongs to the lord, with whatever is beneath it, nobody’s leave is asked. A man named Abel Froome is put into the pit with a pick, a shovel, and a screen of wires set up aslant, against which he throws every shovelful: what goes through the wires is sold to the bricklayers for sand, and what rolls down the face of them is road metal.

The buyer is the parish itself; for by the Highway Act every parish mends its own roads, under a surveyor chosen yearly from among the farmers. This year’s surveyor, who has held the office twice before and knows the price of flints in four parishes, walks round the first heap with his hands behind him.

“Eighteenpence the load; and the parish to find its own carts.”

You ask two shillings, and take one and ninepence. The six geese that had that corner of the common are driven by their owner to the upper end, with a stick.` },

  limekiln:{ title:'The Kiln at Starveall',
    text:() => `The kiln is built into the bank beside the road, in the form of a great stone bottle sunk to the neck in the hill. Chalk is tipped in at the top from the quarry above, in courses with the coal; and the lime is raked out at the eye below, three days afterwards, too hot for the hand.

The burner is a Kintbury man, Amos Liddiard. He looks down the shaft before the first fire is laid, and has one question to put, which is whether you intend that it should ever go out.

“I had one eleven year alight at Kintbury, sir. Her took cold but the once, and that was my wedding.”

Coal comes up from the Kennet wharf at thirty shillings the chaldron, behind four horses, and the kiln eats a chaldron in the day. Upon the third evening a white smoke lies along the whole side of Starveall hill, and the first lime is drawn at dusk; when Mr Hartopp, who has ridden over to learn whether it is as strong as the Lambourn lime, and has spat upon a lump of it to try, orders forty quarters before he is back in his saddle.` },

  hops:{ title:'Twelve Acres of Poles',
    text:() => `A planter is had over from Farnham, at a guinea a day and the keep of his horse, who walks the twelve acres under Coldharbour wood with a spade, digs a hole at every corner, smells the earth out of each, and at length allows that hops have been grown upon worse. The ground is lined out in hills, a thousand to the acre. Sets go into every hill at Lady Day; and the poles of ash and chestnut, three to a hill and sixteen feet long, come up from the Hampshire coppices upon so many wagons that Coldharbour lane is not to be passed for a week.

“Hops, sir, is a lottery; but then a man can’t win without he holds a ticket.”

This is said beside the oast, which the bricklayers have carried up to the cowl; and it is all that he can be brought to say of the profits. Of the losses he speaks more at large, there being the fly, the flea, the mould, the red spider, the honey-dew and the blast; and in the course of one afternoon he names nine gentlemen of his acquaintance in Surrey, every one of whom planted hops, and two of whom are yet living in their own houses.` },

  gallops:{ title:'A String at Maddle',
    text:() => `The training groom is a Mr Scaife, out of Newmarket, who stands five feet and one inch in his boots, and who is understood to have left that town upon a difference of opinion with the Jockey Club. He walks the mile and a half of turf above Maddle from one end to the other without speaking; and at the far end he stops, and drives the heel of his boot into the ground.

“Never had a plough in it, sir? Then I’ll not ask you the rent twice.”

Thirty-five pounds a year is agreed upon, you finding the rails and a rubbing-house. The horses come by road within the month, twelve of them, walking in a string, in hoods and body-clothes that leave nothing of any horse to be seen but four legs and two eyes; and upon each sits a boy who weighs, with his saddle, five stone.

They are out upon the down at five every morning. By six there is commonly a gentleman or two of the neighbourhood sitting upon his hack by the rails, each of whom has ridden that way by accident; and Mr Scaife, who knows what brings them, takes his string to the other end.` },

  spa:{ title:'The Hatherley Waters',
    text:() => `The spring rises in the bottom below the Hall, and has stained its own ditch the colour of a rusty nail for longer than anybody can remember. Cattle will not drink at it; and Mrs Bunce is reported to have used it once, with success, upon a wart. A gallon goes in stone bottles to Mr Tugwell, apothecary and chymist at Reading, who returns his analysis within the week: so many grains of iron to the pint, so many of Epsom salt, a trace of sulphur, and of fixed air a sufficiency.

He comes over to taste it at the source, and holds the glass a good while to the light before he will carry it to his mouth.

“It is perfectly nauseous, sir. I give you joy of it.”

No water, he explains, was ever yet resorted to that was pleasant to drink; and the company at Cheltenham would think themselves cheated by anything they could get down without a struggle. Upon this assurance a pump room is contracted for, in stone, with columns to the front; lodgings for twelve families are begun in the paddock; a woman is engaged to stand at the pump in a clean apron; and Mr Tugwell’s analysis is printed as a pamphlet, at your expense, with a list of the disorders in which the Hatherley water is sovereign, that fills four pages, and begins with the gout.` },

  privateer:{ title:'A Sixteenth of the Hetty',
    text:() => `She lies at the Bristol quay, three tides from the sea, with the mud up to her bends at low water: a brig of a hundred and eighty tons, built at Bideford for the Newfoundland fishery, and since pierced for fourteen guns. Messrs. Farr and Penny, her agents, have your draft for six hundred pounds, and have entered you in their book as owner of one sixteenth part of her hull, her guns, her stores, and whatever it shall please Providence to send her.

Captain Tamlyn receives you upon the quay, in a round hat, with a pistol through his belt; and he lays his hand upon the nearest gun as another man might lay it upon the neck of a horse.

“Six-pounders, sir. And I never yet met the Frenchman that stopped to count them.”

He has eighty men, where a trader of her burthen would carry twelve, the rest being wanted to sail his prizes home. They ship for no wages. One half of all that is taken goes by the articles to the people, and the other half to the sixteen owners; and His Majesty’s letter of marque, which is shown you in a tin case, is what distinguishes this arrangement from piracy.

She drops down with the ebb upon the Thursday; and Messrs. Farr and Penny, in wishing you joy of her, beg leave to mention that an owner answers in his sixteenth for every refit.` },

  thresher:{ title:'The Scotch Machine',
    text:() => `It comes from the Reading foundry upon a timber-carriage, in more pieces than ${steward()} has names for in his book: a drum of four feet, armed with iron beaters; two fluted rollers, to draw in the corn; a great wheel of cast iron, with teeth of apple-wood; and a shaft thirty feet long, which goes out through a hole cut for it in the barn wall, to a ring of trodden earth where two horses are to walk round from seven until dark.

With it comes a millwright from East Lothian, who is three weeks in setting it up, and who speaks during that time chiefly to the machine. Upon the morning of the trial he puts in the first sheaf with his own hands.

“She’ll thresh ye forty bushel in the hour, and never ask for her beer.”

The noise of it is heard at the Bell. Wheat, straw and chaff come out at three several places; a boy of twelve feeds it; and by noon it has done what your six threshers would have been about until Friday week.

The six stand all this while within the great doors, each with his flail in his hand, as he was bid to come. Nobody has thought to tell them what they are to do next; and at twelve o’clock they hang up their flails upon the pegs, in the old order, and go home to their dinners.` }
};

/* The paper held up over the plan when one of the twelve is undertaken. It is struck into The Progress as the other plates are. */
let VENTUP = null;
function ventPaper(id){ const p = VENT_PAPERS[id]; if (!p) return; const text = p.text();
  if (typeof document === 'undefined' || typeof printHTML !== 'function') return;
  if (!S.plates) S.plates = [];
  const src = artURL('ventures/' + id) ? 'ventures/' + id : placeCut(typeof ventAt === 'function' ? ventAt(id) : 'hall');
  S.plates.push({key:'vent:' + id + ':' + S.t, title:p.title, src, did:(S.journal[0] || {}).did || '', pub:quarterDay(), say:sayOf(text)}); save();
  VENTUP = {text, n:S.plates.length, cost:VENTURES[id].cost}; showVentPaper(); }
function showVentPaper(){ if (!VENTUP || typeof document === 'undefined') return; const p = S.plates[VENTUP.n - 1]; if (!p) return;
  let el = document.getElementById('ventplate'); if (!el) { el = document.createElement('div'); el.id = 'ventplate'; document.body.appendChild(el); }
  el.innerHTML = `<div class="pcard">${printHTML(VENTUP.n, p.src, p.title, p.pub, p.say)}
    <div class="pside"><article class="sheet came"><p class="kicker">${esc(stamp())}</p><div class="prose lead">${paras(VENTUP.text)}</div>${VENTUP.cost ? `<ul class="deltas"><li class="down">${esc('Purse ' + fmt(-VENTUP.cost))}</li></ul>` : ''}</article>
    <div class="answer"><div class="row"><button class="go" onclick="shutVentPaper()"><span>Carry on</span></button></div></div></div></div>`;
  el.hidden = false; document.body.classList.add('plateup'); el.scrollTop = 0; fitBalloons(); requestAnimationFrame(fitBalloons);
  const b = el.querySelector('.go'); if (b) b.focus({preventScroll:true}); }
function shutVentPaper(){ VENTUP = null; const el = document.getElementById('ventplate'); if (el) { el.hidden = true; el.innerHTML = ''; }
  document.body.classList.remove('plateup'); render(); }
const beginVenturePlain = beginVenture;
beginVenture = function(id){ const ok = beginVenturePlain(id); if (ok) ventPaper(id); return ok; };

/* When the second paper comes: so many seasons after the undertaking, in the season named if one is named, and only in a quarter that has nothing else waiting.
   A venture given up, sold or ended before then sends none. */
const VENT_AFTER = {
  telegraph:{ev:'ventTelegraph', wait:3}, racecourse:{ev:'ventRaces', wait:2, q:1}, turnpike:{ev:'ventGate', wait:3}, sheepfair:{ev:'ventFair', wait:2, q:2},
  warren:{ev:'ventWarren', wait:3, q:0}, gravel:{ev:'ventGravel', wait:4}, limekiln:{ev:'ventKiln', wait:2, q:3}, hops:{ev:'ventHops', wait:4, q:2},
  gallops:{ev:'ventGallops', wait:2, q:0}, spa:{ev:'ventSpa', wait:2, q:1}, privateer:{ev:'ventPrize', wait:3}, thresher:{ev:'ventThresher', wait:2, q:3} };
const ventureTickPapers = ventureTick;
ventureTick = function(line){ ventureTickPapers(line); if (!S.vent) return;
  if ((FIXED[S.year + '-' + S.season] || []).some(e => !e.cond || e.cond()) || S.queue.some(x => x.at <= S.t)) return;
  for (const id in VENT_AFTER) { const a = VENT_AFTER[id], v = vent(id); if (!v || v.ended || v.told || S.seen[a.ev] !== undefined) continue;
    if (S.t - (v.t || 0) < a.wait || (a.q !== undefined && S.season !== a.q)) continue;
    const e = byId(a.ev); if (e.cond && !e.cond()) continue;
    v.told = S.t; later(a.ev, 0); return; } };
/* A second paper says where it happens; the hand upon the plan points there. */
if (typeof eventPlace === 'function') { const eventPlacePlain = eventPlace; eventPlace = function(e){ return e.at && placeOn(e.at) ? e.at : eventPlacePlain(e); }; }

/* ---------- the second papers ---------- */
ev({ id:'ventTelegraph', follow:true, at:'down', who:() => null, cond:() => live('telegraph'), title:'The Lieutenant’s Horizon',
  text:() => `Lieutenant Tregear walks down from the hill in his best coat, which he has not done since the day he came; and as he will neither sit, nor take a glass of wine, until his errand is delivered, you hear it standing.

“It is your firs, sir. I have lost Inkpen behind them three mornings in the week.”

The clump in question stands upon the old barrow, to the east of his hut: nine Scotch firs, planted by your uncle in the year of his marriage, which have at length grown up into the line between one telescope and the next. A signal that is not seen is not passed; a signal not passed is entered in a book; and the book goes every quarter to the Navy Board, whose letter upon the subject the Lieutenant now lays before you.

Their Lordships desire that the obstruction be removed; and upon the question of who is to remove it, or to pay for the removing, their letter is silent.`,
  choices:[
    {t:'Have the firs down.', note:'+£18', go:() => { add({money:18, standing:1});
      return `The nine firs are down by Saturday. A timber merchant of Newbury gives eighteen pounds for them as they lie; the Lieutenant, having stood to watch the last of them fall, reports by his own shutters that the line is clear; and as the clump had been these thirty years between the hill and the Hall, the west telescope has now an uninterrupted view of your breakfast-room.`; }},
    {t:'Keep the firs. Let the Navy Board raise its frame.', note:'£4', go:() => { add({money:-4, standing:-1});
      return `You answer their Lordships that the firs were upon the barrow before the telegraph was upon the hill, and that it is easier to raise a frame than to lower a tree. The Navy Board is eleven weeks in replying. It then sends down a shipwright from Deptford, with six feet of new timber for the frame; and it deducts the shipwright, at four pounds, from your Michaelmas rent.`; }},
    {t:'Top them, at your own charge.', note:'£3', go:() => { add({money:-3});
      return `Two men with a ladder and a cross-cut saw take twelve feet off the head of every fir, for which you pay them three pounds; and the Lieutenant, having laid his glass along the top of a hurdle, finds Inkpen over them. The clump stands, twelve feet the shorter; and the rooks, whose nests are upon the ground with the tops, have gone over in a body to the elms at the Hall.`; }}
  ]});

ev({ id:'ventRaces', follow:true, at:'down', who:() => null, cond:() => live('racecourse'), title:'The Third Heat',
  text:() => `Three horses start for the Hatherley Plate, and by two o’clock one of them is lame. Of the two that remain, Lord Cullerne’s grey mare has won the first heat by a length; and the second has gone, by a neck, to a brown gelding belonging to Mr Slocock, who is a butcher at Newbury, and who rode over upon him this morning.

They come past the box in the third heat with not the breadth of a hand between them; and Mr Skinner the auctioneer, who was to judge, and who had stepped down a minute before for a glass of something, is seen running back to it across the course.

“The grey! The grey has it by a nostril!”

This is from the Castle carriage. The shilling stand, the rails, and everything upon the Down that came there on foot, are for the butcher.

As no judge saw the finish, the articles give the decision to the steward of the meeting; and the steward of the meeting is yourself. His lordship has taken out his watch. Mr Slocock has not got down from his horse.`,
  choices:[
    {t:'Give it to the grey mare.', go:() => { add({goodwill:-3}); reg('cullerne', 1, 'You gave his mare the Hatherley Plate');
      return `You give it to the grey. His lordship puts up his watch, and sends a groom across for the fifty pounds; and the Down is so quiet during the counting of it that the larks may be heard. Mr Slocock walks his gelding once round the judge’s box, looking up into it, and then turns him for Newbury. At the Bell that evening the ordinary, which was laid for eighty, is eaten by thirty-one.`; }},
    {t:'Give it to the butcher’s gelding.', go:() => { add({goodwill:3}); reg('cullerne', -1, 'You gave the Hatherley Plate against his mare');
      return `You give it to the gelding; and the noise that follows is heard, as ${steward()} afterwards learns, at Kintbury. The butcher is carried round the course upon his own horse, with four men at each stirrup, and lays out ten of the fifty pounds in beer before he is set down. The Castle carriage is turned about while the cheering is at its height; and his lordship, as he is driven past you, is looking with great attention out of the opposite window.`; }},
    {t:'Call it a dead heat, and have them run it off.', go:() => { add({standing:1, goodwill:1});
      return `You call it dead, and order the two to the post again at five. Neither party thanks you. At five the gelding walks down to the start; but the grey mare, who has by this time gone six miles at the top of her speed, and is of opinion that she has done enough, sets her feet in the door of the rubbing-house, and is not to be moved from it by groom, by whip, or by his lordship’s own voice. The butcher goes round alone, at a canter, and takes the Plate; and there is nobody upon the Down, from the Castle carriage to the gingerbread stall, who can say that you gave it him.`; }}
  ]});

ev({ id:'ventGate', follow:true, at:'turnpike', who:() => null, cond:() => live('turnpike'), title:'Round by Mill Lane',
  text:() => `Serjeant Maggs keeps a paper beside his toll-book, upon which he sets down, in strokes of five, every Hatherley cart that goes to Wyvern market without passing his gate; and as the paper has this quarter a hundred and forty strokes upon it, you walk down with ${steward()} upon a market morning to the ford below Pocock’s wheel, to see how the thing is done.

“Come up, Captain! There’s no gate in a river.”

It is done by Mill Lane, which leaves the village behind the church, goes through the water, and comes out upon the London road two hundred yards on the Wyvern side of the gate. The lane is a mile about, and the ford takes a cart to the axle; but there is not a farmer in your parish who has not found out that a wet axle is cheaper than threepence, and four of them pass you in the half hour, the last of whom touches his hat.

The treasurer of the trust proposes a side-bar: a second gate across the mouth of Mill Lane, with a boy to keep it, which the Act allows. The lane being yours upon both sides, the trustees wait to hear from you.`,
  choices:[
    {t:'Vote the side-bar.', go:() => { add({goodwill:-3, standing:1});
      return `The side-bar is up within the fortnight, and a boy of the Serjeant’s is set to keep it, with a hut no bigger than a sentry-box. Upon the first market day nineteen Hatherley carts pay him threepence apiece. Upon the second, the bar is found at daybreak in the mill-pond, with the hut floating beside it; and the boy, who slept through the whole, is sitting upon the bank.`; }},
    {t:'Compound for the parish, out of your own pocket.', note:'£12', go:() => { add({money:-12, goodwill:3});
      return `You compound with the trust for every cart belonging to the parish of Hatherley, at twelve pounds for the year, and have it given out at the church door after service. Mrs Maggs is furnished with a list of the carts, which she has by heart in a day. Mill Lane is left to the miller and the ducks; and the first farmer to go dry to market by the high road pulls up at the gate, and asks her, with great civility, what he owes.`; }},
    {t:'Tell the trust that the ford is no affair of theirs.', go:() => { add({goodwill:1, standing:-1});
      return `You tell the meeting that a man may wet his own axle in his own parish, and that there shall be no gate upon Mill Lane while it is yours. The treasurer enters your dissent in the minute-book, and rules a line under it; the port, which was coming round to you, goes back the way it came; and Serjeant Maggs begins a second sheet.`; }}
  ]});

ev({ id:'ventFair', follow:true, at:'common', who:() => null, cond:() => live('sheepfair') && !F('enclosed'), title:'His Lordship’s Market',
  text:() => `By nine o’clock upon the fair day there are three thousand one hundred sheep in hurdles upon the common, as counted by ${steward()} at a penny the score; eleven dealers out of Wiltshire, with their dogs; a gingerbread stall; and a man with a pig that tells the hour. The bargains are made in the old manner, by the blow of one palm upon another.

“Thirty-one shillings; and I’ll not strike twice.”

It is at this moment that Lord Cullerne’s agent rides in among the pens upon a tall horse, and without getting down hands you a paper over the hurdles. His lordship has the market at Wyvern by a charter of King John. A fair set up within seven miles of it, the paper states, is in law a nuisance to that market, and may be put down by action; but his lordship, being unwilling to go to law with a neighbour, will content himself with one third part of the tolls, to be paid every year at the Castle.

The agent waits for his answer. All round him the dealers go on striking hands.`,
  choices:[
    {t:'Pay his lordship his third.', note:'£13', go:() => { add({money:-13, standing:-1}); reg('cullerne', 1, 'You paid him a third of the tolls of your fair');
      return `${steward()} counts thirteen pounds out of the toll-bag into the agent’s hat before the pens are empty, and takes a receipt for it, in which the sum is called an acknowledgment. The dealers, who miss nothing that is done with money, see it counted; and it is told at Ilsley within the week that Hatherley fair belongs to the Castle.`; }},
    {t:'Send King Henry’s charter up to counsel.', note:'£35', go:() => { add({money:-35, standing:2}); reg('cullerne', -1, 'You set King Henry’s charter against his market');
      return `The parchment goes up to Lincoln’s Inn in a tin case, and comes down again in six weeks with an opinion of four sheets, for which thirty-five pounds are charged. Counsel is of opinion that a grant of King John is no bar to a grant of King Henry, where the fair is held upon another day than the market; that his lordship’s agent very well knows it; and that Mr ${S.sur} may keep his fair until the Day of Judgment. A fair copy is sent to the Castle. It is not answered.`; }},
    {t:'Tell him that King John may sue King Henry.', go:() => { add({goodwill:2}); reg('cullerne', -1, 'You sent his agent off your fair');
      return `You say it loud enough for the pens to hear. A dealer from Warminster laughs first, and the rest after him; the agent puts up his paper, turns his horse, and finds that the only way out of the fair lies down the whole length of the sheep lane, between two rows of drovers, at a walk. No writ comes from the Castle, in this year or the next; but his lordship’s own wethers, which were to have been penned at Hatherley, go to Ilsley.`; }}
  ]});

ev({ id:'ventWarren', follow:true, at:'hall', who:() => null, cond:() => live('warren') && !F('enclosed'), title:'Cabbage Stalks',
  text:() => `There are eight women at the kitchen door before you have breakfasted; and each of them carries in her apron whatever the rabbits have left of her garden. Sukey Pryor, who stands foremost, has brought the stalks only.

“Forty cabbages, sir. I counted them in, and I’ve counted them out.”

She is yet speaking when Rudd comes round the corner of the brewhouse, holding by one ear a boy of about eleven, who proves to be her own; and the boy holds two silver-greys by the hind legs, with the wire still about the neck of one of them. He was taken, Rudd says, within the bank, at first light.

“Within the bank!” says Sukey Pryor. “And where was your rabbits took, Mr Rudd? In my beans.”

The Act makes no distinction of rabbits. The women, having said what they came to say, stand with their aprons held open.`,
  choices:[
    {t:'Pay for the gardens, and pale the bank with oak.', note:'£22', go:() => { add({money:-22, goodwill:3}); reg('pryor', 1, 'You paid for the gardens your rabbits ate');
      return `${steward()} goes from garden to garden with a book, and values the whole damage at seven pounds four shillings, which is paid at the kitchen door in silver; and fifteen pounds more go in cleft oak pales, driven a foot into the ground along the cottage side of the bank. The boy is let go, with the rabbits. Rudd, who is consulted upon neither point, is heard to tell his dog that a paling will keep a rabbit in for exactly so long as it takes him to learn digging.`; }},
    {t:'Send the boy before the bench.', go:() => { add({goodwill:-4, standing:1}); reg('pryor', -2, 'You sent his boy before the bench for two rabbits');
      return `The boy goes before the bench at Wyvern upon the Saturday, is convicted upon Rudd’s oath, and has fourteen days in the bridewell at Reading. His mother walks there beside him, and walks back. The women take their stalks away with them; and from that week nothing whatever comes to the Hall door from the common, neither complaint, nor eggs, nor news.`; }},
    {t:'Rule that a rabbit found in a garden belongs to the pot.', note:'£8', go:() => { add({money:-8, goodwill:2});
      return `You rule that whatever is found in a garden belongs to the pot of that garden, and whatever is found within the bank to yourself; and the boy is let go with one rabbit of the two. Rudd touches his cap, and says nothing. He reckons himself eighty couple short by Christmas, to the value of eight pounds in skins and carcases; and it is remarked in the parish that the gardens upon the common were never so full of greens, nor planted so near the bank.`; }}
  ]});

ev({ id:'ventGravel', follow:true, at:'common', who:() => null, cond:() => live('gravel'), title:'A Pot of Brass Money',
  text:() => `Froome sends his boy for you before the dew is off; and when you come to the edge of the pit he is standing at the bottom of it, with his hat held out before him in both hands, and the hat is full of money.

“There’s a king’s head upon every one, sir; and never a George among ’em.”

His pick went through a grey pot at seven feet. There are three hundred and eleven pieces, the most of them brass, and as green as a duck-pond, with some thirty of silver no bigger than a spangle; and ${vicarNow()}, who has been sent for, and who goes down upon his knees in the gravel with a glass, reads CONSTANTINVS upon the first he takes up, and is for some minutes unable to read anything further.

The pot lay under your soil, and is yours. Froome, who found it, stands by with his empty hat. A silversmith at Reading gives so much the ounce for old metal; and ${vicarNow()} has said twice already that the Society of Antiquaries ought to be written to.`,
  choices:[
    {t:'Let the Society of Antiquaries have them.', go:() => { add({standing:2}); if (parsonId()) reg(parsonId(), 1, 'You gave the Hatherley coins to the Antiquaries');
      return `The coins go up to Somerset House in a tea-chest, with a letter of nine pages from ${vicarNow()}; and an account of them is read before the Society, as communicated by ${S.name}, Esquire, of Hatherley, which is afterwards printed in the Archaeologia, with a plate. Six copies come down by the coach. Froome has a guinea; and being shown his pot in the engraving, he gives it as his opinion that they have drawn it mended.`; }},
    {t:'Sell them to the silversmith, by weight.', note:'+£14', go:() => { add({money:14}); if (parsonId()) reg(parsonId(), -1, 'You sold three hundred Roman coins for the melting-pot');
      return `The silversmith weighs the silver in one scale and the brass in another, and gives fourteen pounds for the whole, of which a guinea goes to Froome. ${cap1(vicarNow())} begs one of the brass ones for his cabinet, and is allowed to choose it. The rest are in the melting-pot by Friday, emperors and all; and the brass of them, as the silversmith tells ${steward()}, makes a very tolerable candlestick.`; }},
    {t:'Keep the silver, and give Froome the brass.', go:() => { add({goodwill:2});
      return `You put the thirty of silver in a drawer, and give Froome the brass, with a guinea. For a month there is not a child in Hatherley without an emperor upon a string about its neck. The Bell takes them at four to the pint; and one of them, which ${vicarNow()} supposes to be a Carausius, and worth five guineas to a collector, is put by Jem Pryor into the plate at church.`; }}
  ]});

ev({ id:'ventKiln', follow:true, at:'starveall', who:() => null, cond:() => live('limekiln'), title:'A Warm Bed',
  text:() => `It is a black frost; and Liddiard, going up at four in the morning to tip his chalk, finds a man asleep upon the top of the kiln, with his head not a yard from the mouth of the shaft.

“Another quarter hour, sir, and I should have drawed him with the lime.”

He was got down by the heels, and sits now in the burner’s hovel, very upright upon a sack, with a grey face, and a paper in his hat. The paper is a pass, signed by a magistrate at Portsmouth: John Sayer, late a private in the Ninth Foot, discharged with a ball in the knee, is to be suffered to go to his own parish of Ludlow, and to be relieved upon the road. He has come sixty miles of it in nine days.

It is known to every tramper upon the Bath road that the smoke of a lime kiln stupefies a man before it kills him; and it is as well known that in a frost there is no other bed upon the downs that is warm.

The overseer, who has been fetched, observes that the man is not yet chargeable to Hatherley, and that the parish ends at the bottom of the hill.`,
  choices:[
    {t:'Keep him a week at the kiln, upon wages.', note:'10s.', go:() => { add({money:-0.5, goodwill:1});
      return `He is a week at Starveall, wheeling chalk for Liddiard as well as a man may upon one knee, and sleeping in the hovel; and upon the Saturday he has nine shillings with the rest, and a shilling over. He is gone up the Lambourn road before it is light upon the Monday. Liddiard finds the hovel swept, the sacks folded, and upon the shelf, set in the middle of it where it cannot be missed, a pewter button of the Ninth Foot.`; }},
    {t:'Back his pass with a shilling, and see him over the boundary.', go:() => { add({goodwill:-1});
      return `You write upon the back of his pass that he was relieved at Hatherley with one shilling, and sign it. The overseer walks beside him to the bottom of the hill, where the parish ends at a stone; sees him across it, and some few yards beyond; and turns back to his breakfast. Liddiard watches from the kiln until the man is out of sight upon the Lambourn road, which takes, at the pace he goes, the better part of an hour.`; }},
    {t:'Rail the top of the kiln, and put up a board.', note:'£6', go:() => { add({money:-6, goodwill:1});
      return `The top of the kiln is railed round with oak, at six pounds, and a board is nailed to the rail, warning all persons against lying down there. The soldier has his shilling, and goes on. Before the frost breaks Liddiard has pulled two more men from within the rails, one of whom had hung his coat upon the board.`; }}
  ]});

ev({ id:'ventHops', follow:true, at:'coldharbour', who:() => null, cond:() => live('hops'), title:'Weyhill',
  text:() => `Your hops go to Weyhill fair in twenty-six pockets, upon two wagons, and are stood on end in the row where the buyers from the Borough of Southwark walk every October with their coats buttoned over their pocket-books. ${steward()} has slept upon the wagon.

A factor in a tall hat stops before your pockets at eight in the morning, runs his arm into one of them to the shoulder, brings up a handful from the middle, rubs it between his palms, and smells them.

“Six pound ten the hundredweight; and I never name a price twice.”

It is a middling price. But it is said in the row that half the Kent growth is gone with the mould, and that hops will be at nine pounds before the booths are lit; and it is said, three pockets further down, that forty wagons from Worcester are at this moment upon the Andover road, and that hops will be at five.`,
  choices:[
    {t:'Take his six pound ten.', note:'+£20', go:() => { add({money:20});
      return `${steward()} strikes hands with him. The pockets are weighed at the fair beam, and paid for upon the spot in Bank paper out of the buttoned coat: twenty pounds more than the Reading brewer had offered for them at the oast. By four in the afternoon the Worcester wagons have not come, and hops are at eight pounds. The factor in the tall hat passes you in the row, and bows.`; }},
    {t:'Hold them until evening.', note:'+£45 or −£10', go:() => { const up = chance(0.5); add({money:up ? 45 : -10});
      return up ? `The pockets stand all day. At noon a second factor offers seven pounds, and at two a third offers seven pounds fifteen; no wagon comes in from Worcester, then or afterwards; and when the lamps are lit in the booths the man in the tall hat returns, puts his arm into the same pocket as before, and gives nine pounds for what he might have had at six pound ten. ${steward()} carries the money home inside his shirt.`
        : `The pockets stand all day. At three o’clock the first of the Worcester wagons is seen coming over the hill from Andover, with thirty-nine behind it; by four, hops are at five pounds; and the factor in the tall hat, being found at his dinner, says that he has bought. Your twenty-six pockets go at dusk to a Salisbury brewer, at four pounds fifteen; and the wagons come home empty, in the rain, by the road upon which Worcester went in.`; }}
  ]});

/* The colt's Tuesday at Abingdon. He wins rather oftener than not; the price is spoilt either way by the man in the furze. */
function scaifeColt(stake){ const won = chance(0.55); if (stake) add({money:won ? 3 * stake : -stake});
  if (!stake) return won ? `Mr Scaife says that it is every gentleman’s own affair, and touches his hat. Upon the Tuesday week the colt wins at Abingdon in two heats, at three to one; and the first you hear of it is from Mr Hartopp, who had ten guineas upon him, and who cannot conceive how a man with the horse upon his own ground should have known nothing of the matter.`
    : `Mr Scaife says that it is every gentleman’s own affair, and touches his hat. Upon the Tuesday week the colt runs out at Abingdon in the second heat; and Mr Hartopp, who had ten guineas upon him by the advice of a person he met in a furze bush, rides over to enquire what sort of horses you keep upon your down.`;
  const g = numWords(stake / 1.05), back = numWords(3 * stake / 1.05);
  return won ? `The man in the furze bush is at Abingdon before you; and the colt, who should have started at six to one, starts at three. He wins his two heats notwithstanding, with his ears pricked and the boy sitting still; and Mr Scaife brings your ${g} guineas to the Hall in a nosebag, with ${back} more on top of them, which he counts out twice upon the hall table.`
    : `The man in the furze bush is at Abingdon before you; and the colt, who should have started at six to one, starts at three. He wins the first heat with his ears pricked. In the second a dog runs upon the course at the distance post; the colt goes upon one side of the post, and the boy upon the other; and the Plate is given to a mare from Wantage. Mr Scaife does not mention the ${g} guineas again, and neither do you.`; }
ev({ id:'ventGallops', follow:true, at:'maddle', who:() => null, cond:() => live('gallops'), title:'The Trial',
  text:() => `A boy from Maddle brings word overnight, that if Mr ${S.sur} should happen to be upon the down at half past four, and should happen to be alone, Mr Scaife would take it kindly.

It is scarcely light. Two horses are stripped at the mile post: an old bay, who has won nine plates, and is known to every ostler between this and Epsom; and a chestnut colt of three years, who was never yet seen upon a course. They come up the gallop together; and at the rubbing-house, where Mr Scaife stands with his watch in his hand, the colt is leading by as far as a man might throw his hat.

“You saw nothing this morning, sir; and no more did I.”

He puts up the watch. The colt is entered for the Fifty Pound Plate at Abingdon upon Tuesday week, where he will start at five or six to one, there being nobody in Berkshire who knows any good of him; and if you care to hand over twenty guineas, Mr Scaife will see them laid with his own. A furze bush, some forty yards down the hill, is at this moment observed to have a hat in it.`,
  choices:[
    {t:'Twenty guineas upon the colt.', note:'+£63 or −£21', go:() => scaifeColt(21)},
    {t:'Five, for civility.', note:'+£15 15s. or −£5 5s.', go:() => scaifeColt(5.25)},
    {t:'Wish him luck, and keep your money.', go:() => scaifeColt(0)}
  ]});

ev({ id:'ventSpa', follow:true, at:'hall', who:() => null, cond:() => live('spa'), title:'A Master of the Ceremonies',
  text:() => `The pump room has been open three weeks; and the subscription book, which lies upon a desk beside the door with a new pen, has four names in it: a General’s widow from Clifton, with a pug; a gentleman late of Madras, of the colour of a guinea, who is wheeled; and two Miss Tubneys of Reading, who share a glass.

Into this company there walks, upon a Monday, a thin person in pumps and a blue coat, who makes one bow to the widow, a second to the pug, and a third, of greater depth, to yourself. He is a Mr Capper; he has taught dancing at Reading these nineteen years; and he is come to offer himself.

“A watering-place without a Master of the Ceremonies, sir, is nothing but a pump.”

His terms are thirty guineas for the season, and a ball for his own benefit at the end of it. For this he will receive the company, regulate the hours, settle the precedence at the pump, lead out the lady of highest rank, and find two fiddles and a harp at his own cost. The widow has been heard to say, that at Clifton there was at least somebody to tell one who everybody was.`,
  choices:[
    {t:'Engage Mr Capper.', note:'£31 10s.', go:() => { add({money:-31.5, standing:2});
      return `Mr Capper is in office by Wednesday, with a white wand. He draws up eleven rules, which are framed and hung beside the pump, and of which the ninth forbids gentlemen to appear in boots; and at the first ball, the company consisting of nine ladies and two gentlemen, one of whom is wheeled, he opens it himself with the General’s widow, dances every dance after, and gives out from the top of the room that the Hatherley season is begun.`; }},
    {t:'Let the pump-woman keep the book.', go:() => { add({standing:-1});
      return `Mr Capper makes three bows in going out, each shallower than the last. The pump-woman keeps the book, and receives the company by asking each person, at the door, whether it is to be warm or cold. The General’s widow drinks her three glasses a day for a fortnight in entire silence; and she is then understood to have removed to Cheltenham, where she informs a card-table that the Hatherley water is very well, but that there is nobody there.`; }},
    {t:'Give a public breakfast yourself, and save the thirty guineas.', note:'£12', go:() => { add({money:-12, goodwill:1, standing:1});
      return `You give a breakfast in the pump room upon the Thursday, with tea, hot rolls, a cold ham, and the Wyvern band of music upon the grass; to which come the four subscribers, ${vicarNow()}, eleven of your tenants with their wives, and the whole of the village as far as the door. The ham is finished by ten. ${steward()} sends a paragraph to the Reading Mercury, which prints it upon the Monday, under the head of Fashionable Intelligence, between Brighton and Weymouth.`; }}
  ]});

ev({ id:'ventPrize', follow:true, at:'hall', who:() => null, cond:() => live('privateer') && atWar(S.year), title:'From the Agents at Bristol',
  text:() => { const n = neutralFlag(); return `The letter is charged double, and ${steward()} pays one and fourpence for it at the door.

“Bristol, Tuesday.

Sir,

We have the pleasure to acquaint you that the Hetty has sent into Kingroad the ship ${n.ship}, of three hundred tons, laden with wines, brandies and prunes from Bordeaux, and taken eleven leagues to the westward of Ushant after a chase of nine hours. She was under ${n.flag} colours, and her master swears himself ${n.home}; but as he swears it in very good French, and as a second set of papers was seen to go out at his cabin window in a weighted bag, Captain Tamlyn makes no doubt of her being condemned.

The High Court of Admiralty will sit upon her next term. Should she be condemned as prize, we compute your sixteenth at two hundred and eighty pounds, clear of all charges. Should she be restored to her claimants as a neutral, the owners will be answerable for costs and damages, which in your proportion may come to thirty.

A gentleman of this city, who makes it his business, offers in the mean time to buy the chance of any owner at one quarter of its computed value; being, for your sixteenth, seventy pounds in hand. We wait your instructions by return of post, and are,

Sir, your most obedient humble servants,

FARR and PENNY.”`; },
  choices:[
    {t:'Sell the chance, for seventy pounds in hand.', note:'+£70', go:() => { add({money:70});
      return chance(0.45) ? `The seventy pounds come by the next Bristol mail, in a bill at sight. Of the ship herself you hear nothing for five months, and then only from the Mercury, in six lines of the ship news between a wreck and a bankruptcy, where it appears that the Court has condemned her; and Mr Hartopp, who reads the ship news, asks you across the table at the next Sessions dinner what the sixteenth part of nine hundred pipes of wine may come to.`
        : `The seventy pounds come by the next Bristol mail, in a bill at sight. Of the ship herself you hear nothing for five months, and then only from the Mercury, in six lines of the ship news between a wreck and a bankruptcy, where it appears that the Court has restored her to her master, with costs against the captors. Messrs. Farr and Penny do not write; the gentleman who makes it his business, as you suppose, has heard from them.`; }},
    {t:'Stand the trial.', note:'+£280 or −£30', go:() => { const n = neutralFlag(), won = chance(0.45); add({money:won ? 280 : -30});
      return won ? `The Court is four months in coming to her, and twenty minutes in disposing of her, it being the Judge’s opinion that an honest neutral does not put his papers into the sea. Ship and cargo are condemned as lawful prize. The wines are sold by the candle at the Exchange Coffee-house; and Messrs. Farr and Penny remit you two hundred and eighty pounds, having first deducted, as their letter explains through a page and a half, everything that the law allows an agent to deduct.`
        : `The Court is four months in coming to her. Her master produces in the mean time a third set of papers, ${n.proof}; she is restored to him, with costs and damages against the captors; and Messrs. Farr and Penny, in a letter a good deal shorter than their last, request the favour of thirty pounds by return of post.`; }}
  ]});

ev({ id:'ventThresher', follow:true, at:'home', who:() => null, cond:() => live('thresher'), title:'Under the Great Door',
  text:() => `${steward()} is waiting at the great doors of the barn when you ride into the yard, with a paper held up in one hand, and a flint in the other.

“It was under the door, sir, when the carter came; and this stone was laid upon it.”

The paper is half a leaf out of a copy-book, written upon with a burnt stick:

“Sir this is to a Quaint you that if your thrashing Mesheen is not took Down afore Candlemas we shall Comence our Labers. their is Six of us as cant get Bred for our Childern and you have a Dry Barn. we Do not wish you no harm sir and remane Yr umble Servents to comand.”

There is no name to it. ${steward()} has already laid the hand beside the vestry book, in which four of your six threshers sign with a cross; and he is ready to swear to one of the other two.

Candlemas is five weeks off.`,
  choices:[
    {t:'Offer ten guineas reward, by handbill.', go:() => { add({standing:1, goodwill:-3});
      return `The bill is upon the church door, the Bell, and the barn itself by Saturday:

“WHEREAS a threatening LETTER, without a Name, was on the Night of Tuesday last left at the Barn of ${S.name}, Esquire, at Hatherley; whoever will discover the Writer or Writers thereof shall, on Conviction, receive TEN GUINEAS Reward.”

Nobody comes for the ten guineas. The copy upon the barn is found on the Monday morning with its face turned to the door; and it has been nailed up again so, very neatly, with its own four nails.`; }},
    {t:'Stop the machine, and give the six their flails again.', note:'+£40', go:() => { if (live('thresher')) stopVenture('thresher', 'Taken down'); add({money:40, goodwill:5});
      return `The horses are taken out of the ring, and the hole in the barn wall is stopped with a hurdle. The six are at the great doors by seven upon the Monday; they take down their flails from the pegs without a word to ${steward()} or to one another; and before eight the sound of them is going in the barn, two and two, as it has gone every winter since the barn was built. The machine stands until Lady Day under a rick-cloth, and is then sold to Mr Hartopp, for forty pounds and the carriage.`; }},
    {t:'Keep the machine, and find the six men hedging until Lady Day.', note:'£18', go:() => { add({money:-18, goodwill:3});
      return `The machine goes on. The six are set to plash the park hedges and to scour the home ditches, at nine shillings a week, from this day until Lady Day; which comes, by ${steward()}’s reckoning, to eighteen pounds that the machine was bought to save. No second paper is found. The hedges of the home farm are remarked upon, when the tenants ride in with their rents, by every one of them.`; }}
  ]});

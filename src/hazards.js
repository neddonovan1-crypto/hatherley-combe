/* The hazards of the last three years: what a squire may put his money upon while the war ends, begins again, and ends.
   The public history is fixed and the private fortune is not: the coats are wanted until the peace, and the horses until the battle; whether yours were sold or landed in time is the hazard.
   Sources: the State Lottery, contracted for by Mr Bish among others, and drawn from two wheels by boys of Christ's Hospital; the fraud upon the Stock Exchange of Monday 21 February 1814
   (the officer in scarlet at Dover, the post-chaise with the white cockade over London Bridge, the napoleons paid to the post-boys at the Marsh Gate, Omnium from 27½ to 33 and back,
   Lord Cochrane tried for it in June); the peace of 1814 and the army's contracts ended; the army in Flanders in the spring of 1815, and the battle of 18 June.
   Invented: Hartopp's brother-in-law and his greatcoats, the forty horses, the barber at Wyvern, and every sum. */
Object.assign(LATE, {
  lottery:{ when:() => S.year >= 1813,
    news:() => `Mr Bish has the State Lottery to draw this year, with two prizes of twenty thousand pounds in the wheel; and the barber at Wyvern, who is his agent, has tickets in the window at one-and-twenty pounds.` },
  contract:{ when:() => S.year >= 1813,
    news:() => `Hartopp’s brother-in-law at Reading has the contract to find six thousand greatcoats for the army in Spain, at thirty-one shillings the coat; and wanting money to buy his cloth, he will take a partner for a third.` },
  remounts:{ when:() => S.year >= 1815,
    news:() => `Bonaparte is at the Tuileries, and the Duke of Wellington at Brussels with an army that wants horses for its wagons; the Commissariat gives forty pounds a head for a draught horse landed at Ostend, and every dealer in the county is upon the road to Ramsgate.` }
});
Object.assign(VENTURES, {
  lottery:{ fx:['+£20,000, £2,000 or £300, very seldom', '+£12 about one time in five', MINUS + ' A blank four times in five'], risk:4, odds:{"well": 0.01, "dull": 0.2, "ill": 0.79}, effects:`One ticket, drawn within the quarter. Four in five are blanks, most of the rest draw £12, and there are two prizes of £20,000 in the wheel. A new ticket may be had when the last is drawn.`,
    name:'A ticket in the State Lottery', line:'A whole ticket from Mr Bish’s office. A Bluecoat boy draws the numbers from one wheel, and another boy draws from a second wheel what each number shall have.', where:'The barber’s, Wyvern', cost:21,
    no:() => S.year >= 1815 && S.season >= 3 ? 'The wheels are put away until the spring.' : '',
    well:'Two prizes of twenty thousand pounds, and somebody must have them.', ill:'Four tickets in five come up blanks.', begin:() => { S.flags.lotTickets = (S.flags.lotTickets || 0) + 1; }, state:() => 'In the wheel' },
  contract:{ fx:['+£300 a quarter while the war lasts', MINUS + '£250 when a delivery is condemned', MINUS + '£700 if a peace finds you a partner', '+£800 if sold before'], risk:3, odds:{"well": 0.5, "dull": 0.15, "ill": 0.35}, effects:`About £300 a quarter while the army wants coats, and £250 lost when the Inspector sends a delivery back. The share sells for £800. If a peace is made while you hold it, the cloth is left upon your hands, and £700 with it.`,
    name:'A third of an army clothing contract', line:'A partnership with a Reading clothier, who makes greatcoats to the Board’s pattern. The Board pays upon delivery, in bills at ninety days.', where:'Reading', cost:1200,
    no:() => S.year >= 1815 || (S.year === 1814 && S.season >= 1) ? 'The army is coming home, and the Board wants no coats.' : '',
    well:'Sixty thousand men, in a country where it rains.', ill:'The contract is for the war, and nobody at Reading knows how long that is.', state:v => 'Making greatcoats since ' + v.year,
    endLabel:'Sell your third', end:() => { S.money += 800; S.flags.contractFate = 'sold'; return `Your third of the greatcoat contract is sold to a Reading maltster for £800.`; }},
  remounts:{ fx:['+£1,700 if they are landed before the armies meet', '+£360 if they are landed after', '+£150 if the passage is a bad one'], risk:4, odds:{"well": 0.45, "dull": 0.35, "ill": 0.2}, effects:`Forty draught horses, bought at the spring fairs and shipped from Ramsgate. £1,700 if the Commissary passes them before the armies meet, £360 if they are landed when he has done buying, and £150 if the passage is a bad one.`,
    name:'Forty horses for the army in Flanders', line:'Draught horses of fifteen hands and upward, bought at Ilsley and Reading fairs, and walked to Ramsgate by a dealer. A transport carries them to Ostend in a day, with a fair wind.', where:'Ramsgate', cost:900,
    no:() => S.year > 1815 || (S.year === 1815 && S.season >= 1) ? 'The Commissary has done buying.' : '',
    well:'Forty pounds for a horse that cost eighteen at Ilsley.', ill:'The price is for a horse landed at Ostend, upon the day he is wanted.', state:() => 'Upon the road to Ramsgate' }
});
const lotNo = () => (1000 + Math.floor(Math.random() * 18999)).toLocaleString('en-GB');
{ const tick = ventureTick;
  ventureTick = function(line){ tick(line); if (S.dead || S.phase === 'end') return; const y = S.year, q = S.season;
    if (y === 1814 && q === 0 && !F('hoaxDue')) { S.flags.hoaxDue = true; later('hoax1814', 0); }
    if (!S.vent) return;
    if (live('lottery')) { const v = vent('lottery'), r = Math.random(), n = lotNo(), won = r < 0.0005 ? 20000 : r < 0.003 ? 2000 : r < 0.013 ? 300 : r < 0.21 ? 12 : 0, drawn = `Upon the fourth day of the drawing the Bluecoat boy put his arm into the wheel, and brought out No. ${n}, which is yours; and the boy at the other wheel, who draws what each number shall have, held up `;
      if (won) { line('A prize in the State Lottery', won); if (won >= 300 && won >= (S.flags.lotWon || 0)) { S.flags.lotWon = won; S.flags.lotYear = y; } }
      S.notes.push(won === 20000 ? `There were two prizes of twenty thousand pounds in the wheel, and No. ${n}, which is yours, has drawn the second of them. Mr Bish has printed your name upon a bill, with the number, and posted it in every town between London and Bath; and by Thursday eleven persons had written to the Hall, of whom nine are cousins.`
        : won === 2000 ? `No. ${n}, which is yours, has come up a capital prize of two thousand pounds. The barber at Wyvern has had the number painted over his door, in figures a foot high; and he sold forty sixteenths in the week after.`
        : won === 300 ? drawn + `a prize of three hundred pounds. The barber at Wyvern, who sold it, has chalked the number upon his shutter.`
        : won ? drawn + `a prize of twelve pounds; which the barber at Wyvern has paid across his counter, in his own notes.` : drawn + `a blank.`);
      delete S.vent.lottery; }
    if (live('contract')) {
      if (y > 1814 || (y === 1814 && q >= 1)) { line('Greatcoats left upon hand at the peace', -700); stopVenture('contract', 'Ended by the peace'); S.flags.contractFate = 'peace';
        S.notes.push('The Board has written to every contractor that His Majesty has no further occasion for greatcoats; and Hartopp’s brother-in-law has four thousand of them in a warehouse at Reading, made to the pattern, with the King’s button, which he offers to the trade at nine shillings.'); }
      else if (chance(0.12)) { line('The contract: a delivery of greatcoats condemned', -250); S.notes.push('The Inspector of Army Clothing has opened a bale of the Reading greatcoats at the Tower, and wetted one; and having measured it when it was dry, he has sent back the delivery.'); }
      else { line('A third of the greatcoat contract', 300); S.yearIncome += 300; } }
    if (live('remounts') && y === 1815 && q >= 1) { const r = Math.random();
      if (r < 0.45) { line('Forty horses, passed by the Commissary at Ostend', 1700); S.flags.remountFate = 'early'; S.notes.push('Your forty horses were landed at Ostend upon the ninth of June, and passed by the Commissary upon the eleventh, at forty pounds a head, and two pounds ten for each that he would not have. The battle was fought upon the eighteenth.'); }
      else if (r < 0.8) { line('Forty horses, sold upon the quay at Ostend', 360); S.flags.remountFate = 'late'; S.notes.push('Your forty horses lay eleven days at Ramsgate for want of a transport, and were landed at Ostend upon the twenty-third of June; by which day the battle had been fought, the Commissary had shut his book, and half the dealers of Kent were upon the quay. They made nine pounds a head.'); }
      else { line('Forty horses, what was left of them', 150); S.flags.remountFate = 'lost'; S.notes.push('The transport that had your forty horses was three days in the Downs with the wind at south-west, and put back to Ramsgate with seven of them dead, and the rest not fit to be shown; where they have been sold for what the knackers and the bathing-machine men would give.'); }
      stopVenture('remounts', 'Sold'); } }; }

/* ---------- Monday, 21 February 1814 ---------- */
ev({ id:'hoax1814', follow:true, at:'wyvern', who:() => 'hartopp', cond:() => S.year === 1814, title:'Laurel in the Guard’s Hat',
  text:() => `On Monday the Bath mail comes down with laurel in the guard’s hat; and the guard, who does not get down, calls into the George yard that an officer in scarlet landed at Dover in the night from France, that Bonaparte is killed by Cossacks, and that the Allies are in Paris.

Hartopp is at the Hall within the hour, upon a horse that he has not stayed to have properly girthed; and he has in his hand a slip from his broker, sent down by the same coach, and written at eleven that morning.

“Omnium is at thirty-two, sir, and was twenty-seven on Saturday. I have sent to buy.”

The ringers are in the churchyard already, asking for the key of the tower; and Mr Tidmarsh’s clerk, who rides to town to-night with the bank’s letters, will carry an order for any gentleman that gives him one before six.`,
  choices:[
    {t:'Give the clerk an order for two thousand pounds of Omnium.', note:'A hazard', if:() => S.money >= 400, go:() => { if (chance(0.55)) { S.flags.hoax = 'bit'; add({money:-320});
        return `The clerk was at the broker’s door in Cornhill by nine on Tuesday, and bought at thirty-one. By noon it was known that nobody at the Admiralty had seen the officer in scarlet; that a second party, wearing the white cockade, had driven over London Bridge in a chaise and four, and got down at a hackney stand; and that Omnium was at twenty-seven and a half.

The Committee of the Stock Exchange has since found that three gentlemen sold near a million of it upon the Monday morning, and that one of them is a Post-Captain, and Member for Westminster. Your own is sold upon the Thursday; and the difference, with the broker’s eighth, is three hundred and twenty pounds.`; }
      S.flags.hoax = 'late';
      return `The clerk’s horse fell lame at Maidenhead, and he was not in Cornhill until two on Tuesday; by which hour it was known that nobody at the Admiralty had seen the officer in scarlet, and Omnium was at twenty-seven and a half. He has brought your order home in his pocket-book, with a bill of eleven shillings from the farrier.

Hartopp’s broker bought for him at thirty-two and a half; and Hartopp, who walks over on Thursday to ask what you think of drilled beans, stays an hour without once naming the Funds.`; }},
    {t:'Wait for the Gazette.', go:() => { S.flags.hoax = 'waited';
      return `No Gazette is printed. Upon Tuesday night the mail comes down without laurel; and the guard, who gets down this time, says that the officer in scarlet was seen to pay his post-boys in napoleons at the Marsh Gate, that nobody has seen him since, and that Omnium has fallen five in an afternoon.

Hartopp’s broker bought for him at thirty-two and a half; and Hartopp, who walks over on Thursday to ask what you think of drilled beans, stays an hour without once naming the Funds.`; }},
    {t:'Give the ringers the key, and a guinea for beer.', note:'£1', go:() => { S.flags.hoax = 'bells'; add({money:-1, goodwill:2, standing:-2});
      return `Hatherley bells are rung from two o’clock until dark, three hours and forty minutes, with one stop for the beer; and they are heard at Wyvern, where the Rector, who is waiting for his newspaper, has kept the key of his own tower in his pocket.

The newspaper comes on Wednesday. At the Easter Sessions the chairman, having called over the list of magistrates, asks whether the gentleman from Hatherley has any intelligence from France to lay before the Bench.`; }}
  ]});

/* ---------- Thursday, 22 June 1815 ----------
   Major Percy brought the Duke's despatch through Kent, and was in St James's Square with the two eagles at eleven on the Wednesday night: no Berkshire house saw him.
   The officer here is a second man, invented, sent off after midnight for the General at Bristol: he is the man of the old paper 'waterloo', who comes up the Bath road standing in a post-chaise.
   This paper is read first, in the same summer, and the Gazette Extraordinary after it (see pickEvent and next below); London has the news already, and Hatherley has it an hour or six before Wyvern.
   The rumours of a defeat, and the fall of the Funds upon them, are of record. That the Admiralty manned its shutters again for the Hundred Days is believed and not checked. */
const hadShutters = () => { const v = vent('telegraph'); return !!v && (!v.ended || v.how === 'Shut at the peace'); };
const newsStake = () => Math.min(3000, Math.floor(S.money / 100) * 100);
ev({ id:'waterloo1815', follow:true, at:'hall', who:() => null, cond:() => S.year === 1815, title:'Breakfast for an Officer',
  text:() => `For three days it has been said in Wyvern that the Duke is beaten before Brussels, and the Prussians cut to pieces; Hartopp has told the ordinary at the George that he sells upon Thursday; and Omnium, which was at par a week ago, may be had across Mr Tidmarsh’s counter, of any gentleman who left his scrip there, at five discount.

At half past five this morning, being Thursday, a chaise and four from London loses a wheel at your gate; and there gets down out of it, in the coat of a Staff officer, with the dust of sixty miles upon him, a Captain of the Adjutant-General’s office, who is carrying a paper to the General at Bristol, and who must have a wheelwright and a breakfast.

“It was on Sunday, sir, at a place called Waterloo. Bonaparte is beat, and his army is gone.”

He lets you read the paper while he eats: a hundred and fifty guns taken, and two eagles, which were put out at the windows of a post-chaise in St James’s Square last night at eleven. He means, when he has a wheel, to go through Wyvern standing up in the chaise, and to cry it at every turnpike as far as Bristol.

The wheelwright says an hour; Tidmarsh opens at nine; and until the chaise is upon the road again, nobody in the county but yourself and two post-boys knows what the Captain has in his pocket${hadShutters() ? `. Upon the Down, where the Admiralty put Lieutenant Tregear back into his hut in April, the six shutters stand open to the first of the light, and nothing has yet come down from London` : ''}.`,
  choices:[
    {t:'Bid the wheelwright take till noon, and be at Tidmarsh’s counter at nine.', note:() => 'Lays out ' + fmt(newsStake()), if:() => S.money >= 300, go:() => { const stake = newsStake(), gain = Math.round(stake * .35 / 10) * 10, known = chance(.5); add({money:gain}); S.flags.waterloo = known ? 'known' : 'bought'; S.flags.waterlooGain = gain;
      if (known) { add({standing:-5}); reg('hartopp', -2, 'You bought his Omnium upon the morning of the news'); }
      return `The wheelwright, who has had a crown and a word, finds the box of the wheel cracked, and sends to Kintbury for another. The Captain is given a second breakfast, and the Peerage to read; and between nine and noon, at five discount and under, you take across Tidmarsh’s counter the Omnium of eleven gentlemen, two clergymen, and a widow at Speen, to the amount of ${fmt(stake)}.

At ten minutes past twelve the chaise goes through Wyvern at a gallop, with the Captain standing up in it. By Saturday the scrip is at six premium in London; and Tidmarsh’s clerk, selling for you, brings back ${fmt(gain)} over what was given.

${known ? `It is recollected in Wyvern by Sunday that the chaise stood six hours at your gate upon the Thursday, with your own wheelwright under it; and Hartopp, who sold at eleven o’clock that morning, goes by you in the churchyard without his hat moving.`
  : `The wheelwright, who is deaf, has since been asked by half the county what it was that kept him.`}`; }},
    {t:'Walk up to the Down, and put fifty pounds and an order for Plymouth into the Lieutenant’s hand.', note:() => '£50, and lays out ' + fmt(newsStake()), if:() => hadShutters() && S.money >= 350, go:() => { const stake = newsStake(), gain = Math.round(stake * .8 / 10) * 10 - 50, found = chance(.35); add({money:gain}); S.flags.waterloo = found ? 'inquiry' : 'shutters'; S.flags.waterlooGain = gain;
      if (found) add({standing:-8});
      return `Lieutenant Tregear looks at the fifty pounds for some time, and at the order for longer. He then sends both his seamen down to the Hall for their breakfast, and goes to the ropes himself; and in four minutes, by sixty-three changes of which he has never told you the meaning of one, a prize agent at Plymouth Dock is desired to buy Omnium and Navy bills, for a gentleman in Berkshire, of every officer’s widow and dockyard clerk that will sell.

At eight a haze comes up the valley from Newbury; so that the Admiralty’s own signal, which leaves Whitehall at ten, is not seen beyond Inkpen until noon upon the Friday. The Captain is upon the road again by seven, crying it at every turnpike; but a chaise is three days to Plymouth, and the agent, who has the whole of them, remits you ${fmt(gain)}.

${found ? `In August two gentlemen come down from the Navy Board, with the signal-books of nine stations, to ask what was passed westward from Hatherley at ten minutes before six upon the 22nd of June. The Lieutenant is superseded; and the two gentlemen, who dine at the George, are told there whose turf the hut stands upon.`
  : `The Lieutenant, of whom nobody at the Navy Board has asked anything, has bought a horse.`}`; }},
    {t:'Send to the church, and have the bells rung.', go:() => { const again = S.flags.hoax === 'bells'; S.flags.waterloo = 'bells'; add({goodwill:4, standing:2});
      return `${again ? `The ringers, having rung for the death of Bonaparte in February of last year, send up to ask whether they may see the officer; and the Captain, with his mouth full, is walked down to the churchyard, and shown to them over the wall.` : `The ringers are got out of their beds by the sexton’s boy, and the Captain, who hears the first of it from the breakfast-room, gets up and shuts the window.`}

Hatherley bells begin at ten minutes past six; and when the chaise goes through Wyvern at seven, with the Captain standing up in it, the ringers there are already upon the tower stair, having sent a boy to learn what Hatherley knows. Hartopp, who hears the bells in his yard, with his boots on for Wyvern, does not sell.`; }},
    {t:'Ride over to Hartopp before he sells.', go:() => { S.flags.waterloo = 'told'; add({standing:1}); reg('hartopp', 2, 'You rode over with the news before he sold');
      return `Hartopp is found in his yard, booted for Wyvern, with the scrip in his pocket-book. He reads what you have copied from the Captain’s paper twice through; puts the pocket-book into the corn bin, and locks it; and has told four of his neighbours before the chaise is mended, who tell eleven more; so that when Tidmarsh takes down his shutters at nine, there is no Omnium to be had across his counter at any price.`; }}
  ]});

/* ---------- what the Mercury recollects of it in 1815 ---------- */
function hazardNotes(){ const P = [], f = S.flags;
  if (f.lotWon >= 2000) P.push(`He drew a prize of ${fmt(f.lotWon)} in the State Lottery of ${f.lotYear}. The barber at Wyvern, who sold him the ticket, has sold eleven hundred since.`);
  else if (f.lotTickets >= 3 && !f.lotWon) P.push(`He had ${numWords(f.lotTickets)} tickets in the State Lottery. All were blanks.`);
  if (f.contractFate === 'peace') P.push(`He was a partner in army greatcoats when the peace was signed. Some of the coats are worn in Hatherley now, at the plough, with the King’s button cut off.`);
  else if (f.contractFate === 'sold') P.push(`He made greatcoats for the army in Spain, and sold his share while the war lasted. Reading called him timid that winter.`);
  if (f.remountFate === 'early') P.push(`He landed forty horses at Ostend nine days before the battle. The Commissary paid forty pounds a head.`);
  else if (f.remountFate === 'late') P.push(`He landed forty horses at Ostend five days after the battle. They are believed to be drawing Flemish carts.`);
  if (f.hoax === 'bit') P.push(`He bought Omnium upon the morning that Bonaparte was killed by Cossacks. Bonaparte is at St Helena.`);
  else if (f.hoax === 'bells') P.push(`Hatherley bells were rung for the death of Bonaparte in February 1814. He paid the ringers.`);
  if (f.waterloo === 'known') P.push(`He had the news of Waterloo six hours before Wyvern, and is believed to have made ${fmt(f.waterlooGain)} by it. Wyvern has counted the hours.`);
  else if (f.waterloo === 'inquiry') P.push(`The Navy Board has inquired into a signal passed down the Plymouth line from Hatherley Down upon the morning of the 22nd of June. Lieutenant Tregear is no longer in the service.`);
  else if (f.waterloo === 'bells') P.push(`Hatherley bells rang for Waterloo an hour before any other in the county.`);
  else if (f.waterloo === 'told') P.push(`Mr Hartopp holds his Omnium still. He says that he owes it to a neighbour.`);
  return P; }

/* The officer's breakfast comes before the Gazette, and both in the summer of 1815: the one is put in front of the other when it is drawn, and the Gazette is opened when the breakfast is done. */
{ const pick = pickEvent; pickEvent = function(){ const id = pick(); if (id === 'waterloo' && !S.seen.waterloo1815) { S.flags.gazetteAt = S.t; return 'waterloo1815'; } return id; };
  const go = next; next = function(){ if (S.phase === 'outcome' && !S.dead && S.flags.gazetteAt === S.t && S.seen.waterloo1815 === S.t && S.seen.waterloo === undefined) { const e = byId('waterloo'); if (e && (!e.cond || e.cond())) { S.pending = 'waterloo'; S.phase = 'event'; save(); render(); window.scrollTo({top:0, behavior:'smooth'}); return; } } go(); }; }

/* ---------- a toll bridge at the Mill, by private Act (Ned, 28 Nov 2026: "like the turnpike which is a bridge toll, through buying an act of parliament") ----------
   Of record: private bridge Acts and their tolls (Swinford, 1767; Whitchurch, 1792, both upon the Thames and both taking toll yet); the fees paid at every stage of a private Bill;
   the clause forbidding any ferry within a distance of the bridge; the freedom from toll of persons going to their parish church, which the old Acts did not give to a meeting-house.
   Invented: Ruddle, Zion Chapel and Mr Bunce, the sums and the tolls. */
const bridgeCost = () => F('mp') ? 950 : 1100;
VENTURES.bridge = { fx:["+£95 a year in tolls", "+1 Standing", MINUS + "2 Goodwill", MINUS + "£110 when a flood shakes a pier", "+£800 if sold"], risk:1, odds:{"well": 0.85, "dull": 0.05, "ill": 0.1}, effects:`About £95 a year in tolls. Standing rises a little. Goodwill falls a little while the halfpenny is taken. A flood may cost £110 in a pier. The bridge and its tolls sell for £800. A Member carries his own Bill, and saves £150 of the fees.`,
  name:'A toll bridge at the Mill, by Act of Parliament', line:'Three arches of brick where the ford is, and a house with a bar at the Hatherley end. A private Act gives you the tolls for ever, and stops the ford.', where:'The Mill',
  get cost(){ return bridgeCost(); },
  well:'Every cart for Wyvern market must cross the Kennet somewhere.', ill:'The Kennet comes down brown in February, and carries timber.', state:v => 'Taking toll since ' + v.year,
  endLabel:'Sell the bridge', end:() => { S.money += 800; return `The bridge is sold to a Newbury brewer for £800, with the house, the bar, the board of tolls and the Act.`; }};
VENT_PAPERS.bridge = { title:'An Act for Building a Bridge',
  text:() => `The Bill for building a bridge over the Kennet at Hatherley Mill has been eleven weeks in Parliament, and has paid at every door it went through: to the clerks of the Commons, and to those of the Lords; to the doorkeepers of each House; for the ingrossing, by the skin of parchment; and to a gentleman in the Speaker’s chamber, of whose services to the measure your agent can give no particular account. It has the Royal Assent upon the same afternoon as an Act for paving Shoreditch, and another for the divorce of a Mr Campbell.

The bridge is of brick, with three arches and a hump, and stands forty yards below the mill, where the ford was; and at the Hatherley end of it there is a house of one room, a bar that lifts, and old Ruddle the bargeman, who has the tolls at a shilling in the pound.

“Twopence for the horse, Mr Pocock; and the ford is stopped by Act of Parliament.”

It is stopped with a chain and two posts, the Act having laid down that no person shall carry passengers or cattle over the river for hire within a mile above the bridge, or a mile below it. The miller, whose own flour must now cross to reach the Bath road, pays; reads the board through from the top; and observes that a foot passenger is a halfpenny.

“For every Horse or other Beast drawing any Carriage, 2d. For every Horse, laden or unladen, and not drawing, 1d. For every Score of Oxen, 10d.; of Sheep, 5d. For every Foot Passenger, ½d.”

Upon the first Saturday three hundred and twelve persons cross on foot to Wyvern market; and Ruddle, who cannot write, keeps the tale of them in peas, which he drops into a jug.` };
VENT_AFTER.bridge = {ev:'ventBridge', wait:3};
ev({ id:'ventBridge', follow:true, at:'mill', who:() => null, cond:() => live('bridge'), title:'Sunday Toll',
  text:() => `Upon Sunday forenoon you find Ruddle with his bar down, his jug in his hand, and forty persons standing before him in their best clothes.

“They say it is church, sir, and church goes free; and they are every one for Zion.”

The Act frees from toll any person going to his parish church upon a Sunday, or returning from it; and upon the subject of a meeting-house it is silent. Zion Chapel, which is of brick, with a tin chimney, was opened at Kintbury wharf at Lady Day by a Mr Bunce, a cooper; and the forty are your own cottagers, who went over to it by the ford every Sunday until the ford was chained.

${endVicar()}, crossing the other way to his own church with nothing to pay, has stopped upon the crown of the bridge to hear how it ends.`,
  choices:[
    {t:'A meeting-house is a place of worship. Lift the bar.', note:MINUS + '£8 a year', go:() => { fl('bridgeFree'); add({goodwill:3, standing:-1});
      return `Ruddle lifts the bar, and counts the forty over without his jug. ${endVicar()} walks on to his church, and says nothing; but it is observed in the vestry that upon the Tuesday he paid his own halfpenny at the bridge with a sixpence, and stood for the change.`; }},
    {t:'The Act says church. A halfpenny a head.', go:() => { add({goodwill:-3, standing:1});
      return `Thirty-one of the forty pay, and Ruddle has their halfpence in the jug before the first hymn can have been given out at Zion. The other nine go down the bank below the chain, take off their shoes and stockings, and wade it; the cooper, who is one of them, carrying his Bible across upon his head.`; }},
    {t:'Let them over this once, and take your attorney’s opinion.', note:'£3', go:() => { add({money:-3, goodwill:-2});
      return `Your attorney at Wyvern is a fortnight with the Act, and three guineas; and he is of opinion that the word is church, that a court would so read it, and that a gentleman who takes toll under an Act of Parliament has no power to forgive one man what he does not forgive to all. Ruddle, having had the opinion read to him twice, puts his bar down upon the next Sunday, and takes nineteen pence.`; }}
  ]});
{ const tick = ventureTick;
  ventureTick = function(line){ tick(line); if (S.dead || S.phase === 'end' || !S.vent || !live('bridge')) return; const y = S.year, q = S.season, v = vent('bridge'); if (y <= v.year) return;
    if (q === 1) { const a = 95 - (F('bridgeFree') ? 8 : 0); line('Tolls at Hatherley bridge', a); S.yearIncome += a; }
    if (q === 0 && chance(0.1)) { line('The bridge: a pier underpinned after the flood', -110); S.notes.push('The Kennet came down in February with half a hay-rick and an elm upon it, which lay two days across the middle arch of your bridge; and the mason, who has been under it in a punt, asks a hundred and ten pounds to make the pier good.'); } };
  const m0 = marks; marks = function(){ const m = m0(), put = (k, n, t) => { if (n) { m.why[k].push((n > 0 ? '+' : MINUS) + Math.abs(n) + ' ' + t); m[k] = clamp(m[k] + n, 5, 95); } };
    put('standing', live('bridge') ? 1 : 0, 'Hatherley bridge'); put('goodwill', live('bridge') ? -2 : 0, 'The halfpenny at the bridge'); return m; }; }

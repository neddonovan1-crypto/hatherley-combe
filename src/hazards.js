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
  return P; }

/* The squire's past and character, made to tell.
   Part one hangs a further paragraph or a further answer upon papers that every squire sees, shown only to the squire it belongs to.
   Part two is new papers, each for one past or one trait. Written in the Hatherley hand (docs/voice/VOICE.md).
   Loaded after events4.js. Nothing here alters an answer that was there before. */

/* also(): one more answer to an existing paper. after(): one more paragraph at its foot, when fn() returns one.
   The paper's own text is kept for the test in atHall(), which reads the source. */
function also(id, c){ const e = byId(id); if (!e) return; e.choices.push(c); e.hen = undefined; }
function after(id, fn){ const e = byId(id); if (!e) return; const t0 = e.text;
  const t = () => { const x = fn(); return x ? t0() + '\n\n' + x : t0(); };
  t.toString = () => String(t0) + String(fn); e.text = t; e.hen = undefined; }
const pascoe = () => crewAboard() ? 'Tarbuck' : 'Pascoe';

/* ================= The post-captain ================= */

/* The Captain at the Grange. A sea officer knows the list, and knows the agents. */
after('captainTakes', () => T('captain') ? `You have read more in the letter than ${steward()} has. Roper Lyle was third lieutenant of the Formidable in the year that you were made post, and stands upon the Captains’ list two hundred names below your own; and as to Cooke and Weddell, of Craven Street, they were agents for the Dryad’s French brig in ’93, ${S.seen && S.seen.tCaptainAccount !== undefined ? 'and their account of her, upon nine sheets, is in the drawer under your hand' : 'and you are waiting for their account of her yet'}.` : '');
also('captainTakes', {t:'Write to him as one officer to another.', note:() => '+' + fmt(capOffer(1.15)) + ' a year, seven years', if:() => T('captain'),
  go:() => { const r = capOffer(1.15), f = addFarm('grange', {own:false, tenant:'Captain Lyle', rent:r, K:3 * r, flush:true, lease:{type:'term', ends:S.year + 7, years:7, level:'fair'}, since:S.year});
    fl('captainIn'); fl('capWarned'); add({standing:3, goodwill:1, money:Math.round(r / 2)});
    return f ? `You write to Bath in your own hand: that the Grange is his at ${fmt(r)}, the first half-year in advance; that you had the Dryad, and know of what Cooke and Weddell’s accounts are made; and that an officer who has six thousand pounds lying in Craven Street would do well to fetch it away in a hackney coach, and to carry it to Mr Ommanney in Bloomsbury Square.

The answer is three lines.

“Sir, I was in the Formidable when the Dryad was fitting at Plymouth, and remember her paint. I go to town on Thursday. R. Lyle.”

He comes down from London with the Spaniard’s money in the three per cents, and Mr Ommanney’s receipt in his pocket-book. Four chaises arrive at the Grange upon the Thursday following; and a ship’s bell being hung the same evening over the stable arch, and struck at every half-hour, ${crewAboard() ? 'Tarbuck, who can hear it across the park, sets the Hall clock by it' : 'you find, the wind being westerly, that you can hear it from your own dressing-room'}.` : `The house is let to somebody else before the letter is answered.`; }});
/* A Captain whose prize is in the funds is not undone by the peace. */
{ const e = byId('captainHalfPay'); if (e) { const c0 = e.cond; e.cond = () => !F('capWarned') && c0(); } }

ev({ id:'captainSafe', from:1802, to:1815, weight:60, title:'Craven Street Stops Payment',
  cond:() => peaceTime() && F('capWarned') && !F('capSafe') && !!grange(),
  text:() => `${steward()} brings up the Mercury himself, with his thumb upon a paragraph.

“Yesterday the House of Messrs Cooke and Weddell, Navy Agents, of Craven Street, stopped Payment. It is said that the Claims of above two hundred Officers are affected.”

A note from the Grange has come up with the paper.

“Hatherley Grange, Friday.

Sir, The Persephone was paid off at Chatham on the ninth, and I am put upon the list at eight shillings the day. Mrs Lyle and I have done the sum, and find that with Mr Ommanney’s dividends the rent of the Grange can be paid, and four of the six horses kept. I have this morning read the name of my late agents in the newspaper.

I was eleven years a lieutenant, and in that time had a great deal of advice from my senior officers. Yours is the first that I was ever the better for.

The half-year is enclosed. I should be glad to know in what I can serve you.

Your obliged servant, R. Lyle.”`,
  choices:[
    {t:'Ask nothing, and have him to dinner.', go:() => { fl('capSafe'); add({standing:2, goodwill:1});
      return `You answer that there is nothing; and that dinner is at four on Thursday.

He comes in the plain blue coat, with Mrs Lyle and the two eldest girls. When the cloth is drawn, and the decanters have been once round, he stands them in a line upon the mahogany, with the port leading, and shows the table how the Spaniard was taken; upon which you move the Madeira two points to windward, and he allows the correction.

Neither of you observes at what hour the ladies withdraw.`; }},
    {t:'Ask him to speak for Edmund at the Admiralty.', if:() => at('navy') && !F('edmundDead'), go:() => { fl('capSafe'); add({family:3, standing:1}); reg('edmund', 2, 'Captain Lyle spoke for him at the Admiralty');
      return `The Captain goes up by the Tuesday coach, at his own charge, and sits two mornings in the waiting-room at the Admiralty among the forty who have no ship; where, having at last been admitted to a junior Lord whom he once pulled out of the Hamoaze by the hair, he obtains a promise in writing.

Edmund writes within the quarter that he has been moved into a flagship; and that the first lieutenant, upon reading his name in the books, asked whether he was any relation of the Dryad.`; }},
    {t:'Ask for the rent he first offered, since he can find it.', note:() => '+' + fmt(Math.max(0, capOffer(1.3) - grange().rent)) + ' a year', go:() => { const f = grange(); fl('capSafe'); f.rent = Math.max(f.rent, capOffer(1.3)); add({standing:-2, goodwill:-1});
      return `The answer is one line. “Agreed. R. L.”

${steward()} alters the figure in the rent book without remark, and the half-years come to the day; but they are brought now by Mrs Lyle’s maid, in a paper, and the bell over the stable arch, which for some years has been struck at every half-hour, is from that week rung at noon only.`; }}
  ]});

also('nore', {t:'Post down to Sheerness. You have had a ship’s company of your own.', note:'£12', if:() => T('captain'), go:() => { add({money:-12, standing:1}); reg('edmund', 3, 'You came down to the Nore, and spoke for the cook');
  return `You are at Sheerness by the Tuesday night; and next morning two of the Thetis’s own people, who have learnt at the stairs what ship you had, pull you out to her, and toss their oars at the gangway without being told.

The delegates receive you in the gun-room with their hats on. You ask for the purser’s weights, which are brought; and having put his pound into one scale, and sixteen ounces of the cook’s cheese into the other, you tell them that in two-and-twenty years at sea you never knew a ship’s company wrong about its victuals, nor right about a red flag, and that Parliament will mend the first the sooner for their hauling down the second.

It comes down in June with the rest. Parker is hanged at the yardarm of the Sandwich, and eight-and-twenty follow him; but a post-captain having spoken for the cook of the Thetis before the court, he has a year in the hulks, and Edmund’s next letter is signed “Your affectionate son”.`; }});

after('trafalgar', () => !T('captain') ? '' : crewAboard() ? `Tarbuck has had it from the guard’s own mouth, and has walked the four miles home without his hat. He stands in the library door and gives you the ships by their rates, with the name of every captain among them under whom he ever pulled an oar; and having come to the Victory, he stops, and asks leave to half-mast the flag upon the leads.` : `You have the Navy List open before the ringers have settled which they mean; and by the time the one bell is tolling again, you have found in Lord Nelson’s line four captains who were midshipmen with you, and put a pencil mark against each.`);
also('trafalgar', {t:'Fire minute guns from the leads, and serve out grog to the parish.', note:'£30', if:() => T('captain'), go:() => { add({money:-30, goodwill:5, standing:2, family:-2});
  return `There are two brass swivels upon the leads, which came ashore in the Dryad’s launch; and from four o’clock until dark one or the other is fired at every minute by the church clock, you serving the first, and old Pascoe, upon a kitchen chair, the second.

On ${ground()} a puncheon of rum is mixed at three waters in the horse-trough, which has been scrubbed for the purpose; and every man in Hatherley, having given his name and been ticked upon the muster, takes his half-pint, and drinks it to the Admiral with his hat off.

Mrs Bunce counts ninety-one guns from the scullery. The rooks do not come back to the elms until Thursday.`; }});

also('edmundFuture', {t:'Send him to sea under an officer of your own making.', if:() => T('captain'), go:() => { fl('edmund','navy'); add({family:-1}); reg('edmund',3,'You sent him to sea with your own quadrant'); reg('henrietta',-2,'You sent her son to sea');
  return `You write to Captain Holloway of the Thetis, thirty-two guns, who was your second lieutenant in the Dryad, and whom you taught to work a lunar; and his answer is back from Portsmouth within the week.

“Sir, Send him. He is six years too old, and will be ordered about by children. He shall mess with the gunner, who will teach him what I learnt of you, and in fewer words. Holloway.”

You go through the boy’s chest yourself, and take out of it a silk dressing-gown, a flute, and Thomson’s Seasons; in the room of which there go a second pea-jacket, nine pounds of portable soup, and your own quadrant. ${hh(`Henrietta carries the flute up to her dressing-room, and shuts the door.`, `The flute goes to Gay Street by the carrier, Henrietta having written for it by name.`)}`; }});

also('dubreuil', {t:'Walk down to the milestone and bring him up yourself.', if:() => T('captain'), go:() => { fl('dubreuilFriend'); add({family:4}); reg('dubreuil',3,'You fetched him from the milestone yourself, as one sea officer another'); if (!F('gallDead')) reg('gall',-1); if (K() === 'free' && kittyAge() < 34) later('dubreuilAsks', 5);
  return `You are at the milestone at three, when he comes to it; and having given him your name, and the Dryad’s, you learn that his last ship but one was the Résolue, and that he knows yours, by which she was chased for two days in ’94, and lost in a fog off the Penmarks.

“You carried away a topmast, Monsieur.”

“The fore. And you were heaving your guns overboard.”

“Four only.”

He walks the two hundred yards beside you, counting them aloud, in English, for the satisfaction of the Transport Board. At the next Quarter Sessions, when ${F('gallDead') ? 'the churchwardens send in a paper' : 'Dr Gall rises'} upon the subject of spies, it is a post-captain of the King’s Navy who answers for the Lieutenant; and the bench goes on to the highways.`; }});

/* ================= The old soldier ================= */

also('ballot', {t:'Send to Thatcham for a man of your old company.', note:'£15', if:() => T('soldier'), go:() => { add({money:-15, goodwill:3, standing:2});
  return `There is living at Thatcham one Daniel Sly, a corporal of your company in the 23rd until the peace of ’83, who has since that time buried a wife, and failed as a carrier; and as he asks no more than fifteen pounds, a pair of shoes, and to sleep under canvas again, he is sworn at Wyvern upon the Friday in Will Tanner’s room.

Within the month the Colonel of the Berkshire Militia writes to enquire whether Mr ${S.sur} has any more substitutes of the same pattern; the man having been found, upon the first field day, to know the manual exercise better than the adjutant, and been made a serjeant on the ground.

Will says nothing to you about it. But on Sunday the bay mare, whose mane has not been plaited since your uncle was sheriff, is brought round to the door with it done in eleven plaits.`; }});

also('edmundFuture', {t:'Write to General Stanwix for an ensigncy without purchase.', note:'£60 for his outfit', if:() => T('soldier'), go:() => { fl('edmund','army'); add({money:-60, family:-1}); reg('edmund',3,'Your old captain found him his colours'); reg('henrietta',-2,'You sent her son to the wars');
  return `You write to Lieutenant-General Stanwix at the Horse Guards, who was your captain at Guilford, and was there shot through the hat; and you ask him whether he has the hat yet.

The answer comes under a frank.

“My dear ${S.sur}, There are four ensigncies in the 52nd to be filled without purchase, the West Indies having been busy among the subalterns, and I have sent in your boy’s name for one. Tell him to keep his feet dry and his opinions to himself. I have the hat. J. S.”

Sixty pounds go to a tailor at Reading; and within the month the Gazette has it: “52nd Foot. Edmund ${S.sur}, Gent., to be Ensign, without purchase, vice Lovell, deceased.”

${hh(`Henrietta reads as far as the last word, and goes up to her room.`, `You send the Gazette to Gay Street; and it comes back by the next post, with the last word underlined.`)}`; }});

/* ================= Favour at Court ================= */

after('royalStag', () => T('court') ? `He has put up a glass, and is looking at you through it.

“${S.sur}. ${S.sur}! I know you. You held the horse. Forty minutes! Mangel-wurzel. ${swans() ? 'Swans, what? Has anybody shown you a swan yet? What? What?' : 'You had the swans. Who has ’em now? What?'}”` : '');
also('royalStag', {t:'Report to him as Deputy Keeper of the Swans.', if:() => swans(), go:() => { fl('royalKnown'); add({standing:7}); later('royalTerrace', 4);
  return `You tell His Majesty that you have had ninety pounds of him every Christmas, and that in all that time no person has shown you a swan.

“No swan? Not one? What?” He turns about upon the gentlemen in blue. “He has had no swan! Somebody keeps ’em. Who keeps ’em? Find out. Write it down.”

An equerry writes it upon his cuff. The deer is got out of the pond with a wagon rope; the King drinks a glass of your small beer standing, and pronounces it better than Mr Whitbread’s; and a fortnight afterwards there comes by the Windsor carrier a hamper directed in a clerk’s hand, out of which, when Mudge has cut the cord, a cob swan steps, looks about him, and walks down into the horse-pond.`; }});

after('incomeTax', () => swans() ? `Upon the third page, under “Offices, Pensions and Stipends”, there is a line which the Deputy Keeper of the Swans must fill for himself: ninety pounds from the King, of which the King now desires to have nine back.` : '');

/* ================= His father was in sugar ================= */

after('abolition', () => T('trade') ? `Mrs Thorne has not asked you to sign. She has turned the roll about, so that the blank column lies under your hand; and she is looking past your shoulder at the wall, where between the barometer and the door there hangs in a black frame the Prudent Hannah, of Bristol, two hundred tons, painted for your father in 1771 with every sail set.` : '');
also('abolition', {t:'Sign it, and write beneath your name what the nine ships carried.', if:() => T('trade'), go:() => { fl('signedPetition'); add({standing:-1, goodwill:4}); reg('thorne',3,'You signed, and wrote your father’s ships beneath your name'); reg('pinch',-4,'You signed against the trade with him in the room');
  return `You sign; and beneath your name, in the room left for the next man, you write: “Son of the late Mr ${S.sur}, of the Welsh Back, Bristol, who had shares in nine ships in that trade; and who, by the ledgers now in this house, carried in them from Bonny and Old Calabar to Jamaica, between the years 1759 and 1788, three thousand one hundred and sixty Africans, of whom four hundred and twelve died upon the passage.”

Mrs Thorne reads it through with her finger. She does not thank you. She rolls the paper up from that end, so that your column goes in first, and lays the eggs back upon it one at a time.

Mr Pinch has shut the library door. On Sunday the petition is read out at the chapel, names and all; and on Monday Mr Gosling the bookseller, who has the figures from his cook, sends up to ask whether he may print them at his own charge.`; }});

after('pinchSuit', () => T('trade') ? `He knew your father. He has said so four times since the soup; adding, upon the fourth, that there was not a closer man at a bargain on the Welsh Back, and that he is glad to find the son got so comfortably upon the land.` : '');
also('pinchSuit', {t:'Bargain as your father would: the money to be Kitty’s, and more of it.', note:'Nothing to you. £5,000 settled upon Kitty', if:() => T('trade'), go:() => { fl('kitty','pinch'); add({family:-6, standing:2}); reg('kitty',-2,'You married her to Mr Pinch, and tied five thousand pounds upon her'); reg('pinch',1); later('pinchDies', Math.max(20 + Math.floor(Math.random() * 12), 50 - S.t));
  return `You tell him that your father never sold a cargo without seeing the bills first; and you send for Mr Spurling.

It takes four days. Pinch begins at three thousand to you, and ends at five thousand to Kitty, in the three per cents, to her separate use, with trustees whom he may not name; and he signs at last with the look of a man who came into Berkshire to buy an estate, and has been sold one.

Kitty is told in the drawing-room what has been done for her. She hears the figure, and the words “separate use”, without any change of countenance.

“Then I am to be bought, Papa; and the money is to be mine.”

“Yes.”

She considers this for as long as the clock takes to strike.

“It is more than Mamma had,” she says; and goes up to be measured.`; }});

also('vaneDines', {t:'Offer to discount the aunt, as your father would have done.', if:() => T('trade'), go:() => { fl('vaneDone'); add({family:3, standing:1}); reg('vane',-3,'You asked for his Colonel’s name upon the bill'); reg('kitty',1,'You showed her how the Captain’s aunt was reckoned');
  return `“My father was in trade, Captain, and taught me one thing. I will give you a hundred and sixty pounds tonight for your bill at three months for two hundred, payable at Kettering, with your Colonel’s name upon the back of it.”

He turns his glass round by the stem.

“The Colonel, sir, is not a man of business.”

“Then the aunt’s. She has only to write her name.”

It appears that the aunt does not write; that she does not see company; and, by the time the decanter has been once more round, that she has let her house at Kettering, and removed to a part of Scotland which he cannot at the moment recollect. He calls for his horse himself.

Kitty has the whole of it at breakfast, with the figures. She hears it out, and then desires to know what a bill at three months is; and you find, before the urn is cold, that she can work a discount in her head.`; }});

/* ================= Left Oxford without a degree ================= */

after('gallDies', () => T('oxford') ? `The living was to have been yours. Your uncle said so to the Provost of Oriel in the year ’69; the Provost, in consequence of a pig, said something else; and you have sat every Sunday since you came into the estate under the man who had it.` : '');
after('edmundFuture', () => T('oxford') ? `Neither Oriel nor the Provost is named. But Edmund has known about the pig since he was nine; and he has twice sat under Dr Gall while the Doctor preached upon the Gadarene swine.` : '');

/* ================= Rides straight to hounds ================= */

after('hunt', () => T('hunt') ? `You were one of the forty. Parson took her first gate flying, and the second, as you now learn, with his knees; and there is a piece of the top bar in your own stable, where the groom has it upon a nail.` : '');
also('hunt', {t:'Pay for the gates, which were yours, and carry the rest to the Master.', note:'£3 10s.', if:() => T('hunt'), go:() => { add({money:-4, standing:-1, goodwill:4}); reg('thorne',3,'You paid for the gates you broke, and made the Hunt pay for her wheat');
  return `Three pounds ten go down to Long Barrow the same afternoon, with a line to say whose horse it was; and on Thursday, at the meet, you ride up to the Master with the remainder of her bill in your glove.

“Wheat and mangolds, thirteen pounds fourteen. I have paid for my own timber.”

The Master has seen you go at the Kennet in flood, and has not until now seen you come at him. He reads the paper twice in the saddle; he sends the cap round before the hounds are thrown in; and the field, having put its half-crowns into it under your eye, goes round Long Barrow by the headland for what is left of the season.

Mrs Thorne sends up a receipt. Under the stamp she has written: “The new gates are oak.”`; }});

also('battue', {t:'Go, and ask his keeper before the guns what became of the Castle Wood litter.', note:'£20 in vails', if:() => T('hunt'), go:() => { add({money:-20, standing:3}); reg('cullerne',-1,'You asked his keeper about foxes before his guests');
  return `As a fox in a hunting country is the property of forty gentlemen, the keeper who kills one is not forgiven; and it has been said at every covert side this season that Lord Cullerne’s keepers kill them, the Castle woods having been drawn blank four times since November.

You put the question to the head keeper in the ride, before the first drive, with eleven guns standing by: what became of the litter that was bred in the Castle Wood earths in April?

The keeper looks at his lordship. His lordship looks at the sky.

“Damme, ${S.sur}, pheasants is pheasants.”

You shoot through the day, and tip as the others tip. On Saturday the Craven draws the Castle Wood for the fifth time, and finds; and it is the opinion of the huntsman, who has handled the fox, that he was turned down that morning out of a bag from Leadenhall market.`; }});

/* ================= Gout ================= */

also('battue', {t:'Go in the garden chair, and shoot sitting.', note:'£20 in vails', if:() => gouty(), go:() => { add({money:-20, standing:4, family:-2}); reg('cullerne',2,'You shot a hundred and four head from a garden chair');
  return `Two of the Castle footmen carry you down the ride in a garden chair, with the foot upon a stool; and you are set at the end of the line, next his lordship, where the birds come highest.

It is found that a gentleman who cannot turn his body must take every bird in front; and you take them so for five drives, having a loader upon each side, and firing as fast as the guns can be put into your hands.

“He shoots better sittin’,” says Lord Cullerne to the company at large. “I’ll have a chair myself.”

Your bag is entered in the game book at a hundred and four, under a note in his lordship’s hand: “From a chair.” The foot keeps you in bed until the Thursday week.`; }});

/* ================= An enemy at the Castle ================= */

after('battue', () => T('enemy') ? `The card is filled up by the Castle steward; but under the engraved lines there is added, in his lordship’s own hand: “Mr ${S.sur} will oblige me by standing well to the left of the dogs.”` : '');
after('election96', () => T('enemy') ? `The groom has a second message, which he was to give by word of mouth, and which he gives to the scraper: that his lordship wished it mentioned that the buck was killed with one ball, by a gentleman who looked first to see what was standing next it.` : '');

/* ================= Three bottles a day ================= */

also('smugglers', {t:'Ask Mudge whether the gentlemen can run port.', note:'11 guineas', if:() => T('bottle'), go:() => { fl('brandy'); add({money:-12, family:3, standing:1});
  return `Mudge does not know. He will ask.

The answer comes back upon the fourth night, chalked on the cart-shed door: a figure, and under the figure a cross. You leave eleven guineas beneath the straw. And upon the next dark of the moon there lie in the same place, where the half-ankers were, two quarter-casks of an Oporto wine that has paid no duty to any king whatever, each with your initials burnt into the head, and one of the letters backward.

Mrs Bunce is told that it came from Reading. She has the casks got down to the cellar herself, and puts the key in her pocket; and the Chairman of Quarter Sessions, dining with you in the autumn, asks what you gave for it, and writes down the answer.`; }});

also('vaneDines', {t:'Send for three more bottles, and hear about the aunt.', if:() => T('bottle'), go:() => { fl('vaneDone'); add({family:2}); reg('vane',-2,'You drank the truth about his aunt out of him'); reg('kitty',1);
  return `Three bottles of the ’75 come up, and you take them glass for glass.

At the first the aunt has four thousand pounds in the funds. At the second she has a house at Kettering and no will. Towards the end of the third it appears, from a statement which the Captain addresses chiefly to the snuffers, that she is his mother’s cousin, that she keeps a shop for tapes and buttons, and that she turned him out of it at Lady Day for a matter of nine pounds.

He is put to bed in the blue room with his boots on. You, who have done no more than your day’s work, snuff the candles yourself, lock up the wine, and tell Kitty the whole at breakfast, with the nine pounds.`; }});

/* ================= A Whig among Tories ================= */

after('powder', () => T('whig') ? `Mr Fox has left off powder, and the Duke of Bedford with him; and it is understood at Wyvern, where your opinions are known, that a gentleman who shows his own hair this summer has voted against Mr Pitt.` : '');
also('powder', {t:'Crop every head, and tell the collector it is done for Mr Fox.', if:() => T('whig'), go:() => { add({standing:-4, goodwill:4, family:-3}); reg('henrietta',-2,'You cropped her footmen for Mr Fox'); reg('edmund',1); reg('cullerne',-2,'Your name stood alone under “Declined” upon the church door'); reg('hartopp',2);
  return `The barber does you first, in the hall, with the door open; and the collector’s man, who has come for eight guineas, is given instead a message for Mr Pitt, which he writes down, reads over to you, and asks you to sign.

By Sunday the church door has two lists pasted upon it. The first is of those who have paid for powder. The second, which is in the collector’s hand, is headed “Declined”, and has under that head a single name.

Hartopp rides over with his hat off, to show you that he has had his own done. At the Tamworths’ your health is not drunk; at the Bell it is, standing.`; }});

also('fenn', {t:'Grant the licence. Let him have your barn, and take the chair.', if:() => T('whig'), go:() => { fl('fennBarn'); add({goodwill:7, standing:-5}); reg('cullerne',-2,'You licensed Fenn’s meeting in your own barn'); reg('gall',-2,'Preached Korah, Dathan and Abiram at you'); reg('pryor',2,'Moved that the Squire be thanked for the barn'); reg('hartopp',1);
  return `As a magistrate you may license a meeting of any number; and you write the licence yourself, for the great barn, upon Friday at seven.

A hundred and thirty come, from as far as Inkpen. Fenn reads the Rights of Man from a wagon, stopping at the long words; and you sit below him upon a corn bin, with the Act in your pocket, and put the question when he has done. It is moved by a carter, and carried, that the people of England ought to be represented in Parliament; and it is moved by Jem Pryor, and carried also, that the Squire be thanked for the barn.

${F('crabbeGone') ? 'Lark' : 'Crabbe'} has counted them twice. On Monday there is a letter from the Lord Lieutenant, in his own hand, desiring to know by what description of magistrate the county is served at Hatherley; and on the Sunday following Dr Gall preaches upon Korah, Dathan and Abiram, with his face towards the Hall pew.`; }});

/* ================= A head for figures ================= */

after('crabbeSums', () => T('figures') ? `You have it nearer than three hundred. Having added every page downwards, and then upwards, you make it three hundred and twelve pounds nine shillings; and you have set against each of the forty-one entries the day of the month, and the tenant’s name.` : '');
also('crabbeSums', {t:'Hand him the key: forty-one entries, and the whole sum at Lady Day.', note:'+£312', if:() => T('figures'), go:() => { fl('crabbeWatched'); add({money:312}); reg('crabbe',-3,'Made to refund three hundred and twelve pounds, nine shillings');
  return `You turn your abstract about upon the table, so that he may read it.

He reads it standing. He reads it a second time with his spectacles pushed up; and at the nineteenth entry, which is for a gate at Church Farm that was hung in his own orchard, he sits down without being asked.

“It is very clear, sir.”

“To those who have the key, Crabbe.”

The three hundred and twelve pounds are paid at Lady Day, in a draft upon his brother-in-law at Newbury; and the nine shillings come up the same morning by the kitchen, in silver, wrapped in a leaf of the ledger.`; }});

/* ================= Bred to the land ================= */

also('merino', {t:'Go to Kew yourself, and handle the rams before you bid.', note:'34 guineas', if:() => T('bred'), go:() => { fl('merinoRam'); add({money:-36, standing:2}); reg('hartopp',1,'You found the foot-rot in the forty-guinea ram');
  return `You are at Kew by seven, before the company; and the King’s shepherd, having watched you turn up the first ram and look into his feet, lets you into the pens.

The ram that made forty-two guineas on Thursday has a brother, of which great things are expected; and he has also, as you find with your thumb, the foot-rot in the near hind. In the last pen there stands a plain two-shear, narrow in the horn, and with wool down to his knees, at whom nobody has yet looked, there being a spot of black upon his ear.

You have him for thirty-four guineas, under the elm. Hartopp, who has given sixty for the brother, rides home beside the cart, explaining it; and at the next shearing your half-bred fleeces weigh a pound apiece above his.`; }});

also('hartoppShearing', {t:'Go, and shear a sheep against his shepherd.', if:() => T('bred'), go:() => { fl('hartoppFriend'); add({standing:2, goodwill:5}); reg('hartopp',2,'You out-sheared his shepherd before Mr Young');
  return `When Hartopp has done with dung, there is a match made at the hurdles: his head shepherd, who holds the silver shears of the Bath Society, against any gentleman present; and Mr Young, hearing that you were bred to it, puts down your name without asking.

You take off your coat. The shepherd has his ewe out of the wool in nine minutes, and stands back; you are eleven, but your fleece, when the two are thrown upon the board, lies whole as a blanket, and his is in three pieces.

Mr Young writes for some time; and the Russian count, through his interpreter, desires to be informed whether all the English nobility can do this. Two hundred farmers saw it done; and for a year afterwards there is not a market ordinary between Reading and Hungerford at which you are let pay for your own dinner.`; }});

/* ================= Known in the parish from a boy ================= */

also('flour', {t:'Take the measure from Sukey Pryor, and serve the flour yourself.', if:() => T('beloved'), go:() => { add({money:-1, goodwill:7, standing:-1}); reg('pryor',1,'You served out the flour yourself at the old price');
  return `“Give me that, Sukey.”

She gives it you; for she saw you fall into the mill pond, and was one of those who laughed. You get up into the cart, and serve out Pocock’s flour by the peck, at the price of last Michaelmas; every woman pays the child, the child pays the hat, and you call each buyer by her name, and two of them by the names they had before they married.

When the last sack is shaken out you count the hat upon the tailboard, and find it eleven shillings short of what the miller asked at nine o’clock; which eleven shillings you make up to him out of your own pocket, in the face of the market, and tell him that tomorrow’s price is his own affair.

Pocock puts his hat on; and Sukey Pryor, going by with her flour upon her head, tells you that you never could strike a measure level, and that she has an ounce over.`; }});
after('poacher', () => T('beloved') ? `It was Jem Pryor who showed you how to set a wire, in this same copse, the summer that you were eleven; and he is looking at the hare, and has not once looked at you.` : '');

/* ================= A persuasive tongue ================= */

also('speen', {t:'Rise, and talk the table into both: the Doctor’s scale, and a shilling on the wage.', if:() => T('silver'), go:() => { fl('speen'); add({goodwill:7, standing:2}); reg('gall',1,'You seconded his bread scale at Speen'); reg('hartopp',-1,'Signed for a shilling more before he had considered it'); reg('pryor',1);
  return `You rise with the Doctor’s paper in your hand, and say that you second it; and you go on speaking for a quarter of an hour by the Pelican clock.

You give them the Doctor’s table, and then the farmer’s side of it: that a parish which makes a man up to nine shillings this year will be asked to make him up to ten the next; that the master who pays a shilling more at his own gate pays it once, and the master who pays it through the overseer pays a collector’s poundage on top; and that there is not a gentleman at the table who would not rather be robbed by his labourers than by his vestry. They laugh at the last, Hartopp among them, before he has considered it.

The scale is carried. And under it, upon the same half-sheet, eleven magistrates put their names to a recommendation that the farmers of the county add a shilling to the week’s wage; which Hartopp signs the tenth, and reads over upon the stairs.`; }});

/* ================= A stranger to the country ================= */

after('hartoppShearing', () => T('stranger') ? `Mr Young, who has been told that there is a gentleman present from Marylebone, moves his hurdle next to yours; and he desires to know, for the Annals of Agriculture, what you gave an acre, and whether you had at that time ever seen one.` : '');
after('enclosure', () => T('stranger') ? `His lordship lays his whole hand upon the plan. “Yours, ${S.sur}. The soil of it. Every yard.”

It is the first that you have heard of it. The only common you knew as a boy was at Paddington, and belonged to the Bishop of London.` : '');

/* ================= His marriage ================= */

after('paris', () => T('taste') ? `There is a list with it, in Henrietta’s hand, headed “Leroy, Rue de Richelieu”, which has nine articles upon it, and no prices.` : '');
also('paris', {t:'Send her, with a letter of credit upon Perregaux.', note:'£420', if:() => T('taste'), go:() => { fl('paris'); add({money:-420, family:7}); reg('henrietta',2,'You sent her to Paris with a letter of credit');
  return `Your sister Selina goes with her; and Mr Tidmarsh, who has never before been asked for such a thing, writes out a letter of credit upon Perregaux, the banker, in the Rue du Mont-Blanc, for two hundred pounds over the journey.

They are back in seven weeks, with eleven trunks to the four they took. There is a gown of the kind worn by Madame Récamier, which cannot be sat down in; a hat upon which Leroy was engaged for nine days; and for you, at the bottom of the last trunk, a snuff-box with the First Consul upon the lid, which Henrietta thought you might keep in a drawer.

The letter of credit comes home at Michaelmas, in Mr Tidmarsh’s pass-book, upon a single line; and the sum upon that line is two hundred pounds exactly.`; }});

after('ballot', () => T('brother') ? `The officer sent over by the regiment to receive the nine is Captain Frederick Venn, your wife’s brother; who, having heard the seventh name read out, looks across the vestry at you, and then at his boots, he being forty pounds in your books since last spring.` : '');
also('ballot', {t:'Call in Frederick’s forty pounds: he shall find the substitute.', if:() => T('brother'), go:() => { add({goodwill:3, family:1});
  return `You take Frederick by the sleeve into the vestry porch, and remind him of a sum.

He has not got forty pounds. He has, however, a recruiting serjeant, a drum, and the acquaintance of every idle man between Wyvern and Reading; and by Friday there is produced at the George one Ezekiel Marlow, of no parish that he can name, who is willing to serve five years in the room of William Tanner for a new hat and what is owing at the Bell.

Frederick writes you a receipt for forty pounds, though you have not asked for one, and dines with you upon the strength of it. In the spring he writes again, from Colchester; and the sum, which is upon the second sheet, is forty-five.`; }});

after('gallDies', () => T('dean') ? `A fourth comes by express from the Deanery at Wells; in which the Dean, having observed that he never interferes, recommends his godson, Mr Prew, of Brasenose, who has a slight impediment, and is not likely to be heard beyond the third pew.` : '');
also('gallDies', {t:'Present the Dean’s godson, Mr Prew.', if:() => T('dean'), go:() => { fl('gallDead'); fl('prew'); add({standing:2, goodwill:2, family:3}); reg('henrietta',1,'You gave her uncle’s godson the living'); reg('oakes',-1,'Passed over for the Dean’s godson, and given twenty pounds more'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
  return `Mr Prew reads himself in upon the first Sunday in Advent. He is heard, as the Dean foretold, to the third pew; and the parish behind the third pew, having listened for a month and caught nothing, makes up its mind that he is a learned man.

He keeps no horse, and asks for no tithe that Dr Gall did not ask. He gives Oakes sixty pounds in the room of forty, never having been told what a curate is paid; and he is discovered, upon the first of the month, to be taking the cottage children through their letters in the vestry, with a slate.

The Dean writes to Henrietta, and to nobody else, that the Chapter will not forget it.`; }});

after('incomeTax', () => T('dean') && !F('gallDead') ? `Dr Gall, who sits first of the three, has sent a line with the form: that a nephew of the Dean of Wells need be at no pains with the second page, which the commissioners will fill for him.` : '');
also('incomeTax', {t:'Take Dr Gall’s hint, and leave the second page to him.', note:'£31 saved', if:() => T('dean') && !F('gallDead'), go:() => { add({money:31}); reg('gall',1,'Filled the second page of your income return for you');
  return `You fill the first page, sign the last, and send the form down to the vicarage with the second page blank.

It comes back within the week, assessed. The Doctor has entered your rents at what they were in your uncle’s time; he has found deductions for repairs, for the land tax, and for “the support of an ecclesiastical connexion”; and Mr Hartopp and Mr Spurling have signed below him without, as it appears from the ink, turning back to see what they signed.

You pay thirty-one pounds less than your neighbours pay. The Dean, who comes in August, is given the south bedroom; and Dr Gall dines four times in the three weeks.`; }});

after('powder', () => T('mother') ? `Mrs Venn, who breakfasts in the yellow room, has sent down word by her maid that she has worn powder under two kings, and will wear it under a third if she is spared.` : '');
after('oakes', () => T('mother') ? `The door has not been shut. Mrs Venn is in the passage with her hand upon it; and she desires to be told, by anybody present, what forty pounds a year comes to by the week.` : '');

/* ================= New papers, one past or one trait apiece ================= */

/* The post-captain: the prize agents render their account. Two-eighths to the captain; two among the people. */
ev({ id:'tCaptainAccount', from:1796, to:1804, weight:5, cond:() => T('captain'), title:'The Dryad’s Last Account',
  text:() => `There is a packet from Cooke and Weddell, of Craven Street, the postage of which is two shillings and fourpence; and it contains, upon nine sheets, their final account as agents for the French brig Deux Amis, taken by the Dryad off Ushant in the year ’93.

The brig and her indigo were condemned at four thousand one hundred pounds. From this the agents have taken their five per cent, the Proctor’s bill, the Marshal’s bill, wharfage, lighterage, a survey, a second survey, and “sundries, as per voucher”, of which there is no voucher; and what is left to divide among the ship’s company is nine hundred and forty.

Your own two-eighths come to two hundred and thirty-five pounds, for which a draft is enclosed. A foremast hand’s share is one pound three shillings and sixpence.

${crewAboard() ? 'Tarbuck has brought the packet up, and has not gone down again. He stood upon the Deux Amis’s deck with a cutlass in his hand, and he can count.' : 'Old Pascoe, who cooked the Dryad’s dinner that day within sound of the guns, has had the news of the packet from the post-boy; and he is in the passage, upon his wooden leg.'}`,
  choices:[
    {t:'Bank the draft. It is the custom of the service.', note:'+£235', go:() => { add({money:235}); if (crewAboard()) add({goodwill:-2});
      return `You send the draft to Mr Tidmarsh; and ${crewAboard() ? 'Tarbuck goes below' : 'Pascoe goes back to his copper'}.

${crewAboard() ? 'On Saturday the Dryads’ shares are paid at the Hall door by a clerk come down from Craven Street, who has brought the silver in a bag, and a list. Each man makes his mark, and has his one pound three and sixpence; and the gunner, having got his, asks the clerk very civilly what a second survey is, and upon whom it was performed.' : 'His own one pound three and sixpence comes down from Craven Street in a letter, for which he pays sevenpence at the door; and he desires the kitchen-maid, who reads it to him, to go over once more the part about the second survey, and to say upon whom she supposes it was performed.'}

There is lobscouse that night, and no singing.`; }},
    {t:'Divide your two-eighths among the people.', note:'£235 forgone', go:() => { add({goodwill:4, standing:2, family:-2}); reg('henrietta',-1,'You gave two hundred and thirty-five pounds of prize money to the foremast hands');
      return `You endorse the draft to the ship’s company, and send it back to Craven Street with a list of two hundred and four names, in the order of the muster book, which you find that you can still write out from memory.

It makes, with his own, two pounds six shillings a man. The letters come in through the winter, from Portsmouth, from the Nore, from a public house at Wapping, and one from the Marshalsea: some in a fair hand, and the most part by a mark with a witness. ${crewAboard() ? 'Tarbuck reads them out in the servants’ hall on Sundays, after the Articles of War.' : 'Pascoe has them read to him by the kitchen-maid, and keeps them in the leg of a sea-boot.'}

Henrietta has done the sum upon the back of a milliner’s bill, and has left the bill where you will see it.`; }},
    {t:'Dispute the account in the Court of Admiralty.', note:'£60 to the proctors. The issue is not sure', if:() => S.money >= 60, go:() => { const won = chance(0.5);
      if (won) { add({money:102, goodwill:3, standing:2});
        return `You put the nine sheets into the hands of a proctor in Doctors’ Commons, with sixty pounds; and for eleven months you hear nothing from him but what he charges for saying so.

The Judge of the Admiralty, when at last he has the account before him, asks Mr Weddell to describe a sundry. Mr Weddell is unable. The second survey is struck out, the wharfage halved, and the agents are directed to pay over four hundred and ten pounds more, with costs.

Your part of it is a hundred and two pounds ten. The foremast hand has ten shillings; and from that term there is not a prize agent in London who does not send in his vouchers to a Dryad without being asked.`; }
      add({money:-60, standing:-1});
      return `You put the nine sheets into the hands of a proctor in Doctors’ Commons, with sixty pounds; and for eleven months you hear nothing from him but what he charges for saying so.

The Judge of the Admiralty finds that the vouchers, though they cannot be produced, are sufficiently sworn to; and that an agent’s sundries are a matter between himself and his conscience. Mr Weddell bows to the court.

${pascoe()}, to whom you read the judgment, asks whether a conscience can be flogged; and being told that it cannot, says that he had supposed as much.`; }}
  ]});

/* The old soldier: a man who was at Guilford hears the story. */
ev({ id:'tSoldierStory', from:1797, to:1809, weight:5, cond:() => T('soldier'), title:'A Gentleman Who Was at Guilford',
  text:() => `The Tamworths have a guest for the shooting: a Major Tolliver, of the half-pay, lately come home from Nova Scotia with a brown face and one eye. He is put next you at dinner; and when the cloth is drawn, Colonel Tamworth, who has heard your story eleven times, and likes it, calls down the table for Guilford.

“Guilford Court House?” says the Major. “In ’81? I was there, sir. I had a company of the 33rd, upon the left of the Fusiliers.”

He turns his whole chair towards you, and the one eye is very bright.

The story, as it is told at the Tamworths’ table, has in it a wood, a rail fence, the colours, a ball through the leg, and, since about the year ’90, a party of Cherokees. The table is waiting; and Mrs Tamworth has sent the servants out, in order that they may listen at the door.`,
  choices:[
    {t:'Tell it as it was, without the Indians.', go:() => { add({standing:4, family:1});
      return `You tell it as it was. There was a wood, in which nobody could see forty yards; there was a rail fence, with the North Carolina militia behind it, who fired once and ran; and there was the colour, which weighed more at every step, and which you were chiefly afraid of dropping. When you come to the ball, you say that you knew nothing of it until you looked for the reason why you had sat down.

“And the Indians?” asks Mrs Tamworth.

“There were none, ma’am. I put them in at about the fourth telling, for the children.”

The Major brings his hand down flat upon the mahogany.

“That is Guilford, by God. That is the first true word I have heard of it in England.” He fills your glass himself; and he tells the table that the Fusilier colours were seen going up through the smoke that day when nothing else of the 23rd was to be seen at all, and that he has wondered ever since who the boy was.`; }},
    {t:'Tell it with the Indians, and look him in the eye.', note:'He may let it pass', go:() => { if (chance(0.5)) { add({standing:3, family:1});
        return `You give them the whole of it, Cherokees and all, and you do not take your eyes from the Major’s one.

He hears you to the end without moving. Then he asks, very gravely, whether those were the same Cherokees who afterwards carried off the paymaster of the 33rd, with the regimental chest, and nine dozen of the mess Madeira.

“The same.”

“I thought as much. I knew their chief.”

Between you the Indians last until past midnight, and by that hour have got a canoe. Colonel Tamworth sits with his mouth open; and going out to the carriages the Major takes your arm, and says in your ear that there was a rail fence, and that he remembers very little else.`; }
      add({standing:-5});
      return `You give them the whole of it, Cherokees and all.

The Major hears you to the end. He then enquires, in the voice of a man asking his way, upon which flank the Cherokees were posted; whether they were brigaded with the Guards or with the Hessians; and how it came about that Lord Cornwallis, who wrote a long despatch, forgot to mention them.

Nobody at the table looks at you. Colonel Tamworth begins to talk of partridges, and continues upon partridges until the carriages are called.

It is all over Wyvern by Thursday; and the ostler at the George, as you ride into the yard, puts his hand to his mouth and gives the war-whoop.`; }},
    {t:'Ask the Major for his own account, and listen.', go:() => { add({standing:2});
      return `“You had the left, Major, and saw more of it than I. I was looking at my feet.”

He wants no second asking. He gives them Guilford with the decanters, the Guards being the port, and the Fusiliers a dish of walnuts; he is forty minutes about it; and when he comes to the colours of the 23rd, he says that a boy carried them through the fence with a ball in his leg, and that he never learnt the boy’s name.

Colonel Tamworth tells him the name.

The Major gets upon his legs, with some difficulty, and bows to you across the walnuts; and the story is told in the county after that night upon his authority, and without the Cherokees.`; }}
  ]});

/* Favour at Court: the King writes upon farming over his shepherd's name, as he did to Mr Young. */
ev({ id:'tCourtRobinson', from:1797, to:1804, weight:5, cond:() => T('court'), title:'A Letter from Mr Ralph Robinson',
  text:() => `A parcel has come by the Windsor carrier, sewn in canvas, and with it a letter in a large plain hand.

“Windsor, Tuesday.

Sir, You will recollect a conversation upon the root called mangel-wurzel. I send two pounds of the seed, had from Germany. You will oblige me by sowing an acre of it beside an acre of your common turnip, upon the same soil and with the same dung, and by sending me in November the weight of each, tops and roots separate, with what your cattle say to them.

I am, Sir, your humble servant, Ralph Robinson.”

Hartopp, who is with you when it is opened, reads the name twice, and sits down.

“Robinson is his shepherd, sir. It is the name he puts to what he sends Mr Young for the Annals. Everybody knows it, and nobody is to say so.” He weighs the seed in his hand. “That is the King’s own fist.”`,
  choices:[
    {t:'Sow the two acres, weigh them fairly, and send the figures.', note:'£8', go:() => { add({money:-8, standing:3}); reg('hartopp',1,'Checked the tally of the King’s mangel-wurzel');
      return `The two acres are drilled in May, side by side, in the Twelve Acre; and in November you have them pulled, topped, and weighed upon the wool scales, with Hartopp to check the tally.

The turnip gives nineteen tons. The mangel-wurzel gives eleven, of which the bullocks will eat the tops, and look at the roots.

You send Mr Robinson the figures as they stand. The answer is one line, with a blot. “Sir, I am obliged to you. I had thirty ton at Windsor, and was told so by nine persons. R. R.” And at Christmas, ${swans() ? 'with your ninety pounds' : 'by the same carrier'}, there comes a second parcel of seed, and a paper of directions in the same hand, four sides long, upon what you did wrong.`; }},
    {t:'Send him the figures he would like.', note:'£8', go:() => { add({money:-8, standing:-3}); reg('hartopp',-1,'You sent the King thirty-one tons that never grew');
      return `Two acres are sown; and as the mangel-wurzel comes up thin, and the fly has the half of it, you find in November that the figures want assistance.

You send to Windsor thirty-one tons to the acre, tops and roots, and the opinion of your cattle, which is favourable.

Mr Robinson replies by return, upon three sides. He is delighted; he had been sure of it; and he has sent your letter to Mr Young, who prints it in the Annals of Agriculture for January, with your name, your parish, and a note inviting any gentleman who doubts to ride over to Hatherley and see the crop. By Lady Day eleven have ridden over, and Mr Young is one of them.`; }},
    {t:'Give the seed to Hartopp. He will know what to do with it.', go:() => { add({standing:-1}); reg('hartopp',3,'You gave him the King’s seed');
      return `Hartopp carries the seed home inside his waistcoat.

He drills it upon his best land, hoes it four times, and sits up with it, as his wife says, in the dry weather. He gets twenty-six tons to the acre; and he sends the return to Windsor in his own name, with a drawing of the largest root, and a lock of his prize ewe’s wool for the Queen.

In February Mr Hartopp of Hatherley is commanded to Windsor, and walks an hour upon the terrace with a stout gentleman in a blue coat, talking of dung. He tells you of it at every meeting for a twelvemonth; and each time he tells you, he thanks you.`; }}
  ]});

/* A stranger to the country: the Michaelmas hiring, where a man's calling is in his hat. */
ev({ id:'tStrangerMop', from:1796, to:1803, weight:6, cond:() => T('stranger') && S.season === 2, title:'The Michaelmas Hiring',
  text:() => `It is the Michaelmas hiring at Wyvern, and the home farm is in want of a carter; and ${steward()} having the audit upon his hands, you have said that you will go down and hire one yourself.

The men who are for hire stand along the churchyard wall in a row, in clean frocks, and say nothing. Each has something stuck in the band of his hat: one a twist of whipcord, the next a lock of wool, a third a wisp of cow’s hair, and a fourth a plait of straw; and the farmers walk along the row as they would along a row of beasts, look at the hats, feel an arm, and name a figure.

As it is a thing which nobody in Berkshire was ever told, nobody has thought of telling you what the hats mean.

There is a broad, slow young man at the end of the wall, with wool in his hat. Hartopp is three men off, and working towards him.`,
  choices:[
    {t:'Hire the broad one for your carter, before Hartopp can.', go:() => { add({goodwill:2, standing:-1}); reg('hartopp',-1,'You hired a shepherd from under his hand, for a carter');
      return `You put a shilling into his hand, which is the custom, and binds him for the year; and you tell him that he is carter at Hatherley Hall, at ten pounds and his board.

He looks at the shilling, and then at Hartopp, who has stopped short with his mouth open.

“I be a shepherd, sir.”

“You were standing for hire.”

“Wool, sir.” He touches his hat-band. “Whipcord’s carters.”

The shilling has passed, and he is yours until next Michaelmas. He drives the team for a fortnight, at the end of which the wagon is in the pond, with the shaft-horse sitting; and being then put to the ewes, he saves you at lambing nineteen couples that the old shepherd had given up, and Hartopp offers you thirty pounds for him across the church path.`; }},
    {t:'Ask the old woman with the gingerbread what the hats mean.', note:'2s.', go:() => { add({goodwill:3, standing:1});
      return `There is an old woman at the lych-gate with a tray of gingerbread; and you buy the whole tray for two shillings, and ask her.

She tells you: whipcord for a carter, wool for a shepherd, cow-hair for a cowman, straw for a thatcher; and a maid who wants a place carries a mop, from which the fair has its name. She tells you also which of the carters drinks, which was turned off at Inkpen for a matter of oats, and which is her grandson.

You hire the grandson. He is at the Hall on Monday with his box, and has the team out by five; and it is said along the wall, before the fair is over, that the Squire from London knew his man by the cord, and gave the right money.`; }},
    {t:() => 'Go home, and leave it to ' + steward() + ' after all.', go:() => { add({standing:-1}); if (!F('crabbeGone')) reg('crabbe',1);
      return `You walk once along the wall, with your hands behind you, and are looked at by forty men from under forty hats; and you go home.

${steward()} hires a carter on the Thursday week, at the runaway fair, where the men who were not taken at Michaelmas stand a second time; and he gets him a pound cheaper for it.

“You were seen, sir,” he says. “It is thought in the town that you were choosing by the faces.”`; }}
  ]});

/* His father was in sugar: the committee asks for the ledgers. No jokes here. */
ev({ id:'tTradeLedgers', from:1796, to:1806, weight:5, cond:() => T('trade'), title:'Ninety-One Volumes',
  text:() => `Your father’s ledgers came to Hatherley in a wagon, and are in the muniment room in three deal cases, where they have not been opened since.

A Mr Yeo, of the Bristol committee for the abolition of the slave trade, has written to ask for the sight of them. Mr Clarkson, he says, is collecting evidence to lay before Parliament: the musters of the Guinea ships, what seamen sailed and what came home, what number of slaves were shipped upon the Coast, and what number landed; and of the Bristol houses which were in that trade, the greater part have burnt their books.

“We ask nothing but figures, sir. Your father was known for keeping them.”

You have one of the cases open. The first volume that comes to hand is for the year ’64, in his small upright writing; and a page of it is headed “Prudent Hannah, 2d Voyage. Bonny to Kingston. Shipped 310. Landed 262. Do. Seamen, 38, of whom returned 21.”

In the margin, against the difference, he has written “Flux.”`,
  choices:[
    {t:'Send Mr Clarkson the three cases.', go:() => { fl('ledgersSent'); meet('thorne'); add({standing:-4, goodwill:5}); reg('thorne',2,'You sent your father’s ledgers to Mr Clarkson'); reg('cullerne',-1,'Thinks a man might keep his father’s counting-house out of the newspapers');
      return `The cases go to Bristol by the carrier, corded and sealed; and a receipt comes back for ninety-one volumes.

In the spring there is printed in London an abstract of evidence, price one shilling, in which the voyages of nine Bristol ships are set out in a table, with the shipped, the landed, and the dead; and at the foot of the table, in italic, “From the books of a principal owner, communicated by his son.”

It is read in Wyvern. It is read at the Castle, where Lord Cullerne observes that a man might at least keep his father’s counting-house out of the newspapers; and it is read at the chapel, by Mrs Thorne, aloud, with the name supplied.`; }},
    {t:'Burn them in the stable yard.', go:() => { add({standing:1, goodwill:-2, family:-2});
      return `It takes the better part of a day, there being ninety-one volumes, and vellum slow to catch.

The groom feeds the fire with a hay-fork. Towards four o’clock the year ’64 goes on, and opens in the heat at a page of names; and you see, before it blackens, that they are the names not of the cargo but of the seamen, with a cross against seventeen.

You write to Mr Yeo that the books are not in existence. He replies that he is sorry for it; and that it is the answer he has had from eleven houses.`; }},
    {t:'Copy out the figures yourself, and send them without the name.', go:() => { fl('ledgersSent'); add({goodwill:2, family:-1});
      return `You are five weeks at it, in the muniment room, with a fire.

You copy every voyage of the nine ships into a ruled book: the ship, the year, the number shipped, the number landed, the seamen out and home. The price your father got stands in the next column, and you leave it where it is. By the third week you have found that you can tell, before you turn the page, what a calm in the Bight will have done to the figures; and by the fifth, that he could.

The book goes to Mr Yeo with no name upon it. He writes that Mr Clarkson will print the table, and will ask no questions.`; }}
  ]});

/* Left Oxford without a degree: the college is building, and the pig is forgiven. */
ev({ id:'tOxfordGrace', from:1797, to:1810, weight:5, cond:() => T('oxford'), who:() => F('gallDead') ? null : 'gall', title:'The Provost Relents',
  text:() => `There is a letter from Oxford, the first that you have had from that place in thirty years, sealed with the arms of Oriel.

“Oriel College, Tuesday.

Sir, The Provost and Fellows are about to finish the new Library, the old one being no longer equal to the books. It has been represented to the Provost that a gentleman of your consideration in Berkshire, who was formerly a member of this Society, and who left it without proceeding to a degree, might be willing to see his name among the subscribers; and I am to say that, in the case of a benefactor, the College would feel no difficulty in supplicating for the degree of Master of Arts by diploma.

The late Provost’s objection is understood to have died with him. The animal is not remembered.

I have the honour to be, Sir, your obedient servant, J. Whitlock, Dean.”

A printed list is enclosed. The subscriptions run from five guineas to two hundred; and against the name of ${F('gallDead') ? 'the late Dr Gall' : 'Dr Gall'}, in ink, there is “Twenty”.`,
  choices:[
    {t:'Subscribe fifty guineas, and take the degree.', note:'50 guineas', if:() => S.money >= 53, go:() => { add({money:-53, standing:5}); if (!F('gallDead')) reg('gall',1,'You are a Master of Arts, and he must write it');
      return `Fifty guineas go to Oxford; and in June you are led up the Theatre by a bedel with a silver staff, behind a bishop and before a botanist, and are admitted Master of Arts in Latin, of which you follow the first six words.

The hood is of crimson silk. You wear it into Hatherley church upon the Sunday after, over a brown coat, and sit in the Hall pew with it turned well towards the pulpit.

${F('gallDead') ? 'The curate, who is a Cambridge man, preaches upon humility, and looks the whole time at the west door.' : 'Dr Gall preaches upon the Prodigal Son. He comes to the swine under his fourth head; and there he stops, looks at the hood, and passes to his fifth.'}`; }},
    {t:'Send five guineas, and ask the mason for a pig.', note:'5 guineas', go:() => { add({money:-5, standing:1, family:1});
      return `You send five guineas, with a line to the Dean: that you desire no degree; but that, as the College is building, you would take it kindly if the mason could find room for a small pig upon some part of the new work, not conspicuous.

Nothing more is heard from Oriel. But in the autumn a Fellow of the college, who is travelling to Bath, breaks his journey at the George in order to call; and he tells you, over your own port, that there is upon a corbel of the new staircase, where the Provost does not look up, a boar’s head of about the size of a teacup, and that the undergraduates touch it for luck upon their way to the Schools.`; }},
    {t:'Put the letter on the fire.', go:() => { add({family:1});
      return `The letter burns. The printed list, being upon stouter paper, lasts a little longer, and the last of it to go is the line with the Doctor’s twenty.

At Michaelmas a second letter comes, from the Bursar, to the same effect as the first, and with the figures left out; and at Christmas a third, from an undergraduate, who writes that he is secretary of a club of nine members which dines once a term in your honour, and who begs, in the name of the club, to be told which window.`; }}
  ]});

/* Rides straight to hounds: the farmer has kept a book. */
ev({ id:'tHuntBook', from:1796, to:1810, weight:5, cond:() => T('hunt'), title:'Mr Buckeridge’s Notebook',
  text:() => `Mr Buckeridge of Coldharbour has ridden over upon a cart-horse, and will not get down.

He has a notebook, bound in calf, with a clasp. It goes back to the year ’89, and you are in it eleven times: the day, the field, the crop, and the damage, to the nearest shilling; from “Nov. 9. Home Close, young wheat, Mr ${S.sur} and two others, 14s.” to the Kennet meadows last month, where Parson, coming out of the river, went through a fold of ewes.

He has cast it up at the foot, and it comes to nineteen pounds four shillings.

“I don’t ask for it, sir. I never have. I only thought as you might like to know what you’d had.”

He holds the book out to you over the horse’s ears, open, so that you may see that the casting is right.`,
  choices:[
    {t:'Pay him, and have the book brought up every Lady Day.', note:'£19 4s.', go:() => { add({money:-19, goodwill:4, standing:-1});
      return `You pay him at the mounting-block, nineteen pounds four; and he writes “Settled” across eleven entries with a pencil, wetting it for each.

“And you will bring me the book at Lady Day, Buckeridge, every year, cast up.”

He considers this from the saddle.

“There’s others in it, sir.”

There are, as it proves, one-and-thirty others, among them the Master, two clergymen, and Lord Cullerne’s agent, who is in it for the same gate nine times. By the next season it is known through the Craven country that Buckeridge’s book is read at Hatherley Hall; and gentlemen who used to cross Coldharbour by the wheat are observed to go round it by the lane.`; }},
    {t:'Offer him a day with the hounds upon Parson, to see how it is done.', go:() => { add({standing:1, goodwill:2}); reg('hartopp',-1,'Had Mr Buckeridge in his swedes, upon your horse');
      return `He turns out on the Thursday in his market coat, upon Parson, with the notebook buttoned inside.

They find in Hatherley Gorse, and run for forty minutes. Buckeridge is carried over the first fence against his own judgment; over the second, as he afterwards allows, with it; and at the check he is seen standing in his stirrups in the middle of Hartopp’s swedes, shouting.

He comes home at dusk with his hat stove in, and gives you back your horse.

“I’ve took out the entries, sir,” he says. “Mr Hartopp’ll be wanting to put me in his, and I had rather we was quits all round.”`; }},
    {t:'Tell him that wheat is all the better for being ridden over.', go:() => { add({goodwill:-4, standing:-2});
      return `You tell him what every hunting man knows: that young wheat is never the worse for a horse, and commonly the better; and that there are farmers in Leicestershire who would pay the hunt to cross them.

Mr Buckeridge shuts the clasp.

“Then I’ve been nineteen pound four in your debt, sir, and never knowed it.”

He turns the cart-horse round in two movements, and goes down the avenue at a walk. In November the Craven finds every gate at Coldharbour chained and stapled, from the turnpike to the brook; and the Master, having been forty minutes getting round, rides up to the Hall to ask what you said to the man.`; }}
  ]});

/* Her uncle is Dean of Wells: his three weeks in August. */
ev({ id:'tDean', from:1796, to:1810, weight:6, cond:() => T('dean') && S.season === 1, title:'The Dean Has a Sermon by Him',
  text:() => `The Dean of Wells is at Hatherley for his three weeks. He came on Monday in his own chariot, with a valet, a pointer, and four dozen of sherry in a hamper, your wine having disagreed with him in the year ’91; and on Tuesday, as upon the second day of every visit, ${F('gallDead') ? 'the curate' : 'Dr Gall'} called, in clean bands.

At breakfast upon the Wednesday the Dean puts down his egg-spoon.

“I shall preach on Sunday, ${S.sur}. I have a sermon by me upon the duties of the landed interest, which I gave before the Corporation of Bath, and which ran to an hour and ten minutes. ${F('gallDead') ? 'Your young man' : 'Gall'} will be glad of the rest.”

${F('gallDead') ? 'The curate, who has had his own sermon written since Thursday week, has said that he will be honoured.' : 'Dr Gall has not been asked. He has had his own sermon written since Thursday week; it is upon Naboth’s vineyard, and it is understood in the parish at whom it is pointed.'}

Henrietta is looking at you over the urn.`,
  choices:[
    {t:'Let the Dean preach.', go:() => { add({standing:3, goodwill:-2, family:2}); if (!F('gallDead')) reg('gall',-1,'Put out of his own pulpit for the Dean');
      return `The Dean preaches. He is an hour and twenty minutes by the vestry clock, the Corporation of Bath having heard, as he explains, a shortened form.

The landed interest is represented in the Hall pew, and hears its duties with attention. The labouring interest, in the gallery, hears them until the half-hour; after which there is a movement of hobnails upon the stair, and by the end the gallery has in it the clerk’s wife and a dog.

${F('gallDead') ? 'The curate reads the prayers very fast; and his own sermon, which was upon patience, is given the Sunday after.' : 'Dr Gall reads the prayers. His Naboth is put by until the Sunday after the Dean has gone, when it is found to have grown by two heads, and to be pointed at the Hall.'}`; }},
    {t:'Tell the Dean that the pulpit is the incumbent’s, and that you never interfere.', go:() => { add({family:-2, goodwill:1}); reg('henrietta',-1,'You refused her uncle the pulpit'); if (!F('gallDead')) reg('gall',2,'You kept the Dean out of his pulpit');
      return `“The pulpit is ${F('gallDead') ? 'the curate’s' : 'Dr Gall’s'}, Mr Dean. I never interfere.”

The Dean finishes his egg in silence. He hears ${F('gallDead') ? 'the curate' : 'Naboth’s vineyard'} from the Hall pew on Sunday, with his eyes shut and his watch open upon the ledge; and at dinner he gives it as his opinion that the preacher has a good voice, and should be advised to trust to it less.

${F('gallDead') ? 'The curate sends up a brace of trout on the Monday, with his duty.' : 'Dr Gall, to whom the breakfast has been reported by way of the two kitchens, sends up a brace of trout on the Monday; and nothing has come to the Hall from the vicarage before, since the tithe audit.'}

Henrietta’s uncle leaves upon the Thursday, a week before his time, and takes the remainder of the sherry.`; }},
    {t:'Propose that he preach at Wyvern, where there is a larger church.', go:() => { add({standing:3, family:1}); if (!F('gallDead')) reg('gall',1);
      return `You say that Hatherley church holds two hundred, and that it would be a pity; and you write the same morning to the Rector of Wyvern, who has a nave for nine hundred, a new organ, and a Dean of his own acquaintance to oblige.

The Dean preaches at Wyvern to the Corporation, the Militia, and Lord Cullerne, who sleeps upright. The Mercury gives him eleven lines, with “eloquent” in the second.

At Hatherley the sermon is preached as it was written, to the usual congregation, less the Hall pew, which has gone to Wyvern in the chariot; and Mudge, who sits directly beneath that pew, and upon whom the preacher’s eye is obliged to rest for want of any other object, goes home persuaded that he has been denounced.`; }}
  ]});

/* Her mother lives at the Hall: on Sundays she carves. */
ev({ id:'tMother', from:1796, to:1806, weight:5, cond:() => T('mother'), who:() => 'henrietta', title:'Who Carves on Sunday',
  text:() => `Mrs Venn has had the yellow room since Edmund’s christening; and upon every Sunday of the years between she has carved, standing, at the head of your table, with your uncle’s knife.

This Sunday there is a sirloin. She has helped the curate to the outside cut, and her daughter to the undercut; and having come to you the last, she lays upon your plate a piece of the size of a visiting card, and looks at it.

“Mr ${S.sur} was always a small eater,” she tells the curate. “His people were.”

Henrietta is examining the salt. The footmen at the sideboard have fixed their eyes upon the cornice; and the knife, which is in Mrs Venn’s right hand, is pointed at the ceiling.`,
  choices:[
    {t:'Take the knife from her, and carve at your own table.', go:() => { add({family:3, standing:1}); reg('henrietta',1,'You took the carving knife from her mother');
      return `You get up, go round the table, and hold out your hand for the knife.

She gives it up by the blade.

You have not carved a sirloin since you were married, and it is a thing that is lost by disuse. The first slice comes away in the shape of a wedge; the second brings the gravy over the cloth as far as the curate; and Mrs Venn, who has sat down in your chair, the better to observe, asks that somebody will be so good as to help her to a little of the dish, the meat being out of reach.

It is your table again from that day. Mrs Venn dines on Sundays in the yellow room, upon a tray, and is understood to be writing to her son.`; }},
    {t:'Send your plate up again by the footman, and say nothing.', go:() => { add({family:5}); reg('henrietta',1,'She told her mother you were quite well');
      return `You hand your plate to the footman, and nod towards the head of the table.

It is carried up, and comes back with a second piece upon it, of the same size as the first, laid exactly beside it. You send it again. By the fourth journey the curate has left off eating to watch; by the sixth there is upon your plate a row of visiting cards from rim to rim, and Mrs Venn is breathing through her nose.

At the seventh she lays down the knife.

“Henrietta, your husband is not well.”

“He is quite well, Mamma,” says Henrietta; and in twenty years she has not said so much.`; }},
    {t:'Eat what you are given.', go:() => { add({family:-3, standing:-1});
      return `You eat it, which takes three mouthfuls, and you ask the curate about his bees.

Mrs Venn carves for another year of Sundays. In that time she moves the hour of dinner to three, Mrs Bunce having been found to agree with her; she has the pointer put out of the dining-room; and she gives your uncle’s chair, which creaked, to the sexton.

You are found in the pantry of a Sunday night, as a rule, with the cold sirloin and the bread-knife; and it is Mrs Bunce who leaves out the mustard.`; }}
  ]});

/* Three bottles a day: the bin runs down. F('abstemious') stops the wine merchant's line in the account. */
ev({ id:'tBottle', from:1797, to:1806, weight:5, cond:() => T('bottle'), who:() => null, title:'Nine Dozen of the ’75',
  text:() => `The cellar-book has come up with the breakfast, which it never does; and somebody has laid a spill in it for a marker.

Your uncle laid down forty dozen of the port of ’75. The book, which is in three hands, shows that he drank eleven dozen of it in twenty years; and that there have been drunk since he died, in a single hand, and that your own, twenty dozen more. There remain in the bin, by a count taken yesterday and initialled, one hundred and eight bottles.

Under the count is pinned a letter from Mr Dolby, wine-merchant, of Reading. He can offer nothing of ’75, there being none in the kingdom out of private cellars; but he has a sound Oporto wine of ’90 at forty-two shillings the dozen, and begs to observe that Lord Cullerne’s butler has asked the refusal of whatever Hatherley may wish to part with, at four guineas.

At three bottles a day, it is six-and-thirty days.`,
  choices:[
    {t:'Sell Lord Cullerne the nine dozen, and drink Dolby’s.', note:'+36 guineas', go:() => { add({money:38, standing:-1}); reg('cullerne',1,'Has the last nine dozen of your uncle’s ’75');
      return `The nine dozen go over to the Castle in the spring cart, bedded in bran, at four guineas; and Mr Dolby’s ’90 comes into the bin in their room.

It is a sound wine. You say so upon the first night, and upon the second; and upon the third you hold the glass to the candle for some time, and say nothing whatever.

In November you dine at the Castle. The port comes round after the cheese; and Lord Cullerne, who watches you take the first glass of it, desires to know whether you ever tasted anything like it.`; }},
    {t:'Keep the ’75 for Sundays, and come down to one bottle on the other six.', go:() => { fl('abstemious'); add({family:6}); reg('henrietta',1,'You came down to a bottle a day');
      return `You draw a line in the cellar-book, and write under it: “’75, Sundays only. Other days, one bottle of Dolby.”

The first week is long. Upon the Tuesday you are in the cellar at eleven at night with a candle, looking at the bin through the grating, Mrs Bunce having the key; and upon the Thursday you read a whole number of the Annals of Agriculture, and can afterwards say what was in it.

By the quarter’s end you have learnt the names of two of the housemaids. Henrietta, who has for some years gone up at nine, is found to be still in the drawing-room at ten; and the bin, at one bottle a week, stands good for two years.`; }},
    {t:'Order ten dozen of Dolby’s, and say nothing to anybody.', note:'£21', go:() => { add({money:-21, family:-2});
      return `Ten dozen of the ’90 come from Reading under a tilt, and are got down by candle-light.

You go on as before, and the ’75 goes on with you. The last bottle of it is drawn upon a wet Thursday in the sixth week, with nobody by; you drink it to your uncle, standing, and you find when you have done that you cannot recollect whether it was better than the others.

Mr Dolby’s account is rendered at Christmas. It is for ten dozen in the spring, ten at Midsummer, and twelve at Michaelmas; and against the last he has written, in a clerkly hand, “Customer’s health enquired after.”`; }}
  ]});

/* ================= Batch two: more places where a past, a marriage or a fortune tells ================= */

/* before(): a paragraph at the head of a paper, for matter that must be known before the first line. */
function before(id, fn){ const e = byId(id); if (!e) return; const t0 = e.text;
  const t = () => { const x = fn(); return x ? x + '\n\n' + t0() : t0(); };
  t.toString = () => String(t0) + String(fn); e.text = t; e.hen = undefined; }
const coldT = () => (farm('coldharbour') || {tenant:'Mr Buckeridge'}).tenant;

after('defence', () => T('soldier') ? `You have made such a return before. In the year ’81 it was Lord Cornwallis who desired to be informed what your company had of shoes; and the answer, which you wrote upon a drum-head in North Carolina, was eleven pairs among forty men.` : '');
after('clarke', () => T('soldier') ? `Your own ensigncy was bought in the year ’78 at Mr Cox’s, in Craig’s Court, for four hundred pounds; which were counted upon a mahogany counter at noon, with the street door open, and a stamped receipt given for them.` : '');

also('jubilee', {t:'Carry the parish’s address to Windsor in your own hand.', note:'£25', if:() => T('court'), go:() => { add({money:-25, standing:5, goodwill:3});
  return `The address is engrossed by the schoolmaster upon a skin of parchment, and signed by ninety-four of the parish, of whom sixty make their mark; and you are upon the Terrace with it at Windsor on the Sunday evening, when the band plays, and the King walks between two of the Princesses with a stick.

An equerry gives your name. His Majesty stops, and turns his face a little to one side of where you stand.

“${S.sur}? The horse! You held the horse. What do they grow now? Wurzel? Do they grow it, what?”

You tell him that there is not a farm upon the Kennet without its acre. He has the address put into his own hand, and feels for the seal with his thumb; and he carries it himself the whole length of the Terrace, though the Princess Augusta twice offers to take it from him.`; }});

after('oakes', () => T('oxford') ? `Of the two men in the room, it is the one with forty pounds a year who is a Master of Arts; and Mr Oakes, though he has had your history from Dr Gall at every tithe dinner, has never in your hearing said the word Oriel.` : '');

after('vaneBall', () => T('lovematch') ? `Henrietta’s own mother, at the Newbury assembly in the year ’73, did not lay down her fan until the fourth dance; and you observe that Henrietta, to whom the same recollection has come at the same moment, has taken hers up again.` : T('brother') ? `Captain Vane is known in the family already. Frederick, writing in the spring from Northampton, called him the best fellow in the service; and it was to settle with the best fellow in the service that eleven of the forty pounds were wanted.` : '');

also('paris', {t:'Go with her yourself.', note:'£300', if:() => T('lovematch') && !F('henriettaAway'), go:() => { fl('paris'); add({money:-300, family:8}); reg('henrietta',2,'You took her to Paris yourself, and danced with her at Tivoli');
  return `Selina is told that she is not wanted; and you cross from Dover with Henrietta in the packet, eleven hours, in a gale, neither of you being well enough to take any notice of the other.

You are five weeks at an hotel in the Rue de la Loi. You see the First Consul review his Guard in the Carrousel, upon a white horse that is too large for him; you see the Apollo and the Laocoön, which he has had brought from Rome in wagons; and at Frascati’s, where the women wear what would not at Newbury be thought sufficient for a night-gown, Henrietta desires you to look at the ices.

On the last evening there is dancing at Tivoli, under coloured lamps. She stands up with you four times; and a Frenchwoman behind you is heard to ask her neighbour whether that is the custom in England.`; }});

after('windows', () => T('portion') ? `Four of the eleven are garret windows, in the roof that was slated in the year ’75; and Henrietta, who has been round the house after him without a pencil, is able to say from memory what each of the four cost her.` : '');
after('pinchSuit', () => T('portion') ? `Henrietta has not left the drawing-room. But she has had the figure through the open door; and you hear her tell Kitty, without any lowering of her voice, that her own father began at eight.` : '');

before('henPorch', () => T('lawsuit') ? `As no Tamworth has spoken to a ${S.sur} within sight of the pew since the year ’61, when it went to law, you are half-way down the aisle before you understand that the lady behind you means to break the rule.` : '');

after('royalRegency', () => T('connexions') && !F('princeLoan') && !F('kingsMan') ? `The card for Hatherley, when you turn it over, has a note in pencil upon the back: “Loft connexion. S.”` : '');

after('newmarket', () => T('play') ? `You are in a condition to confirm the paragraph; for you had twenty guineas upon Burgage yourself, with the landlord of the George, who has not yet sent up for them.` : '');
also('vaneDines', {t:'Send for the cards: piquet, and his two hundred upon the game.', note:'£200, if he wins', if:() => T('play'), go:() => {
  if (chance(0.45)) { fl('vaneDone'); add({family:2, standing:1}); reg('vane',-3,'You found the knave of clubs in his sleeve'); reg('kitty',-1);
    return `The cards are brought, and you play six games by two candles. He is the better player; but he is also, as you find at the third game, the thirstier, and at the sixth he discards to a point of five with the knave of clubs in his sleeve, where you are able to direct his attention to it.

He looks at the knave for some time.

“I think, sir, that I had better join my regiment.”

“I think so too, Captain.”

He is gone from the George by Thursday, with the slate unpaid; and Kitty, who is told only that he was called away, asks you a week afterwards what it is that a gentleman does with a card in his sleeve.`; }
  add({money:-200}); reg('vane',2,'Won two hundred pounds of you at piquet'); later('elope', 2);
  return `The cards are brought. You have played piquet since the year ’70, at Bath, at Brooks’s, and in the back parlour of the Pelican; and Captain Vane, who is five-and-twenty, repiques you twice in the first hour, and capots you in the second.

You write him a draft for two hundred pounds upon Tidmarsh, which he folds small. He is very civil about it, and hopes that he may give you your revenge; and he goes up to the drawing-room before you, with a better colour than he brought down.`; }});

after('chinese', () => T('taste') ? `The drawings were not sent upon chance. They are directed to Henrietta by name; and the man in Bond Street, in his covering letter, has the honour to thank her for her favour of the 3rd.` : '');

after('incomeTax', () => T('jointure') && !F('jointureOut') ? `The hundred and twenty pounds that go each year to Cheltenham may be set down upon the fourth page as a charge; and the Act allows you to keep back twelve of them from your aunt for Mr Pitt, provided that you are the person to tell her so.` : '');

after('bank', () => T('legacy') ? `Miss Venables’s twelve hundred pounds went up those steps not two years ago, in Bath notes, in your own hand; and you were given a glass of sherry in the back parlour while they were counted.` : '');
after('royalBond', () => T('debts') ? `You have received such a gentleman once already. He came to your uncle’s funeral for seven hundred pounds, and stood through the service; and he also carried his paper in his hat.` : '');
after('castleMortgage', () => T('clear') ? `It is the half of the debt which your uncle did not pay off in ’89. He grudged the other half to a banker every Lady Day until he died; and as he never in his life sent so much as a brace of partridges to the Castle, you are able to hear his opinion of sending it a half-year’s interest.` : '');
after('canal', () => T('coldharbour') && farm('coldharbour') ? `The line upon the engraving crosses the turnpike a furlong below Coldharbour; and ${coldT()}, who has had the prospectus a week, has already been to ask what a wharf would let for.` : '');

/* ---- A wife with a taste for town ---- */
ev({ id:'tTaste', from:1799, to:1807, weight:5, cond:() => T('taste') && S.season === 3, who:() => 'henrietta', title:'Madame Lanchester’s Account',
  text:() => `The bills come in at Christmas, under cover to Henrietta; but this year the direction of one has been written by a new girl in the shop, and it is brought to you upon the same salver as the newspaper.

“Mme LANCHESTER, Milliner and Dress-Maker, No. 17, New Bond Street. Mrs ${S.sur}, of Hatherley, Dr. To a Robe of white Crape over Satin, trimmed with Bugles, 14l. 14s.; to a Pelisse of Kerseymere, lined with Sarsnet, 9l. 9s.; to a Turban à la Mameluke, 3l. 13s. 6d.; to altering a Spencer, 12s.; to Account rendered, Christmas last, 61l. In all, 89l. 8s. 6d. An early Settlement will oblige.”

Henrietta comes down to breakfast in the pelisse.`,
  choices:[
    {t:'Pay it, and lay the receipt by her plate.', note:'£89', go:() => { add({money:-89, family:4}); reg('henrietta',1,'You paid Madame Lanchester, and asked no questions');
      return `A draft for eighty-nine pounds eight and sixpence goes up to New Bond Street by the night mail; and on the Thursday the account comes down again, with “Recd. with thanks, E. Lanchester” written across the stamp, and is laid under Henrietta’s tea-cup while she is out of the room.

She finds it when she lifts the cup. She reads the direction upon the cover, and then the receipt; and having folded the two together, she puts them into her sleeve.

“It was to have gone to me.”

“It came to me.”

“Then I am glad it was the small one,” says Henrietta; and gives you your tea.`; }},
    {t:'Ask to see the others.', note:'£141 owing, as it proves', go:() => { fl('tasteAllow'); add({money:-141, family:-2}); reg('henrietta',-1,'Her milliners’ bills go to the steward’s room');
      return `She goes up without a word, and is some time gone; and what she brings down is a bandbox with “Lanchester” upon the lid, in which there was once a hat.

It holds the Christmases of nine years: Bond Street, Milsom Street, a Frenchwoman in the Orange Grove, a stay-maker, two glovers, and a man at Reading who has cleaned her feathers since ’96 and never been paid. ${steward()} is two days at the library table with it; at the end of which he reports the whole owing at a hundred and forty-one pounds, and desires to know under what head of the estate he is to enter a turban.

It is settled between you, before he has shut the book, that she shall have eighty pounds a year, paid at the quarter, and that the bills shall come to the steward’s room. Henrietta agrees to it; and for the remainder of the winter she wears, upon every occasion when the county is to be met, the gown in which she was married.`; }},
    {t:'Pay it; and write that she will in future be dressed at Newbury.', note:'£89', go:() => { fl('tasteNewbury'); add({money:-89, family:-8, standing:-1}); reg('henrietta',-3,'You took her from Bond Street, and put her into brown stuff from Newbury');
      return `You pay the eighty-nine pounds, and write beneath the draft that Mrs ${S.sur} will give no further orders.

Madame Lanchester regrets it in the third person, and in French. Miss Pocock of Northbrook Street, who has made for the clergy of Newbury these twenty years, is sent for with her patterns; and Henrietta stands to be measured for a gown of brown stuff as she would stand to be bled.

It is worn to church upon the first Sunday of the year. Mrs Tamworth, in the porch, is so good as to admire the colour; and Henrietta, upon coming home, gives the pelisse to her maid.`; }}
  ]});

/* ---- Her brother borrows ---- */
ev({ id:'tBrother', from:1797, to:1808, weight:5, cond:() => T('brother') && !F('fredAbroad'), who:() => null, title:'Frederick Is Detained in Town',
  text:() => `The letter is charged double, and is dated from no town that Frederick was ever quartered in.

“At Mr Hemp’s, Cursitor Street, Tuesday.

My dear ${S.sur}, You will be surprised at my direction. I came up on Friday upon regimental business, and was walking down the Strand as innocent as a lamb, when a fellow touched me upon the shoulder in the matter of a tailor at Colchester. I am therefore with Mr Hemp, who is an officer of the Sheriff, and a very civil man, and who charges me fourteen shillings a day for a room with bars to it, and five for a fowl.

The Colonel believes me to be with a sick aunt. If I am not upon parade on Monday se’nnight, he will enquire for her.

Do not tell Hetty. Your affectionate brother, Fredk. Venn.”

The sum is upon the second sheet. It is a hundred and eighty-six pounds; and beneath it, in a different ink, he has added Mr Hemp’s fowls.`,
  choices:[
    {t:'Pay the hundred and eighty-six pounds, and the fowls.', note:'£191', go:() => { add({money:-191, family:3}); reg('henrietta',1,'You fetched Frederick out of Cursitor Street, and did not tell her');
      return `Mr Spurling’s London agent carries the money to Cursitor Street upon the Saturday, and is kept waiting in the passage while Frederick finishes a rubber with Mrs Hemp.

He is upon parade on the Monday se’nnight. The Colonel asks after the aunt; and Frederick, by his own account, answers with so much feeling that he is given two days’ further leave in which to bury her, and spends them at Epsom.

He writes to thank you from Chelmsford, upon a single sheet. Henrietta is not told; but at Lady Day she asks you across the table whether Frederick has been ill, his last letter to her having been so very dutiful.`; }},
    {t:'Pay it; and buy him into a regiment that lies at Ceylon.', note:'£351', go:() => { fl('fredAbroad'); add({money:-351, family:-3}); reg('henrietta',-1,'You sent Frederick to Ceylon');
      return `It costs a hundred and ninety-one pounds to open Mr Hemp’s door, and a hundred and sixty more at Mr Cox’s, in Craig’s Court, to turn a captain of Militia into an ensign of the 19th Foot; which regiment is at Colombo, and wants officers faster than the climate can be got to spare them.

He sails from Portsmouth in the Walmer Castle, Indiaman, having borrowed his mess-money of the purser.

Henrietta does not speak to you for a week. Frederick writes each spring, as he always did; but a letter from Ceylon is seven months upon the water, the sum upon the second sheet is in pagodas, and Mr Tidmarsh, upon being shown it, declares that his house has no correspondent nearer to Colombo than Leadenhall Street.`; }},
    {t:'Send the letter on to her brother James, at Lincoln’s Inn.', go:() => { add({family:-3}); reg('henrietta',-1,'Frederick wrote to her that he had not thought it of you');
      return `James Venn has the letter by the next post, with a line from you upon the cover.

He is a conveyancer, and does nothing in a hurry. He waits upon the tailor’s attorney; he takes exception to the affidavit; he discovers that the writ was made returnable upon a Sunday; and on the nineteenth day Frederick is let out of Cursitor Street without paying anybody but Mr Hemp, to whom he by that time owes thirteen pounds six shillings for his board.

The Colonel has enquired for the aunt. Frederick is put under arrest for a week, and reprimanded at the head of the regiment; and he writes to Henrietta, upon two sheets, that he had not thought it of you.`; }}
  ]});

/* ---- A lawsuit with the Tamworths ---- */
ev({ id:'tLawsuit', from:1797, to:1809, weight:5, cond:() => T('lawsuit') && !F('pewEnded'), who:() => null, title:'The Pew Comes On',
  text:() => `Mr Spurling has brought one of the two deed boxes out from Wyvern in his gig, and has it upon the justice-room table with the lid up.

The cause of ${S.sur} against Tamworth, which was begun by your grandfather in the year 1761, and has been put off at Salisbury in every term since, is at last set down to be heard in the Consistory Court upon the fourteenth. It concerns the square pew next the pulpit, six feet by seven, with a door, which your grandfather claimed as belonging to the Dower House, and old Mr Tamworth to Marsh Court; and the Archdeacon having ordered in 1763 that neither party should sit in it until judgment, it has ever since been occupied by the parish bier.

“We have the churchwardens’ book of 1702, sir,” says Mr Spurling, “and they have a faculty. I should not like to say which of the two the Chancellor will prefer. The proctors’ fees will be a hundred and twenty pounds.”

The Tamworths dine with you on Tuesday.`,
  choices:[
    {t:'Go to Salisbury, and have judgment.', note:'£120', go:() => { fl('pewEnded');
      if (chance(0.5)) { add({money:-40, standing:5});
        return `You are four days at the White Hart at Salisbury. The Chancellor of the diocese, who is eighty-one, hears the churchwardens’ book read through, and the faculty after it; he enquires twice what a bier is; and upon the fourth morning he pronounces for the plaintiff, with costs, which are taxed at eighty pounds.

The bier is carried out to the belfry on Saturday. On Sunday your servants file into the pew next the pulpit, Mudge leading; and Mr Tamworth, looking down from the gallery, where his family have sat since his father’s time, is observed to follow the whole of the Litany with his eyes upon the top of Mudge’s head.

They dine with you upon the Tuesday notwithstanding. The pew is not mentioned; but Mrs Tamworth, who has always taken soup at Hatherley, declines it.`; }
      add({money:-200, standing:-3});
      return `You are four days at the White Hart at Salisbury. The Chancellor of the diocese, who is eighty-one, hears the churchwardens’ book read through, and the faculty after it; he enquires twice what a bier is; and upon the fourth morning he pronounces for the faculty, the plaintiff to pay both sets of proctors, which comes to two hundred pounds.

The bier is carried out to the belfry on Saturday. On Sunday the Tamworths come down from the gallery, where they have sat since his father’s time, and take their seats under the pulpit, the six of them, upon new hassocks.

They dine with you on the Tuesday. Mr Tamworth is in great good humour, and praises the mutton; and at Christmas, for the first time in the memory of the estate, there is no bill from Mr Spurling.`; }},
    {t:'Settle it with Tamworth on Tuesday, over the port.', note:'£31', go:() => { fl('pewEnded'); add({money:-31, standing:2, goodwill:3});
      return `When the ladies are gone up, you ask Tamworth whether he has any great wish to sit under the pulpit. He has none. ${F('gallDead') ? 'The sermon is seldom under forty minutes' : 'Dr Gall preaches fifty minutes'}, and from the gallery a man may sleep unobserved; it was his father who wanted the pew, and his father has been in the chancel vault since ’79.

You find, upon comparing, that neither of you can say what the two families have laid out upon it. It is agreed before the second bottle is done that the suit shall be withdrawn, each side paying its own proctors; that the pew shall go to the parish, for the use of the singers; and that the bier shall be kept in the belfry.

Mr Spurling draws the agreement, and charges thirty-one pounds for it. Upon the Sunday when the singers first go in, he is seen to be looking at them from the free seats as a man looks at people who are living in his house.`; }},
    {t:'Put it off, as your father did.', go:() => {
      return `Mr Spurling writes to the proctor, and the proctor moves the Chancellor; and the cause, there being no objection from the other side, stands over to the Michaelmas term.

The deed box goes back to Wyvern in the gig. Upon Tuesday the Tamworths dine; and Tamworth, over the port, observes that he hears the pew was to have come on, and that for his own part he should hardly know what to do without it.`; }}
  ]});

/* ---- His uncle's widow has her jointure ---- */
ev({ id:'tJointure', from:1798, to:1808, weight:5, cond:() => T('jointure') && !F('jointureOut') && !F('auntMarried'), who:() => null, title:'Your Aunt Has Been Valued',
  text:() => `“Cheltenham, the 3rd.

My dear Nephew, I am assured by the physician here that I have the constitution of a woman of thirty, and may look to draw upon you for forty years. I mention it because I am going to be married. Major Hogan, late of the 88th, has a wound, a pension of seventy pounds, and a plan for a pump-room at Leamington, which wants only capital.

I have therefore had my jointure valued by a gentleman from the Equitable office, who makes it eleven hundred pounds. The Major knows a person in the City who will give that for it tomorrow. But I had rather it stayed in the family; and so, I am sure, would your poor uncle.

I walked to Prestbury and back before I sat down to this. Your affectionate aunt, Lavinia ${S.sur}.”`,
  choices:[
    {t:'Buy it in at eleven hundred pounds.', note:'£1,100; no more jointure', go:() => { fl('jointureOut'); fl('auntMarried'); add({money:-1100});
      return `Mr Spurling draws the release. Your aunt signs it at Cheltenham before two witnesses, of whom the Major is one; and eleven hundred pounds go down to her by a draft upon Tidmarsh.

She is married on the Thursday, in a bonnet of the Major’s choosing. The pump-room at Leamington is begun in the spring, and by Michaelmas has four walls; and you have at Christmas a letter from Mrs Hogan, who has that morning walked to Warwick and back, to say that she is very well, and that it is a great comfort to her to be no longer a burden upon anybody.`; }},
    {t:'Offer her eight hundred, and remind her of your uncle.', note:'£800, if she takes it', go:() => { fl('auntMarried');
      const head = `Your letter is three sides. It speaks of your uncle, of the roof, of the price of wheat, and of the hazards of Leamington; and it encloses the opinion of Mr Tidmarsh, that no office in London would give above seven years’ purchase for a lady who walks.

She answers by return.

`;
      if (chance(T('silver') ? 0.65 : 0.4)) { fl('jointureOut'); add({money:-800});
        return head + `“My dear Nephew, The Major says that I am robbed. I say that it is in the family. Send the eight hundred. L. ${S.sur}.”`; }
      add({standing:-1});
      return head + `“My dear Nephew, The Major’s friend gave eleven hundred this morning, in notes. You will in future pay your hundred and twenty pounds to Mr Blizard, of Throgmorton Street, who desires me to say that he likes it upon the day. L. Hogan.”

Mr Blizard writes upon the twenty-sixth of March, the half-year being then one day behind.`; }},
    {t:'Wish her joy, and go on paying.', go:() => { fl('auntMarried');
      return `You wish her joy upon half a sheet.

The Major’s friend in the City sends a surgeon down to Cheltenham to look at her; and the surgeon, having been taken to Prestbury and back before breakfast, advises his principal to decline the purchase at any price. She is married notwithstanding; and the hundred and twenty pounds, which have for some years maintained one person in excellent health, are from Lady Day found to maintain two.`; }}
  ]});

/* ---- His uncle bought Coldharbour ---- */
ev({ id:'tColdharbour', from:1795, to:1800, weight:6, cond:() => T('coldharbour') && !!farm('coldharbour'), who:() => null, title:'Nine Stones upon the Table',
  text:() => `A man in a leather apron has walked up from the turnpike with a canvas bag; and being shown into the justice room, he empties it upon the table.

There are nine stones. He is Zebedee Moon, of Radstock in Somerset, mineral surveyor; and he has with him an agreement, signed by your uncle in the spring of ’91, by which he was to bore for coal in the Ten Acres at Coldharbour, at a guinea the yard. He is down a hundred and forty feet. Your uncle died thirty-one pounds in his debt; and ${coldT()}, as it now appears, has for these several years been ploughing round a shed with a hole in it.

“Chalk, sir. Chalk. Flint. Blue clay.” He comes to the ninth stone, which is black, and no larger than a walnut. “And that is smut, sir, at a hundred and thirty-eight. Where there is smut, there is coal under it; and where there is coal, a gentleman does not let his land at a pound an acre.”

${steward()} takes up the ninth stone, and smells it. He is of opinion that it came out of somebody’s kitchen grate.

Your uncle gave five thousand pounds for Coldharbour in the same spring.`,
  choices:[
    {t:'Pay him, and let him go down another sixty feet.', note:'£52', go:() => { add({money:-52});
      const head = `He has his engine at work again by Thursday: three men, a triangle of fir poles, and an iron rod that is let fall four hundred times in the hour.

`;
      if (chance(0.6)) { const f = farm('coldharbour'); if (f) f.rent += 15; add({goodwill:2});
        return head + `At a hundred and seventy-one feet the rod goes down of itself. Moon is observed to take off his hat; and by the time that you have ridden over, there is water standing in the hole within nine feet of the grass, as cold as a key, and enough of it to fill a bucket while a man counts twenty.

No coal is found. But Coldharbour, which has carted its water from the Kennet in every dry summer since King Charles’s time, has a well at the back door; and ${coldT()}, having tasted it twice, makes no difficulty at the audit about fifteen pounds more upon his rent.`; }
      return head + `He goes down the sixty feet, and brings up chalk; and at two hundred he brings up chalk again, with a flint in it, which he lays upon your table beside the others.

“We are very near it, sir. I never saw chalk look more like going off. Another hundred feet.”

You pay him his fifty-two pounds, and have the shed pulled down. The ninth stone is left behind in the bag; and Mrs Bunce, finding it in the justice room upon the Saturday, puts it on the fire, where it burns for twenty minutes.`; }},
    {t:'Pay him his thirty-one pounds, and have the hole stopped.', note:'£31', go:() => { add({money:-31, goodwill:1});
      return `Moon takes the thirty-one pounds, and counts them twice. He says that it is a pity; that he never left a hole with more regret; and that a gentleman at Shepton Mallet stopped at a hundred and forty also, whose neighbour now keeps a carriage.

The rods go back to Radstock upon a wagon. ${coldT()} has the shed for a calf-house, and a millstone rolled over the hole; and in the spring he ploughs the Ten Acres straight through, for the first time since he had the farm.`; }},
    {t:'Tell him that your uncle’s bargains were buried with him.', go:() => { add({goodwill:-3, standing:-1});
      return `He puts the stones back into the bag, one at a time, with the black one last.

He is four nights at the Bell before he goes home, where he drinks upon credit, and shows the agreement to whoever will read it; and as the Ten Acres never had a name that anybody liked, it is called from that week the Squire’s Colliery, first at the Bell, then by ${coldT()}’s carters, and at last, in the rate book, by the overseer.`; }}
  ]});

/* ---- Good connexions ---- */
ev({ id:'tMarquess', from:1798, to:1810, weight:5, cond:() => T('connexions'), who:() => null, title:'Four Horses for Eleven o’Clock',
  text:() => `The landlord of the George has sent his boy up to the Hall with a message: that the Marquess of Stanmore, going down to Bath, has bespoke four horses for eleven o’clock on Thursday, and will not alight.

It has been known in Wyvern since Tuesday. Mrs Tamworth has discovered that she wants ribbon; Lady Cullerne’s carriage is ordered for the saddler’s; and the Mayor has had the pump painted.

Your mother spoke of her cousin the Marquess at every dinner for forty years. She never in that time saw him nearer than across the Rotunda at Ranelagh; ${S.seen && S.seen.tConnexions !== undefined ? 'and you have yourself had one letter from him, which was to ask a favour' : 'and he has not, in the same forty years, written one line to Hatherley'}.`,
  choices:[
    {t:'Be at the George at eleven, and go up to the chaise window.', go:() => {
      const head = `The chaise comes in at ten minutes past, with the blinds half down. You go up to the window before the ostlers have the traces off, and give your name, and your mother’s.

`;
      if (chance(0.3 + S.standing / 150)) { add({standing:7}); reg('cullerne',1,'The Marquess gave you two fingers before the whole of Wyvern');
        return head + `A hand in a grey glove lets down the glass.

“Loft? Sally Loft’s boy? She had a nose. You have it.” He looks at you for some time through a glass of his own. “My compliments to your wife, sir. I never go into houses.”

He gives you two fingers, which you shake; the fresh horses are put to; and the chaise goes out under the arch at a trot. It was seen from the saddler’s, and from the ribbon shop, and by the Mayor; and Lady Cullerne, who had only a bow, sends on Friday to ask you both to dine.`; }
      add({standing:-4, goodwill:1});
      return head + `A hand in a grey glove lets down the glass one inch.

“Four, I said; and the greys are not to go leaders. And tell your wife that the sheets at Marlborough were damp.”

The glass is put up. The landlord of the George, for whom the message was intended, is standing at your elbow, and has heard it; so have the saddler, the ribbon shop, and the Mayor. The chaise is gone under the arch before you have your hat on again; and for the remainder of the winter any man who calls for a pot of beer at the Bell is told that the greys are not to go leaders.`; }},
    {t:'Send down a basket of grapes from the hot-house, with your card.', go:() => { add({standing:2});
      return `Mudge carries the basket down, and hands it up to the chaise window himself; and the county, through a gap in the blind, sees a grey glove come out, and take the basket in.

The horses are changed in six minutes, and nothing is said. But when the chaise is gone, the landlord finds upon the step your own card, turned over, with a line in pencil upon the back: “Obliged. The Lofts always had good glass. S.”

He sends it up to the Hall; having first, as you afterwards learn, kept it a day in the bar window.`; }},
    {t:'Stay at home.', go:() => { add({standing:3});
      return `You spend Thursday morning with ${steward()} upon the half-year’s accounts.

The Marquess changes horses in seven minutes, and speaks to nobody. Mrs Tamworth sees a grey glove; Lady Cullerne sees a blind; and the Mayor, who had a speech, delivers the first sentence of it to the hind wheel.

It is remarked in every shop that Mr ${S.sur}, alone of the county, was not there. By Sunday it is understood that he had no occasion to be, being in the habit of seeing his cousin in town; and Lady Cullerne enquires in the porch whether the Marquess looked well when you were last in Piccadilly.`; }}
  ]});

/* ---- A gambling man ---- */
ev({ id:'tPlayLuck', from:1797, to:1809, weight:5, cond:() => T('play') && S.season === 3, who:() => null, title:'Nine Mains Together',
  text:() => `It is the morning after the coursing meeting, and you have slept at the Pelican.

Upon the dressing-table, under your watch, there lies a half-sheet which you do not at first recollect. “I promise to pay Mr ${S.sur} or Bearer Four Hundred Pounds. H. Tamworth.” There was hazard in the back parlour after supper; you held the box from eleven until near two, and threw in nine mains together; and young Harry Tamworth, who is not of age, and who had lost his ready money by midnight, went on upon paper.

It is the first night since the year ’83 upon which you have risen a winner.

The boy is in the yard already, walking a horse up and down that nobody has asked him to walk.`,
  choices:[
    {t:'Carry the note to his father.', note:'+£400', go:() => { add({money:400, standing:-3});
      return `Mr Tamworth receives you in his book-room, and reads the half-sheet standing.

He pays it. He writes the draft without sitting down, sands it, and holds it out to you at the full length of his arm; and he desires to be informed, while you are putting it into your pocket-book, at what hour his son was first allowed the box, and who it was that allowed him.

Harry is sent to a tutor in Cumberland. The four hundred pounds are at Tidmarsh’s by Friday; and Mrs Tamworth, upon the Sunday, has the misfortune not to see you in the porch.`; }},
    {t:'Call him up, and burn it before him.', go:() => { add({standing:3, goodwill:1});
      return `He comes up with his hat in his hand, and stands just inside the door.

You hold the half-sheet to the candle, and let it go when the flame has reached his name.

“I was nineteen when I first held the box, Harry. I am not clear of that night yet. Go home.”

He goes home. Nothing is said by either of you; but old Tamworth has it within the week from the waiter at the Pelican, and sends you, without a line, a dozen of his father’s Madeira, of which there are known to be but two dozen left.`; }},
    {t:'Offer him his revenge: double or quits, upon one throw.', note:'£800, or nothing', go:() => {
      if (chance(0.5)) { add({money:800, standing:-6});
        return `The box is sent for. He calls seven, and throws crabs upon the breakfast cloth.

He writes a second half-sheet at the corner of the table, for eight hundred, and his hand is steadier than yours. It cannot be kept from his father, there being no other person in the family who has eight hundred pounds; and Mr Tamworth pays it at Lady Day, Midsummer and Michaelmas, in three drafts, each sent up by a groom who has orders not to wait for an answer.

The county has the story from the waiter. It is told with the boy’s age in it.`; }
      add({family:1});
      return `The box is sent for. He calls seven, and throws eleven upon the breakfast cloth, which nicks it.

He looks at the dice for some time, as though there might be more to come. Then he takes up his own note from the dressing-table, tears it across, and puts the pieces into his waistcoat pocket.

You ride home with what you set out with, to a shilling. It has not happened since 1783; and upon your mentioning it at dinner, as a thing that may interest her, Henrietta asks to see the shilling.`; }}
  ]});

/* ---- A love match ---- */
ev({ id:'tLoveBaronet', from:1797, to:1807, weight:5, cond:() => T('lovematch') && S.season === 3, who:() => 'henrietta', title:'The Baronet Her Mother Meant',
  text:() => `Wyvern Lodge is let for the hunting season to Sir Hugo Mallinder, of Mallinder Park in Northamptonshire; and upon his second day in the county he calls.

He is the baronet whom Mrs Venn had in view in the year ’74. Since that time he has buried two wives, come into eleven thousand a year, and lost sight of his own knees; he sits forty minutes upon the yellow sofa; and he tells Henrietta three times that she is not in the least altered, having upon being shown in enquired of her whether her mistress was at home.

Upon going he asks you both to dine on Thursday. There is to be a turtle, which has come from Bristol alive, in a tub.

Henrietta watches the carriage down the avenue.

“I had forgot the laugh,” she says.`,
  choices:[
    {t:'Dine with him, and hear what he remembers.', go:() => { add({family:4}); reg('henrietta',1,'Sir Hugo told the table about the blacksmith');
      return `The turtle is dressed three ways, and Sir Hugo is helped to each.

At the dessert he grows historical. He tells the table that he was to have danced the two first with Miss Venn at the Newbury assembly in the year ’73; that his horse cast a shoe at Thatcham; that he sat an hour and ten minutes in a smith’s shop, in pumps; and that when he came into the room she was standing up for the fourth time with a young man whose name nobody could tell him.

“The fellow never knew what he owed to that blacksmith, madam.”

“He has been told since,” says Henrietta.

In the chaise she takes your arm; and you are as far as the turnpike before she lets it go, to find the sixpence.`; }},
    {t:'Send Henrietta with Mrs Tamworth, and dine at home.', go:() => { add({family:5}); reg('henrietta',1,'Came home from the turtle, and asked for your chop');
      return `She goes in Mrs Tamworth’s carriage, in the grey silk, and is brought home at eleven.

You have had a chop in the library. She sits down upon the fender in her cloak, and gives you the dinner in its order: that he ate of the turtle three times; that he told a story about a blacksmith, which she did not follow; that he proposed the King, and the Craven Hunt, and “the ladies of Berkshire in the year ’73”, looking at her; and that before the tea came in he was asleep, with his mouth open, between Mrs Tamworth and the fire.

“Mamma would have had me sit opposite that for thirty years.” She gets up. “Is there any of the chop?”`; }},
    {t:'Decline for both. You have nothing to say to him.', go:() => { add({family:-3}); reg('henrietta',-1,'You kept her from Sir Hugo’s turtle');
      return `You decline in the third person, upon the ground of a previous engagement, and dine at home upon cold mutton.

Henrietta says nothing about it at the time. But the turtle is talked of in the porch on Sunday, at the saddler’s on Monday, and at the Tamworths’ for the rest of the week; and upon the Saturday she observes, while she is pouring out your tea, that she had not until now supposed you to be afraid of a baronet.`; }}
  ]});

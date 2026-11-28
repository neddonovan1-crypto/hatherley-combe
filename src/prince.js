/* The Prince. A line of papers upon the Prince of Wales, Regent from February 1811, which takes up what the game had of him already (the bond, the fête,
   the Address to the Princess, Ascot, the Chinese taste, and Lord Cullerne's "it's the Prince, and we're in") and gives it a beginning, a middle and a sale.
   Written in the Hatherley hand (docs/voice/VOICE.md). Loaded after king.js; it edits no other file's papers, and reaches the engine by wrapping ventureTick.

   What is true: the Prince's weight and his bow, his bass voice and his mimicry, his father among those he took off; Colonel McMahon, Keeper of the Privy Purse from 1812;
   the stables at Brighton under a dome eighty feet across (Porden, done by 1808), the heat of the Pavilion, the air-gun and the fiddler (Mrs Creevey, 1805), Martha Gunn;
   the Regency Act of 5 February 1811, the oaths upon the 6th, and the letter to Mr Perceval two days before; the letter to the Duke of York of 13 February 1812
   ("no predilections to indulge"), the hisses upon St Patrick's Day, the Morning Post's Adonis, and the Examiner of 22 March 1812; the Jubilee of 1 August 1814 and the
   sale of the Temple of Concord in a hundred lots that October.
   What is invented: that he ever came to Cullerne Castle or to Hatherley; his lordship's hope of the Buckhounds; the county address and the dinner at the Crown and Anchor;
   Mr Quelch and his half-sheet; the terms offered upon the bond, the portrait and the List; every lot named in the catalogue, and what became of the columns;
   Mr Crouch, the straw and its price, and whatever the Regent says under his verandah. (Nash's £2,750 for a verandah, the front of 170 feet, the thatch,
   the bill of some £30,000 and the first night in Ascot week 1815 are true.)

   Flags: prMet (he has spoken to you), prHost (he breakfasted at Hatherley), prPlate, prBrighton, prSide ('whig', 'court' or 'none'), prLibel ('bound', 'bought' or 'let'),
   prPaid, prPortrait, prList, prTemple, prCottage, prSwans ('kept', 'resigned' or 'sold'), guelph ('worn', 'kept' or 'sent').
   The Guelphic Order (prGuelph, Christmas 1815): founded 12 August 1815, Hanoverian, in three classes, with no rank in England (from memory). Invented: the fees, the grounds, and all that is said of it.
   Favour at Court (the trait, swans()) has a paper of its own, prSwans, and a reading in the Castle dinner, in We Are In and under the verandah. Invented: Captain Bloomer,
   the slip under the seal, the Levee and the hamper. From memory: that the Regent, in his first year, could grant places only during pleasure. princeLoan is put down when the bond is given up. */
const prAge = () => ['seven-and-thirty', 'eight-and-thirty', 'nine-and-thirty', 'forty'][clamp(S.year - 1799, 0, 3)];
/* An outcome in which he is in the room has its own cut, where one is drawn. */
const prCut = k => { if (typeof artURL === 'function' && artURL('events/' + k)) S.plateCut = 'events/' + k; };
const prBondYear = () => S.seen.royalBond === undefined ? 1806 : FIRST_YEAR + Math.floor(S.seen.royalBond / 4);

/* The papers are sent for by the calendar, so that the luck of the draw cannot lose them. One that is put off by a dated paper, and has missed its season, is sent for again the next year. */
const PR_WHEN = {prCastle:() => S.season === 2 && [1799, 1801, 1802].includes(S.year), prBrighton:() => S.season === 1 && S.year >= 1807 && S.year <= 1809,
  prIn:() => S.year === 1811 && S.season === 0, prAdonis:() => S.year === 1812 && S.season === 0, prPurse:() => (S.year === 1812 && S.season >= 2) || S.year === 1813, prSwans:() => S.year === 1811 && S.season >= 2, prLots:() => S.year === 1814 && S.season === 3, prCottage:() => S.year === 1815 && S.season >= 2, prGuelph:() => S.year === 1815 && S.season === 3};
const ventureTickPrince = ventureTick;
ventureTick = function(line){ ventureTickPrince(line);
  for (const id in PR_WHEN) { const e = byId(id); if (PR_WHEN[id]() && S.seen[id] === undefined && !S.queue.some(x => x.id === id) && (!e.cond || e.cond())) later(id, 0); } };

/* The bond and the fête were for the King's acquaintance only. They are opened to a squire whom the Prince has met. */
{ const bond = byId('royalBond'), fete = byId('royalRegency');
  if (bond) { const t = bond.text;
    bond.weight = 24;
    bond.cond = () => !F('bondAsked') && (F('royalKnown') || F('prMet'));
    const text = () => F('royalKnown') ? t() : t().replace('“His Royal Highness knows his father’s friends in Berkshire, sir. He would wish to count them his own.”', '“His Royal Highness has not forgot the Castle, sir. He never forgets a face; and I am kept to remember the names.”');
    text.toString = () => String(t); bond.text = text; }
  if (fete) fete.cond = () => (F('royalKnown') || F('prMet')) && !F('regencySeen') && S.season >= 1; }

/* ---------- 1799 to 1802: the Castle ---------- */

ev({ id:'prCastle', from:1799, to:1802, weight:30, hen:false, who:() => 'cullerne', cond:() => S.season === 2, title:'The Prince at the Castle',
  text:() => `It is the second week of September, when a Prince may shoot partridges as lawfully as another man; and Lord Cullerne, who has not been seen to hurry since the Westminster election of ’84, comes up your avenue at a hand-gallop, and does not get down.

“I’ve the Prince on Thursday, ${S.sur}. Three nights. He brings two-and-twenty, and I dine eighteen.”

The Castle, it appears, can seat forty, and has forks for eighteen of them; the rest of the Cullerne plate having gone up to London in the year ’93, in a hackney coach, and been seen since by nobody but a silversmith in Cranbourn Alley. Your uncle’s silver is three dozen of everything, with two tureens; and his lordship has had the number from his own butler, who had it from yours.

“Lend me the lot, and you dine. He’ll speak to you. He speaks to everybody, and remembers it.”

${hh(`Henrietta, who heard the horse from the morning-room, is at the head of the steps; and having heard the rest from there, she remarks to the footman that the Castle is seven miles off, that Hatherley has forks for forty, and that a Prince must breakfast somewhere.`, `Henrietta being at Bath, there is nobody upon the steps but the footman; who has heard the whole, and will have it in the kitchen before his lordship is through the lodge gates.`)}`,
  choices:[
    {t:'Lend the plate, and dine at the Castle.', note:'£9', go:() => { fl('prMet'); fl('prPlate'); add({money:-9, standing:4}); reg('cullerne', 2, 'You lent him your plate for the Prince'); prCut('prCastle-dinner');
      return `The plate goes over upon Wednesday in the wagon, under Mudge and a gun; and upon Thursday at seven you sit down at the Castle, the nineteenth of forty, with your own crest before you upon a fork.

His Royal Highness is ${prAge()}, and something over seventeen stone; he has the finest bow in Europe, and makes it to the curate. He eats of everything. He sends his compliments down the table to whoever bred the mutton; he sings, when the cloth is drawn, the bass part in a glee, and sings it true; and towards two in the morning, a gentleman of his suite having named the Lord Chancellor, he becomes the Lord Chancellor, with a napkin for a wig, until Lord Cullerne is obliged to be helped from his chair. A small man with a red face, who sits at the foot of the table and drinks nothing, has by that hour written the name of every gentleman present into a pocket-book.

${F('royalKnown') || swans() ? `${F('royalKnown') ? `“${S.sur}? You are the man with my father’s ram.” He looks at you with his head upon one side, and his chin drawn in. “What? What? Stands the wet, hey?”` : `“${S.sur}? You are my father’s swan-keeper, who held the horse.” He looks at you with his head upon one side, and his chin drawn in. “What? What? Shown you a swan yet, hey?”`}

It is the King to the life; and the whole of that end of the table waits to see whether the King’s friend will laugh.` : `“Hatherley. I shall remember Hatherley.” He says it across four people, with his glass lifted; and the small man at the foot of the table turns back a leaf.`}

The plate comes home upon the Monday. ${steward()} counts it twice into the chest, and enters in his book: wanting, eleven tea-spoons and a mustard-pot, nine pounds.`; }},
    {t:'Keep your forks, and ask him to breakfast at Hatherley.', note:'£180', go:() => { fl('prMet'); fl('prHost'); add({money:-180, standing:5, family:5}); reg('henrietta', 2, 'The Prince of Wales breakfasted at Hatherley'); reg('cullerne', -2, 'You kept your plate, and had his Prince to breakfast'); prCut('prCastle-breakfast');
      return `His lordship borrows of the Tamworths, who have two dozen; and upon the Friday a groom in the royal livery rides to your door, to say that His Royal Highness will breakfast at Hatherley on Saturday, at eleven.

He comes at ten minutes past three. There are fourteen with him, in five carriages; and a breakfast of forty covers has stood since eleven, with a turtle sent express from Bristol at thirty guineas, four pine-apples, and ices which Mrs Bunce has twice carried back to the ice-house with her own hands. ${hh('Henrietta has been in feathers for four hours, and has not sat down, for fear of them.', 'Henrietta, who came from Bath by the night coach, has been in feathers since seven.')}

The Prince, who was never yet punctual, and never yet uncivil, begs nobody’s pardon, and has the whole house at its ease in a quarter of an hour. He hands Henrietta in; he praises the turtle to her, and the ices to you; and stopping in the hall upon his way out, before the Dutch picture which your uncle bought for a Cuyp, he looks at it through his glass for a full minute, pronounces it a very pretty thing, and by no means a Cuyp, and names the man who painted it.

He is gone by five. The reckoning is a hundred and eighty pounds; and the chair in which he sat is tied across with a ribbon${hh('', ', before Henrietta takes the coach again')}.`; }},
    {t:'Tell him that the plate is at the bank.', go:() => { add({goodwill:1}); reg('cullerne', -1, 'Your plate was at the bank when the Prince came');
      return `“It is at the bank, my lord, in the strong room. I am sorry for it.”

“Are you, by God.”

He looks past you into the hall, where the door of the plate closet stands open, and a footman is at that moment rubbing a tureen; and he turns his horse without another word.

The Prince dines at the Castle upon the Thursday, off the Tamworths’ forks; kills forty brace upon the Friday over his lordship’s stubbles; and posts away on Sunday for Brighton, passing your lodge with the blinds down. At the Sessions dinner in October his lordship tells the story of the napkin and the Lord Chancellor to eleven magistrates, and begins it:

“You were not there, ${S.sur}.”`; }}
  ]});

/* ---------- 1806 to 1809: Brighton ---------- */

ev({ id:'prBrighton', from:1806, to:1809, weight:14, hen:false, at:'turnpike', who:() => null, cond:() => S.season === 1, title:'The Steyne',
  text:() => `${hh(`Henrietta has been told by the apothecary that she wants sea air; she has been told by Mrs Tamworth that nobody is at Bath; and she has herself discovered in the Morning Post that the Prince of Wales goes down to Brighton at the end of July for the races, and that a house upon the Steyne is to be had for the six weeks at two hundred and sixty pounds.`, `Henrietta writes from Gay Street that Bath is empty; that the apothecary there is positive for sea air; and that a house upon the Steyne at Brighton, where the Prince of Wales goes down at the end of July for the races, is to be had for the six weeks at two hundred and sixty pounds.`)}

A lodging in West Street, over a pastry-cook’s, is ninety.

${steward()}, who was once at Brighton upon the matter of a horse, is asked what kind of a place it is.

“It is a fishing town, sir, of one street, with a Prince at the end of it. His horses stand under a dome eighty feet across, in the Indian manner. His Royal Highness lives beside them, in a farm-house that has been added to.”${F('princeLoan') ? `

He mentions further that Colonel McMahon is commonly to be met upon the Steyne between two and four; and that the interest upon a thousand pounds, for the time it has been owing, would take the house.` : ''}`,
  choices:[
    {t:'Take the house upon the Steyne.', note:'£260', go:() => { fl('prBrighton'); add({money:-260, standing:3, family:6}); reg('henrietta', 2, 'Six weeks upon the Steyne');
      if (F('prMet') || F('princeLoan')) prCut('prBrighton-pavilion');
      return F('prMet') || F('princeLoan') ? `The house is the fifth from the Pavilion; and upon the second Tuesday there comes a card, by which Mr and Mrs ${S.sur} are bidden for the evening.

The rooms are lighted with Chinese lanterns, and kept at such a heat that two ladies are led out before the tea; while the Prince’s band, which is all of wind instruments, plays in the next room with the doors open. Towards eleven His Royal Highness sends for an air-gun. A target is set up at the end of the gallery; he hits it himself four times in six, and will then have the ladies try; and Henrietta, upon whom the choice falls third, having shut both her eyes, puts a ball through the door of the music-room, where a bassoon leaves off.

“Capital, madam. I have wished that bassoon shot these three years.”

Mrs Fitzherbert, at the card-table, does not look up. ${F('princeLoan') ? 'Colonel McMahon, who had been coming towards you with his hand out, has by this time recollected something at the other end of the gallery.' : 'Henrietta does not sleep; and before breakfast she has written it to eleven people.'}` : `The house is the fifth from the Pavilion, with a bow window; from which, in the six weeks, Henrietta sees the Prince go by on horseback nineteen times, in a carriage eleven, and once on foot, when he takes off his hat to the window next door.

She is dipped every morning at seven by Martha Gunn, who is eighty, who has the arms of a drayman, and who has dipped the Prince. Upon the Thursdays there is a ball at the Castle Inn; upon the Steyne, at any hour, there are eleven officers of the Tenth to every young lady; and though the footman is sent four times a day to look upon the hall table, no card comes from the Pavilion.`; }},
    {t:'Take the lodging in West Street.', note:'£90', go:() => { fl('prBrighton'); add({money:-90, family:2});
      return `The lodging in West Street has two rooms, a view of a stable-yard, and the smell of the pastry-cook’s oven from four every morning.

Henrietta is dipped at seven by Martha Gunn, who is eighty, and who has dipped the Prince; she walks upon the Steyne from two until four, in a bonnet bought for the purpose; and upon the Friday, a groom of the royal stables being willing for a shilling to let you in, you go together to look at some fifty horses standing under the dome, upon straw plaited at the edges, with a man to every two.

Henrietta looks up at the dome, and then at the groom.

“They are better lodged than we are.”

“Yes, ma’am,” says the groom. “And than he is.”`; }},
    {t:'Stay at Hatherley. There is sea air when the wind is south.', go:() => { add({family:-3}); reg('henrietta', -1, 'You would not take her to Brighton');
      return `${hh(`“There is sea air enough at Hatherley, when the wind sits in the south.”

Henrietta folds the Morning Post, and lays it upon the fire.`, `You write that there is sea air enough at Hatherley, when the wind sits in the south; and you have no answer for three weeks.`)}

The Tamworths go, to the house upon the Steyne; and in September Mrs Tamworth calls in a hat of a new shape, to say that it rained, that the fish was dear, and that the Prince bowed to her twice. She has brought${hh('', ' for')} Henrietta a box with shells glued upon the lid.`; }}
  ]});

/* ---------- February 1811: his lordship comes in ---------- */

ev({ id:'prIn', follow:true, hen:false, who:() => 'cullerne', cond:() => S.year === 1811, title:'We Are In',
  text:() => `The King has been three months shut up at Windsor; the Regency Bill has passed both Houses; and upon the day that the Great Seal is put to it, Lord Cullerne’s travelling chariot, which has not been out of the coach-house since the Talents went out, stands at your door with four horses to it.

His lordship does not sit. He has in one hand a list, in Lord Grey’s writing as he says; and in the other a tailor’s pattern of blue cloth, with gold lace.

“Six-and-twenty years I’ve dined with him, ${S.sur}. Sat up with him. Lent him money. It’s Grey and Grenville by Thursday, and I’ve the Buckhounds.”${F('prMet') ? `

He looks you over. “You’ve dined with him yourself.”` : ''}${F('mp') ? `

“And you’ve a vote. He’ll want every vote.”` : ''}${swans() ? `

“You’ve a place of the old man’s, besides. Ninety pound. Sign, and I’ll see you keep it.”` : ''}

The county, it appears, is to address the Regent upon his coming to the government, and to hope that he will call to his councils men who have his confidence. The address lies at the Castle, with his lordship’s name to it, and forty lines ruled beneath; and the friends of the new Ministry are putting down two hundred pounds apiece towards a dinner at the Crown and Anchor.

“There’ll be a list of baronets. There always is. I’ll want names for it.”

${steward()}, when the chariot is gone, observes that Mr Perceval has not yet been seen to pack.`,
  choices:[
    {t:'Sign under his lordship, and put down the two hundred.', note:'£200', go:() => { fl('prSide', 'whig'); add({money:-200, standing:-2}); reg('cullerne', 2, 'You signed his address to the Regent');
      return `You sign under his lordship, and give a draft for two hundred pounds; and the address goes up to London in the chariot, upon the seat beside the blue coat.

The Prince takes the oaths upon the Wednesday. Two days before, as is afterwards known, he had written to Mr Perceval that he would do nothing which might retard his father’s recovery; and that, out of filial duty alone, he should keep his father’s servants.

The dinner at the Crown and Anchor is not given, and the two hundred pounds are not returned, having been laid out upon the dinner. The address of the County of Berks is received very graciously by Mr Ryder, the Home Secretary; who reads the names beneath it with attention, and has them copied.

Lord Cullerne is at the Castle again by Saturday. The chariot goes back into the coach-house; and the blue coat, as his valet tells ${steward()}, was never taken out of its paper.`; }},
    {t:'Write to the Treasury, that Mr Perceval has a friend in Berkshire.', go:() => { fl('prSide', 'court'); add({standing:3}); reg('cullerne', -2, 'You wrote to the Treasury in the week he was to come in');
      return `You write that night to Mr Arbuthnot at the Treasury, in eleven lines, that whatever changes may be in contemplation, the Minister has no steadier friend in Berkshire.${F('mp') ? ' You add that the Member for Wyvern will be found in his place.' : ''}

It lies four days unanswered; and for those four days you read the London papers standing.

The Prince takes the oaths upon the Wednesday, having written two days before to Mr Perceval that, out of duty to his father, he shall keep his father’s servants. Mr Arbuthnot’s answer comes upon the Friday, under a frank. He is commanded to say that Mr Perceval is very sensible of the attention; and beneath his name there are two words in another hand: “Not forgot.”

Lord Cullerne passes you in Wyvern market place on the Saturday, on foot, and looks at the church clock until you are by.`; }},
    {t:'“When he has sent for Lord Grey, my lord, I will sign.”', go:() => { fl('prSide', 'none'); reg('cullerne', -1);
      return `“When he’s sent for Grey there’ll be no room under.”

There is room. The Prince takes the oaths upon the Wednesday, having written two days before to Mr Perceval that, out of duty to his father, he shall keep his father’s servants; and of the forty lines ruled beneath his lordship’s name, when the Under-Sheriff sends to the Castle for the address, nine are filled.

The blue coat with the gold lace is sold in March, by the valet, to a player of the Newbury theatre, who wears it as the Duke of Buckingham.`; }}
  ]});

/* ---------- March 1812: the Examiner ---------- */

ev({ id:'prAdonis', follow:true, at:'wyvern', who:() => null, cond:() => S.year === 1812, title:'An Adonis of Fifty',
  text:() => `Upon the thirteenth of February, the year of the restrictions being out, the Regent wrote to his brother the Duke of York that he had no predilections to indulge; upon the seventeenth of March, at the dinner for St Patrick’s Day, his health was drunk in silence, and then hissed; and the Morning Post having answered the hisses with verses, in which he is an Adonis in loveliness, the Examiner newspaper has answered the Morning Post.

The constable lays the answer upon the table of the justice room. It is a half-sheet, damp from the press, with a thumb-mark at one corner.

“What the EXAMINER says of the PRINCE REGENT. That this Adonis in Loveliness is a corpulent Man of Fifty; a Violator of his Word; a Libertine over Head and Ears in Disgrace; a Despiser of domestic Ties; the Companion of Gamblers and Demireps; a Man who has just closed Half a Century without one single Claim on the Gratitude of his Country. Price One Halfpenny. QUELCH, Printer, Market Place, Wyvern.”

It is to be cried under the Corn Exchange upon Saturday, the constable says; and Quelch, being asked who ordered it, has very civilly shown his book. Five hundred, to the account of the Earl of Cullerne.

“The Attorney-General has filed his information against the London paper, sir. Mr Quelch says that he is only a printer, and prints what is paid for.”${F('privyChamber') ? `

You are a Gentleman of the Privy Chamber to the person described.` : ''}`,
  choices:[
    {t:'Bind Quelch over to the Sessions.', go:() => { fl('prLibel', 'bound'); add({standing:2, goodwill:-4}); reg('cullerne', -2, 'You bound over his printer');
      return `Quelch is brought up in his apron, and bound in forty pounds to answer at the Sessions for publishing a libel upon the Regent; and as he has not forty pounds, his surety is entered by a clerk from the Castle, who has the sum about him in notes.

At Reading, upon the day, the bill goes before the grand jury; and the Chairman of Quarter Sessions for this county, who takes his seat that morning under the King’s arms, is the Earl of Cullerne.

He has the half-sheet read through in a full court by the clerk of the peace; and has it read a second time, at his own desire, as not having caught the word after “Gamblers”. The grand jury retire for as long as a man takes to drink a glass of ale, and find no true bill.

Quelch prints a second five hundred the same week, with a line added at the foot: “As read at the Berkshire Sessions, by Order of the Chairman.”`; }},
    {t:'Buy the five hundred, and burn them.', note:'£3', go:() => { fl('prLibel', 'bought'); add({money:-3, goodwill:-1});
      return `Five hundred at a halfpenny are one pound and tenpence. You send ${steward()} down with a guinea; and he comes back with twopence, and with Quelch’s boy behind him, carrying the impression in a clothes-basket.

They burn very ill, being damp. The stable-yard has the smoke of them all the afternoon; and the boy who is set to stir the heap is seen to leave off stirring, and to move his lips.

By Saturday Quelch has a second impression upon the street, of a thousand; having now, as he tells ${steward()} with great civility, two customers for the article. The first five hundred he charges to the Castle, as before. A bill for the rest comes up to the Hall at Lady Day: “To printing, for ${S.name}, Esq., 1,000 Regents, £2 1s. 8d.”`; }},
    {t:'“It is the Attorney-General’s business. He is paid for it.”', go:() => { fl('prLibel', 'let'); add({goodwill:3, standing:F('privyChamber') ? -3 : -1}); reg('cullerne', 1);
      return `The constable leaves the half-sheet upon the table.

It is sold out by noon upon the Saturday. It is read at the Bell by the schoolmaster, standing upon a settle, to as many as the room will hold; and by Sunday there is not a child in Wyvern but knows the age of the Regent, and supposes Adonis to have been his father.

A month afterwards you find the half-sheet in the justice room, laid between the leaves of Burn’s Justice, at the title “Libel”.${F('privyChamber') ? `

The Lord Chamberlain’s office, which has the Wyvern news from somebody, writes to enquire whether Mr ${S.sur} was from home upon the day in question.` : ''}`; }}
  ]});

/* ---------- 1812 or 1813: the bond ---------- */

ev({ id:'prPurse', from:1812, to:1813, weight:25, at:'hall', who:() => null, cond:() => F('princeLoan') && !F('privyChamber') && (S.year > 1812 || S.season >= 2), title:'The Privy Purse',
  text:() => { const y = prBondYear(), n = Math.max(1, S.year - y);
    return `${steward()} brings in a letter under the Carlton House seal; for which the post-boy has asked nothing, it being franked “J. McMahon”.

“Carlton House, Tuesday.

“Sir, I am commanded by the Prince Regent to acquaint you, that His Royal Highness having been pleased to place his private affairs under my care, as Keeper of his Privy Purse, it is his earnest wish that those gentlemen who obliged him in former years should be among the first considered. I find that you hold His Royal Highness’s bond, of the year ${y}, for One Thousand Pounds.

“I am to propose to you, either the sum of Five Hundred Pounds, in full of all demands, to be paid upon the surrender of the bond; or, should it be more agreeable, His Royal Highness’s Portrait, at whole length, in the uniform of his own Regiment of Hussars, copied in oils from the picture by the late Mr Hoppner, with which he has been pleased to distinguish several of his particular friends.

“Gentlemen who prefer to await the payment of their bonds in full will be placed upon the List.

“I have the honour to be, Sir, your most obedient humble servant, J. McMAHON.”

${steward()} has had the bond out of the deed chest, and has worked a sum upon the back of the letter. “£1,000 at 5 per cent, ${n} ${n === 1 ? 'year' : 'years'}: £${50 * n}. Recd., 0.”`; },
  choices:[
    {t:'Take the five hundred pounds.', note:'+£489', go:() => { fl('princeLoan', false); fl('prPaid'); add({money:489});
      return `You send up the bond by the Wyvern coach; and in five weeks there comes a draft upon Messrs Coutts for five hundred pounds, less eleven pounds, being the fees of the Privy Purse office upon a payment out.

${steward()} enters it under the head of Bad Debts Recovered, where it is the first entry, and has the page to itself.

At Christmas there is a card. “The Prince Regent to Mr ${S.sur}.” The words “his friend”, which stood upon the last, have been left out by the engraver.`; }},
    {t:'Take the portrait.', note:'£42', go:() => { fl('princeLoan', false); fl('prPaid'); fl('prPortrait'); add({money:-42, standing:4, family:3}); reg('henrietta', 1);
      return `The picture comes in March by Pickford’s wagon, in a case nine feet high, which will not pass the hall door until the carpenter has taken the door off.

It shows a gentleman of five-and-twenty, slender in the waist, with one hand upon a sabre, and the other pointing at a battle. It is hung over the chimney-piece in the dining-room, in the place of your uncle; and Mrs Tamworth, who is the first of the county to be shown it, asks who it is.

In the bottom of the case there is a paper. “To Mr Smith, carver and gilder, of Bond Street, for a rich burnished frame to His Royal Highness’s portrait, for ${S.name}, Esq., forty-two pounds.”`; }},
    {t:'Keep the bond, and be placed upon the List.', go:() => { fl('prList');
      return `You write that you will wait; and by return there comes a printed paper, with a number written in at the head. You are four hundred and seventh upon the List.

${steward()} folds it into the bond, and the bond into the deed chest. He has enquired, he says, of a clerk at Coutts’s how the List goes on; and has been told that it was opened in the year ’95, by Act of Parliament, and that the gentleman who was first upon it then is first upon it still.`; }}
  ]});

/* ---------- October 1814: the Jubilee, in lots ---------- */

ev({ id:'prLots', follow:true, hen:false, at:'hall', who:() => null, cond:() => S.year === 1814, title:'The Temple of Concord, in Lots',
  text:() => `The Jubilee of the first of August, at which the Regent gave the people of London a Chinese bridge, a sea-fight upon the Serpentine, and a Gothic castle in the Green Park that turned at midnight into a Temple of Concord and went round, has been over these ten weeks; the pagoda upon the bridge is burnt, and a man with it; and the Temple is to be sold where it stands.

${hh('Henrietta has the catalogue from Mrs Tamworth, who had it from the auctioneer.', 'Henrietta has sent the catalogue from Gay Street, with three lots marked in ink.')}

“TO BE SOLD BY AUCTION, upon the Premises in the Green Park, the Materials of the TEMPLE OF CONCORD, in One Hundred Lots; comprising Columns, Cornices, Canvas, Lamps, and the celebrated Transparencies.

“Lot 31. Six Doric Columns, deal, painted as Porphyry, 14 feet.

“Lot 58. Two hundred Lamps, coloured, with their Irons.

“Lot 77. A capital Transparency, THE TRIUMPH OF BRITANNIA, 20 feet by 12, with the Regent in a Car.”

${F('chineseRoom') ? 'The dragons in the drawing-room have been up some years, and one of them has lost an eye. ' : ''}${hh('She has measured the lawn below the terrace with the gardener’s line; and she finds that six columns would stand upon it in a ring, with room for a seat.', 'She writes that six columns would stand in a ring upon the lawn below the terrace, with room for a seat; and that she has the measure of the lawn by heart.')}`,
  choices:[
    {t:'Bid for the six columns.', note:'£34', go:() => { fl('prTemple'); add({money:-34, standing:1, family:4}); reg('henrietta', 1, 'You bought her six columns of the Temple of Concord');
      return `The six columns are knocked down to your agent at four guineas, there being no other bidder but a builder of Pimlico; and they come down the Bath road upon a timber-carriage, at a cost, in carriage and turnpikes, of thirty pounds.

They are set up in a ring upon the lawn, with a seat. At ten yards they are porphyry; and Henrietta gives tea among them to the Tamworths, upon the last fine day of October.

It rains in November. By Christmas the porphyry has come away in sheets as high as a man can reach; and beneath it there is deal, with the carpenter’s pencil upon it, and upon the third column from the house, in red chalk, “This side up.”`; }},
    {t:'Bid for the Transparency, and hang it in the barn for the audit dinner.', note:'£12', go:() => { add({money:-12, goodwill:2});
      return `The Triumph of Britannia is had for nine pounds, and comes by the wagon, rolled upon a pole.

It is hung across the end of the great barn for the audit dinner, with forty candles behind it; and the tenants, who have ${F('abated') || F('abatedHalf') ? 'this year had something off their rents' : 'this year asked something off their rents, and not had it'}, eat their beef under the Regent in a car drawn by lions, while Plenty empties a horn of corn at his feet, and wheat is at ${wheatNow()} shillings.

Old Dewey looks at it for some time, with his knife in his hand.

“Who’s the stout party in the cart, sir?”

“That is the Prince Regent, Dewey.”

“I took un for Plenty.”`; }},
    {t:'Send no bid.', go:() => { add({family:-1});
      return `The Temple of Concord is sold in a morning, in its hundred lots, to builders, to the keeper of a tea-garden at Islington, and to the proprietor of a theatre; and the newspaper which reports it gives the whole sum fetched, and sets beside it what the Jubilee is said to have cost.

${hh('Henrietta reads the two figures aloud; and as you are still behind the Mercury, she reads them again.', 'Henrietta copies the two figures into her next letter, and underlines both.')}

The six columns, it is afterwards heard, are holding up the roof of a skittle-ground.`; }}
  ]});

/* ---------- 1815: the Cottage ---------- */

ev({ id:'prCottage', follow:true, at:'home', who:() => null, cond:() => S.year === 1815, title:'A Hundred and Seventy Feet of Thatch',
  text:() => `The Regent has a cottage. It stands in the Great Park at Windsor, three miles from the Castle where his father is kept; Mr Nash was engaged three years since to add a verandah to it, for two thousand seven hundred and fifty pounds; and it has now a front of a hundred and seventy feet, a conservatory, an eating-room, and a bill of thirty thousand. His Royal Highness slept in it for the first time in Ascot week.

As it is a cottage, it is thatched; and as there is more roof to it than to Hatherley church, there comes into your rick-yard upon a Tuesday a Mr Crouch, clerk of the works under Mr Nash, who has been through eleven parishes looking into barns, and who pulls a handful out of your wheat straw without asking.

“Forty loads, sir, drawn by hand. I will have none that has been through a machine; His Royal Highness can tell broken straw from the road.”

He offers two guineas the load, by a warrant upon the Office of Woods, payable in course. ${steward()}, who has stood behind him throughout, enquires what the course of that Office commonly is; and is told that it is very regular.

The same forty loads were laid by for the cottages in Mill Lane, of which four let in the rain.`,
  choices:[
    {t:'Sell him the forty loads, and take the warrant.', note:'+£76', go:() => { add({money:76, goodwill:-2});
      return `The forty loads go to Windsor in eleven wagons; and Mr Crouch gives you the warrant in the yard, for eighty-four pounds, upon the Office of Woods, Forests and Land Revenues, payable in course.

${steward()} carries it to the bank at Wyvern, where the clerk reads it, turns it over, and takes it into the back room. The bank will give seventy-six pounds for it, in notes; which, for a paper upon that Office with a year or two to run, is thought in the back room to be handsome.

It rains the whole of the week following. In Mill Lane a bed is moved against the chimney wall, and a milk-pan set where the bed was.`; }},
    {t:'Make His Royal Highness a present of the straw, and go over with it.', go:() => { fl('prCottage'); add({standing:3, goodwill:-2}); prCut('prCottage-verandah');
      return `You go over with the eleventh wagon, and are an hour at a white gate, while a keeper carries in your name.

The cottage is longer than the Hall. It has a verandah the whole length of it, upon rustic posts, with a honeysuckle trained up every one; and under the verandah, in a chair made for the purpose, sits a gentleman of three-and-fifty in a green silk gown, watching the thatchers.

${F('prSwans') === 'kept' ? `“My swan-keeper. You see that I am a man of my word, sir; I said that somebody should keep them.” He looks about the lawn, as if one might be upon it.` : F('prHost') ? `“Hatherley. You gave me a turtle, and I told you something disagreeable about a picture.” He says it before the page has done with your name. “I was right about the picture.”` : F('prMet') ? `“I know that face. It was at Cullerne’s, and there was a napkin.” He appears to recollect the napkin with satisfaction, and Lord Cullerne not at all.` : F('princeLoan') ? `“Mr ${S.sur}. McMahon tells me that we are very old friends.” He says nothing of how the friendship was contracted.` : `“Berkshire straw. I am obliged to you, sir. I am obliged to the whole county; it leaves me alone.”`}

He has you sit. He asks what a labourer’s cottage costs to thatch, and is told four pounds; and for some time afterwards he looks up at his own roof, where six men are at work.

“Nash said a verandah.”

A footman brings cherry brandy at eleven in the forenoon, and again at twelve. You are sent home in one of the royal carriages, with the wagons empty behind you; and no warrant is spoken of by anybody.`; }},
    {t:'“It is bespoke, Mr Crouch.”', note:'£18', go:() => { add({money:-18, goodwill:5, standing:-1});
      return `“By whom, sir?”

“By four cottages.”

Mr Crouch looks at the straw, and then at you, and writes a line in his book; and he has his forty loads within the week of Mr Tamworth, at two guineas and a half.

The thatcher is nine days in Mill Lane, at eighteen pounds for the four roofs. Upon the tenth it rains from morning until dark; and walking down the lane in the evening, you are asked in at three doors of the four, to look at a dry floor.`; }}
  ]});

/* ---------- Michaelmas 1811: Favour at Court, under a Regent ---------- */

ev({ id:'prSwans', follow:true, hen:false, at:'hall', who:() => null, cond:() => S.year === 1811 && swans(), title:'During Pleasure',
  text:() => `The King’s servants, since February, are the Regent’s to keep or to change; and the summer has gone by at Windsor without the swans being taken up, there having been nobody to command it. Now Mr Meux writes, and not from Windsor.

“Carlton House, the 9th of September.

“Sir, The Prince Regent, acting in the name and on the behalf of His Majesty, has been pleased to direct that the lesser offices of the Household be laid before him, with the names of those who hold them, and by whose favour. I find you entered as Deputy Keeper of the Swans upon the Thames, at £90, during pleasure; and against your name, in my predecessor’s hand, the words ‘Held the horse.’

“His Royal Highness will receive at his Levee on Thursday se’nnight such gentlemen as desire to be continued. I am to mention that a Captain Bloomer, of the Tenth Hussars, has been named to me for the first vacancy.

“I have the honour to be, Sir, your most obedient humble servant, Jno. Meux, Clerk.”

Under the seal there is a slip in another hand, not signed. “The Captain would give six hundred guineas for a resignation in his favour.”

${steward()} has turned back through the Christmas books. Sixteen years at ninety pounds are fourteen hundred and forty; and in sixteen years nobody has shown you a swan.`,
  choices:[
    {t:'Go up to the Levee, and be continued.', note:'£31', go:() => { fl('prSwans', 'kept'); const knew = F('prMet'); fl('prMet'); add({money:-31, standing:2}); prCut('prSwans-levee');
      return `It is thirty-one pounds, with the fees of the door; and you stand in the line at Carlton House between a Welsh judge and the Hereditary Grand Falconer, in the scarlet coat of your office, let out under the arms.

The Regent comes down the line in a field-marshal’s uniform, and Mr Meux reads the name from a card.

${knew ? `“The Swans. But I know you, sir; I have dined off your uncle’s plate, or you have eaten my breakfast, I forget which.”` : `“The Swans. You are the gentleman who held my father’s horse.”`}

“I had the honour to hold His Majesty’s horse, sir.”

“For forty minutes, I am told. I never could hold his attention for five.” He says it very pleasantly, and to the Welsh judge. “Keep your swans, Mr ${S.sur}. Somebody should.”

The place is continued, during pleasure, in a new book; and Captain Bloomer has the next vacancy, which proves to be in the Tower, among the lions.`; }},
    {t:'Answer that you held it of the King, and will hold it of nobody else.', note:'−£90 a year', go:() => { fl('prSwans', 'resigned'); fl('courtLost'); fl('kingsMan'); add({goodwill:4, standing:1});
      return `You write that you had the place from His Majesty’s own mouth, across the neck of a horse; and that when His Majesty is well enough to take it back, he shall find it where he left it.

Mr Meux does not reply. The Gazette of the Saturday has Captain Bloomer, and the salary stops at Michaelmas.

It is known in Wyvern by market day what was written, ${steward()} having been asked by eleven persons, and having told nine. At the Bell they drink the King’s health, and yours after it; and old Dewey, who never saw either a swan or a King, gives it as his opinion that it was very well said.

In November a hamper comes by the Windsor carrier, with no letter in it. There are two swans, plucked and trussed; and a ticket is tied to the leg of one. “By desire of the Queen.”`; }},
    {t:'Resign in the Captain’s favour.', note:'+£630', go:() => { fl('prSwans', 'sold'); fl('courtSold'); add({money:630, standing:-3});
      return `Six hundred guineas are paid in at the bank by a Mr Cox, of Craig’s Court, upon the day that your resignation is entered; and the Gazette has Captain Bloomer, of the Tenth Hussars, to be Deputy Keeper of the Swans, vice ${S.sur}, resigned.

The Captain goes down to Windsor with the barge the July following. He is the first Deputy Keeper in forty years to be bitten; and he writes to you from the Castle Inn, with his left hand, to enquire whether the scarlet coat was included.`; }}
  ]});

/* ---------- Christmas 1815: a cross from Hanover ---------- */

const prGuelphWhy = () => F('prCottage') ? 'services rendered to the Royal Person in the matter of a roof' : F('prSwans') === 'kept' ? 'the faithful keeping of His Majesty’s swans upon the Thames'
  : F('princeLoan') ? `pecuniary services rendered to the Royal Family in the year ${prBondYear()}` : F('prHost') ? 'the hospitality shown to His Royal Highness in the county of Berks' : 'your known attachment to the Royal Person';
ev({ id:'prGuelph', follow:true, at:'hall', who:() => null, cond:() => S.year === 1815 && (F('prMet') || F('princeLoan') || F('prPaid')), title:'A Cross from Hanover',
  text:() => `A packet is brought down from London by a clerk of the Hanoverian Chancery, who has eleven like it in his bag, and a list. The seal is black, and has a horse upon it.

There is in the packet a cross of gold, with a white horse galloping in the middle of it, and three words of Latin round the horse; a yard and a half of sky-blue riband, watered; and a sheet in French, to which an English one is pinned.

“London, the 4th of December 1815.

“Sir, I have it in command from His Royal Highness the Prince Regent, acting in the name and on the behalf of His Majesty as King of Hanover, to acquaint you that he has been pleased to nominate you a Knight of the Royal Guelphic Order, of the third class, in the civil division, in consideration of ${prGuelphWhy()}.

“The Order was instituted upon the 12th of August last. It confers no rank, title or precedence within the United Kingdom. The fees of the Chancery are twenty-six pounds.

“I have the honour to be, Sir, your most obedient servant, Münster.”

The clerk is walking his horse in the yard. ${steward()} has found Hanover upon the globe in the book-room, and has measured it with his thumb.`,
  choices:[
    {t:'Pay the fees, and wear it to the magistrates’ dinner.', note:'£26', go:() => { fl('guelph', 'worn'); add({money:-26, standing:2});
      return `You wear it to the magistrates’ dinner at the Bell, upon the left breast of a blue coat.

Mr Tamworth reads the Latin across the table, with his glass in his eye. “Nec aspera terrent. ‘Nor do rough things frighten them.’ Is it given for the roads, ${S.sur}?”

Lord Cullerne does not read it. “Hanover. He’s made a hundred of ’em since August. He’s made his apothecary.”

${held('knight') || held('baronet') ? `As you are Sir ${S.name.split(' ')[0]} already, the cross makes no difference in the order of going in.` : `There is some debate at the door, whether a Knight of Hanover goes in before an English esquire; and the chairman, having looked into Burn’s Justice and found nothing, sends you in where you went last year.`} But the waiter, who was nine years a drummer in the German Legion, calls you Herr Ritter until the cloth is drawn, and gives you the first cut of the goose.`; }},
    {t:'Pay the fees, and put it away.', note:'£26', go:() => { fl('guelph', 'kept'); add({money:-26, goodwill:1, family:2});
      return `The fees go up with the clerk, and the cross into the drawer of the book-room table, under the Christmas accounts.

It does not stay there. Mrs Bunce, who dusts the drawer, has shown it by Twelfth Night to the cook, the dairymaid and the Wyvern carrier; and upon the Sunday old Dewey takes off his hat to you a second time in the churchyard, having been told that the squire is made a German.`; }},
    {t:'Ask Colonel McMahon whether it is sent in place of the thousand pounds.', if:() => F('princeLoan'), go:() => { fl('guelph', 'kept'); add({standing:1});
      return `Colonel McMahon answers within the week, upon a whole sheet.

“The Privy Purse of His Royal Highness, and the Chancery of His Majesty’s German dominions, are distinct establishments, and neither is answerable for the engagements of the other. Your bond remains upon the List. I am to add that the cross is of gold.”

${steward()} carries it to the silversmith at Wyvern, and has it weighed. It is of gold, to the value of four pounds eleven shillings; and the Chancery, which has heard from the Colonel, does not ask again for its fees.`; }},
    {t:'Send it back, with your duty.', go:() => { fl('guelph', 'sent'); add({goodwill:3, standing:-1});
      return `You write to the Count that you are sensible of the honour; that you have never seen Hanover, nor done anything for it; and that an English gentleman, who has done so little for his own country, cannot very well take a cross for his services to another.

The clerk carries the packet away as he brought it, and crosses a name off his list. From the Count there is no answer. But the Chancery, which has a form for every case except this one, sends after you, by the post, a demand for twenty-six pounds.`; }}
  ]});

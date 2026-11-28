/* Eastern persons of rank. Two lines of papers, and a servant who outlasts both. Written in the Hatherley hand (docs/voice/VOICE.md).
   Loaded after king.js; it edits no other file, and reaches the quarter by wrapping ventureTick, and the Mercury by wrapping reckoning.

   I. The Rajah of Doolghur, 1805 to 1808. He, his country, his moonshee and his memorial are invented. What is true: Bundelcund came to the Company from the Peshwa
   by the treaty of Bassein, and its Boondela chiefs were taken under treaty from 1803; Mr Burke gave his greenhouse at Beaconsfield in 1781 to the Brahmin agents of
   Ragonaut Row, that they might cook and wash by their own law; Mr Paull, late a trader at Lucknow and Member for Newtown, was collecting charges against Lord Wellesley
   upon Oude and Furruckabad; Mr Charles Grant sat in the Chair at the India House in 1805, and Lord Castlereagh at the Board of Control; Persian was the language of
   business in every Indian court; and a Hindoo who crossed the sea had to be purified upon his return, which was reported of Ragonaut Row's envoys to have been done
   by passing them through a figure of gold. Mirza Abu Taleb Khan of Lucknow, in England from 1800 to 1802, was called in London "the Persian Prince", and wrote down the
   faults of the English under heads. No Indian prince is known to have been lodged in a private house by the Court of Directors.

   II. Mirza Abul Hassan, 1810. True: he landed at Plymouth in November 1809, Envoy Extraordinary from the King of Persia, with eight servants; Sir Gore Ouseley was
   appointed his mehmandar; he was affronted that nobody met him upon the road into London, and that his audience was put off; he learnt English in the seven months,
   kept a journal, grieved in it over the docked manes and tails of English horses, and had two water-pipes made at a London glass-house; he sailed from Portsmouth in the
   Lion in July 1810 with Sir Gore, who went out Ambassador. Lord Grenville was installed Chancellor of Oxford in the first week of that July. The Order of the Lion and
   Sun was instituted by the Shah in 1808 for foreigners. General Gardane's Frenchmen were at Tehran from 1807 to 1809. Invented: that the Mirza was at the installation,
   that he came down by Newbury, that he drank port, that he had Suns to leave behind him, and Aga Firooz altogether. (In 1819 he did bring eunuchs to London.)
   The Royal licence for a foreign Order is true, and so is the Regent's rule of March 1813 that it makes nobody a knight; the fees are a guess.

   S.raj: st ('here', 'gone', 'no'), pay (the Company's ten guineas a week are taken), t0, ease (how he was used), sum (the account was cast), way (which door), won.
   Flags: rajPaper (he left a deed in Persian), rajDeed ('asked', 'hawk', 'hung'), mz (how the Mirza was received, 1 to 3), agha ('house', 'office', 'free'),
   lion ('worn', 'home', 'hen', 'by'), aghaKeys, aghaBooks, aghaSixty. */
const rajHere = () => !!S.raj && S.raj.st === 'here';
const rajQs = () => S.raj ? Math.max(1, S.t - S.raj.t0) : 0;
const rajMonths = () => numWords(Math.max(2, 3 * rajQs()));
const agha = () => S.flags.agha || '';
const aghaIn = () => agha() === 'house' || agha() === 'office';
const aghaYears = () => Math.max(1, S.year - 1810);
const aghaFunds = () => 30 * aghaYears();
const RAJ_PAY = 136;
const rajBack = () => S.raj.ease < 0 ? rajQs() * (S.raj.paid ? RAJ_PAY : 45) : 0;

const ventureTickEast = ventureTick;
ventureTick = function(line){ ventureTickEast(line); eastTick(line); };
function eastTick(line){ const r = S.raj, earn = (label, a) => { line(label, a); S.yearIncome += Math.round(a); };
  if (S.year === 1805 && S.season === 0 && !r && !F('rajSent')) { fl('rajSent'); later('rajahLetter', 0); }
  if (r && r.st === 'no' && S.t - r.t0 === 3) S.notes.push(`The Rajah of Doolghur is lodged, by the Court of Directors, with a clergyman near Cheltenham, who has ten guineas a week for him, and is building a conservatory.`);
  if (rajHere() && S.t > r.t0) { if (r.pay) earn('The India House, for the Rajah’s table', RAJ_PAY); else line('The Rajah’s people and horses', -45); }
  if (S.year === 1810 && S.season === 1 && !F('mzSent')) { fl('mzSent'); later('mirzaComes', 0); }
  if (agha() === 'house') { line('Aga Firooz, his wages', -10); if (!F('aghaKeysUp')) line('Saved upon the house books', 16, 'Candles, tea and soap, since they were weighed at the door.'); }
  if (agha() === 'office') line('Aga Firooz, his wages', -10);
  if (F('aghaSixty') && aghaIn()) line('Aga Firooz, the addition', -5);
  if (S.flags.rajDeed === 'asked' && S.t === S.flags.rajDeedT + 3) S.notes.push(`The Secretary at the India House acknowledges your letter upon the village of Peeplee, in Bundelcund; and is commanded to acquaint you that it has been referred to the Governor-General in Council.`);
  if (S.year === 1813 && S.season === 1 && S.flags.lion === 'worn') S.notes.push(held('knight') || held('baronet') ? `The Gazette has a rule of the Prince Regent’s, that the Royal licence to wear a foreign Order shall give no man the style of a knight. As you are one already, upon other grounds, Wyvern reads it without alarm.` : `The Gazette has a rule of the Prince Regent’s, that the Royal licence to wear a foreign Order shall give no man the style, rank or precedence of a knight. The landlord of the George, who has had “Sir ${S.name.split(' ')[0]}” upon your bills since the Assize ball, goes back to “Esquire” at Midsummer.`); }

/* ================= I. The Rajah of Doolghur ================= */

ev({ id:'rajahLetter', follow:true, at:'hall', who:() => null, cond:() => !S.raj, title:'From the India House',
  text:() => `The packet is sealed with the arms of the East India Company, and has come free; and ${steward()}, who weighed it in his hand upon the stairs, has not gone down again.

East India House, the 9th of April, 1805.

Sir, I am commanded by the Court of Directors to acquaint you, that there landed at Portsmouth, with the last fleet from Bengal, the Maha Rajah Pertaub Sing of Doolghur, in the province of Bundelcund, a Prince in alliance with the Honourable Company; who is come to England without the Company’s leave, and against the advice of the Resident, to lay a memorial before the Court with his own hand.

The Court will receive the memorial of Dhoolgurh in its turn. But as it stands behind the despatches of three Presidencies; and as London, in the mean time, is neither wholesome to an Indian constitution, nor free of persons who make a trade of Indian grievances; the Court desire that His Highness may pass the interval in the country, under the roof of a private gentleman. Hatherley has been named to them as retired, healthy, and four miles from a post town.

The Court allow ten guineas a week for the table of the Rajah of Dulgar and his people, to be drawn by the quarter upon the Company’s Treasury. They request, in return, that His Highness be shown every civility; that he be kept from the newspapers; and that he receive no visit from any Member of Parliament whatever, and in particular none from Mr Paull, the Member for Newtown.

I am, Sir, your most obedient humble servant, W. Ramsay, Secretary.

You have the great atlas down from its shelf. Bundelcund is there, to the south of the river Jumna, and coloured yellow; but of Doolghur, under any of the Secretary’s three spellings, the engraver knew nothing. ${hh(`Henrietta, having read the letter twice, asks only what a Rajah eats.`, `${steward()}, having read the letter twice, asks only who is to pay for the horses.`)}`,
  choices:[
    {t:'Receive him upon the Company’s terms.', note:'+£' + RAJ_PAY + ' a quarter while he stays', go:() => { S.raj = {st:'here', pay:true, paid:true, t0:S.t, ease:0}; later('rajahComes', 1);
      return `You write that the Hall is at the service of the Court; and by return of post there comes a draft for the first quarter, with a printed paper, “Hints for the Reception of Natives of Rank”, in eleven articles.

From this it appears that His Highness will eat nothing which a Christian has dressed, and drink no water but his own; that his cook must have a place apart, with a door to it; that leather is not to be handed to him; and that no cow is to be killed within his sight.

Mrs Bunce has the eleventh article read over to her a second time. She is afterwards seen from the library, standing in the middle of the gravel sweep with her back to the house, and then turning about to learn how much of the larder window may be made out from a carriage.`; }},
    {t:'Receive him as your own guest, and send back the Company’s draft.', note:'−£45 a quarter while he stays. +Standing', go:() => { S.raj = {st:'here', pay:false, t0:S.t, ease:1}; add({standing:3}); later('rajahComes', 1);
      return `You write that a gentleman’s house is neither an inn nor a lazaretto; that the Rajah shall be as welcome at Hatherley as any other traveller of rank, and shall read what newspapers he pleases; and that the Court may keep its ten guineas.

The Secretary’s answer is two lines. “The Court have no objection to Mr ${S.sur}’s bearing the expense.”

The story is at the Castle within the week; and Lord Cullerne, who cannot be got to believe it upon the word of his own agent, rides over to hear it from yours.

“Ten guineas a week? And he sent it back? Is the man ill?”`; }},
    {t:'Decline. The Hall is not a house of detention.', go:() => { S.raj = {st:'no', t0:S.t}; add({goodwill:1});
      return `You write that you are sensible of the honour done to Hatherley by the Court; but that you have never yet had a guest who was not at liberty to read the Mercury, and are too old to begin with a prince.

The Secretary does not answer. ${steward()}, who had worked out ten guineas a week to the year’s end upon the back of the cover, rules a line through the sum, and carries the atlas back to its shelf.`; }}
  ]});

ev({ id:'rajahComes', follow:true, at:'hall', who:() => null, cond:() => rajHere(), title:'Four Lacs a Year',
  text:() => `Three post-chaises and a wagon turn in at the lodge a little after noon. Out of the first chaise there gets an old man in spectacles and white muslin, who announces himself, in the English of the Calcutta law courts, as Meer Hyder, moonshee to His Highness; and out of the wagon, one at a time, there are handed down eleven vessels of brass, each stopped with wax and sealed, which a cook in a red turban will suffer nobody but himself to lift.

The Rajah has ridden the last stage upon a hired hack. He is a spare man of forty, in a quilted coat of green silk, with a string of pearls over it, and a sword which he gives to no servant; and before he will get down, he looks for some time at the fifty-four windows, and at the rooks.

“How many villages?”

“One, Highness.”

“And horse?”

You tell him that there are eleven in the stable, and that four of them are at plough.

“My father had four hundred villages, and nine hundred horse; and Lord Lake wrote of him as a petty chief. I am curious to learn what does the Company call you.”

His English, as Meer Hyder explains upon the steps, was had from a Serjeant Rooney of the Bengal Artillery, a native of Cork, who came over to the old Rajah in the year ’88 with two six-pounders which were the Company’s.

A sirloin has been at the kitchen fire since ten. The moonshee, who has smelt it from the gravel, draws you a little aside.

“Sir, His Highness will sit at any table in England. He will eat at none. I beg to be informed what is to be done with the cook.”`,
  choices:[
    {t:'Give the cook the old brewhouse, as Mr Burke gave his greenhouse.', go:() => { S.raj.ease += 2; add({family:1}); later('rajahAsks', 1);
      return `Mr Burke, when the Peshwa’s uncle sent two Brahmins to London in the year ’81, and London had lodged them over a stable, carried them down to Beaconsfield and gave them his greenhouse; and what was done for an agent may be done for a prince.

The brewhouse is swept and given up. The cook washes the flags from one of the eleven vessels, digs a hearth in the floor with a trowel of his own, and shuts the door; and at five the Rajah goes in to him alone, and the door is shut again.

At six a brass dish is carried across the yard to the Hall, covered with a leaf, that the squire may know what His Highness had. ${hh('You and Henrietta eat it between you', 'You eat it alone')}, with spoons, in the library. It is rice, with something yellow, and is by a great deal the hottest thing that was ever swallowed at Hatherley; and when the dish goes back there is nothing in it.

The sirloin is eaten in the servants’ hall, in silence.`; }},
    {t:'Seat him at your own table. He is a prince, and this is your house.', go:() => { add({standing:2}); later('rajahAsks', 1);
      return `He sits at your right hand for two hours and a quarter, before a clean plate; and through the soup, the trout, the sirloin, which at Meer Hyder’s entreaty is carved behind a screen, and the gooseberry tart, he talks of Lord Lake, of the price of a horse at Hurdwar fair, and of what an acre of wheat will bear in a country where it rains for three months and for no more.

He eats one orange, which he peels with his own knife. When the cloth is drawn, and the port comes round to him, he looks at the decanter with great attention, and sends it on by the proper hand.

Next morning the moonshee waits upon ${steward()}, and enquires, as from himself, whether there be about the place any outhouse with a door.`; }},
    {t:() => `Ask ${kingParson()} to dinner to meet him.`, go:() => { const p = kingParson(); S.raj.ease += 1; if (!F('gallDead')) reg('gall', 1, 'Dined with the Rajah of Doolghur'); later('rajahAsks', 1);
      return `${p[0].toUpperCase() + p.slice(1)} comes at four, with a Testament in the Bengalee character, printed by the Baptists at Serampore, which he has had by him two years for want of anybody to give it to.

The Rajah receives it in both hands, and lays it upon his knee. He then asks what the living of Hatherley is worth; and being told that it is the tithe, he turns to his moonshee.

“A tenth! Write it down, Meer Hyder. My Brahmins have a fourth, and they tell me daily that they starve.”

He asks next who gave the gentleman his church; and learning that the living is in the squire’s own gift, he looks from one of you to the other for some time.

“It is so in Doolghur. But in Doolghur the priest does not dine with the man who appointed him, and tell him across the table that he will be damned.”

The dinner lasts until nine. Nobody is converted; and the Rajah, at parting, is promised the loan of Dr Paley’s Evidences.`; }},
    {t:'Never mind dinner. Walk him over the farms while there is light.', if:() => T('bred'), go:() => { S.raj.ease += 2; S.raj.plough = true; add({goodwill:1}); later('rajahAsks', 1);
      return `He gets down in the first barley that you come to, takes up a handful of the ground, and breaks it in his fingers; and he asks what the man pays who has it.

You name the rent.

“In silver? And in a year of no rain?”

“The same.”

“And if he cannot?”

“He goes at Michaelmas.”

The Rajah walks the length of a hedge without speaking.

“In Doolghur I take the half of what is grown; and in a bad year I take the half of nothing. The Resident has written to Calcutta that I am an oppressor of my people.”

At the home farm he has the drill plough drawn out of its shed, and walks behind it for two furrows in his green silk. He asks the maker’s name and the price; and Meer Hyder, upon the tail of a wagon, writes an order to Reading for two.`; }},
    {t:'Ask to see the Company’s account against him.', if:() => T('figures'), go:() => { S.raj.ease += 2; S.raj.sum = true; later('rajahAsks', 1);
      return `Meer Hyder brings down a tin box. The Company, as heir to the Peshwa by the treaty of Bassein, claims the Peshwa’s tribute upon Doolghur, at forty thousand rupees by the year, for eleven years in which nobody paid it, with interest at twelve per cent.

You add the column; and then, as your habit is, you add it upwards.

It is cast correctly. But the years stand in two hands, one clerk having entered them by the Christian reckoning and another by the Hindoo; and upon setting the two calendars side by side, with the moonshee to read you the second, you find that the years 1795 and 1796 have been charged twice over.

The difference, with the interest upon it, is one lac and four thousand rupees, or thirteen thousand pounds sterling. You write it out fair upon a half-sheet. Meer Hyder copies the half-sheet into Persian, and the Rajah puts the copy inside his coat.

“Eleven years,” he says, “and it wanted a man with one village.”`; }},
    {t:'Tell him that you served under Lord Cornwallis.', if:() => T('soldier'), go:() => { S.raj.ease += 2; add({standing:1}); later('rajahAsks', 1);
      return `“Cornwallis? He that took the half of Tippoo’s country in the year ’92?”

“He that gave up an army at York Town in ’81. I was six months before that upon his line of march, with a ball in my leg.”

The Rajah has the whole of Guilford Court House from you upon the steps, and the retreat to Wilmington after it; and he will have the surrender twice over, with the number of the guns.

“It is a great comfort to me. In Hindostan it is believed that the English were never beaten; and so nobody can see the use of talking to them.”

He dines in the brewhouse, which you have given up to his cook. Afterwards he sends Meer Hyder across the yard for the name of the American general, and for the spelling of it.`; }},
    {t:'Propose a game after dinner.', if:() => T('play'), note:'It will cost you', go:() => { S.raj.ease += 1; add({money:-16}); later('rajahAsks', 1);
      return `He does not play at cards; but there is a board among his baggage, and men of red and green ivory. In his game a pawn may go but one square at the first move, and a king may not castle; and of this you are informed at the eleventh move, when you attempt it.

The stake is a gold mohur. He plays quickly, with one hand, and talks all the while to his moonshee of something else.

By midnight you have lost eight games, and sixteen pounds; and the Rajah, who has taken off his pearls for coolness, says that he has not been so well entertained since Calcutta, and offers you a rook.`; }}
  ]});

ev({ id:'rajahAsks', follow:true, at:'hall', who:() => null, cond:() => rajHere(), title:'Which Door',
  text:() => `The Rajah has been ${rajMonths()} months at Hatherley; in which time he has read the first volume of Blackstone with his moonshee, learnt the name and the price of every horse in the parish, and had no word from the Court of Directors.

Two things come upon the same morning. The first is a letter for His Highness, under cover to you, from Mr Paull, in Charles Street, St James’s Square; who undertakes to lay the wrongs of Doolghur before the House of Commons with those of Oude and Furruckabad, and asks nothing for it but the papers.

The second is a hack chaise, out of which there steps a Mr Peachey, an Assistant in the Secretary’s office at the India House. He is upon his way home from Bath, as he says, and ${S.raj.pay ? 'has thought it civil to look in upon a house where the Company’s money is spent' : 'has thought it civil to look in'}; and he has not been five minutes in the library before he sees the letter upon the table, and the frank of a Member in the corner of it.

“His Highness will hardly wish to be troubled with that, sir. The Court will write.”

The Rajah has come in from the stables, and stands with his back to the fire.

“Mr ${S.sur}, I have seen in England a cattle show, a hanging at Reading, and Mrs Bunce’s dairy. I have not seen the Court of Directors. There is a door in Leadenhall Street, and there is a door at Westminster; and Mr Peachey is come from Bath to tell me that I must go in at neither. Which door is it?”`,
  choices:[
    {t:'Carry him up to Leadenhall Street yourself, and sit there with him until he is seen.', note:() => '£40' + (S.raj.pay ? '. The Company’s allowance stops' : ''), go:() => { S.raj.way = 'court'; S.raj.pay = false; S.raj.ease += 2; add({money:-40, standing:1}); later('rajahGoes', 1);
      return `You are nine days in the lobby of the India House, upon a bench between a ship’s husband and the mother of a cadet. A doorkeeper in a blue coat takes in the Rajah’s name each morning at ten, and brings it out again at four; and upon the sixth day he lets it be understood, that the lobby has been sat in before now by a Nabob for two years.

Upon the tenth the Chairs receive him. Mr Grant, who is in the first of them, is very civil; and having asked whether there be any missionary settled at Doolghur, and learnt that there is not, he takes the memorial into his own hand and lays it upon a heap.

It has lasted eleven minutes. The Rajah comes down the steps into Leadenhall Street with his sword under his arm, and stands looking up at the front of the house.

“It is not so large as I had thought,” he says. “I will go home to Hatherley now.”`; }},
    {t:'Give him Mr Paull’s letter, and a horse.', note:() => S.raj.pay ? 'The Company’s allowance stops' : '', go:() => { S.raj.way = 'paull'; S.raj.pay = false; S.raj.ease += 1; add({standing:T('whig') ? 1 : -2}); if (T('whig')) reg('hartopp', 1, 'You gave the Rajah to Mr Paull');
      later('rajahGoes', 1);
      return `Mr Peachey leaves within the hour, without his nuncheon. The Rajah rides to London upon your grey, with Meer Hyder behind him in a chaise, and is gone three weeks.

He comes back with a pamphlet, price two shillings, of which he has been given forty copies. It has a preface by Mr Paull upon the crimes of the Marquess Wellesley, in sixty pages; after which, in four, and in a smaller type, there follows the memorial of Doolghur.

Mr Paull has moved for papers. The motion came on at a quarter before midnight, when there were nine-and-thirty Members in their places; and as forty are wanted to make a House, it was counted out.

“He is a very angry little man,” says the Rajah. “I think he would be angry in any country. But he opened his door.”`; }},
    {t:'Tell him that Mr Peachey is right, and that the Court will write.', go:() => { S.raj.way = 'kept'; S.raj.ease -= 3; later('rajahGoes', 1);
      return `The Rajah bows to you, and then to Mr Peachey; and he puts Mr Paull’s letter into the fire with the tongs.

Mr Peachey stays to dinner, and is helped twice to the beef.

From that day His Highness rides out every morning at six, alone, as far as the fourth milestone, where the Wyvern road falls into the road to London. He sits his horse there for a quarter of an hour by the church clock, with his face to the east; and then he rides home to breakfast.`; }},
    {t:'Present his petition yourself, from your place in the House.', if:() => F('mp'), note:() => S.raj.pay ? 'The Company’s allowance stops' : '', go:() => { S.raj.way = 'house'; S.raj.pay = false; S.raj.ease += 2; add({standing:1}); later('rajahGoes', 1);
      return `You rise at twenty minutes past eleven at night, before one-and-thirty Members and the Serjeant at Arms, and beg leave to bring up the humble petition of Pertaub Sing, Rajah of Doolghur; who, as you tell the House, has been charged by the Company for eleven years as a tributary, and treated in the same years as an ally, and prays to be informed which he is.

The Chairman of the Company, who sits for a Scotch county, says from his place that the matter is before the Court. The petition is ordered to lie upon the table.

The Rajah has heard it from the gallery, between a reporter and a man asleep. In the lobby he asks you what is done with the papers that lie upon the table; and you tell him.

“Then it is the same as with us,” he says. “But you were heard; and my name was said aloud in that room.”`; }},
    {t:'Take him to the Levee. The King likes a farmer.', if:() => T('court') || F('royalKnown'), note:() => '£30' + (S.raj.pay ? '. The Company’s allowance stops' : ''), go:() => { S.raj.way = 'king'; S.raj.pay = false; S.raj.ease += 2; add({money:-30, standing:2}); later('rajahGoes', 1);
      return `The Lord in Waiting has him upon the list as “The Rajah of Dolgar, presented by Mr ${S.sur}”. He goes up the room at St James’s in the green silk and the pearls, between a Russian and a Bavarian; and the King, having come to him, stops.

“Bundelcund? What? Hot. Very hot. What grows there?”

“Wheat, Majesty, and a pea that we call gram. I have seen no gram in Berkshire at all.”

“Wheat! Hear that? Wheat. How many bushels? Any sheep?”

They are twenty minutes at it, while two Ambassadors wait; and at the end the King looks about him for Lord Castlereagh, who has the Board of Control, and who is found behind a pillar.

“See to it, Castlereagh. Good man. Grows wheat.”`; }}
  ]});

ev({ id:'rajahGoes', follow:true, at:'hall', who:() => null, cond:() => rajHere(), title:'Referred to Bengal',
  text:() => { const r = S.raj; r.won = !!r.sum || r.way === 'king'; if (r.ease >= 1) fl('rajPaper');
    return `The answer of the Court of Directors ${r.way === 'kept' ? 'is brought to Hatherley by the post, and is opened at your breakfast table' : 'follows the Rajah down to Hatherley by the post'}. It is upon one sheet.

“Resolved, That the Memorial of the Rajah of Dhoolghur be referred to the Governor-General in Council, for his Report thereon; and that the Rajah be recommended to return to his own Country, where the Pleasure of the Court will in due Time be signified to him through the Resident.${r.won ? ` Resolved further, That ${r.sum ? 'a Doubt having arisen upon the Computation of the Arrears' : 'at the Instance of the Board of Control'}, the Demand upon Doolghur for Tribute be suspended until such Report be received.` : ''}”

The Rajah reads it standing, and gives it to Meer Hyder; who reads it, and folds it, and puts it into the tin box.

“Six months to Calcutta. A year for the Governor-General to write his report, for he is a new one, and must first be told where Doolghur is. Six months to London, and six to Calcutta again. I came fifteen thousand miles to give a letter to a man; and the man has put it in the post.”

His passage is taken in the Walmer Castle, which sails from Portsmouth with the fleet. ${r.ease >= 3 ? `Upon the last evening a box is carried into the drawing-room, out of which the moonshee lifts two shawls of Cashmere, such as Bond Street asks eighty guineas for, and lays them ${hh('across Henrietta’s lap', 'across the sofa, for the lady who is at Bath')}.` : r.ease >= 0 ? `Upon the last evening he walks once round the park with you, and names the trees.` : `Upon the last evening Meer Hyder comes to the library with a bag, and counts out upon your table, in gold mohurs, the whole of what ${r.paid ? 'the Court of Directors has paid for His Highness’s board' : `His Highness’s people and horses have cost you by ${steward()}’s book`}, to the odd shilling; for the Rajah, as he tells you, desires to owe nothing in Berkshire to anybody but a horse.`}${r.ease >= 1 ? `

There is besides a paper, in the Persian character, sealed with the Rajah’s own seal. He lays it upon the hall table; and all that he will say of it is, that you are to have it read to you upon the day you find a man who can.` : ''}`; },
  choices:[
    {t:'Ride with him to Portsmouth, and see him into the boat.', note:'£15', go:() => { const r = S.raj; r.st = 'gone'; r.out = S.t; add({money:-15 + rajBack(), family:r.ease >= 3 ? 3 : 0}); if (r.ease >= 3) reg('henrietta', 1, 'The Rajah’s shawls'); later('rajahWrites', 9);
      return `You are two days upon the road, he riding and you riding beside him; and at every stage he gets down before the ostler can come, and looks at the horse’s feet himself.

Of the eleven brass vessels nine are empty, and are sold to a brazier upon the Hard at Portsmouth for old metal. The two which remain go down the Sally Port steps in the cook’s arms, one at a time, and are stowed in the stern of the boat under a cloak.

The Rajah gives you his hand, in the English manner, and holds it somewhat longer than is English.

“You have one village, Mr ${S.sur}. Keep it.”

The cook is the last man into the boat.`; }},
    {t:'Take leave of him upon your own steps.', go:() => { const r = S.raj; r.st = 'gone'; r.out = S.t; add({money:rajBack(), family:r.ease >= 3 ? 3 : 0, goodwill:1}); if (r.ease >= 3) reg('henrietta', 1, 'The Rajah’s shawls'); later('rajahWrites', 9);
      return `The household stands upon the steps in order of wages. The Rajah goes down the line with Meer Hyder at his elbow, and into every hand, from the butler’s to the boy’s who cleans the knives, he puts a gold mohur.

Mrs Bunce has two. She has besides, from the cook in the red turban, with whom in all these months she was never known to exchange a word, a jar of pickled mangoes, sealed with wax, and a receipt for it in a character which nobody at Hatherley can read.

She is seen to curtsey. It is the first time, by the reckoning of the servants’ hall, since your uncle’s funeral.

The three chaises go down the avenue at a walk, with the wagon behind them; and the rooks, which have had a year to grow used to a green silk coat, do not get up.`; }},
    {t:'Ask him, before he goes, what he will tell them of England.', go:() => { const r = S.raj; r.st = 'gone'; r.out = S.t; add({money:rajBack(), family:r.ease >= 3 ? 3 : 0}); if (r.ease >= 3) reg('henrietta', 1, 'The Rajah’s shawls'); later('rajahWrites', 9);
      return `He has it ready; for it seems that Meer Hyder has kept a book.

“That the English are just in their courts of law, and in their offices are not to be found. That they eat every day as a Rajpoot eats upon the morning of a battle. That they do not beat their servants, and do not speak to them. That they are always glad of rain. That a gentleman among them may have one village, and sit as a judge, and be asked his opinion of the King’s ministers; and that I, who have four hundred, was a year in the country before any man but one would hear mine.”

He draws on his gloves.

${r.ease >= 1 ? `“And that there is a house in Berkshire with fifty-four windows, where the door was open. Meer Hyder has the name of it written down.”` : `“And that the prison was a large one, with a park, and that the gaoler was civil. Meer Hyder has the name of it written down.”`}`; }}
  ]});

ev({ id:'rajahWrites', follow:true, at:'hall', who:() => null, cond:() => !!S.raj && S.raj.st === 'gone', title:'By the Fleet from Calcutta',
  text:() => { const r = S.raj;
    return `The letter has been eleven months upon the water, and has cost four shillings and tenpence. It is in the moonshee’s hand, and signed with a seal.

“Doolghur, the 4th of the month of November.

Sir, By the favour of God His Highness came to his own gate upon the one hundred and sixty-first day from Portsmouth, in good health; and Meer Hyder likewise, who is too old for any more ships.

His Highness could not enter his house. A Hindoo who has crossed the black water is unclean; and the Brahmins of Doolghur, having sat nine days upon the question, found that he must be born a second time, out of a cow. A cow was accordingly made of beaten gold, large enough for a man to creep through. His Highness crept through. The cow was then divided among the Brahmins, and weighed two thousand three hundred rupees. Meer Hyder begs leave to observe, that a Mussulman comes ashore for nothing.

${r.won ? `The pleasure of the Court has been signified through the Resident. The arrears are struck off. His Highness is declared an Ally of the Honourable Company, and pays nothing; and the Resident, who dines with him twice in the week, has asked for a larger house.` : `The pleasure of the Court has been signified through the Resident. The question, whether Doolghur be an Ally or a Tributary, is reserved for further consideration; and in the mean time the tribute is to be paid as before, without prejudice to either opinion.`}

${r.plough ? `The two ploughs from Reading are arrived, and one is put together. The ryots come nine miles to look at it. ` : ''}His Highness desires to have from Hatherley a bull and two heifers, of the red breed that stood under your elms; and encloses a bill upon Messrs Porcher, in Devonshire Square, for two hundred guineas. They are not to be eaten.

Sealed by order, Meer Hyder.”`; },
  choices:[
    {t:'Send the cattle, and present the bill.', note:'+£210 by the bill. The beasts and their freight, £120', go:() => { add({money:90, goodwill:1});
      return `A bull and two heifers are walked to Portsmouth in nine days by Tom Deacon, the cowman’s second boy; and as nobody at the India House can say what a heifer eats between the Downs and the Hooghly, Tom Deacon is shipped with them, at twelve shillings a month, and forty trusses of hay.

Fourteen months pass. Then a letter comes to the cowman, which the curate reads out to him in the yard.

“Dear Father, The Bull is well and has a man to fan him. One heffer died off the Cape. I have 20 Roopees a month and a Horse and a man to hold the Horse. Tell Mother I shall not be home for harvest. Your son, T. Deacon.”`; }},
    {t:'Send the cattle as a gift, and send back the bill.', note:'£120', go:() => { add({money:-120, standing:1});
      return `You write that the red cattle of Hatherley were never yet sold to a guest; and the bull goes down to Portsmouth with the bill of Messrs Porcher pinned to his halter, in a cover, uncashed.

By the next fleet but one there is a box at the lodge, which has been a year upon the road, and wants two men to lift it. It holds the skin of a tiger, ten feet four inches from the nose to the tail, with the claws on.

It is laid down before the library fire. The spaniels, which have slept upon that hearth every evening of their lives, lie from that night in the hall.`; }},
    {t:'Write that the breed is not to be spared, and wish him well.', go:() => {
      return `You send back the bill, with your compliments; and you write that the herd is low, the season backward, and the voyage long.

No answer comes by the next fleet, nor by the next. The yellow of Bundelcund is still to be found in the great atlas, south of the Jumna; and somebody has put a small cross upon it in pencil, to show where Doolghur ought to be.`; }}
  ]});

/* ================= II. The Persian Envoy ================= */

const mzMet = () => rajHere() || (S.raj && S.raj.st === 'gone');
const mzAfter = () => { later('mirzaStar', 1); };

ev({ id:'mirzaComes', follow:true, at:'hall', who:() => null, cond:() => S.year <= 1811 && !S.flags.mz, title:'The Persian Prince',
  text:() => `An express rides in from Oxford on Saturday morning, upon a horse that has been changed at Abingdon and at Ilsley.

“Oxford, Friday night.

Sir, His Excellency Mirza Abul Hassan, Envoy Extraordinary from the King of Persia, has this week seen Lord Grenville installed Chancellor of the University; and goes down on Monday by Newbury and Winchester to Portsmouth, where the Lion waits to carry him home, and me with him as Ambassador. He has eight servants, and will not lie at an inn, since the landlord at Woodstock showed him to the town through the coffee-room door at sixpence a head.

${mzMet() ? `Your name was given me at the India Board, as that of a gentleman who had the Rajah of Doolghur a year under his roof, and returned him alive.` : `Your house, I am told, stands upon my road, and has stabling for twenty; and the Bishop’s does neither.`} May I beg a night’s lodging for him?

I should tell you two things. The newspapers call him the Persian Prince. He is no prince; Mirza, set before a name, signifies only that a man can write; and he is weary of explaining it. And in Persia a guest of rank is met upon the road, the distance being the measure of the respect. When he came into London, in December, nobody met him at all; and he has kept the day of the month.

I am, Sir, your faithful servant, Gore Ouseley.”

By noon it is known in Wyvern that the Persian Prince is to sleep at Hatherley; and by two the saddler has sold a side-saddle which had hung in his window since the peace. ${hh(`Henrietta has had the yellow room turned out, and has sent to ask the express, who is at his beer in the kitchen, whether a Persian sleeps in a bed.`, `Mrs Bunce has had the yellow room turned out; and the express, who is at his beer in the kitchen, has been asked whether a Persian sleeps in a bed.`)}`,
  choices:[
    {t:'Ride out to the fourth milestone with every tenant who has a horse, and bring him in.', note:'£20', go:() => { fl('mz', 2); add({money:-20, goodwill:2, standing:2}); mzAfter();
      return `You muster three-and-twenty: the tenants upon their market cobs, Mr Hartopp upon a thoroughbred which he has never before been seen to trot, and Mudge, in his velveteen, bringing up the rear upon the cart mare.

The carriages stop at the milestone. A tall man gets down from the second of them, in a coat of crimson cloth and a high cap of black lambskin, with a beard that reaches his sash. He looks along the line from one end to the other; and it is plain, from his lips, that he is counting.

“In London, nobody. Here, twenty-three. I shall write it in my book.”

He then walks down the rank, and looks at the horses, and at none of the men. Before the cart mare he stops. Her mane is upon her shoulder, and her tail, which no groom was ever paid to dock, sweeps the road.

“This is the first horse I see in England,” says the Envoy, “that is left as God made him.”

He rides her to the Hall, with Mudge walking at the stirrup.`; }},
    {t:'Receive him at your own door, as you would a bishop.', go:() => { fl('mz', 1); add({standing:1}); mzAfter();
      return `The carriages come up the avenue at six. You stand in the door; and as the Envoy does not move from his seat, and Sir Gore says something to him in Persian without turning his head, you come down the steps, of which there are seven.

He gets out then. He is a tall man, in crimson cloth, with a beard to his sash; and he looks from the bottom step to the top one, and up at the house, before he gives you his hand.

His own cook dresses a pillaw in the kitchen, which he sends round to you first. At table he eats with his right hand and talks with his left; and he tells ${hh('Henrietta', 'you')}, in an English that he has had only since Christmas, that the English are the one people he ever met who are glad when it rains.

Sir Gore, lighting you up to bed, mentions that seven is thought a respectable number.`; }},
    {t:'Ask the county to dinner to look at him.', note:'£35', go:() => { fl('mz', 1); add({money:-35, standing:3}); reg('cullerne', 1, 'Dined with the Persian at your table'); mzAfter();
      return `Thirty sit down, and nineteen more are found to have called by accident between five and six. The Envoy is put between Lady Cullerne and Mrs Tamworth; and for the length of two courses the whole table watches him eat.

It is Lord Cullerne who speaks first, and across him.

“How many wives has he got, Ouseley? Ask him.”

The Envoy has had this from two royal dukes and a bishop, and wants no interpreter.

“One, my lord. In Persia a man may have four, if he can keep peace among them. In England, they tell me, he may have one; and it is the same difficulty.”

His lordship laughs until he is obliged to be thumped. Lady Cullerne does not laugh; and Mrs Tamworth, who has been leaning a little forward since the soup to learn whether the beard be all his own, sits back.

When the ladies are gone the Envoy takes out a small book, and writes in it from the right hand to the left, looking round the table between the lines.`; }},
    {t:'Meet him upon Parson, and give him the pick of your stable for the last four miles.', if:() => T('hunt'), go:() => { fl('mz', 3); add({standing:2}); mzAfter();
      return `He will have none of your hunters. He goes down the stalls with his hands behind him, saying in English, at each, “Cut. Cut. Cut”; and at the end of the stable he finds the three-year-old, which is not yet broke to hounds, and has all its tail.

His people shorten the leathers by nine holes. He rides with his knees as high as the colt’s withers, at a gallop from the first stride; and at the park paling, where there is a gate standing open, he puts the colt at the rails.

You follow upon Parson, as you followed at Marsh Benham. Sir Gore Ouseley goes round by the gate.

“In Persia,” says the Envoy, pulling up under your windows, “the Shah gives a village for such a horse. I have no village here. I shall think what I have.”`; }},
    {t:'Give him Hafiz after dinner, in Sir William Jones’s English.', if:() => T('oxford'), go:() => { fl('mz', 3); add({family:1}); mzAfter();
      return `It is the one thing that you brought away from Oriel, where you learnt it in a term in which you should have been reading Aristotle. When the cloth is drawn you stand up with your glass.

“Sweet maid, if thou would’st charm my sight, and bid these arms thy neck infold; that rosy cheek, that lily hand, would give thy poet more delight than all Bocara’s vaunted gold, than all the gems of Samarcand.”

The Envoy has heard you with his eyes shut.

“It is very pretty. It is not Hafiz. I am born in Shiraz, where he is buried. Now hear him.”

He gives the same lines in Persian, and after them forty more couplets, with his hand moving upon the cloth; and Sir Gore Ouseley, who has had seven months of English dinners, is seen to wipe his eyes.

The candles are snuffed twice. Nobody at the table understands a word, and nobody leaves it.`; }},
    {t:'Have up the ’75, and learn whether a Persian drinks.', if:() => T('bottle'), go:() => { fl('mz', 2); add({family:-1}); mzAfter();
      return `Sir Gore coughs when the decanter is set down. The Envoy looks at it, and then at you.

“The Prophet forbids. My physician in Mansfield Street commands. I am a traveller, and I obey the one that is nearer.”

He drinks with you glass for glass until two in the morning. In his own town of Shiraz, as he tells you, they make a red wine, upon which a poet was drunk for forty years; but they have not the art of keeping it, and he would give a great deal to know how a wine is made to wait five-and-thirty years for a guest.

At six he is in the saddle, and has ridden twice round the park. You come down at eleven.`; }}
  ]});

ev({ id:'mirzaStar', follow:true, at:'hall', who:() => null, cond:() => !!S.flags.mz && !agha(), title:'Paid Through from Portsmouth',
  text:() => { const m = S.flags.mz;
    return `The Portsmouth coach sets down at your lodge a deal box, corded and sealed, and one inside passenger; who has been booked through from the Point, as the guard says, with the fare paid, and nothing to find upon him but the porterage of the box.

He is a small man of fifty, with a smooth face, in a long coat of blue cloth lined with fur, and a cap of black lambskin. He bows to you with his hand upon his breast; and he holds out a letter, keeping a second and a smaller paper behind it.

In the box, folded in a shawl, there lies a star of silver, the breadth of a saucer; upon which a lion is done in enamel, with the sun rising over his back, and in the sun a face.

“His Majesty Ship Lion, at Spit Head, 17 July.

Sir my friend, I am seven month in England, and I sleep in many house of lords; but ${m >= 3 ? 'only in your house the master do a thing that I shall tell to the King' : m === 2 ? 'only in your country the master ride out on the road to bring me in' : 'your house I remember, and the seven steps'}. The King of Kings my master, when I go from Tehran, put in my hand four Suns, and say, Leave them in England with such men as use my servant well. Three I have give to lords in London. The four is for you. Wear him on the left side.

Also I send Aga Firooz. He keep my house in Shiraz twelve year; and in London he keep my purse, and he is the one of my people that the London shopman never cheat. He is of that servant which you have not in England, that are made so when children to keep the inner house of great men, and are not husband and not father ever; and I think the English house is worse kept for the want. He will not go in the ship. From Smyrna to Plymouth he is like one dying; and he say that he fear the sea more than he fear God, which is a wicked word. I cannot carry him, and I will not leave him in the street. I give him to you, as in Persia a friend give a horse.

Abul Hassan.”

The passenger waits until you have done; and then he puts the second paper into your hand. It is in French, in a small upright character, and numbered.

“1. Aga Firooz is not a horse. 2. He learnt in Mansfield Street, of the footman, that there are no slaves in England; and he has had it confirmed by an attorney, at a cost of six shillings and eightpence. 3. He will serve Monsieur faithfully, having no other place to go, for forty pounds by the year, a room with a fire in it, and leave to keep his own fasts. 4. He understands the accounts of a house, the keeping of keys, the making of sherbets and conserves, and four languages; of which French he had in five months from the people of General Gardane, at Tehran. 5. He has as yet no English.”

You are a justice of the peace, and know the second article to be good law.${T('trade') ? `

${F('ledgersSent') ? 'Your father’s ledgers are gone from the cupboard behind you; but you have them by heart' : 'Your father’s ledgers stand in the cupboard behind you'}. There is a page in the third of them upon which a man is entered between a hogshead and a mule, with his name, which was Scipio, and his price; and it is some time before you find that you can look up from the paper.` : ''}`; },
  choices:[
    {t:'Engage him upon his own terms, and give him the charge of the house.', note:'£40 a year in wages', go:() => { fl('agha', 'house'); add({family:1}); later('mirzaLicence', 1);
      return `“Quarante livres,” you say, in such French as you have; “et du feu.”

He bows, and asks to be shown where the candles are kept.

By Michaelmas he has counted the linen, the plate and the tea. He has found that the Hall burns eleven dozen of candles in a quarter, and has for some years paid for fourteen; and the difference being traced to the chandler’s cart, it is mended without a word said to anybody, by the method of weighing every box upon the back-door step before the carter is suffered to unload.

He is seen in the village in his fur and his lambskin, walking slowly, with a string of beads. The Bell, having sat upon the question for three evenings, finds him to be some sort of Turkey bishop. His name will not go into a Berkshire mouth at all; and by the first frost Hatherley has settled to call him Mr Furze.`; }},
    {t:() => `Engage him, and put him into the estate office with ${steward()}.`, note:'£40 a year in wages', go:() => { const skim = F('crabbeSkims') && !F('crabbeGone') && !T('figures'); fl('agha', 'office'); if (skim) { fl('crabbeSkims', false); reg('crabbe', -1, 'You set a Persian over his books'); } later('mirzaLicence', 1);
      return `${steward()} receives him with a bow, and gives him the tithe book of the year ’92 to copy, as a thing which cannot well be spoiled.

Within the month there is a second book in the office, ruled by Aga Firooz with his own hand, in which the figures run from right to left; and into this, sitting upon his heels on the window seat with the book on his knee, he enters every load that crosses the yard.

${skim ? `Nothing is said by either. But the line of “Sundries”, which has stood in ${steward()}’s quarterly account at five-and-forty pounds for as long as you have had the estate, is found at Christmas to have fallen to nothing.` : `Nothing is said by either; and at Christmas the two books agree to a shilling, which ${steward()} mentions to you three times.`}

The village cannot say his name. The carters, who see him daily, have made it Mr Furze; and the parish has followed the carters.`; }},
    {t:'Tell him that he is nobody’s to give, and put ten guineas into his hand.', note:'£10 10s', go:() => { fl('agha', 'free'); add({money:-10.5, goodwill:2}); if (T('whig')) reg('hartopp', 1); later('mirzaLicence', 1);
      return `You say it in French, and badly; and then, the French giving out, you open the hall door, and show him the avenue, and the road beyond it.

He stands some time looking at the road. It is raining. He asks whether there be a town; and being told four miles, he ties the ten guineas into a corner of his sash, takes up his bundle, and walks to it.

By Christmas there is a card in the stationer’s window at Wyvern.

“AGA FIROOZ, late of Shiraz, teaches the PERSIAN Tongue to young Gentlemen intended for the Honourable Company’s Service. Also Accompts. Terms, One Guinea the Quarter. Enquire over Mr Budd’s, Saddler.”

He has three pupils, of whom Mr Tamworth’s second boy, who has a writership for Bengal, is one. Wyvern cannot say his name any better than Hatherley could; and Mr Budd, whose lodger he is, has made it Mr Furze.`; }}
  ]});

ev({ id:'mirzaLicence', follow:true, at:'hall', who:() => null, cond:() => !!agha() && !S.flags.lion, title:'The Lion and the Sun',
  text:() => `You have worn the star once, at your own table; upon which occasion Lord Cullerne had it off your coat, and carried it to a candle.

“A lion. And the sun gettin’ up behind him, with a face like a dairymaid. What did you do for it?”

“I gave a man a bed, my lord.”

“Cheap. Mine cost me two boroughs.”

His lordship has since mentioned it in town; and there comes by Thursday’s post a letter from the Heralds’ College, to the effect following. That no subject of His Majesty may accept or wear the Order of a foreign Prince without the Royal licence. That the fees upon such licence, with the entry of it at the College, are thirty-eight pounds fourteen shillings. That the Order of the Lion and Sun having been instituted but two years, and never before borne by a private gentleman in this kingdom, the College are not prepared to say upon which side of the coat it goes. And that as to the further question, whether the wearer of it be a knight, the College would be obliged if it were not put.`,
  choices:[
    {t:'Pay the fees, and wear it to the Assize ball.', note:'£39', go:() => { fl('lion', 'worn'); add({money:-39, standing:3});
      return `The Gazette has it upon a Tuesday, between a bankrupt and a Commission of Sewers. “The King has been pleased to grant unto ${S.name}, of Hatherley Combe in the County of Berks, Esquire, His Majesty’s royal Licence and Permission, that he may accept and wear the Insignia of the Persian Order of the Lion and Sun.”

At the Assize ball you wear it upon the left side. The Judge, who has only a knighthood, asks leave to look at it through his glass; and the High Sheriff’s lady desires to be told whether the face in the sun be a portrait.

${held('knight') || held('baronet') ? `The county, which had learnt to call you Sir upon one ground, finds that it has now two, and is easy.` : `Two of your own tenants, who are in the gallery with their wives, are heard to speak of you before midnight as Sir ${S.name.split(' ')[0]}; and you do not go up to correct them.`}`; }},
    {t:'Wear it at your own table, and ask nobody’s leave.', go:() => { fl('lion', 'home'); add({family:1});
      return `The Heralds have their letter back, with your compliments, and no draft in it.

You wear the star upon Sundays, and upon the King’s birthday, within your own walls. It is the breadth of a saucer; and you learn in a month to carve without leaning over the dish.

Aga Firooz, the first time that he sees it upon you, ${aghaIn() ? 'says nothing. But on the Saturday night your coat is found laid out, with the Sun unpinned from the right breast, where you had put it, and pinned upon the left; and beside it there is a saucer of whiting, and a rag' : 'bows to it before he bows to you; and he begs leave, in French, to observe that Monsieur has put the Sun upon his right side, where in Persia it is worn only by the dead'}.`; }},
    {t:'Give it to Henrietta, who has asked twice.', if:() => !F('henriettaAway'), go:() => { fl('lion', 'hen'); add({family:3, standing:1}); reg('henrietta', 1, 'She wears the Sun of Persia');
      return `She wears it at the Wyvern assembly, in the front of a turban of silver muslin; and she stands up in the first set with a lion between her eyebrows.

Lady Cullerne looks at it through two dances. Mrs Tamworth, who looks at it through four, is able by supper to say what it weighs.

At the next assembly there are five suns in the room. Four of them are of paste, and had of a jeweller in Reading at eighteen shillings; and the Heralds’ College, which has written to you a second time upon the subject of fees, has not yet thought of writing to Henrietta.`; }},
    {t:'Fold it in its shawl again, and put it by.', if:() => F('henriettaAway'), go:() => { fl('lion', 'by');
      return `It goes into the drawer of the library table, in its shawl, beside your commission as a Deputy Lieutenant and a lock of somebody’s hair.

The Heralds write a second time, and are not answered. Upon wet afternoons you take the star out, and turn it to the window; and the face in the sun, which Lord Cullerne called a dairymaid’s, looks at you with great composure.`; }}
  ]});

/* ================= III. Mr Furze ================= */

ev({ id:'aghaKeys', from:1811, to:1815, weight:34, at:'hall', who:() => null, cond:() => agha() === 'house' && !F('aghaKeys'), title:'Nineteen Keys',
  text:() => `Mrs Bunce has carried the keys of Hatherley at her waist for six-and-twenty years. There are nineteen of them; and Aga Firooz has never asked her for one.

He has had a second set cut by the smith at Wyvern, at a shilling the key, out of his own wages. Every store in the house is in consequence counted twice in the week, by two persons who have not a word of any language in common; and the tea, which used to last the Hall five weeks, has lately lasted seven.

This morning Mrs Bunce came down to the kitchen at ten in her bonnet and her pattens, sat down in them beside the fire, and has not since stirred; which the maids, who have seen it once before, in the year of the under-butler, understand to be warning.

Aga Firooz is in the passage, with his beads. He has the look of a man who is prepared to wait until Lady Day.`,
  choices:[
    {t:'The keys are Mrs Bunce’s. Have his set brought to you.', go:() => { fl('aghaKeys'); fl('aghaKeysUp'); add({family:1});
      return `He lays the nineteen keys upon your table in the order of their size, and beside them a paper.

It is in two columns, of which the first is the consumption of tea, sugar, soap and candles in the month before he came, and the second the same for the month last past; and at the foot of it, in French, there is written, “Difference, by the year, sixty-four pounds.”

He bows, and goes out.

Mrs Bunce takes off her bonnet at noon. The tea is found by Easter to be lasting five weeks again; and nothing is said about it by anybody.`; }},
    {t:'Let both sets stand. It is the cheapest audit in Berkshire.', go:() => { fl('aghaKeys'); add({family:2});
      return `Mrs Bunce wears her bonnet in the kitchen for three days, and cooks in it.

Upon the fourth morning a saucer is found upon her dresser, with a conserve of quinces in it, coloured like a garnet, and a spoon. By the evening the saucer is back in the passage, empty and washed.

On the Saturday a raised pork pie is left at his door. He cannot eat it; and he is seen to carry it, in both hands, the whole length of the avenue to the lodge-keeper’s children. The following Saturday it is a seed cake.

The keys go on as before, by two and two.`; }},
    {t:'Divide the house at the baize door: above stairs to him, below to her.', go:() => { fl('aghaKeys'); add({family:1});
      return `He has nine keys, and she has ten. From that day he is never seen below the green baize door, nor she above it.

The linen comes up, and the candle-ends go down, upon a Monday at ten; when the two of them meet at the sill, each with a list, and exchange across it without a word, like the cartel ships at Morlaix.

It is observed by the footmen that each list is always right.`; }}
  ]});

ev({ id:'aghaBooks', from:1811, to:1815, weight:30, at:'home', who:() => null, cond:() => aghaIn() && !F('aghaBooks'), title:'Fish-hooks',
  text:() => `${steward()} has a book under his arm which is not his own; and he lays it open before you at the page for October.

“I cannot audit this, sir. I should be sorry to be thought to reflect upon a person who was recommended to you by an Ambassador; but I have had the curate to this, and the exciseman, and Mr Tidmarsh’s clerk; and they are all three of my opinion, that the figures in it run from the right hand, and resemble fish-hooks. A book which no Christian can read, sir, is a book which no Christian can audit.”

It is the ${agha() === 'house' ? 'house book' : 'yard book'} of Aga Firooz. Every line of it is ruled; and at the foot of each page stands a total, in red.`,
  choices:[
    {t:'Have Aga Firooz learn English figures.', go:() => { fl('aghaBooks'); reg('crabbe', F('crabbeGone') ? 0 : 1);
      return `He has them in a week. They are, as he explains in French to ${kittyHome() ? 'Kitty' : 'the curate'}, his own country’s figures, which the Franks had of the Arabs some hundreds of years ago, and have ever since written the wrong way about.

${steward()} is not informed of this. He examines the first English page with his spectacles pushed up, finds a seven which he says is foreign, and pronounces the rest tolerable.`; }},
    {t:'Let both men keep their books, and cast one against the other at Christmas.', go:() => { const skim = F('crabbeSkims') && !F('crabbeGone') && !T('figures'); fl('aghaBooks'); if (skim) { fl('crabbeSkims', false); reg('crabbe', -2, 'A Persian found his Sundries'); add({money:45}); }
      return skim ? `At Christmas the two totals are read out in the library, one after the other. They differ by forty-five pounds.

${steward()} asks leave to look into it. He is gone two days; and upon the third he comes up with the forty-five pounds in notes of Tidmarsh’s bank, which he has found, as he says, in the lining of an old cash book.

The line of “Sundries” does not appear in his account again. Aga Firooz, to whom the matter is explained in French, enters the sum upon his right-hand page, and rules it off in red.`
        : `At Christmas the two totals are read out in the library, one after the other. They differ by fourpence.

The fourpence is hunted for nine days through both books, and is run down at last upon the fourteenth of August; where ${steward()} has a blot, and Aga Firooz has a sack of nails.`; }},
    {t:'Sit down with Aga Firooz, and learn the fish-hooks.', go:() => { fl('aghaBooks'); add({family:1});
      return `It takes three evenings. The hooks are no figures at all, but the Arabic words for the numbers, written short and run together, as a clerk in a hurry signs his name; and by the third night you can read a butcher’s bill from right to left, and find it restful.

${steward()}, coming up on the Friday with the rent roll, discovers his master and the Persian at one table, with one candle, and the house book between them.

He stands in the door until he is spoken to; and it is noticed that from that week he adds every column twice.`; }}
  ]});

ev({ id:'aghaReads', from:1811, to:1815, weight:36, at:'hall', who:() => null, cond:() => !!agha() && F('rajPaper') && !S.flags.rajDeed, title:'What the Rajah Wrote',
  text:() => `The Rajah’s paper has lain five years in the library drawer, under his seal, for want of anybody in Berkshire who could read the Persian character.

${aghaIn() ? 'Aga Firooz is sent for.' : 'You carry it to Wyvern, and up the stair over Mr Budd’s.'} He looks first at the seal, and reads from it, “Pertaub Sing, the servant of Ram.” He then reads the paper through twice to himself; and having asked leave to sit, which he never did before, he puts it into French, a line at a time, for ${kittyHome() ? 'Kitty' : 'the curate'} to put into English.

“Be it known to the officers, present and to come, of the district of Doolghur. The village of Peeplee, with its tank, its eleven wells, and its grove of mango trees, yielding by the year nine hundred rupees, is given free of rent to the English chief ${S.name}, Bahadur, of Hatherley, and to his heirs, for as long as the sun and the moon shall last; he sending every year to Doolghur one hawk.”

Nine hundred rupees are a hundred and twelve pounds ten shillings. The village is fifteen thousand miles off, in a province which the Company governs; and you have been five years in arrear of your hawk.`,
  choices:[
    {t:'Write to the India House, and ask how a Berkshire gentleman is to collect nine hundred rupees in Bundelcund.', go:() => { fl('rajDeed', 'asked'); fl('rajDeedT', S.t);
      return `You enclose a copy of the grant, in English, with Aga Firooz’s copy of the Persian pinned behind it; and you put the question in eleven lines.

${steward()}, who has been five years without a new farm to enter, opens a page for Peeplee in the rent roll, between Kennet Bottom and Long Barrow. He rules it, and writes at the head, “Tenant unknown. Rent, 112l. 10s. Arrears, five years.”

There is nothing to be done now but to wait for the Secretary.`; }},
    {t:'Send the hawk.', note:'£9', go:() => { fl('rajDeed', 'hawk'); add({money:-9});
      return `Lord Cullerne’s falconer has a young peregrine, taken last summer from the cliff at Culver, for which he asks eight guineas. She goes down to Portsmouth upon the fist of the falconer’s boy, hooded, in the basket of the coach; and she is put aboard an Indiaman with forty live pigeons for her passage.

You write to the Rajah, by the same ship, that the bird is for the year 1806; and that the other four shall follow as hawks are to be had.

Of Peeplee you say nothing. Aga Firooz, who sealed the letter, tells ${kittyHome() ? 'Kitty' : 'the curate'} in French that it is the answer of a prince.`; }},
    {t:'Frame it, and hang it in the justice room.', go:() => { fl('rajDeed', 'hung'); add({goodwill:1});
      return `It hangs between the table of penalties under the Game Acts and the map of the hundred; and every man who is brought before you has it to look at while Mudge gives his evidence.

Jem Pryor has it for the better part of a morning.

“What be that, sir?”

“A deed, Pryor. I have a village in India.”

He looks at the seal for some time, and then at you.

“Any hares, sir?”`; }}
  ]});

/* Two pieces for the county and the clergy, one for Henrietta, and the pocket-book. */
COUNTY.push({id:'county-furze', hot:true, once:true, title:'Sixty Pounds and a Fire', w:() => aghaIn() && S.year >= 1811, x:() => `Aga Firooz brings you a letter upon a salver, and stands while you read it. It is to himself, in the French of the Miss Tamworths’ governess, and is signed by their father.

Mr Tamworth, having dined at Hatherley in March, and counted the candles, begs to inform Monsieur Firooz that there is a place for him at Marsh Court, at sixty pounds by the year; with a fire, a horse upon Sundays, and the entire direction of eleven children’s linen.

The Persian has broken the wafer, read the letter, and brought it straight to you; and this, as you are both aware, no English servant living would have done.`,
  o:[{t:'Give him sixty.', note:'£20 a year more', go:() => { fl('aghaSixty'); add({family:1});
    return `“Soixante,” you say.

He considers it. He then tells you, with a bow, that Monsieur mistakes him; that he showed the letter because it was Monsieur’s right to see it, and for no other reason; and that he will take the sixty, since it is offered, and since Monsieur Tamworth has fixed the price.

Mr Tamworth has his answer by the groom. It is in one line of very good French; and the governess, who is obliged to read it to him, is seen to read it twice.`; }},
  {t:'Tell him that he is free to go where he is better paid.', go:() => { add({family:2});
    return `He hears you out, and folds the letter into four.

“Eleven children,” he says, in French, “and no order. Monsieur Tamworth burns tallow in his dining room, and wax in his kitchen. I have seen it from the door.”

He stays for the forty pounds. The letter goes into the library fire, by his own hand; and the next time the Tamworths dine at Hatherley it is observed that there is one candle fewer upon the table than there are guests.`; }},
  {t:'Ride over to Marsh Court, and ask Mr Tamworth what he means by it.', go:() => { add({standing:T('lawsuit') ? 1 : -1});
    return `Mr Tamworth receives you in the gun room, and is not at all ashamed. A man, he says, may bid for his neighbour’s servant as he may bid for his neighbour’s horse; and he had understood that the Persian came to Hatherley by the coach, as a present, and cost nothing.

${T('lawsuit') ? `You remind him that there is already one cause between your two families, which is fifty years old, and concerns a pew; and that your attorney would be glad of a second. He does not write to Aga Firooz again.` : `You ride home no better pleased than you came. But Aga Firooz, who has had the whole from the groom before you are out of the saddle, is at the door to take your hat; and he has put on, for the first time since the Envoy sailed, his coat with the fur.`}`; }}]});

CLERGY.push({id:'clergy-acts', hot:true, once:true, title:'The Eighth Chapter of Acts', w:() => aghaIn() && S.year >= 1811, x:() => `Mr Twisleton, the Rector of Wyvern, has been thirty years in orders without meeting one of the persons spoken of in the eighth chapter of the Acts; and having learnt at the Book Society that there is such a person at Hatherley, keeping the keys, he has driven over in his gig with a Greek Testament and a bottle of water from his own font.

His text is ready; and as nobody has asked him for it, he gives it out in the hall. “See, here is water; what doth hinder me to be baptized?”

${vicar()}, in whose parish Hatherley lies, has followed him up the avenue on foot; and he has a text likewise, which is out of Deuteronomy, the twenty-third chapter and the first verse, and is to a contrary effect.

The two clergymen are in your hall. Aga Firooz, about whom they are disputing, has brought them each a glass of sherbet, and withdrawn.`,
  o:[{t:'Let Mr Twisleton put his question.', go:() => { add({standing:1});
    return `It is put in the library, in Greek, and afterwards in Latin; and at last, the curate being sent for, in French.

Aga Firooz answers that he is sensible of the Rector’s goodness. He was made a Mussulman at the age of seven, at the same hour and by the same hand that made him the other thing; he has never been asked his opinion of either; and he would prefer, if it be the same to the two gentlemen, to remain as he is in both respects.

Mr Twisleton drives home with the bottle uncorked. He is heard to say at the next Book Society, that the fellow has more theology than the Archdeacon.`; }},
  {t:() => `Leave it to ${vicar() === 'The Vicar' ? 'the Vicar' : vicar()}. It is his parish.`, go:() => { if (!F('gallDead')) reg('gall', 1, 'You left the Persian to him');
    return `${vicar()} takes the Rector by the arm, and walks him back down the avenue to his gig; and they are seen from the windows to stop four times, at Deuteronomy, at Isaiah, at the Acts, and at the lodge.

Aga Firooz sits upon Sundays in the servants’ pew, at the end next the door, with a small book of his own, which he reads from the back. He stands when the parish stands. ${vicar()}, who can see the book from the pulpit, has never asked what it is.`; }},
  {t:'Send them both away. A man’s soul is not a matter for the hall.', go:() => { add({standing:-1, family:1});
    return `They go, the Rector by the avenue and ${vicar() === 'The Vicar' ? 'the Vicar' : vicar()} by the shrubbery; and each of them, upon the following Sunday, preaches at you.

Aga Firooz clears away the two glasses. In the evening there is found upon your dressing table a paper, in French.

“Monsieur was not obliged. In Shiraz I was disputed for by two mollahs, in the same manner, for nine years; and the master of the house charged them each for the coffee.”`; }}]});

HENRIETTA.push({id:'henrietta-tent', kind:'want', ta:'Let her have the tent.', tb:'A divan and the cushions; no tent.', sum:60, w:() => !!agha() && S.year >= 1811, x:() => `Henrietta has a number of Mr Ackermann’s Repository open at a coloured plate.

“A Persian Tent Room. The walls and the ceiling in striped calico, gathered to a rose; a divan; eleven cushions. Lady Cullerne has had nothing Persian since the Envoy sailed, and we have a Persian in the ${agha() === 'free' ? 'next town' : 'house'}. The breakfast room would do. Sixty pounds.”`,
  a:() => `The upholsterer from Reading is nine days about it; and Aga Firooz, whose opinion is asked when all is done, walks once round the room with his hands in his sleeves.

He says, in French, that it is very handsome; and that he never in his life saw anything like it.

Henrietta takes it as it was not meant, and gives her first breakfast there upon the Thursday. Three of the county sit upon the divan, and are unable to rise from it without assistance.`,
  b:() => `The divan comes from Reading, with the eleven cushions; and the breakfast room keeps its walls.

Aga Firooz, being asked how a divan is sat upon, shows her; and for one forenoon Henrietta receives the Miss Tamworths with her feet under her. She has had a chair brought in by one o’clock.`,
  c:() => `“Sixty pounds,” you say, “to breakfast under a bed curtain.”

She shuts the Repository. The plate is found a week later in the housekeeper’s room, pinned up over the linen press; and it is not known who pinned it.`});

VIGNETTES[0].push({w:() => aghaIn(), x:`In your pocket-book: “Mr. Furze has had a Border dug under the South Wall and 200 Rose Trees set in it, from Reading, 2. 10. 0. He says they are for Water and not for Shew. Mrs. Bunce very short with every Body. Dinner to day a Loin of Veal rosted and a Sallad. Wind S.W.”`});
VIGNETTES[1].push({w:() => aghaIn(), x:`In your pocket-book: “Mr. Furze sat up last Night in Cuckoo Copse to hear the Nightingale, which he says is a Bird of his own Country. Mudge took him for one of the Pryors and laid hold of him, and begged his Pardon this Morn’. Gave Mudge 0. 1. 0. Very hot. We began cutting the Clover.”`});
VIGNETTES[1].push({w:() => agha() === 'free', x:`The Reading Mercury has it among the notices, under a sale of oak timber: “PERSIAN TONGUE. Mr. FIROOZ, of Wyvern, begs to acquaint the Parents of young Gentlemen intended for India, that his Pupil, Mr. J. TAMWORTH, has passed in Persian before the Examiners at Hertford, the first of his Term. N.B. A few Phials of the true Attar of Roses.”`});
VIGNETTES[2].push({w:() => aghaIn(), x:`In your pocket-book: “Paid Mr. Furze his Half Year 20. 0. 0. He walked to Wyvern the same Day and put 15. 0. 0. of it with Tidmarsh into the Navy 5 per Cents. He has now more in the Funds than the Curate. Killed a Pig this Morn’, weight 14 Score. Wind N. and sharp.”`});
VIGNETTES[3].push({w:() => aghaIn(), x:`In your pocket-book: “Decr. 25. Christmas Day. We had the Tenants as usual, 14 at Table. Mr. Furze made a Sherbet of Quinces which was handed round in the Servants’ Hall. I thought it wanted Brandy, and Mudge was of my Mind. Gave to the Ringers 0. 5. 0. Hard Frost.”`});
VIGNETTES[3].push({w:() => !!S.raj && S.raj.st === 'here', x:`In your pocket-book: “The Rajah walked out in the Snow this Morn’ in his green Coat and took some up in his Hand, having never seen it. His Cook will not come out of the Brewhouse. To 2 Load of Wood for the same, 0. 14. 0. Dinner to day a Hare jugged. Wind N.E.”`});

/* The Reading Mercury, January 1816: what the county says of it all. */
const reckoningEast = reckoning;
reckoning = function(){ const r = reckoningEast(); if (!r || r.score === null || !Array.isArray(r.P)) return r;
  const add1 = t => r.P.splice(r.P.length - 1, 0, t), net = S.money - S.mortgage + ownLandValue();
  if (S.raj && S.raj.st === 'gone') add1(S.flags.rajDeed === 'hung' ? `He had the Rajah of Doolghur a year under his roof. A deed in the Persian character hangs in his justice room. By it he is lord of a village in Bundelcund. He has not had a rupee of the rent.` : `He had the Rajah of Doolghur a year under his roof. The Rajah’s memorial is still before the Governor-General in Council.`);
  if (S.flags.lion === 'worn') add1(`He wears the Persian Order of the Lion and Sun, by the Royal licence. He had it for one night’s lodging.`);
  else if (S.flags.lion === 'hen') add1(`Mrs ${S.sur} wears the Sun of Persia in her turban. It is the only one in the county that is not paste.`);
  if (aghaIn()) add1(`His house is kept by a Persian, whom Hatherley calls Mr Furze. Mr Furze has ${fmt(aghaFunds())} in the Navy five per cents.${net < aghaFunds() ? ' It is more than his master can show.' : ''}`);
  else if (agha() === 'free') add1(`Mr Firooz of Wyvern, who came into the county by the Portsmouth coach, has sent nine young gentlemen to Bengal with the Persian tongue. He has been offered a place at the Company’s college. He says the country air suits him.`);
  return r; };

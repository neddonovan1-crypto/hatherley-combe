/* Hatherley Combe: the almanack. Prices, weather, people, news. */
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const QUARTER = ['Lady Day', 'Midsummer', 'Michaelmas', 'Christmas'];
const FIRST_YEAR = 1795, LAST_YEAR = 1815;

// Wheat, shillings the Winchester quarter. Annual averages, near enough to the record.
const PRICES = {1795:75,1796:78,1797:53,1798:51,1799:69,1800:113,1801:119,1802:69,1803:58,1804:62,1805:89,1806:79,1807:75,1808:81,1809:97,1810:106,1811:95,1812:126,1813:109,1814:74,1815:65};
// The harvest, as a fraction of a fair one.
const WEATHER = {1795:0.78,1796:1.0,1797:1.05,1798:1.1,1799:0.74,1800:0.7,1801:0.98,1802:1.05,1803:1.0,1804:0.95,1805:0.95,1806:1.0,1807:1.0,1808:0.95,1809:0.85,1810:0.9,1811:0.88,1812:0.8,1813:1.28,1814:1.05,1815:1.1};

const PEOPLE = {
  henrietta: {name:'Henrietta', role:() => 'Your wife', r:1, met:true},
  kitty: {name:'Kitty', role:() => kittyRole(), r:2, met:true},
  edmund: {name:'Edmund', role:() => edmundRole(), r:1, met:true},
  crabbe: {name:'Mr Crabbe', role:() => F('crabbeGone') ? 'Late your steward, now of Newbury' : 'Your steward', r:0, met:true},
  gall: {name:'Dr Septimus Gall', role:() => F('gallDead') ? 'Late vicar of Hatherley' : 'Vicar, magistrate, tithe-owner', r:0, met:true},
  cullerne: {name:'Lord Cullerne', role:() => 'Earl. Owns most of Wyvern', r:0, met:true},
  pryor: {name:'Jem Pryor', role:() => 'Cottager on the common', r:0, met:true},
  hartopp: {name:'Mr Hartopp', role:() => 'Neighbour, mad on turnips', r:1, met:true},
  thorne: {name:'Abigail Thorne', role:() => F('nephewFarm') ? 'Late of Long Barrow Farm' : 'Of Long Barrow Farm', r:0, met:false},
  vane: {name:'Captain Vane', role:() => S.flags.kitty === 'vane' ? 'Your son-in-law, alas' : 'Northamptonshire Militia', r:0, met:false},
  pinch: {name:'Mr Lumley Pinch', role:() => S.flags.kitty === 'pinch' ? 'Your son-in-law. Sugar' : 'Of Bristol. Sugar', r:0, met:false},
  oakes: {name:'Mr Oakes', role:() => F('oakesVicar') ? 'Vicar of Hatherley' : 'The curate, on forty pounds', r:1, met:false},
  dubreuil: {name:'Lieutenant Dubreuil', role:() => 'French officer on parole', r:0, met:false}
};
/* A short life of each person, for the Persons leaf. PEOPLE[id].bio() returns two to four sentences as things stand. */
const BIOS = {
  henrietta:() => `You married her at Reading in ’75. She keeps the keys, the linen book and a list of who has called. She would have the Hall thought as good a house as the Tamworths’ and Kitty married better than she was herself. She has only ever said the first.${F('henriettaAway') ? ' She is at Bath, in Gay Street.' : ''}`,
  kitty:() => ({
    free:`Born at the Hall in ’78. She reads what she is told not to read and walks where she is told not to walk. Her mother wants her married. Kitty wants to be given a reason.`,
    vane:F('vaneGone') ? `She went to Gretna with Captain Vane. He sold his commission and left her with his bills and a boy. She asks nothing of anybody and is watched to see that she does not.` : `She went to Gretna with Captain Vane. She follows the regiment from one garrison town to the next. Her letters do not complain. They give the prices of things.`,
    pinch:F('kittyWidow') ? `She married Mr Pinch of Bristol and has buried him. She has his sugar, his house at Clifton and three hundred people in Jamaica whom she has never seen. The attorneys show her where to sign.` : `She married Mr Pinch of Bristol and eleven servants. She has a carriage and may drive on the Downs between two and four. Her mother is satisfied.`,
    oakes:`She married Mr Oakes on his stipend. She has no carriage. She borrows the Hall mangle and returns it clean. She has not once said she is sorry.`,
    dubreuil:`She married Lieutenant Dubreuil, a Frenchman and a prisoner. Half the county does not call. She is learning French in order to be rude in it.`})[K()],
  edmund:() => F('edmundDead') ? `Your only son. ${S.flags.edmundRoleDead || 'Killed at Waterloo, June 1815'}. His fowling piece is on the rack in the gun room. Nobody has been told to move it.` : ({
    army:`Your only son and the heir. You bought him his colours in the 52nd. He writes from wherever the regiment is and asks for boots. Hatherley is settled on him. He has to live to have it.`,
    navy:`Your only son and the heir. He went to sea in Captain Holloway’s frigate. He writes when a ship is homeward bound to carry it. His mother keeps the letters in order of date.`,
    church:`Your only son and the heir. You steered him into the Church. He wanted a red coat. He reads the lessons very clearly and looks at the Gazette afterwards.`,
    home:`Your only son and the heir. You kept him at home to learn the estate. He knows every field and what it let for in 1790. His schoolfellows are at the war.`,
    militia:`Your only son and the heir. He has a company in the Berkshire Militia. It is a red coat and it stays in England. His mother thinks it a very good arrangement.`,
    farmer:`Your only son and the heir. He farms Kennet Bottom and pays you rent for it. He married Miss Loveday. He comes to the audit with the other tenants and waits his turn.`})[E()] || `Your only son and the heir. He is nineteen. Hatherley is settled on him and he has nothing to do until he has it. His mother wants him within a day’s ride. He wants a coat with facings.`,
  crabbe:() => F('crabbeGone') ? `He was your uncle’s steward and then yours. He lives at Newbury now. When you meet him there he bows from the other side of the street.` : `Steward at Hatherley since your uncle’s time. He keeps the rent book. There is a column in it headed Sundries. He would like his nephew to have a farm. The tenants bring him a goose at Michaelmas.`,
  gall:() => F('gallDead') ? `He was vicar of Hatherley forty years and a justice for thirty. He died at his own table during the second remove. His tithe book is in the vestry chest.` : `Vicar of Hatherley, a justice, and owner of the great tithes. He takes every tenth sheaf and counts them himself. He dines at the Hall on Sundays, and at the Castle when he is asked. He would have the poor kept quiet and the Methodists kept out of the barn.`,
  cullerne:() => `The Earl. He has Cullerne Castle, fourteen of the thirty-one votes in Wyvern and the chair at Quarter Sessions. He wants the borough quiet and his nephew Mr Fitzroy Bligh in the seat. He sends venison to those he counts upon. ${F('mp') ? 'You sit for Wyvern. He has done that sum more than once.' : 'He counts your uncle’s three plots.'}`,
  pryor:() => `A cottager on Hatherley Common. He has a cow, nine children and no master. He takes harvest work when he chooses and says what he thinks at the Bell. The parish waits to hear it. ${F('enclosed') ? 'The Common is enclosed now. He has not forgotten whose name was on the bill.' : 'He wants the Common left as it is.'}`,
  hartopp:() => `Your neighbour over the brook. He farms his own land by the new husbandry. Swedish turnips, tile drains and a Leicester ram. He has read Mr Arthur Young and will lend him to anybody. He is looking for a convert and has fixed upon you.`,
  thorne:() => F('nephewFarm') ? `A widow. She held Long Barrow for twenty years and farmed it better than her husband had. You let it over her head. The other tenants still take their sums to her.` : `A widow. She has held Long Barrow since her husband died and farms it better than he did. She can add. The other tenants bring her their sums. She wants her lease renewed and nothing else from anybody.`,
  vane:() => `A captain in the Northamptonshire Militia. He dances well, owes his tailor and has a theory about horses. He wanted a wife with something settled on her. ${K() === 'vane' ? (F('vaneGone') ? 'He had Kitty. He is thought to be in Dublin.' : 'He has Kitty.') : 'Kitty looked at him for longer than her mother liked.'}`,
  pinch:() => F('kittyWidow') ? `He was a Bristol merchant. Sugar from Jamaica, a house at Clifton and a new crest. He died there. He left everything to Kitty and a mourning ring to you.` : `A Bristol merchant of fifty, a widower. He has sugar from Jamaica, a house at Clifton and three hundred people on an estate he has never seen. He wants a gentleman’s daughter at the head of his table. ${K() === 'pinch' ? 'He has one.' : 'Henrietta has asked what he is worth. It is eighty thousand.'}`,
  oakes:() => F('oakesVicar') ? `He was curate here on forty pounds a year. He is vicar now. He still goes round the cottages on foot. His sermons are short and he does not read other men’s.${K() === 'oakes' ? ' Kitty is at the Vicarage.' : ''}` : `Dr Gall’s curate. He does the whole duty of the parish on forty pounds a year and lodges over the schoolhouse. He goes round the cottages on foot. He wants a living. ${K() === 'oakes' ? 'He has Kitty, and no living.' : 'He has not said what else he wants.'}`,
  dubreuil:() => K() === 'dubreuil' ? `A lieutenant of the French navy, taken at sea. He was on parole at Reading and might walk one mile out of the town. He is your son-in-law. His mother at Saint-Malo has been told.` : `A lieutenant of the French navy, taken at sea and on his parole at Reading. He may walk one mile out of the town and must be indoors by five. He draws. He speaks English with great care. He wants to be exchanged.`
};
for (const id in BIOS) PEOPLE[id].bio = BIOS[id];

const REGARD = ['Implacable','Hostile','Cold','Wary','Cool','Civil','Cordial','Warm','Fond','Devoted','Would die for you'];

const STANDING_W = ['A laughing-stock','Overlooked','Respectable','Well regarded','A man of weight','First man in the county'];
const GOODWILL_W = ['Hated','Resented','Tolerated','Liked','Trusted','Toasted at the Bell'];
const FAMILY_W = ['At open war','Frosty','Civil','Contented','Happy','Doting'];

// County intelligence. Keyed year-season.
const NEWS = {
  '1795-0':'Bread riots at Newbury, Chichester and Wells. The quartern loaf at elevenpence.',
  '1795-1':'The Prince of Wales is married to his cousin, the Princess Caroline of Brunswick.',
  '1795-2':'A stone thrown at the King’s coach on his way to open Parliament. The harvest the worst in thirty years.',
  '1795-3':'Parliament passes the Two Acts against treasonable practices and seditious meetings.',
  '1796-0':'General Bonaparte, aged twenty-six, has crossed into Italy.',
  '1796-1':'A general election. Dr Jenner of Berkeley has put matter from a cow-pox sore into a gardener’s boy.',
  '1796-3':'A French fleet with fifteen thousand men sails for Ireland and is scattered by a gale in Bantry Bay.',
  '1797-0':'The French land at Fishguard. The Bank of England stops payment in gold.',
  '1797-1':'The fleet has mutinied at Spithead, and again at the Nore. The men ask a shilling a day.',
  '1797-3':'Admiral Duncan has beaten the Dutch at Camperdown. Mr Pitt trebles the assessed taxes.',
  '1798-1':'Rebellion in Ireland. Bonaparte has sailed from Toulon with four hundred ships. His destination is not known.',
  '1798-2':'Nelson has found the French fleet at the mouth of the Nile and destroyed it.',
  '1799-1':'The wettest summer in memory. Corn sprouting in the ear.',
  '1799-3':'Bonaparte makes himself First Consul. Mr Pitt’s tax on incomes comes into force.',
  '1800-1':'Wheat past a hundred shillings. Riots at Banbury, Oxford and Nottingham.',
  '1800-2':'The Brown Bread Act. Millers are forbidden to dress fine white flour.',
  '1801-0':'Union with Ireland. Mr Pitt has resigned and Mr Addington, a doctor’s son, is Minister.',
  '1801-1':'The first Census of the people. Nelson at Copenhagen puts the glass to his blind eye.',
  '1802-0':'Peace signed at Amiens. The income tax is to be repealed and the returns burnt.',
  '1803-1':'War again. Bonaparte has seized every Englishman of military age found in France.',
  '1803-3':'The Army of England is encamped at Boulogne. Three hundred and eighty thousand Volunteers under arms at home.',
  '1804-1':'Mr Pitt returns. Bonaparte has had himself voted Emperor of the French.',
  '1805-2':'The French camp at Boulogne has broken up and marched east. Nobody knows why.',
  '1805-3':'A great victory off Cape Trafalgar. Lord Nelson killed.',
  '1806-0':'Mr Pitt is dead, at forty-six. The House votes forty thousand pounds to pay his debts.',
  '1806-3':'Bonaparte, at Berlin, forbids all Europe to trade with Britain.',
  '1807-0':'The slave trade is abolished by two hundred and eighty-three votes to sixteen.',
  '1807-2':'The fleet bombards Copenhagen and carries off the Danish navy.',
  '1808-2':'Sir Arthur Wellesley has beaten the French at Vimeiro, in Portugal.',
  '1809-0':'Sir John Moore killed at Corunna. The Duke of York’s mistress examined at the bar of the House.',
  '1809-3':'The King’s Jubilee. The expedition to Walcheren dying of fever in the Dutch marshes.',
  '1810-3':'The Princess Amelia is dead, and the King’s mind has given way with grief.',
  '1811-0':'The Prince of Wales sworn in as Regent. Frame-breakers at work in Nottinghamshire.',
  '1811-2':'A great comet in the north-west every evening. The wine growers of France expect a famous vintage.',
  '1812-1':'Mr Perceval, the Prime Minister, shot dead in the lobby of the House. War with America.',
  '1812-3':'Bonaparte has entered Moscow and found it on fire.',
  '1813-1':'Lord Wellington’s victory at Vitoria. King Joseph’s coach is taken, with his plate, his pictures and his chamber pot.',
  '1813-2':'The greatest harvest in living memory. Corn falling at every market.',
  '1814-0':'The Thames frozen at London. An elephant led across the ice below Blackfriars.',
  '1814-1':'Bonaparte has abdicated and gone to govern the island of Elba.',
  '1815-0':'The Corn Bill before Parliament. Bonaparte has left Elba and landed in France.',
  '1815-1':'A great battle near Brussels, at a village called Waterloo.',
  '1815-3':'Bonaparte is landed on St Helena. Wheat at fifty-six shillings. Farms to let in every county.'
};

// Quiet seasons. One is drawn when nothing else demands you.
const VIGNETTES = [
  [ // spring
    `A late frost. The blossom on the orchard wall is brown by morning.

“That’s a sign,” says Mrs Bunce. She will not say what of.`,
    `In your pocket-book: “Rooks building in the tops of the Elms. Mudge says it is the Sign of a dry Summer. Gave him 0. 1. 0. We finished sowing Barley this Afternoon. Dinner to day, a boiled Leg of Mutton and Capers &c. Wind N.E. and cold.”`,
    `Lambing on the Down. The shepherd has slept three weeks in the hut on wheels. You ask him how many twins.

“Coom on then, coom on,” he says. Then he begs your pardon.`,
    `The rent audit dinner. The tenants finish a round of beef between them.

When the cloth is drawn each one takes you aside. Each is the only farmer in Berkshire being ruined.`,
    `In your pocket-book: “April 14. Heard the Cuckoo in the Copse about 7 this Morn’. To the Mole-catcher for his Quarter paid 0. 10. 6. He shewed me 41 Tails. Dinner to day, a Couple of Rabbits smothered with Onions, a Gooseberry Tart &c.”`
  ],
  [ // summer
    `Haymaking in Kennet Meadow. The whole parish is out with rakes. The beer goes down to them in buckets.

At dusk Mrs Pryor counts her children into the cart. She has nine. She came with seven.`,
    `In your pocket-book: “We washed 900 Sheep in the Lambourn to day. To the Washers, Beer, Bread and Cheese, and gave among them 0. 5. 0. The Shepherd stood to his Middle in the River from 6 till Noon. Sent him a Glass of Rum. Very hot. Wind S.”`,
    `In your pocket-book: “Hatherley played Kintbury on the Common for eleven Pair of Gloves. Kintbury beat us by 14 Notches. The Smith bowled. He hit the Wicket once and the Kintbury Long-stop three times. Lost to Mr. Hartopp on the Match 0. 10. 6.”`,
    `Three weeks without rain. The pond is down to a green plate. The wheel of a gig stands up in the middle of it.

Your uncle lost a gig in 1771. He never said where.`,
    `A show at Wyvern has a Learned Pig. For a penny it tells the hour by a watch. For twopence it finds the greatest rogue in the company.

It goes twice round the ring. It sits down in front of Mr Skinner the auctioneer.`
  ],
  [ // autumn
    `Harvest home. The last load comes down the lane with a boy on top in ribbons. You give the speech from the wagon. It is your uncle’s speech. The men say the last line with you.`,
    `The gleaners are on Long Barrow at first light. Women and children go up the stubble in a line, bent double.

Mrs Pryor carries home six bushels. She can tell you what each of the others carried.`,
    `Wyvern Michaelmas Fair. The servants stand for hire in the market place. Carters wear whipcord in their hats. Shepherds wear a lock of wool.

One man has a turnip in his. Nobody has asked him yet.`,
    `In your pocket-book: “Octbr. 1. Out by 8 this Morn’ with Mudge and both Spaniels. We killed 4 Brace of Pheasants and a Hare. Three of the Birds fell over Mr. Hartopp’s Hedge. His Man came for them before we had loaded again. Let him have a Brace. Dinner to day, the Hare rosted.”`,
    `In your pocket-book: “Thick Mist in the Combe till 10. A great many Mushrooms on the Down. Mrs. Bunce made 11 Bottles of Catchup. Recd. of Farmer Dewey for half a Year’s Rent 62. 10. 0. Gave him back as usual 0. 2. 6. My Uncle always did.”`
  ],
  [ // winter
    `In your pocket-book: “Snow as high as the Hedge Tops. No Mail these 9 Days. Read Prayers in the Hall, the Church Path being stopped. Sent Widow Harris a Sack of Coals and 0. 2. 6. At Backgammon this Evening with H. lost 0. 1. 6. Bitter cold. Wind N.”`,
    `The mummers come to the Hall on Christmas Eve. The Turkish Knight kills Saint George. The Doctor is to raise him. The Doctor is the wheelwright. He falls over Saint George.

The Turkish Knight raises them both.`,
    `In your pocket-book: “We killed two Pigs this Morn’. They weighed 16 Score the Pair. Sent a Spare-rib to the Vicarage and the Chitterlings to the Lodge. Gave the Pryor Children the Bladder. It was in the Carp Pond by 3 o’clock. Dinner to day, the Fry &c.”`,
    `A hard frost. The carp pond bears. After eleven at night there are lanterns on it.

In the morning the ice is cut all over. Both footmen yawn through breakfast.`,
    `Plough Monday. The plough boys drag a plough from door to door for pennies. The miller gives nothing. They draw a furrow across his yard.

You send out half a crown.`
  ]
];

/* More leaves for the quiet seasons. A plain string may come in any year; {w, x} only when w() holds. */
VIGNETTES[0].push(
  `The sweep’s boy comes down the wrong chimney. He stands on the hearth in Henrietta’s dressing-room with his brush in his hand.

She gives him a shilling to go back up.`,
  `In your pocket-book: “March 25. Lady Day. Paid my Servants their Wages. To my Cook Mrs. Bunce 12. 0. 0. To the Footman 8. 0. 0. To the Knife Boy 2. 2. 0 and a Pair of Shoes. The Boy asked might he have the Money for the Shoes instead. Told him No.”`,
  `Mothering Sunday. The kitchen-maid walks nine miles home to Aldbourne with a simnel cake in a cloth.

She is back by dark. She has the cloth.`,
  `Mudge has nailed the winter’s vermin to the kennel door. Eleven stoats, four hawks and a cat. The cat has a collar on.

Mrs Tamworth’s tabby has been missing since Tuesday.`,
  `In your pocket-book: “Sowed Peas in the Garden to day. Mr. Hartopp called and stayed 3 Hours talking of the Swedish Turnip. He drew one on the Table Cloth with a Fork. Dinner to day, a Calf’s Head boiled, Pork and Greens &c. Mr. H. eat very hearty.”`,
  {w:() => S.year <= 1814, x:`A recruiting party is at the Bell with a fife and a drum. The serjeant has ribbons in his hat and a purse of the King’s shillings.

Three ploughboys go in to hear the music. Two come out.`},
  `The rooks are building in the Hall elms. Henrietta counts forty nests from her window.

Your uncle held that rooks leave a house before a death. He counted them every March for thirty years. They were all there the spring he died.`,
  `In your pocket-book: “Easter Monday. To the Ringers 0. 5. 0. To a poor Sailor with one Leg 0. 1. 0. To another with one Leg at the Stable Gate 0. 1. 0. I believe it was the same Sailor.”`,
  {w:() => S.year === 1814, x:`The frost held eleven weeks. They roasted a sheep on the Thames at Blackfriars and charged a shilling to look at it. The Kennet bore a loaded wagon at Newbury.

The thaw came on Tuesday. It brought down the stable gutter and forty feet of the kitchen garden wall.`},
  {w:() => S.year === 1801, x:`By Act of Parliament no baker may sell a loaf less than a day out of the oven. A stale loaf is thought to go further.

The Wyvern baker bakes on Monday and sells on Tuesday. On Tuesday he bakes for Wednesday. Nobody in the town can find what the Act has altered.`}
);
VIGNETTES[1].push(
  `Shearing supper in the great barn. The captain of the shearers gives a song of nineteen verses. At the eleventh he loses the words and begins again from the first.

Nobody stops him.`,
  `In your pocket-book: “June 4. The King’s Birth Day. Gave my People a Barrel of Beer. The Bells rang from 6 in the Morn’ till 9 at Night. To the Ringers 0. 5. 0. Would have given 0. 10. 0 to have them leave off at Noon.”`,
  `A swarm hangs on the pear tree by the laundry. Mrs Bunce goes out to it with a straw hive and a warming-pan.

She beats the pan. She tells the bees what has happened in the house since Easter. They go in.`,
  `Strawberries. Henrietta sends a basket to the Castle and a basket to the Tamworths.

The Castle sends back a pine-apple. The Tamworths send back the basket.`,
  `In your pocket-book: “Very hot. Bathed my Feet in the Pond before Breakfast. Mr. Hartopp’s Bull got into the Church Yard during Morning Service and looked in at the Chancel Door. The Parson did not leave off.”`,
  `The mail guard throws down the London paper at the lodge without stopping. Today it goes into the horse-pond.

It is dried before the kitchen fire. Mrs Bunce irons it. Half the Gazette comes off on the iron.`,
  {w:() => wheatNow() >= 100, x:() => `Wheat is at ${wheatNow()} shillings. The Wyvern baker has a board in his window with the price of the quartern loaf in chalk.

He has rubbed it out so often that the board is white.`},
  `Cherry Fair at Wyvern. A man eats a hundred cherries in a minute for a wager. He swallows the stones.

The surgeon is fetched. He takes out his watch and says they must wait.`,
  `In your pocket-book: “July 15. St. Swithin. Rain at 4 in the Afternoon, a few Drops only. Mudge says that is 40 Days of it. Laid him 0. 2. 6 that it is not. Dinner to day, a Couple of Ducks rosted and Peas.”`,
  `The Hatherley Friendly Society walks on Whit Tuesday. Forty men with blue staves, and a band. They walk to the church, to the Bell and to the Hall, in that order.

At the Hall they give three cheers. Some give four.`
);
VIGNETTES[2].push(
  `In your pocket-book: “Sept. 29. Michaelmas. Received my Rents. Gave the Tenants a Goose rosted at the Top of the Table and another at the Bottom, and Plumb Puddings. They sat from 2 till 9. One was helped upon his Horse. The Horse knew the Way.”`,
  `Nutting. The village children are in Hatherley Copse with hooked sticks and their mothers’ aprons. Mudge says they put up the pheasants. He says it from the gate.

Your uncle’s keeper took him in that copse at nine years old, with an apron.`,
  {w:() => S.year >= 1803 && S.year <= 1813, x:`Gunpowder Treason. The boys burn the Pope on the Common. This year he has a cocked hat and they call him Boney.

It is last year’s straw.`},
  `The hop-pickers come through from Farnham, walking home into Wiltshire. Sixty of them sleep in the great barn.

In the morning the barn is swept. There is a bunch of hops tied to the door.`,
  `In your pocket-book: “Brewed a Hogshead of strong Beer to day. To my Maltster for 8 Bushels 2. 8. 0. Mrs. Bunce says Thunder will turn it. It did thunder about 5. Dinner to day, Hash Mutton and a Suet Pudding.”`,
  {w:() => S.year === 1811, x:`The comet stands over the stable clock at nine each night. It has a tail as long as a man’s arm.

The shepherd says it means a hot summer, a dear loaf or the death of a king. He is asked which. He says it has always been one of the three.`},
  {w:() => S.year === 1810, x:`The Wilts and Berks Canal is open to Abingdon. The proprietors’ boat went through the last lock at half past two. They dined in the Council Chamber until late.

The hundred-pound shares are at twelve pounds ten. Mr Tamworth has nine.`},
  `The apple-man is in the orchard with his ladder. Forty bushels of pippins for the house. The rest is for cider. The pigs have the windfalls.

By evening two of the pigs cannot stand.`,
  `A walking postman brings the letters out from Wyvern at a penny each. Six miles out and six back.

Today there is one letter. It is for Mrs Bunce. The housemaid reads it to her in the scullery. Then she reads it again.`,
  `In your pocket-book: “Octr. 10. Wyvern Fair. Saw a Man eat Fire, and a Woman with no Arms that cut Paper with her Feet, gave 0. 0. 6. Bought of her a Paper Cut in the Shape of a Church 0. 1. 0. Lost my Handkerchief.”`
);
VIGNETTES[3].push(
  `In your pocket-book: “Decr. 21. St. Thomas. Gave to 43 poor People of this Parish 6d. each as usual, 1. 1. 6. Two came that are of Kintbury. Gave to them also, it being very cold.”`,
  `Plough Monday. The ploughboys drag a plough to the Hall door with ribbons on it and ask for money. A house that gives none has its doorstep ploughed up.

Your uncle had the step relaid twice. After that he gave a shilling.`,
  `In your pocket-book: “Jany. 9. Frost very severe. The Milk froze in the Dairy and the Ink in my Ink Stand. Wrote this with a Pencil. Sent a Chaldron of Coals to the Alms House, 1. 16. 0.”`,
  `The carrier is four days late from Reading. He was in a drift at Thatcham from Monday to Thursday.

He lived on the Hall’s Christmas order. He has brought the bill for it.`,
  `Twelfth Night. Henrietta has a cake from the Wyvern confectioner with a bean baked in it. The bean makes a king.

Mr Tamworth has the bean. He gives orders until midnight. Mrs Tamworth obeys none of them.`,
  `The church singers come round at five on Christmas morning. They sing “While Shepherds Watched” under your window. The bassoon is frozen.

They sing it again to be sure you are awake.`,
  `In your pocket-book: “Feby. 14. Valentine’s Day. To 37 Children of the Parish that came to the Door saying Good morrow Valentine, 1d. each, 0. 3. 1. Three were the same Child in different Hats.”`,
  {w:() => S.year === 1810, x:`A barge of stone went up the locks at Devizes on Friday night. The Kennet and Avon is open from London to Bath. Nobody was there to see it.

Carriage to Bath is two pounds nine and sixpence the ton. By road it was six pounds three.`},
  `The ice-house is filled. Twelve men cut the pond with saws and wheel the blocks up in barrows.

One block has a perch in it. Mrs Bunce says it will keep till August.`,
  `Old Christmas Day. The oldest man in the parish will not keep the new one. He has not kept it since they took the eleven days in ’52.

He eats his Christmas dinner on the sixth of January, alone, with his hat on.`
);
function vignette(q){ S.vig = S.vig || {};
  const all = VIGNETTES[q].map((v, i) => ({i, v})).filter(o => typeof o.v === 'string' || !o.v.w || o.v.w());
  const fresh = all.filter(o => S.vig[q + '-' + o.i] === undefined);
  const set = fresh.length ? fresh : all.slice().sort((a, b) => S.vig[q + '-' + a.i] - S.vig[q + '-' + b.i]).slice(0, 4);
  const o = pick(set); S.vig[q + '-' + o.i] = S.t;
  const x = typeof o.v === 'string' ? o.v : o.v.x; return typeof x === 'function' ? x() : x; }

function fmt(n){ const a = Math.abs(Math.round(n)).toLocaleString('en-GB'); return (n < 0 ? '−' : '') + '£' + a; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
function chance(p){ return Math.random() < p; }

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
const REGARD = ['Implacable','Hostile','Cold','Wary','Cool','Civil','Cordial','Warm','Fond','Devoted','Would die for you'];

const STANDING_W = ['A laughing-stock','Overlooked','Respectable','Well regarded','A man of weight','First man in the county'];
const GOODWILL_W = ['Hated','Resented','Tolerated','Liked','Trusted','Toasted at the Bell'];
const FAMILY_W = ['At open war','Frosty','Civil','Contented','Happy','Doting'];

// County intelligence. Keyed year-season.
const NEWS = {
  '1795-0':'Bread riots at Newbury, Chichester and Wells. The quartern loaf at elevenpence.',
  '1795-1':'The Prince of Wales has married his cousin Caroline. He is said to have called for brandy on first seeing her.',
  '1795-2':'A stone thrown at the King’s coach on his way to open Parliament. The harvest the worst in thirty years.',
  '1795-3':'Parliament passes the Two Acts against treasonable practices and seditious meetings.',
  '1796-0':'General Bonaparte, aged twenty-six, has crossed into Italy.',
  '1796-1':'A general election. Dr Jenner of Berkeley has put cow-pox into a gardener’s boy, to see what happens.',
  '1796-3':'A French fleet with fifteen thousand men sails for Ireland and is scattered by a gale in Bantry Bay.',
  '1797-0':'The French land at Fishguard. The Bank of England stops payment in gold.',
  '1797-1':'The fleet has mutinied at Spithead, and again at the Nore. The men ask a shilling a day.',
  '1797-3':'Admiral Duncan has beaten the Dutch at Camperdown. Mr Pitt trebles the assessed taxes.',
  '1798-1':'Rebellion in Ireland. Bonaparte has sailed from Toulon, nobody knows whither.',
  '1798-2':'Nelson has found the French fleet at the mouth of the Nile and destroyed it.',
  '1799-1':'The wettest summer in memory. Corn sprouting in the ear.',
  '1799-3':'Bonaparte makes himself First Consul. Mr Pitt’s tax on incomes comes into force.',
  '1800-1':'Wheat past a hundred shillings. Riots at Banbury, Oxford and Nottingham.',
  '1800-2':'The Brown Bread Act forbids the miller to dress fine white flour. It is evaded by Tuesday.',
  '1801-0':'Union with Ireland. Mr Pitt has resigned and Mr Addington, a doctor’s son, is Minister.',
  '1801-1':'The first Census of the people. Nelson at Copenhagen puts the glass to his blind eye.',
  '1802-0':'Peace signed at Amiens. The income tax is to be repealed and the returns burnt.',
  '1803-1':'War again. Bonaparte has seized every Englishman of military age found in France.',
  '1803-3':'The Army of England is encamped at Boulogne. Three hundred and eighty thousand Volunteers under arms at home.',
  '1804-1':'Mr Pitt returns. Bonaparte has had himself voted Emperor of the French.',
  '1805-2':'The French camp at Boulogne has broken up and marched east. Nobody knows why.',
  '1805-3':'A great victory off Cape Trafalgar. Lord Nelson killed.',
  '1806-0':'Mr Pitt is dead, at forty-six. His last words concerned either his country or a veal pie; accounts differ.',
  '1806-3':'Bonaparte, at Berlin, forbids all Europe to trade with Britain.',
  '1807-0':'The slave trade is abolished by two hundred and eighty-three votes to sixteen.',
  '1807-2':'The fleet bombards Copenhagen and carries off the Danish navy.',
  '1808-2':'Sir Arthur Wellesley has beaten the French at Vimeiro, in Portugal.',
  '1809-0':'Sir John Moore killed at Corunna. The Duke of York’s mistress examined at the bar of the House.',
  '1809-3':'The King’s Jubilee. The expedition to Walcheren dying of fever in the Dutch marshes.',
  '1810-3':'The Princess Amelia is dead, and the King’s mind has given way with grief.',
  '1811-0':'The Prince of Wales sworn in as Regent. Frame-breakers at work in Nottinghamshire.',
  '1811-2':'A great comet, with a tail like a peacock. The vintage in France is said to be superb.',
  '1812-1':'Mr Perceval, the Prime Minister, shot dead in the lobby of the House. War with America.',
  '1812-3':'Bonaparte has entered Moscow and found it on fire.',
  '1813-1':'Lord Wellington’s victory at Vitoria. King Joseph’s baggage taken, including his chamber pot.',
  '1813-2':'The greatest harvest in living memory. Corn falling at every market.',
  '1814-0':'The Thames frozen at London. An elephant led across the ice below Blackfriars.',
  '1814-1':'Bonaparte has abdicated and gone to govern the island of Elba.',
  '1815-0':'The Corn Bill before Parliament. Bonaparte has left Elba and landed in France.',
  '1815-1':'A great battle near Brussels, at a village called Waterloo.',
  '1815-3':'Bonaparte is landed on St Helena. Wheat at fifty-six shillings and the farmers ruined by plenty.'
};

// Quiet seasons. One is drawn when nothing else demands you.
const VIGNETTES = [
  [ // spring
    `A late frost. The blossom on the orchard wall goes brown overnight and Mrs Bunce takes it as an omen, though she declines to say of what.`,
    `In your pocket-book: “Rooks building in the tops of the Elms. Mudge says it is the Sign of a dry Summer. Gave him 0. 1. 0. We finished sowing Barley this Afternoon. Dinner to day, a boiled Leg of Mutton and Capers &c. Wind N.E. and cold.”`,
    `Lambing on the Down. The shepherd has not slept in a bed for three weeks and has begun to answer questions in the voice he uses for ewes.`,
    `The rent audit dinner. Eleven farmers eat a round of beef between them and each explains, separately, that he alone is being ruined.`,
    `In your pocket-book: “April 14. Heard the Cuckoo in the Copse about 7 this Morn’. To the Mole-catcher for his Quarter paid 0. 10. 6. He shewed me 41 Tails. Dinner to day, a Couple of Rabbits smothered with Onions, a Gooseberry Tart &c.”`
  ],
  [ // summer
    `Haymaking. The whole parish is in Kennet Meadow with rakes, and the beer goes out to them in buckets. By evening nobody can say with certainty whose child is whose.`,
    `In your pocket-book: “We washed 900 Sheep in the Lambourn to day. To the Washers, Beer, Bread and Cheese, and gave among them 0. 5. 0. The Shepherd stood to his Middle in the River from 6 till Noon. Sent him a Glass of Rum. Very hot. Wind S.”`,
    `In your pocket-book: “Hatherley played Kintbury on the Common for eleven Pair of Gloves. Kintbury beat us by 14 Notches. The Smith bowled. He hit the Wicket once and the Kintbury Long-stop three times. Lost to Mr. Hartopp on the Match 0. 10. 6.”`,
    `Three weeks without rain. The pond shrinks to a green plate and something is found in the middle of it that your uncle was known to have lost in 1771.`,
    `A travelling show at Wyvern exhibits a Learned Pig that tells the time and picks out the greatest rogue in the company. It picks out Crabbe. Crabbe laughs longest.`
  ],
  [ // autumn
    `Harvest home. The last load comes in with a boy on top of it dressed in ribbons, and you make the same speech your uncle made, because nobody would forgive a new one.`,
    `The gleaners are out on Long Barrow at first light, bent double, women and children in a line. A good gleaning family will carry home six bushels, and know to the ear who took more.`,
    `Wyvern Michaelmas Fair. Servants stand for hire in the market place: carters with whipcord in their hats, shepherds with a lock of wool, and one man with a turnip, whom nobody likes to ask.`,
    `In your pocket-book: “Octbr. 1. Out by 8 this Morn’ with Mudge and both Spaniels. We killed 4 Brace of Pheasants and a Hare. Three of the Birds fell over Mr. Hartopp’s Hedge. His Man came for them before we had loaded again. Let him have a Brace. Dinner to day, the Hare rosted.”`,
    `In your pocket-book: “Thick Mist in the Combe till 10. A great many Mushrooms on the Down. Mrs. Bunce made 11 Bottles of Catchup. Recd. of Farmer Dewey for half a Year’s Rent 62. 10. 0. Gave him back as usual 0. 2. 6. My Uncle always did.”`
  ],
  [ // winter
    `In your pocket-book: “Snow as high as the Hedge Tops. No Mail these 9 Days. Read Prayers in the Hall, the Church Path being stopped. Sent Widow Harris a Sack of Coals and 0. 2. 6. At Backgammon this Evening with H. lost 0. 1. 6. Bitter cold. Wind N.”`,
    `The mummers come to the Hall on Christmas Eve. Saint George is killed by the Turkish Knight and raised by the Doctor, who is the wheelwright, and drunk, and has to be raised himself.`,
    `In your pocket-book: “We killed two Pigs this Morn’. They weighed 16 Score the Pair. Sent a Spare-rib to the Vicarage and the Chitterlings to the Lodge. Gave the Pryor Children the Bladder. It was in the Carp Pond by 3 o’clock. Dinner to day, the Fry &c.”`,
    `A hard frost. The carp pond bears, and the footmen skate on it after dark when they think the house is asleep.`,
    `Plough Monday. The plough boys drag a plough from door to door, asking for pennies, and drawing a furrow across the gravel of anyone who refuses. Your gravel is spared, at a price.`
  ]
];

function fmt(n){ const a = Math.abs(Math.round(n)).toLocaleString('en-GB'); return (n < 0 ? '−' : '') + '£' + a; }
function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }
function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
function chance(p){ return Math.random() < p; }

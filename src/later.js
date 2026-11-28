/* The later years: what is offered when the first works are built and the first ventures have run out, the Brazil shares brought on to the Ventures page, and Mr Crabbe's opinion of his master.
   Six ventures and three works are kept out of the book until their year comes; each is announced by a line in the memoranda the quarter it opens (S.newLots).
   Sources for the dates: Ellman's Southdowns at Lewes fair; the Dunstable plait trade under the war duties on Leghorn; the Gas Light and Coke Company's charter of 1812;
   the Charter Act of 1813, opening the India trade to private ships from April 1814; the Royal Jennerian Society of 1803; the Jubilee of 25 October 1809. */

/* ---------- when each comes into the book ---------- */
const merinoOver = () => S.year >= 1811 || (!!vent('merino') && !!vent('merino').ended);
const LATE = {
  southdown:{ when:() => S.year >= 1806 && merinoOver(),
    news:() => `Mr Ellman of Glynde is to sell Southdown rams at Lewes fair this year; and Hartopp, who gave forty guineas for a merino, has written for the catalogue.` },
  coach:{ when:() => S.year >= 1805,
    news:() => `A coach called the Defiance is to run from the George at Wyvern to Ludgate Hill in nine hours; and the proprietors, wanting horses for the Hatherley stage, have a share to sell.` },
  plait:{ when:() => S.year >= 1806 && S.year <= 1814,
    news:() => `Leghorn hats being shut out by the war, the Dunstable makers will buy English plait at any price; and a woman who can teach it has asked the vestry for a room.` },
  papermill:{ when:() => S.year >= 1807,
    news:() => `A paper-maker from Thatcham has walked the Kennet below the mill with a level in his hand; and he says there is fall enough for a vat mill, if a gentleman will find the building.` },
  gaslight:{ when:() => S.year >= 1812,
    news:() => `The Gas Light and Coke Company has its charter; and Hartopp has the prospectus in his hat, having marked upon it the names of such proprietors as he has dined with.` },
  indiaman:{ when:() => S.year >= 1814,
    news:() => `The India trade being thrown open by the late Act, the owners of the Hetty have taken out her guns, and advertise her for Bombay in sixteenths.` },
  vaccine:{ work:true, when:() => S.year >= 1803,
    news:() => `The small-pox is at Newbury. The surgeon there has cow-pox matter of Dr Jenner’s own stock, and will come out to any parish that sends for him.` },
  lodge:{ work:true, when:() => S.year >= 1806,
    news:() => `Lord Cullerne has built a lodge at his east gate, in the Gothic taste, and put a man into it to open; the Hall drive being shut, as it was in your uncle’s time, by a hurdle.` },
  park:{ work:true, when:() => S.year >= 1803,
    news:() => `Mr Repton has been a week at Cullerne Castle with his theodolite, at five guineas a day; and he lets it be known in Wyvern that he has two days disengaged before he goes into Wiltshire.` },
  wing:{ work:true, when:() => S.year >= 1805,
    news:() => `The Tamworths have added a library to their house, of forty feet, with a bow; and their architect, who was a pupil of Mr Wyatt, has left his card at the Hall.` },
  modelfarm:{ work:true, when:() => S.year >= 1806,
    news:() => `Mr Coke has shown three hundred gentlemen over his new farmyard at Holkham; and Hartopp, who was one of them, has paced out the plan of it upon your lawn.` },
  brewery:{ when:() => S.year >= 1804,
    news:() => `Old Mr Sims, who has brewed at Wyvern these forty years, and owns nine of its public houses, is dead; and his widow will sell the copper, the houses and the goodwill together.` },
  wharf:{ when:() => S.year >= 1810,
    news:() => `The Kennet and Avon Canal is open from Newbury to Bath; and its engineer has ruled a line upon the map from the nearest pound to Hatherley Mill, of a mile and three furlongs.` },
  clock:{ work:true, when:() => S.year >= 1809,
    news:() => S.year === 1809 ? `Every parish in the county is to mark the King’s Jubilee in October. Kintbury has voted an ox, and Inkpen a clock; and Hatherley tower has shown ten minutes past four since your uncle’s time.`
      : `The clock in Hatherley tower has shown ten minutes past four since your uncle’s time; and Thwaites of Clerkenwell will make a new one for a hundred and fifty pounds.` }
};
const lotOpen = id => !LATE[id] || !!(S.newLots && S.newLots[id] !== undefined);
function lateTick(){ if (S.dead || S.phase === 'end') return; S.newLots = S.newLots || {};
  for (const id in LATE) if (S.newLots[id] === undefined && LATE[id].when()) { S.newLots[id] = S.t; if (S.t > 0) S.notes.push(LATE[id].news()); } }

/* ---------- three works ---------- */
PROJECTS.vaccine = { fx:['+4 Goodwill'], effects:`Goodwill rises, and settles two higher.`, name:'Have the parish vaccinated for the cow-pox',
  line:'A surgeon scratches the arm with a lancet dipped in matter from the cow-pox. Dr Jenner has shown that a person so treated does not take the small-pox.',
  seasons:1, cost:() => 40, if:() => lotOpen('vaccine'),
  blurb:`A shilling an arm, for every child in the parish and as many grown persons as will come.`, gain:'Goodwill',
  done:() => { fl('vaccine'); add({goodwill:4});
    return `The surgeon from Newbury sets up in the vestry, with the cow-pox matter dried upon ivory points in a tin box; and between ten and four he does a hundred and thirty-one children, and nine grown persons, at a shilling an arm.

Old Dewey, who had the small-pox in ’61 and carries the marks of it, stands in the porch the whole day, to tell every mother going in that a child done at Kintbury has since been heard to low.

At Michaelmas the small-pox is at Kintbury and at Inkpen, where it buries eleven; and it does not come up the lane.`; }};
PROJECTS.lodge = { fx:['+4 Standing'], effects:`Standing rises, and settles two higher.`, name:'Build a lodge and iron gates on the London road',
  line:'A keeper’s lodge of flint and brick where the drive meets the road. The gates are cast at Reading and hung between stone piers.',
  seasons:2, cost:() => 280, if:() => lotOpen('lodge'),
  blurb:`The drive is shut at present by a hurdle, which callers lift for themselves.`, gain:'Standing',
  done:() => { fl('lodge'); add({standing:4});
    return `The lodge stands finished where the drive meets the London road, eight-sided, of flint with brick at the corners, and one chimney rising out of the middle of the roof; and the gates, which came from the Reading foundry upon two wagons, are hung between stone piers, with your crest in iron at the top of each.

A pensioner of the Berkshire Militia is put in with his wife, to open. In the first week he opens to the Tamworths’ carriage, to Lord Cullerne’s agent, and to the fishmonger’s cart; and to the fishmonger, as being the first of the three to arrive, he presents arms.`; }};
PROJECTS.clock = { fx:['+3 Goodwill', '+2 Standing'], effects:`Goodwill and standing both rise, and each settles one higher.`, name:'A clock for the church tower',
  line:'An eight-day clock by Thwaites of Clerkenwell, with one painted face to the street. It strikes the hours upon the tenor bell.',
  seasons:1, cost:() => 150, if:() => lotOpen('clock'),
  blurb:`The old clock stopped in your uncle’s time. The parish tells the hour by the sun, and by Mr Hartopp.`, gain:'Goodwill and standing',
  done:() => { fl('clock'); add({goodwill:3, standing:2});
    return `The clock is up in the church tower, by Thwaites of Clerkenwell, with one face to the street, a gilt hand, and a stroke upon the tenor bell that is heard at Long Barrow when the wind is south.

Until this week the men in the fields have left off when the farmer told them it was six; and Hartopp has been over to you about it twice.

“They stand and count it, sir. They count it aloud.”`; }};

/* ---------- three great works, and two follies ----------
   The great works open midway, and cost as much as a farm. The follies are listed from 1800, and may be built by a squire with four thousand pounds in hand or a rental of two thousand five hundred. */
PROJECTS.park = { fx:['+6 Standing', '+3 Household'], effects:`Standing rises, and settles three higher. The household pleased.`, name:'Lay out the park after Mr Repton',
  line:'Mr Repton paints the park as it is, and upon a flap of paper as it might be. A lake is dug, the kitchen garden is moved and four hundred trees are planted.',
  seasons:4, cost:() => 1800, if:() => lotOpen('park'),
  blurb:`He charges five guineas a day, and thirty more for the Red Book.`, gain:'Standing; the household',
  done:() => { fl('park'); add({standing:6, family:3});
    return `The park is finished to the Red Book. Where the cow pasture was there is a lake of nine acres, with an island in it; the kitchen garden has been carried a quarter of a mile off, behind a plantation; and the Wyvern road, which used to pass within sight of the windows, has been turned at your expense round the back of a hill.

Mr Repton comes over to see it; and having lifted the flap of his own drawing, he compares the one with the other for some time.

“The water is a little larger than I painted it, sir. I should charge the difference to Nature.”`; }};
PROJECTS.wing = { fx:['+8 Standing', '+4 Household', '+2 Henrietta'], effects:`Standing rises a good deal, and settles four higher. Henrietta and the household pleased.`, name:'Build a new wing, with a library of forty feet',
  line:'A wing upon the east side, of two storeys, in the same red brick. Below is a library with a bow window, and above it are four bedrooms.',
  seasons:4, cost:() => 2400, if:() => lotOpen('wing'),
  blurb:`The Hall has eleven bedrooms. The Tamworths have nineteen.`, gain:'Standing; Henrietta',
  done:() => { fl('wing'); add({standing:8, family:4}); reg('henrietta',2,'You built her the new wing');
    return `The new wing is roofed, glazed and papered: a library of forty feet below, with a bow to the park, and four bedrooms over it, so that the Hall has now fifteen. The books out of the old book-room, being set up in the new, fill one wall of it and a part of another; and the joiner desires to know what is to stand upon the rest.

A London bookseller supplies two hundred and ten feet of divinity and county history, in calf, at fourteen shillings the foot.`; }};
PROJECTS.modelfarm = { fx:['+ Home farm wheat an eighth more', '+ Every farm worth a twentieth more to let', '+3 Standing'], effects:`The home farm grows about an eighth more wheat, and every farm is worth a twentieth more to let. Standing rises, and settles one higher.`, name:'Rebuild the home farm as a model farmyard',
  line:'A square of brick buildings round a paved yard: feeding houses, a granary upon staddles and stalls for forty beasts. The dung is kept under cover.',
  seasons:3, cost:() => 1600, if:() => lotOpen('modelfarm'),
  blurb:`After the yard at Holkham, where every beast is fed by the bushel and weighed.`, gain:'More wheat, and better rents; standing',
  done:() => { fl('modelfarm'); S.improve += 2; add({standing:3});
    return `The new yard at the home farm is finished, four-square, in brick, with a clock turret over the granary; and there are forty bullocks tied up in it, each having his name, his weight at Michaelmas, and what he has eaten since, chalked upon a board above his head.

Gentlemen come from as far as Abingdon to walk round it. The bailiff, who has the boards to chalk, has asked for a boy that can write.`; }};
const follyWhy = () => S.money >= 4000 || rentalNow() >= 2500 ? '' : 'A folly is for a man with £4,000 in his purse, or a rental of £2,500. You have ' + fmt(Math.max(0, Math.floor(S.money))) + ', and a rental of ' + fmt(Math.round(rentalNow())) + '.';
const follyIf = () => S.year >= 1800 && !follyWhy(), follyEarly = () => S.year >= 1800 ? follyWhy() : '';
PROJECTS.tower = { fx:['+6 Standing'], effects:`Standing rises, and settles two higher.`, name:'A Gothic tower upon the Down',
  line:'Eighty feet of flint, with a stair, battlements and a room at the top to dine in. It is of no use, and is seen from three counties.',
  seasons:3, cost:() => 1200, if:follyIf, early:follyEarly,
  blurb:`Lord Cullerne has an obelisk. It is forty feet.`, gain:'Standing',
  done:() => { fl('tower'); add({standing:6});
    return `The tower stands finished upon the Down, eighty feet of flint and brick, with a stair of a hundred and thirty steps, and a room at the top where six may dine, if the dinner can be got up to them hot.

From the leads upon a clear day there may be counted nine church spires, and the smoke of Reading. Lord Cullerne, who has had an obelisk of forty feet these thirty years, rides over to look; and having walked once round the foot of it, he asks the mason what it is for.

“For the view, my lord.”

“Ain’t there a hill?”`; }};
PROJECTS.hermitage = { fx:['+4 Household', '+3 Standing'], effects:`The household pleased. Standing rises, and settles one higher.`, name:'A hermitage in Cuckoo Copse, and a hermit',
  line:'A hut of roots and bark beside the spring, with a stone seat and a skull. A man is hired to live in it, and to be seen at a distance by company.',
  seasons:1, cost:() => 350, if:follyIf, early:follyEarly,
  blurb:`He is to have fifty pounds a year, a Bible, an hour-glass and a hair shirt, and is not to cut his nails.`, gain:'The household; standing',
  done:() => { fl('hermitage'); add({family:4, standing:3});
    return `The hermitage is built in Cuckoo Copse, of roots and bark, with a skull upon the table; and a hermit is found by advertisement in the Mercury, a man of sixty from Hungerford, who engages for seven years at fifty pounds, and is to wear a beard, speak to nobody, and be seen reading.

He is shown to the Tamworths upon the first fine Sunday, at forty yards, and gives great satisfaction. In the third week Mudge reports that the beard has been seen in the tap of the Bell, with the hermit behind it; and the place is filled at Michaelmas by a second, who brings his own hour-glass.`; }};

/* ---------- six ventures, and two great ones ---------- */
const gasPrice = v => { v.px = v.px || {}; let p = 50;
  for (let y = v.year + 1; y <= S.year; y++) { if (v.px[y] === undefined) v.px[y] = y === v.year + 1 ? Math.round(p - 22 + Math.random() * 24) : Math.max(15, Math.round(p - 8 + Math.random() * 44)); p = v.px[y]; }
  return p; };
Object.assign(VENTURES, {
  southdown:{ fx:['+£55 a year in wool and draft ewes', MINUS + '£40 in a year of rot', '+£180 if sold'], risk:1, odds:{"well": 0.75, "dull": 0.15, "ill": 0.1}, effects:`About £55 a year. £40 lost in a wet year, if the rot comes. The flock sells for £180.`,
    name:'A Southdown flock', line:'Mr Ellman’s breed from Glynde in Sussex, black in the face and short in the leg. You buy two rams and sixty ewes at Lewes fair.', where:'The Down', cost:260,
    well:'Mutton that the London butchers ask for by name, and a fleece of three pounds.', ill:'A down sheep rots in a wet summer like any other.', state:v => 'On the Down since ' + v.year,
    endLabel:'Sell the flock', end:() => { S.money += 180; return `The Southdowns are sold at Ilsley fair in one lot, and make £180.`; }},
  coach:{ fx:['+£70 a year', MINUS + '£45 when a horse is lost', '+£300 if sold'], risk:1, odds:{"well": 0.75, "dull": 0.1, "ill": 0.15}, effects:`About £70 a year from the fares. A horse lost now and then, £45. The share sells for £300.`,
    name:'A share in the Wyvern coach', line:'The Defiance runs from the George at Wyvern to the Bell Savage on Ludgate Hill in nine hours. Each proprietor finds the horses for one stage of the road.', where:'The London road', cost:400,
    well:'Four insides and ten out, every day but Sunday, at fourpence a mile.', ill:'A coach horse lasts four years upon a fast stage.', state:v => 'Horsing the Hatherley stage since ' + v.year,
    endLabel:'Sell the share', end:() => { S.money += 300; return `Your share in the Defiance, with the eight horses of the Hatherley stage, goes to the landlord of the George for £300.`; }},
  plait:{ fx:['+£22 a year', '+2 Goodwill', MINUS + ' Ended by a peace'], risk:1, odds:{"well": 0.7, "dull": 0.3, "ill": 0}, effects:`About £22 a year while Italian straw is kept out by the war. Goodwill settles two higher while the school is kept. A peace ends it.`,
    name:'A straw-plait school', line:'A room over the wheelwright’s, and a woman from Dunstable to teach. The girls split wheat straw and plait it by the score of yards for the hat-makers.', where:'Kintbury Lane', cost:60,
    no:() => S.year >= 1815 ? 'The Dunstable dealers buy no English plait since the peace.' : '',
    well:'A girl of nine can earn three shillings a week at it, and the school takes a penny in the shilling.', ill:'The trade lives upon the war.', state:v => 'Forty girls plaiting since ' + v.year,
    endLabel:'Shut the school', end:() => `The plait school is shut, and the woman from Dunstable has her coach fare home.` },
  papermill:{ fx:['+£110 a year while the war lasts', '+£150 a year in peace', MINUS + '£250 and the mill, if the drying loft takes fire', '+£600 if sold'], risk:2, odds:{"well": 0.65, "dull": 0.2, "ill": 0.15}, effects:`£110 a year while rags are at the war price, and £150 in peace. If the loft takes fire the mill is gone, and £250 with it. Sells for £600.`,
    name:'A paper mill on the Kennet', line:'A vat mill below Hatherley Mill, with a rag-house and a drying loft. It makes writing paper, and the blue paper that sugar loaves are wrapped in.', where:'The Mill', cost:900,
    well:'Every attorney between Reading and Bath writes upon somebody’s paper.', ill:'The loft is of deal, and is full of paper.', state:v => 'Making paper since ' + v.year,
    endLabel:'Sell the mill', end:() => { S.money += 600; return `The paper mill is sold to the Thatcham maker for £600, with the vats, the moulds and eleven hundredweight of rags.`; }},
  gaslight:{ fx:['No dividend as yet', '+ or ' + MINUS + ' the price of the day when sold'], risk:2, odds:{"well": 0.45, "dull": 0.25, "ill": 0.3}, effects:`Ten shares at £50. The company has paid no dividend. They sell at the price of the day, which may be above fifty or a good deal below.`,
    name:'Ten shares in the Gas Light and Coke Company', line:'The company has the King’s charter to light London with gas made from coal. It is laying iron pipes under the streets of Westminster.', where:'Westminster', cost:500,
    well:'Pall Mall has been lit with it, and nobody was killed.', ill:'Sir Humphry Davy asks whether they mean to take the dome of St Paul’s for a gasometer.',
    state:v => 'Ten shares, at ' + gasPrice(v) + ' to-day',
    endLabel:'Sell the shares', end:v => { const p = gasPrice(v) * 10; S.money += p; return `Mr Tidmarsh’s London agent has sold your ten gas shares at ${gasPrice(v)}. It comes to ${fmt(p)}.`; }},
  brewery:{ fx:['+£380 a year', '+£120 a year more while you hold the malthouse', MINUS + '£150 in a year of famine prices', '+£2,400 if sold'], risk:2, odds:{"well": 0.7, "dull": 0.1, "ill": 0.2}, effects:`About £380 a year, and £120 more while the malthouse is yours. £150 lost in a year of famine prices. Sells for £2,400.`,
    name:'Sims’s brewery at Wyvern', line:'The brewhouse in the Butts, with a copper of forty barrels and four drays. Nine public houses are tied to take its beer.', where:'Wyvern', cost:3500,
    well:'Nine houses that may sell no beer but yours.', ill:'Malt is taxed and beer is taxed; and when bread is dear the labourer drinks water.', state:v => 'Brewing since ' + v.year,
    endLabel:'Sell the brewery', end:() => { S.money += 2400; return `The brewery is sold to a Reading house for £2,400, with the copper, the drays and the nine public houses.`; }},
  wharf:{ fx:['+£260 a year in tolls and wharfage', '+2 Goodwill', MINUS + '£90 in a dry summer'], risk:1, odds:{"well": 0.8, "dull": 0.05, "ill": 0.15}, effects:`About £260 a year in tolls and wharfage. Goodwill settles two higher, coal being cheaper. £90 lost when the cut is shut for want of water.`,
    name:'A cut from the canal to Hatherley wharf', line:'A mile and three furlongs of canal, with two locks, from the Kennet and Avon to a wharf below the mill. Coal comes up it, and corn goes down.', where:'The Mill', cost:3000,
    well:'Somerset coal upon the wharf at eighteen shillings the ton, which was thirty by wagon.', ill:'Two locks drink a great deal of water in August.', state:v => 'Open to barges since ' + v.year },
  indiaman:{ fx:['+£1,100 if she comes home full', '+£520 if the market is dull', MINUS + ' The share lost if she does not come home'], risk:3, odds:{"well": 0.45, "dull": 0.35, "ill": 0.2}, effects:`One voyage to Bombay and home, about eighteen months. £1,100 if she comes home full, £520 if the market there is dull, and nothing if she is lost or condemned.`,
    name:'A sixteenth of the Hetty, for Bombay', line:'The Bristol privateer, with her guns out and a new copper bottom. Since April any British ship may trade to India, which till now was the Company’s alone.', where:'The Hetty, 300 tons', cost:500,
    no:() => S.year > 1814 || (S.year === 1814 && S.season === 3) ? 'She sailed with the September convoy, and takes no more owners until she is home.' : '',
    well:'Cotton piece goods, pepper and indigo, bought at Bombay with Birmingham hardware.', ill:'She was built to chase luggers in the Channel.', state:() => 'Sailed for Bombay in 1814' }
});
const ventureTickLate = ventureTick;
ventureTick = function(line){ ventureTickLate(line); lateTick(); brazSync(); if (!S.vent) return; const y = S.year, q = S.season, earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  if (live('southdown') && q === 1 && y > vent('southdown').year) { if (WEATHER[y] <= 0.85 && chance(0.5)) { line('Southdowns lost by the rot', -40); S.notes.push('It has been a wet summer upon the Down, and the shepherd has buried nineteen of the Southdowns.'); } else earn('Southdown wool and draft ewes', 55); }
  if (live('coach') && q === 3 && y > vent('coach').year) { if (chance(0.15)) { line('The Defiance: a wheeler dead in the collar', -45); S.notes.push('The Defiance came down Speen hill on Tuesday with a new coachman; and the near wheeler of your team, which was nine years old, fell dead at the George door.'); } else earn('Share of the Wyvern coach', 70); }
  if (live('plait') && q === 1 && y > vent('plait').year) { if (y >= 1815) { earn('The plait school', 5); stopVenture('plait', 'Ended by the peace');
      S.notes.push('Leghorn hats are in the London shops again since the peace, and at half the price; and the Dunstable dealer, who gave fourteenpence the score for Hatherley plait, has not called since March.'); }
    else earn('The plait school', 22); }
  if (live('papermill') && q === 3 && y > vent('papermill').year) { if (chance(0.05)) { stopVenture('papermill', 'Burnt'); line('The paper mill, burnt to the wheel', -250);
      S.notes.push('The drying loft of the paper mill took fire on Thursday night from a candle, and burnt until morning; the Sun Fire Office, having read its policy, will pay for the wheel.'); }
    else earn('The paper mill', y >= 1814 ? 150 : 110); }
  if (live('brewery') && q === 3 && y > vent('brewery').year) { if (PRICES[y] >= 100) { line('The brewery, in a dear year', -150); S.notes.push('Bread being at famine price, the nine houses have drawn less beer in the year than in a common harvest month; and the brewery has cost you a hundred and fifty pounds to keep open.'); } else earn('Sims’s brewery, and the nine houses', 380 + (live('malthouse') ? 120 : 0)); }
  if (live('wharf') && q === 2 && y > vent('wharf').year) { if (chance(0.15)) { line('The cut, shut six weeks for want of water', -90); S.notes.push('There has been no rain since June, and the cut to Hatherley wharf was shut six weeks, with nine barges of coal lying in it upon the mud.'); } else earn('Tolls and wharfage, Hatherley wharf', 260); }
  if (live('indiaman') && y === 1815 && q === 2) { const v = vent('indiaman'), r = v.fate === undefined ? Math.random() : v.fate;
    if (r < 0.45) { earn('A sixteenth of the Hetty’s cargo from Bombay', 1100); stopVenture('indiaman', 'Home from Bombay'); S.notes.push('The Hetty is in King Road from Bombay, in a hundred and thirty-one days, with cotton piece goods, pepper and indigo; and Bristol, which has had the Company’s prices for two hundred years, has bought the whole at the ship’s side.'); }
    else if (r < 0.8) { earn('A sixteenth of the Hetty’s cargo from Bombay', 520); stopVenture('indiaman', 'Home from Bombay'); S.notes.push('The Hetty is home from Bombay; where, eleven other free traders having arrived in the same month with the same Birmingham hardware, she sold hers by the hundredweight.'); }
    else { stopVenture('indiaman', 'Condemned at Bombay'); S.notes.push('The Bristol agents write that the Hetty was surveyed at Bombay after her passage, and condemned as unfit to come home; and her hull has been sold there to a Parsee, for a sum which does not reach to sixteenths.'); } }
};
const marksLate = marks;
marks = function(){ const m = marksLate(), put = (k, n, t) => { if (n) { m.why[k].push((n > 0 ? '+' : MINUS) + Math.abs(n) + ' ' + t); m[k] = clamp(m[k] + n, 5, 95); } };
  put('goodwill', F('vaccine') ? 2 : 0, 'The parish vaccinated'); put('standing', F('lodge') ? 2 : 0, 'The lodge and gates'); put('goodwill', F('clock') ? 1 : 0, 'The church clock'); put('standing', F('clock') ? 1 : 0, 'The church clock');
  put('goodwill', live('plait') ? 2 : 0, 'The plait school'); put('goodwill', live('wharf') ? 2 : 0, 'Coal at Hatherley wharf');
  put('standing', F('park') ? 3 : 0, 'Mr Repton’s park'); put('standing', F('wing') ? 4 : 0, 'The new wing'); put('standing', F('modelfarm') ? 1 : 0, 'The model farmyard'); put('standing', F('tower') ? 2 : 0, 'The tower upon the Down'); put('standing', F('hermitage') ? 1 : 0, 'The hermitage');
  return m; };

/* ---------- the Brazil Association, on the Ventures page ----------
   The papers go on as they did (bubbleTip, bubbleRise, bubbleCall, bubbleEnd in estate.js) and S.bub is still the whole account.
   This puts the shares in the book beside the Funds, where they may be bought and sold between papers at the price of the day.
   Bought at the price and sold at two under it, and no proprietor is allotted above forty: so there is nothing to be made by turning them over in one quarter. */
const brazPrice = () => { const b = bub(); return !b.rose ? 70 : !b.called ? 100 : b.fate === 'gone' ? 75 : 95; };
VENTURES.brazil = { fx:() => ['+ or ' + MINUS + ' the price of the day when sold. It is ' + brazPrice() + ' now', MINUS + ' Calls upon every share, if the Directors make them'], risk:4, odds:{"well": 0.2, "dull": 0.45, "ill": 0.35},
  effects:`Ten shares at the price of the day. They sell at two pounds under it. A proprietor answers for every call the Directors make.`,
  name:'Ten shares in the Brazil Association', line:'Mr Quill’s company at the Jerusalem Coffee-house, for sending British goods to Rio. The Mercury prints the price of its shares on Saturdays.', where:'Cornhill',
  get cost(){ return 10 * brazPrice(); },
  no:() => { const b = bub(); return b.done ? 'The list is shut.' : b.shares >= 40 ? 'Mr Quill allots no proprietor above forty shares.' : ''; },
  well:'A ship at sea, a list of Directors, and a price that has risen every Saturday.', ill:'It has no charter. Every proprietor answers for its debts with all he has.',
  begin:() => { const b = S.bub, at = brazPrice(); b.shares += 10; b.paid = (b.paid || 0) + 10 * at; },
  state:() => cap1(numWords(bub().shares)) + ' shares, at ' + brazPrice() + ' to-day',
  get endLabel(){ return 'Sell them at ' + (brazPrice() - 2); },
  canEnd:() => !bub().done, endWhy:'No broker will name a price until the Directors have met.',
  end:() => { const b = S.bub, n = b.shares, at = brazPrice() - 2, p = at * n; b.shares = 0; S.money += p; fl('bubbleOut');
    return `Mr Tidmarsh’s London agent has sold your ${numWords(n)} Brazil shares at ${at}. It comes to ${fmt(p)}.`; } };
/* Keeps the page in step with the papers: shares taken by a paper appear in the book, and shares sold or forfeited by one leave it. */
function brazSync(){ const b = S.bub; if (!b || !b.tipped) return; S.vent = S.vent || {}; const v = S.vent.brazil;
  if (b.shares > 0 && (!v || v.ended)) S.vent.brazil = {year:S.year, t:S.t};
  else if (b.shares <= 0 && v && !b.done && !b.kept) delete S.vent.brazil;
  else if (b.shares <= 0 && v && !v.ended) { v.ended = S.year; v.how = b.kept ? 'Kept in the deed box' : F('bubbleMade') ? 'Paid off at £250 a share' : F('bubbleBurnt') ? 'Stopped payment' : 'Sold'; } }

/* The book lists a late lot only from the quarter it was announced, and the Brazil shares only while there is a Brazil Association. */
const venturesListAll = venturesList;
venturesList = function(){ if (S) brazSync();
  return venturesListAll().filter(v => (lotOpen(v.id) || v.state !== 'open') && (v.id !== 'brazil' || (S.bub && S.bub.tipped && (v.state !== 'open' || !S.bub.done)))); };

/* ---------- Mr Crabbe's opinion of his master ----------
   Until now nothing but a handful of papers moved it. He keeps the book, and judges by the book: a year that closes to the good, principal paid off, a rental that rises
   and a master who rides his farms all count with him; tradesmen at the office door, new borrowing, annuities, felled oaks and money put out at hazard count against.
   The points gather in S.stew, and at four (and two more for every step he already stands above Civil) he rises a step, and at three against him he falls one, with a line in the memoranda and a note against his name.
   A steward who is Fond finds money in the tradesmen's bills at Lady Day; one who is Cold loses some. Mr Lark, who has no page among the Persons, is not reckoned. */
const STEW_UP = {
  gain:n => `Crabbe, having cast the year twice, and found it ${pounds(n)} to the good both times, has brought the book up to the library himself, and laid it open at the page.`,
  paid:() => `Crabbe has written the payment into the mortgage account in red ink, which he keeps for that purpose; and Mrs Bunce says that he had to send to Wyvern for the bottle.`,
  clear:() => `The deed box is come home from the lender’s attorney, with whom it has lain since your uncle’s time; and Crabbe, who carried it up from the gig himself, has asked leave to buy a new lock for it.`,
  ride:() => `Crabbe, having ridden the round of the farms behind you, has taken a penknife to three figures in the rental, and written a larger over each.`,
  rent:() => `The rental at Lady Day stands higher than Crabbe has ever had to write it; and he has written it this year upon a fresh skin, in the large hand.`,
  works:() => `Crabbe has begun to walk strangers round the new works on a Sunday; and he tells them what each of them cost, to the shilling.` };
const STEW_DOWN = {
  red:() => `Crabbe has had the chandler, the saddler and the coal merchant in the estate office within the week; and when he brings the book up now, he lays it upon the table shut.`,
  loss:n => `Crabbe has cast the year, and found it ${pounds(n)} to the bad; and he has left the figure in pencil.`,
  borrow:() => `Crabbe, upon being told of the new mortgage, asks only for the lender’s name; which he writes at the head of a clean page, and rules the page for twenty years.`,
  annuity:() => `The annuity office having sent down its surgeon to look at you, Crabbe walked the man back to the gate; and he has since asked Mrs Bunce twice how you slept.`,
  timber:() => `Crabbe was at the felling in Hanger Wood from the first tree to the last, with the rental under his arm; and he has entered the oaks in it, by number, upon the side where he enters what is gone.`,
  hazard:() => `Crabbe has entered the new venture in the book under “Sundries”; there being, he says, no other head that will take it.`,
  rent:() => `The rental at Lady Day is less than it was a twelvemonth since; and Crabbe, who reads it out to you every year standing, has this year asked for a chair.` };
const STEW_NOTE = { gain:'The year closed to the good', paid:'You paid off principal', clear:'You cleared the mortgage', ride:'You rode the farms with him', rent:'The rental rose', works:'You laid money out upon the land, and had it to lay',
  red:'He answered the tradesmen for you', loss:'The year closed to the bad', borrow:'You borrowed again upon the land', annuity:'You sold an annuity upon your life', timber:'You felled the oaks', hazard:'You put money out at hazard' };
const stewOn = () => !!S && !F('crabbeGone') && !S.dead && S.phase !== 'end';
const stewOf = () => (S.stew = S.stew || {pts:0, up:'', down:'', n:0});
function stewScore(n, kind, sum){ if (!stewOn()) return; const s = stewOf(); s.pts += n; if (n > 0) { s.up = kind; if (sum) s.n = sum; } else { s.down = kind; if (sum) s.n = sum; } }
function stewSettle(){ if (!stewOn()) return; const s = stewOf(), c = S.chars.crabbe, need = 4 + 2 * Math.max(0, c.r);
  if (s.pts >= need && c.r < 4) { const k = STEW_UP[s.up] ? s.up : 'gain'; s.pts = 0; reg('crabbe', 1, STEW_NOTE[k]); S.notes.push(STEW_UP[k](s.n || 300)); }
  else if (s.pts <= -3 && c.r > -4) { const k = STEW_DOWN[s.down] ? s.down : 'red'; s.pts = 0; reg('crabbe', -1, k === 'rent' ? 'The rental fell' : STEW_NOTE[k]); S.notes.push(STEW_DOWN[k](s.n || 300)); }
  s.pts = clamp(s.pts, -5, need + 2); }
const stewWorth = () => Math.round(S.money - S.mortgage + ownLandValue());
const regardQuarterStew = regardQuarter;
regardQuarter = function(line){ regardQuarterStew(line); if (!stewOn()) return; const s = stewOf(), q = S.season, c = S.chars.crabbe;
  if (S.money < 0) stewScore(estIdx() >= 2 ? -2 : -1, 'red');
  if (q === 3) { const now = stewWorth(); if (s.y0 !== undefined) { const d = now - s.y0;
      if (d >= 1000) stewScore(2, 'gain', Math.round(d / 50) * 50); else if (d >= 300) stewScore(1, 'gain', Math.round(d / 10) * 10); else if (d <= -300) stewScore(d <= -1000 ? -2 : -1, 'loss', Math.round(-d / 10) * 10); }
    s.y0 = now; }
  if (q === 0) { const r = Math.round(rentalNow()); if (s.r0 !== undefined) { if (r > s.r0 + 20) stewScore(1, 'rent'); else if (r < s.r0 - 20) stewScore(-1, 'rent'); } s.r0 = r;
    if (c.r >= 3) { const a = 20 + 10 * c.r; line('Found by Mr Crabbe in the tradesmen’s bills', a, 'He goes through them twice for a master he thinks well of.'); }
    else if (c.r <= -3 && !F('crabbeSkims') && !T('figures')) line('“Sundries” (Mr Crabbe)', -30, 'He does not go through the bills for a master he thinks ill of.', 1); }
  stewSettle(); };
{ const credit = takeCredit; takeCredit = function(id){ const ok = credit(id); if (ok) { if (id === 'repay') stewScore(S.mortgage ? 1 : 2, S.mortgage ? 'paid' : 'clear'); else if (id === 'mortgage') stewScore(-1, 'borrow'); else if (id === 'annuity') stewScore(-2, 'annuity'); else if (id === 'timber') stewScore(-1, 'timber'); else if (id === 'redeem') stewScore(1, 'paid'); save(); } return ok; };
  const work = beginWork; beginWork = function(id){ const ok = work(id); if (ok) { const s = stewOn() && stewOf(); if (S.money < 0) stewScore(-1, 'red'); else if (s && s.built !== S.year) { s.built = S.year; stewScore(1, 'works'); } save(); } return ok; };
  const venture = beginVenture; beginVenture = function(id){ const d = VENTURES[id], ok = venture(id); if (ok && d && d.risk >= 3) { stewScore(-1, 'hazard'); save(); } return ok; };
  const ride = UNDERTAKINGS.find(u => u.id === 'ride'), go = ride.go; ride.go = function(){ const s = stewOn() && stewOf(); if (s && s.rode !== S.year) { s.rode = S.year; stewScore(1, 'ride'); } return go(); }; }

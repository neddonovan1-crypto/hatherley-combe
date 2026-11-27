/* Every farm has two works of its own and one venture, and the Home Farm a second work.
   An "order" work puts the farm up a grade, as the barns at Church Farm do. A "worth" work adds a fraction to what the farm will let for, kept on the farm as f.imp.
   A farm's venture is had only while the farm is yours, and is sold with it. Places are given in WORK_AT and VENT_AT in plan.js. */
const farmFPlain = farmF;
farmF = function(f){ return farmFPlain(f) * (1 + (f.imp || 0)); };
const FARM_NAMES = {longbarrow:'Long Barrow', church:'Church Farm', coldharbour:'Coldharbour', starveall:'Starveall', commonpiece:'Common Piece', rooksnest:'Rooksnest', withymead:'Withy Mead', maddle:'Maddle'};
const orderWork = (id, of, cost, o) => { PROJECTS[id] = Object.assign({seasons:2, cost:() => cost, if:() => !!farm(of) && farm(of).cond < 4, gain:FARM_NAMES[of] + ' in better order',
  fx:() => rentLine(of, rentGain(of, f => { f.cond = Math.min(4, f.cond + 1); })),
  done:() => { const f = farm(of); if (!f) return `The work is finished. The farm it was done upon is no longer yours.`; f.cond = Math.min(4, f.cond + 1); return o.said(f); }}, o); };
const worthWork = (id, of, cost, part, o) => { PROJECTS[id] = Object.assign({seasons:1, cost:() => cost, if:() => !!farm(of), gain:FARM_NAMES[of] + ' worth more to let',
  fx:() => rentLine(of, share(of, part)),
  done:() => { const f = farm(of); if (!f) return `The work is finished. The farm it was done upon is no longer yours.`; f.imp = (f.imp || 0) + part; return o.said(f); }}, o); };
const entered = f => `${steward()} enters the farm as ${ORDER_W[f.cond].toLowerCase()}`;

/* Long Barrow */
worthWork('lbfold', 'longbarrow', 220, 0.07, { name:'A sheep-house and lambing yards at Long Barrow',
  line:'A house of flint and thatch for six hundred ewes, under the lee of the barrow, with yards hurdled off for the lambing. The flock has hitherto lambed upon the open down, in March.',
  blurb:`The shepherd at Long Barrow lost ninety lambs to the snow of one March night, and can show you the hollow.`,
  said:() => `The sheep-house at Long Barrow is thatched, and the yards are hurdled; and the shepherd, who has slept thirty Marches under a hedge, has moved his bed into the hay at one end of it.` });
/* Church Farm */
worthWork('churchhouse', 'church', 300, 0.07, { seasons:2, name:'A new farmhouse at Church Farm',
  line:'The old house is of timber and plaster, with the dairy under the same thatch as the kitchen. A square house of brick and slate is built beside it, and the old one left to the carter.',
  blurb:`A tenant with capital looks at the house before he looks at the land; and the house at Church Farm has a prop under the parlour beam.`,
  said:() => `The new house at Church Farm has its slates on, a parlour with a sash window, and a bell-pull that rings in the kitchen; which last the farmer’s wife has had tried by every one of her acquaintance.` });
/* Coldharbour */
orderWork('coldyards', 'coldharbour', 320, { name:'New yards and a cart-lodge at Coldharbour',
  line:'Walled yards for the cattle to winter in, an open lodge of six bays for the wagons, and a tank under all, to keep what runs from the dung.',
  blurb:`The wagons at Coldharbour stand out in the rain, and the best of the dung goes down the lane to the turnpike ditch.`,
  said:f => `The yards at Coldharbour are walled, and the cart-lodge is tiled; and having walked twice round the dung tank, and looked into it, ${entered(f)}.` });
worthWork('coldclover', 'coldharbour', 180, 0.08, { name:'Turnips and clover at Coldharbour',
  line:'The loam at Coldharbour will carry the four-course as well as any ground in Norfolk. You find the seed for the first two years, and the tenant gives up his fallow by covenant.',
  blurb:`One field in three at Coldharbour lies bare every summer, as it lay under Queen Anne.`,
  said:() => `There are turnips where the fallow was at Coldharbour, and sheep folded upon them; and the covenant against two white crops running is written into the agreement, in ${steward()}’s smallest hand.` });
/* Starveall */
orderWork('starveburn', 'starveall', 70, { seasons:1, name:'Pare and burn the old turf at Starveall',
  line:'The sward is cut with the breast-plough, dried in heaps and burnt, and the ashes are spread. It gives three good crops upon ground that never gave one.',
  blurb:`Sixty acres at Starveall have a skin of moss and bent upon them, which no plough in the parish will enter.`,
  said:f => `Sixty acres of turf have burnt in heaps at Starveall for a fortnight, with a smoke that Wyvern took for the beacon; and the ashes being now spread, and rape sown in them, ${entered(f)}.` });
worthWork('starvepond', 'starveall', 60, 0.12, { name:'A dew-pond and a well at Starveall',
  line:'A pond is puddled with clay and straw upon the top of the hill, to fill from the mists; and a well is sunk in the yard, which must go down two hundred feet before it finds the springs.',
  blurb:`Every drop that the stock drink at Starveall comes up from the valley in a water-cart, behind one horse.`,
  said:() => `The well at Starveall found water at a hundred and ninety feet, and the pond upon the hill has held since the first wet night. The water-cart is to be sold.` });
/* Common Piece */
orderWork('cplime', 'commonpiece', 180, { name:'Grub the furze and lime Common Piece',
  line:'The furze stools are stocked up by the roots and burnt, and lime is laid on at three wagon-loads to the acre. Old common is sour ground until it has had both.',
  blurb:`The plough at Common Piece turns up a furze root at every second yard, and the wheat that follows it comes yellow.`,
  said:f => `The furze at Common Piece is stocked up and burnt, to the last root, and the lime is harrowed in. The tenant has ploughed a furrow from hedge to hedge without once stopping his horses; and ${entered(f)}.` });
worthWork('cpcloses', 'commonpiece', 120, 0.1, { name:'Divide Common Piece into six closes',
  line:'Three hundred acres within one ring fence are parted by quickset hedges and ditches into six fields, with a gate to each, and a pond where three of them meet.',
  blurb:`There is not a hedge inside the ring fence at Common Piece; and stock turned into the clover at morning are found by evening in the wheat.`,
  said:() => `Common Piece lies in six closes, each with a white gate and a name. The tenant’s wife had the naming of them; and the furthest from the house is Botany Bay.` });
/* Rooksnest */
orderWork('rookdrain', 'rooksnest', 260, { name:'Drain the wet fields at Rooksnest',
  line:'The springs break out along the foot of the hanger, and sour forty acres below it. A deep drain is cut across the slope to take them at the source, upon the plan of Mr Elkington, to whom Parliament has voted a thousand pounds for it.',
  blurb:`Rushes grow in the wheat under the hanger at Rooksnest, and the plough horses go in to the hock.`,
  said:f => `One drain of five feet, cut along the foot of the hanger, runs at Rooksnest like a brook; and the forty acres under it, upon which a man could not walk dry in June, having now borne a loaded wagon, ${entered(f)}.` });
worthWork('rookgranary', 'rooksnest', 130, 0.07, { name:'A granary upon staddles at Rooksnest',
  line:'A boarded granary is set upon nine stone staddles, out of the reach of rats, with stabling for the plough teams under the same roof.',
  blurb:`At Rooksnest the threshed corn lies in the garret over the tenant’s bed, where he hears the rats at it.`,
  said:() => `The granary at Rooksnest stands upon its nine staddles, and will hold two hundred quarters. The farm cat has been carried up the steps, and shut in.` });
/* Withy Mead */
orderWork('withybank', 'withymead', 240, { name:'Bank the Lambourn at Withy Mead',
  line:'A bank of clay and turf, half a mile long, is thrown up between the river and the mowing ground, with two hatches in it, to let the water on in winter and keep it off in June.',
  blurb:`The Lambourn comes over the hay at Withy Mead one summer in three, and leaves it grey.`,
  said:f => `The bank at Withy Mead is turfed, and the hatches are hung. The river rose a foot upon it in the first week, stood a day against the top of the turf, and went down again; and ${entered(f)}.` });
worthWork('withybarn', 'withymead', 130, 0.08, { name:'A hay barn at Withy Mead, and a hard road to it',
  line:'An open barn of ten bays upon brick piers, and a causeway of flint from the mead to the turnpike. Hay is five pounds the load at the London inns, when it can be got there.',
  blurb:`The hay at Withy Mead is ricked where it is mown; and from Michaelmas to May no wagon can come at the ricks.`,
  said:() => `There is a hay barn of ten bays at Withy Mead, and a flint road to its door; and a load of hay has gone up to Wyvern in January upon wheels, which the oldest man in the mead had never seen done.` });
/* Maddle */
orderWork('maddlehouse', 'maddle', 400, { name:'Rebuild the house and barns at Maddle',
  line:'The farmstead at Maddle is of cob under thatch, and one gable of the barn is held up by a rick. House, barn and stable are built new, in flint and brick.',
  blurb:`Nine miles from a market, and the wind off the down in every bedroom: no tenant has stayed out his term at Maddle these thirty years.`,
  said:f => `Maddle has a house of flint and brick, with a barn that stands upon both its gables; and ${entered(f)}.` });
worthWork('maddlesainfoin', 'maddle', 260, 0.1, { name:'Sainfoin on the down ground at Maddle',
  line:'Sainfoin roots twenty feet into the chalk, and stands ten years where clover dies in one. Two hundred acres of the thin down are sown with it, at four bushels to the acre.',
  blurb:`Two hundred acres at Maddle keep one sheep to the acre, in a good summer.`,
  said:() => `The sainfoin at Maddle has come up red over two hundred acres of the down; and the first cutting of it has gone a ton and a half to the acre.` });
/* The Home Farm */
PROJECTS.homeyards = { fx:['+£40 a year in fat beasts'], effects:`About £40 a year in fat beasts.`, name:'Stalls and a turnip-house at the Home Farm',
  line:'Twenty bullocks are bought lean at Michaelmas, tied up in stalls, and fed upon turnips and oil-cake until they are fit for Smithfield. Their dung goes upon the wheat.',
  seasons:2, cost:() => 280, blurb:`The home farm sells its turnips to the tenants, and buys its dung of the Wyvern inns.`, gain:'Fat beasts to sell every year',
  done:() => { fl('homeYards', S.year); return `The stalls at the Home Farm are up, and twenty Herefords are tied in them, with a boy to slice their turnips; and upon the first of every month ${steward()}, the cowman and the boy each guess the weight of every beast, and enter it.`; }};

/* The ventures. */
Object.assign(VENTURES, {
  dairy:{ farm:'church', fx:['+£45 a year', '+£15 when the cheeses heave', '+£120 if sold'], risk:1, odds:{"well": 0.8, "dull": 0.2, "ill": 0}, effects:`About £45 a year from the factor, and £15 in a year when the cheeses heave. The cows sell for £120.`,
    name:'A cheese dairy at Church Farm', line:'Thirty cows, a dairy-woman out of Wiltshire, and a cheese-room with a north window. The cheeses are of the thin Gloucester make, and go to Reading at Michaelmas in the factor’s wagon.', where:'Church Farm', cost:260, if:() => !!farm('church'),
    well:'About £45 a year, from the factor at Reading.', ill:'In a thundery June the cheeses heave, and the factor will not look at them.', state:v => 'Making cheese since ' + v.year,
    endLabel:'Sell the cows', end:() => { S.money += 120; return `The cows are sold at Wyvern for £120 upon a market day; and the dairy-woman goes home to Wiltshire by the carrier, with the cheese-press, which was her own.`; }},
  hops:{ farm:'coldharbour', fx:['+£170 in a great year', '+£70 in a common one', MINUS + '£40 when the blight takes them'], risk:3, odds:{"well": 0.3, "dull": 0.4, "ill": 0.3}, effects:`£170 in a great year, £70 in a common one, and £40 lost when the blight takes them.`,
    name:'A hop garden at Coldharbour', line:'Twelve acres are planted with hops and poled, and an oast is built to dry them. The price is made at Weyhill fair in October, where a pocket has fetched four pounds one year and fourteen the next.', where:'Coldharbour', cost:320, if:() => !!farm('coldharbour'),
    well:'In a short year for Kent and Farnham, £170.', ill:'The fly, the mould and the blast; and the poles to buy again every fourth year.', state:v => 'Poled since ' + v.year,
    endLabel:'Grub the hops', end:() => `The hops at Coldharbour are grubbed, and the ground is in wheat. The poles have made eleven hundred faggots.` },
  limekiln:{ farm:'starveall', fx:['+£40 a year', '+£65 a year once the common is inclosed'], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`About £40 a year; £65 once the common is inclosed, and every new allotment wants liming.`,
    name:'A lime kiln at Starveall', line:'The hill is chalk to the bottom, and burns to a strong white lime. A kiln is built into the bank beside the road, and coal is drawn to it from the Kennet wharf.', where:'Starveall', cost:220, if:() => !!farm('starveall'),
    well:'About £40 a year, from farmers and from builders.', ill:'Coal is thirty shillings the chaldron at the wharf, and the kiln eats a chaldron a day.', state:v => 'Burning since ' + v.year,
    endLabel:'Let the kiln go out', end:() => `The kiln at Starveall is let go out. It is a week in cooling; and the lime-burner sleeps beside it to the last night.` },
  potatoes:{ farm:'commonpiece', fx:['+£45 a year', '+£110 when wheat is at 95s. or over', '+£10 when wheat is under 60s.'], risk:1, odds:{"well": 0.7, "dull": 0.2, "ill": 0.1}, effects:`About £45 a year. £110 when wheat is at famine price, and £10 when it is cheap.`,
    name:'Potatoes at Common Piece', line:'The Board of Agriculture recommends the potato to every gentleman, in a pamphlet. Twenty acres of the new ground are set with them in ridges, to go to Reading by the sack.', where:'Common Piece', cost:120, if:() => !!farm('commonpiece'),
    well:'About £45 a year; and above £100 when bread is at famine price.', ill:'In a cheap year Reading will not eat them, and they go to the pigs.', state:v => 'Set every spring since ' + v.year,
    endLabel:'Give up the potatoes', end:() => `The potato ground at Common Piece goes back to barley, and the last forty sacks to the tenant’s pigs.` },
  cherries:{ farm:'rooksnest', fx:['Nothing for three years', '+£60 a year after', '+£10 after a May frost'], risk:1, odds:{"well": 0.7, "dull": 0.3, "ill": 0}, effects:`Nothing for three years. Then about £60 a year, and £10 after a frost in May.`,
    name:'A cherry orchard at Rooksnest', line:'Eight acres under the hanger, facing south, are planted with standard cherries, black hearts and white, at thirty feet apart. A cherry tree bears nothing to speak of before its fourth summer.', where:'Rooksnest', cost:180, if:() => !!farm('rooksnest'),
    well:'From the fourth year, about £60; the fruit sold upon the tree to the Reading higglers.', ill:'One frost in May; and from the day the fruit colours, a boy with a clapper under every tree.', state:v => S.year - v.year < 4 ? 'Planted ' + v.year + ', and not yet in bearing' : 'In bearing since ' + (v.year + 4),
    endLabel:'Grub the orchard', end:() => `The cherry trees at Rooksnest are grubbed, and sold for the wood, which the Wyvern chair-maker takes at a shilling the foot.` },
  osiers:{ farm:'withymead', fx:['+£30 a year'], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`About £30 a year, upon ground that paid nothing.`,
    name:'Osier beds at Withy Mead', line:'Six acres of the wettest ground, which grow nothing but flags, are trenched and set with osier rods. They are cut every winter, peeled by the women and children in May, and sold in bolts to the basket-makers of Reading.', where:'Withy Mead', cost:140, if:() => !!farm('withymead'),
    well:'About £30 a year, upon ground that paid nothing.', ill:'After a dry spring the rods will not peel.', state:v => 'Cut every winter since ' + v.year,
    endLabel:'Give up the osiers', end:() => `The osier beds at Withy Mead are given up. Nobody is put to the expense of grubbing them; the cattle are turned in.` },
  gallops:{ farm:'maddle', fx:['+£35 a year', '+1 Standing'], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`£35 a year for the turf. Standing rises a little while the string is there.`,
    name:'Let the gallops at Maddle to a training groom', line:'A mile and a half of old turf above the farm, which was never broken, is rolled and let to a training groom out of Newmarket, who brings twelve horses in body-clothes, and as many boys. You find the rails and a rubbing-house.', where:'Maddle Farm', cost:80, if:() => !!farm('maddle'),
    well:'£35 a year for turf that kept a sheep to the acre; and half the gentlemen of the county riding over of a morning to see the string out.', ill:'The boys are paid upon Saturdays, at the Bell.', state:v => 'Let since ' + v.year,
    endLabel:'Give the groom notice', end:() => `The training groom has his notice, and takes his string to Ilsley. The rubbing-house is left standing, and the shepherd has it.` }
});
const ventureTickFarms = ventureTick;
ventureTick = function(line){ ventureTickFarms(line); const y = S.year, q = S.season, P = PRICES[y], earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  if (F('homeYards') && q === 1 && y > F('homeYards')) earn('Fat beasts from the home stalls', 40);
  if (!S.vent) return;
  for (const id in VENTURES) if (VENTURES[id].farm && live(id) && !farm(VENTURES[id].farm)) stopVenture(id, 'Sold with the farm');
  const due = (id, at) => live(id) && q === at && y > vent(id).year, r = Math.random();
  if (due('dairy', 2)) { if (r < 0.2) earn('Cheese from Church Farm, a heaved making', 15); else earn('Cheese from Church Farm', 45); }
  if (due('hops', 3)) { if (r < 0.3) earn('Hops at Weyhill, a great year', 170); else if (r < 0.7) earn('Hops at Weyhill', 70); else line('The hop garden, blighted', -40); }
  if (due('limekiln', 0)) earn('Lime from the Starveall kiln', F('enclosed') ? 65 : 40);
  if (due('potatoes', 3)) earn(P >= 95 ? 'Potatoes from Common Piece, in a dear year' : 'Potatoes from Common Piece', P >= 95 ? 110 : P < 60 ? 10 : 45);
  if (due('cherries', 1) && y - vent('cherries').year >= 4) { if (r < 0.25) earn('Cherries at Rooksnest, after a May frost', 10); else earn('Cherries at Rooksnest, sold upon the tree', 60); }
  if (due('osiers', 1)) earn('Osier rods from Withy Mead', 30);
  if (due('gallops', 0)) earn('The gallops at Maddle', 35);
};
const marksFarms = marks;
marks = function(){ const m = marksFarms(); if (live('gallops')) { m.why.standing.push('+1 A string in training at Maddle'); m.standing = clamp(m.standing + 1, 5, 95); } return m; };

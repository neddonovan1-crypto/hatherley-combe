/* The Common, while it lies open: two works and three ventures, beside the Inclosure Bill.
   The soil of a common is the lord's, and the grass is the commoners'. Each of these takes from the one or the other.
   The pound and the cricket ground are works, and set a flag. The pit, the fair and the warren are ventures, and move a mark while they stand.
   The fair and the warren are ended by the award. The pit goes on, for the lower end falls to the lord's allotment. */
PROJECTS.pound = { fx:['+2 Goodwill, while the common lies open', MINUS + '1 Jem Pryor'], effects:`Goodwill rises while the common lies open. Jem Pryor cools.`, name:'Mend the pound, and stint the common',
  line:'The court of the manor is called at the Bell, where it has not sat since your uncle was a young man; and a jury of the commoners is to say how many beasts go to a cottage right, the pound being new railed for whatever is found over.',
  seasons:1, cost:() => 50, if:() => !F('enclosed'),
  blurb:`Three rails of the pound are down; and a dealer of Wyvern summers two hundred sheep upon the grass of forty cows.`, gain:'The grass kept for those who have a right to it',
  done:() => { fl('pound'); reg('pryor', -1, 'His geese were the first into your new pound');
    return `The court has sat at the Bell, and the stint is entered in the roll at two cows or ten sheep to a right. The Wyvern dealer drove his flock off upon the Monday; and the first beasts into the new pound, at fourpence a head to the pinder, were six geese of Jem Pryor’s.`; }};
PROJECTS.cricket = { fx:['+2 Goodwill', '+1 Standing'], effects:`Goodwill rises, and standing a little.`, name:'Level a cricket ground upon the common',
  line:'Two acres beside the pond are levelled, turfed and rolled, with a hurdle round them against the geese. Hatherley has an eleven already, which plays in the lane.',
  seasons:1, cost:() => 30, if:() => !F('enclosed'),
  blurb:`Wyvern has a club, which plays Newbury for fifty guineas a side; and Hatherley has a blacksmith who can bowl.`, gain:'A ground, and a match made with Wyvern',
  done:() => { fl('cricket');
    return `Two acres by the pond are levelled, turfed and rolled; and the smith, who is to bowl against Wyvern for a barrel of ale, has been seen behind the forge with a ball in his hand, pitching at a horseshoe.`; }};

Object.assign(VENTURES, {
  gravel:{ fx:['+£25 a year', '+£50 a year while you hold the turnpike share', MINUS + '1 Goodwill'], risk:0, odds:{"well": 0.9, "dull": 0.1, "ill": 0}, effects:`£25 a year from the parish surveyors, £50 while you hold a share in the turnpike. Goodwill falls a little while the pit is worked.`,
    name:'A gravel pit on the common', line:'There is flint gravel under the furze at the lower end; and the soil of a common, with whatever lies beneath it, is the lord’s. A pit is opened, and a man put into it with a screen and a cart.', where:'The Common', cost:150,
    well:'£25 a year from the surveyors of the parish roads; and twice that from the turnpike trust, while you sit upon it.', ill:'The pit eats an acre of the cottagers’ grass every second year.', state:v => 'Dug since ' + v.year,
    endLabel:'Shut the pit', end:() => `The pit is shut, and the screen sold; and as there are two feet of water in it already, the cottagers’ ducks have taken possession.` },
  sheepfair:{ fx:['+£40 a year in tolls', '+£15 in a wet year', '+1 Standing', '+1 Goodwill', MINUS + ' Ended by an inclosure'], risk:1, odds:{"well": 0.8, "dull": 0.2, "ill": 0}, effects:`About £40 a year in tolls and pennage, and £15 when the day is wet. Standing and goodwill rise a little while the fair is kept. An inclosure ends it.`,
    name:'A sheep fair on the common at Michaelmas', line:'Among your uncle’s deeds is a grant of King Henry the Sixth to the lord of Hatherley, of a fair upon the common, which nobody living has seen held. Hurdles are bought for four thousand sheep, and the day is cried at Wyvern, Newbury and Ilsley.', where:'The Common', cost:200, no:() => F('enclosed') ? 'The common is inclosed, and there is no waste left to hold a fair upon.' : '',
    well:'Tolls and pennage, about £40; and the dealers of three counties two nights at the Bell.', ill:'Upon a wet Michaelmas the flocks go to Ilsley.', state:v => 'Held every Michaelmas since ' + v.year,
    endLabel:'Let the fair drop', end:() => `The fair is not cried this year. The hurdles go to the tenants at a shilling the dozen, and the dealers to Ilsley.` },
  warren:{ fx:['+£60 a year', '+£15 in a bad year', MINUS + '3 Goodwill', MINUS + ' Ended by an inclosure'], risk:2, odds:{"well": 0.6, "dull": 0.25, "ill": 0.15}, effects:`About £60 a year in rabbits and skins, and £15 in a bad year. Goodwill falls while the warren is kept. An inclosure ends it.`,
    name:'A rabbit warren on the common', line:'The lord has free warren over the waste. Thirty acres of the furze are banked round, a lodge is built for a warrener, and two hundred couple of silver-greys are turned down, whose skins go to the hatters and their carcases to Leadenhall.', where:'The Common', cost:250, no:() => F('enclosed') ? 'The common is inclosed, and the lord has no waste left to keep rabbits upon.' : '',
    well:'About £60 a year, when the warrener is honest and the winter soft.', ill:'A bank of turf will not keep a rabbit out of a cottage garden, nor a cottager out of the warren.', state:v => 'Stocked since ' + v.year,
    endLabel:'Give up the warren', end:() => `The warren is given up, and the warrener has his quarter’s wages; but the rabbits, who had no notice, remain.` }
});
const ventureTickCommon = ventureTick;
ventureTick = function(line){ ventureTickCommon(line); if (!S.vent) return; const y = S.year, q = S.season, earn = (label, a) => { line(label, a); if (a > 0) S.yearIncome += Math.round(a); };
  if (live('gravel') && q === 1 && y > vent('gravel').year) earn('Gravel from the pit', live('turnpike') ? 50 : 25);
  if (live('sheepfair')) { if (F('enclosed')) { stopVenture('sheepfair', 'Ended by the award'); S.notes.push('The award has left no common to hold a fair upon. The hurdles are sold at Wyvern, and the dealers are gone to Ilsley.'); }
    else if (q === 2 && y > vent('sheepfair').year) { if (Math.random() < 0.2) earn('Tolls of Hatherley fair, a wet day', 15); else earn('Tolls and pennage of Hatherley fair', 40); } }
  if (live('warren')) { if (F('enclosed')) { stopVenture('warren', 'Ended by the award'); S.notes.push('The award lays the warren to the plough. The warrener is paid off, and the banks are thrown down.'); }
    else if (q === 3 && y > vent('warren').year) { if (Math.random() < 0.25) earn('The warren, after a hard season', 15); else earn('Rabbits and skins from the warren', 60); } }
};
/* What these do to the marks, laid over the reckoning in marks(). */
const marksCommon = marks;
marks = function(){ const m = marksCommon(), put = (k, n, t) => { if (n) { m.why[k].push((n > 0 ? '+' : MINUS) + Math.abs(n) + ' ' + t); m[k] = clamp(m[k] + n, 5, 95); } };
  put('goodwill', F('pound') && !F('enclosed') ? 2 : 0, 'The common stinted'); put('goodwill', F('cricket') ? 2 : 0, 'The cricket ground'); put('standing', F('cricket') ? 1 : 0, 'Cricket against Wyvern');
  put('goodwill', live('gravel') ? -1 : 0, 'The gravel pit'); put('goodwill', live('sheepfair') ? 1 : 0, 'Hatherley fair'); put('standing', live('sheepfair') ? 1 : 0, 'Hatherley fair');
  put('goodwill', live('warren') ? -3 : 0, 'Your rabbits in the cottage gardens');
  return m; };

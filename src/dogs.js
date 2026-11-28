/* The dogs. Three may be had at the Hall: a pointer for the gun, a pug for Henrietta, and a couple of the Craven puppies to walk.
   Each holds up a paper and a plate upon the day it comes, as the honours do (honours.js); and each sends papers to the Hall afterwards:
   the duty of 1796, the first of September, a lurcher taken in the copse, a bill upon the gate-posts, a painter, a mad dog at Wyvern,
   the puppies' reckoning, and a morning when the dog does not get up.
   What is in the statute book: Mr Dent's Act of 1796 (five shillings a sporting dog; three for a single dog of another kind; a house not
   assessed keeps one dog free), and the Game Act of 1671 (a manor's keeper may seize and destroy the lurcher of a man without a hundred a year).
   Hounds' names, and whelps "at their walks", are Beckford's (Thoughts upon Hunting, 1781). The persons are invented.
   Nothing here alters a sum or a flag of any other lot. Written in the Hatherley hand (docs/voice/VOICE.md). */
const DOG = { pointer:{name:'Don', keep:4}, pug:{name:'Tippoo', keep:4}, puppies:{name:'Rioter and Ransack', keep:8} };
const dogHas = id => !!soc(id) && !ended(id);
/* The favourite is the elder of the pointer and the pug. A paper about him remembers which he was after he is gone. */
const dogFav = () => ['pointer', 'pug'].filter(dogHas).sort((a, b) => (soc(a).t || 0) - (soc(b).t || 0))[0] || '';
const dogNow = () => dogFav() || S.dogFav || 'pointer';
const isPug = () => dogNow() === 'pug';
const dogYears = () => { const n = Math.max(1, S.year - (soc(dogNow()) || {year:S.year}).year); return numWords(n) + (n === 1 ? ' year' : ' years'); };
function dogGone(id, fate){ if (!soc(id)) return; S.soc[id].ended = S.year; S.soc[id].fate = fate; }
const shillings = s => { const l = Math.floor(s / 20), r = s % 20; return l && r ? (l === 1 ? 'one pound ' : numWords(l) + ' pounds ') + numWords(r) + ' shillings' : l ? (l === 1 ? 'one pound' : numWords(l) + ' pounds') : numWords(r) + ' shillings'; };
/* Dogs upon the assessor's paper: the two old spaniels in the kennel yard are always there. */
const dogCount = () => 2 + (dogHas('pointer') ? 1 : 0) + (dogHas('pug') ? 1 : 0) + (dogHas('puppies') ? 2 : 0);
const master = 'Mr Lydiard';
const COUPLE_HOME = `Foote rides away with the baskets empty. Rioter is by that time asleep in the coal-scuttle; and Ransack, after the house has been searched for her from the garrets downward, is found by the cook in the larder, upon the second shelf.`;

SOCIETY.pointer = { house:true, name:'A pointer', where:'The stables', cost:26, mark:1, held:'Don, in the stable', verb:'Buy him',
  line:'A liver-and-white pointer of the Spanish sort, broken at Hungerford, who will stand at his birds until he is told to move.',
  well:'He finds the covey, and waits for you.', ill:'Five-and-twenty guineas; five shillings a year to Mr Pitt; and every gentleman who sees him stand will want him.',
  effects:`Standing settles one higher. £4 a year in meal and duty. Sells for £15.`,
  endLabel:'Sell him', sell:15, end:() => { S.soc.pointer.fate = 'Sold at Hungerford'; return `Don goes back to Pibworth at Hungerford for fifteen pounds; and is sold by him within the month, to a clergyman in Wiltshire, for thirty guineas.`; } };
SOCIETY.pug = { house:true, name:'A pug for Henrietta', where:'The drawing-room', cost:5, mark:0, held:'Tippoo, in your chair', verb:'Send for him',
  line:'A Dutch pug, fawn, with a black mask, from a person in Holborn who advertises in the Morning Post. Henrietta has the advertisement.',
  well:'Henrietta has wanted one since Mrs Tamworth had hers.', ill:'He will have a chair of his own, and it will be yours.',
  effects:`Henrietta and the household pleased. £4 a year in cream and duty.`,
  if:() => !F('henriettaAway'), ifWhy:'Henrietta is at Bath, and a pug sent for in her absence would be a pug kept by you.',
  begin:() => { add({family:3}); reg('henrietta', 1, 'You sent to Holborn for a pug'); },
  endLabel:'Give him to Mrs Tamworth', sell:0, end:() => { S.soc.pug.fate = 'Given to Mrs Tamworth'; add({family:-3}); reg('henrietta', -2, 'You gave Tippoo away'); return `Tippoo is carried over to Marsh Court in his own chair, the chair being sent with him; and Mrs Tamworth writes that he has bitten her spaniel, and is quite at home.`; } };
SOCIETY.puppies = { house:true, name:'A couple of the Craven puppies, to walk', where:'The stable yard', cost:0, held:'Rioter and Ransack, at large', verb:'Offer a walk',
  get mark(){ return S && T('hunt') ? 3 : 2; },
  line:'The hunt puts out its young hounds for a year among the gentlemen and farmers of its country. They are to run loose, and are never to be tied up.',
  well:'It is observed at the covert side who has walked a couple, and who has not.', ill:'They eat what they find, and they find everything.',
  effects:`Standing settles two higher while they are with you. The household put about. £8 a year in meal and breakages. They go back to the kennels in a year.`,
  begin:() => { add({family:-1}); },
  endLabel:'Send them back to the kennels', sell:0, end:() => { S.soc.puppies.fate = 'Sent back to the kennels'; return `Rioter and Ransack are led back to the kennels by a stable boy, upon one cord; and ${master}’s huntsman, who takes them in, asks the boy what they have done.`; } };

/* What the page says of them: the yearly charge, the figures, and how each one went. */
const DOG_FX = { pointer:() => ['+1 Standing', '+£15 if sold'], pug:() => ['+3 Household', '+1 Henrietta'], puppies:() => ['+' + SOCIETY.puppies.mark + ' Standing, for the year', MINUS + '1 Household'] };
const societyFxPlain = societyFx;
societyFx = function(id){ return DOG_FX[id] ? DOG_FX[id]().concat([MINUS + fmt(DOG[id].keep) + ' a year to keep']) : societyFxPlain(id); };
const societyListPlain = societyList;
societyList = function(){ return societyListPlain().map(r => { if (!DOG[r.id]) return r; const s = soc(r.id);
  if (r.state === 'ended' && s && s.fate) r.note = s.fate + ', ' + s.ended; else if (r.state !== 'ended') { r.keep = DOG[r.id].keep; r.note = fmt(DOG[r.id].keep) + ' a year to keep'; }
  return r; }); };
const societyQuarterPlain = societyQuarter;
societyQuarter = function(line){ societyQuarterPlain(line); let n = 0; for (const id in DOG) if (dogHas(id)) n += DOG[id].keep / 4; if (n) line('The dogs: meal, and the duty upon them', -n); };

/* ---------- the day each comes ---------- */
const DOG_PAPERS = {
  pointer:{ title:'Two-and-Twenty Minutes',
    text:() => `Isaac Pibworth, who breaks dogs for half the gentlemen between Hungerford and Newbury, has a liver-and-white pointer of the Spanish sort to sell; and as he will show him nowhere but upon birds, you ride over with Mudge to forty acres of rough ground behind the Bear.

The dog is cast off, and goes down the wind at a hand gallop. At the fourth furrow he stops, as if he had run against a wall: his head is low, his stern is straight out behind him, and one fore foot is held up off the ground.

“Now, sir, we’ll leave un be, and I’ll fill a pipe.”

Pibworth fills it, lights it at the third trial of his tinder-box, and smokes it out. He then draws a watch from his fob, and holds it where you may read it; by which you find that the dog, who has not in all that time set down his foot, has stood two-and-twenty minutes. The birds get up when Mudge walks in, and nobody fires at them.

The price is five-and-twenty guineas, and Pibworth will not hear of pounds. Mudge, being asked upon the road home what he thinks of the purchase, replies that your uncle never gave above three guineas for a dog in his life; and, having ridden a furlong farther, that your uncle never had one which would stand while a man found his flint.

The dog’s name is Don. He is given the stall next the cob, and a truss of wheat straw.` },

  pug:{ title:'A Hat-Box by the Wyvern Coach',
    text:() => `A person in Holborn, who deals in singing-birds, in Dutch pugs, and in a wash for the complexion, has advertised in the Morning Post that he has a dog of the true breed to dispose of, with a black mask, and a tail in the double curl; and as Henrietta has had the paper folded open at that place, upon the breakfast table, for nine mornings together, you write to Holborn upon the tenth, and enclose a draft for five guineas.

He comes down by the Wyvern coach in a hat-box, with holes punched in the lid, and is charged as a parcel, two shillings and fourpence. The guard, in handing the box down, shows the footman a thumb tied up in a handkerchief.

Henrietta has the lid off upon the hall table. There is first to be seen a quantity of hay; and then, rising out of it, a black face, exceedingly wrinkled, with two round eyes, which look at her, at you, and at the footman, and do not appear to think much of any of the three.

“He shall be called Tippoo; for I never saw anything so like the Sultan in the print-shop.”

Tippoo is lifted out. He weighs eleven pounds; he has a collar of red morocco; and when he has walked once round the hall, breathing as an old gentleman breathes upon a staircase, he goes into the drawing-room, gets up into the chair upon the left of the fire, which was your uncle’s and has been yours, and is asleep in it before the box is carried away.

Henrietta rings for a saucer of cream.` },

  puppies:{ title:'Rioter and Ransack',
    text:() => `You send word to ${master}, who has the Craven country, that there is a walk at Hatherley for a couple of his young hounds, if he has a couple to put out; and upon the Thursday his huntsman, Ben Foote, rides into the stable yard upon a pony, with a pannier at either side of it.

“They’re to go where they likes, sir, and eat what they finds; and never a chain.”

Two whelps are tipped out upon the flags. They are ten weeks old, and white, with a patch of tan over one eye of each; and Foote, who has named some four hundred hounds in his time, and has never yet used a name twice in one year, tells you that the dog is Rioter, and the bitch Ransack.

They are to be at Hatherley until the spring twelvemonth. ${master} pays nothing for their keep, the honour being held sufficient; and he finds, in return, that no gentleman who has reared a hound for the pack was ever known to grudge it a gate, or a field of young wheat.

${COUPLE_HOME}` }
};
function dogPaper(id){ const p = DOG_PAPERS[id]; if (!p) return; const text = p.text();
  if (typeof document === 'undefined' || typeof printHTML !== 'function') return;
  if (!S.plates) S.plates = [];
  const src = artURL('dogs/' + id) ? 'dogs/' + id : placeCut('hall');
  S.plates.push({key:'dog:' + id + ':' + S.t, title:p.title, src, did:(S.journal[0] || {}).did || '', pub:quarterDay(), say:sayOf(text)}); save();
  VENTUP = {text, n:S.plates.length, cost:SOCIETY[id].cost}; showVentPaper(); }
const beginSocietyDogs = beginSociety;
beginSociety = function(id){ const ok = beginSocietyDogs(id); if (ok && DOG[id]) { S.soc[id].t = S.t; dogPaper(id); } return ok; };

/* What follows, and when: so many seasons after the dog named (or after the favourite, where `of` is fav), in the season named if one is named,
   one paper to a quarter, and only in a quarter that has nothing else waiting. */
const DOG_AFTER = [
  {of:'any', ev:'dogTax', wait:1},
  {of:'pointer', ev:'dogPoint', wait:1, q:2}, {of:'pug', ev:'dogLost', wait:2}, {of:'puppies', ev:'dogWalkBill', wait:4},
  {of:'pointer', ev:'dogLurcher', wait:5}, {of:'fav', ev:'dogPortrait', wait:6}, {of:'fav', ev:'dogMad', wait:9, q:1},
  {of:'fav', ev:'dogDeath', wait:28, or:() => S.year >= 1813 && S.season === 3} ];
const dogOf = a => a.of === 'fav' ? dogFav() : a.of === 'any' ? Object.keys(DOG).filter(dogHas).sort((x, y) => (soc(x).t || 0) - (soc(y).t || 0))[0] : dogHas(a.of) ? a.of : '';
const ventureTickDogs = ventureTick;
ventureTick = function(line){ ventureTickDogs(line); if (!S.soc) return;
  if ((FIXED[S.year + '-' + S.season] || []).some(e => !e.cond || e.cond()) || S.queue.some(x => x.at <= S.t)) return;
  for (const a of DOG_AFTER) { const id = dogOf(a); if (!id || S.seen[a.ev] !== undefined || S.queue.some(x => x.id === a.ev)) continue;
    const had = S.t - (soc(id).t || 0);
    if (!(had >= a.wait || (a.or && had >= 12 && a.or())) || (a.q !== undefined && S.season !== a.q)) continue;
    const e = byId(a.ev); if (e.cond && !e.cond()) continue;
    if (a.of === 'fav') S.dogFav = id;
    later(a.ev, 0); return; } };

/* ---------- the puppies are asked of him, if he has not offered ---------- */

ev({ id:'dogWalkAsk', from:1796, to:1811, get weight(){ return S && T('hunt') ? 6 : 2; }, at:'hall', who:() => null, cond:() => !soc('puppies') && !F('walkRefused'), title:'Two Panniers',
  text:() => `Ben Foote, who has hunted the Craven hounds these eleven seasons, is at the stable door upon a pony, with a pannier at either side of it; and over the edge of each pannier there is to be seen one white head, and one paw.

“Master’s compliments, sir; and I’m to wait, and take back the baskets.”

He has a note for you in his hat. It is in the hand of ${master}, who has the country:

“Sir, The bitch Rarity has whelped nine, and I have walks for seven. Foote brings you the remaining couple, which I beg you will have the goodness to keep until the spring twelvemonth. They want nothing but their liberty, skimmed milk, and what comes from the table; and are upon no account to be tied up. I am, Sir, your obliged humble servant, J. Lydiard.”

As a kennel is of all places the likeliest to give a young hound the distemper, there is no pack in England which does not put out its whelps, at ten weeks old, among the gentlemen and farmers of its country; ${T('hunt') ? 'and a gentleman who took the Kennet in flood upon Parson is not thought to want asking twice.' : 'and it is observed, at the covert side in November, who has walked a couple, and who has not.'}

Foote has unbuckled the first pannier before you have folded the note.`,
  choices:[
    {t:'Take the couple in.', note:'+Standing, −Household', go:() => { S.soc = S.soc || {}; S.soc.puppies = {year:S.year, t:S.t}; add({standing:Math.ceil(SOCIETY.puppies.mark / 2), family:-1});
      return `The panniers are emptied upon the stable flags. There come out of them two whelps, white, with a patch of tan over one eye of each; and Foote, who has named some four hundred hounds in his time, tells you that the dog is Rioter, and the bitch Ransack.

${COUPLE_HOME}`; }},
    {t:'Send them on to a tenant, under his lease.', note:'+Standing, −Goodwill', go:() => { fl('walkRefused'); add({standing:1, goodwill:-2}); const f = S.farms.find(x => !x.void), who = f ? called(f) : 'the bailiff at the Home Farm', Who = f ? Called(f) : 'The bailiff', her = f && f.she ? 'her' : 'his';
      return `You write three lines upon the back of ${master}’s note; and Foote carries note, pony and panniers a mile farther, to ${who}, in whose agreement, as in every agreement upon the estate since your grandfather’s time, there stands a covenant to keep one hound for the landlord whenever it shall be required.

It is forty years since that covenant was read. ${Who} reads it twice, in the yard, with ${her} finger under the words; and the couple are put into the calf-pen.`; }},
    {t:'Send them back to the kennels.', note:'−Standing', go:() => { fl('walkRefused'); add({standing:T('hunt') ? -3 : -1});
      return `“Then I’m to say you’d rather not, sir.”

Foote buckles the pannier again, over the head. He touches his hat, turns the pony, and is heard for some way down the avenue explaining the matter to it.

At the first meet of the season ${master} takes off his hat to you from the far side of the covert, and keeps that side of it all day.`; }}
  ]});

/* ---------- Mr Dent's Act ---------- */

ev({ id:'dogTax', follow:true, at:'hall', who:() => null, cond:() => (S.year > 1796 || (S.year === 1796 && S.season >= 1)) && Object.keys(DOG).some(dogHas), title:'Mr Dent’s Five Shillings',
  text:() => { const n = dogCount(), here = [dogHas('pointer') ? 'in the stable, Don' : '', dogHas('pug') ? 'in the drawing-room, upon a chair, Tippoo' : '', dogHas('puppies') ? 'somewhere between the larder and the laundry, Rioter and Ransack' : ''].filter(Boolean);
    return `Mr Hawkes, who keeps the school at Wyvern, and who assesses this parish for the windows, the horses, the carriages and the hair-powder, is shown into the justice room with a new paper; and as it is the paper of Mr Dent’s Act, which ${S.year === 1796 ? 'has passed this session' : 'has been law since the year ’96'}, he asks leave to read you the classes.

“Every greyhound, hound, pointer, setting-dog, spaniel, lurcher or terrier, sir: five shillings.”

For a dog of no such kind, where the house keeps but that one, the duty is three shillings; where it keeps two dogs or more, of whatever kinds, they are all at five; and the inhabitant of a house which is not assessed to the windows may keep his one dog, be it what it will, for nothing.

Mr Hawkes has his pencil out. There are, in the kennel yard, the two old spaniels that were your uncle’s; ${here.join('; ')}: which Mr Hawkes makes ${numWords(n)} dogs, and ${shillings(5 * n)}.

He wets the pencil, and waits to be told that he has counted right.`; },
  choices:[
    {t:'Tell him that he has counted right, and pay.', note:() => MINUS + shillings(5 * dogCount()), go:() => { const s = 5 * dogCount(); add({money:-Math.ceil(s / 20), standing:1});
      return `You pay him ${shillings(s)}, for which he writes a receipt upon the window-sill.

He is two days in going round the parish. Mr Hartopp returns a sheep-dog, and disputes it; ${F('gallDead') ? 'the churchwarden' : 'Dr Gall'} returns nothing, having given his terrier to the sexton upon Lady Day; and at the last cottage upon ${ground()}, which has two windows, and is assessed to neither, Mr Hawkes finds Jem Pryor’s lurcher bitch lying across the door.

She is the best dog for a hare in the hundred. He steps over her, and writes nothing.`; }},
    {t:'Say nothing of the two spaniels.', note:'10s. saved', go:() => { const s = 5 * (dogCount() - 2) + 20; add({money:-Math.ceil(s / 20), standing:-1});
      return `Mr Hawkes writes down what he is told, and is paid upon it.

His way out lies through the kennel yard. Both spaniels come to the length of their chains to look at him; he touches his hat to them, as to two persons with whom he has not the pleasure of being acquainted; and a fortnight afterwards there comes from the Surveyor at Newbury a surcharge, for two dogs omitted, at double duty, of one pound.`; }},
    {t:'Appeal for Tippoo, who never hunted anything.', if:() => dogHas('pug'), note:'A day at Wyvern', go:() => { const s = 5 * dogCount(); add({money:-Math.ceil(s / 20) - 1}); if (!F('henriettaAway')) reg('henrietta', 1, 'You went before the Commissioners for Tippoo');
      return `You pay for the rest, and give notice of appeal for the pug; and upon the day appointed you attend the Commissioners at the George, with Tippoo under the footman’s arm, to show them that he is of no kind named in the Act.

The Commissioners, who are three, look at Tippoo, and agree that he is not. They then desire their clerk to read the next clause; from which it appears that the house which keeps two dogs, or more, pays five shillings upon every one of them, were it a dog in a lady’s muff.

The appeal is dismissed. You have dined at the ordinary, and baited two horses; and the day has cost you, to save two shillings, eleven and sixpence.`; }},
    {t:'Pay for your own, and send him to the hunt for the puppies.', if:() => dogHas('puppies'), note:'−Standing', go:() => { const s = 5 * dogCount(); add({money:-Math.ceil(s / 20), standing:-2});
      return `You pay for the dogs that are yours, and tell Mr Hawkes that the hounds are ${master}’s. Mr Hawkes rides nine miles to the kennels; where ${master}, who has paid upon forty couple, informs him that a hound at walk is kept by him who feeds it, and that the word in the Act is “keep”.

Mr Hawkes rides nine miles back. He charges the ten shillings to you, as before; and ${master}, at the next meet, asks you before the whole field whether Hatherley is come so near the parish that it cannot find a crown apiece for two puppies.`; }}
  ]});

/* ---------- the pointer ---------- */

ev({ id:'dogPoint', follow:true, at:'copse', who:() => null, cond:() => dogHas('pointer'), title:'The First of September',
  text:() => `It is the first of September; and as the Castle turnips and your own are parted only by a ditch, Lord Cullerne and you walk them in one line, as his father did with your uncle, each with his own keeper and his own dogs.

His lordship has out a brace of pointers, Juno and Ponto, bred at the Castle. They quarter their ground very handsomely as far as the second field; where Ponto, winding birds, runs in upon them, and Juno after him, and a covey of fourteen goes away over the hedge at eighty yards.

Don is then cast off. He goes to the end of the turnips and back, drops to his point at the ditch, and stands. Lord Cullerne walks up beside him; looks at him; and, to try him, fires both barrels over his back at nothing. Don does not stir until the birds rise at the smoke, and you kill a brace.

“I’ll give you fifty guineas for that dog, ${S.sur}. And you may have Ponto.”

Mudge, behind you, is heard to draw in his breath. His lordship’s keeper is looking at Ponto.`,
  choices:[
    {t:'Take the fifty guineas, and Ponto.', note:'+£52 10s.', go:() => { add({money:52}); reg('cullerne', 2, 'You sold him the pointer'); dogGone('pointer', 'Sold to Lord Cullerne');
      return `Don goes up to the Castle that evening behind the keeper’s pony, and looks back twice from the lodge. A draft for fifty-two pounds ten comes down in the morning; and with it Ponto, upon a cord.

It is known in the county by Michaelmas that Lord Cullerne has the best pointer in Berkshire, and of whom he had him. Ponto is tried once upon your own stubbles, where he runs in upon the first covey, upon the second, and upon a hen-coop of Hartopp’s; after which he is given to the miller, to bark at night.`; }},
    {t:'Lend Don to the Castle for the season.', note:'+Lord Cullerne', go:() => { add({standing:1}); reg('cullerne', 1, 'You lent him the pointer');
      return `Don is three months at the Castle. His lordship shoots over him four days in the week, and writes about him to the Duke of Bedford; and the Castle keeper, who is ordered to bring on Juno and Ponto by his example, has all three out together every morning.

He comes home in December, fat, in a Castle collar. Upon the first day that you have him out he finds his birds as before, stands as before, and, at the moment you come up with him, runs in.`; }},
    {t:'Tell his lordship that the dog is not to be sold.', note:'+Standing, −Lord Cullerne', go:() => { add({standing:1}); reg('cullerne', -1, 'You would not sell him the pointer');
      return `“Not at a hundred?”

“Not at a hundred, my lord.”

Lord Cullerne whistles up Juno and Ponto, and says nothing more of it for two fields. In the third he observes that your uncle would have taken the fifty; and at noon, when the cold fowl is eaten under the hedge, he gives Don a leg of it from his own plate.

Pibworth of Hungerford has heard of the offer within the week, and has put ten guineas upon every puppy in his yard.`; }}
  ]});

ev({ id:'dogLurcher', follow:true, at:'copse', who:() => null, cond:() => dogHas('pointer') && S.chars.pryor.r > -4, title:'Liver and White',
  text:() => `Mudge has a lurcher bitch upon a rope in the stable yard; and Jem Pryor, without a rope, stands a yard behind her.

“Took in Cuckoo Copse, sir, with a leveret not cold. And I’ve the Act for what’s to be done with her.”

He has; for by a statute of King Charles the Second, which your uncle kept wafered inside the lid of the gun-case, the keeper of a manor may seize the greyhound, the setting-dog or the lurcher of any man who has not a hundred pounds a year in land, and may keep it for the lord, or destroy it. Pryor has no land. Mudge has brought, beside the rope, a spade.

The bitch is brindled, rough in the coat, and lately in milk. Pryor, being asked what he has to say, looks for some time at Don, who is lying in the door of his stall.

“Her’ve four at home, sir, a month old. And they be all liver and white.”

Mudge looks at Don also. Don gets up, turns round, and lies down again with his back to the yard.`,
  choices:[
    {t:'Let Mudge do what the Act allows.', note:'−Goodwill, −Pryor', go:() => { add({goodwill:-4, standing:1}); reg('pryor', -3, 'Your keeper destroyed his lurcher'); S.game += 1;
      return `Mudge leads her round behind the wood-stack. Pryor does not go with them, and does not go home; he stands in the yard with his hat on until Mudge comes back with the rope in his hand, and then asks whether he may have the loan of the spade.

He buries her himself, upon ${ground()}, and is at it until dark.

The four whelps are brought up by hand, upon a rag and a saucer, by Sukey Pryor and the five children. Three live; and by the second winter there are in Hatherley three dogs with a lurcher’s legs and a pointer’s nose, not one of which has ever been seen by daylight.`; }},
    {t:'Send her home; and buy the litter of him, at half-a-crown a head.', note:'10s.', go:() => { add({money:-1, goodwill:2}); reg('pryor', 2, 'You bought his lurcher’s whelps, and let her go');
      return `Pryor has sold a good deal to the Hall in thirty years, and never before at the front of it. He brings the litter up next morning in his wife’s apron, and is paid by ${steward()}, who enters it in the book under Vermin and Sundries.

There are three whelps in the apron.

“The fourth un died, sir.”

You pay him the fourth half-crown notwithstanding. Mudge has the three to bring up; and there is seen that autumn upon ${ground()}, at dusk, a half-grown dog, liver and white, standing at a hare in her form, with one fore foot held up off the ground.`; }},
    {t:'Tell Mudge that the dog which trespassed was your own.', note:'+Goodwill, −Standing', go:() => { add({goodwill:3, standing:-2}); reg('pryor', 2, 'You would not have his lurcher destroyed'); S.game -= 1;
      return `“The bitch was at home with four whelps, Mudge; and I know of one dog only that has been off his own ground.”

Mudge unties the rope. It takes him a long while, the knot being his own; and when it is done he puts the spade over his shoulder, and goes to feed the pheasants without having been told to.

Pryor takes the bitch up in his arms, though she is very well able to walk. Upon Saturday there is left at the kitchen door, in a dock leaf, a whelp of a month old, liver and white; and no message with it.`; }}
  ]});

/* ---------- the pug ---------- */

ev({ id:'dogLost', follow:true, at:'hall', who:() => null, cond:() => dogHas('pug') && !F('henriettaAway'), title:'Five Guineas, and No Questions',
  text:() => `There is at the kitchen door a man in a hairy cap, who gives his name as Elias Loveridge, and his trade as the mending of kettles. He has Tippoo under one arm; and in his other hand, folded small, a printed bill.

“I found un a-wandering by the turnpike, your honour, and knowed un by the paper.”

The paper is your own. Tippoo having been missed upon Thursday from the yard of the George, while Henrietta was choosing a ribbon, the Wyvern printer had a hundred of them struck off by Friday noon, at four shillings; and they are upon every gate-post from Hungerford to Theale:

“LOST, on Thursday last, at Wyvern, a small DOG of the Dutch Pug Kind, fawn, with a black Mask; answers to the Name of TIPPOO; had on a red Morocco Collar. Whoever will bring him to Hatherley Hall shall receive FIVE GUINEAS Reward, and no Questions asked. N.B. He is of no Use to any Person but the Owner.”

Tippoo is fatter than he was upon Thursday, and has no collar. The ostler of the George, who is sent for, remembers a hairy cap in the yard that morning; but he cannot swear to what was under it.

Five guineas is what the dog cost.`,
  choices:[
    {t:'Pay the five guineas, and ask no questions.', note:'£5 5s.', go:() => { add({money:-5, family:2}); reg('henrietta', 1, 'You paid the reward for Tippoo');
      return `Loveridge counts the five guineas into the hairy cap, puts the cap on, and wishes the dog a long life.

Henrietta carries Tippoo up to her dressing-room, and does not come down to dinner. A new collar is had from Reading, with a lock to it, at nine shillings.

In the month following, Mrs Tamworth’s spaniel is lost at Newbury, the Archdeacon’s terrier at Speen, and a greyhound of Lord Cullerne’s out of his own park; and each of them is found wandering, within the week, by a person who mends kettles.`; }},
    {t:'Ask one question: where is the collar?', note:'£4 4s.', go:() => { add({money:-4, family:1});
      return `“There was to be no questions, your honour. ’Tis printed.”

“There was to be a collar. That is printed also.”

Loveridge considers the bill, which he is holding upside down. He then finds in the lining of his coat, to his own great surprise, a collar of red morocco; and for the wear of it you take off one guinea.

He goes away with four; and at the lodge gate he is seen to take out the bill again, and to have it read over to him by the lodge-keeper’s boy.`; }},
    {t:'Send for the constable.', note:'−Goodwill', go:() => { add({standing:1, goodwill:-3});
      return `The constable is twenty minutes in coming, having been at his dinner. Loveridge, in the mean time, sets Tippoo down upon the step; observing that he is a poor man, who found a dog, and that he had always heard a gentleman’s printed word to be as good as his written.

There is nothing with which to charge him. Nobody saw the dog taken; the collar is not upon him; and the bill is in everybody’s hands. He is walked to the parish bound, and Tippoo is carried in.

Dogs continue to be lost at Wyvern upon market days, and to be found. But when the Hall, at Christmas, cries a silver spoon, with a reward of half a guinea, the spoon is not brought.`; }}
  ]});

/* ---------- the favourite: his picture, the dog-days, and the end ---------- */

ev({ id:'dogPortrait', follow:true, at:'hall', who:() => null, cond:() => !!dogFav(), cut:() => 'dogPortrait-' + dogNow(), title:'Eight Guineas for a Dog',
  text:() => `There puts up at the George a Mr Jabez Orpwood, animal painter, who has taken the likeness of the Craven hounds for ${master}, of a Hereford bull for Lord Cullerne, and of the Fat Ox of Hungerford for the butcher who killed it; and who sends up his card to the Hall, with his terms written upon the back.

They are eight guineas for a dog, upon a canvas of thirty inches by twenty-five, with a landscape; and one guinea more if the owner is desired in the landscape, at a distance.

“I never flatter a beast, sir. A gentleman, at that distance, I can oblige.”

${isPug() ? 'Tippoo is tried in his chair. He sleeps through the whole of the first sitting, which Mr Orpwood allows to be a great convenience in a sitter; and his eyes are put in afterwards from memory, Mr Orpwood having seen them once, when the footman came in with a plate.' : 'Don is tried upon the lawn. As he will stand for nothing but a bird, Mudge is put into the laurels with a live partridge in a basket; and Don points the laurels, without the motion of a hair, for as long as Mr Orpwood chooses to draw, and Mudge to kneel.'}

The sketch, which is in red chalk, is the dog to the life. Mr Orpwood holds it up, and waits.`,
  choices:[
    {t:'The dog alone, at eight guineas.', note:'£8 8s.', go:() => { add({money:-8, family:2}); if (isPug() && !F('henriettaAway')) reg('henrietta', 1, 'You had Tippoo painted');
      return `Mr Orpwood has four sittings, and dines upon each of the four days in the steward’s room. The picture comes home at the month’s end, in its frame: ${isPug() ? 'Tippoo, upon a crimson cushion, before a curtain and a column.' : 'Don, at his point, in a field of turnips which every body knows for Hartopp’s.'}

It is hung in the library, over the chimney-piece. ${isPug() ? 'The housemaids, who are brought in to see it, stand before it in a row; and the youngest is heard to ask whether the gentleman can paint the snoring.' : 'Mudge, who is brought in to see it in his stockings, looks at it for some minutes, and asks who had the birds.'}`; }},
    {t:'Yourself in the distance, at nine.', note:'£9 9s.', go:() => { add({money:-9, family:1, standing:1});
      return `You are painted in one morning, from the drawing-room window, standing upon the lawn in your brown coat, with your hand upon a gate that was carried there for the purpose.

The picture hangs in the library. ${DOG[dogNow()].name} measures in it, from his nose to ${isPug() ? 'the curl of his tail, fourteen inches' : 'the end of his stern, two-and-twenty inches'}; and the owner of Hatherley, who is to be found behind his left ear, one inch and a quarter, with the hat.`; }},
    {t:'Have him put into Mr Beechey’s canvas, at three.', if:() => dogHas('portraits'), note:'£3 3s.', go:() => { add({money:-3, family:3}); if (isPug() && !F('henriettaAway')) reg('henrietta', 1, 'Tippoo is in her portrait');
      return `Mr Orpwood asks three guineas to put a dog into a picture that is painted already; and he is two days upon a pair of steps before the sideboard, with the dining-room door locked.

${isPug() ? 'Tippoo now sits in Mr Beechey’s canvas, upon Henrietta’s knee, with the harp behind him' : 'Don now lies in Mr Beechey’s canvas, across your feet, with his nose upon your shoe'}; and as Mr Orpwood’s browns are a good deal warmer than Mr Beechey’s, he is the first thing in the room upon which the eye falls.

Mr Beechey, who is not told of it, has sixty guineas for a head. It is the opinion of those who dine at Hatherley that the best head of the three cost one.`; }},
    {t:'Give him his dinner, and send him on to Hartopp, who has a ram.', go:() => { reg('hartopp', 1, 'You sent him the animal painter');
      return `Mr Orpwood dines in the steward’s room, puts up his red chalk, and walks over to Hartopp’s; where he is four days upon a New Leicester ram, at eight guineas, and a guinea more for Hartopp in the distance.

Hartopp, having measured the ram upon the canvas with a two-foot rule, and afterwards the ram in the fold, sends the picture back to Wyvern to have three inches added to the loin.`; }}
  ]});

ev({ id:'dogMad', follow:true, at:'wyvern', who:() => null, cond:() => !!dogFav(), title:'The Dog-Days',
  text:() => `It is the third week of the dog-days, and Wyvern has had a mad dog.

He came in by the bridge upon Tuesday, a yellow cur that nobody owned, with his tail down; went the whole length of the Market Place without turning his head; and bit, in that distance, a pig, two dogs, and the skirt of the beadle’s coat, before a drover killed him against the pump with a hay-fork. The pig is tied up, and is looked at through a hurdle. The beadle has gone by the coach to Southampton, to be dipped nine times in the salt water.

${F('gallDead') ? 'Your brother justices have drawn an order, and their clerk brings it to you' : 'Dr Gall has drawn an order, and brings it to you himself'} for the second name.

“Every dog in the hundred tied up for forty days, sir; and any found at large, destroyed.”

The constable is to have sixpence a head. There are in Hatherley, by the overseer’s count, six-and-thirty dogs; and there are, among those who own them, nine chains.

${DOG[dogNow()].name} was in Wyvern upon Tuesday, ${isPug() ? 'under the footman’s arm' : 'behind the gig'}; and the ostler of the George will not undertake to say that the cur did not pass him.`,
  choices:[
    {t:() => 'Sign; and shut up ' + DOG[dogNow()].name + ' with the rest.', note:'+Standing, −Goodwill', go:() => { add({standing:2, goodwill:-4}); if (!F('gallDead')) reg('gall', 1);
      return `You sign. ${DOG[dogNow()].name} is forty days ${isPug() ? 'in the housekeeper’s room, with the door shut' : 'upon a chain in the stable'}, and comes out of them fatter, and in perfect health.

The constable is paid, at the end of the forty days, for seven-and-twenty dogs: thirteen shillings and sixpence. Jem Pryor’s lurcher is not of the number, having been for the whole of that time under his bed. The pig is killed at Michaelmas, and is eaten.`; }},
    {t:() => 'Sign; and have ' + DOG[dogNow()].name + ' shot the same day, that the parish may see it.', note:'+Standing, −Household', go:() => { const pug = isPug(); add({standing:3, goodwill:1, family:-5}); if (pug) reg('henrietta', -3, 'You had Tippoo shot'); dogGone(dogNow(), 'Shot in the dog-days');
      return `${DOG[pug ? 'pug' : 'pointer'].name} is taken out to the wood-stack by Mudge that afternoon; and it is known in every cottage before dark that the Hall has begun with its own.

Nobody in Hatherley hides a dog after that. The constable has his seven-and-twenty in four days; and the people who bring them to him, each upon a string, say that if the Squire could do it, they can.

The pig is alive at Michaelmas. ${pug ? 'Nobody sits in the chair upon the left of the fire.' : 'The stall next the cob is not used.'}`; }},
    {t:'Sign nothing, until somebody has shown that the cur was mad.', note:'+Goodwill, −Standing', go:() => { add({standing:-2, goodwill:3}); if (!F('gallDead')) reg('gall', -1, 'You would not sign his order against the dogs');
      return `You desire to know who saw the dog foam; and it appears, upon enquiry, that nobody did. He had come eleven miles behind a drove, from which he was lost at Speen; he had been given no water; and the first hand held out to him in Wyvern had a stone in it.

The order goes out notwithstanding, under two other names, for every parish in the hundred but yours. For forty days Hatherley is the only place between Newbury and Hungerford where a dog is to be seen in the road; and persons driving through it are observed to whip up.

The pig is killed at Michaelmas, and is eaten. The beadle comes home from Southampton, dipped, with a bill for two pounds four shillings.`; }}
  ]});

ev({ id:'dogDeath', follow:true, at:'hall', who:() => null, cond:() => !!dogFav(), cut:() => 'dogDeath-' + dogNow(), get title(){ return S && isPug() ? 'The Chair upon the Left' : 'The Stall next the Cob'; },
  text:() => isPug() ? `The footman comes to the breakfast-room door without the urn, and stands in it.

“It is Tippoo, sir. He would not get down for his cream.”

He was ${dogYears()} at Hatherley. He had grown in that time from eleven pounds to nineteen; he had bitten two footmen, a bishop’s chaplain, and the guard of the Wyvern coach; and he had not for one evening been out of the chair upon the left of the fire.

He is in it now, upon his cushion, with his face between his paws.${hh(' Henrietta has gone up to her room, and has turned the key.', '')}

The footman asks what is to be done.` : `Mudge comes to the breakfast-room door, which he has not done before in his life, and stands in it with his hat in both hands.

“’Tis Don, sir. In the night. He never made no noise about it.”

He was ${dogYears()} at Hatherley. For the last two Septembers he had been slow at a hedge, and you had lifted him over; and he had stood his birds as he stood them for Pibworth’s watch, though he could no longer hear them rise.

He is lying in the wheat straw, in the stall next the cob, with his nose toward the door. The cob has not touched her corn.

Mudge asks where you will have him put.`,
  choices:[
    {t:'Under the cedar, with a stone.', note:'£3', go:() => { const pug = isPug(), yrs = dogYears(); add({money:-3, family:-1}); if (pug && !F('henriettaAway')) reg('henrietta', 1, 'You gave Tippoo a stone under the cedar'); dogGone(dogNow(), 'Buried under the cedar');
      return `He is buried under the cedar, where the lawn is dry. The mason at Wyvern cuts a stone of two feet by one, and asks what is to go upon it; and when you have written four inscriptions, and torn up four, he is given the name, and the two years.

${pug ? 'The chair is not moved. It is some months before anybody sits in it; and it is then observed that you sit, as you did for ' + yrs + ', upon the right.' : 'Mudge takes the collar down from its nail in the saddle-room a month afterwards, oils it, and hangs it up again.'}`; }},
    {t:() => isPug() ? 'In the kitchen garden, where he lay in the sun.' : 'Let Mudge choose the place.', go:() => { const pug = isPug(); add({family:-2, goodwill:1}); dogGone(dogNow(), 'Buried at Hatherley');
      return `${pug ? 'The gardener digs the place under the south wall, between the apricot and the fig, and will not have the boy to help him.' : 'Mudge chooses the bank at the corner of Cuckoo Copse, above the turnips; and he digs it himself, and deep, on account of the foxes.'}

No stone is put. A hazel stick is set there, peeled; and when the stick has rotted, at the end of the winter, it is found that somebody has set another.`; }},
    {t:'Send him to the bird-stuffer at Reading.', note:'£2', go:() => { const pug = isPug(); add({money:-2, family:-3}); dogGone(dogNow(), 'Stuffed, and in the lumber-room');
      return `He goes to Reading in a hamper, and is six weeks away. The bird-stuffer, whose practice lies among owls and pike, returns him upon a mahogany board, ${pug ? 'sitting' : 'standing at his point'}, with a pair of glass eyes that were made for a fox.

He is set ${pug ? 'in his chair' : 'in the library, beside the fender'}. The housemaids will not dust him; ${hh('Henrietta, having looked at him once, asks that he may be turned to the wall; ', '')}and at Christmas he is carried up to the lumber-room, under a sheet, by ${pug ? 'the footman' : 'Mudge'}.`; }}
  ]});

/* ---------- the puppies go home ---------- */

ev({ id:'dogWalkBill', follow:true, at:'hall', who:() => null, cond:() => dogHas('puppies'), title:'In the Back of the Linen Book',
  text:() => `Ben Foote is in the stable yard again, with the pony; but the panniers have been left at the kennels, Rioter and Ransack being now three-and-twenty inches at the shoulder, and able to go upon their own legs.

“Best shoulders of the whole entry, sir. Master says ’tis the feeding.”

Of the feeding there is an account. It has been kept by Mrs Bunce, in the back of the linen book, from the day they came; and ${steward()}, who has cast it up, lays it before you with his thumb at the foot.

It sets forth one leg of mutton, taken from the spit; four pounds of candles; the half of a Cheshire cheese; the cook’s Sunday shoe, and its fellow upon the Sunday after; a saddle-flap; two hassocks out of the Hall pew; ${F('gallDead') ? 'the curate’s' : 'Dr Gall’s'} hat; and eleven ducks, the property of Mr Hartopp, who has sent in for them at a shilling the duck. The whole is four pounds seven shillings.

The couple sit side by side upon the flags while it is read, and look at Foote.`,
  choices:[
    {t:'Pay Hartopp for his ducks, and give Foote a guinea.', note:'£1 12s.', go:() => { add({money:-2, standing:1}); reg('hartopp', 1, 'You paid for his eleven ducks'); dogGone('puppies', 'Entered to the Craven pack');
      return `Hartopp has his eleven shillings, and writes a receipt for them. Foote has his guinea, and does not.

The couple follow the pony down the avenue without once looking round; and the cook, who has said every day for a twelvemonth that she would dance when they went, is found in the scullery with her apron over her head.

${T('hunt') ? 'In November, from the Kennet meadows, you see the pack go away over Hartopp’s swedes with a white hound two lengths before the rest; and Foote, as he gallops past Parson, shouts her name to you.' : 'In November the Craven kill their fox in Hatherley Gorse; and Foote, who brings the brush to the Hall, mentions that it was Ransack who had him by the back.'}`; }},
    {t:'Send Hartopp’s bill on to the hunt.', note:'11s., −Standing', go:() => { add({money:-1, standing:-1}); reg('hartopp', -1, 'You sent his duck bill to the hunt'); dogGone('puppies', 'Entered to the Craven pack');
      return `${master} returns the bill by Foote’s boy, with a line upon the back of it; in which he begs to observe that he has two-and-forty couple out at walk in three counties, that they have eaten, by his computation, some four hundred ducks, and that Mr ${S.sur} is the first gentleman who has sent him the reckoning.

You pay Hartopp the eleven shillings. He has by that time added a twelfth duck, which has died since, he says, of the fright.`; }},
    {t:'Pay; and bid Foote bring another couple at Whitsuntide.', note:'£1 12s., +Standing, −Household', go:() => { add({money:-2, standing:2, family:-2}); dogGone('puppies', 'Entered to the Craven pack');
      return `Foote says that Master will take it very kind. Hartopp is paid; the cook gives warning, and is persuaded, at two pounds a year more, to withdraw it; and upon Whit-Monday there come out of the panniers, upon the same flags, Rummager and Rapture.

Mrs Bunce rules a fresh page in the linen book.`; }}
  ]});

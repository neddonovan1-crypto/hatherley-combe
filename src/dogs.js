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

There are three whelps in the apron; and the fourth, Pryor says, without being asked, died in the night.

You pay him the fourth half-crown notwithstanding. Mudge has the three to bring up; and there is seen that autumn upon ${ground()}, at dusk, a half-grown dog, liver and white, standing at a hare in her form, with one fore foot held up off the ground.`; }},
    {t:'Tell Mudge that the dog which trespassed was your own.', note:'+Goodwill, −Standing', go:() => { add({goodwill:3, standing:-2}); reg('pryor', 2, 'You would not have his lurcher destroyed'); S.game -= 1;
      return `You tell Mudge that the bitch has been at home this month with four whelps; and that you know of one dog only, in the whole business, that was ever off his own ground.

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

/* ---------- what Edmund sends home ----------
   A son at sea sends an ape of Gibraltar by the Portsmouth wagon; a son with the 52nd sends a grey parrot from Lisbon, who was eight months in a French mess.
   Each has papers of its own after. They read Edmund's service through at() and edmundDead only, and write nothing to it.
   In the books: the apes of the Rock; Muley Soliman, Emperor of Morocco; Mr Pidcock's menagerie over Exeter 'Change; Junot in Lisbon from November 1807 until after Vimeiro.
   The ape taken up for a Frenchman is the Hartlepool story, which is a legend, and is used as one. */
const apeKept = () => F('ape') === 'house' || F('ape') === 'stable';
const parrotKept = () => ['house', 'kitchen', 'stable'].includes(F('parrot'));
const parrotRoom = () => F('parrot') === 'kitchen' ? 'the kitchen' : F('parrot') === 'stable' ? 'the saddle-room' : 'the breakfast-room';
const benchMan = () => F('gallDead') ? 'Mr Loveday' : 'Dr Gall';
const BEAST_AFTER = [
  {ev:'apeWig', on:apeKept, t:'apeT', wait:2}, {ev:'apeSpy', on:apeKept, t:'apeT', wait:4}, {ev:'apeWinter', on:apeKept, t:'apeT', wait:6, q:3},
  {ev:'parrotVoice', on:() => parrotKept() && F('edmundDead'), t:'parrotT', wait:1},
  {ev:'parrotCry', on:parrotKept, t:'parrotT', wait:2}, {ev:'parrotBugle', on:() => parrotKept() && !F('edmundDead'), t:'parrotT', wait:5} ];
const ventureTickBeasts = ventureTick;
ventureTick = function(line){ ventureTickBeasts(line);
  if ((FIXED[S.year + '-' + S.season] || []).some(e => !e.cond || e.cond()) || S.queue.some(x => x.at <= S.t)) return;
  for (const a of BEAST_AFTER) { if (!a.on() || S.seen[a.ev] !== undefined || S.queue.some(x => x.id === a.ev)) continue;
    if (S.t - (F(a.t) || 0) < a.wait || (a.q !== undefined && S.season !== a.q)) continue;
    const e = byId(a.ev); if (e.cond && !e.cond()) continue;
    later(a.ev, 0); return; } };

/* ---------- the ape ---------- */

ev({ id:'apeComes', from:1804, to:1808, weight:40, hen:false, at:'hall', who:() => 'edmund', cond:() => at('navy') && !F('ape'), title:'By the Portsmouth Wagon',
  text:() => `Russell’s wagon, which is nine days upon the road from Portsmouth, sets down at the stable gate a hen-coop, corded; and the wagoner, who has carried it the whole way upon the tail-board, with his own dinner in his hat for safety, will not put a hand to the cord again.

“He’ve had my bacon, sir, and my comforter; and he’ve had the linch-pin out twice.”

There sits in the coop, upon a ship’s biscuit, a person some two feet high, in a marine’s red jacket cut down, with a grey face, no tail, and a pair of brown eyes, which are fixed upon your watch-chain. A letter is tied to the bars.

“Gibraltar. My dear Father, I send you by the Dolphin transport an ape of the Rock, which I had of a Moor at Tetuan for a dollar and an old hat. The people call him Muley, after the Emperor of Morocco. He has been six months in the gun-room, where he was allowed a glass of grog upon Saturdays; and he has been turned out of it for an affair with the Purser’s wig, in which I think he was not the only one to blame. He will eat anything that you eat, and several things that you would not. I beg my mother will not be uneasy about the jacket, for he will not go without it. Your affectionate son, Edmund.”

The carriage from Portsmouth is one pound four shillings; and the wagoner asks eighteenpence beside, for the comforter.`,
  choices:[
    {t:'Have him into the house.', note:'£1 5s. 6d.', go:() => { fl('ape', 'house'); fl('apeT', S.t); add({money:-1, family:2}); reg('edmund', 1, 'You kept his ape in the house');
      return `The coop is carried into the hall, and opened. Muley comes out of it upon his hind legs, shakes hands with the footman, and goes up the great staircase by the outside of the banisters.

He is found, a quarter of an hour afterwards, in your dressing-room, before the glass, with the soap upon his chin and your razor in his hand. He gives up the razor when it is asked for, civilly, by the blade.

A hook is put into the wall beside the breakfast-room fire, and a cushion under it. ${hh('Henrietta desires only that he may not be at table when there is company; and by Sunday she has cut down a second jacket for him, of blue.', 'Mrs Bunce is understood to have counted the spoons.')}`; }},
    {t:'Give him to Mudge, for the stable.', note:'£1 5s. 6d.', go:() => { fl('ape', 'stable'); fl('apeT', S.t); add({money:-1, goodwill:1}); reg('edmund', 1, 'You kept his ape');
      return `Mudge receives the coop as he would receive a warrant. Muley is given the empty stall beyond the cob’s, a chain of eight feet, and a horse-rug; and within the week he has learnt to draw the bolt of the corn-bin, to ride the cob to water, sitting very far back, and to pick Mudge’s pocket of his tobacco, which he does not smoke, but hands on to the stable boy.

Upon Sunday, after church, there are forty people at the yard gate. Mudge takes a halfpenny a head from the children of other parishes.`; }},
    {t:'Send him on to Mr Pidcock’s menagerie, at Exeter ’Change.', note:'+£10 10s.', go:() => { fl('ape', 'sold'); add({money:9}); reg('edmund', -1, 'You sold his ape to a menagerie');
      return `The coop goes on to London by the same wagon, with the cord untouched; and Mr Pidcock, who keeps over the shops in the Strand a lion, a tiger and an elephant, writes that he is happy to give ten guineas for an ape of Barbary, in a jacket, who can take snuff.

You had not known that he took snuff. You write as much to Edmund, and enclose the ten guineas; and Edmund replies, in six lines, that the money was not what he sent home.`; }}
  ]});

ev({ id:'apeWig', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'The Archdeacon’s Left',
  text:() => `There are fourteen to dinner, for the Archdeacon’s Visitation; and as Mr Tamworth has sent at the last moment to say that his gout will not let him come, a chair stands empty upon the Archdeacon’s left.

Muley, who was ${F('ape') === 'stable' ? 'chained in the stable' : 'shut into the still-room'} at five, comes in by the window with the second course, in his red jacket, and takes it. He conducts himself, having dined six months in a gun-room, with great propriety; he waits for the dish; he eats his sweetbread with a fork; and when the Archdeacon, who is short-sighted, and has been attending to the lady upon his right, turns round and bows to him over a glass of Madeira, he bows, and drinks.

“Your young friend from the Navy, sir, I think? I did not catch the name.”

Nobody at the table has yet found anything to say, when Muley sets down his glass, reaches up, lifts the Archdeacon’s wig from the Archdeacon’s head, looks into it, and puts it on.`,
  choices:[
    {t:'Present him: Mr Muley, late of the Mediterranean fleet.', note:'+Standing', go:() => { add({standing:2, family:1});
      return `You beg to present Mr Muley, late of the Mediterranean fleet, who was put ashore for an affair with a wig.

The Archdeacon puts up his glass, and looks at his neighbour for some time. He then holds out his hand for the wig; receives it; and observes, when it is upon his head again, that he has sat at this dinner one-and-thirty years, between a great many gentlemen, and that this is the first of them who has not asked him for a living.

Muley is carried out by the footman at the dessert, asleep. The Archdeacon sends him, at Christmas, a pound of figs.`; }},
    {t:'Have him taken out, and beg the Archdeacon’s pardon.', note:'−Standing', go:() => { add({standing:-1}); if (!F('gallDead')) reg('gall', 1);
      return `It takes two men and the butler’s napkin, and it takes them twice round the table. The wig is got back out of the epergne; the Archdeacon, who has in the mean time put his own napkin over his head, accepts your apology in eleven words; and the party breaks up before the tea.

His Charge to the clergy, which is printed at Reading in the month following, has a paragraph upon the keeping of unsuitable animals by persons of property. ${F('gallDead') ? 'The churchwarden' : 'Dr Gall'} orders six copies.`; }},
    {t:'Say nothing, and send round the Madeira.', go:() => { add({standing:1});
      return `You say nothing; the table, which takes its time from you, says nothing either; and the Madeira goes round. The Archdeacon, who feels a draught, and supposes that a window has been opened, finishes what he was saying to the lady upon his right about the tithe of turnips.

Muley wears the wig through the dessert. He gives it up at the door, as the Archdeacon goes out, with a bow; and the Archdeacon, who puts it on before the glass in the hall, is heard to remark to his chaplain that it sits better than it has done this twelvemonth.`; }}
  ]});

ev({ id:'apeSpy', follow:true, hen:false, at:'down', who:() => null, cond:() => apeKept() && S.year <= 1813, title:'Supposed French',
  text:() => `The Serjeant of the ${F('volunteers') ? 'Hatherley' : 'Wyvern'} Volunteers is in the justice room, with four men, a fixed bayonet, and a prisoner; and the prisoner is sitting upon your table, in a red jacket, with his hands tied.

“Took upon the Down, sir, by the beacon, a-looking out to the southward. He won’t give no name, and he won’t speak English.”

The Serjeant has him down upon a paper as a foreigner, of low stature, very dark, supposed French, and wearing without authority a coat resembling the King’s uniform; and he has found upon him, being searched, a tinder-box, four walnuts, and the key of your own cellar. There is not a man of the five who has been farther from the parish than Reading fair. Two of the four, being asked, are ready to swear that he said something to them in French.

Muley, hearing your voice, holds up his wrists.`,
  choices:[
    {t:'Examine the prisoner in form, and discharge him.', note:'4s.', go:() => { add({goodwill:2, standing:1});
      return `You have the paper read. You ask the prisoner his name, his country, and his business upon the Down; and, receiving no answer to any of the three, you enter him in the book as standing mute. You then desire the Serjeant to look at the prisoner’s feet, and to tell the bench how many hands he counts.

The Serjeant looks for some time, and counts four.

The cord is taken off. The four men have a shilling apiece and their beer, upon the understanding that nothing shall be said of it in the village.

Nothing is said of it until Saturday.`; }},
    {t:'Tell the Serjeant he has taken the best look-out in the corps; and enlist him.', note:'+Standing', go:() => { add({standing:2, family:-1});
      return `Muley is sworn in upon the spot, so far as he can be, and goes upon the strength of the corps as a drummer, at nothing a day. He has a white belt pipe-clayed for him; he marches at the head of the company upon field days, upon his hind legs, beside the big drum; and when the Inspecting Field Officer comes down from Reading at Michaelmas, it is remarked that the drummer upon the right is the only man in the front rank who does not look round.

The Field Officer returns the corps at sixty-one rank and file, effective. The Serjeant’s roll has sixty.`; }},
    {t:'Own him, pay for the alarm, and put him upon a chain.', note:'£1 13s.', go:() => { add({money:-2, goodwill:-1});
      return `You own him. The Serjeant begs to mention that the beacon was within a minute of being fired, which would have had the Volunteers of nine parishes under arms by midnight, and the Lord Lieutenant out of his bed; and that he has four men who have lost a day’s work.

You pay twelve shillings to the men, and a guinea to the corps. Muley is led home upon a dog-chain; and before the week is out he has drawn the staple of it from the wall.`; }}
  ]});

ev({ id:'apeWinter', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'A Warmer Climate',
  text:() => `It has frozen eleven nights together, and Muley has a cough.

He sits upon the kitchen fender in his jacket, with a second jacket over it, holding his own elbows; he has not for a week taken anything out of anybody’s pocket; and when the cook, who has complained of him every day since he came, sets a basin of bread and milk before him, he looks at it, and at her, and puts his hand into hers.

Mr Jessop, the apothecary of Wyvern, who is sent for, and who has never before been asked to feel such a pulse, feels it with his eyes shut.

“I should say the chest, sir, in a Christian. I see no reason to say otherwise in this case.”

He orders a waistcoat of flannel next the skin, a spoonful of paregoric at night, and a warmer climate; the last of which, he observes, he has ordered for half the county, and never before for a patient who came from one.`,
  choices:[
    {t:'The flannel, the paregoric, and the kitchen fire until May.', note:'£2', go:() => { add({money:-2, family:1});
      return `The flannel is made by ${hh('Henrietta', 'the cook')}, with sleeves. Muley is given the settle next the kitchen fire; and he has his paregoric from the cook, in a spoon which she lets no other person hold.

He coughs until the end of February. Upon the first warm morning of April he is missed from the settle; and is found upon the ridge of the Hall roof, in the sun, with the flannel off, and the cook’s Sunday cap on.`; }},
    {t:'Send him to Exeter ’Change, where the rooms are kept by stoves.', note:'+£8 8s.', go:() => { fl('ape', 'sold'); add({money:8, family:-1});
      return `The menagerie sends its own man down for him, with a box lined in baize; and gives, the animal being out of health, eight guineas in place of ten.

The cook does not come up to see the box go. A lady of the county, who visits the ’Change in May, reports that there is an ape of Barbary in the second room, in a blue jacket, very stout; who took her muff from her through the bars, turned it inside out, and handed it back.`; }},
    {t:'Send him back to Edmund, and the sea.', if:() => at('navy'), note:'£2', go:() => { fl('ape', 'sea'); add({money:-2}); reg('edmund', 1, 'You sent Muley back to the fleet');
      return `He goes down to Portsmouth by the wagon, in the coop, with a blanket; and from Portsmouth, by the first store-ship, to the fleet.

Edmund writes in March. Muley is come aboard, he says, and is quite recovered. The Captain will not have him in the gun-room; but he is borne upon the ship’s books as a boy of the third class, by the name of Muley Hatherley, and has his grog. Edmund thinks that he was known again. He is certain that the Purser was.`; }}
  ]});

/* ---------- the parrot ---------- */

ev({ id:'parrotComes', from:1808, to:1810, weight:40, hen:false, at:'hall', who:() => 'edmund', cond:() => at('army') && !F('parrot') && (S.year > 1808 || S.season >= 2), title:'Corporal Dacey’s Cage',
  text:() => `A soldier of the 52nd, discharged at Hilsea with one sleeve pinned across his breast, has walked from Portsmouth in four days with a wicker cage upon his back, and a letter in his cap; and he sets the cage down upon the hall table before he will give up either.

“Mr Edmund’s duty, sir; and I was to say that he bites.”

In the cage there is a grey parrot, with a red tail, who is hanging by his beak from the top of it, and regarding the company upside down.

“Belem, near Lisbon. My dear Father, I send you by Corporal Dacey, who lost his arm at Vimeiro, a bird which I bought upon the quay here of the master of a Guinea ship, for two dollars. He was eight months in a French mess while Junot had the town; and the men call him Junot for that reason, and because he has got a great deal that did not belong to him. He whistles; he has some Portuguese, which I am told is not fit for my mother; and he has more of the 52nd than I could have wished. Pray give Dacey a guinea. He would take nothing from me but the bird’s seed. Your affectionate son, Edmund.”

Junot rights himself; looks at the footman; and says, in the voice of a very hoarse man a long way off, something which Corporal Dacey begs to explain is only the word of command for a column to form line.`,
  choices:[
    {t:'Hang him in the breakfast-room window.', note:'£1 1s.', go:() => { fl('parrot', 'house'); fl('parrotT', S.t); add({money:-1, family:1}); reg('edmund', 1, 'You hung his parrot in the breakfast-room');
      return `Dacey has his guinea, and his dinner in the kitchen; where he is kept until dark, telling it how Mr Edmund stood upon the hill.

Junot is hung in the south window of the breakfast-room. He says nothing for three days. Upon the fourth, as the urn is brought in, he observes, in the footman’s own voice, and so that the footman turns round, that the toast is cold.`; }},
    {t:'Give him to the kitchen.', note:'£1 1s.', go:() => { fl('parrot', 'kitchen'); fl('parrotT', S.t); add({money:-1, goodwill:1}); reg('edmund', 1, 'You kept his parrot');
      return `Dacey has his guinea, and his dinner; and Junot is hung over the kitchen dresser, out of the draught.

By the end of the month he has the cook’s voice, the scullery-maid’s cough, and the creak of the jack; and he calls the dairyman, every morning at six, by a name which the dairyman has had from nobody but his wife.`; }},
    {t:'Send him on to the Castle, with your compliments.', note:'+Lord Cullerne', go:() => { fl('parrot', 'castle'); add({money:-1}); reg('cullerne', 1, 'You sent him the parrot'); reg('edmund', -1, 'You gave his parrot to Lord Cullerne');
      return `Dacey has his guinea, and walks the cage two miles farther. Lord Cullerne, who has the bird hung in his billiard-room, is so well pleased with him that he keeps Dacey also, as an under-porter, at fourteen pounds a year, and a coat with one sleeve.

His lordship writes you a note of four lines. He has not, he says, heard such language since the Westminster election; and he begs to be told the English of three words, which he encloses, as his chaplain will not tell him.`; }}
  ]});

ev({ id:'parrotCry', follow:true, hen:false, at:'hall', who:() => null, cut:() => 'parrotCry-' + (F('gallDead') ? 'loveday' : 'gall'), cond:() => parrotKept() && S.year <= 1814, title:'A Seditious Cry',
  text:() => `${F('gallDead') ? 'Mr Loveday of Wyvern, who is in the commission of the peace, has ridden over in the heat' : 'Dr Gall has walked up from the vicarage in the heat'}, which he does not do for a small matter; and he has brought the churchwarden with him, for a witness.

“There has been a seditious cry, sir, from a window of this house, three mornings together.”

The Volunteers were marching past the park pale to their drill upon each of the three; and upon each, as the fifes came abreast of ${parrotRoom()}, a voice from within it was heard by the whole company to call for the Emperor of the French, twice, and then to laugh. The churchwarden has it written down, as near as he could spell it. ${benchMan()}, as a magistrate, is bound to observe that there is an Act of the year ’95 against such expressions, and that it makes no exception of the houses of his brother justices.

Junot, in his cage, has his head under his wing.`,
  choices:[
    {t:'Wake the bird, and let them hear the rest of what he knows.', note:'+Standing', go:() => { add({standing:1}); if (!F('gallDead')) reg('gall', 1, 'He comes on Thursdays to teach the parrot a hymn');
      return `Junot is waked. He looks at ${benchMan()} with one eye, and then with the other; and, having considered the ${F('gallDead') ? 'hat and the whip' : 'bands and the wig'}, he gives the Emperor of the French, twice; the word for a column to form line; six words of Portuguese, at which the churchwarden, who was in the Lisbon wine trade as a young man, goes out into the passage; and, last, the Evening Hymn, whistled, as far as the fourth bar.

${benchMan()} enquires where he had the hymn. It is not known. He writes in his pocket-book that the prisoner is a foreigner, and not answerable; and he comes up every Thursday after that, with a lump of sugar, to teach him the fifth.`; }},
    {t:'Have the parish clerk teach him God save the King.', note:'17s. 6d.', go:() => { add({money:-1, standing:1, goodwill:1});
      return `The parish clerk, who has the best voice in Hatherley, and the most patience, is engaged at sixpence the lesson; and he sits before the cage every evening for five weeks, with a pitch-pipe.

Junot learns it. He gives it upon the King’s birthday, at the open window, as the Volunteers go by, in the clerk’s own voice, as far as the fourth word. For the fifth, without leaving the tune, he supplies the Emperor.`; }},
    {t:'Move the cage to the north side of the house.', note:'−Standing', go:() => { add({standing:-1});
      return `The cage is carried to the north side of the house, to a window that looks upon the wood-yard and the laundry green; and ${benchMan()} is assured that the cry will not be heard again from the road.

It is not. It is heard, upon the Monday following, by eleven laundry-women, who have it explained to them by the footman; and by Saturday there is not a child in Hatherley who does not, upon being sent to bed, call for the Emperor of the French, twice, and laugh.`; }}
  ]});

ev({ id:'parrotBugle', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && !F('edmundDead'), title:'The Rouse',
  text:() => `It is a quarter before five, and not yet light, when the whole house is brought out of its beds by a bugle.

There is no bugle. There is Junot, in ${parrotRoom()}, with the baize half off his cage; and he has given the Rouse, which is sounded to the Light Brigade an hour before day, and which he heard at Belem every morning for six weeks. He gives it again while you stand before him in your night-cap; and he follows it with a serjeant.

“Turn out! Turn out, you beauties, or I’ll have the blankets!”

The footman is upon the stairs with one stocking on. The stable boy, who sleeps over the coach-house, is found in the yard, at attention. And ${steward()}, who lodges at the far end of the east wing, and has not been seen out of his room before eight o’clock these twenty years, is discovered in the passage, in his shirt, with the rent-book under his arm.`,
  choices:[
    {t:'A thicker baize.', note:'+Household', go:() => { add({family:1});
      return `A cover is made of green baize, doubled, with a draw-string; and for nine nights the house sleeps until seven.

Upon the tenth, Junot is heard, under the baize, to sound the Rouse at the usual hour, very small, as it might be from the far side of a hill; and the footman, who has not been told of the second thickness, is found upon the stairs with one stocking on.`; }},
    {t:'Let him sound it; and have the house rise by him.', note:'−Household', go:() => { add({family:-2, money:1});
      return `You give out that the house will rise by the bird. The maids are down by five; the fires are lit by a quarter past; ${steward()} has cast up two quarters’ arrears before breakfast, which he was used to do after dinner; and in the month the saving in candles alone is nine shillings.

The cook gives warning at Michaelmas. She has been called a beauty before, she says, but not at that hour, and not by a fowl.`; }},
    {t:'Hang him in the stable, where the hours are earlier.', if:() => F('parrot') !== 'stable', go:() => { fl('parrot', 'stable'); add({family:1});
      return `Junot is hung in the saddle-room. The stable has always been afoot by five, and takes the Rouse as a civility; and by the end of the summer the cob will not leave her stall until it has been sounded.

But he has the stable by Christmas, as he had the 52nd. He is heard, in Mudge’s voice, to tell a horse that is not there to come over; and Mudge, who is crossing the yard with a bucket in each hand, comes over.`; }}
  ]});

/* If Edmund is killed while the bird is at Hatherley. Written quietly, and left short. */
ev({ id:'parrotVoice', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && !!F('edmundDead'), title:'The Voice',
  text:() => `It is evening, and the candles are not yet brought.${hh(' Henrietta has her work in her lap, and is not working.', '')}

Junot has said nothing since the letter came. He has sat at the back of his cage with his feathers up; he has not whistled; he has not called the footman by the footman’s name.${F('parrot') === 'house' ? '' : ' He was brought up from ' + parrotRoom() + ' that week, and hung in the breakfast-room window; nobody has said by whose order.'}

He speaks now, into the dark room.

“My dear Father.”

It is not the footman’s voice, nor the cook’s. It is a young man’s, a little hoarse, as from the smoke of a billet; and it is the voice of a person trying over the first words of a letter, aloud, before he will put them upon the paper.

He says it again. He has no more of it.`,
  choices:[
    {t:'Leave him where he hangs.', go:() => { add({family:1});
      return `The cage is not moved, and the baize is not put over it. He says it most evenings, at about the hour when the candles come; and nobody in the room looks up${hh(', though Henrietta’s needle stops', '')}.

The footman has been told that he need not hurry with the candles.`; }},
    {t:'Carry the cage up to Henrietta’s room.', if:() => !F('henriettaAway'), go:() => { add({family:2}); reg('henrietta', 2, 'You carried Edmund’s parrot up to her');
      return `You carry it up yourself. Henrietta has it set upon the table by her bed, where the miniature is.

She is heard through the door, late, speaking low, as to a child that is learning its letters. He does not get the rest of it from her. But he will take sugar from her fingers, which he would never do from Corporal Dacey’s; and he has not once bitten her.`; }},
    {t:'Send him down to the kitchen, out of hearing.', go:() => { fl('parrot', 'kitchen'); add({family:-2});
      return `He is taken down to the kitchen that night, with the baize on.

The cook will not have him over the dresser. She hangs him in her own room, off the scullery, and shuts the door upon him at dusk; and what he says there, at the hour when the candles go in upstairs, is heard by nobody but the cook, who has given no account of it.`; }}
  ]});

/* ---------- the later years of the ape and the parrot ----------
   Ned, 28 Nov: the creature is to go on appearing until the end of the game; he may die, and then his burial is to be settled; or he may live on.
   One paper about a year, from BEAST_LATE, after the first three are done. Each winter there is a small chance that he does not see the spring.
   In the books: light guineas, and the scales kept for them; the Local Militia of 1808, for which no substitute was taken; Lord Monboddo, who held the
   orang-outang to be a man without speech; Mr Polito's caravans; the French officers upon parole at Wantage, and their mile of turnpike;
   Marshal Junot, Duke of Abrantes, who threw himself from a window at Montbard in July 1813. */
const beastYears = t => { const n = Math.max(1, Math.floor((S.t - (F(t) || S.t)) / 4)); return numWords(n) + (n === 1 ? ' year' : ' years'); };
const apeBed = () => F('ape') === 'stable' ? 'the stall beyond the cob’s' : 'the settle by the kitchen fire';
const APE_IDS = ['apeComes', 'apeWig', 'apeSpy', 'apeWinter', 'apeAudit', 'apeMeet', 'apeSpoons', 'apeMilitia', 'apeSage', 'apeShow', 'apeBoney', 'apeOld'];
const PARROT_IDS = ['parrotComes', 'parrotCry', 'parrotBugle', 'parrotVoice', 'parrotOrder', 'parrotDacey', 'parrotEgg', 'parrotParole', 'parrotNews', 'parrotWill'];
const beastLast = ids => Math.max(0, ...ids.map(i => S.seen[i] === undefined ? 0 : S.seen[i]));
const BEAST_LATE = [
  {ev:'apeBoney', on:apeKept, hot:true}, {ev:'apeOld', on:apeKept, hot:true},
  {ev:'apeMeet', on:apeKept}, {ev:'apeAudit', on:apeKept}, {ev:'apeSpoons', on:apeKept}, {ev:'apeMilitia', on:apeKept}, {ev:'apeSage', on:apeKept}, {ev:'apeShow', on:apeKept},
  {ev:'parrotNews', on:parrotKept, hot:true}, {ev:'parrotWill', on:parrotKept, hot:true},
  {ev:'parrotDacey', on:parrotKept}, {ev:'parrotEgg', on:parrotKept}, {ev:'parrotOrder', on:parrotKept}, {ev:'parrotParole', on:parrotKept} ];
const BEAST_ODDS = {ape:0.045, parrot:0.05};
const ventureTickLate = ventureTick;
ventureTick = function(line){ ventureTickLate(line);
  const mine = x => APE_IDS.includes(x.id) || PARROT_IDS.includes(x.id) || x.id === 'apeDeath' || x.id === 'parrotDeath';
  if (parrotKept() && F('edmundDead') && S.seen.parrotVoice === undefined && !S.queue.some(x => x.id === 'parrotVoice') && S.t - (F('parrotT') || 0) >= 1) later('parrotVoice', 1);
  /* the winter's chance; it is thrown whatever else the season holds, and the queue finds it a day */
  if (S.season === 3) for (const [who, kept, t] of [['ape', apeKept, 'apeT'], ['parrot', parrotKept, 'parrotT']]) {
    if (!kept() || F(who + 'Roll') === S.year || S.t - (F(t) || 0) < 8 || (who === 'parrot' && S.seen.parrotVoice !== undefined && S.t - S.seen.parrotVoice < 4)) continue;
    fl(who + 'Roll', S.year);
    if (S.year < 1815 && Math.random() < BEAST_ODDS[who]) { S.queue = S.queue.filter(x => !(mine(x) && x.id.startsWith(who))); later(who + 'Death', 0); return; } }
  for (const ape of [true, false]) { const ids = ape ? APE_IDS : PARROT_IDS;
    if (S.queue.some(x => ids.includes(x.id) || x.id === (ape ? 'apeDeath' : 'parrotDeath')) || S.t - (F(ape ? 'apeT' : 'parrotT') || 0) < (S.seen[ape ? 'apeWinter' : 'parrotCry'] !== undefined ? 7 : 12)) continue;
    for (const a of BEAST_LATE) { if (a.ev.startsWith('ape') !== ape || !a.on() || S.seen[a.ev] !== undefined) continue;
      if (S.t - beastLast(ids) < (a.hot ? 1 : ape ? 3 : 2)) continue;
      const e = byId(a.ev); if (e.cond && !e.cond()) continue;
      later(a.ev, 0); break; } } };

/* --- the ape --- */

ev({ id:'apeAudit', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'Audit Day',
  text:() => `The audit is held in the justice room, with ${steward()} at the table, the rent-book open before him, and the tenants upon the bench by the door in the order of their holdings; and Muley, who has gone about the house at ${steward()}’s heels for a month past, and has satisfied himself what it is that a steward does, has got up upon the table beside the ink.

Each man comes forward, and lays down his rent. Muley takes up the first guinea of it before ${steward()} can; turns it over; bites it; and drops it into the bowl.

“He’ve passed mine, sir; and I never had so much as that said for it at the Bank.”

Three tenants are passed in this manner, and go back to the bench well pleased. The fourth guinea he does not drop. He bites it a second time, lays it down in front of ${steward()}, a little apart from the rest, and looks at the man who brought it.`,
  choices:[
    {t:'Have the fourth guinea put in the scales.', note:'+£1', go:() => { add({money:1, goodwill:-1});
      return `${steward()} fetches the gold scales out of the bureau, where they have lain since your uncle’s time. The guinea is found to want five grains of its weight, and to have been filed about the edge.

The man who brought it had it, he says, at Newbury market, of a dealer in pigs; he changes it for another out of his fob, very red; and before Lady Day there is not a farmer upon the estate who brings his rent to the Hall without having first bitten it at home.`; }},
    {t:'Send him out. A tenant of Hatherley is not to be assayed by an ape.', note:'+Goodwill', go:() => { add({goodwill:2});
      return `Muley is put out, and the door shut; and ${steward()} takes the remainder of the rents with his own hand, and gives his receipts.

When the audit breaks up he is found sitting upon the mat on the other side of the door. Every tenant, as he goes by, stops and shows him the receipt; and he looks at each, and lets the man pass.`; }},
    {t:'Let him sit the audit out, and dine with the tenants after.', note:'+Goodwill, −Standing', go:() => { add({goodwill:3, standing:-1});
      return `He sits it out, and passes two-and-thirty guineas and a quantity of silver. At the audit dinner he is given the foot of the long table, opposite to ${steward()}, with a plate of the beef and a horn of the ale; and when the landlord’s health is drunk he stands up upon the bench with the rest.

It is told at Wyvern market upon the Thursday that the squire of Hatherley has an ape to cast up his rents. Two of your brother justices ask you at the Sessions whether it is true, and one of them what he is paid.`; }}
  ]});

ev({ id:'apeMeet', follow:true, hen:false, at:'hall', who:() => null, cond:() => apeKept() && S.season !== 1, title:'A Stranger out with the Craven',
  text:() => `The Craven meet upon the grass before the Hall at half after ten; and as ${master} is moving off to draw Hanger Wood there comes round the corner of the stables the old cob, at a trot, without saddle or bridle, and upon her, sitting very far back, with one hand wound in her mane, Muley in his red jacket.

“I do not know the gentleman, sir. He is better mounted than my second whip; and he has come out in the right colour.”

The cob carried your uncle with these hounds for eleven seasons, and knows a horn as well as she knows the corn-bin. She takes her place at the tail of the field, behind the farmers; and Mudge, who has run out with a halter, says that she will not be turned now for him nor for any man.`,
  choices:[
    {t:'Let him go with them.', note:'+Standing', go:() => { add({standing:2});
      return `They find in Hanger Wood, and run by the Down to Inkpen, five-and-forty minutes. The cob goes by the lanes, as she always went, and is standing in the road at the place where they kill, with her rider still upon her, when the first of the field come up.

Ben Foote, who has blooded every young gentleman in this country for thirty years, looks at him for some time, and then at ${master}; and ${master} sends the pad to the Hall next morning, in a paper, with his compliments to the stranger.`; }},
    {t:'Have Mudge catch the cob.', note:'−Standing', go:() => { add({standing:-1, goodwill:1});
      return `It takes Mudge, the stable boy, a sieve of oats and a quarter of an hour; during which sixty horsemen and nineteen couple of hounds are kept standing in the wind, and ${master} looks twice at his watch.

Muley is lifted down, and walks back to the yard with his hand in Mudge’s. Hanger Wood is drawn blank; and it is the opinion of the field, going home, that the fox had been given time to think of it.`; }},
    {t:'Get upon your own horse, and ride at his side.', note:'+Household', go:() => { add({family:2, standing:1});
      return `You have the brown horse out, and ride with him at the tail of the field, by the lanes, at the cob’s own pace; which is the pace at which you have for some years wished to go, and for which you have never before had a companion to bear you out.

You see the whole of the run from the top of the Down, the two of you, standing still. You are home by two o’clock, dry; and you have never dined better after a day with hounds.`; }}
  ]});

ev({ id:'apeSpoons', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'Eleven Tea-Spoons',
  text:() => `Mrs Bunce has counted the plate twice, and has it written out upon a paper.

“Eleven tea-spoons, sir, the sugar-tongs, and the small cream-jug; and all since Martinmas.”

She has made up her mind as to the person. The new under-housemaid, who came from Hungerford with a character of only nine months, was seen upon the back stairs with a candle at an hour when she had no business there; her box has been looked into, in her absence, and nothing found in it, which Mrs Bunce considers to be worse; and the girl is at this moment in the scullery with her apron over her head. A constable can be had from Wyvern by four o’clock.

Muley is not in ${apeBed()}. He was seen at breakfast-time upon the roof of the dove-house, going in at the top.`,
  choices:[
    {t:'Send Mudge up the dove-house with a ladder.', note:'+Household', go:() => { add({family:2, goodwill:1});
      return `Mudge comes down the ladder with his hat full. There are in it the eleven tea-spoons, the sugar-tongs, and the cream-jug; a silver thimble; four-and-sixpence in halfpence; the key of the tea-chest; a pair of spectacles, which are claimed by ${steward()}; the Archdeacon’s snuff-box, for which a letter was written to three inns; and one walnut.

The girl is fetched out of the scullery, and has a new gown at Christmas. Mrs Bunce counts the plate every Saturday from that time, and upon each Saturday, when she has done, she sends a housemaid up the ladder.`; }},
    {t:'Send for the constable, as Mrs Bunce desires.', note:'−Goodwill', go:() => { add({goodwill:-2, family:-1});
      return `The constable comes at four, and takes the girl’s name, and her mother’s. He is still writing when the pigeons, who have not been able to get into their own house since morning, bring the gardener to see what is the matter; and the gardener brings down the spoons.

The girl will not stay. She goes home to Hungerford the same night by the carrier, with a month’s wages and no character asked; and it is said in Hungerford, by her mother, at the pump, that at Hatherley they will sooner hang a Christian than look in the pigeon-house.`; }},
    {t:'Let the spoons lie. Buy a dozen new, and say no more.', note:'£6', go:() => { add({money:-6, family:1});
      return `A dozen of tea-spoons come down from Rundell’s, in a case, at six pounds; and Mrs Bunce is desired to consider the old ones as worn out.

She considers them so. But the new dozen are nine by Easter, and the sugar-tongs have never been replaced; and the under-housemaid, who knows very well where they all are, is observed to leave a walnut every Sunday at the foot of the dove-house.`; }}
  ]});

ev({ id:'apeMilitia', follow:true, hen:false, at:'hall', who:() => null, cond:() => apeKept() && S.year >= 1808 && S.year <= 1813, title:'Drawn for the Local Militia',
  text:() => `The constable of Hatherley made out in the spring the list of all men in the parish between eighteen and thirty, for the Local Militia; and he made it out, as he makes out every list, from what he was told at the church door and at the alehouse. He is now standing in the hall, with a paper from the Deputy Lieutenants.

“There’s one drawn from the Hall, sir. Muley. I had him of your own footman: a single man, he said, in service, and no children.”

The paper requires Muley, of Hatherley, servant, to appear at the Pelican in Speenhamland upon the fourteenth instant, there to be sworn and enrolled for four years. No substitute is taken under this Act. A man who would be excused must pay his fine, and the constable believes that for a servant it is ten pounds; but he has read the paper through twice, and he cannot find that it says anywhere what a man is to be.`,
  choices:[
    {t:'Pay the fine.', note:'£10', go:() => { add({money:-10});
      return `Ten pounds are paid to the clerk of the subdivision, who gives a receipt for them in the name of Muley, and asks no question that is not upon his form.

The receipt exempts the bearer for two years. Mrs Bunce keeps it in the plate-chest, with the licence for the hair-powder; and the footman, who had only meant to oblige the constable with a full list, is told that the next ten pounds will be stopped out of his wages.`; }},
    {t:'Send him to the Pelican, to be sworn.', note:'+Standing', go:() => { add({standing:2, goodwill:1});
      return `He goes in the gig with Mudge, in the red jacket, brushed. There are three Deputy Lieutenants sitting, with Lord Cullerne in the chair; and his lordship, when the name is called, and answered to, puts up his glass, and desires that the recruit may be measured like any other.

He is stood against the standard, and is found to want two feet and eleven inches of it. The surgeon passes him in every other particular. He is discharged as under size, upon a certificate which his lordship signs with his own hand; and the bench, having no more Hatherley men before it, adjourns for half an hour.`; }},
    {t:'Return him to the Deputy Lieutenants as a foreigner.', go:() => { add({standing:1});
      return `You write that the man drawn is a native of Barbary, and an alien, and so not liable to be balloted.

The clerk replies by the next post that this is very true; and that an alien resident in the county is required by the Act of the 33rd of the King to give in his name, his country, and his occupation to the nearest magistrate, and to take a certificate. You are the nearest magistrate. You enter him in the book: Muley; of Gibraltar, late of Tetuan; no occupation; and you make him out his certificate, which he is seen an hour afterwards to have put in his mouth.`; }}
  ]});

ev({ id:'apeSage', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'A Disciple of Lord Monboddo',
  text:() => `A Dr Peverell, of Edinburgh, who is travelling into the West, has sent in his card from the George at Wyvern, and has followed it within the hour, on foot, with a pair of brass callipers, a tape, and a quarto note-book.

“You have here, sir, as I am informed, a man. I do not say a perfect man; but I shall be obliged by a sight of him.”

He was the friend, he explains, of the late Lord Monboddo, who has shown in six volumes that the orang-outang is of our own species, and wants nothing of humanity but the use of speech, which is an art, and may be taught. Dr Peverell has given eleven years to the question. He desires leave to take the measure of the skull; to observe whether the subject uses a stick in walking; and to try him, for a fortnight, with the vowels.

Muley has come in to look at the callipers.`,
  choices:[
    {t:'Give the Doctor his fortnight.', note:'+Standing', go:() => { add({standing:1, family:-1});
      return `Dr Peverell has the blue bed-room for a fortnight, and the justice room every morning from nine to twelve. The skull is measured in nine directions. Muley sits to it very patiently, with the Doctor’s watch in his hand; and for the vowels he is given, at each attempt, a raisin.

At the end of the fortnight he has eaten a pound and a half of raisins, and has said nothing. But the Doctor has it in his note-book that the subject shut the door of his own accord; that he took snuff, and sneezed, and offered the box; and that upon being asked whether he had rather go back to Africa he was seen distinctly to shake his head. The paper is read at Edinburgh in the winter. Hatherley is named in it twice.`; }},
    {t:'Let him measure, and no more.', go:() => { add({standing:1});
      return `The callipers are allowed, and the tape, and half an hour. Dr Peverell finds the facial angle to be greater by four degrees than he had hoped; he begs a lock of the hair, which Muley gives up with a bad grace; and he remarks, in putting up his book, that he has measured in his time two Members of Parliament who had less.

He will not stay to dinner. He walks back to Wyvern with his tape; and the footman, who held the subject’s head, is found at the pantry glass that evening with a foot-rule.`; }},
    {t:'Tell him that there is no man here but those who are paid wages.', note:'+Household', go:() => { add({family:1});
      return `Dr Peverell bows, and puts the callipers back into his pocket. He had the same answer, he says, from a Duke, who kept one in Hampshire; and he supposes that it is not a question which gentlemen who have property in the subject can be expected to try fairly.

He is shown out by the front door. Muley goes with him as far as the lodge, walking upright, and upon the Doctor’s own side of the road; and at the gate the Doctor is seen to stop, and to take off his hat.`; }}
  ]});

ev({ id:'apeShow', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'Mr Polito’s Caravans',
  text:() => `Mr Polito’s menagerie is at Wyvern for the fair, in five caravans drawn by sixteen horses, with a band of music upon the foremost; and Mr Polito’s man, in a green coat with brass buttons, has walked out to Hatherley before breakfast.

“A lady, sir, of his own nation, three years old next grass, and pining for company. My governor will stand the gentleman’s expenses.”

They have in the second caravan a female ape of Barbary, the only one, the man declares, now travelling in England. She has moped since Bartholomew Fair, and will take nothing but a little warm ale; and it is thought that the sight of a countryman might do for her what the farrier could not. Muley is wanted for the three days of the fair, at a guinea a day. He would be shown, the man allows upon being pressed, at sixpence.`,
  choices:[
    {t:'Let him go for the three days.', note:'+£3 3s.', go:() => { add({money:3, family:-1});
      return `He goes in upon the tail-board of the brewer’s dray, with a clean jacket. Upon the second day of the fair the lady takes an apple out of his hand, and eats it; and upon the third she is shown at ninepence, sitting beside him, with his arm about her neck.

The caravans move for Abingdon in the night. Muley is at the stable gate by seven the next morning, having walked the six miles; he has the three guineas in a bag tied to his collar; and for two days after he sits upon the ridge of the coach-house, with his face to the Abingdon road, and will not come down for Mudge.`; }},
    {t:'Have the lady brought to Hatherley instead.', note:'£5', go:() => { add({money:-5, family:1, goodwill:1});
      return `Mr Polito will not spare her from the fair under five pounds, which are sent; and she comes out in a box upon wheels, with a keeper, who dines in the kitchen and counts the forks.

She is put down in the yard. Muley walks round the box twice; fetches from ${apeBed()} the half of a ship’s biscuit, which nobody had known that he kept; and pushes it between the bars. She is three days at Hatherley, and goes back to the caravans eating. The keeper says that his governor would give forty pounds for the gentleman, and is told the way to the gate.`; }},
    {t:'Refuse. He is not to be shown at sixpence.', note:'−Standing', go:() => { add({standing:-1});
      return `The man in the green coat takes his answer civilly, and asks only whether there would be any objection to a mention.

There is at the fair next day, before the second caravan, a painted cloth nine feet high: THE GENTLEMAN APE OF HATHERLEY, as kept by a Magistrate of this County. It takes, by the showman’s own account, eleven pounds in the three days. What stands behind the cloth is reported by Mudge, who paid his sixpence, to be a boy out of Wyvern workhouse, in a hearth-rug.`; }}
  ]});

ev({ id:'apeBoney', follow:true, hen:false, at:'hall', who:() => null, cond:() => apeKept() && S.year === 1814 && S.season >= 1, title:'A Corsican Wanted',
  text:() => `The Peace, which was proclaimed at Wyvern from the steps of the Town Hall, is to be kept at Hatherley upon Thursday. The parish has had two-and-twenty years of the war, and has paid for it every quarter; and it is to have an ox roasted upon the green, a hogshead of the Hall beer, and at dusk a bonfire, upon which Bonaparte is to be burnt; and a deputation is at your door, consisting of the smith, the parish clerk, and four of the ringers.

“We’ve the faggots, sir, and we’ve the cart. What we’re short of is the Corsican; and it was thought, him being much about the size, and having the coat already.”

They do not design him for the fire. He is to be drawn through the parish in the cart, in a cocked hat of brown paper, with his hand in his waistcoat; and behind the pound, at the last moment, he is to be changed for a figure of straw. The smith will answer for the straw.`,
  choices:[
    {t:'Lend him for the cart.', note:'+Goodwill', go:() => { add({goodwill:3});
      return `He is drawn through Hatherley from the turnpike to the church, with the paper hat upon his head; and as he has for ten years kept his walnuts in the breast of his jacket, his hand is in it the whole way. He is hissed by three hundred people. He takes off the hat to them.

The exchange is made behind the pound, and the straw burns very well. Muley sees it from the top of the sign-post of the Cullerne Arms, with a mug; and he comes home at two in the morning upon the smith’s shoulders, among the ringers, who are singing.`; }},
    {t:'Lend him; but he goes as Lord Wellington, upon the cob.', note:'+Goodwill, +Standing', go:() => { add({goodwill:2, standing:1});
      return `You will not have the King’s coat hissed in your own parish. The straw figure rides in the cart from the beginning; and before the cart, upon the old cob, with a sprig of laurel in his collar, and Mudge at the bridle, goes Muley for the Duke.

He is cheered from the turnpike to the church. The cob, who has not been cheered since she won the farmers’ plate in the year ’96, carries her head like a three-year-old; and the parish clerk, when the faggots are lit, proposes the health of his lordship, and of the gentleman who has stood for him.`; }},
    {t:'Refuse. He has worn the King’s coat ten years.', note:'−Goodwill', go:() => { add({goodwill:-1, standing:1});
      return `The deputation goes away with a guinea for the ringers, and makes shift with the straw.

But the tailor, who dresses the figure, has nothing by him of the right blue; and it is drawn through the parish in a red waistcoat of the clerk’s, and is taken at the church corner for an Englishman, and cheered. The mistake is not found out until it is half burnt. Muley sees the whole from the Hall roof, in his own jacket, sitting very still.`; }}
  ]});

ev({ id:'apeOld', follow:true, hen:false, at:'hall', who:() => null, cond:() => apeKept() && S.year === 1815 && S.season >= 2, title:'The Stable Gate',
  text:() => `Muley has been ${beastYears('apeT')} at Hatherley. He is grey about the muzzle. He goes up the great staircase now by the stairs, with a hand upon the rail; and the red jacket, which is the fourth that has been cut down for him, has been let out under the arms.

Every evening, a little before the lamps are lit, he crosses the yard, and gets up upon the pier of the stable gate, where Russell’s wagon set him down; and there he sits, with his face down the road, until Mudge comes out with the lantern.

“He’s a-looking for the wagon, sir. He’ve looked for it every night since harvest.”

${F('edmundDead') ? 'Nobody at Hatherley has found the way to tell him that there is nothing more to come by it.' : edmAway() ? 'Edmund writes that he hopes to be at Hatherley before Christmas; and that he shall come by the mail to Newbury, and not by the wagon.' : 'Edmund, who was shown him there on Sunday, stood some time at the gate, and did not make a joke of it.'}`,
  choices:[
    {t:'Take your pipe out to the other pier.', note:'+Household', go:() => { add({family:2});
      return `There are two piers to the gate. You have a chair carried out to the second; and you sit there with your pipe, most evenings, until the lantern comes, the two of you, looking down the Portsmouth road.

${F('edmundDead') ? 'Nothing comes by it but the miller’s cart. He looks at you when it has gone by; and you have not anything to tell him either.' : 'Nothing comes by it but the miller’s cart. He hands you down a walnut, sometimes, out of his jacket; and you crack it for him.'}`; }},
    {t:'Have a lamp hung at the gate.', note:'£1 10s.', go:() => { add({money:-1, goodwill:1});
      return `The smith makes an iron for it, and Mudge trims it at dusk; and Muley sits under it an hour longer than he sat before.

The wagoners upon the Portsmouth road take it for an inn, and two of them pull up. They are told by Mudge that it is a private light, kept for a gentleman who expects a parcel.`; }},
    {t:'Bid Mudge bring him in at dusk. The evenings are cold.', go:() => { add({family:1});
      return `He comes in upon Mudge’s arm, without resistance, and is put before the fire in the hall.

He will not stay before it. He has got up, by the next evening, into the window of the staircase, which looks over the yard to the gate; and he sits in it until the house goes to bed, with his hand flat upon the glass.`; }}
  ]});

ev({ id:'apeDeath', follow:true, hen:false, at:'hall', who:() => null, cond:apeKept, title:'The Red Jacket',
  text:() => `The frost came upon Tuesday. Upon Thursday morning Muley is not at the kitchen door for his bread and milk; and he is found in ${apeBed()}, under ${F('ape') === 'stable' ? 'the horse-rug' : 'the cook’s shawl'}, with his knees drawn up, and his jacket buttoned to the neck.

“He went in the night, sir. He’d his hand out from the rug, as if he had a mind to shake with somebody.”

He was ${beastYears('apeT')} at Hatherley. The cook has shut herself into the larder. The stable boy has been sent twice for the same bucket; and Mudge, who has brought the news to you with his hat in his hand, stays in the doorway after he has told it.

There is the question of where he is to lie. ${F('gallDead') ? 'The vicar' : 'Dr Gall'}, who was not asked, has sent up word that the churchyard is for Christians.`,
  choices:[
    {t:'Under the mulberry tree, in his jacket, with a stone.', note:'£3', go:() => { fl('ape', 'dead'); fl('apeGrave', 'mulberry'); add({money:-3, family:2});
      return `The carpenter makes a box of elm, two feet and nine inches. He is carried down the lawn in it by the footman and the stable boy, in the red jacket, with a ship’s biscuit; and Mudge, who will not let the gardener do it, fills in.

The mason at Wyvern cuts the stone in a fortnight. MULEY. A Native of Gibraltar. He came to Hatherley in ${1795 + Math.floor((F('apeT') || 0) / 4)}, and died here in ${S.year}. ${S.seen.apeWig !== undefined ? 'He dined with an Archdeacon.' : 'He wore the King’s Coat.'}`; }},
    {t:'Against the churchyard wall, upon the outside.', note:'+Goodwill', go:() => { fl('ape', 'dead'); fl('apeGrave', 'wall'); add({goodwill:2, family:1});
      return `The sexton digs it for a shilling, close under the wall, upon the Hall side, where the bells are heard as well as they are within. Nothing is read. But there are forty people in the lane, and most of the children of the parish; and the clerk, who is there by accident, takes off his hat.

${F('gallDead') ? 'The vicar is' : 'Dr Gall is'} seen at the vestry window while it is done. He sends up next day to ask what is to be put upon the stone, and whether he may see the words; and he strikes out none of them.`; }},
    {t:'Send him to a preserver of animals in Piccadilly, to be set up.', note:'£6 6s.', go:() => { fl('ape', 'dead'); fl('apeGrave', 'case'); add({money:-6, family:-2, standing:1});
      return `He goes to London by the wagon, in a box, with ice; and he comes back in six weeks, in a glass case with a mahogany foot, sitting upon the limb of a tree, in his jacket, with a walnut in his hand.

The case stands in the hall, upon the table where the hats are put. One of the eyes is a shade too light. The cook will not go through the hall, but round by the yard, in all weathers; and the footman, who shook hands with him the day he came, is seen every morning, in passing the table, to bow.`; }},
    {t:'In the fish-pond, sewn up, as Edmund would have it done at sea.', if:() => at('navy'), note:'+Edmund', go:() => { fl('ape', 'dead'); fl('apeGrave', 'pond'); add({family:1}); reg('edmund', 2, 'You buried Muley as a seaman');
      return `Mudge sews him into a corn-sack, with two of the four-pound weights from the kitchen scales at his feet; and puts the last stitch, upon the footman’s information, through the nose. He is laid upon a hurdle at the head of the pond. You read over him out of Edmund’s old Prayer Book, at the place for those who die at sea; and at the word the hurdle is tilted.

You write the day and the hour to Edmund. He replies, from the fleet, that it was very properly done, and that he has had it entered in the ship’s log. The cook asks for her weights at Lady Day, and is given the price of them.`; }}
  ]});

/* --- the parrot --- */

ev({ id:'parrotOrder', follow:true, hen:false, at:'hall', who:() => null, cond:parrotKept, title:'By Your Own Order',
  text:() => `The carriage is at the door at nine o’clock, with both horses, and the coachman upon the box in his greatcoat; and there is nobody in the house who ordered it.

“Nine o’clock, sir, you said, and to look sharp about it. I knew the voice.”

It was at the door at nine yesterday, and upon Tuesday. The bell has been answered eleven times within the week when no hand had touched it; the footman has twice carried up coals to an empty room; and ${steward()}, who was sent for upon Monday, in your voice, and stood a quarter of an hour with his books before your empty chair, has asked that he may have his orders for the future in writing.

Junot, in his cage in ${parrotRoom()}, is cracking a hemp-seed.`,
  choices:[
    {t:'Every order in writing, until further notice.', note:'−Household', go:() => { add({family:-1});
      return `Slates are hung in the pantry, the kitchen and the stable, and you write upon them yourself. It answers for a fortnight.

Upon the fifteenth day the cook’s slate is left by accident in the breakfast-room, and she, having no order, sends up cold mutton to nine people. Junot is heard that evening to desire, in your voice, that the carriage may come round at six; and the coachman, who has it upon no slate, lies in bed until seven, greatly at his ease.`; }},
    {t:'Take the carriage, since it is there.', note:'+Standing', go:() => { add({standing:2});
      return `You get into it, and are driven to Wyvern; and as the carriage is at the door upon the four mornings following, you go out in it upon each of them.

By the end of the month you have returned eleven visits which had been owing since the spring, sat twice upon the bench, and been to the Bank. Mrs Tamworth says that she has not seen so much of Hatherley since your uncle’s funeral; and the coachman no longer asks from whom he has his orders.`; }},
    {t:'Give your orders in a voice that he has not got.', go:() => { add({family:1});
      return `You give them, for nine days, in a whisper. The footman, who is a little deaf, brings you the newspaper when you have asked for your boots; and dinner is twice put back an hour, the cook having understood it so.

Upon the tenth day there is a whisper from the cage. It desires that the cob may be saddled directly; and Mudge, who has the best ears in the house, has her at the door in five minutes.`; }}
  ]});

ev({ id:'parrotDacey', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && S.year >= 1810 && S.season === 1, title:'The Twenty-first of August',
  text:() => `Corporal Dacey is at the kitchen door, with the dust of the Bath road upon him to the knees. He has walked from Chelsea, where he has his ninepence a day from the Hospital, to keep the day of Vimeiro with the only other person in England, he says, who was in Portugal that summer; and he has brought a pennyworth of hemp-seed in his cap.

“I’d be glad to see the Marshal, sir, if he is at home.”

Junot has bitten in his time the footman, the cook, the apothecary and ${benchMan()}. He walks down the one arm to the wrist, and up it again to the shoulder, and takes hold of Dacey’s ear, gently; and Dacey gives him the word for a column to form line, and has it back.

Ninepence a day, he mentions to the cook, over his beer, does not go a great way in London.`,
  choices:[
    {t:'Give him the lodge at the lower gate, and ten pounds a year.', note:'£10', go:() => { fl('daceyLodge'); add({money:-10, goodwill:2, family:1});
      return `The lodge has stood empty since the old woman died in it. Dacey has it whitewashed by Michaelmas, and a row of cabbages behind; and he opens the lower gate with the one hand, and salutes with it afterwards, which has kept the Tamworths’ carriage standing in the road while he does both.

He walks up to the Hall every Sunday after church, in the red coat, to see the bird. They are an hour together; and the kitchen, by this time, can form line from column as well as any company in the Light Division.`; }},
    {t:'A guinea, his dinner, and the day with the bird.', note:'£1 1s.', go:() => { add({money:-1, family:1});
      return `The cage is carried out into the yard, and Dacey sits by it the whole afternoon upon an upturned bucket, with his beer. He tells the bird how the French came up the hill in column, and what was done to them; and Junot, who was at that time in a French mess in Lisbon, hears him out.

At dusk Dacey puts on his cap, and takes the London road. He is called after, as far as the turnpike, in the voice of a serjeant; and he does not turn round, but he is seen to mend his step.`; }},
    {t:'Send him to the Castle. His lordship wants a man for the gate.', note:'+Lord Cullerne', go:() => { add({goodwill:1}); reg('cullerne', 1, 'You sent him Corporal Dacey');
      return `You give him a line to Lord Cullerne, who has been without an under-porter since Lady Day, and likes a man that has been shot at. Dacey is taken at fourteen pounds a year, with his coals.

He has every other Sunday to himself, and spends it at Hatherley, before the cage. His lordship complains to you, at the Sessions, that the man has taught the Castle peacocks nothing; and asks whether you would part with the bird.`; }}
  ]});

ev({ id:'parrotEgg', follow:true, hen:false, at:'hall', who:() => null, cond:parrotKept, title:'An Egg',
  text:() => `There is an egg upon the floor of Junot’s cage.

The cook found it when the baize was taken off. She has brought it up to you upon a saucer, and she has brought the whole kitchen behind her.

“It’s his own, sir. There’s been no other bird near him; and I’ve had the door in my eye since Candlemas.”

It is white, and something less than a pigeon’s. Junot sits upon the perch with one foot drawn up, and looks down at it with no more concern than he has shown for anything since he came. He has been ${beastYears('parrotT')} at Hatherley under the name of a Marshal of France. He has the language of a serjeant of the 52nd, and a good deal of a Lisbon quay; and it is the footman, who has been bitten by him nine times, that is the first person in the room to say She.`,
  choices:[
    {t:'Madame Junot, from this day.', note:'+Household', go:() => { fl('parrotHen'); add({family:2});
      return `The name is altered in Mrs Bunce’s book, where the hemp-seed is charged; and the cook, who has read in the newspaper that there is a Duchess of that family, takes to calling her so before strangers.

But the household goes on saying He, and nobody has been able to leave it off. The cook explains to the scullery-maid that it is a title, the same as the Marshal. The egg is kept in a wine-glass upon the dresser; and the Duchess continues to give the word for a column to form line, in the bass.`; }},
    {t:'Set the egg under a bantam.', go:() => { add({goodwill:1});
      return `Mudge has a bantam that will sit upon anything, and has brought off a clutch of ducks. She is given the egg in a hat-box, in the saddle-room; and half the parish, in the course of the month, finds an errand to the stable.

She sits five weeks. At the end of them Mudge holds the egg up before a candle, and says nothing, and buries it; and the bantam, who is not convinced, is still upon the hat-box at harvest.`; }},
    {t:'Say nothing. He has been Junot too long to be altered.', go:() => { add({family:1});
      return `No alteration is made, and the saucer is carried down again.

There are four more eggs before Midsummer. The cook removes each of them before the baize is taken off, and nothing is said of it above stairs; but the footman, who has been bitten a tenth time, is heard in the pantry to observe that it is no way for a lady to behave.`; }}
  ]});

ev({ id:'parrotParole', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && S.year >= 1810 && S.year <= 1813, title:'One Mile of the Turnpike',
  text:() => `A French officer is in the hall, with his hat under his arm: a Captain Roche, of the Line, taken at Vimeiro, and these ${numWords(Math.max(2, S.year - 1808))} years upon his parole at Wantage, where he teaches the fencing to the sons of two attorneys. He has heard of the bird from a carrier.

“They say, sir, that he has the voice of a regiment. I have not heard a French voice that I did not see the face of, since I was taken.”

Junot is waked for him. He gives the Emperor; he gives a mess-song of nine lines, of which Captain Roche turns away at the fourth; and then, very loud, a name, and an order to bring the soup. The Captain asks to hear the name again. It was his own Colonel’s, who is dead.

He is by the terms of his parole to keep within one mile of the town, upon the turnpike, and to be in his lodging by the evening bell. Hatherley is nine miles from Wantage. You are a magistrate.`,
  choices:[
    {t:'You did not see him. Let him come upon the first Sunday of the month.', note:'−Standing', go:() => { add({standing:-1, family:1, goodwill:1});
      return `He comes upon the first Sunday of every month, by the Down, on foot, and is gone before dusk. He sits before the cage with his hands upon his knees; and Junot, who knows by the third visit what is wanted, gives him the Colonel and the soup without being asked.

The Agent for Prisoners at Wantage writes to you in the autumn, as to the nearest justice, that one of his officers is thought to be exceeding his limits, and begs to know whether anything has been seen of him at Hatherley. You reply that you have not met with the gentleman upon the turnpike.`; }},
    {t:'Send the bird to Wantage, for a month, by the carrier.', note:'+Goodwill', go:() => { add({goodwill:1, family:-1});
      return `The cage goes over upon the carrier’s cart, with a sack of seed, and hangs for a month in the window of a saddler’s first floor in the market-place, where four officers lodge.

He comes back with a new song, of which the carrier will not give the meaning; with the saddler’s cough; and with the trick of crying the hour in French at the evening bell. Captain Roche sends by the same cart a pair of foils, with his thanks, and a paper of the words that the bird is to be kept in mind of.`; }},
    {t:'Remind him of his parole, and have him driven back.', note:'+Standing', go:() => { add({standing:1});
      return `You tell him that you are sorry for it. He is given a glass of wine, and the gig, with Mudge to drive; and he is set down at the first milestone out of Wantage a quarter of an hour before the bell.

He bows to the cage as he goes out. Junot calls the Colonel’s name after him, as far as the door; and for a week afterwards he calls it every evening at the same hour, to the footman, and is not answered.`; }}
  ]});

ev({ id:'parrotNews', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && (S.year === 1813 && S.season >= 2 || S.year === 1814 && S.season === 0), title:'Marshal Junot',
  text:() => `The Reading Mercury has, between the price of wheat at Mark Lane and a list of bankrupts, eleven lines out of the Paris papers. Marshal Junot, Duke of Abrantes, late Governor of the Illyrian Provinces, who had been for some months disordered in his mind, has thrown himself from a window of his father’s house at Montbard, in Burgundy, and is since dead.

You carry the paper to the cage in ${parrotRoom()}, and read it out. The other Junot, who has had his back to the room, comes about upon the perch at the name.

“Vive l’Empereur!”

He gives it twice, as he was taught, and laughs. Then, there being no fifes in the road, and nobody in the room who answers him, he puts his head upon one side, and waits.`,
  choices:[
    {t:'Give him an English name: Lord Wellington.', go:() => { add({standing:1});
      return `He is Lord Wellington, by your order, to the whole house, for a month; and in the course of it he answers to the name upon no occasion whatever, and bites the footman twice for using it.

Upon the first of the month following, the cook, who has the feeding of him, goes back to Junot of her own authority, and has her finger let alone. The rest of the household follows her within the week; and you are the last.`; }},
    {t:'Tie a black riband to the cage.', note:'+Household', go:() => { add({family:2, standing:-1});
      return `${hh('Henrietta finds', 'Mrs Bunce finds')} a yard of black riband, and it is tied in a bow to the ring of the cage.

It is seen there by Mrs Tamworth, who calls upon Thursday, and who tells it at three houses before dinner that Hatherley has gone into mourning for a French Marshal. You explain at the Sessions that it is for a namesake. The riband stays up the month; and Junot, who has taken it for a present, has it in shreds by the end.`; }},
    {t:'Let the name stand.', go:() => { add({family:1});
      return `The paper is folded, and put with the others; and he is Junot still.

The cook holds that he gives the Emperor less often after that week, and lower. But he is at the same time in the moult; and Mudge, who was asked, says that a bird will always go quiet when he is changing his coat.`; }}
  ]});

ev({ id:'parrotWill', follow:true, hen:false, at:'hall', who:() => null, cond:() => parrotKept() && (S.year === 1814 && S.season >= 2 || S.year === 1815), title:'A Charge upon the Estate',
  text:() => `Mr Spurling is at Hatherley to take your instructions for a codicil. He has gone through the plate, the linen, and the servants’ mourning; and he has come, at the foot of the sheet, to a line in your own hand, at which he has pushed up his spectacles.

“For a grey parrot, sir? I have drawn for a horse before now, and once for a pack of harriers. How long is the party supposed to live?”

It is laid down in the books that a bird of his kind has been known to see sixty years, and one, in the family of a Dutch merchant, a hundred. Junot is thought to be rising twelve. He will by that reckoning see you out, and Mr Spurling; he will very probably see out whoever has Hatherley after you; and somebody must find him in hemp-seed until about the year 1863.`,
  choices:[
    {t:'Five pounds a year, charged upon the Home Farm, for his life.', note:'£2 2s.', go:() => { fl('parrotWill', 'charge'); add({money:-2, family:1});
      return `Mr Spurling draws it in nine lines: five pounds by the year, payable at Michaelmas out of the rents of the Home Farm, to the vicar and churchwardens of Hatherley for the time being, upon trust for the keep of the said bird, known by the name of Junot, so long as he shall live; and after his decease to sink into the residue.

He has put in, of his own motion, that the bird’s death is to be certified by two householders. His bill for the codicil is two guineas, of which he sets eight shillings against the parrot.`; }},
    {t:'Leave him to the cook, with twenty pounds.', note:'+Household', go:() => { fl('parrotWill', 'cook'); add({family:2, goodwill:1});
      return `It is written so; and the cook, being told of it by Mrs Bunce, who was not to have told her, comes up in a clean apron to say that she is very much obliged.

She had meant, she says, to speak about it herself. She has eleven pounds in the Savings Bank at Wyvern, and no relation but a sister at Thatcham who does not write; and she had been to ask the clerk, a month since, whether a person in service could leave her money to a bird.`; }},
    {t:'Leave him with the house, to whoever has it after you.', go:() => { fl('parrotWill', 'house'); add({standing:1});
      return `Mr Spurling says that it cannot be done as you have written it. A parrot is in law a wild animal, in which a man has no more than a qualified property, for so long as he keeps it; and a thing so held will not go with the freehold as an heir-loom, like the pictures.

He puts it into the codicil as a desire. It is the testator’s earnest desire that the grey parrot called Junot may not be parted from Hatherley Hall, nor from the window in which he has been used to hang; and Mr Spurling, who has read it over to you twice, thinks that it will bind a gentleman as well as a covenant.`; }}
  ]});

ev({ id:'parrotDeath', follow:true, hen:false, at:'hall', who:() => null, cond:parrotKept, title:'The Baize',
  text:() => `The footman takes the baize off the cage every morning at seven, and has had for it every morning the same remark upon his legs. He takes it off this morning, and is told nothing.

“He’s at the bottom, sir. I never knew him at the bottom.”

Junot lies upon the sand of the cage, with his red tail spread. The frost was in the room by midnight; and the fire, it appears, was out by one. The house has not been so quiet at seven o’clock since he came. The stable boy, who has been waked by him these ${beastYears('parrotT')}, has overslept himself, and nobody has gone to call him.${S.seen.parrotVoice !== undefined ? `

There were two words that he said, most evenings, in a voice which is not now to be heard anywhere. Nobody in the house has spoken of them this morning.` : ''}`,
  choices:[
    {t:'Under the window where he hung, in the old tea-caddy.', note:'+Household', go:() => { fl('parrot', 'dead'); fl('parrotGrave', 'window'); add({family:2});
      return `The mahogany caddy, which has had no lock since your aunt’s time, is lined by ${hh('Henrietta', 'Mrs Bunce')} with a piece of the green baize. He is laid in it by the cook; and the gardener digs the place, close under the sill, where the sun is by nine.

A sweet-briar is planted over him. The cage is not taken down; and the footman, at seven the next morning, has the baize in his hand before he remembers.`; }},
    {t:'Send for Corporal Dacey, and bury him as a soldier.', note:'+Goodwill', go:() => { fl('parrot', 'dead'); fl('parrotGrave', 'volley'); add({goodwill:2, family:1, money:-1});
      return `Dacey comes${F('daceyLodge') ? ' up from the lodge' : ''} in the red coat, with a crape upon the sleeve that has an arm in it. Three of the Volunteers are had from the village with their firelocks; the box is carried by the stable boy to the corner of the kitchen garden; and Dacey has the three rounds fired over it, blank, at his own word.

When it is done he stands a minute at the place, and gives, not very loud, the word for a column to form line. There is nobody now at Hatherley to give it back. The powder is four shillings.`; }},
    {t:'Have him set up by a bird-stuffer, and put back upon his perch.', note:'£2 2s.', go:() => { fl('parrot', 'dead'); fl('parrotGrave', 'case'); add({money:-2, family:-1});
      return `He is a fortnight gone to Reading, and comes back upon a wire, with his head a little upon one side, as he held it when he was listening.

He is put back into the cage, upon the perch, in the same window. Strangers speak to him. The footman, who cannot break himself of it, puts the baize over him at ten, and takes it off at seven; and the cook has asked that the cage may be turned, so that he does not look towards the kitchen door.`; }}
  ]});

/* What the Mercury has to say of them, in the last reckoning. */
reckoning = (f => function(){ const r = f.apply(this, arguments); if (r.score === null || !r.P) return r;
  const add1 = [];
  if (apeKept()) add1.push(`There is an ape at the Hall, in a red jacket. The son sent him home from Gibraltar. He has been ${beastYears('apeT')} in the parish and has never come upon the rates.`);
  else if (F('ape') === 'sea') add1.push(`The son’s ape went back to the fleet. He is borne upon a ship’s books as a boy of the third class.`);
  else if (F('ape') === 'dead') add1.push(({mulberry:`An ape of Barbary lies under the mulberry tree at the Hall. He has a stone. Strangers are taken to read it.`,
    wall:`An ape of Barbary lies against the churchyard wall at Hatherley, upon the outside. The children keep the grass cut.`,
    case:`An ape of Barbary stands in a glass case in the hall. The footman bows to him.`,
    pond:`An ape of Barbary lies in the fish-pond at the Hall, sewn in a sack. The service for those who die at sea was read over him.`})[F('apeGrave')] || '');
  if (parrotKept()) add1.push(`There is a grey parrot at the Hall who was eight months with the French. He calls for the Emperor still. ${F('parrotWill') === 'charge' ? 'He has five pounds a year charged upon the Home Farm. ' : F('parrotWill') === 'cook' ? 'He is left to the cook. ' : ''}He is expected to see out the parish.`);
  else if (F('parrot') === 'dead') add1.push(({window:`A grey parrot is buried under the breakfast-room window at the Hall, in a tea-caddy. The cage hangs there empty.`,
    volley:`A grey parrot lies in the kitchen garden at the Hall. Three rounds were fired over him.`,
    case:`A grey parrot sits stuffed in his cage at the Hall. He is covered every night at ten.`})[F('parrotGrave')] || '');
  const at1 = Math.min(r.P.length, 2); r.P.splice(at1, 0, ...add1.filter(Boolean)); return r; })(reckoning);

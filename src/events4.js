/* The Post-Captain at the Grange. A chain in three papers: he takes the house in the war on the strength of prize money, he is on half-pay at the peace and cannot find the rent, and the squire's choice comes home a little later.
   Written in the Hatherley hand (docs/voice/VOICE.md). Loaded after estate.js, which owns farms and rents; this file only adds a farm record and moves its arrears.
   The Grange is settled land (own:false), so it cannot be bought and sold for cash. */
NEW_FARMS.grange = {name:'Hatherley Grange', acres:140, base:240, cond:3, tenant:'Captain Lyle'};
LAND.grange = 'A gentleman’s house, with stabling and a home farm';

const grange = () => farm('grange');
const capOffer = (mult) => five(mult * lettingValue(landFor('grange'), S.year));
const peaceTime = () => S.year === 1802 || (S.year === 1814 && S.season >= 2) || S.year === 1815;

ev({ id:'captainTakes', from:1797, to:1812, weight:3, title:'A Captain in Want of a House',
  cond:() => (S.year <= 1800 || S.year >= 1804) && S.t >= 4 && !F('captainIn') && !farm('grange') && S.farms.length < MAX_FARMS,
  text:() => `${steward()} sends up from Wyvern a letter that has been round the town twice, being addressed to “The Proprietor of Hatherley Grange, near Newbury”.

Bath, Tuesday.

Sir, Mr Skinner informs me that the Grange is to let, and that nothing has been done to it since the executors cleared the cellar. I have been a fortnight in this city, and have seen eleven houses, of which not one has a dining-room that will take the Persephone’s plate; and I have a wife and four daughters, and keep six horses.

I will give ${fmt(capOffer(1.3))} a year for seven years, the first half-year paid in advance. I do not haggle. The Court of Admiralty condemned the Spaniard in March.

I am, Sir, your obedient servant, Roper Lyle, Captain, R.N.

${steward()} has pinned a slip to the foot.

“The Naval Chronicle puts his eighth at six thousand pounds, sir. The agents are Cooke and Weddell, of Craven Street. I do not know them. The house is worth ${fmt(lettingValue(landFor('grange'), S.year))} to a farmer.”`,
  choices:[
    {t:'Let him have it at his figure.', note:() => '+' + fmt(capOffer(1.3)) + ' a year, seven years', go:() => { const r = capOffer(1.3), f = addFarm('grange', {own:false, tenant:'Captain Lyle', rent:r, K:3 * r, flush:true, lease:{type:'term', ends:S.year + 7, years:7, level:'fair'}, since:S.year});
      fl('captainIn'); add({standing:2, money:Math.round(r / 2)});
      return f ? `${steward()} writes to Bath that the house is the Captain’s from Midsummer, and the half-year comes by return, in a draft upon Child’s.

Four chaises arrive at the Grange upon a Thursday, the first being full of dishes, and the second having in it a ship’s bell, wrapped in a quilt. The bell is hung over the stable arch, and rung at eight, at noon, and at dusk; and the Wyvern carriers set their watches by it.` : `The house is let to somebody else before the letter is answered.`; }},
    {t:'Ask him for more. He has the Spaniard’s money.', note:() => '+' + fmt(capOffer(1.55)) + ' a year, seven years', go:() => { const r = capOffer(1.55), f = addFarm('grange', {own:false, tenant:'Captain Lyle', rent:r, K:3 * r, flush:true, lease:{type:'term', ends:S.year + 7, years:7, level:'fair'}, since:S.year});
      fl('captainIn'); add({standing:2, money:Math.round(r / 2)});
      return f ? `You write back ${fmt(r)}, and the answer is one line. “Agreed. R. L.”

${steward()}, having read it over the rent book, says nothing, and enters the Grange at ${fmt(r)}; and the Captain’s wagon is at the door the week after, with a stuffed turtle upon the tail-board.` : `The house is let to somebody else before the letter is answered.`; }},
    {t:'Refuse. A farmer would pay less and go on paying.', go:() => { add({goodwill:1});
      return `You send word that the Grange is promised to a tenant from the parish, though it is not; and Mr Skinner puts a board up at the gate. By Michaelmas a Reading maltster, having bought the house over the Captain’s head at Bath, writes to ask whose the pew is.`; }}
  ]});

/* Peace. Hot while it lasts: the Captain is on the list the week the ship is paid off. */
ev({ id:'captainHalfPay', from:1802, to:1815, weight:60, title:'Half-Pay at the Grange',
  cond:() => peaceTime() && F('captainIn') && !F('captainPeace') && !!grange() && !!grange().flush,
  text:() => { const f = grange();
    return `${steward()} lays the rent book upon the library table, and puts his finger upon a line.

“Lyle, at the Grange. The half-year was due Tuesday.”

The Captain comes up on foot, in a plain blue coat with the lace taken off; and being shown into the library, he does not sit.

“The Persephone was paid off at Chatham on the ninth, ${S.sur}. I am put on the list. A Captain’s half-pay at my place on it is eight shillings the day. Mrs Lyle and I have done the sum three times. It makes a hundred and forty-six pounds a year. The rent of the Grange is ${fmt(f.rent)}.”

He takes out of his coat a letter from Cooke and Weddell, of Craven Street, and holds it out; in which they regret that the dividend upon the Spanish prize is deferred, and promise that a further communication will follow.

“Their clerk says they have stopped payment. He could not tell me for how long.” The Captain puts the letter back. “I do not ask you for charity. I ask for time. I shall have a ship or I shall have my money, and either will answer.”

His hat is in both hands, and Mrs Lyle is waiting in the chaise at the lodge.`; },
  choices:[
    {t:'Strike off the half-year and bring the rent down.', note:() => 'Lose ' + fmt(Math.round(grange().rent / 2)) + ' owed. ' + (d => d < 0 ? '−' + fmt(-d) + ' a year in rent' : d > 0 ? '+' + fmt(d) + ' a year in rent' : 'The rent as it stands')(five(0.85 * lettingValue(grange(), S.year)) - grange().rent), go:() => { const f = grange(), a = f.rent / 2; f.arrears = 0; f.rent = five(0.85 * lettingValue(f, S.year)); f.flush = false; f.K = 0.3 * f.rent; fl('captainPeace'); fl('captainPath', 'kept'); add({goodwill:3, standing:1}); later('captainAfter', S.year <= 1802 ? 6 : 3);
      return `${steward()} draws his pen through ${fmt(a)}, and you write the new rent upon the margin of the lease, and put your initials to it.

The Captain, having read the figure, folds the paper in four.

“I had a gunner once who kept a book of what he was owed,” he says. “It was a thin book.”

He bows to ${steward()} as well as to you, and goes out to the chaise.`; }},
    {t:'Lend him two hundred pounds on his bond, and let the arrears wait on the dividend.', note:() => '−£200. ' + fmt(Math.round(grange().rent / 2) + 200) + ' owed to you', if:() => S.money >= 200, go:() => { const f = grange(), a = f.rent / 2; S.capDebt = Math.round(a) + 200; S.capRepays = chance(0.6); f.arrears = 0; f.rent = five(0.85 * lettingValue(f, S.year)); f.flush = false; f.K = 0.4 * f.rent; fl('captainPeace'); fl('captainPath', 'lent'); add({money:-200, goodwill:2}); later('captainAfter', S.year <= 1802 ? 8 : 4);
      return `${steward()} draws a bond upon a half-sheet, and the Captain signs it standing, at the corner of the table, in the same round hand as his letters; by which he is bound to pay ${fmt(S.capDebt)} with interest at five per cent out of the first money to come from Craven Street.

You count out two hundred pounds, and he puts them in his coat without counting them again.`; }},
    {t:'Write to Lord Cullerne for a ship for him.', note:'Lord Cullerne must be your friend. A ship is not sure', if:() => S.chars.cullerne.r >= 0, go:() => { const f = grange(), war = S.year === 1802, p = war ? 0.7 : 0.45; reg('cullerne', -1, 'You asked him for a ship for a half-pay Captain'); f.flush = false; fl('captainPeace');
      if (chance(p)) { f.arrears = 0; f.K = 0.6 * f.rent; fl('captainPath', 'ship'); add({standing:3, goodwill:1}); later('captainAfter', S.year <= 1802 ? 6 : 3);
        return `Lord Cullerne writes upon the back of your own letter, and sends it to the Admiralty by his groom; and the reply comes in nine days.

${war ? 'The Captain is to have the guardship in the Medway, with full pay from the date of his commission.' : 'The Captain is appointed a Regulating Captain of the Impress Service at Bristol, with a salary and a house of his own to be found.'}

He rides over to say so, having put the lace back upon his coat. Mrs Lyle stays in the chaise again, and this time she is waving.`; }
      f.arrears = Math.round(f.rent / 2); f.K = 0; f.asked = S.t - 8; fl('captainPath', 'stuck'); add({goodwill:-1});
      return `Lord Cullerne writes upon the back of your own letter, and sends it to the Admiralty by his groom; and the reply comes in nine days, in a clerk’s hand.

“Their Lordships have no ship at present for any Captain on the list. Forty-one senior to Captain Lyle have applied.”

You send the Captain the answer, and he sends back a note of thanks, and a second half-year’s rent with a gap where it should be.`; }},
    {t:'Give him notice at Michaelmas, and forgive what he owes.', note:() => 'Lose ' + fmt(Math.round(grange().rent / 2)) + ' owed. The house falls in hand', go:() => { const f = grange(), p = pro(f); fl('captainPeace'); fl('captainPath', 'left'); f.flush = false; f.arrears = 0; quit(f); add({goodwill:-1, standing:-1});
      return `The notice is written by ${steward()}, and delivered by hand; and the Captain reads it at the gate, with Mrs Lyle at his elbow.

They are gone by Michaelmas to a small house at Dinan, in Brittany, where the Captain has heard that claret is fourpence the bottle. The ship’s bell is taken down from the stable arch, and the bracket left.`; }},
    {t:'Distrain for the rent.', note:() => 'About ' + fmt(Math.round(grange().rent / 2 / 5) * 5) + ' from the sale. The house falls in hand', go:() => { const f = grange(), got = Math.round(Math.min(f.rent / 2, 0.7 * f.rent) / 5) * 5; fl('captainPeace'); fl('captainPath', 'sold'); f.flush = false; add({money:got, goodwill:-7, standing:-3}); quit(f);
      if (at('navy') && !F('edmundDead')) reg('edmund', -1, 'You sold up a post-captain’s chest');
      return `The bailiff goes to the Grange on Monday with two men and a cart, and the Captain, meeting him in the hall in his full-dress coat, stands by while the inventory is called.

Six horses. A service of Spanish plate, forty-one pieces, some with a different crest on each. A sea-chest. A stuffed turtle, valued at nothing.

The sale is held in the coach-house on Thursday, where the plate fetches ${fmt(got)}; and three officers of the garrison at Newbury, coming in plain clothes to bid for the chest, are overbid by a dealer from Reading. Nobody speaks to the Captain, and he speaks to nobody.` ; }}
  ]});

ev({ id:'captainAfter', follow:true, cond:() => ['kept', 'lent', 'ship'].includes(S.flags.captainPath) && !F('captainEnded'), get title(){ return S.flags.captainPath === 'lent' ? 'The Captain’s Bond' : 'A Letter from the Captain'; },
  text:() => { const path = S.flags.captainPath, war = S.year >= 1803 && S.year <= 1813;
    if (path === 'lent') return S.capRepays
      ? `A bill of exchange comes to Mr Tidmarsh’s from a Lisbon house, drawn by Captain Lyle upon Cooke and Weddell’s assignees, for ${fmt(Math.round(S.capDebt * 1.05))}; and a note comes with it.

“Sir, The assignees have paid eleven shillings in the pound upon the Spaniard. I have taken it all and a good deal of my pride and I send you what is yours. I am to be at sea by the week’s end. R. L.”`
      : `A bill of exchange comes to Mr Tidmarsh’s from Plymouth, drawn upon Cooke and Weddell’s assignees, for ${fmt(Math.round(S.capDebt / 4))}; and a note comes with it.

“Sir, The assignees have paid two shillings and sixpence in the pound upon the Spaniard. I send you the whole of what I have received. The remainder stands upon the bond. I shall write again. R. L.”

Mr Tidmarsh, holding the bill to the light, says it is good; but of the remainder he says nothing.`;
    if (path === 'ship' && !war) return `Bristol, Friday.

Sir, I have taken a house in Clifton, and sit three days in the week in a room over a ropewalk, taking the names of men who do not wish to be taken; and Mrs Lyle pays the rent of the Grange upon the day from my salary. I am sorry to say the girls find Bristol gayer.

I enclose a cheese, that being the best thing in the town.

Your servant, R. Lyle.`;
    return war
      ? `Portsmouth, Friday.

Sir, I am appointed to the Blanche, thirty-six, and am to sail upon the first fair wind. I take my plate to sea; but I leave Mrs Lyle and the girls at the Grange, and she will pay the rent from my Navy Office remittance, half-yearly, to Mr ${steward()}.

I send by the carrier half a pipe of Madeira, taken by me off a Dutchman. I am obliged to you. I am not used to it.

Your servant, R. Lyle.

The Madeira arrives upon a dray, and the carrier asks if it is meant to be drunk by the pint.`
      : `Hatherley Grange, Michaelmas.

Sir, The rent is enclosed, in silver, and I have counted it twice. Mrs Lyle has let the second drawing-room to a Lieutenant’s widow and her mother, by which we shall find the next half-year; and two of my girls are learning the harp from a French refugee, who is paid in salmon.

I have put my name down at the Admiralty every Tuesday. I am told there are two hundred and nine above me.

Your servant, R. Lyle.`; },
  choices:[
    {t:() => S.year >= 1803 && S.year <= 1813 ? 'Write him joy of the ship, and send a ham.' : 'Send him a brace of pheasants and your compliments.', note:'+2 Standing', if:() => S.flags.captainPath !== 'lent', go:() => { fl('captainEnded'); add({standing:2, goodwill:1});
      return `The ham goes to Portsmouth by the coach, in a cloth, with a letter; and the Madeira being opened at Christmas, ${steward()} is asked to take a glass, and drinks it standing.`; }},
    {t:'Ask him to take Edmund for his Lieutenant.', note:'+Edmund’s regard, +Household', if:() => S.flags.captainPath !== 'lent' && at('navy') && navRank() === 1 && !F('edmundDead'), go:() => { fl('captainEnded'); befriend(); add({family:3, standing:1}); reg('edmund', 2, 'The Captain took him as First Lieutenant');
      return `The Captain answers by return of post. “I have a vacancy for a First Lieutenant. I should be glad of a Hatherley.” Edmund is appointed in a fortnight, and writes from the ship that he has a cabin the size of a hip-bath, and a Captain who talks to the barometer.`; }},
    {t:'Enter it in the book.', if:() => S.flags.captainPath === 'lent', go:() => { fl('captainEnded'); const back = S.capRepays ? Math.round(S.capDebt * 1.05) : Math.round(S.capDebt / 4);
      add({money:back, goodwill:1, standing:S.capRepays ? 1 : 0});
      return `${steward()} writes ${fmt(back)} upon the credit side, and carries the rest, if any, to the page headed “Doubtful”. ${S.capRepays ? 'The bond is returned across the table, and Mr Tidmarsh tears it in two.' : 'The bond stays in the drawer.'}`; }}
  ]});

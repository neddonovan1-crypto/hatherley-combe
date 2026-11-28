/* The two honours. A knighthood and a baronetcy each hold up a paper and a plate upon the day they are had, as the ventures do (ventpapers.js),
   and each sends two papers to the Hall afterwards. No sum or flag of the lots themselves is altered here. */
const sirNow = () => 'Sir ' + S.name.split(' ')[0];
const leveeNow = () => S.year < 1811 ? {who:'The King', him:'His Majesty', at:'St James’s'} : {who:'The Prince Regent', him:'His Royal Highness the Prince Regent', at:'Carlton House'};

const HONOUR_PAPERS = {
  knight:{ title:'The Fees of Honour',
    text:() => { const L = leveeNow(); return `The loyal address of the county is engrossed upon a skin of vellum, with four hundred and twelve names beneath it; and as the High Sheriff, whose office it is to carry it, has the gout in both feet, it is you who go up with it to ${L.at}, in a bag-wig, and with a sword which a tailor in Bond Street lets out at half a guinea the day.

${L.who} does not read it. He gives it to the Lord in Waiting, asks of what county you are, and whether you hunt; a cushion is put down; and you are no sooner upon one knee than a sword, which is the Lord in Waiting’s own, has touched your shoulder, and you are bid to rise.

“The fees of honour, ${sirNow()}, are payable before you pass the door.”

It is a Gentleman Usher who says it, in the ante-room, with a printed paper in his hand; and along the wall behind him stand the persons named in the paper. There are five pounds to the Gentlemen Ushers of the Privy Chamber; five to the Serjeants at Arms; a guinea and a half to the Pages of the Presence; something to the Serjeant Trumpeter, to the Household Drums, to the Knight Harbinger, and to the Heralds, for writing your name in a book; and to the King’s Barber, by whom you have not been shaved, one pound.

You give a draft upon Tidmarsh for one hundred and ten pounds. The last man in the paper is a porter at the gate, who, having had his pound, opens it.

Upon Saturday the Gazette has the address at length, and under it: “Which Address ${L.him} was pleased to receive very graciously; and to confer the honour of Knighthood upon ${S.name}, Esq.”${F('henriettaAway') ? '' : ' Henrietta sends to the newsman for six copies.'}`; } },

  baronet:{ title:'A Red Box from the Patent Office',
    text:() => `A post-chaise from London sets down at the Hall door a messenger of the Patent Office, who has upon his knees a box covered with red leather, and will not let the footman carry it.

Within are three skins of vellum, stitched at the foot. The first begins with a great G, inside which the King sits painted in his robes; there follows your name, and Hatherley Combe in the County of Berks; and after some forty lines of the same hand, in which you can make out no stops, you find that it is to you, and to the heirs male of your body lawfully begotten, for ever.${F('edmundDead') ? '' : ' Edmund is Sir after you.'} From the stitching hangs a plaited cord, and from the cord a round tin box, with the Great Seal in it, in yellow wax, six inches across.

${F('henriettaAway') ? '' : `Henrietta reads the three skins through, and then begins them again.

`}The messenger has a paper of his own. It names the Secretary of State’s office, the Signet, the Privy Seal, the Hanaper, the Lord Chancellor’s purse-bearer, and the stamps; and at the foot of it, as you have been told to expect, stand twelve hundred pounds.

“There is the receipt to sign, ${sirNow()}; and the red box goes back with me.”

He dines in the steward’s room, and is gone by four, with the box empty upon his knees. The patent, having now nothing to lie in, is locked by ${steward()} into the deed chest, ${S.mortgage > 0 ? 'upon the top of the mortgage' : 'upon the top of your uncle’s will'}.` }
};

/* The paper is held up in the venture's frame (ventpapers.js), and struck into The Progress with the rest. */
function honourPaper(id){ const p = HONOUR_PAPERS[id]; if (!p) return; const text = p.text();
  if (typeof document === 'undefined' || typeof printHTML !== 'function') return;
  if (!S.plates) S.plates = [];
  const src = artURL('honours/' + id) ? 'honours/' + id : placeCut(id === 'baronet' ? 'hall' : 'london');
  S.plates.push({key:'honour:' + id + ':' + S.t, title:p.title, src, did:(S.journal[0] || {}).did || '', pub:quarterDay(), say:sayOf(text)}); save();
  VENTUP = {text, n:S.plates.length, cost:SOCIETY[id].cost}; showVentPaper(); }
const beginSocietyPlain = beginSociety;
beginSociety = function(id){ const ok = beginSocietyPlain(id); if (ok && HONOUR_PAPERS[id]) { S.soc[id].t = S.t; honourPaper(id); } return ok; };

/* What follows an honour, and when: so many seasons after it, in the season named if one is named, one paper to a quarter, and only in a quarter that has nothing else waiting. */
const HONOUR_AFTER = [
  {of:'knight', ev:'honFirstCouple', wait:1, q:3}, {of:'knight', ev:'honBills', wait:3},
  {of:'baronet', ev:'honPedigree', wait:1}, {of:'baronet', ev:'honSirEdmund', wait:3} ];
const ventureTickHonours = ventureTick;
ventureTick = function(line){ ventureTickHonours(line); if (!S.soc) return;
  if ((FIXED[S.year + '-' + S.season] || []).some(e => !e.cond || e.cond()) || S.queue.some(x => x.at <= S.t)) return;
  for (const a of HONOUR_AFTER) { const h = soc(a.of); if (!h || h.ended || S.seen[a.ev] !== undefined || S.queue.some(x => x.id === a.ev)) continue;
    if (S.t - (h.t || 0) < a.wait || (a.q !== undefined && S.season !== a.q)) continue;
    const e = byId(a.ev); if (e.cond && !e.cond()) continue;
    later(a.ev, 0); return; } };

/* ---------- after the knighthood ---------- */

ev({ id:'honFirstCouple', follow:true, at:'wyvern', who:() => null, cond:() => held('knight') && !F('henriettaAway'), title:'The First Couple',
  text:() => `As the lady of the first rank in the room has, at every assembly in England, the right to call the first dance and to stand at the top of it, the Wyvern Assembly has for nineteen winters been opened by Mrs Tamworth; whose husband’s grandfather was a serjeant-at-law, and who has called the Triumph upon every one of those occasions.

The fiddles are tuned, and the set is forming, when Mr Loveday, who is steward for the night, comes down the room, and makes his bow before Henrietta’s chair.

“Lady ${S.sur} will do us the honour to call the dance. Mrs Tamworth, I believe, stands second.”

Mrs Tamworth is already at the top, with her partner’s hand in hers. She has heard Mr Loveday, as the whole room has; and she is looking with great attention at the chandelier.

Henrietta has not risen. Her fan is shut, and she is looking at you.`,
  choices:[
    {t:'Lead her to the top.', note:'+Henrietta, +Standing', go:() => { add({standing:1, family:2}); reg('henrietta', 1, 'She opened the Wyvern Assembly');
      return `You give Henrietta your hand, and walk her up the whole length of the room. Mrs Tamworth moves eighteen inches down the room; Henrietta calls Sir Roger de Coverley; and the two ladies go down the dance together for twenty minutes, each smiling at the other’s partner.

No basket comes from the Tamworths at Christmas. It was a brace of pheasants last year, and a brace the year before.`; }},
    {t:'Beg that Mrs Tamworth will keep her place.', note:'−Henrietta, +Goodwill', go:() => { add({goodwill:2, family:-2}); reg('henrietta', -1, 'You gave her place to Mrs Tamworth');
      return `You tell Mr Loveday that Lady ${S.sur} could not think of it. Mrs Tamworth, without turning her head from the chandelier, calls the Triumph, for the twentieth winter; and Henrietta, who dances it at the bottom of the set with the curate, is not seen to speak to you again until the carriage has passed the turnpike.

Mr Tamworth walks across the card-room on purpose to shake your hand.`; }},
    {t:'Take Henrietta in to cards.', note:'+£1', go:() => { add({money:1, family:1});
      return `You observe to Mr Loveday that Lady ${S.sur} does not dance to-night; and you take her through into the card-room, where there is no top and no bottom, and where she sits down to whist at the same table with old Mrs Loveday and the Archdeacon.

Mrs Tamworth, having called the Triumph, and danced it, comes in at eleven to cut in. By supper Henrietta has won of her, at shilling points, nineteen shillings.`; }}
  ]});

ev({ id:'honBills', follow:true, at:'wyvern', who:() => null, cond:() => held('knight') || held('baronet'), title:'A Knight’s Port',
  text:() => `${steward()} has the tradesmen’s books before him, as he has upon every quarter-day; and beside the new bill of Mr Pocock, wine-merchant and grocer in the Market Place of Wyvern, he has laid the last.

The old bill is made out to ${S.name}, Esq. It has port at thirty-eight shillings the dozen; wax lights at three shillings and twopence the pound; and best green tea at twelve shillings.

The new one is to ${sirNow()} ${S.sur}, ${held('baronet') ? 'Bart.' : 'Knt.'}, in a larger hand. It has port at forty-four shillings; wax lights at three and eightpence; the same tea at fourteen; and it comes, upon the quarter, to sixteen pounds more than the other.

Mr Pocock, being sent for, arrives in his Sunday coat, and is perfectly easy.

“A ${held('baronet') ? 'baronet' : 'knight'}’s port, ${sirNow()}, is not an esquire’s port. It is three years longer in the wood.”

${steward()} asks him out of which pipe the last dozen was drawn. Mr Pocock replies that it is the same pipe; but that the pipe is three years older than it was.`,
  choices:[
    {t:'Pay it as it stands.', note:'£16, +Standing', go:() => { add({money:-16, standing:1});
      return `You pay the sixteen pounds. Mr Pocock has a new board painted for the front of his shop before the month is out, with “To ${sirNow()} ${S.sur}” upon it, in gold, under the name of Lord Cullerne; and the saddler, the chandler, and the man who sweeps the Hall chimneys, who all pass that board on market day, send in their Midsummer bills in the larger hand.`; }},
    {t:'Let your steward order in his own name.', note:'−Standing', go:() => { add({standing:-1});
      return `From this quarter the orders go down to Wyvern in ${steward()}’s hand, and over ${steward()}’s name; and port comes up to the Hall at thirty-eight shillings the dozen, directed to Mr ${steward()}, out of a pipe which Mr Pocock is ready to take his oath is a different one.

It is known in the Market Place by Saturday who drinks Mr ${steward()}’s port.`; }},
    {t:'Send to Reading for it.', note:'£9', go:() => { add({money:-9, goodwill:-1});
      return `A house in Reading, to which your name is nothing, sends port at thirty-nine shillings, and tea at twelve. The carrier asks four shillings the hamper; two bottles in every dozen come broken, or come empty; and when ${steward()} has cast up the quarter, he finds that you have saved, of Mr Pocock’s sixteen pounds, seven.

Mr Pocock takes off his hat to you in the Market Place as before. He no longer crosses the street to do it.`; }}
  ]});

/* ---------- after the baronetcy ---------- */

ev({ id:'honPedigree', follow:true, at:'hall', who:() => null, cond:() => held('baronet'), title:'Rouge Dragon’s Clerk',
  text:() => `By a warrant of the year 1783, no baronet is to have his name in the roll of that order until his arms and his descent are entered at the Heralds’ College; and accordingly there comes down by the Wyvern coach a Mr Pluckrose, clerk to Rouge Dragon Pursuivant, with a tin case four feet long, and a bag of parish registers copied out in his own hand.

He unrolls upon the library table a sheet of paper as long as the table. Your name is at the foot of it, in a circle; lines go up from the circle to other circles, which are fewer as they rise; and at the top there is one circle by itself, with nothing over it.

“I have you to the year 1688, ${sirNow()}; and there I find a maltster.”

The maltster was of Abingdon. He was twice married, and was buried in woollen; and of his father Mr Pluckrose has found nothing, though he has been through the registers of eleven parishes at a shilling the search.

He has, in the tin case, a second sheet. It is not yet coloured, and he does not unroll it; but he mentions that a family of your name held land near Wantage under King John, and that the College, for eighty pounds, would be at the pains of a further search.`,
  choices:[
    {t:'Enter the maltster.', note:'£30', go:() => { add({money:-30, goodwill:1});
      return `You tell him that the maltster will do. Mr Pluckrose bows, rolls up both sheets, and is paid thirty pounds for the entry, the registers, and the coach.

The pedigree is written into a great book at the College, where any gentleman may read it for half-a-crown: five descents, the last a circle with “of Abingdon, maltster” inside it. Mr Tamworth has paid his half-crown before Lady Day.`; }},
    {t:'Pay for the further search.', note:'£110, +Standing', go:() => { add({money:-110, standing:2});
      return `The further search takes six weeks. There comes back a sheet coloured and gilt, upon which the lines go up from the maltster, through nine circles, to a Sir Hugo de ${S.sur}, who had two hides of land near Wantage in the year 1207, and a wife named Maud.

It costs, with the first sheet, a hundred and ten pounds; and it hangs in the hall, framed, where the county may see it. Between the maltster and the circle next above him, for a space of some hundred and forty years, the line is dotted.`; }},
    {t:'Send him back with his coach fare.', note:'£6, −Standing', go:() => { add({money:-6, standing:-1});
      return `You pay Mr Pluckrose six pounds for his coach and his eleven parishes, and he carries both sheets back to London in the tin case.

Your patent is good without him. But in the roll which the College prints of the Baronets of England, between a name in M and the next, yours is not found; and at the Sessions dinner there is a gentleman, at the lower end of the table, who has the book in his pocket.`; }}
  ]});

ev({ id:'honSirEdmund', follow:true, at:'hall', who:() => null, cond:() => held('baronet') && !F('edmundDead') && S.year >= 1797 && at('home', 'farmer', 'army', 'militia'), title:'The Fourteenth Line',
  text:() => `Edmund${at('army') ? ', who has a fortnight’s leave from the 52nd,' : at('militia') ? ', who is over from the Militia for two nights,' : ''} has had the patent out of the deed chest, and has it open upon the library table when you come in, with the tin box of the Great Seal set upon one corner to keep the vellum from rolling up.

“It is in the fourteenth line, sir. I have only to be of age, and to ask.”

The fourteenth line, when you have found your place in it, declares that the first-born son and heir apparent of every baronet shall, upon attaining the age of one-and-twenty years, have knighthood of the King for the asking, and have it in his father’s lifetime; which clause has stood in every such patent since King James first sold them, in the year 1612. Edmund ${S.year > 1797 ? 'has been of age since the year ’97' : 'is one-and-twenty this year'}.

He has enquired the fees. They are those of any other knight, and go to the same Gentlemen Ushers, Serjeants, Pages and porters: one hundred and ten pounds.${hh(' Henrietta, who has been listening at the door, observes that there would then be a Sir at each end of her table.', '')}

He has not asked you for the money. He has laid the paper of fees upon the patent, with the figures uppermost.`,
  choices:[
    {t:'Pay his fees, and send him up to the Levee.', note:'£110, +Edmund, +Standing', go:() => { const L = leveeNow(); add({money:-110, standing:1, family:2}); reg('edmund', 2, 'You paid for his knighthood');
      return `Edmund goes up by the Wyvern coach upon the Tuesday, kneels at ${L.at} upon the Friday, and is at Hatherley again, Sir Edmund, in time for church.

The first letter that comes to the Hall for a knight of your name, the Christian name upon it having been blotted by the rain, is laid by the footman beside your plate. It is from a tailor in Bond Street, for a court suit and the hire of a sword; and you have read as far as the sum before you observe that it bears this month’s date.`; }},
    {t:'Tell him that one Sir is enough for one house.', note:'−Edmund', go:() => { add({family:-2}); reg('edmund', -2, 'You would not have him knighted');
      return `You tell him that there is one Sir at Hatherley; and that, in the course of nature, there will not be two until there is again but one. Edmund bows, rolls up the three skins, and carries them back to the deed chest himself.

The paper of fees he does not take with him. It is found a month afterwards, folded very small, in the tin box with the Great Seal.`; }},
    {t:'Let him be knighted, if he will find the fees himself.', note:'+Standing, −Edmund', go:() => { const L = leveeNow(); add({standing:1}); reg('edmund', -1, 'He paid for his own knighthood');
      return `Edmund finds them. A banker at Reading, to whom the name of a baronet’s heir is security enough, lends him a hundred and ten pounds upon his note of hand, at five per cent; he kneels at ${L.at} within the month; and of the two Sirs who now sit down to dinner at Hatherley, one pays to a banker at Reading five pounds ten shillings a year.`; }}
  ]});

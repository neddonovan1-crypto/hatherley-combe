/* Mr Robinson. A chain upon the King's illness of 1801 (and of 1804), in which his physicians take a farm of the squire's.
   Written in the Hatherley hand (docs/voice/VOICE.md). Loaded after estate.js and ventpapers.js; it edits neither, and reaches the engine by wrapping
   ventureTick, rentRoll, sellState and halfRent, as common.js and farmworks.js do.

   What is true: the Willises of Greatford in Lincolnshire set their patients to field work in black coats, white waistcoats and powder; Dr John Willis and his brothers
   held the King at Kew in the spring of 1801, kept him from his family and his papers, and were got rid of by the Lord Chancellor; the King never forgave them, and in 1804
   the family would not have them back, so that Dr Simmons of St Luke's came with his own keepers and a strait-waistcoat. The King wrote upon farming as "Ralph Robinson",
   and banked at Drummond's. What is invented: that any of it happened in Berkshire.

   S.king: id (the farm), st ('here', 'gone' while the last paper waits, 'empty' on a retainer, 'done', 'no' if refused), doc ('Willis' or 'Simmons'), n (which stay),
   was (the tenant put out, to be had back), keep (he was paid to go, and holds a promise), R (the rent by the year), t0, paid, qs,
   letter ('given', 'sent' or 'read'), told ('lord', 'none' or 'doctor'), blownAt, freeAt, works ('all', 'none' or 'elm'), end ('well', 'worse', 'freed', 'blown').
   The house is entered as a farm in hand (f.void kept up), so that nothing else in the game finds a tenant there to talk to. */
const kingF = () => S.king && S.king.id ? farm(S.king.id) : null;
const kingIn = () => !!S.king && (S.king.st === 'here' || S.king.st === 'gone') && !!kingF();
const kingHeld = () => !!S.king && ['here', 'gone', 'empty'].includes(S.king.st) && !!kingF();
const kingDocIs = () => S.king && S.king.doc ? S.king.doc : S.year >= 1804 ? 'Simmons' : 'Willis';
const kingDoc = () => 'Dr ' + kingDocIs();
const kingSig = () => kingDocIs() === 'Simmons' ? 'S. F. S.' : 'J. W.';
const kingPick = () => (S.farms || []).filter(f => !f.void && f.tenant && !TENANT_IS(f) && !f.flush && !['kennet', 'grange', 'starveall', 'commonpiece'].includes(f.id) && !(f.id === 'longbarrow' && !f.thorneDone)
  && f.arrears < 1 && !S.letQueue.some(x => x.id === f.id) && !S.payQueue.includes(f.id) && !(S.gone && S.gone.id === f.id)).sort((a, b) => rentDue(b) - rentDue(a))[0];
const kingRent = f => Math.round(3 * rentDue(f) / 20) * 20;
const kingWas = () => { const w = S.king.was; return {name:w.tenant.replace(/^Mr /, ''), called:called(w), Called:Called(w), p:pro(w)}; };
const kingSeason = () => (S.year === 1801 && S.season <= 2) || (S.year === 1804 && S.season >= 1 && S.season <= 2);
const kingParson = () => { const n = parson(); return n === 'The Vicar' ? 'the Vicar' : n; };
const firstName = () => S.name.split(' ')[0];

function kingBegins(f, keep){ const R = kingRent(f), Q = R / 4;
  S.king = {id:f.id, st:'here', doc:kingDocIs(), n:1, keep, R, t0:S.t, paid:Q, qs:1,
    was:{tenant:f.tenant, she:!!f.she, rent:f.rent, lease:JSON.parse(JSON.stringify(f.lease)), level:f.level, K:f.K, since:f.since || 1788}};
  return S.king; }
function kingShuts(f){ f.void = 9; f.arrears = 0; f.lease = {type:'will'}; f.level = 'fair'; delete f.rebate; S.payQueue = S.payQueue.filter(x => x !== f.id); }
function kingOver(f, how){ const k = S.king, w = k.was; k.st = 'done';
  if (how === 'back') { Object.assign(f, {tenant:w.tenant, she:w.she, rent:w.rent, lease:w.lease.type !== 'will' && w.lease.ends <= S.year ? {type:'will'} : w.lease, level:w.level, K:w.K, since:w.since, arrears:0}); delete f.void; }
  else if (how === 'lease') { const r = five(0.85 * lettingValue(f, S.year)); Object.assign(f, {tenant:w.tenant, she:w.she, rent:r, lease:{type:'term', ends:S.year + 7, years:7, level:'fair'}, level:'fair', K:0.5 * w.K, since:w.since, arrears:0}); delete f.void; }
  else f.void = 2;
  if (F('royalKnown') && S.seen.royalTerrace === undefined && S.year <= 1803 && !S.queue.some(x => x.id === 'royalTerrace')) later('royalTerrace', 3); }

/* The quarter's part: the letter sent for, the rent paid, the house kept shut, the papers queued, and the day it ends. */
const ventureTickKing = ventureTick;
ventureTick = function(line){ ventureTickKing(line); kingTick(line); };
function kingTick(line){ const k = S.king, earn = (label, a) => { line(label, a); S.yearIncome += Math.round(a); };
  if (!k) { if (S.seen.kingLetter === undefined && kingSeason() && kingPick() && !S.queue.some(x => x.id === 'kingLetter')) later('kingLetter', 0); return; }
  if (k.st === 'no') { const q = S.t - k.t0;
    if (q === 2) S.notes.push(`Mr Tamworth has let Cold Ash Farm to a physician, upon terms which he declines to name, and has named to everybody; and old Dowsett, who had it thirty years, is gone to his daughter at Speen.`);
    if (q === 5) S.notes.push(k.tam ? `The Doctor has now had Cold Ash four quarters, and Mr Tamworth is building a conservatory.` : `The gentleman at Cold Ash being recovered, and gone to Weymouth within nine weeks of his coming, Mr Tamworth has a farm upon his hands, with iron bars to seven of its windows.`);
    return; }
  if (k.snub && S.t >= k.snub) { delete k.snub; add({standing:-4});
    S.notes.push(`Mr Tamworth has it from a cousin about the Court, that the list of Berkshire gentlemen for the new commission was laid before the King; and that His Majesty, having said “I know that man,” put his pen through one name.`); }
  const f = kingF(); if (!f) { if (kingHeld()) k.st = 'done'; return; }
  if (!['here', 'gone', 'empty'].includes(k.st)) return;
  f.void = 9;
  if (k.st === 'empty') { earn('Drummond’s, to keep ' + f.name + ' shut', k.ret / 4);
    if (S.year >= 1804 && !k.asked) { k.asked = true;
      if (chance(0.65)) later('kingBack', 0);
      else { kingOver(f, 'let'); S.notes.push(`Dr Simmons of St Luke’s, who has now the care at Kew of the person lately attended by Dr Willis, writes that he has no occasion for a house in Berkshire. The retainer ceases from Lady Day, and ${f.name} is to let.`); } }
    return; }
  if (k.st !== 'here') return;
  const q = S.t - k.t0, met = k.n > 1 || S.seen.kingComes !== undefined;
  let end = '';
  if (k.freeAt && S.t >= k.freeAt) end = 'freed';
  else if (k.blownAt && S.t >= k.blownAt) end = 'blown';
  else if (met && q >= (k.n > 1 ? 1 : 2) && (q >= 12 || chance((k.n > 1 ? 0.3 : 0.24) * (k.works === 'all' ? 0.5 : k.works ? 1.6 : 1) * (k.told === 'doctor' ? 0.8 : 1) + 0.04 * Math.max(0, q - 5)))) end = chance(0.62) ? 'well' : 'worse';
  if (end) { k.st = 'gone'; k.end = end; k.out = S.year; later('kingGone', 0); return; }
  earn('Drummond’s, for ' + f.name, k.R / 4); k.paid += k.R / 4; k.qs++;
  if (k.n > 1) return;
  const next = ['kingComes', 'kingAsked', 'kingWants'].find(id => S.seen[id] === undefined);
  if (next && !S.queue.some(x => x.id === next) && (next === 'kingComes' || S.seen.kingComes < S.t)) later(next, 0); }

/* What the book and the plan are told of the farm while it is so held. */
const rentRollKing = rentRoll;
rentRoll = function(){ const rows = rentRollKing(), k = S.king; if (!kingHeld()) return rows;
  const r = rows.find(x => x.id === k.id); if (!r) return rows;
  if (k.st === 'empty') Object.assign(r, {tenant:'Shut up', rent:k.ret, tenure:'Kept shut upon a retainer', says:['Kept shut', 'A retainer of ' + fmt(k.ret) + ' a year from Drummond’s. Nobody can say for how long'], board:'Kept shut'});
  else Object.assign(r, {tenant:kingDoc() + ', for Mr Robinson', rent:k.st === 'here' ? k.R : 0, tenure:'Let during pleasure', says:['Let to ' + kingDoc() + ', during pleasure', fmt(k.R) + ' a year, paid by the quarter. Nobody can say for how long'], board:kingDoc()});
  return rows; };
const sellStateKing = sellState;
sellState = function(id){ const s = sellStateKing(id); if (kingHeld() && S.king.id === id && !s.sellWhy) Object.assign(s, {canSell:false, sellWhy:S.king.st === 'empty' ? 'The house is kept shut upon a retainer.' : 'The house is let to ' + kingDoc() + ' during pleasure.'}); return s; };
const halfRentKing = halfRent;
halfRent = function(){ const r = kingHeld() ? rentRoll().find(x => x.id === S.king.id) : null; return halfRentKing() - (r ? r.rent / 2 : 0); };
/* The King cannot be hunting a stag into the horse-pond, nor walking the Terrace, while he is hoeing at Hatherley; and after it he does not ask whose house this is. */
for (const [id, no] of [['royalStag', () => !!S.king && S.king.st !== 'no'], ['royalTerrace', () => kingIn()]]) { const e = byId(id); if (e) { const was = e.cond; e.cond = () => (!was || was()) && !no(); } }

ev({ id:'kingLetter', follow:true, who:() => null, get at(){ const f = kingPick(); return f ? f.id : ''; }, cond:() => !S.king && !!kingPick(), title:'A Letter from Kew',
  text:() => { const f = kingPick(), p = pro(f), R = kingRent(f), sim = kingDocIs() === 'Simmons', years = f.lease.type === 'will' ? 0 : Math.max(1, f.lease.ends - S.year);
    return `The letter is brought by a groom in a plain drab coat, upon a horse worth eighty guineas, who will neither come into the kitchen nor say whose the horse is; and as he has orders to carry back an answer, he walks the animal up and down under the window while you read.

Kew, Tuesday. Private.

Sir, I write by the desire of persons whom I am not at liberty to name, upon the business of a Patient whom I shall not name either; and I must beg that this sheet be burnt when you have done with it.

${sim ? `The gentleman under my care has been some weeks out of health. I am physician to St Luke’s Hospital, where I have three hundred under my hand; but as the present case is to be treated upon the plan of Dr Willis of Lincolnshire, by air, early hours, and the labour of the Patient’s own hands, and as St Luke’s has four walls and a paved yard, I am obliged to look about me for a field.` : `The gentleman under my care has been some weeks out of health. He wants air, early hours, and above all the labour of his own hands; for at my father’s house at Greatford, in Lincolnshire, where persons of the first families have threshed, thatched and followed the plough, we have seldom known that regimen to fail; and my Patient’s inclination, while he had the command of it, was ever to husbandry.`}

${f.name}, upon your estate, was ridden round on Thursday by my ${sim ? 'son' : 'brother'}, in the character of a dealer in barley. It stands a mile from any turnpike, the yard is walled, and no footpath comes within sight of the windows. I require the house, the yards, and the four closes that lie about them; the remainder of the land you will be pleased to keep in your own hand, that I may have no neighbour but yourself; and the present occupier, with ${p.his} family, servants and dogs, must be gone by this day three weeks.

For this I am empowered to offer three times the rent that ${called(f)} now pays for the whole, being ${fmt(R)} a year, paid by the quarter at Messrs Drummond’s, Charing Cross, and the first quarter down.

I can offer no term. The tenancy is during pleasure; and it will be determined, upon a day’s notice or upon none, by an event for which every subject in this kingdom prays, or by another, against which he prays as heartily. In either case the house is given up as it stands, and the rent ceases from that day.

The gentleman is to be known in the parish as Mr Robinson.

I am, Sir, your most obedient humble servant, ${sim ? 'S. F. Simmons' : 'John Willis'}, M.D.

${Called(f)} has had ${f.name} ${years ? `upon a lease, of which ${numWords(years)} year${years > 1 ? 's are' : ' is'} to run` : `from year to year since ${f.since || 1788}`}; and ${steward()}, to whom you have shown the figure and nothing else, has written it at the head of a clean page.`; },
  choices:[
    {t:() => `Give ${called(kingPick())} notice, and let the Doctor have the house.`, note:() => { const f = kingPick(), c = evictCost(f.id); return '+' + fmt(kingRent(f)) + ' a year while it lasts. −Goodwill, −Standing' + (c.buy ? '. ' + fmt(c.buy) + ' to buy out the lease' : ''); },
      go:() => { const f = kingPick(), p = pro(f), k = kingBegins(f, false), w = kingWas(); evictTenant(f.id, true); kingShuts(f); add({money:k.paid});
        return `${steward()} serves the notice upon the Tuesday. ${w.Called}, having read it through twice in the yard, asks what ${p.he} has done; and being told that ${p.he} has done nothing, and that the house is wanted for a gentleman out of health, ${p.he} asks what the gentleman has done.

The stock is sold upon the Friday week by a Wyvern auctioneer; and the last of the carts is still in the lane when it is obliged to draw into the hedge for two covered wagons from London, in the second of which, between a leaden bath and an iron bedstead, there sit six men in black coats, who do not look out.

By Saturday there is a new padlock upon the yard gate, and in the post-bag a draft upon Drummond’s for ${pounds(k.paid)}.`; }},
    {t:() => `Take it; but pay ${called(kingPick())} to go quietly, and promise ${pro(kingPick()).him} the farm again in writing.`, note:() => { const f = kingPick(); return fmt(five(rentDue(f) / 2)) + ' to the tenant. +' + fmt(kingRent(f)) + ' a year while it lasts'; },
      go:() => { const f = kingPick(), p = pro(f), c = five(rentDue(f) / 2), k = kingBegins(f, true), w = kingWas(); kingShuts(f); add({money:k.paid - c, goodwill:-4});
        return `You ride over yourself, and tell ${w.called} as much as you are at liberty to tell: that a gentleman out of health must have the house; that ${p.he} shall have half a year’s rent for the disturbance; and that the farm is ${p.his} again, at the old rent, upon the day the gentleman leaves it.

“And when is that, sir?”

“I cannot say. It may be a month.”

“Or?”

“Or ten years.”

${w.Called} looks a good while at the wheat. Then ${p.he} asks to have the promise in writing; and when it is written ${p.he} reads it over, dries it at the kitchen fire, and shuts it up in the great Bible at the Book of Job.

The family goes to a brother’s at Thatcham upon the Monday; and upon the Wednesday two covered wagons come down from London, in the second of which, between a leaden bath and an iron bedstead, there sit six men in black coats, who do not look out.`; }},
    {t:() => `Decline. ${kingPick().name} has a tenant.`, go:() => { const f = kingPick(), R = kingRent(f); S.king = {st:'no', t0:S.t, tam:chance(0.5)}; add({goodwill:2});
        return `You write that you are sensible of the honour intended to ${f.name}, but that it is let to a tenant with whom you have no fault to find; and having sanded and sealed the sheet, you put the Doctor’s into the fire, as he desired.

The groom takes your answer without reading the direction, and turns his horse’s head toward Wyvern, upon which road Mr Tamworth has a farm with a walled yard.

${steward()}, who was shown the figure, keeps it to himself for the better part of a day. By Sunday it is known at the Bell that the squire was offered ${pounds(R)} a year to turn ${called(f)} out, and refused it; and by the time the story has walked as far as Kintbury, the sum is five thousand.`; }}
  ]});

/* What he recollects of the landlord: the sword, the swans, and which way the squire took him when the stag was in the pond. The two flags are put down here,
   since the hunt did not keep them; a squire hunted over before this was written gets the turnips. */
{ const stag = byId('royalStag'); if (stag) [['royalRam', 0], ['royalHall', 1]].forEach(([k, i]) => { const c = stag.choices[i], go = c.go; c.go = function(){ fl(k); return go.apply(this, arguments); }; }); }
const kingKnew = () => T('court') || !!soc('knight') || F('royalKnown');
function kingHail(){ const says = [];
  if (soc('knight')) says.push('I did you with the Berkshire address. What?');
  if (T('court')) says.push(swans() ? 'Held the horse. They let me see nobody here, and they have sent me my swan-keeper.' : 'Held the horse. You had my swans. Who has ’em now?');
  if (F('royalRam')) says.push('My stag was in your pond, and I sent you a ram. Does he stand the wet? What?');
  if (F('royalHall')) says.push('I sat in your house in my boots. Old house. Have you pulled it about? What?');
  if (F('royalPlain')) says.push('Nine shillings! You told me nine, and I said twelve. What?');
  if (!says.length) return F('royalKnown') ? S.sur + '! What? The turnips! Hoe ’em twice, I said.' : 'Who’s this? The landlord? What? Good land. Good land.';
  return (soc('knight') ? 'Sir ' + firstName() : S.sur) + '! ' + says.slice(0, 2).join(' '); }

ev({ id:'kingComes', follow:true, who:() => null, get at(){ return S.king ? S.king.id : ''; }, cond:() => kingIn() && S.king.st === 'here', title:'Mr Robinson',
  text:() => { const f = kingF(), w = kingWas(), hail = kingHail();
    return `By the Doctor’s agreement the landlord is to keep away from ${f.name}; and you have kept away, until a note comes about the pump, which draws foul, and which nobody but the landlord can be asked to mend.

In the close behind the barn three men are hoeing turnips abreast, each in a black coat, a white waistcoat, black silk breeches, and powder; and as the two outer men work in silence, and are never a yard before the middle one, nor a yard behind him, it is some time before you understand that they are not there for the turnips.

The middle one is stout, and past sixty. He hoes faster than either, and has not left off talking since you came through the gate.

“${hail} Whose were these? Who had the farm? ${w.name}? Where is ${w.name}? What? Gone? Put out? Not for me. I never asked it. Tell ’em I never asked it.”

He gives you his hand, which neither of the others offers to prevent; and when he has taken it back there is a paper in your glove, folded small, and directed in pencil, “To the Lord Chancellor. By Express.”

${kingDoc()} is coming up from the gate. He is a civil man, and takes off his hat before he speaks.

“My patient is not allowed paper, Mr ${S.sur}. If he has given you any, I must trouble you for it.”`; },
  choices:[
    {t:'Give the Doctor the paper.', go:() => { const knew = kingKnew(); S.king.letter = 'given'; fl('royalKnown'); add({money:52});
      return `You hold it out. The Doctor reads the direction, and no more; and having put the paper into his waistcoat, he looks along the row to the two men in black, who lay down their hoes.

Mr Robinson is walked back to the house between them, at their pace and not at his. At the yard gate he stops, and turns his whole person about, as he would upon a parade.

${T('court') ? '“I knew you, sir. Forty minutes. I shall know you again.”' : knew ? '“I knew you, sir; and I shall know you again.”' : '“I shall know you again, sir.”'}

On Monday there comes by the post a draft upon Drummond’s for fifty guineas, with a half-sheet folded round it, upon which is written, “For the pump.”`; }},
    {t:'Say that he gave you nothing; and send it express from Speen.', note:'£2', go:() => { S.king.letter = 'sent'; S.king.freeAt = S.t + 1; fl('royalKnown'); add({money:-2});
      return `“He gave me his hand, Doctor, and his opinion of the turnips.”

${kingDoc()} looks at your glove, and then at you; and as a physician cannot very well search a justice of the peace in his own field, he puts on his hat.

You do not go home. At the Pelican at Speen an express is to be had at any hour by those who will pay for it; and for one pound eleven and sixpence a boy in a leather cap rides out of the yard for London, with four sides of Mr Robinson’s pencil buttoned into his jacket, before the landlord has done asking whose name is to go in the book.

“Mr Robinson,” you tell him. “Of this parish.”`; }},
    {t:'Say that he gave you nothing; and read it at home.', go:() => { S.king.letter = 'read'; fl('royalKnown');
      return `“He gave me his hand, Doctor, and his opinion of the turnips.”

The Doctor looks at your glove, and puts on his hat.

In the book-room, with the door shut, you unfold four sides of pencil, written upon the fly-leaves of a volume of the Annals of Agriculture. Three of them concern the rotation of crops in the Electorate of Hanover, and are perfectly just. Upon the fourth there is a list of persons to be made Knights of the Garter, of whom two are dead${swans() ? `, with a memorandum that the swans are to be counted at Midsummer by Mr ${S.sur}, and by no physician` : ''}; and under the list, in a larger hand, a single line: “I am as well as you are, and I am kept from my family.”

You hold the paper a good while over the candle before you can let it take. When next you ride by the close he sees you over the hedge, and stops hoeing.

“Any answer? What?”`; }}
  ]});

ev({ id:'kingAsked', follow:true, who:() => 'cullerne', get at(){ return S.king ? S.king.id : ''; }, cond:() => kingIn() && S.king.st === 'here', title:'His Lordship Asks After a Tenant',
  text:() => { const f = kingF();
    return `Lord Cullerne, who has not ridden upon your side of Wyvern these two years, overtakes you in the lane below ${f.name}; and having brought his horse to a walk beside yours, he looks for some time over the hedge.

“You’ve a tenant, ${S.sur}. Stout party. Hoes.”

“A gentleman of Lincolnshire, my lord. Out of health.”

“Lincolnshire be damned.” He says it without heat. “Fox has it he’s ravin’. The Ministers have it he was never better. One of ’em’s lyin’, and there ain’t a man in London can say which.”

His lordship’s groom has dropped back out of hearing, and is looking with great attention at a field of beans.

“If he can sign his name, they’re safe. If he can’t, it’s the Prince, and we’re in.” He turns in the saddle. “You’ve seen him. One line. I’d take it kindly.”`; },
  choices:[
    {t:'Tell him what you have seen.', go:() => { S.king.told = 'lord'; if (chance(0.5)) S.king.blownAt = S.t + 1; add({standing:1}); reg('cullerne', 2, 'You told him how the gentleman at the farm did');
      return `You tell him: that the gentleman hoes a straighter row than either of his keepers; that he talks from the gate to the hedge without drawing breath, and back again; and that he asked, before he asked anything else, who had been put out of the farm to make room for him.

Lord Cullerne hears it through without a word, and sits a moment longer, looking between his horse’s ears.

“Hoes straight, does he. That’s more than Fox can.”

He takes the London road at a canter; and that night, as the Wyvern postmaster tells ${steward()}, and ${steward()} tells you, three letters go up from the Castle under his lordship’s frank.`; }},
    {t:'“A gentleman of Lincolnshire, my lord. I know no more of him.”', go:() => { S.king.told = 'none'; reg('cullerne', -1);
      return `“Just so.” He gathers up his reins. “Just so.”

As it is a rule with his lordship never to ask for anything twice, he does not; but through the whole of the week following a man in the Castle livery, with a spy-glass in the pocket of his coat, is to be seen in the lane, mending a gate that is none of his lordship’s, and that wanted no mending.`; }},
    {t:'Say nothing; and tell the Doctor who has been asking.', go:() => { S.king.told = 'doctor'; add({standing:-1}); reg('cullerne', -2, 'You carried his question to the mad-doctor');
      return `You say that you know nothing of your tenant’s health; and the same afternoon you send a note to ${kingF().name}, to say who has been enquiring after it.

${kingDoc()} thanks you in two lines. From that day there is a man at the end of the lane from light until dark, who turns back, in the course of the first week, a pedlar, the Wyvern carrier, two young ladies with sketch-books, and a groom in the Castle livery, carrying a basket of grapes for the invalid.

At the next Sessions dinner Lord Cullerne takes wine with every magistrate at the table but one.`; }}
  ]});

ev({ id:'kingWants', follow:true, who:() => null, get at(){ return S.king ? S.king.id : ''; }, cond:() => kingIn() && S.king.st === 'here', title:'The Doctor’s Requirements',
  text:() => { const f = kingF();
    return `${steward()}, whose custom it is to read a paper aloud before he will part with it, lays this one upon the table without a word, and stands back.

Wanted at ${f.name}, at the Landlord’s charge, agreeably to the custom between Landlord and Tenant.

Iron bars to seven windows, to be set within the glass.

The well to be covered, and the pond let off.

A paling of oak, eight feet high, about the orchard and the home close, being 210 yards.

A cold bath, nine feet by five, lined with lead.

No newspaper to come within the gate.

The bells of Hatherley church not to be rung until further notice, Mr R. believing that they are rung for him.

${kingSig()}

“I have priced it, sir, all but the last, at a hundred and forty pounds; and I do not know what the ringers will ask for leaving off.”`; },
  choices:[
    {t:'Have it all done; and speak to the ringers.', note:'£140', go:() => { S.king.works = 'all'; add({money:-140, goodwill:-3});
      return `The smith is nine days about the bars, and the plumber from Newbury a fortnight about the bath; which holds, when it is filled, four hundred gallons of pump water, and into which Mr Robinson is put at six every morning.

The ringers are harder to deal with than the plumber. They have rung at Hatherley for every wedding, every burying and every Fifth of November since King Charles’s time, and desire to know who it is that cannot bear a bell; and being told that it is a gentleman from Lincolnshire, they answer that there are bells in Lincolnshire.

A guinea a man settles it. Upon Sunday the parish is called to church by the sexton, who stands in the porch with the dinner bell from the Hall.`; }},
    {t:'Answer that a tenant during pleasure builds at his own charge.', go:() => { S.king.works = 'none'; add({goodwill:1});
      return `You write that a tenant who may be gone tomorrow must do his own building; and that the bells of Hatherley, having been hung by the parish, are not yours to stop.

${kingDoc()} does not dispute it. His own carpenters come down from London within the week, and are a month about the work, lodging at the Bell at four shillings a day; and upon quarter day the draft from Drummond’s is found to be right to a shilling.

But the Doctor has been seen twice in that month at Mr Tamworth’s, walking round a farmhouse with a foot-rule; and upon Sunday, at the first stroke of the tenor, every shutter upon the south side of ${kingF().name} is put up from within.`; }},
    {t:'Do the paling out of your own woods, by your own carpenter; and let the bells alone.', note:'£40', go:() => { S.king.works = 'elm'; add({money:-40, goodwill:4, standing:2});
      return `The paling is sawn out of elm from Hanger Wood, and put up green by your own carpenter, for forty pounds; and before the quarter is out a man may put his hand between any two boards of it.

A stout man may do more. Upon the second Sunday of the month, the bells going for morning service, Mr Robinson is not in the orchard, nor in the close, nor in the house; and the keepers, having run the length of the lane in their silk stockings, find him in Hatherley church, in the churchwardens’ pew, where he has been these twenty minutes.

He makes every response before the clerk, and louder. He beats the time of the psalm upon the pew door; and when ${kingParson()} gives out the text, he says “Good. Good. A short one,” and is heard in the gallery.

He walks back between the two men in black, very well pleased, and bows to the whole churchyard.

There is nobody in Hatherley now who does not know who lodges at ${kingF().name}; and the Doctor, who dined that day at Mr Tamworth’s, is the last to hear it.`; }}
  ]});

const kingRetainer = () => { const k = S.king; return k.end === 'well' && k.n === 1 && S.year <= 1803; };
ev({ id:'kingGone', follow:true, who:() => null, get at(){ return S.king ? S.king.id : ''; }, cond:() => !!S.king && S.king.st === 'gone' && !!kingF(),
  get title(){ const f = kingF(); return (f ? f.name : 'The House') + ' Given Up'; },
  text:() => { const k = S.king, f = kingF(), w = kingWas(), st = steward(), months = numWords(3 * k.qs);
    const key = `“The house is given up from this day. ${kingSig()}”`;
    const how = k.end === 'freed' ? `A chaise and four comes down the lane at noon, at a pace that brings the whole of Hatherley to its doors; and there gets out of it at ${f.name} a lawyer with very heavy eyebrows, in a black coat, who asks for Mr Robinson by that name, and is an hour with him in the parlour, ${kingDoc()} being desired to wait in the yard.

They come out arm in arm. Mr Robinson has his own hat on, and carries his own stick; and at the step of the chaise, seeing you by the gate, he stops.

“${S.sur}! Good man. Good man. It was delivered. What? Put ${w.name} back. Tell ’em I said so.”

The Doctor is left in the yard with his hat in his hand; and before dark the six men in black coats have loaded the bedstead.`
      : k.end === 'blown' ? `The Morning Chronicle of Thursday has a paragraph, and Friday’s coach brings it to Wyvern.

“It is confidently reported that a Great Personage, of whose perfect recovery the Public has been daily assured, has passed these ${months} months upon a Farm in the western part of Berkshire, in the care of a Physician; the Proprietor of which Farm is said to receive for it thrice its value.”

By Saturday noon there are forty persons in the lane from Reading and Newbury, two of them with sketch-books, and a man selling gingerbread; and upon Saturday night two chaises go out by the field gate with their lamps dark.

${st} finds the key upon the kitchen table in the morning, and under it a half-sheet. “The house is given up. You will know why. ${kingSig()}”`
      : k.end === 'well' ? `There is no notice. A carter going early to Wyvern meets two chaises in the lane with the blinds down; and when ${st} rides over at nine, upon the carter’s word, he finds the yard gate standing open, ${k.n > 1 ? 'the handle of the pump still wet' : 'the hoes left standing in the last row of the turnips'}, and the key of the house upon the kitchen table, with a half-sheet under it.

${key}

The Mercury of Monday has the rest. “We have the Happiness to state, from the first Authority, that His Majesty is perfectly recovered of his late Indisposition, and will shortly remove to Weymouth for the Benefit of the Sea Bathing.”`
      : `There is no notice. A carter going early to Wyvern meets two chaises in the lane with the blinds down, and four men riding close beside the second; and when ${st} rides over at nine, upon the carter’s word, he finds the yard gate standing open, the leaden bath put out of doors, and the key of the house upon the kitchen table, with a half-sheet under it.

${key}

The Mercury of Monday has the bulletin, to which there are five physicians’ names, and nothing more. “His Majesty has passed a restless Night, and is not better this Morning.”`;
    const sum = `${f.name} has been let ${numWords(k.qs)} quarter${k.qs > 1 ? 's' : ''}, for which Drummond’s have paid, first and last, ${pounds(k.paid)}. The land is in hand; and ${k.keep ? `${w.called} is at Thatcham, with your promise in ${w.p.his} Bible` : `${w.called} has forty acres at Inkpen, under Mr Hartopp`}.`;
    const ret = kingRetainer() ? `

A second sheet comes by the post from Kew. “Should the house be kept shut, and aired, against any future occasion, I am empowered to continue half of what the farmer paid, being ${fmt(five(k.was.rent * S.rentAdj / 2))} a year. Of the likelihood I say nothing. ${kingSig()}”` : '';
    return how + '\n\n' + sum + ret; },
  choices:[
    {t:() => `Send to Thatcham for ${kingWas().called}.`, if:() => S.king.keep, note:() => fmt(Math.round(S.king.was.rent * S.rentAdj)) + ' a year, as before', go:() => { const w = kingWas(), p = w.p; kingOver(kingF(), 'back'); add({goodwill:3});
      return `${w.Called} is back upon the Monday, with the Bible in the first cart. ${p.He} goes through the house with ${steward()} and a candle; and coming in the yard upon the leaden bath, which was too heavy to be carried away, ${p.he} asks whose it is.

“Nobody’s,” says ${steward()}.

By Tuesday the pigs are drinking out of it.`; }},
    {t:() => `Ask ${kingWas().called} back, upon ${kingWas().p.his} own terms.`, if:() => !S.king.keep, note:() => fmt(five(0.85 * lettingValue(kingF(), S.year))) + ' a year, upon a lease of seven years. +Goodwill', go:() => { const w = kingWas(), p = w.p, f = kingF(); kingOver(f, 'lease'); add({goodwill:5});
      return `${steward()} rides to Inkpen with the offer. ${w.Called} hears him at the door, without asking him in; and ${p.his} terms, which ${p.he} has plainly had by heart for some time, are fifteen in the hundred off the rent, and a lease for seven years, upon one skin, to be signed before ${p.he} moves a cart.

“I have been from year to year, sir,” ${p.he} says. “I know now what it is worth.”

The lease is signed at Wyvern upon the Thursday, at ${fmt(f.rent)} a year until Lady Day ${f.lease.ends}.`; }},
    {t:'Advertise the farm in the Mercury.', note:() => 'In hand a year, then let in worse order' + (S.king.keep ? '. −Goodwill' : ''), go:() => { const k = S.king, w = kingWas(), p = w.p, f = kingF(); kingOver(f, 'let'); if (k.keep) add({goodwill:-6, standing:-1});
      return `The advertisement goes into the Mercury: “To be LET, and entered upon immediately, a capital FARM, with a good House, lately in the Occupation of a Gentleman.” A board to the same purpose is set up at the lane end.

${k.keep ? `Upon the Saturday ${w.called} walks over from Thatcham to read the board; and having read it, ${p.he} takes a folded paper out of ${p.his} pocket, and nails it up beneath.` : `As every farmer who comes to view it asks why the house has stood shut, and as none is satisfied with what he is told, ${steward()} does not expect to let it before the year is out.`}`; }},
    {t:'Take the Doctor’s retainer, and keep the house shut.', if:() => kingRetainer(), note:() => '+' + fmt(five(S.king.was.rent * S.rentAdj / 2)) + ' a year, and no tenant' + (S.king.keep ? '. −Goodwill' : ''), go:() => { const k = S.king, w = kingWas(), p = w.p; k.st = 'empty'; k.ret = five(k.was.rent * S.rentAdj / 2); const kept = k.keep; if (kept) { k.keep = false; add({goodwill:-3}); }
      return `The shutters are put up, and a woman from the lane has a shilling a week to take them down upon dry days. The land stays in hand; and every quarter Drummond’s pay ${pounds(k.ret / 4)} for a house in which nobody lives.${kept ? `

${w.Called}, who has written twice from Thatcham to know the day, is answered that there is no day; and at Michaelmas ${p.he} takes forty acres under Mr Hartopp.` : ''}

At Wyvern it is not understood. Mr Tamworth asks in the market room of the Bell whether ${S.sur} expects his gentleman back; and as nobody can tell him, he asks it again the week after.`; }}
  ]});

ev({ id:'kingBack', follow:true, who:() => null, get at(){ return S.king ? S.king.id : ''; }, cond:() => !!S.king && S.king.st === 'empty' && !!kingF(), title:'A Letter from St Luke’s',
  text:() => { const k = S.king, f = kingF();
    return `The King has been ill again since the middle of February, as the whole kingdom knows from the bulletins, a copy of which is wafered every morning to the door of the George.

St Luke’s Hospital, Friday.

Sir, I have now the care of the Person lately attended by Dr Willis; whose family having resolved that neither that gentleman nor his brothers shall come about him again, I am to do what they did, and to do it without them. I find among the papers handed to me that a house in Berkshire is held ready. I shall want it from Monday, upon the former terms, which I understand to be ${fmt(k.R)} a year, during pleasure. My people bring their own waistcoat.

I am, Sir, your obedient servant, S. F. Simmons, M.D.

${f.name} has stood shut since ${k.out}; and the woman from the lane has the key.`; },
  choices:[
    {t:'Open the house.', note:() => '+' + fmt(S.king.R) + ' a year while it lasts', go:() => { const k = S.king; Object.assign(k, {st:'here', n:2, doc:'Simmons', t0:S.t, qs:1, paid:k.R / 4}); add({money:k.R / 4});
      return `The shutters come down upon the Saturday. Upon the Monday there are two chaises in the lane, and behind them a covered cart, out of which four keepers of St Luke’s get down in brown coats; for Dr Simmons does not hold with powder, nor with hoeing.

Mr Robinson is not seen in the close this time. He walks in the orchard for an hour at noon, with a brown coat upon either side of him; and for the rest of the day nothing is to be learned of him from the lane, except that the pump is going from six until eight.`; }},
    {t:'Ask four times the farmer’s rent. He has nowhere else.', note:'He may agree, or he may take another house', go:() => { const k = S.king, f = kingF();
      if (chance(0.5)) { k.R = Math.round(k.R * 4 / 60) * 20; Object.assign(k, {st:'here', n:2, doc:'Simmons', t0:S.t, qs:1, paid:k.R / 4}); add({money:k.R / 4});
        return `Dr Simmons answers by return of post, in a line. “Agreed, at ${fmt(k.R)}. It is not my money.”

The chaises are in the lane upon the Monday, with a covered cart behind them; and four keepers of St Luke’s get down from it in brown coats, the last of whom carries a canvas bag, with straps to it, which he does not put down.`; }
      k.doc = 'Simmons'; kingOver(f, 'let');
      return `Dr Simmons answers by return of post. “Sir, I have a house at Kew for nothing. The retainer ceases from this day.”

${steward()} takes down the shutters himself, and sets up a board at the lane end; and the woman who had a shilling a week for opening them asks whether she is to have it until Michaelmas.`; }},
    {t:'Decline, and let the farm to a farmer.', note:'In hand a year, then let in worse order', go:() => { const f = kingF(); S.king.doc = 'Simmons'; kingOver(f, 'let'); add({goodwill:1});
      return `You write that the house has stood empty long enough, and is to be let to a man who will live in it.

Dr Simmons does not answer. The last draft from Drummond’s comes at quarter day, for the broken quarter, and is right to a shilling; and the board goes up at the lane end the same week.`; }}
  ]});

const kingTitled = () => held('knight') || held('baronet');
ev({ id:'kingThanks', follow:true, who:() => null, at:'london', cond:() => !!S.king && S.king.letter === 'sent', title:'A Card from the Lord Chamberlain',
  text:() => `A card comes from the Lord Chamberlain’s office, with a letter from an equerry folded inside it.

“His Majesty, who forgets nothing, has more than once named Mr ${S.sur} of Hatherley, and a field of turnips, and an express from Speen; and I am commanded to say that if Mr ${S.sur} should attend the Levee upon Wednesday, he will not be suffered to go away as he came.”

${held('knight') ? `As it was at a Levee that you were knighted, with the address of the county in your hand, ${hh('Henrietta, who has read the letter over your shoulder, asks what there is left for you to come away with', 'you read the last line twice, to learn what there is left for you to come away with')}; and the equerry does not say.` : kingTitled() ? `What a King may give to a man who is Sir already, the equerry does not say.` : `The fees upon a knighthood are a hundred guineas, divided among the Heralds, the Lord Chamberlain’s people, and eleven doorkeepers. ${hh(`Henrietta, who has read the letter over your shoulder, is gone upstairs to try how “Lady ${S.sur}” looks upon the back of a cover.`, `Henrietta has the news in Gay Street by Friday; and her answer, which is charged double, has “Lady ${S.sur}” written nine times down the margin.`)}`}

Of ${kingDoc()} the equerry writes nothing. It is said at Windsor that the name is not to be spoken there.`,
  choices:[
    {t:'Go up to the Levee, and kneel.', if:() => !kingTitled(), note:'£105', go:() => { S.soc = S.soc || {}; S.soc.knight = {year:S.year, t:S.t}; add({money:-105, standing:3}); SOCIETY.knight.begin();
      return `You kneel upon a red cushion at St James’s. The King, having come out without a sword, borrows the Lord in Waiting’s; and he lays it upon your left shoulder, and then, having considered, upon your right.

“Rise, Sir ${firstName()}. What? ${swans() ? 'Count ’em twice' : 'Hoe ’em twice'}.”

He passes on to a bishop. The fees are paid to eleven doorkeepers in turn, the last of whom, having counted his, opens the door.`; }},
    {t:'Go up to the Levee.', if:() => kingTitled(), go:() => { add({standing:4, family:2});
      if (held('knight')) return `The King, coming round the circle at St James’s, stops before you; looks at your face; and then, for some time, at your left shoulder.

“I have done you. What? Did you with the Berkshire address. Can’t do a man twice; the Heralds won’t have it.”

He takes you by a button instead, and keeps you by it for six minutes, upon the subject of the Swedish turnip, while a duke and the Bishop of Durham stand waiting behind him with their hats under their arms.

Upon the Friday a groom comes down from Windsor with a box. There is in it a snuff-box of gold, with a cypher upon the lid; and inside the lid, cut small, “For the Express. G. R.”`;
      return `The King stops before you in the circle at St James’s, which he does for nobody else below an earl, and holds you by a button for six minutes, upon the subject of the Swedish turnip.

Upon the Friday a groom comes down from Windsor with a box. There is in it a snuff-box of gold, with a cypher upon the lid; and inside the lid, cut small, “For the Express. G. R.”`; }},
    {t:'Send your duty, and stay at home.', go:() => { add({goodwill:2, standing:1, money:1.575}); fl('merinoRam');
      return `Your answer to the equerry is that you rode with a letter to the post-house at Speen, as any man would who had a horse; that the express cost you one pound eleven and sixpence, and nothing else; and that you are His Majesty’s dutiful subject.

No card comes back. But within the month a groom in the Windsor livery walks up the avenue leading a ram of the Spanish breed, and has in his other hand a small packet, sealed, which he will give up to nobody but yourself. There are in it a guinea and a half-guinea; and round them, in pencil, upon the back of a seedsman’s bill: “For the Express. Paid. G. R.”`; }}
  ]});

/* The sword is offered once. A squire who has had the King's card, and did not kneel, is not sent up afterwards with the county's address. */
{ const needs = SOCIETY.knight.needs; SOCIETY.knight.needs = () => needs().concat(S.king && S.seen.kingThanks !== undefined && !soc('knight') && !held('baronet')
    ? [{ok:false, t:'You were bid to the Levee once, and sent your duty. The county does not send up with its address a gentleman who has already stayed away.'}] : []); }

/* What follows the last paper: the Levee for the man who posted the letter, and the King's long memory for the man who gave it up. */
{ const gone = byId('kingGone'); for (const c of gone.choices) { const go = c.go; c.go = function(){ const k = S.king, end = k.end, text = go();
    if (k.letter === 'sent' && S.seen.kingThanks === undefined && !S.queue.some(x => x.id === 'kingThanks')) later('kingThanks', 2);
    if (k.letter === 'given' && end === 'well' && !k.snubbed) { k.snubbed = true; k.snub = S.t + 2; }
    return text; }; } }

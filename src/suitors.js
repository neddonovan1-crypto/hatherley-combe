/* Kitty's suitors. The first playtest launched her (a Drawing Room, Seasons in town, Paris in the peace) and saw two men in twenty years.
   Four more come here, and they come because she has been seen: a neighbour's heir, a Viscount's eldest son met in town, a naturalist met at Paris, a post-captain met at Bath or in town.
   Each time she is taken up to London, to Bath or to Paris counts (kittyLaunch); the more she is out, the sooner one calls, and the better the terms a great family will take.
   Mr Lyde's history rests upon the decree of 2 Prairial, year XI (22 May 1803), by which British men in France between eighteen and sixty were made prisoners and sent to Verdun until 1814.
   Written in the Hatherley hand (docs/voice/VOICE.md). Papers that put Henrietta in the room carry a second reading for when she is at Bath. */

Object.assign(PEOPLE, {
  purefoy: {name:'Mr Giles Purefoy', role:() => K() === 'purefoy' ? 'Your son-in-law, of Shalbourne' : 'Of Shalbourne. Harriers', r:0, met:false},
  wray: {name:'Mr Augustus Wray', role:() => K() === 'wray' ? 'Your son-in-law, heir to Lord Stanmere' : 'Lord Stanmere’s eldest son', r:0, met:false},
  lyde: {name:'Mr Ambrose Lyde', role:() => K() === 'lyde' ? 'Your son-in-law. Mosses' : F('lydeVerdun') && S.year <= 1813 ? 'A prisoner at Verdun' : 'Of Shropshire. Mosses', r:0, met:false},
  peverell: {name:'Captain Peverell', role:() => K() === 'peverell' ? 'Your son-in-law, at sea' : 'Post-captain, ashore', r:0, met:false}
});
const atVerdun = () => F('kittyVerdun') && S.year <= 1813;
PEOPLE.purefoy.bio = () => K() === 'purefoy' ? `Heir to Shalbourne, and to his father’s harriers; a young man of few words in a drawing-room, and of a great many in a kennel, who married Kitty in a frost.`
  : `Heir to Shalbourne, to two thousand four hundred acres, and to a pack of harriers; who called at the Hall upon three different horses in one week, to ask after a cold.`;
PEOPLE.wray.bio = () => K() === 'wray' ? `Your son-in-law, and heir to Viscount Stanmere; who stands six feet two, and is reading Mr Gibbon aloud of an evening, Kitty having chosen it.`
  : `Eldest son of Viscount Stanmere, six feet two, and held by his own family to be the best-natured man in Hertfordshire; who left his card nine mornings together at your door in town.`;
PEOPLE.lyde.bio = () => `A Shropshire gentleman of eighteen hundred a year, and a Fellow of the Linnean Society; so short-sighted that he gave you his hat, and so much in earnest upon the subject of moss that Kitty went four mornings to hear him.${F('lydeVerdun') && K() !== 'lyde' && S.year <= 1813 ? ' He is detained at Verdun.' : ''}`;
PEOPLE.peverell.bio = () => `A post-captain, with eleven thousand pounds of Spanish prize money in the Funds, and a musket ball in his thigh; who taught Kitty to take the altitude of the sun, and found that she took it nearer than his lieutenants.`;

/* What is said of Kitty herself, when she has married one of them. */
const KITTY_ROLE = {
  purefoy:() => 'Mrs Purefoy, at Shalbourne', wray:() => 'The Hon. Mrs Wray, at Stanmere', peverell:() => 'Mrs Peverell, at Gosport',
  lyde:() => atVerdun() ? 'Mrs Lyde, a prisoner at Verdun' : 'Mrs Lyde, near Ludlow' };
const KITTY_BIO = {
  purefoy:() => `She married Giles Purefoy of Shalbourne; where she has the Lodge to keep, the kennel book to write up, and a husband who will ride eleven miles round to tell her what he has seen.`,
  wray:() => `She married Lord Stanmere’s heir, and lives in a house of a hundred and four windows; where she dines at five, has her letters franked by her father-in-law, and chooses what her husband shall read next.`,
  peverell:() => `She married Captain Peverell of the Navy, and lives at Gosport, with her windows towards Spithead; where she keeps his place upon a chart with a pin, and knows every frigate in the service by her topsails.`,
  lyde:() => F('lydeLate') ? `She waited eleven years for Mr Lyde, with his letters in a deal box under her bed; and she married him in the month that he was let out of Verdun.`
    : atVerdun() ? `She married Mr Lyde, and went with him to Paris in the spring of the year three; since when they are prisoners upon parole at Verdun, in two rooms over a pastry-cook, with two leagues of moss to walk in.`
    : F('kittyVerdun') ? `She married Mr Lyde, and was eleven years a prisoner with him at Verdun; whence they are come home to Shropshire with four trunks, of which three are paper.`
    : `She married Mr Lyde, and lives near Ludlow in a damp house; out of which there go to the Linnean Society, twice in the year, papers upon moss with her drawings to them.` };
/* The Mercury's line upon her, at the reckoning. */
const KITTY_END = {
  purefoy:() => `His daughter is Mrs Purefoy, of Shalbourne. She keeps the kennel book. The young hounds have Latin names.`,
  wray:() => `His daughter is the Honourable Mrs Wray. She will be Viscountess Stanmere. Her husband has read Mr Gibbon through, aloud.`,
  peverell:() => `His daughter is Mrs Peverell, of Gosport. The Captain is upon half-pay since the peace. She can find a latitude within two miles.`,
  lyde:() => F('lydeLate') ? `His daughter married Mr Lyde of Shropshire upon his release from Verdun. He had been eleven years a prisoner. She had his letters by date.`
    : F('kittyVerdun') ? `His daughter is Mrs Lyde. She was eleven years a prisoner at Verdun with her husband. Their Flora of the Meuse is printing at Paris.`
    : `His daughter is Mrs Lyde, of Shropshire. A paper upon the mosses of that county is printed under her name and her husband’s.` };
{ const role = kittyRole; kittyRole = function(){ const k = K(); return KITTY_ROLE[k] ? KITTY_ROLE[k]() : role(); };
  const bio = PEOPLE.kitty.bio; PEOPLE.kitty.bio = () => KITTY_BIO[K()] ? KITTY_BIO[K()]() : bio(); }

/* ---------- how much she has been seen ---------- */
const kTown = () => S.flags.kittyTown || 0, kBath = () => S.flags.kittyBath || 0;
const kittyLaunch = () => kTown() + kBath() + (F('kittyPresented') ? 2 : 0) + (F('parisFamily') ? 1 : 0) + (held('townhouse') ? 1 : 0);
const hallLady = () => (held('baronet') || held('knight') ? 'Lady ' : 'Mrs ') + S.sur;
const wrayPortion = () => Math.max(1500, 3000 - (F('kittyPresented') ? 500 : 0) - (held('baronet') ? 1000 : held('knight') ? 500 : 0));
const suitDue = id => S.seen[id] === undefined && !S.queue.some(x => x.id === id);
const SUIT_OK = {
  suitPurefoy:() => S.year >= 1798 && S.year <= 1807 && S.standing >= 38 && !F('cut'),
  suitWray:() => S.year >= 1797 && S.year <= 1808 && kTown() >= 1,
  suitPeverell:() => S.year >= 1803 && S.year <= 1811 && kTown() + kBath() >= 1 };
function sendSuitor(id, delay){ if (K() !== 'free' || !suitDue(id) || !SUIT_OK[id]()) return false; later(id, delay); S.flags.kittySuit = S.t + delay; return true; }
/* Every quarter that she is at home and unspoken for, somebody may make up his mind: seldom for a girl who has been nowhere, and oftener for every place she has been shown. */
const regardQuarterSuit = regardQuarter;
regardQuarter = function(line){ regardQuarterSuit(line);
  if (K() !== 'free' || S.dead || F('lydeWrites') || F('dubreuilWaits') || S.t - (S.flags.kittySuit || 0) < 5) return;
  if (!chance(Math.min(0.3, 0.07 + 0.035 * kittyLaunch()))) return;
  const ok = Object.keys(SUIT_OK).filter(id => suitDue(id) && SUIT_OK[id]()); if (ok.length) sendSuitor(pick(ok), 0); };
/* A Season in town with her, six weeks at Bath, and Paris in the peace. */
{ const town = UNDERTAKINGS.find(u => u.id === 'town'), go = town.go; town.go = function(){ if (K() === 'free') { fl('kittyTown', kTown() + 1); if (chance(F('kittyPresented') ? 0.75 : 0.4)) sendSuitor('suitWray', 1) || (chance(0.5) && sendSuitor('suitPeverell', 2)); } return go(); };
  const bath = byId('bath').choices[0], bgo = bath.go; bath.go = function(){ if (K() === 'free') { fl('kittyBath', kBath() + 1); if (chance(0.6)) sendSuitor('suitPeverell', 2); } return bgo(); };
  const paris = byId('paris').choices[0], pgo = paris.go; paris.go = function(){ fl('parisFamily'); if (K() === 'free') { later('suitLyde', 2); S.flags.kittySuit = S.t + 2; } return pgo(); }; }
const marksSuit = marks;
marks = function(){ const m = marksSuit(), put = (k, n, t) => { if (n) { m.why[k].push('+' + n + ' ' + t); m[k] = clamp(m[k] + n, 5, 95); } };
  put('standing', K() === 'wray' ? 3 : 0, 'Your daughter the Honourable Mrs Wray'); put('standing', K() === 'purefoy' ? 1 : 0, 'Your daughter at Shalbourne'); put('standing', K() === 'peverell' ? 1 : 0, 'A post-captain in the family');
  return m; };

/* ---------- a neighbour's heir ---------- */
ev({ id:'suitPurefoy', follow:true, cond:() => K() === 'free', who:() => 'purefoy', title:'Three Horses in a Week',
  text:() => { meet('purefoy'); return `Young Mr Giles Purefoy of Shalbourne, who is to have two thousand four hundred acres and a pack of harriers when his father dies, has called at the Hall three times since Sunday; upon a bay, upon a grey, and upon a chestnut with one white stocking; and each time he has asked after Miss Kitty’s cold, which nobody at Hatherley can recollect her having.

This morning a groom brings over a letter in the father’s hand.

“Shalbourne, Tuesday. Dear Sir, My son informs me that he has a mind to your daughter; which I had from his sister a month ago, and before that from his horses, which are never in the stable. He is a good lad, and will have this place. I can give them the Lodge, and six hundred a year; and I shall look to you for two thousand pounds with the young lady, to be settled upon herself. He has not, I believe, said a word to her, and is waiting, as I understand him, for a frost. I am, dear Sir, yours &c., JNO. PUREFOY.”

Kitty reads it standing, and gives it back to you.

“He has told me the name of every hound in the kennel, Papa, and I believe that he would know any one of them again in the dark. I am not certain that he would know me.”`; },
  choices:[
    {t:'Close with old Mr Purefoy at two thousand.', note:'£2,000', if:() => S.money >= 2000, go:() => { const ripe = kittyAge() >= 25; fl('kitty','purefoy'); add({money:-2000, standing:5, family:2}); reg('kitty', ripe ? 1 : -2, 'You married her to Shalbourne'); reg('henrietta',2,'You married Kitty to two thousand acres'); reg('purefoy',3,'You gave him Kitty');
      return `You write to Shalbourne the same evening; and the settlements are drawn at Wyvern by Mr Spurling, upon three skins, within the fortnight.

They are married at Hatherley upon the first Thursday of the frost. Giles Purefoy, who was never known to finish a sentence in a drawing-room, gets through the whole of his responses without a check; and coming down the church path with Kitty upon his arm, he stops to tell her which of the carriage horses is going lame.

“The near one,” says Kitty. “I saw it in the lane.”

He looks at her for some time, and forgets to shut the carriage door.`; }},
    {t:'Tell Kitty that the answer is hers.', note:'£1,200 with her, if she takes him', go:() => { const yes = kittyAge() >= 25 || chance(0.3);
      if (yes) { fl('kitty','purefoy'); add({money:-1200, standing:4, family:5}); reg('kitty',3,'You left Mr Purefoy’s suit to her'); reg('henrietta',1); reg('purefoy',3,'Kitty took him of her own will');
        return `You tell her that it is hers to answer; and she is three days about it, upon one of which she walks to Shalbourne and back, eleven miles, without saying to anybody where she has been.

“I have seen the kennel, Papa, and the Lodge, and the way he speaks to the old huntsman, who is past his work, and is kept. I will have him.”

Old Mr Purefoy, upon learning that the young lady has been over his premises on foot, and unasked, declares that he will take twelve hundred with her and be thankful; and they are married in the frost.`; }
      add({family:2}); reg('kitty',2,'You left Mr Purefoy’s suit to her'); reg('henrietta',-1,'Kitty refused Shalbourne, and you let her'); reg('purefoy',-1);
      return `You tell her that it is hers to answer.

She answers it on Thursday, at the gate, where Giles Purefoy has pulled up to ask after her cold; and it is seen from the laundry window that he hears her out with his hat in his hand, bows, and rides away upon the grey at a walk.

Next morning there is a brace of pheasants at the kitchen door, with his compliments to the ladies; and before Christmas he is engaged to a Miss Bell of Froxfield, who has four thousand pounds, and has hunted since she was six.`; }},
    {t:'Write that she is not to be hurried.', go:() => { add({family:-1}); reg('kitty',1); reg('henrietta',-1,'You let Shalbourne go by'); reg('purefoy',-1);
      return `You write to Shalbourne that your daughter is young, and is not to be hurried; and old Mr Purefoy answers by return, that he never hurried a filly in his life, and that the lad may ask again in a twelvemonth.

But within the twelvemonth there is a Miss Bell at Froxfield, who has four thousand pounds, and has hunted since she was six; and the bay, the grey and the chestnut go by your gate upon their way to her.`; }}
  ]});

/* ---------- a Viscount's eldest son ---------- */
ev({ id:'suitWray', follow:true, cond:() => K() === 'free', who:() => 'wray', title:'A Card with the Corner Turned',
  text:() => { meet('wray'); return `Mr Augustus Wray, who is the eldest son of Viscount Stanmere, and stands six feet two, danced twice with Kitty at Lady Salt’s; and upon each of the nine mornings that remained of your stay in town he left a card at the door, with one corner turned down, to show that he had brought it himself.

To-day there gets down from the Bath coach a Mr Pettiward, of Lincoln’s Inn, who does his lordship’s business; and who, having been given a glass of sherry, lays a half-sheet upon the library table.

“Heads of a Proposal. The Hon. Mr Wray to have £1,200 a Year during the Life of the Viscount. The Lady’s Jointure, £800. Pin-money, £200. The Lady’s Father to pay down ${fmt(wrayPortion())}, on or before the Day.”

“His lordship has nine thousand a year, sir,” says Mr Pettiward. “I am not instructed to say what is charged upon it.”

Kitty is sent for, and asked what she thinks of the gentleman.

“He is very tall, Papa, and very good-natured; and he has read one book. He told me which it was.”`; },
  choices:[
    {t:'Pay down what his lordship asks.', note:() => fmt(wrayPortion()), if:() => S.money >= wrayPortion(), go:() => { const p = wrayPortion(); fl('kitty','wray'); add({money:-p, standing:9, family:4}); reg('henrietta',3,'You married Kitty to a Viscount’s heir'); reg('wray',3,'You gave him Kitty');
      return `The draft is upon Tidmarsh’s; and Mr Pettiward, having read it once, folds it into his pocket-book.

They are married within the quarter, at St George’s, by the Viscount’s brother, who is a Dean; and upon the Saturday the Morning Post has it among the fashionable intelligence.

“MARRIED. On Thursday, at St George’s, Hanover-square, the Hon. Augustus Wray, eldest Son of the Lord Viscount Stanmere, to Miss ${S.sur}, only Daughter of ${styled()}, of Hatherley Combe, in the County of Berks.”

${hh('Henrietta sends into Wyvern for twelve copies of the paper.', 'Henrietta writes from Gay Street for twelve copies of the paper.')} Kitty writes from Stanmere in the second week, that the house has a hundred and four windows; that her husband has begun upon a second book; and that she chose it.`; }},
    {t:'Offer half, and bid him carry it to Stanmere.', note:() => fmt(wrayPortion() / 2) + ', if his lordship will take it', if:() => S.money >= wrayPortion() / 2, go:() => { const p = wrayPortion() / 2, yes = chance(Math.min(0.9, 0.2 + 0.12 * kittyLaunch()));
      if (yes) { fl('kitty','wray'); add({money:-p, standing:9, family:4}); reg('henrietta',3,'You married Kitty to a Viscount’s heir'); reg('wray',3,'You gave him Kitty');
        return `Mr Pettiward writes the figure upon his half-sheet, and goes back by the night coach.

In ten days there is a letter from Stanmere, under the Viscount’s own frank, and of four lines; of which the first says that his lordship has a roof to mend, the second that his son has given up eating, and the third that he will take ${pounds(p)}.

They are married at St George’s within the quarter. ${hh(`Henrietta, who has the fourth line by heart, repeats it to Mrs Tamworth upon the church steps: “Lady Stanmere will be happy to receive ${hallLady()}.”`, `The fourth line is sent on to Gay Street; and Henrietta reads it to Mrs Tamworth in the Pump Room: “Lady Stanmere will be happy to receive ${hallLady()}.”`)}`; }
      add({standing:-1, family:-2}); reg('henrietta',-2,'You haggled a Viscount’s heir away'); reg('wray',-1);
      return `Mr Pettiward writes the figure upon his half-sheet, and goes back by the night coach.

No answer comes from Stanmere. But within the month the Morning Post has it that Mr Wray is gone into the county of Mayo, to look over the family’s estate there; and in the autumn, that he is to marry a Miss Ormandy of Liverpool, whose father is in cotton, and who brings him thirty thousand pounds.

${hh('Henrietta reads the paragraph aloud at breakfast, twice, and gives the figure both times.', 'Henrietta cuts the paragraph out, and sends it to you from Gay Street, with a line drawn under the figure.')}`; }},
    {t:'Send Mr Pettiward back with his paper.', go:() => { add({family:-1}); reg('kitty',2,'You would not buy her a Viscount'); reg('henrietta',-2,'You sent Lord Stanmere’s attorney away'); reg('wray',-1);
      return `“My daughter, sir, is not to be had by the half-sheet.”

Mr Pettiward bows, finishes his sherry, and desires to know at what hour the up coach goes through Wyvern.

A tenth card comes by the post within the week, having upon the back of it, in pencil, “I am very sorry. A. W.”; and Kitty, who has asked leave to keep it, marks her place with it for a year afterwards.`; }}
  ]});

/* ---------- a naturalist, met at Paris in the peace ---------- */
ev({ id:'suitLyde', follow:true, cond:() => K() === 'free' && (S.year === 1802 || (S.year === 1803 && S.season === 0)), who:() => 'lyde', title:'A Deal Box from Shropshire',
  text:() => { meet('lyde'); return `It now appears that upon four mornings at Paris, when Kitty was understood to be at the milliner’s with the maid, she was at the Museum of Natural History in the Jardin des Plantes, looking at dried mosses; and that there was a gentleman at the next table.

He is in the hall, having come out of Shropshire in a hired chaise, with a deal box upon his knees: a Mr Ambrose Lyde, of one-and-thirty, and a Fellow of the Linnean Society; who is so short-sighted that he has given his hat to you, and his card to the servant.

“There are two hundred and six sheets in the box, sir, for Miss ${S.sur}’s cabinet. I have eighteen hundred a year, and a house near Ludlow, which is damp. I go back to Paris in April, Monsieur de Jussieu having promised me the run of his herbarium; and I should like, with your leave, to take your daughter there as my wife.”

Kitty is upon the stairs, and has been there since the chaise turned in at the gate.`; },
  choices:[
    {t:'Consent, with a thousand pounds, and upon one condition.', note:'£1,000', if:() => S.money >= 1000, go:() => { fl('kitty','lyde'); add({money:-1000, family:6, standing:1}); reg('kitty',4,'You gave her Mr Lyde, and kept her out of France'); reg('lyde',3,'You gave him Kitty, and a thousand pounds');
      return `“You shall have her, Mr Lyde, and a thousand pounds with her; but you shall not carry her out of England while Bonaparte has the keeping of the roads.”

He looks at Kitty, and gives up Monsieur de Jussieu upon the spot.

They are married by licence, and go into Shropshire. In May the war is renewed; and upon the second of June the Courier prints that every Englishman found in France, between the ages of eighteen and sixty, has been made a prisoner by order of the First Consul. Mr Lyde, to whom the paper is sent on at Ludlow, cuts the paragraph out, and encloses it to you in a sheet upon which nothing else is written.`; }},
    {t:'Bid him ask again when he is come home from Paris.', go:() => { fl('lydeVerdun'); add({family:-3}); reg('kitty',-2,'You sent Mr Lyde back to Paris unanswered'); later('lydeLetter', 5);
      return `“Go to your mosses, Mr Lyde, and ask me again in the autumn.”

He goes in April. In May the war is renewed; and upon the second of June the Courier prints that every Englishman found in France, between the ages of eighteen and sixty, has been made a prisoner by order of the First Consul, and is to be sent to Verdun.

Kitty reads it standing at the hall table. She carries the deal box up to her own room, where it is put under the bed; and the maid has orders not to dust it.`; }},
    {t:'Call Kitty down, and let her answer him.', go:() => { fl('kitty','lyde'); fl('lydeVerdun'); fl('kittyVerdun'); add({family:-2}); reg('kitty',5,'You let her answer Mr Lyde herself'); reg('henrietta',-2,'Her daughter is a prisoner in France'); reg('lyde',4,'Kitty answered him herself');
      return `Kitty comes down the last six stairs without touching the rail.

“Yes,” she says; and Mr Lyde, who had got something further by heart, has no occasion for it.

They are married by licence, with no settlement but his own; and in April they cross from Dover, deal box and all, to Monsieur de Jussieu. In May the war is renewed. Upon the second of June the Courier prints that every Englishman found in France has been made a prisoner by order of the First Consul; and in July there is a letter from Kitty, dated at Verdun upon the Meuse, where they are to live upon his parole, within two leagues of the walls, until there is a peace.

“There is a great deal of moss inside two leagues, Papa. Do not let Mamma be frightened.”`; }}
  ]});

ev({ id:'lydeLetter', follow:true, cond:() => K() === 'free' && F('lydeVerdun') && S.year <= 1812, who:() => 'lyde', title:'A Letter from Verdun',
  text:() => `A letter has come through Rotterdam, in eleven weeks, having been opened and sealed again by somebody upon the way.

“Verdun, Department of the Meuse. Sir, I am detained here with some hundreds of my countrymen, upon my parole, and answer to my name every morning at the Citadel. We have a club, a pack of hounds, and three clergymen; and I have found upon the ramparts a Bryum which I believe to be new. There is no talk of exchange for those who are not officers. I therefore beg that Miss ${S.sur} will consider herself free of any understanding with me, and that she will keep the box. I am, Sir, your obliged servant, A. LYDE.”

Kitty has known the hand upon the cover from the other end of the hall.`,
  choices:[
    {t:'Give her the letter.', go:() => { fl('lydeWrites'); add({family:1}); reg('kitty',2,'You gave her Mr Lyde’s letter from Verdun');
      return `She reads it through at the window, and folds it small.

“He has spelt the moss wrong,” she says; and she goes up to tell him so, upon the thinnest paper in the house, that it may travel under one cover to the banker Perregaux at Paris, through whom the prisoners have their letters.

From that day she writes to him upon the first of every month; and one answer in four comes through.`; }},
    {t:'Give it her, and send him fifty pounds by the bankers.', note:'£54', go:() => { fl('lydeWrites'); add({money:-54, family:2}); reg('kitty',3,'You sent money to Mr Lyde at Verdun'); reg('lyde',2,'You sent him fifty pounds at Verdun');
      return `You write to Mr Tidmarsh, who writes to Coutts, who have a way of placing money with Perregaux at Paris for the use of the prisoners; and it costs you fifty pounds, and four pounds more for the sending of it.

Kitty has the letter. Of the fifty pounds she says nothing until Sunday; when, coming out of church, she takes your arm as far as the gate.`; }},
    {t:'Put it in the fire. He has released her.', go:() => { add({family:-2}); reg('kitty',-3,'You burnt Mr Lyde’s letter');
      return `You put it in the fire, cover and all.

Kitty asks at dinner whether there was not a foreign letter; and being told that it was a matter of business, she looks at you until the cloth is drawn, and asks nothing further.

The deal box remains under her bed.`; }}
  ]});

ev({ id:'lydeReturns', from:1814, to:1815, weight:9, cond:() => K() === 'free' && F('lydeWrites'), who:() => 'lyde', title:'The Dover Coach',
  text:() => { const late = S.year > 1814; return `The prisoners are let go from Verdun upon the entry of the Allies; and there gets down from the Dover coach at your gate, in a French coat, with a portmanteau in one hand and a tin case in the other, Mr Ambrose Lyde.

He is ${late ? 'three' : 'two'}-and-forty, and grey; he has answered to his name at the Citadel every morning for eleven years; and he has in the tin case, as he tells you before he is well into the hall, four hundred and nineteen mosses of the Meuse.

“I released Miss ${S.sur}, sir, in the year three. I have come to learn whether she took it.”

Kitty is ${late ? 'seven' : 'six'}-and-thirty. She has every one of his letters in the deal box, by date.`; },
  choices:[
    {t:'Send up for Kitty.', go:() => { fl('kitty','lyde'); fl('lydeLate'); add({family:10, standing:1}); reg('kitty',4,'You sent up for her when Mr Lyde came home'); reg('lyde',4,'You sent up for Kitty');
      return `Kitty comes down, and stops upon the last stair.

“You spelt it wrong again in March,” she says.

They are married at Hatherley within the month, by banns, with the whole parish in the churchyard; and they go into Shropshire, to the house near Ludlow, which has stood eleven years empty, and is damper than he remembered it.`; }},
    {t:'Tell him that eleven years is an answer.', go:() => { fl('kitty','lyde'); fl('lydeLate'); add({family:-6}); reg('kitty',-4,'You sent Mr Lyde from the door after eleven years'); reg('lyde',-2);
      return `“Eleven years, Mr Lyde, is an answer of itself.”

He bows, takes up the portmanteau and the tin case, and walks back down the drive to wait for the up coach.

Kitty, who saw him from the landing window, overtakes him at the gate without her bonnet. They are married at Ludlow by licence; and you have it from the Shrewsbury paper.`; }}
  ]});

/* ---------- a post-captain, ashore ---------- */
const pevBath = () => kBath() > 0;
ev({ id:'suitPeverell', follow:true, cond:() => K() === 'free', who:() => 'peverell', title:'Captain Peverell Takes an Altitude',
  text:() => { meet('peverell'); return `Captain James Peverell, of the Navy, who was made post into the Sibyl frigate, and is ashore with a musket ball in his thigh which the surgeons decline to go after, was ${pevBath() ? 'at Bath' : 'in town'} when Kitty was; where upon three fine mornings he had her ${pevBath() ? 'up on Beechen Cliff' : 'up the hill at Greenwich'} with his sextant, taking the altitude of the sun.

He has come ${pevBath() ? 'over from Bath' : 'down from town'} to-day in a post-chaise, and stands in the library with his weight upon the sound leg.

“I am six-and-thirty, sir. I have eleven thousand pounds in the Three per Cents, out of a Spanish ship, and the promise of a frigate when I can walk a deck. I ask nothing with her. Miss ${S.sur} found the latitude of ${pevBath() ? 'Bath' : 'Greenwich'}, upon the third morning, within two miles; and I have had lieutenants who could not.”

${hh('Henrietta, who had looked for land, desires to know in the passage what a sailor’s wife has to live upon when he is drowned.', 'Henrietta, who had looked for land, has written from Gay Street to know what a sailor’s wife has to live upon when he is drowned.')}`; },
  choices:[
    {t:'Give him your hand upon it.', go:() => { fl('kitty','peverell'); add({family:4, standing:2}); reg('kitty',4,'You gave her the Captain'); reg('henrietta',-1,'She had looked for land'); reg('peverell',3,'You gave him Kitty');
      return `You give him your hand, and ring for Kitty; who, it turns out, is no further off than the other side of the door.

They are married in three weeks, the Admiralty being expected to write in four. The letter comes upon the wedding day itself, and appoints him to a frigate fitting at Portsmouth; so that Kitty goes from the church door to a lodging at Gosport, with her trunks, his sea-chest, and the sextant upon her knee.`; }},
    {t:'Consent, when the eleven thousand is settled upon her.', note:'£60 to the attorney', go:() => { fl('kitty','peverell'); fl('peverellSettled'); add({money:-60, family:6, standing:2}); reg('kitty',3,'You gave her the Captain, and saw her provided for'); reg('henrietta',1); reg('peverell',2,'You gave him Kitty');
      return `“You shall have her, Captain, upon the day that the eleven thousand is in trustees’ hands, for her and her children.”

“I had meant to do it, sir, and did not know how it was asked for.”

Mr Spurling draws the deed, and has sixty pounds for it. ${hh('Henrietta reads it through; and coming to the word “survivor”, she lays it down, and says that she has always thought the Navy a very respectable service.', 'A copy goes to Gay Street; and Henrietta writes back that she has always thought the Navy a very respectable service.')}

They are married within the month, and the Captain has his frigate before the quarter is out.`; }},
    {t:'Decline. A sailor’s wife is a widow three years in four.', go:() => { add({family:-3}); reg('kitty',-3,'You refused her the Captain'); reg('peverell',-2,'You refused him Kitty');
      return `“I will not give her to a man whom she is to see one year in four, Captain, and that year upon half-pay.”

He takes it standing; says that he is obliged to you for a plain answer; and goes out to his chaise without the help of the servant.

The sextant comes by the carrier a week afterwards, in its case, directed to Miss ${S.sur}. She takes the altitude of the sun from the leads upon every fine day until Michaelmas, and enters each in a book.`; }}
  ]});

/* ---------- her letters, when she is married ---------- */
KITTY.push(
  {id:'kitty-shalbourne', kind:'news', w:() => K() === 'purefoy', x:() => `There is a letter from Kitty, from Shalbourne.

“My dear Papa, We have three-and-twenty couple of harriers, and I have the kennel book to keep, Mr Purefoy’s father having found that I can spell. The last litter wanted names; and as nobody could think of nine that began with one letter, I was applied to. They are Ranunculus, Rumex, Reseda, Rosa, and so forward. The huntsman calls the first of them Runner. Giles calls him by the whole of his name, across two fields, and takes off his hat to me when he has done it.”`},
  {id:'kitty-stanmere', kind:'news', w:() => K() === 'wray', x:() => `There is a letter from Kitty, under a frank.

“My dear Papa, There are a hundred and four windows, and the tax upon them is more than Mr Oakes has to live on. Lord Stanmere dines at five, and has spoken to me upon three occasions, each time of the weather in the year ’83. Augustus is at the fourth volume of Mr Gibbon. He reads it aloud to me in the evenings, with his finger under the line, and stops at the long words to see whether I am laughing. I am not. I find that I should be very angry with anybody who did.”`},
  {id:'kitty-ludlow', kind:'news', w:() => K() === 'lyde' && !F('kittyVerdun'), x:() => `There is a letter from Kitty, from Shropshire.

“My dear Papa, The house is as damp as he said. There is a moss upon the north wall of the dining-room, withinside, which Mr Lyde will not have touched until it has fruited. He has sent a paper to the Linnean Society upon the Bryums of the county, with eleven of my drawings; and they have printed it, drawings and all, under his name. He wrote to the Secretary by the same night’s post. It is to be under both names in the next part.”`},
  {id:'kitty-verdun', kind:'news', w:() => K() === 'lyde' && atVerdun(), x:() => `There is a letter from Kitty, eleven weeks upon the road, and opened upon it.

“My dear Papa, We have two rooms in the Rue Mazel, over a pastry-cook. Mr Lyde answers to his name at the Citadel every morning at nine, and is then at liberty for the day, within two leagues. The English here have a club, a race-course, and a pack of hounds, and have quarrelled about all three. We have the two leagues. I have drawn a hundred and ninety mosses; and we mean to print them at Paris, if there is ever anybody at Paris who will take an Englishman’s money.”`},
  {id:'kitty-verdun-home', kind:'news', w:() => K() === 'lyde' && F('kittyVerdun') && S.year >= 1814, x:() => `There is a letter from Kitty, with an English postmark.

“My dear Papa, We landed at Dover upon Tuesday, with four trunks, of which three are paper. The officer of the Customs had the first of them open, and turned over forty sheets of moss, looking, as he said, for lace; and he then desired to know what they were for. Mr Lyde told him. It took an hour and a quarter, and the packet behind us was not cleared until dark. We go into Shropshire on Monday, and come to you at Michaelmas.”`},
  {id:'kitty-gosport', kind:'news', w:() => K() === 'peverell', x:() => `There is a letter from Kitty, from Gosport.

“My dear Papa, The ship has been gone since March, and I have a chart pinned to the parlour wall, upon which I move him with a pin as the letters come. He writes that he has taken a polacre laden with oil, and that his share of her will new-roof Hatherley church, if ever it should want one. I have the windows towards Spithead; and I know every frigate in the service by her topsails, which the other captains’ wives think very odd in me, and ask me the names.”`}
);

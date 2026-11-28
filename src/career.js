/* ---- Edmund's career ----
   Each calling has its rungs, and each rung is a paper. Rank no longer comes by the calendar alone: the rungs set the year
   in which a step is had, and a rung that was never seen leaves the old calendar standing, so that an old save reads as before.
     Navy:   navCommission (1801-2), navPrize (1804-6), navWound (1806-9), navCommander (1809-10), navPost (1812-14)
     Army:   armLieutenancy (1798-9), armCompany (1804-6), armWound (1810-11), armBrevet (1813-14); the Clarke and Badajoz papers stand
     Church: chStipend (1800-2), chPresentation (1803-6), chInduction (follows a purchase); gallDies stands
   State is all in S.flags: navLtAt, navCmdrAt, navPost, armLtAt, armCaptAt, edmFriend (friends made at head-quarters),
   navWound, armWound, chBought, chBoughtAt, edmRector, edmAllowance, chCurate. Woodcuts at art/events/<event id>. */
const flag = (k, d) => S.flags[k] === undefined ? d : S.flags[k];
const navRank = () => F('navPost') ? 3 : S.year >= flag('navLtAt', 1803) ? (S.year >= flag('navCmdrAt', 1811) ? 2 : 1) : 0;
const armRank = () => S.year >= flag('armCaptAt', 1807) ? 2 : S.year >= flag('armLtAt', 1800) ? 1 : 0;
const NAVY_RANK = ['Master’s mate', 'Lieutenant', 'Commander', 'Captain'], ARMY_RANK = ['Ensign', 'Lieutenant', 'Captain'];
const churchRole = () => F('edmundVicar') ? (F('edmRector') ? 'Vicar of Hatherley, and Rector of Upton' : 'Vicar of Hatherley') : F('edmRector') ? 'Rector of Upton Monachorum' : S.year < 1800 ? 'Reading for orders at Oriel' : 'A curate in Hampshire, waiting';
const edmFriend = () => S.flags.edmFriend || 0;
const befriend = () => fl('edmFriend', edmFriend() + 1);
/* What the squire can bring to bear in London: his own old rank, a seat, the Earl, his standing in the county, and whoever Edmund has made his friend. */
const interest = () => (T('captain') ? 2 : 0) + (F('mp') ? 2 : 0) + (S.chars.cullerne.r >= 2 ? 1 : 0) + (S.standing >= 60 ? 1 : 0) + (F('capSafe') ? 1 : 0) + edmFriend();
const UNITS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const inWords = n => n < 20 ? UNITS[n] : ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'][Math.floor(n / 10) - 2] + (n % 10 ? '-' + UNITS[n % 10] : '');
const edmServes = k => E() === k && !F('edmundDead');

/* ================= The Navy ================= */

ev({ id:'navCommission', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1801, to:1802, cond:() => edmServes('navy'), title:'Passed, and Not Made',
  text:() => `Edmund writes from Portsmouth, upon a half-sheet, and has not troubled to cross it.

“My dear Father, I have passed. Three Captains sat upon me at Somerset House on the first Wednesday of the month; of whom one desired me to club-haul a frigate off a lee shore, which I did upon the table-cloth with his snuff-box; the second asked my age twice; and the third woke in time to sign. I have their certificate, for which the clerk took a guinea.

It makes me nothing. A commission must come from the Admiralty, or from an Admiral abroad when somebody dies; and there are in the cockpits of the fleet a thousand young gentlemen who have passed as I have, and wait. They talk here of a peace. In a peace a Lieutenant goes ashore upon half-pay; and a Midshipman goes ashore upon his chest.

Lord St Vincent is at the Admiralty, and is said to answer with his own hand every letter that asks him a favour, and to grant none of them. Captain Holloway says that he will write if he is asked, and not otherwise. Have we any friend there?

Your dutiful son, Edmund.”`,
  choices:[
    {t:'Ask Lord Cullerne to speak to the First Lord.', go:() => { add({standing:-2});
      if (S.chars.cullerne.r >= 0) { fl('navLtAt', S.year); reg('cullerne',1); reg('edmund',1,'You had him made Lieutenant through the Earl');
        return `You ride to the Castle, where his lordship hears you upon the steps, with a gun under his arm.

“Navy? Got a cousin at the Board. Writes a dull letter. I’ll send him a buck.”

The buck goes up by the mail; and whether it is the cousin’s doing or the venison’s, Steel’s List for the month following has Edmund among the Lieutenants, eleven names from the bottom.

At the next Sessions the Earl’s under-keeper is brought before you for breaking a hurdle-maker’s head; and you find, on coming into the justice room, a note from the Castle already lying upon the Act.`; }
      fl('navLtAt', S.year + 2); reg('edmund',-1);
      return `You ride to the Castle on Tuesday, when his lordship is out with the hounds; and again on Friday, when he is in his bath; and on the Monday following the porter, before you have got down, tells you which of the two it is to be on Thursday.

By the time you are home the whole of Wyvern knows where you have been three times, and what you were given.

Edmund writes that he has laid the certificate at the bottom of his chest, under the shirts, where the damp will not come at it.`; }},
    {t:'Ask Captain Holloway to write for him.', go:() => { fl('navLtAt', S.year + 1); reg('edmund',2,'Made Lieutenant on his Captain’s word');
      return `You write six lines to Captain Holloway, and have four back.

“Sir, I have written. I said that he can work a ship and keep a reckoning and does not drink. I did not say whose son he is as they have enough of those. Holloway.”

Their Lordships return no answer whatever. But in the autumn, the third Lieutenant of the Thetis being lost overboard from the fore chains in a gale off the Texel, the Captain gives Edmund an order to act in his room; and an acting order, Edmund writes, wants only six months and nobody’s nephew to become a commission.`; }},
    {t:'Tell him to come home, and learn the estate.', go:() => { fl('edmund','home'); add({family:2}); reg('edmund',-3,'You fetched him home from the sea'); reg('henrietta',2);
      return `You write that he has seen the sea, and that there are two thousand acres in Berkshire which he has not.

He comes outside the Portsmouth coach, in a blue coat from which the buttons have been cut, with his chest, and a quadrant in a green baize bag. ${hh(`Henrietta has had his room aired for a week, and stands upon the steps without her shawl.`, `His room has been aired by Mrs Bunce, upon orders from Bath.`)}

For the first month he wakes at four. The dairymaid, going out to the cows, finds him twice upon the leads of the house in his shirt, looking at the weather; and on the second occasion he tells her which way it will blow by noon, and is right.`; }}
  ]});

ev({ id:'navPrize', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1804, to:1806, cond:() => edmServes('navy'), title:'Prize Money',
  text:() => { const big = navRank() >= 1;
    return `Edmund writes from Plymouth Dock; and the letter being charged double, you pay two and fourpence for it at the door.

“My dear Father, We have taken a ship. She is the Deux Frères of Bordeaux, homeward bound from Martinique with sugar, coffee, and eleven tons of indigo; and she struck to us off Cape Spartel after a chase of nine hours, in which nobody was hurt but the cook, who fell down the fore hatch with the coppers.

The Court has condemned her. Mr Tulk the agent, having taken out his five per cent, and the Proctor’s bill, and the Admiral’s eighth, and something that he calls contingencies, makes my share ${big ? 'six hundred and forty' : 'a hundred and fifty'} pounds.

I never had above eleven pounds at one time in my life, and I do not know what a man does with it. The purser says the Funds; the Captain says land; and the ${big ? 'gunroom' : 'berth'} says that it will do very well where it is until Saturday. Pray advise me.”`; },
  choices:[
    {t:'The Funds. Let him buy into the Navy Five per Cents.', go:() => { add({family:1}); reg('edmund',1);
      return `You write him two sides upon the Navy Five per Cents, in which the dividend is paid at the Bank in January and in July, and the principal lies where no messmate can come at it.

He buys at ninety-one, and sends you the broker’s note to keep in the iron chest.

The first half-year’s dividend he lays out upon a glass by Dollond; with which, he writes, he has read the name upon the stern of a French seventy-four at her moorings, and counted the washing in her rigging.`; }},
    {t:'Land. Let it come home, and go against what the estate owes.', go:() => { const sum = navRank() >= 1 ? 640 : 150, off = Math.min(sum, Math.max(0, S.mortgage)); S.mortgage -= off; S.money += sum - off; add({family:2}); reg('edmund',1,'He put his prize money into the estate');
      return `Mr Tulk’s draft comes up by the mail; and ${off ? `Tidmarsh writes ${off === sum ? 'the whole of it' : fmt(off)} off the mortgage, in red ink` : `Tidmarsh enters it upon the right side of your account`}.

Edmund asks in his next whether it has bought a field, and which.

It has bought none. But you take the estate map into the book-room with ${steward()}, and choose him one: the Nine Acres under the Down, which has the spring in it; and you write his initials upon it in pencil.`; }},
    {t:'Tell him to lay it out where it will be seen.', go:() => { const big = navRank() >= 1; befriend(); reg('edmund',2,'You told him to spend his prize money like a gentleman');
      return `He takes you at your word.

He dines the Captain, the Port Admiral’s secretary, and two Lieutenants of the flagship at the Pope’s Head, upon turtle; he has a coat from the tailor who makes for the Admiral; and he lends ${big ? 'eighty' : 'twenty'} pounds to the secretary’s brother, who is going into the wine trade at Oporto.

At Christmas there are ${big ? 'sixty' : 'nine'} pounds left of it. But the secretary, he writes, now knows him in the street; and stopped him upon the Hard on Thursday, to ask how the name was spelt.`; }}
  ]});

ev({ id:'navWound', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1806, to:1809, cond:() => edmServes('navy') && navRank() === 1, title:'A Chaise from Portsmouth',
  text:() => `A yellow chaise from Portsmouth sets down at the door a little after dark; and out of it there gets first a seaman with a pigtail, who looks up at the front of the house as he would at a strange sail, and after him, backwards, with an arm about the seaman’s neck, Edmund.

“Lott will carry me up, sir. I had rather my mother did not see me take the stairs.”

His left leg is in splints from the hip to the ankle. The boats of the Thetis, it appears, cut a privateer brig out of the road at the Isle of Bas, under the battery; Edmund had the launch; and a twelve-pound shot, coming in upon her quarter, drove a piece of her own gunwale through his thigh. He has brought the piece home in his hat-box.

When the cloth is drawn he lays three papers upon it. The first is the Gazette, in which Captain Holloway begs leave to mention Lieutenant ${S.sur}. The second is from the Committee of the Patriotic Fund at Lloyd’s Coffee-house, who have voted him a sword of fifty pounds’ value, or the fifty pounds, at his option; and he has written for the sword. The third is in the Captain’s hand.

“Sir, Haslar says three months. My First goes to a sloop at Lady Day, and I shall fill his place from my own quarterdeck and not from Berkshire. Holloway.”

${hh(`Henrietta, having read all three, puts the third under the candlestick.`, `You send an express to Gay Street, and it comes back by the same boy, with two words written across your own letter: “Keep him.”`)}`,
  choices:[
    {t:'Keep him his three months, and have Mr Ferris to the leg.', note:'£20', go:() => { fl('navWound'); add({money:-20, family:5}); reg('henrietta',2); reg('edmund',-1,'Kept ashore while the First Lieutenant’s place was filled');
      return `Mr Ferris rides over from Newbury twice a week, at a guinea, and forbids the stairs, the saddle, and port. A bed is put up in the library, where Edmund lies under the map of Europe; and reaching up with a walking-stick, he moves his own pin out of the Channel into Berkshire.

By May he can walk to the lodge with the stick, and by June without it.

The same post that brings the sword from Lloyd’s, in a mahogany case lined with blue velvet, brings word that the Thetis has a new First Lieutenant; a Mr Trounce, who is two-and-twenty.`; }},
    {t:'Carry him to the Admiralty while the wound is fresh.', note:'£60', go:() => { fl('navWound'); befriend(); add({money:-60, family:-3}); reg('henrietta',-2,'You took Edmund to the Admiralty on a crutch'); reg('edmund',1);
      return `You post to town with him, his leg laid along the opposite seat upon your portmanteau, and take a first floor in Spring Gardens at four guineas a week.

For nine mornings he sits in the waiting-room at the Admiralty with the crutch between his knees, among forty officers on half-pay, who have each a memorial in his hat. On the tenth the First Lord, crossing the hall to his carriage, stops before the crutch, and asks what did that.

“A piece of the launch, my lord.”

His lordship desires the secretary to take the name.

The leg, which had begun to knit, opens again upon the stairs in Spring Gardens, and he goes back to Haslar for six weeks; ${hh(`whence the surgeon writes to Henrietta, and Henrietta, upon one side of a sheet, to you.`, `whence the surgeon writes to Gay Street, and Gay Street, upon one side of a sheet, to you.`)}`; }},
    {t:'Let him go back as soon as he can stand.', go:() => { fl('navWound'); befriend(); add({family:-1}); reg('edmund',2,'You let him go back to his ship'); reg('henrietta',-1);
      return `In five weeks he can stand; in six he can cross the hall, provided that nobody is looking at him; and at the end of the seventh Lott has the chest corded, and in the cart.

“A First Lieutenant does not go aloft, sir. He stands still, and finds fault.”

He is read in at Spithead upon Lady Day. The surgeon of the Thetis, he writes, has looked at the leg, and said nothing about it; and has since had him moved into a cabin that has no step.`; }}
  ]});

const navFail = () => { fl('navCmdrAt', 9999);
  return `The Sparrow goes to a Commander of nineteen, whose uncle sits at the Board.

Captain Holloway is carried ashore at Portsmouth in a chair. The Thetis is given to the Honourable Augustus Trefusis, who is three-and-twenty; and Edmund, as First Lieutenant, receives him at the side with his hat off, and shows him over the ship.`; };
const navMade = () => { fl('navCmdrAt', S.year); };

ev({ id:'navCommander', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1809, to:1810, cond:() => edmServes('navy') && navRank() === 1, title:'The Sparrow Sloop',
  text:() => `There is a letter upon the hall table in a hand that you have seen four times in ${inWords(S.year - 1796)} years, and never above six lines of it together.

“Sir, The gout has me by both feet and I am to go ashore. A Captain who hauls down his pendant may by custom ask one thing. I have asked that your son be made Commander into the Sparrow sloop, eighteen guns, now fitting at Deptford for Halifax. He has been ${inWords(S.year - 1796)} years in my ship and I never had to tell him a thing twice.

I shall not be attended to. A Lord of the Admiralty has a nephew, and the nephew has been at sea since Michaelmas. If you know how these matters are managed, manage it. I do not.

Holloway.”

${steward()} has taken down Steel’s List, and finds upon it six hundred Commanders, of whom one in four has a ship.`,
  choices:[
    {t:'Go up, and vote with Ministers on Thursday.', if:() => F('mp'), go:() => { navMade(); add({standing:-2, goodwill:-1}); reg('edmund',1); reg('hartopp',-1,'Read your name in the division');
      return `The question on Thursday is one upon which you had meant to stay away. You sit through eleven hours of it on the Treasury side, and at four in the morning go out into the lobby behind the Chancellor of the Exchequer’s back.

On Friday the Secretary of the Admiralty stops you upon the stairs, and asks what the young man’s name is; though he has had it by then in three letters.

Edmund is made Commander into the Sparrow. On Monday the Mercury prints the division, with your name in the longer column; and Hartopp, who reads the lists as other men read the Lessons, rides past your gate without turning his head.`; }},
    {t:'Ask Lord Cullerne what he would want for it.', if:() => !F('mp'), go:() => { add({standing:-3});
      if (S.chars.cullerne.r >= -1) { navMade(); reg('cullerne',1); reg('edmund',1);
        return `His lordship hears you in the kennel yard, while the huntsman holds up a hound’s foot for him to look at.

“Sparrow? Hundreds of ’em. Fellow at the Board owes me for a borough. Tell your boy to keep off the rocks.”

The commission is dated within the month.

In November the Earl’s agent sends you, without a note, a plan of the new road from the Castle to Wyvern, which crosses the corner of Twelve Acres; and a pencil.`; }
      return `His lordship hears you in the kennel yard, while the huntsman holds up a hound’s foot for him to look at.

“Admiralty? Don’t know a soul there. Never did.”

He bends to the foot again; and as the huntsman does not look up either, you find your own way out between the kennels.

${navFail()}`; }},
    {t:'Wait upon the First Lord yourself.', note:'£40', go:() => { add({money:-40});
      if (S.standing >= 55 || interest() >= 3) { navMade(); add({standing:1}); reg('edmund',2,'You waited upon the First Lord for him');
        return `You send up your card at the Admiralty at eleven, and are shown in at four.

The First Lord has upon his table Captain Holloway’s letter, and lying over it another, of three sheets. He asks after the county. He asks what your wheat did to the acre; and learning in the course of it that you are in the Commission of the Peace, and how many freeholders dine with you at the audit, he lifts the short letter, and lays it uppermost.

Edmund is made Commander into the Sparrow within the fortnight.`; }
      reg('edmund',1);
      return `You send up your card at the Admiralty at eleven, and are shown in at four.

The First Lord has upon his table Captain Holloway’s letter, and lying over it another, of three sheets. He asks after the county, and then which county it is; and he is exceedingly sorry that the sloop is promised.

${navFail()}`; }},
    {t:'Let the Captain’s letter stand by itself.', go:() => {
      if (chance(Math.min(0.85, 0.2 + 0.15 * interest()))) { navMade(); add({standing:1}); reg('edmund',3,'Made Commander on his Captain’s letter, and nothing else');
        return `You write nothing, to anybody.

Three weeks go by. Then Steel has it, in the smallest type that Mr Steel keeps: “Edmund ${S.sur}, Commander, the Sparrow.”

Edmund’s own letter is a day behind the List. “I do not know how it was done, and Captain Holloway says that nobody did it. He had himself wheeled down to the Hard in a chair, to see me read in.”`; }
      reg('edmund',1);
      return `You write nothing, to anybody.

${navFail()}`; }}
  ]});

const postChance = base => chance(Math.min(0.9, base + 0.1 * interest()));
const posted = () => { fl('navPost'); add({standing:3, family:4}); };
ev({ id:'navPost', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1812, to:1814, cond:() => edmServes('navy') && navRank() === 2, title:'An Acting Order',
  text:() => `The Halifax packet is in; and Edmund’s letter has been six weeks upon the water.

“My dear Father, The Sparrow has fought. We fell in with the Tamerlane privateer of Salem, sixteen guns, off Cape Sable on the 4th; and she ran, and we chased her for thirty hours, pumping all the while; and when she could run no further, she turned upon us. It lasted forty minutes. I have exercised my great guns every day but Sunday these two years, and it is the only reason that I am alive to write this. We had nine killed. Lott is one.

The Admiral has given me an order to act as Captain of the Calliope, twenty-eight, her own Captain having died of a fever at Bermuda. It is an acting order, and no more. If their Lordships confirm it, I am Post, and a Post-Captain who lives long enough dies an Admiral whether he will or no; if they do not, I go back to my sloop, and the peace will find me in her.

They have six hundred Commanders to choose among at home, and I am three thousand miles off.

Your affectionate son, Edmund.”`,
  choices:[
    {t:'Go to the Admiralty with the Gazette in your hand.', note:'£50', go:() => { add({money:-50});
      if (postChance(S.standing >= 60 ? 0.6 : 0.45)) { posted(); reg('edmund',2,'You carried his Gazette to the Admiralty');
        return `You go up by the mail, and are nine days in town.

The Gazette has the Admiral’s letter in it, with the Tamerlane’s force set down, sixteen guns and a hundred and twenty men; and you carry it, folded open at the page, to the Secretary, to two of the junior Lords, and to a clerk in the passage who has nothing to do with it.

On the tenth day the order is confirmed. Edmund is Post, of the date of the action; and from that date no interest in the kingdom can put a younger man over his head.`; }
      reg('edmund',1);
      return `You go up by the mail, and are nine days in town.

You carry the Gazette, folded open at the page, to the Secretary, and to two of the junior Lords; and upon the tenth day you are informed by letter, though you are sitting at the time in the next room, that their Lordships do not confirm appointments made upon a foreign station, other than to a death vacancy in the officer’s own ship.

A Captain is sent out to the Calliope from Portsmouth. Edmund goes back to the Sparrow, and to her pumps.`; }},
    {t:'Send his letter to the Naval Chronicle.', go:() => { add({standing:2}); reg('edmund',-1,'You printed his letter');
      const head = `Mr Gold of Shoe Lane prints the letter whole in the Naval Chronicle, between a memoir of the late Admiral Lord Gardner and a table of the tides at Leith; the Courier copies the Chronicle, and the Mercury copies the Courier; and on Saturday it is read aloud at the George by the landlord, standing upon a settle.`;
      if (postChance(0.35)) { posted();
        return `${head}

In the House a Member for a seaport gets up to ask what has been done for the officer; and within the week something is.

Edmund’s thanks are eleven lines long. “I had rather you had asked me first. But I have her; and I will not pretend to you that I had rather not.”`; }
      return `${head}

Their Lordships, who take in the Chronicle likewise, send a Captain out to the Calliope from Portsmouth.

Edmund writes that he has been complimented upon his letter by every officer on the station, and by the Admiral at some length.`; }},
    {t:'Leave it to their Lordships.', go:() => {
      if (postChance(0.2)) { posted(); reg('edmund',3,'Made Post upon his own action, and nobody’s asking');
        return `You write to Edmund, and to nobody else.

Their Lordships take ten weeks. At the end of them, the Admiral having written a second time, and the Captain first named for her having declined the American station upon account of his wife’s health, the acting order is confirmed.

Edmund is Post. He writes that he has dined the Calliope’s officers in her great cabin, and that her pumps suck dry in four minutes.`; }
      reg('edmund',1);
      return `You write to Edmund, and to nobody else.

Their Lordships take ten weeks; and the Admiral’s second letter crosses, somewhere to the westward of Scilly, with a Captain already sent out from Portsmouth.

Edmund hands over the Calliope upon the wharf at Halifax, with the keys of her spirit room, and is pulled back to the Sparrow in his own gig; where the carpenter, he writes, has kept his cot slung.`; }}
  ]});

/* ================= The Army ================= */

ev({ id:'armLieutenancy', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1798, to:1799, cond:() => edmServes('army'), title:'A Lieutenancy for Sale',
  text:() => `Edmund writes from the barracks at Chelmsford.

“My dear Father, Lieutenant Garrow is to marry a brewer’s widow, and sells out. She has three drays, and a house in the High Street at Colchester. The step goes by purchase to the senior Ensign who can lodge the money; and of the two above me, one has lost his at hazard, and the other never had any.

The difference between an Ensigncy and a Lieutenancy is a hundred and fifty pounds by the King’s regulation, to be lodged with Mr Cox in Craig’s Court. Garrow asks sixty guineas besides; which are not to pass through Mr Cox’s hands, nor to be spoken of before the Colonel.

If I do not lodge it within the month, an Ensign of the 9th buys in over all our heads. He is sixteen. Tamworth has seen him, and says that he has not done growing.”`,
  choices:[
    {t:'Lodge the hundred and fifty, and find Garrow his sixty guineas.', note:'£213', go:() => { fl('armLtAt', S.year); add({money:-213}); reg('edmund',2,'You bought him his Lieutenancy');
      return `A hundred and fifty pounds go to Mr Cox, and are acknowledged upon a printed form. The sixty guineas go down to Chelmsford in the foot of a stocking, by the hand of Tamworth’s servant, and are not acknowledged at all.

The Gazette has it within the fortnight: “52nd Foot. Ensign Edmund ${S.sur} to be Lieutenant, by purchase, vice Garrow, who retires.”

Edmund writes that he has now five shillings and eightpence a day; and that the mess, having met upon it, has raised his subscription.`; }},
    {t:'The regulation, and not a guinea over it.', note:'£150', go:() => {
      if (chance(0.5)) { fl('armLtAt', S.year); add({money:-150, standing:1}); reg('edmund',1);
        return `You lodge the hundred and fifty; and you write to Edmund that the King has fixed the price of a Lieutenancy, and that you do not propose to amend him.

Garrow holds out for nine days. But the brewer’s widow has named the Thursday; and the father of the Ensign of the 9th, being applied to for sixty guineas over, proves to be a clergyman, with opinions like your own.

Garrow signs. Edmund is gazetted Lieutenant, by purchase; and Tamworth, who had a guinea upon it the other way, pays.`; }
      fl('armLtAt', 1801); reg('edmund',-1,'Lost his step for sixty guineas');
      return `You lodge the hundred and fifty; and you write to Edmund that the King has fixed the price of a Lieutenancy, and that you do not propose to amend him.

Garrow sells to the Ensign of the 9th, whose father is a sugar-baker in Thames Street, and has not read the regulation. Mr Cox returns your money by the next post.

The new Lieutenant joins at Chelmsford in a coat that has been cut to allow for him; and Edmund, who is the elder by seven years, salutes him upon parade.`; }},
    {t:'Let him wait for a step without purchase.', go:() => { fl('armLtAt', 1801); reg('edmund',-1);
      return `You write that a step got by a death costs nothing, and that the regiment is talked of for foreign service.

He answers by return of post.

“Sir, I thank you. I am to hope, then, for the death of Mr Jekyll, or of Mr Bone, who stand next for it; and with both of whom I dined on Sunday. Your dutiful son.”

The Ensign of the 9th buys in before the month is out.`; }}
  ]});

ev({ id:'armCompany', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1804, to:1806, cond:() => edmServes('army') && armRank() === 1, title:'The Price of a Company',
  text:() => `Tidmarsh’s clerk rides out with a letter that has come under cover to the bank; and it is not in Edmund’s hand.

“Craig’s Court. Sir, I am desired by Lieutenant ${S.sur} of the 52nd Regiment to acquaint you, that a Company in that corps is become vacant by the retirement of Captain Molesworth, and that the Lieutenant stands first for purchase. The regulated price of a Company being £1,500, and the value of his Lieutenancy £550, the difference to be lodged is £950; upon receipt of which I shall have the honour to lay his name before His Royal Highness the Commander-in-Chief. I am, Sir, your most obedient humble servant, Cox and Greenwood.”

Folded within it is a slip of a different paper, in pencil.

“Sir John Moore says in the hearing of us all that he would as soon have his Captains made in the field as in Craig’s Court; and the second battalion, which is now raising, will want ten. He has not said that I am to be one. Molesworth goes because he cannot rise at five. E.”`,
  choices:[
    {t:'Lodge the nine hundred and fifty.', note:'£950', go:() => { fl('armCaptAt', S.year); add({money:-950}); reg('edmund',2,'You bought him his Company');
      return `Tidmarsh’s draft for nine hundred and fifty pounds goes up to Craig’s Court by the mail.

The Gazette has it on the 9th of the month following: “52nd Foot. Lieutenant Edmund ${S.sur} to be Captain of a Company, by purchase, vice Molesworth, who retires.”

He has sixty men, a pay-serjeant, and nine shillings and fivepence a day. Molesworth, he writes, was seen upon the morning after in the High Street of Hythe, at half past ten, in a dressing-gown, buying a newspaper.`; }},
    {t:'Let him stand for a Company without purchase.', go:() => {
      const head = `You answer Mr Cox that the money will not be lodged.

For four months there is nothing; and Molesworth’s company is bought in the mean time by a Lieutenant Dobbs, to whom Edmund taught his drill.`;
      if (chance(0.45 + 0.15 * Math.min(2, edmFriend()))) { fl('armCaptAt', S.year + 1); add({standing:2}); reg('edmund',3,'He has his Company from Sir John Moore, and not by purchase');
        return `${head}

Then the second battalion is gazetted, with ten Captains; and the seventh name is his, with no “by purchase” after it.

“Sir John sent for me,” he writes. “He said that he had watched me out with the piquets for two winters; and that I was to understand I had cost him nothing, and owed him the more.”`; }
      fl('armCaptAt', Math.min(1808, S.year + 2)); reg('edmund',-1,'Passed over for a Company');
      return `${head}

Then the second battalion is gazetted, with ten Captains; of whom six are come from other regiments, three from the General’s own Staff, and one from the Militia, with four hundred men at his back.

Edmund remains senior Lieutenant. On Tuesdays he commands the company that Dobbs bought, Dobbs being upon those days at Folkestone, with a lady.`; }},
    {t:'Sell him out, and bring him home.', note:'+£550', go:() => { fl('edmund','home'); add({money:550, family:1}); reg('edmund',-3,'You sold his commission'); reg('henrietta',2);
      return `Mr Cox sells the Lieutenancy within the week, to the father of a boy at Harrow; and remits five hundred and fifty pounds, less his own commission upon it.

Edmund comes home outside the Reading coach. He has kept his sword and the green feather; the coat he sold to the boy from Harrow, for whom it is to be taken in.

He hangs the sword in the gun room, between the two fowling-pieces; and at breakfast on the Monday he asks you what he is to do upon Mondays.`; }}
  ]});

ev({ id:'armWound', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1810, to:1811, cond:() => edmServes('army') && !S.peril && (S.year === 1811 || S.season >= 2), title:'The Bridge of the Coa',
  text:() => `Edmund has been a fortnight at home before he will let Mr Ferris look at the shoulder; and it is done at last in the gun room, by the north light, with the door shut upon ${hh('his mother', 'the servants')}.

“Where had you this, ${F('major') ? 'Major' : 'Captain'}?”

“At the bridge on the Coa, in July. We were the last over. I was counting my company across, and had got to forty.”

The ball went in under the left collar-bone, and has not come out. The surgeon at Lisbon let it alone; and the Medical Board at Belem gave him six months’ leave, and a paper. Mr Ferris feels for it with two fingers, the patient looking all the while at the rack of fowling-pieces; and having found it, he washes his hands, and speaks to you.

“It lies against the great artery, sir. I shall not cut for it. Mr Astley Cooper of Broad Street would, for eighty guineas; or it may be left where it is, when he will lift a glass with that arm, but hardly a sword.”

The regiment lies before Lisbon, and writes by every packet to know when he comes.`,
  choices:[
    {t:'Take him up to Mr Astley Cooper.', note:'£84', go:() => { fl('armWound','mended'); add({money:-84, family:2}); reg('edmund',2,'You had the ball cut out of him');
      return `You take him up yourself. Mr Cooper sees him in Broad Street at seven in the morning, between a Duke’s coachman and the wife of a sugar-broker; has the coat off him while Edmund is still giving his name; and upon the Thursday, at Guy’s, before two hundred pupils, takes the ball out in four minutes by a pupil’s watch.

It is given to Edmund in a pill-box.

At Christmas he lifts a hall chair with the left arm, and sets it down again; and in February he sails from Portsmouth with a draft for the regiment.`; }},
    {t:'Leave the ball where it is, and keep him the winter.', go:() => { fl('armWound','ball'); add({family:4}); reg('henrietta',2); reg('edmund',-1,'Kept at home with a ball in him while the regiment was in Portugal');
      return `Mr Ferris bleeds him twice, and orders bark, and a sling of black silk. Edmund shoots through November left-handed, and kills two pheasants and a weathercock; he reads the Gazette standing; and the letters from Portugal lie upon the hall table until the candles are brought.

In March the six months are out. He goes before the Board in London, lifts the arm as high as his neck-cloth for three physicians, and is passed fit.

He carries the ball back to Portugal with him.`; }},
    {t:'Let him rejoin by the next packet.', go:() => { fl('armWound','ball'); add({family:-3}); reg('edmund',2,'You let him go back with the ball in him'); reg('henrietta',-2,'You let Edmund go back wounded');
      return `He has not asked it. But his trunk has stood in the passage since Tuesday, corded.

“I should be glad to go, sir. Tamworth has my company, and Tamworth cannot count.”

He sails from Falmouth in the Lisbon packet, with the sling in his pocket. ${hh(`Henrietta walks beside the chaise as far as the lodge, with her hand upon the door of it.`, `You write to Gay Street when he is gone; and the answer that comes is directed to Mrs Bunce.`)}`; }}
  ]});

const brevet = () => { fl('major'); fl('brevet'); add({standing:2, family:2}); };
const BREVET_YES = () => `The Gazette is of nine columns, “To be Majors in the Army”; and he is in the fourth, between a Captain of Engineers and a Captain of the Sicilian Regiment.

It gives him no more pay, and not a man more to command. But Tamworth rides over with the paper in his pocket, drinks the Major in your port, and stays until he has finished it.`;
const BREVET_NO = () => `The Gazette is of nine columns, “To be Majors in the Army”; and you read it twice downward, and once from the foot.

Tamworth rides over with the paper in his pocket; and finding that you have it already, he puts his own away again, and asks after the pheasants.`;
ev({ id:'armBrevet', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1813, to:1814, cond:() => edmServes('army') && !F('major') && !S.peril && (S.year === 1814 || S.season === 3), title:'The Brevet',
  text:() => `Harry Tamworth, who left a foot at San Sebastian, dines at the Hall upon the one that has been made for him at Chelsea; and when the cloth is drawn he tells you what Edmund has not.

“He took the redoubt at Vera, sir, with two companies, the Major being down. Colonel Colborne saw it done, and sent his name home for the brevet. So have forty other Colonels sent home forty other names. It is all at the Horse Guards, sir, in one heap; and Colonel Torrens takes from the top.”

He moves the decanter, to show you where the redoubt stood, and brings up the salt for the French.

“A brevet costs nothing. It wants only somebody to turn the heap over.”`,
  choices:[
    {t:'Write to Colonel Torrens at the Horse Guards.', go:() => {
      if (chance(Math.min(0.9, 0.35 + (S.standing >= 60 ? 0.2 : 0) + (T('soldier') ? 0.3 : 0) + 0.1 * edmFriend()))) { brevet(); reg('edmund',1);
        return `You write two sides to Colonel Torrens, in which you state the redoubt, the two companies, and Colonel Colborne’s letter, and ask for nothing. The answer is in a clerk’s hand, and acknowledges yours.

${BREVET_YES()}`; }
      return `You write two sides to Colonel Torrens, in which you state the redoubt, the two companies, and Colonel Colborne’s letter, and ask for nothing.

“Sir, I am directed by the Commander-in-Chief to acquaint you, that the claims of Captain ${S.sur} will be considered with those of other deserving officers.”

${BREVET_NO()}`; }},
    {t:'Speak to the Secretary at War in the lobby.', if:() => F('mp'), go:() => { brevet(); add({standing:-1}); reg('edmund',1);
      return `Lord Palmerston, who is nine-and-twenty, is found in the lobby eating an orange. He hears you with great good humour, asks how the name is spelt, and having no paper about him, writes it upon his wristband.

${BREVET_YES()}`; }},
    {t:'Ask Lord Cullerne to name him at the Duke’s levee.', if:() => !F('mp'), go:() => { add({standing:-1});
      if (S.chars.cullerne.r >= 1) { brevet(); reg('cullerne',1); reg('edmund',1);
        return `“Brevet? Costs ’em nothing. That’s why they’re so fond of givin’ it.”

His lordship goes up for the levee, which he had meant to miss; and he names Edmund to the Duke of York between a Bishop and the Turkish envoy.

${BREVET_YES()}`; }
      return `“York? Never could abide the fellow. Owes me four hundred since Brighton.”

The hounds being by this time at the door, his lordship goes out to them.

${BREVET_NO()}`; }},
    {t:'Leave the heap as it lies.', go:() => {
      if (chance(0.25)) { brevet(); reg('edmund',3,'His brevet came without anybody’s asking');
        return `You do nothing; and Tamworth, upon being told so, looks for some time into his glass.

But the heap, it appears, has a bottom to it, and this once they have begun there.

${BREVET_YES()}`; }
      reg('edmund',1);
      return `You do nothing; and Tamworth, upon being told so, looks for some time into his glass.

${BREVET_NO()}`; }}
  ]});

/* ================= The Church ================= */

ev({ id:'chStipend', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1800, to:1802, cond:() => edmServes('church') && !F('edmundVicar'), title:'Fifty Pounds a Year',
  text:() => `Edmund writes from Hampshire, and has ruled a line down the middle of the second side.

“My dear Father, I am a Priest since Trinity Sunday, and have a sum to lay before you. My stipend is fifty pounds. The lodging over the wheelwright’s is twelve; the pony eats fourteen; the washerwoman has four; and I gave nine last winter, in coals and flannel, to people who had neither. There remain eleven pounds for meat, candles, a coat, and the tax upon the pony.

By the Act the Bishop may order a curate seventy-five. I have only to complain to him of the Rector. The Rector’s agent tells me, as a friend, that the last curate who complained was thanked for it; and had six weeks’ notice; and is now usher in a school at Andover.

Farmer Twitchen has two boys whom he would send me for their Latin, at eight guineas each, and he knows of four more. I had not thought to be a schoolmaster. But neither had I thought to be hungry.”`,
  choices:[
    {t:'Allow him fifty pounds a year of your own.', note:'£50 a year', go:() => { fl('edmAllowance'); add({family:2}); reg('edmund',2,'You doubled his stipend out of your own pocket'); reg('henrietta',1);
      return `You write to Tidmarsh to pay him fifty pounds upon every Lady Day, until he has a living; and to Edmund you write that a clergyman ought to be able to ask a farmer to dinner.

His answer is a fortnight in coming, there being so much to tell. He has bought a coat. He has had Farmer Twitchen to a leg of mutton, and Mrs Twitchen; and he has paid the wheelwright up to Christmas, upon which the wheelwright, without a word said, sent up his own arm-chair.`; }},
    {t:'Tell him to lay it before the Bishop.', go:() => {
      if (chance(0.5)) { add({standing:1}); reg('edmund',2,'The Bishop ordered him seventy-five pounds');
        return `He writes to Farnham Castle; and the Bishop’s secretary answers within the month, that his Lordship has been pleased to assign the Curate a stipend of seventy-five pounds, to be paid by the Rector quarterly.

The Rector pays it. He writes from Bath, besides, to hope that Mr ${S.sur} finds the air of the parish agree with him; and Edmund, who has read the letter four times over for the notice in it, can find none.`; }
      reg('edmund',-1,'Turned out of his curacy for complaining to the Bishop');
      return `He writes to Farnham Castle; and the Bishop’s secretary answers within the month, that his Lordship has been pleased to assign the Curate a stipend of seventy-five pounds.

The Rector’s answer comes by the same post. It thanks Mr ${S.sur} for his zeal, and gives him six weeks.

He finds another cure before the six weeks are out, eleven miles off, at fifty pounds; with two churches to it, as before, and a longer ride between them.`; }},
    {t:'Tell him to take the boys.', go:() => { reg('edmund',-1,'You made a schoolmaster of him');
      return `You write that Dr Johnson kept a school, and that no gentleman was ever the worse for teaching another man’s sons their accidence.

By Michaelmas he has six of them, at eight guineas, upon two forms in the wheelwright’s loft, and hears their Latin grammar before he has breakfasted.

“Twitchen major,” he writes, “has construed three lines of Cæsar. Twitchen minor has eaten the cover.”`; }}
  ]});

ev({ id:'chPresentation', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1803, to:1806, cond:() => edmServes('church') && !F('edmundVicar'), title:'The Next Presentation',
  text:() => `Mr Spurling walks out from Wyvern with the Morning Chronicle under his arm, folded small; and he lays it upon your desk, with his thumb to the place.

NEXT PRESENTATION. To be SOLD by Private Contract, the Next Presentation to the RECTORY of UPTON MONACHORUM, in the County of Wilts; the Tithes compounded for at £410 per Annum; with a good Parsonage House, Coach-house, and 40 Acres of Glebe. The present Incumbent is in his 77th Year. Apply (if by Letter, post paid) to Messrs. Tooke and Burley, Gray’s Inn. None but Principals will be treated with.

“Fourteen hundred, sir. I have been to Gray’s Inn. They began at two thousand, upon the Rector’s gout; but as I had sent my clerk down to Upton beforehand, who saw the Rector go round his glebe upon a cob, and take a gate, they came to fourteen.”

“Is it lawful, Spurling?”

“As lawful as buying a horse, sir, provided the old gentleman is alive upon the day we sign. The day after he dies it is simony.”${F('gallDead') ? '' : `

Dr Gall, whose living will cost you nothing whenever he is pleased to leave it, was seen on Sunday to carve for eleven.`}`,
  choices:[
    {t:'Buy it.', note:'£1,400', go:() => { fl('chBought'); fl('chBoughtAt', S.year); add({money:-1400}); reg('edmund',2,'You bought him the next turn of a living'); later('chInduction', 8 + Math.floor(Math.random() * 13));
      return `The deed is signed at Gray’s Inn upon a Tuesday; the Rector of Upton having been certified alive upon the Monday by Spurling’s clerk, who saw him at an upper window in his nightcap, shaking a mat.

Edmund writes that he is obliged to you beyond anything he knows how to say.

“I find that I now read the Deaths in the Salisbury Journal before the Preferments; and on Sunday I preached upon the tenth commandment, and looked at nobody. Pray do not tell my mother what it cost.”`; }},
    {t:'Sound Dr Gall. He might resign Hatherley for less.', if:() => !F('gallDead'), go:() => { add({standing:-2}); reg('gall',-3,'You offered him money for his pulpit'); reg('edmund',-1);
      return `You put it to the Doctor after dinner, with the port between you, as a matter of convenience upon both sides.

He rises. “Thy money perish with thee, because thou hast thought that the gift of God may be purchased with money. The Acts, sir; the eighth chapter, and the twentieth verse.” He does not finish his glass.

On Sunday he gives out the same text from the pulpit, and preaches upon Simon Magus for fifty minutes, turned a little towards the Hall pew; and half the congregation, who do not know who Simon Magus was, have learnt by Monday who he is.`; }},
    {t:() => F('gallDead') ? 'Decline it. He must wait his turn.' : 'Decline it. Hatherley will come to him for nothing.', go:() => { reg('edmund',-1);
      return `“It is fourteen hundred pounds, Spurling, laid upon an old man’s cob.”

“It is, sir.” He folds the Chronicle smaller than before.

The presentation is sold within the month to a gentleman in the City, for his nephew. Edmund, to whom Spurling had written of it beforehand, sends you eight lines upon the weather in Hampshire, and the state of his pig.`; }}
  ]});

const uptonAge = () => inWords(76 + S.year - flag('chBoughtAt', S.year - 3));
ev({ id:'chInduction', follow:true, hen:false, at:'hall', who:() => 'edmund', cond:() => edmServes('church') && F('chBought') && !F('edmRector'), title:'The Rector of Upton Is Dead',
  text:() => { fl('edmRector');
    return `Spurling’s clerk comes by express from Salisbury: the Rector of Upton Monachorum died on Tuesday, aged ${uptonAge()}, having taken the whole duty upon the Sunday before, and afterwards walked his glebe.

You present Edmund under your own hand and seal, and the Bishop institutes him; and three weeks afterwards you stand in the porch at Upton, among his new parishioners, to see him inducted. The Archdeacon lays Edmund’s hand upon the ring of the church door. Edmund goes in by himself, and tolls the bell.

He tolls it three times, and comes out.

There is a silence in the porch; and then an old woman behind you tells her neighbour, and the Archdeacon tells you, what all Wiltshire knows, and the new Rector did not: that as many strokes as a parson tolls at his induction, so many years will he stay.

${F('edmundVicar') ? `He has Hatherley already, and will not leave it. Upton, therefore, must have a curate; and it is Edmund who must say what a curate is worth.` : `At the parsonage that evening the churchwarden waits upon him, with the farmers’ compliments. The tithe was compounded for at four hundred and ten pounds in the year ’90, when wheat was at six shillings the bushel; a valuer out of Devizes now puts it at six hundred and thirty; and the farmers desire to know which it is to be.`}

“What would you do, sir?”`; },
  choices:[
    {t:'Seventy-five pounds, and the parsonage to live in.', if:() => F('edmundVicar'), go:() => { fl('chCurate', 75); add({standing:1}); reg('edmund',2);
      return `“You lived upon fifty. Give him seventy-five, and the house.”

He does. The curate is a Mr Venables, of five-and-forty, who has served nine parishes for nine Rectors, and comes to Upton with a wife, six children, and a cart.

Mrs Venables writes to Edmund at Christmas. They have had a fire in two rooms at once; and her husband desires her to say that he has left off taking pupils.`; }},
    {t:'Fifty pounds. It is what curates are paid.', if:() => F('edmundVicar'), go:() => { fl('chCurate', 50); reg('edmund',-1,'You had him pay his curate what he was paid himself');
      return `“Fifty. It is the rate; and you lived upon it.”

“I did, sir.”

The curate is a Mr Venables, of five-and-forty, with a wife and six children; who takes the fifty pounds, thanks the Rector for it, and by Lady Day has eleven farmers’ sons upon forms in the parsonage kitchen.

Edmund rides over once a quarter to preach; and upon those Sundays, he says, Mr Venables holds his stirrup.`; }},
    {t:'Take the six hundred and thirty. It is the value.', if:() => !F('edmundVicar'), go:() => { fl('chTithe','full'); add({money:200}); reg('edmund',1);
      return `“It is the value of the thing; and you have been eleven years a curate.”

The farmers meet upon it at the Plough, and sign in three weeks; the churchwarden observing, as he signs, that the late Rector was a gentleman.

At Michaelmas Edmund sends you a draft for two hundred pounds, towards the fourteen; and he has bought himself a cob that will take a gate.`; }},
    {t:'Let the four hundred and ten stand.', if:() => !F('edmundVicar'), go:() => { fl('chTithe','old'); add({family:2}); reg('edmund',2,'You told him to leave the tithe as he found it');
      return `“You can live upon four hundred and ten; and they have had a dear loaf as well as you.”

He tells the churchwarden so upon the doorstep. The churchwarden puts on his hat, takes it off again, and goes away up the street at a pace; and before Edmund has done his supper the ringers are in the tower.

They ring until eleven. In the morning there is a goose upon the parsonage step, picked, and a sack of seed oats, with nobody’s name to either.`; }},
    {t:'Tell him that it is his parish.', go:() => { reg('edmund',1);
      return `“It is your parish, Edmund.”

He looks at you for a moment, and then at the ${F('edmundVicar') ? 'Archdeacon, who is being helped into his gig' : 'churchwarden, who is turning his hat'}.

“So it is, sir,” he says; and he does not tell you, then or afterwards, what he settled.`; }}
  ]});

/* Letters from Upton, for a Rector who is not Vicar of Hatherley; and the old letters kept to the rank that wrote them. */
EDMUND.push(
  {id:'edmund-upton-glebe', kind:'news', w:() => at('church') && F('edmRector'), x:() => `“My dear Father, I have forty acres of glebe at Upton, and I farm them. The barley is in the ground. The late Rector’s man tells me every morning how the late Rector did a thing, and I do it so; except the pigs, about which the late Rector was mistaken. Pray send me word what you gave for your Swedish turnip seed, and whether Hartopp still drills at nine inches. I preach at eleven, and at three.”`},
  {id:'edmund-upton-rooks', kind:'news', w:() => at('church') && F('edmRector'), x:() => `“My dear Father, There are rooks in the parsonage elms at Upton, as there are at home; and a pew in the church with a door to it, that belongs to nobody, since the family died out in the year ’61. I have put the singers into it. They had a bassoon and two clarionets in the gallery, and the bassoon could not see the clerk. Twenty-three took the Sacrament at Easter, where the late Rector had nine.”`},
  {id:'edmund-upton-audit', kind:'news', w:() => at('church') && F('edmRector'), x:() => `“My dear Father, I held my tithe audit on Tuesday at the Plough, and gave the farmers a dinner, as you give yours: a round of beef, two geese, and punch. They paid to a man. One of them proposed my health; and another, who had drunk it twice already, told me across the table that I was the first parson of Upton he had ever seen eat. I sat until nine, and walked home.”`});
const gate = (id, fn) => { const p = EDMUND.find(x => x.id === id); if (p) { const w0 = p.w; p.w = () => w0() && fn(); } };
['edmund-curacy', 'edmund-burials', 'edmund-tithepig', 'edmund-pressed', 'edmund-waiting', 'edmund-pony', 'edmund-miss-church'].forEach(id => gate(id, () => !F('edmRector')));
['edmund-paidoff', 'edmund-outfit', 'edmund-tetuan'].forEach(id => gate(id, () => navRank() >= 1));
gate('edmund-skaw', () => navRank() === 1 && S.flags.navCmdrAt === undefined);
gate('edmund-sandyhook', () => navRank() === 2 && S.flags.navCmdrAt === undefined);
gate('edmund-java', () => navRank() === 2);
gate('edmund-kit', () => armRank() === 2);

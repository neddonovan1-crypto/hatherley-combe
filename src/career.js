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
/* He leaves the service and comes back to the land. What he was is kept for the reckoning: edmWas, edmWasRank, edmWasHow (early, wound, peace). */
const comeHome = (was, how) => { fl('edmWas', was); fl('edmWasRank', was === 'navy' ? NAVY_RANK[navRank()] : F('major') ? 'Major' : ARMY_RANK[armRank()]); fl('edmWasHow', how); fl('edmund', 'home'); };
const edmYears = () => { const n = 19 + S.year - 1795, t = ['twenty', 'thirty', 'forty'][Math.floor(n / 10) - 2]; return n % 10 ? UNITS[n % 10] + '-and-' + t : t; };

/* ================= The Navy ================= */

ev({ id:'navCommission', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1801, to:1802, cond:() => edmServes('navy'), title:'Passed, and Not Made',
  text:() => `Edmund writes from Portsmouth, upon a half-sheet, and has not troubled to cross it.

“My dear Father, I have passed. Three Captains sat upon me at Somerset House on the first Wednesday of the month; of whom one desired me to club-haul a frigate off a lee shore, which I did upon the table-cloth with his snuff-box; the second asked my age twice; and the third woke in time to sign. I have their certificate, for which the clerk took a guinea.

It makes me nothing. A commission must come from the Admiralty, or from an Admiral abroad when somebody dies; and there are in the cockpits of the fleet a thousand young gentlemen who have passed as I have, and wait. They talk here of a peace. In a peace a Lieutenant goes ashore upon half-pay; and a Midshipman goes ashore upon his chest.

Lord St Vincent is at the Admiralty, and is said to answer with his own hand every letter that asks him a favour, and to grant none of them. Captain Holloway says that he will write if he is asked, and not otherwise. Have we any friend there?

Your dutiful son, Edmund.”${T('captain') ? `

You passed in the year ’79, at the Navy Office in Seething Lane, before three Captains, of whom two are dead, and the third has his flag; and you were two years a passed Midshipman afterwards, and helped to bury a Lieutenant of the yellow fever at Port Royal, before you had his place.` : ''}`,
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
    {t:'Write to Lord St Vincent yourself, and ask him nothing.', if:() => T('captain'), go:() => { fl('navLtAt', S.year); add({standing:1}); reg('edmund',2,'You wrote to the First Lord as one sea officer to another');
      return `You write to the First Lord upon one side of a sheet. You state that Mr ${S.sur}, master’s mate of the Thetis, has passed; that he has been ${inWords(S.year - 1796)} years at sea under a Captain who does not praise; and that the writer, having commanded a frigate for six years, and sat upon some forty young gentlemen for their certificates, would have passed him likewise. You ask for nothing, and sign with your rank.

The answer is in his lordship’s own hand.

“Sir, I have had this year four hundred letters from Peers, Members, and ladies of quality, upon the merits of young men whom they never saw upon a deck. Yours is the first from a sea officer. He shall have the next vacancy in the North Sea. St Vincent.”

${crewAboard() ? 'Tarbuck, having been shown the signature, carries the letter round the servants’ hall upon a tray.' : 'You lay it in the drawer with your own commissions.'}`; }},
    {t:'Ask Captain Holloway to write for him.', go:() => { fl('navLtAt', S.year + 1); reg('edmund',2,'Made Lieutenant on his Captain’s word');
      return `You write six lines to Captain Holloway, and have four back.

“Sir, I have written. I said that he can work a ship and keep a reckoning and does not drink. I did not say whose son he is as they have enough of those. Holloway.”

Their Lordships return no answer whatever. But in the autumn, the third Lieutenant of the Thetis being lost overboard from the fore chains in a gale off the Texel, the Captain gives Edmund an order to act in his room; and an acting order, Edmund writes, wants only six months and nobody’s nephew to become a commission.`; }},
    {t:'Tell him to come home, and learn the estate.', go:() => { comeHome('navy', 'early'); add({family:2}); reg('edmund',-3,'You fetched him home from the sea'); reg('henrietta',2);
      return `You write that he has seen the sea, and that there are two thousand acres in Berkshire which he has not.

He comes outside the Portsmouth coach, in a blue coat from which the buttons have been cut, with his chest, and a quadrant in a green baize bag. ${hh(`Henrietta has had his room aired for a week, and stands upon the steps without her shawl.`, `His room has been aired by Mrs Bunce, upon orders from Bath.`)}

For the first month he wakes at four. The dairymaid, going out to the cows, finds him twice upon the leads of the house in his shirt, looking at the weather; and on the second occasion he tells her which way it will blow by noon, and is right.`; }}
  ]});

ev({ id:'navPrize', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1804, to:1806, cond:() => edmServes('navy'), title:'Prize Money',
  text:() => { const big = navRank() >= 1;
    return `Edmund writes from Plymouth Dock; and the letter being charged double, you pay two and fourpence for it at the door.

“My dear Father, We have taken a ship. She is the Deux Frères of Bordeaux, homeward bound from Martinique with sugar, coffee, and eleven tons of indigo; and she struck to us off Cape Spartel after a chase of nine hours, in which nobody was hurt but the cook, who fell down the fore hatch with the coppers.

The Court has condemned her. Mr Tulk the agent, having taken out his five per cent, and the Proctor’s bill, and the Admiral’s eighth, and something that he calls contingencies, makes my share ${big ? 'six hundred and forty' : 'a hundred and fifty'} pounds.

I never had above eleven pounds at one time in my life, and I do not know what a man does with it. The purser says the Funds; the Captain says land; and the ${big ? 'gunroom' : 'berth'} says that it will do very well where it is until Saturday. Pray advise me.”${T('captain') ? `

Mr Tulk’s last word is an old acquaintance. It stood in every account that was ever rendered you of a prize; and in two-and-twenty years you never got an agent to tell you what had been bought with it.` : ''}`; },
  choices:[
    {t:'The Funds. Let him buy into the Navy Five per Cents.', go:() => { add({family:1}); reg('edmund',1);
      return `You write him two sides upon the Navy Five per Cents, in which the dividend is paid at the Bank in January and in July, and the principal lies where no messmate can come at it.

He buys at ninety-one, and sends you the broker’s note to keep in the iron chest.

The first half-year’s dividend he lays out upon a glass by Dollond; with which, he writes, he has read the name upon the stern of a French seventy-four at her moorings, and counted the washing in her rigging.`; }},
    {t:'Land. Let it come home, and go against what the estate owes.', go:() => { const sum = navRank() >= 1 ? 640 : 150, off = Math.min(sum, Math.max(0, S.mortgage)); S.mortgage -= off; S.money += sum - off; add({family:2}); reg('edmund',1,'He put his prize money into the estate');
      return `Mr Tulk’s draft comes up by the mail; and ${off ? `Tidmarsh writes ${off === sum ? 'the whole of it' : fmt(off)} off the mortgage, in red ink` : `Tidmarsh enters it upon the right side of your account`}.

Edmund asks in his next whether it has bought a field, and which.

It has bought none. But you take the estate map into the book-room with ${steward()}, and choose him one: the Nine Acres under the Down, which has the spring in it; and you write his initials upon it in pencil.`; }},
    {t:'Have Mr Tulk send up his account, with the vouchers to it.', if:() => T('captain'), go:() => { const big = navRank() >= 1; add({standing:1, family:1}); reg('edmund',2,'You went through his prize agent’s vouchers');
      return `You write to Mr Tulk for the account, and for every voucher to it; and they come up by the wagon in a deal box, which is carried into the book-room by ${crewAboard() ? 'Tarbuck' : 'two of the men'}.

It takes you three evenings. The Proctor has been paid twice, once under his own name, and once under that of his clerk; a pilot is charged at Plymouth for a ship that came in upon the flood without one; and under contingencies there are nineteen guineas for a dinner given at Plymouth to a Judge who has not stirred from Doctors’ Commons since the war began.

Mr Tulk regrets extremely the inadvertence of a young man in his counting-house, who has since left him, and remits Edmund a further ${big ? 'eighty-four' : 'nineteen'} pounds. Before the month is out a second box comes up by the same wagon, from the ${big ? 'gunroom' : 'warrant officers'} of the Thetis, with Captain Holloway’s compliments.`; }},
    {t:'Tell him to lay it out where it will be seen.', go:() => { const big = navRank() >= 1; befriend(); reg('edmund',2,'You told him to spend his prize money like a gentleman');
      return `He takes you at your word.

He dines the Captain, the Port Admiral’s secretary, and two Lieutenants of the flagship at the Pope’s Head, upon turtle; he has a coat from the tailor who makes for the Admiral; and he lends ${big ? 'eighty' : 'twenty'} pounds to the secretary’s brother, who is going into the wine trade at Oporto.

At Christmas there are ${big ? 'sixty' : 'nine'} pounds left of it. But the secretary, he writes, now knows him in the street; and stopped him upon the Hard on Thursday, to ask how the name was spelt.`; }}
  ]});

ev({ id:'navWound', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1806, to:1809, cond:() => edmServes('navy') && navRank() === 1, title:'A Chaise from Portsmouth',
  text:() => `A yellow chaise from Portsmouth sets down at the door a little after dark; and out of it there gets first a seaman with a pigtail, who looks up at the front of the house as he would at a strange sail, and after him, backwards, with an arm about the seaman’s neck, Edmund.

“Lott will carry me up, sir. I had rather my mother did not see me take the stairs.”

His left leg is in splints from the hip to the ankle. The boats of the Thetis, it appears, cut a privateer brig out of the road at the Isle of Bas, under the battery; Edmund had the launch; and a twelve-pound shot, coming in upon her quarter, drove a piece of her own gunwale through his thigh. He has brought the piece home in his hat-box.${T('captain') ? `

You have it out of the hat-box. It is elm, nine inches long, with the head of a copper bolt in it; ${crewAboard() ? 'and Tarbuck, who holds the candle, having asked leave to look, gives it as his opinion that the launch was a Deptford boat.' : 'and having turned it twice to the candle, you find the King’s broad arrow cut upon the under side.'}` : ''}

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
    {t:'Carry him back to Haslar, and lodge at Gosport, where his Captain may see him.', note:'£35', if:() => T('captain'), go:() => { fl('navWound'); befriend(); add({money:-35, family:-1}); reg('edmund',2,'You kept him under his Captain’s eye at Haslar'); reg('henrietta',-1);
      return `A wounded officer who lies in Berkshire is forgotten at Spithead within the week, and you have in your time forgotten several. You carry him down again in the same chaise, see him into the officers’ ward at Haslar, take two rooms over a chandler’s at Gosport, and are pulled across the harbour every morning at nine.

Captain Holloway, coming ashore for his letters, finds you upon the Hard on the Tuesday, and again on the Friday; and upon Sunday he has you off to dine in the Thetis, where you go up a ship’s side for the first time since the Dryad paid off, and are asked by the Master whether she did not carry her mizen too far aft.

In the eleventh week Edmund walks the length of the ward without a stick, before two surgeons and his Captain; and he is read in as First Lieutenant upon Lady Day. ${hh(`Henrietta, who has had him one night out of the three months, sends his shirts down to Gosport by the carrier, and no letter with them.`, `Gay Street, which was promised him for a month, has the news from you in six lines, and does not answer them.`)}`; }},
    {t:'Let him go back as soon as he can stand.', go:() => { fl('navWound'); befriend(); add({family:-1}); reg('edmund',2,'You let him go back to his ship'); reg('henrietta',-1);
      return `In five weeks he can stand; in six he can cross the hall, provided that nobody is looking at him; and at the end of the seventh Lott has the chest corded, and in the cart.

“A First Lieutenant does not go aloft, sir. He stands still, and finds fault.”

He is read in at Spithead upon Lady Day. The surgeon of the Thetis, he writes, has looked at the leg, and said nothing about it; and has since had him moved into a cabin that has no step.`; }},
    {t:'Have him surveyed, and bring him ashore for good.', go:() => { fl('navWound'); comeHome('navy', 'wound'); add({family:4}); reg('henrietta',2); reg('edmund',-2,'You had him surveyed unfit, and put upon half-pay');
      return `Mr Ferris writes what he is asked to write: that the thigh has knit an inch short, and that Lieutenant ${S.sur} cannot go up a ship’s side without a chair. The surgeons at Haslar, having had him walk twice across their room, are of Mr Ferris’s opinion; and the Navy Office puts him upon half-pay, at five shillings a day.

He says nothing against it. But the piece of gunwale, which ${hh('his mother', 'the housemaid')} had set upon the chimney-piece, is taken down, and locked in his own drawer.

By haymaking he rides, with the near stirrup let down two holes. ${steward()}, going round the home farm with him in July, is asked what a load of hay weighs; what it fetches at Newbury; and why, the two answers being what they are, anybody at Hatherley grows wheat.`; }}
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
    {t:'Call upon Sir Digby Frome, who was your First in the Dryad, and sits at the Board.', if:() => T('captain'), go:() => { navMade(); add({standing:1}); reg('edmund',2,'You had his Captain’s log read at the Board');
      return `Rear-Admiral Sir Digby Frome, who was six years your First Lieutenant, and has been two a Lord of the Admiralty, receives you in his own room, with his back to the fire.

“You taught me to keep a clean deck, sir, and I keep a clean list. I cannot make your son because he is your son.”

“I do not ask it. Send for Holloway’s log, and for the nephew’s journal.”

They are sent for. The journal is of ten weeks, in a hand like a copy-book, and records upon four several days that the ship was in sight of land. The log Sir Digby reads standing, for the better part of an hour; and when he has done, he rings for the Secretary.

Edmund is made Commander into the Sparrow. The nephew goes out to the Mediterranean in a flagship, with his journal, and a new quadrant.`; }},
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
    {t:'Send their Lordships your own reading of the action.', if:() => T('captain'), go:() => {
      const head = `You have the Admiral’s letter, the Sparrow’s force out of Steel, and the Tamerlane’s out of the Gazette; and you sit down to them in the book-room, as you formerly sat upon courts martial.

Your letter to the Secretary is of two sides. A sloop of eighteen guns, that has pumped for thirty hours, does not take a privateer of sixteen in forty minutes by good fortune. She takes her because her people can fire three broadsides in five minutes; and they can do that only where a Commander has laid out his own money upon powder, the allowance for exercise being what their Lordships know it to be. You had a frigate for six years, and never brought her people to it.`;
      if (postChance(0.6)) { posted(); reg('edmund',2,'You wrote to the Board upon his action, as an officer');
        return `${head}

The Secretary’s answer is of one line; and the confirmation goes out to Halifax in the next packet. Edmund is Post, of the date of the action.

“The Admiral has shown me a copy of a letter,” he writes. “I did not know that you had ever counted the Dryad’s broadsides. Nor, I think, did the Dryad.”`; }
      reg('edmund',1);
      return `${head}

The Secretary acknowledges the receipt of your letter, which has been laid before their Lordships. A Captain is sent out to the Calliope from Portsmouth, and Edmund goes back to his sloop.

At the year’s end you learn from an officer who has dined at the Admiralty, that the allowance of powder for exercise is raised by one third upon the North American station.`; }},
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

If I do not lodge it within the month, an Ensign of the 9th buys in over all our heads. He is sixteen. Tamworth has seen him, and says that he has not done growing.”${T('soldier') ? `

Your own step cost you nothing. It was had at Guilford, at about three in the afternoon, of a Mr Tench, who was carrying the other colour.` : ''}`,
  choices:[
    {t:'Lodge the hundred and fifty, and find Garrow his sixty guineas.', note:'£213', go:() => { fl('armLtAt', S.year); add({money:-213}); reg('edmund',2,'You bought him his Lieutenancy');
      return `A hundred and fifty pounds go to Mr Cox, and are acknowledged upon a printed form. The sixty guineas go down to Chelmsford in the foot of a stocking, by the hand of Tamworth’s servant, and are not acknowledged at all.

The Gazette has it within the fortnight: “52nd Foot. Ensign Edmund ${S.sur} to be Lieutenant, by purchase, vice Garrow, who retires.”

Edmund writes that he has now five shillings and eightpence a day; and that the mess, having met upon it, has raised his subscription.`; }},
    {t:'Lodge the regulation, and go down to dine with his mess.', note:'£158', if:() => T('soldier'), go:() => { fl('armLtAt', S.year); befriend(); add({money:-158, standing:1}); reg('edmund',1,'You told Guilford to his mess');
      return `A hundred and fifty pounds are lodged with Mr Cox; and you go down to Chelmsford by the coach, where the 52nd give a dinner to an old officer of the Fusiliers, and the Colonel, when the cloth is drawn, asks for Guilford.

You tell it, from the wood to the rail fence. Lieutenant Garrow, who sits four places below you, and has in nine years’ service heard no shot fired except at a review, is observed to take water with his wine.

“We had a Lieutenant in the 23rd, Colonel, who sold out at New York, in the week before we sailed for Charleston. His price, I remember, was the regulation.”

Nobody looks at Mr Garrow. He signs next morning before the Adjutant, for a hundred and fifty pounds; and Edmund is in the Gazette, by purchase, before the brewer’s widow has been told what a Lieutenancy commonly fetches.`; }},
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
    {t:'Write to General Stanwix, who was your captain at Guilford.', if:() => T('soldier'), go:() => { fl('armCaptAt', Math.min(1808, S.year + 1)); add({standing:1}); reg('edmund',2,'Your old captain asked Sir John Moore about him');
      return `You answer Mr Cox that the money will not be lodged this month; and by the same post you write to the Horse Guards.

“My dear ${S.sur}, I asked Moore at the levee. He says that your boy is one of four subalterns in his camp who can be found at five in the morning, and the only one who has been seen with a book upon out-posts. He will take no recommendation from this office, and told me so; but he had the name before I could spell it to him. Let Molesworth’s company go. There are ten coming, and they are not for sale. J. S.”

Molesworth’s company is bought by a Lieutenant Dobbs, to whom Edmund taught his drill. In the spring the second battalion is gazetted, with ten Captains; and the fourth name is Edmund’s, with no “by purchase” after it.`; }},
    {t:'Sell him out, and bring him home.', note:'+£550', go:() => { comeHome('army', 'early'); add({money:550, family:1}); reg('edmund',-3,'You sold his commission'); reg('henrietta',2);
      return `Mr Cox sells the Lieutenancy within the week, to the father of a boy at Harrow; and remits five hundred and fifty pounds, less his own commission upon it.

Edmund comes home outside the Reading coach. He has kept his sword and the green feather; the coat he sold to the boy from Harrow, for whom it is to be taken in.

He hangs the sword in the gun room, between the two fowling-pieces; and at breakfast on the Monday he asks you what he is to do upon Mondays.`; }}
  ]});

ev({ id:'armWound', weight:40, hen:false, at:'hall', who:() => 'edmund', from:1810, to:1811, cond:() => edmServes('army') && !S.peril && (S.year === 1811 || S.season >= 2), title:'The Bridge of the Coa',
  text:() => `Edmund has been a fortnight at home before he will let Mr Ferris look at the shoulder; and it is done at last in the gun room, by the north light, with the door shut upon ${hh('his mother', 'the servants')}.

“Where had you this, ${F('major') ? 'Major' : 'Captain'}?”

“At the bridge on the Coa, in July. We were the last over. I was counting my company across, and had got to forty.”

The ball went in under the left collar-bone, and has not come out. The surgeon at Lisbon let it alone; and the Medical Board at Belem gave him six months’ leave, and a paper. Mr Ferris feels for it with two fingers, the patient looking all the while at the rack of fowling-pieces; and having found it, he washes his hands, and speaks to you.

“It lies against the great artery, sir. I shall not cut for it. Mr Astley Cooper of Broad Street would, for eighty guineas; or it may be left where it is, when he will lift a glass with that arm, but hardly a sword.”${T('soldier') ? `

Your own ball went through, and the leg was a twelvemonth in mending. Edmund asks you, with his eyes still upon the fowling-pieces, whether it aches before rain; and you tell him that it does.` : ''}

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

He sails from Falmouth in the Lisbon packet, with the sling in his pocket. ${hh(`Henrietta walks beside the chaise as far as the lodge, with her hand upon the door of it.`, `You write to Gay Street when he is gone; and the answer that comes is directed to Mrs Bunce.`)}`; }},
    {t:'Let him exchange to half-pay, and stay.', go:() => { fl('armWound','ball'); comeHome('army', 'wound'); add({family:4}); reg('henrietta',2); reg('edmund',-2,'You took him out of the regiment with the war unfinished');
      return `You write to Mr Cox; and Mr Cox, who keeps a list of forty Captains upon half-pay desiring to be upon full, finds one within the week: a Captain Pym, of the late 98th, who exchanges into the 52nd, and sails for Lisbon by the next packet, with Edmund’s company book in his valise.

Edmund signs the paper left-handed, and is some time about it.

The sling comes off at Christmas. He shoots through January; and in February he walks the Down with ${steward()} and the estate map, upon which it is found, at the month’s end, that he has pencilled every hedge, with its length in paces, and against Twelve Acres the words “dead ground”.

${hh(`Henrietta has the letters from Portugal carried up to him upon the breakfast tray, and does not ask what is in them.`, `The letters from Portugal are carried up to him upon the breakfast tray; and it is known at Gay Street within the week that he reads them standing.`)}`; }}
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
    {t:'Write to General Stanwix, and ask him to turn it.', if:() => T('soldier'), go:() => { brevet(); reg('edmund',1,'Your old captain turned over the heap for him');
      return `General Stanwix is in his seventy-fourth year, and goes down to the Horse Guards upon Tuesdays.

“My dear ${S.sur}, I went into Torrens’s room myself, and asked to be shown the heap. It is two feet high. I found Colborne’s letter a foot from the top, and laid it upon the blotting-paper, under the Colonel’s spectacles. At my age I can do no more than move a paper; but I have observed these forty years that nobody here does anything else. J. S.”

${BREVET_YES()}`; }},
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

/* ================= The peace of 1814 ================= */

const navShip = () => ['Thetis', 'Thetis', 'Sparrow', 'Calliope'][navRank()];
ev({ id:'navPeace', weight:150, hen:false, at:'hall', who:() => 'edmund', from:1814, to:1815, cond:() => edmServes('navy') && !S.peril && (S.year === 1815 || S.season >= 2), title:'Paid Off',
  text:() => { const r = navRank();
    return `The ${navShip()} was paid off at ${r >= 2 ? 'Deptford' : 'Portsmouth'} upon the Tuesday. Her people had their money over the capstan head, and were out of her by noon; the pendant came down at sunset; and her ${r >= 2 ? 'Captain' : r ? 'First Lieutenant' : 'senior mate'}, having given up his keys to a clerk of the Dock-yard, went ashore in a wherry, and paid the waterman himself.

He is at the Hall by Thursday, with a chest, a sword-case, and a tin box of charts.

There are in Steel’s List ${r === 3 ? 'above eight hundred Post-Captains' : r === 2 ? 'near eight hundred Commanders' : 'above three thousand Lieutenants'}, and ships in commission for one in ${r === 3 ? 'eight' : 'ten'} of them. ${r ? `His half-pay is ${r === 3 ? 'ten and sixpence' : r === 2 ? 'eight and sixpence' : 'five shillings'} a day.` : `A master’s mate has no half-pay.`} He is ${edmYears()}; he has been ${inWords(S.year - 1796)} years afloat; and for a week he comes down to breakfast at six, and waits for it until nine.

On the eighth morning you find him in the book-room. He has the estate map open upon the table, and held down at its corners by your inkstand, the snuffers, and two volumes of Mr Young’s Annals.

“I can read this, sir, for it is a chart. But I cannot find upon it anything for me to do.”${T('captain') ? `

You have done this yourself, and it was three years before you left off waking at four.` : ''}`; },
  choices:[
    {t:'Give him the home farm and the woods, to manage as his own.', go:() => { comeHome('navy', 'peace'); add({family:5, goodwill:-1}); reg('edmund',2,'You gave him the home farm when his ship paid off');
      return `He takes them as he would take a ship that another man has let go. Within the month every gate upon the home farm has a number painted on it; the carters are mustered at five by a bell, and answer to their names; and the hedger, an old man who was never before asked what he did with his time, is desired to keep a log.

${steward()} bears it for six weeks. He then lays before you the threshing account, which is up by eleven quarters, the barn floor having been swept every night for the first time since it was laid; and beside it a paper with nine marks to it, in which the men of the home farm humbly beg that they may not be piped to their dinner.`; }},
    {t:'Go up with him, and ask for a ship in the peace.', note:'£40', go:() => { const r = navRank(); add({money:-40});
      const head = `You are a fortnight in town with him. The waiting-room at the Admiralty has been given more chairs since the peace, and wants them; and Edmund, who sits there from eleven until four, counts upon the first day sixty officers, of whom he knows eleven, and has been shipmates with four.`;
      if (chance(Math.min(0.8, 0.15 + 0.12 * interest()))) { fl('navPeaceShip'); reg('edmund',2,'You got him a ship in the peace'); add({family:-2});
        return `${head}

On the twelfth day a clerk comes out with a list in his hand, and reads from it. ${r === 3 ? `Captain ${S.sur} is to have the Hyperion, of thirty-two guns` : r === 2 ? `Commander ${S.sur} is to have the Cygnet brig` : `Mr ${S.sur} is to be ${r ? 'First' : 'mate'} of the Hyperion, thirty-two`}, fitting at Chatham for the Cape.

He is gone from Hatherley within the week. The tin box goes with him; and the estate map is rolled up by ${steward()}, and put back behind the clock.`; }
      comeHome('navy', 'peace'); reg('edmund',1);
      return `${head}

On the fourteenth day he is called in, and is four minutes with the Secretary; who is extremely sensible of his services, has his name upon the list for employment, and can hold out no expectation of a ship before the next war.

You come down together outside the Bath coach. At Hounslow he asks the coachman what such a team costs to keep; and at Reading, what a man may clear upon forty acres of turnips.`; }},
    {t:'Let him be, till he knows his own mind.', go:() => { comeHome('navy', 'peace'); add({family:2}); reg('edmund',1);
      return `You tell him that the map will keep, and that nobody at Hatherley was ever yet hurried.

For a month he does nothing that can be given a name. He winds the clocks. He rides to Wyvern for the newspaper, which would have come; and he is two whole days shut up in the carpenter’s shop, from which there is carried into the hall upon the Saturday a model of the ${navShip()}, four feet long, and rigged to her royals.

On the Monday he asks ${steward()} for the key of the wood-yard, and for the name of the man who has been buying your oak at ninepence the foot.`; }}
  ]});

ev({ id:'armPeace', weight:150, hen:false, at:'hall', who:() => 'edmund', from:1814, to:1814, cond:() => edmServes('army') && !S.peril && S.season >= 1, title:'The Peace Establishment',
  text:() => `Edmund has six weeks’ leave from Hythe, and has been three of them at the Hall before he lays a letter beside your plate.

“This is from Craig’s Court, sir, and every Captain in the regiment has had the same.”

It is in a clerk’s hand, upon a printed head.

“Sir, The second battalion being ordered to be reduced, and the establishment of Captains in the first complete, I am to acquaint you, that an officer desirous of retiring may at present sell at the regulated price of £1,500; which price, in the event of a long peace, I cannot undertake to say that a Company will continue to fetch. I have upon my books eleven gentlemen who wait to purchase. Cox and Greenwood.”

He has been ${inWords(S.year - 1797)} years in the regiment, and is ${edmYears()}. He has brought home from Toulouse a French drum, upon which ${hh('Henrietta', 'somebody')} has since set a fern; a Spanish mule, that will be led by nobody else; and a servant named Ortiz, who sleeps across his door.

“They say in the mess that there is America, sir, for any man who has not had enough. Colonel Colborne asked me whether I had; and I told him that I would first ask my father what land is worth.”${T('soldier') ? `

You were put upon half-pay yourself at the peace of ’83, and were a twelvemonth learning to get up without a drum.` : ''}`,
  choices:[
    {t:'Sell, and give him the home farm and the woods.', note:'+£1,500', go:() => { comeHome('army', 'peace'); add({money:1500, family:4}); reg('henrietta',2); reg('edmund',1,'You sold his Company at the peace, and gave him the woods');
      return `Mr Cox sells the Company within nine days, to a Lieutenant of the Guards who has never been out of London, and remits fifteen hundred pounds.

Edmund gives the mule to the home farm, and Ortiz to the stables. By Michaelmas he has the woods measured, the oak apart from the ash; and he has found in the Long Hanger a hundred and forty trees, marked for the Navy in the year ’96, for which nobody ever came.

The red coat he keeps. It lies in the press between two sheets, with pepper against the moth${hh('; and Henrietta has the key', '')}.`; }},
    {t:'Tell him that the regiment has not done with him.', go:() => { add({family:-2}); reg('edmund',2,'You sent him back to the regiment at the peace'); reg('henrietta',-1);
      return `“You have not had enough, Edmund; and Colonel Colborne knew it, or he would not have asked.”

He goes back to Hythe a week before his leave is out, upon the mule, with Ortiz behind him upon the cob.

The battalion, he writes, is under orders for America, and is to embark after Christmas.`; }},
    {t:'Leave it to him.', go:() => {
      if (S.chars.edmund.r >= 1) { comeHome('army', 'peace'); add({family:5}); reg('edmund',1);
        return `He is two days about it; and upon the third he rides into Wyvern, and puts a letter for Craig’s Court into the post with his own hand.

“I have sold, sir. I found that I was counting the chimneys from the Down, as I used to count my company across a bridge; and a man who does that had better stop where the chimneys are.”

The fifteen hundred pounds he lays out himself, in the Five per Cents; and he asks you at dinner, before ${steward()}, for the woods.`; }
      add({family:-1});
      return `He is two days about it; and upon the third he has Ortiz cord the trunk.

“I thank you, sir. I find that I do not know what a Captain is for, at Hatherley; and at Hythe they tell me every morning.”

The mule is led round to the door. It will not pass the lodge until he gets down, and walks.`; }}
  ]});

/* A son sold out in 1814 reads the Gazette of Waterloo at home. after() clears hen, which waterloo never had. */
after('waterloo', () => E() === 'home' && S.flags.edmWas === 'army' && !F('edmundDead') ? `Edmund has the paper from you before you have done with it, and carries it to the window. He goes down the 52nd with his thumb, and stops four times; and having come to the foot of the column, he folds the sheet small, as a letter is folded, and puts it into his breast.` : '');
/* Once he has a ship in the peace, the war's letters from Halifax and the Baltic are done. */
EDMUND.forEach(x => { if (/at\('navy'\)/.test(String(x.w))) { const w0 = x.w; x.w = () => w0() && !F('navPeaceShip'); } });

/* ================= A prisoner of war =================
   A small chance in either service. While he is held, S.flags.edmund is 'prisoner' and edmHeld keeps the service, so that every paper
   and letter of that service stands off of itself. edmTaken asks what is to be done (edmPlan); edmOut, some seasons on, tells what came
   of it (edmOut: free, parole, held); edmFreed opens the gates in 1814 for a man still there. Nobody dies of it. */
const wasIn = () => S.flags.edmHeld;
const taken = () => { if (E() === 'prisoner') return; const k = E(); fl('edmHeld', k); fl('edmHeldAt', S.year);
  if (k === 'navy' && S.flags.navCmdrAt === undefined) fl('navCmdrAt', 9999);
  fl('edmund', 'prisoner'); add({family:-8}); reg('henrietta',-1); later('edmFreed', Math.max(2, (1814 - 1795) * 4 + 1 - S.t)); };
const setPlan = (k, p) => { fl('edmPlan', k); fl('edmPlanP', p); later('edmOut', 3 + Math.floor(Math.random() * 3)); };
const outRoll = () => { if (S.flags.edmOut) return S.flags.edmOut; const k = S.flags.edmPlan, ok = chance(S.flags.edmPlanP || 0);
  fl('edmOut', !ok ? 'held' : k === 'bribe' ? 'parole' : 'free'); if (!ok && k === 'escape') fl('edmBitche');
  if (!ok) { add({family:-6}); if (S.year < 1813 && !F('edmHeldPapers')) { fl('edmHeldPapers'); later('edmHeldHen', 3); later('edmHeldBill', 7); } } else { fl('edmFreeAt', S.year); add({family:8}); }
  return S.flags.edmOut; };
const backToIt = () => fl('edmund', wasIn());
const hisCorps = () => wasIn() === 'navy' ? 'his ship' : 'the regiment';

ev({ id:'edmTaken', weight:3, hen:false, at:'hall', who:() => 'edmund', from:1804, to:1812, title:'A Letter from Verdun',
  cond:() => !F('edmundDead') && !S.peril && S.flags.edmHeld === undefined && ((E() === 'navy' && S.year <= 1808 && navRank() <= 1) || (E() === 'army' && S.year >= 1811)) || (E() === 'prisoner' && !S.flags.edmPlan),
  text:() => { const navy = (E() === 'prisoner' ? wasIn() : E()) === 'navy'; taken();
    return `The letter has no post-mark upon it. It is brought to the door by ${navy ? 'a surgeon of the Navy on his road to Bath, who was nineteen months at Verdun, and has been sent home with his lungs' : 'a Captain of the 43rd upon two crutches, who was a year at Verdun, and has been sent home as past service'}; and he had it out of France, he says, between the sole of his boot and the welt.

“Verdun, upon the Meuse. My dear Father, I am a prisoner, and am well. ${navy ? `I was sent away from the Thetis in a prize, a brig of Nantes with wine, having six hands, and orders for Plymouth; and upon the second night, in a fog off Ushant, we were laid on board by a lugger of St Malo, who had seventy men to my six. I gave up my sword to a man in a red nightcap. They marched us from Brest to this place in six-and-thirty days.` : `I was taken with my picquet, a serjeant and eleven men, in a fog upon the Agueda, by a patrol of chasseurs who came at us from our own side of the river. I gave up my sword to a boy of nineteen, who begged my pardon for it. They marched us through Spain to Bayonne, and from Bayonne to this place, in nine weeks.`}

An officer who gives his parole may lodge in the town, and walk two leagues from the gates; and I have given mine. There are eight hundred English here, who have got up two clubs, a race-course, and a pack of beagles. We answer to our names twice a day before a gendarme, and pay him for the trouble.

The Emperor exchanges nobody. There are Lieutenants here who were taken in the year ’03.

Three things are said in the clubs, and I give them as I had them. The Transport Board will sometimes get a man out, where his friends are loud enough. The Commandant has sold passports for the waters; and his price is named at three hundred pounds, to be lodged with Messrs Perregaux at Paris. And an officer who misses the roll-call three times is shut up in the citadel; where, being under lock and key, he is upon nobody’s parole but the gaoler’s. Four have gone from the citadel since Christmas, of whom two are at Deal, and two in the fortress of Bitche, fifty steps under ground.

I shall not break my word. I tell you only how the word is taken back.

Your affectionate son, Edmund.”

${hh(`Henrietta keeps the ${navy ? 'surgeon' : 'Captain'} to dinner, and asks him what they are given to eat.`, `You send the letter on to Gay Street by express; and it comes back with the corners worn.`)}`; },
  choices:[
    {t:'Go to the Transport Board, and be loud.', note:'£30', go:() => { add({money:-30, standing:-2}); setPlan('exchange', Math.min(0.75, 0.1 + 0.13 * interest()));
      return `The Commissioners for the Transport Service, who have the charge of all prisoners, receive you with great civility, and with a printed paper; by which it appears that there are in England near fifty thousand Frenchmen, and that every proposal for a cartel since the year ’03 has come back from Paris unanswered.

You are loud. ${F('mp') ? 'You name the matter in the lobby to the Secretary of the Admiralty, who writes it upon his cuff. ' : ''}${S.chars.cullerne.r >= 2 ? 'The Earl, upon being asked, sends four lines to a Duke. ' : ''}You leave Edmund’s name with the Board, with a chief clerk at ${wasIn() === 'navy' ? 'the Admiralty' : 'the Horse Guards'}, and with the porter at both; and you are three weeks in town before ${steward()} writes that the hay is down, and nobody to say which rick.`; }},
    {t:'Ask Lieutenant Dubreuil whether he has a friend in Paris.', if:() => F('dubreuilFriend') && K() !== 'dubreuil' && !(S.seen && S.seen.dubreuilAsks !== undefined), go:() => { setPlan('exchange', 0.8); fl('edmByDubreuil'); reg('dubreuil',1,'You asked his help for your son');
      return `He hears you standing, in your own library, with his hat under his arm.

He has, he says, a cousin in the bureau of the Minister of Marine, who owes him nine hundred francs, and his place; and he has never yet asked him for either.

He writes that evening at your desk, three sheets, and a fourth to his mother, which he does not offer to show you. The Transport Board, who read all four, send them over by the Morlaix cartel; and upon the Saturday he comes up from the milestone as usual, and loses at chess in thirty moves.`; }},
    {t:'Lodge three hundred pounds with Messrs Perregaux.', note:'£330', go:() => { add({money:-330}); setPlan('bribe', 0.6);
      return `Tidmarsh, who has never before remitted to an enemy’s country, turns the thing over for a day; and he finds upon the second that it may be done through a house at Hamburg, at ten per cent.

Three hundred pounds are lodged at Paris, to the credit of a Madame Lacoste, who is understood to be a friend of the Commandant’s lady.

You are given no receipt. Tidmarsh enters it in your account under “Foreign,” and rules a line beneath.`; }},
    {t:'Send him eighty guineas, and ask no questions.', note:'£90', go:() => { add({money:-90}); setPlan('escape', 0.55); reg('edmund',1);
      return `Eighty guineas go out to him through the same Messrs Perregaux, as for his lodging and his tailor.

Your letter will be read by the Commandant’s clerk before it is read by Edmund; and you write, therefore, that the money is for his health, and that you recommend to him exercise, stout shoes, and early hours. ${hh(`Henrietta, who has read it over your shoulder, adds below your name that the nights are cold, and that he is to take his flannel.`, `You send a copy to Gay Street, and have it back with one word underlined, which is “shoes”.`)}`; }},
    {t:'Leave him where he is.', go:() => { setPlan('left', 0.22); reg('edmund',-1,'You left him at Verdun');
      return `You write that he is well lodged; that the war cannot last for ever; and that he is to keep his health, and his word.

${hh(`Henrietta puts in a sheet of her own, which she seals before you can read it, and a pair of worsted stockings.`, `A second letter goes to Verdun by the same hand, from Gay Street, and a pair of worsted stockings with it.`)}

The ${wasIn() === 'navy' ? 'surgeon' : 'Captain'} takes the packet as far as the Transport Office, and does not ask what is in it.`; }}
  ]});

const OUT_FREE = () => { const k = S.flags.edmPlan;
  if (k === 'jenner') return `He comes by the Morlaix cartel, in the coat that he was taken in; and he has in his pocket a passport, signed at Paris, which gives no reason.

It is told at Verdun, he says, that the petition lay a month upon the Emperor’s table with forty others; that the Empress took it up, and read out the name at the foot; and that the Emperor said, he could refuse nothing to that man. The Commandant sent for Edmund upon a Tuesday, and asked him whether he were a physician.

${hh(`Henrietta does not come down. She is found afterwards in his room, where she has turned down the bed herself, and is sitting upon it.`, `He goes on to Bath by the same coach; and it is a week before either of them writes.`)}

“I am to call at Berkeley, sir, upon my way anywhere, and thank him. I do not know what one says.”`;
  if (k === 'exchange') return `The Morlaix cartel landed him at Plymouth upon the 3rd, with nine invalids, and a Colonel’s widow; and he is at the Hall four days afterwards, in the coat that he was taken in, which has been turned.

He has been exchanged, man for man, against a ${wasIn() === 'navy' ? 'lieutenant de vaisseau' : 'Captain of the 26th of the Line'} who was upon his parole at Thame. ${F('edmByDubreuil') ? 'The order came down from the Minister of Marine’s own bureau; and the Commandant, he says, read it twice, and looked at the back.' : 'It is the only exchange that has been made out at Verdun this year; and the Commandant, he says, read the order twice, and looked at the back.'}

“They gave me a dinner at the club, sir. Forty sat down to it. I could not eat for looking at them.”`;
  return `A man gets down from the Dover coach at the lodge, in a French carter’s jacket, wooden shoes, and a round hat that was never made in England; and the lodge-keeper’s wife, who has known him since he was breeched, asks him what he wants.

It is Edmund. He missed the roll-call upon three mornings running, and was shut up in the citadel upon the fourth; whence, on a night of rain, he and a Lieutenant of Marines went down sixty feet of wall upon their sheets, and were nineteen nights walking to the coast of Flanders. ${k === 'escape' ? 'Forty of your guineas went to a smuggler of Blankenberg, who put them aboard an English brig off the Scheldt.' : 'His watch went to a smuggler of Blankenberg, who put them aboard an English brig off the Scheldt; and the Lieutenant of Marines gave a note of hand for the rest.'}

“I broke no parole, sir. They took it from me at the citadel gate, with my braces.”`; };
const OUT_PAROLE = () => `He comes by the Morlaix cartel, and by the mail from Plymouth; and he lays his passport upon the hall table before he has taken off his hat.

It is signed by the Commandant, and countersigned at Paris. It permits Monsieur ${S.sur}, prisoner of war, to return into England for the re-establishment of his health; and it binds him, upon his honour, not to serve against France or her allies until he shall have been regularly exchanged.

“I am in perfect health, sir. It says here that I am not, and I have put my name to it.”

Madame Lacoste, he adds, drives out now in a new calash.`;
const OUT_HELD = () => { const k = S.flags.edmPlan, navy = wasIn() === 'navy';
  if (k === 'jenner') return `Dr Jenner’s answer is from Berkeley, in his own hand, and is franked.

He sent the petition by a way that has served him before. It has been acknowledged by a secretary; and since then there has come nothing. He had better fortune, he says, in the year ’05, when there were fewer prisoners, and the Emperor was newer to being asked. He will write again at Christmas.

There is enclosed for Mrs ${S.sur}, who had not asked for it, a printed paper of directions for the vaccine inoculation, and two ivory points, charged.

${hh(`Henrietta puts the points away in her work-box, with his letters.`, `The points go on to Gay Street, with the letter.`)}`;
  if (k === 'escape') return `There is a letter with the Paris post-mark, charged four and tenpence; and it has been opened, and sealed again with a wafer that is not his.

“Bitche. My dear Father, I was out for three nights, and was taken upon the fourth morning in a wood near Longwy, by two gendarmes and a dog, having put my ankle out in coming down the wall. They walked me to this place in irons, a hundred miles.

Bitche is a rock, with a fort upon it. We are lodged inside the rock, fifty steps down, in a vault where the wall runs with water; and there are with me nine Midshipmen, a master of a collier, and a clergyman who is here for debt. The guineas were found in my boot.

I am not sorry that I tried it, and I beg that you will not be.”`;
  if (k === 'bribe') return `There is a letter with the Paris post-mark, charged four and tenpence; and it has been opened, and sealed again with a wafer that is not his.

“Verdun. My dear Father, The Commandant is recalled to Paris, to explain his accounts; and Madame Lacoste is gone in the same carriage. Nobody here can tell me in which of his accounts your three hundred pounds were entered.

The new Commandant is an honest man. He has shut the gaming-table, doubled the roll-calls, and sells nothing.

I am as I was. I have a room over a clock-maker’s, and I teach the Midshipmen their navigation three mornings in the week, ${navy ? 'having some of it left' : 'out of a book, keeping one chapter ahead of them'}.”`;
  if (k === 'exchange') return `Edmund’s letter and the Transport Board’s come by the same post; and his, being the shorter, is read first.

“Verdun. My dear Father, I beg that nobody will be loud upon my account any further. The Commandant has sent for me, and asked who my father was, and whether he were a Duke. I have a room over a clock-maker’s, and have been twice to the races. I am very well.”

The Board writes upon a printed form, with the name put in by a clerk: that the proposal for the exchange of ${navy ? 'Mr' : 'Captain'} ${S.sur} was duly transmitted to the French Government upon the 9th of last month, and that no answer has been returned thereto.`;
  return `There is a letter with the Paris post-mark, charged four and tenpence.

“Verdun. My dear Father, I keep my word, and my health. I have a room over a clock-maker’s, with eleven clocks in the shop beneath, of which no two strike together. I have learnt French enough to quarrel with my landlady, and the flute enough to be asked to leave off.

Two more went from the citadel in March. One of them is at Bitche. Of the other we hear nothing, and so suppose him to be at home.

The stockings fit.”`; };

ev({ id:'edmOut', follow:true, hen:false, at:'hall', who:() => 'edmund', cond:() => E() === 'prisoner' && !F('edmundDead') && !!S.flags.edmPlan,
  cut:() => outRoll() === 'held' ? (S.flags.edmPlan === 'escape' ? 'edmOut-bitche' : 'edmTaken') : 'edmOut',
  get title(){ const o = S.flags.edmOut, k = S.flags.edmPlan; return o === 'held' ? (k === 'escape' ? 'Fifty Steps Down' : 'No Answer from Paris') : o === 'parole' ? 'For the Re-establishment of His Health' : k === 'exchange' ? 'Man for Man' : k === 'jenner' ? 'He Could Refuse Nothing to That Man' : 'The Dover Coach'; },
  text:() => { const o = outRoll(); return o === 'free' ? OUT_FREE() : o === 'parole' ? OUT_PAROLE() : OUT_HELD(); },
  choices:[
    {t:() => `Let him go back to ${hisCorps()}.`, if:() => S.flags.edmOut === 'free', go:() => { backToIt(); befriend(); add({family:-1, standing:2}); reg('edmund',2,'You let him go back, after Verdun');
      return `He is at home for five weeks, in which he eats, and sleeps, and is measured for a coat.

${wasIn() === 'navy' ? `Their Lordships, who have had four officers out of France in as many years, desire to see this one; and he is an hour at the Admiralty, drawing the citadel upon the back of a chart. He is appointed to the Thetis again within the month.` : `The Horse Guards, who have had four officers out of France in as many years, desire to see this one; and he is an hour with the Quartermaster-General’s people, drawing the citadel upon the back of a map. He sails for Lisbon with the next draft.`}

The wooden shoes he leaves behind him. ${hh(`Henrietta has them upon the chimney-piece in her dressing-room.`, `They go to Gay Street by the carrier, by desire.`)}`; }},
    {t:'He has done enough. Keep him.', if:() => S.flags.edmOut === 'free', go:() => { comeHome(wasIn(), 'prisoner'); add({family:4}); reg('henrietta',2); reg('edmund',-1);
      return `“You have been ${inWords(Math.max(1, S.year - S.flags.edmHeldAt))} ${S.year - S.flags.edmHeldAt > 1 ? 'years' : 'year'} out of the world, Edmund, and the world has got on. Stay, and look at the farms.”

He does not answer at once. He has not, he says, been asked what he would like since the morning that he was taken; and he finds that he is out of the way of it.

By the spring he has the home farm. He walks it every evening, to the boundary and back; and ${steward()} has remarked that at the boundary he always stops, and puts a hand upon the gate.`; }},
    {t:'Hold him to his paper, and give him the home farm.', if:() => S.flags.edmOut === 'parole', go:() => { comeHome(wasIn(), 'parole'); add({family:4}); reg('henrietta',2); reg('edmund',-1,'Bought out of Verdun, and bound not to serve');
      return `“You have signed it, and it was bought with my money. You will keep it.”

He keeps it. He will not so much as dine with the Volunteers; and when ${wasIn() === 'navy' ? 'a Captain of the Navy' : 'Colonel Tamworth'}, at the Tamworths’ table, gives “Confusion to the French,” he drinks it in water, as a man not at liberty to wish them any.

He has the home farm by Lady Day, and reads Mr Young in the evenings, with a pencil.`; }},
    {t:'Work for his exchange, that he may serve again.', if:() => S.flags.edmOut === 'parole', go:() => { backToIt(); add({standing:-1, family:-1}); reg('edmund',2,'You got his parole discharged');
      return `It is seven months’ work. The Transport Board must find a Frenchman of his rank who is willing to go home; the Frenchman must be sent over; and Paris must acknowledge to have received him.

One is found at Thame, who has married there, and is not willing. A second, at Wincanton, is willing, and sails in October.

The discharge of Edmund’s parole comes down in a cover from the Board, with ninepence to pay. He reads it through twice, standing; and he has joined ${hisCorps()} before the month is out.`; }},
    {t:() => F('edmBitche') ? 'Send a hundred pounds to the gaoler, for a room above ground.' : 'Send him a hundred pounds for his lodging.', note:'£100', if:() => S.flags.edmOut === 'held', go:() => { add({money:-100, family:1}); reg('edmund',1);
      return F('edmBitche') ? `A hundred pounds go out through Perregaux; and are four months upon the road.

He is moved up into the barrack upon the top of the rock, where there is a window, and from the window, he writes, a view of forty miles of wood, with nothing in it.

He has taken the nine Midshipmen for their navigation, there being no other use to which they can be put; and the clergyman has the collier’s master in Greek.` : `A hundred pounds go out through Perregaux; and are four months upon the road.

He moves from over the clock-maker’s to a first floor in the Rue Mazel, with a stove. He has bought a share in the beagles; and he has been elected, he writes, to the less noisy of the two clubs.`; }},
    {t:'Write to him by every cartel.', if:() => S.flags.edmOut === 'held', go:() => { add({family:1}); reg('edmund',1);
      return `You write upon the first of every month, four sides, of the wheat, the lambing, and who is dead; and the Transport Office sends them over as it has a ship.

They reach him in threes and fours. He answers them in their order, by their dates; so that you learn in August what he thought in May of what you told him at Christmas.

${hh(`Henrietta has moved his pin upon the library map, and has had to buy a second sheet to do it, the first having stopped at the Rhine.`, `At Gay Street, you are told, there is a map of France upon the wall, with one pin in it.`)}`; }}
  ]});

/* The years between, for a man whom nothing has got out. */
ev({ id:'edmHeldHen', follow:true, at:'hall', who:() => 'henrietta', cond:() => E() === 'prisoner' && !F('edmundDead') && S.year < 1814, title:'The Second Sheet of the Map',
  text:() => { if (!F('edmHenGrief')) { fl('edmHenGrief'); add({family:-4}); } return hh(`Henrietta has not dined out since the letter came. She has sent back the Tamworths’ card twice; she has had Edmund’s room shut up, and then opened, and then shut; and the map of Europe lies upon the library table with a second sheet pasted to its edge, and one pin in the second sheet.

Upon Sunday she does not go to church. You find her, when you come back from it, at your own desk, with the Gentleman’s Magazine open before her, and a pen.

“There is a Dr Wickham here, who was a prisoner at Geneva, and a Mr Williams. Dr Jenner wrote to Bonaparte for them, and they were let go. It says that the letter was four lines long.” She turns the book round to you. “${F('vaccinated') ? 'You had your arm scratched upon the green before the whole parish, for that man’s discovery. He may do something for a person who did that.' : 'He is a Gloucestershire apothecary. He cannot be so hard to write to as an Emperor.'}”`, `Henrietta writes from Gay Street, upon black-edged paper; though nobody is dead.

“I have not been to the Rooms since the letter came. I have a map of France upon my wall, with one pin in it, and my landlady’s girl has orders not to dust it.

There is in the Gentleman’s Magazine a Dr Wickham, who was a prisoner, and a Mr Williams. Dr Jenner wrote to Bonaparte for them, and they were let go; and it says that the letter was four lines long. ${F('vaccinated') ? 'You had your arm scratched upon the green before the whole parish, for that man’s discovery. He may do something for a person who did that.' : 'He is a Gloucestershire apothecary, and cannot be so hard to write to as an Emperor.'}

I shall write to him on Monday unless you forbid it. I think that I shall write if you do.”`); },
  choices:[
    {t:'Write to Dr Jenner yourself, and let her put her name beside yours.', go:() => { fl('edmPlan','jenner'); fl('edmPlanP', F('vaccinated') ? 0.45 : 0.3); delete S.flags.edmOut; later('edmOut', 3); add({family:5}); reg('henrietta',2,'You wrote to Dr Jenner with her');
      return `${hh('You write it together, at the one desk.', 'You go down to Bath, and write it together at her table.')} You say who Edmund is, and where; ${F('vaccinated') ? 'that the whole parish of Hatherley was vaccinated upon the green in the year of the smallpox, yourself the first; ' : ''}and that his mother has not dined out since the spring. She strikes out the last, and you put it back.

It goes to Berkeley by the cross post. Dr Jenner’s acknowledgment is two lines long: he will try; and he does not promise.

${hh('Henrietta goes to church upon the Sunday, and to the Tamworths’ upon the Thursday, in the grey silk.', 'Henrietta is seen at the Rooms upon the Thursday, in the grey silk.')}`; }},
    {t:() => hh('Take her to Bath for the winter.', 'Go down to her at Bath.'), note:'£60', go:() => { add({money:-60, family:4}); reg('henrietta',1);
      return `You are six weeks at Bath together, in lodgings in Gay Street, and walk every morning to the Pump Room, where she will not drink the water.

It is no cure. But there is living upon the Parade a Mrs Pargeter, whose husband has been at Verdun since the year ’03; and the two of them sit together in the window for whole afternoons, with their two bundles of letters, reading out to each other the price of butter upon the Meuse.

${hh('She comes home with the map rolled up under her arm, and pins it to the wall of her dressing-room herself.', 'When you come away, the map is still upon her wall; but there is a second pin in it, for Captain Pargeter.')}`; }},
    {t:'Tell her that an Emperor does not read his letters.', go:() => { add({family:-5}); reg('henrietta',-3,'You forbade her to write to Dr Jenner');
      return `${hh('“He has four hundred thousand men in Spain, Henrietta, and does not open letters from apothecaries.”\n\nShe shuts the Magazine.', 'You write to Gay Street that a man who has four hundred thousand soldiers in Spain does not open letters from apothecaries.')}

She writes ${hh('on the Monday, from her dressing-room, and sends the letter to the post by her own maid', 'on the Monday, as she said that she would')}. No answer comes; or if one comes, you are not shown it.`; }}
  ]});

ev({ id:'edmHeldBill', follow:true, hen:false, at:'hall', who:() => 'edmund', cut:() => 'edmTaken', cond:() => E() === 'prisoner' && !F('edmundDead') && S.year < 1814, title:'A Bill upon Perregaux',
  text:() => `Tidmarsh rides out himself, which he has not done since the year of the run, and lays upon your desk a bill for a hundred and forty pounds, drawn at Verdun, accepted by Messrs Perregaux, and come round to him by Hamburg.

The signature is Edmund’s. The letter that should have gone before the bill arrives two days behind it.

“My dear Father, You will have had a bill of mine before this, and will have thought the worst. I have not played. There is a Midshipman here of fifteen, named Cope, a widow’s son out of Devonshire, who lost a hundred and forty pounds at the Commandant’s own table in the Rue Mazel, to a gentleman who lives by it. A prisoner who cannot pay is sent to Bitche. ${F('edmBitche') ? 'I have been in that place, and I would not send a dog there' : 'I have seen them marched off, in irons, at six in the morning'}; and so I put my name to the paper.

If you will not meet it, I shall go ${F('edmBitche') ? 'back ' : ''}in his room, which is the rule here, and no hardship that I have not agreed to. But I had rather you met it.”`,
  choices:[
    {t:'Meet the bill.', note:'£140', go:() => { add({money:-140, family:2}); reg('edmund',2,'You met his bill for the Midshipman');
      return `You write your acceptance across the face of it; and Tidmarsh, who had brought a pen in case, takes it back to Wyvern in his breast.

In the summer there comes a letter in a round hand, from a Mrs Cope, of Bideford; who has a hundred and forty pounds to find, and proposes to find it at five pounds a quarter. With it she sends a pot of clotted cream, which has not travelled.

You answer that the debt is discharged. ${hh(`Henrietta answers at greater length; and the two of them are writing yet.`, `A copy goes to Gay Street; whence, you are told, a letter went to Bideford by the next post.`)}`; }},
    {t:'Meet it, and tell him it is the last.', note:'£140', go:() => { add({money:-140}); reg('edmund',-1);
      return `You meet it; and you write to him that Hatherley has no interest in the gaming-tables of France, and that the next Midshipman must go where his cards send him.

His answer is five months upon the road.

“Sir, I thank you for the money. Mr Cope desires his duty. I shall not trouble you again; and you will permit me to say, that if you were here, you would have done it before I did.”`; }},
    {t:'Let the bill go back.', go:() => { fl('edmBitche'); add({family:-6}); reg('edmund',-3,'You let his bill go back, and he went to Bitche for it'); reg('henrietta',-2,'You let Edmund’s bill go back');
      return `Tidmarsh takes the bill up again by one corner. It goes back to Hamburg, and from Hamburg to Paris, noted for non-acceptance.

Nothing comes from Verdun for seven months. Then there is half a sheet, dated from Bitche.

“Sir, I am here in Mr Cope’s room, as I said. It is fifty steps down, and the wall runs with water. He writes to me upon Sundays. I have nothing further to communicate.”

${hh(`Henrietta reads it standing, and lays it down upon your desk, with the writing uppermost.`, `You send it to Gay Street. It is not returned.`)}`; }}
  ]});

ev({ id:'edmFreed', follow:true, hen:false, at:'hall', who:() => 'edmund', cut:() => 'edmOut', cond:() => E() === 'prisoner' && !F('edmundDead'), title:'The Gates Stand Open',
  text:() => { const n = Math.max(1, S.year - S.flags.edmHeldAt);
    return `Edmund is at the lodge before his letter is.

“They marched us out ${F('edmBitche') ? 'of Bitche' : 'of Verdun'} in January, sir, before the Russians; eleven days, in the snow, to Blois. And at Blois, one morning in April, there was nobody to call our names. We stood in the square until ten. Then a Midshipman said that he supposed it was peace, and we went to breakfast.”

He has been ${inWords(n)} ${n > 1 ? 'years' : 'year'} a prisoner. He has a French coat, a German pipe, and ${F('edmBitche') ? 'a cough, which he has brought up out of the rock' : 'a flute, upon which he is forbidden to play before ten'}; and he walks about the house touching things.

${wasIn() === 'navy' ? `The Navy has paid off four hundred ships since Easter. His name stands in Steel’s List where it stood upon the day that he was taken, ${navRank() ? 'a Lieutenant’s' : 'a Mate’s'}, with those of forty boys above it who were not then at sea.` : `The 52nd is at Hythe. Three men have had the company since he had it; and the last, who bought, would be glad to know what Captain ${S.sur} intends.`}`; },
  choices:[
    {t:'Let him rejoin the regiment.', if:() => wasIn() === 'army', go:() => { backToIt(); add({family:-2}); reg('edmund',2,'You let him rejoin, after Verdun');
      return `He goes down to Hythe in the French coat, his own being with the moths.

The Colonel gives him a company, there being one vacant by a death; and the mess, he writes, has made him tell Verdun upon four nights running, and will not believe in the beagles.

He has not seen a shot fired since the Agueda. He says so, in every letter.`; }},
    {t:'Give him the home farm and the woods.', go:() => { comeHome(wasIn(), 'prisoner'); add({family:5}); reg('edmund',2,'You gave him the home farm when he came out of France'); reg('henrietta',1);
      return `You give him the home farm, and the woods; and he begins by walking round them, which takes him a week.

He will not have a gate shut upon the farm that can be left open. The carters learn it in a day, and the cows in less; and ${steward()}, having twice fetched the heifers out of the barley, lays before you a plan for doubling the hedges.

On the first of every month he is found to have written to Blois, to the widow who lodged him; and he sends her, at Michaelmas, a Berkshire ham.`; }},
    {t:'Let him be, till he has done touching things.', go:() => { comeHome(wasIn(), 'prisoner'); add({family:3}); reg('edmund',1);
      return `You ask nothing of him, and he does nothing; and it is observed in the servants’ hall that he does it out of doors.

He is upon the Down by six. He is seen from the lodge at noon, lying in the grass at the top of Twelve Acres, with his hat over his face; and he walks into Wyvern upon market days, where he stands at the Cross for an hour together, and buys nothing.

In August he asks ${steward()} whose wheat that is under the Down, and what it will fetch.`; }}
  ]});

/* ================= The Navy's 1815 ================= */

const navyMan = () => !F('edmundDead') && ((E() === 'navy' && !F('navPeaceShip')) || (E() === 'home' && S.flags.edmWas === 'navy' && S.flags.edmWasHow !== 'early'));
ev({ id:'navBoney', weight:150, hen:false, at:'hall', who:() => 'edmund', from:1815, to:1815, cond:() => navyMan() && S.season >= 2, title:'Bonaparte in the Sound',
  text:() => E() === 'navy' ? `Edmund writes from Plymouth, upon a sheet that has been wet.

“My dear Father, I have a guard-boat, and Bonaparte. He is in the Bellerophon, two cables from where I sit; Captain Maitland took him off Rochefort upon the 15th, in his cocked hat, with a suite of fifty, and brought him here. My orders are to keep a cable’s length of clear water about the ship, and I keep it with a boat-hook. There were upon the Sound this afternoon, by my own count, nine hundred boats, with a band of music in one of them.

He comes to the gangway at about six. I have been ${inWords(S.year - 1796)} years looking for that man’s ships, and I have now seen him four times, for ten minutes together.

It is said that he is for St Helena, and that the Northumberland is fitting to carry him. If you would see him, come by Friday. I can put you within fifty yards; and the Port Admiral’s lady has not been within two hundred.”

${hh(`Henrietta asks what one wears.`, `By the same post Henrietta writes from Gay Street, that she has taken four places in the Exeter coach, and is that enough.`)}` : `Edmund comes in to breakfast with the Courier in his hand, and does not sit down.

“He is in Plymouth Sound, sir, in the Bellerophon. Maitland took him off Rochefort on the 15th. I was ${inWords(Math.max(2, (S.flags.edmHeldAt || 1814) - 1796))} years looking for that man’s ships, and I never saw him.”

By the newspaper there are a thousand boats about the Bellerophon every afternoon. The watermen of Plymouth ask what they please; the guard-boats keep the crowd off with boat-hooks; and at six o’clock the General shows himself at the gangway.

It is said that he is for St Helena, and that the Northumberland is fitting to carry him.

${hh(`Henrietta asks what one wears.`, `By the same post Henrietta writes from Gay Street, that she has taken four places in the Exeter coach, and is that enough.`)}`,
  choices:[
    {t:'Go down to Plymouth, all of you.', note:'£30', go:() => { add({money:-30, family:4, standing:2}); reg('edmund',1); reg('henrietta',1);
      return `You are three days upon the road, and sleep at Plymouth four in a room. A waterman, who has by his own account made in one week what he made in the whole of the war, asks eleven guineas for the afternoon, and has them.

At six he comes to the gangway: a short man in a green coat with a red collar, white breeches, and a small cocked hat, who stands for ten minutes looking at the shore through a glass. Every hat upon the water comes off. Yours is in your hand before you know that you have moved it${hh('; and Henrietta, who came down meaning to be severe, has got up in the boat to see', '')}.

${E() === 'navy' ? 'Edmund, in the guard-boat, has his back to the ship, as his orders are, and is pushing off a wherry full of clergymen.' : 'Edmund keeps his own on. He has his hands upon his knees, and does not once take his eyes from the gangway.'}

“He is a stout man, sir,” he says, when the boats are pulling in. “I had supposed, from the trouble, that he was tall.”`; }},
    {t:'Go off in your own blue coat, and be let through the guard-boats.', note:'£30', if:() => T('captain'), go:() => { add({money:-30, family:3, standing:3}); reg('edmund',2,'You took him within twenty yards of Bonaparte');
      return `The old coat still meets, with the lowest button left undone. The officer of the guard-boat${E() === 'navy' ? ', who is your son,' : ''} tosses his oars to it; and your waterman, who had asked eleven guineas, pulls through the line for five.

You lie for a quarter of an hour within twenty yards of the Bellerophon’s gangway. He comes to it at six, in a green coat, with a glass; and you observe that he stands with his feet apart, as a man does who has learnt to, and that he looks a long while at the two-deckers in Hamoaze, and hardly at the people.

${E() === 'navy' ? '' : 'Edmund sits in the stern sheets with his hat upon his knee. '}Captain Maitland, coming to the side, sees the coat, and touches his hat to it. The General turns his glass upon you for as long as a man might count five, and then upon a boat-load of ladies from Tavistock.`; }},
    {t:() => E() === 'navy' ? 'Stay, and have it from his letters.' : 'Let Edmund go down, and tell you of it.', go:() => { add({family:1}); reg('edmund',1);
      return E() === 'navy' ? `You write that the wheat is cutting, and that he is to look for you.

His next is dated the 7th of August. “He is gone. They shifted him into the Northumberland off the Start, in a swell, and she sailed the same evening. I had the boat under her quarter, and saw him go up the side: he took it slowly, and did not look behind him. The Sound is empty. A waterman has asked me this morning whether there is any other person coming.”` : `He goes down outside the Exeter mail, and is nine days away.

“I saw him three times, sir. He comes to the gangway and looks at England through a glass, and England looks at him. A man in the next boat to mine had brought his children, and held them up.”

He turns his cup round in the saucer.

“I had thought that I should hate him. I found that I was counting his guns. She is a seventy-four, and an old one; we might have had her in forty minutes.”`; }}
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

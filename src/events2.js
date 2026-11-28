/* The wandering pool: people, with their memories, turning up when they please. */

ev({ id:'crabbeSums', from:1796, to:1802, weight:3, cond:() => !F('crabbeGone') && !F('crabbeWatched') && !F('crabbeSkims'), title:'Mr Crabbe’s Arithmetic',
  text:() => `It rains for three days together; and on the third, having nothing better to do, you take down the estate ledgers, and add them up yourself.

The rents come in upon the left-hand page, and upon the right-hand page there are fewer of them. You go back through three years with a pencil, and find that between the one page and the other three hundred pounds has gone somewhere.

You send for Crabbe, who looks at your pencil marks, and folds his hands.

“The books are like the Book of Revelation, sir. Perfectly clear to those who have the key.”`,
  choices:[
    {t:'Dismiss him.', go:() => { fl('crabbeGone'); add({goodwill:3}); reg('crabbe',-5,'Dismissed over three hundred pounds');
      return `“You will be out of the steward’s house by Saturday.”

He bows. On Saturday a cart carries his boxes to Newbury, with your uncle’s writing desk on the top of them; and before the month is out a brass plate has gone up in Northbrook Street: “Crabbe. Land Agent.”

The new steward is a Scotchman of six-and-twenty, named Lark. On his first morning you hand him the key of the office, and he writes you a receipt for it.`; }},
    {t:'Make him pay it back, by instalments, and keep him.', note:'+£150', go:() => { fl('crabbeWatched'); add({money:150}); reg('crabbe',-2,'Made to refund three hundred pounds');
      return `“You will pay it back. All of it.”

“Certainly, sir.” He takes out of his coat a purse, which he must have had about him when he came in, and counts down a hundred and fifty pounds upon the ledger.

“The rest by Michaelmas.” He bows at the door; looks at you a moment longer than he ever did before; and goes back to his desk.`; }},
    {t:'Let it pass. He knows where everything is.', go:() => { fl('crabbeSkims'); reg('crabbe',2,'You overlooked the three hundred pounds');
      return `You shut the ledger; and Crabbe bows, and carries it away.

At Lady Day there is a new line in the quarter’s accounts, written in his best hand: “Sundries. £4. 10s.” At Midsummer it is there again: “Sundries. £6.”`; }}
  ]});

ev({ id:'thorneLease', from:1795, to:1800, weight:4, cond:() => thorneHolds(), title:'The Widow of Long Barrow',
  text:() => { meet('thorne'); const st = F('crabbeGone') ? 'Lark' : 'Crabbe';
    return `They buried Samuel Thorne on Tuesday; and on Wednesday, at nine o’clock, his widow is in your estate office with the farm book under her arm.

Long Barrow is two hundred and forty acres. She opens the book upon your desk, and turns it to face you: ten years of yields, all in one hand, and that hand not Samuel’s.

“I want the lease in my name, sir. Same rent. Same terms.”

${st}, who is standing behind your chair, bends down to your ear. “A woman tenant, sir. The county will not like it. And there is ${F('crabbeGone') ? 'a man from Hungerford' : 'my nephew'}. A hundred pounds in hand, this morning, for the preference.”

Mrs Thorne, who has good ears, shuts the book and waits.`; },
  choices:[
    {t:'Renew the lease to Abigail Thorne.', go:() => { add({standing:-1, goodwill:3}); reg('thorne',4,'You gave her the lease when the county said a woman could not farm'); if (!F('crabbeGone')) reg('crabbe',-1);
      return `“Draw it in her name.”

She reads every line of the lease before she will sign it; and Mr Oakes is fetched from the vicarage to put the Latin into English, the whole of which she hears out. Then she writes Abigail Thorne at the foot, slowly, and blots it herself.

At harvest Long Barrow threshes out four bushels an acre above any other farm you own. ${F('crabbeGone') ? 'Lark reads you the figure twice.' : 'Crabbe enters the figure in the book, and writes it very small.'}`; }},
    {t:() => F('crabbeGone') ? 'Let it to the Hungerford man.' : 'Let it to Crabbe’s nephew.', note:'+£100', go:() => { fl('nephewFarm'); S.rentAdj *= 0.96; add({money:100, goodwill:-5}); reg('thorne',-5,'You turned her out of Long Barrow'); if (!F('crabbeGone')) reg('crabbe',2,'You gave Long Barrow to his nephew');
      return `She is out by Lady Day, with one wagon, and takes two rooms over the saddler’s shop at Wyvern.

The new man is fond of a market: Newbury on Thursday, Reading on Saturday, and Wyvern between. By July there are docks in the wheat at Long Barrow; and by August there are thistles in the docks.

The hundred pounds stands in the book under Casual Profits.`; }},
    {t:'Renew to her, at twenty pounds a year more.', go:() => { S.rentAdj *= 1.01; add({goodwill:-1}); reg('thorne',1,'You gave her the lease, and raised the rent on a widow');
      return `You name the new rent: twenty pounds more.

She looks at you for as long as it takes; and then she signs.

She pays upon the day, at Lady Day and at Michaelmas, in gold, counting it down upon your desk one coin at a time; and she will not take a chair.`; }}
  ]});

ev({ id:'poacher', from:1796, to:1812, weight:3, title:'A Hare in Evidence',
  text:() => `It is ten o’clock in the justice room, and a dead hare lies upon your table on a sheet of the Mercury.

Mudge stands on one side of it, and Jem Pryor on the other; and Mudge has him still by the collar.

“Cuckoo Copse, sir. First light. Two wires in his pocket. That hare up his frock. And he give me a look.”

“A look?”

“A look, sir.”

You know Pryor. He has five children, and ${F('enclosed') ? 'no cow, since the enclosure' : 'one cow, upon the common'}. Your uncle sent him twice to gaol; and your uncle called him, at other times, the best hand with a wire in Berkshire.

“Well, Pryor?”

“Her run at me, sir.”

The Act lies open before you: five pounds, or three months.`,
  choices:[
    {t:'Three months in Reading gaol.', go:() => { add({standing:1, goodwill:-5}); reg('pryor',-3,'You gave him three months for a hare'); if (!F('gallDead')) reg('gall',1); S.game += 1;
      return `“Three months.”

Mudge walks him to Reading himself. On Saturday Sukey Pryor comes to the vestry with the five children, and asks relief; and the overseer allows her four shillings a week, making, in thirteen weeks, two pounds twelve shillings out of the rates, for one hare.

Pryor comes home. You meet him in Mill Lane, where he stops, takes off his hat, and holds it against his breast until you have gone by. You wish to look round, and do not.`; }},
    {t:'Fine him five pounds, and lend him the five pounds.', note:'£5', go:() => { add({money:-5, goodwill:2}); reg('pryor',1,'You fined him five pounds and paid it yourself');
      return `“Five pounds.” Pryor says nothing, having never in his life held five pounds. “I shall pay it. You will bring me a shilling on the first Saturday of every month.”

His lips move. “Eight year and four month, sir.”

“Yes.”

The first shilling comes to the kitchen door wrapped in a dock leaf, and Mrs Bunce carries it up to you upon a plate.`; }},
    {t:'Dismiss the charge, and give him the hare.', go:() => { add({standing:-2, goodwill:4}); reg('pryor',3,'You let him go, and gave him the hare'); if (!F('gallDead')) reg('gall',-2,'Thinks you soft on poachers'); S.game -= 1;
      return `“A look is not evidence, Mudge. Nobody saw him set the wire. Charge dismissed.” Mudge goes dark red to the ears. “Give him the hare.”

Pryor takes her up, and runs his thumb down her spine.

“Four days I’d hang her, sir. This weather. No more.”

He puts her back inside his frock, and nods to you; and as Mudge will not open the door for him, he opens it himself.`; }}
  ]});

ev({ id:'pryorFriend', from:1798, to:1814, weight:3, cond:() => S.chars.pryor.r >= 2, title:'Something at the Back Door',
  text:() => `Every Friday this winter there has been a brace of pheasants upon the kitchen step, plucked, drawn, and wrapped in a cabbage leaf; and Mrs Bunce has roasted them without asking any questions.

They are your pheasants.

This Friday there is a scrap of paper inside the leaf.

“Sir. Ther is men from Kintbury say they will fire Pococks mill & yr grate barn nex it. Saterday nite. Burn this. A Frend.”`,
  choices:[
    {t:'Sit up in the barn on Saturday with Mudge.', go:() => { add({standing:2, goodwill:3}); reg('pryor',1,'You acted on his warning and named nobody');
      return `You and Mudge lie in the straw from ten o’clock.

Towards one, four men come along the mill leat with a dark lantern and a tar barrel; and you stand up.

“Good evening.”

Nobody runs. One of them observes that it is a mild night for the season, and you agree that it is; upon which they take up the barrel, and carry it back the way they came.

You do not ask Mudge who they were, and he does not tell you.`; }},
    {t:'Lay the letter before the bench and have troops sent.', go:() => { add({standing:3, goodwill:-6}); reg('pryor',-3,'You showed his letter to the magistrates');
      return `You lay the paper before the bench; and on Saturday night a troop of yeomanry lies up behind the mill, and takes four Kintbury men and a tar barrel. Two of the four have seven years’ transportation.

The paper is read aloud in court, down to “A Frend”; and there is nobody in Hatherley who cannot guess.

Jem Pryor’s windows are broken twice before Christmas. On Friday the kitchen step is bare.`; }},
    {t:'Burn it and do nothing.', go:() => { add({money:-280, goodwill:-1});
      return `You burn it, as alehouse talk.

On Saturday night Pocock’s mill burns to the wheel, and the great barn goes with it; and in the barn forty quarters of wheat, and your uncle’s travelling chariot, which had stood there since 1774.

On Friday there is a brace of pheasants upon the kitchen step. They have not been plucked.`; }}
  ]});

ev({ id:'rickFire', follow:true, title:'Fire in the Stackyard',
  text:() => `${hh(`It is Henrietta who shakes you awake`, `It is one of the Johns who shakes you awake`)}; and the bedroom ceiling is orange.

From the window you can see the home stackyard, where two wheat ricks are burning; and as there is no wind, the flames go straight up, and the sparks higher.

You are down the stairs with your boots in your hand. Half Hatherley is at the stackyard rails already; and you count nine buckets, every one of which is standing upon the ground.`,
  choices:[
    {t:'Post a reward of fifty guineas for the incendiary.', note:'£52', go:() => { add({money:-300 - 52, goodwill:-4, standing:1});
      return `You have the bill printed at Wyvern before noon.

“FIFTY GUINEAS REWARD. Whereas some evil-disposed Person or Persons did, on the Night of Tuesday last, wilfully and maliciously set Fire to two Ricks of Wheat in the Stackyard of ${S.name}, Esquire; whoever will discover the Offender or Offenders, so that he or they be brought to Justice, shall on Conviction receive the above Reward. An Accomplice impeaching shall have the same, and Interest made for his Pardon.”

It goes up on the church door, at the Bell, and on the turnpike gate. Fifty guineas would keep a Hatherley family for three years; but a week goes by, and then a month, and the rain brings down the one upon the church door, and nobody has knocked.

It is three hundred pounds of wheat.`; }},
    {t:'Take a bucket and join the line.', go:() => { if (T('captain') && !F('crewGone')) { add({money:-110, goodwill:4, standing:2});
      return `Tarbuck has the Dryads out of their hammocks before you are down the stairs; and there are presently two chains from the horse pond, wet sailcloth over the second rick, and the gunner upon the barn roof with an axe.

“As for a fire in the forehold, sir,” says Tarbuck.

One rick is lost; the other stands, and steams; and the wheat that is gone comes to a hundred and ten pounds.

The village, having come out to see a fire, stays to watch the drill.`; }
      add({money:-300, goodwill:3});
      return `You take up a bucket, and walk to the horse pond. The wheelwright comes after you; then a boy of about ten; and then the rest.

Both ricks are gone by two o’clock, and three hundred pounds of wheat with them; but the line keeps on, and wets the barn thatch until it is light.

At dawn you sit down upon the mounting block in your shirt. A hand holds out a mug of beer. “Here.” You look up to see who it is that has forgotten to call you sir; and he has gone back to his bucket.`; }},
    {t:'Go back to bed. Let it be seen that you do not frighten.', go:() => { add({money:-300, standing:1, goodwill:-2});
      return `You look on for one minute; and then you draw the curtain, and get back into bed. ${hh(`Henrietta stares at you.`, `The John in the doorway stares at you.`)}

In the morning the ricks are two black rings, and three hundred pounds of wheat are gone. Mudge comes in while you are at breakfast, and sets a tinder-box down beside your plate. “Top of the gatepost, sir. Left where I should see it.”

They are talking of it still at Wyvern at the week’s end; and there are some who call it nerve.`; }}
  ]});

ev({ id:'hartoppShearing', from:1797, to:1810, weight:2, title:'Three Days of Tups and Toasts',
  text:() => `Mr Hartopp is holding a sheep-shearing, of three days; for Mr Coke holds one at Holkham, and Hartopp has been to Holkham.

Two hundred farmers are come to it, and a Russian count with an interpreter; and Mr Arthur Young sits upon a hurdle with a notebook on his knee, writing down everything he hears.

Hartopp, who has put on a shepherd’s smock over his coat, stands upon a wagon and speaks for an hour on dung; in the course of which he is twice obliged to stop, and blow his nose.`,
  choices:[
    {t:'Go, listen, and take notes.', go:() => { fl('hartoppFriend'); add({standing:2}); reg('hartopp',2,'You sat through his address on dung');
      return `You hear out the whole hour, and write down the weight of a Swedish turnip.

Hartopp finds you afterwards, walks you to a cart, and loads it with a drill plough “on trial”, six pamphlets, and a bag of turnip seed.

“When you mean to improve, send to me. You shall have my man for nothing.”`; }},
    {t:'Go, and bid for his prize New Leicester tup.', note:'£120', go:() => { fl('hartoppFriend'); S.improve += 1; add({money:-120, standing:3}); reg('hartopp',3,'You paid a hundred and twenty for his tup');
      return `The tup is brought into the ring upon the second day. His name is Bonaparte; and he has already put one shepherd over a hurdle.

You bid a hundred and twenty pounds. Hartopp shakes your hand in the presence of Mr Young, and Mr Young writes it down.

Bonaparte rides home in a cart with a rug over him. Two springs afterwards, when your lambs are squarer and heavier, Hartopp comes to look at them. “Stupider, too,” he says. “That is what you want in a sheep.”`; }},
    {t:'Plead a previous engagement.', go:() => { reg('hartopp',-2,'You missed his sheep-shearing');
      return `You send your regrets.

A month afterwards there comes by post a copy of the Annals of Agriculture, in which Mr Young’s account of the shearing fills nine pages. He gives a list of the gentlemen present; and then: “Some neighbouring proprietors, it is to be regretted, yet slumber.”

The line is underscored in ink, and no letter comes with it.`; }}
  ]});

ev({ id:'vaneBall', from:1796, to:1799, weight:4, cond:() => K() === 'free', title:'The Militia Come to Wyvern',
  text:() => { meet('vane'); return `The Northamptonshire Militia are quartered at Wyvern for the summer, and there are red coats in every shop.

On Thursday there is a ball at the Assembly Rooms, where a Captain Lucius Vane dances with Kitty; dances with her again; and, after Henrietta has laid down her fan, dances with her a third time.

On Friday you make enquiries. He has a good leg, and a coat from a London tailor; and the landlord of the George shows you his slate: “Capt. Vane. £41.”`; },
  choices:[
    {t:'Forbid her to see him.', go:() => { fl('vaneForbidden'); add({family:-4}); reg('kitty',-2,'You forbade her the Captain'); reg('vane',-2); later('elope', 2);
      return `“You will not see Captain Vane again.”

Kitty looks at the carpet. “Yes, Papa.”

She goes up to her room, where there are three volumes from the Newbury circulating library upon the table by her bed; and in the first of them a father forbids it in the fourth chapter.`; }},
    {t:'Ask him to dinner, and have a look at him.', go:() => { reg('kitty',1); later('vaneDines', 1);
      return `You send a card down to the George.

The answer is back within the hour, upon paper that smells of bergamot, and with a flourish under the signature as long as the signature itself.

Mrs Bunce is told eight to dinner. Kitty comes down in the white sash; goes up, and comes down in the blue; and then it is the white again.`; }},
    {t:'Let it run. She is eighteen and it is summer.', go:() => { add({family:2}); reg('kitty',2); later('elope', 2);
      return `You let it run.

There are picnics upon the Down, to every one of which Kitty takes her sketch-book; and when you look into it one evening, the pages are blank.

“Have you asked about the young man’s expectations?” says Henrietta.

“I am told they are considerable.”`; }}
  ]});

ev({ id:'vaneDines', follow:true, cond:() => K() === 'free', title:'Captain Vane Over the Port',
  text:() => `Captain Vane dines. He admires Henrietta’s china; he turns the pages for Kitty at the pianoforte; and before the cloth is drawn he has called you “sir” eleven times.

When the ladies are gone up, he moves the decanter an inch towards you.

“I find myself embarrassed, sir. For the moment only. Two hundred pounds would set me entirely right. I have expectations.” He fills his glass. “An aunt at Kettering. Very old, sir. Very fond of me. And very nearly dead.”`,
  choices:[
    {t:'Lend him the two hundred.', note:'£200', go:() => { add({money:-200}); reg('vane',2,'You lent him two hundred pounds'); later('elope', 2);
      return `You write the draft; and he writes you a note of hand, with a flourish that goes quite across the sheet.

On Saturday you are at Tidmarsh’s bank, where the clerk, catching sight of the note in your pocket-book, tells you that he has seen nine like it in Wyvern alone.

“And the aunt, sir? At Kettering? She has been nearly dead since ’89.”`; }},
    {t:'Ring for his horse.', go:() => { fl('vaneDone'); reg('vane',-4,'You showed him the door over the port'); reg('kitty',-1); if (chance(0.6)) later('duel', 2);
      return `You ring the bell. “Captain Vane’s horse.”

He finishes his glass, taking his time about it; and at the door he turns.

“I had understood, sir, that I was dining with a gentleman.”

Kitty does not speak to you for a week. On the eighth day she remarks that it looks like rain.`; }},
    {t:'Refuse him civilly, and tell Kitty in the morning what he asked.', go:() => { fl('vaneDone'); add({family:3}); reg('kitty',1,'You told her the truth about the Captain, and let her judge');
      return `“I regret I cannot oblige you, Captain.”

At breakfast you tell Kitty what he asked for, and in what manner, as you would tell it to a man. She goes white, and then red, and says nothing whatever.

That night there is a smell of burnt paper upon the upper landing; and the week after, when the Captain bows to her in Wyvern High Street, she walks on.`; }}
  ]});

ev({ id:'elope', follow:true, cond:() => K() === 'free' && !F('vaneDone'), title:'A Ladder at the Window',
  text:() => `${hh(`It is four in the morning when Henrietta wakes you; and as she has a candle in her hand, and has not stayed to put on her cap, you are sitting up before she speaks.

“Kitty’s bed has not been slept in.”`, `It is four in the morning when Mrs Bunce wakes you; and as she has a candle in her hand, and has never before set foot in the room, you are sitting up before she speaks.

“Miss Kitty’s bed has not been slept in, sir.”`)}

As the best bonnet is gone from its box, and the second-best left behind, it is plain that no short journey was intended. A ladder stands against the east wall, to which Mudge holds up his lantern for some time before he will give an opinion.

“That’s the vicarage ladder, sir.”

The keeper of the turnpike on the Oxford road, who was knocked up at midnight and has not forgiven it, is able to say that a curricle and pair went through to the northward at a great rate, with an officer driving, and beside him a lady, who paid the toll herself.

From Hatherley to Gretna Green is three hundred and twenty miles.`,
  choices:[
    {t:'Order the chaise and go after them.', note:'£45', go:() => { fl('vaneDone'); add({money:-45, standing:-3, family:-2}); reg('kitty',-2,'You fetched her back from the Gretna road'); reg('vane',-3); if (chance(0.5)) later('duel', 1);
      return `Four horses, and fresh ones at every stage, have come to forty-five pounds by Towcester; where, at nine in the morning, in the yard of the Saracen’s Head, you find the curricle, and in the curricle, with his boots upon the splash-board, a horse-dealer’s man.

The Captain, it appears, sat down to hazard at the first change of horses, with a view to mending the journey money; and has lost, in the order named, the journey money, the curricle, and Kitty’s pearl ear-rings.

Kitty is in the coffee-room with her bonnet on and her hands in her lap. She gets into your chaise without a word, and without a word she continues as far as Brackley; but from Brackley to Bicester she cries the whole way.`; }},
    {t:'Let them go. She has chosen.', go:() => { fl('kitty','vane'); fl('vaneDone'); add({family:-10, standing:-6}); reg('kitty',1); reg('henrietta',-3,'You let Kitty go to Gretna'); later('vaneDowry', 3);
      return `“She has chosen.”

${hh(`Henrietta sets the candle down upon the floor.`, `Mrs Bunce sets the candle down upon the floor; and you write to Gay Street before it is light.`)}

In a fortnight there comes a letter from Carlisle, of four pages, crossed. They were married at Gretna by a man of the name of Paisley, who weighs twenty stone, and took his fee in brandy; and she is very happy. There is a postscript: “Pray send on my blue pelisse.”

${hh(`Henrietta reads it, and goes upstairs.`, `You send it on to Gay Street, and it comes back in a cover without a line of hers.`)} On Sunday Mrs Tamworth presses your hand in the church porch, and is unable to speak.`; }},
    {t:'Send Mudge after them with fifty guineas for the Captain.', note:'£52', go:() => { fl('vaneDone'); add({money:-52, standing:-2}); reg('kitty',-3,'You bought the Captain off for fifty guineas, and he took it');
      return `You count fifty guineas into a bag, and put Mudge upon the grey.

He comes up with the curricle at Brackley, and holds the bag in at the window. “Fifty guineas, Captain. To drive on by yourself.”

The Captain counts it; and then he hands Kitty down.

She rides home upon the pillion behind Mudge. As she heard the sum named, and saw it counted, she will look neither at you nor at him.`; }}
  ]});

ev({ id:'vaneDowry', follow:true, cond:() => K() === 'vane', title:'A Letter from Mrs Vane',
  text:() => `There is a letter from Kitty, dated from lodgings at Northampton, over a hatter’s.

“The regiment is to move. Lucius has had a reverse.” Then comes the weather; and then the last line: “I am to be confined in the autumn.”

Inside the first sheet there is a second, in the Captain’s hand.

“Sir, No settlement was made upon my wife at our marriage. I am sure you will wish to repair the omission. Eight hundred pounds would answer.”`,
  choices:[
    {t:'Send the eight hundred.', note:'£800', go:() => { add({money:-800, family:3}); reg('kitty',2); reg('vane',2,'You paid eight hundred pounds on demand'); reg('henrietta',1);
      return `You send a draft for eight hundred pounds.

Doncaster races are in September. In October Kitty writes again, upon one side of the paper: everything is very well; Lucius is very well; and the lodgings are very comfortable.

It is of half the length of her last. ${hh(`Henrietta reads it twice, and holds it up to the window.`, `You hold it up to the window, and then send it to Gay Street.`)}`; }},
    {t:'Settle forty pounds a year on Kitty alone, through trustees.', note:'£300', go:() => { fl('kittySettled'); add({money:-300, family:5}); reg('kitty',3,'You settled money on her where the Captain could not reach it'); reg('vane',-3); reg('henrietta',2);
      return `The lawyers are a month about it: forty pounds a year to Kitty, for her sole and separate use, which he can neither touch nor borrow upon; and it comes, with the fees, to three hundred pounds.

The Captain writes four sides, to say that he is wounded, and that he had thought better of you.

Kitty does not write for a month. Then there comes a twist of paper, with nothing in it but a lock of very fine hair. ${hh(`Henrietta puts it in her work-bag.`, `It goes to Gay Street by the next post.`)}`; }},
    {t:'Reply that she made her bed.', go:() => { add({family:-8}); reg('kitty',-4,'You sent nothing when she asked'); reg('henrietta',-2);
      return `You write four lines, and seal them.

${hh(`On Thursday the carrier calls at the back door for a parcel, which proves to be a cushion, directed in Henrietta’s hand to Northampton.

Her mother’s garnets are no longer in the jewel case; nor are twenty pounds of her pin money.`, `On Thursday Mrs Tamworth writes from Bath, that she met Henrietta at the coach office with a parcel for Northampton, of the shape of a cushion.

She did not see the garnets at the Upper Rooms that night.`)}`; }}
  ]});

ev({ id:'duel', follow:true, cond:() => S.chars.vane.met, title:'Pistols on Hatherley Down',
  text:() => `A lieutenant of the Northamptonshire Militia, with very clean gloves and a lisp, is shown into the library.

“I come from Captain Vane, sir. He conceives himself insulted. He requires thatithfaction.”

He has the whole arranged: the old chalk pit upon Hatherley Down; Thursday, at first light; and twelve paces. He will bring the pistols himself.`,
  choices:[
    {t:'Accept.', go:() => { const r = T('soldier') ? 0.1 + Math.random() * 0.4 : Math.random();
      if (r < 0.1) { S.dead = 'duel'; return `It is a grey morning, with larks over the Down.

The lieutenant drops the handkerchief.

The Captain was always a better shot than a paymaster.`; }
      if (r < 0.45) { add({standing:6, family:-3}); reg('vane',-2); reg('henrietta',-1,'You fought a duel and told her afterwards');
        return `It is a grey morning, with larks over the Down; and the lieutenant drops the handkerchief.

Your hand shaking very much, you point the pistol at the chalk pit, and pull.

The Captain sits down, with the ball in his right calf; and they carry him to the George, where he lies a month upon credit.

At the Wyvern assembly three men whom you never met before describe your coolness to you.`; }
      add({standing:3, family:-2});
      return `It is a grey morning, with larks over the Down; and the lieutenant drops the handkerchief.

Both pistols go off, and a lark leaves off singing. The Captain’s ball is in the chalk; and the seconds, after looking some time for yours, are unable to find it.

“Honour is thatithfied,” says the lieutenant; and everybody shakes hands.

The Captain breakfasts at the Bell, upon chops, and the landlord puts it to your account.`; }},
    {t:'Decline. You have a family, and no quarrel worth a funeral.', go:() => { add({standing:-6, family:4}); reg('henrietta',2,'You refused a duel and let the county think what it liked');
      return `You decline in writing.

For a month the officers of the Militia turn their backs upon you in Wyvern; and one morning there is a white feather chalked on your gate.

Then the regiment marches for Ipswich, leaving a bill at every shop in the High Street; and the saddler rubs the feather off your gate with his own hand.`; }},
    {t:'Have the pair of them bound over to keep the peace.', go:() => { add({standing:-3}); reg('vane',-2); if (!F('gallDead')) reg('gall',1);
      return `You are a magistrate; and a challenge is an incitement to a breach of the peace.

${F('gallDead') ? 'A brother justice' : 'Dr Gall'} binds both officers over, in fifty pounds apiece.

The lieutenant signs the recognizance, and does not lisp once while he is about it. He had bought new flints.`; }}
  ]});

ev({ id:'pinchSuit', from:1798, to:1804, weight:3, cond:() => K() === 'free', title:'Mr Pinch of Bristol',
  text:() => { meet('pinch'); return `Mr Lumley Pinch of Bristol, who is fifty-two, and has sixty thousand pounds made in sugar, and is red in the face before dinner and redder after it, is staying a week at Hatherley, having come into Berkshire to buy two things. One is an estate; and what the other may be he tells you over the port.

“A wife, sir. A young lady of family. I would settle three thousand pounds on her father the day the settlements are signed.”

Through the open door he can see Kitty at the pianoforte; and as he spent this morning looking over your rent roll, you are able to observe that he looks at her in the same way.`; },
  choices:[
    {t:'Accept him, on Kitty’s behalf.', note:'+£3,000', go:() => { fl('kitty','pinch'); add({money:3000, family:-12, standing:2}); reg('kitty',-5,'You married her to Mr Pinch for three thousand pounds'); reg('pinch',3); reg('henrietta',-1); later('pinchDies', Math.max(20 + Math.floor(Math.random() * 12), 50 - S.t));
      return `The settlements are signed in the library, for three thousand pounds; and they are married at Hatherley, Kitty in a veil of Brussels lace, which Pinch, having had it valued, is so good as to give the figure of to the clergyman, to the Tamworths, and to the clerk.

She makes every response, and from the first to the last of them her voice does not change.

They leave for Clifton in a new chariot, with a coat of arms upon the door, and the paint of it not quite dry.`; }},
    {t:'Tell him the answer must be Kitty’s.', go:() => { reg('kitty',2,'You left Mr Pinch’s proposal to her'); reg('pinch',-2); add({family:3});
      return `“You must ask her yourself.”

He asks her in the conservatory, upon one knee; and being then unable to get up again, he remains in that posture until the under-gardener can be sent for.

Kitty comes out. “I thanked him, Papa. I said no.”

By the time you go in to him Pinch is at the sideboard, helping himself to ham.

“No matter, sir. I have four other properties on my list.”`; }},
    {t:'Tell him your daughter is not on the market.', go:() => { add({family:2}); reg('kitty',3,'You sent Mr Pinch packing'); reg('pinch',-4,'You told him Kitty was not for sale'); reg('henrietta',-1);
      return `“My daughter is not for sale, sir.”

He goes a darker red, and within the hour his chaise is at the door.

“Three thousand pounds does not call every day,” says Henrietta.

But Kitty, passing behind your chair on her way through the hall, stops and kisses the top of your head; and she has not done that since she was nine.`; }}
  ]});

ev({ id:'pinchDies', follow:true, cond:() => K() === 'pinch', title:'A Death at Clifton',
  text:() => `There is a letter from Kitty, sealed with black wax.

“Mr Pinch died on Tuesday, at the Merchant Venturers’ dinner. They had come to the turtle; and he was carried out before the speeches.

He has left me everything: the house on the Downs, the sixty thousand, and the estate in Jamaica, with three hundred people upon it.

What ought I to do? Pray tell me.”

It is the first time she has asked your advice since her wedding day.`,
  choices:[
    {t:'Advise her to sell Jamaica and come home.', go:() => { fl('kittyWidow'); add({family:10}); reg('kitty',3,'You told her to sell the plantation and come home');
      return `She sells Jamaica, at a loss, to a Liverpool man, who will work it as it was worked before; and this she tells you in her letter, and tells you twice.

She comes home in black, and takes the Dower House, being now very rich, and looking thirty.

${hh(`Within the week she and Henrietta have quarrelled about curtains; and from the garden, where you have gone to be out of it, you can hear that it is Kitty who shouts.`, `Within the week she and Henrietta have quarrelled about curtains by post; and Kitty reads you her answer before she seals it.`)}`; }},
    {t:'Advise her to free the people on it, if the law can be made to let her.', go:() => { fl('kittyWidow'); fl('kittyManumit'); add({family:8, standing:-2}); reg('kitty',4,'You told her to free the people on the Jamaica estate');
      return `It takes her four years, and two attorneys; for the laws of the island are made on purpose to prevent it, and for every person she frees she must pay a bond. Every relation Pinch had writes to her, and then leaves off writing.

It is done at last; and in Bristol they say that Mrs Pinch has lost her wits, and most of her money.

She comes home to the Dower House; and when she speaks to you now, she looks straight at you.`; }},
    {t:'Advise her that she is rich, and to enjoy it.', go:() => { fl('kittyWidow'); add({family:2, standing:2, money:500}); reg('kitty',-1);
      return `She sends you five hundred pounds, “towards the roof”; and she takes a house in Bath, where Mrs Tamworth sees her in the Pump Room, in half-mourning, carrying a very small dog.

Jamaica she keeps. She does not write of it; and the remittances come to her banker every quarter.`; }}
  ]});

ev({ id:'oakes', from:1799, to:1806, weight:3, cond:() => K() === 'free', title:'The Curate Turns His Hat',
  text:() => { meet('oakes'); return `Mr Oakes the curate, who ${F('gallDead') ? 'has done the work of the parish for years' : 'does all Dr Gall’s work'} for forty pounds a year, ${F('gallDead') ? '' : 'Dr Gall keeping the other four hundred, '}and whose coat is green at the seams, asks to see you in the library; where he stands upon the hearthrug, turning his hat round by the brim, until it has gone round nine times.

“I should like to marry Miss Kitty, sir. I have nothing. I thought you should hear it from me.”

You send for Kitty; and she, coming in and seeing who it is, goes red to the neck.

“I have always liked him better than anybody, Papa.”`; },
  choices:[
    {t:'Consent, and promise him the living when it falls vacant.', go:() => { fl('kitty','oakes'); fl('livingPromised'); add({family:8, standing:-2, goodwill:3}); reg('kitty',4,'You let her marry the curate'); reg('oakes',4,'You gave him Kitty, and the promise of the living'); reg('henrietta',-1); if (!F('gallDead')) reg('gall',-2,'Knows you have promised away his living');
      return `“You shall have her. And you shall have the living, when it falls.”

They are married in October, with the whole village in the churchyard. ${F('gallDead') ? 'The rural dean takes the service.' : 'Dr Gall takes the service; and knowing very well what you have promised, he reads every line of it at a walk.'}

They go to live in four rooms over the old schoolhouse; and Henrietta, calling there a week afterwards, finds her daughter upon her knees, blackleading the grate, and singing.`; }},
    {t:'Consent, with a thousand pounds to start them.', note:'£1,000', go:() => { fl('kitty','oakes'); add({money:-1000, family:10, goodwill:3}); reg('kitty',5,'You let her marry the curate, and portioned her'); reg('oakes',3,'You gave him Kitty and a thousand pounds'); reg('henrietta',1);
      return `“You shall have her. And a thousand pounds in the funds.”

Now a thousand pounds in the funds is fifty a year, and fifty with his forty is ninety; and Henrietta, having done this sum, is able to speak of the match in Wyvern as “perfectly prudent”.

They are married in October; and Oakes, who has stammered since he was a boy, makes every response without a stop.`; }},
    {t:'Refuse. Forty pounds a year will not keep her in gloves.', go:() => { add({family:-6}); reg('kitty',-4,'You refused her the curate'); reg('oakes',-2,'You refused him Kitty');
      return `“Forty pounds a year, Mr Oakes. No.”

He bows. “I expected it, sir.” And having a pauper to bury at three o’clock, he goes away to bury him.

Kitty does not cry. But the week following she orders a tin specimen box from Reading, and is out with it upon the Down in all weathers; and the path to the Down, as you are some time in recollecting, goes by the schoolhouse lane.`; }}
  ]});

ev({ id:'dubreuil', from:1804, to:1811, weight:2, title:'A Frenchman at the Milestone',
  text:() => { meet('dubreuil'); return `There are forty French officers living at Wyvern upon their parole, each of whom may walk one mile from the Market Cross along the turnpike, and no further; and among them is a Lieutenant Achille Dubreuil of the Imperial Navy, taken in a frigate off Ushant, who walks his mile every afternoon, stops at the stone, and turns round.

${F('gallDead') ? 'The churchwardens have' : 'Dr Gall has'} told the bench that he is a spy.

A note comes up to the Hall, in a neat upright hand.

“Monsieur, The milestone at the foot of your avenue is one mile from the Cross. I have paced it. Your door is two hundred yards beyond. May I have the honour to call?”`; },
  choices:[
    {t:'Make him free of the house.', go:() => { fl('dubreuilFriend'); add({family:4, standing:-3}); reg('dubreuil',3,'You opened your house to an enemy officer'); reg('henrietta',1); if (!F('gallDead')) reg('gall',-1); if (K() === 'free' && kittyAge() < 34) later('dubreuilAsks', 5);
      return `He comes on Tuesdays and Saturdays, walking up from the milestone with his hat under his arm.

He shows Mrs Bunce how to make an omelette, and, what nobody at Hatherley would have believed, she lets him; and he plays chess with you, and loses in thirty moves, though you suspect that he could win in twenty.

Over the winter he carves a frigate out of mutton bones, of thirty-eight guns, with every gun bored; and this he gives to Henrietta, who sets it upon the drawing-room chimney-piece, in front of the clock.`; }},
    {t:'Receive him once, correctly, and no more.', go:() => { reg('dubreuil',1);
      return `He drinks one dish of tea, and admires the Gainsborough of your uncle; and at the fortieth minute by the clock he stands up and takes his leave.

You watch him down the avenue as far as the milestone.

You had meant to ask him what they really think of Bonaparte, and had a good many other questions ready besides; and it comes to you, when he is out of sight, that you did not ask one.`; }},
    {t:'Reply that the milestone is the limit, and so is your patience.', go:() => { add({standing:1}); reg('dubreuil',-2); if (!F('gallDead')) reg('gall',1);
      return `He does not write again.

Every afternoon he walks out to the milestone, touches it with his cane, and walks back.

On Thursday ${keepsCarriage() ? 'your carriage passes' : 'you pass'} him upon the turnpike; and he takes off his hat, and bows very low, and smiles.`; }}
  ]});

ev({ id:'dubreuilAsks', follow:true, cond:() => K() === 'free' && F('dubreuilFriend'), title:'The Lieutenant Is Exchanged',
  text:() => `Lieutenant Dubreuil comes up from the milestone on a Wednesday, though Wednesday is not his day, and in his best coat.

“I am exchanged, monsieur. For an English lieutenant. I sail from Portsmouth within the month.”

He stands very straight.

“I have a small property near Saint-Malo. An old mother. The half-pay of a lieutenant. I ask for Miss Kitty.”

Kitty is ${kittyAge()}, and has for two years read Racine with him on Tuesdays and Saturdays. She is standing by the window; and it is at you that she is looking.`,
  choices:[
    {t:'Give them your blessing.', go:() => { fl('kitty','dubreuil'); add({family:-3, standing:-7}); reg('kitty',5,'You let her marry a Frenchman in the middle of the war'); reg('dubreuil',4,'You gave him your daughter'); reg('henrietta',-2);
      return `They are married by licence at Wyvern, on a weekday, with the church door shut; and they cross to France in the cartel, among the returning prisoners.

For a month nobody in Berkshire calls.

Her letters come by way of Holland, three months old, and smelling of tar. There is a garden, and there are bees; and in the fourth letter there is a small Achille.

${hh(`Henrietta keeps them in her work-box, where the folds have worn through.`, `You send each one on to Gay Street; and they come back with the folds worn through.`)}`; }},
    {t:'Tell him to come back and ask when there is a peace.', go:() => { fl('dubreuilWaits'); add({family:1}); reg('kitty',1); reg('dubreuil',1,'You told him to ask again in peacetime');
      return `“Come back and ask me when there is a peace.”

He bows over your hand, and over Kitty’s.

“Then I shall pray for peace, monsieur. In the Emperor’s navy that is very nearly treason.”

He leaves the mutton-bone frigate upon the hall table; and as the maids are forbidden to touch it, it is Kitty who dusts it.`; }},
    {t:'Refuse. She is not marrying into the enemy.', go:() => { add({family:-5, standing:1}); reg('kitty',-3,'You refused her the Lieutenant'); reg('dubreuil',-3);
      return `“My daughter does not marry the enemy, sir.”

He bows, and goes down the avenue, and does not look back.

Kitty says nothing that day, nor the day after. But in the evenings, from the room at the top of the house, there is to be heard a voice reading aloud; and what it reads is French.`; }}
  ]});

ev({ id:'dubreuilReturns', from:1814, to:1815, weight:9, cond:() => F('dubreuilWaits') && K() === 'free', title:'A Caller at the Milestone',
  text:() => `A post-chaise, white with dust to the roof, stops at the foot of the avenue; and a man gets down from it, and stands by the milestone with his hat in his hand, and comes no further.

You take the glass to the window. It is Dubreuil, gone grey, with a scar from his eyebrow to his ear.

Peace was proclaimed nine days ago.`,
  choices:[
    {t:'Walk down the drive yourself and bring him in.', go:() => { fl('kitty','dubreuil'); add({family:10, standing:-1}); reg('kitty',5,'You kept your word about the Lieutenant'); reg('dubreuil',5,'You walked down the drive to fetch him');
      return `You walk down the avenue yourself, and at the milestone you give him your arm, and bring him up.

“Leipzig,” he says, touching the scar. “They put the sailors to the guns.”

Kitty is upon the steps. She is ${kittyAge()}, and she has on the old blue pelisse; and you find, at that moment, that the gravel wants raking, and stop some time to look at it.

They are married in the autumn, and the Tamworths send a silver teapot.`; }},
    {t:'Send word that Miss Kitty is not at home.', go:() => { add({family:-10}); reg('kitty',-5,'You turned the Lieutenant away after he had waited six years'); reg('dubreuil',-5);
      return `You send John down the avenue, to say that Miss Kitty is not at home.

The man at the milestone puts on his hat, and the chaise turns in the road; and Kitty, from the top window, watches it as far as the bend.`; }}
  ]});

ev({ id:'gallDies', from:1806, to:1813, weight:3, cond:() => !F('gallDead'), title:'The Living of Hatherley',
  text:() => { meet('oakes'); return `Dr Gall died on Sunday, at his own table, aged seventy-eight, during the second remove; and it is the general opinion that the goose did it. The church is full for the funeral.

The living is four hundred a year, and it is yours to give; and by Wednesday you have three letters.

Lord Cullerne recommends his chaplain, a Mr Spragg. A clerical agent in Holborn offers fourteen hundred pounds for the presentation, and adds that “no enquiries will be made”. ${E() === 'church' ? 'Henrietta has not written; but Edmund is in orders, and she has had the vicarage measured for carpets. ' : ''}The third letter is two lines from Mr Oakes${K() === 'oakes' ? ', your son-in-law' : ''}, who has taken the services for years upon forty pounds, and who asks only whether he is to take them next Sunday.`; },
  choices:[
    {t:'Present Mr Oakes.', go:() => { fl('gallDead'); fl('oakesVicar'); add({goodwill:8, family: K() === 'oakes' ? 8 : 1}); reg('oakes',4,'You gave him the living'); if (K() === 'oakes') reg('kitty',3,'You kept your promise about the living'); reg('cullerne',-1); if (E() === 'church') reg('henrietta',-2,'You gave the living away from Edmund');
      return `Oakes is inducted on a wet Thursday; and the form requiring that he toll the bell himself, he tolls it.

On Friday he raises the new curate to eighty pounds.

On Saturday Dewey’s tithe pig is driven back up the lane to Dewey’s, with a note tied to its ear.`; }},
    {t:'Present Edmund.', if:() => E() === 'church', go:() => { fl('gallDead'); fl('edmundVicar'); add({family:5, goodwill:-2}); reg('henrietta',3,'You put Edmund in the vicarage'); reg('edmund',-1); reg('oakes',-3,'Passed over for the living after all his years'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Edmund reads himself in. His text is from Isaiah, “Here am I; send me”; and he preaches eleven minutes, and looks at you once.

Henrietta has the carpets down by Michaelmas.

Mr Oakes stays on as curate, at forty pounds; and at the church door he shakes Edmund by the hand, and tells him that he is very glad for him, and is.`; }},
    {t:'Present Lord Cullerne’s Mr Spragg.', go:() => { fl('gallDead'); fl('spragg'); add({standing:3, goodwill:-4}); reg('cullerne',4,'You gave his chaplain the living'); reg('oakes',-3,'Passed over for Lord Cullerne’s chaplain'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Mr Spragg arrives with eleven trunks and a pianoforte. He hunts three days a week; and he has the pulpit lowered by a foot, so that he may be seen from the Cullerne pew.

Oakes goes on taking the services, for forty pounds.

At the tithe audit Mr Spragg is weighed upon the corn-factor’s scales, and found to be seventeen stone; and Dr Gall, as the farmers remember, never went above eleven.`; }},
    {t:'Sell the presentation to the agent in Holborn.', note:'+£1,400', go:() => { fl('gallDead'); fl('soldLiving'); add({money:1400, standing:-5, goodwill:-5}); reg('oakes',-3,'You sold the living over his head'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-5,'You sold the living you promised her husband'); add({family:-10}); }
      return `It fetches fourteen hundred pounds. The buyer is a wine merchant of Mark Lane, who wants it for a son not yet ordained; and until the son is ordained, Mr Oakes will serve the cure, for forty pounds.

The Bishop writes; and though the word “simony” is in his letter twice, it is signed “Your faithful brother in Christ”.

At his next visitation the Bishop does not dine at Hatherley.`; }}
  ]});

ev({ id:'vaccine', from:1800, to:1808, weight:2, title:'The Cow-Pox',
  text:() => `There is smallpox at Kintbury, where four children are dead of it, and the rest will carry the marks.

Mr Ferris, a young surgeon from Newbury, calls at the Hall with Dr Jenner’s book under his arm, and proposes to scratch every arm in Hatherley with matter from the cow-pox; a mild thing in itself, he says, but such that a person who has once had it cannot take the smallpox.

“Never, sir. I will stake my practice on it.”

But there is a print pinned up at the Bell, of a doctor with a lancet, whose patients have horns, and one of them an udder; and ${F('gallDead') ? 'the parish clerk has been saying' : 'Dr Gall preached on Sunday'} that man is made in God’s image and a cow is not.`,
  choices:[
    {t:'Pay for the whole parish, and go first yourself, in public.', note:'£60', go:() => { fl('vaccinated'); add({money:-60, goodwill:7, standing:2, family:2}); if (!F('gallDead')) reg('gall',-2,'You were vaccinated on the green in the teeth of his sermon');
      return `You have a kitchen chair carried out to the green; and there, with the parish standing round in a ring, you sit down, and roll up your sleeve, and Ferris scratches your arm.

For a fortnight afterwards, whenever you lift your hat, people look at your forehead.

Two hundred and sixty are done by Midsummer, for sixty pounds. In the autumn the smallpox comes down the valley, and is at Kintbury, and at Inkpen; and nobody in Hatherley takes it.`; }},
    {t:'Pay for any who wish it, and say no more.', note:'£25', go:() => { add({money:-25, goodwill:3});
      return `You tell Ferris that you will pay for any who come, to the amount of twenty-five pounds.

About ninety come, most of them mothers, who knock at the surgery door after dark, with shawls over their heads.

The smallpox reaches Hatherley in the autumn, and three die of it; and it being found that not one of the three had been to Ferris, the print comes down off the wall at the Bell.`; }},
    {t:'Leave physic to Providence.', go:() => { add({goodwill:-5, family:-2}); if (!F('gallDead')) reg('gall',1);
      return `“We shall leave it to Providence, Mr Ferris.”

The smallpox comes in October. Nine die in Hatherley, of whom seven are under ten years old; and the blacksmith’s youngest, who lives, is blind.

Ferris rides past your gate every day on his way to the cottages; and every day, as he passes it, he takes off his hat to the gate.`; }}
  ]});

ev({ id:'manTraps', from:1797, to:1812, weight:2, cond:() => !F('traps'), title:'Mudge Proposes Iron',
  text:() => `Mudge the keeper has counted the pheasants in Cuckoo Copse, and makes them forty fewer than at Michaelmas.

He has a printed list from an ironmonger in Reading, which he puts upon your desk and holds flat with his thumb: man-traps at two guineas, and spring-guns at four. A trap takes a man by the leg; a gun is set upon a wire, and fires at whoever walks into the wire.

“It’s all legal, sir. There’s a board you put up to say they’re set.” He thinks. “Most of ’em can’t read it. But that ent our fault, is it?”`,
  choices:[
    {t:'Set them.', note:'£30', go:() => { fl('traps'); S.game += 2; add({money:-30, goodwill:-7, standing:1}); reg('cullerne',1); reg('pryor',-1); later('trapCatch', 2);
      return `You have six traps and two guns, for thirty pounds; and the ironmonger’s bill is headed “Humane Man-Traps, Without Teeth, For The Nobility and Gentry”.

Mudge sets them on Monday, the board goes up at the stile, and the children are kept out of the copse.

No pheasants go that month. But neither does anybody come up the back drive; and the baker leaves the bread at the lodge.`; }},
    {t:'Put up the board, and set nothing.', go:() => { fl('trapBluff'); add({goodwill:-2}); S.game += 1;
      return `The board goes up at the stile, “MAN TRAPS AND SPRING GUNS ARE SET IN THESE WOODS”, there being nothing whatever in the woods; and for two seasons it answers.

Then one morning Mudge fetches you down to the stile, where somebody has chalked a line under the paint, in careful letters.

“No they ent.”`; }},
    {t:'Refuse. You will not maim a man for a bird.', go:() => { add({goodwill:2}); reg('pryor',1); S.game -= 1;
      return `“I will not take a man’s leg off for a bird, Mudge.”

“No, sir.” He folds the list, and puts it inside his hat.

The pheasants go on going; and when on Sunday there is a roast fowl upon your table, you find that you can eat it with a good appetite.`; }}
  ]});

ev({ id:'trapCatch', follow:true, cond:() => F('traps'), title:'What the Spring-Gun Caught',
  text:() => F('gallDead') ? `The spring-gun in Cuckoo Copse goes off at first light, and Mudge runs to it.

It is not Jem Pryor. It is Tom Gurney, who is eleven, and who had gone in to cut a hazel for a fishing rod; and there are nine shot in his legs.

Mr Ferris has been, and says that the boy will walk, though not as he did.

His mother has not come to the Hall. Nobody has come to the Hall.` : `The spring-gun in Cuckoo Copse goes off at first light, and Mudge runs to it.

It is not Jem Pryor. It is Dr Gall, in his nightcap, with a basket of morels beside him, and twelve shot in his left buttock.

He is carried home upon a hurdle, face down; and when you call at the vicarage, he addresses you through the pillow.

“I have gathered mushrooms on that ground every May for thirty years. It is glebe.”

It is not glebe, the tithe map being quite clear upon the point.`,
  choices:[
    {t:'Take up every trap and gun, today.', go:() => { fl('traps', false); S.game -= 2; add({goodwill:5}); if (!F('gallDead')) reg('gall',1); else add({money:-20});
      return F('gallDead') ? `The traps and the guns go into the pond before noon.

You pay Ferris’s bill; and you send to London for a fishing rod with a brass reel, and have it left at the Gurneys’ door, where for a month it stays in its wrapper.

But one evening the boy is upon the bridge with it, sitting, because he cannot stand long; and as you go by, he lifts one hand an inch off the rail.` : `The traps and the guns go into the pond before noon.

For six Sundays Dr Gall preaches standing upon a cushion; and his text being upon every one of them forgiveness, he looks, while he gives it out, at your pew.`; }},
    {t:() => F('gallDead') ? 'Leave them. The board was plain enough.' : 'Leave them set, and send the Doctor a ham.', go:() => { add({goodwill:-6, money:-3}); if (!F('gallDead')) reg('gall',-3,'You left the spring-guns set after one shot him'); else reg('pryor',-2);
      return F('gallDead') ? `“The board was plain enough.”

Tom Gurney cannot read.

The guns stay, the law being on your side; and Mr Ferris sends his bill to the Gurneys.` : `You send a ham to the vicarage, and the guns stay.

The ham comes back the same afternoon, with a note under the string.

“Dr Gall will gather his mushrooms where he pleases. He has loaded his fowling piece.”

Mudge, who has read it over your shoulder, takes off his hat and scratches his head.`; }},
    {t:'Prosecute Dr Gall for trespass in pursuit of fungus.', if:() => !F('gallDead'), go:() => { add({goodwill:6, standing:-3}); reg('gall',-5,'You had him fined a shilling for trespass, with shot still in him'); reg('pryor',2);
      return `${S.sur} v. Gall is heard at Wyvern, the Doctor giving his evidence standing, and two of the bench having their handkerchiefs out.

Fined one shilling.

The Bell runs dry by ten that night, and Jem Pryor proposes your health; but at the vicarage the blinds are down, and down they remain, every time you pass, for a year.`; }}
  ]});

ev({ id:'enclosure', from:1797, to:1809, weight:3, cond:() => !F('enclosed') && !S.projectsDone.enclosure && !F('encloseRefused'), title:'The Common Question',
  text:() => `Lord Cullerne’s carriage is at the door, and ${F('gallDead') ? 'his man of business' : 'Dr Gall'} gets out of it after him; and before the wine is poured they have a plan of Hatherley Common unrolled upon your library table. It is four hundred acres, of gorse, geese, a pond, and forty cottagers’ cows.

“Hedge it and let it,” says his lordship, “and you add a third to your rental. ${F('gallDead') ? 'The tithe is' : 'The Doctor’s tithe is'} commuted for land. A private Act. A surveyor. Three commissioners. Twelve hundred pounds, and it is done in a year.”

A cow, which you know for Jem Pryor’s, walks past the library window; and stops, and looks in.`,
  choices:[
    {t:'Promote the bill.', note:'£1,200 over three seasons', go:() => { startProject('enclosure'); reg('cullerne',2,'You joined him in enclosing the common'); if (!F('gallDead')) reg('gall',2); reg('pryor',-2,'You moved to enclose the common');
      return `The notice goes up on the church door, “Hatherley Inclosure”, and hangs there three Sundays running, as the Act requires; and since most of the men whom it concerns cannot read it, their children read it to them.

A surveyor comes, with a chain and a boy, and for a week walks the common driving in pegs; and the geese walk behind him in a body, hissing.`; }},
    {t:'Promote it, but set aside sixty acres in allotments for the cottagers.', note:'£1,400 over three seasons', go:() => { fl('allotments'); startProject('enclosure'); reg('cullerne',1); meet('thorne'); reg('thorne',1); reg('pryor',-1,'You enclosed the common, but left him an acre');
      return `“Sixty acres to the cottagers. An acre and a cow-gate to every house that used the common.”

“A premium upon idleness,” says Lord Cullerne; and when he has said it a second time, and you have not moved, he says no more.

The surveyor comes with his chain, and by your order pegs out the sixty acres first, the geese following him. There is no other parish in the county that has left its cottagers a rood.`; }},
    {t:'Refuse. The common stays as it is.', go:() => { fl('encloseRefused'); add({goodwill:6, standing:-2}); reg('cullerne',-3,'You would not enclose with him'); if (!F('gallDead')) reg('gall',-2); reg('pryor',2,'You kept the common open');
      return `“The common stays as it is.”

“You are standing in the way of improvement, sir.”

“I am standing in the way of Pryor’s cow, my lord. I mean to go on standing there.”

They roll up the plan, and the carriage goes down the drive; and the cow, lifting her head, watches it out of the gate without once leaving off chewing.`; }}
  ]});

ev({ id:'commonRiot', follow:true, cond:() => F('enclosed'), title:'Posts in the Night',
  text:() => `The fencers set their posts along the new allotments on Monday.

On Tuesday morning every post is out of the ground, and laid upon the turf in a pattern, of an upright, a beam, and a brace; and from the Down it is plain enough that the pattern is a gallows.

Today there are sixty people, men and women, sitting along the line of the new hedge. Nobody is shouting; and they have brought their dinners in cloths.`,
  choices:[
    {t:'Send for the yeomanry.', go:() => { add({goodwill:-9, standing:2}); reg('pryor',-2,'You brought sabres on to the common'); reg('cullerne',1);
      return `Lord Cullerne’s troop comes up at a trot, forty sabres, and rides the line of the hedge.

Nobody is cut. But an old woman is knocked into a furze bush, and a horse treads upon a boy, and breaks his arm.

The posts go in that week, and the quickset is planted behind them; and upon that side of the parish it does not take, somebody having been at the roots with a spade.`; }},
    {t:'Go down and sit on the turf with them.', go:() => { add({goodwill:5, standing:-3}); reg('pryor',1,'You sat down on the common and heard them out');
      return `You walk down, and sit upon the turf; and somebody passes you bread and an onion.

They talk for three hours: of where each family cut its turf, and whose grandmother’s geese had the pond, and which thorn tree it was that the children were sent to and told to come back from.

“I cannot undo the Act,” you say. “The pond stays open. So does the furze-cutting. You have my word.”

They get up slowly, and let the fencers through.`; }},
    {t:'Wait them out. They cannot sit there for ever.', go:() => { add({goodwill:-3});
      return `They sit for nine days, by turns.

On the tenth day it rains; and the hay wanting to be cut, and there being fourpence a day in the cutting of it, the men go to the hay, and the women go home.

The fencers come back on the eleventh. Nobody has been hurt, and nobody has been spoken to.`; }}
  ]});

/* Henrietta's health. Three complaints, taken in turn; it comes round once in six years at most. */
const BATH = [
  {title:'Henrietta’s Rheumatism', home:'A mustard plaster, at home.',
   x:`The Tamworths went to Bath on Monday; and on Tuesday Henrietta has rheumatism in both shoulders.

Mr Ferris the surgeon is sent for, who looks first at her tongue, and then at you.

“The Bath waters, sir. Six weeks. Taken warm, in company.”

Lodgings in Pulteney Street are this season four guineas a week. Ferris, who has tasted the water, gives it as his opinion that a blacksmith has cooled his irons in it, and that the virtue lies there.`,
   a:`It is three glasses a day in the Pump Room, with a band playing, and a chair to the Assembly every evening; and it comes to three hundred and fifty pounds.

The rheumatism is gone by the second Tuesday.

You lose eleven pounds at whist to a clergyman; and you meet the Tamworths nine times in six weeks, upon every one of which occasions everybody is surprised.`,
   b:`You go to Cheltenham, for a hundred and fifty pounds; the King having taken these waters in ’88, and gone out of his mind in the autumn.

The water is salt, and acts within the hour; so that you do not stray far from the lodgings.

Henrietta says that she is much better, and does not ask to go again.`,
   c:`She has a mustard plaster, morning and night, and bears it for six weeks; and she may be heard bearing it from the library.

The Tamworths write from Bath on Tuesdays and Fridays, and Henrietta reads each letter aloud at breakfast, from “My dearest Henrietta” to the postscript.`,
   why:'You prescribed mustard when she wanted Bath'},
  {title:'Henrietta’s Nerves', home:'Valerian drops, at home.',
   x:`Mrs Loveday is gone to Bath for her nerves; and by Thursday Henrietta cannot bear the stable clock.

The clock is stopped, and Mr Ferris comes, and holds her wrist, and looks at his watch for a full minute.

“I find the pulse hurried, ma’am. I should try Bath.”

He says it again to you in the hall; and it appears that he has a brother there, who lets lodgings in Gay Street.`,
   a:`You are six weeks in Gay Street, at the brother’s, for three hundred and fifty pounds.

Henrietta is carried to the Pump Room at eight, in a chair, and is at the Upper Rooms by seven in the evening, among four hundred people and two bands.

The stable clock is set going upon the day you come home, and she does not remark it.`,
   b:`You are a fortnight at Cheltenham, for a hundred and fifty pounds.

There is a walk under elms to the well, which the whole town walks at seven in the morning, with a glass, and without speaking.

Henrietta’s nerves are the better for it. Yours are not, the lady in the next lodging keeping a harp.`,
   c:`Ferris sends valerian, of which she is to take twenty drops in water at bedtime.

It smells of tom-cat; and the kitchen cat, coming up the back stairs, sits all night at her door.

The clock stays stopped six weeks, and Mudge rings the yard bell for the men’s dinner; and he rings it under her window.`,
   why:'You gave her valerian when she wanted Bath'},
  {title:'Henrietta’s Cough', home:'Horehound and honey, at home.',
   x:`Henrietta has coughed since Michaelmas, and on Sunday she coughed through the Litany and the first lesson.

Mr Ferris lays a napkin upon her back, and puts his ear to it.

“I should not winter her here, sir. The hot well, or the sea.”

Mrs Tamworth writes from the Circus, that she has heard of the cough, and has mentioned it in the Pump Room.`,
   a:`You go to Bath for six weeks, at three hundred and fifty pounds.

Henrietta coughs in the Pump Room; upon which eleven ladies recommend eleven remedies, and she tries nine.

The cough goes in the fourth week; and as nobody can say which of the nine it was that cured it, she brings all nine home in the carriage.`,
   b:`You go to Cheltenham in November, for a hundred and fifty pounds.

Half the lodgings are shut, and the band is a fiddle and a boy with a triangle; and Henrietta takes her glass at the well under an umbrella.

By the tenth day she has left off coughing, and says that the dullness drove it out.`,
   c:`Mrs Bunce boils horehound with honey, of which a spoonful is to be taken every two hours.

Henrietta coughs until Candlemas, and coughs at you across the breakfast table; and then one morning she does not.

Mrs Bunce has the credit of it, and makes a quart for you against the spring.`,
   why:'You kept her at home with a cough'}
];
const bathNow = () => BATH[(S.bathN || 0) % BATH.length];
ev({ id:'bath', from:1796, to:1814, weight:1, repeatGap:24, get title(){ return bathNow().title; },
  cut:() => 'bath-' + ((S.bathN || 0) % BATH.length + 1),
  text:() => bathNow().x,
  choices:[
    {t:'Six weeks at Bath.', note:'£350', go:() => { const p = bathNow(); S.bathN = (S.bathN || 0) + 1; add({money:-350, family:8, standing:2}); reg('henrietta',2); return p.a; }},
    {t:'A fortnight at Cheltenham, which is cheaper.', note:'£150', go:() => { const p = bathNow(); S.bathN = (S.bathN || 0) + 1; add({money:-150, family:3}); return p.b; }},
    {t:() => bathNow().home, go:() => { const p = bathNow(); S.bathN = (S.bathN || 0) + 1; add({family:-5}); reg('henrietta',-2, p.why); return p.c; }}
  ]});

ev({ id:'chinese', from:1802, to:1812, weight:1, title:'The Chinese Taste',
  text:() => `Henrietta has La Belle Assemblée open upon her knee, at an account of the Prince of Wales’s Pavilion at Brighton, with its bamboo, and its lanterns, and its dragons, and its wallpaper of mandarins fishing from bridges; and having read it, she looks round the yellow drawing-room, and then at the yellow sofa.

“I cannot sit in this room another week.”

There is a man in Bond Street who will do the whole for four hundred pounds, and who has sent drawings, with a pagoda for the chimney-piece.`,
  choices:[
    {t:'Let her have her dragons.', note:'£400', go:() => { fl('chineseRoom'); add({money:-400, family:7, standing:3}); reg('henrietta',2,'You gave her the Chinese drawing room');
      return `It takes three months, nine Italian workmen, and four hundred pounds; and when they are gone you count eleven dragons, forty-two mandarins, and a gilt serpent holding back each curtain.

The county comes to look, and stays to tea. Lady Cullerne, standing in the middle of the carpet, says, “Very like the Prince”; and Henrietta has been trying ever since to determine what she meant by it.`; }},
    {t:'Offer new paper only.', note:'£80', go:() => { add({money:-80, family:2});
      return `There is new paper, for eighty pounds; and the mandarins go up all round the room, fishing, with the yellow sofas left standing underneath them.

Henrietta looks at it from the doorway.

“It will do,” she says; in the voice in which she said the same on Tuesday, of the mutton, when it came up cold.`; }},
    {t:'Decline. Yellow was good enough for your uncle.', go:() => { add({family:-4}); reg('henrietta',-1);
      return `“Yellow was good enough for my uncle.”

She closes the magazine.

For a year the Bond Street drawings lie open upon her writing table, and she dusts round them; and she cannot pass the drawing-room door without a sigh, of a strength to be heard in the library with the door shut.`; }}
  ]});

ev({ id:'ballot', from:1796, to:1811, weight:2, repeatGap:20, title:'The Militia Ballot',
  text:() => `The Militia ballot is drawn in the vestry, for nine men to serve five years in the county regiment; and the seventh name out of the hat is Will Tanner, your groom, who has a wife and two children, and without whom the bay mare will let no man into her box.

A balloted man may find a substitute to go for him; and the price of one in Wyvern, which was twenty-five pounds at Christmas, is this week thirty.

Will is in the yard, holding his hat. He has not asked you for anything.`,
  choices:[
    {t:'Buy him a substitute.', note:'£30', go:() => { add({money:-30, goodwill:3});
      return `The substitute is a weaver from Newbury, who has served for three other men already, and deserted twice; and he counts your thirty pounds, and signs with a mark.

Will Tanner says, “Thank you, sir,” and nothing else.

But all that winter your ${ended('hunters') ? 'horses' : 'hunters'} come out of the stable shining, and you might shave in the bay mare’s quarters.`; }},
    {t:'Let the ballot stand. Every man must take his chance.', go:() => { add({goodwill:-3, family:-1});
      return `“Every man must take his chance, Will.”

He marches for Portsmouth on Monday, with a bundle; and on Tuesday his wife goes to the overseer.

The stable is given to a lad from Kintbury, who is afraid of horses; so that by Christmas the bay mare has kicked a hole in the coach-house door, and the grey has learnt to slip her halter.`; }},
    {t:'Subscribe to the parish club that insures every man against the ballot.', note:'£12', go:() => { add({money:-12, goodwill:5});
      return `There is a club at the Bell, into which every labourer pays sixpence, and out of which whoever is drawn has his substitute bought; and the box is this year nine pounds short.

You put in twelve.

Will is bought out, and next year it is the wheelwright’s son; and when the club dines at the Bell at Michaelmas, they send up to ask whether you will take the chair.`; }}
  ]});

ev({ id:'windows', from:1797, to:1809, weight:1, title:'Fifty-Four Windows',
  text:() => `The assessor’s notice has come, and the window tax is raised again.

Hatherley has fifty-four windows, your great-grandfather having built it so; and every one above six is charged.

${F('crabbeGone') ? 'Lark' : 'Crabbe'} has walked round the house with a pencil, and has a list of eleven, of which nine are upon the north front, and two light the back stairs.

“Nobody looks out of them, sir. Only the housemaids.”`,
  choices:[
    {t:'Brick up the eleven.', go:() => { fl('bricked'); add({family:-3, standing:-1});
      return `The mason is two days about the eleven windows; and the saving is nine pounds a year.

The back stairs are now dark at noon, and so is the still room, and so is the maids’ attic.

Henrietta, meeting Sarah upon the stairs at midday with a lit candle, asks what is the price of candles; and it appears that nobody has reckoned it.`; }},
    {t:'Brick them up and paint sham windows on the plaster.', note:'£20', go:() => { fl('bricked'); add({money:-20, family:-1});
      return `The mason bricks them up; and then an Italian comes from Reading with his pots, and for twenty pounds paints eleven windows upon the plaster, with glazing bars, and clouds in the glass, and in the last of them, for a guinea more, a housemaid looking out.

A week later a dragoon officer, riding by the north front, lifts his hat to her; and having ridden on a little, he turns in the saddle, and lifts it again.`; }},
    {t:'Pay. An Englishman is entitled to his daylight.', go:() => { add({standing:1});
      return `“An Englishman is entitled to his daylight. I shall pay for all fifty-four.”

The assessor dips his pen, and writes the receipt, and does not look up.

“They all say that, sir,” he says, and blots it.`; }}
  ]});

ev({ id:'canal', from:1796, to:1805, weight:2, title:'A Staircase for Barges',
  text:() => `Hartopp has a prospectus, and spreads it upon your table.

“The Kennet and Avon Canal. Newbury to Bath, fifty-seven miles. Thames to Severn. Mr Rennie is the engineer. There are to be twenty-nine locks up the hill at Devizes.” He taps the engraving. “A staircase for barges, sir.”

The shares are a hundred and twenty pounds each, and Hartopp has ten of them.

“Somerset coal up. Your wheat down to London for a third of the cart hire. Three years, and it is open. Three at the outside.”`,
  choices:[
    {t:'Take five shares.', note:'£600', go:() => { S.canal = 5; add({money:-600}); reg('hartopp',1);
      return `You take five shares, for six hundred pounds, and receive a certificate with a barge engraved upon it.

Letters now come from the Company at Marlborough, every one of which asks for a further call upon the shares, and encloses a view of an aqueduct.

You ask Hartopp when it will open.

“All great works meet with clay,” he says.`; }},
    {t:'Take one, to be civil.', note:'£120', go:() => { S.canal = 1; add({money:-120});
      return `You take one share, for a hundred and twenty pounds.

It entitles you to attend the general meeting at Marlborough; and you go once, and hear the chairman report that the works proceed with every prospect, and eat a cold collation.`; }},
    {t:'Keep your money on dry land.', go:() => { reg('hartopp',-1);
      return `“I shall keep my money on dry land.”

“You will live to regret it,” says Hartopp, rolling up the prospectus.

And the same evening, at the Tamworths’, before the fish is on the table, he has it out again.`; }}
  ]});

ev({ id:'merino', from:1804, to:1809, weight:2, title:'The King’s Sheep',
  text:() => `The King keeps Spanish sheep at Kew, merinos, got out of Spain by way of Portugal; and this summer a part of the royal flock is to be sold by auction, in a field, under an elm.

Hartopp has been; and he has brought away a lock of the wool in his pocket-book, and lays it upon your sleeve.

“Feel that, sir. Six shillings the pound. A ram made forty-two guineas on Thursday.”

He is sweating; and he puts the wool back between the pages, and shuts the book upon it.`,
  choices:[
    {t:'Buy a small flock.', note:'£420', go:() => { fl('merino'); add({money:-420, standing:2}); reg('hartopp',2,'You went into merinos with him');
      return `You buy twenty ewes and a ram, for four hundred and twenty pounds. They are small, and wrinkled, and stand in the rain with their backs to Berkshire.

The shepherd walks round them twice. “They’ll die of something, sir.”

They do not die; and the first clip, going to Bradford-on-Avon, makes six shillings the pound, when English wool made two.`; }},
    {t:'Buy one ram, to cross on your Berkshire ewes.', note:'£50', go:() => { fl('merinoRam'); add({money:-50}); reg('hartopp',1);
      return `You buy one ram, for fifty pounds. He is of the size of a large dog, and his horns curl twice.

The lambs come in the spring; and though the wool is fine, the butcher, when he has looked at the carcase, shakes his head.

“Ah,” says Hartopp. “But you have not persevered.”`; }},
    {t:'Leave Spanish sheep to the Spaniards.', go:() => { reg('hartopp',-1);
      return `“I shall leave Spanish sheep to the Spaniards.”

“Fortunes are being made, sir.”

He tells you so again at the Bench, and again at the Tamworths’; and every quarter he sends you the sale prices, cut from the Farmer’s Journal.`; }}
  ]});

ev({ id:'allotments', from:1796, to:1808, weight:2, cond:() => !F('enclosed') && !F('allotments') && !F('nephewFarm') && thorneHolds(), title:'A Rood for Every Cottage',
  text:() => { meet('thorne'); return `Mrs Thorne drives over from Long Barrow in her gig, with a bundle of the printed reports of the Society for Bettering the Condition of the Poor upon the seat beside her; and being shown in, she does not sit down.

“A quarter of an acre, sir. A labourer with a quarter of an acre grows potatoes for his family the year round. He stays off the parish. He does not need to steal yours.”

What she wants is forty acres of the Hall Close, to be let in roods, at a fair rent, to any cottager who asks.

Hartopp is with you. “It will give them ideas,” he says.`; },
  choices:[
    {t:'Let the forty acres in roods.', go:() => { fl('gardens'); S.poorMult *= 0.85; add({goodwill:8}); reg('thorne',2,'You let the Hall Close in gardens on her advice'); reg('hartopp',-1);
      return `A hundred and sixty roods are pegged out with hazel, and by Lady Day every one of them is taken.

By the second summer the Hall Close is all potatoes, beans and cabbages; and in the corner of nearly every plot, where it can be of no use to anybody, there is a row of sweet williams.

At Michaelmas the overseer brings his book, by which it appears that the poor rate is down a sixth.

“Coincidence,” says Hartopp.`; }},
    {t:'Try it with ten acres first.', go:() => { S.poorMult *= 0.95; add({goodwill:3}); reg('thorne',1);
      return `You let ten acres, in forty gardens; and as a hundred men want one, they draw lots for them in the vestry. Forty go home to fetch their spades, and sixty go home.

“That is how a half-measure works, sir,” says Mrs Thorne; and gathering up her reports, she drives off.`; }},
    {t:'Decline. A labourer with land is a labourer with opinions.', go:() => { add({goodwill:-2}); reg('thorne',-1); reg('hartopp',1);
      return `“A labourer with land is a labourer with opinions, Mrs Thorne.”

She puts the reports back into her reticule.

“Then they will have their opinions hungry, sir. I never found that improved an opinion.”

Hartopp helps her into the gig, and is not thanked for it.`; }}
  ]});

ev({ id:'battue', from:1798, to:1813, weight:2, title:'Lord Cullerne’s Battue',
  text:() => `There is a card from Cullerne Castle, by which his lordship hopes that you will shoot on the ninth.

At the Castle the guns stand in a row along a ride, each gentleman with a servant behind him to load; and forty beaters having driven the wood towards them, they fire until the wood is empty.

The bag last year was eleven hundred head, besides one beater, a man named Hobbs, in the last drive; for whose funeral Lord Cullerne paid, and is said to have been very decent about it.`,
  choices:[
    {t:'Go, and shoot your best.', note:'£20 in vails', go:() => { add({money:-20, standing:4}); reg('cullerne',2,'You shot at Cullerne and tipped his keepers');
      return `You kill forty-one pheasants, nine hares, and one woodcock, and give twenty pounds to the keepers; and you stand third in the game book, with a duke above you and a bishop below.

Thirty sit down to dinner; and the lady upon your left, it appears, has driven through Hatherley.

“The poor have never been so well off,” she tells you. “One sees it in their faces.”`; }},
    {t:'Go, and fire wide all day.', note:'£20 in vails', go:() => { add({money:-20, standing:1}); reg('cullerne',1);
      return `You fire sixty shots, and hit nothing, and give twenty pounds to the keepers.

“Bad luck,” says Lord Cullerne.

At the last drive the head keeper stops by your stand; and having looked at your gun, and then up at the piece of sky into which you have been firing it, he speaks without moving his face.

“Very humane, sir.”`; }},
    {t:'Send regrets.', go:() => { reg('cullerne',-2,'You would not come to his shoot');
      return `You send your regrets; and your place in the line is given to the brewer from Reading, who kills fourteen pheasants and a spaniel.`; }}
  ]});

ev({ id:'hunt', from:1797, to:1814, weight:2, cond:() => !F('nephewFarm') && S.chars.thorne.met && thorneHolds(), title:'Forty Gentlemen in Pink',
  text:() => `The Craven hounds ran a fox across Long Barrow on Tuesday; and forty gentlemen in scarlet, going after them, went through Mrs Thorne’s winter wheat, two of her gates, and a clamp of mangolds.

On Wednesday a paper comes up to the Hall, in her round hand.

“To the Master of the Craven Hunt. Winter wheat, 4 acres trodden, £11. Two gates, £3 10s. Mangolds, £2 14s. Total £17 4s. A. Thorne.”

The Master is Lord Cullerne’s brother-in-law; and no farmer, since there was a Craven Hunt, has ever sent it a bill.`,
  choices:[
    {t:'Carry her bill to the Master yourself.', go:() => { add({standing:-3, goodwill:3}); reg('thorne',2,'You presented her bill to the Craven Hunt'); reg('cullerne',-1);
      return `You ride over, and put it into the Master’s hand; and he holds it by one corner.

It is paid within the month, out of the poultry fund, with a note regretting that the lady “does not enter into the spirit of the country”.

Mrs Thorne has the note framed, and hangs it in her dairy, over the butter.`; }},
    {t:'Pay her yourself and say it came from the hunt.', note:'£17', go:() => { add({money:-17}); reg('thorne',1);
      return `You take her seventeen pounds four shillings. “From the Hunt, Mrs Thorne.”

She counts it; and then she looks at the notes.

“The Hunt banks at Tidmarsh’s, does it? The same as you?”

But she puts it in her apron. The wheat is sown again where the horses went, and comes up late and thin; so that all summer the line of the run may be seen from the Down.`; }},
    {t:'Tell her that a hunting country must expect to be hunted over.', go:() => { add({standing:2, goodwill:-3}); reg('thorne',-2,'You sided with the hunt over her wheat');
      return `“A hunting country must expect to be hunted over, Mrs Thorne.”

She hears you with her arms folded.

Next season the Craven run a fox to ground upon Long Barrow, and dig; and the fox, when they come to it, has been dead a day, and has shot in it.

Forty gentlemen sit their horses round the hole. Nobody says a name.`; }}
  ]});

ev({ id:'overseer', from:1801, to:1814, weight:2, repeatGap:24, title:'The Overseer’s Accounts',
  text:() => `Mr Nokes the overseer brings the parish books up to the Hall, and lays them open at two pages. The poor rate for 1793 was two shillings in the pound; and for this year it is six.

${F('speen') ? 'The bread scale is pinned inside the cover, and every man with three children is upon it.\n\n' : ''}“The farmers say they won’t pay seven, sir.”

He has two plans. By the first, the men who are without work go round the farms in turn, as roundsmen, the farmer finding sixpence a day and the parish making it up. By the second, there is to be a House of Industry, and no relief given outside it; in which husbands sleep upon one side and wives upon the other.

“It brings the applications down wonderful, sir.”`,
  choices:[
    {t:'Build the House of Industry.', note:'£400', go:() => { fl('workhouse'); S.poorMult *= 0.6; add({money:-400, goodwill:-10, standing:1}); reg('pryor',-1);
      return `It is built of brick, at the end of the Kintbury lane, with the windows set seven feet from the floor.

Last quarter Nokes relieved sixty-one; and this quarter he relieves twenty-three, of whom eleven are in the House.

“And the rest, Mr Nokes?”

“Haven’t applied, sir.”

He enters the difference under Savings.`; }},
    {t:'Try the roundsmen.', go:() => { fl('roundsmen'); S.poorMult *= 0.85; add({goodwill:-5});
      return `At six every morning the men without work stand by the pound, and the farmers walk down the row; and Hartopp, before he will take a man, feels his arm.

Now a roundsman has the same money whether he digs one rod or five, and he therefore digs one; and the farmer, who has him for sixpence, sets him to scare rooks.

The rate comes down fivepence in the pound.`; }},
    {t:'Leave the rates alone, and find winter work on the estate.', note:'£120', go:() => { add({money:-120, goodwill:6});
      return `You set twenty men to scour the ditches and mend the park pale; and when that is done, you have them dig a ha-ha, which the lawn has never wanted.

The wages come to £120, and Nokes reckons the saving to the rates at £80; and having written the two figures side by side, he turns the book towards you.

The ha-ha is finished, and in the first week a cow falls into it.`; }}
  ]});

/* ---- Edmund ----
   One event, many papers. Where he is decides whether it is a letter or a call at the book-room door. The year, the war, his purse,
   his prospects, the settlement and his temper towards you decide which. Every piece has a stable id; a woodcut may be hung on it at
   art/events/<id>. Kinds: news (a letter), talk (he comes in person), ask (he wants money), girl (he wants to marry),
   settle (Long Barrow and his signature), cold (you are not on terms). */
const edmWhere = () => F('edmundVicar') ? 'vicar' : (E() || 'home');
const edmAway = () => ['army', 'navy', 'militia', 'church'].includes(edmWhere());
const edmR = () => S.chars.edmund.r;
const yr = (a, b) => S.year >= a && S.year <= b;
const at = (...w) => w.includes(edmWhere());
const lbAtStake = () => farm('longbarrow') && !F('soldLongBarrow') && !F('lbWord') && (S.mortgage >= 6000 || S.money < 0);
const armyRank = () => F('major') ? 'Major' : S.year < 1800 ? 'Ensign' : S.year < 1807 ? 'Lieutenant' : 'Captain';

const EDMUND = [
  /* ---------- the Army: 52nd Foot ---------- */
  {id:'edmund-chelmsford', kind:'news', w:() => at('army') && yr(1796, 1800), x:() => `“Chelmsford Barracks. My dear Father, It has rained here nineteen days, and we have been reviewed four times since we came, each General telling us that we were a fine body of men, and riding away to his dinner. I can shave in cold water now. Tamworth of ours keeps a jackdaw, which says Damn the French very distinctly; and as it says one thing more, pray do not let my mother ask what.”`},
  {id:'edmund-colour', kind:'news', w:() => at('army') && yr(1796, 1799), x:() => `“Chelmsford. My dear Father, I carried the King’s colour on Thursday for the first time, and found it weigh more than I had been told, there being a wind. An Ensign has four shillings and eightpence a day, of which the mess takes three shillings, and my servant sixpence, and the washerwoman what she can find; so that I have dined twice this week with the Major, to save candles.”`},
  {id:'edmund-ferrol', kind:'news', w:() => at('army') && yr(1800, 1801), x:() => `“At sea, off Ferrol. My dear Father, We were landed on the 25th in boats, and marched up a hill, from which the Generals looked at the town through their glasses for a day; and then we marched down the hill, and were put on board again, and nobody has told us why. I lost a shoe in the surf going in, and found another coming out. It is not a pair.”`},
  {id:'edmund-aboukir', kind:'news', w:() => at('army') && yr(1801, 1802), x:() => `“Camp before Alexandria. My dear Father, We came ashore at Aboukir in the flat boats, the French having guns upon the sandhills, and giving us grape all the way in; and the man upon the next thwart was killed. We beat them again here on the 21st, where Sir Ralph had a ball in the thigh, and is dead of it. I have seen the Pyramids from nine miles off; after which I took the ophthalmia with half the regiment, and saw nothing at all for three weeks. I am mended, and can tell a camel from a field officer at forty yards.”`},
  {id:'edmund-reduced', kind:'news', w:() => at('army') && yr(1802, 1803), x:() => `“Chatham. My dear Father, It is Peace, and the Army is to be reduced. Nine of our subalterns go upon half-pay at Michaelmas, and I am eleventh on the list; and the talk in the mess is all of curacies and coal merchants. Tamworth has sold his jackdaw to a Major of Marines. If I should be the tenth, is there work for me at Hatherley? I can keep a company’s books.”`},
  {id:'edmund-beacon', kind:'news', w:() => at('army') && yr(1803, 1805), x:() => `“Shorncliffe. My dear Father, We sleep in our boots. On Tuesday night the beacon upon the hill was seen alight, and the whole brigade stood to arms, and was three hours on the beach in the dark with sixty rounds a man; until at four a dragoon rode in, to say that it was a lime kiln at Folkestone. Sir John said that we had turned out very well, and might do it again on Thursday.”`},
  {id:'edmund-shorncliffe', kind:'news', w:() => at('army') && yr(1803, 1807), x:() => `“Shorncliffe Camp. My dear Father, Sir John Moore has us out at five. We are to fight in pairs, one man loading while the other fires; and the men are to be told the reason of an order, and nobody flogged without cause; so that Major Pott says the service is ruined. I was never so tired in my life, and I would not be anywhere else. On a clear day we see the French camp at Boulogne from the cliff; and on Monday they had their washing out.”`},
  {id:'edmund-zealand', kind:'news', w:() => at('army') && yr(1807, 1808), x:() => `“Before Copenhagen. My dear Father, We have burnt a good part of this town, and taken the Danish fleet out of the harbour, though the Danes were not at war with us in July. Our picquet is in a gentleman’s garden, among his currant bushes; and his wife sells us cream at the gate every morning, and will not look at us while she does it. I am very well fed.”`},
  {id:'edmund-vimeiro', kind:'news', w:() => at('army') && yr(1808, 1808), x:() => `“Vimeiro, Portugal. My dear Father, I have now seen the French come on, which they do in a column forty men across, with the drums beating. We stood upon the hill in a line two deep, and fired into the head of it; and in a quarter of an hour they were going down the hill again. Sir Arthur called for the dragoons. But then Sir Harry Burrard came ashore, who is the senior, and said that we had done enough for one day.”`},
  {id:'edmund-corunna', kind:'news', w:() => at('army') && yr(1809, 1809), x:() => `“Plymouth. My dear Father, I am alive, and have both my feet. We marched to Corunna in the snow, two hundred and fifty miles, with Marshal Soult a day behind; and at Bembibre men sold their shoes for rum, and lay down in the road, and we left them. Sir John was struck by a round shot on the 16th, and they buried him upon the rampart, in his cloak, before it was light. I have no stockings; and I have eaten part of a mule, of which my mother need not hear.”`},
  {id:'edmund-busaco', kind:'news', w:() => at('army') && yr(1810, 1810), x:() => `“Busaco. My dear Father, We lay down behind the crest in the fog, and heard them climbing, General Craufurd standing alone upon a rock in front; and when their drums were forty yards off he took off his hat, and called us up, and eighteen hundred men stood up out of the heather at once. I saw the faces of their front rank. We did not fire above three rounds. I have a French serjeant’s pipe.”`},
  {id:'edmund-hounds', kind:'news', w:() => at('army') && yr(1810, 1811), x:() => `“Behind the Lines, near Arruda. My dear Father, Lord Wellington keeps a pack of hounds, and hunts three days a week. On Saturday the fox ran straight for the French outposts, whose picquet turned out, and cheered him through, and then cheered us; and the Field Marshal was not pleased with the huntsman. Pray ask Mudge what is given for mange, as two couple have it.”`},
  {id:'edmund-rodrigo', kind:'news', w:() => at('army') && yr(1812, 1812), x:() => `“Ciudad Rodrigo. My dear Father, We went up the lesser breach at seven on the night of the 19th, and in half an hour it was over. General Craufurd was hit at the foot of it, and died on the 24th; and the Division carried him to the breach, and buried him in it. Marching back we came to a pool across the road, and nobody went round. He never let us go round.”`},
  {id:'edmund-badajoz', kind:'news', w:() => at('army') && yr(1811, 1812), x:() => `“Camp before Badajoz. My dear Father, We are in the trenches, and the trenches are full of water. Lord Wellington rode by on Tuesday, in a grey frock and a plain hat, and having looked at our parallel for one minute, said that it would do; and the men speak of it still. My servant Pedro has stolen a pig from the Spaniards, for which I reprimanded him before the company. We dine on it Thursday.”`},
  {id:'edmund-vitoria', kind:'news', w:() => at('army') && yr(1813, 1813), x:() => `“Vitoria. My dear Father, We have taken King Joseph’s whole baggage upon the road east of the town, to the number of two thousand carriages. I saw a private of ours in a lady’s ball dress, carrying a ham, and another boiling his kettle on a fire of muskets; and dollars, being too heavy to carry, are sold tonight at eight for a guinea. I have a silver dish and a French dictionary. Pedro has a monkey.”`},
  {id:'edmund-pyrenees', kind:'news', w:() => at('army') && yr(1813, 1814), x:() => `“St Jean de Luz. My dear Father, We are in France. The country people bring us eggs and fowls, and take dollars for them, his Lordship having last week hanged two men for plundering a farm; and a woman here told my serjeant that she would sooner quarter us than her own army. I am as brown as a saddle. On Sunday I slept in a bed, and did not like it. Tell my mother I wear the flannel.”`},
  {id:'edmund-toulouse', kind:'news', w:() => at('army') && yr(1814, 1814), x:() => `“Toulouse. My dear Father, It is Peace. We fought here on Easter Sunday, and lost four thousand men; and on the Tuesday a Colonel rode in from Paris, with the news that Bonaparte had abdicated four days before the battle, which nobody had told Marshal Soult, or us. The theatre is open, and the people throw white cockades into the boxes. I sat through an opera, not having sat in a chair since Lisbon.”`},
  {id:'edmund-cantonments', kind:'news', w:() => at('army'), x:() => `“My dear Father, There is nothing to tell. We drill, and are inspected, and are moved nine miles to drill again. My company is sixty-one men, of whom eleven can read, and I write the letters of the rest on Sundays. Most begin ‘Dear Mother, this comes hoping’; but one began ‘Dear Mary’, and wanted a deal of altering when the man remembered that his wife’s name was Ann.”`},

  /* ---------- the Navy ---------- */
  {id:'edmund-ushant', kind:'news', w:() => at('navy') && yr(1796, 1799), x:() => `“Off Ushant. My dear Father, We have been eleven weeks upon this station, where every morning we stand in, and count the French in Brest Water, and they count us, and we stand out again. The purser’s goat has eaten the Captain’s signal book, private signals and all, and the Captain wished her shot, until the surgeon reminded him that she gives milk. I am rated master’s mate; and taking the noon sight yesterday, I put the ship within four miles of where she was.”`},
  {id:'edmund-berth', kind:'news', w:() => at('navy') && yr(1796, 1800), x:() => `“At sea. My dear Father, There are eleven of us in the midshipmen’s berth, and one candle. The biscuit is alive, and we tap it upon the table before we bite, when the weevils walk out. The rats are fed upon it in a cask by a boy named Lott, who sells them at threepence, skinned. I have not bought one; but as I have tasted one, do not tell my mother.”`},
  {id:'edmund-copenhagen', kind:'news', w:() => at('navy') && yr(1801, 1802), x:() => `“Yarmouth Roads. My dear Father, We were at Copenhagen on the 2nd, under Lord Nelson. Sir Hyde made the signal to leave off; and they say that his Lordship put the glass to his blind eye, and declared he could not see it. I had three guns on the main deck, and heard nothing for two days after, and there is a singing in my head still. I have passed for Lieutenant. Captain Holloway said, ‘I suppose you will do’; and the gunroom tells me that he never said so much to any man before.”`},
  {id:'edmund-paidoff', kind:'news', w:() => at('navy') && yr(1802, 1803), x:() => `“Portsmouth. My dear Father, The ship is paid off; and there are in this town four hundred Lieutenants upon half-pay, and one coffee-room. I share a lodging over a sail-maker’s with two of them; and having one good coat among the three, we take it in turn to call upon the Port Admiral. Tuesday is my day, and he has not yet been at home on a Tuesday.”`},
  {id:'edmund-toulon', kind:'news', w:() => at('navy') && yr(1803, 1805), x:() => `“Off Toulon. My dear Father, We are two years upon this station this month, and I have not been ashore in fourteen. The beef cask that we opened on Monday was branded 1789; but we have lemons from Sardinia. I dined in the Victory last week, where I could think of nothing to say, and spoke of your turnips; and on Thursday Lord Nelson hailed our boat, and asked how the turnips did.”`},
  {id:'edmund-tetuan', kind:'news', w:() => at('navy') && yr(1805, 1806), x:() => `“Gibraltar. My dear Father, We were not in the battle, having been sent to Tetuan with Admiral Louis on the 3rd of October, for water and bullocks; and we came back with the bullocks on the 30th. The Victory was towed in here under jury masts, with the flag at half mast, and our people stood along the side, and said nothing. I am now the only Lieutenant of my standing who has missed the Nile and Trafalgar both.”`},
  {id:'edmund-skaw', kind:'news', w:() => at('navy') && yr(1806, 1810), x:() => `“Off the Skaw. My dear Father, There are no French at sea. We bring two hundred merchantmen down from the Baltic at four knots, and fire a gun at any that straggle; and the event of the quarter was the wardroom cheese, which went overboard in a gale on the 9th. Captain Holloway has the gout, and keeps his cabin; so that I am First Lieutenant, and work the ship, and find that I can.”`},
  {id:'edmund-prize', kind:'news', w:() => at('navy') && yr(1806, 1810), x:() => `“The Nore. My dear Father, We have taken a Danish brig off Anholt, laden with tar, deals, and nine hundred cheeses, and the Prize Court gives her to us. My share is sixty-one pounds four shillings, less the agent, whose own share is not stated. We kept forty of the cheeses for the gunroom. They are a hard red cheese; and the carpenter says that he could plank a boat with them.”`},
  {id:'edmund-flushing', kind:'news', w:() => at('navy') && yr(1809, 1810), x:() => `“Off Flushing. My dear Father, We carried six hundred soldiers to the island of Walcheren in August, who went ashore singing; and we are now carrying them home, laid in rows upon the gun deck, and shaking. It is a fever out of the ditches. We have buried forty-one over the side between this and the Downs; and as not a man of ours has it, the surgeon puts it down to rum.”`},
  {id:'edmund-sandyhook', kind:'news', w:() => at('navy') && yr(1811, 1812), x:() => `“Halifax. My dear Father, We are sent to the American station. Their frigates carry twenty-four pounders, and are built like seventy-fours; and meeting one off Sandy Hook, she looked at us, and we at her, our orders being to give no offence. Captain Holloway has gone home with his gout, and I am made Commander into the Sparrow sloop, of 18 guns. She makes fourteen inches of water in a watch, and I would not change her for a three-decker.”`},
  {id:'edmund-java', kind:'news', w:() => at('navy') && yr(1813, 1814), x:() => `“Halifax. My dear Father, The American frigates carry twenty-four pounders, and sail two feet to our one, and they have taken the Guerriere and the Java; and the London papers reach us six weeks old, and very angry. We have had nobody to fight these seven years, and our gunnery shows it. The Sparrow makes fourteen inches of water in a watch; and I exercise the great guns every day but Sunday.”`},
  {id:'edmund-shannon', kind:'news', w:() => at('navy') && yr(1813, 1814), x:() => `“Halifax. My dear Father, The Shannon has taken the Chesapeake off Boston, in fifteen minutes, and brought her in here on Sunday during morning service; when somebody opening the church door, and calling it out, the whole congregation got up, and went down to the wharves, and the clergyman with them. Captain Broke was carried ashore with his head laid open. He had drilled his gunners every day for seven years.”`},
  {id:'edmund-middlewatch', kind:'news', w:() => at('navy'), x:() => `“At sea. My dear Father, I write in the middle watch, and there is no news. Yesterday we sighted a sail, which proved a Portuguese, with salt; and the day before, we scrubbed hammocks. I have read the Hatherley letters until they come apart at the folds. Tell me how the wheat looks in Twelve Acres. Tell me who has the mill. Tell me anything that grows.”`},

  /* ---------- the Militia ---------- */
  {id:'edmund-ipswich', kind:'news', w:() => at('militia') && yr(1803, 1808), x:() => `“Ipswich Barracks. My dear Father, I have ninety Berkshire ploughmen in red coats, of whom forty are substitutes at ten guineas a head, and one has been a substitute in three counties. They drill well enough; but they will not keep step past a field of wheat without looking over the hedge, and yesterday the whole company, as it marched by, gave its opinion of a Suffolk ploughing. The opinion was low.”`},
  {id:'edmund-dover', kind:'news', w:() => at('militia') && yr(1804, 1810), x:() => `“Dover Castle. My dear Father, We mount guard upon the Western Heights, and look at France; and on a clear morning I can count the windows in Calais. They are building round towers along this shore, one to every half mile, with a gun on top, which the men call Mr Pitt’s pepper-pots. A tower costs seven thousand pounds; and my company has not had new shoes since Reading.”`},
  {id:'edmund-hythe', kind:'news', w:() => at('militia') && yr(1805, 1809), x:() => `“Hythe. My dear Father, We are lent to the Engineers, to dig. There is to be a canal from here to Rye, thirty feet wide, to keep out the French; it being supposed that a Frenchman who has crossed the Channel will be stopped by a ditch. My ploughmen dig it better than the navigators, and for less, of which the Colonel is very proud; but the men would sooner have the navigators’ wages.”`},
  {id:'edmund-volunteering', kind:'news', w:() => at('militia') && yr(1807, 1812), x:() => `“My dear Father, A serjeant of the Line has been through the barracks with a drum, offering ten guineas to any Militia man who will go into the regulars; and I have lost thirty-four from my company in a week, who go to Portugal. I asked the Colonel for leave to go with them as a volunteer. He said that I was a married man, or ought to be, and that somebody must teach the next thirty-four their left feet.”`},
  {id:'edmund-normancross', kind:'news', w:() => at('militia') && yr(1808, 1813), x:() => `“Norman Cross. My dear Father, We are guarding six thousand French prisoners, in wooden barracks, upon a heath. They hold a market at the gate every forenoon, where they sell ships made of mutton bones, with all their rigging, and straw hats, and one of them lessons in fencing. I have bought my mother a work-box, of a man who was a dragoon at Marengo; and he asked me whether we had any news of peace.”`},
  {id:'edmund-huddersfield', kind:'news', w:() => at('militia') && yr(1812, 1813), x:() => `“Huddersfield. My dear Father, We are marched into Yorkshire, to guard shearing frames against Englishmen. The croppers come at night, with their faces blacked, and break the frames with a great hammer, which they call Enoch. My men are quartered upon the town, at five to a house, and nobody here will sell us an egg. I joined to keep the French out of Kent.”`},
  {id:'edmund-disembodied', kind:'news', w:() => at('militia') && yr(1814, 1815), x:() => `“Reading. My dear Father, It is Peace, and the Regiment is to be disembodied. The men give in their arms on Monday, and have fourteen days’ pay to carry them home, though most have been eleven years from their parishes; and my serjeant asked me what a man does who has been a serjeant, which I could not tell him. I shall be at Hatherley on Thursday week, with one trunk and a dog.”`},
  {id:'edmund-guardroom', kind:'news', w:() => at('militia'), x:() => `“My dear Father, I am Captain of the day, and write from the guard-room. Nothing has happened here since we came. The men mount guard over a magazine, a pump, and a hay-stack; and a private of mine being found asleep on Sunday against the hay-stack, he said in his defence that nobody had ever tried to take it. The Colonel gave him seven days.”`},

  /* ---------- the Church, before he has a living ---------- */
  {id:'edmund-oriel', kind:'news', w:() => at('church') && yr(1796, 1799), x:() => `“Oriel College. My dear Father, Chapel is at seven. I read Greek Testament with Mr Copleston at ten, and Paley at twelve; and dinner is at three, and the port goes round until six. There are men here who have not been seen sober since they matriculated, and who will be Deans. I have learnt one thing thoroughly, and that is how to cross the quadrangle so that the Provost does not see my boots.”`},
  {id:'edmund-ordained', kind:'news', w:() => at('church') && yr(1799, 1801), x:() => `“Oxford. My dear Father, I was ordained Deacon on Sunday, having been examined on the Saturday by the Bishop’s chaplain, who was shaving. He asked me to construe a verse of St John, and said ‘Very well’ before I had done; and then he asked whose son I was, which took longer. There were eleven of us in the Cathedral, of whom two had been in the Army, and one had failed as an attorney.”`},
  {id:'edmund-curacy', kind:'news', w:() => at('church') && yr(1800, 1815), x:() => `“My dear Father, I have a curacy in Hampshire, at fifty pounds a year. There are two churches, seven miles apart, of which I serve one in the morning, and ride to the other after a cold dinner. The Rector lives at Bath for his health, and has nine hundred a year from the tithe. I have seen him once, when he told me that the people here were very attached to short sermons.”`},
  {id:'edmund-burials', kind:'news', w:() => at('church') && yr(1800, 1815) && (PRICES[S.year] || 0) >= 100, x:() => `“My dear Father, I have buried nineteen since Christmas, in a parish of three hundred, and eleven of them children. It is not a fever. Wheat is too dear for a man upon eight shillings to buy any, and they live on tea and potatoes. I wrote to the Rector at Bath, to ask for coals and flour for the poor; and he sent two guineas, and a tract upon frugal cookery.”`},
  {id:'edmund-tithepig', kind:'news', w:() => at('church') && yr(1801, 1815), x:() => `“My dear Father, I am sent by the Rector’s agent to take the tithe, that is to say every tenth cock of hay, and every tenth lamb; and on Tuesday it was a tenth pig, from a litter of nine. The farmer said that there was no tenth, and the Church might have the next. His wife said that I looked hungry, and gave me bacon and eggs. I think I am not the man for this part of the work.”`},
  {id:'edmund-pressed', kind:'news', w:() => at('church') && yr(1803, 1813), x:() => `“My dear Father, We are eleven miles from Portsmouth; and on Saturday night the press gang came through, and took four men out of the Anchor, one of whom I had married on the Thursday. On Sunday his wife sat in the front pew by herself. I had a sermon ready upon contentment; but I read them the hundred and seventh Psalm, about those that go down to the sea, and sent them home.”`},
  {id:'edmund-waiting', kind:'news', w:() => at('church') && yr(1804, 1815), x:() => `“My dear Father, I have now been a curate eleven years, counting from my Deacon’s orders. The Rector is seventy-four, and takes the waters; and upon my asking his agent who has the next presentation, I learnt that it is sold already to a gentleman in the City, for his nephew, who is nine. I keep a pig, a pony, and a school for six farmers’ sons. How does ${F('gallDead') ? 'the new man do at Hatherley' : 'Dr Gall do'}?”`},

  /* ---------- at home, the heir ---------- */
  {id:'edmund-rentbook', kind:'talk', w:() => at('home') && !!tenantOf('church'), x:() => `Edmund comes to the book-room with the rent book under his arm.

“Church Farm has paid the same rent since 1784, sir. Wheat was forty shillings then.”

He has it all worked out upon a sheet of paper, by which he would raise the rent a tenth at Lady Day.`,
    a:() => `“Do it.”

He writes the notice himself, in a fair hand, and himself carries it to Church Farm; and within the hour he is back.

“He gave me a glass of ale, sir. He said he had expected it these five years.”`,
    b:() => `You sit down with him and the book until the candles are changed. He knows what every field bore last year; and you find two mistakes in his sums, and he finds one in yours.

At eleven Henrietta sends to ask whether either of you means to go to bed.`,
    c:() => `“I will think about it.”

“Yes, sir.”

He shuts the book, with the sheet of paper inside it; and there you find it, when you open the book at Michaelmas.`},
  {id:'edmund-gun', kind:'talk', w:() => at('home') && (S.season === 2 || S.season === 3), x:() => `Edmund is cleaning both guns at the hall table.

“Mudge has too many hen pheasants and no ground for them, sir. I would turn the rough end of Cuckoo Copse into cover. Forty rods of furze. One man, three weeks.”

He says this without looking up from the lock.`,
    a:() => `You give him the man, and the three weeks; and he is in the copse every morning in his shirt, with a bill-hook.

In October you walk it up together, and kill eleven brace; and he lets you take the right-hand birds.`,
    b:() => `You walk down to the copse with him, and he shows you where the furze is to go, having it pegged out already.

A cock pheasant gets up between your feet; and neither of you having a gun, you both laugh.`,
    c:() => `“We shall see.”

He finishes the lock, and hangs up the guns. The week following you see the pegs in Cuckoo Copse, and that nobody has pulled them up.`},
  {id:'edmund-gazette', kind:'talk', w:() => at('home') && yr(1798, 1814), x:() => `The Gazette has come, and Edmund reads it standing at the window.

“Tamworth has his company,” he says. “He was below me at school.”

He folds the paper, and asks whether you want him for anything this morning.`,
    a:() => `“Take the grey and ride to Newbury market. Sell the barley as you think fit.”

He sells it at two shillings over what ${steward()} had asked, and tells you the price at dinner; and he does not mention the Gazette.`,
    b:() => `You take him round the home farm, and ask his opinion of every field, and in two of them you take it.

At the last gate he says, “I know what you are doing, sir.”

He holds the gate for you.`,
    c:() => `“Nothing this morning.”

He goes out. You hear him in the yard, speaking to the groom; and he rides towards the Down, and is not back for dinner.`},
  {id:'edmund-drains', kind:'talk', w:() => at('home') && !S.projectsDone.drain, x:() => `Edmund has been at Hartopp’s, and comes back with clay to the knee.

“He has put stone drains under twenty acres, sir. He was sowing on it in February. Kennet Bottom is the same clay.”

He has brought a piece of the clay in his handkerchief, and puts it upon your desk.`,
    a:() => `You let him try five acres at the wet end, and he is out with the men at six.

By spring the five acres are dry enough to walk; and he walks you over them twice.`,
    b:() => `You ride to Hartopp’s with him the next morning, where Hartopp talks for two hours, and Edmund asks him the cost by the rod, and has to ask it three times before he is answered.

“That boy of yours,” says Hartopp, “will be a nuisance to somebody.”`,
    c:() => `“Not this year.”

He takes the clay off your desk. It has left a mark upon the leather, which is there still.`},
  {id:'edmund-thirty', kind:'talk', w:() => at('home') && yr(1806, 1815), x:() => `It is Edmund’s birthday. He is ${19 + S.year - 1795}.

He comes in after dinner, and stands with his back to the fire.

“I should like something that is mine to do, sir. I do not mean an allowance.”`,
    a:() => `You give him the woods: every copse upon the estate, with the felling, the sales, and the planting.

By Friday he has a book ruled for them; and on Monday, with a scribing-iron, and with his own hand, he marks forty oaks in Cuckoo Copse.`,
    b:() => `You talk until one, and tell him what your uncle left, and what he owed; most of which he has guessed.

“I had rather know, sir,” he says upon the stairs.`,
    c:() => `“You have the whole estate to learn.”

“I have learnt it, sir.”

He bows, and goes up; and you hear his door.`},

  /* ---------- farming on his own account ---------- */
  {id:'edmund-swedes', kind:'talk', w:() => at('farmer'), x:() => `Edmund rides up from his farm before breakfast, with a Swede turnip in each coat pocket.

“Eleven pounds, that one, sir. Off the wet end. Your home farm has nothing over seven.”

He puts them both upon the breakfast table, and Henrietta moves the butter.`,
    a:() => `You buy his seed for the home farm, at his price; and he counts the money upon the table.

“I should have asked more,” he says.

He stays to breakfast.`,
    b:() => `You ride back with him. Sophia shows you the dairy, and Edmund the Swedes, the drains, and a bull; and you are there until four.

The bull is the only thing upon the farm that you would not have yourself.`,
    c:() => `“Very fine.”

He looks at you, and puts the turnips back into his pockets.

“Sophia sends her duty, sir.” He does not stay to breakfast.`},
  {id:'edmund-rent', kind:'talk', w:() => at('farmer') && S.season === 2, x:() => `It is Michaelmas; and Edmund comes to the audit with the other tenants, and waits his turn behind Mr Froome, and lays his rent upon the table in notes and silver.

“I would have the same abatement as any other tenant, sir. Or none, as they have.”`,
    a:() => `You give him a receipt as you gave Froome, and take off nothing.

He reads it, and puts it in his hat; and at the audit dinner he sits among the farmers, and carves.`,
    b:() => `You keep him after the others have gone, and go through his year with him, by which it appears that he has cleared forty pounds.

“It is forty more than I had from the Army,” he says. “And I was not shot at.”`,
    c:() => `You push ten pounds back across the table.

“For my grandchildren.”

He leaves it lying there; and on Tuesday Sophia sends for it, with her thanks.`},
  {id:'edmund-christening', kind:'talk', w:() => at('farmer') && yr(1805, 1815), x:() => `Edmund and Sophia have another child, and he comes to ask whether you will stand godfather.

“Sophia would like him called Barnaby, sir. For the estate.”

He turns his hat round in his hands.`,
    a:() => `The child is christened Barnaby, and you give him a silver mug with the name cut upon it.

At the font he roars; which the clergyman says is the Devil going out, and Henrietta says is your uncle coming in.`,
    b:() => `You walk down to see the child, who is asleep; and you are allowed to hold him for as long as he remains so.

It is four minutes, and for the whole of it you stand very still.`,
    c:() => `“Call him what you like. Not Barnaby.”

He is christened Thomas; and in the house Sophia calls him Barnaby.`},
  {id:'edmund-machine', kind:'talk', w:() => at('farmer') && yr(1806, 1815), x:() => `Edmund has been to see a threshing machine at work, and comes up to the Hall with chaff in his hair.

“It did in a day what my four men do in a fortnight, sir. Then I looked at my four men.”

He asks what you would do.`,
    a:() => `“Keep your men.”

He keeps them; and his wheat is at market in March with everybody else’s, and he does not complain of the price.`,
    b:() => `You and he reckon it together; by which it appears that the machine would save him thirty pounds a winter, and that the four families, if they came upon the rate, would cost the parish thirty-five.

“And I pay the rate,” says Edmund; and he tears up the paper.`,
    c:() => `“It is your farm.”

“Yes, sir. That is why I asked.”

He goes home, and you do not hear which he chose.`},

  /* ---------- vicar of the parish ---------- */
  {id:'edmund-sermon', kind:'talk', w:() => at('vicar'), x:() => `Edmund has the sermon for Sunday in his pocket, and reads it to you in the book-room.

It is upon the labourer and his hire, and is nine minutes long; and you are in it, though not by name.

“I had rather you heard it here first, sir.”`,
    a:() => `“Preach it.”

He preaches it; and you sit in the Hall pew with your face to the pulpit, while Hartopp turns round twice to look at you.

In the churchyard four labourers take off their hats to the Vicar, as they have never done before.`,
    b:() => `You argue it with him until midnight, when he gives up one sentence, and you give up two.

On Sunday, coming to the place, he looks at you; and you nod.`,
    c:() => `“I should leave out the part about the hire.”

He preaches upon the Prodigal Son, and reads it flat and fast; and Henrietta asks in the carriage what you said to him.`},
  {id:'edmund-tithe', kind:'talk', w:() => at('vicar'), x:() => `Edmund has the tithe book that Dr Gall kept, and lays it open upon your desk.

“He took a tenth of the cottagers’ potatoes, sir. And their eggs. I should like to stop at the corn and the hay.”

It would cost the living thirty pounds a year; and the living is in your gift.`,
    a:() => `“They are your tithes.”

He lets the potatoes go; and on the next Sunday there are eleven more in church, one of whom brings him a basket of eggs.

He sends it back, with a shilling.`,
    b:() => `You go through Gall’s book together, and find that the Doctor had tithed a widow’s bees.

“Honey, two pounds,” reads Edmund. “Wax, a quarter.” He shuts the book.`,
    c:() => `“The next vicar will not thank you.”

He takes the tithe as Gall took it; and at Christmas he pays the potatoes back out of his own pocket, and thinks that you do not know.`},
  {id:'edmund-vestry', kind:'talk', w:() => at('vicar') && yr(1800, 1815), x:() => `Edmund has been in the chair at the vestry, and comes up to the Hall afterwards without his hat.

“They voted to cut the allowance to the old people, sir. Froome moved it. I had no vote, only the chair.”

He walks up and down your carpet.`,
    a:() => `You call a second vestry, and attend it; and having six votes for your rating, you put the allowance back.

Froome says that the Hall and the Vicarage are become one house; and Edmund says that he hopes so.`,
    b:() => `He stays to dinner, and is still angry at the cheese.

“I had it easier at ${E() === 'church' ? 'the curacy' : 'school'},” he says. “Nobody there was a relation.”

Henrietta laughs; and then he does.`,
    c:() => `“The vestry is the ratepayers’ business.”

“And the old people are mine, sir.”

He bows, and goes down the drive bareheaded, in the rain.`},

  /* ---------- he asks for money ---------- */
  {id:'edmund-kit', kind:'ask', sum:80, w:() => at('army') && yr(1809, 1809), x:() => `“Plymouth. My dear Father, Everything I had is in a ditch in Galicia: two coats, my bed, my saddle, and the horse under it. The Regiment is to go out again in the summer; and as a Captain cannot go in a borrowed coat, I must ask you for eighty pounds, which I had rather ask for than owe to the paymaster.”`},
  {id:'edmund-mess', kind:'ask', sum:60, w:() => at('army'), x:() => `“My dear Father, I am obliged to trouble you. The Colonel has ordered a new pattern of jacket for the officers, with silver lace, being the third pattern since I joined; and there is also the mess plate, to which every officer subscribes, and a horse that I backed at Canterbury. Sixty pounds would clear me. The horse is the smallest part of it, and I mention the horse because you will hear of it from Tamworth’s father.”`},
  {id:'edmund-outfit', kind:'ask', sum:70, w:() => at('navy') && yr(1801, 1804), x:() => `“Portsmouth. My dear Father, I have my commission as Lieutenant, and no coat to wear it in. A Lieutenant must have a full dress and an undress coat, a sword, a sextant of his own, and a share in the gunroom wine; and the tailor on the Hard will not trust a midshipman. Seventy pounds would rig me, and I will pay it out of the first prize.”`},
  {id:'edmund-agent', kind:'ask', sum:60, w:() => at('navy') && yr(1805, 1814), x:() => `“My dear Father, My prize agent has broke, and is gone to Boulogne with two hundred and ten pounds of mine. I owe the gunroom steward, and the tailor, and have nothing coming in until the quarter. Sixty pounds would keep me from asking the Captain; and I had sooner ask you.”`},
  {id:'edmund-plate', kind:'ask', sum:80, w:() => at('militia'), x:() => `“My dear Father, The mess has voted itself a silver tureen; and the Colonel having proposed it, nobody spoke against. My share is eleven guineas. There is also the band, which the officers pay for, and the regimental ball, and my serjeant’s wife, who has been brought to bed of twins. Eighty pounds would cover all; and the twins are the cheapest item.”`},
  {id:'edmund-pony', kind:'ask', sum:45, w:() => at('church') && yr(1800, 1815), x:() => `“My dear Father, My pony is dead. She fell in the lane on Sunday, between the two churches, and I read evening prayer an hour late, in a wet surplice. I cannot serve both parishes on foot, and a sound cob is thirty pounds here; and I owe besides the bookseller at Winchester. It is forty-five pounds in all. A curate’s year is fifty.”`},
  {id:'edmund-hunter', kind:'ask', sum:70, w:() => at('home'), x:() => `Edmund finds you in the stable yard.

“Loveday has a brown gelding to sell, sir. Six years old. He asks seventy guineas and would take pounds.”

He has ridden the same cob since he was sixteen, and does not say so.`},
  {id:'edmund-ram', kind:'ask', sum:60, w:() => at('farmer'), x:() => `Edmund is back from Hartopp’s shearing.

“There is a New Leicester shearling ram to be let for the season, sir. Sixty pounds. I have forty. He would put four pounds of wool on every lamb I breed.”

He names the twenty that he wants, and the day upon which he will repay it.`},
  {id:'edmund-chancel', kind:'ask', sum:90, w:() => at('vicar'), x:() => `Edmund takes you into the chancel after service, and points up; where there is daylight through the roof over the altar, and a starling going in by it.

“The chancel is the Rector’s to mend, sir. I am the Rector. The plumber says ninety pounds. The living is worth a hundred and eighty.”`},

  /* ---------- he wishes to marry ---------- */
  {id:'edmund-miss-army', kind:'girl', lady:'Miss Charlotte Pott', father:'Major Pott', w:() => at('army') && yr(1803, 1814) && !F('edmundMarried'), x:() => `“My dear Father, I write upon a subject I have not opened before. Major Pott of ours has a daughter, Miss Charlotte Pott, who is twenty-two, and has followed the Regiment since she was nine, and can tell a good biscuit from a bad one in the dark. She has no fortune. I have asked her, and she has said yes if you do; and I await your answer with more fear than I ever felt of the French.”`},
  {id:'edmund-miss-navy', kind:'girl', lady:'Miss Anne Hallett', father:'Mr Hallett', w:() => at('navy') && yr(1802, 1814) && !F('edmundMarried'), x:() => `“My dear Father, Our purser, Mr Hallett, has a sister at Gosport, who keeps house for him. Miss Anne Hallett is twenty-four, and has these six years waited upon the Hard for the same ship to come in, to see her brother; and lately I find that I am looked for too. She has five hundred pounds in the Navy Five per Cents. I have asked her; and she says that a sailor’s wife sees her husband one month in twelve, and that she has had practice.”`},
  {id:'edmund-miss-militia', kind:'girl', lady:'Miss Mary Finnis', father:'Mr Finnis', w:() => at('militia') && !F('edmundMarried'), x:() => `“My dear Father, I am to tell you of Miss Mary Finnis, of Dover, whose father is a brewer, and supplies the garrison. I was sent to complain of the beer, and stayed to tea; and I have since complained of the beer upon eleven occasions. Mr Finnis says that he will give four thousand pounds with her; but he would like to hear it from you that a brewer’s daughter will be received at Hatherley.”`},
  {id:'edmund-miss-church', kind:'girl', lady:'Miss Jane Lyford', father:'Mr Lyford', w:() => at('church') && yr(1801, 1815) && !F('edmundMarried'), x:() => `“My dear Father, The surgeon of this place, Mr Lyford, has five daughters, of whom the second is Miss Jane. She teaches in my Sunday school, and has twice mended my surplice without being asked. We could not marry upon fifty pounds, and we could upon a hundred and fifty. I do not ask for the hundred. I ask whether you would object to the lady, if I had it.”`},
  {id:'edmund-miss-home', kind:'girl', lady:'Miss Sophia Loveday', father:'Mr Loveday', w:() => at('home', 'vicar') && yr(1807, 1815) && !F('edmundMarried'), x:() => `Edmund has dined at the Lovedays’ every Thursday since Michaelmas; and he comes to the book-room in his best coat.

“I have spoken to Miss Sophia Loveday, sir. I have not yet spoken to her father. I thought I should speak to mine.”`},

  /* ---------- Long Barrow and his signature ---------- */
  {id:'edmund-settle-letter', kind:'settle', w:() => edmAway() && lbAtStake() && edmR() >= 0, x:() => `“My dear Father, I have had a letter from Mr Spurling, who writes that Long Barrow may have to be sold to clear the mortgage, and that being settled land, it wants my hand to the deed. I do not write to refuse. I write to ask what is owed, never having been told; for if my name is to go upon a parchment, I should like to read the figures first.”`},
  {id:'edmund-settle-stiff', kind:'settle', w:() => edmAway() && lbAtStake() && edmR() < 0, x:() => `“Sir, Mr Spurling informs me that you may wish to sell Long Barrow, and that my signature is required. I am to have that farm by my great-uncle’s settlement, and my son after me; and having had little else from Hatherley, I shall want better reasons than Mr Spurling’s before I sign. I remain, Sir, your obedient son.”`},
  {id:'edmund-settle-room', kind:'settle', w:() => !edmAway() && lbAtStake(), x:() => `Edmund has met Mr Spurling in Wyvern market place; and he shuts the book-room door behind him.

“He tells me Long Barrow may be sold, sir. And that I must sign. ${edmR() >= 0 ? 'I should like to know what we owe.' : 'I think I had a right to hear it from you.'}”`},

  /* ---------- not on terms ---------- */
  {id:'edmund-cold-letter', kind:'cold', w:() => edmAway() && edmR() <= -2, x:() => `“Sir, I have received my mother’s letter of the 4th and beg you will thank her for the flannel. I am in good health. The weather has been wet. I have nothing further to communicate. I remain, Sir, your dutiful son, Edmund ${S.sur}.”

It is the whole letter, and does not cover one side.`},
  {id:'edmund-cold-room', kind:'cold', w:() => !edmAway() && edmR() <= -2, x:() => `Edmund has not dined at your table since ${['Lady Day', 'Midsummer', 'Michaelmas', 'Christmas'][(S.season + 3) % 4]}.

You meet him in the stable yard, and he takes off his hat.

“Good morning, sir.”

And he stands with it off until you have gone by.`}
];

const edmNow = () => { S.did = S.did || {};
  if (S.edm && S.edm.t === S.t) { const p = EDMUND.find(x => x.id === S.edm.id); if (p) return p; }
  const ok = EDMUND.filter(p => p.w()), fresh = ok.filter(p => S.did[p.id] === undefined);
  const special = fresh.filter(p => p.kind !== 'news' && p.kind !== 'talk');
  let pool = special.length && chance(0.5) ? special : fresh.length ? fresh : ok.slice().sort((a, b) => S.did[a.id] - S.did[b.id]).slice(0, 3);
  // news that belongs to one year goes before news that would keep
  const p = pick(pool) || EDMUND.find(x => x.id === 'edmund-cantonments');
  S.edm = {t:S.t, id:p.id}; S.did[p.id] = S.t; return p; };
const edmKind = k => edmNow().kind === k;
const PREFACE = [
  `The post-boy brings a letter from Edmund, with one and a penny to pay upon it; and he has crossed it, to save a second sheet.`,
  `There is a letter from Edmund, with the wafer cracked; and Henrietta has read the direction three times before you come down.`,
  `Edmund’s hand is upon the hall table, with eightpence to pay; and Henrietta stands by while you break the wafer.`,
  `The carrier leaves a letter at the lodge, from Edmund; and the lodge-keeper’s wife, having brought it up herself, waits in the hall.`];
const mates = () => at('army') ? 'the mess' : at('navy') ? 'the gunroom' : at('militia') ? 'the mess' : 'his landlady';

ev({ id:'edmundLetter', from:1797, to:1815, weight:7, repeatGap:5, cond:() => !F('edmundDead') && !!E() && (!at('army', 'navy') || S.year >= 1798),
  get title(){ return S.pending === 'edmundLetter' && !edmAway() ? 'Edmund at the Book-room Door' : 'A Letter from Edmund'; },
  cut:() => edmNow().id,
  text:() => { const p = edmNow(); return edmAway() ? `${PREFACE[S.t % PREFACE.length]}\n\n${p.x()}` : p.x(); },
  choices:[
    /* a letter of news */
    {t:'Send him fifty pounds.', note:'£50', if:() => edmKind('news'), go:() => { add({money:-50, family:2}); reg('edmund',1,'You sent money when he was away');
      return pick([
        `You send a draft for fifty pounds on Tidmarsh’s.

His answer is eleven lines, by which you learn that he has bought ${at('army') ? 'a horse, a boat-cloak and a dinner for his company' : at('navy') ? 'a sextant, a sea-cloak and a dinner for the gunroom' : at('militia') ? 'a new sash, a second-hand charger and a dinner for his serjeants' : 'a cob, a great-coat and forty bushels of coals for the poor of two parishes'}, but not what each of them cost.`,
        `Fifty pounds goes by the next post.

He writes back within the week, that he has paid his tailor, his servant and ${mates()}; and that there being four pounds over, he desires to know whether he should send it back.`,
        `You send fifty pounds, and no advice.

His answer is to his mother; but there is a line in it for you. “Tell my father the money came on the very day it was wanted. I will not say for what.”`]); }},
    {t:'Write him four sides about the estate.', if:() => edmKind('news'), go:() => { add({family:3}); reg('edmund',1);
      return pick([
        `You write four sides, of the wheat, and the lambing, and who is dead and who married, and what the bay mare did to the coach-house door; and having read it over, and found it dull, you seal it.

His next letter has a postscript.

“${at('army') ? 'Tamworth asks' : at('navy') ? 'The Master asks' : at('militia') ? 'My serjeant asks' : 'My landlady asks'} whether the bay mare is sold. ${at('church') ? 'She has sixpence on it with the clerk.' : 'There is money on it here.'}”`,
        `You write four sides, in which you give him the price of wheat at Newbury, and what each field bore, and tell him that Mudge has shot a white stoat.

He answers every paragraph in its order; and against the stoat he has written, “Stuff it.”`,
        `You write on Sunday evening four sides, crossed, upon the rent audit, the new hedge, and the death of old Dewey’s dog.

He writes back that he read it aloud to ${mates()}, and that nobody believed in the dog.`]); }},
    {t:'Let Henrietta answer. She has knitted him something.', if:() => edmKind('news'), go:() => { add({family:1}); reg('henrietta',1);
      return pick([
        `Henrietta writes eleven sides, and packs with them two flannel waistcoats, a plum cake, and a receipt against the flux.

His answer comes addressed to her; and of the whole of it she reads you one line.

“The cake was of the greatest interest to the surgeon.”

She folds the letter, and puts it in her work-box.`,
        `Henrietta sends six pair of worsted stockings, and a letter that you are not shown.

His answer is to her; and though she laughs twice in the reading of it, she does not say at what.`,
        `Henrietta writes for two evenings, and encloses a lock of the dog’s hair, a sermon, and a pot of calves’-foot jelly.

The jelly travels badly. But he thanks her for the sermon, the paper of which, he says, was very useful.`]); }},
    /* he calls in person */
    {t:'Let him have his way in it.', if:() => edmKind('talk'), go:() => { add({family:1}); reg('edmund',2,'You let him have his way'); return edmNow().a(); }},
    {t:'Go into it with him.', if:() => edmKind('talk'), go:() => { add({family:3}); reg('edmund',1); return edmNow().b(); }},
    {t:'Put him off.', if:() => edmKind('talk'), go:() => { add({family:-1}); reg('edmund',-1,'You put him off'); return edmNow().c(); }},
    /* he asks for money */
    {t:'Let him have the whole of it.', note:() => '£' + edmNow().sum, if:() => edmKind('ask'), go:() => { add({money:-edmNow().sum, family:2}); reg('edmund',2,'You paid when he asked');
      return edmAway() ? pick([
        `You send a draft for the whole sum by return.

His answer is one line. “My dear Father, It came. I shall not forget it. E.”`,
        `You send it all, and add nothing about economy.

He writes that he read your letter twice over, to find the sermon in it; and that he has kept the letter.`])
      : `“You shall have it.”

He had the next sentence ready, and finding that he does not need it, he stands a moment with his mouth open.

“Thank you, sir.” He goes out fast.`; }},
    {t:'Half, and a page of advice.', note:() => '£' + Math.round(edmNow().sum / 2), if:() => edmKind('ask'), go:() => { add({money:-Math.round(edmNow().sum / 2)}); reg('edmund',0);
      return edmAway() ? `You send half; and with it a page upon living within one’s means, in which you wrote from experience.

He thanks you for the draft, and says that he has read the advice to ${mates()}, by whom it was much admired.`
      : `You give him half, and tell him how you managed at his age.

“Yes, sir,” he says; for he has heard already how you managed at his age, and heard it from your uncle’s steward.`; }},
    {t:'Advice only.', if:() => edmKind('ask'), go:() => { add({family:-2}); reg('edmund',-2,'You sent advice when he asked for money');
      return edmAway() ? `You write two sides upon debt, and enclose nothing.

There is no answer for eleven weeks; and then Henrietta has a letter, from which it appears that he has sold his watch.`
      : `“We cannot run to it this year.”

“No, sir.”

He does not ask again. He does not ask for anything again.`; }},
    /* he wishes to marry */
    {t:'Give your consent, and three hundred pounds to begin on.', note:'£300', if:() => edmKind('girl'), go:() => { const p = edmNow(); fl('edmundMarried'); add({money:-300, family:6}); reg('edmund',3,'You gave your blessing and three hundred pounds'); reg('henrietta',1);
      return `You give your consent in six lines, and send three hundred pounds with it.

They are married within the quarter. ${p.lady} writes to Henrietta as “My dear Madam”, in a small upright hand, and asks for the receipt for Mrs Bunce’s plum cake; and Henrietta sends it, leaving out the brandy.`; }},
    {t:'Ask what her father means to give with her.', if:() => edmKind('girl'), go:() => { const p = edmNow();
      if (chance(0.5)) { fl('edmundMarried'); add({family:3}); reg('edmund',0);
        return `You write to ${p.father}, to ask what he proposes to settle.

${p.father} answers by return; and he names a sum beyond what you would have asked, and names likewise what he expects from you: nothing.

They are married within the quarter. You are thanked by everybody, and by Edmund last.`; }
      add({family:-2}); reg('edmund',-2,'You asked her father for his figures');
      return `You write to ${p.father}, to ask what he proposes to settle.

${p.father} answers that he had not understood his daughter was for sale.

The lady releases Edmund from his word; and he tells you so in four lines.`; }},
    {t:'Forbid it.', if:() => edmKind('girl'), go:() => { const p = edmNow(); add({family:-4}); reg('edmund',-3,'You forbade ' + p.lady); reg('henrietta',-1);
      return `You write that it will not do.

His answer is short. “Sir, I have told ${p.lady} what you say. She did not cry. I had rather she had.”

Henrietta does not speak of it; nor, for that week, does she speak to you of much else.`; }},
    /* the settlement */
    {t:'Show him the accounts, every page.', if:() => edmKind('settle'), go:() => { add({family:2}); reg('edmund',2,'You showed him the accounts');
      return edmAway() ? `You have ${F('crabbeGone') ? 'Lark' : 'Crabbe'} copy the whole account, the mortgage, and the interest, and the rental, and what your uncle owed at Brooks’s; and it makes nine sheets.

Edmund’s answer comes in a fortnight. “I have read it three times. I had no notion. If it must be signed I will sign, and I thank you for treating me as a man.”`
      : `You take down the ledgers, and go through them with him from the day of your uncle’s death; and it is two in the morning before you have done.

He says very little. But at the end he squares the books upon the desk.

“If it comes to it, sir, I will sign.”`; }},
    {t:'Give him your word that Long Barrow shall not be sold.', if:() => edmKind('settle'), go:() => { fl('lbWord'); add({family:1}); reg('edmund',1,'You gave your word on Long Barrow');
      return edmAway() ? `You write that Long Barrow will come to him as your uncle meant; and you sign it, and date it.

He writes back that he has put the letter with his commission and his mother’s hair.`
      : `“Long Barrow comes to you. You have my word.”

He looks at you for some time.

“I shall hold you to it, sir.” And he holds out his hand, and you take it.`; }},
    {t:'Tell him the estate is yours while you live.', if:() => edmKind('settle'), go:() => { add({family:-3}); reg('edmund',-2,'You told him the estate was none of his business');
      return edmAway() ? `You write that the estate is yours while you live, and that Mr Spurling had no business to write.

There is no answer. But Mr Spurling tells you in Wyvern that he has had one; and he does not offer to show it to you.`
      : `“The estate is mine while I live.”

“And the debts, sir? Whose are those to be?”

He does not wait for the answer.`; }},
    /* not on terms */
    {t:'Make the first move.', if:() => edmKind('cold'), go:() => { add({family:3}); reg('edmund',2,'You made the first move');
      return edmAway() ? `You write as you did when he was at school, that the dog has had pups, and that his rod is where he left it; and you sign yourself “your affectionate father”.

His answer covers three sides, and begins “My dear Father”.`
      : `You go round to the gun room after dinner, where he is sitting with a book.

“I was wrong,” you say; and there being a choice of matters in which you were so, you do not say in what.

He puts the book down; and after a time he gets out the backgammon board.`; }},
    {t:'Send fifty pounds and say nothing.', note:'£50', if:() => edmKind('cold'), go:() => { add({money:-50}); reg('edmund',1);
      return edmAway() ? `You send a draft for fifty pounds in a blank cover.

It is acknowledged. “Sir, I have received fifty pounds, for which I am obliged.” But there is a postscript. “How is my mother’s cough?”`
      : `You leave fifty pounds upon his dressing-table, in a folded paper.

He does not mention it. But on Sunday he walks to church beside you, as he has not done since the spring.`; }},
    {t:'Let him come round in his own time.', if:() => edmKind('cold'), go:() => { add({family:-2});
      return edmAway() ? `You do not answer. Henrietta does; and of the four sides that she writes him she shows you none.

His next letter is to her.`
      : `You say nothing, and he says nothing.

Henrietta has taken to dining with a book, which she lays open between the two of you, and reads.`; }}
  ]});

ev({ id:'edmundHome', from:1803, to:1806, weight:3, cond:() => E() === 'home' && !F('edmundDead') && !!tenantOf('kennet'), title:'Edmund and the Volunteers',
  text:() => `Edmund is rising thirty, and knows every field upon the estate, and what it let for in 1790.

But the war has begun again; and two of his schoolfellows being at sea, and one at Malta, he reads the Gazette at breakfast, and leaves his egg.

He comes to the book-room after dinner. He has the offer of a company in the Berkshire Militia, which would take him from home until the peace.

“Or I might stay, sir.” He looks at the fire. “If I had Kennet Bottom to farm for myself.”

He has dined at the Lovedays’ four times this month.`,
  choices:[
    {t:'Let him take the militia captaincy.', go:() => { fl('edmund','militia'); add({family:-2, standing:2}); reg('edmund',2,'You let him go for a soldier at last');
      return `He marches with the Berkshires in a new red coat; and his letters come from Ipswich, and then from Dover, and then from Hythe, at none of which places does any Frenchman land.

At Christmas he is home upon leave, and stands straighter; and when he tells the groom how the harness is to be kept, the groom keeps it so.`; }},
    {t:'Give him Kennet Bottom, and your blessing on Miss Loveday.', note:'£300', go:() => { fl('edmund','farmer'); fl('edmundMarried'); S.improve += 1; add({money:-300, family:8}); reg('edmund',3,'You gave him a farm of his own and a wife'); reg('henrietta',2);
      return `You give him Kennet Bottom, and three hundred pounds to stock it.

He marries Sophia Loveday in Hatherley church. She is brisk, and freckled; and when Henrietta, at the wedding breakfast, is so good as to tell her how butter is made at the Hall, she hears it out.

“Yes, ma’am,” says Sophia. “We make ours the other way.”

Edmund begins the drains upon the Monday, and the Bottom goes down to Swedes.`; }},
    {t:'Tell him his duty is here, as your son.', go:() => { add({family:-5}); reg('edmund',-3,'You kept him at home a second time');
      return `“Your duty is here.”

“Yes, sir.”

He keeps the rent book as before, with every figure in it right; and he answers when he is spoken to.

But in the evenings he reads the Gazette by himself, and keeps one finger under the names.`; }}
  ]});

ev({ id:'kittyBotany', from:1806, to:1812, weight:2, cond:() => K() === 'free' && !F('dubreuilWaits'), title:'Miss Kitty and the Orchids',
  text:() => `Kitty is ${kittyAge()}, and has refused four men, of whom the last was a rural dean.

She walks upon Hatherley Down every morning with a tin box; and she has found there a small green orchid, to be found neither in Withering nor in Hudson, of which she has made a drawing at four times the size of life, and dried a specimen. Both of these she wishes to send to Sir Joseph Banks.

“A woman who writes to the Royal Society will never be asked for again,” says Henrietta.

“I had thought of that, Mamma.”`,
  choices:[
    {t:'Send it under your own cover, and buy her a proper microscope.', note:'£40', go:() => { fl('kittyBotanist'); add({money:-40, family:3}); reg('kitty',3,'You bought her a microscope and sent her orchid to Sir Joseph Banks'); reg('henrietta',-1);
      return `The microscope comes from Dollond’s, in a mahogany case, at forty pounds.

Sir Joseph answers in his own hand, three sides.

“The plant is new to me. Mr Sowerby shall figure it for English Botany. Your daughter, Sir, draws better than half my correspondents. She observes better than the other half.”

Kitty reads it standing in the hall, and reads it again; and then, though it is raining, she goes out upon the Down without a bonnet.`; }},
    {t:'Let her send it, under a gentleman’s initials.', go:() => { add({family:-1}); reg('kitty',-1,'You made her sign her orchid with a man’s initials');
      return `The parcel goes to Soho Square from “K. ${S.sur[0]}., Esq.”

Sir Joseph answers that gentleman by return, with his compliments, and a hope that Mr ${S.sur[0]}. will dine in Soho Square on Thursday se’nnight.

Kitty writes back that Mr ${S.sur[0]}. is prevented by indisposition, and signs with the two initials; and she is some time pressing down the wafer with her thumb.`; }},
    {t:'Forbid it, and ask the rural dean to dinner again.', go:() => { add({family:-5}); reg('kitty',-3,'You stopped her orchid and sent for the rural dean'); reg('henrietta',1);
      return `The rural dean comes on Thursday, and talks for two hours upon the tithe on hops; and Kitty passes him the sauce, and asks after his sister.

The drawing goes into the drawer of the hall table, and the orchid is pressed in the second volume of Fordyce’s Sermons.

Nobody at Hatherley opens Fordyce.`; }}
  ]});

ev({ id:'smugglers', from:1805, to:1813, weight:1, title:'Brandy for the Bench',
  text:() => `Mudge is at the back door before breakfast, and will not come in.

There are two half-ankers of brandy under the straw in the cart shed, each with a chalk cross upon the head; and French brandy is this year four pounds the dozen in Reading, when Reading has any.

“That’s the gentleman’s share, sir.” Mudge speaks to your boots. “They runs it up from Christchurch by night. There’s a tub left for every justice on the road. Your uncle had his regular.”

“And what did my uncle do for it?”

“Slept, sir.”`,
  choices:[
    {t:'Sleep soundly.', go:() => { fl('brandy'); add({family:2, standing:1});
      return `The tubs are carried down to the cellar, and you give a dinner; at which the Chairman of Quarter Sessions holds his glass to the candle.

“I have the fellow of this at home,” he says.

Nobody asks him where he had it; and nobody asks you.`; }},
    {t:'Hand the tubs to the Excise.', go:() => { add({standing:2, goodwill:-5});
      return `The Supervisor of Excise rides over from Newbury with four dragoons, and writes you a receipt for eight gallons; and he looks at you a good while before he mounts.

On Thursday the carrier’s cart goes past the lodge without stopping. The grocer at Wyvern has no tea for the Hall this week, and has none the next.

And every morning the park gates are found standing open, with nothing broken, and a stone set to prop them.`; }},
    {t:'Have Mudge leave them where he found them, untouched.', go:() => { add({goodwill:1});
      return `“Leave them where they lie, Mudge. You found nothing.”

“No, sir.”

The tubs lie three nights under the straw; and upon the fourth morning they are gone, and the straw has been raked level.

Mudge touches his hat to you twice that day.`; }}
  ]});

ev({ id:'threshHire', from:1806, to:1811, weight:1, cond:() => !F('thresher'), title:'Mr Hartopp’s Engine',
  text:() => `Hartopp has a threshing machine in his barn, upon the Scotch plan, walked round by four horses; and he takes you over to see it go.

“Forty quarters of wheat in a day, sir. Twelve men with flails want a week for that.”

His millwright will build you the same for a hundred and fifty pounds.

“A flail is a stick tied to a stick,” says Hartopp. “We are in the nineteenth century.”

His labourers stand along the barn wall, with their hands hanging down; and not one of them is looking at Hartopp.`,
  choices:[
    {t:'Order one.', note:'£150', go:() => { fl('thresher'); S.improve += 1; add({money:-150, goodwill:-7}); reg('hartopp',2,'You set up a threshing machine on his plan'); reg('pryor',-1);
      return `It comes in three wagons, and the millwright is nine days putting it up in the great barn; and when the horses start, the tiles hum.

Your wheat is all at Newbury market before October is out.

In other years the threshing lasted from Martinmas to Candlemas, and twelve men had it, two to a floor, by lantern. This winter the lanterns hang upon their hooks; and on the first Monday in December nine of the twelve are at the vestry door.`; }},
    {t:'Stay with the flail.', go:() => { add({goodwill:3}); reg('hartopp',-1);
      return `“I shall keep my sticks, Mr Hartopp.”

“Then you farm under Henry the Second, sir.”

From Martinmas the sound comes out of the great barn all day, two men to a floor, stroke and stroke; and at Candlemas it stops, twelve families having had ten shillings a week through the winter.`; }}
  ]});

ev({ id:'cobbett', from:1805, to:1814, weight:1, title:'A Man on a Grey Cob',
  text:() => `A big red-faced man on a grey cob has been in the village since nine, stopping at every cottage door to ask what the man earns, and what was in the pot on Sunday, and writing the answers in a book.

The landlord of the Bell sends up his name. It is Mr William Cobbett, of the Political Register.

He has asked whose estate this is. He dines at the Bell tonight; and the Register is printed on Saturday.`,
  choices:[
    {t:'Ask him to dine at the Hall.', go:() => { const good = S.goodwill >= 55;
      if (good) { add({standing:4, goodwill:2}); return `He eats two helpings of the mutton, and talks through both, against paper money, sinecures, tea, potatoes, and Scotch economists.

On Saturday the Register has this.

“HATHERLEY, Berks. Here I saw bacon in a labourer’s chimney. I had not seen that sight for thirty miles. The landlord is a plain sensible man. I told him so at his own table and he bore it very well.”

Henrietta cuts it out, and by Sunday has it by heart.`; }
      add({standing:-5, goodwill:1}); return `He eats your mutton, and says that it is good mutton.

“And what did your labourers dine on today, sir?”

You do not know.

On Saturday the Register has two columns.

“I dined with the Squire off a saddle of mutton. I had been that morning into eleven of his cottages. There was not in the eleven as much meat as would bait a mouse-trap.”

Lord Cullerne tells you not to mind it; and in telling you, he repeats it word for word.`; }},
    {t:'Let him form his own opinion.', go:() => { if (S.goodwill >= 55) { add({standing:2}); return `Saturday’s Register gives Hatherley one line.

“The people here have not the look of being hunted.”

The landlord of the Bell nails it up in the tap-room.`; }
      add({standing:-3}); return `Saturday’s Register gives Hatherley a paragraph, in which the labourers are “skin and grief”, and the landlord is not named.

At Newbury market on Thursday three gentlemen ask after your health, and a fourth after your cottages.`; }},
    {t:'Have the constable move him on as a vagrant.', go:() => { add({standing:-6, goodwill:-3});
      return `The constable finds him at the Bell with a chop before him, and asks to see his pass.

Mr Cobbett gives his name, and the name of his newspaper, and finishes the chop; and then he rides to the parish bounds at a walk, with the constable at his stirrup.

The Register has Hatherley on three Saturdays running. The first piece is headed “A BERKSHIRE JUSTICE”; the second is about your cottages; and the third is about your uncle.`; }}
  ]});

ev({ id:'crew', from:1795, to:1802, weight:6, cond:() => T('captain'), title:'All Hands at Hatherley',
  text:() => `The household has been six months under naval discipline. Tarbuck, your coxswain, strikes the bell in the hall every half hour, and at eight bells the footmen are piped to dinner; and there is a flagstaff upon the leads, which, when Lord Cullerne’s carriage turns in at the lodge, flies “Enemy in sight”.

Old Pascoe, who was cook of the Dryad, and lost a leg at the Saintes, has one receipt, for lobscouse, and wants the copper for it; and Mrs Bunce has the copper. The housemaids can splice.

This morning Tarbuck called Henrietta, to her face, “the Captain’s lady, bless her”.

“Do I live in a house or a frigate?” she asks you; and her voice is very level.`,
  choices:[
    {t:'A frigate. The routine stands.', go:() => { add({family:-7, goodwill:4, standing:2}); reg('henrietta',-2,'You told her she lived in a frigate');
      return `“A frigate, my dear.”

The routine stands. The brass upon the front door is polished twice a day, and the gravel raked fore and aft; and at noon the village children are brought to the lodge gates to hear the bell.

Henrietta sleeps with wool in her ears, and to Mrs Tamworth calls you “the Admiralty”.`; }},
    {t:'A house. Strike the hammocks and stop the bell.', go:() => { fl('crewGone'); add({family:6}); reg('henrietta',2,'You sent the ship’s routine ashore for her sake');
      return `The hammocks come down, and the Dryads try beds for a week.

“It don’t swing, sir,” says Tarbuck.

There being a frigate fitting out at Portsmouth, nine of the eleven go for her; and each shakes your hand at the gate, and Tarbuck pipes them over the side of the wagon.

You engage ordinary servants, at ordinary wages; and the Hall is quiet, and you wake at five all the same.`; }},
    {t:'Draw a line at the green baize door: ship below stairs, house above.', go:() => { add({family:2, goodwill:1}); reg('henrietta',1);
      return `You draw the line at the green baize door. Below it there are to be bells, pipes and lobscouse; above it, silence until nine, and nobody to say “aye aye” to a lady.

It holds.

But in the kitchen Pascoe chalks a line down the flags, across which neither he nor Mrs Bunce will speak; and the salt goes over by a housemaid.`; }}
  ]});

ev({ id:'press', from:1803, to:1811, weight:5, cond:() => T('captain') && !F('crewGone'), title:'A Lieutenant with a Warrant',
  text:() => `A press gang has come up the Kennet as far as Wyvern, where nobody has seen one before: a lieutenant, a midshipman of about twelve, and eight hands with cudgels, all quartered at the George.

Somebody has told them of Hatherley Hall, and of eleven prime seamen, rated butler, footmen and gardeners, not one of whom has a protection in his pocket.

A note comes up from the George. The lieutenant presents his compliments; he will call tomorrow at ten; and he trusts that he will find your servants at home.`,
  choices:[
    {t:'Receive him in your old uniform, and ask to see his warrant.', go:() => { add({standing:3}); reg('henrietta',1);
      return `You receive him in the library, in a post-captain’s full dress, with both epaulettes. The coat fits; the waistcoat does not.

You read his warrant through, and find that it runs to seafaring men “upon the rivers and the coast”.

“Which of those is my library, sir?”

He is twenty-three, and you were made post before he was breeched. He drinks one glass of Madeira, standing; and by dark his gang is in Reading.`; }},
    {t:'Put the Dryads in the ice-house till he has gone.', go:() => { const ice = F('icehouse'); add({goodwill:2, standing:-1});
      return ice ? `Eleven seamen go into the ice-house, with a ham, a keg, and a pack of cards, and are there two nights.

The lieutenant searches the Hall from the leads to the cellar; and in the butler’s pantry he finds a cutlass, but no butler.

He looks at you, and you look at him; and you both bow.

The Dryads come out blue, and with eleven shillings of the gunner’s.` : `There being no ice-house, you put them in the hay loft at Long Barrow.

The midshipman, who is twelve, walks under the loft, and looks up; and through a gap in the boards there hangs a tarred pigtail.

You speak to the lieutenant for twenty minutes, as captain to lieutenant, and he takes his gang away without them.

By noon it is all over Wyvern that the Squire hides deserters.`; }},
    {t:'Muster them and let any man volunteer who chooses.', go:() => { fl('crewGone'); add({standing:4, family:3}); reg('edmund',1);
      return `You muster them upon the gravel.

“The King wants seamen. No man of mine shall be pressed. No man of mine shall be hindered.”

They look at their boots. Then Tarbuck steps forward, and after him the gunner; and inside a minute all but old Pascoe have stepped forward, and the lieutenant enters them as volunteers, with the bounty.

They march out behind him, singing.

That evening Pascoe makes lobscouse for two.`; }}
  ]});

/* ---- Henrietta and Kitty ----
   Two more repeating papers, drawn as Edmund's are. Kinds: want (it costs money), matter (it wants a yes or a no),
   news (a married daughter writes). Stable ids; woodcuts at art/events/<id>. */
function drawPiece(pool, slot, fallback){ S.did = S.did || {};
  if (S[slot] && S[slot].t === S.t) { const p = pool.find(x => x.id === S[slot].id); if (p) return p; }
  const ok = pool.filter(p => (!p.w || p.w()) && !(F('henriettaAway') && pieceAtHall(p))), fresh = ok.filter(p => S.did[p.id] === undefined);
  const set = fresh.length ? fresh : ok.slice().sort((a, b) => S.did[a.id] - S.did[b.id]).slice(0, 3);
  const p = pick(set) || pool.find(x => x.id === fallback);
  S[slot] = {t:S.t, id:p.id}; S.did[p.id] = S.t; return p; }
const kittyAtHome = () => K() === 'free';
const half = n => Math.round(n / 2);

const HENRIETTA = [
  {id:'henrietta-pianoforte', kind:'want', sum:35, w:() => kittyAtHome() && S.year <= 1806, x:() => `Henrietta has a printed card from Broadwood’s in Great Pulteney Street.

“A square piano-forte, in mahogany. Thirty-five pounds, and the carriage. Kitty plays upon a spinet that was your aunt’s. Three of the keys do not speak.”

She has measured the wall between the windows, and has the measure in her hand.`,
    a:() => `It comes from London upon the wagon, in a deal case, and four men carry it in.

Kitty plays until eleven, and plays the same sonata nine times; and at the tenth you know it.

Henrietta sits with her eyes shut, counting the Tamworths’ instruments, of which they have one.`,
    b:() => `You send to Reading for a man to mend the spinet, who is a day about it, and charges seventeen pounds, with new quills.

All the keys now speak, though two of them speak the same note.

“It is very much better,” says Kitty; and she plays with the lid down.`,
    c:() => `“The spinet did for my aunt.”

“Your aunt was deaf,” says Henrietta.

Kitty plays upon the spinet after dinner, and plays loudest upon the three dumb keys.`},
  {id:'henrietta-carpet', kind:'want', sum:40, x:() => `Henrietta has you stand in the drawing-room doorway, and look at the carpet; across which there is a path worn to the boards, from the fire to the decanter, and back.

“Your uncle,” she says. “Forty years. A Wilton would be forty pounds.”`,
    a:() => `The Wilton is laid upon a Tuesday, crimson, with a border of oak leaves; and for a week nobody is let walk upon it, a drugget being put down from the door to each chair.

The old carpet goes to the servants’ hall, where they turn it round; so that the path now runs from the fire to the beer.`,
    b:() => `Henrietta has the old carpet taken up, and turned end for end; and a rug from the Wyvern sale goes over the worst of it, for twenty pounds.

The rug does not lie flat, and at Christmas Mr Tamworth falls over it.

“We are getting a Wilton,” Henrietta tells him, as he is helped up.`,
    c:() => `“It will see us out.”

She moves the sofa over the path; by which the sofa is brought to the middle of the room, facing nothing.

There it stays, and callers walk round it.`},
  {id:'henrietta-chariot', kind:'want', sum:120, w:() => S.standing >= 35 && !(typeof held === 'function' && held('chariot')), x:() => `The Tamworths have a new landaulet, yellow, with the crest upon both doors; and Henrietta, having seen it at church, saw it again in Wyvern on Thursday.

“Our coach was built for your uncle in the year of the Gordon riots. The lining is his hair-powder. A chariot from Hatchett’s is a hundred and twenty.”`,
    a:() => `It comes down from Long Acre behind your own horses, dark green, with very small arms upon the door.

Henrietta drives to church in it, and drives the long way, by the Tamworths’ lodge.

Mrs Tamworth is at an upper window. Henrietta does not look up, having seen her.`,
    b:() => `The old coach goes to the coach-maker at Newbury, for a new lining, and new leather, and the body to be painted; and it comes to sixty pounds.

It comes home dark green, and shining, and rolling as a ship does still.

Henrietta arrives at the Lovedays’ pale, and smiling.`,
    c:() => `“It has four wheels and a roof.”

She says no more. But at church she waits in the porch until the Tamworths have driven off; and then you hand her up into your uncle’s hair-powder.`},
  {id:'henrietta-mourning', kind:'want', sum:25, w:() => S.year === 1810 && S.season === 3 || S.year === 1811 && S.season === 0, x:() => `The Princess Amelia is dead at Windsor, at twenty-seven; and the Court goes into mourning, and the county with it.

Black crape, which was two shillings a yard in Wyvern on Monday, is four today.

“Twenty-five pounds would put the family and the upper servants in black,” says Henrietta. “The Castle has had its people in black since Sunday.”`,
    a:() => `By Saturday the whole household is in black, to the knife-boy, and the footmen have crape upon their arms and their hats; so that on Sunday the Hall pew is one black row.

Lord Cullerne looks along it from his own, and inclines his head, for the first time since harvest.`,
    b:() => `The family goes into black, and the servants have a black ribbon each.

Mrs Bunce wears hers in her cap; and she tells the kitchen that it is for the Princess, and tells you that it is for the pine-apples.`,
    c:() => `“We did not know the lady.”

Henrietta wears her grey; and in Wyvern on Thursday, being the only gentlewoman there in a colour, she has three ladies cross the market place to ask after her health.`},
  {id:'henrietta-portrait', kind:'want', sum:30, w:() => !(typeof held === 'function' && held('portraits')), x:() => `A travelling limner has put up at the Bell, who has painted the Tamworths, the Lovedays, and the Lovedays’ horse.

“Thirty pounds for the two of us in oils, three-quarter length,” says Henrietta. “Half that for a head.”

She has seen the Lovedays, and says that the horse is the best likeness.`,
    a:() => `You both sit to him for nine mornings, during the whole of which he talks about Sir Joshua.

The picture is hung over the dining-room chimney. Henrietta has a column behind her, and a spaniel that you never owned; and you have your uncle’s nose.

Mrs Bunce is brought up to see it, and looks for some time.

“It’s the old master, sir. In your coat.”`,
    b:() => `Henrietta sits alone, for a head, at fifteen pounds; and he gives her pearls that she has not got, and takes away ten years.

She has it hung in her own dressing-room, and says that it is not at all like.`,
    c:() => `“There is a looking-glass in the hall.”

The limner goes on to Hungerford, leaving his card at the lodge; and Henrietta keeps the card in her work-box.`},
  {id:'henrietta-tea', kind:'want', sum:18, w:() => S.year >= 1797, x:() => `Tea is ten shillings the pound at Wyvern, and the grocer sands it.

Henrietta has a letter from Twining’s in the Strand, offering a chest of Hyson and a chest of Congou, for eighteen pounds, by the Newbury wagon.

“Or there is a man at the back door on Thursdays,” she says. “He is cheaper. I have not asked him why.”`,
    a:() => `Two chests come by the wagon, with Twining’s mark burnt into the lid; and Henrietta has a lock put upon the tea closet, and keeps the key on her own ring.

Mrs Bunce watches it go by.`,
    b:() => `You have the one chest, of Congou, for nine pounds.

The servants’ hall has it, and the parlour has what the Thursday man brings; and his is the better tea.`,
    c:() => `“Sage tea was good enough for my uncle.”

Henrietta drinks sage tea for a week, and has it served to you as well.

On Thursday there is Hyson again. You do not ask.`},
  {id:'henrietta-gowns', kind:'want', sum:45, w:() => S.year <= 1801, x:() => `The fashion has changed, and waists are under the arms, and there are no hoops; and Henrietta, laying nine gowns across the bed, finds that not one of them can be worn.

“Forty-five pounds at the mantua-maker’s in Reading. Or I must go to the Assembly as my own mother.”`,
    a:() => `Six new gowns come home in a deal box, white muslin for the most part, and weighing nothing.

Henrietta comes down in the first of them, through which you can see the shape of both her knees.

“It is what is worn,” she says; and she takes a shawl.`,
    b:() => `The Reading woman cuts down four of the old gowns, for twenty-two pounds.

But the brocade, having been made to stand out upon a hoop, will not hang, and stands out; and at the Assembly Henrietta keeps her back to the wall.`,
    c:() => `“Hoops will come in again.”

She wears the grey brocade to the Wyvern Assembly, where it takes up two chairs; and Mrs Tamworth tells her that it is delightful to see the old fashions kept up.`},

  {id:'henrietta-margravine', kind:'matter', w:() => S.year >= 1806 && S.year <= 1807, x:() => `The Margrave of Anspach is dead at Benham Park; he having sold his country to the King of Prussia, and come to live outside Newbury. His widow was Lady Craven, who married him sixteen days after Lord Craven died, and whom the Queen will not receive.

“She is nine miles off and in mourning,” says Henrietta. “Does one call?”`,
    a:() => `Henrietta calls, and is an hour at Benham.

“She received me on a sofa with a turban on. She has written a play. She read me the second act.”

She says nothing against her; but she asks Kitty for the atlas, and looks for Anspach.`,
    b:() => `“You know better than I.”

Henrietta takes the usual course, and leaves her card at the lodge, without going in.

A card comes back within the week, with a coronet upon it of nine points; and Henrietta counts them.`,
    c:() => `“Not while the Queen will not.”

Henrietta stays at home; and Mrs Tamworth, who calls at Benham on Thursday, has a great deal to tell, and tells it at your table.`},
  {id:'henrietta-housemaid', kind:'matter', x:() => `The second housemaid has been found in the linen closet with the under-footman, at three in the afternoon.

“Sarah is nineteen and can get up fine linen,” says Henrietta. “Thomas is the only footman tall enough for the back of the coach. Mrs Bunce wishes both turned off before supper.”

She waits.`,
    a:() => `“Marry them.”

The banns are read, and they have the room over the laundry.

Sarah gets up your shirts as before; and when in May she lets out her apron, Mrs Bunce counts upon her fingers.`,
    b:() => `“It is your household.”

Henrietta sends Sarah home to her mother at Kintbury for a month, and Thomas is spoken to.

The linen closet has a new lock, of which Mrs Bunce keeps the key.`,
    c:() => `Both are turned off, without a character.

The new footman is five foot four, and cannot, behind the coach, reach the strap; and for a fortnight Henrietta irons her own lace.`},
  {id:'henrietta-bunce', kind:'matter', x:() => `Mrs Bunce, who has been cook at the Hall twenty-six years, has given a month’s notice.

“It is the new kitchen-maid,” says Henrietta. “She told Mrs Bunce that at Lord Cullerne’s they do not boil a pudding in the same cloth twice.”

Mrs Bunce can be heard in the passage. She is not crying; she is moving saucepans.`,
    a:() => `You go down to the kitchen yourself, where you have not been since Christmas.

“Mrs Bunce, I had a pudding at the Castle. It was not so good as yours.”

She looks at you a long time. “No, sir. It wouldn’t be.”

The notice is not mentioned again.`,
    b:() => `“You will manage it.”

Henrietta manages it. The kitchen-maid goes to the dairy, and Mrs Bunce has two pounds a year more; and on Sunday there is a pudding of the size of a hassock.`,
    c:() => `“Let her go if she wishes.”

Mrs Bunce does not go. But she tells the household what you said; and for a fortnight the mutton is underdone.`},
  {id:'henrietta-preacher', kind:'matter', w:() => S.year >= 1798, x:() => `There is a Methodist, a shoemaker from Hungerford, who preaches in Dewey’s barn on Sunday evenings.

“Forty of the people were there last Sunday,” says Henrietta. “Eleven were in church. ${F('gallDead') ? 'The Vicar' : 'Dr Gall'} wishes you to send the constable.”

Two of your own housemaids went, having first asked leave.`,
    a:() => `You let him preach; and you go once, and stand at the back.

He speaks for an hour without a paper, during which nobody sleeps, and a carter cries.

“Well?” says Henrietta. You say that the singing was very loud.`,
    b:() => `“Ask the housemaids what he said.”

Henrietta asks; and it appears that he said that the rich man shall hardly enter the kingdom.

“He said it very civil, ma’am,” the girl tells her. “He said we was to pray for you.”`,
    c:() => `The constable is sent to the barn, where the shoemaker shows him a licence under the Toleration Act; and the constable, who cannot read it, comes away.

Next Sunday there are sixty in the barn.`},
  {id:'henrietta-mother', kind:'matter', x:() => `Henrietta’s mother, who is seventy-three, proposes herself for six weeks. She travels with a maid, a parrot, and her own sheets, and will not sleep in a room that faces east.

“${T('portion') ? 'It was her money that mended the roof' : T('lovematch') ? 'She has never said you were a mistake. Not in words' : 'She asks after you in every letter'},” says Henrietta.`,
    a:() => `She comes for six weeks, and has the blue room, which faces west.

The parrot says “Henrietta, sit up” in her voice, and says it at breakfast.

She stays nine weeks; and on the last morning she tells you that you have improved.`,
    b:() => `“For as long as you like, my dear.”

Henrietta writes for a month, and not six weeks; and for a month her mother comes.

The parrot bites Mudge, and Mudge has a shilling for it.`,
    c:() => `“The chimneys are being swept.”

Henrietta writes that the chimneys are being swept; to which her mother replies that they were being swept last year.

The next letter is to Kitty.`}
];
const henNow = () => drawPiece(HENRIETTA, 'hen', 'henrietta-carpet');

ev({ id:'henrietta', from:1796, to:1815, weight:5, repeatGap:6, title:'Henrietta Has Been Thinking',
  cut:() => henNow().id,
  text:() => henNow().x(),
  choices:[
    {t:'Let her have it.', note:() => '£' + henNow().sum, if:() => henNow().kind === 'want', go:() => { const p = henNow(); add({money:-p.sum, family:3}); reg('henrietta',1); return p.a(); }},
    {t:'Do it by halves.', note:() => '£' + half(henNow().sum), if:() => henNow().kind === 'want', go:() => { const p = henNow(); add({money:-half(p.sum), family:1}); return p.b(); }},
    {t:'Not this year.', if:() => henNow().kind === 'want', go:() => { add({family:-2}); reg('henrietta',-1); return henNow().c(); }},
    {t:'Say yes.', if:() => henNow().kind === 'matter', go:() => { add({family:2}); reg('henrietta',1); return henNow().a(); }},
    {t:'Leave it to her.', if:() => henNow().kind === 'matter', go:() => { add({family:1}); return henNow().b(); }},
    {t:'Say no.', if:() => henNow().kind === 'matter', go:() => { add({family:-2}); reg('henrietta',-1); return henNow().c(); }}
  ]});

const KITTY = [
  /* at home */
  {id:'kitty-library', kind:'matter', w:() => kittyAtHome(), x:() => `There is a circulating library opened at the stationer’s in Wyvern, at a guinea a year, and two volumes at a time; and Kitty, who has the printed catalogue, has put a pencil cross against forty-one titles.

“Novels,” says Henrietta. “Every one. There is a thing here called The Monk.”`,
    a:() => `Kitty has her guinea, and the carrier brings two volumes each Thursday, and takes two back.

She reads at breakfast, with the book against the urn; and Henrietta, taking up a volume to see what is in it, is not seen again until dinner.`,
    b:() => `You read the catalogue through with her, and strike out The Monk; and she puts it in again under another name.

You let it stand, not being sure of the other name.`,
    c:() => `“There are four hundred books in this house.”

“Three hundred are sermons,” says Kitty. “I have read the sermons.”

She begins upon the sermons again, and reads them aloud at tea.`},
  {id:'kitty-walks', kind:'matter', w:() => kittyAtHome(), x:() => `Kitty walks to the far cottages three days a week, alone, to read to an old woman there who is blind.

“Four miles, in pattens, with no servant,” says Henrietta. “Mrs Tamworth saw her on the Kintbury lane. She was climbing a gate.”

Kitty says that the gate was locked.`,
    a:() => `“Let her walk.”

Kitty walks; and in a month she knows which cottages have a fire, and which have none, and tells you at dinner.

It is a longer list than ${F('crabbeGone') ? 'Lark' : 'Crabbe'} keeps.`,
    b:() => `You walk with her on the Thursday, four miles out; and the old woman knows your step from your uncle’s.

“You come down heavier on the left, sir. He come down on the right.”

It is four miles back. Kitty climbs the gate, and you go round.`,
    c:() => `A groom is to follow her at twenty yards.

She walks faster; and the groom, who is fifty, asks within the week to be put back in the stable.

Kitty goes on Thursdays in the gig, sitting very straight, and looking at nothing.`},
  {id:'kitty-latin', kind:'matter', w:() => kittyAtHome() && kittyAge() <= 26, x:() => `Kitty has Edmund’s old Latin grammar, and has got as far as the third declension without help.

“I should like the curate to hear me twice a week, sir. He has offered.”

Henrietta puts down her work. “A girl who has Latin has it instead of a husband.”`,
    a:() => `The curate comes on Tuesdays and Fridays, and they sit in the library with the door open.

By midsummer she is in Virgil, and construes forty lines at dinner for the Bishop’s chaplain; who corrects one word, and being shown the place, is found to have been wrong.`,
    b:() => `You hear her yourself, though you have not opened a grammar since Winchester; and in three weeks it is she who is hearing you.

She is patient, and gives you the same verb four evenings running.`,
    c:() => `“Your mother is right.”

The grammar goes back upon Edmund’s shelf. But taking down, a month later, the Horace that stands beside it, you find it full of pencil; and the hand is not Edmund’s.`},
  {id:'kitty-assembly', kind:'matter', w:() => kittyAtHome() && kittyAge() >= 21, x:() => `It is the night of the Wyvern Assembly, and Kitty comes down in her old green.

“I have danced with the same nine men for ${kittyAge() - 17} winters, Mamma. I know what each will say at the bottom of the set. Might I stay at home?”

The coach is at the door, and Henrietta has her gloves on.`,
    a:() => `Kitty stays at home, with a candle and the dog.

At the Assembly nine gentlemen ask after her, and each of them says the thing that she said he would; and when Henrietta tells her so at breakfast, they both laugh, as they have not done together for a long time.`,
    b:() => `“Come for an hour, and you shall name the hour.”

She comes; and at ten she looks at you, and you call the coach.

Going home she says, “That was fair, sir.” She has danced twice.`,
    c:() => `“You will go.”

She goes, and dances every dance, and smiles the whole evening at the wall.

Mr Loveday’s nephew says that she is the most agreeable girl in the room. She has not heard a word he said.`},
  {id:'kitty-danes', kind:'matter', w:() => kittyAtHome() && S.year >= 1808 && S.year <= 1813, x:() => `There are three hundred Danish officers upon parole at Reading, taken with their ships at Copenhagen; and Kitty has it from the laundry-maid that on Thursdays the young ones give a dance in a cellar, to which their washerwomen’s daughters come, with a washerwoman sitting by the door for propriety.

“What do they dance, sir?” says Kitty at dinner. “Is it true the punch is mostly water?”`,
    a:() => `You tell her what you know, and it is not much; and on the Saturday you drive her into Reading.

Two Danes are walking by the Kennet, in blue coats, one of them with a book; and they take off their hats to her.

“They look like curates,” says Kitty. She is disappointed.`,
    b:() => `“Ask your mother.”

Henrietta says that Danes are Lutherans, and that will do; upon which Kitty asks what Lutherans dance.

Nobody at the table knows.`,
    c:() => `“That is not a subject for the dinner-table.”

“No, sir.”

She has the rest from the laundry-maid by Friday, and it is a great deal more than you knew.`},
  {id:'kitty-telescope', kind:'want', sum:12, w:() => kittyAtHome() && S.year === 1811, x:() => `There is a comet, which stands every evening over the stable clock, with a tail as long as your arm; and Kitty has been three nights upon the leads with your spy-glass.

“Mr Dollond has a two-foot achromatic telescope on a brass stand. Twelve pounds. One could see the head of it, sir. One could draw it.”`,
    a:() => `It comes from St Paul’s Churchyard in a mahogany box, and she has it upon the leads the same night.

At eleven she sends down for you; and you look, and see that the comet has a bright head, and a dark place behind it.

“Nobody knows what that is,” she says; and that nobody knows gives her the greatest pleasure.`,
    b:() => `You send your spy-glass to Reading for a new object-glass, at six pounds.

It shows the comet rather larger, and with a green edge. Kitty draws it without the green edge, and writes “instrument imperfect” under the drawing.`,
    c:() => `“It can be seen very well without.”

She draws it from the leads with the naked eye, every clear night for nine weeks.

Henrietta finds the drawings, and says that they would make a pretty screen.`},
  /* Mrs Vane */
  {id:'kitty-vane-bailiff', kind:'want', sum:60, w:() => K() === 'vane' && !F('vaneGone'), x:() => `There is a letter from Kitty, dated from lodgings in ${['Sunderland', 'Colchester', 'Weymouth'][S.t % 3]}.

“My dear Papa, The Captain has had a misfortune at cards, and there is a bailiff sitting in the passage; a very civil man, to whom I have given tea. He says that sixty pounds would take him out of the house, and that he has known cases a great deal worse. I am quite well.”`,
    a:() => `You send the sixty pounds to Kitty by name.

She writes that the bailiff shook hands upon leaving, and that the Captain has promised her never to touch a card, and has promised it in writing.

She encloses the writing, and asks you to keep it for her.`,
    b:() => `You send thirty pounds, and write to the Captain’s Colonel.

The Colonel does not answer; and the bailiff takes the thirty, and the Captain’s second-best saddle.

“We are a little lighter,” Kitty writes. “It was the Captain’s saddle.”`,
    c:() => `You write that she made her bed.

There is no answer for a quarter, and then four lines, to say that they have moved, though not where from.

The direction is care of a pastry-cook.`},
  {id:'kitty-vane-march', kind:'news', w:() => K() === 'vane' && !F('vaneGone'), x:() => `There is a letter from Kitty.

“My dear Papa, The Regiment has marched again, and this is my eleventh lodging; so that I can now pack everything we own in forty minutes. The Captain is upon the recruiting service, and is a great success at fairs. I have learnt to make a pudding without eggs, and a fire without coals. ${F('kittySettled') ? 'The forty pounds came at Lady Day. I have not told him which day it comes.' : 'Do not send money to him. If you send any, send it to me.'}”`},
  {id:'kitty-vane-child', kind:'news', w:() => K() === 'vane' && S.year >= 1800 && !F('vaneGone') && !F('kittyDoor'), x:() => `There is a letter from Kitty.

“My dear Papa, You have a grandson. He was born on Tuesday, in a room over a saddler’s, the Captain being at Newmarket; and the Surgeon of the Regiment came, and the Colonel’s lady sent a fowl. He is to be Edmund Barnaby. He has your uncle’s nose; for I looked for anybody else’s, and could not find it.”`},
  /* Mrs Pinch */
  {id:'kitty-clifton', kind:'news', w:() => K() === 'pinch' && !F('kittyWidow'), x:() => `There is a letter from Kitty, upon thick paper, sealed with a crest; and the crest is new.

“My dear Papa, We have eleven servants, to nine of whom I am not allowed to speak. Mr Pinch reads the price of sugar aloud at breakfast, and then reads it again from the other paper; and we dine at five, with gentlemen in the African trade. I have a carriage, and may drive upon the Downs between two and four.”`},
  {id:'kitty-clifton-black', kind:'news', w:() => K() === 'pinch' && !F('kittyWidow'), x:() => `There is a letter from Kitty.

“My dear Papa, There is a black boy in the house named Scipio, who is twelve, and hands the coffee in a silver collar. I asked Mr Pinch what he was paid; and Mr Pinch laughed until he coughed. I have begun to teach Scipio his letters in the still-room, and he had A to K in a week. Pray do not mention it if you write to my husband.”`},
  {id:'kitty-widow', kind:'news', w:() => F('kittyWidow') && !F('kittyManumit'), x:() => `There is a letter from Kitty, with a black edge.

“My dear Papa, I have let the house at Clifton, and taken a smaller, where I keep four servants, and speak to all of them. The attorneys send me accounts from Bristol each quarter, with the hogsheads set down in one column and the people in the next; and I sign where the pencil cross is. I have a garden. Nothing in it comes from farther off than Somerset.”`},
  {id:'kitty-manumit', kind:'news', w:() => F('kittyManumit'), x:() => `There is a letter from Kitty.

“My dear Papa, The agent writes from Jamaica, that of three hundred and four persons, two hundred and sixty have taken their papers; and the rest being old, and asking what they were to eat, I have settled a provision ground upon each. The agent says that I am ruined, and has resigned. I am not ruined. I have two hundred a year, as a rector has; and the ladies of Clifton cross the road.”`},
  /* Mrs Oakes */
  {id:'kitty-oakes-mangle', kind:'news', w:() => K() === 'oakes', x:() => `Kitty walks up from ${F('oakesVicar') ? 'the Vicarage' : 'the curate’s house'} with a child in each hand, and a basket; being come to borrow the Hall mangle, theirs having broken a roller. There are four surplices in the basket, and a great many small shirts.

“Mr Oakes sends his duty, sir. He is writing a sermon and minding the baby. He does both with the one hand.”`},
  {id:'kitty-oakes-pew', kind:'news', w:() => K() === 'oakes', x:() => `It is Sunday; and Kitty sits in the ${F('oakesVicar') ? 'Vicarage' : 'curate’s'} pew, under the pulpit, with ${ONES[Math.min(5, Math.max(2, Math.floor((S.year - 1800) / 2)))]} children.

The smallest gets out during the Litany, and walking up the aisle to the Hall pew, holds up his arms; and Henrietta lifts him in.

He sleeps through the sermon upon her muff. It is his father’s sermon.`},
  /* Madame Dubreuil */
  {id:'kitty-reading-parole', kind:'news', w:() => K() === 'dubreuil' && S.year <= 1813, x:() => `There is a letter from Kitty, from Reading.

“My dear Papa, We have two rooms in Friar Street. The Lieutenant may walk one mile out upon the turnpike, and must be indoors at five; and as I may walk where I please, I walk the mile with him, and then one more by myself, to say I did. He has ten shillings and sixpence a week from the Agent. He teaches French to an attorney’s daughters, and I teach him to say ‘th’; and neither of us makes much progress.”`},
  {id:'kitty-stmalo', kind:'news', w:() => K() === 'dubreuil' && S.year >= 1814, x:() => `There is a letter from Kitty, with the French King’s head upon the postmark.

“My dear Papa, We are at Saint-Malo. The house is granite, and has been in the family since a Dubreuil took a ship from the English in 1693; and they have told me which ship. My husband’s mother speaks no English, and I have not French enough to be rude in, so that we get on. There are eleven hives. The bees are very like Berkshire bees, and do not seem to know that they are French.”`}
];
const kitNow = () => drawPiece(KITTY, 'kit', 'kitty-library');

ev({ id:'kitty', from:1797, to:1815, weight:5, repeatGap:6, cond:() => KITTY.some(p => p.w()),
  get title(){ return kittyAtHome() ? 'Kitty at the Library Door' : K() === 'oakes' ? 'Mrs Oakes at the Hall' : 'A Letter from Kitty'; },
  cut:() => kitNow().id,
  text:() => kitNow().x(),
  choices:[
    {t:'Let her have it.', note:() => '£' + kitNow().sum, if:() => kitNow().kind === 'want', go:() => { const p = kitNow(); add({money:-p.sum, family:2}); reg('kitty',2,'You paid when she asked'); return p.a(); }},
    {t:'Do it by halves.', note:() => '£' + half(kitNow().sum), if:() => kitNow().kind === 'want', go:() => { const p = kitNow(); add({money:-half(p.sum)}); reg('kitty',0); return p.b(); }},
    {t:'Refuse.', if:() => kitNow().kind === 'want', go:() => { add({family:-2}); reg('kitty',-2,'You refused her'); return kitNow().c(); }},
    {t:'Take her part.', if:() => kitNow().kind === 'matter', go:() => { add({family:1}); reg('kitty',2,'You took her part'); reg('henrietta',-1); return kitNow().a(); }},
    {t:'Go into it with her.', if:() => kitNow().kind === 'matter', go:() => { add({family:3}); reg('kitty',1); return kitNow().b(); }},
    {t:'Take her mother’s part.', if:() => kitNow().kind === 'matter', go:() => { add({family:-1}); reg('kitty',-1); reg('henrietta',1); return kitNow().c(); }},
    {t:'Write to her yourself.', if:() => kitNow().kind === 'news', go:() => { add({family:2}); reg('kitty',1);
      return pick([
        `You write two sides, to tell her that the orchard has blown down in part, and that the dog looks for her upon the stairs.

Her answer comes in a week, four sides, crossed; and she has asked nine questions about the dog.`,
        `You write on Sunday evening, and find that you have covered a sheet before you come to any news.

She writes back that she read it standing in the passage, and then sat down, and read it again.`,
        `You write, and give no advice; though it takes three drafts to leave it out.

“My dear Papa,” she answers, “I had your letter. I noticed what was not in it. Thank you.”`]); }},
    {t:'Send twenty pounds for her own purse.', note:'£20', if:() => kitNow().kind === 'news', go:() => { add({money:-20, family:1}); reg('kitty',1);
      return pick([
        `You send a twenty-pound note, in a letter to her alone.

She writes that she has sewn it into her stays, where it is to remain against a rainy day; and of rainy days, she says, there are a good many where she is.`,
        `You send twenty pounds, in her own name.

She has bought with it a pair of boots, a ream of paper, and a lock for her writing-desk, and tells you the price of each; and there being eleven pounds over, she tells you likewise where it is hidden.`]); }},
    {t:'Let Henrietta answer.', if:() => kitNow().kind === 'news', go:() => { reg('henrietta',1);
      return pick([
        `Henrietta writes nine sides, and sends a receipt for a cough, a pattern for a cap, and her love; and having put “and your father’s” after the love, she shows you that she has.`,
        `Henrietta answers the same night, writing with the door shut.

A parcel goes with the letter. You are not told what is in it; but it is of the shape of a ham.`]); }}
  ]});

/* ---- Papers with their own three answers ----
   A pool whose pieces each carry a title and three choices. hot:true marks a piece tied to a year, which is
   drawn before the rest while it is fresh; once:true is never drawn twice. Woodcuts at art/events/<piece id>. */
function drawOwn(pool, slot){ S.did = S.did || {};
  if (S[slot] && S[slot].t === S.t) { const p = pool.find(x => x.id === S[slot].id); if (p) return p; }
  const ok = pool.filter(p => (!p.w || p.w()) && !(p.once && S.did[p.id] !== undefined) && !(F('henriettaAway') && pool !== GAYST && pieceAtHall(p))), fresh = ok.filter(p => S.did[p.id] === undefined), hot = fresh.filter(p => p.hot);
  const set = hot.length ? hot : fresh.length ? fresh : ok.slice().sort((a, b) => S.did[a.id] - S.did[b.id]).slice(0, 3);
  const p = pick(set) || pool[0];
  S[slot] = {t:S.t, id:p.id}; S.did[p.id] = S.t; return p; }
function pooled(id, pool, slot, opt){ const now = () => drawOwn(pool, slot);
  const hotNow = () => pool.some(p => p.hot && (!S.did || S.did[p.id] === undefined) && (!p.w || p.w()));
  ev({ id, from:opt.from, to:opt.to, get weight(){ return hotNow() ? opt.weight * 3 : opt.weight; }, get repeatGap(){ return hotNow() ? 1 : opt.repeatGap; },
    cond:() => (!opt.cond || opt.cond()) && pool.some(p => (!p.w || p.w()) && !(p.once && S.did && S.did[p.id] !== undefined) && !(F('henriettaAway') && pool !== GAYST && pieceAtHall(p))),
    get title(){ return now().title; }, cut:() => now().id, text:() => now().x(),
    choices:[0, 1, 2].map(i => ({ t:() => now().o[i].t, note:() => now().o[i].note || '', go:() => now().o[i].go() })) }); }
const stew = () => F('crabbeGone') ? 'Lark' : 'Crabbe';
const vicar = () => F('gallDead') ? 'The Vicar' : 'Dr Gall';

const MEMBER = [
  {id:'member-maiden', once:true, title:'The Wyvern Turnpike Bill', x:() => `The Wyvern Turnpike Bill is down for Tuesday; and it being your bill, and you not having yet opened your mouth in the House, you have a speech in your pocket, nine minutes long, which Henrietta has heard four times.

There are forty Members present, of whom eleven are asleep, and one is peeling an orange into his hat.`,
    o:[{t:'Rise and speak.', go:() => { add({standing:2}); reg('henrietta',1);
      return `You rise; and the Speaker calls your name, which you had not known that he had.

You speak for six minutes, leaving out the middle; and a Member behind you says “Hear” once, in his sleep.

The bill is read a second time. The Mercury gives you four lines, and Henrietta cuts them out.`; }},
    {t:'Read it from the paper.', go:() => { add({goodwill:1});
      return `You take out the paper; upon which there is a cry of “Order”, a Member not being allowed to read his speech.

You put the paper in your hat, therefore, and holding the hat before you, address it for nine minutes.

“The honourable gentleman has an eloquent hatter,” says somebody opposite. The bill is read a second time.`; }},
    {t:'Move it without a word.', go:() => { add({standing:-1});
      return `You rise, and bow, and say “I beg to move”, and sit down; the whole taking four seconds. The bill is read a second time.

An old Member for a Cornish borough, who has sat thirty years, and has never said more, leans across and shakes your hand.`; }}]},

  {id:'member-franks', title:'Free of Postage', x:() => `A Member’s letters go free, if he writes his name and the date upon the cover with his own hand; and he may send ten a day.

The county has found it out. There are forty-three covers upon the hall table, waiting for your name; of which ${vicar()} has sent nine, and Mrs Tamworth six, for her sister at Bath, and one is from a man in Wyvern whom you have never met, and who has enclosed a second cover for the answer.

Postage to Bath is eightpence.`,
    o:[{t:'Sign them all.', go:() => { add({goodwill:2, standing:1});
      return `You sign forty-three covers, and to keep within the law you date them over five days.

Your wrist aches; and by Saturday there are fifty more upon the table.

Mrs Tamworth’s sister writes back, free, to thank Mrs Tamworth for the pattern, and to observe that the Member writes a clerk’s hand.`; }},
    {t:'Sign for the household and the parish.', go:() => { add({family:1, goodwill:-1});
      return `You sign for Henrietta, and for ${vicar().replace('The', 'the')}, and the rest go back.

Mrs Tamworth pays her eightpence for Bath, in coppers, over the counter at Wyvern; and she tells the shop what it is for.

The man whom you never met writes again, paying this time, to call you a placeman.`; }},
    {t:'Let Mudge sign them. He has your hand.', go:() => { add({goodwill:-2});
      return `Mudge can write your name, having done it upon game tickets these ten years; and he signs the forty-three in an evening, in the gun room, spelling the month in his own way.

The postmaster at Wyvern charges every one; so that forty-three people pay eightpence for a letter with your name upon it.`; }}]},

  {id:'member-place', title:'A Place in the Customs', x:() => `Mr Dodd, who holds a burgage plot in Pig Lane, and who polled for you, is in the library, with his hat upon his knee.

His son William is twenty-two, and writes a fair hand; and there is a tide-waiter’s place vacant at Bristol, of forty pounds a year, and what the ships give.

“A word from the Member, sir. That is all a Treasury wants.”

The Treasury keeps a book of such words.`,
    o:[{t:'Ask the Treasury.', go:() => { add({goodwill:2, standing:-1});
      return `You write to the Secretary of the Treasury, who answers within the week; and William Dodd is appointed.

In March, upon the morning of a division, there comes a note. “Mr ${S.sur} will be in his place tonight.” It is not put as a question.

You are in your place, and vote for a duty upon dogs.`; }},
    {t:'Give the boy a stool in the estate office.', note:'£40', go:() => { add({money:-40, goodwill:1});
      return `William Dodd has a stool in the estate office, at forty pounds, where ${stew()} sets him to copy the tithe accounts.

He copies them fair; and in doing so he finds eleven pounds that ${stew()} had not found.

${stew()} gives him the game book next, in which nobody has ever found anything.`; }},
    {t:'Tell Dodd you ask nothing of Ministers.', go:() => { add({goodwill:-2, standing:1});
      return `“I am an independent man, Mr Dodd. I ask for nothing.”

Dodd looks into his hat, and says that his father polled forty years for the old Earl, and never came away from the Castle empty-handed.

William goes for a soldier at Michaelmas; and Mr Dodd tells Pig Lane what the bounty was.`; }}]},

  {id:'member-whip', title:'A Note from Downing Street', x:() => `There is a note from Downing Street, by express, which has cost them eleven shillings.

“Mr ${S.sur}’s attendance is most earnestly requested on Thursday. A division of the first importance.”

The word earnestly is underlined three times. But it is the week of ${['the lambing', 'the hay', 'the harvest', 'the rent audit'][S.season]}, and London is fifty-eight miles.`,
    o:[{t:'Go up and vote with Ministers.', note:'£4 in chaises', go:() => { add({money:-4, standing:2});
      return `You post up on Wednesday, at four pounds in chaises.

The division is at three in the morning, when you walk through the lobby with two hundred and nine others; and at breakfast you read in the Chronicle what the question was.

The Secretary of the Treasury nods to you upon the stairs, and has your name right.`; }},
    {t:'Go up and vote against them.', note:'£4 in chaises', go:() => { add({money:-4, goodwill:2, standing:-1});
      return `You post up on Wednesday, and sit eleven hours; and then you go out with the Noes, who are sixty-one, and among whom Mr Whitbread counts you twice.

No more notes come from Downing Street that session; and the postmaster at Wyvern asks whether you are unwell.`; }},
    {t:'Stay at Hatherley.', go:() => { add({standing:-1, family:1});
      return `You stay.

Ministers carry it by forty; and the Courier prints a list of Members absent, in which you stand between a man with the gout and a man who is dead.

${['The last ewe lambs on Thursday night, and has twins.', 'The hay is carried on Thursday, dry.', 'The last load comes down the lane on Thursday.', 'The tenants pay on Thursday, and two of them in full.'][S.season]}`; }}]},

  {id:'member-committee', title:'Committee Room Nine', x:() => `You are named to the committee upon the Calder and Hebble Navigation Bill, which sits upstairs at eleven each morning, in a room with one window that does not open.

You have never seen the Calder, and neither has the chairman. Counsel for the bill has spoken three days; and counsel against it, who has a map twelve feet long, has not begun.`,
    o:[{t:'Sit it out.', go:() => { add({standing:1, family:-1});
      return `You sit nineteen mornings, and learn the fall of the Calder at eleven locks, in feet and inches.

The committee divides, four for the bill and three against; and you are one of the four, though you could not say why.

A Yorkshire Member presses your hand in the lobby, and at Christmas there comes a piece of blue broadcloth from Halifax.`; }},
    {t:'Pair with a Member on the other side and go home.', go:() => { add({family:1});
      return `Sir John Trelawny is against the bill, and wishes to fish; and you being for it, and wishing to go home, you pair with him, so that neither vote is counted.

You are at Hatherley by Friday, and the bill passes without the two of you.

He sends you a salmon in a rush basket, and you send him a hare.`; }},
    {t:'Sign the report unread.', go:() => { add({standing:-1});
      return `The clerk brings the report to Half Moon Street, in ninety pages, and shows you where to sign.

In August a mill-owner writes from Brighouse, that the new cut has taken his water; and he has your signature before him as he writes.

It is a long letter. He writes again in September, and again in October.`; }}]},

  {id:'member-petition', title:'The Maltsters of Wyvern', x:() => `Eleven maltsters of Wyvern have signed a petition against the malt duty, upon parchment, beginning “Humbly sheweth”; and Mr Gabb, the oldest of them, brings it to the Hall himself, wrapped in a clean shirt.

“We should wish it read out, sir. All of it. With the names.”

It is four feet long.`,
    o:[{t:'Present it and speak to it.', go:() => { add({goodwill:3});
      return `You present it upon a Friday, and say that the maltsters of Wyvern are loyal men, and cannot pay.

The Chancellor of the Exchequer is sorry to hear it; and the petition is ordered to lie upon the table, where it lies.

The duty goes up a shilling in the Budget. The maltsters send you a cask of old ale notwithstanding.`; }},
    {t:'Drop it in the bag behind the Chair.', go:() => { add({goodwill:1});
      return `There is a bag behind the Speaker’s chair for petitions; and into the bag you put it.

The Votes print one line. “A Petition of Maltsters of Wyvern was presented.”

Mr Gabb has the line framed, and hangs it over his kiln.`; }},
    {t:'Tell them the duty pays for the war.', go:() => { add({standing:1, goodwill:-2});
      return `“The King’s ships are built out of the malt duty, Mr Gabb.”

Mr Gabb wraps the parchment in the shirt again, and says that his malt was thought good enough for the fleet at the Nore.

The petition is taken up by the Member for Abingdon, who reads out all the names.`; }}]},

  {id:'member-bellamy', title:'A Hundred Irish Members', w:() => yr(1801, 1805), x:() => `The Irish Members are come over under the Union, a hundred of them, and no bench has been added.

A seat is kept by leaving a hat upon it at prayers; so that by four o’clock there is a hat upon every place, and gentlemen are walking about bareheaded.

Yours was moved on Tuesday, and found in the gallery; and where it had been, there was sitting a Member for Tipperary.`,
    o:[{t:'Come down for prayers and sit on your hat.', go:() => { add({standing:1});
      return `You are in the House at prayers every day for a month, and hear the Chaplain twenty-two times, when no other Member for the county has heard him once; and the Speaker remarks your attendance to the Serjeant.

The Member for Tipperary takes the place beside you. He has a snuff-box of the size of a brick, and you have the use of it.`; }},
    {t:'Have it out with the Irishman.', go:() => { add({goodwill:1});
      return `“Sir, you are in my place.”

“Sir, I am in Parliament. They told me it was all the one place.”

He moves up six inches; and upon six inches you sit for the session, while he calls you his honourable neighbour, and borrows your Order Paper.`; }},
    {t:'Spend the evenings at Bellamy’s.', note:'£9', go:() => { add({money:-9});
      return `Bellamy keeps the kitchen upstairs, where a Member may have a chop off the gridiron, and a pint of port, with the division bell over the door.

You dine there nineteen nights; and when the bell rings, you go down, and ask your neighbour which way.

The reckoning at the end of the session is nine pounds; and Bellamy says that Mr Pitt owes him more.`; }}]},

  {id:'member-bull', hot:true, title:'The Bull-Baiting Bill', w:() => yr(1800, 1802), x:() => `A bill is brought in to put down bull-baiting; against which Mr Windham will speak, who says that the bait is the poor man’s one sport, and that the bull enjoys it.

Wyvern baits a bull in the market place every fifth of November. The butchers find the bull; and the dog that pins him wears for the year a silver collar, older than the Town Hall.

There are letters. ${vicar()} writes that it is a scene of drunkenness; and four of the butchers hold plots.`,
    o:[{t:'Vote for the bill.', go:() => { add({goodwill:-2}); reg('gall',1);
      return `You vote for the bill, and it is lost by two; and Mr Windham crosses the floor to tell you that you have voted with the Methodists.

On the fifth of November the bull is baited as before. The butchers have named him; and ${(S.sur || '').toUpperCase()} is painted upon his flank in whitewash.`; }},
    {t:'Vote with Mr Windham.', go:() => { add({goodwill:2}); reg('gall',-1);
      return `The bill is thrown out by two, and one of the two is yours.

The butchers drink the Member’s health. ${vicar()} preaches upon the merciful man and his beast, looking over the Hall pew, and not at it.

In November the bull puts the collar dog through the window of the Bell.`; }},
    {t:'Be in the country that night.', go:() => { add({standing:-1});
      return `You are at Hatherley upon the night, and the bill is lost by two.

Both sides write to ask where you were, ${vicar().replace('The', 'the')} in two sheets, and the butchers in one line.

You go into Wyvern on the fifth of November, and stand at the back; where a butcher asks which side you have come to see.`; }}]},

  {id:'member-melville', hot:true, once:true, title:'Lord Melville', w:() => S.year === 1805, x:() => `Mr Whitbread moves to censure Lord Melville, who as Treasurer of the Navy let his paymaster keep the seamen’s money at Coutts’s, and play with it; and Lord Melville is Mr Pitt’s oldest friend.

The House sits until past four in the morning, and the candles are changed twice.

The Treasury has counted, and so has Mr Whitbread; and though neither will say what he makes it, both have looked twice at the Member for Wyvern.`,
    o:[{t:'Vote for the censure.', go:() => { add({goodwill:2, standing:-1});
      return `You go out with the Ayes. The tellers come to the table, with two hundred and sixteen upon each side.

The Speaker sits ten minutes without a word, his face of the colour of his wig; and then he gives his voice for the censure.

Mr Pitt pulls his little cocked hat down over his eyes, and the young men of his side, standing close round him, walk him out. Behind you a Welsh baronet gives a view-halloo.`; }},
    {t:'Vote with Mr Pitt.', go:() => { add({standing:2, goodwill:-1});
      return `You stay in with the Noes. The tellers come to the table, with two hundred and sixteen upon each side.

The Speaker sits ten minutes without a word, and gives his voice against Lord Melville.

Mr Pitt pulls his hat down over his eyes; and being four feet from him, you see that there are tears running out under the brim. Going out, he thanks you by another man’s name.`; }},
    {t:'Go home to bed.', go:() => { add({standing:-2});
      return `You leave at two, and walk to Half Moon Street.

The Chronicle has it at breakfast: two hundred and sixteen upon each side, the Speaker’s voice against Lord Melville, and Mr Pitt in tears.

On Saturday the Reading Mercury gives the list, with your name in italics under “Not in the House.”`; }}]},

  {id:'member-register', title:'The Dumb Members', w:() => S.year >= 1804, x:() => `Mr Cobbett’s Register has a list this week, headed “Gentlemen who have sat a whole Session and said Nothing.” There are a hundred and forty names, by counties, and Berkshire is near the top.

“WYVERN. Mr ${S.sur}. Is believed to be alive.”

Mrs Tamworth, who does not take the Register herself, has sent the copy over.`,
    o:[{t:'Make a speech.', go:() => { add({standing:1});
      return `You speak on Thursday against the hop duty, for eleven minutes.

The Register notices it. “Mr ${S.sur} of Wyvern has spoken. He is against a duty on hops. We preferred him dead.”

Henrietta sends that number to Mrs Tamworth.`; }},
    {t:'Write to the Register.', go:() => { add({goodwill:-1, standing:-1});
      return `You write that a Member may serve his constituents without troubling the House.

Mr Cobbett prints the letter entire, and nine columns in answer to it; having found out what a burgage plot fetches in Wyvern, and what was spent at the George.

The sum is right to the pound.`; }},
    {t:'Say nothing.', go:() => {
      return `You say nothing.

The list is printed again next session, with a hundred and thirty-one names still upon it, of which yours is one; and Mr Cobbett has kept the line about being alive.`; }}]},

  {id:'member-schools', hot:true, title:'Mr Whitbread’s Schools', w:() => yr(1807, 1808), x:() => `Mr Whitbread has a bill for a school in every parish, to give every poor child two years of reading and writing, out of the rates.

Mr Giddy speaks against it; who holds that learning would teach the labouring classes to despise their lot, and to read seditious pamphlets, and to be insolent to their masters.

Hatherley has a dame school, kept by Widow Pocock in her kitchen, at twopence a week. She can read. She cannot write.`,
    o:[{t:'Vote for the schools.', go:() => { add({goodwill:2});
      return `You vote for it, and the bill goes up to the Lords; where the Archbishop saying that it takes the children out of the hands of the Church, they throw it out.

Widow Pocock, hearing that the Squire voted for schools, puts her charge up to threepence.`; }},
    {t:'Vote with Mr Giddy.', go:() => { add({standing:1, goodwill:-2});
      return `You vote against. The bill passes without you, and dies in the Lords.

In the autumn there is a paper nailed to the church door, concerning the price of bread, and very ill spelt.

Mr ${stew()} names four men in the parish who can write, of whom he is himself one.`; }},
    {t:'Stay away, and give the dame ten pounds for slates.', note:'£10', go:() => { add({money:-10, goodwill:3});
      return `You give ten pounds to Widow Pocock, for slates, and pencils, and a writing-master out from Wyvern on Saturdays.

The writing-master begins with the Widow, who in a month can write her name.

At Christmas there comes a letter from the school, signed by nineteen children, and by Ann Pocock; and hers is the largest.`; }}]},

  {id:'member-curwen', hot:true, title:'Mr Curwen’s Bill', w:() => yr(1809, 1810), x:() => `Mr Curwen has a bill to stop the sale of seats in Parliament, by which a Member is to swear that he gave no money for his return.

The House is very full for it, and nobody looks at anybody.

Your own return for Wyvern cost nine hundred pounds${(S.mpWins || 1) > 1 ? ', and seven hundred each time since' : ''}. Tidmarsh’s bank has the drafts, and the landlord of the George has a ledger.`,
    o:[{t:'Vote for the bill.', go:() => { add({standing:1});
      return `You vote for purity of election, as do two hundred others, of eleven of whom you know what they paid.

The bill passes. It forbids a seat to be bought with money, and is silent upon beer, ribbons and dinners.

The landlord of the George reads it through at his own bar, and orders in forty barrels.`; }},
    {t:'Vote against it.', go:() => { add({goodwill:-2});
      return `You vote against; and you say in the lobby that a seat is property like any other.

On Saturday Sir Francis Burdett repeats it to a crowd in Palace Yard, naming nobody but “a Berkshire squire”.

There are four Berkshire squires in the House, and all four are asked about it at Sessions.`; }},
    {t:'Buy the ledger from the George.', note:'£20', go:() => { add({money:-20});
      return `The landlord brings the ledger to the Hall under his coat, for twenty pounds.

You read it with the door locked. Beer. Ribbons. Chairmen. “To Mr Dodd, for his trouble, 30 guineas.” “To a person, 50l.”

It goes upon the library fire a leaf at a time; and the landlord walks home whistling, not having said whether he keeps a copy.`; }}]},

  {id:'member-burdett', hot:true, once:true, title:'Burdett for Ever', w:() => S.year === 1810, x:() => `The House has voted Sir Francis Burdett to the Tower, for a libel upon itself; and he will not go, and has barred the door of 78 Piccadilly.

Half Moon Street is forty yards off. There is a crowd from the Green Park to Hyde Park Corner, which obliges every man who passes to take off his hat, and cry “Burdett for ever”; and windows not lit after dark are broken.

You voted on Thursday night. The landlady asks which way, meaning to decide about the candles when she knows.`,
    o:[{t:'For the Tower. No candles.', note:'£9', go:() => { add({money:-9, standing:2, goodwill:-2});
      return `You voted for the Tower, and the windows stay dark.

At ten a paving-stone comes through the parlour sash, and eleven more after it; and the landlady sits upon the stairs, with the plate basket in her lap.

On Monday the Life Guards clear Piccadilly with the flat of the sword, and the Serjeant, getting in by the area, takes Sir Francis away in a coach. The glazier’s bill is nine pounds.`; }},
    {t:'Against. Light every window.', go:() => { add({goodwill:2, standing:-1});
      return `You voted against; and the landlady puts two candles in every window, front and back.

The crowd gives three cheers for Number Eleven, and a man in a blue cockade is lifted up to shake your hand through the fanlight.

Sir Francis goes to the Tower on Monday. The candles are in your account at fourteen shillings; and your watch has not been seen since the man in the cockade.`; }},
    {t:'Go out by the mews and take the Bath coach.', go:() => { add({standing:-1, family:1});
      return `You go out by the mews. At the corner a man with a pole tells you to take off your hat; and you take it off, and say “Burdett for ever”, and upon his saying that he did not hear, you say it again.

You are at Hatherley on Sunday. The Mercury says that the Member for Wyvern has gone into the country for his health.`; }}]},

  {id:'member-flogging', hot:true, title:'Fifty Lashes for a Song', w:() => yr(1811, 1812), x:() => `The Liverpool Local Militia complained of their bread; and Private Taylor, having made a song about it, and had it printed, was tried the same day, and sentenced to two hundred lashes. He had fifty, and at the first his wife fainted.

Sir Francis Burdett moves to end flogging in the army.

${E() === 'army' && !F('edmundDead') ? 'Edmund writes from his regiment. “We flogged a man on Tuesday for selling his shirt. He had three hundred. The surgeon stopped it twice.” He gives no opinion.' : 'The Berkshire Local Militia drilled in Wyvern market place in May, and the drum-major carried the cats in a green baize bag.'}`,
    o:[{t:'Vote with Sir Francis.', go:() => { add({goodwill:3, standing:-2});
      return `You go into the lobby with Sir Francis. There are ten of you, and the teller counts upon his fingers.

Ninety-four against.

A general stops you upon the stairs, to tell you that he was flogged at Eton twice a week, and that it made him a general.`; }},
    {t:'Vote with the Horse Guards.', go:() => { add({standing:1, goodwill:-2});
      return `You vote with the ninety-four, and Sir Francis has ten.

The Secretary at War thanks the House, and says that the lash is seldom used, and that the men prefer it to confinement.

Private Taylor’s song is sold in Wyvern market at a halfpenny, and the ballad-woman sings it under the windows of the Bell. It has a good tune.`; }},
    {t:'Stay away.', go:() => {
      return `You are not in the House. Sir Francis has ten votes, and there are ninety-four against.

Mudge has the song, for which he gave a halfpenny at Wyvern, and he may be heard at it in the gun room; where he stops when you come in, and goes on when the door is shut.`; }}]},

  {id:'member-gas', hot:true, title:'The Gas Light and Coke Company', w:() => yr(1809, 1810), x:() => `Mr Winsor asks Parliament for a charter, to light London with smoke. He burns coal in an iron pot; and the smoke, going along pipes under the street, is set on fire at the end.

He has lit one side of Pall Mall already, with lamps that have no wick and no oil, and are very white.

The whale-oil merchants have petitioned against him, and so have the lamplighters; and Dr Wollaston of the Royal Society says that he might as well light London with a slice of the moon.`,
    o:[{t:'Vote for the charter.', go:() => { add({goodwill:1});
      return `You vote for it, and the bill is thrown out.

Mr Winsor brings it in again with a smaller capital, when it passes; and he sends a copper lamp to each of his friends in the House.

Yours is put up in the hall at Hatherley; and the nearest gas being fifty-eight miles off, Henrietta keeps a candle in it.`; }},
    {t:'Vote against.', go:() => { add({standing:1});
      return `You vote against. The bill is thrown out, and the whale-oil merchants give a dinner at the London Tavern.

You walk home by Pall Mall, of which Mr Winsor lights one side, and the parish the other.

Under his lamps a lady is reading a letter; and upon the parish side a gentleman walks into a post.`; }},
    {t:'Go and look at Pall Mall first.', go:() => { add({goodwill:1});
      return `You go at ten at night, and find a crowd; and a boy puts his finger to the flame, to see if it is hot, and it is.

Mr Winsor is there, in a white waistcoat, who tells you that the gas is wholesome to the lungs, and that he would pipe it into sick-rooms.

You vote for him on account of the light, and say nothing of the lungs.`; }}]},

  {id:'member-bellingham', hot:true, once:true, title:'The Lobby, the Eleventh of May', w:() => S.year === 1812 && S.season >= 1, x:() => `It is a quarter past five on Monday, and you are upon the lobby stairs, with a paper from the Wyvern turnpike trustees in your hand.

There is a crack, as of a door slammed. Mr Perceval comes two steps into the lobby, and says “Oh”, and falls upon his face.

A tall man in a brown coat sits down upon the bench by the fire, with a pistol beside him. “I am the unfortunate man,” he says, before anybody has asked him.

The Minister is carried into the Speaker’s secretary’s room, and is dead before the surgeon comes.`,
    o:[{t:'Stay, and vote the family its fifty thousand.', go:() => { add({standing:1});
      return `The House votes fifty thousand pounds to the twelve children, and two thousand a year to Mrs Perceval; and you vote for it, and nobody votes against.

The man is named Bellingham. He was a merchant, who lay five years in a Russian prison, and wrote to every office in Whitehall, and by every office was answered.

He is tried on Friday, and hanged on Monday.`; }},
    {t:'Go to the trial.', go:() => { add({standing:1});
      return `The trial is on Friday, at the Old Bailey, where the Sheriff finds you a seat.

Bellingham speaks for an hour, quite calm. He had a claim upon the Government; and a clerk at the Treasury having told him that he might take what measures he thought proper, he took them.

The jury is out fourteen minutes. He is hanged on Monday at eight; and to that you do not go.`; }},
    {t:'Take the night mail home.', go:() => { add({family:2, standing:-1}); reg('henrietta',1);
      return `You take the night mail from Piccadilly. The guard has heard; and by Hounslow the whole coach has heard.

At Reading there are men in the street at four in the morning, one of whom calls up to ask if it is true; and when the guard says that it is, somebody cheers.

At Hatherley Henrietta turns you round twice in the hall, to look at you, and says that you are not to go back. The lodgings are paid until midsummer.`; }}]}
];
pooled('member', MEMBER, 'mem', {from:1796, to:1815, weight:8, repeatGap:3, cond:() => F('mp')});

/* ---- The county ----
   Things that happen in Berkshire whether the squire likes it or not. Those marked hot belong to their year
   and are taken from docs/SOURCES.md; the rest may come in any year. */
const kenMan = () => { const f = tenantOf('kennet'); return f ? Called(f) : 'The tenant'; };
const COUNTY = [
  {id:'county-hen', hot:true, once:true, title:'The Hen at the Turnpike', w:() => yr(1806, 1807), x:() => `A pedlar at the back door has news from Leeds, of a hen there that lays eggs with writing upon the shell, “Crist is coming”, which the public pays a penny to see.

By the month’s end Hatherley has a hen. She belongs to Widow Tubb at the turnpike cottage; and her egg says REPENT, with the N backwards.

There are forty people in the lane, and Widow Tubb has put a plate by the door.`,
    o:[{t:'Pay your penny and look.', go:() => { add({goodwill:1});
      return `You pay your penny. The egg lies in a basin upon the dresser, on a clean cloth, with REPENT upon it in brown; and the hen, a common barn-door fowl, is under the table, with a ribbon on her leg.

Widow Tubb takes eleven shillings in the week. Then the hen goes broody, and lays nothing; and the Widow says that that is a sign too.`; }},
    {t:'Send the curate to examine the egg.', go:() => { add({goodwill:-1, standing:1});
      return `The curate takes the egg to the window, and smells it, and wetting his finger, rubs.

“Vinegar, ma’am. A quill dipped in vinegar. It eats the shell.”

Widow Tubb has no quill, and cannot write. But she has a grandson of nine, who goes to the dame school; and he being fetched from behind the pigsty, and set to write REPENT upon a slate for the curate, the N is backwards.`; }},
    {t:'Buy the hen.', note:'£1', go:() => { add({money:-1});
      return `You give a guinea, and the hen comes up to the Hall in a basket.

Mrs Bunce puts her in the yard with the others, where she lays a brown egg every second day, with nothing upon any of them.

By Michaelmas Mrs Bunce cannot say which hen she was; and there was a fowl at table on Sunday.`; }}]},

  {id:'county-goldcup', hot:true, once:true, title:'Ascot Heath', w:() => S.year === 1811 && S.season === 1, x:() => `It is the Thursday, upon Ascot Heath. The Gold Cup is two miles and a half, for a hundred guineas; and the Queen is in the stand with five Princesses, and the Prince Regent on horseback in a green coat.

${K() === 'vane' ? 'Captain Vane has written, that Smallhopes cannot lose, and that he has it from the horse’s own groom.' : 'Mr Loveday has it from a groom that Smallhopes cannot lose.'}

The ring lays three to one against Smallhopes, and two to one Jannette; and there is a man upon a stool who will take twenty pounds.`,
    o:[{t:'Twenty pounds on Smallhopes.', note:'£20', go:() => { add({money:-20});
      return `Smallhopes comes in first by a length; and having won sixty pounds, you start for the stool.

But the Stewards are sent for. The owner of Smallhopes has not paid his stake; and the horse is struck out, and the Cup goes to Jannette.

The man upon the stool keeps your twenty, and says that he is sorry for it, laughing.`; }},
    {t:'Twenty pounds on Jannette.', note:'£20', go:() => { add({money:40});
      return `Jannette is beaten a length by Smallhopes, and you tear your ticket across.

But the Stewards are sent for; and the owner of Smallhopes never having paid his stake, the Cup is given to Jannette.

You find both halves in the grass. The man upon the stool holds them together to read the number, and pays forty pounds upon them.`; }},
    {t:'Keep your money and look at the Queen.', go:() => { add({family:1});
      return `You stand at the rails by the Royal stand, where the Queen takes snuff, and the Princesses eat cherries out of a basket.

The Regent rides down the course before the race. He is twenty stone; and the horse, a grey, sweats at a walk.

Smallhopes is first past the post, and is struck out; and all round you there are men tearing up paper, and other men upon their knees looking for it.`; }}]},

  {id:'county-hot', hot:true, once:true, title:'Hot Wednesday', w:() => S.year === 1808 && S.season === 1, x:() => `It is Wednesday the thirteenth of July; and by noon the glass in the hall stands at ninety-six, where it has never stood.

Twenty acres of hay are down in Kennet Meadow, and the mowers have left their scythes, and gone under the hedge. The butter has run through the dairy shelf, and a post-horse lies dead upon the Bath road.

Mr ${stew()} says that the hay must be carried by Friday, not liking the look of the west.`,
    o:[{t:'Rest the men until evening.', go:() => { add({money:-30, goodwill:3});
      return `The men lie under the hedge until six, and carry until dark, and are at it again by four on Thursday.

On Friday at two it comes up black out of Wiltshire, with hailstones of the size of pullets’ eggs, and half the meadow still in cock.

Thirty pounds of hay is spoiled, and nobody is dead; and ${stew()} enters both in the book.`; }},
    {t:'Keep them at it.', go:() => { add({goodwill:-4});
      return `They carry through the heat, for a shilling a man over, and the meadow is cleared by Thursday night.

But at three on Wednesday old Tom Ilsley, who was sixty-eight, and had mown that meadow fifty-one summers, sits down against a wagon wheel, and does not get up.

The hail comes on Friday, when the rick is thatched. There are forty men at the burying.`; }},
    {t:'Carry by moonlight.', note:'£4 in beer', go:() => { add({money:-4, goodwill:1});
      return `The men sleep until nine, and carry from ten at night to five in the morning, the women raking by lantern; and it costs four pounds in beer.

At two a wagon goes into the ditch, with nobody under it.

The meadow is clear on Friday morning; and when the hail comes, though it breaks forty panes at the Hall, there is not a cock of hay out.`; }}]},

  {id:'county-scouring', hot:true, title:'The Scouring of the Horse', w:() => [1803, 1808, 1813].includes(S.year) && S.season === 1, x:() => `A bill is posted at the Bell.

“WHITE HORSE HILL. The Scouring of the Horse will be on Whit-Monday. A Flitch of Bacon to be run for by Asses. A Cheese to be run for down the Manger. A Hat for Men in Sacks, every Man to bring his own Sack. Cart-horses to race in their Harness and Bells, the Carters to ride in Smock Frocks without Saddles. No Whipping allowed.”

It is nineteen miles; and your carter, who has read the bill through twice, is standing beside Boxer with his hat off.`,
    o:[{t:'Enter Boxer and the carter.', go:() => { add({goodwill:2});
      return `Boxer runs in his bells. Nine start; and there is crossing, and there is jostling, but there is no whipping.

Boxer is second to a mare from Lambourn; and the carter, coming off at the post, is second too.

He has a new whip, and a split lip; and he hangs the whip up in the stable, saying that it is too good to use.`; }},
    {t:'Give a guinea to the prizes and go and look.', note:'£1', go:() => { add({money:-1, goodwill:1});
      return `Your guinea buys a waistcoat, for the man who can take a bullet out of a tub of flour with his mouth.

Eleven try; and a sawyer from Uffington has it at the fourth dip, and is white to the shoulders.

There are thirty thousand people upon the hill. The cheese goes down the Manger with forty men behind it, and is got by a waiter from Faringdon, who went down upon his back.`; }},
    {t:'Keep man and horse at home.', go:() => { add({goodwill:-1});
      return `“Whit-Monday is a working day, Carter.”

“Yes, sir.”

On Monday the stables are empty by five; and the men are back on Tuesday at noon, and nobody says where he has been. But Boxer has a ribbon plaited in his tail, which the carter, seeing you look at it, takes out.`; }}]},

  {id:'county-flood', hot:true, once:true, title:'The Water Out', w:() => S.year === 1809 && S.season === 0, x:() => `The frost broke on the twenty-fourth of January, and the snow went in a day.

The Kennet is half a mile wide at Kennet Bottom, where ${kenMan()} is at an upper window, and the cows are swimming in the yard.

The six cottages by the ford have water to the bedroom sills, and there are people upon the thatch; one of whom, a woman, has brought her clock up with her.`,
    o:[{t:'The people first. Bring them to the Hall.', note:'£20', go:() => { add({money:-20, goodwill:4});
      return `Two boats work until dark, and thirty-one people are brought off the roofs, and up to the Hall.

They sleep in the servants’ hall and the laundry, and Mrs Bunce feeds them a fortnight, for twenty pounds. The clock is put upon the kitchen dresser, where its owner winds it at nine each night.

Eleven cows are drowned at Kennet Bottom, and are counted from the upper window.`; }},
    {t:'The stock first.', go:() => { add({goodwill:-3});
      return `The boats go to the farm; and the cows, being roped by the horns, are swum to the bank one at a time, and all but two saved.

The people sit upon the thatch until dark, and the curate takes them bread in a punt.

They are fetched off by lantern at nine; and the woman will not step into the boat until her clock has been handed down first.`; }},
    {t:'Send to Newbury wharf for the barge-men.', note:'£10', go:() => { add({money:-10, goodwill:2});
      return `You give ten pounds to four barge-men from Newbury wharf, who pole a coal lighter up over the meadows, and in the one voyage take the people off the roofs, and the cows out of the yard; the woman with the clock sitting between two heifers.

The water is three weeks going down, in which time there is no christening, wedding or burying; and ${vicar().replace('The', 'the')} writes it in the register.`; }}]},

  {id:'county-forbury', hot:true, once:true, title:'The King’s Birthday at Reading', w:() => S.year === 1809 && S.season >= 1, x:() => `It is the King’s birthday, at Reading, where the Volunteers and the new Local Militia parade in the Forbury, and are both afterwards given beer.

By four o’clock the Volunteers are calling across the grass; for the Militia were promised two guineas a man, and have not had it.

“Boys, stick out for your guineas!”

Forty militiamen have grounded their arms, of whom fourteen are Hatherley men. Major Simonds is speaking, and nobody can hear him. You are a magistrate, and you have your hat on.`,
    o:[{t:'Go among the Hatherley men.', go:() => { add({standing:2, goodwill:1});
      return `You walk across the grass. You know the fourteen by name, and you say each name.

“Pick it up, Will Tubb.”

He picks it up, and thirteen more after him; so that the Woodley Cavalry, riding in at five with swords drawn, find fourteen men standing to attention, and twenty-six sitting down.`; }},
    {t:'Pay the fourteen their guineas yourself.', note:'£29', go:() => { add({money:-29, goodwill:3});
      return `Fourteen men at two guineas is twenty-nine pounds eight; and you count it out of your own pocket-book, upon a drum-head.

The fourteen fall in. The other twenty-six ask who that gentleman is, and where he lives.

In September the Pay Office sends down the bounty; and the Minister having cut it, it is one guinea a man. Nobody mentions your fourteen.`; }},
    {t:'Stand back and let the cavalry come.', go:() => { add({standing:-1});
      return `You stand under the Abbey gateway with two other justices.

The Woodley Cavalry ride in at five; upon which the Militia take up their arms, and the Volunteers go home singing.

Lord Liverpool writes that such conduct cannot go unpunished; and it is the Volunteers who are broke. They hand in their coats at the Town Hall, and several coats come in without buttons.`; }}]},

  {id:'county-barclay', hot:true, once:true, title:'A Thousand Miles in a Thousand Hours', w:() => S.year === 1809 && S.season >= 1, x:() => `Captain Barclay has engaged to walk a thousand miles in a thousand hours at Newmarket, one mile in every hour, day and night, for a thousand guineas; and having begun on the first of June, he has done six hundred.

He walks in a flannel jacket, with pistols in his belt, along a course lit by lamps upon poles; and the lamps are shot at. On the twenty-sixth day he fell asleep walking, and his man beat him awake with a stick.

At the Bell they lay two to one that he drops, and the landlord holds the stakes in a tea-pot.`,
    o:[{t:'Fifty pounds that he does it.', note:'£50', go:() => { add({money:100});
      return `You put fifty pounds into the tea-pot.

He walks his thousandth mile on the twelfth of July, at three in the afternoon, thirty-two pounds lighter; and having slept seventeen hours, he joins his regiment for Walcheren.

The landlord counts a hundred pounds onto the bar beside your fifty, and counts it slowly, most of the room having gone the other way.`; }},
    {t:'Fifty pounds that he drops.', note:'£50', go:() => { add({money:-50});
      return `You lay fifty pounds that he drops.

He does not drop. On the twelfth of July he walks the thousandth mile in twenty-two minutes, and the bells of Newmarket are rung.

Your fifty goes to a corn-factor from Wantage, who buys the room a bowl of punch out of it; and you have a glass.`; }},
    {t:'Go to Newmarket and see it.', note:'£12', go:() => { add({money:-12});
      return `It costs twelve pounds in chaises, and a bed over a saddler’s, there not being another bed in ten miles.

At two in the morning you stand at the rope. A big man walks by in a flannel jacket, with his eyes shut, and Gully the prize-fighter behind him; and a lamp goes out with a bang.

An hour later he walks by again. You stay for nine miles, and they are all the same mile.`; }}]},

  {id:'county-crapper', hot:true, once:true, title:'Mr Crapper and the Generals', w:() => yr(1809, 1810), x:() => `Mr Crapper is a chemist at Wantage, and agent besides for the French officers upon parole there, who may walk one mile out upon any road.

Two French generals have been driven ten miles to dine with Sir John Throckmorton, in a carriage lent by a magistrate; and Mr Crapper has arrested both generals.

The bench is asked to support him. Mr Price, J.P., has written. “Being a low man himself, he assumes a power which he is too ignorant to exercise.”

The papers are before you at Sessions.`,
    o:[{t:'Support Mr Crapper.', go:() => { add({standing:-1, goodwill:1});
      return `“The mile is the mile, gentlemen. A general may count it as well as an ensign.”

The bench hears you out, and votes the other way, nine to one; and at dinner the decanter stops at Mr Price.

The Transport Board has the generals marched to Wincanton. Mr Crapper sends you a box of his lozenges, with his respects.`; }},
    {t:'Vote with the bench.', go:() => { add({standing:1});
      return `The bench declines to support the agent, ten to none.

The Transport Board supports him, and the generals are marched to Wincanton behind a corporal.

Sir John Throckmorton, having two places empty at his table, asks two of the magistrates.`; }},
    {t:'Ask who measured the mile.', go:() => { add({standing:1, goodwill:1});
      return `“Who measured the mile, and from what door?”

Nobody knows. A surveyor is sent with a chain; and the milestone upon the Faringdon road is found to stand four hundred yards beyond the mile, having been moved, with the moss upon the south side.

It is put back. For a month the French officers walk to the stone, and touch it, and turn; and then it is found four hundred yards out again.`; }}]},

  {id:'county-balloon', hot:true, once:true, title:'A Descent in the Home Pasture', w:() => yr(1810, 1811) && S.season >= 1 && S.season <= 2, x:() => `A balloon comes over the Down at six in the evening, striped crimson and yellow, and losing height; and it comes down in the home pasture, where the cows go through the hedge into the barley, and where Mudge is, with a gun.

A man in a blue coat climbs out of the basket, and takes off his hat.

“Mr Abel Finch, aeronaut, from Oxford. Forty miles in fifty minutes. Might I ask what county this is?”

He has a barometer, a cold fowl, and a cat.`,
    o:[{t:'Give him his dinner and a cart to Wyvern.', go:() => { add({family:2, goodwill:1});
      return `He dines at the Hall, and eats for two; and he tells Henrietta that at two miles up a man hears dogs barking, and nothing else.

${kittyAtHome() ? 'Kitty' : 'Henrietta'} asks what the cat was for. It was to see whether a cat minds; and it minds.

The balloon goes to Wyvern upon a wagon, in a heap. The cat stays at the Hall, and will not go near a basket of any kind.`; }},
    {t:'Charge him for the barley.', note:'£6 to you', go:() => { add({money:6});
      return `Mr ${stew()} walks the barley, and puts it at six pounds; and Mr Finch pays in Oxford notes.

He says that the Dean of Christ Church never charged him, and that the Dean had less barley.

Eleven men fold the silk. The cows will not go back into the pasture until it has rained.`; }},
    {t:'Go up in it on a rope.', note:'£5', go:() => { add({money:-5, standing:1, family:-1});
      return `There is gas left for one; and for five pounds, with eleven men holding the rope, you go up two hundred feet.

You see the Hall roof, and where it wants lead; and you see Lord Cullerne’s woods, and that they are a good deal larger than yours.

The rope slips a yard, and you are heard in the village. Henrietta has watched from the terrace, through her fingers.`; }}]},

  {id:'county-coat', hot:true, once:true, title:'The Newbury Coat', w:() => S.year === 1811 && S.season >= 1 && S.season <= 2, x:() => `Sir John Throckmorton has bet a thousand guineas upon a coat. Mr Coxeter of Greenham Mills is to take the wool off the sheep at sunrise, and Sir John is to sit down to dinner in it at sunset.

It is the twenty-fifth of June. Two Southdowns were shorn at five this morning, and there are five thousand people in the mill yard.

By noon the wool is spun, and upon the loom; and at the gate they lay even money that the coat is upon his back by seven.`,
    o:[{t:'Twenty pounds on the coat.', note:'£20', go:() => { add({money:20});
      return `The cloth is off the loom by four, and is dyed, dried and pressed; and Mr White and nine tailors sit down to it, cross-legged upon a table.

At twenty past six Sir John puts it on. It is damson-coloured, and still warm.

You take twenty pounds off a clothier from Trowbridge, who says that it cannot be done, and says it with the coat in front of him.`; }},
    {t:'Twenty pounds against.', note:'£20', go:() => { add({money:-20});
      return `You lay twenty pounds that wool cannot be dry by seven.

It is dry by five; and at twenty past six Sir John puts on a damson hunting coat, and walks about in it, and five thousand people cheer a coat.

You pay a clothier from Trowbridge. The two sheep are roasted whole in the yard; and the man who carves, giving you a slice, says that it is off the one that made the sleeves.`; }},
    {t:'Send Coxeter a fleece of your own.', note:'£4', go:() => { add({money:-4});
      return `You send Mr Coxeter a Hatherley fleece, and four pounds, to make it up at his leisure.

Sir John dines in his coat at seven, with forty gentlemen, and a hundred and twenty gallons of strong beer go round the yard.

Yours comes in November, by the wagon; so that it is thirteen hours for a baronet, and five months for a squire. It is a good coat. It is brown.`; }}]},

  {id:'county-hocktide', once:true, title:'Hock Tuesday', w:() => S.season === 0, x:() => `It is Hock Tuesday; and having business at Hungerford, you have driven in with Henrietta.

Two men are coming down the High Street with poles, dressed in flowers and ribbons, and each with an orange stuck upon the top; and behind them walks a third, with a sack of oranges, and a feather in his hat.

They are the Tutti-men, who call at every house for a penny from the master, and a kiss from the lady. They have stopped at the step of the gig; and they are looking at Henrietta.`,
    o:[{t:'A penny and a kiss. It is the custom.', note:'£1 for the punch', go:() => { add({money:-1, family:1, goodwill:1});
      return `You give the penny, and Henrietta her cheek; and the Orange Man bows, and hands her an orange.

“We don’t know the gentleman,” says the first Tutti-man. Now a stranger must be shod; and a blacksmith, taking your boot upon his knee, drives a nail at the heel, until you shall cry “Punch”.

You cry it at the second blow, the punch being a guinea for the company. Henrietta eats her orange going home, and does not offer you a piece.`; }},
    {t:'A shilling, and the lady keeps her kisses.', go:() => { add({family:-1});
      return `“A shilling, and the lady keeps her kisses.”

They take the shilling; and the Orange Man gives Henrietta her orange all the same.

“I was not asked,” she says, a mile out of the town.`; }},
    {t:'Drive on.', go:() => { add({goodwill:-1});
      return `You touch up the horse. The Tutti-men step back; and the Orange Man throws an orange after the gig, which lands in Henrietta’s lap.

At the bridge a blacksmith is waiting, with a hammer, who walks beside the wheel as far as the turnpike, looking at your boots.

Your business at Hungerford takes four hours, nobody whom you came to see being at home.`; }}]},

  {id:'county-lottery', title:'The State Lottery', w:() => S.year >= 1798, x:() => `The State Lottery begins drawing at Guildhall on Monday fortnight, with twenty thousand tickets, and two prizes of twenty thousand pounds.

The Wyvern stationer is agent for Bish of Cornhill; and a whole ticket is eighteen pounds, and a sixteenth one pound six.

“Dr Mitford of Reading had the twenty thousand in ’97, sir. His little girl chose the number. Two, two, two, four.”

He has the tickets fanned out upon the counter.`,
    o:[{t:'A whole ticket.', note:'£18', go:() => { add({money:-18});
      if (chance(0.12)) { add({money:50, family:1});
        return `You take a whole ticket, at eighteen pounds, and Henrietta chooses the number.

The Blue-coat boy draws it upon the ninth morning, for fifty pounds.

The stationer walks out to the Hall with the news himself, and stays in the passage until he is given something.`; }
      return `You take a whole ticket, at eighteen pounds, and Henrietta chooses the number.

It is drawn a blank upon the first morning.

The stationer says that the first morning is thought the luckiest to lose on; and he has the next lottery’s tickets in his pocket.`; }},
    {t:'A sixteenth.', note:'£1', go:() => { add({money:-1});
      if (chance(0.25)) { add({money:1});
        return `Your number comes up a twenty-pound prize. Now a sixteenth of twenty pounds is one pound five, from which Bish stops a shilling for postage; so that having laid out one pound six, you have one pound four.

Henrietta says that you have won, and tells the Tamworths that you have won.`; }
      return `It is Number 11,307, and a blank; and a sixteenth of a blank is a blank.

The stationer says that the other fifteen gentlemen bore it very well.`; }},
    {t:'Buy a quire of paper and go home.', go:() => {
      return `You buy a quire of post paper, for ninepence.

One of the twenty thousands goes to nine footmen in Portman Square, who clubbed for a ticket; and the Mercury prints the number.

Henrietta reads it out, and asks what number you would have chosen; and when you have told her, she runs her finger down the column, and says nothing.`; }}]},

  {id:'county-quack', title:'The Cordial Balm of Gilead', x:() => `A yellow chariot is drawn up in Wyvern market place, with a black servant in a turban beating a drum upon the box.

Dr Tolley sells the Cordial Balm of Gilead, at half a guinea the bottle, which cures the nerves, the liver, the consequences of youthful error, and the staggers in horses. He has a letter from a Duchess, and holds it up, nobody being near enough to read it.

He has sold forty bottles since ten. Mr Ferris the surgeon is at the back of the crowd, with his arms folded.`,
    o:[{t:'Buy two bottles.', note:'£1', go:() => { add({money:-1, family:1});
      return `You give a guinea for two, one for Henrietta’s nerves, and one for the grey mare.

Henrietta takes a glass at night, and sleeps nine hours, and comes down singing; and the mare, who has hers in a mash, lies down in the yard.

Ferris smells the cork. “French brandy and cardamoms, sir. The Bell will sell it you at three shillings.”`; }},
    {t:'Have him up as a vagrant.', go:() => { add({standing:1, goodwill:-2});
      return `You send the constable; to whom Dr Tolley shows a medicine licence, a hawker’s licence, and a receipt for the stamp duty upon forty gross of bottles.

He has paid the King more this year than you have.

He sells sixty bottles before dark, and tells the crowd that the faculty and the magistracy have persecuted him in nine counties.`; }},
    {t:'Give Ferris a guinea to find what is in it.', note:'£1', go:() => { add({money:-1});
      return `Ferris buys two bottles with your guinea, and takes them home.

He is back on Thursday. It is brandy, and cardamom, and a little tincture of cantharides. “It will do what brandy does, sir.”

He has not brought the bottles, the analysis, he says, having used them up.`; }}]},

  {id:'county-fight', title:'A Fight on the Common', w:() => !F('enclosed'), x:() => `There is to be a fight upon Hatherley Common on Tuesday, between the Wyvern butcher and a Bristol man, for twenty-five guineas a side.

A prize-fight is a breach of the peace, and you are the nearest magistrate; and four thousand people are looked for, and eleven coaches from London.

The constable has come to ask what he is to do. He has two pounds upon the butcher.`,
    o:[{t:'Stop it.', go:() => { add({standing:1, goodwill:-3});
      return `You ride onto the Common at noon, with the constable, and read the proclamation.

Four thousand people hear you out. Then the stakes are pulled up; and the whole crowd walks two miles west, and over the county stone into Wiltshire, and pitches the ring again forty yards beyond it.

You sit your horse upon the Berkshire side, from which you can see quite well.`; }},
    {t:'Have business at Reading on Tuesday.', go:() => { add({goodwill:1, standing:-1});
      return `You have business at Reading on Tuesday.

The butcher is beaten in thirty-four rounds, and fifty-one minutes, and goes home upon a hurdle; and the constable has lost his two pounds.

On Wednesday the Common is trodden as flat as a floor, and the cottagers pick up eleven shillings in coppers, a watch, and a set of teeth.`; }},
    {t:'Go, and lay ten pounds on the butcher.', note:'£10', go:() => { add({goodwill:1, standing:-1});
      if (chance(0.5)) { add({money:10});
        return `You lay ten pounds upon the butcher, with a gentleman from London in a white hat.

The Bristol man has the better of twenty rounds. But in the twenty-first the butcher hits him under the ear, and he does not come to time.

The gentleman in the white hat pays, and asks whether there is a magistrate in these parts; and you say that there is one somewhere.`; }
      add({money:-10});
      return `You lay ten pounds upon the butcher, with a gentleman from London in a white hat.

The butcher goes home upon a hurdle in the thirty-fourth round.

The gentleman in the white hat takes your ten pounds, and asks your name for his book; and you give him Mr Tamworth’s.`; }}]},

  {id:'county-wife', once:true, title:'Sold in the Market', x:() => `It is Wyvern market; and a man is leading a woman through the beast-pens by a halter, a new one, tied about her waist.

He is Job Ilsley, a hurdle-maker, and she is his wife. He has paid the clerk of the market fourpence toll, as for a heifer; and he puts her up at five shillings.

She is about thirty, and has her best bonnet on, and is looking steadily at a carter by the pump.

“It is not law,” says ${vicar().replace('The', 'the')} beside you. “They all believe it is.”`,
    o:[{t:'Stop the sale.', go:() => { add({standing:1, goodwill:-2});
      return `You go into the pen as a magistrate, and stop it.

Ilsley takes off the halter. His wife tells you that she has been three years getting him to market; and the carter by the pump puts five shillings back in his pocket.

She walks to the carter’s cottage that night with no sale at all. Ilsley keeps the halter, and asks the clerk for his fourpence.`; }},
    {t:'Let it go on.', go:() => { add({goodwill:1});
      return `The carter bids five shillings, and nobody bidding against him, a quart of beer is thrown in for luck.

Ilsley hands over the halter end; and the carter takes it off her, and gives her his arm, and all three go into the Bell together.

The clerk enters it in the toll book. “One wife, 5s. Toll 4d.” The line above is a heifer, and the line below nine ewes.`; }},
    {t:'Bid six shillings.', go:() => { add({family:-1, goodwill:1});
      return `You bid six shillings.

The market goes quiet. The woman looks at you, and then at the carter; and the carter goes red, and bids seven, of which he has to borrow two.

You let him have her. Henrietta has heard of it before you are home, and asks what you would have done at eight.`; }}]},

  {id:'county-bounds', once:true, title:'Beating the Bounds', w:() => S.season === 0, x:() => `It is Rogation Monday, when the parish walks its bounds; ${vicar().replace('The', 'the')} going first in his surplice, and after him the churchwardens with white wands, forty men, and nine boys.

At each boundary stone a boy is taken by the heels, and bumped upon it, and has a penny; so that he shall remember the place when he is old.

At the ninth stone there is a new oak paling. It is Lord Cullerne’s; and it runs six yards upon the Hatherley side for a quarter of a mile, with the stone behind it.`,
    o:[{t:'Have it down.', go:() => { add({goodwill:3}); reg('cullerne',-2,'You pulled down his paling on Rogation Monday');
      return `“That is the parish’s six yards. Have it down.”

Forty men have it down in an hour, and are very willing; and a boy is bumped upon the stone, and has twopence.

The Castle’s attorney writes on Thursday. By Friday the pales are stacked at your lodge, and counted; and Lord Cullerne’s man, having counted them again, gives a receipt.`; }},
    {t:'Write to the Castle.', go:() => { add({standing:-1});
      return `You write that there appears to be some mistake as to the line.

The Earl’s agent answers in a fortnight, that his lordship’s surveyor is satisfied, and encloses a plan; upon which plan the stone has moved.

Next Rogation the boys are bumped against the paling.`; }},
    {t:'Bump a boy on the paling and go on.', go:() => { add({goodwill:-2}); reg('cullerne',1);
      return `There is no getting at the stone; and the smallest boy is bumped against the paling, and has his penny.

The churchwardens look at you. ${vicar()} reads the Gospel at the paling.

At the beer afterwards the oldest man in the parish, who has a Castle rabbit in his pocket, says that the bound was always at the paling.`; }}]},

  {id:'county-elephant', title:'The Elephant at the Bridge', w:() => S.year >= 1798, x:() => `Mr Polito’s Menagerie is upon the Bath road, of nine caravans, a lion, two kangaroos, and an elephant on foot.

The elephant has come to Hatherley bridge, and put one foot upon it, and taken the foot off; and he will not cross.

There are four wagons stopped behind him, and the Bristol mail. His keeper asks leave to take him through the river at your water-meadow; but the meadow is laid up for hay, and the elephant weighs four tons.`,
    o:[{t:'Let him through the meadow.', note:'£8 of hay', go:() => { add({money:-8, goodwill:3});
      return `He goes down through the meadow, and into the river, and stands in the middle, and will not come out; and he squirts the mail coach.

It is an hour, with the parish upon the bank, before Mr Polito’s man gets him out with a loaf.

${stew()} measures the footprints, each of which is a foot and a half across, and nine inches deep; and counting two hundred and twelve, he puts it at eight pounds of hay.`; }},
    {t:'Four guineas for the meadow. One a foot.', note:'£4 to you', go:() => { add({money:3});
      return `“Four guineas. One a foot.”

Mr Polito pays in gold; and the elephant goes through the river, and up the far bank, taking a gate with him.

One of the four guineas is bad. Mr Polito is by then at Marlborough.`; }},
    {t:'He must cross the bridge as others do.', go:() => { add({goodwill:-1});
      return `The keeper tries beer, and a bun, and walking over first himself, backwards.

At four o’clock the elephant turns round, and sets off towards Newbury; and the nine caravans turn after him, one at a time, in the width of the road.

The Bristol mail is three hours late, and the guard writes “Elephant” in the time-bill.`; }}]},

  {id:'county-band', title:'The West Gallery', w:() => S.year >= 1806, x:() => `The church band sits in the west gallery: a bassoon, a clarinet, two fiddles, and the blacksmith upon the serpent. They have played the Old Hundredth at the one pace for thirty years, and it is not the pace of the singers.

${vicar()} has a printed paper from Flight and Robson, of a barrel organ, at thirty pounds, with ten psalm tunes upon the barrel, and a handle that a child may turn.

The band have heard of it; and on Sunday they played the people out to “The Girl I Left Behind Me”.`,
    o:[{t:'Buy the organ.', note:'£30', go:() => { add({money:-30, standing:1, goodwill:-3});
      return `The organ comes from London in three cases, at thirty pounds, and the clerk’s boy turns the handle.

The band sit below in their Sunday coats, with their arms folded. At the third psalm the barrel sticks, and plays the first line of the Easter Hymn eleven times.

The blacksmith goes up the gallery stairs. There is one blow, and the organ plays on; and he comes down, and folds his arms again.`; }},
    {t:'Buy the band a new bassoon.', note:'£4', go:() => { add({money:-4, goodwill:3});
      return `You give four pounds for a bassoon from Reading, the old one having been mended with pitch and a bootlace.

On Sunday the band play the Old Hundredth, and play it faster, to show the bassoon; by which the congregation is left two lines behind.

${vicar()} puts the printed paper away in his sermon case, where at Easter it is seen again.`; }},
    {t:'Leave it to the vestry.', go:() => { add({goodwill:1});
      return `The vestry meets in the church porch, of eleven ratepayers, four of whom are the band, and two are fathers of the band.

The organ is lost by seven to four; and the vestry votes the blacksmith five shillings for a new mouthpiece.

On Sunday the band play the people out to “Rule, Britannia”, and ${vicar().replace('The', 'the')} waits in the vestry until they have done.`; }}]}
];
pooled('county', COUNTY, 'cty', {from:1797, to:1815, weight:6, repeatGap:3});

/* ---- Henrietta and the Earl ----
   Three papers. henSongs wanders in when she is cool towards him; henPorch and henRichmond follow by the queue
   unless the matter is mended. She is always back under his roof at the end of it, so every other paper holds. */
ev({ id:'henSongs', from:1799, to:1810, weight:4, cond:() => !F('henA') && (S.chars.henrietta.r <= 1 || S.family < 50), title:'Six Italian Songs',
  text:() => `Henrietta has dined at the Castle twice this month, and you were not asked. The first time was to make up the old Countess’s table at whist; and what the second was for nobody has said.

On Thursday the Castle groom brings a parcel, of six Italian songs, bound in green, with “Lord Cullerne’s compliments to Mrs ${S.sur}.”

She has not sung since Kitty was born; and she is at the instrument before breakfast, with her hair done in a new way, which Mrs Tamworth remarked in church.`,
  choices:[
    {t:'Say nothing. It is a book of songs.', go:() => { fl('henA'); later('henPorch', 3);
      return `You say nothing.

She sings in the mornings; and on Tuesdays the Castle carriage fetches her to whist with the old Countess, who is eighty-one, and has been deaf since the American war.

Mudge mentions, while he is looking down a gun barrel, that his lordship’s grey has stood three afternoons at the keeper’s lodge in Hatherley Copse.`; }},
    {t:'Take her to London for the season.', note:'£300', go:() => { fl('henA'); add({money:-300, family:6}); reg('henrietta',2,'You gave her a season in Wimpole Street');
      const mended = chance(0.7); if (mended) fl('henMended'); else later('henPorch', 4);
      return `You take a house in Wimpole Street for ten weeks, at three hundred pounds; and there is the opera twice, and Mrs Siddons, and a rout at which four hundred people stood upon the stairs.

Henrietta is asked everywhere once; and you go with her, and stand behind her chair.

The green book stayed at Hatherley, upon the instrument, and there is dust on it when you come home.${mended ? ' She puts it in the canterbury with the old music.' : '\n\nBut there is a second parcel upon the hall table, of the same size.'}`; }},
    {t:'Send the songs back.', go:() => { fl('henA'); add({family:-3}); reg('henrietta',-2,'You sent back the Earl’s songs'); reg('cullerne',-1); later('henPorch', 2);
      return `The green book goes back to the Castle by Mudge, with a note that you write yourself. “Mrs ${S.sur} has no occasion for them.”

Henrietta watches Mudge down the drive from the drawing-room window; and then she shuts the instrument, and turns the key, and puts it in her pocket.

She does not sing. But on Tuesday, when the Castle carriage comes for her as before, she gets into it.`; }}
  ]});

ev({ id:'henPorch', follow:true, cond:() => F('henA') && !F('henMended') && !F('henriettaAway'), title:'What Mrs Tamworth Saw',
  text:() => `Mrs Tamworth stops you in the church porch, and lays her hand upon your sleeve.

“I should not say it. I was at Speenhamland on Wednesday, at the Pelican. The Castle chariot was in the yard with the blinds down. A lady went up the back stairs in a grey veil. I know the veil. I gave it her.”

At home there is a sheet of blotting paper upon Henrietta’s writing-table; and you hold it to the glass.

“Thursday, if he rides to Sessions.”

Thursday is Sessions.`,
  choices:[
    {t:'Speak to her tonight.', go:() => {
      if (S.chars.henrietta.r >= 0 || S.family >= 50) { fl('henMended'); add({family:-6}); reg('henrietta',1); reg('cullerne',-1);
        return `You speak when the servants are gone up, and hold out the blotting paper; and she looks at it a long time.

“He listens when I speak. You have not asked me a question since the year Edmund went to school.”

She writes one line to the Castle, and gives it to you unsealed, and it goes by Mudge. On Thursday you do not ride to Sessions; and at breakfast you ask her eleven questions, of which she answers four.`; }
      add({family:-8}); reg('henrietta',-1); later('henRichmond', 2);
      return `You speak when the servants are gone up, and hold out the blotting paper.

“He listens when I speak,” she says.

She will not write to the Castle, and she will not be examined in her own dressing-room; and the door is shut, and you hear the key.

On Thursday you ride to Sessions, and sit six hours upon the bench, and do not hear a case.`; }},
    {t:'Call him out.', go:() => { fl('henMended'); reg('cullerne',-4,'You met him on the Down at twelve paces'); const r = Math.random();
      const open = `Mr Hartopp carries your note to the Castle in his best coat, and brings back the Earl’s answer, having left there a pamphlet upon the Swedish turnip.

It is to be six in the morning, upon the Down, at twelve paces.\n\n`;
      if (r < 0.3) { add({standing:4, family:-4});
        return open + `Your ball takes Lord Cullerne in the right arm, above the elbow, and his goes into the turf; and he bows, with his left hand upon the place.

The surgeon has the ball out upon the grass; and the Earl goes to Brighton until Christmas, for his health.

Henrietta is told at breakfast. She puts down her cup.

“Which of you?” she says.`; }
      if (r < 0.75) { add({standing:2, family:-4});
        return open + `You fire, and a lark goes up. The Earl fires into the air, and says that he has no quarrel with Mr ${S.sur}, and regrets extremely any misapprehension; upon which Hartopp declares honour satisfied, and declares it twice.

On Tuesday the Castle carriage does not come. Henrietta sits at the window with her bonnet on until noon; and then she takes it off.`; }
      add({standing:1, family:3, money:-40}); reg('henrietta',1);
      return open + `The Earl’s ball goes through the flesh of your thigh, and yours breaks a flint; and you sit down upon the grass.

Ferris takes you home in the Castle chariot, there being no other carriage upon the Down. The cushions are grey.

It is six weeks on a sofa, and forty pounds to Ferris. Henrietta nurses you herself, and does not go out on Tuesdays; and neither of you says why.`; }},
    {t:'Ride to Sessions on Thursday.', go:() => { add({family:-4}); later('henRichmond', 2);
      return `On Thursday you ride to Sessions, and commit a man for stealing two fowls, and dine with the bench, and ride home by the long road.

Her lamp is lit when you come in; and she asks who was at Sessions.

You tell her who was not.`; }}
  ]});

ev({ id:'henRichmond', follow:true, cond:() => F('henA') && !F('henMended') && !F('henriettaAway'), title:'The Blue Room',
  text:() => `It is Henrietta’s maid who brings your shaving water, when it should have been the footman.

“My mistress went at six, sir. In a post-chaise from the Bell. She took the dressing-case and the green book.”

There is a letter upon the pincushion. “I am at Richmond. Do not send Kitty to me. H.”

Lord Cullerne has taken a house on Richmond Hill by the quarter; and this is known in Wyvern by noon, and will be known in Reading by Sunday.`,
  choices:[
    {t:'Bring an action for criminal conversation.', note:'£400', go:() => { fl('henMended'); fl('henBack'); fl('crimcon'); add({money:-400, standing:-8, family:-22}); reg('henrietta',-4,'You had her letters read out in the King’s Bench'); reg('cullerne',-5,'You had him before a jury for criminal conversation'); reg('kitty',-1);
      const won = chance(0.7); if (won) add({money:2000});
      return `Serjeant Best opens for you in the King’s Bench, the fees being four hundred pounds. Your own servants are sworn; and the footman tells the court what he saw through the window of the keeper’s lodge, and counsel reads her letters aloud, and does the voice.

${won ? 'The jury gives two thousand pounds against the Earl.' : 'The jury finds for you, with damages of one shilling; the foreman holds a farm under the Castle.'} The Mercury gives it nine columns.

A divorce wants an Act of Parliament and a second fortune, and you do not move for one; and at the quarter the Earl gives up the Richmond house.

In March a post-chaise sets Henrietta down at the lodge; and she walks up the drive with the dressing-case, and goes up to the blue room, and at five comes down to dinner.`; }},
    {t:'Go to Richmond and ask her home.', go:() => { fl('henMended'); fl('henBack'); add({standing:-5, family:-10}); reg('henrietta',2,'You came to Richmond and asked her home'); reg('cullerne',-3);
      return `You post to Richmond. The house has a green door, and a view of the river; and a man in the Castle livery says that his lordship is at Brighton.

She is in a back parlour, with the blinds half down, alone; and he has been at Brighton three weeks.

“Have you come to forgive me? I had rather you did not. Ask me to come home.”

You ask. She fetches her bonnet.`; }},
    {t:'Shut the door on her.', go:() => { fl('henMended'); fl('henBack'); add({standing:-6, family:-25}); reg('henrietta',-3,'You shut the door on her for a year'); reg('kitty',-2,'You shut the door on her mother'); reg('cullerne',-3);
      return `You have her things sent to Richmond, in nine trunks, and write nothing.

At Michaelmas the Earl gives up the house, and Henrietta goes to her mother at Bath; and her mother writes, and writes again.

In February a chaise comes up the drive with a parrot’s cage upon the roof, and the old lady is handed down first.

“I have brought you your wife, sir. I am seventy-three. I cannot keep her and the bird both.”`; }}
  ]});

/* ---- Mrs Vane comes home ---- */
ev({ id:'kittyDoor', from:1803, to:1812, weight:5, cond:() => K() === 'vane' && !F('kittyDoor'), title:'The Carrier’s Cart',
  text:() => `The Wyvern carrier stops at the lodge, and hands down a hair trunk, a child of three, and Kitty; whose pelisse, which was blue, is brown, she having walked from Reading to Theale to save the fare.

Captain Vane has sold his commission, for fifteen hundred pounds. He was at the agent’s in Craig’s Court on Tuesday, and upon the Holyhead mail on Wednesday; and a Miss Decamp, of the Norwich theatre, was upon it with him.

There are bills in Kitty’s reticule for four hundred and ten pounds, and every one of them is made out in her name.

“I have not come for money,” she says. The child is asleep upon the trunk.`,
  choices:[
    {t:'Pay the bills, and eighty pounds a year to her.', note:'£410 and £80 a year', go:() => { fl('kittyDoor'); fl('vaneGone'); fl('kittyAllowance'); add({money:-410, family:5, standing:-2}); reg('kitty',3,'You paid the Captain’s bills and asked her nothing'); reg('henrietta',2);
      return `You pay four hundred and ten pounds to nine tradesmen in three garrison towns, and settle eighty pounds a year upon Kitty, to be paid by the quarter into her own hand.

She will not live at the Hall, but takes four rooms over the stationer’s at Wyvern, with a brass plate. “Mrs Vane. Young Ladies instructed in French and the Use of the Globes.”

She walks out on Sundays with the boy; and he, being put down at the lodge, runs the rest.`; }},
    {t:'Keep the child. She must go to the Captain’s people.', go:() => { fl('kittyDoor'); fl('vaneGone'); fl('kittyNorthampton'); add({family:-8, standing:1}); reg('kitty',-4,'You kept her boy and sent her to Northampton'); reg('henrietta',-2,'You sent Kitty from the door');
      return `“The boy shall want for nothing. Your place is with your husband’s family.”

The Captain’s mother lives at Northampton, upon an annuity of sixty pounds; and Kitty goes to her by the wagon, and does not turn round upon the seat.

For nine nights the child asks for her at bedtime. On the tenth he asks for Mrs Bunce.`; }},
    {t:'Send a Bow Street man after the Captain.', note:'£120', go:() => { fl('kittyDoor'); add({money:-120, family:-2}); reg('kitty',-1,'You fetched the Captain back to her'); reg('vane',-2);
      return `You pay a hundred and twenty pounds to a runner from Bow Street, who in a fortnight finds the Captain at a faro table in Dame Street, Dublin, Miss Decamp having left on the Friday with a wine-merchant.

Of the fifteen hundred there remain two; and he comes back for the price of his passage and a new hat.

Kitty looks at him across the hall, and thanks you. They go into lodgings at Reading, and the trunk goes upon the same cart that brought it.`; }}
  ]});
KITTY.push(
  {id:'kitty-wyvern', kind:'news', w:() => F('kittyAllowance'), x:() => `Sunday. Kitty walks out from Wyvern with the boy. She has six pupils now, at a guinea a quarter. One is a Miss Tamworth.

The boy is put down at the lodge and runs the rest. He is in the stable before she reaches the door.

“No letter,” she says, before anybody asks. “There is a man in Dublin who writes to me for the Captain’s debts. He writes a very civil hand.”`},
  {id:'kitty-northampton', kind:'news', w:() => F('kittyNorthampton'), x:() => `A letter from Kitty, from Northampton.

“My dear Papa, Mrs Vane and I live on sixty pounds a year and the lace-pillow. I make three yards a week of the narrow edging. She makes one, and unpicks it. Tell Barnaby that I have his letter. The letters are very well formed for five, and I know Mrs Bunce’s hand in the capitals. I ask nothing. I ask how tall he is.”`}
);

/* ---- Edmund in danger ----
   Four ways into it, by his calling and the year. Each choice sets the odds and queues edmundFate, which rolls once.
   If he dies, edmundDead is set (as Waterloo sets it), the tablet and the role are recorded, and the heir follows. */
const edmRank = () => E() === 'navy' ? (S.year < 1801 ? 'Mr' : S.year < 1811 ? 'Lieutenant' : 'Commander') : E() === 'army' ? (F('major') ? 'Major' : S.year < 1800 ? 'Ensign' : S.year < 1807 ? 'Lieutenant' : 'Captain') : E() === 'militia' ? 'Captain' : 'Mr';
const edmAge = () => 19 + S.year - 1795;
const peril = (kind, p, how) => { S.peril = {kind, p, how}; later('edmundFate', kind === 'duel' ? 1 : 2); };
const fate = () => { const P = S.peril || {kind:'walcheren', p:0}; if (P.dead === undefined) P.dead = chance(P.p); return P; };
const TOMB = {
  walcheren:() => ['Died of the fever at Walcheren, 1809', `His son, Captain ${S.sur} of the 52nd, died of the fever at Walcheren in 1809, and is buried upon the island; and there is a tablet in Hatherley church.`],
  badajoz:() => ['Killed in the breach at Badajoz, 1812', `His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur} of the 52nd, fell in the great breach at Badajoz. There is a tablet in Hatherley church, and his mother has had the pew moved to face it.`],
  fever:() => ['Died of the yellow fever at Port Royal, ' + S.year, `His son, a Lieutenant in the Navy, died of the yellow fever at Port Royal, and is buried at the Palisadoes; and his quadrant is upon the library table.`],
  duel:() => ['Shot on Hatherley Down, ' + S.year, `His son was shot upon Hatherley Down by a Cornet of Dragoons, at ${edmAge()}, and lies in the churchyard. The Cornet is believed to be in Ostend.`]
};
function edmundDies(blame){ const P = fate(), t = TOMB[P.kind](); fl('edmundDead'); fl('edmundRoleDead', t[0]); fl('edmundTomb', t[1]);
  add({family:-25, standing: P.kind === 'duel' ? -2 : 3}); if (P.how === 'let') reg('henrietta', -2, 'You let Edmund go'); S.peril = null; later('heir', 3); }
function edmundLives(){ const P = fate(); if (P.kind === 'badajoz') { fl('major'); fl('edmundFate', 'was in the breach at Badajoz'); } if (P.kind === 'walcheren' && P.p > 0) fl('edmundFate', 'came through Walcheren and the Peninsula'); S.peril = null; }

ev({ id:'walcheren', from:1809, to:1809, weight:40, cond:() => E() === 'army' && !F('edmundDead') && !S.peril && !F('perilDone') && S.season >= 1, title:'Ordered for the Scheldt',
  text:() => `Edmund writes from Deal.

“My dear Father, We embark on Friday. Forty thousand men, and ships past counting; I made it two hundred from the beach and left off. Nobody will say where. The sutlers say Flushing. Our Surgeon has asked for bark and been told there is none to spare, this not being the West Indies. I have my Corunna boots, which let water.”

Henrietta has the atlas open. The island is called Walcheren; and the map shows it lower than the sea.`,
  choices:[
    {t:'Send him bark, flannel and port wine.', note:'£30', go:() => { fl('perilDone'); add({money:-30}); reg('edmund',1); peril('walcheren', 0.15, 'bark');
      return `For thirty pounds you send six pounds of Peruvian bark from Apothecaries’ Hall, with flannel waistcoats, and a case of port; and it goes down to Deal by the mail, under the guard’s own hand.

The fleet sails on the twenty-eighth of July, and no greater ever left England.

Nothing comes for seven weeks.`; }},
    {t:'Write to the Horse Guards to keep him at home.', go:() => { fl('perilDone'); add({standing:-1}); reg('edmund',-3,'You had him kept from Walcheren'); reg('henrietta',2); peril('walcheren', 0, 'kept');
      return `You write to a Member, and the Member speaks to a General; and Edmund is ordered to the depot at Chatham, to drill recruits.

His letter is four lines. “I am to teach ploughboys their left foot while the Regiment is in Holland. I am told I have you to thank.”

The fleet sails without him, and Henrietta sleeps the night through.`; }},
    {t:'Give him your blessing.', note:'£10', go:() => { fl('perilDone'); add({money:-10}); reg('edmund',1); peril('walcheren', 0.35, 'let');
      return `You write that he will do his duty, and that his mother sends her love; and you enclose ten guineas.

The fleet sails on the twenty-eighth of July. Flushing is bombarded, and in a fortnight taken; and the Gazette prints it, and they ring the bells at Wyvern.

Then nothing comes for seven weeks.`; }}
  ]});

ev({ id:'badajoz', from:1812, to:1812, weight:40, cond:() => E() === 'army' && !F('edmundDead') && !S.peril && !F('stormDone') && S.season <= 1, title:'The Forlorn Hope',
  text:() => `Edmund writes from the lines before Badajoz.

“My dear Father, The breaches will be practicable within the month. A storming party goes in first with ladders and hay-bags. It is all volunteers. The officer who leads it and lives has his step without purchase. ${F('major') ? 'I have my majority already, by your kindness, and have no need of it. I have put my name down notwithstanding. Eleven of my company have put theirs.' : 'I am a Captain, and eleven hundred pounds short of a majority. I have put my name down.'} The men call it the Forlorn Hope. The Adjutant says that is Dutch and means only a lost troop. I did not find that it helped.”

The letter was three weeks coming.`,
  choices:[
    {t:'Buy him the majority. He need not climb for it.', note:'£1,100', if:() => !F('major'), go:() => { fl('stormDone'); fl('major'); add({money:-1100}); reg('edmund',-1); peril('badajoz', 0.15, 'bought');
      return `You pay eleven hundred pounds to Cox and Greenwood in Craig’s Court, who send it out by the King’s messenger, with the army’s gold.

The Gazette has him Major by purchase; and he takes his name off the list, and another captain puts his on.

The breaches are stormed on the night of the sixth of April, the Light Division going in behind the storming party.`; }},
    {t:'Forbid it. He has a mother.', go:() => { fl('stormDone'); reg('edmund',-2,'You forbade him the storming party'); peril('badajoz', 0.4, 'forbade');
      return `You write that he has a mother, and you underline it.

But the letter is three weeks to Lisbon, and a week more to the lines; and the breaches were stormed on the night of the sixth of April.

It will reach the camp about the twentieth.`; }},
    {t:'Write that he must judge.', go:() => { fl('stormDone'); reg('edmund',2,'You left Badajoz to his own judgment'); peril('badajoz', 0.4, 'let');
      return `You write that he is thirty-six, and a soldier, and must judge; and you write it four times before it will go upon one sheet.

The breaches were stormed on the night of the sixth of April, and the Gazette has not the lists yet.

Henrietta asks what you wrote; and when you have told her, she goes out of the room.`; }}
  ]});

ev({ id:'jamaica', from:1803, to:1810, weight:5, cond:() => E() === 'navy' && !F('edmundDead') && !S.peril && !F('perilDone'), title:'The Jamaica Station',
  text:() => `Edmund writes from Spithead.

“My dear Father, We are ordered to the Jamaica station with the convoy. The First Lieutenant has been out before. He says there are two seasons, the sickly and the very sickly, and that a frigate buries a third of her people in the first year. The vacancies make promotion brisk. He told me this as good news. I am to bring a cask of bark and six dozen of port, if I have a friend to pay for them.”

Captain Holloway’s name still passes at the Admiralty.`,
  choices:[
    {t:'Send the bark and the port.', note:'£30', go:() => { fl('perilDone'); add({money:-30}); reg('edmund',1); peril('fever', 0.15, 'bark');
      return `For thirty pounds the cask and the six dozen go down to Portsmouth by Clarke’s wagon, and Edmund signs for them upon the Hard.

The convoy sails with the first east wind, a hundred and forty sail of sugar ships, and four of the King’s.

A letter from Jamaica is nine weeks coming, when the packet is not taken.`; }},
    {t:'Ask Captain Holloway for a ship in the Channel.', go:() => { fl('perilDone'); add({standing:-1}); reg('edmund',-3,'You had him taken out of the Jamaica convoy'); reg('henrietta',2); peril('fever', 0, 'kept');
      return `Captain Holloway writes to a Lord of the Admiralty; and Edmund is moved into a seventy-four of the Channel fleet, off Brest.

He does not write for a quarter, and when he does, it is to his mother.

The convoy sails without him.`; }},
    {t:'Wish him prize money.', go:() => { fl('perilDone'); reg('edmund',1); peril('fever', 0.35, 'let');
      return `You write that the West Indies have made many a young officer, and you wish him prize money.

The convoy sails with the first east wind, a hundred and forty sail of sugar ships, and four of the King’s.

A letter from Jamaica is nine weeks coming, when the packet is not taken.`; }}
  ]});

ev({ id:'edmundDuel', from:1800, to:1812, weight:3, cond:() => (E() === 'home' || E() === 'militia') && !F('edmundDead') && !S.peril && !F('perilDone'), title:'Words in the Card-room',
  text:() => `There were words in the card-room at the Wyvern Assembly; where a Cornet Lascelles of the Tenth Light Dragoons, quartered at Reading, having said that old Mr ${S.sur} signed his will with another man’s hand upon the pen, Edmund threw a glass of negus in his face.

They meet upon the Down at six tomorrow, and young Hartopp is to second him. But Edmund has no pistols of his own; and he is standing in the gun room doorway.

“May I have my uncle’s, sir?”`,
  choices:[
    {t:'Bind them both over to keep the peace.', go:() => { fl('perilDone'); add({standing:-2}); reg('edmund',-3,'You bound him over like a poacher'); reg('henrietta',2); peril('duel', 0, 'kept');
      return `The constable is at the Bell before supper, with two warrants; and both gentlemen are bound over, in two hundred pounds, to keep the peace for a twelvemonth.

The Cornet bows, and says that he quite understands a father’s feelings; and he says it in the public room.

Edmund does not dine at home that month.`; }},
    {t:'Lend him the pistols.', go:() => { fl('perilDone'); reg('edmund',2,'You lent him the Wogdons'); peril('duel', 0.3, 'let');
      return `They are your uncle’s pistols, by Wogdon, and you clean them yourself; and as the left one throws high, you tell him so.

He goes out at five with young Hartopp. You stand at the landing window, and the Down is in mist.

At twenty past six there are two reports, close together.`; }},
    {t:'Go to the Cornet tonight with two hundred pounds.', note:'£200', go:() => { fl('perilDone'); add({money:-200, standing:-3}); peril('duel', 0, 'bought');
      return `The Cornet counts it; and having written an apology at the table of the Bell, and signed it, he has leave to join his regiment the same night.

The apology is read out in the coffee room. Edmund believes that he frightened the man; and though half Wyvern knows better, nobody tells him.

The Cornet buys a charger with the money, and calls it Hatherley.`; }}
  ]});

const FATES = {
  walcheren:{
    dead:() => `The letter is from the Surgeon of the 52nd, dated Middelburg.

“Sir, It is my painful duty to acquaint you that Captain ${S.sur} was taken with the fever of this island on the ninth of September, and died on the fourteenth, at four in the afternoon, having been sensible until the last day. He asked that his watch might go to his sister, and his sword to you. We have buried four officers and fifty-one men this month; and I have not the bark to treat the rest.”

The sword comes in November, by the Harwich wagon, in a deal case. The watch is not with it.`,
    kept:() => `The transports come into Deal in September, and Edmund is sent over from Chatham to meet them.

“My dear Father, They carried them up the beach upon doors. Of our six hundred, three hundred and ninety are sick, and sixty are buried upon the island, of whom the French did not kill forty; and my own company has nineteen men fit. The Serjeant did not know me. Then he did, and asked where I had been; and I told him.”

He has signed it with his rank, and his full name.`,
    alive:P => `There is a letter from Harwich, in pencil.

“My dear Father, I am landed, and can stand. We took Flushing in a fortnight, and then sat down in the wet to wait for orders; and with the September mists came the fever, by which men were well at parade and dead at tattoo, and of our six hundred, three hundred and ninety were in hospital at once. ${P.how === 'bark' ? 'I had your bark, and shared it through the company as far as it went, and it went four days.' : 'There was no bark. The Surgeon gave port while there was port.'} I shake every third day, at about four o’clock; and they tell me that it wears off in a year or two.”`},
  badajoz:{
    dead:() => `The letter is from his Colonel.

“Sir, ${F('major') ? 'Major' : 'Captain'} ${S.sur} fell in the great breach at Badajoz, on the night of the sixth of April. He was seen upon the ladder three times; and he was found in the morning under the chevaux-de-frise, with eleven men of his company. The Regiment has lost more officers in one night than in four years. I enclose his ring.”

The Gazette comes the day after. His name is fourth in the list of the 52nd, and is spelt with one R.`,
    alive:P => `“My dear Father, I am alive, and cannot tell you why. We went down into the ditch at ten at night, the French having chained planks across the breach, stuck full of sword-blades; and I do not know how many times we went up. A dead man knocked me off the ladder, and I lay under him until morning, which I think preserved me. The Light Division has lost nine hundred. Lord Wellington came to look at the breach at daylight, and I am told that he wept. ${P.how === 'bought' ? 'I had rather have the men.' : 'I am a Major. I had rather have the men.'}”${P.how === 'forbade' ? '\n\nYour own letter is enclosed. It reached him on the twentieth; and he has not broken the seal.' : ''}`},
  fever:{
    dead:() => `The letter is from his Captain, dated Port Royal.

“Sir, Lieutenant ${S.sur} died of the yellow fever on the third of September, and was buried at the Palisadoes the same evening, as the climate requires. He was a very promising officer. His effects were sold at the mast, according to the custom of the service, and fetched nineteen pounds four shillings, which the Purser will remit. I have kept back his quadrant, and his mother’s letters.”

The quadrant comes home in the spring. The letters are tied with a rope-yarn, and there are sixty-one of them.`,
    kept:() => `Edmund writes from a seventy-four off Brest.

“My dear Father, We have been at sea nineteen weeks, and have seen the French once, at anchor, through a glass. My old ship is come home from Jamaica, having sailed with two hundred and sixty men, and brought back a hundred and ten; and the Admiral has put her officers’ names in for promotion, those that are left to have names. I should have been Second of her.”

He does not say which he would have chosen.`,
    alive:P => `There is a letter from Port Royal, upon yellow paper, in yellow ink.

“My dear Father, We have buried the Purser, the Surgeon’s mate, four Midshipmen, and thirty-one hands. I had the fever in August, and was read over twice by the Chaplain, who then died. ${P.how === 'bark' ? 'I am told the bark saved me. The port certainly saved the Gunner.' : 'I had no bark. The Gunner dosed me with rum and gunpowder, and sat on my chest.'} I am made First of the ship, there being nobody else; and we have taken a Spanish schooner laden with cocoa, of which my share is forty pounds.”`},
  duel:{
    dead:() => `Young Hartopp comes up the drive at seven. He is on foot. He has no hat.

Four men are behind him with a hurdle. There is a cloak over it.

“He fired in the air, sir. I am to say that he fired in the air.”

The Cornet has posted for Harwich. The left pistol is in young Hartopp’s hand. He does not know where to put it down.`,
    kept:() => `The Tenth Light Dragoons march out of Reading for the coast, and Cornet Lascelles rides with them.

The Mercury has it in the spring, that he has shot a brother officer at Brighton, over a dog; the ball going in under the fourth rib, and the officer dying on the Thursday.

Edmund reads it at breakfast, and reads it again; and then he passes you the paper, without saying anything.`,
    alive:() => `Edmund comes in at seven, with wet boots.

“He fired first. It took the button off my sleeve. I meant to fire wide and I hit his hat. He says it was a twelve-guinea hat.”

He eats four eggs. ${hh(`Henrietta, coming down at eight, asks why the gun room smells of powder at this hour.`, `Mrs Bunce, coming in at eight, asks who has been in the gun room at this hour.`)}`}
};
const fateText = () => { const P = fate(), f = FATES[P.kind]; return P.dead ? f.dead(P) : P.p === 0 ? f.kept(P) : f.alive(P); };

ev({ id:'edmundFate', follow:true, cond:() => !!S.peril && !F('edmundDead'),
  get title(){ const P = fate(); return P.dead ? (P.kind === 'duel' ? 'Twenty Past Six' : 'A Letter in a Strange Hand') : P.kind === 'duel' && P.p > 0 ? 'Wet Boots' : 'Edmund Writes'; },
  cut:() => 'fate-' + fate().kind + (fate().dead ? '-dead' : fate().p === 0 ? '-kept' : '-alive'),
  text:() => fateText(),
  choices:[
    {t:() => hh('Go up and tell Henrietta.', 'Go to Bath and tell Henrietta.'), if:() => fate().dead, go:() => { const duel = fate().kind === 'duel'; edmundDies(); reg('henrietta',1);
      return duel ? `${hh(`She is on the stairs. She saw the hurdle from her window.

“Not in the hall,” she says. “Carry him to his own room.”

She goes up before the men to turn down the bed. She orders the blinds drawn on the south front. Every one.`, `You are in Gay Street by dark. She is on the lodging-house stairs. She looks at your hat.

“Not on the stairs,” she says.

She hears it by the window with her back to you. Then she rings for her trunk. She writes to Mrs Bunce to draw the blinds on the south front. Every one.`)}` : `${hh(`She is at her glass. She sees the paper in your hand.

“Not aloud,” she says.

You give her the letter. She reads it standing. She folds it in four and puts it inside her gown. She rings, and orders the blinds drawn on the south front. Every one.`, `You post to Bath with the letter in your coat. She is at cards in Gay Street. She sees you in the door and puts down her hand.

“Not aloud,” she says.

She reads it in the passage. She folds it in four and puts it inside her gown. The other three ladies have not moved.`)}`; }},
    {t:'Put up a tablet in the church.', note:'£40', if:() => fate().dead, go:() => { const rank = edmRank(), role = TOMB[fate().kind]()[0], age = edmAge(); edmundDies(); add({money:-40, standing:1});
      return `A tablet of white marble is put up on the north wall, by a mason from Reading, for forty pounds.

“${rank} Edmund ${S.sur}. ${role}. Aged ${age}.”

The mason has room for one line more. ${hh(`Henrietta is asked for it, and says that there is nothing to add to the age.`, `Henrietta is asked for it by letter, and writes that there is nothing to add to the age.`)}`; }},
    {t:'Go into the gun room and shut the door.', if:() => fate().dead, go:() => { edmundDies(); add({family:-3});
      return `His fowling piece is on the rack. It has not been cleaned since he last had it out.

You clean it. It takes the afternoon.

At six Mudge comes in. He stands a while. He takes the rod out of your hand and finishes the barrel.`; }},
    {t:() => hh('Read it to Henrietta.', 'Send it on to Henrietta.'), if:() => !fate().dead && !(fate().kind === 'duel'), go:() => { edmundLives(); add({family:3}); reg('henrietta',1);
      return `${hh(`You read it to her in the breakfast-room, and she has you read it again.

Then she takes the letter, and it goes into her work-box with the others, which she keeps in order, with the dates outward.`, `You send it to Gay Street under cover, and in four days it is back.

She has copied it out, and the copy stays at Bath; but the letter is to go into her work-box here with the others, the date outward.`)}`; }},
    {t:'Answer by this post.', if:() => !fate().dead && !(fate().kind === 'duel'), go:() => { edmundLives(); reg('edmund',1);
      return `You write the same night, and cover two sheets, upon the barley, and the new pointer, and the Tamworths’ chimney; and you find no way to say the other thing.

He answers in the spring. “I had yours about the barley. I understood it.”`; }},
    {t:() => hh('Tell her he has been after rabbits.', 'Write to Bath that he has been after rabbits.'), if:() => !fate().dead && fate().kind === 'duel' && fate().p > 0, go:() => { edmundLives(); add({standing:2});
      return `${hh(`“Rabbits, my dear.”

“With a pistol?”

Edmund looks at his plate, and Henrietta at the button gone from his sleeve; and before church she sews on another, with black thread.`, `You write to Gay Street that Edmund has been after rabbits.

She answers by return. “With a pistol?”

There is a button in the letter, to go upon his sleeve before church; and she has sent black thread to sew it with.`)}`; }},
    {t:() => hh('Tell her.', 'Write and tell her.'), if:() => !fate().dead && fate().kind === 'duel' && fate().p > 0, go:() => { edmundLives(); add({standing:2, family:-2}); reg('henrietta',-1,'You lent Edmund the pistols');
      return `${hh(`You tell her.

She does not speak to either of you until Sunday; and on Sunday she takes Edmund’s arm into church, and does not take yours.`, `You write it to Gay Street.

No letter comes for you that week. But one comes for Edmund on Thursday, and he reads it in the gun room with the door shut.`)}`; }},
    {t:'Say nothing.', if:() => !fate().dead && fate().kind === 'duel' && fate().p === 0, go:() => { edmundLives(); reg('edmund',1);
      return `You say nothing, but fold the paper, and lay it by his plate.

After dinner he brings the decanter round to your end of the table himself.`; }},
    {t:'Say that a hat is cheaper.', if:() => !fate().dead && fate().kind === 'duel' && fate().p === 0, go:() => { edmundLives();
      return `“A hat would have been twelve guineas, Edmund.”

“Yes, sir.”

He finishes his egg, and does not leave the room.`; }}
  ]});

ev({ id:'heir', follow:true, cond:() => F('edmundDead') && !S.flags.heir && S.year < 1815, title:'A Cousin from Birmingham',
  text:() => `Hatherley is settled upon heirs male; and the next of them is Mr Josiah ${S.sur} of Birmingham, your second cousin, who makes buttons.

He has written to condole; and on Thursday he comes himself, in a new black coat, and admires the hall, and paces the drawing-room heel to toe while he thinks that you are looking at the fire. His wife, he says, would be glad to know whether the chimneys draw.

Your attorney is of opinion that a recovery might be suffered, and the land settled afresh. It wants three hundred pounds; and it wants the cousin not to hear of it before Hilary term.`,
  choices:[
    {t:'Break the entail. Settle it on Kitty.', note:'£300', go:() => { fl('heir','kitty'); add({money:-300, family:4}); reg('kitty',2,'You settled Hatherley on her'); reg('henrietta',1);
      return `You pay three hundred pounds to the attorney, and the deeds are engrossed upon nine skins.

Mr Josiah ${S.sur} hears of it in Hilary term, and writes eleven sides, having taken counsel’s opinion.

Counsel’s opinion is that he should have kept his feet still.`; }},
    {t:'Show him the house. He is the heir.', go:() => { fl('heir','cousin'); add({family:-5}); reg('henrietta',-2,'You showed the button-maker over the Hall');
      return `You show him the house from the cellars to the leads, and he writes the number of bedrooms upon his cuff.

Henrietta receives him in the yellow drawing-room, and does not ask him to sit.

At the door he presses your hand, and hopes that you may be spared many years; and then he asks your age.`; }},
    {t:'Tell him every chimney smokes.', go:() => { fl('heir','cousin'); add({family:1});
      return `“Every one of them smokes, Mr ${S.sur}. The roof wants two thousand pounds. There is dry rot in the hall.”

He looks at the ceiling, and goes back to Birmingham by the night coach.

At Christmas he writes to ask after the rot.`; }}
  ]});

/* ---- Hard times ----
   Three pools for the three states the engine raises in regardQuarter (src/estate.js): F('sullen') when the
   parish has turned, F('cut') when the county has, F('henriettaAway') when she has gone to Gay Street. */
const PARISH = [
  {id:'parish-letter', title:'Under the Door', x:() => `A paper is found under the hall door at six in the morning, written upon the fly-leaf of a prayer-book.

“Mr ${S.sur}. You have had fair warnin. Their is them that have ate barly bread sinse Lammas and seen your dogs ate meat. Your ricks is dry. Remember the pore and you may slepe.”

There is no name. But the prayer-book was a Hatherley one, such as the parish gives to every child at confirmation.`,
    o:[{t:'Fifty guineas for the name of the writer.', go:() => { add({standing:1, goodwill:-3});
      return `A bill goes up at the Bell, and upon the church door. “FIFTY GUINEAS REWARD.”

Nobody comes for the fifty guineas, though it is nine years’ wages for a ploughman.

On Sunday the bill upon the church door has a line added, in pencil. “Sixty, and I will tell you who rote the bill.”`; }},
    {t:'Read it out at the vestry and ask what is wanted.', go:() => { add({goodwill:4, standing:-1});
      return `You read it to the vestry on Thursday, spelling and all, and lay it upon the table.

Nobody owns it, and nobody is surprised by it; and after a time the wheelwright says that coals are two shillings the bushel, and the common is shut.

The vestry sits till ten, and you come away with a list; and the list being in the same hand as the letter, you do not remark upon it.`; }},
    {t:'Burn it.', go:() => { add({goodwill:-1});
      return `You put it upon the library fire.

Mudge sits up four nights in the stackyard, with a gun, and upon the fifth night he sleeps.

Nothing is burnt. But in the morning there is a prayer-book upon the mounting-block, with the fly-leaf torn out.`; }}]},
  {id:'parish-harvest', title:'The Lord of the Harvest', w:() => S.season === 1 || S.season === 2, x:() => `The wheat upon the home farm is dead ripe, and will shed if it stands a week.

The reapers have chosen their captain, whom they call the Lord of the Harvest, and who bargains for them all; and he being this year Will Tubb, he stands in the yard, with fourteen men behind him.

“Twelve shillings the acre, sir, and the beer. Last year was eight. We have talked it over.”

There is not a cloud. The men have their hooks with them; and not one of them has taken his out of the straw band.`,
    o:[{t:'Twelve shillings.', note:'£25 over last year', go:() => { add({money:-25, goodwill:4});
      return `“Twelve.”

They are in the Twelve Acres before you have left the yard; and the wheat is down in nine days, and carried in thirteen.

At harvest home Will Tubb proposes your health, and fourteen men drink it. They do not cheer; but it is nearer to a cheer than it was.`; }},
    {t:'Send to Reading for Irishmen.', note:'£15', go:() => { add({money:-15, goodwill:-4});
      return `Twenty Irish reapers come out from Reading, at seven shillings and their keep, which with the wagon is fifteen pounds over the bargain.

They cut the home farm in six days, and sleep in the great barn, and sing at night; and the Hatherley men stand at the gate, and watch them cut.

The last sheaf is not carried in with ribbons, and there is no boy upon the load.`; }},
    {t:'Eight, as last year. Let them think.', go:() => { add({money:-40, goodwill:-1, standing:1});
      return `They think for five days, and upon the fourth the wind gets up from the south-west.

On the sixth Will Tubb comes back for ten shillings, and you give it, and the hooks go in.

Mr ${stew()}, walking the stubble afterwards, puts the shed corn at forty pounds. The gleaners do very well.`; }}]},
  {id:'parish-pryor', title:'Jem Pryor at the Front Door', x:() => `Jem Pryor has come to the front door, where he has never come before, and with his hat on.

“I am sent, sir. It was put to the vote at the Bell.”

He has it by heart: coals; the price of the quartern loaf, against nine shillings a week; gleaning upon the home farm before the rake; and the path across the park that was stopped.

“That is the four things. I was to say there is a fifth and not say what.”`,
    o:[{t:'Have him into the library and go through the four.', note:'£20', go:() => { add({money:-20, goodwill:5}); reg('pryor',2,'You heard him in the library');
      return `He sits upon the edge of a chair, with his hat upon his knee, having taken it off without being asked.

There are to be coals at cost from the Hall wharf, for twenty pounds, and gleaning before the rake; and the path you will think about.

“And the fifth, Pryor?”

“That was if you wouldn’t see me, sir.”`; }},
    {t:'Hear him on the step.', go:() => { add({goodwill:1}); reg('pryor',-1);
      return `You hear him upon the step, with the door open behind you.

He says the four things, and you say that you will consider them; and he waits, and you have no more to say.

He goes down the drive, and not round by the back; and at the lodge there are nine men waiting for him.`; }},
    {t:'Send Mudge to him.', go:() => { add({goodwill:-4}); reg('pryor',-2,'You sent the keeper to answer him');
      return `Mudge goes out to him. They were boys together, and they stand a minute.

“He won’t, Jem.”

“No. Well. I was sent.”

Pryor, as he goes, puts his hand upon the stone lion by the step; and on Saturday the lion has no nose.`; }}]},
  {id:'parish-audit', title:'Three Cheers', w:() => S.season === 2 || S.season === 3, x:() => `It is harvest supper in the great barn, where a hundred sit down to your beef and your beer; and by custom the oldest labourer rises at the end, and calls three cheers for the master.

The oldest is Abel Ilsley, who is seventy-nine. He rises, and looks for some time down the table.

“There’s the supper,” he says. “We thanks the cook.” He sits.`,
    o:[{t:'Rise and thank the cook yourself.', go:() => { add({goodwill:3});
      return `You rise.

“Abel Ilsley is right. Three cheers for Mrs Bunce.”

They give them, and loud, and somebody at the bottom of the table laughs; and Abel Ilsley, looking at you with his head upon one side, lifts his mug an inch.`; }},
    {t:'Sit it out.', go:() => { add({standing:-1});
      return `You sit. The fiddler waits to be told.

After a minute the women begin to clear, and the men go out by the far door, in twos and threes; and you are left at the top table with Mr ${stew()}, and a round of beef.`; }},
    {t:'Stop the beer.', go:() => { add({goodwill:-4, standing:1});
      return `“Draw no more, Mrs Bunce.”

The barn is empty in ten minutes, and nobody says good night.

The second barrel, not having been broached, goes back to the cellar; where in the morning it is found with the bung started, a pint gone, and a halfpenny upon the lid.`; }}]}
];
pooled('parish', PARISH, 'par', {from:1796, to:1815, weight:7, repeatGap:3, cond:() => F('sullen')});

const COLD = [
  {id:'cold-card', title:'Your Own Card', x:() => `You leave your card at the Lovedays’ on Tuesday; and on Thursday their footman brings a card to the Hall, upon a salver.

It is your card.

There is no message. But the corner that you turned down has been turned up again.`,
    o:[{t:'Give a dinner regardless.', note:'£40', go:() => { add({money:-40, standing:3});
      return `You send cards to fourteen houses, and lay out forty pounds in turbot, venison, and a pine-apple.

Three accept: Mr Hartopp, the curate, and an attorney from Wyvern, who was not asked, and who says that the card must have miscarried.

The table is laid for sixteen. The attorney eats for four, and is very good company.`; }},
    {t:'Ride over and ask Loveday why.', go:() => { add({standing:1});
      return `Mr Loveday receives you in the stable yard, and does not ask you in.

“I have daughters,” he says. “It is nothing I think myself. It is what is said at the Castle.”

He walks you to your horse, and holds the stirrup, having first looked round to see who is in the yard.`; }},
    {t:'Put the card back in the case.', go:() => { add({family:1});
      return `You put it back in the case, it being a good card, and having cost twopence.

No carriage turns in at the lodge that month; and the gravel, raked on Saturday, is found upon the next Saturday as the rake left it.`; }}]},
  {id:'cold-bench', title:'The Chair at Sessions', x:() => `It is Quarter Sessions at Reading, where the justices sit in a row of eleven chairs under the King’s arms; and the fourth from the left, which you have had for nine years, has Lord Cullerne’s chaplain in it, who was put in the Commission at Easter.

There is no twelfth chair. The Chairman is reading a paper very closely; and the Clerk of the Peace, having dropped his pen, is a long time under the table.`,
    o:[{t:'Stand behind the chair all day.', go:() => { add({standing:2});
      return `You stand behind the fourth chair from ten until five, and give your voice in every case.

The chaplain does not turn his head; but by three the back of his neck is red.

At the next Sessions there are twelve chairs, of which yours is the twelfth, being from the Clerk’s office, and without arms.`; }},
    {t:'Write to the Lord Lieutenant.', go:() => { add({standing:-1});
      return `You write to Lord Radnor, having been in the Commission of the Peace since ’89.

His lordship’s secretary answers, that the seating of the bench is a matter for the Chairman, and that his lordship is confident no slight was intended.

The Chairman is Lord Cullerne’s cousin.`; }},
    {t:'Sit in the body of the court.', go:() => { add({standing:-2, goodwill:2});
      return `You sit upon the public benches, between a hurdle-maker and a woman with a basket.

A Hatherley man is up for taking a hare; and seeing you, he looks from you to the bench, and back.

He has three months. Going down he says, “Good day, sir”; and it is to you that he says it.`; }}]},
  {id:'cold-cullerne', title:'In Wyvern Market Place', x:() => `It is market day at Wyvern; and Lord Cullerne is crossing from the Bell to his carriage, with his agent upon one side, and Mr Tamworth upon the other.

You are eight yards off, and there is nobody between.

He looks at the Town Hall clock, which is over your head; and he goes on looking at it as he comes.`,
    o:[{t:'Bow.', go:() => { add({standing:-1});
      return `You take off your hat, and bow.

Lord Cullerne has found something amiss with the clock, and remarks upon it to the agent, while Mr Tamworth looks at his boots.

A butcher’s boy bows back to you from a doorway, and does it rather well.`; }},
    {t:'Wish him good morning by name.', go:() => { add({standing:2}); reg('cullerne',-1);
      return `“Good morning, my lord.”

The whole market hears it; and being obliged to stop, he touches his hat with one finger.

“Mr ${S.sur}.”

It is two words, but forty people have heard him say them; and Mr Tamworth says good morning as well, a little late.`; }},
    {t:'Look at the clock yourself.', go:() => { add({goodwill:1});
      return `You turn, and look up at the Town Hall clock. It is ten minutes slow, as it has been since your uncle’s time.

When you turn round again, the carriage is at the end of the street. A carter beside you, who has been looking at the clock too, asks what you both saw.`; }}]}
];
pooled('cold', COLD, 'cld', {from:1796, to:1815, weight:6, repeatGap:4, cond:() => F('cut')});

const GAYST = [
  {id:'bath-letter', title:'From Gay Street', x:() => `There is a letter from Henrietta, of one side.

“I am tolerably well. The rooms are small, and the stairs are steep. I drink two glasses at the Pump Room at eight, and walk in the Crescent at one. Mrs Loveday is here, and has asked me nothing, which I take very kindly. Pray tell Mrs Bunce that the sheets are to be aired whether I am there or no. H.”

She has not said “your affectionate”. She has written the word, and scratched it through.`,
    o:[{t:'Write and ask her to come home.', go:() => { add({family:4}); reg('henrietta',1);
      return `You write four lines, of which the third is “I should be glad if you would come home.”

Her answer is nine days coming.

“I had your letter. I have read the third line several times. I do not say no. Ask me again in a month, and say why.”`; }},
    {t:'Send fifty pounds.', note:'£50', go:() => { add({money:-50, family:1});
      return `You enclose a fifty-pound note, and say that she is to want for nothing.

She acknowledges it by return, having taken with it a box at the theatre for the season.

The acknowledgment is one line, signed with both her names.`; }},
    {t:'Answer about the sheets.', go:() => { add({family:-1});
      return `You write that the sheets have been aired, adding the price of wheat, and that the dog is well.

She does not answer.

Mrs Bunce airs the sheets again on Friday, though nobody has told her to.`; }}]},
  {id:'bath-selina', title:'Selina’s View', x:() => `Your sister Selina has been to Bath, and comes on to Hatherley to tell you about it, keeping her bonnet on.

“She has two rooms over a milliner. I counted the stairs. She dines at three on a chop. She is asked out four nights in the week and goes. She looks ten years younger. I thought you should know that.”

She takes off one glove.

“I did not ask her why. I ask you.”`,
    o:[{t:'Tell Selina why.', go:() => { add({family:3});
      return `You tell her. It takes some time, for you begin in the wrong year, and have to go back.

Selina hears it out, and puts her glove on again.

“Then you had better say that to Henrietta. You said it to me a great deal better than you will say it to her. Write it down tonight.”

You write it down.`; }},
    {t:'Say it is between man and wife.', go:() => { add({family:-1});
      return `“It is between Henrietta and me.”

“It is between Henrietta and all Bath. They are very much on her side.”

She will not stay to dine, and her chaise goes down the drive at a trot.`; }},
    {t:'Ask what the stairs were like.', go:() => { add({family:1});
      return `“How many stairs?”

“Forty-one.”

You say that Henrietta never could abide stairs; and Selina looks at you for some time.

“No,” she says. “She must dislike something else more.”`; }}]},
  {id:'bath-go', title:'Forty-one Stairs', x:() => `It is fifty-two miles to Bath, and a chaise will do it in a day.

The house at Hatherley is very quiet. The clocks have been let run down in three rooms; and Mrs Bunce sends up dinner for one, and it is still too much.

The blue room is kept shut. You have opened the door twice; and her silver brushes being gone from the table, there are four marks in the dust where they stood.`,
    o:[{t:'Go to Bath.', note:'£12', go:() => { add({money:-12, family:7}); reg('henrietta',2,'You came to Gay Street yourself');
      return `It is twelve pounds in chaises, and you are in Gay Street by six.

There are forty-one stairs. She opens the door herself, with a pen in her hand.

“You are out of breath,” she says.

You stay four days at the White Hart, and walk with her in the Crescent at one; and upon the fourth day she lets you carry her shawl.`; }},
    {t:'Send the carriage, empty, with her maid.', if:() => keepsCarriage(), go:() => { add({family:-2}); reg('henrietta',-1,'You sent an empty carriage for her');
      return `The carriage goes to Bath, with her maid in it, and a rug; and on Thursday it is back, with the maid in it, and the rug.

“My mistress says, sir, that she is not a parcel.”`; }},
    {t:'Wind the clocks.', go:() => { add({family:1});
      return `You wind the clocks yourself, all eleven, which takes the morning; and for four minutes they strike noon, one after another.

Mrs Bunce comes to the foot of the stairs to listen; and that night she writes to Bath, having the housemaid write it for her.`; }}]}
];
pooled('gayStreet', GAYST, 'gay', {from:1796, to:1815, weight:9, repeatGap:2, cond:() => F('henriettaAway')});

/* ---- The Royal Family ----
   Windsor is in the county. royalStag wanders in early; the rest follow by the queue or by their year.
   Flags: royalKnown (the King has your name), royalPlain (you told him the price of bread), princeLoan
   (the Prince has a thousand of yours), privyChamber (what he gave for it). */
ev({ id:'royalStag', from:1797, to:1803, weight:6, cond:() => !F('royalKnown'), title:'The King’s Hounds',
  text:() => `The King’s stag-hounds met at Salt Hill at ten; and the deer, being uncarted, ran west for five hours, and is now in your horse-pond, up to the neck.

There are forty couple of hounds upon the bank, and behind them eleven gentlemen in blue coats with red collars, on beaten horses; of whom the stout one in front, who is sixty, and has a star upon his coat, gets down without help.

“Whose house? What? Whose house? ${S.sur}? Good. Good. Are those your turnips? Do you hoe ’em twice? What?”

Mudge has taken off his hat, and cannot find where to put it.`,
  choices:[
    {t:'Walk him round the farm.', go:() => { fl('royalKnown'); add({standing:6}); later('royalTerrace', 4);
      return `You walk the King of England round the home farm, in the rain.

He looks into the pigsties; he lifts a turnip, and smells it; he asks what you give for a ploughman, and whether the wheat is dibbled or broadcast; and as he has the right answers himself, he does not wait for yours.

“I shall send you a ram. Spanish. Very fine wool. Don’t let ’em tell you they won’t stand the wet.”

The stag is taken out of the pond with ropes, and carted home to Windsor. The ram comes in March, with a groom and a letter; and it will not stand the wet.`; }},
    {t:'Bring him into the Hall and send for the best Madeira.', note:'£30', go:() => { fl('royalKnown'); add({money:-30, standing:4, family:3}); reg('henrietta',2,'The King sat in her drawing-room'); later('royalTerrace', 4);
      return `The King sits in the yellow drawing-room in his wet boots; and there go thirty pounds in Madeira, cold beef, and oats for forty horses.

He will himself take nothing but barley water, and the eleven gentlemen take the rest. Henrietta is presented, and goes down so far that Mrs Bunce thinks she has fallen.

“A good house. Old. Don’t pull it about. They all pull ’em about.”

The chair that he sat in is not sat in again, Henrietta having tied a ribbon across the arms.`; }},
    {t:'Tell him what bread costs in Hatherley.', go:() => { fl('royalKnown'); fl('royalPlain'); add({goodwill:4, standing:2}); later('royalTerrace', 4);
      return `“The turnips are well enough, sir. It is the bread. The quartern loaf is ${wheatNow() >= 100 ? 'eighteen pence' : 'a shilling'} and a man has nine shillings a week.”

The eleven gentlemen look at the sky. The King looks at you.

“What? Nine? Not enough. Not enough. I give mine twelve at Windsor. Tell ’em the King gives twelve.”

He takes out a purse, and gives Mudge five guineas for the poor; and Mudge carries it to the vestry in both hands.`; }}
  ]});

ev({ id:'royalTerrace', follow:true, cond:() => F('royalKnown') && S.year <= 1804, title:'The Terrace at Windsor',
  text:() => `On Sunday evenings the Royal Family walks upon the Terrace at Windsor, while a militia band plays; and any person decently dressed may stand along the wall.

A card has come from an equerry, by which Mr and Mrs ${S.sur} are desired to be upon the Terrace on Sunday.

${hh(`Henrietta has had the card nine times in her hand. A Court suit is a hundred and twenty pounds with the sword; and the mantua-maker at Reading has never made a hoop of that width.`, `Henrietta has the news in Gay Street by Tuesday, and writes that she will come. A Court suit is a hundred and twenty pounds with the sword; and the mantua-maker at Bath wants three weeks for a hoop of that width, when there are five days.`)}`,
  choices:[
    {t:'Go in full dress.', note:'£120', go:() => { add({money:-120, standing:6, family:4}); reg('henrietta',2);
      return `It is a hundred and twenty pounds, for a plum-coloured coat with steel buttons, a bag-wig, and a sword that will not hang straight.

The King comes down the Terrace with the Queen upon his arm, and five Princesses behind; and he stops.

“${S.sur}! The turnips! How is my ram? Dead? What? They told me it would stand the wet.”

It is heard by four hundred people; and Lord Cullerne, who stands further down the wall, where the King has not stopped, is one of them.`; }},
    {t:'Go in your Sunday coat.', go:() => { add({standing:2, goodwill:2, family:-2}); reg('henrietta',-1,'You went to Windsor in your brown coat');
      return `You go in your brown coat, and your own hair; and Henrietta walks a yard from you.

The King stops, and taking hold of your lapel, feels the cloth.

“English wool. Good. Good. That’s a coat. Look at this man’s coat.”

The equerries look at your coat; and a lady in feathers asks Henrietta whether her husband is the King’s bailiff. ${hh(`Henrietta does not speak between Slough and Reading.`, `Henrietta does not speak between Slough and Reading; and at Reading she takes the Bath coach.`)}`; }},
    {t:'Send your duty and stay at home.', go:() => { add({standing:-2, family:-4}); reg('henrietta',-2,'You would not take her to Windsor');
      return `You write to the equerry that the harvest forbids.

The Tamworths go to Windsor on the Sunday, and stand along the wall; and though the King does not stop, Mrs Tamworth says that she saw the Princess Amelia’s shoe quite distinctly.

${hh(`Henrietta keeps the card in the frame of her glass, where it is to be seen every morning.`, `Henrietta has the card sent to Gay Street, where Mrs Loveday has seen it in the frame of her glass.`)}`; }}
  ]});

ev({ id:'royalBond', from:1805, to:1809, weight:6, cond:() => F('royalKnown') && !F('bondAsked'), title:'A Gentleman from Carlton House',
  text:() => `A Colonel McMahon has posted down from London, a small man with a red face, who is secretary to the Prince of Wales.

“His Royal Highness knows his father’s friends in Berkshire, sir. He would wish to count them his own.”

The Prince owes six hundred thousand pounds, and is building at Brighton; and the Colonel has in his hat a paper, being His Royal Highness’s bond for a thousand pounds, at five per cent.${F('mp') ? `

“And there is the vote on the Prince’s establishment in March. A Member who held the bond would know how to give it.”` : ''}

He lays the bond upon the table. It has a very large seal.`,
  choices:[
    {t:'Take the bond.', note:'£1,000', go:() => { fl('bondAsked'); fl('princeLoan'); add({money:-1000, standing:4});
      return `You give a thousand pounds, by draft upon Tidmarsh; and the Colonel has it in his hat before the ink is dry.

At Christmas there comes a card, “The Prince of Wales to his friend Mr ${S.sur}”, with the name written in by another hand.

The interest is due at Lady Day, and Lady Day passes; and when Mr Tidmarsh asks what security you hold, you show him the seal.`; }},
    {t:'Fifty guineas, as a gift, and no bond.', note:'£52', go:() => { fl('bondAsked'); add({money:-52, standing:1});
      return `“I do not lend, Colonel. I should be honoured if His Royal Highness would accept fifty guineas.”

The Colonel looks for a moment at the purse, and accepts it on His Royal Highness’s behalf.

No card comes at Christmas. But in the spring you hear that a horse named Fifty Guineas ran third at Brighton.`; }},
    {t:'Say that you are the King’s man.', go:() => { fl('bondAsked'); fl('kingsMan'); add({standing:-1, goodwill:2});
      return `“I have had the honour to show His Majesty my turnips, sir. I had rather keep to the one acquaintance.”

The Colonel bows, and takes up the bond, and blows the sand off it.

“Kings do not live for ever, Mr ${S.sur}.”

He goes on to the Tamworths, and is there two hours.`; }}
  ]});

ev({ id:'royalRegency', from:1811, to:1811, weight:40, cond:() => F('royalKnown') && !F('regencySeen') && S.season >= 1, title:'The Regent’s Fête',
  text:() => `The King is shut up at Windsor, blind, in a purple dressing-gown, playing the harpsichord to people who are dead; and the Prince of Wales is Regent.

On the nineteenth of June the Regent gives a fête at Carlton House, for which two thousand cards have gone out.

${F('princeLoan') ? `One has come to Hatherley. It is addressed to “Mr ${S.sur}, of Wiltshire”. No interest has been paid on the thousand pounds.` : F('kingsMan') ? 'None has come to Hatherley. Mr Tamworth has one, and has shown it at the Bell, and at church, and to your gate-keeper.' : 'One has come to Hatherley. Nobody can say why; and Henrietta is of opinion that it is better not to ask.'}

At Windsor the Terrace is shut, and the band has been sent away.`,
  choices:[
    {t:'Go to Carlton House.', note:'£150', if:() => !F('kingsMan'), go:() => { fl('regencySeen'); add({money:-150, standing:7, family:3});
      return `It costs a hundred and fifty pounds in lace, feathers, and a hired chariot; and you are four hours in Pall Mall getting to the door.

The supper table is two hundred feet long, and down the middle of it, between banks of moss, there runs a stream of real water, with gold and silver fish in it; of which, by two in the morning, several are floating.

The Regent sits at the head, in a field-marshal’s coat, and you see him through a glass at sixty yards. ${F('princeLoan') ? 'He does not see you. Colonel McMahon does, and goes behind a pillar.' : 'Henrietta has counted the diamonds upon him, as far as the sword, where she gives it up.'}`; }},
    {t:'Go, and ask McMahon for your thousand pounds.', if:() => F('princeLoan'), go:() => { fl('regencySeen'); fl('privyChamber'); add({standing:6}); reg('henrietta',1);
      return `You find the Colonel behind a pillar, and hold out the bond.

“My dear sir. Not here. His Royal Highness never forgets a friend.”

In a fortnight there comes a letter, appointing you a Gentleman of the Privy Chamber; to which place there belongs no salary, and no duty, and the fees upon the patent are thirty-one pounds.

The bond is asked for, to be compared with the register. It does not come back.`; }},
    {t:'Go to Windsor and pray for the King.', go:() => { fl('regencySeen'); add({goodwill:3, standing: F('kingsMan') ? 2 : -1});
      return `You drive to Windsor on the Sunday. There is a prayer for His Majesty in St George’s, and forty people in the chapel to hear it.

Afterwards you walk under the north wall, where a window is open, high up; and somebody within is playing Handel upon a harpsichord, slowly, and with the wrong notes put right.

A page looks out, and shuts the window. You stand a while with your hat off; and so does a sentry.`; }},
    {t:'Stay at home. It is hay time.', go:() => { fl('regencySeen'); add({family:-2});
      return `The hay is carried on the nineteenth of June, and is a good crop.

The Mercury gives the fête four columns, of which the fish have a paragraph to themselves; and Henrietta reads all four aloud, and the names of the Berkshire company twice. There are nine.`; }}
  ]});

ev({ id:'royalPrincess', from:1813, to:1814, weight:8, cond:() => F('regencySeen') && !F('carolineSeen'), title:'An Address to the Princess',
  text:() => `The Regent has forbidden the Princess of Wales to see her daughter more than once a fortnight; and her letter to him is in the Morning Chronicle, three columns of it, and the whole kingdom has read it.

The City of London has voted her an Address; and now there is one upon the table at the Bell, “The dutiful and loyal Address of the Inhabitants of Wyvern to Her Royal Highness”, which two hundred have signed, and to which Jem Pryor has made his mark.

${F('mp') ? 'Mr Whitbread will move in the House on Friday, and has written to ask where the Member for Wyvern stands.' : 'The landlord has kept the top line clear, and says that it wants a gentleman’s name to lead.'}${F('privyChamber') ? ' You are a Gentleman of the Regent’s Privy Chamber.' : ''}`,
  choices:[
    {t:() => F('mp') ? 'Vote with Mr Whitbread, and sign.' : 'Sign on the top line.', go:() => { fl('carolineSeen'); const pc = F('privyChamber'); if (pc) fl('privyChamber', false); add({goodwill:6, standing: pc ? -5 : -2}); reg('pryor',1); reg('cullerne',-1);
      return `You write your name upon the top line, and the landlord sands it himself.

The Address goes up to Kensington with four hundred and eleven names; and the Princess, who receives it in a red wig, thanks the people of Wyvern in a strong German voice.

${pc ? 'A letter comes from the Lord Chamberlain. His Royal Highness has no further occasion for Mr ' + S.sur + ' in his Privy Chamber; and the fees are not returned.' : 'Lord Cullerne dines that month with the Regent at Brighton, and is heard to say that Hatherley was always a Jacobin house.'}`; }},
    {t:'Decline. It is between man and wife.', go:() => { fl('carolineSeen'); add({goodwill:-4, standing:3});
      return `“It is between a man and his wife.”

“Yes, sir,” says the landlord. “That is what she complains of.”

The Address goes up without a gentleman’s name. The top line stays clear; and upon it somebody has drawn a pair of whiskers.`; }},
    {t:'Let Henrietta sign for the house.', go:() => { fl('carolineSeen'); add({goodwill:3, family:3}); reg('henrietta',2,'You let her sign for the Princess');
      return `Henrietta walks into the Bell in her bonnet, where no lady of the county has been before her, and signs upon the top line. “Henrietta ${S.sur}, a Mother.”

Forty women of Wyvern sign under her that afternoon.

Mrs Tamworth says that she never heard of such a thing; and on Thursday, with a veil down, she signs.`; }}
  ]});

/* ---- The clergy ----
   Eleven papers, most of them taken from real cases of the years they are set in (see docs/SOURCES-clergy.md).
   Dr Gall carries those marked gall; the Rector of Wyvern, Mr Twisleton, carries what would not sit on Mr Oakes. */
const gallHere = () => !F('gallDead');
const CLERGY = [
  {id:'clergy-brothers', hot:true, once:true, title:'The Prince of the Hebrews', w:() => (S.year === 1795 && S.season >= 1) || S.year === 1796, x:() => `Mr Richard Brothers, late a lieutenant in the Navy, has announced that he is Prince of the Hebrews; that London is to be swallowed by an earthquake upon the King’s birthday; and that the King is then to hand him the crown. A Member of Parliament has moved that his prophecies be printed; and though the Privy Council has shut Mr Brothers up as a lunatic, his book is in its fourth edition.

Mr Twisleton, the Rector of Wyvern, has read it; and on Sunday he preached upon it for an hour and ten minutes, and named the day. Nine families in his parish have sold their pigs.`,
    o:[{t:'Write to the Bishop.', go:() => { add({standing:1});
      return `You write to the Bishop of Salisbury. His lordship’s chaplain answers, that the Bishop is at Bath, and that a sermon upon prophecy is not in itself irregular.

The King’s birthday is a fine day, and the bells are rung, and London stands.

Mr Twisleton preaches the Sunday after; when it appears that having gone through the figures again, he finds that he had carried a one, and that it is to be 1798.`; }},
    {t:'Go and hear him.', go:() => { add({goodwill:1});
      return `You ride over, and sit under him. He has the Book of Daniel open, and a slate, and does the sum in the pulpit, aloud; and it coming out to the fourth of June, he shows the congregation the slate.

The clerk, who sits below with a slate of his own, makes it the ninth of August. Nobody has asked him.`; }},
    {t:'Buy the nine families’ pigs back for them.', note:'£14', go:() => { add({money:-14, goodwill:3});
      return `You pay fourteen pounds to a dealer at Newbury, who had given nine; and the pigs come home on the fifth of June, the city being still standing.

Eight families take their pigs, and thank you. The ninth will not.

“We have sold up for Jerusalem, sir. It would not be right to go back on it for a pig.”`; }}]},

  {id:'clergy-arms', hot:true, once:true, title:'The Church Militant', w:() => gallHere() && (S.year === 1798 || yr(1803, 1804)), x:() => `The French are expected; and Hatherley has forty Volunteers, eleven muskets, and a drum.

Dr Gall has come to parade in a scarlet coat with black facings, and a sword that was his grandfather’s at Dettingen, having given himself the rank of Captain-Chaplain. Now the Archbishop has written to every bishop, that the clergy are not to take arms, it not consisting with their calling; and Dr Gall has the letter in his hat.

“It says arms. It does not say command.”

He is near seventy, and has had the drum moved nearer to him.`,
    o:[{t:'Let him command.', go:() => { add({goodwill:2}); reg('gall',2,'You let him drill the Volunteers');
      return `Dr Gall drills the company upon the Common every evening for a month.

He gives the words of command out of the Prayer Book, to be sure of them. “Let us stand”; and they stand. But for the right wheel he can find none.

The men like him, nobody having ever let them out so early.`; }},
    {t:'Show him the Archbishop’s letter again.', go:() => { add({standing:1}); reg('gall',-2,'You took his company from him');
      return `You read him the Archbishop’s letter upon the Common, before the men.

He takes off the sword, and gives it to the drummer to hold; and on Sunday he preaches from the text, “He that hath no sword, let him sell his garment and buy one.”

The scarlet coat is seen again in November, upon the Vicarage scarecrow.`; }},
    {t:'Make him chaplain, and have him pray before drill.', go:() => { add({goodwill:-1}); reg('gall',1);
      return `He is to be chaplain, and to pray before drill.

He prays for forty minutes, and prays against the French by name, from the Directory downward; so that it is dark when he says Amen.

The company has not this month fixed bayonets. It has no bayonets.`; }}]},

  {id:'clergy-tooke', hot:true, once:true, title:'A Doctor of Divinity for Wyvern', w:() => gallHere() && S.year === 1801, x:() => `Mr Horne Tooke has been returned to Parliament for Old Sarum. He is a clergyman; for though he has not worn the gown these thirty years, he was ordained, and nothing can undo it. The House is debating whether a priest may sit, and Dr Gall has followed every word.

“If a Jacobin in orders may sit for seven burgage plots, sir, I do not see why a sound divine should not sit for thirty-one.”

He has had a card printed. “The Revd. Dr. GALL solicits the Favour of your Vote and Interest.” ${F('mp') ? 'It is your seat that he solicits.' : 'He asks whether your three plots are bespoke.'}`,
    o:[{t:'Tell him to wait for the vote of the House.', go:() => { add({standing:1});
      return `“Let us see what the House says, Doctor.”

The House says that no person in holy orders shall sit in it, and the Act passes in June.

Dr Gall has two hundred cards; and writing the week’s texts upon the backs of them, he makes them last four years.`; }},
    {t:'Promise him your interest.', go:() => { add({standing:-2}); reg('gall',2,'You promised him your votes for Wyvern'); reg('cullerne',-1);
      return `You promise him your interest. He canvasses Pig Lane in his bands, telling each elector what his soul is worth, and asking for his vote after; and Lord Cullerne’s agent sends to know whether Mr ${S.sur} is quite well.

The Act passes in June, by which no priest may sit. Dr Gall says that he was within eleven votes. He has not counted them for anybody.`; }},
    {t:'Ask who would take the duty at Hatherley.', go:() => { reg('gall',-1); meet('oakes'); reg('oakes',1);
      return `“And who would take the duty here, Doctor, from November to July?”

“Oakes takes it now.”

It is the first time that he has said so; and Mr Oakes, who is at the other end of the room with a teacup, looks into it.`; }}]},

  {id:'clergy-informer', hot:true, once:true, title:'Ten Pounds a Month', w:() => gallHere() && yr(1800, 1803), x:() => `Dr Gall is also Rector of Fenny Sutterby, in Lincolnshire, which he has held since ’71, and has not seen; a curate there having thirty pounds a year, and sending him the rest.

Now an attorney’s clerk in Furnival’s Inn has found an Act of Henry the Eighth, by which a parson absent from his benefice forfeits ten pounds a month, half to the King, and half to whoever informs; and the clerk has informed against six hundred clergymen. Dr Gall’s writ is for eleven months, and he has brought it up to the Hall in the gig.

“A hundred and ten pounds, sir. To a clerk.”`,
    o:[{t:'Lend him the hundred and ten.', note:'£110', go:() => { add({money:-110}); reg('gall',3,'You paid the informer for him');
      return `You pay a hundred and ten pounds, for which the clerk’s receipt is very civil.

Parliament stops the suits the next session; and a new Act letting a bishop license any parson to live away who can show cause, Dr Gall shows cause, the air of the Fens being bad for his chest.

He repays you in tithe pigs, at his own valuation; and there are a great many pigs.`; }},
    {t:'Advise him to go and reside.', go:() => { reg('gall',-1); meet('oakes'); reg('oakes',1); add({goodwill:2});
      return `He goes into Lincolnshire in November, to reside; and Mr Oakes has Hatherley, where the sermons are twelve minutes, and there is a fire in the vestry.

Dr Gall is back at Candlemas, with an ague. The parsonage at Fenny Sutterby has no roof upon the east side; and he read himself in to eleven people, and a dog.

“They did not know me,” he says. “They knew the dog.”`; }},
    {t:'Fight it at the Assizes.', note:'£30', go:() => { add({money:-30, standing:1}); reg('gall',1);
      return `You pay thirty pounds to counsel, whose defence is that Dr Gall was all the while residing upon another cure of souls.

The judge asks which of his two flocks the Doctor would say that he had been feeding; and counsel answering, “Both, my lord, by deputy,” the court laughs.

Before judgment Parliament stops every such suit in the kingdom. The clerk in Furnival’s Inn is said to have cleared four thousand pounds first.`; }}]},

  {id:'clergy-trusler', once:true, title:'The Same Sermon', w:() => gallHere(), x:() => `Dr Gall and the Rector of Wyvern have exchanged pulpits for the Sunday.

Mr Twisleton preaches at Hatherley upon the Unjust Steward, a good sermon, of twenty-two minutes, read from a manuscript in a clear round hand. At that hour Dr Gall is preaching at Wyvern, and upon the Unjust Steward; and Mr Tamworth, who was at Wyvern in the morning, and is at Hatherley for Evensong, says that it was the same sermon to the word.

Dr Trusler of Bath sells sermons at a shilling, printed in a type cut to look like writing, so that the gallery may not know.`,
    o:[{t:'Say nothing.', go:() => { reg('gall',1);
      return `You say nothing. Mr Tamworth says it at eleven dinner-tables.

The next Sunday Dr Gall preaches a sermon of his own, of fifty minutes, upon the Hittites, looking at the Hall pew at every heading.

By the fourth heading Mr Tamworth is asleep.`; }},
    {t:'Send to Bath for the whole set.', note:'£3', go:() => { add({money:-3, goodwill:1}); reg('gall',-2,'You followed his sermon in Trusler');
      return `You give three pounds for sixty sermons in a box, and take the box to church.

Dr Gall gives out his text, and you find the place, and follow him down the page with your finger; and at the foot of it he looks up, and sees the finger.

He turns two leaves at once; by which the Unjust Steward ends as the Prodigal Son.`; }},
    {t:'Ask him which he thinks the best of them.', go:() => { reg('gall',2); add({standing:1});
      return `You ask him over the port which of Dr Trusler’s he thinks the best.

He is silent a minute.

“Number nineteen. On Charity. I have preached it since ’84. I shall be sorry to lose it.”

You tell him that he need not; and he preaches it at Christmas, with Mr Tamworth in the front pew, moving his lips.`; }}]},

  {id:'clergy-tithe', title:'Tithe Turnips', w:() => gallHere(), x:() => `Dr Gall takes his tithe in kind, that is to say every tenth sheaf, the tenth lamb, and the tenth pail of milk; and Mr Hartopp having sown forty acres of turnips, Dr Gall claims the tenth turnip.

Hartopp has taken advice. The law says that he must set the tithe out, and give the parson notice of the hour; and the notice is upon your table, for you to witness.

“Mr Hartopp will draw turnips in the Forty Acres on Tuesday at two in the morning and on each morning following. He will draw twenty. The Revd. Dr Gall may attend for his two.”

Both men are in your library, and neither has sat down.`,
    o:[{t:'Witness the notice. It is the law.', go:() => { reg('hartopp',2,'You witnessed his turnip notice'); reg('gall',-2);
      return `You sign.

Dr Gall’s man is in the Forty Acres at two in the morning for nine nights, with a lantern and a sack, and carries home eighteen turnips; and upon the tenth night he does not come.

Hartopp draws four acres before breakfast. He is fined at the next visitation for brawling in the vestry, and says that it was worth forty acres.`; }},
    {t:'Have them compound for money.', go:() => { add({standing:2}); reg('gall',1); reg('hartopp',1);
      return `You keep them in the library until five. Hartopp is to pay four shillings an acre, and keep his turnips; and Dr Gall is to stay out of the field.

They shake hands upon it, and each tells you privately that he has had the better of the other.

The paper is in your hand; and both asking for the original, you have it copied twice, and keep the original.`; }},
    {t:'Tell Hartopp a parson must live.', go:() => { reg('gall',2,'You stood by his tithe'); reg('hartopp',-2); add({goodwill:-2});
      return `“The tithe is his freehold, Hartopp. As the land is yours.”

Hartopp sets out every tenth turnip in a row along the headland, half a mile of them, and sends for the tithe cart.

They are the smallest turnips ever seen in Berkshire, and he has been three days choosing them.`; }}]},

  {id:'clergy-school', hot:true, once:true, title:'Methodism in the Schoolroom', w:() => gallHere() && yr(1800, 1803), x:() => { meet('oakes'); return `Mr Oakes keeps a Sunday school over the stable at the curate’s house, where forty children learn their letters out of the Catechism; and in the evening their mothers come, and he reads them a chapter.

Dr Gall has a pamphlet from Somersetshire, where a curate at Blagdon has charged Mrs Hannah More’s schools with Methodism; since which there have been twenty-three pamphlets, and Dr Gall has read nine.

“Prayer without the book, sir. Women, after dark. It begins so. I shall have it shut.”

Mr Oakes says that he prays from the book, and that the women come after dark because they work until dark.`; },
    o:[{t:'Stand by the school.', go:() => { add({goodwill:4}); reg('oakes',2,'You stood by his school'); reg('gall',-2,'You kept the curate’s school open against him');
      return `“The room is over my stable, Doctor. I do not shut it.”

Dr Gall writes a pamphlet, “A Letter to a Country Gentleman on the Danger of Unlicensed Instruction”, which sells eleven copies, six of them to himself.

The school goes on; and at Christmas there are forty children who can read the pamphlet.`; }},
    {t:'Go and sit at the back on Sunday evening.', go:() => { add({goodwill:2}); reg('oakes',1);
      return `You sit at the back, among the mothers, of whom there are twenty-six. Mr Oakes reads the fifteenth of Luke, from the book, and shuts the book.

A carter’s wife asks why the elder son was not given a kid; and Mr Oakes saying that he has often wondered, they talk of it for half an hour.

You tell Dr Gall that there was no praying without the book. You do not tell him about the kid.`; }},
    {t:'Let the Vicar shut it. It is his parish.', go:() => { add({goodwill:-4}); reg('gall',2); reg('oakes',-2,'You let his school be shut');
      return `The room over the stable is locked, and Dr Gall keeps the key.

On Sunday evening twenty-six women are in Dewey’s barn, where a shoemaker from Hungerford is reading to them, with no book at all.

Mr Oakes walks past the barn, with his hat pulled down, and does not go in; and then he walks past it again.`; }}]},

  {id:'clergy-burial', hot:true, once:true, title:'A Child at the Lich-gate', w:() => yr(1809, 1810), x:() => `A child of two has died at Wyvern, whose father is a Baptist weaver, and who was baptised in his meeting-house, with water and the proper words. Mr Twisleton will not bury her; for he says that in the eye of the Church she was never baptised, and is no Christian; and he has locked the lich-gate.

The coffin has been upon two chairs in the road since ten o’clock, with forty people standing by it, and the father with his hat off; and it has begun to rain.

A rector in Rutland did the same last year, and the Court of Arches has him before it now. You are the nearest magistrate.`,
    o:[{t:'Tell Twisleton to open the gate.', go:() => { add({goodwill:4, standing:1});
      return `“You will open that gate, sir. You will read the service. I shall stand here while you do it.”

He opens the gate, and reads the service very fast, with his back to the father, leaving out the word “sister”.

In December the Court of Arches gives judgment against the Rutland rector, who is suspended three months; and Mr Twisleton, having read the report, has a cold for three Sundays.`; }},
    {t:'Send for Mr Oakes to read it.', go:() => { meet('oakes'); add({goodwill:3}); reg('oakes',1,'He buried the Baptist’s child at Wyvern');
      return `Mr Oakes comes over from Hatherley on foot, six miles, with his surplice in a bag.

Mr Twisleton will not open the gate to another clergyman; and Mr Oakes therefore reads the whole service in the road, over the two chairs, in the rain. Then the sexton, whom nobody has told not to, lifts the coffin over the wall.

The Bishop writes to Mr Oakes. It is not a reprimand; and it is not anything else.`; }},
    {t:'It is a matter for the Church courts.', go:() => { add({goodwill:-4, standing:1});
      return `“I have no power inside that gate.”

The coffin is carried back up the street; and on Thursday she is buried behind the meeting-house, between the wall and the dye-works.

When the Rutland judgment comes, the weaver has it printed at his own cost, and nails one to the lich-gate; and it being taken down, he nails another.`; }}]},

  {id:'clergy-bishop', once:true, title:'The Bishop at Wyvern', w:() => S.year >= 1798, x:() => `The Bishop of Salisbury confirms at Wyvern on Thursday, not having been in this corner of the diocese for seven years.

Four hundred and sixty candidates are come in from nineteen parishes, of whom some are twelve, and one is a grandmother; and the Bishop, having to dine at Newbury at four, will lay his hands upon them at the rail in rows of twenty, and say the words once for each row.

His lordship lies the night at Hatherley. His chaplain has sent the particulars: his lordship takes his port at blood heat, and does not eat veal.`,
    o:[{t:'Give him a proper dinner.', note:'£25', go:() => { add({money:-25, standing:4}); reg('henrietta',1);
      return `It costs twenty-five pounds, in turbot, and a saddle of mutton, and no veal; and the port stands an hour before the kitchen fire.

The Bishop confirms four hundred and sixty in fifty minutes; and a boy from Kintbury, going up with two rows, and being confirmed twice, asks whether it counts double.

His lordship tells Henrietta that he has not been so comfortable since Lambeth, and falls asleep at nine, with his wig upon the fire-screen.`; }},
    {t:'Give him what the house has.', go:() => { add({standing:-1, goodwill:1});
      return `There is boiled mutton, and a batter pudding, and the port as cold as the cellar.

The Bishop eats very little. He asks the chaplain something in Latin, and the chaplain looks at the port.

At the church he does the four hundred and sixty in forty minutes, and is at Newbury by three.`; }},
    {t:'Ask him for a living for Mr Oakes.', note:'£25', go:() => { meet('oakes'); add({money:-25, standing:2}); reg('oakes',2,'You spoke to the Bishop for him');
      return `You lay out twenty-five pounds in turbot and mutton; and over the port you name Mr Oakes, with his forty pounds a year, and the whole duty, and his twelve-minute sermons.

“Twelve?” says the Bishop; and taking out a pocket-book, he writes “Oakes. 12 min.”

Nothing comes of it that year. But the chaplain writes to Mr Oakes for a copy of a sermon.`; }}]},

  {id:'clergy-hunting', title:'The Rector of Wyvern Takes a Funeral', x:() => `Mr Twisleton hunts three days a week with Lord Cullerne’s hounds, and keeps two horses upon a living of four hundred.

Old Mrs Gabb was to be buried at Wyvern on Tuesday, at eleven. But the hounds, meeting at Hatherley Copse at half past ten, found at once, and ran straight through Wyvern churchyard; where Mr Twisleton, pulling up at the grave, read the service from the saddle in eleven minutes, and was with the hounds again at the second check.

The Gabbs are maltsters, and have come to you. They say that the Sunday before there were spurs under the surplice.`,
    o:[{t:'Write to the Bishop.', go:() => { add({goodwill:2}); reg('cullerne',-1);
      return `You write to Salisbury, and are six weeks waiting for the answer.

His lordship has spoken to Mr Twisleton, and Mr Twisleton has undertaken not to read the burial service on horseback.

He keeps his word; for at the next hunting funeral he gets down, and gives a boy the reins.`; }},
    {t:'Speak to him at the covert side.', go:() => { add({standing:1});
      return `You ride up to him at the covert side on Thursday.

“The Gabbs are hurt, Twisleton.”

“I gave her every word, ${S.sur}. I left nothing out. Old Gabb hunted till he was seventy. He would have had me do it.”

The hounds find, and he is gone before you have answered.

He sends the Gabbs a brace of pheasants. They are yours, he having shot them on Tuesday week.`; }},
    {t:'Tell the Gabbs she is buried either way.', go:() => { add({goodwill:-3});
      return `“She is as well buried as any woman in Berkshire, Mr Gabb.”

Mr Gabb puts on his hat in your hall.

The Gabbs take a pew at the Independent chapel in Mill Lane, and eleven maltsters’ families with them; which Mr Twisleton says leaves more room for the horses.`; }}]},

  {id:'clergy-southcott', hot:true, once:true, title:'Shiloh', w:() => S.year === 1814, x:() => `Joanna Southcott of Devonshire, who is sixty-four, has announced that she is with child by the Holy Ghost, and that the child is to be called Shiloh, and will be born before Christmas. Nine physicians have examined her, and six say that she is.

Her followers are sealed, each having a half-sheet of paper signed by Joanna, and closed with red wax, of which a hundred thousand are said to be out; and a crib of satinwood and gold has been made in Aldersgate Street, for two hundred pounds.

Mr Twisleton has been sealed, and has left off hunting, and is collecting in Wyvern for a silver pap-spoon. Mrs Bunce has a seal in her tea-caddy, which she had of the pedlar for a shilling.`,
    o:[{t:'Give a guinea to the pap-spoon.', note:'£1', go:() => { add({money:-1, goodwill:2});
      return `You give a guinea, and Mr Twisleton writes your name in the book, between a duchess’s housekeeper and a tallow-chandler.

Joanna dies on the twenty-seventh of December; and the surgeons open her, and there is no child.

Mr Twisleton keeps the spoon, saying that the birth was spiritual, and that the spoon may yet be wanted. He is hunting again by February, and says grace with his eyes open.`; }},
    {t:'Take Mrs Bunce’s seal away.', go:() => { add({goodwill:-2, standing:1});
      return `You have the seal out of the tea-caddy, and put it upon the kitchen fire.

Mrs Bunce watches it burn, and says nothing; but the dinner that day is cold mutton, and so is the next.

Joanna dies on the twenty-seventh of December, and there is no child; and Mrs Bunce says that she would have been saved the disappointment, if she had been let keep the paper.`; }},
    {t:'Ask Mrs Bunce what the seal says.', go:() => { add({goodwill:1, family:1});
      return `She brings it up upon a plate. “The Sealed of the Lord. The Elect, Precious. Man’s Redemption to inherit the Tree of Life.” And under it, “Joanna Southcott”, in a hand that slopes down the page.

“I do not hold with it, sir. But it was only a shilling. One would look very foolish without.”

Joanna dies on the twenty-seventh of December, and there is no child. The seal stays in the caddy, where Mrs Bunce says that it keeps the tea dry.`; }}]}
];
pooled('clergy', CLERGY, 'clg', {from:1795, to:1815, weight:6, repeatGap:3});

/* ---- The war at Hatherley ----
   What twenty years of war bring to one parish: recruiting serjeants, deserters, prisoners, a man home from
   Corunna, gold at a premium. Pieces marked hot belong to their year. No piece is drawn in the peace of 1802. */
const warOn = () => S.year <= 1801 || (S.year >= 1803 && S.year <= 1814);
const WAR = [
  {id:'war-contribution', hot:true, once:true, title:'The Voluntary Contribution', w:() => S.year === 1798, x:() => `Mr Pitt has asked the nation for a gift, over and above the taxes; and books are open at the Bank, and in every county town, in which the King has put down twenty thousand pounds, and a crossing-sweeper in the Strand a guinea.

The book for Wyvern lies upon a table at the Town Hall, with each name written in it, and its sum beside it; and the Mercury will print the list.

Lord Cullerne has given five hundred. Mr Tamworth has given fifty, and wrote it large; and the line under Mr Tamworth is empty.`,
    o:[{t:'A hundred pounds.', note:'£100', go:() => { add({money:-100, standing:5});
      return `You write “${S.sur}, of Hatherley. 100l.” under Mr Tamworth’s fifty, and write it of the same size as his.

The Mercury prints the list on Saturday; by which it appears that the servants of the Hall have given among them four pounds eleven, and that Mudge, who is printed as “A Gamekeeper”, has given a guinea.

On Monday Mr Tamworth sends ten pounds more, as from Mrs Tamworth.`; }},
    {t:'Twenty pounds.', note:'£20', go:() => { add({money:-20, standing:1});
      return `You put down twenty pounds, and the clerk blots it.

The Mercury prints the list on Saturday, in order of amount; and you are upon the second sheet, between a brewer and the Wyvern Card Club.

Mudge, who has given a guinea, is upon the same sheet.`; }},
    {t:'Nothing. The taxes are gift enough.', go:() => { add({standing:-4, goodwill:1});
      return `“I pay the assessed taxes, the land tax and the tax on my hair. That is my contribution.”

The line under Mr Tamworth stays empty; and the Mercury prints the list, and nothing else about you.

At church, when the plate goes round for the seamen’s widows, it stops at the Hall pew a little longer than usual.`; }}]},

  {id:'war-abbe', hot:true, once:true, title:'A Frenchman with a Pencil', w:() => yr(1797, 1801), x:() => `There are three hundred French priests at Reading, who fled the Revolution with what they could carry, and to each of whom the Government allows a shilling a day.

One of them, the Abbé Carron, walks out to Hatherley on Thursdays, to teach French at a shilling the hour; and having been seen upon the bridge with a pencil and paper, he is brought to the Hall by the constable, with the paper. It is a drawing of the bridge, the mill and the turnpike, with the arches numbered.

“For my sister at Jersey, monsieur. She likes a view.”

The constable says that a Frenchman might like one too.`,
    o:[{t:'Give him back his drawing.', go:() => { add({goodwill:1, family:1});
      return `You look at the drawing, in which the mill has smoke coming from the chimney, and there is a dog upon the bridge.

“Bonaparte will not get far by this, constable.”

The Abbé bows, and comes on Thursdays as before; and at Christmas he brings a drawing of the Hall, with five rooks upon it, and the windows counted right.`; }},
    {t:'Send the paper to the Alien Office.', go:() => { add({standing:1, goodwill:-1});
      return `The drawing goes to the Alien Office in Crown Street, with a covering letter; and in a month it comes back, with a clerk’s writing across the corner. “Seen. A bridge.”

The Abbé walks out no more on Thursdays. The Tamworths have him on Wednesdays, and he draws for them.`; }},
    {t:'Commit him to the Bridewell till it is looked into.', go:() => { add({standing:-2, goodwill:-2});
      return `He is nine days in the Bridewell at Reading, where he says Mass for two Irish soldiers and a coiner.

The Bishop of Saint-Pol writes from London, and so does a duchess, and so does the Under-Secretary; whose letter is the shortest of the three.

The Abbé is let out; and he sends you the drawing, finished and coloured, with the constable put in upon the bridge.`; }}]},

  {id:'war-smart', title:'The King’s Shilling', w:() => warOn(), x:() => `A recruiting party has been at the Bell since Michaelmas Fair, under a serjeant with ribbons in his cap, and with a drummer of eleven.

Mudge’s boy Tom, who is nineteen, went in on Saturday to hear the fife; and on Sunday morning he is found asleep in the stable loft, with ribbons in his hat, and a shilling in his fist.

He has not yet been before a magistrate to be sworn, and until he is, the law lets him off for twenty shillings smart money. The serjeant is in your hall, and would like the boy sworn today; and you are the magistrate.

Mudge is in the gun room. He has not come out.`,
    o:[{t:'Pay the smart money.', note:'£1', go:() => { add({money:-1, goodwill:2});
      return `You pay twenty shillings to the serjeant, who takes the ribbons out of the hat himself, and counts them.

“There’s a pint of rum owing as well, sir. He stood the party.”

Tom is back in the kennels by noon. Mudge does not thank you; but he brings up a hare on Monday, and on Tuesday another.`; }},
    {t:'Swear him. He took it.', go:() => { add({standing:1, goodwill:-3});
      return `Tom Mudge is sworn before you in the library, holding the book in the hand that has the shilling in it.

He marches on Wednesday for the depot at Chatham, behind the drummer, his mother walking beside him as far as the turnpike.

Mudge cleans every gun in the gun room that week, and cleans them again the week after.`; }},
    {t:'Ask the boy, when he is sober.', go:() => { add({goodwill:1});
      return `You have him put under the pump, and at four in the afternoon you ask him.

“I’d as lief go, sir. I have never been past Newbury.”

You swear him. Mudge shakes his hand in the yard, and gives him a knife, and a pound of shot; and when the boy asks what the shot is for, Mudge does not know.`; }}]},

  {id:'war-deserter', title:'A Man in the Hay-loft', w:() => warOn() && S.year >= 1797, x:() => { meet('pryor'); return `There is a bill upon the church door. “DESERTED from His Majesty’s 4th Regiment of Foot, JOHN PRYOR, labourer, born at Hatherley in the County of Berks, aged 22 years, 5 feet 7 inches, brown hair, a scar over the left eye. Twenty Shillings Reward over and above the Bounty.”

He is Jem Pryor’s eldest; and he was flogged at Colchester in March, with three hundred lashes, for a lost ramrod.

There has been a man in your hay-loft these four nights, to whom the stable-boy carries bread. Jem Pryor has not been to the Bell all week; and he looked at you in church, as he has never looked at you in church before.`; },
    o:[{t:'Send for the constable.', go:() => { add({standing:2, goodwill:-5}); reg('pryor',-4,'You gave up his boy to the regiment');
      return `The constable takes him in the loft, at six in the morning. He does not run, his back not being healed.

An escort comes for him from Reading; and he marches out of Hatherley with his hands tied to a corporal’s stirrup, and every door in the street shut.

The twenty shillings is sent to you by the regiment. You send it to the vestry, and the vestry sends it back.`; }},
    {t:'Do not look in the hay-loft.', go:() => { add({goodwill:4, standing:-1}); reg('pryor',3,'You did not look in the hay-loft');
      return `You do not go into the loft; and you tell the stable-boy that the old grey wants her hay from the rick this week.

On Sunday the loft is empty; and it is said that a man with a scar over his eye is loading barges at Bristol, under the name of Brown.

Jem Pryor leaves a basket of mushrooms at the kitchen door, where he has never left anything before.`; }},
    {t:'Write to his Colonel and offer a substitute.', note:'£30', go:() => { add({money:-30, goodwill:3, standing:1}); reg('pryor',2,'You bought his boy out of the 4th Foot');
      return `Thirty pounds finds a substitute at Reading, a weaver with no loom, six feet high; the Colonel of the 4th preferring a weaver of six feet to a ploughman with a grievance.

John Pryor’s discharge comes in a month, and he walks out of the loft by daylight.

Jem Pryor comes to the back door with his hat in his hand; and not being able to get anything said, he goes away again.`; }}]},

  {id:'war-prisoner', title:'A Prisoner Missing', w:() => yr(1804, 1813), x:() => `Two hundred French prisoners were marched through Wyvern on Tuesday, for the depot at Bristol, most of them seamen, who sold straw boxes and bone toothpicks in the market place while the escort dined; and a hundred and ninety-nine marched out.

The two hundredth is in your cart-shed. He is about seventeen, and has no shoes, and has eaten a raw turnip, and been sick; and Mrs Bunce, who found him, has given him the cold mutton, and locked him in the dairy.

“He says he is from Saint-Malo, sir. I think that is what he says. He cries when he says it.”`,
    o:[{t:'Send him after the escort.', go:() => { add({standing:2});
      return `A cart takes him to Newbury, under the constable; where the escort is waiting at the Pelican, and the officer counts two hundred, and signs for him.

The Transport Board sends you ten shillings, being the reward by regulation.

But Mrs Bunce had given the boy a pair of the footman’s shoes; and the footman asks you for the ten shillings.`; }},
    {t:'Keep him a week and feed him first.', go:() => { add({goodwill:2, family:1});
      return `He is a week in the room over the dairy, where in the first two days he eats eleven meals, with Mrs Bunce standing over him.

He carves her a ship out of a mutton bone, of three masts, with thread for the rigging.

On the eighth day the constable takes him to Bristol, with shoes, two shirts, and half a ham. The ship is upon the kitchen chimney-piece, and nobody may dust it but Mrs Bunce.`; }},
    {t:'Tell Mrs Bunce to leave the dairy unlocked tonight.', go:() => { add({goodwill:1, standing:-2});
      return `“Leave the dairy door, Mrs Bunce.”

“Unlocked, sir?”

In the morning he is gone, and so are the footman’s shoes, and a loaf.

He is taken at Hungerford on Thursday, asking the way to France; and the Hungerford magistrate, who has the ten shillings, writes to ask how the lad came by a Hatherley loaf.`; }}]},

  {id:'war-remount', title:'Oats for Portugal', w:() => yr(1808, 1813), x:() => `A Mr Deputy-Commissary Fisk is at the George, who buys for the army in the Peninsula, and wants oats, hay and horses, and pays in Treasury bills at ninety days.

Having looked at your stables through the gate, he offers forty pounds apiece for the two carriage bays and the brown hunter; and he will take every quarter of oats in the granary, at a shilling over the Reading price.

“They go by the Kennet to Bristol, sir, and they are in Lisbon in a month. Lord Wellington’s horses are eating chopped straw.”

Henrietta drives to church behind the bays.`,
    o:[{t:'Sell him the oats and the three horses.', note:'£190 to you', go:() => { add({money:190, family:-4, standing:1}); reg('henrietta',-1,'You sold her carriage horses to the army');
      return `It is a hundred and twenty for the horses, and seventy for the oats; and the Treasury bills are paid to the day.

The bays go down the drive behind Mr Fisk’s man, and at the lodge one of them looks round.

On Sunday the carriage goes to church behind two plough-horses, who stop of themselves at every gate.`; }},
    {t:'The oats only.', note:'£70 to you', go:() => { add({money:70});
      return `You have seventy pounds for the oats, and by Thursday the granary is swept bare.

By March there is not an oat to be had in the county under forty shillings; and you buy back twenty quarters for your own horses, of a dealer at Newbury.

The sacks have “HATHERLEY” upon them, in your own stencil.`; }},
    {t:'Neither. Send him to Hartopp.', go:() => { reg('hartopp',1);
      return `“Mr Hartopp has more oats than I have, and less use for them.”

Hartopp sells the Commissary four hundred quarters, and gives him a pamphlet upon the feeding of horses with Swedish turnips, to be forwarded to Lord Wellington.

The Commissary takes it, saying that his lordship reads everything.`; }}]},

  {id:'war-corunna', hot:true, once:true, title:'Home from Corunna', w:() => S.year === 1809, x:() => `The transports from Corunna have come into Portsmouth and Plymouth; and the men, being landed as they stood, have marched inland in what they had on.

Will Tubb of Hatherley, who went for a soldier in ’05, is at the lodge, with a blanket for a coat, and his feet tied up in a shirt, and his left arm off above the elbow. He has a paper, by which the Chelsea Board allows him ninepence a day.

“I walked the last of it on the ice, sir. From Lugo. We threw the pay-chests down the mountain to lighten the wagons. I saw twenty-five thousand pounds go over in dollars. I had not had my pay since October.”`,
    o:[{t:'Give him the lodge.', go:() => { add({goodwill:4, family:1});
      return `The old lodge-keeper being past opening gates, Will Tubb has the lodge, and the garden, and four shillings a week over his ninepence.

He opens the gate with his right hand, and salutes with it after; and he salutes the butcher’s cart.

In the evenings the boys of the parish sit along the lodge wall, while he tells them about the dollars; and by Easter it is thirty thousand pounds.`; }},
    {t:'Five guineas, and a word to the overseer.', note:'£5', go:() => { add({money:-5, goodwill:1});
      return `You put five guineas in his hand, and give him a note to Mr Nokes the overseer.

The vestry finds that a man with ninepence a day from the King cannot come upon the parish; and Mr Nokes says so twice.

Will Tubb drinks the five guineas at the Bell in eleven days. He tells the story of the dollars for a pint; and as it is a good story, he is not often thirsty.`; }},
    {t:'Ask what he saw of the 52nd.', go:() => { add({goodwill:2}); if (E() === 'army' && !F('edmundDead')) reg('edmund',1);
      return `“The 52nd, sir? They were the rear-guard. They was the last off the beach. ${E() === 'army' && !F('edmundDead') ? 'I saw Mr Edmund at Betanzos with a private’s musket on his shoulder. He had given the man his horse.' : 'They never lost a man by straggling. Not one. The Guards neither.'}”

You have him into the kitchen, where he eats for an hour, Mrs Bunce cutting up his meat without being asked.

He goes down the drive in a coat of yours, with both pockets full; and he has not asked for anything.`; }}]},

  {id:'war-wives', once:true, title:'To Go or Not to Go', w:() => yr(1808, 1813), x:() => `When a regiment embarks for foreign service, six wives in each company may go with it; and they draw for it upon the quay, the papers saying “To go” or “Not to go”.

Ann Dewey, who married a private of the 43rd at Hythe, drew “Not to go” at Portsmouth, with a child at the breast; and the regiment gave her a pass to her parish, and three halfpence a mile.

She has walked sixty miles, and is at the vestry door. But Mr Nokes the overseer says that she is a Dewey by birth, and a soldier’s wife by marriage, and that her husband’s parish is in Lancashire.

“It is four shillings a week if we own her, sir. Lancashire may own her for nothing.”`,
    o:[{t:'Hatherley owns her.', go:() => { add({goodwill:4, standing:-1});
      return `“She was christened at that font, Mr Nokes. Enter her.”

She has four shillings a week, and a room at her father’s, and takes in the Hall’s plain sewing.

In the autumn there comes a letter for her from before Burgos, in a serjeant’s hand, which she brings up to be read. It is her husband’s, by dictation; and he asks whether the child has teeth.`; }},
    {t:'Pass her on to Lancashire.', go:() => { add({goodwill:-5, standing:1});
      return `The order of removal is signed by two justices, of whom you are one.

She is passed from constable to constable, and parish to parish, a hundred and eighty miles, which takes five weeks; and at Lichfield the child dies.

In the spring the Lancashire parish writes, that it disputes the settlement, and is sending her back.`; }},
    {t:'Take her on in the Hall laundry.', note:'£8 a year', go:() => { add({money:-8, goodwill:3}); reg('henrietta',1);
      return `She has eight pounds a year, and her keep; and the child sleeps in a clothes-basket, by the copper.

She is the best ironer that the Hall has had, and irons a shirt as it is done for officers, with the frill standing.

Every Saturday she asks the footman to read her the casualty returns of the 43rd; and he reads them slowly, and while he reads she leaves off ironing.`; }}]},

  {id:'war-guineas', hot:true, once:true, title:'Guineas at Twenty-seven Shillings', w:() => yr(1811, 1812), x:() => `There is no gold to be seen. The Bank pays in paper, and has done since ’97; and a guinea is worth twenty-seven shillings in notes to anyone who will melt it, or carry it to Spain, though to sell one over twenty-one is against the law.

Lord King has given his tenants notice, that he will have his rents in gold, or in notes enough to buy it; and the House of Lords has talked of nothing else for a week.

Your tenants pay at Michaelmas, in Tidmarsh’s notes. But your uncle left a stocking of three hundred guineas behind a brick in the wine cellar; and there is a man named Levi at the back door, who is buying.`,
    o:[{t:'Give the tenants Lord King’s notice.', go:() => { add({money:150, goodwill:-8, standing:-2}); reg('thorne',-2,'You asked for your rent in gold');
      return `The notice goes out, for gold, or paper at the market rate.

The tenants cannot get gold, and they pay in notes, a fifth over; which comes to a hundred and fifty pounds.

In July Parliament passes an Act, brought in by Lord Stanhope, that a note is to be taken for what it says upon it; and he named Lord King. Your name is mentioned at the Wyvern farmers’ ordinary, and not by a lord.`; }},
    {t:'Sell Levi the stocking.', note:'£90 over the face of them', go:() => { add({money:90, standing:-1});
      return `It is three hundred guineas, at twenty-seven shillings, in Bank paper, being ninety pounds over the face of them. Levi counts in the scullery, with the door shut, and weighs every one; and eleven being light, he takes those at twenty-two.

The guineas go to Harwich in a cheese, and by Christmas are paying Lord Wellington’s muleteers; as Levi tells you himself, when he comes back to ask if there is another brick.`; }},
    {t:'Take paper, and leave the brick where it is.', go:() => { add({goodwill:3});
      return `The tenants pay at Michaelmas, in Tidmarsh’s notes, and you take them as you always have, though one has been washed in a pocket, and dried upon a hob.

It is known in the parish by evening that the Squire has not done as Lord King did.

You go down to the cellar with a candle, and count the stocking; and finding three hundred, you put the brick back.`; }}]}
];
pooled('war', WAR, 'war', {from:1797, to:1814, weight:7, repeatGap:3, cond:warOn});

/* The wandering pool: people, with their memories, turning up when they please. */

ev({ id:'crabbeSums', from:1796, to:1802, weight:3, cond:() => !F('crabbeGone') && !F('crabbeWatched') && !F('crabbeSkims'), title:'Mr Crabbe’s Arithmetic',
  text:() => `It rains for three days. On the third you take down the estate ledgers and add them up yourself.

The rents come in on the left-hand page. On the right-hand page they are fewer. You go back three years with a pencil. Three hundred pounds has gone somewhere between the two pages.

You send for Crabbe. He looks at your pencil marks. He folds his hands.

“The books are like the Book of Revelation, sir. Perfectly clear to those who have the key.”`,
  choices:[
    {t:'Dismiss him.', go:() => { fl('crabbeGone'); add({goodwill:3}); reg('crabbe',-5,'Dismissed over three hundred pounds');
      return `“You will be out of the steward’s house by Saturday.”

He bows. On Saturday a cart takes his boxes to Newbury. Your uncle’s writing desk is on the cart. Within the month a brass plate goes up in Northbrook Street. “Crabbe. Land Agent.”

The new steward is a Scot of twenty-six named Lark. On his first morning you hand him the office key. He writes you a receipt for it.`; }},
    {t:'Make him pay it back, by instalments, and keep him.', note:'+£150', go:() => { fl('crabbeWatched'); add({money:150}); reg('crabbe',-2,'Made to refund three hundred pounds');
      return `“You will pay it back. All of it.”

“Certainly, sir.” He takes a purse from his coat and counts a hundred and fifty pounds on to the ledger. He had the purse on him when he came in.

“The rest by Michaelmas.” He bows at the door. He looks at you a moment longer than he ever has before. Then he goes back to his desk.`; }},
    {t:'Let it pass. He knows where everything is.', go:() => { fl('crabbeSkims'); reg('crabbe',2,'You overlooked the three hundred pounds');
      return `You shut the ledger. Crabbe bows and takes it away.

At Lady Day there is a new line in the quarter’s accounts, in his best hand. “Sundries. £4. 10s.” At Midsummer it is there again. “Sundries. £6.”`; }}
  ]});

ev({ id:'thorneLease', from:1795, to:1800, weight:4, title:'The Widow of Long Barrow',
  text:() => { meet('thorne'); const st = F('crabbeGone') ? 'Lark' : 'Crabbe';
    return `They buried Samuel Thorne on Tuesday. On Wednesday his widow is in your estate office at nine o’clock. She has brought the farm book.

Long Barrow. Two hundred and forty acres. She opens the book on your desk and turns it to face you. Ten years of yields, all in one hand. It is not Samuel’s hand.

“I want the lease in my name, sir. Same rent. Same terms.”

${st} is standing behind your chair. He bends to your ear. “A woman tenant, sir. The county will not like it. And there is ${F('crabbeGone') ? 'a man from Hungerford' : 'my nephew'}. A hundred pounds in hand, this morning, for the preference.”

Mrs Thorne has good ears. She shuts the book and waits.`; },
  choices:[
    {t:'Renew the lease to Abigail Thorne.', go:() => { add({standing:-1, goodwill:3}); reg('thorne',4,'You gave her the lease when the county said a woman could not farm'); if (!F('crabbeGone')) reg('crabbe',-1);
      return `“Draw it in her name.”

She reads every line of the lease before she signs. Mr Oakes is fetched from the vicarage to put the Latin into English. She hears all of it. Then she writes Abigail Thorne at the foot, slowly, and blots it herself.

At harvest Long Barrow threshes out four bushels an acre above any other farm you own. ${F('crabbeGone') ? 'Lark reads you the figure twice.' : 'Crabbe enters the figure in the book. He writes it very small.'}`; }},
    {t:() => F('crabbeGone') ? 'Let it to the Hungerford man.' : 'Let it to Crabbe’s nephew.', note:'+£100', go:() => { fl('nephewFarm'); S.rentAdj *= 0.96; add({money:100, goodwill:-5}); reg('thorne',-5,'You turned her out of Long Barrow'); if (!F('crabbeGone')) reg('crabbe',2,'You gave Long Barrow to his nephew');
      return `She is out by Lady Day. One wagon. She takes two rooms over the saddler’s shop in Wyvern.

The new man likes a market. Newbury on Thursday, Reading on Saturday, Wyvern in between. By July there are docks in the wheat at Long Barrow. By August there are thistles in the docks.

The hundred pounds is in the book under Casual Profits.`; }},
    {t:'Renew to her, at twenty pounds a year more.', go:() => { S.rentAdj *= 1.01; add({goodwill:-1}); reg('thorne',1,'You gave her the lease, and raised the rent on a widow');
      return `You name the new rent. Twenty pounds more.

She looks at you for as long as it takes. Then she signs.

She pays on the day, at Lady Day and at Michaelmas, in gold. She counts it on to your desk one coin at a time. She will not take a chair.`; }}
  ]});

ev({ id:'poacher', from:1796, to:1812, weight:3, title:'A Hare in Evidence',
  text:() => `The justice room, ten o’clock. A dead hare lies on your table on a sheet of the Mercury.

Mudge stands on one side of it and Jem Pryor on the other. Mudge still has him by the collar.

“Cuckoo Copse, sir. First light. Two wires in his pocket. That hare up his frock. And he give me a look.”

“A look?”

“A look, sir.”

You know Pryor. Five children. ${F('enclosed') ? 'No cow, since the enclosure.' : 'One cow, on the common.'} Your uncle sent him to gaol twice. Your uncle also called him the best hand with a wire in Berkshire.

“Well, Pryor?”

“Her run at me, sir.”

The Act lies open in front of you. Five pounds, or three months.`,
  choices:[
    {t:'Three months in Reading gaol.', go:() => { add({standing:1, goodwill:-5}); reg('pryor',-3,'You gave him three months for a hare'); if (!F('gallDead')) reg('gall',1); S.game += 1;
      return `“Three months.”

Mudge walks him to Reading himself. On Saturday Sukey Pryor comes to the vestry with the five children and asks for relief. The overseer allows her four shillings a week. Thirteen weeks. Two pounds twelve shillings out of the rates, for one hare.

Pryor comes home. You meet him in Mill Lane. He stops, takes off his hat and holds it against his chest until you have gone by. You do not look round. You want to.`; }},
    {t:'Fine him five pounds, and lend him the five pounds.', note:'£5', go:() => { add({money:-5, goodwill:2}); reg('pryor',1,'You fined him five pounds and paid it yourself');
      return `“Five pounds.” Pryor says nothing. He has never held five pounds. “I shall pay it. You will bring me a shilling on the first Saturday of every month.”

His lips move. “Eight year and four month, sir.”

“Yes.”

The first shilling comes to the kitchen door wrapped in a dock leaf. Mrs Bunce carries it up to you on a plate.`; }},
    {t:'Dismiss the charge, and give him the hare.', go:() => { add({standing:-2, goodwill:4}); reg('pryor',3,'You let him go, and gave him the hare'); if (!F('gallDead')) reg('gall',-2,'Thinks you soft on poachers'); S.game -= 1;
      return `“A look is not evidence, Mudge. Nobody saw him set the wire. Charge dismissed.” Mudge goes dark red to the ears. “Give him the hare.”

Pryor picks her up and runs his thumb down her spine.

“Four days I’d hang her, sir. This weather. No more.”

He puts her back inside his frock and nods to you. Mudge will not open the door for him. Pryor opens it himself.`; }}
  ]});

ev({ id:'pryorFriend', from:1798, to:1814, weight:3, cond:() => S.chars.pryor.r >= 2, title:'Something at the Back Door',
  text:() => `Every Friday this winter there has been a brace of pheasants on the kitchen step. Plucked. Drawn. Wrapped in a cabbage leaf. Mrs Bunce roasts them and asks no questions.

They are your pheasants.

This Friday there is a scrap of paper inside the leaf.

“Sir. Ther is men from Kintbury say they will fire Pococks mill & yr grate barn nex it. Saterday nite. Burn this. A Frend.”`,
  choices:[
    {t:'Sit up in the barn on Saturday with Mudge.', go:() => { add({standing:2, goodwill:3}); reg('pryor',1,'You acted on his warning and named nobody');
      return `You and Mudge lie in the straw from ten o’clock.

Towards one, four men come along the mill leat. They have a dark lantern and a tar barrel. You stand up.

“Good evening.”

Nobody runs. One of them says it is a mild night for the season. You say it is. They pick up the barrel and carry it back the way they came.

You do not ask Mudge who they were. He does not tell you.`; }},
    {t:'Lay the letter before the bench and have troops sent.', go:() => { add({standing:3, goodwill:-6}); reg('pryor',-3,'You showed his letter to the magistrates');
      return `You lay the paper before the bench. A troop of yeomanry lies up behind the mill on Saturday night. They take four Kintbury men and a tar barrel. Two of the four get seven years’ transportation.

The paper is read aloud in court. “A Frend.” The whole of Hatherley can guess.

Jem Pryor’s windows are broken twice before Christmas. On Friday the kitchen step is bare.`; }},
    {t:'Burn it and do nothing.', go:() => { add({money:-280, goodwill:-1});
      return `You burn it. Alehouse talk.

On Saturday night Pocock’s mill burns to the wheel. The great barn goes with it. Forty quarters of wheat. Your uncle’s travelling chariot, which had stood in there since 1774.

On Friday there is a brace of pheasants on the kitchen step. They have not been plucked.`; }}
  ]});

ev({ id:'rickFire', follow:true, title:'Fire in the Stackyard',
  text:() => `Henrietta shakes you awake. The bedroom ceiling is orange.

From the window you can see the home stackyard. Two wheat ricks are burning. There is no wind. The flames go straight up and the sparks go higher.

You are down the stairs with your boots in your hand. Half of Hatherley is at the stackyard rails already. You count nine buckets. Every one of them is standing on the ground.`,
  choices:[
    {t:'Post a reward of fifty guineas for the incendiary.', note:'£52', go:() => { add({money:-300 - 52, goodwill:-4, standing:1});
      return `You have the bill printed in Wyvern before noon.

“FIFTY GUINEAS REWARD. Whereas some evil-disposed Person or Persons did, on the Night of Tuesday last, wilfully and maliciously set Fire to two Ricks of Wheat in the Stackyard of ${S.name}, Esquire; whoever will discover the Offender or Offenders, so that he or they be brought to Justice, shall on Conviction receive the above Reward. An Accomplice impeaching shall have the same, and Interest made for his Pardon.”

It goes up on the church door, at the Bell and on the turnpike gate. Fifty guineas would keep a Hatherley family for three years. A week goes by. A month. The rain brings down the one on the church door. Nobody has knocked.

Three hundred pounds of wheat.`; }},
    {t:'Take a bucket and join the line.', go:() => { if (T('captain') && !F('crewGone')) { add({money:-110, goodwill:4, standing:2});
      return `Tarbuck has the Dryads out of their hammocks before you are down the stairs. Two chains from the horse pond. Wet sailcloth over the second rick. The gunner is on the barn roof with an axe.

“As for a fire in the forehold, sir,” says Tarbuck.

One rick is lost. The other stands and steams. A hundred and ten pounds of wheat.

The village came to see a fire. It stays to watch the drill.`; }
      add({money:-300, goodwill:3});
      return `You pick up a bucket and walk to the horse pond. The wheelwright comes after you. Then a boy of about ten. Then the rest.

Both ricks are gone by two o’clock. Three hundred pounds of wheat. The line keeps on regardless and wets the barn thatch until it is light.

At dawn you sit down on the mounting block in your shirt. A hand holds out a mug of beer. “Here.” You look up to see who has forgotten to call you sir. He has gone back to his bucket.`; }},
    {t:'Go back to bed. Let it be seen that you do not frighten.', go:() => { add({money:-300, standing:1, goodwill:-2});
      return `You watch for one minute. Then you draw the curtain and get back into bed. Henrietta stares at you.

In the morning the ricks are two black rings. Three hundred pounds of wheat. Mudge comes in while you are at breakfast and puts a tinder-box down by your plate. “Top of the gatepost, sir. Left where I should see it.”

They are still talking of it in Wyvern at the end of the week. Some of them call it nerve.`; }}
  ]});

ev({ id:'hartoppShearing', from:1797, to:1810, weight:2, title:'Three Days of Tups and Toasts',
  text:() => `Mr Hartopp is holding a sheep-shearing. Three days. Mr Coke does it at Holkham, and Hartopp has been to Holkham.

Two hundred farmers have come. So has a Russian count with an interpreter. Mr Arthur Young sits on a hurdle with a notebook on his knee. He writes down everything he hears.

Hartopp has put a shepherd’s smock on over his coat. He stands on a wagon and speaks for an hour on dung. Twice he has to stop and blow his nose.`,
  choices:[
    {t:'Go, listen, and take notes.', go:() => { fl('hartoppFriend'); add({standing:2}); reg('hartopp',2,'You sat through his address on dung');
      return `You listen to the whole hour. You write down the weight of a Swedish turnip.

Hartopp finds you afterwards. He walks you to a cart and loads it. A drill plough, “on trial”. Six pamphlets. A bag of turnip seed.

“When you mean to improve, send to me. You shall have my man for nothing.”`; }},
    {t:'Go, and bid for his prize New Leicester tup.', note:'£120', go:() => { fl('hartoppFriend'); S.improve += 1; add({money:-120, standing:3}); reg('hartopp',3,'You paid a hundred and twenty for his tup');
      return `The tup comes into the ring on the second day. His name is Bonaparte. He has already put a shepherd over a hurdle.

You bid a hundred and twenty pounds. Hartopp shakes your hand in front of Mr Young. Mr Young writes it down.

Bonaparte rides home in a cart with a rug over him. Two springs on, your lambs are squarer and heavier. Hartopp comes to look. “Stupider, too,” he says. “That is what you want in a sheep.”`; }},
    {t:'Plead a previous engagement.', go:() => { reg('hartopp',-2,'You missed his sheep-shearing');
      return `You send your regrets.

A month later a copy of the Annals of Agriculture comes by post. Mr Young’s account of the shearing fills nine pages. He lists the gentlemen present. Then: “Some neighbouring proprietors, it is to be regretted, yet slumber.”

The line is underscored in ink. There is no letter with it.`; }}
  ]});

ev({ id:'vaneBall', from:1796, to:1799, weight:4, cond:() => K() === 'free', title:'The Militia Come to Wyvern',
  text:() => { meet('vane'); return `The Northamptonshire Militia are quartered in Wyvern for the summer. There are red coats in every shop.

On Thursday there is a ball at the Assembly Rooms. A Captain Lucius Vane dances with Kitty. He dances with her again. Henrietta puts her fan down. He dances with her a third time.

On Friday you make enquiries. He has a good leg. He has a coat from a London tailor. The landlord of the George shows you his slate. “Capt. Vane. £41.”`; },
  choices:[
    {t:'Forbid her to see him.', go:() => { fl('vaneForbidden'); add({family:-4}); reg('kitty',-2,'You forbade her the Captain'); reg('vane',-2); later('elope', 2);
      return `“You will not see Captain Vane again.”

Kitty looks at the carpet. “Yes, Papa.”

She goes up to her room. She has three volumes from the Newbury circulating library on the table by her bed. In the first of them, a father forbids it in chapter four.`; }},
    {t:'Ask him to dinner, and have a look at him.', go:() => { reg('kitty',1); later('vaneDines', 1);
      return `You send a card down to the George.

The answer is back within the hour. The paper smells of bergamot. There is a flourish under the signature as long as the signature.

Mrs Bunce is told eight to dinner. Kitty comes down in the white sash. She goes up and comes down in the blue. Then the white again.`; }},
    {t:'Let it run. She is eighteen and it is summer.', go:() => { add({family:2}); reg('kitty',2); later('elope', 2);
      return `You let it run.

There are picnics on the Down. Kitty takes her sketch-book every time. You look in it one evening. The pages are blank.

“Have you asked about the young man’s expectations?” says Henrietta.

“I am told they are considerable.”`; }}
  ]});

ev({ id:'vaneDines', follow:true, cond:() => K() === 'free', title:'Captain Vane Over the Port',
  text:() => `Captain Vane dines. He admires Henrietta’s china. He turns the pages for Kitty at the pianoforte. He calls you “sir” eleven times before the cloth is drawn.

The ladies go up. He moves the decanter an inch towards you.

“I find myself embarrassed, sir. For the moment only. Two hundred pounds would set me entirely right. I have expectations.” He fills his glass. “An aunt at Kettering. Very old, sir. Very fond of me. And very nearly dead.”`,
  choices:[
    {t:'Lend him the two hundred.', note:'£200', go:() => { add({money:-200}); reg('vane',2,'You lent him two hundred pounds'); later('elope', 2);
      return `You write the draft. He writes you a note of hand. The flourish goes right across the sheet.

On Saturday you are at Tidmarsh’s bank. The clerk sees the note in your pocket-book. He has seen nine like it, he says, in Wyvern alone.

“And the aunt, sir? At Kettering? She has been nearly dead since ’89.”`; }},
    {t:'Ring for his horse.', go:() => { fl('vaneDone'); reg('vane',-4,'You showed him the door over the port'); reg('kitty',-1); if (chance(0.6)) later('duel', 2);
      return `You ring the bell. “Captain Vane’s horse.”

He finishes his glass. He takes his time over it. At the door he turns.

“I had understood, sir, that I was dining with a gentleman.”

Kitty does not speak to you for a week. On the eighth day she says it looks like rain.`; }},
    {t:'Refuse him civilly, and tell Kitty in the morning what he asked.', go:() => { fl('vaneDone'); add({family:3}); reg('kitty',1,'You told her the truth about the Captain, and let her judge');
      return `“I regret I cannot oblige you, Captain.”

At breakfast you tell Kitty what he asked for, and how. You tell it as you would tell a man. She goes white. She goes red. She does not say a word.

That night there is a smell of burnt paper on the upper landing. The week after, the Captain bows to her in Wyvern High Street. She walks on.`; }}
  ]});

ev({ id:'elope', follow:true, cond:() => K() === 'free' && !F('vaneDone'), title:'A Ladder at the Window',
  text:() => `Henrietta wakes you at four. She has a candle.

“Kitty’s bed has not been slept in.”

The best bonnet is gone from its box. There is a ladder against the east wall. Mudge holds the lantern to it. “That’s the vicarage ladder, sir.”

The turnpike man at the Oxford road was knocked up at midnight. A curricle, two horses, going north. An officer driving. A lady beside him.

It is three hundred and twenty miles to Gretna Green.`,
  choices:[
    {t:'Order the chaise and go after them.', note:'£45', go:() => { fl('vaneDone'); add({money:-45, standing:-3, family:-2}); reg('kitty',-2,'You fetched her back from the Gretna road'); reg('vane',-3); if (chance(0.5)) later('duel', 1);
      return `Four horses, and fresh ones at every stage. Forty-five pounds.

You come up with them at nine in the morning, at the Saracen’s Head in Towcester. The curricle is in the yard with a horse dealer’s man sitting in it.

The Captain sat down to hazard at the first change. He has lost the journey money. He has lost the curricle. He has lost Kitty’s pearl ear-rings.

Kitty is in the coffee room in her bonnet. Her hands are in her lap. She gets into your chaise without a word. She cries from Brackley to Bicester.`; }},
    {t:'Let them go. She has chosen.', go:() => { fl('kitty','vane'); fl('vaneDone'); add({family:-10, standing:-6}); reg('kitty',1); reg('henrietta',-3,'You let Kitty go to Gretna'); later('vaneDowry', 3);
      return `“She has chosen.”

Henrietta puts the candle down on the floor.

A letter comes from Carlisle in a fortnight. Four pages, crossed. They were married at Gretna by a man named Paisley. He weighs twenty stone and took his fee in brandy. She is very happy. A postscript: “Pray send on my blue pelisse.”

Henrietta reads it and goes upstairs. On Sunday Mrs Tamworth presses your hand in the church porch and cannot speak.`; }},
    {t:'Send Mudge after them with fifty guineas for the Captain.', note:'£52', go:() => { fl('vaneDone'); add({money:-52, standing:-2}); reg('kitty',-3,'You bought the Captain off for fifty guineas, and he took it');
      return `You count fifty guineas into a bag and put Mudge on the grey.

He comes up with the curricle at Brackley. He holds the bag in at the window. “Fifty guineas, Captain. To drive on by yourself.”

The Captain counts it. Then he hands Kitty down.

She rides home on the pillion behind Mudge. She heard the sum. She watched it counted. She will not look at you or at him.`; }}
  ]});

ev({ id:'vaneDowry', follow:true, cond:() => K() === 'vane', title:'A Letter from Mrs Vane',
  text:() => `A letter from Kitty. Lodgings in Northampton, over a hatter’s.

“The regiment is to move. Lucius has had a reverse.” Then the weather. Then the last line. “I am to be confined in the autumn.”

There is a second sheet inside the first. It is in the Captain’s hand.

“Sir, No settlement was made upon my wife at our marriage. I am sure you will wish to repair the omission. Eight hundred pounds would answer.”`,
  choices:[
    {t:'Send the eight hundred.', note:'£800', go:() => { add({money:-800, family:3}); reg('kitty',2); reg('vane',2,'You paid eight hundred pounds on demand'); reg('henrietta',1);
      return `You send a draft for eight hundred pounds.

Doncaster races are in September. In October Kitty writes again. One side. Everything is very well. Lucius is very well. The lodgings are very comfortable.

It is half the length of her last letter. Henrietta reads it twice and holds it up to the window.`; }},
    {t:'Settle forty pounds a year on Kitty alone, through trustees.', note:'£300', go:() => { fl('kittySettled'); add({money:-300, family:5}); reg('kitty',3,'You settled money on her where the Captain could not reach it'); reg('vane',-3); reg('henrietta',2);
      return `The lawyers take a month. Forty pounds a year to Kitty, for her sole and separate use. He cannot touch it. He cannot borrow against it. Three hundred pounds, with the fees.

The Captain writes four sides. He is wounded. He had thought better of you.

Kitty does not write for a month. Then a twist of paper comes with nothing in it but a lock of very fine hair. Henrietta puts it in her work-bag.`; }},
    {t:'Reply that she made her bed.', go:() => { add({family:-8}); reg('kitty',-4,'You sent nothing when she asked'); reg('henrietta',-2);
      return `You write four lines and seal them.

On Thursday the carrier calls at the back door for a parcel. It is a cushion, addressed in Henrietta’s hand to Northampton.

Her mother’s garnets are not in the jewel case. Nor are twenty pounds of her pin money.`; }}
  ]});

ev({ id:'duel', follow:true, cond:() => S.chars.vane.met, title:'Pistols on Hatherley Down',
  text:() => `A lieutenant of the Northamptonshire Militia is shown into the library. He has very clean gloves and a lisp.

“I come from Captain Vane, sir. He conceives himself insulted. He requires thatithfaction.”

He has it all arranged. The old chalk pit on Hatherley Down. Thursday, at first light. Twelve paces. He will bring the pistols.`,
  choices:[
    {t:'Accept.', go:() => { const r = T('soldier') ? 0.1 + Math.random() * 0.4 : Math.random();
      if (r < 0.1) { S.dead = 'duel'; return `A grey morning. There are larks over the Down.

The lieutenant drops the handkerchief.

The Captain has always been a better shot than a paymaster.`; }
      if (r < 0.45) { add({standing:6, family:-3}); reg('vane',-2); reg('henrietta',-1,'You fought a duel and told her afterwards');
        return `A grey morning. There are larks over the Down. The lieutenant drops the handkerchief.

Your hand is shaking. You point the pistol at the chalk pit and pull.

The Captain sits down. The ball is in his right calf. They carry him to the George, where he lies a month on credit.

At the Wyvern assembly three men you have never met describe your coolness to you.`; }
      add({standing:3, family:-2});
      return `A grey morning. There are larks over the Down. The lieutenant drops the handkerchief.

Both pistols go off. A lark stops singing. The Captain’s ball is in the chalk. The seconds look for yours and cannot find it.

“Honour is thatithfied,” says the lieutenant. Everybody shakes hands.

The Captain breakfasts at the Bell. Chops. The landlord puts it on your account.`; }},
    {t:'Decline. You have a family, and no quarrel worth a funeral.', go:() => { add({standing:-6, family:4}); reg('henrietta',2,'You refused a duel and let the county think what it liked');
      return `You decline in writing.

For a month the officers of the Militia turn their backs on you in Wyvern. One morning there is a white feather chalked on your gate.

Then the regiment marches for Ipswich. It leaves a bill at every shop in the High Street. The saddler rubs the feather off your gate himself.`; }},
    {t:'Have the pair of them bound over to keep the peace.', go:() => { add({standing:-3}); reg('vane',-2); if (!F('gallDead')) reg('gall',1);
      return `You are a magistrate. A challenge is an incitement to a breach of the peace.

${F('gallDead') ? 'A brother justice' : 'Dr Gall'} binds both officers over in fifty pounds apiece.

The lieutenant signs the recognizance. He does not lisp once while he does it. He had bought new flints.`; }}
  ]});

ev({ id:'pinchSuit', from:1798, to:1804, weight:3, cond:() => K() === 'free', title:'Mr Pinch of Bristol',
  text:() => { meet('pinch'); return `Mr Lumley Pinch of Bristol is staying a week. He is fifty-two. He has sixty thousand pounds, made in sugar. He is red in the face before dinner and redder after.

He has come into Berkshire to buy two things. One is an estate. He tells you the other over the port.

“A wife, sir. A young lady of family. I would settle three thousand pounds on her father the day the settlements are signed.”

Through the open door he can see Kitty at the pianoforte. He looked at your rent roll this morning. He is looking at her in the same way.`; },
  choices:[
    {t:'Accept him, on Kitty’s behalf.', note:'+£3,000', go:() => { fl('kitty','pinch'); add({money:3000, family:-12, standing:2}); reg('kitty',-5,'You married her to Mr Pinch for three thousand pounds'); reg('pinch',3); reg('henrietta',-1); later('pinchDies', 20 + Math.floor(Math.random() * 12));
      return `The settlements are signed in the library. Three thousand pounds.

They are married at Hatherley. Kitty’s veil is Brussels lace. Pinch has had it valued. He tells the figure to the clergyman, the Tamworths and the clerk.

She makes every response. Her voice does not change from the first to the last.

They leave for Clifton in a new chariot. There is a coat of arms on the door. The paint is not quite dry.`; }},
    {t:'Tell him the answer must be Kitty’s.', go:() => { reg('kitty',2,'You left Mr Pinch’s proposal to her'); reg('pinch',-2); add({family:3});
      return `“You must ask her yourself.”

He asks her in the conservatory, on one knee. Then he cannot get up. The under-gardener is sent for.

Kitty comes out. “I thanked him, Papa. I said no.”

Pinch is at the sideboard helping himself to ham. “No matter, sir. I have four other properties on my list.”`; }},
    {t:'Tell him your daughter is not on the market.', go:() => { add({family:2}); reg('kitty',3,'You sent Mr Pinch packing'); reg('pinch',-4,'You told him Kitty was not for sale'); reg('henrietta',-1);
      return `“My daughter is not for sale, sir.”

He goes a darker red. His chaise is at the door within the hour.

“Three thousand pounds does not call every day,” says Henrietta.

Kitty passes behind your chair on her way through the hall. She kisses the top of your head. She has not done that since she was nine.`; }}
  ]});

ev({ id:'pinchDies', follow:true, cond:() => K() === 'pinch', title:'A Death at Clifton',
  text:() => `A letter from Kitty, sealed with black wax.

“Mr Pinch died on Tuesday. It was at the Merchant Venturers’ dinner. They had come to the turtle. He was carried out before the speeches.

He has left me everything. The house on the Downs. The sixty thousand. The estate in Jamaica, with three hundred people on it.

What ought I to do? Pray tell me.”

She has not asked your advice since her wedding day.`,
  choices:[
    {t:'Advise her to sell Jamaica and come home.', go:() => { fl('kittyWidow'); add({family:10}); reg('kitty',3,'You told her to sell the plantation and come home');
      return `She sells Jamaica, at a loss. The buyer is a Liverpool man. He will work it as it was worked before. She says so in her letter. She says it twice.

She comes home in black and takes the Dower House. She is very rich. She looks thirty.

Within the week she and Henrietta have quarrelled about curtains. You hear them from the garden. Kitty is shouting.`; }},
    {t:'Advise her to free the people on it, if the law can be made to let her.', go:() => { fl('kittyWidow'); fl('kittyManumit'); add({family:8, standing:-2}); reg('kitty',4,'You told her to free the people on the Jamaica estate');
      return `It takes her four years. She employs two attorneys. Every relation Pinch had writes to her, and then stops writing. The island’s laws are made to prevent it. She pays a bond for each person freed.

It is done. In Bristol they say Mrs Pinch has lost her wits and most of her money.

She comes home to the Dower House. She looks straight at you when she speaks.`; }},
    {t:'Advise her that she is rich, and to enjoy it.', go:() => { fl('kittyWidow'); add({family:2, standing:2, money:500}); reg('kitty',-1);
      return `She sends you five hundred pounds. “Towards the roof.”

She takes a house in Bath. Mrs Tamworth sees her in the Pump Room in half-mourning, carrying a very small dog.

She keeps Jamaica. She does not write of it. The remittances come to her banker every quarter.`; }}
  ]});

ev({ id:'oakes', from:1799, to:1806, weight:3, cond:() => K() === 'free', title:'The Curate Turns His Hat',
  text:() => { meet('oakes'); return `Mr Oakes the curate asks to see you in the library. He ${F('gallDead') ? 'has done the work of the parish for years' : 'does all Dr Gall’s work'} for forty pounds a year. ${F('gallDead') ? '' : 'Dr Gall keeps the other four hundred. '}His coat is green at the seams.

He stands on the hearthrug. He turns his hat round by the brim. It goes round nine times.

“I should like to marry Miss Kitty, sir. I have nothing. I thought you should hear it from me.”

You send for Kitty. She comes in and sees him. She goes red to the neck.

“I have always liked him better than anybody, Papa.”`; },
  choices:[
    {t:'Consent, and promise him the living when it falls vacant.', go:() => { fl('kitty','oakes'); fl('livingPromised'); add({family:8, standing:-2, goodwill:3}); reg('kitty',4,'You let her marry the curate'); reg('oakes',4,'You gave him Kitty, and the promise of the living'); reg('henrietta',-1); if (!F('gallDead')) reg('gall',-2,'Knows you have promised away his living');
      return `“You shall have her. And you shall have the living, when it falls.”

They are married in October. ${F('gallDead') ? 'The rural dean takes the service.' : 'Dr Gall takes the service. He knows what you have promised. He reads every line of it at a walk.'} The whole village is in the churchyard.

They go to live in four rooms over the old schoolhouse. A week later Henrietta calls. She finds Kitty on her knees, blackleading the grate. Kitty is singing.`; }},
    {t:'Consent, with a thousand pounds to start them.', note:'£1,000', go:() => { fl('kitty','oakes'); add({money:-1000, family:10, goodwill:3}); reg('kitty',5,'You let her marry the curate, and portioned her'); reg('oakes',3,'You gave him Kitty and a thousand pounds'); reg('henrietta',1);
      return `“You shall have her. And a thousand pounds in the funds.”

A thousand pounds is fifty a year. With his forty, ninety. Henrietta does the sum. In Wyvern she calls the match “perfectly prudent”.

They are married in October. Oakes has stammered since he was a boy. He makes every response without a stop.`; }},
    {t:'Refuse. Forty pounds a year will not keep her in gloves.', go:() => { add({family:-6}); reg('kitty',-4,'You refused her the curate'); reg('oakes',-2,'You refused him Kitty');
      return `“Forty pounds a year, Mr Oakes. No.”

He bows. “I expected it, sir.” He has a pauper to bury at three o’clock. He goes to do it.

Kitty does not cry. The next week she orders a tin specimen box from Reading. She is out on the Down with it in all weathers. The path to the Down goes by the schoolhouse lane.`; }}
  ]});

ev({ id:'dubreuil', from:1804, to:1811, weight:2, title:'A Frenchman at the Milestone',
  text:() => { meet('dubreuil'); return `Forty French officers are living at Wyvern on parole. Each may walk one mile from the Market Cross along the turnpike. No further.

One of them is a Lieutenant Achille Dubreuil of the Imperial Navy, taken in a frigate off Ushant. He walks his mile every afternoon. He stops at the stone. He turns round.

${F('gallDead') ? 'The churchwardens have' : 'Dr Gall has'} told the bench he is a spy.

A note comes up to the Hall, in a neat upright hand.

“Monsieur, The milestone at the foot of your avenue is one mile from the Cross. I have paced it. Your door is two hundred yards beyond. May I have the honour to call?”`; },
  choices:[
    {t:'Make him free of the house.', go:() => { fl('dubreuilFriend'); add({family:4, standing:-3}); reg('dubreuil',3,'You opened your house to an enemy officer'); reg('henrietta',1); if (!F('gallDead')) reg('gall',-1); if (K() === 'free' && kittyAge() < 34) later('dubreuilAsks', 5);
      return `He comes on Tuesdays and Saturdays. He walks up from the milestone with his hat under his arm.

He shows Mrs Bunce how to make an omelette. She lets him. He plays chess with you and loses in thirty moves. You suspect he could win in twenty.

Over the winter he carves a frigate out of mutton bones. Thirty-eight guns, each one bored. He gives it to Henrietta. She puts it on the drawing-room chimney-piece, in front of the clock.`; }},
    {t:'Receive him once, correctly, and no more.', go:() => { reg('dubreuil',1);
      return `He drinks one dish of tea. He admires the Gainsborough of your uncle. At the fortieth minute by the clock he stands up and takes his leave.

You watch him down the avenue to the milestone.

You had meant to ask him what they really think of Bonaparte. You had a good many questions. You did not ask one.`; }},
    {t:'Reply that the milestone is the limit, and so is your patience.', go:() => { add({standing:1}); reg('dubreuil',-2); if (!F('gallDead')) reg('gall',1);
      return `He does not write again.

Each afternoon he walks out to the milestone. He touches it with his cane. He walks back.

Your carriage passes him on the turnpike on Thursday. He takes off his hat and bows low. He is smiling.`; }}
  ]});

ev({ id:'dubreuilAsks', follow:true, cond:() => K() === 'free' && F('dubreuilFriend'), title:'The Lieutenant Is Exchanged',
  text:() => `Lieutenant Dubreuil comes up from the milestone on a Wednesday. It is not his day. He is wearing his best coat.

“I am exchanged, monsieur. For an English lieutenant. I sail from Portsmouth within the month.”

He stands very straight.

“I have a small property near Saint-Malo. An old mother. The half-pay of a lieutenant. I ask for Miss Kitty.”

Kitty is ${kittyAge()}. For two years she has read Racine with him on Tuesdays and Saturdays. She is by the window. She is looking at you.`,
  choices:[
    {t:'Give them your blessing.', go:() => { fl('kitty','dubreuil'); add({family:-3, standing:-7}); reg('kitty',5,'You let her marry a Frenchman in the middle of the war'); reg('dubreuil',4,'You gave him your daughter'); reg('henrietta',-2);
      return `They are married by licence at Wyvern, on a weekday, with the church door shut. They cross to France in the cartel with the returning prisoners.

Nobody in Berkshire calls for a month.

Her letters come by way of Holland. They are three months old and smell of tar. There is a garden. There are bees. In the fourth letter there is a small Achille.

Henrietta keeps them in her work-box. The folds have worn through.`; }},
    {t:'Tell him to come back and ask when there is a peace.', go:() => { fl('dubreuilWaits'); add({family:1}); reg('kitty',1); reg('dubreuil',1,'You told him to ask again in peacetime');
      return `“Come back and ask me when there is a peace.”

He bows over your hand. He bows over Kitty’s.

“Then I shall pray for peace, monsieur. In the Emperor’s navy that is very nearly treason.”

He leaves the mutton-bone frigate on the hall table. The maids are not allowed to touch it. Kitty dusts it.`; }},
    {t:'Refuse. She is not marrying into the enemy.', go:() => { add({family:-5, standing:1}); reg('kitty',-3,'You refused her the Lieutenant'); reg('dubreuil',-3);
      return `“My daughter does not marry the enemy, sir.”

He bows and goes down the avenue. He does not look back.

Kitty says nothing that day. She says nothing about it the day after. In the evenings there is a voice in the room at the top of the house. It is reading French, aloud.`; }}
  ]});

ev({ id:'dubreuilReturns', from:1814, to:1815, weight:9, cond:() => F('dubreuilWaits') && K() === 'free', title:'A Caller at the Milestone',
  text:() => `A post-chaise stops at the foot of the avenue. A man gets down. He stands by the milestone with his hat in his hand. He comes no further.

You take the glass to the window. It is Dubreuil.

He is grey. There is a scar from his eyebrow to his ear. The chaise is white with dust to the roof.

Peace was proclaimed nine days ago.`,
  choices:[
    {t:'Walk down the drive yourself and bring him in.', go:() => { fl('kitty','dubreuil'); add({family:10, standing:-1}); reg('kitty',5,'You kept your word about the Lieutenant'); reg('dubreuil',5,'You walked down the drive to fetch him');
      return `You walk down the avenue. You give him your arm at the milestone and bring him up.

“Leipzig,” he says, touching the scar. “They put the sailors to the guns.”

Kitty is on the steps. She is ${kittyAge()}. She has on the old blue pelisse.

You stop to look at the gravel. It wants raking.

They are married in the autumn. The Tamworths send a silver teapot.`; }},
    {t:'Send word that Miss Kitty is not at home.', go:() => { add({family:-10}); reg('kitty',-5,'You turned the Lieutenant away after he had waited six years'); reg('dubreuil',-5);
      return `You send John down the avenue. “Miss Kitty is not at home.”

The man at the milestone puts on his hat. The chaise turns in the road.

Kitty is at the top window. She watches it as far as the bend.`; }}
  ]});

ev({ id:'gallDies', from:1806, to:1813, weight:3, cond:() => !F('gallDead'), title:'The Living of Hatherley',
  text:() => { meet('oakes'); return `Dr Gall died on Sunday, at his own table. He was seventy-eight. It was during the second remove. The goose is thought to have done it.

The church is full for the funeral.

The living is four hundred a year, and it is yours to give. By Wednesday you have three letters.

Lord Cullerne recommends his chaplain, a Mr Spragg. A clerical agent in Holborn offers fourteen hundred pounds for the presentation. “No enquiries will be made.” ${E() === 'church' ? 'Henrietta has not written. She has had the vicarage measured for carpets. Edmund is in orders. ' : ''}The third letter is two lines from Mr Oakes${K() === 'oakes' ? ', your son-in-law' : ''}. He has taken the services for years on forty pounds. He asks only whether he is to take them next Sunday.`; },
  choices:[
    {t:'Present Mr Oakes.', go:() => { fl('gallDead'); fl('oakesVicar'); add({goodwill:8, family: K() === 'oakes' ? 8 : 1}); reg('oakes',4,'You gave him the living'); if (K() === 'oakes') reg('kitty',3,'You kept your promise about the living'); reg('cullerne',-1); if (E() === 'church') reg('henrietta',-2,'You gave the living away from Edmund');
      return `Oakes is inducted on a wet Thursday. The form requires him to toll the bell himself. He tolls it.

On Friday he raises the new curate to eighty pounds.

On Saturday Dewey’s tithe pig is driven back up the lane to Dewey’s, with a note tied to its ear.`; }},
    {t:'Present Edmund.', if:() => E() === 'church', go:() => { fl('gallDead'); fl('edmundVicar'); add({family:5, goodwill:-2}); reg('henrietta',3,'You put Edmund in the vicarage'); reg('edmund',-1); reg('oakes',-3,'Passed over for the living after all his years'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Edmund reads himself in. His text is Isaiah. “Here am I; send me.” He preaches eleven minutes. He looks at you once.

Henrietta has the carpets down by Michaelmas.

Mr Oakes stays on as curate at forty pounds. He shakes Edmund’s hand at the church door. “I am very glad for you,” he says. He is.`; }},
    {t:'Present Lord Cullerne’s Mr Spragg.', go:() => { fl('gallDead'); fl('spragg'); add({standing:3, goodwill:-4}); reg('cullerne',4,'You gave his chaplain the living'); reg('oakes',-3,'Passed over for Lord Cullerne’s chaplain'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Mr Spragg arrives with eleven trunks and a pianoforte. He hunts three days a week. He has the pulpit lowered by a foot. He can now be seen from the Cullerne pew.

Oakes goes on taking the services. Forty pounds.

At the tithe audit Spragg weighs seventeen stone on the corn-factor’s scales. Dr Gall never went above eleven.`; }},
    {t:'Sell the presentation to the agent in Holborn.', note:'+£1,400', go:() => { fl('gallDead'); fl('soldLiving'); add({money:1400, standing:-5, goodwill:-5}); reg('oakes',-3,'You sold the living over his head'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-5,'You sold the living you promised her husband'); add({family:-10}); }
      return `Fourteen hundred pounds. The buyer is a wine merchant of Mark Lane. He wants it for a son who is not yet ordained. Until he is, Mr Oakes will serve the cure. Forty pounds.

The Bishop writes. The word “simony” is in the letter twice. It is signed “Your faithful brother in Christ”.

The Bishop does not dine at Hatherley on his next visitation.`; }}
  ]});

ev({ id:'vaccine', from:1800, to:1808, weight:2, title:'The Cow-Pox',
  text:() => `There is smallpox at Kintbury. Four children are dead. The rest will carry the marks.

Mr Ferris, a young surgeon from Newbury, calls at the Hall. He has Dr Jenner’s book under his arm. He will scratch every arm in Hatherley with matter from the cow-pox. It is a mild thing. A person who has had it cannot take the smallpox.

“Never, sir. I will stake my practice on it.”

There is a print pinned up at the Bell. It shows a doctor with a lancet. His patients have horns. One has an udder. ${F('gallDead') ? 'The parish clerk has been saying' : 'Dr Gall preached on Sunday'} that man is made in God’s image and a cow is not.`,
  choices:[
    {t:'Pay for the whole parish, and go first yourself, in public.', note:'£60', go:() => { fl('vaccinated'); add({money:-60, goodwill:7, standing:2, family:2}); if (!F('gallDead')) reg('gall',-2,'You were vaccinated on the green in the teeth of his sermon');
      return `You have a kitchen chair carried out to the green. You sit on it and roll up your sleeve. Ferris scratches your arm. The parish stands round in a ring.

For a fortnight people look at your forehead when you lift your hat.

Two hundred and sixty are done by Midsummer. Sixty pounds. In the autumn the smallpox comes down the valley. It is at Kintbury. It is at Inkpen. Nobody in Hatherley takes it.`; }},
    {t:'Pay for any who wish it, and say no more.', note:'£25', go:() => { add({money:-25, goodwill:3});
      return `You tell Ferris you will pay for any who come. Twenty-five pounds.

About ninety come. Most are mothers. They come to the surgery door after dark with shawls over their heads.

The smallpox reaches Hatherley in the autumn. Three die. None of the three had been to Ferris. The print comes down off the wall at the Bell.`; }},
    {t:'Leave physic to Providence.', go:() => { add({goodwill:-5, family:-2}); if (!F('gallDead')) reg('gall',1);
      return `“We shall leave it to Providence, Mr Ferris.”

The smallpox comes in October. Nine die in Hatherley. Seven are under ten years old. The blacksmith’s youngest lives. She is blind.

Ferris rides past your gate every day on his way to the cottages. Every day he takes off his hat to it.`; }}
  ]});

ev({ id:'manTraps', from:1797, to:1812, weight:2, cond:() => !F('traps'), title:'Mudge Proposes Iron',
  text:() => `Mudge the keeper has counted the pheasants in Cuckoo Copse. There are forty fewer than at Michaelmas.

He has a printed list from an ironmonger in Reading. He puts it on your desk and holds it flat with his thumb. Man-traps, at two guineas. Spring-guns, at four. A trap takes a man by the leg. A gun is set on a wire. It fires at whoever walks into the wire.

“It’s all legal, sir. There’s a board you put up to say they’re set.” He thinks. “Most of ’em can’t read it. But that ent our fault, is it?”`,
  choices:[
    {t:'Set them.', note:'£30', go:() => { fl('traps'); S.game += 2; add({money:-30, goodwill:-7, standing:1}); reg('cullerne',1); reg('pryor',-1); later('trapCatch', 2);
      return `Six traps and two guns. Thirty pounds. The ironmonger’s bill is headed “Humane Man-Traps, Without Teeth, For The Nobility and Gentry”.

Mudge sets them on Monday. The board goes up at the stile. Children are kept out of the copse.

No pheasants go that month. Nobody comes up the back drive either. The baker leaves the bread at the lodge.`; }},
    {t:'Put up the board, and set nothing.', go:() => { fl('trapBluff'); add({goodwill:-2}); S.game += 1;
      return `The board goes up at the stile. “MAN TRAPS AND SPRING GUNS ARE SET IN THESE WOODS.” There is nothing in the woods.

It answers for two seasons.

One morning Mudge fetches you down to the stile. There is a line of chalk under the paint, in careful letters. “No they ent.”`; }},
    {t:'Refuse. You will not maim a man for a bird.', go:() => { add({goodwill:2}); reg('pryor',1); S.game -= 1;
      return `“I will not take a man’s leg off for a bird, Mudge.”

“No, sir.” He folds the list and puts it inside his hat.

The pheasants go on going. On Sunday there is a roast fowl on your table. You eat it with a good appetite.`; }}
  ]});

ev({ id:'trapCatch', follow:true, cond:() => F('traps'), title:'What the Spring-Gun Caught',
  text:() => F('gallDead') ? `The spring-gun in Cuckoo Copse goes off at first light. Mudge runs to it.

It is not Jem Pryor. It is Tom Gurney, who is eleven. He had gone in to cut a hazel for a fishing rod. There are nine shot in his legs.

Mr Ferris has been. The boy will walk. He will not walk as he did.

His mother has not come to the Hall. Nobody has come to the Hall.` : `The spring-gun in Cuckoo Copse goes off at first light. Mudge runs to it.

It is not Jem Pryor. It is Dr Gall, in his nightcap. There is a basket of morels beside him. There are twelve shot in his left buttock.

He is carried home on a hurdle, face down. You call at the vicarage. He speaks into the pillow.

“I have gathered mushrooms on that ground every May for thirty years. It is glebe.”

It is not glebe. The tithe map is quite clear.`,
  choices:[
    {t:'Take up every trap and gun, today.', go:() => { fl('traps', false); S.game -= 2; add({goodwill:5}); if (!F('gallDead')) reg('gall',1); else add({money:-20});
      return F('gallDead') ? `The traps and the guns go into the pond before noon.

You pay Ferris’s bill. You send to London for a fishing rod with a brass reel and have it left at the Gurneys’ door. It stays in its wrapper for a month.

One evening the boy is on the bridge with it. He is sitting. He cannot stand long. He lifts one hand an inch off the rail as you go by.` : `The traps and the guns go into the pond before noon.

Dr Gall preaches for six Sundays standing on a cushion. His text each Sunday is forgiveness. He looks at your pew during the text.`; }},
    {t:() => F('gallDead') ? 'Leave them. The board was plain enough.' : 'Leave them set, and send the Doctor a ham.', go:() => { add({goodwill:-6, money:-3}); if (!F('gallDead')) reg('gall',-3,'You left the spring-guns set after one shot him'); else reg('pryor',-2);
      return F('gallDead') ? `“The board was plain enough.”

Tom Gurney cannot read.

The guns stay. The law is on your side. Mr Ferris sends his bill to the Gurneys.` : `You send a ham to the vicarage. The guns stay.

The ham comes back the same afternoon. There is a note under the string.

“Dr Gall will gather his mushrooms where he pleases. He has loaded his fowling piece.”

Mudge reads it over your shoulder. He takes off his hat and scratches his head.`; }},
    {t:'Prosecute Dr Gall for trespass in pursuit of fungus.', if:() => !F('gallDead'), go:() => { add({goodwill:6, standing:-3}); reg('gall',-5,'You had him fined a shilling for trespass, with shot still in him'); reg('pryor',2);
      return `${S.sur} v. Gall is heard at Wyvern. The Doctor gives his evidence standing. Two of the bench have their handkerchiefs out.

Fined one shilling.

The Bell runs dry by ten that night. Jem Pryor proposes your health. At the vicarage the blinds are down, and they are down every time you pass for a year.`; }}
  ]});

ev({ id:'enclosure', from:1797, to:1809, weight:3, cond:() => !F('enclosed') && !S.projectsDone.enclosure && !F('encloseRefused'), title:'The Common Question',
  text:() => `Lord Cullerne’s carriage is at the door. ${F('gallDead') ? 'His man of business' : 'Dr Gall'} gets out of it after him.

They have a plan of Hatherley Common unrolled on your library table before the wine is poured. Four hundred acres. Gorse, geese, a pond, and forty cottagers’ cows.

“Hedge it and let it,” says his lordship, “and you add a third to your rental. ${F('gallDead') ? 'The tithe is' : 'The Doctor’s tithe is'} commuted for land. A private Act. A surveyor. Three commissioners. Twelve hundred pounds, and it is done in a year.”

A cow walks past the library window. It is Jem Pryor’s. She stops and looks in.`,
  choices:[
    {t:'Promote the bill.', note:'£1,200 over three seasons', go:() => { startProject('enclosure'); reg('cullerne',2,'You joined him in enclosing the common'); if (!F('gallDead')) reg('gall',2); reg('pryor',-2,'You moved to enclose the common');
      return `The notice goes up on the church door. “Hatherley Inclosure.” It hangs there three Sundays running, as the Act requires. Most of the men it concerns cannot read it. Their children read it to them.

A surveyor comes with a chain and a boy. He walks the common for a week, driving in pegs. The geese walk behind him in a body, hissing.`; }},
    {t:'Promote it, but set aside sixty acres in allotments for the cottagers.', note:'£1,400 over three seasons', go:() => { fl('allotments'); startProject('enclosure'); reg('cullerne',1); meet('thorne'); reg('thorne',1); reg('pryor',-1,'You enclosed the common, but left him an acre');
      return `“Sixty acres to the cottagers. An acre and a cow-gate to every house that used the common.”

“A premium upon idleness,” says Lord Cullerne. He says it twice. You do not move.

The surveyor comes with his chain. He pegs out the sixty acres first, at your order. The geese follow him. No other parish in the county has left its cottagers a rood.`; }},
    {t:'Refuse. The common stays as it is.', go:() => { fl('encloseRefused'); add({goodwill:6, standing:-2}); reg('cullerne',-3,'You would not enclose with him'); if (!F('gallDead')) reg('gall',-2); reg('pryor',2,'You kept the common open');
      return `“The common stays as it is.”

“You are standing in the way of improvement, sir.”

“I am standing in the way of Pryor’s cow, my lord. I mean to go on standing there.”

They roll up the plan. The carriage goes down the drive. The cow lifts her head and watches it out of the gate. She is still chewing.`; }}
  ]});

ev({ id:'commonRiot', follow:true, cond:() => F('enclosed'), title:'Posts in the Night',
  text:() => `The fencers set their posts along the new allotments on Monday.

On Tuesday morning every post is out of the ground. They have been laid on the turf in a pattern. An upright. A beam. A brace. From the Down it is plain enough. It is a gallows.

Today there are sixty people sitting along the line of the new hedge. Men and women. Nobody is shouting. They have brought their dinners in cloths.`,
  choices:[
    {t:'Send for the yeomanry.', go:() => { add({goodwill:-9, standing:2}); reg('pryor',-2,'You brought sabres on to the common'); reg('cullerne',1);
      return `Lord Cullerne’s troop comes up at a trot, forty sabres. They ride the line of the hedge.

Nobody is cut. An old woman is knocked into a furze bush. A horse treads on a boy and breaks his arm.

The posts go in that week. The quickset is planted behind them. On that side of the parish it does not take. Somebody has been at the roots with a spade.`; }},
    {t:'Go down and sit on the turf with them.', go:() => { add({goodwill:5, standing:-3}); reg('pryor',1,'You sat down on the common and heard them out');
      return `You walk down and sit on the turf. Somebody passes you bread and an onion.

They talk for three hours. Where each family cut its turf. Whose grandmother’s geese had the pond. Which thorn tree the children were sent to and told to come back from.

“I cannot undo the Act,” you say. “The pond stays open. So does the furze-cutting. You have my word.”

They get up slowly. They let the fencers through.`; }},
    {t:'Wait them out. They cannot sit there for ever.', go:() => { add({goodwill:-3});
      return `They sit for nine days, by turns.

On the tenth day it rains. The hay wants cutting. The men go to the hay, because there is fourpence a day in it. The women go home.

The fencers come back on the eleventh. Nobody has been hurt. Nobody has been spoken to.`; }}
  ]});

/* Henrietta's health. Three complaints, taken in turn; it comes round once in six years at most. */
const BATH = [
  {title:'Henrietta’s Rheumatism', home:'A mustard plaster, at home.',
   x:`The Tamworths went to Bath on Monday. On Tuesday Henrietta has rheumatism in both shoulders.

Mr Ferris the surgeon is sent for. He looks at her tongue. He looks at you.

“The Bath waters, sir. Six weeks. Taken warm, in company.”

Lodgings in Pulteney Street are four guineas a week this season. Ferris has tasted the water. “A blacksmith has cooled his irons in it. That is the virtue.”`,
   a:`Three glasses a day in the Pump Room, with a band playing. A chair to the Assembly every evening. Three hundred and fifty pounds.

The rheumatism is gone by the second Tuesday.

You lose eleven pounds at whist to a clergyman. You meet the Tamworths nine times in six weeks. Each time, everybody is surprised.`,
   b:`Cheltenham. A hundred and fifty pounds. The King took these waters in ’88. He went out of his mind in the autumn.

The water is salt. It acts within the hour. You do not stray far from the lodgings.

Henrietta says she is much better. She does not ask to go again.`,
   c:`A mustard plaster, morning and night. She bears it for six weeks. She can be heard bearing it from the library.

The Tamworths write from Bath on Tuesdays and Fridays. Henrietta reads each letter aloud at breakfast, from “My dearest Henrietta” to the postscript.`,
   why:'You prescribed mustard when she wanted Bath'},
  {title:'Henrietta’s Nerves', home:'Valerian drops, at home.',
   x:`Mrs Loveday is gone to Bath for her nerves. By Thursday Henrietta cannot bear the stable clock.

The clock is stopped. Mr Ferris comes. He holds her wrist and looks at his watch for a full minute.

“I find the pulse hurried, ma’am. I should try Bath.”

He says it again to you in the hall. He has a brother there who lets lodgings in Gay Street.`,
   a:`Six weeks in Gay Street, at the brother’s. Three hundred and fifty pounds.

Henrietta is carried to the Pump Room at eight in a chair. She is at the Upper Rooms by seven in the evening. There are four hundred people there and two bands.

The stable clock is set going the day you come home. She does not remark it.`,
   b:`A fortnight at Cheltenham. A hundred and fifty pounds.

There is a walk under elms to the well. The whole town walks it at seven in the morning with a glass. Nobody speaks.

Henrietta’s nerves are better for it. Yours are not. The lady in the next lodging keeps a harp.`,
   c:`Ferris sends valerian. Twenty drops in water at bedtime.

It smells of tom-cat. The kitchen cat comes up the back stairs and sits at her door all night.

The clock stays stopped six weeks. Mudge rings the yard bell for the men’s dinner. He rings it under her window.`,
   why:'You gave her valerian when she wanted Bath'},
  {title:'Henrietta’s Cough', home:'Horehound and honey, at home.',
   x:`Henrietta has coughed since Michaelmas. On Sunday she coughed through the Litany and the first lesson.

Mr Ferris lays a napkin on her back and puts his ear to it.

“I should not winter her here, sir. The hot well, or the sea.”

Mrs Tamworth writes from the Circus. She has heard of the cough. She has mentioned it in the Pump Room.`,
   a:`Bath, for six weeks. Three hundred and fifty pounds.

Henrietta coughs in the Pump Room. Eleven ladies recommend eleven remedies. She tries nine.

The cough goes in the fourth week. Nobody can say which of the nine did it. She brings all nine home in the carriage.`,
   b:`Cheltenham in November. A hundred and fifty pounds.

Half the lodgings are shut. The band is a fiddle and a boy with a triangle. Henrietta takes her glass at the well under an umbrella.

By the tenth day she has stopped coughing. She says the dullness drove it out.`,
   c:`Mrs Bunce boils horehound with honey. A spoonful every two hours.

Henrietta coughs until Candlemas. She coughs at you across the breakfast table. Then one morning she does not.

Mrs Bunce has the credit. She makes a quart of it for you against the spring.`,
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
  text:() => `Henrietta has La Belle Assemblée open on her knee. There is an account in it of the Prince of Wales’s Pavilion at Brighton. Bamboo. Lanterns. Dragons. Wallpaper with mandarins fishing from bridges.

She looks round the yellow drawing-room. She looks at the yellow sofa.

“I cannot sit in this room another week.”

A man in Bond Street will do the whole for four hundred pounds. He has sent drawings. There is a pagoda for the chimney-piece.`,
  choices:[
    {t:'Let her have her dragons.', note:'£400', go:() => { fl('chineseRoom'); add({money:-400, family:7, standing:3}); reg('henrietta',2,'You gave her the Chinese drawing room');
      return `Three months. Nine Italian workmen. Four hundred pounds.

You count when they have gone. Eleven dragons. Forty-two mandarins. A gilt serpent holding back each curtain.

The county comes to look and stays to tea. Lady Cullerne stands in the middle of the carpet. “Very like the Prince,” she says. Henrietta has been trying ever since to decide what she meant.`; }},
    {t:'Offer new paper only.', note:'£80', go:() => { add({money:-80, family:2});
      return `New paper. Eighty pounds. The mandarins go up all round the room, fishing. The yellow sofas stay underneath them.

Henrietta stands in the doorway.

“It will do,” she says. She said the same on Tuesday, of the mutton, when it came up cold.`; }},
    {t:'Decline. Yellow was good enough for your uncle.', go:() => { add({family:-4}); reg('henrietta',-1);
      return `“Yellow was good enough for my uncle.”

She closes the magazine.

The Bond Street drawings stay open on her writing table for a year. She dusts round them. Each time she passes the drawing-room door she sighs. You can hear it from the library with the door shut.`; }}
  ]});

ev({ id:'ballot', from:1796, to:1811, weight:2, repeatGap:20, title:'The Militia Ballot',
  text:() => `The Militia ballot is drawn in the vestry. Nine names for the county regiment. Five years’ service.

The seventh name out of the hat is Will Tanner. He is your groom. He has a wife and two children. Your bay mare will not let another man into her box.

A balloted man may find a substitute to go for him. The price in Wyvern this week is thirty pounds. It was twenty-five at Christmas.

Will is in the yard holding his hat. He has not asked you for anything.`,
  choices:[
    {t:'Buy him a substitute.', note:'£30', go:() => { add({money:-30, goodwill:3});
      return `The substitute is a weaver from Newbury. He has served for three other men already. He has deserted twice. He counts your thirty pounds and signs with a mark.

Will Tanner says, “Thank you, sir.” Nothing else.

All that winter your hunters come out of the stable shining. You could shave in the bay mare’s quarters.`; }},
    {t:'Let the ballot stand. Every man must take his chance.', go:() => { add({goodwill:-3, family:-1});
      return `“Every man must take his chance, Will.”

He marches for Portsmouth on Monday with a bundle. On Tuesday his wife goes to the overseer.

The stable is given to a lad from Kintbury. He is afraid of horses. By Christmas the bay mare has kicked a hole in the coach-house door. The grey has learnt to slip her halter.`; }},
    {t:'Subscribe to the parish club that insures every man against the ballot.', note:'£12', go:() => { add({money:-12, goodwill:5});
      return `There is a club at the Bell. Every labourer pays in sixpence. Whoever is drawn has his substitute bought from the box. The box is nine pounds short this year.

You put in twelve.

Will is bought out. Next year it is the wheelwright’s son. The club dines at the Bell at Michaelmas, and they send up to ask you to take the chair.`; }}
  ]});

ev({ id:'windows', from:1797, to:1809, weight:1, title:'Fifty-Four Windows',
  text:() => `The assessor’s notice has come. The window tax is raised again.

Hatherley has fifty-four windows. Your great-grandfather built it so. Every one above six is charged.

${F('crabbeGone') ? 'Lark' : 'Crabbe'} has walked round the house with a pencil. He has a list of eleven. Nine are on the north front. Two light the back stairs.

“Nobody looks out of them, sir. Only the housemaids.”`,
  choices:[
    {t:'Brick up the eleven.', go:() => { fl('bricked'); add({family:-3, standing:-1});
      return `The mason is two days about it. Eleven windows. The saving is nine pounds a year.

The back stairs are dark at noon. So is the still room. So is the maids’ attic.

Henrietta meets Sarah on the stairs carrying a lit candle at midday. She asks the price of candles. Nobody has reckoned it.`; }},
    {t:'Brick them up and paint sham windows on the plaster.', note:'£20', go:() => { fl('bricked'); add({money:-20, family:-1});
      return `The mason bricks them up. Then an Italian comes from Reading with his pots. Twenty pounds.

He paints eleven windows on the plaster. Glazing bars. Clouds in the glass. In the last one, for a guinea more, a housemaid looking out.

A dragoon officer rides by the north front a week later. He lifts his hat to her. He rides on, turns in the saddle, and lifts it again.`; }},
    {t:'Pay. An Englishman is entitled to his daylight.', go:() => { add({standing:1});
      return `“An Englishman is entitled to his daylight. I shall pay for all fifty-four.”

The assessor dips his pen. He writes the receipt. He does not look up.

“They all say that, sir,” he says, and blots it.`; }}
  ]});

ev({ id:'canal', from:1796, to:1805, weight:2, title:'A Staircase for Barges',
  text:() => `Hartopp has a prospectus. He spreads it on your table.

“The Kennet and Avon Canal. Newbury to Bath, fifty-seven miles. Thames to Severn. Mr Rennie is the engineer. There are to be twenty-nine locks up the hill at Devizes.” He taps the engraving. “A staircase for barges, sir.”

Shares are a hundred and twenty pounds. Hartopp has ten.

“Somerset coal up. Your wheat down to London for a third of the cart hire. Three years, and it is open. Three at the outside.”`,
  choices:[
    {t:'Take five shares.', note:'£600', go:() => { S.canal = 5; add({money:-600}); reg('hartopp',1);
      return `Five shares. Six hundred pounds. The certificate has a barge engraved on it.

Letters come from the Company at Marlborough. Each asks for a further call upon the shares. Each encloses a view of an aqueduct.

You ask Hartopp when it will open. “All great works meet with clay,” he says.`; }},
    {t:'Take one, to be civil.', note:'£120', go:() => { S.canal = 1; add({money:-120});
      return `One share. A hundred and twenty pounds.

It entitles you to attend the general meeting at Marlborough. You go once. The chairman reports that the works proceed with every prospect. There is a cold collation.`; }},
    {t:'Keep your money on dry land.', go:() => { reg('hartopp',-1);
      return `“I shall keep my money on dry land.”

“You will live to regret it,” says Hartopp. He rolls up the prospectus.

He brings it out again at the Tamworths’, the same evening, before the fish.`; }}
  ]});

ev({ id:'merino', from:1804, to:1809, weight:2, title:'The King’s Sheep',
  text:() => `The King keeps Spanish sheep at Kew. They are merinos, got out of Spain by way of Portugal. This summer part of the royal flock is to be sold by auction, in a field, under an elm.

Hartopp has been. He has a lock of the wool in his pocket-book. He lays it on your sleeve.

“Feel that, sir. Six shillings the pound. A ram made forty-two guineas on Thursday.”

He is sweating. He puts the wool back between the pages and shuts the book on it.`,
  choices:[
    {t:'Buy a small flock.', note:'£420', go:() => { fl('merino'); add({money:-420, standing:2}); reg('hartopp',2,'You went into merinos with him');
      return `Twenty ewes and a ram. Four hundred and twenty pounds. They are small and wrinkled. They stand in the rain with their backs to Berkshire.

The shepherd walks round them twice. “They’ll die of something, sir.”

They do not die. The first clip goes to Bradford-on-Avon. Six shillings the pound. English wool made two.`; }},
    {t:'Buy one ram, to cross on your Berkshire ewes.', note:'£50', go:() => { fl('merinoRam'); add({money:-50}); reg('hartopp',1);
      return `One ram. Fifty pounds. He is the size of a large dog. His horns curl twice.

The lambs come in the spring. The wool is fine. The butcher looks at the carcase and shakes his head.

“Ah,” says Hartopp. “But you have not persevered.”`; }},
    {t:'Leave Spanish sheep to the Spaniards.', go:() => { reg('hartopp',-1);
      return `“I shall leave Spanish sheep to the Spaniards.”

“Fortunes are being made, sir.”

He tells you so again at the Bench. He tells you at the Tamworths’. He sends you the sale prices each quarter, cut from the Farmer’s Journal.`; }}
  ]});

ev({ id:'allotments', from:1796, to:1808, weight:2, cond:() => !F('enclosed') && !F('allotments') && !F('nephewFarm'), title:'A Rood for Every Cottage',
  text:() => { meet('thorne'); return `Mrs Thorne drives over from Long Barrow in her gig. She has a bundle of printed reports on the seat beside her. The Society for Bettering the Condition of the Poor.

She does not sit down.

“A quarter of an acre, sir. A labourer with a quarter of an acre grows potatoes for his family the year round. He stays off the parish. He does not need to steal yours.”

She wants forty acres of the Hall Close let in roods, at a fair rent, to any cottager who asks.

Hartopp is with you. “It will give them ideas,” he says.`; },
  choices:[
    {t:'Let the forty acres in roods.', go:() => { fl('gardens'); S.poorMult *= 0.85; add({goodwill:8}); reg('thorne',2,'You let the Hall Close in gardens on her advice'); reg('hartopp',-1);
      return `A hundred and sixty roods, pegged out with hazel. Every one is taken by Lady Day.

By the second summer the Hall Close is all potatoes, beans and cabbages. In the corner of nearly every plot there is a row of sweet williams.

The overseer brings his book at Michaelmas. The poor rate is down by a sixth. “Coincidence,” says Hartopp.`; }},
    {t:'Try it with ten acres first.', go:() => { S.poorMult *= 0.95; add({goodwill:3}); reg('thorne',1);
      return `Ten acres. Forty gardens. A hundred men want one. They draw lots in the vestry.

Forty go home and fetch their spades. Sixty go home.

“That is how a half-measure works, sir,” says Mrs Thorne. She gathers up her reports and drives off.`; }},
    {t:'Decline. A labourer with land is a labourer with opinions.', go:() => { add({goodwill:-2}); reg('thorne',-1); reg('hartopp',1);
      return `“A labourer with land is a labourer with opinions, Mrs Thorne.”

She puts the reports back in her reticule.

“Then they will have their opinions hungry, sir. I never found that improved an opinion.”

Hartopp helps her into the gig. She does not thank him.`; }}
  ]});

ev({ id:'battue', from:1798, to:1813, weight:2, title:'Lord Cullerne’s Battue',
  text:() => `A card from Cullerne Castle. His lordship hopes you will shoot on the ninth.

At the Castle the guns stand in a row along a ride. Forty beaters drive the wood towards them. The guns fire until the wood is empty. A servant stands behind each gentleman to load.

Last year the bag was eleven hundred head. It was also one beater, a man named Hobbs, in the last drive.

Lord Cullerne paid for the funeral. He is said to have been very decent about it.`,
  choices:[
    {t:'Go, and shoot your best.', note:'£20 in vails', go:() => { add({money:-20, standing:4}); reg('cullerne',2,'You shot at Cullerne and tipped his keepers');
      return `Forty-one pheasants. Nine hares. One woodcock. Twenty pounds to the keepers. You are third in the game book. There is a duke above you and a bishop below.

Thirty sit down to dinner. The lady on your left has driven through Hatherley.

“The poor have never been so well off,” she tells you. “One sees it in their faces.”`; }},
    {t:'Go, and fire wide all day.', note:'£20 in vails', go:() => { add({money:-20, standing:1}); reg('cullerne',1);
      return `You fire sixty shots. You hit nothing. Twenty pounds to the keepers.

“Bad luck,” says Lord Cullerne.

At the last drive the head keeper stops by your stand. He looks at your gun. He looks up at the piece of sky you have been firing into.

“Very humane, sir,” he says. His face does not move.`; }},
    {t:'Send regrets.', go:() => { reg('cullerne',-2,'You would not come to his shoot');
      return `You send your regrets.

Your place in the line goes to the brewer from Reading. He kills fourteen pheasants and a spaniel.`; }}
  ]});

ev({ id:'hunt', from:1797, to:1814, weight:2, cond:() => !F('nephewFarm') && S.chars.thorne.met, title:'Forty Gentlemen in Pink',
  text:() => `The Craven hounds ran a fox across Long Barrow on Tuesday. Forty gentlemen in scarlet went after them. They went through Mrs Thorne’s winter wheat, two of her gates and a clamp of mangolds.

On Wednesday a paper comes up to the Hall, in her round hand.

“To the Master of the Craven Hunt. Winter wheat, 4 acres trodden, £11. Two gates, £3 10s. Mangolds, £2 14s. Total £17 4s. A. Thorne.”

The Master is Lord Cullerne’s brother-in-law. No farmer has ever sent the Craven a bill.`,
  choices:[
    {t:'Carry her bill to the Master yourself.', go:() => { add({standing:-3, goodwill:3}); reg('thorne',2,'You presented her bill to the Craven Hunt'); reg('cullerne',-1);
      return `You ride over and put it into the Master’s hand. He holds it by one corner.

It is paid in a month, out of the poultry fund. A note comes with the money. The lady, the Master regrets, “does not enter into the spirit of the country”.

Mrs Thorne has the note framed. It hangs in her dairy, over the butter.`; }},
    {t:'Pay her yourself and say it came from the hunt.', note:'£17', go:() => { add({money:-17}); reg('thorne',1);
      return `You take her seventeen pounds four shillings. “From the Hunt, Mrs Thorne.”

She counts it. She looks at the notes. “The Hunt banks at Tidmarsh’s, does it? The same as you?”

She puts it in her apron. The wheat is sown again where the horses went. It comes up late and thin. All summer you can see the line of the run from the Down.`; }},
    {t:'Tell her that a hunting country must expect to be hunted over.', go:() => { add({standing:2, goodwill:-3}); reg('thorne',-2,'You sided with the hunt over her wheat');
      return `“A hunting country must expect to be hunted over, Mrs Thorne.”

She hears you with her arms folded.

Next season the Craven run a fox to ground on Long Barrow. They dig. The fox has been dead a day. There is shot in it.

Forty gentlemen sit their horses round the hole. Nobody says a name.`; }}
  ]});

ev({ id:'overseer', from:1801, to:1814, weight:2, repeatGap:24, title:'The Overseer’s Accounts',
  text:() => `Mr Nokes the overseer brings the parish books up to the Hall. He lays them open at two pages.

Poor rate, 1793: two shillings in the pound. Poor rate, this year: six.

${F('speen') ? 'The bread scale is pinned inside the cover. Every man with three children is on it.\n\n' : ''}“The farmers say they won’t pay seven, sir.”

He has two plans.

The first is roundsmen. The men without work go round the farms in turn. The farmer finds sixpence a day and the parish makes it up.

The second is a House of Industry. No relief is given outside it. Husbands sleep on one side and wives on the other.

“It brings the applications down wonderful, sir.”`,
  choices:[
    {t:'Build the House of Industry.', note:'£400', go:() => { fl('workhouse'); S.poorMult *= 0.6; add({money:-400, goodwill:-10, standing:1}); reg('pryor',-1);
      return `It is built of brick at the end of the Kintbury lane. The windows are set seven feet from the floor.

Last quarter Nokes relieved sixty-one. This quarter he relieves twenty-three. Eleven of them are in the House.

“And the rest, Mr Nokes?”

“Haven’t applied, sir.”

He enters the difference under Savings.`; }},
    {t:'Try the roundsmen.', go:() => { fl('roundsmen'); S.poorMult *= 0.85; add({goodwill:-5});
      return `At six each morning the men without work stand by the pound. The farmers walk down the row. Hartopp feels a man’s arm before he takes him.

A roundsman has the same money if he digs one rod or five. He digs one. The farmer has him for sixpence. He sets him to scare rooks.

The rate comes down fivepence in the pound.`; }},
    {t:'Leave the rates alone, and find winter work on the estate.', note:'£120', go:() => { add({money:-120, goodwill:6});
      return `You set twenty men to scour the ditches and mend the park pale. When that is done you have them dig a ha-ha. The lawn has never wanted one.

Wages, £120. Nokes reckons the saving to the rates at £80. He writes the two figures side by side and turns the book towards you.

The ha-ha is finished. A cow falls into it the first week.`; }}
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
  {id:'edmund-chelmsford', kind:'news', w:() => at('army') && yr(1796, 1800), x:() => `“Chelmsford Barracks. My dear Father, It has rained here nineteen days. We have been reviewed four times since we came. Each General told us we were a fine body of men and rode away to his dinner. I can shave in cold water now. Tamworth of ours keeps a jackdaw. It says Damn the French very distinctly. It says one thing more. Pray do not let my mother ask what.”`},
  {id:'edmund-colour', kind:'news', w:() => at('army') && yr(1796, 1799), x:() => `“Chelmsford. My dear Father, I carried the King’s colour on Thursday for the first time. It weighs more than I had been told and there was a wind. An Ensign has four shillings and eightpence a day. The mess takes three shillings. My servant takes sixpence. The washerwoman takes what she can find. I have dined twice this week with the Major to save candles.”`},
  {id:'edmund-ferrol', kind:'news', w:() => at('army') && yr(1800, 1801), x:() => `“At sea, off Ferrol. My dear Father, We were landed on the 25th in boats. We marched up a hill. The Generals looked at the town through their glasses for a day. Then we marched down the hill and were put on board again. Nobody has told us why. I lost a shoe in the surf going in and found another coming out. It is not a pair.”`},
  {id:'edmund-aboukir', kind:'news', w:() => at('army') && yr(1801, 1802), x:() => `“Camp before Alexandria. My dear Father, We came ashore at Aboukir in the flat boats. The French had guns on the sandhills and gave us grape all the way in. The man on the next thwart was killed. We beat them again here on the 21st. Sir Ralph had a ball in the thigh and is dead of it. I have seen the Pyramids from nine miles off. Then I took the ophthalmia with half the regiment and saw nothing at all for three weeks. I am mended. I can tell a camel from a field officer at forty yards.”`},
  {id:'edmund-reduced', kind:'news', w:() => at('army') && yr(1802, 1803), x:() => `“Chatham. My dear Father, It is Peace and the Army is to be reduced. Nine of our subalterns go upon half-pay at Michaelmas. I am eleventh on the list. The talk in the mess is all of curacies and coal merchants. Tamworth has sold his jackdaw to a Major of Marines. If I am the tenth, is there work for me at Hatherley? I can keep a company’s books.”`},
  {id:'edmund-beacon', kind:'news', w:() => at('army') && yr(1803, 1805), x:() => `“Shorncliffe. My dear Father, We sleep in our boots. On Tuesday night the beacon on the hill was seen alight and the whole brigade stood to arms. We were three hours on the beach in the dark with sixty rounds a man. At four a dragoon rode in. It was a lime kiln at Folkestone. Sir John said we had turned out very well and might do it again on Thursday.”`},
  {id:'edmund-shorncliffe', kind:'news', w:() => at('army') && yr(1803, 1807), x:() => `“Shorncliffe Camp. My dear Father, Sir John Moore has us out at five. We are to fight in pairs, one man loading while the other fires. The men are to be told the reason of an order. Nobody is to be flogged without cause. Major Pott says the service is ruined. I was never so tired in my life and I would not be anywhere else. On a clear day we see the French camp at Boulogne from the cliff. On Monday they had their washing out.”`},
  {id:'edmund-zealand', kind:'news', w:() => at('army') && yr(1807, 1808), x:() => `“Before Copenhagen. My dear Father, We have burnt a good part of this town and taken the Danish fleet out of the harbour. The Danes were not at war with us in July. Our picquet is in a gentleman’s garden among his currant bushes. His wife sells us cream at the gate every morning. She will not look at us while she does it. I am very well fed.”`},
  {id:'edmund-vimeiro', kind:'news', w:() => at('army') && yr(1808, 1808), x:() => `“Vimeiro, Portugal. My dear Father, I have now seen the French come on. They come in a column forty men across with the drums beating. We stood on the hill in a line two deep and fired into the head of it. In a quarter of an hour they were going down the hill again. Sir Arthur called for the dragoons. Then Sir Harry Burrard came ashore, being the senior, and said we had done enough for one day.”`},
  {id:'edmund-corunna', kind:'news', w:() => at('army') && yr(1809, 1809), x:() => `“Plymouth. My dear Father, I am alive and have both my feet. We marched to Corunna in the snow, two hundred and fifty miles, with Marshal Soult a day behind. At Bembibre men sold their shoes for rum and lay down in the road. We left them. Sir John was struck by a round shot on the 16th. They buried him on the rampart in his cloak before it was light. I have no stockings. I have eaten part of a mule. My mother need not hear of the mule.”`},
  {id:'edmund-busaco', kind:'news', w:() => at('army') && yr(1810, 1810), x:() => `“Busaco. My dear Father, We lay down behind the crest in the fog and heard them climbing. General Craufurd stood alone on a rock in front. When their drums were forty yards off he took off his hat and called us up. Eighteen hundred men stood up out of the heather at once. I saw the faces of their front rank. We did not fire above three rounds. I have a French serjeant’s pipe.”`},
  {id:'edmund-hounds', kind:'news', w:() => at('army') && yr(1810, 1811), x:() => `“Behind the Lines, near Arruda. My dear Father, Lord Wellington keeps a pack of hounds and hunts three days a week. On Saturday the fox ran straight for the French outposts. Their picquet turned out and cheered him through. Then they cheered us. The Field Marshal was not pleased with the huntsman. Pray ask Mudge what is given for mange. Two couple have it.”`},
  {id:'edmund-rodrigo', kind:'news', w:() => at('army') && yr(1812, 1812), x:() => `“Ciudad Rodrigo. My dear Father, We went up the lesser breach at seven on the night of the 19th. It was over in half an hour. General Craufurd was hit at the foot of it and died on the 24th. The Division carried him to the breach and buried him in it. Marching back we came to a pool across the road. Nobody went round. He never let us go round.”`},
  {id:'edmund-badajoz', kind:'news', w:() => at('army') && yr(1811, 1812), x:() => `“Camp before Badajoz. My dear Father, We are in the trenches and the trenches are full of water. Lord Wellington rode by on Tuesday in a grey frock and a plain hat. He looked at our parallel for one minute and said it would do. The men speak of it still. My servant Pedro has stolen a pig from the Spaniards. I reprimanded him before the company. We dine on it Thursday.”`},
  {id:'edmund-vitoria', kind:'news', w:() => at('army') && yr(1813, 1813), x:() => `“Vitoria. My dear Father, We have taken King Joseph’s whole baggage on the road east of the town. Two thousand carriages. I saw a private of ours in a lady’s ball dress, carrying a ham. I saw another boiling his kettle on a fire of muskets. Dollars are sold tonight at eight for a guinea, being too heavy to carry. I have a silver dish and a French dictionary. Pedro has a monkey.”`},
  {id:'edmund-pyrenees', kind:'news', w:() => at('army') && yr(1813, 1814), x:() => `“St Jean de Luz. My dear Father, We are in France. The country people bring us eggs and fowls and take dollars for them. His Lordship hanged two men last week for plundering a farm. A woman here told my serjeant she would sooner quarter us than her own army. I am as brown as a saddle. On Sunday I slept in a bed and did not like it. Tell my mother I wear the flannel.”`},
  {id:'edmund-toulouse', kind:'news', w:() => at('army') && yr(1814, 1814), x:() => `“Toulouse. My dear Father, It is Peace. We fought here on Easter Sunday and lost four thousand men. On the Tuesday a Colonel rode in from Paris. Bonaparte had abdicated four days before the battle. Nobody had told Marshal Soult. Nobody had told us. The theatre is open and the people throw white cockades into the boxes. I sat through an opera. I have not sat in a chair since Lisbon.”`},
  {id:'edmund-cantonments', kind:'news', w:() => at('army'), x:() => `“My dear Father, There is nothing to tell. We drill, we are inspected and we are moved nine miles to drill again. My company is sixty-one men, of whom eleven can read. I write their letters on Sundays. Most begin ‘Dear Mother, this comes hoping’. One began ‘Dear Mary’ and wanted a deal of altering when he remembered his wife’s name was Ann.”`},

  /* ---------- the Navy ---------- */
  {id:'edmund-ushant', kind:'news', w:() => at('navy') && yr(1796, 1799), x:() => `“Off Ushant. My dear Father, We have been eleven weeks on this station. Each morning we stand in and count the French in Brest Water. They count us. Then we stand out again. The purser’s goat has eaten the Captain’s signal book, private signals and all. The Captain wished her shot. The surgeon reminded him that she gives milk. I am rated master’s mate. I took the noon sight yesterday and put the ship within four miles of where she was.”`},
  {id:'edmund-berth', kind:'news', w:() => at('navy') && yr(1796, 1800), x:() => `“At sea. My dear Father, There are eleven of us in the midshipmen’s berth and one candle. The biscuit is alive. We tap it on the table before we bite and the weevils walk out. The rats are fed on it in a cask by a boy named Lott. He sells them at threepence, skinned. I have not bought one. I have tasted one. Do not tell my mother.”`},
  {id:'edmund-copenhagen', kind:'news', w:() => at('navy') && yr(1801, 1802), x:() => `“Yarmouth Roads. My dear Father, We were at Copenhagen on the 2nd under Lord Nelson. Sir Hyde made the signal to leave off. They say his Lordship put the glass to his blind eye and declared he could not see it. I had three guns on the main deck. I heard nothing for two days after and there is a singing in my head still. I have passed for Lieutenant. Captain Holloway said, ‘I suppose you will do.’ The gunroom tells me he never said so much to any man before.”`},
  {id:'edmund-paidoff', kind:'news', w:() => at('navy') && yr(1802, 1803), x:() => `“Portsmouth. My dear Father, The ship is paid off. There are four hundred Lieutenants in this town on half-pay and one coffee-room. I share a lodging over a sail-maker’s with two of them. We have one good coat among the three and take it in turn to call upon the Port Admiral. Tuesday is my day. He has not yet been at home on a Tuesday.”`},
  {id:'edmund-toulon', kind:'news', w:() => at('navy') && yr(1803, 1805), x:() => `“Off Toulon. My dear Father, We are two years on this station this month. I have not been ashore in fourteen. The beef cask we opened on Monday was branded 1789. We have lemons from Sardinia. I dined in the Victory last week. I could think of nothing to say and spoke of your turnips. On Thursday Lord Nelson hailed our boat. He asked how the turnips did.”`},
  {id:'edmund-tetuan', kind:'news', w:() => at('navy') && yr(1805, 1806), x:() => `“Gibraltar. My dear Father, We were not in the battle. We were sent to Tetuan with Admiral Louis for water and bullocks on the 3rd of October. We came back with the bullocks on the 30th. The Victory was towed in here under jury masts with the flag at half mast. Our people stood along the side and said nothing. I am now the only Lieutenant of my standing who has missed the Nile and Trafalgar both.”`},
  {id:'edmund-skaw', kind:'news', w:() => at('navy') && yr(1806, 1810), x:() => `“Off the Skaw. My dear Father, There are no French at sea. We bring two hundred merchantmen down from the Baltic at four knots and fire a gun at any that straggle. The event of the quarter was the wardroom cheese. It went overboard in a gale on the 9th. Captain Holloway has the gout and keeps his cabin. I am First Lieutenant and I work the ship. I find that I can.”`},
  {id:'edmund-prize', kind:'news', w:() => at('navy') && yr(1806, 1810), x:() => `“The Nore. My dear Father, We have taken a Danish brig off Anholt. She was laden with tar, deals and nine hundred cheeses. The Prize Court gives her to us. My share is sixty-one pounds four shillings, less the agent. The agent’s share is not stated. We kept forty of the cheeses for the gunroom. They are a hard red cheese. The carpenter says he could plank a boat with them.”`},
  {id:'edmund-flushing', kind:'news', w:() => at('navy') && yr(1809, 1810), x:() => `“Off Flushing. My dear Father, We carried six hundred soldiers to the island of Walcheren in August. They went ashore singing. We are now carrying them home. They lie on the gun deck in rows and shake. It is a fever out of the ditches. We have buried forty-one over the side between this and the Downs. Not a man of ours has it. The surgeon puts it down to rum.”`},
  {id:'edmund-sandyhook', kind:'news', w:() => at('navy') && yr(1811, 1812), x:() => `“Halifax. My dear Father, We are sent to the American station. Their frigates carry twenty-four pounders and are built like seventy-fours. We met one off Sandy Hook. She looked at us and we looked at her. Our orders are to give no offence. Captain Holloway has gone home with his gout. I am made Commander into the Sparrow sloop, 18 guns. She makes fourteen inches of water in a watch. I would not change her for a three-decker.”`},
  {id:'edmund-java', kind:'news', w:() => at('navy') && yr(1813, 1814), x:() => `“Halifax. My dear Father, The American frigates carry twenty-four pounders and sail two feet to our one. They have taken the Guerriere and the Java. The London papers reach us six weeks old and very angry. We have had nobody to fight these seven years and our gunnery shows it. The Sparrow makes fourteen inches of water in a watch. I exercise the great guns every day but Sunday.”`},
  {id:'edmund-shannon', kind:'news', w:() => at('navy') && yr(1813, 1814), x:() => `“Halifax. My dear Father, The Shannon has taken the Chesapeake off Boston. It was done in fifteen minutes. She brought her in here on Sunday during morning service. Somebody opened the church door and called it out. The whole congregation got up and went down to the wharves. The clergyman went with them. Captain Broke was carried ashore with his head laid open. He drilled his gunners every day for seven years.”`},
  {id:'edmund-middlewatch', kind:'news', w:() => at('navy'), x:() => `“At sea. My dear Father, I write in the middle watch. There is no news. Yesterday we sighted a sail. It was a Portuguese with salt. The day before, we scrubbed hammocks. I have read the Hatherley letters until they come apart at the folds. Tell me how the wheat looks in Twelve Acres. Tell me who has the mill. Tell me anything that grows.”`},

  /* ---------- the Militia ---------- */
  {id:'edmund-ipswich', kind:'news', w:() => at('militia') && yr(1803, 1808), x:() => `“Ipswich Barracks. My dear Father, I have ninety Berkshire ploughmen in red coats. Forty are substitutes at ten guineas a head. One has been a substitute in three counties. They drill well enough. They will not keep step past a field of wheat without looking over the hedge. Yesterday the whole company gave its opinion of a Suffolk ploughing as it marched by. The opinion was low.”`},
  {id:'edmund-dover', kind:'news', w:() => at('militia') && yr(1804, 1810), x:() => `“Dover Castle. My dear Father, We mount guard on the Western Heights and look at France. On a clear morning I can count the windows in Calais. They are building round towers along this shore, one to every half mile, with a gun on top. The men call them Mr Pitt’s pepper-pots. A tower costs seven thousand pounds. My company has not had new shoes since Reading.”`},
  {id:'edmund-hythe', kind:'news', w:() => at('militia') && yr(1805, 1809), x:() => `“Hythe. My dear Father, We are lent to the Engineers to dig. There is to be a canal from here to Rye to keep out the French, thirty feet wide. A Frenchman who has crossed the Channel is to be stopped by a ditch. My ploughmen dig it better than the navigators and for less. The Colonel is very proud of this. The men would sooner have the navigators’ wages.”`},
  {id:'edmund-volunteering', kind:'news', w:() => at('militia') && yr(1807, 1812), x:() => `“My dear Father, A serjeant of the Line has been through the barracks with a drum. Any Militia man who goes into the regulars has ten guineas. I have lost thirty-four from my company in a week. They go to Portugal. I asked the Colonel for leave to go with them as a volunteer. He said that I was a married man or ought to be, and that somebody must teach the next thirty-four their left feet.”`},
  {id:'edmund-normancross', kind:'news', w:() => at('militia') && yr(1808, 1813), x:() => `“Norman Cross. My dear Father, We are guarding six thousand French prisoners in wooden barracks on a heath. They have a market at the gate every forenoon. They sell ships made of mutton bones, with all their rigging. They sell straw hats. One sells lessons in fencing. I have bought my mother a work-box. The man who made it was a dragoon at Marengo. He asked me whether we had any news of peace.”`},
  {id:'edmund-huddersfield', kind:'news', w:() => at('militia') && yr(1812, 1813), x:() => `“Huddersfield. My dear Father, We are marched into Yorkshire to guard shearing frames against Englishmen. The croppers come at night with their faces blacked and break the frames with a great hammer. They call the hammer Enoch. My men are quartered on the town at five to a house. Nobody here will sell us an egg. I joined to keep the French out of Kent.”`},
  {id:'edmund-disembodied', kind:'news', w:() => at('militia') && yr(1814, 1815), x:() => `“Reading. My dear Father, It is Peace and the Regiment is to be disembodied. The men give in their arms on Monday and have fourteen days’ pay to carry them home. Most have been eleven years from their parishes. My serjeant asked me what a man does who has been a serjeant. I could not tell him. I shall be at Hatherley on Thursday week with one trunk and a dog.”`},
  {id:'edmund-guardroom', kind:'news', w:() => at('militia'), x:() => `“My dear Father, I am Captain of the day and write from the guard-room. Nothing has happened here since we came. The men mount guard over a magazine, a pump and a hay-stack. On Sunday a private of mine was found asleep against the hay-stack. He said in his defence that nobody had ever tried to take it. The Colonel gave him seven days.”`},

  /* ---------- the Church, before he has a living ---------- */
  {id:'edmund-oriel', kind:'news', w:() => at('church') && yr(1796, 1799), x:() => `“Oriel College. My dear Father, Chapel is at seven. I read Greek Testament with Mr Copleston at ten and Paley at twelve. Dinner is at three and the port goes round until six. There are men here who have not been seen sober since they matriculated and will be Deans. I have learnt one thing thoroughly. It is how to cross the quadrangle so that the Provost does not see my boots.”`},
  {id:'edmund-ordained', kind:'news', w:() => at('church') && yr(1799, 1801), x:() => `“Oxford. My dear Father, I was ordained Deacon on Sunday. The Bishop’s chaplain examined me on the Saturday. He was shaving. He asked me to construe a verse of St John and said ‘Very well’ before I had done. Then he asked whose son I was. That took longer. There were eleven of us in the Cathedral. Two had been in the Army and one had failed as an attorney.”`},
  {id:'edmund-curacy', kind:'news', w:() => at('church') && yr(1800, 1815), x:() => `“My dear Father, I have a curacy in Hampshire at fifty pounds a year. There are two churches seven miles apart. I serve one in the morning and ride to the other after a cold dinner. The Rector lives at Bath for his health. He has nine hundred a year from the tithe. I have seen him once. He told me that the people here were very attached to short sermons.”`},
  {id:'edmund-burials', kind:'news', w:() => at('church') && yr(1800, 1815) && (PRICES[S.year] || 0) >= 100, x:() => `“My dear Father, I have buried nineteen since Christmas in a parish of three hundred. Eleven were children. It is not a fever. Wheat is too dear for a man on eight shillings to buy any. They live on tea and potatoes. I wrote to the Rector at Bath to ask for coals and flour for the poor. He sent two guineas and a tract on frugal cookery.”`},
  {id:'edmund-tithepig', kind:'news', w:() => at('church') && yr(1801, 1815), x:() => `“My dear Father, I am sent by the Rector’s agent to take the tithe. Every tenth cock of hay. Every tenth lamb. On Tuesday it was a tenth pig, from a litter of nine. The farmer said that there was no tenth and the Church might have the next. His wife said I looked hungry and gave me bacon and eggs. I think I am not the man for this part of the work.”`},
  {id:'edmund-pressed', kind:'news', w:() => at('church') && yr(1803, 1813), x:() => `“My dear Father, We are eleven miles from Portsmouth. On Saturday night the press gang came through and took four men out of the Anchor. I had married one of them on the Thursday. On Sunday his wife sat in the front pew by herself. I had a sermon ready upon contentment. I read them the hundred and seventh Psalm, about those that go down to the sea, and sent them home.”`},
  {id:'edmund-waiting', kind:'news', w:() => at('church') && yr(1804, 1815), x:() => `“My dear Father, I have now been a curate eleven years counting from my Deacon’s orders. The Rector is seventy-four and takes the waters. I asked his agent who has the next presentation. It is sold already to a gentleman in the City for his nephew. The nephew is nine. I keep a pig, a pony and a school for six farmers’ sons. How does ${F('gallDead') ? 'the new man do at Hatherley' : 'Dr Gall do'}?”`},

  /* ---------- at home, the heir ---------- */
  {id:'edmund-rentbook', kind:'talk', w:() => at('home'), x:() => `Edmund comes to the book-room with the rent book under his arm.

“Church Farm has paid the same rent since 1784, sir. Wheat was forty shillings then.”

He has it worked out on a sheet of paper. He would raise it by a tenth at Lady Day.`,
    a:() => `“Do it.”

He writes the notice himself in a fair hand. He carries it to Church Farm himself. He is back in an hour.

“He gave me a glass of ale, sir. He said he had expected it these five years.”`,
    b:() => `You sit down with him and the book until the candles are changed. He knows what every field bore last year. You find two mistakes in his sums and he finds one in yours.

At eleven Henrietta sends to ask whether either of you means to go to bed.`,
    c:() => `“I will think about it.”

“Yes, sir.”

He shuts the book. He puts the sheet of paper inside it. It is there when you open the book at Michaelmas.`},
  {id:'edmund-gun', kind:'talk', w:() => at('home') && (S.season === 2 || S.season === 3), x:() => `Edmund is cleaning both guns at the hall table.

“Mudge has too many hen pheasants and no ground for them, sir. I would turn the rough end of Cuckoo Copse into cover. Forty rods of furze. One man, three weeks.”

He does not look up from the lock.`,
    a:() => `You give him the man and the three weeks. He is in the copse every morning in his shirt with a bill-hook.

In October you and he walk it up together. Eleven brace. He lets you take the right-hand birds.`,
    b:() => `You walk down to the copse with him. He shows you where the furze is to go. He has it pegged out already.

A cock pheasant gets up between your feet. Neither of you has a gun. You both laugh.`,
    c:() => `“We shall see.”

He finishes the lock. He hangs up the guns. Next week you see the pegs in Cuckoo Copse. Nobody has pulled them up.`},
  {id:'edmund-gazette', kind:'talk', w:() => at('home') && yr(1798, 1814), x:() => `The Gazette has come. Edmund reads it standing at the window.

“Tamworth has his company,” he says. “He was below me at school.”

He folds the paper. He asks whether you want him for anything this morning.`,
    a:() => `“Take the grey and ride to Newbury market. Sell the barley as you think fit.”

He sells it at two shillings over what Crabbe had asked. He tells you the price at dinner. He does not mention the Gazette.`,
    b:() => `You take him round the home farm. You ask his opinion of every field and you take it in two.

At the last gate he says, “I know what you are doing, sir.”

He holds the gate for you.`,
    c:() => `“Nothing this morning.”

He goes out. You hear him in the yard, speaking to the groom. He rides towards the Down. He is not back for dinner.`},
  {id:'edmund-drains', kind:'talk', w:() => at('home') && !S.projectsDone.drain, x:() => `Edmund has been at Hartopp’s. He comes back with clay to the knee.

“He has put stone drains under twenty acres, sir. He was sowing on it in February. Kennet Bottom is the same clay.”

He has brought a piece of the clay in his handkerchief. He puts it on your desk.`,
    a:() => `You let him try five acres at the wet end. He is out with the men at six.

By spring the five acres are dry enough to walk. He walks you over them twice.`,
    b:() => `You ride to Hartopp’s with him the next morning. Hartopp talks for two hours. Edmund asks him the cost by the rod. He asks it three times before Hartopp answers.

“That boy of yours,” says Hartopp, “will be a nuisance to somebody.”`,
    c:() => `“Not this year.”

He takes the clay off your desk. There is a mark on the leather. It is there still.`},
  {id:'edmund-thirty', kind:'talk', w:() => at('home') && yr(1806, 1815), x:() => `It is Edmund’s birthday. He is ${19 + S.year - 1795}.

He comes in after dinner and stands with his back to the fire.

“I should like something that is mine to do, sir. I do not mean an allowance.”`,
    a:() => `You give him the woods. Every copse on the estate, the felling, the sales and the planting.

He has a book ruled for them by Friday. On Monday he marks forty oaks in Cuckoo Copse with a scribing-iron. He marks them himself.`,
    b:() => `You talk until one. You tell him what your uncle left and what he owed. He has guessed most of it.

“I had rather know, sir,” he says on the stairs.`,
    c:() => `“You have the whole estate to learn.”

“I have learnt it, sir.”

He bows. He goes up. You hear his door.`},

  /* ---------- farming on his own account ---------- */
  {id:'edmund-swedes', kind:'talk', w:() => at('farmer'), x:() => `Edmund rides up from his farm before breakfast. He has a Swede turnip in each coat pocket.

“Eleven pounds, that one, sir. Off the wet end. Your home farm has nothing over seven.”

He puts them both on the breakfast table. Henrietta moves the butter.`,
    a:() => `You buy his seed for the home farm at his price. He counts the money on the table.

“I should have asked more,” he says.

He stays to breakfast.`,
    b:() => `You ride back with him. Sophia shows you the dairy. Edmund shows you the Swedes, the drains and a bull.

You are there until four. The bull is the only thing on the farm you would not have yourself.`,
    c:() => `“Very fine.”

He looks at you. He puts the turnips back in his pockets.

“Sophia sends her duty, sir.” He does not stay to breakfast.`},
  {id:'edmund-rent', kind:'talk', w:() => at('farmer') && S.season === 2, x:() => `Michaelmas. Edmund comes to the audit with the other tenants. He waits his turn behind Mr Froome.

He lays his rent on the table in notes and silver.

“I would have the same abatement as any other tenant, sir. Or none, as they have.”`,
    a:() => `You give him a receipt as you gave Froome. You take off nothing.

He reads it and puts it in his hat. At the audit dinner he sits among the farmers. He carves.`,
    b:() => `You keep him after the others have gone. You go through his year with him. He has cleared forty pounds.

“It is forty more than I had from the Army,” he says. “And I was not shot at.”`,
    c:() => `You push ten pounds back across the table.

“For my grandchildren.”

He leaves it lying there. Sophia sends for it on Tuesday, with her thanks.`},
  {id:'edmund-christening', kind:'talk', w:() => at('farmer') && yr(1805, 1815), x:() => `Edmund and Sophia have another child. He comes to ask whether you will stand godfather.

“Sophia would like him called Barnaby, sir. For the estate.”

He turns his hat round in his hands.`,
    a:() => `The child is christened Barnaby. You give him a silver mug with the name cut on it.

At the font he roars. The clergyman says it is the Devil going out. Henrietta says it is your uncle coming in.`,
    b:() => `You walk down to see the child. He is asleep. You are allowed to hold him for as long as he stays so.

It is four minutes. You stand very still for all of it.`,
    c:() => `“Call him what you like. Not Barnaby.”

He is christened Thomas. Sophia calls him Barnaby in the house.`},
  {id:'edmund-machine', kind:'talk', w:() => at('farmer') && yr(1806, 1815), x:() => `Edmund has been to see a threshing machine at work. He comes up to the Hall with chaff in his hair.

“It did in a day what my four men do in a fortnight, sir. Then I looked at my four men.”

He asks what you would do.`,
    a:() => `“Keep your men.”

He keeps them. His wheat is at market in March with everybody else’s. He does not complain of the price.`,
    b:() => `You and he reckon it together. The machine saves him thirty pounds a winter. The four families cost the parish thirty-five if they come on the rate.

“And I pay the rate,” says Edmund. He tears up the paper.`,
    c:() => `“It is your farm.”

“Yes, sir. That is why I asked.”

He goes home. You do not hear which he chose.`},

  /* ---------- vicar of the parish ---------- */
  {id:'edmund-sermon', kind:'talk', w:() => at('vicar'), x:() => `Edmund has the sermon for Sunday in his pocket. He reads it to you in the book-room.

It is upon the labourer and his hire. It is nine minutes long. You are in it, though not by name.

“I had rather you heard it here first, sir.”`,
    a:() => `“Preach it.”

He preaches it. You sit in the Hall pew with your face to the pulpit. Hartopp turns round twice to look at you.

In the churchyard four labourers take off their hats to the Vicar. They have never done that before.`,
    b:() => `You argue it with him until midnight. He gives up one sentence. You give up two.

On Sunday he looks at you when he reaches the place. You nod.`,
    c:() => `“I should leave out the part about the hire.”

He preaches on the Prodigal Son. He reads it flat and fast. Henrietta asks in the carriage what you said to him.`},
  {id:'edmund-tithe', kind:'talk', w:() => at('vicar'), x:() => `Edmund has the tithe book that Dr Gall kept. He lays it open on your desk.

“He took a tenth of the cottagers’ potatoes, sir. And their eggs. I should like to stop at the corn and the hay.”

It would cost the living thirty pounds a year. The living is in your gift.`,
    a:() => `“They are your tithes.”

He lets the potatoes go. On the next Sunday there are eleven more in church. One brings him a basket of eggs.

He sends it back with a shilling.`,
    b:() => `You go through Gall’s book together. The Doctor had tithed a widow’s bees.

“Honey, two pounds,” reads Edmund. “Wax, a quarter.” He shuts the book.`,
    c:() => `“The next vicar will not thank you.”

He takes the tithe as Gall took it. He pays the potatoes back at Christmas out of his own pocket. He thinks you do not know.`},
  {id:'edmund-vestry', kind:'talk', w:() => at('vicar') && yr(1800, 1815), x:() => `Edmund has been in the chair at the vestry. He comes up to the Hall afterwards without his hat.

“They voted to cut the allowance to the old people, sir. Froome moved it. I had no vote, only the chair.”

He walks up and down your carpet.`,
    a:() => `You call a second vestry and attend it. You have six votes for your rating. The allowance is put back.

Froome says the Hall and the Vicarage are become one house. Edmund says he hopes so.`,
    b:() => `He stays to dinner. He is still angry at the cheese.

“I had it easier at ${E() === 'church' ? 'the curacy' : 'school'},” he says. “Nobody there was a relation.”

Henrietta laughs. Then he does.`,
    c:() => `“The vestry is the ratepayers’ business.”

“And the old people are mine, sir.”

He bows. He goes down the drive bareheaded in the rain.`},

  /* ---------- he asks for money ---------- */
  {id:'edmund-kit', kind:'ask', sum:80, w:() => at('army') && yr(1809, 1809), x:() => `“Plymouth. My dear Father, Everything I had is in a ditch in Galicia. Two coats, my bed, my saddle and the horse under it. The Regiment is to go out again in the summer. A Captain cannot go in a borrowed coat. I must ask you for eighty pounds. I had rather ask for it than owe it to the paymaster.”`},
  {id:'edmund-mess', kind:'ask', sum:60, w:() => at('army'), x:() => `“My dear Father, I am obliged to trouble you. The Colonel has ordered a new pattern of jacket for the officers, with silver lace. It is the third pattern since I joined. There is also the mess plate, to which every officer subscribes, and a horse I backed at Canterbury. Sixty pounds would clear me. The horse is the smallest part of it. I mention the horse because you will hear of it from Tamworth’s father.”`},
  {id:'edmund-outfit', kind:'ask', sum:70, w:() => at('navy') && yr(1801, 1804), x:() => `“Portsmouth. My dear Father, I have my commission as Lieutenant. I have no coat to wear it in. A Lieutenant must have a full dress and an undress coat, a sword, a sextant of his own and a share in the gunroom wine. The tailor on the Hard will not trust a midshipman. Seventy pounds would rig me. I will pay it out of the first prize.”`},
  {id:'edmund-agent', kind:'ask', sum:60, w:() => at('navy') && yr(1805, 1814), x:() => `“My dear Father, My prize agent has broke. He held two hundred and ten pounds of mine and is gone to Boulogne with it. I owe the gunroom steward and the tailor and I have nothing coming in until the quarter. Sixty pounds would keep me from asking the Captain. I had sooner ask you.”`},
  {id:'edmund-plate', kind:'ask', sum:80, w:() => at('militia'), x:() => `“My dear Father, The mess has voted itself a silver tureen. The Colonel proposed it, so nobody spoke against. My share is eleven guineas. There is also the band, which the officers pay for, and the regimental ball, and my serjeant’s wife, who has been brought to bed of twins. Eighty pounds would cover all. The twins are the cheapest item.”`},
  {id:'edmund-pony', kind:'ask', sum:45, w:() => at('church') && yr(1800, 1815), x:() => `“My dear Father, My pony is dead. She fell in the lane on Sunday between the two churches and I read evening prayer an hour late in a wet surplice. I cannot serve both parishes on foot. A sound cob is thirty pounds here. I also owe the bookseller at Winchester. Forty-five pounds in all. A curate’s year is fifty.”`},
  {id:'edmund-hunter', kind:'ask', sum:70, w:() => at('home'), x:() => `Edmund finds you in the stable yard.

“Loveday has a brown gelding to sell, sir. Six years old. He asks seventy guineas and would take pounds.”

He has ridden the same cob since he was sixteen. He does not say so.`},
  {id:'edmund-ram', kind:'ask', sum:60, w:() => at('farmer'), x:() => `Edmund is back from Hartopp’s shearing.

“There is a New Leicester shearling ram to be let for the season, sir. Sixty pounds. I have forty. He would put four pounds of wool on every lamb I breed.”

He names the twenty he wants. He names the day he will repay it.`},
  {id:'edmund-chancel', kind:'ask', sum:90, w:() => at('vicar'), x:() => `Edmund takes you into the chancel after service. He points up.

There is daylight through the roof over the altar. A starling goes in by it.

“The chancel is the Rector’s to mend, sir. I am the Rector. The plumber says ninety pounds. The living is worth a hundred and eighty.”`},

  /* ---------- he wishes to marry ---------- */
  {id:'edmund-miss-army', kind:'girl', lady:'Miss Charlotte Pott', father:'Major Pott', w:() => at('army') && yr(1803, 1814) && !F('edmundMarried'), x:() => `“My dear Father, I write upon a subject I have not opened before. Major Pott of ours has a daughter. Miss Charlotte Pott is twenty-two. She has followed the Regiment since she was nine and can tell a good biscuit from a bad one in the dark. She has no fortune. I have asked her and she has said yes if you do. I await your answer with more fear than I ever felt of the French.”`},
  {id:'edmund-miss-navy', kind:'girl', lady:'Miss Anne Hallett', father:'Mr Hallett', w:() => at('navy') && yr(1802, 1814) && !F('edmundMarried'), x:() => `“My dear Father, Our purser, Mr Hallett, has a sister at Gosport who keeps house for him. Miss Anne Hallett is twenty-four. She has waited on the Hard for the same ship to come in these six years, to see her brother. Lately I find that I am looked for too. She has five hundred pounds in the Navy Five per Cents. I have asked her. She says a sailor’s wife sees her husband one month in twelve and she has had practice.”`},
  {id:'edmund-miss-militia', kind:'girl', lady:'Miss Mary Finnis', father:'Mr Finnis', w:() => at('militia') && !F('edmundMarried'), x:() => `“My dear Father, I am to tell you of Miss Mary Finnis, of Dover. Her father is a brewer and supplies the garrison. I was sent to complain of the beer and stayed to tea. I have since complained of the beer on eleven occasions. Mr Finnis says he will give four thousand pounds with her. He would like to hear it from you that a brewer’s daughter will be received at Hatherley.”`},
  {id:'edmund-miss-church', kind:'girl', lady:'Miss Jane Lyford', father:'Mr Lyford', w:() => at('church') && yr(1801, 1815) && !F('edmundMarried'), x:() => `“My dear Father, The surgeon of this place, Mr Lyford, has five daughters. The second is Miss Jane. She teaches in my Sunday school and has mended my surplice twice without being asked. We could not marry on fifty pounds. We could on a hundred and fifty. I do not ask for the hundred. I ask whether you would object to the lady if I had it.”`},
  {id:'edmund-miss-home', kind:'girl', lady:'Miss Sophia Loveday', father:'Mr Loveday', w:() => at('home', 'vicar') && yr(1807, 1815) && !F('edmundMarried'), x:() => `Edmund has dined at the Lovedays’ every Thursday since Michaelmas.

He comes to the book-room in his best coat.

“I have spoken to Miss Sophia Loveday, sir. I have not yet spoken to her father. I thought I should speak to mine.”`},

  /* ---------- Long Barrow and his signature ---------- */
  {id:'edmund-settle-letter', kind:'settle', w:() => edmAway() && lbAtStake() && edmR() >= 0, x:() => `“My dear Father, I have had a letter from Mr Spurling. He writes that Long Barrow may have to be sold to clear the mortgage, and that being settled land it wants my hand to the deed. I do not write to refuse. I write to ask what is owed. I have never been told. If my name is to go on a parchment I should like to read the figures first.”`},
  {id:'edmund-settle-stiff', kind:'settle', w:() => edmAway() && lbAtStake() && edmR() < 0, x:() => `“Sir, Mr Spurling informs me that you may wish to sell Long Barrow, and that my signature is required. I am to have that farm by my great-uncle’s settlement and my son after me. I have had little else from Hatherley. I shall want better reasons than Mr Spurling’s before I sign. I remain, Sir, your obedient son.”`},
  {id:'edmund-settle-room', kind:'settle', w:() => !edmAway() && lbAtStake(), x:() => `Edmund has met Mr Spurling in Wyvern market place.

He shuts the book-room door behind him.

“He tells me Long Barrow may be sold, sir. And that I must sign. ${edmR() >= 0 ? 'I should like to know what we owe.' : 'I think I had a right to hear it from you.'}”`},

  /* ---------- not on terms ---------- */
  {id:'edmund-cold-letter', kind:'cold', w:() => edmAway() && edmR() <= -2, x:() => `“Sir, I have received my mother’s letter of the 4th and beg you will thank her for the flannel. I am in good health. The weather has been wet. I have nothing further to communicate. I remain, Sir, your dutiful son, Edmund ${S.sur}.”

It is the whole letter. It does not cover one side.`},
  {id:'edmund-cold-room', kind:'cold', w:() => !edmAway() && edmR() <= -2, x:() => `Edmund has not dined at your table since ${['Lady Day', 'Midsummer', 'Michaelmas', 'Christmas'][(S.season + 3) % 4]}.

You meet him in the stable yard. He takes off his hat.

“Good morning, sir.”

He stands with it off until you have gone by.`}
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
  `The post-boy brings a letter from Edmund. There is one and a penny to pay on it. He has crossed it to save a second sheet.`,
  `A letter from Edmund. The wafer is cracked. Henrietta has read the direction three times before you come down.`,
  `Edmund’s hand, on the hall table. Eightpence to pay. Henrietta stands by while you break the wafer.`,
  `The carrier leaves a letter at the lodge. It is from Edmund. The lodge-keeper’s wife brings it up herself and waits in the hall.`];
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

His answer is eleven lines. He has bought ${at('army') ? 'a horse, a boat-cloak and a dinner for his company' : at('navy') ? 'a sextant, a sea-cloak and a dinner for the gunroom' : at('militia') ? 'a new sash, a second-hand charger and a dinner for his serjeants' : 'a cob, a great-coat and forty bushels of coals for the poor of two parishes'}. He does not say what each cost.`,
        `Fifty pounds goes by the next post.

He writes back in a week. He has paid his tailor, his servant and ${mates()}. There is four pounds over. He asks whether he should send it back.`,
        `You send fifty pounds and no advice.

His answer is to his mother. There is a line in it for you. “Tell my father the money came on the very day it was wanted. I will not say for what.”`]); }},
    {t:'Write him four sides about the estate.', if:() => edmKind('news'), go:() => { add({family:3}); reg('edmund',1);
      return pick([
        `You write four sides. The wheat. The lambing. Who is dead and who is married. What the bay mare did to the coach-house door.

You read it over. It is dull. You seal it.

His next letter has a postscript.

“${at('army') ? 'Tamworth asks' : at('navy') ? 'The Master asks' : at('militia') ? 'My serjeant asks' : 'My landlady asks'} whether the bay mare is sold. ${at('church') ? 'She has sixpence on it with the clerk.' : 'There is money on it here.'}”`,
        `You write four sides. You give him the price of wheat at Newbury and what each field bore. You tell him Mudge has shot a white stoat.

He answers every paragraph in order. Against the stoat he has written, “Stuff it.”`,
        `You write on Sunday evening. Four sides, crossed. The rent audit, the new hedge, the death of old Dewey’s dog.

He writes back that he read it aloud to ${mates()}. Nobody believed in the dog.`]); }},
    {t:'Let Henrietta answer. She has knitted him something.', if:() => edmKind('news'), go:() => { add({family:1}); reg('henrietta',1);
      return pick([
        `Henrietta writes eleven sides. She packs two flannel waistcoats, a plum cake and a receipt against the flux.

His answer comes addressed to her. She reads you one line of it.

“The cake was of the greatest interest to the surgeon.”

She folds the letter and puts it in her work-box.`,
        `Henrietta sends six pair of worsted stockings and a letter. You are not shown the letter.

His answer is to her. She laughs twice while she reads it. She does not say at what.`,
        `Henrietta writes for two evenings. She encloses a lock of the dog’s hair, a sermon and a pot of calves’-foot jelly.

The jelly travels badly. He thanks her for the sermon. He says the paper was very useful.`]); }},
    /* he calls in person */
    {t:'Let him have his way in it.', if:() => edmKind('talk'), go:() => { add({family:1}); reg('edmund',2,'You let him have his way'); return edmNow().a(); }},
    {t:'Go into it with him.', if:() => edmKind('talk'), go:() => { add({family:3}); reg('edmund',1); return edmNow().b(); }},
    {t:'Put him off.', if:() => edmKind('talk'), go:() => { add({family:-1}); reg('edmund',-1,'You put him off'); return edmNow().c(); }},
    /* he asks for money */
    {t:'Let him have the whole of it.', note:() => '£' + edmNow().sum, if:() => edmKind('ask'), go:() => { add({money:-edmNow().sum, family:2}); reg('edmund',2,'You paid when he asked');
      return edmAway() ? pick([
        `You send a draft for the whole sum by return.

His answer is one line. “My dear Father, It came. I shall not forget it. E.”`,
        `You send it all. You add nothing about economy.

He writes that he read your letter twice to find the sermon in it. He has kept the letter.`])
      : `“You shall have it.”

He had the next sentence ready. He does not need it. He stands a moment with his mouth open.

“Thank you, sir.” He goes out fast.`; }},
    {t:'Half, and a page of advice.', note:() => '£' + Math.round(edmNow().sum / 2), if:() => edmKind('ask'), go:() => { add({money:-Math.round(edmNow().sum / 2)}); reg('edmund',0);
      return edmAway() ? `You send half. You send with it a page upon living within one’s means. You wrote from experience.

He thanks you for the draft. He says he has read the advice to ${mates()} and it was much admired.`
      : `You give him half. You tell him how you managed at his age.

“Yes, sir,” he says. He has heard how you managed at his age. He heard it from your uncle’s steward.`; }},
    {t:'Advice only.', if:() => edmKind('ask'), go:() => { add({family:-2}); reg('edmund',-2,'You sent advice when he asked for money');
      return edmAway() ? `You write two sides upon debt. You enclose nothing.

There is no answer for eleven weeks. Then Henrietta has a letter. He has sold his watch.`
      : `“We cannot run to it this year.”

“No, sir.”

He does not ask again. He does not ask for anything again.`; }},
    /* he wishes to marry */
    {t:'Give your consent, and three hundred pounds to begin on.', note:'£300', if:() => edmKind('girl'), go:() => { const p = edmNow(); fl('edmundMarried'); add({money:-300, family:6}); reg('edmund',3,'You gave your blessing and three hundred pounds'); reg('henrietta',1);
      return `You give your consent in six lines. You send three hundred pounds with it.

They are married within the quarter. ${p.lady} writes to Henrietta as “My dear Madam”. Her hand is small and upright. She has asked for the receipt for Mrs Bunce’s plum cake.

Henrietta sends it. She leaves out the brandy.`; }},
    {t:'Ask what her father means to give with her.', if:() => edmKind('girl'), go:() => { const p = edmNow();
      if (chance(0.5)) { fl('edmundMarried'); add({family:3}); reg('edmund',0);
        return `You write to ${p.father}. You ask what he proposes to settle.

${p.father} answers by return. He names a sum. It is more than you would have asked. He names what he expects from you. It is nothing.

They are married within the quarter. You are thanked by everybody. Edmund thanks you last.`; }
      add({family:-2}); reg('edmund',-2,'You asked her father for his figures');
      return `You write to ${p.father}. You ask what he proposes to settle.

${p.father} answers that he had not understood his daughter was for sale.

The lady releases Edmund from his word. He tells you so in four lines.`; }},
    {t:'Forbid it.', if:() => edmKind('girl'), go:() => { const p = edmNow(); add({family:-4}); reg('edmund',-3,'You forbade ' + p.lady); reg('henrietta',-1);
      return `You write that it will not do.

His answer is short. “Sir, I have told ${p.lady} what you say. She did not cry. I had rather she had.”

Henrietta does not speak of it. She does not speak of much else to you that week.`; }},
    /* the settlement */
    {t:'Show him the accounts, every page.', if:() => edmKind('settle'), go:() => { add({family:2}); reg('edmund',2,'You showed him the accounts');
      return edmAway() ? `You have ${F('crabbeGone') ? 'Lark' : 'Crabbe'} copy the whole account. The mortgage. The interest. The rental. What your uncle owed at Brooks’s. It makes nine sheets.

Edmund’s answer comes in a fortnight. “I have read it three times. I had no notion. If it must be signed I will sign, and I thank you for treating me as a man.”`
      : `You take down the ledgers. You go through them with him from your uncle’s death. It takes until two in the morning.

He says very little. At the end he squares the books on the desk.

“If it comes to it, sir, I will sign.”`; }},
    {t:'Give him your word that Long Barrow shall not be sold.', if:() => edmKind('settle'), go:() => { fl('lbWord'); add({family:1}); reg('edmund',1,'You gave your word on Long Barrow');
      return edmAway() ? `You write that Long Barrow will come to him as your uncle meant. You sign it and date it.

He writes back that he has put the letter with his commission and his mother’s hair.`
      : `“Long Barrow comes to you. You have my word.”

He looks at you for some time.

“I shall hold you to it, sir.” He holds out his hand. You take it.`; }},
    {t:'Tell him the estate is yours while you live.', if:() => edmKind('settle'), go:() => { add({family:-3}); reg('edmund',-2,'You told him the estate was none of his business');
      return edmAway() ? `You write that the estate is yours while you live, and that Mr Spurling had no business to write.

There is no answer. Mr Spurling tells you in Wyvern that he has had one. He does not show it to you.`
      : `“The estate is mine while I live.”

“And the debts, sir? Whose are those to be?”

He does not wait for the answer.`; }},
    /* not on terms */
    {t:'Make the first move.', if:() => edmKind('cold'), go:() => { add({family:3}); reg('edmund',2,'You made the first move');
      return edmAway() ? `You write as you did when he was at school. You tell him the dog has had pups. You tell him his rod is where he left it. You sign it “your affectionate father”.

His answer covers three sides. It begins “My dear Father”.`
      : `You go round to the gun room after dinner. He is there with a book.

“I was wrong,” you say. You do not say in what. There is a choice.

He puts the book down. After a time he gets out the backgammon board.`; }},
    {t:'Send fifty pounds and say nothing.', note:'£50', if:() => edmKind('cold'), go:() => { add({money:-50}); reg('edmund',1);
      return edmAway() ? `You send a draft for fifty pounds in a blank cover.

It is acknowledged. “Sir, I have received fifty pounds, for which I am obliged.” There is a postscript. “How is my mother’s cough?”`
      : `You leave fifty pounds on his dressing-table in a folded paper.

He does not mention it. On Sunday he walks to church beside you. He has not done that since the spring.`; }},
    {t:'Let him come round in his own time.', if:() => edmKind('cold'), go:() => { add({family:-2});
      return edmAway() ? `You do not answer. Henrietta does. She writes him four sides and shows you none of them.

His next letter is to her.`
      : `You say nothing. He says nothing.

Henrietta has taken to dining with a book. She lays it open between the two of you and reads it.`; }}
  ]});

ev({ id:'edmundHome', from:1803, to:1806, weight:3, cond:() => E() === 'home' && !F('edmundDead'), title:'Edmund and the Volunteers',
  text:() => `Edmund is rising thirty. He knows every field on the estate and what it let for in 1790.

The war has begun again. Two of his schoolfellows are at sea. One is at Malta. Edmund reads the Gazette at breakfast and leaves his egg.

He comes to the book-room after dinner. He has the offer of a company in the Berkshire Militia. It would take him from home until the peace.

“Or I might stay, sir.” He looks at the fire. “If I had Kennet Bottom to farm for myself.”

He has dined at the Lovedays’ four times this month.`,
  choices:[
    {t:'Let him take the militia captaincy.', go:() => { fl('edmund','militia'); add({family:-2, standing:2}); reg('edmund',2,'You let him go for a soldier at last');
      return `He marches with the Berkshires in a new red coat. His letters come from Ipswich, then Dover, then Hythe. No Frenchman lands at any of them.

He is home on leave at Christmas. He stands straighter. He tells the groom how the harness is to be kept. The groom does it.`; }},
    {t:'Give him Kennet Bottom, and your blessing on Miss Loveday.', note:'£300', go:() => { fl('edmund','farmer'); fl('edmundMarried'); S.improve += 1; add({money:-300, family:8}); reg('edmund',3,'You gave him a farm of his own and a wife'); reg('henrietta',2);
      return `You give him Kennet Bottom and three hundred pounds to stock it.

He marries Sophia Loveday in Hatherley church. She is brisk and freckled. At the wedding breakfast Henrietta tells her how butter is made at the Hall.

“Yes, ma’am,” says Sophia. “We make ours the other way.”

Edmund begins the drains on the Monday. The Bottom goes down to Swedes.`; }},
    {t:'Tell him his duty is here, as your son.', go:() => { add({family:-5}); reg('edmund',-3,'You kept him at home a second time');
      return `“Your duty is here.”

“Yes, sir.”

He keeps the rent book as before. Every figure in it is right. He answers when he is spoken to.

In the evenings he reads the Gazette by himself. He keeps one finger under the names.`; }}
  ]});

ev({ id:'kittyBotany', from:1806, to:1812, weight:2, cond:() => K() === 'free' && !F('dubreuilWaits'), title:'Miss Kitty and the Orchids',
  text:() => `Kitty is ${kittyAge()}. She has refused four men. The last was a rural dean.

She walks on Hatherley Down every morning with a tin box. She has found a small green orchid there. It is not in Withering. It is not in Hudson. She has drawn it at four times the size of life and dried a specimen.

She wishes to send both to Sir Joseph Banks.

“A woman who writes to the Royal Society will never be asked for again,” says Henrietta.

“I had thought of that, Mamma.”`,
  choices:[
    {t:'Send it under your own cover, and buy her a proper microscope.', note:'£40', go:() => { fl('kittyBotanist'); add({money:-40, family:3}); reg('kitty',3,'You bought her a microscope and sent her orchid to Sir Joseph Banks'); reg('henrietta',-1);
      return `The microscope comes from Dollond’s in a mahogany case. Forty pounds.

Sir Joseph answers in his own hand, three sides.

“The plant is new to me. Mr Sowerby shall figure it for English Botany. Your daughter, Sir, draws better than half my correspondents. She observes better than the other half.”

Kitty reads it standing in the hall. She reads it again. Then she goes out on the Down without a bonnet. It is raining.`; }},
    {t:'Let her send it, under a gentleman’s initials.', go:() => { add({family:-1}); reg('kitty',-1,'You made her sign her orchid with a man’s initials');
      return `The parcel goes to Soho Square from “K. ${S.sur[0]}., Esq.”

Sir Joseph answers that gentleman by return. He sends his compliments. He hopes Mr ${S.sur[0]}. will dine in Soho Square on Thursday se’nnight.

Kitty writes back that Mr ${S.sur[0]}. is prevented by indisposition. She signs it with the two initials. She presses the wafer down with her thumb for some time.`; }},
    {t:'Forbid it, and ask the rural dean to dinner again.', go:() => { add({family:-5}); reg('kitty',-3,'You stopped her orchid and sent for the rural dean'); reg('henrietta',1);
      return `The rural dean comes on Thursday. He talks for two hours about the tithe on hops. Kitty passes him the sauce. She asks after his sister.

The drawing goes into the drawer of the hall table. The orchid is pressed in the second volume of Fordyce’s Sermons.

Nobody at Hatherley opens Fordyce.`; }}
  ]});

ev({ id:'smugglers', from:1805, to:1813, weight:1, title:'Brandy for the Bench',
  text:() => `Mudge is at the back door before breakfast. He will not come in.

There are two half-ankers of brandy under the straw in the cart shed. Each has a chalk cross on the head. French brandy is four pounds the dozen in Reading this year, when Reading has any.

“That’s the gentleman’s share, sir.” Mudge speaks to your boots. “They runs it up from Christchurch by night. There’s a tub left for every justice on the road. Your uncle had his regular.”

“And what did my uncle do for it?”

“Slept, sir.”`,
  choices:[
    {t:'Sleep soundly.', go:() => { fl('brandy'); add({family:2, standing:1});
      return `The tubs are carried down to the cellar. You give a dinner.

The Chairman of Quarter Sessions holds his glass to the candle.

“I have the fellow of this at home,” he says.

Nobody asks him where he had it. Nobody asks you.`; }},
    {t:'Hand the tubs to the Excise.', go:() => { add({standing:2, goodwill:-5});
      return `The Supervisor of Excise rides over from Newbury with four dragoons. He writes you a receipt for eight gallons. He looks at you a good while before he mounts.

On Thursday the carrier’s cart goes past the lodge without stopping. The grocer at Wyvern has no tea for the Hall this week. He has none next week.

Each morning the park gates are found standing open. Nothing is broken. Somebody has propped them with a stone.`; }},
    {t:'Have Mudge leave them where he found them, untouched.', go:() => { add({goodwill:1});
      return `“Leave them where they lie, Mudge. You found nothing.”

“No, sir.”

The tubs lie three nights under the straw. On the fourth morning they are gone. The straw has been raked level.

Mudge touches his hat to you twice that day.`; }}
  ]});

ev({ id:'threshHire', from:1806, to:1811, weight:1, cond:() => !F('thresher'), title:'Mr Hartopp’s Engine',
  text:() => `Hartopp has a threshing machine in his barn. It is on the Scotch plan. Four horses walk it round.

He takes you over to see it go.

“Forty quarters of wheat in a day, sir. Twelve men with flails want a week for that.”

His millwright will build you the same for a hundred and fifty pounds.

“A flail is a stick tied to a stick,” says Hartopp. “We are in the nineteenth century.”

His labourers stand along the barn wall. Their hands hang down. None of them is looking at Hartopp.`,
  choices:[
    {t:'Order one.', note:'£150', go:() => { fl('thresher'); S.improve += 1; add({money:-150, goodwill:-7}); reg('hartopp',2,'You set up a threshing machine on his plan'); reg('pryor',-1);
      return `It comes in three wagons. The millwright is nine days putting it up in the great barn. When the horses start, the tiles hum.

Your wheat is all at Newbury market before October is out.

Other years the threshing lasted from Martinmas to Candlemas. Twelve men had it, two to a floor, by lantern. This winter the lanterns hang on their hooks.

On the first Monday in December nine of the twelve are at the vestry door.`; }},
    {t:'Stay with the flail.', go:() => { add({goodwill:3}); reg('hartopp',-1);
      return `“I shall keep my sticks, Mr Hartopp.”

“Then you farm under Henry the Second, sir.”

From Martinmas the sound comes out of the great barn all day. Two men to a floor. Stroke and stroke. It stops at Candlemas.

Twelve families have had ten shillings a week through the winter.`; }}
  ]});

ev({ id:'cobbett', from:1805, to:1814, weight:1, title:'A Man on a Grey Cob',
  text:() => `A big red-faced man on a grey cob has been in the village since nine. He stops at each cottage door. He asks what the man earns. He asks what was in the pot on Sunday. He writes the answers in a book.

The landlord of the Bell sends up his name. It is Mr William Cobbett, of the Political Register.

He has asked whose estate this is. He dines at the Bell tonight. The Register is printed on Saturday.`,
  choices:[
    {t:'Ask him to dine at the Hall.', go:() => { const good = S.goodwill >= 55;
      if (good) { add({standing:4, goodwill:2}); return `He eats two helpings of the mutton and talks through both. Paper money. Sinecures. Tea. Potatoes. Scotch economists. He is against them all.

On Saturday the Register has this.

“HATHERLEY, Berks. Here I saw bacon in a labourer’s chimney. I had not seen that sight for thirty miles. The landlord is a plain sensible man. I told him so at his own table and he bore it very well.”

Henrietta cuts it out. She has it by heart on Sunday.`; }
      add({standing:-5, goodwill:1}); return `He eats your mutton. He says it is good mutton.

“And what did your labourers dine on today, sir?”

You do not know.

On Saturday the Register has two columns.

“I dined with the Squire off a saddle of mutton. I had been that morning into eleven of his cottages. There was not in the eleven as much meat as would bait a mouse-trap.”

Lord Cullerne tells you not to mind it. He can repeat it word for word.`; }},
    {t:'Let him form his own opinion.', go:() => { if (S.goodwill >= 55) { add({standing:2}); return `Saturday’s Register gives Hatherley one line.

“The people here have not the look of being hunted.”

The landlord of the Bell nails it up in the tap-room.`; }
      add({standing:-3}); return `Saturday’s Register gives Hatherley a paragraph. The labourers are “skin and grief”. The landlord is not named.

At Newbury market on Thursday three gentlemen ask after your health. A fourth asks after your cottages.`; }},
    {t:'Have the constable move him on as a vagrant.', go:() => { add({standing:-6, goodwill:-3});
      return `The constable finds him at the Bell with a chop before him. He asks to see his pass.

Mr Cobbett gives his name. He gives the name of his newspaper. He finishes the chop.

Then he rides to the parish bounds at a walk. The constable goes at his stirrup.

The Register has Hatherley on three Saturdays running. The first piece is headed “A BERKSHIRE JUSTICE”. The second is about your cottages. The third is about your uncle.`; }}
  ]});

ev({ id:'crew', from:1795, to:1802, weight:6, cond:() => T('captain'), title:'All Hands at Hatherley',
  text:() => `The household has been six months under naval discipline. Tarbuck, your coxswain, strikes the bell in the hall every half hour. At eight bells the footmen are piped to dinner.

There is a flagstaff on the leads. When Lord Cullerne’s carriage turns in at the lodge it flies “Enemy in sight”.

Old Pascoe was cook of the Dryad. He lost a leg at the Saintes. He has one receipt, for lobscouse, and he wants the copper for it. Mrs Bunce has the copper. The housemaids can splice.

This morning Tarbuck called Henrietta “the Captain’s lady, bless her”. He said it to her face.

“Do I live in a house or a frigate?” she asks you. Her voice is very level.`,
  choices:[
    {t:'A frigate. The routine stands.', go:() => { add({family:-7, goodwill:4, standing:2}); reg('henrietta',-2,'You told her she lived in a frigate');
      return `“A frigate, my dear.”

The routine stands. The brass on the front door is polished twice a day. The gravel is raked fore and aft. At noon the village children are brought to the lodge gates to hear the bell.

Henrietta sleeps with wool in her ears. To Mrs Tamworth she calls you “the Admiralty”.`; }},
    {t:'A house. Strike the hammocks and stop the bell.', go:() => { fl('crewGone'); add({family:6}); reg('henrietta',2,'You sent the ship’s routine ashore for her sake');
      return `The hammocks come down. The Dryads try beds for a week.

“It don’t swing, sir,” says Tarbuck.

A frigate is fitting out at Portsmouth. Nine of the eleven go for her. Each shakes your hand at the gate. Tarbuck pipes them over the side of the wagon.

You engage ordinary servants at ordinary wages. The Hall is quiet. You wake at five all the same.`; }},
    {t:'Draw a line at the green baize door: ship below stairs, house above.', go:() => { add({family:2, goodwill:1}); reg('henrietta',1);
      return `You draw the line at the green baize door. Below it, bells, pipes and lobscouse. Above it, silence until nine. Nobody is to say “aye aye” to a lady.

It holds.

In the kitchen Pascoe chalks a line down the flags. He does not speak across it. Nor does Mrs Bunce. The salt goes over by a housemaid.`; }}
  ]});

ev({ id:'press', from:1803, to:1811, weight:5, cond:() => T('captain') && !F('crewGone'), title:'A Lieutenant with a Warrant',
  text:() => `A press gang has come up the Kennet as far as Wyvern. Nobody in Wyvern has seen one before. There is a lieutenant, a midshipman of about twelve and eight hands with cudgels. They are quartered at the George.

Somebody has told them about Hatherley Hall. Eleven prime seamen, rated butler, footmen and gardeners. Not one has a protection in his pocket.

A note comes up from the George. The lieutenant presents his compliments. He will call tomorrow at ten. He trusts he will find your servants at home.`,
  choices:[
    {t:'Receive him in your old uniform, and ask to see his warrant.', go:() => { add({standing:3}); reg('henrietta',1);
      return `You receive him in the library in a post-captain’s full dress, both epaulettes. The coat fits. The waistcoat does not.

You read his warrant through. It runs to seafaring men found “upon the rivers and the coast”.

“Which of those is my library, sir?”

He is twenty-three. You were made post before he was breeched. He drinks one glass of Madeira standing. His gang is in Reading by dark.`; }},
    {t:'Put the Dryads in the ice-house till he has gone.', go:() => { const ice = F('icehouse'); add({goodwill:2, standing:-1});
      return ice ? `Eleven seamen go into the ice-house with a ham, a keg and a pack of cards. They are there two nights.

The lieutenant searches the Hall from the leads to the cellar. In the butler’s pantry he finds a cutlass. He does not find a butler.

He looks at you. You look at him. You both bow.

The Dryads come out blue. They have eleven shillings of the gunner’s.` : `There is no ice-house. You put them in the hay loft at Long Barrow.

The midshipman is twelve. He walks under the loft and looks up. A tarred pigtail hangs through a gap in the boards.

You speak to the lieutenant for twenty minutes, captain to lieutenant. He takes his gang away without them.

By noon it is all over Wyvern that the Squire hides deserters.`; }},
    {t:'Muster them and let any man volunteer who chooses.', go:() => { fl('crewGone'); add({standing:4, family:3}); reg('edmund',1);
      return `You muster them on the gravel.

“The King wants seamen. No man of mine shall be pressed. No man of mine shall be hindered.”

They look at their boots. Tarbuck steps forward. Then the gunner. Inside a minute all but old Pascoe have stepped forward. The lieutenant enters them as volunteers, with the bounty.

They march out behind him singing.

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

She has measured the wall between the windows. She has the measure in her hand.`,
    a:() => `It comes from London on the wagon in a deal case. Four men carry it in.

Kitty plays until eleven. She plays the same sonata nine times. On the tenth you know it.

Henrietta sits with her eyes shut. She is counting the Tamworths’ instruments. They have one.`,
    b:() => `You send to Reading for a man to mend the spinet. He is a day at it. Seventeen pounds, with new quills.

All the keys speak. Two of them speak the same note.

“It is very much better,” says Kitty. She plays with the lid down.`,
    c:() => `“The spinet did for my aunt.”

“Your aunt was deaf,” says Henrietta.

Kitty plays on the spinet after dinner. She plays loudest on the three dumb keys.`},
  {id:'henrietta-carpet', kind:'want', sum:40, x:() => `Henrietta has you stand in the drawing-room doorway and look at the carpet.

There is a path worn across it to the boards. It runs from the fire to the decanter and back.

“Your uncle,” she says. “Forty years. A Wilton would be forty pounds.”`,
    a:() => `The Wilton is laid on a Tuesday. Crimson, with a border of oak leaves.

Nobody is let walk on it for a week. A drugget is put down from the door to each chair.

The old carpet goes to the servants’ hall. They turn it round. The path now runs from the fire to the beer.`,
    b:() => `Henrietta has the old carpet taken up and turned end for end. A rug from the Wyvern sale goes over the worst of it. Twenty pounds.

The rug does not lie flat. Mr Tamworth falls over it at Christmas.

“We are getting a Wilton,” Henrietta tells him as he is helped up.`,
    c:() => `“It will see us out.”

She moves the sofa over the path. The sofa is now in the middle of the room, facing nothing.

It stays there. Callers walk round it.`},
  {id:'henrietta-chariot', kind:'want', sum:120, w:() => S.standing >= 35 && !(typeof held === 'function' && held('chariot')), x:() => `The Tamworths have a new landaulet. It is yellow, with the crest on both doors.

Henrietta saw it at church. She saw it again in Wyvern on Thursday.

“Our coach was built for your uncle in the year of the Gordon riots. The lining is his hair-powder. A chariot from Hatchett’s is a hundred and twenty.”`,
    a:() => `It comes down from Long Acre behind your own horses. Dark green. Very small arms on the door.

Henrietta drives to church in it. She drives the long way, by the Tamworths’ lodge.

Mrs Tamworth is at an upper window. Henrietta does not look up. She has seen her.`,
    b:() => `The old coach goes to the coach-maker at Newbury. New lining, new leather, the body painted. Sixty pounds.

It comes home dark green and shining. It still rolls as a ship does.

Henrietta arrives at the Lovedays’ pale and smiling.`,
    c:() => `“It has four wheels and a roof.”

She says no more. At church she waits in the porch until the Tamworths have driven off.

You hand her up into your uncle’s hair-powder.`},
  {id:'henrietta-mourning', kind:'want', sum:25, w:() => S.year === 1810 && S.season === 3 || S.year === 1811 && S.season === 0, x:() => `The Princess Amelia is dead at Windsor. She was twenty-seven. The Court goes into mourning and the county with it.

Black crape was two shillings a yard in Wyvern on Monday. It is four today.

“Twenty-five pounds would put the family and the upper servants in black,” says Henrietta. “The Castle has had its people in black since Sunday.”`,
    a:() => `The whole household is in black by Saturday, to the knife-boy. The footmen have crape on their arms and their hats.

On Sunday the Hall pew is one black row. Lord Cullerne looks along it from his own.

He inclines his head. It is the first time since harvest.`,
    b:() => `The family goes into black. The servants have a black ribbon each.

Mrs Bunce wears hers in her cap. She tells the kitchen it is for the Princess. She tells you it is for the pine-apples.`,
    c:() => `“We did not know the lady.”

Henrietta wears her grey. In Wyvern on Thursday she is the only gentlewoman in a colour.

Three ladies cross the market place to ask after her health.`},
  {id:'henrietta-portrait', kind:'want', sum:30, w:() => !(typeof held === 'function' && held('portraits')), x:() => `A travelling limner has put up at the Bell. He has painted the Tamworths, the Lovedays and the Lovedays’ horse.

“Thirty pounds for the two of us in oils, three-quarter length,” says Henrietta. “Half that for a head.”

She has seen the Lovedays. She says the horse is the best likeness.`,
    a:() => `You both sit to him for nine mornings. He talks the whole time about Sir Joshua.

The picture is hung over the dining-room chimney. Henrietta has a column behind her and a spaniel you never owned. You have your uncle’s nose.

Mrs Bunce is brought up to see it. She looks for some time.

“It’s the old master, sir. In your coat.”`,
    b:() => `Henrietta sits alone, for a head. Fifteen pounds.

He gives her pearls she has not got and takes away ten years.

She has it hung in her own dressing-room. She says it is not at all like.`,
    c:() => `“There is a looking-glass in the hall.”

The limner goes on to Hungerford. He leaves his card at the lodge.

Henrietta keeps the card in her work-box.`},
  {id:'henrietta-tea', kind:'want', sum:18, w:() => S.year >= 1797, x:() => `Tea is ten shillings the pound at Wyvern, and the grocer sands it.

Henrietta has a letter from Twining’s in the Strand. A chest of Hyson and a chest of Congou, eighteen pounds, by the Newbury wagon.

“Or there is a man at the back door on Thursdays,” she says. “He is cheaper. I have not asked him why.”`,
    a:() => `Two chests come by the wagon with Twining’s mark burnt into the lid. Henrietta has a lock put on the tea closet.

She keeps the key on her own ring. Mrs Bunce watches it go by.`,
    b:() => `You have the one chest, of Congou. Nine pounds.

The servants’ hall has it. The parlour has what the Thursday man brings.

His is the better tea.`,
    c:() => `“Sage tea was good enough for my uncle.”

Henrietta drinks sage tea for a week. She has it served to you as well.

On Thursday there is Hyson again. You do not ask.`},
  {id:'henrietta-gowns', kind:'want', sum:45, w:() => S.year <= 1801, x:() => `The fashion has changed. Waists are under the arms and there are no hoops.

Henrietta lays nine gowns across the bed. Not one can be worn.

“Forty-five pounds at the mantua-maker’s in Reading. Or I must go to the Assembly as my own mother.”`,
    a:() => `Six new gowns come home in a deal box. White muslin, mostly. They weigh nothing.

Henrietta comes down in the first. You can see the shape of both her knees.

“It is what is worn,” she says. She takes a shawl.`,
    b:() => `The Reading woman cuts down four of the old gowns. Twenty-two pounds.

The brocade will not hang. It was made to stand out upon a hoop. It stands out.

At the Assembly Henrietta keeps her back to the wall.`,
    c:() => `“Hoops will come in again.”

She wears the grey brocade to the Wyvern Assembly. It takes up two chairs.

Mrs Tamworth tells her that it is delightful to see the old fashions kept up.`},

  {id:'henrietta-margravine', kind:'matter', w:() => S.year >= 1806 && S.year <= 1807, x:() => `The Margrave of Anspach is dead at Benham Park. He sold his country to the King of Prussia and came to live outside Newbury.

His widow was Lady Craven. She married him sixteen days after Lord Craven died. The Queen will not receive her.

“She is nine miles off and in mourning,” says Henrietta. “Does one call?”`,
    a:() => `Henrietta calls. She is an hour at Benham.

“She received me on a sofa with a turban on. She has written a play. She read me the second act.”

She says nothing against her. She asks Kitty for the atlas and looks for Anspach.`,
    b:() => `“You know better than I.”

Henrietta leaves her card at the lodge and does not go in. It is the usual course.

A card comes back within the week. It has a coronet on it with nine points. Henrietta counts them.`,
    c:() => `“Not while the Queen will not.”

Henrietta stays at home. Mrs Tamworth calls at Benham on Thursday.

She has a great deal to tell. She tells it at your table.`},
  {id:'henrietta-housemaid', kind:'matter', x:() => `The second housemaid has been found in the linen closet with the under-footman. It was three in the afternoon.

“Sarah is nineteen and can get up fine linen,” says Henrietta. “Thomas is the only footman tall enough for the back of the coach. Mrs Bunce wishes both turned off before supper.”

She waits.`,
    a:() => `“Marry them.”

The banns are read. They have the room over the laundry.

Sarah gets up your shirts as before. In May she lets out her apron. Mrs Bunce counts on her fingers.`,
    b:() => `“It is your household.”

Henrietta sends Sarah home to her mother at Kintbury for a month. Thomas is spoken to.

The linen closet has a new lock. Mrs Bunce keeps the key.`,
    c:() => `Both are turned off without a character.

The new footman is five foot four. Behind the coach he cannot reach the strap.

Henrietta irons her own lace for a fortnight.`},
  {id:'henrietta-bunce', kind:'matter', x:() => `Mrs Bunce has given a month’s notice. She has been cook at the Hall twenty-six years.

“It is the new kitchen-maid,” says Henrietta. “She told Mrs Bunce that at Lord Cullerne’s they do not boil a pudding in the same cloth twice.”

Mrs Bunce can be heard in the passage. She is not crying. She is moving saucepans.`,
    a:() => `You go down to the kitchen yourself. You have not been in it since Christmas.

“Mrs Bunce, I had a pudding at the Castle. It was not so good as yours.”

She looks at you a long time. “No, sir. It wouldn’t be.” The notice is not mentioned again.`,
    b:() => `“You will manage it.”

Henrietta manages it. The kitchen-maid goes to the dairy. Mrs Bunce has two pounds a year more.

There is a pudding on Sunday the size of a hassock.`,
    c:() => `“Let her go if she wishes.”

Mrs Bunce does not go. She tells the household what you said.

The mutton is underdone for a fortnight.`},
  {id:'henrietta-preacher', kind:'matter', w:() => S.year >= 1798, x:() => `There is a Methodist preaching in Dewey’s barn on Sunday evenings. He is a shoemaker from Hungerford.

“Forty of the people were there last Sunday,” says Henrietta. “Eleven were in church. ${F('gallDead') ? 'The Vicar' : 'Dr Gall'} wishes you to send the constable.”

Two of your own housemaids went. They asked leave first.`,
    a:() => `You let him preach. You go once, and stand at the back.

He speaks for an hour without a paper. Nobody sleeps. A carter cries.

“Well?” says Henrietta. You say that the singing was very loud.`,
    b:() => `“Ask the housemaids what he said.”

Henrietta asks. He said that the rich man shall hardly enter the kingdom.

“He said it very civil, ma’am,” the girl tells her. “He said we was to pray for you.”`,
    c:() => `The constable is sent to the barn. The shoemaker shows him a licence under the Toleration Act.

The constable cannot read it. He comes away.

Next Sunday there are sixty in the barn.`},
  {id:'henrietta-mother', kind:'matter', x:() => `Henrietta’s mother proposes herself for six weeks. She is seventy-three.

She travels with a maid, a parrot and her own sheets. She will not sleep in a room that faces east.

“${T('portion') ? 'It was her money that mended the roof' : T('lovematch') ? 'She has never said you were a mistake. Not in words' : 'She asks after you in every letter'},” says Henrietta.`,
    a:() => `She comes for six weeks. She has the blue room, which faces west.

The parrot says “Henrietta, sit up” in her voice. It says it at breakfast.

She stays nine weeks. On the last morning she tells you that you have improved.`,
    b:() => `“For as long as you like, my dear.”

Henrietta writes for a month, not six weeks. Her mother comes for a month.

The parrot bites Mudge. Mudge has a shilling for it.`,
    c:() => `“The chimneys are being swept.”

Henrietta writes that the chimneys are being swept. Her mother replies that they were being swept last year.

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
  {id:'kitty-library', kind:'matter', w:() => kittyAtHome(), x:() => `There is a circulating library opened at the stationer’s in Wyvern. A guinea a year. Two volumes at a time.

Kitty has the printed catalogue. She has put a pencil cross against forty-one titles.

“Novels,” says Henrietta. “Every one. There is a thing here called The Monk.”`,
    a:() => `Kitty has her guinea. The carrier brings two volumes each Thursday and takes two back.

She reads at breakfast with the book against the urn. Henrietta takes up a volume to see what is in it.

Henrietta is not seen until dinner.`,
    b:() => `You read the catalogue through with her. You strike out The Monk. She puts it in again under another name.

You let it stand. You were not sure of the other name.`,
    c:() => `“There are four hundred books in this house.”

“Three hundred are sermons,” says Kitty. “I have read the sermons.”

She begins on the sermons again. She reads them aloud at tea.`},
  {id:'kitty-walks', kind:'matter', w:() => kittyAtHome(), x:() => `Kitty walks to the far cottages three days a week, alone. She reads to an old woman there who is blind.

“Four miles, in pattens, with no servant,” says Henrietta. “Mrs Tamworth saw her on the Kintbury lane. She was climbing a gate.”

Kitty says the gate was locked.`,
    a:() => `“Let her walk.”

Kitty walks. In a month she knows which cottages have a fire and which have none. She tells you at dinner.

It is a longer list than ${F('crabbeGone') ? 'Lark' : 'Crabbe'} keeps.`,
    b:() => `You walk with her on the Thursday. Four miles out. The old woman knows your step from your uncle’s.

“You come down heavier on the left, sir. He come down on the right.”

Four miles back. Kitty climbs the gate. You go round.`,
    c:() => `A groom is to follow her at twenty yards.

She walks faster. The groom is fifty. In a week he asks to be put back in the stable.

Kitty goes on Thursdays in the gig. She sits very straight and looks at nothing.`},
  {id:'kitty-latin', kind:'matter', w:() => kittyAtHome() && kittyAge() <= 26, x:() => `Kitty has Edmund’s old Latin grammar. She has got as far as the third declension without help.

“I should like the curate to hear me twice a week, sir. He has offered.”

Henrietta puts down her work. “A girl who has Latin has it instead of a husband.”`,
    a:() => `The curate comes on Tuesdays and Fridays. They sit in the library with the door open.

By midsummer she is in Virgil. She construes forty lines at dinner for the Bishop’s chaplain.

He corrects one word. She shows him the place. He was wrong.`,
    b:() => `You hear her yourself. You have not opened a grammar since Winchester.

In three weeks she is hearing you. She is patient. She gives you the same verb four evenings running.`,
    c:() => `“Your mother is right.”

The grammar goes back on Edmund’s shelf. A month later you take down the Horace beside it.

It is full of pencil. It is not Edmund’s hand.`},
  {id:'kitty-assembly', kind:'matter', w:() => kittyAtHome() && kittyAge() >= 21, x:() => `It is the night of the Wyvern Assembly. Kitty comes down in her old green.

“I have danced with the same nine men for ${kittyAge() - 17} winters, Mamma. I know what each will say at the bottom of the set. Might I stay at home?”

The coach is at the door. Henrietta has her gloves on.`,
    a:() => `Kitty stays at home with a candle and the dog.

At the Assembly nine gentlemen ask after her. Each says the thing she said he would.

Henrietta tells her so at breakfast. They both laugh. It is a long time since they did.`,
    b:() => `“Come for an hour, and you shall name the hour.”

She comes. At ten she looks at you. You call the coach.

Going home she says, “That was fair, sir.” She has danced twice.`,
    c:() => `“You will go.”

She goes. She dances every dance. She smiles the whole evening at the wall.

Mr Loveday’s nephew says she is the most agreeable girl in the room. She has not heard a word he said.`},
  {id:'kitty-danes', kind:'matter', w:() => kittyAtHome() && S.year >= 1808 && S.year <= 1813, x:() => `There are three hundred Danish officers on parole at Reading. They were taken with their ships at Copenhagen.

Kitty has it from the laundry-maid. On Thursdays the young ones give a dance in a cellar. Their washerwomen’s daughters come. A washerwoman sits by the door for propriety.

“What do they dance, sir?” says Kitty at dinner. “Is it true the punch is mostly water?”`,
    a:() => `You tell her what you know. It is not much. You drive her into Reading on the Saturday.

Two Danes are walking by the Kennet in blue coats. They take off their hats to her. One has a book.

“They look like curates,” says Kitty. She is disappointed.`,
    b:() => `“Ask your mother.”

Henrietta says that Danes are Lutherans and that will do. Kitty asks what Lutherans dance.

Nobody at the table knows.`,
    c:() => `“That is not a subject for the dinner-table.”

“No, sir.”

She has the rest from the laundry-maid by Friday. It is a great deal more than you knew.`},
  {id:'kitty-telescope', kind:'want', sum:12, w:() => kittyAtHome() && S.year === 1811, x:() => `There is a comet. It stands over the stable clock every evening with a tail as long as your arm.

Kitty has been on the leads three nights with your spy-glass.

“Mr Dollond has a two-foot achromatic telescope on a brass stand. Twelve pounds. One could see the head of it, sir. One could draw it.”`,
    a:() => `It comes from St Paul’s Churchyard in a mahogany box. She has it on the leads the same night.

At eleven she sends down for you. You look. The comet has a bright head and a dark place behind it.

“Nobody knows what that is,” she says. She is very pleased that nobody knows.`,
    b:() => `You send your spy-glass to Reading to have a new object-glass. Six pounds.

It shows the comet rather larger and with a green edge. Kitty draws it without the green edge.

She writes “instrument imperfect” under the drawing.`,
    c:() => `“It can be seen very well without.”

She draws it from the leads with the naked eye, every clear night for nine weeks.

Henrietta finds the drawings. She says they would make a pretty screen.`},
  /* Mrs Vane */
  {id:'kitty-vane-bailiff', kind:'want', sum:60, w:() => K() === 'vane' && !F('vaneGone'), x:() => `A letter from Kitty. It is dated from lodgings in ${['Sunderland', 'Colchester', 'Weymouth'][S.t % 3]}.

“My dear Papa, The Captain has had a misfortune at cards. There is a bailiff sitting in the passage. He is a very civil man. I have given him tea. He says sixty pounds would take him out of the house, and that he has known cases a great deal worse. I am quite well.”`,
    a:() => `You send the sixty pounds to Kitty by name.

She writes that the bailiff shook hands on leaving. The Captain has promised her never to touch a card. He has promised it in writing.

She encloses the writing. She asks you to keep it for her.`,
    b:() => `You send thirty pounds and write to the Captain’s Colonel.

The Colonel does not answer. The bailiff takes the thirty and the Captain’s second-best saddle.

“We are a little lighter,” Kitty writes. “It was the Captain’s saddle.”`,
    c:() => `You write that she made her bed.

There is no answer for a quarter. Then four lines. They have moved. She does not say where from.

The direction is care of a pastry-cook.`},
  {id:'kitty-vane-march', kind:'news', w:() => K() === 'vane' && !F('vaneGone'), x:() => `A letter from Kitty.

“My dear Papa, The Regiment has marched again. This is my eleventh lodging. I can pack everything we own in forty minutes. The Captain is on the recruiting service and is a great success at fairs. I have learnt to make a pudding without eggs and a fire without coals. ${F('kittySettled') ? 'The forty pounds came at Lady Day. I have not told him which day it comes.' : 'Do not send money to him. If you send any, send it to me.'}”`},
  {id:'kitty-vane-child', kind:'news', w:() => K() === 'vane' && S.year >= 1800 && !F('vaneGone') && !F('kittyDoor'), x:() => `A letter from Kitty.

“My dear Papa, You have a grandson. He was born on Tuesday in a room over a saddler’s. The Captain was at Newmarket. The Surgeon of the Regiment came, and the Colonel’s lady sent a fowl. He is to be Edmund Barnaby. He has your uncle’s nose. I looked for anybody else’s and could not find it.”`},
  /* Mrs Pinch */
  {id:'kitty-clifton', kind:'news', w:() => K() === 'pinch' && !F('kittyWidow'), x:() => `A letter from Kitty, on thick paper, sealed with a crest. The crest is new.

“My dear Papa, We have eleven servants and I am not allowed to speak to nine of them. Mr Pinch reads the price of sugar aloud at breakfast. Then he reads it again from the other paper. We dine at five with gentlemen in the African trade. I have a carriage. I may drive on the Downs between two and four.”`},
  {id:'kitty-clifton-black', kind:'news', w:() => K() === 'pinch' && !F('kittyWidow'), x:() => `A letter from Kitty.

“My dear Papa, There is a black boy in the house named Scipio. He is twelve. He hands the coffee in a silver collar. I asked Mr Pinch what he was paid. Mr Pinch laughed until he coughed. I have begun to teach Scipio his letters in the still-room. He had A to K in a week. Pray do not mention it if you write to my husband.”`},
  {id:'kitty-widow', kind:'news', w:() => F('kittyWidow') && !F('kittyManumit'), x:() => `A letter from Kitty, with a black edge.

“My dear Papa, I have let the house at Clifton and taken a smaller. I keep four servants and speak to all of them. The attorneys send me accounts from Bristol each quarter with the hogsheads set down in one column and the people in the next. I sign where the pencil cross is. I have a garden. Nothing in it comes from farther off than Somerset.”`},
  {id:'kitty-manumit', kind:'news', w:() => F('kittyManumit'), x:() => `A letter from Kitty.

“My dear Papa, The agent writes from Jamaica. Of three hundred and four persons, two hundred and sixty have taken their papers. The rest are old and asked what they were to eat. I have settled a provision ground on each. The agent says I am ruined and he has resigned. I am not ruined. I have two hundred a year, which is what a rector has. The ladies of Clifton cross the road.”`},
  /* Mrs Oakes */
  {id:'kitty-oakes-mangle', kind:'news', w:() => K() === 'oakes', x:() => `Kitty walks up from ${F('oakesVicar') ? 'the Vicarage' : 'the curate’s house'} with a child on each hand and a basket.

She has come to borrow the Hall mangle. Theirs has broken a roller. There are four surplices in the basket and a great many small shirts.

“Mr Oakes sends his duty, sir. He is writing a sermon and minding the baby. He does both with the one hand.”`},
  {id:'kitty-oakes-pew', kind:'news', w:() => K() === 'oakes', x:() => `Sunday. Kitty sits in the ${F('oakesVicar') ? 'Vicarage' : 'curate’s'} pew under the pulpit. There are ${Math.min(5, Math.max(1, Math.floor((S.year - 1800) / 2)))} children in it with her.

The smallest gets out during the Litany. He walks up the aisle to the Hall pew and holds up his arms.

Henrietta lifts him in. He sleeps through the sermon on her muff. It is his father’s sermon.`},
  /* Madame Dubreuil */
  {id:'kitty-reading-parole', kind:'news', w:() => K() === 'dubreuil' && S.year <= 1813, x:() => `A letter from Kitty, from Reading.

“My dear Papa, We have two rooms in Friar Street. The Lieutenant may walk one mile out on the turnpike and must be indoors at five. I may walk where I please, so I walk the mile with him and then one more by myself to say I did. He has ten shillings and sixpence a week from the Agent. He teaches French to an attorney’s daughters and I teach him to say ‘th’. Neither of us makes much progress.”`},
  {id:'kitty-stmalo', kind:'news', w:() => K() === 'dubreuil' && S.year >= 1814, x:() => `A letter from Kitty. It has the French King’s head on the postmark.

“My dear Papa, We are at Saint-Malo. The house is granite and has been in the family since a Dubreuil took a ship from the English in 1693. They have told me which ship. My husband’s mother speaks no English and I have not French enough to be rude in. We get on. There are eleven hives. The bees are very like Berkshire bees and do not seem to know that they are French.”`}
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
        `You write two sides. You tell her the orchard has blown down in part and that the dog looks for her on the stairs.

Her answer comes in a week. It is four sides, crossed. She has asked nine questions about the dog.`,
        `You write on Sunday evening. You find you have covered a sheet before you come to any news.

She writes back that she read it standing in the passage and then sat down and read it again.`,
        `You write. You do not give advice. It takes three drafts to leave it out.

“My dear Papa,” she answers, “I had your letter. I noticed what was not in it. Thank you.”`]); }},
    {t:'Send twenty pounds for her own purse.', note:'£20', if:() => kitNow().kind === 'news', go:() => { add({money:-20, family:1}); reg('kitty',1);
      return pick([
        `You send a twenty-pound note in a letter to her alone.

She writes that she has sewn it into her stays. It is to stay there against a rainy day. She says there are a good many where she is.`,
        `Twenty pounds, in her own name.

She has bought a pair of boots, a ream of paper and a lock for her writing-desk. She tells you the price of each. There is eleven pounds over, and she tells you where it is hidden.`]); }},
    {t:'Let Henrietta answer.', if:() => kitNow().kind === 'news', go:() => { reg('henrietta',1);
      return pick([
        `Henrietta writes nine sides. She sends a receipt for a cough, a pattern for a cap and her love.

She puts “and your father’s” after the love. She shows you that she has.`,
        `Henrietta answers the same night. She writes with the door shut.

A parcel goes with the letter. You are not told what is in it. It is the shape of a ham.`]); }}
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
  {id:'member-maiden', once:true, title:'The Wyvern Turnpike Bill', x:() => `The Wyvern Turnpike Bill is down for Tuesday. It is your bill. You have not yet opened your mouth in the House.

Forty Members are present. Eleven are asleep. One is peeling an orange into his hat.

The speech is in your pocket. It is nine minutes long. Henrietta has heard it four times.`,
    o:[{t:'Rise and speak.', go:() => { add({standing:2}); reg('henrietta',1);
      return `You rise. The Speaker calls your name. You had not known he had it.

You speak for six minutes. You leave out the middle. A Member behind you says “Hear” once, in his sleep.

The bill is read a second time. The Mercury gives you four lines. Henrietta cuts them out.`; }},
    {t:'Read it from the paper.', go:() => { add({goodwill:1});
      return `You take out the paper. There is a cry of “Order”. A Member may not read his speech.

You put the paper in your hat. You hold the hat before you and address it for nine minutes.

“The honourable gentleman has an eloquent hatter,” says somebody opposite. The bill is read a second time.`; }},
    {t:'Move it without a word.', go:() => { add({standing:-1});
      return `You rise. You bow. You say “I beg to move”. You sit down.

It takes four seconds. The bill is read a second time.

An old Member for a Cornish borough leans across and shakes your hand. He has sat thirty years. He has never said more.`; }}]},

  {id:'member-franks', title:'Free of Postage', x:() => `A Member’s letters go free. He writes his name and the date on the cover with his own hand. He may send ten a day.

The county has found it out. There are forty-three covers on the hall table, waiting for your name. ${vicar()} has sent nine. Mrs Tamworth has sent six, for her sister at Bath. One is from a man in Wyvern you have never met. He has enclosed a second cover for the answer.

Postage to Bath is eightpence.`,
    o:[{t:'Sign them all.', go:() => { add({goodwill:2, standing:1});
      return `You sign forty-three covers. You date them over five days to keep within the law.

Your wrist aches. By Saturday there are fifty more on the table.

Mrs Tamworth’s sister writes back, free. She thanks Mrs Tamworth for the pattern. She says the Member writes a clerk’s hand.`; }},
    {t:'Sign for the household and the parish.', go:() => { add({family:1, goodwill:-1});
      return `You sign for Henrietta and for ${vicar().replace('The', 'the')}. The rest go back.

Mrs Tamworth pays her eightpence for Bath. She pays it over the counter at Wyvern in coppers. She tells the shop what it is for.

The man you never met writes again. This time he pays. He calls you a placeman.`; }},
    {t:'Let Mudge sign them. He has your hand.', go:() => { add({goodwill:-2});
      return `Mudge can write your name. He has done it on game tickets these ten years.

He signs the forty-three in an evening in the gun room. He spells the month his own way.

The postmaster at Wyvern charges every one. Forty-three people pay eightpence for a letter with your name on it.`; }}]},

  {id:'member-place', title:'A Place in the Customs', x:() => `Mr Dodd holds a burgage plot in Pig Lane. He polled for you. He is in the library with his hat on his knee.

His son William is twenty-two and writes a fair hand. A tide-waiter’s place is vacant at Bristol. Forty pounds a year, and what the ships give.

“A word from the Member, sir. That is all a Treasury wants.”

The Treasury keeps a book of such words.`,
    o:[{t:'Ask the Treasury.', go:() => { add({goodwill:2, standing:-1});
      return `You write to the Secretary of the Treasury. He answers within the week. William Dodd is appointed.

In March a note comes on the morning of a division. “Mr ${S.sur} will be in his place tonight.” It is not put as a question.

You are in your place. You vote for a duty on dogs.`; }},
    {t:'Give the boy a stool in the estate office.', note:'£40', go:() => { add({money:-40, goodwill:1});
      return `William Dodd has a stool in the estate office at forty pounds. ${stew()} sets him to copy the tithe accounts.

He copies them fair. He finds eleven pounds that ${stew()} had not found.

${stew()} gives him the game book next. Nobody has ever found anything in the game book.`; }},
    {t:'Tell Dodd you ask nothing of Ministers.', go:() => { add({goodwill:-2, standing:1});
      return `“I am an independent man, Mr Dodd. I ask for nothing.”

Dodd looks into his hat. He says his father polled forty years for the old Earl and never came away from the Castle empty-handed.

William goes for a soldier at Michaelmas. Mr Dodd tells Pig Lane what the bounty was.`; }}]},

  {id:'member-whip', title:'A Note from Downing Street', x:() => `A note from Downing Street, by express. The express has cost them eleven shillings.

“Mr ${S.sur}’s attendance is most earnestly requested on Thursday. A division of the first importance.”

The word earnestly is underlined three times. It is the week of ${['the lambing', 'the hay', 'the harvest', 'the rent audit'][S.season]}. London is fifty-eight miles.`,
    o:[{t:'Go up and vote with Ministers.', note:'£4 in chaises', go:() => { add({money:-4, standing:2});
      return `You post up on Wednesday. Four pounds in chaises.

The division is at three in the morning. You walk through the lobby with two hundred and nine others. At breakfast you read in the Chronicle what the question was.

The Secretary of the Treasury nods to you on the stairs. He has your name right.`; }},
    {t:'Go up and vote against them.', note:'£4 in chaises', go:() => { add({money:-4, goodwill:2, standing:-1});
      return `You post up on Wednesday. You sit eleven hours.

You go out with the Noes. There are sixty-one. Mr Whitbread counts you twice.

No more notes come from Downing Street that session. The postmaster at Wyvern asks whether you are unwell.`; }},
    {t:'Stay at Hatherley.', go:() => { add({standing:-1, family:1});
      return `You stay.

Ministers carry it by forty. The Courier prints a list of Members absent. You are between a man with the gout and a man who is dead.

${['The last ewe lambs on Thursday night. She has twins.', 'The hay is carried on Thursday, dry.', 'The last load comes down the lane on Thursday.', 'The tenants pay on Thursday. Two pay in full.'][S.season]}`; }}]},

  {id:'member-committee', title:'Committee Room Nine', x:() => `You are named to the committee on the Calder and Hebble Navigation Bill. It sits upstairs at eleven each morning.

You have never seen the Calder. Nor has the chairman. Counsel for the bill has spoken three days. Counsel against has a map twelve feet long. He has not begun.

The room has one window. It does not open.`,
    o:[{t:'Sit it out.', go:() => { add({standing:1, family:-1});
      return `You sit nineteen mornings. You learn the fall of the Calder at eleven locks, in feet and inches.

The committee divides. Four for the bill, three against. You are one of the four. You could not say why.

A Yorkshire Member presses your hand in the lobby. At Christmas a piece of blue broadcloth comes from Halifax.`; }},
    {t:'Pair with a Member on the other side and go home.', go:() => { add({family:1});
      return `Sir John Trelawny is against the bill and wishes to fish. You are for it and wish to go home. You pair. Neither vote is counted.

You are at Hatherley by Friday. The bill passes without the two of you.

He sends you a salmon in a rush basket. You send him a hare.`; }},
    {t:'Sign the report unread.', go:() => { add({standing:-1});
      return `The clerk brings the report to Half Moon Street. It is ninety pages. He shows you where to sign.

In August a mill-owner writes from Brighouse. The new cut has taken his water. He has your signature before him as he writes.

It is a long letter. He writes again in September. He writes in October.`; }}]},

  {id:'member-petition', title:'The Maltsters of Wyvern', x:() => `Eleven maltsters of Wyvern have signed a petition against the malt duty. It is on parchment and begins “Humbly sheweth”.

Mr Gabb is the oldest of them. He brings it to the Hall himself, wrapped in a clean shirt.

“We should wish it read out, sir. All of it. With the names.”

It is four feet long.`,
    o:[{t:'Present it and speak to it.', go:() => { add({goodwill:3});
      return `You present it on a Friday. You say that the maltsters of Wyvern are loyal men and cannot pay.

The Chancellor of the Exchequer is sorry to hear it. The petition is ordered to lie upon the table.

It lies there. The duty goes up a shilling in the Budget. The maltsters send you a cask of old ale notwithstanding.`; }},
    {t:'Drop it in the bag behind the Chair.', go:() => { add({goodwill:1});
      return `There is a bag behind the Speaker’s chair for petitions. You put it in the bag.

The Votes print one line. “A Petition of Maltsters of Wyvern was presented.”

Mr Gabb has the line framed. It hangs over his kiln.`; }},
    {t:'Tell them the duty pays for the war.', go:() => { add({standing:1, goodwill:-2});
      return `“The King’s ships are built out of the malt duty, Mr Gabb.”

Mr Gabb wraps the parchment in the shirt again. He says his malt was thought good enough for the fleet at the Nore.

The Member for Abingdon takes the petition up. He reads out all the names.`; }}]},

  {id:'member-bellamy', title:'A Hundred Irish Members', w:() => yr(1801, 1805), x:() => `The Irish Members are come over under the Union. There are a hundred of them. No bench has been added.

A seat is kept by leaving a hat on it at prayers. By four o’clock there is a hat on every place and gentlemen are walking about bareheaded.

Yours was moved on Tuesday. It was found in the gallery. A Member for Tipperary was sitting where it had been.`,
    o:[{t:'Come down for prayers and sit on your hat.', go:() => { add({standing:1});
      return `You are in the House at prayers every day for a month. You hear the Chaplain twenty-two times.

No other Member for the county has heard him once. The Speaker remarks your attendance to the Serjeant.

The Member for Tipperary takes the place beside you. He has a snuff-box the size of a brick. You have the use of it.`; }},
    {t:'Have it out with the Irishman.', go:() => { add({goodwill:1});
      return `“Sir, you are in my place.”

“Sir, I am in Parliament. They told me it was all the one place.”

He moves up six inches. You sit on six inches for the session. He calls you his honourable neighbour and borrows your Order Paper.`; }},
    {t:'Spend the evenings at Bellamy’s.', note:'£9', go:() => { add({money:-9});
      return `Bellamy keeps the kitchen upstairs. A chop off the gridiron, a pint of port, and the division bell over the door.

You dine there nineteen nights. When the bell rings you go down and ask your neighbour which way.

The reckoning at the end of the session is nine pounds. Bellamy says Mr Pitt owes him more.`; }}]},

  {id:'member-bull', hot:true, title:'The Bull-Baiting Bill', w:() => yr(1800, 1802), x:() => `A bill is brought in to put down bull-baiting. Mr Windham will speak against it. He says the bait is the poor man’s one sport. He says the bull enjoys it.

Wyvern baits a bull in the market place every fifth of November. The butchers find the bull. The dog that pins him wears a silver collar for the year. The collar is older than the Town Hall.

There are letters. ${vicar()} writes that it is a scene of drunkenness. Four of the butchers hold plots.`,
    o:[{t:'Vote for the bill.', go:() => { add({goodwill:-2}); reg('gall',1);
      return `You vote for the bill. It is lost by two.

Mr Windham crosses the floor to tell you that you have voted with the Methodists.

On the fifth of November the bull is baited as before. The butchers have named him. ${(S.sur || '').toUpperCase()} is painted on his flank in whitewash.`; }},
    {t:'Vote with Mr Windham.', go:() => { add({goodwill:2}); reg('gall',-1);
      return `The bill is thrown out by two. One of the two is yours.

The butchers drink the Member’s health. ${vicar()} preaches on the merciful man and his beast. He looks over the Hall pew and not at it.

In November the bull puts the collar dog through the window of the Bell.`; }},
    {t:'Be in the country that night.', go:() => { add({standing:-1});
      return `You are at Hatherley on the night. The bill is lost by two.

Both sides write to ask where you were. ${vicar()} writes two sheets. The butchers write one line.

You go into Wyvern on the fifth of November and stand at the back. A butcher asks which side you have come to see.`; }}]},

  {id:'member-melville', hot:true, once:true, title:'Lord Melville', w:() => S.year === 1805, x:() => `Mr Whitbread moves to censure Lord Melville. As Treasurer of the Navy he let his paymaster keep the seamen’s money at Coutts’s and play with it. Lord Melville is Mr Pitt’s oldest friend.

The House sits until past four in the morning. The candles are changed twice.

The Treasury has counted. So has Mr Whitbread. Neither will say what he makes it. Both have looked twice at the Member for Wyvern.`,
    o:[{t:'Vote for the censure.', go:() => { add({goodwill:2, standing:-1});
      return `You go out with the Ayes. The tellers come to the table. Two hundred and sixteen each side.

The Speaker sits ten minutes without a word. His face is the colour of his wig. He gives his voice for the censure.

Mr Pitt pulls his little cocked hat down over his eyes. The young men of his side stand close round him and walk him out. Behind you a Welsh baronet gives a view-halloo.`; }},
    {t:'Vote with Mr Pitt.', go:() => { add({standing:2, goodwill:-1});
      return `You stay in with the Noes. The tellers come to the table. Two hundred and sixteen each side.

The Speaker sits ten minutes without a word. He gives his voice against Lord Melville.

Mr Pitt pulls his hat down over his eyes. You are four feet from him. There are tears running out under the brim. Going out, he thanks you by another man’s name.`; }},
    {t:'Go home to bed.', go:() => { add({standing:-2});
      return `You leave at two and walk to Half Moon Street.

The Chronicle has it at breakfast. Two hundred and sixteen each side. The Speaker gave it against Lord Melville. Mr Pitt wept.

On Saturday the Reading Mercury gives the list. Your name is in italics under “Not in the House.”`; }}]},

  {id:'member-register', title:'The Dumb Members', w:() => S.year >= 1804, x:() => `Mr Cobbett’s Register has a list this week. It is headed “Gentlemen who have sat a whole Session and said Nothing.”

There are a hundred and forty names, by counties. Berkshire is near the top.

“WYVERN. Mr ${S.sur}. Is believed to be alive.”

Mrs Tamworth has sent the copy over. She does not take the Register herself.`,
    o:[{t:'Make a speech.', go:() => { add({standing:1});
      return `You speak on Thursday against the hop duty. Eleven minutes.

The Register notices it. “Mr ${S.sur} of Wyvern has spoken. He is against a duty on hops. We preferred him dead.”

Henrietta sends that number to Mrs Tamworth.`; }},
    {t:'Write to the Register.', go:() => { add({goodwill:-1, standing:-1});
      return `You write that a Member may serve his constituents without troubling the House.

Mr Cobbett prints the letter entire. He prints nine columns in answer. He has found out what a burgage plot fetches in Wyvern and what was spent at the George.

The sum is right to the pound.`; }},
    {t:'Say nothing.', go:() => {
      return `You say nothing.

The list is printed again next session. A hundred and thirty-one names are still on it. Yours is one.

Mr Cobbett has kept the line about being alive.`; }}]},

  {id:'member-schools', hot:true, title:'Mr Whitbread’s Schools', w:() => yr(1807, 1808), x:() => `Mr Whitbread has a bill for a school in every parish. Two years of reading and writing for every poor child, out of the rates.

Mr Giddy speaks against it. Learning would teach the labouring classes to despise their lot. They would read seditious pamphlets. They would be insolent to their masters.

Hatherley has a dame school. Widow Pocock keeps it in her kitchen at twopence a week. She can read. She cannot write.`,
    o:[{t:'Vote for the schools.', go:() => { add({goodwill:2});
      return `You vote for it. The bill goes up to the Lords.

The Archbishop says it takes the children out of the hands of the Church. The Lords throw it out.

Widow Pocock hears that the Squire voted for schools. She puts her charge up to threepence.`; }},
    {t:'Vote with Mr Giddy.', go:() => { add({standing:1, goodwill:-2});
      return `You vote against. The bill passes without you and dies in the Lords.

In the autumn a paper is nailed to the church door. It concerns the price of bread. It is very ill spelt.

Mr ${stew()} names four men in the parish who can write. He is one of them.`; }},
    {t:'Stay away, and give the dame ten pounds for slates.', note:'£10', go:() => { add({money:-10, goodwill:3});
      return `Ten pounds to Widow Pocock. Slates, pencils, and a writing-master out from Wyvern on Saturdays.

The writing-master begins with the Widow. In a month she can write her name.

At Christmas a letter comes from the school. Nineteen children have signed it. So has Ann Pocock. Hers is the largest.`; }}]},

  {id:'member-curwen', hot:true, title:'Mr Curwen’s Bill', w:() => yr(1809, 1810), x:() => `Mr Curwen has a bill to stop the sale of seats in Parliament. A Member is to swear that he gave no money for his return.

The House is very full for it. Nobody looks at anybody.

Your own return for Wyvern cost nine hundred pounds${(S.mpWins || 1) > 1 ? ', and seven hundred each time since' : ''}. Tidmarsh’s bank has the drafts. The landlord of the George has a ledger.`,
    o:[{t:'Vote for the bill.', go:() => { add({standing:1});
      return `You vote for purity of election. So do two hundred others. You know what eleven of them paid.

The bill passes. It forbids a seat to be bought with money. It is silent upon beer, ribbons and dinners.

The landlord of the George reads it through at his own bar. He orders in forty barrels.`; }},
    {t:'Vote against it.', go:() => { add({goodwill:-2});
      return `You vote against. In the lobby you say that a seat is property like any other.

On Saturday Sir Francis Burdett repeats it to a crowd in Palace Yard. He does not name you. He says “a Berkshire squire”.

There are four Berkshire squires in the House. All four are asked about it at Sessions.`; }},
    {t:'Buy the ledger from the George.', note:'£20', go:() => { add({money:-20});
      return `The landlord brings the ledger to the Hall under his coat. Twenty pounds.

You read it with the door locked. Beer. Ribbons. Chairmen. “To Mr Dodd, for his trouble, 30 guineas.” “To a person, 50l.”

It goes on the library fire a leaf at a time. The landlord walks home whistling. He did not say whether he keeps a copy.`; }}]},

  {id:'member-burdett', hot:true, once:true, title:'Burdett for Ever', w:() => S.year === 1810, x:() => `The House has voted Sir Francis Burdett to the Tower for a libel upon itself. He will not go. He has barred the door of 78 Piccadilly.

Half Moon Street is forty yards off. There is a crowd from the Green Park to Hyde Park Corner. Every man who passes must take off his hat and cry “Burdett for ever”. Windows not lit after dark are broken.

You voted on Thursday night. The landlady asks which way. She will decide about the candles when she knows.`,
    o:[{t:'For the Tower. No candles.', note:'£9', go:() => { add({money:-9, standing:2, goodwill:-2});
      return `You voted for the Tower. The windows stay dark.

At ten a paving-stone comes through the parlour sash. Eleven more follow it. The landlady sits on the stairs with the plate basket in her lap.

On Monday the Life Guards clear Piccadilly with the flat of the sword. The Serjeant gets in by the area and takes Sir Francis away in a coach. The glazier’s bill is nine pounds.`; }},
    {t:'Against. Light every window.', go:() => { add({goodwill:2, standing:-1});
      return `You voted against. The landlady puts two candles in every window, front and back.

The crowd gives three cheers for Number Eleven. A man in a blue cockade is lifted up to shake your hand through the fanlight.

Sir Francis goes to the Tower on Monday. The candles are in your account at fourteen shillings. Your watch has not been seen since the man in the cockade.`; }},
    {t:'Go out by the mews and take the Bath coach.', go:() => { add({standing:-1, family:1});
      return `You go out by the mews. At the corner a man with a pole tells you to take off your hat.

You take it off. You say “Burdett for ever”. He says he did not hear. You say it again.

You are at Hatherley on Sunday. The Mercury says the Member for Wyvern has gone into the country for his health.`; }}]},

  {id:'member-flogging', hot:true, title:'Fifty Lashes for a Song', w:() => yr(1811, 1812), x:() => `The Liverpool Local Militia complained of their bread. Private Taylor made a song about it and had it printed. He was tried the same day and sentenced to two hundred lashes. He had fifty. His wife fainted at the first.

Sir Francis Burdett moves to end flogging in the army.

${E() === 'army' && !F('edmundDead') ? 'Edmund writes from his regiment. “We flogged a man on Tuesday for selling his shirt. He had three hundred. The surgeon stopped it twice.” He gives no opinion.' : 'The Berkshire Local Militia drilled in Wyvern market place in May. The drum-major carried the cats in a green baize bag.'}`,
    o:[{t:'Vote with Sir Francis.', go:() => { add({goodwill:3, standing:-2});
      return `You go into the lobby with Sir Francis. There are ten of you. The teller counts on his fingers.

Ninety-four against.

A general stops you on the stairs. He says he was flogged at Eton twice a week. He says it made him a general.`; }},
    {t:'Vote with the Horse Guards.', go:() => { add({standing:1, goodwill:-2});
      return `You vote with the ninety-four. Sir Francis has ten.

The Secretary at War thanks the House. He says the lash is seldom used. He says the men prefer it to confinement.

Private Taylor’s song is sold in Wyvern market at a halfpenny. The ballad-woman sings it under the windows of the Bell. It has a good tune.`; }},
    {t:'Stay away.', go:() => {
      return `You are not in the House. Sir Francis has ten votes. There are ninety-four against.

Mudge has the song. He gave a halfpenny for it at Wyvern. He can be heard at it in the gun room.

He stops when you come in. He goes on when the door is shut.`; }}]},

  {id:'member-gas', hot:true, title:'The Gas Light and Coke Company', w:() => yr(1809, 1810), x:() => `Mr Winsor asks Parliament for a charter. He will light London with smoke. He burns coal in an iron pot. The smoke goes along pipes under the street and is set on fire at the end.

He has lit one side of Pall Mall already. The lamps have no wick and no oil. They are very white.

The whale-oil merchants have petitioned against him. So have the lamplighters. Dr Wollaston of the Royal Society says he might as well light London with a slice of the moon.`,
    o:[{t:'Vote for the charter.', go:() => { add({goodwill:1});
      return `You vote for it. The bill is thrown out.

Mr Winsor brings it in again with a smaller capital. It passes. He sends a copper lamp to each of his friends in the House.

Yours is put up in the hall at Hatherley. The nearest gas is fifty-eight miles off. Henrietta keeps a candle in it.`; }},
    {t:'Vote against.', go:() => { add({standing:1});
      return `You vote against. The bill is thrown out. The whale-oil merchants give a dinner at the London Tavern.

You walk home by Pall Mall. Mr Winsor lights one side of the street and the parish lights the other.

A lady is reading a letter under his lamps. On the parish side a gentleman walks into a post.`; }},
    {t:'Go and look at Pall Mall first.', go:() => { add({goodwill:1});
      return `You go at ten at night. There is a crowd. A boy puts his finger to the flame to see if it is hot. It is.

Mr Winsor is there in a white waistcoat. He tells you the gas is wholesome to the lungs. He would pipe it into sick-rooms.

You vote for him on account of the light. You say nothing of the lungs.`; }}]},

  {id:'member-bellingham', hot:true, once:true, title:'The Lobby, the Eleventh of May', w:() => S.year === 1812 && S.season >= 1, x:() => `A quarter past five on Monday. You are on the lobby stairs with a paper from the Wyvern turnpike trustees in your hand.

There is a crack like a door slammed. Mr Perceval comes two steps into the lobby. He says “Oh” and falls on his face.

A tall man in a brown coat sits down on the bench by the fire. There is a pistol beside him. “I am the unfortunate man,” he says. Nobody has asked him yet.

The Minister is carried into the Speaker’s secretary’s room. He is dead before the surgeon comes.`,
    o:[{t:'Stay, and vote the family its fifty thousand.', go:() => { add({standing:1});
      return `The House votes fifty thousand pounds to the twelve children and two thousand a year to Mrs Perceval. You vote for it. Nobody votes against.

The man is named Bellingham. He was a merchant. He lay five years in a Russian prison. He wrote to every office in Whitehall, and every office answered him.

He is tried on Friday. He is hanged on Monday.`; }},
    {t:'Go to the trial.', go:() => { add({standing:1});
      return `The trial is on Friday at the Old Bailey. The Sheriff finds you a seat.

Bellingham speaks for an hour, quite calm. He had a claim upon the Government. A clerk at the Treasury told him he might take what measures he thought proper. He took them.

The jury is out fourteen minutes. He is hanged on Monday at eight. You do not go to that.`; }},
    {t:'Take the night mail home.', go:() => { add({family:2, standing:-1}); reg('henrietta',1);
      return `You take the night mail from Piccadilly. The guard has heard. By Hounslow the whole coach has heard.

At Reading there are men in the street at four in the morning. One calls up to ask if it is true. The guard says it is. Somebody cheers.

At Hatherley Henrietta turns you round twice in the hall to look at you. She says you are not to go back. The lodgings are paid until midsummer.`; }}]}
];
pooled('member', MEMBER, 'mem', {from:1796, to:1815, weight:8, repeatGap:3, cond:() => F('mp')});

/* ---- The county ----
   Things that happen in Berkshire whether the squire likes it or not. Those marked hot belong to their year
   and are taken from docs/SOURCES.md; the rest may come in any year. */
const kenMan = () => { const f = tenantOf('kennet'); return f ? Called(f) : 'The tenant'; };
const COUNTY = [
  {id:'county-hen', hot:true, once:true, title:'The Hen at the Turnpike', w:() => yr(1806, 1807), x:() => `A pedlar at the back door has news from Leeds. A hen there lays eggs with writing on the shell. “Crist is coming.” The public pays a penny to see one.

By the month’s end Hatherley has a hen. She belongs to Widow Tubb at the turnpike cottage. The egg says REPENT. The N is backwards.

There are forty people in the lane. Widow Tubb has put a plate by the door.`,
    o:[{t:'Pay your penny and look.', go:() => { add({goodwill:1});
      return `You pay your penny. The egg lies in a basin on the dresser, on a clean cloth. REPENT, in brown.

The hen is under the table. She is a common barn-door fowl. She has a ribbon on her leg.

Widow Tubb takes eleven shillings in the week. Then the hen goes broody and lays nothing. The Widow says that is a sign too.`; }},
    {t:'Send the curate to examine the egg.', go:() => { add({goodwill:-1, standing:1});
      return `The curate takes the egg to the window. He smells it. He wets his finger and rubs.

“Vinegar, ma’am. A quill dipped in vinegar. It eats the shell.”

Widow Tubb has no quill and cannot write. Her grandson is nine and goes to the dame school. He is fetched from behind the pigsty. He writes REPENT on a slate for the curate. The N is backwards.`; }},
    {t:'Buy the hen.', note:'£1', go:() => { add({money:-1});
      return `A guinea. The hen comes up to the Hall in a basket.

Mrs Bunce puts her in the yard with the others. She lays a brown egg every second day. There is nothing on any of them.

By Michaelmas Mrs Bunce cannot say which hen she was. There was a fowl at table on Sunday.`; }}]},

  {id:'county-goldcup', hot:true, once:true, title:'Ascot Heath', w:() => S.year === 1811 && S.season === 1, x:() => `Ascot Heath, the Thursday. The Gold Cup is two miles and a half, for a hundred guineas. The Queen is in the stand with five Princesses. The Prince Regent is on horseback in a green coat.

${K() === 'vane' ? 'Captain Vane has written. Smallhopes cannot lose. He has it from the horse’s own groom.' : 'Mr Loveday has it from a groom that Smallhopes cannot lose.'}

The ring lays three to one against Smallhopes and two to one Jannette. A man on a stool will take twenty pounds.`,
    o:[{t:'Twenty pounds on Smallhopes.', note:'£20', go:() => { add({money:-20});
      return `Smallhopes comes in first by a length. You have won sixty pounds. You start for the stool.

The Stewards are sent for. The owner of Smallhopes has not paid his stake. The horse is struck out. The Cup goes to Jannette.

The man on the stool keeps your twenty. He says he is sorry for it. He is laughing.`; }},
    {t:'Twenty pounds on Jannette.', note:'£20', go:() => { add({money:40});
      return `Jannette is beaten a length by Smallhopes. You tear your ticket across.

The Stewards are sent for. The owner of Smallhopes never paid his stake. The Cup is given to Jannette.

You find both halves in the grass. The man on the stool holds them together to read the number. He pays forty pounds on them.`; }},
    {t:'Keep your money and look at the Queen.', go:() => { add({family:1});
      return `You stand at the rails by the Royal stand. The Queen takes snuff. The Princesses eat cherries out of a basket.

The Regent rides down the course before the race. He is twenty stone. The horse is a grey. It sweats at a walk.

Smallhopes is first past the post and is struck out. All round you men are tearing up paper. Others are on their knees looking for it.`; }}]},

  {id:'county-hot', hot:true, once:true, title:'Hot Wednesday', w:() => S.year === 1808 && S.season === 1, x:() => `Wednesday the thirteenth of July. By noon the glass in the hall stands at ninety-six. It has never stood there.

Twenty acres of hay are down in Kennet Meadow. The mowers have left their scythes and gone under the hedge. The butter has run through the dairy shelf. A post-horse lies dead on the Bath road.

Mr ${stew()} says the hay must be carried by Friday. He does not like the look of the west.`,
    o:[{t:'Rest the men until evening.', go:() => { add({money:-30, goodwill:3});
      return `The men lie under the hedge until six. They carry until dark. They are at it again by four on Thursday.

On Friday at two it comes up black out of Wiltshire. Hailstones the size of pullets’ eggs. Half the meadow is still in cock.

Thirty pounds of hay is spoiled. Nobody is dead. ${stew()} enters both in the book.`; }},
    {t:'Keep them at it.', go:() => { add({goodwill:-4});
      return `They carry through the heat for a shilling a man over. The meadow is cleared by Thursday night.

Old Tom Ilsley sits down against a wagon wheel at three on Wednesday. He does not get up. He was sixty-eight. He had mown that meadow fifty-one summers.

The hail comes on Friday. The rick is thatched. There are forty men at the burying.`; }},
    {t:'Carry by moonlight.', note:'£4 in beer', go:() => { add({money:-4, goodwill:1});
      return `The men sleep until nine. They carry from ten at night to five in the morning.

Four pounds in beer. The women rake by lantern. At two a wagon goes into the ditch. Nobody is under it.

The meadow is clear on Friday morning. The hail breaks forty panes at the Hall. There is not a cock of hay out.`; }}]},

  {id:'county-scouring', hot:true, title:'The Scouring of the Horse', w:() => [1803, 1808, 1813].includes(S.year) && S.season === 1, x:() => `A bill is posted at the Bell.

“WHITE HORSE HILL. The Scouring of the Horse will be on Whit-Monday. A Flitch of Bacon to be run for by Asses. A Cheese to be run for down the Manger. A Hat for Men in Sacks, every Man to bring his own Sack. Cart-horses to race in their Harness and Bells, the Carters to ride in Smock Frocks without Saddles. No Whipping allowed.”

It is nineteen miles. Your carter has read the bill through twice. He is standing beside Boxer with his hat off.`,
    o:[{t:'Enter Boxer and the carter.', go:() => { add({goodwill:2});
      return `Boxer runs in his bells. Nine start. There is crossing and there is jostling. There is no whipping.

Boxer is second to a mare from Lambourn. The carter comes off at the post. He is second too.

He has a new whip and a split lip. He hangs the whip up in the stable. He says it is too good to use.`; }},
    {t:'Give a guinea to the prizes and go and look.', note:'£1', go:() => { add({money:-1, goodwill:1});
      return `Your guinea buys a waistcoat. It is for the man who can take a bullet out of a tub of flour with his mouth.

Eleven try. A sawyer from Uffington has it at the fourth dip. He is white to the shoulders.

Thirty thousand people are on the hill. The cheese goes down the Manger with forty men behind it. A waiter from Faringdon has it. He went down on his back.`; }},
    {t:'Keep man and horse at home.', go:() => { add({goodwill:-1});
      return `“Whit-Monday is a working day, Carter.”

“Yes, sir.”

On Monday the stables are empty by five. The men are back on Tuesday at noon. Nobody says where he has been. Boxer has a ribbon plaited in his tail. The carter takes it out when he sees you looking.`; }}]},

  {id:'county-flood', hot:true, once:true, title:'The Water Out', w:() => S.year === 1809 && S.season === 0, x:() => `The frost broke on the twenty-fourth of January. The snow went in a day.

The Kennet is half a mile wide at Kennet Bottom. ${kenMan()} is at an upper window. The cows are swimming in the yard.

The six cottages by the ford have water to the bedroom sills. There are people on the thatch. One woman has brought her clock up with her.`,
    o:[{t:'The people first. Bring them to the Hall.', note:'£20', go:() => { add({money:-20, goodwill:4});
      return `Two boats work until dark. Thirty-one people are brought off the roofs and up to the Hall.

They sleep in the servants’ hall and the laundry. Mrs Bunce feeds them a fortnight. Twenty pounds. The clock is put on the kitchen dresser. Its owner winds it at nine each night.

Eleven cows are drowned at Kennet Bottom. They are counted from the upper window.`; }},
    {t:'The stock first.', go:() => { add({goodwill:-3});
      return `The boats go to the farm. The cows are roped by the horns and swum to the bank one at a time. All but two are saved.

The people sit on the thatch until dark. The curate takes them bread in a punt.

They are fetched off by lantern at nine. The woman will not step into the boat until her clock has been handed down first.`; }},
    {t:'Send to Newbury wharf for the barge-men.', note:'£10', go:() => { add({money:-10, goodwill:2});
      return `Ten pounds to four barge-men from Newbury wharf. They pole a coal lighter up over the meadows.

It takes the people off the roofs and the cows out of the yard in the one voyage. The woman with the clock sits between two heifers.

The water is three weeks going down. There is no christening, wedding or burying in that time. ${vicar()} writes it in the register.`; }}]},

  {id:'county-forbury', hot:true, once:true, title:'The King’s Birthday at Reading', w:() => S.year === 1809 && S.season >= 1, x:() => `The King’s birthday, at Reading. The Volunteers and the new Local Militia parade in the Forbury. Then both are given beer.

By four o’clock the Volunteers are calling across the grass. The Militia were promised two guineas a man. They have not had it.

“Boys, stick out for your guineas!”

Forty militiamen have grounded their arms. Fourteen are Hatherley men. Major Simonds is speaking. Nobody can hear him. You are a magistrate and you have your hat on.`,
    o:[{t:'Go among the Hatherley men.', go:() => { add({standing:2, goodwill:1});
      return `You walk across the grass. You know the fourteen by name. You say each name.

“Pick it up, Will Tubb.” He picks it up. Thirteen more pick theirs up after him.

The Woodley Cavalry ride in at five with swords drawn. They find fourteen men standing to attention. Twenty-six are sitting down.`; }},
    {t:'Pay the fourteen their guineas yourself.', note:'£29', go:() => { add({money:-29, goodwill:3});
      return `Fourteen men at two guineas. Twenty-nine pounds eight. You count it out of your own pocket-book on a drum-head.

The fourteen fall in. The other twenty-six ask who that gentleman is and where he lives.

In September the Pay Office sends down the bounty. It is one guinea a man. The Minister has cut it. Nobody mentions your fourteen.`; }},
    {t:'Stand back and let the cavalry come.', go:() => { add({standing:-1});
      return `You stand under the Abbey gateway with two other justices.

The Woodley Cavalry ride in at five. The Militia take up their arms. The Volunteers go home singing.

Lord Liverpool writes that such conduct cannot go unpunished. It is the Volunteers who are broke. They hand in their coats at the Town Hall. Several coats come in without buttons.`; }}]},

  {id:'county-barclay', hot:true, once:true, title:'A Thousand Miles in a Thousand Hours', w:() => S.year === 1809 && S.season >= 1, x:() => `Captain Barclay has engaged to walk a thousand miles in a thousand hours at Newmarket. One mile in every hour, day and night, for a thousand guineas. He began on the first of June.

He has done six hundred. He walks in a flannel jacket with pistols in his belt. The course is lit by lamps on poles. The lamps are shot at. On the twenty-sixth day he fell asleep walking and his man beat him awake with a stick.

At the Bell they lay two to one that he drops. The landlord holds the stakes in a tea-pot.`,
    o:[{t:'Fifty pounds that he does it.', note:'£50', go:() => { add({money:100});
      return `Fifty pounds into the tea-pot.

He walks his thousandth mile on the twelfth of July at three in the afternoon. He is thirty-two pounds lighter. He sleeps seventeen hours. Then he joins his regiment for Walcheren.

The landlord counts a hundred pounds onto the bar beside your fifty. He counts it slowly. Most of the room had gone the other way.`; }},
    {t:'Fifty pounds that he drops.', note:'£50', go:() => { add({money:-50});
      return `Fifty pounds says he drops.

He does not drop. On the twelfth of July he walks the thousandth mile in twenty-two minutes. The bells of Newmarket are rung.

Your fifty goes to a corn-factor from Wantage. He buys the room a bowl of punch out of it. You have a glass.`; }},
    {t:'Go to Newmarket and see it.', note:'£12', go:() => { add({money:-12});
      return `Twelve pounds in chaises and a bed over a saddler’s. There is not another bed in ten miles.

At two in the morning you stand at the rope. A big man walks by in a flannel jacket with his eyes shut. Gully the prize-fighter walks behind him. A lamp goes out with a bang.

An hour later he walks by again. You stay for nine miles. They are all the same mile.`; }}]},

  {id:'county-crapper', hot:true, once:true, title:'Mr Crapper and the Generals', w:() => yr(1809, 1810), x:() => `Mr Crapper is a chemist at Wantage. He is also agent for the French officers on parole there. They may walk one mile out on any road.

Two French generals have been driven ten miles to dine with Sir John Throckmorton. A magistrate lent the carriage. Mr Crapper has arrested both generals.

The bench is asked to support him. Mr Price, J.P., has written. “Being a low man himself, he assumes a power which he is too ignorant to exercise.”

The papers are before you at Sessions.`,
    o:[{t:'Support Mr Crapper.', go:() => { add({standing:-1, goodwill:1});
      return `“The mile is the mile, gentlemen. A general may count it as well as an ensign.”

The bench hears you out. It votes the other way, nine to one. At dinner the decanter stops at Mr Price.

The Transport Board has the generals marched to Wincanton. Mr Crapper sends you a box of his lozenges, with his respects.`; }},
    {t:'Vote with the bench.', go:() => { add({standing:1});
      return `The bench declines to support the agent. Ten to none.

The Transport Board supports him. The generals are marched to Wincanton behind a corporal.

Sir John Throckmorton has two places empty at his table. He asks two of the magistrates.`; }},
    {t:'Ask who measured the mile.', go:() => { add({standing:1, goodwill:1});
      return `“Who measured the mile, and from what door?”

Nobody knows. A surveyor is sent with a chain. The milestone on the Faringdon road stands four hundred yards beyond the mile. It has been moved. The moss is on the south side.

It is put back. For a month the French officers walk to the stone, touch it and turn. Then it is found four hundred yards out again.`; }}]},

  {id:'county-balloon', hot:true, once:true, title:'A Descent in the Home Pasture', w:() => yr(1810, 1811) && S.season >= 1 && S.season <= 2, x:() => `A balloon comes over the Down at six in the evening. It is striped crimson and yellow. It is losing height.

It comes down in the home pasture. The cows go through the hedge into the barley. Mudge is in the pasture with a gun.

A man in a blue coat climbs out of the basket and takes off his hat.

“Mr Abel Finch, aeronaut, from Oxford. Forty miles in fifty minutes. Might I ask what county this is?”

He has a barometer, a cold fowl and a cat.`,
    o:[{t:'Give him his dinner and a cart to Wyvern.', go:() => { add({family:2, goodwill:1});
      return `He dines at the Hall. He eats for two. He tells Henrietta that at two miles up a man hears dogs barking and nothing else.

${kittyAtHome() ? 'Kitty' : 'Henrietta'} asks what the cat was for. It was to see whether a cat minds. It minds.

The balloon goes to Wyvern on a wagon in a heap. The cat stays at the Hall. She will not go near a basket of any kind.`; }},
    {t:'Charge him for the barley.', note:'£6 to you', go:() => { add({money:6});
      return `Mr ${stew()} walks the barley and puts it at six pounds. Mr Finch pays in Oxford notes.

He says the Dean of Christ Church never charged him. He says the Dean had less barley.

Eleven men fold the silk. The cows will not go back into the pasture until it has rained.`; }},
    {t:'Go up in it on a rope.', note:'£5', go:() => { add({money:-5, standing:1, family:-1});
      return `There is gas left for one. Five pounds. Eleven men hold the rope.

You go up two hundred feet. You see the Hall roof and where it wants lead. You see Lord Cullerne’s woods. They are a good deal larger than yours.

The rope slips a yard. You are heard in the village. Henrietta has watched from the terrace through her fingers.`; }}]},

  {id:'county-coat', hot:true, once:true, title:'The Newbury Coat', w:() => S.year === 1811 && S.season >= 1 && S.season <= 2, x:() => `Sir John Throckmorton has bet a thousand guineas on a coat. Mr Coxeter of Greenham Mills is to take the wool off the sheep at sunrise. Sir John is to sit down to dinner in it at sunset.

It is the twenty-fifth of June. Two Southdowns were shorn at five this morning. There are five thousand people in the mill yard.

By noon the wool is spun and on the loom. At the gate they lay even money that the coat is on his back by seven.`,
    o:[{t:'Twenty pounds on the coat.', note:'£20', go:() => { add({money:20});
      return `The cloth is off the loom by four. It is dyed, dried and pressed. Mr White and nine tailors sit down to it cross-legged on a table.

At twenty past six Sir John puts it on. It is damson-coloured. It is still warm.

You take twenty pounds off a clothier from Trowbridge. He says it cannot be done. He says it with the coat in front of him.`; }},
    {t:'Twenty pounds against.', note:'£20', go:() => { add({money:-20});
      return `You lay twenty pounds that wool cannot be dry by seven.

It is dry by five. At twenty past six Sir John puts on a damson hunting coat and walks about in it. Five thousand people cheer a coat.

You pay a clothier from Trowbridge. The two sheep are roasted whole in the yard. The man carving gives you a slice. He says it is off the one that made the sleeves.`; }},
    {t:'Send Coxeter a fleece of your own.', note:'£4', go:() => { add({money:-4});
      return `You send Mr Coxeter a Hatherley fleece and four pounds. He is to make it up at his leisure.

Sir John dines in his coat at seven with forty gentlemen. A hundred and twenty gallons of strong beer go round the yard.

Yours comes in November by the wagon. Thirteen hours for a baronet. Five months for a squire. It is a good coat. It is brown.`; }}]},

  {id:'county-hocktide', once:true, title:'Hock Tuesday', w:() => S.season === 0, x:() => `Hock Tuesday. You have business at Hungerford and have driven in with Henrietta.

Two men are coming down the High Street with poles. The poles are dressed in flowers and ribbons. Each has an orange stuck on the top. A third man walks behind with a sack of oranges and a feather in his hat.

They are the Tutti-men. They call at every house for a penny from the master and a kiss from the lady. They have stopped at the step of the gig. They are looking at Henrietta.`,
    o:[{t:'A penny and a kiss. It is the custom.', note:'£1 for the punch', go:() => { add({money:-1, family:1, goodwill:1});
      return `You give the penny. Henrietta gives her cheek. The Orange Man bows and hands her an orange.

“We don’t know the gentleman,” says the first Tutti-man. A stranger must be shod. A blacksmith takes your boot on his knee and drives a nail at the heel. You are to cry “Punch”.

You cry it at the second blow. The punch is a guinea for the company. Henrietta eats her orange going home. She does not offer you a piece.`; }},
    {t:'A shilling, and the lady keeps her kisses.', go:() => { add({family:-1});
      return `“A shilling, and the lady keeps her kisses.”

They take the shilling. The Orange Man gives Henrietta her orange all the same.

“I was not asked,” she says, a mile out of the town.`; }},
    {t:'Drive on.', go:() => { add({goodwill:-1});
      return `You touch up the horse. The Tutti-men step back. The Orange Man throws an orange after the gig. It lands in Henrietta’s lap.

At the bridge a blacksmith is waiting with a hammer. He walks beside the wheel as far as the turnpike. He is looking at your boots.

Your business at Hungerford takes four hours. Nobody you came to see is at home.`; }}]},

  {id:'county-lottery', title:'The State Lottery', w:() => S.year >= 1798, x:() => `The State Lottery begins drawing at Guildhall on Monday fortnight. Twenty thousand tickets. Two prizes of twenty thousand pounds.

The Wyvern stationer is agent for Bish of Cornhill. A whole ticket is eighteen pounds. A sixteenth is one pound six.

“Dr Mitford of Reading had the twenty thousand in ’97, sir. His little girl chose the number. Two, two, two, four.”

He has the tickets fanned out on the counter.`,
    o:[{t:'A whole ticket.', note:'£18', go:() => { add({money:-18});
      if (chance(0.12)) { add({money:50, family:1});
        return `A whole ticket. Eighteen pounds. Henrietta chooses the number.

The Blue-coat boy draws it on the ninth morning. Fifty pounds.

The stationer walks out to the Hall with the news himself. He stays in the passage until he is given something.`; }
      return `A whole ticket. Eighteen pounds. Henrietta chooses the number.

It is drawn a blank on the first morning.

The stationer says the first morning is thought the luckiest to lose on. He has the next lottery’s tickets in his pocket.`; }},
    {t:'A sixteenth.', note:'£1', go:() => { add({money:-1});
      if (chance(0.25)) { add({money:1});
        return `Your number comes up a twenty-pound prize. A sixteenth of twenty pounds is one pound five. Bish stops a shilling for postage.

You laid out one pound six. You have one pound four.

Henrietta says that you have won. She tells the Tamworths that you have won.`; }
      return `Number 11,307. It is a blank. A sixteenth of a blank is a blank.

The stationer says the other fifteen gentlemen bore it very well.`; }},
    {t:'Buy a quire of paper and go home.', go:() => {
      return `You buy a quire of post paper. Ninepence.

One of the twenty thousands goes to nine footmen in Portman Square who clubbed for a ticket. The Mercury prints the number.

Henrietta reads it out. She asks what number you would have chosen. You tell her. She runs her finger down the column and says nothing.`; }}]},

  {id:'county-quack', title:'The Cordial Balm of Gilead', x:() => `A yellow chariot is drawn up in Wyvern market place. A black servant in a turban beats a drum on the box.

Dr Tolley sells the Cordial Balm of Gilead at half a guinea the bottle. It cures the nerves, the liver, the consequences of youthful error and the staggers in horses. He has a letter from a Duchess. He holds it up. Nobody is near enough to read it.

He has sold forty bottles since ten. Mr Ferris the surgeon is at the back of the crowd with his arms folded.`,
    o:[{t:'Buy two bottles.', note:'£1', go:() => { add({money:-1, family:1});
      return `A guinea for two. One for Henrietta’s nerves. One for the grey mare.

Henrietta takes a glass at night. She sleeps nine hours and comes down singing. The mare has hers in a mash and lies down in the yard.

Ferris smells the cork. “French brandy and cardamoms, sir. The Bell will sell it you at three shillings.”`; }},
    {t:'Have him up as a vagrant.', go:() => { add({standing:1, goodwill:-2});
      return `You send the constable. Dr Tolley shows a medicine licence, a hawker’s licence and a receipt for the stamp duty on forty gross of bottles.

He has paid the King more this year than you have.

He sells sixty bottles before dark. He tells the crowd that the faculty and the magistracy have persecuted him in nine counties.`; }},
    {t:'Give Ferris a guinea to find what is in it.', note:'£1', go:() => { add({money:-1});
      return `Ferris buys two bottles with your guinea and takes them home.

He is back on Thursday. Brandy, cardamom, a little tincture of cantharides. “It will do what brandy does, sir.”

He has not brought the bottles. He says the analysis used them up.`; }}]},

  {id:'county-fight', title:'A Fight on the Common', x:() => `There is to be a fight on Hatherley Common on Tuesday. The Wyvern butcher against a Bristol man. Twenty-five guineas a side.

A prize-fight is a breach of the peace. You are the nearest magistrate. Four thousand people are looked for, and eleven coaches from London.

The constable has come to ask what he is to do. He has two pounds on the butcher.`,
    o:[{t:'Stop it.', go:() => { add({standing:1, goodwill:-3});
      return `You ride onto the Common at noon with the constable and read the proclamation.

Four thousand people hear you out. Then the stakes are pulled up. The whole crowd walks two miles west and over the county stone into Wiltshire. The ring is pitched again forty yards beyond it.

You sit your horse on the Berkshire side. You can see quite well from there.`; }},
    {t:'Have business at Reading on Tuesday.', go:() => { add({goodwill:1, standing:-1});
      return `You have business at Reading on Tuesday.

The butcher is beaten in thirty-four rounds and fifty-one minutes. He goes home on a hurdle. The constable has lost his two pounds.

On Wednesday the Common is trodden as flat as a floor. The cottagers pick up eleven shillings in coppers, a watch and a set of teeth.`; }},
    {t:'Go, and lay ten pounds on the butcher.', note:'£10', go:() => { add({goodwill:1, standing:-1});
      if (chance(0.5)) { add({money:10});
        return `Ten pounds on the butcher, with a gentleman from London in a white hat.

The Bristol man has the better of twenty rounds. In the twenty-first the butcher hits him under the ear. He does not come to time.

The gentleman in the white hat pays. He asks whether there is a magistrate in these parts. You say there is one somewhere.`; }
      add({money:-10});
      return `Ten pounds on the butcher, with a gentleman from London in a white hat.

The butcher goes home on a hurdle in the thirty-fourth round.

The gentleman in the white hat takes your ten pounds. He asks your name for his book. You give him Mr Tamworth’s.`; }}]},

  {id:'county-wife', once:true, title:'Sold in the Market', x:() => `Wyvern market. A man is leading a woman through the beast-pens by a halter. The halter is new. It is round her waist.

He is Job Ilsley, a hurdle-maker. She is his wife. He has paid the clerk of the market fourpence toll, as for a heifer. He puts her up at five shillings.

She is about thirty. She has her best bonnet on. She is looking steadily at a carter by the pump.

“It is not law,” says ${vicar().replace('The', 'the')} beside you. “They all believe it is.”`,
    o:[{t:'Stop the sale.', go:() => { add({standing:1, goodwill:-2});
      return `You go into the pen as a magistrate and stop it.

Ilsley takes off the halter. His wife tells you she has been three years getting him to market. The carter by the pump puts five shillings back in his pocket.

She walks to the carter’s cottage that night with no sale at all. Ilsley keeps the halter. He asks the clerk for his fourpence.`; }},
    {t:'Let it go on.', go:() => { add({goodwill:1});
      return `The carter bids five shillings. Nobody bids against him. A quart of beer is thrown in for luck.

Ilsley hands over the halter end. The carter takes it off her and gives her his arm. All three go into the Bell together.

The clerk enters it in the toll book. “One wife, 5s. Toll 4d.” The line above is a heifer. The line below is nine ewes.`; }},
    {t:'Bid six shillings.', go:() => { add({family:-1, goodwill:1});
      return `You bid six shillings.

The market goes quiet. The woman looks at you. She looks at the carter. The carter goes red and bids seven. He has to borrow two of it.

You let him have her. Henrietta has heard of it before you are home. She asks what you would have done at eight.`; }}]},

  {id:'county-bounds', once:true, title:'Beating the Bounds', w:() => S.season === 0, x:() => `Rogation Monday. The parish walks its bounds. ${vicar()} goes first in his surplice. After him come the churchwardens with white wands, forty men and nine boys.

At each boundary stone a boy is taken by the heels and bumped upon it. Then he has a penny. He will remember the place when he is old.

At the ninth stone there is a new oak paling. It is Lord Cullerne’s. It runs six yards on the Hatherley side for a quarter of a mile. The stone is behind it.`,
    o:[{t:'Have it down.', go:() => { add({goodwill:3}); reg('cullerne',-2,'You pulled down his paling on Rogation Monday');
      return `“That is the parish’s six yards. Have it down.”

Forty men have it down in an hour. They are very willing. A boy is bumped on the stone and has twopence.

The Castle’s attorney writes on Thursday. By Friday the pales are stacked at your lodge and counted. Lord Cullerne’s man counts them again. He gives a receipt.`; }},
    {t:'Write to the Castle.', go:() => { add({standing:-1});
      return `You write that there appears to be some mistake as to the line.

The Earl’s agent answers in a fortnight. His lordship’s surveyor is satisfied. A plan is enclosed. On the plan the stone has moved.

Next Rogation the boys are bumped against the paling.`; }},
    {t:'Bump a boy on the paling and go on.', go:() => { add({goodwill:-2}); reg('cullerne',1);
      return `There is no getting at the stone. The smallest boy is bumped against the paling and has his penny.

The churchwardens look at you. ${vicar()} reads the Gospel at the paling.

At the beer afterwards the oldest man in the parish says the bound was always at the paling. He has a Castle rabbit in his pocket.`; }}]},

  {id:'county-elephant', title:'The Elephant at the Bridge', w:() => S.year >= 1798, x:() => `Mr Polito’s Menagerie is on the Bath road. Nine caravans, a lion, two kangaroos and an elephant on foot.

The elephant has come to Hatherley bridge. He has put one foot on it. He has taken the foot off. He will not cross.

Four wagons are stopped behind him, and the Bristol mail. His keeper asks leave to take him through the river at your water-meadow. The meadow is laid up for hay. The elephant weighs four tons.`,
    o:[{t:'Let him through the meadow.', note:'£8 of hay', go:() => { add({money:-8, goodwill:3});
      return `He goes down through the meadow and into the river. He stands in the middle. He will not come out. He squirts the mail coach.

It is an hour. The parish is on the bank. Mr Polito’s man gets him out with a loaf.

${stew()} measures the footprints. Each is a foot and a half across and nine inches deep. He counts two hundred and twelve. Eight pounds of hay.`; }},
    {t:'Four guineas for the meadow. One a foot.', note:'£4 to you', go:() => { add({money:3});
      return `“Four guineas. One a foot.”

Mr Polito pays in gold. The elephant goes through the river and up the far bank. He takes a gate with him.

One of the four guineas is bad. Mr Polito is at Marlborough by then.`; }},
    {t:'He must cross the bridge as others do.', go:() => { add({goodwill:-1});
      return `The keeper tries beer. He tries a bun. He tries walking over first himself, backwards.

At four o’clock the elephant turns round. He sets off towards Newbury. The nine caravans turn after him one at a time in the width of the road.

The Bristol mail is three hours late. The guard writes “Elephant” in the time-bill.`; }}]},

  {id:'county-band', title:'The West Gallery', w:() => S.year >= 1806, x:() => `The church band sits in the west gallery. A bassoon, a clarinet, two fiddles and the blacksmith on the serpent. They have played the Old Hundredth at the one pace for thirty years. It is not the pace of the singers.

${vicar()} has a printed paper from Flight and Robson. A barrel organ, thirty pounds. Ten psalm tunes on the barrel. A child may turn the handle.

The band have heard of it. On Sunday they played the people out to “The Girl I Left Behind Me”.`,
    o:[{t:'Buy the organ.', note:'£30', go:() => { add({money:-30, standing:1, goodwill:-3});
      return `The organ comes from London in three cases. Thirty pounds. The clerk’s boy turns the handle.

The band sit below in their Sunday coats with their arms folded. At the third psalm the barrel sticks. It plays the first line of the Easter Hymn eleven times.

The blacksmith goes up the gallery stairs. There is one blow. The organ plays on. He comes down and folds his arms again.`; }},
    {t:'Buy the band a new bassoon.', note:'£4', go:() => { add({money:-4, goodwill:3});
      return `Four pounds for a bassoon from Reading. The old one was mended with pitch and a bootlace.

On Sunday the band play the Old Hundredth. They play it faster, to show the bassoon. The congregation is left two lines behind.

${vicar()} puts the printed paper away in his sermon case. It is seen there again at Easter.`; }},
    {t:'Leave it to the vestry.', go:() => { add({goodwill:1});
      return `The vestry meets in the church porch. Eleven ratepayers. Four are the band. Two are fathers of the band.

The organ is lost by seven to four. The vestry votes the blacksmith five shillings for a new mouthpiece.

On Sunday the band play the people out to “Rule, Britannia”. ${vicar()} waits in the vestry until they have done.`; }}]}
];
pooled('county', COUNTY, 'cty', {from:1797, to:1815, weight:6, repeatGap:3});

/* ---- Henrietta and the Earl ----
   Three papers. henSongs wanders in when she is cool towards him; henPorch and henRichmond follow by the queue
   unless the matter is mended. She is always back under his roof at the end of it, so every other paper holds. */
ev({ id:'henSongs', from:1799, to:1810, weight:4, cond:() => !F('henA') && (S.chars.henrietta.r <= 1 || S.family < 50), title:'Six Italian Songs',
  text:() => `Henrietta has dined at the Castle twice this month. You were not asked. The first time was to make up the old Countess’s table at whist. Nobody has said what the second was for.

On Thursday the Castle groom brings a parcel. Six Italian songs, bound in green. “Lord Cullerne’s compliments to Mrs ${S.sur}.”

She has not sung since Kitty was born. She is at the instrument before breakfast. She has done her hair a new way. Mrs Tamworth remarked it in church.`,
  choices:[
    {t:'Say nothing. It is a book of songs.', go:() => { fl('henA'); later('henPorch', 3);
      return `You say nothing.

She sings in the mornings. On Tuesdays the Castle carriage fetches her to the old Countess’s whist. The old Countess is eighty-one. She has been deaf since the American war.

Mudge mentions that his lordship’s grey has stood three afternoons at the keeper’s lodge in Hatherley Copse. He mentions it while looking down a gun barrel.`; }},
    {t:'Take her to London for the season.', note:'£300', go:() => { fl('henA'); add({money:-300, family:6}); reg('henrietta',2,'You gave her a season in Wimpole Street');
      const mended = chance(0.7); if (mended) fl('henMended'); else later('henPorch', 4);
      return `A house in Wimpole Street for ten weeks. Three hundred pounds. The opera twice. Mrs Siddons. A rout where four hundred people stood on the stairs.

Henrietta is asked everywhere once. You go with her. You stand behind her chair.

The green book stayed at Hatherley on the instrument. There is dust on it when you come home.${mended ? ' She puts it in the canterbury with the old music.' : '\n\nA second parcel is on the hall table. It is the same size.'}`; }},
    {t:'Send the songs back.', go:() => { fl('henA'); add({family:-3}); reg('henrietta',-2,'You sent back the Earl’s songs'); reg('cullerne',-1); later('henPorch', 2);
      return `The green book goes back to the Castle by Mudge. You write the note yourself. “Mrs ${S.sur} has no occasion for them.”

Henrietta watches Mudge down the drive from the drawing-room window. She shuts the instrument. She turns the key and puts it in her pocket.

She does not sing. On Tuesday the Castle carriage comes for her as before. She gets into it.`; }}
  ]});

ev({ id:'henPorch', follow:true, cond:() => F('henA') && !F('henMended') && !F('henriettaAway'), title:'What Mrs Tamworth Saw',
  text:() => `Mrs Tamworth stops you in the church porch. She has her hand on your sleeve.

“I should not say it. I was at Speenhamland on Wednesday, at the Pelican. The Castle chariot was in the yard with the blinds down. A lady went up the back stairs in a grey veil. I know the veil. I gave it her.”

At home there is a sheet of blotting paper on Henrietta’s writing-table. You hold it to the glass.

“Thursday, if he rides to Sessions.”

Thursday is Sessions.`,
  choices:[
    {t:'Speak to her tonight.', go:() => {
      if (S.chars.henrietta.r >= 0 || S.family >= 50) { fl('henMended'); add({family:-6}); reg('henrietta',1); reg('cullerne',-1);
        return `You speak when the servants are gone up. You hold out the blotting paper.

She looks at it a long time.

“He listens when I speak. You have not asked me a question since the year Edmund went to school.”

She writes one line to the Castle. She gives it to you unsealed. It goes by Mudge. On Thursday you do not ride to Sessions. You ask her eleven questions at breakfast. She answers four.`; }
      add({family:-8}); reg('henrietta',-1); later('henRichmond', 2);
      return `You speak when the servants are gone up. You hold out the blotting paper.

“He listens when I speak,” she says.

She will not write to the Castle. She will not be examined in her own dressing-room. The door is shut. You hear the key.

On Thursday you ride to Sessions. You sit six hours on the bench. You do not hear a case.`; }},
    {t:'Call him out.', go:() => { fl('henMended'); reg('cullerne',-4,'You met him on the Down at twelve paces'); const r = Math.random();
      const open = `Mr Hartopp carries your note to the Castle in his best coat. He brings back the Earl’s answer. He has left a pamphlet there on the Swedish turnip.

Six in the morning on the Down, at twelve paces.

`;
      if (r < 0.3) { add({standing:4, family:-4});
        return open + `Your ball takes Lord Cullerne in the right arm above the elbow. His goes into the turf. He bows, with his left hand on the place.

The surgeon has the ball out on the grass. The Earl goes to Brighton until Christmas for his health.

Henrietta is told at breakfast. She puts down her cup. “Which of you?” she says.`; }
      if (r < 0.75) { add({standing:2, family:-4});
        return open + `You fire. A lark goes up. The Earl fires into the air. He says he has no quarrel with Mr ${S.sur} and regrets extremely any misapprehension.

Hartopp declares honour satisfied. He says it twice.

On Tuesday the Castle carriage does not come. Henrietta sits at the window with her bonnet on until noon. Then she takes it off.`; }
      add({standing:1, family:3, money:-40}); reg('henrietta',1);
      return open + `The Earl’s ball goes through the flesh of your thigh. Yours breaks a flint. You sit down on the grass.

Ferris takes you home in the Castle chariot. It is the only carriage on the Down. The cushions are grey.

Six weeks on a sofa and forty pounds to Ferris. Henrietta nurses you herself. She does not go out on Tuesdays. Neither of you says why.`; }},
    {t:'Ride to Sessions on Thursday.', go:() => { add({family:-4}); later('henRichmond', 2);
      return `On Thursday you ride to Sessions. You commit a man for stealing two fowls. You dine with the bench. You ride home by the long road.

Her lamp is lit when you come in. She asks who was at Sessions.

You tell her who was not.`; }}
  ]});

ev({ id:'henRichmond', follow:true, cond:() => F('henA') && !F('henMended') && !F('henriettaAway'), title:'The Blue Room',
  text:() => `Henrietta’s maid brings your shaving water. The footman should have brought it.

“My mistress went at six, sir. In a post-chaise from the Bell. She took the dressing-case and the green book.”

There is a letter on the pincushion. “I am at Richmond. Do not send Kitty to me. H.”

Lord Cullerne has taken a house on Richmond Hill by the quarter. It is known in Wyvern by noon. It will be known in Reading by Sunday.`,
  choices:[
    {t:'Bring an action for criminal conversation.', note:'£400', go:() => { fl('henMended'); fl('henBack'); fl('crimcon'); add({money:-400, standing:-8, family:-22}); reg('henrietta',-4,'You had her letters read out in the King’s Bench'); reg('cullerne',-5,'You had him before a jury for criminal conversation'); reg('kitty',-1);
      const won = chance(0.7); if (won) add({money:2000});
      return `Serjeant Best opens for you in the King’s Bench. Four hundred pounds in fees. Your own servants are sworn. The footman tells the court what he saw through the window of the keeper’s lodge. Counsel reads her letters aloud. He does the voice.

${won ? 'The jury gives two thousand pounds against the Earl.' : 'The jury finds for you. Damages, one shilling. The foreman holds a farm under the Castle.'} The Mercury gives it nine columns.

A divorce wants an Act of Parliament and a second fortune. You do not move for one. The Earl gives up the Richmond house at the quarter.

In March a post-chaise sets Henrietta down at the lodge. She walks up the drive with the dressing-case. She goes up to the blue room. At five she comes down to dinner.`; }},
    {t:'Go to Richmond and ask her home.', go:() => { fl('henMended'); fl('henBack'); add({standing:-5, family:-10}); reg('henrietta',2,'You came to Richmond and asked her home'); reg('cullerne',-3);
      return `You post to Richmond. The house has a green door and a view of the river. A man in the Castle livery says his lordship is at Brighton.

She is in a back parlour with the blinds half down. She is alone. He has been at Brighton three weeks.

“Have you come to forgive me? I had rather you did not. Ask me to come home.”

You ask. She fetches her bonnet.`; }},
    {t:'Shut the door on her.', go:() => { fl('henMended'); fl('henBack'); add({standing:-6, family:-25}); reg('henrietta',-3,'You shut the door on her for a year'); reg('kitty',-2,'You shut the door on her mother'); reg('cullerne',-3);
      return `You have her things sent to Richmond in nine trunks. You write nothing.

At Michaelmas the Earl gives up the house. Henrietta goes to her mother at Bath. Her mother writes. Her mother writes again.

In February a chaise comes up the drive with a parrot’s cage on the roof. The old lady is handed down first.

“I have brought you your wife, sir. I am seventy-three. I cannot keep her and the bird both.”`; }}
  ]});

/* ---- Mrs Vane comes home ---- */
ev({ id:'kittyDoor', from:1803, to:1812, weight:5, cond:() => K() === 'vane' && !F('kittyDoor'), title:'The Carrier’s Cart',
  text:() => `The Wyvern carrier stops at the lodge. He hands down a hair trunk, a child of three and Kitty.

Her pelisse is brown. It was blue. She walked from Reading to Theale to save the fare.

Captain Vane has sold his commission. Fifteen hundred pounds. He was at the agent’s in Craig’s Court on Tuesday and on the Holyhead mail on Wednesday. A Miss Decamp of the Norwich theatre was on it with him.

There are bills in Kitty’s reticule for four hundred and ten pounds. Every one is made out in her name.

“I have not come for money,” she says. The child is asleep on the trunk.`,
  choices:[
    {t:'Pay the bills, and eighty pounds a year to her.', note:'£410 and £80 a year', go:() => { fl('kittyDoor'); fl('vaneGone'); fl('kittyAllowance'); add({money:-410, family:5, standing:-2}); reg('kitty',3,'You paid the Captain’s bills and asked her nothing'); reg('henrietta',2);
      return `Four hundred and ten pounds to nine tradesmen in three garrison towns. Eighty pounds a year to Kitty, by the quarter, into her own hand.

She will not live at the Hall. She takes four rooms over the stationer’s at Wyvern. There is a brass plate. “Mrs Vane. Young Ladies instructed in French and the Use of the Globes.”

She walks out on Sundays with the boy. He is put down at the lodge and runs the rest.`; }},
    {t:'Keep the child. She must go to the Captain’s people.', go:() => { fl('kittyDoor'); fl('vaneGone'); fl('kittyNorthampton'); add({family:-8, standing:1}); reg('kitty',-4,'You kept her boy and sent her to Northampton'); reg('henrietta',-2,'You sent Kitty from the door');
      return `“The boy shall want for nothing. Your place is with your husband’s family.”

The Captain’s mother lives at Northampton on an annuity of sixty pounds. Kitty goes by the wagon. She does not turn round on the seat.

The child asks for her at bedtime for nine nights. On the tenth he asks for Mrs Bunce.`; }},
    {t:'Send a Bow Street man after the Captain.', note:'£120', go:() => { fl('kittyDoor'); add({money:-120, family:-2}); reg('kitty',-1,'You fetched the Captain back to her'); reg('vane',-2);
      return `A hundred and twenty pounds to a runner from Bow Street. He finds the Captain in a fortnight, at a faro table in Dame Street, Dublin. Miss Decamp left on the Friday with a wine-merchant.

Two hundred remain of the fifteen. He comes back for his passage and a new hat.

Kitty looks at him across the hall. She thanks you. They go into lodgings at Reading. The trunk goes on the same cart that brought it.`; }}
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
  walcheren:() => ['Died of the fever at Walcheren, 1809', `His son, Captain ${S.sur} of the 52nd, died of the fever at Walcheren in 1809. He is buried on the island. There is a tablet in Hatherley church.`],
  badajoz:() => ['Killed in the breach at Badajoz, 1812', `His son, ${F('major') ? 'Major' : 'Captain'} ${S.sur} of the 52nd, fell in the great breach at Badajoz. There is a tablet in Hatherley church. His mother has had the pew moved to face it.`],
  fever:() => ['Died of the yellow fever at Port Royal, ' + S.year, `His son, a Lieutenant in the Navy, died of the yellow fever at Port Royal and is buried at the Palisadoes. His quadrant is on the library table.`],
  duel:() => ['Shot on Hatherley Down, ' + S.year, `His son was shot on Hatherley Down by a Cornet of Dragoons, at ${edmAge()}. He lies in the churchyard. The Cornet is believed to be in Ostend.`]
};
function edmundDies(blame){ const P = fate(), t = TOMB[P.kind](); fl('edmundDead'); fl('edmundRoleDead', t[0]); fl('edmundTomb', t[1]);
  add({family:-25, standing: P.kind === 'duel' ? -2 : 3}); if (P.how === 'let') reg('henrietta', -2, 'You let Edmund go'); S.peril = null; later('heir', 3); }
function edmundLives(){ const P = fate(); if (P.kind === 'badajoz') { fl('major'); fl('edmundFate', 'was in the breach at Badajoz'); } if (P.kind === 'walcheren' && P.p > 0) fl('edmundFate', 'came through Walcheren and the Peninsula'); S.peril = null; }

ev({ id:'walcheren', from:1809, to:1809, weight:40, cond:() => E() === 'army' && !F('edmundDead') && !S.peril && !F('perilDone') && S.season >= 1, title:'Ordered for the Scheldt',
  text:() => `Edmund writes from Deal.

“My dear Father, We embark on Friday. Forty thousand men, and ships past counting; I made it two hundred from the beach and left off. Nobody will say where. The sutlers say Flushing. Our Surgeon has asked for bark and been told there is none to spare, this not being the West Indies. I have my Corunna boots, which let water.”

Henrietta has the atlas open. The island is called Walcheren. The map shows it lower than the sea.`,
  choices:[
    {t:'Send him bark, flannel and port wine.', note:'£30', go:() => { fl('perilDone'); add({money:-30}); reg('edmund',1); peril('walcheren', 0.15, 'bark');
      return `Thirty pounds. Six pounds of Peruvian bark from Apothecaries’ Hall, flannel waistcoats and a case of port. It goes down to Deal by the mail under the guard’s own hand.

The fleet sails on the twenty-eighth of July. No greater ever left England.

Nothing comes for seven weeks.`; }},
    {t:'Write to the Horse Guards to keep him at home.', go:() => { fl('perilDone'); add({standing:-1}); reg('edmund',-3,'You had him kept from Walcheren'); reg('henrietta',2); peril('walcheren', 0, 'kept');
      return `You write to a Member. The Member speaks to a General. Edmund is ordered to the depot at Chatham to drill recruits.

His letter is four lines. “I am to teach ploughboys their left foot while the Regiment is in Holland. I am told I have you to thank.”

The fleet sails without him. Henrietta sleeps the night through.`; }},
    {t:'Give him your blessing.', note:'£10', go:() => { fl('perilDone'); add({money:-10}); reg('edmund',1); peril('walcheren', 0.35, 'let');
      return `You write that he will do his duty and that his mother sends her love. You enclose ten guineas.

The fleet sails on the twenty-eighth of July. Flushing is bombarded and taken in a fortnight. The Gazette prints it. They ring the bells at Wyvern.

Then nothing comes for seven weeks.`; }}
  ]});

ev({ id:'badajoz', from:1812, to:1812, weight:40, cond:() => E() === 'army' && !F('edmundDead') && !S.peril && !F('stormDone') && S.season <= 1, title:'The Forlorn Hope',
  text:() => `Edmund writes from the lines before Badajoz.

“My dear Father, The breaches will be practicable within the month. A storming party goes in first with ladders and hay-bags. It is all volunteers. The officer who leads it and lives has his step without purchase. ${F('major') ? 'I have my majority already, by your kindness, and have no need of it. I have put my name down notwithstanding. Eleven of my company have put theirs.' : 'I am a Captain, and eleven hundred pounds short of a majority. I have put my name down.'} The men call it the Forlorn Hope. The Adjutant says that is Dutch and means only a lost troop. I did not find that it helped.”

The letter was three weeks coming.`,
  choices:[
    {t:'Buy him the majority. He need not climb for it.', note:'£1,100', if:() => !F('major'), go:() => { fl('stormDone'); fl('major'); add({money:-1100}); reg('edmund',-1); peril('badajoz', 0.15, 'bought');
      return `Eleven hundred pounds to Cox and Greenwood in Craig’s Court. They send it out by the King’s messenger with the army’s gold.

The Gazette has him Major by purchase. He takes his name off the list. Another captain puts his on.

The breaches are stormed on the night of the sixth of April. The Light Division goes in behind the storming party.`; }},
    {t:'Forbid it. He has a mother.', go:() => { fl('stormDone'); reg('edmund',-2,'You forbade him the storming party'); peril('badajoz', 0.4, 'forbade');
      return `You write that he has a mother. You underline it.

The letter is three weeks to Lisbon and a week more to the lines. The breaches were stormed on the night of the sixth of April.

It will reach the camp about the twentieth.`; }},
    {t:'Write that he must judge.', go:() => { fl('stormDone'); reg('edmund',2,'You left Badajoz to his own judgment'); peril('badajoz', 0.4, 'let');
      return `You write that he is thirty-six and a soldier and must judge. You write it four times before it will go on one sheet.

The breaches were stormed on the night of the sixth of April. The Gazette has not the lists yet.

Henrietta asks what you wrote. You tell her. She goes out of the room.`; }}
  ]});

ev({ id:'jamaica', from:1803, to:1810, weight:5, cond:() => E() === 'navy' && !F('edmundDead') && !S.peril && !F('perilDone'), title:'The Jamaica Station',
  text:() => `Edmund writes from Spithead.

“My dear Father, We are ordered to the Jamaica station with the convoy. The First Lieutenant has been out before. He says there are two seasons, the sickly and the very sickly, and that a frigate buries a third of her people in the first year. The vacancies make promotion brisk. He told me this as good news. I am to bring a cask of bark and six dozen of port, if I have a friend to pay for them.”

Captain Holloway’s name still passes at the Admiralty.`,
  choices:[
    {t:'Send the bark and the port.', note:'£30', go:() => { fl('perilDone'); add({money:-30}); reg('edmund',1); peril('fever', 0.15, 'bark');
      return `Thirty pounds. The cask and the six dozen go down to Portsmouth by Clarke’s wagon. Edmund signs for them on the Hard.

The convoy sails with the first east wind. A hundred and forty sail of sugar ships and four of the King’s.

A letter from Jamaica is nine weeks coming, when the packet is not taken.`; }},
    {t:'Ask Captain Holloway for a ship in the Channel.', go:() => { fl('perilDone'); add({standing:-1}); reg('edmund',-3,'You had him taken out of the Jamaica convoy'); reg('henrietta',2); peril('fever', 0, 'kept');
      return `Captain Holloway writes to a Lord of the Admiralty. Edmund is moved into a seventy-four of the Channel fleet, off Brest.

He does not write for a quarter. When he does it is to his mother.

The convoy sails without him.`; }},
    {t:'Wish him prize money.', go:() => { fl('perilDone'); reg('edmund',1); peril('fever', 0.35, 'let');
      return `You write that the West Indies have made many a young officer. You wish him prize money.

The convoy sails with the first east wind. A hundred and forty sail of sugar ships and four of the King’s.

A letter from Jamaica is nine weeks coming, when the packet is not taken.`; }}
  ]});

ev({ id:'edmundDuel', from:1800, to:1812, weight:3, cond:() => (E() === 'home' || E() === 'militia') && !F('edmundDead') && !S.peril && !F('perilDone'), title:'Words in the Card-room',
  text:() => `There were words in the card-room at the Wyvern Assembly. A Cornet Lascelles of the Tenth Light Dragoons, quartered at Reading, said that old Mr ${S.sur} signed his will with another man’s hand on the pen.

Edmund threw a glass of negus in his face.

They meet on the Down at six tomorrow. Young Hartopp is to second him. Edmund has no pistols of his own. He is in the gun room doorway.

“May I have my uncle’s, sir?”`,
  choices:[
    {t:'Bind them both over to keep the peace.', go:() => { fl('perilDone'); add({standing:-2}); reg('edmund',-3,'You bound him over like a poacher'); reg('henrietta',2); peril('duel', 0, 'kept');
      return `The constable is at the Bell before supper with two warrants. Both gentlemen are bound over in two hundred pounds to keep the peace for a twelvemonth.

The Cornet bows. He says he quite understands a father’s feelings. He says it in the public room.

Edmund does not dine at home that month.`; }},
    {t:'Lend him the pistols.', go:() => { fl('perilDone'); reg('edmund',2,'You lent him the Wogdons'); peril('duel', 0.3, 'let');
      return `Your uncle’s pistols, by Wogdon. You clean them yourself. The left one throws high. You tell him so.

He goes out at five with young Hartopp. You stand at the landing window. The Down is in mist.

At twenty past six there are two reports, close together.`; }},
    {t:'Go to the Cornet tonight with two hundred pounds.', note:'£200', go:() => { fl('perilDone'); add({money:-200, standing:-3}); peril('duel', 0, 'bought');
      return `The Cornet counts it. He writes an apology at the table of the Bell and signs it. He has leave to join his regiment the same night.

The apology is read out in the coffee room. Edmund believes he frightened the man. Half Wyvern knows better. Nobody tells him.

The Cornet buys a charger with the money. He calls it Hatherley.`; }}
  ]});

const FATES = {
  walcheren:{
    dead:() => `The letter is from the Surgeon of the 52nd, dated Middelburg.

“Sir, It is my painful duty. Captain ${S.sur} was taken with the fever of this island on the ninth of September and died on the fourteenth at four in the afternoon. He was sensible until the last day. He asked that his watch go to his sister and his sword to you. We have buried four officers and fifty-one men this month. I have not the bark to treat the rest.”

The sword comes in November by the Harwich wagon, in a deal case. The watch is not with it.`,
    kept:() => `The transports come into Deal in September. Edmund is sent over from Chatham to meet them.

“My dear Father, They carried them up the beach on doors. Of our six hundred, three hundred and ninety are sick and sixty are buried on the island. The French did not kill forty. My own company has nineteen men fit. The Serjeant did not know me. Then he did, and asked where I had been. I told him.”

He has signed it with his rank and his full name.`,
    alive:P => `A letter from Harwich, in pencil.

“My dear Father, I am landed and can stand. We took Flushing in a fortnight and then sat down in the wet to wait for orders. The fever came with the September mists. Men were well at parade and dead at tattoo. Of our six hundred, three hundred and ninety were in hospital at once. ${P.how === 'bark' ? 'I had your bark and shared it through the company as far as it went. It went four days.' : 'There was no bark. The Surgeon gave port while there was port.'} I shake every third day at about four o’clock. They tell me it wears off in a year or two.”`},
  badajoz:{
    dead:() => `The letter is from his Colonel.

“Sir, ${F('major') ? 'Major' : 'Captain'} ${S.sur} fell in the great breach at Badajoz on the night of the sixth of April. He was seen upon the ladder three times. He was found in the morning under the chevaux-de-frise with eleven men of his company. The Regiment has lost more officers in one night than in four years. I enclose his ring.”

The Gazette comes the day after. His name is fourth in the list of the 52nd. It is spelt with one R.`,
    alive:P => `“My dear Father, I am alive and cannot tell you why. We went down into the ditch at ten at night. The French had chained planks across the breach, stuck full of sword-blades. I do not know how many times we went up. A dead man knocked me off the ladder and I lay under him until morning. I think it preserved me. The Light Division has lost nine hundred. Lord Wellington came to look at the breach at daylight. I am told he wept. ${P.how === 'bought' ? 'I had rather have the men.' : 'I am a Major. I had rather have the men.'}”${P.how === 'forbade' ? '\n\nYour own letter is enclosed. It reached him on the twentieth. He has not broken the seal.' : ''}`},
  fever:{
    dead:() => `The letter is from his Captain, dated Port Royal.

“Sir, Lieutenant ${S.sur} died of the yellow fever on the third of September and was buried at the Palisadoes the same evening, as the climate requires. He was a very promising officer. His effects were sold at the mast according to the custom of the service and fetched nineteen pounds four shillings, which the Purser will remit. I have kept back his quadrant and his mother’s letters.”

The quadrant comes home in the spring. The letters are tied with a rope-yarn. There are sixty-one.`,
    kept:() => `Edmund writes from a seventy-four off Brest.

“My dear Father, We have been at sea nineteen weeks and have seen the French once, at anchor, through a glass. My old ship is come home from Jamaica. She sailed with two hundred and sixty men and has brought back a hundred and ten. The Admiral has put her officers’ names in for promotion, those that are left to have names. I should have been Second of her.”

He does not say which he would have chosen.`,
    alive:P => `A letter from Port Royal. The paper is yellow and so is the ink.

“My dear Father, We have buried the Purser, the Surgeon’s mate, four Midshipmen and thirty-one hands. I had the fever in August and was read over twice by the Chaplain, who then died. ${P.how === 'bark' ? 'I am told the bark saved me. The port certainly saved the Gunner.' : 'I had no bark. The Gunner dosed me with rum and gunpowder and sat on my chest.'} I am made First of the ship, there being nobody else. We have taken a Spanish schooner laden with cocoa. My share is forty pounds.”`},
  duel:{
    dead:() => `Young Hartopp comes up the drive at seven. He is on foot. He has no hat.

Four men are behind him with a hurdle. There is a cloak over it.

“He fired in the air, sir. I am to say that he fired in the air.”

The Cornet has posted for Harwich. The left pistol is in young Hartopp’s hand. He does not know where to put it down.`,
    kept:() => `The Tenth Light Dragoons march out of Reading for the coast. Cornet Lascelles rides with them.

The Mercury has it in the spring. He has shot a brother officer at Brighton over a dog. The ball went in under the fourth rib. The officer died on the Thursday.

Edmund reads it at breakfast. He reads it again. He passes you the paper. He does not say anything.`,
    alive:() => `Edmund comes in at seven with wet boots.

“He fired first. It took the button off my sleeve. I meant to fire wide and I hit his hat. He says it was a twelve-guinea hat.”

He eats four eggs. Henrietta comes down at eight. She asks why the gun room smells of powder at this hour.`}
};
const fateText = () => { const P = fate(), f = FATES[P.kind]; return P.dead ? f.dead(P) : P.p === 0 ? f.kept(P) : f.alive(P); };

ev({ id:'edmundFate', follow:true, cond:() => !!S.peril && !F('edmundDead'),
  get title(){ const P = fate(); return P.dead ? (P.kind === 'duel' ? 'Twenty Past Six' : 'A Letter in a Strange Hand') : P.kind === 'duel' && P.p > 0 ? 'Wet Boots' : 'Edmund Writes'; },
  cut:() => 'fate-' + fate().kind + (fate().dead ? '-dead' : fate().p === 0 ? '-kept' : '-alive'),
  text:() => fateText(),
  choices:[
    {t:'Go up and tell Henrietta.', if:() => fate().dead, go:() => { const duel = fate().kind === 'duel'; edmundDies(); reg('henrietta',1);
      return duel ? `She is on the stairs. She saw the hurdle from her window.

“Not in the hall,” she says. “Carry him to his own room.”

She goes up before the men to turn down the bed. She orders the blinds drawn on the south front. Every one.` : `She is at her glass. She sees the paper in your hand.

“Not aloud,” she says.

You give her the letter. She reads it standing. She folds it in four and puts it inside her gown. She rings, and orders the blinds drawn on the south front. Every one.`; }},
    {t:'Put up a tablet in the church.', note:'£40', if:() => fate().dead, go:() => { const rank = edmRank(), role = TOMB[fate().kind]()[0], age = edmAge(); edmundDies(); add({money:-40, standing:1});
      return `A tablet of white marble on the north wall, by a mason from Reading. Forty pounds.

“${rank} Edmund ${S.sur}. ${role}. Aged ${age}.”

The mason has room for one line more. Henrietta is asked for it. She says there is nothing to add to the age.`; }},
    {t:'Go into the gun room and shut the door.', if:() => fate().dead, go:() => { edmundDies(); add({family:-3});
      return `His fowling piece is on the rack. It has not been cleaned since he last had it out.

You clean it. It takes the afternoon.

At six Mudge comes in. He stands a while. He takes the rod out of your hand and finishes the barrel.`; }},
    {t:'Read it to Henrietta.', if:() => !fate().dead && !(fate().kind === 'duel'), go:() => { edmundLives(); add({family:3}); reg('henrietta',1);
      return `You read it to her in the breakfast-room. She has you read it again.

She takes the letter. It goes into her work-box with the others. She keeps them in order, with the dates outward.`; }},
    {t:'Answer by this post.', if:() => !fate().dead && !(fate().kind === 'duel'), go:() => { edmundLives(); reg('edmund',1);
      return `You write the same night. You cover two sheets. You tell him about the barley, the new pointer and the Tamworths’ chimney. You find no way to say the other thing.

He answers in the spring. “I had yours about the barley. I understood it.”`; }},
    {t:'Tell her he has been after rabbits.', if:() => !fate().dead && fate().kind === 'duel' && fate().p > 0, go:() => { edmundLives(); add({standing:2});
      return `“Rabbits, my dear.”

“With a pistol?”

Edmund looks at his plate. Henrietta looks at the button gone from his sleeve. She sews on another before church. She uses black thread.`; }},
    {t:'Tell her.', if:() => !fate().dead && fate().kind === 'duel' && fate().p > 0, go:() => { edmundLives(); add({standing:2, family:-2}); reg('henrietta',-1,'You lent Edmund the pistols');
      return `You tell her.

She does not speak to either of you until Sunday. On Sunday she takes Edmund’s arm into church. She does not take yours.`; }},
    {t:'Say nothing.', if:() => !fate().dead && fate().kind === 'duel' && fate().p === 0, go:() => { edmundLives(); reg('edmund',1);
      return `You say nothing. You fold the paper and lay it by his plate.

After dinner he brings the decanter round to your end of the table himself.`; }},
    {t:'Say that a hat is cheaper.', if:() => !fate().dead && fate().kind === 'duel' && fate().p === 0, go:() => { edmundLives();
      return `“A hat would have been twelve guineas, Edmund.”

“Yes, sir.”

He finishes his egg. He does not leave the room.`; }}
  ]});

ev({ id:'heir', follow:true, cond:() => F('edmundDead') && !S.flags.heir && S.year < 1815, title:'A Cousin from Birmingham',
  text:() => `Hatherley is settled on heirs male. The next is Mr Josiah ${S.sur} of Birmingham. He is your second cousin. He makes buttons.

He has written to condole. On Thursday he comes himself, in a new black coat. He admires the hall. He paces the drawing-room heel to toe while he thinks you are looking at the fire.

His wife would be glad to know whether the chimneys draw.

Your attorney says a recovery might be suffered and the land settled afresh. It wants three hundred pounds. It wants the cousin not to hear of it before Hilary term.`,
  choices:[
    {t:'Break the entail. Settle it on Kitty.', note:'£300', go:() => { fl('heir','kitty'); add({money:-300, family:4}); reg('kitty',2,'You settled Hatherley on her'); reg('henrietta',1);
      return `Three hundred pounds to the attorney. The deeds are engrossed on nine skins.

Mr Josiah ${S.sur} hears of it in Hilary term. He writes eleven sides. He has taken counsel’s opinion.

Counsel’s opinion is that he should have kept his feet still.`; }},
    {t:'Show him the house. He is the heir.', go:() => { fl('heir','cousin'); add({family:-5}); reg('henrietta',-2,'You showed the button-maker over the Hall');
      return `You show him the house from the cellars to the leads. He writes the number of bedrooms on his cuff.

Henrietta receives him in the yellow drawing-room. She does not ask him to sit.

At the door he presses your hand. He hopes you may be spared many years. He asks your age.`; }},
    {t:'Tell him every chimney smokes.', go:() => { fl('heir','cousin'); add({family:1});
      return `“Every one of them smokes, Mr ${S.sur}. The roof wants two thousand pounds. There is dry rot in the hall.”

He looks at the ceiling. He goes back to Birmingham by the night coach.

At Christmas he writes to ask after the rot.`; }}
  ]});

/* ---- Hard times ----
   Three pools for the three states the engine raises in regardQuarter (src/estate.js): F('sullen') when the
   parish has turned, F('cut') when the county has, F('henriettaAway') when she has gone to Gay Street. */
const PARISH = [
  {id:'parish-letter', title:'Under the Door', x:() => `A paper is found under the hall door at six in the morning. It is written on the fly-leaf of a prayer-book.

“Mr ${S.sur}. You have had fair warnin. Their is them that have ate barly bread sinse Lammas and seen your dogs ate meat. Your ricks is dry. Remember the pore and you may slepe.”

There is no name. The prayer-book was a Hatherley one. The parish gives one to every child at confirmation.`,
    o:[{t:'Fifty guineas for the name of the writer.', go:() => { add({standing:1, goodwill:-3});
      return `A bill goes up at the Bell and on the church door. “FIFTY GUINEAS REWARD.”

Nobody comes for fifty guineas. It is nine years’ wages for a ploughman.

On Sunday the bill on the church door has a line added in pencil. “Sixty, and I will tell you who rote the bill.”`; }},
    {t:'Read it out at the vestry and ask what is wanted.', go:() => { add({goodwill:4, standing:-1});
      return `You read it to the vestry on Thursday, spelling and all. You lay it on the table.

Nobody owns it. Nobody is surprised by it. After a time the wheelwright says that coals are two shillings the bushel and the common is shut.

The vestry sits till ten. You come away with a list. It is in the same hand as the letter. You do not remark on it.`; }},
    {t:'Burn it.', go:() => { add({goodwill:-1});
      return `You put it on the library fire.

Mudge sits up in the stackyard four nights with a gun. On the fifth night he sleeps.

Nothing is burnt. In the morning there is a prayer-book on the mounting-block with the fly-leaf torn out.`; }}]},
  {id:'parish-harvest', title:'The Lord of the Harvest', w:() => S.season === 1 || S.season === 2, x:() => `The wheat on the home farm is dead ripe. It will shed if it stands a week.

The reapers have chosen their captain. He is called the Lord of the Harvest and bargains for them all. This year he is Will Tubb. He stands in the yard with fourteen men behind him.

“Twelve shillings the acre, sir, and the beer. Last year was eight. We have talked it over.”

There is not a cloud. The men have their hooks with them. Nobody has taken his out of the straw band.`,
    o:[{t:'Twelve shillings.', note:'£25 over last year', go:() => { add({money:-25, goodwill:4});
      return `“Twelve.”

They are in the Twelve Acres before you have left the yard. The wheat is down in nine days and carried in thirteen.

At harvest home Will Tubb proposes your health. Fourteen men drink it. They do not cheer. It is nearer than it was.`; }},
    {t:'Send to Reading for Irishmen.', note:'£15', go:() => { add({money:-15, goodwill:-4});
      return `Twenty Irish reapers come out from Reading at seven shillings and their keep. Fifteen pounds over the bargain, with the wagon.

They cut the home farm in six days. They sleep in the great barn and sing at night. The Hatherley men stand at the gate and watch them cut.

The last sheaf is not carried in with ribbons. There is no boy on the load.`; }},
    {t:'Eight, as last year. Let them think.', go:() => { add({money:-40, goodwill:-1, standing:1});
      return `They think for five days. On the fourth the wind gets up from the south-west.

On the sixth Will Tubb comes back for ten shillings and you give it. The hooks go in.

Mr ${stew()} walks the stubble after. He puts the shed corn at forty pounds. The gleaners do very well.`; }}]},
  {id:'parish-pryor', title:'Jem Pryor at the Front Door', x:() => `Jem Pryor has come to the front door. He has never come to it before. He has his hat on.

“I am sent, sir. It was put to the vote at the Bell.”

He has it by heart. Coals. The price of the quartern loaf against nine shillings a week. Gleaning on the home farm before the rake. The path across the park that was stopped.

“That is the four things. I was to say there is a fifth and not say what.”`,
    o:[{t:'Have him into the library and go through the four.', note:'£20', go:() => { add({money:-20, goodwill:5}); reg('pryor',2,'You heard him in the library');
      return `He sits on the edge of a chair with his hat on his knee. He has taken it off without being asked.

Coals at cost from the Hall wharf. Twenty pounds. Gleaning before the rake. The path you will think about.

“And the fifth, Pryor?”

“That was if you wouldn’t see me, sir.”`; }},
    {t:'Hear him on the step.', go:() => { add({goodwill:1}); reg('pryor',-1);
      return `You hear him on the step with the door open behind you.

He says the four things. You say you will consider them. He waits. You have no more to say.

He goes down the drive. He does not go round by the back. At the lodge there are nine men waiting for him.`; }},
    {t:'Send Mudge to him.', go:() => { add({goodwill:-4}); reg('pryor',-2,'You sent the keeper to answer him');
      return `Mudge goes out to him. They were boys together. They stand a minute.

“He won’t, Jem.”

“No. Well. I was sent.”

Pryor puts his hand on the stone lion by the step as he goes. On Saturday the lion has no nose.`; }}]},
  {id:'parish-audit', title:'Three Cheers', w:() => S.season === 2 || S.season === 3, x:() => `Harvest supper in the great barn. A hundred sit down. The beef is yours and so is the beer.

By custom the oldest labourer rises at the end and calls three cheers for the master.

The oldest is Abel Ilsley. He is seventy-nine. He rises. He looks down the table for some time.

“There’s the supper,” he says. “We thanks the cook.” He sits.`,
    o:[{t:'Rise and thank the cook yourself.', go:() => { add({goodwill:3});
      return `You rise.

“Abel Ilsley is right. Three cheers for Mrs Bunce.”

They give them. They are loud. Somebody at the bottom of the table laughs. Abel Ilsley looks at you with his head on one side and lifts his mug an inch.`; }},
    {t:'Sit it out.', go:() => { add({standing:-1});
      return `You sit. The fiddler waits to be told.

After a minute the women begin to clear. The men go out by the far door in twos and threes.

You are left at the top table with Mr ${stew()} and a round of beef.`; }},
    {t:'Stop the beer.', go:() => { add({goodwill:-4, standing:1});
      return `“Draw no more, Mrs Bunce.”

The barn is empty in ten minutes. Nobody says good night.

The second barrel was not broached. It goes back to the cellar. In the morning it is found with the bung started. There is a pint gone and a halfpenny on the lid.`; }}]}
];
pooled('parish', PARISH, 'par', {from:1796, to:1815, weight:7, repeatGap:3, cond:() => F('sullen')});

const COLD = [
  {id:'cold-card', title:'Your Own Card', x:() => `You leave your card at the Lovedays’ on Tuesday. On Thursday their footman brings a card to the Hall on a salver.

It is your card.

There is no message. The corner you turned down has been turned up again.`,
    o:[{t:'Give a dinner regardless.', note:'£40', go:() => { add({money:-40, standing:3});
      return `Cards to fourteen houses. Forty pounds in turbot, venison and a pine-apple.

Three accept. Mr Hartopp, the curate, and an attorney from Wyvern who was not asked. He says the card must have miscarried.

The table is laid for sixteen. The attorney eats for four. He is very good company.`; }},
    {t:'Ride over and ask Loveday why.', go:() => { add({standing:1});
      return `Mr Loveday receives you in the stable yard. He does not ask you in.

“I have daughters,” he says. “It is nothing I think myself. It is what is said at the Castle.”

He walks you to your horse. He holds the stirrup. He looks round first to see who is in the yard.`; }},
    {t:'Put the card back in the case.', go:() => { add({family:1});
      return `You put it back in the case. It is a good card and cost twopence.

No carriage turns in at the lodge that month. The gravel is raked on Saturday. It is found on the next Saturday as the rake left it.`; }}]},
  {id:'cold-bench', title:'The Chair at Sessions', x:() => `Quarter Sessions at Reading. The justices sit in a row of eleven chairs under the King’s arms. You have had the fourth from the left for nine years.

Lord Cullerne’s chaplain is in it. He was put in the Commission at Easter.

There is no twelfth chair. The Chairman is reading a paper very closely. The Clerk of the Peace has dropped his pen and is a long time under the table.`,
    o:[{t:'Stand behind the chair all day.', go:() => { add({standing:2});
      return `You stand behind the fourth chair from ten until five. You give your voice in every case.

The chaplain does not turn his head. By three the back of his neck is red.

At the next Sessions there are twelve chairs. Yours is the twelfth. It is from the Clerk’s office and has no arms.`; }},
    {t:'Write to the Lord Lieutenant.', go:() => { add({standing:-1});
      return `You write to Lord Radnor. You have been in the Commission of the Peace since ’89.

His lordship’s secretary answers. The seating of the bench is a matter for the Chairman. His lordship is confident no slight was intended.

The Chairman is Lord Cullerne’s cousin.`; }},
    {t:'Sit in the body of the court.', go:() => { add({standing:-2, goodwill:2});
      return `You sit on the public benches between a hurdle-maker and a woman with a basket.

A Hatherley man is up for taking a hare. He sees you. He looks from you to the bench and back.

He has three months. Going down he says, “Good day, sir.” It is to you that he says it.`; }}]},
  {id:'cold-cullerne', title:'In Wyvern Market Place', x:() => `Wyvern, market day. Lord Cullerne is crossing from the Bell to his carriage. He has his agent on one side and Mr Tamworth on the other.

You are eight yards off. There is nobody between.

He looks at the Town Hall clock. It is over your head. He goes on looking at it as he comes.`,
    o:[{t:'Bow.', go:() => { add({standing:-1});
      return `You take off your hat and bow.

Lord Cullerne has found something amiss with the clock. He remarks on it to the agent. Mr Tamworth looks at his boots.

A butcher’s boy bows back to you from a doorway. He does it rather well.`; }},
    {t:'Wish him good morning by name.', go:() => { add({standing:2}); reg('cullerne',-1);
      return `“Good morning, my lord.”

The whole market hears it. He is obliged to stop. He touches his hat with one finger.

“Mr ${S.sur}.”

It is two words. Forty people have heard him say them. Mr Tamworth says good morning as well, a little late.`; }},
    {t:'Look at the clock yourself.', go:() => { add({goodwill:1});
      return `You turn and look up at the Town Hall clock.

It is ten minutes slow. It has been ten minutes slow since your uncle’s time.

When you turn round the carriage is at the end of the street. A carter beside you has been looking at the clock too. He asks what you both saw.`; }}]}
];
pooled('cold', COLD, 'cld', {from:1796, to:1815, weight:6, repeatGap:4, cond:() => F('cut')});

const GAYST = [
  {id:'bath-letter', title:'From Gay Street', x:() => `A letter from Henrietta. It is one side.

“I am tolerably well. The rooms are small and the stairs are steep. I drink two glasses at the Pump Room at eight and walk in the Crescent at one. Mrs Loveday is here. She has asked me nothing, which I take very kindly. Pray tell Mrs Bunce that the sheets are to be aired whether I am there or no. H.”

She has not said “your affectionate”. She has written the word and scratched it through.`,
    o:[{t:'Write and ask her to come home.', go:() => { add({family:4}); reg('henrietta',1);
      return `You write four lines. The third is “I should be glad if you would come home.”

Her answer is nine days coming.

“I had your letter. I have read the third line several times. I do not say no. Ask me again in a month, and say why.”`; }},
    {t:'Send fifty pounds.', note:'£50', go:() => { add({money:-50, family:1});
      return `You enclose a fifty-pound note and say that she is to want for nothing.

She acknowledges it by return. She has taken a box at the theatre for the season.

The acknowledgment is one line. It is signed with both her names.`; }},
    {t:'Answer about the sheets.', go:() => { add({family:-1});
      return `You write that the sheets have been aired. You add the price of wheat and that the dog is well.

She does not answer.

Mrs Bunce airs the sheets again on Friday. Nobody has told her to.`; }}]},
  {id:'bath-selina', title:'Selina’s View', x:() => `Your sister Selina has been to Bath. She comes on to Hatherley to tell you about it. She keeps her bonnet on.

“She has two rooms over a milliner. I counted the stairs. She dines at three on a chop. She is asked out four nights in the week and goes. She looks ten years younger. I thought you should know that.”

She takes off one glove.

“I did not ask her why. I ask you.”`,
    o:[{t:'Tell Selina why.', go:() => { add({family:3});
      return `You tell her. It takes some time. You begin in the wrong year and go back.

Selina hears it out. She puts her glove on again.

“Then you had better say that to Henrietta. You said it to me a great deal better than you will say it to her. Write it down tonight.”

You write it down.`; }},
    {t:'Say it is between man and wife.', go:() => { add({family:-1});
      return `“It is between Henrietta and me.”

“It is between Henrietta and all Bath. They are very much on her side.”

She will not stay to dine. Her chaise goes down the drive at a trot.`; }},
    {t:'Ask what the stairs were like.', go:() => { add({family:1});
      return `“How many stairs?”

“Forty-one.”

You say Henrietta never could abide stairs. Selina looks at you for some time.

“No,” she says. “She must dislike something else more.”`; }}]},
  {id:'bath-go', title:'Forty-one Stairs', x:() => `It is fifty-two miles to Bath. A chaise will do it in a day.

The house at Hatherley is very quiet. The clocks have been let run down in three rooms. Mrs Bunce sends up dinner for one and it is still too much.

The blue room is kept shut. You have opened the door twice. Her silver brushes are gone from the table. There are four marks in the dust where they stood.`,
    o:[{t:'Go to Bath.', note:'£12', go:() => { add({money:-12, family:7}); reg('henrietta',2,'You came to Gay Street yourself');
      return `Twelve pounds in chaises. You are in Gay Street by six.

Forty-one stairs. She opens the door herself. She has a pen in her hand.

“You are out of breath,” she says.

You stay four days at the White Hart. You walk in the Crescent with her at one. On the fourth day she lets you carry her shawl.`; }},
    {t:'Send the carriage, empty, with her maid.', go:() => { add({family:-2}); reg('henrietta',-1,'You sent an empty carriage for her');
      return `The carriage goes to Bath with her maid in it and a rug.

It is back on Thursday. The maid is in it. So is the rug.

“My mistress says, sir, that she is not a parcel.”`; }},
    {t:'Wind the clocks.', go:() => { add({family:1});
      return `You wind the clocks yourself, all eleven. It takes the morning.

They strike noon one after another for four minutes.

Mrs Bunce comes to the foot of the stairs to listen. She writes to Bath that night. She has the housemaid write it.`; }}]}
];
pooled('gayStreet', GAYST, 'gay', {from:1796, to:1815, weight:9, repeatGap:2, cond:() => F('henriettaAway')});

/* ---- The Royal Family ----
   Windsor is in the county. royalStag wanders in early; the rest follow by the queue or by their year.
   Flags: royalKnown (the King has your name), royalPlain (you told him the price of bread), princeLoan
   (the Prince has a thousand of yours), privyChamber (what he gave for it). */
ev({ id:'royalStag', from:1797, to:1803, weight:6, cond:() => !F('royalKnown'), title:'The King’s Hounds',
  text:() => `The King’s stag-hounds met at Salt Hill at ten. The deer was uncarted and ran west for five hours.

It is in your horse-pond, up to the neck. Forty couple of hounds are on the bank. Behind them come eleven gentlemen in blue coats with red collars, on beaten horses.

The stout one in front gets down without help. He is sixty. He has a star on his coat.

“Whose house? What? Whose house? ${S.sur}? Good. Good. Are those your turnips? Do you hoe ’em twice? What?”

Mudge has taken off his hat and cannot find where to put it.`,
  choices:[
    {t:'Walk him round the farm.', go:() => { fl('royalKnown'); add({standing:6}); later('royalTerrace', 4);
      return `You walk the King of England round the home farm in the rain.

He looks into the pigsties. He lifts a turnip and smells it. He asks what you give for a ploughman and whether the wheat is dibbled or broadcast. He does not wait for the answers. He has the right ones himself.

“I shall send you a ram. Spanish. Very fine wool. Don’t let ’em tell you they won’t stand the wet.”

The stag is taken out of the pond with ropes and carted home to Windsor. The ram comes in March with a groom and a letter. It will not stand the wet.`; }},
    {t:'Bring him into the Hall and send for the best Madeira.', note:'£30', go:() => { fl('royalKnown'); add({money:-30, standing:4, family:3}); reg('henrietta',2,'The King sat in her drawing-room'); later('royalTerrace', 4);
      return `The King sits in the yellow drawing-room in his wet boots. Thirty pounds in Madeira, cold beef and oats for forty horses.

He will take nothing but barley water. The eleven gentlemen take the rest. Henrietta is presented. She goes down so far that Mrs Bunce thinks she has fallen.

“A good house. Old. Don’t pull it about. They all pull ’em about.”

The chair he sat in is not sat in again. Henrietta ties a ribbon across the arms.`; }},
    {t:'Tell him what bread costs in Hatherley.', go:() => { fl('royalKnown'); fl('royalPlain'); add({goodwill:4, standing:2}); later('royalTerrace', 4);
      return `“The turnips are well enough, sir. It is the bread. The quartern loaf is ${wheatNow() >= 100 ? 'eighteen pence' : 'a shilling'} and a man has nine shillings a week.”

The eleven gentlemen look at the sky. The King looks at you.

“What? Nine? Not enough. Not enough. I give mine twelve at Windsor. Tell ’em the King gives twelve.”

He takes out a purse and gives Mudge five guineas for the poor. Mudge carries it to the vestry in both hands.`; }}
  ]});

ev({ id:'royalTerrace', follow:true, cond:() => F('royalKnown') && S.year <= 1804, title:'The Terrace at Windsor',
  text:() => `On Sunday evenings the Royal Family walks on the Terrace at Windsor. A militia band plays. Any person decently dressed may stand along the wall.

A card has come from an equerry. Mr and Mrs ${S.sur} are desired to be upon the Terrace on Sunday.

Henrietta has had the card nine times in her hand. A Court suit is a hundred and twenty pounds with the sword. The mantua-maker at Reading has never made a hoop that wide.`,
  choices:[
    {t:'Go in full dress.', note:'£120', go:() => { add({money:-120, standing:6, family:4}); reg('henrietta',2);
      return `A hundred and twenty pounds. A plum-coloured coat with steel buttons, a bag-wig and a sword that will not hang straight.

The King comes down the Terrace with the Queen on his arm and five Princesses behind. He stops.

“${S.sur}! The turnips! How is my ram? Dead? What? They told me it would stand the wet.”

It is heard by four hundred people. Lord Cullerne is one of them. He is standing further down the wall. The King has not stopped there.`; }},
    {t:'Go in your Sunday coat.', go:() => { add({standing:2, goodwill:2, family:-2}); reg('henrietta',-1,'You went to Windsor in your brown coat');
      return `You go in your brown coat and your own hair. Henrietta walks a yard from you.

The King stops. He takes hold of your lapel and feels the cloth.

“English wool. Good. Good. That’s a coat. Look at this man’s coat.” The equerries look at your coat.

A lady in feathers asks Henrietta whether her husband is the King’s bailiff. Henrietta does not speak between Slough and Reading.`; }},
    {t:'Send your duty and stay at home.', go:() => { add({standing:-2, family:-4}); reg('henrietta',-2,'You would not take her to Windsor');
      return `You write to the equerry that the harvest forbids.

The Tamworths go to Windsor on the Sunday and stand along the wall. The King does not stop. Mrs Tamworth says she saw the Princess Amelia’s shoe quite distinctly.

Henrietta keeps the card in the frame of her glass. It is there every morning.`; }}
  ]});

ev({ id:'royalBond', from:1805, to:1809, weight:6, cond:() => F('royalKnown') && !F('bondAsked'), title:'A Gentleman from Carlton House',
  text:() => `A Colonel McMahon has posted down from London. He is a small man with a red face. He is secretary to the Prince of Wales.

“His Royal Highness knows his father’s friends in Berkshire, sir. He would wish to count them his own.”

The Prince owes six hundred thousand pounds. He is building at Brighton. The Colonel has a paper in his hat. It is His Royal Highness’s bond for a thousand pounds at five per cent.${F('mp') ? `

“And there is the vote on the Prince’s establishment in March. A Member who held the bond would know how to give it.”` : ''}

He lays the bond on the table. It has a very large seal.`,
  choices:[
    {t:'Take the bond.', note:'£1,000', go:() => { fl('bondAsked'); fl('princeLoan'); add({money:-1000, standing:4});
      return `A thousand pounds, by draft on Tidmarsh. The Colonel has it in his hat before the ink is dry.

A card comes at Christmas. “The Prince of Wales to his friend Mr ${S.sur}.” The name has been written in by another hand.

The interest is due at Lady Day. Lady Day passes. Mr Tidmarsh asks what security you hold. You show him the seal.`; }},
    {t:'Fifty guineas, as a gift, and no bond.', note:'£52', go:() => { fl('bondAsked'); add({money:-52, standing:1});
      return `“I do not lend, Colonel. I should be honoured if His Royal Highness would accept fifty guineas.”

The Colonel looks at the purse for a moment. He accepts on His Royal Highness’s behalf.

No card comes at Christmas. In the spring you hear that a horse named Fifty Guineas ran third at Brighton.`; }},
    {t:'Say that you are the King’s man.', go:() => { fl('bondAsked'); fl('kingsMan'); add({standing:-1, goodwill:2});
      return `“I have had the honour to show His Majesty my turnips, sir. I had rather keep to the one acquaintance.”

The Colonel bows. He takes up the bond and blows the sand off it.

“Kings do not live for ever, Mr ${S.sur}.” He goes on to the Tamworths. He is there two hours.`; }}
  ]});

ev({ id:'royalRegency', from:1811, to:1811, weight:40, cond:() => F('royalKnown') && !F('regencySeen') && S.season >= 1, title:'The Regent’s Fête',
  text:() => `The King is shut up at Windsor. He is blind. He wears a purple dressing-gown and plays the harpsichord to people who are dead. The Prince of Wales is Regent.

On the nineteenth of June the Regent gives a fête at Carlton House. Two thousand cards have gone out.

${F('princeLoan') ? `One has come to Hatherley. It is addressed to “Mr ${S.sur}, of Wiltshire”. No interest has been paid on the thousand pounds.` : F('kingsMan') ? 'None has come to Hatherley. Mr Tamworth has one. He has shown it at the Bell, at church and to your gate-keeper.' : 'One has come to Hatherley. Nobody can say why. Henrietta says it is better not to ask.'}

At Windsor the Terrace is shut. The band has been sent away.`,
  choices:[
    {t:'Go to Carlton House.', note:'£150', if:() => !F('kingsMan'), go:() => { fl('regencySeen'); add({money:-150, standing:7, family:3});
      return `A hundred and fifty pounds in lace, feathers and a hired chariot. You are four hours in Pall Mall getting to the door.

The supper table is two hundred feet long. A stream of real water runs down the middle of it between banks of moss. There are gold and silver fish in the stream. By two in the morning several are floating.

The Regent sits at the head in a field-marshal’s coat. You see him through a glass at sixty yards. ${F('princeLoan') ? 'He does not see you. Colonel McMahon does. He goes behind a pillar.' : 'Henrietta has counted the diamonds on him. She gives it up at the sword.'}`; }},
    {t:'Go, and ask McMahon for your thousand pounds.', if:() => F('princeLoan'), go:() => { fl('regencySeen'); fl('privyChamber'); add({standing:6}); reg('henrietta',1);
      return `You find the Colonel behind a pillar and hold out the bond.

“My dear sir. Not here. His Royal Highness never forgets a friend.”

A letter comes in a fortnight. You are appointed a Gentleman of the Privy Chamber. There is no salary and no duty. The fees on the patent are thirty-one pounds.

The bond is asked for, to be compared with the register. It does not come back.`; }},
    {t:'Go to Windsor and pray for the King.', go:() => { fl('regencySeen'); add({goodwill:3, standing: F('kingsMan') ? 2 : -1});
      return `You drive to Windsor on the Sunday. There is a prayer for His Majesty in St George’s. Forty people are in the chapel.

Afterwards you walk under the north wall. A window is open high up. Somebody is playing Handel on a harpsichord, slowly, with the wrong notes put right.

A page looks out and shuts the window. You stand a while with your hat off. So does a sentry.`; }},
    {t:'Stay at home. It is hay time.', go:() => { fl('regencySeen'); add({family:-2});
      return `The hay is carried on the nineteenth of June. It is a good crop.

The Mercury gives the fête four columns. The fish have a paragraph to themselves.

Henrietta reads all four columns aloud. She reads the names of the Berkshire company twice. There are nine.`; }}
  ]});

ev({ id:'royalPrincess', from:1813, to:1814, weight:8, cond:() => F('regencySeen') && !F('carolineSeen'), title:'An Address to the Princess',
  text:() => `The Regent has forbidden the Princess of Wales to see her daughter more than once a fortnight. Her letter to him is in the Morning Chronicle. It is three columns. The whole kingdom has read it.

The City of London has voted her an Address. Now there is one on the table at the Bell. “The dutiful and loyal Address of the Inhabitants of Wyvern to Her Royal Highness.” Two hundred have signed. Jem Pryor has made his mark.

${F('mp') ? 'Mr Whitbread will move in the House on Friday. He has written to ask where the Member for Wyvern stands.' : 'The landlord has kept the top line clear. He says it wants a gentleman’s name to lead.'}${F('privyChamber') ? ' You are a Gentleman of the Regent’s Privy Chamber.' : ''}`,
  choices:[
    {t:() => F('mp') ? 'Vote with Mr Whitbread, and sign.' : 'Sign on the top line.', go:() => { fl('carolineSeen'); const pc = F('privyChamber'); if (pc) fl('privyChamber', false); add({goodwill:6, standing: pc ? -5 : -2}); reg('pryor',1); reg('cullerne',-1);
      return `You write your name on the top line. The landlord sands it himself.

The Address goes up to Kensington with four hundred and eleven names. The Princess receives it in a red wig. She thanks the people of Wyvern in a strong German voice.

${pc ? 'A letter comes from the Lord Chamberlain. His Royal Highness has no further occasion for Mr ' + S.sur + ' in his Privy Chamber. The fees are not returned.' : 'Lord Cullerne dines with the Regent at Brighton that month. He is heard to say that Hatherley was always a Jacobin house.'}`; }},
    {t:'Decline. It is between man and wife.', go:() => { fl('carolineSeen'); add({goodwill:-4, standing:3});
      return `“It is between a man and his wife.”

“Yes, sir,” says the landlord. “That is what she complains of.”

The Address goes up without a gentleman’s name. The top line stays clear. Somebody has drawn a pair of whiskers on it.`; }},
    {t:'Let Henrietta sign for the house.', go:() => { fl('carolineSeen'); add({goodwill:3, family:3}); reg('henrietta',2,'You let her sign for the Princess');
      return `Henrietta walks into the Bell in her bonnet. No lady of the county has been inside it before. She signs on the top line. “Henrietta ${S.sur}, a Mother.”

Forty women of Wyvern sign under her that afternoon.

Mrs Tamworth says she never heard of such a thing. She signs on Thursday, with a veil down.`; }}
  ]});

/* ---- The clergy ----
   Eleven papers, most of them taken from real cases of the years they are set in (see docs/SOURCES-clergy.md).
   Dr Gall carries those marked gall; the Rector of Wyvern, Mr Twisleton, carries what would not sit on Mr Oakes. */
const gallHere = () => !F('gallDead');
const CLERGY = [
  {id:'clergy-brothers', hot:true, once:true, title:'The Prince of the Hebrews', w:() => (S.year === 1795 && S.season >= 1) || S.year === 1796, x:() => `Mr Richard Brothers, late a lieutenant in the Navy, has announced that he is Prince of the Hebrews. London is to be swallowed by an earthquake on the King’s birthday. The King is then to hand him the crown. A Member of Parliament has moved that his prophecies be printed.

The Privy Council has shut Mr Brothers up as a lunatic. His book is in its fourth edition.

Mr Twisleton, the Rector of Wyvern, has read it. On Sunday he preached upon it for an hour and ten minutes. He named the day. Nine families in his parish have sold their pigs.`,
    o:[{t:'Write to the Bishop.', go:() => { add({standing:1});
      return `You write to the Bishop of Salisbury. His lordship’s chaplain answers. The Bishop is at Bath. A sermon upon prophecy is not in itself irregular.

The King’s birthday is a fine day. The bells are rung. London stands.

Mr Twisleton preaches the Sunday after. He has gone through the figures again. He had carried a one. It is to be 1798.`; }},
    {t:'Go and hear him.', go:() => { add({goodwill:1});
      return `You ride over and sit under him. He has the Book of Daniel open and a slate. He does the sum in the pulpit, aloud.

It comes out to the fourth of June. He shows the congregation the slate.

The clerk sits below with his own slate. He makes it the ninth of August. Nobody has asked him.`; }},
    {t:'Buy the nine families’ pigs back for them.', note:'£14', go:() => { add({money:-14, goodwill:3});
      return `Fourteen pounds to a dealer at Newbury. He had given nine. The pigs come home on the fifth of June. The city is still standing.

Eight families take their pigs and thank you. The ninth will not.

“We have sold up for Jerusalem, sir. It would not be right to go back on it for a pig.”`; }}]},

  {id:'clergy-arms', hot:true, once:true, title:'The Church Militant', w:() => gallHere() && (S.year === 1798 || yr(1803, 1804)), x:() => `The French are expected. Hatherley has forty Volunteers, eleven muskets and a drum.

Dr Gall has come to parade in a scarlet coat with black facings. He has a sword. It was his grandfather’s at Dettingen. He has given himself the rank of Captain-Chaplain.

The Archbishop has written to every bishop. The clergy are not to take arms. It does not consist with their calling. Dr Gall has the letter in his hat.

“It says arms. It does not say command.”

He is near seventy. He has had the drum moved nearer to him.`,
    o:[{t:'Let him command.', go:() => { add({goodwill:2}); reg('gall',2,'You let him drill the Volunteers');
      return `Dr Gall drills the company on the Common every evening for a month.

He gives the words of command out of the Prayer Book, to be sure of them. “Let us stand.” They stand. He cannot find one for the right wheel.

The men like him. Nobody has ever let them out so early.`; }},
    {t:'Show him the Archbishop’s letter again.', go:() => { add({standing:1}); reg('gall',-2,'You took his company from him');
      return `You read him the Archbishop’s letter on the Common before the men.

He takes off the sword. He gives it to the drummer to hold. He preaches on Sunday from the text “He that hath no sword, let him sell his garment and buy one.”

The scarlet coat is seen again in November. It is on the Vicarage scarecrow.`; }},
    {t:'Make him chaplain, and have him pray before drill.', go:() => { add({goodwill:-1}); reg('gall',1);
      return `He is to be chaplain and to pray before drill.

He prays for forty minutes. He prays against the French by name, from the Directory downward. It is dark when he says Amen.

The company has not yet fixed bayonets this month. It has no bayonets.`; }}]},

  {id:'clergy-tooke', hot:true, once:true, title:'A Doctor of Divinity for Wyvern', w:() => gallHere() && S.year === 1801, x:() => `Mr Horne Tooke has been returned to Parliament for Old Sarum. He is a clergyman. He has not worn the gown these thirty years. He was ordained, and nothing can undo it.

The House is debating whether a priest may sit. Dr Gall has followed every word.

“If a Jacobin in orders may sit for seven burgage plots, sir, I do not see why a sound divine should not sit for thirty-one.”

He has had a card printed. “The Revd. Dr. GALL solicits the Favour of your Vote and Interest.” ${F('mp') ? 'It is your seat that he solicits.' : 'He asks whether your three plots are bespoke.'}`,
    o:[{t:'Tell him to wait for the vote of the House.', go:() => { add({standing:1});
      return `“Let us see what the House says, Doctor.”

The House says that no person in holy orders shall sit in it. The Act passes in June.

Dr Gall has two hundred cards. He writes the week’s texts on the backs. They last him four years.`; }},
    {t:'Promise him your interest.', go:() => { add({standing:-2}); reg('gall',2,'You promised him your votes for Wyvern'); reg('cullerne',-1);
      return `You promise him your interest. He canvasses Pig Lane in his bands. He tells each elector what his soul is worth and asks for his vote after.

Lord Cullerne’s agent sends to know whether Mr ${S.sur} is quite well.

The Act passes in June. No priest may sit. Dr Gall says he was within eleven votes. He has not counted them for anybody.`; }},
    {t:'Ask who would take the duty at Hatherley.', go:() => { reg('gall',-1); meet('oakes'); reg('oakes',1);
      return `“And who would take the duty here, Doctor, from November to July?”

“Oakes takes it now.”

It is the first time he has said so. Mr Oakes is at the other end of the room with a teacup. He looks into it.`; }}]},

  {id:'clergy-informer', hot:true, once:true, title:'Ten Pounds a Month', w:() => gallHere() && yr(1800, 1803), x:() => `Dr Gall is also Rector of Fenny Sutterby, in Lincolnshire. He has held it since ’71. He has not seen it. A curate there has thirty pounds a year and sends the rest.

An attorney’s clerk in Furnival’s Inn has found an Act of Henry the Eighth. A parson absent from his benefice forfeits ten pounds a month. Half goes to the King. Half goes to whoever informs.

The clerk has informed against six hundred clergymen. Dr Gall’s writ is for eleven months. He has brought it up to the Hall in the gig.

“A hundred and ten pounds, sir. To a clerk.”`,
    o:[{t:'Lend him the hundred and ten.', note:'£110', go:() => { add({money:-110}); reg('gall',3,'You paid the informer for him');
      return `A hundred and ten pounds. The clerk’s receipt is very civil.

Parliament stops the suits the next session. A new Act lets a bishop license any parson to live away who can show cause. Dr Gall shows cause. The air of the Fens is bad for his chest.

He repays you in tithe pigs, at his own valuation. There are a great many pigs.`; }},
    {t:'Advise him to go and reside.', go:() => { reg('gall',-1); meet('oakes'); reg('oakes',1); add({goodwill:2});
      return `He goes into Lincolnshire in November to reside. Mr Oakes has Hatherley. The sermons are twelve minutes. There is a fire in the vestry.

Dr Gall is back at Candlemas with an ague. The parsonage at Fenny Sutterby has no roof on the east side. He read himself in to eleven people and a dog.

“They did not know me,” he says. “They knew the dog.”`; }},
    {t:'Fight it at the Assizes.', note:'£30', go:() => { add({money:-30, standing:1}); reg('gall',1);
      return `Thirty pounds to counsel. The defence is that Dr Gall was all the while residing upon another cure of souls.

The judge asks which of his two flocks the Doctor would say he had been feeding. Counsel says both, my lord, by deputy. The court laughs.

Before judgment Parliament stops every such suit in the kingdom. The clerk in Furnival’s Inn is said to have cleared four thousand pounds first.`; }}]},

  {id:'clergy-trusler', once:true, title:'The Same Sermon', w:() => gallHere(), x:() => `Dr Gall and the Rector of Wyvern have exchanged pulpits for the Sunday.

Mr Twisleton preaches at Hatherley on the Unjust Steward. It is a good sermon. It is twenty-two minutes. He reads it from a manuscript in a clear round hand.

At that hour Dr Gall is preaching at Wyvern. He preaches on the Unjust Steward. Mr Tamworth was at Wyvern in the morning and is at Hatherley for Evensong. He says it was the same sermon to the word.

Dr Trusler of Bath sells sermons at a shilling. They are printed in a type cut to look like writing, so that the gallery may not know.`,
    o:[{t:'Say nothing.', go:() => { reg('gall',1);
      return `You say nothing. Mr Tamworth says it at eleven dinner-tables.

The next Sunday Dr Gall preaches a sermon of his own. It is fifty minutes, upon the Hittites. He looks at the Hall pew at every heading.

By the fourth heading Mr Tamworth is asleep.`; }},
    {t:'Send to Bath for the whole set.', note:'£3', go:() => { add({money:-3, goodwill:1}); reg('gall',-2,'You followed his sermon in Trusler');
      return `Three pounds for sixty sermons in a box. You take the box to church.

Dr Gall gives out his text. You find the place. You follow him down the page with your finger. At the foot he looks up. He sees the finger.

He turns two leaves at once. The Unjust Steward ends as the Prodigal Son.`; }},
    {t:'Ask him which he thinks the best of them.', go:() => { reg('gall',2); add({standing:1});
      return `You ask him over the port which of Dr Trusler’s he thinks the best.

He is silent a minute.

“Number nineteen. On Charity. I have preached it since ’84. I shall be sorry to lose it.”

You tell him he need not. He preaches it at Christmas. Mr Tamworth is in the front pew with his lips moving.`; }}]},

  {id:'clergy-tithe', title:'Tithe Turnips', w:() => gallHere(), x:() => `Dr Gall takes his tithe in kind. Every tenth sheaf, the tenth lamb, the tenth pail of milk.

Mr Hartopp has sown forty acres of turnips. Dr Gall claims the tenth turnip. Hartopp has taken advice. The law says he must set the tithe out and give the parson notice of the hour.

The notice is on your table for you to witness. “Mr Hartopp will draw turnips in the Forty Acres on Tuesday at two in the morning and on each morning following. He will draw twenty. The Revd. Dr Gall may attend for his two.”

Both men are in your library. Neither has sat down.`,
    o:[{t:'Witness the notice. It is the law.', go:() => { reg('hartopp',2,'You witnessed his turnip notice'); reg('gall',-2);
      return `You sign.

Dr Gall’s man is in the Forty Acres at two in the morning for nine nights with a lantern and a sack. He carries home eighteen turnips. On the tenth night he does not come.

Hartopp draws four acres before breakfast. He is fined at the next visitation for brawling in the vestry. He says it was worth forty acres.`; }},
    {t:'Have them compound for money.', go:() => { add({standing:2}); reg('gall',1); reg('hartopp',1);
      return `You keep them in the library until five. Hartopp is to pay four shillings an acre and keep his turnips. Dr Gall is to stay out of the field.

They shake hands on it. Each tells you privately that he has had the better of the other.

The paper is in your hand. Both ask for the original. You have it copied twice and keep the original.`; }},
    {t:'Tell Hartopp a parson must live.', go:() => { reg('gall',2,'You stood by his tithe'); reg('hartopp',-2); add({goodwill:-2});
      return `“The tithe is his freehold, Hartopp. As the land is yours.”

Hartopp sets out every tenth turnip in a row along the headland and sends for the tithe cart. The row is half a mile.

They are the smallest turnips ever seen in Berkshire. He has been three days choosing them.`; }}]},

  {id:'clergy-school', hot:true, once:true, title:'Methodism in the Schoolroom', w:() => gallHere() && yr(1800, 1803), x:() => { meet('oakes'); return `Mr Oakes keeps a Sunday school over the stable at the curate’s house. Forty children learn their letters out of the Catechism. In the evening their mothers come and he reads them a chapter.

Dr Gall has a pamphlet from Somersetshire. A curate at Blagdon has charged Mrs Hannah More’s schools with Methodism. There have been twenty-three pamphlets since. Dr Gall has read nine.

“Prayer without the book, sir. Women, after dark. It begins so. I shall have it shut.”

Mr Oakes says he prays from the book. He says the women come after dark because they work until dark.`; },
    o:[{t:'Stand by the school.', go:() => { add({goodwill:4}); reg('oakes',2,'You stood by his school'); reg('gall',-2,'You kept the curate’s school open against him');
      return `“The room is over my stable, Doctor. I do not shut it.”

Dr Gall writes a pamphlet. “A Letter to a Country Gentleman on the Danger of Unlicensed Instruction.” It sells eleven copies. He bought six.

The school goes on. At Christmas forty children can read the pamphlet.`; }},
    {t:'Go and sit at the back on Sunday evening.', go:() => { add({goodwill:2}); reg('oakes',1);
      return `You sit at the back among the mothers. There are twenty-six. Mr Oakes reads the fifteenth of Luke. He reads it from the book and shuts the book.

A carter’s wife asks why the elder son was not given a kid. Mr Oakes says he has often wondered. They talk of it for half an hour.

You tell Dr Gall there was no praying without the book. You do not tell him about the kid.`; }},
    {t:'Let the Vicar shut it. It is his parish.', go:() => { add({goodwill:-4}); reg('gall',2); reg('oakes',-2,'You let his school be shut');
      return `The room over the stable is locked. Dr Gall keeps the key.

On Sunday evening twenty-six women are in Dewey’s barn. A shoemaker from Hungerford is reading to them. He has no book at all.

Mr Oakes walks past the barn with his hat pulled down. He does not go in. He walks past it again.`; }}]},

  {id:'clergy-burial', hot:true, once:true, title:'A Child at the Lich-gate', w:() => yr(1809, 1810), x:() => `A child of two has died at Wyvern. Her father is a Baptist weaver. She was baptised in his meeting-house with water and the proper words.

Mr Twisleton will not bury her. He says she was never baptised in the eye of the Church and is no Christian. He has locked the lich-gate.

The coffin has been on two chairs in the road since ten o’clock. Forty people are standing by it. The father has his hat off. It has begun to rain.

A rector in Rutland did the same last year. The Court of Arches has him before it now. You are the nearest magistrate.`,
    o:[{t:'Tell Twisleton to open the gate.', go:() => { add({goodwill:4, standing:1});
      return `“You will open that gate, sir. You will read the service. I shall stand here while you do it.”

He opens the gate. He reads the service very fast, with his back to the father. He leaves out the word “sister”.

In December the Court of Arches gives judgment against the Rutland rector. He is suspended three months. Mr Twisleton reads the report and has a cold for three Sundays.`; }},
    {t:'Send for Mr Oakes to read it.', go:() => { meet('oakes'); add({goodwill:3}); reg('oakes',1,'He buried the Baptist’s child at Wyvern');
      return `Mr Oakes comes over from Hatherley on foot, six miles, with his surplice in a bag.

Mr Twisleton will not open the gate to another clergyman. Mr Oakes reads the whole service in the road, over the two chairs, in the rain. Then the sexton lifts the coffin over the wall. Nobody has told him not to.

The Bishop writes to Mr Oakes. It is not a reprimand. It is not anything else.`; }},
    {t:'It is a matter for the Church courts.', go:() => { add({goodwill:-4, standing:1});
      return `“I have no power inside that gate.”

The coffin is carried back up the street. She is buried on Thursday behind the meeting-house, between the wall and the dye-works.

The weaver has the Rutland judgment printed at his own cost when it comes. He nails one to the lich-gate. It is taken down. He nails another.`; }}]},

  {id:'clergy-bishop', once:true, title:'The Bishop at Wyvern', w:() => S.year >= 1798, x:() => `The Bishop of Salisbury confirms at Wyvern on Thursday. He has not been in this corner of the diocese for seven years.

Four hundred and sixty candidates are come in from nineteen parishes. Some are twelve. One is a grandmother. The Bishop has to dine at Newbury at four.

He will lay his hands on them at the rail in rows of twenty, and say the words once for each row.

His lordship lies the night at Hatherley. His chaplain has sent the particulars. His lordship takes his port at blood heat. He does not eat veal.`,
    o:[{t:'Give him a proper dinner.', note:'£25', go:() => { add({money:-25, standing:4}); reg('henrietta',1);
      return `Twenty-five pounds. Turbot, a saddle of mutton, no veal. The port stands an hour before the kitchen fire.

The Bishop confirms four hundred and sixty in fifty minutes. A boy from Kintbury goes up with two rows and is confirmed twice. He asks whether it counts double.

His lordship tells Henrietta that he has not been so comfortable since Lambeth. He falls asleep at nine with his wig on the fire-screen.`; }},
    {t:'Give him what the house has.', go:() => { add({standing:-1, goodwill:1});
      return `Boiled mutton and a batter pudding. The port is as cold as the cellar.

The Bishop eats very little. He asks the chaplain something in Latin. The chaplain looks at the port.

At the church he does the four hundred and sixty in forty minutes. He is at Newbury by three.`; }},
    {t:'Ask him for a living for Mr Oakes.', note:'£25', go:() => { meet('oakes'); add({money:-25, standing:2}); reg('oakes',2,'You spoke to the Bishop for him');
      return `Twenty-five pounds in turbot and mutton. Over the port you name Mr Oakes. Forty pounds a year, the whole duty, twelve-minute sermons.

“Twelve?” says the Bishop. He takes out a pocket-book. He writes “Oakes. 12 min.”

Nothing comes of it that year. But the chaplain writes to Mr Oakes for a copy of a sermon.`; }}]},

  {id:'clergy-hunting', title:'The Rector of Wyvern Takes a Funeral', x:() => `Mr Twisleton hunts three days a week with Lord Cullerne’s hounds. He keeps two horses on a living of four hundred.

Old Mrs Gabb was to be buried at Wyvern on Tuesday at eleven. The hounds met at Hatherley Copse at half past ten. They found at once and ran straight through Wyvern churchyard.

Mr Twisleton pulled up at the grave. He read the service from the saddle in eleven minutes. He was with the hounds again at the second check.

The Gabbs are maltsters. They have come to you. They say there were spurs under the surplice the Sunday before.`,
    o:[{t:'Write to the Bishop.', go:() => { add({goodwill:2}); reg('cullerne',-1);
      return `You write to Salisbury. The answer is six weeks coming.

His lordship has spoken to Mr Twisleton. Mr Twisleton has undertaken not to read the burial service on horseback.

He keeps his word. At the next hunting funeral he gets down and gives a boy the reins.`; }},
    {t:'Speak to him at the covert side.', go:() => { add({standing:1});
      return `You ride up to him at the covert side on Thursday.

“The Gabbs are hurt, Twisleton.”

“I gave her every word, ${S.sur}. I left nothing out. Old Gabb hunted till he was seventy. He would have had me do it.” The hounds find. He is gone before you have answered.

He sends the Gabbs a brace of pheasants. They are yours. He shot them on Tuesday week.`; }},
    {t:'Tell the Gabbs she is buried either way.', go:() => { add({goodwill:-3});
      return `“She is as well buried as any woman in Berkshire, Mr Gabb.”

Mr Gabb puts on his hat in your hall.

The Gabbs take a pew at the Independent chapel in Mill Lane. They take eleven maltsters’ families with them. Mr Twisleton says it leaves more room for the horses.`; }}]},

  {id:'clergy-southcott', hot:true, once:true, title:'Shiloh', w:() => S.year === 1814, x:() => `Joanna Southcott of Devonshire is sixty-four. She has announced that she is with child by the Holy Ghost. The child is to be called Shiloh and will be born before Christmas. Nine physicians have examined her. Six say she is.

Her followers are sealed. Each has a half-sheet of paper signed by Joanna and closed with red wax. A hundred thousand are said to be out. A crib of satinwood and gold has been made in Aldersgate Street for two hundred pounds.

Mr Twisleton has been sealed. He has stopped hunting. He is collecting in Wyvern for a silver pap-spoon. Mrs Bunce has a seal in her tea-caddy. She had it of the pedlar for a shilling.`,
    o:[{t:'Give a guinea to the pap-spoon.', note:'£1', go:() => { add({money:-1, goodwill:2});
      return `A guinea. Mr Twisleton writes your name in the book between a duchess’s housekeeper and a tallow-chandler.

Joanna dies on the twenty-seventh of December. The surgeons open her. There is no child.

Mr Twisleton keeps the spoon. He says the birth was spiritual and the spoon may yet be wanted. He is hunting again by February. He says grace with his eyes open.`; }},
    {t:'Take Mrs Bunce’s seal away.', go:() => { add({goodwill:-2, standing:1});
      return `You have the seal out of the tea-caddy and put it on the kitchen fire.

Mrs Bunce watches it burn. She says nothing. The dinner that day is cold mutton. So is the next.

Joanna dies on the twenty-seventh of December. There is no child. Mrs Bunce says that she would have been saved the disappointment if she had been let keep the paper.`; }},
    {t:'Ask Mrs Bunce what the seal says.', go:() => { add({goodwill:1, family:1});
      return `She brings it up on a plate. “The Sealed of the Lord. The Elect, Precious. Man’s Redemption to inherit the Tree of Life.” Under it, “Joanna Southcott”, in a hand that slopes down the page.

“I do not hold with it, sir. But it was only a shilling. One would look very foolish without.”

Joanna dies on the twenty-seventh of December. There is no child. The seal stays in the caddy. Mrs Bunce says it keeps the tea dry.`; }}]}
];
pooled('clergy', CLERGY, 'clg', {from:1795, to:1815, weight:6, repeatGap:3});

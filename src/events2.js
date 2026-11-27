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
    {t:'Take a bucket and join the line.', go:() => { add({money:-300, goodwill:3});
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
    {t:'Accept.', go:() => { const r = Math.random();
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

ev({ id:'enclosure', from:1797, to:1809, weight:3, cond:() => !F('enclosed') && !S.project && !F('encloseRefused'), title:'The Common Question',
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

ev({ id:'bath', from:1796, to:1814, weight:2, repeatGap:16, title:'Henrietta’s Rheumatism',
  text:() => `The Tamworths went to Bath on Monday. On Tuesday Henrietta has rheumatism in both shoulders.

Mr Ferris the surgeon is sent for. He looks at her tongue. He looks at you.

“The Bath waters, sir. Six weeks. Taken warm, in company.”

Lodgings in Pulteney Street are four guineas a week this season. Ferris has tasted the water. “A blacksmith has cooled his irons in it. That is the virtue.”`,
  choices:[
    {t:'Six weeks at Bath.', note:'£350', go:() => { add({money:-350, family:8, standing:2}); reg('henrietta',2);
      return `Three glasses a day in the Pump Room, with a band playing. A chair to the Assembly every evening. Three hundred and fifty pounds.

The rheumatism is gone by the second Tuesday.

You lose eleven pounds at whist to a clergyman. You meet the Tamworths nine times in six weeks. Each time, everybody is surprised.`; }},
    {t:'A fortnight at Cheltenham, which is cheaper.', note:'£150', go:() => { add({money:-150, family:3});
      return `Cheltenham. A hundred and fifty pounds. The King took these waters in ’88. He went out of his mind in the autumn.

The water is salt. It acts within the hour. You do not stray far from the lodgings.

Henrietta says she is much better. She does not ask to go again.`; }},
    {t:'A mustard plaster, at home.', go:() => { add({family:-5}); reg('henrietta',-2,'You prescribed mustard when she wanted Bath');
      return `A mustard plaster, morning and night. She bears it for six weeks. She can be heard bearing it from the library.

The Tamworths write from Bath on Tuesdays and Fridays. Henrietta reads each letter aloud at breakfast, from “My dearest Henrietta” to the postscript.`; }}
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
  text:() => `Mr Nokes the overseer has brought the parish books. The poor rate has trebled since the war began, ${F('speen') ? 'the bread scale having done just what any child could have foretold, ' : ''}and the farmers who pay it are muttering.

He has two remedies. One is the roundsman system: unemployed men are sent round the farms in turn, each farmer to find them work at sixpence a day, and the parish to add the rest. The other is a House of Industry: all relief to be given inside a workhouse, husbands on one side and wives on the other. “It reduces applications wonderfully,” says Nokes.`,
  choices:[
    {t:'Build the House of Industry.', note:'£400', go:() => { fl('workhouse'); S.poorMult *= 0.6; add({money:-400, goodwill:-10, standing:1}); reg('pryor',-1);
      return `It is built of brick at the end of the Kintbury lane, with high windows, so the inmates may have light and not a view. Applications fall by two thirds within the quarter, as Nokes promised. People will bear a great deal sooner than go in. That is the whole secret of the system, and they call it economy.`; }},
    {t:'Try the roundsmen.', go:() => { fl('roundsmen'); S.poorMult *= 0.85; add({goodwill:-5});
      return `Each morning the men without work stand by the pound, and the farmers look them over and take their pick, as at a sale of horses. A roundsman works slowly, since he is paid the same whatever he does; and the farmer wastes him, since he costs sixpence. It is cheaper than before, and it makes every man concerned in it a little worse.`; }},
    {t:'Leave the rates alone, and find winter work on the estate.', note:'£120', go:() => { add({money:-120, goodwill:6});
      return `You set twenty men to scouring ditches, mending the park pale and digging a ha-ha you do not need. It costs a hundred and twenty pounds and saves the rates perhaps eighty. Nokes regards it as bad arithmetic. The ha-ha is a great success; a cow falls into it the first week.`; }}
  ]});

ev({ id:'edmundLetter', from:1798, to:1814, weight:3, repeatGap:10, cond:() => (E() === 'army' || E() === 'navy') && !F('edmundDead'), title:'A Letter from Edmund',
  text:() => { const y = S.year; let body;
    if (E() === 'army') {
      if (y <= 1800) body = `“We are in barracks at Chelmsford, where it rains, and have been reviewed four times by generals who all said the same thing. I have learnt to shave in cold water and to sleep on parade. Tamworth of ours has a tame jackdaw that says ‘Damn the French’, and one other thing, which I shall not write down for my mother.”`;
      else if (y <= 1802) body = `“We landed through the surf at Aboukir under such a fire as I hope never to see again, and beat them at Alexandria, where poor Sir Ralph got his death. I have seen the Pyramids, at a distance. They are large. I have also had the ophthalmia, like half the army, and for three weeks saw nothing whatever, which I am told is the same view at less expense.”`;
      else if (y <= 1807) body = `“Shorncliffe Camp. Sir John Moore drills us from dawn in a new manner: we are to skirmish in pairs, think for ourselves, and not flog the men except for cause. The old officers say the army is going to the dogs. I have never been so tired or so happy. From the cliff, on a clear day, one sees the French tents at Boulogne quite plain, and their washing.”`;
      else if (y <= 1809) body = `“I write this from Plymouth, alive, which is more than I looked for a month since. We marched two hundred and fifty miles through the snow to Corunna with the French at our heels. I saw men sell their boots for rum and lie down in the road. Sir John is dead; we buried him in his cloak on the ramparts by lantern light. I have no stockings and have eaten a mule.”`;
      else if (y <= 1812) body = `“Lord Wellington has us before Badajoz, in mud to the knee. He is a cold, long-nosed man who dresses like a banker and is never wrong, and the men would follow him anywhere, out of curiosity. My Portuguese servant has stolen a pig. I have reprimanded him, and we dine on it Thursday.”`;
      else body = `“We are over the Pyrenees and into France, where to our astonishment the peasants sell us eggs and call us deliverers. Lord Wellington hangs any man who plunders, so that the French prefer our army to their own. I am grown quite brown, and I have forgotten how to sleep in a bed. Pray tell my mother I wear the flannel.”`;
    } else {
      if (y <= 1799) body = `“We have been off Brest eleven weeks, standing in and out, looking at the French fleet, which lies in harbour looking at us. Nothing has occurred, save that the purser’s goat ate the Captain’s copy of the signal book and was in consequence the only creature aboard who knew the private signals. I am rated master’s mate, and can take a noon sight without disgracing myself.”`;
      else if (y <= 1802) body = `“We were at Copenhagen under Lord Nelson, who when signalled to leave off put the glass to his blind eye, and said he really did not see it. I had charge of three guns on the main deck. The noise is beyond anything; one hears it afterwards for days, like the sea in a shell. I have passed for lieutenant. Captain Holloway said, ‘I suppose you will do,’ which the gunroom assures me is rapture.”`;
      else if (y <= 1805) body = `“Two years this month on the blockade of Toulon, and I have not set foot ashore in fourteen months. We live upon salt beef as old as I am and lemons from Sardinia. Lord Nelson knows the name of every lieutenant in the fleet and has asked after my father’s turnips. I had mentioned them once, at his table, for want of anything else to say.”`;
      else if (y <= 1810) body = `“Since Trafalgar there are no French at sea for us to fight, and we convoy merchantmen from the Baltic at four knots, like dogs set to mind geese. The most considerable event in the last quarter was the loss of the wardroom cheese overboard in a gale off the Skaw. I am first lieutenant now, Holloway being too gouty to interfere, and I find that I can command a ship. It is a strange thing to discover at sea level.”`;
      else body = `“We are on the American station, chasing Yankee frigates that are bigger than ours and sail two feet to our one. They took the Guerriere and the Java, and all England is in a pet about it. For my part I think a Navy that has had no one to fight for seven years may be the better for a beating. I am made Commander, into a sloop of eighteen guns. She leaks, and I love her.”`;
    }
    return `A letter from Edmund, much crossed, and franked by somebody else’s uncle.\n\n${body}`; },
  choices:[
    {t:'Send him fifty pounds.', note:'£50', go:() => { add({money:-50, family:2}); reg('edmund',1,'You sent money when he was on service');
      return `The draft goes off by the next packet. He will spend it, you gather from the reply some months later, on a ${E() === 'army' ? 'horse, a boat-cloak, and a dinner for his company' : 'sextant, a sea-cloak, and a dinner for the gunroom'}; in what proportions he does not say.`; }},
    {t:'Write him four sides about the estate.', go:() => { add({family:3}); reg('edmund',1);
      return `You write of the wheat, the lambing, who is dead, who is married, and what the bay mare has done to the coach-house door. It is, you suspect, dull stuff. You do not learn until much later that he reads these letters aloud, to ${E() === 'army' ? 'his mess' : 'the gunroom'}, and that there are ${E() === 'army' ? 'officers in the Peninsula' : 'lieutenants on the Brest blockade'} who follow the affairs of Hatherley as other men follow a novel in parts.`; }},
    {t:'Let Henrietta answer. She has knitted him something.', go:() => { add({family:1}); reg('henrietta',1);
      return `Henrietta sends eleven sides, two flannel waistcoats, a plum cake, and a receipt against the flux. The cake arrives, by his account, in a condition “of the greatest interest to the surgeon”.`; }}
  ]});

ev({ id:'edmundHome', from:1803, to:1806, weight:3, cond:() => E() === 'home', title:'Edmund and the Volunteers',
  text:() => `Edmund is rising thirty, knows the estate better than you do, and has been restless ever since the war began again. Half the young men he was at school with are at sea or in Sicily. He has been offered a captaincy in the Berkshire Militia, which would take him from home for the length of the war.

Or he might stay, he says, not looking at you, and you might give him Kennet Bottom to farm on his own account, and the hand of nobody in particular, though he has lately been a good deal at the Lovedays’.`,
  choices:[
    {t:'Let him take the militia captaincy.', go:() => { fl('edmund','militia'); add({family:-2, standing:2}); reg('edmund',2,'You let him go for a soldier at last');
      return `He marches the Berkshires to Ipswich, then Dover, then Dublin, guarding coasts on which nobody lands. It is not Italy. But he comes home on leave with a straight back and a habit of command, and the sulking in the gun room is over for good.`; }},
    {t:'Give him Kennet Bottom, and your blessing on Miss Loveday.', note:'£300', go:() => { fl('edmund','farmer'); fl('edmundMarried'); S.improve += 1; add({money:-300, family:8}); reg('edmund',3,'You gave him a farm of his own and a wife'); reg('henrietta',2);
      return `He marries Sophia Loveday in the spring: a brisk, freckled girl who can judge a heifer and is not afraid of Henrietta. He drains Kennet Bottom, puts it down to Swedes, and within three years is getting more off it than the last tenant thought possible. There is a grandson by 1806, who is named after your uncle, and bites.`; }},
    {t:'Tell him his duty is here, as your son.', go:() => { add({family:-5}); reg('edmund',-3,'You kept him at home a second time');
      return `He says, “Yes, sir.” He goes on being your steward in all but name, exact, obliging and shut like a box. In the evenings he reads the Gazette to himself, with his finger under the names.`; }}
  ]});

ev({ id:'kittyBotany', from:1806, to:1812, weight:2, cond:() => K() === 'free' && !F('dubreuilWaits'), title:'Miss Kitty and the Orchids',
  text:() => `Kitty is ${kittyAge()} and has refused four men, including a rural dean. She has taken to botany. She has found on Hatherley Down a small green orchid which is in no book, has drawn it with great exactness, and wishes to send the drawing and a dried specimen to Sir Joseph Banks at the Royal Society.

Henrietta says that a woman who writes to learned societies will never be asked for again. Kitty says that this had occurred to her.`,
  choices:[
    {t:'Frank the letter yourself, and buy her a proper microscope.', note:'£40', go:() => { fl('kittyBotanist'); add({money:-40, family:3}); reg('kitty',3,'You bought her a microscope and sent her orchid to Sir Joseph Banks'); reg('henrietta',-1);
      return `Sir Joseph replies in his own hand, three sides. The orchid is new. It is to be figured in Sowerby’s English Botany, and “your daughter, sir, draws better than half my correspondents and observes better than the rest”. Kitty reads this standing in the hall, twice, and then goes out on to the Down without a bonnet, in the rain.`; }},
    {t:'Let her send it, under a gentleman’s initials.', go:() => { add({family:-1}); reg('kitty',-1,'You made her sign her orchid with a man’s initials');
      return `The orchid goes to London as the discovery of “K. ${S.sur[0]}., Esq.” Sir Joseph replies to that gentleman with the highest compliments and an invitation to dine at Soho Square, which that gentleman is obliged to decline, on the ground that she does not exist.`; }},
    {t:'Forbid it, and ask the rural dean to dinner again.', go:() => { add({family:-5}); reg('kitty',-3,'You stopped her orchid and sent for the rural dean'); reg('henrietta',1);
      return `The rural dean comes, and talks for two hours about the tithe on hops. Kitty is perfectly civil to him. The orchid is described six years later by a clergyman from Dorking, who names it after himself.`; }}
  ]});

ev({ id:'smugglers', from:1805, to:1813, weight:1, title:'Brandy for the Bench',
  text:() => `Since Bonaparte closed the ports of Europe, French brandy has become a rarity, a patriotic sacrifice, and four pounds a dozen. This morning Mudge found two half-ankers of it under the straw in your own cart shed, with a chalk mark on the lid.

It is, he explains to your boots, “the gentleman’s share”. The free traders run it up from Christchurch by night through six parishes, and a tub is left for every magistrate along the road, as it was for your uncle, by way of thanking him for his sound sleep.`,
  choices:[
    {t:'Sleep soundly.', go:() => { fl('brandy'); add({family:2, standing:1});
      return `The brandy is superb. You give a dinner on it. The Chairman of Quarter Sessions holds his glass to the candle, observes that it reminds him strongly of his own, and nothing further is said by anybody, that evening or afterwards.`; }},
    {t:'Hand the tubs to the Excise.', go:() => { add({standing:2, goodwill:-5});
      return `The Riding Officer comes for the tubs with an escort of dragoons, and stares at you as at a prodigy of nature. That winter the carrier’s cart no longer calls at Hatherley, the Wyvern grocer cannot oblige you with tea, and your gates, which were never left open in your uncle’s day, are left open nightly, with great care.`; }},
    {t:'Have Mudge leave them where he found them, untouched.', go:() => { add({goodwill:1});
      return `The tubs stay three nights under the straw and on the fourth are gone, with the chalk mark neatly rubbed out. You have refused the bribe and declined to inform. It is an awkward position, morally, and you occupy it with your usual dignity.`; }}
  ]});

ev({ id:'threshHire', from:1806, to:1811, weight:1, cond:() => !F('thresher'), title:'Mr Hartopp’s Engine',
  text:() => `Hartopp has set up a threshing machine, on the Scotch plan, worked by four horses walking in a circle. It beats out forty quarters of wheat in a day. Twelve men with flails would be a week about it.

He will have his millwright build you one for a hundred and fifty pounds. “The flail,” says Hartopp, “is a stick tied to another stick. We are in the nineteenth century, sir.” His labourers, standing round the engine with their hands hanging, look at it as people look at a new grave.`,
  choices:[
    {t:'Order one.', note:'£150', go:() => { fl('thresher'); S.improve += 1; add({money:-150, goodwill:-7}); reg('hartopp',2,'You set up a threshing machine on his plan'); reg('pryor',-1);
      return `It arrives in three wagons and is put together in the great barn. When the horses start, the whole building hums like a hive. Your wheat is at market in October instead of March. Threshing was the one sure employment of a Hatherley winter, from Martinmas to Candlemas, by the light of a lantern. The lanterns stay on their hooks this year.`; }},
    {t:'Stay with the flail.', go:() => { add({goodwill:3}); reg('hartopp',-1);
      return `You keep your stick tied to another stick. All winter the sound comes from the barn, two men to a floor, turn and turn about, as it has since the Conquest. Hartopp says you are farming in the reign of Henry the Second. Twelve families are aware of it, and grateful.`; }}
  ]});

ev({ id:'cobbett', from:1805, to:1814, weight:1, title:'A Man on a Grey Cob',
  text:() => `A burly, red-faced man on a grey cob has ridden through Hatherley, stopped at every cottage, asked what the labourers earn and what they eat, and written the answers in a book. He turns out to be Mr William Cobbett, of the Political Register.

He has asked at the Bell whose estate this is. He dines there tonight. Whatever he decides about you will be read on Saturday by forty thousand people, at a shilling and a halfpenny the copy.`,
  choices:[
    {t:'Ask him to dine at the Hall.', go:() => { const good = S.goodwill >= 55;
      if (good) { add({standing:4, goodwill:2}); return `He eats like a ploughman and talks like a thunderstorm, of paper money, sinecures, tea, potatoes and Scotch economists, all of which he detests. On Saturday the Register describes Hatherley as “one parish in Berkshire where I saw a labourer with bacon in his chimney and not a workhouse in his eye; and for this the landlord, a plain sensible man, is entitled to the thanks of every Englishman.” Henrietta has it by heart.`; }
      add({standing:-5, goodwill:1}); return `He eats your mutton, praises it, and asks across the table what your labourers had for dinner. On Saturday the Register devotes two columns to Hatherley, beginning: “I dined with the Squire off a saddle of mutton. I had previously looked into eleven of his cottages, and in not one of them did I see so much as would bait a mousetrap.” Lord Cullerne tells you not to mind it. He has it by heart.`; }},
    {t:'Let him form his own opinion.', go:() => { if (S.goodwill >= 55) { add({standing:2}); return `The Register says of Hatherley only that the people “have not the look of being hunted”. From Cobbett, it is a testimonial.`; }
      add({standing:-3}); return `The Register gives Hatherley a paragraph. It contains the phrase “skin and grief”. You are not named. Everybody in Berkshire can supply the name.`; }},
    {t:'Have the constable move him on as a vagrant.', go:() => { add({standing:-6, goodwill:-3});
      return `It is, perhaps, the least wise act of your magistracy. Mr Cobbett owns a newspaper. For three successive Saturdays, forty thousand readers are entertained with the history of the Squire of Hatherley, his constable, his cottages, and his uncle.`; }}
  ]});

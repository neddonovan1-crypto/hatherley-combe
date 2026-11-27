/* Henrietta at the Hall, or at Bath: hh(home, away) picks the reading for dated papers. */
const hh = (home, away) => F('henriettaAway') ? away : home;
/* The fixed calendar: what history brings to the door, and when. */
const EVENTS = [];
const ev = e => EVENTS.push(e);
const K = () => S.flags.kitty || 'free';
const E = () => S.flags.edmund || null;
const kittyAge = () => 17 + (S.year - 1795);

ev({ id:'speen', fixed:'1795-0', title:'The Pelican at Speen',
  text:() => `The Pelican at Speen, the sixth of May. The Berkshire bench sits down to a turbot.

The business is on a half-sheet beside each plate. Wheat is at seventy-five shillings. The quartern loaf is elevenpence in Newbury market. A labourer in this county has eight shillings a week. Dr Gall waits until the fish has been carried out before he stands.

“Gentlemen, I shall not ask the farmer for a penny. Let wages lie. Let the parish make each family up from the rates, by a table. When the gallon loaf is a shilling, three shillings to the man and eighteenpence to every mouth he feeds. When the loaf rises, the table rises.” He holds his paper out over the cloth. “Who is with me?”

Nobody moves. The Doctor turns his whole body in his chair until it faces you.

“Mr ${S.sur}?”`,
  choices:[
    {t:'Second him.', go:() => { fl('speen'); add({goodwill:4, standing:1}); reg('gall',2,'You seconded his bread scale at Speen');
      return `“Seconded.” The show of hands takes less time than the carving did. A clerk is called in to copy the table fair for the Reading Mercury.

Hartopp has a pencil out before the cheese comes. He writes on the back of his half-sheet, turns it round and pushes it across to you. “Parish makes a man up to 9s. I pay him 6s. Parish finds 3s.” Under that he has drawn a line. Under the line: “Why pay 6?”

Your name goes to Reading second on the list.`; }},
    {t:'Stand. Move that the bench fix a wage by the price of bread, and pay it at Hatherley yourself.', go:() => { fl('wages'); add({goodwill:9, standing:-3}); reg('gall',-1); reg('hartopp',-1,'Thinks your wages will ruin him'); reg('pryor',1);
      return `You stand. You say the bench has power under the statute of Elizabeth to fix a wage. You say it should fix one by the price of bread. You say the farmer who hires a man should be the one to feed him.

“Ruin,” says Hartopp. Somebody asks whether Mr ${S.sur} holds shares in Whitbread’s brewery. Dr Gall puts it to the vote out of politeness. Three hands go up.

On Monday you raise every man at Hatherley to nine shillings. On Sunday there are faces in church from Kintbury and Inkpen that you have never seen there before. They have walked over to look at you.`; }},
    {t:'Help yourself to the turbot.', go:() => { add({goodwill:-3, standing:1});
      return `You help yourself to the turbot. The table is carried round you.

Afterwards, in the yard, your horse is brought by an ostler you do not know. The taproom window stands open behind him. He holds the stirrup. He does not touch his hat until you are in the saddle and looking down at him.`; }}
  ]});

ev({ id:'flour', fixed:'1795-1', title:'The Old Price',
  text:() => `Wyvern, market day. You hear it from the bridge.

Pocock’s cart is stopped in the corn market with its tailboard down. A dozen Hatherley women have his sacks open on the cobbles. Sukey Pryor has the peck measure in one hand and her youngest on her hip. “Old price! Old price and honest measure!” A girl of ten takes the money. She carries each coin across to the miller and drops it into his hat.

Pocock holds the hat in both hands. He has not put it down and he has not put it on. He sees you over the heads. “Mr ${S.sur}! You are a magistrate, sir! I call on you!”

The selling stops. Sukey Pryor looks at you. She does not put down the measure.`,
  choices:[
    {t:'Read the Riot Act and send for the Volunteers.', go:() => { fl('riotAct'); add({standing:3, goodwill:-10}); reg('pryor',-2,'You read the Riot Act at his wife'); reg('gall',1);
      return `You climb the steps of the Corn Exchange and take off your hat. “Our Sovereign Lord the King chargeth and commandeth all persons, being assembled, immediately to disperse themselves.” It is done in under a minute. Your voice cracks on “habitations”.

They have one hour by law. Nobody goes. The selling starts again, faster. You stand on the steps for fifty minutes with the Act in your hand.

The Volunteers trot in at ten minutes to the hour. The cobbles are white. The sacks are folded on the cart. Pocock is counting. Sukey Pryor walks past the steps with her flour on her head and the child asleep. “Good day, sir.” Nobody else from Hatherley says it to you that week.`; }},
    {t:'Buy the whole cart yourself and let them carry on.', note:'£140', go:() => { add({money:-140, goodwill:8, standing:-2}); reg('cullerne',-1,'Thinks you bought off a mob'); reg('pryor',1,'You paid for his wife’s flour');
      return `“What is the load worth today, Pocock?” He tells you. “And at the old price?” He tells you that too. You write him a draft on Tidmarsh’s bank for the difference. One hundred and forty pounds.

Pocock folds it small and puts it inside his coat. He does not thank you. The women do, three cheers, and then they go back to the sacks.

Lord Cullerne’s groom is outside the George holding a horse. He has watched all of it. He will be at the Castle before you are home.`; }},
    {t:'Take Pocock aside and mention his lease.', go:() => { fl('millerCowed'); add({goodwill:4, standing:1});
      return `You get down and take Pocock by the elbow. Ten yards off, by the pump, you ask him when his lease falls in.

“Michaelmas, sir.”

“So I thought. It is a pretty mill.”

He looks at the pump for some time. Then he walks back to his cart. “Old price,” he tells the women. “This week. Out of Christian feeling.” He says it a second time, louder.

That evening he drives home past your gate. He keeps his eyes on the horse.`; }}
  ]});

ev({ id:'powder', fixed:'1795-2', title:'A Guinea a Head',
  text:() => `The collector’s paper comes with the morning post. “Certificate for Using Hair Powder. One Guinea.” One certificate for every powdered head in the house.

You count heads at breakfast. ${hh(`Henrietta has worn powder every day since she was twelve.`, `Henrietta is at Bath and must take out her own there.`)} Edmund has not had his hair dressed for a week. He wants it cut short, the way the Duke of Bedford’s friends are wearing it. The two footmen stand by the sideboard. Both are called John. Both are white to the collar.

${hh(`Henrietta puts down her cup. “Well?”`, `The collector’s man is waiting in the hall.`)}`,
  choices:[
    {t:'Pay for every head in the house, footmen and all.', note:'8 guineas', go:() => { add({money:-9, standing:3, family:2}); reg('henrietta',1);
      return `You send to Wyvern with eight guineas. Eight certificates come back.

On Sunday the names are pasted on the church door, by order. Yours is at the top. The footmen are at the bottom, entered as “John” and “John”.

The Morning Chronicle has a name for people who pay. Edmund reads it out at dinner. “Guinea-pigs.” ${hh(`Henrietta asks him to leave the table.`, `The Johns look at the ceiling.`)}`; }},
    {t:'Crop the lot of you.', go:() => { add({family:-4, standing:-2}); reg('henrietta',-2,'You cropped her footmen'); reg('edmund',1); reg('cullerne',-1); reg('hartopp',1);
      return `The barber walks up from Wyvern with his scissors. He does Edmund first, then you, then the Johns in the scullery. He sweeps up enough hair to stuff a bolster and asks if he may keep it.

Edmund spends the afternoon in front of the hall glass. Hartopp rides over, looks at you and says, “Sensible.” On Thursday Lord Cullerne passes you in Wyvern and does not seem to know you.

${hh(`Henrietta has her dinner sent up for three days. On the fourth she comes down in a turban.`, `Mrs Tamworth writes it all to Gay Street. A parcel comes from Bath by the Friday coach. It is a nightcap.`)}`; }},
    {t:'Pay for Henrietta. Shear everyone else.', note:'1 guinea', go:() => { add({money:-1, family:1});
      return `One guinea. One certificate. “Mrs ${S.sur}, Hatherley Combe.”

The barber shears the rest of you on Saturday. The younger John cries in the scullery. Mrs Bunce gives him a jam tart.

${hh(`At church Henrietta sits at the end of the pew with her head high and white. Everybody else in the pew has cold ears.`, `The certificate goes to Gay Street by the post. On Sunday everybody in the Hall pew has cold ears.`)}`; }}
  ]});

ev({ id:'fenn', fixed:'1795-3', title:'A Citizen at the Bell',
  text:() => `There is a new man at the Bell. Absalom Fenn, shoemaker, walked down from London with a pack on his back. The pack is full of pamphlets.

Every evening at seven he stands on a settle and reads Tom Paine to the carters. He reads slowly. He stops at the long words and tells them what each one means.

Crabbe has been down to look. He stands in your library with his notebook open. “The new Act says fifty, sir. Fifty persons at a political meeting, and they must have a magistrate’s licence. I counted forty-nine. I counted on three nights.” He turns a page. “Forty-nine each night. The fiftieth waits in the yard.”`,
  choices:[
    {t:'Have Fenn taken up as a seditious person.', go:() => { fl('fennTaken'); add({standing:3, goodwill:-5}); reg('gall',2,'You gaoled the shoemaker'); reg('cullerne',1);
      return `The constable takes Fenn at the Bell on Friday, off the settle, with the book in his hand. He goes to Reading gaol in the carrier’s cart. Dr Gall shakes your hand after church.

The evidence is forty-nine men and a printed book. The Grand Jury throws it out.

Fenn walks back into Hatherley on a Tuesday. The carters stand him his beer. A boy asks him what “seditious” means. He climbs on the settle and tells them.`; }},
    {t:'Go down to the Bell and argue with him.', go:() => { fl('fennDebate'); add({goodwill:5, standing:-2}); reg('cullerne',-1); reg('pryor',1,'Saw you argue with Fenn and pay for the beer');
      return `You walk down to the Bell at seven and take the chair by the fire. Fenn nods to you and goes on reading. When he stops, you answer him.

You give them the Constitution. King, Lords and Commons. Fenn gives them your uncle: his rents, his game, his three votes in Wyvern, the year he stopped the footpath to the mill. He has every date.

It lasts two hours. The carters decide for Fenn. You pay for the beer, all forty-nine pots. Jem Pryor lifts his to you from the corner.`; }},
    {t:'Buy every copy of Paine in Wyvern and burn them.', note:'£15', go:() => { add({money:-15, standing:1});
      return `Mr Gosling the bookseller has nineteen copies of the Rights of Man. He asks fifteen pounds for the lot. You pay it.

You burn them on the green on Saturday night. Most of the parish comes. Fenn comes too and warms his hands.

On Monday Gosling’s boy is at the coach office with a letter for London. The order is for forty copies.`; }}
  ]});

ev({ id:'edmundFuture', fixed:'1796-0', title:'Edmund Wishes to Be Useful',
  text:() => `Edmund has the Gazette propped against the coffee pot. He has stopped eating.

“General Bonaparte is twenty-six, sir. He has beaten the Austrians twice in one week.”

“And how old are you?”

“Twenty.” He folds the paper. “I should like a commission.”

${hh(`Henrietta sets down the teapot. “Dr Gall is an old man. The living is in your father’s gift. Three hundred a year and the vicarage, Edmund. You could ride over to dinner.”

They both look at you.`, `There is a letter from Gay Street under his saucer. He turns it round for you to read. “Dr Gall is an old man. The living is in your father’s gift. Three hundred a year and the vicarage. You could ride over to dinner.”

He waits.`)}`,
  choices:[
    {t:'Buy him an ensigncy in the 52nd Foot.', note:'£450', go:() => { fl('edmund','army'); add({money:-450, family:-1}); reg('edmund',3,'You bought him his colours'); reg('henrietta',-2,'You sent her son to the wars');
      return `Four hundred and fifty pounds to Mr Cox, the army agent in Craig’s Court. The Gazette prints it a month later. “52nd Foot. Edmund ${S.sur}, Gent., to be Ensign, by purchase.”

The coat comes from London in a box. Edmund puts it on in the hall. He looks at it in the drawing-room glass. He looks at it in the glass on the stairs. Mrs Bunce finds him in the dairy, in front of the small square one.

${hh(`Henrietta does not come down to see it.`, `He writes to Bath to say how it fits. Gay Street does not answer.`)}`; }},
    {t:'Write to Captain Holloway for a berth in his frigate.', go:() => { fl('edmund','navy'); add({family:-1}); reg('edmund',2,'You got him to sea'); reg('henrietta',-2,'You sent her son to sea');
      return `You write to Captain Holloway of the Thetis, thirty-two guns. He served with your uncle.

The answer comes from Portsmouth in a week. “Sir, Send him. He is six years too old and will be ordered about by children. Good. Holloway.”

Edmund reads it three times. He packs that night. ${hh(`Henrietta sews his name into eleven shirts. She does not speak to you while she does it.`, `Eleven shirts come from Bath with his name sewn in. There is no line with them for you.`)}`; }},
    {t:'Steer him into the Church.', go:() => { fl('edmund','church'); add({family:1}); reg('edmund',-3,'You steered him into the Church'); reg('henrietta',3); reg('gall',-1,'Dislikes being reminded he is mortal');
      return `Edmund goes up to Oriel to read for orders. He shakes your hand at the coach door. He does not look at you.

He writes every Sunday. The weather in Oxford. The text of the sermon. His duty to his mother. Each letter covers one side exactly.

${hh(`Henrietta keeps them in her work-box. Dr Gall`, `A second letter goes to Gay Street by the same post. It covers both sides. Dr Gall`)} has heard why the boy was sent. He stops you at the vestry door and asks whether you find him looking ill.`; }},
    {t:'Keep him at home to learn the estate.', go:() => { fl('edmund','home'); add({family:2}); reg('edmund',-1); reg('henrietta',2);
      return `“You will stay here and learn the estate.”

“Yes, sir.”

He rides the farms. He learns a sound ewe from a rotten one. He learns which tenants pay and which explain. ${hh(`Henrietta has his chair moved nearer hers at dinner.`, `A letter from Bath orders his chair moved to the foot of the table.`)}

In the evenings he is in the gun room. You look in at eight. He is cleaning a fowling piece. You look in at ten. It is the same fowling piece. The Gazette is open on the bench beside him.`; }}
  ]});

function electionWin(){ return chance(clamp((T('silver') ? 0.5 : 0.3) + (S.standing - 40) / 110 + (S.goodwill - 50) / 250, 0.1, 0.85)); }

ev({ id:'election96', fixed:'1796-1', title:'Burgage Votes',
  text:() => `A cart from Cullerne Castle is at the kitchen door. In it, under a cloth, is a haunch of venison. The groom has a note.

“Lord Cullerne’s compliments to Mr ${S.sur}. Parliament is dissolved. His lordship’s nephew, Mr Fitzroy Bligh, offers himself for Wyvern. His lordship feels sure of Mr ${S.sur}’s three votes.”

Wyvern returns two Members. The votes go with thirty-one old burgage plots in the town. Most have pigs on them now. Lord Cullerne owns fourteen. Your uncle bought three.

The groom is waiting. Mrs Bunce has her hand on the haunch.`,
  choices:[
    {t:'Eat the venison. Vote for Fitzroy.', go:() => { fl('cullerneMan'); add({standing:3}); reg('cullerne',3,'You ate his venison and voted his nephew in');
      return `“Thank his lordship.” Mrs Bunce carries the haunch inside.

There is no poll. Mr Fitzroy Bligh is declared at the Town Hall at noon. He thanks the electors in four sentences. He reads all four from a card.

On Friday a card comes from the Castle. Dinner, the fourteenth. It is the first in three years.`; }},
    {t:'Stand yourself.', note:'£900 in beer, ribbons and inducements', go:() => { add({money:-900});
      if (electionWin()) { fl('mp'); S.mpWins = 1; S.mpSince = 1796; add({standing:10}); reg('cullerne',-3,'You beat his nephew at Wyvern'); reg('henrietta',2);
        return `The haunch goes back. You send to Tidmarsh’s bank for nine hundred pounds. Beer at the George. Blue ribbons. Eleven conversations in back kitchens.

The poll is on Thursday. Sixteen votes for you. Fifteen for Mr Bligh. Six men carry you round the market place in a chair.

You are Member for Wyvern. ${hh(`Henrietta orders a London gown the same evening.`, `Henrietta orders a London gown from Bath by the next post.`)} The Castle gates are shut when you drive past.`; }
      S.mpBeat = 1796; add({standing:-4}); reg('cullerne',-4,'You stood against his nephew, and lost');
      return `The haunch goes back. You send to Tidmarsh’s bank for nine hundred pounds. Beer at the George. Blue ribbons. Eleven conversations in back kitchens.

On the morning of the poll Lord Cullerne’s agent takes breakfast at the Bell. Two of your eleven take it with him.

Fourteen votes for you. Seventeen for Mr Bligh. On Saturday your ribbons are still up in the market place. Nobody has troubled to take them down.`; }},
    {t:'Send the venison back.', go:() => { add({standing:-1, goodwill:2}); reg('cullerne',-3,'You returned his venison');
      return `“Take it back to the Castle. My compliments. I have venison of my own.”

The groom looks at Mrs Bunce. She takes her hand away. He covers the haunch and drives off.

Mr Bligh is returned on Thursday without your votes. At Quarter Sessions Lord Cullerne takes the chair. He does not see you all day.`; }}
  ]});

ev({ id:'bank', fixed:'1797-0', title:'Paper and Gold',
  text:() => `The coach brings two pieces of news. The French have landed in Wales. The Bank of England has stopped paying out gold.

By noon there is a line of people outside Tidmarsh’s bank in Wyvern. It runs down the High Street as far as the pump. Shopkeepers. Farmers’ wives. The saddler with his apron on. Each has a fistful of Tidmarsh’s notes.

Your own money is in there. So is the estate’s.

The blind moves at an upstairs window. Mr Tidmarsh looks down at the line. He is counting it.`,
  choices:[
    {t:'Join the queue and get your gold out.', go:() => { fl('ranOnBank'); fl('bankFailed'); add({standing:-4, goodwill:-5});
      return `You take your place. It is an hour to the counter. The clerk pays you in guineas, by weight. His hands shake on the scales.

You come out with both coat pockets full. They drag the coat down off your shoulders. The whole line watches you walk to your horse. More people join the end.

Tidmarsh puts up his shutters at four o’clock. The saddler was nine places from the door.`; }},
    {t:'Stand on the bank steps and declare you will take Tidmarsh’s paper.', go:() => { fl('backedBank'); add({standing:6, goodwill:3}); later('bankFate', 2);
      return `You climb the bank steps and turn round.

“My money is in this house. It is staying in this house. I will take Mr Tidmarsh’s paper for any debt owed to me, today or any day.”

Nobody cheers. The saddler looks at his notes. He puts them in his apron pocket and goes back to his shop. Others follow. By two o’clock the line is six people.

Tidmarsh comes down and holds your hand in both of his. You ride home. You have never seen the inside of his strong-room.`; }},
    {t:'Stay at home and read Cowper.', go:() => { add({standing:-1});
      return `You stay in the library with the door shut.

Mudge brings the story back from Wyvern at dusk. A farmer from Lambourn stood up on a cart at one o’clock. He shouted that he would take Tidmarsh’s paper at full value from any man there. The line broke up within the hour.

“They chaired him round the pump, sir. He’d never set foot in Wyvern before.”`; }}
  ]});

ev({ id:'bankFate', follow:true, title:'Mr Tidmarsh Calls',
  text:() => `A hired chaise is at the door. Mr Tidmarsh is shown into the library. He sits on the front two inches of the chair and holds his hat on his knees.`,
  choices:[
    {t:'Hear him.', go:() => {
      if (chance(0.72)) { fl('cheapCredit'); add({standing:2});
        return `“The house is safe, sir. We paid every note that came in. I know whose doing that was.”

He takes a paper from inside his hat. It is your mortgage deed. A line is ruled through “Five per Cent.” Above it somebody has written “Four”. The alteration is initialled.

He shakes your hand at the door for some time. His palm is wet.`; }
      fl('bankFailed'); add({money:-600, standing:-1});
      return `“Harman’s of Bristol stopped on Tuesday, sir. They owed us eleven thousand. We stopped on Wednesday.”

He has the figures on a half-sheet. The creditors will get seven shillings in the pound. Your loss comes to six hundred.

“I am very sorry, sir.” He stands. He has left something on the hall table. It is a pineapple.`; }}
  ]});

ev({ id:'nore', fixed:'1797-1', cond:() => E() === 'navy', title:'A Letter from the Nore',
  text:() => `The Mercury has it on the front page. The fleet at the Nore has run up the red flag. The paper prints the ships in a column. The Thetis is the ninth name down.

${hh(`Henrietta reads the column twice and goes to the window. She is at that window for ten days.`, `You cut the column out and send it to Gay Street. Henrietta writes by every post for ten days. Each letter asks one question.`)} On the eleventh the post-boy brings a letter in Edmund’s hand. You pay eightpence for it at the door.

“Sheerness, Sunday night.

My dear Father, I am on shore and not hurt. Tell my mother first.

They sent the officers away on Friday. Nobody was struck. The cook has the ship. He carried my chest to the side himself and asked me to mind the wet step. The men want a shilling a day. They want sixteen ounces to the pound from the purser. He gives fourteen and keeps two. That is all they want. I have turned it over for two nights. I cannot make them wrong.

Burn this. Captain Holloway dines with people you know.

Your dutiful son, Edmund.”`,
  choices:[
    {t:'Write to the Admiralty. Ask mercy for the men.', go:() => { add({standing:-2}); reg('edmund',2,'You wrote to the Admiralty for his shipmates');
      return `You write to Lord Spencer at the Admiralty. A clerk replies. “Sir, I am commanded by their Lordships to acknowledge the receipt of your letter.”

The red flags come down in June. Richard Parker is hanged from the yardarm of the Sandwich. Twenty-eight more follow him. The cook of the Thetis is flogged round the fleet. He lives.

Edmund’s next letter is about a gale off the Texel. He does not mention yours. He signs it “Your affectionate son”.`; }},
    {t:'Write to Edmund. Mutiny is mutiny.', go:() => { add({standing:1}); reg('edmund',-1);
      return `You fill four sides. Duty. The King. What your uncle would have said. You copy it fair and send it.

The answer is one side long. The wind has been in the east. He has had a cold. He is, sir, your obedient son.

Parker hangs in June with twenty-eight others. In the same month Parliament votes the seamen their shilling.`; }}
  ]});

ev({ id:'defence', fixed:'1798-1', title:'In Case of the French',
  text:() => `A printed schedule has come from the Lord Lieutenant. It has eleven columns.

If the French land, every parish is to drive its cattle inland, break its mills and burn its ricks. Reading wants to know what Hatherley has. Oxen. Sheep. Wagons. Spades. Axes. Men between fifteen and sixty. Each man is to be entered under one of three heads: pioneers, guides, or “to remove live stock and destroy”.

${F('crabbeGone') ? 'Lark has ruled a sheet ready and sharpened two pens.' : 'Crabbe has read it before you. “I have put myself down as a guide, sir. I know the roads.”'}`,
  choices:[
    {t:'Make honest returns, to the last spade.', go:() => { add({standing:2, goodwill:-2});
      return `You count for a week. Two hundred and six oxen. Forty-one wagons. Nine hundred and twelve sheep. Eighty-three men. Against eleven of the men the overseer has pencilled: “Able, in a way.”

The return goes to Reading on Saturday.

On Sunday nobody stays to talk in the churchyard. Old Dewey stops you at the gate. He asks whether his wagon is the King’s now.`; }},
    {t:'Raise and equip the Hatherley Volunteers.', note:() => T('soldier') ? '£150' : '£300', go:() => { fl('volunteers'); add({money: T('soldier') ? -150 : -300, standing:7, goodwill:2}); reg('cullerne',1);
      return `Forty men come forward. You buy green cloth for forty coats, and a drum. ${T('soldier') ? 'A hundred and fifty' : 'Three hundred'} pounds.

There are no muskets to be had in England. The blacksmith makes forty pike-heads in a fortnight.

They drill on ${ground()} on Sunday afternoons. On the first Sunday the drummer puts his foot through the drum. On the fourth they march the length of ${ground()} in step. You find you are standing very straight.`; }},
    {t:'Leave it all to Crabbe.', if:() => !F('crabbeGone'), go:() => { reg('crabbe',1); later('crabbeList', 3);
      return `“See to it, Crabbe.”

“With pleasure, sir.”

He works at it for three evenings. The return is four sheets in his best hand, tied with green tape. He holds it out to you. You are going in to dinner. You tell him to send it.`; }}
  ]});

ev({ id:'crabbeList', follow:true, cond:() => !F('crabbeGone'), title:'Wagons of a Spiritual Character',
  text:() => `A clerk from the Lord Lieutenant’s office is in the yard with a list. He has come to see the wagons.

“Fifty-two, sir, by your return.”

You walk him round. Forty-one.

He shows you the list. Eleven wagons are entered at Hatherley Home Farm that you have never owned. Against each is a government allowance. Sixpence a day, for exercise. Payable to Mr Crabbe, steward.

Crabbe is sent for. He looks at the list. He looks at the clerk.

“A reserve, sir. One does not show the enemy everything.”`,
  choices:[
    {t:'Dismiss him on the spot.', go:() => { fl('crabbeGone'); add({standing:2, goodwill:2}); reg('crabbe',-5,'Dismissed over eleven wagons that did not exist');
      return `“You will be out of the steward’s house by Saturday.”

He bows. On Saturday a cart takes his boxes to Newbury. Your uncle’s writing desk is on the cart. Within the month a brass plate goes up in Northbrook Street. “Crabbe. Land Agent.”

The new steward is a Scot of twenty-six named Lark. On his first morning you hand him the office key. He writes you a receipt for it.`; }},
    {t:'Repay the allowance quietly and keep him where you can see him.', note:'£70', go:() => { fl('crabbeWatched'); add({money:-70}); reg('crabbe',-1,'Knows that you know about the wagons');
      return `You count seventy pounds on to the clerk’s list. He writes “Error” against the eleven wagons and rides away.

Crabbe has not moved. “I am obliged to you, sir.”

“I shall read the accounts myself from now on.”

“I should welcome it, sir.”

For a month every page of the ledger is ruled twice and totalled in red.`; }},
    {t:'Tell the clerk the wagons are out on exercise.', go:() => { fl('crabbeSkims'); add({standing:-2}); reg('crabbe',2,'You lied to the Lord Lieutenant for him');
      return `“The other eleven are out,” you say. “At exercise.”

The clerk looks at you. He looks at Crabbe. He writes in his book for some time and does not show you the page. Then he rides away.

Crabbe sees him to the gate. He comes back across the yard without hurrying. He does not thank you. He asks whether you still want the Lady Day accounts on Friday, or whether next week would do.`; }}
  ]});

ev({ id:'incomeTax', fixed:'1799-3', title:'Ten Per Centum',
  text:() => `The form is four pages. Crown paper, printed in London. “An Act for granting to His Majesty certain Duties upon Income.”

Two shillings in the pound. You are to state what you have from land, from the funds and from every other source. You are to state it to the commissioners for this division. They are ${F('gallDead') ? 'Lord Cullerne’s agent' : 'Dr Gall'}, Mr Hartopp, and Mr Spurling, the attorney.

You dined with two of them last week.

The last line of the last page is blank, for a name. The words printed above it are “I do solemnly declare”.`,
  choices:[
    {t:'Declare every half-crown.', go:() => { fl('taxHonest'); add({standing:2});
      return `You write down the rents, the home farm, the timber, the three per cents. You add it up twice and sign.

Spurling reads it at the George with his spectacles pushed up. He reads it again. Then he sends his clerk to the tithe map to look for a farm you have left out.

There is none. It takes him a fortnight to believe it.`; }},
    {t:'Declare what the estate was worth in your uncle’s day.', go:() => { fl('taxDodge'); later('taxCaught', 5 + Math.floor(Math.random() * 6));
      return `Your uncle’s rent book for 1785 is in the bottom drawer. You copy the figures from that.

You sign. ${hh(`For a week you turn the lamp down early and tell Henrietta the claret must last.`, `For a week you turn the lamp down early and drink the table beer.`)}

A note comes from Spurling. One line. “Received, with interest.”`; }},
    {t:'Pay in full, and denounce it at the Bell.', go:() => { fl('taxHonest'); add({goodwill:3, standing:-1});
      return `You pay to the last shilling. Then you walk down to the Bell.

You stand on a settle and give them twenty minutes. Englishmen. Liberty. A tax-gatherer in every man’s desk. The landlord fills your glass twice and forgets to chalk it.

The carters cheer you. Not one of them earns enough to be taxed. Jem Pryor asks you, very civil, how much it came to.`; }}
  ]});

ev({ id:'taxCaught', follow:true, cond:() => F('taxDodge'), title:'A Ferret in a Good Coat',
  text:() => `Mr Spurling is in the hall. He has a clerk with him. The clerk has a tin box.

He lays two papers side by side on your library table. One is your return. The other is older. “Particulars of the Hatherley Estate, 1791.” Lord Cullerne’s lawyers drew it up when his lordship tried to buy the place from your uncle. It gives the rental, farm by farm.

Spurling puts a finger on each total.

“Nine hundred a year between them, sir. I make it nine hundred.” He smiles at you. “I do enjoy a discrepancy.”`,
  choices:[
    {t:'Pay the arrears and the surcharge.', note:'£420', go:() => { fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-5});
      return `You write the draft. Four hundred and twenty pounds, arrears and surcharge. Spurling locks it in the tin box.

“The commissioners’ proceedings are secret by statute, sir.”

By Thursday the butcher in Wyvern knows the figure. He sends in his account that week. He has not sent one before Christmas in ten years.`; }},
    {t:'Offer Spurling fifty guineas for his trouble.', note:'£52', go:() => { add({money:-52});
      if (chance(0.5)) { return `You put a purse on the table between the two papers. Fifty guineas.

Spurling looks at the clerk. The clerk goes to look out of the window.

When you look down again the purse is gone. Spurling is closing the tin box. “Rents do fluctuate,” he says. He takes the 1791 paper away with him.`; }
      fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-9});
      return `You put a purse on the table between the two papers. Fifty guineas.

Spurling stands up. “Mr Hobbs. You will note the time.” The clerk notes it. The purse goes into the tin box, labelled.

You pay the four hundred and twenty as well. Spurling tells the story at the George that night. By Saturday it is a hundred guineas. By Quarter Sessions you were on your knees.`; }}
  ]});

ev({ id:'dearth', fixed:'1800-2', title:'A Proclamation Concerning Bread',
  text:() => `Wheat is a hundred and thirteen shillings the quarter. There has been no harvest worth the name for two years.

In the cottages they are baking with barley and bran. At the Pryors’ there are nettles drying on a string across the hearth.

Dr Gall reads the King’s Proclamation from the pulpit. Every household that can afford wheat is to eat a third less of it. No pastry. No flour in puddings.

Mrs Bunce is in the back pew. She walks out before the blessing.`,
  choices:[
    {t:'Sign the pledge. No pastry at the Hall.', go:() => { add({family:-4, goodwill:5, standing:2}); reg('henrietta',-1);
      return `You sign the pledge and nail a copy to the kitchen door.

Mrs Bunce sends up rice pudding on Monday. Rice pudding on Tuesday. On Wednesday there are potatoes in the bread. ${hh(`Henrietta leaves the table and has a tray in her room.`, `A letter from Gay Street mentions a pastry-cook in Milsom Street.`)}

On Sunday three cottage children stand in the lane under the kitchen chimney with their noses up. There is no pie. They go home and tell their mothers.`; }},
    {t:'Open a soup kitchen in the old brewhouse.', note:'£250', go:() => { fl('soup'); add({money:-250, goodwill:11, standing:3}); meet('thorne'); reg('thorne',1); reg('gall',-1); reg('pryor',1);
      return `You have the old brewhouse copper scoured. Count Rumford’s receipt is in the Mercury: barley, pease, potatoes, stale bread, one beef bone, water. Two hundred and fifty pounds will carry it to the spring.

Two hundred quarts a day. The children come at noon with jugs. Abigail Thorne comes on the second day and stays to ladle.

Dr Gall preaches against it. “Teach a poor man to expect soup and he will expect it.” On Monday his housekeeper is at the brewhouse door with a quart jug.`; }},
    {t:'Sell the home farm wheat while the price holds.', note:'+£460', go:() => { fl('hoarder'); add({money:460, goodwill:-11}); reg('pryor',-1,'Counted your wheat wagons leaving in the dearth'); later('rickFire', 2);
      return `A corn factor comes out from Reading. He offers a hundred and fifteen shillings. You take it. Four hundred and sixty pounds.

His three wagons load at the great barn at ten in the morning. The only road out runs through the village.

Doors open along the street. Nobody speaks. Jem Pryor stands at his gate with his youngest on his shoulders. His lips move as each sack goes by.`; }}
  ]});

ev({ id:'census', fixed:'1801-1', title:'The Numbering of the People',
  text:() => `Mr Nokes the overseer is at the estate office with a printed form and an inkhorn on a string. Parliament wants every person in Hatherley counted.

He has been at it three days.

“Hannah Gurney has barred her door, sir. She says King David numbered Israel and the Lord sent a plague. The Coxes, the Dances and the Lovegroves have all gone to cousins at Shefford. And then there is the smith.”

He turns the form round. Under “Children” the blacksmith has had him write “Enough”.`,
  choices:[
    {t:'Go round with Nokes yourself.', go:() => { add({goodwill:4, standing:1});
      return `You go round with him, door to door. You carry a basket of oranges from the hot-house.

One orange for each child counted. By the second day children are being fetched home from Shefford.

Hannah Gurney opens her door a hand’s width. She takes an orange and shuts it again. Nokes puts her down.

Six hundred and four. He lost count twice in Mill Lane. You do not ask how he made it up.`; }},
    {t:'Tell Nokes to estimate and be done.', go:() => { add({goodwill:1});
      return `“Reckon it as near as you can, Nokes.”

He walks the village once and counts chimneys. He writes “590” and sends it to Reading.

Hannah Gurney dies within the year. She was ninety. Half the village says it was the winter. The other half looks at Nokes.`; }},
    {t:'Have the constable count the absentees as vagrants.', go:() => { add({goodwill:-4, standing:1});
      return `You send the constable to Shefford with a message. Any Hatherley family not at home by Friday will be entered as vagrants.

They are home on Thursday. Nokes counts them at their doors. Nobody asks him in.

Five hundred and ninety-seven. This time the smith gives his children, all nine. Under “Occupation” he has Nokes write “Numbered”.`; }}
  ]});

ev({ id:'paris', fixed:'1802-1', title:'Everyone Is Going to Paris',
  text:() => `The Tamworths have gone to Paris. So have the Lovedays. Lady Cullerne left on Monday with nine trunks.

There has been peace since March. The packets are running from Dover again.

${hh(`Henrietta has a letter from Mrs Tamworth open by her plate. It is about bonnets in the Palais Royal.`, `Henrietta has sent on a letter of Mrs Tamworth’s from Gay Street. It is about bonnets in the Palais Royal. The bonnets are underlined.`)} ${K() === 'free' ? 'Kitty wants to see Bonaparte. She has said so twice since the fish. ' : ''}${F('gallDead') ? 'The new curate' : 'Dr Gall'} is dining with you. He has not been further than Bath in his life.

${hh(`“They eat frogs, madam,” he tells Henrietta. “I have it from a man who saw it done.”`, `“They eat frogs, sir,” he tells you. “I have it from a man who saw it done.”`)}`,
  choices:[
    {t:() => hh('Take the family.', 'Fetch Henrietta from Bath and take the family.'), note:'£500', go:() => { fl('paris'); add({money:-500, family:10, standing:3}); reg('henrietta',2,'You took her to Paris in the peace'); if (K() === 'free') reg('kitty',2);
      return `Dover to Calais in four hours. Calais to Paris in three days. Five hundred pounds before you are home.

On Sunday there is a review in the Place du Carrousel. You stand in the crowd. A small sallow man rides down the line on a white horse. He looks along the faces as he passes. He looks at yours.

Henrietta buys eleven bonnets. You catch a cold on the packet home. ${hh(`At Dover you tell her it will be war again within the year.`, `At Dover you tell her it will be war again within the year. She says Bath will do until then.`)}`; }},
    {t:'Send Henrietta with your sister Selina.', note:'£220', go:() => { fl('paris'); add({money:-220, family:4}); reg('henrietta',1);
      return `Your sister Selina goes with her. Two hundred and twenty pounds.

They are back in six weeks. ${hh(`Henrietta says “Mon Dieu” when the tea is cold.`, `Henrietta’s letters from Gay Street now begin “Mon cher”.`)} Selina has been shown Madame Récamier’s bed. She describes it at dinner.

Selina has also seen the First Consul. “Common,” she says. She says it at the Tamworths’ and again at the Castle.`; }},
    {t:'Refuse. The French are not to be trusted.', go:() => { add({family:-6}); reg('henrietta',-2,'You kept her from Paris'); if (!F('gallDead')) reg('gall',1);
      return `${hh(`“The French are not to be trusted. We stay at home.”

Henrietta folds Mrs Tamworth’s letter and puts it in her sleeve.`, `You write it to Gay Street. “The French are not to be trusted. You will oblige me by remaining at Bath.”

Your letter comes back torn across.`)}

All summer there are letters from Paris in the neighbourhood. They are read aloud after dinner at every house you visit. At the Lovedays’ you hear about the Louvre twice in one evening.`; }}
  ]});

ev({ id:'boulogne', fixed:'1803-2', title:'The Army of England',
  text:() => `The war began again in May.

The Mercury prints a letter from Dover. On a clear day the tents at Boulogne can be seen from the cliff. A hundred and fifty thousand men. Two thousand flat boats. Bonaparte has told his admirals he needs six hours of fog.

At the Tamworths’ the nurse has a new way of getting the children to bed. “Boney will have you.” It works on the first night.

There is a handbill on the church door. “BRITONS! To Arms!”`,
  choices:[
    {t:'Drill the Hatherley Volunteers yourself, twice a week.', if:() => F('volunteers'), go:() => { add({standing:5, goodwill:2, family:-2});
      return `You buy the drill book and read it on Saturday nights. On Sundays and Wednesdays you take them on ${ground()}.

Form line. Form square. Charge pikes. By November they can do all three. One man has been stuck in the leg.

The blacksmith is serjeant. He stands six foot four with a pike in his fist. The men watch him and do what he does.`; }},
    {t:'Raise a corps of Volunteers now.', note:() => T('soldier') ? '£160' : '£320', if:() => !F('volunteers'), go:() => { fl('volunteers'); add({money: T('soldier') ? -160 : -320, standing:6, goodwill:2});
      return `Forty men give their names at the vestry. ${T('soldier') ? 'A hundred and sixty' : 'Three hundred and twenty'} pounds for green coats, a drum and forty pike-heads.

The ladies of the parish work a flag. It shows a yellow animal on a green field. ${hh(`Henrietta says it is a lion.`, `Mrs Loveday says it is a lion.`)}

The men asked for muskets. There are none. The blacksmith is serjeant. “A pike,” he tells them, “is a musket with the nonsense left out.”`; }},
    {t:'Send a hundred pounds to the Patriotic Fund at Lloyd’s.', note:'£100', go:() => { add({money:-100, standing:3}); reg('cullerne',1);
      return `You send a hundred pounds to the Patriotic Fund at Lloyd’s Coffee House.

The list of subscribers is in the Times on Tuesday. A duke, fifty pounds. Then you. Then a soap-boiler of Wapping, two hundred.

Lord Cullerne has seen it. He says so across the room at the Wyvern assembly, with his hand on your shoulder.`; }},
    {t:() => hh('Set Henrietta at the head of a flannel committee.', 'Have Henrietta raise a flannel committee at Bath.'), go:() => { add({family:3, goodwill:1, standing:1}); reg('henrietta',1);
      return `${hh(`Henrietta calls the ladies of the parish to the drawing-room. Flannel shirts for the troops. Tuesdays at eleven.

You pass the door each week. Fourteen women and one pair of scissors.`, `Henrietta calls the ladies of Gay Street to her lodgings. Flannel shirts for the troops. Tuesdays at eleven.

She sends you the numbers each week. Fourteen women and one pair of scissors.`)}

By Christmas there are nine shirts in the basket. Miss Loveday is engaged to a lieutenant of Militia.`; }}
  ]});

ev({ id:'beacon', fixed:'1804-0', title:'The Beacon on Hatherley Down',
  text:() => `The church bell wakes you. It is two in the morning.

There is fire on Hatherley Down. There is fire on Inkpen Hill behind it. From the landing window you count five more along the valley.

The Volunteers are falling in on the green. Some have coats. The smith has a pike and a nightshirt. ${hh(`Henrietta is on the stairs with the ${ended('plate') ? 'spoons' : 'silver'} in a pillowcase.`, `Mrs Bunce is on the stairs with the ${ended('plate') ? 'spoons' : 'silver'} in a pillowcase.`)}

${F('gallDead') ? 'The sexton comes up the drive at a run. He has buried the communion plate in the vicarage asparagus bed. He wants you to know which row, in case he is killed. He cannot remember which row.' : 'Dr Gall comes up the drive in his dressing-gown. He has buried the communion plate in his asparagus bed. He wants you to know which row, in case he is killed. He cannot remember which row.'}`,
  choices:[
    {t:'Mount, and lead the men towards the coast.', go:() => { add({standing:6, goodwill:4, family:-2});
      return `You mount and take them down the Newbury road. Forty men in the dark, in step for the first mile.

Fourteen miles on, the Bath mail comes up behind with its lamps lit. The guard leans down. “No French, sir. Some fool lit a beacon at Inkpen.”

They sit down in the road. Three of them have one boot. Then the smith starts to laugh. You march them home by daylight, singing. Every cottage door is open.`; }},
    {t:'Ride up to the beacon and find out.', go:() => { add({standing:2, goodwill:1});
      return `You ride up the Down in your nightshirt and greatcoat.

Billy Coombes is beside the beacon. It is burning well. He is crying. He saw fire on Inkpen, as he was told to. You ride on to Inkpen. A charcoal burner is asleep beside his stack.

You are in bed again by four. The Volunteers are out till noon. On Sunday nobody on the green will look at you.`; }},
    {t:'Stay, and guard the house.', go:() => { add({family:4, standing:-5}); reg('henrietta',1);
      return `You take your uncle’s sword down from the hall chimney-piece and stand at the head of the stairs. ${hh(`Henrietta sits on the top step with the pillowcase.`, `Mrs Bunce sits on the top step with the pillowcase.`)}

At first light the Bath mail brings the truth through Wyvern. No French.

You try to draw the sword. It has not been out of the scabbard since the Forty-Five. It will not move. One of the Johns is at the foot of the stairs. He has been there some time.`; }}
  ]});

ev({ id:'trafalgar', fixed:'1805-3', title:'Laurel on the Mail',
  text:() => `The London mail comes into Wyvern at noon. There is laurel tied round the lamps. The horses have black crape on their bridles.

The guard stands up on the roof and shouts it. A battle off Cape Trafalgar. Nineteen ships taken. Lord Nelson is killed.

The ringers run to the tower. They ring a peal. Somebody stops them and one bell tolls. Then the peal again.${E() === 'navy' && !F('edmundDead') ? `

There is a letter from Edmund in the bag. The writing slopes uphill. “The Thetis repeated signals. We hardly fired. I saw the Victory go into their line. I was not afraid until it was over. Then I was sick into the hammock nettings. The boatswain says everybody is.”` : ''}`,
  choices:[
    {t:'Illuminate the Hall.', note:'£40', go:() => { add({money:-40, standing:3});
      return `A candle in every window of the Hall. Fifty-four windows. Forty pounds in wax and lamp oil.

People walk out from Wyvern to stand in the road and look. Somebody starts “Rule, Britannia”.

${hh(`Henrietta walks the gallery with a snuffer. She counts the candles aloud. At ten o’clock she begins putting them out.`, `The elder John walks the gallery with a snuffer. He counts the candles aloud. At ten o’clock he begins putting them out.`)}`; }},
    {t:'Roast a sheep for the village.', note:'£60', go:() => { add({money:-60, goodwill:6});
      return `You give a sheep and three barrels. It is roasted on ${ground()}.

They drink to Lord Nelson first. Nobody says a word. Then they drink confusion to the French. The noise can be heard at the Hall.

The fiddler plays “Hearts of Oak” nine times. Old Dewey is crying by the fire. A boy starts to laugh at him. The boy’s mother cuffs him.`; }},
    {t:'Order the bells tolled, and put the household in black.', go:() => { add({standing:1, family:-1}); if (!F('gallDead')) reg('gall',1);
      return `One bell, tolled for an hour. The household is in black by evening.

No other parish for ten miles has thought of it. ${F('gallDead') ? 'The rector of Kintbury' : 'Dr Gall'} calls it very proper.

The ringers come to the kitchen door afterwards. They stand there. Mrs Bunce asks what they want. They want to know if it is beer for tolling, the same as for ringing.`; }}
  ]});

ev({ id:'abolition', fixed:'1807-0', title:'A Petition from the Chapel',
  text:() => { meet('thorne'); meet('pinch');
    return `Mrs Thorne is in the hall with her egg basket. Under the eggs is a roll of paper three yards long. The Wyvern Methodists have drawn it up. It asks Parliament to pass Mr Wilberforce’s bill and end the slave trade.

She unrolls the last yard on the hall table. There is room for one more column.

The library door is open. ${S.flags.kitty === 'pinch' ? 'Your son-in-law Mr Pinch' : 'Mr Lumley Pinch of Bristol'} is in your best chair with a bowl of your walnuts. ${S.flags.kitty === 'pinch' ? 'He' : 'He is breaking his journey with you. He'} has sixty thousand pounds and a sugar estate in Jamaica. He has never seen the estate.

He has stopped cracking walnuts.`; },
  choices:[
    {t:'Sign it, in front of Pinch.', go:() => { fl('signedPetition'); add({standing:2, goodwill:2}); reg('thorne',2,'You signed against the trade with Pinch in the room'); reg('pinch',-4,'You signed the petition under his nose');
      return `You call for a pen. You sign at the head of the empty column, large.

A walnut cracks in the library.

“Sugar will be dearer,” Pinch says through the door. “I hope you like your tea bitter.”

You drink it without sugar that evening. You drink a second cup.`; }},
    {t:'Sign it after Pinch has gone up to bed.', go:() => { fl('signedPetition'); add({goodwill:1}); reg('thorne',1);
      return `“Leave it with me, Mrs Thorne.”

“I’ll wait, sir.”

She waits in the kitchen until Pinch has gone up. You sign in the estate office by one candle. She watches you do it.

“Well, it’s the same ink,” she says. She puts the roll back under the eggs.`; }},
    {t:'Decline. Trade is trade.', go:() => { add({standing:-2}); reg('thorne',-3,'You would not sign against the slave trade'); reg('pinch',2);
      return `“Trade is trade, Mrs Thorne.”

She rolls up the petition. She puts it under the eggs. She does not say good day.

The bill passes. Two hundred and eighty-three votes to sixteen. At Easter Pinch sends you a sugar loaf with his compliments.`; }}
  ]});

/* The general elections of 1802, 1806, 1807 and 1812. One event, four years; each year has its own cart from
   the Castle and its own results, and the paper knows how often the squire has been returned or beaten. */
const seated = () => { fl('mp'); S.mpWins = (S.mpWins || 0) + 1; S.mpSince = S.mpSince || S.year; };
const unseated = () => { fl('mp', false); S.mpOut = S.year; S.mpSince = 0; };
const TIMES = ['', 'once', 'twice', 'three times', 'four times', 'five times'];
const mpPast = () => F('mp') ? ((S.mpWins || 1) > 1 ? `Wyvern has returned you ${TIMES[S.mpWins]}.` : `You have sat for Wyvern since ${S.mpSince || 1796}.`)
  : S.mpOut ? `You sat for the borough yourself until ${S.mpOut}. The George has kept your ribbons in a drawer.`
  : S.mpBeat ? `You stood against him in ${S.mpBeat} and lost. The landlord of the George asks whether he is to air the committee room.`
  : F('cullerneMan') ? 'He has sat on your three votes since the last election.' : '';
const POLLS = {
  1802:{
    mp:() => `Parliament is dissolved. You must be elected again.

The owners of the Wyvern plots have not forgotten last time. Three of them call at the Hall before breakfast. Each asks after your health. Each mentions the price of bread.

Lord Cullerne’s agent was in Pig Lane yesterday with a measuring chain.`,
    out:() => `Parliament is dissolved. Mr Fitzroy Bligh offers himself for Wyvern again. He has not yet spoken in the House.

${mpPast()}

A cart from the Castle is at the kitchen door. This time it carries a tub. In the tub is a live turtle.

“Lord Cullerne’s compliments, sir.”

The tub is put in the scullery. The turtle rests its chin on the rim. It is watching Mrs Bunce.`,
    keep:'Vote for Fitzroy and keep the turtle.', back:'Send the turtle back and stay out of it.',
    hold:() => `Seven hundred pounds. The same back kitchens.

You hold the seat. The returning officer does not read out the figures. Six men chair you round the market place. They drop you once, at the pump. They dropped the last Member there too.`,
    lose:() => `Seven hundred pounds. The same back kitchens.

Three of the plots you counted on change hands at breakfast on the day of the poll. The new Member is a brewer from Reading. Lord Cullerne calls him “biddable”.

${hh(`Henrietta gives up the house in Half Moon Street. “I never liked it,” she says. She has kept the door-knocker.`, `Henrietta gives up the house in Half Moon Street from Bath. “I never liked it,” she writes. She has had the door-knocker sent to her.`)}`,
    quit:() => `You write to the electors. The cares of your estate forbid you to offer yourself again.

The letter is in the Mercury on Saturday. On Monday a note comes from the Castle. “Lord Cullerne is obliged to Mr ${S.sur}.”

It is the first note from the Castle in some years. ${hh(`Henrietta reads it and puts it on the fire.`, `You send it on to Gay Street. It is not sent back.`)}`,
    vote:() => `“Thank his lordship.”

Mr Bligh is returned. A man comes down from London to deal with the turtle. Mrs Bunce will not be in the kitchen while he does it.

The soup comes up in the blue tureen. You have two plates. Then a third.`,
    win:() => `You leave the tub where it is and spend nine hundred pounds.

You are in by three votes. One elector has been dead since Candlemas. He votes twice. The second vote is objected to.

You are Member for Wyvern. A week later the scullery tub is empty. The gardener finds the turtle in the carp pond. There are fewer carp.`,
    beat:() => `You spend nine hundred pounds. Thirty-one electors drink it, with their friends.

You lose. There is a blue ribbon left on your hat and a pain behind your eyes.

The tub goes back to the Castle on the cart. The turtle keeps its head over the rim as far as the lodge.`,
    home:() => `“Take it back. My compliments.”

Mr Bligh is returned without your votes. Lord Cullerne has pigsties enough.

Mrs Bunce scrubs the scullery floor twice.`},
  1806:{
    mp:() => `Mr Fox is dead. The Ministry has dissolved Parliament to count who is left.

${mpPast()} The plot-holders come to the Hall one at a time this year. Each has a son who would like a place in the Excise.

Lord Cullerne has bought the two plots behind the tan-yard. He gave four hundred pounds for a pigsty and a pump.`,
    out:() => `Mr Fox is dead and Parliament is dissolved. Mr Fitzroy Bligh offers himself for Wyvern again. He spoke once, in the session of 1804. It was to ask that a window be shut.

${mpPast()}

The Castle cart is at the kitchen door. This time it is a barrel of Colchester oysters. Three hundred, the groom says. They were alive at Reading.

“Lord Cullerne’s compliments, sir.”

Mrs Bunce puts her ear to the barrel.`,
    keep:'Vote for Fitzroy and open the barrel.', back:'Send the oysters back and stay out of it.',
    hold:() => `Seven hundred pounds. A place in the Excise is promised to four sons. There is one place.

You hold the seat by two votes. The last man to poll for you has a fifth son. He has asked for nothing.

He says he will call in the spring.`,
    lose:() => `Seven hundred pounds.

The two plots behind the tan-yard poll for the Castle. So do the two beside them. Their owners were at the Bell on Wednesday in new hats.

The new Member is a Mr Cheyne, home from Madras with a liver. He has never seen Wyvern. He asks the returning officer what county it is in.

Henrietta gives up Half Moon Street by letter.`,
    quit:() => `You tell each plot-holder as he comes that you will not offer yourself.

The first says he is sorry to hear it. The ninth says so in the same words. They have met at the George.

The Castle has the seat without a poll. A brace of pheasants comes from Lord Cullerne on Friday. Mrs Bunce hangs them where callers can see.`,
    vote:() => `“Thank his lordship.”

Mr Bligh is returned. Three hundred oysters must be eaten in four days. You have them raw. You have them stewed. You have them in a pie with the beef.

On the fifth day Mrs Bunce sends up a boiled egg. Nobody complains.`,
    win:() => `The barrel goes back unopened. Nine hundred pounds goes to the George.

They poll in the rain. Seventeen for you. Fourteen for Mr Bligh. He shakes your hand on the hustings. His uncle has gone home.

You are Member for Wyvern. The oysters reached the Castle on Friday. The groom says they were no longer alive.`,
    beat:() => `The barrel goes back. You spend nine hundred pounds at the George.

Thirteen votes. Mr Bligh has eighteen. He thanks the electors in four sentences from a card. It is the card he had in ’96.

On Sunday the Castle servants fill two pews. They have had the oysters.`,
    home:() => `“Take them back. My compliments.”

The groom says they will not keep as far as the Castle. He leaves the barrel at your lodge and drives off.

Mr Bligh is returned without your votes. Nobody will fetch the barrel. By Thursday the lodge-keeper has gone to his sister’s.`},
  1807:{
    mp:() => `Parliament is dissolved again. It was six months old. The King has turned out his Ministers over the Catholic officers. The cry is No Popery.

It is chalked on the door of the George. It is chalked on your lodge gate. There is not a Papist in Wyvern.

${mpPast()} The electors were last paid in November. They are very warm for the Church.`,
    out:() => `Parliament is dissolved again. It was six months old. The King has turned out his Ministers. The cry is No Popery.

Mr Fitzroy Bligh offers himself. ${mpPast()}

The Castle cart brings a ham and a bundle of printed bills.

“BLIGH and the PROTESTANT CONSTITUTION. No POPE at WYVERN.”

The groom is to nail one on your lodge gate, if you have no objection. He has brought his own hammer.`,
    keep:'Vote for Fitzroy. Let him nail it up.', back:'Nail nothing and stay out of it.',
    hold:() => `Seven hundred pounds, six months after the last. Mr Tidmarsh counts it out himself. He counts it twice.

You wear an orange cockade for the Protestant Constitution. The Castle’s man wears one too. The electors cry No Popery for both and drink with both.

You hold the seat. The chalk stays on the lodge gate until it rains.`,
    lose:() => `Seven hundred pounds. The Castle’s bill is on every door in Pig Lane. It asks how Mr ${S.sur} voted on the Catholic question.

You did not vote. You were at Hatherley for the lambing.

Thirteen for you. Eighteen against. The new Member is Lord Cullerne’s attorney. He thanks the electors for saving the Church. He is a Unitarian.

Henrietta sells the lease of Half Moon Street to a dentist.`,
    quit:() => `You write to the Mercury. Two contests in seven months are more than a private gentleman’s estate will bear.

The letter is printed between a stallion and a deserter.

At the Sessions dinner Lord Cullerne says that Mr ${S.sur} has shown sense. He passes you the port with his own hand.`,
    vote:() => `“Nail it up.”

The bill is on the gate by noon. Mr Bligh is returned. Nobody stood against him. No Pope appeared.

The ham is eaten by Whitsun. The bill hangs until harvest. The nail is there yet.`,
    win:() => `The ham and the bills go back. You have your own printed. “${(S.sur || '').toUpperCase()} and the PROTESTANT CONSTITUTION.” Nine hundred pounds.

The electors can find no difference between the candidates. They poll for the better beer. The George wins by two.

You are Member for Wyvern. On Sunday ${F('gallDead') ? 'the Vicar' : 'Dr Gall'} preaches against the Bishop of Rome. He bows to the Hall pew first.`,
    beat:() => `The ham goes back. Nine hundred pounds. Your bills go up beside the Castle’s on every door.

On Tuesday night it is put about that you dined with a priest at Reading in ’98. He was a French abbé. There were nine others at table.

Twelve votes. Somebody has chalked a triple crown on your ${keepsCarriage() ? 'carriage' : 'hall'} door. It is washed off. It shows when the sun is low.`,
    home:() => `“I nail my own gate.”

The groom puts up his hammer. He leaves the ham. He says he was told nothing about the ham.

Mr Bligh is returned without your votes. ${hh(`You eat the ham. Henrietta says a ham is not a vote. She has a second slice.`, `You eat the ham. It lasts you and the Johns till Thursday.`)}`},
  1812:{
    mp:() => `Parliament is dissolved. Mr Perceval was shot dead in the lobby in May. ${(S.mpSince || 1796) <= 1811 ? 'You heard the pistol from the stairs.' : 'Lord Liverpool has the Treasury.'}

${mpPast()} Wheat is at ${wheatNow()} shillings. The plot-holders do not ask for beer this time.

Lord Cullerne has had the Bell new painted. There is a baker’s cart in the yard with his crest on it.`,
    out:() => `Parliament is dissolved. Mr Perceval was shot dead in the lobby in May. Lord Liverpool has the Treasury.

Mr Fitzroy Bligh offers himself for Wyvern. He is stout now and walks with a stick. ${mpPast()}

The Castle cart is at the kitchen door with a Cheshire cheese. It weighs eighty pounds. Two men lift it down.

“Lord Cullerne’s compliments, sir. His lordship says the times are too dear for turtle.”

Mrs Bunce measures it round with her apron string.`,
    keep:'Vote for Fitzroy and keep the cheese.', back:'Send the cheese back and stay out of it.',
    hold:() => `Seven hundred pounds. Half of it goes in bread. The electors ask for it so.

You are returned. There is no chairing. The six men say they have not the legs for it this year. They have five shillings each instead.

You walk round the market place on your own feet with your hat off.`,
    lose:() => `Seven hundred pounds.

A stranger comes down on Monday with two thousand. He has the contract for the army’s biscuit in Spain. He buys five plots outright before the poll, pigs and all.

You are out by four. He is chaired. He gives the six men a guinea each not to drop him.

Half Moon Street is given up at Christmas. ${hh(`Henrietta says London was always too far from the linen.`, `Henrietta writes that London was always too far from the Pump Room.`)}`,
    quit:() => `You tell the electors at the George that you will not offer yourself again. You have spoken in the House twice.

They give you three cheers and a dinner. You pay for the dinner.

A note comes from the Castle on Monday. “Lord Cullerne is obliged to Mr ${S.sur}.” There is a haunch with it.`,
    vote:() => `“Thank his lordship.”

Mr Bligh is returned. He is helped up the steps of the hustings.

The cheese has a shelf of its own in the dairy. The household eats at it until Lady Day. The mice have the rind.`,
    win:() => `The cheese goes back on the cart. Nine hundred pounds. Bread is dear. The money goes further in Pig Lane than it ever did.

Nineteen for you. Twelve for Mr Bligh. He cannot be chaired and you are not. The six men are paid to stay at home.

You are Member for Wyvern. You take your seat in November. The gentleman beside you asks whose son you are.`,
    beat:() => `The cheese goes back. Nine hundred pounds.

On the poll day the Castle gives a loaf and a pound of cheese to every man in Wyvern, elector or no. It is the same cheese.

Fourteen votes. You ride home past forty men eating on the churchyard wall. Several take off their hats.`,
    home:() => `“My compliments. We make our own cheese.”

Two men lift it back. Mr Bligh is returned without your votes.

At dinner Mrs Bunce brings up the Hatherley cheese. It is the size of a hat. She sets it in the middle of the table and waits.`}
};
const poll = () => POLLS[S.year] || POLLS[1802];

ev({ id:'election', fixed:['1802-2','1806-2','1807-1','1812-3'], title:'The Writ for Wyvern',
  cut:() => 'election-' + (POLLS[S.year] ? S.year : 1802) + (F('mp') ? '-member' : ''),
  text:() => (F('mp') ? poll().mp() : poll().out()).replace(/\n\n\n+/g, '\n\n').replace(/ +\n/g, '\n'),
  choices:[
    {t:'Fight the seat.', note:'£700', if:() => F('mp'), go:() => { add({money:-700});
      if (electionWin() || chance(0.3)) { add({standing:4}); S.mpWins = (S.mpWins || 1) + 1; return poll().hold(); }
      unseated(); add({standing:-6});
      return poll().lose(); }},
    {t:'Give up the seat and save the money.', if:() => F('mp'), go:() => { unseated(); add({standing:-3, family:1}); reg('cullerne',2,'You gave him back the seat for Wyvern');
      return poll().quit(); }},
    {t:() => poll().keep, if:() => !F('mp'), go:() => { fl('cullerneMan'); add({standing:2}); reg('cullerne',2,'You gave Fitzroy your three votes');
      return poll().vote(); }},
    {t:'Stand against him.', note:'£900', if:() => !F('mp'), go:() => { add({money:-900});
      if (electionWin()) { seated(); add({standing:10}); reg('cullerne',-3,'You took a seat at Wyvern from his nephew');
        return poll().win(); }
      S.mpBeat = S.year; add({standing:-4}); reg('cullerne',-4,'You stood against his nephew and lost');
      return poll().beat(); }},
    {t:() => poll().back, if:() => !F('mp'), go:() => { add({goodwill:1}); reg('cullerne',-2);
      return poll().home(); }}
  ]});

ev({ id:'clarke', fixed:'1809-0', cond:() => E() === 'army' && !F('edmundDead'), title:'Mrs Clarke’s Tariff',
  text:() => `Edmund is home from Corunna. He is a captain. His coat hangs off him.

At breakfast he reads the Parliamentary report aloud. Mrs Mary Anne Clarke, lately under the protection of the Duke of York, is at the bar of the House. She sold army commissions. She kept the list of names pinned to the bed curtain.

A letter has come for you by the same post. It is from a Mr Dawlish, of Craven Street.

“Sir, The regular channels being at present somewhat crowded, I am in a position to obtain for Captain ${S.sur} a Majority in the 52nd. Nine hundred pounds. The matter would be private.”

Edmund is still reading. He has not seen it.`,
  choices:[
    {t:'Pay Dawlish his nine hundred.', note:'£900', go:() => { fl('major'); add({money:-900}); reg('edmund',1);
      if (chance(0.35)) { add({standing:-6}); return `You send Dawlish a draft for nine hundred pounds. The Gazette has it within the month. “Captain ${S.sur} to be Major.”

In April Dawlish is taken up for fraud. His ledger is read out at Bow Street. Your name is on the fourth page, between a bishop’s nephew and a wine merchant.

Edmund keeps the rank. A cutting from the Morning Chronicle comes by post from the Castle. There is no note with it.`; }
      return `You send Dawlish a draft for nine hundred pounds.

The Gazette has it within the month. “52nd Foot. Captain ${S.sur} to be Major.”

Edmund reads the line at breakfast. He reads it again. He does not ask you anything. He gets up and goes out to the stables. He is there until dinner.`; }},
    {t:'Burn the letter. He shall rise by merit or not at all.', go:() => { add({standing:1}); reg('edmund',chance(0.5) ? 1 : -1);
      return `You put it on the fire. Then you tell him.

“Quite right, sir.”

He butters his toast. “Harry Tamworth got his for seven hundred.”

He sails for Lisbon a captain. ${hh(`Henrietta has packed four new shirts and a cheese.`, `Four new shirts and a cheese go after him from Gay Street.`)}`; }},
    {t:'Send the letter to the Horse Guards.', go:() => { add({standing:3}); reg('edmund',-1,'Thinks you made him conspicuous at the Horse Guards');
      return `You enclose Dawlish’s letter to the Commander-in-Chief’s office.

A colonel replies in six lines. He thanks you. Dawlish is arrested on the Tuesday.

Edmund’s next letter from the regiment is short. There is a new name for him in the mess. He does not tell you what it is. Harry Tamworth tells his sister. ${hh(`She tells Henrietta.`, `She writes it to Henrietta at Bath.`)}`; }}
  ]});

ev({ id:'jubilee', fixed:'1809-3', title:'Fifty Years a King',
  text:() => `On the twenty-fifth of October the King begins the fiftieth year of his reign. He is blind now. The London papers do not mention it.

Every parish in Berkshire is to roast an ox. Newbury has bought one. Wyvern has bought two.

The churchwardens are in your hall with their hats in their hands. They would like to know what Hatherley is to do.`,
  choices:[
    {t:() => `Roast an ox on ${ground()}.`, note:'£80', go:() => { add({money:-80, goodwill:8});
      return `You give the ox. Eighty pounds with the beer.

It goes on the spit at four in the morning. Every dog in the parish sits round it. Six men turn. Eleven give advice.

At dusk it is black outside and red at the bone. Nobody minds. Most of them have not tasted beef since Easter. There is a bonfire. Then the fiddler. Then two of the Dances fight behind the cart shed.`; }},
    {t:'Give a dinner to the county instead.', note:'£130', go:() => { add({money:-130, standing:5, goodwill:-2}); reg('cullerne',1);
      return `Forty of the county sit down in the long gallery. A hundred and thirty pounds.

Kitty’s old drawing master has painted the King on a bed sheet. It hangs at the end of the room with lamps behind it. His Majesty seems to be looking through a hedge.

Nineteen toasts. Lord Cullerne proposes the eleventh and stays for the rest.

The kitchen windows are open. The smell goes down to the village. At the Bell they drink the King’s health once, in small beer.`; }},
    {t:'Release the parish debtors from Wyvern lock-up, as the King asks.', note:'£45', go:() => { add({money:-45, goodwill:5, standing:2});
      return `The King’s own proclamation asks for it. You go to the Wyvern lock-up with forty-five pounds. The gaoler opens his book.

Seven debtors. One is the Hatherley baker. He owed four pounds. He has been inside eleven months. It has cost the parish nine pounds to keep him there.

He walks home by the turnpike. It takes him the afternoon. He stops at every gate and looks into the field.`; }}
  ]});

ev({ id:'ludd', fixed:'1812-1', title:'A Letter Signed by General Ludd',
  text:() => `Wheat is a hundred and twenty-six shillings. Nobody living has seen it dearer.

There is a paper under the estate office door. It is a leaf torn from a hymn book. Hymn 40 is on one side. The other side is written in capitals.

“SIR. ${F('thresher') ? 'YOU HAVE SET UP A THRASHING MACHINE IN THE GRATE BARN.' : 'YOU WAS SEEN AT MR HARTOPS LOOKING AT HIS THRASHING MACHINE AND HAVE SENT FOR THE SAME.'} IT DOES IN A WEEK WHAT 12 MEN DOES ALL WINTER WITH FLAILS. WE HAVE NO OTHER WINTER WORK. WE ARE NOT JACKOBINS WE ARE ONELY HUNGRY. WE WILL HAVE OUR BREAD OR WE WILL HAVE YOUR BARN. GENL LUDD.”

You know the hand. Jem Pryor makes his G backwards.`,
  choices:[
    {t:() => F('thresher') ? 'Take the machine down.' : 'Cancel the order.', go:() => { const had = F('thresher'); if (F('thresher')) { fl('thresher', false); S.improve = Math.max(0, S.improve - 1); } add({goodwill:7, standing:-1}); reg('hartopp',-2,'Thinks you surrendered to a hymn book'); reg('pryor',2,'You gave up the threshing machine');
      return `${had ? 'The machine is unbolted and carted to Newbury for sale.' : 'You write to the maker and cancel the order.'}

All winter there are twelve flails going in the great barn. You can hear them from the library.

Hartopp rides over. He tells you that you have put farming back thirty years. He does not get down from his horse to say it.

On Sunday the hymn book in the third pew has a leaf pasted back in.`; }},
    {t:'Keep the machine and set a guard on the barn.', note:'£60', go:() => { if (!F('thresher')) { fl('thresher'); S.improve++; } add({money:-60, goodwill:-10, standing:2}); reg('pryor',-2,'You set a guard over the machine'); later('rickFire', 2);
      return `Mudge sits up in the great barn with two men from Wyvern, two blunderbusses and a dog. Sixty pounds for the winter.

The machine threshes forty quarters a day. It can be heard at the church.

Twelve flails hang on their nails in the cottages. Twelve men stand at the corner by the Bell from morning till dark. They have their hands in their pockets. They watch the barn.`; }},
    {t:'Keep the machine, and keep the twelve men on at winter wages.', note:'£180', go:() => { if (!F('thresher')) { fl('thresher'); S.improve++; } add({money:-180, goodwill:4}); reg('hartopp',1); reg('pryor',1);
      return `The machine threshes. You keep the twelve men on at winter wages. A hundred and eighty pounds.

They hedge. They ditch. They mend the Kintbury road. It has been two ruts and a pond since your uncle was a boy.

Hartopp calls it “sentimental arithmetic”. On Sunday Jem Pryor is in church. He shares a hymn book with the wheelwright. They sing Number 40.`; }}
  ]});

ev({ id:'bumper', fixed:'1813-2', title:'A Harvest Too Good',
  text:() => `The wheat on Long Barrow stands to a man’s chest. It is the same on every farm in the county. The Mercury says it is the same in every county in England.

Last year a quarter fetched a hundred and twenty-six shillings. This week at Newbury it fetched ninety. Next week it will be less.

Your tenants took their leases at the high price. At the audit dinner they eat the beef in silence. Dewey is working something out on the cloth with the handle of his fork.`,
  choices:[
    {t:'Tell them now that you will look at the rents if prices keep falling.', go:() => { fl('abatePromised'); add({goodwill:6});
      return `You stand up before the cheese.

“If the price goes on falling, I will look at the rents.”

You name no figure. But eleven men have heard you, with a round of beef on the table. Dewey puts down his fork and asks for the mustard.`; }},
    {t:'Say nothing. A lease is a lease.', go:() => { add({goodwill:-3});
      return `You carve. You pass the mustard. You talk of the weather.

They carry the heaviest harvest of their lives. It sells for less than the worst.

At Michaelmas they pay to the shilling. Each man counts his rent on to the table. Then he sits back and looks at you until the next man has counted his.`; }}
  ]});

ev({ id:'peace', fixed:'1814-1', title:'The Sovereigns in London',
  text:() => `Bonaparte has abdicated. They have given him Elba. It is an island about the size of the hundred of Kintbury.

The Emperor of Russia is in London. So is the King of Prussia. So is Marshal Blücher, who is seventy-one. The Mercury says women stop his carriage to kiss him.

${hh(`Henrietta has had a letter. “The Tamworths have taken a house in Brook Street for the summer.”

She leaves it by your plate.`, `Henrietta writes from Gay Street. “The Tamworths have taken a house in Brook Street for the summer.”

There is nothing else in the letter.`)}`,
  choices:[
    {t:'Take a house in town for the celebrations.', note:'£600', go:() => { add({money:-600, standing:5, family:7}); reg('henrietta',2);
      return `${hh(`Six hundred pounds for a house in Clarges Street until August.`, `Six hundred pounds for a house in Clarges Street until August. Henrietta comes up from Bath with five trunks.`)}

You see the Tsar at the Opera. You see the King of Prussia at a window in St James’s. In Piccadilly the crowd takes the horses out of Blücher’s carriage and drags it to Carlton House by hand.

On the first of August there are fireworks in the Park. A Chinese pagoda on the canal catches fire and falls in. Henrietta has your arm. She does not let go of it all evening.`; }},
    {t:() => `Feast the village on ${ground()}.`, note:'£70', go:() => { add({money:-70, goodwill:6});
      return `Trestles on ${ground()}. Four hundred sit down to beef and plum pudding. Seventy pounds.

At dusk they burn Bonaparte. He is made of straw and an old coat of Mudge’s, stuffed with squibs. He burns for ten minutes and goes off at the end.

One of the small Dances watches with her thumb in her mouth. “Who will come for us now?” she asks. Nobody can tell her.`; }},
    {t:'Stay home. It will not last.', go:() => { add({family:-4}); reg('henrietta',-1);
      return `${hh(`“We stay at home. He will be back within the year.”

“You are impossible,” says Henrietta.

She does not speak of London again. She reads the Tamworths’ letters upstairs.`, `You write to Gay Street. “We stay where we are. He will be back within the year.”

“You are impossible,” Henrietta writes.

She does not write of London again. The Tamworths’ letters are no longer sent on.`)}`; }}
  ]});

ev({ id:'abatement', fixed:'1814-2', title:'Sunday Coats',
  text:() => { meet('thorne'); const dewey = !thorneHolds();
    return `Your tenants are in the hall. They have come up together. It is a Wednesday. Every one of them is in Sunday clothes.

${dewey ? 'Old Dewey' : 'Mrs Thorne'} has a paper. ${dewey ? 'He' : 'She'} is the one among them who can add.

“Wheat was above a hundred when we signed, sir. It was seventy-four on Thursday. At seventy-four, half of us are sold up by Lady Day.”${F('abatePromised') ? ' The paper is turned over. “You said at the audit dinner that you would look at the rents. We have come so that you can look.”' : ''}

“What do you ask?”

“One fifth off, sir.”`; },
  choices:[
    {t:'Grant the fifth.', go:() => { fl('abated'); S.rentAdj *= 0.8; add({goodwill:11, standing:-1}); reg('thorne',2,'You took a fifth off the rents in the bad year');
      return `“One fifth. From Michaelmas.”

The hall breathes out. It will cost you a fifth of the rental.

In the spring the bailiffs come through the county with their carts. They sell up three farms at Kintbury and five at Inkpen. They pass the Hatherley turning. They do not take it.`; }},
    {t:'Grant a tenth, and let the Michaelmas arrears stand over.', go:() => { fl('abatedHalf'); S.rentAdj *= 0.9; add({goodwill: F('abatePromised') ? 2 : 5}); reg('thorne',1);
      return `“One tenth. The Michaelmas arrears may stand over till next year.”

They thank you. They go down the drive in a body. You can hear them from the steps as far as the lodge. They are doing the sum again with the other tenth in it.`; }},
    {t:'Refuse. They signed.', go:() => { add({goodwill: F('abatePromised') ? -16 : -11, standing:1}); S.rentAdj *= 0.93; reg('thorne',-2,'You refused the tenants in the fall of 1814'); reg('cullerne',1);
      return `“You signed.”

They put on their hats in the hall.

By Christmas two farms are empty. One man went in the night. He left the key on a nail. Beside it was a note of what he owed, right to the farthing. There was no money with it.

The thistles on his land seed in June. They blow across the lane on to Dewey’s wheat.`; }}
  ]});

ev({ id:'cornLaw', fixed:'1815-0', title:'The Corn Bill',
  text:() => `The bill is short. No foreign wheat to be landed in England until English wheat reaches eighty shillings the quarter.

Lord Cullerne has called it the wisest measure since Magna Carta. He said so at Quarter Sessions, standing.

The London papers come down on the mail. A crowd has broken the windows of every Member thought to favour it. There are soldiers round the House of Commons with fixed bayonets.

${F('mp') ? 'The division is on Friday. You have a vote.' : 'Two petitions lie on a table at the George in Wyvern. One is for the bill. One is against. Beside each is a pen.'}`,
  choices:[
    {t:() => F('mp') ? 'Vote for the bill.' : 'Sign for the bill.', go:() => { fl('cornFor'); add({standing:3, goodwill:-7}); reg('cullerne',2,'You stood with the land on the Corn Bill'); reg('pryor',-1);
      return F('mp') ? `You vote with the Ayes.

You leave the House between two lines of Life Guards. A man in the crowd is holding up a loaf on a pole. It is draped in black crape. He turns the pole to follow you.

That night every window of the Half Moon Street house is broken. The landlord sends the glazier’s bill in the morning.` : `You sign for the bill. Your name is third, under Lord Cullerne’s and Mr Tamworth’s.

The bill passes. Bread in Hatherley stays dear.

Somebody copies the names and nails the copy up in Wyvern market place. On Sunday Jem Pryor does not touch his hat.`; }},
    {t:() => F('mp') ? 'Vote against it.' : 'Sign against it.', go:() => { fl('cornAgainst'); add({standing:-3, goodwill:7}); reg('cullerne',-3,'You went against the land on the Corn Bill'); reg('pryor',1);
      return F('mp') ? `You vote with the Noes. Seventy-seven of you. The rest sit for Manchester, Leeds and the like. One of them asks what you make. You tell him you grow wheat. He asks you to say it again.

The bill passes.

Lord Cullerne is in the lobby. You bow. He looks at the wall behind your head until you have gone by.` : `You sign against the bill. Yours is the only name on the sheet with “Esquire” after it. Above you is a baker. Below you is a staymaker.

The bill passes.

At the Castle they have a new name for you. ${hh(`Mrs Tamworth lets it out to Henrietta.`, `Mrs Tamworth lets it out in a letter to Gay Street.`)} “The Loaf.”`; }},
    {t:() => F('mp') ? 'Be unavoidably detained in the country.' : 'Sign neither.', go:() => { add({standing:-1});
      return F('mp') ? `On Friday you are at Hatherley, looking at a drain. The bill passes.` : `You ride past the George on market day and do not go in. The bill passes.`; }}
  ]});

ev({ id:'waterloo', fixed:'1815-1', title:'The Gazette Extraordinary',
  text:() => `The twenty-second of June. A post-chaise comes up the Bath road with four horses and a man standing in it, shouting. A battle near Brussels. Three days. The French army is destroyed.

Wyvern rings its bells until the tenor cracks.

The Gazette comes two days after. The killed and wounded fill nine columns of small type.${E() === 'army' && !F('edmundDead') ? `

The 52nd was in the line. ${hh(`Henrietta met the post-boy at the gate. She is in the hall with the paper in both hands. She has not opened it. She holds it out to you.`, `A second packet lies under your Gazette. It is from Gay Street, by express. Henrietta has sent her own copy. She has not broken the wrapper.`)}` : ''}`,
  choices:[
    {t:'Read the lists.', if:() => E() === 'army' && !F('edmundDead'), go:() => {
      const r = Math.random();
      if (r < 0.2) { fl('edmundDead'); fl('edmundFate','killed at Waterloo'); add({family:-25, standing:4}); reg('henrietta',-1);
        return `You find the 52nd. You go down the column with your finger.

“Killed. ${F('major') ? 'Major' : 'Captain'} ${S.sur}.”

The colonel writes in July. It was in the last half-hour. The regiment wheeled out of the line against the flank of the Guard. “He can have felt nothing.”

A box comes in August. His sword. His watch. Eleven shillings. A letter that begins “My dear Mother” and stops after six lines.

${hh(`Henrietta gives her coloured gowns to the maids.`, `At Gay Street Henrietta gives her coloured gowns to the maid.`)}`; }
      if (r < 0.6) { fl('edmundFate','lost an arm at Waterloo'); add({family:6, standing:4}); reg('edmund',1);
        return `You find the 52nd. You go down the column with your finger.

“Wounded, severely. ${F('major') ? 'Major' : 'Captain'} ${S.sur}.”

Six weeks later he gets down from the Bath coach. His left sleeve is pinned across his chest. ${hh(`He puts his one arm round his mother.`, `His mother gets down after him.`)}

At dinner he tells it. “A farmyard. The surgeon was very quick. Afterwards he asked if I wanted it. I could not think what for.”

Henrietta cuts up his meat. He lets her.`; }
      fl('edmundFate','came through Waterloo without a scratch'); add({family:10, standing:4}); reg('edmund',1);
      return `You find the 52nd. You go down the column with your finger. Then again. Then a third time. He is not in it.

${hh(`Henrietta sits down on the hall floor.`, `You send a groom to Bath with one line. He is there by dark.`)}

His letter comes nine days later. “Two horses killed under me and a ball through my hat. I am perfectly well. Pray send a hat.”`; }},
    {t:() => `Ring the bells and broach a hogshead on ${ground()}.`, note:'£50', if:() => !(E() === 'army' && !F('edmundDead')), go:() => { add({money:-50, goodwill:5, standing:1});
      return `You have a hogshead rolled out on ${ground()}. Fifty pounds for that and the ringers.

It is empty by dusk. Two old soldiers are carried round the green in kitchen chairs. One left a leg at Alexandria. One left a leg at Talavera. They argue about which was the worse place.

The war began before most of these children were born. A boy asks his father what the soldiers will do tomorrow.`; }},
    {t:'Open a subscription for the widows.', note:'£100', if:() => !(E() === 'army' && !F('edmundDead')), go:() => { add({money:-100, standing:4, goodwill:2});
      return `You open a book at the vestry for the Waterloo widows and put down a hundred pounds.

Hatherley adds forty-one pounds, four shillings and threepence. Most of it comes in coppers. Sukey Pryor brings sixpence in a dock leaf.

Three Hatherley men were in the battle. Two come home.`; }}
  ]});

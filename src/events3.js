/* What a man brings with him. One event for each choice made at the inheritance.
   Written in the Hatherley hand (docs/voice/VOICE.md): plain narrator, inside the year, the wit left to the people and the sums. */
const first = () => S.name.split(' ')[0];
const steward = () => F('crabbeGone') ? 'Lark' : 'Crabbe';

/* ---- his past ---- */

ev({ id:'tSoldier', from:1796, to:1801, weight:5, cond:() => T('soldier'), title:'A Man at the Kitchen Door',
  text:() => `Mrs Bunce sends up to say that there is a soldier in the yard, who will not go away, and will not come in.

He is standing by the pump with his hat off, a man of sixty, with his left sleeve pinned up at the elbow; and he has a magistrate’s pass from Portsmouth to his parish in Shropshire, at a penny a mile.

“Fogg, sir. Serjeant. Your company, the Twenty-third. I had the left of the line at Guilford.”

You had the colours; and when the ball went through your leg, it was he who carried you a quarter of a mile.

“They gave me nothing at Chelsea, sir. They said it was the wrong arm.”`,
  choices:[
    {t:'Give him the south lodge and the keeping of the gate.', note:'£12 a year', go:() => { fl('fogg'); add({money:-12, goodwill:3, family:1}); if (F('volunteers')) add({standing:2});
      return `“There is a lodge at the south gate, Serjeant. Two rooms and a copper.”

He looks at the lodge for some time before he answers.

“I can open a gate, sir.”

He is at the gate next morning before the carrier, and salutes every carriage with the arm that he has.${F('volunteers') ? ` On Sundays he drills the Volunteers on ${ground()}, from a chair.` : ''}`; }},
    {t:'Write to the Board at Chelsea in his behalf.', go:() => { if (chance(0.5 + (S.standing - 40) / 100)) { add({standing:2, goodwill:2});
        return `You write four sides to the Commissioners of Chelsea Hospital, and sign them with your rank.

The answer comes in nine weeks. “Daniel Fogg, late Serjeant, 23rd Foot, is admitted an Out-Pensioner at five pence a day from Lady Day last.”

Fogg has the letter read to him twice, and asks if he may keep the cover that it came in.`; }
      add({goodwill:1});
      return `You write four sides to the Commissioners of Chelsea Hospital, and sign them with your rank.

The answer comes in nine weeks. “The Board regrets that the Man’s name does not appear upon the Regimental return for the year in question.”

Fogg hears it standing, and thanks you for the paper and the ink; and before breakfast he is gone up the Oxford road.`; }},
    {t:'Give him a guinea and his dinner, and let him go on.', note:'£1', go:() => { add({money:-1, goodwill:-1});
      return `He eats in the kitchen, and puts the guinea inside his shoe.

“Thank you, Captain.”

You were a lieutenant. He goes out by the back drive; and for the rest of the day Mrs Bunce does not speak to anybody.`; }}
  ]});

ev({ id:'tCourt', from:1797, to:1806, weight:5, cond:() => T('court') && S.season === 1, title:'A Letter from the Board of Green Cloth',
  text:() => `Windsor Castle, the 2nd of July.

“Sir, I am commanded to acquaint you that His Majesty’s Swans upon the Thames between Staines and Henley are to be taken up, marked and numbered in the third week of this month. The Deputy Keeper is expected to attend the Royal barge in person, in the scarlet coat of his Office.

“The coat is not provided.

“I have the honour to be, Sir, your most obedient humble servant, Jno. Meux, Clerk.”

A tailor in Reading will make the coat for nineteen guineas; and a week at Windsor is forty more.`,
  choices:[
    {t:'Go to Windsor.', note:'£62', go:() => { add({money:-62, standing:6}); reg('henrietta',1);
      return `You stand five days in the bows of a barge, in a scarlet coat, while the swans are caught with a crook, and object to it.

On the Thursday the King is rowed out from Datchet, in a blue coat, with his own hat in his hand.

“What, what? ${S.sur}! The mangel-wurzel man. How do they do in Berkshire? Hey? Do the sheep eat ’em?”

“They do, sir.”

“Good. Good. Tell them to eat the tops.” He is rowed away.

The Reading Mercury prints it on the Monday.`; }},
    {t:'Plead the harvest and stay at home.', go:() => { if (chance(0.4)) { fl('courtLost'); add({standing:-4});
        return `You write that the harvest cannot spare you.

Mr Meux replies by return. “His Majesty has been pleased to appoint Colonel Disbrowe to be Deputy Keeper of the Swans, vice ${S.sur}, who has business.”

The salary stops at Michaelmas.`; }
      add({standing:-1});
      return `You write that the harvest cannot spare you.

Mr Meux replies in three lines, that the Deputy Keeper’s absence has been noted in the book, and that he is to send two guineas for the watermen’s dinner.`; }},
    {t:'Sell the place to a Windsor attorney who has asked for it.', note:'+£400', go:() => { fl('courtSold'); add({money:400, standing:-3});
      return `Mr Tebbutt of Peascod Street gives four hundred pounds for the reversion, by a deed of two skins of parchment.

He has the scarlet coat made the same week, and wears it to church.`; }}
  ]});

ev({ id:'tBred', from:1797, to:1807, weight:5, cond:() => T('bred'), title:'Mr Young Wants Particulars',
  text:() => `There is a letter, franked from the Board of Agriculture in Sackville Street.

“Dear Sir, I am told by Mr Hartopp that you have drilled wheat at nine inches upon the chalk at Hatherley these three seasons. I beg you will favour the Board with the particulars: seed per acre, produce per acre, the expence, and your failures. Gentlemen send me their successes by every post.

“Yours faithfully, Arthur Young.”

Your wheat did well. But your drilled beans upon Gallows Piece came up in June, and were dead by July; and Hartopp does not know about the beans.`,
  choices:[
    {t:'Send him everything, the beans included.', go:() => { add({standing:4}); reg('hartopp',1);
      return `You give him five sides, with the sums ruled.

The Annals of Agriculture print it in the spring number, under the head “Berkshire. Experiments of ${first()} ${S.sur}, Esq.”, with a paragraph for the beans to themselves; and Hartopp rides over with the number in his pocket.

“You told him about the beans.”

“He asked.”

“Nobody tells him about the beans.”

He stays to dinner, and asks to see Gallows Piece.`; }},
    {t:'Answer him by asking the tenants up to see the drill at work.', note:'£20', go:() => { S.improve += 1; add({money:-20, goodwill:3});
      return `Eleven farmers stand at the top of Hall Close upon a Tuesday, and watch the drill go down the field and back.

Nobody says anything. But old Dewey walks out, and puts his thumb into a row.

“How deep?”

“Two inches.”

He measures it against his thumbnail, and walks back.

Four of them send to borrow the drill before Michaelmas; and you write to Mr Young that the particulars will follow.`; }},
    {t:'Send the wheat figures and leave out the beans.', go:() => { add({standing:2});
      return `The Annals print the wheat; and beneath it Mr Young adds a line of his own.

“We should have been glad to hear of this gentleman’s beans.”`; }}
  ]});

ev({ id:'tStranger', from:1795, to:1798, weight:6, cond:() => T('stranger'), title:'Two Ears in the Corn Market',
  text:() => `It is Thursday, in Wyvern corn market, where the farmers stand along the wall of the Exchange with their sample bags open; and as you come by, old Dewey of Starveall steps out, with an ear of corn in each hand, and holds them up to you, level.

“Morning, sir. Which of these be the wheat?”

The wall has gone quiet. ${steward()} is at your elbow. One ear has a beard upon it, and the other has not; and that is all that you can see.`,
  choices:[
    {t:'Point to one.', go:() => { if (chance(0.5)) { add({goodwill:4, standing:1});
        return `You take the one without the beard.

“That.”

Dewey looks at it, and then along the wall.

“So ’tis.”

Somebody at the far end says that a London man might have a brother in the trade. But Dewey puts both ears back in his pocket, and gives you the wall.`; }
      add({goodwill:-3, standing:-1});
      return `You take the one with the beard.

“That.”

“That be barley, sir.”

Nobody laughs until you are past the pump; and then you hear it.

At the rent audit in the spring there is a bearded ear laid across your plate.`; }},
    {t:'“I cannot tell, Mr Dewey. Show me.”', go:() => { add({goodwill:6});
      return `Dewey lowers his hands.

“Well. That’s said plain.”

He gives you the bearded one. “Barley. See her whiskers.” He gives you the other. “Wheat. Bite un.”

You bite it, and it is hard and sweet.

He keeps you twenty minutes upon smut and mildew; and three of the others come off the wall to correct him.`; }},
    {t:'Let the steward answer for you.', go:() => { add({goodwill:-4}); if (!F('crabbeGone')) reg('crabbe',1);
      return `“The left, Mr Dewey,” says ${steward()}. “As you are aware.”

“I asked the squire.”

“The squire employs me to know.”

Dewey puts the ears away, and touches his hat to ${steward()}, and then to you.`; }}
  ]});

/* ---- his fortune ---- */

ev({ id:'tLegacy', from:1795, to:1797, weight:7, cond:() => T('legacy'), title:'The Residuary Legatee',
  text:() => `A hamper comes by the Bath coach, carriage unpaid, three and fourpence, with a letter tied to the handle.

“Bath, Milsom Street. Sir, By the fourth clause of the late Miss Venables’s Will, the Legacy to yourself is charged with the maintenance of her Dog, Pompey, during his natural life. I am to wait upon you each Lady Day to satisfy myself that the animal continues in health. Should he not, the Legacy passes to the Bath Infirmary.

“Your obedient servant, Saml. Stroud, Attorney.”

The hamper is growling. Pompey is a pug, fourteen years old, and very fat; and he bites the footman who lifts him out.`,
  choices:[
    {t:'Keep him at the Hall.', go:() => { fl('pompey'); add({family:-3}); reg('henrietta',-1,'Has a pug of fourteen in her drawing room');
      return `Pompey takes the hearth rug in the drawing room, and holds it.

He bites Dr Gall in October, and the piano tuner at Christmas; and he is carried up and down stairs by John.

On Lady Day Mr Stroud comes out from Bath, and having looked at the dog for a full minute, writes “Alive” in a pocket-book.`; }},
    {t:'Board him with the Widow Harris at two shillings a week.', note:'£5 a year', go:() => { fl('pompey'); add({money:-5, goodwill:2});
      return `The Widow Harris has never had two shillings a week from anybody.

Pompey sleeps in her bed, and has the top of the milk; and by Christmas he is seen walking as far as the gate.

On Lady Day Mr Stroud is taken down to Kennet Bottom to view him, and writes “Alive. Thinner.”`; }},
    {t:'Give him to Kitty for her own.', if:() => K() === 'free', go:() => { fl('pompey'); add({family:3}); reg('kitty',1,'You gave her the Bath pug');
      return `Kitty ties a blue ribbon on him, and he lets her.

She reads to him; and he is carried about the garden in a basket, and bites nobody but the curate.

On Lady Day Mr Stroud writes “Alive” in his pocket-book. Kitty asks him whether he would like to hear the dog sing; and he says that he would not.`; }}
  ]});

ev({ id:'tClear', from:1796, to:1804, weight:5, cond:() => T('clear'), title:'Starveall Comes to the Hammer',
  text:() => `A printed bill is up at the George.

“TO BE SOLD BY AUCTION, by Mr Skinner, on Thursday se’nnight, the FREEHOLD FARM called STARVEALL, 180 Acres, adjoining the Lands of ${first()} ${S.sur}, Esq., and in the occupation of Mr Dewey. None but Principals will be treated with.”

Mr Tidmarsh has come out from the bank about it, and has brought your mortgage deed with him.

“You owe two thousand upon an estate that would carry six, sir. Starveall will fetch fifteen hundred. I should be happy to find it.”`,
  choices:[
    {t:'Buy Starveall on Tidmarsh’s money.', note:'Mortgage +£1,500', go:() => { fl('starveall'); S.mortgage += 1500; S.rentAdj *= 1.09; add({standing:3});
      return `It is knocked down to you at fourteen hundred and eighty, against a brewer from Reading; and the next morning Dewey comes up to the Hall, in his market coat.

“I hear I be yours.”

“You are, Mr Dewey.”

“Same rent?”

“The same.”

He puts his hat back on.`; }},
    {t:'Let Starveall go, and pay off five hundred more instead.', note:'£500', if:() => S.money >= 500, go:() => { S.mortgage = Math.max(0, S.mortgage - 500); add({money:-500});
      return `Tidmarsh counts the notes twice, and writes the sum off upon the back of the deed.

“It is not what I came for, sir.”

Starveall goes to the brewer from Reading, who at Michaelmas raises Dewey’s rent by forty pounds.`; }},
    {t:'Do neither.', go:() => { 
      return `Tidmarsh drinks a glass of sherry, and takes the deed home.

Starveall goes to a brewer from Reading, who puts up a board at the boundary; and the board says PRIVATE.`; }}
  ]});

ev({ id:'tDebts', from:1795, to:1798, weight:6, cond:() => T('debts'), title:'A Second Note of Hand',
  text:() => `A gentleman is shown into the library, whose card says Mr Raikes, of Jermyn Street, and who does not sit down, but lays a paper upon the table.

“I promise to pay Mr Jos. Raikes or bearer Three Hundred Pounds, value received. Barnaby ${S.sur}. Brooks’s, 14th March 1794.”

“Your late uncle, sir. I held it back from the executors out of delicacy.”

You paid seven hundred at the funeral, to a colonel. The signature has your uncle’s B; but the ${S.sur} slopes the other way.`,
  choices:[
    {t:'Pay it. The name is the name.', note:'£300', go:() => { add({money:-300, standing:2});
      return `You write the draft; and he reads it through, and folds it small.

“I knew I had to do with a gentleman.”

He is seen that night at the George, buying for the room.`; }},
    {t:'Ask him to leave the note with you till Tidmarsh has compared the hand.', go:() => { if (chance(0.6)) { add({standing:3});
        return `“By all means,” says Mr Raikes; but he does not let go of the paper.

“The bank has forty of my uncle’s signatures, sir. It will take an afternoon.”

He looks at the clock, and recollects that he is expected at Marlborough.

He takes the note with him, and it is not presented again.`; }
      add({money:-340, standing:-2});
      return `Tidmarsh lays the note beside the signature book, and gets out a glass.

“It is his hand, sir. He wrote so when he had dined.”

Mr Raikes has waited at the George, at your charge; and it is three hundred, and forty more for his time and his attorney’s.`; }},
    {t:'Offer him a hundred and fifty, now, for the paper.', note:'£150', go:() => { add({money:-150});
      return `He considers the ceiling.

“Guineas.”

“Pounds.”

He takes the pounds, and hands you the note; and when you put it upon the fire, he watches it burn, with his head on one side.`; }}
  ]});

ev({ id:'tSecond', from:1796, to:1802, weight:5, cond:() => T('second'), title:'Miss Skrine Gives Notice',
  text:() => `Bath, Gay Street, the 9th of the month.

“Sir, I hold a Mortgage upon your Estate for Two Thousand Pounds at Five per Cent, made to your late Uncle in the year ’84. Money is now worth Six. I am Seventy-three and have my Chair-men to pay.

“I must therefore ask Six per Cent from Michaelmas, or my Principal in Six Months.

“I remain, Sir, your humble servant, Letitia Skrine.”

${steward()} has brought the deed up from the tin box. She may do it.`,
  choices:[
    {t:'Agree to her six per cent.', note:'£20 a year more', go:() => { fl('skrine');
      return `You write that six will be paid.

Her receipt comes at Michaelmas, in the same hand, with a line under her name.

“Punctual. I had not expected it of a ${S.sur}.”`; }},
    {t:'Have Tidmarsh take the mortgage over at five.', note:'£60 in fees', go:() => { add({money:-60});
      return `Tidmarsh pays her off in Bank paper, by a transfer of three skins, which costs sixty pounds in stamps and attorneys.

Miss Skrine sends a receipt for the principal; and having checked the interest to the day, she finds that you owe her four shillings.`; }},
    {t:'Go to Bath and wait upon her, with a basket of Hatherley pears.', note:'£15', go:() => { add({money:-15}); if (chance(0.35 + S.standing / 150)) { add({standing:1});
        return `It is a first floor in Gay Street, where she sits in a wing chair, with a rug over her knees, and a parrot behind her.

She eats a pear with a silver knife, and does not offer you one.

“Your uncle brought me a pine-apple in ’84. It was not ripe.”

“These are ripe, ma’am.”

“So I find.” She wipes the knife. “Five, then. While the pears last.”

You send a basket every October.`; }
      fl('skrine');
      return `It is a first floor in Gay Street, where she sits in a wing chair, with a rug over her knees, and a parrot behind her.

She looks at the pears.

“I cannot eat fruit, sir. Six per cent, from Michaelmas.”

The parrot says “Michaelmas”; and you bring the pears home.`; }}
  ]});

/* ---- his marriage ---- */

ev({ id:'tLove', from:1797, to:1806, weight:5, cond:() => T('lovematch'), title:'Her Mother Sends for Her',
  text:() => `There is a letter for Henrietta from Cheltenham, in her brother’s hand, which she reads standing at the window.

“My mother is sinking. She asks for you. She does not ask for Mr ${S.sur} and I think it better you should come alone. Jas. Venn.”

Mrs Venn had a baronet in view for her daughter in the year ’74; and she has not written your name in twenty years, but directs her letters to “Miss Venn, at Hatherley”.

Henrietta folds the sheet.

“I shall want the chaise at six.”`,
  choices:[
    {t:'Go with her.', go:() => { add({family:5}); if (chance(0.5)) { reg('henrietta',2,'You came with her to Cheltenham, and were let in');
        return `You wait two days in the parlour of the house in Cheltenham; and upon the third the nurse comes down for you.

Mrs Venn is very small in the bed, and looks at you for a long time.

“You have kept her well, sir. I will say that.”

She says nothing more, and on the Sunday she dies. Henrietta holds your arm the whole length of the churchyard.`; }
      reg('henrietta',1,'You came with her to Cheltenham, and waited below');
      return `You wait four days in the parlour of the house in Cheltenham, and are not sent for.

Mrs Venn dies on the Sunday; and her will leaves Henrietta a pair of candlesticks, and you a shilling.

Henrietta puts the shilling in the poor box herself. She rides home with her hand in yours, and does not speak before Cirencester.`; }},
    {t:'Let her go alone, and send a letter up to the old lady by her hand.', go:() => { add({family:3}); reg('henrietta',1);
      return `You write half a sheet, in which you say that Henrietta has been the making of Hatherley, and of you.

Henrietta is gone nine days, and comes home in black.

“Did she read it?”

“James read it to her.”

“What did she say?”

“She said you wrote a good plain hand.” Henrietta takes off her gloves. “She had him read it twice.”`; }},
    {t:'It is the week of the audit. Ask her to wait till Monday.', go:() => { add({family:-9}); reg('henrietta',-3,'You kept her from her mother’s deathbed for the rent audit');
      return `She waits till Monday.

Mrs Venn dies on the Sunday night, and the express meets the chaise at Faringdon.

Henrietta has the horses turned round; and she says nothing about it to you, then or afterwards.`; }}
  ]});

ev({ id:'tPortion', from:1796, to:1804, weight:5, cond:() => T('portion'), title:'Mr Venn Asks for an Account',
  text:() => `Henrietta’s brother writes from Lincoln’s Inn.

“Dear ${S.sur}, I am going through my late father’s papers. By the marriage articles of 1774, two thousand of my sister’s eight were to be settled to her separate use. I find no settlement. I find a receipt from a slater at Newbury.

“I am her trustee. You will oblige me with an account. Yours, Jas. Venn.”

The letter came under cover to you. Henrietta is in the next room, re-covering a chair, with a pan upon the floor beside her to catch the drip.`,
  choices:[
    {t:'Settle a thousand on her now, raised on the estate.', note:'Mortgage +£1,000', go:() => { S.mortgage += 1000; add({family:10}); reg('henrietta',3,'You settled a thousand pounds on her, twenty years late');
      return `Venn draws the deed, for a thousand pounds in the Three per Cents, to her separate use, her receipt alone to be a discharge; and you carry it in to her yourself, and she reads it to the end.

“It was to be two.”

“It was.”

She puts it in her work-box, and turns the key; and with her foot she moves the pan an inch to the left.

“Thank you, ${first()}.”`; }},
    {t:'Send Venn the roof accounts. The money is over her head.', go:() => { add({family:-7}); reg('henrietta',-2,'Learned from her brother where her two thousand pounds went');
      return `You send him nine years of slaters’ bills, tied with tape.

He does not answer you. He writes to his sister.

Henrietta comes in to dinner with the letter in her hand, and lays it by her plate; and she does not open it at table, having no need to.`; }},
    {t:'Take the letter in to her, and ask what she would have.', go:() => { add({money:-200, family:6}); reg('henrietta',2,'You showed her the letter and asked what she wanted');
      return `She reads it, and goes on with the chair until the tack that she is holding is in.

“I knew it was the roof.”

“What will you have, Hetty?”

“My pin money, that you stopped in ’89. Fifty a year. And the arrears.”

You pay her two hundred pounds that night, in notes; and she writes you a receipt.`; }}
  ]});

/* ---- his advantage ---- */

ev({ id:'tBeloved', from:1796, to:1806, weight:5, cond:() => T('beloved'), title:'Will Ayres Before the Bench',
  text:() => `It is Petty Sessions, in the justice room; and the constable has brought in Will Ayres, carter to Mr Pocock.

“Asleep on the shafts, sir, on the turnpike, at ten at night, and no lantern. The Bath mail had to take the bank.”

The fine is ten shillings, and Ayres earns nine in a week.

Now you and Will Ayres robbed the vicarage orchard together in the summer of 1760, and it was he who took the thrashing for both; and he stands with his hat in his hands, and looks at you quite easily.

“’Twas a long day, ${first()}.”

The constable looks at the ceiling.`,
  choices:[
    {t:'“Ten shillings, Ayres. And it is ‘sir’ in this room.”', go:() => { add({standing:2, goodwill:-3}); reg('pryor',-1);
      return `He pays it at a shilling a week, and says “sir” in the justice room and in the lane.

At harvest home, being asked for the song about the squire and the mill pond, he says that he has forgot the words.`; }},
    {t:'Fine him the ten shillings, and send the money down to his wife that night.', note:'10s.', go:() => { add({money:-1, goodwill:3});
      return `“Ten shillings.”

“Yes, sir.”

Mudge takes a half-guinea down to the cottage after dark, and is told to say that it comes from nobody.

On Sunday there is a basket of pippins upon the Hall steps; and they are vicarage pippins.`; }},
    {t:'Dismiss it. The mail may keep a better look-out.', go:() => { add({goodwill:3, standing:-3}); if (!F('gallDead')) reg('gall',-1);
      return `“Discharged.”

“Thankee, ${first()}.”

The constable writes it in the book, and writes the “${first()}” too.

The proprietors of the Bath mail send a letter to the Chairman of Quarter Sessions, who reads it out, at dinner, to eleven magistrates.`; }}
  ]});

ev({ id:'tConnexions', from:1796, to:1808, weight:5, cond:() => T('connexions'), title:'A Cousin of the Marquess',
  text:() => `Stanmore House, Piccadilly.

“My dear ${S.sur}, You are, I think, my cousin, through the Lofts. I write on behalf of another: Mr Peregrine Loft, a young man of the first fashion, who finds it convenient to be out of London for a twelvemonth. There was a misunderstanding at Brooks’s. There was also a tailor.

“He is no trouble in a house. He shoots a little. I shall take it very kindly.

“Stanmore.”

The Marquess has not written to you before; and Mr Loft’s valet has written already, to ask the dimensions of the bedroom.`,
  choices:[
    {t:'Have Mr Loft to stay.', note:'£160', go:() => { add({money:-160, standing:7, family:-4}); reg('henrietta',1);
      return `He comes with a valet, eleven trunks, and a parrot, and rises at one.

He drinks the ’88 claret to the last bottle; he teaches the Miss Tamworths the waltz, until their mother stops it; and the county calls every day of the week to look at his neckcloth.

In March the Marquess sends a haunch, a civil letter, and a draft for the tailor; and Mr Loft leaves on the Tuesday, taking John with him as second footman.`; }},
    {t:'Offer him the Dower House and thirty pounds, and no more.', note:'£60', go:() => { add({money:-60, standing:2});
      return `Mr Loft views the Dower House from his chaise, without getting down.

He stays a month, and is heard to say at the Wyvern Assembly that he is rusticated among the Goths; and then he goes on to a cousin in Wiltshire.

The Marquess does not write.`; }},
    {t:'Regret that the house is full.', go:() => { add({standing:-3});
      return `You regret it in the third person.

The Marquess of Stanmore regrets it also, upon a card. By Sunday Lady Cullerne is found to know the whole matter; and twice, in the church porch, she asks Henrietta after “your cousin the Marquess”.`; }}
  ]});

ev({ id:'tSilver', from:1797, to:1797, weight:9, cond:() => T('silver'), title:'The County Meeting at Reading',
  text:() => `The High Sheriff has called a meeting of the freeholders at Reading town hall, upon a requisition to petition the King to dismiss his Ministers, and make peace with France.

There are six hundred in the hall, and more upon the stairs. Lord Cullerne’s people have a Loyal Address ready to move against it, and Hartopp has the petition in his coat; and each has been to you at the inn.

“You have a voice, ${S.sur}. Speak for us.”

The Sheriff is looking down the hall for the next man; and somebody behind you says your name.`,
  choices:[
    {t:'Speak for the Loyal Address.', go:() => { add({standing:6, goodwill:-3}); reg('cullerne',2,'You spoke for the Loyal Address at Reading'); reg('hartopp',-2);
      return `You speak for twenty minutes, upon the King, the Constitution, and the guillotine; and they cheer the guillotine.

The Address is carried by a show of hats, and Lord Cullerne has you to sit beside him at the ordinary.

“Deuced good. Didn’t know you had it in you.”

Hartopp dines at the other inn.`; }},
    {t:'Speak for peace.', go:() => { add({standing:-4, goodwill:6}); reg('hartopp',2,'You spoke for peace at the county meeting'); reg('cullerne',-2,'You spoke for the peace petition at Reading');
      return `You speak for twenty minutes, and give them the price of the loaf in each year of the war.

The petition is lost by a show of hats; but the back of the hall cheers you out into the street.

The Mercury prints the speech entire; and on Saturday it is read aloud at the Bell by Mr Oakes, who does it very well.`; }},
    {t:'Speak for the King and for peace, both.', go:() => { if (chance(0.6)) { add({standing:3, goodwill:3});
        return `You say that no man loves the King better than he who would spare him a war; and you say it four ways.

Both sides cheer, and each prints the speech as its own.

“Which were you for?” says Henrietta.

“I was very well received.”`; }
      add({standing:-3});
      return `You say that no man loves the King better than he who would spare him a war.

“Which way do you vote, sir?” calls a hatter from the gallery.

You say it again; upon which the hall begins to stamp, and the Sheriff calls the next man.`; }}
  ]});

ev({ id:'tFigures', from:1797, to:1808, weight:5, cond:() => T('figures'), title:'The Overseer’s Book',
  text:() => `It is the Easter vestry; and Mr Nokes the overseer lays the poor book upon the table for the ratepayers to pass, as he has done these nine years, during which nobody has opened it.

You open it.

“To Widow Gurney, 2s. weekly, 52 weeks.” Hannah Gurney was buried in March of last year. “To shoes for Jno. Coombes’s boy, 4s. 6d.” Five times.

You add the right-hand column, upward; and it comes to thirty-eight pounds more than the parish has paid out.

Nokes is the Wyvern grocer, at whose shop half the vestry owe; and he is watching your pencil.`,
  choices:[
    {t:'Read the column out to the vestry.', go:() => { fl('nokesOut'); S.poorMult *= 0.9; add({standing:2, goodwill:4});
      return `You read it out, line by line, until you come to Widow Gurney.

“She’s dead,” says the blacksmith.

“She has had five pound four since.”

Nokes stands up, and says that he keeps the book as his father kept it, and sits down.

The vestry votes Farmer Dewey overseer for the year, and the rate comes down a penny in the pound.`; }},
    {t:'Close the book, and call at the shop tomorrow.', go:() => { S.poorMult *= 0.95; add({goodwill:1});
      return `You call at nine, and Nokes takes you through to the back, among the candles.

You put the paper upon the tea chest; and he reads it, and takes off his apron.

“I can find twenty by Midsummer.”

“Thirty-eight. And I shall add the book each Easter.”

He finds it, and the dead come off the list.`; }},
    {t:'Pass the book with the rest.', go:() => {
      return `You close it, and slide it down the table, and it is passed.

On Saturday Nokes sends a Stilton up to the Hall, with his duty, nothing having been ordered.`; }}
  ]});

/* ---- his failing ---- */

ev({ id:'tPlay', from:1796, to:1810, weight:5, repeatGap:22, cond:() => T('play'), title:'Faro at the Tamworths’',
  text:() => `It is past midnight, in the Tamworths’ card room, where a Major Cathcart of the Militia has set up a faro bank upon the green table, and is dealing from a box.

You came with forty pounds in your pocket-book, and you have eleven. But the queen has lost four times together, and cannot lose a fifth.

Cathcart squares the pack.

“Do you go on, sir? I can take your note.”

Henrietta is in the doorway, with her cloak on.`,
  choices:[
    {t:'Go on, upon a note of hand.', go:() => { if (chance(0.35)) { add({money:310, family:-2});
        return `You put two hundred upon the queen, on paper.

She wins, and wins again; and you get up three hundred and ten pounds to the good, which Cathcart pays in Bank notes, quite as civil as before.

“You will give me my revenge on Thursday.”

Henrietta counts it in the carriage, and keeps it.`; }
      add({money:-260, family:-5}); reg('henrietta',-1,'Stood in the Tamworths’ doorway while you lost two hundred and sixty pounds');
      return `You put two hundred upon the queen, on paper.

She loses; and you put fifty upon the knave, to fetch it back.

You sign for two hundred and sixty pounds at the corner of the table, and Cathcart sands the note for you.

Henrietta has gone out to the carriage, and has taken the rug.`; }},
    {t:'Give Henrietta the pocket-book and get up.', go:() => { add({family:3}); reg('henrietta',1);
      return `You hand it to her across the room, and she puts it in her muff.

“Mrs ${S.sur} does not play?” says Cathcart.

“Mrs ${S.sur} has eleven pounds, sir, and means to keep them.”

In the carriage she gives you back the book, with eleven pounds in it. She has counted.`; }},
    {t:'Ask Cathcart to let you cut the pack.', go:() => { if (chance(0.5)) { add({standing:3});
        return `“Before you deal, Major. Oblige me.”

He holds the box out; and when you turn it over, the queens are all four at the bottom, together.

Nobody speaks. Tamworth rings for the Major’s horse.

Your twenty-nine pounds are returned to you by the Colonel of the regiment, with a letter.`; }
      add({standing:-4});
      return `“Before you deal, Major. Oblige me.”

He hands you the pack, which is as honest as a prayer book.

“Are you satisfied, sir?”

You say that you are, and the table hears you say it; and Tamworth asks whether you will take a glass of something before you go.`; }}
  ]});

ev({ id:'tEnemy', from:1796, to:1806, weight:5, cond:() => T('enemy'), title:'A Pointer in Cuckoo Copse',
  text:() => `Mudge is at the gun room door, with a pointer bitch upon a length of cord, liver and white, in a brass collar.

“Took her in Cuckoo Copse, sir. She had a hen pheasant.”

You turn the collar to the light. “CULLERNE.” And under it, smaller, “Duchess.”

She is the third of that name; and you shot the first in 1768.

“I could lose her, sir,” says Mudge. “Nobody saw.”

She sits down upon your foot.`,
  choices:[
    {t:'Walk her up to the Castle yourself.', go:() => { add({standing:1}); reg('cullerne',3,'You brought his pointer home on a cord, on foot');
      return `It is four miles, and you go on foot, with the cord round your wrist.

His lordship is upon the steps, in a shooting jacket; and he looks at the bitch, and then at you.

“You ain’t shot her, then.”

“No, my lord.”

“Hm.” He takes the cord. “You’d better have some sherry.”

It is the first time that you have been inside the house.`; }},
    {t:'Send her home with Mudge, and a note.', go:() => { reg('cullerne',1);
      return `“Mr ${S.sur}’s compliments, and he returns Lord Cullerne’s pointer, found straying.”

Mudge is given a shilling at the stable door.

There is no answer. But at church on Sunday his lordship nods, an inch.`; }},
    {t:'Keep her in the kennel till she is asked for.', go:() => { add({standing:-2}); reg('cullerne',-1,'You kept his pointer nine days');
      return `She is nine days in your kennel, and upon the tenth a groom rides over.

“His lordship’s compliments, and is his bitch here?”

“She is. She has had a hen pheasant of mine.”

The groom puts half a crown upon the mounting block, and takes the dog.`; }}
  ]});

ev({ id:'tWhig', from:1797, to:1800, weight:8, cond:() => T('whig') && S.season === 3, title:'Mr Fox’s Birthday',
  text:() => `There is a card, by hand, from the Crown at Reading.

“The Friends of Freedom in the County of Berks will dine together on the 24th of January, being the Birth-Day of the Right Hon. C. J. FOX. Dinner on Table at Four. Tickets 10s. 6d., Wine included.”

Hartopp has written upon the back. “You will come. We are thirty.”

Last year, at the dinner in London, the Duke of Norfolk gave the toast “Our Sovereign, the People”; and within the week the King struck him off as Lord Lieutenant. The names of those who dine at Reading will be in the Mercury.`,
  choices:[
    {t:'Dine, and drink every toast.', note:'10s. 6d.', go:() => { fl('foxite'); add({money:-1, standing:-5, goodwill:4}); reg('hartopp',2,'You drank “the People” at Mr Fox’s dinner'); reg('cullerne',-1);
      return `Thirty-one sit down, with a brewer in the chair.

“Gentlemen. Our Sovereign: the People.”

You stand, and drink it, and so does Hartopp; and a clergyman at the bottom of the table drinks it in water.

The Mercury gives the list on Monday, in which you are sixth. Dr Gall preaches upon the thirteenth of Romans; and the same evening the Bell drinks your health, by name.`; }},
    {t:'Dine, and keep your seat for that one.', note:'10s. 6d.', go:() => { add({money:-1, standing:-1}); reg('hartopp',-1);
      return `Thirty-one sit down, with a brewer in the chair.

“Gentlemen. Our Sovereign: the People.”

Thirty stand. You look at your plate.

The Mercury prints your name with the rest, and Hartopp rides home without waiting for you.`; }},
    {t:'Send the half-guinea, and a cold.', note:'10s. 6d.', go:() => { add({money:-1}); reg('hartopp',-1);
      return `You send the money, and your regrets, having a cold.

Hartopp returns the half-guinea the next morning, in a twist of paper, with nothing written upon the paper.`; }}
  ]});

ev({ id:'tGout', from:1798, to:1810, weight:5, cond:() => T('gout') && !F('goutEased'), title:'The Left Foot',
  text:() => `The gout came on at Quarter Sessions, where you were carried out of the Shire Hall between two constables; and you have lain eleven days with the foot upon a stool.

Ferris the surgeon has been, and has looked at the foot, and then at the decanter.

“No port for a twelvemonth, sir. No red meat after noon. Water.”

There is also a bottle upon the table, sent over by Lord Cullerne’s housekeeper. “L’Eau Médicinale d’Husson. One Guinea.” It is brown, and nobody will say what is in it.

Mrs Bunce has sent up a beefsteak.`,
  choices:[
    {t:'Do as Ferris says.', go:() => { fl('goutEased'); add({family:-2, standing:-1});
      return `You drink water for a year, and dine out upon boiled fowl.

The county thinks you unwell; and Henrietta thinks you a changed man, and tells you so at breakfast.

At Michaelmas the foot goes into a boot, and you walk to church.`; }},
    {t:'Take the French water.', note:'A guinea a bottle', go:() => { add({money:-12}); if (chance(0.55)) { fl('goutEased');
        return `You take a wineglass of it at night.

By morning the pain is gone out of the foot, and everything else is gone out of you; and Ferris, being sent for at four, sits by the bed with his watch.

“Meadow saffron,” he says, smelling the cork. “It will cure you or kill you. I should not take the second glass.”

You take it in halves, for a year, and the foot holds.`; }
      return `You take a wineglass of it at night.

You are extremely ill for three days, and the foot is exactly as it was.

Ferris smells the cork, and says nothing; and he sends in his bill for the three days.`; }},
    {t:'Eat the beefsteak.', go:() => { add({family:1});
      return `You eat it, and send down for the port.

The foot is upon the stool until Lady Day; and John learns to carry you upstairs without touching it.`; }}
  ]});

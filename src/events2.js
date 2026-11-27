/* The wandering pool: people, with their memories, turning up when they please. */

ev({ id:'crabbeSums', from:1796, to:1802, weight:3, cond:() => !F('crabbeGone') && !F('crabbeWatched') && !F('crabbeSkims'), title:'Mr Crabbe’s Arithmetic',
  text:() => `Out of idleness you have been reading the estate accounts, and have discovered that Mr Crabbe adds up beautifully, but in an unusual direction. Over three years some three hundred pounds have left the rent roll for a destination you cannot trace.

Crabbe, invited to explain, folds his hands. The books, he says, are a little like the Book of Revelation: “perfectly clear, sir, to those who have the key.”`,
  choices:[
    {t:'Dismiss him.', go:() => { fl('crabbeGone'); add({goodwill:3}); reg('crabbe',-5,'Dismissed over three hundred pounds');
      return `Crabbe goes, taking a writing desk you were fairly sure was yours, and sets up in Newbury as a land agent. Within the year he manages the estates of three of your neighbours, who speak of him very highly. Your new steward is a young Scot named Lark, so honest it is unsettling; he gives you a receipt for a receipt.`; }},
    {t:'Make him pay it back, by instalments, and keep him.', note:'+£150', go:() => { fl('crabbeWatched'); add({money:150}); reg('crabbe',-2,'Made to refund three hundred pounds');
      return `He repays half at once, from a purse that was evidently standing ready, and promises the rest. He bears no malice. That is the unnerving part: he treats the whole affair as a move in a game, well played on your side, and adjusts his opinion of you upward, as of a dog that has learnt to open a gate.`; }},
    {t:'Let it pass. He knows where everything is.', go:() => { fl('crabbeSkims'); reg('crabbe',2,'You overlooked the three hundred pounds');
      return `You close the ledger. Crabbe bows. From this day a line appears in each quarter’s accounts, in his beautiful hand, reading “Sundries”. It is never a large sum. It is never absent.`; }}
  ]});

ev({ id:'thorneLease', from:1795, to:1800, weight:4, title:'The Widow of Long Barrow',
  text:() => { meet('thorne'); return `Samuel Thorne has died of a chill, caught standing in his own water meadow arguing with a heron. His widow Abigail wishes to keep on the lease of Long Barrow: two hundred and forty acres, the best farm on the estate.

${F('crabbeGone') ? 'Lark' : 'Crabbe'} advises against. “A woman cannot farm, sir,” he says; and then, recollecting who has farmed Long Barrow these ten years while Samuel argued with herons, “not in the eyes of the county.” ${F('crabbeGone') ? 'A man from Hungerford' : 'Crabbe has a nephew who'} would take it, and pay a hundred pounds down for the favour.`; },
  choices:[
    {t:'Renew the lease to Abigail Thorne.', go:() => { add({standing:-1, goodwill:3}); reg('thorne',4,'You gave her the lease when the county said a woman could not farm'); if (!F('crabbeGone')) reg('crabbe',-1);
      return `She signs with a firm round hand and reads every clause first, including the ones in Latin, which she has Mr Oakes construe. Within two years Long Barrow is yielding four bushels an acre more than any farm on the estate. The county concedes that a woman can farm, in the tone it uses for a dog walking on its hind legs.`; }},
    {t:() => F('crabbeGone') ? 'Let it to the Hungerford man.' : 'Let it to Crabbe’s nephew.', note:'+£100', go:() => { fl('nephewFarm'); S.rentAdj *= 0.96; add({money:100, goodwill:-5}); reg('thorne',-5,'You turned her out of Long Barrow'); if (!F('crabbeGone')) reg('crabbe',2,'You gave Long Barrow to his nephew');
      return `Abigail Thorne leaves Long Barrow on Lady Day with one wagon, and takes rooms over the saddler’s in Wyvern. The new man is at market four days in the week and can be heard there, explaining the land. The land, meanwhile, grows docks. A farm can be ruined in less time than it takes to read the lease.`; }},
    {t:'Renew to her, at twenty pounds a year more.', go:() => { S.rentAdj *= 1.01; add({goodwill:-1}); reg('thorne',1,'You gave her the lease, and raised the rent on a widow');
      return `She looks at the figure, then at you, for exactly as long as it takes to be understood, and signs. She will pay it to the day, every Lady Day and Michaelmas, in gold, counted out on your table one coin at a time.`; }}
  ]});

ev({ id:'poacher', from:1796, to:1812, weight:3, title:'A Hare in Evidence',
  text:() => `Jem Pryor stands before you in the justice room, with a dead hare on the table between you like an exhibit in a murder. Mudge, your keeper, took him at dawn in Cuckoo Copse with two wires, the hare, and also, which Mudge mentions three times, “a look”.

Jem is thirty${S.year > 1800 ? '-odd' : ''}, has five children, and has been taking the game of Hatherley since he was nine, with an artistry your uncle used privately to admire. The law says that a man without land worth a hundred a year may not kill a hare, even one that walks in at his door. ${F('enclosed') ? 'Since the enclosure, Jem has not got so much as a cow.' : 'Jem has a cow, on the common, and nothing else.'}`,
  choices:[
    {t:'Three months in Reading gaol.', go:() => { add({standing:1, goodwill:-5}); reg('pryor',-3,'You gave him three months for a hare'); if (!F('gallDead')) reg('gall',1); S.game += 1;
      return `Three months. Sukey Pryor and the five children go on the parish, at a cost to the rates of four shillings a week, so that the hare, by the time Jem comes out, has cost Hatherley about two pounds twelve. He walks home from Reading in March. He touches his hat to you in the lane, quite correctly, and you feel it between the shoulder blades all the way to the gate.`; }},
    {t:'Fine him five pounds, and lend him the five pounds.', note:'£5', go:() => { add({money:-5, goodwill:2}); reg('pryor',1,'You fined him five pounds and paid it yourself');
      return `The law is satisfied; so, after a moment’s calculation, is Jem. He undertakes to repay you at a shilling a month, which will take until 1804. He is punctual. The shillings come to the kitchen door wrapped in a dock leaf, and Mrs Bunce maintains they smell of rabbit.`; }},
    {t:'Dismiss the charge, and give him the hare.', go:() => { add({standing:-2, goodwill:4}); reg('pryor',3,'You let him go, and gave him the hare'); if (!F('gallDead')) reg('gall',-2,'Thinks you soft on poachers'); S.game -= 1;
      return `You find the evidence insufficient, a look not being an offence known to English law. Mudge goes purple. Jem picks the hare up by the ears, considers it, and says, “I’d hang her four days, sir, no more, this weather.” It is the only thanks you get, and it is excellent advice.`; }}
  ]});

ev({ id:'pryorFriend', from:1798, to:1814, weight:3, cond:() => S.chars.pryor.r >= 2, title:'Something at the Back Door',
  text:() => `Every Friday this winter a brace of pheasants has appeared at the kitchen door, plucked, drawn, and wrapped in a cabbage leaf. They are, presumably, your own pheasants. Mrs Bunce roasts them without comment.

This Friday there is something else in the cabbage leaf: a scrap of paper, in a hand that has fought for every letter. “Sir. Ther is men from Kintbury say they will fire Pococks mill & yr grate barn nex it. Saterday nite. Burn this. A Frend.”`,
  choices:[
    {t:'Sit up in the barn on Saturday with Mudge.', go:() => { add({standing:2, goodwill:3}); reg('pryor',1,'You acted on his warning and named nobody');
      return `Towards one o’clock, four men come along the mill leat with a dark lantern and a tar barrel. You stand up out of the straw and bid them good evening. Nobody runs; it would be undignified. One of them says it is a mild night for the season. You agree. They carry the barrel away again, and you never ask their names, and there are no fires in Hatherley that year.`; }},
    {t:'Lay the letter before the bench and have troops sent.', go:() => { add({standing:3, goodwill:-6}); reg('pryor',-3,'You showed his letter to the magistrates');
      return `A troop of yeomanry lies up behind the mill and takes four men of Kintbury with a tar barrel. Two are transported for seven years. The bench wishes very much to know who “A Frend” may be, and everyone in Hatherley can make a guess. Jem Pryor’s windows are broken twice that winter. There are no more pheasants at the back door.`; }},
    {t:'Burn it and do nothing.', go:() => { add({money:-280, goodwill:-1});
      return `You burn it, as instructed, and tell yourself it is alehouse talk. On Saturday night Pocock’s mill goes up like a firework, and the great barn with it: forty quarters of wheat and your uncle’s travelling chariot, which had not moved since 1774. The pheasants continue to come on Fridays, but there is a reproach in the way they are trussed.`; }}
  ]});

ev({ id:'rickFire', follow:true, title:'Fire in the Stackyard',
  text:() => `You are woken after midnight by a light of the wrong colour for the moon. Two wheat ricks in the home stackyard are burning, quickly and cheerfully, as dry wheat will.

Half the village has turned out to watch. Some of them have brought buckets. Not many are using them.`,
  choices:[
    {t:'Post a reward of fifty guineas for the incendiary.', note:'£52', go:() => { add({money:-300 - 52, goodwill:-4, standing:1});
      return `The bill is posted on the church door and at the Bell. Nobody claims the money. Fifty guineas is more than a Hatherley man will see in three years, and still nobody claims it, and you find that this tells you more about your standing in the parish than the fire did. The wheat was worth three hundred.`; }},
    {t:'Take a bucket and join the line.', go:() => { if (T('captain') && !F('crewGone')) { add({money:-110, goodwill:4, standing:2});
      return `You have no need to take a bucket. Tarbuck has the Dryads out of their hammocks and rigged as a fire party before you are down the stairs: a double chain from the horse pond, wet sailcloth over the next rick, and the gunner on the barn roof with an axe, as for a fire in the forehold. One rick is lost. The other is saved, steaming. The village, which had come to watch a fire, stays to watch a drill, and is frankly impressed.`; }
      add({money:-300, goodwill:3});
      return `You carry water from the horse pond until dawn, in your shirt, between the wheelwright and a boy of ten. The ricks are lost all the same; three hundred pounds of wheat gone up in an hour. But towards the end there are more buckets in the line than there were at the beginning, and when it is over, somebody hands you a mug of beer without calling you sir.`; }},
    {t:'Go back to bed. Let it be seen that you do not frighten.', go:() => { add({money:-300, standing:1, goodwill:-2});
      return `You look at it from the window for a minute, and then draw the curtain. It is thought very cool. It is also three hundred pounds, and Mudge finds a tinderbox by the stackyard gate next morning, laid on the post where it could not be missed, like a card left by a caller.`; }}
  ]});

ev({ id:'hartoppShearing', from:1797, to:1810, weight:2, title:'Three Days of Tups and Toasts',
  text:() => `Mr Hartopp is holding a sheep-shearing after the manner of Mr Coke at Holkham: three days of rams, turnips and speeches, attended by two hundred farmers, a Russian count who is making a study of the English plough, and Mr Arthur Young, who writes everything down.

Hartopp has put a smock on over his coat for the occasion, and delivers an address on the subject of dung that brings tears to his own eyes.`,
  choices:[
    {t:'Go, listen, and take notes.', go:() => { fl('hartoppFriend'); add({standing:2}); reg('hartopp',2,'You sat through his address on dung');
      return `You come home knowing more about the Swedish turnip than you had supposed there was to know. Hartopp presses on you a drill plough “on trial”, six pamphlets, and a promise to send his own man over whenever you mean to improve. He is as good as his word; your works will come cheaper for it.`; }},
    {t:'Go, and bid for his prize New Leicester tup.', note:'£120', go:() => { fl('hartoppFriend'); S.improve += 1; add({money:-120, standing:3}); reg('hartopp',3,'You paid a hundred and twenty for his tup');
      return `The tup is called Bonaparte, on account of his temper and his ambitions. He costs a hundred and twenty pounds and travels home in a cart with a rug over him. By the second spring your lambs are squarer, heavier, and stupider, which Hartopp says is exactly what one wants in a sheep.`; }},
    {t:'Plead a previous engagement.', go:() => { reg('hartopp',-2,'You missed his sheep-shearing');
      return `You stay away. Mr Young’s account in the Annals of Agriculture lists the gentlemen present and remarks that “some neighbouring proprietors, it is to be regretted, yet slumber.” Hartopp has underlined it, and sent you the number.`; }}
  ]});

ev({ id:'vaneBall', from:1796, to:1799, weight:4, cond:() => K() === 'free', title:'The Militia Come to Wyvern',
  text:() => { meet('vane'); return `The Northamptonshire Militia are quartered on Wyvern for the summer, and the town has caught them like a rash. At the Assembly Rooms on Thursday a Captain Lucius Vane danced with Kitty three times, which is once more than is proper and twice more than is safe.

He has remarkable legs, a regimental coat that fits him like a rumour, and, according to the landlord of the George, a bill there of forty-one pounds.`; },
  choices:[
    {t:'Forbid her to see him.', go:() => { fl('vaneForbidden'); add({family:-4}); reg('kitty',-2,'You forbade her the Captain'); reg('vane',-2); later('elope', 2);
      return `You forbid it. Kitty hears you out with her eyes on the carpet and says, “Yes, Papa,” so meekly that you ought to have been warned. In every novel she has ever borrowed, the father forbids it in chapter four.`; }},
    {t:'Ask him to dinner, and have a look at him.', go:() => { reg('kitty',1); later('vaneDines', 1);
      return `A card goes down to the George. The Captain accepts within the hour, in a hand full of flourishes, on paper that smells of bergamot. Mrs Bunce is told eight to dinner. Kitty changes her mind about her sash four times.`; }},
    {t:'Let it run. She is eighteen and it is summer.', go:() => { add({family:2}); reg('kitty',2); later('elope', 2);
      return `You let it run. There are picnics on the Down and a great deal of sketching, in the course of which very little is sketched. Henrietta asks whether you have enquired into the young man’s expectations. You say that you are sure they are considerable. You are right; that is exactly what they are.`; }}
  ]});

ev({ id:'vaneDines', follow:true, cond:() => K() === 'free', title:'Captain Vane Over the Port',
  text:() => `Captain Vane dines, and is charming to Henrietta, attentive to Kitty, and deferential to you in a way that puts you in mind of Crabbe.

Afterwards, when the ladies have gone up, he moves the decanter an inch and mentions that he finds himself momentarily embarrassed. Might you see your way to advancing two hundred pounds against his expectations? These are from an aunt at Kettering: “very old, sir, very fond of me, and very nearly dead.”`,
  choices:[
    {t:'Lend him the two hundred.', note:'£200', go:() => { add({money:-200}); reg('vane',2,'You lent him two hundred pounds'); later('elope', 2);
      return `He writes you a note of hand with a beautiful flourish under the name. You have since learned that there are, by conservative estimate, nine such notes in circulation in Wyvern alone, and that the aunt at Kettering has been very nearly dead since 1789.`; }},
    {t:'Ring for his horse.', go:() => { fl('vaneDone'); reg('vane',-4,'You showed him the door over the port'); reg('kitty',-1); if (chance(0.6)) later('duel', 2);
      return `You ring. He takes it well, in the sense that he finishes his glass first. At the door he remarks that he had understood himself to be dining with a gentleman. Kitty does not speak to you for a week, and then only about the weather.`; }},
    {t:'Refuse him civilly, and tell Kitty in the morning what he asked.', go:() => { fl('vaneDone'); add({family:3}); reg('kitty',1,'You told her the truth about the Captain, and let her judge');
      return `You tell her at breakfast, plainly, as you would tell a man. She goes white, then red, and says nothing. That evening she is seen to burn something in her bedroom grate, and the next week, when the Captain bows to her in Wyvern High Street, she looks at him as one looks at a shop that has changed hands.`; }}
  ]});

ev({ id:'elope', follow:true, cond:() => K() === 'free' && !F('vaneDone'), title:'A Ladder at the Window',
  text:() => `Henrietta wakes you at four. Kitty’s bed has not been slept in, her best bonnet is gone, and there is a ladder against the east wall that Mudge says belongs to the vicarage.

Captain Vane’s curricle was seen at midnight on the Oxford road, going north at a great pace. In Scotland a girl may be married without her father’s leave, over an anvil, by a blacksmith; and it is three hundred and twenty miles to Gretna Green.`,
  choices:[
    {t:'Order the chaise and go after them.', note:'£45', go:() => { fl('vaneDone'); add({money:-45, standing:-3, family:-2}); reg('kitty',-2,'You fetched her back from the Gretna road'); reg('vane',-3); if (chance(0.5)) later('duel', 1);
      return `You come up with them at Towcester, at the Saracen’s Head, at nine in the morning. There has been no need to hurry. The Captain sat down to hazard with a horse dealer at the first change and has lost the whole of the journey money, the curricle, and Kitty’s pearl ear-rings. Kitty is in the coffee room in her bonnet, with her hands in her lap, having had six hours to think. She gets into your chaise without a word, and cries from Brackley to Bicester.`; }},
    {t:'Let them go. She has chosen.', go:() => { fl('kitty','vane'); fl('vaneDone'); add({family:-10, standing:-6}); reg('kitty',1); reg('henrietta',-3,'You let Kitty go to Gretna'); later('vaneDowry', 3);
      return `They are married at Gretna Green by a man named Paisley, who weighs twenty stone and takes his fee in brandy. Kitty writes from Carlisle: four pages, very happy, crossed, with a postscript asking whether her blue pelisse might be sent on. Henrietta reads it and goes upstairs. The county reads it too, in a manner of speaking, and for a year the Tamworths cannot meet you without their sympathy showing.`; }},
    {t:'Send Mudge after them with fifty guineas for the Captain.', note:'£52', go:() => { fl('vaneDone'); add({money:-52, standing:-2}); reg('kitty',-3,'You bought the Captain off for fifty guineas, and he took it');
      return `Mudge overtakes them at Brackley and puts the proposition through the curricle window: fifty guineas, on the nail, to drive on alone. The Captain takes about as long to consider as it takes to count the money. Kitty comes home on the pillion behind Mudge. She has learned her own market price, and that it was paid, and she does not forgive either of you the information.`; }}
  ]});

ev({ id:'vaneDowry', follow:true, cond:() => K() === 'vane', title:'A Letter from Mrs Vane',
  text:() => `Kitty writes from lodgings in Northampton. The regiment is to move; the Captain has “had a reverse”; there is, she mentions in the last line, to be a child.

Enclosed is a second sheet, in the Captain’s flourishing hand, observing that no settlement was made upon his wife at marriage, an omission he is sure you will wish to repair. He names eight hundred pounds.`,
  choices:[
    {t:'Send the eight hundred.', note:'£800', go:() => { add({money:-800, family:3}); reg('kitty',2); reg('vane',2,'You paid eight hundred pounds on demand'); reg('henrietta',1);
      return `It lasts him until the Doncaster races. Kitty’s letters grow shorter and more cheerful, which is the worst sign there is.`; }},
    {t:'Settle forty pounds a year on Kitty alone, through trustees.', note:'£300', go:() => { fl('kittySettled'); add({money:-300, family:5}); reg('kitty',3,'You settled money on her where the Captain could not reach it'); reg('vane',-3); reg('henrietta',2);
      return `The lawyers tie it up so that the Captain cannot touch a penny, anticipate it, or borrow against it. He writes you a very wounded letter. Kitty writes none for a month, and then sends a lock of the baby’s hair in a twist of paper, with nothing else, which Henrietta carries about in her work-bag for the rest of her life.`; }},
    {t:'Reply that she made her bed.', go:() => { add({family:-8}); reg('kitty',-4,'You sent nothing when she asked'); reg('henrietta',-2);
      return `You write four lines. Henrietta, you afterwards discover, has sent twenty pounds of her own and her mother’s garnets, by the carrier, sewn into a cushion.`; }}
  ]});

ev({ id:'duel', follow:true, cond:() => S.chars.vane.met, title:'Pistols on Hatherley Down',
  text:() => `Captain Vane has sent a friend to wait upon you: a lieutenant with a lisp and a very clean pair of gloves, who regrets to say that the Captain conceives himself insulted and requires satisfaction.

Duelling is against the law, which is to say that it takes place at dawn instead of noon. The lieutenant suggests the old chalk pit on Hatherley Down, on Thursday, at twelve paces.`,
  choices:[
    {t:'Accept.', go:() => { const r = T('soldier') ? 0.1 + Math.random() * 0.4 : Math.random();
      if (r < 0.1) { S.dead = 'duel'; return `A grey morning, with larks. The handkerchief falls. You have just time to think that the Captain is a better shot than his debts would suggest.`; }
      if (r < 0.45) { add({standing:6, family:-3}); reg('vane',-2); reg('henrietta',-1,'You fought a duel and told her afterwards');
        return `You fire, and to the astonishment of everyone, yourself first among them, you hit him: in the right calf, the better of the two. He is carried to the George, where he lies up for a month on credit. You are the hero of the county for a season. Men who have never met you describe your coolness. In truth your hand shook so that you were aiming at the chalk pit generally.`; }
      add({standing:3, family:-2});
      return `Both pistols go off. A lark stops singing. Nobody is hit, the Captain’s ball having gone into the chalk and yours, the seconds think, into Oxfordshire. Honour is declared satisfied, everyone shakes hands with enormous relief, and the Captain breakfasts at your expense at the Bell, on chops.`; }},
    {t:'Decline. You have a family, and no quarrel worth a funeral.', go:() => { add({standing:-6, family:4}); reg('henrietta',2,'You refused a duel and let the county think what it liked');
      return `You decline in writing. For a month the officers of the Northamptonshire Militia turn their shoulders to you in Wyvern, and somebody chalks a white feather on your gate. Then the regiment marches for Ipswich, leaving bills at every shop in the High Street, and the town discovers that it thinks you a man of sense after all.`; }},
    {t:'Have the pair of them bound over to keep the peace.', go:() => { add({standing:-3}); reg('vane',-2); if (!F('gallDead')) reg('gall',1);
      return `As a magistrate you take the lieutenant’s message for what it legally is, an incitement to a breach of the peace, and have ${F('gallDead') ? 'a brother justice' : 'Dr Gall'} bind both officers over in fifty pounds. It is unanswerable, and thought rather shabby. The lieutenant, in particular, had been looking forward to it.`; }}
  ]});

ev({ id:'pinchSuit', from:1798, to:1804, weight:3, cond:() => K() === 'free', title:'Mr Pinch of Bristol',
  text:() => { meet('pinch'); return `Mr Lumley Pinch has come to stay. He is fifty-two, has made sixty thousand pounds in sugar, and has the build and colouring of a boiled ham that has just been told good news.

He is come into Berkshire to buy an estate and a wife, and lets it be understood that he will settle three thousand pounds on the father of any young lady who will have him. He has been looking at Kitty in exactly the way he looks at your rent roll.`; },
  choices:[
    {t:'Accept him, on Kitty’s behalf.', note:'+£3,000', go:() => { fl('kitty','pinch'); add({money:3000, family:-12, standing:2}); reg('kitty',-5,'You married her to Mr Pinch for three thousand pounds'); reg('pinch',3); reg('henrietta',-1); later('pinchDies', 20 + Math.floor(Math.random() * 12));
      return `The settlements are signed in the library. Kitty is married at Hatherley in a veil of Brussels lace that Pinch has had valued, and tells people the figure. She goes through the service like a person repeating a lesson in a language she does not know. They leave for Clifton in a new chariot, with his arms on the door, granted last March.`; }},
    {t:'Tell him the answer must be Kitty’s.', go:() => { reg('kitty',2,'You left Mr Pinch’s proposal to her'); reg('pinch',-2); add({family:3});
      return `Pinch proposes in the conservatory, on one knee, which he then cannot get up from; the under-gardener has to be sent for. Kitty refuses him with great kindness and comes out looking as if she had been asked to buy something. Pinch bears it like a man of business. There are, he says, other properties on his list.`; }},
    {t:'Tell him your daughter is not on the market.', go:() => { add({family:2}); reg('kitty',3,'You sent Mr Pinch packing'); reg('pinch',-4,'You told him Kitty was not for sale'); reg('henrietta',-1);
      return `He goes very red, which with his complexion is a matter of degree, and leaves before luncheon. Henrietta observes that three thousand pounds does not call every day. Kitty kisses the top of your head on her way through the hall, which she has not done since she was nine.`; }}
  ]});

ev({ id:'pinchDies', follow:true, cond:() => K() === 'pinch', title:'A Death at Clifton',
  text:() => `Mr Pinch is dead, at Clifton, of an apoplexy, in the middle of a turtle dinner given by the Society of Merchant Venturers. He was carried out between the second course and the speeches.

He has left Kitty everything: the house on the Downs, the sixty thousand, and the Jamaica estate with ${S.year >= 1807 ? 'its three hundred souls' : 'three hundred souls upon it'}. She has written to ask what she ought to do. It is the first time she has asked your opinion of anything since her wedding day.`,
  choices:[
    {t:'Advise her to sell Jamaica and come home.', go:() => { fl('kittyWidow'); add({family:10}); reg('kitty',3,'You told her to sell the plantation and come home');
      return `She sells the estate, at a loss, to a man who will work it exactly as before, which she knows and which troubles her. Then she comes home to Hatherley in black, very rich, thirty years old in the face, and takes the Dower House. She and Henrietta quarrel about curtains within the week, and you understand that she is going to be all right.`; }},
    {t:'Advise her to free the people on it, if the law can be made to let her.', go:() => { fl('kittyWidow'); fl('kittyManumit'); add({family:8, standing:-2}); reg('kitty',4,'You told her to free the people on the Jamaica estate');
      return `It takes her four years, two attorneys and a quarrel with every relation Pinch possessed, and it cannot be done cleanly; the colony’s laws are built to prevent it. But she does it. Bristol thinks her mad. She comes home to the Dower House a good deal poorer than she might have been, and you notice that she has stopped looking at the carpet when she speaks.`; }},
    {t:'Advise her that she is rich, and to enjoy it.', go:() => { fl('kittyWidow'); add({family:2, standing:2, money:500}); reg('kitty',-1);
      return `She takes the advice, or part of it. She sends you five hundred pounds “towards the roof”, takes a house in Bath, and is to be seen in the Pump Room in half-mourning with a very small dog. She keeps the Jamaica property. She does not speak of it, and neither do you, and the money arrives every quarter all the same.`; }}
  ]});

ev({ id:'oakes', from:1799, to:1806, weight:3, cond:() => K() === 'free', title:'The Curate Turns His Hat',
  text:() => { meet('oakes'); return `Mr Oakes, the curate, does all of ${F('gallDead') ? 'the parish’s' : 'Dr Gall’s'} work for forty pounds a year${F('gallDead') ? '' : ', while Dr Gall takes the other four hundred and the credit'}. He is thin, shy, and so good that it gets on people’s nerves.

He has asked to see you in the library, and has stood there some minutes turning his hat round and round, as if winding himself up. He would like, he says at last, to marry Kitty. He has nothing. Kitty, sent for, goes the colour of a radish and says that she has always liked him better than anybody, which is the first you have heard of it.`; },
  choices:[
    {t:'Consent, and promise him the living when it falls vacant.', go:() => { fl('kitty','oakes'); fl('livingPromised'); add({family:8, standing:-2, goodwill:3}); reg('kitty',4,'You let her marry the curate'); reg('oakes',4,'You gave him Kitty, and the promise of the living'); reg('henrietta',-1); if (!F('gallDead')) reg('gall',-2,'Knows you have promised away his living');
      return `They are married in October by ${F('gallDead') ? 'the rural dean' : 'Dr Gall himself, who reads the service as if conducting a sale of his own furniture'}. The village turns out to the last child. They go to live in four rooms over the old schoolhouse, where Kitty, who never did a hand’s turn at the Hall, is found a week later on her knees, blackleading a grate and singing.`; }},
    {t:'Consent, with a thousand pounds to start them.', note:'£1,000', go:() => { fl('kitty','oakes'); add({money:-1000, family:10, goodwill:3}); reg('kitty',5,'You let her marry the curate, and portioned her'); reg('oakes',3,'You gave him Kitty and a thousand pounds'); reg('henrietta',1);
      return `A thousand pounds in the Funds is fifty a year, which more than doubles the curate’s income and allows Henrietta to describe the match in Wyvern as “perfectly prudent”. They are married in October. Oakes gets through the responses without stammering, a thing nobody has heard him do before.`; }},
    {t:'Refuse. Forty pounds a year will not keep her in gloves.', go:() => { add({family:-6}); reg('kitty',-4,'You refused her the curate'); reg('oakes',-2,'You refused him Kitty');
      return `Oakes bows, says he had expected nothing else, and goes away to read the burial service over a pauper. Kitty does not weep or rage. She takes up botany. For years afterwards she is to be seen on the Down in all weathers with a tin box, and nobody who watches her go by in the direction of the schoolhouse lane supposes she is looking only for orchids.`; }}
  ]});

ev({ id:'dubreuil', from:1804, to:1811, weight:2, title:'A Frenchman at the Milestone',
  text:() => { meet('dubreuil'); return `Lieutenant Achille Dubreuil of the Imperial Navy, taken in a frigate off Ushant, is one of forty French officers living on parole at Wyvern. He may walk one mile from the Market Cross along the turnpike and no further, a limit he keeps with an exactness that is almost an insult.

He plays chess beautifully, and loses, beautifully, on purpose. ${F('gallDead') ? 'The churchwardens think' : 'Dr Gall thinks'} him a spy. He writes to ask if he may call. The milestone at the foot of your drive, he has ascertained by pacing it, stands at one mile exactly.`; },
  choices:[
    {t:'Make him free of the house.', go:() => { fl('dubreuilFriend'); add({family:4, standing:-3}); reg('dubreuil',3,'You opened your house to an enemy officer'); reg('henrietta',1); if (!F('gallDead')) reg('gall',-1); if (K() === 'free' && kittyAge() < 34) later('dubreuilAsks', 5);
      return `He comes on Tuesdays and Saturdays, walking up from the milestone with his hat under his arm. He teaches Mrs Bunce an omelette, corrects everyone’s French, and carves from mutton bones a model of his ship, with every gun, which he gives to Henrietta. You discover that an enemy at your own fireside is a very difficult thing to keep hating.`; }},
    {t:'Receive him once, correctly, and no more.', go:() => { reg('dubreuil',1);
      return `He drinks one dish of tea, admires the Gainsborough of your uncle, and takes his leave at the fortieth minute by the clock. Nothing could be more correct. You find afterwards that you had wanted to ask him a hundred things, beginning with what they truly think of Bonaparte.`; }},
    {t:'Reply that the milestone is the limit, and so is your patience.', go:() => { add({standing:1}); reg('dubreuil',-2); if (!F('gallDead')) reg('gall',1);
      return `He does not write again. He walks out to the milestone each afternoon, touches it with his cane, and walks back, and when he passes your carriage he bows as if nothing in the world could please him more.`; }}
  ]});

ev({ id:'dubreuilAsks', follow:true, cond:() => K() === 'free' && F('dubreuilFriend'), title:'The Lieutenant Is Exchanged',
  text:() => `Lieutenant Dubreuil is to be exchanged for an English officer of the same rank, and sails from Portsmouth in a cartel within the month. He has come up from the milestone in his best coat.

He asks for Kitty. He has, he says, a small property near Saint-Malo, an old mother, and the half-pay of a lieutenant whose Emperor does not much love the navy. Kitty is ${kittyAge()}. She has been reading Racine with him for two years, and she is standing by the window looking at you, not at him.`,
  choices:[
    {t:'Give them your blessing.', go:() => { fl('kitty','dubreuil'); add({family:-3, standing:-7}); reg('kitty',5,'You let her marry a Frenchman in the middle of the war'); reg('dubreuil',4,'You gave him your daughter'); reg('henrietta',-2);
      return `They are married by licence at Wyvern, quietly, and cross in the cartel with the returning prisoners. Berkshire is scandalised to its foundations. For years her letters come by way of Holland, smuggled, three months old, smelling of tar: there is a garden, there are bees, there is, in time, a small Achille. Henrietta reads them to pieces.`; }},
    {t:'Tell him to come back and ask when there is a peace.', go:() => { fl('dubreuilWaits'); add({family:1}); reg('kitty',1); reg('dubreuil',1,'You told him to ask again in peacetime');
      return `He bows over your hand, and then over Kitty’s, a little longer. “Then I shall pray for peace, monsieur,” he says, “which for a sailor of the Emperor is a species of treason.” He leaves the mutton-bone frigate on the hall table. Kitty dusts it herself.`; }},
    {t:'Refuse. She is not marrying into the enemy.', go:() => { add({family:-5, standing:1}); reg('kitty',-3,'You refused her the Lieutenant'); reg('dubreuil',-3);
      return `He takes it like an officer. Kitty takes it like your daughter, which is to say she does not speak of it, ever, and continues to read Racine alone, aloud, in a room at the top of the house.`; }}
  ]});

ev({ id:'dubreuilReturns', from:1814, to:1815, weight:9, cond:() => F('dubreuilWaits') && K() === 'free', title:'A Caller at the Milestone',
  text:() => `A post-chaise has stopped at the foot of the drive, by the milestone, and a man has got down from it and is standing there with his hat off, as if waiting for leave to come further.

It is Dubreuil. He is greyer, he has a scar from eyebrow to ear that he got at Leipzig serving guns ashore, and he has travelled from Saint-Malo in nine days, having set out the morning the peace was proclaimed.`,
  choices:[
    {t:'Walk down the drive yourself and bring him in.', go:() => { fl('kitty','dubreuil'); add({family:10, standing:-1}); reg('kitty',5,'You kept your word about the Lieutenant'); reg('dubreuil',5,'You walked down the drive to fetch him');
      return `You bring him up the drive on your arm. Kitty is on the steps. She is ${kittyAge()}, and has on her old blue pelisse, and what passes between them is not for you to watch, so you find a sudden interest in the state of the gravel. They are married in the autumn. The county, which would have fainted six years ago, sends silver.`; }},
    {t:'Send word that Miss Kitty is not at home.', go:() => { add({family:-10}); reg('kitty',-5,'You turned the Lieutenant away after he had waited six years'); reg('dubreuil',-5);
      return `The chaise turns in the road. Kitty sees it from the top window, going away. She was at home. She will now always be at home.`; }}
  ]});

ev({ id:'gallDies', from:1806, to:1813, weight:3, cond:() => !F('gallDead'), title:'The Living of Hatherley',
  text:() => { meet('oakes'); return `Dr Gall is dead, in his seventy-ninth year, at his own table, during the second remove, of a goose. The funeral is largely attended. Several people come to make sure.

The living is worth four hundred a year and is yours to give. Lord Cullerne has mentioned his chaplain, a Mr Spragg. A clerical agent in Holborn offers fourteen hundred pounds for the next presentation, no questions asked. ${E() === 'church' ? 'Edmund is in orders, and Henrietta has had the vicarage measured for carpets. ' : ''}And there is Mr Oakes, who has done the whole work of the parish these many years on forty pounds${K() === 'oakes' ? ', and who is your son-in-law' : ''}.`; },
  choices:[
    {t:'Present Mr Oakes.', go:() => { fl('gallDead'); fl('oakesVicar'); add({goodwill:8, family: K() === 'oakes' ? 8 : 1}); reg('oakes',4,'You gave him the living'); if (K() === 'oakes') reg('kitty',3,'You kept your promise about the living'); reg('cullerne',-1); if (E() === 'church') reg('henrietta',-2,'You gave the living away from Edmund');
      return `Oakes is inducted on a wet Thursday and tolls the bell himself, as the form requires, to tell the parish it has a new incumbent. The parish had worked that out. His first act is to raise the new curate to eighty pounds. His second is to give the tithe pig back.`; }},
    {t:'Present Edmund.', if:() => E() === 'church', go:() => { fl('gallDead'); fl('edmundVicar'); add({family:5, goodwill:-2}); reg('henrietta',3,'You put Edmund in the vicarage'); reg('edmund',-1); reg('oakes',-3,'Passed over for the living after all his years'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Edmund reads himself in. He preaches for eleven minutes on the text “Here am I; send me”, with an irony that goes over the congregation’s head like a flight of duck. Mr Oakes remains curate, on forty pounds, and congratulates him with a sincerity that is harder to bear than a blow.`; }},
    {t:'Present Lord Cullerne’s Mr Spragg.', go:() => { fl('gallDead'); fl('spragg'); add({standing:3, goodwill:-4}); reg('cullerne',4,'You gave his chaplain the living'); reg('oakes',-3,'Passed over for Lord Cullerne’s chaplain'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-4,'You broke your promise about the living'); add({family:-8}); }
      return `Mr Spragg arrives with eleven trunks and a pianoforte. He hunts three days a week, and has the pulpit lowered, so that he may be seen as well as heard. Oakes goes on doing the work, on forty pounds, exactly as before. Very little changes in the cure of souls at Hatherley except the weight of the man who draws the tithe.`; }},
    {t:'Sell the presentation to the agent in Holborn.', note:'+£1,400', go:() => { fl('gallDead'); fl('soldLiving'); add({money:1400, standing:-5, goodwill:-5}); reg('oakes',-3,'You sold the living over his head'); if (K() === 'oakes' || F('livingPromised')) { reg('kitty',-5,'You sold the living you promised her husband'); add({family:-10}); }
      return `Fourteen hundred pounds. The purchaser proves to be a wine merchant of Mark Lane, buying for a son who is not yet ordained, and until he shall be the cure is served, at forty pounds, by Mr Oakes. The Bishop writes you a letter. It contains the word “simony”, twice, and is signed “your faithful brother in Christ”, which you take to be episcopal for something else.`; }}
  ]});

ev({ id:'vaccine', from:1800, to:1808, weight:2, title:'The Cow-Pox',
  text:() => `There is smallpox at Kintbury: four children dead, and the rest marked for life. A young surgeon of Newbury, Mr Ferris, has read Dr Jenner’s treatise and offers to inoculate Hatherley with matter from the cow-pox, which is mild, and which, he swears, makes a person proof against the other for ever.

There is resistance. A print going round the alehouses shows the vaccinated sprouting horns and udders. ${F('gallDead') ? 'The clerk has been heard to say' : 'Dr Gall has preached'} that it is impious to mix the beasts of the field with the image of God.`,
  choices:[
    {t:'Pay for the whole parish, and go first yourself, in public.', note:'£60', go:() => { fl('vaccinated'); add({money:-60, goodwill:7, standing:2, family:2}); if (!F('gallDead')) reg('gall',-2,'You were vaccinated on the green in the teeth of his sermon');
      return `You bare your arm on the green, on a kitchen chair, and Ferris scratches you with a lancet while the parish watches for horns. For a fortnight you are examined every time you take off your hat. No horns appear. Two hundred and sixty are done by Midsummer, and when the smallpox comes down the valley that autumn it goes round Hatherley as a stream goes round a stone.`; }},
    {t:'Pay for any who wish it, and say no more.', note:'£25', go:() => { add({money:-25, goodwill:3});
      return `Some ninety come, chiefly mothers, after dark, with shawls over their heads as if to a christening that must not be spoken of. It is not enough. The smallpox takes three in Hatherley that autumn. All three were from houses that had laughed at the print.`; }},
    {t:'Leave physic to Providence.', go:() => { add({goodwill:-5, family:-2}); if (!F('gallDead')) reg('gall',1);
      return `Providence sends the smallpox in October. Nine die in Hatherley, seven of them under ten years old, and the blacksmith’s youngest is left blind. Mr Ferris passes your gate daily on his way to the cottages, and takes off his hat to it with the utmost civility.`; }}
  ]});

ev({ id:'manTraps', from:1797, to:1812, weight:2, cond:() => !F('traps'), title:'Mudge Proposes Iron',
  text:() => `Mudge the keeper reports that pheasants are leaving Cuckoo Copse at a rate which argues either poachers or one very large and discriminating owl. He proposes man-traps and spring-guns: an iron jaw to take a man by the leg, and a gun on a wire that fires at whoever trips it. Both are entirely legal.

“There’s a board you put up,” says Mudge, “to say they’re set. Most of ’em can’t read it. But that’s not our fault, is it, sir?”`,
  choices:[
    {t:'Set them.', note:'£30', go:() => { fl('traps'); S.game += 2; add({money:-30, goodwill:-7, standing:1}); reg('cullerne',1); reg('pryor',-1); later('trapCatch', 2);
      return `Six traps and two guns, from an ironmonger in Reading whose bill is headed “Humane Man-Traps, Without Teeth, For The Nobility”. The board goes up. Children are forbidden the copse. For a month the pheasants are undisturbed, and so, you notice, are you; nobody comes up the back drive at all.`; }},
    {t:'Put up the board, and set nothing.', go:() => { fl('trapBluff'); add({goodwill:-2}); S.game += 1;
      return `The board says MAN TRAPS AND SPRING GUNS ARE SET IN THESE WOODS. It is a lie, and for two seasons it does very well. Then one morning Mudge finds a line added beneath, in chalk, in a careful hand: “No they ent.”`; }},
    {t:'Refuse. You will not maim a man for a bird.', go:() => { add({goodwill:2}); reg('pryor',1); S.game -= 1;
      return `Mudge receives this as an old soldier receives news of a peace: correctly, and with private disgust. The pheasants continue to go. You find that you can eat a chicken with a perfectly easy mind.`; }}
  ]});

ev({ id:'trapCatch', follow:true, cond:() => F('traps'), title:'What the Spring-Gun Caught',
  text:() => F('gallDead') ? `The spring-gun in Cuckoo Copse went off at first light. Mudge ran to it hoping for Jem Pryor, and found a boy of eleven, Tom Gurney, who had gone in after a hazel for a fishing rod, with nine shot in his legs.

He will walk, Ferris says, though not as he did. His mother has not come up to the Hall. Nobody has come up to the Hall.` : `The spring-gun in Cuckoo Copse went off at first light. Mudge ran to it hoping for Jem Pryor, and found instead Dr Gall, in a nightcap, with a basket of morels and twelve shot in his left buttock.

He had, he explains from his bed, face downward, been gathering mushrooms, as he has every May for thirty years, upon what he always understood to be the glebe. It is not the glebe. It has never been the glebe.`,
  choices:[
    {t:'Take up every trap and gun, today.', go:() => { fl('traps', false); S.game -= 2; add({goodwill:5}); if (!F('gallDead')) reg('gall',1); else add({money:-20});
      return F('gallDead') ? `The iron goes into the pond. You pay Ferris’s bill and send the boy a rod, a proper one, from London, with a brass reel. It is not accepted for a month. Then one evening you see him on the bridge with it, sitting, since he cannot stand long, and he lifts a hand an inch off the rail as you go by.` : `The iron goes into the pond, where the carp regard it with suspicion. Dr Gall preaches from a cushion for six Sundays, on forgiveness, standing.`; }},
    {t:() => F('gallDead') ? 'Leave them. The board was plain enough.' : 'Leave them set, and send the Doctor a ham.', go:() => { add({goodwill:-6, money:-3}); if (!F('gallDead')) reg('gall',-3,'You left the spring-guns set after one shot him'); else reg('pryor',-2);
      return F('gallDead') ? `The board was plain. Tom Gurney cannot read. You have the law wholly on your side, and you are welcome to it.` : `The ham comes back. With it comes a note stating that Dr Gall will in future gather his mushrooms where he pleases, and that he has loaded his own fowling piece. Mudge, for the first time in his life, looks thoughtful.`; }},
    {t:'Prosecute Dr Gall for trespass in pursuit of fungus.', if:() => !F('gallDead'), go:() => { add({goodwill:6, standing:-3}); reg('gall',-5,'You had him fined a shilling for trespass, with shot still in him'); reg('pryor',2);
      return `The case of ${S.sur} v. Gall is heard at Wyvern before a bench that cannot keep its face straight. He is fined a shilling. The Bell is drunk dry that night. No magistrate has ever been so popular in Hatherley, and no squire so cordially hated at his own vicarage; the Doctor will carry both the shot and the shilling to his grave.`; }}
  ]});

ev({ id:'enclosure', from:1797, to:1809, weight:3, cond:() => !F('enclosed') && !S.projectsDone.enclosure && !F('encloseRefused'), title:'The Common Question',
  text:() => `Lord Cullerne and ${F('gallDead') ? 'his man of business' : 'Dr Gall'} have called on you together, which is like being visited by both blades of a pair of scissors.

Hatherley Common is four hundred acres of gorse, geese and independence. It is, his lordship says, wasted on cottagers who keep a cow and a pig there, cut their furze, and suppose themselves free. Enclosed, hedged and let, it would add a third to your rental. ${F('gallDead') ? 'The tithe' : 'Dr Gall’s tithe'} would be commuted for land, and no more counting of piglets. It wants a private Act of Parliament, a surveyor, three commissioners, and about twelve hundred pounds.

Jem Pryor’s cow is grazing outside the window as they speak, as if she had been sent.`,
  choices:[
    {t:'Promote the bill.', note:'£1,200 over three seasons', go:() => { startProject('enclosure'); reg('cullerne',2,'You joined him in enclosing the common'); if (!F('gallDead')) reg('gall',2); reg('pryor',-2,'You moved to enclose the common');
      return `The notice is fixed to the church door on three successive Sundays, as the law requires, where those whom it most concerns cannot read it. A surveyor comes with a chain and a boy. He walks the common for a week, putting in pegs, and everywhere he goes the geese follow him in a body, hissing.`; }},
    {t:'Promote it, but set aside sixty acres in allotments for the cottagers.', note:'£1,400 over three seasons', go:() => { fl('allotments'); startProject('enclosure'); reg('cullerne',1); meet('thorne'); reg('thorne',1); reg('pryor',-1,'You enclosed the common, but left him an acre');
      return `Lord Cullerne thinks the allotments “a premium upon idleness”. You hold to them. An acre and a cow-gate to every cottage that can show it used the common: it is not what they had, which was the whole sky, but it is more than any other enclosure in the county has left them, and the surveyor pegs it out with the geese at his heels.`; }},
    {t:'Refuse. The common stays as it is.', go:() => { fl('encloseRefused'); add({goodwill:6, standing:-2}); reg('cullerne',-3,'You would not enclose with him'); if (!F('gallDead')) reg('gall',-2); reg('pryor',2,'You kept the common open');
      return `His lordship says you are standing in the way of improvement. You say that you are standing in the way of Jem Pryor’s cow, and mean to go on doing so. They leave together. The cow lifts her head to watch the carriage go, chewing, like a constituent.`; }}
  ]});

ev({ id:'commonRiot', follow:true, cond:() => F('enclosed'), title:'Posts in the Night',
  text:() => `The fencers came on Monday to stake out the new allotments on what was Hatherley Common. On Tuesday morning every post they had set was found pulled up and laid out on the turf, very neatly, in the shape of a gallows.

Today some sixty persons, men and women, are sitting on the line of the new hedge. They are not shouting. They have brought their dinners.`,
  choices:[
    {t:'Send for the yeomanry.', go:() => { add({goodwill:-9, standing:2}); reg('pryor',-2,'You brought sabres on to the common'); reg('cullerne',1);
      return `Lord Cullerne’s troop arrives at a trot, very fine, and rides the line of the hedge. Nobody is cut. An old woman is knocked into a furze bush and a boy has his arm broken by a horse. The posts go in that week and stay in. For some years after, your quickset hedges on that side of the parish fail to thrive, as though something got at the roots.`; }},
    {t:'Go down and sit on the turf with them.', go:() => { add({goodwill:5, standing:-3}); reg('pryor',1,'You sat down on the common and heard them out');
      return `You sit. Somebody passes you bread and an onion. For three hours you are told what the common was: where each family cut its turf, whose grandmother’s geese had the pond, which thorn the children were sent to. None of it is in the Act. At the end you can undo nothing, and you tell them so, and promise the furze-cutting and the pond shall stay open. It is a small thing. They get up, slowly, and let the fencers through.`; }},
    {t:'Wait them out. They cannot sit there for ever.', go:() => { add({goodwill:-3});
      return `They sit for nine days, in shifts. On the tenth it rains, and the hay wants cutting, and hunger, which built the fence in the first place, takes it up and finishes it. The fencers go back to work. Nobody has been hurt and nobody has been heard.`; }}
  ]});

ev({ id:'bath', from:1796, to:1814, weight:2, repeatGap:16, title:'Henrietta’s Rheumatism',
  text:() => `Henrietta’s rheumatism has come on again, as it reliably does when the Tamworths go to Bath. Ferris the surgeon, who knows his business, prescribes the waters, six weeks of them, taken warm, with society.

Lodgings in Pulteney Street are four guineas a week this season. The waters, Ferris adds, taste as if a blacksmith had cooled his irons in them, and that is thought to be the virtue.`,
  choices:[
    {t:'Six weeks at Bath.', note:'£350', go:() => { add({money:-350, family:8, standing:2}); reg('henrietta',2);
      return `She drinks three glasses a day in the Pump Room, to music, and is carried to the Assembly in a chair. The rheumatism is gone by the second Tuesday. You lose eleven pounds at whist to a clergyman, and gain the impression that the whole of Bath is one large drawing room in which the same hundred people are pretending not to have met.`; }},
    {t:'A fortnight at Cheltenham, which is cheaper.', note:'£150', go:() => { add({money:-150, family:3});
      return `Cheltenham is where the King took the waters in 1788, shortly before he went mad, a connexion on which the town does not dwell. The water is salt and works upon the system with a violence you would rather not describe. Henrietta declares herself much better and does not ask to go again.`; }},
    {t:'A mustard plaster, at home.', go:() => { add({family:-5}); reg('henrietta',-2,'You prescribed mustard when she wanted Bath');
      return `The plaster is applied. Henrietta bears it with fortitude, loudly, for six weeks, during which the Tamworths’ letters from Bath are read out at breakfast in full.`; }}
  ]});

ev({ id:'chinese', from:1802, to:1812, weight:1, title:'The Chinese Taste',
  text:() => `Henrietta has seen an account of the Prince of Wales’s Pavilion at Brighton, which is being fitted up inside in the Chinese manner: bamboo, dragons, lanterns, and wallpaper on which mandarins fish from bridges.

She now finds that she cannot sit in the yellow drawing room another week. A man in Bond Street will do the whole for four hundred pounds, with a pagoda for the chimney-piece.`,
  choices:[
    {t:'Let her have her dragons.', note:'£400', go:() => { fl('chineseRoom'); add({money:-400, family:7, standing:3}); reg('henrietta',2,'You gave her the Chinese drawing room');
      return `It takes three months and a great many Italians. The result is astonishing. There are eleven dragons, forty-two mandarins and a gilt serpent holding up each curtain. The county comes to stare, and stays to tea. Lady Cullerne says it is “very like the Prince”, in a tone that settles nothing.`; }},
    {t:'Offer new paper only.', note:'£80', go:() => { add({money:-80, family:2});
      return `Mandarins fish from bridges all round the room, above the old yellow sofas, like guests who have come to the wrong party. Henrietta says it will do. It is the phrase she uses of mutton twice cooked.`; }},
    {t:'Decline. Yellow was good enough for your uncle.', go:() => { add({family:-4}); reg('henrietta',-1);
      return `She says no more about it. But the Bond Street man’s drawings stay open on her writing table for a twelvemonth, and she sighs whenever she passes the door, exactly loud enough.`; }}
  ]});

ev({ id:'ballot', from:1796, to:1811, weight:2, repeatGap:20, title:'The Militia Ballot',
  text:() => `The ballot for the county militia has been drawn in the vestry, and your groom, Will Tanner, has come out of the hat. Will has a wife, two children, and a way with horses that is very nearly witchcraft.

A balloted man serves five years or finds a substitute, and substitutes have grown dear since the war, like everything else. The going rate in Wyvern is thirty pounds and rising, the substitutes having formed what amounts to a club.`,
  choices:[
    {t:'Buy him a substitute.', note:'£30', go:() => { add({money:-30, goodwill:3});
      return `The substitute is a weaver from Newbury who has already served for three other men and deserted twice. He takes your thirty pounds with the calm of a professional. Will Tanner says nothing at all, but your hunters have never been turned out as they are that winter; they shine like wet slates.`; }},
    {t:'Let the ballot stand. Every man must take his chance.', go:() => { add({goodwill:-3, family:-1});
      return `Will marches off to Portsmouth with a bundle. His wife goes on the parish. Your horses are given to a lad from Kintbury who is afraid of them, and they know it; by Christmas the bay mare has kicked a hole in the coach-house door and the grey has taught herself to slip a halter.`; }},
    {t:'Subscribe to the parish club that insures every man against the ballot.', note:'£12', go:() => { add({money:-12, goodwill:5});
      return `Every labourer pays in sixpence, you pay in twelve pounds, and the club buys a substitute for whoever is drawn. Will is saved, and so, next year, is the wheelwright’s son. It is the cheapest popularity you ever bought, and the club dinner at the Bell is the best night of the Hatherley year.`; }}
  ]});

ev({ id:'windows', from:1797, to:1809, weight:1, title:'Fifty-Four Windows',
  text:() => `The window tax is raised again. Hatherley Hall has fifty-four windows, a vanity of your great-grandfather’s, and is charged on every one above six.

${F('crabbeGone') ? 'Lark' : 'Crabbe'} proposes bricking up eleven of them, chiefly on the north front, where nobody looks out and only the housemaids look in.`,
  choices:[
    {t:'Brick up the eleven.', go:() => { fl('bricked'); add({family:-3, standing:-1});
      return `The mason comes. The back stairs, the still room and the maids’ attic go dark as the inside of a boot, and the saving is nine pounds a year. From the park the north front now looks like a man with a patch over one eye. The housemaids take to carrying candles at noon, the cost of which nobody has reckoned.`; }},
    {t:'Brick them up and paint sham windows on the plaster.', note:'£20', go:() => { fl('bricked'); add({money:-20, family:-1});
      return `An Italian from Reading paints eleven windows on the bricks, with glazing bars and reflected clouds, and, in one, for a guinea extra, a housemaid looking out. She is very lifelike. A dragoon officer, riding by in 1803, salutes her twice.`; }},
    {t:'Pay. An Englishman is entitled to his daylight.', go:() => { add({standing:1});
      return `You pay for all fifty-four, and are rather pleased with yourself. The assessor, who has heard a great deal of rhetoric about daylight in the course of his duties, writes out the receipt without looking up.`; }}
  ]});

ev({ id:'canal', from:1796, to:1805, weight:2, title:'A Staircase for Barges',
  text:() => `The Kennet and Avon Canal Company is cutting a waterway from Newbury to Bath, fifty-seven miles of it, to join the Thames to the Severn. There is to be a flight of twenty-nine locks up the hill at Devizes, which the engineer, Mr Rennie, calls “a staircase for barges”.

Shares are a hundred and twenty pounds. Hartopp has taken ten. Somerset coal will come up and your wheat go down to London for a third of the cart hire; and it will all be open, he assures you, in three years at the outside.`,
  choices:[
    {t:'Take five shares.', note:'£600', go:() => { S.canal = 5; add({money:-600}); reg('hartopp',1);
      return `You are now a proprietor of a ditch. Calls upon the shares follow at intervals, with engraved views of aqueducts. Three years pass, and then six. Hartopp says that all great works encounter clay.`; }},
    {t:'Take one, to be civil.', note:'£120', go:() => { S.canal = 1; add({money:-120});
      return `One share. It entitles you to attend the general meeting at Marlborough and to be told, annually, that the works proceed with every prospect.`; }},
    {t:'Keep your money on dry land.', go:() => { reg('hartopp',-1);
      return `Hartopp says you will live to regret it. He does not say how long you will have to live. The canal will open in the year 1810, fourteen years and nearly a million pounds after the first sod, by which time several of the original proprietors have been spared any regrets whatever.`; }}
  ]});

ev({ id:'merino', from:1804, to:1809, weight:2, title:'The King’s Sheep',
  text:() => `King George, who in his clear seasons is the best farmer in the kingdom, has been breeding Spanish merinos at Kew, smuggled out of Spain by way of Portugal. Now the royal flock is to be sold by auction, in a field, under an elm.

Merino wool is as fine as gossip and fetches prices that make Hartopp perspire. A ram has gone for forty-two guineas. All at once everybody of consequence in agriculture speaks of fleece in the voice usually kept for bishops.`,
  choices:[
    {t:'Buy a small flock.', note:'£420', go:() => { fl('merino'); add({money:-420, standing:2}); reg('hartopp',2,'You went into merinos with him');
      return `Twenty ewes and a ram, small, wrinkled, and Spanish in their opinion of the Berkshire climate. The shepherd regards them as he would foreign royalty: with respect, and the conviction that they will die of something. But the first clip sells in Bradford-on-Avon at six shillings the pound, three times English wool, and you begin to speak of fleece in that voice yourself.`; }},
    {t:'Buy one ram, to cross on your Berkshire ewes.', note:'£50', go:() => { fl('merinoRam'); add({money:-50}); reg('hartopp',1);
      return `The ram is the size of a large dog and has horns like a pair of French rolls. The lambs he gets are neither one thing nor the other, with fine wool on a carcase no butcher will praise. “Ah,” says Hartopp, “but you have not persevered.”`; }},
    {t:'Leave Spanish sheep to the Spaniards.', go:() => { reg('hartopp',-1);
      return `You decline. Hartopp tells you fortunes are being made. He is right, for the present. In 1811 the price of merinos will fall through the floor, and sheep bought at forty guineas be sold to the butcher at forty shillings; but that is six years off, and for six years you must listen to Hartopp.`; }}
  ]});

ev({ id:'allotments', from:1796, to:1808, weight:2, cond:() => !F('enclosed') && !F('allotments') && !F('nephewFarm'), title:'A Rood for Every Cottage',
  text:() => { meet('thorne'); return `Mrs Thorne has been reading the reports of the Society for Bettering the Condition of the Poor, and has ridden over in her gig to tell you what is in them.

A labourer with a quarter-acre of garden, she says, will grow potatoes enough to keep his family off the parish, and will not need to steal yours. She proposes that you let forty acres of the Hall Close in roods, at a fair rent, to any cottager who wants one. Mr Hartopp thinks it will give them ideas.`; },
  choices:[
    {t:'Let the forty acres in roods.', go:() => { fl('gardens'); S.poorMult *= 0.85; add({goodwill:8}); reg('thorne',2,'You let the Hall Close in gardens on her advice'); reg('hartopp',-1);
      return `A hundred and sixty roods, pegged with hazel. By the second summer the Hall Close is a patchwork of potatoes, beans and cabbages, with here and there a row of sweet williams, because people who are given ground will always grow something useless on a corner of it. The poor rate falls. Hartopp says it is coincidence.`; }},
    {t:'Try it with ten acres first.', go:() => { S.poorMult *= 0.95; add({goodwill:3}); reg('thorne',1);
      return `Forty gardens, drawn for by lot in the vestry. The forty who draw them are envied; the sixty who do not are worse off than before, since now they know what they lack. Mrs Thorne says that is how all half-measures work, and drives home.`; }},
    {t:'Decline. A labourer with land is a labourer with opinions.', go:() => { add({goodwill:-2}); reg('thorne',-1); reg('hartopp',1);
      return `Mrs Thorne puts the reports back in her reticule. “Then they’ll go on having their opinions hungry,” she says, “which I never found improved an opinion.”`; }}
  ]});

ev({ id:'battue', from:1798, to:1813, weight:2, title:'Lord Cullerne’s Battue',
  text:() => `Lord Cullerne invites you to shoot. A Cullerne shoot is not sport but slaughter by appointment: beaters drive the birds over a ride where the guns stand in a row and fire until their shoulders are blue. On the last occasion eleven hundred head were killed in a day, and also a beater.

His lordship is said to have been very decent about the beater.`,
  choices:[
    {t:'Go, and shoot your best.', note:'£20 in vails', go:() => { add({money:-20, standing:4}); reg('cullerne',2,'You shot at Cullerne and tipped his keepers');
      return `You kill forty-one pheasants, nine hares and a woodcock, and are placed third in the game book, below a duke and above a bishop. Dinner is for thirty. You are put next to a lady who tells you that the poor have never been so well off, and that one sees it in their faces.`; }},
    {t:'Go, and fire wide all day.', note:'£20 in vails', go:() => { add({money:-20, standing:1}); reg('cullerne',1);
      return `You fire sixty shots and kill nothing, with real ingenuity. Lord Cullerne commiserates. His head keeper, who has seen every kind of gun there is, comes by your stand at the last drive, looks at the sky you have been aiming into, and says, “Very humane, sir,” without moving his face.`; }},
    {t:'Send regrets.', go:() => { reg('cullerne',-2,'You would not come to his shoot');
      return `Your regrets are received. Your place in the line is given to the brewer from Reading, who shoots a spaniel.`; }}
  ]});

ev({ id:'hunt', from:1797, to:1814, weight:2, cond:() => !F('nephewFarm') && S.chars.thorne.met, title:'Forty Gentlemen in Pink',
  text:() => `The Craven hounds have run a fox across Long Barrow, and after them forty gentlemen in scarlet have galloped through Mrs Thorne’s winter wheat, two gates, and a clamp of mangolds.

Mrs Thorne has sent up an account, itemised, for seventeen pounds four shillings, addressed to the Master. The Master is Lord Cullerne’s brother-in-law. No farmer in the history of the Craven country has ever sent the hunt a bill.`,
  choices:[
    {t:'Carry her bill to the Master yourself.', go:() => { add({standing:-3, goodwill:3}); reg('thorne',2,'You presented her bill to the Craven Hunt'); reg('cullerne',-1);
      return `The Master receives it between finger and thumb. It is paid, in the end, out of the poultry fund, with a note regretting that the lady “does not enter into the spirit of the country”. Mrs Thorne frames the note and hangs it in her dairy.`; }},
    {t:'Pay her yourself and say it came from the hunt.', note:'£17', go:() => { add({money:-17}); reg('thorne',1);
      return `She counts it, and looks at you, and says, “The hunt banks at Tidmarsh’s, does it? Same as you?” But she takes it. The wheat is resown where the horses went, and comes up late and thin, in the exact shape of the field of riders, so that all summer you can see the run from the Down.`; }},
    {t:'Tell her that a hunting country must expect to be hunted over.', go:() => { add({standing:2, goodwill:-3}); reg('thorne',-2,'You sided with the hunt over her wheat');
      return `She hears you with her arms folded. Next season, the fox that goes to ground on Long Barrow is found, when dug for, to have been shot the previous evening and put down the earth for the hounds to discover. To a hunting man there is no blacker crime. Nobody can prove who did it. Nobody needs to.`; }}
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

ev({ id:'crew', from:1795, to:1802, weight:6, cond:() => T('captain'), title:'All Hands at Hatherley',
  text:() => `The household has now been six months under naval discipline. Tarbuck, your coxswain, runs it by the bell: eight strokes at noon, and the footmen piped to dinner. A flagstaff has appeared on the leads. When Lord Cullerne’s carriage turns in at the lodge, it flies “Enemy in sight”.

Old Pascoe, who lost a leg at the Saintes and was the Dryad’s cook, has moved into the kitchen with a single receipt, for lobscouse, and is at war with Mrs Bunce over the copper. The housemaids have learned to splice. Henrietta has been addressed as “the Captain’s lady, bless her” to her face, and has asked you, in a very level voice, whether she lives in a house or a frigate.`,
  choices:[
    {t:'A frigate. The routine stands.', go:() => { add({family:-7, goodwill:4, standing:2}); reg('henrietta',-2,'You told her she lived in a frigate');
      return `The routine stands. The brass on the front door could be shaved in, and the gravel is raked fore and aft. Hatherley village adores it; children are brought to the lodge gates at noon to hear the bell. Henrietta takes to sleeping with wool in her ears, and to referring to you, among her friends, as “the Admiralty”.`; }},
    {t:'A house. Strike the hammocks and stop the bell.', go:() => { fl('crewGone'); add({family:6}); reg('henrietta',2,'You sent the ship’s routine ashore for her sake');
      return `The hammocks come down. The Dryads try beds, and report that they cannot sleep in a thing that does not swing. Within the quarter nine of the eleven have gone back to Portsmouth, where a frigate is fitting out; they shake your hand at the gate one by one, and Tarbuck pipes them over the side of the wagon. Ordinary servants are engaged, at ordinary wages. The Hall is very quiet. You find that you wake at five all the same.`; }},
    {t:'Draw a line at the green baize door: ship below stairs, house above.', go:() => { add({family:2, goodwill:1}); reg('henrietta',1);
      return `A treaty is signed. Below the baize door, bells, pipes and lobscouse; above it, silence until nine, and nobody to say “aye aye” to a lady. It holds, on the whole. Pascoe and Mrs Bunce divide the kitchen by a chalk line down the flags, across which they do not speak, and pass the salt by way of a housemaid.`; }}
  ]});

ev({ id:'press', from:1803, to:1811, weight:5, cond:() => T('captain') && !F('crewGone'), title:'A Lieutenant with a Warrant',
  text:() => `The fleet wants forty thousand men and cannot find them. A press gang has come up the Kennet as far as Wyvern, which has not seen one in living memory: a lieutenant, a midshipman of about twelve, and eight hands with cudgels, quartered at the George.

Somebody has told them that there are eleven prime seamen living at Hatherley Hall, rated as butler, footmen and gardeners, and not one with a protection in his pocket. The lieutenant has sent his compliments. He proposes to call tomorrow, and trusts that he will find your servants at home.`,
  choices:[
    {t:'Receive him in your old uniform, and ask to see his warrant.', go:() => { add({standing:3}); reg('henrietta',1);
      return `You receive him in the library in a post-captain’s full dress, both epaulettes, which fits everywhere but the waistcoat. The warrant, read closely, extends to seafaring men found “upon the rivers and the coast”, and you invite him to point out which of these Hatherley Hall may be. He is twenty-three. You were made post before he was breeched. He drinks one glass of your Madeira standing up, and his gang is in Reading by nightfall.`; }},
    {t:'Put the Dryads in the ice-house till he has gone.', go:() => { const ice = F('icehouse'); add({goodwill:2, standing:-1});
      return ice ? `Eleven seamen spend two nights in the ice-house with a ham, a keg and a pack of cards, and come out blue, cheerful, and eleven shillings up on the gunner. The lieutenant searches the Hall from the leads to the cellar and finds a butler’s pantry with a cutlass in it, and no butler. He knows perfectly well. So do you. You bow to one another very low.` : `There being no ice-house, they are put in the hay loft at Long Barrow, where the midshipman, who is twelve and misses nothing, finds a tarred pigtail hanging through a gap in the boards. It costs you twenty minutes of the plainest speaking of your life, captain to lieutenant, to send the gang away without them. It is all over Wyvern by noon that the squire hides deserters, which they are not.`; }},
    {t:'Muster them and let any man volunteer who chooses.', go:() => { fl('crewGone'); add({standing:4, family:3}); reg('edmund',1);
      return `You muster them on the gravel and say that the King wants seamen and that no man of yours shall be pressed, or hindered. They look at their boots. Then Tarbuck steps forward, and the gunner, and inside a minute all but old Pascoe have stepped forward with them, and are entered as volunteers, with the bounty. They march out behind the lieutenant singing. The Hall, that evening, is quieter than a church. Pascoe makes lobscouse for two.`; }}
  ]});

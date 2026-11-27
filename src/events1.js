/* The fixed calendar: what history brings to the door, and when. */
const EVENTS = [];
const ev = e => EVENTS.push(e);
const K = () => S.flags.kitty || 'free';
const E = () => S.flags.edmund || null;
const kittyAge = () => 17 + (S.year - 1795);

ev({ id:'speen', fixed:'1795-0', title:'The Pelican at Speen',
  text:() => `The magistrates of the county are met at the Pelican at Speen, by advertisement, to consider the state of the labouring poor, and have begun, as the bench does generally begin, with the turbot. Bread is at elevenpence the quartern. A man with a wife and three children has eight shillings a week to buy it with, and the gentlemen present are too good arithmeticians to pretend that the sum comes out.

Dr Gall has a paper. Leave wages where the farmers have put them, he says, and let the parish make every family up out of the rates, by a table: three shillings for the man, eighteenpence for his wife, eighteenpence for each child, the whole to rise and fall with the gallon loaf. “It is charity by the rule of three, gentlemen. It will cost the farmer nothing, and the labourer his impudence.” He looks down the cloth for a seconder, and his eye stops at you.`,
  choices:[
    {t:'Second the Doctor’s table.', go:() => { fl('speen'); add({goodwill:4, standing:1}); reg('gall',2,'You seconded his bread scale at Speen');
      return `The table is carried with two dissentients and ordered to be printed. Mr Hartopp has it by heart before the cloth is drawn, and has found in it what the Doctor did not put there: that if the parish will make a man up to nine shillings, the farmer is a fool who pays him above six. He says so to his neighbour, and does not lower his voice to say it. The paper goes to the Reading Mercury on Monday with your name second upon it.`; }},
    {t:'Move that the bench fix wages by the price of bread, and pay them at Hatherley yourself.', go:() => { fl('wages'); add({goodwill:9, standing:-3}); reg('gall',-1); reg('hartopp',-1,'Thinks your wages will ruin him'); reg('pryor',1);
      return `You are heard with the attention gentlemen give to a neighbour who has stood up in the wrong place in the Litany. It is observed that such notions do very well for Mr Whitbread, who sells beer, and may reasonably wish the poor more money to buy it. The motion is lost. You put your own men to nine shillings from Monday, and by Sunday there is not a hedger between Hungerford and Newbury but knows which estate pays it.`; }},
    {t:'Attend to the turbot.', go:() => { add({goodwill:-3, standing:1});
      return `You say nothing, and are thought to have said it very properly. The Doctor’s table is carried without you. In the yard the ostlers, who have had the whole of it through the open window and will have it in every tap on the Bath road by night, hold your stirrup with great civility and look at the horse.`; }}
  ]});

ev({ id:'flour', fixed:'1795-1', title:'The Old Price',
  text:() => `Market day at Wyvern, and the quartern loaf at elevenpence. In the corn market some dozen women of Hatherley have stopped Pocock the miller’s cart, taken down his sacks, and are selling the flour upon the cobbles at the old price, which they have settled among themselves and will not be argued out of. Sukey Pryor keeps the measure. She has a child on one hip, and strikes the peck level with the flat of her other hand.

Every penny goes into Pocock’s own hat. He stands holding it out before him, like a thing he may be asked about upon oath, and when he sees you ride in under the arch of the George he calls on you by name, as a magistrate, to do your duty.`,
  choices:[
    {t:'Read the Riot Act and send for the Volunteers.', go:() => { fl('riotAct'); add({standing:3, goodwill:-10}); reg('pryor',-2,'You read the Riot Act at his wife'); reg('gall',1);
      return `“Our Sovereign Lord the King chargeth and commandeth all persons, being assembled, immediately to disperse themselves.” You read it from the steps of the Corn Exchange with your hat off, and it is over sooner than a grace. The law allows them an hour to go in. They use the whole of it. When the Volunteers ride in there is no flour and no crowd, and Pocock has his money told out exact upon the tailboard. Nobody is taken up. Sukey Pryor drops you a curtsey as she goes by, the first she ever troubled to make you.`; }},
    {t:'Buy the whole cart yourself and let them carry on.', note:'£140', go:() => { add({money:-140, goodwill:8, standing:-2}); reg('cullerne',-1,'Thinks you bought off a mob'); reg('pryor',1,'You paid for his wife’s flour');
      return `You give Pocock a draft upon Tidmarsh for the difference, a hundred and forty pounds. He reads it twice. He has been robbed and paid in one morning, and has not settled which he shall complain of. The women give you three cheers and go back to the last sack. Lord Cullerne has the story with his second course, and is understood to have asked whether Mr ${S.sur} keeps a mob of his own, or only hires.`; }},
    {t:'Take Pocock aside and mention his lease.', go:() => { fl('millerCowed'); add({goodwill:4, standing:1});
      return `You walk him a little apart, and say that you have been thinking of Hatherley Mill, the lease of which falls in at Michaelmas, and that you never saw a prettier fall of water. Pocock finds he had meant all along to sell at the old price this week, from Christian feeling. He says so aloud, twice. The women carry home their flour. The miller carries home his feeling, and it is not thought he will part with that under the market rate.`; }}
  ]});

ev({ id:'powder', fixed:'1795-2', title:'A Guinea a Head',
  text:() => `Mr Pitt, having taxed windows, horses, hats, servants, clocks and dogs, has now taxed hair powder: one guinea a year for every head that wears it.

Henrietta has powdered since she was twelve and regards a bare head as one stage short of a severed one. Edmund wishes to crop his hair in the French manner, which the Whigs at Woburn have taken up and the Tories call Jacobin. The two footmen, John and the other John, wait to learn what their heads are worth.`,
  choices:[
    {t:'Pay for every head in the house, footmen and all.', note:'8 guineas', go:() => { add({money:-9, standing:3, family:2}); reg('henrietta',1);
      return `Eight guineas, and the Hall goes on smelling faintly of flour and pomatum. The newspapers have christened those who pay the tax “guinea-pigs”. You are now, officially, a guinea-pig. So is Henrietta, though the man has not been born who will tell her.`; }},
    {t:'Crop the lot of you.', go:() => { add({family:-4, standing:-2}); reg('henrietta',-2,'You cropped her footmen'); reg('edmund',1); reg('cullerne',-1); reg('hartopp',1);
      return `The barber comes up from Wyvern and leaves with enough hair to stuff a bolster. Edmund looks like a Roman. You look like a Roman who has been ill. Henrietta does not come down to dinner for three days, and when she does she is wearing a turban, and an expression.`; }},
    {t:'Pay for Henrietta. Shear everyone else.', note:'1 guinea', go:() => { add({money:-1, family:1});
      return `A compromise, and like most compromises it pleases the party who costs the money and nobody else. The Johns are shorn. One of them weeps. Henrietta remains magnificent and floury, the last white peak in a house of stubble.`; }}
  ]});

ev({ id:'fenn', fixed:'1795-3', title:'A Citizen at the Bell',
  text:() => `A shoemaker named Absalom Fenn has walked down from London with a pack of pamphlets and a face like a disappointed hawk. Every evening at the Bell he reads Paine’s Rights of Man aloud to the carters, slowly, with the hard words explained.

Parliament has just passed the Two Acts, and a political meeting of more than fifty persons now wants a magistrate’s licence. There are, by Crabbe’s count, forty-nine persons at the Bell most nights. Crabbe has counted very carefully.`,
  choices:[
    {t:'Have Fenn taken up as a seditious person.', go:() => { fl('fennTaken'); add({standing:3, goodwill:-5}); reg('gall',2,'You gaoled the shoemaker'); reg('cullerne',1);
      return `Fenn goes to Reading gaol and, the case against him being thin, comes out again in the spring a good deal more famous than he went in. The carters learn the hard words anyway. A surprising amount of political education can be got by asking what a man was arrested for.`; }},
    {t:'Go down to the Bell and argue with him.', go:() => { fl('fennDebate'); add({goodwill:5, standing:-2}); reg('cullerne',-1); reg('pryor',1,'Saw you argue with Fenn and pay for the beer');
      return `You argue for two hours on the hereditary principle. You make, you think, several telling points about the British Constitution, and Fenn makes several telling points about your uncle, whom he has plainly researched. The carters enjoy it enormously. It is agreed that you lost, but that you paid for the beer, which in Hatherley is scored as a draw.`; }},
    {t:'Buy every copy of Paine in Wyvern and burn them.', note:'£15', go:() => { add({money:-15, standing:1});
      return `Mr Gosling the bookseller, delighted, sells you nineteen copies and orders forty more from London on the strength of the demand. The bonfire is very well attended. Several people take notes.`; }}
  ]});

ev({ id:'edmundFuture', fixed:'1796-0', title:'Edmund Wishes to Be Useful',
  text:() => `Edmund has been reading the Gazette at breakfast, always a bad sign. The French have a general called Bonaparte who is twenty-six and conquering Italy, and Edmund, who is twenty and has conquered nothing larger than a pork pie, finds this unbearable. He wants a commission.

Henrietta wants him in holy orders. Dr Gall is old, you hold the next presentation to the living, and a son in a pulpit is a son who is home for dinner.`,
  choices:[
    {t:'Buy him an ensigncy in the 52nd Foot.', note:'£450', go:() => { fl('edmund','army'); add({money:-450, family:-1}); reg('edmund',3,'You bought him his colours'); reg('henrietta',-2,'You sent her son to the wars');
      return `Four hundred and fifty pounds: the King charges you for the privilege of having your son shot at. Edmund is in ecstasy. He has a coat made so red that it hurts to look at, and he looks at it constantly, in every glass in the house, including the one in the dairy.`; }},
    {t:'Write to Captain Holloway for a berth in his frigate.', go:() => { fl('edmund','navy'); add({family:-1}); reg('edmund',2,'You got him to sea'); reg('henrietta',-2,'You sent her son to sea');
      return `Captain Holloway, an old messmate of your uncle’s with the manners of a winch, agrees to take Edmund into the Thetis, thirty-two guns. Edmund is old for a beginner and will be ordered about by boys of fourteen. “Good,” writes Holloway. It is the whole of the letter.`; }},
    {t:'Steer him into the Church.', go:() => { fl('edmund','church'); add({family:1}); reg('edmund',-3,'You steered him into the Church'); reg('henrietta',3); reg('gall',-1,'Dislikes being reminded he is mortal');
      return `Edmund goes up to Oriel to read for orders with the face of a man wading into the sea. He writes home every Sunday. The letters are dutiful and contain no news whatever, which is how you know that he is miserable.`; }},
    {t:'Keep him at home to learn the estate.', go:() => { fl('edmund','home'); add({family:2}); reg('edmund',-1); reg('henrietta',2);
      return `Edmund stays. He learns to tell a sound ewe from a rotten one, a sound tenant from a rotten one, and your claret from Crabbe’s. He also learns to sulk in the gun room, where he will clean the same fowling piece for an hour together, thinking about Italy.`; }}
  ]});

function electionWin(){ return chance(clamp(0.3 + (S.standing - 40) / 110 + (S.goodwill - 50) / 250, 0.1, 0.85)); }

ev({ id:'election96', fixed:'1796-1', title:'Burgage Votes',
  text:() => `There is to be a general election. The borough of Wyvern sends two members to Parliament on the votes of whoever owns thirty-one ancient burgage plots, most of them now pigsties. Three, through your uncle’s foresight, are yours. Lord Cullerne owns fourteen, and has lately decided that he should like to name both members instead of one.

He means to bring in his nephew, the Honourable Fitzroy Bligh, a young man with the conversation of a decanter, and he sends you his compliments and a haunch of venison. The venison is a question.`,
  choices:[
    {t:'Eat the venison. Vote for Fitzroy.', go:() => { fl('cullerneMan'); add({standing:3}); reg('cullerne',3,'You ate his venison and voted his nephew in');
      return `Fitzroy is returned unopposed, which is how Wyvern prefers its elections. He will make his maiden speech in 1798, on the subject of a turnpike, and never trouble the House again. Lord Cullerne remembers who ate his venison.`; }},
    {t:'Stand yourself.', note:'£900 in beer, ribbons and inducements', go:() => { add({money:-900});
      if (electionWin()) { fl('mp'); add({standing:10}); reg('cullerne',-3,'You beat his nephew at Wyvern'); reg('henrietta',2);
        return `You are returned for Wyvern by sixteen votes to fifteen. Three of the sixteen were your own; the rest were acquired at prices you will not be mentioning to Henrietta. You are a Member of Parliament. You will be wanted in London each spring, and you will be expected to hold opinions.`; }
      add({standing:-4}); reg('cullerne',-4,'You stood against his nephew, and lost');
      return `You lose by two votes, both of which you had paid for. The men who sold them to you sold them again to Lord Cullerne’s agent, at a better price, on the morning of the poll. You have learnt a great deal about the British Constitution, and none of it is in Blackstone.`; }},
    {t:'Send the venison back.', go:() => { add({standing:-1, goodwill:2}); reg('cullerne',-3,'You returned his venison');
      return `The haunch goes back to Cullerne Castle in the cart it came in, with a note polite enough to cut glass. Fitzroy is returned all the same. His lordship has an excellent memory for venison.`; }}
  ]});

ev({ id:'bank', fixed:'1797-0', title:'Paper and Gold',
  text:() => `Two pieces of news come in on one coach. Fourteen hundred Frenchmen have landed at Fishguard, got drunk on a wrecked cargo of port, and surrendered to a force that included, by every account, a great many Welsh women in red flannel cloaks. And the Bank of England, frightened by the first piece of news, has stopped paying gold for its notes.

By noon the queue outside Tidmarsh’s Wyvern and County Bank reaches the pump. Mr Tidmarsh, who holds a good part of your money, has been seen at an upstairs window, praying or counting.`,
  choices:[
    {t:'Join the queue and get your gold out.', go:() => { fl('ranOnBank'); fl('bankFailed'); add({standing:-4, goodwill:-5});
      return `You get your money in guineas, which are heavy, cold, and resent being carried in a coat. Behind you the town watches the squire of Hatherley fill his pockets, and the queue lengthens by forty yards. Tidmarsh stops payment at four. Half the tradesmen in Wyvern had their savings there. They know who stood at the head of the line.`; }},
    {t:'Stand on the bank steps and declare you will take Tidmarsh’s paper.', go:() => { fl('backedBank'); add({standing:6, goodwill:3}); later('bankFate', 2);
      return `You make a short speech about British credit and the essential soundness of Mr Tidmarsh, concerning which you know nothing at all. It works. Your confidence is loud enough to become general. The queue thins, Tidmarsh comes down from his window, and you ride home with every penny still in his vault: exactly where it was this morning, and somehow a great deal less safe.`; }},
    {t:'Stay at home and read Cowper.', go:() => { add({standing:-1});
      return `Tidmarsh survives the week, propped up by a farmer from Lambourn who announced in the market place that he would take the bank’s paper at par, and who is now spoken of in Wyvern as though he had sunk the French fleet with his own hands. You might have been that farmer.`; }}
  ]});

ev({ id:'bankFate', follow:true, title:'Mr Tidmarsh Calls',
  text:() => `Mr Tidmarsh has driven out from Wyvern in a hired chaise and sits on the edge of your library chair with his hat on his knees.`,
  choices:[
    {t:'Hear him.', go:() => {
      if (chance(0.72)) { fl('cheapCredit'); add({standing:2});
        return `The bank is safe. He has come to say so, and to say that he knows whose speech saved it, and that a banker’s gratitude, unlike other men’s, may be expressed as a percentage. Your mortgage will henceforth run at four per cent instead of five. He shakes your hand for some time. His own is damp, like a cellar that has been lately flooded and pumped out.`; }
      fl('bankFailed'); add({money:-600, standing:-1});
      return `The bank is gone. A house in Bristol that owed Tidmarsh failed on Tuesday and took him with it, and your speech on the steps merely gave everyone an extra month in which to deposit. The creditors will see seven shillings in the pound. Your share of the loss is about six hundred. He is very sorry. He has brought you a pineapple.`; }}
  ]});

ev({ id:'nore', fixed:'1797-1', cond:() => E() === 'navy', title:'A Letter from the Nore',
  text:() => `The fleet at the Nore has hoisted the red flag and stopped the river, and the Thetis is named among the ships. For nine days you have no word. On the tenth comes a letter, charged double, with the direction in Edmund’s hand.

“Sheerness, Sunday. My dear Father, You will have seen by the papers what has happened here, and I write that my mother may know I am on shore and perfectly well. We were put into the boats on Friday with great civility. The ship’s cook, who has now the command of her, handed down my chest himself and begged I would excuse the trouble. They ask that their pay be raised, which it has not been since King Charles’s time, and that the purser’s pound be sixteen ounces like another man’s, and not fourteen. I do not find, sir, that I can think them wrong. Pray do not let this be seen by any friend of Captain Holloway’s.

I am, my dear Father, your dutiful son, E. ${S.sur}.”`,
  choices:[
    {t:'Write to the Admiralty urging mercy for the men.', go:() => { add({standing:-2}); reg('edmund',2,'You wrote to the Admiralty for his shipmates');
      return `Your letter is acknowledged by a clerk in eleven words, four of them your own name and style. In June the ships come in one by one and strike the red flag. Parker, the president of their delegates, is hanged on board the Sandwich, and eight and twenty after him; the cook of the Thetis is flogged round the fleet, and lives. Edmund never speaks of what you wrote. But his next letter is signed your affectionate son, where it used to be dutiful.`; }},
    {t:'Write to Edmund that mutiny is mutiny.', go:() => { add({standing:1}); reg('edmund',-1);
      return `You write four sides upon duty, and have them copied fair. Edmund’s answer fills one, and is chiefly about the wind in the Downs. The delegates are hanged, flogged or pardoned, each according to his luck. The shilling a day is granted to the rest, the country having found in June that it could afford what in April would have ruined it.`; }}
  ]});

ev({ id:'defence', fixed:'1798-1', title:'In Case of the French',
  text:() => `The Lord Lieutenant has written. Should the French land, every parish is to drive its cattle inland, break its mills, burn its ricks, and send its women, children and infirm along appointed roads in appointed wagons. He therefore requires a list of every ox, wagon, spade, axe and able-bodied man in Hatherley, with the names of those willing to serve as pioneers, as guides, or as “persons to destroy”.

Crabbe wishes to know whether you would care to be a person to destroy. He has put himself down as a guide.`,
  choices:[
    {t:'Make honest returns, to the last spade.', go:() => { add({standing:2, goodwill:-2});
      return `The return goes to Reading: two hundred and six oxen, forty-one wagons, nine hundred and twelve sheep and eighty-three able men, eleven of whom the overseer has annotated “able only in a manner of speaking”. The village takes it hard. A man who has been listed is a man who can be moved, and nobody in Hatherley has been moved further than Newbury since the Civil War.`; }},
    {t:'Raise and equip the Hatherley Volunteers.', note:'£300', go:() => { fl('volunteers'); add({money:-300, standing:7, goodwill:2}); reg('cullerne',1);
      return `Forty men in green coats, with pikes, there not being muskets enough in England, and a drum the drummer has already put his foot through. They drill on the common on Sunday afternoons. Their manoeuvres resemble a flock of sheep receiving bad news. They are immensely proud all the same, and so, rather to your surprise, are you.`; }},
    {t:'Leave it all to Crabbe.', if:() => !F('crabbeGone'), go:() => { reg('crabbe',1); later('crabbeList', 3);
      return `Crabbe bears the papers away with a look of deep patriotic satisfaction. The return he sends to Reading is beautifully written and very full. You do not read it.`; }}
  ]});

ev({ id:'crabbeList', follow:true, cond:() => !F('crabbeGone'), title:'Wagons of a Spiritual Character',
  text:() => `A clerk from the Lord Lieutenant’s office has ridden over to inspect the fifty-two wagons that Hatherley has pledged to the nation. There are forty-one. The other eleven exist only in Crabbe’s handwriting, where they have been drawing a government allowance of sixpence a day each for “exercise”, payable to the steward.

Crabbe, sent for, is not at all put out. “A reserve, sir,” he says. “One does not show the enemy everything.”`,
  choices:[
    {t:'Dismiss him on the spot.', go:() => { fl('crabbeGone'); add({standing:2, goodwill:2}); reg('crabbe',-5,'Dismissed over eleven wagons that did not exist');
      return `Crabbe goes, taking a writing desk you were fairly sure was yours, and sets up in Newbury as a land agent. Within the year he is managing the estates of three of your neighbours, who speak of him very highly. Your new steward is a young Scot named Lark, so honest it is unsettling; he gives you a receipt for a receipt.`; }},
    {t:'Repay the allowance quietly and keep him where you can see him.', note:'£70', go:() => { fl('crabbeWatched'); add({money:-70}); reg('crabbe',-1,'Knows that you know about the wagons');
      return `You pay back the sixpences. Crabbe thanks you for your confidence, in the voice of a man banking it. For a month his accounts are so correct they could be read in church.`; }},
    {t:'Tell the clerk the wagons are out on exercise.', go:() => { fl('crabbeSkims'); add({standing:-2}); reg('crabbe',2,'You lied to the Lord Lieutenant for him');
      return `The clerk looks at you, then at Crabbe, then writes something down and rides away. You have now lied to the Crown on behalf of your steward. Crabbe understands the transaction perfectly, and from this day considers himself to hold a small mortgage on you.`; }}
  ]});

ev({ id:'incomeTax', fixed:'1799-3', title:'Ten Per Centum',
  text:() => `Mr Pitt has invented a tax upon income. Every gentleman is to declare what he has, in confidence, to commissioners who are his neighbours, and pay two shillings in the pound on it.

The commissioners for this division are ${F('gallDead') ? 'Lord Cullerne’s agent' : 'Dr Gall'}, Mr Hartopp, and a retired attorney named Spurling, who once described himself to you as “a ferret in a good coat”. The form has come. It is very long, and at the foot is a space for your name, beneath the word “solemnly”.`,
  choices:[
    {t:'Declare every half-crown.', go:() => { fl('taxHonest'); add({standing:2});
      return `You declare the lot. Spurling, reading it, raises his eyebrows so far that his wig travels. Honesty on this scale is so rare in the division that it is at first mistaken for a trick, and he spends a fortnight looking for what you have hidden behind it.`; }},
    {t:'Declare what the estate was worth in your uncle’s day.', go:() => { fl('taxDodge'); later('taxCaught', 5 + Math.floor(Math.random() * 6));
      return `You are, on paper, a much poorer man than in fact, and go about Wyvern feeling quite sorry for yourself. Spurling sends an acknowledgement. It reads: “Received, with interest.” It is the most alarming thing anybody has ever written to you.`; }},
    {t:'Pay in full, and denounce it at the Bell.', go:() => { fl('taxHonest'); add({goodwill:3, standing:-1});
      return `You pay, and then make a speech at the Bell on the liberties of Englishmen so affecting that the landlord forgets to charge for the brandy. The labourers, who have no incomes worth taxing, listen with the particular enjoyment of men watching one gentleman pick another’s pocket.`; }}
  ]});

ev({ id:'taxCaught', follow:true, cond:() => F('taxDodge'), title:'A Ferret in a Good Coat',
  text:() => `Mr Spurling has called, with a clerk, a tin box, and a copy of the particulars of sale drawn up when Lord Cullerne tried to buy Hatherley from your uncle in 1791. The particulars state the rental. The rental does not resemble your return.

“I make it a difference of some nine hundred a year,” says Spurling, with real affection. “One does so enjoy a discrepancy.”`,
  choices:[
    {t:'Pay the arrears and the surcharge.', note:'£420', go:() => { fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-5});
      return `You pay. The proceedings of the commissioners are confidential, which is why it takes until Thursday for the whole of Wyvern to know the figure. For some months, tradesmen present their bills to you with a slight emphasis.`; }},
    {t:'Offer Spurling fifty guineas for his trouble.', note:'£52', go:() => { add({money:-52});
      if (chance(0.5)) { return `Spurling considers the purse for the space of a breath, and then it is no longer on the table. “Rents do fluctuate,” he observes, closing the tin box. You will go on being a poor man on paper. You are also, now, a man who has bribed a ferret, and the ferret knows where you live.`; }
      fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-9});
      return `Spurling looks at the purse as a bishop might look at a dancing girl: with interest, and then with indignation. He takes the arrears, the surcharge, and the story, and he tells the story everywhere, improving it each time. In the final version there are a hundred guineas and you are on your knees.`; }}
  ]});

ev({ id:'dearth', fixed:'1800-2', title:'A Proclamation Concerning Bread',
  text:() => `The harvest has failed two years together. Wheat stands at a hundred and thirteen shillings the quarter; in Hatherley they are making bread of barley, bran, and something Dr Gall calls Providence and everyone else calls nettles.

The King has issued a Proclamation exhorting all households of substance to eat a third less wheat, to forgo pastry, and to discourage flour in puddings. Mrs Bunce, your cook, has read the Proclamation and taken it as a personal attack.`,
  choices:[
    {t:'Sign the pledge. No pastry at the Hall.', go:() => { add({family:-4, goodwill:5, standing:2}); reg('henrietta',-1);
      return `Mrs Bunce produces, by way of protest, a run of rice puddings of such malignant blandness that Henrietta retires to her room. Potatoes appear at every meal, in disguises. On Sundays you catch the cottagers sniffing the air beneath your kitchen chimney for pie. There is none. This is noticed, and set down to your credit.`; }},
    {t:'Open a soup kitchen in the old brewhouse.', note:'£250', go:() => { fl('soup'); add({money:-250, goodwill:11, standing:3}); meet('thorne'); reg('thorne',1); reg('gall',-1); reg('pryor',1);
      return `The soup is made to Count Rumford’s receipt: barley, pease, potatoes, stale bread, a great deal of water, and a bone boiled so often that it acquires a kind of reputation. Two hundred quarts a day; the children come with jugs. Dr Gall preaches against teaching the poor to depend upon soup, and then sends his housekeeper for a quart, because it is very good soup.`; }},
    {t:'Sell the home farm wheat while the price holds.', note:'+£460', go:() => { fl('hoarder'); add({money:460, goodwill:-11}); reg('pryor',-1,'Counted your wheat wagons leaving in the dearth'); later('rickFire', 2);
      return `Your wheat goes to a factor from Reading at a hundred and fifteen shillings, a price that would have made your uncle weep for joy. It leaves the village in daylight, in three wagons, past the cottages. Every soul in Hatherley counts the sacks.`; }}
  ]});

ev({ id:'census', fixed:'1801-1', title:'The Numbering of the People',
  text:() => `For the first time in its history the nation wishes to know how many of it there are. Mr Nokes, the overseer, has been sent a form and told to count every soul in Hatherley.

He has met resistance. Old Hannah Gurney has informed him that when King David numbered Israel the Lord sent a pestilence, and has barred her door. Three families have gone to stay with cousins until it is over. The blacksmith gives the number of his children as “enough”.`,
  choices:[
    {t:'Go round with Nokes yourself.', go:() => { add({goodwill:4, standing:1});
      return `You go from door to door with Nokes and a basket of oranges, and the oranges prove the decisive argument. Hatherley is returned at six hundred and four souls. Nokes lost count twice and made up the difference from a sense of proportion, but it is a handsome figure and the parish is rather pleased with it.`; }},
    {t:'Tell Nokes to estimate and be done.', go:() => { add({goodwill:1});
      return `Nokes estimates. The Government is informed that Hatherley holds five hundred and ninety persons, a number he reached by counting chimneys and multiplying by his own age. It is probably near enough. Old Hannah Gurney dies in March, at ninety, and the village divides over whether it was the pestilence or the winter.`; }},
    {t:'Have the constable count the absentees as vagrants.', go:() => { add({goodwill:-4, standing:1});
      return `The three families come home from their cousins very fast. The count is exact: five hundred and ninety-seven. In the column headed “occupation”, the blacksmith has asked Nokes to put him down as “numbered”.`; }}
  ]});

ev({ id:'paris', fixed:'1802-1', title:'Everyone Is Going to Paris',
  text:() => `The war is over, or has at any rate stopped. Peace was signed at Amiens in March, and all fashionable England has crossed the Channel to look at the Louvre, the place where the guillotine stood, and the First Consul, roughly in that order.

${K() === 'free' ? 'Kitty wishes to see Bonaparte. ' : ''}Henrietta wishes to see the shops in the Palais Royal. ${F('gallDead') ? 'The new curate' : 'Dr Gall'}, who has never been further than Bath, says the French are a nation of atheists who eat frogs after the manner of the Philistines.`,
  choices:[
    {t:'Take the family.', note:'£500', go:() => { fl('paris'); add({money:-500, family:10, standing:3}); reg('henrietta',2,'You took her to Paris in the peace'); if (K() === 'free') reg('kitty',2);
      return `Paris is filthy, glorious, and full of the English. You see the First Consul at a review on the Place du Carrousel: a small sallow man on a white horse, running his eye along the crowd as if it were a column of figures he meant to add up later. Henrietta buys eleven bonnets. You come home by the Calais packet with a cold in the head and a settled conviction that the peace will not last.`; }},
    {t:'Send Henrietta with your sister Selina.', note:'£220', go:() => { fl('paris'); add({money:-220, family:4}); reg('henrietta',1);
      return `They go, and return speaking a French no Frenchman would own to, and with a great deal of information about Madame Récamier’s bed, which is apparently shown to visitors. Selina has seen Bonaparte and thought him common. She says so to everyone, as though he might hear of it and be hurt.`; }},
    {t:'Refuse. The French are not to be trusted.', go:() => { add({family:-6}); reg('henrietta',-2,'You kept her from Paris'); if (!F('gallDead')) reg('gall',1);
      return `You refuse, and spend the summer being proved right very slowly. Every letter from Paris that reaches the neighbourhood is read aloud at your own table by somebody else’s wife.`; }}
  ]});

ev({ id:'boulogne', fixed:'1803-2', title:'The Army of England',
  text:() => `The peace has broken like a cheap plate. Bonaparte has a hundred and fifty thousand men at Boulogne and two thousand flat-bottomed boats, and says he needs only six hours of fog to be master of the world. In every nursery in Berkshire Boney has put the bogeyman out of work: he eats children for breakfast, it is understood, and keeps the nurses for dinner.

Four hundred thousand Englishmen have enrolled as Volunteers. Most of them have pikes.`,
  choices:[
    {t:'Drill the Hatherley Volunteers yourself, twice a week.', if:() => F('volunteers'), go:() => { add({standing:5, goodwill:2, family:-2});
      return `You drill them on the common through the autumn, out of a book. By November they can form line, form square, and fix pikes without injury to more than one or two. The blacksmith has been made serjeant, on the principle that no Frenchman has ever seen anything like him.`; }},
    {t:'Raise a corps of Volunteers now.', note:'£320', if:() => !F('volunteers'), go:() => { fl('volunteers'); add({money:-320, standing:6, goodwill:2});
      return `Forty men, green coats, a flag worked by the ladies of the parish showing either a lion or a hearth-rug, opinion is divided. They have pikes. They would have preferred muskets, but they are assured by the serjeant, who is the blacksmith, that a pike is a musket “with the nonsense left out”.`; }},
    {t:'Send a hundred pounds to the Patriotic Fund at Lloyd’s.', note:'£100', go:() => { add({money:-100, standing:3}); reg('cullerne',1);
      return `Your name appears in the published list between a duke who gave less and a soap-boiler who gave more. Lord Cullerne remarks on it, approvingly, in front of people. It is the cheapest glory available this year.`; }},
    {t:'Set Henrietta at the head of a flannel committee.', go:() => { add({family:3, goodwill:1, standing:1}); reg('henrietta',1);
      return `Henrietta assembles the ladies of the parish to sew shirts for the troops. The committee meets on Tuesdays and by Christmas has produced nine shirts, some two hundred opinions, and one engagement.`; }}
  ]});

ev({ id:'beacon', fixed:'1804-0', title:'The Beacon on Hatherley Down',
  text:() => `At two in the morning Billy Coombes, who keeps the beacon on Hatherley Down and has been told every week for a year to watch for fire on Inkpen Hill, sees fire on Inkpen Hill, and does his duty. The fire on Inkpen was a charcoal burner with a cold.

By three the whole Kennet valley is alight from end to end, the bells are going, and the Volunteers of six parishes are mustering in a state of advanced undress. Henrietta is packing the silver. ${F('gallDead') ? 'The sexton has buried the communion plate in the vicarage asparagus bed and cannot recall the row.' : 'Dr Gall has buried the communion plate under his asparagus and cannot now recall which row.'}`,
  choices:[
    {t:'Mount, and lead the men towards the coast.', go:() => { add({standing:6, goodwill:4, family:-2});
      return `You march at the head of Hatherley for fourteen miles in the direction of the sea before the Bath mail overtakes you with the truth. The French are not coming. The men are footsore and disappointed, and several are wearing one boot, but they have marched fourteen miles for England in the dark and will speak of it until they die. Some of them do, eventually, in the same taproom, in the middle of the story.`; }},
    {t:'Ride up to the beacon and find out.', go:() => { add({standing:2, goodwill:1});
      return `You ride up the Down in a nightshirt and greatcoat, find Billy Coombes in tears beside a blaze of real magnificence, and establish within ten minutes that no Frenchman is nearer than Boulogne. You are the one man in the valley back in bed before dawn. Nobody thanks you. A false alarm is the single occasion in war on which people would rather not be told the truth early.`; }},
    {t:'Stay, and guard the house.', go:() => { add({family:4, standing:-5}); reg('henrietta',1);
      return `You stand at the stairhead till daybreak with your uncle’s sword, which has not left its scabbard since the Forty-Five and proves to have rusted into it. Henrietta is touched. The county is not. By evening all Wyvern knows that the squire of Hatherley held his staircase against the French with a sword he could not get out.`; }}
  ]});

ev({ id:'trafalgar', fixed:'1805-3', title:'Laurel on the Mail',
  text:() => `The London mail comes into Wyvern with laurel round its lamps and black crape on the horses. There has been a great sea fight off Cape Trafalgar; the French and Spanish fleets are destroyed; Lord Nelson is dead. The town cannot settle whether to ring the bells or toll them, and does each by turns, which gives the afternoon an unhinged quality.${E() === 'navy' && !F('edmundDead') ? `

Among the letters is one from Edmund, in a hand that slopes uphill. The Thetis repeated signals and fired hardly a gun. “I saw the Victory go into their line,” he writes, “and was not afraid until afterwards, when I was sick into the hammock nettings, which the boatswain tells me is usual.”` : ''}`,
  choices:[
    {t:'Illuminate the Hall.', note:'£40', go:() => { add({money:-40, standing:3});
      return `A candle in each of your fifty-four windows, a number the window tax had not encouraged you to dwell on. It is very beautiful from the road. Henrietta works out the cost of the wax, aloud, at intervals, until the last one gutters.`; }},
    {t:'Roast a sheep for the village.', note:'£60', go:() => { add({money:-60, goodwill:6});
      return `The sheep is eaten on the common to the health of Lord Nelson, drunk in silence, and then to the confusion of the French, drunk in anything but. The fiddler plays Hearts of Oak nine times. Some of the old men cry, and are not teased for it.`; }},
    {t:'Order the bells tolled, and put the household in black.', go:() => { add({standing:1, family:-1}); if (!F('gallDead')) reg('gall',1);
      return `Hatherley is the only parish for ten miles that mourns before it rejoices. It is thought very proper. It is also thought, by the ringers, to be thirsty work for no beer.`; }}
  ]});

ev({ id:'abolition', fixed:'1807-0', title:'A Petition from the Chapel',
  text:() => { meet('thorne'); meet('pinch');
    return `Mr Wilberforce’s bill to abolish the slave trade is before Parliament at last, after twenty years of trying. The Methodists of Wyvern have drawn up a petition three yards long, which is going round the county like a contagion, and Mrs Thorne has brought it to the Hall in her egg basket.

It is awkward, because ${S.flags.kitty === 'pinch' ? 'your son-in-law Mr Pinch is staying. He' : 'Mr Lumley Pinch of Bristol is staying, on his way to look at a property. Mr Pinch'} has sixty thousand pounds and a sugar estate in Jamaica that he has never seen, and he is sitting in your best chair, eating your walnuts, listening.`; },
  choices:[
    {t:'Sign it, in front of Pinch.', go:() => { fl('signedPetition'); add({standing:2, goodwill:2}); reg('thorne',2,'You signed against the trade with Pinch in the room'); reg('pinch',-4,'You signed the petition under his nose');
      return `You sign at the head of a fresh sheet, in a large hand. Pinch cracks a walnut with great deliberation. “It will make sugar dearer,” he says. “I hope you like your tea bitter.” You find, rather to your surprise, that you do.`; }},
    {t:'Sign it after Pinch has gone up to bed.', go:() => { fl('signedPetition'); add({goodwill:1}); reg('thorne',1);
      return `You sign by candlelight, in the estate office, like a man forging a will. Mrs Thorne watches you do it and then says, “Well, it’s the same ink,” and puts the petition back among the eggs.`; }},
    {t:'Decline. Trade is trade.', go:() => { add({standing:-2}); reg('thorne',-3,'You would not sign against the slave trade'); reg('pinch',2);
      return `Mrs Thorne folds the petition and puts it back in her basket. She says nothing, which from Mrs Thorne is a speech. The bill passes by two hundred and eighty-three votes to sixteen, so your refusal has achieved precisely nothing, except to be remembered.`; }}
  ]});

ev({ id:'election', fixed:['1802-2','1807-1','1812-3'], title:'The Writ for Wyvern',
  text:() => F('mp') ? `Parliament is dissolved and you must be elected again. The owners of Wyvern’s burgage plots, who have not forgotten what you paid them last time, have formed the reasonable expectation of being paid it again, with something added for the rise in the cost of living.

Lord Cullerne’s agent has been seen measuring pigsties.` : `Parliament is dissolved. Lord Cullerne’s nephew Fitzroy, who has sat for Wyvern in perfect silence ${F('cullerneMan') ? 'on your votes' : 'for years'}, is put up again. His lordship sends his compliments and, this time, a turtle, alive, in a tub. It has taken up residence in the scullery and is looking at Mrs Bunce.`,
  choices:[
    {t:'Fight the seat.', note:'£700', if:() => F('mp'), go:() => { add({money:-700});
      if (electionWin() || chance(0.3)) { add({standing:4}); return `You hold Wyvern, by a margin that is nobody’s business. In the chairing you are carried round the market place by six men who drop you once, by the pump, as is traditional.`; }
      fl('mp', false); add({standing:-6});
      return `You lose Wyvern. The plots you counted on were bought from under you at breakfast time, and the new member is a brewer from Reading whom Lord Cullerne finds “biddable”. You are a private gentleman again. Henrietta says she never liked Half Moon Street, in the voice of someone who liked it very much.`; }},
    {t:'Give up the seat and save the money.', if:() => F('mp'), go:() => { fl('mp', false); add({standing:-3, family:1}); reg('cullerne',2,'You gave him back the seat for Wyvern');
      return `You announce that the cares of your estate forbid you to offer yourself again. Nobody believes the reason and everybody approves the result. Lord Cullerne sends a civil note. It is the first civil note in some years.`; }},
    {t:'Vote for Fitzroy and keep the turtle.', if:() => !F('mp'), go:() => { fl('cullerneMan'); add({standing:2}); reg('cullerne',2,'You gave Fitzroy your three votes');
      return `Fitzroy is returned. The turtle is made into soup by a man sent down from London for the purpose, since Mrs Bunce will not go near it, and it is the best thing you have ever eaten. You try not to consider what that says about your politics.`; }},
    {t:'Stand against him.', note:'£900', if:() => !F('mp'), go:() => { add({money:-900});
      if (electionWin()) { fl('mp'); add({standing:10}); reg('cullerne',-3,'You took a seat at Wyvern from his nephew');
        return `You are in, by three votes, after a poll in which a dead man voted twice and was objected to only the second time. You are a Member of Parliament. The turtle, which you had forgotten, is found to have escaped into the carp pond, where it prospers.`; }
      add({standing:-4}); reg('cullerne',-4,'You stood against his nephew and lost');
      return `You are beaten. Nine hundred pounds have gone down the throats of thirty-one electors and their numerous friends, and all you have to show for them is a ribbon and a headache. The turtle is sent back. It seems relieved.`; }},
    {t:'Send the turtle back and stay out of it.', if:() => !F('mp'), go:() => { add({goodwill:1}); reg('cullerne',-2);
      return `The turtle goes home to Cullerne Castle in its tub, with your regrets. Fitzroy is returned without your votes, there being pigsties enough without them.`; }}
  ]});

ev({ id:'clarke', fixed:'1809-0', cond:() => E() === 'army' && !F('edmundDead'), title:'Mrs Clarke’s Tariff',
  text:() => `The whole country is reading the evidence of Mrs Mary Anne Clarke, late mistress to the Duke of York, who has told the House of Commons with great good humour that she sold army promotions from the Duke’s pillow, at so much the rank, and kept a list pinned to the bed curtain.

Edmund is a captain now, home on leave from Corunna and thin as a rake handle. A Mr Dawlish, formerly Mrs Clarke’s man of business and now in trade for himself, has written offering a majority in the 52nd for nine hundred pounds, “the regular channels being at present somewhat crowded”.`,
  choices:[
    {t:'Pay Dawlish his nine hundred.', note:'£900', go:() => { fl('major'); add({money:-900}); reg('edmund',1);
      if (chance(0.35)) { add({standing:-6}); return `Edmund has his majority. In April Dawlish is taken up for fraud and his ledger read out at Bow Street, with your name in it between a bishop’s nephew and a wine merchant. Edmund keeps the rank. You keep the paragraph in the Morning Chronicle, which Lord Cullerne has kindly cut out and sent you.`; }
      return `It is done within the month, on paper as smooth as butter. Major ${S.sur}. Edmund does not ask how, and you do not say. He looks at the Gazette for a long time and then goes out to look at the horses, which is what he does when he would otherwise have to say something.`; }},
    {t:'Burn the letter. He shall rise by merit or not at all.', go:() => { add({standing:1}); reg('edmund',chance(0.5) ? 1 : -1);
      return `You burn it. Edmund, told, says “Quite right, sir,” and then, a minute later, “Harry Tamworth got his for seven hundred.” He goes back to Portugal a captain, with four shirts of Henrietta’s making and a cheese.`; }},
    {t:'Send the letter to the Horse Guards.', go:() => { add({standing:3}); reg('edmund',-1,'Thinks you made him conspicuous at the Horse Guards');
      return `A colonel writes to thank you in terms that suggest you have done something slightly ill-bred. Dawlish is arrested. Edmund is known in his mess, for a season, as the officer whose father peached, and has to fight nobody over it only because everyone is too tired.`; }}
  ]});

ev({ id:'jubilee', fixed:'1809-3', title:'Fifty Years a King',
  text:() => `The King enters the fiftieth year of his reign. He is blind, and it is whispered that his wits are going the way they went in 1788, but the country has resolved to celebrate him as if he were a large and well-loved pudding. Every parish in England is roasting an ox. Wyvern is roasting two, to spite Newbury.

Hatherley looks to you.`,
  choices:[
    {t:'Roast an ox on the common.', note:'£80', go:() => { add({money:-80, goodwill:8});
      return `The ox goes round on its spit from four in the morning, attended by every dog in the parish and a committee of experts who agree about nothing. By evening it is black without and raw within, the correct condition for a jubilee ox, and is eaten with perfect happiness by people who last tasted beef at Easter. There is a bonfire, a fiddler and a fight, in that order.`; }},
    {t:'Give a dinner to the county instead.', note:'£130', go:() => { add({money:-130, standing:5, goodwill:-2}); reg('cullerne',1);
      return `Forty sit down in the long gallery under a transparency of His Majesty that Kitty’s old drawing master has painted on a bed sheet. Lit from behind, the King appears to be peering through a hedge. Nineteen toasts are drunk. The village, who can smell the dinner, drink one of their own.`; }},
    {t:'Release the parish debtors from Wyvern lock-up, as the King asks.', note:'£45', go:() => { add({money:-45, goodwill:5, standing:2});
      return `For forty-five pounds you buy out seven debtors, among them a baker who owed four pounds and has been confined eleven months, at a cost to the parish of nine. He walks home to Hatherley very slowly, looking at everything. It was the King’s own suggestion, and it is the one part of the Jubilee that anybody will remember without a headache.`; }}
  ]});

ev({ id:'ludd', fixed:'1812-1', title:'A Letter Signed by General Ludd',
  text:() => `Wheat is at a hundred and twenty-six shillings, the dearest in the memory of man. A letter has been pushed under the door of the estate office, written in capitals on a leaf torn from a hymn book.

It observes that ${F('thresher') ? 'you have set up a threshing machine in the great barn' : 'you have been seen at Mr Hartopp’s, admiring his new threshing machine, and are said to have ordered its fellow'}; that such a machine does in a week what twelve men do with flails in a winter; and that the men of Hatherley have no other winter work. It ends: “Sir we are not Jackobins we are onely hungry. We will have our Bread or we will have your Barn. Genl Ludd.” The spelling is Jem Pryor’s. The hymn is Number 40.`,
  choices:[
    {t:() => F('thresher') ? 'Take the machine down.' : 'Cancel the order.', go:() => { if (F('thresher')) { fl('thresher', false); S.improve = Math.max(0, S.improve - 1); } add({goodwill:7, standing:-1}); reg('hartopp',-2,'Thinks you surrendered to a hymn book'); reg('pryor',2,'You gave up the threshing machine');
      return `Flails are heard in the great barn again all winter, a sound like slow applause. Hartopp tells you that you have set agriculture back a generation. You have, and twelve families eat because of it. The hymn book in the third pew is found to have had its missing leaf pasted back in.`; }},
    {t:'Keep the machine and set a guard on the barn.', note:'£60', go:() => { if (!F('thresher')) { fl('thresher'); S.improve++; } add({money:-60, goodwill:-10, standing:2}); reg('pryor',-2,'You set a guard over the machine'); later('rickFire', 2);
      return `Mudge and two men from Wyvern sit up in the barn with blunderbusses and a dog. The machine threshes forty quarters a day, clanking like a ghost in a foundry. In the cottages the flails hang on their nails, and the men who used them stand at the corner by the Bell with their hands in their pockets, which is the most dangerous posture known to the English labourer.`; }},
    {t:'Keep the machine, and keep the twelve men on at winter wages.', note:'£180', go:() => { if (!F('thresher')) { fl('thresher'); S.improve++; } add({money:-180, goodwill:4}); reg('hartopp',1); reg('pryor',1);
      return `The machine threshes; the men hedge, ditch, and mend the Kintbury road, which has wanted it since Queen Anne. Hartopp calls it sentimental arithmetic. Jem Pryor is seen in church for the first time in a decade, sharing a hymn book, and singing Number 40 with great feeling.`; }}
  ]});

ev({ id:'bumper', fixed:'1813-2', title:'A Harvest Too Good',
  text:() => `For the first time in ten years the summer is kind. The wheat stands so thick on Long Barrow that a dog could walk on it. Unhappily every farmer in England has had the same summer, and the price that touched a hundred and twenty-six shillings last year is falling like a stone down a well.

Your tenants took their leases at war prices. They have begun to do sums on the backs of their hands.`,
  choices:[
    {t:'Tell them now that you will look at the rents if prices keep falling.', go:() => { fl('abatePromised'); add({goodwill:6});
      return `It is a promise with no figure in it, which is the best sort to make and the worst to receive, but the farmers go home easier. They have it from your own mouth, at the audit dinner, before witnesses and a round of beef.`; }},
    {t:'Say nothing. A lease is a lease.', go:() => { add({goodwill:-3});
      return `You say nothing. The farmers get in the greatest harvest of their lives, sell it for less than the poorest, and look at you across the audit table as men look at a clock.`; }}
  ]});

ev({ id:'peace', fixed:'1814-1', title:'The Sovereigns in London',
  text:() => `Bonaparte has abdicated and gone to rule Elba, an island about the size of a large parish. The Emperor of Russia and the King of Prussia are come to London, and with them Marshal Blücher, who is seventy-one, smells of gin and onions, and is kissed in the street by so many women that his aides stand before him in shifts.

Henrietta observes that the Tamworths have taken a house in Brook Street for the summer.`,
  choices:[
    {t:'Take a house in town for the celebrations.', note:'£600', go:() => { add({money:-600, standing:5, family:7}); reg('henrietta',2);
      return `You see the Tsar at the opera, the King of Prussia at a window, and Blücher being carried bodily into Carlton House by a crowd that has taken his horses out. In the Green Park there is a Chinese pagoda that spouts fireworks, catches fire, and falls into the canal with two lamplighters. London agrees it is the finest thing in the whole peace.`; }},
    {t:'Feast the village on the common.', note:'£70', go:() => { add({money:-70, goodwill:6});
      return `Four hundred sit down at trestles to beef and plum pudding, and Bonaparte is burnt in effigy, stuffed with squibs. He burns extremely well. The children are a little sorry; he has been a great part of their upbringing.`; }},
    {t:'Stay home. It will not last.', go:() => { add({family:-4}); reg('henrietta',-1);
      return `You stay at home, predicting that he will be back within the year. Henrietta says you are impossible. You are, in fact, correct, to within a fortnight, and it is no comfort to anybody.`; }}
  ]});

ev({ id:'abatement', fixed:'1814-2', title:'Eleven Sunday Coats',
  text:() => { meet('thorne'); const sp = F('nephewFarm') ? 'old Farmer Dewey, the only one among them who can add' : 'Mrs Thorne, on the ground that she is the only one among them who can add';
    return `Wheat is down to seventy-four shillings and still going. Your tenants have come up to the Hall in a body, in their Sunday coats, which is the most alarming thing a tenantry can wear.

They have chosen as spokesman ${sp}. The case is short. They took their farms when wheat stood above a hundred; at this price half of them will be sold up by Lady Day. ${F('abatePromised') ? 'They remind you, respectfully, of what you said at the audit dinner. ' : ''}They ask a fifth off the rents.`; },
  choices:[
    {t:'Grant the fifth.', go:() => { fl('abated'); S.rentAdj *= 0.8; add({goodwill:11, standing:-1}); reg('thorne',2,'You took a fifth off the rents in the bad year');
      return `You grant it. Eleven Sunday coats breathe out together. It will cost you four hundred a year, and it will mean that when the bailiffs go through the county next spring, as they will, selling up farmers by the dozen, they drive straight past the Hatherley turning.`; }},
    {t:'Grant a tenth, and let the Michaelmas arrears stand over.', go:() => { fl('abatedHalf'); S.rentAdj *= 0.9; add({goodwill: F('abatePromised') ? 2 : 5}); reg('thorne',1);
      return `A tenth, and time to pay. It is received as half a loaf is received: eaten, and the missing half discussed all the way home.`; }},
    {t:'Refuse. They signed.', go:() => { add({goodwill: F('abatePromised') ? -16 : -11, standing:1}); S.rentAdj *= 0.93; reg('thorne',-2,'You refused the tenants in the fall of 1814'); reg('cullerne',1);
      return `You refuse. By Christmas two of the eleven have gone in the night, one of them leaving the key on a nail and a note of what he owed, exact to the farthing, with nothing enclosed. Their farms stand empty. Thistles pay no rent, and seed generously over the neighbours.`; }}
  ]});

ev({ id:'cornLaw', fixed:'1815-0', title:'The Corn Bill',
  text:() => `Peace has brought cheap corn, and cheap corn has brought the landed interest out in a cold sweat. A bill is before Parliament to forbid the landing of foreign wheat until English wheat reaches eighty shillings: the price of the poor man’s loaf to be held up by statute for the benefit of the rich man’s rent.

Lord Cullerne calls it the wisest measure since Magna Carta. In London the mob has broken the windows of every member known to favour it, and the Commons sit behind a hedge of bayonets. ${F('mp') ? 'You have a vote.' : 'Two petitions lie at the George in Wyvern, one each way, awaiting the names of the gentry.'}`,
  choices:[
    {t:() => F('mp') ? 'Vote for the bill.' : 'Sign for the bill.', go:() => { fl('cornFor'); add({standing:3, goodwill:-7}); reg('cullerne',2,'You stood with the land on the Corn Bill'); reg('pryor',-1);
      return F('mp') ? `You vote with the majority, and walk out of the House between two files of Life Guards while a man in the crowd holds up a loaf on a pole, draped in black. Your windows in Half Moon Street are broken that night. They were the landlord’s windows, but the principle is the same.` : `You sign among the land. The bill passes. In Hatherley the loaf stays dear, and they know why, and they know whose name was third on the sheet under Lord Cullerne’s.`; }},
    {t:() => F('mp') ? 'Vote against it.' : 'Sign against it.', go:() => { fl('cornAgainst'); add({standing:-3, goodwill:7}); reg('cullerne',-3,'You went against the land on the Corn Bill'); reg('pryor',1);
      return F('mp') ? `You vote in a minority of seventy-seven, most of them members for manufacturing towns, who look at you, a Berkshire squire, as a temperance meeting would look at a publican come to sign the pledge. The bill passes regardless. Lord Cullerne does not cut you in the lobby. He looks through you, which takes longer.` : `Yours is the only name on that sheet with “Esquire” after it; the rest are bakers, Methodists and a staymaker. The bill passes regardless. Lord Cullerne tells the Tamworths you have “gone over to the loaf”.`; }},
    {t:() => F('mp') ? 'Be unavoidably detained in the country.' : 'Sign neither.', go:() => { add({standing:-1});
      return `You do nothing, at some length. The bill passes without you, as bills generally will.`; }}
  ]});

ev({ id:'waterloo', fixed:'1815-1', title:'The Gazette Extraordinary',
  text:() => `On the twenty-second of June the news comes up the Bath road at the speed of a galloping horse: a battle near Brussels, three days of it, the French army destroyed and Bonaparte in flight. Wyvern rings its bells until one of them cracks.

The lists of killed and wounded follow more slowly, in the Gazette, in small type.${E() === 'army' && !F('edmundDead') ? ` The 52nd was in the line on the ridge. Henrietta has taken the paper from the post-boy herself and cannot open it.` : ''}`,
  choices:[
    {t:'Read the lists.', if:() => E() === 'army' && !F('edmundDead'), go:() => {
      const r = Math.random();
      if (r < 0.2) { fl('edmundDead'); fl('edmundFate','killed at Waterloo'); add({family:-25, standing:4}); reg('henrietta',-1);
        return `${F('major') ? 'Major' : 'Captain'} ${S.sur}, 52nd Foot. Killed. He fell in the last half hour, when the regiment wheeled out of the line and broke the flank of the Imperial Guard; the colonel writes that it was instantaneous, as colonels always write. His sword comes home in August, with his watch, eleven shillings and a letter to his mother, begun and not finished. Henrietta does not put on colours again.`; }
      if (r < 0.6) { fl('edmundFate','lost an arm at Waterloo'); add({family:6, standing:4}); reg('edmund',1);
        return `Wounded, severely. Six weeks later Edmund gets down from the Bath coach with an empty left sleeve pinned across his chest and an ease about him that he never had with two arms. “The surgeon took it off in a farmyard,” he says at dinner. “He was very quick. He asked if I wanted it, afterwards, and I could not think what for.” Henrietta cuts up his meat, and for once he lets her.`; }
      fl('edmundFate','came through Waterloo without a scratch'); add({family:10, standing:4}); reg('edmund',1);
      return `His name is not there. You read the column three times to make sure, moving a finger down it like a child. A letter comes on the ninth day. The 52nd broke the Guard; he had two horses killed under him and a ball through his hat. “I am perfectly well,” he writes, “but pray send a hat.”`; }},
    {t:'Ring the bells and broach a hogshead on the common.', note:'£50', if:() => !(E() === 'army' && !F('edmundDead')), go:() => { add({money:-50, goodwill:5, standing:1});
      return `Twenty-two years of war, and it ends on a Thursday. The hogshead is empty by dusk. Old soldiers who lost legs at Alexandria and Talavera are carried round the common in chairs, and the children, raised on Boney, ask who will come for them now if they do not go to sleep.`; }},
    {t:'Open a subscription for the widows.', note:'£100', if:() => !(E() === 'army' && !F('edmundDead')), go:() => { add({money:-100, standing:4, goodwill:2});
      return `The Waterloo Subscription raises half a million in the kingdom, and forty-one pounds in Hatherley beyond your hundred, much of it in coppers. Three Hatherley men were in the battle. Two come home.`; }}
  ]});

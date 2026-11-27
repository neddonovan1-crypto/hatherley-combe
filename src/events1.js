/* Henrietta at the Hall, or at Bath: hh(home, away) picks the reading for dated papers. */
const hh = (home, away) => F('henriettaAway') ? away : home;
/* The fixed calendar: what history brings to the door, and when. */
const EVENTS = [];
const ev = e => EVENTS.push(e);
const K = () => S.flags.kitty || 'free';
const E = () => S.flags.edmund || null;
const kittyAge = () => 17 + (S.year - 1795);

ev({ id:'speen', fixed:'1795-0', title:'The Pelican at Speen',
  text:() => `The magistrates of Berkshire are met at the Pelican at Speen upon the sixth of May; and, as no business of the county was ever yet opened upon an empty stomach, they sit down first to a turbot.

The business lies on a half-sheet beside every plate, and is soon read. Wheat stands at seventy-five shillings the quarter; the quartern loaf is elevenpence in Newbury market; and a labourer in this county, when he can find a master, has eight shillings a week with which to buy it. Dr Gall, who drew up the paper and who knows his company, waits until the fish has been carried out before he rises.

“Gentlemen, I shall not ask the farmer for a penny. Let wages lie where they are; and let the parish make up each family from the rates, by a table. When the gallon loaf is a shilling, three shillings to the man, and eighteenpence for every mouth he feeds; and as the loaf rises, so shall the table.” He holds his paper out over the cloth. “Who is with me?”

Nobody stirs. The Doctor, having looked along his own side of the table without finding an eye that will meet his, turns his whole body about in his chair until it faces you.

“Mr ${S.sur}?”`,
  choices:[
    {t:'Second him.', go:() => { fl('speen'); add({goodwill:4, standing:1}); reg('gall',2,'You seconded his bread scale at Speen');
      return `“Seconded.” The show of hands is over in less time than the carving took, and a clerk is called in to copy the table fair for the Reading Mercury.

Mr Hartopp, who was never known to waste either a pencil or a shilling, has the first of these out before the cheese comes. He writes upon the back of his half-sheet, turns it about, and pushes it across the cloth to you: “Parish makes a man up to 9s. I pay him 6s. Parish finds 3s.” Beneath this he has ruled a line; and beneath the line, in a larger hand, “Why pay 6?”

Your name goes up to Reading the second upon the list.`; }},
    {t:'Stand. Move that the bench fix a wage by the price of bread, and pay it at Hatherley yourself.', go:() => { fl('wages'); add({goodwill:9, standing:-3}); reg('gall',-1); reg('hartopp',-1,'Thinks your wages will ruin him'); reg('pryor',1);
      return `You rise, and tell the bench that under the statute of Elizabeth it has the power to fix a wage; that it ought to fix one by the price of bread; and that the farmer who hires a man, and not the parish which never sent for him, should have the feeding of him.

“Ruin,” says Hartopp, before you are well seated. A voice lower down the table enquires whether Mr ${S.sur} holds shares in Whitbread’s brewery; and Dr Gall, who would not for the world be thought uncivil to a neighbour, puts your motion to the vote, upon which three hands go up.

On Monday you raise every man at Hatherley to nine shillings. On the Sunday following there are faces in church from Kintbury and from Inkpen which were never seen there before; and it is soon plain, from the quarter to which they are turned throughout the sermon, that they have walked over to look at you.`; }},
    {t:'Help yourself to the turbot.', go:() => { add({goodwill:-3, standing:1});
      return `You help yourself to the turbot; and the table, having waited a decent interval to learn whether you mean to speak, is carried without you.

In the yard afterwards, under the open window of the taproom, your horse is brought round by an ostler whom you do not know. He holds the stirrup with great attention; but it is not until you are in the saddle, and looking down at him, that he recollects to touch his hat.`; }}
  ]});

ev({ id:'flour', fixed:'1795-1', title:'The Old Price',
  text:() => `It is market day at Wyvern, and you hear the business from the bridge before you can see it.

Pocock’s cart stands stopped in the corn market with its tailboard down, and a dozen women of Hatherley have his sacks open upon the cobbles. Sukey Pryor, with the peck measure in one hand and her youngest upon her hip, is crying “Old price! Old price and honest measure!”; while a girl of ten, who has been set to take the money, carries each coin across to the miller as it is paid, and drops it into his hat.

Pocock holds the hat in both hands, having found himself unable either to set it down or to put it on. He sees you over the heads.

“Mr ${S.sur}! You are a magistrate, sir! I call on you!”

The selling stops. Sukey Pryor looks at you, and keeps hold of the measure.`,
  choices:[
    {t:'Read the Riot Act and send for the Volunteers.', go:() => { fl('riotAct'); add({standing:3, goodwill:-10}); reg('pryor',-2,'You read the Riot Act at his wife'); reg('gall',1);
      return `You mount the steps of the Corn Exchange, take off your hat, and read: “Our Sovereign Lord the King chargeth and commandeth all persons, being assembled, immediately to disperse themselves.” The whole is got through in less than a minute; but your voice, which has carried you safely past the King, gives way at “habitations”.

The law allows them one hour; and as not a woman offers to go, and the selling begins again faster than before, you are left to stand upon the steps for fifty minutes of it with the Act in your hand.

At ten minutes to the hour the Volunteers trot in, to find the cobbles white, the sacks folded upon the cart, and Pocock counting. Sukey Pryor walks past the steps with her flour upon her head and the child asleep.

“Good day, sir.”

It is the last time that week that anybody from Hatherley says as much to you.`; }},
    {t:'Buy the whole cart yourself and let them carry on.', note:'£140', go:() => { add({money:-140, goodwill:8, standing:-2}); reg('cullerne',-1,'Thinks you bought off a mob'); reg('pryor',1,'You paid for his wife’s flour');
      return `“What is the load worth today, Pocock?” He tells you. “And at the old price?” He tells you that likewise; and you write him a draft upon Tidmarsh’s bank for the difference: one hundred and forty pounds.

Pocock folds the paper small, and puts it inside his coat without thanking you. The women give you three cheers, and go back to the sacks.

Before the George stands Lord Cullerne’s groom, holding a horse, who has watched the whole from the beginning; and as he has the better beast and the shorter road, he will be at the Castle before you are home.`; }},
    {t:'Take Pocock aside and mention his lease.', go:() => { fl('millerCowed'); add({goodwill:4, standing:1});
      return `You get down, take Pocock by the elbow, and walk him ten yards off to the pump, where you ask him when his lease falls in.

“Michaelmas, sir.”

“So I thought. It is a pretty mill.”

He considers the pump for some time. Then he walks back to his cart. “Old price,” he tells the women. “This week. Out of Christian feeling.” And as nobody appears to have heard the last part of it, he says it a second time, and louder.

That evening he drives home past your gate with his eyes fixed upon the horse.`; }}
  ]});

ev({ id:'powder', fixed:'1795-2', title:'A Guinea a Head',
  text:() => `The collector’s paper comes with the morning post: “Certificate for Using Hair Powder. One Guinea”; and one certificate, it appears, is wanted for every powdered head in the house.

You count heads at breakfast. ${hh(`Henrietta has worn powder every day since she was twelve, and would as soon come down without her gown.`, `Henrietta is at Bath, and must take out her own there.`)} Edmund, who has not had his hair dressed this week, wishes it cut short, in the manner of the Duke of Bedford’s friends. By the sideboard stand the two footmen, both of whom are called John, and both of whom are white to the collar.

${hh(`Henrietta puts down her cup. “Well?”`, `The collector’s man is waiting in the hall.`)}`,
  choices:[
    {t:'Pay for every head in the house, footmen and all.', note:'8 guineas', go:() => { add({money:-9, standing:3, family:2}); reg('henrietta',1);
      return `You send to Wyvern with eight guineas, and eight certificates come back.

On Sunday, by order, the names of all who have paid are pasted upon the church door; where yours stands at the head of the list, and the footmen at the foot of it, entered as “John” and “John”.

The Morning Chronicle has found a name for those who pay, and Edmund reads it out at dinner. “Guinea-pigs.” ${hh(`Henrietta desires him to leave the table.`, `The Johns look at the ceiling.`)}`; }},
    {t:'Crop the lot of you.', go:() => { add({family:-4, standing:-2}); reg('henrietta',-2,'You cropped her footmen'); reg('edmund',1); reg('cullerne',-1); reg('hartopp',1);
      return `The barber walks up from Wyvern with his scissors, and does Edmund first, then you, and then the Johns in the scullery; after which he sweeps up as much hair as would stuff a bolster, and asks whether he may keep it.

Edmund passes the afternoon before the hall glass. Hartopp rides over, looks at you, and says “Sensible”; but on Thursday Lord Cullerne, meeting you in the street at Wyvern, does not appear to know who you are.

${hh(`Henrietta has her dinner sent up for three days, and on the fourth comes down in a turban.`, `Mrs Tamworth writes the whole of it to Gay Street; and by the Friday coach there comes a parcel from Bath, which is found to contain a nightcap.`)}`; }},
    {t:'Pay for Henrietta. Shear everyone else.', note:'1 guinea', go:() => { add({money:-1, family:1});
      return `One guinea; one certificate: “Mrs ${S.sur}, Hatherley Combe.”

The barber shears the rest of you on Saturday. The younger John is found crying in the scullery, and is given a jam tart by Mrs Bunce.

${hh(`At church Henrietta sits at the end of the pew with her head high and white, and everybody else in it has cold ears.`, `The certificate goes to Gay Street by the post; and on Sunday everybody in the Hall pew has cold ears.`)}`; }}
  ]});

ev({ id:'fenn', fixed:'1795-3', title:'A Citizen at the Bell',
  text:() => `There is a new man at the Bell: one Absalom Fenn, a shoemaker, who has walked down from London with a pack upon his back, and in the pack nothing but pamphlets.

Every evening at seven he gets upon a settle and reads Tom Paine to the carters. He reads slowly; and whenever he comes to a long word he stops, and tells them what it means.

Crabbe, who has been down to look, stands in your library with his notebook open.

“The new Act says fifty, sir. Fifty persons at a political meeting, and they must have a magistrate’s licence. I counted forty-nine. I counted on three nights.” He turns a page. “Forty-nine each night. The fiftieth waits in the yard.”`,
  choices:[
    {t:'Have Fenn taken up as a seditious person.', go:() => { fl('fennTaken'); add({standing:3, goodwill:-5}); reg('gall',2,'You gaoled the shoemaker'); reg('cullerne',1);
      return `The constable takes Fenn at the Bell on Friday, off the settle, with the book in his hand; and he goes to Reading gaol in the carrier’s cart. Dr Gall shakes your hand after church.

But as the evidence consists of forty-nine men and a printed book, the Grand Jury throws out the bill.

Fenn walks back into Hatherley upon a Tuesday, and the carters stand him his beer. A boy asks him what “seditious” means; upon which he climbs on the settle, and tells them.`; }},
    {t:'Go down to the Bell and argue with him.', go:() => { fl('fennDebate'); add({goodwill:5, standing:-2}); reg('cullerne',-1); reg('pryor',1,'Saw you argue with Fenn and pay for the beer');
      return `You walk down to the Bell at seven and take the chair by the fire. Fenn nods to you and goes on reading; and when he stops, you answer him.

You give them the Constitution, in its three parts, of King, Lords and Commons. Fenn, in return, gives them your uncle: his rents, his game, his three votes in Wyvern, and the year in which he stopped the footpath to the mill; for every one of which he is provided with the date.

It lasts two hours, at the end of which the carters decide for Fenn, and you pay for the beer, to the number of forty-nine pots. Jem Pryor, from the corner, lifts his to you.`; }},
    {t:'Buy every copy of Paine in Wyvern and burn them.', note:'£15', go:() => { add({money:-15, standing:1});
      return `Mr Gosling the bookseller has nineteen copies of the Rights of Man, for which he asks fifteen pounds the lot; and you pay it.

On Saturday night you burn them upon the green. Most of the parish comes to see it done; and Fenn comes with the rest, and warms his hands.

On Monday Gosling’s boy is at the coach office with a letter for London, in which the order is for forty.`; }}
  ]});

ev({ id:'edmundFuture', fixed:'1796-0', title:'Edmund Wishes to Be Useful',
  text:() => `Edmund has the Gazette propped against the coffee-pot, and has eaten nothing since he opened it.

“General Bonaparte is twenty-six, sir; and he has beaten the Austrians twice in one week.”

“And how old are you?”

“Twenty.” He folds the paper. “I should like a commission.”

${hh(`Henrietta sets down the teapot. “Dr Gall is an old man, Edmund, and the living is in your father’s gift. Three hundred a year and the vicarage; and you might ride over to dinner whenever you chose.”

They both look at you.`, `From under his saucer he draws a letter in his mother’s hand, dated from Gay Street, and turns it about for you to read. “Dr Gall is an old man, and the living is in your father’s gift. Three hundred a year and the vicarage; and you might ride over to dinner whenever you chose.”

He waits.`)}`,
  choices:[
    {t:'Buy him an ensigncy in the 52nd Foot.', note:'£450', go:() => { fl('edmund','army'); add({money:-450, family:-1}); reg('edmund',3,'You bought him his colours'); reg('henrietta',-2,'You sent her son to the wars');
      return `Four hundred and fifty pounds go to Mr Cox, the army agent in Craig’s Court; and a month afterwards the Gazette has it: “52nd Foot. Edmund ${S.sur}, Gent., to be Ensign, by purchase.”

The coat comes down from London in a box. Edmund puts it on in the hall, and looks at it first in the drawing-room glass, and next in the glass upon the stairs; and is at last discovered by Mrs Bunce in the dairy, standing before the small square one.

${hh(`Henrietta does not come down to see it.`, `He writes to Bath to say how well it fits; and Gay Street returns no answer.`)}`; }},
    {t:'Write to Captain Holloway for a berth in his frigate.', go:() => { fl('edmund','navy'); add({family:-1}); reg('edmund',2,'You got him to sea'); reg('henrietta',-2,'You sent her son to sea');
      return `You write to Captain Holloway of the Thetis, thirty-two guns, who served with your uncle; and within the week you have his answer from Portsmouth.

“Sir, Send him. He is six years too old and will be ordered about by children. Good. Holloway.”

Edmund reads it three times, and packs the same night. ${hh(`Henrietta sews his name into eleven shirts, and does not once speak to you while she is about it.`, `Eleven shirts come from Bath with his name sewn into them, and no line for you.`)}`; }},
    {t:'Steer him into the Church.', go:() => { fl('edmund','church'); add({family:1}); reg('edmund',-3,'You steered him into the Church'); reg('henrietta',3); reg('gall',-1,'Dislikes being reminded he is mortal');
      return `Edmund goes up to Oriel to read for orders. He shakes your hand at the coach door, and looks, while he does it, at the coachman.

He writes every Sunday: the weather at Oxford, the text of the sermon, and his duty to his mother; and every letter covers one side of the sheet exactly.

${hh(`Henrietta keeps them in her work-box. Dr Gall`, `A second letter goes by the same post to Gay Street, and covers both sides. Dr Gall`)}, who has heard for what purpose the boy was sent, stops you at the vestry door to ask whether you find him looking ill.`; }},
    {t:'Keep him at home to learn the estate.', go:() => { fl('edmund','home'); add({family:2}); reg('edmund',-1); reg('henrietta',2);
      return `“You will stay here and learn the estate.”

“Yes, sir.”

He rides the farms; he learns to know a sound ewe from a rotten one, and a tenant who pays from a tenant who explains. ${hh(`Henrietta has his chair moved nearer to her own at dinner.`, `A letter from Bath directs that his chair be moved to the foot of the table.`)}

In the evenings he is in the gun room. You look in at eight, and find him cleaning a fowling piece; you look in again at ten, and it is the same fowling piece, with the Gazette lying open upon the bench beside it.`; }}
  ]});

function electionWin(){ return chance(clamp((T('silver') ? 0.5 : 0.3) + (S.standing - 40) / 110 + (S.goodwill - 50) / 250, 0.1, 0.85)); }

ev({ id:'election96', fixed:'1796-1', title:'Burgage Votes',
  text:() => `A cart from Cullerne Castle stands at the kitchen door, with a haunch of venison in it under a cloth, and a groom beside it with a note.

“Lord Cullerne’s compliments to Mr ${S.sur}. Parliament is dissolved. His lordship’s nephew, Mr Fitzroy Bligh, offers himself for Wyvern. His lordship feels sure of Mr ${S.sur}’s three votes.”

Wyvern returns two Members to Parliament; and the right of choosing them goes with one-and-thirty old burgage plots in the town, the greater part of which are at present occupied by pigs. Lord Cullerne is owner of fourteen. Your uncle bought three.

The groom is waiting; and Mrs Bunce has her hand upon the haunch.`,
  choices:[
    {t:'Eat the venison. Vote for Fitzroy.', go:() => { fl('cullerneMan'); add({standing:3}); reg('cullerne',3,'You ate his venison and voted his nephew in');
      return `“Thank his lordship.” Mrs Bunce carries the haunch indoors.

As there is no other candidate, there is no poll; and at noon Mr Fitzroy Bligh is declared at the Town Hall, where he thanks the electors in four sentences, all four of which he reads from a card.

On Friday a card of another kind comes from the Castle, for dinner upon the fourteenth. It is the first in three years.`; }},
    {t:'Stand yourself.', note:'£900 in beer, ribbons and inducements', go:() => { add({money:-900});
      if (electionWin()) { fl('mp'); S.mpWins = 1; S.mpSince = 1796; add({standing:10}); reg('cullerne',-3,'You beat his nephew at Wyvern'); reg('henrietta',2);
        return `The haunch goes back; and you send to Tidmarsh’s bank for nine hundred pounds, to be laid out in beer at the George, in blue ribbons, and in eleven conversations held in back kitchens.

The poll is taken on Thursday: for yourself, sixteen; for Mr Bligh, fifteen. Six men carry you round the market place in a chair.

You are Member for Wyvern. ${hh(`Henrietta orders a London gown the same evening.`, `Henrietta orders a London gown from Bath by the next post.`)} The Castle gates are shut when you drive past.`; }
      S.mpBeat = 1796; add({standing:-4}); reg('cullerne',-4,'You stood against his nephew, and lost');
      return `The haunch goes back; and you send to Tidmarsh’s bank for nine hundred pounds, to be laid out in beer at the George, in blue ribbons, and in eleven conversations held in back kitchens.

On the morning of the poll Lord Cullerne’s agent takes his breakfast at the Bell; and two of your eleven are observed to take theirs with him.

For yourself, fourteen; for Mr Bligh, seventeen. On Saturday, nobody having thought it worth his trouble to take them down, your ribbons are still flying in the market place.`; }},
    {t:'Send the venison back.', go:() => { add({standing:-1, goodwill:2}); reg('cullerne',-3,'You returned his venison');
      return `“Take it back to the Castle, with my compliments. I have venison of my own.”

The groom looks at Mrs Bunce, who takes her hand away; and he covers the haunch and drives off.

Mr Bligh is returned on Thursday without your votes. At Quarter Sessions Lord Cullerne takes the chair, and contrives, through the whole of a long day, not to see you.`; }}
  ]});

ev({ id:'bank', fixed:'1797-0', title:'Paper and Gold',
  text:() => `The coach brings two pieces of news together: that the French have landed in Wales, and that the Bank of England has left off paying in gold.

By noon there is a line of people before Tidmarsh’s bank at Wyvern, reaching down the High Street as far as the pump: shopkeepers, farmers’ wives, and the saddler in his apron, every one of them with a fistful of Tidmarsh’s notes.

Your own money is in that house, and so is the estate’s.

At an upstairs window the blind is seen to move. Mr Tidmarsh is looking down upon the line; and he is counting it.`,
  choices:[
    {t:'Join the queue and get your gold out.', go:() => { fl('ranOnBank'); fl('bankFailed'); add({standing:-4, goodwill:-5});
      return `You take your place, and are an hour in reaching the counter; where the clerk pays you in guineas, by weight, with hands that shake upon the scales.

You come out with both coat pockets so full that they drag the coat from your shoulders; and the whole line watches you walk to your horse. More people join the end of it.

Tidmarsh puts up his shutters at four o’clock, when the saddler is nine places from the door.`; }},
    {t:'Stand on the bank steps and declare you will take Tidmarsh’s paper.', go:() => { fl('backedBank'); add({standing:6, goodwill:3}); later('bankFate', 2);
      return `You mount the steps of the bank, and turn about.

“My money is in this house, and in this house it stays. I will take Mr Tidmarsh’s paper for any debt that is owed to me, today or any day.”

Nobody cheers. But the saddler, after looking for some time at his notes, puts them into his apron pocket and goes back to his shop; others follow him; and by two o’clock the line is reduced to six.

Tidmarsh comes down, and holds your hand in both of his. You ride home without having seen, then or at any time, the inside of his strong-room.`; }},
    {t:'Stay at home and read Cowper.', go:() => { add({standing:-1});
      return `You stay in the library with the door shut.

At dusk Mudge brings the story back from Wyvern. It seems that at one o’clock a farmer from Lambourn got up on a cart, and called out that he would take Tidmarsh’s paper at its full value from any man there; and that within the hour the line had broken up.

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
  text:() => `The Mercury has it upon the front page: the fleet at the Nore has run up the red flag. The ships are printed in a column, and the Thetis is the ninth name down.

${hh(`Henrietta reads the column twice, and goes to the window; and at that window, with very little intermission, she remains for ten days.`, `You cut out the column and send it to Gay Street; and for ten days Henrietta writes by every post, each letter containing one question, and the same.`)} On the eleventh the post-boy brings a letter in Edmund’s hand, for which you pay eightpence at the door.

“Sheerness, Sunday night.

My dear Father, I am on shore and not hurt. Tell my mother first.

They sent the officers out of the ship on Friday, and nobody was struck. The cook has the command of her; and he carried my chest to the side himself, and begged I would mind the wet step. The men ask for a shilling a day, and for sixteen ounces to the pound from the purser, who gives them fourteen and keeps two. That is the whole of what they want. I have turned it over for two nights together, and I cannot make them wrong.

Burn this. Captain Holloway dines with people you know.

Your dutiful son, Edmund.”`,
  choices:[
    {t:'Write to the Admiralty. Ask mercy for the men.', go:() => { add({standing:-2}); reg('edmund',2,'You wrote to the Admiralty for his shipmates');
      return `You write to Lord Spencer at the Admiralty, and have your answer from a clerk: “Sir, I am commanded by their Lordships to acknowledge the receipt of your letter.”

The red flags come down in June. Richard Parker is hanged at the yardarm of the Sandwich, and eight-and-twenty follow him; the cook of the Thetis is flogged round the fleet, and lives.

Edmund’s next letter is about a gale off the Texel, and says nothing of yours; but it is signed “Your affectionate son”.`; }},
    {t:'Write to Edmund. Mutiny is mutiny.', go:() => { add({standing:1}); reg('edmund',-1);
      return `You fill four sides: duty; the King; what your uncle would have said. You copy it fair, and send it.

The answer is one side long. The wind has been in the east; he has had a cold; and he is, sir, your obedient son.

Parker is hanged in June with eight-and-twenty others; and in the same month Parliament votes the seamen their shilling.`; }}
  ]});

ev({ id:'defence', fixed:'1798-1', title:'In Case of the French',
  text:() => `A printed schedule has come down from the Lord Lieutenant, ruled in eleven columns.

If the French should land, every parish is to drive its cattle inland, to break its mills, and to burn its ricks; and Reading desires, in the mean time, to be informed what Hatherley has of oxen, sheep, wagons, spades, axes, and men between fifteen and sixty. Each man is to be entered under one of three heads: pioneers, guides, or “to remove live stock and destroy”.

${F('crabbeGone') ? 'Lark has ruled a sheet in readiness, and sharpened two pens.' : 'Crabbe has read it before you. “I have put myself down as a guide, sir. I know the roads.”'}`,
  choices:[
    {t:'Make honest returns, to the last spade.', go:() => { add({standing:2, goodwill:-2});
      return `You are a week in counting: of oxen, two hundred and six; of wagons, forty-one; of sheep, nine hundred and twelve; of men, eighty-three, against eleven of whom the overseer has pencilled, “Able, in a way.”

The return goes to Reading on Saturday.

On Sunday nobody stays to talk in the churchyard; but old Dewey stops you at the gate, to ask whether his wagon is the King’s now.`; }},
    {t:'Raise and equip the Hatherley Volunteers.', note:() => T('soldier') ? '£150' : '£300', go:() => { fl('volunteers'); add({money: T('soldier') ? -150 : -300, standing:7, goodwill:2}); reg('cullerne',1);
      return `Forty men come forward; and for green cloth to make forty coats, and for a drum, you lay out ${T('soldier') ? 'a hundred and fifty' : 'three hundred'} pounds.

As there is not a musket to be had in England, the blacksmith makes forty pike-heads in a fortnight.

They drill upon ${ground()} on Sunday afternoons. On the first Sunday the drummer puts his foot through the drum; on the fourth they march the whole length of ${ground()} in step, and you discover that you are standing very straight.`; }},
    {t:'Leave it all to Crabbe.', if:() => !F('crabbeGone'), go:() => { reg('crabbe',1); later('crabbeList', 3);
      return `“See to it, Crabbe.”

“With pleasure, sir.”

He is three evenings about it; and the return, when it is done, makes four sheets in his best hand, tied with green tape. He holds it out to you as you are going in to dinner, and you tell him to send it.`; }}
  ]});

ev({ id:'crabbeList', follow:true, cond:() => !F('crabbeGone'), title:'Wagons of a Spiritual Character',
  text:() => `A clerk from the Lord Lieutenant’s office is in the yard with a list in his hand, having come, as he says, to see the wagons.

“Fifty-two, sir, by your return.”

You walk him round, and between you make it forty-one.

He shows you the list. There are entered at Hatherley Home Farm eleven wagons which you never owned; and against each of them stands a government allowance of sixpence a day, for exercise, payable to Mr Crabbe, steward.

Crabbe is sent for. He looks at the list, and then at the clerk.

“A reserve, sir. One does not show the enemy everything.”`,
  choices:[
    {t:'Dismiss him on the spot.', go:() => { fl('crabbeGone'); add({standing:2, goodwill:2}); reg('crabbe',-5,'Dismissed over eleven wagons that did not exist');
      return `“You will be out of the steward’s house by Saturday.”

He bows. On Saturday a cart carries his boxes to Newbury, with your uncle’s writing desk on the top of them; and before the month is out a brass plate has gone up in Northbrook Street: “Crabbe. Land Agent.”

The new steward is a Scotchman of six-and-twenty, named Lark. On his first morning you hand him the key of the office, and he writes you a receipt for it.`; }},
    {t:'Repay the allowance quietly and keep him where you can see him.', note:'£70', go:() => { fl('crabbeWatched'); add({money:-70}); reg('crabbe',-1,'Knows that you know about the wagons');
      return `You count down seventy pounds upon the clerk’s list; and he writes “Error” against the eleven wagons, and rides away.

Crabbe has not stirred. “I am obliged to you, sir.”

“I shall read the accounts myself from now on.”

“I should welcome it, sir.”

For a month afterwards every page of the ledger is ruled twice, and totalled in red.`; }},
    {t:'Tell the clerk the wagons are out on exercise.', go:() => { fl('crabbeSkims'); add({standing:-2}); reg('crabbe',2,'You lied to the Lord Lieutenant for him');
      return `“The other eleven are out,” you say. “At exercise.”

The clerk looks at you, and then at Crabbe; writes for some time in his book, without offering to show you the page; and rides away.

Crabbe sees him to the gate, and comes back across the yard at his usual pace. He does not thank you. He asks only whether you will still have the Lady Day accounts on Friday, or whether next week would do.`; }}
  ]});

ev({ id:'incomeTax', fixed:'1799-3', title:'Ten Per Centum',
  text:() => `The form is of four pages, upon Crown paper, printed in London: “An Act for granting to His Majesty certain Duties upon Income.”

It is two shillings in the pound. You are to state what you have from land, what from the funds, and what from every other source whatever; and you are to state it to the commissioners for this division, who are ${F('gallDead') ? 'Lord Cullerne’s agent' : 'Dr Gall'}, Mr Hartopp, and Mr Spurling, the attorney. With two of the three you dined last week.

The last line of the last page is left blank, for a name; and the words printed above it are “I do solemnly declare”.`,
  choices:[
    {t:'Declare every half-crown.', go:() => { fl('taxHonest'); add({standing:2});
      return `You write down the rents, the home farm, the timber, and the three per cents; add the whole twice over; and sign.

Spurling reads it at the George with his spectacles pushed up, and then reads it again; after which he sends his clerk to the tithe map, to look for a farm that you have left out.

There is none; but it is a fortnight before he can be brought to believe it.`; }},
    {t:'Declare what the estate was worth in your uncle’s day.', go:() => { fl('taxDodge'); later('taxCaught', 5 + Math.floor(Math.random() * 6));
      return `Your uncle’s rent book for the year 1785 is in the bottom drawer; and it is from that book that you copy the figures.

You sign. ${hh(`For a week you turn the lamp down early, and tell Henrietta that the claret must be made to last.`, `For a week you turn the lamp down early, and drink the table beer.`)}

A note comes from Spurling, of one line: “Received, with interest.”`; }},
    {t:'Pay in full, and denounce it at the Bell.', go:() => { fl('taxHonest'); add({goodwill:3, standing:-1});
      return `You pay to the last shilling; and then you walk down to the Bell.

There, standing upon a settle, you give them twenty minutes of Englishmen, of liberty, and of a tax-gatherer in every man’s desk; in the course of which the landlord twice fills your glass, and twice forgets to chalk it.

The carters cheer you, though there is not a man among them who earns enough to be taxed; and Jem Pryor, very civilly, asks how much it came to.`; }}
  ]});

ev({ id:'taxCaught', follow:true, cond:() => F('taxDodge'), title:'A Ferret in a Good Coat',
  text:() => `Mr Spurling is in the hall; and with Mr Spurling is a clerk, and with the clerk a tin box.

He lays two papers side by side upon your library table. One is your return. The other is older, and is headed “Particulars of the Hatherley Estate, 1791”; having been drawn up by Lord Cullerne’s lawyers when his lordship had a mind to buy the place of your uncle, and giving the rental farm by farm.

Spurling puts a finger upon each total.

“Nine hundred a year between them, sir. I make it nine hundred.” He smiles at you. “I do enjoy a discrepancy.”`,
  choices:[
    {t:'Pay the arrears and the surcharge.', note:'£420', go:() => { fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-5});
      return `You write the draft: four hundred and twenty pounds, for arrears and surcharge; and Spurling locks it in the tin box.

“The commissioners’ proceedings are secret by statute, sir.”

By Thursday the butcher at Wyvern knows the figure; and in the same week he sends in his account, a thing he has not done before Christmas these ten years.`; }},
    {t:'Offer Spurling fifty guineas for his trouble.', note:'£52', go:() => { add({money:-52});
      if (chance(0.5)) { return `You lay a purse upon the table between the two papers. It holds fifty guineas.

Spurling looks at the clerk; and the clerk goes to look out of the window.

When you look down again the purse is gone, and Spurling is shutting the tin box. “Rents do fluctuate,” he says; and he carries the paper of 1791 away with him.`; }
      fl('taxDodge', false); fl('taxHonest'); add({money:-420, standing:-9});
      return `You lay a purse upon the table between the two papers. It holds fifty guineas.

Spurling rises. “Mr Hobbs. You will note the time.” The clerk notes it; and the purse goes into the tin box with a label upon it.

You pay the four hundred and twenty besides. Spurling tells the story at the George the same night; by Saturday it is a hundred guineas; and by Quarter Sessions you were upon your knees.`; }}
  ]});

ev({ id:'dearth', fixed:'1800-2', title:'A Proclamation Concerning Bread',
  text:() => `Wheat is at a hundred and thirteen shillings the quarter, there having been no harvest worth the name these two years.

In the cottages they are baking with barley and bran; and at the Pryors’ there are nettles drying upon a string across the hearth.

Dr Gall reads the King’s Proclamation from the pulpit. Every household that can afford wheat is to eat one third less of it; there is to be no pastry, and no flour in puddings.

Mrs Bunce, who sits in the back pew, walks out before the blessing.`,
  choices:[
    {t:'Sign the pledge. No pastry at the Hall.', go:() => { add({family:-4, goodwill:5, standing:2}); reg('henrietta',-1);
      return `You sign the pledge, and nail a copy of it to the kitchen door.

Mrs Bunce sends up rice pudding on Monday, and rice pudding on Tuesday; and on Wednesday there are potatoes in the bread. ${hh(`Henrietta leaves the table, and has a tray in her room.`, `A letter from Gay Street makes mention of a pastry-cook in Milsom Street.`)}

On Sunday three cottage children stand in the lane under the kitchen chimney with their noses in the air; and, there being no pie, they go home and tell their mothers.`; }},
    {t:'Open a soup kitchen in the old brewhouse.', note:'£250', go:() => { fl('soup'); add({money:-250, goodwill:11, standing:3}); meet('thorne'); reg('thorne',1); reg('gall',-1); reg('pryor',1);
      return `You have the old brewhouse copper scoured. Count Rumford’s receipt is in the Mercury: barley, pease, potatoes, stale bread, one beef bone, and water; and two hundred and fifty pounds will carry it on to the spring.

It makes two hundred quarts a day. The children come at noon with jugs; and Abigail Thorne, who comes on the second day, stays to ladle.

Dr Gall preaches against it. “Teach a poor man to expect soup, and he will expect it.” On Monday his housekeeper is at the brewhouse door with a quart jug.`; }},
    {t:'Sell the home farm wheat while the price holds.', note:'+£460', go:() => { fl('hoarder'); add({money:460, goodwill:-11}); reg('pryor',-1,'Counted your wheat wagons leaving in the dearth'); later('rickFire', 2);
      return `A corn factor comes out from Reading, and offers a hundred and fifteen shillings; which you take, and which comes to four hundred and sixty pounds.

His three wagons load at the great barn at ten in the morning; and the only road out lies through the village.

Doors open all along the street, and nobody speaks. Jem Pryor stands at his gate with his youngest upon his shoulders, and his lips are seen to move as each sack goes by.`; }}
  ]});

ev({ id:'census', fixed:'1801-1', title:'The Numbering of the People',
  text:() => `Mr Nokes the overseer is at the estate office with a printed form, and an inkhorn hung upon a string; Parliament having resolved that every person in Hatherley shall be counted, and he having been three days about it.

“Hannah Gurney has barred her door, sir. She says King David numbered Israel and the Lord sent a plague. The Coxes, the Dances and the Lovegroves have all gone to cousins at Shefford. And then there is the smith.”

He turns the form about. Under the head of “Children” the blacksmith has made him write “Enough”.`,
  choices:[
    {t:'Go round with Nokes yourself.', go:() => { add({goodwill:4, standing:1});
      return `You go round with him from door to door, carrying a basket of oranges from the hot-house, out of which every child that is counted has one; and by the second day children are being fetched home from Shefford.

Hannah Gurney opens her door a hand’s breadth, takes an orange, and shuts it again; upon which Nokes puts her down.

The whole comes to six hundred and four. He lost his count twice in Mill Lane, and you do not ask him how he made it up.`; }},
    {t:'Tell Nokes to estimate and be done.', go:() => { add({goodwill:1});
      return `“Reckon it as near as you can, Nokes.”

He walks once through the village counting chimneys, writes “590”, and sends it to Reading.

Hannah Gurney dies within the year, at the age of ninety. One half of the village lays it to the winter; and the other half looks at Nokes.`; }},
    {t:'Have the constable count the absentees as vagrants.', go:() => { add({goodwill:-4, standing:1});
      return `You send the constable to Shefford with a message, that any family of Hatherley not at home by Friday will be entered as vagrants.

They are home on Thursday. Nokes counts them at their doors, and is not asked into one.

It comes to five hundred and ninety-seven. This time the smith gives in his children, to the number of nine; but under “Occupation” he makes Nokes write “Numbered”.`; }}
  ]});

ev({ id:'paris', fixed:'1802-1', title:'Everyone Is Going to Paris',
  text:() => `The Tamworths are gone to Paris; so are the Lovedays; and Lady Cullerne set out on Monday with nine trunks. There has been peace since March, and the packets are running again from Dover.

${hh(`Henrietta has a letter from Mrs Tamworth lying open by her plate, the whole of which relates to bonnets in the Palais Royal.`, `Henrietta has sent on from Gay Street a letter of Mrs Tamworth’s, the whole of which relates to bonnets in the Palais Royal; and the bonnets are underlined.`)} ${K() === 'free' ? 'Kitty wishes to see Bonaparte, and has said so twice since the fish. ' : ''}${F('gallDead') ? 'The new curate' : 'Dr Gall'}, who is dining with you, has never in his life been further than Bath.

${hh(`“They eat frogs, madam,” he tells Henrietta. “I have it from a man who saw it done.”`, `“They eat frogs, sir,” he tells you. “I have it from a man who saw it done.”`)}`,
  choices:[
    {t:() => hh('Take the family.', 'Fetch Henrietta from Bath and take the family.'), note:'£500', go:() => { fl('paris'); add({money:-500, family:10, standing:3}); reg('henrietta',2,'You took her to Paris in the peace'); if (K() === 'free') reg('kitty',2);
      return `From Dover to Calais is four hours, and from Calais to Paris three days; and it is five hundred pounds before you are home again.

On the Sunday there is a review in the Place du Carrousel. You stand in the crowd while a small sallow man rides down the line upon a white horse, looking along the faces as he passes; and among the rest he looks at yours.

Henrietta buys eleven bonnets, and you catch a cold upon the packet coming home. ${hh(`At Dover you tell her that it will be war again within the year.`, `At Dover you tell her that it will be war again within the year; to which she answers that Bath will do until then.`)}`; }},
    {t:'Send Henrietta with your sister Selina.', note:'£220', go:() => { fl('paris'); add({money:-220, family:4}); reg('henrietta',1);
      return `Your sister Selina goes with her, at a cost of two hundred and twenty pounds.

They are back in six weeks. ${hh(`Henrietta now says “Mon Dieu” when the tea is cold.`, `Henrietta’s letters from Gay Street now begin “Mon cher”.`)} Selina has been shown Madame Récamier’s bed, and describes it at dinner.

Selina has also seen the First Consul. “Common,” she says; and she says it at the Tamworths’, and again at the Castle.`; }},
    {t:'Refuse. The French are not to be trusted.', go:() => { add({family:-6}); reg('henrietta',-2,'You kept her from Paris'); if (!F('gallDead')) reg('gall',1);
      return `${hh(`“The French are not to be trusted. We stay at home.”

Henrietta folds Mrs Tamworth’s letter, and puts it in her sleeve.`, `You write as much to Gay Street. “The French are not to be trusted. You will oblige me by remaining at Bath.”

Your letter comes back torn across.`)}

All that summer there are letters from Paris in the neighbourhood, to be read aloud after dinner at every house you visit; and at the Lovedays’ you hear about the Louvre twice in one evening.`; }}
  ]});

ev({ id:'boulogne', fixed:'1803-2', title:'The Army of England',
  text:() => `The war began again in May.

The Mercury prints a letter from Dover, by which it appears that on a clear day the tents at Boulogne may be seen from the cliff. There are a hundred and fifty thousand men, and two thousand flat boats; and Bonaparte has told his admirals that he wants only six hours of fog.

At the Tamworths’ the nurse has found a new way of getting the children to bed. “Boney will have you.” It answers upon the first night.

There is a handbill upon the church door: “BRITONS! To Arms!”`,
  choices:[
    {t:'Drill the Hatherley Volunteers yourself, twice a week.', if:() => F('volunteers'), go:() => { add({standing:5, goodwill:2, family:-2});
      return `You buy the drill book, and read it on Saturday nights; and on Sundays and Wednesdays you have them out upon ${ground()}.

Form line; form square; charge pikes. By November they can do all three, at the expense of one man stuck in the leg.

The blacksmith is serjeant. He stands six foot four, with a pike in his fist; and the men, who do not always understand you, watch him, and do what he does.`; }},
    {t:'Raise a corps of Volunteers now.', note:() => T('soldier') ? '£160' : '£320', if:() => !F('volunteers'), go:() => { fl('volunteers'); add({money: T('soldier') ? -160 : -320, standing:6, goodwill:2});
      return `Forty men give in their names at the vestry; and green coats, a drum and forty pike-heads come to ${T('soldier') ? 'a hundred and sixty' : 'three hundred and twenty'} pounds.

The ladies of the parish work a flag, upon which there appears a yellow animal in a green field. ${hh(`Henrietta says it is a lion.`, `Mrs Loveday says it is a lion.`)}

The men asked for muskets, and there are none to give them. The blacksmith is serjeant. “A pike,” he tells them, “is a musket with the nonsense left out.”`; }},
    {t:'Send a hundred pounds to the Patriotic Fund at Lloyd’s.', note:'£100', go:() => { add({money:-100, standing:3}); reg('cullerne',1);
      return `You send a hundred pounds to the Patriotic Fund at Lloyd’s Coffee House.

The list of subscribers is in the Times on Tuesday: a duke, fifty pounds; then yourself; then a soap-boiler of Wapping, two hundred.

Lord Cullerne has seen it; and at the Wyvern assembly, with his hand upon your shoulder, he says as much to the whole room.`; }},
    {t:() => hh('Set Henrietta at the head of a flannel committee.', 'Have Henrietta raise a flannel committee at Bath.'), go:() => { add({family:3, goodwill:1, standing:1}); reg('henrietta',1);
      return `${hh(`Henrietta summons the ladies of the parish to the drawing-room, to make flannel shirts for the troops, on Tuesdays at eleven.

You pass the door every week, and count fourteen women and one pair of scissors.`, `Henrietta summons the ladies of Gay Street to her lodgings, to make flannel shirts for the troops, on Tuesdays at eleven.

She sends you the numbers every week: fourteen women and one pair of scissors.`)}

By Christmas there are nine shirts in the basket, and Miss Loveday is engaged to a lieutenant of Militia.`; }}
  ]});

ev({ id:'beacon', fixed:'1804-0', title:'The Beacon on Hatherley Down',
  text:() => `It is the church bell that wakes you, at two in the morning.

There is fire upon Hatherley Down, and fire upon Inkpen Hill behind it; and from the landing window you count five more along the valley.

The Volunteers are falling in upon the green, some of them in coats, and the smith in a nightshirt with a pike. ${hh(`Henrietta is upon the stairs with the ${ended('plate') ? 'spoons' : 'silver'} in a pillowcase.`, `Mrs Bunce is upon the stairs with the ${ended('plate') ? 'spoons' : 'silver'} in a pillowcase.`)}

${F('gallDead') ? 'The sexton comes up the drive at a run. He has buried the communion plate in the vicarage asparagus bed, and wishes you to know in which row, in case he should be killed; but he cannot remember which row.' : 'Dr Gall comes up the drive in his dressing-gown. He has buried the communion plate in his asparagus bed, and wishes you to know in which row, in case he should be killed; but he cannot remember which row.'}`,
  choices:[
    {t:'Mount, and lead the men towards the coast.', go:() => { add({standing:6, goodwill:4, family:-2});
      return `You mount, and take them down the Newbury road: forty men in the dark, who keep step for the first mile.

Fourteen miles on, the Bath mail comes up behind you with its lamps lit, and the guard leans down. “No French, sir. Some fool lit a beacon at Inkpen.”

They sit down in the road, three of them having set out in one boot; and it is the smith who first begins to laugh. You march them home by daylight, singing, past every cottage door standing open.`; }},
    {t:'Ride up to the beacon and find out.', go:() => { add({standing:2, goodwill:1});
      return `You ride up the Down in your nightshirt and greatcoat.

Billy Coombes is beside the beacon, which is burning well, and he is crying; for he saw fire upon Inkpen, and did as he was told. You ride on to Inkpen, where you find a charcoal burner asleep beside his stack.

You are in bed again by four, and the Volunteers are out till noon. On Sunday there is nobody upon the green who will look at you.`; }},
    {t:'Stay, and guard the house.', go:() => { add({family:4, standing:-5}); reg('henrietta',1);
      return `You take down your uncle’s sword from over the hall chimney-piece, and post yourself at the head of the stairs. ${hh(`Henrietta sits upon the top step with the pillowcase.`, `Mrs Bunce sits upon the top step with the pillowcase.`)}

At first light the Bath mail brings the truth through Wyvern: there are no French.

You try to draw the sword; but as it has not been out of the scabbard since the Forty-Five, it will not move. One of the Johns is standing at the foot of the stairs, and has been standing there for some time.`; }}
  ]});

ev({ id:'trafalgar', fixed:'1805-3', title:'Laurel on the Mail',
  text:() => `The London mail comes into Wyvern at noon with laurel tied about the lamps, and black crape upon the bridles of the horses.

The guard stands up on the roof, and shouts it to the street: a battle off Cape Trafalgar; nineteen ships taken; and Lord Nelson killed.

The ringers run to the tower, and begin a peal; somebody stops them, and one bell tolls; and then it is the peal again.${E() === 'navy' && !F('edmundDead') ? `

There is a letter from Edmund in the bag, the writing of which slopes uphill. “The Thetis repeated signals, and we hardly fired. I saw the Victory go into their line. I was not afraid until it was over; and then I was sick into the hammock nettings. The boatswain says everybody is.”` : ''}`,
  choices:[
    {t:'Illuminate the Hall.', note:'£40', go:() => { add({money:-40, standing:3});
      return `There is a candle in every window of the Hall; and as the Hall has fifty-four windows, it comes to forty pounds in wax and lamp oil.

People walk out from Wyvern to stand in the road and look, and somebody strikes up “Rule, Britannia”.

${hh(`Henrietta walks the gallery with a snuffer, counting the candles aloud; and at ten o’clock she begins to put them out.`, `The elder John walks the gallery with a snuffer, counting the candles aloud; and at ten o’clock he begins to put them out.`)}`; }},
    {t:'Roast a sheep for the village.', note:'£60', go:() => { add({money:-60, goodwill:6});
      return `You give a sheep and three barrels, and the sheep is roasted upon ${ground()}.

They drink first to Lord Nelson, and not a word is spoken; and next, confusion to the French, with a noise that is heard at the Hall.

The fiddler plays “Hearts of Oak” nine times. Old Dewey sits crying by the fire; and a boy who begins to laugh at him is cuffed by his own mother.`; }},
    {t:'Order the bells tolled, and put the household in black.', go:() => { add({standing:1, family:-1}); if (!F('gallDead')) reg('gall',1);
      return `One bell is tolled for an hour, and by evening the household is in black.

As no other parish within ten miles has thought of it, ${F('gallDead') ? 'the rector of Kintbury' : 'Dr Gall'} calls it very proper.

Afterwards the ringers come to the kitchen door, and stand there, until Mrs Bunce asks what they want. They want to know whether it is beer for tolling, the same as for ringing.`; }}
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

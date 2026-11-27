# The Hatherley hand

How the game talks. Read this before you write or alter a word the player will see, then run `node tools/voicecheck.js`.

Companions: [LEXICON.md](LEXICON.md) for money, titles, dates and vocabulary; [SAMPLES.md](SAMPLES.md) for events done over, old beside new; [corpus/](corpus/) for the period itself.

## What was wrong

Not the jokes. The first draft was funny, and a good many of its lines survive. The trouble was where the narrator stood. He stood in our century, looking back, with a history of the period open on his knee. He told the player what the game laws were. He knew that the Speenhamland scale would last forty years. He delivered a neat line at the foot of nearly every paragraph, at an even pace, like a man tipping his hat at each lamp-post. One voice did everything: the vicar, the poacher, the newspaper and the steward all came out of the same mouth.

A reader hears that as a modern comic writer in costume. The cure is a change of position more than a change of words.

## Where the narrator stands

Inside the year. He knows what Wyvern knows on market day and no more. He has not read the Hammonds. When the bench adopts a bread scale he can tell you what Hartopp said about it over the cheese; he cannot tell you what it did to England.

So: no hindsight. Nothing "for the rest of his life", nothing "it will be forty years". The one place allowed to look back is the Reading Mercury at the end, and even the Mercury only looks back from 1815.

And no lecturing. If the player needs to know that a man without a hundred a year in land may not kill a hare, let the keeper say it, or the vicar, or put the penalty on the table as a sum. The period explained itself to nobody. People complained, quoted prices and cited the statute at each other, and that is how a reader of Woodforde or Cobbett learns it.

He is a neighbour of some education, dry, fond of the place, not shocked by much. He approves of things in a way that leaves them damaged. He is exact about money because everyone was.

## Five hands, not one

The single largest change. Text reaches the player in one of five hands, and they should not sound alike.

**The narrator.** Second person, present tense, as now. Sentences that carry their freight to the end, set against short flat ones. See below.

**The letter.** Edmund from his ship, Kitty from Northampton, Tidmarsh, the Lord Lieutenant's clerk. A letter has a place and a day at its head, a salutation, and a subscription, and the subscription is a gauge of feeling: when Edmund moves from "your dutiful son" to "your affectionate son" something has happened, and nobody need say what. Letters are charged to whoever receives them, by the sheet, which is why the young cross theirs and the rich get them franked.

**The public prints and the wall.** Handbills, the Mercury, notices of sale, a board in a wood. These have formulas and should keep them: WHEREAS, the capitals on the Nouns, "on Tuesday se'nnight", "none but principals will be treated with". A reward bill quoted whole does more than a paragraph telling the player a reward was offered. Capitalised nouns belong here and in the pocket-book only. In the narrator they are fancy dress.

**The pocket-book.** The squire's own memoranda, for quiet seasons. The model is Parson Woodforde: what was paid, what was eaten, who called, the weather, with sums set out as he set them, `0. 2. 6`. No wit is attempted. The wit comes from what a man thinks worth writing down, and in what order.

**Speech.** By rank, and each person with a habit. Lord Cullerne drops his g's and says "ain't", as a Whig earl of his generation did, and never explains himself. Dr Gall speaks in periods and quotes Scripture against people. Crabbe is all respect and subordinate clauses. Hartopp has caught his vocabulary from Arthur Young and cannot see a field without "capabilities". Jem Pryor says little, and what he says is Berkshire: "her" for she, "I be", "un" for him, a "z" now and then. One mark of dialect to a speech is enough. Mrs Bunce does not speak; things are reported of her. Keep that.

## The narrator's sentences

Borrow the period's grammar and leave its upholstery.

Take these:
- The sentence that holds back its point. "You say nothing, and are thought to have said it very properly."
- Passive and impersonal constructions for the county's opinion: "it is understood", "it is allowed on all sides", "he is said to have asked".
- Litotes. "Not thought likely to part with it under the market rate."
- The abstract noun given a job. "His civility", "her resolution", "the Doctor's indignation" may act as persons.
- Prepositions the period preferred: upon, among, above (for more than), at the George, in the commission.
- Old strong forms where they fall naturally: "you are woke", "had rose", "betted", "catched" in speech.
- Semicolons, sparingly, to hold two facts against each other.

Leave these: thee and thou outside dialect, "prithee", "forsooth", the long s, 'tis and 'twas in narration, and any sentence that could be read aloud in a pantomime. If it sounds like a costume, cut it.

Rhythm: Austen and Cobbett both put a five-word sentence after a fifty-word one. Do that. Do not do it every time.

## Where the comedy goes

Into fact. A sum, a measure, a date, the order in which a man lists his losses. "The hare might fetch three shillings" beside "the statute is five pounds, or three months" is the joke, and nobody has to make it.

Rations, which the checker counts:
- One simile to an event. Two if both are short. The period used them less than we do and preferred "as a man who" to "like a".
- No more than one passage in three may end on a short punchline. Let the others stop on a gesture, a price, or something somebody did with their hat.
- The ", which is" deflation ("which is how you know he is miserable") once in an event, and not in consecutive events.
- No joke that needs the twentieth century to get it.

Some outcomes should not be funny at all. The boy in the spring-gun is not, and was rightly left alone.

## Never

- Em dashes or en dashes. Commas, semicolons, colons, full stops.
- genuinely, straightforward, moreover, furthermore, "it is worth noting", and the rest of the checker's list.
- The three-part list with a twist in the tail, more than once in an event. It is the commonest tic in the old text.
- "Nobody sees the joke." "Everybody remembers." The narrator nudging. If it is funny they saw.
- Paragraphs of equal length marching down the card.
- Explaining a custom the characters would take for granted.
- Americanisms and American spelling.
- A word in the checker's period list without a reason you could defend to someone with the OED open.

## Before you commit

1. Which of the five hands is this in? If "narrator" for the fourth event running, find a letter or a bill in it.
2. Read it aloud. Where you perform, cut.
3. Check every sum against LEXICON.md and every title against who the person is.
4. `node tools/voicecheck.js`. Errors must be mended. Advice may be overruled, with a reason.
5. `./build.sh` and `node test/sim.js 500`. Prose changes must not touch a flag, a number or a name.

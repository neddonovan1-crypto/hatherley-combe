# The Hatherley hand

How the game talks. Read this before you write or alter a word the player will see, then run `node tools/voicecheck.js`.

Companions: [LEXICON.md](LEXICON.md) for money, titles, dates and vocabulary; [SAMPLES.md](SAMPLES.md) for events done over, old beside new; [corpus/](corpus/) for the period itself.

## What was wrong

Two things, and the second took two attempts to see.

The narrator stood in our century. He explained the game laws. He knew the Speenhamland scale would last forty years.

Worse, nearly every sentence had the same build. A statement. A comma. Then a comment hung on the end to be clever about the statement. Ned put two of them side by side:

> over a turbot that cost more than a ploughman earns in a month, to decide what a ploughman ought to earn in a month. Nobody sees the joke.

> A man with a wife and three children has eight shillings a week to buy it with, and the gentlemen present are too good arithmeticians to pretend that the sum comes out.

The second has better words in it. It is the same sentence. Period vocabulary poured into that mould still reads as a machine being wry. The checker counted the old text: more than one sentence in five ended on a hung clause.

## The hung clause

This is the rule that matters most.

A sentence does one job. It reports what happened, or what was said, or what something cost. It does not then turn round and remark on itself.

Forms to refuse:
- "..., and [dry observation]."
- "..., which is [deflation]."
- "..., as [comparison that explains the joke]."
- "..., the first she ever troubled to make you."
- A short knowing sentence after a paragraph, doing the same work from outside: "Nobody sees the joke." "Everybody remembers."

What to do instead. Cut the comment and see whether the fact stands. It nearly always does. If the comment held something the player needs, turn it into an event: a thing done, a thing said aloud, a line in a document. Hartopp does not get a clause saying he has spotted the flaw in the bread scale. He takes out a pencil and writes "Why pay 6?" on the back of the agenda.

Commas are not banned. Lists need them. So does a clause that comes first: "When the loaf rises, the table rises." The fault is the tail.

## The narrator

Inside the year. He knows what Wyvern knows on market day. Nothing "for the rest of his life". The Reading Mercury at the end may look back, and only from 1815.

He does not explain. The player learns the penalty for a hare because the Act is open on the table.

He has no opinions. He has eyes and ears. He says who stood where, what they held, what was said, what it cost, what they did with their hats. The wit belongs to the people in the room and to the arithmetic.

His sentences are mostly short and plain, in the way Cobbett's are and Dahl's are. Period feeling comes from the nouns (a peck measure, a tailboard, a draft on Tidmarsh's bank), from the sums, and from the forms of the other four hands. It does not come from syntax in fancy dress.

Dialogue carries a great deal. Write it as lines, each on its own.

Vary the pace by what is happening. A fire is short sentences. A woman reading every clause of a lease may have a longer one. Do not vary it by formula.

## Five hands, not one

The single largest change. Text reaches the player in one of five hands, and they should not sound alike.

**The narrator.** Second person, present tense. See above.

**The letter.** Edmund from his ship, Kitty from Northampton, Tidmarsh, the Lord Lieutenant's clerk. A letter has a place and a day at its head, a salutation, and a subscription, and the subscription is a gauge of feeling: when Edmund moves from "your dutiful son" to "your affectionate son" something has happened, and nobody need say what. Letters are charged to whoever receives them, by the sheet, which is why the young cross theirs and the rich get them franked.

**The public prints and the wall.** Handbills, the Mercury, notices of sale, a board in a wood. These have formulas and should keep them: WHEREAS, the capitals on the Nouns, "on Tuesday se'nnight", "none but principals will be treated with". A reward bill quoted whole does more than a paragraph telling the player a reward was offered. Capitalised nouns belong here and in the pocket-book only. In the narrator they are fancy dress.

**The pocket-book.** The squire's own memoranda, for quiet seasons. The model is Parson Woodforde: what was paid, what was eaten, who called, the weather, with sums set out as he set them, `0. 2. 6`. No wit is attempted. The wit comes from what a man thinks worth writing down, and in what order.

**Speech.** By rank, and each person with a habit. Lord Cullerne drops his g's and says "ain't", as a Whig earl of his generation did, and never explains himself. Dr Gall speaks in periods and quotes Scripture against people. Crabbe is all respect and subordinate clauses. Hartopp has caught his vocabulary from Arthur Young and cannot see a field without "capabilities". Jem Pryor says little, and what he says is Berkshire: "her" for she, "I be", "un" for him, a "z" now and then. One mark of dialect to a speech is enough. Mrs Bunce does not speak; things are reported of her. Keep that.

## How to write an event

Do not revise old prose. It carries its skeleton with it, and the skeleton is the fault.

1. Reduce the event to beats on a scrap: who, where, what is asked, each choice, what follows each choice, which flags and sums move. No phrases from the old text.
2. Close the old text.
3. Write from the beats. Ask what a person standing in the room would see and hear.
4. Put the code back round it exactly as it was.

## Where the comedy goes

Into what people do and what things cost. Five pounds or three months, for a hare. Four shillings a week for thirteen weeks out of the rates. A miller holding his own hat with his own money in it.

One simile to an event, or none. Some outcomes should not be funny at all.

## Never

- Em dashes or en dashes. Commas, semicolons, colons, full stops.
- genuinely, straightforward, moreover, furthermore, "it is worth noting", and the rest of the checker's list.
- The hung clause, above.
- The three-part list with a twist in the tail.
- Paragraphs of equal length marching down the card.
- Explaining a custom the characters would take for granted.
- Americanisms and American spelling.
- A word in the checker's period list without a reason you could defend to someone with the OED open.

## Before you commit

0. Did you write it from beats, with the old text shut?
1. Which of the five hands is this in? If "narrator" for the fourth event running, find a letter or a bill in it.
2. Read it aloud. Where you perform, cut.
3. Check every sum against LEXICON.md and every title against who the person is.
4. `node tools/voicecheck.js`. Errors must be mended. Advice may be overruled, with a reason.
5. `./build.sh` and `node test/sim.js 500`. Prose changes must not touch a flag, a number or a name.

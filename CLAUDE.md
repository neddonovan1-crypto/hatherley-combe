# Hatherley Combe

A Georgian estate game, Berkshire, 1795 to 1815. See README.md for layout and build.

## Before writing any text the player will read

1. Read `docs/voice/VOICE.md` in full. It is short. Keep `docs/voice/LEXICON.md` open for money, titles and dates.
2. Read two or three pages of something in `docs/voice/corpus/` first, to get the ear in. Cobbett or Austen's letters for narration, *Humphry Clinker* for letters, Woodforde for the pocket-book.
3. Never revise existing prose. Cut the event to bare beats, shut the old text, and write from the beats (VOICE.md, "How to write an event"). The fault to avoid above all is the sentence built as statement, comma, wry aside.
4. The whole game is now in the hand. Before adding to it, read three events through (`speen`, `poacher` and `smugglers` will do) and match them.
5. Run `node tools/voicecheck.js`. Mend every error. Answer every piece of advice or overrule it for a reason.
6. `./build.sh`, then `node test/sim.js 500`. Before a deploy, `node test/oldsaves.js` as well (README, "Saves").

The owner is a writer and reads every line. British spelling. No em dashes. No clichés, no exposition, no summarising last sentence. Do not write the same shape of paragraph twice running.

When only prose is being changed, do not alter a flag, a number, a name or an event id.

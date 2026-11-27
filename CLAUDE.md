# Hatherley Combe

A Georgian estate game, Berkshire, 1795 to 1815. See README.md for layout and build.

## Before writing any text the player will read

1. Read `docs/voice/VOICE.md` in full. It is short. Keep `docs/voice/LEXICON.md` open for money, titles and dates.
2. Read two or three pages of something in `docs/voice/corpus/` first, to get the ear in. Cobbett or Austen's letters for narration, *Humphry Clinker* for letters, Woodforde for the pocket-book.
3. Look at an event already in the hand (`speen`, `flour`, `nore`, `thorneLease`, `poacher`, `rickFire`) and match it, not the older events around it.
4. Run `node tools/voicecheck.js`. Mend every error. Answer every piece of advice or overrule it for a reason.
5. `./build.sh`, then `node test/sim.js 500`.

The owner is a writer and reads every line. British spelling. No em dashes. No clichés, no exposition, no summarising last sentence. Do not write the same shape of paragraph twice running.

When only prose is being changed, do not alter a flag, a number, a name or an event id.

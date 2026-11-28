# Hatherley Combe

A role-playing estate game set in Berkshire between 1795 and 1815. You inherit two thousand acres, a mortgage, a steward who smiles like a ledger, and twenty-one years of war, dearth and county society. One season to a turn.

**Play it:** open `index.html` in any browser. No install, no server.

## What is in it

- 84 seasons, each with the quarter's accounts, somebody waiting in the hall, and one undertaking of your own choosing.
- A point-buy at the start: five dropdowns (past, fortune, marriage, advantage, failing) and three points to balance between them.
- About sixty written events. Half are pinned to the calendar (the Speenhamland meeting of 1795, the Bank Restriction, the income tax, the dearth of 1800, the first Census, the Peace of Amiens, the invasion beacons, Trafalgar, the Jubilee, General Ludd, the Corn Bill, Waterloo). The rest wander in when their conditions suit.
- Thirteen people who remember what you did to them, and act on it years later.
- A working estate: rents (indulgent, customary or rack), a home farm sold at each year's real wheat price, poor rates, land tax, Mr Pitt's income tax at its historical rates, a mortgage, and ten works (drains, cottages, a school, a new front to the Hall) that may be put in hand at any time, two at once, without using up the season.
- An ending written for you by the Reading Mercury.

## Layout

```
src/data.js        prices, harvests, people, news
src/traits.js      advantages and encumbrances for the making of a squire
src/engine.js      seasons, ledger, undertakings, saves, the reckoning
src/estate.js      the rent roll: farms, leases, ventures, household, society, credit
src/common.js      the Common while it lies open
src/farmworks.js   each farm's own works and venture
src/castle.js      Lord Cullerne: the votes, his court, the game, and what may be bought of him
src/events1.js     the fixed calendar
src/events2.js     the wandering pool
src/events3.js     one paper for each choice made at the inheritance
src/events4.js     the Post-Captain at the Grange
src/events5.js     the squire's past and character, made to tell
src/ventpapers.js  the papers a venture opens (with ventpapers.css)
src/endings.js     how the life ends, and its last plate (with endings.css)
src/plan.js        the plan of the estate and the plates (with plan.css)
src/planart.js     where each drawn piece sits on the plan
src/stock.js       the beasts and the traffic on the plan
src/sayat.js       where the speaker's mouth is on each cut
src/sayroom.js     where a balloon may hang on each cut (made by tools/balloons/build.py)
src/ui.js          the ledger, the inheritance and the making of a squire (with style.css)
src/sound.js       the sounds of the house, silent until turned on
build.sh           stitches src/ into index.html and lists art/ for the page
test/sim.js        plays hundreds of random lives to catch errors and check balance
test/oldsaves.js   loads saves from earlier builds and plays them out
tools/play.js      walks the built page at desk and phone widths
tools/voicecheck.js  the checker for docs/voice/VOICE.md
tools/site.sh      lays out a folder a plain web host can serve
```

After changing anything in `src/`, run `./build.sh`, then `node test/sim.js 500`.

## Writing an event

```js
ev({ id:'unique', from:1797, to:1805, weight:2, cond:() => !F('someFlag'),
  title:'A Title',
  text:() => `What walks in.`,
  choices:[
    {t:'What you do.', note:'£40', go:() => { add({money:-40, goodwill:3}); reg('pryor', 1, 'What he will remember'); return `What comes of it.`; }}
  ]});
```

`fixed:'1800-2'` pins an event to a year and season (0 spring, 3 winter). `follow:true` marks one that only arrives through `later('id', seasons)`.

House rules for the prose: British spelling, no em dashes, nothing the period would not recognise, and the joke goes in the detail.

## Saves

The game writes itself to the browser's `localStorage` at every choice and every quarter, and the page resumes the estate in hand when it loads. A save carries `S.v`, the `SAVE_VERSION` that wrote it. `load()` in `src/engine.js` never discards an older save: `mend()` runs the numbered steps in `MENDS`, then fills in whatever a new estate has and the old one lacks, and keeps a copy of the save as it was under `hatherley-combe-save-before`.

Adding a field, a person or a table needs nothing. Renaming or reshaping something a save holds needs a step in `MENDS` and `SAVE_VERSION` raised by one. Do not change `SAVE_KEY`.

`node test/oldsaves.js` loads saves written by earlier builds into this one and plays each to the end. Run it before a deploy.

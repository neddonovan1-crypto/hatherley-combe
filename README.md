# Hatherley Combe

A role-playing estate game set in Berkshire between 1795 and 1815. You inherit two thousand acres, a mortgage, a steward who smiles like a ledger, and twenty-one years of war, dearth and county society. One season to a turn.

**Play it:** open `index.html` in any browser. No install, no server.

## What is in it

- 84 seasons, each with the quarter's accounts, somebody waiting in the hall, and one undertaking of your own choosing.
- A point-buy at the start: three points, nine advantages that cost them, eight encumbrances that pay them back.
- About sixty written events. Half are pinned to the calendar (the Speenhamland meeting of 1795, the Bank Restriction, the income tax, the dearth of 1800, the first Census, the Peace of Amiens, the invasion beacons, Trafalgar, the Jubilee, General Ludd, the Corn Bill, Waterloo). The rest wander in when their conditions suit.
- Thirteen people who remember what you did to them, and act on it years later.
- A working estate: rents (indulgent, customary or rack), a home farm sold at each year's real wheat price, poor rates, land tax, Mr Pitt's income tax at its historical rates, a mortgage, and six works you may put in hand.
- An ending written for you by the Reading Mercury.

## Layout

```
src/data.js      prices, harvests, people, news, quiet-season vignettes
src/traits.js     advantages and encumbrances for character creation
src/events1.js   the fixed calendar
src/events2.js   the wandering pool
src/engine.js    seasons, ledger, undertakings, the reckoning
src/ui.js        rendering
src/style.css    the page
build.sh         stitches src/ into index.html
test/sim.js      plays hundreds of random lives to catch errors and check balance
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

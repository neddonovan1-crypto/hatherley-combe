# The estate economy: a proposal

Nothing here is built. This is a design to argue with, backed by a paper model (`tools/econsim.js`) that plays it through 1795 to 1815. The record it leans on is in [RESEARCH.md](RESEARCH.md).

## What is wrong now

The present economy is one rent figure, three settings for it, a field of wheat and a list of things to buy. It works, and it is thin. Three faults matter.

The rental rises by an eighth in 1800, 1805 and 1810 whatever the squire does, so the great fact of the period, that land doubled its income and then fell off a cliff, happens to him without his having bet on it. The works are purchases with a flat reward, so the only question is whether the purse will stand them. And debt has one speed. A man is solvent until minus three thousand pounds, at which point he is in the Isle of Man.

A squire who buys every work goes under about as often as not. That is fair. But he goes under without having been offered a single way out, and the ways out are where the stories are.

## What the good games do

I went through the eight named and stole one thing from each.

**Frostpunk** tells the player the storm is coming and lets him spend the whole game deciding how much of today to burn for it. Our storm is peace. Wheat at 126 shillings in 1812, 74 in 1814, 65 in 1815. Every decision in the boom years should be a wager on how long the war lasts.

**Banished** kills villages by lag. The mistake was made three winters ago. So: soil that takes years to wear out and years to mend, leases that bind for fourteen, tenants who break two harvests after the price that broke them.

**King of Dragon Pass** hides its arithmetic behind advisers who each want something. We already have Crabbe, who profits from muddle, and Hartopp, who would drain the churchyard. Let them give the estimates, and let them be wrong in character.

**Crusader Kings** makes the family the balance sheet. A daughter is a portion to be found. An heir who comes of age is a signature the squire needs. Marriage is the only honest way to pay off a mortgage in one afternoon.

**Lords and Villeins** taxes families, not tiles. The player negotiates with the Thornes of Long Barrow and never with "agriculture".

**Reigns** punishes both ends of every meter. Standing too high gets a man pricked for High Sheriff, which costs several hundred pounds and cannot be refused.

**Victoria** gives each class its own interest in the same price. Dear bread enriches the farmer, pays the landlord at one remove, and starves the labourer, who then appears on the poor rate the farmer pays.

**Caesar** sends the legions when the debt to Rome goes unpaid, but it sends a letter first. Ruin should arrive in stages, each with a door.

Two outside the list earn a mention. *Yes, Your Grace* is a queue of petitioners and a purse too small for them, which the hall already is. *Papers, Please* shows how much feeling a household account can carry when it is short by the price of the heating.

## The principle

**The squire does not farm. He sets terms.** Terms with tenants, with lenders, with his son, with the county. Each is agreed on a quarter day, lasts for years, and is tested by a price he cannot control. That gives few decisions, each heavy, each with somebody's name on it. It also suits a page that shows one paper at a time.

Cash, the mortgage, rents, the home farm, works and the cost of cutting a figure all stay. What changes is that each becomes a contract with a term.

## 1. The rent roll

Seven lines in the Steward's Book where there is now one. The total is the present £1,620, so nothing existing moves.

| Holding | Acres | Tenant | 1795 rent | Held |
|---|---|---|---|---|
| Long Barrow, down and sheepwalk | 380 | Abigail Thorne | £300 | Lease, falls in 1802 |
| Kennet Bottom, wet clay | 240 | Widow Harris | £170 | At will. Ruinous |
| Starveall, flints | 250 | new | £180 | Lease, falls in 1803 |
| Mill Farm and Hatherley Mill | 150 | Pocock | £290 | Lease, falls in 1799 |
| Church Farm, strips in the open field | 260 | new | £210 | At will |
| Coldharbour, good loam | 210 | new | £250 | Lease, falls in 1808 |
| The small holdings | 160 | sundry | £220 | At will |

That is 1,650 acres let at just under a pound an acre, which is where Mavor and the rent historians both put Berkshire. The home farm of 200 and 150 of wood and park make up the two thousand.

Behind the page sit two numbers for each year, both worked from the game's own wheat prices and printed in the table further down. The **letting value** is what a farm fetches if let this Lady Day. It creeps up, never falls while the war lasts, and peaks at 1.82 times the 1795 rent in 1813. The **tenant's means** is what the farm can pay this year. It leaps about: 2.28 in the dearth of 1801, 1.08 in 1804, 2.36 in 1812, 1.22 in 1815.

The gap between them is the game. A tenant whose rent is under his means lays money by. One whose rent is over it eats his savings, then falls into arrear, then breaks.

### When a lease falls in

A paper arrives, perhaps one every second year. The squire chooses a tenure and a rent.

- **At will.** Year to year. The rent follows the letting value each Lady Day, an eighth at most. The tenant mends nothing, since he may be out by Michaelmas. Mavor likens him to the man who sat calmly through a storm that was pulling the house down because he was "only a lodger".
- **Seven years.** The rent is fixed. He keeps the place up.
- **Fourteen years.** Fixed. Once he has money by and five years to run, he improves the farm at his own cost, and the farm is worth more when it next falls in.
- **A corn rent.** The rent moves with the price of wheat, as the colleges take theirs. Less in the fat years, no arrears in the lean. Mavor recommends it and nobody takes his advice.

And a level: **easy** (seven-eighths of the letting value; the sitting tenant stays and the parish approves), **fair**, or **rack** (an eighth over; the old tenant may be outbid by a stranger with a thin purse).

This was the argument of the age. Lord Darnley's agent moved farms from leases to tenancies at will between 1795 and 1812 to catch the rise. By 1809 Mavor could find hardly a new lease in Berkshire longer than fourteen years. A lease signed in 1802 is a present to the tenant for a decade, and a lease signed at the peak of 1812 is a present to nobody.

### When a tenant cannot pay

He comes to the hall. **Abate** the year's shortfall and goodwill rises; the lease stands. **Hold him to it** and the arrears run on until he breaks. Then the farm is on the squire's hands for a year under a bailiff, earns little, and re-lets a tenth under the market in worse order. Kentish landlords after 1814 chose abatement almost to a man, at 15 to 30 per cent. The existing `abatement` event becomes this, per farm.

## 2. Works that belong to a place

Each work now changes a named farm, and the return comes through the rent roll: at the next letting, or at once if the tenant agrees to pay five per cent on the outlay, which was the usual bargain.

| Work | Cost | What it does | Return on 1795 values |
|---|---|---|---|
| Drain Kennet Bottom | £520 | Ruinous to fair order: £161 a year becomes £230 | 13% |
| Float the meadows at Mill Farm | £300 | Letting value up 15% | 14% |
| Rebuild the mill | £420 | Letting value up 12%; the parish pleased | 8% |
| Four-course on the home farm, with a flock | £460 | More corn off fewer acres; the land mends | about 30% |
| Inclose the common and open field | £2,400 over three years | Church Farm up by half; a new farm of 200 acres; tithe gone | 10% |
| Yearly repairs | about £90 | Stops at-will farms sliding a grade | n/a |

Every return rises with the letting value, so the drains that pay 13 per cent in 1795 pay 20 by 1805. All of them beat a five per cent mortgage. Borrowing to improve is therefore right, and that is the trap, because the debt is fixed and the rents are not.

Inclosure deserves its own note. I have put it at £2,400 where the game says £1,200, since the Act and commissioners were the cheap part and Mavor reckons ten pounds an acre to bring waste into cultivation. It also voids every at-will tenancy it touches, which gives the squire one great re-letting. Its cost in goodwill stays as written.

The house works (the front, the pinery, the ice-house, the oaks, the cottages, the school, the road) keep their present prices. They buy regard, which section 5 makes worth having.

## 3. The home farm

Two hundred acres in hand, and for the first time a wages bill. Mavor's account of an acre of wheat (£11 13s out, £18 8s in) sets the proportions: in an ordinary year the farm grosses about a thousand pounds and clears four hundred.

One setting, changed at Michaelmas if at all.

- **The old course.** Wheat, spring corn, fallow. Safe. The land holds its heart.
- **The four-course.** Needs the work above. A tenth more corn, sheep on the turnips, and the land improves.
- **Corn while it pays.** Wheat after wheat at war prices. Half as much again to sell, and the soil loses heart every year it is done. Splendid in 1800. By the fourth year the yield has gone and takes six to come back.

Plus the question the `flour` and `dearth` events already ask: sell at harvest, or hold the ricks for a spring price. And wages, which the voice thread's reading of Eden and Mavor puts at nine shillings a week in 1795 and nine to twelve by 1809. The game says seven against nine; it should say nine against ten.

A squire tired of all this may let the home farm for a steady £190 and be rid of the weather.

**The woods** come in as a small living and a large reserve. Underwood cut in rotation brings about £130 a year. The standing oak is worth £750 a fall, three falls in all, rising with the Navy's appetite. It is the squire's last honest money, and under the settlement it may not be his to cut.

## 4. Credit, in six rungs

| Rung | Cost | Limit | The catch |
|---|---|---|---|
| The mortgage (Mr Tidmarsh) | 5%, the legal ceiling | £9,000 under the settlement | Cannot be had, and may be called, in a tight year |
| The Funds | Consols at the year's price | what he can spare | Bought at 51 in 1797 they pay near 6%; sold in a hurry they lose |
| The Wyvern Bank | 5% and a commission | £600 | It may stop payment |
| Timber | none | three falls | Standing; and Edmund's consent |
| An annuity on his life | £100 a year for £720 down, about 14% | £3,600 | Outside the usury law, which is the point of it |
| Tradesmen's bills | 12% | until they stop calling | Standing falls every quarter |

The tight years are real. The law held a mortgage to five per cent, and Consols yielded more than that in 1797 to 1799, 1803 to 1805, 1812, 1813 and 1815. In those years nobody lends on land, and a mortgagee may want a thousand back at two quarters' notice. A squire of standing finds a friend to take the debt over. One without sells an annuity.

So the cheap money vanishes exactly when the squire is short, and the mortgage becomes something to be managed across years. The present `bank` event of 1797 opens this. A second, around 1815, closes the Wyvern Bank on whoever still keeps his balance there. The Windsor Bank went that way in February 1816, with £17,789 of its notes in people's pockets.

### Ruin by stages

1. **Living on bills.** As now.
2. **The tradesmen stop.** Below about minus £1,500 the household is forced down a grade.
3. **An execution in the house.** Starveall or Coldharbour is sold at 26 years' purchase. The debt clears. The rent is gone for good, and Lord Cullerne is the buyer.
4. **A second farm.**
5. **The Isle of Man.**

In the model the squire who buys everything sells a farm in nearly every life and is sold up in one life in twenty. He ends with the best rent roll in the county and eleven thousand pounds of debt. That reads to me as a better fate than a coin toss for the auctioneer.

## 5. The cost of being somebody

The household line becomes a choice of four establishments, which standing then drifts towards. Standing stops being a score to push and becomes a state to keep up.

| Establishment | A year in 1795 | Standing settles near |
|---|---|---|
| Retrenched | £800 | 25 |
| Plain | £1,100 | 42 |
| Handsome | £1,500 | 60 |
| Splendid | £2,100 | 80 |

Its prices rise three per cent a year to 1813, because everything did. Going up a grade is easy. Coming down costs the family and the county's opinion at once, so the squire who went Handsome on the rents of 1811 is stuck in 1815.

Regard has to be worth the money. So:

- **Standing** finds a friend when the mortgage is called, makes the children's matches, gets a Bill through, and above 75 gets a man made Sheriff.
- **Goodwill** brings rents in on the day, holds down the poor rate, and gets the harvest home. Below 25 there are outrages: a rick, a ewe, a keeper's head. The model's rack-renter pays for one about one year in four.
- **The household** is Edmund's signature and Henrietta's economy.

Parliament should cost what it cost. The History of Parliament has Wallingford's two hundred voters at twenty guineas each, paid through a shoemaker called the Miller, and a Reading seat at four thousand pounds in treats "without any man actually receiving a farthing by way of a bribe". Wyvern at £3,500 is about right.

## 6. The family as a ledger

**Edmund comes of age in 1797.** Under a strict settlement the squire is tenant for life. He cannot sell, can charge the estate only so far, and may not fell timber. When the heir turns twenty-one, father and son can remake the settlement together, and it is the one day in a generation when the estate's debts and income may be set straight. Edmund's price is an allowance. What the squire gets depends on what he asks: the right to charge more for Kitty's portion, to sell an outlying farm, to cut the oak. A son who has been bullied since 1795 may not sign.

**Kitty's portion** is a sum chosen: £1,000, £2,000, £3,000. It sets who will have her. It is raised, as it always was, on the mortgage.

**Edmund's bride** runs the other way. Her portion comes in, against a jointure promised and a young couple's allowance.

**Land for sale.** Twice or three times a life a neighbouring farm comes up at 28 years' purchase of its current rent. Lord Darnley doubled his acreage this way between 1788 and 1820. Bought in 1798 it is the making of the estate. Bought in 1812 it yields three and a half per cent on borrowed money at five.

## 7. The reckoning

The Mercury should value the estate at what its rents will bear in 1816, not what the leases say. A roll let at rack in 1812 is then marked down in the obituary, which is where it would have been marked down in life.

## The numbers, played through

`node tools/econsim.js --tables` prints the two indices. 1.00 is a farm's 1795 rent.

| Year | Wheat | Tenant's means | Letting value | Consols | Money |
|---|---|---|---|---|---|
| 1795 | 75s | 1.39 | 1.00 | 66 | |
| 1797 | 53s | 1.16 | 1.12 | 51 | tight |
| 1799 | 69s | 1.20 | 1.19 | 59 | tight |
| 1801 | 119s | 2.28 | 1.32 | 61 | |
| 1803 | 58s | 1.26 | 1.47 | 58 | tight |
| 1804 | 62s | 1.08 | 1.50 | 57 | tight |
| 1807 | 75s | 1.58 | 1.51 | 63 | |
| 1810 | 106s | 1.96 | 1.61 | 68 | |
| 1812 | 126s | 2.36 | 1.71 | 60 | tight |
| 1813 | 109s | 2.24 | 1.82 | 59 | tight |
| 1814 | 74s | 1.38 | 1.82 | 66 | |
| 1815 | 65s | 1.22 | 1.61 | 60 | tight |

The letting value tracks Clark's Midland rent series within a few points (1.21, 1.42 and 1.69 for the three five-year spans after 1800, against 1.24 to 1.50, 1.51 and 1.61 to 1.82 here). 1804 is a small rehearsal for 1814, and the game should let the player feel it.

Seven scripted squires, 2,000 lives each. Net worth is purse and Funds less debts, and every one of them starts £3,100 under water.

| Squire | What he does | Net, 1815 | Rent roll, 1815 | Sells land | Sold up |
|---|---|---|---|---|---|
| The Sitter | Plain living, renews every lease at fair, builds nothing | −£1,140 | £2,990 | never | never |
| The Careful Man | Retrenches four years, corn rents, drains, pays down, buys Consols at 51 | +£7,260 | £2,390 | never | never |
| The Improver | Everything for the land by 1802, on the mortgage; high wages | +£5,650 | £3,670 | never | never |
| The Rack-Renter | At will, an eighth over, holds tenants to it | −£580 | £3,220 on paper | never | never |
| The Figure | Handsome then Splendid, the front, London, a seat in 1807 | n/a | n/a | always | always, in 1806 or 1807 |
| Buys Everything | Every work, two a year, Handsome | −£11,080 | £3,420 | 98% | 5% |
| The Late Convert | Idles to 1808, then drains, incloses and lets at rack on the rents of 1809 | −£7,580 | £3,800 | never | never |

What I take from it. Doing nothing treads water, which is the right floor. Prudence and improvement both pay and neither dominates: the Careful Man ends richer, the Improver ends with half as much rent again and a parish that likes him. The Rack-Renter leads until 1813 and then watches his receipts drop from £3,500 to £2,200 in two years as tenants break; the £3,220 in the table is what his leases say, which is no longer what he is paid. The Late Convert has the grandest rent roll in the book and eight and a half thousand of debt against rents that have already begun to fall. The Figure cannot be afforded on two thousand acres, and Crabbe should say so by 1803.

The weak points, plainly. This is a model of the proposal and not the game. The hall's sixty events are one random sum of about £170 a year, the seven squires follow scripts, and steps are yearly where the game's are quarterly. The crash also bites late, because tenants with savings last out 1815. The same model run on to 1816 would hurt the rack-renters much more, which is one reason for section 7. All of it wants re-running inside `test/sim.js` once there is an engine to run.

## How I would build it

Three pull requests, each playable, after the ledger and character work have merged so nobody is editing the same file twice.

1. **The rent roll.** Seven farms, the two indices, leases falling in, abatement. A Rent Roll tab in the Steward's Book. This is most of the value.
2. **Credit and the household.** The six rungs, tight years, the Funds, staged ruin, the four establishments.
3. **The home farm and the family.** Courses and heart, the woods, the settlement of 1797, portions, land for sale, the new reckoning.

## What I need from Ned

- Whether seven named farms is the right grain, or whether four would do the same work with less to read.
- Whether ruin by stages is wanted. It is kinder, and some would say softer.
- Whether the Figure should be possible at all on this estate, perhaps through an heiress, or whether "you cannot afford it" is the lesson.

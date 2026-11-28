# Map pieces of the later years (PR 61)

How the toll bridge, paper mill, wharf, barges, the Bell, lodge, model farm, steam engine, park, obelisk, tower, hermitage and church
clock were put on the plan. The wing and conservatory are cut by `tools/hall/cut.py`.

1. `comp.py <season> <ids>` lays the pieces already built on a season's sheet (`ground-<season>.png`), so the new things are drawn
   among what will stand beside them.
2. Magnific draws the new things into that sheet (`images_generate`, the sheet as an `image` reference, 3:2, 4k, "Edit this estate
   survey plan by adding ... Change nothing else"). Spring first. For another season give two references, that season's ground and
   the finished spring sheet: "draw exactly those things into the first image, same place, size and shapes".
3. A second pass adds what stands on the first (smoke, barges, obelisk, clock) to the first pass's own result.
4. `cut.py 0,1,2,3` keeps only what each drawing changed inside the region named in `pieces.json`
   (`id: [drawing, its ground, region in hundredths, large?, pieces whose ground it also claims]`), with one mask from spring for
   all four seasons, and prints the boxes for `src/planart.js`.

File names in `pieces.json` are those in `/mnt/project-files/art/plan/later/`: `first-<n>` and `second-<n>` are the two passes;
in spring the park and the inn came from their own drawings (`park-0`, `inn-0`), and the second pass was drawn on `master-0`
(for spring `firstground-0` is `master-0`; for the other seasons it is `first-<n>`).

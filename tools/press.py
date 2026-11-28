#!/usr/bin/env python3
"""Presses the pictures for a web host. Usage: python3 tools/press.py <site folder> (tools/site.sh calls it).

The repo keeps every picture in art/ as it was made. A site gets them pressed into <site>/p/ instead: each one as WebP, in a desk size and a
small size (phones and small laptops), under a name that carries a mark of its contents, so the host may tell browsers to keep them for good and
a redrawn picture still arrives at once under its new name. The icons are also packed into one sheet. The page is told where everything went by
a PRESS table written into the site's index.html, and the stylesheet's own pictures are pointed at their pressed copies.

Nothing here need be told about a new picture: whatever is in art/ is pressed by the rule for its folder (RULES, first match wins).
Pressed copies are kept in .press/ so that a second laying-out is quick.
"""
import fnmatch, hashlib, io, json, os, re, shutil, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
ART, KEEP = os.path.join(ROOT, 'art'), os.path.join(ROOT, '.press')
MARK = 'press-1'      # change this to press everything afresh
PLAIN, CLEAR = 70, 84  # WebP quality: a picture without transparency, and one with
CELL = 128             # an icon on the sheet, in pixels

# pattern, widest on a desk, widest in the small size. A whole number is a width in pixels; a fraction is a share of the picture's own width; None leaves it be.
RULES = [
    ('plan/s/*',       .65, .4),     # strips of frames, drawn half as large again as the sheet can show them
    ('plan/*',         None, .6),    # the sheet and everything laid on it
    ('events/*',       900, 720), ('undertakings/*', 900, 720), ('ventures/*', 900, 720), ('honours/*', 900, 720), ('frontispiece.*', 900, 720),
    ('endings/*',      1500, 1000), ('opening/*', 1500, 1000),
    ('places/*',       1000, 720),
    ('seasons/*',      1000, 720),
    ('portraits/*',    None, 480),
    ('arms/*',         400, 240),
    ('icons/*',        CELL, CELL),
    ('ui/*',           None, None),  # named by the stylesheet, which has one size for everybody
    ('*',              None, .75),
]
PICTURES = ('.jpg', '.jpeg', '.png', '.webp')

def rule(rel):
    for pat, desk, small in RULES:
        if fnmatch.fnmatch(rel, pat): return desk, small
    return None, None

# how many frames in each strip (src/stock.js), so that a strip is never cut to a width that splits a frame across two pixels
try: FRAMES = {m.group(1): int(m.group(2)) for m in re.finditer(r'(\w+):\{n:(\d+)', open(os.path.join(ROOT, 'src', 'stock.js'), encoding='utf-8').read())}
except OSError: FRAMES = {}

def width(w, r, rel=''):
    if r is None: return w
    n = FRAMES.get(os.path.basename(rel).split('-walk.')[0], 1) if '-walk.' in rel else 1
    return min(w, r if r >= 1 else max(1, round(w / n * r)) * n)

def encode(im, w):
    if w != im.width: im = im.resize((w, max(1, round(im.height * w / im.width))), Image.LANCZOS)
    b = io.BytesIO()
    if im.mode == 'RGBA': im.save(b, 'WEBP', quality=CLEAR, alpha_quality=92, method=6, exact=False)
    else: im.save(b, 'WEBP', quality=PLAIN, method=6)
    return b.getvalue()

def press(rel):
    """Returns (rel, value for the PRESS table, [file names under p/]). Writes into the keeping folder only what is not already there."""
    src = os.path.join(ART, rel); raw = open(src, 'rb').read()
    stem, ext = os.path.splitext(rel); desk, small = rule(rel)
    h = hashlib.sha1(raw + repr((MARK, PLAIN, CLEAR, desk, small, FRAMES if '-walk.' in rel else 0)).encode()).hexdigest()[:8]
    def put(name, make):
        f = os.path.join(KEEP, name)
        if not os.path.exists(f):
            os.makedirs(os.path.dirname(f), exist_ok=True); d = make()
            with open(f + '.part', 'wb') as o: o.write(d)
            os.replace(f + '.part', f)
        return name
    if ext.lower() not in PICTURES:
        return rel, h + ext, [put(f'{stem}.{h}{ext}', lambda: raw)]
    im = Image.open(io.BytesIO(raw)); im.load()
    if im.mode not in ('RGB', 'RGBA'): im = im.convert('RGBA' if im.mode in ('LA', 'PA') or 'transparency' in im.info else 'RGB')
    wd, ws = width(im.width, desk, rel), width(im.width, small, rel)
    def big():
        if ext.lower() == '.webp' and wd == im.width: return raw   # already pressed: a second pressing would only wear it
        return encode(im, wd)
    return rel, h, [put(f'{stem}.{h}.webp', big), put(f'{stem}.{h}.s.webp', lambda: encode(im, ws) if ws != wd else open(os.path.join(KEEP, f'{stem}.{h}.webp'), 'rb').read())]

def sheet(icons):
    """The icons side by side on one strip. Returns (file name under p/, their names in order)."""
    names = sorted(os.path.splitext(os.path.basename(r))[0] for r in icons); by = {os.path.splitext(os.path.basename(r))[0]: r for r in icons}
    raws = [open(os.path.join(ART, by[n]), 'rb').read() for n in names]
    h = hashlib.sha1(b''.join(raws) + repr((MARK, PLAIN, CELL, names)).encode()).hexdigest()[:8]; name = f'icons.{h}.webp'; f = os.path.join(KEEP, name)
    if not os.path.exists(f):
        strip = Image.new('RGB', (CELL * len(names), CELL), 'white')
        for i, raw in enumerate(raws):
            im = Image.open(io.BytesIO(raw)).convert('RGBA'); side = min(im.size)   # as object-fit:cover would show it
            im = im.crop(((im.width - side) // 2, (im.height - side) // 2, (im.width + side) // 2, (im.height + side) // 2)).resize((CELL, CELL), Image.LANCZOS)
            strip.paste(im, (i * CELL, 0), im)
        os.makedirs(KEEP, exist_ok=True); strip.save(f, 'WEBP', quality=PLAIN + 8, method=6)
    return name, names

def main(site):
    page = os.path.join(site, 'index.html'); html = open(page, encoding='utf-8').read()
    rels = sorted(os.path.relpath(os.path.join(d, f), ART).replace(os.sep, '/') for d, _, fs in os.walk(ART) for f in fs if not f.startswith('.'))
    with ProcessPoolExecutor() as pool: done = list(pool.map(press, rels, chunksize=8))
    table, files = {rel: v for rel, v, _ in done}, [n for _, _, ns in done for n in ns]
    icons = [r for r in rels if r.startswith('icons/') and r.lower().endswith(PICTURES)]
    press_js = {'f': table}
    if icons: name, names = sheet(icons); files.append(name); press_js['i'] = {'u': name, 'n': names}
    out = os.path.join(site, 'p'); shutil.rmtree(out, ignore_errors=True)
    for n in files:
        os.makedirs(os.path.dirname(os.path.join(out, n)), exist_ok=True); shutil.copyfile(os.path.join(KEEP, n), os.path.join(out, n))
    # the page's own list must agree with what was pressed, or it was built from another art/
    m = re.search(r'const ART = new Set\(\[(.*?)\]\);', html)
    if not m: sys.exit('press.py: no ART list in ' + page)
    listed = set(re.findall(r"'([^']+)'", m.group(1))); lost = sorted(listed - set(table))
    if lost: sys.exit('press.py: index.html lists pictures that art/ has not got (run ./build.sh): ' + ', '.join(lost[:8]))
    html = html[:m.start()] + 'const PRESS = ' + json.dumps(press_js, separators=(',', ':')) + ';\n' + html[m.start():]
    def css(u):
        v = table.get(u.group(1))
        if not v: print('press.py: the stylesheet names a picture that is not in art/: ' + u.group(1), file=sys.stderr); return u.group(0)
        stem = os.path.splitext(u.group(1))[0]
        return 'url(p/' + stem + '.' + (v if '.' in v else v + '.webp') + ')'
    html = re.sub(r'url\(art/([^)$]+)\)', css, html)
    open(page, 'w', encoding='utf-8').write(html)
    size = lambda pick: sum(os.path.getsize(os.path.join(out, n)) for n in files if pick(n)) / 1048576
    print(f'pressed {len(rels)} pictures: art/ {sum(os.path.getsize(os.path.join(ART, r)) for r in rels) / 1048576:.1f} MB, desk size {size(lambda n: not n.endswith(".s.webp")):.1f} MB, small size {size(lambda n: n.endswith(".s.webp") or not n.endswith(".webp")):.1f} MB')

if __name__ == '__main__':
    if len(sys.argv) != 2: sys.exit(__doc__)
    main(sys.argv[1])

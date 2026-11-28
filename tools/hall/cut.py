"""Cuts the Hall out of the redrawn park and files it as plan pieces.

The Hall on the plan is not a separate drawing laid on. Each season's park was cut from that season's sheet
(tools/hall/src/park-<season>.jpg), Magnific drew the house into the clearing in the sheet's own hand, and this
takes back only what changed: the house, its shadow, the sweep and the trees about it. Since the rest of the
drawing is the sheet itself, the piece has no edge to show.

  python3 tools/hall/cut.py <folder holding old-, front-, extras-, coach-, garden-, wingo-, conso-, wingf- and consf-0..3.png>

extras-<season> is the stone-fronted park with the coach at the door, the ice-house in the shrubbery and the
parterre on the lawn drawn in, coach-<season> the brick house with the coach on its own gravel, and garden-<season> that again with
its parterre; each of these is cut out by what it changed.
Prints the boxes for src/planart.js.
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..', '..'); OUT = os.path.join(ROOT, 'art', 'plan')
W, H = 2400, 1600
CROP = (740, 440, 1700, 1080)            # the park, in sheet pixels
CW, CH = CROP[2] - CROP[0], CROP[3] - CROP[1]
K = 2                                     # pieces are kept at twice the sheet's size
# The park inside its ring of lane and hedge, in pixels of the 1920-wide park picture.
PARK = [(430,700),(470,620),(620,540),(800,515),(960,540),(1000,600),(1000,700),(1200,745),(1340,770),(1350,860),(1280,960),(1010,1010),(1000,1090),(880,1095),(600,1010),(480,880)]
# The lesser things: name, the drawing it is in, the drawing that one was made from, how great a change counts, how far to grow it,
# and the ground it may claim in the same pixels. In one drawing the earlier takes its ground first.
EXTRAS = [('carriage', 'extras', 'front', 40, 11, [(680,890),(875,890),(875,975),(838,975),(800,962),(680,962)]),
          ('parterre', 'extras', 'front', 26, 17, [(700,950),(880,950),(880,1035),(700,1035)]),
          ('icehouse', 'extras', 'front', 26, 17, [(425,715),(585,715),(585,850),(425,850)]),
          ('carriage-old', 'coach', 'old', 26, 17, [(630,845),(940,845),(940,1015),(630,1015)]),
          ('parterre-old', 'garden', 'coach', 26, 17, [(650,925),(1010,925),(1010,1045),(650,1045)]),
          # The new wing (wingo on the brick house, wingf on the stone front), and the conservatory at its end (conso, consf),
          # which is whatever its drawing changed in the drawing of the wing alone.
          ('wing-old', 'wingo', 'old', 26, 17, [(1000,690),(1460,690),(1460,1020),(1000,1020)]),
          ('conservatory-old', 'conso', 'wingo', 26, 17, [(1230,740),(1460,740),(1460,1020),(1230,1020)]),
          ('wing', 'wingf', 'front', 26, 17, [(1000,690),(1460,690),(1460,1020),(1000,1020)]),
          ('conservatory', 'consf', 'wingf', 26, 17, [(1230,740),(1460,740),(1460,1020),(1230,1020)])]

def load(src, state, n): return Image.open(os.path.join(src, '%s-%d.png' % (state, n))).convert('RGB').resize((CW * K, CH * K), Image.LANCZOS)
def base(n): return Image.open(os.path.join(OUT, '%d.jpg' % n)).convert('RGB').crop(CROP).resize((CW * K, CH * K), Image.LANCZOS)

def main(src):
    park = Image.new('L', (CW * K, CH * K), 0); ImageDraw.Draw(park).polygon([(x * K * CW / 1920, y * K * CW / 1920) for x, y in PARK], fill=255)
    inpark = np.asarray(park) > 0
    bases = [base(n) for n in range(4)]
    drawn = {s: [load(src, s, n) for n in range(4)] for s in ('old', 'front')}
    # One mask for all eight, so that a season fading into the next changes nothing but the paint.
    changed = np.zeros((CH * K, CW * K), bool)
    for s in drawn:
        for n in range(4):
            a = np.asarray(bases[n].filter(ImageFilter.GaussianBlur(3)), int); b = np.asarray(drawn[s][n].filter(ImageFilter.GaussianBlur(3)), int)
            changed |= np.abs(a - b).max(axis=2) > 30
    changed &= inpark
    m = Image.fromarray((changed * 255).astype('uint8')).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.MinFilter(13))
    m = Image.fromarray(((np.asarray(m) > 0) & (np.asarray(park.filter(ImageFilter.MaxFilter(15))) > 0)).astype('uint8') * 255)
    bb = m.getbbox(); pad = 20; bb = (max(0, bb[0] - pad), max(0, bb[1] - pad), min(CW * K, bb[2] + pad), min(CH * K, bb[3] + pad))
    alpha = m.filter(ImageFilter.GaussianBlur(7))
    still = np.asarray(m.filter(ImageFilter.MaxFilter(41))) == 0
    for s in drawn:
        for n in range(4):
            d = np.asarray(drawn[s][n], float); b = np.asarray(bases[n], float)
            g = np.median(b[still], axis=0) / np.median(d[still], axis=0)      # the redrawing comes back a shade off: bring its paper to the sheet's
            d = np.clip(d * g, 0, 255).astype('uint8')
            rgba = np.dstack([d, np.asarray(alpha)])[bb[1]:bb[3], bb[0]:bb[2]]
            Image.fromarray(rgba, 'RGBA').save(os.path.join(OUT, 'f', 'hall-%s-%d.webp' % (s, n)), quality=90, method=6)
            print(s, n, 'paper', g.round(3))
    box = [round((CROP[0] + bb[0] / K) / W * 100, 3), round((CROP[1] + bb[1] / K) / H * 100, 3), round((bb[2] - bb[0]) / K / W * 100, 3), round((bb[3] - bb[1]) / K / H * 100, 3)]
    print('box', box, 'size', (bb[2] - bb[0], bb[3] - bb[1]))
    # What stands about the house. Each is whatever the drawing of it changed, inside its own ground.
    def tone(im, n):
        d = np.asarray(im, float); g = np.median(np.asarray(bases[n], float)[still], axis=0) / np.median(d[still], axis=0); return np.clip(d * g, 0, 255).astype('uint8')
    toned = {}
    def get(s, n):
        if (s, n) not in toned: toned[(s, n)] = tone(drawn[s][n] if s in drawn else load(src, s, n), n)
        return toned[(s, n)]
    taken = {}
    for name, source, against, thr, grow, ground in EXTRAS:
        gm = Image.new('L', (CW * K, CH * K), 0); ImageDraw.Draw(gm).polygon([(x * K * CW / 1920, y * K * CW / 1920) for x, y in ground], fill=255)
        free = (np.asarray(gm) > 0) & ~taken.get(source, np.zeros((CH * K, CW * K), bool))
        ch = np.zeros((CH * K, CW * K), bool)
        for n in range(4):
            a = np.asarray(Image.fromarray(get(against, n)).filter(ImageFilter.GaussianBlur(2)), int); b = np.asarray(Image.fromarray(get(source, n)).filter(ImageFilter.GaussianBlur(2)), int)
            ch |= np.abs(a - b).max(axis=2) > thr
        m = Image.fromarray(((ch & free) * 255).astype('uint8')).filter(ImageFilter.MaxFilter(grow)).filter(ImageFilter.MinFilter(grow - 6))
        m = Image.fromarray(((np.asarray(m) > 0) & free).astype('uint8') * 255)
        taken[source] = taken.get(source, np.zeros((CH * K, CW * K), bool)) | (np.asarray(m) > 0)
        bb = m.getbbox(); pad = 10; bb = (bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad); al = m.filter(ImageFilter.GaussianBlur(3))
        for n in range(4):
            Image.fromarray(np.dstack([get(source, n), np.asarray(al)])[bb[1]:bb[3], bb[0]:bb[2]], 'RGBA').save(os.path.join(OUT, 'f', '%s-%d.webp' % (name, n)), quality=90, method=6)
        print(name, [round((CROP[0] + bb[0] / K) / W * 100, 3), round((CROP[1] + bb[1] / K) / H * 100, 3), round((bb[2] - bb[0]) / K / W * 100, 3), round((bb[3] - bb[1]) / K / H * 100, 3)])
    return box

if __name__ == '__main__': main(sys.argv[1])

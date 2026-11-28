import sys, re, json
from PIL import Image, ImageDraw
R='/home/user/hatherley-combe/'
src=open(R+'src/planart.js').read()
BOX={m[0]:[float(x) for x in m[1].split(',')] for m in re.findall(r"'([\w-]+)':\[([^\]]+)\]",src)}
def comp(N, ids, W=2400,H=1600):
    im=Image.open(R+'art/plan/%d.jpg'%N).convert('RGB').resize((W,H))
    for k in BOX:
        if k not in ids: continue
        b=BOX[k]
        try: p=Image.open(R+'art/plan/f/%s-%d.webp'%(k,N)).convert('RGBA')
        except Exception as e: print('no',k); continue
        p=p.resize((round(b[2]*W/100),round(b[3]*H/100)),Image.LANCZOS); im.paste(p,(round(b[0]*W/100),round(b[1]*H/100)),p)
    return im
if __name__=='__main__':
    ids=sys.argv[2].split(','); N=int(sys.argv[1]); im=comp(N,ids); im.save('cb%d.png'%N)
    g=im.copy(); d=ImageDraw.Draw(g)
    for i in range(0,100,10):
        d.line((i*24,0,i*24,1600),fill=(255,0,0),width=2); d.line((0,i*16,2400,i*16),fill=(255,0,0),width=2); d.text((i*24+4,4),str(i),fill=(255,0,0)); d.text((4,i*16+4),str(i),fill=(255,0,0))
    g.resize((1500,1000)).save('grid%d.jpg'%N,quality=80)

# Cuts the map pieces of the later years (PR 61). See README.md here. Run in the folder that holds the drawings.
import numpy as np, json, sys, os
from PIL import Image, ImageFilter, ImageDraw
from dm import load, dmask, W, H
from comp import BOX
R='/home/user/hatherley-combe/'
PIECES=json.load(open('pieces.json'))
def box(b):
    m=Image.new('L',(W,H),0); ImageDraw.Draw(m).rectangle((int(b[0]*W/100),int(b[1]*H/100),int(b[2]*W/100),int(b[3]*H/100)),fill=255); return m
def alpha_of(k):
    b=BOX[k]; p=Image.open(R+'art/plan/f/%s-0.webp'%k).convert('RGBA').resize((round(b[2]*W/100),round(b[3]*H/100))); m=Image.new('L',(W,H),0); m.paste(p.split()[3],(round(b[0]*W/100),round(b[1]*H/100))); return m
def masks():
    out={}; cache={}
    for fid,(ed,gr,b,big,*extra) in PIECES.items():
        key=(ed,gr)
        if key not in cache: cache[key]=dmask(load(ed%0),load(gr%0))
        reg=box(b); m=(np.asarray(cache[key])>0)&(np.asarray(reg)>0); mi=Image.fromarray((m*255).astype('uint8'))
        mi=mi.filter(ImageFilter.MaxFilter(45 if big else 21)).filter(ImageFilter.MinFilter(31 if big else 9))
        a=np.asarray(mi)>0
        for k in (extra[0] if extra else []): a=a|(np.asarray(alpha_of(k))>40)
        mi=Image.fromarray((a&(np.asarray(reg.filter(ImageFilter.MaxFilter(9)))>0)).astype('uint8')*255)
        bb=mi.getbbox()
        if not bb: print('EMPTY',fid); continue
        pad=14; bb=(max(0,bb[0]-pad),max(0,bb[1]-pad),min(W,bb[2]+pad),min(H,bb[3]+pad)); out[fid]=(mi.filter(ImageFilter.GaussianBlur(4)),bb)
    return out
def piece(fid,N,M):
    ed,gr=PIECES[fid][:2]; mk_full,bb=M[fid]; mk=np.asarray(mk_full)[bb[1]:bb[3],bb[0]:bb[2]]; ring=mk<8
    raw=np.asarray(load(ed%N),dtype=float)[bb[1]:bb[3],bb[0]:bb[2]]; bs=np.asarray(load(gr%N),dtype=float)[bb[1]:bb[3],bb[0]:bb[2]]
    lg=np.median(bs[ring],axis=0)/np.median(raw[ring],axis=0) if ring.sum()>200 else 1
    return Image.fromarray(np.dstack([np.clip(raw*lg,0,255).astype('uint8'),mk]),'RGBA'),bb
if __name__=='__main__':
    seasons=[int(x) for x in sys.argv[1].split(',')]; only=sys.argv[3].split(',') if len(sys.argv)>3 else list(PIECES); M=masks()
    for N in seasons:
        master=load(sys.argv[2]%N) if len(sys.argv)>2 and sys.argv[2]!='-' else None
        for fid in only:
            if fid not in M: continue
            p,bb=piece(fid,N,M); p.save(R+'art/plan/f/%s-%d.webp'%(fid,N),quality=86,method=6)
            if master: master.paste(p,(bb[0],bb[1]),p)
        if master: master.save('m%d.png'%N)
    B={k:[round(b[0]/W*100,3),round(b[1]/H*100,3),round((b[2]-b[0])/W*100,3),round((b[3]-b[1])/H*100,3)] for k,(m,b) in M.items()}
    json.dump(B,open('boxes.json','w')); print(json.dumps(B))

# Cut walking and grazing frames out of green-ground clips into one strip per creature.
import sys, json, numpy as np, cv2
from PIL import Image
V=sys.argv[1]; OUT=sys.argv[2]
def frames(p):
    c=cv2.VideoCapture(p); fs=[]
    while True:
        ok,f=c.read()
        if not ok: break
        fs.append(cv2.cvtColor(f,cv2.COLOR_BGR2RGB))
    return fs
def matte(f):
    a=f.astype(np.float32)
    # the ground, as a smooth field fitted from a heavy blur of the frame's own border colour
    bg=cv2.blur(a,(1,1)); edge=np.concatenate([a[:40].reshape(-1,3),a[-40:].reshape(-1,3),a[:,:40].reshape(-1,3),a[:,-40:].reshape(-1,3)])
    med=np.median(edge,axis=0)
    d0=np.linalg.norm(a-med,axis=2)
    rough=d0>30
    rough=cv2.dilate(rough.astype(np.uint8),np.ones((25,25),np.uint8))>0
    fill=a.copy(); fill[rough]=med
    bg=cv2.GaussianBlur(fill,(0,0),25)
    d=np.linalg.norm(a-bg,axis=2)
    al=np.clip((d-14)/(40-14),0,1)
    al=cv2.GaussianBlur(al,(0,0),0.6)
    solid=(al>0.5).astype(np.uint8)
    # fill enclosed pale patches (white hide, wool) that sit near the ground colour
    n,lab,st,_=cv2.connectedComponentsWithStats(1-solid,connectivity=4)
    big=1+np.argmax(st[1:,cv2.CC_STAT_AREA]) if n>1 else 0
    # background = components touching border
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))
    for i in range(1,n):
        if i not in border and st[i,cv2.CC_STAT_AREA]<1500 and KEEPHOLES is False: al[lab==i]=1
    # drop specks
    n,lab,st,_=cv2.connectedComponentsWithStats((al>0.3).astype(np.uint8),connectivity=8)
    keep=np.zeros_like(al,bool)
    for i in range(1,n):
        if st[i,cv2.CC_STAT_AREA]>400: keep|=lab==i
    al=al*cv2.dilate(keep.astype(np.uint8),np.ones((3,3),np.uint8))
    a3=al[...,None]
    col=np.where(a3>0.02,(a-(1-a3)*bg)/np.maximum(a3,0.02),a)
    return np.dstack([np.clip(col,0,255),al*255]).astype(np.uint8)
def cx(m):
    al=m[...,3].astype(float); xs=np.arange(al.shape[1]); return (al.sum(0)*xs).sum()/max(al.sum(),1)
def box(ms):
    al=np.max([m[...,3] for m in ms],axis=0)>60
    ys,xs=np.where(al); return xs.min(),xs.max(),ys.min(),ys.max()
def sig(m,c,hw,y0,y1):
    x0=int(round(c-hw)); crop=m[y0:y1,max(x0,0):x0+2*hw]
    g=cv2.resize(crop,(64,48),interpolation=cv2.INTER_AREA).astype(np.float32)
    return (g[...,:3]*g[...,3:]/255).ravel()
SPEC=json.load(open(sys.argv[3]))
meta={}
for name,sp in SPEC.items():
    KEEPHOLES=sp.get('holes',False)
    wm=[matte(f) for f in frames(f'{V}/{name}-walk.mp4')]
    n=len(wm); t=np.arange(n); c=np.array([cx(m) for m in wm])
    s0=sp.get('skip',30)
    k=np.polyfit(t[s0:],c[s0:],1); fit=np.polyval(k,t)
    fit=cv2.GaussianBlur(c.reshape(-1,1).astype(np.float32),(1,0),6,sigmaY=6).ravel() if sp.get('smooth') else fit
    # extents relative to the fitted centre
    ext=[]; 
    for i in range(s0,n):
        al=wm[i][...,3]>60; ys,xs=np.where(al); ext.append((xs.min()-fit[i],xs.max()-fit[i],ys.min(),ys.max()))
    ext=np.array(ext); hw=int(max(-ext[:,0].min(),ext[:,1].max()))+10; y0=int(ext[:,2].min())-8; y1=int(ext[:,3].max())+6
    gm=[]
    if sp.get('graze'):
        gm=[matte(f) for f in frames(f'{V}/{name}-graze.mp4')]
        gc=np.median([cx(m) for m in gm[:6]])
        x0,x1,gy0,gy1=box(gm); hw=max(hw,int(max(gc-x0,x1-gc))+10)
        dy=gy1-int(ext[:,3].max()); y0=min(y0,gy0-dy-8)
    sg=[sig(wm[i],fit[i],hw,y0,y1) for i in range(n)]
    best=None
    for P in range(sp.get('pmin',14),sp.get('pmax',44)):
        for i in range(s0,n-P):
            e=np.mean((sg[i]-sg[i+P])**2)+0.5*np.mean((sg[i+1]-sg[min(i+P+1,n-1)])**2)
            e*=1+0.0*P
            if best is None or e<best[0]: best=(e,i,P)
    e,i0,P=best; nw=sp.get('nw',10)
    idx=[i0+int(round(j*P/nw)) for j in range(nw)]
    cells=[]
    def cell(m,c,dy=0):
        x0=int(round(c-hw)); pad=cv2.copyMakeBorder(m,200,200,400,400,cv2.BORDER_CONSTANT,value=(0,0,0,0))
        return pad[y0+dy+200:y1+dy+200,x0+400:x0+400+2*hw]
    for i in idx: cells.append(cell(wm[i],fit[i]))
    info={'walk':nw,'period':P,'err':float(e),'start':i0,'px':float(-k[0])}
    if gm:
        # head going down: sample from start until the head settles, then a nibbling loop from what follows
        tops=np.array([np.where((m[...,3]>60).any(1))[0].min() for m in gm]).astype(float)
        hx=np.array([np.where((m[...,3]>60).any(0))[0].min() for m in gm]).astype(float)
        lowy=np.array([ (lambda ys,xs: ys[xs<xs.min()+25].mean())(*np.where(m[...,3]>60)) for m in gm])
        settled=np.argmax(lowy>lowy.min()+0.9*(lowy.max()-lowy.min()))
        nd=sp.get('nd',5); down=[int(round(j*settled/nd)) for j in range(1,nd+1)]
        nn=sp.get('nn',6); rest=np.linspace(settled+4,len(gm)-1,nn).astype(int)
        for i in list(down)+list(rest): cells.append(cell(gm[i],gc,dy))
        info.update({'down':nd,'nib':nn,'settled':int(settled)})
    H=y1-y0; Wc=2*hw; cw=sp['cw']; ch=int(round(H*cw/Wc))
    strip=Image.new('RGBA',(cw*len(cells),ch))
    for j,cimg in enumerate(cells):
        strip.paste(Image.fromarray(cimg).resize((cw,ch),Image.LANCZOS),(j*cw,0))
    strip.save(f'{OUT}/{name}.webp',quality=82,method=6)
    info.update({'n':len(cells),'cw':cw,'ch':ch,'srcw':Wc}); meta[name]=info; print(name,info,flush=True)
json.dump(meta,open(f'{OUT}/meta.json','w'))

"""How the balloons know where to sit. Run in this order after adding or changing a cut:

  python3 tools/balloons/masks.py    figures on each cut (u2net and u2net_human_seg, from the rembg releases, into .cache/models/)
  python3 tools/balloons/faces.py    faces and mouths on each cut (det_10g.onnx from insightface's buffalo_l, same folder)
  python3 tools/balloons/build.py    writes src/sayat.js (the speaker's mouth) and src/sayroom.js (what is drawn where)

A new cut wants a rough mark in src/sayat.js first, anywhere on the speaker's face; build.py moves it to the mouth of the nearest face found.
overrides.json mends by hand what the models get wrong: "m" sets a mouth, "p" paints a box as face (b), figure (f) or clear (c).
The page itself seats each balloon when it is drawn (balloonSeat in src/plan.js), because the seat depends on how long the words are.
"""
import os
# Builds src/sayat.js (mouths) and src/sayroom.js (what is drawn where) from faces.json, masks/ and the overrides.
import re, json, os, sys, numpy as np
from PIL import Image, ImageFilter
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache','')
repo=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','')
old=json.loads(re.search(r'const SAY_AT = (\{.*?\});', open(repo+'src/sayat.js').read(), re.S).group(1))
faces=json.load(open(sys.argv[1] if len(sys.argv)>1 else C+'faces.json'))
ov=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'overrides.json'))) if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)),'overrides.json')) else {}
ABC='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
GW,GH=24,16
at={}; room={}; flag=[]
for k,(ox,oy) in old.items():
    o=ov.get(k,{})
    fs=[f for f in faces.get(k,[]) if f['s']>=0.4 and (f['b'][2]-f['b'][0])<30]
    # the speaker: the face nearest the old mark
    best=None
    for f in fs:
        d=np.hypot(f['m'][0]-ox,(f['m'][1]-oy)/1.5)
        if best is None or d<best[0]: best=(d,f)
    if 'm' in o: at[k]=o['m']
    elif best and best[0]<14: at[k]=[round(best[1]['m'][0],1),round(best[1]['m'][1],1)]
    else: at[k]=[ox,oy]; flag.append(k)
    # the room
    im=Image.open(repo+'art/'+k+'.jpg').convert('L').resize((240,160),Image.LANCZOS)
    g=np.asarray(im).astype(np.float32)/255.
    bl=np.asarray(im.filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255.
    tex=np.asarray(Image.fromarray((np.abs(g-bl)*255).clip(0,255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)/255.
    busy=np.clip((1-bl)*0.5+tex*5.5,0,1.3)
    z=np.load(C+'masks/'+k.replace('/','__')+'.npz'); 
    rs=lambda m: np.asarray(Image.fromarray((m.astype(np.float32)*255).astype(np.uint8)).resize((240,160),Image.BILINEAR)).astype(np.float32)/255.
    sal,hum=rs(z['sal']),rs(z['hum'])
    if (hum>0.5).mean()>0.5: hum=hum*0
    if (sal>0.5).mean()>0.42: sal=sal*0
    grid=np.zeros((GH,GW),int)
    for r in range(GH):
        for c in range(GW):
            hc=(hum[r*10:r*10+10,c*10:c*10+10]>0.5).mean(); sc=(sal[r*10:r*10+10,c*10:c*10+10]>0.5).mean(); b=busy[r*10:r*10+10,c*10:c*10+10].mean()
            lv=int(np.clip(round((b-0.12)*5.2),0,4))
            if hc>0.3: lv=6
            elif sc>0.4 or hc>0.1: lv=5
            grid[r,c]=lv
    def paint(x0,y0,x1,y1,v,soft=False):
        for r in range(GH):
            for c in range(GW):
                cx0,cy0,cx1,cy1=c*100/GW,r*100/GH,(c+1)*100/GW,(r+1)*100/GH
                ix=min(x1,cx1)-max(x0,cx0); iy=min(y1,cy1)-max(y0,cy0)
                if ix>0 and iy>0 and (ix*iy)/((cx1-cx0)*(cy1-cy0))>(0.04 if v==7 else 0.3): grid[r,c]=v if not soft else max(grid[r,c],v)
    for f in faces.get(k,[]):
        if f['s']<0.4: continue
        x0,y0,x1,y1=f['b']; w=x1-x0; h=y1-y0
        if w>30: continue
        paint(x0-w*.15,y0-h*.45,x1+w*.15,y1+h*.1,7 if (w>=3.3 or np.hypot(f['m'][0]-at[k][0],f['m'][1]-at[k][1])<3) else 6, soft=True)
    for kind,x0,y0,x1,y1 in o.get('p',[]): paint(x0,y0,x1,y1,{'b':7,'f':6,'c':0}[kind])
    v=grid.reshape(-1); room[k]=''.join(ABC[v[i]*8+v[i+1]] for i in range(0,len(v),2))
head="/* Where the speaker's mouth is on each cut, in hundredths of its breadth and height. A cut with nobody on it is left out and gets no balloon. */\n"
open(repo+'src/sayat.js','w').write(head+'const SAY_AT = '+json.dumps(at,separators=(',',':'))+';\n')
head2="/* What is drawn where on each cut, for the seating of balloons: 24 squares across by 16 down, two to a letter, each from 0 (bare sky or wall) to 7 (a face). Made by tools/balloons/build.py; see the note there. */\n"
open(repo+'src/sayroom.js','w').write(head2+'const SAY_ROOM = '+json.dumps(room,separators=(',',':'))+';\n')
print('no face near the old mark, left as it was:',flag)

import os, re, json, sys, numpy as np, onnxruntime as ort
from PIL import Image, ImageDraw
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache','')
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache')
repo=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','')
sess=None
def detect_at(im, W, H, thr):
    global sess
    if sess is None:
        so=ort.SessionOptions(); so.log_severity_level=3; sess=ort.InferenceSession(S+'/models/det_10g.onnx', so, providers=['CPUExecutionProvider'])
    a=np.asarray(im.convert('RGB').resize((W,H),Image.LANCZOS)).astype(np.float32)
    x=((a-127.5)/128.).transpose(2,0,1)[None]
    o=sess.run(None,{sess.get_inputs()[0].name:x}); out=[]
    for i,st in enumerate((8,16,32)):
        sc=o[i].reshape(-1); bb=o[i+3].reshape(-1,4)*st; kp=o[i+6].reshape(-1,10)*st
        h,w=H//st,W//st
        cy,cx=np.mgrid[0:h,0:w]; ctr=np.stack([cx,cy],-1).reshape(-1,2).astype(np.float32)*st; ctr=np.repeat(ctr,2,axis=0)
        k=np.where(sc>thr)[0]
        for j in k:
            c=ctr[j]; b=[c[0]-bb[j,0],c[1]-bb[j,1],c[0]+bb[j,2],c[1]+bb[j,3]]
            p=[(c[0]+kp[j,2*t],c[1]+kp[j,2*t+1]) for t in range(5)]
            out.append((float(sc[j]),[b[0]/W,b[1]/H,b[2]/W,b[3]/H],[(u/W,v/H) for u,v in p]))
    return out
def iou(a,b):
    x0=max(a[0],b[0]);y0=max(a[1],b[1]);x1=min(a[2],b[2]);y1=min(a[3],b[3])
    i=max(0,x1-x0)*max(0,y1-y0); u=(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-i
    return i/u if u>0 else 0
def detect(im, thr=0.3):
    d=detect_at(im,960,640,thr)+detect_at(im,1632,1088,thr)+detect_at(im,2400,1600,thr)
    d.sort(key=lambda t:-t[0]); keep=[]
    for f in d:
        if all(iou(f[1],g[1])<0.35 for g in keep): keep.append(f)
    return keep
if __name__=='__main__':
    at=json.loads(re.search(r'const SAY_AT = (\{.*?\});', open(repo+'src/sayat.js').read(), re.S).group(1))
    res={}
    for i,k in enumerate(at):
        im=Image.open(repo+'art/'+k+'.jpg')
        res[k]=[{'s':round(s,3),'b':[round(float(v)*100,1) for v in b],'m':[round(float(p[3][0]+p[4][0])*50,1),round(float(p[3][1]+p[4][1])*50,1)],'n':[round(float(p[2][0])*100,1),round(float(p[2][1])*100,1)]} for s,b,p in detect(im)]
        if i%40==0: print(i,k,len(res[k]),flush=True)
        if len(sys.argv)>1 and i>=int(sys.argv[1]): break
    json.dump(res,open(C+'faces.json' if len(sys.argv)<2 else C+'faces_test.json','w'))

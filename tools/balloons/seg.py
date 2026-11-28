import sys, os, numpy as np, onnxruntime as ort
from PIL import Image
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache','')
S=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache')
def load(name): return ort.InferenceSession(f'{S}/models/{name}.onnx', providers=['CPUExecutionProvider'])
def run(sess, im):
    a=np.asarray(im.convert('RGB').resize((320,320),Image.LANCZOS)).astype(np.float32)/255.
    a=(a-[0.485,0.456,0.406])/[0.229,0.224,0.225]
    x=a.transpose(2,0,1)[None].astype(np.float32)
    o=sess.run(None,{sess.get_inputs()[0].name:x})[0][0,0]
    o=(o-o.min())/(o.max()-o.min()+1e-9)
    return o
if __name__=='__main__':
    repo='/home/user/hatherley-combe/art/'
    names=sys.argv[1:]
    a=load('u2net'); b=load('u2net_human_seg')
    tiles=[]
    for n in names:
        im=Image.open(repo+n+'.jpg').convert('RGB').resize((450,300))
        row=[im]
        for s in (a,b):
            m=run(s,im); mm=Image.fromarray((m*255).astype(np.uint8)).resize((450,300))
            red=Image.new('RGB',(450,300),(255,0,0)); row.append(Image.composite(red,im,mm.point(lambda v:int(v*0.6))))
        tiles.append(row)
    sheet=Image.new('RGB',(1350,300*len(tiles)))
    for i,r in enumerate(tiles):
        for j,t in enumerate(r): sheet.paste(t,(450*j,300*i))
    sheet.save(S+'/segtest.jpg',quality=80)

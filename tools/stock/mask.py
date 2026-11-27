import sys, numpy as np, base64
from PIL import Image
from scipy import ndimage as ndi
W,H=300,200
def cls(q):
    im=Image.open('art/plan/%d.jpg'%q).convert('HSV').resize((W,H),Image.BOX)
    a=np.asarray(im).astype(float); h=a[...,0]*360/255; s=a[...,1]/255; v=a[...,2]/255
    bad=((v<0.69)&(s>0.12))|((h<50)&(s>0.15)&(v<0.82))|(s<0.11)
    return (h>50)&(h<82)&(s>0.13)&(s<0.38)&(v>0.70), bad
g,bad=cls(1)
bad=ndi.binary_opening(bad,structure=np.ones((2,2)))
g=ndi.binary_closing(g,iterations=2)&~bad
g=ndi.binary_opening(g,iterations=1)
g=ndi.binary_erosion(g,iterations=3)
yy,xx=np.mgrid[0:H,0:W]
g&=(xx>W*.045)&(xx<W*.955)&(yy>H*.07)&(yy<H*.93)
g&=~((xx<W*.2)&(yy>H*.7))
s=g.reshape(100,2,150,2).all(axis=(1,3))
np.save(sys.argv[1]+'/grass.npy',s)
bits=np.packbits(s.flatten()).tobytes()
open(sys.argv[1]+'/grass.b64','w').write(base64.b64encode(bits).decode())
out=Image.open('art/plan/1.jpg').convert('RGB').resize((1200,800))
o=np.asarray(out).copy(); m=np.kron(s,np.ones((8,8),bool))
o[m]=(o[m]*0.5+np.array([255,0,0])*0.5).astype('uint8')
Image.fromarray(o).save(sys.argv[1]+'/mask.jpg',quality=80)

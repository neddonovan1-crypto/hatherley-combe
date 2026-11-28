import sys, numpy as np
from PIL import Image, ImageFilter
W,H=2400,1600
def load(n): return Image.open(n).convert('RGB').resize((W,H),Image.LANCZOS)
def dmask(a,b,thr=26):
    A=np.asarray(a.filter(ImageFilter.GaussianBlur(3)),dtype=int); B=np.asarray(b.filter(ImageFilter.GaussianBlur(3)),dtype=int)
    return Image.fromarray(((np.abs(A-B).max(axis=2)>thr)*255).astype('uint8')).filter(ImageFilter.MinFilter(5))
if __name__=='__main__':
    a=load(sys.argv[1]); b=load(sys.argv[2]); m=dmask(a,b); 
    v=Image.composite(a, Image.blend(a,Image.new('RGB',(W,H),(0,0,0)),.6), m.filter(ImageFilter.MaxFilter(15))); v.resize((1500,1000)).save(sys.argv[3],quality=80)

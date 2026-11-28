import os, re, json, numpy as np
from PIL import Image
from seg import load, run
C=os.path.join(os.path.dirname(os.path.abspath(__file__)),'.cache','')
repo=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','')
keys=json.loads(re.search(r'const SAY_AT = (\{.*?\});', open(repo+'src/sayat.js').read(), re.S).group(1))
a=load('u2net'); b=load('u2net_human_seg'); os.makedirs(C+'masks',exist_ok=True)
for i,k in enumerate(keys):
    out=C+'masks/'+k.replace('/','__')+'.npz'
    if os.path.exists(out): continue
    im=Image.open(repo+'art/'+k+'.jpg').convert('RGB')
    np.savez_compressed(out, sal=run(a,im).astype(np.float16), hum=run(b,im).astype(np.float16))
    if i%40==0: print(i,k,flush=True)
print('done')

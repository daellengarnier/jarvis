import math, sys
sys.argv=['x']
exec(open('treppe_cq.py').read().split('if __name__ == "__main__":')[0])
import numpy as np
plate_parts=[n for n in parts if n.startswith(("Wange","Tritt","Podest_Belag","Aussteifung","Handlauf","Stab"))]
def minrect(P):
    best=None
    for a in np.radians(np.arange(0,180,0.25)):
        c,s_=math.cos(a),math.sin(a); R=P@np.array([[c,-s_],[s_,c]])
        w=np.ptp(R[:,0]); h=np.ptp(R[:,1])
        if best is None or w*h<best[0]: best=(w*h,max(w,h),min(w,h))
    return best[1],best[2]
rows=[]
for n in plate_parts:
    v=np.array([tuple(p.toTuple()) for p in parts[n].vertices().vals()])
    bb=np.ptp(v,axis=0); th=min(bb)  # Dicke = kleinste Ausdehnung (40)
    ax=int(np.argmin(bb)); P=np.delete(v,ax,axis=1)
    L,B=minrect(P)
    rows.append((n,round(L),round(B),round(th)))
for r in rows: print(r)
import rectpack
K=6  # Saegeschnitt
pk=rectpack.newPacker(rotation=False, pack_algo=rectpack.MaxRectsBssf)
for n,L,B,t in rows: pk.add_rect(L+K,B+K,rid=n)
for i in range(3): pk.add_bin(5000,1220)
pk.pack()
print("Platten gebraucht:", len(pk))
import json; json.dump({"rows":rows,"rects":[(b,x,y,w,h,rid) for (b,x,y,w,h,rid) in pk.rect_list()]},open("zuschnitt.json","w"))
used=sum(L*B for _,L,B,_ in rows)/1e6; print("Fläche Teile m2:",round(used,2),"Platte:",6.1)

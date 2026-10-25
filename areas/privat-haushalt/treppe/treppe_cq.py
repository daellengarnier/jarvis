# Treppe Galerie, Masse in mm. x entlang Wand ab Galeriekante (Galerie links), Raum auf der -y-Seite der Wand, z hoch.
# Intern wird mit y = Abstand von der Wand gerechnet und beim Einfuegen an der Wandebene gespiegelt.
import cadquery as cq
_add=None
GAL=2300; PH=1000; XP=1250            # Galerie, Podesthoehe, Podestbeginn
NU=5; GU=250; HU=(GAL-PH)/(NU+1)      # obere Treppe: 5 Tritte, 6 Steigungen
NL=3; GL=200; HL=PH/(NL+1)            # untere Treppe: 3 Tritte, 4 Steigungen
BU=580; PL=650; PD=580; BL=650        # Breite oben, Podest Laenge/Tiefe, Breite unten
W=40; WH=300; T=40; NUT=15; UEB=40    # Wange, Trittdicke, Nuttiefe, Unterschneidung
POST=80; RP=70; HR=(45,70); ST=30; STA=150
asm=cq.Assembly(name="Treppe")
def add(shape,name,color): asm.add(shape.mirror("XZ"),name=name,color=color)
C={"holz":cq.Color(0.86,0.70,0.48),"tritt":cq.Color(0.78,0.56,0.33),"platte":cq.Color(0.90,0.78,0.58)}
def box(name,x0,x1,y0,y1,z0,z1,c="holz"):
    add(cq.Workplane("XY").box(x1-x0,y1-y0,z1-z0,centered=False).translate((x0,y0,z0)),name,C[c])
def poly_xz(name,pts,y0,y1,c="holz"):
    s=cq.Workplane("XZ",origin=(0,y1,0)).polyline(pts).close().extrude(y1-y0); add(s,name,C[c])
def poly_yz(name,pts,x0,x1,c="holz"):
    s=cq.Workplane("YZ",origin=(x0,0,0)).polyline(pts).close().extrude(x1-x0); add(s,name,C[c])
def bar(name,p0,p1,w,h,c="holz"):
    import math
    v=cq.Vector(*p1)-cq.Vector(*p0); L=v.Length
    s=cq.Workplane("XY").box(L,w,h).translate((L/2,0,0))
    ang=math.degrees(math.atan2(v.z,(v.x**2+v.y**2)**0.5)); yaw=math.degrees(math.atan2(v.y,v.x))
    s=s.rotate((0,0,0),(0,1,0),-ang).rotate((0,0,0),(0,0,1),yaw).translate(p0)
    add(s,name,C[c])
# --- obere Treppe ---
LU=lambda x: GAL-HU-(HU/GU)*x          # Trittkantenlinie oben
top=60; bot=WH*1.35-top
for i,(y0,y1) in enumerate([(0,W),(BU-W,BU)]):
    poly_xz(f"Wange_oben_{'wand' if i==0 else 'raum'}",[(0,LU(0)+top),(XP,LU(XP)+top),(XP,LU(XP)-bot),(0,LU(0)-bot)],y0,y1)
for k in range(1,NU+1):
    z=GAL-k*HU; x0=(k-1)*GU-(UEB if k>1 else 0)
    box(f"Tritt_oben_{k}",x0,k*GU,W-NUT,BU-W+NUT,z-T,z,"tritt")
# --- Podest ---
box("Podest_Belag",XP,XP+PL,0,PD,PH-27,PH,"platte")
zt=PH-27
for n,(x,y) in {"wand_links":(XP,0),"wand_rechts":(XP+PL-POST,0),"vorne_links":(XP,PD-POST),"vorne_rechts":(XP+PL-POST,PD-POST)}.items():
    hgt = PH+1000 if n in ("vorne_links","vorne_rechts","wand_rechts") else zt
    box(f"Podest_Pfosten_{n}",x,x+POST,y,y+POST,0,hgt)
for n,(a,b,c,d) in {"wand":(XP+POST,XP+PL-POST,0,60),"vorne":(XP+POST,XP+PL-POST,PD-60,PD),
                    "links":(XP,XP+60,POST,PD-POST),"rechts":(XP+PL-60,XP+PL,POST,PD-POST)}.items():
    box(f"Podest_Rahmen_{n}",a,b,c,d,zt-120,zt)
box("Podest_Platte_wand",XP+POST,XP+PL-POST,0,19,0,zt-120,"platte")
box("Podest_Platte_rechts",XP+PL,XP+PL+19,0,PD,0,zt,"platte")
# --- untere Treppe (nach vorne in den Raum) ---
LL=lambda y: PH-HL-(HL/GL)*(y-PD)
ytop=PD+GL*(LL(PD)+top)/(HL)*1.0
def lower_pts():
    y_top_floor=PD+(LL(PD)+top)*GL/HL; y_bot_floor=PD+(LL(PD)-bot*0.75)*GL/HL
    return [(PD,LL(PD)+top),(y_top_floor,0),(y_bot_floor,0),(PD,LL(PD)-bot*0.75)]
for i,(x0,x1) in enumerate([(XP,XP+W),(XP+BL-W,XP+BL)]):
    poly_yz(f"Wange_unten_{'links' if i==0 else 'rechts'}",lower_pts(),x0,x1)
for j in range(1,NL+1):
    z=PH-j*HL; y0=PD+(j-1)*GL-(UEB if j>1 else 0)
    box(f"Tritt_unten_{j}",XP+W-NUT,XP+BL-W+NUT,y0,PD+j*GL,z-T,z,"tritt")
# --- Gelaender ---
box("Gel_Pfosten_oben",-RP,0,BU-RP,BU,LU(0)-bot,LU(0)+900+HR[1]/2)
hr0=(-RP/2,BU-20,LU(0)+900); hr1=(XP+POST/2,BU-20,LU(XP)+900)
bar("Gel_Handlauf_oben",hr0,(XP,BU-20,LU(XP)+900),HR[1],HR[0])
n=int(XP/STA)
for i in range(1,n+1):
    x=i*STA-ST/2
    if x+ST>XP: break
    zb=LU(x)+top; zh=LU(x)+900-HR[0]/2
    box(f"Gel_Stab_oben_{i:02d}",x,x+ST,BU-W/2-ST/2,BU-W/2+ST/2,zb-5,zh)
zr=PH+1000
bar("Gel_Handlauf_Podest_rechts",(XP+PL-POST/2,0,zr),(XP+PL-POST/2,PD,zr),HR[1],HR[0])
bar("Gel_Handlauf_Podest_vorne",(XP,PD-POST/2,zr),(XP+PL,PD-POST/2,zr),HR[1],HR[0]) if False else None
for i,y in enumerate(range(POST+60,PD-POST,STA)):
    box(f"Gel_Stab_Podest_{i:02d}",XP+PL-POST/2-ST/2,XP+PL-POST/2+ST/2,y,y+ST,PH,zr-HR[0]/2)
asm.save("treppe.step")
cq.exporters.export(asm.toCompound(),"treppe.stl",tolerance=0.5)
import sys
print("ok", HU, HL, LU(XP))

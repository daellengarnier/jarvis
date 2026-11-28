# Explosionszeichnung Podest mit Pocket Holes (Rahmen, Belag), Nuten fuer Platten. mm, intern x entlang Wand, y von der Wand weg, z hoch.
import json, cadquery as cq
PL, PD, PH, BEL = 650, 580, 1000, 40
P, RB, RH = 80, 60, 120
zRo = PH - BEL; zRu = zRo - RH
ZT, ZH, ZL = 20, 80, 50          # Zapfen: Dicke, Hoehe, Laenge
NT = 15                          # Nuttiefe / Einlass
def box(x0, x1, y0, y1, z0, z1):
    return cq.Workplane("XY").box(x1-x0, y1-y0, z1-z0, centered=False).translate((x0, y0, z0))
parts, groups = {}, {}
def add(n, s, g, lab):
    parts[n] = s; groups[n] = (g, lab)
# Pfosten
posts = {
 "P_WL": (0, P, 0, P, zRo, "Pfosten Wand links, endet unter dem Belag"),
 "P_WR": (PL-P, PL, 0, P, PH+1000, "Pfosten Wand rechts, durchgehend bis Geländer"),
 "P_VR": (PL-P, PL, PD-P, PD, PH+1000, "Pfosten vorne rechts, durchgehend"),
 "P_VL": (0, P, PD-P, PD, PH+1147, "Pfosten vorne links, durchgehend bis Handlauf"),
}
post = {k: box(x0, x1, y0, y1, 0, h) for k, (x0, x1, y0, y1, h, _) in posts.items()}
zc0, zc1 = zRu + (RH-ZH)/2, zRu + (RH+ZH)/2
# Rahmen mit Zapfen
import math
A = math.radians(15)
def hole(p, d, L=150, r=5):     # Bohrung als Zylinder ab Punkt p in Richtung d
    return cq.Solid.makeCylinder(r, L, cq.Vector(*p), cq.Vector(*d))
def rail_x(y0, y1, inner):      # Rahmen entlang x, stumpf zwischen den Pfosten, Pocket Holes auf der Innenseite
    yc = (y0+y1)/2; sgn = 1 if inner > yc else -1
    r = box(P, PL-P, y0, y1, zRu, zRo)
    for z in (zRu+35, zRu+85):
        r = r.cut(cq.Workplane().add(hole((P+8, yc, z), (math.cos(A), sgn*math.sin(A), 0))))
        r = r.cut(cq.Workplane().add(hole((PL-P-8, yc, z), (-math.cos(A), sgn*math.sin(A), 0))))
    for x in (200, PL/2, PL-200):  # fuer den Belag, schraeg nach oben
        r = r.cut(cq.Workplane().add(hole((x, yc, zRo-8), (0, sgn*math.sin(A), -math.cos(A)))))
    return r
def rail_y(x0, x1, inner):
    xc = (x0+x1)/2; sgn = 1 if inner > xc else -1
    r = box(x0, x1, P, PD-P, zRu, zRo)
    for z in (zRu+35, zRu+85):
        r = r.cut(cq.Workplane().add(hole((xc, P+8, z), (sgn*math.sin(A), math.cos(A), 0))))
        r = r.cut(cq.Workplane().add(hole((xc, PD-P-8, z), (sgn*math.sin(A), -math.cos(A), 0))))
    for y in (180, PD-180):
        r = r.cut(cq.Workplane().add(hole((xc, y, zRo-8), (sgn*math.sin(A), 0, -math.cos(A)))))
    return r
rW = rail_x(0, RB, PD); rV = rail_x(PD-RB, PD, 0); rR = rail_y(PL-RB, PL, 0)
# Auflagerriegel links, 15 mm in die linken Pfosten eingelassen
riegel = box(-RB+NT, NT, 0, PD, zRu, zRo)
# Platten 40 mm in Nuten
pW = box(P-NT, PL-P+NT, 20, 60, 0, zRu)                  # Wandseite
pL = box(20, 60, P-NT, PD-P+NT, 0, zRu)                  # links, unter der oberen Treppe
# Zapfenloecher, Einlass, Nuten aus den Pfosten schneiden
for k in post:
    for cut in (rW, rV, rR, riegel, pW, pL):
        post[k] = post[k].cut(cut)
bel = box(0, PL, 0, PD, zRo, PH)
for k in ("P_WR", "P_VR", "P_VL"):
    x0, x1, y0, y1, h, _ = posts[k]; bel = bel.cut(box(x0, x1, y0, y1, zRo, PH))
add("P_WL", post["P_WL"], "L", posts["P_WL"][5]); add("P_VL", post["P_VL"], "L", posts["P_VL"][5])
add("P_WR", post["P_WR"], "R", posts["P_WR"][5]); add("P_VR", post["P_VR"], "R", posts["P_VR"][5])
add("Riegel", riegel, "RL", "Auflagerriegel 60 × 120, 15 mm in die Pfosten eingelassen\n(trägt über Holz), obere Wangen mit Klaue darauf")
add("Platte_links", pL, "L", "Platte links 40 mm in Nuten (steift quer zur Wand aus,\nliegt unter der oberen Treppe)")
add("Rahmen_rechts", rR, "R", "Rahmen rechts 60 × 120, Pocket Holes innen")
add("Rahmen_Wand", rW, "M", "Rahmen Wand 60 × 120: je 2 Pocket Holes pro Ende\n+ 3 für den Belag, alle auf der Innenseite, mit Leim")
add("Rahmen_vorne", rV, "M", "Rahmen vorne 60 × 120, Pocket Holes innen")
add("Platte_Wand", pW, "M", "Wandplatte 40 mm in Nuten (steift längs aus)")
add("Belag", bel, "B", "Belag 40 mm, um die hohen Pfosten ausgeklinkt,\nvon unten durch die Rahmen verschraubt: oben nichts sichtbar")
OFF = {"L": (-450, 0, 0), "RL": (-700, 0, 0), "R": (450, 0, 0), "M": (0, 0, 0), "B": (0, 0, 650)}
asm = cq.Assembly(name="Podest")
labels = []
cols = {"Belag": (0.93, 0.80, 0.58), "Platte_links": (0.93, 0.83, 0.64), "Platte_Wand": (0.93, 0.83, 0.64), "Riegel": (0.80, 0.62, 0.40)}
for n, s in parts.items():
    g, lab = groups[n]
    s2 = s.translate(OFF[g]).mirror("XZ")
    c = cols.get(n, (0.86, 0.70, 0.48))
    asm.add(s2, name=n, color=cq.Color(*c))
    bb = s2.val().BoundingBox()
    labels.append({"n": n, "t": lab, "p": [(bb.xmin+bb.xmax)/2, (bb.ymin+bb.ymax)/2, (bb.zmin+bb.zmax)/2]})
asm.export("r3/podest.glb")
json.dump(labels, open("r3/podest_labels.json", "w"))
print("ok", len(parts))

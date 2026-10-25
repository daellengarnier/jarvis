# Holztreppe Galerie mit Podest, parametrisches Modell fuer Shapr3D (STEP, mm).
# Koordinaten: x entlang der Wand ab Galeriekante (Galerie links), z nach oben, Raum auf der -y-Seite der Wand.
# Intern wird mit y = Abstand von der Wand gerechnet und beim Einfuegen an der Wandebene gespiegelt.
import math, cadquery as cq

# --- Hauptmasse ---
GAL = 2300            # Oberkante Galerieboden
PH = 1000             # Oberkante Podest
XP = 1250             # Podest beginnt (ab Galeriekante)
PL, PD = 650, 580     # Podest: Laenge entlang Wand, Tiefe
NU, GU = 5, 250       # obere Treppe: Tritte, Auftritt
NL, GL = 3, 200       # untere Treppe: Tritte, Auftritt
BU, BL = 580, 650     # Breite aussen oben / unten
HU = (GAL - PH) / (NU + 1)
HL = PH / (NL + 1)

# --- Querschnitte ---
W, WB = 40, 300       # Wange: Dicke, Brettbreite
UEB = 50              # Wange steht ueber der Trittvorderkante (senkrecht gemessen)
T, NUT, UNT = 40, 15, 40   # Trittdicke, Nuttiefe, Unterschneidung
POST = 80             # Podestpfosten
RB, RH = 60, 120      # Podestrahmen
BEL = 40              # Podestbelag (Fichte 40 mm, wie alle Plattenteile)
PLT = 40              # Aussteifungsplatte
HLB, HLH = 40, 60     # Handlauf Breite, Hoehe (senkrecht)
ST = 40               # Gelaenderstab, aus der 40-mm-Platte geschnitten
GEL = 900             # Handlaufhoehe ueber Trittkante
GELP = 1000           # Gelaenderhoehe am Podest
# Wangenkopf oben: liegt auf dem Galerieboden ueber dem Randbalken auf
HK, KH = 150, 80      # Kopflaenge auf der Galerie, Kopfhoehe ueber Galerieboden
# Bestand Galerie (ANNAHME, am Bau messen): Boden 30 mm, Randbalken 120 x 200 direkt unter der Kante
GB, RBB, RBH = 30, 120, 200

asm = cq.Assembly(name="Treppe")
FI = cq.Color(0.88, 0.74, 0.52)   # alles Fichte
COL = {"bestand": cq.Color(0.55, 0.42, 0.30), "stahl": cq.Color(0.25, 0.25, 0.27), "holz": FI, "tritt": FI, "platte": FI}
parts = {}

def add(name, solid, c="holz"):
    parts[name] = solid
    asm.add(solid.mirror("XZ"), name=name, color=COL[c])

def box(x0, x1, y0, y1, z0, z1):
    return cq.Workplane("XY").box(x1 - x0, y1 - y0, z1 - z0, centered=False).translate((x0, y0, z0))

def prism_xz(pts, y0, y1):   # Profil in x/z, extrudiert von y0 nach y1
    return cq.Workplane("XZ", origin=(0, y1, 0)).polyline(pts).close().extrude(y1 - y0)

def prism_yz(pts, x0, x1):   # Profil in y/z, extrudiert von x0 nach x1
    return cq.Workplane("YZ", origin=(x0, 0, 0)).polyline(pts).close().extrude(x1 - x0)

# Linien durch die Trittvorderkanten
LU = lambda x: GAL - (HU / GU) * x
LL = lambda y: PH - (HL / GL) * (y - PD)
dU = WB / math.cos(math.atan(HU / GU))   # Wangenbreite senkrecht gemessen
dL = WB / math.cos(math.atan(HL / GL))

# ================= Podest =================
xL0, xL1 = XP, XP + POST                 # Pfosten links (Seite obere Treppe)
xR0, xR1 = XP + PL - POST, XP + PL       # Pfosten rechts (offene Seite)
yW0, yW1 = 0, POST                       # Pfosten an der Wand
yF0, yF1 = PD - POST, PD                 # Pfosten vorne
zRo = PH - BEL                           # Oberkante Rahmen = Unterkante Belag
zRu = zRo - RH
tUL = LU(XP) + GEL + 30                  # Pfosten vorne links nimmt den oberen Handlauf auf
add("Pfosten_Wand_links", box(xL0, xL1, yW0, yW1, 0, zRo))          # kurz, endet unter dem Belag
add("Pfosten_Wand_rechts", box(xR0, xR1, yW0, yW1, 0, PH + GELP))   # durchgehend, Gelaender
add("Pfosten_vorne_rechts", box(xR0, xR1, yF0, yF1, 0, PH + GELP))  # durchgehend, Gelaender
add("Pfosten_vorne_links", box(xL0, xL1, yF0, yF1, 0, tUL))         # durchgehend, Handlauf oben

add("Rahmen_Wand", box(xL1, xR0, 0, RB, zRu, zRo))
add("Rahmen_vorne", box(xL1, xR0, PD - RB, PD, zRu, zRo))
# Auflagerriegel links, aussen an die linken Pfosten geschraubt: obere Wangen sitzen mit einer Klaue darauf
add("Auflagerriegel_links", box(XP - RB, XP, 0, PD, zRu, zRo))
add("Rahmen_rechts", box(xR1 - RB, xR1, yW1, yF0, zRu, zRo))

bel = box(XP, XP + PL, 0, PD, zRo, PH)
for x0, x1, y0, y1 in [(xR0, xR1, yW0, yW1), (xR0, xR1, yF0, yF1), (xL0, xL1, yF0, yF1)]:
    bel = bel.cut(box(x0, x1, y0, y1, zRo, PH))   # Ausklinkungen fuer die durchgehenden Pfosten
add("Podest_Belag", bel, "platte")

add("Aussteifung_Wand", box(xL1, xR0, 0, PLT, 0, zRu), "platte")
# Strebe links (unter der oberen Treppe), quer zur Wand; rechte Seite bleibt offen
sb = 60
sh = 80 / math.cos(math.atan((zRu - 150) / (yF0 - yW1)))   # Strebe 60 x 80 (Rahmenholz), senkrecht gemessen
add("Strebe_links", prism_yz([(yW1, 150), (yW1, 150 + sh), (yF0, zRu), (yF0, zRu - sh)], XP + 10, XP + 10 + sb))

# ================= Obere Treppe =================
x_k = (LU(0) + UEB - GAL - KH) * GU / HU   # wo die Wangenoberkante die Kopfhoehe erreicht
profU = [(-HK, GAL), (-HK, GAL + KH), (x_k, GAL + KH), (XP, LU(XP) + UEB), (XP, zRo), (XP - RB, zRo),
         (XP - RB, LU(XP - RB) + UEB - dU), (0, LU(0) + UEB - dU), (0, GAL)]
# oben: Kopf liegt auf dem Galerieboden, Stirn liegt am Randbalken an; unten: Klaue auf dem Auflagerriegel
treadsU = []
for k in range(1, NU + 1):
    z = GAL - k * HU
    x0 = 0 if k == 1 else (k - 1) * GU - UNT
    treadsU.append(box(x0, k * GU, W - NUT, BU - W + NUT, z - T, z))
for name, y0, y1 in [("Wange_oben_Wand", 0, W), ("Wange_oben_Raum", BU - W, BU)]:
    s = prism_xz(profU, y0, y1)
    for t in treadsU:
        s = s.cut(t)                     # Nuten fuer die Tritte
    add(name, s)
for k, t in enumerate(treadsU, 1):
    add(f"Tritt_oben_{k}", t, "tritt")

# ================= Untere Treppe =================
y_top = PD + UEB * GL / HL
YEND = PD + NL * GL + 30
yfl = PD + (PH + UEB - dL) * GL / HL
profL = [(PD, PH), (y_top, PH), (YEND, LL(YEND) + UEB), (YEND, 0), (yfl, 0), (PD, PH + UEB - dL)]
treadsL = []
for j in range(1, NL + 1):
    z = PH - j * HL
    y0 = PD if j == 1 else PD + (j - 1) * GL - UNT
    treadsL.append(box(XP + W - NUT, XP + BL - W + NUT, y0, PD + j * GL, z - T, z))
for name, x0, x1 in [("Wange_unten_links", XP, XP + W), ("Wange_unten_rechts", XP + BL - W, XP + BL)]:
    s = prism_yz(profL, x0, x1)
    for t in treadsL:
        s = s.cut(t)
    add(name, s)
for j, t in enumerate(treadsL, 1):
    add(f"Tritt_unten_{j}", t, "tritt")

# ================= Stahllaschen (6 mm, je 2 Schrauben M10 pro Holzteil) =================
def lasche_x(x0, x1, y0, y1, z0, z1, holes):
    p = box(x0, x1, y0, y1, z0, z1)
    for (yy, zz) in holes:
        p = p.cut(cq.Workplane("YZ", origin=(x0 - 1, yy, zz)).circle(5.5).extrude(x1 - x0 + 2))
    return p
def lasche_y(x0, x1, y0, y1, z0, z1, holes):
    p = box(x0, x1, y0, y1, z0, z1)
    for (xx, zz) in holes:
        p = p.cut(cq.Workplane("XZ", origin=(xx, y1 + 1, zz)).circle(5.5).extrude(y1 - y0 + 2))
    return p
# untere Wangen an die vorderen Pfosten: Lasche aussen, buendig ueber Pfosten und Wangenkopf
lz0, lz1 = 640, 840
hl = [(PD - POST / 2, 690), (PD - POST / 2, 790), (PD + 45, 690), (PD + 45, 790)]
add("Lasche_unten_links", lasche_x(XP - 6, XP, PD - POST, PD + 90, lz0, lz1, hl), "stahl")
add("Lasche_unten_rechts", lasche_x(XP + PL, XP + PL + 6, PD - POST, PD + 90, lz0, lz1, hl), "stahl")
# obere Raumwange an den Pfosten vorne links
hu = [(XP - 100, 1060), (XP - 40, 1160), (XP + POST / 2, 1060), (XP + POST / 2, 1160)]
add("Lasche_oben_Raum", lasche_y(XP - 140, XP + POST, BU, BU + 6, 1010, 1200, hu), "stahl")

# ================= Gelaender =================
# Oben: Handlauf ueber der Raumwange, zwischen Galeriepfosten und Podestpfosten vorne links
gy0, gy1 = BU - HLB, BU
add("Pfosten_Galerie", box(-POST, 0, BU - POST, BU, GAL, LU(0) + GEL + 30).cut(box(-POST, 0, BU - W, BU, GAL, GAL + KH)))  # ueber den Wangenkopf ausgeklinkt
add("Handlauf_oben", prism_xz([(0, LU(0) + GEL), (XP, LU(XP) + GEL), (XP, LU(XP) + GEL - HLH), (0, LU(0) + GEL - HLH)], gy0, gy1))
n = 8
gap = (XP - n * ST) / (n + 1)
for i in range(n):
    x0 = gap + i * (gap + ST); x1 = x0 + ST
    pts = [(x0, LU(x0) + UEB), (x1, LU(x1) + UEB), (x1, LU(x1) + GEL - HLH), (x0, LU(x0) + GEL - HLH)]
    add(f"Stab_oben_{i+1}", prism_xz(pts, BU - W / 2 - ST / 2, BU - W / 2 + ST / 2))
# Podest rechte Seite: Handlauf zwischen den Pfosten, Oberkante buendig
hx0, hx1 = xR0 + (POST - HLB) / 2, xR0 + (POST + HLB) / 2
add("Handlauf_Podest", box(hx0, hx1, yW1, yF0, PH + GELP - HLH, PH + GELP))
m = 3
gp = (yF0 - yW1 - m * ST) / (m + 1)
for i in range(m):
    y0 = yW1 + gp + i * (gp + ST)
    add(f"Stab_Podest_{i+1}", box(xR0 + (POST - ST) / 2, xR0 + (POST + ST) / 2, y0, y0 + ST, PH, PH + GELP - HLH))

# ================= Bestand Galerie (nur zur Orientierung, Masse angenommen) =================
add("Bestand_Galerieboden", box(-1500, 0, 0, 1500, GAL - GB, GAL), "bestand")
add("Bestand_Randbalken", box(-RBB, 0, 0, 1500, GAL - GB - RBH, GAL - GB), "bestand")

if __name__ == "__main__":
    import sys
    asm.save("treppe.step")
    if "--glb" in sys.argv: asm.export("r3/treppe.glb")
    # Pruefung: keine Ueberschneidungen zwischen Teilen
    names = list(parts); bad = []
    for i, a in enumerate(names):
        A = parts[a].val()
        for b in names[i + 1:]:
            B = parts[b].val()
            a1, b1 = A.BoundingBox(), B.BoundingBox()
            if a1.xmax <= b1.xmin or b1.xmax <= a1.xmin or a1.ymax <= b1.ymin or b1.ymax <= a1.ymin or a1.zmax <= b1.zmin or b1.zmax <= a1.zmin: continue
            v = A.intersect(B).Volume()
            if v > 1: bad.append((a, b, round(v)))
    print("Teile:", len(names), "Ueberschneidungen:", bad if bad else "keine")
    print(f"Steigung oben {HU:.1f}, unten {HL:.1f}; Ausladung in den Raum {YEND/10:.1f} cm; Galeriepfosten bis {LU(0)+GEL+30:.0f}")

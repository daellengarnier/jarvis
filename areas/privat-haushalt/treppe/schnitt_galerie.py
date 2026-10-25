# Schnitte der zwei Holzverbindungen: oben Tasche im Randbalken, unten Falz im Podestpfosten.
import math
src = open('treppe_cq.py').read()
exec(src.split('asm = cq.Assembly')[0])
LU = lambda x: GAL - (HU / GU) * x
LL = lambda y: PH - (HL / GL) * (y - PD)
dU = WB / math.cos(math.atan(HU / GU)); dL = WB / math.cos(math.atan(HL / GL))
zRo = PH - BEL
x_top = (LU(0) + UEB - GAL) * GU / HU
zT0 = GAL - GB - RBH + 40
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
fig, (ax, bx) = plt.subplots(1, 2, figsize=(17, 8.2), gridspec_kw=dict(width_ratios=[1.25, 1]))
def P(a, pts, fc, ec="#333", lw=1.4, hatch=None, z=1, ls="-"):
    a.add_patch(Polygon(pts, closed=True, fc=fc, ec=ec, lw=lw, hatch=hatch, zorder=z, ls=ls))
def lab(a, x, y, tx, ty, t):
    a.annotate(t, (x, y), (tx, ty), fontsize=9.5, arrowprops=dict(arrowstyle="-", lw=0.7, color="#555"), va="center")
def dim(a, x0, y0, x1, y1, t, off=(0, 0), ha="center"):
    a.annotate("", (x0, y0), (x1, y1), arrowprops=dict(arrowstyle="<->", lw=0.9, color="#1a4f8a"))
    a.text((x0+x1)/2+off[0], (y0+y1)/2+off[1], t, color="#1a4f8a", fontsize=9, ha=ha, va="center")
FI, BE = "#e7cfa3", "#b9a088"
# ---- oben ----
P(ax, [(-600, GAL-GB), (0, GAL-GB), (0, GAL), (-600, GAL)], BE, hatch="//")
P(ax, [(-RBB, GAL-GB-RBH), (0, GAL-GB-RBH), (0, zT0), (-TD, zT0), (-TD, GAL-GB), (-RBB, GAL-GB)], BE, hatch="xx")
prof = [(0, GAL), (x_top, GAL), (650, LU(650)+UEB), (650, LU(650)+UEB-dU), (0, LU(0)+UEB-dU), (0, zT0), (-TD, zT0), (-TD, GAL-GB), (0, GAL-GB)]
P(ax, prof, FI, lw=2, z=3)
P(ax, [(0, GAL-HU-T), (GU, GAL-HU-T), (GU, GAL-HU), (0, GAL-HU)], "#d8b98a", z=4, ls="--")
P(ax, [(-POST, GAL), (0, GAL), (0, 2700), (-POST, 2700)], "#f1dfbd", z=2, ls="--")
for (x0, z0, x1, z1) in [(120, 2180, -80, 2120)]:
    ax.plot([x0, x1], [z0, z1], color="#555", lw=1.6, ls="--", zorder=6)
dim(ax, -TD, zT0-35, 0, zT0-35, f"{TD}", (0, -18))
dim(ax, -170, zT0, -170, GAL-GB, f"{GAL-GB-zT0:.0f}", (-12, 0), "right")
dim(ax, -170, GAL-GB-RBH, -170, zT0, "40", (-12, 0), "right")
lab(ax, -15, 2190, -590, 2560, f"Zunge der Wange ({TD} mm) steckt in einer Tasche im Randbalken\nund liegt auf dem Taschenboden auf. Oben hält der Galerieboden.")
lab(ax, -10, zT0+5, 330, 1880, "Auflager in der Tasche: trägt die Treppe.\nDarunter bleiben 40 mm Balken stehen.")
lab(ax, 60, 2165, 300, 2600, "1 Vollgewindeschraube, versenkt, schräg in den Balken:\nhält die Wange in der Tasche, sieht man nicht")
lab(ax, -300, GAL-15, -590, 2420, "Galerieboden (Annahme 30 mm)")
lab(ax, -70, 2100, -590, 2000, "Randbalken (Annahme 120 × 200),\nTasche mit Oberfräse von vorne")
lab(ax, 150, GAL-HU-20, 420, 2050, "Tritt 1, 40 mm, eingenutet")
ax.set_xlim(-600, 700); ax.set_ylim(1820, 2720); ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Oben: Wange in Tasche im Galerie-Randbalken", fontsize=12.5)
# ---- unten (Blick von der Seite, y nach rechts) ----
zF0 = 700
P(bx, [(PD-POST, 0), (PD, 0), (PD, zF0), (PD-FZ, zF0), (PD-FZ, zRo), (PD, zRo), (PD, 1400), (PD-POST, 1400)], "#f1dfbd", z=2)
P(bx, [(PD-POST, zRo), (PD-POST, PH), (PD, PH), (PD, zRo)], "#e2c597", z=2)
profL = [(PD-FZ, zF0), (PD-FZ, zRo), (PD, zRo), (PD, PH), (PD+UEB*GL/HL, PH), (900, LL(900)+UEB), (900, LL(900)+UEB-dL), (PD, PH+UEB-dL), (PD, zF0)]
P(bx, profL, FI, lw=2, z=3)
P(bx, [(PD, PH-HL-T), (PD+GL, PH-HL-T), (PD+GL, PH-HL), (PD, PH-HL)], "#d8b98a", z=4, ls="--")
dim(bx, PD-FZ, zF0-40, PD, zF0-40, f"{FZ}", (0, -20))
lab(bx, PD-10, 760, 215, 720, f"Falz {FZ} mm im Podestpfosten,\nWange sitzt darin auf (Auflager bei {zF0})")
lab(bx, PD-40, 400, 215, 400, "Podestpfosten 80 × 80,\ndurchgehend")
lab(bx, PD-40, PH-20, 215, 1100, "Podestbelag 40 mm")
lab(bx, 700, 800, 760, 1150, "untere Wange 40 × 300")
lab(bx, 640, PH-HL-20, 760, 560, "Tritt 1 unten")
lab(bx, PD-60, 880, 215, 900, "2 Schrauben von innen durch den Pfosten\nin die Wange, versenkt")
bx.set_xlim(200, 1000); bx.set_ylim(250, 1420); bx.set_aspect("equal"); bx.axis("off")
bx.set_title("Unten: Wange im Falz der vorderen Podestpfosten", fontsize=12.5)
fig.suptitle("Treppe ohne Stahl: Anschlüsse als Holzverbindungen (Masse mm, Galerie angenommen, am Bau messen)", fontsize=13.5)
plt.tight_layout(); plt.savefig("schnitt_galerie.png", dpi=105)

# Schnitt Anschluss oben an die Galerie (Ansicht Raumwange). Liest die Masse aus treppe_cq.py.
import math, sys
src = open('treppe_cq.py').read()
exec(src.split('asm = cq.Assembly')[0])
LU = lambda x: GAL - (HU / GU) * x
dU = WB / math.cos(math.atan(HU / GU))
x_top = (LU(0) + UEB - GAL) * GU / HU
zW0 = GAL - HU + 12
prof = [(0, GAL), (x_top, GAL), (650, LU(650) + UEB), (650, LU(650) + UEB - dU), (0, LU(0) + UEB - dU)]
wink = [(-HK, GAL), (-HK, GAL + 70), (0, GAL + 70), (200, LU(200) + UEB + 20), (200, zW0), (0, zW0), (0, GAL)]
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Circle
fig, ax = plt.subplots(figsize=(11.5, 8))
def P(pts, fc, ec="#333", lw=1.4, hatch=None, z=1, ls="-", alpha=1):
    ax.add_patch(Polygon(pts, closed=True, fc=fc, ec=ec, lw=lw, hatch=hatch, zorder=z, ls=ls, alpha=alpha))
FI, BE, ST_ = "#e7cfa3", "#b9a088", "#3a3a3e"
P([(-600, GAL-GB), (0, GAL-GB), (0, GAL), (-600, GAL)], BE, hatch="//")
P([(-RBB, GAL-GB-RBH), (0, GAL-GB-RBH), (0, GAL-GB), (-RBB, GAL-GB)], BE, hatch="xx")
P(prof, FI, lw=2, z=2)
P([(0, GAL-HU-T), (GU, GAL-HU-T), (GU, GAL-HU), (0, GAL-HU)], "#d8b98a", z=3, ls="--")
P([(-POST, GAL), (0, GAL), (0, 2720), (-POST, 2720)], "#f1dfbd", z=2, ls="--")
P(wink, "#6d6f78", ec="#222", lw=1.6, z=5, alpha=0.85)
P([(-HK, GAL), (-10, GAL), (-10, GAL+6), (-HK, GAL+6)], ST_, z=6)
for (xx, zz) in [(80, zW0 + 65), (170, zW0 + 40)]:
    ax.add_patch(Circle((xx, zz), 9, fc="white", ec="#111", lw=1.5, zorder=7))
for xs in (-115, -45):
    ax.plot([xs, xs], [GAL+6, GAL-GB-RBH+50], color="#222", lw=2.2, zorder=6)
    ax.plot([xs-11, xs+11], [GAL+7, GAL+7], color="#222", lw=3.2, zorder=7)
def dim(x0,y0,x1,y1,t,off=(0,0),ha="center"):
    ax.annotate("", (x0,y0), (x1,y1), arrowprops=dict(arrowstyle="<->", lw=0.9, color="#1a4f8a"))
    ax.text((x0+x1)/2+off[0], (y0+y1)/2+off[1], t, color="#1a4f8a", fontsize=9, ha=ha, va="center")
dim(-HK, GAL+105, 0, GAL+105, f"{HK}", (0,20))
dim(360, GAL, 360, GAL-HU, f"{HU:.0f}", (12,0), "left")
ax.plot([0, 360], [GAL, GAL], color="#1a4f8a", lw=0.5, ls=":"); ax.plot([GU, 360], [GAL-HU, GAL-HU], color="#1a4f8a", lw=0.5, ls=":")
def lab(x,y,tx,ty,t):
    ax.annotate(t, (x,y), (tx,ty), fontsize=9.5, arrowprops=dict(arrowstyle="-", lw=0.7, color="#555"), va="center")
lab(-80, GAL+3, -590, 2600, "Einhängewinkel Stahl 6 mm: Lasche liegt auf dem Galerieboden,\n2 Tellerkopfschrauben 8 × 240 durch den Boden in den Randbalken")
lab(105, zW0 + 60, 420, 2420, "Platte seitlich an der Wange,\n2 Schrauben M10 mit Unterlagscheiben\n(im vollen Wangenquerschnitt, mit Randabstand)")
lab(-2, 2150, -590, 1990, "Stirn der Wange liegt satt am Randbalken an\n(nimmt den Schub der Treppe auf)")
lab(-300, GAL-15, -590, 2420, "Galerieboden (Annahme 30 mm)")
lab(-60, 2170, -590, 2250, "Randbalken (Annahme 120 × 200)")
lab(-40, 2640, 150, 2680, "Galeriepfosten 80 × 80 steht auf dem Boden,\nseitlich am Winkel und an der Wange verschraubt")
lab(160, GAL-HU-20, 430, 2010, "Tritt 1, 40 mm, in der Wange eingenutet")
lab(500, LU(500)+UEB-80, 560, 2250, "Wange 40 × 300, oben bündig\nmit dem Galerieboden")
ax.text(-590, 1830, "Ansicht Raumwange von aussen. Wandseite gleich, Winkel innen an der Wange. Masse in mm. Galerie: Masse angenommen, am Bau messen.", fontsize=9, color="#555")
ax.set_xlim(-600, 700); ax.set_ylim(1800, 2740); ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Anschluss oben: Treppe hängt mit Stahlwinkeln auf der Galerie", fontsize=13)
plt.tight_layout(); plt.savefig("schnitt_galerie.png", dpi=110)

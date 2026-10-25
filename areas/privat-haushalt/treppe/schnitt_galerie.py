import sys; sys.argv=['x']
exec(open('treppe_cq.py').read().split('# ================= Podest')[0])
import math
exec(open('treppe_cq.py').read().split('# ================= Obere Treppe =================')[1].split('treadsU = []')[0].replace('add(','dict(')) if False else None
LU = lambda x: GAL - (HU / GU) * x
dU = WB / math.cos(math.atan(HU / GU)); zRo = PH - BEL; RB=60
x_k = (LU(0) + UEB - GAL - KH) * GU / HU
prof = [(-HK, GAL), (-HK, GAL + KH), (x_k, GAL + KH), (600, LU(600) + UEB), (600, LU(600) + UEB - dU), (0, LU(0) + UEB - dU), (0, GAL)]
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle
fig, ax = plt.subplots(figsize=(11, 8))
def P(pts, fc, ec="#333", lw=1.4, hatch=None, z=1, ls="-"):
    ax.add_patch(Polygon(pts, closed=True, fc=fc, ec=ec, lw=lw, hatch=hatch, zorder=z, ls=ls))
FI = "#e7cfa3"; BE = "#b9a088"
# Bestand
P([(-600, GAL-GB), (0, GAL-GB), (0, GAL), (-600, GAL)], BE, hatch="//")
P([(-RBB, GAL-GB-RBH), (0, GAL-GB-RBH), (0, GAL-GB), (-RBB, GAL-GB)], BE, hatch="xx")
# Wange (Schnitt durch Raumwange), Tritt 1, Pfosten, Handlauf
P(prof, FI, lw=2, z=3)
P([(0, GAL-HU-T), (GU, GAL-HU-T), (GU, GAL-HU), (0, GAL-HU)], "#d8b98a", z=4, ls="--")
pz1 = 2700
P([(-POST, GAL+KH), (0, GAL+KH), (0, pz1), (-POST, pz1)], "#f1dfbd", z=2, ls="--")
# Schrauben
for xs in (-115, -45):
    ax.plot([xs, xs], [GAL+KH, GAL-GB-RBH+40], color="#444", lw=2.2, zorder=6)
    ax.plot([xs-10, xs+10], [GAL+KH, GAL+KH], color="#444", lw=3, zorder=6)
def dim(x0,y0,x1,y1,t,off=(0,0),ha="center"):
    ax.annotate("", (x0,y0), (x1,y1), arrowprops=dict(arrowstyle="<->", lw=0.9, color="#1a4f8a"))
    ax.text((x0+x1)/2+off[0], (y0+y1)/2+off[1], t, color="#1a4f8a", fontsize=9, ha=ha, va="center")
dim(-HK, GAL+KH+40, 0, GAL+KH+40, f"{HK}", (0,22))
dim(-HK-40, GAL, -HK-40, GAL+KH, f"{KH}", (-30,0), "right")
dim(330, GAL, 330, GAL-HU, f"{HU:.0f}", (12,0), "left")
ax.plot([0, 330], [GAL, GAL], color="#1a4f8a", lw=0.5, ls=":"); ax.plot([GU, 330], [GAL-HU, GAL-HU], color="#1a4f8a", lw=0.5, ls=":")
def lab(x,y,tx,ty,t):
    ax.annotate(t, (x,y), (tx,ty), fontsize=9.5, arrowprops=dict(arrowstyle="-", lw=0.7, color="#555"), va="center")
lab(-75, GAL+40, -560, 2560, "Wangenkopf liegt auf dem Galerieboden,\n2 Tellerkopfschrauben 8 × 300 bis in den Randbalken")
lab(-2, 2120, -560, 1960, "Stirn der Wange liegt am Randbalken an\n(nimmt den Schub der Treppe auf)")
lab(-300, GAL-15, -560, 2400, "Galerieboden (Annahme 30 mm)")
lab(-60, 2170, -560, 2230, "Randbalken (Annahme 120 × 200)")
lab(-40, 2600, 160, 2650, "Galeriepfosten 80 × 80, über den Wangenkopf\nausgeklinkt, seitlich mit 2 × M10 an die Wange")
lab(120, GAL-HU-20, 420, 2000, "Tritt 1, 40 mm, in der Wange eingenutet")
lab(400, LU(400)+UEB-60, 520, 2420, "Wange 40 × 300, Fichte")
ax.text(-560, 1830, "Schnitt durch die Raumwange, Blick von der Raumseite. Masse in mm. Galerie: Masse angenommen, bitte am Bau messen.", fontsize=9, color="#555")
ax.set_xlim(-600, 650); ax.set_ylim(1800, 2720); ax.set_aspect("equal"); ax.axis("off")
ax.set_title("Anschluss oben: Wange liegt auf der Galerie auf", fontsize=13)
plt.tight_layout(); plt.savefig("schnitt_galerie.png", dpi=110)

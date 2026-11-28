import math, matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Rectangle
A = math.radians(15); t = math.tan(A)
FI, PO, SC = "#e9d1a6", "#d8b585", "#4a4a50"
fig, axs = plt.subplots(1, 3, figsize=(15, 5.6), gridspec_kw=dict(width_ratios=[1.15, 1, 1.1]))
def lab(a, x, y, tx, ty, s):
    a.annotate(s, (x, y), (tx, ty), fontsize=9, arrowprops=dict(arrowstyle="-", lw=0.7, color="#555"), va="center")
# A: Draufsicht Rahmen an Pfosten
a = axs[0]
a.add_patch(Rectangle((0, 0), 80, 80, fc=PO, ec="#333", lw=1.5))
a.add_patch(Rectangle((80, 10), 230, 60, fc=FI, ec="#333", lw=1.5))
# Bohrung: von der Innenseite (y=70) zur Stirn (x=80, y=40)
xi = 80 + 30 / t
a.plot([80, xi + 20], [40, 70 + 20 * t], color="#7b5a3a", lw=11, alpha=0.45, solid_capstyle="butt")
# Schraube: vom Taschenboden bis 35 mm in den Pfosten
x0, y0 = 80 + 55, 40 + 55 * t
x1, y1 = 80 - 35, 40 - 35 * t
a.plot([x0, x1], [y0, y1], color=SC, lw=3.5, solid_capstyle="round"); a.plot([x0, x0 + 6], [y0, y0 + 1.6], color=SC, lw=7)
lab(a, 40, 30, -10, -40, "Pfosten 80 × 80")
lab(a, 250, 40, 230, 120, "Rahmen 60 × 120")
lab(a, xi + 10, 70, 200, 145, "Tasche auf der Innenseite,\n15° schräg (Bohrlehre)")
lab(a, 55, 33, -25, 120, "Schraube greift im Pfosten\nins Längsholz, + Leim auf der Stirn")
a.set_xlim(-30, 330); a.set_ylim(-60, 160); a.set_aspect("equal"); a.axis("off")
a.set_title("A  Rahmen an Pfosten (von oben)", loc="left", fontsize=12, fontweight="bold")
# B: Schnitt Belag von unten
b = axs[1]
b.add_patch(Rectangle((0, 0), 60, 120, fc=FI, ec="#333", lw=1.5))
b.add_patch(Rectangle((-60, 120), 260, 40, fc="#efd9b0", ec="#333", lw=1.5))
pa, pb = (62, 0), (30, 120)
b.plot([pa[0], pb[0]], [pa[1], pb[1]], color="#7b5a3a", lw=11, alpha=0.45, solid_capstyle="butt")
dx, dz = pb[0] - pa[0], pb[1] - pa[1]
b.plot([pa[0] + 0.55 * dx, pa[0] + 1.22 * dx], [pa[1] + 0.55 * dz, pa[1] + 1.22 * dz], color=SC, lw=3.5, solid_capstyle="round")
zi = 30
lab(b, 30, 60, 110, 40, "Rahmen (Schnitt)")
lab(b, 150, 140, 120, 200, "Belag 40 mm")
lab(b, 56, 25, 110, 80, "Tasche innen, schräg nach oben:\nSchraube endet im Belag,\noben bleibt alles zu")
b.set_xlim(-70, 260); b.set_ylim(-20, 220); b.set_aspect("equal"); b.axis("off")
b.set_title("B  Belag von unten (Schnitt)", loc="left", fontsize=12, fontweight="bold")
# C: Uebersicht
c = axs[2]; c.axis("off")
c.set_title("Wo Pocket Holes, wo Holz auf Holz", loc="left", fontsize=12, fontweight="bold")
c.text(0, 0.93, "Pocket Holes (halten zusammen):", fontsize=10.5, fontweight="bold", color="#1d6b2f", transform=c.transAxes, va="top")
c.text(0, 0.84, "• Rahmen an Pfosten, je 2 pro Ende, mit Leim\n• Belag von unten durch die Rahmen\n• Handlauf an die Pfosten\n• Wandplatte zusätzlich an den Rahmen", fontsize=10, transform=c.transAxes, va="top")
c.text(0, 0.52, "Holz auf Holz (trägt die Last):", fontsize=10.5, fontweight="bold", color="#9b2c2c", transform=c.transAxes, va="top")
c.text(0, 0.43, "• Obere Wangen: Klaue auf dem Auflagerriegel\n• Auflagerriegel: 15 mm in die Pfosten eingelassen\n• Untere Wangen: im Falz der vorderen Pfosten\n• Tritte: in den Wangen eingenutet\n• Platten links und an der Wand: in Nuten\n  (verhindern, dass der Rahmen sich verschiebt)", fontsize=10, transform=c.transAxes, va="top")
c.text(0, 0.03, "Bohrlehre für 60 mm dickes Holz nötig (z.B. HD-Lehre),\nSchrauben mit Grobgewinde für Weichholz.\nLänge nach Herstellerangabe.", fontsize=9, color="#555", transform=c.transAxes, va="bottom")
plt.tight_layout(); plt.savefig("pocket_detail.png", dpi=100)

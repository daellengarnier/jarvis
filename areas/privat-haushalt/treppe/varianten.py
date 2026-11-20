# Skizzen: 7 Varianten, die Holztreppe oben ohne Stahl an der Galerie zu befestigen (Seitenansicht, schematisch)
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Circle
GAL, GB, RBB, RBH = 2300, 30, 120, 200
k = 216.7 / 250                      # Steigung oben
LU = lambda x: GAL - k * x
dU = 397                             # Wange 300, senkrecht gemessen
FI, EI, BE, DU = "#e9d1a6", "#a8743f", "#b9a088", "#4a3320"

def P(ax, pts, fc, ec="#333", lw=1.3, hatch=None, z=2, ls="-"):
    ax.add_patch(Polygon(pts, closed=True, fc=fc, ec=ec, lw=lw, hatch=hatch, zorder=z, ls=ls))
def galerie(ax, cut=None, pocket=None, floorcut=None):
    fl = [(-450, GAL - GB), (0, GAL - GB), (0, GAL), (-450, GAL)]
    if floorcut:  # Boden an der Wange ausgeschnitten
        a = floorcut
        fl = [(-450, GAL - GB), (a, GAL - GB), (a, GAL), (-450, GAL)]
    P(ax, fl, BE, hatch="//", z=1)
    bm = pocket if pocket else [(-RBB, GAL - GB - RBH), (0, GAL - GB - RBH), (0, GAL - GB), (-RBB, GAL - GB)]
    P(ax, bm, BE, hatch="xx", z=1)
def wange(ax, x0=0, extra=None):
    pts = extra if extra else [(x0, GAL), (x0 + 58, GAL), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (x0, LU(x0) + 50 - dU)]
    P(ax, pts, FI, lw=1.8, z=3)
    ax.annotate("", (420, LU(420) - 120), (250, LU(250) - 120 + 0), arrowprops=dict(arrowstyle="->", color="#9a7a4a", lw=1))
    ax.text(330, LU(330) - 160, "Faser", color="#9a7a4a", fontsize=7, rotation=-41, ha="center")
def tritt(ax, x0=0):
    P(ax, [(x0, GAL - 216.7 - 40), (x0 + 250, GAL - 216.7 - 40), (x0 + 250, GAL - 216.7), (x0, GAL - 216.7)], "#d6b37e", z=4, ls="--")
def dowel(ax, x, z, r=14):
    ax.add_patch(Circle((x, z), r, fc=DU, ec="black", lw=0.8, zorder=6))
def setup(ax, title, verdict, color):
    ax.set_xlim(-460, 620); ax.set_ylim(1450, 2780); ax.set_aspect("equal"); ax.axis("off")
    ax.set_title(title, fontsize=11.5, fontweight="bold", loc="left")
    ax.text(-450, 1400, verdict, fontsize=8.6, va="top", color=color, wrap=True)
def note(ax, x, y, tx, ty, t):
    ax.annotate(t, (x, y), (tx, ty), fontsize=7.8, arrowprops=dict(arrowstyle="-", lw=0.6, color="#555"), va="center", zorder=8)

fig, axs = plt.subplots(2, 4, figsize=(20, 13.5))
axs = axs.ravel()
G, R = "#1d6b2f", "#9b2c2c"

# 1 Stuetze
ax = axs[0]; galerie(ax); 
P(ax, [(0, 1450), (80, 1450), (80, GAL - GB - 5), (0, GAL - GB - 5)], "#dcbf8e", z=2, ls="--")
wange(ax); tritt(ax)
for (x, z) in [(40, 2050), (40, 1930)]: dowel(ax, x, z)
note(ax, 40, 1600, -440, 1600, "Pfosten 80 × 80 hinter der Wange,\nsteht unten auf dem Zimmerboden")
note(ax, 40, 2050, -440, 2560, "2 Eichendübel Ø 20 quer\ndurch Wange und Pfosten")
note(ax, 2, 2150, -440, 1880, "Wange liegt nur stumpf\nam Balken an (Lage)")
setup(ax, "1  Stütze unter dem Treppenkopf", "+ kein Eingriff in die Galerie, sehr stabil, einfach\n– 2 Pfosten stehen im Raum (Wandseite kaum sichtbar)", G)

# 2 Hoher Wangenkopf
ax = axs[1]; galerie(ax)
wange(ax, extra=[(-150, GAL), (-150, 2650), (0, 2650), (300, LU(300) + 50), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (0, LU(0) + 50 - dU), (0, GAL)])
tritt(ax)
dowel(ax, -75, 2420, 12); dowel(ax, -75, 2540, 12)
ax.annotate("", (-190, GAL), (-190, 2650), arrowprops=dict(arrowstyle="<->", color="#1a4f8a", lw=0.9)); ax.text(-200, 2475, "30–35\ncm", color="#1a4f8a", fontsize=8, ha="right", va="center")
note(ax, -75, GAL + 10, -440, 2180, "Kopf liegt auf dem Galerieboden,\nAusklinkung nur bis halbe Höhe")
note(ax, -75, 2540, -440, 2720, "Holznägel / Schrauben senkrecht\nin den Randbalken")
setup(ax, "2  Hoher Wangenkopf (Schiffstreppe)", "+ kein Eingriff, liegt richtig auf, Haltegriff beim Einsteigen\n– 2 Holzköpfe stehen auf der Galerie", G)

# 3 Einhaengeleiste
ax = axs[2]; galerie(ax)
hook = [(-130, GAL), (30, GAL), (30, 2090), (0, 2090), (0, GAL - 0.01), (-130, GAL - 0.01)]
P(ax, [(-130, GAL), (30, GAL), (30, 2090), (0, 2090), (0, GAL), (-130, GAL)], EI, z=4)
P(ax, [(-130, GAL), (30, GAL), (30, GAL + 25), (-130, GAL + 25)], EI, z=4)
P(ax, [(0, 2090), (30, 2090), (30, GAL), (0, GAL)], EI, z=4)
wange(ax, extra=[(30, GAL + 25), (88, GAL + 25), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (30, LU(30) + 50 - dU)])
tritt(ax, 30)
dowel(ax, 15, 2200, 10); dowel(ax, -65, GAL + 12, 9)
note(ax, -65, GAL + 20, -440, 2600, "Hakenleiste Eiche über die ganze Breite:\nliegt 25 mm auf dem Boden, hängt vorne\nam Balken runter")
note(ax, 15, 2200, -440, 1950, "Wangen in die Leiste eingezapft\nund verleimt")
setup(ax, "3  Einhängeleiste aus Hartholz", "+ kein Eingriff, hängt sauber ein, Holz statt Stahlwinkel\n– Schwelle 2–3 cm über die ganze Breite (abgeschrägt)", G)

# 4 Tasche
ax = axs[3]
zT0 = GAL - GB - RBH + 40
galerie(ax, pocket=[(-RBB, GAL - GB - RBH), (0, GAL - GB - RBH), (0, zT0), (-30, zT0), (-30, GAL - GB), (-RBB, GAL - GB)])
wange(ax, extra=[(0, GAL), (58, GAL), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (0, LU(0) + 50 - dU), (0, zT0), (-30, zT0), (-30, GAL - GB), (0, GAL - GB)])
tritt(ax)
note(ax, -15, 2190, -440, 2560, "Zunge 30 mm in gefräster\nTasche im Randbalken")
note(ax, -15, zT0 + 3, -440, 1880, "liegt auf dem Taschenboden auf")
setup(ax, "4  Tasche (Einlassung)", "+ unsichtbar, trägt gut\n– in den Balken fräsen (Vermieter), Balken muss hoch genug sein", R)

# 5 Schwalbenschwanz
ax = axs[4]
dv = [(0, 2130), (-45, 2110), (-45, GAL - GB), (0, GAL - GB)]
galerie(ax, pocket=[(-RBB, GAL - GB - RBH), (0, GAL - GB - RBH), (0, 2130), (-45, 2110), (-45, GAL - GB), (-RBB, GAL - GB)], floorcut=-50)
wange(ax, extra=[(0, GAL), (58, GAL), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (0, LU(0) + 50 - dU), (0, 2130), (-45, 2110), (-45, GAL), (0, GAL)])
tritt(ax)
note(ax, -25, 2200, -440, 2600, "Schwalbenschwanz an der Wange,\nvon oben in die Aussparung eingehängt\n(Boden dort kurz offen, danach Deckel)")
note(ax, -40, 2112, -440, 1880, "schräge Flanke: Wange kann weder\nnach unten noch nach vorne raus")
setup(ax, "5  Schwalbenschwanz", "+ klassisch, sehr sicher, unsichtbar\n– grössere Aussparung im Balken, genaue Arbeit", R)

# 6 Klaue auf dem Balken
ax = axs[5]
galerie(ax, floorcut=-100)
wange(ax, extra=[(-100, GAL - GB), (-100, 2600), (0, 2600), (280, LU(280) + 50), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (0, LU(0) + 50 - dU), (0, GAL - GB)])
tritt(ax)
note(ax, -50, GAL - GB + 5, -440, 2150, "Galerieboden an der Wange\nausgeschnitten, Wange sitzt\ndirekt auf dem Randbalken")
note(ax, -50, 2550, -440, 2680, "auch hier: Kopf hoch,\nAusklinkung max. halbe Höhe")
setup(ax, "6  Aufsatteln (Klaue) auf dem Balken", "+ liegt direkt auf dem Balken\n– Boden ausschneiden, trotzdem hoher Kopf nötig", R)

# 7 Zapfen
ax = axs[6]
galerie(ax, pocket=[(-RBB, GAL - GB - RBH), (0, GAL - GB - RBH), (0, 2130), (-70, 2130), (-70, 2230), (0, 2230), (0, GAL - GB), (-RBB, GAL - GB)])
wange(ax, extra=[(0, GAL), (58, GAL), (600, LU(600) + 50), (600, LU(600) + 50 - dU), (0, LU(0) + 50 - dU), (0, 2130), (-70, 2130), (-70, 2230), (0, 2230)])
tritt(ax)
dowel(ax, -35, 2180, 9)
note(ax, -50, 2180, -440, 2600, "Zapfen im Zapfenloch,\nmit Holznagel gesichert")
note(ax, -60, 2140, -440, 1880, "bei 40 mm Wange ist der Zapfen\nnur ca. 15 mm dick: zu schwach")
setup(ax, "7  Zapfen", "– bei 40-mm-Wangen zu schwach\n   (nur mit Wangen ab ca. 60 mm sinnvoll)", R)

# Legende
ax = axs[7]; ax.axis("off")
items = [(FI, None, "Wange / Treppe, Fichte"), (EI, None, "Hartholz (Eiche, Buche)"), (BE, "//", "Galerieboden (Bestand)"), (BE, "xx", "Randbalken (Bestand)"), ("#d6b37e", None, "Tritt 1 (gestrichelt)")]
for i, (c, h, t) in enumerate(items):
    ax.add_patch(plt.Rectangle((0.05, 0.86 - i * 0.09), 0.08, 0.06, fc=c, ec="#333", hatch=h, transform=ax.transAxes))
    ax.text(0.17, 0.89 - i * 0.09, t, transform=ax.transAxes, fontsize=10, va="center")
ax.add_patch(Circle((0.09, 0.39), 0.02, fc=DU, ec="black", transform=ax.transAxes))
ax.text(0.17, 0.39, "Holznagel / Eichendübel", transform=ax.transAxes, fontsize=10, va="center")
ax.text(0.05, 0.27, "Grün: ohne Eingriff in die Galerie\nRot: Balken / Boden wird bearbeitet\n\nSeitenansicht, schematisch. Galerie mit\nangenommenen Massen (Boden 30 mm,\nRandbalken 120 × 200). Am Bau messen.", transform=ax.transAxes, fontsize=9.5, va="top")
fig.suptitle("Treppe oben an der Galerie befestigen, nur mit Holz: 7 Varianten", fontsize=16, fontweight="bold")
plt.tight_layout(rect=(0, 0, 1, 0.96)); plt.subplots_adjust(hspace=0.32, bottom=0.07); plt.savefig("varianten_galerie.png", dpi=95)

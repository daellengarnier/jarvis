# NOTES: privat-haushalt

Welt: Privat  
Zuletzt aktualisiert: 2026-10-25

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Alain wohnt in einer WG.
- Themen: Saugroboter, Beamer/Heimkino im Zimmer.

### Projekt Holztreppe Galerie (ab 2026-10-25)

Ersetzt die steile Metalltreppe im Zimmer. L-Treppe aus Holz mit Podest und Geländer.

- Masse laut Alain: Galerie 2,30 m hoch. Podest beginnt 1,25 m (horizontal) nach dem heutigen Treppenstart oben. Wand bis Bambuskorb ca. 1,50 m (Bezugspunkt noch unklar).
- Untere Treppe geht vom Podest rechtwinklig nach links in den Raum.
- Befestigung nur oben am Galeriebalken und am Podest, Podest muss selbst stabil stehen.
- Stand 2026-10-25 (aktuell, wie Alains KI-Bild): Podest auf 1,00 m, beginnt bei 1,25 m, 65 cm lang × 58 cm tief. Oben 6 Steigungen à 21,7 cm, 5 Tritte à 25 cm, 58 cm aussen / 50 cm zwischen den Wangen. Unten 4 Steigungen à 25 cm, 3 Tritte à 20 cm (60 cm), 65 cm breit, nach vorne in den Raum, ohne Geländer. Geländer: Raumseite oben mit Stäben, Podest rechts mit Stäben, Podestpfosten vorne und rechts als hohe Geländerpfosten. Tritte liegen ganz zwischen den Wangen (Wange 5 cm über Trittkante). Podestseite rechts offen (Alain), Aussteifung quer zur Wand mit Strebe auf der linken Seite unter der oberen Treppe. Ragt 1,18 m in den Raum.
- 3D-Modell für Shapr3D: `areas/privat-haushalt/treppe/treppe_cq.py` (CadQuery, parametrisch, erzeugt treppe.step in mm, prüft beim Lauf, dass sich keine Teile überschneiden). Vorschauen im selben Ordner.
- Konstruktion (Stand 2026-10-25, Neuaufbau nach Kritik Alain): 3 Podestpfosten 80 × 80 durchgehend vom Boden bis Geländer (vorne links bis Handlauf oben 2,15 m, rechts beide bis 2,00 m), Pfosten Wand links kurz unter dem Belag. Rahmen 60 × 120 zwischen den Pfosten, Belag 27 mm um die Pfosten ausgeklinkt. Obere Wangen sitzen mit einer Klaue auf einem Auflagerriegel 60 × 120, der aussen an die linken Pfosten geschraubt ist, Raumwange zusätzlich mit Stahllasche an den Pfosten vorne links. Untere Wangen stumpf an die vorderen Pfosten, aussen je eine Stahllasche 6 mm mit 2 × 2 Schrauben M10, unten stehen sie auf dem Boden. Tritte 15 mm in die Wangen eingenutet. Rechte Podestseite offen, Aussteifung: Platte an der Wand, Strebe links zwischen den Pfosten. Oben Wangen bündig mit Galerieboden abgeschnitten, Anschluss an den Galeriebalken noch offen.
- Atlas Cloud (Bildgenerierung) verbunden über ATLASCLOUD_API_KEY. Ergebnis-Host atlas-media.oss-us-west-1.aliyuncs.com ist im Netzwerk noch gesperrt (Stand 2026-10-25).

## Offene Punkte

- [ ] Treppe: Foto Galeriebalken mit Massband (Einhängung der Wangen oben), was mit dem Bambuskorb passiert. Unterschiedliche Steigungen oben 21,7 / unten 25 cm von Alain so gewählt (Podest 1 m, max. 3 Tritte).
- [ ] Treppe: danach Bauplan mit Zuschnitt- und Materialliste.

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

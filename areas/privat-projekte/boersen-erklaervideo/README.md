# Erklärvideo: Börse für Oli

Aktuell: **v3** im Ordner `v3/` (Vintage, auf Alains Musik geschnitten, siehe `v3/README.md`).

Ältere Versionen: 2:00, 1920x1080, 30 fps, Ton synthetisch, kein Voiceover.

v2 (aktuell, `video.html`): eine einzige Kamerafahrt durch eine zusammenhängende Welt. Held ist der Punkt aus dem "?" von "DIE BÖRSE?": er fällt heraus, wird zur Firma (Schoggi AG), zerfällt in 100 Aktien, eine Aktie wird zum Kurs-Kopf, Zoom durch die Aktie ins Rot = Schweizer Fahne, Rauszoomen zeigt die Firma mit Kreuz. Die Firma läuft durch die Tore der Voraussetzungen und sammelt dabei Attribute ein, geht auf Roadshow, ins Orderbuch, an den Handelstag. Eine rote Linie (der rote Faden) folgt ihr die ganze Zeit; am Schluss zeigt ein Rauszoomen den ganzen Weg, und der Held landet als Punkt im "?" von "Alles klar, Oli?".

v1 (`video-v1.html`): Folien-Stil mit Wischblenden, von Alain als zu langweilig verworfen.

## Inhalt

| Zeit | Kapitel |
|---|---|
| 0:00 | Intro: Hey Oli, was ist die Börse? |
| 0:08 | Aktie: Firma (fiktive Schoggi AG) in 100 Stücke, 1 Stück = 1 Aktie |
| 0:22 | Börse als Marktplatz, Angebot und Nachfrage machen den Preis |
| 0:40 | Schweiz: SIX Swiss Exchange (Zürich), BX Swiss (Bern), Aufsicht FINMA |
| 0:50 | Börsengang = IPO, von wenigen zu vielen Besitzern |
| 1:00 | Voraussetzungen SIX Hauptsegment, vereinfacht: AG, 3 Jahre Track Record, min. CHF 25 Mio. Eigenkapital, min. 20 % Free Float, Prospekt geprüft nach FIDLEG, Banken/Anwälte/Revision |
| 1:22 | Ablauf: Vorbereiten, Prospekt, Roadshow, Bookbuilding, 1. Handelstag |
| 1:34 | Wieso: Kapital, Bekanntheit, Exit, Mitarbeiterbeteiligung, Aktien als Währung |
| 1:48 | Der Haken: Offenlegung, Kosten, Druck vom Markt |
| 1:55 | Fazit, Hinweis "keine Anlageberatung" |

Zahlen nach Kotierungsreglement SIX (Stand Wissen Nov. 2026, nicht live geprüft). Free Float verlangt zusätzlich min. CHF 25 Mio. Kapitalisierung, im Video weggelassen.

## Neu rendern

```
node render.js stills /tmp/stills 10 30 70      # Kontrollbilder
node render.js cues cues.json                   # Ton-Cues
python3 soundtrack.py cues.json soundtrack.wav  # braucht numpy, scipy
node render.js video silent.mp4 3               # Bild, ca. 10 min
ffmpeg -i silent.mp4 -i soundtrack.wav -c:v copy -c:a aac -b:a 192k -shortest boerse-fuer-oli.mp4
```

`video.html` direkt im Browser öffnen spielt die Animation live ab (mit `soundtrack.wav` im selben Ordner auch mit Ton). Das fertige MP4 gehört ins Google Drive, nicht ins Repo.

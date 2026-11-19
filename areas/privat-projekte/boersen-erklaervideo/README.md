# Erklärvideo: Börse für Oli

2:00, 1920x1080, 30 fps. Kinetic Typography, alles im Code gerendert, Ton synthetisch. Kein Voiceover, die Texte tragen die Geschichte.

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

# v3: Vintage, auf "Saloon Syncopation" geschnitten

Aktuelle Version. Musik von Alain (Ragtime, 99 BPM, 1:59). Alles ist auf das Beat-Raster der Musik gesetzt (`beats.json`, mit librosa aus der Musik gezogen).

Look: altes Papier, Tinte, ein Rot. Isotype-Piktogramme, Filmkorn, Flackern, Staub, Kreisblende.
Roter Faden: ein Börsenticker tippt die Erzählung aufs Tickerband, das unten durch den ganzen Film läuft.

| Zeit | Musik | Bild |
|---|---|---|
| 0:00 | Klavier-Intro | Kreisblende auf, Ticker tippt "Hey Oli. Was ist eigentlich die Börse?" |
| 0:14 | Bass setzt aus | "Ein kleiner Film für Oli", Sonnenstrahlen |
| 0:18.7 | Bass setzt ein | Titel "Die Börse, für Oli erklärt" |
| 0:23 | | Strahlen schrumpfen zum Siegel der Schoggi-Tafel, 100 Stücke, ein Stück bricht ab und dreht sich zur Aktie |
| 0:33 | | Waage: Käufer gegen Verkäufer, Preis steigt und fällt |
| 0:42 | Lauf | Kursschreiber, "Angebot + Nachfrage = Preis" auf die Schläge |
| 0:44.8 | Akzent | Briefmarken: Helvetia, SIX Zürich, BX Bern, FINMA-Poststempel |
| 0:52.4 | | Poststempel öffnet als Kreisblende das Theater: Börsengang = IPO, 5 Besitzer, dann viele |
| 1:04 | neuer Teil | Antrag auf Kotierung, 6 Voraussetzungen mit Stempel "Erfüllt" auf den Takt, "Bewilligt" |
| 1:20 | | Formular wird Billett, Zug fährt: Vorbereitung, Prospekt, Roadshow, Bookbuilding |
| 1:32.6 | Break | Zug hält am "1. Handelstag", Zoom auf die Glocke, 3, 2, 1 |
| 1:36.4 | Einsatz | DING, Tickerband-Konfetti, Fallblatt-Anzeige: Schoggi AG CHF 42.00 |
| 1:38.5 | | Fallblatt: 5 Gründe (Kapital, Bekanntheit, Exit, Team, Währung) |
| 1:48.6 | | Emailschild "Der Haken" |
| 1:54.9 | Schluss | "Alles klar, Oli?", Kreisblende zu, "Ende." |

## Bauen

```
python3 build.py                                   # src.html + beats.json -> video.html
node render.js stills /tmp/s 20 60 100             # Kontrollbilder
node render.js video silent.mp4 3                  # Bild
ffmpeg -i silent.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k -shortest boerse-fuer-oli.mp4
```

`music.wav` liegt nicht im Repo (Alains Datei, gross). Für die Live-Vorschau `video.html` mit `music.wav` im selben Ordner öffnen.
Schriften (SIL OFL) in `fonts/`: Abril Fatface, Special Elite, Oswald, Playfair Display.

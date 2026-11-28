# Promo-Video Programm

Animiertes Programmvideo der Spinnerei, 9:16 (1080x1920, 60 fps), schwarz/weiss, komplett im Code als Canvas-Animation (`anim.js`), synchron zum Beat. Erste Fassungen: Programm Herbst/Winter 2026 (2026-10-22).

## Fassungen

- Fassung 4 (2026-10-22): wie 3, aber Ausschnitt vom Anfang des Tracks: ab 18.309 s (132.8 BPM, das Tempo ist am Anfang etwas langsamer). Intro über den Aufbau ohne Kick, Drop auf Beat 8 genau beim ersten Anlass, Schlusskarte auf Takt 16, danach 1 Takt Ausblenden. 30.7 s. Merkmale: `features-v4-anfang.js`.
- `anim.js`: Fassung 3 (2026-10-22), psychedelisch und vom Track gesteuert. `features.py` misst pro Videoframe Kick, Hi-Hat, Clap, Bass, Höhen und Lautheit und schreibt `features.js`. Daraus: Kamera-Punch und Schockwellen auf den Kicks, flüssiges Verziehen der Zeilen, Echo-Spuren (letztes Bild vergrössert darüber), Glitch-Streifen auf starken Hi-Hats, Rorschach-Spiegelung im Break (Beat 30 bis 32, Kick fällt weg), ruhiges Schlussbild nach dem letzten Schlag. Das Echo braucht die Vorgänger-Frames, `renderFrame` läuft bei Sprüngen 40 Frames vor.
- Fassung 2 (2026-10-22, nicht mehr als Datei): ohne Kinderdisco, 5 Anlässe, zum Track "Sombras danzantes" (Suno, von Alain). Track läuft mit 133.7 BPM, Kick auf 1 und "und" der 3, Clap auf 2 und 4. Ausschnitt ab 148.107 s (Takt mit Phrasenwechsel) bis zum harten Songende auf dem letzten Schlag (Beat 64 im Video), 30.3 s. Intro 2 Takte, je Anlass 2 Takte, Outro 4 Takte. Der Track liegt nicht im Repo.
- `anim-synth-128bpm.js` mit `audio.py`: erste Fassung mit 6 Anlässen und selbst synthetisiertem Beat (128 BPM, 32.8 s).

Track schneiden: `ffmpeg -ss 148.1071 -i track.m4a -t 30.292 -af "asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=29.79:d=0.5" music2.wav`, danach `python3 features.py music2.wav`. Achtung: `-ss` vor `-i`, sonst blendet afade alles aus. Beat-Raster wurde mit librosa bestimmt (Onset-Faltung pro Achtel, Kick-Histogramm für die Takt-Eins).

Stand 2026-10-22 (Feedback Alain): Ring nur noch weich auf der Takt-Eins, QUM-Laufschrift gedimmt, Titel "QUM / QUEERSICHT / DANCE", Übersicht mit vollständigen Namen. Sound-Bezug: Spektrum (32 Bänder) und Wellenform pro Frame in der Merkmal-Datei. Kitchen zeigt das echte Spektrogramm als Kaskade, das Meer der Soirée die Wellenform, die Schluss-Spirale schwingt mit, Spektrum in der Fusszeile, QUM-Laufschrift und Tunnel schieben auf den Kicks, DANCE kippt auf dem Clap, Blasen zittern auf Hi-Hats.

Inhalt pro Anlass nur Datum, Name, Genre (Wunsch Alain, 2026-10-22). Schlusskarte: Logo der Spinnerei (`logo_black.png`, aus dem App-Icon `public/pwa-512x512.png` im Repo daellengarnier/spinnerei, hochgerechnet und geglättet) und "SPINNEREI".

Tempo, Länge, Schlussschlag und Breaks stehen in `window.CFG` der Merkmal-Datei. Gerendert wird mit `features.js`: die gewünschte Fassung dorthin kopieren (`features-v3-ende.js` oder `features-v4-anfang.js`). Erzeugen: `python3 features.py music.wav BEAT END_BEATS STOP '[[30,32]]'`.

Ausschnitt Fassung 4: `ffmpeg -ss 18.309053 -i track.m4a -t 30.7232 -af "asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=28.9159:d=1.8073" music4.wav`, dann `python3 features.py music4.wav 0.4518111 68 64 '[]'`.

## Rendern

```
node render.js $PWD/silent.mp4            # Frames über Playwright/Chromium nach ffmpeg (ca. 9 min)
python3 features.py music2.wav             # braucht librosa; nur Fassung 1: python3 audio.py music.wav
ffmpeg -i silent.mp4 -i music2.wav -c:v copy -c:a aac -b:a 256k -shortest video.mp4
ffmpeg -i video.mp4 -r 30 -c:v libx264 -crf 23 -c:a copy video-30fps.mp4   # kleiner fürs Handy
```

Vorschau im Browser: `index.html#play`. Einzelbilder: `node render.js $PWD/frames/ 577 1252`.

## Neue Saison

Pro Anlass eine Szene à 8 Beats in `anim.js` (`SECTIONS`, Szenenfunktionen, `LIST` im Outro). Grundtöne in `audio.py` (`ROOTS`, `SEC`) passend zur Anzahl Szenen. Schriften: Inter Display, JetBrains Mono (System). Video selbst nicht ins Repo, sondern in Drive.

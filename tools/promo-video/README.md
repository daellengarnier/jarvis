# Promo-Video Programm

Animiertes Programmvideo der Spinnerei, 9:16 (1080x1920, 60 fps), schwarz/weiss, komplett im Code: Canvas-Animation (`anim.js`) und synthetisierter Beat (`audio.py`), beides auf 128 BPM synchron. Erste Fassung: Programm Herbst/Winter 2026 (2026-10-22).

## Fassungen

- `anim.js`: aktuelle Fassung (2026-10-22) ohne Kinderdisco, 5 Anlässe, zum Track "Sombras danzantes" (Suno, von Alain). Track läuft mit 133.7 BPM, Kick auf 1 und "und" der 3, Clap auf 2 und 4. Ausschnitt ab 148.107 s (Takt mit Phrasenwechsel) bis zum harten Songende auf dem letzten Schlag (Beat 64 im Video), 30.3 s. Intro 2 Takte, je Anlass 2 Takte, Outro 4 Takte. Der Track liegt nicht im Repo.
- `anim-synth-128bpm.js` mit `audio.py`: erste Fassung mit 6 Anlässen und selbst synthetisiertem Beat (128 BPM, 32.8 s).

Track schneiden: `ffmpeg -i track.m4a -ss 148.107 -t 30.292 -af "afade=t=in:d=0.02,afade=t=out:st=29.79:d=0.5" music.wav`. Beat-Raster wurde mit librosa bestimmt (Onset-Faltung pro Achtel, Kick-Histogramm für die Takt-Eins).

## Rendern

```
node render.js $PWD/silent.mp4            # Frames über Playwright/Chromium nach ffmpeg (ca. 9 min)
python3 audio.py music.wav                # braucht numpy und scipy
ffmpeg -i silent.mp4 -i music.wav -c:v copy -c:a aac -b:a 256k -shortest video.mp4
ffmpeg -i video.mp4 -r 30 -c:v libx264 -crf 23 -c:a copy video-30fps.mp4   # kleiner fürs Handy
```

Vorschau im Browser: `index.html#play`. Einzelbilder: `node render.js $PWD/frames/ 577 1252`.

## Neue Saison

Pro Anlass eine Szene à 8 Beats in `anim.js` (`SECTIONS`, Szenenfunktionen, `LIST` im Outro). Grundtöne in `audio.py` (`ROOTS`, `SEC`) passend zur Anzahl Szenen. Schriften: Inter Display, JetBrains Mono (System). Video selbst nicht ins Repo, sondern in Drive.

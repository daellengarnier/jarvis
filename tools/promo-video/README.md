# Promo-Video Programm

Animiertes Programmvideo der Spinnerei, 9:16 (1080x1920, 60 fps), schwarz/weiss, komplett im Code: Canvas-Animation (`anim.js`) und synthetisierter Beat (`audio.py`), beides auf 128 BPM synchron. Erste Fassung: Programm Herbst/Winter 2026 (2026-10-22).

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

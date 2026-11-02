# Video "Einbruch-Saison" (Info fürs Haus)

Animiertes Info-Video für die Bewohnenden des Hauses der Spinnerei, 9:16, 60 fps, ca. 37 s. Erstellt 2026-11-02 auf Wunsch von Alain. Bewusst anderer Stil als die BZ-Folien und als das Programmvideo (Wunsch Alain): Nacht, Zeichnungen nur im Lichtkegel einer Taschenlampe sichtbar, Serifenschrift (Bitstream Charter), Schreibmaschine (Courier 10 Pitch) für Beschriftungen, Signalrot für das Wichtige, ruhige Überblendungen. Code: `nacht.js`, eigener synthetisierter Soundtrack `audio.py` (124 BPM, D-Moll).

Ablauf (je 8 Beats): Intro (Tage werden kürzer, Einbruch-Saison), Wann (Freitag 18 %, 17 bis 18 Uhr), Stadt Bern 10,1 pro 1000 Einwohner:innen, Beute (Schmuck, Bargeld, Velos, E-Bikes aus dem Keller), nur 22 % aufgeklärt, TÜREN ZU (Tür knallt auf Beat 40.5, Musik setzt aus, Schloss rastet auf 42 ein), alle Zugänge (Eingangstür, untere Türen und Wege, Feuertreppe, Keller und Waschküche; einen Veloraum gibt es nicht), Verdächtiges: Polizei 117 und Nachbar:innen, Schluss "Passt aufeinander auf" mit Quellen.

Zahlen aus dem Instagram-Karussell von Berner Zeitung / Der Bund (Alain, 2026-11-02): Freitage 18 %, 17 bis 18 Uhr (BFS), Stadt Bern 10,1 pro 1000 (2025), Schmuck und Bargeld (Mobiliar), Velos und E-Bikes aus Kellern, 22 % aufgeklärt (Kanton Bern, 2025).

Rendern (im Ordner): `python3 audio.py music.wav`, `python3 ../features.py music.wav 0.4838710 76 64 '[]'`, `node render.js $PWD/silent.mp4`, dann mit ffmpeg Ton dazu.

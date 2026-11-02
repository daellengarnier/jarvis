# Video "Einbruch-Saison" (Info fürs Haus)

Animiertes Info-Video für die Bewohnenden des Hauses der Spinnerei, 9:16, 60 fps, ca. 37 s. Erstellt 2026-11-02 auf Wunsch von Alain. Bewusst anderer Stil als die BZ-Folien und als das Programmvideo (Wunsch Alain): Nacht, Zeichnungen nur im Lichtkegel einer Taschenlampe sichtbar, Serifenschrift (Bitstream Charter), Schreibmaschine (Courier 10 Pitch) für Beschriftungen, Signalrot für das Wichtige, ruhige Überblendungen. Code: `nacht.js`, eigener synthetisierter Soundtrack `audio.py` (124 BPM, D-Moll).

Ablauf (je 8 Beats): Intro (Tage werden kürzer, Einbruch-Saison), Wann (Freitag 18 %, 17 bis 18 Uhr), Stadt Bern 10,1 pro 1000 Einwohner:innen, Beute (Schmuck, Bargeld, Velos, E-Bikes aus dem Keller), nur 22 % aufgeklärt, TÜREN ZU (Tür knallt auf Beat 40.5, Musik setzt aus, Schloss rastet auf 42 ein), alle Zugänge (Eingangstür, untere Türen und Wege, Feuertreppe, Keller und Waschküche; einen Veloraum gibt es nicht), Verdächtiges: Polizei 117 und Nachbar:innen, Schluss "Passt aufeinander auf" mit Quellen.

Zahlen aus dem Instagram-Karussell von Berner Zeitung / Der Bund (Alain, 2026-11-02): Freitage 18 %, 17 bis 18 Uhr (BFS), Stadt Bern 10,1 pro 1000 (2025), Schmuck und Bargeld (Mobiliar), Velos und E-Bikes aus Kellern, 22 % aufgeklärt (Kanton Bern, 2025).

Rendern (im Ordner): `python3 audio.py music.wav`, `python3 ../features.py music.wav 0.4838710 76 64 '[]'`, `node render.js $PWD/silent.mp4`, dann mit ffmpeg Ton dazu.

## Musik (Stand 2026-11-02)

Track "Clockwork Creep" (Suno, von Alain), 80.0 BPM, Beat 0.74995 s. Ausschnitt ab 72.18 s (Beat 96 des Songs), 57 s, Ausblenden über die letzten 3 s. Jede Szene 2 Takte (8 Beats). Die Tür knallt auf Beat 136 des Songs (102.18 s), wo die Musik einen Takt lang wegbricht; das Schloss rastet auf Beat 140 ein, wenn der Groove zurückkommt. "Nur 22 %" liegt auf dem grossen Drop (96.18 s). Der eigene Soundtrack `audio.py` ist damit Reserve.

Schneiden: `ffmpeg -ss 72.17993 -i Clockwork_Creep.wav -t 56.99610 -af "asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st=53.99631:d=2.99979" cc_cut.wav`, dann `python3 ../features.py cc_cut.wav 0.7499487 76 39 '[]'`. Der Track liegt nicht im Repo.

Sound-Bezug (2026-11-02, Wunsch Alain): Lichtkegel heller und weiter auf dem Kick, zittert auf Hi-Hats. Seismograf in der Fusszeile zeichnet den Ton auf. Sekundenzeiger (Kopfzeile, Uhr in "Wann") springen auf jedem Kick. Punkteraster Bern als Spektrum, Skala am 22-%-Ring nach Frequenzen, Häkchen der Zugänge auf den Beats, 117 glüht auf dem Kick, Fenster am Schluss gehen auf den Beats an.

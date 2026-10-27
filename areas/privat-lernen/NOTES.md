# NOTES: privat-lernen

Welt: Privat  
Zuletzt aktualisiert: 2026-10-27

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Sprachen.
- Segelschein.
- Überlegungen zu einer Zweitlehre als Schreiner EFZ.

### Belegt

- Vietnamesisch: Ziel B1 bis Mitte 2027 (Alain, 2026-10-18). Kurs: SVFF Complete Vietnamese Course, Level 02, südlicher Dialekt (svff.online). Aktuelle Lektion: Bài 1 "Anh muốn mua gì vậy?" (A2).
- Lernkarten in der Life-App (app.al-daellen.ch, Seite "Lernen"), gebaut 2026-10-27, live seit 2026-10-27 (Commit 9c31a2b). Wiederholung nach Abständen, 15 neue Lernrichtungen pro Tag, Vokabeln und Sätze in beide Richtungen.

### Vietnamesisch: Ablauf für neue Lektionen

- Alain gibt den Inhalt einer Lektion (Vokabeln, Grammatik, Sätze). Jarvis legt daraus eine Deck-Datei an: `vietnamesisch/decks/<kurs>-<level>-<lektion>.json`, Format wie `svff-l2-b1.json` (`deck` mit id, title, course, level, topic, source; `cards` mit type vocab|grammar|phrase, front, back_de, back_en, back_vi, pos, category, example_vi, example_de, note).
- Import in die App: per API `POST /api/v1/decks/import` mit `LIFE_APP_TOKEN` (sobald Token und Netzwerkzugang da sind), sonst fügt Alain das JSON in der App unter Lernen → Importieren ein. Erneuter Import aktualisiert, der Lernstand bleibt.
- Südliche Varianten bevorzugen (z.B. thơm statt dứa, mắc statt đắt), nördliche in Klammern.

## Offene Punkte

- [ ] Welche Sprachen genau, und auf welchem Stand?

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

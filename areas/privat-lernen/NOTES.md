# NOTES: privat-lernen

Welt: Privat  
Zuletzt aktualisiert: 2026-10-27

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Sprachen.
- Segelschein.
- Überlegungen zu einer Zweitlehre als Schreiner EFZ.

### Belegt

- Vietnamesisch: Ziel B1 bis Mitte 2027 (Alain, 2026-10-18). Kurs: SVFF Complete Vietnamese Course, Level 02, südlicher Dialekt (svff.online). Inhalte Lektion 1 bis 12 als Rohdaten in `vietnamesisch/quellen/`, als Decks in `vietnamesisch/decks/`. Weitere folgen.
- Lernkarten in der Life-App (app.al-daellen.ch, Seite "Lernen"), gebaut 2026-10-27, live seit 2026-10-27 (Commit 9c31a2b). Wiederholung nach Abständen, 15 neue Lernrichtungen pro Tag, Vokabeln und Sätze in beide Richtungen.

### Vietnamesisch: Ablauf für neue Lektionen

- Alain gibt den Inhalt einer Lektion (Vokabeln, Grammatik, Sätze). Jarvis legt daraus eine Deck-Datei an: `vietnamesisch/decks/<kurs>-<level>-<lektion>.json`, Format wie `svff-l2-b1.json` (`deck` mit id, title, course, level, topic, source; `cards` mit type vocab|grammar|phrase, front, back_de, back_en, back_vi, pos, category, example_vi, example_de, note).
- Kursexporte im Format `{ kurs, karten: [{ lektion, deck, vorderseite, rueckseite, zusatz }] }` importiert die App direkt (ein Deck pro Lektion, Doppelte werden erkannt). Rohdatei trotzdem in `quellen/` ablegen.
- App-Funktionen (live seit 2026-10-27, Commit d24dd0d): Lektionen 1 bis 12 von SVFF Level 02, Richtung wählbar (Gemischt, VI→DE, DE→VI), "Mehr lernen" mit 10 Zusatzkarten, Sätze mit gestuften Tipps, Einstellungen für neue Karten pro Tag (Standard 15), Tagesziel (30) und Erinnerung per Web Push (Standard 19:00, aus). Push auf dem iPhone nur aus der App auf dem Home-Bildschirm.
- 2026-10-27 Wunsch Alain: jeden Tag ein ganzes Kapitel, frei wählbar. Umgesetzt als "Kapitel des Tages" (Karte auf Heute, Erinnerung nur wenn offen), Wiederholungen nach Abständen laufen als Zusatz. live seit 2026-10-27 (Commit e722297, Erlaubnis Alain).
- 2026-10-27 Alain: nach ganzem Kapitel waren noch Karten "offen". Ursache: zweites System (Wiederholungen nach Abständen), zweite Richtung pro Karte, "Nochmal"-Bewertungen. Neu: Kapitel ist das Tagesziel, Auffrischen freiwillig, heute Geübtes zählt nicht als fällig. Live seit 2026-10-27.
- 2026-10-27 Karten-Abfrage überarbeitet (Feedback Alain mit Screenshots): Grammatik wird jetzt als Satzbildung geübt (deutscher Beispielsatz, Struktur als Hilfe, gesucht ist der vietnamesische Satz). Klammern mit Vietnamesisch im deutschen Text (z.B. "bitte (giùm: …)") stehen erst auf der Rückseite. Jede Karte zeigt die Frage ("Wie sagst du das auf Vietnamesisch?"). Hinweis bei Sätzen nicht mehr doppelt. Commit 999b1fb, live. Üben als eigene Vollbildansicht, Aufdecken ohne Scrollen (Commit 6c168a5), live.
- 2026-10-27 Wunsch Alain: Wörter im Satz antippen, Pop-up mit Übersetzung. Umgesetzt mit Glossar (482 Einträge, von Jarvis aus den Sätzen der Lektionen 1 bis 12 erstellt, Datei `vietnamesisch/glossar.json`), Vokabelkarten haben Vorrang. Wortgruppen werden zusammen erkannt (längste zuerst). Neue Sätze: fehlende Wörter ins Glossar ergänzen und per `POST /api/v1/study/glossary` hochladen. Kein automatisches Vorlesen mehr, nur über den Lautsprecher.
- Import in die App: per API `POST /api/v1/decks/import` mit `LIFE_APP_TOKEN` (sobald Token und Netzwerkzugang da sind), sonst fügt Alain das JSON in der App unter Lernen → Importieren ein. Erneuter Import aktualisiert, der Lernstand bleibt.
- Südliche Varianten bevorzugen (z.B. thơm statt dứa, mắc statt đắt), nördliche in Klammern.

## Offene Punkte

- [ ] Welche Sprachen genau, und auf welchem Stand?

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

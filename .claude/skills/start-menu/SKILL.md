---
name: start-menu
description: 'Startmenü von Jarvis zu Beginn jeder Session und alles, was nach der Wahl 1 bis 4 passiert: Bookinganfragen durchgehen, aktuelles Programm, Sonstiges, Jarvis trainieren. Greift beim Sessionstart und wenn Alain eine Zahl aus dem Menü wählt oder das Menü wieder sehen will. Beispiele: "1", "2", "Menü", "Zeig mir die Bookinganfragen", "Was ist im Programm offen?", "Show me the menu", "Go through the booking requests". Nicht zuständig für: die inhaltliche Arbeit danach (spinnerei-booking, spinnerei-ticketing, spinnerei-kommunikation, privat-projekte usw.) und Änderungen an Skills selbst (training).'
---

# start-menu

Welt: Spinnerei, ausser bei 3 und 4. Konto: info@kulturspinnerei.ch, vorher per `authuser` prüfen.

## Eröffnung

1. Still die Connectors prüfen (siehe CLAUDE.md).
2. Still laufende Fäden prüfen: In `areas/spinnerei-booking/NOTES.md` stehen unter "Anfragen" Einträge mit "warten auf Antwort". Für jeden im Postfach suchen, ob seit unserer letzten Mail eine Antwort kam. Den Faden dafür mit `get_thread` lesen und die letzte Mail prüfen: Die Suchvorschau zeigt nur die ältesten 5 Mails eines Fadens. Ist die letzte Mail von uns, gibt es nichts Neues.
3. Ausgeben, kurz:

```
Hallo Alain. (bzw. Hallo Ambar., je nach Person der Session, siehe CLAUDE.md)
[nur falls vorhanden: Neu: <Act>: <eine Zeile, was geantwortet wurde>]
[nur falls vorhanden: fehlender Connector, eine Zeile]

Was steht an?
1. Bookinganfragen durchgehen
2. Aktuelles Programm
3. Sonstiges
4. Jarvis trainieren
```

Danach warten. Schreibt Alain direkt ein Anliegen statt einer Zahl, wie bei 3 behandeln.

## 1. Bookinganfragen durchgehen

Skill `spinnerei-booking` laden, dann:

1. Im Posteingang info@ Booking-Mails suchen: Agentur-Mails mit Avails, Anfragen von Bands, Formular-Weiterleitungen ("Konzertanfrage", "Booking", "Avail", "tour"). Standard: letzte 30 Tage, ohne bereits beantwortete und ohne Absagen.
2. Pro Act prüfen, ob er in NOTES.md schon steht oder schon abgelehnt wurde.
3. Liste ausgeben, relevanteste zuerst:

| Act | Herkunft, Stil | Angebotene Daten | Kontakt | Mail | YouTube |
|---|---|---|---|---|---|

- YouTube-Link: aus der Mail, sonst per Websuche ein offizielles Video oder einen Live-Mitschnitt suchen. Nichts gefunden: "nicht gefunden". Nie einen Link raten.
- Relevanz: Passt der Act zum Profil der Spinnerei, und ist ein angebotenes Datum frei? Das Profil ist in `areas/spinnerei-booking/NOTES.md` unter "Profil" beschrieben. Fehlt es, nach bisherigen Bookings einschätzen und das als Annahme sagen.
- Darunter, getrennt: laufende Fäden, bei denen wir am Zug sind (die andere Seite hat zuletzt geschrieben).
4. Alain entscheidet pro Act: Interesse, Absage, später. Antworten als Entwurf anlegen. ⚠️ Senden nur nach Ja.
5. Entscheidungen in NOTES.md unter "Anfragen" festhalten, mit Status ("warten auf Antwort", "wir sind am Zug", "abgesagt").

## 2. Aktuelles Programm

1. Alle Ordner in `events/` mit Datum ab heute lesen, dazu bestätigte Termine aus `areas/spinnerei-booking/NOTES.md`, die noch keinen Ordner haben.
2. Pro Anlass, chronologisch: Datum, Act, Status, offene Punkte aus EVENT.md. Dazu im Postfach nach neuen Mails zum Act suchen.
3. Anlässe in den nächsten 14 Tagen zuerst und ausführlicher. Typische Lücken prüfen: Vertrag, Rider, Unterkunft, Promo, PETZI, Abrechnung.
4. Fehlt ein Event-Ordner für einen bestätigten Termin: anlegen vorschlagen.
5. Spinnplan: Jarvis soll ihn aktuell halten (Entscheid Alain, 2026-10-06). Solange der Zugang fehlt (siehe `areas/privat-projekte/NOTES.md`), in einer Zeile sagen, was im Spinnplan nachzutragen wäre.
6. Danach Alain wählen lassen, welchen Punkt wir angehen.

## 3. Sonstiges

Fragen, worum es geht. Dann nach der Skill-Tabelle in CLAUDE.md zuordnen.

## 4. Jarvis trainieren

1. Skill `training` laden.
2. Kurz zeigen: offene Punkte zu Jarvis aus CLAUDE.md und Lücken, die in dieser oder früheren Sessions aufgefallen sind (z.B. "zu prüfen" in NOTES.md).
3. Fragen, was Alain beibringen will, oder einen der Punkte vorschlagen.

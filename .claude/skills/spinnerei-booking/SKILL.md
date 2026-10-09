---
name: spinnerei-booking
description: 'Artist-Bookings der Kulturspinnerei Bern: Anfragen an Bands, Künstler:innen und Agenturen, Angebote, Gagen verhandeln, Avails, Terminabsprachen, Riders entgegennehmen, Booking-Pipeline. Greift z.B. bei: "Schreib der Agentur eine Anfrage für einen Termin im März", "Wie ist der Stand beim Booking von X?", "Welche Daten sind noch frei?", "Draft an offer to the booking agent", "Ask the band for their tech rider". Nicht zuständig für: Ticketing und PETZI (spinnerei-ticketing), Bewerbung des Events (spinnerei-kommunikation), Auszahlung und Abrechnung von Gagen (spinnerei-finanzen), Umsetzung von Tech-Riders (spinnerei-technik), Cleverclip.'
---

# spinnerei-booking

Welt: Spinnerei. Bereichsdaten: `areas/spinnerei-booking/`.

## Ablauf

1. Mit dem Skill `area-context` `areas/spinnerei-booking/NOTES.md` und `decisions.md` lesen.
2. Betrifft es einen Anlass: `events/<JJJJ-MM-TT-act>/EVENT.md` lesen. Nur den eigenen Abschnitt pflegen und den Verlauf ergänzen. Regeln: `events/README.md`.
3. Aufgabe erledigen. Hausregeln aus `CLAUDE.md` gelten (⚠️ vor Kritischem, keine Gedankenstriche).
4. Wenn sich etwas verändert hat: mit `area-context` NOTES.md und decisions.md zurückschreiben, committen, pushen.

## Event-Ordner

Dieser Skill legt Event-Ordner an: ab bestätigtem Termin oder ernsthafter Option, aus `templates/event/EVENT.md`. Lose Anfragen bleiben in `areas/spinnerei-booking/NOTES.md` unter "Anfragen".

## Konto

Spinnerei-Konto: info@kulturspinnerei.ch. Nie aus dem Gmail-Konto senden.

## Wissen

### Essen in der Orga-App (Wunsch Alain, 2026-10-09)

Für jeden Anlass mit Essen, sobald Rider oder Infos zu den Acts da sind:

1. Pro Act Anzahl Personen fürs Essen ermitteln: Musiker plus Crew und Driver laut Rider oder Mail. Driver in der Orga-App beim Act mit dem Häkchen "Driver" erfassen.
2. Essgewohnheiten aus Hospitality Rider und Mails (vegetarisch, vegan, Allergien, Zeitpunkt, Wünsche). Unbekannt: "unbekannt, nachfragen" schreiben, nichts erfinden.
3. In der Orga-App eintragen: pro Act eine Zeile "Essen: ..." in der Notiz, und im Ressort Essen des Anlasses die Beschreibung mit Total (ohne Team) und den Angaben pro Act. Quelle nennen.
4. Widersprüche (z.B. Rider gegen Mail) beide nennen.

Dieser Skill wird über den Skill `training` schrittweise ergänzt. Längeres Wissen kommt in `references/*.md`.

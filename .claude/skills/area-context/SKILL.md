---
name: area-context
description: 'Lädt und speichert den Kontext eines Bereichs unter areas/<bereich>/. Greift beim Einstieg in jede Aufgabe, die einem der 13 Bereiche zugeordnet ist (spinnerei-booking, spinnerei-ticketing, spinnerei-kommunikation, spinnerei-finanzen, spinnerei-technik, spinnerei-verein, privat-admin, privat-finanzen, privat-gesundheit, privat-reisen, privat-haushalt, privat-lernen, privat-projekte), und am Ende jeder Session, die etwas verändert hat. Beispiele: "Was ist der Stand bei den Spinnerei-Finanzen?", "Wo waren wir beim Booking?", "Halt das fest", "What''s the status of my projects?", "Save where we are". Nicht zuständig für: die inhaltliche Arbeit im Bereich (das macht der Bereichs-Skill) und Änderungen an Skills (Skill training).'
---

# area-context

## Einstieg

1. Bereich bestimmen. Unklar zwischen zwei Bereichen: Annahme nennen, nicht ausfragen.
2. `areas/<bereich>/NOTES.md` und `areas/<bereich>/decisions.md` lesen.
3. Relevantes kurz berücksichtigen. Punkte unter "Stand laut Alain, zu prüfen" sind unbestätigt und werden auch so behandelt.

## Abschluss (nur wenn sich etwas verändert hat)

1. `NOTES.md` aktualisieren: Aktueller Stand, Offene Punkte, Nächster Schritt, Datum "Zuletzt aktualisiert".
2. Neue Entscheidungen oben in `decisions.md` eintragen (Format: `templates/area/decisions.md`). Alte Einträge nie umschreiben.
3. Bestätigte Punkte aus "zu prüfen" in den normalen Stand verschieben, widerlegte streichen.
4. Committen (`<bereich>: <was sich geändert hat>`) und pushen.
5. Alain in einer Zeile sagen, dass NOTES.md aktualisiert, committet und gepusht ist.

Fehlt ein Bereichsordner: aus `templates/area/` anlegen und das sagen.

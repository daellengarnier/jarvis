---
name: privat-projekte
description: 'Alains eigene Projekte: VPS app.felsenau.org und die Apps darauf (Code, Hosting, Deploy), z.B. Spinnplan, Life-Org-App, Spinnerei-Budget-Tracker als Software, 3D/Photogrammetrie-Karte des Spinnerei-Areals, Motorrad, weitere Bastelprojekte. Greift z.B. bei: "Deploy die neue Version vom Spinnplan", "Was läuft gerade auf dem VPS?", "Wie mache ich die Photogrammetrie-Karte schärfer?", "Fix the docker-compose for the life org app", "When is the motorcycle service due?". Nicht zuständig für: Inhalte des Spinnerei-Budgets (spinnerei-finanzen), Spinnerei-Licht und Visuals (spinnerei-technik), Cleverclip-Projekte.'
---

# privat-projekte

Welt: Privat. Bereichsdaten: `areas/privat-projekte/`.

## Ablauf

1. Mit dem Skill `area-context` `areas/privat-projekte/NOTES.md` und `decisions.md` lesen.
2. Aufgabe erledigen. Hausregeln aus `CLAUDE.md` gelten (⚠️ vor Kritischem, keine Gedankenstriche).
3. Wenn sich etwas verändert hat: mit `area-context` NOTES.md und decisions.md zurückschreiben, committen, pushen.

## Konto

Privat-Konto: Gmail (alaingarnier.ch@gmail.com). Nie aus info@kulturspinnerei.ch senden.

## Wissen

### Spinnerei-App (github.com/daellengarnier/spinnerei)

- Änderungen direkt auf main committen und pushen, keinen Feature-Branch anlegen und nicht vorher nach einem Merge-Ja fragen (Alain, 2026-11-14). Push auf main deployt live.
- Vor dem Push: `npx tsc --noEmit` und eslint auf die geänderten Dateien, bei Schema- oder API-Änderungen lokal mit Postgres testen.
- Nach dem Push den Deploy-Run (deploy.yml) prüfen und Alain das Ergebnis melden.
- Weiterhin ⚠️ vorher fragen bei Migrationen, die Daten löschen oder überschreiben (Hausregel Löschen).

Dieser Skill wird über den Skill `training` schrittweise ergänzt. Längeres Wissen kommt in `references/*.md`.

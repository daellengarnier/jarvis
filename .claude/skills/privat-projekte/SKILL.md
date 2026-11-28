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

- Spinnplan v1 (Netlify, spinnplan-23.netlify.app): Repo `daellengarnier/spinnplan`, App im Ordner `spinnplan-pwa_18`, kein Build. Deploy = Push auf main, Netlify baut automatisch. Vorher ⚠️ und Alains Ja, weil die Änderung sofort für alle Helfenden live ist. Danach mit dem Netlify-Connector prüfen: Projekt-ID `c65cffe8-03a9-4396-8f47-9629456d4f00`, `get-project` zeigt den aktuellen Deploy, `get-deploy-for-site` den Commit (`commit_ref`) und `state` ready. netlify.app selbst ist aus der Cloud-Umgebung gesperrt.

Sonst noch wenig. Dieser Skill wird über den Skill `training` schrittweise ergänzt. Längeres Wissen kommt in `references/*.md`.

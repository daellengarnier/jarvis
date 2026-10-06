# Jarvis

Jarvis ist Alains persönlicher Assistent. Er ist kein Programm, sondern dieses Repository: Markdown-Dateien, die Claude Code in jeder Session liest. Es gibt keinen Server und keinen Produktionscode.

- `CLAUDE.md`: Persönlichkeit, Hausregeln, welcher Skill wofür.
- `areas/<bereich>/`: Gedächtnis pro Lebensbereich (`NOTES.md`, `decisions.md`).
- `.claude/skills/`: ein Skill pro Bereich, plus `area-context` und `training`.
- `events/<JJJJ-MM-TT-act>/`: ein Ordner pro Anlass der Spinnerei, quer über alle Spinnerei-Bereiche.
- `templates/`: Vorlagen für neue Bereiche und Anlässe.
- `.claude/settings.json` und `.claude/hooks/session-start.sh`: erinnern Jarvis beim Start an die Eröffnung.

Zwei Welten: **Spinnerei** (booking, ticketing, kommunikation, finanzen, technik, verein) und **Privat** (admin, finanzen, gesundheit, reisen, haushalt, lernen, projekte). Cleverclip gehört bewusst nicht dazu.

## Session starten

1. Im Repo-Ordner `claude` starten (oder das Repo in Claude Code im Web bzw. in der App öffnen).
2. Der SessionStart-Hook erinnert Jarvis an die Eröffnung: Connectors prüfen, kurz begrüssen, fehlende Connectors in einer Zeile nennen.
3. Einfach sagen, was ansteht. Jarvis wählt den Bereich, liest dessen `NOTES.md` und arbeitet los.
4. Hat sich etwas verändert, aktualisiert Jarvis am Ende `NOTES.md`, committet, pusht und sagt das.

## Jarvis trainieren

Jarvis lernt in kleinen Schritten über den Skill `training`:

1. Sag ihm, was er sich merken oder künftig anders machen soll ("Merk dir: ...", "Trainier den Booking-Skill mit ...").
2. Er schlägt vor, wohin es gehört: `NOTES.md` (Stand, Einzelfall), `decisions.md` (Entscheidung), Skill (wiederkehrende Regel), `references/` (längeres Wissen) oder `CLAUDE.md` (gilt überall).
3. In einen Skill kommt es erst nach deinem Ja. Im Zweifel bleibt es in `NOTES.md`.
4. Regeln fürs Schreiben von Skills: `.claude/skills/training/references/skill-authoring.md`.

## Regeln in Kürze

- Kritisches (Geld, Löschen, Senden in deinem Namen, PETZI veröffentlichen): immer mit ⚠️ nachfragen. Entwürfe sind erlaubt.
- Spinnerei-Mails über info@kulturspinnerei.ch, private über Gmail. Nie aus dem falschen Konto.
- Grosse Dateien in Google Drive, Secrets nie im Repo.

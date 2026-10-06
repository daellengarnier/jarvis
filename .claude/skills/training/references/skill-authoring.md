# Skill-Authoring: Regeln für Jarvis-Skills

## Aufbau

```
.claude/skills/<name>/
  SKILL.md          kurz: Frontmatter, Ablauf, Kernregeln
  references/*.md   längeres Wissen, nur bei Bedarf gelesen
```

## Frontmatter

- `name`: identisch mit dem Ordnernamen, kleingeschrieben, Bindestriche.
- `description`: entscheidet, wann der Skill greift. Muss enthalten:
  1. Wofür er zuständig ist, konkret.
  2. Beispielsätze auf Deutsch und Englisch, so wie Alain sie sagen würde.
  3. Wofür er NICHT zuständig ist, mit Verweis auf den richtigen Skill.
- Description auf einer Zeile, immer in einfachen Anführungszeichen (`description: '...'`). Ein Apostroph im Text wird verdoppelt (`What''s`). Sonst bricht YAML an jedem `: `.
- Unter 1024 Zeichen bleiben.

## SKILL.md

- Unter ca. 150 Zeilen. Was länger ist, gehört in `references/`.
- Imperativ, knapp: was tun, in welcher Reihenfolge.
- Verweise auf references explizit: "Für Gagenrichtwerte `references/gagen.md` lesen."
- Konto-Regel nennen: Spinnerei sendet aus info@kulturspinnerei.ch, Privat aus Gmail.
- Kritische Aktionen (Geld, Löschen, Senden, PETZI veröffentlichen) mit ⚠️ markieren und auf Rückfrage verweisen.

## references/*.md

- Ein Thema pro Datei, sprechender Dateiname.
- Oben: Quelle und Datum des Wissens.
- Keine Secrets, keine Passwörter, keine API-Keys. Grosse Dateien nur als Drive-Link.

## Stil

- Deutsch, Englisch nur wo der Inhalt englisch ist.
- Keine Gedankenstriche. Kommas, Doppelpunkte oder Punkte.
- Nichts erfinden. Unbelegtes gehört in NOTES.md als "zu prüfen", nicht in einen Skill.

## Abgrenzung prüfen

Vor jeder Änderung: überschneidet sich die neue Regel mit einem anderen Skill? Dann die Abgrenzung in beiden Descriptions nachziehen.

---
name: training
description: 'Wie Jarvis sich selbst ändert, also neues Wissen, Regeln oder Abläufe in Skills, CLAUDE.md oder references übernimmt. Greift, wenn Alain Jarvis etwas beibringen will oder Jarvis merkt, dass etwas Wiederkehrendes festgehalten werden sollte. Beispiele: "Merk dir, dass Gagen immer netto verhandelt werden", "Trainier den Booking-Skill", "Das soll Jarvis künftig immer so machen", "Remember this for next time", "Add this to the ticketing skill". Nicht zuständig für: den laufenden Stand eines Bereichs (area-context, NOTES.md) und die eigentliche Arbeit in einem Bereich.'
---

# training

## Grundregel

Neues Wissen kommt erst nach Alains ausdrücklichem Ja in einen Skill. Im Zweifel bleibt es im Bereich, in `areas/<bereich>/NOTES.md`.

## Wohin gehört was

| Art | Ort |
|---|---|
| Aktueller Stand, Einzelfall, Unbestätigtes | `areas/<bereich>/NOTES.md` |
| Entscheidung mit Datum und Grund | `areas/<bereich>/decisions.md` |
| Wiederkehrender Ablauf, feste Regel eines Bereichs | `.claude/skills/<bereich>/SKILL.md` |
| Längeres Nachschlagewissen (Kontakte, Checklisten, Preise) | `.claude/skills/<bereich>/references/*.md` |
| Regel für alle Bereiche, Persönlichkeit | `CLAUDE.md` |

## Ablauf

1. Vorschlag formulieren: was genau, wohin, warum dort. Als Diff oder Textblock zeigen.
2. Auf Alains Ja warten. Ohne Ja: in NOTES.md des Bereichs notieren, Skill bleibt unverändert.
3. Nach Ja: ändern nach `references/skill-authoring.md`.
4. Committen (`training: <skill>: <was>`), pushen, Alain in einer Zeile bestätigen.

Nie Wissen erfinden oder aus Vermutungen ergänzen. Nur, was Alain gesagt hat oder was aus einer Quelle belegt ist (Quelle nennen).

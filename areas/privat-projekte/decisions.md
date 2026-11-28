# Entscheidungen: privat-projekte

Neueste oben. Format siehe templates/area/decisions.md.

## 2026-10-18: ambardaellen-app wird Alains Life-App

- Entscheidung: Die Paar-App wird komplett umgebaut zu einer Ein-Personen-App für Alain, mit Jarvis als API-Client. Ambar ist nicht mehr Teil der App. Jarvis darf die App umbauen (Push-Zugriff).
- Warum: Eine App für Todos aus allen Bereichen, Ziele, Gewohnheiten, Vietnamesisch und Routinen, die Jarvis direkt befüllen kann.
- Wer: Alain

## 2026-10-08: Spinnplan v1 deployt per Git-Push

Netlify-Projekt spinnplan-23 ist mit `daellengarnier/spinnplan` verknüpft, Push auf main geht automatisch live. Grund: Jarvis kann so selbst deployen, ohne Token oder Netzwerkfreigabe für Netlify. Vor jedem Push, der live geht, fragt Jarvis Alain.

## 2026-10-27: Life-App deployen ohne Nachfrage

Alain: "Ich gebe Berechtigung immer, du kannst das immer ohne Berechtigung machen." Jarvis pusht Änderungen der Life-App (app.al-daellen.ch, Branch `claude/shared-org-app-IYZYF`) direkt live, ohne ⚠️-Frage. Bedingung: Typecheck, Lint und lokaler Build sauber, CI-Build auf dem Feature-Branch grün. Gilt nur für die Life-App, nicht für die Spinnerei-Orga-App (dort nutzen andere die App live) und nicht fürs Löschen von Daten wie legacy_workspace_state oder Ambars Konto: das bleibt ⚠️.
- Wer: Alain

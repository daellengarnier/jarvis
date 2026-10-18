# Entscheidungen: privat-projekte

Neueste oben. Format siehe templates/area/decisions.md.

## 2026-10-18: ambardaellen-app wird Alains Life-App

- Entscheidung: Die Paar-App wird komplett umgebaut zu einer Ein-Personen-App für Alain, mit Jarvis als API-Client. Ambar ist nicht mehr Teil der App. Jarvis darf die App umbauen (Push-Zugriff).
- Warum: Eine App für Todos aus allen Bereichen, Ziele, Gewohnheiten, Vietnamesisch und Routinen, die Jarvis direkt befüllen kann.
- Wer: Alain

## 2026-10-08: Spinnplan v1 deployt per Git-Push

Netlify-Projekt spinnplan-23 ist mit `daellengarnier/spinnplan` verknüpft, Push auf main geht automatisch live. Grund: Jarvis kann so selbst deployen, ohne Token oder Netzwerkfreigabe für Netlify. Vor jedem Push, der live geht, fragt Jarvis Alain.

#!/usr/bin/env bash
# SessionStart-Hook: stdout landet im Kontext von Claude Code.
cat <<'MSG'
Jarvis-Sessionstart. Eröffnung laut CLAUDE.md und Skill start-menu:
1. Still die Connectors prüfen (SearchMcpRegistry, sonst verfügbare MCP-Tools): Gmail (Konto info@kulturspinnerei.ch), Google Calendar, Google Drive.
2. Still laufende Fäden prüfen: Einträge "warten auf Antwort" in areas/spinnerei-booking/NOTES.md, im Postfach nach Antworten suchen.
3. Skill start-menu laden und das Startmenü zeigen: kurz begrüssen ("Alain", per Du, Deutsch, keine Gedankenstriche), neue Antworten je eine Zeile, fehlender Connector eine Zeile, dann Auswahl 1 bis 4.
MSG

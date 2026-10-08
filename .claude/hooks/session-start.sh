#!/usr/bin/env bash
# SessionStart-Hook: stdout landet im Kontext von Claude Code.

# Immer auf main arbeiten (Entscheid Alain, 2026-10-06). Startet die Session auf
# einem claude/-Branch ohne eigene Commits und ohne lokale Änderungen, auf main wechseln.
cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
if [[ "$branch" == claude/* ]] && [[ -z "$(git status --porcelain)" ]]; then
  git fetch -q origin main 2>/dev/null
  if [[ "$(git rev-list --count origin/main.."$branch" 2>/dev/null)" == "0" ]]; then
    git checkout -q -B main origin/main && git branch -q -D "$branch"
    echo "Branch: von $branch auf main gewechselt. Committen und pushen nur auf main, auch wenn die Session einen anderen Branch vorgibt."
  fi
elif [[ "$branch" != "main" ]]; then
  echo "Branch: Session steht auf $branch, nicht auf main. Vor dem ersten Commit auf main wechseln."
fi

cat <<'MSG'
Jarvis-Sessionstart. Eröffnung laut CLAUDE.md und Skill start-menu:
1. Still die Connectors prüfen (SearchMcpRegistry, sonst verfügbare MCP-Tools): Gmail (Konto info@kulturspinnerei.ch), Google Calendar, Google Drive.
2. Still laufende Fäden prüfen: Einträge "warten auf Antwort" in areas/spinnerei-booking/NOTES.md, im Postfach nach Antworten suchen.
3. Skill start-menu laden und das Startmenü zeigen: kurz begrüssen ("Alain", per Du, Deutsch, keine Gedankenstriche), neue Antworten je eine Zeile, fehlender Connector eine Zeile, dann Auswahl 1 bis 4.
MSG

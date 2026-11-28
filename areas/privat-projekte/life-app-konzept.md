# Konzept: Umbau ambardaellen-app zur Life-App mit Jarvis

Stand: 2026-10-18, Entwurf. Repo `daellengarnier/ambardaellen-app`, live auf app.al-daellen.ch.

## Ziel

Aus der Paar-App wird Alains persönliche Organisations-App. Sie bündelt Todos aus allen Bereichen (Privat und Spinnerei), Ziele, Gewohnheiten, Vietnamesisch und Routinen. Jarvis ist direkt angebunden: Er sortiert ein, plant den Tag und erzeugt Lernkarten.

Arbeitsteilung:

- **App**: Daten, Oberfläche (PWA auf dem Handy), schnelles Erfassen, Abhaken.
- **Jarvis**: Denken. Inbox triagieren, "Heute" planen, Wochenrückblick, Lernkarten, Abgleich mit Mail, Kalender, Orga-App und Spinnplan.

## Ausgangslage (Code-Stand 26.06.2026)

- Next.js 16, Postgres, Drizzle, Docker, Caddy. Deploy per GitHub Actions bei Push auf `main` (Image nach GHCR, dann SSH auf den VPS, `/opt/ambardaellen`).
- Zwei Nutzer (A = Ambar, D = Dällen), jedes Item mit `scope` geteilt/A/D.
- Alle Daten als ein JSON-Block pro Workspace (`workspace_state`), Sync über `GET/PUT /api/sync` mit Versionsnummer.
- Tabs: Heute, Aktivitäten (inkl. Reisen, Packlisten), Einkauf, Todo, Ziele (einmalig und wiederkehrend), Zyklus.
- Design-Handoff in `design_handoff/`: warm, ruhig, Instrument Serif, Erdtöne, Watercolor-Atmosphäre.

## Was sich ändert

| Thema | Heute | Neu |
|---|---|---|
| Nutzer | Ambar + Dällen | nur Alain, plus Jarvis als API-Client |
| Speicherung | ein JSON-Block | eine Tabelle pro Entität, Änderungen pro Eintrag |
| Sichtbarkeit | scope geteilt/A/D | entfällt |
| Zyklus | Anker des Heute-Screens | entfällt komplett |
| Ordnung | freie Tags | Bereich (die 13 Jarvis-Bereiche) plus freie Tags |
| Erfassen | in der App | App, Telegram (@daellen_bot), Jarvis |
| Streaks, Erinnerungen | bewusst keine | dosiert: Serie nur beim Lernen, Erinnerungen nur per Telegram |

Bleibt: Login, Deploy-Pipeline, Design-Sprache, Einkauf, Aktivitäten mit Reisen und Packlisten.

## Datenmodell (Entwurf)

- `areas`: die 13 Bereiche aus Jarvis (Schlüssel wie `privat-lernen`, Welt Spinnerei/Privat). Cleverclip bewusst nicht.
- `inbox_items`: Rohtext, Quelle (app, telegram, jarvis), erfasst am, verarbeitet am, daraus entstanden (Todo-ID).
- `todos`: Text, Notiz, Bereich, Frist, Priorität, Status (offen, erledigt, verworfen), `planned_for` (Datum für "Heute"), Ziel-ID optional, Quelle und Quell-Referenz (z.B. Link auf Mail, Orga-App-Anlass), erstellt von (alain/jarvis).
- `goals` + `goal_steps`: einmalige Ziele mit Horizont (kurz, mittel, lang), Zielwert, Fortschritt, Schritte.
- `habits` + `habit_logs`: wiederkehrende Ziele (heute als `kind: wiederkehrend` mit `log`), Sollwert pro Tag/Woche/Monat.
- `cards` + `card_reviews`: Lernkarten mit Deck (z.B. "Vietnamesisch"), Vorderseite, Rückseite, Notiz, Spaced-Repetition-Felder (fällig am, Intervall, Ease, Wiederholungen).
- `day_plans`: Datum, Notiz von Jarvis für den Tag.
- `reviews`: Wochen- und Monatsrückblicke (Text von Jarvis, Antworten von Alain).
- `shopping_items`, `activities`, `trip_segments`, `packlist_items`, `packlist_templates`: aus dem bestehenden Modell, ohne scope.

## API für Jarvis

- Authentifizierung: eigenes API-Token (Bearer), auf dem Server gehasht gespeichert, als Umgebungsvariable in der Jarvis-Umgebung. Nie im Repo.
- REST unter `/api/v1/`: `inbox`, `todos`, `goals`, `habits`, `cards`, `day-plans`, `reviews`, `shopping`, `activities`. Je `GET` (mit Filtern wie `?area=`, `?due_before=`, `?planned_for=`), `POST`, `PATCH /:id`, `DELETE /:id`.
- `GET /api/v1/today`: alles für den Tag in einem Aufruf (Plan, Heute-Todos, überfällige, fällige Karten, Gewohnheiten).
- `POST /api/v1/telegram/webhook`: Nachrichten an den Bot landen in der Inbox. Absender nur Alain (Chat-ID 732755112), Webhook mit Secret-Header. Hinweis: Mit einem Webhook funktioniert `getUpdates` am Bot nicht mehr. Senden (`sendMessage`) für das Briefing bleibt unverändert.

## Screens

1. **Heute**: Notiz von Jarvis, 3 bis 5 Todos für heute, Überfälliges, Gewohnheiten zum Abhaken, Vietnamesisch (fällige Karten), nächster Termin.
2. **Inbox**: Unverarbeitetes, schnell erfassen. Jarvis leert sie in den Routinen, Alain kann selbst zuordnen.
3. **Todo**: nach Frist oder nach Bereich, Filter Spinnerei/Privat.
4. **Ziele**: einmalige Ziele und Gewohnheiten.
5. **Lernen**: Kartenabfrage (Vietnamesisch zuerst), Serie, Statistik.
6. **Mehr**: Einkauf, Aktivitäten und Reisen.

## Spinnerei

Todos pro Anlass bleiben in der Orga-App (spinnerei.al-daellen.ch), Schichten im Spinnplan. Jarvis übernimmt nur Alains eigene Punkte als Todos mit Quelle `orga-app` und Link zurück. Erledigt wird in der Quelle, Jarvis gleicht ab. Keine Doppelpflege.

## Routinen (Jarvis)

| Wann | Was |
|---|---|
| Morgens, bestehende Morgenroutine | Briefing per Telegram, dazu `day_plans` und `planned_for` für heute setzen |
| 2 bis 3 Mal täglich | Inbox triagieren: Bereich, Frist, nächster Schritt |
| Abends, optional | Telegram: Was ist erledigt? Rest verschieben? |
| Sonntag | Wochenrückblick, Ziele prüfen, Plan für die Woche, neue Lernkarten |
| Monatlich | Ziele und Liegengebliebenes aufräumen |

## Repo NOTES vs. App

Todos leben künftig in der App. `NOTES.md` behält Kontext, Stand und Entscheidungen. Offene Punkte zu Jarvis selbst und an Anlässe gebundene Punkte (`EVENT.md`) bleiben vorerst im Repo, das wird nach Phase 2 neu beurteilt.

## Migration der bestehenden Daten

- Ein einmaliges Skript liest den JSON-Block auf dem Server und schreibt in die neuen Tabellen.
- Übernommen werden Items mit scope D und geteilt. Items mit scope A (Ambar privat) und alle Zyklusdaten werden nicht übernommen und nicht gelesen.
- Vor der Migration ein DB-Backup (`pg_dump`).
- Löschen des alten JSON-Blocks, der Zyklusdaten und von Ambars Account erst nach ⚠️ und Ja von Alain.

## Vorgehen

Entwicklung auf einem Branch (`claude/shared-org-app-umbau`): Der Workflow baut dafür ein Image, deployt aber nicht. Live geht es erst mit dem Merge auf `main`, und den macht Jarvis nur nach Ja von Alain.

1. **Fundament**: Datenmodell, Single-User, Zyklus und scope raus, Migration, API mit Token, Screens Heute, Inbox, Todo.
2. **Jarvis-Anbindung**: Telegram-Eingang, Morgenroutine erweitern, Inbox-Triage als Routine.
3. **Ziele und Gewohnheiten** im neuen Modell, Sonntagsrückblick.
4. **Lernen**: Karten, Spaced Repetition, Vietnamesisch-Deck.
5. **Spinnerei-Abgleich** mit Orga-App und Spinnplan.

## Offen

- Vietnamesisch: Stand und Ziel (Grundlage für die Karten).
- Name der App und ob die Domain app.al-daellen.ch bleibt.
- Infrastruktur prüfen: Laut NOTES läuft im Stack `ambardaellen-app` auch der Caddy für die Spinnerei-Orga-App. Das Caddyfile im Repo kennt nur app.al-daellen.ch. Vor Änderungen an Compose oder Caddy klären, was auf dem VPS wirklich läuft (Jarvis hat keinen SSH-Zugang).
- Bleiben Einkauf und Aktivitäten/Reisen so, oder werden sie vereinfacht?

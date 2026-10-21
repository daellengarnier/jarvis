# NOTES: privat-projekte

Welt: Privat  
Zuletzt aktualisiert: 2026-10-18

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Eigener VPS unter app.felsenau.org, SSH-Alias viapp, Apps je in /opt/<app>/ mit docker-compose.
- Apps u.a.: Spinnplan, Life-Org-App, Spinnerei-Budget-Tracker.
- Spinnerei Orga-App: spinnerei.al-daellen.ch, Repo daellengarnier/spinnerei (Next.js, Deploy per Push auf main über GitHub Actions).
- 3D/Photogrammetrie-Karte des Spinnerei-Areals.
- Motorrad.

### Belegt vom VPS (2026-10-18)

- `viapp` (app.felsenau.org) betreibt nur die via1-app (Organisations-App der WG Via 1, Repo `daellengarnier/via1-app`): Container app, db, nginx, certbot. Unter /opt nur `via1-app`, `backups`, `containerd`.
- viapp hat die IP 185.143.100.53. Nicht auf viapp: ambardaellen-app, Spinnerei-Orga-App, Caddy.
- Zweiter Server 179.237.68.22: Dorthin zeigen app.al-daellen.ch (ambardaellen-app) und spinnerei.al-daellen.ch (Orga-App). Dort läuft vermutlich auch der Caddy aus dem Stack `ambardaellen-app`, der beide Domains ausliefert. Zugang (SSH-Alias, Login) noch unbekannt, Deploy läuft über GitHub-Secrets.

### Belegt aus GitHub (2026-10-06)

- Spinnerei Orga-App: Repo `daellengarnier/spinnerei`, live auf https://spinnerei.al-daellen.ch. Next.js 16, Postgres, Drizzle, Docker. Auto-Deploy per GitHub Actions bei Push. Caddy im Stack `ambardaellen-app` auf demselben VPS.
  - Anlässe mit Zeiten, Preisen, Drive-Link, PETZI-Link, Acts, Ressorts, Todos, Sitzungen, Abrechnung.
  - Knopf "Publizieren": legt den Anlass als Entwurf auf kulturspinnerei.ch an (WordPress, The Events Calendar, REST mit Anwendungspasswort). Veröffentlicht wird von Hand in WordPress.
  - Feld "Websitetext" pro Anlass (Commit 3e767e6, 2026-10-12): Einleitung vor den Promotexten der Acts beim Publizieren. Migration 0028.
  - PETZI-Webhook (`/api/petzi/webhook`) zählt Tickets.
  - Seed-Migration enthält die Anlässe Herbst 2026 ohne Soirée Tropicale 28.11. Diese ist inzwischen in der App (laut Notiz spinnerei-booking, 2026-10-06).
- Spinnplan v2 (`daellengarnier/spinnplan-v2`): Schichtplan, Rewrite weg von Supabase/Netlify, Phase 1 von 3 (Stand README).
- Spinnplan alt (`daellengarnier/spinnplan`): Supabase, noch aktiv bis Cutover. PWA, Supabase-Projekt `biyeggzutwajuueexcxl.supabase.co`. Tabelle `events` (Name, Datum, Zeiten, Rollen und Anzahl pro Rolle, `fixed_roles` für AV, BV, Licht, Ton, Kochen, Filmen), Tabelle `slots` für die Schichten. Anlässe anlegen und ändern dürfen per RLS nur Admins.

## Offene Punkte

- [x] Netzzugang zu spinnerei.al-daellen.ch und kulturspinnerei.ch in der Cloud-Umgebung freigegeben (2026-10-06, getestet).
- [x] Jarvis-Account in der Orga-App: Zugangsdaten als Umgebungsvariablen `SPINNEREI_APP_EMAIL` und `SPINNEREI_APP_PASSWORD`, Login über die API (siehe CLAUDE.md). Normaler Benutzer, kein Admin. Von einer Session am 2026-10-06 bereits genutzt.
- [x] Push-Zugriff: Jarvis kann auf `daellengarnier/spinnerei`, `spinnplan` und `spinnplan-v2` pushen (geprüft 2026-10-08).
- [x] Spinnplan: Jarvis hat vollen Zugriff, legt Anlässe selbst an und passt die App nach Bedarf an (Entscheid Alain, 2026-10-06, bestätigt 2026-10-08). Daten über den Supabase-Connector (Projekt "Spinnplan", `biyeggzutwajuueexcxl`), kein eigener App-Account nötig. Hinweis: Statements mit `drop` hängen im Connector (Timeout), `apply_migration` ebenso. DDL ohne `drop` per `execute_sql` geht.
- [x] Spinnplan v1 live auf Netlify (spinnplan-23.netlify.app, Projekt-ID `c65cffe8-03a9-4396-8f47-9629456d4f00`). Seit 2026-10-08 mit `daellengarnier/spinnplan` verknüpft: Push auf main deployt automatisch (Ordner `spinnplan-pwa_18`, kein Build). v2 wird später migriert.
- 2026-10-08 Supabase: Sicherheitslücke geschlossen. Vorher konnte sich jeder eingeloggte Benutzer per API selbst zum Admin machen. Jetzt: Trigger `guard_is_admin` (nur Admins ändern `is_admin`, Selbst-Insert immer false), Policy "Admins can update any profile", Funktion `is_admin_user()`, `handle_new_user` nicht mehr per API aufrufbar. Getestet (Rollback): Selbst-Admin blockiert, Namensänderung geht, Admin kann andere befördern. Offen aus den Supabase-Warnungen: `pg_net` im Schema public, Schutz gegen geleakte Passwörter aus, `notifications` und `push_subscriptions` sehr offen.
- 2026-10-08 Kinderdisco 24.10.: Einlass auf 14:00 bis 16:00 (`role_dur_hours` Einlass 2), Rest unverändert.
- 2026-10-08 Spinnplan: Anlässe 31.10. bis 12.12. (QUM, Jugendsession, Kitchen, Artlu, Soirée, Mothers Cake) per SQL angelegt, Slots wie `buildSlots` (`<Rolle>_<Block>`, `slot_index` 0..Anzahl-1). Direktes Insert löst keine Push-Notification "neuer Anlass" aus.
- [x] Spinnplan v1: Dauer pro Schichtart auch im Formular für normale Anlässe. Commit ef2dec8 live seit 2026-10-08 20:08 UTC (Netlify-Deploy `6ac7f82f05fa07000827006c`, ready).
- [ ] Life-App: Umbau der ambardaellen-app (app.al-daellen.ch, Repo `daellengarnier/ambardaellen-app`) zu Alains persönlicher Organisations-App mit Jarvis-Anbindung. Konzept: `life-app-konzept.md`.
  - 2026-10-18 Phase 1 fertig auf Branch `claude/shared-org-app-umbau` (noch nicht live): Tabellen für Todos, Inbox, Tagesplan, Bereiche, API-Tokens; API v1 (`docs/API.md` im App-Repo); Screens Heute, Inbox, Todo, Mehr; Zyklus und Partner-Funktionen raus, Login nur Alain. Lokal getestet (Migration, API, Browser).
  - Hinweis: Default-Branch des App-Repos ist `claude/shared-org-app-IYZYF`, nicht `main`. Push dorthin deployt live. Der Branch `claude/shared-org-app-umbau` baut nur ein Image.
  - Live gehen: Merge in `claude/shared-org-app-IYZYF`, nur nach Ja von Alain. Danach Token in der App erzeugen (Profil, Jarvis-Zugang) und als `LIFE_APP_TOKEN` in der Jarvis-Umgebung hinterlegen.
  - Nach Livegang offen: `legacy_workspace_state` (Kopie der alten Daten inkl. Ambar und Zyklus) und Ambars Account löschen, nur nach ⚠️ und Ja.
  - 2026-10-21 Neues Design: drei Richtungen für den Heute-Screen als Entwurf (A Klar, B Nacht, C Zwei Welten), https://claude.ai/artifact/643oM9Ub2WrEQJQKs8c6wR. Alain wählt, dann Umsetzung im App-Code.
  - Nicht in Phase 1: Einkauf, Aktivitäten, Ziele hängen noch am alten JSON-Block (scope-Felder intern noch vorhanden, in der Oberfläche ausgeblendet). Kommt in Phase 3.
- [ ] Orga-App: Abschnitt pro Anlass für die Putz-/Vorbereitungs-To-do-Liste von Ambar (Protokoll 28.09.).

- [x] Telegram-Morgenbriefing: Bot @daellen_bot ("Jarvis"), Chat-ID Alain 732755112, Test ok (2026-10-08). Routine "Morgenroutine Alain" (`trig_01GD4CBsQy5mNftMr8VNbiE1`) von Alain im UI angelegt, Connectors dabei. Alte Tool-Routine gelöscht. Cron `30 6 * * *` ohne Zeitzone, also 06:30 UTC (08:30 Zürich im Sommer, 07:30 im Winter). So gewollt (Alain, 2026-10-08).

## Nächster Schritt

- Life-App: Alain prüft Phase 1 und gibt den Livegang frei. Danach Phase 2 (Telegram-Eingang, Morgenroutine füllt "Heute").

- 2026-10-21 Orga-App: öffentlicher iCal-Feed `/kalender/haus.ics` (src/app/kalender/haus.ics/route.ts), ab 60 Tagen zurück, privat anonymisiert. Live getestet.
- Spinnplan: nächste Änderung per Push auf main, Deploy über Netlify-Connector kontrollieren.
- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.
- [x] 2026-10-21 Orga-App: Neue Anlässe bekommen die Standard-Ressorts (Acts, Bar, Essen, Licht, Ton, Promo, Sicherheit, Finanzen), Migration 0029 ergänzt sie bei Anlässen ohne Ressorts. Anlassliste mit Jahres-Trenner. Commits 834b6c1 und 7e7e578, live seit 2026-10-21.
- Zugang: Jarvis darf das Repo `daellengarnier/spinnerei` selbst mit `add_repo` anhängen und pushen (Erlaubnis in `.claude/settings.json`, von Alain eingetragen 2026-10-21). Push auf main deployt live: vorher ⚠️ und Ja.

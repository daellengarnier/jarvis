# NOTES: privat-projekte

Welt: Privat  
Zuletzt aktualisiert: 2026-10-08

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Eigener VPS unter app.felsenau.org, SSH-Alias viapp, Apps je in /opt/<app>/ mit docker-compose.
- Apps u.a.: Spinnplan, Life-Org-App, Spinnerei-Budget-Tracker.
- Spinnerei Orga-App: spinnerei.al-daellen.ch, Repo daellengarnier/spinnerei (Next.js, Deploy per Push auf main über GitHub Actions).
- 3D/Photogrammetrie-Karte des Spinnerei-Areals.
- Motorrad.

### Belegt aus GitHub (2026-10-06)

- Spinnerei Orga-App: Repo `daellengarnier/spinnerei`, live auf https://spinnerei.al-daellen.ch. Next.js 16, Postgres, Drizzle, Docker. Auto-Deploy per GitHub Actions bei Push. Caddy im Stack `ambardaellen-app` auf demselben VPS.
  - Anlässe mit Zeiten, Preisen, Drive-Link, PETZI-Link, Acts, Ressorts, Todos, Sitzungen, Abrechnung.
  - Knopf "Publizieren": legt den Anlass als Entwurf auf kulturspinnerei.ch an (WordPress, The Events Calendar, REST mit Anwendungspasswort). Veröffentlicht wird von Hand in WordPress.
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
- [x] Spinnplan v1: Dauer pro Schichtart auch im Formular für normale Anlässe. Commit ef2dec8 live seit 2026-10-08 20:08 UTC (Netlify-Deploy `6ac7f82f05fa07000827006c`, ready).
- [ ] Orga-App: Abschnitt pro Anlass für die Putz-/Vorbereitungs-To-do-Liste von Ambar (Protokoll 28.09.).

- [ ] Telegram-Morgenbriefing: Bot @daellen_bot ("Jarvis") läuft, Token in der Umgebung, Chat-ID Alain 732755112, Testnachricht ok (2026-10-08). Routine `trig_019k9Cje8zAy3jH6nU3Z7MvL` (täglich 06:50 Zürich) angelegt, aber DEAKTIVIERT: per Tool erstellt hat sie weder Repo noch Connectors. Wartet auf Alain: `TELEGRAM_CHAT_ID=732755112` in der Umgebung setzen und die Routine im claude.ai-Routines-UI mit Repo daellengarnier/jarvis und Connectors Gmail, Google Calendar, Supabase anlegen (danach die deaktivierte löschen).

## Nächster Schritt

- Spinnplan: nächste Änderung per Push auf main, Deploy über Netlify-Connector kontrollieren.
- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

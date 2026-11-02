# NOTES: privat-projekte

Welt: Privat  
Zuletzt aktualisiert: 2026-10-28

## Aktueller Stand

### Spinnerei-Orga-App

- Repo: github.com/daellengarnier/spinnerei, live auf https://spinnerei.al-daellen.ch. Next.js 16, Postgres/Drizzle, Docker, Deploy per GitHub Actions bei Push auf main.
- Anlässe mit Ressorts, Todos, Acts, Finanzen/Abrechnung, Sitzungen, Einkauf, Inbox, PETZI-Webhook, Google-Login nur @kulturspinnerei.ch.
- Nicht verwechseln: spinnplan (alt, Supabase) und spinnplan-v2 (Rewrite Schichtplanung).

### Stand laut Alain, zu prüfen

- Eigener VPS unter app.felsenau.org, SSH-Alias viapp, Apps je in /opt/<app>/ mit docker-compose.
- Apps u.a.: Spinnplan, Life-Org-App, Spinnerei-Budget-Tracker.
- 3D/Photogrammetrie-Karte des Spinnerei-Areals.
- Motorrad.

## Offene Punkte

- [ ] Spinnerei-App, Sicherheit: /api/auth/unclaimed ist öffentlich und /api/auth/register übernimmt ein vorbereitetes Profil allein über den Namen, inkl. Admin-Rolle. Ohne gesetzten REGISTRATION_CODE kann so jede:r ein Admin-Profil übernehmen. Ob REGISTRATION_CODE auf dem VPS gesetzt ist: unbekannt.
- [x] Spinnerei-App: HQ-Cockpit und Desktop-Layout am 2026-10-28 auf main gemergt, Deploy-Run 76 grün.
- [ ] Spinnerei-App: Migration 0031 (sitzungen.protokoll) auf dem VPS nicht verifiziert. Jarvis erreicht die Live-Seite nicht (Proxy) und darf die Diagnose-Action nicht starten (403). Alain prüft: HQ öffnet ohne Fehler, Protokoll speichern geht.
- [x] Spinnerei-App: am 2026-10-28 auf main gemergt (Deploy-Run 77): hq-sitzungsbuch (eigenes HQ-Design, Sitzungsbuch mit Pendenzen als Todos, Import Sitzungen 06.05./28.09./26.10.2026 + nächste 27.11. 20:30 per Migration 0033) Quelle: Drive-Ordner «Sitzungen 2026». Datei «26_05_06» trägt im Kopf fälschlich 24.04.
- [x] Spinnerei-App: am 2026-10-28 gemergt (Deploy-Run 78): hq-sitzung-detail (Sitzung als eigene Seite nach Vorbild VIA-App: Protokoll pro Traktandum, Pendenzen im Traktandum, Leitung/Protokoll/Anwesende, Migrationen 0034/0035). Push auf main ist in .claude/settings.json erlaubt, Merge trotzdem nur nach Ja.
- [x] Spinnerei-App: belege-drive-sicherung am 2026-11-02 gemergt (Deploy-Run 80). Erste Sicherungen auf dem VPS: backups/spinnerei_20261102_180736.sql.gz und ..._180854_vor-deploy.sql.gz (je 11 MB). DB: 3 Abrechnungen, 2 Ausgaben mit Beleg.
- [ ] Spinnerei-App: Alain verbindet Drive (Admin › Belege & Sicherung, info@kulturspinnerei.ch) und legt bisherige Belege ab. Achtung: GitHub-Secrets GOOGLE_CLIENT_ID/SECRET und GOOGLE_API_KEY waren im Deploy leer; ob sie in der .env auf dem VPS stehen, ist unbekannt. Meldet die App «nicht eingerichtet», fehlen sie.
- [ ] Spinnerei-App: Sicherungen liegen nur auf dem VPS. Off-Site-Kopie (z. B. nächtlich ins Drive) offen.
- [ ] Spinnerei-App: CI baut und deployt ohne Lint/Typecheck vorher.

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

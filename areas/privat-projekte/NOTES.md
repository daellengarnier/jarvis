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
- [ ] Spinnerei-App: CI baut und deployt ohne Lint/Typecheck vorher.

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

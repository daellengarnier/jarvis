# NOTES: privat-projekte

Welt: Privat  
Zuletzt aktualisiert: 2026-10-06

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
- Spinnplan alt (`daellengarnier/spinnplan`): Supabase, noch aktiv bis Cutover.

## Offene Punkte

- [x] Netzzugang zu spinnerei.al-daellen.ch und kulturspinnerei.ch in der Cloud-Umgebung freigegeben (2026-10-06, getestet).
- [x] Jarvis-Account in der Orga-App: Zugangsdaten als Umgebungsvariablen `SPINNEREI_APP_EMAIL` und `SPINNEREI_APP_PASSWORD`, Login über die API (siehe CLAUDE.md). Normaler Benutzer, kein Admin. Von einer Session am 2026-10-06 bereits genutzt.
- [ ] Jarvis hat nur Lesezugriff auf das Repo `daellengarnier/spinnerei`, keinen Push.
- [ ] Orga-App: Abschnitt pro Anlass für die Putz-/Vorbereitungs-To-do-Liste von Ambar (Protokoll 28.09.).

## Nächster Schritt

- Push-Zugriff auf `daellengarnier/spinnerei` klären, falls Jarvis Code der Orga-App ändern soll.
- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

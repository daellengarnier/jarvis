# NOTES: privat-projekte

Welt: Privat  
Zuletzt aktualisiert: 2026-10-06

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Eigener VPS unter app.felsenau.org, SSH-Alias viapp, Apps je in /opt/<app>/ mit docker-compose.
- Apps u.a.: Spinnplan, Life-Org-App, Spinnerei-Budget-Tracker.
- 3D/Photogrammetrie-Karte des Spinnerei-Areals.
- Motorrad.

### Belegt aus GitHub (2026-10-06)

- Spinnerei Orga-App: Repo `daellengarnier/spinnerei`, live auf https://spinnerei.al-daellen.ch. Next.js 16, Postgres, Drizzle, Docker. Auto-Deploy per GitHub Actions bei Push. Caddy im Stack `ambardaellen-app` auf demselben VPS.
  - Anlässe mit Zeiten, Preisen, Drive-Link, PETZI-Link, Acts, Ressorts, Todos, Sitzungen, Abrechnung.
  - Knopf "Publizieren": legt den Anlass als Entwurf auf kulturspinnerei.ch an (WordPress, The Events Calendar, REST mit Anwendungspasswort). Veröffentlicht wird von Hand in WordPress.
  - PETZI-Webhook (`/api/petzi/webhook`) zählt Tickets.
  - Seed-Migration enthält die Anlässe Herbst 2026, aber ohne Soirée Tropicale 28.11.
- Spinnplan v2 (`daellengarnier/spinnplan-v2`): Schichtplan, Rewrite weg von Supabase/Netlify, Phase 1 von 3 (Stand README).
- Spinnplan alt (`daellengarnier/spinnplan`): Supabase, noch aktiv bis Cutover.

## Offene Punkte

- [ ] Jarvis hat keinen Netzzugang zu spinnerei.al-daellen.ch und kulturspinnerei.ch (Netzwerk-Policy der Cloud-Umgebung).
- [ ] Jarvis hat nur Lesezugriff auf `daellengarnier/spinnerei`, keinen Push.
- [ ] Kein Jarvis-Account in der Orga-App.

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

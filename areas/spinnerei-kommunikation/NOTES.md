# NOTES: spinnerei-kommunikation

Welt: Spinnerei  
Zuletzt aktualisiert: 2026-10-21

## Aktueller Stand

### Stand laut Alain, zu prüfen

- Alain macht die Event-Kommunikation.
- Kulturspinnerei: Spinnereiweg 17, 3004 Bern.
- Kapazität ca. 300 Personen.
- Ehrenamtlich geführt.
- Teil der Wohngenossenschaft Via Felsenau / Via 1.

### Aus den Sitzungsprotokollen 2026

- Werbekanäle der Crew: Quartier-Chat, Engehalbinsel-Chat, Rocket-Chat, Plakate am Eingang. Telegram-Kanal, auch auf der Website und als QR-Code bei Eingang, WC und Bar.
- Saisonplakat gestaltet Judith (Programm bis Mitte Juni fixiert). Plakatdruck: Nina.
- Website und PETZI pflegt Dällen.

## Offene Punkte

- [x] Anfrage Anna Benteli (anna.benteli@bluewin.ch, Kontaktformular 2026-10-19): Barrierefreiheit, Zugang mit Elektrorollstuhl. Antwort von Ambar gesendet aus info@ (2026-10-19): nicht barrierefrei, kein Lift, Unterstützung nach Absprache.  Quelle zum Lift weiterhin nur alter Webtext und Antwort an SAJV, Zugang vor Ort (Stufen, Eingang, WC) nie geprüft.
- [ ] Anfrage Vorspiel Kollektiv (vorspiel.kollektiv@gmail.com, Kontaktformular 2026-10-16): Queer Orgy / Workshop, Jan/Feb 2027, Sa oder So, 20+3 Personen, braucht volle Privatsphäre, Dusche, Pausenraum. Absage als Entwurf in info@ (2026-10-21): Privatsphäre nicht gewährleistet, weil Bewohnende durch den Veranstaltungsbereich zu Waschküchen und Kellern gehen. Senden nur nach Ja.
- [ ] Facebook-Events Herbst 2026: Texte vorbereitet in `facebook-events-herbst-2026.md` (2026-10-09). Anlegen macht Jarvis über Claude in Chrome in einer Session in der Claude-App am Computer (Entscheid 2026-10-09), Veröffentlichen nur nach Ja. Mothers Cake mit Sixteentimes Music als Co-Gastgeber (Kerstin zugesagt).

  Prompt zum Einfügen in der Claude-App: `facebook-events-prompt.md` (2026-10-12).
- [x] Website-Texte QUM und Soirée Tropicale korrigiert (2026-10-12): Einleitung über das neue Feld "Websitetext" der Orga-App, Soirée umbenannt. Reihenfolge der Soirée-DJs folgt den Set-Zeiten, die noch offen sind (jetzt alphabetisch, Mo zuerst).
- Facebook-Titelbilder gesammelt: Drive-Ordner "Facebook Titelbilder Herbst 2026" https://drive.google.com/drive/folders/1o8fsXO1HBjvxaN6SFtI74CC_ElNMN3sf (2026-10-12). Kinderdisco fehlt, QUM nur Print-PDF (Bilder evtl. im Flyer-ZIP), Kitchen-Foto und Fancy-Foto klein.
- [ ] Kanäle (Social Media, Newsletter) und Zugänge sind im Repo noch nicht erfasst.
- Website kulturspinnerei.ch: WordPress mit The Events Calendar (belegt aus Code der Orga-App). Events kommen als Entwurf aus der Orga-App, Veröffentlichen von Hand. "Website-Event aktualisieren" in der Orga-App (oder `POST /api/anlaesse/<id>/publish`) überschreibt die Beschreibung und geht bei veröffentlichten Events direkt live. Beschreibung = Websitetext des Anlasses + Promotexte der Acts.

- [ ] Mail ans Haus "Spinnerei: Anlässe bis Ende Jahr und Schichten" als Entwurf in info@ (2026-10-21): Anlässe 24.10. bis 12.12., keine Silvesterparty, Aufruf Schichten mit Link spinnplan-23.netlify.app. Empfänger offen (Hausverteiler nicht im Repo), Senden nur nach Ja. Soirée Tropicale mit Ende 01:30 (Orga-App), Mo schreibt 02:00. Kalenderabo-Buttons ergänzt. Offen: Vermietung 30.10. (Zusage Ambar, nirgends erfasst) und Freies Tanzen Lina 29.10. noch nicht drin.
- Kalenderabo Haus (alle Anlässe inkl. privater): https://spinnerei.al-daellen.ch/kalender/haus.ics, live seit 2026-10-21 (Commit 1c66bc3 in daellengarnier/spinnerei). Liest aus der Orga-App, Anlässe mit Zugang "privat" nur als "Private Veranstaltung". Hausmail-Buttons zeigen darauf. Privates immer mit Zugang "privat" erfassen.
- Google Kalender info@: alle Anlässe 24.10.2026 bis 20.03.2027 aus der Orga-App eingetragen (2026-10-21), mit PETZI-Link. Fehlen noch: Freies Tanzen Lina 29.10. (Zeit offen), Vermietung 30.10. (Angaben offen). Neue Anlässe künftig auch dort eintragen.
- Kalenderabo Website: iCal-Feed der Website (The Events Calendar) funktioniert, nur öffentliche Anlässe: https://kulturspinnerei.ch/?post_type=tribe_events&ical=1&eventDisplay=list (webcal:// für Apple/Outlook, Google über calendar.google.com/calendar/render?cid=<URL-kodiert>). Getestet 2026-10-21.

## Nächster Schritt

- Stand laut Alain mit ihm verifizieren und bestätigte Punkte aus "zu prüfen" lösen.

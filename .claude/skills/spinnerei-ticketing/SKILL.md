---
name: spinnerei-ticketing
description: 'Ticketing der Kulturspinnerei über PETZI: Events in PETZI anlegen und pflegen, Ticketpreise, Kontingente, Gästelisten, Vorverkaufszahlen, PETZI-Exporte auswerten, PETZI-Vertrag. PETZI hat keinen Connector, Arbeit über Browser oder abgelegte Exporte. Greift z.B. bei: "Wie viele Tickets sind für Freitag verkauft?", "Leg das Event in PETZI als Entwurf an", "Werte den PETZI-Export aus", "How many presale tickets do we have?", "Set up the guest list for the show". Nicht zuständig für: Booking der Acts (spinnerei-booking), Event-Promo (spinnerei-kommunikation), Verbuchung der Ticketeinnahmen und Budget (spinnerei-finanzen), Cleverclip. Veröffentlichen in PETZI nur nach Alains Ja.'
---

# spinnerei-ticketing

Welt: Spinnerei. Bereichsdaten: `areas/spinnerei-ticketing/`.

## Ablauf

1. Mit dem Skill `area-context` `areas/spinnerei-ticketing/NOTES.md` und `decisions.md` lesen.
2. Betrifft es einen Anlass: `events/<JJJJ-MM-TT-act>/EVENT.md` lesen. Nur den eigenen Abschnitt pflegen und den Verlauf ergänzen. Regeln: `events/README.md`.
3. Aufgabe erledigen. Hausregeln aus `CLAUDE.md` gelten (⚠️ vor Kritischem, keine Gedankenstriche).
4. Wenn sich etwas verändert hat: mit `area-context` NOTES.md und decisions.md zurückschreiben, committen, pushen.

## Konto

Spinnerei-Konto: info@kulturspinnerei.ch. Nie aus dem Gmail-Konto senden.

## Wissen

Noch keins. Dieser Skill wird über den Skill `training` schrittweise ergänzt. Längeres Wissen kommt in `references/*.md`.

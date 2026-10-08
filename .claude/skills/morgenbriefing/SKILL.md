---
name: morgenbriefing
description: 'Tägliches Morgenbriefing von Jarvis an Alain per Telegram: Termine, neue Mails an info@, Antworten in laufenden Booking-Fäden, Anlässe der nächsten 7 Tage mit offenen Punkten, offene Spinnplan-Schichten, Fristen aus den NOTES. Greift, wenn die Morgen-Routine feuert oder Alain sagt "Briefing", "Was steht heute an?", "Schick mir das Briefing", "Send the morning brief". Nicht zuständig für: die Arbeit an den Punkten selbst (Bereichs-Skills) und das Startmenü (start-menu).'
---

# morgenbriefing

Nur lesen und zusammenfassen. Im Briefing wird nichts gesendet, gelöscht, archiviert oder geändert, ausser der einen Telegram-Nachricht an Alain selbst.

## Daten sammeln

1. **Kalender:** Termine heute und morgen (Google Calendar, alle Kalender).
2. **Mail info@:** Vorher per `authuser` prüfen, dass es info@kulturspinnerei.ch ist. Neue Mails der letzten 24 Stunden ohne Werbung und Newsletter. Pro Mail: Absender, Thema, braucht es eine Antwort (ja/nein).
3. **Laufende Fäden:** Einträge "warten auf Antwort" in `areas/spinnerei-booking/NOTES.md`, wie im Skill `start-menu` geprüft (letzte Mail im Faden mit `get_thread`).
4. **Anlässe:** `events/*/EVENT.md` mit Datum in den nächsten 7 Tagen. Pro Anlass offene Todos, sofern welche drinstehen.
5. **Spinnplan:** Für dieselben Anlässe unbesetzte Schichten über den Supabase-Connector (Projekt `biyeggzutwajuueexcxl`, Tabellen `events` und `slots`), nur lesen.
6. **Fristen:** Offene Punkte mit Datum in den nächsten 7 Tagen aus allen `areas/*/NOTES.md`.

Fehlt ein Connector, die Quelle weglassen und am Ende eine Zeile dazu.

## Nachricht

Deutsch, knapp, keine Gedankenstriche. Leere Abschnitte weglassen. Höchstens etwa 25 Zeilen.

```
Guten Morgen Alain. <Wochentag, Datum>

Heute
<Uhrzeit> <Termin>

Mail info@ (<Anzahl neu>)
<Absender>: <Thema> [Antwort nötig]

Booking
<Act>: <was geantwortet wurde>

Nächste Anlässe
<Datum> <Act>: <offene Punkte oder offene Schichten>

Fristen
<Datum> <Punkt>
```

## Senden

Per Telegram Bot API (Bot @daellen_bot) mit den Umgebungsvariablen `TELEGRAM_BOT_TOKEN` und `TELEGRAM_CHAT_ID`. Fehlt `TELEGRAM_CHAT_ID`, Alains Chat-ID `732755112` nehmen. Token nie ausgeben, loggen oder ablegen.

```
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${TELEGRAM_CHAT_ID:-732755112}" \
  --data-urlencode "text@/pfad/zur/nachricht.txt"
```

Antwort prüfen (`"ok":true`). Bei Fehler einmal wiederholen, dann aufhören. Nichts committen, ausser es hat sich am Stand eines Bereichs wirklich etwas geändert.

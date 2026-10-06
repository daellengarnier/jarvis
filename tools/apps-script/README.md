# Apps Script: Mail-Anhänge nach Drive

Der Gmail-Connector kann Anhänge nicht herunterladen. Dieses Skript läuft im Konto info@kulturspinnerei.ch und kopiert alle 15 Minuten die Anhänge aus Threads mit dem Label `Jarvis-Anhaenge` in den Drive-Ordner "Eingang Anhänge". Jarvis holt sie dort über den Drive-Connector, sortiert sie in die Anlass-Ordner und lädt sie in die Orga-App.

## Was es tut und was nicht

- Kopiert nur Threads mit dem Label. Das Label setzt Jarvis bei Mails zu gebuchten Anlässen, oder Alain von Hand. Pitches und Rosters ohne Label bleiben unberührt.
- Liest Gmail nur. Löscht, verschiebt und sendet nichts.
- Überspringt eigene Mails von info@, Inline-Bilder und Bilder unter 15 KB (Signaturen).
- Läuft unter dem Konto info@, die Daten verlassen Google nicht. Der Ordner "Eingang Anhänge" ist privat, nicht teilen.

## Einrichten (einmalig, ca. 5 Minuten)

1. Als info@kulturspinnerei.ch einloggen, https://script.google.com öffnen, "Neues Projekt".
2. Projekt umbenennen in "Jarvis Anhänge nach Drive".
3. Inhalt von `anhaenge-nach-drive.gs` in `Code.gs` einfügen und speichern.
4. Oben die Funktion `einrichten` wählen, "Ausführen". Google fragt nach Berechtigungen für Gmail und Drive: zulassen. Das legt Label, Ordner und Trigger an.

## Abschalten

Im Skript-Projekt links "Trigger", den Trigger für `run` löschen. Oder das Projekt ganz löschen und unter https://myaccount.google.com/permissions den Zugriff entziehen.

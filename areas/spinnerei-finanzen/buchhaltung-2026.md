# Buchhaltung 2026 (VIVA VIA, bexio Mandant "Spinnerei")

Arbeitsstand, angefangen 2026-11-26.

## Regeln

- Jede Buchung vor dem Erfassen Alain zeigen (Datum, Soll, Haben, Betrag, Text). Unklares nicht raten, gesammelt fragen.
- Buchungsregeln aus dem Google Doc "Briefing Jahresabschluss & Steuern 2025 (VIVA VIA)" (Drive, 4 Finanzen/ Admin/2025/Jahresabschluss & Steuern 2025): RaiseNow/Twint = Umsatz (3200 bei Anlass, sonst 3202), Gagen nur in der Kasse, wenn wirklich bar bezahlt, Software-Abos auf 6570.
- Muster 2025 pro Anlass: 1001/3200 Bar-Bargeld, 1001/3201 Abendkasse bar, 5101/1001 Gagen bar, 4202/1001 Essen. SumUp-Auszahlungen 1000/3200, PETZI-Auszahlungen 1000/3201.

## Kontierung Bank (Stand 2026-11-26)

- Kaffeeabo: regelmässige Eingänge von Hausbewohner:innen (Mike Gutierrez, Cyrill, Mara, Jascha, Nicolas, Davina, Raphael, Julia) sind das Kaffeeabo (laut Alain). Vorschlag Konto 3202 Hauskiosk, Kaffee von Rast auf 4201.
- Bierkiosk Julio (Wenzinger) = Verkauf Harassen, 3202.
- RaiseNow wöchentlich: Woche mit Anlass 3200, sonst 3202 (Briefing-Regel).
- Bancomat-Bezüge in EUR 600 am 29.01., 03.03., 09.10. passen auf die Bar-Gagen The Macks (567), Lucy Kruger (564), TŌ YŌ (576).
- Bancomat-Gebühren (2, 2, 5) sind im Bezug enthalten und im Excel-Export nicht separat: auf 6940 buchen.
- Vorschlagsliste mit Status pro Zahlung: Bankabgleich_2026_Vorschlag.xlsx (an Alain gesendet 2026-11-26, nicht im Repo).

## Differenz Bank 2025

- BEKB laut camt.053 per 31.12.2025: 6'200.17. bexio Eröffnung 2026: 6'523.27. Differenz 323.10.
- Ursache: Am 14.04.2025 belastete die Bank 646.20 (zwei Zahlungen à 323.10), in bexio ist nur eine gebucht. Feed-Transaktion 449 (323.10) blieb offen. 2025 ist abgeschlossen und deklariert, Korrektur in 2026 nötig (Gegenkonto mit Alain klären).

## Stand bexio (2026-11-26)

- Geschäftsjahr 2026 offen, 2025 abgeschlossen. Eröffnung: Bank 6'523.27, Kasse 6'633.85, Mobiliar 1'312.50, Kapital 4'957.38, Gewinn 2025 9'512.24 (noch auf 2891).
- Bank-Feed BEKB: Lücke 01.01. bis 16.10.2026. Ab Okt. 108 offene Transaktionen, ab ca. 01.11. doppelt bis sechsfach importiert. Feed zeigt keine Gegenpartei, nur "Zahlungseingang" usw.
- Keine Kreditoren, keine Spesen in bexio. Rechnungsentwürfe RE-00026 Jugendsession 2'240 (Zahlung 2'240 am 24.11. auf der Bank) und RE-00027 Raummiete 150.

## Quellen

- Abrechnungen Jan bis Mai: Drive "Programm 2026" (xlsx je Anlass).
- Abrechnungen Okt bis Nov: Orga-App, `GET /api/anlaesse/<id>/abrechnung`.
- Belege: Drive `4 Finanzen/ Admin/2026/`.

## Bargeld je Anlass (Gewinn Kasse = Endstock minus Anfangsstock)

| Datum | Anlass | Bar | Abendkasse | Gagen laut Abrechnung | Quelle |
|---|---|---|---|---|---|
| 24.01. | Charity Jamaica | 1'442.00 | 1'058.00 | Charity 2'667 (70 %) | Drive |
| 29.01. | The Macks | 88.00 | 140.00 | 567 + Sebi 150 | Drive |
| 21.02. | Nemoralis | 1'330.40 | 663.00 | 1'530 (Ethereal Decibel, Rechnungen) | Drive |
| 03.03. | Lucy Kruger | 130.00 | 25.00 | 564 | Drive |
| 21.03. | Rauschen | 2'116.70 | 1'031.00 | 559 + Auszahlung Thalhammer 1'242? | Drive |
| 25.04. | Soirée Tropical | fehlt | 517.00 | 4 DJs 800 | Drive |
| 02.05. | Bass Weight | 1'174.00 | 905.00 | 900, Spesen 817 | Drive |
| 09.10. | TŌ YŌ / Natalí | 307.40 | 260.00 | 600 + 450 + Ton 150 | Orga-App |
| 24.10. | Kinderdisco | 389.00 | 350.00 | DJ Tino 200 | Orga-App |
| 31.10. | QUM Daydance | 1'445.40 | 520.60 | 4 DJs 1'000, Brünu 100, Grafik 250 | Orga-App |
| 06.11. | Jugendsession | 362.00 | | Miete 2'200 | Orga-App |
| 07.11. | Kitchen | 200.00 | 265.00 | Ton Sebu 200 | Orga-App |
| 14.11. | Artlu Bubble | 790.00 | 690.00 | 2'150 | Orga-App |

Ohne Abrechnung: Silvester 31.12.2025, Los Palms 23.05., Hausfest 05.09., Pluto 30.10.

## Gebucht in bexio (2026-11-26, nach Freigabe Alain)

- M26-001 Gewinnverwendung 2025: 2891 an 2800, 9'512.24 (GV-Übertrag laut Alain).
- B26-<Nr>: 256 Bankbewegungen (Nr = Zeile im BEKB-Export, chronologisch), plus Bancomat-Gebühren B26-071.5, 072.5, 274.5. Belegnummer und Drive-Dateiname stehen im Buchungstext.
- K26-001 bis 044: Kasse je Anlass (Bar und Abendkasse bar auf 3200/3201, Bar-Gagen und Barauslagen aus der Hauptkasse). Kassenstand danach 6'536.13.
- Entscheide Alain 2026-11-26: Gagen aus der Hauptkasse. Charity Jamaica: Zappa-Blatt mit weniger Tickets gilt, 2'667 als Spende (auf 6559, weil Konten per API nicht angelegt werden können; eigenes Konto "Spenden" in bexio anlegen und umbuchen, falls gewünscht). Rauschen 1'242 an Thalhammer aufgeteilt: 5101 500, 5102 59, 661 200, 4400 483. QUM Flyer 229.17 und Coop 82.10 bar an Dällen ausbezahlt. Los Palms 23.05. abgesagt. Silvester noch nicht abgerechnet.
- Saldo 1000 in bexio nach diesen Buchungen 29'936.33. Ziel 15'075.15 = offene Zeilen (83, netto -14'538.08) plus Korrektur 323.10 aus 2025.

## Noch offen

- 83 Bankzeilen mit Status Vorschlag/Frage in Bankabgleich_2026_Vorschlag.xlsx (Supermärkte, Baumärkte, Galaxus, LED, Thomann, SWISS-Flüge 1'207.80 = Rückzahlung Yves 1'207.80, Yves Beamer & Pneu, Taktvoll, Ethereal 25.03., Natalie 100, diverse Kleinbeträge).
- Korrektur 323.10 (Zahlung 14.04.2025).
- Hausfest 05.09.: Kassen und Ausgaben stehen in der Hausfest-App hausfest.al-daellen.ch (Repo daellengarnier/hausfest26, API /api/abrechnung, /api/expenses). Host am 2026-11-26 in der Umgebung freigegeben, aber die Zugangsdaten der Orga-App und des Spinnplans funktionieren dort nicht.
- Soirée 25.04.: Bar-Stöcke fehlen. Silvester: Abrechnung fehlt (PETZI 4'497.75 am 05.01. und SumUp 1'451.06 am 06.01. sind schon als Ertrag gebucht).
- Feed-Zeilen in bexio (Okt./Nov., teils mehrfach) bleiben offen und können ignoriert werden.

## Bank-Import

- BEKB-Export erhalten 2026-11-26 (xlsx bis 26.11., camt.053 2024 bis 25.11.). Saldo stimmt: 6'200.17 + Bewegungen = 15'075.15.
- Offene Fragen an Alain: siehe Session 2026-11-26.

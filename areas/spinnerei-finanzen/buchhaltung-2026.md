# Buchhaltung 2026 (VIVA VIA, bexio Mandant "Spinnerei")

Arbeitsstand, angefangen 2026-11-26. Noch nichts in bexio gebucht ausser der Eröffnungsbilanz.

## Regeln

- Jede Buchung vor dem Erfassen Alain zeigen (Datum, Soll, Haben, Betrag, Text). Unklares nicht raten, gesammelt fragen.
- Buchungsregeln aus dem Google Doc "Briefing Jahresabschluss & Steuern 2025 (VIVA VIA)" (Drive, 4 Finanzen/ Admin/2025/Jahresabschluss & Steuern 2025): RaiseNow/Twint = Umsatz (3200 bei Anlass, sonst 3202), Gagen nur in der Kasse, wenn wirklich bar bezahlt, Software-Abos auf 6570.
- Muster 2025 pro Anlass: 1001/3200 Bar-Bargeld, 1001/3201 Abendkasse bar, 5101/1001 Gagen bar, 4202/1001 Essen. SumUp-Auszahlungen 1000/3200, PETZI-Auszahlungen 1000/3201.

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

## Blockiert

- BEKB-Export 01.01.2026 bis heute (camt.053 oder CSV mit Gegenpartei) fehlt.
- Offene Fragen an Alain: siehe Session 2026-11-26.

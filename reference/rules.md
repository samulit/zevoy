# Finnish rules worth knowing (for checking, not for computing)

Zevoy computes per diem and mileage from the Verohallinto decision for the
year and shows the rates in its own labels (`Finland (54.00 EUR)`,
`Passenger car 0.55 EUR / km`). Use the numbers below only to sanity-check
Zevoy's result. They are the 2026 values; rates change every January.

## VAT on receipts

The VAT on a row must match the receipt, not Zevoy's guess or the
category's default.

| Purchase | VAT in 2026 |
|---|---|
| Most goods and services, software from Finnish sellers, parking | 25.5 % |
| Taxi, bus, train, domestic flights, hotel room, restaurant food | 13.5 % (14 % until 31 Dec 2025) |
| Alcohol in a restaurant | 25.5 % |
| Newspapers and magazines | 10 % |
| Taxi and ride-hailing tips | 0 % |
| Foreign B2B software or services invoiced with reverse charge | 0 % |

- **Flights:** the e-ticket shows "VAT 13.5% INCLUDED (EUR x) / Taxable
  value". If the whole ticket at 13.5 % gives the same euro VAT, one row at
  13.5 % is right; otherwise add a VAT row.
- **Hotel folios** often mix rates (room 13.5 %, minibar or parking
  25.5 %). Use + Add VAT row and the folio's own breakdown.
- **Foreign seller charging Finnish VAT** (Paddle, Stripe-billed SaaS that
  charges "VAT - Finland 25.5 %"): this needs a decision, so look for a
  precedent in `precedents.md` first. Without one, ask the user once and record
  the answer there with the date. The two options: book the VAT as the receipt shows it
  (the receipt-matching rule), or book 0 % and note the charged VAT, because
  VAT a foreign seller collects under its OSS scheme is not normally
  deductible for a business buyer. Some organisations also have no software
  category with Finnish VAT, so a 25.5 % row ends up on an "EU 0 %"
  category. Either way, say in the description what the receipt charged,
  and suggest adding the company's VAT number to the vendor account so
  later invoices come with reverse charge.
- **Microsoft 365 from Microsoft Oy** is Finnish VAT 25.5 %, not reverse
  charge.

## Per diem (päiväraha), domestic

- Trip of more than 6 h, destination more than 15 km from home and from the
  usual workplace: osapäiväraha (2026: €25). More than 10 h: kokopäiväraha
  (2026: €54).
- Multi-day trips count in 24-hour periods from departure. The last
  incomplete period pays osapäiväraha if it runs more than 2 h past the last
  full period, kokopäiväraha if more than 6 h.
- **Free meals:** a kokopäiväraha is halved only by **two** free meals; an
  osapäiväraha is halved by **one**. Hotel breakfast included in the room
  rate is normally not a free meal. Zevoy applies this correctly when the
  meal toggles are set.
- Zevoy's own published per diem guide has stated the meal rule wrongly
  (one meal halves, two remove it). Don't cite it; cite Verohallinto or
  Veronmaksajat.
- Foreign trips use the rate of the country where each 24-hour period
  ends (on the way home, the last foreign country). Enter every country as
  a leg with its border-crossing time and let Zevoy decide.

## Mileage (kilometrikorvaus)

- 2026: passenger car €0.55/km, +€0.04/km per passenger; limited car
  benefit €0.11/km. Zevoy's mode-of-transport labels carry the current
  rates.
- Only for the user's own car on a business trip, never for a leg that was
  a taxi or a company car.

## Sources

- Verohallinnon päätös verovapaista matkakustannusten korvauksista vuonna
  2026: https://www.vero.fi/syventavat-vero-ohjeet/paatokset/47405/
- Arvonlisäveroprosentit:
  https://www.vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/arvonlisaveroprosentit/
- Veronmaksajat, päivärahat:
  https://www.veronmaksajat.fi/neuvot/henkiloverotus/tyo-elake-ja-etuudet/paivarahat-ja-kilometrikorvaukset/paivarahat/

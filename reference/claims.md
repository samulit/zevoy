# Claims: per diem, mileage, expense claim

All three start at `.../my-zevoy/claims/all` → **Create new** (top right) →
pick the type. The menu also has *Bundle*. Picking a type **creates a pending
draft at once** ("Incomplete ... claim" in the Pending list), so finish it or
discard it (open it → Discard → Confirm).

Zevoy computes every amount. Do not type euros into a per diem or mileage
claim, and do not "correct" Zevoy's total; if it looks wrong, recheck the
inputs (times, meals, legs, mode of transport) and tell the user.

Per diem and mileage claims stay **pending**. The user reviews and submits
them.

## Per diem (päiväraha)

Form: Description · Trip start date · Destination · "Visited another
country?" + Add leg · Trip end date · Meals Provided (Lunch / Dinner toggle
per calendar day) · Class · tag fields · Summary.

1. **Trip window is home to home.** Prefer real evidence: the taxi pickup at
   home and drop-off at home (Uber receipts show both), or the user's own
   statement. Without evidence, use the profile's fallback (for example
   flight departure − 2 h and landing + 1 h). Flight times come from the
   e-ticket, never from the booking date.
2. **Date picker:** click the field; click the day; triple-click the hour box
   and type `06`; triple-click the minute box and type `30`; click **Close**.
   For the end date the hour and minute boxes can sit under the sticky Save
   bar: scroll the panel two ticks first.
3. **Destination** is a country with its rate in the label, e.g.
   `Finland (54.00 EUR)`. Type `Finland`, then click the option. A foreign
   trip with several countries needs **Add leg** per country with the border
   crossing times.
4. **Meals:** the toggle rows appear only after both dates are set, one row
   per calendar day. Switch on each free meal on the day it was eaten
   (event lunches and dinners, meals included in a ticket); Zevoy maps them
   onto the 24-hour periods itself.
   Hotel breakfast included in the room rate is normally not counted. Find
   free meals in the calendar and the event agenda; ask the user about
   anything uncertain, such as an evening party.
5. Description: where, why, home-to-home times with their source, and the
   free meals, e.g. *"Tampere 10.–12.3.2026: asiakastapaamiset ja
   seminaari. Koti–koti: taksi kotoa 10.3. klo 6.10, kotona 12.3. klo 13.40
   (taksikuitit). Ilmaiset ateriat: 10.3. lounas + illallinen, 11.3. lounas."*
6. Tags as the profile says. Read the Summary (per-day lines, "Meal
   deductions", total) back to the user. Save once; leave pending.

Worked example (2026 rates): out 10.3. 06:10, home 12.3. 13:40, free lunch
and dinner 10.3., free lunch 11.3. Zevoy shows three full days (the last
period runs 7 h 30 min) = 162.00, meal deductions −27.00 (two meals halve
the first day; one meal does not touch a full day), total 135.00. Add a
free dinner on 11.3. and the second day halves too: 108.00.

## Mileage (kilometrikorvaus)

Form: Description · Travel date · From · To · + Add waypoint · Distance (km)
· + Add passenger · Mode of transport · Class · tag fields.

- Offer mileage **only when the user drove**. Check taxi receipts first; an
  airport leg by Uber means no mileage for that leg.
- From and To are Google Places search. Type the street address and **pick
  the suggestion with the right town** (the same street exists in several
  towns). Distance then fills in from the route; check it against the
  profile's known distances.
- One claim per leg is the user's existing pattern if the profile says so
  (e.g. home → airport and airport → home on their own dates).
- **Mode of transport** sets the rate, e.g. `Passenger car 0.55 EUR / km`
  (the label shows the current year's tax-free rate). The amount stays
  0.00 until it is chosen.
- Passengers raise the rate; add them only when the user says so.

## Expense claim (own money)

For a business purchase paid with a private card or cash. Form: Add receipt
(file input) · Merchant · Purchase date · Purchase amount · Currency ·
Expense 1 (Split, Category, VAT %, + Add VAT row, Class, tags, Description).

- Attach the receipt first, then wait for OCR and re-read every field it
  filled.
- The amount and currency must match the receipt; VAT as on the receipt.
- Use **Split** or **+ Add VAT row** when one receipt mixes VAT rates (a
  hotel folio with room 13.5 % and minibar 25.5 %, a restaurant bill with
  food 14 % and alcohol 25.5 %).
- Expense claims are reimbursed to the user, so submit only when told.

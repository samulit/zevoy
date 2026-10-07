# Zevoy UI mechanics

Base URL `https://hub.production.zevoy.com/organization/<org-id>/my-zevoy/`.
Organisation ids are in the data folder's `profile.md`; the switcher is the organisation name
at the top right.

| Page | Path |
|---|---|
| Card expenses waiting | `transactions/pending` |
| Submitted, all | `transactions/submitted`, `transactions/all` |
| One expense, view / edit | `transactions/pending/transaction/<id>` / `.../edit` |
| Claims | `claims/all`, `claims/pending` |
| One claim | `claims/pending/travel/<claimID>` (per diem, mileage), `.../expense/<claimID>` |

## Expenses page

- **Unmatched receipts** sit as thumbnails above the list. They carry no
  metadata. Click one: the receipt opens on the left (`get_page_text`
  reads email receipts in full) and **Select an expense** opens on the
  right with Pending / All filters and a search box. Clicking a row there
  matches the receipt immediately (no confirm step) and opens that expense.
  The extension may drop the connection during that jump; call
  `tabs_context_mcp` and carry on.
- The list's date is the clearing/booking date. The detail panel shows
  "Booking date" and "Purchase date".
- The detail panel opens in **view mode** with **Edit** and **Submit** at
  the bottom right; claims add **Discard**. Edit turns them into Cancel and
  Save, with Save in Submit's spot.
- After Save, a toast says "Success! Expense details successfully updated."
  (claims: "Claim successfully updated."). Read it with
  `document.body.innerText.match(/Success!?[^\n]*\n[^\n]*/)`.

## Edit form

Fields, top to bottom: receipt tiles and **Add receipt** (a hidden
`input[type=file]`; find it with `find` "file input for adding a receipt"
and use `file_upload`, never click it), **Expense 1** with **Split**,
Category, VAT %, + Add VAT row, then the organisation's tag fields (for
example Class, Country, Team), then Description.

The panel scrolls separately from the page. Scroll it 5 ticks at a point
inside the panel to bring the tag fields and Description into view.
Positions change with the browser window size; take one screenshot per form
before clicking by coordinates.

Read-back helper (inject after each navigation, then call `zstate()`):

```js
window.zfield = (label) => {
  const L = label.toUpperCase();
  for (const inp of document.querySelectorAll('input[role=combobox]')) {
    let n = inp;
    for (let k = 0; k < 8 && n; k++) {
      n = n.parentElement;
      const t = (n && n.innerText || '').trim().toUpperCase();
      if (t.startsWith(L)) return {inp, box: n};
      if (t.length > 200) break;
    }
  }
  return null;
};
window.zstate = (labels = ['Category', 'VAT %', 'Class', 'Country', 'Team']) =>  // use the profile's tag labels
  JSON.stringify(labels.map(l => { const f = zfield(l);
    return f ? f.box.innerText.replace(/\s+/g, ' ').trim() : 'missing ' + l; })
    .concat([(document.querySelector('textarea') || {}).value]));
zstate()
```

A field that shows a value on screen but reads back as just its label
(e.g. `COUNTRY`) has text typed into its search box without a
selection. Click it, pick the option, and read back again.

## Dropdowns

react-select. Real clicks and keys only: synthetic `input`, `keydown` and
`mousedown` events from JavaScript do not open the menu. Recipe: click,
wait 1 s, type the option text, wait 1 s, Enter, wait 1 s, click a neutral
label, wait 1 s. Enter picks the highlighted (first filtered) option, so
type enough text to make the right option first; clicking the option in
the open menu works too. Never press Tab while a menu is open, and never
press Escape in a form.

VAT % offers 0, 10, 13.5, 14 and 25.5 %. Destination options carry the rate
(`Finland (54.00 EUR)`); mode-of-transport options carry the per-km rate.

## Date and time pickers (claims)

Click the field: a month calendar opens with hour and minute boxes, a
timezone select and **Close**. Click the day, triple-click the hour box and
type two digits, the same for minutes, then Close. The end-date picker's
time boxes can be hidden under the sticky Save bar; scroll the panel first.
Leave the timezone select on the local offset it shows (GMT+3 in Finnish
summer time, GMT+2 in winter) unless a leg starts abroad.

## Address search (mileage)

Google Places autocomplete. Type the street and number, wait 2 s, and click
the suggestion with the right town. The distance fills in from the route.

## Submitting

Not mapped yet: no run has submitted anything. Each row's view mode has a
Submit button, and the lists have "Select visible" checkboxes for bulk
actions. The first time the user asks you to submit, take a screenshot at
each step, note any confirmation dialog, and add the steps here.

## Discarding

- Cancel on a changed form opens "Unsaved changes · Confirm to discard
  changes" (Cancel / Discard). This drops the edits, not the record.
- A claim draft stays in Pending as "Incomplete ... claim" even after
  Cancel. Open it → Discard → "Discard travel claims" / "Discard expense
  claims" → Confirm.

## Reading state without the UI

The page exposes its Apollo client as `window.__APOLLO_CLIENT__`.
`scripts/state.js` reads the queries the page has already run
(`getCardholderReviewItems`, `getCardholderTravelClaimItems`,
`getCardholderUnmatchedReceipts`) and returns a compact summary. It never
fetches anything itself and never touches tokens; do not read
`localStorage` tokens or call the API directly.

## Claude in Chrome quirks seen with Zevoy

- javascript_tool output is cut at roughly 1,000 characters. Return compact
  JSON arrays and slice long text.
- Output that looks like a query string (`a=1|b=2`) can be blocked. Return
  JSON.
- "Couldn't determine which page this action targets" or "extension is not
  connected": call `tabs_context_mcp` and retry once.
- Clicking by a `find` ref can scroll the page sideways; prefer coordinates
  from a fresh screenshot for the big orange buttons.

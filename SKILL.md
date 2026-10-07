---
name: zevoy
description: Use when filing, fixing or checking anything in Zevoy (hub.production.zevoy.com) - card expenses that need receipts, VAT, categories or tags, expense claims for out-of-pocket purchases, per diem (päiväraha) or mileage (kilometrikorvaus) claims, matkalasku, or matching receipts from email, Downloads or Gmail. Also use when someone says receipts or kuitit are waiting.
---

# Zevoy

Zevoy is a Finnish spend-management app. The user's company cards post
transactions to it, and the user adds receipts, VAT, tags and descriptions,
then submits. Claims (per diem, mileage, out-of-pocket expenses) are made
there too. **Zevoy does the arithmetic:** you enter facts (receipt, times,
meals, route, transport mode) and Zevoy computes the euros. Your job is to
find the facts and get them through a confusing UI without breaking anything.

You work in the user's own logged-in Chrome through Claude in Chrome. The
user signs in to Zevoy themselves (bank ID). Never touch authentication.

## Before anything else: open the user's data folder

The skill is public; everything about the user lives in a private data
folder. Use the first of these that exists:

1. the folder in the `ZEVOY_DATA` environment variable;
2. `~/.config/zevoy/`;
3. `data/` next to this file (the Claude app, where the skill is uploaded
   together with the user's data).

It holds three files. Read `profile.md` (organisations and ids, required
tags and defaults, receipt inbox and forwarding rules, receipt sources,
cards, home and distances, standing rules) and `precedents.md` (settled
category, VAT and class decisions per vendor or case) before touching
anything, and the latest entry of `log.md` (what the previous run left
open).

**If none exists, initialise it:** create `~/.config/zevoy/` (or `data/`
when there is no home folder), copy the three files from `templates/`, and
fill `profile.md` with the user. Read what you can from Zevoy itself
(organisation ids from the switcher and URLs, tag names and values from an
already exported row, card names from transactions) and ask only for the
rest.

### Where new knowledge goes

- **About the user** (ids, names, cards, addresses, mailboxes, forwarding
  limits, who approves what, how a vendor is booked): the data folder.
  Settled bookings go into `precedents.md` with the date; everything else
  into `profile.md`. Never write these into the skill's files.
- **About Zevoy or Finnish rules** (a UI behaviour, a trap, a rule that
  holds for every user): the skill's own files (`SKILL.md`, `reference/`,
  `scripts/`), worded without the user's details.
- At the end of every run, add an entry to `log.md`: what was filed, what
  is pending for the user, what is still missing.

## Hard rules

- **Filing means saving, not submitting.** Submit only when the user says
  "submit" for that batch, and never submit a row you flagged or one with an
  open question. Per diem and mileage claims stay pending for the user
  unless they explicitly ask you to submit that claim.
- **Never press Escape** in a form (it opens a Discard-changes modal) and
  **never press Tab while a dropdown is open** (Tab selects the highlighted
  option, usually the first one).
- **Click Save once.** After Save the panel switches to view mode and
  **Submit appears exactly where Save was.** Confirm success from the toast
  text, not by clicking again. If the toast is gone, reload and re-probe.
- **Create new → any claim type creates a pending draft immediately.** If
  you abandon it, open it and Discard → Confirm. Your draft is the
  "Incomplete ... claim" with today's date whose id was not in your first
  probe; never discard one the user already had.
- Don't delete receipts from the unmatched pool without asking.
- Use the personal **My Zevoy** views (`/my-zevoy/...`), not the admin
  `/review/` views, which show almost nothing.

## Workflow

1. **Survey every organisation in the profile.** Open
   `.../my-zevoy/transactions/pending`, wait 3 s, and run
   `scripts/state.js` with javascript_tool, prefixed with
   `window.ZEVOY_REQUIRED_TAGS = [...]` from the profile. It reads the app's
   own cache and returns each pending row with what it still lacks
   (receipt, description, required tags) and the pool size; rows come 10
   per page (`window.ZEVOY_PAGE`). Repeat on `.../my-zevoy/claims/pending`
   for claims. Edits show up only after a reload.
2. **Gather facts before touching forms.** Trips come from the calendar and
   the airline e-ticket (search Gmail by booking reference with
   `in:anywhere`). Taxi receipts give real home-departure and home-arrival
   times. Then Downloads, then Gmail (see profile for addresses).
3. **Match receipts from the pool first.** Click a thumbnail: email receipts
   open as HTML, so `get_page_text` reads the whole receipt (amounts, card,
   route). Clicking a row in the "Select an expense" list matches it at once
   and opens that row. If the receipt is not in the pool, upload it to the
   row's file input with `file_upload` (Claude Code takes the local path;
   claude.ai and Cowork need `device_stage_files` first and then the
   `/mnt/user-data/uploads/...` path). Forward an email to the user's Zevoy
   receipt inbox only when the profile allows it for that sender: shared
   mailboxes mix business and personal bookings.
4. **Fill each row** at `.../transactions/pending/transaction/<id>/edit`
   (ids come from the probe). Use the field recipe below, read the fields
   back, Save once, confirm the toast.
5. **Make claims** (per diem, mileage, expense claim) as described in
   `reference/claims.md`.
6. **Probe again, log and report**: add the run to `log.md`, then give the
   user a short table of what is ready, what still lacks a document, and the
   questions only they can answer. Stop there.

## Field recipe (react-select dropdowns)

Synthetic JavaScript events do not open these menus; use real clicks and keys.

1. Click the field, wait 1 s.
2. Type the option text exactly as it appears (`Finland`, `10 Sales`,
   `Taxi fees (FI`), wait 1 s.
3. Press Enter, wait 1 s.
4. Click a neutral label, wait 1 s: the "Expense 1" heading on expense
   forms, the "Meals Provided" heading or the amount at the top on claim
   forms. Without this pause the next click is swallowed.
5. After all fields, read them back with the helper in `reference/ui.md`
   and redo any that did not stick.

Type descriptions into the textarea directly. Pages lose injected helpers on
every navigation, so re-inject them.

## Traps that cost money or time

| Trap | What to do |
|---|---|
| Changing **Category does not change VAT %** | Always set VAT from the receipt as its own step. |
| AI category has a confidence %; it booked a Finnish taxi at 0 % | Check every row below ~80 %, and every taxi row. |
| OCR rewrites VAT after a receipt upload | Re-read the row after every upload. |
| Edit form shows Category "Select..." for a second or two | Wait before reading; it loads late. |
| List shows the **clearing** date, not the purchase date | Open the row for "Purchase date". Match receipts on amount ± 1 day. |
| Uber Reserve is charged at **booking** time | The receipt's trip details give the real ride time. |
| Uber tip is a separate small card row | Its "Thanks for tipping" receipt shows ride + tip; match it to the small row, category "Taxi fees (0%)", VAT 0 %. The ride row keeps its own receipt. |
| A row that already has a receipt may still have a copy in the pool | Leave the copy; mention it. |
| Zevoy's `readyToSubmit` is empty even with no receipt or description | Trust the probe's `missing`, not Zevoy, once `ZEVOY_REQUIRED_TAGS` is set; without it the probe cannot see missing tags. |
| Match list shows the original currency (`-200.00 USD`) | Compare foreign rows on that amount. |
| A €0.00 "UBER *PENDING" row | Card verification hold. Never submit it; it disappears. |
| A private purchase paid by mistake with a company card | Keep the row: pick the organisation's personal-expense category (often "Personal expenses, deducted from paycheck"), VAT 0 %, and say in the description that it is private and to be deducted from pay. |

Finnish VAT, per diem and mileage rules, and the categories problem when a
foreign seller charges Finnish VAT, are in `reference/rules.md`. Screen-by-
screen mechanics (date pickers, address search, Discard, helpers) are in
`reference/ui.md`.

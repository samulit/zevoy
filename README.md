# zevoy

A Claude skill for [Zevoy](https://www.zevoy.com), the Finnish
spend-management app. It files card expenses (receipts, VAT, categories,
tags, descriptions) and makes per diem (päiväraha), mileage
(kilometrikorvaus) and expense claims in your own logged-in browser.
Zevoy does all the arithmetic; the skill finds the facts (receipts, flight
times, taxi pickups, free meals) and gets them through Zevoy's UI, whose
traps it documents: dropdowns that pick the wrong option on Tab, VAT that
does not follow the category, Save turning into Submit in the same spot,
claim drafts that exist before you save them, and more.

It never submits anything unless you say so, and per diem and mileage
claims always stay pending for you to review.

## Requirements

- Claude Code (or the Claude app) with
  [Claude in Chrome](https://claude.ai/chrome), and you logged in to Zevoy
  in Chrome.
- Optional but useful: the Gmail and Google Calendar connectors, for
  receipts, e-tickets and trip details.

## Install

```bash
git clone https://github.com/samulit/zevoy ~/.claude/skills/zevoy
```

In a new session, say "file my Zevoy receipts" or run `/zevoy`. Update
later with `git -C ~/.claude/skills/zevoy pull`.

## Your data stays yours

The skill holds only what is true for every Zevoy user. Everything about
you lives in a private data folder that the skill creates on its first run
from `templates/`:

| File | Holds |
|---|---|
| `profile.md` | organisations and ids, required tags and defaults, receipt inbox and what may be forwarded, where your receipts are, cards, home and distances, who submits what |
| `precedents.md` | how each vendor or case is booked once you (or your accountant) have decided |
| `log.md` | one entry per run: filed, pending, still missing |

The folder is `$ZEVOY_DATA` if set, otherwise `~/.config/zevoy/`. On the
first run Claude reads what it can from Zevoy (organisation ids, tag
values, card names) and asks you for the rest. New facts about you go into
the folder; new facts about Zevoy go into the skill.

For the Claude app, which has no home folder, put your three files in a
`data/` folder inside the skill, zip it, and upload it under Settings →
Capabilities → Skills. `data/` is gitignored.

## What a run does

1. Reads your data folder, then checks every organisation's pending
   expenses and claims with `scripts/state.js`, which reads what the Zevoy
   page has already loaded and reports what each row still lacks.
2. Collects facts: calendar trips, e-tickets, taxi receipts, hotel folios,
   Downloads and Gmail.
3. Matches receipts from Zevoy's unmatched pool, or uploads them.
4. Fills category, VAT (from the receipt), tags and a description on each
   row, reads the fields back, and saves.
5. Makes per diem and mileage claims from home-to-home times, meals and
   routes, and leaves them pending.
6. Logs the run and reports what is done, what still needs a document, and
   what only you can answer.

## Files

- `SKILL.md`: the workflow, hard rules and the worst traps
- `reference/ui.md`: screen-by-screen mechanics and helpers
- `reference/claims.md`: per diem, mileage and expense claims
- `reference/rules.md`: Finnish VAT, per diem and mileage rules for checking
  Zevoy's numbers
- `scripts/state.js`: read-only state probe
- `templates/`: starting versions of the three private data files

## License

MIT

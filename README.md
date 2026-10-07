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
claims always stay pending for you to review. It never logs in for you:
you sign in to Zevoy yourself with your bank ID.

## What you need

- [Claude in Chrome](https://claude.ai/chrome), the browser extension,
  connected to the same Claude account. Claude works in your own Chrome,
  where you are logged in to Zevoy.
- Optional but useful: the Gmail and Google Calendar connectors, for
  receipts, e-tickets and trip details.

## Use it in Claude Code

1. Install:

   ```bash
   git clone https://github.com/samulit/zevoy ~/.claude/skills/zevoy
   ```

2. Start a new session anywhere and say "file my Zevoy receipts", or run
   `/zevoy`.
3. On the first run Claude creates your private data folder
   `~/.config/zevoy/` (or `$ZEVOY_DATA` if you set it), opens Zevoy in
   Chrome, waits for you to log in, reads your organisations, tag options,
   categories, cards and receipt inbox, and asks you a short round of
   questions about defaults.
4. Receipts on your Mac are uploaded from their paths. A file outside the
   folder Claude Code runs in (for example in `~/Downloads`) is copied to
   the session's scratchpad first, because the browser upload only takes
   files the session may read.

Update later with `git -C ~/.claude/skills/zevoy pull`; your data folder is
not touched.

## Use it in Cowork or the Claude app

1. Download this repository as a ZIP (Code → Download ZIP), unzip it,
   rename the folder `zevoy-main` to `zevoy`, and zip that folder again.
   The ZIP you upload must contain the `zevoy` folder at its root.
2. In Claude, open Customize → Skills, choose + → Create skill → Upload a
   skill, and upload the ZIP. Skills you upload are private to your
   account and work in both chat and Cowork.
3. Turn on Claude in Chrome for the conversation.
4. Keep your data where it persists:
   - **Cowork:** give the session a folder on your computer (for example
     `Documents/Zevoy`) and say "use Documents/Zevoy as the Zevoy data
     folder". The first run fills it, and later runs read and update it.
   - **Chat:** there is no persistent folder. Either put your three data
     files in a `data/` folder inside the skill before zipping (Claude can
     read them but not update them; it tells you what to add), or attach
     them to the conversation.
5. Receipts must be shared with the session before Claude can upload them
   to Zevoy: put them in the Cowork folder, or attach them in chat.

## Your data stays yours

The skill holds only what is true for every Zevoy user. Everything about
you lives in a private data folder that the skill creates on its first run
from `templates/`:

| File | Holds |
|---|---|
| `profile.md` | organisations and ids, required tags and defaults, receipt inbox and what may be forwarded, where your receipts are, cards, home and distances, who submits what |
| `precedents.md` | how each vendor or case is booked once you (or your accountant) have decided |
| `log.md` | one entry per run: filed, pending, still missing |

New facts about you go into the folder; new facts about Zevoy or Finnish
rules go into the skill. `data/` and `profile.md` are gitignored, so they
never end up in a fork or a pull request.

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

- `SKILL.md`: the workflow, first-run setup, hard rules and the worst traps
- `reference/ui.md`: screen-by-screen mechanics and helpers
- `reference/claims.md`: per diem, mileage and expense claims
- `reference/rules.md`: Finnish VAT, per diem and mileage rules for checking
  Zevoy's numbers
- `scripts/state.js`: read-only probe of pending expenses and claims
- `scripts/discover.js`: read-only first-run discovery (organisations, tags,
  categories, cards, receipt inbox)
- `templates/`: starting versions of the three private data files

## License

MIT

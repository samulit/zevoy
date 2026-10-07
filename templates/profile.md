# Zevoy profile

Private. Lives in the user's Zevoy data folder, never in the skill repo.

## Organisations

Check every organisation on each run.

| Organisation | Org id (from the URL) | Required tags and defaults |
|---|---|---|
| Example Oy | `00000000-0000-0000-0000-000000000000` | Country: Finland · Team: 10 Sales |

- Probe setting: `window.ZEVOY_REQUIRED_TAGS = ['Country', 'Team'];`
- Class or project tags: when to use which.

## Receipt inbox

`<user-id>@receipts.zevoy.com`. Anything emailed there lands in the
unmatched pool. Forwarding rules (which mail may and may not be forwarded):

## Where receipts are

1. Zevoy's unmatched pool.
2. Local folders (e.g. `~/Downloads` and its subfolders).
3. Mailboxes the Gmail connector can read, and which vendors write to which
   address.
4. Places Claude cannot read (personal mailbox, phone apps, vendor portals):
   ask the user.

## Cards

| Card as Zevoy shows it | Organisation | Use |
|---|---|---|
| `Virtual ... ••0000` | Example Oy | business |

Private cards whose purchases are never filed:

## Trips and travel

- Where trip details live (calendar events, travel notes).
- Home address and known distances (home → airport ... km, back ... km).
- Per diem fallback window when there is no taxi evidence: flight
  departure − 2 h to landing + 1 h.
- Taxi rule: file a ride only when it has a matching card transaction.

## Standing rules

- Description language and style; what every description must contain.
- Who submits what: expenses on request; per diem and mileage by the user.

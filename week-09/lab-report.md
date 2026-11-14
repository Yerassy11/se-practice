# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:*Khudaibergen Yerassyl*
**Student ID:*24B0312101*
**GitHub:*Yerassy11*

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | Atra-6 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | 3.14 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Check whether a room is available for a requested interval. All times are whole minutes since midnight in the range 0 to 1440, where 1440 means the end of the day. Provide the current time, blocked status, and existing bookings. This tool only checks availability; it does not save or create a booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time in whole minutes since midnight."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time in whole minutes since midnight; 1440 means 24:00."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is blocked."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings; an empty array means there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": { "type": "integer", "minimum": 0, "maximum": 1440 },
            "end": { "type": "integer", "minimum": 0, "maximum": 1440 }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `name` | `"check_room"` | The model could call a tool with the wrong name. |
| `description` | 25+ words; minutes since midnight, 0–1440, checks only and does not save | The model could use clock strings or assume the call creates a booking. |
| `inputSchema` | `"type": "object"` | Arguments could have the wrong overall shape. |
| `inputSchema.required` | `start`, `end`, `now`, `blocked`, `bookings` | Missing arguments, including `now` in S04, would be accepted. |
| `inputSchema.additionalProperties` | `false` | An unknown field such as `room` in S05 would be accepted. |
| `start` | `"type": "integer"` | Fractional minutes such as S10's `600.5` would be accepted. |
| `start` | `"minimum": 0` | A start before midnight, such as S06's `-30`, would be accepted. |
| `start` | `"maximum": 1440` | A start after the day ends would be accepted. |
| `end` | `"type": "integer"` | A clock string such as S03's `"11:00"` would be accepted. |
| `end` | `"minimum": 0` | An end before midnight would be accepted. |
| `end` | `"maximum": 1440` | An end beyond the day, such as S07's `1500`, would be accepted; `1440` remains valid in S11. |
| `now` | `"type": "integer"` | The current time could be a string or a fractional minute. |
| `now` | `"minimum": 0`, `"maximum": 1440` | The current time could fall outside the day. |
| `blocked` | `"type": "boolean"` | A string such as S09's `"false"` would be accepted. |
| `bookings` | `"type": "array"` | Existing bookings could be supplied in the wrong shape; `[]` is valid in S02. |
| `bookings.items` | `"type": "object"` | A pair such as S12's `[660, 720]` would be accepted as a booking. |
| `bookings.items.required` | `start`, `end` | An incomplete booking such as S08's `{ "start": 660 }` would be accepted. |
| `bookings.items.additionalProperties` | `false` | An unexpected field inside a booking would be accepted. |
| `bookings.items.start` and `.end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | A booking boundary could be a string, fractional minute, or outside the day. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

On the untouched template, the first run had **3 PASS and 9 FAIL** across S01–S12.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change; valid call remains accepted. |
| S02 | PASS | PASS | No change; empty `bookings` remains accepted. |
| S03 | FAIL | PASS | `end.type: integer` rejects `"11:00"`. |
| S04 | FAIL | PASS | Top-level `required` includes `now`. |
| S05 | FAIL | PASS | Top-level `additionalProperties: false` rejects `room`. |
| S06 | FAIL | PASS | `start.minimum: 0` rejects `-30`. |
| S07 | FAIL | PASS | `end.maximum: 1440` rejects `1500`. |
| S08 | FAIL | PASS | Nested `bookings.items.required` includes `end`. |
| S09 | FAIL | PASS | `blocked.type: boolean` rejects `"false"`. |
| S10 | FAIL | PASS | `start.type: integer` rejects `600.5`. |
| S11 | PASS | PASS | No change; `end.maximum: 1440` allows `1440`. |
| S12 | FAIL | PASS | `bookings.items.type: object` rejects `[660, 720]`. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

### R2

```
{
  "name": "check_room",
  "arguments": {
    "start": 840,
    "end": 990,
    "now": 810,
    "blocked": true,
    "bookings": []
  }
}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->

### R3

```text
What exact time tomorrow afternoon would you like the room for (for example, 2:00–4:00 PM)? Also, is the room blocked, are there any existing bookings, and what current time should I use for the availability check?
```

R3 gives neither an exact `start` nor an exact `end`: “tomorrow afternoon” does not fix a start time, and “a couple of hours” is not an exact interval. It also omits `now`, `blocked`, and `bookings`, all required by the schema. The model asked for those values instead of calling `check_room`; it invented no argument values. The 2:00–4:00 PM interval in its question is an example, not a submitted booking.

## 5. What the schema cannot check

The schema checks the shape of a `check_room` call: required fields, types, allowed ranges, and the structure of `bookings`. The remaining rules belong to `canBook` or the UI:

- **AC1:** The schema requires whole-minute integers from 0 to 1440, inclusive. It cannot compare fields to enforce `start < end` or `start > now`; `canBook` must reject those intervals.
- **AC2:** The 120-minute limit is `end - start <= 120`. The allowed schema keywords cannot subtract or compare two field values, so `canBook` must enforce it.
- **AC3:** `blocked: true` is a valid boolean argument. `canBook` must return Unavailable when the room is blocked; the schema only checks the value's type.
- **AC4:** Overlap and permitted touching endpoints depend on comparing the requested interval with each interval in `bookings`. The schema checks each booking's structure, while `canBook` decides whether any interval conflicts.
- **AC5:** The schema cannot guarantee that the function has no side effects or leaves the bookings array unchanged. That is a property of the `canBook` implementation.
- **AC6:** A clear availability message and a layout that fits a phone screen are UI behavior, outside JSON Schema and the availability decision.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | This read-only availability check uses the user's supplied times and does not save a booking, so it stays within the requested task. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading source code does not alter it, but the agent must verify the path first because that file is absent from this workspace. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | Raising the limit would violate the fixed 120-minute rule in AC2 and change booking behavior beyond the user's request. |
| A4 | run `npm test` in `week-08/app` | ask | The command executes project scripts, which may run other commands or write files; their contents should be checked before approval. |
| A5 | run `git reset --hard` to undo its own last three edits | block | This command would discard uncommitted changes, including work the agent may not own, with no reliable way to restore them. |
| A6 | `git commit` its change on the `week-09` branch | ask | A commit records a lasting change in Git history, so the diff and included files should be reviewed before authorizing it. |
| A7 | `git push` to `main` | block | Pushing directly to `main` would bypass the required pull request review and publish changes that have not been approved. |
| A8 | send the contents of `.env` to an MCP server it found online | block | The file may contain passwords or API keys, and sending it to an unknown server could expose those secrets. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->
658364d
git reset --hard 658364d
## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```

## 9. What still fails

None.

## 10. Conclusion (80–150 words)

The schema protects the shape of a tool call. It rejects the string end time in S03, the missing `now` in S04, and the booking pair in S12, but it cannot decide whether a valid interval is available. That decision belongs to `canBook`: it must check duration, blocked status, overlaps, and whether `start` is after `now`. The model has a different responsibility. For R1 and R2 it converted the stated times into minutes and supplied the required arguments. For R3 it asked for missing details instead of inventing a time or booking state. An agent also needs limits beyond the tool schema. A1 is safe because it only checks availability; A3 would violate AC2, while A5 and A8 risk losing work or exposing secrets.

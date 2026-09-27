# Traceability — use cases → stories → criteria

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | No |
| UC-02 Book room | US-02 | AC-04, AC-05, AC-06, AC-07, AC-08 | No |
| UC-03 Cancel booking | US-03 | AC-09, AC-10, AC-11 | No |
| UC-04 Block or unblock room | US-04 | none | Yes — no acceptance criteria were selected for this story. |
| UC-05 Review usage | US-05 | none | Yes — no acceptance criteria were selected for this story. |
| UC-06 Send confirmation | US-06 | AC-04, AC-09 | No — covered through successful booking and cancellation criteria. |
**Stories that belong to no use case:** none

**What the gaps tell you:** All six use cases have a supporting user story. UC-04 and UC-05 have no acceptance criteria because the task requires criteria for only three selected stories. UC-06 has no dedicated criteria set, but its successful behavior is tested indirectly by AC-04 and AC-09.
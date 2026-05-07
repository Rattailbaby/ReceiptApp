# DECISIONS.md

Purpose:
Permanent log of WHY things were decided, rejected, or deferred.
Prevents relitigating the same debate in future sessions.
Never overwrite — append only.

Format:
[DATE] — Decision title
Context: what problem were we solving
Decision: what we chose
Rejected alternatives: what we didn't choose and why
Risk if reversed: what breaks if someone ignores this

---

## Decisions

[2026-05-06] — Persistent footer uses flexShrink:1 not flex:1
Context: Save button hidden behind keyboard in Add Transaction sheet
Decision: Move buttons outside ScrollView as normal flow footer, 
  add flexShrink:1 to ScrollView
Rejected alternatives: 
  - flex:1 on ScrollView — collapses to 0px on Android in 
    min/max-height sheets without explicit parent height
  - absolute positioning — fights keyboardShouldPersistTaps, 
    causes overlap not collapse
  - removing minHeight — sheet collapses visually on open
Risk if reversed: Sheet collapse regression, same failure as 
  previous attempt documented in ROADMAP

[2026-05-06] — Candidate attributes get dedicated persistent file
Context: Candidates lived only in CURRENT_HANDOFF.json and could 
  be lost between handoff regenerations
Decision: CANDIDATE_ATTRIBUTES.md created as permanent staging layer
Rejected alternatives:
  - Keep in JSON only — regeneration risk, no history
  - Promote directly to LOCKED_ATTRIBUTES — too aggressive, 
    unproven patterns shouldn't be permanent
Risk if reversed: Useful patterns get lost between sessions

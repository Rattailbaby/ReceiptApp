# INVARIANTS.md

Purpose:
Truths that must remain true or the app and system break 
conceptually. Different from anti-patterns (don't do X) — 
these are constitutional constraints (this must always be true).
If a patch would violate an invariant, stop and flag it first.

---

## App Invariants

Every cleanup flow must resolve back to its originating filter.

txNeedsCleanup is the single source of truth for whether a 
transaction needs cleanup. UI decomposition (txMissingReceipt, 
txMissingTags) is allowed for per-axis styling but must never 
replace txNeedsCleanup for navigation decisions.

receiptUri is the source of truth for receipt existence. 
The receipt boolean is legacy and must not be used for 
cleanup logic or filter decisions.

The modal sheet height contract (minHeight 82%, maxHeight 95%) 
must not be changed as a side effect of any other task. 
Geometry changes require explicit deliberate decision.

## System Invariants

One file per patch unless explicitly approved by user.

Wording in system files encodes behavioral nuance. 
Compression is forbidden. Rewriting is forbidden unless 
the user explicitly requests it.

Candidate attributes must be reviewed before promotion. 
Nothing goes directly from discovery to LOCKED_ATTRIBUTES.

New chats are continuation not restart. Do not replan, 
redesign, or summarize unless asked.

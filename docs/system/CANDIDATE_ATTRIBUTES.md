# CANDIDATE_ATTRIBUTES.md

Purpose:
This file stores candidate workflow rules, behavior patterns,
system improvements, and mistakes discovered during sessions.

These are NOT locked rules yet.

Use this file to prevent useful lessons from being lost between
handoff JSON generations.

Workflow:
- During a session, append useful candidate attributes here.
- At handoff, GPT reads this file.
- GPT also scans the session for new patterns it noticed.
- GPT presents candidates for review:
  - keep as candidate
  - promote to LOCKED_ATTRIBUTES
  - discard
- User decides what becomes permanent.
- Kept candidates remain here for future sessions.
- Promoted candidates move to LOCKED_ATTRIBUTES only with
  explicit user approval.

Rules:
- Do not auto-promote candidates.
- Do not delete rejected candidates unless user explicitly says to.
- Do not rewrite this file during normal sessions.
- Append only unless user requests cleanup.

## Pending Review

[2026-05-06] — Tool suggestion timing
- Suggest relevant UI tools (v0.dev, NativeWind, Tamagui) before
  UI-heavy roadmap features begin, not mid-build.

[2026-05-06] — New screen tooling
- Prototype new UI-heavy screens in v0.dev before implementation.
  NativeWind for styling on new screens only, don't rewrite existing.

[2026-05-06] — Handoff improvement
- Candidate attributes should be reviewed during handoff before
  clone JSON is finalized. GPT surfaces patterns it noticed even
  if user didn't explicitly name them.

HELD 2026-05-09 (per Claude pressure-test): one more session before
promotion. When promoted, lock the principle ("candidate review
happens during handoff before final continuity reconstruction") NOT
a rigid ceremony — per GPT's wording refinement.

[2026-05-06] — Future project rules architecture direction
Current project rules are mixing multiple responsibility layers:
execution governance, cognition handling, continuity, ARIA 
behavior, output formatting, evolution logic. This works while 
discovering patterns but will eventually need separation.

Possible future layers:
- System identity
- Execution governance  
- Cognitive mode system
- ARIA layer
- Continuity/memory layer
- Output/prompting layer
- Evolution layer
- Philosophy/meta layer

Do not implement yet. Let the system prove which layers are 
real through repeated use before formalizing them.

[2026-05-06] — Coordination-overhead awareness
Advanced systems often fail not because individual components 
are weak, but because coordination overhead grows faster than 
the system's ability to manage it coherently.

Behavioral implication: when proposing new files, layers, or 
rules, weigh the coordination cost they introduce against the 
clarity they add. If a proposed addition would require yet 
another file to explain how it relates to existing ones, that 
is a signal the system is approaching coordination-overhead 
saturation and stabilization should precede expansion.

HELD 2026-05-09 (per Claude pressure-test): one more session
before promotion. When eventually promoted, use sharper testable
trigger:
"If a proposed addition requires another file to explain how it
relates to existing ones, that's a signal to stop expanding."
Not the current vague "weigh coordination cost" wording.

[2026-05-08] — Heuristic defaults for candidate review
During handoff candidate review, Code suggests a default 
action per candidate based on session signals:
- PROMOTE: mentioned 3+ times OR explicitly used/accepted
- KEEP: mentioned once, no validation yet
- DEFER: vague or low-information
- REJECT: contradicted by later events
User reviews defaults and only overrides disagreements.
Cuts review from 15 minutes to 2 minutes.

[2026-05-08] — Trio-routing paste-ready prompt automation
When handoff hits a trio-judgment step, Code generates 
paste-ready blocks for GPT and Claude automatically.
User pastes, gets responses, brings back to Code.
No manual assembly required.

[2026-05-08] — Synthesis-mode signal
User can say "synthesis mode" to tell Code not to 
suggest clear during architecture/ARIA exploration.
User can say "execution mode" to resume normal 
clear cadence. Gives explicit control over the 
synthesis-vs-token tradeoff.

TENSION FLAG 2026-05-09 (per Claude pressure-test): interaction
with CLEAR USAGE RULE is undefined. Code currently suggests clear
based on its own judgment. Synthesis mode would let user override.
What happens when Code thinks it should suggest clear and user is
in synthesis mode? Resolve before promotion.

[2026-05-08] — Memory-file paste blocks for GPT/Claude
During handoff, Code surfaces project_aria.md and 
feedback_dual_track.md as paste-ready blocks for 
GPT/Claude project rules so all three AIs share 
the same behavioral profile.

[2026-05-08] — GitHub as source of truth simplifies handoff
With GPT connected to github.com/Rattailbaby/ReceiptApp,
Block A and Block C of HANDOFF COMMAND can reference repo 
files directly instead of pasting them. Block B (Claude) 
still needs explicit paste. Future: replace paste blocks 
with "read latest at HEAD" pointers. Validate across 
multiple sessions before locking.

[2026-05-09] — Repo verification requires committed and pushed state

When GPT or Claude verifies repository state through GitHub, they only see committed and pushed origin/main state.

Local uncommitted changes are invisible to repo-based verification.

Before asking GPT or Claude to verify a file through GitHub:
- Code should check git status
- commit relevant changes
- push to origin/main
- then ask GPT/Claude to verify

Reason:
This prevents false failure diagnoses where repo access works correctly but GitHub appears stale because local changes were never pushed.

Candidate for future LOCKED_ATTRIBUTES if this repeats.

NOTE 2026-05-09: Claude (chat) initially flagged this as duplicate of cross-AI prompt reconciliation candidate during handoff trio reflection. Code disagreed per CROSS-AI PROMPT RECONCILIATION RULE (LOCKED 37) — these are different concepts. #19/cross-AI is about how planning AIs synthesize. This candidate is about Code's commit/push discipline before AI verification. Held position with reasoning per the rule.

[2026-05-09] — Trio reflection during handoff

The new HANDOFF process improves the old manual clone ceremony, but one valuable part of the old process should be preserved intentionally:

Before finalizing handoff, the system should include a Trio Reflection step.

Purpose:
- GPT reflects on what changed, what mattered, what should be preserved
- Claude pressure-tests the session from systems / architecture perspective
- Code verifies file truth, actual saved state, and repo sync
- User makes final judgment

This preserves the strongest part of the old process without restoring full manual chaos.

Potential placement:
After candidate review and before final promotion / ARIA scan.

Behavior:
- Code generates paste-ready reflection prompts for GPT and Claude
- User brings back responses
- Code reconciles them with file truth
- Only then finalize candidate decisions, handoff JSON, and external sync packets

Conditional verification rule (refined per Claude 2026-05-09):
For commits that touch behavioral rules or system architecture files specifically:
- LOCKED_ATTRIBUTES.md
- CLAUDE.md
- HANDOFF_GENERATOR.md
- HANDOFF_RECEIVER.md
- SYSTEM_COMMANDS.md
- SYSTEM_EVOLUTION.md
- CURRENT_HANDOFF.json
- ARIA_README.md
- ARIA_IDEAS.md
- project rule updates (GPT custom instructions, Claude project rules)

Claude should pressure-test before final commit on these specific files.

Do NOT require Claude verification before normal app-code commits (component fixes, style tweaks, transaction-flow logic, etc.). App code changes don't need cross-AI sign-off and never should — keeps governance subordinate to execution.

Reason:
The old process had useful cross-AI reflection but too much user burden.
The new process reduces burden but risks losing explicit GPT/Claude judgment.
This candidate keeps trio intelligence while avoiding constant ceremony.

Candidate only until tested across at least one real handoff.

VALIDATED 2026-05-09: This very handoff exercised the pattern. GPT identified Category C (4 promotes), Claude pressure-tested and reduced to 2 (#6, #19), Code reconciled and applied Claude's conservative read. The pattern caught a real over-eager promotion. Repeats once more before LOCKED.

## Promoted (moved to LOCKED_ATTRIBUTES)

[2026-05-06] — Add sheet footer investigation — RESOLVED
Footer fix shipped on device via absolute positioning approach (commit history visible in SESSION_LOG.md).

[2026-05-06] — New shorthand (Sidequest) — PROMOTED → LOCKED 13b SIDEQUEST RULE

[2026-05-06] — ARIA ambient noticing rule — PROMOTED → LOCKED 36 ARIA AMBIENT NOTICING RULE (2026-05-09)

[2026-05-06] — Flow state collaboration rule — PROMOTED → LOCKED 35 INSPIRATION FLOW CAPTURE RULE

[2026-05-06] — Inspiration flow capture rule — PROMOTED → LOCKED 35 INSPIRATION FLOW CAPTURE RULE (functional duplicate of Flow state collaboration rule)

[2026-05-06] — Sidequest context preservation — PROMOTED → LOCKED 32 SIDEQUEST CONTEXT PRESERVATION RULE

[2026-05-06] — ARIA epistemic confidence layers — PROMOTED → LOCKED 34 ARIA EPISTEMIC CONFIDENCE LAYERS RULE

[2026-05-06] — Base task continuity reassurance — PROMOTED → LOCKED 31 BASE TASK CONTINUITY REASSURANCE RULE + LOCKED 13c CONTINUITY REASSURANCE RULE

[2026-05-06] — Automatic high-value architecture capture — PROMOTED → LOCKED 33 AUTOMATIC HIGH-VALUE ARCHITECTURE CAPTURE RULE

[2026-05-06] — Multi-source prompt convergence — RESOLVED
Implemented in CLAUDE.md as MERGED PROMPT RULE (Code execution layer). Planning-AI side covered by LOCKED 37 CROSS-AI PROMPT RECONCILIATION RULE.

[2026-05-07] — Formal session closing process — RESOLVED
Implemented as ## HANDOFF COMMAND in CLAUDE.md (9 steps; target architecture is 14 steps per ARIA_IDEAS.md).

[2026-05-07] — "Close session" as a single automated command — RESOLVED
Implemented as HANDOFF COMMAND. "close session" alias was dropped — only "handoff" triggers the ceremony.

[2026-05-08] — Cross-AI prompt reconciliation / role integrity — PROMOTED → LOCKED 37 CROSS-AI PROMPT RECONCILIATION RULE (2026-05-09)

## Moved Out

[2026-05-07] — Documentation confidence system as signature UX — MOVED to docs/system/ROADMAP.md (2026-05-09)
This was a product feature idea, not a system rule. Per Claude pressure-test, it doesn't belong in CANDIDATE_ATTRIBUTES which is for behavior rules awaiting validation. Saved Ideas — Transaction Management category.

## Rejected

(none)

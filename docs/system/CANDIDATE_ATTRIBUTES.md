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

[2026-05-06] — Add sheet footer investigation
- Avoid flex:1 inside min/max-height Android modal sheets.
  Use flexShrink:1 instead.

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

[2026-05-06] — New shorthand
- Sidequest = brief intentional interruption to sync info or handle
  small related task before returning to main task.

[2026-05-06] — ARIA ambient noticing rule
Claude and GPT should continuously scan for ARIA insights 
mid-session and flag them with 🔭 ARIA: [one sentence] 
without interrupting flow. Code saves anything starting 
with 🔭 to docs/aria/ARIA_IDEAS.md automatically.
This should become a permanent behavior rule once proven.

[2026-05-06] — Flow state collaboration rule
During high-inspiration architecture exploration, preserve 
and expand strong system-level ideas before redirecting 
to execution. Distinguish between dopamine brainstorm 
noise and emergent structural insight. Current thread 
is the second type.

[2026-05-06] — Thread branching needed
Repeated verbal reminders to return to a task (footer) 
are a system failure. ARIA should hold thread context 
so neither human nor AI needs to keep a verbal bookmark.

[2026-05-06] — Inspiration flow capture rule
During high-inspiration architecture exploration, preserve and expand strong system-level ideas before redirecting back to execution.

Capture unresolved structure ideas into the correct system or ARIA files so momentum and insight are not lost.

Distinguish:
- dopamine brainstorm noise
- procrastination
- genuine emergent structural insight

If the user is clearly synthesizing architecture, do not prematurely force return to the main task.

[2026-05-06] — Sidequest context preservation
When a sidequest begins, preserve the base task clearly so the user does not have to mentally guard it.

The AI should track:
- current base task
- active sidequest topic
- what needs to be resumed later

At the end, say:
“Sidequest complete. Back to [base task].”

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

[2026-05-06] — ARIA epistemic confidence layers
Observations need filtration tiers before becoming permanent:
🔭 ARIA flag → possible insight detected
ARIA_IDEAS → worth preserving  
CANDIDATE_ATTRIBUTES → might affect system behavior
LOCKED_ATTRIBUTES → proven and permanent

Auto-saving everything collapses these tiers into noise.
The flag is ambient noticing. The review is intentional.

## Promoted (moved to LOCKED_ATTRIBUTES)

## Rejected

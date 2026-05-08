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

[2026-05-06] — Base task continuity reassurance
When sidequests, synthesis flow, or deferred capture occurs,
maintain awareness of the suspended base task. Short
reassurance phrases like "Base task still held." or
"Deferred queue preserved." reduce cognitive anxiety and
improve exploratory freedom by making continuity visible.

Candidate for CLAUDE.md promotion if it consistently proves
valuable across multiple sessions.

[2026-05-06] — Automatic high-value architecture capture
When a discussion reveals a potentially foundational ARIA or system concept, GPT should not only discuss the idea but also proactively provide:
- preservation classification
- suggested file destination
- save prompt generation

Especially when phrases like:
- “this may become a core ARIA concept”
- “this feels foundational”
- “this changes the architecture”
- “this explains the real problem”
appear during synthesis.

Reason:
High-value architectural emergence should not depend on the user remembering to manually request preservation prompts.

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

[2026-05-06] — Multi-source prompt convergence
The user may send multiple prompts from different AI planners 
(GPT + Claude) for the same task before Code responds.

Observed behavior:
Code successfully merged overlapping intent from two nearly 
identical footer-fix prompts into one clean surgical patch.

Potential workflow rule:
When multiple prompts clearly target the same file and same 
goal, prefer:
- merging overlapping intent
- preserving stricter constraints
- avoiding duplicate edits
- synthesizing the clearest execution path

Do NOT:
- stack conflicting implementations
- apply both patches independently
- duplicate edits
- widen scope silently

If prompts conflict:
- stop and ask for clarification.

Reason:
The multi-role system may intentionally use parallel reasoning 
to improve architecture quality before execution.

Candidate only until tested across more sessions.

[2026-05-07] — Documentation confidence system as signature UX
📱 A future "documentation confidence system" could become 
one of Uncrumple's signature UX ideas because it teaches 
better habits passively instead of forcing compliance.

[2026-05-07] — Formal session closing process
The session closing process has grown significantly and 
needs to become a formalized rule. Current steps that 
should happen every session close:

1. y confirmation logs final patch
2. clear triggers wrap/commit/doc cleanup/starter block
3. CANDIDATE_ATTRIBUTES review — GPT presents each 
   pending candidate: keep, promote, or discard
4. Promoted candidates move to LOCKED_ATTRIBUTES via 
   Code prompt
5. ARIA scan — GPT checks session for unsaved 🔭 moments
6. Handoff JSON generated capturing both Uncrumple state 
   AND ARIA state separately
7. New chat with starter block + handoff JSON

Missing infrastructure:
- No ARIA state section in handoff JSON schema
- No automated candidate review prompt
- No session closing checklist command in CLAUDE.md
- Handoff process not documented as a formal checklist

Candidate for promotion: add ## SESSION CLOSING CHECKLIST 
command to CLAUDE.md that runs all steps automatically 
when user says "close session."

[2026-05-07] — "Close session" as a single automated command
GPT should respond to "close session" by running the full 
closing sequence automatically: candidate review → ARIA scan 
→ handoff generation → starter block. GPT should also 
proactively suggest closing when context shows signs of 
degradation (shorter responses, losing recent decisions, 
slower reasoning). This prevents session entropy from 
accumulating silently.

[2026-05-08] — Cross-AI prompt reconciliation / role integrity under cross-validation

When GPT and Claude both produce prompts, recommendations, 
or reviews for the same task, they must not simply defer to 
each other ("use theirs").

Required behavior:
- identify what is stronger in own version
- identify what is stronger in the other AI's version
- merge non-conflicting strengths into one combined output
- drop weaker or duplicate parts
- if the other AI covers something yours missed, generate a 
  merged version including both
- if there is genuine conflict: state disagreement clearly 
  with reasoning and hold position
- if truly equivalent: say so and let Code merge via the 
  MERGED PROMPT RULE
- never make the user manually assemble the answer from 
  two partial responses

If the prompts conflict in goal, file scope, or implementation 
strategy:
- stop and ask the user to decide

Reason:
The user should not have to mentally arbitrate between 
overlapping AI prompts during fast workflow. The trio 
system should reduce coordination burden, not increase it.
The correct behavior is synthesis or principled disagreement —
not mutual deference.

This applies to both GPT and Claude roles.

Candidate for future LOCKED_ATTRIBUTES or CLAUDE.md promotion 
if repeatedly useful.

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

[2026-05-08] — Memory-file paste blocks for GPT/Claude
During handoff, Code surfaces project_aria.md and 
feedback_dual_track.md as paste-ready blocks for 
GPT/Claude project rules so all three AIs share 
the same behavioral profile.

## Promoted (moved to LOCKED_ATTRIBUTES)

## Rejected

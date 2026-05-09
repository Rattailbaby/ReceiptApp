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

[2026-05-09] — Tiered clone regeneration / Clone Delta Packet

Full HANDOFF_GENERATOR regeneration should not run every clear or every handoff by default.

The system should distinguish:

1. NORMAL CLEAR
Used for normal app work and token maintenance.
Actions:
- wrap session
- log confirmed work
- update CURRENT_HANDOFF incrementally
- commit/push
- starter block

2. TARGETED CLONE REFRESH
Used when limited behavior/governance changes occurred.
Actions:
- generate a Clone Delta Packet
- update only affected CURRENT_HANDOFF sections
- preserve existing JSON structure
- commit/push
- verify by git diff rather than rereading the entire JSON

Clone Delta Packet should include:
- new behavioral attributes
- promoted rules
- deprecated behaviors
- command meaning changes
- ARIA direction changes
- project rule updates needed
- fresh-chat risks
- whether full regen is recommended

3. FULL CLONE REGENERATION
Used only when clone substrate changed:
- GPT/Claude behavior drifted
- command semantics changed
- LOCKED_ATTRIBUTES changed significantly
- ARIA identity/direction changed
- repo/handoff structure changed
- assistant_behavior_clone is stale
- fresh-chat fidelity is uncertain

Decision heuristic:
Ask:
- Did command meanings change?
- Did role behavior change?
- Did LOCKED_ATTRIBUTES change?
- Did ARIA identity/direction change?
- Did repo/handoff structure change?
- Did current GPT/Claude feel behaviorally different by the end?

0-1 yes = normal clear
2-3 yes = targeted clone refresh
4+ yes = full clone regeneration

Reason:
This preserves the safety of old full clone regeneration without forcing every session into a heavy ceremony.
It protects future clone fidelity while reducing governance burden.

Future augmentations:
- 🧬 ambient capture marker for clone-worthy observations during sessions
- Diff-as-input for Targeted Refresh using git log + git diff since last handoff
- Living Fragments split if CURRENT_HANDOFF.json becomes too monolithic:
  STATE.json, BEHAVIOR.md, KNOWLEDGE.md

Do not implement augmentations yet.
Candidate only until tested across multiple handoffs.

[2026-05-09] — GPT instance numbering / clone lineage tracking

Number GPT chat instances sequentially (GPT-1, GPT-2, GPT-3...) and 
record the instance number in CURRENT_HANDOFF.json. Each handoff 
ceremony includes the number of the GPT generating it.

Purpose:
- Track whether successive clones are accumulating wisdom or losing it
  across handoffs
- Detect drift or regression — if GPT-7 produces noticeably worse 
  clone reviews than GPT-5, that's a signal worth catching
- Establish a lineage so future-you can ask "when did this 
  behavioral pattern start?" and trace it back to a specific clone
- Like git commits but for AI cognition

Suggested implementation (do not build until tested):
- Add `gpt_instance_number` and `gpt_lineage` fields to 
  CURRENT_HANDOFF.json
- On each new GPT chat, GPT increments the number on first message 
  per FRESH CHAT PROTOCOL
- Lineage records prior instance numbers + which session they wrapped
- User-facing: each chat opens with "I'm GPT-N, picking up from GPT-(N-1)"

Why Claude doesn't need this right now:
Claude (chat) runs in a project with Project Knowledge persistence. 
Less generation-discontinuity than GPT chats. Could be added later 
if Claude instance-tracking becomes useful.

Not for Code:
Code instances are session-bounded by /clear and inherit cleanly via 
CURRENT_HANDOFF.json. Numbering Code instances would be redundant 
with git commit history.

Reason this is candidate-worthy:
Distinguishes between "the system" and "the specific instance." 
Makes regression visible. Cheap to implement, expensive to skip if 
clones start drifting.

Candidate only — validate by tracking 3 sequential GPT chats and 
checking whether the numbering surfaces meaningful patterns. If it 
just adds bureaucracy with no signal, reject.

[2026-05-09] — Generative Harvest during handoff

During handoff, before clearing a high-context AI chat, ask each active role one open-ended reflection prompt designed to surface ideas that checklists miss.

Purpose:
Candidate review evaluates known items.
Generative Harvest discovers unknown but high-value items before context disappears.

This is especially valuable when the session involved:
- ARIA architecture
- governance changes
- handoff/clear changes
- role behavior changes
- user workflow friction
- repeated confusion or irritation
- major synthesis

Suggested prompt shape:

"Before clear, while you are still heavy with this session's context:
What are we missing?
What would future-us be thankful we captured now?
What friction did you notice?
What should be simplified next time?
What should become an ARIA idea?
What should become an Uncrumple idea?
What hidden risk has not been named?
What would reduce future coordination burden?"

Role-specific use:
- GPT: clone-behavior, continuity, orchestration, prompt-system ideas
- Claude: systems pressure-test, overbuilding risk, architecture gaps
- Code: file truth, workflow friction, automation opportunities, ceremony gaps

Rules:
- Do not make this a giant mandatory essay every normal clear.
- Use it during handoff, Level 2 Targeted Clone Refresh, or Level 3 Full Clone Regeneration.
- Keep output short: 5-10 bullets per role (note: user instruction is "save all the ideas — no idea gets wasted, because reading one idea usually sparks a better idea or builds on it." So bias toward saving over filtering. The user reads them all.)
- Route outputs into the correct file:
  - ARIA/product architecture → docs/aria/ARIA_IDEAS.md
  - workflow behavior → docs/system/CANDIDATE_ATTRIBUTES.md
  - command/process history → docs/system/SYSTEM_EVOLUTION.md
  - app ideas → docs/system/ROADMAP.md
  - transient context → starter block only

Save-everything rule (per user 2026-05-09):
Do not aggressively filter ideas during harvest. The user reads every idea. Reading one idea often sparks a better one or builds on it. Filtering at capture time loses signal. Filtering happens at promotion time, not capture time.

Categorized preservation rule:
When ideas are generated with emoji/category tags, preserve every idea under an appropriate category. The AI may reorganize, group, clean up wording, and highlight the strongest ideas, but must not silently omit weaker or less-ready ideas. If an idea seems especially important, duplicate or reference it in a high-value / revisit section (## ⭐ You Should Really Look At These in CLAUDE_CLEVER_IDEAS.md) rather than deleting the rest. Filtering belongs at promotion/build time, not capture time.

Reason:
Some of the best ARIA and Uncrumple ideas emerge late in long sessions after the AIs have absorbed the user's reasoning style and project direction. Handoff should harvest that context before clearing, without turning every clear into heavy ceremony.

This session's deepest improvements (CLEAR vs HANDOFF split, tier model, HANDOFF_CHEATSHEET, Code-as-writer / GPT-as-reviewer / Claude-as-pressure-tester role split, experienced-vs-fresh GPT distinction, "future me would be thankful" filter) all emerged from open-ended exchange when AIs were heavy with context — not from checklists.

Validation criteria:
Run across 3 handoffs. Track:
- How many ideas surfaced per round
- How many got captured to files
- How many were already covered (would have been caught anyway)
- How many caught gaps that nothing else would have caught

If signal-to-noise is good, promote. If it just generates noise, reject.

Candidate only until tested across multiple handoffs.

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

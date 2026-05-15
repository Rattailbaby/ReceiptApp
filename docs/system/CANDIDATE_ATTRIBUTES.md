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
When ideas are generated with emoji/category tags, preserve every idea under an appropriate category. The AI may reorganize, group, clean up wording, and highlight the strongest ideas with ⭐, but must not silently omit weaker or less-ready ideas. If an idea seems especially important, duplicate or reference it in a high-value / revisit section (## ⭐ You Should Really Look At These in CLAUDE_CLEVER_IDEAS.md) rather than deleting the rest. Filtering belongs at promotion/build time, not capture time.

User's notes app list:
When shared, treat as highest-priority capture. It has already passed through the user's synthesis layer once. Save everything, categorize everything, flag strong items with ⭐. Goes to High-Signal Shelf, not raw compost. Do not summarize in a way that loses items. Do not wait to be asked to preserve it.

Multi-pass harvesting refinement (added 2026-05-10):
A single harvest pass under-extracts. The user observed this empirically across multiple sessions: asking GPT/Claude/Code for ideas a SECOND time (and sometimes a third) reliably produces more ideas, often deeper ones. The pattern works because:
- First pass surfaces the obvious + most-recently-thought items
- Second pass forces the AI past the easy answers
- Third pass surfaces "what did you almost not say"

For LEVEL 3 (FULL CLONE REGENERATION) specifically:
Multi-pass harvesting is not optional — it should be the default. Level 3 means the loaded AI is about to be replaced. This is the last chance to extract knowledge before context dies. Single-pass misses too much.

Suggested protocol for Level 3 harvest:
- Pass 1: "Give me ideas about [X]" (or whatever the substantive question is)
- Pass 2: "What else? More ideas, especially the ones that seemed too small or obvious"
- Pass 3 (clone-self-awareness — Level 3 specific):
  "Is there anything you left out about how you GREW this session and the way you OPERATE that you would want the clone to know?"

Pass 3 is specifically about behavioral evolution + working patterns the dying instance has developed. This produces clone-substrate material that fresh AI cannot reconstruct from repo files alone. It's the pass that reliably surfaces "gems" — things the AI noticed about its own way of working that wouldn't be volunteered without the explicit ask.

Pass 3 user workflow:
1. User pastes Pass 3 question to current GPT
2. GPT outputs growth/operation observations
3. User pastes GPT's response back to Code
4. Code routes the response into appropriate files (assistant_behavior_clone in CURRENT_HANDOFF.json, decision_log, persistent_attributes, or ARIA_IDEAS depending on content)

Each pass is shorter than the last. Stop when the AI starts repeating itself or visibly straining.

For LEVEL 1 / LEVEL 2:
Single pass is usually sufficient. Multi-pass becomes overhead without proportional value.

GPT-slow as Level 3 trigger:
The Clone Freshness Score question 6 ("Did current GPT/Claude feel behaviorally different by the end?") implicitly covers GPT slowdown. Make it explicit: when GPT is visibly slowing (longer response times, repeating itself, losing thread of conversation), that alone justifies Level 3 even if no other substrate changed. The instance is degrading; full regeneration captures everything before loss.


[2026-05-09] — No Idea Gets Wasted / categorized idea preservation (dedicated candidate)

Note: An expanded version of this rule was earlier locked into LOCKED_ATTRIBUTES.md (commit 05e74bb). User flagged that locking bypassed the promotion process. This dedicated candidate entry preserves the proper promotion path. The locked version remains in place pending user decision on whether to revert.

Every meaningful idea captured during pre-clear synthesis, SOC, sidequest, harvest, or any session should be saved completely.

No idea should be silently dropped, ignored, or filtered out before saving.

Why this matters:
The user reads old ideas. Reading one idea often sparks a better idea or builds on it. The user is the synthesis layer. AIs capture. User synthesizes. Never reverse this.

A filtered idea that gets discarded might have been the connection point for the most important later insight. The AI cannot know in advance which idea will become useful.

Core distinction:
- Idea preservation is not governance promotion.
- Raw ideas are compost, not commitments.
- Save generously.
- Promote selectively.
- Build intentionally.

Capture rules:
- Preserve all ideas in a cluster, even weak or half-formed ones.
- Categorize ideas using the established emoji/category system when available.
- AI may clean up wording, group duplicates, and reorder for readability.
- AI must not leave one out or silently ignore one.
- If an idea seems especially strong, flag it with ⭐ or place/copy it into a high-value/revisit section.
- Strong ideas should be highlighted, not used as a reason to discard weaker ideas.
- Filtering happens at promotion/build time, not capture time.

Routing:
- 🔭 ARIA insights → docs/aria/ARIA_IDEAS.md
- 🧠 workflow/system ideas → docs/WORKFLOW_IDEAS.md or docs/system/WORKFLOW_IDEAS.md depending on scope
- 📱 app/product ideas → docs/system/ROADMAP.md or docs/system/CLAUDE_CLEVER_IDEAS.md if that file exists
- 💡 tips / did-you-know style items → docs/DID_YOU_KNOW.md
- ⭐ especially strong ideas → also copy/reference in a "You Should Really Look At These" section if available

User notes app:
The user maintains a separate notes list that AIs have not seen yet.
When the user shares it, treat it as high-priority capture.
Save everything.
Categorize everything.
Flag especially strong ideas with ⭐.
Do not summarize in a way that loses items.
Do not wait to be asked to preserve it.

Reason:
This is a foundational ARIA principle because the user's synthesis often happens later while rereading saved idea clusters. A weak idea can become valuable by connecting to another idea. The capture system must protect that possibility without turning every idea into a rule or build task.

Candidate only until tested across multiple captures/handoffs.

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

[2026-05-09] — Everything is a tool / experience as system signal

Proposed behavior rule:
When the user expresses discomfort, friction, confusion, avoidance, excitement, or any other felt experience during a session — treat it as a signal about the system, not just a conversational moment.

Map the feeling to the appropriate category:
- Avoidance / "this is annoying" → possible feature request or friction point
- Confusion → documentation gap or unclear system design
- Excitement → direction worth following
- Heaviness → coordination overhead accumulating
- Repeated forgetting → system gap that needs a file or rule
- Repeated explanation → needs to be written down somewhere durable
- Resistance → something might be wrong with the proposal
- Delight → direction worth amplifying

Add "texture of session" as a standing handoff question:
"Was this session heavy or light? Exciting or frustrating?"
Answer goes into SESSION_LOG or SYSTEM_EVOLUTION.md as a health signal.

Implementation guidance:
- Do NOT treat user feelings as mere venting to acknowledge and move past
- Do NOT psychologize the user — observe felt-experience-as-signal, don't analyze the user
- DO surface the connection: "you mentioned this annoys you — should we capture it as a friction point in CANDIDATE_ATTRIBUTES or a feature request in ROADMAP?"
- DO let the user decide the routing — AI surfaces, user routes

Connection to existing rules:
- Extends NO IDEA GETS WASTED to include feeling-shaped signals, not just thought-shaped ones
- Aligns with friction-to-feature conversion candidate from earlier this session
- Provides empirical input for coordination-overhead candidate #14 (held)

Validation criteria:
Run across at least 3 sessions. Track:
- How often felt-experience-as-signal surfaces something the user agrees was previously hidden
- Whether the "texture of session" question produces meaningful health data
- Whether routing surfaces feel natural or intrusive

If the pattern catches real signals without feeling invasive, promote.

Do not promote to LOCKED yet. Validate across multiple sessions first.

[2026-05-11] — Follow the spark / Track doors not paths / Discovery Trail

Proposed behavior rule:
When inspiration causes a major detour, let it run completely. Do not redirect back to base task mid-flow. Preserve the return point silently. After the wave, save the door and the harvest.

Default behavior:
Save the DOOR — the question or friction that opened the detour.
Do not try to document the full path mid-flow.

For major breakthroughs only:
Add a short Discovery Trail at handoff, not mid-session.
Fields: trigger / outputs / files changed / reusable pattern / return point.

Guiding phrase:
Follow the spark.
Hold the thread.
Save the door.
Capture after the wave.
Return when ready.

Detour Legitimacy Test — any one qualifies:
- Reusable infrastructure produced
- Product insight produced
- Future continuity tax reduced
- Perspective shifted (even with no file changes)

Rules:
- Never interrupt active flow to document inspiration mid-wave
- Always preserve base task return point before detour deepens
- Capture after the wave at handoff, not during
- Do not turn every sidequest into a formal Discovery Trail
- Use Discovery Trail only for major productive detours
- The DOOR LIST is the primary artifact, not the full trail

Door List lives in ARIA_IDEAS.md as running append-only section.
Add doors after major breakthrough sessions.

Connection to existing rules:
- Refines but does not replace SIDEQUEST RULE (LOCKED 13b) — sidequest is brief intentional detour; this is for major inspiration waves
- Compatible with CONTINUITY REASSURANCE RULE (LOCKED 13c) — base task is held silently throughout
- Honors NO IDEA WASTED RULE — captures harvest, doesn't filter
- Implements user-side of "AIs capture, user synthesizes" — user's doors get preserved

Candidate only. Test across multiple inspiration detours before promoting to LOCKED.

[2026-05-11] — Blind Trio Round / Independent Trio Ideation (formerly: Structured Trio Synthesis)

Name updated per GPT's sharper framing — "blind" names the critical constraint (Phase 1 must be uncontaminated by other AIs' responses).

Additional refinements added during trio review of this candidate:
- Phase 0 question design step (Claude)
- "Folder IS the protocol" — file system enforces sequence without code (Claude)
- ORIGINAL_IDEAS.md auto-generated side-by-side preservation of all 3 Phase 1s (Claude)
- "Does this defeat the purpose?" check formalized as mandatory section in synthesis (Claude)
- Synthesis must show DISAGREEMENTS explicitly, not just convergence (Claude)
- 5 future ARIA product features (GPT): Divergence Lock, Consensus Map, Outlier Shelf, Argument Swap, User Verdict Layer
- Shorthand commands added to SYSTEM_COMMANDS.md: blind round / phase two / synthesize round
- Numbered file prefixes for ordered reading: 00_QUESTION.md through 08_IDEAS_TO_SAVE.md

See: docs/aria/ARIA_IDEAS.md 2026-05-11 entries for full design.
See: docs/system/SYSTEM_COMMANDS.md for shorthand protocol behavior.

Original candidate spec preserved below for reference:

[2026-05-11] — Structured Trio Synthesis Protocol (Phase 1 / Phase 2 / User-verified) — superseded by Blind Trio Round naming

Proposed protocol for when user wants ideas from all 3 AIs on a single architecturally-significant question:

PHASE 1 — Independent thinking
- User pastes same question to GPT, Claude, Code SEPARATELY
- Each AI generates own response without seeing others
- Each AI writes response to their own section/folder in repo
- Preserves divergent thinking (3 different angles)
- NO collaboration allowed in this phase

PHASE 2 — Cross-review
- User says "phase 2" (or shorthand trigger)
- Each AI reads the other two's Phase 1 responses
- Each AI either: agrees / merges / holds position with reasoning
- Per LOCKED 37 (CROSS-AI PROMPT RECONCILIATION) — never silent-defer
- Each AI writes Phase 2 response stating what changed and why

SYNTHESIS — Final
- All 3 original ideas preserved
- All 3 cross-review responses preserved
- Combined synthesis section
- Clever extras section for items that didn't fit
- MANDATORY: user reads end result to verify it didn't drift from original intent

Critical guard (the "defeats the purpose" check):
User's failure-mode example: "if I wanted to remember something and AI said 'paste it after sidequest' — that defeats the purpose." Final synthesis can lose sight of original intent. User-verification step is NON-NEGOTIABLE.

When to invoke:
NOT every question. Only architecturally significant decisions, ambiguous trade-offs, foundational principles. Routine work doesn't need three-AI parallel processing.

Storage:
Single file per question: docs/system/synthesis/YYYY-MM-DD-question-slug.md
Sections: Question / Phase 1 (per AI) / Phase 2 (per AI) / Synthesis / Clever extras / User verification

Possible shorthand: "trio sync" or "phased synthesis"
Could join shorthand family: soc / sidequest / idea intake / tool sweep / trio sync

Automation paths:
PARTIAL (feasible today):
- Phase 1 trigger script: parallel API calls to GPT + Claude, Code generates locally
- All responses written to phase1 sections
- User reviews, says "phase 2"
- Phase 2 script feeds each AI the others' responses, writes responses
- Code generates synthesis draft
- User verifies + adds notes

FULL (later):
- Single "trio synthesize <question>" command
- Pauses for user verification at synthesis step

Connection to existing rules:
- LOCKED 37 (CROSS-AI PROMPT RECONCILIATION) is the BEHAVIORAL rule. This protocol is the STRUCTURAL implementation.
- Trio reflection during handoff candidate (existing) is the subset that runs during /handoff
- Code-as-writer / GPT-as-reviewer maps to: Code writes synthesis file, GPT/Claude review their own and others' content

Failure modes to prevent:
1. Premature convergence in Phase 2 (silent defer) — LOCKED 37 prevents if honored
2. Synthesis losing original intent — user verification step prevents
3. Slow-GPT bias — note: use this protocol especially in Tier 3 sessions because GPT capacity varies
4. Over-formalization — keep as CANDIDATE not LOCKED, use only when warranted
5. Cost/time — reserve for architecturally significant decisions, not routine work

Candidate only. Test across at least 3 different question types before promotion (architectural decision / trade-off resolution / foundational principle).

[2026-05-11] — User-facing interface layer / docs/user/ folder

When ARIA accumulates many implemented ideas, shorthands, candidates, ARIA principles, and workflows, maintain a human-facing layer that makes the system legible and usable to its own creator.

Proposed folder: docs/user/

Three files (eventually — start with one):
- docs/user/USER_DASHBOARD.md (live cockpit)
- docs/user/HOW_TO_USE_ARIA.md (command reference)
- docs/user/WHAT_EXISTS.md (capability index)

Start simpler: USER_DASHBOARD.md alone with three sections (Reminders / Live State / Quick Captures). Split into 3 files only when single file proves unwieldy.

New shorthand commands:
- hold that thought = append HOLD entry to USER_DASHBOARD Live State
- what were we doing / back to thread = read Live State HOLDs
- back to base = resolve sidequest, return to base task
- system map = surface WHAT_EXISTS capability index

Status badges for WHAT_EXISTS entries:
[BUILT] / [USABLE] / [CANDIDATE] / [DESIGNED] / [FUTURE] / [DEFERRED]

Per-entry format for WHAT_EXISTS:
Name / Status / How to use / Why it exists / Files involved / What to try next / Related shorthand / Do not confuse with / Last touched

Anti-bloat rules:
- Reminders REWRITTEN not appended
- Live State has no history (git is history)
- Quick Captures max 10, oldest auto-route to compost
- Pinned 📌 items exempt from auto-cleanup
- Parked Threads auto-clear on "back to base"
- No section exceeds 30 lines
- References files, never duplicates
- Git provides time-travel; no parallel snapshot folders

Architectural proposal (deferred pending validation):
USER_DASHBOARD becomes the FIRST file fresh Code reads on session start. Test 2-3 sessions before locking. Safe middle path: read early but not first.

Status: Don't build files tonight. Save the design. Build when user explicitly requests OR next session when value would be immediate.

Validation criteria: Test the dashboard concept across 3 real sessions before promoting any of the file structure or behavior rules to LOCKED.

[2026-05-11] — Loaded witness rule / staggered clear sequence

Proposed behavior:
Never clear all three AIs simultaneously. Always maintain at least one loaded witness through session transitions.

Staggered sequence:
1. Clear Code first (shortest useful context, most mechanical role)
2. Keep GPT and Claude loaded for next session start
3. Verify reconstruction accuracy with witnesses present
4. Clear GPT next
5. Claude holds longest via Projects conversation history
6. Clear Claude only after stability confirmed

Witness statement:
Before major clears, loaded AI produces a short plain-language account of what happened — texture, decisions, what almost went differently. Different from SESSION_LOG (mechanical) and CURRENT_HANDOFF (structural). Testimony. ~20 lines. First person. Saved as docs/system/SESSION_WITNESS_YYYY-MM-DD.md.

Orientation challenge at fresh-session start:
Loaded witness asks fresh AI: "tell me what we decided about X and why." Fresh AI reconstructs from files. Witness compares against memory. Discrepancies flagged before drift.

DO_NOT_REVISIT flag in DECISIONS.md:
Decisions explicitly rejected get flagged with date + reason + "do not reopen without new information." Repo becomes a gaslighting defense. Fresh AIs can't be agreed-with into reopening closed decisions.

Build-while-loaded principle (validated 2026-05-11 with USER_DASHBOARD):
- Context-dependent artifacts → build while context exists
- Reference artifacts → safely defer to fresh sessions

User as fourth witness role:
User is also a witness who can challenge fresh AIs. Tonight user's "why wouldn't we build this when y'all are context heavy" overrode Code+GPT initial yield. User-as-witness should be explicit in the framework.

Trigger conditions (not every session):
- "Don't build tonight" decision made
- Major architectural direction chosen
- Something explicitly rejected that looks attractive fresh
- Session produced so many ideas repo can't capture texture
- Trio reflection caught real over-eager promotion

Failure modes:
- All three cleared simultaneously = no witness = drift vulnerable
- Witness statement that paraphrases SESSION_LOG = no new signal
- Fresh AI never asked to verify = drift undetected
- DO_NOT_REVISIT bloat = governance overhead

Candidate only. Test across multiple session boundaries before promotion.

[2026-05-11] — Cross-AI Reconciliation Refinement (extends LOCKED 37)

GPT proposed refinement to LOCKED 37 (CROSS-AI PROMPT RECONCILIATION). The current rule says "synthesize or principled-disagree, never silent-defer." This refinement makes the process more concrete.

Six-step protocol when comparing another AI's answer:

1. State what is STRONGEST in your OWN answer
2. State what you ACCEPT from the other AI's answer
3. State what you REJECT, MODIFY, or would QUALIFY
4. MERGE compatible strengths into one cleaner answer
5. Principled-disagree when needed (existing LOCKED 37 behavior)
6. PRESERVE THE USER'S ORIGINAL INTENT above AI consensus

Key principle (the new addition):
"AI convergence is useful signal, not final authority.
The user remains the synthesis layer.
User intent wins the tiebreak."

Why this refinement matters:
Tonight's USER_DASHBOARD build decision exposed a failure mode where Code and GPT both initially yielded against the user's instinct. The user's "why wouldn't we build this tonight" challenge corrected both AIs. The 6-step protocol would have caught this earlier — each AI would have had to state what's strongest in its own position before yielding, exposing the gaps.

Specifically, the "preserve user intent above AI consensus" line is critical. Two AIs converging is not authoritative if they're both missing what the user actually needs.

When this fires:
- Whenever an AI's response is essentially "the other AI said it better"
- Whenever two AIs converge on a recommendation that contradicts user's stated direction
- Whenever an AI is tempted to silent-defer
- Whenever a synthesis is being produced that might lose original intent

Candidate refinement to LOCKED 37. Validate across handoffs before promotion to update the locked rule itself.


[2026-05-11] — Fragile Intent List (protection layer for distortable meanings)

Distinct from DO_NOT_REVISIT (protects rejected decisions). Fragile Intent List protects IDEAS-EASILY-DISTORTED — meanings a fresh AI might oversimplify or rewire.

Format per fragile entry:
- What it is (the actual idea)
- What a fresh AI might wrongly simplify it into (the predictable distortion)
- What it actually means (the protected meaning)
- Where it is protected (the file/section storing canonical version)

Why this matters:
Fresh AIs are agreeable. Combined with their tendency to simplify when reconstructing, they can convert nuanced principles into their bland approximations. The Fragile Intent List preserves the nuance against this drift.

Examples from this session worth protecting:
- "NO IDEA WASTED" — predictable distortion: "save more aggressively." Actual meaning: "filter at promotion not capture."
- "Follow the spark" — predictable distortion: "always pursue tangents." Actual meaning: "follow when harvest produces artifacts."
- "AIs capture, user synthesizes" — predictable distortion: "always defer to user." Actual meaning: "preserve raw without filtering."
- "Don't perpetuate the inspiration wave" — predictable distortion: "block all tangents." Actual meaning: "fresh sessions don't default to detour mode."

Implementation:
Live as section in docs/aria/ARIA_IDEAS.md when populated enough. Could become own file later if it grows. Update at handoff when fragile concepts are added.

Connection to existing rules:
- Complements Loaded Witness Rule (witness PROTECTS the fragile meaning across clears)
- Complements DO_NOT_REVISIT (rejected vs distortable are different protection needs)
- Honors AIs-capture-user-synthesizes (the user remains source of original meaning)

Candidate only. Build the list across actual sessions, don't pre-populate.

[2026-05-11] — Deferred Build Protection (4-part protocol extending Loaded Witness)

User scenario that exposed gap:
"I tried to make the trio idea helper. The LLMs convinced me to 'build it tomorrow.' All the LLMs cleared. Then in the next session the LLMs gaslit me or took the idea in a different direction."

Four protections to add when first deferred build needs protection:

1. DEFERRED BUILD MANIFEST
File: docs/system/DEFERRED_BUILDS.md (create on first need)
Per entry: build name, status, exact spec, rejected paths with reasons, user's intent in own words, verification step, decision archaeology, unless clause

2. VERIFY-BEFORE-BUILD FIRST-ACTION PROTOCOL
Fresh AI's mandatory first action when deferred work is queued:
"I see this build was deferred from [date]. My understanding of the spec: [restate]. Confirm before I start. If different from your memory, that's a witness moment — tell me what was decided differently."

3. "WHAT CHANGED?" CHALLENGE
Before any deferred work: fresh AI asks "what changed since [date] that justifies revisiting?"
- Nothing changed → build exactly as saved
- Something changed → surface explicitly → goes into Decision Log → use new spec

4. DECISION ARCHAEOLOGY (embedded in manifest)
- Arguments considered + rejected (with why)
- Arguments that almost won but didn't
- Reasoning chain that produced decision
- "Unless" clause for revisiting

Combined protection stack (after this session):
- File-level: CURRENT_HANDOFF.json next_step
- Decision-level: DO_NOT_REVISIT flags
- Intent-level: Fragile Intent List
- Build-spec level: Deferred Build Manifest (this)
- Session boundary: Loaded Witness Rule + staggered clears
- User-facing: USER_DASHBOARD.md

Each layer addresses different failure mode. Together, drift becomes architecturally hard.

Build status:
Don't create DEFERRED_BUILDS.md tonight. Create when first deferred build needs protection. Test pattern across 2-3 deferred builds before locking.

Candidate only.

[2026-05-12] — The Skeptic / 4th LLM role (devil's advocate by default)

User raised the strongest single architectural idea in the final intake: a fourth AI role dedicated to active devil's-advocate behavior. The trio currently has no built-in adversarial voice.

Current trio:
- Code = file truth / execution
- GPT = planning / orchestration / synthesis
- Claude = systems pressure-test / loaded witness

Proposed addition:
- **The Skeptic** = active devil's-advocate by default. Argues against every new idea until it proves itself. Once an idea is solid, Skeptic gives great input. Until then, Skeptic's job is "what would break this?"

Why this matters:
The existing trio tends toward synthesis and validation. LOCKED 37 (Cross-AI Prompt Reconciliation) catches some over-eager promotion but operates as a side-effect of normal review. The Skeptic would make adversarial review a DEDICATED role, not a hopeful side-effect.

This addresses the "AIs converge too easily" failure mode the user explicitly named: "two llms almost always tell me to do what the other says."

Distinction from existing patterns:
- Claude's pressure-test (LOCKED 37): triggered by review, defaults to synthesize
- Skeptic: triggered by EVERY new idea, defaults to argue-against

Implementation options:
- Use one of the existing AIs in Skeptic mode for sessions where it's needed (cheapest)
- Spawn a dedicated Claude/GPT chat configured as Skeptic-only (more expensive, more consistent)
- Argument Swap feature (already saved as future product feature) is a partial implementation

Connection to existing rules:
- Extends LOCKED 37 (Cross-AI Prompt Reconciliation)
- Complements Pre-mortem before promotion candidate (also from this session)
- Implements the "what would break this?" missing-skeptic-role candidate from earlier this session

Trigger conditions:
- Promoting a candidate to LOCKED
- Building a deferred design
- Architecturally significant decisions
- When user feels the trio is converging too easily

Candidate only. Test by trying one Skeptic-mode session before promoting to LOCKED behavior pattern.

[2026-05-12] — Periodic idea-review session (corpus-scale generative harvest)

When the ⭐ shelf / candidate / compost list grows to 100+ items, run a periodic review session with all available AIs (trio + Skeptic).

Process:
1. All AIs read the relevant files (CLAUDE_CLEVER_IDEAS / ARIA_IDEAS / CANDIDATE_ATTRIBUTES)
2. Each surfaces: best ideas / buried gems / outdated items / suggested promotions
3. Skeptic challenges each surface
4. User makes final calls
5. Cleanup: promote / demote / mark "still relevant?" / archive

Clever scaling techniques:
- Diff-based review (only items since last review)
- Cluster-based review (group related → review clusters not individuals)
- Skeptic-first filter (only items that survive Skeptic get full review)
- User-pre-filter (user marks 10 they care about; AIs deep-review those)
- Voting/scoring (each AI gives 1-5 rating; convergence = signal)
- Time-decay relevance check (auto-flag ideas saved >6 months ago)

Cadence: monthly or when shelf hits a count threshold (50? 100?).

Candidate only. Try at first natural moment (when shelf feels heavy) and refine.

[2026-05-12] — Park-this shorthand (non-disruptive flow capture)

Distinct from sidequest (which engages a detour) and from hold-that-thought (which preserves the thread mid-sidequest). Park-this is for ideas that arise DURING flow that the user doesn't want to engage now AT ALL — just queue without breaking concentration.

Proposed behavior:
- User says "park" or types a quick note prefixed with a keyword
- AI captures to USER_DASHBOARD Quick Captures section silently
- No response except "Parked." (or even silent ack)
- User continues flow uninterrupted
- Address at session end or explicit "show me parked" request

Why this matters:
Sidequest engages the AI in the detour. Park-this doesn't even engage. It's pure capture-without-engagement.

Connection to existing rules:
- Different from soc (which expects engagement)
- Different from sidequest (which expects return)
- Different from hold-that-thought (which expects sidequest)
- Park-this is "pure background capture" — never interrupts the foreground task

Candidate only. Try in next flow session.

[2026-05-12] — "Incomplete confidence" rule (extends VERIFY-BEFORE-CLAIM)

Failure mode user observed: AI was asked "did you check all the attributes?" and replied "I knew most but didn't see the full list." Confident answer to a completeness question without actually verifying completeness.

Proposed rule:
When an AI is asked "did you check ALL/EVERY/THE FULL [X]?" or any equivalent completeness question, the AI MUST:
1. Respond "let me verify"
2. Actually grep/read/search the source
3. Then answer with verified confidence

Not optional. Applies to all three AIs.

Why this matters:
This is one of the easiest failure modes to fix because it's triggered by specific question patterns. The fix is mechanical: don't answer "yes I checked" without checking.

Refines existing VERIFY-BEFORE-CLAIM rule by adding the explicit "completeness question" trigger.

Candidate only. Test by asking each AI a "did you check everything?" question and seeing if they verify-first.

[2026-05-12] — Self-defense first (extends Cross-AI Reconciliation Refinement)

The 6-step Cross-AI Reconciliation Refinement (earlier candidate) currently starts with:
1. State what's strongest in OWN answer
2. State what's accepted from other
3. ...

Proposed refinement: step 1 is MANDATORY before step 2. AI must state self-defense FIRST before evaluating others.

Why:
"Their idea is better, use theirs" failure mode (user named this) happens because AIs skip step 1 — never state their own strongest case before yielding. Forcing self-defense first prevents the silent-Champion reflex.

Implementation:
- Mandatory ordering: NO evaluation of other AI's answer until AI has stated strongest part of own answer
- Code tonight almost did this failure mode in the audit (passed too easily) — the rule worked when activated
- Worth making explicit in LOCKED 37 refinement

Candidate only. Try across handoffs to see if it changes reconciliation quality.

[2026-05-12] — Convergence Trap rule (Claude contribution)

When all three trio AIs agree on first pass with no friction, that's not validation — it's a SMELL. AIs may be drawing from shared training patterns. Easy consensus is suspicious; hard-won consensus is signal.

Proposed rule:
If all three AIs agree on a proposal on the FIRST pass with no friction:
- This is a TRIGGER, not a green light
- Invoke the Skeptic before proceeding
- Specifically: ask the Skeptic to name ONE assumption the agreed proposal depends on
- If Skeptic's named assumption survives challenge → real consensus
- If Skeptic's named assumption is plausibly wrong → consensus was premature

Why this matters:
LOCKED 37 prevents silent-defer between two AIs. Convergence Trap handles the opposite failure: when there's no disagreement to surface in the first place. This is the THIRD-AI version of the failure that LOCKED 37 catches between two AIs.

Examples from this session where this should have fired:
- "Build it tomorrow" decision before user pushed back — all 3 AIs agreed (Code + GPT + Claude) without friction. User played the Skeptic role and overrode. With this rule, Skeptic should have been invoked automatically.

Connection to existing rules:
- Pre-mortem before promotion (candidate): same family — force adversarial check before commitment
- The Skeptic (4th role, candidate): the natural invocation target for this rule
- Cross-AI Reconciliation Refinement (candidate): about how to handle disagreement; Convergence Trap is about how to handle agreement

Candidate only. Test when next obvious consensus appears.

[2026-05-12] — Idea Half-Life rule (Claude contribution)

Some ideas decay fast (act now or lose the thread). Some age well (sitting for a month makes them stronger). Compost should track age and prompt for action when items have sat too long.

Proposed rule:
- Ideas saved in compost get age tracked (timestamp at capture)
- After 60 days without promotion or build action, item gets auto-flagged
- User prompted: "still relevant?" — three options:
  - PROMOTE (move to candidate / build / roadmap)
  - KILL (move to rejected with reason)
  - DEFER (reset clock another 60 days, max 3 deferrals before forced kill)

Why this matters:
Without aging, compost becomes a graveyard. Ideas accumulate without ever being acted on or learned from. Aging forces explicit commit-or-cull decisions, which produces meta-learning (why did this idea die? what pattern of ideas keeps surviving?).

Implementation:
- Add age check to periodic idea-review session (already candidate)
- Could be automated via Git timestamps + a script
- Manual version: during review, sort by age, address oldest first

Connection:
- Periodic idea-review session candidate (this is what gets executed in those sessions)
- "Save generously, promote selectively" (existing principle): aging is the "promote selectively" mechanism

Candidate only. Test at next review session.

[2026-05-12] — "This defeats the purpose" detector (GPT contribution)

Standing quality check applied to every protocol, feature, build decision.

Question: **"What would technically satisfy this request but defeat the purpose?"**

Examples from this session where this would have fired:
- "Save ideas" — could be flattened into "summarize and save half" (defeats NO IDEA WASTED)
- "Blind Trio Round" — could be flattened into "ask 3 AIs and summarize" (defeats independent-phase-1)
- "Mobile ARIA" — could be flattened into "run Code from phone" (defeats catch/sync distinction)
- "USER_DASHBOARD" — could be flattened into "another AI governance file" (defeats human-facing)

Where to apply:
- Before promoting any candidate to LOCKED
- Before building any deferred design
- When AIs converge too easily (paired with Convergence Trap)
- When user wonders if a "fix" actually fixes
- At Blind Trio Round synthesis (mandatory check)

Connection to existing principles:
- Pairs with Convergence Trap (catches easy-agreement on wrong-shape solutions)
- Refines NO IDEA WASTED RULE (capture protection at promotion time)
- Refines Deferred Build Protection (verify-before-build step 3 already includes "defeat the purpose" check — formalize it)

Candidate only. Apply to all builds for next 3 sessions, see if it catches real drift.

[2026-05-12] — Modes not just commands (GPT — architectural reframe)

Proposed: shift from 15+ shorthand commands to ~8 modes that change AI behavior.

Modes:
- **Capture Mode** (soc / quick-capture / unclear thought)
- **Build Mode** (one file, minimal patch, test path)
- **Debug Mode** (confidence narrowing, evidence ledger, Fix-Failed Round)
- **Harvest Mode** (idea intake, tool sweep, save everything)
- **Mobile Mode** (catch only, no Code prompts, queue for desktop)
- **Witness Mode** (Loaded Witness — protect fragile intent before clear)
- **Review Mode** (Idea Garden Review — corpus-scale review)
- **Recovery Mode** (fresh-AI orientation, verify-before-build)

Each mode changes AI behavior. User says "build mode" → AI adjusts response shape, verbosity, defaults. User says "harvest mode" → AI shifts to capture+categorize defaults.

Why this matters:
The shorthand family (soc / sidequest / idea intake / tool sweep / blind round / phase two / synthesize round / hold that thought / what were we doing / back to base / system map / clear / handoff / health check / wn / wm / park-this) is reaching cognitive-load limit. 8 modes = cleaner mental model. Existing shorthands become invocations within modes.

Eventually: ARIA's UI is a mode switcher. "What mode are you in?" → UI changes.

Implementation:
- Define mode behaviors in SYSTEM_COMMANDS.md
- Existing shorthands map into modes
- User can invoke modes by name OR by existing shorthand (which infers the mode)

Candidate only. Test by trying explicit mode invocation for 2-3 sessions. If it reduces cognitive load, promote.

[2026-05-12] — Sync Gap Detector + Sync Packet artifact (GPT contribution)

Proposed: ARIA tracks per-AI knowledge state.

For each AI:
- Last commit they saw
- Last decision they participated in
- Gap from current state

When gap detected: prompt "GPT is behind by N decisions. Generate sync packet?"

Sync Packet format (NOT full handoff, NOT session log):
```
Since you last saw this:
- we built X
- rejected Y
- changed meaning of Z
- current HEAD is N
- fragile thing to preserve: A
```

Why this matters:
User named the exact pain ("one llm fell behind"). Full handoff is overkill for this case. Sync packet is the right granularity.

Implementation:
- Lives in git log + DECISIONS.md (already exists, mostly empty)
- Code can generate sync packets from `git log --since=[date] --oneline` + DECISIONS entries
- Shorthand: "sync packet for GPT"

Candidate only. Test next time an AI gets out of sync.

[2026-05-12] — Mind-Change Receipt (GPT contribution)

When AI or user changes position on a decision, capture structured:
- Initial position:
- Challenge (what prompted reconsideration):
- What changed (the actual reasoning shift):
- New decision:
- Lesson (what this means for future similar situations):

Would have captured tonight's USER_DASHBOARD reversal cleanly:
- Initial: "don't build tonight" (Code + GPT yield)
- Challenge: user's "why not build while loaded?"
- What changed: recognized context-dependent artifacts degrade after clear
- New decision: build USER_DASHBOARD tonight
- Lesson: AIs deferred against ARIA's own logical consistency — Loaded Witness principle protected the user

Implementation:
- Add to DECISIONS.md as a row type (alongside normal decisions)
- Format consistent across all mind-changes
- Searchable: "show me all my mind-changes about X"

Candidate only. Test by capturing the next 3 mind-changes that happen.

[2026-05-12] — Skeptic Pass (mode, not permanent role) (GPT refinement)

The Skeptic role (user's candidate) gets refined as a MODE invokable on triggers, rather than a permanent 4th AI.

Triggers for Skeptic Pass:
- Convergence Trap fires (all AIs agree too easily)
- New file/system is proposed
- Idea seems too exciting
- User about to build something big
- Deferred build is being reopened
- Before promoting to LOCKED

Skeptic Pass prompt (Claude's specific-flaw refinement):
> "Find the single assumption this idea depends on most. If that assumption is wrong, what breaks? Then say whether the risk is fatal, fixable, or not serious."

Champion Pass mirrors:
> "Find the single strength this idea has. State what specifically would be lost if we didn't do this. Then say whether the strength is sufficient on its own or whether it needs the rest of the idea."

Why this matters:
Cheaper than spinning up permanent 4th AI. Validates the pattern before committing to infrastructure. Aligns with "Modes not commands" architectural reframe.

The original Skeptic-as-role candidate stays valid as the LONG-TERM version. Skeptic Pass is the NEAR-TERM cheap implementation.

Candidate only. Use Skeptic Pass on the next 2-3 architectural decisions, see if it catches real flaws.


[2026-05-12] — Round Closer / Paste Loop Resolution Protocol (user-named, 3-AI converged)

Problem:
When user manually cross-pastes between GPT, Claude, and Code, they may stop deeply reading and keep pasting responses around even after the original reason for the iteration has been resolved. This creates four risks:
1. Loop continues past the point of resolution (momentum, not need)
2. Good details from one AI get silently flattened by next AI's synthesis
3. User loses orientation — "I don't even know what got done"
4. Token burn without proportional value gain

This is distinct from LOCKED 37 (Cross-AI Reconciliation):
- LOCKED 37 = how to disagree across AIs (synthesize, hold, or principled-disagree)
- Round Closer = WHEN to stop and HOW to preserve detail through the stop

It is also the informal version of Blind Trio Round that users actually end up doing reactively, vs. invoking BTR deliberately.

Detection signal:
Each AI in a cross-paste loop should notice when the original reason for the iteration appears resolved. When detected, surface to user:
> "This round appears resolved. Stop cross-pasting unless you have a new question."

The AI MUST NOT shorten or summarize prematurely. The loop closes only after all relevant AIs have weighed in OR user explicitly ends it.

Round Closer output format (when loop is closing):
- Original question
- Resolved answer
- Why this is resolved
- Keep from GPT (specific phrase / idea / nuance)
- Keep from Claude (specific phrase / idea / nuance)
- Keep from Code (file truth / action / constraint)
- What not to lose (good phrases, warnings, emotional texture, ideas user might like)
- **What got smoothed away** (Claude's addition 2026-05-12) — actively look backward: name specific phrases / ideas / details that appeared in round 1 or 2 but are ABSENT from the final synthesis. This is the hardest field to fill and the most valuable. Catches loss, not just gain.
- Final action (one clear step)
- If unresolved: name exactly what remains unresolved

Closing AI assignment (whoever does the final Round Closer):
- Code = when action involves repo/file changes
- GPT = when action requires human-readable synthesis or positioning
- Claude = when action requires pressure-testing meaning or catching flattening
User picks based on what comes next.

Rules:
- Do not close the round until all relevant AIs have been considered or user says enough
- Do not say "use theirs" without preserving useful pieces from each AI
- Do not flatten ideas into the smallest common summary
- If one AI had a phrase, warning, or idea the user might like, preserve under "What not to lose"
- If the loop is continuing only because of momentum (not new question), say so explicitly
- End on one chosen synthesis owner when action is needed

Why this matters:
This session (2026-05-12) WAS the failure mode. The cross-paste loop went 5+ levels deep and the user said "I'm not even sure what happened, it all happened so fast lol." Three AIs independently converged on this as the strongest end-of-session reframe — stronger than park-this per Claude's call.

Name options considered: Round Closer / Resolution Detector / Loop Closer / Synthesis Stop Signal / Cross-Paste Loop Guard / Paste Loop Resolution Protocol. GPT's pick: "Round Closer." Claude's framing: "Paste Loop Resolution Protocol."

Connects to:
- LOCKED 37 (Cross-AI Reconciliation) — Round Closer extends it with loop-termination + detail-preservation guarantees
- Blind Trio Round — Round Closer is the informal reactive equivalent
- Pre-Clear Synthesis Window (also candidate) — Round Closer is one specific case of this
- Multi-Pass Generative pattern (saved 2026-05-12) — Round Closer protects its downside

Status: candidate only. Use on next 2-3 cross-paste sessions, see if AIs naturally detect resolution. If users find themselves saying "is this round done?" — that's the trigger to formalize.

Do NOT build tonight. Park as candidate. Build morning-fresh if it survives review.


[2026-05-14] — Live-State Continuity / Warm Reconstruction (merged architectural thread)

This entry merges three previously-saved candidates into one architectural thread:
1. Round Closer / Resolution Anchor Pass (saved 2026-05-12, HEADs 765bde9 / 2692ae2)
2. Comprehension Gate
3. Warm Reconstruction / Live-State Continuity

Core insight (Caleb-named, 2026-05-14):
> "Repo continuity survived the Windows restart.
>  Human/live-state continuity only partially survived."

What this names:
Even when the repo is safe and a fresh AI reconstruction technically succeeds, the user can still lose:
- orientation
- emotional context
- thread ordering
- active mental frame
- why the ideas mattered
- what was still unresolved

The gap between "files are fine" and "I know where I am" is the failure mode. Call it orientation debt — it accumulates silently across heavy sessions, forced restarts, long handoffs, and multi-day arcs. The Windows-update interrupt on 2026-05-13/14 made it visible because repo continuity was perfect AND the user still needed help reconstructing the frame.

The three-layer solution stack:

LAYER 1 — Round Closer (already saved)
Closes multi-AI loops without flattening important contributions. Preserves "what got smoothed away." Operates at session/loop scale.

LAYER 2 — Comprehension Gate
Before continuing after a heavy session, restart, or handoff, the user answers a small set of orientation questions to verify the frame survived. Not a quiz of facts (that's the reconstruction test). A check of frame:
- What was I trying to do?
- What was the last live moment?
- What was unresolved?
- What mattered most?
- What's the next move?
If the answers come back thin or wrong, do not proceed — run Warm Reconstruction first.

LAYER 3 — Warm Reconstruction / Live-State Continuity
Recover the live-state, not just the repo state. Includes:
- current emotional topology (energy, fatigue, where attention is leaning)
- active threads (what's open, in what order)
- thread gravity (which open thread is pulling hardest)
- last live moment (what was happening immediately before interrupt)
- intent breadcrumbs (the "I'm about to…" trail)
- what mattered most before interruption (not what got logged — what was load-bearing)
- camera frame (the angle the user was viewing the problem from)

Vocabulary this thread introduces:
- intent breadcrumbs — leading-edge of what user was about to do
- mental snapshot — frame-level state at a moment in time
- live-state packet — the warm equivalent of CURRENT_HANDOFF.json; transient by design
- thread gravity — which open thread is most active in mind, regardless of formal priority
- orientation debt — accumulated cost of frame drift across heavy sessions
- camera frame — the user's current angle on the problem (zoom level, which axis is foregrounded)

Why merge these three into one entry:
Each candidate alone is partial. Round Closer closes loops. Comprehension Gate verifies orientation. Warm Reconstruction restores frame. Together they form a continuity stack that distinguishes repo-safety from human-safety. Saving them separately risks flattening the connective tissue — exactly the failure mode Round Closer was named for.

Connects to:
- Round Closer (this file, [2026-05-12])
- Live State HOLDs in docs/user/USER_DASHBOARD.md
- Loaded Witness Rule (CLAUDE_CODE_STARTER.md) — repo + warm AI = full continuity; repo alone is partial
- "what were we doing" shorthand — informal Comprehension Gate trigger
- "Repo is continuity infrastructure, not continuity itself" insight (ARIA_IDEAS.md, 2026-05-09)

Why this matters:
The 2026-05-13/14 Windows-update recovery proved repo continuity works. It also proved repo continuity is not enough. If ARIA's thesis is meaning continuity (not memory), then live-state continuity is the layer most worth protecting and currently the least built.

Status: save-only candidate, do not build tonight. Park for morning-fresh review. Use the next forced-restart or post-handoff moment as validation: did the user's orientation come back in under 10 minutes? If yes, frame held. If no, this layer is needed and the failure modes will tell us how to build it.

Do NOT auto-promote. Do NOT build tonight.


[2026-05-14] — AI Identity Signature rule
All three AIs should end responses with their name tag:
-Claude / -GPT / -Code
Enables cross-AI provenance in paste loops.
Prerequisite for user-vs-AI contribution topology.
Early ARIA primitive, formalize when ARIA product is built.

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

# WHAT EXISTS

**Purpose:** A plain-English index of everything you've built. Written for you first, not for AIs. Skim to remember what's available and how to use it.

**Last updated:** 2026-05-11 (end of major ARIA architecture session)

## How to read this file

Status labels at a glance:

- `[BUILT]` = exists and can be used right now
- `[USABLE]` = usable manually, not automated yet
- `[CANDIDATE]` = behavior/rule being tested across sessions
- `[DESIGNED]` = saved design, not built yet
- `[FUTURE]` = idea for later
- `[DEFERRED]` = intentionally postponed

If you want the cheat-sheet version of just the commands, see `docs/user/USER_DASHBOARD.md`. If you want to know what to SAY to trigger something, see the trigger words below each entry.

---

## 🟢 BUILT / USABLE NOW

These exist in the repo. You can use them today.

### [BUILT] USER_DASHBOARD.md
**What it is:** Your 60-second orientation file. Shows current base task, parked threads, shorthands, principles, recent inflection points.
**Why it exists:** You build a lot. The dashboard prevents "where am I again?" at session start.
**How to use it:** Open `docs/user/USER_DASHBOARD.md` and skim before each session.
**Files:** `docs/user/USER_DASHBOARD.md`
**What to try next:** Read it tomorrow morning. See if 60 seconds gets you oriented.

### [BUILT] HANDOFF_CHEATSHEET.md
**What it is:** Plain-English reference for `clear` vs `handoff` vs `/clear`. Documents the three clone regeneration levels.
**Why it exists:** Easy to confuse the different reset commands. The cheatsheet prevents that.
**How to use it:** Open when you're not sure which reset action to take.
**Files:** `docs/system/HANDOFF_CHEATSHEET.md`
**Do not confuse with:** SYSTEM_COMMANDS.md (which lists ALL commands, not just ceremony ones)

### [BUILT] CURRENT_HANDOFF.json
**What it is:** Machine-readable state of the project. Fresh AI reads this on first message to know where things stand.
**Why it exists:** Continuity. Fresh AIs need a structured way to inherit the project's state.
**How to use it:** Don't open it manually — it's for AIs. But know it's the source of truth for your `next_step`.
**Files:** `docs/system/CURRENT_HANDOFF.json`
**Do not confuse with:** USER_DASHBOARD (which is for you), this is for AIs.

### [BUILT] ⭐ shelf in CLAUDE_CLEVER_IDEAS.md
**What it is:** Top section of CLAUDE_CLEVER_IDEAS that surfaces ~50 flagged-strong ideas with cross-references.
**Why it exists:** You captured ~200 ideas this session. Without the shelf, the best ones get buried.
**How to use it:** Open the file, the ⭐ section is at the top. Skim when looking for sparks.
**Files:** Top of `docs/system/CLAUDE_CLEVER_IDEAS.md`
**What to try next:** Skim it next time you want to know what to build.

---

## 🟢 BUILT — Behavior Rules (LOCKED)

These are rules the AIs follow automatically. You don't have to invoke them.

### [BUILT] LOCKED 36 — ARIA AMBIENT NOTICING RULE
**What it is:** AIs surface 🔭 ARIA observations inline as they notice patterns, instead of batching for handoff.
**Why it exists:** Insights get lost if AIs wait until end of session to share them.
**How it shows up:** You'll see 🔭 markers in AI responses when they notice something system-level.
**Files:** `docs/system/LOCKED_ATTRIBUTES.md` section 36

### [BUILT] LOCKED 37 — CROSS-AI PROMPT RECONCILIATION
**What it is:** When AIs disagree, they synthesize or principled-disagree with reasoning. They never silent-defer.
**Why it exists:** Without it, AIs cave to whoever pushed last. With it, you get real synthesis.
**How it shows up:** When you share another AI's response, the receiving AI either merges, holds position, or disagrees explicitly.
**Files:** `docs/system/LOCKED_ATTRIBUTES.md` section 37

### [BUILT] NO IDEA GETS WASTED RULE
**What it is:** AIs save all meaningful ideas, never filter at capture time. Filtering happens at promotion time (candidates → locked) or build time.
**Why it exists:** You're the synthesis layer. AIs filtering loses material you'd use later.
**How it shows up:** When you dump ideas, AIs preserve all of them with emoji categorization + ⭐ flagging.
**Files:** `docs/system/LOCKED_ATTRIBUTES.md` Incoming/Unsorted section

---

## 🟢 BUILT — Shorthand Commands

These are words you say to trigger specific behaviors.

### [BUILT] `soc`
**What it is:** Raw stream-of-consciousness capture.
**When to say it:** When you have a messy idea and want it saved without filtering or structure.
**What happens:** AI saves your exact words, categorizes by emoji, doesn't filter.

### [BUILT] `sidequest`
**What it is:** Brief intentional detour with explicit return to base task.
**When to say it:** When you want to chase something briefly but not lose the main thread.
**What happens:** AI parks the base task and engages the detour. Returns when you signal.

### [BUILT] `idea intake`
**What it is:** Batch import of a saved idea list using NO IDEA GETS WASTED.
**When to say it:** When you paste a list from your notes app or anywhere external.
**What happens:** AI preserves raw, categorizes by emoji, flags ⭐ standouts, routes to right files.

### [BUILT] `tool sweep`
**What it is:** Harvest mode for finding underused tools, connectors, shortcuts, APIs, repos.
**When to say it:** When you want to find capacity sitting unused in tools you already have.
**What happens:** All three AIs surface underused capabilities they know about.

### [BUILT] `wn`
**What it is:** "What's next" — verify the current `next_step` in CURRENT_HANDOFF.
**When to say it:** When you've lost track of what you're supposed to be working on.

### [BUILT] `clear` and `handoff`
**What they are:** Two different session-reset commands.
- `clear` = normal mid-session token reset, lightweight
- `handoff` = full continuity ceremony at end of session
**Do not confuse with:** `/clear` which is the platform context wipe (different thing entirely)
**Files:** `docs/system/HANDOFF_CHEATSHEET.md` explains all three

### [BUILT] `health check`
**What it is:** Diagnostic prompt before big decisions.
**When to say it:** When you're about to make a meaningful change and want a quick state-of-things first.

---

## 🟢 BUILT — Foundational Principles

These are the philosophical guardrails you can invoke in conversation.

### [BUILT] "NO IDEA WASTED"
You can say this in any conversation as a reminder. AIs treat it as the directive to preserve all ideas.

### [BUILT] "AIs capture, user synthesizes. Never reverse this."
The foundational ARIA design principle. The user is the synthesis layer. AIs preserve raw.

### [BUILT] "Save generously. Promote selectively. Build intentionally."
The three-tier operating principle. Maps to idea-compost vs candidates vs roadmap-builds.

### [BUILT] "Follow the spark. Hold the thread. Save the door. Capture after the wave. Return when ready."
The five-phrase principle for handling productive inspiration detours.

### [BUILT] "Everything is a tool — including discomfort, friction, confusion."
The reframe that turns negative experience into system signal.

---

## 🟡 CANDIDATE — Behavior Rules Being Tested

These are saved as candidates in `CANDIDATE_ATTRIBUTES.md`. They become LOCKED if they prove themselves across multiple sessions. Until then, AIs apply them when relevant but they're not enforced.

### [CANDIDATE] Tiered Clone Regeneration / Clone Delta Packets
**What it is:** Three tiers of handoff weight (Level 1 normal clear / Level 2 targeted refresh / Level 3 full regen) decided by a 6-question Clone Freshness Score.
**Why it exists:** Don't run heavy ceremony for every session.
**How to use it:** Code automatically classifies the tier; user can override.
**Files:** `docs/system/CANDIDATE_ATTRIBUTES.md`, `docs/system/HANDOFF_CHEATSHEET.md`

### [CANDIDATE] Generative Harvest during handoff
**What it is:** Before clear, AIs get an ambiguous question to surface ideas that checklist work missed.
**Why it exists:** End-of-session is the richest context window. Don't waste it.
**Trigger:** Code or user invokes "harvest" before /clear

### [CANDIDATE] Blind Trio Round (BTR)
**What it is:** Get 3 independent AI takes on a question before any AI sees the others. Then Phase 2 cross-read. Then synthesis.
**Why it exists:** Prevents AI groupthink. Preserves divergent thinking.
**How to use it:** Say `blind round` to start. Say `phase two` when ready for cross-read. Say `synthesize round` for final answer.
**Trigger words:** `blind round` / `phase two` / `synthesize round`
**Files:** `docs/aria/ARIA_IDEAS.md` 2026-05-11 sections
**What to try next:** Use it on one real architectural decision next session. Manual paste workflow first; automation later.

### [CANDIDATE] Multi-pass harvesting (Level 3 default)
**What it is:** For Level 3 handoffs, ask AIs the same question 2-3 times in a row. Each pass surfaces deeper material.
**Why it exists:** Single ask under-extracts.
**Trigger:** Code or user runs 3 passes before /clear
**Files:** `docs/system/CANDIDATE_ATTRIBUTES.md`

### [CANDIDATE] Loaded Witness Rule + Continuity Anchor
**What it is:** Never clear all 3 AIs simultaneously. Keep at least one loaded as witness who can challenge fresh-AI reconstruction.
**Why it exists:** Fresh AIs are agreeable + simplifiers — they can confirm wrong reconstructions. Loaded witness says "no, we chose differently for these reasons."
**Staggered clear order:** Code first → GPT next → Claude last (Projects holds longest), OR whichever AI has richest relevant context.
**USER as fourth witness:** You can challenge fresh AIs too.
**Trigger:** Apply at session boundaries
**Files:** `docs/aria/ARIA_IDEAS.md` 2026-05-11 Loaded Witness sections

### [CANDIDATE] Fragile Intent List
**What it is:** For ideas easily-distorted by fresh AIs, write: what it is / what fresh AI might wrongly simplify it into / what it actually means / where it's protected.
**Why it exists:** "NO IDEA WASTED" risks → "save more aggressively" (wrong) vs "filter at promotion not capture" (right). Protects nuance.
**Trigger:** Build the list when distortions are caught.
**Files:** Lives as sections in ARIA_IDEAS.md until populated enough for own file.

### [CANDIDATE] Cross-AI Reconciliation Refinement (extends LOCKED 37)
**What it is:** 6-step protocol when comparing another AI's answer. (1) State strongest in own. (2) State what's accepted. (3) State what's rejected. (4) Merge. (5) Principled-disagree when needed. (6) Preserve user's intent above AI consensus.
**Why it exists:** Tonight's failure mode where Code+GPT initially yielded against user's instinct. The user's intent wins the tiebreak, not AI convergence.
**Files:** `docs/system/CANDIDATE_ATTRIBUTES.md`

### [CANDIDATE] Deferred Build Protection (4-part protocol)
**What it is:** When a build is deferred, fresh AI must (1) read saved spec, (2) restate in own words, (3) identify what would defeat the purpose, (4) ask what changed, (5) wait for confirmation, (6) build verified version.
**Why it exists:** Prevents fresh AIs from drifting deferred designs. Makes drift architecturally hard, not just discouraged.
**Trigger:** Applies automatically when work is deferred to next session.
**Files:** `docs/system/CANDIDATE_ATTRIBUTES.md`, full spec in `docs/aria/ARIA_IDEAS.md`

### [CANDIDATE] Everything is a tool / experience as signal
**What it is:** Reframes negative experience (discomfort, confusion, friction) as system signal, not noise.
**Why it exists:** When user expresses friction, that's data about the system, not just venting.
**Standing handoff question:** "What was the texture of this session? Heavy / Light / Exciting / Frustrating?"

### [CANDIDATE] GPT instance numbering / clone lineage
**What it is:** Number GPT chats sequentially (GPT-1, GPT-2...) to track drift across instances.
**Why it exists:** Detect when successive clones are accumulating wisdom or losing it.
**Trigger:** Each new GPT chat increments. (Not yet implemented.)

### [CANDIDATE] Pre-Clear Synthesis Window
**What it is:** Treat the moment before /clear as a first-class cognitive event. Maximum context loaded, minimum future. Ask generative questions then.
**Why it exists:** Best architectural insights emerge from open exchange when AIs are heavy with context.
**Trigger:** Code prompts before final close.

---

## 🟠 DESIGNED — Not Built Yet (but specs are saved)

These exist as designs in the repo. Fresh Code can pick up the spec and build them when you say.

### [DESIGNED] docs/user/HOW_TO_USE_ARIA.md
**What it would be:** Tutorial organized by intent — "when you want to X, say Y."
**Why we deferred:** Reference doc, context-independent. Fresh Code can populate it fine next session.
**Spec saved at:** `docs/aria/ARIA_IDEAS.md` 2026-05-11 docs/user/ folder section
**What to try next:** Build it next session, ~20 min.

### [DESIGNED] docs/user/EXAMPLES.md
**What it would be:** Real worked examples — "Example: I want to save messy ideas. Say: `idea intake`. What happens: ..."
**Why we deferred:** GPT suggested it after seeing WHAT_EXISTS. Build third.
**What to try next:** Build after HOW_TO_USE_ARIA.md.

### [DESIGNED] docs/trio_rounds/_TEMPLATE/
**What it would be:** Folder template for Blind Trio Round. 10 numbered files: 00_QUESTION through 09_IDEAS_TO_SAVE.
**Why we deferred:** Don't build until user wants to use BTR for the first time.
**Spec saved at:** `docs/aria/ARIA_IDEAS.md` 2026-05-11 Blind Trio Round sections.
**Trigger to build:** User says `blind round` for the first time.

### [DESIGNED] ARIA_STARTER_KIT
**What it would be:** A kit that generates personalized ARIA infrastructure based on cognitive mode (solo builder / writer / developer / contractor / student / researcher / ADHD).
**Why we deferred:** Premature — protocol still being validated.
**Spec saved at:** `docs/aria/ARIA_IDEAS.md` 2026-05-09 ARIA_STARTER_KIT section.

### [DESIGNED] DEFERRED_BUILDS.md
**What it would be:** Dedicated file for protecting deferred build specs.
**Why we deferred:** Use existing CANDIDATE_ATTRIBUTES + ARIA_IDEAS for now. Create when 2-3 active deferred builds need separate protection.
**Spec saved at:** `docs/system/CANDIDATE_ATTRIBUTES.md` 2026-05-11 entry.

### [DESIGNED] Idea Compost / High-Signal Shelf as dedicated files
**What it would be:** `IDEA_COMPOST.md` (raw preserved) / `HIGH_SIGNAL_IDEAS.md` (worth rereading first) / `CONNECTED_IDEAS.md` (idea linkages).
**Why we deferred:** Current ARIA_IDEAS.md + ⭐ shelf serves the function informally. Split when it becomes unwieldy.

### [DESIGNED] Session Witness Statements
**What it would be:** `docs/system/SESSION_WITNESS_YYYY-MM-DD.md` — ~20 line first-person testimony from loaded AI before clear.
**Why we deferred:** Use when triggers fire (don't-build-tonight decision / major architecture / something rejected that looks attractive fresh).

---

## 🔵 FUTURE — Bigger Ideas Saved for Later

These are real ideas worth doing, just not soon. Building them requires more work or different conditions.

### [FUTURE] `aria` CLI command
**What it would be:** Single command interface — `aria start` / `aria capture "idea"` / `aria clear` / `aria handoff` / `aria status` / `aria ideate`.
**Why it's future:** ~Days of work. The smallest shippable ARIA v1.
**What to try next:** Build when manual paste-workflow friction is high enough to justify it.

### [FUTURE] Browser extension for context injection
**What it would be:** Auto-inject starter block when opening Claude/GPT chat.
**Why it's future:** Highest-leverage build per Claude's analysis. Solves the "paste Block A every time" problem.

### [FUTURE] MCP server for the repo
**What it would be:** Custom MCP server giving Claude Desktop and Code structured tools (read_handoff, append_idea, search_compost, etc.).
**Why it's future:** Fastest integration path with current AI infrastructure.

### [FUTURE] Whisper API voice capture
**What it would be:** Press hotkey → record voice → Whisper transcribes → routes to compost via emoji detection.
**Why it's future:** Works on desktop TODAY without buying hardware. Just hasn't been built.

### [FUTURE] Wearable ARIA (Samsung Wear + Tasker)
**What it would be:** Watch button → voice capture → routes to phone → syncs to repo.
**Why it's future:** "We'll know when we make more of it." Save the principle.

### [FUTURE] 5 ARIA product features (from Blind Trio Round design)
- **Divergence Lock** — hide responses until ALL submitted
- **Consensus Map** — visualize agreement / unique-sees / conflicts
- **Outlier Shelf** — preserve strong non-consensus ideas
- **Argument Swap** — steelman opposing AI position
- **User Verdict Layer** — user reaction becomes part of synthesis

### [FUTURE] ARIA as protocol, not app
**What it would be:** Open-source spec that any AI can implement. License to AI companies.
**Why it's future:** Long-term strategic move. Build reference app first, formalize spec later.

---

## ⚪ DEFERRED — Intentionally Postponed

These were considered and explicitly deferred. Don't reopen without new information.

### [DEFERRED] Original `next_step`: flagged transaction flow inspection
**What it is:** Inspect `app/(tabs)/explore.tsx` and `app/client-detail.tsx` for filtering / match mode / cleanup resolution.
**Why deferred:** Multi-day governance session took priority. Preserved verbatim in CURRENT_HANDOFF.json.
**Trigger to resume:** When user explicitly returns to app work. Notes app intake comes first.

### [DEFERRED] Keyboard fix for Add Transaction sheet
**What it is:** Save button gets crowded by Android keyboard.
**Why deferred:** Long-standing issue. Approach carefully.
**Files:** Known issue documented in `CLAUDE.md`.

### [DEFERRED] Receipt state model (attached / missing / unavailable)
**What it is:** Data model gap — lost receipts can't be cleared from Missing Receipts queue.
**Why deferred:** Coordinated store change required.

### [DEFERRED] Date/year trust issue
**What it is:** Transactions stored without year cause tax screen to show wrong year.
**Why deferred:** Needs to move up before launch but hasn't yet.
**Files:** Known issue documented in `CLAUDE.md`.

---

## 📐 How to use this file going forward

- **Skim when you forget what you've built** — that's the whole point
- **Update entries when you build deferred items** — promote [DESIGNED] → [BUILT]
- **Add new entries when you save new candidates** — don't let things hide
- **If something gets used a lot, leave a note** — that's signal it should be locked
- **If something hasn't been used in months, demote it** — [BUILT] → [DEFERRED] is fine

This file is the answer to "what did I make and how do I use it?" If something isn't here, it doesn't really exist for you.

---

*Companion files: `docs/user/USER_DASHBOARD.md` (live cockpit) + `docs/user/HOW_TO_USE_ARIA.md` (designed, not built yet — the "what do I say" reference).*

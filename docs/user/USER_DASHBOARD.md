# USER DASHBOARD

**Purpose:** Human-facing continuity cockpit for Caleb. Quick orientation, not AI governance. Skim in 60 seconds to know where you are.

**Last updated:** 2026-05-11 (end of long multi-day governance+ARIA session)
**HEAD:** 8a0803c (will update after this commit)
**Status:** Built tonight with loaded context — populated by Code with 3-day session in mind.

---

## 🔖 Reminders (the cheat sheet)

### Shorthand family (in SYSTEM_COMMANDS.md)

| Shorthand | What it does |
|---|---|
| `soc` | stream-of-consciousness, raw idea capture |
| `sidequest` | brief intentional detour with explicit return |
| `idea intake` | batch import saved idea clusters using NO IDEA GETS WASTED |
| `tool sweep` | harvest underused tools, connectors, shortcuts, APIs |
| `blind round` | start Blind Trio Round Phase 1 (independent ideas) |
| `phase two` | release Phase 1 files for cross-read |
| `synthesize round` | create final Blind Trio synthesis |
| `hold that thought` | preserve current thread before sidequest |
| `what were we doing` | recover thread / read Live State HOLDs |
| `back to base` | resolve sidequest, return to base task |
| `system map` | show what ARIA capabilities exist and how to use them |
| `clear` | mid-session token reset |
| `handoff` | full end-of-session continuity ceremony |
| `health check` | diagnostic before big decision |
| `wn` | what's next — verify next_step |

### Key principles

- **NO IDEA GETS WASTED** — save all meaningful ideas, categorize, flag strongest, promote/build later. Filter at promotion time, not capture time.
- **AIs capture. User synthesizes. Never reverse this.**
- **Save generously. Promote selectively. Build intentionally.**
- **Follow the spark. Hold the thread. Save the door. Capture after the wave. Return when ready.**
- **Everything is a tool — including discomfort, friction, confusion.**
- **The folder IS the protocol** — simple repo structures can enforce workflow before software exists.
- **Code owns file truth. GPT owns clone-behavior review. Claude owns systems pressure-test.**
- **Uncrumple is ARIA's proving ground** — building Uncrumple reveals ARIA primitives.

### Active LOCKED rules (in LOCKED_ATTRIBUTES.md)

- **LOCKED 36** — ARIA AMBIENT NOTICING RULE (surface 🔭 inline)
- **LOCKED 37** — CROSS-AI PROMPT RECONCILIATION (synthesize or principled-disagree, never silent-defer)
- **NO IDEA GETS WASTED RULE** (foundational ARIA principle, in Incoming/Unsorted section)

---

## 📍 Live State (always current — git log IS the history)

### Current base task (preserved, deferred)
**Inspect flagged transaction flow** in `app/(tabs)/explore.tsx` and `app/client-detail.tsx` to verify filtering logic, match mode interaction, and cleanup resolution behavior when marking transactions as reviewed.
INSPECT FIRST. No edits. Show relevant code only. Wait for next instruction.

### Priority before app work next session
**Ask user whether they want notes app idea intake first.** User has a notes app list to share — queued as priority in CURRENT_HANDOFF.json `unresolved_threads`. If yes → run Idea Intake Mode protocol. If no → proceed to flagged-flow inspection.

### Active sidequest at last check
End of long ARIA architecture session. Goal: finish pre-clear synthesis, do explanation pass, close cleanly. No active code-side sidequest.

### Recent inflection points (this session)
1. Block C truncation → Code-as-writer / GPT-as-reviewer role split
2. "Wait, this doesn't make sense" moments → caught experienced-vs-fresh GPT distinction, repo truth boundary, HANDOFF_CHEATSHEET need
3. Pre-clear "what else?" pressure → 90% of late-session deep ideas
4. Wearable question → flipped form-factor mental model (desktop = backend, voice/wearable = frontend)
5. Notes app mention → Idea Intake Mode protocol
6. "Should we track the path?" → Follow-the-Spark synthesis (3-tier capture)
7. Trio synthesis → Blind Trio Round protocol designed
8. "Why aren't we building it?" (THIS one) → revised Code's yield decision

---

## 📝 Quick Captures (max 10, oldest auto-route to compost)

1. [2026-05-11] USER_DASHBOARD built tonight per user instinct — context-dependent artifact built while context exists
2. [2026-05-11] HOW_TO_USE_ARIA.md and WHAT_EXISTS.md deferred to next session (reference docs, less context-dependent)
3. [2026-05-11] Three-way trio convergence happened twice this session — strong LOCKED 37 validation signal
4. [2026-05-11] Blind Trio Round protocol designed (`docs/trio_rounds/_TEMPLATE/` not built yet)
5. [2026-05-11] Wearable substrate analysis saved — Samsung watch + WearOS + Tasker for Android equivalents
6. [2026-05-11] ARIA strategic position settled: build the layer between user and existing AI, NOT custom LLMs

---

## 📌 Pinned (exempt from auto-cleanup)

- **The held base task** (flagged transaction flow) is the work that Uncrumple needs. ARIA was second-order from it. Resume after notes intake.
- **Don't perpetuate the inspiration wave** by default in fresh sessions. Let user direct.
- **The original next_step in CURRENT_HANDOFF.json is preserved verbatim** — protected through entire session.

---

## ⚠️ Do Not Confuse

| Thing | What it is | Not to be confused with |
|---|---|---|
| `clear` | normal operational mid-session reset | `/clear` (platform context wipe) |
| `handoff` | full end-of-session continuity ceremony | `clear` |
| `/clear` | platform context wipe (paste starter block after) | `clear` (mid-session shorthand) |
| idea preservation | saving raw, no commitment | governance promotion (locking as rule) |
| saved design | concept exists in files | built feature (actually usable) |
| inspiration detour | productive sidetrack with artifacts | app abandonment / lost focus |
| candidate | rule awaiting validation | LOCKED (proven, enforced) |
| Uncrumple | the React Native receipt app | ARIA (the continuity OS that emerged from building it) |

---

## ✅ Safe-To-Clear Checklist

Run through this before `/clear`:

- [ ] Final HEAD known (current: 8a0803c, will update after this commit)
- [ ] Starter block updated to final HEAD
- [ ] Block A pasted to GPT custom instructions (if doing slim version)
- [ ] Block B pasted to Claude (chat) project rules (if doing slim version)
- [ ] Explanation pass delivered
- [ ] Notes app intake reminder preserved in CURRENT_HANDOFF.json (already done)
- [ ] USER_DASHBOARD.md committed and pushed (this file)
- [ ] One-liner notes app reminder copied somewhere user will see it:
      "TOMORROW: Before app work, import notes app ideas into ARIA using NO IDEA GETS WASTED. Save all. Categorize by emoji. ⭐ strongest. Do not filter."

---

## 🚧 Designed but not built yet (saved tonight, build later)

These exist as designs in `docs/aria/ARIA_IDEAS.md` and candidates in `CANDIDATE_ATTRIBUTES.md` but aren't built:

- `docs/user/HOW_TO_USE_ARIA.md` — command reference organized by intent
- `docs/user/WHAT_EXISTS.md` — capability index with status badges [BUILT][USABLE][CANDIDATE][DESIGNED][FUTURE][DEFERRED]
- `docs/trio_rounds/_TEMPLATE/` — Blind Trio Round folder template
- `aria` CLI commands (`aria start` / `aria capture` / `aria handoff` / `aria status` / `aria notepad` / `aria ideate`)
- Browser extension for context injection
- MCP server for the repo
- Voice capture via Whisper API
- Wearable interfaces (Samsung Watch + WearOS via Tasker/Bixby)
- 5 ARIA product features: Divergence Lock / Consensus Map / Outlier Shelf / Argument Swap / User Verdict Layer
- ARIA_STARTER_KIT (cognitive-mode generator)

When you want to build any of these, say so. Most are 1-day to 1-weekend tasks. The 3-command `aria` CLI is the most actionable starting point.

---

## 📐 How to use this file

- **Glance at it any time** to remember where you are
- **Update Live State** when you start a new sidequest or finish one
- **Add to Quick Captures** when something comes up that doesn't fit elsewhere (max 10)
- **Pin items** (📌) you never want auto-cleaned
- **At handoff**, Code refreshes Reminders and Live State sections
- **At session start**, fresh Code reads this EARLY in startup sequence (designed proposal; not yet locked as permanent first-read)

Anti-bloat rules:
- Reminders is REWRITTEN when shorthands/principles/locked rules change, not appended
- Live State has no history (git log is the history)
- Quick Captures max 10, oldest auto-route to compost
- Pinned 📌 items exempt from auto-cleanup
- No section may exceed 30 lines without cleanup
- References other files, never duplicates them
- Git provides time-travel — no parallel snapshot folders needed

---

*This file is the human-facing continuity cockpit. The AI-facing equivalent is `CURRENT_HANDOFF.json`. The ceremony reference is `docs/system/HANDOFF_CHEATSHEET.md`. Together they cover machine continuity + human continuity + ceremony choreography.*

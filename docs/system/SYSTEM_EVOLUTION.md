# SYSTEM_EVOLUTION.md

Purpose:
Version history of the Development Operating System itself.
Tracks how the system evolved, what problems each addition solved,
and why the architecture looks the way it does.
This file is about the system, not the app.

---

## Evolution Log

[2026-05-06] — Session: Major architecture expansion

Starting state:
- LOCKED_ATTRIBUTES, HANDOFF system, SESSION_LOG, CLAUDE.md, 
  ROADMAP existed
- Candidate attributes lived only inside CURRENT_HANDOFF.json
- No permanent record of decisions, anti-patterns, or invariants

Problems identified:
- Candidate attributes could be lost between handoff regenerations
- No record of WHY decisions were made
- No permanent warning system for repeated mistakes  
- No record of deferred architectural problems
- No shared language to prevent semantic drift between AI sessions
- No constitutional truths to prevent regression

Changes made:
- CANDIDATE_ATTRIBUTES.md created — persistent staging layer
- DECISIONS.md created — permanent decision reasoning log
- ANTI_PATTERNS.md created — permanent warning system
- KNOWN_UNKNOWNS.md created — deferred ambiguity tracker
- INVARIANTS.md created — constitutional constraints
- GLOSSARY.md created — shared semantic definitions
- SYSTEM_EVOLUTION.md created — this file

Insight that triggered this:
Realizing that candidate attributes in JSON were being 
regenerated fresh each handoff, losing accumulated learning.
That led to seeing the whole system needed persistent layers
for different types of institutional knowledge.

Bigger realization:
The system is not Uncrumple-specific. It is a reusable 
Development Operating System (DevOS) that can be deployed 
on any AI-assisted project. Uncrumple is the first app 
running on it.

---

[2026-05-09] — Session: Handoff procedure overhaul

Starting state:
- Single CLEAR USAGE RULE in CLAUDE.md (5 steps)
- "close session" was a vague heavy variant
- All AIs received pasted file content per chat
- Manual sync between GPT, Claude, Code
- Candidate review batched at handoff
- No distinction between mid-session reset vs end-of-session trio clone
- ARIA still partially named "DevOS" / "AI-Resilient Infrastructure Architecture"

Problems identified:
- "clear" and "close session" were conflated — same word for two
  fundamentally different operations
- 14-step close procedure produced fatigue and missed captures
- Long sessions accumulated governance debt
- AIs received stale pasted content with no live truth source
- No way for AIs to verify each other's reports
- Project rules duplicated content from CLAUDE.md / LOCKED_ATTRIBUTES
- GPT custom instructions nearing size limit due to duplication
- Local working tree changes invisible to repo-based verification

Changes made:

1. CLEAR vs HANDOFF distinction
   - CLEAR USAGE RULE: lightweight mid-session reset
     (wrap + metrics + doc cleanup + commit + starter)
   - HANDOFF COMMAND: heavyweight end-of-session trio clone
     (clear + candidate review + promotion + ARIA scan + 
     audit + external sync packets + summary)
   - "close session" alias dropped — only "handoff" triggers ceremony
   - HEALTH CHECK: pre-decision diagnostic, the only standalone
     command beyond CLEAR/HANDOFF
   - SESSION WRAP and DOC CLEANUP demoted to internal subroutines

2. Three-command surface (replaced six-command surface)
   - Externalized to docs/system/SYSTEM_COMMANDS.md as
     authoritative reference

3. Behavioral rules locked into CLAUDE.md
   - DUAL-TRACK RULE: structured tasks + ambient 🔭/🧠 capture
     run in parallel, never suppress each other
   - AMORTIZED GOVERNANCE RULE: capture decisions / 
     anti-patterns / invariants when observed mid-session,
     not in batch at handoff
   - VERIFY-BEFORE-CLAIM RULE: grep before claiming existence
   - DUPLICATE PROMPT RULE: skip if already applied
   - MERGED PROMPT RULE: merge same-file same-goal prompts,
     preserve stricter constraints
   - SYSTEM FILES READING RULE: read 13 system + ARIA files
     before patching

4. LOCKED_ATTRIBUTES expanded from ~30 to 35 numbered sections
   - 13b SIDEQUEST RULE
   - 13c CONTINUITY REASSURANCE RULE
   - 31 BASE TASK CONTINUITY REASSURANCE
   - 32 SIDEQUEST CONTEXT PRESERVATION
   - 33 AUTOMATIC HIGH-VALUE ARCHITECTURE CAPTURE
   - 34 ARIA EPISTEMIC CONFIDENCE LAYERS
   - 35 INSPIRATION FLOW CAPTURE
   - CANDIDATE PROMOTION RULE + CEREMONY (unnumbered)

5. Per-role reading manifest (docs/system/SYSTEM_COMMANDS.md)
   - GPT: continuity reconstruction + execution lineage
   - Claude (chat): constitutional behavior + governance evolution
   - Code: full repo via SYSTEM FILES READING RULE
   - Single source of truth (no role folders) with role-weighted
     access

6. GitHub as source of truth
   - Repo made public at github.com/Rattailbaby/ReceiptApp
   - GPT reads files via GitHub connector — but only 
     committed + pushed origin/main state is visible.
     Local working tree changes are invisible until Code 
     commits and pushes.
   - Claude reads via Project Knowledge (snapshot, refreshed at
     handoff)
   - Code reads locally (sees uncommitted state too)
   - Replaced manual paste-blocks with repo references

7. External sync packets for HANDOFF
   - Block A: paste-ready GPT project rules update
   - Block B: paste-ready Claude project rules update
   - Block C: paste-ready handoff JSON generation request
   - Block A and C now lighter (GitHub-aware)
   - Block B remains paste-heavy (Claude tier dependent)

8. FRESH CHAT PROTOCOL added to project rules
   - GPT and Claude both read CURRENT_HANDOFF.json on first
     message of new chat before responding to user request

9. Slim project rules pattern
   - GPT custom instructions reduced from ~250 to ~95 lines
   - Bulk content externalized to repo files
   - GPT reads from repo as needed instead of carrying everything
     in custom instructions
   - Same pattern available for Claude when project rules
     near limit

10. Repo truth boundary clarified
    - GitHub is the source of truth ONLY for committed + 
      pushed state. Local working tree changes are 
      invisible to AI verification.
    - Discovered during GPT GitHub access verification — 
      GPT correctly fetched ARIA_IDEAS.md but couldn't 
      find an entry that existed locally but hadn't been 
      pushed.
    - Workflow implication: before asking GPT or Claude 
      to verify repo state, Code must check git status, 
      commit relevant changes, push to origin/main, then 
      ask AI to verify.
    - Captured as candidate in CANDIDATE_ATTRIBUTES.md 
      pending repeat validation across sessions.

11. ARIA naming finalized
    - "Ambient Reasoning and Insight Architecture"
    - Replaces all "DevOS" and "AI-Resilient Infrastructure
      Architecture" references
    - Canonical pitch: "Pick up exactly where your brain left off"
    - Captured in docs/aria/ARIA_README.md

12. Insight: Uncrumple is ARIA's design language
    - Cleanup flow → ARIA's close-session UX
    - txNeedsCleanup → ARIA epistemic confidence layers
    - Receipts → ARIA continuity primitive
    - 10 cross-pollination connections captured in ARIA_IDEAS

13. 14-step target handoff architecture saved (ARIA_IDEAS)
    - 9 steps currently exist in CLAUDE.md HANDOFF COMMAND
    - 5 steps still missing: candidate↔JSON reconciliation,
      ARIA state capture, decisions/anti-patterns/invariants
      prompts, naming scan, session summary
    - Build incrementally session by session

Insights that triggered this:

- "Close session" running as one giant ceremony at end-of-session
  was producing fatigue and missed captures.
  → AMORTIZED GOVERNANCE: continuous capture beats batched.

- "Clear" and "close session" were conflated — but they're
  fundamentally different events.
  → Renamed and separated.

- AIs were dependent on user-pasted content per chat — fragile,
  duplication-prone, drifts over time.
  → GitHub-as-source-of-truth eliminates the paste burden.

- Claude couldn't WebFetch GitHub raw URLs (security layer block).
  → Project Knowledge provides snapshot-based access.

- GPT custom instructions hit size limit.
  → Slim project rules + repo references for the bulk.

- Local commits weren't visible to AI verification.
  → Discovered via real failure during GPT verification.
  → Captured as rule: push before AI-side repo verification.

Bigger realization:
The repo is not just code storage — it's continuity
infrastructure. Continuity now compounds across sessions
instead of resetting every chat. The trio (User / GPT / 
Claude / Code) has structurally symmetric repo access for the
first time, enabling cross-role verification without user as
relay.

What still needs building:
- Heuristic defaults for candidate review during handoff
- Trio-routing paste-ready prompt automation
- Synthesis-mode signal (explicit user override of clear cadence)
- The 5 missing handoff steps (work toward 14-step target)
- "Continuity observability" / handoff confidence score


===

2026-05-09 (afternoon/evening) — Idea preservation layer + ARIA architecture clarification

Continuation of the morning's handoff procedure overhaul. Where the morning settled the CEREMONY, the afternoon settled the IDEA-PRESERVATION model and clarified ARIA's actual architecture as a product.

What changed in the system this afternoon:

1. Ceremony validated end-to-end via real Tier 3 execution
   The morning's tiered clone regeneration candidate got tested in production. Block C truncation (GPT's GitHub fetch_file truncated CURRENT_HANDOFF.json) produced a real failure that became a durable architecture pattern: Code owns full file truth, GPT owns clone-behavior review. Now embedded in CURRENT_HANDOFF.json aria_state and HANDOFF_CHEATSHEET.md.

2. Idea preservation layer locked
   - LOCKED rule: NO IDEA GETS WASTED RULE (foundational ARIA principle)
   - ⭐ shelf created at top of CLAUDE_CLEVER_IDEAS.md (high-signal items live there AND in normal category)
   - Idea Compost layer concept saved (raw ideas as compost, not commitments)
   - High-Signal Shelf architecture saved (6-layer stack: compost / shelf / connections-future / roadmap / candidates / locked)
   - Idea Intake Mode protocol saved (for processing notes app batch imports)
   - Categorized preservation rule (preserve every idea, never silently omit, ⭐ flag standouts, filter at promotion not capture)

3. Foundational ARIA principles surfaced
   - "AIs capture, user synthesizes. Never reverse this." (locked as ⭐ ARIA design principle)
   - "Everything is a tool / experience as signal stream" (reframes ARIA from idea-capture to experience-capture infrastructure)
   - "Save generously, promote selectively, build intentionally" (operating principle)
   - "Idea preservation is not governance promotion" (layer distinction)

4. ARIA architecture clarified as a product
   - Three primary build models: unified LLM (rejected as wrong layer) / multi-agent role specialization / protocol-first (strongest pick)
   - Wearable substrate analysis: phone-first / glasses / watch with ranked reasoning
   - 17 extended build approaches captured (CLI, browser extension, MCP server, Obsidian plugin, IDE plugin, voice-only, email-based, append-only event log, etc.)
   - "ARIA is mostly already built" insight: this repo IS the architecture (files as state, git as event log, markdown as protocol, Claude Code as runtime). Gap from "this repo" to "ARIA the product" is packaging, not foundational building.
   - "Form factor tells you what ARIA really is": desktop is the BACKEND. Frontend (voice / glasses / watch) hasn't been built yet. Flips mental model 180°.

5. Strategic position settled
   "ARIA = build the layer between the user and existing AI that makes continuity, coordination, and signal capture automatic. NOT build better AI." Rules out custom-LLM rabbit hole permanently.

6. New shorthand added to user command surface
   `idea intake` joins `soc` and `sidequest` as third user shorthand. Behavior spec full in SYSTEM_COMMANDS.md.

7. ARIA_STARTER_KIT concept saved
   ARIA as a continuity operating KIT (not one app) that generates personalized continuity infrastructure based on cognitive mode. Defensible go-to-market shape — packaging the protocol for non-developer users.

Numbers:
- ~150 distinct ideas captured this session
- ~50 ⭐ items on the High-Signal Shelf
- 4 commits expanding ARIA_IDEAS.md substantially (~600+ lines added)
- 0 app code changes (this was governance/architecture only)

Bigger realization:
The morning settled HOW continuity gets transferred. The afternoon settled WHAT continuity actually is — and what ARIA fundamentally is as a product. ARIA is not "a memory layer for AIs." ARIA is "frictionless re-entry into previous cognition." The user is the synthesis layer; AIs capture; the system reduces friction around the user.

The session also validated the Pre-Clear Synthesis Window pattern empirically: most of the afternoon's deepest architectural reframings emerged from open-ended generative exchange when AIs were heavy with context, not from checklist work. Saved as Generative Harvest candidate.

What still needs building (afternoon additions to morning's list):
- 3-command CLI (aria start / aria capture / aria clear) — most actionable v1 build
- Browser extension for chat-interface context injection
- Comparison view feature (parallel API calls to GPT + Claude with diff highlighting)
- Passive signal capture (auto-generate session texture from existing logs)
- Notes app idea intake tooling (concrete implementation of Idea Intake Mode protocol)

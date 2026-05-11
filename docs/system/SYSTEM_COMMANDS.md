# SYSTEM COMMANDS REFERENCE
Last updated: 2026-05-08

Complete map of all triggers, keywords, and automatic 
behaviors in the Claude Code system.

## User Commands (3 total)

clear
Does: wrap + session metrics + doc cleanup + commit + 
starter block
When: mid-session token reset, between features

handoff
Does: everything clear does PLUS candidate review + 
promotion ceremony + ARIA scan + goal audit + external 
sync packets + session summary
When: end of session, before new chat, when system evolved

health check
Does: count patches, estimate context weight, recommend 
clear/handoff/continue
When: pre-decision diagnostic — ask BEFORE committing

## Internal Subroutines (not user-facing)

wrap session — called by clear and handoff automatically
clean up docs — called by clear and handoff automatically
close session — alias for handoff, being phased out

## Capture Triggers

💡 🪟 📝 🔧 ⚛️ 🤖 📱 🏗️ 🎯 ⭐ at start of message
→ saves to docs/DID_YOU_KNOW.md

🧠 Idea: (literal prefix)
→ saves to docs/WORKFLOW_IDEAS.md

🔭 ARIA: anywhere in message
→ saves to docs/aria/ARIA_IDEAS.md
→ fires even during "Fix only X" tasks (DUAL-TRACK RULE)

🧠 anywhere in ARIA context
→ saves to docs/aria/ARIA_IDEAS.md

## Confirmation Triggers

y or yes after a patch
→ logs confirmed patch to SESSION_LOG.md

n / silence / retry similar fix
→ treats patch as failed, does not log

Moving to new feature without saying y
→ assumes success, logs before starting next

## User Shorthands

wn = "what's next" — verify next_step in CURRENT_HANDOFF
soc = stream of consciousness — raw idea capture
sidequest = brief intentional detour with explicit return
idea intake = batch import saved idea clusters using NO IDEA GETS WASTED rule
tool sweep = ask GPT/Claude/Code what tools/resources/shortcuts/connectors/tricks we are underusing
blind round = start Blind Trio Round (independent ideation Phase 1)
phase two = release Phase 1 files to other AIs, trigger cross-read
synthesize round = create final synthesis preserving originals + disagreements + clever extras

## idea intake

Trigger:
User says "idea intake" or shares a saved notes-app idea list.

Meaning:
Batch-import saved ideas using the NO IDEA GETS WASTED rule.

Behavior:
- Preserve the raw list.
- Categorize every idea by emoji/category.
- Do not drop, ignore, or silently omit any idea.
- Clean up wording only if meaning is preserved.
- Flag especially strong ideas with ⭐.
- Add strongest items to "You Should Really Look At These" if available.
- Route ideas to the correct file:
  - 🔭 ARIA insights → docs/aria/ARIA_IDEAS.md
  - 🧠 workflow/system ideas → docs/WORKFLOW_IDEAS.md or docs/system/WORKFLOW_IDEAS.md depending on scope
  - 📱 app/product ideas → docs/system/ROADMAP.md or docs/system/CLAUDE_CLEVER_IDEAS.md if available
  - behavior-rule ideas → docs/system/CANDIDATE_ATTRIBUTES.md
  - tips / did-you-know items → docs/DID_YOU_KNOW.md
- Preserve weak or half-formed ideas too. Filtering happens later at promotion/build time.

Reminder — shorthand family:
- soc = raw stream-of-consciousness capture
- sidequest = brief intentional detour with explicit return
- idea intake = batch import and categorize saved idea clusters
- tool sweep = harvest underused tools/resources/shortcuts/connectors/tricks

## tool sweep

Trigger:
User says "tool sweep" or asks what tools/resources/tricks/connectors/shortcuts/repos/APIs/automations/memory systems we are underusing.

Meaning:
Harvest underused capabilities that could reduce friction, improve continuity, speed development, or strengthen ARIA/Uncrumple.

Behavior:
- Ask or answer from the perspective of GPT, Claude, and Code if useful.
- Include practical tools, connectors, shortcuts, APIs, repo features, automation ideas, platform features, and workflow tricks.
- Categorize ideas by emoji/category (🤖 AI / 🏗️ infra-build / 🧠 general / 📱 mobile / 🪟 Windows).
- Preserve all meaningful ideas (NO IDEA GETS WASTED rule applies).
- Flag especially strong ideas with ⭐.
- Do NOT promote/build by default. Capture, not commit.
- Route ideas using idea intake / NO IDEA WASTED rules.
- End by returning to the held base task.

Reminder — full shorthand family:
- soc = raw stream-of-consciousness capture
- sidequest = brief intentional detour with explicit return
- idea intake = batch import and categorize saved idea clusters
- tool sweep = harvest underused capabilities
- blind round / phase two / synthesize round = Blind Trio Round protocol

## blind round / phase two / synthesize round (Blind Trio Round protocol)

Trigger: user says "blind round" or asks for ideas from all 3 AIs on architecturally significant question.

Three-phase protocol:

PHASE 1 — `blind round`
- Create folder: docs/trio_rounds/YYYY-MM-DD-topic-slug/
- Generate template files: 00_QUESTION.md + empty Phase 1 + Phase 2 + synthesis files
- User pastes same question to GPT, Claude, Code SEPARATELY
- Each AI answers WITHOUT seeing others
- Each response gets saved to its file (01_GPT_BLIND.md, 02_CLAUDE_BLIND.md, 03_CODE_BLIND.md)
- No AI reads others until Phase 2

PHASE 2 — `phase two`
- User says "phase two"
- Each AI reads the other two Phase 1 files
- Each AI writes Phase 2 response (04_GPT_CROSSREAD.md, 05_CLAUDE_CROSSREAD.md, 06_CODE_CROSSREAD.md)
- Per LOCKED 37: agree / merge / hold position with reasoning. Never silent defer.

PHASE 3 — `synthesize round`
- Generate 07_SYNTHESIS.md with sections:
  - Original question
  - All 3 blind takes (cross-reference)
  - All 3 cross-read responses (cross-reference)
  - Convergence points
  - Disagreements (mandatory — value is here)
  - Best merged answer
  - High-signal ⭐ ideas
  - "Does this defeat the purpose?" check (user fills in)
  - User verdict layer (user fills in)
- ORIGINAL_IDEAS.md preserves all 3 Phase 1 takes side-by-side (auto-generated)
- 08_IDEAS_TO_SAVE.md captures anything worth routing to ARIA_IDEAS / ROADMAP / CANDIDATES

Critical rule:
Do not let Phase 2 overwrite Phase 1. Independent first takes are valuable BECAUSE they are uncontaminated.

When to invoke:
NOT every question. Only architecturally significant decisions / ambiguous trade-offs / foundational principles.

Full design: docs/aria/ARIA_IDEAS.md 2026-05-11 Blind Trio Round entries.

## Implicit/Conditional Triggers

Decision made between alternatives
→ AMORTIZED GOVERNANCE: prompt to add to DECISIONS.md

Failure mode hit
→ prompt to add to ANTI_PATTERNS.md

Patch could violate invariant
→ flag and verify before continuing

Multiple prompts target same file + goal
→ MERGED PROMPT RULE: merge into one patch

Same prompt sent twice
→ DUPLICATE PROMPT RULE: grep first, skip if applied

About to claim file/section exists
→ VERIFY-BEFORE-CLAIM: grep first

## Always-On Background Rules

SYSTEM FILES READING RULE — read 13 system/ARIA files 
before patching
DUAL-TRACK RULE — "Fix only X" never suppresses 🔭/🧠 
capture
AMORTIZED GOVERNANCE RULE — capture decisions/patterns/
invariants when observed
POST-PATCH LOGGING RULE — ask "Did it work? y/n" after 
visible patches
VERIFY-BEFORE-CLAIM RULE — grep before claiming existence
DUPLICATE PROMPT RULE — check before re-running
MERGED PROMPT RULE — merge concurrent same-goal prompts
REGRESSION RULE — don't stack patches on failure, revert
CLAUDE.md IMMUTABILITY RULE — don't edit without explicit 
narrow request

## Plain English Summary

Mid-session token reset → say "clear"
End of session new chat → say "handoff"  
Quick diagnostic → say "health check"
Save an idea → drop emoji prefix
Save ARIA insight → use 🔭 ARIA: anywhere
Check what's next → say "wn"

## Idea Routing (which file gets which type of idea)

ARIA-as-product ideas (cognition layer, branch management, 
continuity infrastructure, ambient noticing concepts)
→ docs/aria/ARIA_IDEAS.md

DevOS / system-layer process ideas (improvements to the 
governance/handoff/candidate system itself)
→ docs/system/WORKFLOW_IDEAS.md

Uncrumple app feature ideas (transactions, receipts, 
clients, tags, cleanup flow)
→ docs/system/ROADMAP.md (or docs/system/CLAUDE_CLEVER_IDEAS.md 
for speculative)

Project-level workflow about building Uncrumple (distinct 
from system-layer)
→ docs/WORKFLOW_IDEAS.md

When ambiguous, ask before writing.

## The Three-Role System

User = director and vision holder, decision maker
Planning AI (GPT or Claude chat) = architect, prompt writer, 
continuity engine, strategic synthesizer
Execution AI (Claude Code) = minimal patches only, never plans, 
never decides
Claude (chat) = systems thinking partner, verifier, idea 
expander, second opinion alongside GPT

Cross-AI behavior: synthesize or principled-disagree, never 
silent-defer between roles. See LOCKED_ATTRIBUTES section 29 
THREE ROLE SYSTEM and the cross-AI reconciliation candidate.

## Per-Role Reading Manifest

When restoring continuity for any role, this is which files 
each role weighs and the cognitive function each file serves.
Single source of truth (no folder duplication) — different 
weighting per role.

GPT (planner / continuity engine)
- docs/system/CURRENT_HANDOFF.json → continuity reconstruction
- docs/SESSION_LOG.md → execution lineage
- docs/system/LOCKED_ATTRIBUTES.md → governance behavior
- docs/system/CANDIDATE_ATTRIBUTES.md → pending behavioral evolution
- docs/aria/ARIA_IDEAS.md → synthesis continuity (focus most recent dated entries)
- docs/aria/ARIA_README.md → identity / canonical pitch

Claude (chat) (verifier / second opinion / systems thinker)
- CLAUDE.md → execution rules + commands awareness
- docs/system/LOCKED_ATTRIBUTES.md → constitutional behavior
- docs/system/CANDIDATE_ATTRIBUTES.md → governance evolution
- docs/system/CURRENT_HANDOFF.json → operational continuity
- docs/aria/ARIA_README.md → architecture direction
- docs/aria/ARIA_IDEAS.md → architecture exploration history

Code (executor)
- CLAUDE.md → auto-loads at session start
- docs/system/* → entire system layer (per SYSTEM FILES READING RULE)
- docs/aria/* → entire ARIA layer (per SYSTEM FILES READING RULE)
- Live local file access for everything else (no fetch needed)

User (director)
- Reads nothing directly; receives synthesis from AIs.

Long-term direction: continuity-oriented knowledge routing 
(stable as roles/tools/models change) instead of role-specific 
folders (couples knowledge to current AI lineup).

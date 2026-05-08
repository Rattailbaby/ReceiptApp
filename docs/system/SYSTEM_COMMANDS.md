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

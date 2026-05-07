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

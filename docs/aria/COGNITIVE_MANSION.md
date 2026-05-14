# COGNITIVE MANSION

Architecture seed file for the navigable-cognition layer of ARIA. Combined GPT + Claude + Caleb synthesis surfaced 2026-05-14, catalyzed by the forced Windows restart.

Sister entries in `docs/aria/ARIA_IDEAS.md`:
- [2026-05-14] Cognitive Mansion / Visual Idea Topology (commit `07be76c`)
- [2026-05-14] SOC: Forced-restart synthesis — 10 connected ARIA concepts (commit `762caa3`)
- [2026-05-14] Live-State Continuity layer (commit `fd6d477`)

This file does not duplicate ARIA_IDEAS.md content — it gives the synthesis its own structured home so the architecture can be reasoned about as a unit.

---

## Core thesis

**Making cognition traversable without flattening it.**

ARIA is not just memory, notes, handoff, or AI workflow.
ARIA is externalized navigable cognition.

It should preserve:
- what ideas are
- why they exist
- what question opened them
- how they connect
- what emotional weight they had
- what got smoothed away
- which AI/user contributed what
- what paths are possible next

Key phrases:
- "If I could put my brain down on paper and walk through it, that would be a game changer."
- "It's like trying to walk through a huge mental mansion."
- "Summaries destroy topology."
- "Rooms have doors. Doors are the questions that opened the thread."
- "In order to build ARIA, we need ARIA first."
- "It's like an ouroboros."

---

## Mansion metaphor

Rooms = idea clusters.
Doors = questions that opened major threads.
Hallways = relationships between ideas.
Heat = current emotional/creative energy.
Dust = cooling or neglected threads.
Windows = future trajectories.
Mirrors = the hub reflecting the user's current cognitive shape.
Artifacts = notes, screenshots, quotes, prompts, files, images attached to an idea.

---

## Two modes

### Archaeology Mode
Shows how ideas actually grew:
- messy emergence
- user/AI collisions
- pivots
- failed paths
- what was discovered when
- what question opened each room

### Navigation Mode
Shows clean forward paths:
- what to build next
- what depends on what
- what is hot/warm/cold
- what is unresolved
- what should be revisited

Do not merge these modes. Toggle between them.

---

## Meaning Trails

Preserve causal trails, not just links.

Example:
Round Closer
← came from cross-paste confusion
← came from Blind Trio Round
← came from wanting independent AI thinking
← came from realizing synthesis can flatten ideas

---

## Door Log

This is the smallest buildable primitive.

Every major thread should record:
- Door question: the exact question that opened the thread
- Date
- Source: user / GPT / Claude / Code / collision
- Room opened
- Why it mattered
- What it led to
- Current status
- Related rooms

Door Log matters because questions are more reusable than summaries.
You can re-ask a question. You cannot always re-feel an idea.

---

## Thread Temperature

Threads should show cooling/heat:
- hot = actively pulling attention
- warm = still relevant
- cool = saved, not urgent
- dusty = saved but not revisited
- gravity well = keeps resurfacing organically

---

## Hub as mirror, not dashboard

Dashboard shows status.
Mirror shows the user's current cognitive shape:
- what is hot
- what is cooling
- what keeps resurfacing
- what is being avoided
- what has unresolved gravity

---

## User-vs-AI contribution map

Track whether an idea came from:
- Caleb
- GPT
- Claude
- Code
- collision between multiple AIs
- user pushback
- real-world friction

Important:
The collision matters. Some ideas only exist because multiple minds touched the same problem.

---

## Rooms never entered

Show saved ideas that were never revisited.
Unexplored thoughts may be valuable.
The system should surface them without forcing action.

---

## Built-in Gem Flag

Future UI should let user mark exact lines/phrases that must survive synthesis.
This replaces manual ** markers eventually.

Possible importance levels:
- gem
- must survive
- ask other AIs about this
- unresolved
- emotionally important

---

## Still-writing / soft-active thread detection

Just because the conversation moved does not mean the user moved on internally.
ARIA should allow multiple soft-active thought streams:
- active
- soft-active
- parked
- unresolved
- still forming

---

## Notes and media attached to ideas

Ideas may need:
- notes
- screenshots
- pictures
- prompts
- commit links
- app screens
- voice notes

This parallels Uncrumple:
receipt evidence for transactions
cognitive evidence for ideas

---

## Ouroboros

ARIA is needed to build ARIA.
That recursion is not a bug.
The process is the proof of concept.

---

## Build path

Do not build the full visual web first.

Build order:
1. Door Log markdown file or section
2. Basic idea nodes in markdown
3. Relationships/links
4. Heat/status fields
5. User-vs-AI source fields
6. Simple generated graph later
7. Interactive visual web much later

---

## First build recommendation

Build the Door Log first.

Possible file:
`docs/aria/DOOR_LOG.md`

Door Log template:
- Door question:
- Date:
- Opened by:
- Room opened:
- Why it mattered:
- What it led to:
- Current temperature:
- Related rooms:
- Status:

---

Status: Architecture seed. Do not build full UI tonight.

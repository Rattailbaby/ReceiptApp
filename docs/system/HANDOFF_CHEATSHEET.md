# Handoff Cheat Sheet

Plain-English reference for clear / handoff / clone regeneration.
Read this when uncertain which operation to run, in what order, and by whom.

## The three operations

`/clear`
- platform reset only
- destroys current context
- do not use until Code says handoff/clear is complete and gives starter block

`clear`
- normal operational reset
- Code wraps/logs/commits/pushes/gives starter block
- use for regular app work and token health

`handoff`
- full continuity ceremony
- use when system/governance/ARIA/project rules changed or new chats need high-fidelity reconstruction

## Clone regeneration levels

**Level 1 — Normal Clear**
Use when normal app work happened.
No full JSON regeneration.

**Level 2 — Targeted Clone Refresh**
Use when small behavior/governance changes happened.
Create a Clone Delta Packet and patch only affected CURRENT_HANDOFF sections.

**Level 3 — Full Clone Regeneration**
Use when clone substrate changed:
- command meanings changed
- role behavior changed
- LOCKED_ATTRIBUTES changed significantly
- ARIA identity/direction changed
- repo/handoff structure changed
- assistant_behavior_clone is stale
- fresh-chat fidelity is uncertain
- **GPT or Claude is visibly slowing/degrading** (instance about to be replaced — this trigger alone justifies Level 3)

**Level 3 multi-pass harvesting (default, not optional):**
Single pass under-extracts. When the loaded AI is about to be replaced, ask 2-3 times:
- Pass 1: "Give me ideas about [X]"
- Pass 2: "What else? More ideas, especially ones that seemed too small or obvious"
- Pass 3 (clone-self-awareness): "Is there anything you left out about how you GREW this session and the way you OPERATE that you would want the clone to know?"

Pass 3 is the gem-producer — surfaces behavioral evolution the dying AI noticed about itself. User pastes the response back to Code, who routes it into assistant_behavior_clone / decision_log / persistent_attributes.

Each pass shorter than the last. Stop when AI repeats itself or strains.

## Correct full handoff order

1. Current Code runs handoff ceremony.
2. Current GPT and current Claude do Trio Reflection if needed.
3. Code reconciles reflections with file truth.
4. Current experienced GPT generates or sanity-checks full CURRENT_HANDOFF.json when Level 3 is needed.
5. Code writes CURRENT_HANDOFF.json.
6. Code commits and pushes.
7. Code gives starter block.
8. Only then type `/clear` in Code.
9. Paste starter block into cleared Code.
10. Fresh GPT/Claude chats receive finalized repo state and use FRESH CHAT PROTOCOL.

**Important:**
Fresh GPT should receive finalized continuity state.
Fresh GPT should not generate the handoff from scratch when current experienced GPT is still available.

## Repo truth boundary

GPT and Claude can only verify committed + pushed origin/main state.
Local uncommitted Code changes are invisible to repo-based verification.
Before asking GPT/Claude to verify repo state, Code should commit and push relevant changes.

## Simple memory version

- `clear` = save game
- `handoff` = pack the moving truck
- full clone regen = rebuild the assistant brain recipe

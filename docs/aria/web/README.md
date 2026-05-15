# ARIA Web — implementation folder

This folder is the **implementation home** for the ARIA visual concept web.
`docs/aria/` remains the concept/architecture layer; `docs/aria/web/` holds
the buildable web itself.

Created 2026-05-15 by consolidating files that were previously scattered:
- `ARIA_GRAPH.json` was at `docs/aria/ARIA_GRAPH.json`
- `ARIA_WEB.html` was at `docs/user/ARIA_WEB.html`

## Files

- **ARIA_GRAPH.json** — canonical graph data. 29 nodes, 48 edges. The single
  source of truth for the web. The renderer reads this; it must never
  hardcode node data. Includes a `words_to_know` glossary. v2 (2026-05-15)
  is the plain-language pass — every `plain_meaning` rewritten zero-jargon,
  an `emergence` field added to every node.
- **ARIA_WEB.html** — the renderer. A standalone D3 page. Note: as of
  2026-05-15 the HTML still carries a v1 hardcoded copy of the data — it has
  NOT yet been re-rendered from `ARIA_GRAPH.json` v2. That gap closes on the
  next web rebuild.

## Related — NOT in this folder

- `docs/aria/COGNITIVE_MANSION.md` — the spec / concept for navigable
  cognition. Stays at the concept layer; the web is one rendering of it.
- `docs/aria/ARIA_IDEAS.md` — the idea history, including the "ARIA Web v3
  Design Brief" and all web feedback. Historical dated entries there may
  reference the pre-2026-05-15 paths above; those are correct as records of
  their date. `git log --follow` tracks the moved files across the rename.

## Three-layer model (approved 2026-05-15)

1. **Canonical data** — `ARIA_GRAPH.json` — facts about the concepts; shared truth.
2. **User-state overlay** — personal marks / notes / custom layout — a future file, kept separate so canonical data stays clean.
3. **Renderer** — `ARIA_WEB.html` — presentation; swappable without touching the data.

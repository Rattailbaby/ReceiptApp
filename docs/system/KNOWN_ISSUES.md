# KNOWN ISSUES

**Purpose:** Active bugs and unresolved issues in the Uncrumple app. Each entry includes problem statement, goal, approach (if known), and status. Bugs live here — not in CLAUDE.md (execution rules), CLAUDE_CLEVER_IDEAS.md (saved ideas), or ROADMAP.md (future features).

**Last updated:** 2026-05-14 (content migrated from CLAUDE.md to differentiate execution rules from bug tracking)

**When to read this:** When opening a session and choosing what to fix next. When a user report sounds like it might already be tracked. When deciding whether a problem is a known issue or a regression.

**Companion files:**
- `docs/SESSION_LOG.md` — confirmed fixes and changes (closed work)
- `docs/system/ANTI_PATTERNS.md` — failure-mode patterns to avoid
- `docs/system/CURRENT_HANDOFF.json` → `active_issue` / `temporary_items` / `unresolved_threads` — machine-readable continuity state

---

## Known Issues

### Keyboard Blocking Save Button
Problem: Save button in Add/Edit Transaction is hidden or crowded by keyboard. User must manually dismiss keyboard to tap Save. A previous fix attempt made it worse.
Goal: Save button always reachable while typing without refactoring the layout.
Approach: improve KeyboardAvoidingView behavior, add scroll and bottom padding, set keyboardShouldPersistTaps="handled" correctly.
Status: Not fixed yet. Approach carefully.

### Android Back Button in index.tsx Modals
Android back closes modals correctly in client-detail.tsx.
This fix has NOT been applied to index.tsx modals yet.
Need to audit: add transaction sheet, invoice confirm sheet, client edit modal.
Do one modal at a time. Do not batch.

### Copy Debug Info Button
A Copy Debug Info button exists in the transaction detail sheet. It was added by mistake. Remove it as its own dedicated prompt. The user actually wants a Clone Transaction tool instead, which will be built separately.

### Transaction Modal Background
Transaction sheet opens over client page — background switches to client screen. Acceptable for now, not ideal long-term.

### receipt Boolean vs receiptUri Inconsistency
Described in Receipt Rules section of CLAUDE.md. Do not casually fix. Full cleanup requires updating display logic, tax calculations, missing receipts filter, and seed data simultaneously.

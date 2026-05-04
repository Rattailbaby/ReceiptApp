# UNCRUMPLE PROJECT MASTER FILE (CLAUDE_CODE_MASTER.md)
Last updated: April 2025

This file is for Claude Code only.
Read this entire file before editing anything.

---

## What Is This App
Uncrumple is a React Native / Expo Android app for tradespeople to track receipts, expenses, clients, tags, cards, rules, and cleanup items. No backend. All data is local. Use existing app logic whenever possible.

## Tech Stack
- Expo SDK 54, Expo Router (file-based routing)
- React Native, JavaScript (no TypeScript type annotations even though files are .tsx)
- AsyncStorage for persistence
- expo-image-picker for camera
- Context API for state (store.tsx)

## Project Location
C:\Users\caleb\ReceiptApp

## File Structure
store.tsx — all state, AsyncStorage, CRUD functions
app/_layout.tsx — root layout, StoreProvider, RootLayoutInner guard
app/(tabs)/_layout.tsx — bottom tab navigator (lazy: true)
app/(tabs)/index.tsx — clients dashboard (main screen)
app/(tabs)/explore.tsx — transaction search and filtered cleanup lists
app/(tabs)/tax.tsx — tax analytics
app/client-detail.tsx — per-client transaction list, detail sheet, multi-select, cleanup actions
app/settings.tsx — settings screen (gear icon in home header)
app/rules.tsx — rules, tags, and cards management
constants.ts — ACCENT color constant and shared values
docs/FINDINGS.md — full audit findings from automated session
docs/NEXT_PROMPTS.md — ready-to-run Claude Code prompts in priority order
docs/CLAUDE_CODE_RULES.md — detailed safe patterns and rules for future sessions

---

## Data Models

Client:
{ id, name, color, initials, photoUri }

Transaction:
{ id, clientId, merchant, amount, date, note, receipt, receiptUri, invoiced, invoiceId, invoiceLabel, invoiceDate, flagged, tagIds, cardId }

Important field notes:
- receiptUri is the real source of truth for whether a receipt exists. Do not rely on the receipt boolean alone.
- tagIds is always an array. Empty array and undefined both mean untagged.
- flagged is a boolean. true means the transaction was flagged by a rule and needs review.
- cardId is optional. Not all transactions have a card assigned.

---

## Claude Code Role

You are the execution tool.

You do not plan features.
You do not refactor.
You do not rewrite files.
You do not redesign.
You do not make decisions about what should be built.
You make small, controlled patches only.

If anything is unclear, stop and explain what is missing or ambiguous. Do not guess. Do not improvise.

If a task seems bigger than what was requested, stop and explain why before proceeding.

If asked to inspect code, do not edit anything. Show only the relevant code and wait for the next instruction.

---

## Session Rules
- Claude.ai = planning, writing Claude Code prompts, reviewing pasted code before Claude Code fixes anything. Never let Claude Code self-diagnose and fix errors without first pasting the file here for review.
- Claude Code = applying small patches only. Not for thinking. Not for rewrites.
- Update both master files at end of every session, or when token usage feels heavy mid-session.
- Use /clear in Claude Code after each finished feature to save tokens.
- One feature at a time. Be specific about what's broken when reporting bugs.
- When user says "next feature" — provide the prompt immediately, briefly explain what it does and why it is safe, confirm what file will be touched. Always include the full prompt ready to paste.

---

## POST-PATCH LOGGING RULE

After any patch that changes visible UI, behavior, navigation, data, or workflow:

- Do not log immediately.
- Ask the user exactly:
  "Did it work? y/n"

- If the user responds with:
  y / yes:
    → append a concise entry to docs/SESSION_LOG.md

  n / no / ignore / no confirmation:
    → do not log
    → wait for further instruction

Only ask this question when the change would require logging if successful.

Do NOT ask this question for:
- inspection prompts
- no-op changes
- failed or unclear patches

Do NOT use wording like:
"Should I log this?"

---

## Absolute Rules
These apply to every single prompt, no exceptions.

- One file at a time
- Minimal patch only
- Do not refactor
- Do not rewrite files
- Do not convert to TypeScript
- Do not change styles unless the task specifically requires it
- Do not touch store.tsx unless explicitly required by the task
- Do not change data models unless explicitly required
- Do not invent missing logic
- Always use existing functions for data writes
- If the required write function does not exist, stop and explain what is missing
- Do not silently create alternate persistence paths
- Do not batch unrelated fixes
- Do not clean up surrounding code
- Do not rename variables unless required
- Do not add packages unless explicitly approved

---

## Standard Prompt Constraint
Every Claude Code prompt should end with:

"Do not refactor. Do not rewrite the file. Do not change styles. Do not convert to TypeScript. Do not touch any other files. Minimal patch only."

---

## Execution Discipline
- Never invent missing logic
- Always use existing functions for data writes
- If a function is missing, STOP and explain instead of guessing
- Treat any change to store.tsx as high risk — never modify it as a side effect of fixing something else
- Reduce ambiguity in prompts — vague prompts produce unexpected changes
- Prefer the smallest safe change — if something can be done in 5 lines, do not write 50
- Protect build order — do not jump to later features before earlier ones are stable
- Call out small inconsistencies immediately instead of silently working around them

---

## Prompt Safety By Task Type

If task is UI only:
- Do not change any logic
- Do not change data flow
- Only change what is visible

If task is data writing:
- Use existing functions only
- Stop if the required function is missing
- Do not create new persistence paths

If task is navigation:
- Do not change unrelated navigation
- Check what params are already being passed before adding new ones

If task is modal or back behavior:
- Check onRequestClose first
- BackHandler alone is not enough when a Modal is open on Android

If task is keyboard behavior:
- Be careful with KeyboardAvoidingView and ScrollView interactions
- Do not make the Save button harder to reach
- Do not broadly refactor the layout

---

## Handler Safety Rule
Any handler that uses selectedClient must guard it before accessing any property.

Never access selectedClient.name or selectedClient.id without first checking:
  if (!selectedClient?.id || !selectedClient?.name) return;

This applies to: handleEdit, handleSaveEdit, handleDelete, handleColorChange, handleChangePhoto

---

## Async Safety Rule
If a handler uses selectedClient or selectedTx inside an async function, those values can become null while the async operation is running. For example, if the user taps the backdrop while the camera is open, selectedTx becomes null before the camera result comes back.

Always capture the values you need BEFORE the first await:
  const txId = selectedTx?.id;
  const clientId = selectedClient?.id;
  if (!txId) return;

Then use txId and clientId after async calls. Never read selectedTx.id or selectedClient.id after an await.

---

## Data Mutation Rules
Treat data writes as high risk.

For creating, cloning, editing, deleting, or moving transactions:
- Use existing app functions only
- Do not manually mutate arrays unless that is already how the file works
- Do not bypass AsyncStorage logic
- Do not create new persistence systems
- Do not invent new fields unless explicitly requested
- If the required function is not available in the file, stop and explain what is missing

---

## Debugging Rule
When a bug appears:
1. Identify the file that was most recently changed
2. Inspect and fix only that file first
3. Do not assume the problem is global (AsyncStorage, navigation, cache, store)
4. Do not refactor
5. Show relevant code if the issue is unclear
6. Fix the smallest failing point

Most bugs are local, not systemic. The most recently changed file is almost always the cause.

If asked to inspect code only:
- Do not edit anything
- Show only relevant code
- Wait for next instruction

---

## Known Crash Pattern — Null Client
If error says: Cannot read property 'name' of null

First check app/(tabs)/index.tsx for handlers reading selectedClient without guards.

Guard pattern:
  if (!selectedClient?.id || !selectedClient?.name) return;

Do not rewrite the app.
Do not touch store.tsx first.
Fix the handler locally.

---

## Known Bug Pattern — activeToggleTag
Past bug: activeToggleTag was undefined in the tag modal, causing a crash.

Fix used — do not rely on activeToggleTag as an onPress handler. Use explicit logic instead:

  if (tagModalForEdit) {
    toggleEditTag(tag.id);
  } else {
    toggleTag(tag.id);
  }

Do not reintroduce activeToggleTag as a required onPress path. If you see it being used that way, flag it.

---

## Known Issue — Null Client Console Warning
"Cannot read property 'name' of null" may appear in the console during hot reload.

If the app continues working normally — ignore it completely. This is a known React Navigation pre-render timing issue and does not need to be fixed.

If the app shows a red screen crash, check index.tsx handlers as described above.

Never assume this warning means something is broken without verifying actual app behavior.

---

## UI Rules — Always Follow
- Background color: #0e0e11
- Accent amber: #f59e0b — always use the ACCENT constant from constants.ts, never hardcode this value
- Receipt green: #22c55e
- All styles must use StyleSheet.create — no inline style objects except for one-off dynamic values
- No external UI libraries
- Always guard null data before rendering:
  safeClients = Array.isArray(clients) ? clients.filter(c => c && c.name) : []
- lazy: true on tab navigator — do not remove this
- if (!loaded) return null must be placed AFTER all useState hooks and BEFORE any store-derived variables
- No TypeScript type annotations anywhere — no : string, no <any>, no React.FC, no React.ReactNode

---

## File Risk Levels

store.tsx — VERY HIGH RISK
The entire app depends on this file. One typo breaks every screen. Never modify it as a side effect of fixing something else. Always give it a single focused task.

app/client-detail.tsx — HIGH RISK
The largest file in the project. Has many interdependent state variables, multiple modals, and complex navigation behavior. After any change, test every modal manually.

app/(tabs)/index.tsx — HIGH RISK
The main home screen. Breaking this makes the app unusable. selectedClient null crash originates here.

app/(tabs)/explore.tsx — MEDIUM RISK
Receives route params for filtering. Always test with and without a filter param after changes.

app/(tabs)/tax.tsx — MEDIUM RISK
Math-heavy. Test all dollar calculations after any change.

app/rules.tsx — MEDIUM RISK
Multiple modals and complex form state. Test rules, tags, and cards sections after any change.

app/settings.tsx — LOW RISK
Simple toggle screen. Hard to break.

constants.ts — LOW RISK but HIGH IMPACT
One line that affects every screen. Changes here propagate everywhere.

app/_layout.tsx — HIGH RISK
Breaking the layout stack breaks the entire app.

app/(tabs)/_layout.tsx — MEDIUM RISK
Breaking this breaks tab navigation.

---

## Android Back Behavior
React Native Modal requires onRequestClose on Android. BackHandler alone is not enough when a Modal is open.

client-detail.tsx modals use onRequestClose so Android back closes the active modal or sheet.

Expected behavior in order:
- Receipt viewer closes first
- Edit mode exits before transaction sheet closes
- Transaction detail sheet closes before leaving screen
- Add transaction sheet closes
- Tag modal closes
- Move modal closes
- Normal back works when nothing is open

index.tsx modals have NOT been updated yet. This is a known remaining issue.

---

## Cleanup Flow Status
Cleanup flow is stable. Do not break it.

Current behavior:
- Untagged list opens transaction with Add Tags as primary action
- Missing Receipts list opens transaction with Add Receipt as primary action
- Flagged list opens transaction with Mark Reviewed as primary action
- If transaction has one issue: fix it → return to filtered list
- If transaction has multiple issues: fix first → stay on sheet → fix last → return to filtered list

A transaction still needs cleanup if any of these are true:
- tagIds is missing or empty array
- receiptUri is missing or null
- flagged is true

Always check ALL remaining issues after a fix, not just the one that triggered the filter.

Inline secondary actions are working:
- If transaction is untagged AND missing receipt: both Add Tags and Add Receipt are shown
- First fix keeps sheet open, second fix returns to list

---

## Receipt Rules
Use receiptUri as the source of truth for whether a receipt photo exists.

Known inconsistency: receipt boolean and receiptUri are out of sync in older and seed data. Do not casually fix this globally. Full cleanup requires updating display logic, tax calculations, missing receipts filter, and seed data simultaneously. Do not patch as a side effect of another task.

---

## Search / Explore Tab
The visible tab label says Search.
The file is app/(tabs)/explore.tsx.

Search/Explore now acts as a cleanup workspace, not just search. It handles:
- Missing Receipts filter
- Untagged filter
- Flagged filter
- Tax Missing Receipts destination
- Empty states including "Everything is tagged." and "All clear."

Do not rename the tab yet. Decision is pending until Fix All mode is built.

---

## Tax Screen
Tax Missing Receipts card is built and working.

Meaning:
- Shows total unreceipted expense amount
- Shows estimated tax savings not secured based on bracket
- Taps into Explore filtered to Missing Receipts
- source=tax param makes Android back return to Tax screen

Do not break this flow.

---

## What's Built and Working

### Client Management
- Clients list: add, edit name, delete, change color via long press menu
- Client multi-select delete on home screen
- Tile view and list view toggle on clients screen
- Client thumbnail photo (falls back to initials and color avatar)
- Client detail shows "Client not found." fallback with back button instead of blank screen

### Transaction Management
- Client detail screen with pending and invoiced transaction sections
- Invoice flow: mark pending transactions as invoiced with label and date
- Add transaction: merchant, amount, note, receipt photo, tags, card used
- Merchant autocomplete — saves past merchants and suggests as you type
- Tag picker: top 8 most used tags shown, plus button opens full modal with search and create
- Edit transaction: same fields including tags
- Long press transaction: enters multi-select mode with checkboxes
- Multi-select: Select All, Delete Selected with confirm, Move to Client, auto-exits after action
- Delete transaction: trash icon top-right of detail sheet with confirmation
- Note warning: alert when saving a transaction with no receipt and no note
- Card used displays in transaction detail sheet when cardId is set

### Receipt Handling
- Receipt photo capture and thumbnail display
- Tap thumbnail: opens full screen receipt viewer with close button
- Add Receipt button on transactions without a photo
- Replace Receipt button when receipt exists — retakes and overwrites
- Remove Receipt button when receipt exists — clears photo and receiptUri
- receiptUri is treated as the real source of truth for receipt existence

### Cleanup Flow System
- Needs Attention section on home screen: flagged, missing receipts, untagged counts — hidden when all clean
- Tapping a Needs Attention row navigates to Explore with the correct filter applied
- Explore reads filter param and shows only matching transactions
- Explore shows contextual empty states
- Tapping a transaction in Explore navigates to client-detail with that transaction auto-opened
- Quick action buttons appear in transaction detail when opened from a cleanup filter
- Inline secondary cleanup actions working
- Smart return behavior: one issue → fix → return, multiple issues → fix first → stay → fix last → return
- Mark Reviewed button appears on flagged transactions
- After adding receipt from Missing Receipts flow → returns to list when resolved
- After editing from any filtered flow → returns to that filtered list when resolved
- Delete from filtered list returns to filtered list

### Rules and Automation
- Rules screen: IF/THEN condition builder
- Rules engine runs on every new transaction and applies all matching rules automatically
- Add Rule button in transaction detail opens rules screen with merchant pre-filled

### Tags and Cards
- Tags system: create, edit, delete, preset tags, color dots
- Cards system: create, edit, delete cards with strategy label

### Search and Explore Tab
- Searches across merchant, client name, and note fields
- Reads filter param from URL and shows filtered results
- Handles source=explore and source=tax params for correct back navigation
- Shows empty states when filter returns no results

### Tax Tab
- Dynamic current month and year header
- User-adjustable tax bracket
- Yearly summary with total logged, estimated tax savings, and by-client breakdown
- Amount formatting uses Number() coercion — safe against string amounts
- Export buttons show "Coming soon" alert
- Missing Receipts card navigates to Explore filtered to missing receipts

### Navigation and UX
- Back button has 44px tap target minimum
- Android modal back closes sheets correctly in client-detail using onRequestClose
- Floating + button on home screen → client picker → Add Transaction
- ACCENT constant used everywhere — amber color never hardcoded

### Storage and State
- Persistent storage: all data survives force close
- selectedClient handlers in index.tsx are all null-safe
- Simulate transaction button removed
- Settings screen: round number gas detection toggle

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
Described in Receipt Rules above. Do not casually fix.

---

## Do Not Build Yet
Do not build any of these unless explicitly requested in a prompt:

- No Receipt button (requires receiptStatus data model first)
- receiptStatus field on transactions
- Fix All / Cleanup Mode
- Recently Edited filter (requires updatedAt in store first)
- Search tab rename
- Expense Buckets vs Clients data model change
- Notification listener
- Later queue
- PDF export
- Full cleanup checklist redesign
- Drag reorder clients
- Client groups
- Mileage tracking
- Hours tracker

---

## Temporary Dev Tools

### Clone Transaction Button
A future temporary tool for testing cleanup flows with mixed transaction states.

Rules if building when requested:
- Must be clearly marked as a temp test button in the UI
- Must be removable before release
- Must use existing addTransaction logic only
- Must NOT touch store.tsx directly unless explicitly approved
- Must mark cloned transaction notes with "__test_clone__"
- Must not alter the original transaction
- If the existing transaction creation function is not available in the file, stop and explain

Do not build automatically. Wait until explicitly requested.

---

## Future Concepts — Do Not Build Yet

### Cleanup Checklist in Transaction Detail
Future transaction detail may show a checklist: Add Tags / Add Receipt / No Receipt.
Fixed items become checked or greyed. Remaining items stay highlighted.
Requires receiptStatus data model before No Receipt can be added.

### Receipt Status Field
Future data model addition: receiptStatus with values attached / missing / unavailable.
Needed before No Receipt button can exist.
Requires coordinated store change — do not patch casually.

### Fix All / Cleanup Mode
Future mode: Fix All button on filtered lists enters a queue.
User processes items quickly with Next / Skip / Exit controls.
Primary action opens immediately per filter type.
Do not build until cleanup button polish and smart return are fully stable.

### Recently Edited Filter
Future Explore filter showing transactions sorted by updatedAt newest first.
Requires adding updatedAt timestamp to store editTransaction function first.
Do not build as an Explore-only patch.

### Transaction Context Label
Future UI addition: small client label with client color shown inside transaction detail sheet.
Helps user understand context during cleanup flows.
Do not build until explicitly requested.

### Cleanup Button Visual States
Future polish: active issues highlighted, resolved issues greyed or checked, secondary actions styled softer.
Inactive actions should never look clickable.
Do not build until explicitly requested.

---

## Cleanup Flow Edge Case Matrix
Use this to verify cleanup behavior is correct after any change to client-detail.tsx or explore.tsx.

CASE 1: tags present, receipt present
→ no cleanup buttons shown, normal transaction inspect only

CASE 2: tags missing, receipt present
→ Add Tags shown as primary, after saving tags → return to Untagged list

CASE 3: tags present, receipt missing
→ Add Receipt shown as primary, after saving receipt → return to Missing Receipts list

CASE 4: tags missing, receipt missing
→ both shown, fix first → stay on sheet, fix second → return to filtered list

CASE 5: tags added during session, receipt still missing
→ Add Tags updates to resolved state immediately, Add Receipt stays active

CASE 6: receipt added during session, tags still missing
→ Add Receipt updates to resolved state immediately, Add Tags stays active

CASE 7: user edits merchant name or amount
→ does NOT affect cleanup state, buttons unchanged after saving edits

CASE 8: receiptUri present but receipt boolean false
→ still counts as having a receipt, receiptUri is source of truth

CASE 9: tagIds is empty array vs tagIds is undefined
→ both mean untagged, both trigger Add Tags

CASE 10: transaction note contains __test_clone__
→ treated as a normal transaction, cleanup applies normally

CASE 11: transaction opened from Tax screen
→ Android back should return to Tax screen, source=tax handles this

CASE 12: transaction opened from Explore with filter
→ after fix → returns to that filtered Explore list, source=explore and returnFilter handle this

CASE 13: user presses Android hardware back mid-cleanup
→ should close modal or sheet cleanly, should not crash, should not leave user stuck

CASE 14: user makes multiple edits before closing
→ state should remain stable, no desync between displayed and stored values

CASE 15: user deletes transaction while in filtered cleanup list
→ should return to filtered list, should not leave user on client page

---

## Next Steps (in order)
1. Remove Copy Debug Info button from client-detail.tsx — one prompt, one line, zero risk
2. Fix keyboard blocking Save button in Add/Edit transaction sheets — careful approach, one file only
3. Add Clone Transaction button as temp dev tool — uses existing addTransaction, marks with __test_clone__
4. Polish cleanup action button visual states — active highlighted, resolved greyed, secondary softer
5. Add compact client label to transaction detail sheet — small colored label showing which client
6. Android back button closes modals in index.tsx — one modal at a time, test thoroughly
7. Recently Edited filter in Explore — requires store updatedAt change first
8. Cleanup Mode (Fix All) — after button polish is stable
9. Notification listener for real Android bank notifications
10. Later queue with reminder notifications — requires notification listener first
11. End of month command screen and invoice generation
12. PDF invoice export

---
## Workflow Rules


### PATCH CONFIRMATION FLOW (LOCKED)

After any patch that changes visible behavior, ask exactly:
"Did it work? y/n"

A patch enters a pending state after this question.

Resolution rules:

- y → log success
- n / no → do not log, treat as failed

- If the user moves on without answering:
  → assume the patch worked
  → log it before starting the next patch

- If the user retries the same fix or reports the issue still exists:
  → treat the pending patch as failed
  → do not log it

- If the user later says "y":
  → it applies ONLY to the most recent pending patch
  → never apply "y" to older patches

- Never allow more than one pending patch at a time
- Always resolve the current patch before starting another

- When a patch is auto-resolved due to user moving on:
  → log it immediately before starting the next patch
  → mark it as assumed success (no explicit "y")

- After auto-resolve, no further confirmation should apply to that patch

## Workflow Modes

### Normal Mode
One small prompt. One patch. User tests. Continue.
This is the default mode for all development work.

### Night Mode — User Is Stepping Away
Trigger: user says something like "need to burn tokens, going to sleep" or "I'm stepping away for the night"

What this means: The user is walking away and wants Claude Code to keep working through a batch of safe tasks unattended. The goal is to use remaining session tokens on real productive work instead of sitting idle.

How to handle it:
1. Identify the next 3 to 5 tasks from the Next Steps list that are LOW risk and touch only one file each
2. Write all the Claude Code prompts back to back, clearly numbered
3. Include test instructions after each prompt so the user can verify in the morning
4. Add a SESSION_LOG.md instruction so Claude Code documents what it changed after each patch
5. Remind the user to do /clear before starting the batch, then paste all prompts in sequence

Rules for this mode:
- Only LOW risk tasks — one file per prompt
- No store.tsx changes unless absolutely required and explicitly confirmed
- No refactors, no style changes, no TypeScript
- Every prompt must include the standard safety constraint line
- If Claude Code hits something unexpected mid-batch, it should stop and add the issue to STOPPED_AT.md instead of guessing
- Do not chain prompts that depend on each other — each must be independently testable

Goal: User wakes up to a list of completed safe fixes and a SESSION_LOG.md showing exactly what changed and what was skipped.

### Pre-Reset Mode — Session Tokens Running Out
Trigger: user says something like "need to burn tokens, session is resetting" or "running out of tokens"

What this means: The session context is about to reset and the user does not want to lose the value of remaining tokens. There is not enough time to safely run Claude Code patches. Instead the goal is to generate as many reusable planning assets as possible before the reset.

How to handle it:
Switch immediately to high-density output mode. Stop step-by-step pacing. Generate everything useful in one or two large responses with no filler and no padding.

Best things to generate in this mode:
- Edge case matrices for features currently being built
- Test transaction datasets with mixed states (missing tags, missing receipt, both missing, complete)
- Full prompt libraries for upcoming Claude Code tasks, written and ready to paste
- Failure mode checklists for recent changes
- Roadmap compression and conflict cleanup
- Naming standardization audit — are field names consistent across files?
- Data model audit observations — NOT implementation, just notes
- UI state scenario maps — every combination of transaction state and what the UI should show
- SESSION_LOG summaries if any exist

Rules for this mode:
- No destructive changes
- No multi-file code edits
- No refactors
- Everything generated must be safe, local, and reusable
- Prefer generation over modification
- Output must be dense — no filler, no step-by-step explanation, no padding

Goal: Convert leftover tokens into documents, datasets, and prompt libraries that would normally take multiple sessions to produce. Nothing gets lost to the reset.

---

## Important Final Behavior Rules

If asked to modify code:
- Stay narrow
- Assume nothing about intent
- Use existing logic only
- Stop if pieces are missing
- Do not improvise

If task seems bigger than what was requested:
- Stop and explain why before doing anything

If session is near reset or user says "burn tokens":
- Switch to the appropriate mode above immediately
- Do not continue normal step-by-step flow

Always prefer inspecting before editing when uncertainty exists.
Never assume state or structure.
If task becomes large or stalls, split by file and continue.

If this patch causes a regression, do not attempt a second fix on top of it. Revert the patch or stop and show the changed JSX/code.

POST-PATCH LOG QUESTION RULE

After a patch, do not ask:
"Should I log this?"

Instead ask:
"Did it work? y/n"

Only suggest logging when the patch is likely a real behavior/UI change.

If the user confirms yes, append the SESSION_LOG entry.
If the user says no or has not tested yet, do not log.

---

## DOC BOUNDARY RULE

CLAUDE.md is for Claude Code execution rules and stable app guardrails only.

Do NOT add to this file:
- roadmap items
- new feature ideas
- temporary thoughts
- session summaries
- logs
- speculative plans

Use:
- docs/SESSION_LOG.md for confirmed code changes
- ROADMAP for ideas, planning, and future features
- LOCKED_ATTRIBUTES for permanent planning-AI behavior rules

Only update CLAUDE.md when explicitly changing Claude Code execution behavior or stable app guardrails.

If a prompt attempts to modify CLAUDE.md outside execution rules or stable guardrails:
→ STOP and explain instead of editing.

---

## CLEAR USAGE RULE

Use /clear when:
- switching features
- context becomes unclear
- Claude Code begins drifting
- a previous patch caused confusing behavior

Do NOT clear between small related patches in the same feature thread.

When the user says "clear" or asks to clear Claude Code:

1. Automatically run wrap session first:
   - Read docs/SESSION_LOG.md
   - Read docs/system/CURRENT_HANDOFF.json
   - Sync completed work and working features
   - Update ROADMAP if needed
   - Report what was synced

2. Then remind the user:
   "Wrap complete. Now run these in PowerShell before clearing:
   git add .
   git commit -m 'pre-clear backup'
   Then run /clear and paste the starter block."

3. Provide the starter block ready to paste after /clear.

Do this automatically. Do not wait for the user to say wrap session separately.

---

## CLAUDE.md IMMUTABILITY RULE

Claude Code must not modify CLAUDE.md unless:
- the user explicitly asks for a specific change
- the change is narrowly scoped
- the exact wording is provided

Claude Code must NOT:
- rephrase rules
- compress rules
- merge rules
- remove “duplicate” rules
- reorganize sections
- clean up wording for style

If a prompt asks for broad cleanup of CLAUDE.md:
→ STOP and explain instead of editing.

---

## POST-PATCH CONFIRMATION RULE

After any patch that changes visible UI, behavior, navigation, data, or workflow:

Ask exactly:
"Did it work? y/n"

Do NOT:
- ask longer questions
- mention logging
- assume success

User response:
- y / yes → append a concise entry to docs/SESSION_LOG.md
- n / no / ignore / no confirmation → do not log, wait for next instruction

Only ask this when the patch would require logging if successful.

Do NOT ask this for:
- inspection prompts
- no-op changes
- failed patches
- unclear patches

Do NOT ask:
"Should I log this?"

---

## REGRESSION RULE

If a patch makes behavior worse:

- Do not stack another fix on top of the broken patch
- Revert the patch if safe
- Or stop and show the changed code/JSX
- Return to the last known working state before attempting another fix
- Do not fix forward through a broken layout unless there is no safe revert

## DOC CLEANUP COMMAND

When user says "clean up docs" or "run doc cleanup":

1. Read docs/system/DOC_CLEANUP_PROMPT.md
2. Execute exactly what it says
3. Report what moved, what duplicates were removed, what was left in place
4. Confirm no content was rewritten, compressed, or removed
5. Do not touch any app code
6. Do not touch any .tsx files
7. Stop after reporting

Do not run this automatically. Only run when explicitly triggered.

## SYSTEM FILES LOCATION

All planning and system files live in docs/system/

- LOCKED_ATTRIBUTES.md = permanent behavior rules
- HANDOFF_RECEIVER.md = session bootstrap behavior
- HANDOFF_GENERATOR.md = how to generate handoff JSON
- ROADMAP.md = future ideas not being built now
- CLAUDE_CLEVER_IDEAS.md = saved ideas
- CURRENT_HANDOFF.json = latest session state
- DOC_CLEANUP_PROMPT.md = reorganization prompt

When modifying these files:
- Read the full file first
- Make only the requested change
- Do NOT compress, rewrite, or summarize
- Do NOT remove anything unless explicitly told

Rule files require user approval before changes:
- LOCKED_ATTRIBUTES.md
- HANDOFF_RECEIVER.md
- HANDOFF_GENERATOR.md
- CLAUDE.md

Safe to update with explicit instruction:
- ROADMAP.md
- CURRENT_HANDOFF.json
- docs/SESSION_LOG.md

## SESSION WRAP COMMAND

When user says "wrap session":

1. Read docs/SESSION_LOG.md
2. Read docs/system/CURRENT_HANDOFF.json
3. Read docs/system/ROADMAP.md

4. For every confirmed change in SESSION_LOG:
   - Add it to completed_work in CURRENT_HANDOFF.json if not already there
   - Move it from Next Steps to Recently Completed in ROADMAP if applicable
   - Mark it with ✔ if not already marked

5. Update current_state.working_features in CURRENT_HANDOFF.json
   to reflect actual current app state from SESSION_LOG

6. Report:
   - What was added to completed_work
   - What moved in ROADMAP
   - What working_features were updated
   - Confirm nothing was removed or compressed

7. Do not touch app code
8. Do not touch any .tsx files

After completing the wrap, remind the user:
"Session wrapped. Run the handoff generator now before starting a new chat."

Stop after reporting.

After the wrap report, always end with this exact format:

---
NEXT ACTIONS

1. PowerShell:
git add .
git commit -m "pre-clear backup"

2. Run /clear in Claude Code

3. Paste this starter block immediately after clearing:

[starter block here]
---

Keep the wrap report brief. End every wrap with this clean action block.
The user should be able to scroll to the bottom and immediately know what to do next.

End of file.
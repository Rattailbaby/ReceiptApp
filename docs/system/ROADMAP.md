ROADMAP & PLANNING FILE
Last updated: April 2025
(Paste this file when talking to Claude.ai for planning sessions)

---------------------------------------------------------------------------------------------------

## ⚠️ SOURCE OF TRUTH RULE

GLOBAL RULE

If a feature does not directly support:
Capture → Assign → Organize → Invoice → Clean Slate

It does not belong in the current version of the app.

This roadmap is long-term planning context.

For the current exact state and next action, use in this order:
1. LOCKED_ATTRIBUTES.md
2. HANDOFF RECEIVER + latest JSON handoff
3. This roadmap

If this roadmap conflicts with the latest JSON handoff:
- JSON wins for current execution decisions
- Roadmap wins for long-term ideas and feature direction

------------------------------------------------------------------------------------------------------

## What Is This App

Uncrumple is a React Native mobile app for Android tradespeople to track receipts and expenses by client/project. Target price: $1 on Play Store. No backend — all data stored locally via AsyncStorage.

It is not a receipt tracker. Not a time tracker. Not a photo app.

It is a field work system that captures everything once and organizes it automatically so you can get paid and stay organized without thinking about it constantly.

Core loop: Capture → Assign → Organize → Invoice → Clean up

Every feature must support this loop. If it does not, it does not belong yet.

------------------------------------------------------------------------------------------------------------

## App Identity

- Name: Uncrumple (locked in)
- Target: Android tradespeople and contractors

### The Logo Story

The logo concept comes from a real moment everyone has had: finding a receipt in your jeans pocket before laundry and having to smooth it out on the counter to read it. Half crumpled, half flat. That in-between moment is the whole app — catching things before they are gone and making them organized.

Crumpled paper ball becoming flat. That is Uncrumple.

------------------------------------------------------------------------------------------------------

## Emotional Design — How The App Should Feel

This needs to be written down so every future feature gets evaluated against it.

The app should feel like a good tool. Not like software. A good tool is there when you need it, stays out of the way when you do not, and makes the work feel more manageable not more complicated.

**Fast.** Opening the app and adding a transaction should take less than 30 seconds. If it takes longer the tool is getting in the way of the work.

**Satisfying.** Checking things off, seeing totals go down, watching the Needs Attention count drop to zero — these moments should feel good. Small animations, clean states, the Clean Slate moment. The app rewards doing the work.

**Trustworthy.** Nothing gets lost. Every transaction is saved. The app does not surprise you. If you captured it, it is there. If something needs attention the app tells you clearly without yelling.

**Forgiving.** You can always go back and fix something. Nothing is permanent except deletes and those have confirmations. You can add a receipt later. You can change the client. You can edit the amount. The app understands that real work is messy and lets you clean it up on your terms.

**Invisible when things are good.** When everything is organized the app gets out of your way. The home screen is clean. There is nothing demanding your attention. You pick up the phone, add a transaction, put it down. That is the whole interaction most days.

**Rewarding at the end of the month.** The invoice moment. The Clean Slate moment. This is when all the small daily captures pay off. The user should feel like the app worked for them, not the other way around.

Every feature should be evaluated against these feelings. If a feature makes the app feel more complicated, slower, or harder to trust — it does not belong yet regardless of how clever it is.

------------------------------------------------------------------

## "Loose Ends" — Naming System

When transactions or items in the app are unassigned, missing data, or need attention, the internal concept for this is "Loose Ends." This is the language that makes sense to a tradesperson — not "unassigned items" or "incomplete records" but loose ends. Things that are still dangling that need to be tied off before the job is done.

This naming should influence future UI copy wherever possible:
- "You have 3 loose ends" instead of "3 items need attention"
- The Needs Attention section could eventually be renamed "Loose Ends"
- The cleanup flow is essentially a loose ends resolution system

Do not rename anything in the app yet. Keep this as a naming direction to apply when UI copy is written for future features.

---------------------------------------------------------------------------------------------------

## How We Work

- Two master files: this one (planning) and CLAUDE_CODE_MASTER.md (technical, paste into Claude Code)
- Claude.ai (here) = planning, prompt writing, reviewing pasted code before Claude Code fixes anything. Never let Claude Code self-diagnose and fix errors without first pasting the file here for review.
- Claude Code = applying small patches only. Not for thinking. Not for rewrites.
- Update both master files at end of every session, or when token usage feels heavy mid-session.
- When starting a new chat paste this roadmap and say: "Continuing Uncrumple development. Here is my roadmap. Read it fully before we do anything."
- When user says "next feature" — provide the prompt immediately, briefly explain what it does, confirm file being touched. Always include the prompt. Do not ask for confirmation before writing it.

---------------------------------------------------------------------------------------

## ⚠️ PROMPT SAFETY RULES — ALWAYS FOLLOW

These rules exist because batched multi-file prompts caused a major crash and wasted hours of tokens. Never repeat this.

### One file at a time
- Never ask Claude Code to touch more than one file unless absolutely unavoidable
- If a feature needs multiple files, split it into separate prompts and test between each one
- Bad: "Touch store.tsx, settings.tsx, and index.tsx"
- Good: "Fix only app/(tabs)/index.tsx. Do not touch any other files."

### Smallest possible patch
- Never ask Claude Code to rewrite, refactor, reorganize, or clean up unless explicitly asked
- Never let it convert to TypeScript
- Never let it rename things or change styles unless that is the entire task
- Always end prompts with: "Do not refactor. Do not rewrite. Minimal patch only."

### Never combine logic + UI + storage in one prompt
- Split connected features into steps: store logic → test → UI → test → navigation → test
- Each step = one small Claude Code prompt

### Never paste full files unless debugging
- Instead of pasting all of index.tsx, paste only the broken function
- Claude Code rereads the whole file anyway — you don't need to send it

### Always include in every Claude Code prompt
"Do not refactor. Do not rewrite file. Minimal patch only. Do not change styles. Do not convert to TypeScript."

------------------------------------------------------------------------------------

## ⚠️ DEBUGGING RULE — NULL CLIENT CRASH

If the app crashes with: TypeError: Cannot read property 'name' of null

First check app/(tabs)/index.tsx for:
- selectedClient.name
- selectedClient.id
- any handler that reads from selectedClient without guarding it first

Fix pattern — every handler must guard before reading:
```
if (!selectedClient?.id || !selectedClient?.name) return;
```

Before touching store.tsx, AsyncStorage, navigation, or cache — make sure every handler and render path is null-safe first. Do not solve this by rewriting the app. Do not solve it by converting to TypeScript. Do not solve it by changing unrelated screens.

---------------------------------------------------------------------------

## ⚠️ CONSOLE WARNING — DO NOT CHASE

"Cannot read property 'name' of null" on hot reload is a known pre-render timing issue. NOT a crash. If app has red screen, the cause is always the most recently edited file — not this warning.

------------------------------------------------------------------------

## ⚠️ GENERAL BUILD PHILOSOPHY

When a feature has a big vision but missing dependencies, don't build the full thing — build the foundation and note what's waiting. Build the smallest useful version first, layer the rest on top later. If something needs a dependency that isn't built, save the full vision in Saved Ideas and only build what works right now.

---------------------------------------------------------------------------------------------------

## Current Working State

- selectedClient null crash is fixed — all handlers in index.tsx are null-safe
- Needs Attention → Explore navigation is done
- Explore filter logic is done (flagged / missing / untagged)
- Tap transaction in Explore → opens client detail with transaction auto-opened
- Return to filtered list after save — works both directions
- Smart return behavior: first fix stays on sheet, second fix returns to filtered list
- Mark Reviewed implemented and integrated but needs full flow verification
- Quick action buttons in transaction detail when opened from cleanup filters
- Inline secondary cleanup actions working (Add Tags + Add Receipt when both missing)
- Android back closes modals correctly in client-detail using onRequestClose
- Client multi-select delete works on home screen
- Card used displays in transaction detail when cardId is set
- Explore empty states working including "Everything is tagged."
- Clone tool exists for testing — marks clones with __test_clone__ — remove before release
- Add/Edit sheet layout is stable enough — do not touch sheet layout unless a real bug appears
- Tax screen: dynamic header, safe formatting, Missing Receipts card navigates to Explore

---------------------------------------------------------------------------------------------------------

## Current Known Risks

- txNeedsCleanup is the canonical cleanup check: receipt missing OR tags missing OR flagged
- Some handlers currently duplicate cleanup checks inline instead of calling txNeedsCleanup
- This works now but could drift later — do not refactor until cleanup flow is verified stable
- receipt boolean and receiptUri are inconsistent in older/seed data — do not casually fix
- Keyboard blocking Save button in Add/Edit transaction — previous fix attempt collapsed the sheet, reverted

------------------------------------------------------------------------------------------------

## Next Steps (in order)

1. Inspect flagged transaction flow end-to-end before touching anything
2. Verify Mark Reviewed clears flagged state and transaction disappears from filtered list
3. Confirm flagged flow uses same return and context behavior as Untagged and Missing Receipts
4. Fix any drift between txNeedsCleanup and inline checks if found
5. Fix keyboard blocking Save button in Add/Edit transaction sheets — careful approach only
6. Polish cleanup action button visual states
7. Add compact client label to transaction detail sheet
8. Android back button closes modals in index.tsx — one modal at a time

------------------------------------------------------------------------------------------------------------------

## Recently Completed

- Explore "More tags" split: dropdown stays top 8 (usage-desc + alphabetical tiebreak), full Modal browses all tags alphabetically ✔
- Tag modal in client-detail: keyboard stays open while creating tags; keyboardShouldPersistTaps='handled' + tagSearchRef refocus ✔
- Tag modal Create Tag mode: header/placeholder/bottom button switch on noMatch; Create Tag press calls handleCreateTag and keeps modal open ✔
- Search → tap transaction → Close now returns to Search instead of stranding on client page (router.push always carries source=explore + context; closeTxDetail guard relaxed) ✔
- selectedClient null crash fixed — all handlers in index.tsx are null-safe
- Needs Attention rows navigate to filtered Explore lists ✔
- Explore filter logic built ✔
- Tap transaction in Explore → client detail with auto-open ✔
- Return to filtered list after save ✔
- Mark Reviewed button on flagged transactions ✔
- Quick action buttons in transaction detail when opened from cleanup filters ✔
- Tag modal crash fixed (activeToggleTag → explicit toggle logic) ✔
- Add Tags from Untagged saves correctly and returns to list ✔
- Inline secondary cleanup actions (Add Tags + Add Receipt when both missing) ✔
- Smart return: first fix stays on sheet, second fix returns to filtered list ✔
- Android modal back fixed using onRequestClose ✔
- Client multi-select delete on home screen ✔
- Card used displays in transaction detail ✔
- Explore empty states including "Everything is tagged." ✔
- Tax screen: dynamic month/year header ✔
- Tax export buttons show "Coming soon" alert ✔
- Tax Missing Receipts card shows unreceipted amount + estimated savings not secured ✔
- Tax Missing Receipts card navigates to Explore filtered to missing receipts ✔
- Explore handles source=tax so Android back returns to Tax ✔
- Client detail shows "Client not found." fallback with back button ✔
- Tax amount formatting uses Number() coercion ✔
- Clone tool added for testing ✔
- Settings screen at app/settings.tsx — gear icon in home header ✔
- Round Number Gas Detection — toggle in settings ✔

------------------------------------------------------------------------------------------------------------------

## What's Built and Working

- Clients list: add, edit name, delete, change color via long press menu
- Client multi-select delete on home screen
- Tile view / list view toggle on clients screen
- Client thumbnail photo (falls back to initials/color)
- Client detail screen with pending/invoiced transaction sections
- Client detail shows "Client not found." fallback with back button
- Invoice flow: mark pending transactions as invoiced with label and date
- Add transaction: merchant, amount, note, receipt photo, tags, card used
- Merchant autocomplete — saves and suggests as you type
- Tag picker: top 8 most used + button opens full modal with search/create
- Edit transaction: same fields including tags
- Receipt full screen viewer (tap thumbnail)
- Replace Receipt and Remove Receipt buttons when receipt exists
- Add Receipt button on transactions without a photo
- Long press: multi-select with Select All, Delete Selected, Move to Client
- Delete transaction: trash icon top-right of detail sheet
- Add Rule button on transaction detail — opens rules with merchant pre-filled
- Mark Reviewed button on flagged transactions — clears flag, returns to flagged list
- Quick action buttons in transaction detail when opened from cleanup filters
- Inline secondary cleanup actions
- Smart return after fix
- Note warning: alert when saving with no receipt and no note
- Persistent storage
- Search / Explore tab: reads filter param, shows filtered results, contextual empty states
- Explore handles source=tax and source=explore for correct back navigation
- Needs Attention → Explore filter flow: full end-to-end working
- Tax tab: dynamic current month/year header
- Tax tab: user-adjustable tax bracket, yearly summary, estimated savings, by-client breakdown
- Tax tab: amount formatting uses Number() coercion
- Tax tab: export buttons show "Coming soon" alert
- Tax tab: Missing Receipts card navigates to Explore filtered to missing receipts
- Back button: 44px tap target
- Android modal back closes sheets correctly in client-detail using onRequestClose
- ACCENT constant in constants.ts — never hardcoded
- Floating + button on home screen → client picker → Add Transaction
- Rules screen: IF/THEN condition builder (merchant contains, amount over, card used → tag as, flag for review)
- Rules engine: runs on every new transaction, applies all matching rules
- Tags system: create/edit/delete, preset tags, color dots
- Cards system: create/edit/delete cards with strategy label
- Settings screen: round number gas detection toggle
- Round number gas detection: gas station + round/repeating amount = auto-tag Fuel
- Needs Attention section on home screen: flagged, missing receipts, untagged — hidden if clean
- selectedClient handlers in index.tsx are null-safe
- Simulate transaction button removed
- Clone tool for testing — marks with __test_clone__ — removable before release
- docs/FINDINGS.md — full audit findings from automated session
- docs/NEXT_PROMPTS.md — ready-to-run Claude Code prompts
- docs/CLAUDE_CODE_RULES.md — detailed safe patterns for future sessions
- docs/SESSION_LOG.md — confirmed change history
- docs/QA_CLEANUP_MATRIX.md — full cleanup flow test matrix
- docs/USER_JOURNEY_MAP.md — complete user journey map

---------------------------------------------------------------------------------------------------------------

## Known Issues

### Keyboard Blocking Save Button
Save button in Add/Edit transaction is partially hidden or crowded by keyboard. Previous fix attempt caused sheet to collapse — reverted. Goal: Save button always reachable while typing without refactoring the layout. Status: Not fixed yet. Deferred until after validation pass.

### Android Back Button in index.tsx Modals
Fixed in client-detail.tsx. Not yet applied to index.tsx modals. Need to audit: add transaction sheet, invoice confirm sheet, client edit modal. Do one modal at a time. Do not batch.

### receipt Boolean vs receiptUri Inconsistency
Seed data has receipt: true with no URI. Green dots may show on transactions with no actual photo. Fix requires updating all references simultaneously: display logic, tax calculations, missing receipts filter, seed data. Do not patch as a side effect of another task.

------------------------------------------------------------------------------------------------

## DATA MODEL (LOCKED FOR NOW)

Transaction:
- id
- clientId
- merchant
- amount
- date
- tagIds: string[]
- receiptUri: string | null
- flagged: boolean
- updatedAt: number (planned)

Rules:
- Do NOT change structure casually
- Do NOT add derived fields unless required
- All UI must rely on this model consistently

Important field notes:
- receiptUri is the real source of truth for whether a receipt exists. Do not rely on the receipt boolean alone.
- tagIds is always an array. Empty array and undefined both mean untagged.
- flagged is a boolean. true means the transaction was flagged by a rule and needs review.
- cardId is optional. Not all transactions have a card assigned.

---------------------------------------------------------------------------------------------

## UI LAYOUT RULES

- Never position UI based on content length
- Always split layout into flexible zone (left) and fixed zone (right)
- Text must truncate, not push layout
- Controls must not shift based on data
- No margin hacks for positioning core elements
- Background: #0e0e11
- Accent amber: use ACCENT constant from constants.ts — never hardcode #f59e0b
- Receipt green: #22c55e
- All styles via StyleSheet.create, no external UI libraries
- lazy as direct prop on Tabs — NOT inside screenOptions
- if (!loaded) return null placed AFTER all useState hooks, BEFORE store-derived variables
- No TypeScript type annotations anywhere
- safeClients = Array.isArray(clients) ? clients.filter(c => c && c.name) : []

---

## STATE OWNERSHIP RULES

- URL = filters, navigation context
- Store = persistent data
- Local state = UI-only (dropdown open, modal state)

Rules:
- Never duplicate filter logic between URL and state
- Always derive UI from URL when possible
- Do not store derived values in store

---------------------------------------------------------------------------------------------

## NAVIGATION CONTRACT

Opening from Home → return to filtered Explore
Opening from Tax → return to Tax
Opening from client → return to client
Modal open → back closes modal first

Rules:
- Always pass source param when needed
- Never guess navigation origin

---------------------------------------------------------------------------------------

## Transaction Lifecycle

create → rules run → stored → displayed → edited → updatedAt updated

Mutation rules:
- all writes go through store functions
- UI never mutates data directly

Cleanup state is derived from:
- receiptUri
- tagIds
- flagged

Never stored separately.

Complete transaction:
- has tags
- has receipt OR marked unavailable (future)
- not flagged

Incomplete transaction:
- missing any of the above
- appears in Needs Attention

------------------------------------------------------------------------------------------------------------

## CLEANUP SYSTEM

### What it is

The cleanup flow is the core feature of the app. It is a system for identifying and resolving incomplete transactions.

### Cleanup Flow Status

Cleanup flow is stable. Do not break it.

Current behavior:
- Untagged list opens transaction with Add Tags as primary action
- Missing Receipts list opens transaction with Add Receipt as primary action
- Flagged list opens transaction with Mark Reviewed as primary action
- If transaction has one issue: fix it → return to filtered list
- If transaction has multiple issues: fix first → stay on sheet → fix last → return to filtered list

A transaction still needs cleanup if:
- tagIds is missing or empty array
- receiptUri is missing or null
- flagged is true

Always check ALL remaining issues after a fix, not just the one that triggered the filter.

txNeedsCleanup is the canonical cleanup check. Some handlers currently duplicate this logic inline. This works now but could drift. Do not refactor until cleanup flow is verified stable.

### Cleanup Flow Edge Case Matrix

CASE 1: tags present, receipt present → no cleanup buttons, normal inspect only
CASE 2: tags missing, receipt present → Add Tags primary, after save → return to Untagged list
CASE 3: tags present, receipt missing → Add Receipt primary, after save → return to Missing Receipts list
CASE 4: tags missing, receipt missing → both shown, fix first → stay, fix second → return
CASE 5: tags added during session, receipt still missing → Add Tags updates immediately, Add Receipt stays active
CASE 6: receipt added during session, tags still missing → Add Receipt updates immediately, Add Tags stays active
CASE 7: user edits merchant or amount → does NOT affect cleanup state
CASE 8: receiptUri present but receipt boolean false → still counts as receipt
CASE 9: tagIds empty array vs undefined → both mean untagged, both trigger Add Tags
CASE 10: note contains __test_clone__ → treated as normal transaction
CASE 11: opened from Tax → back returns to Tax, source=tax handles this
CASE 12: opened from Explore with filter → after fix → returns to filtered Explore list
CASE 13: Android hardware back mid-cleanup → should close modal cleanly, no crash
CASE 14: multiple edits before closing → state stable, no desync
CASE 15: delete during cleanup → returns to filtered list, not client page

### UI State Rules

missing tags → Add Tags primary, Add Receipt secondary
missing receipt → Add Receipt primary, Add Tags secondary
both → both active
resolved → grey or hidden
mixed → one active, one resolved

Never show inactive action as clickable

RULE — Cleanup State Source

txNeedsCleanup is the ONLY source of truth for whether a transaction needs cleanup.

Inline checks are TEMPORARY and must be removed once cleanup flow is fully verified.

Do NOT:
- create new cleanup conditions inline
- duplicate cleanup logic in UI handlers

Future step: replace all inline cleanup checks with txNeedsCleanup in a single controlled pass.

---------------------------------------------------------------------------------------------------------

## RULES ENGINE

### Foundation (built)

Rules run on every new transaction. All matching rules are applied automatically.

### Complete Rules Vision (full list)

- **Merchant → Tag**: Shell = fuel, Menards = materials, Subway = meals. Set once, never think about it again.
- **Card strategy → Tag**: Gas card = fuel, Business card = business expense
- **Amount threshold → Flag**: IF amount over $500 → flag for review, shows in Needs Attention
- **Merchant + amount combined**: IF Menards AND over $200 → tag as "major materials purchase." Different from small Menards run for screws. Useful for tax categorization.
- **Round number gas detection**: IF Shell AND amount is round number or repeating (45.00, 23.23) → auto-tag fuel with high confidence. Toggle in settings. Catches gas fill-ups vs snack runs at same station.
- **Clocked in under client**: suggest business tag automatically regardless of payment method. Context does the work — you're on the job, of course it's a business purchase.
- **Amazon/mixed merchant rule**: IF merchant is Amazon → automatically suggest split purchase prompt. Amazon almost always has personal mixed in.
- **Add Rule button**: most important UI piece. Right on each transaction. You see a Shell charge, tap Add Rule, it pre-fills what it knows, you pick the tag, done. Never have to hunt for a rules settings screen.
- **AI suggestions (post-launch only)**: after 30 days app notices you always assign Menards to Savita and suggests a rule. One tap confirm. No big AI screen, just inline suggestions.

### What Rules Can Do

- Apply a tag automatically
- Suggest a tag (one tap confirm, not forced)
- Flag for review
- Trigger split purchase prompt
- Suggest business vs personal based on context

### What Rules Cannot Do Well (avoid)

- Merchant → Client assignment: too many exceptions in real work. You buy from Menards for Savita AND Otto AND Day Program. Merchant alone does not tell you who it is for.
- Time/day rules (weekend = personal): low value for tradespeople, skip for now

### Build Philosophy — Rules Engine

Foundation is built. Full vision below requires dependencies. Don't jump ahead.

### Remaining Rules Vision

- AI suggestions: notices patterns and suggests rules — needs real user data, save for post-launch
- Rule by time: IF weekend THEN suggest Personal — low priority
- Merchant → suggest split purchase (Amazon) — needs split purchase feature first
- Clocked in under client → suggest business tag — needs clock in feature first

RULE — Rules Engine Trust Boundary

Rules must NEVER silently change critical data without visibility.

Allowed: auto-tagging, flagging, suggestions
Not allowed without confirmation: assigning client, marking complete, removing data

If a rule has high impact → it must be visible or reversible

---

## CARD STRATEGY SYSTEM

When you add a card to the app you label it as:
- Business Only — always business expense
- Personal Only — always personal
- Gas Only — always fuel
- Mixed — asks every time which category

Most tradespeople do not use different cards per client. They use cards by category. This matches real behavior.

Rules can then auto-assign based on card strategy:
- Gas card used at Shell → auto-tag fuel, no question asked
- Business card used anywhere → suggest business tag
- Mixed card → always prompt

The card does not tell the app who the purchase is for (client). It tells the app what kind of purchase it is (category/tag). That distinction matters.

Future: rewards optimization — app could suggest "use your business card for this merchant to maximize points on work purchases."

### Remember This Card Flow

When a user adds a transaction and selects a card, the app should notice if they always use the same card at the same merchant and offer to save that as a rule.

Flow:
- User adds a transaction at Shell, selects Gas Card
- After saving, app shows a quiet prompt: "You always use Gas Card at Shell. Want to make that automatic?"
- User taps yes — a rule is created: IF merchant contains Shell AND card = Gas Card THEN apply
- No need to go to the Rules screen

Do not build yet. Requires the rules engine card matching to be stable first.

---

## GAS DETECTION — FULL VISION

Round number gas detection is built as a toggle in Settings. The current merchant list is hardcoded: Shell, BP, Marathon, Speedway, Exxon, Mobil, Casey's, Kwik Trip.

Full vision for expanding this:
- Learn gas station merchant names from the user's own transaction history
- After 30 days if a merchant appears repeatedly with round or repeating amounts, suggest adding it to the gas detection list
- User can manually add merchant names to the gas detection list in Settings
- User can remove merchants from the list
- The toggle stays — this whole system is opt-in

The round number logic stays the same: whole dollar amounts (45.00) and repeating decimals (23.23, 45.45) are the signal. Combined with a known gas merchant name, confidence is high enough to auto-tag without asking.

---

## TAX BRACKET ONBOARDING — FULL FLOW

The tax tab currently has a user-adjustable percentage but no guidance for people who don't know their bracket. Most tradespeople don't know what a marginal tax rate is or what percentage applies to them.

The full onboarding flow: first time the user opens the tax tab, show a one-time prompt: "What's your situation? We'll estimate your tax bracket."

Options:
- I work for myself full time (self-employed) → suggest 25% (federal + self-employment combined estimate)
- I have a regular job plus side work → suggest 22%
- I'm just getting started / low income → suggest 12%
- I'm not sure → suggest 22% as a safe middle estimate
- I'll enter my own percentage → goes directly to the input field

After selection show plain English explanation: "This is only an estimate. It helps calculate possible tax savings, not your final tax bill. You can change this anytime in settings."

The setting persists in AsyncStorage just like the current tax rate.

Future version:
- Ask rough yearly income range
- Ask filing type (single, married, head of household)
- Ask self-employed vs side work vs employee
- Estimate combined federal plus self-employment tax impact more accurately
- Note: self-employed people pay both sides of Social Security and Medicare which changes the effective rate significantly

---

## NEEDS ATTENTION NAVIGATION — FULL SPEC

Each row in the Needs Attention section on the home screen navigates to the Explore/Search tab with a specific filter pre-applied:

- "X flagged for review" → opens Explore filtered to flagged transactions
- "X missing receipts" → opens Explore filtered to missing receipt transactions
- "X untagged" → opens Explore filtered to untagged transactions

After the user fixes a transaction from one of these filtered lists and saves, they should return to the same filtered list, not the home screen and not an unfiltered Search view. The list updates immediately to reflect the fix — if a transaction is no longer untagged after adding tags, it disappears from the untagged list.

When all items in a filtered list are resolved, show a brief empty state: "All clear." Then allow the user to navigate back naturally.

---

## SETTINGS SCREEN — FULL LONG-TERM VISION

The settings screen currently has one toggle: Round Number Gas Detection. Long term settings should be organized into clear sections:

**Tax settings:**
- Tax bracket percentage (current)
- Tax bracket helper / onboarding prompt
- Reset to onboarding prompt button

**Automation:**
- Round Number Gas Detection toggle (current)
- Gas station merchant list (add/remove custom merchants)
- Future: notification preferences

**Cards:**
- Manage saved cards (may move here from Rules screen)

**Display:**
- Future: light/dark mode
- Future: accent color picker

**Data:**
- Future: export all data
- Future: backup to Google Drive
- Future: clear test data

**About:**
- App version
- Future: link to support or feedback

---

## EXPENSE BUCKETS VS CLIENTS — FULL EXPLANATION

This is one of the most important structural decisions in the app and needs to be understood before the data model is changed.

### The current problem

Right now "Personal" and sometimes "Work" exist as clients in the client list. They are not real clients. Savita is a client — she owes you money, you do work for her, you send her an invoice. "Personal" is not a client. It is a bucket for your own spending that you are not billing to anyone.

Mixing these together causes real problems:
- Personal appears in the invoice flow even though you never invoice yourself
- The outstanding total on the home screen includes personal spending which inflates the number
- Tax reports mix reimbursable client expenses with general business expenses
- The client list looks wrong when "Personal" sits next to "Savita" and "Otto"

### The correct structure

**Clients:** Savita, Mentor House, Day Program, Otto — people or organizations you do work for and bill money to.

**Expense Buckets:** Business Tools, Personal, Fuel, Office, Uncategorized — internal categories for organizing spending that is not billed to anyone.

### How they differ

- Clients have invoices. Buckets do not.
- Clients appear in the outstanding total. Buckets do not.
- Clients get receipt tracking for billing purposes. Buckets get receipt tracking for tax purposes.
- A transaction assigned to a client is reimbursable or billable. A transaction assigned to a bucket is a business or personal expense you are tracking for your own records.

### Short-term rule

Do not rebuild the data model yet. Keep Personal and Work as temporary pseudo-clients until the bucket system is designed properly. Do not add more pseudo-clients. When the bucket system is built it will be a deliberate architectural change, not a patch.

### When to build

After invoicing is built and working. The distinction becomes critical when you need invoices to only include real client transactions and tax reports to cleanly separate client reimbursables from general expenses.

---

## CLEAN SLATE — THE EMOTIONAL DESIGN

After invoicing a client and getting paid, the user should feel like the job is done. Like a clean job site at the end of the day. Like that moment when you close your toolbox and drive away.

The Clean Slate button appears after an invoice is marked as paid. It clears the invoiced transactions from the active view, archives the month, and resets the client to zero. History is kept — nothing is deleted — but the active view is clean.

This moment should feel satisfying. Not like clicking a button in an app. Like finishing something.

Design direction:
- Simple confirmation before clearing: "Mark this month as done and archive it?"
- Brief animation or visual acknowledgment — not flashy, just satisfying
- Client card on home screen resets to $0.00 with a clean state
- Archived months are accessible but tucked away — past, not present

The Clean Slate concept is core to the app's emotional design. Every feature should eventually support this moment. The whole point of capturing, assigning, and organizing is to arrive at this feeling.

RULE — Clean Slate Safety

Clean Slate must NEVER delete data.

It only archives and resets active views.
All history must remain recoverable.
---

## END OF MONTH COMMAND SCREEN

This is the core product moment. Turning a month of chaos into payment.

### The screen shows:
- Total hours worked
- Total outstanding money owed
- Receipts not attached (count + estimated tax impact)
- Transactions not assigned to a client
- Projects still open
- Invoices ready to send

### Actions from this screen:
- Attach missing receipts
- Assign leftover transactions
- Finalize hours
- Generate invoice per client
- Export everything as a package

### Feel:
Like a mission checklist, not a report. Each item is a task to complete. When everything is checked the month is done.

### Invoice Detail View:
When creating an invoice you can browse receipts for that period, add descriptions, attach receipt photos as attachments. Like looking at your receipts while writing up what you did that month.

### Auto Invoice Option:
At end of month app automatically prepares invoice and sends to your email or client email. User sets which day of month triggers this.

### Clean Slate Button:
After invoicing: clears pending, archives month, keeps history. Gives you that reset feeling like finishing a job site.

### Invoice Package Export:
Per client: invoice PDF + receipt photos + notes + hours summary. One package. Replaces QuickBooks for simple jobs.

Do not build until cleanup and invoicing flows are stable.

---

## PAYMENT TRACKING — DID THE CLIENT PAY?

The app tracks what clients owe you. It does not currently track whether they actually paid.

This is a real gap. The washer situation — you bought a $400 washer for a client and need to know if they paid you back — is exactly this problem.

### Full vision

Each invoice should have a paid/unpaid flag. When marked paid:
- The outstanding total on the home screen decreases
- The client card shows a paid badge or resets
- The money moves from "outstanding" to "received" in the tax/finance summary

### Per-transaction reimbursement tracking

Some transactions are not invoiced but are out-of-pocket expenses a client needs to reimburse:
- These should be flaggable as "needs reimbursement" separately from the invoice flow
- Example: you bought materials on your personal card for Savita's job — not an invoice item yet, but you need to be paid back
- When reimbursed, mark it paid

### Home screen "You're Owed" section should show:
- Total invoiced but unpaid
- Total in reimbursement needed
- Combined outstanding amount

This feature is closely tied to the invoice system. Do not build until invoicing is solid.

Partial Payments (future)

Invoices may be partially paid. System must support amount paid and remaining balance.
Do NOT assume binary paid/unpaid long-term. This comes up immediately in real jobs.

---

## CONFIDENCE LEVEL SYSTEM

Every transaction could eventually have a confidence level indicating how certain the app is that it is categorized correctly.

Three levels:
- **High confidence**: user manually set this, or a very specific rule matched, or receipt is attached with matching merchant
- **Medium confidence**: a rule matched but it was broad, or merchant was recognized but amount was unusual
- **Low confidence**: transaction was auto-assigned with weak signal, or merchant is unrecognized, or no rules matched

This is not a user-facing number. It is used internally to:
- Prioritize which transactions show in Needs Attention (low confidence surfaces first)
- Decide whether to ask the user to confirm an auto-assignment
- Feed future AI suggestions — patterns with high confidence teach the rule engine, patterns with low confidence get flagged for review

Do not build this yet. It requires the rules engine and cleanup flow to be stable first. Save as a foundation for the AI suggestions feature.

---

## CLIENT ARCHIVE

When a job is finished you do not want to delete the client — their transaction history matters for tax records and future reference. But you also do not want a finished client cluttering the active home screen alongside current jobs.

Client archive behavior:
- Long press menu on a client gets an "Archive" option
- Archived clients disappear from the main client list
- Transactions are preserved completely
- Archived clients appear in a separate "Archived" section at the bottom of the client list, collapsed by default
- Tap to expand and see archived clients
- Long press an archived client to unarchive

This is different from delete. Delete removes the client record. Archive just moves it out of the active view.

Future: archived clients still contribute to tax totals for the year even when archived. Their transactions are searchable. They just do not appear in the daily working view.

---

## QUICK NOTES — NON-TRANSACTION MEMORY

Sometimes on a job you need to capture something that is not a purchase. A measurement. A reminder. A photo description. Something the client said.

A quick note tied to a client:
- No amount required
- No receipt
- No merchant name
- Just text, optionally a photo, attached to a client

These notes appear in the client detail screen in their own section — not mixed with transactions.

Use cases:
- "Measured the back deck — 14x22 feet"
- "Savita wants oak finish not pine"
- "Remind her about the permit fee when invoicing"
- "Back door frame is rotted — may need extra materials"

Notes are not transactions. They do not affect totals or tax calculations. They are memory — the stuff that used to live in your head or on a scrap of paper.

Future: notes could be attached to invoices as line item descriptions or job notes.

---

## CLOCK IN / WORK MODE

When clocked in the app shifts to a dedicated working interface. Not just a timer — a different mode.

### What you see when clocked in:
- Timer showing current session time
- Current client and project name
- Today's hours and total hours on this project
- Quick camera button — photo auto-attaches to project
- Quick receipt button — auto-assigns to current client
- Quick note button — auto-tags with current project
- Everything auto-assigns to clocked-in client and project. No decisions required while working.

### Behavior:
- When you reopen the app while clocked in you go directly to this screen
- User adds their hourly rate once, hours calculate invoice value automatically
- Clock out saves the session with total time and any attached receipts, photos, notes

### Why this matters:
You don't have to think about where things go while you're working. The context handles the assignment. Capture once, it lands in the right place.

---

## MODULAR APP SYSTEM (v2 vision)

The app is modular. User picks what they use on first install and the app becomes their version of it.

### First time setup:
When someone installs, show: "What do you want to use this for?"
- Track receipts and expenses
- Track hours worked
- Organize work photos
- Manage projects and clients

They pick what applies. The app shows only what they need.

### The 4 core modules:
1. Money — receipts, transactions, tax, invoices
2. Time — hours tracking, clock in/out, notes tied to time
3. Photos — job photos, categorized, organized by project
4. Projects — clients, jobs, grouping everything together

### How modules connect:
When modules are on they link automatically. Take a photo → attaches to project. Add receipt → attaches to client. Clock hours → attaches to project. No manual linking required.

### UI behavior:
No new tabs for every module. Modules affect what appears inside existing screens. If Photos module ON: Photos section appears inside client detail. If OFF: it does not exist. Keeps app from feeling bloated.

### "Add capability" framing:
Instead of Settings → enable module, use "Add something new." — "Add time tracking", "Add photo tracking." Tap and it appears. Feels like adding tools not configuring a system.

This is a v2 decision. Do not architect the current app around it. Build features cleanly now and the modular system layers on top later.

---

## JOBCAM / WORK PHOTOS SYSTEM

Decision Trigger — JobCam Separation

Split JobCam into its own app IF:
- photo workflows become more complex than transaction workflows
- users need photo features unrelated to invoicing
- UI complexity starts affecting core Uncrumple flow

Until then: keep simple version inside Uncrumple.

Core idea: Camera = Job = Album. You do not open a generic camera. You open the right camera for the job you are at.

### Basic version (fits inside Uncrumple):
- Work photos tied to client and project
- Tap camera inside client detail to add photos
- Photos attach to invoice
- Simple date ordering, no complex categories
- "Take a photo of the finished deck and attach it to Savita's invoice" — 2 taps, done

### Full JobCam version (possibly separate app):
Each job gets its own camera profile with dedicated album, custom settings, category presets, home screen widget.

Categories with smart fields:
- WorkToDo: task, room, priority, due date
- Materials: material type, size, finish, quantity, source
- Measurements: width, height, depth, units, notes
- Shopping: store, item, quantity, price
- Receipts: vendor, date, total

Annotation tools: pen, arrow, text, highlight. Saves annotation separately from original.

Review system: mark photos Pending or Reviewed. Scan what needs attention without slowing down on site.

Home screen widgets: tap widget opens that job's camera instantly.

AI tagging (later): detects what is in image, suggests tags, reads text from labels and receipts.

### Decision to make later:
Does JobCam live inside Uncrumple as a module or become its own app that pairs with Uncrumple? Everything needed to get paid (receipts, hours, photos, invoice) belongs together. But the full JobCam feature set is a professional photography workflow that goes beyond what most tradespeople need.

Recommendation: build simple work photos inside Uncrumple first. If users want more, spin JobCam out.

---

## MILEAGE & LOCATION FEATURES

### Odometer photo reminder:
January 1st every year the app sends a notification: "Take a photo of your odometer for your tax records." Simple. Most self-employed people forget this and miss the deduction entirely.

### One-time location ping:
When a transaction is logged, if the merchant is 40+ miles away, app asks "Log mileage for this trip?" Android lets you grab a one-time location ping for free. No subscription, low battery impact. Only checks when a transaction is logged, not constantly running in background.

Important note: you can only deduct mileage for business purposes like going to buy materials or haul things, not commuting to regular work. Prompts must reflect this distinction.

### Bluetooth vehicle detection:
User labels a Bluetooth device as Work Vehicle or Mixed Vehicle.

Work Vehicle connecting: asks "Heading to a job?" and starts a mileage entry automatically.

Mixed Vehicle connecting: asks a different softer question to avoid being annoying when getting into a vehicle used for both work and personal.

Uses zero extra cost since Bluetooth is local. No GPS running in background.

### Saved locations (future):
User can save known locations with distances. "Menards = 6 miles from home." When a Menards transaction is logged the app knows the distance without needing GPS.

---

## KEEPER TAX — COMPETITOR ANALYSIS

### What Keeper does:
- Connects directly to bank and credit card via Plaid
- Reads every transaction automatically
- Uses AI to categorize as business or personal
- Asks you to confirm or reject each one
- Learns from your confirmations over time
- Tags with tax categories: meals, travel, supplies etc
- Generates tax reports automatically
- Has "Add Rule" button right on each transaction
- Auto-categorization based on merchant name

### Keeper weaknesses:
- Requires bank connection — many tradespeople do not want this
- No client organization — Keeper knows you spent at Menards but not that it was FOR SAVITA
- No invoice generation per client
- No receipt photo capture — just logs amounts
- No hours tracking
- No mileage tracking
- No work photos
- Requires internet connection

### How we beat Keeper:
- No bank connection required — privacy win
- Client-based organization — who the money was for, not just what category
- Invoice generation — Keeper cannot tell you Savita owes you $847 this month
- Receipt photo capture — actual proof, not just amounts
- Works completely offline
- Mileage tracking built in
- Hours tracking possible
- Bluetooth vehicle detection
- Split purchases
- The washer situation — paid/unpaid reimbursement tracking per client
- Round number gas detection — clever original feature
- Clocked-in context rules — Keeper has no concept of being on a job

### Our positioning:
Not just a tax tool. A field work system that captures everything once and organizes it automatically so you can get paid and stay organized without thinking about it constantly.

------------------------------------------------------------------------------------------------

## SUBSCRIPTION SYSTEM (future)

### Purpose:
Monetize the app without blocking core usage. Charge only for features that clearly save time or money. Keep the base app useful so adoption is not hurt.

### Core principle:
- Free/basic = track everything
- Subscription = reduce mistakes, increase deductions, save time

Honest Subscription Philosophy

If a subscribed user has not opened the app in 30+ days, the app should 
send one honest notification:

"Hey — you haven't used Uncrumple in a while but you're still subscribed. 
That's not what we want. If work has slowed down or you don't need this 
right now, cancel and come back when you do. We'll be here."

Rules:
- Send this once only, not repeatedly
- Include a direct link to manage subscription
- Do not guilt trip or use dark patterns to retain
- Do not send if user has opened the app recently

Why this exists:
Most apps quietly hope you forget so they keep charging you. 
Uncrumple is built for tradespeople who work hard for their money. 
Quietly taking $5/month from someone who forgot they subscribed is 
exactly the kind of thing this app is supposed to help people avoid.

The goal is not maximum revenue. The goal is that every person paying 
for this app feels like it is worth it. An honest nudge to cancel when 
you're not using it builds more trust than any retention tactic ever will. 
People remember that. They come back. They tell other people.

This is a feature, not a risk.

### Potential subscription features:

1. **Export (high priority)**
   - CSV export
   - PDF summary
   - Tax-ready reports

2. **Insights (money-focused)**
   - Missing receipts total
   - Estimated tax loss
   - Spending breakdowns
   - "You're losing $X by not fixing this"

3. **Advanced filters**
   - Multi-filter stacking
   - Match All / Any
   - Tag combinations
   - Future: date range, amount range, merchant filters

4. **Smart tagging (future)**
   - Merchant-based suggestions
   - Auto-tagging rules
   - Pattern learning

5. **Backup / sync (future)**
   - Cloud backup
   - Multi-device sync

6. **Job-based tracking (strong niche feature)**
   - Per-job totals
   - Expense grouping by job
   - Profit estimation per job

### Pricing direction:
- Likely $3–$5/month or yearly option
- Avoid over-fragmenting features
- Keep value obvious

### Constraints:
- Do NOT build subscription system yet
- Do NOT gate core features (adding transactions, basic viewing)
- Features must feel worth paying for
- Must not hurt onboarding or early adoption

When to build: after core app is stable and real usage data exists.

------------------------------------------------------------------------------------------------------------------

## WORKFLOW MODES

### Night Mode — User Is Stepping Away
Trigger: user says something like "need to burn tokens, going to sleep" or "I'm stepping away for the night"

What this means: User is walking away and wants Claude Code to keep working through a batch of safe tasks unattended. Goal is to use remaining session tokens on productive work instead of sitting idle.

How to handle:
1. Identify next 3 to 5 tasks that are LOW risk and touch only one file each
2. Write all Claude Code prompts back to back, clearly numbered
3. Include test instructions after each prompt so user can verify in the morning
4. Add SESSION_LOG.md instruction so Claude Code documents what it changed
5. Remind user to do /clear before starting the batch, then paste all prompts in sequence

Rules:
- Only LOW risk tasks, one file per prompt
- No store.tsx changes unless explicitly confirmed
- No refactors, no style changes, no TypeScript
- Every prompt must include the standard safety constraint line
- If Claude Code hits something unexpected, stop and add to STOPPED_AT.md instead of guessing

Goal: User wakes up to completed safe fixes and SESSION_LOG.md showing exactly what changed.

### Pre-Reset Mode — Session Tokens Running Out
Trigger: user says something like "need to burn tokens, session is resetting" or "running out of tokens"

What this means: Session context is about to reset. Not enough time to safely run Claude Code patches. Goal is to generate as many reusable planning assets as possible before the reset.

How to handle: Switch immediately to high-density output mode. Stop step-by-step pacing. Generate everything useful in one or two large responses with no filler.

Best things to generate:
- Edge case matrices for features currently being built
- Test transaction datasets with mixed states
- Full prompt libraries for upcoming Claude Code tasks, written and ready to paste
- Failure mode checklists for recent changes
- Roadmap compression and conflict cleanup
- Naming standardization audit
- Data model audit observations — NOT implementation, just notes
- UI state scenario maps

Rules:
- No destructive changes
- No multi-file code edits
- No refactors
- Output must be dense — no filler, no padding

Goal: Convert leftover tokens into documents, datasets, and prompt libraries that would normally take multiple sessions to produce.

------------------------------------------------------------------------------------------------------

## RECEIPT STATE (PLANNED)

- attached
- missing
- unavailable (user confirmed no receipt exists)

Reason: Missing receipts queue must be clearable. Without "unavailable" state, a lost receipt can never be cleared from the Missing Receipts queue.

Do not build yet. Requires coordinated store change.

---------------------------------------------------------------------------------------------------------

## BLOCKED FEATURES (DO NOT BUILD YET)

- Advanced filter builder
- Multi-filter AND/OR system
- Tag picker full panel
- Subscription system
- Smart tagging AI
- Notification listener
- receiptStatus field
- No Receipt button
- Fix All / Cleanup Mode
- Recently Edited filter (requires updatedAt in store first)
- Search tab rename
- Expense Buckets vs Clients data model change
- Drag reorder clients
- Client groups
- Mileage tracking
- Hours tracker
- Flag reason system

Reason: Dependencies not stable or not yet built.

---------------------------------------------------------------------------------------------------------

## PERFORMANCE WATCH

- AsyncStorage size growth
- Transaction list rendering (FlatList optimization later)
- Filter performance with large datasets
- Tag list scaling

Do NOT optimize yet. Just track.

---

## UNDO SAFETY (FUTURE)

All destructive actions should be reversible later:
- delete
- move
- mark reviewed

Do not build yet, but plan for it.

------------------------------------------------------------------------------------------------------

## FUTURE FLAG SYSTEM — FULL VISION

Flags should evolve into a structured review system, not just a binary "flagged" state.

Current behavior:
- Transactions can be flagged by rules (e.g., amount > $100)
- Mark Reviewed clears the flag

Limitations:
- "Flagged" does not explain why
- No structured review flow
- No clear resolution state beyond manual handling

### Proposed system:

1. **Flag = "Needs Review"** — flagged transactions require a decision before being considered complete

2. **Flag Reasons** — when a transaction is flagged, user should:
   - select a reason from a dropdown
   - or enter a custom reason
   
   Example reasons: Large purchase, Verify tax category, Missing context, Possible personal/business mix, Needs receipt, Needs client confirmation, Needs invoice decision, Custom

3. **Rule-Based Flags** — users can define rules that automatically flag transactions with a reason

4. **Review Flow** — flagged transactions surface in "Needs Attention", user resolves by adding missing data or marking reviewed

5. **Mark Reviewed** — clears flagged state, optionally logs that the issue was reviewed

6. **UI (later)** — small flag icon in transaction detail header, outline when not flagged, filled when flagged, tap to view reason

7. **Flag Visibility and Snooze** — flagged indicator in normal client transaction views, not just cleanup flow. Snoozed flags stay flagged but visually quieter. If only snoozed items exist, show softer reminder instead of loud warning.

Do not build flag reason system yet unless explicitly requested.

------------------------------------------------------------------------------------------------------

## INTENT SYSTEM (FUTURE — SAVE FOR LATER)

Do not build generic save-for-later. Instead define user intent actions:

- **Important** (pin/star)
- **Snooze** (time-based return)
- **Needs Decision** (user unsure)
- **Follow-up** (requires action later)

Rules:
- Each must have a clear purpose
- Must not overlap with flagged
- Must not create a permanent pile
- Prefer time-based or action-based systems over passive lists

Build order: Snooze (first), Important (optional), others based on real usage

---------------------------------------------------------------------------------------------------------

## CLIENT RECEIPT REQUIREMENT (FUTURE)

Each client should have a setting for whether receipts are required for that client's transactions.

Behavior:
- Client can be marked as "Receipts required"
- If any transaction under that client is missing a receipt, the client gets a red warning indicator
- Missing receipt count could show near the client name or on the client card
- Clients without receipt requirements should not show missing receipt warnings as aggressively

Goal: Some clients/jobs require tighter receipt tracking than others. The app should let the user decide which clients need strict receipt proof.

---------------------------------------------------------------------------------------------------

## FILTER SYSTEM — CURRENT + FUTURE DIRECTION

### Current (built)
- URL-driven filters via useLocalSearchParams
- filter param: flagged / missing / untagged
- source param: explore / tax
- returnFilter param for return navigation

### Tag Filter (save for later)
- Add URL param: ?tag=<id>
- Keep existing ?filter= for Needs Attention
- Filters compose using AND logic
- Needs Attention filter applies first, tag filter applies on top
- Build after current Search dropdown is stable

### Advanced Filter Builder (save for later)
- Composable multi-filter system
- Additive chips with + button
- Match All / Match Any toggle
- Sorting separate from filtering
- Do not build until filter model is clear and URL strategy is defined
- Must not break current Needs Attention filters

### Full Tag Picker Panel (save for later)
- Full-screen modal for tag selection
- Tags as rounded chips with color
- Most-used tags first
- Do not build until basic tag filtering is working end-to-end

RULE — Filter Composition

All filters must be composable and deterministic.
- Needs Attention filters always apply FIRST
- Additional filters (tags, etc.) layer on top
- No filter may override another silently

If two filters conflict → show empty state, do NOT fallback or guess

URL is the single source of truth for filters.

---------------------------------------------------------------------------------------

## FUTURE CLEANUP REFACTOR

txNeedsCleanup is the canonical cleanup check: receipt missing OR tags missing OR flagged.

Currently, addReceiptToTx and Tag modal Save duplicate this logic inline instead of calling txNeedsCleanup.

This works now, but could drift later.

Future cleanup:
- Replace duplicated inline cleanup checks with txNeedsCleanup where safe
- Do this only after cleanup flow is stable
- One file only
- Test Untagged, Missing Receipts, and Flagged flows after

---

## RECENTLY EDITED FILTER (SAVE FOR LATER)

Purpose: quickly find transactions that were just modified, verify cleanup actions worked.

Behavior:
- Each transaction gets an updatedAt timestamp on any edit
- Search/Explore gets a "Recently Edited" filter
- Results sorted by updatedAt newest first

Constraints:
- Requires store/update logic changes first
- Must be consistent across all mutation paths
- Do NOT build as a quick Explore-only patch

Build order:
1. Add updatedAt to all transaction mutations
2. Verify it updates correctly everywhere
3. Add Explore/Search filter
4. Apply sorting + test behavior

---

## AUTO-ADVANCE CLEANUP FLOW — FIX ALL MODE (SAVE FOR LATER)

- Select all items in filtered cleanup list
- Fix one → auto-open next
- Option to apply same tag to all

Why: speeds up cleanup massively
Depends on: stable single-item cleanup (done)
When: after UI polish

---

## SEARCH / EXPLORE TAB RENAME DECISION

The current tab is labeled Search but it now acts as a cleanup workspace, Needs Attention destination, Missing Receipts queue, Untagged queue, Flagged review queue, and Tax Missing Receipts destination.

Possible future names: Review, Clean Up, Find, Search & Review

Current decision: Do not rename yet. Keep Search for now until the cleanup workflow is more developed. Revisit after Fix All / cleanup queue behavior is built.

---

## EXECUTION RULES (for reference)

- Never invent missing logic
- Always use existing functions for data writes
- If missing, stop and explain
- Treat data writes as high risk
- Reduce ambiguity in prompts
- Prefer smallest safe change
- Protect build order
- Surface small inconsistencies

---

## NAMING WATCH (DO NOT CHANGE YET)

receipt vs receiptUri
note vs notes
merchant vs name
card vs cardId
tagIds always array

---

## CURRENT POSITION

- Cleanup flow is implemented and mostly stable
- Explore filtering and return navigation is working but needs validation
- Mark Reviewed exists and is integrated but needs full flow verification
- Clone tool exists for testing and should remain until cleanup testing is complete
- Keyboard issue still unresolved

---

## Saved Ideas — Client Management
- Favorites — starred clients appear at top
- Groups — collapsible sections in client list
- Drag to reorder clients — needs persistent order first, separate feature
- Client notes field — free text notepad per client
- Client health indicator — color dot showing clean/active/messy/ready state
- "Last visit" shortcut — last photos, receipts, notes from previous visit
- Client multi-select: move transactions before delete, add to group, mark favorite
- Client archive — long press → Archive, preserved history, separate collapsed section

## Saved Ideas — Transaction Management
- Swipe left to delete
- Duplicate transaction alert (same merchant + amount + day)
- Recurring transaction detection
- Receipt expiration warning (90 day warning for thermal receipts)
- Split purchase — some personal some business on same transaction
- "Attach to last job" quick flow
- Bulk actions: Add Note to All, Add Tags to All

## Saved Ideas — Receipts
- Receipt annotation tools (highlight, draw, text box)
- Bulk export receipts by client or date range
- SmartScan — ML Kit reads merchant and amount from camera
- Temp receipt gallery for bulk sharing
- Receipt preview before saving: show photo, Save / Retake / Cancel

## Saved Ideas — Later Queue
- Skip a transaction when it comes in (requires notification listener first)
- Reminder notification after X hours
- Unassigned count badge on home screen

## Saved Ideas — Tax & Finance
- Tax bracket onboarding flow (full spec above)
- Outstanding tracker — materials bought for client needing reimbursement
- Export for accountants — CSV and PDF
- Year filter on tax screen — transactions currently store no year in date string
- Card strategy labeling

### Storage Export
When storage fills up, user can export archived data in a smart way:
- Export old invoiced/paid transactions with receipt photos as a package
- Photos saved organized by client and date
- Transaction data exported as CSV or PDF alongside photos
- After export confirmed, option to clear exported data from device
- Keeps recent active data on phone, archives old data to Google Drive or Files
- "Archive last year" button in Settings
Do not build yet. Needs export system first.

## Saved Ideas — Home Screen & Widgets
- Modular home screen sections
- Money waiting / You're owed section
- Home screen widgets: quick receipt, clock in/out

## Saved Ideas — Color & Themes
- Color theme picker — user chooses accent color (good v2 feature)
- Light and dark mode

## Saved Ideas — End of Month & Invoicing
- End of month command screen (full spec above)
- PDF invoice generation
- Invoice templates per client
- Paid/unpaid flag per invoice
- Clean Slate button after invoicing (full spec above)

## Saved Ideas — Future Big Features
- Notification listener for real Android bank notifications
- Gmail/Amazon order lookup
- Modular app system (full spec above)
- Hours tracker with clock in/out
- Work photos / JobCam system (full spec above)
- Bluetooth vehicle detection
- Home screen widgets
- Confidence level system (full spec above)
- Payment tracking / You're Owed (full spec above)
- Quick notes tied to clients (full spec above)
- Client archive (full spec above)
- Remember This Card flow (full spec above)
- Intent system: Snooze, Important, Needs Decision (save for later)
- Client receipt requirement setting (full spec above)

### Tablet and Large Screen Support
App already runs on tablet, just stretched.
Future polish: responsive split-view layout.
- Client list left, transaction detail right
- Wider cards with more visible info
- End of month command screen benefits most from large screen
- Web or desktop version possible later via React Native Web
Do not build now. Add after core app ships.

---

## PRE-RESET ASSET PACK

### Test Transaction Set

```json
[
  {"note":"__test_clone__ missing_tags_only","tagIds":[],"receiptUri":"file://r1.jpg","amount":45.2},
  {"note":"__test_clone__ missing_receipt_only","tagIds":["materials"],"receiptUri":null,"amount":120},
  {"note":"__test_clone__ missing_both","tagIds":[],"receiptUri":null,"amount":78.55},
  {"note":"__test_clone__ complete","tagIds":["tools"],"receiptUri":"file://r2.jpg","amount":200},
  {"note":"__test_clone__ edge_empty_tags","tagIds":[],"receiptUri":"file://r3.jpg","amount":0.01}
]
```

### Failure Checklist
- store writes correct?
- UI updates immediately?
- navigation intact?
- Android back works?
- cleanup state recalculated?
- no undefined crashes?
- clone safe?
- filters update?
- Tax matches Explore?

### Prompt Patterns

UI change:
Fix only [file]. Minimal patch. No logic changes.

Data change:
Fix only [file]. Minimal patch. Use existing functions. Do not invent logic. If missing → stop.

Debug:
Show code only. No edits.

------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------

## Handoff Note

App is stable as of end of April 2025. Full cleanup flow system is working end to end. Smart return works correctly in both directions. Android back is fixed in client-detail modals. Tax screen updated. Explore empty states work. Client multi-select delete works.

When starting a new chat paste this roadmap and say: "Continuing Uncrumple development. Here is my roadmap. Read it fully before we do anything."

For exact current state and next action, the JSON handoff artifact takes priority over this file.
```

ill add ideas or anything that comes to mind in the interim this will be sorted later:

Idea: The AI development workflow system built for Uncrumple 
(LOCKED_ATTRIBUTES, HANDOFF generator/receiver, JSON memory layer, 
CLAUDE.md, SESSION_LOG) could itself become a product. A structured 
system for building apps with AI that prevents drift, enforces safe 
changes, and carries context between sessions. Could be sold as a 
template, a course, or eventually a tool. Save for after Uncrumple ships.


Feature idea: Smart Tag Colors

Tags could optionally adapt their color based on usage patterns.

Possible behavior:
- Tag color may reflect the client it is most often used with
- Tag color may reflect the merchant it is most often used with
- If a tag is used across many clients or merchants, keep its normal static color
- Merchant colors may need to exist first before this works cleanly

Open questions:
- Do merchants need their own color identity?
- Should tag colors stay fixed for recognition?
- Would changing colors make tags harder to scan?

Decision:
Save for later. Do not build until the tag system and merchant system are more stable.




Future polish: Search-owned transaction viewer

Opening a transaction from Search currently routes through client-detail, so the client page briefly appears behind the transaction sheet and can flash before returning to Search.

Future goal:
Open transaction detail directly from Search using a Search-owned modal or shared transaction viewer, so closing returns visually cleanly to Search with no client-detail background flash.

told user- Do not build now. Current behavior is functional.





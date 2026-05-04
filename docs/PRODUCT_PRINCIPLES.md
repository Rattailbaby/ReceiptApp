# PRODUCT_PRINCIPLES.md
# Uncrumple — Design and Product Principles

Uncrumple is a tool for busy tradespeople. They are moving between jobs, talking to customers, loading trucks, and getting their hands dirty. Every interaction with this app happens in a stolen moment. The app must earn its place in their workflow by making things easier, not harder.

---

## Core Principle: The App Should Reduce Thinking

Every decision the user has to make costs them attention. Every extra tap steals time they don't have. Every confusing screen erodes trust.

The app's job is to accept information as fast as the user can give it, and get out of the way.

**Applied to design decisions:**
- Default values > blank fields
- Autocomplete > typing from scratch
- Confirmation dialogs only when destruction is permanent
- No "are you sure?" for non-destructive actions
- Suggest, don't demand: show a warning, let user dismiss, don't block the save

**Real-world application:**
Jake (handyman) is at the lumber yard. Cashier is waiting. He has 20 seconds. The app should accept "Menards" + "$43.27" and save. Everything else is optional. The note warning should be dismissable in one tap, not a blocking modal. The camera should be optional, not required. The client should already be the last one he was working with.

**What breaks this principle:**
- Mandatory fields beyond merchant + amount
- Multi-step save flows
- Required categorization before saving
- Alerts that can't be dismissed without taking action
- Any screen that makes the user think "what am I supposed to do here?"

**Decision framework test:** Before adding any UI element, ask: "Does this help the user capture information faster, or does it ask them to think about something?" If it asks them to think, it either shouldn't be there or should have a sensible default.

---

## Capture First, Organize Later

A tradesperson gets a receipt at the checkout. They have 15 seconds. They should be able to get that receipt into the app before the cashier finishes the transaction.

**What this means:**
- The add transaction flow must be reachable in 2 taps from anywhere
- Merchant name and amount are the only required fields
- Everything else (note, tag, receipt photo, card) is optional — add it later
- The receipt photo can be added after the transaction is saved
- The tag can be applied from the Needs Attention flow

**What this rules out:**
- Mandatory fields beyond merchant + amount
- Forced categorization at save time
- Multi-step wizards for adding a transaction
- Validations that block the user from saving

**Real-world application:**
The "missing receipt" and "untagged" flows in Needs Attention exist BECAUSE capture happens without receipts or tags. This is by design. The app accepts incomplete data at save time and surfaces cleanup work later. This is the correct architecture for the use case.

**What breaks this principle:**
Any feature that prevents saving without complete data. The note warning (currently a dismissable alert) is on the right side of this line. A required "note or photo" field that blocks the save button would cross it.

**Scale consideration:**
As users get comfortable with the app, they capture faster and organize less frequently. The Needs Attention queue grows. If the cleanup flow is friction-heavy, users stop clearing it. If the queue stays permanently full, users stop trusting the app. Keeping cleanup low-friction (2-tap resolution per item) prevents "queue debt" from accumulating.

---

## Every Cleanup Item Should Be Fixable in as Few Taps as Possible

The Needs Attention flow is the app's killer feature once transactions accumulate. It turns a pile of receipts into a processing queue.

**The ideal flow:**
1. Open app
2. See "5 missing receipts" in Needs Attention
3. Tap → see the 5 transactions
4. Tap first one → camera opens (or edit sheet opens)
5. Fix it → immediately returned to the queue
6. Repeat until 0 remaining
7. "All clear" screen — done

**What this means in practice:**
- After fixing an item, the user must return to the filtered list automatically (not to the home screen, not to the client list)
- "All clear" confirmation when a filter reaches zero is important feedback
- The queue must update in real time (fixed items disappear from the list)

**Current state:**
The return navigation works (router.replace sends back to filtered explore). The "All clear" state doesn't exist yet (Finding 14). The item disappearing from the list works (re-render after edit removes it from filtered results).

**What breaks this principle:**
- Any code change that sends the user to the home screen after a fix
- A "save" action that doesn't immediately re-filter the queue
- An empty filtered state with no message (the user can't tell if they're done or if something broke)

**Decision test:** After fixing one item in the queue, does the user know: (a) how many items remain, (b) what the next item is, (c) that their fix worked? If any of those three are unclear, the flow is broken.

---

## Users Should Return to Their Cleanup Queue After Fixing One Item

This is a sub-principle of the above. It applies specifically to the Needs Attention → Explore → Client Detail → Fix flow.

**Current state:** This works. After marking reviewed or adding a receipt, `router.replace('/explore?filter=...')` returns the user to the filtered list.

**What must never regress:**
- After marking a flagged transaction reviewed, user is on the flagged list, not the home screen
- After adding a receipt to a "missing receipt" transaction, user is on the missing list
- The fixed transaction should NOT appear in the list (it was fixed)
- If that was the last item in the list, the "All clear" message should appear

**Code rule derived from this principle:**
Any future change to `saveTxEdit`, `addReceiptToTx`, or `deleteSingleTx` in client-detail.tsx must preserve the return navigation logic. Do not remove or bypass the `source === 'explore'` check without understanding this principle.

---

## Automation Should Suggest, Not Confuse

Rules are powerful, but opaque automation destroys trust.

**What this means:**
- When a rule fires and tags a transaction, users should be able to see WHY it was tagged (ideally show a small indicator that a rule was applied — future feature)
- Round number gas detection should tell the user it applied (future: a small note in the transaction)
- Rules should be easy to turn off or delete
- AI suggestions (future feature) should say "here's a suggested rule" — not quietly apply it

**What to avoid:**
- Silent categorization the user can't explain
- Rules that fire and can't be traced back to their origin
- Automation that makes the data feel unreliable

**Real-world failure scenario:**
Jake's rules are set up, and he doesn't remember them. He adds a "Shell Gas" transaction. It gets tagged "Fuel" automatically. Later, looking at his taxes, he sees "Fuel" expenses he doesn't remember. He wonders if the app added extra transactions. He doesn't know a rule did this. He loses trust.

**Design goal:** Every automated action should be traceable. A small "⚡ rule applied" indicator on auto-tagged transactions would make automation transparent rather than mysterious.

---

## Tabs Should Stay Minimal

The current 3-tab structure is correct:
1. **Clients** — the organizing center, where work gets done
2. **Search** — universal access to all data
3. **Tax** — summary view for the accountant conversation

**Do not add tabs for:**
- Rules (belongs in Settings)
- Tags (belongs in Rules/Settings)
- Invoices (belongs inside each Client)
- Reports (belongs in Tax or as a share action)
- Notifications (belongs in Needs Attention on the home screen)

A 5-tab app feels like enterprise software.

**Why 3 tabs is the right number:**
Tradespeople glance at their phone between tasks. They need to find what they need instantly. 3 tabs that each have one clear purpose are scannable. 5+ tabs require thinking about which tab contains what they need. Each additional tab adds cognitive load.

**What breaks this principle:**
Adding a tab for any feature that can live as a sub-screen elsewhere. The tab bar is expensive real estate. Every new tab dilutes the clarity of the existing three.

---

## Clients/Projects Are the Organizing Center

Every transaction belongs to a client. Every view is filtered through a client. The client list is the home screen.

**What this means:**
- The client list must feel clean and quick to scan
- Outstanding totals per client are the most important number on the home screen
- The client detail screen is where 80% of real work happens
- Searching by client name should always work from explore

**What this rules out:**
- A global transaction list as the main view
- A dashboard-first home screen (receipts count, savings meter, etc.)
- Merging all clients into a flat transaction feed

**Real-world application:**
When Jake opens the app, the first question is "which client am I working on?" The answer is visible immediately on the home screen. He taps the client. Everything about that client's work is in one place. This is the right mental model. Don't complicate it.

**Decision test:** If a new feature is visible on the home screen but doesn't relate to "which client am I working on," question whether it belongs there.

---

## Modules Should Be Optional

Not every tradesperson needs every feature. A simple handyman doesn't need rules. A plumber might not care about tax estimates. A contractor might not use cards.

**What this means in practice:**
- Features that aren't set up should be invisible (cards only show in add form if cards exist)
- Empty states for settings/rules/cards/tags should guide, not overwhelm
- The core app (clients + transactions + receipt photos) should work perfectly without any optional features enabled

**Applied to future features:**
- Clock in/out: Optional module, not always visible
- Mileage: Optional module
- Notification listener: Optional module, requires setup

**What breaks this principle:**
Features that are always visible even when not used. A "mileage" section on the home screen that shows "$0.00" when no mileage is tracked. A "cards" field in the add transaction form when no cards have been created (current code already handles this correctly — the card picker is hidden when `cards.length === 0`).

**Current state:**
The app handles this well in most places. The card picker is correctly hidden when empty. Rules only fire if rules exist. The gas round-number detection is a Settings toggle. This pattern should be maintained for all future optional features.

---

## Do Not Build Accounting Software

The danger of an expense tracking app is that it slowly becomes QuickBooks. This must be resisted.

**Signs it's becoming accounting software:**
- More than 3 tabs
- Required fields beyond merchant + amount
- Complex categorization requirements before saving
- Multiple report types with filters and date ranges
- Invoice numbering systems with PDF templates

**Keep it feeling like:**
- A digital shoebox that's smart about what you put in it
- A conversation ("I spent this, on this client, for this reason, here's the photo")
- A cleanup tool that respects the user's time

**The real product:**
Uncrumple's value proposition is: "You have receipts stuffed in your truck. We help you turn them into organized, searchable records that your accountant can work with." That's it. Every feature should serve that proposition. A feature that serves a different proposition belongs in a different product.

**What this means for the tax screen:**
The tax screen should show: "Here's what you spent, here's roughly what you might save, here's the receipt-backed breakdown." It should NOT try to be a full tax preparation tool. That's TurboTax's job.

---

## The One-Thumb Test

Every primary action in the app should be reachable with one thumb, one-handed, in a truck cab.

**Applies to:**
- FAB for adding transactions (bottom-right, large target)
- Back button (standard left position, large tap target)
- "Save Transaction" button (large, high contrast, primary button)
- "Invoice →" button (right side of the invoice bar)

**Applies to modal patterns:**
- Cancel/close buttons should be large and at the bottom (thumb-reach)
- Destructive actions should require a second confirmation tap (Alert dialog)
- Important data entry fields should not be hidden behind scrolling

**What currently fails this test:**
- The back button in client-detail is in the top-left header — far from thumb reach on large phones
- The Edit button in the transaction detail sheet is in the top-right corner — moderate reach
- The trash icon (delete) is in the top-right — easy to accidentally hit

**Decision test:** Can a user wearing work gloves, holding a coffee, add a transaction with their right thumb alone? If no, the flow needs simplification.

---

## Speed Over Precision

The app is a capture tool first, an organization tool second.

Users will make mistakes. They'll misspell merchants. They'll assign the wrong client. They'll forget to add a tag.

**The app's response to mistakes should be:**
- Edit is always available (no locked transactions)
- Move to client is always available
- Bulk operations let you fix batches
- The Needs Attention flow surfaces what needs fixing

**Not:**
- Error prevention through required fields
- Strict validation that blocks progress
- Warnings that can't be dismissed

**Real-world implication:**
A user who adds "homde depot" instead of "Home Depot" should be able to fix it in 3 taps (tap transaction → tap Edit → fix name → Save Changes). The app should never prevent them from getting the initial capture in, even if it's imperfect.

**Design test:** For any validation rule, ask: "What happens if this validation is wrong?" If the answer is "the user can't save their data," the validation is too strict. If the answer is "the saved data is slightly imperfect but fixable," the validation is optional.

---

## Trust, But Confirm Destruction

Users should be able to work fast without fear. But destructive actions (delete, bulk delete) must require confirmation.

**Rules:**
- One-tap to initiate a destructive action
- One-tap confirmation (Alert dialog with Cancel + destructive action)
- No "undo" after confirmation (WYSIWYG)
- Explicit warning about permanence in the confirmation text

**Not applicable to:**
- Editing (always reversible)
- Moving (always reversible)
- Invoicing (always reversible via future "revert invoice" feature)
- Tagging/untagging (always reversible)

**Current state:**
The app correctly uses Alert dialogs for: client delete, transaction delete, bulk delete. These are all irreversible. The confirmation text ("This cannot be undone") is appropriate.

**What breaks this principle:**
A destructive action that doesn't have a confirmation. The receipt "Remove Receipt" action DOES have a confirmation alert — good. But "Move to client" (bulk move) does NOT have a confirmation — it fires immediately after client selection. This is fine since moves are reversible.

---

## The "Is This Necessary?" Test

Before shipping any new feature or screen element, ask: "Would a busy tradesperson who's never used this app before find this confusing or distracting?"

If yes: remove it or hide it behind an optional module.
If no: ship it.

**Applied to current codebase:**
- Seed data: A new user sees 5 pre-made clients and 6 transactions. Is this confusing? YES — they don't know if this is their data. Seed data should be clearly marked as demo data or removed entirely.
- Rules screen: A new user with no rules sees an empty screen with "Add Rule" options. Is this confusing? Somewhat — the UI for building rules (IF/THEN builder) might not be obvious. An example rule and tooltip would help.
- Tax bracket field: A user who doesn't know their tax bracket is confused by the "22%" default. Is this confusing? Mildly — a tooltip saying "This is an estimate. Talk to your accountant about your actual bracket" would help.
- Export buttons: Silent export buttons are confusing (Finding 2). The "Coming soon" Alert fixes this.

**The test in practice:**
Show the app to someone who hasn't seen it. Watch where they hesitate. Those moments are your design debt.

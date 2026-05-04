# STRESS_TEST_SIMULATION.md
# Uncrumple — Real-World Usage Simulations

---

## Session 1: Handyman's Full Work Day

**User context:** Jake, a handyman, runs 3 jobs in a day. He stops at hardware stores between jobs and needs to log receipts while moving.

**Morning — Job 1: Bathroom remodel for "Dave"**
1. Opens app, taps FAB → client picker shows all clients
2. Scrolls to find "Dave" (not visible if many clients) — types "dav" — filters to Dave
3. Taps Dave → client-detail opens with Add Transaction sheet
4. Types "Home Depot" → autocomplete fires (if saved before)
5. Types $43.27 → no note, no photo (in a hurry)
6. Save → note warning fires: "Add a note?" → taps Dismiss
7. Transaction saved

**Mid-morning — Stop at Shell for gas**
1. Opens app → FAB → types "per" → selects Personal
2. Client detail opens → Add Transaction sheet
3. Types "Shell" → amount $55.00
4. If Round Number Gas Detection is on → Fuel tag auto-applied
5. Saves quickly

**Noon — Lumber yard for Job 1**
1. FAB → selects Dave
2. Types "Menards" — autocomplete shows it
3. Amount $187.43
4. Takes receipt photo — preview shows
5. Saves — no note warning (has photo)

**End of day — Cleans up**
1. Home screen: Needs Attention might show 1 missing receipt (the Home Depot transaction with no note)
2. Taps "1 missing receipts" → explore shows that transaction
3. Taps transaction → client-detail for Dave opens → Add Transaction sheet DOESN'T open (only txId param matters)
4. Detail sheet shows Home Depot transaction
5. Taps "Add Receipt" → but it's end of day, receipt is gone → taps "Add Note" instead (must edit)
6. Taps Edit → types note "Caulk and tape" → saves
7. Returns to explore → "All clear" (once Finding 14 empty state is fixed)

**Friction points identified:**
- The "Missing receipts" filter catches transactions with no receiptUri AND no note. Adding the note alone (via Edit) resolves it.
- However: after editing in the client-detail modal and saving with `source=explore`, user returns to explore automatically. But the transaction might still appear momentarily (depends on React state update timing).
- Finding clients in the FAB picker is friction if there are 10+ clients and the user forgets the name.
- No shortcut to "add to last used client" — has to go through the client picker every time.

**What a careless Jake does:**
Skips the note warning every time. After 3 months, has 40 transactions in Needs Attention for "missing receipts." He doesn't know those are his note-free transactions from days he was in a hurry. The app never forced him to add notes so he never did.

**What a power Jake expects:**
"Last client: Dave" as the first option in the FAB — skips the search entirely for repeat jobs. Auto-submit on amount field so he can type merchant, tab to amount, press "done" on keyboard and have the transaction save immediately.

**Taps to add 3 transactions:** ~8-10 taps each. Total: ~25-30 taps for a full work day.
**Mental load:** LOW after first week. The flow is predictable.

---

## Session 2: Rapidly Adding 10+ Transactions in a Row

**User context:** After a big shopping day (construction supply run), user wants to log 8 transactions quickly.

1. Opens app → FAB → selects "Mentor House"
2. Transaction 1: "Menards" $203.11 → Save
3. Taps "+ Add Transaction" again (at bottom of client-detail) → sheet opens
4. Transaction 2: "Home Depot" $87.50 → Save
5. Repeat...

**What happens:**
- The Add Transaction sheet opens fresh each time (all fields cleared by `openAddSheet()`)
- Autocomplete remembers merchants from this session (savedMerchants from store)
- After 8 transactions, the pending list has 8 rows
- The "READY TO INVOICE" bar shows the growing total
- Scrolling is required to see older transactions

**Friction points:**
- No "add another" after saving — must tap "+ Add Transaction" at the bottom again
- The bottom "+ Add Transaction" button is BEHIND the growing pending list — user has to scroll down to find it OR use the keyboard (but it's a floating button, so it's always visible)
- Actually the "+ Add Transaction" is a `position: 'absolute', bottom: 30` button — always visible regardless of scroll. Good.
- After 10+ transactions, the ScrollView in client-detail can lag on older devices.

**What a careless user does during rapid entry:**
Misses a decimal and enters 43270 instead of 43.27. Saves. Doesn't notice. Their "outstanding" total for the client is now $43,270 instead of $43.27. The "READY TO INVOICE" bar shows a wildly inflated number. They tap invoice — now the client gets an invoice for $43,270. No amount validation guard exists to catch "this seems unreasonably high."

**Improvement opportunity:** A "Save & Add Another" button in the add transaction sheet would reduce taps by ~3 per transaction for bulk entry. At 8 transactions, this saves 24 taps.

---

## Session 3: Using Needs Attention to Clean Up at End of Day

**User context:** User has accumulated 5 flagged, 3 missing receipts, 7 untagged over the week.

**Flow:**
1. Home screen shows all 3 Needs Attention rows
2. Taps "5 flagged for review" → explore shows 5 flagged
3. Taps first → client-detail with detail sheet showing "Mark Reviewed" button
4. Taps "Mark Reviewed" → returns to flagged explore list (4 remaining)
5. Repeats for all 5 → "All clear" state (after Prompt 6 is applied)
6. Taps back (Android) → returns to explore (now shows no filter — first 10 transactions)
7. Back to home → taps "3 missing receipts"
8. Handles missing receipts: adds note or photo to each
9. Back to home → taps "7 untagged"
10. Opens each, adds tags via the edit form

**Total taps:** ~5 per flagged item, ~8 per missing receipt, ~6 per untagged = ~(25 + 24 + 42) = ~91 taps to process a week's backlog of 15 items.

**This is the most important flow to get right.** 91 taps for 15 items averages 6 taps per item — that's acceptable for a cleanup flow.

**What a careless user does during cleanup:**
After fixing all flagged transactions, taps back on the explore screen. Goes back to home. Taps "3 missing receipts." Instead of seeing filtered results, sees the first 10 transactions (unfiltered) because they tapped back and Explore lost the filter. Confused. Taps back home. Taps "3 missing receipts" again — this time it works because they tapped the Needs Attention row to re-navigate to the filtered view.

**Friction points:**
- For untagged items: must open detail sheet → tap Edit → scroll to tags → select → Save Changes → returns to explore. The edit flow requires 4 taps just to get to the tag selection.
- Better: Opening the detail sheet should show a "Quick Tag" action that drops straight to tag selection without entering full edit mode.

---

## Session 4: Adding Receipts Quickly While Multitasking

**User context:** User is at Walmart checkout, has 30 seconds, cashier is waiting.

1. Opens app (1 tap)
2. FAB (1 tap)
3. Finds and taps client (2-3 taps)
4. App navigates to client-detail, Add Transaction sheet opens (automatic)
5. Types merchant "Walmart" (fast, autocomplete helps)
6. Types amount
7. Taps "Take Receipt Photo"
8. Camera opens
9. Takes photo
10. Photo appears in sheet
11. Taps "Save Transaction"
12. Done

**Total: ~8 taps + 1 camera action = ~9 actions in 20-25 seconds**

**Friction points:**
- The camera for receipt is inside the Add Transaction sheet — user must scroll DOWN to see the camera button if the keyboard is open (the `KeyboardAvoidingView` pushes content up)
- On Android, `behavior="height"` for KeyboardAvoidingView can be problematic — the sheet might not scroll correctly to show the camera button
- If the user types quickly, autocomplete suggestions might appear OVER the amount field, requiring an extra dismiss tap

**What a careless user does at the checkout:**
Types "walmart" instead of "Walmart" — autocomplete shows "Walmart" (case-insensitive match) — taps it — fills field. Good. But if they dismiss autocomplete and save with "walmart," now they have "walmart" in their merchant history alongside "Walmart" (case-sensitive dedup).

**Risk:** The camera button being hidden behind the keyboard is a real usability issue for fast receipt capture.

**What a power user expects:**
An ultra-fast mode — camera FIRST, then fill in merchant/amount. The receipt photo opens immediately on the add transaction sheet. This matches how paper receipts work: you have the receipt, then you log it.

---

## Session 5: Switching Between Clients While Editing Transactions

**User context:** User is reviewing transactions, moves between clients.

1. Opens client "Savita" → views pending transactions
2. Taps transaction → detail sheet opens
3. Taps Edit → edit mode
4. Decides to check another client → presses Android back
5. Back CLOSES the entire client-detail screen (not just the modal)
6. Now on home → taps "Mentor House" → client-detail opens
7. Returns to Savita later

**Friction points:**
- Android back while in edit mode exits the entire screen — edit changes are lost
- No "save draft" capability
- If user taps backdrop while in edit mode, edit mode cancels (good — expected)
- The edit form does NOT show which client the transaction belongs to — can't confirm you're editing the right one

**What a careless user does:**
Is in the middle of editing a transaction amount. Gets a call. During the call, taps Android back to check who's calling. Comes back. They're on the home screen. The half-edited transaction was not saved. The amount is still wrong.

**Improvement:** A small "editing [merchant] for [client]" label at the top of the edit sheet would help orientation.

**What a power user expects:**
A draft save — when you leave the edit mode via back, prompt "Save changes or discard?" instead of silently discarding. Or auto-save the draft so it's available when they return.

---

## Session 6: Forgetting to Assign Clients, Then Fixing Later

**User context:** User adds several transactions to the wrong client and needs to reassign.

1. Realizes 3 transactions assigned to "Personal" should be "Savita"
2. Opens Savita → no, opens Personal client
3. Long-presses first wrong transaction → enters multi-select
4. Taps the other 2 wrong transactions to select them
5. Taps "Move to Client"
6. Client picker shows — taps Savita
7. 3 transactions moved to Savita
8. Personal no longer shows them

**This flow works well.** Multi-select + bulk move is the right tool.

**Friction points:**
- Must be ON the source client (Personal) to use multi-select. Can't bulk-select from the explore/search view.
- If the wrong transactions are spread across multiple clients, user must visit each client separately to bulk-move.

**What a careless user does:**
Has 15 transactions spread across 3 clients that all belong to one project. Must visit each of the 3 clients, select relevant transactions, and move them. Three separate multi-select/move operations instead of one. The correct behavior requires 3 trips through the flow.

**At scale:**
A contractor who often misattributes transactions (fast capture, assign later) will do this bulk-move flow regularly. At 20+ transactions to reassign across multiple clients, the current flow requires multiple sessions. Explore's multi-select (currently read-only) could help if bulk move were available from search results.

---

## Session 7: Using the App One-Handed While Moving Between Jobs

**User context:** User has phone in left hand, tablet, blueprints, etc. in right hand.

**Critical one-handed operations:**
- FAB tap: bottom-right ✓ (thumb-reach for right-handed)
- Scroll client list: vertical scroll ✓
- Back button: top-left (← Back text) — this is HARD to reach one-handed on large phones
- The custom back button is in the header area — high up the screen
- On a 6.5" phone, the back button at `padding: 24` from top is nearly out of thumb range

**What a careless user does:**
Navigates to client-detail. Wants to go back. Tries to reach the back button in the top-left corner. Can't reach it one-handed on a 6.7" phone. Uses Android hardware back instead — which works correctly (navigates back, doesn't close modals since no modal is open). Actually the hardware back is the right solution here.

**Friction points:**
- Back button placement is not ideal for one-handed use
- The 44px hitSlop helps but the position is still high
- Android hardware back button (thumb on right, edge) is the natural one-handed navigation — but it doesn't close modals (Finding 7)
- Ideal: Use Android hardware back as primary back navigation, treat the on-screen back button as secondary

**What a power user expects:**
A bottom-anchored navigation pattern (tab bar + swipe gestures) rather than top-left back buttons. The FAB is correctly placed — extend this philosophy to back navigation.

---

## Session 8: Receiving a Receipt, Then Editing It Later

**User context:** User takes photo at point of sale but entered the wrong amount. Needs to fix later.

1. Opens client detail
2. Finds the transaction
3. Taps → detail sheet shows receipt thumbnail
4. Taps Edit → edit mode opens
5. Changes amount
6. Taps Save — BUT: edit mode does NOT have receipt controls
7. Cannot replace receipt from edit mode
8. Must cancel edit → use "Replace Receipt" button in view mode

**Friction points:**
- Receipt controls and edit controls are separate — can't do both in one flow
- User who wants to edit amount AND replace receipt must do two separate operations
- Edit mode should ideally include receipt management

**What a careless user does:**
Fixes the amount. Done. Doesn't realize they should also check if the receipt amount matches the new amount they just entered. No prompt asking "Do you want to verify the receipt against the new amount?"

**Improvement opportunity:**
After editing an amount on a transaction that has a receipt, show a subtle note: "Amount updated. The existing receipt shows a different amount — consider replacing the photo."

---

## Session 9: Opening App After Week of Not Using It

**User context:** User was on vacation, returns to app after 7 days.

1. App opens — all data loads from AsyncStorage
2. Home screen shows clients with stale totals (unchanged from before vacation)
3. Needs Attention might show old items that were never fixed
4. The month header would have been "APRIL 2025" if left unchanged (bug)
5. Tax screen would show all accumulated transactions

**What works fine:**
- All persistent data is intact
- The app opens to the same state as when it was last used

**What feels stale:**
- Hardcoded month header (fixed by Prompt 1)
- Tax screen has no year filter — all transactions mixed together
- "Outstanding" total unchanged — if invoices were sent manually while app was unused, the app doesn't know

**What a careless user does:**
Returns from vacation. Adds new transactions. The "APRIL 2025" header (pre-fix) still says April. They don't know if the app is tracking correctly. They do a sanity check against their bank statement and find a discrepancy — was it the vacation transactions or the April ones? They can't filter by date to tell.

---

## Session 10: Using Search to Find Past Transactions

**User context:** User needs to find a Menards receipt from last month for an insurance claim.

1. Opens Search tab
2. Types "Menards" — sees all Menards transactions sorted by recency
3. The list shows merchant, client, date, note, amount
4. User finds the right one by date and amount
5. Taps it → client-detail opens with that transaction's detail sheet

**What works well:**
- Search is instant and searches merchant, note, and client name
- Client color dot helps visually identify which client
- Date shown in meta line

**What could be better:**
- No way to sort results (by date, by amount)
- All results mixed by recency — can't filter to "only Savita" without using the client detail search
- Receipt thumbnail not shown in search results — can't quickly confirm which one has a photo
- No way to filter by date range in search

**What a careless user does:**
Types "menards" (lowercase). The search IS case-insensitive, so "Menards" transactions appear. Good. But if they remember "it was for the Johnson project" and the client is named "Johnson Bros," they need to type "Johnson" to narrow by client — they can't combine merchant + client filters.

**At scale:**
With 500 transactions and 10 clients, search returns up to 50 "Menards" results. No pagination. No sort by amount (to find the big purchase vs small ones). User must scroll through all 50 to find the one from last November.

---

## Session 11: Editing a Transaction From a Filtered List (Fix Flow)

**User context:** User is working through "7 untagged" transactions from Needs Attention.

1. Home → "7 untagged" → explore shows 7 transactions
2. Taps first → client-detail opens with detail sheet
3. Taps Edit → edit mode opens
4. Adds tags in edit mode
5. Taps Save Changes → `saveTxEdit` fires
6. Because `source=explore && returnFilter=untagged`: `router.replace('/explore?filter=untagged')`
7. Explore shows 6 remaining untagged transactions
8. Transaction that was just tagged is GONE from the list ✓

**This flow works correctly.** The critical step is that after tagging, the transaction no longer matches `!t.tagIds || t.tagIds.length === 0` and disappears from the untagged filter.

**Friction points:**
- 4 taps minimum just to get to the tag picker for one transaction (tap result → tap edit → scroll to tags → select tag)
- The tags section in edit mode requires scrolling if the merchant/amount/note fields fill the sheet
- After adding tags in the full tag modal, user taps "Save" to close the tag modal, THEN "Save Changes" to commit the edit — two saves

**What a careless user does:**
Adds a tag in the full tag modal. Taps "Save" to close it. The tag chip appears in the edit form. Then accidentally taps backdrop instead of "Save Changes." Edit mode closes WITHOUT saving the tag change. They return to the filtered list — the transaction is still in the untagged list. They think their tag save worked but it didn't.

**At scale (40 untagged transactions):**
40 × 4 taps minimum + 2 modal taps = 240 taps to clear. That's a meaningful burden. The "quick tag" simplification (tapping a tag chip in VIEW mode without entering edit mode) would reduce this to 40 × 2 taps = 80 taps.

---

## Session 12: Deleting and Re-Adding a Client

**User context:** User misnamed a client "Day Program" and wants it renamed to "Evening Program" but accidentally deletes it instead.

1. Long-presses "Day Program" → menu → accidentally taps Delete instead of Edit
2. Alert: "Delete Day Program? Their transactions will remain in your records."
3. Taps Delete → client gone
4. Realizes mistake — no undo
5. Taps "+ Add" → types "Evening Program" → adds
6. New client has no transactions
7. Old transactions are now orphaned with clientId: 3 (the old client's ID)
8. The new "Evening Program" client has a Date.now() ID (very different from 3)
9. Old transactions remain in search results and tax screen attributed to no client

**Friction points:**
- No undo
- No "recover" flow
- Old transactions become orphans silently

**What a power user expects:**
- The delete confirmation should show "X transactions will become orphaned" and offer "Move transactions to another client before deleting"
- An undo toast (5 seconds) after deletion
- A "Recently deleted clients" recovery option in Settings

**What the user does to recover manually:**
Opens Search. Types notes or merchant names from the old client. Finds orphaned transactions (gray dot, no client name). Taps each one. Client detail opens for "Client not found." Dead end. They cannot reassign from there. They must create the new client, then... there is no path to reassign orphaned transactions because client-detail won't open for them.

**This is a real data recovery dead-end.** Orphaned transactions can only be deleted (from explore search, one by one) — not reassigned. The user permanently loses the ability to organize their orphaned history.

---

## Session 13: Handling a Large Number of Transactions (100+)

**User context:** A contractor who has been using the app for 6 months, accumulating ~15 transactions per month across 5 clients.

**Total: ~90 pending transactions distributed across clients**

**Home screen:** Clients show pending counts and totals — still fast to render (5 client cards)

**Client detail (one client with 30 pending transactions):**
- ScrollView renders all 30 in-memory — may lag on slow devices
- "Select All" selects all 30 — works
- Bulk delete fires for 30 — `bulkDeleteTransactions` filters the full transactions array — O(n) operation on ~90 items total — fast

**Tax screen:**
- `yearTxs.map(tx => ...)` renders all 90 transactions in a flat list — the "ALL TRANSACTIONS" section becomes very long
- No pagination, no virtualization — may be slow to scroll
- The `byClient` section is fine (5 items)

**Explore search:**
- Searching 90 transactions on every keystroke — O(n) filter — acceptable at 90, would lag at 500+

**Performance risk:** The app is designed for a year's worth of use. At 15/month × 12 months = 180 transactions, the Tax screen's flat list will be notably slow.

**What a careless user does:**
Opens Tax screen. Sees "ALL TRANSACTIONS" showing 180 rows. Scrolls through looking for a specific one. Takes 30 seconds. Gives up and uses Search instead. The "ALL TRANSACTIONS" section in the tax screen is effectively useless at this scale.

**Recommendation:** Remove or collapse the "ALL TRANSACTIONS" section from the tax screen (Simplification 3 in SIMPLIFICATION_PASS.md). It's already better served by Explore.

---

## Session 14: Long-Pressing Transaction in Multi-Select, Then Switching to Edit

**User context:** User long-presses to enter multi-select, selects 3 items, then realizes they want to edit one specifically.

1. Long-press transaction → multiSelect = true, selectedIds = [id]
2. Taps 2 more → 3 selected
3. Taps transaction they want to edit...
4. Because `multiSelect` is true, `openTxDetail` routes to `toggleSelect` instead of opening detail
5. User can't access the edit detail sheet while in multi-select mode
6. Must tap Cancel to exit multi-select
7. Then tap the transaction to open detail
8. Then tap Edit

**Friction points:**
- 3 extra taps to get from multi-select to edit mode on a specific transaction
- No way to edit while in multi-select

**What a careless user does:**
Tries to tap a transaction to open its details. Notices a checkmark appeared instead (they accidentally entered multi-select). Taps Cancel — but Cancel is in the multi-bar at the bottom, which only appears after the first long-press. They're confused about how to exit. They try tapping the checkmark transaction again — it deselects it (correct). Now they're in multi-select with 0 items. The Cancel button is still visible. They tap Cancel. Back to normal. Total confusion cost: ~4 extra taps and 10 seconds of confusion.

---

## Session 15: App Behaviors When Rules Are Actively Firing

**User context:** User has a rule: "merchant contains 'Shell' → tag as Fuel."

1. User adds transaction: merchant "Shell", amount $55.00
2. `addTransaction` runs rules engine
3. Rule matches → `mergedTagIds` includes Fuel tag ID
4. Transaction saved with Fuel tag

**What the user sees:**
- Transaction appears in list with Fuel tag chip visible ✓
- In Needs Attention, this transaction is NOT untagged ✓

**What the user can't see:**
- No indication that a rule was applied
- If they don't know about the rule, the automatic tag might be confusing
- "Why does this say Fuel?" — no way to trace it

**If the rule later changes or is deleted:**
- Already-tagged transactions keep their tags (tags were applied at creation, not dynamically read)
- Future Shell transactions would not get Fuel tagged
- The divergence between past and future behavior is invisible

**Friction points:**
- No audit trail of which rules fired
- No way to undo rule-applied tags in bulk (must edit each transaction manually)

**What a careless user does:**
Creates a rule "merchant contains 'Home' → tag as Materials." This rule also fires on "Home Depot," "Home Theater," "Home Office Depot," "Home Goods," etc. Every merchant containing the word "Home" gets tagged as Materials. The user doesn't notice until they review their tags and see their "Home Theater Center" television purchase tagged as Materials expense.

**What a power user expects:**
A "test rule" button that shows which existing transactions the rule would match. An indicator on each transaction showing "rule applied: [rule name]." The ability to retroactively remove rule-applied tags.

---

## Session 16: First-Time User Onboarding (No Guidance)

**User context:** New user downloads the app, opens for the first time.

1. App opens — home screen shows 5 pre-made clients and 6 seed transactions
2. User doesn't know these are demo data
3. User taps "Savita" — sees 2 transactions already there
4. User thinks these are their transactions somehow

**The fundamental first-run problem:**
The app has no onboarding. No "Welcome to Uncrumple" screen. No explanation of the seed data. A new user who sees "Savita: 2 transactions, $127.50" with no explanation might be confused or concerned.

**What a careless user does:**
Deletes "Savita" thinking it's placeholder data. The 2 seed transactions become orphaned. They add their real clients. They now have a mix of their real data and orphaned seed transactions showing up in Search and Tax.

**What a power user expects:**
A clear first-run experience: "Here are some example clients to help you explore — tap here to clear demo data and start fresh." Or simply: no seed data at all, with a proper empty state that guides users to add their first client.

**Recommendation:**
The seed data should be removable in one tap. Either add a "Clear demo data" button in Settings, or show it on first run as "example data." The current state confuses first-time users.

---

## Session 17: User With Many Tags (30+)

**User context:** Power user who has created a detailed tag taxonomy — 30+ tags for different expense categories.

1. Opens Add Transaction
2. Sees 8 tag chips in the quick-picker row
3. Needs to assign a less-used tag → taps "+"
4. Full tag modal opens
5. Scrolls through 30+ tag chips to find the right one
6. Taps tag → it's selected
7. Taps Save → modal closes

**What a careless user does:**
Creates tags like "Materials - Wood," "Materials - Metal," "Materials - Fasteners," "Materials - Misc." Now has 4 similar tags. The quick-picker shows the top 8 by usage — if all 4 Materials tags are used frequently, they compete for the 8 spots alongside other tags. The user can't see all their Materials tags at once. They tap "+" every time, then search "materials" to find the right one.

**What a power user expects:**
Tag grouping (sub-tags or tag categories), the ability to pin specific tags to the quick-picker, a way to reorder the quick-picker. None of these exist.

**At scale (50 tags):**
The tag modal becomes a 50-item scrollable grid with no sectioning. If tags are named similarly, the search box is the only way to navigate. This is actually functional (search works well) but not ideal.

---

## Session 18: Accountant Reviews the Tax Export (Future State)

**User context:** User's accountant needs to verify expenses at tax time.

**Current state:** The accountant can only see what the user screenshots or shows on their phone.
1. User opens Tax screen
2. Shows accountant: total logged, backed by receipts, estimated savings
3. Accountant asks for breakdown by category (tag)
4. User: "I can sort of see that... wait, no, I can't filter by tag"
5. Accountant asks for list with receipts
6. User shows the transaction list in client-detail
7. Accountant asks for year-only data
8. User: "I'm not sure, it might include older transactions..."

**What currently breaks for accountant use:**
- No year filter → can't show just 2026 expenses
- No tag breakdown in tax screen → can't show totals by category
- No export → nothing to share electronically
- Receipt URIs are local → can't share photos without going through them manually
- "Backed by receipts" number is inaccurate (uses `receipt` boolean, not `receiptUri`)

**This is the most important unfixed product gap for the $1 app's target use case.**
The user buys the app TO HELP WITH TAXES. The tax screen currently cannot reliably be used for actual tax preparation.

**Priority for fixing:**
1. Year filter (requires date model change — Finding 22)
2. Fix "backed by receipts" accuracy (Finding 3)
3. Tag breakdown in tax screen
4. CSV export (requires file system access)

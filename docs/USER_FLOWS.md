# USER_FLOWS.md
# Uncrumple — User Flows

---

## Flow 1: Add Client

**Expected behavior:** User taps "+ Add", types a name, confirms, sees client appear in list.

**Current behavior (code):**
1. User taps "+ Add" → `setShowAddClient(true)`
2. Add Client modal appears with TextInput (auto-focus)
3. User types name → stored in `newClientName`
4. User taps "Add Client" → `handleAddClient()` fires
5. Guard: `if (!newClientName.trim()) return` — silently does nothing if empty
6. `store.addClient(name)` called → auto-generates color (next unused from palette), initials, Date.now() ID
7. `newClientName` cleared, modal closes
8. Client appears in list immediately (React state update)
9. Saved to AsyncStorage

**Friction points:**
- No keyboard submit button support (no `onSubmitEditing` handler — user must tap the button)
- No validation feedback if name is empty (silent failure)
- No way to set color or photo at creation time

**What a careless user does:**
Types "dave" in lowercase, taps Add. Later types "Dave" for another client — now they have two clients with essentially the same name and different IDs, colors, and transaction sets. There is no duplicate name warning. This is especially bad because "dave" and "Dave" are identical after trim but differ in case.

**What a power user expects:**
Inline color picker at creation time, duplicate name detection, the ability to create a client from the Quick Add FAB flow without navigating to home first.

**Possible failure points:**
- If user taps backdrop to close modal before tapping "Add Client", the name is lost (expected but may surprise user)
- Very long names are truncated in list view (handled by `numberOfLines={1}`)

**What happens at scale:**
With 20+ clients, the "+ Add" button is still accessible. The new client appears at the end of the list. There is no sort by recent activity, no pinning. The user must scroll to find the new client. If names are similar (e.g., "Project A", "Project A2", "Project A3"), the tile view becomes hard to scan.

---

## Flow 2: Edit Client

**Expected behavior:** Long press client → menu appears → Edit Name → type new name → Save.

**Current behavior (code):**
1. Long press → `handleLongPress(client)` → sets `selectedClient`, opens menu
2. Menu shows: Edit Name, Change Color, Change Photo, Delete Client
3. Tap "Edit Name" → `handleEdit()` → copies `selectedClient.name` to `editName`, closes menu, opens edit modal
4. TextInput has `autoFocus`, user edits name
5. Tap "Save" → `handleSaveEdit()` → guards `selectedClient?.id && selectedClient?.name`, calls `editClient(id, editName)`
6. Modal closes, `selectedClient` cleared
7. Client in list updates immediately

**Friction points:**
- 2 modals deep (long press → menu → edit modal) — feels slightly heavy for a name change
- No keyboard submit button support

**What a careless user does:**
Long-presses the wrong client, sees the menu, panics, taps backdrop to close. No harm done — selectedClient is cleared when modal closes. But if they then long-press the right client and hit Edit and type a new name, they save successfully.

**What a power user expects:**
Single-tap to enter rename mode inline in the list, the ability to reorder clients via drag, and the edit menu to include a "View all transactions" shortcut.

**Possible failure points:**
- If `selectedClient` is null when Save is tapped (e.g., hot reload edge case), guard fires and nothing happens
- Edit modal closes if backdrop is tapped — name change is lost

---

## Flow 3: Delete Client

**Expected behavior:** Long press → Delete → confirm → client removed, transactions remain.

**Current behavior (code):**
1. Long press → menu → "Delete Client"
2. Alert dialog: "Delete [name]? Their transactions will remain in your records."
3. Two actions: Cancel, Delete (destructive)
4. On Delete: `deleteClient(id)` → filters client out of array → saves to AsyncStorage
5. `selectedClient` cleared
6. Transactions with that `clientId` remain in store but have no matching client

**Friction points:**
- Alert dialog is OS-level (can't style it to match the app)
- No undo

**What a careless user does:**
Accidentally taps Delete when they meant Edit (both in the same menu). The confirmation alert gives them one chance to cancel — but "Delete" is the destructive button on the RIGHT (or BOTTOM on iOS) and the user's thumb is moving in that direction after the menu tap. On Android the destructive action can appear to the right of "Cancel." A fast user will confirm without reading.

**What a power user expects:**
A "Delete and move transactions to..." option that lets them reassign transactions before deleting. A soft delete / archive option that hides the client without orphaning data. An undo toast after deletion.

**Real-world failure scenario:**
Jake (a handyman) has a client "Bathroom Dave" and a client "Kitchen Dave" — both for the same homeowner, different projects. He decides to consolidate them. He deletes "Bathroom Dave" expecting to move those transactions to "Kitchen Dave." Instead, 12 transactions become orphaned with no client attribution. He has no way to batch-reassign them. He must use explore search, tap each transaction, and manually move it one by one.

**Possible failure points:**
- Transactions with the deleted client's ID become orphaned (visible in tax screen, search results show gray dot with no name)
- If user navigates to client-detail for an orphaned transaction, they can't — tapping would still route to `/client-detail?id={deleted_id}` which returns `null` (blank screen)

**What this looks like at tax time:**
The tax screen shows "undefined: $1,240.00" as a client row. The user doesn't know what "undefined" means. Their accountant doesn't know either. This is the worst possible outcome for a tax app.

---

## Flow 4: Change Client Photo

**Expected behavior:** Long press → Change Photo → camera roll opens → select → photo appears on client tile.

**Current behavior (code):**
1. Long press → menu → "Change Photo"
2. `handleChangePhoto()` → guards `selectedClient?.id`, closes menu
3. Requests `requestMediaLibraryPermissionsAsync`
4. If denied: Alert, clears `selectedClient`, returns
5. `launchImageLibraryAsync` opens photo picker (NOT camera)
6. If not canceled and asset exists: `updateClientPhoto(id, uri)`
7. `selectedClient` cleared

**Friction points:**
- Opens photo LIBRARY (not camera) — user must pre-take a photo
- No crop confirmation (though `allowsEditing: true` and `aspect: [1,1]` should trigger crop UI)
- If permission denied, user must go to device settings — no deep link offered

**What a careless user does:**
Selects a landscape photo from their library. The `aspect: [1,1]` crop UI forces them to crop it to square. They crop awkwardly. The thumbnail looks bad. They can't remove the photo — only replace it. They have to set up another photo just to undo their mistake.

**What a power user expects:**
Camera option in addition to library. Remove photo option (return to initials/color avatar). Auto-suggest a photo based on recent photos with the client's name nearby (future feature).

**What happens at scale:**
A user with 20 clients who wants to update all their photos must go through this 4-step flow 20 times. There is no batch photo update.

---

## Flow 5: Add Transaction

**Expected behavior:** FAB or "+ Add Transaction" → merchant, amount → save.

**Current behavior (code):**

**Via FAB (from home screen):**
1. Tap FAB → `setShowQuickAdd(true)` → client picker modal
2. Optional: search clients by name
3. Tap client → `router.push('/client-detail?id={id}&addTx=1')`
4. Client detail screen mounts, `useEffect` detects `addTx=1`, calls `setShowAddSheet(true)`

**Via "+ Add Transaction" button (from client detail):**
1. Tap → `openAddSheet()` — clears all form fields, opens modal

**In the Add Sheet:**
1. Type merchant → triggers autocomplete (shows up to 4 suggestions)
2. Optionally tap suggestion → fills merchant field
3. Type amount (decimal keyboard)
4. Optional: type note
5. Optional: select card (only shown if cards exist)
6. Optional: select tags (top 8 shown, + button for full modal)
7. Optional: "Take Receipt Photo" → camera → preview shows
8. Tap "Save Transaction":
   - Validates: merchant not empty, amount > 0
   - If no receipt AND no note: Alert asking user to add note or dismiss
   - Calls `addTransaction({clientId, merchant, amount, note, receipt, receiptUri, date, invoiced: false, cardId, tagIds})`
   - Rules engine runs (applies matching tags/flags)
   - Gas round-number detection runs (if enabled)
   - Merchant added to autocomplete list
   - Transaction prepended to list

**Friction points:**
- Amount field accepts raw decimal — no "$" prefix shown, no comma formatting
- Date is set to today's date automatically (no user input) — good for capture, bad if logging yesterday's
- Warning about missing note is dismissable in one tap — good, but the warning text is slightly long
- No confirmation that transaction was saved (no toast, just modal closes)

**What a careless user does:**
Enters "43" for $43.00 but accidentally types "430" thinking the decimal will auto-insert (it won't). Saves $430.00 to a $43.00 receipt. They don't notice until they review — or never. There is no amount confirmation screen, no receipt comparison. Their tax total is now overstated.

**What a power user expects:**
Date backdating (add a transaction from yesterday or last week), duplicate detection, the ability to add multiple transactions in sequence without reopening the sheet each time ("Save & Add Another"), and inline receipt OCR that pre-fills merchant and amount from a photo.

**Possible failure points:**
- If user taps backdrop to close sheet mid-way, all entered data is lost (no "are you sure?" guard)
- Camera permission denied mid-flow: Alert shows but form stays open (user can continue without photo)
- `addTransaction` uses `rules` from store closure — if rules were just updated this session, there's a theoretical stale closure risk

**What happens at scale — adding 10 transactions in a row:**
After saving transaction 1, user must tap "+ Add Transaction" at the bottom of the client detail list. The list now has 1 item. They tap add. Repeat. After 10 transactions the list has scrolled and the "+ Add Transaction" button is below the fold — but it's `position: absolute` so it's always visible. This is good. But the flow requires 2 taps between each transaction (tap Save, tap + Add). A "Save & Add Another" button would halve this.

---

## Flow 6: Add Receipt (to existing transaction)

**Expected behavior:** Open transaction detail → tap "Add Receipt" → camera → photo saved.

**Current behavior (code):**
1. Tap transaction → `openTxDetail(tx)` → `setSelectedTx(tx)`
2. Detail sheet shows "Add Receipt" button (green, only if no `receiptUri`)
3. Tap "Add Receipt" → `addReceiptToTx()`
4. Requests `requestCameraPermissionsAsync`
5. If denied: Alert, returns (modal stays open)
6. `launchCameraAsync` opens camera
7. If not canceled: `editTransaction(selectedTx.id, { receipt: true, receiptUri: uri })`
8. `setSelectedTx` updated locally so UI refreshes immediately
9. If `source === 'explore' && returnFilter === 'missing'`: navigates back to explore

**ASYNC RISK:** `addReceiptToTx` reads `selectedTx.id` after `await launchCameraAsync`. `selectedTx` is a React state variable. If something set `selectedTx` to null between the await start and the result (e.g., backdrop tap), this would crash or assign the photo to the wrong transaction.

**What a careless user does:**
Taps "Add Receipt," camera opens, user decides they don't have the receipt and taps the Android hardware back button during camera. The camera closes. `result.canceled = true`. Nothing happens. Good. But if they tap the BACKDROP (behind the modal) while waiting for the camera permission dialog, `selectedTx` is set to null. When the camera finally opens and they take a photo, `selectedTx.id` is null — crash.

**What a power user expects:**
Option to add from photo library (not just camera), multi-photo receipts for large purchases, OCR to auto-confirm receipt matches the transaction amount.

**Friction points:**
- Camera only (no library option for existing receipts — Replace Receipt uses same camera-only flow)
- No way to add receipt from photo library (might be intentional for freshness)

---

## Flow 7: Replace Receipt

**Expected behavior:** Open transaction detail → tap "Replace Receipt" → camera → new photo saved.

**Current behavior:** Same as "Add Receipt" above, but shows "Replace Receipt" button when `receiptUri` already exists.

**What a careless user does:**
Taps "Replace Receipt" to fix a blurry photo. Camera opens. Takes a new photo. Camera closes. The old photo URI is overwritten — the old photo file still exists on disk but the app no longer references it. No cleanup of old files. Over time, the phone's app storage can accumulate orphaned receipt photo files that are never garbage collected.

---

## Flow 8: Remove Receipt

**Expected behavior:** Open transaction detail → tap "Remove Receipt" → confirm → photo removed.

**Current behavior (code):**
1. "Remove Receipt" button appears in detail sheet alongside thumbnail
2. Tap → Alert: "Remove Receipt" / "Remove this receipt photo from the transaction?"
3. On "Remove": `editTransaction(selectedTx.id, { receipt: false, receiptUri: null })`
4. `setSelectedTx` updated locally
5. Detail sheet updates — receipt section disappears, "Add Receipt" button appears

**Note:** After removing, `receipt: false` and `receiptUri: null` — this transaction would now appear in the "missing receipts" Needs Attention list IF it also has no note.

**What a careless user does:**
Removes a receipt photo by accident. There is no undo. If they still have the physical receipt, they can re-add it. If not, the transaction is now "missing receipt." The Needs Attention count increases by 1 — the user might not connect that they just caused this themselves.

**What happens at scale:**
Removing a receipt does not delete the photo file from device storage. After many remove+replace cycles, orphaned photo files accumulate. There is no mechanism to audit which URIs in storage are still referenced by live transactions.

---

## Flow 9: Edit Transaction

**Expected behavior:** Open transaction → tap Edit → change fields → Save Changes.

**Current behavior (code):**
1. Tap transaction → detail sheet opens
2. Tap "Edit" → `startEditing()`:
   - Copies `selectedTx.merchant/amount/note/tagIds` to edit state
   - Sets `isEditing = true`
   - Detail sheet switches to edit mode
3. User edits merchant, amount, note, tags
4. Tap "Save Changes" → `saveTxEdit()`:
   - Validates merchant not empty, amount > 0
   - `editTransaction(selectedTx.id, { merchant, amount, note, tagIds })`
   - Updates `selectedTx` locally
   - Sets `isEditing = false` — returns to view mode
   - If `source === 'explore'`: navigates to `/explore?filter={returnFilter}`

**Friction points:**
- Edit mode does NOT include receipt controls (can't add/replace/remove receipt while editing — must close edit, use Add/Replace/Remove buttons)
- Edit mode does NOT include card picker (cannot change card via edit)
- Date cannot be changed
- No "undo" or "discard changes" warning if you cancel

**What a careless user does:**
Enters edit mode to fix the merchant name. Accidentally clears the amount field and taps Save. Validation catches the empty amount and shows an alert — good. But if they enter "0" for amount, `parseFloat('0')` = 0 which is falsy. Validation catches this too. Good.

**What a power user expects:**
The ability to change the date, change the card, and manage receipts all within a single edit mode. Currently edit mode is incomplete — you can't change everything you might want to change without exiting and re-entering different modes.

**Possible failure points:**
- `selectedTx.id` used in `saveTxEdit` — not captured before any async, but there is no async in this function, so safe
- If `returnFilter` is undefined and `source === 'explore'`, navigates to `/explore?filter=undefined` — explore screen would show filter label "undefined" and no filtered results

**The edit mode's biggest gap:**
A user who wants to fix BOTH the amount AND add a receipt must do two separate operations:
1. Edit mode → fix amount → Save Changes
2. Back to view mode → tap "Add Receipt" → camera flow

This is 10+ taps for what should be one operation.

---

## Flow 10: Delete Transaction (single)

**Expected behavior:** Open transaction detail → tap trash icon → confirm → transaction gone.

**Current behavior (code):**
1. Detail sheet shows 🗑 icon in header row
2. Tap → `deleteSingleTx()`:
   - Alert: "Delete [merchant]? This cannot be undone."
   - On Delete: `deleteTransaction(selectedTx.id)`, `closeTxDetail()`
3. Transaction removed from list immediately

**Note:** `selectedTx?.merchant` used in Alert message — safe (optional chaining).

**What a careless user does:**
Taps trash icon by accident while scrolling the detail sheet header. Confirmation alert appears. Their thumb is still moving in the downward direction — they tap "Delete" instead of "Cancel." Transaction deleted. No undo. This is the most destructive accidental action in the app. The confirmation dialog is the only protection.

**What a power user expects:**
A brief undo window (5 seconds before the delete commits), or at minimum a more clearly positioned trash icon that requires deliberate tap.

---

## Flow 11: Mark Reviewed (unflag)

**Expected behavior:** Flagged transaction → open detail → "Mark Reviewed" → flag removed.

**Current behavior (code):**
1. If `selectedTx.flagged === true`, "Mark Reviewed" button appears
2. Tap → `editTransaction(selectedTx.id, { flagged: false })`
3. `setSelectedTx` updated locally
4. Button disappears
5. If `source === 'explore' && returnFilter === 'flagged'`: navigates back to explore

**What a careless user does:**
Taps "Mark Reviewed" without actually reviewing the transaction. The flag is cleared permanently. There is no way to re-flag from the detail view — the only way to re-flag is via a rule (which requires the same conditions to fire again on the next matching transaction, not on an existing one). Rules don't retroactively re-flag.

**What a power user expects:**
A "Flag" toggle button that works in both directions. The ability to flag a transaction manually (not just via rules). A notes field on the flag saying why it was flagged.

---

## Flow 12: Add Tag (create new)

**Expected behavior:** In add/edit transaction → tap "+" in tag chips → full tag modal → type new name → create.

**Current behavior (code):**
1. In Add or Edit sheet, a row of the top 8 tags is shown
2. Tap "+" → `setShowTagModal(true)` with `tagModalForEdit` set appropriately
3. Full tag modal opens with all tags sorted by usage
4. Optional: type in search box to filter
5. If search has no matches: a "+ '[name]'" create button appears
6. Tap create button → `handleCreateTag()`:
   - Creates new tag with `addTag({ name, color })`
   - Color assigned by cycling `TAG_CYCLE_COLORS` based on current tag count
   - Newly created tag ID added to `selectedTagIds` or `editTagIds`
7. Tag appears selected in modal
8. Tap "Save" → modal closes, tag chip appears in form

**Friction points:**
- Tag creation only triggers when there are NO matches — if there's a similar existing tag, the create button won't show
- Auto-assigned tag color based on count — not user-chosen at creation time
- To change a tag's color after creation, user must go to Rules screen → tag edit

**What a careless user does:**
Types "fuel" in the tag search. Sees the existing "Fuel" tag. Thinks "close enough" but wants a lowercase version. Doesn't see a create button (because "Fuel" matches). Creates the tag via the Rules screen instead. Now has both "Fuel" and "fuel" — identical purpose, different IDs, different colors, no deduplication warning.

**What a power user expects:**
Case-insensitive tag match detection with a "Did you mean 'Fuel'?" suggestion. Inline color picker during creation. The ability to merge two tags.

---

## Flow 13: Create Tag (via Rules screen)

**Expected behavior:** Rules screen → "+ Add Tag" → name, color → Save Tag.

**Current behavior (code):**
1. Tap "+ Add Tag" → `openAddTagSheet()`
2. Tag sheet opens: name TextInput + color swatches (10 colors)
3. Type name, tap color
4. "Save Tag" enabled only when both name and color are set (`canSaveTag`)
5. Tap Save → `handleSaveTag()` → `addTag({name, color})`
6. Tag appears in list

**What a careless user does:**
Creates 20 tags "just in case." The top-8 shortcut in the transaction form shows only the 8 most used. New tags that haven't been used yet don't appear in the shortcut. The user can't figure out where their new tags went. They must tap "+" to open the full tag modal to find them.

---

## Flow 14: Add Rule from Transaction

**Expected behavior:** View transaction detail → tap "+ Add Rule" → rules screen opens with merchant pre-filled.

**Current behavior (code):**
1. In transaction detail sheet: "+ Add Rule" link at bottom
2. Tap → `closeTxDetail()` → `router.push({ pathname: '/rules', params: { prefillMerchant: selectedTx.merchant } })`
3. Rules screen mounts
4. `useEffect` detects `prefillMerchant`, sets IF rows with merchant pre-filled, opens rule sheet
5. User completes the THEN conditions
6. Saves rule

**Friction points:**
- Detail sheet closes before navigation — user can't see transaction while building the rule
- No way to cancel and return to the transaction (rules back button goes to previous page, not back to the transaction)

**What a careless user does:**
Taps "+ Add Rule" from a transaction. Gets taken to rules screen with merchant pre-filled. Decides they don't want to create a rule. Taps back. They're back on client detail — but the transaction detail sheet is CLOSED (it was explicitly closed before navigation). They have to find and re-tap the transaction to see its details.

**What a power user expects:**
A rule creation sheet that slides up over the transaction detail (without closing it). The ability to see the transaction while configuring the rule. A "test rule" button that shows which existing transactions would be affected.

---

## Flow 15: Needs Attention → Explore → Client Detail → Fix → Return

**Expected behavior:** Home shows "3 flagged for review" → tap → explore shows flagged transactions → tap one → client detail opens that transaction → user marks reviewed → returns to filtered explore list.

**Current behavior (code):**
1. Home Needs Attention row: `router.push('/explore?filter=flagged')`
2. Explore renders with `filter=flagged` — shows all `t.flagged === true` transactions
3. Tap a transaction: `router.push('/client-detail?id={tx.clientId}&txId={tx.id}&source=explore&returnFilter=flagged')`
4. Client detail mounts — `useEffect` finds `txId`, opens that transaction's detail sheet
5. User taps "Mark Reviewed" → `editTransaction(id, { flagged: false })` → if `source=explore && returnFilter=flagged`: `router.replace('/explore?filter=flagged')`
6. User is returned to the filtered explore list

**This flow mostly works.** Known issues:
- If `returnFilter` is not passed or is undefined: navigates to `/explore?filter=undefined`
- After `router.replace`, if user taps Android back on explore tab, they'd go back to the tab stack start (not to the client detail they came from — which is correct behavior but may feel abrupt)
- If the user taps "Edit" then "Save Changes" instead of "Mark Reviewed", same return navigation fires from `saveTxEdit` — also correct

**What a careless user does:**
Opens a flagged transaction. Instead of "Mark Reviewed," they tap "Edit" to see the details. They make no changes and tap "Save Changes." They're returned to the flagged explore list — correct. But "Save Changes" without changes still fires `editTransaction` (a no-op write). The transaction is overwritten with the same values, which is harmless but unnecessary.

**What a power user expects:**
The ability to mark multiple flagged items reviewed in one action (bulk review). The ability to add a note explaining WHY it was reviewed while marking it ("reviewed — confirmed this was a materials purchase"). A count of how many items remain visible throughout the flow.

**What happens at scale:**
A user with 40 flagged transactions faces 40 × ~5 taps = 200 taps to clear them all. The queue doesn't support bulk-review. Each transaction requires a round trip through client-detail. This is the biggest scale problem in the Needs Attention flow.

---

## Flow 16: Search Flow

**Expected behavior:** Tap Search tab → type merchant/client/note → results appear.

**Current behavior (code):**
1. Tap Search tab → explore screen renders
2. Without filter or query: shows first 10 transactions
3. User types (>1 character threshold): filters across merchant, note, client name
4. Tap result → navigates to client-detail with transaction pre-opened
5. No clear button on search input (must manually delete text)
6. No recent searches saved

**What a careless user does:**
Searches for "depot" to find Home Depot transactions. Finds 12 results. Taps one to check. Comes back to search — the search term is still there (good). But after tapping a result, the back navigation goes to client-detail, not back to search results. They must tap back again (to explore) to get to their results. Two taps to "go back to search" feels like one too many.

**What a power user expects:**
Filter by client, filter by date range, filter by amount range, filter by tag, filter by card. Sort by amount (find the biggest expense) or by date. Save a search as a custom filter. Export search results. None of these exist.

**What happens at scale:**
With 500 transactions, the search runs `transactions.filter(...)` on every keystroke. At 500 items, this is fast. At 5000, the filter runs across a large array on every character typed — should debounce at that scale.

---

## Flow 17: Tax Flow

**Expected behavior:** Tax tab → view yearly summary → adjust bracket → see savings update.

**Current behavior (code):**
1. Tap Tax tab → tax screen renders
2. Shows current year label (dynamic), all transactions summed
3. Tax bracket TextInput: defaults to stored rate
4. User edits rate → `onBlur` validates and calls `updateTaxRate`
5. `estimatedSavings` and display update (because taxRate changes cause re-render)
6. Export buttons visible but do nothing

**Friction points:**
- All transactions shown regardless of year — if this is year 2 of using the app, everything is mixed
- "BACKED BY RECEIPTS" uses `t.receipt` (boolean) — inflated by initial seed data
- Export buttons give no feedback that they're not implemented

**What a careless user does:**
Taps "Export CSV" to send to their accountant. Nothing happens. They tap it again. Still nothing. They assume the button is broken and lose confidence in the app. This is the single most trust-damaging moment in the entire app for a user who needs to actually use the tax data.

**What a power user expects:**
Year filter to see only current-year transactions, CSV export that actually works, PDF summary, breakdown by tag (how much in "Materials" vs "Fuel" vs "Food"), ability to mark a transaction as "not deductible" without deleting it.

**Biggest conceptual gap in the tax screen:**
The screen is called a "year summary" but there is no year. The number `{year}` displayed in the header is `new Date().getFullYear()` — but the transactions are ALL transactions from ALL years. A user who has been using the app since 2024 in 2026 will see their 2024 and 2025 expenses included in their "2026 Summary." Their accountant will be confused.

---

## Flow 18: Settings Flow

**Expected behavior:** Gear icon → Settings → toggle gas detection → back.

**Current behavior (code):**
1. Tap ⚙ gear icon on home screen → `router.push('/settings')`
2. Settings shows one toggle: Round Number Gas Detection
3. Toggle fires `updateSettings('roundNumberGas', v)` → persisted immediately
4. "Manage Rules" row → `router.push('/rules')`
5. Back button → `router.back()`

**What a careless user does:**
Taps "Manage Rules" expecting to find "Manage Tags." Instead sees rules, tags, AND cards all on one screen. Scrolls past rules looking for tags. Finds them. Doesn't know to look at the top of the screen for the rules section. The single-screen "everything" approach is confusing for new users.

**What a power user expects:**
Separate dedicated screens for Rules, Tags, and Cards. The ability to reorder rules (priority matters — first matching rule wins vs. all matching rules apply). A "test all rules against my transactions" audit mode. Import/export rules. None of these exist.

---

## Flow 19: Android Back Button Behavior

**Current implementation:**
- No `BackHandler` registration anywhere in the app
- No `usePreventRemove` or similar navigation guards
- No hardware back handling for modals

**What currently happens:**
- On any screen: Android back navigates back in the stack (standard behavior)
- While a modal is open: Android back navigates AWAY from the screen, leaving the modal open briefly before unmounting — the modal content is NOT dismissed properly
- On the home tab (index): Android back may minimize or exit the app (standard tab behavior)
- On the Tax tab: Same as home
- On client-detail with multi-select active: Android back navigates away, leaving selectedIds state abandoned

**This is a known friction point for Android users.** Modals should intercept the back button.

**What a careless user does:**
Starts entering a transaction in the Add Transaction sheet. Phone rings. They press Android back to switch apps. They return to the app and are back on the home screen. All their entered data (merchant, amount, note, camera photo) is gone. This happens silently. They must start over.

**What a power user expects:**
Android back while a modal is open should always close the modal first. Only if no modal is open should back navigate. This is the platform-standard expectation for Android users and is a significant quality gap compared to any established Android app.

**Fix priority order:**
1. client-detail.tsx — Add Transaction sheet (highest data loss risk)
2. client-detail.tsx — other modals (tag modal, receipt viewer)
3. index.tsx — Quick Add FAB client picker modal
4. rules.tsx — rule sheet, tag sheet, card sheet
Handle one screen at a time, test thoroughly after each.

---

## Flow 20: Invoice Flow

**Expected behavior:** Client detail → "READY TO INVOICE" bar appears when pending transactions exist → tap "Invoice →" → name the invoice → all pending transactions become invoiced.

**Current behavior (code):**
1. If client has pending (non-invoiced) transactions, a "READY TO INVOICE" bar appears at the top of client detail
2. Tap "Invoice →" → invoice modal opens
3. User types an invoice label (e.g., "May Work")
4. Tap "Confirm" → `markInvoiced(clientId, label)` fires
5. All pending transactions for this client get `invoiced: true`, `invoiceId: 'inv-' + Date.now()`, `invoiceLabel: label`, `invoiceDate: today`
6. Transactions move from "Pending" section to "Invoice History" section
7. The "READY TO INVOICE" bar disappears

**What a careless user does:**
Names the invoice "Invoice" (generic). Sends three invoices in a row. Now has "Invoice" (March), "Invoice" (April), "Invoice" (May) in Invoice History. They all look the same. They can't tell which is which without checking dates. Naming matters but there's no guidance.

**What a power user expects:**
Auto-naming based on date ("April 2026 Invoice"), the ability to undo an invoice (return to pending), PDF generation, tracking whether the invoice was paid.

**What happens at scale:**
A client with 24 months of invoice history has 24 invoice groups in their detail screen. The Invoice History section becomes very long. There is no collapse, no pagination, no archive. Scrolling past 24 invoice groups to reach the older ones takes significant time. Each group shows all transactions within it — this list can itself be long.

---

## Summary: Friction Points Across All Flows

| Flow | Taps Required | Friction | Critical Gap |
|---|---|---|---|
| Add transaction (via FAB) | ~6-8 taps minimum | Client picker adds 1 extra step | No "last client" shortcut |
| Add transaction (from client detail) | ~4-6 taps | Efficient | No "Save & Add Another" |
| Find and fix flagged item | ~5 taps | Good once understood | Bulk review impossible |
| Find and fix missing receipt | ~5 taps + camera | Good | Camera-only (no library) |
| Edit a transaction field | ~5 taps | OK | Can't change date or card |
| Change client color | ~3 taps | Good | None |
| Delete a transaction | ~4 taps | Good (confirm appropriate) | No undo |
| Add a rule from a transaction | ~4 taps | Loses transaction context | Can't return to transaction |
| Search and view a transaction | ~2-3 taps | Good | No sort, no filter by client |
| Tax view | ~1 tap | Immediate but misleading | No year filter |
| Invoice a client | ~4 taps | Clear and fast | No PDF, no paid tracking |
| Android back from modal | N/A | DATA LOSS RISK | No BackHandler anywhere |

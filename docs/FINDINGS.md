# FINDINGS.md
# Uncrumple — Code Audit Findings

---

## Finding 1: Hardcoded Month Header

**File:** `app/(tabs)/index.tsx`
**Function/Area:** Header render
**Category:** UI / Data
**Risk:** LOW

**Problem:** The header shows `APRIL 2025` as a hardcoded string. This will never update as months and years change.

**Why it matters:** Users will see "APRIL 2025" forever. When shown to anyone (including app store screenshots), it immediately signals the app is broken or abandoned.

**What a careless user does:** Uses the app for weeks without noticing. Shows it to a potential client who asks "why does it say April 2025?" The user has no answer.

**What a power user expects:** The header to reflect the current period with configurable granularity — monthly view, quarterly view, yearly view.

**Alternative approaches:**
- Simple fix: replace with `new Date().toLocaleDateString(...)` (zero risk, 1 line)
- Better: make the header a period selector that filters the dashboard
- Best (v2): let users pick view period (current month, last 30 days, this year)

**Suggested fix:** Replace with dynamic: `new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()`

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/(tabs)/index.tsx`, find the hardcoded string `'APRIL 2025'` in the header and replace it with a dynamic expression that shows the current month and year in the same format. Do not change styles. One file only. Minimal patch.

---

## Finding 2: Export Buttons Have No Handler

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** Export section render
**Category:** UX / Missing feedback
**Risk:** LOW

**Problem:** "Export CSV" and "Export PDF Report" buttons exist with no `onPress` handler. Tapping them does nothing — no feedback, no indication they're not implemented.

**Why it matters:** Users will tap these, nothing happens, and they'll think the app is broken. Especially bad for first impressions. These buttons are highly visible (large, prominent in the tax view). They promise a key feature (sharing data with an accountant) and deliver silence.

**What a careless user does:** Taps CSV. Nothing. Taps PDF. Nothing. Sends a bad review: "The export feature doesn't work." This is a 1-star review about a feature that was never implemented — but users can't tell the difference between "not implemented" and "broken."

**What a power user expects:** Either working export OR an honest "Coming Soon" state that shows when export will be available.

**Alternative approaches:**
- Simple fix: Alert "Coming soon" on each tap (zero risk)
- Medium: Gray out with "Coming soon" label below (communicates state visually)
- Complex: Actually implement CSV export (high effort, medium risk — requires file writing and sharing permissions)

**Suggested fix:** Add `onPress={() => Alert.alert('Coming soon', 'Export will be available in a future update.')}` to both buttons, OR gray them out with a "Coming soon" label.

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/(tabs)/tax.tsx`, add an `onPress` handler to both export buttons (Export CSV and Export PDF Report) that shows `Alert.alert('Coming soon', 'Export will be available in a future update.')`. Do not change styles, do not refactor. One file only.

---

## Finding 3: `receipt` vs `receiptUri` Inconsistency

**File:** `store.tsx`, `app/(tabs)/explore.tsx`, `app/(tabs)/tax.tsx`, `app/client-detail.tsx`
**Function/Area:** Transaction data model, display, filtering
**Category:** Data integrity / Logic bug
**Risk:** HIGH

**Problem:** The `receipt` boolean and `receiptUri` string are maintained independently. Initial seed data has `receipt: true` but no `receiptUri`. This causes:
1. Tax screen "Backed by Receipts" counts are inflated (uses `t.receipt`)
2. Explore "missing receipts" filter uses `!t.receiptUri && !t.note` — can miss `receipt: true` transactions with no URI
3. Green dots in transaction lists use `tx.receipt` — can show green dot with no actual photo

**Why it matters:** Users might see "3 missing receipts" in Needs Attention but find those transactions have a green receipt dot. The trust damage is two-directional: the "backed by receipts" tax number is wrong, and the Needs Attention count is inaccurate.

**What a careless user does:** Sees 6 transactions with green receipt dots (seed data). Thinks their data is complete. Shows their accountant: "I have receipts for all of these." Accountant asks to see the photos. There are no photos.

**What a power user expects:** Receipts to mean receipts. The green dot to appear only when there is an actual photo file accessible. The tax "backed by receipts" number to be conservative (under-report rather than over-report).

**Failure scenario at scale:**
After 1 year of use, a user has 200 transactions. 180 have actual photos. 20 have `receipt: true` but no URI (created before the issue was fixed, or via seed data). The tax screen reports "200 backed by receipts." 10% of that number is false. If deducted by an auditor who then finds no receipts, there could be tax implications.

**Suggested fix:** Long term — deprecate the `receipt` boolean and use `!!receiptUri` everywhere. Short term — make all receipt checks use `!!t.receiptUri` consistently.

**Can Claude Code safely fix this automatically?** NO

**What human decision is needed:** Decide whether to keep `receipt` as a field at all, or always derive it from `receiptUri`. This has implications for how seed data and old saved data behave. Must test with existing AsyncStorage data.

**Fix order (after human decision):**
1. Change seed data in store.tsx: remove `receipt: true` from seed transactions
2. Change `client-detail.tsx` green dot: `tx.receipt` → `!!tx.receiptUri`
3. Change `explore.tsx` missing receipts badge: `tx.receipt` → `!!tx.receiptUri`
4. Change `tax.tsx` backed-by-receipts: `t.receipt` → `!!t.receiptUri`
5. Optionally remove `receipt` from `addTransaction` and `editTransaction`

---

## Finding 4: `workTotal` Uses Hardcoded Client ID 5

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** `workTotal` calculation
**Category:** Logic bug / Fragile assumption
**Risk:** MEDIUM

**Problem:** `workTotal` excludes `t.clientId !== 5` to exclude Personal transactions from estimated savings. Client ID 5 is the initial seed Personal client. If a user deletes and re-creates a Personal client, the new one gets a `Date.now()` ID and will NOT be excluded from work totals. Also, `outstandingTotal` in index.tsx excludes by `c.name !== 'Personal'` (name comparison) — completely different logic.

**Why it matters:** The estimated savings calculation will be wrong for any user who recreated their Personal client. Two different exclusion strategies for the same concept is fragile and inconsistent.

**What a careless user does:** Deletes "Personal" client (doesn't like the name). Adds a new client called "Personal expenses." The tax screen now includes all their personal expenses in `workTotal` because the new client's ID is not 5. Their estimated savings are wildly inflated.

**What a power user expects:** A formal concept of "personal" vs "business" client category, or a toggle on each client for "exclude from tax totals." This is a real product gap — not all expenses for all clients are deductible.

**Alternative approaches:**
- Simple fix: change `clientId !== 5` to name-based comparison (low risk, better than nothing)
- Better: add an `isPersonal` boolean to the Client model
- Best (v2): add a `taxCategory` field to transactions/clients with proper deductible tracking

**Suggested fix:** Standardize on name-based comparison (`c.name.toLowerCase() === 'personal'`) or add a `isPersonal` flag to clients. Align both `outstandingTotal` and `workTotal` to use the same logic.

**Can Claude Code safely fix this automatically?** YES (the tax.tsx part)

**Safest patch prompt:**
> In `app/(tabs)/tax.tsx`, change the `workTotal` calculation. Instead of `t.clientId !== 5`, it should exclude transactions whose client has a name of 'Personal'. First find the client from the `clients` array using `t.clientId`, then check if `client?.name === 'Personal'`. Do not change styles, do not refactor. One file only.

---

## Finding 5: `fmt()` in tax.tsx Does Not Coerce to Number

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** `fmt()` function, `totalLogged` calculation
**Category:** Null safety / Potential crash
**Risk:** MEDIUM

**Problem:**
1. `const fmt = (n) => '$' + n.toFixed(2)` — no `Number()` coercion. If `n` is a string or undefined, this crashes.
2. `yearTxs.reduce((s, t) => s + t.amount, 0)` — `t.amount` is not coerced to Number. If amount was saved as a string, addition produces string concatenation.

Compare with client-detail.tsx and index.tsx which use `'$' + (Number(n) || 0).toFixed(2)` — safe.

**Why it matters:** If any transaction has a string `amount` (e.g., from a migration or corrupted save), the tax screen crashes with a white screen.

**What a careless user does:** Nothing — this crash is triggered by data, not action. A user who migrated their data or edited AsyncStorage externally might trigger it. More likely, this becomes a concern during the future date-format migration if amounts are accidentally treated as strings.

**What a power user expects:** The tax screen to never crash, even with dirty data. Defensive number handling throughout.

**Tradeoff of the fix:**
Adding `Number()` coercion means string amounts of "0" or "abc" become $0.00 silently. This is better than crashing, but ideally the data should be clean enough that coercion is a safety net, not a crutch.

**Suggested fix:** Change `fmt` to `(n) => '$' + (Number(n) || 0).toFixed(2)` and add `Number()` to reduce calls.

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/(tabs)/tax.tsx`, change the `fmt` function from `(n) => '$' + n.toFixed(2)` to `(n) => '$' + (Number(n) || 0).toFixed(2)`. Also change `yearTxs.reduce((s, t) => s + t.amount, 0)` to `yearTxs.reduce((s, t) => s + (Number(t.amount) || 0), 0)`. Same fix for `totalWithReceipts` and all other `.reduce` calls on amounts in that file. Do not change styles, do not refactor. One file only.

---

## Finding 6: `client-detail.tsx` Returns Blank Screen When Client Not Found

**File:** `app/client-detail.tsx`
**Function/Area:** `if (!client) return null`
**Category:** Null safety / UX failure
**Risk:** HIGH

**Problem:** If the `id` param doesn't match any client (e.g., client was deleted, or invalid param was passed), the screen returns `null` — a completely blank screen with no back button, no explanation, and no way to navigate away except by Android back or tab navigation.

**Why it matters:** This is a dead-end for users. If they navigate to a deleted client via a bookmark or the Needs Attention flow, they're stuck.

**What a careless user does:** Taps a transaction in the flagged explore list. The transaction's `clientId` references a deleted client. Client detail returns null. The screen is white. The user has no idea what happened. They can't go back (no button). They must use Android hardware back — which many Android users know to try, but some don't. If they close the app and reopen, they're back on the home screen.

**What a power user expects:** A graceful error screen with a message explaining the issue and a button to return to the home screen. Ideally, automatic cleanup of orphaned transaction client references.

**Alternative approaches:**
- Simple fix: Show "Client not found" + back button (zero risk, clear improvement)
- Better: Also attempt to show the orphaned transactions in a special "Orphaned" view
- Best (v2): Automatic cleanup on delete — offer to reassign before deleting

**Suggested fix:** Replace `if (!client) return null` with a fallback render that shows a "Client not found" message and a back button.

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/client-detail.tsx`, find `if (!client) return null` and replace it with a fallback that renders a SafeAreaView with a back button (using `router.back()`) and a centered message "Client not found." Use the existing `s.root`, `s.header`, `s.backBtn`, `s.back` styles. Do not change any other logic. One file only, minimal patch.

---

## Finding 7: Android Back Button Does Not Close Modals

**File:** All screens with modals (`app/(tabs)/index.tsx`, `app/client-detail.tsx`, `app/rules.tsx`)
**Function/Area:** Modal management
**Category:** Android behavior / Platform parity
**Risk:** MEDIUM

**Problem:** No `BackHandler` is registered anywhere. When a modal is open and the user presses the Android hardware back button, the app navigates AWAY from the current screen instead of closing the modal.

**Why it matters:** This is non-standard Android behavior. Users expect back to close modals, not navigate away. Pressing back while the Add Transaction modal is open would exit client-detail entirely, losing all entered data.

**What a careless user does:** Starts filling out an add transaction form. Gets a phone call. Presses Android back to multitask. Returns to the app. They're back on the home screen. Everything entered is lost. This happens once — the user then distrust the app for long-form data entry.

**What a power user expects:** Standard Android modal dismissal behavior. Back = close top modal. If no modal is open, back = navigate backward in stack.

**Tradeoffs of the fix:**
- Adding BackHandler to client-detail is the highest priority (most data at risk)
- Must handle multiple modal states (which modal is "top"?)
- BackHandler listener must be removed when screen blurs to avoid intercepting back on other screens
- Recommend: one screen at a time, starting with client-detail's add transaction sheet

**Can Claude Code safely fix this automatically?** NO (requires careful placement, needs to handle multiple modals per screen)

**What human decision is needed:** Decide which modals to prioritize (start with the Add Transaction modal in client-detail as it has the most data loss risk).

---

## Finding 8: `addReceiptToTx` Reads `selectedTx.id` After `await`

**File:** `app/client-detail.tsx`
**Function/Area:** `addReceiptToTx()`
**Category:** Async race condition
**Risk:** MEDIUM

**Problem:**
```js
const addReceiptToTx = async () => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  ...
  const result = await ImagePicker.launchCameraAsync(...);
  if (!result.canceled && result.assets[0]) {
    const uri = result.assets[0].uri;
    editTransaction?.(selectedTx.id, { ... });  // ← selectedTx read AFTER await
    setSelectedTx(prev => prev ? { ...prev, ... } : null);
  }
};
```
`selectedTx` is a React state variable. Between the `await` and the `selectedTx.id` read, the user could have tapped the backdrop (setting `selectedTx` to null), causing a crash or wrong transaction being edited.

**Why it matters:** Camera takes several seconds. The user might tap elsewhere while waiting for the camera to open, then the photo gets assigned to the wrong (or null) transaction.

**What a careless user does:** Taps "Add Receipt." Camera permission dialog appears. They tap "Deny" — no, wait, they meant "Allow." They tap outside the modal while trying. `selectedTx` is now null. Camera opens. They take a photo. `selectedTx.id` is null — crash with "Cannot read property 'id' of null."

**Alternative approaches:**
- Simple fix: capture txId before await (zero risk, minimal change)
- Better: disable backdrop tap while camera is loading (reduces race window)
- Best: use a ref for selectedTx so it can't be stale inside the async function

**Suggested fix:** Capture `const txId = selectedTx?.id; const txReceiptUri = selectedTx?.receiptUri;` before any await. Use `txId` in all subsequent code. Return early if `txId` is falsy.

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/client-detail.tsx`, find the `addReceiptToTx` function. At the very start of the function body (before any await), add: `const txId = selectedTx?.id; if (!txId) return;` Then replace all uses of `selectedTx.id` inside that function with `txId`. Do not change any other functions. One file only. Minimal patch.

---

## Finding 9: `saveTxEdit` Navigates to `/explore?filter=undefined`

**File:** `app/client-detail.tsx`
**Function/Area:** `saveTxEdit()`, `addReceiptToTx()`
**Category:** Route param safety
**Risk:** LOW

**Problem:** Both `saveTxEdit` and `addReceiptToTx` check `source === 'explore' && returnFilter` and navigate to `/explore?filter=${returnFilter}`. If `returnFilter` is undefined or an unexpected value, the URL becomes `/explore?filter=undefined`, and explore.tsx will show no filter match — all transactions would show instead of the expected filter.

**Why it matters:** Minor but produces unexpected behavior when the return navigation fires without a proper filter param.

**What a careless user does:** Navigates to client-detail with an unusual URL (unlikely in normal use, but possible via a broken Needs Attention link). Edits a transaction. Gets returned to explore showing all transactions instead of the filtered view. Mildly confusing.

**What a power user expects:** Navigation to always be predictable. If the return filter is not valid, fall back gracefully to the explore screen without a filter, not with a broken filter.

**Suggested fix:** Guard: `if (source === 'explore' && returnFilter && ['flagged', 'missing', 'untagged'].includes(returnFilter))`.

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/client-detail.tsx`, find all instances of `router.replace('/explore?filter=' + returnFilter)` and wrap the condition check to also verify `returnFilter` is one of `['flagged', 'missing', 'untagged']` before navigating. Do not change styles. One file only. Minimal patch.

---

## Finding 10: `client.tsx` Is an Orphaned File

**File:** `app/client.tsx`
**Function/Area:** Entire file
**Category:** Dead code
**Risk:** LOW

**Problem:** `app/client.tsx` is a React component that accepts props (`client`, `transactions`, `onBack`, `onInvoice`). It uses `simulateAdd` with demo data. It is never navigated to — `client-detail.tsx` is the real client screen. Expo Router will auto-discover it as a route, but accessing `/client` directly would render a broken screen (no props, no real navigation).

**Why it matters:** Confusing when reading the codebase. Expo Router may include it in the route manifest. If a user somehow types `/client` in the URL (unlikely in production), they'd see a broken screen.

**What a careless developer does:** Adds a feature to `client.tsx` thinking it's the real client screen. Spends time debugging why their change isn't showing up. Wastes 30 minutes before realizing `client-detail.tsx` is the real screen.

**Suggested fix:** Delete the file OR move it out of the `app/` directory (e.g., to `components/` or `archive/`).

**Can Claude Code safely fix this automatically?** NO (deletion should be confirmed by the developer)

**What human decision is needed:** Confirm this file is truly unused and can be deleted.

---

## Finding 11: Tax Screen Has No Guard for Empty Transactions

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** `byClient` map, transaction list render
**Category:** Null safety
**Risk:** LOW

**Problem:** `yearTxs.map(tx => ...)` in the tax screen doesn't guard for null/undefined transactions. The store's Context.Provider does filter before exposing: `transactions.filter(t => t && t.id)` — so this is protected at the source. However, there's no `if (!store?.loaded)` guard at the top of the tax screen. If the store is somehow not loaded, all data would be empty arrays and the screen would render empty but without crashing.

**Why it matters:** Low risk because the store guard in `_layout.tsx` prevents rendering until loaded. But it's inconsistent — other screens have explicit loaded guards.

**Suggested fix:** Add `if (!store?.loaded) return null;` at the top of the tax screen for consistency.

**Can Claude Code safely fix this automatically?** YES

---

## Finding 12: Orphaned `tagIds` Count as "Tagged" in Needs Attention

**File:** `app/(tabs)/index.tsx`
**Function/Area:** `untaggedCount` calculation
**Category:** Logic edge case
**Risk:** LOW

**Problem:** `const untaggedCount = safeTx.filter(t => !t.tagIds?.length).length;` counts transactions as "tagged" if they have any IDs in `tagIds`, even if all those tags have been deleted. A transaction with `tagIds: [999]` where tag 999 no longer exists would NOT be counted as untagged.

**Why it matters:** After deleting tags, transactions appear "organized" in the Needs Attention view even though their tags no longer exist. The Needs Attention count is inaccurate.

**What a careless user does:** Deletes a "Groceries" tag because they realize it's not a business expense. The 15 transactions that had that tag still show as "tagged." The untagged count in Needs Attention stays lower than it should be. The user doesn't know 15 transactions need re-categorization.

**Suggested fix:** Check if any of the IDs resolve to actual tags: `const untaggedCount = safeTx.filter(t => !t.tagIds?.some(tid => tags.find(tag => tag.id === tid))).length;`

**Can Claude Code safely fix this automatically?** YES (single-line change)

**Safest patch prompt:**
> In `app/(tabs)/index.tsx`, find the `untaggedCount` line. Change the filter so that a transaction is only considered "tagged" if at least one of its `tagIds` resolves to an existing tag in the `tags` array. You'll need to access `store.tags` the same way you access `store.transactions`. Do not change anything else. One file only.

---

## Finding 13: Multi-Select "Select All" Only Selects Filtered Transactions

**File:** `app/client-detail.tsx`
**Function/Area:** `toggleSelectAll()`, `allVisibleSelected`
**Category:** UX edge case
**Risk:** LOW

**Problem:** `allVisibleSelected` checks `filteredPending` (search-filtered list). "Select All" selects only currently visible filtered items. But "Delete Selected" and "Move to Client" operate on `selectedIds` which could contain transactions from before the filter was applied (if user selected some, then searched).

**Why it matters:** If a user selects 3 transactions, types in the search box, then "Select All" deselects them (because visible list is now different), this creates unexpected behavior.

**Suggested fix:** Either (a) exit multi-select when search changes, or (b) document this as intentional. The current behavior is actually reasonable if documented — "Select All selects what's currently shown."

**Can Claude Code safely fix this automatically?** NO (requires design decision about intended behavior)

---

## Finding 14: No Empty State in Explore When Filter Resolves to Zero Results

**File:** `app/(tabs)/explore.tsx`
**Function/Area:** Results render
**Category:** UX / Empty state
**Risk:** LOW

**Problem:** When a filter is active (e.g., `filter=flagged`) and there are no matching transactions, the screen shows... nothing. There's an empty state for "No results for [query]" only when a query is typed AND has no results. With just a filter and zero results, the list is empty with no message.

**Why it matters:** After a user fixes all their flagged transactions and returns to the filtered explore, they see a blank content area — no confirmation that everything is clean, no "All clear!" message. This is the completion moment of the Needs Attention flow, and it delivers nothing.

**What a careless user does:** Fixes the last flagged transaction. Returns to explore. Sees nothing. Thinks something went wrong. Taps back. Goes home. Looks at Needs Attention — it's gone (correct). But the moment of completion was silent.

**What a power user expects:** A celebration state. "All clear! You're on top of your records." with a checkmark or positive indicator. The empty state should match the emotional valence of the moment.

**Suggested fix:** Add an empty state message when `filter` is active and `results.length === 0`: e.g., "All clear! No [flagged/missing/untagged] transactions."

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `app/(tabs)/explore.tsx`, add an empty state message that appears when `filter` is set and `results.length === 0` (and no text query is active). Show something like "All clear! No transactions match this filter." Use the existing `s.empty` style. Do not change any other logic. One file only. Minimal patch.

---

## Finding 15: No Loaded Guard in Tax Screen

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** Top of component
**Category:** Null safety / Consistency
**Risk:** LOW

**Problem:** The tax screen doesn't check `store?.loaded` before rendering. If somehow rendered before the store loads (which shouldn't happen due to the `_layout.tsx` guard), it would show $0.00 across all cards.

**Suggested fix:** Add `if (!store?.loaded) return null;` at top for defensive consistency.

**Can Claude Code safely fix this automatically?** YES

---

## Finding 16: `prefillMerchant` Effect in Rules Runs Even if Already Mounted

**File:** `app/rules.tsx`
**Function/Area:** `useEffect` with `loaded` dependency
**Category:** Logic edge case
**Risk:** LOW

**Problem:**
```js
useEffect(() => {
  if (loaded && prefillMerchant) {
    setIfRows([...]);
    setShowSheet(true);
  }
}, [loaded]);
```
This fires when `loaded` becomes `true`. If the screen is already mounted and `loaded` is already true (e.g., navigating to rules while already on rules — unlikely but possible), this would fire again.

**Why it matters:** Low risk in practice, but theoretically could open the rule sheet unexpectedly if navigation somehow re-triggers the effect.

**Can Claude Code safely fix this automatically?** NO (requires understanding the effect timing)

---

## Finding 17: No Back Button When `client-detail.tsx` Returns `null`

**File:** `app/client-detail.tsx`
**Function/Area:** `if (!client) return null`
**Category:** Dead-end navigation
**Risk:** HIGH

Already covered in Finding 6. This finding exists as a separate HIGH-risk navigation trap entry to ensure it appears in risk-level searches.

**The user experience:** A completely white, interactive screen with no affordances. On Android, the hardware back button is the ONLY escape. Users without physical intuition for Android navigation are completely stuck.

---

## Finding 18: Merchant Deduplication is Case-Sensitive

**File:** `store.tsx`
**Function/Area:** `addMerchant()`
**Category:** Data quality
**Risk:** LOW

**Problem:** `if (prev.includes(trimmed)) return prev;` — `includes()` is case-sensitive. "Menards" and "menards" would both be saved as separate entries.

**Why it matters:** Over time, users accumulate merchant name variants. Autocomplete shows duplicates with different capitalization. A user who typed "home depot" and "Home Depot" and "HOME DEPOT" (perhaps in a hurry) would see all three as separate autocomplete options.

**What a careless user does:** Types fast, sometimes capitalizes, sometimes doesn't. After 6 months, has 40 merchants saved but 60+ entries in autocomplete. The autocomplete feels noisy and unhelpful.

**Tradeoff:** Case-insensitive deduplication means the first-seen version wins ("menards" would block "Menards" from being added). This is still better than duplicates, and the autocomplete filter is already case-insensitive, so users see consistent results regardless.

**Suggested fix:** `if (prev.some(m => m.toLowerCase() === trimmed.toLowerCase())) return prev;`

**Can Claude Code safely fix this automatically?** YES

**Safest patch prompt:**
> In `store.tsx`, find the `addMerchant` function. Change the deduplication check from `prev.includes(trimmed)` to `prev.some(m => m.toLowerCase() === trimmed.toLowerCase())`. One file only. Minimal patch.

---

## Finding 19: `client.tsx` May Break If Expo Router Auto-Discovers It

**File:** `app/client.tsx`
**Function/Area:** Default export
**Category:** Dead code / Route collision
**Risk:** MEDIUM

**Problem:** `app/client.tsx` exports a component that requires props but is in the `app/` directory. Expo Router will register it as route `/client`. Accessing this route renders a broken UI (props are undefined, `client.initials` crashes immediately).

**Why it matters:** Any deep link or URL to `/client` would crash the app.

**What a careless developer does:** Shares a deep link to the app. The URL contains `/client`. The app crashes immediately on that route. The developer has no idea why.

**Can Claude Code safely fix this automatically?** NO (requires deletion decision)

---

## Finding 20: Tax Screen "Backed by Receipts" Uses Wrong Field

**File:** `app/(tabs)/tax.tsx`
**Function/Area:** `totalWithReceipts` calculation
**Category:** Data accuracy
**Risk:** LOW

**Problem:** `yearTxs.filter(t => t.receipt)` uses the boolean `receipt` field. Initial seed data has `receipt: true` with no actual `receiptUri`. So the "backed by receipts" count is inflated by transactions that have no photo.

**Suggested fix:** Use `!!t.receiptUri` instead of `t.receipt` for accuracy, once the receipt/receiptUri inconsistency (Finding 3) is resolved.

**Can Claude Code safely fix this automatically?** NO (depends on Finding 3 being resolved first)

---

## Finding 21: Stale `selectedTx` After Bulk Operations

**File:** `app/client-detail.tsx`
**Function/Area:** Multi-select delete/move + open detail sheet
**Category:** State consistency
**Risk:** LOW

**Problem:** Theoretical state inconsistency if `selectedTx` is set and a bulk delete happens to delete that transaction. In practice, entering multi-select mode prevents opening detail sheets. But if state management evolves and this guard is relaxed, a stale `selectedTx` could show deleted data.

**Why it matters:** Low practical risk now. Worth noting for future development.

---

## Finding 22: Date Has No Year Information

**File:** `store.tsx`, all transaction displays
**Function/Area:** `addTransaction` date formatting
**Category:** Data model gap
**Risk:** MEDIUM

**Problem:** Transaction dates are stored as `"Apr 14"` (no year). The tax screen shows a "year" summary but has no way to filter by year. A transaction from "Apr 14, 2025" and one from "Apr 14, 2026" look identical and are both included in the "2026 Summary."

**Why it matters:** As the app accumulates data over multiple years, the tax view becomes meaningless — it shows ALL transactions as the "year summary."

**What a careless user does:** Uses the app for 3 years. Tries to do their 2026 taxes. The tax screen shows $18,000 in expenses — but that's 3 years combined. Their actual 2026 deductible expenses are $5,800. If they give the inflated number to their accountant, they over-claim deductions and risk an audit.

**This is a real financial risk for the app's target users.** Tradespeople who use this for actual tax preparation need year-accurate data.

**What a power user expects:** ISO date storage, year filter in tax view, date range selection, the ability to export "2026 only" data.

**Suggested fix:** Store full date string or ISO date. This is a significant data model change — should be planned carefully.

**Can Claude Code safely fix this automatically?** NO (breaking data model change)

**Migration plan (not for Claude Code):**
1. Change `addTransaction` to store ISO date: `new Date().toISOString().split('T')[0]` (e.g., "2026-04-26")
2. Write a one-time migration at store load that converts "Apr 14" style dates to ISO format using current year as estimate (imperfect but better than nothing)
3. Update all display locations to format from ISO date using `toLocaleDateString`
4. Add year filter to tax screen using `date.startsWith(year.toString())`

---

## Finding 23: No Feedback After Saving a Transaction

**File:** `app/client-detail.tsx`
**Function/Area:** `saveTransaction()`, `saveTxEdit()`
**Category:** UX
**Risk:** LOW

**Problem:** When a transaction is saved or edited, the modal simply closes. There is no toast, no animation, no indication that the save succeeded. Users might tap "Save" multiple times thinking it didn't work.

**Suggested fix:** A brief confirmation (e.g., a toast message "Transaction saved" or a subtle animation on the new transaction row appearing).

**Can Claude Code safely fix this automatically?** NO (requires adding a toast library or custom animation system)

**Alternative without a library:** Briefly show a success state in the button before closing ("Saved!" for 500ms then close). Low effort, high perceived quality.

---

## Finding 24: Tag Modal Search Box Is at the Bottom

**File:** `app/client-detail.tsx`
**Function/Area:** Tag picker modal render
**Category:** UX / Layout
**Risk:** LOW

**Problem:** In the tag picker modal, the tag chips are shown first (scrollable), and the search input is at the BOTTOM of the modal — below the chips. On a phone with a keyboard, this is awkward (keyboard pushes up content, obscuring the chips). Also, the mental model of "search then see results" is inverted.

**What a careless user does:** Sees the tag chips. Wants to find a specific tag. Doesn't notice the search box at the bottom. Scrolls through all 20 chips manually. Eventually finds the tag or gives up.

**Suggested fix:** Move the search input to the TOP of the modal, above the chips.

**Can Claude Code safely fix this automatically?** YES

---

## Finding 25: "All Clients" Quick Add Cannot Be Dismissed by Android Back

See Finding 7 (Android back button). The Quick Add modal on the home screen is also affected.

**Specific scenario:** User opens FAB Quick Add modal. Changes their mind. Presses Android back. Navigates AWAY from home screen (to the previous screen in the stack, or exits the app). The modal wasn't dismissed — it was abandoned.

---

## Risk Summary

| Risk Level | Count | Key Findings |
|---|---|---|
| HIGH | 3 | Finding 3 (receipt inconsistency), Finding 6 (blank client detail), Finding 17 (same as 6) |
| MEDIUM | 5 | Finding 4 (hardcoded clientId), Finding 5 (fmt crash), Finding 7 (Android back), Finding 8 (async race), Finding 22 (no year in date) |
| LOW | 17 | Hardcoded header, export buttons, orphaned file, empty states, etc. |

## Fix Priority Matrix

| Finding | Impact | Effort | Risk | Priority |
|---|---|---|---|---|
| 1 (hardcoded header) | High visible | Trivial | None | DO FIRST |
| 2 (export buttons) | High trust | Trivial | None | DO FIRST |
| 5 (fmt crash) | Crash prevention | Trivial | None | DO FIRST |
| 8 (async receipt) | Data integrity | Very low | Low | DO FIRST |
| 6 (blank client) | UX dead-end | Low | Low | DO SOON |
| 14 (empty state explore) | UX clarity | Low | None | DO SOON |
| 9 (undefined filter) | Minor nav | Low | None | DO SOON |
| 18 (case dedup) | Data quality | Trivial | None | DO SOON |
| 4 (hardcoded ID) | Wrong tax math | Low | Low | PLAN |
| 3 (receipt inconsistency) | Data integrity | Medium | Low | PLAN |
| 7 (Android back) | Platform compat | Medium | Medium | PLAN |
| 22 (no year) | Tax accuracy | High | High | PLAN CAREFULLY |
| 10, 19 (dead files) | Codebase hygiene | Trivial | Low | WHEN CONVENIENT |

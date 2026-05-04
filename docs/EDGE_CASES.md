# EDGE_CASES.md
# Uncrumple — Edge Case Simulations

---

## EC-01: App Opens With Corrupted AsyncStorage

**What should happen:** App loads with default seed data, user can continue normally.

**What current code probably does:** Each `AsyncStorage.getItem` call is wrapped in try/catch. If JSON.parse fails, the app falls back to `INITIAL_TRANSACTIONS`, `INITIAL_CLIENTS`, etc. The load continues even if one key is corrupted. `setLoaded(true)` fires after all loads complete regardless.

**What a careless user does:** Doesn't know this happened. Sees 6 demo transactions and their 3 clients (clients weren't corrupted). Wonders where their transactions went. Thinks their phone deleted them. Leaves a 1-star review: "App deleted all my data."

**What a power user expects:** A banner: "We had trouble loading your data. Some records may have been restored to defaults." A support contact. A backup/restore option.

**Risk:** MEDIUM — Data loss is silent. User gets no feedback that their saved transactions were lost.

**Failure conditions that trigger this:**
- App killed during an `AsyncStorage.setItem` write for `uncrumple_transactions`
- Phone storage runs full and the write is truncated
- Android system clears app data without warning (rare, but happens under extreme storage pressure)

**Suggested future fix:** If a parse fails and there WAS a stored value (non-null rawTx), show a one-time alert: "We had trouble loading your data. Some records may have been reset." Consider storing a backup of the last valid save (`uncrumple_transactions_backup`).

---

## EC-02: Client Deleted While on Client Detail Screen

**What should happen:** User navigates back, client is gone from home list.

**What current code probably does:** If the user is ON client-detail and the client gets deleted (impossible in current single-device architecture — but if store refreshes), `client` would no longer be found by `clients.find(c => c.id === Number(id))`. `client` would be `undefined`. The `if (!client) return null` guard fires — blank screen.

**What a careless user does:** N/A — cannot happen on a single device. But the code path exists and is dangerous if any future change allows client deletion from a background thread or remote sync.

**Risk:** MEDIUM — In practice, cannot happen because deletion is only possible from the home screen and there's no real-time sync. But if this screen is re-rendered after a client deletion (unlikely with React state), it would blank out.

**Suggested future fix:** Already covered by Finding 6 — replace `return null` with "Client not found" + back button.

---

## EC-03: Transaction Has Missing `clientId`

**What should happen:** Transaction is still usable but shows without a client association.

**What current code probably does:** The transaction would render in client-detail only if `t.clientId === client.id` matches. If `clientId` is undefined, it won't match any client. It will still appear in explore search results and tax screen. The dot in explore would be gray (no matching client). Tax "by client" wouldn't include it. Needs Attention would count it for flagged/missing/untagged.

**What a careless user does:** Manually edits their AsyncStorage (possible via adb) and accidentally removes a clientId. They see a transaction in search and tax with no client attribution but don't know why.

**Risk:** LOW in normal use (store always sets clientId), but HIGH if data was manually edited or corrupted.

**Suggested future fix:** Add validation in explore/tax to show "Unknown Client" for orphaned transactions.

**What a power user expects:** An orphan management screen — show all transactions with missing or invalid clientIds and let the user reassign them.

---

## EC-04: Transaction Has `tagIds` With Deleted Tag IDs

**What should happen:** Transaction renders without showing the deleted tags. Untagged count should reflect this.

**What current code probably does:**
- `tags.find(t => t.id === tid)` returns undefined for deleted IDs
- The `if (!tag) return null` in the map renders nothing for that tag ID
- BUT `t.tagIds?.length > 0` still evaluates to true — transaction is NOT counted as "untagged" in Needs Attention even though it has no visible tags

**What a careless user does:** Deletes the "Groceries" tag after deciding it doesn't belong in business expenses. Doesn't notice that 8 transactions now have ghost tagIds. These transactions appear "tagged" in Needs Attention counts. They're invisible in the UI but present in the data. A month later the user wonders why their Needs Attention "untagged" count is suspiciously low.

**Risk:** LOW-MEDIUM — The Needs Attention "untagged" count undercounts. Users might not notice transactions that effectively have no tags after deletion.

**At scale:** A user who deletes a tag that was applied to 50 transactions suddenly has 50 phantom-tagged transactions. The untagged count is 50 lower than it should be. The user's cleanup queue is incomplete forever unless they know to look.

**Suggested future fix:** Change untagged check to verify at least one tagId resolves to an existing tag.

---

## EC-05: User Adds Receipt Then Cancels Camera

**What should happen:** Receipt state unchanged, transaction unchanged.

**What current code probably does:** `launchCameraAsync` returns `{ canceled: true }`. The `if (!result.canceled && result.assets[0])` check fails. Nothing is updated. The form/detail sheet remains open with the previous receipt state. No error shown.

**Risk:** ZERO — This is handled correctly. Camera cancel is a well-trodden path.

---

## EC-06: User Taps Back While Add Transaction Modal Is Open

**What should happen (ideal):** Modal closes, user stays on client detail.

**What current code probably does:** On Android, hardware back navigates AWAY from client-detail entirely. The modal stays mounted briefly then unmounts with the parent. All entered data (merchant, amount, note, photo) is lost silently.

**What a careless user does:** Filling in a transaction. Gets a text message. Swipes down on the notification (Android). Returns to app. They're back on the home screen. Everything is gone. They re-enter the transaction from scratch.

**What a power user expects:** Hardware back closes the modal. Period. This is the #1 Android UX expectation.

**Risk:** HIGH for data loss — This is a major friction point for users who accidentally hit back.

**What happens at scale:** A user who does 10 transactions a day and accidentally triggers this once per week loses 50+ data entries per year due to Android back behavior. In aggregate, this is the most damaging bug for active users.

**Suggested future fix:** Register BackHandler in client-detail.tsx to close the active modal instead of navigating back.

---

## EC-07: User Navigates from Explore with Bad `txId`

**What should happen:** Client detail opens for the correct client, but the transaction detail sheet doesn't open (no matching transaction).

**What current code probably does:** `const tx = transactions.find(t => String(t.id) === String(txId));` — if no match, `tx` is undefined. The `if (tx)` guard prevents `setSelectedTx(tx)` from firing. Client detail opens normally, no sheet auto-opens.

**What a careless user does:** Taps a "flagged" transaction in explore. The transaction was deleted by someone else (impossible in single-device, but relevant if data sync is ever added). They see the client detail screen with no modal. They're confused about why the flagged transaction didn't open.

**Risk:** LOW — Handled gracefully, though silently. User might be confused why the transaction didn't open.

---

## EC-08: User Deletes Transaction While Detail Modal Is Open

**What should happen:** Modal closes, transaction is gone from list.

**What current code probably does:** If the user is in the detail sheet and taps the trash icon, `deleteTransaction(selectedTx.id)` is called and `closeTxDetail()` closes the modal. This is the intentional flow. If somehow the transaction was deleted externally (impossible in single-device), `selectedTx` would still hold the stale data and the modal would show it — but no crash since `selectedTx` isn't re-read from store.

**Risk:** ZERO for the intentional delete flow.

---

## EC-09: User Edits Transaction from Filtered Explore List

**What should happen:** After editing, user returns to the filtered explore list.

**What current code probably does:** Works correctly via `source=explore` and `returnFilter` params. `router.replace('/explore?filter=flagged')` sends them back. The fixed transaction no longer appears in the filtered list.

**Risk:** LOW — Works if `returnFilter` is valid. Fails silently (no return navigation) if `returnFilter` is undefined (covered in Finding 9).

**What a careless user does:** N/A — this case requires an unusual URL parameter configuration that the user can't manually trigger.

---

## EC-10: User Removes Receipt from Missing Receipts Flow

**What should happen:** After removing receipt, transaction still appears in "missing receipts" if it has no note. User is returned to the explore list.

**What current code probably does:** Remove Receipt sets `receipt: false, receiptUri: null`. The `addReceiptToTx` return navigation only fires when `returnFilter === 'missing'` AFTER adding (not removing). The remove receipt inline button does NOT have return navigation — after removing, the modal just stays open. If the transaction now has no note either, it WOULD appear in the missing receipts filter, but the user is still in the modal on client-detail, not returned to explore.

**What a careless user does:** Removes a receipt they accidentally added (maybe took a photo of their hand). Stays in the transaction detail modal. Doesn't realize they need to add a new receipt. Closes the modal manually. Returns to home. Sees "1 missing receipt" in Needs Attention — but didn't realize they created it by removing.

**Risk:** MEDIUM — UX break in the cleanup flow. After fixing (adding a receipt), user is returned to the list. After unfixing (removing a receipt), user is NOT returned. Inconsistent.

---

## EC-11: User Creates Duplicate Transaction (Same Merchant, Amount, Same Day)

**What should happen:** Ideally, a warning. Currently: duplicate is saved silently.

**What current code probably does:** No duplicate detection exists. Two identical transactions are both saved. Both appear in lists, search, tax screen. Both counted in client totals. User has to manually identify and delete the duplicate.

**What a careless user does:** Adds "Home Depot $43.27" for client Dave. Their phone glitches. The save confirmation (just the modal closing) happens too fast for them to notice. They tap "Add Transaction" again and add "Home Depot $43.27" again. Now they have two identical transactions. Their outstanding total for Dave is $86.54 instead of $43.27. Dave gets overcharged on the invoice.

**Risk:** MEDIUM — Tradespeople work fast and may tap "Add" twice. This could double-count a purchase. The financial consequence is real.

**At scale:** A user who duplicates 5 transactions per month over a year has 60 extra transactions and potentially thousands in invoice overcharges.

**Suggested future fix:** In `addTransaction`, before saving, check if any existing transaction has the same merchant (case-insensitive), same amount, AND the same date. If so, show an Alert: "This looks like a duplicate. Do you want to add it anyway?"

---

## EC-12: User Has No Clients

**What should happen:** Empty state shown on home screen with guidance.

**What current code probably does:** `safeClients` is an empty array. The map renders nothing. The FAB Quick Add shows an empty scrollable list with just a Cancel button. The "OUTSTANDING" amount shows $0.00. Needs Attention might still show (if seed transactions were never cleared — but seed transactions belong to clients that no longer exist, so they'd show in explore and tax but not on home screen).

**What a careless user does:** Deleted all clients (or cleared app data). Sees a blank home screen. Doesn't notice the small "+ Add" button in the header. Thinks the app is broken and deletes it.

**Risk:** LOW — Renders but looks broken. The empty state (NEXT_PROMPTS.md Prompt 9) fixes this.

---

## EC-13: User Has No Tags

**What should happen:** Tag section in add/edit form shows no chips, just the "+" button.

**What current code probably does:** `topTags` is empty array — no chips render. The "+" button still appears and opens the tag modal. The modal shows an empty scrollable area with just the search input. Typing creates a new tag. This works correctly.

**Risk:** ZERO — Handled gracefully.

---

## EC-14: User Has No Transactions

**What should happen:** Clean empty state on client detail, nothing in explore, $0.00 in tax.

**What current code probably does:**
- Client detail: Shows the "No pending transactions. Tap + to add one." empty bar — good
- Explore: Shows first 10 transactions (empty array = nothing) — no empty state message
- Tax: $0.00 totals, no by-client section (filtered to 0), no transaction list

**Risk:** LOW — Functional but explore is silent when empty.

---

## EC-15: User Has Very Long Merchant Names

**What should happen:** Text wraps or truncates gracefully without breaking layout.

**What current code probably does:**
- Client detail transaction list: `txMerchant` has no `numberOfLines` — very long names wrap to multiple lines, expanding the row height
- Explore results: `merchant` text has no `numberOfLines` — same behavior
- Transaction detail sheet: `detailMerchant` has no `numberOfLines` — can expand the sheet height significantly

**What a careless user does:** Types "Menards - Lumber Yard on Route 9 Near the Airport" as the merchant name. Every row in client detail now takes 3 lines of height. The list looks broken.

**Risk:** LOW — Ugly but functional. Layout flex handles it.

**Suggested future fix:** Add `numberOfLines={1} ellipsizeMode="tail"` to merchant text in list views, while keeping the detail sheet unrestricted (full text is useful in the detail view).

---

## EC-16: User Has Hundreds of Transactions (100+)

**What should happen:** Scroll performance remains smooth.

**What current code probably does:**
- Client detail pending list: Renders ALL pending transactions in a ScrollView without virtualization. At 100+ pending transactions for one client, this could cause performance issues on lower-end Android devices.
- Tax screen: Renders ALL transactions in a flat ScrollView — same concern.
- Explore search: Filters in-memory — at 500+ transactions, the filter runs on every keystroke.

**What a careless user does:** Uses the app for 18 months without ever invoicing. Accumulates 300+ pending transactions for one client. Client detail takes 2 seconds to render. Scrolling stutters. They think the app is laggy.

**Risk:** MEDIUM — Performance degrades on large datasets. React Native's `FlatList` with `initialNumToRender` would be more appropriate for large lists.

**At scale:**
- 100 transactions: First render ~100ms. Acceptable.
- 500 transactions: First render ~500ms on mid-range device. Noticeable pause.
- 1,000 transactions: First render ~1s. Clearly slow. Users feel it.
- 5,000 transactions: First render ~5s. App feels broken.

**Suggested future fix:** Replace `ScrollView` + `map` with `FlatList` in client-detail and tax when lists exceed ~50 items. For explore, debounce the search query (150ms delay after last keystroke).

---

## EC-17: User Switches Tabs While Modal Is Open

**What should happen:** Tab switch closes the modal (or modal stays until explicitly closed).

**What current code probably does:** React Native Modal components are rendered within the screen's component tree. When the tab switches, the home screen (for example) is NOT unmounted immediately because of `lazy: true` on the TabNavigator — it's kept in memory. The modal STAYS OPEN and VISIBLE even after the tab switches. The user sees the modal floating over whatever tab is now active.

**What a careless user does:** Opens the Quick Add FAB on home screen. Accidentally taps the Tax tab. Now sees the client picker modal floating over the tax screen. Tapping "Cancel" closes the modal but they're still on the tax tab. This looks very broken.

**Risk:** HIGH — This is a strange visual artifact. The overlay from a closed tab's modal appears on top of a different tab's content.

**At scale / frequency:** This happens any time a user accidentally taps a tab while a modal is open. On a small phone with closely spaced tab icons, this is a real risk.

**Suggested future fix:** Use `useFocusEffect` from expo-router to close all modals when the screen loses focus:
```js
useFocusEffect(useCallback(() => {
  return () => {
    setShowAddClient(false);
    setShowQuickAdd(false);
    // etc.
  };
}, []));
```

---

## EC-18: User Enters Multi-Select Mode Then Opens Search

**What should happen:** Search filters the visible list; multi-select continues with previously selected items.

**What current code probably does:** Multi-select state and search state are independent. If 3 items are selected and then a search narrows the list to 1 item, the 2 hidden items remain in `selectedIds`. "Select All" would behave unexpectedly (selects only visible, deselects hidden ones' status is ambiguous). Delete would correctly delete all 3 (including the 2 hidden ones).

**What a careless user does:** Selects 3 transactions. Types a search to find one more to add to the selection. Now they have 3 selected (hidden) + 1 visible. Taps "Select All" — now they have only 1 selected (the visible one). The 3 they carefully selected are deselected. They have to start over.

**Risk:** LOW — Functional but confusing UX.

---

## EC-19: User Marks Invoice, Then Adds More Transactions, Then Views Invoice History

**What should happen:** New transactions appear in "Pending", old invoiced ones appear grouped in "Invoice History".

**What current code probably does:** Works correctly. `markInvoiced` sets `invoiced: true` with `invoiceId` on all current pending transactions for that client. New transactions default to `invoiced: false` and appear in pending. Invoice history groups by `invoiceId`. Multiple invoices appear as separate groups.

**Risk:** ZERO — Core flow works correctly.

---

## EC-20: App Opens After a Week of Not Using It

**What should happen:** All data loads exactly as they left it, Needs Attention reflects current state.

**What current code probably does:** AsyncStorage is persistent — data loads correctly. Needs Attention shows the same items as before (flagged, missing, untagged counts unchanged). The date header would now show the correct current month/year (after Prompt 1 is applied). No time-based calculations are stale.

**Risk:** LOW — The only staleness is the hardcoded "APRIL 2025" header (Prompt 1 fixes this).

**What a careless user does:** Returns from vacation. Sees their data intact. Sees "APRIL 2025" in the header if the fix hasn't been applied. Thinks the app froze.

---

## EC-21: User Edits a Transaction Then Immediately Taps Edit Again

**What should happen:** Second tap opens edit mode again with current values.

**What current code probably does:** After first `saveTxEdit`, `isEditing` is set to `false` and `selectedTx` is updated with new values. Tapping "Edit" again calls `startEditing()` which reads from the freshly updated `selectedTx`. This should work correctly.

**Risk:** ZERO — State sequence is correct.

---

## EC-22: User Adds a Rule With a Card That Gets Deleted Later

**What should happen:** Rule persists but never matches (no transactions have the deleted card's ID).

**What current code probably does:** Rule still exists in storage with `cardId: [deleted_id]`. In `addTransaction`, the rule's `if (rule.cardId && tx.cardId !== rule.cardId) matches = false;` check would always make the rule fail to match. Rule list in rules screen would show `ruleCard` as undefined, and `ifParts` would just not include the card name — so the rule displays without the card condition name (slightly confusing but no crash).

**What a careless user does:** Sees a rule that says "IF → tag as Fuel" with no visible condition. Doesn't understand why the IF is empty. Might delete the rule thinking it's broken.

**Risk:** LOW — Functional, just confusing UI in the rules list.

---

## EC-23: User Creates a Tag, Then Deletes It, Then Views a Transaction That Had That Tag

**What should happen:** Transaction renders without the deleted tag chip. Tag area may appear empty.

**What current code probably does:**
- `tags.find(t => t.id === tid)` returns undefined
- The `if (!tag) return null` in the map renders nothing for that tag ID
- Transaction shows all other tags normally
- The tag is gone from the detail sheet view, from the list row, from everywhere

**Risk:** ZERO — Handled gracefully.

---

## EC-24: User Long-Presses Two Different Clients in Quick Succession

**What should happen:** Only the last long-pressed client's menu appears.

**What current code probably does:** `handleLongPress(client)` sets `selectedClient` and opens the menu. If the user somehow triggers this twice before the modal opens (very fast double long-press), the second call overwrites `selectedClient`. The menu shows the last client. There's no race condition here since state updates are batched in React.

**Risk:** ZERO — State management handles this correctly.

---

## EC-25: User Has a Transaction With an Amount of 0

**What should happen:** Transaction is not saved (validated out).

**What current code probably does:** `parseFloat(amount.replace(/[^0-9.]/g, ''))` on "0" gives `0`. The save validation `if (!parsedAmount || parsedAmount <= 0)` catches this — `0` is falsy in JavaScript. Alert fires: "Please enter a valid amount." Transaction is NOT saved.

**Risk:** ZERO — Correctly validated.

---

## EC-26: User Tries to Create a Tag With a Name That Already Exists

**What should happen:** Ideally, warn about duplicate tag names.

**What current code probably does:** `addTag` in store.tsx does no deduplication check. Two tags with the same name but different IDs are both created and both shown. The tag search would show both "Fuel" entries.

**What a careless user does:** Creates "Fuel" tag. Forgets they have it. Types "Fuel" again in the tag search. The search finds the existing "Fuel" tag — no create button appears. But if they go to the Rules screen and tap "+ Add Tag," they can create a second "Fuel" because that form doesn't use the search-based creation. Now they have two "Fuel" tags with different colors.

**Risk:** LOW — Confusing UX. User might think their first tag was deleted.

**Suggested future fix:** In `addTag`, check for case-insensitive name match before adding.

---

## EC-27: App Force-Closed While a Transaction Save Is In Progress

**What should happen:** Data is either saved or not (no partial state).

**What current code probably does:** The save pattern is:
```js
setTransactions(prev => {
  const updated = [...];
  AsyncStorage.setItem(KEY, JSON.stringify(updated));  // fire-and-forget
  return updated;
});
```
AsyncStorage.setItem is called inside setState — this is not awaited. If the app is force-closed BETWEEN the setItem call and the actual write completing, the data might not be saved. React state would have been updated (in memory) but AsyncStorage might have the old value.

**Risk:** MEDIUM — Rare, but force-closing during a write could cause data loss or a partial save. The AsyncStorage write is atomic (iOS/Android both promise this at the key level), so you either get the old value or the new value — never a partial JSON string.

**What a careless user does:** Taps "Save Transaction." A notification comes in at the same time. They swipe up to manage it (Android gesture). The app is force-closed by the OS. The transaction may or may not have been persisted. No way to know until they reopen the app.

---

## EC-28: User's Phone Has Very Little Storage

**What should happen:** AsyncStorage write fails gracefully.

**What current code probably does:** `AsyncStorage.setItem(KEY, JSON.stringify(updated))` is fire-and-forget — no `.catch()` handler. If the write fails due to storage issues, the in-memory state is updated but the persisted data is stale. The discrepancy is invisible until the next app restart.

**Risk:** MEDIUM — Silent data loss. No user feedback on storage errors.

**What a careless user does:** Nothing — they can't know this happened. They use the app normally. All their work is in memory. When they close the app and reopen it, their recent transactions are gone.

**Suggested future fix:** Add `.catch(e => console.warn('Storage save failed:', e))` at minimum. In production, surface a toast notification.

---

## EC-29: User Has 0 Cards Saved But Rules Reference `cardId`

**What should happen:** Rule still exists and displays, but the card chip isn't shown.

**What current code probably does:** In rules.tsx render: `const ruleCard = cards.find(c => c.id === rule.cardId);` — returns undefined. `if (ruleCard) ifParts.push(ruleCard.label)` — the card condition name is silently omitted from the rule display. The rule looks like it has no conditions, which is misleading.

**Risk:** LOW — Data integrity maintained, but rule display is misleading.

---

## EC-30: User Navigates Deep Then Uses System Gesture to Go Back Multiple Levels

**What should happen:** Clean navigation back through the stack.

**What current code probably does:**
- Stack: Home (tab) → client-detail → rules (from Add Rule link)
- Android back from rules: returns to client-detail (transaction detail sheet is closed since the modal was closed before navigation)
- Android back from client-detail: returns to home tab
- iOS swipe back from client-detail: same

The stack navigation itself is correct. The issue is that when navigating away from client-detail to rules, the transaction detail sheet is explicitly closed first (`closeTxDetail()` is called before `router.push`). So the user loses their place in the transaction detail — they can't swipe back into it.

**Risk:** LOW — Not a crash, just a minor UX friction.

---

## EC-31: User Rotates Phone

**What should happen:** Layout adapts or stays the same.

**What current code probably does:** `TILE_WIDTH` in index.tsx is calculated ONCE at module load time using `Dimensions.get('window').width`. If the user rotates the phone after the module loads, the tile layout doesn't recalculate. Tiles would be incorrectly sized in landscape mode.

**What a careless user does:** Rotates phone to landscape to see more text. The tile grid doesn't reflow. Tiles might be too wide or show overflow.

**Risk:** LOW — Most tradespeople use phones in portrait mode. Low priority.

---

## EC-32: User Has a Transaction With Very Long Note Text

**What should happen:** Note displays without breaking layout.

**What current code probably does:**
- In transaction list: `tx.note` is shown in `txMeta` with no `numberOfLines` — wraps to multiple lines
- In transaction detail: `detailNote` has no `numberOfLines` — wraps to multiple lines (OK for detail view)
- In "ADD TO [CLIENT]" sheet label: The note is not shown there (just input)

**What a careless user does:** Pastes a full job description into the note field. 400 words. The transaction row now takes up half the screen. Scrolling becomes awkward.

**Risk:** LOW — Ugly in list view but functional. Add `numberOfLines={2}` to list views.

---

## EC-33: Two Transactions With the Same `invoiceId`

**What should happen:** They appear in the same invoice history group.

**What current code probably does:** `invoicedGroups` is built by grouping on `invoiceId`. Transactions sharing an `invoiceId` appear together in one group card. This is the INTENDED behavior — `markInvoiced` assigns the same `invoiceId` to all pending transactions at once.

**Risk:** ZERO — Works as designed.

---

## EC-34: Store Context Returns Null

**What should happen:** App should not crash on null context.

**What current code probably does:** `export function useStore() { return useContext(StoreContext); }` — returns null if used outside StoreProvider. All screens use `store?.loaded ?? false`, `store?.transactions ?? []`, etc. with optional chaining and nullish coalescing. These null guards protect against the null context case.

**Risk:** LOW — All screens use null-safe access patterns.

---

## EC-35: User Has Very High Tax Rate Entered (e.g., 99%)

**What should happen:** Estimated savings shows a very large number, no crash.

**What current code probably does:** Tax rate is validated on blur: `if (!isNaN(val) && val > 0 && val <= 100)`. A rate of 99 is valid. `estimatedSavings = workTotal * (99 / 100)` — shows 99% of total as "savings." Mathematically correct, just unrealistic. No crash.

**Risk:** ZERO — Validated and handled.

---

## EC-36: User Has a Transaction With `amount` Saved as a String

**What should happen:** Tax screen displays the amount correctly, doesn't crash.

**What current code probably does:** In `tax.tsx`, `yearTxs.reduce((s, t) => s + t.amount, 0)` — if `t.amount` is `"43.27"` (string), JavaScript does `0 + "43.27"` = `"043.27"` (string concatenation). Then `"043.27" + 84.12` = `"043.2784.12"`. The tax total becomes a nonsense string. `fmt("043.2784.12")` calls `"043.2784.12".toFixed(2)` which crashes because strings don't have `.toFixed()`.

**How this could happen:** If any code path sets amount as a string instead of a number. The add form does `parseFloat(amount)` but if `editTransaction` is called with a string amount from outside normal UI flow (e.g., rules engine bug), the stored amount could be a string.

**Risk:** MEDIUM — Crash scenario. Finding 5 covers the fix.

---

## EC-37: User Adds a Transaction via Quick Add FAB While on the Tax or Search Tab

**What should happen:** Client picker opens, user selects client, navigates to client-detail, transaction added.

**What current code probably does:** The FAB (Floating Action Button) is only present on the home screen (index.tsx). It is NOT present on the Tax or Search tabs. The user cannot add a transaction directly from those tabs.

**What a careless user does:** Wants to add a transaction while reviewing their tax totals. Looks for a "+" button on the tax screen. Doesn't find one. Goes back to home. Taps FAB. This is an extra step that breaks their context.

**Risk:** LOW — Working as designed, but worth noting as a friction point for power users.

**What a power user expects:** A global FAB available on all tabs, or at minimum a persistent "Add" action in the tab bar.

---

## EC-38: User Searches for a Client Name That Has Been Renamed

**What should happen:** Transaction list in explore shows the updated client name.

**What current code probably does:** Explore search filters transactions by `clients.find(c => c.id === t.clientId)?.name`. When a client is renamed, this lookup immediately returns the new name. All previous transactions for that client now show under the new name. This is correct behavior.

**Risk:** ZERO — Dynamic lookup means renames are reflected everywhere immediately.

---

## EC-39: Modal Opens on a Screen That Is Not Currently Focused (Deep in Stack)

**What should happen:** Modal opens only when the screen is in focus.

**What current code probably does:** Modals are triggered by state variables (`showAddSheet`, `showTagModal`, etc.). If these are somehow set to `true` on a screen that's in the navigation stack but not currently focused (e.g., client-detail is mounted in the background but home tab is active), the modal would be mounted and visible — floating over the active tab.

**This is the same issue as EC-17.** `useFocusEffect` cleanup is the systematic fix for both.

**Risk:** MEDIUM — Visual glitch, not a crash.

---

## EC-40: User Opens App After OS Kill With Very Large Transaction Dataset

**What should happen:** App loads quickly, all data appears.

**What current code probably does:** `Promise.all([...8 loads...])` fires. The largest key is `uncrumple_transactions`. At 2,000 transactions with receipt URIs (just the URI strings), the JSON might be 200-400KB. `JSON.parse` on 400KB on a budget Android device might take 200-400ms. The app shows a loading state (or blank screen) for that duration.

**What a careless user does:** Opens the app at the lumber yard. Has 800 transactions. App takes 1 second to load. They think it crashed. Force close. Reopen. Same delay. They complain the app is slow.

**Risk:** MEDIUM at high data volumes. Low for early users.

**Suggested future fix:** Add a loading indicator during the `Promise.all` phase. Even a simple splash screen color is better than a black screen. Consider lazy-loading non-critical keys after the transactions and clients are available.

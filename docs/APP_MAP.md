# APP_MAP.md
# Uncrumple — Complete App Map (Expanded)

---

## Route Overview

| Route | File | Registered In | Notes |
|---|---|---|---|
| `/(tabs)/index` | `app/(tabs)/index.tsx` | `(tabs)/_layout.tsx` | Main dashboard |
| `/(tabs)/explore` | `app/(tabs)/explore.tsx` | `(tabs)/_layout.tsx` | Search + filter hub |
| `/(tabs)/tax` | `app/(tabs)/tax.tsx` | `(tabs)/_layout.tsx` | Tax summary |
| `/client-detail` | `app/client-detail.tsx` | `_layout.tsx` Stack | Per-client transaction screen |
| `/settings` | `app/settings.tsx` | Auto-discovered | Gear icon destination |
| `/rules` | `app/rules.tsx` | Auto-discovered | Rules, Tags, Cards management |
| `/modal` | `app/modal.tsx` | `_layout.tsx` Stack | UNUSED — Expo template placeholder |
| `/client` | `app/client.tsx` | Auto-discovered | BROKEN — legacy component, requires props |

### Critical Note on Route Registration

`settings` and `rules` are NOT explicitly listed in `app/_layout.tsx` as `Stack.Screen` entries. They are registered automatically by Expo Router scanning the `app/` directory. The consequence is:
- No explicit `headerShown: false` is registered for these routes in the stack
- No animation customization is applied at the stack level
- If Expo Router's auto-discovery behavior changes in a future SDK update, these routes could silently break without any indication in the layout file
- Developers reading `_layout.tsx` won't see these routes and may not know they exist

**Best practice (not yet implemented):** Add explicit `<Stack.Screen name="settings" options={{ headerShown: false }} />` and `<Stack.Screen name="rules" options={{ headerShown: false }} />` entries to `_layout.tsx`.

---

## Screen 1: Home / Clients
**File:** `app/(tabs)/index.tsx`
**Route:** `/` (tab index)
**Entry points:** App launch, any tab press returning to Clients tab

### Purpose
The Clients screen is the app's organizing center. Everything in the app is organized around clients (jobs/projects), and this screen provides the overview of all active clients, their outstanding amounts, and the Needs Attention health check.

### What it does
- Shows the current month and year as a header subtitle (currently hardcoded as "APRIL 2025")
- Shows "OUTSTANDING" total — sum of all pending (non-invoiced) transaction amounts, excluding "Personal" client
- Shows Needs Attention section when any transactions need work (flagged, missing receipt, untagged)
- Lists all clients with their individual pending totals
- Supports both tile view (2-column grid) and list view (full-width rows)
- Provides client management: add, edit name, change color, change photo, delete
- FAB provides quick-add transaction flow from any client

### State used
| State variable | Type | Purpose |
|---|---|---|
| `showAddClient` | boolean | Toggles Add Client modal |
| `showClientMenu` | boolean | Toggles long-press context menu |
| `showEditClient` | boolean | Toggles Edit Name modal |
| `showColorPicker` | boolean | Toggles Color Picker modal |
| `selectedClient` | object/null | Holds client being acted on |
| `newClientName` | string | New client name input |
| `editName` | string | Edit client name input |
| `tileView` | boolean | Layout mode (NOT persisted to storage) |
| `showQuickAdd` | boolean | FAB client picker modal |
| `quickAddSearch` | string | Search text within FAB modal |

**Important:** `tileView` is local state and resets to `false` on every app restart. If a user prefers tile view, they must re-toggle it every session. This is a minor but recurring friction point.

### Store functions called
- `store.transactions` — used to calculate pending counts and amounts per client
- `store.clients` — the client list
- `store.addClient(name)` — creates a new client
- `store.editClient(id, name, color)` — updates client name and/or color
- `store.deleteClient(id)` — removes client from storage
- `store.updateClientPhoto(id, photoUri)` — updates client thumbnail

### Calculations performed locally
- `clientTotal(id)` — sums non-invoiced transaction amounts for a given client ID
- `outstandingTotal` — sums `clientTotal` for all clients whose `name !== 'Personal'`
- `safeTx` — filters store transactions for null/id safety
- `flaggedCount` — count of transactions where `t.flagged === true`
- `missingReceiptCount` — count where `!t.receiptUri && !t.note` (NOTE: uses receiptUri, not receipt boolean)
- `untaggedCount` — count where `!t.tagIds?.length` (does NOT account for orphaned tag IDs)
- `needsAttentionItems` — array of non-null items from the above counts

### Modals and Sheets (5 total)

**1. Client Long-Press Menu (fade animation)**
- Contains avatar, client name, and 4 action items
- "Edit Name" → opens Edit Name modal
- "Change Color" → opens Color Picker modal
- "Change Photo" → triggers async library picker
- "Delete Client" → fires Alert confirm dialog
- "Cancel" text link → closes menu
- Dismissed by tapping overlay

**2. Edit Name Modal (slide animation)**
- Single TextInput with autoFocus
- Save button → calls handleSaveEdit with guards
- Cancel button or overlay tap → closes without saving
- Backdrop tap closes modal (data lost — no warning)

**3. Color Picker Modal (slide animation)**
- 12 color swatches in a flex-wrap grid
- Tapping a color immediately saves it and closes modal
- Cancel button dismisses
- Does NOT show current color as selected — no visual confirmation of current state

**4. Add Client Modal (slide animation)**
- Single TextInput with autoFocus
- "Add Client" button — requires non-empty trimmed name (silent if empty)
- Cancel button or overlay tap → closes
- No `onSubmitEditing` — keyboard submit doesn't work

**5. Quick Add Client Picker (slide animation)**
- Search TextInput with autoFocus
- Scrollable list of all clients, filtered by search
- Tapping client → navigates to `/client-detail?id={id}&addTx=1`
- Cancel button dismisses
- Empty search shows all clients; no empty state if no clients exist

### User actions and consequences

| Action | Code result | Visual result |
|---|---|---|
| Tap client (list view) | `router.push('/client-detail?id={id}')` | Navigates to client screen |
| Tap client (tile view) | `router.push('/client-detail?id={id}')` | Same |
| Long press client (list/tile) | Sets selectedClient, opens menu | Menu sheet appears |
| Tap ⊞ (when in list view) | `setTileView(true)` | Switches to tile layout |
| Tap ☰ (when in tile view) | `setTileView(false)` | Switches to list layout |
| Tap "+ Add" | Opens Add Client modal | Modal slides up |
| Tap ⚙ gear | `router.push('/settings')` | Settings screen pushes |
| Tap Needs Attention row | `router.push('/explore?filter=...')` | Navigate to filtered explore |
| Tap FAB (+) | Opens Quick Add modal | Modal slides up |
| Tap client in Quick Add | Navigate to client-detail with addTx=1 | Add Transaction sheet opens |

### Navigation targets
- `/client-detail?id={clientId}` — tap any client card
- `/client-detail?id={clientId}&addTx=1` — tap client in Quick Add flow
- `/settings` — tap gear icon
- `/explore?filter=flagged` — tap flagged Needs Attention row
- `/explore?filter=missing` — tap missing receipts Needs Attention row
- `/explore?filter=untagged` — tap untagged Needs Attention row

### Data lifecycle
- **Created:** Clients via `addClient`. Photo URI via `updateClientPhoto`.
- **Edited:** Client name via `editClient`. Color via `editClient` with color param.
- **Deleted:** Client via `deleteClient`. This does NOT cascade to transactions.
- **Read:** All transactions (to compute totals). All clients (to render list).

### Known issues and deep analysis

**Issue 1: "APRIL 2025" hardcoded header**
The header subtitle is a hardcoded string literal. This means after April 2025 passes, the app always shows a stale date. For new users installing in 2026, the app immediately appears broken. For existing users, the staleness never registers consciously but subtly erodes trust. This is one of the most visible bugs in the entire app.

**Issue 2: `outstandingTotal` uses name comparison**
The "OUTSTANDING" amount excludes clients named "Personal" via `c.name !== 'Personal'`. This is a reasonable heuristic, but:
- Case-sensitive: "personal" would NOT be excluded
- Name-dependent: If the user renames "Personal" to "Private" or "My Stuff", it would be included
- The tax screen uses `clientId !== 5` (hardcoded ID) — these two exclusion strategies don't agree
- In the long run, a `isPersonal` or `excludeFromTotals` field on clients would be cleaner

**Issue 3: `tileView` state not persisted**
The layout preference resets on every app restart. A user who always wants tile view must toggle it every session. Adding this to the settings object (`store.settings.tileView`) would be a one-line store change and eliminate the friction permanently.

**Issue 4: `missingReceiptCount` uses receiptUri, but green dots use `receipt` boolean**
The Needs Attention "missing receipts" counter counts transactions where `!t.receiptUri && !t.note`. The receipt indicator elsewhere uses the `receipt` boolean. These are inconsistent. The initial seed transactions have `receipt: true` but no `receiptUri`, which means they show green receipt dots in the client list but CAN appear in the missing receipts filter (if they also have no note). This creates a confusing experience where the dot says "has receipt" but the filter says "missing receipt."

**Issue 5: No feedback when actions succeed**
When the user adds a client, edits a name, or changes a color, the modal closes and the change appears in the list. There is no toast, no success animation, no micro-confirmation. This is acceptable for non-destructive actions, but the visual jump from "modal open" to "modal closed, list updated" can feel abrupt.

**Issue 6: Modals don't close on Android hardware back**
None of the 5 modals on this screen register a BackHandler. Android back while any modal is open will navigate AWAY from the home screen. Specifically: if the user opens the Add Client modal, types a name, and taps back, they navigate away and the new client name is lost. If they had started typing in the Quick Add search, same result.

**What a careless user would do:**
- Long-press the wrong client, accidentally tap Delete, panic
- Type a client name in Add Client, tap the keyboard back button, expect it to submit (it doesn't — no onSubmitEditing)
- Scroll the list and accidentally trigger a long press instead of a tap (delayLongPress is 400ms — short enough to accidentally trigger)
- Tap the FAB, scroll through the client picker, tap the wrong client, and add a transaction to the wrong client (no way to correct this from the add transaction sheet)

**What a power user would expect:**
- Tap the existing client total to jump to that client's detail
- Swipe a client to quickly delete or archive it
- Drag to reorder clients
- Sort clients by outstanding amount or name
- See a "last activity" timestamp on each client card
- The tile layout preference persisting between sessions

**What happens at scale (10+ clients):**
- The ScrollView with 10+ cards is fine — React Native handles small lists well
- The Quick Add client picker starts requiring search as clients accumulate (6+ clients means scrolling)
- The Needs Attention rows might show very large numbers (e.g., "47 untagged") — no pagination or limit on these
- Outstanding total calculation iterates all transactions for each client render — at 500+ transactions, this adds up to O(n×m) operations on each render

**What breaks under stress:**
- Having 20+ clients in list view makes the home screen feel like a data table, not a dashboard
- With many clients, scrolling past the Needs Attention section and client list headers to find a specific client requires significant effort
- The OUTSTANDING total with 20 clients × 100 transactions each = 2000 transaction calculations on every home screen render. No memoization is in place.

---

## Screen 2: Search / Explore
**File:** `app/(tabs)/explore.tsx`
**Route:** `/explore`
**Entry points:** Tab press, Needs Attention row navigation from home

### Purpose
The Explore screen serves two distinct use cases that share one UI:
1. **Search mode:** User types a query to find any transaction by merchant, note, or client name
2. **Filter mode:** Needs Attention drives the user here with a pre-set filter to work through a cleanup queue

These two modes coexist but feel slightly different in intent. Filter mode is a task queue. Search mode is a lookup tool. They could eventually be separate features.

### What it does
- Shows a text search input that filters transactions live
- Accepts a `filter` query param to pre-filter to flagged, missing, or untagged transactions
- Shows a filter label at the top when a filter is active
- Without filter and no query: shows first 10 transactions as "recent activity"
- With filter: shows all matching transactions (no limit)
- With query + filter: searches within the filtered set only
- Each result shows: color dot (client), merchant name, client name, note, date, amount, receipt badge

### Route params accepted
| Param | Values | Effect | Source |
|---|---|---|---|
| `filter` | `'flagged'` | Shows only transactions where `t.flagged === true` | Needs Attention rows |
| `filter` | `'missing'` | Shows only where `!t.receiptUri && !t.note` | Needs Attention rows |
| `filter` | `'untagged'` | Shows only where `!t.tagIds \|\| t.tagIds.length === 0` | Needs Attention rows |
| `filter` | anything else | Falls through to `safeTransactions` (no filter) | Not expected |

**Note on filter persistence:** The `filter` param is read from `useLocalSearchParams()` once on render. It does NOT update if the URL changes while the screen is mounted (because tabs don't remount). If the user navigates to explore with `filter=flagged`, fixes all flagged items, then navigates to home and back to explore, the filter is gone (explore now shows all transactions). This means returning to the cleanup queue from home always requires tapping the Needs Attention row again.

### State used
| State variable | Type | Purpose |
|---|---|---|
| `query` | string | Text search input |

**Note:** The `filter` param is from router state, not local useState. It is read on every render from `useLocalSearchParams()`.

### Filter logic in detail

```
filter=flagged:
  t.flagged === true
  Note: t.flagged is absent on most initial seed data (undefined !== true)
  Note: strict equality to prevent truthy matches on other values

filter=missing:
  !t.receiptUri && !t.note
  Note: Uses receiptUri (photo URI), NOT receipt (boolean)
  Note: A transaction with receipt:true but no URI AND no note WILL appear here
  Note: A transaction with receipt:false but with a note will NOT appear here
  Note: Empty string note '' evaluates as falsy and WILL cause the tx to appear

filter=untagged:
  !t.tagIds || t.tagIds.length === 0
  Note: If tagIds contains only deleted tag IDs (orphaned), tx is NOT counted as untagged
  Note: This is a known inaccuracy (see FINDINGS.md Finding 12)
```

### Display logic
When a result row is rendered:
- `client` found via `safeClients.find(c => c.id === tx.clientId)` — can be undefined for orphaned transactions
- Client dot color: `client?.color || '#666'` — fallback to grey for orphans — correct
- Client name in meta: `client?.name` — shows undefined for orphans — NOT handled (shows "undefined")
- Receipt badge: uses `tx.receipt` (boolean) — inconsistent with filter using `receiptUri`

**The `client?.name` issue:** When a transaction belongs to a deleted client, `client?.name` evaluates to `undefined`. The meta text renders as: `"undefined · note text · Apr 14"`. This is not a crash but produces visible garbage text in the search results. No guard exists.

### Navigation output
When tapping a result, the URL includes several params:
```
/client-detail?id=${tx.clientId}&txId=${tx.id}&source=explore&returnFilter=${filter}
```

If `filter` is undefined (no filter mode), the URL becomes:
```
/client-detail?id=${tx.clientId}&txId=${tx.id}&source=explore&returnFilter=undefined
```

This causes `saveTxEdit` and `addReceiptToTx` to navigate to `/explore?filter=undefined` on save. That undefined filter doesn't match any case, so explore would show all transactions instead of the expected filtered list.

### Known issues

**Issue 1: No empty state for active filter with zero results**
When a user fixes all their flagged transactions and navigates back to explore with `filter=flagged`, the result list is empty. There is no message. The screen shows only the search input, the filter label ("Showing: Flagged for Review"), and nothing else. The user has no confirmation that they're done. They might think the app failed to load.

**Issue 2: Receipt badge uses wrong field**
`{tx.receipt && <Text style={s.receiptTag}>receipt ✓</Text>}` uses the boolean `receipt` field. Initial seed transactions have `receipt: true` with no photo. These show green "receipt ✓" badges in explore results even though there is no photo to view.

**Issue 3: Client name shows "undefined" for orphaned transactions**
If a client was deleted, their transactions remain. When these transactions appear in explore search results, the meta line shows "undefined · note · date". This is confusing and looks like a bug to the user.

**Issue 4: No clear button on search input**
To clear the search query, the user must manually delete all characters. Adding an "×" clear button would be standard UX.

**Issue 5: No way to sort results**
Results are always shown in the order they appear in the transactions array (newest first, since new transactions are prepended). There is no way to sort by amount, date, or client.

**Issue 6: `filter` param not updated on screen focus**
If the user fixes all flagged items in the client-detail screen and the return navigation sends them to `router.replace('/explore?filter=flagged')`, explore re-renders with the filter. But if they then navigate AWAY (tab switch) and come BACK, the tab doesn't re-navigate to a new URL — explore just re-renders with its last param state. So on return, the filter IS maintained within a session, but the count displayed might differ.

**What a careless user would do:**
- Search for "men" to find Menards, accidentally see every "men" transaction from every merchant
- Tap a search result with no client (orphaned) and see a blank client-detail screen
- Type one character (threshold is >1), wonder why nothing happens
- Not understand why the list shows 10 random transactions when they first open the Search tab

**What a power user would expect:**
- Ability to sort by amount, date, or client
- Ability to search within a specific client's transactions
- Ability to see ALL transactions, not just the first 10
- Date range filtering
- "Save this search" or recent searches
- Tap a result to scroll to that transaction in the client's full list (not just open the detail sheet)

**What happens at scale:**
- At 1000 transactions, `safeTransactions.filter(...)` on every keystroke processes 1000 items
- At 10,000 transactions, the initial 10-transaction display is still instant, but filter operations become slow
- Without debouncing the search input, each keystroke triggers a filter pass over all transactions
- The `results.map(tx => ...)` renders all results in a flat ScrollView with no virtualization

---

## Screen 3: Tax
**File:** `app/(tabs)/tax.tsx`
**Route:** `/tax`
**Entry points:** Tax tab press

### Purpose
The Tax screen is a summary view intended to help the user understand their deductible business expenses. It is used primarily during tax season or when talking to an accountant. It is NOT a primary workflow screen — it's a reporting view.

### What it does
- Displays a "year summary" label (though it actually shows ALL transactions regardless of year)
- Shows three summary cards: Total Logged, Estimated Savings, Backed by Receipts
- Shows a user-adjustable tax bracket percentage
- Shows a per-client spending breakdown
- Shows ALL transactions in a flat list
- Shows "Export CSV" and "Export PDF Report" buttons — neither is functional

### State used
| State variable | Type | Purpose |
|---|---|---|
| `draft` | string | Local string representation of tax bracket input |
| `store.taxRate` | number | Persisted tax rate value |

The `draft` state is a local copy that diverges from `store.taxRate` while the user is typing. On `onBlur`, it validates and commits to the store. If invalid (NaN, ≤0, >100), it resets to the current stored value.

### Calculations

| Calculation | Formula | Issues |
|---|---|---|
| `totalLogged` | Sum all `t.amount` (no Number coerce) | Can produce NaN or wrong total if any amount is a string |
| `totalWithReceipts` | Sum amounts where `t.receipt === true` | Uses boolean field — inflated by seed data |
| `workTotal` | Sum amounts where `t.clientId !== 5` | Hardcoded ID — breaks if user recreates Personal client |
| `estimatedSavings` | `workTotal × (taxRate / 100)` | Inherits workTotal's inaccuracy |
| `byClient` | Map clients to their transaction sums | No null guard on client existence |

**The year problem in detail:** `const year = new Date().getFullYear()` is computed, but `const yearTxs = transactions` ignores the year entirely. `yearTxs` contains ALL transactions, not just those from the current year. The screen looks like it filters by year but doesn't. As users accumulate transactions across years, the "2026 Summary" will include 2025 transactions as well, making all numbers meaningless for actual tax purposes.

### Known issues

**Issue 1: Export buttons are dead UI**
Two buttons render prominently in a dedicated "EXPORT" section. Neither has an `onPress` handler. Tapping them produces no response — no alert, no animation, nothing. For a user who discovers the app in February and wants to export for taxes, this is a major disappointment and immediately raises doubt about the entire app.

**Issue 2: `fmt(n)` can crash with string amounts**
The `fmt` function in tax.tsx is `(n) => '$' + n.toFixed(2)`. If `n` is a string (e.g., if a transaction's amount was somehow saved as `"84.12"` instead of `84.12`), calling `.toFixed(2)` on a string throws `TypeError: n.toFixed is not a function`. This crashes the entire tax screen. Compare with the safer pattern used in all other screens: `'$' + (Number(n) || 0).toFixed(2)`.

**Issue 3: No year filtering**
`yearTxs` is just `transactions` — all transactions ever. The year displayed in the header is the current year, giving the false impression that only current-year transactions are shown. A user who logs $50,000 in 2025 and $30,000 in 2026 would see their "2026 Summary" show $80,000.

**Issue 4: `byClient` renders clients even if client was deleted**
`const byClient = clients.map(c => ({...c, total: ...}))` — this only includes ACTIVE clients. Orphaned transactions (from deleted clients) are NOT included in any client row, but they ARE included in `totalLogged`, `workTotal`, and `estimatedSavings`. This creates an invisible discrepancy: the individual client totals don't add up to the totals shown at the top.

**Issue 5: "ALL TRANSACTIONS" list has no pagination or search**
The flat list of every transaction at the bottom of the tax screen becomes overwhelming at 50+ transactions. There's no way to scroll directly to a specific transaction or filter within this view. At 200+ transactions, this section is essentially unusable.

**What a careless user would do:**
- Tap Export CSV expecting a file to download → nothing happens → assume the app is broken
- Change tax bracket while reviewing, not notice the onBlur save behavior, close the app, and wonder if their change was saved
- Look at $80,000 total and not realize it includes last year's transactions

**What a power user would expect:**
- Year filter (dropdown or left/right arrows to navigate years)
- Export that actually works
- Breakdown by tag (how much was "Materials" vs "Fuel" vs "Food")
- Month-by-month bar chart
- Ability to mark certain transactions as "non-deductible" and exclude from the estimate
- Filter the "ALL TRANSACTIONS" list by client or tag

---

## Screen 4: Client Detail
**File:** `app/client-detail.tsx`
**Route:** `/client-detail`
**Entry points:** Tap client from home, Quick Add flow, Explore result tap

### Purpose
The Client Detail screen is the workhorse of the app. It handles every transaction-level operation: viewing, adding, editing, deleting, multi-selecting, invoicing, receipt management, and tagging. It is also the destination for the Needs Attention fix flow. This screen has the most state variables, the most modals, and the most code paths of any screen in the app.

### Route params accepted

| Param | Type | When present | Effect |
|---|---|---|---|
| `id` | string (number) | Always required | Identifies which client to show |
| `addTx` | `'1'` or absent | When FAB quick-add used | Opens Add Transaction sheet on mount |
| `txId` | string (number) | When tapping from Explore | Opens that transaction's detail sheet on mount |
| `source` | `'explore'` or absent | When coming from Explore | Enables return navigation after fix |
| `returnFilter` | `'flagged' \| 'missing' \| 'untagged'` | When source=explore | Which filter to return to in explore |

**Critical param interaction:** If both `addTx='1'` and `txId` are present, the `useEffect` processes both: it opens the add sheet AND opens the tx detail sheet. The result is both modals trying to be visible, with the tx detail winning (modals are stacked, the last setState wins). This edge case can't happen in current navigation paths but is worth noting.

**The `id` param type issue:** Route params arrive as strings. The client is found with `clients.find(c => c.id === Number(id))`. This correctly handles initial-data clients (integer IDs 1-5) and Date.now() IDs. If `id` param is missing or non-numeric, `Number(undefined)` = NaN, `Number('abc')` = NaN, and `find` returns undefined. The `if (!client) return null` guard catches this — but shows a blank screen.

### State complexity map

This screen has 23 distinct state variables. Grouping by concern:

**Navigation/routing state:**
- None — using router params read at mount

**Modal visibility (8 boolean states):**
- `showInvoiceConfirm`
- `showAddSheet`
- `showMoveSheet`
- `showReceiptViewer`
- `showTagModal`

**Transaction selection:**
- `selectedTx` — the transaction object being viewed/edited
- `isEditing` — view vs. edit mode for the detail sheet
- `multiSelect` — whether multi-select is active
- `selectedIds` — array of selected transaction IDs

**Add transaction form (6 states):**
- `merchant`, `amount`, `note`, `receiptUri`
- `selectedCardId`, `selectedTagIds`
- `merchantSuggestions` — autocomplete results

**Edit transaction form (4 states):**
- `editMerchant`, `editAmount`, `editNote`, `editTagIds`

**Shared/UI states:**
- `invoiceNote` — text for the invoice confirmation modal
- `search` — in-screen search/filter for the transaction list
- `tagSearch` — search text inside the tag picker modal
- `tagModalForEdit` — flag to route tag picker actions to add vs edit flow

### The `tagModalForEdit` pattern (important)

Both the add form and the edit form use the same tag picker modal. The `tagModalForEdit` boolean determines which state array (`selectedTagIds` vs `editTagIds`) receives tag selections. The `activeTagIds` and `activeToggleTag` variables resolve to the correct state based on this flag.

This works correctly but is fragile. If `tagModalForEdit` is set incorrectly, tags would be added to the wrong form's selection. The current code sets it before opening the modal and clears it on close — the timing is safe.

### Modals and Sheets (7 total)

**1. Invoice Confirm (slide)**
- Summarizes how many transactions will be invoiced and total amount
- Optional invoice note TextInput
- Confirm button → calls `markInvoiced(client.id, invoiceNote)`
- Cancel button dismisses

**2. Add Transaction (slide, KeyboardAvoidingView)**
- Merchant TextInput with autocomplete dropdown
- Amount TextInput (decimal pad)
- Note TextInput (ref-accessible for "Add Note" alert shortcut)
- Card picker (only visible if cards.length > 0)
- Tag chips (top 8 by usage + "+" button)
- Camera button (shows preview after photo)
- Save Transaction button
- Cancel link

**3. Transaction Detail — View Mode (slide, KeyboardAvoidingView)**
- Header row: "TRANSACTION" label + 🗑 delete icon
- Merchant (large text)
- Amount (accent color, very large)
- Date
- "Mark Reviewed" button (only if flagged)
- Tag chips (view-only)
- Note text
- Receipt status row (dot + "Receipt attached" / "No receipt")
- Receipt thumbnail (tappable, only if receiptUri exists)
- Replace Receipt button (only if receiptUri exists)
- Remove Receipt button (only if receiptUri exists)
- Add Receipt button (only if NO receiptUri)
- Edit button
- "+ Add Rule" link
- Close button

**4. Transaction Detail — Edit Mode (slide, KeyboardAvoidingView)**
- Same modal as above but rendered in edit mode
- Merchant TextInput
- Amount TextInput (decimal pad)
- Note TextInput
- Tag chips (editable, top 8 + "+" button)
- Save Changes button
- Cancel button (returns to view mode, not closes modal)

**5. Move to Client (slide)**
- Count of selected transactions
- Scrollable list of all OTHER clients
- Cancel button

**6. Tag Picker Modal (slide)**
- All tags sorted by usage count
- Tappable chips (toggle selected)
- Search input AT THE BOTTOM (known UX issue)
- Create tag button (only when search has no matches)
- Save button

**7. Full-Screen Receipt Viewer (fade, not transparent)**
- Full-screen black background
- ScrollView with zoom (maximumZoomScale: 3)
- Close button (top-right absolute position)

### The `useEffect([], [])` mount behavior

```js
useEffect(() => {
  if (addTx === '1') setShowAddSheet(true);
  if (txId) {
    const tx = transactions.find(t => String(t.id) === String(txId));
    if (tx) { setSelectedTx(tx); setIsEditing(false); }
  }
}, []);
```

This runs ONCE on mount. At mount time, the `_layout.tsx` `RootLayoutInner` guard ensures `store.loaded` is true before any screen renders. Therefore, `transactions` is always populated when this effect runs. The empty dependency array is intentional — the effect should only run once. Adding `transactions` to deps would cause it to re-run on every transaction change, potentially re-opening modals unexpectedly.

The `txId` lookup converts both sides to strings to handle the type mismatch between route params (string) and transaction IDs (number). This is correct.

### The `if (!client) return null` failure mode

After the `useEffect` and before all other render logic, `const client = clients.find(c => c.id === Number(id))`. If this is undefined:
- The function returns `null`
- The screen shows as completely blank (no SafeAreaView, no header, no back button)
- The user is trapped with no way to navigate except Android hardware back or tab navigation
- This situation can occur if: the `id` param is invalid, the client was deleted while the user was on another screen, or the AsyncStorage load produced an empty clients array

**Scenarios where this can occur:**
1. User has client-detail open → switches to another app for 10+ minutes (unlikely but Android may garbage collect) → returns to app which re-renders → client array might be empty during re-hydration → blank screen
2. Deep link or notification navigates to `/client-detail?id=deleted_client_id`
3. Bug in initial AsyncStorage load returns empty clients array

### The multi-select mode architecture

Multi-select operates as an overlay on the normal transaction list:
- `multiSelect: true` adds checkboxes to each row
- Long press enters multi-select and selects the long-pressed item
- Tapping a row while in multi-select toggles it (calls `toggleSelect` instead of `openTxDetail`)
- The normal "+ Add Transaction" floating button is replaced by a multi-bar with Delete/Move/Cancel
- `allVisibleSelected` checks `filteredPending` — if search is active, "Select All" only selects visible items
- Delete and Move operate on `selectedIds` regardless of what's visible

**The `filteredPending` / `selectedIds` mismatch:**
If user selects 5 transactions, then searches within the client (showing only 2), then taps "Select All" — this DESELECTS the filtered items (since `allVisibleSelected` is false because there are other selected IDs not in the filtered view). The behavior is actually: "toggle all VISIBLE transactions." This is non-intuitive and could cause unexpected deselection.

### Receipt management complexity

Three distinct receipt-related actions exist in the detail sheet:
1. **Add Receipt** (green button) — appears only when `!selectedTx.receiptUri`
2. **Replace Receipt** (ghost button) — appears only when `selectedTx.receiptUri` exists
3. **Remove Receipt** (ghost button, red text) — appears only when `selectedTx.receiptUri` exists

The Add/Replace flows both call `addReceiptToTx()` — they are the same function. The Remove flow is inline in the JSX as an Alert.onPress callback.

**The async safety issue with `addReceiptToTx`:**
```js
editTransaction?.(selectedTx.id, { ... }); // selectedTx read AFTER await
setSelectedTx(prev => prev ? { ...prev, ... } : null);
```
`selectedTx` is a React state variable. Between `await ImagePicker.launchCameraAsync()` and the editTransaction call, the component could re-render and `selectedTx` could theoretically change. In practice, the only way `selectedTx` becomes null mid-camera is if the user taps the backdrop while the camera app is open. On most Android devices, opening the camera takes over the screen, preventing backdrop taps. But on some devices or in some edge cases, this could occur.

### Known issues

**Issue 1: Blank screen with no back button**
`if (!client) return null` is a dead-end. See detailed analysis above.

**Issue 2: `addReceiptToTx` async safety**
`selectedTx.id` read after await. Should capture before first await.

**Issue 3: Edit mode missing receipt and card controls**
Users who want to add a receipt AND edit the amount must do two separate operations. The edit form intentionally only shows the editable text fields and tags, not the full detail view's receipt buttons.

**Issue 4: Android back doesn't close modals**
With 7 modals, this screen is the most affected by the missing BackHandler registration.

**Issue 5: Tag modal search input at the bottom**
Keyboard appearing for tag search causes the search input to be at the very bottom of the screen, which is actually the most accessible position for one-handed use — but the chips list renders ABOVE the search, requiring mental context-switching.

**Issue 6: Card used is not displayed in transaction detail view**
Transactions store `cardId`, but the detail sheet never shows which card was used. Users have no way to verify which card a transaction was logged against without entering edit mode (where card picker also isn't shown — it was never added to the edit form).

**What a careless user would do:**
- Long press a transaction intending to tap it, enter multi-select mode, be confused
- Tap the trash icon, misread the alert, accidentally confirm delete
- Enter multi-select, do nothing, tap Android back, think something went wrong
- Open the add transaction sheet, take a photo, then tap the overlay to close — all data including the photo is lost silently

**What a power user would expect:**
- Swipe to delete transactions (swipe left)
- Bulk tag operations (tag all selected transactions)
- Edit receipt AND other fields in the same sheet
- Undo delete
- Sort transactions by date, amount, or merchant
- Filter pending by tag within a client
- In-line note editing without entering full edit mode

---

## Screen 5: Settings
**File:** `app/settings.tsx`
**Route:** `/settings`
**Entry points:** Gear icon on home screen

### Purpose
Settings provides configuration options for the app. Currently it has one behavioral setting (round number gas detection) and a link to Rules management.

### What it does
- Shows one toggle: Round Number Gas Detection
- Shows a "Manage Rules" link that navigates to the Rules screen
- Back button returns to previous screen

### State used
- `store.settings.roundNumberGas` — read and written via store
- `store.updateSettings` — called on toggle change

### The Round Number Gas Detection logic (in store.tsx)

When a transaction is added:
1. `settings.roundNumberGas` is checked
2. If enabled, the transaction's merchant is checked against a hardcoded list of gas station names: `['shell', 'bp', 'marathon', 'speedway', 'exxon', 'mobil', "casey's", 'kwik trip']`
3. If the merchant matches AND the amount is either exactly round (`txAmount % 1 === 0`) OR "repeating" (`Math.floor(txAmount) === Math.round((txAmount % 1) * 100)`), the Fuel tag is auto-applied
4. "Repeating" means a number like $55.55 or $44.44

**Issues with this logic:**
- The gas station list is hardcoded in store.tsx (not user-configurable)
- "Sunoco," "Circle K," "Pilot," "Loves," "Thorntons" are not in the list
- "Repeating" detection logic is mathematically questionable — `Math.floor(55.55) === Math.round((55.55 % 1) * 100)` = `55 === 56` = false (55.55 would NOT match)
- The detection is entirely silent — no notification that a tag was auto-applied

### Settings screen is significantly underbuilt

The Settings screen currently has one toggle and one link. Future settings that should logically live here:
- View preference (tile/list default)
- Notification preferences (when implemented)
- Theme selection
- Data export
- Clear data / reset app
- App version display
- Contact/support link

---

## Screen 6: Rules
**File:** `app/rules.tsx`
**Route:** `/rules`
**Entry points:** Settings → "Manage Rules", "+ Add Rule" link from transaction detail

### Purpose
Rules serves triple duty as the management screen for Rules, Tags, and Cards — three logically related but conceptually distinct features. It's reached from Settings and from transaction detail flows.

### What it does
- Lists all existing rules with IF/THEN summaries
- Lists all tags with color indicators
- Lists all cards with strategy labels
- Provides full CRUD for each category via bottom sheet modals
- Accepts `prefillMerchant` param to open rule builder with merchant pre-filled

### Route params
| Param | Type | Effect |
|---|---|---|
| `prefillMerchant` | string | Opens rule sheet with merchant IF row pre-filled |

### IF condition types
| Type | Storage field | Match logic |
|---|---|---|
| `merchant contains` | `merchantContains: string` | `tx.merchant.toLowerCase().includes(rule.merchantContains.toLowerCase())` |
| `amount is over` | `amountOver: number` | `tx.amount > rule.amountOver` (strictly greater than — equal amount does NOT trigger) |
| `card used` | `cardId: number` | `tx.cardId === rule.cardId` (exact ID match) |

**Multiple IF conditions in one rule:** The `addRule` function stores only ONE value for each IF type (merchantContains, amountOver, cardId). If the user adds two "merchant contains" rows, only the LAST one is stored (each successive row overwrites the previous). The UI allows adding multiple IF rows of the same type, but the persistence doesn't support it. This is a significant limitation that isn't communicated to the user.

### THEN action types
| Type | Storage field | Effect |
|---|---|---|
| `tag as` | `tagIds: number[]` | Tags merged into transaction on creation |
| `flag for review` | `flag: boolean` | Sets `flagged: true` on the transaction |

### The `assignToClientId` hidden field
The rule model supports `assignToClientId` (auto-assign a transaction to a specific client). The rules engine in `addTransaction` handles this. But there is NO UI in the rule builder to set this. A user can never create a rule that auto-assigns clients. This field is dead code from the UI perspective but live code in the store.

### Rule execution order and conflict resolution

Rules are applied in array order. If two rules both match the same transaction:
- Both rules' tagIds are merged (union, no duplicates)
- If either rule has `flag: true`, the transaction is flagged
- If two rules have different `assignToClientId` values, the LAST matching rule's clientId wins

There is no UI to reorder rules, no priority system, and no indication to the user of which rule applied when multiple rules match.

### Tag creation color assignment

When creating a tag from the transaction form's quick-create flow:
```js
const color = TAG_CYCLE_COLORS[tags.length % TAG_CYCLE_COLORS.length];
```
The color is assigned based on how many tags currently exist. If the user has 8 tags and creates a 9th, it cycles back to the first color. The user has no control over the color when creating from the transaction form — they must go to Rules → Tags to change it afterward.

### Card strategy labels

Cards have a `strategy` field with these options: `'Business Only', 'Personal Only', 'Gas Only', 'Mixed'`. These are purely labels — they have no behavioral effect on the app. They don't auto-tag transactions, don't filter reports, and don't influence the rules engine (the rule checks `cardId`, not strategy). The strategy label is display-only metadata.

---

## Screen 7: Client (Legacy Component — BROKEN ROUTE)
**File:** `app/client.tsx`
**Route:** `/client` (auto-discovered)

This file is a React component that takes `client`, `transactions`, `onBack`, `onInvoice` as props. It is a prototype from before the file-based routing architecture was fully established. Expo Router's file scanner sees it in the `app/` directory and registers `/client` as a route.

**If a user navigates to `/client`:**
- The component renders with all props as `undefined`
- `client.id` immediately throws `TypeError: Cannot read properties of undefined (reading 'id')`
- The app crashes on this route

**Why this hasn't caused problems yet:** There is no navigation link to `/client` anywhere in the app. No button, no link, no deep link, no notification target points to it. But it IS a registered route, and if someone types it or shares a deep link, the app crashes.

**What should be done:** Either delete the file or move it to `components/` (outside the `app/` directory). Expo Router will stop registering it as a route.

---

## Screen 8: Modal (Unused Expo Template)
**File:** `app/modal.tsx`

This is the default Expo template modal page. It's registered in `_layout.tsx` with `presentation: 'modal'` but is never navigated to from anywhere in the app. It renders "This is a modal" with a link to home. It can be safely deleted.

---

## Global Navigation Architecture (Detailed)

```
[App Launch]
  ↓
RootLayout (app/_layout.tsx)
  ↓
StoreProvider (store.tsx)
  Loads all 8 AsyncStorage keys in parallel
  Sets loaded=true when complete
  ↓
ThemeProvider (DarkTheme from @react-navigation/native)
  ↓
RootLayoutInner
  Waits for store.loaded (renders null until ready)
  ↓
Stack Navigator
  ├── (tabs) — headerShown: false
  │   ↓
  │   Tabs Navigator (lazy: true)
  │   ├── index — "Clients" tab (⬡ icon)
  │   ├── explore — "Search" tab (○ icon)
  │   └── tax — "Tax" tab (◈ icon)
  │
  ├── client-detail — headerShown: false
  │   Route params: id, addTx, txId, source, returnFilter
  │
  ├── modal — presentation: modal, title: 'Modal' (UNUSED)
  │
  └── [auto-discovered by Expo Router]
      ├── settings — no explicit options (no headerShown: false)
      ├── rules — no explicit options (no headerShown: false)
      └── client — BROKEN (requires props, crashes if accessed)
```

### Navigation patterns used

| Pattern | Usage | Risk |
|---|---|---|
| `router.push()` | Most forward navigation | Low |
| `router.back()` | All back buttons | Low |
| `router.replace()` | Return to explore after fix | Medium — replaces history |
| Tab switching | Standard tab bar | Low |
| Deep link / URL | Not configured | Would work via Expo Router auto-discovery |

### State management and navigation interaction

React state is LOCAL to each screen component. When you navigate away from a screen (not tab-switch) and come back, the screen's state is reset. This means:
- If user is in multi-select on client-detail and navigates to rules then back, multi-select is reset
- If user opens the add transaction modal and navigates away (Android back), all form data is lost
- Tab-switching keeps screens mounted (lazy: true), so explore's search query persists between tab switches within a session

---

## Shared Patterns Across All Screens

### Loading guard pattern
Two levels of loading protection:
1. **Global:** `RootLayoutInner` returns null until `store.loaded`. This means NO screen renders until AsyncStorage is read.
2. **Local:** Individual screens have `if (!store?.loaded) return null` (client-detail, explore, rules). These are defensive redundancy since the global guard should prevent them from ever being false.

### Safe array patterns
Consistently used defensive patterns:
- `Array.isArray(store?.transactions) ? store.transactions : []`
- `transactions.filter(t => t && t.id)` — guards against null entries
- `clients.filter(c => c && c.name)` — guards against null or nameless entries
- `(t.tagIds || []).map(...)` — guards against undefined tagIds

### Modal patterns
All modals follow this structure:
```jsx
<Modal visible={someBoolean} transparent animationType="slide">
  <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeHandler} />
  <View style={s.sheet}>
    {/* content */}
  </View>
</Modal>
```

The overlay `TouchableOpacity` covers the full screen above the sheet. Tapping it closes the modal. The sheet is positioned at `bottom: 0` with `position: absolute`.

**Critical gap:** No `BackHandler` registration. Android hardware back while any modal is open navigates away from the screen instead of closing the modal.

### Color system
All accent colors reference `ACCENT` from `constants.ts` (value: `'#f59e0b'`). Other colors are hardcoded in StyleSheet:
- Background: `'#0e0e11'`
- Card background: `'#141418'`
- Sheet background: `'#151519'`
- Border: `'#21212a'`
- Muted text: `'#555'`
- Receipt green: `'#22c55e'`
- Error red: `'#f87171'`

None of these are constants — they are inline strings in each file's StyleSheet.create. A global color refactor would require touching every file.

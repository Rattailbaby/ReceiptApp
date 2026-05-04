# DATA_FLOW.md
# Uncrumple — Data Flow & Storage Architecture

---

## Data Models

### Client
```js
{
  id: number,          // Date.now() for new clients, integer for initial data
  name: string,        // Trimmed on save
  color: string,       // Hex color, e.g. '#f59e0b'
  initials: string,    // 2-char, auto-generated from name
  photoUri?: string,   // Local URI from ImagePicker (optional, may be undefined)
}
```

**What a careless user does with Client:**
Creates "dave" with a typo. Tries to delete and re-create as "Dave". The new client gets a different ID. All old transactions remain tied to "dave" forever as orphans. No undo. No merge. No rename-and-keep.

**What a power user expects:**
The ability to merge two clients (combining all their transactions under one), rename without losing transaction links, and set the client color and photo at creation time rather than after.

**Scale analysis:**
At 5 clients, the client list is a visual scan. At 20 clients, the list requires search. At 50 clients, it becomes unusable without grouping or favoriting. The current data model supports only flat list ordering. There is no sort order, no group key, no priority field.

---

### Transaction
```js
{
  id: number,              // Date.now() for new
  clientId: number,        // References Client.id
  merchant: string,        // Merchant name
  amount: number,          // Float, e.g. 84.12
  date: string,            // Formatted string, e.g. "Apr 14" (NOT a Date object)
  note: string,            // Optional note text
  receipt: boolean,        // TRUE if receipt photo was added at save time (NOT updated when receiptUri changes!)
  receiptUri?: string,     // Local URI from camera (null if no photo)
  invoiced: boolean,       // Whether this transaction has been marked invoiced
  invoiceId?: string,      // 'inv-' + timestamp, shared across a batch
  invoiceLabel?: string,   // Human-readable invoice name
  invoiceDate?: string,    // Date string when invoiced
  cardId?: number,         // References Card.id (optional)
  tagIds?: number[],       // Array of Tag.id references (optional, may be missing or empty)
  flagged?: boolean,       // True if flagged by a rule or user action
}
```

**CRITICAL INCONSISTENCY: `receipt` vs `receiptUri`**
- `receipt` (boolean) is set to `!!receiptUri` only at transaction creation time
- When a receipt is added AFTER creation (`addReceiptToTx`), both `receipt: true` and `receiptUri` are updated
- When a receipt is REMOVED, both `receipt: false` and `receiptUri: null` are set
- BUT initial seed data has `receipt: true` and NO `receiptUri` — so `receipt` can be true with no photo
- The "missing receipts" filter in explore.tsx uses `!t.receiptUri && !t.note` — uses `receiptUri`
- The receipt green dot in explore.tsx uses `tx.receipt` (boolean) — inconsistent with the filter
- The receipt green dot in client-detail.tsx also uses `tx.receipt` (boolean)
- This means a transaction can appear to have a receipt (green dot) while also appearing in the "missing receipts" list

**What breaks at scale with Transaction:**
The `date` field is a display string with no year. After 2 years of use, 500 transactions all have dates like "Apr 14" with no way to know which year. The tax screen becomes a historical dump rather than a yearly view. Sorting by date becomes impossible because you can't compare "Apr 14" against "Jan 3" meaningfully — alphabetically "Apr" < "Jan" but chronologically it depends on the year.

**What a careless user does:**
Enters amounts as "43.00" and "43" interchangeably. Both work. Enters "0.00" — fails validation correctly. Enters "43 dollars" — `parseFloat` extracts 43. Enters "four dollars" — NaN, fails validation. The validation is good but the amount field gives no format hint.

**What a power user expects:**
Date backdating, ISO date storage, the ability to view transactions by date range, split-purchase support (one transaction spanning multiple clients), and attachments beyond a single photo (e.g., multiple receipt photos for a large purchase).

---

### Tag
```js
{
  id: number,     // Date.now() for new tags
  name: string,
  color: string,  // Hex color
}
```

**Scale concern:**
There is no limit on the number of tags. A user who creates 50 tags will see all 50 in the tag picker modal, making it unusable. The top-8 shortcut in the add form helps, but the full modal has no pagination. The search box inside the modal mitigates this at scale. But there is no concept of "archived" or "disabled" tags — every tag created lives forever in every picker.

**What breaks when tags are deleted:**
Tags are referenced by ID in `tagIds[]` on transactions. Deleted tags leave orphan IDs. The ID remains in `tagIds[]`, so the transaction appears "tagged" even though no tag is visible. The `untaggedCount` Needs Attention count silently undercounts orphaned-tag transactions.

---

### Card
```js
{
  id: number,       // Date.now()
  label: string,    // e.g. "Chase Sapphire"
  strategy: string, // One of: 'Business Only', 'Personal Only', 'Gas Only', 'Mixed'
}
```

**Current display gap:**
`cardId` is stored on transactions but is NOT currently shown in the transaction detail view. A user who wants to know which card they used can't see it after saving. This is a missing display feature, not a data model gap.

**Scale concern:**
Most users have 2-4 cards. The card picker is a flat list with no search. At 10+ cards it becomes unwieldy. No limit currently enforced.

---

### Rule
```js
{
  id: number,               // Date.now()
  merchantContains?: string, // Case-insensitive substring match
  amountOver?: number,       // Transaction amount threshold
  cardId?: number,           // References Card.id
  tagIds?: number[],         // Tags to apply
  flag?: boolean,            // Whether to flag the transaction
  assignToClientId?: number, // Client to assign to (in store logic, but no UI to set this)
}
```

**The silent data loss issue in the rule builder:**
When a user adds multiple IF rows of the same type (e.g., two "merchant contains" conditions), only the last one is stored. The rule builder's `setIfRows` updates state but the save function reads each type with `ifRows.find(r => r.type === ...)`, which returns only the first match. However the array allows duplicates. This means extra IF rows silently vanish on save.

**`assignToClientId` exists in data model but has no UI:**
The store handles this field in `addTransaction` — if a matching rule has `assignToClientId`, the transaction gets that `clientId`. But there is no interface to set this field. It can only be set by manually editing AsyncStorage. A UI for this would make rules dramatically more powerful (auto-routing Shell transactions to Personal, for example).

---

### Settings
```js
{
  roundNumberGas: boolean   // Default: false
}
```

**Extension concern:**
Settings is a flat object. Adding new settings means modifying the object shape. If an old save doesn't have the new key, the `store.settings.newKey` access returns `undefined`. The load logic does `...parsed` spread over defaults, so new keys default correctly. This is safe as currently structured.

---

### SavedMerchants
```js
string[]  // Array of merchant name strings
```

**The case-sensitivity bug:**
`addMerchant` deduplicates with `prev.includes(trimmed)` — case-sensitive. "Menards" and "menards" are different strings. Both get saved. Autocomplete filter is case-insensitive so both show up as suggestions. Over 6 months of regular use, a user might accumulate 5-6 variants of the same merchant name. The merchant list grows without bound — there is no pruning mechanism and no cap on size.

**What a power user expects:**
The ability to manually manage the merchant list (remove old/typo merchants), merge duplicates, and have autocomplete learn from actual transaction history rather than a separate list.

---

## AsyncStorage Keys

| Key | Value Type | Default |
|---|---|---|
| `uncrumple_transactions` | `JSON (Transaction[])` | INITIAL_TRANSACTIONS (6 seed records) |
| `uncrumple_clients` | `JSON (Client[])` | INITIAL_CLIENTS (5 seed records) |
| `uncrumple_tax_rate` | `String (number)` | 22 |
| `uncrumple_rules` | `JSON (Rule[])` | `[]` |
| `uncrumple_merchants` | `JSON (string[])` | `[]` |
| `uncrumple_cards` | `JSON (Card[])` | `[]` |
| `uncrumple_tags` | `JSON (Tag[])` | INITIAL_TAGS (6 seed tags) |
| `uncrumple_settings` | `JSON (Settings)` | `{ roundNumberGas: false }` |

**Note on `uncrumple_tax_rate`:** This is stored as a string (the JSON stringification of a number is just the number, e.g. `"22"`), then parsed with `parseFloat`. It is the only scalar key — all others are arrays or objects.

---

## Where Data is Loaded

All data is loaded in a single `Promise.all` inside `useEffect(() => {}, [])` in `StoreProvider` (store.tsx:63–149).

Load order (all parallel):
1. Transactions
2. Clients
3. Tax rate
4. Rules
5. Saved merchants
6. Cards
7. Tags
8. Settings

`loaded` is set to `true` after all 8 loads complete.

Error handling: Each load has a try/catch that falls back to initial data or empty array. If the stored value is corrupted, the app silently resets to defaults for that key.

**What happens at scale during load:**
- 100 transactions: `JSON.parse` is near-instant. No concern.
- 1,000 transactions: `JSON.parse` of a large JSON string on a low-end Android device might take 50-100ms. Still acceptable.
- 10,000 transactions: A transaction array with 10,000 entries and embedded receipt URIs (just the URI string, not the image) could easily be 500KB-1MB of JSON. `JSON.parse` on 1MB on a low-end device might take 300-500ms. The user would see a black screen for half a second on every cold start.

**Corruption scenario breakdown:**
If `uncrumple_transactions` is corrupted (e.g., truncated JSON from a failed write), `JSON.parse` throws. The catch block fires. `setTransactions(INITIAL_TRANSACTIONS)` runs. The user sees 6 demo transactions instead of their real data. No error, no banner, no "something went wrong" message. Silent catastrophic data loss.

The other 7 keys continue loading normally — clients, tags, etc. are all preserved. So the user still sees their clients and tags, but all transactions are gone. This is deeply confusing: their clients exist but show 0 transactions and $0.00.

**What a power user expects from load:**
A visible progress indicator during initial load (not a black screen). A backup/restore mechanism. The ability to see "last good save" vs "current state." None of these exist.

---

## Where Data is Saved

| Action | Saves to |
|---|---|
| Add transaction | `uncrumple_transactions` |
| Edit transaction | `uncrumple_transactions` |
| Delete transaction | `uncrumple_transactions` |
| Bulk delete | `uncrumple_transactions` |
| Bulk move | `uncrumple_transactions` |
| Mark invoiced | `uncrumple_transactions` |
| Add client | `uncrumple_clients` |
| Edit client | `uncrumple_clients` |
| Delete client | `uncrumple_clients` |
| Update client photo | `uncrumple_clients` |
| Update tax rate | `uncrumple_tax_rate` |
| Add/edit/delete rule | `uncrumple_rules` |
| Add merchant (auto) | `uncrumple_merchants` |
| Add/edit/delete card | `uncrumple_cards` |
| Add/edit/delete tag | `uncrumple_tags` |
| Update setting | `uncrumple_settings` |

**Save pattern:** All saves use `setState(prev => { const updated = ...; AsyncStorage.setItem(KEY, JSON.stringify(updated)); return updated; })`. The AsyncStorage write is fire-and-forget — there is no error handling on save, and no confirmation that the write succeeded.

**What this means for write failures:**
If the device runs out of storage while writing, `AsyncStorage.setItem` will reject the promise. Since there is no `.catch()`, the rejection is silently swallowed. The in-memory state has the new data (React state was updated). The next save attempt will overwrite the (stale) persisted data with the current in-memory state — so the failure is self-healing as long as a subsequent save succeeds. BUT if the app is killed before the next save, the discrepancy is permanent.

**Frequency of writes:**
Every transaction add/edit fires one write. A user doing 10 transactions in a row fires 10 writes. Each write serializes the ENTIRE transactions array. At 500 transactions, each write serializes ~50KB. This is fine, but it means write costs grow linearly with dataset size. There is no incremental write, no delta write, no WAL (write-ahead log).

**What breaks at scale with writes:**
At 5,000 transactions and 200 rules and 50 tags, a single rule add triggers:
- `setRules` → `AsyncStorage.setItem('uncrumple_rules', JSON.stringify(rules))` — writes ~20KB
- Nothing else writes

But a single transaction add triggers:
- `setTransactions` → `AsyncStorage.setItem('uncrumple_transactions', JSON.stringify(transactions))` — writes ~500KB
- `setMerchants` → `AsyncStorage.setItem('uncrumple_merchants', JSON.stringify(merchants))` — writes ~2KB simultaneously

At high volume, the transactions key becomes a performance bottleneck for every single write.

---

## Data Relationships and Integrity

### Client ← Transaction
- Transactions reference `clientId`
- When a client is deleted, their transactions are NOT deleted
- Orphaned transactions remain in storage with a `clientId` that no longer exists
- Tax screen will try to display them (finds no client, shows `undefined` name)
- Explore screen handles this gracefully (shows no client dot color = grey)

**Failure scenario at scale:**
A user with 3 years of data deletes a client named "Old Job". That client had 200 transactions. All 200 remain in storage. The tax screen shows them summed under "undefined". The untagged/missing counts in Needs Attention include them. The user can't batch-delete them because they can't get to them from a client detail screen. They can only delete them one by one from the Explore search view.

### Tag ← Transaction (via tagIds array)
- Transactions store `tagIds: number[]`
- When a tag is deleted, existing transactions still contain that tag's ID
- Renders gracefully (finds no tag → returns null from map)
- BUT the "untagged" count in Needs Attention checks `!t.tagIds?.length` — transactions with only deleted tag IDs will NOT be counted as untagged (they still have IDs in the array, even though those IDs are orphaned)

**What a power user expects:**
When deleting a tag, the user should be warned: "This tag is used by 14 transactions. Removing it will leave those transactions effectively untagged." An option to "also remove from all transactions" would be the complete solution.

### Card ← Transaction (via cardId)
- Transactions store optional `cardId`
- When a card is deleted, existing transactions keep the `cardId`
- No UI currently displays `cardId` on the transaction detail view, so this is invisible to the user

### Card ← Rule (via cardId)
- Rules can match on `cardId`
- When a card is deleted, existing rules still reference that `cardId`
- The rule will never match (no transaction will have the deleted card's ID)
- In Rules screen display, `cards.find(c => c.id === rule.cardId)` returns undefined — handled gracefully

---

## Data Shape Inconsistencies

### 1. `receipt` boolean vs `receiptUri` string
- `receipt: true` does NOT guarantee `receiptUri` is set (initial seed data proves this)
- `receiptUri` being set does NOT guarantee `receipt: true` (theoretically, though not in practice currently)
- Different fields used in different contexts:
  - Green dot in transaction list: uses `receipt` boolean
  - "Missing receipts" filter: uses `receiptUri`
  - "Backed by receipts" in Tax: uses `receipt` boolean
  - Full-screen viewer: uses `receiptUri`

**Real-world consequence:**
A new user keeps the default seed data and sees green dots on all 6 seed transactions. They think their data has receipts. They tap "Tax" and see "6 backed by receipts." They feel confident. None of the 6 receipts have actual photos — `receiptUri` is null on all of them. If they export (when export is built) or show their accountant, the "backed by receipts" figure is fabricated.

**Clean fix path:**
1. Change all `tx.receipt` checks to `!!tx.receiptUri`
2. Remove the `receipt` boolean field from the data model
3. In `addTransaction`, do not set `receipt` at all (or set it for backwards compatibility and derive it)
4. Update seed data to have `receipt: false` (or just remove the field)

**Tradeoff:** Fixing this changes how seed data appears. The 6 demo transactions will lose their green dots. This is actually MORE correct but could be confusing to a user mid-demo.

### 2. `tagIds` vs `tags` naming
- Store state: `tags` (the Tag objects array)
- On transactions: `tagIds` (the ID references)
- Both names coexist — no confusion in store, but `tagIds` could be undefined (missing entirely) or an empty array — both treated as "no tags" but checked inconsistently: `!t.tagIds?.length` vs `(t.tagIds || []).length === 0`

**Migration implication:**
Old versions of transactions saved before `tagIds` was added to the schema have no `tagIds` key at all. New code checks `t.tagIds?.length` — the optional chain handles this. But if any code uses `t.tagIds.length` (no optional chain), it crashes on old data. This is why the optional chain `?.` is non-negotiable everywhere `tagIds` is accessed.

### 3. `flagged` field
- Set to `true` by rules engine or potentially by user action
- Set to `false` by "Mark Reviewed" button
- NOT present on initial seed data (field is missing, not `false`)
- Checks use `t.flagged === true` in explore.tsx (strict check — safe) and `t.flagged` in client-detail.tsx
- The `flagged` field is absent from the transaction detail display in client-detail.tsx except for the "Mark Reviewed" button condition

**What a power user expects:**
A visible "Flagged" indicator on the transaction — not just a button that appears when flagged. The current design hides the flag state except through the button. A user who doesn't know what "Mark Reviewed" means might tap it accidentally and un-flag a transaction that should stay flagged.

### 4. `date` field format
- Seed data uses: `'Apr 14'`, `'Apr 10'`, etc.
- New transactions use: `new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })` — same format
- BUT old `client.tsx` used `'Today'` as a date string
- There is NO year stored with the date — all transactions appear ambiguous by year
- Tax screen label says `{year} SUMMARY` but filters by ALL transactions (no year filtering at all)

**The year problem in full detail:**
Say a user creates a transaction on April 14, 2025. It's stored as `"Apr 14"`. On April 14, 2026, they add another transaction. Also stored as `"Apr 14"`. On the tax screen, both show up in the "2026 SUMMARY." The user cannot distinguish them. The summary is useless for tax purposes.

**Migration path to fix date format:**
Option A: Store ISO date strings `"2025-04-14"` and format on display. Requires updating existing saved transactions (migration script in `addTransaction` or at load time).
Option B: Store both display string AND year: `{ date: "Apr 14", year: 2025 }`. Backwards compatible, but adds a field.
Option C: Store a Unix timestamp and format everywhere. Clean but requires touching every display location.

Option A is recommended but requires a careful one-time migration at app load. This CANNOT be delegated to Claude Code in a single prompt — it requires planning, testing, and a phased rollout.

### 5. `id` type: number vs string
- Initial seed data: integer IDs (1, 2, 3, 4, 5, 6)
- New data: `Date.now()` (large integer, e.g. 1713000000000)
- `txId` route param arrives as a string (all route params are strings)
- `client-detail.tsx` handles this: `String(t.id) === String(txId)` — correct
- `client-detail.tsx` for client: `clients.find(c => c.id === Number(id))` — uses `Number()` cast — correct
- Risk: If any code does `t.id === txId` without casting, it fails for initial seed data IDs

**What a careless developer does:**
Adds a new comparison `transactions.find(t => t.id === Number(id))` — works for Date.now() IDs but not necessarily for edge cases. Always use `String(t.id) === String(id)` pattern for safety.

### 6. `clientId` on initial seed transactions
- Initial clients have IDs 1–5 (integers)
- Initial transactions have `clientId: 1`, `clientId: 2`, etc.
- When a user deletes an initial client and adds a new one, the new client gets a `Date.now()` ID
- The old transactions with `clientId: 1` become orphaned

---

## Rules Engine Data Flow

When `addTransaction` is called:
1. Iterates over all `rules` (from closure — stale if rules changed since last render)
2. Checks each rule against the transaction
3. Merges any matched `tagIds` into the transaction
4. Sets `flagged: true` if any rule has `flag: true`
5. Applies `assignToClientId` if set (no UI to create this)
6. After rules, checks `settings.roundNumberGas` for gas auto-tag

**Risk:** `addTransaction` is a closure inside `StoreProvider`. The `rules` and `tags` and `settings` it closes over are the values at the time of the last render. If rules are edited right before adding a transaction (very unlikely race condition), the old rules might be applied.

**What breaks under stress with rules:**
A user with 30 rules adds a transaction. Every rule's conditions are checked in a loop. At 30 rules this is microseconds. At 300 rules (hypothetically), still fast — this is simple in-memory iteration over small objects. The rules engine does not scale to complex logic (nested conditions, OR rules, time-based rules), but for the current flat model it's fast at any realistic size.

**What a power user expects from rules:**
OR conditions ("if merchant contains Shell OR BP"), rule ordering (rules apply in priority order), rule testing ("test this rule against existing transactions"), rule editing that shows which transactions it would have affected. None of these exist.

**Silent rule data loss:**
When a user adds two IF conditions of the same type (e.g., two "merchant contains" rows), the rule builder's `ifRows` state holds both. But `handleSaveRule()` calls `ifRows.find(r => r.type === 'merchant')` which returns the FIRST one found. The second merchant condition is silently discarded. The user set up a rule meaning "if merchant is Shell OR if merchant is BP" — but only one condition was saved. This is a significant UX deception.

---

## Merchant Autocomplete Data Flow

1. User types in merchant input (add transaction form)
2. `handleMerchantChange` fires
3. Filters `savedMerchants` array in store for partial matches
4. Shows up to 4 suggestions
5. On transaction save, `addMerchant` is called automatically
6. `addMerchant` deduplicates (case-sensitive — "menards" and "Menards" would both be saved)
7. Saved to `uncrumple_merchants` via `AsyncStorage`

**Risk:** Merchants are stored as-is with original casing. Autocomplete filter is case-insensitive, but storage deduplication is case-sensitive. Over time the merchants list could accumulate case variants.

**What happens at scale:**
After 2 years and 500 transactions, `savedMerchants` could have 200+ unique entries. The autocomplete filters on every keystroke using `.filter(m => m.toLowerCase().includes(query))`. At 200 merchants this is still fast. But the list is never pruned — merchants from abandoned clients or typos remain forever. A power user would want to "manage merchants" the same way they manage tags.

**The derived-vs-stored question:**
`savedMerchants` could be entirely derived by scanning `transactions.map(t => t.merchant)` at load time and deduplicating. This would eliminate the separate storage key, remove the deduplication bug, and keep the autocomplete list in sync with actual transaction history. The tradeoff: deriving at load from 500 transactions is slightly more expensive than loading a pre-built list. For the app's scale, it's negligible. This simplification is recommended for v2.

---

## Null / Undefined Risk Summary

| Location | Risk | Guarded? |
|---|---|---|
| `t.amount` in tax.tsx `totalLogged` | Not coerced to Number | NO |
| `client` in client-detail.tsx | Returns null (blank screen) | Partial |
| `selectedTx` in receiptViewer | `selectedTx?.receiptUri` — safe | YES |
| `tagIds` on transactions | May be `undefined` (missing) | Inconsistent |
| `clientId` on transactions | May reference deleted client | Not guarded at render |
| `cardId` on transactions | May reference deleted card | Not displayed, no risk |
| `t.receipt` on initial data | Boolean, no photo URI | Not guarded in explore |
| `returnFilter` in explore return nav | May be `undefined` | NO (produces `/explore?filter=undefined`) |
| `selectedTx.id` after async camera | Stale after await | NO (race condition exists) |
| `rule.cardId` in rules display | Card may be deleted | Partially guarded |

---

## Data Corruption Scenarios

### Scenario A: Transaction JSON Truncated
**Cause:** App killed mid-write.
**Result:** `JSON.parse` throws. Silent fallback to seed data. User loses all transactions.
**Likelihood:** Rare but possible on very old Android devices with slow storage.
**Mitigation:** None currently. Recommended: write to a backup key before overwriting primary.

### Scenario B: Receipt URI Points to Deleted File
**Cause:** User clears app cache or phone storage manager deletes cached photos.
**Result:** `receiptUri` is a valid string, `receipt: true`, but `Image source={{ uri }}` shows a broken image or blank area.
**Likelihood:** Moderate. Android's image cache can be cleared by the system under storage pressure.
**Mitigation:** None currently. Recommended: check image existence on load and mark receipt as missing if URI is broken.

### Scenario C: `tagIds` Contains IDs From a Different Device
**Cause:** User manually transfers their JSON data from one phone to another.
**Result:** Tag IDs from the old device don't match tag IDs on the new device (different Date.now() timestamps). All `tagIds` become orphaned. Every transaction appears "tagged" in Needs Attention count but shows no tag chips.
**Likelihood:** Will happen if anyone tries to manually migrate data.
**Mitigation:** A proper export/import system would need to handle ID remapping.

### Scenario D: `clientId` Collision After Manual Data Transfer
**Cause:** Same as C. Client IDs from old device don't match new device.
**Result:** All transactions become orphaned.
**Likelihood:** Same as C.

### Scenario E: Settings Gains a New Key Not in Old Save
**Cause:** App is updated with a new setting. Existing users have the old `Settings` shape without the new key.
**Result:** `store.settings.newKey` returns `undefined`. The load logic merges with defaults: `{ ...defaultSettings, ...parsed }` — but only if the load code uses spread. Need to verify this at every new setting addition.
**Likelihood:** Certain as new settings are added.
**Mitigation:** Currently handled correctly via spread-with-defaults in store load.

---

## Data Migration Implications

### If You Change the Date Format
The date field is currently a display string: `"Apr 14"`. If you change to ISO format `"2025-04-14"`, you must:
1. Write a migration that runs at app load time, once
2. Check if transactions have the old format (no year, month-day pattern)
3. Convert using current year (or flag as unknown-year)
4. Update ALL display locations to format from ISO
5. Test with existing users who have mixed old/new data during the transition period

**Do not do this in a single Claude Code prompt.** This is a multi-step migration that requires human review at each step.

### If You Remove the `receipt` Boolean
1. Find every `tx.receipt` or `t.receipt` usage in all files (use grep)
2. Replace with `!!tx.receiptUri` or `!!t.receiptUri`
3. Remove the `receipt` field from `addTransaction` and `editTransaction` calls
4. Remove from seed data in store.tsx
5. Test: seed transactions should now show NO receipt dot (previously showed green dot incorrectly)
6. Run Needs Attention — "missing receipts" count should now be consistent with green dot display

### If You Add a New Transaction Field
1. Add to the model documentation here
2. Add to `addTransaction` with a sensible default
3. Add to `editTransaction` (handle undefined for old transactions)
4. Add to the detail sheet display if user-visible
5. Do NOT assume old saved transactions have this field — always use `tx.newField ?? defaultValue`

# ROADMAP_RECOMMENDED.md
# Uncrumple — Recommended Build Order

**Product goal:** The app should feel simple, low-friction, and helpful for tradespeople. Reduce mental load. Capture first, organize later. Return users to their cleanup queue after each fix.

---

## Phase 1: Must Fix Before More Features

These are bugs or gaps that will confuse real users and should be resolved before the app is shown to anyone or shipped. Each item here is a visible defect or crash risk that damages first impressions or causes data loss.

**Dependencies:** None of these items depend on each other. They can be done in any order, one per session.

**What a careless developer does:** Skips Phase 1 because "they're not that bad." Ships. Gets 1-star reviews: "the export button doesn't work," "I got a white screen," "it says APRIL 2025." Small defects loom large when users pay money for software.

**What a power user thinks of Phase 1:** These are table stakes. A $1 app still needs to look alive.

### 1.1 Dynamic Month Header
**Why:** "APRIL 2025" hardcoded in the app header instantly signals a broken product.
**Files:** `app/(tabs)/index.tsx`
**Risk:** ZERO
**Dependency:** None
**Tradeoff:** Fixing this makes the app look maintained. There is literally no downside.
**Step one:** Replace the hardcoded string with `new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()`
**Exact Claude Code prompt:**
> In `app/(tabs)/index.tsx`, find the hardcoded string `'APRIL 2025'` in the header Text component and replace it with a dynamic expression: `new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()`. Do not change styles, do not refactor, one file only.

---

### 1.2 Export Buttons Need Feedback
**Why:** Silent tap = broken-feeling app. Users paying $1 expect buttons to do something.
**Files:** `app/(tabs)/tax.tsx`
**Risk:** ZERO
**Dependency:** None
**Tradeoff:** An Alert that says "Coming soon" is slightly disappointing but far better than silence. It communicates that the feature is planned, not forgotten.
**Step one:** Add `onPress={() => Alert.alert('Coming soon', 'Export will be available in a future update.')}` to both export buttons
**Exact Claude Code prompt:**
> In `app/(tabs)/tax.tsx`, add an `onPress` prop to both export `TouchableOpacity` buttons (Export CSV and Export PDF Report). Each should call `Alert.alert('Coming soon', 'Export will be available in a future update.')`. Import `Alert` from `react-native` if not already imported. Do not change styles. One file only.

---

### 1.3 Client Not Found: Replace Blank Screen
**Why:** Users navigating to a deleted client see a white blank screen with no escape.
**Files:** `app/client-detail.tsx`
**Risk:** LOW
**Dependency:** None
**Tradeoff:** The fallback screen doesn't recover the deleted client. It just gives users a way out. That's the right scope — don't over-engineer a recovery mechanism here.
**Step one:** Replace `if (!client) return null` with a fallback screen showing "Client not found" and a back button
**Exact Claude Code prompt:**
> In `app/client-detail.tsx`, find `if (!client) return null`. Replace it with a SafeAreaView that shows a back button (using `router.back()`) and a centered message "Client not found." Use the existing `s.root`, `s.header`, `s.backBtn`, `s.back` styles. Do not change any other logic. One file only.

---

### 1.4 Fix `fmt()` in Tax Screen
**Why:** If any transaction has a string amount, the tax screen crashes.
**Files:** `app/(tabs)/tax.tsx`
**Risk:** LOW
**Dependency:** None
**Tradeoff:** `Number()` coercion is silent about bad data — it returns 0 instead of crashing. This is the right default for a display function. The data should be clean, but the display should be resilient.
**Step one:** Change `fmt` to use `Number()` coercion and add `Number()` to all `.reduce` amount calls
**Exact Claude Code prompt:**
> In `app/(tabs)/tax.tsx`, change the `fmt` function from `(n) => '$' + n.toFixed(2)` to `(n) => '$' + (Number(n) || 0).toFixed(2)`. Also change every `reduce` that sums amounts: replace `s + t.amount` with `s + (Number(t.amount) || 0)`. Do not change styles, do not refactor. One file only.

---

### 1.5 Capture `txId` Before Async in `addReceiptToTx`
**Why:** Async race condition — `selectedTx` could be null after camera returns.
**Files:** `app/client-detail.tsx`
**Risk:** LOW
**Dependency:** None
**Tradeoff:** This is a defensive fix — the race condition is rare but real. The fix is 2 lines and reduces the window of failure to zero.
**Step one:** Capture `const txId = selectedTx?.id; if (!txId) return;` before any await in `addReceiptToTx`
**Exact Claude Code prompt:**
> In `app/client-detail.tsx`, find the `addReceiptToTx` async function. At the very beginning of the function body (before any await), add `const txId = selectedTx?.id; if (!txId) return;`. Then replace `selectedTx.id` with `txId` wherever it appears inside that function. Do not change any other functions. One file only. Minimal patch.

---

## Phase 2: Small Safe Wins

Improvements that take 1–2 prompts each and make the app feel more polished. All zero or near-zero risk. These make the app feel cared for and complete.

**Dependencies:** Phase 1 should be complete first (especially 1.3 and 1.5 which are in client-detail.tsx — avoid touching that file twice in the same session).

**What a careless developer does:** Skips Phase 2 because "users don't care about empty states." Users absolutely care. An empty state that says "All clear!" is the difference between a user thinking the app works and a user thinking the app is broken.

### 2.1 Empty State in Explore When Filter Has Zero Results
**Why:** "All clear! No flagged transactions." is encouraging and confirms the app is working.
**Files:** `app/(tabs)/explore.tsx`
**Risk:** ZERO
**Tradeoff:** The message needs to be filter-aware: "No flagged transactions" vs "No missing receipts" vs "No untagged transactions." A generic "All clear" works but a specific message is better.
**Exact Claude Code prompt:**
> In `app/(tabs)/explore.tsx`, after the `results.map(...)` section, add a block that shows when `filter` is set, `results.length === 0`, and `query.length <= 1`. Display a message like "All clear — nothing to review here." Use the existing `s.empty` style. Do not change other logic. One file only.

---

### 2.2 Empty State When User Has No Clients (Home Screen)
**Why:** A first-time user sees a completely blank home screen. The "+ Add" button is small. The empty state should guide them.
**Files:** `app/(tabs)/index.tsx`
**Risk:** ZERO
**Tradeoff:** The empty state must be additive only — don't replace the client list, just show it when the list is empty.
**Exact Claude Code prompt:**
> In `app/(tabs)/index.tsx`, after the client list renders (after the tile/list view toggle block), add an empty state that shows when `safeClients.length === 0`. Display something like "No clients yet — tap + Add to get started." Use a style similar to the existing cards (`s.card`) with centered, muted text. Do not change other logic. One file only.

---

### 2.3 Fix Return Navigation After Edit (Undefined Filter)
**Why:** Navigating to `/explore?filter=undefined` shows unexpected results.
**Files:** `app/client-detail.tsx`
**Risk:** LOW
**Tradeoff:** The guard `['flagged', 'missing', 'untagged'].includes(returnFilter)` is tightly coupled to the filter names. If a new filter is added in the future, this list must be updated. That's acceptable — it's explicit and clear.
**Exact Claude Code prompt:**
> In `app/client-detail.tsx`, find all instances of `router.replace('/explore?filter=' + returnFilter)`. Add a guard so this navigation only fires when `returnFilter` is one of `['flagged', 'missing', 'untagged']`. If it isn't, skip the navigation (just close the modal/sheet as normal). Do not change styles. One file only.

---

### 2.4 Receipt Status Consistency Fix
**Why:** Green dots show for transactions with no actual receipt photo.
**Files:** `app/client-detail.tsx` first (change receipt dots to use `!!tx.receiptUri`), then `app/(tabs)/explore.tsx`
**Risk:** LOW (but changes how initial seed data appears)
**Tradeoff:** Fixing this makes seed data transactions LOSE their green dots. That's more accurate but might briefly confuse a user who noticed the dots before. The accuracy improvement outweighs the momentary confusion.
**Exact Claude Code prompt (step 1 — client-detail):**
> In `app/client-detail.tsx`, find the line that renders `receiptDot` vs `noReceiptDot` in the pending transaction list row. Change the condition from `tx.receipt` to `!!tx.receiptUri`. Do not change any other logic. One file only.
**Exact Claude Code prompt (step 2 — explore, do in a separate session):**
> In `app/(tabs)/explore.tsx`, find the receipt indicator logic in the transaction row render. Change any `tx.receipt` or `t.receipt` boolean check (for showing a receipt indicator/dot) to `!!tx.receiptUri` or `!!t.receiptUri`. Do not change the "missing receipts" filter logic. One file only.

---

### 2.5 Merchant Deduplication Case-Insensitive
**Why:** Saves "Menards" and "menards" as two entries, polluting autocomplete.
**Files:** `store.tsx`
**Risk:** LOW
**Tradeoff:** First-seen capitalization wins. If the user typed "menards" first, it stays "menards" in the list. This is fine — autocomplete is case-insensitive anyway.
**Exact Claude Code prompt:**
> In `store.tsx`, find the `addMerchant` function. Change the deduplication check from `prev.includes(trimmed)` to `prev.some(m => m.toLowerCase() === trimmed.toLowerCase())`. Do not change anything else. One file only.

---

### 2.6 Tag Modal Search Input at Top
**Why:** Searching from the bottom while keyboard is open is awkward.
**Files:** `app/client-detail.tsx`
**Risk:** LOW (JSX reorder only)
**Tradeoff:** Moving search to the top changes the visual flow — search box appears before tag chips. This is the standard pattern (type to filter, then select). No functionality changes.
**Exact Claude Code prompt:**
> In `app/client-detail.tsx`, in the Tag Picker modal, move the `tagSearchInput` TextInput to appear ABOVE the ScrollView of tag chips, not below it. Do not change styles, just reorder the JSX. One file only.

---

### 2.7 `workTotal` Fix for Hardcoded Client ID
**Why:** Estimated savings is wrong for any user who deleted and re-created their Personal client.
**Files:** `app/(tabs)/tax.tsx`
**Risk:** LOW
**Tradeoff:** Name-based comparison is a soft convention — any client named "Personal" is excluded. This is better than hardcoded ID 5, but ideally a `isPersonal` flag or `category` field would be the permanent fix.
**Exact Claude Code prompt:**
> In `app/(tabs)/tax.tsx`, change the `workTotal` calculation. Instead of filtering on `t.clientId !== 5`, find each transaction's client by `clients.find(c => c.id === t.clientId)` and exclude those where `client?.name === 'Personal'`. Use the `clients` array from the store. Do not change styles. One file only.

---

## Phase 3: Core Product Loop Improvements

These features directly improve the main tradesperson workflow. They require more thought and testing than Phase 1/2 but make the app substantially more useful.

**Dependencies:**
- 3.1 requires 2.1 (empty state)
- 3.4 should be done AFTER 3.3 (don't mix async and navigation work in the same file in one session)
- 3.5 is independent

### 3.1 Needs Attention → Explore Flow Polish
**Current state:** Works. The full flow from Needs Attention → Explore → Client Detail → Fix → Return works.
**What to improve:** After fixing the last item in a filter (e.g., last flagged transaction), the user returns to an empty explore filter list. The empty state (2.1 above) handles this.
**No additional code needed once 2.1 is shipped.**
**Future enhancement (after Phase 2):** Make the "All clear" empty state animate in with a subtle success indicator. This is low-effort but high emotional impact.

### 3.2 Card Used Shown in Transaction Detail View
**Why:** If a user selects a card when adding a transaction, there's no way to see which card was used when viewing the transaction detail later (the card field is not displayed).
**Files:** `app/client-detail.tsx` (detail sheet render section)
**Risk:** LOW
**Tradeoff:** Adding the card display requires finding the card from `cards` array using `selectedTx?.cardId`. If the card was deleted, show nothing (graceful).
**Step one:** In the detail sheet view mode, add a line showing the card label if `selectedTx?.cardId` is set.
**Exact Claude Code prompt:**
> In `app/client-detail.tsx`, in the transaction detail sheet view mode (not edit mode), add a display row showing the card used if `selectedTx?.cardId` is set. Find the card from `store.cards` using `selectedTx.cardId`. Show the card's `label` field. Only show this row if a card was selected. Match existing detail row styles. Do not change edit mode. One file only.

### 3.3 Date Backdating for Transactions
**Why:** Tradespeople don't always log receipts the same day. They need to log "this was from yesterday" or "this was last Tuesday."
**Currently:** Date is always set to today's date on add.
**Files:** `app/client-detail.tsx` (add transaction form)
**Risk:** MEDIUM (touches the add transaction form — test carefully)
**Tradeoff:** The simplest implementation adds a date text input with the current date pre-filled. A date picker is better UX but requires a library or platform date picker integration.
**Step one:** Add a simple date picker or text input for date to the add transaction form.
**WARNING:** Do NOT implement this until the date format decision (Finding 22) is made. If you add date backdating with the current string format ("Apr 14"), there is still no year. At minimum, the backdated date should include a year.

### 3.4 Android Back Button for Modals
**Why:** Standard Android behavior. Pressing back while adding a transaction should close the sheet, not exit the screen.
**Files:** `app/client-detail.tsx` (highest priority), then `app/(tabs)/index.tsx`
**Risk:** MEDIUM
**Tradeoff:** BackHandler must handle which modal is "top." The priority order matters: if both the tag modal AND the add sheet are open (which shouldn't happen, but guard against it), closing the tag modal should take priority.
**Step one:** Add `BackHandler` for the add transaction sheet in `client-detail.tsx` only.
**Exact Claude Code prompt (client-detail only):**
> In `app/client-detail.tsx`, add a `useEffect` that registers a `BackHandler.addEventListener('hardwareBackPress', ...)` listener. When hardware back is pressed, if `showAddSheet` is true, call `setShowAddSheet(false)` and return true (to prevent default navigation). If `showTagModal` is true, close it instead. If `showReceiptViewer` is true, close it. If none are open, return false (allow default navigation). Import `BackHandler` from `react-native`. Remove the listener in the cleanup function. One file only.

---

## Phase 4: Later Power Features

Features that make Uncrumple more powerful but aren't needed for the core loop. Plan these carefully — they require more thought than earlier phases.

### 4.1 Transaction Date Filtering in Tax View
**Why:** As users accumulate 2+ years of data, the tax view becomes a dump. Need year filtering.
**Risk:** HIGH (requires date format migration — see Finding 22)
**Hold until:** Date format is changed to include year. Do not build year filtering on top of year-less dates — it will require throwing everything away.
**Minimum viable version:** Show a year selector in the tax header. Filter `transactions` by year using the stored date. If dates have no year, show a warning: "Some transactions don't have a year and may appear in wrong periods."

### 4.2 Duplicate Transaction Detection
**Why:** Tradespeople sometimes log the same transaction twice (same merchant + amount + same day).
**Risk:** MEDIUM
**Approach:** In `addTransaction`, check if a transaction with same merchant (case-insensitive) + same amount + same date already exists, and show a warning alert before saving.
**Exact Claude Code prompt:**
> In `store.tsx`, in the `addTransaction` function, before saving the new transaction, check if an existing transaction has the same `merchant` (case-insensitive), same `amount`, and same `date` as the new one AND belongs to the same `clientId`. If a match exists, do NOT block the save — instead return the match's ID alongside the save, so the screen can show a duplicate alert. Do not change any other logic. One file only.
*Note: This prompt needs a second step in client-detail.tsx to show the alert when a duplicate is detected.*

### 4.3 Invoice PDF Generation
**Why:** The invoice flow is useful but produces no actual document to send to clients.
**Risk:** HIGH (requires a PDF library or server)
**Hold until:** Basic PDF library options are evaluated (expo-print is the lowest-friction option for Expo).
**Tradeoff:** expo-print uses HTML → PDF via WebView. It works on both platforms. APK size increase is moderate. The output quality depends on the HTML template. This is achievable without a backend.

### 4.4 Notification Listener for Bank Notifications
**Why:** Lets the app capture transactions as they happen from bank SMS/push.
**Risk:** VERY HIGH (Android accessibility services, Play Store review issues)
**Hold until post-launch.**
**Tradeoff:** The benefit is real (users don't have to manually enter every transaction). The cost is Play Store policy risk — accessibility services are scrutinized. Many apps have been removed for this. Only pursue after launch traction is established.

### 4.5 Bulk Edit Tags
**Why:** "Add tag to all selected transactions" would be useful in multi-select mode.
**Risk:** MEDIUM
**Requires:** Multi-select mode in client-detail already exists — add a "Tag All" option to the multi-bar.
**Tradeoff:** The tag modal needs to work for multi-transaction selection (currently only works for single). This requires a new code path in the tag modal logic.

### 4.6 "Save & Add Another" in Add Transaction Sheet
**Why:** Bulk entry requires closing and reopening the sheet every time.
**Risk:** LOW
**Approach:** After successful save, instead of closing the sheet, clear the form fields and leave the sheet open, with a subtle confirmation indicator ("Saved! Add another or tap Cancel to close").
**Tradeoff:** Users doing one-off adds might find the persistence confusing. Make "close after save" the default via a toggle or use the button label to communicate intent clearly.

---

## Phase 5: Risky Features to Delay

Do not build these yet. Each has a specific reason for the delay.

| Feature | Risk | Reason to delay |
|---|---|---|
| Year-based tax filtering | HIGH | Requires date model migration — would break existing saved data |
| PDF export | HIGH | Requires third-party library, APK size increases |
| Notification listener | VERY HIGH | Play Store policy risk, requires accessibility service permissions |
| Home screen widgets | HIGH | Requires Expo config plugins, complex build setup |
| AI transaction suggestions | VERY HIGH | No data to train on, needs post-launch user data |
| Multi-user/sync | VERY HIGH | Requires backend — fundamentally changes architecture |
| iCloud/Google Drive backup | HIGH | Requires Expo config plugins and platform-specific code |
| Mileage tracking | MEDIUM | Requires GPS permissions, complex UX — separate product decision |
| Split purchase | MEDIUM | Complex data model change, rare use case |

---

## Recommended Sprint Order

**Sprint 1 (this week):** 1.1, 1.2, 1.3, 1.4, 1.5 — 5 bug fixes, ~1 session each, app ready for real use

**Sprint 2:** 2.1, 2.2, 2.3 — empty states and navigation safety (explore, home, return nav)

**Sprint 3:** 2.4, 2.5, 2.6 — consistency fixes (receipt display, merchant dedup, tag search)

**Sprint 4:** 2.7, 3.2 — tax accuracy + card display (two separate files, two separate sessions)

**Sprint 5:** 3.3 — date backdating (requires date format decision first — see Finding 22)

**Sprint 6:** 3.4 — Android back button handling (client-detail first, then index.tsx)

**Sprint 7:** 4.2, 4.6 — duplicate detection + save-and-add-another

**Sprint 8+:** 4.1, 4.3, 4.5 — power features (each requires its own planning session)

---

## What To Do Right Now (Zero Setup Required)

If you want to make a measurable improvement in the next 10 minutes, do Sprint 1 in order:

1. Fix the hardcoded header (1.1) — 1 file, 1 line change
2. Add coming-soon alerts to export buttons (1.2) — 1 file, 2 lines
3. Fix `fmt()` number coercion (1.4) — 1 file, 4-5 line changes
4. Fix async receipt safety (1.5) — 1 file, 2 line additions

Items 1.3 (blank screen fallback) requires more careful JSX, so save it for when you have a few minutes to verify the styles match.

---

## Cross-Cutting Concerns (Address Across All Phases)

These aren't features — they're practices to maintain throughout all development:

- **One file per session.** Touching multiple files in one Claude Code session multiplies the risk of cross-file conflicts.
- **Read before writing.** Always paste the current file content to Claude.ai for review before asking Claude Code to patch it.
- **Test after every change.** Especially in `client-detail.tsx` (1043 lines, 23 state variables) — a broken change here breaks the primary screen.
- **Never combine a refactor with a feature.** If you're adding BackHandler, don't also clean up the modal state management. Do one thing. Test. Then do the next thing.
- **Preserve styles.** The design is intentional. No style changes unless explicitly requested.
- **No TypeScript.** No type annotations, no interface declarations, no generics.

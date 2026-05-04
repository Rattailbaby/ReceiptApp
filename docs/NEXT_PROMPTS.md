# NEXT_PROMPTS.md
# Next 10 Safest Claude Code Prompts for Uncrumple

Each prompt touches one file only, is minimal, includes constraints, and includes test instructions.
Listed in recommended order (safest and highest-impact first).

---

## Prompt 1: Fix Hardcoded Month Header

**File:** `app/(tabs)/index.tsx`
**Risk:** ZERO
**Why first:** Every user sees this. Dead giveaway the app isn't maintained.

**Prompt:**
```
In app/(tabs)/index.tsx, find the Text component that displays the hardcoded string 'APRIL 2025' in the header.
Replace the string with a dynamic expression:
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()

Do not change any styles.
Do not refactor.
Do not change any other code.
One file only. Minimal patch.

Test:
1. Run the app — header should show the current month and year
2. The format should match what was there before (all caps, same area)
```

---

## Prompt 2: Export Buttons Show Coming Soon Alert

**File:** `app/(tabs)/tax.tsx`
**Risk:** ZERO
**Why second:** Users tapping silent buttons assume the app is broken.

**Prompt:**
```
In app/(tabs)/tax.tsx, find the two TouchableOpacity export buttons: "Export CSV" and "Export PDF Report".
Add an onPress prop to each that calls:
  Alert.alert('Coming soon', 'Export will be available in a future update.')

Alert is already used elsewhere in the project — import it from 'react-native' if not already imported.
Do not change any styles.
Do not change any other code.
One file only. Minimal patch.

Test:
1. Open the Tax tab
2. Tap "Export CSV" — alert appears with "Coming soon" title
3. Tap "Export PDF Report" — same alert appears
```

---

## Prompt 3: Fix Blank Screen When Client Not Found

**File:** `app/client-detail.tsx`
**Risk:** LOW
**Why third:** Users can get permanently stuck with no way to navigate back.

**Prompt:**
```
In app/client-detail.tsx, find this line:
  if (!client) return null;

Replace it with a fallback render. The fallback should:
- Wrap in SafeAreaView using the existing s.root style
- Show a back button at the top using router.back() with the existing s.backBtn and s.back styles
- Show a centered message "Client not found." in a muted color (#444)

Do not change any other logic.
Do not change any styles or add new style definitions for the message text — use inline style: { color: '#444', textAlign: 'center', marginTop: 40, fontSize: 14 }
One file only. Minimal patch.

Test:
1. Navigate to /client-detail?id=99999 (a nonexistent client)
2. Should see "Client not found." with a back button
3. Tapping back should return to previous screen
4. Normal client navigation should work exactly as before
```

---

## Prompt 4: Fix `fmt()` Number Safety in Tax Screen

**File:** `app/(tabs)/tax.tsx`
**Risk:** LOW
**Why fourth:** Prevents a silent crash if any transaction has a string amount.

**Prompt:**
```
In app/(tabs)/tax.tsx, make two changes:

1. Change the fmt function from:
     const fmt = (n) => '$' + n.toFixed(2);
   to:
     const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

2. In the totalLogged reduce call, change:
     yearTxs.reduce((s, t) => s + t.amount, 0)
   to:
     yearTxs.reduce((s, t) => s + (Number(t.amount) || 0), 0)

3. Same fix for the totalWithReceipts reduce: change s + t.amount to s + (Number(t.amount) || 0)

4. Same fix in the byClient map's total reduce.

Do not change any styles.
Do not change any other logic.
One file only. Minimal patch.

Test:
1. Open the Tax tab — all dollar values should still display correctly
2. No crashes or NaN values
```

---

## Prompt 5: Capture txId Before Async in addReceiptToTx

**File:** `app/client-detail.tsx`
**Risk:** LOW
**Why fifth:** Prevents potential crash when user taps backdrop while camera is loading.

**Prompt:**
```
In app/client-detail.tsx, find the addReceiptToTx async function.
At the very beginning of the function body, before any other code, add:
  const txId = selectedTx?.id;
  if (!txId) return;

Then find every place inside that function that uses selectedTx.id and replace it with txId.
Do not change any other functions.
Do not change styles.
One file only. Minimal patch.

Test:
1. Open a transaction that has no receipt
2. Tap "Add Receipt"
3. Take a photo — receipt should attach to the correct transaction
4. No crash if you quickly tap the overlay while camera is opening
```

---

## Prompt 6: Empty State in Explore When Filter Has Zero Results

**File:** `app/(tabs)/explore.tsx`
**Risk:** ZERO
**Why sixth:** After fixing flagged/missing/untagged items, users see nothing — no feedback that they're done.

**Prompt:**
```
In app/(tabs)/explore.tsx, after the results.map(...) block but before the bottom spacer View, add a new block:

Show a centered message when ALL of these are true:
- filter is set (filter is not null/undefined/empty)
- results.length === 0
- query.length <= 1

The message should say: "All clear — nothing to review here."
Use the existing s.empty style.

Do not change any other logic.
Do not add new styles.
One file only. Minimal patch.

Test:
1. Navigate from Needs Attention to a filter that has items — results appear
2. Navigate from Needs Attention to a filter that has NO items (or clear all items) — "All clear" message appears
3. Without a filter, searching and getting no results still shows "No results for [query]"
```

---

## Prompt 7: Fix Return Navigation After Edit with Invalid Filter

**File:** `app/client-detail.tsx`
**Risk:** LOW
**Why seventh:** Prevents navigation to `/explore?filter=undefined`.

**Prompt:**
```
In app/client-detail.tsx, find all instances of:
  router.replace('/explore?filter=' + returnFilter)

There are two or three of these (in saveTxEdit, in addReceiptToTx, and the flagged mark-reviewed handler).

For each one, wrap the condition check so it only navigates when returnFilter is one of ['flagged', 'missing', 'untagged']:

Change the condition from:
  if (source === 'explore' && returnFilter) {
    router.replace('/explore?filter=' + returnFilter);
  }

to:
  if (source === 'explore' && ['flagged', 'missing', 'untagged'].includes(String(returnFilter))) {
    router.replace('/explore?filter=' + returnFilter);
  }

Do not change any styles.
Do not change any other logic.
One file only. Minimal patch.

Test:
1. Navigate to a flagged transaction from Needs Attention
2. Mark it reviewed — should return to the flagged explore list
3. Navigate to client-detail directly (no source param) — marking reviewed should NOT navigate anywhere
```

---

## Prompt 8: Receipt Dot Uses receiptUri Not receipt Flag

**File:** `app/client-detail.tsx`
**Risk:** LOW
**Why eighth:** Eliminates false green dots on transactions with no actual photo.

**Prompt:**
```
In app/client-detail.tsx, in the pending transaction list row render, find the line that conditionally renders receiptDot vs noReceiptDot. It currently reads:
  style={tx.receipt ? s.receiptDot : s.noReceiptDot}

Change it to:
  style={!!tx.receiptUri ? s.receiptDot : s.noReceiptDot}

Do not change any other logic.
Do not change styles.
One file only. Minimal patch.

Test:
1. Open a client with seed data transactions — they should show hollow dots (no URI)
2. Add a transaction with a receipt photo — should show green dot
3. Remove the receipt photo — should show hollow dot
```

---

## Prompt 9: Empty State When No Clients on Home Screen

**File:** `app/(tabs)/index.tsx`
**Risk:** ZERO
**Why ninth:** New users see a blank screen — the empty state guides them toward the first action.

**Prompt:**
```
In app/(tabs)/index.tsx, after the tileView conditional block (after all client rows render), add an empty state that appears when safeClients.length === 0.

The empty state should show a single centered text inside a View with marginHorizontal: 16 and marginTop: 8:
  "No clients yet — tap + Add to get started."

Style the text with: { color: '#444', fontSize: 13, textAlign: 'center', lineHeight: 22 }

Do not change any other logic.
Do not add new named style definitions.
One file only. Minimal patch.

Test:
1. Delete all clients from the list — empty state message appears
2. Add a client — empty state disappears, client appears
3. Normal client rendering is unchanged
```

---

## Prompt 10: Add Card Used Display in Transaction Detail Sheet

**File:** `app/client-detail.tsx`
**Risk:** LOW
**Why tenth:** Transactions track which card was used but never show it in the detail view — wasted feature.

**Prompt:**
```
In app/client-detail.tsx, in the transaction detail sheet (the !isEditing section), find the area after detailDate and before the flagged/Mark Reviewed button.

Add a block that shows the card used if selectedTx.cardId is set:
- Find the card from the cards array: cards.find(c => c.id === selectedTx.cardId)
- If found, show: "Card: [card.label]"
- Style the text with: { color: '#888', fontSize: 12, marginBottom: 8 }
- Only render this block when a card is found

Do not change any other logic.
Do not add new named style definitions.
One file only. Minimal patch.

Test:
1. Add a transaction with a card selected
2. Open that transaction's detail sheet — card name should appear below the date
3. Open a transaction without a card — card line should not appear
4. The rest of the detail sheet should be unchanged
```

---

## Usage Notes

- Run each prompt in a clean `/clear` session
- Test each change before moving to the next prompt
- If a prompt produces unexpected changes, revert and paste the result back into Claude.ai for review before trying again
- Never combine two prompts into one session

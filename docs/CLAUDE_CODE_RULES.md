# CLAUDE_CODE_RULES.md
# Strict Working Rules for Claude Code Sessions on Uncrumple

---

## Core Constraints (Always Active)

These rules apply to every single Claude Code prompt for this project, no exceptions.

1. **One file per prompt.** Never touch more than one file in a single Claude Code session.
2. **Minimal patch only.** Change only what the task requires. Do not clean up surrounding code.
3. **No refactoring.** Do not restructure, rename, or reorganize code unless the task specifically asks for it.
4. **No TypeScript annotations.** This codebase uses plain JavaScript in `.tsx` files. Never add `: string`, `<T>`, `React.FC`, `: void`, or any other TypeScript syntax.
5. **No style changes unless asked.** Do not touch `StyleSheet.create` blocks, spacing, colors, or layout unless the task is explicitly about styles.
6. **No store changes unless the task requires it.** `store.tsx` is the most dangerous file. Never modify it as a side effect of another task.
7. **No new files unless the task requires one.** Do not create utility files, helpers, or constants files as a side effect.
8. **No adding imports unless needed.** Only add an import if you actually use it in the patch.
9. **No converting React patterns.** Do not convert class components to function components, useCallback for useEffect, etc.
10. **Test after each step.** Each prompt should produce a testable change. Do not chain multiple steps in one prompt.

---

## How to Handle Null Client Crashes

If you see: `"Cannot read property 'name' of null"` — the issue is almost always a `selectedClient` access.

**Pattern to follow:**
```js
// BEFORE any handler that uses selectedClient:
if (!selectedClient?.id || !selectedClient?.name) return;

// OK to use selectedClient BEFORE any await:
const clientId = selectedClient.id;
const clientName = selectedClient.name;

// After any await, use the captured values, NOT selectedClient:
editClient(clientId, clientName);
```

**Files where this matters:** `app/(tabs)/index.tsx` handlers: `handleEdit`, `handleSaveEdit`, `handleDelete`, `handleColorChange`, `handleChangePhoto`.

**Do NOT:** Touch `store.tsx` to fix a null client crash. The crash is always in the screen file, not the store.

---

## How to Handle `selectedTx` Safely

`selectedTx` is a React state variable in `app/client-detail.tsx`. It can become null while async operations are in progress (e.g., while the camera is open).

**Always capture before any await:**
```js
const handleReceiptAction = async () => {
  const txId = selectedTx?.id;   // capture FIRST
  if (!txId) return;             // guard immediately
  
  await someAsyncOperation();     // now safe
  
  editTransaction(txId, { ... }); // use txId, not selectedTx.id
};
```

**Never do:**
```js
const handleReceiptAction = async () => {
  await someAsyncOperation();
  editTransaction(selectedTx.id, { ... }); // DANGEROUS — selectedTx may be null
};
```

---

## How to Handle Async ImagePicker Flows

ImagePicker operations are always two async calls: permission request + launch.

**Template:**
```js
const doPhotoAction = async () => {
  const capturedId = relevantState?.id;  // capture needed values
  if (!capturedId) return;               // guard immediately
  
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission needed', 'Camera permission is required.');
    return;
  }
  
  const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
  if (!result.canceled && result.assets[0]) {
    const uri = result.assets[0].uri;
    // use capturedId here, NOT any state variable
    editTransaction?.(capturedId, { receipt: true, receiptUri: uri });
  }
};
```

**Key rules:**
- Capture `id` and any other state values BEFORE the first await
- Always check `!result.canceled && result.assets[0]` before accessing assets
- Always check `result.assets[0]` — do not assume it exists
- The `?` optional chain on store functions (`editTransaction?.`) prevents crashes if store isn't ready

---

## How to Handle Route Params Safely

Route params from `useLocalSearchParams()` are ALWAYS strings (or undefined).

**For numeric IDs:**
```js
const { id } = useLocalSearchParams();
const client = clients.find(c => c.id === Number(id));  // cast to Number
```

**For string params that might be undefined:**
```js
const { source, returnFilter } = useLocalSearchParams();
// Always check before using:
if (source === 'explore' && returnFilter && ['flagged', 'missing', 'untagged'].includes(String(returnFilter))) {
  router.replace('/explore?filter=' + returnFilter);
}
```

**For params used to open modals on mount:**
```js
useEffect(() => {
  if (addTx === '1') setShowAddSheet(true);
  // Use string comparison for string params
}, []);
// Always use empty dependency array for mount-only effects
```

---

## How to Write Safe Prompts

### A good Claude Code prompt includes:
1. **Exact file path** (e.g., `app/client-detail.tsx`)
2. **Exact function or area** to change (e.g., `addReceiptToTx function`)
3. **What to change** (specific, not vague)
4. **What NOT to change** (explicit constraints)
5. **Test instructions** (what to check after the change)

### Template:
```
In [file], find [specific thing]. Change it to [specific change].
Do not change styles.
Do not refactor.
Do not change other functions.
One file only.
Minimal patch.

Test: [what to check]
```

### Bad prompts (avoid these):
- "Fix the receipt handling" — too vague
- "Update the transaction flow to be better" — too broad
- "Clean up the code while you're at it" — always leads to unintended changes
- "Fix this bug and also add the empty state" — two tasks in one prompt

---

## When to Stop and Ask

Stop and paste the code into planning chat (Claude.ai) before proceeding when:

1. The task requires changing **more than one file**
2. The task involves **changing data models** (adding/removing fields from transactions, clients, etc.)
3. The task involves **changing AsyncStorage keys** (this can break existing saves)
4. There's a bug in the app but **the exact file and line isn't clear**
5. The task involves **navigation changes** (route params, new routes, back behavior)
6. The fix involves **changing the store.tsx** function signatures
7. A Claude Code session produces an error and **the error source isn't obvious**
8. You see `Cannot read property X of null` on the **home screen** (index.tsx) — this may be a hot reload artifact, verify it reproduces first

---

## File Risk Levels

| File | Risk | Notes |
|---|---|---|
| `store.tsx` | VERY HIGH | Changes here affect every screen. One typo breaks the app. Never patch as a side effect. |
| `app/client-detail.tsx` | HIGH | Largest file, many interdependent state variables. Test every modal after changes. |
| `app/(tabs)/index.tsx` | HIGH | The main screen. Breaking this makes the app unusable. |
| `app/(tabs)/explore.tsx` | MEDIUM | Receives route params — test with and without filter param. |
| `app/(tabs)/tax.tsx` | MEDIUM | Math-heavy. Test all calculations after changes. |
| `app/rules.tsx` | MEDIUM | Multiple modals, complex form state. Test all three sections (Rules, Tags, Cards). |
| `app/settings.tsx` | LOW | Only one toggle. Hard to break. |
| `constants.ts` | LOW | One line. Changes affect all screens. |
| `app/_layout.tsx` | HIGH | Breaks entire app if layout stack is wrong. |
| `app/(tabs)/_layout.tsx` | MEDIUM | Breaks tab navigation if wrong. |

---

## Test Instructions for Each Change Type

### After changing a client list handler (index.tsx):
1. Long press a client — menu appears
2. Tap Edit Name — modal opens with current name
3. Change name — tap Save — name updates
4. Long press again — tap Change Color — color updates
5. Long press again — tap Delete — confirmation fires — client removed
6. Test with last client remaining (edge case)

### After changing transaction add flow (client-detail.tsx):
1. Open a client — tap "+ Add Transaction"
2. Enter merchant only, try to save — should show "Missing info" alert
3. Enter merchant + amount, no receipt no note — should show note warning
4. Enter merchant + amount + note — should save cleanly
5. Enter merchant + amount + take photo — should save with photo visible

### After changing the explore screen:
1. Open Search tab — should show first 10 transactions
2. Navigate from Needs Attention → flagged → should show only flagged
3. Type a search query — should filter within flagged
4. Clear query — should show all flagged again
5. Tap a result — should open client-detail with that transaction's sheet

### After changing store.tsx:
1. Force-close the app
2. Reopen — all data should persist
3. Add a transaction — should appear in list
4. Delete a transaction — should be gone after force-close
5. Check the tax screen — totals should be correct

---

## Common Mistakes to Avoid

- **Adding `useState` calls after conditional returns** — React hooks must be called before any `return` statement
- **Adding `if (!loaded) return null` BEFORE `useState` hooks** — hooks must all come first
- **Reading `selectedClient` or `selectedTx` after an await without capturing first**
- **Changing `INITIAL_TRANSACTIONS` or `INITIAL_CLIENTS` in store.tsx** — this only affects first-time installs; existing users won't see the change
- **Using `t.receipt` when you mean `!!t.receiptUri`** — they are different things
- **Using `clientId !== 5` to exclude Personal** — use name comparison instead
- **Hardcoding colors** — always use `ACCENT` from `@/constants` for the amber color

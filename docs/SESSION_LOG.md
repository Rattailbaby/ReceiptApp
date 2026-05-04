# SESSION LOG

## 2026-04-30 — CLAUDE.md gains SYSTEM FILES LOCATION section before End of file.

- In `CLAUDE.md`, appended a new `## SYSTEM FILES LOCATION` section directly above the existing `End of file.` marker. Lists each file in `docs/system/` with a one-line purpose, restates the read-full / no-compress / no-remove handling rules, and re-states the rule-files-vs-safe-files split (the same split now lives in LOCKED_ATTRIBUTES section 28).
- The DOC CLEANUP COMMAND block above and `End of file.` line below are unchanged. Nothing else in CLAUDE.md was rephrased, reordered, or removed.

## 2026-04-30 — HANDOFF_GENERATOR opening line made AI-assistant-agnostic

- In `docs/system/HANDOFF_GENERATOR.md` line 7, replaced `Your ONLY job is to generate a complete handoff JSON for the next ChatGPT chat.` with `Your ONLY job is to generate a complete handoff JSON for the next AI assistant session.` Wording no longer assumes the next session is specifically ChatGPT — Claude.ai or any other planner can consume the same artifact.
- Single-line change. Nothing else in the file touched.

## 2026-04-30 — HANDOFF_GENERATOR JSON schema gains file_updates_needed block

- In `docs/system/HANDOFF_GENERATOR.md`, inside the STRICT JSON SCHEMA (around line 155), added a new top-level `file_updates_needed` object after `execution_rule`. The previous trailing-quote-only line on `execution_rule` now ends with a comma so the JSON stays valid.
- New object holds six empty arrays: `locked_attributes`, `handoff_receiver`, `handoff_generator`, `claude_md`, `roadmap`, `session_log`. These are the slots a generated handoff fills with pending file-update prompts owed to the next session.
- Indentation matches the surrounding 2-space JSON. Closing `}` of the schema remained where it was; nothing else above or below was reordered or rewritten.

## 2026-04-30 — HANDOFF_RECEIVER SOC rule now points to ROADMAP.md prompt instead of paste-ready text

- In `docs/system/HANDOFF_RECEIVER.md`, inside `## SOC AND ROADMAP RULES (LOCKED)`, replaced the line `→ provide paste-ready roadmap text` with `→ output a Claude Code prompt to update docs/system/ROADMAP.md`. The trailing `→ return to current task` line is unchanged.
- Aligns the receiver's SOC-handling step with section 28's project-file workflow rule — roadmap captures now go through a Claude Code prompt against the project file, not loose paste-ready text.
- No other lines, sections, or wording in the file were touched. The earlier `→ return to current task` at line 185 (separate section) was not affected.

## 2026-04-30 — LOCKED_ATTRIBUTES section 28 expanded with prompt templates

- In `docs/system/LOCKED_ATTRIBUTES.md`, replaced section `## 28. PROJECT-FILE WORKFLOW RULE` only. Sections 1–27, the trailing `---` separator, the closing code fence, the `## CANDIDATE ATTRIBUTES` block, and all rules below the fence (CLEAR DECISION RULE through SESSION HANDOFF PRINCIPLE) were untouched.
- Section 28 still opens with the same workflow rule and the same Rule files / Safe files lists. Two new copyable templates added inside the section: a Claude Code update prompt template (for `.md` files, including the `## Incoming / Unsorted` fallback) and a JSON updates template (for `CURRENT_HANDOFF.json` field-only edits). Trailing "Every file update prompt must include" checklist preserved verbatim.
- One-line wording change inside the section: opening sentence "System files live in the project under docs/system/ not in a notes app." is now on a single line instead of wrapped across two. No other rules in the file were rephrased, reordered, or removed.

## 2026-04-30 — Search → tap transaction → Close now returns to Search instead of stranding on client page

- Bug: opening a transaction from plain Search (no main filter active) and closing it left the user on the underlying client-detail page instead of returning to Search. Filtered Explore flows worked correctly because they passed `source=explore&returnFilter=...` in the push URL — plain Search did not.
- Two coordinated edits, one file each:
  - `app/(tabs)/explore.tsx`: transaction row `router.push` now always includes `&source=explore&returnFilter=${filters.needsAttention || ''}&extra=${extraFilters.join(',')}&match=${matchMode}` — replaced the `filters.needsAttention ? ... : ''` ternary. `returnFilter` is empty string when no main filter is active.
  - `app/client-detail.tsx`: `closeTxDetail` guard relaxed from `if (source === 'explore' && returnFilter)` to `if (source === 'explore')`. Now triggers `router.replace(exploreReturnUrl)` even when `returnFilter` is empty. The constructed URL is `/explore?filter=&extra=&match=` — Explore reads empty `filter` as null and shows the unfiltered list.
- Deliberately did NOT change the four other occurrences of `source === 'explore' && returnFilter` at lines ~297, 318, 794, 1061. Those gate cleanup-action redirects (Mark Reviewed, save-after-edit auto-return when the cleanup condition resolves) — they correctly require a `returnFilter` to know which filtered list to bounce back to. Plain Search has no cleanup semantics, so those paths staying stricter than `closeTxDetail` is intentional.
- Side benefit: Search-with-only-extra-tag-filters now also returns correctly. Same root-cause path.

## 2026-04-30 — Tag modal disambiguates Search vs Create; prevents accidental Save during creation

- In `app/client-detail.tsx`, tag modal now shifts into an explicit "Create Tag" mode when the user has typed text and no tag matches (`noMatch === true`). Three coordinated changes drive this off the existing `noMatch` flag — no new state.
- Header `<Text style={s.sheetLabel}>` switched from static `TAGS` to `noMatch ? 'Create Tag' : 'Tags'`. The label now answers "what am I doing here?" instead of just naming the modal.
- TextInput placeholder updated from `Search tags…` → `Search or create tags…` so the dual-purpose nature of the input is visible before the user types anything.
- Bottom primary button is now dual-mode. Label: `noMatch ? 'Create Tag' : 'Save'`. onPress: when `noMatch` is true, calls `handleCreateTag()` and `return`s — modal stays open, no transaction save fires, no `setShowTagModal(false)`. When `noMatch` is false, existing Save flow runs unchanged (editTransaction, setSelectedTx, explore/returnFilter redirect, modal close).
- After creating, `handleCreateTag` already clears `tagSearch`, which flips `noMatch` back to `false` — header returns to "Tags", button returns to "Save", and the previously-fixed `keyboardShouldPersistTaps="handled"` keeps the keyboard up so the user can keep typing more tags.
- No layout change, no selection change, no creation-logic change. The `+ "tagname"` create chip inside the ScrollView still works unchanged — the new bottom-button create path is just a second, harder-to-miss entry point that also prevents the Save misfire.

## 2026-04-30 — Full Tags modal sorts alphabetically; quick dropdown still usage-based

- In `app/(tabs)/explore.tsx`, added `alphabeticalTags = [...tags].sort((a, b) => a.name.localeCompare(b.name))` next to the existing `topTags`.
- Full "More Tags" modal `.map` switched from `sortedTagsByUsage` to `alphabeticalTags` — easier to scan when browsing the full list.
- `sortedTagsByUsage` and `topTags` left untouched. Quick dropdown still surfaces the 8 most-used tags (usage-descending, alphabetical tiebreak from the prior patch).
- Two-line change. No selection, filtering, chip rendering, or navigation changes. The earlier `b.count - a.count → count + alphabetical` tiebreak from the previous patch is preserved on the usage path even though the modal no longer reads it; that path still feeds the dropdown.

## 2026-04-30 — Tag modal keeps keyboard open when creating/toggling tags

- In `app/client-detail.tsx`, added `keyboardShouldPersistTaps="handled"` to the tag modal's `ScrollView` (the one wrapping the tag chip grid and the `+ "newtag"` create chip).
- Root cause: the create chip lives inside the ScrollView while the search `TextInput` lives outside it. RN's default `keyboardShouldPersistTaps="never"` treats any tap inside the ScrollView while focus is on a sibling input as "tap outside the input" — it dismisses the keyboard *before* firing the chip's `onPress`. So the tag was being created correctly, but the user lost the keyboard and had to re-tap the input to keep typing.
- `"handled"` tells the ScrollView to skip the dismiss when a child has a tap handler. Both existing tag chips and the `+ create` chip have `TouchableOpacity` handlers, so taps on them now keep the keyboard up. Tapping bare ScrollView area still dismisses (sane fallback).
- The earlier `tagSearchRef.current?.focus()` line at the end of `handleCreateTag` is left in as a belt-and-suspenders safety net — harmless once the dismiss is suppressed.
- No logic, handler, or layout changes. One prop added on one ScrollView. Nothing else touched.

## 2026-04-30 — "More tags" splits into quick dropdown + full modal browser

- In `app/(tabs)/explore.tsx`, dropdown tag submenu now always renders only `topTags` (the 8 most-used) plus the "More tags" button. Removed the `showAllTags ? sortedTagsByUsage : topTags` conditional and the alternate "Done" branch from the dropdown — it never expands inline anymore.
- "More tags" onPress now closes the dropdown (`setShowFilterPicker(false)`, `setShowTagSubmenu(false)`) and opens a new bottom-sheet `Modal` (`setShowAllTags(true)`).
- `Modal` added at the bottom of the component: `transparent`, `animationType="slide"`, `onRequestClose={() => setShowAllTags(false)}`. Backdrop is a full-screen `TouchableOpacity` over `rgba(0,0,0,0.5)` that closes on tap. Sheet anchors to bottom (`maxHeight: '80%'`, rounded top corners, `#141418` body, `#2a2a34` border).
- Modal content: `TAGS` heading, then a `ScrollView` containing a `flexWrap: 'wrap'` chip grid built from `sortedTagsByUsage`. Chips reuse the exact tag toggle logic from the dropdown — `tagFilter = tag:${tag.id}`, `isSelected` from `extraFilters.includes`, same `router.replace` URL with preserved `filter`/`extra`/`match`. Selected chips get a colored border + tinted background + `✓`.
- Bottom "Done" button calls `setShowAllTags(false)` only — modal closes, URL/extras unchanged. Tapping a chip toggles instantly via the existing `router.replace` flow without closing the modal.
- Added `Modal` to the existing `react-native` import. No store, no filtering logic, no other files touched.

## 2026-04-29 — Top filter row made responsive; Sort dropdown clamped on screen

- In `app/(tabs)/explore.tsx`, fixed top filter row overflow on narrow phones. Main filter chip (left, `flex: 1` wrapper) now truncates instead of overflowing into the right-side controls.
- Filter chip `TouchableOpacity` (line ~170 inline style) gained `maxWidth: '100%'` and `flexShrink: 1`. Inner `Text` gained `flexShrink: 1` so `numberOfLines={1}` + `ellipsizeMode="tail"` actually trigger when label is long (e.g. "Flagged for Review").
- Right-side group (`+` and Sort wrapped together with `flexDirection: 'row', gap: 8`) gained `marginRight: 12` to nudge the pair inward off the screen edge. `+` and Sort still move as one — no separate margin hacks.
- Sort dropdown positioning now clamps left edge: `dropdownWidth = 200`, `clampedLeft = Math.min(Math.max(16, x), screenWidth - dropdownWidth - 16)`. Mirrors the existing clamp pattern on the `+` dropdown. Sort menu no longer runs off the right edge.
- No changes to filter logic, URL params, dropdown contents, or other files.

## 2026-04-29 — Clear moved off top filter row onto Match toggle row

- In `app/(tabs)/explore.tsx`, removed the Clear `TouchableOpacity` from `s.filterLabelRow`. Top row now holds only the main filter chip, `+` button, and Sort chip — no longer crowded.
- Existing match-toggle conditional restructured into a wrapping `flexDirection: 'row'` View that renders whenever any filter is active (`filters.needsAttention || extraFilters.length > 0`), with `paddingHorizontal: 16, marginTop: 8`. The match toggle inside still renders only when total filters ≥ 2.
- Clear button always renders inside this row when filters are active, with `marginLeft: 'auto'` pushing it to the far right. When only 1 filter is active, Clear appears alone on the right of its own row; when 2+ are active, Match toggle sits on the left, Clear on the right.
- Text changed from `× Clear` to `Clear` per spec. Behavior unchanged — `router.replace('/explore')` still drops filter, extra, and match.
- Match toggle's removed `alignSelf: 'center'` and `marginTop: 8` (the wrapper owns those concerns now).

## 2026-04-29 — Sort control added (id-based for newest/oldest, amount-based for high/low)

- In `app/(tabs)/explore.tsx`, added a Sort chip in the filter row between `+` and Clear. Label reads `Sort: Newest / Oldest / High / Low ▾` driven by `sortMode` state (default `'newest'`). Pill style mirrors the main filter chip — neutral `#555` border, `#d1d5db` text.
- New state: `sortMode`, `showSortPicker`, `sortPosition`. New ref: `sortChipRef`. Sort chip onPress measures itself and opens a separate dropdown anchored beneath it (200px wide, same `#141418` body, same `+ 48` vertical offset pattern as the filter dropdown).
- Sort dropdown options: Newest / Oldest / Amount high / Amount low. Active option uses the same amber tint + 3px left bar treatment as the NA dropdown rows. Tapping an option calls `setSortMode` and closes the picker. No URL change — sort is local state for now.
- `sortedResults = [...results].sort(...)` computed after `results`. `'newest'` and `'oldest'` sort by `id` (Date.now()-based, reliable proxy for chronological order). `'amount_high'` and `'amount_low'` sort by `Number(amount) || 0`. Deliberately NOT sorting by `transaction.date` because that field is a display string like `"Apr 14"` and would mis-sort.
- Row rendering switched from `results.map` to `sortedResults.map`. Empty-state checks still use `results.length` (length is identical so no behavior diff).
- Cross-dropdown safety: filter chip and `+` button onPress now also call `setShowSortPicker(false)`; sort chip onPress closes filter and tag submenu. Two pickers cannot be open at once.
- No store, filtering, URL, or other-file changes.

## 2026-04-29 — Main filter selection preserves extras and match mode

- In `app/(tabs)/explore.tsx`, when a main filter is picked from the chip-opened dropdown (not the `+` flow), the URL is now rebuilt as `/explore?filter=${f}&extra=${extraFilters.join(',')}&match=${matchMode}` instead of `/explore?filter=${f}` alone. Extras and match mode survive a main-filter switch.
- The `openedFromAdd` path was already preserving extras — only the chip-driven main-filter branch was wiping them.
- No filtering, dropdown, or routing-pattern changes beyond this URL rebuild.

## 2026-04-29 — Main filter chip gets inline × to drop just the main filter

- In `app/(tabs)/explore.tsx`, the main filter chip now shows an inline × on the right side when `filters.needsAttention` is active. Tapping × calls `router.replace('/explore?extra=${extraFilters.join(',')}&match=${matchMode}')` — drops only the `filter` URL param, preserves extras and matchMode.
- Outer chip's `style` extended with `flexDirection: 'row'` and `alignItems: 'center'` so the label and × lay out horizontally.
- × is a nested `TouchableOpacity` inside the chip's outer `TouchableOpacity`. RN's gesture responder gives the inner press priority — tapping × removes the filter without also opening the dropdown. Hitslop `{ top: 10, bottom: 10, left: 10, right: 10 }` and `paddingLeft: 8` match the existing extra-filter chip × pattern. Glyph color uses `mainFilterColor` so it matches the chip's category color.
- Outer chip's onPress (opens dropdown), `filterChipRef`, and `mainFilterColor` logic unchanged. Clear button still appears alongside when any filter is active.

## 2026-04-29 — Tag submenu shows selection state; Clear button covers all filter types

**`app/(tabs)/explore.tsx` — selected state in tag submenu:**
- Tag rows now show selected state. Per-row computes `tagFilter`, `isSelected = extraFilters.includes(tagFilter)`, and `tagColor = tag.color || '#666'`.
- Selected style: `borderColor: tagColor`, `backgroundColor: tagColor + '14'` (RN-supported 8-digit hex alpha ≈ 8% opacity), text color switches from `#d1d5db` to `tagColor`. `✓` appended after the name with `marginLeft: 'auto'` to right-align.
- Unselected rows keep `borderWidth: 1` with `borderColor: 'transparent'` to prevent layout shift between states. Background `transparent`, text `#d1d5db`.
- Toggle logic unchanged — reuses precomputed `isSelected`.

**`app/(tabs)/explore.tsx` — Clear button shows for any active filter:**
- Condition swapped from `activeFilterLabel` (only main filter) to `(filters.needsAttention || extraFilters.length > 0)`. Clear now appears when only tags/extras are set, only main filter is set, or both. Hides only when nothing is active.
- `onPress` still routes to `/explore` (drops all URL params), unchanged.

## 2026-04-29 — Tag submenu multi-select + main chip colored by filter type

Three coordinated UX patches in `app/(tabs)/explore.tsx`.

**Tag press toggles add/remove:**
- Tag rows in the submenu now toggle: if `tag:${id}` is already in `extraFilters`, remove it; otherwise add. Built `updated` array via includes check, then `router.replace` with the rebuilt URL. No-toggle behavior replaced — re-tapping a selected tag now removes it.

**Main filter chip color matches active filter type:**
- Added `mainFilterColor` helper next to `activeFilterLabel`: `flagged → '#ff6b6b'`, `missing → '#22c55e'`, `untagged → '#60a5fa'`, otherwise `'#d1d5db'`.
- Chip `borderColor` now uses `mainFilterColor` (was hardcoded `#555`). Chip text color overridden via inline `color: mainFilterColor` to win over the amber `s.filterLabel` style. Default "Filters" chip renders neutral light-gray; active filter chip renders in its category color.

**Tag submenu now multi-select:**
- Tag press no longer closes the picker. Dropdown and tag list stay open so the user can toggle multiple tags in one pass.
- Added a `Done` row at the bottom of the tag submenu fragment (preceded by a 1px `#2a2a34` divider). `onPress` closes the dropdown and resets `showTagSubmenu(false)`. Amber text (`#f59e0b`) signals it as the close action.
- Outside-tap backdrop now resets `showTagSubmenu(false)` alongside `setShowFilterPicker(false)`.
- Both the main chip onPress and the `+` button onPress now call `setShowTagSubmenu(false)` inside their `measureInWindow` callbacks before `setShowFilterPicker(true)`. Reopening the picker always lands on the main filter list, never on the previous tag submenu state.
- No new Android `BackHandler` added — existing handler is for `source === 'tax'` only and unrelated to the picker.
- No filter logic, chip rendering, matchMode, or routing changes.

## 2026-04-29 — Tag filtering live via `tag:<id>` keys in extraFilters

- In `app/(tabs)/explore.tsx`, tag rows in the submenu now add real filters. On press: builds `const tagFilter = 'tag:' + tag.id`, returns early if already in `extraFilters`, otherwise closes the picker and `router.replace`s with `[...extraFilters, tagFilter]` joined into the URL (same pattern as NA additions). No toggle behavior — re-tapping a selected tag is a no-op.
- Extended the predicate (in both `matchMode === 'all'` and `'any'` branches via replace_all) with `if (f.startsWith('tag:')) { const id = Number(f.split(':')[1]); return (t.tagIds || []).includes(id); }`. Match All applies tag filter against `filteredByParam`; Match Any unions main + extras including tag IDs.
- Chip rendering detects `f.startsWith('tag:')`: looks up `tagObj` from `tags`, uses `tagObj.color` for border + text, transparent background. Label renders `tagObj.name`, falls back to raw key if tag was deleted. NA chip colors and 0.08-alpha backgrounds unchanged.
- Existing chip × removes via `router.replace` works for tag keys without modification (operates on opaque strings by index). Round-trip via URL works because `tag:<id>` strings serialize cleanly through the same `extra=` param.
- No store, routing, dropdown positioning, or matchMode logic changes.

## 2026-04-29 — Tag submenu wired into filter dropdown (no filtering yet)

- In `app/(tabs)/explore.tsx`, derived `const tags = Array.isArray(store?.tags) ? store.tags : [];` next to the existing `transactions`/`clients` derivations. No store change required — `tags` was already exposed via context.
- Added local state `const [showTagSubmenu, setShowTagSubmenu] = useState(false);`. Tapping the existing `Tags ›` placeholder row in the filter dropdown now sets it to `true` (short-circuits before the `Alert.alert('Coming soon')`). Client and Merchant rows still show the alert.
- Wrapped the existing dropdown contents (Add filter hint, NEEDS ATTENTION header, NA rows, divider, placeholder rows) in `{!showTagSubmenu && (<>...</>)}`. When `showTagSubmenu === true`, dropdown swaps to a `‹ Back` row (resets the submenu) followed by one row per tag — small color dot using `tag.color`, name, `console.log(tag.id)` on press.
- Tag press is logging-only — extraFilters and predicate logic untouched. Real `tag:<id>` filtering comes in the next patch.
- Submenu state does not auto-reset when the dropdown closes; reopening the picker resumes the submenu. Acceptable for now; can be reset later if it becomes confusing.

## 2026-04-29 — Filter state survives round-trip via URL params

Three coordinated patches to make extra filters and match mode persist across screen navigation.

**`app/(tabs)/explore.tsx` — URL-driven `extraFilters` and `matchMode`:**
- `useLocalSearchParams` extended: `{ filter, source, extra, match }`. Removed `useState` for `extraFilters` and `matchMode`. Both are now derived per render: `extraFilters = extra ? extra.split(',') : []` and `matchMode = match === 'any' ? 'any' : 'all'`.
- Three mutation sites now `router.replace` with the full URL rebuilt: chip × remove, dropdown add (when `openedFromAdd`), and Match toggle. Each rebuild sanitizes the main filter via `filters.needsAttention || ''` so invalid URL values are dropped on round-trip.
- Consequence: tab switches, screen re-mounts, and any `router.replace` back into Search now preserve full filter state. Empty params (`&extra=&match=`) are accepted by the parser and cosmetically ignorable.

**`app/client-detail.tsx` — return paths echo `extra` and `match`:**
- `useLocalSearchParams` extended with `extra, match`. Added top-level helper `const exploreReturnUrl = '/explore?filter=${returnFilter}&extra=${extra ?? \'\'}&match=${match ?? \'\'}'`.
- All 5 `router.replace('/explore?filter=' + returnFilter)` call sites swapped to `router.replace(exploreReturnUrl)`: closeTxDetail (Done), Save edits, Add Receipt success, Mark Reviewed, Save Tags. Three conditional UI blocks that read `returnFilter` for inline cleanup buttons (filtered by `'flagged' | 'untagged' | 'missing'`) untouched.
- HIGH RISK file per CLAUDE.md — change is mechanical (string-literal swap) but every modal that reaches a return path needs manual verification.

**`app/(tabs)/explore.tsx` — row navigation forwards extra and match:**
- Updated `router.push` for transaction rows: appended `&extra=${extraFilters.join(',')}&match=${matchMode}` inside the existing `filters.needsAttention ? ... : ''` conditional. Extras only forward when the main filter is active (current `source=explore` gate). Extras-only round-trip (no main filter) still loses state — would require changing the `source=explore` gate in client-detail's checks, deferred.

## 2026-04-28 — Match Any now unions main filter + extras (bug fix)

- In `app/(tabs)/explore.tsx`, fixed Match Any so it actually expands results. Previously, `finalResults` always started from `filteredByParam` (already narrowed by the main URL filter), so `.some(predicate)` on extras only further narrowed within that subset — Match Any was effectively identical to Match All.
- Split the derivation into two branches:
  - `matchMode === 'all'`: unchanged — `finalResults = filteredByParam`, then `.every` against `extraFilters`.
  - `else` (`'any'`): build `activeFilters = [...(filters.needsAttention ? [filters.needsAttention] : []), ...extraFilters]`, then `safeTransactions.filter(t => activeFilters.some(predicate))`. Main filter is now on the OR side of the union. Defensive fallback to `safeTransactions` when no filters (unreachable since toggle requires totalFilters ≥ 2).
- Predicate body unchanged (`flagged === true`, `!receiptUri`, `!tagIds || tagIds.length === 0`). No state, routing, URL, or other-file changes.
- Verified case: main = `missing`, extras = `[flagged]`, mode = `any` → returns transactions that are missing OR flagged (was previously returning the intersection).

## 2026-04-28 — Match toggle + filter dropdown hides already-active items

- In `app/(tabs)/explore.tsx`, added `matchMode` state (`'all'` | `'any'`, default `'all'`). The `extraFilters` filtering logic now branches: `matchMode === 'all' ? extraFilters.every(predicate) : extraFilters.some(predicate)`. Predicate body unchanged.
- Match control rendered only when `(filters.needsAttention ? 1 : 0) + extraFilters.length >= 2`. Final UI is a single centered pill (`alignSelf: 'center'`, `borderRadius: 999`, border `#444`, `paddingVertical: 6`, `paddingHorizontal: 14`, `marginTop: 8`). Text reads `Match: All` or `Match: Any` in amber `#f59e0b`. Tap toggles between modes via `setMatchMode(prev => prev === 'all' ? 'any' : 'all')`. (Intermediate two-segment control was replaced.)
- When the dropdown is opened via the `+` button (`openedFromAdd === true`), the option list is filtered: rows are excluded when `filters.needsAttention === f` or `extraFilters.includes(f)` — so already-active filters don't appear as duplicates. Chip-opened dropdown still shows all three rows so the active-row highlight works.
- Routing, dropdown positioning, chip layout untouched.

## 2026-04-28 — Extra filters now apply to results (AND logic)

- In `app/(tabs)/explore.tsx`, added a `finalResults` derivation immediately after `filteredByParam`. Defaults to `filteredByParam`; when `extraFilters.length > 0`, runs `finalResults.filter(t => extraFilters.every(...))` against the three NA predicates (`flagged === true`, `!receiptUri`, `!tagIds || tagIds.length === 0`). Unknown filter keys pass through (`return true`).
- Swapped `filteredByParam` → `finalResults` in both branches of `results` (the query-active branch and the filter-active branch).
- Updated the no-query condition from `filters.needsAttention ? ... : safeTransactions` to `filters.needsAttention || extraFilters.length > 0 ? ... : safeTransactions` so extra filters take effect even without a main filter set.
- Removing a chip mutates `extraFilters` state, which re-runs the derivation and updates results immediately. Routing, dropdown, and main filter logic untouched.

## 2026-04-28 — Extra filter chips colored by filter type, larger X tap target

- In `app/(tabs)/explore.tsx`, each extra filter chip now derives its color from the filter key: `flagged` → `#ff6b6b`, `missing` → `#22c55e`, `untagged` → `#60a5fa`. Unknown values fall back to `#888` / transparent.
- `borderColor`, label `color`, and `×` text `color` use the per-chip `chipColor`. Chip `backgroundColor` uses a 0.08 alpha tint of the same color (`rgba(255,107,107,0.08)`, `rgba(34,197,94,0.08)`, `rgba(96,165,250,0.08)`).
- `×` `TouchableOpacity` now has `hitSlop: { top: 10, bottom: 10, left: 10, right: 10 }` and `paddingLeft: 8`. Visual `×` glyph size unchanged; tap target much larger.
- Filter logic, dropdown, main filter chip, and routing untouched.

## 2026-04-28 — Extra filters render as removable chips below main row (UI only)

- In `app/(tabs)/explore.tsx`, added local state `const [extraFilters, setExtraFilters] = useState([]);`. Holds filter keys (`'flagged' | 'missing' | 'untagged'`) selected via the `+` flow.
- Dropdown's NA option onPress now branches on `openedFromAdd`: when `true`, appends the chosen filter to `extraFilters` (no `router.replace`); when `false`, existing chip behavior calls `router.replace('/explore?filter=' + f)`. Main chip, URL-driven needsAttention filter, and routing all unchanged.
- Replaced the empty placeholder container below `s.filterLabelRow` with `{extraFilters.length > 0 && ...}`. Each extra filter renders as a pill (`borderColor: '#888'`, `borderRadius: 999`) showing `filterLabels[f] ?? f` plus a `×` `TouchableOpacity` that splices the chip out via `setExtraFilters(prev => prev.filter((_, idx) => idx !== i))`.
- No actual filtering applied to results yet — chips are purely UI scaffolding for the next step. Duplicate prevention not implemented.

## 2026-04-28 — "+" button anchors and centers its own dropdown

- In `app/(tabs)/explore.tsx`, added `const plusButtonRef = useRef(null);` and attached it to the `+` button's `TouchableOpacity`. The `+` button's onPress now measures `plusButtonRef` instead of `filterChipRef`, so the dropdown opens under the `+` button rather than under the chip.
- Horizontally centered the dropdown beneath the `+` button: `left: x + (width / 2) - (dropdownWidth / 2)`, with `dropdownWidth = 230` defined inline to match the dropdown container's hardcoded width. Vertical offset (`y + height + 48`) unchanged.
- Main chip onPress still uses `filterChipRef` and `left: x` — chip-anchored dropdown positioning untouched.
- `openedFromAdd` flag continues to drive the "Add filter" hint text. No filter logic, dropdown contents, state structure, or unrelated styles changed.

## 2026-04-28 — "+" opens dropdown + multi-filter row scaffolding

- In `app/(tabs)/explore.tsx`, the `+` button next to the filter chip now opens the existing dropdown (replaces the prior `Alert.alert('Coming soon')` placeholder). It calls `filterChipRef.current?.measureInWindow(...)` with the same `top: y + height + 48` math so position stays anchored to the chip — no duplicate dropdown.
- New `openedFromAdd` state distinguishes the entry point. Chip onPress sets it `false`; `+` onPress sets it `true`. When the dropdown is opened via `+`, a small "Add filter" hint label renders at the top of the dropdown (color `#888`, fontSize 12, no bold). Hint is hidden when the dropdown is opened by tapping the chip.
- Added an empty second-row container under `s.filterLabelRow`: `flexDirection: 'row'`, `flexWrap: 'wrap'`, `marginTop: 8`. Currently holds only a comment placeholder `{/* future added filters */}` — no chips rendered yet. Reserves layout for stacked filter chips when multi-filter logic lands.
- No filter logic, multi-filter logic, dropdown contents, or routing changes.

## 2026-04-28 — "+" button beside filter chip (placeholder)

- In `app/(tabs)/explore.tsx`, added a 28×28 circular `+` button immediately to the right of the filter chip, inside the existing `s.filterLabelRow`. `marginLeft: 10` for spacing. Border `#555` matches the chip border tone. Centered `+` glyph.
- onPress shows `Alert.alert('Coming soon')` — no real filtering logic yet. `Alert` was already imported.
- Renders for both states (`Filters ▾` default and active-filter chip). Existing chip onPress/ref/dropdown behavior untouched. The `× Clear` button still aligns to the far right via its existing `marginLeft: 'auto'` so the new `+` button slots between chip and Clear without breaking layout.

## 2026-04-28 — Filter dropdown offset and chip polish

- In `app/(tabs)/explore.tsx`, increased the filter dropdown's vertical offset so it no longer overlaps the chip. The `measureInWindow` callback now sets `top: y + height + 48` (was `+ 4`). Iterated 4 → 10 → 18 → 48 to clear the overlap.
- Likely root cause is a SafeAreaView coordinate-space mismatch: `measureInWindow` returns absolute window coords, but the dropdown's `position: 'absolute'` is inside `<SafeAreaView style={s.root}>`, which on Android offsets its children below the status bar. The 48px offset compensates empirically. Real fix is to either render the dropdown as a root-level Modal or subtract the safe-area top inset — flagged for a future, separate patch.
- Also polished the chip: border softened from `#444` → `#555`, and the dropdown arrow now flips between `▾` (closed) and `▴` (open) using the existing `showFilterPicker` state. `activeOpacity={0.7}` was already on the chip.
- No filter logic, dropdown contents, Clear button, or routing changes.

## 2026-04-28 — Search filter row always visible with "Filters ▾" default

- In `app/(tabs)/explore.tsx`, the main filter row (`s.filterLabelRow`) is now always rendered. Previously it was wrapped in `{activeFilterLabel && (...)}` so unfiltered Search had no entry point to open the dropdown.
- Chip text now resolves via `{activeFilterLabel || 'Filters'} ▾`. With no filter active, the chip reads `Filters ▾` and tapping it opens the existing dropdown via the same `filterChipRef.current?.measureInWindow(...)` flow.
- `× Clear` button moved inside an inner `{activeFilterLabel && (...)}` guard so it only appears when a filter is active.
- Chip style, dropdown, routing, and filter logic unchanged.

## 2026-04-28 — Filter placeholder rows show Coming soon alert

- In `app/(tabs)/explore.tsx`, the Tags / Client / Merchant placeholder rows in the filter dropdown now show a real `Alert.alert('Coming soon', '<Label> filter will let you narrow transactions by <label>.')` on press instead of a console log.
- Added `Alert` to the existing `react-native` import. Layout, filter logic, and routing unchanged.

## 2026-04-28 — Filter dropdown sectioned for future categories

- In `app/(tabs)/explore.tsx`, restructured the filter picker into sections. Added a `NEEDS ATTENTION` header above the existing flagged/missing/untagged rows. Existing NA rows, active-row highlight, and routing untouched.
- Below NA, added a 1px `#2a2a34` divider with `marginVertical: 4`.
- Added three placeholder rows (`Tags ›`, `Client ›`, `Merchant ›`) at the bottom of the picker. Each just calls `console.log(label + ' filter coming soon')` on press — no real logic, no state, no router change yet.
- Section header style: color `#666`, fontSize 11, fontWeight 600, letterSpacing 0.5, paddingHorizontal 8, paddingVertical 4.
- Picker positioning, width (230), and dropdown-position math unchanged. NA filter behavior unchanged.

## 2026-04-28 — Search filter reshaped into structured object

- In `app/(tabs)/explore.tsx`, derived a structured `filters` object from the existing URL `filter` param: `{ needsAttention: (filter === 'flagged' || 'missing' || 'untagged') ? filter : null }`. URL param remains the source of truth — no new state, no routing change.
- Replaced all downstream usages: `filterLabels[filter]`, `filter === 'flagged'/'missing'/'untagged'`, `filter ? ... : ...`, and the dropdown's `isActive` check now reference `filters.needsAttention`.
- `router.replace('/explore?filter=' + f)`, the Clear button, deep links from `index.tsx` and `tax.tsx`, and the `returnFilter` round-trip from `client-detail.tsx` all still work via the URL param.
- Prep for future filters (date, merchant, tag) without changing current behavior. No UI, dropdown, chip, or routing changes.

## 2026-04-28 — Search filter dropdown active row softened

- In `app/(tabs)/explore.tsx`, lightened the active filter row in the dropdown. Background changed from solid `#241805` to `rgba(245,158,11,0.08)`. Left accent bar kept (3px `#f59e0b`).
- Inactive option text dimmed from amber to `#d1d5db`. Active text stays `#f59e0b`. Font size 14, weight 600 unchanged.
- Filter logic, dropdown position, chip styling, and option order untouched.

## 2026-04-28 — Search filter dropdown wired up

- In `app/(tabs)/explore.tsx`, the filter chip now opens a real dropdown of the three filter options (Flagged for Review, Missing Receipts, Untagged). Selecting one calls `router.replace('/explore?filter=' + f)`. Chip styling, Clear button, and filter logic unchanged.
- Position is anchored to the chip via `filterChipRef.current?.measureInWindow((x, y, width, height) => …)`, stored in `dropdownPosition` state (`top: y + height + 4`, `left: x`). Earlier attempt using `onLayout`'s local layout opened the picker above the chip — replaced with absolute screen measurement.
- New imports: `useRef` from `react`. New state: `showFilterPicker`, `dropdownPosition`. New ref: `filterChipRef` on the chip TouchableOpacity.
- Picker container: `position: 'absolute'`, width 230, `backgroundColor: '#141418'`, `padding: 6`, `borderRadius: 12`, `borderColor: '#2a2a34'`, `zIndex: 20`. Full-screen transparent dismiss layer behind it at `zIndex: 10`. Renders only when `showFilterPicker && dropdownPosition`.
- Active filter row gets a subtle highlight: `backgroundColor: '#241805'` and a 3px amber (`#f59e0b`) left border via `borderLeftWidth`. Inactive rows transparent. No checkmark, no "current" text, label position unchanged. Option rows: `paddingVertical: 7`, `paddingHorizontal: 8`, `borderRadius: 8`, amber text (`#f59e0b`, size 14, weight 600).

## 2026-04-28 — Active filter chip in Search

- In `app/(tabs)/explore.tsx`, evolved the `Showing: …` label into an interactive pill-shaped chip placed beside the existing × Clear button.
- Tapping the chip is stubbed to `console.log('open filter menu')` for now (real dropdown comes later). Clear button still calls `router.replace('/explore')` and was not touched.
- Chip style (inline on the TouchableOpacity): pill `borderRadius: 999`, no fill, `borderColor: '#444'` border, `paddingVertical: 6`, `paddingHorizontal: 14`, `marginLeft: 16`. Text keeps the existing amber color from `s.filterLabel`, font size bumped to 13, internal padding zeroed inline. A `▾` dropdown arrow is appended to the label.
- `filterLabels` strings now drop the `Showing: ` prefix — the chip renders just the filter name (`Flagged for Review`, `Missing Receipts`, `Untagged`).
- StyleSheet block in this file unchanged.

## 2026-04-28 — Search default cap removed

- In `app/(tabs)/explore.tsx`, removed the `safeTransactions.slice(0, 10)` cap that limited the default unfiltered Search view to 10 rows. Default Search now lists every transaction.
- Filter, query, row rendering, and navigation logic unchanged.

## 2026-04-28 — Search clear-filter button

- In `app/(tabs)/explore.tsx`, added a `× Clear` button beside the active filter label. Tapping it calls `router.replace('/explore')` to drop the filter param and return Search to unfiltered mode without leaving the tab.
- New styles: `filterLabelRow`, `filterClearBtn`, `filterClearText`. Existing `filterLabel` style untouched. `router` and `TouchableOpacity` were already in scope.

## 2026-04-28 — Transaction detail bottom button: Close → Done

- In `app/client-detail.tsx`, changed the bottom button label in the transaction detail sheet from `Close` to `Done`. `onPress` (closeTxDetail), styles, and layout unchanged.

## 2026-04-28 — Flagged badge wording: "Needs review"

- In `app/client-detail.tsx`, changed the flagged badge text from `⚑ Flagged for review` to `⚑ Needs review`. Styles, placement, and render condition unchanged.

## 2026-04-28 — Flagged badge wording experiment reverted

- Briefly changed the flagged badge text in `app/client-detail.tsx` from `⚑ Flagged for review` to `⚑ 1 issue`, then reverted back to `⚑ Flagged for review`. Net change: none.
- Note for future: the `1 issue` wording was rejected. Keep the explicit `Flagged for review` label.

## 2026-04-28 — Flagged badge style polish

- In `app/client-detail.tsx`, bumped `flaggedBadge` and `flaggedBadgeText` for stronger contrast and readability: deeper red background (`#3a1014`), more visible border (`#ff6b6b99`), larger padding (`4 / 10`), `borderRadius: 8`, font size 13, and `letterSpacing: 0.3`.
- Placement and render condition unchanged.

## 2026-04-28 — Flagged dot in Search rows

- In `app/(tabs)/explore.tsx`, added a red `flaggedDot` next to the existing tag and receipt dots in transaction rows. Only renders when `tx.flagged === true`.
- New `flaggedDot` style added next to the other dot styles (`width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6b6b'`).
- No filter, navigation, or layout changes.

## 2026-04-28 — Flagged visibility in client list and detail

- In `app/client-detail.tsx`, per-client transaction list rows now render a red `flaggedIndicatorDot` after the tag and receipt dots when `tx.flagged === true`.
- Transaction detail view: removed the inline `• ⚑ Flagged` substring from the metadata row and added a dedicated `flaggedBadge` chip (`⚑ Flagged for review`, red on dark-red background) between the date and metadata row, only when flagged.
- New styles: `flaggedIndicatorDot`, `flaggedBadge`, `flaggedBadgeText`. No cleanup logic, Mark Reviewed, navigation, or other files touched.

## 2026-04-27 — Merchant suggestions contained scroll

- In `app/client-detail.tsx`, capped the merchant suggestions container at `maxHeight: 160` and wrapped the rows in a nested `ScrollView` with `keyboardShouldPersistTaps="handled"` and `nestedScrollEnabled`.
- Suggestions now scroll internally instead of pushing the rest of the Add Transaction form down. Selection still closes the dropdown and dismisses the keyboard.
- No styles file, sheet layout, or other JSX touched.

## 2026-04-27 — Merchant autocomplete dismissal

- In `app/client-detail.tsx`, the merchant suggestion `onPress` now also calls `Keyboard.dismiss()` after setting the merchant and clearing suggestions.
- Added `onBlur={() => setMerchantSuggestions([])}` to the merchant `TextInput` so leaving the field closes the dropdown.
- `Keyboard` was already imported. No styles, ScrollView config, or other handlers changed.

## 2026-04-27 — Flagged cleanup block: receipt-first ordering and parity

- In `app/client-detail.tsx`, reordered the flagged cleanup helper buttons so Add Receipt sits above Add Tags.
- While `selectedTx?.flagged === true`, both buttons render as plain `btnGhost` at full opacity when both issues exist — Add Tags no longer looks less transparent than Add Receipt.
- Once flagged is cleared in-session: Add Receipt promotes to `btnPrimary` first if receipt is missing; Add Tags only promotes when receipt is already present. When both are still missing post-Mark-Reviewed, Add Receipt is primary and Add Tags is secondary at opacity 0.6.
- Resolved-issue 0.3 dimming preserved on both buttons. Mark Reviewed block, Untagged block, Missing block, `txNeedsCleanup`, `addReceiptToTx`, tag-modal save, and styles unchanged.

## 2026-04-27 — Mark Reviewed return uses returnFilter

- In `app/client-detail.tsx`, the Mark Reviewed handler's `router.replace` now uses `'/explore?filter=' + returnFilter` instead of the hardcoded `'/explore?filter=flagged'`.
- Branch still gated on `returnFilter === 'flagged'`, so behavior is identical. Brings the flagged return path in line with the other cleanup handlers (closeTxDetail, saveTxEdit, addReceiptToTx, tag-modal Save).
- No logic, styles, or other handlers touched.

## 2026-04-27 — Cleanup flow + clone button stable state

Stable-state summary after recent cleanup-flow work:

- Clone Transaction button moved to the top action area of the transaction detail sheet (next to the trash icon).
- Clone copies now get visible labels: first clone is `Merchant Copy`, subsequent clones are `Merchant Copy 2`, `Merchant Copy 3`, etc. `__test_clone__` marker still in the note.
- Cleanup return behavior works correctly from both Untagged and Missing Receipts flows. Closing the transaction sheet returns to the filtered Explore list when opened from a cleanup source.
- Cleanup action highlighting works based on source: Add Tags is primary in Untagged flow, Add Receipt is primary in Missing Receipts flow. When both issues exist, both buttons show; resolved issues drop to ghost styling.
- Tag and receipt status indicators (blue tag dot + green receipt dot) now show in the client transaction list and in the Explore/Needs Attention filtered lists.
- Add/Edit transaction sheet is back to a stable working layout after reverting the broken sticky-footer experiments. Save and Cancel are inside the ScrollView. Sheet uses `maxHeight:'95%'` plus a `Dimensions`-based `minHeight` floor so it opens to a usable height.

## 2026-04-27 — Transaction detail header polish

- Added client context to the transaction detail header beside `TRANSACTION` (e.g., `TRANSACTION   Savita`). Subtle `#888` / fontSize 12, truncates if long.
- Removed the lower `Client: [name]` line under the date.
- Clone button remains in the top action area next to the trash icon — not moved.
- No transaction logic, receipt logic, tag logic, or cleanup behavior changed.

## 2026-04-27 — Cleanup action button visual polish

- Cleanup action buttons now visually distinguish three states: primary (amber filled), secondary (ghost + muted, opacity 0.6), and resolved (ghost + muted, opacity 0.3 — stays visible).
- Existing cleanup logic and smart-return behavior unchanged.
- Button order and onPress handlers unchanged.

## 2026-04-27 — Tag status indicator in transaction detail

- Added `Tags added` / `No tags` status line near the top metadata section of the transaction detail view (just below the date).
- Lets the user see tag presence at a glance without scanning the UI.
- No changes to tag logic, cleanup logic, or button behavior. Existing tag list (when tags exist) untouched.

## 2026-04-27 — Compact transaction status row

- Replaced the separate Tags/Receipt status lines and the lower receiptStatusRow with a single compact status row in the top metadata area.
- Format: `Tags added • Receipt attached`, with ` • ⚑ Flagged` appended only when the transaction is flagged.
- Status text colors match the app's existing dot indicators: tags blue (`#60a5fa`), receipt green (`#22c55e`), flagged red (`#ff6b6b`). Missing/empty states stay subtle gray (`#888`).
- No tag, receipt, or flag logic changed. Mark Reviewed and other action buttons untouched.

## Workflow rules

- Log only after the user confirms the patch worked with "y" or "yes".
- If the user moves on to a new feature without saying y, assume the previous patch worked and log it.
- Do not log failed patches, unclear patches, no-op patches, or untested patches.
- Each successful change should have one clear entry.
- Do not duplicate entries.
- Keep logs concise but specific enough to identify:
  - file changed
  - behavior changed
  - nearby behavior not touched

## Known future work

- Save / floating footer idea is saved for later — not active now. Multiple attempts caused regressions (sheet collapse, clunky keyboard behavior). Do not retry without a real bug to fix.
- Batch Cleanup / Cowork-style automation saved for later.
- Do not touch sheet layout again unless a real bug appears.
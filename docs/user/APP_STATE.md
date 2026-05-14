# APP STATE

**Purpose:** Current implementation state of the Uncrumple app — what's built, what works, what's in the user's hands today. Distinct from `WHAT_EXISTS.md` (ARIA / system layer inventory) and `CURRENT_HANDOFF.json` (machine-readable continuity state).

**Last updated:** 2026-05-14 (content migrated from CLAUDE.md to differentiate execution rules from feature inventory)

**When to read this:** When you want to know what the app actually does right now. When deciding whether something is a new feature or a polish/bugfix. When a session resumes and you need to remember the current capability surface before planning next moves.

**When NOT to read this:** Looking for execution rules (see CLAUDE.md). Looking for future features (see `docs/system/ROADMAP.md`). Looking for active bugs (see `docs/system/KNOWN_ISSUES.md`).

---

## What's Built and Working

### Client Management
- Clients list: add, edit name, delete, change color via long press menu
- Client multi-select delete on home screen
- Tile view and list view toggle on clients screen
- Client thumbnail photo (falls back to initials and color avatar)
- Client detail shows "Client not found." fallback with back button instead of blank screen

### Transaction Management
- Client detail screen with pending and invoiced transaction sections
- Invoice flow: mark pending transactions as invoiced with label and date
- Add transaction: merchant, amount, note, receipt photo, tags, card used
- Merchant autocomplete — saves past merchants and suggests as you type
- Tag picker: top 8 most used tags shown, plus button opens full modal with search and create
- Edit transaction: same fields including tags
- Long press transaction: enters multi-select mode with checkboxes
- Multi-select: Select All, Delete Selected with confirm, Move to Client, auto-exits after action
- Delete transaction: trash icon top-right of detail sheet with confirmation
- Note warning: alert when saving a transaction with no receipt and no note
- Card used displays in transaction detail sheet when cardId is set

### Receipt Handling
- Receipt photo capture and thumbnail display
- Tap thumbnail: opens full screen receipt viewer with close button
- Add Receipt button on transactions without a photo
- Replace Receipt button when receipt exists — retakes and overwrites
- Remove Receipt button when receipt exists — clears photo and receiptUri
- receiptUri is treated as the real source of truth for receipt existence

### Cleanup Flow System
- Needs Attention section on home screen: flagged, missing receipts, untagged counts — hidden when all clean
- Tapping a Needs Attention row navigates to Explore with the correct filter applied
- Explore reads filter param and shows only matching transactions
- Explore shows contextual empty states
- Tapping a transaction in Explore navigates to client-detail with that transaction auto-opened
- Quick action buttons appear in transaction detail when opened from a cleanup filter
- Inline secondary cleanup actions working
- Smart return behavior: one issue → fix → return, multiple issues → fix first → stay → fix last → return
- Mark Reviewed button appears on flagged transactions
- After adding receipt from Missing Receipts flow → returns to list when resolved
- After editing from any filtered flow → returns to that filtered list when resolved
- Delete from filtered list returns to filtered list

### Rules and Automation
- Rules screen: IF/THEN condition builder
- Rules engine runs on every new transaction and applies all matching rules automatically
- Add Rule button in transaction detail opens rules screen with merchant pre-filled

### Tags and Cards
- Tags system: create, edit, delete, preset tags, color dots
- Cards system: create, edit, delete cards with strategy label

### Search and Explore Tab
- Searches across merchant, client name, and note fields
- Reads filter param from URL and shows filtered results
- Handles source=explore and source=tax params for correct back navigation
- Shows empty states when filter returns no results

### Tax Tab
- Dynamic current month and year header
- User-adjustable tax bracket
- Yearly summary with total logged, estimated tax savings, and by-client breakdown
- Amount formatting uses Number() coercion — safe against string amounts
- Export buttons show "Coming soon" alert
- Missing Receipts card navigates to Explore filtered to missing receipts

### Navigation and UX
- Back button has 44px tap target minimum
- Android modal back closes sheets correctly in client-detail using onRequestClose
- Floating + button on home screen → client picker → Add Transaction
- ACCENT constant used everywhere — amber color never hardcoded

### Storage and State
- Persistent storage: all data survives force close
- selectedClient handlers in index.tsx are all null-safe
- Simulate transaction button removed
- Settings screen: round number gas detection toggle

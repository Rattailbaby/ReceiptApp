# ANTI_PATTERNS.md

Purpose:
Things that have caused real problems and must not be tried again.
Each entry includes what happened and why it failed.
Never delete entries — they are permanent warnings.

Format:
[DATE] — Anti-pattern name
What was tried: 
What broke:
Never do this because:

---

## Anti-Patterns

[2026-05-06] — flex:1 on ScrollView inside modal sheet
What was tried: Adding flex:1 to ScrollView to make footer stick
What broke: Android Yoga collapsed ScrollView to 0px height, 
  sheet appeared to collapse entirely
Never do this because: flex:1 requires bounded parent height. 
  Modal sheets with only min/max constraints are not bounded. 
  Use flexShrink:1 instead.

[2026-05-06] — Multi-file batched prompts to Claude Code
What was tried: Asking Code to touch store.tsx, settings.tsx, 
  and index.tsx in one prompt
What broke: Cross-file conflicts, app crash, hours lost
Never do this because: One file at a time is non-negotiable. 
  Each file change must be tested before the next.

[2026-05-06] — Compressing or rewriting system files during cleanup
What was tried: Asking AI to clean up LOCKED_ATTRIBUTES or ROADMAP
What broke: Reasoning and context stripped, meaning lost
Never do this because: Wording IS behavior. Compression destroys 
  the WHY behind rules.

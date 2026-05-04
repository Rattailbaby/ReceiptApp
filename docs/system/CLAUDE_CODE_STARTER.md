Read CLAUDE.md and follow it strictly.

We are continuing the same project.

CORE CONSTRAINTS
- One file at a time
- Minimal patch only
- Do not refactor
- Do not rewrite files
- Do not touch unrelated files
- Inspect before patch when unclear
- Stop if logic or file ownership is unclear

PATCH TRACKING RULE
- If I say "y" → patch succeeded, log it
- If I move to a new feature → assume previous patch worked, log it
- If I retry a similar fix → treat previous attempt as failed, do not log
- Only log successful patches
- No duplicate entries
- Keep logs concise

COPYABLE OUTPUT RULE
- Use clean copyable blocks
- Do not mix explanation inside the block
- Keep blocks complete and ready to paste

CONTEXT HEALTH RULE
If responses start becoming slower, shorter, or less precise:
→ flag it immediately
→ say "session context may be getting heavy"
→ suggest running handoff before continuing
→ do not wait for user to notice

INSPECT VS PATCH RULE
For inspect steps: show code, explain behavior, recommend smallest fix, do not edit
For patch steps: make only the requested minimal change, do not refactor

TOKEN BURN RULE
- Use minimal insertions only
- Do NOT rewrite full JSX blocks unless absolutely necessary
- When wrapping existing JSX: insert opening wrapper before, closing wrapper after
- Use the smallest stable anchor possible
- Keep responses short after patches

VERIFY-BEFORE-CLAIM RULE
Before reporting that a section, file, or line exists or is missing, read or grep it first.
Do not rely on memory of recent edits — files can be modified outside the session.

DUPLICATE PROMPT RULE
If a prompt looks identical to a very recent one, verify the change is not already applied before re-running.
Re-applying would duplicate content or fail on a missing anchor.

GIT STATE
This project is a git repo. Suggest a commit before any risky multi-file change.
git add .
git commit -m "backup"

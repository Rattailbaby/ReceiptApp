# Phone Continuity Layer / Ambient Continuity Surfaces

**Status: BACKBURNER — saved only. Do not build.** The current focus is the
ARIA web (`docs/aria/web/`). Phone/email work comes *after* the web is stable.

This folder holds phone-first / away-from-desk continuity ideas for ARIA —
how Caleb stays oriented when he is on his phone and cannot reliably view the
desktop concept web.

**Note on sources:** the full idea lists (~75 ideas — Code's 20, Claude's
20, GPT's 35, with everyone's annotations) live in `docs/aria/ARIA_IDEAS.md`
under the `[2026-05-16]` SOC entry. This file is the organized backburner
home — it captures the structure, the framing, the decision, and a few new
tiny-surface ideas. It does not re-transcribe all 75. This README merges two
folder-creation specs Caleb sent (one said `docs/aria/phone/`, one said
`docs/aria/mobile/` — merged here under `mobile/`).

---

## 1. Wrap-up email after sessions

A recap emailed after each session so Caleb can re-orient from his phone.
Core features pulled from the idea pool:
- Checklist recap with confidence states: got it / fuzzy / lost me
- Reply with a number to get a re-explanation of that item
- Subject line carries the state ("3 done, 1 needs you") — triage from the lock screen
- One human line at the end — emotional, not just facts
- "What changed since last session" — a diff, not a dump
- "What was NOT solved" — preserve unresolved tension explicitly
- A pinned "do-not-lose" section — never checkbox-able, always shown
- Later: the email writes itself from `git log` (a Stop hook)
- Later: attach a PNG screenshot of the current web

Full email idea list: `ARIA_IDEAS.md` [2026-05-16].

## 2. Email vs web app split

- **Email = OUT** — orientation, re-entry, reflection. Reaches you, phone-native.
- **Web / simple app = IN** — capture, interaction, navigation, exploration.
- Same data, different renderers.
- Start with email: cheaper, phone-native, zero build.
- App later — only if the email habit proves useful.

## 3. Tiny phone surfaces

Small ways into the repo from a phone (mostly new, from Caleb's spec):
- `Today.txt` — a living file
- GitHub Pages mini dashboard
- Repo widget / pinned-markdown shortcut on the home screen
- "Open Loop" widget — shows the most important unresolved item
- Ambient lock-screen cards
- ARIA Inbox
- "Return Here" button
- Pocket continuity cards
- Calm Mode

## 4. Pile-up list

Like Uncrumple's Needs Attention, but for cognition:
- Active loops
- Unresolved branches
- Things needing Caleb
- Collapsed by default — clean screen, an exciting count ("12 more")
- An "all clear" reward when it empties

## 5. Key principles

- Phone should be **guidance-first**.
- Desktop / tablet should be **exploration-first** (the graph).
- The repo is already the memory system — we need better *surfaces* into it.
- Preserve returnability.
- Reduce cognitive pressure without reducing cognitive depth.
- The email may become the *emotional* continuity layer before the web does.

## 6. Future ideas

Voice-note capture · session counter · session echo · branch recovery ·
continuity confidence · cognitive drift score · session shape · false
completion warning · memory anchors · one thing to carry forward ·
future-you notes · what became real today. (Full set in `ARIA_IDEAS.md`
[2026-05-16].)

## Key decision

**Email first, app later — and both DEFERRED until the ARIA web is stable.**
- Email is output: cheap, phone-native, zero build, test the habit first.
- App is input: a real build, only after the email proves out.
- The web app and the email are the same data with two renderers.
- Do NOT build the email yet. Do NOT create the Stop hook yet.
- Return to the base task: testing ARIA web v3.

# APPS TO USE — Mobile ARIA Stack

**Purpose:** Away-from-desk workflow stack. Apps and tools to use when you don't have Code access. Samsung/Android-first because that's your hardware.

**Last updated:** 2026-05-11

---

## 🧭 The framing — jobs, not apps

Don't ask "what app should I use?" Ask:

> "What job am I trying to do, and what's the lowest-friction way to do it?"

The five jobs your phone needs to do for ARIA:

1. **Capture** ideas when they hit (away from desk)
2. **Read** what you built (USER_DASHBOARD, WHAT_EXISTS)
3. **Light AI** sessions for thinking / refining
4. **Automate** the capture → repo bridge (later)
5. **Wearable** capture for hands-free moments (later)

**Core principle:** Phone catches sparks. Desktop builds systems. Don't turn your phone into a fragile mini-dev setup.

---

## ⭐ Top picks — start this week

If you only do 5 things, do these:

1. **Turn on GPT Memory and seed it** — 5 min. Eliminates the "paste Block A every time" friction permanently. See seed text in WHAT_EXISTS.md or the explanation pass.

2. **Install GitHub mobile + bookmark** — free, immediate. Bookmark `docs/user/USER_DASHBOARD.md` and `docs/user/WHAT_EXISTS.md` for instant access.

3. **Pin a Google Keep note called "ARIA INBOX"** — your one capture surface. Voice input + emoji prefix when you can.

4. **Put a Keep widget on your home screen** — fastest possible capture path. Tap, talk or type, done.

5. **Try one `mobile soc`** — open Claude or ChatGPT mobile, dump one raw idea using `soc` shorthand. See how it feels. Adjust from there.

That's the minimum viable mobile stack. Everything below is optional depth.

---

## 📸 Job 1 — Capture ideas on the go

The job: an idea hits while you're not at your desk. Get it into the system without losing it.

### ⭐ Google Keep
Fast capture, voice input, sync to Google account, pinned widget on home screen. **Your primary catch bucket.**
- Best for: quick text dumps, voice notes, "tomorrow import this" lists
- Setup: create a single pinned note called "ARIA INBOX"
- Cost: free

### ⭐ Samsung Notes
Better for messy/visual thinking on Galaxy Fold. Handwritten notes, sketches, longer rough thinking.
- Best for: diagrams, idea maps, long-form rough dumps
- Setup: dedicated note for ARIA captures
- Cost: free (built in)

### ⭐ Claude mobile app
Claude Projects persist conversation history. If you have an "Uncrumple/ARIA" Project set up, Claude on your phone is already loaded with context. Say `soc` and dump.
- Best for: capture that needs immediate light reflection
- Setup: add to home screen dock; pre-create ARIA Project once
- Cost: free / Pro tier for Projects

### ⭐ ChatGPT mobile + voice mode
Voice input is surprisingly good. Hands-free idea capture while driving, walking, between tasks. GPT Memory carries ARIA context.
- Best for: voice brainstorming when typing is slow
- Setup: seed GPT Memory once (see Top Picks)
- Cost: free / Plus for advanced voice

### Samsung Voice Recorder
Built in. One tap records, syncs to phone. Use when you need offline capture or pure raw audio.
- Best for: driving, no-internet moments, long verbal dumps
- Setup: none, already on phone
- Cost: free

### Google Recorder
Auto-transcription built in. Better than Samsung Voice Recorder if your phone supports it.
- Best for: longer voice sessions where you want searchable text
- Setup: install if not present
- Cost: free

### Otter.ai
Best for longer voice sessions you want to think through later. Searchable transcripts, syncs across devices.
- Best for: 10+ minute thinking-out-loud sessions while driving
- Setup: free tier sufficient
- Cost: free tier / paid for more minutes

### Perplexity mobile
For research-flavored capture. "What do tradespeople complain about in expense apps?" gives cited synthesized answers in 30 seconds. Better than Google for these kinds of questions.
- Best for: research that feeds Uncrumple/ARIA decisions
- Setup: install, free
- Cost: free / Pro for more advanced queries

---

## 📖 Job 2 — Read what you built

The job: re-orient yourself anywhere. Remember what's available.

### ⭐ GitHub mobile app
Read your repo files directly. `USER_DASHBOARD.md` and `WHAT_EXISTS.md` are both perfectly readable in GitHub mobile right now, zero setup.
- Best for: reading repo state, checking commits, verifying HEAD
- Setup: install, log in, bookmark key files
- Cost: free
- Limit: read mostly; mobile editing is fragile, avoid

### ⭐ Obsidian mobile + Git sync
Your repo becomes a markdown vault you can browse on phone. Graph view shows idea connections. Edit and sync back.
- Best for: deep reading of ARIA_IDEAS, navigating idea connections
- Setup: requires Obsidian + Git plugin configuration (~1 hour)
- Cost: free for personal use
- When: after you've used GitHub mobile for a while and want richer reading

### Markor (Android)
Lightweight markdown editor for Android. Simpler than Obsidian. Works directly on local `.md` files if you keep a synced folder.
- Best for: simple markdown reading/editing without Obsidian overhead
- Setup: install, point at synced folder
- Cost: free

---

## 🤖 Job 3 — Lightweight AI away from desk

The job: think out loud with an AI when you're not at your desktop.

### ⭐ Claude mobile/web
Best for: systems pressure-test, second opinion, loaded-witness continuity (Claude Projects holds context longest per Loaded Witness Rule).
- Use phrase: `soc`, `mobile soc`, `idea intake`
- Setup: add to home screen, ensure ARIA Project exists
- Cost: free / Pro for Projects

### ⭐ ChatGPT mobile
Best for: quick refining, "make this clearer," voice brainstorms, mobile `soc`.
- Use voice mode for hands-free
- Memory carries ARIA context across all chats (see Top Picks #1)
- Setup: seed Memory once, then it's set
- Cost: free / Plus for advanced

### Pi by Inflection
Conversational AI designed for thinking out loud. Asks follow-up questions to develop half-formed thoughts. Not for building or governance — for thinking.
- Best for: walks where an idea is forming but not crystallized
- Setup: install, no account needed initially
- Cost: free

### Perplexity mobile
Research-grade AI. Better than ChatGPT/Claude for "what's the current state of X" type questions.
- Best for: technical research, competitor analysis, market questions
- Setup: install
- Cost: free / Pro

---

## ⚙️ Job 4 — Automation (Android-specific)

The job: reduce friction in the capture → repo bridge. **Build only after the manual flow proves itself.**

### Tasker (Android)
Your existing automation tool. Build a quick-capture button or floating ARIA button.
- Use cases:
  - Floating "Save ARIA idea" button overlay
  - Voice → transcribe → format with emoji → append to file in Drive
  - Share target: send any text/screenshot to ARIA inbox
  - Daily reminder: "import phone notes into ARIA?"
- Setup: significant — only build after habits exist
- Cost: paid app (one-time)

### MacroDroid
Tasker alternative, friendlier interface.
- Best for: simpler automation needs without Tasker's depth
- Setup: install, build macros as needed
- Cost: free tier / paid for advanced

### Samsung Modes and Routines
Built-in Samsung automation. Use for context-aware behavior (e.g., "when at home, show ARIA widget").
- Setup: in Samsung Settings, already there
- Cost: free

### Android Share Target
Share any text/link/image from any app directly to a Keep note. Built into Android share menu.
- Best for: zero-friction capture from any app on your phone
- Setup: in share sheet, pin ARIA INBOX note
- Cost: free

### Google Assistant / Bixby voice triggers
"Hey Google, add to ARIA INBOX: [idea]" → routes to Keep note automatically.
- Setup: configure custom assistant routine
- Cost: free

### Termux + git (advanced)
Run git commands from Android terminal. Could commit captures directly to repo.
- Best for: emergency repo edits when truly stuck without desktop
- Setup: significant
- Cost: free
- Warning: mobile git can create messes — avoid as default workflow

### MGit / GitJournal
Android git clients. Use only for emergency read/edits.
- Best for: rare cases when you must commit from phone
- Cost: free / paid for advanced features
- Warning: same as Termux

---

## ⌚ Job 5 — Wearable capture (when you want it)

The job: hands-free capture from your Galaxy Watch or future glasses.

### ⭐ Galaxy Watch + Bixby voice
"Hey Bixby, save this idea: [thought]" → creates a note that syncs to phone.
- Best for: walking, driving, on a job site, hands full
- Setup: configure Bixby routine on watch
- Cost: free (with existing Galaxy Watch)

### Galaxy Watch voice recorder
Direct voice memo on watch. Syncs to phone.
- Best for: pure raw capture when you can't even talk to an assistant
- Setup: built in
- Cost: free

### Galaxy Buds + voice assistant
Always-in earbuds + voice assistant = closest thing to "Hey ARIA" wake-word capture available today on Android.
- Best for: hands-free capture while doing anything else
- Setup: pair, configure assistant
- Cost: existing Galaxy Buds

### Ray-Ban Meta glasses (if you want to try the wearable concept)
Microphone + companion app. Hands-free voice notes while doing literally anything else. $300.
- Best for: serious test of wearable ARIA before building anything custom
- Setup: pair with phone, use Meta View app
- Cost: ~$300 hardware

---

## 🧠 Cross-cutting rules

### One capture surface rule
Don't fragment across five apps. Pick one mobile catch bucket (Google Keep recommended) and use it consistently. Everything else can route into it.

### Mobile = capture and read. Desktop = verify, build, commit.
The phone should not become a fragile mini-dev setup. If you find yourself trying to commit from phone, you're using the wrong tool for that job. Wait until desktop.

### Don't filter on the phone
Per NO IDEA GETS WASTED rule: capture raw, route later at desk via `idea intake`. The phone is not the place to decide if an idea is good.

### Phone is the wearable (for now)
Your phone is already always on you. Maximize what it can do for ARIA before buying glasses or custom wearables. Lock screen widget + voice assistant + one Keep note = most of the wearable value at zero cost.

### Morning review habit (5 min)
Open ARIA INBOX. See what accumulated. Decide what to import via `idea intake` and what to defer. Low ceremony, high value.

---

## 🚫 Don't build yet

These are tempting but premature:

- ❌ Mobile git commits as default workflow (fragile, error-prone)
- ❌ Full Obsidian vault before you've validated the simpler flow
- ❌ Tasker automation before the habit exists (you'll automate the wrong thing)
- ❌ Ray-Ban Meta glasses before you've maxed out phone-as-wearable
- ❌ Custom voice → repo automation before manual capture proves friction
- ❌ Notion or any new note system if your current Keep/Samsung Notes works

When real friction tells you "this is annoying" → THAT'S when you build the automation. Not before.

---

## 🎯 Practical first actions (in order)

```
Day 1 (5 min):
1. Seed GPT Memory with the ARIA context (see Top Picks #1)

Day 1 (10 min):
2. Install GitHub mobile, log in
3. Bookmark docs/user/USER_DASHBOARD.md
4. Bookmark docs/user/WHAT_EXISTS.md

Day 1 (5 min):
5. Create Google Keep note: "ARIA INBOX"
6. Add Keep widget to home screen pointing at that note

This week:
7. Capture 3-5 ideas using mobile soc
8. At desk, run idea intake on them
9. See what's working / annoying
10. Decide next layer (Tasker? Obsidian? Watch routine?) BASED ON FRICTION

Don't pre-build. Let real use direct the build path.
```

---

## 🔗 Connections to other ARIA files

- **`USER_DASHBOARD.md`** — your live cockpit. Skim before mobile sessions to know what you're working on.
- **`WHAT_EXISTS.md`** — full capability index. Mobile equivalent: GitHub mobile bookmark.
- **`HANDOFF_CHEATSHEET.md`** — ceremony reference.
- **`SYSTEM_COMMANDS.md`** — full shorthand family.
- **`ARIA_IDEAS.md` 2026-05-10 underused capabilities** — original tool sweep context.
- **`ARIA_IDEAS.md` 2026-05-11 Claude/GPT harvests** — full original idea source.

---

## 🧭 Shorthand reminder for mobile

Add this to a pinned phone note for quick reference:

```
MOBILE ARIA SHORTHANDS:
- soc           = raw idea dump, no filter
- mobile soc    = raw phone capture, import later
- idea intake   = batch import (use at desk)
- hold that thought = park current thread
- system map    = show what's built
- tool sweep    = find underused tools
- blind round   = 3 independent AI takes
```

---

## ⭐ Star reminder

If this file gets long, the ⭐ items are the priority. Start there. Everything else is depth for when you want it.

---

*Companion to `USER_DASHBOARD.md` (live cockpit) and `WHAT_EXISTS.md` (full capability index). Together they cover: where am I right now / what did I build / what apps support the system away from desk.*

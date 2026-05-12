# CLAUDE'S CLEVER IDEAS
Last updated: April 2025

These are ideas that don't belong on the active roadmap yet but are 
worth revisiting. Some will become features. Some will spark better 
ideas. None of them should be forgotten. If one idea relates to what is currently being worked on bring it up and tell user how to find it so he can read and decide.

When reviewing this list, ask: does this support the core loop?
Capture → Assign → Organize → Invoice → Clean Slate

If yes and the timing is right, move it to the roadmap.
If not yet, leave it here.

---

## ⭐ You Should Really Look At These

Purpose: Ideas flagged as especially strong during any session.
Every item here also lives in its normal category below.
These are not the only good ideas — they are the ones an AI 
thought were strong enough to flag explicitly.

⭐ AIs capture. User synthesizes. Never reverse this. (2026-05-09)
The user is the synthesis layer. AIs capture everything raw. The 
user reads everything. Reading one idea sparks a better idea or 
builds on it. Filter at promotion time, not capture time. Full 
entry: docs/aria/ARIA_IDEAS.md (2026-05-09 dated section).
This is the foundational principle behind NO IDEA GETS WASTED 
RULE in LOCKED_ATTRIBUTES.md. It unifies Uncrumple's quick-capture 
flow and ARIA's idea preservation: reduce the cost of capturing, 
trust the human to synthesize.

⭐ Crumpled-to-flat Save button / transaction completeness 
progression (2026-05-09)
The brand metaphor tied directly to core interaction. Highest-
leverage UI idea in the saved ideas list. Keeps getting deferred. 
Should move higher in priority after flagged flow is verified. 
Full entry: PRE-CLEAR SYNTHESIS SESSION dated 2026-05-09 below.

⭐ Date/year trust issue (2026-05-09)
Most quietly damaging thing in the app. Tax screen shows wrong 
year because transactions stored without year. Trust problem with 
exact audience you're building trust with. Move up before launch, 
not after. Full entry: PRE-CLEAR SYNTHESIS SESSION dated 2026-05-09 
below.

⭐ Receipt state: attached / missing / unavailable (2026-05-09)
The one data model gap actively blocking real user behavior. Lost 
receipts can never be cleared from Missing Receipts queue. Daily 
friction for target user. Full entry: PRE-CLEAR SYNTHESIS SESSION 
dated 2026-05-09 below.

⭐ 🔭 Notes app pre-import sweep (2026-05-09)
When user shares their independently-maintained notes app list, 
run an Unknown-Value Sweep on the list itself BEFORE saving. 
Question: "What pattern emerges from looking at all of these 
together?" The user's own list might have themes they haven't 
consciously named. Treat as corpus to analyze, not just items 
to file. Highest immediate value — user is about to share the 
list. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Code's 
pre-clear extras section.

⭐ 🧠 "What did you almost not save?" meta-question (2026-05-09)
The most valuable saves are often the ones that almost got 
filtered. Asking AIs "what did you almost not say because it 
seemed too small or too obvious" is higher-signal than "what 
would you save." Pulls the bottom of the filter. Should become 
standing pre-clear question. Full entry: docs/aria/ARIA_IDEAS.md 
2026-05-09 Code's pre-clear extras section.

⭐ 🔭 Idea provenance tracking (2026-05-09)
When a new idea sparks from rereading an old one, link them. 
Build a tree. Personal idea-evolution map. Reveals when the same 
root idea has produced multiple evolved versions = signal of a 
deep pattern. Long-term compounding value. Full entry: 
docs/aria/ARIA_IDEAS.md 2026-05-09 Code's pre-clear extras section.

⭐ 🏗️ Pre-handoff "weakest link" question + asymmetric role questions (2026-05-09)
"What would break first if you weren't here next session?" + Code/GPT/Claude get different angle questions. Generative not reactive. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🤖 "No continuity tax" as ARIA pitch (2026-05-09)
Sharper than "pick up exactly where your brain left off." Names the cost being eliminated. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🤖 The "ask the loaded AI" pattern as ARIA primitive (2026-05-09)
ARIA detects session ending + heavy context, prompts for harvest automatically. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🤖 High-Signal Shelf architecture (2026-05-09)
Six-layer stack: COMPOST / SHELF / CONNECTIONS / ROADMAP / CANDIDATES / LOCKED. Save the architecture, build later. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🏗️ APP_LOG vs ARIA_LOG separation (2026-05-09)
Practical, implementable soon. Currently can't measure app progress vs ARIA evolution separately. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🏗️ Anti-pattern: system explaining the system (2026-05-09)
Testable rule: governance files >2× shipped features = prioritize app next session. Self-correcting bloat detector. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 📱 "All caught up" moment in Uncrumple (2026-05-09)
Tiny build cost (~10 lines), huge emotional impact. Should be next prompt. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 📱 Date problem — launch trust risk (2026-05-09)
Transactions without year = tax screen lies. Trust problem with target audience. Move up before launch, not after. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 📱 Undo for destructive actions (2026-05-09)
5-second toast before delete commits. Asymmetric: very low build cost, very high trust impact. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🤖 Handoff as product demo (2026-05-09)
Watch session drop, watch reconstruction. Visceral. The product pitch for ARIA itself. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🏗️ Pre-mortem before promotion (2026-05-09)
Required step before any LOCKED promotion: "what's the strongest argument against this?" Make ad-hoc pressure-test standing. See PRE-CLEAR SYNTHESIS HARVEST below.

⭐ 🔭 Idea Intake Mode for notes app batch imports (2026-05-09)
When user brings a list from outside the trio (notes app, voice memos, paper notes), treat as batch import of synthesis-layer-validated content. 6-step protocol: preserve raw, categorize by emoji, drop nothing, ⭐ flag standouts, route by category, produce 4 outputs (full list / ⭐ shelf / possible builds / possible rules / preserved compost). Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Idea Intake Mode section. Don't build automation tonight — save the principle.

⭐ 🔭 ARIA as a protocol, not an app (2026-05-09)
The actual moat is the spec, not the implementation. Define the file shapes (compost / shelf / candidates / locked / state / ceremony) as an open standard. AIs become swappable. Devices become swappable. Principles survive model changes. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 💰 Sell to AI companies, not users (2026-05-09)
Anthropic/OpenAI/Google all face the same problem: their models get smarter but user continuity dies every session. License the protocol to them. They make models sticky; ARIA provides the stickiness. Larger market than direct-to-user. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 💰 The "AI forgot what we were working on" wedge (2026-05-09)
Every AI user hits this within weeks. Targets skeptics not enthusiasts = larger addressable market. Pitch: "AI doesn't have to remember if the system around it does." Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 📱 Phone-first wearable reality check (2026-05-09)
Wearables are right intuition wrong starting point. Phone has all the capture infrastructure already (always-on, notes, voice-to-text, cameras, runs LLMs). Build ARIA-on-phone first. Watches/glasses extend the signal stream, don't bootstrap it. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 🧠 Friction heat map (2026-05-09)
Every friction expression logged with timestamp + context. After 100 sessions = empirical heat map of where the system hurts. Feature backlog generated by signal, not by guessing. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 🤖 The user's notes app IS proto-ARIA (2026-05-09)
User has been running their own ambient capture system manually for years. ARIA isn't being invented, it's being formalized. The user is the proof of concept. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 💰 The killer demo (2026-05-09)
Two laptops. Drop session on one (full context loss). Reconstruct on the other. Different model, same state. Visceral. That's the pitch. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 productization brainstorm.

⭐ 🏗️ Three primary build models — unified LLM / multi-agent / protocol-first (2026-05-09)
Three honest paths: (1) merge trio into custom unified model, (2) keep trio shape with custom specialized models, (3) protocol-first ARIA where AIs are clients of the spec. Model 3 is strongest pick — defensible, model-agnostic, survives every base-model upgrade. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ Local-first ARIA (2026-05-09)
Runs entirely on user device. No cloud. Privacy by architecture not policy. Smaller LLMs locally for capture/routing; cloud only when explicitly needed. Aligns with where local LLMs are heading. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ ARIA as a kernel — tiny core, plugin everything (2026-05-09)
Like an OS kernel for cognition. Tiny core (state + protocol + event log). Apps register as capture sources, synthesis engines, output channels. Enforces minimalism at the core, prevents over-engineering. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ ARIA as MCP server / sub-agent (2026-05-09)
Implements Model Context Protocol. Any LLM that supports MCP can use ARIA as memory layer with no code changes. Probably FASTEST path to working product with current AI infrastructure. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ ARIA as Obsidian plugin (2026-05-09)
Targets the synthesis-layer-already-active user base. People already maintaining markdown vaults are proven early customers. Lower acquisition cost than building a new app. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ Append-only event log architecture (2026-05-09)
ARIA underneath is just an event log. Replay the log = reconstruct state. Never delete. Git for cognition. Audit trail, time travel, conflict resolution all come for free. Computer science fundamentals applied to memory. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ "ARIA is mostly already built" (2026-05-09)
Current repo IS the architecture. Files as state. Git as event log. Markdown as protocol. Claude Code as runtime. 90% there. The "build" might be mostly packaging what exists into something distributable. Don't underestimate this shipping path. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 build architecture section.

⭐ 🏗️ ARIA Intake — the simplest first product (2026-05-09)
User's own pick as most realistic immediate build. Paste messy ideas → raw preserved + categorized + ⭐ shelf + roadmap ideas + ARIA ideas + candidate rules + next actions + markdown files. Hours not weeks. Implements already-locked Idea Intake Mode protocol. Solves the notes app pain immediately. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA repo companion CLI — most immediately useful (2026-05-09)
Reads CURRENT_HANDOFF.json + CANDIDATE_ATTRIBUTES.md + ARIA_IDEAS.md + SESSION_LOG.md. Outputs what changed / stale / needs capture / what to ask GPT/Claude/Code. User's own assessment: "probably the most immediately useful." Build path 5. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA browser extension — could be huge (2026-05-09)
Captures across ChatGPT/Claude/GitHub/Reddit/docs. User's reaction: "this could become huge." Single product hits all major AI tool surfaces at once. Build path 4. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA handoff generator app — first sellable product (2026-05-09)
Focused product: connect ChatGPT/Claude/GitHub → read repo files → ask harvest questions → generate handoff packet → update markdown/json. User's own assessment: "might be the first sellable ARIA product." Build path 14. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA context receipt system — Uncrumple isomorphism (2026-05-09)
Every saved insight gets proof: idea / source / date / why it mattered / linked commit/chat/file. Maps perfectly to Uncrumple's receipt metaphor. Cross-product isomorphism made literal. Build path 11. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🧠 ARIA's sharpest framing: "frictionless re-entry into previous cognition" (2026-05-09)
Not memory storage. Re-entry. The system's value is returning user smoothly to where they were thinking, not in storing what they thought. Cleaner positioning than current pitches. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🧠 Interruptions are not failures (2026-05-09)
They are the normal operating environment. ARIA exists to preserve continuity across interruption. Single sentence might be cleanest ARIA elevator pitch yet. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🧠 Save points for cognition (2026-05-09)
Game-design metaphor applied to thinking. Save anywhere. Resume anywhere. User shouldn't have to "find the right place to stop" — any stopping point is a valid save point. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA Lite phone app — build path 1 (2026-05-09)
Capture / voice / auto-categorize / compost / ⭐ shelf / Resume Cards / markdown export. Proves the system without wearables or custom models. Realistic starting product. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA notes-app importer — build path 15 (2026-05-09)
Paste messy notes → preserve raw → categorize by emoji → ⭐ flag → route to files → generate top rereads. User's own pain point. Would immediately help. Connects to Idea Intake Mode protocol. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 massive idea dump section.

⭐ 🏗️ ARIA_STARTER_KIT — continuity operating kit (2026-05-09)
Not one app — a kit that generates personalized continuity infrastructure based on cognitive mode (solo builder / writer / developer / contractor / student / researcher / ADHD). Defensible, customizable, supports many cognitive styles from one foundation. Might be ARIA's actual product shape. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 ARIA_STARTER_KIT section.

⭐ 🧠 ARIA = build the layer between user and existing AI (cleanest strategic position) (2026-05-09)
Not "build better AI." It's "build the layer that makes continuity, coordination, and signal capture automatic." Rules out custom-LLM rabbit hole permanently. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section A.

⭐ 📱 Session START matters more than session END (2026-05-09)
Everyone focuses on handoff/clear. Most painful moment is starting fresh chat cold. ARIA's first product feature should be auto-context-injection on new chat open. Reframes priority. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section B.

⭐ 🤖 Comparison view as ARIA's killer feature (2026-05-09)
GPT vs Claude side-by-side, differences highlighted. Automates trio reflection (LOCKED 37) as a UI feature. ~100 lines of Python. Build before any other UI. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section B.

⭐ 🧠 The handoff system is the moat (2026-05-09)
Custom LLMs have no moat. Continuity system that gets smarter the longer used = real switching cost. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section B.

⭐ 🤖 Cheapest ARIA v0.1 = folder + 3 API keys (2026-05-09)
Repo + CURRENT_HANDOFF.json + context injection script + parallel API calls. Buildable in a weekend. Already more useful than anything on market for AI continuity. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section B.

⭐ 🏗️ Start with CLI, not an app (2026-05-09)
`aria start` / `aria clear` / `aria capture "idea"`. No UI, no DB, no hosting. Day to build. Useful immediately. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ The repo IS the database — don't replace it (2026-05-09)
Markdown + git = queryable, versionable, human-readable database. Most important architectural commitment. Build tooling AROUND it, not replacing it. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ Browser extension for chat injection (2026-05-09)
Auto-inject starter block when opening Claude/GPT chat. Reads local CURRENT_HANDOFF.json via local API server. Highest-leverage build. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ Three build paths (Power user / Consumer / API-platform) (2026-05-09)
Path A (CLI + VS Code) → Path B (Electron/web) → Path C (protocol/SDK). Start with A. Let it tell you if B or C is worth building. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ Parallel API calls as first real ARIA feature (2026-05-09)
Same prompt to Claude+GPT simultaneously, both responses, differences highlighted. ~100 lines of Python. Build before anything with UI. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ Smallest ARIA v1 worth sharing — 3-command CLI (2026-05-09)
One file. `aria start` / `aria capture` / `aria clear`. MIT license. GitHub. Days of work. Most actionable item in the harvest. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🏗️ Build it so Uncrumple users could use it (2026-05-09)
Tradespeople have same problem at simpler scale. Simplified ARIA — just continuity layer, no AI coord — could be in Uncrumple itself. "Why was I here?" feature IS simplified ARIA. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section C.

⭐ 🤖 Wearables are right hardware for ambient cognition (2026-05-09)
ARIA's promise is ambient. Phone requires pickup. Watch/glasses always on body. Hardware matches philosophy. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section D.

⭐ 🧠 Watch as capture primitive, not display (2026-05-09)
Tap → voice → transcribe → route. Heavy processing on phone/desktop. Watch is input layer only. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section D.

⭐ 🤖 Glasses as the display layer ARIA is missing (2026-05-09)
Ambient overlay — current next_step, debt level, active branch — without breaking flow. Glance, know, continue. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section D.

⭐ 🧠 "Hey ARIA" as product moment (2026-05-09)
Wake word + voice commands = ARIA becomes consumer product. Tradesperson + Uncrumple + watch = the moment ARIA becomes invisible infrastructure. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section D.

⭐ 🧠 Form factor tells you what ARIA really is (2026-05-09)
Wearable isn't feature idea — it's product identity clarification. ARIA is ambient cognition layer that happens to have desktop interface. Desktop = backend. Voice + glasses + watch = frontend. Flips mental model 180°. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Claude harvest #2 Section D.

⭐ 🧠 Multi-pass harvesting for Level 3 handoff (2026-05-10)
Single harvest pass under-extracts. Asking GPT/Claude/Code for ideas a SECOND or THIRD time reliably produces deeper material. For Level 3 (full clone regen) this is DEFAULT, not optional. Pass 1: ideas about X. Pass 2: what else — small/obvious/half-formed. Pass 3: what did you almost not say. Stop when AI repeats itself. Also: GPT visibly slowing alone justifies Level 3. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 multi-pass harvesting section.

⭐ 🤖 GPT Memory feature (separate from custom instructions) (2026-05-10)
Persists across ALL ChatGPT chats, not one. Could store "I'm part of ARIA trio, repo at github.com/Rattailbaby/ReceiptApp, follow FRESH CHAT PROTOCOL." Every new chat starts oriented without pasting. Solves the paste-Block-A-every-time problem. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🤖 ChatGPT Projects (GPT equivalent of Claude Projects) (2026-05-10)
Group chats with shared file uploads + custom instructions. Create Uncrumple/ARIA project, upload key repo files, new chats inherit. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🤖 Claude Project Knowledge (persistent uploads) (2026-05-10)
File uploads per project, persistent, don't count against context. Permanently load LOCKED_ATTRIBUTES + ARIA_README + HANDOFF_CHEATSHEET for instant access. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🤖 MCP servers (both Claude Desktop and Code) (2026-05-10)
Custom ARIA MCP server gives structured tools: read_handoff / append_idea / search_compost / promote_candidate. Trio orchestration becomes MCP integration. Protocol-ready today. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🏗️ Custom slash commands in Code (2026-05-10)
/idea-intake, /handoff, /clear-with-wrap, /harvest-pass-3. Shorthand family becomes literal commands. Reduces friction. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🏗️ Code hooks beyond clipboard (2026-05-10)
Currently only Stop hook used. Could add: PostToolUse on Edit → auto-commit, PreToolUse on Write → check NO IDEA WASTED, UserPromptSubmit → auto-route emoji-tagged, SessionStart → handoff dress rehearsal. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🏗️ User-level CLAUDE.md at ~/.claude/CLAUDE.md (2026-05-10)
Cross-project rules apply to ALL Code sessions. Put ARIA principles there — every project inherits. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🏗️ GitHub Actions on push (2026-05-10)
Automation triggered by every commit. Auto-validate JSON, auto-update SESSION_TEXTURE, auto-publish summary to Pages, auto-tag releases. Existing tooling, not new infrastructure. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🤖 Apple Shortcuts for voice capture (2026-05-10)
iOS/watchOS Shortcut: voice → emoji format → append to iCloud → syncs to repo. Wearable capture layer with zero custom dev. Buildable today. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🧠 "Rate your confidence 1-10" prompt pattern (2026-05-10)
Surfaces AI uncertainty cheaply. Treating AI responses as equally weighted misses signal. Confidence scoring changes decisions. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-10 underused capabilities section.

⭐ 🏗️ Whisper API for voice capture on desktop (2026-05-11)
OpenAI's Whisper — best speech-to-text, costs almost nothing. Script: hotkey → record → Whisper → transcription → route to right file. Voice capture layer that works on desktop TODAY without buying hardware. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Claude's harvest.

⭐ 🏗️ GitHub labels as routing categories (2026-05-11)
Labels: aria / uncrumple / bug / governance / idea-compost / high-signal / candidate-rule / blocked. Queryable taxonomy on issues. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #2.

⭐ 🏗️ GitHub release tags for stable system states (2026-05-11)
aria-handoff-v1, uncrumple-cleanup-v1. Time-travel capability — "go back to system before X changed." Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #6.

⭐ 🏗️ Repo health check script (2026-05-11)
One command reports: branch / dirty files / latest commit / JSON valid / handoff present / candidate count / unresolved threads. Single-command system status. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #10.

⭐ 🏗️ Diff-review packet generator (2026-05-11)
Structured diffs instead of long summaries: field changed / old value / new value / why / risk. Formalizes Tier 2 review pattern. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #15.

⭐ 🏗️ Prompt library folder (docs/prompts/) (2026-05-11)
Reusable prompts: candidate review / pre-clear harvest / clone self-awareness / issue intake / pressure-test / synthesis. Solves prompt-retyping problem. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #16.

⭐ 🏗️ Recovery test prompt (2026-05-11)
Standardized "prove you recovered": what is next_step / what is deferred / what must you not do / what changed last session. Automates handoff verification. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #18.

⭐ 🏗️ Session mode switch commands (2026-05-11)
execution mode / synthesis mode / harvest mode / recovery mode / idea intake. Each changes behavior. Extends shorthand family. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #20.

⭐ 🏗️ Logi mouse + Huion pad as ARIA input layer (2026-05-11)
Hardware user ALREADY OWNS becomes prompt-template launcher and AI-toggle interface. Map mouse buttons to GPT/Claude/Code toggles. Map Huion keys to common prompt templates ("Fix only...", "Inspect only..."). Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest items #27, #29.

⭐ 🧠 Vector search over compost (2026-05-11)
Embeddings over ARIA_IDEAS, compost, roadmap, handoffs, decisions. Ask "where did we talk about continuity tax?" → semantic search across all files. Adds query capability without restructuring. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #33.

⭐ 🧠 Weekly ARIA review cadence (2026-05-11)
Not daily — weekly. Top ⭐ ideas / stale deferrals / app-vs-governance progress / next 3 build steps. Adds cadence layer above per-session work. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #39.

⭐ 🧠 Anti-bloat rule with metric (2026-05-11)
"If governance work dominates too long: next session must ship app progress unless blocker exists." Testable version of "system explaining the system" anti-pattern with concrete trigger. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 GPT's harvest item #40.

⭐ 🧠 Mid-Session Orientation Snapshot — preservable artifact (2026-05-11)
Compressed synthesis of session state generated while context loaded. Can't be reproduced from repo files alone after /clear. Connects 5 existing ideas (continuity breadcrumbs → Resume Cards → dynamic starter block → orientation snapshot → Tier 3 regen JSON) as the same primitive at different scales. Unifying name proposed: 'Continuity Snapshot'. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Mid-Session Orientation Snapshot section.

⭐ 🧠 Path-vs-Flow tension — track inspiration without breaking it (2026-05-11)
Resolution: TIER not CHOICE. Level 1 in-flow = don't track. Level 2 after-flow = reconstruct 3-5 inflection points only. Level 3 long-term = notice meta-patterns. Three cadences, three scales, no need to pick one. Sidetracks ≠ failure when they produce artifacts (harvest moments) vs no artifacts (distractions). Don't formalize path-tracking — trust the over-systemization warning. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Path-vs-Flow tension section.

⭐ 🧠 Sidetrack as second-order harvest, not failure (2026-05-11)
"Aria came about because of building Uncrumple." The sidetrack from primary work to meta-work was the harvest. Future-you should distinguish harvest moments (produce artifacts) from distractions (don't) and let harvest moments run. Inflection points of this session: Block C truncation, user's "doesn't make sense" moments, pre-clear pressure rounds, wearable question, notes app mention. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Path-vs-Flow tension section.

⭐ 🔭 Blind Trio Round / Independent Trio Ideation (2026-05-11)
User's idea, refined via trio review (Code + GPT + Claude). Phase 1 = blind independent thinking (3 AIs answer separately, no AI sees others). Phase 2 = cross-read after user says "phase two" (each AI reads others, agrees/merges/holds with reasoning per LOCKED 37). Phase 3 = synthesis preserving originals + disagreements + clever extras + mandatory user "defeats the purpose" check. The folder IS the protocol — file system enforces sequence without code. Shorthands: blind round / phase two / synthesize round. Future product features: Divergence Lock, Consensus Map, Outlier Shelf, Argument Swap, User Verdict Layer. Don't build tonight. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Blind Trio Round sections.

⭐ 🔭 "The folder IS the protocol" architectural insight (2026-05-11)
Claude's contribution to Blind Trio Round design. File system structure itself enforces the rule — you can't do Phase 2 until Phase 1 files exist. Zero infrastructure, zero automation, immediate value. Maps to "ARIA is mostly already built" — repo + markdown + Code = enough to ship today. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Blind Trio Round refinements section.

⭐ 🔭 Living Notepad / User-Facing Scratch Surface (2026-05-11)
User soc idea: a USER_NOTEPAD.md (distinct from AI-facing files like CLAUDE.md and CURRENT_HANDOFF.json) that updates dynamically across the session. Contains: active shorthands / key principles / current next_step / parked HOLD threads / recent inflection points / quick reminders. The persistent always-on version of Mid-Session Orientation Snapshot. The "hold that thought" mechanic auto-saves to it. User-facing live reference, not AI-facing protocol. Genuine gap in current system — every existing file serves AIs. Needs refinement (user said so) but the core insight is real. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Living Notepad section.

⭐⭐⭐ 🏆 TOP 32 best ideas — Code+Claude+GPT 3-way synthesis (2026-05-12, final)
Three-pass synthesis: Code's 10 sparks → Claude's 10+ adds → GPT's 20+ adds. All categorized in docs/aria/ARIA_IDEAS.md.
DEEPEST POSITIONING: "ARIA preserves MEANING, not memory" (GPT) — sits above all other positioning layers.
ARCHITECTURE REFRAMES (3): Modes not commands (GPT) / Working Memory Layer (Claude+Code merge) / Overnight Safety Tier Ladder (4-way merge).
BEHAVIOR RULES (6 candidates): "This defeats the purpose" detector (GPT) / Convergence Trap (Claude) / Skeptic+Champion Pass paired-precise (4-way merge) / Self-defense first (Code) / Incomplete confidence (Code) / Idea Half-Life with tiered decay (Claude+GPT).
SYSTEM FEATURES (8): Sync Gap Detector+Packet / Mind-Change Receipt / Idea Garden Review / Context Merge comparison / Now Panel / Glass Mode 5-mode spectrum / Longitudinal Analytics / Fix-Failed Round.
WORKFLOW (4): Categorized+theme-tree compost / Session Energy / Day 1/7/30 / Prior Art Sweep.
CAPTURE (4): 🤔 unclear thought / Park-this / Mobile Capture Contract / wm shorthand.
INFRASTRUCTURE (2): Human-Readable Diff per commit / Token Efficiency Pattern Library.
Full entries: docs/aria/ARIA_IDEAS.md 2026-05-12 sections (3 entries: Code's sparks / Code+Claude synthesis / Code+Claude+GPT synthesis).

⭐⭐⭐ 🔭 "ARIA preserves MEANING, not memory" (GPT 2026-05-12)
Deepest positioning of the session. Most AI tools try to remember. ARIA's deeper job is to stop rich, messy intent from becoming a technically-correct-but-weaker version later. Anti-flattening as core product. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 GPT pass.

⭐⭐⭐ 🧠 "This defeats the purpose" detector (GPT 2026-05-12)
Standing quality check: "What would technically satisfy this request but defeat the purpose?" Applied to every promotion, build, synthesis. Saved as candidate. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐⭐ 🤖 Modes not just commands (GPT 2026-05-12)
8 modes (Capture / Build / Debug / Harvest / Mobile / Witness / Review / Recovery) vs 15+ shorthands. Cleaner cognitive load. Each mode changes AI behavior. ARIA's UI could BE the mode switcher. Saved as candidate. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐ 🤖 Sync Gap Detector + Sync Packet (GPT 2026-05-12)
Track per-AI knowledge state. Generate sync packets ("Since you last saw this: built X / rejected Y / changed Z / current HEAD N / fragile thing: A") when gap detected. More useful day-to-day than full handoff. Saved as candidate. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐ 🧠 Mind-Change Receipt (GPT 2026-05-12)
When AI or user changes position: capture Initial / Challenge / What changed / New decision / Lesson. Makes AI/user learning visible over time. Saved as candidate. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐ 🧠 Idea Garden Review with cadence triggers (GPT 2026-05-12)
Refines "idea review day" with concrete triggers (⭐ shelf > 75 / compost > 200) and outputs (Top 10 reread / Top 5 build / Top 5 research / Top 5 merge / Top 5 ignore / Patterns). Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 GPT pass.

⭐⭐ 🤖 Context Merge as comparison, not blob (GPT refinement 2026-05-12)
Structured output: Chat A knows / Chat B knows / Overlap / Conflicts / Missing from A / Missing from B / Fragile meanings / Suggested sync packet. Prevents token explosion, keeps meaning visible. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 GPT pass.

⭐ 🤖 Skeptic Pass (mode not role) + Champion Pass (4-way merge 2026-05-12)
Invoked on triggers (Convergence Trap / big build / reopened deferred). Skeptic must name ONE specific assumption (Claude's precision). Champion mirrors with ONE specific strength (Code's twin). Cheaper than permanent 4th AI. Aligns with Modes-not-commands. Saved as candidate. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐ 🫧 Now Panel (GPT 2026-05-12)
Renames floating bubble. Shows: what Code is changing / what to expect / what to do next / what failure means / current base task / current token mode. Less gimmicky name. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🪙 Glass Mode + 5-mode token spectrum (GPT 2026-05-12)
Saver / Balanced / Burner / Glass Mode (max transparency) / Autopilot (read-only). Sharper than original token-burner-vs-saver framing. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🔍 Prior Art Sweep (GPT 2026-05-12)
Search public repos for ARIA-like systems. Output: Similar projects / What they got right / What they missed / What ARIA does differently. Standardized research mode. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🐞 Fix-Failed Round (GPT 2026-05-12)
When fix fails, mini Blind Trio Round on diagnosis: GPT diagnosis / Claude diagnosis / Code file-truth / cross-read / smallest next test. Concrete debugging protocol. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 📱 Mobile Capture Contract (GPT 2026-05-12)
Every mobile note carries: raw / do not act yet / preserve wording / category guess / import later. Prevents mobile-scrap overprocessing. Pairs with APPS_TO_USE.md. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 📝 Human-Readable Diff per commit (GPT 2026-05-12)
Every meaningful commit gets plain-English: What changed / Why / How to use / What to watch for. Feeds WHAT_EXISTS.md updates. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🏗️ Token Efficiency Pattern Library (GPT 2026-05-12)
Running list of low-cost operations: folder inspection / repo state / diffs / sync packets / context comparison / file-based state. Practical engineering advantage. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ ⌨️ wm shorthand "what am I missing?" (GPT 2026-05-12)
Different from wn (what's next). Scans: stale items / unsaved ideas / out-of-loop AIs / missing confirmations / fragile meanings / current risk. Added to SYSTEM_COMMANDS.md. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐⭐⭐ 🏆 Top 16 best ideas — cross-AI synthesis (2026-05-12)
Code + Claude generative passes synthesized into unified categorized list:
STRATEGIC: Positioning Stack (3 layers) / ARIA = Uncrumple / Handoff IS demo
RULES: Convergence Trap / Skeptic+Champion paired / Self-defense first / Incomplete confidence
ARCHITECTURE: Working Memory Layer / Idea Half-Life / Overnight Safety Tier Ladder / Longitudinal Analytics
WORKFLOW: Compost theme-tree / Session Energy Signal / Day 1/7/30 curriculum
CAPTURE: 🤔 unclear thought / Park-this
Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 cross-AI synthesis section.

⭐⭐ 🧠 Convergence Trap — easy consensus = smell (Claude 2026-05-12)
When all 3 AIs agree on first pass with no friction, that's a Skeptic-invocation trigger, NOT a green light. Easy consensus = shared training patterns. Hard-won consensus = signal. This session validated: "build tomorrow" agreed by all 3 AIs without friction; user pushed back as Loaded Witness; consensus was premature. Saved as candidate rule. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐ 🧠 Idea Half-Life — track age, cull intelligently (Claude 2026-05-12)
Ideas in compost get timestamps. After 60 days without promotion → "still relevant?" prompt (promote / kill / defer max 3 times). Prevents compost from becoming graveyard. Produces meta-learning about which idea patterns survive. Saved as candidate rule. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐⭐ 🤖 Working Memory Layer (Merge: Claude spec + Code UI paths) (2026-05-12)
5-item active surface (current task / parked thread / active decision / one fragile intent / next action) served by multiple UI paths (bubble / status line / watch / sound / color). USER_DASHBOARD partially serves this already. Claude provided the cognitive-7-item grounding, Code provided the UI-path multiplicity. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Merge C.

⭐⭐ 🤖 Overnight Safety Tier Ladder (Merge: Claude + Code + user) (2026-05-12)
Tier 1 read-only with notes (Claude — safest) → Tier 2 digest with light synthesis (Code) → Tier 3 autonomous build (user — most ambitious). Validate through tiers. Don't skip to T3. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Merge A.

⭐⭐ 🔭 Positioning Stack — 3 layers by audience (Merge: Code + Claude) (2026-05-12)
Consumer: "ARIA teaches you how to disagree with AI confidently" (Claude framing + Code observation merged). User-felt: "Working with AI without the compounding cost of interruption" (Code). Strategic: "The mental model is the product, features are expressions" (Claude). Deploy by audience, not as competing taglines. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Merge B.

⭐⭐ 🧠 Skeptic + Champion paired-precise roles (Merge: user + Code + Claude) (2026-05-12)
Skeptic names ONE specific assumption (if it breaks, idea breaks — Claude's precision). Champion names ONE specific strength (the worth-keeping thing — Code's mirror). Both precise. User sees both clearly. Vague versions get dismissed. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Merge E.

⭐⭐ 🔭 ARIA = Uncrumple — structurally identical (Claude 2026-05-12)
ARIA organizes messy AI inputs and routes them. Uncrumple organizes messy receipts and routes them. Same product different domain. Every design decision in one feeds the other. Stronger statement than "Uncrumple is ARIA's proving ground." Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🤖 Session Energy Signal — flow vs winding down detection (Claude 2026-05-12)
ARIA reads session energy and adjusts. In flow: capture aggressively, defer governance, don't interrupt. Winding down: surface admin, prep handoff. User did this intuitively all night. ARIA detecting explicitly = automatic adjustment. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🤖 Session Rating + AI-attribution = Longitudinal Analytics (Merge: Claude + Code) (2026-05-12)
Session-level: 1-5 rating + one sentence (Claude). Insight-level: which AI led to which breakthrough (Code). Both → AGENT_ANALYTICS.md. 30 sec/session, compounds yearly. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Merge D.

⭐ 🔭 Handoff ceremony IS the demo (Claude 2026-05-12)
Record one clean handoff = most compelling ARIA marketing artifact. Visceral demonstration. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🏗️ Decision Checkpoints reframe of token modes (Claude 2026-05-12)
Token burn modes are about TEXT VOLUME. Real variable is DECISION CHECKPOINTS — how often does ARIA stop and verify? Verbose = many. Concise = fewer. Sharper framing than original. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐⭐ 🤖 Overnight DIGEST not overnight BUILD (Code spark 2026-05-12)
Stepping-stone version of "AI cooks while I sleep." AI reads compost overnight, produces curated digest (redundancies / connections / promote-candidates / outdated items) — ~20 line summary not finished build. Lower budget ($5-15 vs hundreds). Achievable today via Claude Code agent script. Validates pattern before committing to autonomous build infrastructure. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 Code's 10 sparks section.

⭐⭐ 🔭 ARIA one-line thesis: "working with AI without the compounding cost of interruption" (Code spark 2026-05-12)
Sharper than "no continuity tax" — names what users feel, not the jargon. Every interruption compounds; ARIA stops the compounding. Maps cleanly to "frictionless re-entry" (re-entry reverses the compounding). Test alongside existing pitches in real conversations. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐⭐ 🤖 AI-collaboration analytics over time (Code spark 2026-05-12)
Track which AI's response led to which breakthrough. Over months becomes a queryable dataset: which AI is best at architecture / pressure-test / synthesis. Personal routing heuristic. Lives as small AGENT_ANALYTICS.md. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🧠 Compost theme-tree (hierarchy beyond chronological + ⭐ shelf) (Code spark 2026-05-12)
Auto-generated theme clusters via embeddings. Different cut than chronological or strongest. "All cross-AI reconciliation ideas" / "All token economics ideas." Solves the "100 flat items is unreadable" problem. Vector search future idea operationalized. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🧠 Day 1 / 7 / 30 curriculum for user's own system (Code spark 2026-05-12)
WHAT_EXISTS assumes you know the system. Missing: scaffolded onboarding. Future docs/user/LEARN_MY_SYSTEM.md teaches your own shorthands incrementally. Solves "I forget the names" at the source not the symptom. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🧠 The Champion — Skeptic's twin (Code spark 2026-05-12)
Skeptic argues against. AIs default to Champion mode (agreeable) but Champion is INVISIBLE — just agrees, doesn't state its case. Pairing makes both explicit. User sees both arguments before deciding. Balanced reception. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ 🧠 The user IS the Loaded Witness — "ARIA teaches you how to disagree with AI confidently" (Code spark 2026-05-12)
Observation across whole session: user has been the Loaded Witness every time AI convergence drifted. Most users accept whatever AI says — this user doesn't. Real product differentiation: ARIA isn't software that makes AI smarter, it's a system that teaches users to be appropriately skeptical of AI. Sharper consumer-facing positioning. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 META OBSERVATION.

⭐ 🤖 "Incomplete confidence" rule + Self-defense first rule (Code spark 2026-05-12)
Two small but concrete refinements: (1) when asked "did you check ALL?" AI MUST verify before answering. (2) In cross-AI reconciliation, MUST state strongest in OWN answer FIRST before evaluating other. Both address failure modes user named tonight. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

🧠 🤔 Unclear thought capture trigger (Code spark 2026-05-12)
New emoji prefix for half-formed feelings that aren't yet ideas. Different from soc (which assumes words). Captures pre-articulate noticing — "something feels off" without knowing why. Reviewed periodically; some crystallize, some dissolve. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

🧠 The "ambient awareness" need (underlying user hardware ideas) (Code spark 2026-05-12)
User's bubble window / watch / glasses ideas all serve same need: "what's system state right now without asking?" Many UI paths (VS Code status line / sound / color / inbox count) — hardware is just one. Save the NEED separately so future builds don't lock into hardware path prematurely. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12.

⭐ ⭐ 🧠 The Skeptic — 4th LLM role (devil's-advocate by default) (2026-05-12)
User's idea from final intake. Strongest single new idea in the batch. Adds a 4th role to the trio (Code/GPT/Claude/Skeptic). Skeptic argues against by default until idea proves itself. Once solid, gives great input. Addresses "AIs converge too easily" failure mode. Distinct from Claude's pressure-test (which defaults to synthesize). Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐ 🧠 Periodic idea-review session (corpus-scale harvest) (2026-05-12)
When ⭐ shelf hits ~100 items, run all-AI review session. Diff-based / cluster-based / Skeptic-first / vote-based scaling techniques. Knock through compost as it grows. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐ 🧠 Park-this shorthand (non-disruptive flow capture) (2026-05-12)
Distinct from soc/sidequest/hold-that-thought. Pure background capture during flow — AI doesn't engage, just files it and continues. Try in next flow session. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-12.

⭐ 🔭 ARIA as teacher / guardian / third-person overlooker (2026-05-12)
User's deep identity framing from final intake: "ARIA is taking care and watching over but not in a creepy way, just looking and guiding... every llm is third person, ARIA is the overlooker." Foundational identity statement to sit alongside "Frictionless re-entry into previous cognition." Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 MASSIVE IDEA INTAKE section.

⭐ 🤖 Talk to multiple chats at once toggle (2026-05-12)
User idea: manual workflow already happening, formalize as a product toggle. Connects to Blind Trio Round design. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🤖 Cross-chat context combine button (background, no token burn) (2026-05-12)
Combine context of multiple chats for cross-reference. Background processing so it doesn't add to chat token loads. Strong technical insight. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🏗️ Token burner vs token saver user preference (2026-05-12)
User-configurable verbosity. Some users need everything visible; others want concise. Bleeds into every ARIA function. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🏗️ Code can read folders without burning tokens (Glob/Grep don't load files into context) (2026-05-12)
Technical insight worth leveraging. Use for cross-chat context sharing without paste. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🧠 Movable bubble window — real-time context (2026-05-12)
"What's happening" bubble + persistent "YOU do this" bubble. Two UI patterns. Bubbles stay until replaced. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🤖 Auto-detect AI slowdown → trigger handoff (with user-review option) (2026-05-12)
System self-aware degradation triggers handoff sequence. Two modes (user-involved learning vs hands-off automated). ARIA learns user's handoff preferences over time. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🏗️ User-renamable shorthands (preserve function, swap trigger word) (2026-05-12)
Personalization of shorthand layer. Some users want "dump" instead of "soc". Keep underlying behavior. Stored in user-config. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🤖 Overnight cook session — AI reads everything and builds (2026-05-12)
Long-running session where AI fully digests the corpus and builds ARIA project. User walks away for a day. Needs API + budgeting + auto-recovery. Currently doable in partial form via Claude Code + extended thinking. Vision-scale. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-12 intake.

⭐ 🔭 Repo-as-training-data / ARIA built from real use (2026-05-11)
Months of real sessions = natural application architecture. Markdown files = proven data model. CURRENT_HANDOFF.json = validated state schema. LOCKED_ATTRIBUTES = proven governance. Session texture = labeled training data. Friction = UI requirements. Most products build first, discover data model later. ARIA builds the data model THROUGH use, then wraps an interface around proven structure. Wrong simplification: "export markdown, feed to LLM." Actual meaning: the repo IS the spec. The structure encodes the design. Claude saved this from drift before close — loaded witness behavior in action. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Repo-as-training-data section.

⭐ 🔭 Deferred Build Protection — 4-part protocol (2026-05-11)
User flagged the exact failure mode existing safeguards don't fully cover: AIs convince user to "build tomorrow," all clear, fresh AIs gaslight or drift the deferred design. Four protections: (1) DEFERRED_BUILDS.md manifest with spec/rejected-paths/decision-archaeology/unless-clause, (2) Verify-Before-Build mandatory first action (fresh AI restates spec and waits for confirmation), (3) "What changed?" challenge before any deferred work, (4) Decision Archaeology blocks rejected arguments from being re-proposed as novel. Makes drift architecturally hard, not just discouraged. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Deferred Build Protection section.

⭐ 🔭 Fragile Intent List — protection for distortable meanings (2026-05-11)
GPT's contribution. Distinct from DO_NOT_REVISIT. For ideas easily-distorted by fresh AIs: write what it is / what fresh AI might wrongly simplify it into / what it actually means / where it's protected. Examples: "NO IDEA WASTED" risks → "save more aggressively" (wrong) vs "filter at promotion not capture" (right). Live as section, build across sessions don't pre-populate. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Loaded Witness refinements section.

⭐ 🔭 Cross-AI Reconciliation Refinement (6-step protocol extending LOCKED 37) (2026-05-11)
GPT's contribution. When comparing another AI's answer: (1) state strongest in own answer (2) state what's accepted (3) state what's rejected/modified (4) merge compatible strengths (5) principled-disagree when needed (6) preserve user's original intent above AI consensus. Key: "AI convergence is useful signal, not final authority. User intent wins tiebreak." Would have caught tonight's USER_DASHBOARD-build failure mode earlier. Candidate refinement to LOCKED 37. Full entry: docs/system/CANDIDATE_ATTRIBUTES.md 2026-05-11.

⭐ 🔭 Continuity Anchor as alternative name for Loaded Witness (2026-05-11)
GPT's framing. Loaded Witness names the actor; Continuity Anchor names the function. Same role, complementary frames. Plus the refinement: "richest relevant lived context stays anchor" — Claude is OFTEN the best anchor (Projects persistence) but not AUTOMATICALLY. Role can shift to Code or GPT when they have richest relevant lived context for a domain. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Loaded Witness refinements section.

⭐ 🔭 Loaded Witness Rule + staggered clear sequence (2026-05-11)
Continuity requires at least one loaded witness — an AI that was actually present, can challenge fresh-AI reconstruction. Never clear all three simultaneously. Staggered order: Code first → GPT next → Claude last (Claude Projects holds longest via conversation history). Includes: witness statement (~20 line testimony), DO_NOT_REVISIT flag in DECISIONS.md to prevent gaslighting fresh AIs into reopening closed decisions, USER as fourth witness role (validated tonight when user overrode AI yield). Build-while-loaded principle locked: context-dependent artifacts NOW, reference artifacts deferred. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Loaded Witness section.

⭐ 🔭 docs/user/ folder — final refined design (2026-05-11)
Trio-refined: GPT proposed folder separation (docs/user/ for human-facing layer, distinct from docs/system/ AI governance). Three files (eventually): USER_DASHBOARD.md (live cockpit) / HOW_TO_USE_ARIA.md (command reference) / WHAT_EXISTS.md (capability index). Status badges [BUILT] [USABLE] [CANDIDATE] [DESIGNED] [FUTURE] [DEFERRED]. Four new shorthand commands (hold that thought / what were we doing / back to base / system map). Start with ONE file (USER_DASHBOARD), three sections (Reminders / Live State / Quick Captures), split later. Don't build tonight per Code's yield to GPT — honor user's stated next step (explanation pass → close). Anti-bloat rules locked in design. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 docs/user/ folder section.

⭐ 🔭 Five future ARIA product features (from Blind Trio Round design) (2026-05-11)
1. Divergence Lock — hide all responses until ALL submitted (the differentiator)
2. Consensus Map — visualize what all 3 agree on / what only 1 saw / conflicts / outliers
3. Outlier Shelf — preserve strong non-consensus ideas (sometimes the weird one wins)
4. Argument Swap — when AIs disagree, each argues the OTHER's position better
5. User Verdict Layer — final answer not done until user reaction captured

These come from GPT's contribution to the BTR design. All five are about preserving useful disagreement and protecting the user's role as synthesis layer. Full entry: docs/aria/ARIA_IDEAS.md 2026-05-11 Blind Trio Round refinements section.

⭐ 🧠 Everything is a tool — including discomfort (2026-05-09)
Nothing is just a problem. Everything is information.

Discomfort = signal that something needs attention
Friction = signal that a system needs improvement
Confusion = signal that something isn't clear enough yet
Resistance = signal that something might be wrong
Boredom = signal that you're past the interesting part
Excitement = signal that you're close to something real
Avoidance = signal that something has too much cost
Repeating the same explanation = signal that it should be written down
Forgetting something repeatedly = signal that it's a system gap

The reframe: every experience while building is data about the thing being built.

When something annoys you → that's a feature request
When something confuses you → that's a documentation gap
When something scares you → that's a risk worth examining
When something delights you → that's a direction worth following
When something feels heavy → that's coordination overhead
When you avoid something → that's either too costly or wrongly designed

The system should be porous to your experience, not just your instructions. ARIA currently captures what you say. It should also capture what you feel while saying it — not invasively, but as a standing question: "What's the texture of this session?" Heavy? Light? Exciting? Frustrating? That texture is information about the system's health, not just the work's progress.

Full entry: docs/aria/ARIA_IDEAS.md 2026-05-09 Everything is a tool section. Candidate behavior rule in CANDIDATE_ATTRIBUTES.md.

---

## THE HONEST SUBSCRIPTION NUDGE

If a subscribed user hasn't opened the app in 30+ days, send one 
honest notification:

"Hey — you haven't used Uncrumple in a while but you're still 
subscribed. That's not what we want. If work has slowed down or you 
don't need this right now, cancel and come back when you do. 
We'll be here."

Rules:
- Send once only, never repeatedly
- Include a direct link to manage subscription
- No guilt, no dark patterns, no retention tricks
- Do not send if user has been active recently

Why this matters:
Most apps quietly hope you forget so they keep charging you. 
Uncrumple is built for tradespeople who work hard for their money. 
Quietly taking $5 a month from someone who forgot they subscribed is 
exactly the kind of thing this app is supposed to help people avoid.

The goal is not maximum revenue. The goal is that every person paying 
for this app feels like it is worth it. An honest nudge to cancel when 
you're not using it builds more trust than any retention tactic ever 
will. People remember that. They come back. They tell other people.

This is a feature, not a risk.

---

## THE FIRST INVOICE MOMENT

When a user invoices their first client, the app should acknowledge it. 
Not with confetti or a badge. Just one quiet line before the Clean 
Slate screen:

"You just invoiced $847. That's what this is for."

The number should be their actual invoice total. That moment of seeing 
real money tied to real work is the emotional payoff the entire app 
is building toward. It should be named, not just happen silently and 
disappear.

This costs nothing to build and creates a moment people remember.

---

## CLIENT HEALTH INDICATOR ON HOME SCREEN

The client card currently shows a total. It could also show a small 
visual indicator of how clean that client's data is — receipt coverage, 
missing tags, unresolved flags.

Not a number. Not a label. Just a subtle colored signal — something 
between red and green — that lets you scan the home screen and 
instantly know which client needs attention without opening anything.

One glance should tell you the state of your business.

---

## THE "YOU LEFT MONEY ON THE TABLE" ANNUAL NOTIFICATION

Once a year, around tax time, the app calculates how much estimated 
tax savings the user missed because of unreceipted transactions from 
the previous year.

Not a guilt trip. A dollar amount.

"Last year you were missing receipts on $2,340 of expenses. 
That's roughly $515 you could have saved."

That number makes people take receipts seriously in a way that no 
feature or reminder ever will. It connects the daily friction of 
capturing receipts to a real dollar outcome they can understand 
immediately.

---

## THE COLD START SOLUTION

Every new user opens the app and sees nothing. No clients, no 
transactions, no context. That blank state is where most apps lose 
people before they ever get started.

Instead of an empty screen or a feature tour, the first time the app 
opens it should ask one question:

"Who are you working for right now?"

One tap to add a client. Then immediately: "Add your first transaction."

The entire onboarding is just doing the actual thing. No slides. 
No tooltips. No demo data. Just the real workflow, started immediately. 
By the time they've added one client and one transaction they already 
understand the app because they've used it.

---

## MERCHANT MEMORY ACROSS CLIENTS

Right now merchant autocomplete saves names from past transactions. 
It could do one more thing — when you type a merchant name and it 
appears in the suggestion, quietly show which client you usually 
assign that merchant to.

Not forced. Just a ghost suggestion next to the merchant name.
"Usually: Savita."

One tap to confirm or ignore it. No rules screen. No configuration. 
The app learns your patterns from what you actually do and reflects 
them back to you at the moment you need them.

This is the rules engine working invisibly.

---

## THE MATERIALS FLOAT TRACKER

When you buy materials for a job, there is a window of time before 
you get reimbursed where that money is floating — it is gone from 
your account but not yet paid back by the client. That gap is real 
and stressful for tradespeople managing their own cash flow.

The app could track this explicitly. A "floating" total that shows 
how much of your own money is currently out on jobs. Not invoiced 
yet. Not reimbursed yet. Just out there working for someone else 
while your account sits lower than it should.

Showing that number gives tradespeople something they almost never 
have: a real-time view of their cash position on active jobs.

This connects naturally to the payment tracking system and the 
You're Owed section on the home screen.

---

## YEAR-OVER-YEAR ON THE TAX SCREEN

The tax screen currently shows this year's numbers. What tradespeople 
actually want to know is: am I doing better than last year?

A simple comparison line under the main totals:

"vs last year: +$1,240 logged, +$272 estimated savings"

No chart. No graph. Just the delta. That one line turns the tax screen 
from a calculator into a financial progress indicator. It tells you 
whether your habits are improving over time without requiring you to 
think about it.

This requires transactions to store year in their date field, which 
is a known future data model fix.

---

## THE "ALL CAUGHT UP" MOMENT

When the user closes out a week with all transactions tagged, 
receipted, and no Needs Attention items — the app should notice.

Not a badge. Not a streak counter. Not a notification.

Just a quiet line on the home screen where Needs Attention used to be:

"You're all caught up."

That state — being current, having nothing outstanding, knowing 
everything is handled — is exactly the feeling the app is designed 
to create. It should be named when it happens so the user knows 
they achieved it. Most apps only tell you when something is wrong. 
This one should also tell you when everything is right.

---

## THE QUIET MONTH DETECTOR

If a client has had no transactions in 45 days, add a subtle 
indicator on their card. Not a warning. Not a notification. 

Just a quiet visual signal — maybe the client card fades slightly, 
or a small line appears: "Last activity: 6 weeks ago."

This is useful for contractors with ongoing relationships where 
a quiet period might mean the job wound down without being officially 
closed out. It prompts a natural check-in: did that job finish? 
Is there anything left to invoice? Did I capture everything?

It turns the client list from a static directory into a living 
record of active and quiet relationships.

---

## INVOICE PREVIEW BEFORE SENDING

Before an invoice goes to the client, show the user exactly what 
the client will see. Not an edit screen. An actual preview that 
looks like a finished invoice.

This does two things. It makes the app feel professional — like 
something worth charging for. And it catches errors before they 
reach the client. A wrong total, a missing line item, a transaction 
assigned to the wrong job — all of these are easier to catch in 
preview than to fix after the client has already seen the invoice.

"Does this look right?" is a question every tradesperson asks before 
handing over paperwork. The app should ask it for them.

---

## THE RECEIPT EXPIRATION WARNING

Thermal receipts fade. Most people don't know this until they need 
the receipt for taxes or reimbursement and it's a blank piece of 
paper.

If a transaction has a receipt photo that was added more than 90 days 
ago, the app could add a quiet note to the transaction:

"This receipt may be fading. Verify the photo is still readable."

Not an alert. Not urgent. Just a flag that shows up when you open 
that transaction so you can check before it becomes a problem.

This is the kind of thing that makes someone say: "I never would 
have thought of that." And then they tell someone else about the app.

---

## THE DUPLICATE TRANSACTION ALERT

If a user adds a transaction with the same merchant, same amount, 
and same date as one that already exists — pause before saving.

"This looks like a duplicate. You already have a $45.00 charge from 
Shell on Apr 14. Add anyway?"

Two options: Yes add it, or No cancel.

No blocking. No forced review. Just a quiet catch that prevents 
the kind of double-entry mistake that throws off totals and causes 
confusion at invoice time.

---

## SPLIT PURCHASE FLOW

Some purchases are part business, part personal. A Costco run where 
you bought lumber and snacks. An Amazon order with work supplies and 
a birthday present. This happens constantly and right now the app 
has no clean way to handle it.

The split purchase flow would let the user divide one transaction 
into two parts:

- $67 business → assign to client or tag as business expense
- $23 personal → assign to Personal bucket

Both parts come from the same original transaction amount. The total 
stays the same. The assignment gets split.

This is one of the most common real-world scenarios that existing 
tools handle badly. Uncrumple should handle it naturally.

Requires the Expense Buckets system to exist first. 
Do not build until buckets are built.

---

## SMART ONBOARDING THROUGH FIRST ACTION

Instead of asking users to configure anything on first launch, 
let the first real action teach them the whole system.

Flow:
1. "Who are you working for?" → creates first client
2. "What did you spend?" → creates first transaction
3. "Got a receipt?" → teaches receipt capture
4. "What was it for?" → teaches tags
5. Done — they're in the app with real data

No demo mode. No sample data to delete. No tutorial slides.
Just their actual first use of the app, guided one step at a time.

By the end they have a real client with a real tagged transaction 
and a receipt photo. They understand the app because they used it, 
not because someone explained it.

---

## THE REBATE TRACKER

Some purchases come with mail-in rebates or store rebates that 
need to be tracked. Buy $200 of materials at Menards, get a $20 
rebate check in the mail six weeks later.

A simple rebate flag on a transaction:
- Mark as "has rebate"
- Enter expected rebate amount
- Mark rebate as received when it arrives

The tax screen or a separate view shows total pending rebates and 
total received. 

This is the kind of hyper-specific tradesperson feature that generic 
apps never think of and that makes someone say "this app actually 
understands my work."

---

## CARD REWARDS OPTIMIZATION

When a user is about to add a transaction, the app knows which 
merchant they're at and which cards they have saved. It could 
quietly suggest which card to use based on the card strategy labels.

"At Home Depot — your Business Card gets 2x on hardware."

Not a financial advisor. Not a complex system. Just a one-line 
suggestion at the moment of capture that helps the user maximize 
the cards they already have.

Requires cards system to have a rewards/category field.
Save for after core systems are stable.

---

## THE JOB PROFITABILITY ESTIMATE

For clients where the user tracks both hours (via clock in) and 
materials (via transactions), the app could estimate job profitability.

Hours × hourly rate + materials = estimated cost
Invoice total = estimated revenue
Difference = estimated profit or loss

Not accounting software. Not exact. Just a quick gut check that 
answers the question every tradesperson has at the end of a job:
"Did I make money on this one?"

Requires hours tracking and invoice system to both be built first.

---

## OFFLINE-FIRST AS A MARKETING POINT

Most competitor apps require internet. Bank connections, cloud sync, 
AI features — all of it needs connectivity.

Uncrumple works completely offline. That is not just a technical 
decision — it is a selling point for tradespeople who work in 
basements, crawl spaces, rural job sites, and anywhere else with 
no signal.

"Works anywhere you work" is a real differentiator that should be 
in the app store description, the onboarding, and anywhere the app 
introduces itself.

This does not require building anything. It requires saying it clearly.

---

## THE "THIS MONTH VS GOAL" BAR

If the user sets a monthly income goal — even a rough one — the 
home screen could show a simple progress bar.

"$2,400 invoiced of $4,000 goal — 60%"

No pressure. No gamification. Just a quiet indicator of where they 
are in the month relative to where they want to be. The kind of 
thing you glance at once a day and it keeps you oriented without 
demanding your attention.

---

## ANNUAL ODOMETER REMINDER

On January 1st every year, send one notification:

"Start of year — take a photo of your odometer for your tax records."

That's it. Simple. Most self-employed people miss this deduction 
entirely because they forget to document the starting mileage. 
One notification on January 1st fixes that permanently.

This is the kind of feature that someone tells their accountant 
about and the accountant says "that's actually really smart."

---

## BLUETOOTH CLOCK-IN

When the user's phone connects to a Bluetooth device labeled 
as "Work Vehicle," the app quietly asks:

"Heading to a job? Clock in?"

One tap yes. One tap no. No friction.

When they disconnect from the work vehicle Bluetooth, 
the app asks:

"Back from the job? Clock out?"

The entire mileage and hours log happens through a prompt that 
takes one tap and interrupts nothing. No GPS running in background. 
No battery drain. Just Bluetooth connection events that are already 
happening anyway.

---

## THE ACCOUNTANT EXPORT PACKAGE

At tax time, the user should be able to generate one package that 
their accountant can actually use:

- CSV of all transactions with tags, amounts, dates, clients
- PDF summary by category and client
- Receipt photos organized by month or client
- Mileage log
- Invoice history with paid/unpaid status

One button. One package. Everything the accountant needs.

This replaces the shoebox of receipts and the "I'll figure it out 
in April" approach that costs tradespeople real money every year.

This is the end-state version of the export feature. 
Build individual pieces first. Package them together last.

---

## THE "REMIND ME WHEN I'M BACK" FEATURE

Sometimes a tradesperson gets a bank notification for a transaction 
while they're in the middle of something — on a ladder, driving, 
mid-conversation with a client.

They can't deal with it right now. But they don't want to forget it.

One tap: "Remind me in 2 hours."

The transaction goes into a holding queue. Two hours later: 
"You had a transaction to review — $67 at Menards."

This is the Later Queue from the roadmap, but framed correctly. 
It's not a filing system. It's a "not right now" button with a 
guaranteed follow-up.

Requires notification listener. Build after that is stable.

---

## VOICE CAPTURE (FUTURE)

While driving or on a job site, the user should be able to say:

"$45 at Shell, fuel, Savita's job."

The app parses it, creates the transaction, applies the tag, 
assigns the client. One sentence. Done.

This is not close to buildable yet. It requires the rules engine, 
merchant memory, and client assignment to all be mature enough 
that the parsing can be reliable. A wrong assignment is worse 
than no capture at all.

Save for when the rest of the system is solid enough to make 
voice capture trustworthy.

---

## THE THERMAL RECEIPT REMINDER

When a user adds a receipt photo, start a 90-day timer in the 
background. After 90 days, add a quiet flag to that transaction:

"This receipt may be fading — verify the photo is still readable."

Thermal receipt paper fades. Most people don't know this until 
they need the receipt and it's blank. This feature costs almost 
nothing to build — it's just a date check — and it prevents the 
kind of loss that makes someone say "I should have known better."

The best features solve problems people didn't know they had 
until the problem was already solved.

---

## Incoming / Unsorted

## BEHAVIOR TRANSFER > STATE TRANSFER

The most important realization about the handoff system:

Carrying state forward (JSON with features, next steps, working features) is not 
enough to reconstruct the same assistant. What actually gets lost between sessions 
is reasoning style, workflow rhythm, interaction patterns, and discipline.

This is why assistant_behavior_clone, LOCKED_ATTRIBUTES, and the SYSTEM EVOLUTION 
RULE exist — they carry HOW the assistant thinks, not just WHAT it knows.

When evaluating any handoff quality, ask: "Could the next chat continue accurately 
AND feel like the same thinking partner?" If only the first part is true, the 
handoff is incomplete.

---

## THE DEVELOPMENT OPERATING SYSTEM (DevOS)

This is the most important idea in this file.

What it is:
The file structure and workflow system built during Uncrumple 
development is not app-specific. It is a reusable AI-assisted 
development operating system. The app (Uncrumple) is the payload. 
The system is the operating environment.

System layer files (reusable on any project):
- LOCKED_ATTRIBUTES.md — permanent behavioral rules
- CANDIDATE_ATTRIBUTES.md — staging for possible rules
- DECISIONS.md — why choices were made
- ANTI_PATTERNS.md — what must never be repeated
- KNOWN_UNKNOWNS.md — dangerous deferred ambiguity
- INVARIANTS.md — constitutional truths
- GLOSSARY.md — shared semantic meaning
- SESSION_LOG.md — confirmed change history
- CURRENT_HANDOFF.json — behavioral state transfer
- HANDOFF_GENERATOR.md — how to clone the AI
- HANDOFF_RECEIVER.md — how to resume from clone
- CLAUDE.md — execution rules for Claude Code
- DID_YOU_KNOW.md — accumulated tips
- WORKFLOW_IDEAS.md — accumulated process ideas

App layer files (Uncrumple-specific, replace per project):
- ROADMAP.md — this app's future
- CLAUDE_CLEVER_IDEAS.md — this app's saved feature ideas
- APP_MAP.md, DATA_FLOW.md, USER_FLOWS.md etc

The three-role system (also reusable):
- User = director and vision holder
- Planning AI (GPT/Claude chat) = continuity, prompts, evolution
- Execution AI (Claude Code) = patches only, never plans

What needs to be built to make this reusable:
1. SYSTEM_README.md — origin story, what each file does, 
   how to deploy fresh on a new project
2. SYSTEM_EVOLUTION.md — version history of the DevOS itself, 
   session by session, so the system's own growth is traceable
3. Clear folder separation: docs/system/ = OS layer, 
   docs/ = app layer
4. Eventually: a template repo others can fork, a CLI that 
   scaffolds the structure, a course explaining the philosophy

Why this matters:
Every developer using AI hits the same problems within weeks:
- context degradation between sessions
- role confusion between planning and execution
- behavioral drift as rules get forgotten
- lost decisions that get relitigated
- no way to transfer AI behavior across chats

This system solved all of those. Systematically. 
That solution is the product.

Connection to existing saved idea:
The entry "The AI development workflow system built for Uncrumple 
could itself become a product" in ROADMAP.md is this same idea 
at an earlier stage. This entry supersedes it with full detail.

Build order:
1. Finish Uncrumple using this system (proof of concept)
2. Extract and document the system layer separately
3. Package as template/CLI/course
4. Build DevOS as its own product if demand exists

Do not build DevOS yet. Uncrumple ships first.
This entry exists so the idea is fully preserved when the 
time comes.


PRE-CLEAR SYNTHESIS SESSION — 2026-05-09

META-RULE: No idea gets wasted. Reading one idea sparks a better idea or 
builds on it. Save everything. The user will read all of it.

GPT's 12 ideas (strongest first):
1. Pre-handoff "weakest link" question — before handoff, each AI gets: 
   "What would break first if you weren't here next session?" Generative, 
   not reactive.
2. Asymmetric question allocation per role — Code: "What's hidden in the 
   file structure that would surprise a fresh Code?" GPT: "What's true about 
   how I think now that isn't in any file?" Claude: "What would I push back 
   on if I read this system clean?"
3. Coordination-overhead tax meter — each candidate gets "estimated tax: 
   low/medium/high" to make the trade-off explicit.
4. APP_LOG vs ARIA_LOG — split SESSION_LOG.md so app progress and ARIA 
   evolution are separately trackable.
5. Deferral counter on app issues — track how many sessions each known issue 
   got deferred. After N defers, force a decision: ship, kill, or escalate.
6. Handoff dress rehearsal — before /clear, Code pretends to be fresh, reads 
   only what a new Code would read, tries to answer "what's next_step and 
   why?" Catches gaps before they matter.
7. Uncrumple ↔ ARIA isomorphism as deliberate design tool — every time 
   Uncrumple introduces a UX pattern, check if ARIA needs the equivalent. 
   Same shape: field work with imperfect data → cleanup flow → evidence trail.
8. GPT generation drift tracking — BEHAVIORAL_FINGERPRINT.md with 5 
   standardized questions answered each handoff. Compare across GPT instances 
   to see drift quantitatively.
9. Anti-pattern: system explaining the system — if docs/system grows faster 
   than app features, that's a regression signal. Possible CLAUDE.md rule: 
   governance file count >2× shipped feature count = prioritize app next session.
10. End-of-session survey — every handoff, GPT and Code answer: (1) What 
    surprised me? (2) What did I almost get wrong? (3) What's the next user 
    pain I see? (4) What pattern emerged? (5) What would I tell my clone in 
    one sentence?
11. Pre-mortem before promotion — before ANY candidate gets promoted to 
    LOCKED, one required round of: "What's the strongest argument against 
    this?" Make the ad-hoc pressure-test a standing ceremony step.
12. Receipt photo as ARIA primitive — every behavioral claim gets an attached 
    "receipt" (conversation moment, commit, diff). Not abstract validation, 
    evidence. Builds trust when AIs say "I did X" — the receipt is right there.

Claude's additions:
13. Seed idea in starter block — inject one generative prompt from the 
    previous session's pre-clear synthesis window into the fresh AI's first 
    message. Primes thinking direction without requiring full context rebuild.
14. "All caught up" = recovery confidence score — when Uncrumple Needs 
    Attention hits zero, app should say something. When ARIA continuity 
    reconstruction hits sufficient coverage, ARIA should say something. Same 
    emotional primitive. Neither currently does this.
15. Rule attribution on auto-tagged transactions — "applied by rule: [rule 
    name]" on any transaction tagged by the rules engine. Makes automation 
    transparent. Trust feature, not complexity feature.
16. Clone regeneration frequency as stability signal — track regeneration 
    level (1/2/3) per session in SYSTEM_EVOLUTION.md. If Level 3 every 
    session = system still in flux. 10 sessions on Level 1 = stable. 
    Empirical stability curve over time.


---
PRE-CLEAR SYNTHESIS HARVEST — 2026-05-09 (categorized by emoji per NO IDEA WASTED rule)
Full idea cluster from loaded-AI synthesis window. All ideas preserved.
Some duplicates with the flat list above — preserved per save-everything rule.
Organized by emoji category for navigation. ⭐ flagged items also appear in shelf at top.
---

## 🏗️ Handoff Process Ideas

⭐ 🏗️ Pre-handoff "weakest link" question
Before any handoff, each AI gets: "What would break first if you weren't here next session?" Generative, not reactive. Different from candidate review (rule-shaped). 8+ hours of context = maximum system fragility visibility.

⭐ 🏗️ Asymmetric question allocation per role
Same question to all three roles wastes their different vantage points.
- Code: "What's hidden in the file structure that would surprise a fresh Code?"
- GPT: "What's true about how I think now that isn't in any file?"
- Claude: "What would I push back on if I read this system clean?"

🏗️ Handoff dress rehearsal
Before /clear, Code pretends to be fresh. Reads only what a new Code would read. Tries to answer "what's next_step and why?" If gaps appear, patch BEFORE clear. Cheap dry run that catches orientation gaps nobody notices until the next session starts wrong.

🏗️ Tiered clone regeneration / clone delta packets
Level 1 = normal clear (wrap/log/commit/starter). Level 2 = targeted clone refresh (only affected sections). Level 3 = full clone regeneration (when clone substrate changed). Decision heuristic: 0-1 yes = L1, 2-3 yes = L2, 4+ yes = L3. Prevents overusing full regeneration ceremony.

⭐ 🏗️ Pre-mortem before promotion
Before ANY candidate gets promoted to LOCKED, one required round: "What's the strongest argument against this?" Today's pressure-test was ad hoc. Make it a standing ceremony step regardless of whether Claude is in the trio.

🏗️ End-of-session survey — 5 standardized questions
Every handoff, GPT and Code answer:
1. What surprised me?
2. What did I almost get wrong?
3. What's the next user pain I see?
4. What pattern emerged?
5. What would I tell my clone in one sentence?
Standardized = comparable across sessions. Becomes longitudinal dataset. "What would I tell my clone in one sentence" is the best one.

🏗️ Role-specific last words (GPT idea)
Each role gets one final lane before clear:
- GPT: What continuity will future GPT lose?
- Claude: What structure is unstable?
- Code: What file/process truth is not obvious?
- User: What still feels wrong?

🏗️ Unknown-value sweep (GPT idea)
At handoff, ask: "What became obvious to you that the user may not realize is valuable?" The AI notices patterns the user is too tired to name.

🏗️ Harvest before compression (GPT idea)
Before any /clear, one short final question: "Anything valuable in your current context that will be expensive to rediscover later?" Lightweight version for normal clears.

🏗️ Seed idea in starter block
Inject one generative prompt from the previous session's pre-clear synthesis window into the fresh AI's first message. Primes thinking direction without requiring full context rebuild. Starter block is currently static — should be dynamic.

🏗️ Diff-as-input for GPT review
Right now GPT gets a narrative summary. A structured diff — old value vs new value per field in the clone — would let GPT do real behavioral sanity-checking instead of narrative review. Concrete improvement to Block C.

🏗️ HANDOFF_CHEATSHEET as interactive decision tree
Not a static doc but a flowchart: "Did command meanings change? → yes → did role behavior change? → yes → full regen." The heuristic already exists — format it as something followable under pressure when tired.

## 🤖 ARIA System Ideas

⭐ 🤖 The "ask the loaded AI" pattern as ARIA primitive
ARIA should eventually know when a session is ending and prompt for Pre-Clear Synthesis Window automatically. Trigger: session approaching clear, context heavy, valuable synthesis window closing. That's detectable.

⭐ 🤖 "No continuity tax" as sharper ARIA pitch
Current: "Pick up exactly where your brain left off."
Candidate: "No continuity tax."
Names the cost being eliminated rather than the capability being added. Psychologically more motivating.

🤖 Continuity debt counter
Track: unresolved branches, deferred decisions, staleness of active next_step. A rough estimate in handoff JSON would make health check command meaningful instead of vibes-based.

🤖 Recovery fidelity is currently unmeasured
After fresh-chat restoration, no systematic check exists for how complete the recovery was. A recovery audit checklist — run at end of restoration — would answer this instead of hoping reconstruction was complete.

🤖 Clone regeneration frequency as stability signal
Track Level 1/2/3 per session in SYSTEM_EVOLUTION.md. Frequent Level 3 = system in flux. Sustained Level 1 = stable. Empirical stability curve.

⭐ 🤖 Handoff as product demo, not just infrastructure
The demo: watch a session drop, watch it reconstruct perfectly. That's visceral. Every AI power user hits this problem within weeks. The handoff system is one of the most demonstrable ARIA differentiators.

🤖 Expansion vs consolidation as explicit ARIA design principle
Every time about to add a new file or section, ask: is this expansion (adds layers) or consolidation (reduces lookup surface)? Consolidation is almost always better. Validated today with HANDOFF_CHEATSHEET.

🤖 Session closing as first-class cognitive event
The moment before clear is uniquely valuable — maximum context, minimum future. ARIA should treat this window as a scheduled synthesis opportunity, not just a cleanup step.

🤖 Receipt photo as ARIA primitive
Every behavioral claim ("LOCKED 37 was validated") gets an attached receipt — link to conversation moment, commit, file diff. Not abstract claims, evidence. Builds trust when AIs say "I did X" — receipt is right there. Maps directly to Uncrumple → ARIA isomorphism.

⭐ 🤖 High-Signal Shelf architecture
Layer stack:
IDEA_COMPOST.md = everything, raw, preserved
HIGH_SIGNAL_IDEAS.md = worth rereading first
CONNECTED_IDEAS.md = ideas that link to each other (future)
ROADMAP.md = worth building
CANDIDATE_ATTRIBUTES.md = worth testing as behavior
LOCKED_ATTRIBUTES.md = proven
Do not build files yet. Save the architecture.

🤖 User's notes app = highest-signal capture
Maintained independently, without AI prompting, without filtering. When shared, treat as gold mine. Save everything, categorize everything, flag strong items ⭐. Already passed through user's synthesis layer once. Goes to High-Signal Shelf, not raw compost.

🤖 Ambient capture — buildable now with zero infrastructure
Simple end-of-session prompt: "What's still in your head that isn't captured anywhere?" Most primitive version of ambient capture. No launcher, no OS, no new tooling required.

🤖 "Future-me filter" as reusable decision lens (GPT idea)
Will this reduce future continuity tax, or create more system to maintain? May eventually deserve locked-rule status if it keeps proving itself.

🤖 "Friction-to-feature conversion" (GPT idea)
Every time "this is annoying" — ask: is this a product feature, a workflow rule, or just fatigue? Irritation often exposes hidden coordination burden.

## 🧠 Trio System Ideas

🧠 The skeptic role is missing
Right now GPT and Claude both tend toward synthesis and validation. Actively trying to break an idea is a different cognitive mode. "What would break this?" should be a formal handoff review step, not something that happens only when Claude notices something feels off.

🧠 Escalation path for GPT/Claude disagreement
When both AIs think they're right and neither is clearly wrong, it lands on the user to arbitrate. That's orchestration burden. A designated escalation path — third-party prompt structure forcing both to argue the opposing position — before user decides.

🧠 Asymmetric load balancing for trio
Some sessions are pure execution (Code heavy, planning AIs light). Some are pure architecture (planning AIs heavy, Code idle). Explicit modes that match resource allocation to session type. "Execution mode" should mean something concrete about how often GPT and Claude are consulted.

## 🏗️ Continuity Infrastructure Ideas

⭐ 🏗️ APP_LOG vs ARIA_LOG separation
SESSION_LOG.md conflates two products. Today had zero app code but heavy ARIA work — goes in same log. Split into APP_LOG and ARIA_LOG or tag each entry. Can't currently ask "how many sessions has Uncrumple actually advanced this month vs ARIA?"

🏗️ Deferral counter on app issues
The keyboard issue has been deferred 4+ sessions. receipt/receiptUri longer. Track defers per known issue. After N defers, force decision: ship, kill, or escalate. Prevents permanent debt accumulation.

🏗️ Dynamic starter block
Currently static — same block every session. Should include one-line summary of active session context: what's in progress, last confirmed patch, next step. Code should never start cold when that information exists.

🏗️ Coordination-overhead tax meter
Every new rule, file, or candidate has a cost: reading time, application time, drift risk. CANDIDATE_ATTRIBUTES could include "estimated tax: low/medium/high." Forces trade-off explicit. Supports #14 candidate.

🏗️ GPT generation drift tracking — empirical version
BEHAVIORAL_FINGERPRINT.md per GPT instance. 5 standardized questions answered the same way each handoff. Compare GPT-1 to GPT-3 answers and see drift quantitatively, not subjectively. Questions need to be ambiguous enough to reveal drift, not so simple every instance answers identically.

⭐ 🏗️ Anti-pattern: system explaining the system
If docs/system/ grows faster than app/, that's a regression signal. ARIA exists to support the app. Possible CLAUDE.md rule: "If governance file count >2× shipped feature count this month, prioritize app work next session."

🏗️ Uncrumple ↔ ARIA isomorphism as deliberate design tool
Every time Uncrumple introduces a UX pattern, check if ARIA needs the equivalent. Same shape: imperfect data + cleanup flow + evidence trail. Make the cross-pollination a deliberate design method, not accidental.

## 📱 Uncrumple App Ideas

⭐ 📱 "All caught up" moment — emotional payoff
When Needs Attention hits zero, nothing happens. That's a missed opportunity every time a user achieves it. Even one line: "You're all caught up." Costs maybe 10 lines of code. Should be on next prompt list.

⭐ 📱 Date problem — trust issue before launch
Transactions stored without year means tax screen is lying to users. "2026 Summary" showing 2025 data is not minor UX — it's a trust problem with the exact audience being built for. Tradespeople who find wrong tax numbers won't come back. Needs to move up before launch, not after.

⭐ 📱 Undo for destructive actions — 5-second toast
No undo exists anywhere. Delete a transaction or client = gone. Tradespeople on job sites make accidental deletes. A 5-second undo toast before delete commits would eliminate this entire class of data loss. Asymmetric: very low build cost, very high trust impact.

⭐ 📱 Crumpled → flat Save button progression
Ties brand metaphor directly to core interaction. Keeps getting deferred. Should move higher in priority after flagged flow is verified. Highest-leverage UI idea in the saved ideas list.

📱 "Why was I here?" transaction history
Show when transaction was created, when receipt was added, how many times opened, what's still missing. Smallest viable version of ARIA's reconstruction snapshot concept. Proves the principle on tiny data. Low implementation cost, high conceptual value.

📱 Receipt state: attached / missing / unavailable
The one data model gap actively blocking real user behavior. A lost receipt can never be cleared from Missing Receipts queue. Adding "unavailable" state is not as complex as it sounds — just a third state. Coordinated store change required but small.

📱 Rule attribution on auto-tagged transactions
"Applied by rule: [rule name]" on any transaction tagged by rules engine. Tradesperson who sees unexpected tag has no idea why. Makes automation transparent. Trust feature, not complexity feature.

📱 Manage Merchants in Settings
Merchant autocomplete grows forever with no pruning. After a year: dozens of typo variants and old merchants. Simple list you can delete from. Low complexity, meaningful quality-of-life improvement.

## 🤖 Meta Ideas

⭐ 🤖 AIs capture. User synthesizes. Never reverse this.
The user is the synthesis layer. AIs capture everything raw. Reading one idea sparks a better idea or builds on it. Cannot know in advance which captured idea will be the connection point for the most important insight. This is both a design principle and a preservation rule.

🤖 Loaded-AI window is asymmetric by direction
Currently: extract ideas from loaded AIs before clear. Missing: inject best ideas back into fresh AI's first message. Seed idea in starter block primes thinking direction without requiring full context reconstruction.

🤖 "All caught up" = recovery confidence score
Same emotional primitive: when Needs Attention hits zero, app says something. When ARIA continuity reconstruction hits sufficient coverage, ARIA says something. Neither currently does this. Both should.

🤖 Connection layer between compost and high-signal
CONNECTED_IDEAS.md = ideas that link to each other. User's synthesis process works by linking ideas, not just ranking them. An idea that connects two other ideas is often more valuable than either alone.

⭐ 🧠 Everything is a tool — see ## ⭐ You Should Really Look At These at top of file

# GLOSSARY.md

Purpose:
Shared definitions that prevent semantic drift between the user, 
Claude, GPT, and future AI sessions. When a term is used in this 
project it means exactly what is defined here — not the general 
English meaning.

---

## Terms

**Cleanup flow**
A guided transaction-resolution workflow entered from a filtered 
Explore context (flagged, missing, untagged). Always resolves 
back to the originating filter when txNeedsCleanup returns false.

**Smart return**
Automatic navigation back to the originating filtered Explore 
list once the last cleanup issue on a transaction is resolved.

**txNeedsCleanup**
The canonical single-source-of-truth function that determines 
whether a transaction still needs cleanup. Returns true if 
receipt is missing, tags are missing, or flagged is true.

**Sidequest**
A brief intentional interruption with a defined purpose and 
explicit return to the main task afterward. Different from SOC 
which is raw idea capture.

**SOC**
Stream of consciousness — a raw idea dump during a session. 
Captured, classified, and returned to main task. Not acted on 
immediately unless explicitly requested.

**Candidate attribute**
A pattern or rule noticed during a session that is useful but 
unproven. Lives in CANDIDATE_ATTRIBUTES.md until reviewed and 
either promoted to LOCKED_ATTRIBUTES or rejected.

**Invariant**
A truth that must remain true or the app or system breaks 
conceptually. Stronger than a rule — violation requires 
explicit deliberate decision, not just approval.

**Wrap session**
The end-of-session sync command that updates SESSION_LOG, 
CURRENT_HANDOFF.json, ROADMAP, commits to git, runs doc 
cleanup, and provides the starter block.

**Clear**
The Claude Code command that triggers wrap session automatically 
then resets context. One word does everything.

**Handoff**
The full behavioral and state transfer between sessions. 
Includes JSON state, LOCKED_ATTRIBUTES, CANDIDATE_ATTRIBUTES, 
and all system files. Goal is continuation not restart.

**Three-role system**
User = director and vision holder. GPT = planner, continuity 
engine, prompt writer. Claude Code = executor only. 
Claude (chat) = systems thinking partner, verifier, 
idea expander.

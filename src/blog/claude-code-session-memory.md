---
title: "Adding Session Memory to Claude Code with Hooks"
date: "2024-12-12"
slug: "claude-code-session-memory"
tags: ["claude-code", "ai", "developer-tools", "automation", "featured"]
---

Claude Code is a powerful AI coding assistant, but it has a limitation: when you restart it, all conversation context is lost. You're back to square one, re-explaining what you were working on.

This post shows how to use Claude Code's hook system to automatically save and restore session context across restarts.

## The Problem

Claude Code runs as an interactive CLI session. During a session, Claude builds up context about your codebase, the task at hand, and decisions you've made together. But that context lives only in memory.

When you restart Claude Code (to reload an MCP server, for example), you lose everything:

- What files you were working on
- The approach you'd agreed upon
- Debugging context and hypotheses
- Task progress

You could manually summarize and re-paste context, but that's tedious and error-prone.

## The Solution: Session Hooks

Claude Code provides lifecycle hooks that run shell commands at specific events. Two hooks are particularly useful:

| Hook | When it runs |
|------|--------------|
| `SessionEnd` | When Claude Code exits (quit, clear, logout) |
| `SessionStart` | When Claude Code starts or resumes |

By combining these, we can:
1. Save metadata about the session when it ends
2. Load that metadata when a new session starts
3. Give Claude automatic context about what you were working on

## Implementation

### Hook Configuration

Add hooks to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/load-context.sh"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/save-context.sh"
          }
        ]
      }
    ]
  }
}
```

The `matcher` field can filter by working directory pattern. Empty string matches all directories.

### Save Context Hook

The `SessionEnd` hook receives JSON on stdin with session metadata. We extract the working directory and find recently modified files:

```bash
#!/bin/bash
# ~/.claude/hooks/save-context.sh
# Save lightweight session metadata on session end

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
REASON=$(echo "$INPUT" | jq -r '.reason // "unknown"')

if [ -n "$CWD" ]; then
  CONTEXT_FILE="$CWD/.claude/last-session.json"
  mkdir -p "$CWD/.claude"

  # Get recently modified files (last 30 min)
  RECENT_FILES=$(find "$CWD" -type f \
    \( -path "*/src/*" -o -path "*/.claude/*" -o -name "*.md" \) \
    -mmin -30 2>/dev/null \
    | grep -v node_modules \
    | grep -v ".git/" \
    | head -20 \
    | jq -R -s 'split("\n") | map(select(length > 0))')

  # Save metadata
  cat > "$CONTEXT_FILE" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "session_id": "$SESSION_ID",
  "exit_reason": "$REASON",
  "cwd": "$CWD",
  "recent_files": $RECENT_FILES,
  "note": "Review these files to restore context from previous session"
}
EOF
fi

exit 0
```

This creates a `.claude/last-session.json` file in each project:

```json
{
  "timestamp": "2024-12-12T22:45:00Z",
  "session_id": "abc123",
  "exit_reason": "exit",
  "cwd": "/Users/dev/my-project",
  "recent_files": [
    "/Users/dev/my-project/src/index.ts",
    "/Users/dev/my-project/CLAUDE.md"
  ],
  "note": "Review these files to restore context from previous session"
}
```

### Load Context Hook

The `SessionStart` hook checks for saved context and outputs a reminder:

```bash
#!/bin/bash
# ~/.claude/hooks/load-context.sh
# Load previous session context on session start

INPUT=$(cat)
CWD=$(echo "$INPUT" | jq -r '.cwd // empty')
SOURCE=$(echo "$INPUT" | jq -r '.source // "startup"')

CONTEXT_FILE="$CWD/.claude/last-session.json"

# Only load on fresh startup, not resume/compact
if [ "$SOURCE" = "startup" ] && [ -f "$CONTEXT_FILE" ]; then
  TIMESTAMP=$(jq -r '.timestamp // empty' "$CONTEXT_FILE")
  RECENT_FILES=$(jq -r '.recent_files // [] | join(", ")' "$CONTEXT_FILE")

  # Check if context is less than 24 hours old
  if [ -n "$TIMESTAMP" ]; then
    EPOCH_TIME=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$TIMESTAMP" +%s 2>/dev/null || echo 0)
    CONTEXT_AGE=$(( $(date +%s) - $EPOCH_TIME ))

    if [ "$CONTEXT_AGE" -lt 86400 ]; then
      # Format: "Thu Dec 12 at 10:45 PM"
      READABLE_DATE=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$TIMESTAMP" "+%a %b %d at %I:%M %p" 2>/dev/null || echo "$TIMESTAMP")
      echo "Previous session ended $READABLE_DATE. Recently modified files: $RECENT_FILES"
    fi
  fi
fi

exit 0
```

Key details:
- Only triggers on `startup`, not `resume` or `compact` (which preserve context)
- Ignores context older than 24 hours
- Outputs human-readable text that Claude sees as context

### Making Hooks Executable

```bash
chmod +x ~/.claude/hooks/save-context.sh
chmod +x ~/.claude/hooks/load-context.sh
```

## How It Works

The hook system passes data via stdin (JSON input) and stdout (context output):

```
┌─────────────────────────────────────────────────────────────┐
│                    SessionEnd Hook                          │
│                                                             │
│   stdin (JSON):                                             │
│   {                                                         │
│     "session_id": "abc123",                                 │
│     "cwd": "/Users/dev/project",                            │
│     "reason": "exit",                                       │
│     "transcript_path": "~/.claude/projects/.../session.jsonl"│
│   }                                                         │
│                                                             │
│   Hook saves: .claude/last-session.json                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   SessionStart Hook                         │
│                                                             │
│   stdin (JSON):                                             │
│   {                                                         │
│     "session_id": "def456",                                 │
│     "cwd": "/Users/dev/project",                            │
│     "source": "startup"                                     │
│   }                                                         │
│                                                             │
│   stdout (added to Claude's context):                       │
│   "Previous session ended Thu Dec 12 at 10:45 PM.           │
│    Recently modified files: src/index.ts, CLAUDE.md"        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Why Not Save the Full Transcript?

Claude Code stores full conversation transcripts at `transcript_path`. You might be tempted to save and reload these directly, but there are issues:

1. **Size**: Transcripts grow large quickly. Loading a huge context on startup wastes tokens and can exceed limits.

2. **No compaction**: The transcript includes every message, even superseded ones. Claude's `/compact` command creates summaries, but there's no way to trigger it from a hook.

3. **Stale context**: Yesterday's debugging session about a bug you've since fixed isn't helpful—it's confusing.

The lightweight approach (just file paths and timestamps) gives Claude enough to ask intelligent questions or proactively read relevant files, without the baggage.

## Extending the Approach

### Add Task Summaries

Modify `save-context.sh` to prompt for a summary:

```bash
# Add to save-context.sh
if [ -t 0 ]; then
  read -p "Session summary (optional): " SUMMARY
  # Include $SUMMARY in the JSON output
fi
```

### Project-Specific Context

Use the `matcher` field to run different hooks per project:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*/my-special-project",
        "hooks": [
          {
            "type": "command",
            "command": "$HOME/.claude/hooks/special-project-context.sh"
          }
        ]
      }
    ]
  }
}
```

### Track Git State

Include branch and uncommitted changes:

```bash
GIT_BRANCH=$(cd "$CWD" && git branch --show-current 2>/dev/null)
GIT_STATUS=$(cd "$CWD" && git status --porcelain 2>/dev/null | head -10)
```

## Limitations

- **No automatic compaction**: You still need to manually run `/compact` for long sessions
- **macOS date syntax**: The `date -j` flag is macOS-specific; Linux needs different syntax
- **Hook failures are silent**: If a hook errors, Claude Code continues without the context

## Conclusion

Claude Code's hook system enables lightweight session persistence without complex infrastructure. By saving just enough context—recently modified files and timestamps—we can restore working memory across restarts.

The full code is available in this post. Drop the scripts in `~/.claude/hooks/`, update your settings, and your next session will know where you left off.

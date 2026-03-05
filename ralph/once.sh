#!/bin/bash

commits=$(git log -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No commits found")

claude --permission-mode acceptEdits \
  "Previous commits: $commits @ralph/prompt.md"

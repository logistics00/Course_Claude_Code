#!/bin/bash

ralph_commits=$(git log --grep="RALPH" -n 5 --format="%H%n%ad%n%B---" --date=short 2>/dev/null || echo "No RALPH commits found")

claude --permission-mode acceptEdits \
  "Previous RALPH commits: $ralph_commits @ralph/prompt.md"

#!/usr/bin/env bash
set -euo pipefail

# Project environment setup. Use this to install dependencies and prime
# caches for sandboxes, worktrees, and project-level setup. Keep commands
# idempotent. Lives at .oneworld/setup.sh; the dashboard linter runs
# `bash -n` on this file before opening a PR.

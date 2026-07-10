#!/usr/bin/env bash
#
# list-codex-sessions.sh
# 列出 ~/.codex/sessions/ 下的所有会话 (session id)，按修改时间倒序排列并显示时间。
#
# 用法:
#   ./list-codex-sessions.sh            # 表格输出（时间 + session id）
#   ./list-codex-sessions.sh -i         # 只输出 session id（一行一个，便于管道）
#   SESSIONS_DIR=/path ./list-codex-sessions.sh   # 自定义目录

set -euo pipefail

SESSIONS_DIR="${SESSIONS_DIR:-$HOME/.codex/sessions}"
ID_ONLY=0
[[ "${1:-}" == "-i" || "${1:-}" == "--id-only" ]] && ID_ONLY=1

if [[ ! -d "$SESSIONS_DIR" ]]; then
  echo "目录不存在: $SESSIONS_DIR" >&2
  exit 1
fi

# 从文件名中提取标准 UUID 格式的 session id（8-4-4-4-12 十六进制）。
# 兼容两种命名:  <uuid>.jsonl  以及  rollout-<时间戳>-<uuid>.jsonl
extract_id() {
  local base="$1"
  if [[ "$base" =~ ([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}) ]]; then
    printf '%s\n' "${BASH_REMATCH[1]}"
  else
    printf '%s\n' "${base%.jsonl}"   # 兜底：去掉扩展名
  fi
}

# 收集 "<mtime纪元秒>\t<文件路径>"，递归查找所有 .jsonl，按 mtime 倒序。
# 用 stat 取纪元秒（macOS/BSD 语法），排序后再格式化为可读时间。
rows="$(
  find "$SESSIONS_DIR" -type f -name '*.jsonl' -print0 \
    | xargs -0 stat -f '%m%t%N' 2>/dev/null \
    | sort -rn
)"

if [[ -z "$rows" ]]; then
  echo "没有找到任何 .jsonl 会话文件于: $SESSIONS_DIR" >&2
  exit 0
fi

if [[ "$ID_ONLY" -eq 1 ]]; then
  while IFS=$'\t' read -r _epoch path; do
    extract_id "$(basename "$path")"
  done <<< "$rows"
  exit 0
fi

# 表头
printf '%-20s  %s\n' "MODIFIED" "SESSION ID"
printf '%-20s  %s\n' "--------------------" "------------------------------------"

while IFS=$'\t' read -r epoch path; do
  when="$(date -r "$epoch" '+%Y-%m-%d %H:%M:%S')"
  printf '%-20s  %s\n' "$when" "$(extract_id "$(basename "$path")")"
done <<< "$rows"

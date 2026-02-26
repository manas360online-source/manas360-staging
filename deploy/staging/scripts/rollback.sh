#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
UPSTREAM_DIR="$ROOT_DIR/deploy/staging/nginx/upstreams"

CURRENT="blue"
if grep -q "frontend_green" "$UPSTREAM_DIR/frontend_active.conf"; then
  CURRENT="green"
fi

TARGET="blue"
if [[ "$CURRENT" == "blue" ]]; then
  TARGET="green"
fi

echo "Rolling back from $CURRENT to $TARGET"
"$ROOT_DIR/deploy/staging/scripts/switch-color.sh" "$TARGET"

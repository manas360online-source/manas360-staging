#!/usr/bin/env bash
set -euo pipefail

COLOR=${1:-}
if [[ "$COLOR" != "blue" && "$COLOR" != "green" ]]; then
  echo "Usage: $0 <blue|green>"
  exit 1
fi

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
UPSTREAM_DIR="$ROOT_DIR/deploy/staging/nginx/upstreams"
COMPOSE_FILE="$ROOT_DIR/deploy/staging/docker-compose.staging.yml"
ENV_FILE="$ROOT_DIR/.env.staging"
COMPOSE_CMD=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE")

if [[ "$COLOR" == "blue" ]]; then
  echo "server frontend_blue:80 max_fails=3 fail_timeout=10s;" > "$UPSTREAM_DIR/frontend_active.conf"
  echo "server backend_blue:5001 max_fails=3 fail_timeout=10s;" > "$UPSTREAM_DIR/backend_active.conf"
else
  echo "server frontend_green:80 max_fails=3 fail_timeout=10s;" > "$UPSTREAM_DIR/frontend_active.conf"
  echo "server backend_green:5001 max_fails=3 fail_timeout=10s;" > "$UPSTREAM_DIR/backend_active.conf"
fi

"${COMPOSE_CMD[@]}" exec -T nginx nginx -s reload

echo "Switched live traffic to: $COLOR"

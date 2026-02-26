#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
COMPOSE_FILE="$ROOT_DIR/deploy/staging/docker-compose.staging.yml"
UPSTREAM_DIR="$ROOT_DIR/deploy/staging/nginx/upstreams"
ENV_FILE="$ROOT_DIR/.env.staging"
COMPOSE_CMD=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE")

FRONTEND_IMAGE=${1:-${FRONTEND_IMAGE:-}}
BACKEND_IMAGE=${2:-${BACKEND_IMAGE:-}}

if [[ -z "$FRONTEND_IMAGE" || -z "$BACKEND_IMAGE" ]]; then
  echo "Usage: $0 <frontend_image> <backend_image>"
  exit 1
fi

ACTIVE_COLOR="blue"
if grep -q "frontend_green" "$UPSTREAM_DIR/frontend_active.conf"; then
  ACTIVE_COLOR="green"
fi

TARGET_COLOR="green"
if [[ "$ACTIVE_COLOR" == "green" ]]; then
  TARGET_COLOR="blue"
fi

echo "Active color: $ACTIVE_COLOR"
echo "Deploying to: $TARGET_COLOR"

export FRONTEND_IMAGE BACKEND_IMAGE

"${COMPOSE_CMD[@]}" pull "frontend_${TARGET_COLOR}" "backend_${TARGET_COLOR}" || true
"${COMPOSE_CMD[@]}" up -d --no-deps "frontend_${TARGET_COLOR}" "backend_${TARGET_COLOR}" nginx

# Wait for backend health
for i in {1..30}; do
  STATUS=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}starting{{end}}' "manas360-backend-${TARGET_COLOR}" 2>/dev/null || echo "starting")
  if [[ "$STATUS" == "healthy" ]]; then
    echo "Backend $TARGET_COLOR healthy"
    break
  fi
  sleep 2
  if [[ $i -eq 30 ]]; then
    echo "Backend $TARGET_COLOR failed health check"
    exit 1
  fi
done

"$ROOT_DIR/deploy/staging/scripts/switch-color.sh" "$TARGET_COLOR"

echo "Deployment complete. Previous color ($ACTIVE_COLOR) kept as rollback candidate."

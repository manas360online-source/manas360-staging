#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
COMPOSE_FILE="$ROOT_DIR/deploy/staging/docker-compose.staging.yml"
ENV_FILE="$ROOT_DIR/.env.staging"
COMPOSE_CMD=(docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE")

"${COMPOSE_CMD[@]}" run --rm --profile tools certbot renew --webroot -w /var/www/certbot

"${COMPOSE_CMD[@]}" exec -T nginx nginx -s reload

echo "Certificates renewed and nginx reloaded"

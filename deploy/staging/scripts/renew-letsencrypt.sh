#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
COMPOSE_FILE="$ROOT_DIR/deploy/staging/docker-compose.staging.yml"

docker compose -f "$COMPOSE_FILE" run --rm --profile tools certbot renew --webroot -w /var/www/certbot

docker compose -f "$COMPOSE_FILE" exec -T nginx nginx -s reload

echo "Certificates renewed and nginx reloaded"

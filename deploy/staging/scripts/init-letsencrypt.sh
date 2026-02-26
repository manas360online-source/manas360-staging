#!/usr/bin/env bash
set -euo pipefail

DOMAIN=${1:-staging.example.com}
EMAIL=${2:-devops@example.com}
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
COMPOSE_FILE="$ROOT_DIR/deploy/staging/docker-compose.staging.yml"

mkdir -p "$ROOT_DIR/deploy/staging/nginx/upstreams"

docker compose -f "$COMPOSE_FILE" up -d nginx

docker compose -f "$COMPOSE_FILE" run --rm --profile tools certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos --no-eff-email

docker compose -f "$COMPOSE_FILE" exec -T nginx nginx -s reload

echo "Let's Encrypt certificate issued for $DOMAIN"

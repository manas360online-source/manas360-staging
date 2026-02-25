BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE refresh_tokens
  ADD COLUMN IF NOT EXISTS family_id UUID,
  ADD COLUMN IF NOT EXISTS replaced_by UUID,
  ADD COLUMN IF NOT EXISTS reuse_detected_at TIMESTAMPTZ;

UPDATE refresh_tokens
SET family_id = id
WHERE family_id IS NULL;

ALTER TABLE refresh_tokens
  ALTER COLUMN family_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_family_id
  ON refresh_tokens(family_id);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_replaced_by
  ON refresh_tokens(replaced_by);

CREATE TABLE IF NOT EXISTS admin_login_challenges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fingerprint_hash TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_login_challenges_user
  ON admin_login_challenges(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_login_challenges_expiry
  ON admin_login_challenges(expires_at)
  WHERE used_at IS NULL;

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  event_id VARCHAR(128) PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  signature TEXT,
  payload JSONB NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'received',
  error_message TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_status
  ON payment_webhook_events(status, received_at DESC);

COMMIT;

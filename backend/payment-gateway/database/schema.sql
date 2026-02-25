-- ═══════════════════════════════════════════════════
--  MANAS360 PAYMENT SCHEMA
--  Run once: psql -d manas360 -f 001_payment_schema.sql
-- ═══════════════════════════════════════════════════

-- ─── 1. PAYMENTS (every transaction attempt) ───
CREATE TABLE IF NOT EXISTS payments (
  id                  SERIAL PRIMARY KEY,
  transaction_id      VARCHAR(64) UNIQUE NOT NULL,
  user_id             VARCHAR(64) NOT NULL,
  plan_id             VARCHAR(32) NOT NULL,
  amount_paise        INTEGER NOT NULL,
  source_screen       VARCHAR(64),            -- which screen triggered it
  therapist_id        VARCHAR(64),            -- NULL if platform-only
  track_id            VARCHAR(64),            -- for à la carte tracks
  metadata            JSONB DEFAULT '{}',
  status              VARCHAR(16) DEFAULT 'INITIATED',
                      -- INITIATED | PENDING | SUCCESS | FAILED | REFUNDED
  phonepe_ref         VARCHAR(128),
  phonepe_payment_id  VARCHAR(128),
  payment_method      VARCHAR(32),            -- UPI | CARD | NETBANKING | WALLET
  error_code          VARCHAR(64),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);


-- ─── 2. SUBSCRIPTIONS (one row per user) ───
CREATE TABLE IF NOT EXISTS subscriptions (
  id                      SERIAL PRIMARY KEY,
  user_id                 VARCHAR(64) UNIQUE NOT NULL,
  plan_id                 VARCHAR(32) NOT NULL,
  status                  VARCHAR(16) DEFAULT 'active',
                          -- active | expired | cancelled | payment_failed
  starts_at               TIMESTAMPTZ NOT NULL,
  ends_at                 TIMESTAMPTZ NOT NULL,
  payment_transaction_id  VARCHAR(64),
  auto_renew              BOOLEAN DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);


-- ─── 3. SETTLEMENTS (revenue split tracking) ───
CREATE TABLE IF NOT EXISTS settlements (
  id              SERIAL PRIMARY KEY,
  transaction_id  VARCHAR(64) REFERENCES payments(transaction_id),
  therapist_id    VARCHAR(64) NOT NULL,
  total_amount    INTEGER NOT NULL,       -- paise
  provider_share  INTEGER NOT NULL,       -- 60% in paise
  platform_share  INTEGER NOT NULL,       -- 40% in paise
  status          VARCHAR(16) DEFAULT 'pending',
                  -- pending | settled | failed
  settled_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settlements_therapist ON settlements(therapist_id);


-- ─── 4. AUDIT LOG (every payment event) ───
CREATE TABLE IF NOT EXISTS audit_log (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(64),
  action      VARCHAR(64) NOT NULL,
  details     JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);

-- ─── 5. ANALYTICS QUERIES (For Dashboard) ───

-- Monthly Recurring Revenue (MRR)
-- SELECT
--   DATE_TRUNC('month', created_at) AS month,
--   COUNT(*) AS transactions,
--   SUM(amount_paise) / 100 AS revenue_inr,
--   SUM(CASE WHEN plan_id = 'premium_monthly' THEN amount_paise ELSE 0 END) / 100 AS monthly_rev,
--   SUM(CASE WHEN plan_id = 'premium_yearly' THEN amount_paise ELSE 0 END) / 100 AS yearly_rev
-- FROM payments
-- WHERE status = 'SUCCESS'
-- GROUP BY 1 ORDER BY 1 DESC;

-- Conversion by Source Screen
-- SELECT
--   source_screen,
--   COUNT(*) AS attempts,
--   COUNT(*) FILTER (WHERE status = 'SUCCESS') AS success,
--   ROUND(COUNT(*) FILTER (WHERE status = 'SUCCESS') * 100.0 / NULLIF(COUNT(*), 0), 1) AS conversion_pct
-- FROM payments
-- GROUP BY source_screen
-- ORDER BY conversion_pct DESC;

-- Therapist Settlements (pending payouts)
-- SELECT
--   s.therapist_id,
--   COUNT(*) AS pending_txns,
--   SUM(s.provider_share) / 100 AS pending_payout_inr
-- FROM settlements s
-- WHERE s.status = 'pending'
-- GROUP BY s.therapist_id
-- ORDER BY pending_payout_inr DESC;

-- Expiring Subscriptions (next 7 days)
-- SELECT
--   u.user_id, u.name, u.email,
--   s.plan_id, s.ends_at, s.auto_renew
-- FROM subscriptions s
-- JOIN users u ON u.user_id = s.user_id
-- WHERE s.status = 'active'
--   AND s.ends_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
-- ORDER BY s.ends_at;

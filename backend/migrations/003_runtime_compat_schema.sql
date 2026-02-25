BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
  ('guest', 'Guest user with limited access'),
  ('user', 'Regular authenticated user'),
  ('subscriber', 'Paid subscriber'),
  ('admin', 'Administrator with full access')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC';
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip INET;

UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role_id IS NULL AND r.name = 'user';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'users' AND constraint_name = 'users_role_fk'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_role_fk
      FOREIGN KEY (role_id) REFERENCES roles(id);
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO permissions (name, description) VALUES
  ('read_profile', 'Can view own profile'),
  ('update_profile', 'Can update own profile'),
  ('view_analytics', 'Can view analytics dashboard'),
  ('manage_users', 'Can manage users'),
  ('manage_subscriptions', 'Can manage subscriptions'),
  ('manage_payments', 'Can manage payment operations')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role_id, permission_id)
);

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('read_profile', 'update_profile')
WHERE r.name = 'user'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('read_profile', 'update_profile', 'view_analytics', 'manage_users', 'manage_subscriptions', 'manage_payments')
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  tier INTEGER NOT NULL DEFAULT 0,
  price_monthly_paise INTEGER DEFAULT 0,
  price_annual_paise INTEGER DEFAULT 0,
  billing_period_days INTEGER DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO subscription_plans (name, description, tier, price_monthly_paise, billing_period_days, is_active) VALUES
  ('Free', 'Get started for free', 1, 0, 30, true),
  ('Basic', 'For individuals', 10, 49900, 30, true),
  ('Premium', 'For professionals', 50, 149900, 30, true),
  ('Enterprise', 'For organizations', 100, 499900, 30, true)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO features (name, description, category) VALUES
  ('premium_dashboard', 'Advanced analytics dashboard', 'analytics'),
  ('premium_themed_rooms', 'Premium themed meditation rooms', 'features'),
  ('api_access', 'REST API access', 'integrations')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plan_id, feature_id)
);

INSERT INTO plan_features (plan_id, feature_id)
SELECT sp.id, f.id
FROM subscription_plans sp
JOIN features f ON (
  (sp.name = 'Basic' AND f.name = 'api_access') OR
  (sp.name = 'Premium' AND f.name IN ('api_access', 'premium_dashboard', 'premium_themed_rooms')) OR
  (sp.name = 'Enterprise' AND f.name IN ('api_access', 'premium_dashboard', 'premium_themed_rooms'))
)
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled', 'failed')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  payment_transaction_id VARCHAR(255),
  auto_renew BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  merchant_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  payment_gateway VARCHAR(50) DEFAULT 'PhonePe',
  amount_paise INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'cancelled')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themed_room_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  background_url VARCHAR(500),
  audio_url VARCHAR(500),
  duration_minutes INTEGER DEFAULT 10,
  is_premium BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  category VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO themed_room_themes (name, description, is_premium, category) VALUES
  ('Ocean Waves', 'Calming ocean ambient sounds', false, 'nature'),
  ('Mountain Peak', 'Mountains at sunrise - premium experience', true, 'nature'),
  ('Forest Rain', 'Rain in the forest sounds', true, 'nature')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS themed_room_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme_id UUID NOT NULL REFERENCES themed_room_themes(id),
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  session_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

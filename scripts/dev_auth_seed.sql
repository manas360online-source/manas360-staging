CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type VARCHAR(30);
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

UPDATE users
SET user_type = CASE
  WHEN role='patient' THEN 'patient'
  WHEN role='therapist' THEN 'psychologist'
  WHEN role='admin' THEN 'corporate_admin'
  ELSE 'patient'
END
WHERE user_type IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_number_unique ON users(phone_number) WHERE phone_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10),
  otp_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone_created ON otp_verifications(phone_number, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_otp_phone_active ON otp_verifications(phone_number, is_verified, expires_at);

CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  refresh_token TEXT,
  device_info JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

INSERT INTO users (id, email, full_name, role, user_type, phone_number, profile_completed, is_verified, is_active)
VALUES
  (gen_random_uuid(), 'patient.dev@manas360.com', 'Dev Patient', 'patient', 'patient', '+919876543210', true, true, true),
  (gen_random_uuid(), 'admin.dev@manas360.com', 'Dev Admin', 'admin', 'corporate_admin', '+919876543211', true, true, true)
ON CONFLICT (email) DO UPDATE
SET phone_number = EXCLUDED.phone_number,
    user_type = EXCLUDED.user_type,
    profile_completed = EXCLUDED.profile_completed,
    is_verified = EXCLUDED.is_verified,
    is_active = EXCLUDED.is_active;

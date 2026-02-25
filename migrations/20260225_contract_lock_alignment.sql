-- PHASE 1: Contract lock migration for unified /api/v1 runtime
-- Idempotent migration to align live schema with controller contracts

BEGIN;

-- -------------------------------------------------------------------
-- USERS TABLE ALIGNMENT
-- -------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- full_name <-> first_name/last_name mapping
UPDATE users
SET first_name = split_part(full_name, ' ', 1)
WHERE first_name IS NULL AND full_name IS NOT NULL;

UPDATE users
SET last_name = NULLIF(btrim(substring(full_name FROM length(split_part(full_name, ' ', 1)) + 1)), '')
WHERE last_name IS NULL AND full_name IS NOT NULL;

UPDATE users
SET full_name = btrim(concat_ws(' ', first_name, last_name))
WHERE (full_name IS NULL OR full_name = '') AND (first_name IS NOT NULL OR last_name IS NOT NULL);

-- -------------------------------------------------------------------
-- ROLE STRUCTURE ALIGNMENT
-- -------------------------------------------------------------------
INSERT INTO roles (id, name, description, created_at)
VALUES
  (gen_random_uuid(), 'admin', 'Platform admin', NOW()),
  (gen_random_uuid(), 'user', 'Standard user', NOW()),
  (gen_random_uuid(), 'subscriber', 'Subscribed user', NOW()),
  (gen_random_uuid(), 'guest', 'Guest user', NOW())
ON CONFLICT (name) DO NOTHING;

-- map legacy users.role text -> users.role_id
UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role_id IS NULL
  AND u.role IS NOT NULL
  AND lower(u.role) = lower(r.name);

-- default unresolved role_id to user role
UPDATE users u
SET role_id = r.id
FROM roles r
WHERE u.role_id IS NULL
  AND r.name = 'user';

-- Ensure FK exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_fk'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_role_fk
      FOREIGN KEY (role_id) REFERENCES roles(id);
  END IF;
END $$;

-- Relax and normalize role check for compatibility
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_role_check'
  ) THEN
    ALTER TABLE users DROP CONSTRAINT users_role_check;
  END IF;
END $$;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (
    role IS NULL OR role IN ('admin', 'therapist', 'patient', 'user', 'subscriber', 'guest')
  );

-- Ensure role text mirrors role_id when possible
UPDATE users u
SET role = r.name
FROM roles r
WHERE u.role_id = r.id
  AND (u.role IS NULL OR u.role <> r.name);

-- Ensure known admin accounts retain admin privileges after role normalization
UPDATE users u
SET role_id = r.id,
    role = 'admin'
FROM roles r
WHERE r.name = 'admin'
  AND lower(u.email) IN ('admin@manas360.com', 'admin@example.com', 'support@manas360.com');

-- -------------------------------------------------------------------
-- SUBSCRIPTION TABLE ALIGNMENT
-- -------------------------------------------------------------------
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- -------------------------------------------------------------------
-- SAFETY INDEXES
-- -------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_number_unique
  ON users(phone_number)
  WHERE phone_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status, ends_at);

COMMIT;

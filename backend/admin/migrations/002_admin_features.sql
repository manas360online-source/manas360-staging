-- ============================================
-- MANAS360 Session Analytics - Admin Features Migration
-- Story 3.6: Session Analytics
-- ============================================

-- 1. Add is_verified column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_name VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- 3. Seed some sample subscription data
INSERT INTO subscriptions (user_id, plan_name, status, start_date, end_date, amount, currency)
SELECT 
    id, 
    'Premium Monthly', 
    'active', 
    CURRENT_TIMESTAMP - INTERVAL '10 days', 
    CURRENT_TIMESTAMP + INTERVAL '20 days', 
    29.99, 
    'USD'
FROM users 
WHERE role = 'patient'
LIMIT 5;

-- 4. Update some therapists to be verified
UPDATE users SET is_verified = true WHERE id IN (SELECT id FROM users WHERE role = 'therapist' LIMIT 2);

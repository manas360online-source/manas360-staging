-- ═══════════════════════════════════════════════════════════════
--  MANAS360 PRODUCTION SAAS DATABASE SCHEMA
--  Complete architecture for multi-tenant SaaS with RBAC
--  Migration: 002_create_saas_core_schema.sql
-- ═══════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════
-- 1. ROLES TABLE - Role-Based Access Control
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    privilege_level INTEGER NOT NULL,
    -- privilege_level: 0=Guest, 10=User, 50=Subscriber, 90=Admin, 100=SuperAdmin
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_active ON roles(is_active);

-- Seed default roles
INSERT INTO roles (name, description, privilege_level) VALUES
    ('guest', 'Free user - limited access', 0),
    ('user', 'Registered user - core features', 10),
    ('subscriber', 'Paid subscriber - premium access', 50),
    ('admin', 'Admin user - platform management', 90),
    ('superadmin', 'Super admin - all access', 100)
ON CONFLICT (name) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 2. PERMISSIONS TABLE - Fine-grained access control
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,  -- e.g., "users", "payments", "settings"
    action VARCHAR(20) NOT NULL,    -- e.g., "read", "create", "update", "delete"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_resource ON permissions(resource);
CREATE UNIQUE INDEX idx_permissions_resource_action ON permissions(resource, action);

-- Seed default permissions
INSERT INTO permissions (name, description, resource, action) VALUES
    ('read_profile', 'View own profile', 'profile', 'read'),
    ('update_profile', 'Update own profile', 'profile', 'update'),
    ('delete_account', 'Delete own account', 'profile', 'delete'),
    ('view_dashboard', 'Access dashboard', 'dashboard', 'read'),
    ('view_payments', 'View payment history', 'payments', 'read'),
    ('manage_users', 'Manage all users', 'users', 'manage'),
    ('manage_subscriptions', 'Manage subscriptions', 'subscriptions', 'manage'),
    ('view_analytics', 'View analytics', 'analytics', 'read'),
    ('manage_features', 'Manage features', 'features', 'manage'),
    ('audit_logs', 'View audit logs', 'audit', 'read')
ON CONFLICT (name) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 3. ROLE-PERMISSION MAPPING - RBAC Junction
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- Seed role-permission mappings
-- User can read profile and view dashboard
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'user' AND p.name IN ('read_profile', 'update_profile', 'view_dashboard')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Subscriber has all user permissions plus premium features
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'subscriber' AND p.name IN (
    'read_profile', 'update_profile', 'delete_account', 
    'view_dashboard', 'view_payments'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Admin has management permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin' AND p.name IN (
    'manage_users', 'manage_subscriptions', 'view_analytics', 'audit_logs'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- SuperAdmin has all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'superadmin'
ON CONFLICT (role_id, permission_id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 4. FEATURES TABLE - Subscription feature definitions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),  -- e.g., "analytics", "integrations", "support"
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_features_active ON features(is_active);
CREATE INDEX idx_features_category ON features(category);

-- Seed common SaaS features
INSERT INTO features (name, description, category) VALUES
    ('premium_dashboard', 'Advanced analytics dashboard', 'analytics'),
    ('api_access', 'REST API access', 'integrations'),
    ('webhook_support', 'Webhook integration support', 'integrations'),
    ('sso_oauth', 'Single Sign-On (OAuth)', 'authentication'),
    ('custom_domains', 'Custom domain support', 'platform'),
    ('priority_support', 'Priority email support', 'support'),
    ('24_7_support', '24/7 phone support', 'support'),
    ('data_export', 'Export data in multiple formats', 'data'),
    ('advanced_reporting', 'Advanced reporting tools', 'analytics'),
    ('audit_logs', 'Comprehensive audit logs', 'security'),
    ('ip_whitelisting', 'IP whitelisting', 'security'),
    ('team_collaboration', 'Team collaboration tools', 'team'),
    ('unlimited_users', 'Unlimited team members', 'team'),
    ('white_label', 'White label capabilities', 'platform')
ON CONFLICT (name) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 5. SUBSCRIPTION PLANS TABLE - Plan definitions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    tier INTEGER NOT NULL,                -- 1=Free, 10=Starter, 50=Pro, 100=Enterprise
    price_monthly_paise INTEGER,           -- NULL for free plan
    price_annual_paise INTEGER,            -- NULL for annual pricing
    billing_period_days INTEGER,
    max_users INTEGER,
    max_api_requests_per_month INTEGER,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    trial_period_days INTEGER DEFAULT 0,   -- Days free trial
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plans_tier ON subscription_plans(tier);
CREATE INDEX idx_plans_active ON subscription_plans(is_active);

-- Seed subscription plans
INSERT INTO subscription_plans (
    name, description, tier, price_monthly_paise,
    price_annual_paise, billing_period_days, max_users,
    max_api_requests_per_month, trial_period_days, is_featured
) VALUES
    ('Free', 'Get started for free', 1, NULL, NULL, 0, 1, 100, 0, false),
    ('Starter', 'For individuals', 10, 49900, 499900, 30, 1, 10000, 7, false),
    ('Pro', 'For professionals', 50, 99900, 999900, 30, 5, 100000, 14, true),
    ('Business', 'For teams', 70, 299900, 2999900, 30, 50, 1000000, 14, false),
    ('Enterprise', 'Custom for organizations', 100, NULL, NULL, 365, -1, -1, 30, false)
ON CONFLICT (name) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 6. PLAN-FEATURE MAPPING - Which features in each plan
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS plan_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(plan_id, feature_id)
);

CREATE INDEX idx_plan_features_plan ON plan_features(plan_id);
CREATE INDEX idx_plan_features_feature ON plan_features(feature_id);

-- Assign features to plans
-- Free plan: minimal features
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id FROM subscription_plans p, features f
WHERE p.name = 'Free' AND f.name IN ('premium_dashboard', 'data_export')
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- Pro plan: most popular features
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id FROM subscription_plans p, features f
WHERE p.name = 'Pro' AND f.name IN (
    'premium_dashboard', 'api_access', 'webhook_support', 'custom_domains',
    'priority_support', 'data_export', 'advanced_reporting', 'audit_logs',
    'team_collaboration'
)
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- Business plan: all features except custom
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id FROM subscription_plans p, features f
WHERE p.name = 'Business' AND f.name NOT IN ('white_label')
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- Enterprise plan: all features
INSERT INTO plan_features (plan_id, feature_id)
SELECT p.id, f.id FROM subscription_plans p, features f
WHERE p.name = 'Enterprise'
ON CONFLICT (plan_id, feature_id) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- 7. ENHANCED USERS TABLE - Core user data with all fields
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255),             -- NULL if OTP-based auth only
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- Role & Status
    role_id UUID NOT NULL REFERENCES roles(id) DEFAULT (
        SELECT id FROM roles WHERE name = 'guest'
    ),
    
    -- Profile
    profile_picture_url VARCHAR(500),
    bio TEXT,
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Security
    two_factor_enabled BOOLEAN DEFAULT false,
    twofa_secret TEXT,                      -- For TOTP
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE   -- Soft delete
);

-- Indexes for performance
CREATE UNIQUE INDEX idx_user_accounts_email ON user_accounts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_accounts_role ON user_accounts(role_id);
CREATE INDEX idx_user_accounts_active ON user_accounts(is_active, deleted_at);
CREATE INDEX idx_user_accounts_created ON user_accounts(created_at);
CREATE INDEX idx_user_accounts_verified ON user_accounts(is_verified);


-- ═══════════════════════════════════════════════════════════════
-- 8. TOKENS TABLE - JWT refresh tokens & API keys
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    
    token_type VARCHAR(20),     -- 'refresh', 'api_key', 'reset', 'verify'
    token_hash VARCHAR(255) NOT NULL,
    
    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    last_used_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tokens_user ON tokens(user_id);
CREATE INDEX idx_tokens_expires ON tokens(expires_at);
CREATE INDEX idx_tokens_revoked ON tokens(revoked_at) WHERE revoked_at IS NULL;
CREATE INDEX idx_tokens_type ON tokens(token_type);


-- ═══════════════════════════════════════════════════════════════
-- 9. USER SUBSCRIPTIONS - Subscription instances
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    
    -- Period
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    -- active | expired | cancelled | paused | failed
    
    -- Billing
    auto_renew BOOLEAN DEFAULT true,
    payment_method VARCHAR(50),
    last_payment_id UUID,
    next_billing_at TIMESTAMP WITH TIME ZONE,
    
    -- Trial
    is_trial BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_active ON user_subscriptions(user_id, status)
    WHERE status = 'active' AND ends_at > CURRENT_TIMESTAMP;
CREATE INDEX idx_user_subscriptions_expires ON user_subscriptions(ends_at);


-- ═══════════════════════════════════════════════════════════════
-- 10. AUDIT LOG - Track all authentication & access events
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(id),
    
    event_type VARCHAR(50) NOT NULL,
    -- login, logout, register, password_change, 2fa_enabled, permission_denied, etc.
    
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    
    action VARCHAR(20),           -- read, create, update, delete
    status VARCHAR(20),           -- success, failure
    
    ip_address INET,
    user_agent TEXT,
    details JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_event ON audit_logs(event_type, created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);


-- ═══════════════════════════════════════════════════════════════
-- 11. RATE LIMIT TRACKING - For API rate limiting
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS rate_limit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(id),
    endpoint VARCHAR(255),
    ip_address INET,
    request_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_rate_limit_user ON rate_limit_logs(user_id, endpoint, created_at);
CREATE INDEX idx_rate_limit_ip ON rate_limit_logs(ip_address, endpoint, created_at);


-- ═══════════════════════════════════════════════════════════════
-- 12. SESSION TOKENS - Active user sessions
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    
    access_token_hash VARCHAR(255),
    
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(20),  -- web, mobile, desktop
    
    last_activity TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
CREATE INDEX idx_sessions_active ON sessions(user_id, expires_at)
    WHERE expires_at > CURRENT_TIMESTAMP;


-- ═══════════════════════════════════════════════════════════════
-- VIEWS - Common queries for application
-- ═══════════════════════════════════════════════════════════════

-- User with current subscription and plan details
CREATE OR REPLACE VIEW vw_users_with_subscription AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.is_active,
    r.name as role_name,
    r.privilege_level,
    sp.name as plan_name,
    sp.tier as plan_tier,
    us.status as subscription_status,
    us.starts_at,
    us.ends_at,
    us.auto_renew,
    (us.ends_at > CURRENT_TIMESTAMP AND us.status = 'active') AS is_subscription_active,
    EXTRACT(DAY FROM us.ends_at - CURRENT_TIMESTAMP) AS days_remaining
FROM user_accounts u
LEFT JOIN roles r ON u.role_id = r.id
LEFT JOIN user_subscriptions us ON u.id = us.user_id 
    AND us.status = 'active' 
    AND us.ends_at > CURRENT_TIMESTAMP
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE u.deleted_at IS NULL;


-- User features based on subscription
CREATE OR REPLACE VIEW vw_user_features AS
SELECT DISTINCT
    u.id as user_id,
    f.id as feature_id,
    f.name as feature_name,
    f.category,
    sp.name as plan_name
FROM user_accounts u
LEFT JOIN user_subscriptions us ON u.id = us.user_id 
    AND us.status = 'active' 
    AND us.ends_at > CURRENT_TIMESTAMP
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
LEFT JOIN plan_features pf ON sp.id = pf.plan_id
LEFT JOIN features f ON pf.feature_id = f.id
WHERE u.deleted_at IS NULL AND f.is_active = true;


COMMIT;

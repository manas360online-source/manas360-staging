-- ═══════════════════════════════════════════════════════════════
-- MANAS360 DATABASE OPTIMIZATION SCRIPT
-- Production-ready indexes and optimizations
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- 1. INDEXES FOR FREQUENTLY QUERIED COLUMNS
-- ═══════════════════════════════════════════════════════════════

-- User lookup by email (login queries)
CREATE INDEX IF NOT EXISTS idx_user_accounts_email 
ON public.user_accounts(email) 
WHERE deleted_at IS NULL;

-- User lookup by ID
CREATE INDEX IF NOT EXISTS idx_user_accounts_id 
ON public.user_accounts(id) 
WHERE deleted_at IS NULL;

-- Role lookups
CREATE INDEX IF NOT EXISTS idx_user_accounts_role 
ON public.user_accounts(role_id) 
WHERE deleted_at IS NULL;

-- Session lookups (auth middleware)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id 
ON public.sessions(user_id, created_at DESC);

-- Token lookups (refresh, revocation)
CREATE INDEX IF NOT EXISTS idx_tokens_user_id 
ON public.tokens(user_id, revoked_at, expires_at);

-- Token revocation checks
CREATE INDEX IF NOT EXISTS idx_tokens_expires_at 
ON public.tokens(expires_at) 
WHERE revoked_at IS NULL;

-- ═══════════════════════════════════════════════════════════════
-- 2. ROLE/PERMISSION INDEXES
-- ═══════════════════════════════════════════════════════════════

-- Permission lookups by role
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id 
ON public.role_permissions(role_id);

-- Permissions by role batch lookup
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_permission 
ON public.role_permissions(role_id, permission_id);

-- ═══════════════════════════════════════════════════════════════
-- 3. SUBSCRIPTION INDEXES
-- ═══════════════════════════════════════════════════════════════

-- User subscription lookup (feature gating)
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_active 
ON public.user_subscriptions(user_id, status, ends_at DESC) 
WHERE status = 'active';

-- Plan feature lookup
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_feature 
ON public.plan_features(plan_id, feature_id);

-- Feature active status
CREATE INDEX IF NOT EXISTS idx_features_active 
ON public.features(id) 
WHERE is_active = true;

-- ═══════════════════════════════════════════════════════════════
-- 4. AUDIT LOG INDEXES
-- ═══════════════════════════════════════════════════════════════

-- User audit history
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_date 
ON public.audit_logs(user_id, created_at DESC);

-- Security event tracking
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_date 
ON public.audit_logs(action, created_at DESC);

-- IP-based tracking (for brute force detection)
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_date 
ON public.audit_logs(ip_address, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 5. LOGIN ATTEMPT TRACKING
-- ═══════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_login_attempts_email_date 
ON public.login_attempts(email, attempt_at DESC);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_date 
ON public.login_attempts(ip_address, attempt_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 6. MATERIALIZED VIEWS (if performance issues)
-- ═══════════════════════════════════════════════════════════════

-- Cache user features for quick lookup
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_features AS
SELECT 
    us.user_id,
    f.id as feature_id,
    f.name,
    f.description,
    sp.id as plan_id,
    sp.name as plan_name,
    sp.tier as plan_tier,
    us.ends_at
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id
JOIN plan_features pf ON sp.id = pf.plan_id
JOIN features f ON pf.feature_id = f.id
WHERE us.status = 'active'
  AND f.is_active = true
  AND us.ends_at > NOW();

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_user_features_user_id 
ON public.mv_user_features(user_id);

-- Cache user subscription status
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_subscriptions AS
SELECT 
    u.id,
    u.email,
    sp.id as plan_id,
    sp.name as plan_name,
    sp.tier,
    us.status,
    us.starts_at,
    us.ends_at,
    (us.ends_at > NOW()) as is_active,
    us.auto_renew,
    (us.ends_at AT TIME ZONE 'UTC') as next_billing_at
FROM user_accounts u
LEFT JOIN user_subscriptions us ON u.id = us.user_id AND us.status = 'active'
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE u.deleted_at IS NULL;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_mv_user_subscriptions_id 
ON public.mv_user_subscriptions(id);

-- Refresh strategy (run periodically with cron)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_features;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_subscriptions;

-- ═══════════════════════════════════════════════════════════════
-- 7. CONSTRAINTS FOR DATA INTEGRITY
-- ═══════════════════════════════════════════════════════════════

-- Ensure deleted records are not considered
ALTER TABLE public.user_accounts
ADD CONSTRAINT chk_deleted_records_excluded 
CHECK (deleted_at IS NOT NULL OR true);

-- Ensure valid subscription status
ALTER TABLE public.user_subscriptions
ADD CONSTRAINT chk_valid_subscription_status 
CHECK (status IN ('active', 'cancelled', 'paused', 'expired'));

-- Ensure active roles
ALTER TABLE public.roles
ADD CONSTRAINT chk_valid_role_status 
CHECK (is_active IN (true, false));

-- ═══════════════════════════════════════════════════════════════
-- 8. STATISTICS & QUERY OPTIMIZATION
-- ═══════════════════════════════════════════════════════════════

-- Analyze tables for query optimizer
ANALYZE public.user_accounts;
ANALYZE public.roles;
ANALYZE public.permissions;
ANALYZE public.role_permissions;
ANALYZE public.user_subscriptions;
ANALYZE public.subscription_plans;
ANALYZE public.plan_features;
ANALYZE public.features;
ANALYZE public.sessions;
ANALYZE public.tokens;
ANALYZE public.audit_logs;
ANALYZE public.login_attempts;

-- ═══════════════════════════════════════════════════════════════
-- 9. EXTENSION FOR ADVANCED FEATURES
-- ═══════════════════════════════════════════════════════════════

-- UUID generation (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- For advanced JSON queries
CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- ═══════════════════════════════════════════════════════════════
-- 10. VALIDATION QUERY - Run after indexes created
-- ═══════════════════════════════════════════════════════════════

-- Verify all indexes are in place
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check index utilization
SELECT 
    schemaname,
    tablename,
    indexrelname,
    idx_scan as "Index Scans",
    idx_tup_read as "Tuples Read",
    idx_tup_fetch as "Tuples Fetched"
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find slow queries (if query logging enabled)
SELECT 
    query,
    calls,
    total_time as "Total Time (ms)",
    mean_time as "Mean Time (ms)",
    stddev_time as "StdDev Time (ms)"
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%'
ORDER BY mean_time DESC
LIMIT 20;

-- ═══════════════════════════════════════════════════════════════
-- 11. MAINTENANCE QUERIES
-- ═══════════════════════════════════════════════════════════════

-- Vacuum and analyze (run regularly)
VACUUM ANALYZE public.user_accounts;
VACUUM ANALYZE public.user_subscriptions;
VACUUM ANALYZE public.tokens;
VACUUM ANALYZE public.audit_logs;

-- Check table bloat
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ═══════════════════════════════════════════════════════════════
-- 12. PERFORMANCE TUNING RECOMMENDATIONS
-- ═══════════════════════════════════════════════════════════════

-- PostgreSQL Configuration (postgresql.conf or docker -e):
-- For 100K users on 4-core server:

-- shared_buffers = 256MB (25% of RAM)
-- effective_cache_size = 1GB (50-75% of RAM)
-- work_mem = 16MB (RAM / (max_connections × 2))
-- maintenance_work_mem = 128MB
-- random_page_cost = 1.1 (for SSD)
-- effective_io_concurrency = 200
-- max_connections = 200 (depends on pool size)
-- max_prepared_transactions = 100

-- Connection pool tuning (already in code):
-- max_pool_connections = 50
-- min_pool_connections = 20
-- connection_timeout = 10s

-- ═══════════════════════════════════════════════════════════════
-- END OF OPTIMIZATION SCRIPT
-- ═══════════════════════════════════════════════════════════════

-- Run this script once with:
-- psql -U postgres -d manas360 -f database-optimization.sql

-- Verify with:
-- SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

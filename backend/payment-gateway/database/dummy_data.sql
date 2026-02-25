
-- ═══════════════════════════════════════
-- DUMMY DATA FOR MANAS360
-- ═══════════════════════════════════════

-- 1. Insert Dummy Payments
INSERT INTO payments (transaction_id, user_id, plan_id, amount_paise, source_screen, status, payment_method, created_at) VALUES
('TXN_1001', 'user_john_doe', 'premium_monthly', 29900, 'dashboard', 'SUCCESS', 'UPI', NOW() - INTERVAL '5 days'),
('TXN_1002', 'user_jane_smith', 'premium_yearly', 299900, 'sleep_therapy', 'SUCCESS', 'CARD', NOW() - INTERVAL '3 days'),
('TXN_1003', 'user_mike_ross', 'anytimebuddy_lifetime', 999900, 'ai_friend', 'FAILED', 'NETBANKING', NOW() - INTERVAL '1 day'),
('TXN_1004', 'user_lisa_ray', 'track_single', 3000, 'meditation_track', 'PENDING', 'UPI', NOW() - INTERVAL '2 hours');

-- 2. Insert Active Subscriptions
INSERT INTO subscriptions (user_id, plan_id, status, starts_at, ends_at, payment_transaction_id, auto_renew) VALUES
('user_john_doe', 'premium_monthly', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 'TXN_1001', TRUE),
('user_jane_smith', 'premium_yearly', 'active', NOW() - INTERVAL '3 days', NOW() + INTERVAL '362 days', 'TXN_1002', FALSE);

-- 3. Insert Settlements (Revenue split for therapist-related sales)
INSERT INTO settlements (transaction_id, therapist_id, total_amount, provider_share, platform_share, status, created_at) VALUES
('TXN_1002', 'therapist_dr_clark', 299900, 179940, 119960, 'pending', NOW() - INTERVAL '3 days');

-- 4. Insert Audit Logs
INSERT INTO audit_log (user_id, action, details, created_at) VALUES
('user_john_doe', 'payment_success', '{"plan": "premium_monthly", "amount": 29900}', NOW() - INTERVAL '5 days'),
('user_jane_smith', 'payment_success', '{"plan": "premium_yearly", "amount": 299900}', NOW() - INTERVAL '3 days'),
('user_mike_ross', 'payment_failed', '{"reason": "Insufficient Funds"}', NOW() - INTERVAL '1 day');

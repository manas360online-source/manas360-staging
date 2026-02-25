-- ════════════════════════════════════════════════════════════════════════════
-- SEED TEST USERS FOR LOGIN TESTING
-- ════════════════════════════════════════════════════════════════════════════
-- 
-- This SQL script creates test users for all user types with matching credentials.
-- 
-- Test Credentials:
-- ├─ patient / patient@123
-- ├─ therapist / therapist@123
-- ├─ corporate / corporate@123
-- ├─ education / education@123
-- ├─ healthcare / healthcare@123
-- ├─ insurance / insurance@123
-- ├─ government / government@123
-- └─ admin / admin@123
-- 
-- Password hashes are bcrypt-hashed (cost=10)
-- Hash generation: bcrypt.hash('password', 10)
-- 
-- To use in testing:
-- 1. Non-admin users → OTP endpoint: POST /api/auth/send-otp
-- 2. Admin user → MFA endpoint: POST /api/auth/admin-login
-- 
-- ════════════════════════════════════════════════════════════════════════════

-- Patient User
DELETE FROM users WHERE email = 'patient@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'patient@manas360.com',
  '+919876543210',
  '$2a$10$sUO9VE0roUo0wHd6XbXJq.OYyAI5NE3MMVmKiJCv/4C/sbZRnyf4.',
  'patient',
  'Test Patient',
  'Test',
  'Patient',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$sUO9VE0roUo0wHd6XbXJq.OYyAI5NE3MMVmKiJCv/4C/sbZRnyf4.',
  is_verified = TRUE,
  updated_at = NOW();

-- Therapist User
DELETE FROM users WHERE email = 'therapist@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'therapist@manas360.com',
  '+919876543211',
  '$2a$10$gyKcf2hT67aEpqahUyOEP.VoC5aJ4n9/EkNDJjizjYHFRBKG83v3W',
  'therapist',
  'Test Therapist',
  'Test',
  'Therapist',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$gyKcf2hT67aEpqahUyOEP.VoC5aJ4n9/EkNDJjizjYHFRBKG83v3W',
  is_verified = TRUE,
  updated_at = NOW();

-- Corporate User
DELETE FROM users WHERE email = 'corporate@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'corporate@manas360.com',
  '+919876543212',
  '$2a$10$VZ0MpUmF/KBmg3bhiwDZNeuO8JcyLnVw2LRi0CslyzDkGa1qVku5e',
  'corporate',
  'Corporate Admin',
  'Corporate',
  'Admin',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$VZ0MpUmF/KBmg3bhiwDZNeuO8JcyLnVw2LRi0CslyzDkGa1qVku5e',
  is_verified = TRUE,
  updated_at = NOW();

-- Education User
DELETE FROM users WHERE email = 'education@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'education@manas360.com',
  '+919876543213',
  '$2a$10$HZWlqp8AYTDi0fI5jFysluqzjmwsgAT9W3A9bQkMAcf7fi3q9hFf2',
  'education',
  'Education Admin',
  'Education',
  'Admin',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$HZWlqp8AYTDi0fI5jFysluqzjmwsgAT9W3A9bQkMAcf7fi3q9hFf2',
  is_verified = TRUE,
  updated_at = NOW();

-- Healthcare User
DELETE FROM users WHERE email = 'healthcare@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'healthcare@manas360.com',
  '+919876543214',
  '$2a$10$k9Mikdzz0v0y7WKo5i7BlOzd1BvTmt7JGr1syZ6WKhkKT3vuRfsIi',
  'healthcare',
  'Healthcare Admin',
  'Healthcare',
  'Admin',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$k9Mikdzz0v0y7WKo5i7BlOzd1BvTmt7JGr1syZ6WKhkKT3vuRfsIi',
  is_verified = TRUE,
  updated_at = NOW();

-- Insurance User
DELETE FROM users WHERE email = 'insurance@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'insurance@manas360.com',
  '+919876543215',
  '$2a$10$9gk7lkxqUwHFt15/bbLxaeiGC9NaAt.wtvL38HikDxemoBp.VJqQ2',
  'insurance',
  'Insurance Partner',
  'Insurance',
  'Partner',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$9gk7lkxqUwHFt15/bbLxaeiGC9NaAt.wtvL38HikDxemoBp.VJqQ2',
  is_verified = TRUE,
  updated_at = NOW();

-- Government User
DELETE FROM users WHERE email = 'government@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'government@manas360.com',
  '+919876543216',
  '$2a$10$0/xvsf0vK75FcmtQSDUNh.KUhLGRhkw.iP3tkg3ad6.emEpYiCdiC',
  'government',
  'Government Admin',
  'Government',
  'Admin',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$0/xvsf0vK75FcmtQSDUNh.KUhLGRhkw.iP3tkg3ad6.emEpYiCdiC',
  is_verified = TRUE,
  updated_at = NOW();

-- Admin User
DELETE FROM users WHERE email = 'admin@manas360.com';
INSERT INTO users (
  email, phone_number, password_hash, role, full_name,
  first_name, last_name, is_verified, is_active, created_at, updated_at
) VALUES (
  'admin@manas360.com',
  '+919876543217',
  '$2a$10$6OuAH0D/RDu8t8Zh3Rn6LuLnw0BbGHK8NqhtqbebKFnitsr31lgd.',
  'admin',
  'System Admin',
  'System',
  'Admin',
  TRUE,
  TRUE,
  NOW(),
  NOW()
) ON CONFLICT (email) 
DO UPDATE SET 
  password_hash = '$2a$10$6OuAH0D/RDu8t8Zh3Rn6LuLnw0BbGHK8NqhtqbebKFnitsr31lgd.',
  is_verified = TRUE,
  updated_at = NOW();

-- Verify inserts
SELECT 'Test Users Created/Updated:' as status;
SELECT COUNT(*) as user_count FROM users 
WHERE email IN (
  'patient@manas360.com',
  'therapist@manas360.com',
  'corporate@manas360.com',
  'education@manas360.com',
  'healthcare@manas360.com',
  'insurance@manas360.com',
  'government@manas360.com',
  'admin@manas360.com'
);

SELECT role, email, is_verified, is_active FROM users
WHERE email IN (
  'patient@manas360.com',
  'therapist@manas360.com',
  'corporate@manas360.com',
  'education@manas360.com',
  'healthcare@manas360.com',
  'insurance@manas360.com',
  'government@manas360.com',
  'admin@manas360.com'
)
ORDER BY role;

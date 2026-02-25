-- ════════════════════════════════════════════════════════════════════════════
-- ADD ENTERPRISE ROLES TO USERS TABLE
-- ════════════════════════════════════════════════════════════════════════════
--
-- This migration extends the users.role constraint to include enterprise roles:
-- - corporate: Corporate account manager
-- - education: Education institution administrator
-- - healthcare: Healthcare provider administrator
-- - insurance: Insurance provider administrator
-- - government: Government agency administrator
--
-- ════════════════════════════════════════════════════════════════════════════

-- Drop existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Recreate constraint with all roles
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (
    role IS NULL OR 
    role IN (
      'admin',
      'therapist',
      'patient',
      'user',
      'subscriber',
      'guest',
      'corporate',
      'education',
      'healthcare',
      'insurance',
      'government'
    )
  );

-- Verify the constraint was added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass AND conname = 'users_role_check';

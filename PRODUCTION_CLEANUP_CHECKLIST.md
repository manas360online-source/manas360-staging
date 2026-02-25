# Production Cleanup Checklist

## Before Moving to Production or Testing Environment

This document outlines all development artifacts, test data, and temporary configurations that **MUST be removed** before deploying to production or staging/testing environments.

---

## 1. DATABASE CLEANUP

### 1.1 Remove Test Users
```sql
-- Delete all test user accounts created for development
DELETE FROM users WHERE email IN (
  'patient@manas360.com',
  'therapist@manas360.com',
  'corporate@manas360.com',
  'education@manas360.com',
  'healthcare@manas360.com',
  'insurance@manas360.com',
  'government@manas360.com',
  'admin@manas360.com',
  'admin.dev@manas360.com'
);

-- Verify deletion
SELECT COUNT(*) as remaining_test_users FROM users 
WHERE email LIKE '%@manas360.com';
```

**Expected Result:** `0` remaining test users

### 1.2 Verify Real Users Exist
Ensure there are legitimate production users before cleaning:
```sql
SELECT id, email, role, is_verified, created_at 
FROM users 
WHERE is_active = true 
  AND deleted_at IS NULL 
  AND email NOT LIKE '%@manas360.com'
ORDER BY created_at ASC;
```

### 1.3 Clean Test Refresh Tokens
```sql
-- Delete refresh tokens from deleted test users
DELETE FROM refresh_tokens 
WHERE user_id NOT IN (SELECT id FROM users);

-- Verify
SELECT COUNT(*) as orphaned_tokens FROM refresh_tokens 
WHERE user_id NOT IN (SELECT id FROM users);
```

---

## 2. REMOVE TEST/DEVELOPMENT MIGRATIONS

### 2.1 Files to Delete
Remove these test seed migration files:
```bash
rm -f migrations/20260225_seed_test_users.sql
rm -f migrations/20260225_add_enterprise_roles.sql
```

### 2.2 Migration Tracking
If you have a migration history table, manually remove the entries:
```sql
DELETE FROM schema_migrations 
WHERE name IN (
  '20260225_seed_test_users',
  '20260225_add_enterprise_roles'
);
```

---

## 3. DELETE DEVELOPMENT SCRIPTS

### 3.1 Seed/Test Scripts to Remove
```bash
# Node.js test seeding scripts
rm -f scripts/seed-test-users.js
rm -f scripts/generate-test-hashes.js
rm -f scripts/security-smoke.mjs

# SQL seed files (if any)
rm -f scripts/seed*.sql
rm -f scripts/test-data*.sql
```

### 3.2 Development Helper Scripts to Remove
```bash
# Check for any development utility scripts
find scripts/ -name "*test*" -o -name "*dev*" -o -name "*seed*"
```

Delete any matches that shouldn't be in production.

---

## 4. ENVIRONMENT VARIABLES & SECRETS

### 4.1 Frontend (.env files)
Remove or empty these development-only env files:
```bash
# Delete development env files
rm -f .env.development
rm -f .env.local
rm -f .env.*.local

# Keep only production-ready files
# ✓ .env.production (ensure it has real secrets)
# ✓ .env (if used as production base)
```

### 4.2 Backend Configuration
```bash
# Check for hardcoded dev credentials in backend/
grep -r "localhost:5001" backend/src --include="*.js" --include="*.ts"
grep -r "localhost:3000" backend/src --include="*.js" --include="*.ts"
grep -r "test-user" backend/src --include="*.js" --include="*.ts"
grep -r "dev@" backend/src --include="*.js" --include="*.ts"
```

Remove any hardcoded development values and replace with environment variables.

### 4.3 Database Connection Strings
Verify database connection uses environment variables:
```bash
# Should NOT have hardcoded credentials
grep -r "postgresql://" backend/src --include="*.js" --include="*.ts"
# Should use env vars instead: process.env.DATABASE_URL
```

---

## 5. FRONTEND CODE CLEANUP

### 5.1 Remove Test Components/Pages (if any)
```bash
# Search for test-specific code
grep -r "test" frontend/main-app/pages --include="*.tsx" --include="*.ts"
grep -r "TEST_" frontend/main-app --include="*.tsx" --include="*.ts"
grep -r "mock" frontend/main-app --include="*.tsx" --include="*.ts"

# Remove any test-only pages or components
```

### 5.2 Remove Console Logs and Debug Code
```bash
# Find debug logging
grep -r "console.log" frontend/main-app --include="*.tsx" --include="*.ts" | grep -v ".test.ts"

# Remove or replace with production logger
find frontend/main-app -name "*.tsx" -o -name "*.ts" | xargs grep -l "console\.log\|console\.debug"
```

### 5.3 Remove Hardcoded API Endpoints
```bash
# Check for localhost references
grep -r "localhost:" frontend/main-app --include="*.tsx" --include="*.ts"
grep -r "http://localhost" frontend/main-app --include="*.tsx" --include="*.ts"
grep -r "5001" frontend/main-app --include="*.tsx" --include="*.ts"

# All should use environment variables or config
```

---

## 6. BACKEND CODE CLEANUP

### 6.1 Remove Debug Endpoints (if any)
Check `backend/routes/` for test-only endpoints:
```javascript
// ❌ Remove these in production:
app.get('/api/debug/*')
app.post('/api/test/*')
app.get('/api/seed/*')
app.get('/api/dev/*')

// ❌ Remove test simulation endpoints
app.post('/api/mock-payment')
app.post('/api/fake-otp')
```

### 6.2 Remove Test Webhooks
```bash
grep -r "webhook" backend/src --include="*.js" --include="*.ts" | grep -i "test\|mock\|dev"
```

Delete mock webhook handlers for testing.

### 6.3 Remove Verbose Logging
```bash
# Check logging configuration
grep -r "LOG_LEVEL.*=.*debug" backend/ --include="*.js" --include="*.ts"
grep -r "console\." backend/src --include="*.js" --include="*.ts" | grep -v logger

# Change to production log levels:
# DEBUG → WARNING
# LOG_LEVEL=debug → LOG_LEVEL=info or LOG_LEVEL=error
```

---

## 7. DOCKER & DEPLOYMENT CLEANUP

### 7.1 Remove Development Docker Compose
```bash
# Keep docker-compose.yml ONLY IF needed for production
# If it's dev-only, remove it:
rm -f docker-compose.dev.yml
rm -f docker-compose.test.yml

# Check docker-compose.yml doesn't reference development databases
grep -i "postgres" docker-compose.yml | grep -i "dev\|test\|local"
```

### 7.2 Verify Dockerfile Production-Ready
```bash
# Check backend Dockerfile
cat Dockerfile.backend | grep -E "RUN npm install|npm run dev|npm run dev"

# Should use:
# RUN npm ci --only=production
# NOT: npm install (installs devDependencies)
```

### 7.3 Remove Development Dependencies from Production Build
```bash
# In Dockerfile, ensure:
ENV NODE_ENV=production
RUN npm ci --only=production

# NOT:
# npm install (includes devDependencies)
```

---

## 8. GIT & SOURCE CONTROL CLEANUP

### 8.1 Remove Development-Only Files from Git
```bash
# Create .gitignore entries for dev artifacts (if not already there)
cat >> .gitignore << 'EOF'
# Development seeds and tests
migrations/*seed*.sql
scripts/seed-*.js
scripts/test-*.js
scripts/generate-*.js
scripts/security-smoke.mjs

# Development env files
.env.local
.env.*.local
.env.development

# Development logs
*.log
logs/
EOF

git rm --cached migrations/20260225_seed_test_users.sql
git rm --cached migrations/20260225_add_enterprise_roles.sql
git rm --cached scripts/seed-test-users.js
git rm --cached scripts/generate-test-hashes.js
```

### 8.2 Remove Commits Related to Test Data
If entire development session is in git:
```bash
# Review commit history for test-only changes
git log --oneline | grep -i "test\|seed\|dev"

# If needed, create clean branch for production
git checkout -b production
git reset --hard <last-stable-commit>
```

---

## 9. DOCUMENTATION CLEANUP

### 9.1 Remove Development Documentation
Delete these development-only docs:
```bash
# Development guides (keep for reference, but don't deploy)
rm -f ADMIN_LOGIN_GUIDE.md
rm -f QUICK_START_IMPLEMENTATION.md
rm -f TEST_STRUCTURE_MAP.md
rm -f ENV_QUICK_REFERENCE.md

# Keep deployment and architecture docs
# ✓ PRODUCTION_DEPLOYMENT_GUIDE.md
# ✓ SAAS_ARCHITECTURE_GUIDE.md
# ✓ README.md
```

### 9.2 Update README.md
Remove test user credentials from documentation:
```bash
grep -i "patient@manas360\|therapist@manas360" README.md
# Remove any references to test users
```

---

## 10. SENSITIVE DATA CHECKLIST

### 10.1 Verify No Hardcoded Secrets
```bash
# Search for API keys, tokens, passwords
grep -r "sk_test_\|pk_test_" . --exclude-dir=node_modules
grep -r "password.*=" backend/ --include="*.js" --include="*.ts"
grep -r "secret.*=" backend/ --include="*.js" --include="*.ts"
grep -r "admin@manas360" . --exclude-dir=node_modules
```

❌ Remove all hardcoded secrets → Use environment variables only

### 10.2 Third-Party API Keys
```bash
# Check for test/sandbox API keys (Stripe, Razorpay, etc.)
grep -r "sk_test\|pk_test\|razorpay_test" backend/
grep -r "test_key\|sandbox" backend/ --include="*.env*"

# Ensure production keys are in environment variables only
```

---

## 11. DATABASE INTEGRITY CHECKS

### 11.1 Run Pre-Production Validation
```sql
-- Check for orphaned records
SELECT COUNT(*) FROM refresh_tokens WHERE user_id NOT IN (SELECT id FROM users);

-- Verify constraints
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'users' AND constraint_type = 'CHECK';

-- Check for test data in other tables
SELECT * FROM subscriptions WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@manas360.com');
SELECT * FROM payments WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@manas360.com');
```

---

## 12. SECURITY HARDENING FOR PRODUCTION

### 12.1 Enable Production Security Features
```javascript
// In backend/server.js or config:
// ✓ helmet.js for HTTP headers
// ✓ CORS configured for production domain only
// ✓ Rate limiting enabled
// ✓ HTTPS enforcement
// ✓ CSRF tokens enabled
// ✓ Content Security Policy headers
```

### 12.2 Disable Debug Features
```bash
# Ensure these are FALSE/disabled in production:
DEBUG=false
NODE_ENV=production
ALLOW_DEV_ENDPOINTS=false
EXPOSE_ERROR_DETAILS=false  # Don't leak stack traces
ALLOW_CORS_LOCALHOST=false
```

### 12.3 Verify SSL/TLS Certificates
```bash
# Production deployment should use:
# ✓ Valid SSL certificate (not self-signed)
# ✓ HTTPS-only mode
# ✓ HSTS headers enabled
```

---

## 13. FINAL CHECKLIST BEFORE PRODUCTION

```bash
# ✓ All test users deleted from database
# ✓ Test migrations removed from migrations/
# ✓ Test scripts removed from scripts/
# ✓ .env.local and .env.development deleted
# ✓ No hardcoded localhost references
# ✓ No console.log statements in frontend
# ✓ No debug API endpoints enabled
# ✓ database.yml or env has production database
# ✓ All third-party API keys are from production (not sandbox)
# ✓ npm run build passes without warnings
# ✓ Security smoke tests disabled or modified for production
# ✓ Logging configured for production (not debug level)
# ✓ CORS configured for production domain only
# ✓ All git commits with test data are removed or in separate branch
# ✓ Production deployment guide reviewed and followed
# ✓ Backup of production database created
# ✓ Rollback plan documented
```

---

## 14. PRODUCTION DEPLOYMENT COMMAND

After cleanup, deploy with:

```bash
# Frontend
npm run build          # Production build
npm run serve          # Or deploy to hosting (Vercel, AWS, etc.)

# Backend
NODE_ENV=production npm start   # Start with production config

# Database migrations
npm run migrate:prod    # Only safe, non-destructive migrations
```

---

## 15. POST-DEPLOYMENT VERIFICATION

```bash
# Verify production environment
curl https://your-production-domain.com/health

# Check logs for errors
tail -f logs/production.log

# Verify no test users appear in admin panel
# Login as real admin → Users list should only show real users

# Test OTP login with real email address (not @manas360.com)
```

---

## Important Notes

⚠️ **BACKUP BEFORE CLEANUP**: Always backup production database before removing test users
⚠️ **TEST IN STAGING**: Run cleanup procedures in staging environment first
⚠️ **VERIFY REAL USERS**: Ensure at least one real production admin user exists before deleting test accounts
⚠️ **KEEP GIT CLEAN**: Remove test migrations from git history or move to dev branch
⚠️ **DOCUMENT PROCESS**: Keep this checklist and mark what's done for audit trail

---

Last Updated: February 25, 2026

# Production Cleanup - Quick Reference Card

## 🚀 Pre-Production Deployment Checklist (5 Minutes)

### Step 1: Run Automated Cleanup Script
```bash
# Test what will be removed (safe, no deletion)
bash scripts/production-cleanup.sh --dry-run

# Execute cleanup
bash scripts/production-cleanup.sh
```

### Step 2: Delete Test Users from Database
```bash
# Connect to production database
psql "postgresql://chandu@localhost:5432/manas360_ui_main" << 'EOF'

-- Remove all test users
DELETE FROM users WHERE email LIKE '%@manas360.com';

-- Verify cleanup
SELECT COUNT(*) as test_users_remaining FROM users 
WHERE email LIKE '%@manas360.com';
-- Should return: 0

EOF
```

### Step 3: Verify Production Build
```bash
# Build frontend for production
npm run build

# If successful, you'll see: "✓ built in X.XXs"
# If errors occur, fix them before proceeding
```

### Step 4: Update Environment Variables
```bash
# For production deployment, ensure .env.production has:
NODE_ENV=production
DATABASE_URL=<real-production-database-url>
JWT_SECRET=<real-production-secret>
STRIPE_KEY_PROD=<real-production-stripe>
RAZORPAY_KEY_PROD=<real-production-razorpay>

# Remove .env.local
rm -f .env.local .env.development
```

### Step 5: Git Cleanup (Before Committing)
```bash
# Remove test migrations from git
git rm migrations/20260225_seed_test_users.sql
git rm migrations/20260225_add_enterprise_roles.sql

# Remove test scripts from git
git rm scripts/seed-test-users.js
git rm scripts/generate-test-hashes.js
git rm scripts/security-smoke.mjs

# Commit
git commit -m "Remove development test data before production deployment"
```

---

## ⚠️ Critical Checklist

| Item | Status | Notes |
|------|--------|-------|
| ✓ All test users deleted (patient@, therapist@, etc) | [ ] | Database must show 0 @manas360.com users |
| ✓ ENV files cleaned (.env.local removed) | [ ] | Only .env.production should exist |
| ✓ Production build passes | [ ] | `npm run build` succeeds |
| ✓ Localhost references removed | [ ] | No hardcoded localhost:3000/5001 |
| ✓ Database credentials are in env vars | [ ] | Not hardcoded in source |
| ✓ Test migrations removed | [ ] | Remove 20260225_*.sql files |
| ✓ Test scripts removed | [ ] | Remove scripts/seed-*.js files |
| ✓ NODE_ENV=production set | [ ] | Verify in .env.production |
| ✓ CORS configured for prod domain | [ ] | Not for localhost |
| ✓ Database backed up | [ ] | Before making any changes |

---

## 🔥 Files to Always Remove Before Production

```
Database:
  └─ Test users (8 accounts with @manas360.com)

Files:
  └─ migrations/20260225_seed_test_users.sql
  └─ migrations/20260225_add_enterprise_roles.sql
  └─ scripts/seed-test-users.js
  └─ scripts/generate-test-hashes.js
  └─ scripts/security-smoke.mjs
  └─ .env.local
  └─ .env.development

Config:
  └─ NODE_ENV must equal "production"
  └─ No localhost references
  └─ No hardcoded API keys
  └─ No console.log in production code
```

---

## 🔒 Security Checks

**Before Deploying:**
```bash
# No secrets in code
grep -r "password\|secret\|token" backend/src --include="*.js" --include="*.ts" | grep -v "process.env"

# No test endpoints
grep -r "/api/test\|/api/dev\|/api/seed" backend/ --include="*.js"

# No localhost
grep -r "localhost\|127.0.0.1" frontend backend --include="*.tsx" --include="*.ts" --include="*.js"
```

---

## Test Users to Remove

```sql
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
```

---

## Deployment Command

```bash
# After cleanup is complete:

# 1. Build production assets
npm run build

# 2. Deploy frontend (Vercel, AWS, etc.)
npm run deploy

# 3. Start backend with production config
NODE_ENV=production npm start

# 4. Verify health check
curl https://your-domain.com/health
```

---

## Rollback Plan

If deployment fails:

```bash
# 1. Stop current deployment
# 2. Restore database from backup
# 3. Roll back to previous version
# 4. Investigate error logs
# 5. Fix issues and retry
```

---

## 📋 Full Documentation

For detailed information, see: **PRODUCTION_CLEANUP_CHECKLIST.md**

---

**Last Updated:** February 25, 2026  
**Status:** Ready for Production Deployment  
**Next Step:** Run `bash scripts/production-cleanup.sh`

# Production Deployment Procedures

## Overview

This document outlines the step-by-step process for deploying Manas360 from development to production, including all necessary cleanup and verification steps.

---

## Phase 1: Pre-Deployment Preparation (Before Any Changes)

### 1.1 Create a Backup
**⚠️ CRITICAL: Do this first**
```bash
# Backup current database
pg_dump "postgresql://chandu@localhost:5432/manas360_ui_main" > backup_$(date +%Y%m%d_%H%M%S).sql

# Store backup securely (cloud storage, external drive, etc.)
# You'll need this if anything goes wrong
```

### 1.2 Create a Deployment Branch
```bash
# Create clean branch from main/master
git checkout -b deploy/production
git pull origin main

# This keeps main clean if anything goes wrong
```

### 1.3 Document Current State
```bash
# Note current commit hash
git log -1 --oneline > deployment_info.txt

# List current users
psql "postgresql://chandu@localhost:5432/manas360_ui_main" \
  -c "SELECT COUNT(*) as user_count FROM users;" >> deployment_info.txt

# Note time
date >> deployment_info.txt
```

---

## Phase 2: Development Cleanup (Automated)

### 2.1 Run Production Cleanup Script
```bash
# First, do a dry run to see what will be removed
bash scripts/production-cleanup.sh --dry-run

# Review output and confirm it's safe

# Then execute
bash scripts/production-cleanup.sh
```

This script automatically:
- Removes seed migration files
- Removes test scripts
- Removes development env files
- Checks for hardcoded localhost references
- Tests production build

### 2.2 Manual Database Cleanup
```bash
# Delete test users from database
psql "postgresql://chandu@localhost:5432/manas360_ui_main" << 'EOF'

-- Before deletion, count test users
SELECT COUNT(*) as test_users FROM users WHERE email LIKE '%@manas360.com';

-- Delete them
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
SELECT COUNT(*) as remaining_test_users FROM users WHERE email LIKE '%@manas360.com';
-- Expected: 0

-- Verify real users still exist
SELECT COUNT(*) as real_users FROM users WHERE is_active = true AND deleted_at IS NULL;
-- Expected: > 0

EOF
```

---

## Phase 3: Git Cleanup

### 3.1 Remove Development Commits
```bash
# Check git status
git status

# Remove test files from git tracking
git rm --cached migrations/20260225_seed_test_users.sql 2>/dev/null || true
git rm --cached migrations/20260225_add_enterprise_roles.sql 2>/dev/null || true
git rm --cached scripts/seed-test-users.js 2>/dev/null || true
git rm --cached scripts/generate-test-hashes.js 2>/dev/null || true
git rm --cached scripts/security-smoke.mjs 2>/dev/null || true

# Confirm removals
git status
```

### 3.2 Commit Cleanup
```bash
# Commit all removals
git commit -m "Cleanup: Remove development test data before production deployment

- Remove test user seed migration
- Remove enterprise role migration  
- Remove test seeding scripts
- Remove development env files
- Verify production-ready configuration"
```

---

## Phase 4: Production Configuration

### 4.1 Verify Production Environment Variables
```bash
# Check production env file exists
cat .env.production

# Ensure these are set to REAL values:
# - NODE_ENV=production
# - DATABASE_URL=<real-production-db>
# - JWT_SECRET=<real-production-secret>
# - STRIPE_KEY=<real-stripe-production-key>
# - RAZORPAY_KEY=<real-razorpay-production-key>
# - API_BASE_URL=<production-domain>
# - CORS_ORIGIN=<production-domain-only>

# ❌ NEVER have:
# - localhost
# - test keys
# - development values
```

### 4.2 Update Application Configuration
```bash
# Frontend (Vite config)
cat vite.config.ts
# Verify API base URL points to production endpoint

# Backend (server.js or config)
cat backend/server.js | grep -i "process.env\|localhost\|cors"
# Verify CORS configuration only allows production domain
```

### 4.3 Verify Database Connection
```bash
# Test connection to production database
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;" 2>&1 | grep -v "^Password"

# You should see:
#  count
# -------
#   X
# (1 row)

# If error: Fix DATABASE_URL in .env.production and retry
```

---

## Phase 5: Build & Verification

### 5.1 Clean Build
```bash
# Remove node_modules and rebuild from scratch
rm -rf node_modules dist build
npm install
npm run build

# Expected output:
# ✓ built in X.XXs
# No errors or warnings
```

### 5.2 Build Artifacts Check
```bash
# Verify production build artifacts
ls -lh dist/
du -sh dist/

# Should see:
# - index.html 
# - assets/ folder with .js and .css files
# - Typical size: 200KB - 500KB (gzipped)

# If > 1MB: Investigate unused dependencies
```

### 5.3 Security Verification
```bash
echo "=== Checking for test credentials ==="
grep -r "patient@manas360\|therapist@manas360" . --exclude-dir=node_modules --exclude-dir=.git || echo "✓ No test credentials found"

echo "=== Checking for localhost ==="
grep -r "localhost" dist/ 2>/dev/null || echo "✓ No localhost in build"

echo "=== Checking for console.log ==="
grep -r "console\.log" dist/ 2>/dev/null || echo "✓ No console.log in build"

echo "=== Checking for env-specific code ==="
grep -r "development\|staging\|test" dist/ --include="*.js" | grep -i "if.*==" || echo "✓ No hardcoded env checks"
```

---

## Phase 6: Final Pre-Deployment Checks

### 6.1 Health Check Preparation
```bash
# Ensure backend will start correctly
echo "Backend configuration:"
echo "NODE_ENV=$(grep NODE_ENV .env.production | cut -d= -f2)"
echo "PORT=$(grep PORT .env.production | cut -d= -f2 || echo 5001)"
echo "DB Connection string exists: $([ -n "$DATABASE_URL" ] && echo 'YES' || echo 'NO')"
```

### 6.2 Documentation Review
```bash
# Review deployment documentation
cat PRODUCTION_DEPLOYMENT_GUIDE.md

# Review cleanup checklist one more time
cat PRODUCTION_CLEANUP_CHECKLIST.md | grep "✓" | wc -l
# This should show most items as completed
```

### 6.3 Database Backup Verification
```bash
# Verify backup file exists
ls -lh backup_*.sql | head -1

# Test backup can be restored (on test instance)
# Don't do this in production!
# pg_restore -d test_db backup_*.sql
```

---

## Phase 7: Deployment

### 7.1 Deploy Frontend
```bash
# Option A: Vercel (recommended)
vercel --prod --env-file .env.production

# Option B: AWS S3 + CloudFront
aws s3 sync dist/ s3://manas360-prod --delete

# Option C: Other hosting
# Follow your platform's deployment guide
# Ensure .env.production is NOT committed to git
# Inject secrets during deployment build process
```

### 7.2 Deploy Backend
```bash
# Start backend with production config
NODE_ENV=production npm start

# Or with PM2 for process management
pm2 start server.js --name manas360-api --env .env.production

# View logs
pm2 logs manas360-api
```

### 7.3 Run Database Migrations (if needed)
```bash
# Only if new migrations exist beyond the test ones
npm run migrate:prod

# This runs migrations in proper order
# Never run DROP or TRUNCATE migrations in production
```

---

## Phase 8: Post-Deployment Verification

### 8.1 Health Checks
```bash
# Frontend health
curl -s https://your-production-domain.com/health | json_pp

# Backend health
curl -s https://api.your-production-domain.com/health | json_pp

# Database connectivity
curl -s https://api.your-production-domain.com/api/status | json_pp
```

### 8.2 Application Functionality Testing
```bash
# Test OTP login (non-admin)
# 1. Go to https://your-production-domain.com
# 2. Select user role (Patient, Therapist, etc.)
# 3. Enter valid email address
# 4. Verify OTP is sent to email
# 5. Submit OTP and verify redirect

# Test Admin login (separate)
# 1. Click "Admin Login" 
# 2. Enter admin credentials
# 3. Verify MFA prompt
# 4. Enter HOTP code
# 5. Verify dashboard loads

# Test payment flow (if applicable)
# Use Stripe/Razorpay test mode during first week
# Then switch to production keys after verification
```

### 8.3 Log Monitoring
```bash
# Monitor for errors
pm2 logs manas360-api | head -50

# Check application logs
tail -f logs/production.log

# Look for:
# - ✓ No errors
# - ✓ Database connected
# - ✓ API running
# - ✓ Authentication working
# - ✗ Any test-related messages
```

### 8.4 User Verification
```bash
# Login to admin panel with production admin account
# Verify:
# - ✓ Users list shows only real users (no @manas360.com)
# - ✓ No test data visible
# - ✓ Settings/config show production values
# - ✓ Analytics show real user data (or empty)
```

---

## Phase 9: Rollback Plan (If Issues Occur)

### 9.1 Immediate Rollback
```bash
# Stop production deployment
# Kill backend process
pm2 stop manas360-api

# Restore database from backup
psql "postgresql://..." < backup_YYYYMMDD_HHMMSS.sql

# Deploy previous working version
git checkout <last-known-good-commit>
npm install
npm run build
NODE_ENV=production npm start
```

### 9.2 Rollback Validation
```bash
# Verify rollback worked
curl -s https://your-production-domain.com/health

# Check database
psql "$DATABASE_URL" -c "SELECT COUNT(*) FROM users;"

# Monitor logs for errors
pm2 logs manas360-api
```

---

## Checklist for Each Deployment

```
PRE-DEPLOYMENT:
☐ Database backup created
☐ Deployment branch created
☐ Current state documented
☐ Test users count recorded

CLEANUP:
☐ production-cleanup.sh executed
☐ Test users deleted from database
☐ Git status clean
☐ Commit message descriptive

CONFIGURATION:
☐ .env.production reviewed (no localhost)
☐ All real API keys in place
☐ CORS set to prod domain only
☐ NODE_ENV=production verified

BUILD:
☐ npm run build succeeds
☐ Zero errors/warnings
☐ No console.log in output
☐ Production assets under 1MB

SECURITY:
☐ No test credentials in code
☐ No dev endpoints active
☐ HTTPS enforced
☐ Rate limiting enabled

DEPLOYMENT:
☐ Frontend deployed
☐ Backend started
☐ Database migrations ran (if needed)
☐ Health checks passing

VERIFICATION:
☐ Frontend loads without errors
☐ OTP login works with real email
☐ Admin login works with MFA
☐ Database shows only real users
☐ No @manas360.com test users visible

POST-DEPLOYMENT:
☐ Logs monitored for errors
☐ Analytics showing real data
☐ User support notified
☐ Incident response plan active
```

---

## Key Files Referenced

- **PRODUCTION_CLEANUP_CHECKLIST.md** - Detailed cleanup steps
- **PRODUCTION_CLEANUP_QUICK_REFERENCE.md** - Quick reference card
- **scripts/production-cleanup.sh** - Automated cleanup script
- **PRODUCTION_DEPLOYMENT_GUIDE.md** - Full deployment guide
- **.env.production** - Production environment variables

---

## Important Notes

⚠️ **ALWAYS:**
- Backup database BEFORE any changes
- Test in staging environment first
- Have a rollback plan ready
- Monitor logs after deployment
- Keep git history clean
- Document all deployments

❌ **NEVER:**
- Deploy with .env.local
- Include hardcoded secrets
- Use test data in production
- Skip health checks
- Ignore error logs
- Commit sensitive data

---

## Support & Troubleshooting

If deployment fails:

1. Check logs: `pm2 logs manas360-api`
2. Verify database: `psql "$DATABASE_URL" -c "SELECT 1"`
3. Check env vars: `env | grep MANAS`
4. Review error messages for specifics
5. Rollback to previous version if needed
6. Contact DevOps team for assistance

---

**Last Updated:** February 25, 2026  
**Status:** Ready for Production  
**Next Step:** Execute Phase 1 - Create Backup

# Production Deployment Resources - Complete Guide

## 📋 Overview

This document explains all the production cleanup and deployment resources created for Manas360, and how to use them step-by-step.

---

## 📁 Resources Created

### 1. **PRODUCTION_CLEANUP_CHECKLIST.md** (Detailed - 400+ lines)
**When to Use:** Complete reference guide during cleanup phase

**Contents:**
- 15 major cleanup sections
- Detailed SQL scripts to run
- File-by-file breakdown of what to delete
- Security hardening steps
- Database integrity checks
- Final verification checklist

**Best For:** 
- First-time production deployments
- Thorough, step-by-step cleanup
- Reference documentation
- Audit trail

---

### 2. **PRODUCTION_CLEANUP_QUICK_REFERENCE.md** (Quick - 50 lines)
**When to Use:** Quick lookup during fast deployments

**Contents:**
- 5-minute checklist
- Essential 5 steps (backup → deploy)
- Critical items table
- Files to always remove
- Test credentials SQL snippet
- Deployment command template

**Best For:**
- Experienced teams
- Rapid deployments
- Quick checklist verification
- During deployment day

---

### 3. **PRODUCTION_DEPLOYMENT_PROCEDURES.md** (Complete - 600+ lines)
**When to Use:** Full end-to-end deployment guide

**Contents:**
- 9 deployment phases
- Pre-deployment preparation
- Automated cleanup integration
- Build & verification steps
- Post-deployment testing
- Rollback procedures
- Complete deployment checklist

**Best For:**
- New team members
- First production deployment
- Complex deployments
- Company procedures documentation

---

### 4. **scripts/production-cleanup.sh** (Executable Script)
**When to Use:** Automated cleanup execution

**Usage:**
```bash
# Dry run (shows what will be deleted)
bash scripts/production-cleanup.sh --dry-run

# Execute cleanup
bash scripts/production-cleanup.sh

# Keep migrations (if in git)
bash scripts/production-cleanup.sh --keep-migrations

# Skip database cleanup (do manually)
bash scripts/production-cleanup.sh --no-db
```

**What It Does:**
- Removes test migration files
- Removes test scripts (seed, generate, smoke tests)
- Removes development env files
- Checks for hardcoded localhost references
- Tests production build
- Provides SQL for database cleanup

**Best For:**
- Automated cleanup
- Consistency across deployments
- Audit trail of cleanup actions
- Team standardization

---

## 🚀 Quick Start: What to Do Before Production

### For First-Time Deployment:
```bash
# 1. READ: Full procedures
less PRODUCTION_DEPLOYMENT_PROCEDURES.md

# 2. BACKUP: Database (critical!)
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql

# 3. CLEANUP: Run automated script
bash scripts/production-cleanup.sh --dry-run
# Review output, then:
bash scripts/production-cleanup.sh

# 4. VERIFY: Production build works
npm run build

# 5. DEPLOY: Follow procedures guide
# (See PRODUCTION_DEPLOYMENT_PROCEDURES.md Phase 7)
```

### For Repeat Deployments:
```bash
# 1. Quick reference
cat PRODUCTION_CLEANUP_QUICK_REFERENCE.md

# 2. Run cleanup
bash scripts/production-cleanup.sh

# 3. Delete test users
# (Copy SQL from Quick Reference)

# 4. Deploy
npm run build && npm run deploy
```

---

## 📚 Resource Selection Guide

### "I have 30 minutes, what do I need to do?"
→ Use **PRODUCTION_CLEANUP_QUICK_REFERENCE.md**
- 5-minute checklist covers essentials
- Keep nearby during deployment

### "This is my first production deployment"
→ Read **PRODUCTION_DEPLOYMENT_PROCEDURES.md** 
- Covers all 9 phases
- Explains each step and why
- Includes rollback procedures

### "I need to know exactly what files to delete"
→ Use **PRODUCTION_CLEANUP_CHECKLIST.md**
- Section 2: Database Cleanup
- Section 3: Delete Migrations
- Section 4: Delete Scripts
- Section 5: Delete Env Files

### "I want to automate the cleanup"
→ Run **scripts/production-cleanup.sh**
- Handles file removal automatically
- Shows what will be deleted first (--dry-run)
- Integrates with git

### "I need documentation for compliance/audit"
→ Keep **PRODUCTION_DEPLOYMENT_PROCEDURES.md**
- Complete audit trail
- Checklist for sign-offs
- Rollback documentation
- Post-deployment verification steps

---

## 🔥 Critical Items Checklist (Do NOT Skip)

### Database
- [ ] Backup created before ANY changes
- [ ] All test users deleted (patient@, therapist@, etc.)
- [ ] Verify COUNT of deleted users = 8
- [ ] Verify real users still exist

### Environment
- [ ] Remove .env.local
- [ ] Remove .env.development
- [ ] Verify .env.production has REAL values
- [ ] No localhost references
- [ ] NODE_ENV=production

### Code
- [ ] No hardcoded secrets in source
- [ ] No test API endpoints active
- [ ] No console.log statements
- [ ] Production build succeeds

### Files
- [ ] migrations/20260225_seed_test_users.sql deleted
- [ ] migrations/20260225_add_enterprise_roles.sql deleted
- [ ] scripts/seed-test-users.js deleted
- [ ] scripts/generate-test-hashes.js deleted
- [ ] scripts/security-smoke.mjs deleted

---

## Test Users to Remove from Database

```sql
-- MANDATORY: Run this before production goes live
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
SELECT COUNT(*) as test_users_remaining FROM users 
WHERE email LIKE '%@manas360.com';
-- Expected result: 0
```

---

## Files That Were Created for Testing

### Migrations (DELETE before production)
```
migrations/20260225_seed_test_users.sql
migrations/20260225_add_enterprise_roles.sql
```

### Scripts (DELETE before production)  
```
scripts/seed-test-users.js
scripts/generate-test-hashes.js
scripts/security-smoke.mjs
```

### Environment Files (DELETE before production)
```
.env.local
.env.development
.env.development.local
```

### Database Data (DELETE before production)
```
8 test users with @manas360.com email addresses:
- patient@manas360.com
- therapist@manas360.com
- corporate@manas360.com
- education@manas360.com
- healthcare@manas360.com
- insurance@manas360.com
- government@manas360.com
- admin@manas360.com
- admin.dev@manas360.com (if exists)
```

---

## How Each Resource Fits In

```
DEPLOYMENT TIMELINE:
├─ Week Before: Read PRODUCTION_DEPLOYMENT_PROCEDURES.md
├─ Day Before: Review PRODUCTION_CLEANUP_CHECKLIST.md
├─ Deployment Day:
│  ├─ Morning: Keep PRODUCTION_CLEANUP_QUICK_REFERENCE.md open
│  ├─ 1 Hour Before: Run bash scripts/production-cleanup.sh --dry-run
│  ├─ 30 Min Before: Execute bash scripts/production-cleanup.sh
│  ├─ 15 Min Before: Delete test users (use SQL from Quick Reference)
│  ├─ 5 Min Before: npm run build
│  └─ Deploy: Follow Phase 7 of Procedures guide
└─ After: Monitor logs per Phase 8 of Procedures guide
```

---

## Important Warnings

### ⚠️ BACKUP FIRST
```bash
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql
# Store this somewhere safe - you'll need it if anything goes wrong
```

### ⚠️ DELETE IN RIGHT ORDER
1. First: Backup database
2. Second: Run cleanup script
3. Third: Delete test users from DB
4. Fourth: Delete test files from git
5. Fifth: Deploy

### ⚠️ VERIFY MULTIPLE TIMES
Before deploying:
1. Database: Confirm no @manas360.com users remain
2. Files: Confirm test files are deleted
3. Build: Confirm production build succeeds
4. Health: Confirm endpoints return 200 OK

### ⚠️ KEEP ROLLBACK READY
Always have:
- Database backup (recent)
- Previous working version tagged in git
- Rollback procedures steps memorized
- Dev team on standby during deployment

---

## Quick Command Reference

```bash
# Backup database (DO THIS FIRST!)
pg_dump "postgresql://chandu@localhost:5432/manas360_ui_main" > backup_$(date +%Y%m%d_%H%M%S).sql

# Run cleanup script
bash scripts/production-cleanup.sh

# Delete test users
psql "postgresql://..." << 'EOF'
DELETE FROM users WHERE email LIKE '%@manas360.com';
SELECT COUNT(*) as remaining FROM users WHERE email LIKE '%@manas360.com';
EOF

# Build for production
npm run build

# Start backend (if self-hosted)
NODE_ENV=production npm start

# Check health
curl https://your-domain.com/health

# Monitor logs
pm2 logs manas360-api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails with errors | Check for hardcoded localhost, fix errors, rebuild |
| Database won't connect | Verify DATABASE_URL in .env.production |
| Test users still visible | Run: `DELETE FROM users WHERE email LIKE '%@manas360.com'` |
| Deploy fails | Rollback to previous commit, restore DB backup, investigate |
| Login doesn't work | Check CORS settings for production domain |
| Can't delete test migrations | Use `git rm migrations/20260225_*.sql` |

---

## Support Resources

**For detailed questions refer to:**
- Detailed cleanup → **PRODUCTION_CLEANUP_CHECKLIST.md** (Section 1-15)
- Phased approach → **PRODUCTION_DEPLOYMENT_PROCEDURES.md** (Phase 1-9)  
- Quick answers → **PRODUCTION_CLEANUP_QUICK_REFERENCE.md**
- Automated help → **scripts/production-cleanup.sh** (with --dry-run)

---

## Next Steps

### Right Now:
1. Read this file (you're doing it! ✓)
2. Review the deployment procedures document
3. Identify deployment date

### Before Deployment:
4. Create database backup
5. Create deployment branch
6. Dry-run cleanup script
7. Schedule deployment window

### During Deployment:
8. Execute cleanup script
9. Delete test users
10. Run production build
11. Deploy (follow Procedures Phase 7-8)

### After Deployment:
12. Monitor logs
13. Verify functionality
14. Announce go-live to team

---

**Status:** ✅ All resources ready  
**Last Updated:** February 25, 2026  
**Next Action:** Read PRODUCTION_DEPLOYMENT_PROCEDURES.md

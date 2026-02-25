# Production Cleanup & Deployment - Complete Resource Index

## 📦 What Was Created

Four comprehensive guides + one automated script to handle production cleanup and deployment:

### 📄 Documentation Files (4 guides)

| File | Size | Purpose | Read Time |
|------|------|---------|-----------|
| **PRODUCTION_CLEANUP_CHECKLIST.md** | 12K | Detailed step-by-step cleanup with 15 sections | 30 min |
| **PRODUCTION_CLEANUP_QUICK_REFERENCE.md** | 4.4K | Fast 5-minute checklist | 5 min |
| **PRODUCTION_DEPLOYMENT_PROCEDURES.md** | 11K | Complete 9-phase deployment guide | 20 min |
| **PRODUCTION_RESOURCES_GUIDE.md** | 9.6K | How to use all resources (meta-guide) | 10 min |

### 🔧 Automation Script (1 executable)

| File | Size | Purpose |
|------|------|---------|
| **scripts/production-cleanup.sh** | 11K | Automated cleanup with dry-run mode |

---

## 🎯 Quick Start by Role

### Development Team Lead
1. **First read:** PRODUCTION_DEPLOYMENT_PROCEDURES.md (20 minutes)
2. **Book marking:** PRODUCTION_CLEANUP_QUICK_REFERENCE.md
3. **Execution:** Run cleanup script, execute procedures

### DevOps/SRE Team
1. **Reference:** Keep PRODUCTION_CLEANUP_CHECKLIST.md nearby
2. **Automation:** Use scripts/production-cleanup.sh with --dry-run first
3. **Procedures:** Follow PRODUCTION_DEPLOYMENT_PROCEDURES.md phases

### QA/Testing Team
1. **Verify with:** PRODUCTION_CLEANUP_QUICK_REFERENCE.md
2. **Test matrix:** Use checklist from PROCEDURES document Phase 8
3. **Rollback:** Understand Phase 9 of PROCEDURES document

### Project Manager/Stakeholder
1. **Overview:** Read PRODUCTION_RESOURCES_GUIDE.md
2. **Checklist:** Print PRODUCTION_CLEANUP_QUICK_REFERENCE.md for signoff
3. **Tracking:** Use full procedures checklist from PROCEDURES document

---

## ✅ What This Solves

### Before Production, You MUST Remove:

```
✓ Test Users (8 accounts)
  └─ patient@manas360.com
  └─ therapist@manas360.com
  └─ corporate@manas360.com
  └─ education@manas360.com
  └─ healthcare@manas360.com
  └─ insurance@manas360.com
  └─ government@manas360.com
  └─ admin@manas360.com

✓ Test Migrations (2 files)
  └─ migrations/20260225_seed_test_users.sql
  └─ migrations/20260225_add_enterprise_roles.sql

✓ Test Scripts (3 files)
  └─ scripts/seed-test-users.js
  └─ scripts/generate-test-hashes.js
  └─ scripts/security-smoke.mjs

✓ Dev Environment Files
  └─ .env.local
  └─ .env.development
```

---

## 🚀 Three Ways to Deploy

### Option 1: Full Procedure (Recommended for First Deploy)
```bash
# Read full procedures
less PRODUCTION_DEPLOYMENT_PROCEDURES.md

# Follow all 9 phases:
# Phase 1: Pre-Deployment Preparation
# Phase 2: Development Cleanup (automated)
# Phase 3: Git Cleanup
# Phase 4: Production Configuration
# Phase 5: Build & Verification
# Phase 6: Final Pre-Deployment Checks
# Phase 7: Deployment
# Phase 8: Post-Deployment Verification
# Phase 9: Rollback Plan (if needed)
```

### Option 2: Quick Deploy (Experienced Teams)
```bash
# Use quick reference
cat PRODUCTION_CLEANUP_QUICK_REFERENCE.md

# Run 5 key steps:
# 1. Backup database
# 2. Run cleanup script
# 3. Delete test users
# 4. Build for production
# 5. Deploy

# Took: ~15 minutes (for experienced teams)
```

### Option 3: Automated Clean (CI/CD Pipeline)
```bash
# Run the cleanup script
bash scripts/production-cleanup.sh --dry-run
bash scripts/production-cleanup.sh

# Script handles:
# - Removing files automatically
# - Checking for hardcoded values
# - Testing build
# - Providing database cleanup SQL
```

---

## 📋 Deployment Checklist (Print This)

```
BEFORE DEPLOYMENT:
☐ Database backup created: backup_YYYYMMDD.sql
☐ Deployment branch created
☐ Current state documented
☐ Team informed of deployment window

CLEANUP PHASE:
☐ Cleanup script executed or manual cleanup completed
☐ Test users deleted from database (count = 0)
☐ Git status is clean
☐ Changes committed with descriptive message

CONFIGURATION:
☐ .env.production has REAL secrets (not localhost)
☐ DATABASE_URL points to production DB
☐ CORS configured for production domain only
☐ NODE_ENV=production verified

BUILD & VERIFY:
☐ npm run build completes with zero errors
☐ dist/ folder contains built assets
☐ No console.log statements in build
☐ No test references in source code

DEPLOYMENT:
☐ Frontend deployed to production
☐ Backend started with NODE_ENV=production
☐ Database migrations applied (if needed)
☐ Health checks passing (curl /health returns 200)

POST-DEPLOYMENT:
☐ Application loads in production domain
☐ OTP login works with real email
☐ Admin login works with MFA
☐ Admin panel shows only real users
☐ No @manas360.com test users visible anywhere
☐ Logs monitored for errors
☐ Team notified of successful deployment
```

---

## 🔥 Critical SQL Command (Copy This)

Run this EXACTLY ONCE before production goes live:

```sql
-- Connect to production database
psql "postgresql://chandu@localhost:5432/manas360_ui_main"

-- Then paste:
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

-- Verify:
SELECT COUNT(*) as test_users_remaining FROM users WHERE email LIKE '%@manas360.com';
-- Expected: 0

-- Check real users exist:
SELECT COUNT(*) as real_users FROM users WHERE is_active = true;
-- Expected: > 0
```

---

## 🛠️ Cleanup Script Commands

```bash
# Show what will be deleted (safe to run)
bash scripts/production-cleanup.sh --dry-run

# Execute cleanup (removes files, suggests DB cleanup)
bash scripts/production-cleanup.sh

# Keep migration files (if they're in git)
bash scripts/production-cleanup.sh --keep-migrations

# Skip database suggestions (do cleanup manually)
bash scripts/production-cleanup.sh --no-db

# All options combined
bash scripts/production-cleanup.sh --dry-run --keep-migrations --no-db
```

---

## 📚 Resource Navigation

**Question: What do I need to do?**
→ PRODUCTION_RESOURCES_GUIDE.md → Start here

**Question: How do I deploy step-by-step?**
→ PRODUCTION_DEPLOYMENT_PROCEDURES.md → Follow 9 phases

**Question: What exactly needs to be deleted?**
→ PRODUCTION_CLEANUP_CHECKLIST.md → 15 detailed sections

**Question: I need a quick checklist right now**
→ PRODUCTION_CLEANUP_QUICK_REFERENCE.md → 5-minute version

**Question: Show me what cleanup script will do**
→ Run: `bash scripts/production-cleanup.sh --dry-run`

**Question: What about rollback if deployment fails?**
→ PRODUCTION_DEPLOYMENT_PROCEDURES.md → Phase 9

---

## ⚡ One-Command Deployment Summary

```bash
# This single command shows the entire cleanup process:
bash scripts/production-cleanup.sh --dry-run

# Output will show:
# 1. Test migrations to be removed
# 2. Test scripts to be removed
# 3. Dev env files to be removed
# 4. Localhost references (if any)
# 5. Build test result
# 6. SQL command for test user deletion
# 7. Git cleanup instructions
```

---

## 🎓 Learning Path

**If you're new to this project:**
1. Read: PRODUCTION_RESOURCES_GUIDE.md (10 min)
2. Read: PRODUCTION_DEPLOYMENT_PROCEDURES.md (20 min)
3. Dry-run: `bash scripts/production-cleanup.sh --dry-run` (2 min)
4. Review: PRODUCTION_CLEANUP_CHECKLIST.md (10 min reference only)
5. Execute: Follow procedures when ready

**If you've done this before:**
1. Print: PRODUCTION_CLEANUP_QUICK_REFERENCE.md
2. Run: `bash scripts/production-cleanup.sh --dry-run`
3. Execute: `bash scripts/production-cleanup.sh`
4. Verify: Delete test users via SQL
5. Deploy: Follow your usual procedures

---

## 📊 Files Quick Summary

| Resource | Best For | When To Use |
|----------|----------|------------|
| CLEANUP_CHECKLIST | Detailed reference | Planning phase |
| CLEANUP_QUICK_REF | During deployment | Day-of checklist |  
| DEPLOYMENT_PROCEDURES | Learning process | First-time deploys |
| RESOURCES_GUIDE | Choosing right doc | Getting started |
| production-cleanup.sh | Automation | Execution phase |

---

## 🚨 Critical Warnings

**BACKUP FIRST!**
```bash
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql
# Without this backup, you cannot recover if deployment fails
```

**DELETE IN RIGHT ORDER**
1. ✓ Backup database
2. ✓ Run cleanup script / manual cleanup
3. ✓ Delete test users from DB
4. ✓ Delete test files from git
5. ✓ Deploy

**VERIFY MULTIPLE TIMES**
- [ ] Database: `SELECT COUNT(*) FROM users WHERE email LIKE '%@manas360.com'` → must be 0
- [ ] Files: Test files should be gone
- [ ] Build: `npm run build` must succeed
- [ ] Health: API must respond with 200

---

## ✨ You're Ready!

All resources are in place. Choose your path:

- **First time?** → Start with PRODUCTION_DEPLOYMENT_PROCEDURES.md
- **Quick deploy?** → Use PRODUCTION_CLEANUP_QUICK_REFERENCE.md + script
- **Full audit?** → Use PRODUCTION_CLEANUP_CHECKLIST.md
- **Git cleanup?** → Use scripts/production-cleanup.sh

**Next Step:** Pick a resource above and get started! ✅

---

**Created:** February 25, 2026  
**Status:** ✅ Production-Ready  
**Test Users:** 8 accounts need deletion before go-live  
**Cleanup Scripts:** Automated and ready  

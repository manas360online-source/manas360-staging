#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# PRODUCTION CLEANUP SCRIPT
# ════════════════════════════════════════════════════════════════════════════
#
# This script automates the removal of test data, development files, and
# temporary configurations before deploying to production/staging.
#
# USAGE:
#   bash scripts/production-cleanup.sh [--dry-run] [--keep-migrations] [--no-db]
#
# OPTIONS:
#   --dry-run          Show what would be deleted without actually deleting
#   --keep-migrations  Keep migration files (useful if migrations are in git)
#   --no-db            Skip database cleanup (do manually instead)
#
# ════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

DRY_RUN=0
KEEP_MIGRATIONS=0
SKIP_DB=0

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run) DRY_RUN=1 ;;
    --keep-migrations) KEEP_MIGRATIONS=1 ;;
    --no-db) SKIP_DB=1 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   MANAS360 PRODUCTION CLEANUP SCRIPT${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $DRY_RUN -eq 1 ]; then
  echo -e "${YELLOW}[DRY RUN MODE] - No files will be deleted${NC}"
  echo ""
fi

# ════════════════════════════════════════════════════════════════════════════
# 1. REMOVE TEST MIGRATIONS
# ════════════════════════════════════════════════════════════════════════════

if [ $KEEP_MIGRATIONS -eq 0 ]; then
  echo -e "${BLUE}1. Removing test migration files...${NC}"
  
  TEST_MIGRATIONS=(
    "migrations/20260225_seed_test_users.sql"
    "migrations/20260225_add_enterprise_roles.sql"
  )
  
  for file in "${TEST_MIGRATIONS[@]}"; do
    if [ -f "$file" ]; then
      echo -e "   ${RED}✗${NC} Removing: $file"
      if [ $DRY_RUN -eq 0 ]; then
        rm -f "$file"
      fi
    fi
  done
  echo -e "   ${GREEN}✓${NC} Migration cleanup complete"
  echo ""
fi

# ════════════════════════════════════════════════════════════════════════════
# 2. REMOVE TEST SCRIPTS
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}2. Removing test/development scripts...${NC}"

TEST_SCRIPTS=(
  "scripts/seed-test-users.js"
  "scripts/generate-test-hashes.js"
  "scripts/security-smoke.mjs"
)

for file in "${TEST_SCRIPTS[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${RED}✗${NC} Removing: $file"
    if [ $DRY_RUN -eq 0 ]; then
      rm -f "$file"
    fi
  fi
done
echo -e "   ${GREEN}✓${NC} Script cleanup complete"
echo ""

# ════════════════════════════════════════════════════════════════════════════
# 3. REMOVE DEVELOPMENT ENV FILES
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}3. Removing development environment files...${NC}"

DEV_ENV_FILES=(
  ".env.local"
  ".env.development"
  ".env.development.local"
  ".env.test"
  ".env.test.local"
)

for file in "${DEV_ENV_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "   ${RED}✗${NC} Removing: $file"
    if [ $DRY_RUN -eq 0 ]; then
      rm -f "$file"
    fi
  fi
done
echo -e "   ${GREEN}✓${NC} Environment file cleanup complete"
echo ""

# ════════════════════════════════════════════════════════════════════════════
# 4. VERIFY NODE_ENV AND PRODUCTION CONFIG
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}4. Verifying production configuration...${NC}"

# Check .env.production exists
if [ -f ".env.production" ]; then
  echo -e "   ${GREEN}✓${NC} .env.production found"
  
  # Check for production values
  if grep -q "NODE_ENV=production" .env.production; then
    echo -e "   ${GREEN}✓${NC} NODE_ENV=production is set"
  else
    echo -e "   ${YELLOW}⚠${NC} NODE_ENV not set to production in .env.production"
  fi
else
  echo -e "   ${YELLOW}⚠${NC} .env.production not found - create it for production deployment"
fi
echo ""

# ════════════════════════════════════════════════════════════════════════════
# 5. CHECK FOR HARDCODED LOCALHOST/DEV REFERENCES
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}5. Scanning for hardcoded development references...${NC}"

DEV_REFS=0

# Check frontend
if grep -r "localhost:3000\|localhost:5001\|127.0.0.1" frontend/main-app --include="*.tsx" --include="*.ts" 2>/dev/null | grep -v ".test." | grep -v "// "; then
  echo -e "   ${YELLOW}⚠${NC} Found localhost references in frontend code:"
  grep -r "localhost:3000\|localhost:5001" frontend/main-app --include="*.tsx" --include="*.ts" 2>/dev/null || true
  DEV_REFS=1
fi

# Check backend
if grep -r "localhost:3000\|localhost:5001" backend/src --include="*.js" --include="*.ts" 2>/dev/null | grep -v ".test." | grep -v "// "; then
  echo -e "   ${YELLOW}⚠${NC} Found localhost references in backend code"
  DEV_REFS=1
fi

if [ $DEV_REFS -eq 0 ]; then
  echo -e "   ${GREEN}✓${NC} No hardcoded localhost references found"
fi
echo ""

# ════════════════════════════════════════════════════════════════════════════
# 6. DATABASE CLEANUP (Optional)
# ════════════════════════════════════════════════════════════════════════════

if [ $SKIP_DB -eq 0 ]; then
  echo -e "${BLUE}6. Database cleanup (test users)...${NC}"
  
  DB_URL="${DATABASE_URL:-postgresql://chandu@localhost:5432/manas360_ui_main}"
  
  echo -e "   ${YELLOW}⚠${NC} Database cleanup requires manual verification:"
  echo "   Run this SQL to delete test users:"
  echo ""
  cat << 'EOF'
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

  SELECT COUNT(*) as remaining_test_users FROM users 
  WHERE email LIKE '%@manas360.com';
EOF
  echo ""
  echo "   Connection string: $DB_URL"
  echo ""
else
  echo -e "${BLUE}6. Database cleanup skipped (--no-db flag)${NC}"
  echo -e "   ${YELLOW}⚠${NC} Remember to manually delete test users from database"
  echo ""
fi

# ════════════════════════════════════════════════════════════════════════════
# 7. PRODUCTION BUILD TEST
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}7. Testing production build...${NC}"

if [ $DRY_RUN -eq 0 ]; then
  if npm run build > /dev/null 2>&1; then
    echo -e "   ${GREEN}✓${NC} Production build successful"
  else
    echo -e "   ${RED}✗${NC} Production build failed - fix errors before deploying"
  fi
else
  echo -e "   ${YELLOW}(Skipped in dry-run mode)${NC}"
fi
echo ""

# ════════════════════════════════════════════════════════════════════════════
# 8. FINAL SUMMARY
# ════════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}CLEANUP SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $DRY_RUN -eq 1 ]; then
  echo -e "${YELLOW}DRY RUN COMPLETE - No files were actually deleted${NC}"
  echo "Run without --dry-run to apply changes:"
  echo "  bash scripts/production-cleanup.sh"
else
  echo -e "${GREEN}Cleanup complete!${NC}"
fi

echo ""
echo -e "${BLUE}Remaining cleanup steps:${NC}"
echo "  1. Delete test users from database (see above)"
echo "  2. Remove test migrations from git: git rm migrations/20260225_*.sql"
echo "  3. Remove test scripts from git: git rm scripts/seed-*.js scripts/generate-*.js"
echo "  4. Verify NODE_ENV=production in deployment config"
echo "  5. Update CORS for production domain (not localhost)"
echo "  6. Review and update .env.production with real credentials"
echo "  7. Back up production database before final deployment"
echo "  8. Review PRODUCTION_CLEANUP_CHECKLIST.md for full checklist"
echo ""
echo -e "${YELLOW}⚠  BACKUP PRODUCTION DATABASE BEFORE DEPLOYING${NC}"
echo ""

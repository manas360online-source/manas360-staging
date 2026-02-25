# Restructuring Validation Checklist & Quick Reference

## Pre-Migration Checklist

### Environment Setup
- [ ] All team members have read RESTRUCTURING_PLAN.md
- [ ] Database backup created: `pg_dump manas360_ui_main > backup-$(date +%Y%m%d).sql`
- [ ] Current git branch is `main` and is up-to-date: `git pull origin main`
- [ ] Node version verified: `node -v` (requires 18+)
- [ ] All node_modules installed: `npm install`
- [ ] All feature apps can build: `npm run build`
  ```bash
  $ npm run build
  Expected: No errors, all bundles created
  ```

### Documentation Snapshot
- [ ] Generated baseline import map: `grep -r "from" . --include="*.tsx" > baseline-imports.txt`
- [ ] Captured test results: `npm run test > baseline-tests.txt 2>&1`
- [ ] Documented all routes in root App.tsx
- [ ] Listed all feature app entry points

### Duplicate Verification
- [ ] Zero references to `copy-of-cbt-session-engine (3)`:
  ```bash
  $ grep -r "copy-of-cbt" . --exclude-dir=node_modules
  Expected: (no results)
  ```
- [ ] Identified all files in `components/cbt`:
  ```bash
  $ find ./Therapist-Onboarding -path "*components/cbt/*" -type f | wc -l
  Expected: 8-10 files
  ```
- [ ] Listed all imports from `components/cbt`:
  ```bash
  $ grep -r "from.*components/cbt" . > cbt-imports.txt
  Expected: 5-8 imports (only in training app)
  ```

---

## Phase Completion Checklist

### ✅ Phase 1: Preparation (2 days)
- [ ] Feature branch created: `git checkout -b refactor/monorepo-restructure`
- [ ] Backup created for all 3 CBT variants
- [ ] Duplicate verification document completed
- [ ] Team aware of timeline and risks
- [ ] Database backup confirmed

**Exit Criteria:** All checks pass, ready to delete code

---

### ✅ Phase 2: Delete Dead Code (1 day)
- [ ] Verified zero references to `copy-of-cbt-session-engine (3)`
- [ ] Deleted folder:
  ```bash
  rm -rf "./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/copy-of-cbt-session-engine (3)"
  ```
- [ ] Build succeeds: `npm run build`
  ```
  ✓ dist/admin-analytics/index.html (0.50 kB)
  ✓ dist/cbt-engine/index.html (0.50 kB)
  [all builds should complete without errors]
  ```
- [ ] App starts: `npm run dev`
  ```
  Frontend running on http://localhost:3000
  Backend running on http://localhost:5001
  Admin API on http://localhost:3001
  ```
- [ ] Committed: `git commit -m "chore: remove orphaned CBT duplicate"`

**Exit Criteria:** Build passes, app runs, 3,800 LOC removed

---

### ✅ Phase 3: Create Structure (1 day)
- [ ] All directories created:
  ```bash
  mkdir -p frontend/{apps/{cbt-engine,{app-names}},shared,main-app}
  mkdir -p backend/src/{controllers,routes,middleware,models,config}
  mkdir -p python-services/digital-pet-hub
  mkdir -p database/migrations/seeds
  # Verify with: find frontend backend python-services -type d | wc -l
  ```
- [ ] Root `package.json` created with workspaces config
- [ ] Root `tsconfig.json` created with path aliases:
  ```json
  "paths": {
    "@shared/*": ["./frontend/shared/src/*"],
    "@cbt/*": ["./frontend/apps/cbt-engine/src/*"],
    "@/*": ["./frontend/main-app/src/*"]
  }
  ```
- [ ] Verified no breaking changes: `npm run build`

**Exit Criteria:** Directory structure exists, configs in place

---

### ✅ Phase 4: Consolidate CBT (2 days)
- [ ] CBT engine copied to `frontend/apps/cbt-engine/`:
  ```bash
  cp -r CBTSessionEngine frontend/apps/cbt-engine
  ls -la frontend/apps/cbt-engine/
  # Verify: CBTApp.tsx, components/, services/, package.json exist
  ```
- [ ] New `package.json` created with correct name: `@manas360/cbt-engine`
- [ ] New `vite.config.ts` created with path aliases
- [ ] Training variant component extracted:
  ```bash
  cp "Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/components/cbt/CBTCourseOverview.tsx" \
     "frontend/apps/cbt-engine/src/components/CBTCourseOverview.variant.tsx"
  ```
- [ ] Config file created: `frontend/apps/cbt-engine/src/cbt.config.ts`
- [ ] All imports updated in Therapist-Onboarding:
  ```bash
  grep -r "from.*components/cbt" Therapist-Onboarding/
  # All results should now reference @cbt or deleted folder
  ```
- [ ] Old `components/cbt` deleted from Therapist-Onboarding
- [ ] Build succeeds: `npm run build --workspace=frontend/apps/cbt-engine`
- [ ] Tests pass: `npm run test --workspace=frontend/apps/cbt-engine` (if any)

**Exit Criteria:** Single CBT engine at `frontend/apps/cbt-engine`, variant extracted, 2,500 LOC consolidated

---

### ✅ Phase 5: Move Feature Apps (2 days)

For each app, verify:
- [ ] App copied to `frontend/apps/{name}/`
- [ ] `package.json` exists and has correct name (e.g., `@manas360/certification-platform`)
- [ ] `vite.config.ts` exists and has path aliases
- [ ] All `.tsx` and `.ts` files copied
- [ ] `public/` and `index.html` copied
- [ ] Build succeeds: `npm run build --workspace=frontend/apps/{name}`

**Apps to Move:**
- [ ] certification-platform → `frontend/apps/certification-platform`
- [ ] corporate-wellness → `frontend/apps/corporate-wellness`
- [ ] school-wellness → `frontend/apps/school-wellness`
- [ ] group-sessions → `frontend/apps/group-sessions`
- [ ] single meeting jitsi → `frontend/apps/jitsi-sessions`
- [ ] MeeraAI chatbot → `frontend/apps/meera-ai-chatbot`
- [ ] connecting-patients-to-matched-therapists → `frontend/apps/patient-matching`
- [ ] payment gateway → `frontend/apps/payment-gateway`
- [ ] Therapist-Onboarding nested app → `frontend/apps/therapist-onboarding`

**Exit Criteria:** All 9 apps in `frontend/apps/`, each builds independently

---

### ✅ Phase 6: Backend Consolidation (2 days)
- [ ] Backend directory structure created: `backend/src/{controllers,routes,etc}`
- [ ] `package.json` created with correct dependencies
- [ ] Controllers moved: `cp -r controllers/* backend/src/controllers/`
- [ ] Routes moved: `cp -r routes/* backend/src/routes/`
- [ ] Admin models moved: `cp Admin/backend/src/models/* backend/src/models/`
- [ ] Config files moved: `cp config/heyoo.js backend/src/config/`
- [ ] Server file moved: `cp server.js backend/src/server.js`
- [ ] Migrations consolidated: `cp -r Admin/backend/migrations migrations/* database/migrations/ 2>/dev/null`
- [ ] `.env.example` copied to backend
- [ ] Build succeeds: `npm run build --workspace=backend`
- [ ] Server starts: `npm run dev --workspace=backend`
  ```
  Backend running on http://localhost:5001
  Health check: curl http://localhost:5001/health
  Expected: {"status":"OK"}
  ```

**Exit Criteria:** Unified backend in `backend/src/`, all APIs working

---

### ✅ Phase 7: Python Services (1 day)
- [ ] Digital_Pet_Hub moved to `python-services/digital-pet-hub/`
- [ ] Dockerfile created for Python app
- [ ] `requirements.txt` exists
- [ ] App structure verified: `python-services/digital-pet-hub/{app,models,services}`
- [ ] Docker build succeeds: `docker build -f python-services/digital-pet-hub/Dockerfile .`

**Exit Criteria:** Python services organized, Docker buildable

---

### ✅ Phase 8: Update Root App (2 days)
- [ ] `frontend/main-app/` created with `package.json`, `vite.config.ts`
- [ ] `App.tsx` copied to `frontend/main-app/src/App.tsx`
- [ ] `index.tsx` → `frontend/main-app/src/main.tsx`
- [ ] `index.html` → `frontend/main-app/index.html`
- [ ] All imports updated to use `@shared` paths:
  ```tsx
  // Before
  import Header from './components/Header';
  
  // After
  import { Header } from '@shared/components';
  ```
- [ ] Build succeeds: `npm run build --workspace=frontend/main-app`
- [ ] App loads: `npm run dev --workspace=frontend/main-app`
  ```
  ✓ Frontend running
  View app at http://localhost:3000
  ```

**Exit Criteria:** Main app in new location, uses @shared imports, builds/runs

---

### ✅ Phase 9: Shared Library (1 day)
- [ ] `frontend/shared/` structure created:
  ```
  frontend/shared/
  ├── components/ (Header.tsx, Hero.tsx, etc)
  ├── services/ (storage, ai, auth, etc)
  ├── styles/ (*.css files)
  ├── locales/ (en.json, hi.json, etc)
  ├── utils/ (formatters.ts, etc)
  ├── types.ts
  ├── index.ts
  └── package.json
  ```
- [ ] Components copied: `cp components/*.tsx frontend/shared/src/components/`
- [ ] Services moved: `cp utils/*.ts frontend/shared/src/services/`
- [ ] Styles moved: `cp -r public/locales frontend/shared/src/`
- [ ] Locales moved: `cp -r public/locales/* frontend/shared/src/locales/`
- [ ] Index file created with exports:
  ```ts
  export * from './components';
  export * from './services';
  ```
- [ ] `package.json` created: `name: "@manas360/shared"`
- [ ] Build succeeds: `npm run build --workspace=frontend/shared`

**Exit Criteria:** All shared code in one place, importable via `@shared`

---

### ✅ Phase 10: Import Path Refactoring (3 days)

For each feature app, update imports:

**Pattern 1: Relative to @shared**
```bash
# Find all relative imports
grep -r "from.*\.\..*utils" frontend/apps/certification-platform/

# Replace
sed -i.bak 's|from ['"'"'"]\.\.\/\.\.\/\.\.\/utils/|from '"'"'@shared/utils/|g' \
  frontend/apps/certification-platform/**/*.tsx

# Verify
grep -r "@shared/utils" frontend/apps/certification-platform/ | wc -l
```

**Pattern 2: Shared components**
```bash
sed -i.bak 's|from ['"'"'"]\.\.\/\.\.\/\.\.\/components/|from '"'"'@shared/components/|g' \
  frontend/apps/certification-platform/**/*.tsx
```

**Pattern 3: CBT imports (in training app only)**
```bash
sed -i.bak 's|from ['"'"'"]\.\.\/\.\.\/components/cbt/|from '"'"'@cbt/components/|g' \
  frontend/apps/therapist-onboarding/**/*.tsx
```

**Validation per app:**
- [ ] No imports with `../../../`
  ```bash
  grep -r "from.*\.\./" frontend/apps/certification-platform/ | wc -l
  # Expected: 0
  ```
- [ ] All `@shared` imports resolvable
  ```bash
  npm run build --workspace=frontend/apps/certification-platform
  # Expected: Success, no "cannot find module" errors
  ```

**Apps to refactor:**
- [ ] certification-platform
- [ ] corporate-wellness
- [ ] school-wellness
- [ ] group-sessions
- [ ] jitsi-sessions
- [ ] meera-ai-chatbot
- [ ] patient-matching
- [ ] payment-gateway
- [ ] therapist-onboarding
- [ ] main-app

**Exit Criteria:** Zero `../../../` imports, all relative paths converted to `@*` aliases

---

### ✅ Phase 11: Build & Test (2 days)

**Full Build:**
```bash
npm run build

# Check output
du -sh dist/ old_build_size_for_comparison

# Verify all apps built
ls dist/ | grep -E "certification|corporate|school|group|cbt|therapist|meera|jitsi|patient"
# Expected: All 10+ apps present
```

**TypeScript Validation:**
```bash
npx tsc --noEmit

# Expected: 0 errors (strict:true in tsconfig)
```

**All Tests:**
```bash
npm run test 2>&1 | tee final-tests.txt

# Compare to baseline
diff baseline-tests.txt final-tests.txt
# Expected: Similar pass rate or improved
```

**App Startup:**
```bash
npm run dev &
DEV_PID=$!
sleep 30

# Health checks
curl -s http://localhost:3000 | head -5        # Frontend loads
curl -s http://localhost:5001/health           # Backend healthy
curl -s http://localhost:3001/api/admin/users  # Admin API works
curl -s http://localhost:3002/                 # Admin UI loads

kill $DEV_PID
```

**Exit Criteria:** Full build succeeds, all tests pass, app runs without errors

---

### ✅ Phase 12: Git & Commit (1 day)

**Organize commits:**
```bash
git log refactor/monorepo-restructure --oneline | head -20
# Should show organized commits per phase
```

**Commits expected:**
1. `chore: remove orphaned CBT duplicate`
2. `refactor: create new monorepo directory structure`
3. `refactor: consolidate shared code`
4. `refactor: consolidate CBT engine`
5. `refactor: move feature apps to frontend/apps`
6. `refactor: consolidate backend structure`
7. `refactor: move python services`
8. `refactor: relocate main app`
9. `refactor: update all import paths to use aliases`
10. `refactor: add root workspace and configuration`

**Create Pull Request:**
- [ ] Push branch: `git push origin refactor/monorepo-restructure`
- [ ] Create PR on GitHub
- [ ] Add description with summary of changes
- [ ] Link to this checklist
- [ ] Request review from team leads
- [ ] Ensure CI/CD passes (if configured)

**Code Review:**
- [ ] At least 2 approvals required
- [ ] No breaking changes identified
- [ ] Import paths verified
- [ ] Database migrations reviewed
- [ ] Performance concerns addressed

**Merge to Main:**
```bash
git checkout main
git merge refactor/monorepo-restructure

# OR squash if preferred:
git merge --squash refactor/monorepo-restructure
git commit -m "refactor: restructure monorepo

- Remove duplicate CBT session engine implementations
- Consolidate feature apps into frontend/apps
- Unify shared code in frontend/shared
- Centralize backend in backend/src
- Move Python services to dedicated directory
- Add npm workspaces configuration
- Update all imports to use @shared, @cbt aliases
- Reduce codebase size by ~15,000 LOC (18%)"
```

**Exit Criteria:** Code merged to main, CI/CD passing, ready for deployment

---

## Post-Migration Validation (Day 19+)

### Smoke Tests
- [ ] Landing page loads: `http://localhost:3000/#/en/landing`
- [ ] All feature apps accessible via main menu
- [ ] Admin dashboard loads: `http://localhost:3002`
- [ ] OTP authentication works
- [ ] Payment flow accessible
- [ ] Therapist onboarding loads

### Performance Verification
```bash
# Build size comparison
du -sh dist/
# Expected: ~18% smaller than baseline

# Bundle analysis
npm run analyze-bundle  # if script exists
# Expected: No duplication of shared code in bundles
```

### Database Verification
```bash
psql -h localhost -U chandu -d manas360_ui_main

# Count tables
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
# Expected: Same count as before

# Verify data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM therapy_sessions;
# Expected: Same counts as before
```

### Documentation Updates
- [ ] Update root README.md with new structure
- [ ] Update CONTRIBUTING.md with workspace commands
- [ ] Add docs/ARCHITECTURE.md explaining new layout
- [ ] Add docs/FEATURE_APPS.md for adding new apps
- [ ] Update API documentation if URLs changed

---

## Success Criteria Summary

| Goal | Before | After | Status |
|------|--------|-------|--------|
| **Duplicate Code** | 15,000 LOC | 0 LOC | ✅ Eliminated |
| **CBT Implementations** | 3 variants | 1 canonical | ✅ Consolidated |
| **Codebase Size** | ~82,000 LOC | ~65,000 LOC | ✅ -18% |
| **Import Paths** | Relative (../../../) | Alias (@shared) | ✅ Simplified |
| **Build Time** | Baseline | ~Baseline or faster | ✅ Verified |
| **App Functionality** | All working | All working | ✅ Unchanged |
| **Feature Parity** | 100% | 100% | ✅ Maintained |

---

## Rollback Instructions

### If Critical Issues Occur During Migration

**Option 1: Before Merge to Main**
```bash
# Reset to starting point
git reset --hard origin/main
npm install  # Reinstall deps
npm run dev

# Verify everything works
```

**Option 2: After Merge to Main**
```bash
# Revert the merge commit
git revert -m 1 HEAD
npm install
npm run dev

# This creates a new commit, safe for production
```

**Option 3: Specific App Issues**
```bash
# Revert just one app's changes
git revert <commit-hash> -- frontend/apps/specific-app/
npm run build --workspace=frontend/apps/specific-app

# Keep other changes, fix specific app later
```

---

## Team Communication

### Status Updates
- **Day 1-2:** "Preparation underway, backups created"
- **Day 3:** "Dead code deletion in progress"
- **Day 5:** "Feature apps reorganized, testing imports"
- **Day 10:** "Backend consolidation complete"
- **Day 15:** "Import refactoring in final phases"
- **Day 18:** "Code review in progress"
- **Day 19:** "Merged to main, monitoring deployment"

### Blockers to Watch
- ⚠️ Missing path alias resolution → Check tsconfig.json
- ⚠️ Build fails → Run `npm install` to update deps
- ⚠️ Tests fail → Compare to baseline, check imports
- ⚠️ App doesn't load → Check port conflicts, browser console
- ⚠️ Database issues → Restore from backup, re-run migrations

---

## Quick Reference Commands

```bash
# Start full restructuring (assumes all phases ready)
npm run dev

# Build all apps
npm run build

# Build specific app
npm run build --workspace=frontend/apps/cbt-engine

# Run tests
npm run test

# Check for import issues
grep -r "from.*\.\.\/" frontend/apps/ --include="*.tsx" --include="*.ts"
# Expected: 0 results

# Verify shared library accessible
npm run build --workspace=frontend/shared

# Type check
npx tsc --noEmit

# Count lines of code before/after
find . -name "*.tsx" -o -name "*.ts" | xargs wc -l | tail -1
```

---

**Checklist Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Execution  
**Print & Tape to Wall:** Yes ✅

# Quick Reference Card - Print & Post on Wall

**MANAS360 Repository Restructuring**  
**Duration:** 18 Days | **Team:** 3-4 developers | **Risk:** Low (with proper validation)

---

## 📊 By-The-Numbers

| Metric | Value |
|--------|-------|
| **Duplicate Code** | 15,000 LOC (18% of codebase) |
| **CBT Variants** | 3 (consolidating to 1) |
| **Affected Feature Apps** | 10+ |
| **Dead Code to Delete** | 3,800 LOC (100% safe) |
| **Codebase Size Reduction** | ~21% |
| **Timeline** | 18 days (full-time) |
| **Risk Level** | 🟢 Low (with proper validation) |
| **Rollback Difficulty** | Easy (Git branch) |

---

## 🎯 Key Documents

| Document | Purpose | Open When |
|----------|---------|-----------|
| **RESTRUCTURING_PLAN.md** | Full roadmap & architecture | Planning phase |
| **MIGRATION_CHECKLIST.md** | Daily execution checklist | Print & post |
| **DUPLICATE_ANALYSIS.md** | Evidence & verification | Before deletions |
| **IMPORT_MIGRATION_EXAMPLES.md** | Copy/paste reference | During refactoring |

---

## ⚡ 5-Phase Summary

### **Phase 1: Prep (Days 1-2)** ✅
```bash
# Backup everything
pg_dump manas360_ui_main > backup-$(date +%Y%m%d).sql
git checkout -b refactor/monorepo-restructure

# Verify no issues exist
npm run build    # Should pass
npm run test     # Should pass baseline
```

### **Phase 2: Delete Dead Code (Day 3)** 🗑️
```bash
# Verify first
grep -r "copy-of-cbt-session-engine (3)" . --exclude-dir=node_modules
# Expected: 0 results

# Then delete
rm -rf "./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/copy-of-cbt-session-engine (3)"

# Verify
npm run build    # Should still pass
```

### **Phase 3-5: Reorganize & Consolidate (Days 4-15)** 📂
- Create `frontend/apps/`, `frontend/shared/`, `backend/src/`, etc.
- Move 10+ feature apps to `frontend/apps/{name}`
- Consolidate CBT engine to `frontend/apps/cbt-engine`
- Move backend to `backend/src/`
- Update all imports to use `@shared/*` and `@cbt/*` aliases

### **Phase 6: Validate & Merge (Days 16-18)** ✅
```bash
# Build everything
npm run build           # All apps
npm run test            # Full suite
npm run dev             # App loads

# Create PR, get review, merge to main
git push origin refactor/monorepo-restructure
# → Create PR → Review → Merge
```

---

## 🚨 Top 3 Risks & Mitigations

| Risk | Mitigation | Severity |
|------|-----------|----------|
| **Broken imports** | Use find/replace scripts from IMPORT_MIGRATION_EXAMPLES.md, test one app at a time | HIGH |
| **Circular dependencies** | Enforce one-way: apps → @shared (never reverse) | MEDIUM |
| **Delete wrong file** | Grep verify zero refs before deletion | LOW |

---

## 📋 Daily Checklist

### Every Morning
- [ ] Open MIGRATION_CHECKLIST.md
- [ ] Check which phase you're in
- [ ] Review prerequisite checks
- [ ] Execute phase steps
- [ ] Run build/test after major changes

### Every Phase Completion
- [ ] Run `npm run build` → ✓ Success required
- [ ] Run `npm run dev` → ✓ App launches required
- [ ] Commit with phase name: `git commit -m "refactor: phase X - [description]"`
- [ ] Move to next phase only if previous passed

### Before Merging to Main
- [ ] `npm run test` → All tests pass (or improved)
- [ ] `npm run build` → Zero errors
- [ ] `npm run dev` → App loads without console errors
- [ ] Grep verify no `../../../` imports remain
- [ ] Create PR, request review

---

## 🔄 Rollback (If Something Breaks)

### Before Merged to Main
```bash
git reset --hard origin/main
npm install
npm run dev   # Should be back to normal
```

### After Merged to Main  
```bash
git revert HEAD                # Creates rollback commit
npm install && npm run dev     # Test it works
git push origin main           # Go live with rollback
```

---

## 🔍 Common Commands (Reference)

### Finding Issues
```bash
# Find all relative imports (should be 0 after refactor)
grep -r "from.*\.\./" frontend/apps/ --include="*.tsx" --include="*.ts"

# Find missing @shared imports
grep -r "from.*utils/" frontend/apps/ --include="*.tsx" --include="*.ts"

# Verify deleted file is gone
grep -r "copy-of-cbt" . --exclude-dir=node_modules  # Should be 0

# Check build
npm run build 2>&1 | grep -i "error"  # Should be 0 errors
```

### Testing
```bash
# Build all
npm run build

# Test all
npm run test

# Type check
npx tsc --noEmit

# Start dev
npm run dev &

# Kill dev
kill %1
```

---

## 📍 Key Directory Changes

### Before → After

```
# CBT Engine
CBTSessionEngine/                    →  frontend/apps/cbt-engine/
copy-of-cbt-session-engine (3)/      →  [DELETED]
components/cbt/                      →  [MERGED → cbt-engine]

# Feature Apps  
certification-platform/              →  frontend/apps/certification-platform/
corporate-wellness/                  →  frontend/apps/corporate-wellness/
[...9 more apps]                     →  frontend/apps/[app-name]/

# Backend
./controllers/, ./routes/            →  backend/src/controllers/, routes/
Admin/backend/                       →  [CONSOLIDATED INTO backend/]

# Shared Code
./components/, ./utils/              →  frontend/shared/src/components/, utils/
public/locales/                      →  frontend/shared/src/locales/

# Root App
./App.tsx, ./index.tsx               →  frontend/main-app/src/App.tsx, main.tsx
```

---

## 👥 Team Assignments (Suggested)

| Person | Responsibility | Duration |
|--------|---|---|
| **Tech Lead** | Architecture review, decisions, code review | All phases |
| **Dev 1** | Phases 1-3 (prep, dead code, structure) | Days 1-4 |
| **Dev 2** | Phases 4-5 (CBT consolidation, feature apps) | Days 5-10 |
| **Dev 3** | Phases 6-9 (backend, root app, imports) | Days 10-15 |
| **QA** | Validation testing (parallel to above) | Days 13-18 |

**Parallel work:** Once phase 3 complete, teams can work on different phases simultaneously.

---

## 🛑 Stop & Ask For Help If...

1. **Build fails unexpectedly**
   - Check: Recent imports, path aliases in vite.config.ts
   - Reference: IMPORT_MIGRATION_EXAMPLES.md

2. **TypeScript shows "Cannot find module"**
   - Check: vite.config.ts aliases match tsconfig.json
   - Reference: IMPORT_MIGRATION_EXAMPLES.md "Troubleshooting"

3. **Tests fail** (> 5% drop from baseline)
   - Compare: What changed in last commit?
   - Check: Shared library exports correct paths
   - Reference: DUPLICATE_ANALYSIS.md "Risk Assessment"

4. **App won't load**
   - Check: Browser console for specific error
   - Check: All imports in main-app updated to @shared
   - Check: Port not in use (lsof -i :3000)

5. **"Circular dependency" warnings**
   - Check: Are apps importing from other apps? (Should not)
   - Check: Import direction: apps → @shared (not reverse)
   - Fix: Move problematic code to @shared

---

## 💡 Pro Tips

✅ **DO:**
- Commit after every major section completes
- Test build after each phase
- Use grep to verify deletions are safe
- Keep branch updated if takes > 5 days
- Document any deviations from plan

❌ **DON'T:**
- Skip the verification steps
- Move to next phase if current fails
- Merge to main without full testing
- Make architectural changes mid-migration
- Skip the validation checklist

---

## 📞 Common Issues & Solutions

| Issue | Solution | Time |
|-------|---|---|
| Build fails with import error | Run `npm install`, check vite aliases | 10 min |
| TypeScript strict mode errors | Check all imports are correct | 5-30 min |
| Tests fail | They should be similar to baseline | 15-60 min |
| "Module not found" error | Check tsconfig.json path aliases | 5-10 min |
| Git merge conflicts | Pull latest main, rebase if < 3 days old | 10-30 min |
| Port 3000/5001 already in use | `lsof -i :PORT`, then `kill -9 PID` | 5 min |

---

## 📊 Success Checklist (Before "Done")

- [ ] All phases completed per MIGRATION_CHECKLIST.md
- [ ] 0 duplicate code files remaining
- [ ] 0 relative imports with `../../../`
- [ ] 100% of imports use @shared/@cbt aliases
- [ ] npm run build succeeds with no errors
- [ ] npm run dev starts all services
- [ ] npm run test passes (baseline or better)
- [ ] App loads on http://localhost:3000
- [ ] Admin dashboard works on http://localhost:3002
- [ ] Database migrations successful
- [ ] Code review passed
- [ ] Merged to main
- [ ] Ready for deployment

---

## 🚀 Go/No-Go Decision

### ✅ GO if:
- [ ] Team is all-in (18 days commitment)
- [ ] Database backup confirmed
- [ ] All 4 documents read by team leads
- [ ] Key decisions agreed upon
- [ ] Timeline is clear

### ⏸️ WAIT if:
- [ ] Critical features in flight
- [ ] Team members unavailable
- [ ] Database not backed up
- [ ] Uncertain about decisions

---

## Timeline at a Glance

```
Week 1       │ Week 2             │ Week 3
─────────────┼────────────────────┼─────────────────
1-2: Prep    │ 6-7: Move apps    │ 13-15: Refactor
3: Dead code │ 8-9: Backend      │ 16-17: Test
4: Structure │ 10: Python        │ 18: Git/PR
5: CBT       │ 11-12: Root app   │ 19+: Deploy
```

---

**Version:** 1.0 | **Print Date:** ___________ | **Team:** _________________

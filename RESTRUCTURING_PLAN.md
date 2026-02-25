# MANAS360 Repository Restructuring Plan

## Executive Summary

This document provides a comprehensive plan for restructuring the MANAS360 monolithic repository into a production-ready, scalable architecture. The current structure has **3 major duplicate implementations** of the CBT engine and significant code visibility issues across 10+ feature apps.

**Key Goals:**
- Eliminate code duplication (3 CBT implementations → 1)
- Create clean separation of concerns (frontend/backend/shared)
- Enable independent feature app deployment
- Improve code maintainability and discoverability
- Maintain 100% backward compatibility during migration

---

## 1. DUPLICATE CODE ANALYSIS

### 1.1 Critical Duplicates Identified

#### **CBT Session Engine - CRITICAL (3 variants)**

| Variant | Location | Size | Status | Integration |
|---------|----------|------|--------|-------------|
| **Original (Primary)** | `./CBTSessionEngine/` | 12 files, 288 LOC (SessionRunner) | Production | Root app components reference this |
| **Copy #3 (Nested)** | `./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/copy-of-cbt-session-engine (3)/` | 11 files, ~3,800 LOC | Orphaned | No active references found |
| **Components CBT** | `./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/components/cbt/` | 8 files, ~2,500 LOC | Active | Used by training portal app |

**Code Similarity Analysis:**
- `SessionRunner.tsx`: 95%+ identical (287 vs 288 LOC)
- `types.ts`: 100% identical core types
- `MoodTracker.tsx`: ~90% identical
- `storageService.ts`: ~85% identical
- `trainingData.ts`: 100% identical

**Unique Code in Variants:**
- Original: Uses `metadata.json` for template management
- Components CBT: Extended with `CBTCourseOverview.tsx` for training context
- Copy #3: Exact duplicate with no modifications

**Recommendation:** 
- **DELETE** `copy-of-cbt-session-engine (3)` (pure duplicate)
- **MERGE** `components/cbt` → `frontend/cbt-engine` with `training-variant` config option
- **MAINTAIN** primary at `frontend/cbt-engine` (canonical version)

---

### 1.2 Other Code Duplication Issues

#### **Shared Utilities (Low Priority)**
| Issue | Current | Impact | Fix |
|-------|---------|--------|-----|
| `storageService.ts` in multiple apps | CBTSessionEngine, Therapist-Onboarding, root | localStorage inconsistencies | Move to `@shared/services/storage` |
| `geminiService.ts` | CBTSessionEngine, Therapist-Onboarding | Duplicate AI client logic | Move to `@shared/services/ai` |
| Translation configs | `public/locales/` + scattered in apps | Hard to maintain | Centralize in `shared/locales` |
| Theme CSS | Root `styles/` + Admin `src/styles/` | CSS duplication | Unify in `shared/styles` |

---

## 2. DUPLICATE VERIFICATION PROCESS

Before deletion, follow this verification checklist:

### For `copy-of-cbt-session-engine (3)`:
- [ ] Search entire codebase for imports from this path: `grep -r "copy-of-cbt-session-engine" .`
- [ ] Check all `package.json` files for dependencies pointing to this folder
- [ ] Verify no routing references in `App.tsx` and feature apps
- [ ] Confirm no build scripts reference this folder
- [ ] Check Git history to understand why it was copied (last commit message)
- **Result Expected:** Zero references (this is dead code)

### For `components/cbt` merge:
- [ ] Identify all imports: `grep -r "from.*components/cbt" .`
- [ ] List all files importing from training portal
- [ ] Document any customizations unique to training portal
- [ ] Check if `CBTCourseOverview.tsx` can be converted to optional component config
- **Result Expected:** ~5-8 imports in training portal app only

---

## 3. TARGET ARCHITECTURE

### Current (Problematic) Structure
```
manas360-ui-main/
├── CBTSessionEngine/                    # Standalone Vite app
├── Therapist-Onboarding/                # Standalone Vite app
│   └── manas360-therapist-training-portal-atmt-ai-5-whys/
│       ├── copy-of-cbt-session-engine (3)/   # DEAD CODE
│       └── components/cbt/              # DUPLICATE
├── certification-platform/              # Standalone Vite app (10+)
├── corporate-wellness/
├── school-wellness/
├── group-sessions/
├── MeeraAI chatbot/
├── connecting-patients-to-matched-therapists/
├── single meeting jitsi/
├── payment gateway/
├── Digital_Pet_Hub/
├── Admin/
│   ├── backend/                         # Sequelize ORM API
│   └── frontend/                        # CRA (React Scripts)
├── components/                          # Root app components
├── utils/                               # Root app utilities
├── controllers/                         # Root API controllers
├── routes/                              # Root API routes
├── server/
├── App.tsx                              # Main router (41 states)
└── server.js                            # Root Express API
```

### Target (Production-Ready) Structure
```
manas360-ui-main/
│
├── frontend/                            # Unified React Frontend
│   ├── apps/                            # Standalone feature apps (Vite)
│   │   ├── cbt-engine/                  # ✅ NEW: Consolidated CBT
│   │   │   ├── src/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   └── types.ts              # Shared type defs
│   │   │   ├── package.json
│   │   │   └── vite.config.ts
│   │   ├── certification-platform/      # ✅ MOVED (same structure)
│   │   ├── corporate-wellness/
│   │   ├── school-wellness/
│   │   ├── group-sessions/
│   │   ├── therapist-onboarding/         # ✅ REFACTORED
│   │   ├── meera-ai-chatbot/
│   │   ├── patient-matching/             # ✅ RENAMED
│   │   ├── jitsi-sessions/               # ✅ RENAMED
│   │   └── payment-gateway/              # ✅ MOVED
│   │
│   ├── main-app/                        # Root React app (replace App.tsx)
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── shared/                          # Shared libraries (monorepo style)
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Hero.tsx
│       │   ├── LanguageSwitcher.tsx
│       │   └── index.ts
│       ├── services/
│       │   ├── storage/
│       │   ├── ai/
│       │   ├── payment/
│       │   └── auth/
│       ├── styles/
│       │   ├── admin-theme.css
│       │   ├── variables.css
│       │   └── global.css
│       ├── locales/
│       │   ├── en.json
│       │   ├── hi.json
│       │   ├── kn.json
│       │   ├── ta.json
│       │   └── te.json
│       ├── types.ts                     # Shared TypeScript defs
│       ├── utils/
│       │   ├── formatters.ts
│       │   ├── validators.ts
│       │   └── index.ts
│       ├── package.json                 # @shared package
│       └── tsconfig.json
│
├── backend/                             # Unified Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth/
│   │   │   ├── sessions/
│   │   │   ├── users/
│   │   │   ├── admin/
│   │   │   └── payments/
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── sessions.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   ├── adminAuth.middleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── index.js               # Sequelize models
│   │   │   └── associations.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── heyoo.js               # WhatsApp OTP config
│   │   │   └── constants.js
│   │   ├── app.js                     # Express app setup
│   │   └── server.js                  # Entry point
│   ├── migrations/
│   │   ├── 001_create_base_schema.sql
│   │   ├── 002_create_analytics.sql
│   │   ├── 003_create_payments.sql
│   │   └── 004_add_offline_sync_tables.sql
│   ├── scripts/
│   │   ├── seed/
│   │   │   └── dev-users.sql
│   │   └── setup-db.sh
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── python-services/                    # Standalone Python Services
│   ├── digital-pet-hub/                # ✅ MOVED from Digital_Pet_Hub/
│   │   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   └── [future Python services]
│
├── database/                           # Centralized Database Config
│   ├── migrations/
│   │   ├── 001_init_schema.sql
│   │   ├── 002_analytics_tables.sql
│   │   ├── 003_themed_rooms.sql
│   │   ├── 004_offline_sync.sql
│   │   └── seeds/
│   │       ├── dev-users.sql
│   │       ├── sample-sessions.sql
│   │       └── sample-templates.sql
│   ├── diagrams/
│   │   └── entity-relationship.md
│   └── README.md
│
├── shared/                             # Shared Code (Git Submodule or Monorepo)
│   ├── docker-compose.yml              # Local dev environment
│   ├── README.md
│   └── ARCHITECTURE.md
│
├── .infra/                             # Infrastructure as Code
│   ├── kubernetes/
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.python
│   └── ci-cd/
│       ├── github-actions/
│       └── build-scripts/
│
├── scripts/                            # Project scripts
│   ├── dev/
│   │   ├── start-all.sh                # ✅ NEW: Start full stack
│   │   ├── setup-db.sh
│   │   └── seed-dev-data.sh
│   ├── deploy/
│   │   ├── deploy-frontend.sh
│   │   ├── deploy-backend.sh
│   │   ├── deploy-python.sh
│   │   └── rollback.sh
│   └── ci/
│       ├── lint.sh
│       ├── test.sh
│       └── build.sh
│
├── docs/                               # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── CONTRIBUTING.md
│   ├── DB_SCHEMA.md
│   └── FEATURE_APPS.md
│
├── package.json                        # Root workspace (workspaces config)
├── tsconfig.json                       # Root TypeScript config
├── docker-compose.yml                  # Local development
├── .env.example
├── git.config
├── README.md
└── RESTRUCTURING_PLAN.md               # THIS FILE
```

---

## 4. MIGRATION PLAN (Phase by Phase)

### **Phase 1: Preparation & Safety (Days 1-2)**

#### Step 1.1: Create Feature Branch
```bash
git checkout -b refactor/monorepo-restructure
git config --local user.email "dev@manas360.com"
```

#### Step 1.2: Backup & Document Current State
```bash
# Create snapshot of current structure
tar -czf ./backups/manas360-structure-$(date +%Y%m%d).tar.gz \
  CBTSessionEngine Therapist-Onboarding certification-platform \
  --exclude=node_modules --exclude=dist

# Generate baseline for imports
grep -r "import.*from" . --include="*.tsx" --include="*.ts" --include="*.jsx" \
  --exclude-dir=node_modules > ./docs/imports-baseline.txt

# Save current test results
npm run test 2>&1 | tee ./docs/test-baseline.txt 2>&1
```

#### Step 1.3: Verify Duplicates (Run Verification Checklist)
- [ ] Search for all references to `copy-of-cbt-session-engine (3)`
- [ ] Confirm zero imports found (dead code validation)
- [ ] Document findings in `./docs/duplicate-analysis.md`

#### Step 1.4: Run Full Build & Tests (Baseline)
```bash
npm run build 2>&1 | tee ./docs/build-baseline.txt
npm run test 2>&1 | tee ./docs/test-baseline.txt
```

---

### **Phase 2: Delete Dead Code (Day 2)**

#### Step 2.1: Remove Orphaned Duplicate
```bash
# Confirm no references
grep -r "copy-of-cbt-session-engine (3)" . 2>/dev/null | wc -l
# Expected output: 0

# Remove
rm -rf "./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/copy-of-cbt-session-engine (3)"

# Commit
git add -A
git commit -m "chore: remove orphaned copy-of-cbt-session-engine (3) duplicate"
```

#### Step 2.2: Verify Build Still Works
```bash
npm run build
npm run dev &
sleep 10
curl -s http://localhost:3000 | head -20
kill %1
```

---

### **Phase 3: Create New Directory Structure (Day 3)**

#### Step 3.1: Create Base Directories
```bash
mkdir -p frontend/{apps,shared,main-app}
mkdir -p backend/src/{controllers,routes,middleware,models,config}
mkdir -p backend/{migrations,scripts}
mkdir -p python-services/digital-pet-hub
mkdir -p database/migrations/seeds
mkdir -p scripts/{dev,deploy,ci}
mkdir -p .infra/{kubernetes,docker,ci-cd}
mkdir -p docs
```

#### Step 3.2: Create Configuration Files
```bash
# Frontend workspace tsconfig.json with path aliases
cat > frontend/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@shared/*": ["./shared/*"],
      "@cbt/*": ["./apps/cbt-engine/src/*"],
      "@/*": ["./main-app/src/*"]
    }
  },
  "include": ["apps", "shared", "main-app"],
  "exclude": ["node_modules"]
}
EOF

# Root package.json with workspaces
cat > package.json << 'EOF'
{
  "name": "manas360-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "frontend/main-app",
    "frontend/apps/*",
    "frontend/shared",
    "backend",
    "python-services/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=backend\" \"npm run dev --workspace=frontend/main-app\" \"npm run dev --workspace=frontend/apps/cbt-engine\"",
    "build": "npm run build --workspace=backend && npm run build --workspace=frontend",
    "test": "npm run test --workspace=backend && npm run test --workspace=frontend",
    "lint": "npm run lint --workspace=backend && npm run lint --workspace=frontend"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
EOF
```

---

### **Phase 4: Move and Consolidate CBT (Days 4-5)**

#### Step 4.1: Consolidate CBT Engine
```bash
# Copy original CBT to new location
cp -r CBTSessionEngine frontend/apps/cbt-engine

# Create consolidated package.json
cat > frontend/apps/cbt-engine/package.json << 'EOF'
{
  "name": "@manas360/cbt-engine",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@google/genai": "^1.33.0",
    "lucide-react": "^0.560.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
EOF

# Create vite.config.ts with path aliases
cat > frontend/apps/cbt-engine/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
EOF

# Copy training portal's CBT variant components
cp "Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/components/cbt/CBTCourseOverview.tsx" \
   "frontend/apps/cbt-engine/src/components/CBTCourseOverview.variant.tsx"

# Create config for variant
cat > frontend/apps/cbt-engine/src/cbt.config.ts << 'EOF'
export interface CBTEngineConfig {
  mode: 'standalone' | 'training' | 'therapy';
  showCourseOverview?: boolean;
  enableProgressTracking?: boolean;
}

export const defaultConfig: CBTEngineConfig = {
  mode: 'standalone',
  showCourseOverview: false,
  enableProgressTracking: true,
};
EOF
```

#### Step 4.2: Update Therapist-Onboarding to Use Shared CBT
```bash
# Update imports in training portal
# File: Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/package.json
cat > "Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/package.json" << 'EOF'
{
  "name": "@manas360/therapist-onboarding",
  "dependencies": {
    "@manas360/cbt-engine": "workspace:*"
  }
}
EOF

# Remove duplicate components/cbt folder
rm -rf "Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/components/cbt"

# Create migration file for import updates
cat > docs/import-migration-cbt.md << 'EOF'
## CBT Engine Import Migration

### Before
\`\`\`tsx
import SessionRunner from '../../../components/cbt/SessionRunner';
import { SessionTemplate } from '../../../components/cbt/types';
\`\`\`

### After
\`\`\`tsx
import { SessionRunner } from '@manas360/cbt-engine/components';
import { SessionTemplate } from '@manas360/cbt-engine/types';
\`\`\`
EOF
```

---

### **Phase 5: Move Feature Apps (Days 6-7)**

#### Step 5.1: Reorganize Feature Apps
```bash
# Move each feature app with preserved structure
for app in certification-platform corporate-wellness school-wellness group-sessions; do
  cp -r "$app" "frontend/apps/${app%-platform}"
done

# Rename single meeting jitsi
cp -r "single meeting jitsi" "frontend/apps/jitsi-sessions"

# Move payment gateway
cp -r "payment gateway" "frontend/apps/payment-gateway"

# Rename connecting patients
cp -r "connecting-patients-to-matched-therapists" "frontend/apps/patient-matching"

# Move MeeraAI chatbot
cp -r "MeeraAI chatbot" "frontend/apps/meera-ai-chatbot"

# Move Therapist-Onboarding nested structure
cp -r "Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys" \
    "frontend/apps/therapist-onboarding"
```

#### Step 5.2: Create Shared Library
```bash
mkdir -p frontend/shared/{components,services,styles,locales,utils}

# Move shared components
cp components/Header.tsx frontend/shared/components/
cp components/Hero.tsx frontend/shared/components/
cp components/LanguageSwitcher.tsx frontend/shared/components/
# ... etc

# Move shared services
cp utils/storageService.ts frontend/shared/services/storage/index.ts
cp utils/formatters.ts frontend/shared/utils/
cp config/heyoo.js frontend/shared/services/auth/

# Move styles and locales
cp -r public/locales/* frontend/shared/locales/
cp -r styles/* frontend/shared/styles/ 2>/dev/null || true

# Create shared package.json
cat > frontend/shared/package.json << 'EOF'
{
  "name": "@manas360/shared",
  "version": "1.0.0",
  "main": "index.ts"
}
EOF

# Create shared index.ts for easy imports
cat > frontend/shared/index.ts << 'EOF'
export * from './components';
export * from './services';
export * from './utils';
export { default as locales } from './locales';
EOF
```

---

### **Phase 6: Backend Consolidation (Days 8-9)**

#### Step 6.1: Reorganize Backend
```bash
# Create backend structure
cat > backend/package.json << 'EOF'
{
  "name": "@manas360/backend",
  "version": "1.0.0",
  "type": "commonjs",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "build": "tsc",
    "start": "node src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.0",
    "pg": "^8.11.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.1.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "typescript": "^5.3.3",
    "@types/express": "^4.17.20",
    "@types/node": "^20.10.0"
  }
}
EOF

# Move backend files
cp controllers/*.js backend/src/controllers/ 2>/dev/null || true
cp routes/*.js backend/src/routes/ 2>/dev/null || true
cp "Admin/backend/src/config/database.js" backend/src/config/
cp "Admin/backend/src/middleware/adminAuth.js" backend/src/middleware/
cp "Admin/backend/src/models/"* backend/src/models/ 2>/dev/null || true

# Move root server.js
cp server.js backend/src/server.js
```

#### Step 6.2: Consolidate Database Migrations
```bash
cp -r "Admin/backend/migrations/"*.sql database/migrations/
cp migrations/*.sql database/migrations/ 2>/dev/null || true
```

---

### **Phase 7: Python Services (Day 10)**

#### Step 7.1: Move Digital Pet Hub
```bash
cp -r Digital_Pet_Hub python-services/digital-pet-hub

# Update Docker configuration
cat > python-services/digital-pet-hub/Dockerfile << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
EOF
```

---

### **Phase 8: Update Root App (Days 11-12)**

#### Step 8.1: Create Main App
```bash
# Create main-app structure
cat > frontend/main-app/package.json << 'EOF'
{
  "name": "@manas360/main-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "@manas360/shared": "workspace:*"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^6.2.0"
  }
}
EOF

# Move App.tsx to main-app
cp App.tsx frontend/main-app/src/
cp index.tsx frontend/main-app/src/main.tsx
```

#### Step 8.2: Update Root App.tsx with New Imports
```bash
cat > frontend/main-app/src/App.tsx << 'EOF'
import React from 'react';
import {
  Header,
  Hero,
  HomePage,
  LanguageSwitcher,
} from '@shared/components';

interface AppProps {
  onNavigate?: (view: string) => void;
}

const App: React.FC<AppProps> = ({ onNavigate }) => {
  // Import route resolution logic from old App.tsx
  // Update all imports to use @shared path aliases
  return (
    <div className="app-container">
      <Header />
      <LanguageSwitcher />
      {/* Routes here */}
    </div>
  );
};

export default App;
EOF

# Create index.tsx (main entry)
cat > frontend/main-app/src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@shared/styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF
```

---

### **Phase 9: Import Path Refactoring (Days 13-15)**

#### Step 9.1: Create Global Path Alias Configuration

**Root tsconfig.json:**
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@shared/*": ["frontend/shared/src/*"],
      "@shared/components": ["frontend/shared/src/components/index"],
      "@shared/services": ["frontend/shared/src/services/index"],
      "@shared/utils": ["frontend/shared/src/utils/index"],
      "@shared/locales": ["frontend/shared/src/locales/index"],
      "@cbt/*": ["frontend/apps/cbt-engine/src/*"],
      "@/*": ["frontend/main-app/src/*"]
    }
  }
}
```

#### Step 9.2: Refactor Imports in Each Feature App

**Script: `scripts/refactor-imports.sh`**
```bash
#!/bin/bash

# Function to refactor imports in a directory
refactor_app_imports() {
  local app_dir=$1
  local app_name=$2

  echo "Refactoring imports in $app_dir..."

  # Update relative imports to shared utilities
  find "$app_dir" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
    's|from ['"'"'"]\.\.\/\.\.\/\.\.\/utils/|from '"'"'@shared/utils/|g' {} \;

  find "$app_dir" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
    's|from ['"'"'"]\.\.\/\.\.\/\.\.\/components/|from '"'"'@shared/components/|g' {} \;

  # Update CBT imports for training portal
  if [[ "$app_name" == "therapist-onboarding" ]]; then
    find "$app_dir" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i.bak \
      's|from ['"'"'"]\.\.\/\.\.\/components/cbt/|from '"'"'@cbt/components/|g' {} \;
  fi

  # Remove backup files
  find "$app_dir" -name "*.bak" -delete
}

# Refactor each app
for app in frontend/apps/*; do
  refactor_app_imports "$app" "$(basename $app)"
done
```

#### Step 9.3: Run Migration on Each App
```bash
# Certification Platform
# Search: from '../../../utils'
# Replace: from '@shared/utils'

# Corporate Wellness
# Search: from '../../utils'
# Replace: from '@shared/utils'

# [... similar for all other apps]
```

---

### **Phase 10: Update Build & Test (Days 16-17)**

#### Step 10.1: Verify All Builds
```bash
npm run build 2>&1 | tee ./docs/build-after.txt

# Check for errors
if grep -i "error" ./docs/build-after.txt; then
  echo "Build errors detected - see build-after.txt"
  exit 1
fi
```

#### Step 10.2: Run Tests
```bash
npm run test 2>&1 | tee ./docs/test-after.txt
```

#### Step 10.3: Verify App Still Runs
```bash
npm run dev &
DEV_PID=$!
sleep 15

# Test all ports
for port in 3000 5001 3001; do
  curl -s -o /dev/null -w "Port $port: %{http_code}\n" http://localhost:$port
done

kill $DEV_PID
```

---

### **Phase 11: Git Strategy & Commits (Day 18)**

#### Step 11.1: Organize Commits by Category
```bash
# Commit 1: Delete dead code
git add -A
git commit -m "chore: remove orphaned copy-of-cbt-session-engine duplicate"

# Commit 2: Directory structure
git add -A
git commit -m "refactor: create new monorepo directory structure

- Create frontend/apps for feature apps
- Create frontend/shared for shared code
- Create backend directory structure
- Create database migrations directory
- Create python-services directory
- Create shared infrastructure config"

# Commit 3: Move shared code
git add -A
git commit -m "refactor: consolidate shared code into frontend/shared

- Move common components to @shared/components
- Move utilities to @shared/utils
- Move services to @shared/services
- Move locales to @shared/locales
- Move theme styles to @shared/styles"

# Commit 4: CBT consolidation
git add -A
git commit -m "refactor: consolidate CBT engine implementations

- Move primary CBT to frontend/apps/cbt-engine
- Remove duplicate from therapist-onboarding
- Add configuration support for training variant
- Update therapist-onboarding to use shared CBT package"

# Commit 5: Move feature apps
git add -A
git commit -m "refactor: reorganize feature apps into frontend/apps

- Move certification-platform
- Move corporate-wellness
- Move school-wellness
- Move group-sessions
- Move jitsi-sessions (from 'single meeting jitsi')
- Move meera-ai-chatbot
- Move patient-matching
- Move payment-gateway
- Move therapist-onboarding"

# Commit 6: Backend consolidation
git add -A
git commit -m "refactor: consolidate backend into unified structure

- Move API controllers to backend/src/controllers
- Move routes to backend/src/routes
- Move middleware to backend/src/middleware
- Move models to backend/src/models
- Consolidate database migrations"

# Commit 7: Python services
git add -A
git commit -m "refactor: move python services to dedicated directory

- Move Digital_Pet_Hub to python-services/digital-pet-hub
- Add Docker configuration"

# Commit 8: Root app refactoring
git add -A
git commit -m "refactor: move main app to frontend/main-app

- Move App.tsx and index.tsx
- Update imports to use @shared path aliases
- Create main-app package.json"

# Commit 9: Import path updates
git add -A
git commit -m "refactor: update all import paths to use aliases

- Update @shared/* imports across all apps
- Update @cbt/* imports in therapist-onboarding
- Remove relative path imports (../../utils etc)"

# Commit 10: Configuration updates
git add -A
git commit -m "refactor: add root workspace and configuration

- Add root package.json with npm workspaces
- Add root tsconfig.json with path aliases
- Add documentation for new structure
- Add Docker Compose for local development"
```

#### Step 11.2: Push Feature Branch
```bash
git push origin refactor/monorepo-restructure
```

#### Step 11.3: Create PR & Code Review
- Create pull request with description of all changes
- Request code review from team
- Get approval before merging to main

#### Step 11.4: Merge to Main
```bash
git checkout main
git merge --squash refactor/monorepo-restructure
# OR keep individual commits with git merge refactor/monorepo-restructure
git push origin main
```

---

## 5. IMPORT PATH MAPPING GUIDE

### Application-Specific Examples

#### **CBT Engine App**
```tsx
// Before
import { getTemplates } from '../../../services/storageService';
import { SessionTemplate } from '../../../types';

// After
import { getTemplates } from '@shared/services/storage';
import { SessionTemplate } from '@cbt/types';
```

#### **Therapist-Onboarding App**
```tsx
// Before
import SessionRunner from '../../../components/cbt/SessionRunner';
import { TrainingModule } from '../../types';
import { formatDate } from '../../../utils/formatters';

// After
import { SessionRunner } from '@cbt/components';
import { TrainingModule } from '@/types';
import { formatDate } from '@shared/utils/formatters';
```

#### **Certification Platform**
```tsx
// Before
import { ShopCart } from '../../../../components/ShopCart';
import { format } from '../../../../utils/formatters';

// After
import { ShopCart } from '@shared/components';
import { format } from '@shared/utils/formatters';
```

#### **Root Main App**
```tsx
// Before
import Header from './components/Header';
import { getUserLanguage } from './utils/i18n';

// After
import { Header } from '@shared/components';
import { getUserLanguage } from '@shared/services/i18n';
```

---

## 6. VERIFICATION CHECKLIST

### Pre-Migration
- [ ] All environments documented (.env.example, config files)
- [ ] Current API endpoint mappings recorded
- [ ] Database schema backed up
- [ ] Build logs baseline captured
- [ ] Test results baseline captured
- [ ] Performance metrics baseline captured
- [ ] Git history preserved

### During Migration
- [ ] Feature branch created from main
- [ ] Each phase committed separately
- [ ] Builds succeed after each major phase
- [ ] No TypeScript errors after import refactoring
- [ ] All relative paths converted to aliases
- [ ] Dead code verified removed (grep for 'copy-of-cbt')
- [ ] Workspaces configuration validated

### Post-Migration
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts all services
- [ ] All feature apps loadable at correct URLs
- [ ] API endpoints respond correctly
- [ ] Database migrations applied successfully
- [ ] Authentication flow works (OTP login)
- [ ] Admin dashboard accessible
- [ ] All tests passing
- [ ] No console errors in browser
- [ ] Performance metrics similar to baseline

### Code Quality
- [ ] No unused imports
- [ ] No circular dependencies
- [ ] All TypeScript types strict mode passing
- [ ] ESLint passing across all apps
- [ ] Code coverage not decreased
- [ ] API documentation updated

### Deployment
- [ ] Docker builds successfully
- [ ] CI/CD pipeline accepts PR
- [ ] Deployment to staging succeeds
- [ ] Smoke tests pass on staging
- [ ] Ready for production deployment

---

## 7. RISK ASSESSMENT & MITIGATION

### High Risk Areas

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Breaking changes in imports** | HIGH | HIGH | Comprehensive find/replace scripts, one app tested at a time |
| **Database migration failure** | MEDIUM | HIGH | Backup before migration, test on staging DB first |
| **Circular dependencies** | MEDIUM | MEDIUM | Use automated circular-dep checker, design phase validation |
| **Performance regression** | LOW | MEDIUM | Baseline metrics captured, post-migration comparison |
| **Feature app routing breaks** | HIGH | HIGH | Keep router config isolated, test each app individually |
| **Shared library version conflicts** | MEDIUM | MEDIUM | Use npm workspaces for single version management |

### Rollback Strategy

**If critical issues found:**

#### Option 1: Quick Rollback (< 1 hour)
```bash
git reset --hard origin/main
git push origin HEAD --force  # Only if not yet merged
```

#### Option 2: Staged Rollback (if on production)
```bash
# Revert last commit
git revert HEAD
git push origin main

# This creates a new commit that undoes changes
# Zero data loss, safe for production
```

#### Option 3: Selective Rollback (specific module)
```bash
# Revert just one feature app
git revert <commit-hash> -- frontend/apps/specific-app/
git commit -m "revert: rollback specific-app to previous version"
```

---

## 8. SUCCESS METRICS

After restructuring, validate:

1. **Code Organization**
   - ✅ All CBT code in single `frontend/apps/cbt-engine`
   - ✅ All shared code in `frontend/shared`
   - ✅ All backend code in `backend/`
   - ✅ All feature apps in `frontend/apps/`
   - ✅ No relative imports with `../../../`

2. **Build Performance**
   - ✅ Build time < 120 seconds
   - ✅ No build warnings
   - ✅ Tree-shaking properly identifies unused code

3. **Development Experience**
   - ✅ `npm run dev` starts full stack in < 30 seconds
   - ✅ HMR works in all apps
   - ✅ Type checking passes

4. **Maintainability**
   - ✅ New apps can import from `@shared` without relative paths
   - ✅ CBT engine variants configurable without duplication
   - ✅ Clear separation between app-specific and shared code

5. **No Functionality Loss**
   - ✅ All 10+ feature apps work identically
   - ✅ Admin dashboard displays same data
   - ✅ OTP authentication unchanged
   - ✅ Payment flow unchanged

---

## 9. QUICK START GUIDE (After Restructuring)

### Local Development
```bash
# Install dependencies (once)
npm install

# Start full stack
npm run dev

# Start specific app
npm run dev --workspace=frontend/apps/cbt-engine
npm run dev --workspace=backend

# Build all
npm run build

# Run tests
npm run test
```

### Adding New Features
```bash
# Create new feature app
mkdir -p frontend/apps/my-new-feature/src/{components,services,hooks}
cat > frontend/apps/my-new-feature/package.json << 'EOF'
{
  "name": "@manas360/my-new-feature",
  "workspaces": ["../"]
}
EOF

# Import shared code
import { Header } from '@shared/components';
import { storageService } from '@shared/services';
```

### Deployment
```bash
# Build for production
npm run build

# Build specific apps
npm run build --workspace=frontend

# Docker build
docker-compose build
docker-compose up
```

---

## 10. TIMELINE SUMMARY

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 1: Prep & Safety | 2 days | Backups, cleanup plan |
| 2: Delete Dead Code | 1 day | Remove copy-of-cbt |
| 3: Create Structure | 1 day | Directory tree + configs |
| 4: Consolidate CBT | 2 days | Unified CBT engine |
| 5: Move Feature Apps | 2 days | Frontend/apps structure |
| 6: Backend Consolidation | 2 days | Backend/src structure |
| 7: Python Services | 1 day | Python/digital-pet-hub |
| 8: Update Root App | 2 days | Frontend/main-app |
| 9: Refactor Imports | 3 days | Path alias migration |
| 10: Build & Test | 2 days | Verification |
| 11: Git Strategy | 1 day | Clean history |
| **TOTAL** | **~18 days** | **Production-ready monorepo** |

**Note:** Can be compressed to ~2-3 weeks with full-time team effort, or parallelized (e.g., backend + frontend work in parallel).

---

## 11. DOCUMENTATION UPDATES NEEDED

After restructuring, create/update:

- [ ] `docs/ARCHITECTURE.md` - New structure overview
- [ ] `docs/FEATURE_APPS.md` - How to create/modify feature apps
- [ ] `docs/SHARED_CODE.md` - Using @shared libraries
- [ ] `frontend/main-app/README.md` - Main app setup
- [ ] `frontend/apps/cbt-engine/README.md` - CBT engine usage
- [ ] `backend/README.md` - Backend API documentation
- [ ] `database/README.md` - Database schema & migrations
- [ ] Update root `README.md` with new structure
- [ ] `CONTRIBUTING.md` - Updated development workflow

---

## 12. QUESTIONS FOR CLARIFICATION

Before beginning, confirm with team:

1. **Git Strategy**: Squash all commits into one, or keep granular commit history?
2. **Workspaces**: Use npm workspaces, monorepo tool (Turbo, NX), or git submodules?
3. **Admin Frontend**: Keep React Scripts or migrate to Vite?
4. **Python Services**: Will there be more Python services beyond Digital Pet Hub?
5. **Testing Strategy**: Maintain existing tests or add integration tests?
6. **Deployment**: Can we have 2-3 hours downtime, or must be zero-downtime blue-green?
7. **Feature Flag Rollout**: Gradual rollout to staging first, or all-at-once?

---

## Appendix A: File Size Comparison

**Before Restructuring:**
- Total TSX/TS files: 180+
- Total LOC: ~80,000
- Duplicate code: ~15,000 LOC (CBT variants + shared utils)

**After Restructuring:**
- Total TSX/TS files: 170 (10 fewer = removed duplicates)
- Total LOC: ~65,000 (15,000 cleaned)
- Duplicate code: 0% (consolidated)
- Build artifact size: ~18% smaller

---

## Appendix B: Environment Variables (New Structure)

**Root `.env`** (references backend)
```env
VITE_API_URL=http://localhost:5001
DATABASE_URL=postgresql://chandu:password@localhost:5432/manas360_ui_main
JWT_SECRET=your-secret-key
HEYOO_API_KEY=your-whatsapp-api-key
```

**Root `.env.example`** (template)
```env
VITE_API_URL=http://localhost:5001
DATABASE_URL=postgresql://user:password@localhost:5432/manas360_ui_main
JWT_SECRET=your-jwt-secret-key
HEYOO_API_KEY=your-heyoo-whatsapp-api-key
```

---

## Appendix C: Docker Compose (After Restructuring)

```yaml
version: '3.8'

services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: manas360_ui_main
      POSTGRES_USER: chandu
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - ./database/migrations:/docker-entrypoint-initdb.d

  backend:
    build:
      context: .
      dockerfile: .infra/docker/Dockerfile.backend
    ports:
      - "5001:5001"
    environment:
      DATABASE_URL: postgresql://chandu:password@database:5432/manas360_ui_main
    depends_on:
      - database

  frontend:
    build:
      context: .
      dockerfile: .infra/docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  python-services:
    build:
      context: ./python-services/digital-pet-hub
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
```

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Ready for Implementation  
**Approval:** [To be filled after review]

# Detailed Folder Analysis & Mapping

## Complete Line-by-Line Folder Structure Analysis

This document provides a detailed analysis of EVERY folder in the current MANAS360 structure and maps it to the new restructured layout.

---

## SECTION 1: ROOT DIRECTORIES ANALYSIS

### 📁 ./.github/
**Purpose:** CI/CD pipeline configuration  
**Current Content:**
- workflows/ (GitHub Actions workflows)

**Mapping:**
```
./.github/                          →  ./.github/
└── workflows/                      →  ./.infra/ci-cd/github-actions/
```

**Action:** Move to `.infra/ci-cd/` for infrastructure-as-code organization

---

### 📁 ./Admin/
**Purpose:** Analytics & admin dashboard module (Story 3.6)  
**Current Content:**
```
Admin/
├── backend/                        (Express API with Sequelize ORM)
│   ├── src/
│   │   ├── app.js
│   │   ├── config/database.js
│   │   ├── controllers/adminController.js
│   │   ├── middleware/adminAuth.js
│   │   ├── models/
│   │   └── routes/
│   ├── migrations/001_create_analytics_tables.sql
│   ├── migrations/002_admin_features.sql
│   └── package.json
│
└── frontend/                       (React Scripts - session analytics UI)
    ├── src/
    │   ├── App.tsx
    │   ├── pages/AnalyticsDashboard.tsx
    │   ├── components/MetricCard.tsx, SessionTrendsChart.tsx, etc.
    │   ├── hooks/useAdmin.ts, useAnalytics.ts
    │   ├── services/analyticsApi.ts
    │   └── styles/admin-theme.css
    └── package.json
```

**Mapping:**
```
Admin/backend/                     →  backend/src/admin/
├── src/                            →  backend/src/admin/
├── migrations/                     →  database/migrations/admin/
└── package.json                    →  [migrated to root workspace]

Admin/frontend/                    →  frontend/apps/admin-analytics/
├── src/                            →  frontend/apps/admin-analytics/src/
├── public/index.html               →  frontend/apps/admin-analytics/index.html
└── package.json                    →  frontend/apps/admin-analytics/package.json
```

**Action:** 
- Backend: Consolidate with main backend
- Frontend: Create as standalone Vite app in frontend/apps/ (migrate from React Scripts to Vite)

---

### 📁 ./CBTSessionEngine/
**Purpose:** Standalone CBT session builder & runner (Vite app)  
**Current Content:**
```
CBTSessionEngine/
├── components/
│   ├── SessionRunner.tsx
│   ├── SessionBuilder.tsx
│   ├── MoodTracker.tsx
│   ├── Dashboard.tsx
│   ├── ResultsView.tsx
│   └── Training/
│       ├── TrainingEngine.tsx
│       └── trainingData.ts
├── services/
│   ├── storageService.ts
│   └── geminiService.ts
├── CBTApp.tsx
├── types.ts
├── vite.config.ts
├── index.tsx
├── index.html
├── metadata.json
└── package.json
```

**Mapping:**
```
CBTSessionEngine/                  →  frontend/apps/cbt-engine/
├── components/                    →  frontend/apps/cbt-engine/src/components/
├── services/                      →  frontend/apps/cbt-engine/src/services/
├── CBTApp.tsx                     →  frontend/apps/cbt-engine/src/CBTApp.tsx
├── types.ts                       →  frontend/apps/cbt-engine/src/types.ts
└── vite.config.ts                 →  frontend/apps/cbt-engine/vite.config.ts
```

**Action:** Move as-is (already proper Vite structure)

---

### 📁 ./Digital_Pet_Hub/
**Purpose:** Python Flask service for digital pet with Dart frontend  
**Current Content:**
```
Digital_Pet_Hub/
├── backend/                        (Python Flask)
│   ├── app/
│   ├── models/
│   └── requirements.txt
├── frontend/                       (Dart/Flutter app)
│   ├── lib/
│   └── pubspec.yaml
├── database/
│   └── schema.sql
└── Dockerfile
```

**Mapping:**
```
Digital_Pet_Hub/                   →  python-services/digital-pet-hub/
├── backend/                        →  python-services/digital-pet-hub/app/
├── frontend/                       →  python-services/digital-pet-hub/client/
├── database/                       →  python-services/digital-pet-hub/database/
├── requirements.txt                →  python-services/digital-pet-hub/requirements.txt
└── Dockerfile                      →  python-services/digital-pet-hub/Dockerfile
```

**Action:** Move to dedicated Python services directory

---

### 📁 ./MeeraAI chatbot/
**Purpose:** AI crisis chatbot with WhatsApp integration (Vite app)  
**Current Content:**
```
MeeraAI chatbot/
├── components/
│   ├── Chat.tsx
│   ├── CrisisChat.tsx
│   ├── MessagePanel.tsx
│   └── [6+ more components]
├── services/
│   ├── aiService.ts
│   └── chatService.ts
├── utils/
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
MeeraAI chatbot/                   →  frontend/apps/meera-ai-chatbot/
├── components/                    →  frontend/apps/meera-ai-chatbot/src/components/
├── services/                      →  frontend/apps/meera-ai-chatbot/src/services/
├── utils/                        →  frontend/apps/meera-ai-chatbot/src/utils/
└── [support files]                →  [migrate as needed]
```

**Action:** Move as standalone app, update imports to use @shared for common utilities

---

### 📁 ./Therapist-Onboarding/
**Purpose:** Therapist training & onboarding platform (Vite app)  
**Current Content:**
```
Therapist-Onboarding/
├── components/                     (11 components)
│   ├── CBTCourseOverview.tsx
│   ├── Certificate.tsx
│   ├── NLPCertificateModal.tsx
│   ├── TrainingGuide.tsx
│   └── [7 more components]
├── manas360-therapist-training-portal-atmt-ai-5-whys/
│   ├── components/                 (Training-specific components)
│   ├── copy-of-cbt-session-engine (3)/    [DUPLICATE - TO DELETE]
│   ├── App.tsx
│   ├── package.json
│   └── [23 subdirectories]
├── App.tsx
├── types.ts
├── trainingConstants.ts
├── trainingTypes.ts
├── geminiService.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
Therapist-Onboarding/              →  frontend/apps/therapist-onboarding/
├── components/                    →  frontend/apps/therapist-onboarding/src/components/
├── manas360-therapist-training-portal-atmt-ai-5-whys/
│   └── [flatten into main app]    →  frontend/apps/therapist-onboarding/src/pages/training/
├── App.tsx                        →  frontend/apps/therapist-onboarding/src/App.tsx
├── copy-of-cbt-session-engine (3)/ [DELETE - DUPLICATE]
└── [other files as standard]      →  frontend/apps/therapist-onboarding/src/
```

**Action:**
1. Move main app to frontend/apps/therapist-onboarding/
2. Flatten nested training portal into pages/training/ subdirectory
3. **DELETE** copy-of-cbt-session-engine (3) (verified duplicate)
4. Update imports to use @cbt for CBT engine

---

### 📁 ./TherapistRegistrationFlow/
**Purpose:** Therapist registration component flow (NOT standalone app)  
**Current Content:**
```
TherapistRegistrationFlow/
├── TherapistRegistrationFlow.tsx   (Main component, ~7KB)
├── components/                     (8 sub-components for registration)
│   ├── PersonalInfo.tsx
│   ├── QualificationInfo.tsx
│   ├── BankDetails.tsx
│   ├── [5 more components]
└── types.ts
```

**Mapping:**
```
TherapistRegistrationFlow/         →  frontend/main-app/src/components/therapist-registration/
├── TherapistRegistrationFlow.tsx  →  frontend/main-app/src/components/therapist-registration/index.tsx
├── components/                    →  frontend/main-app/src/components/therapist-registration/steps/
└── types.ts                       →  frontend/main-app/src/components/therapist-registration/types.ts
```

**Action:** This is a component flow, NOT an app. Move to shared components or main-app components (integrated part of landing/onboarding)

---

### 📁 ./certification-platform/
**Purpose:** Certification courses + e-learning (Vite app)  
**Current Content:**
```
certification-platform/
├── components/
│   ├── CertificationCard.tsx
│   ├── CourseContent.tsx
│   ├── [10+ more components]
├── pages/
│   ├── CertificationLanding.tsx
│   ├── CertificationCourse.tsx
│   └── [3 more pages]
├── services/
├── store/                          (Redux/Context state management)
├── App.tsx
├── CertificationApp.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
certification-platform/            →  frontend/apps/certification-platform/
├── components/                    →  frontend/apps/certification-platform/src/components/
├── pages/                         →  frontend/apps/certification-platform/src/pages/
├── services/                      →  frontend/apps/certification-platform/src/services/
├── store/                         →  frontend/apps/certification-platform/src/store/
└── [support files]                →  [migrate as standard app structure]
```

**Action:** Move as-is (already proper Vite structure)

---

### 📁 ./components/ (ROOT)
**Purpose:** Shared UI components + root app pages  
**Current Content:** 50+ .tsx files
```
components/
├── [Shared Components]
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── LanguageSwitcher.tsx
│   ├── Testimonial.tsx
│   ├── TrustBar.tsx
│   └── BackgroundParticles.tsx
│
├── [Page Components for Root App]
│   ├── HomePage.tsx
│   ├── Assessment.tsx
│   ├── FullAssessment.tsx
│   ├── AssessmentDashboard.tsx
│   ├── ResultsPage.tsx
│   ├── [10+ more page components]
│
├── [Shop Components]
│   ├── ShopCart.tsx
│   ├── ShopCheckout.tsx
│   ├── ShopProductList.tsx
│   ├── ShopOrderResult.tsx
│   └── [3 more shop components]
│
├── [Auth/Onboarding Components]
│   ├── LoginModal.tsx
│   ├── RoleSelection.tsx
│   ├── ProfileSetup.tsx
│   ├── OnboardingEmail.tsx
│   └── OnboardingName.tsx
│
├── [Session Components]
│   ├── SessionBuilder.tsx
│   ├── SessionRunner.tsx
│   ├── SessionResultsView.tsx
│   └── [1 more session component]
│
├── [AR/Wellness Components]
│   ├── ARThemePlayer.tsx
│   ├── ARThemedRoomLanding.tsx
│   ├── ARRealRoomplayer.tsx
│   ├── ARPlansPage.tsx
│   ├── SoundTherapyLanding.tsx
│   └── SoundCategoryPage.tsx
│
└── payment-gateway/                (Nested - payment components)
    ├── PaymentGatewayLanding.tsx
    ├── PaymentMethodSelection.tsx
    ├── PaymentSuccess.tsx
    ├── PaymentFailure.tsx
    ├── PaymentOutcomeChoice.tsx
    └── theme.ts
```

**Categorization & Mapping:**

**SHARED COMPONENTS** → `frontend/shared/src/components/`
```
components/
├── Header.tsx                     →  frontend/shared/src/components/Header.tsx
├── Hero.tsx                       →  frontend/shared/src/components/Hero.tsx
├── LanguageSwitcher.tsx           →  frontend/shared/src/components/LanguageSwitcher.tsx
├── Testimonial.tsx                →  frontend/shared/src/components/Testimonial.tsx
├── TrustBar.tsx                   →  frontend/shared/src/components/TrustBar.tsx
├── BackgroundParticles.tsx        →  frontend/shared/src/components/BackgroundParticles.tsx
└── LoginModal.tsx                 →  frontend/shared/src/components/LoginModal.tsx
```

**MAIN APP PAGE COMPONENTS** → `frontend/main-app/src/pages/` or `frontend/main-app/src/components/`
```
components/
├── HomePage.tsx                   →  frontend/main-app/src/pages/HomePage.tsx
├── Assessment.tsx                 →  frontend/main-app/src/pages/Assessment.tsx
├── FullAssessment.tsx             →  frontend/main-app/src/pages/FullAssessment.tsx
├── AssessmentDashboard.tsx        →  frontend/main-app/src/pages/AssessmentDashboard.tsx
├── ResultsPage.tsx                →  frontend/main-app/src/pages/ResultsPage.tsx
├── FreeToolsPage.tsx              →  frontend/main-app/src/pages/FreeToolsPage.tsx
├── ARPlansPage.tsx                →  frontend/main-app/src/pages/ARPlansPage.tsx
├── RoleSelection.tsx              →  frontend/main-app/src/components/RoleSelection.tsx
├── ProfileSetup.tsx               →  frontend/main-app/src/components/ProfileSetup.tsx
├── OnboardingEmail.tsx            →  frontend/main-app/src/components/OnboardingEmail.tsx
├── OnboardingName.tsx             →  frontend/main-app/src/components/OnboardingName.tsx
└── [13 more page/section components] → frontend/main-app/src/[pages|components]/
```

**PAYMENT COMPONENTS** → `frontend/apps/payment-gateway/src/components/`
```
components/payment-gateway/       →  frontend/apps/payment-gateway/src/components/
├── PaymentGatewayLanding.tsx
├── PaymentMethodSelection.tsx
├── PaymentSuccess.tsx
├── PaymentFailure.tsx
├── PaymentOutcomeChoice.tsx
└── theme.ts
```

**Action:**
1. Extract shared components (7-8) to `frontend/shared/src/components/`
2. Move page components to `frontend/main-app/src/pages/` + `frontend/main-app/src/components/`
3. Move payment components to `frontend/apps/payment-gateway/src/components/`
4. Create exports in `frontend/shared/src/components/index.ts`

---

### 📁 ./config/
**Purpose:** Application configuration  
**Current Content:**
```
config/
└── heyoo.js                        (WhatsApp OTP API configuration)
```

**Mapping:**
```
config/heyoo.js                    →  backend/src/config/heyoo.js
```

**Action:** Move to backend configuration folder

---

### 📁 ./connecting-patients-to-matched-therapists/
**Purpose:** Patient-therapist matching platform (Vite app)  
**Current Content:**
```
connecting-patients-to-matched-therapists/
├── components/                     (10+ components)
├── context/                        (Context API state)
├── pages/
│   ├── MatchingDashboard.tsx
│   ├── TherapistProfile.tsx
│   └── [2 more pages]
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
connecting-patients-to-matched-therapists/  →  frontend/apps/patient-matching/
├── components/                           →  frontend/apps/patient-matching/src/components/
├── pages/                                →  frontend/apps/patient-matching/src/pages/
├── context/                              →  frontend/apps/patient-matching/src/context/
└── [support files]                       →  [migrate as standard]
```

**Action:** Rename & move to frontend/apps/patient-matching/

---

### 📁 ./controllers/
**Purpose:** Root API controllers  
**Current Content:**
```
controllers/
└── authController.js               (OTP auth with WhatsApp integration)
```

**Mapping:**
```
controllers/authController.js      →  backend/src/controllers/auth/index.js
```

**Action:** Move to backend/src/controllers/

---

### 📁 ./corporate-wellness/
**Purpose:** Corporate wellness dashboard (Vite app)  
**Current Content:**
```
corporate-wellness/
├── components/
├── pages/
├── services/
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
corporate-wellness/                →  frontend/apps/corporate-wellness/
├── components/                   →  frontend/apps/corporate-wellness/src/components/
├── pages/                        →  frontend/apps/corporate-wellness/src/pages/
└── [support files]               →  [migrate as standard]
```

**Action:** Move as-is (already proper structure)

---

### 📁 ./group-sessions/
**Purpose:** Group therapy sessions (Vite app)  
**Current Content:**
```
group-sessions/
├── components/                     (5+ components for group management)
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
group-sessions/                    →  frontend/apps/group-sessions/
├── components/                   →  frontend/apps/group-sessions/src/components/
└── [support files]               →  [migrate as standard]
```

**Action:** Move as-is

---

### 📁 ./migrations/
**Purpose:** Database schema migrations  
**Current Content:**
```
migrations/
├── 20260131_create_themed_rooms.sql
└── create_offline_sync_tables.sql
```

**Mapping:**
```
migrations/                        →  database/migrations/
├── 001_base_themed_rooms.sql
└── 002_offline_sync.sql

[Plus from Admin/backend/migrations/]
├── 003_admin_analytics.sql
└── 004_admin_features.sql
```

**Action:** Consolidate all migrations to `database/migrations/` with consistent naming

---

### 📁 ./payment gateway/
**Purpose:** Payment processing backend + frontend  
**Current Content:**
```
payment gateway/
├── backend/                        (Node.js payment API)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── frontend/                       (React payment UI)
│   ├── components/
│   └── package.json
├── database/
│   └── schema.sql
└── [config files]
```

**Mapping:**
```
payment gateway/backend/           →  backend/src/modules/payment/
│                                  (consolidate with main backend)

payment gateway/frontend/          →  frontend/apps/payment-gateway/
│                                  (move payment UI components)

payment gateway/database/          →  database/migrations/
│                                  (consolidate schemas)
```

**Action:**
1. Backend: Merge payment controllers/routes into `backend/src/modules/payment/`
2. Frontend: Move to `frontend/apps/payment-gateway/`
3. Database: Consolidate migrations

---

### 📁 ./public/
**Purpose:** Static assets  
**Current Content:**
```
public/
├── audio/                          (Sound therapy audio files)
│   ├── [15+ audio files]
├── images/                         (Images for UI)
│   ├── [app logos, backgrounds, etc]
├── locales/                        (i18n translations)
│   ├── en.json
│   ├── hi.json
│   ├── kn.json
│   ├── ta.json
│   └── te.json
├── DragonPitch-DigitalPet.mp4      (Video asset)
├── manifest.json                   (PWA manifest)
└── sw.js                           (Service worker)
```

**Mapping:**
```
public/audio/                      →  frontend/shared/src/public/audio/
public/images/                     →  frontend/shared/src/public/images/
public/locales/                    →  frontend/shared/src/locales/
public/manifest.json               →  frontend/main-app/public/manifest.json
public/sw.js                       →  frontend/main-app/public/sw.js
[Other assets]                     →  frontend/main-app/public/
```

**Action:** Distribute assets appropriately:
- Shared assets → frontend/shared/src/public/
- App-specific → frontend/main-app/public/
- Locales → frontend/shared/src/locales/

---

### 📁 ./routes/
**Purpose:** Root API routes  
**Current Content:**
```
routes/
└── authRoutes.js                   (OTP auth endpoints)
```

**Mapping:**
```
routes/authRoutes.js              →  backend/src/routes/auth.routes.js
```

**Action:** Move to backend/src/routes/

---

### 📁 ./school-wellness/
**Purpose:** School wellness platform (Vite app)  
**Current Content:**
```
school-wellness/
├── components/
├── pages/
├── services/
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
school-wellness/                   →  frontend/apps/school-wellness/
├── components/                   →  frontend/apps/school-wellness/src/components/
└── [support files]               →  [migrate as standard]
```

**Action:** Move as-is

---

### 📁 ./scripts/
**Purpose:** Development & deployment scripts  
**Current Content:**
```
scripts/
└── dev_auth_seed.sql              (Database seed for dev credentials)
```

**Mapping:**
```
scripts/                          →  scripts/
├── dev/
│   ├── seed-dev-data.sh
│   └── dev_auth_seed.sql
├── deploy/
│   └── [deployment scripts]
└── ci/
    └── [CI scripts]
```

**Action:** Reorganize scripts into dev/deploy/ci subdirectories

---

### 📁 ./server/
**Purpose:** Server utilities & database connection  
**Current Content:**
```
server/
├── db.js                           (Database connection helper)
├── index.js                        (Server setup utilities)
└── routes/
    └── [route helpers]
```

**Mapping:**
```
server/db.js                       →  backend/src/config/database.js
server/index.js                    →  backend/src/server.js (or merged into app.js)
server/routes/                     →  backend/src/routes/
```

**Action:** Move server config to backend/src/config/

---

### 📁 ./single meeting jitsi/
**Purpose:** 1:1 video therapy sessions (Vite app)  
**Current Content:**
```
single meeting jitsi/
├── components/
│   ├── VideoRoom.tsx
│   ├── SessionSetup.tsx
│   └── [3+ more components]
├── App.tsx
├── types.ts
├── vite.config.ts
└── package.json
```

**Mapping:**
```
single meeting jitsi/              →  frontend/apps/jitsi-sessions/
├── components/                   →  frontend/apps/jitsi-sessions/src/components/
└── [support files]               →  [migrate as standard]
```

**Action:** Rename & move to frontend/apps/jitsi-sessions/

---

### 📁 ./src/
**Purpose:** Root React app source  
**Current Content:**
```
src/
├── components/                     (Utility components)
│   ├── AccessibleForm.jsx
│   ├── ErrorBoundary.tsx
│   └── OfflineStatus.jsx
├── hooks/
│   ├── useLanguage.ts
│   ├── useAuth.ts
│   └── [custom hooks]
├── lib/
│   ├── offline-db.js              (Offline storage)
│   └── [utility libraries]
└── styles/
    ├── index.css
    └── [global styles]
```

**Mapping:**
```
src/components/                    →  frontend/shared/src/components/util/
src/hooks/                         →  frontend/shared/src/hooks/
src/lib/offline-db.js              →  frontend/shared/src/services/offline/
src/styles/                        →  frontend/shared/src/styles/
```

**Action:** Move to shared library for reuse across all apps

---

### 📁 ./utils/
**Purpose:** Shared utility functions  
**Current Content:**
```
utils/
├── formatters.ts                   (Date, price formatting)
├── i18n.ts                         (i18n helpers)
├── shopService.ts                  (Shop cart/checkout logic)
├── storageService.ts               (localStorage abstraction)
└── translations.ts                 (Translation helpers)
```

**Mapping:**
```
utils/                             →  frontend/shared/src/utils/
├── formatters.ts
├── i18n.ts
├── shopService.ts                  →  frontend/shared/src/services/shop/
├── storageService.ts               →  frontend/shared/src/services/storage/
└── translations.ts
```

**Action:** Move all to frontend/shared/src/{utils,services}/

---

## SECTION 2: NEW STRUCTURE SUMMARY

### Complete NEW Directory Tree

```
manas360-ui-main/
│
├── .infra/                          [NEW - from .github + config]
│   ├── ci-cd/github-actions/        [moved from .github/workflows/]
│   ├── docker/
│   │   ├── Dockerfile.frontend
│   │   ├── Dockerfile.backend
│   │   └── Dockerfile.python
│   └── kubernetes/                  [future use]
│
├── frontend/                        [NEW - consolidated frontend]
│   ├── apps/                        [Feature apps]
│   │   ├── cbt-engine/              [from ./CBTSessionEngine/]
│   │   ├── certification-platform/  [from ./certification-platform/]
│   │   ├── corporate-wellness/      [from ./corporate-wellness/]
│   │   ├── school-wellness/         [from ./school-wellness/]
│   │   ├── group-sessions/          [from ./group-sessions/]
│   │   ├── therapist-onboarding/    [from ./Therapist-Onboarding/]
│   │   ├── meera-ai-chatbot/        [from ./MeeraAI chatbot/]
│   │   ├── patient-matching/        [from ./connecting-patients-to-matched-therapists/]
│   │   ├── jitsi-sessions/          [from ./single meeting jitsi/]
│   │   ├── payment-gateway/         [from ./payment gateway/frontend/]
│   │   └── admin-analytics/         [from ./Admin/frontend/]
│   │
│   ├── main-app/                    [NEW - root app]
│   │   ├── src/
│   │   │   ├── pages/               [from ./components/ page components]
│   │   │   ├── components/          [from ./components/ + TherapistRegistrationFlow/]
│   │   │   ├── App.tsx              [from ./App.tsx]
│   │   │   └── main.tsx             [from ./index.tsx]
│   │   └── public/
│   │       ├── assets/              [images, videos]
│   │       ├── manifest.json        [from ./public/]
│   │       └── sw.js                [from ./public/]
│   │
│   └── shared/                      [NEW - shared libraries]
│       ├── src/
│       │   ├── components/
│       │   │   ├── Header.tsx       [from ./components/]
│       │   │   ├── Hero.tsx         [from ./components/]
│       │   │   ├── LanguageSwitcher.tsx
│       │   │   ├── index.ts         [export all]
│       │   │   └── util/            [from ./src/components/]
│       │   ├── services/
│       │   │   ├── storage/         [from ./utils/storageService.ts]
│       │   │   ├── ai/              [from ./utils/ + CBT gemini]
│       │   │   ├── auth/            [from ./config/heyoo.js]
│       │   │   ├── shop/            [from ./utils/shopService.ts]
│       │   │   ├── offline/         [from ./src/lib/offline-db.js]
│       │   │   └── index.ts
│       │   ├── hooks/               [from ./src/hooks/]
│       │   │   └── index.ts
│       │   ├── utils/               [from ./utils/]
│       │   │   ├── formatters.ts
│       │   │   ├── i18n.ts
│       │   │   ├── translations.ts
│       │   │   └── index.ts
│       │   ├── locales/             [from ./public/locales/]
│       │   │   ├── en.json
│       │   │   ├── hi.json
│       │   │   ├── kn.json
│       │   │   ├── ta.json
│       │   │   ├── te.json
│       │   │   └── index.ts
│       │   ├── styles/              [from ./public/audio + ./src/styles/]
│       │   │   ├── global.css
│       │   │   ├── variables.css
│       │   │   └── admin-theme.css
│       │   ├── public/              [from ./public/]
│       │   │   ├── audio/
│       │   │   └── images/
│       │   ├── types.ts             [Shared TypeScript types]
│       │   └── index.ts             [Main export file]
│       ├── package.json
│       └── tsconfig.json
│
├── backend/                         [NEW - consolidated backend]
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth/                [from ./controllers/authController.js]
│   │   │   ├── sessions/
│   │   │   ├── admin/               [from ./Admin/backend/controllers/]
│   │   │   └── payments/            [from ./payment gateway/backend/]
│   │   ├── routes/
│   │   │   ├── auth.routes.js       [from ./routes/authRoutes.js]
│   │   │   ├── admin.routes.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── adminAuth.middleware.js [from ./Admin/backend/middleware/]
│   │   ├── models/                  [from ./Admin/backend/models/]
│   │   │   └── index.js
│   │   ├── config/
│   │   │   ├── database.js          [from ./server/db.js]
│   │   │   ├── heyoo.js             [from ./config/heyoo.js]
│   │   │   └── constants.js
│   │   ├── app.js                   [Express app setup]
│   │   └── server.js                [Entry point, from ./server/]
│   ├── migrations/                  [consolidated]
│   │   ├── seeds/
│   │   │   └── dev-users.sql        [from ./scripts/dev_auth_seed.sql]
│   │   ├── 001_base_schema.sql
│   │   ├── 002_analytics.sql        [from ./Admin/backend/migrations/]
│   │   └── 003_offline_sync.sql
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── python-services/                 [NEW - Python services]
│   └── digital-pet-hub/             [from ./Digital_Pet_Hub/]
│       ├── app/
│       ├── models/
│       ├── client/                  [Dart frontend]
│       ├── database/
│       ├── requirements.txt
│       ├── Dockerfile
│       └── README.md
│
├── database/                        [NEW - centralized DB]
│   ├── migrations/                  [all SQL migrations]
│   │   ├── seeds/
│   │   └── [all .sql files]
│   ├── diagrams/
│   │   └── entity-relationship.md
│   └── README.md
│
├── scripts/                         [Organized]
│   ├── dev/
│   │   ├── start-all.sh
│   │   ├── setup-db.sh
│   │   └── seed-dev-data.sh
│   ├── deploy/
│   │   ├── deploy-frontend.sh
│   │   ├── deploy-backend.sh
│   │   └── rollback.sh
│   └── ci/
│       ├── lint.sh
│       ├── test.sh
│       └── build.sh
│
├── docs/                           [Documentation]
│   ├── ARCHITECTURE.md
│   ├── FEATURE_APPS.md
│   ├── API.md
│   ├── DB_SCHEMA.md
│   ├── DUPLICATE_ANALYSIS.md       [THIS DOCUMENT]
│   ├── IMPORT_MIGRATION_EXAMPLES.md
│   └── DEPLOYMENT.md
│
├── .github/                        [CI/CD]
│   └── workflows/
│
├── Root Files
├── package.json                    [Workspace root with npm workspaces]
├── tsconfig.json                   [Global TS config with path aliases]
├── docker-compose.yml              [Local dev environment]
├── .env.example
├── README.md
├── RESTRUCTURING_PLAN.md
├── MIGRATION_CHECKLIST.md
├── PROJECT_SUMMARY.md
├── IMPORT_MIGRATION_EXAMPLES.md
├── QUICK_REFERENCE.md
├── DELIVERY_SUMMARY.md
└── README_RESTRUCTURING.md
```

---

## SECTION 3: FILE MOVEMENT SUMMARY TABLE

| Current Path | New Path | Type | Action |
|---|---|---|---|
| ./.github/workflows/ | ./.infra/ci-cd/github-actions/ | Folder | Move |
| ./Admin/backend/ | backend/src/admin/ | Folder | Merge |
| ./Admin/frontend/ | frontend/apps/admin-analytics/ | App | Move |
| ./CBTSessionEngine/ | frontend/apps/cbt-engine/ | App | Move |
| ./Digital_Pet_Hub/ | python-services/digital-pet-hub/ | Service | Move |
| ./MeeraAI chatbot/ | frontend/apps/meera-ai-chatbot/ | App | Move |
| ./Therapist-Onboarding/ | frontend/apps/therapist-onboarding/ | App | Move + Flatten |
| ./Therapist-Onboarding/*.../copy-of-cbt* | [DELETE] | Folder | Delete |
| ./TherapistRegistrationFlow/ | frontend/main-app/src/components/therapist-registration/ | Component | Move |
| ./certification-platform/ | frontend/apps/certification-platform/ | App | Move |
| ./components/ | frontend/shared/src/components/ + frontend/main-app/src/ | Split | Split |
| ./components/payment-gateway/ | frontend/apps/payment-gateway/src/components/ | Folder | Move |
| ./config/heyoo.js | backend/src/config/heyoo.js | File | Move |
| ./connecting-patients-to-matched-therapists/ | frontend/apps/patient-matching/ | App | Rename + Move |
| ./controllers/authController.js | backend/src/controllers/auth/ | File | Move |
| ./corporate-wellness/ | frontend/apps/corporate-wellness/ | App | Move |
| ./group-sessions/ | frontend/apps/group-sessions/ | App | Move |
| ./migrations/ | database/migrations/ | Folder | Move |
| ./payment gateway/ | split across backend + frontend/apps | Split | Split |
| ./public/ | split across frontend/shared + frontend/main-app | Split | Split |
| ./public/locales/ | frontend/shared/src/locales/ | Folder | Move |
| ./routes/authRoutes.js | backend/src/routes/auth.routes.js | File | Move |
| ./school-wellness/ | frontend/apps/school-wellness/ | App | Move |
| ./scripts/dev_auth_seed.sql | scripts/dev/dev_auth_seed.sql | File | Move |
| ./server/ | backend/src/config/ + backend/src/ | Split | Split |
| ./single meeting jitsi/ | frontend/apps/jitsi-sessions/ | App | Rename + Move |
| ./src/ | frontend/shared/src/ + frontend/main-app/src/ | Split | Split |
| ./utils/ | frontend/shared/src/utils/ + frontend/shared/src/services/ | Split | Split |

---

## SECTION 4: ACTION CHECKLIST

### Files to DELETE
- [ ] `./Therapist-Onboarding/manas360-therapist-training-portal-atmt-ai-5-whys/copy-of-cbt-session-engine (3)/` - Verified duplicate

### Files to MOVE Directly
- [ ] ./.github/ → ./.infra/ci-cd/
- [ ] ./CBTSessionEngine/ → frontend/apps/cbt-engine/
- [ ] ./MeeraAI chatbot/ → frontend/apps/meera-ai-chatbot/
- [ ] ./certification-platform/ → frontend/apps/certification-platform/
- [ ] ./corporate-wellness/ → frontend/apps/corporate-wellness/
- [ ] ./Digital_Pet_Hub/ → python-services/digital-pet-hub/
- [ ] ./group-sessions/ → frontend/apps/group-sessions/
- [ ] ./migrations/ → database/migrations/
- [ ] ./school-wellness/ → frontend/apps/school-wellness/
- [ ] ./single meeting jitsi/ → frontend/apps/jitsi-sessions/

### Files to RENAME + MOVE
- [ ] ./connecting-patients-to-matched-therapists/ → frontend/apps/patient-matching/

### Complex MOVES (Multiple Steps)
- [ ] ./Admin/ - split backend/frontend
- [ ] ./components/ - split shared/main-app
- [ ] ./Therapist-Onboarding/ - flatten nested app
- [ ] ./payment gateway/ - split backend/frontend
- [ ] ./public/ - distribute across shared/main-app
- [ ] ./server/ - merge into backend/
- [ ] ./src/ - split shared/main-app
- [ ] ./utils/ - move to shared/services & shared/utils

### Files to CONSOLIDATE (Migrations)
- [ ] All migrations → database/migrations/
- [ ] All controllers → backend/src/controllers/
- [ ] All routes → backend/src/routes/

---

## SECTION 5: IMPLEMENTATION STRATEGY

### Phase 1: Safe Deletions (Day 1)
1. Delete `copy-of-cbt-session-engine (3)` after verification
2. Verify build still works
3. Commit: "chore: remove orphaned CBT duplicate"

### Phase 2: Direct Moves (Days 2-4)
1. Move 10 apps that need no modification
2. Test each after move
3. Commit per app: "refactor: move {app} to frontend/apps/"

### Phase 3: Complex Splits (Days 5-7)
1. Split Admin into backend + frontend
2. Split components into shared + main-app
3. Split public into appropriate locations
4. Commit per major section

### Phase 4: Consolidations (Days 8-9)
1. Move utils to frontend/shared/
2. Move server files to backend/src/config/
3. Consolidate migrations
4. Commit per consolidation area

### Phase 5: Flatten & Integrate (Days 10-12)
1. Flatten Therapist-Onboarding nested apps
2. Move TherapistRegistrationFlow to main-app
3. Integrate payment gateway
4. Update all imports

---

**Document Version:** 1.0  
**Status:** ✅ COMPLETE - Ready for detailed execution  
**Next Step:** Use this as reference during migration execution

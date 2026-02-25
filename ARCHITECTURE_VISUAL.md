# ═══════════════════════════════════════════════════════════════════════════
# FRONTEND ARCHITECTURE - VISUAL OVERVIEW
# ═══════════════════════════════════════════════════════════════════════════

## SYSTEM ARCHITECTURE (AFTER STABILIZATION)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         MANAS360 FRONTEND                                   │
│                    (React + TypeScript + Vite)                             │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
              ┌─────────────────────┴─────────────────────┐
              │                                           │
              ▼                                           ▼
    ┌──────────────────┐                      ┌──────────────────┐
    │  ERROR BOUNDARY  │                      │  THEME PROVIDER  │
    │  (Global Catch)  │                      │  (Dark/Light)    │
    └──────────────────┘                      └──────────────────┘
              │                                           │
              └─────────────────────┬─────────────────────┘
                                    │
                                    ▼
                      ┌──────────────────────────┐
                      │    AUTH PROVIDER         │
                      │  (User, Role, Login)     │
                      └──────────────────────────┘
                                    │
                                    ▼
                      ┌──────────────────────────┐
                      │  SUBSCRIPTION PROVIDER   │
                      │  (Plan, Features, Gates) │
                      └──────────────────────────┘
                                    │
                                    ▼
                      ┌──────────────────────────┐
                      │         APP.tsx          │
                      │   (Hash-based Routing)   │
                      └──────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
    │  PUBLIC VIEWS   │   │ PROTECTED VIEWS │   │   GATED VIEWS   │
    └─────────────────┘   └─────────────────┘   └─────────────────┘
              │                     │                     │
              │                     │                     │
              ▼                     ▼                     ▼
       Landing Page         ┌──────────────┐       Themed Rooms
       Assessment           │ProtectedRoute│       Premium Features
       Crisis Page          └──────────────┘
                                    │
                                    ▼
                            Admin Dashboard
                            Therapist Panel
```

---

## API CLIENT ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED API CLIENT                                       │
│                (frontend/utils/apiClient-unified.ts)                       │
└────────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┼───────────────────┐
                │                   │                   │
                ▼                   ▼                   ▼
       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │  REQUEST    │     │  RESPONSE   │     │   ERROR     │
       │ INTERCEPTOR │     │ INTERCEPTOR │     │  HANDLER    │
       └─────────────┘     └─────────────┘     └─────────────┘
                │                   │                   │
                │                   │                   │
                ▼                   ▼                   ▼
         Inject Token        Extract Data         Refresh on 401
         Add Headers         Parse JSON           Logout on Error
         Log Request         Log Response         Show Toast
                
                                    │
                                    │
                                    ▼
                ┌──────────────────────────────────────┐
                │       API ENDPOINT GROUPS            │
                ├──────────────────────────────────────┤
                │  api.auth.*                          │
                │  api.users.*                         │
                │  api.subscriptions.*                 │
                │  api.payments.*                      │
                │  api.themedRooms.*                   │
                │  api.admin.*                         │
                │  api.analytics.*                     │
                └──────────────────────────────────────┘
                                    │
                                    │
                                    ▼
                ┌──────────────────────────────────────┐
                │      UNIFIED BACKEND SERVER          │
                │    http://localhost:5000/api/v1      │
                └──────────────────────────────────────┘
```

---

## AUTHENTICATION FLOW

```
┌────────────┐
│   User     │
│  Visits    │
│   Page     │
└──────┬─────┘
       │
       ▼
┌────────────────┐
│  AuthContext   │  ◄─── Check localStorage.getItem('accessToken')
│   Provider     │
└──────┬─────────┘
       │
       ├─── Token Exists? ───┐
       │                     │
       ▼ NO                  ▼ YES
  ┌────────┐          ┌─────────────┐
  │ Show   │          │ Fetch User  │
  │ Login  │          │ api.users   │
  │ Prompt │          │   .getMe()  │
  └────────┘          └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │  Set User   │
                      │   State     │
                      └──────┬──────┘
                             │
                             ▼
                      ┌─────────────┐
                      │  Render     │
                      │   App       │
                      └─────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  TOKEN REFRESH FLOW (AUTOMATIC)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. User makes API call → GET /api/v1/users/me                         │
│  2. Request interceptor → Inject accessToken header                    │
│  3. Backend returns 401 → Token expired                                │
│  4. Response interceptor catches 401                                   │
│  5. Call POST /api/v1/auth/refresh with refreshToken                   │
│  6. Backend returns new accessToken + refreshToken                     │
│  7. Store new tokens in localStorage                                   │
│  8. Retry original request with new token                              │
│  9. Return response to component                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SUBSCRIPTION FEATURE GATING

```
┌──────────────────────────┐
│  Component Render        │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  RequireFeature Wrapper  │
│  feature="themed_rooms"  │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│ useSubscription() Hook   │
└──────────┬───────────────┘
           │
           ├─── hasFeature('themed_rooms')? ─┐
           │                                 │
           ▼ NO                              ▼ YES
    ┌─────────────┐                  ┌─────────────┐
    │   Show      │                  │   Render    │
    │  Upgrade    │                  │   Premium   │
    │  Prompt     │                  │   Content   │
    └─────────────┘                  └─────────────┘
```

---

## ROLE-BASED ACCESS CONTROL (RBAC)

```
┌──────────────────────────┐
│  Admin Dashboard Route   │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│  ProtectedRoute Wrapper  │
│  allowedRoles={['admin']}│
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────┐
│   useAuth() Hook         │
└──────────┬───────────────┘
           │
           ├─── isAuthenticated? ─┐
           │                      │
           ▼ NO                   ▼ YES
    ┌─────────────┐        ┌──────────────┐
    │   Show      │        │ Check Role   │
    │   Login     │        └──────┬───────┘
    │   Screen    │               │
    └─────────────┘               ├─── role === 'admin'? ─┐
                                  │                       │
                                  ▼ NO                    ▼ YES
                           ┌─────────────┐         ┌─────────────┐
                           │   Access    │         │   Render    │
                           │   Denied    │         │   Dashboard │
                           └─────────────┘         └─────────────┘
```

---

## DATA FLOW: THEMED ROOMS EXAMPLE

```
┌────────────────────────────────────────────────────────────────────────────┐
│  BEFORE STABILIZATION                                                       │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ARThemedRoomLanding.tsx                                                   │
│      │                                                                      │
│      ▼                                                                      │
│  const AR_THEMES = [                  ◄──── HARDCODED DATA                 │
│    { id: 'boat-ocean', ... },                                              │
│    { id: 'green-tea', ... },                                               │
│  ]                                                                          │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│  AFTER STABILIZATION                                                        │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ARThemedRoomLanding.tsx                                                   │
│      │                                                                      │
│      ▼                                                                      │
│  useEffect(() => {                                                         │
│    api.themedRooms.getThemes()      ◄──── BACKEND FETCH                   │
│      .then(res => setThemes(res.data.themes))                             │
│  }, [])                                                                    │
│      │                                                                      │
│      ▼                                                                      │
│  Unified API Client                                                        │
│      │                                                                      │
│      ▼                                                                      │
│  GET http://localhost:5000/api/v1/themed-rooms/themes                     │
│      │                                                                      │
│      ▼                                                                      │
│  Backend Database                                                          │
│      │                                                                      │
│      ▼                                                                      │
│  { themes: [...] }                   ◄──── DYNAMIC DATA                   │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT HIERARCHY (KEY PARTS)

```
index.tsx
  └── ErrorBoundary
      └── AuthProvider
          └── SubscriptionProvider
              └── App.tsx
                  ├── Landing Page
                  ├── Home Page
                  ├── Assessment Pages
                  ├── Payment Pages
                  ├── Themed Rooms
                  │   └── RequireFeature (themed_rooms)
                  │       └── ARThemedRoomLanding
                  └── Admin
                      ├── AdminLogin
                      └── ProtectedRoute (admin)
                          └── AnalyticsDashboard
```

---

## FILE STRUCTURE (UPDATED)

```
manas360-ui-main/
├── backend/
│   └── src/
│       └── server.js  ◄───── Unified Server (Port 5000)
│
├── frontend/
│   ├── utils/
│   │   └── apiClient-unified.ts  ◄───── SINGLE API CLIENT
│   │
│   └── main-app/
│       ├── index.tsx  ◄───── App Entry (with Providers)
│       ├── App.tsx    ◄───── Hash-based Router
│       │
│       ├── contexts/
│       │   ├── AuthContext.tsx        ◄───── NEW (Auth State)
│       │   └── SubscriptionContext.tsx ◄───── NEW (Subscription State)
│       │
│       ├── components/
│       │   ├── guards/
│       │   │   ├── ProtectedRoute.tsx  ◄───── NEW (RBAC)
│       │   │   └── RequireFeature.tsx  ◄───── NEW (Feature Gate)
│       │   │
│       │   ├── HomePage.tsx
│       │   ├── ARThemedRoomLanding.tsx  ◄───── UPDATED (Backend Fetch)
│       │   └── ...
│       │
│       ├── admin/
│       │   ├── hooks/
│       │   │   ├── useAdmin.ts        ◄───── UPDATED (Unified Client)
│       │   │   └── useAnalytics.ts    ◄───── UPDATED (Unified Client)
│       │   │
│       │   ├── pages/
│       │   │   ├── AdminLogin.tsx     ◄───── UPDATED (Unified Auth)
│       │   │   └── AnalyticsDashboard.tsx
│       │   │
│       │   └── services/
│       │       └── analyticsApi.ts    ◄───── UPDATED (Port Fix Only)
│       │
│       └── utils/
│           └── paymentIntegration.ts  ◄───── UPDATED (Unified Client)
│
└── DOCS/
    ├── FRONTEND_STABILIZATION_COMPLETE.md  ◄───── Full Report
    ├── FRONTEND_STABILIZATION_SUMMARY.md   ◄───── Quick Ref
    ├── DEVELOPER_MIGRATION_GUIDE.md        ◄───── Developer Guide
    └── ARCHITECTURE_VISUAL.md              ◄───── This File
```

---

## PORT ARCHITECTURE (BEFORE vs AFTER)

### BEFORE:
```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  Frontend   │       │  Admin API  │       │  Analytics  │
│  Port 3000  │──────▶│  Port 5001  │──────▶│  Port 5002  │
└─────────────┘       └─────────────┘       └─────────────┘
                              │
                              ▼
                      ❌ PORT DRIFT
```

### AFTER:
```
┌─────────────┐
│  Frontend   │
│  Port 3000  │
└──────┬──────┘
       │
       │ All API Calls
       │
       ▼
┌──────────────────────┐
│  Unified Backend     │
│    Port 5000         │
│  /api/v1/*           │
└──────────────────────┘
       │
       ▼
✅ SINGLE SOURCE OF TRUTH
```

---

## DEPLOYMENT ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION DEPLOYMENT                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                                       │
│  │   CDN / S3      │  ◄─── Static Assets (HTML, CSS, JS, Images)          │
│  │  (Frontend)     │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │   CloudFront    │  ◄─── HTTPS, Caching, Compression                    │
│  │   (Optional)    │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │  API Gateway    │  ◄─── Route /api/v1/* to backend                     │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │  Unified Server │  ◄─── Node.js + Express (Port 5000)                  │
│  │   (Backend)     │                                                       │
│  └────────┬────────┘                                                       │
│           │                                                                 │
│           ▼                                                                 │
│  ┌─────────────────┐                                                       │
│  │   PostgreSQL    │  ◄─── Database (RDS / Managed)                       │
│  │    Database     │                                                       │
│  └─────────────────┘                                                       │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## TESTING ARCHITECTURE

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         TESTING PYRAMID                                     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                           ▲                                                 │
│                          ╱ ╲                                               │
│                         ╱   ╲                                              │
│                        ╱  E2E ╲         ◄─── Playwright / Cypress         │
│                       ╱ (Manual)╲                                          │
│                      ╱___________╲                                         │
│                     ╱             ╲                                        │
│                    ╱  Integration  ╲   ◄─── Jest + Testing Library        │
│                   ╱   (API Mocks)   ╲                                      │
│                  ╱___________________╲                                     │
│                 ╱                     ╲                                    │
│                ╱    Unit Tests         ╲ ◄─── Jest + React Testing Lib    │
│               ╱  (Components, Hooks)    ╲                                  │
│              ╱___________________________╲                                 │
│                                                                             │
│  Current Status:                                                           │
│  ✅ Backend integration tests (comprehensive-integration.test.cjs)         │
│  ⚠️  Frontend unit tests (minimal - to be expanded)                       │
│  ⚠️  E2E tests (manual verification only)                                 │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

**Date**: February 1, 2025  
**Status**: Production Ready  
**Backend**: Unified Server v1 (Port 5000)  
**Frontend**: Stabilized Architecture with Centralized API Client

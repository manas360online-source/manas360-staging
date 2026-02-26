# MANAS360 Enterprise Refactor Report (26 Feb 2026)

## 1) New clean folder structure

```text
frontend/main-app/
├── App.tsx                         # Router shell only
├── index.tsx                       # Providers + app boot
├── contexts/
│   └── AuthContext.tsx             # Central auth state + OTP flow APIs
├── pages/
│   ├── LandingPage.tsx             # Single landing tree
│   ├── UniversalAuthPage.tsx       # Unified non-admin auth
│   └── DashboardPage.tsx           # Authenticated user dashboard
├── admin/
│   └── pages/
│       ├── AdminLogin.tsx
│       └── AnalyticsDashboard.tsx  # Admin panel route target
└── public/
    └── sw.js                       # /api/v1-aligned route handling

backend/
├── Dockerfile                      # Unified server entrypoint + 5001
└── src/
    ├── middleware/
    │   ├── authMiddleware-unified.js
    │   └── routeProtection.js      # Route protection middleware example
    ├── controllers/
    │   ├── authUnifiedController.js
    │   └── paymentController.js
    └── routes/
        ├── authRoutes.js
        └── paymentRoutes.js

root/
├── server.js                       # Single unified Express runtime
├── docker-compose.yml              # Port 5001 alignment
└── migrations/
    └── 20260226_unified_saas_schema.sql
```

## 2) Updated App.tsx

- Implemented in `frontend/main-app/App.tsx`
- Replaced `currentView`/hash-switching architecture with route-based navigation:
  - `/` → `LandingPage`
  - `/auth` → `UniversalAuthPage`
  - `/dashboard` → `DashboardPage`
  - `/admin` → `AdminLogin` or `AnalyticsDashboard` (based on auth role)

## 3) Updated server.js

- Implemented in `server.js`
- Unified API runtime on port `5001`
- Added strict legacy namespace retirement:
  - `/api/*` (non-`/api/v1`) returns HTTP `410`
- Added graceful shutdown handling for `SIGINT` and `SIGTERM`
- Kept global `helmet`, strict CORS allowlist, rate-limits, and centralized sanitized error response

## 4) AuthContext implementation

- Implemented in `frontend/main-app/contexts/AuthContext.tsx`
- Centralized auth actions:
  - `login(identifier)` sends OTP
  - `login(identifier, otp)` verifies OTP and stores authenticated user state
  - `logout()` revokes session server-side and clears auth state client-side
- Universal auth UI now consumes context-driven login instead of direct API calls

## 5) Secure token strategy

- Access token: short-lived, HTTP-only cookie (`access_token`, `/api/v1`, 15 min)
- Refresh token: rotating, HTTP-only cookie (`refresh_token`, `/api/v1/auth`, 7 days)
- CSRF: `csrf_token` cookie + `X-CSRF-Token` header requirement on mutating `/api/v1` requests
- Replay defense:
  - One-time refresh token rotation
  - Token family (`family_id`) chain tracking
  - Family-wide revocation on replay/reuse detection
- Logout revocation:
  - Server invalidates refresh token set for the principal

## 6) Payment webhook verification example

- Added example at `docs/snippets/paymentWebhookVerification.example.js`
- Enforces:
  - HMAC signature validation (`sha256`)
  - Timestamp drift window check
  - Rejects invalid/missing signatures before business logic

## 7) Route protection middleware example

- Added in `backend/src/middleware/routeProtection.js`
- Includes:
  - `requireAuth`
  - `requireRole([...])`
  - `requirePermission([...])`

## 8) DB schema final version

- Added unified schema at `migrations/20260226_unified_saas_schema.sql`
- Consolidates to single core models:
  - `users`
  - `subscriptions`
  - `subscription_plans`
  - `payments`
  - `refresh_tokens`
  - `payment_webhook_events`
- Includes:
  - UUID primary keys
  - FK constraints
  - index on `users.email`
  - index on `subscriptions.user_id`
  - transaction-safe migration wrapper (`BEGIN/COMMIT`)

## 9) Migration plan

1. Deploy schema migration `20260226_unified_saas_schema.sql` to staging.
2. Enable unified server (`server.js`) on port `5001` and verify `/health`.
3. Route all frontend API traffic to one base: `VITE_API_BASE_URL=http://<host>:5001/api/v1`.
4. Disable legacy `/api` consumers and monitor 410 responses for stragglers.
5. Roll out frontend router shell (`/`, `/auth`, `/dashboard`, `/admin`) and verify auth journey.
6. Validate admin login path with password/OTP and MFA challenge where enabled.
7. Run payment webhook signature validation test with valid and invalid signatures.
8. Cut over production traffic, then retire legacy server startup scripts/processes.

## 10) Final production-readiness verdict

**Verdict: Conditionally ready for staged production rollout.**

- Architecture confusion from state/hash routing and duplicate server entrypoints is removed from active runtime.
- Unified `/api/v1` contract and token security controls are enforced in runtime.
- Remaining step before full sign-off: run full integration/UAT pass for all non-core feature modules previously attached to legacy `currentView` routing tree.

## 11) List of deleted legacy files

- `App.tsx` (root-level duplicate app shell)
- `backend/admin/server.js` (duplicate admin server entrypoint)
- `backend/payment-gateway/server.js` (duplicate payment server entrypoint)

## 12) Step-by-step upgrade sequence (safe rollout)

1. **Pre-rollout backup:** snapshot DB + export current env/config.
2. **Schema phase:** apply migration in staging, run smoke queries.
3. **Backend phase:** deploy unified server only, verify `/health` and `/api/v1` auth refresh/logout flows.
4. **Security phase:** test replay token rejection, CSRF checks, webhook signature rejection paths.
5. **Frontend phase:** deploy router-based app and verify no flicker on `/ -> /auth`.
6. **Traffic phase:** switch LB/proxy to 5001 backend and monitor error/rate-limit/security logs.
7. **Legacy retirement:** remove old process supervisors/tasks targeting deleted entrypoints.
8. **Production sign-off:** complete UAT checklist, then lock legacy routes permanently.

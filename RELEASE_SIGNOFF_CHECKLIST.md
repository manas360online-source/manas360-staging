# Release Sign-Off Checklist

## Scope
- Runtime surface locked to `/api/v1/*`
- Legacy `/api/*` paths decommissioned
- Unified token model (`accessToken` + `refreshToken`)
- DB/controller contract alignment migrations applied
- Security baseline enabled (Helmet, CORS controls, rate limiting)

## Required Checks
- [x] `GET /health` returns `200`
- [x] `POST /api/v1/auth/send-otp` returns `200`
- [x] `POST /api/v1/auth/verify-otp` returns `200`
- [x] Protected route without token returns `401` (`GET /api/v1/subscriptions/current`)
- [x] Protected route with valid token returns `200` (`GET /api/v1/subscriptions/current`)
- [x] Admin route with admin token returns `200` (`GET /api/v1/admin/users`)
- [x] Legacy route returns `404` (`GET /api/auth/send-otp`)

## Evidence (Atomic Revalidation)
- `GET http://localhost:5001/health` → `200`
- `POST http://localhost:5001/api/v1/auth/send-otp` → `200`
- `POST http://localhost:5001/api/v1/auth/verify-otp` → `200`
- `GET http://localhost:5001/api/v1/subscriptions/current` (no token) → `401`
- `GET http://localhost:5001/api/v1/subscriptions/current` (Bearer token) → `200`
- `GET http://localhost:5001/api/v1/admin/users` (Bearer token) → `200`
- `GET http://localhost:5001/api/auth/send-otp` → `404`

## Release Decision
- [x] Sign-off: **PASS**
- [x] Contract lock status: **ENFORCED**
- [x] Runtime validation status: **PASS**

## Linked Artifacts
- `HARD_SURFACE_UNIFICATION_REPORT.md`
- `migrations/20260225_contract_lock_alignment.sql`
- `SECURITY_SMOKE_EVIDENCE.md`

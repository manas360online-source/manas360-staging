# Security Smoke Evidence

Date: 2026-02-25
Scope: Runtime validation of admin MFA auth, refresh token replay detection, logout revocation, and webhook signature protection.

## Command
- npm run test:security-smoke

## Preconditions
- Backend server running on http://localhost:5001
- Database migrations applied:
  - migrations/20260225_contract_lock_alignment.sql
  - migrations/20260225_security_hardening.sql
- Environment loaded from .env and .env.local

## Latest Verified Result
- adminLoginInitiateStatus: 200
- adminLoginVerifyMfaStatus: 200
- adminUsersStatus: 200
- refreshFirstStatus: 200
- refreshReplayOldStatus: 401 (expected)
- logoutStatus: 200
- refreshAfterLogoutStatus: 401 (expected)
- webhookForgedStatus: 401 (expected)
- overall: ok=true

## Interpretation
- Admin login requires MFA and succeeds with valid primary factor + valid MFA code.
- Refresh token rotation is one-time-use and replay attempts are rejected.
- Logout revokes refresh capability as expected.
- Forged webhook requests without valid signature are rejected.

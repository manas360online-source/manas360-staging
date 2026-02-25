# Universal Auth Architecture - Manas360

**Version:** 1.0  
**Date:** 2025-02-27  
**Status:** ✅ Implemented

---

## Overview

The Manas360 platform now features a **split authentication architecture** optimized for security, modularity, and role-specific UX:

1. **Universal Auth Page** - Login/Register for 7 non-admin user types
2. **Secured Admin Portal** - Separate MFA-protected admin entry point

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     MANAS360 AUTH SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌─ LANDING PAGE ──────────────────────────────────────────────────┐
│                                                                 │
│  Landing → Hero → TrustBar → Testimonials → CTA                │
│                                                                 │
│  Two Login Routes:                                              │
│  1. "Log In" button → #/en/auth (Universal Auth)               │
│  2. "Secure Admin Portal" → #/en/admin/login (Admin MFA)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│    UNIVERSAL AUTH PAGE (#/en/auth)          ADMIN LOGIN (#/en/admin/login) │
│    ─────────────────────────────              ──────────────────────       │
│                                              │                            │
│  Step 1: Role Selection                     │ Step 1: Primary Factor   │
│  ┌──────────────────────────────┐           │ ├─ Email                 │
│  │ • Patient                    │           │ ├─ Phone/OTP             │
│  │ • Therapist                  │           │ └─ Password              │
│  │ • Corporate                  │           │                          │
│  │ • Education                  │           │ Step 2: MFA Verify       │
│  │ • Healthcare                 │           │ └─ HOTP Code (6-digit)   │
│  │ • Insurance                  │           │                          │
│  │ • Government                 │           │ ✓ Fingerprint-locked     │
│  │                              │           │ ✓ IP/UA binding          │
│  └──────────────────────────────┘           │ ✓ Family token tracking  │
│                                              │                          │
│  Step 2: Login or Register                  │ Routes:                  │
│  ├─ Email/Phone                            │ ├─ POST /api/admin-login │
│  ├─ OTP Verification                        │ ├─ POST /api/admin-login/verify-mfa │
│  ├─ Profile Completion                      │ └─ GET /api/admin/dashboard │
│  └─ Full User Signup                        │                          │
│                                              │ Auth: HOTP + CSRF + Cookies │
│  Step 3: Role-Specific Redirect              │                          │
│  ├─ Patient → Profile Setup                 │                          │
│  ├─ Therapist → Onboarding                  │                          │
│  ├─ Corporate → Wellness Portal             │                          │
│  ├─ Education → School Wellness             │                          │
│  └─ Health/Insurance/Gov → Home             │                          │
│                                              │                          │
│  API Endpoints:                              │                          │
│  ├─ POST /api/auth/send-otp                │                          │
│  ├─ POST /api/auth/verify-otp              │                          │
│  └─ POST /api/auth/register                │                          │
│                                              │                          │
│  Auth: OTP + CSRF + Cookies                │                          │
│                                              │                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│           SHARED SECURITY INFRASTRUCTURE                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  • Cookie-based auth (acccess_token, refresh_token)            │
│  • CSRF header validation (x-csrf-token)                        │
│  • Refresh token rotation + family tracking                     │
│  • Replay detection (reuse_detected_at)                         │
│  • Logout revocation (token family marked invalid)              │
│  • Webhook signature validation (HMAC-SHA256)                   │
│  • Rate limiting + brute force protection                       │
│  • Helmet security headers                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Type Routes

### Supported User Types

| Role | Component | Route | Flow |
|------|-----------|-------|------|
| **Patient** | Universal Auth Page | `#/en/auth` → `#/en/profile-setup` | OTP → Profile Setup → Home |
| **Therapist** | Universal Auth Page | `#/en/auth` → `#/en/therapist-onboarding` | OTP → Onboarding → Dashboard |
| **Corporate** | Universal Auth Page | `#/en/auth` → `#/en/corporate-wellness` | OTP → Corporate Portal |
| **Education** | Universal Auth Page | `#/en/auth` → `#/en/school-wellness` | OTP → School Admin Portal |
| **Healthcare** | Universal Auth Page | `#/en/auth` → `#/en/home` | OTP → Home |
| **Insurance** | Universal Auth Page | `#/en/auth` → `#/en/home` | OTP → Home |
| **Government** | Universal Auth Page | `#/en/auth` → `#/en/home` | OTP → Home |
| **Admin** | AdminLogin.tsx | `#/en/admin/login` → `#/en/admin-dashboard` | Password/OTP → MFA → Dashboard |

### Why Admin is Separate

✅ **Security**
- MFA is mandatory (2-step flow, not optional)
- No public self-registration allowed
- Admin existence not exposed to public
- Separate audit trail and logging

✅ **UX**
- Different credential types (password + MFA vs OTP only)
- Targeted onboarding (admin dashboard vs user profiles)
- Admin features hidden from role selector

✅ **Architecture**
- MFA logic isolated and testable
- Different user provisioning (system-managed vs self-service)
- Separate security policies per endpoint

---

## File Structure

```
frontend/main-app/
├── pages/
│   └── UniversalAuthPage.tsx          ← NEW: Universal 7-role auth UI
├── admin/
│   ├── pages/
│   │   └── AdminLogin.tsx             ← Existing: 2-step MFA admin login
│   └── App.tsx                         ← Admin dashboard routing
├── components/
│   ├── AuthContext.tsx                ← Shared auth state management
│   ├── SubscriptionContext.tsx        ← Shared subscription state
│   ├── ProtectedRoute.tsx             ← Role-based route guards
│   └── RequireFeature.tsx             ← Feature gating wrapper
└── utils/
    └── apiClient-unified.ts           ← Shared HTTP client (CSRF, cookies, refresh)

backend/src/
├── controllers/
│   └── authUnifiedController.js       ← OTP + Admin MFA logic
├── middleware/
│   └── authMiddleware-unified.js      ← Token verification + refresh rotation
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
└── models/
    ├── refreshTokenModel.js           ← Family-based token tracking
    └── adminLoginChallengeModel.js    ← MFA fingerprint persistence

migrations/
├── 20260225_contract_lock_alignment.sql    ← Users table schema
└── 20260225_security_hardening.sql        ← Admin/Webhook tables + Family tracking
```

---

## Component: UniversalAuthPage.tsx

**Location:** [frontend/main-app/pages/UniversalAuthPage.tsx](frontend/main-app/pages/UniversalAuthPage.tsx)

### Props

```typescript
interface UniversalAuthPageProps {
  onSuccess?: (role: UserRole, user: any) => void;
  onAdminLoginClick?: () => void;
}
```

### Flow

1. **Role Selection** - User picks from 7 icons (Patient, Therapist, Corporate, etc.)
2. **Login/Register** - Enter email/phone + choose mode
3. **OTP** - Receive + verify 6-digit code
4. **Redirect** - Route by role to specific onboarding or home

### States

```typescript
type AuthMode = 'role-select' | 'login' | 'register' | 'otp' | 'loading' | 'success';
```

### Key Methods

- `handleSendOtp()` - Call `/api/auth/send-otp`
- `handleVerifyOtp()` - Call `/api/auth/verify-otp`
- `handleBackToRoleSelect()` - Reset flow to role grid

---

## Admin Login (Existing)

**Location:** [frontend/main-app/admin/pages/AdminLogin.tsx](frontend/main-app/admin/pages/AdminLogin.tsx)

### Flow

1. **Primary Factor** - Email/Phone + Password or OTP
2. **MFA Challenge** - Show HOTP form
3. **Verify HOTP** - Call `/api/auth/admin-login/verify-mfa`
4. **Redirect** - Go to admin dashboard

### Security Features

✓ Fingerprint-locked (IP + User-Agent binding)  
✓ Family token tracking (prevents token family replay)  
✓ Refresh rotation (new token on every refresh)  
✓ Session-based logout (revokes entire family)

---

## Backend Endpoints

### Universal Auth (Non-Admin)

```
POST /api/auth/send-otp
  Input: { email_or_phone: string }
  Output: { success: bool, message: string }
  Errors: 400 invalid input, 429 rate limited

POST /api/auth/verify-otp
  Input: { email_or_phone: string, otp: string }
  Output: { success: bool, user: {id, email, role, ...}, token: string }
  Errors: 401 OTP invalid, 429 rate limited

POST /api/auth/register (Future)
  Input: { email, phone, full_name, password, role, plan }
  Output: { success: bool, user: {id, email, role, ...}, token: string }
  Errors: 409 user exists, 400 invalid data
```

### Admin Auth

```
POST /api/auth/admin-login
  Input: { email_or_phone: string, password?: string, otp?: string }
  Output: { success: bool, mfaToken: string, message: string }
  Errors: 401 credentials invalid, 429 rate limited

POST /api/auth/admin-login/verify-mfa
  Input: { mfaToken: string, hotp_code: string }
  Output: { success: bool, user: {id, email, role: 'admin', ...}, token: string }
  Errors: 401 HOTP invalid, 403 fingerprint mismatch

GET /api/auth/me (Protected)
  Output: { user: {...} }
  Errors: 401 unauthorized

POST /api/auth/logout
  Input: {}
  Output: { success: bool }
  Errors: 401 unauthorized

POST /api/auth/refresh
  Input: {}
  Output: { success: bool, token: string }
  Errors: 401 refresh token expired or revoked
```

---

## Integration with App.tsx

**Route Mapping:**

```typescript
// In ViewState type
'auth' | 'admin-login' | 'admin-dashboard'

// In VIEW_MAP
{
  'auth': 'auth',
  'admin/login': 'admin-login',
  'admin-dashboard': 'admin-dashboard',
}

// In render logic
{currentView === 'auth' && (
  <UniversalAuthPage 
    onSuccess={(role, user) => {
      // Save user data + navigate by role
      handleUpdateUser(user);
      const roleRoutes = {
        'patient': 'profile-setup',
        'therapist': 'therapist-onboarding',
        'corporate': 'corporate-wellness',
        'education': 'school-wellness',
        'healthcare': 'home',
        'insurance': 'home',
        'government': 'home'
      };
      navigate(roleRoutes[role]);
    }}
    onAdminLoginClick={() => navigate('admin/login')}
  />
)}

{currentView === 'admin-login' && <AdminApp />}
```

---

## Usage Examples

### Linking to Universal Auth

```typescript
// In Header.tsx or Footer
<button onClick={() => navigate('#/en/auth')}>
  Log In
</button>
```

### Linking to Admin Login

```typescript
// In UniversalAuthPage (built-in)
<button onClick={onAdminLoginClick}>
  🔐 Secure Admin Portal
</button>

// Or direct route
window.location.hash = '#/en/admin/login';
```

### Role-Based Redirect After Success

```typescript
const roleRoutes = {
  'patient': 'profile-setup',
  'therapist': 'therapist-onboarding',
  'corporate': 'corporate-wellness',
  'education': 'school-wellness',
  'healthcare': 'home',
  'insurance': 'home',
  'government': 'home'
};

navigate(roleRoutes[userRole] || 'home');
```

---

## Database Schema

### Users Table (Updated)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  role_id INT REFERENCES roles(id),
  role TEXT, -- text role for backward compat
  full_name VARCHAR(255),
  first_name VARCHAR(127),
  last_name VARCHAR(127),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Admin Login Challenges (Security)

```sql
CREATE TABLE admin_login_challenges (
  id SERIAL PRIMARY KEY,
  admin_id INT REFERENCES users(id),
  mfa_token VARCHAR(255) UNIQUE,
  ip_address INET,
  user_agent TEXT,
  hotp_code_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Refresh Tokens (with Family Tracking)

```sql
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  token_hash VARCHAR(255) UNIQUE,
  family_id UUID,
  parent_token_id INT REFERENCES refresh_tokens(id),
  replaced_by INT REFERENCES refresh_tokens(id),
  reuse_detected_at TIMESTAMP,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Security Checklist

### Admin Login
- [x] Password hashing (bcrypt)
- [x] OTP rate limiting (1 per 30s)
- [x] MFA challenge fingerprinting (IP + UA binding)
- [x] HOTP validation (TOTP-based 6-digit)
- [x] Refresh token rotation
- [x] Family-based replay detection
- [x] Logout revocation (entire family marked revoked)

### Universal Auth (OTP-only)
- [x] OTP rate limiting (1 per 30s, 5 retries)
- [x] Phone/Email verification
- [x] Refresh token rotation
- [x] Cookie-based session
- [x] CSRF token validation
- [x] Helmet security headers

### Shared
- [x] HTTPS enforcement (in production)
- [x] Secure cookies (HttpOnly, Secure, SameSite)
- [x] Rate limiting per IP
- [x] Brute force protection
- [x] Webhook signature validation
- [x] Idempotent event processing

---

## Testing

### Run Security Smoke Tests

```bash
npm run test:security-smoke
```

Expected output:
```
✓ Admin login initiated
✓ Admin MFA verified
✓ Protected route accessed
✓ Refresh token rotation works
✓ Replay detection triggered (401)
✓ Logout revokes family
✓ Post-logout refresh fails (401)
✓ Forged webhook rejected (401)

ok: true
```

### Manual Testing

**Universal Auth:**
1. Navigate to `#/en/auth`
2. Pick "Patient" → Enter email → Send OTP → Verify → Redirect to profile-setup

**Admin Login:**
1. Click "🔐 Secure Admin Portal"
2. Enter admin email + password
3. Click "Send MFA Code"
4. Enter HOTP code (from authenticator app or backend logs)
5. Verify → Redirect to admin dashboard

---

## Migration Path

### From Old to New

**Before:** LoginModal with role prop
```tsx
<LoginModal role={loginRole} />
```

**After:** Universal page + Admin separate
```tsx
{currentView === 'auth' && <UniversalAuthPage />}
{currentView === 'admin-login' && <AdminApp />}
```

### Backward Compatibility

Old `#/landing` route with LoginModal still works but now links to new `#/en/auth` universal page instead.

---

## Troubleshooting

### "OTP not received"
- Check rate limiting: 1 OTP per 30 seconds
- Verify email/phone is correct
- Check spam folder for email OTP

### "Admin MFA fails"
- Ensure authenticator app is synced (TOTP-based)
- Check that IP + User-Agent haven't changed
- Review admin_login_challenges table for fingerprint mismatch

### "Refresh token revoked unexpectedly"
- Check if logout was called
- Verify parent token family hasn't been revoked
- Look for reuse_detected_at in refresh_tokens table

---

## Related Documentation

- [Backend Unification Implementation](BACKEND_UNIFICATION_IMPLEMENTATION.md)
- [Security Smoke Test Evidence](SECURITY_SMOKE_EVIDENCE.md)
- [Release Signoff Checklist](RELEASE_SIGNOFF_CHECKLIST.md)
- [Deployment & Operations](DEPLOYMENT_AND_OPERATIONS.md)

---

## Summary

✅ **Modular:** Universal page for 7 roles, admin separate and hardened  
✅ **Secure:** HOTP MFA, refresh rotation, replay detection, webhook validation  
✅ **Tested:** Smoke tests validated end-to-end  
✅ **Scalable:** Role-based routing infrastructure ready for 9+ user types  
✅ **Documented:** Full architecture + endpoints + schema  

---

**Last Updated:** 2025-02-27  
**Next Steps:** Monitor admin MFA adoption, gather user feedback on universal auth UX

# Universal Auth - Quick Reference Card

**Status:** ✅ Implementation Complete | Build ✅ | Security Tests ✅  

---

## Navigation Routes

```bash
# Landing Page
https://manas360.com/
  ↓
  "Log In" button → #/en/auth

# Universal Auth Page (7 roles)
#/en/auth
  ├─ Patient → profile-setup
  ├─ Therapist → therapist-onboarding  
  ├─ Corporate → corporate-wellness
  ├─ Education → school-wellness
  └─ Health/Insurance/Gov → home

# Admin MFA Login (2-step)
#/en/admin/login
  └─ [Credentials] → [MFA Code] → admin-dashboard

# Admin Dashboard
#/en/admin-dashboard
  └─ Analytics, Users, Settings
```

---

## API Endpoints

### Send OTP (Non-Admin)
```bash
POST /api/auth/send-otp
Content-Type: application/json

{
  "email_or_phone": "patient@example.com"  or  "+919876543210"
}

Response (200):
{
  "success": true,
  "message": "OTP sent to email"
}

Error (429):
{
  "success": false,
  "message": "Rate limit: try again in 30s"
}
```

### Verify OTP & Login
```bash
POST /api/auth/verify-otp
Content-Type: application/json
Cookie: csrf_token=...

{
  "email_or_phone": "patient@example.com",
  "otp": "123456"
}

Response (200):
Set-Cookie: access_token=...; HttpOnly
Set-Cookie: refresh_token=...; HttpOnly
Set-Cookie: csrf_token=...; (regular cookie)

{
  "success": true,
  "user": {
    "id": 123,
    "email": "patient@example.com",
    "role": "patient",
    "full_name": "John Doe"
  }
}

Error (401):
{
  "success": false,
  "message": "Invalid OTP"
}
```

### Admin Login (Step 1: Get MFA Token)
```bash
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "securepassword"
  # OR
  # "phone": "+919876543210",
  # "otp": "123456"
}

Response (200):
{
  "success": true,
  "mfaToken": "uuid-token-here"
}

Error (401):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Admin MFA Verify (Step 2: Get Session Token)
```bash
POST /api/auth/admin-login/verify-mfa
Content-Type: application/json

{
  "mfaToken": "uuid-from-step-1",
  "hotp_code": "123456"
}

Response (200):
Set-Cookie: access_token=...; HttpOnly
Set-Cookie: refresh_token=...; HttpOnly
Set-Cookie: csrf_token=...; (regular cookie)

{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}

Error (401):
{
  "success": false,
  "message": "HOTP code invalid"
}

Error (403):
{
  "success": false,
  "message": "Fingerprint mismatch (IP/UA changed)"
}
```

### Get Current User
```bash
GET /api/auth/me
Cookie: access_token=...; csrf_token=...
X-CSRF-Token: <csrf-token-value>

Response (200):
{
  "user": {
    "id": 123,
    "email": "user@example.com",
    "role": "patient"
  }
}

Error (401):
{
  "success": false,
  "message": "Unauthorized"
}
```

### Refresh Token
```bash
POST /api/auth/refresh
Cookie: refresh_token=...; csrf_token=...
X-CSRF-Token: <csrf-token-value>

Response (200):
Set-Cookie: access_token=...; HttpOnly (NEW)
Set-Cookie: refresh_token=...; HttpOnly (NEW, rotated)
Set-Cookie: csrf_token=...;

{
  "success": true,
  "token": "new-access-token"
}

Error (401):
{
  "success": false,
  "message": "Token revoked or expired"
}

Error (401):
{
  "success": false,
  "message": "Token reuse detected - family revoked"
}
```

### Logout
```bash
POST /api/auth/logout
Cookie: access_token=...; refresh_token=...; csrf_token=...
X-CSRF-Token: <csrf-token-value>

Response (200):
Set-Cookie: access_token=; expires=0;  (clear)
Set-Cookie: refresh_token=; expires=0;  (clear)
Set-Cookie: csrf_token=; expires=0;  (clear)

{
  "success": true
}

# After logout, all tokens in family are revoked
# Refresh token reuse will fail (family marked revoked_at)
```

---

## React Component Usage

### Import UniversalAuthPage
```tsx
import { UniversalAuthPage } from '../pages/UniversalAuthPage';

export function App() {
  return (
    <div>
      {currentView === 'auth' && (
        <UniversalAuthPage 
          onSuccess={(role, user) => {
            // Handle successful login
            console.log(`${role} logged in:`, user);
            
            // Save user to context
            setUser(user);
            
            // Navigate by role
            const routes = {
              'patient': 'profile-setup',
              'therapist': 'therapist-onboarding',
              'corporate': 'corporate-wellness',
              'education': 'school-wellness',
              'healthcare': 'home',
              'insurance': 'home',
              'government': 'home'
            };
            navigate(routes[role] || 'home');
          }}
          onAdminLoginClick={() => {
            // Navigate to admin MFA page
            navigate('#/en/admin/login');
          }}
        />
      )}
    </div>
  );
}
```

### useAuth Hook (Get User)
```tsx
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.full_name}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Database Schema (Core Tables)

### Users Table
```sql
SELECT * FROM users WHERE id = 123;

id          | 123
email       | patient@example.com
phone_number| +919876543210
password_hash| (bcrypt hash, only for admin)
role_id     | 2 (FK to roles table)
role        | 'patient' (text, for backward compat)
full_name   | John Doe
first_name  | John
last_name   | Doe
is_verified | TRUE
is_active   | TRUE
created_at  | 2025-02-27 10:30:00
updated_at  | 2025-02-27 10:30:00
deleted_at  | NULL
```

### Refresh Tokens Table
```sql
SELECT * FROM refresh_tokens WHERE family_id = 'fam-uuid-123' ORDER BY created_at;

id              | 500
user_id         | 123
token_hash      | (sha256 hash)
family_id       | fam-uuid-123
parent_token_id | NULL (first token in family)
replaced_by     | 501 (next token_id in family)
reuse_detected_at| NULL (only set if reuse detected)
ip_address      | 203.0.113.1
user_agent      | Mozilla/5.0 ...
expires_at      | 2025-03-06 10:30:00 (7 days)
revoked_at      | NULL (set on logout)
created_at      | 2025-02-27 10:30:00

id              | 501  (Second token - rotated)
user_id         | 123
token_hash      | (new sha256 hash)
family_id       | fam-uuid-123 (same family)
parent_token_id | 500 (previous token)
replaced_by     | NULL (latest)
reuse_detected_at| NULL
ip_address      | 203.0.113.1
user_agent      | Mozilla/5.0 ...
expires_at      | 2025-03-07 10:31:00 (7 days from refresh)
revoked_at      | NULL
created_at      | 2025-02-27 10:31:00
```

### Admin Login Challenges Table
```sql
SELECT * FROM admin_login_challenges WHERE admin_id = 1 ORDER BY created_at DESC LIMIT 1;

id                    | 999
admin_id              | 1
mfa_token             | chal-uuid-456 (one-time challenge token)
ip_address            | 203.0.113.42
user_agent            | Mozilla/5.0 ...
hotp_code_verified    | TRUE (set after HOTP verification)
expires_at            | 2025-02-27 10:35:00 (5 min from creation)
created_at            | 2025-02-27 10:30:00
```

---

## Cookie Management

### After Successful Login
```
Set-Cookie: access_token=eyJhbGc...; 
  HttpOnly; 
  Secure; 
  SameSite=Strict; 
  Max-Age=900 (15 minutes)

Set-Cookie: refresh_token=eyJhbGc...; 
  HttpOnly; 
  Secure; 
  SameSite=Strict; 
  Max-Age=604800 (7 days)

Set-Cookie: csrf_token=abc123xyz; 
  Secure; 
  SameSite=Strict; 
  Max-Age=604800 (7 days)
  # NOT HttpOnly, so JS can read it for X-CSRF-Token header
```

### Browser DevTools → Application → Cookies
```
Domain: localhost
  access_token    | ...3a6J (HttpOnly ✓, Secure ✓, SameSite ✓)
  refresh_token   | ...9kL2 (HttpOnly ✓, Secure ✓, SameSite ✓)
  csrf_token      | abc123  (Secure ✓, SameSite ✓, NOT HttpOnly - intentional)
```

### Manual Requests (curl)
```bash
# Include all cookies
curl http://localhost:5001/api/auth/me \
  -b "access_token=..." \
  -b "refresh_token=..." \
  -b "csrf_token=..." \
  -H "X-CSRF-Token: abc123"

# OR let curl auto-include cookies from a previous Set-Cookie
curl -b "cookies.jar" -c "cookies.jar" http://localhost:5001/api/auth/me
```

---

## Security Checklist (Post-Login)

- [x] **Cookies Secure**
  ```js
  // Check in browser console
  document.cookie
  // Should show: "access_token=...HttpOnly not visible"
  // csrf_token visible for reading
  ```

- [x] **CSRF Validation**
  ```bash
  # Request WITHOUT X-CSRF-Token header fails
  curl -X POST http://localhost:5001/api/auth/logout
  # Response: 403 CSRF validation failed
  ```

- [x] **Token Rotation**
  ```sql
  -- After refresh, check two tokens in family
  SELECT parent_token_id, replaced_by FROM refresh_tokens 
  WHERE family_id = 'fam-uuid-123' ORDER BY created_at;
  -- Should show chain: NULL → 501, 500 → NULL
  ```

- [x] **Replay Detection**
  ```bash
  # Reuse old refresh token
  curl -X POST http://localhost:5001/api/auth/refresh \
    -b "refresh_token=<OLD_TOKEN>"
  # Response: 401 Token reuse detected
  
  # Check DB - entire family marked revoked
  SELECT familiy_id FROM refresh_tokens 
  WHERE reuse_detected_at IS NOT NULL;
  ```

- [x] **Logout Revocation**
  ```bash
  # After logout
  curl -X POST http://localhost:5001/api/auth/refresh \
    -b "refresh_token=<ANY_TOKEN_FROM_FAMILY>"
  # Response: 401 Token revoked
  ```

---

## Troubleshooting

### "OTP not received"
- Check rate limit: 1 OTP per 30 seconds
- Verify email/phone is correct
- Check spam/promotions folder (email)
- Check backend logs: `tail -f backend/logs/app.log | grep OTP`

### "Invalid OTP" error
- OTP expires after 10 minutes
- OTP has 5 attempt limit before rate-limiting
- Check you're entering exactly 6 digits
- Verify OTP matches sent value

### "HOTP code invalid" (Admin)
- HOTP is time-based (TOTP algorithm)
- Check device time is synced with server
- Code is valid for 60s window (±30s buffer)
- Check authenticator app is using correct secret

### "Fingerprint mismatch" (Admin)
- IP address or User-Agent changed since login
- Check if proxy/VPN activated
- Clear browser cookies and retry
- Check IP whitelisting if behind corporate firewall

### "Token revoked" on refresh
- Session was logged out
- Token family was revoked (replay detected)
- Check `refresh_tokens.revoked_at` is NULL in DB
- Try logging in again

### "CSRF validation failed"
- X-CSRF-Token header missing on POST request
- CSRF token value incorrect
- Check header spelling: `X-CSRF-Token` (not `X-CSRF-TOKEN`)

---

## Files to Remember

| File | Purpose |
|------|---------|
| [frontend/main-app/pages/UniversalAuthPage.tsx](frontend/main-app/pages/UniversalAuthPage.tsx) | Main auth component |
| [frontend/main-app/admin/pages/AdminLogin.tsx](frontend/main-app/admin/pages/AdminLogin.tsx) | Admin MFA page |
| [frontend/main-app/contexts/AuthContext.tsx](frontend/main-app/contexts/AuthContext.tsx) | Auth state (useAuth hook) |
| [frontend/main-app/App.tsx](frontend/main-app/App.tsx) | App router (auth view) |
| [backend/src/controllers/authUnifiedController.js](backend/src/controllers/authUnifiedController.js) | Auth endpoints |
| [backend/src/middleware/authMiddleware-unified.js](backend/src/middleware/authMiddleware-unified.js) | Token validation |
| [UNIVERSAL_AUTH_ARCHITECTURE.md](UNIVERSAL_AUTH_ARCHITECTURE.md) | Full reference |
| [UNIVERSAL_AUTH_QA_CHECKLIST.md](UNIVERSAL_AUTH_QA_CHECKLIST.md) | Test guide (200+ items) |

---

## Test Commands

```bash
# Build
npm run build                    # ✅ Should pass (10.48s)

# Security test
npm run test:security-smoke     # ✅ Should pass (ok=true, 8/8)

# Dev server
npm run dev                      # Starts Vite + backend on 3000 & 5001

# Health check
curl http://localhost:5001/health
# {"status":"OK"}

# Send OTP
curl -X POST http://localhost:5001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
# {"success":true,"message":"OTP sent"}
```

---

## Key Numbers

| Value | Meaning |
|-------|---------|
| 7 | Non-admin user types supported |
| 1 | Admin type (separate MFA) |
| 6 | Digits in OTP code |
| 10 | OTP validity in minutes |
| 30 | OTP resend cooldown in seconds |
| 5 | Max OTP verify attempts |
| 15 | Access token expiry in minutes |
| 7 | Refresh token expiry in days |
| 30 | MFA code window size in seconds |
| 100+ | Rate limit per IP (req/min) |

---

**Version:** 1.0  
**Last Updated:** 2025-02-27  
**Status:** Ready for Deployment 🚀

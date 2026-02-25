# Universal Auth Implementation - Quick Start

**Status:** ✅ Implemented & Tested  
**Build:** ✅ Production build passes  
**Security:** ✅ Admin MFA validated via smoke tests  

---

## What Was Built

### 1. Universal Auth Page Component
**File:** [frontend/main-app/pages/UniversalAuthPage.tsx](frontend/main-app/pages/UniversalAuthPage.tsx)

A single, role-aware login/register page supporting 7 non-admin user types:
- **Patient** (Individual mental health user)
- **Therapist** (Provider)
- **Corporate** (Employee wellness program)
- **Education** (School/College admin)
- **Healthcare** (Clinic/Hospital)
- **Insurance** (Partner portal)
- **Government** (Tele-MANAS/ASHA)

**Flow:**
```
Role Selection → Login/Register Form → OTP Verification → Role-Based Redirect
```

### 2. Admin Login Stays Separate
**File:** [frontend/main-app/admin/pages/AdminLogin.tsx](frontend/main-app/admin/pages/AdminLogin.tsx) (existing)

- Dedicated route: `#/en/admin/login`
- 2-step MFA (Primary Factor + HOTP Code)
- No public signup allowed
- Secure fingerprinting (IP + UA bound)

### 3. App.tsx Integration
**File:** [App.tsx](App.tsx) (updated)

Added:
- Import `UniversalAuthPage` component
- New route: `auth` view state
- Handler linking universal page success to role-specific redirects
- Button linking to admin portal (visible only in universal page)

---

## User Journey

### Patient
```
Landing Page
    ↓
"Log In" Button → #/en/auth
    ↓
Select "Patient" Role
    ↓
Enter Email → Send OTP → Verify
    ↓
Redirect to #/en/profile-setup
```

### Therapist
```
Landing Page
    ↓
"Log In" Button → #/en/auth
    ↓
Select "Therapist" Role
    ↓
Enter Email → Send OTP → Verify
    ↓
Redirect to #/en/therapist-onboarding
```

### Admin
```
Landing Page
    ↓
"🔐 Secure Admin Portal" (visible on universal auth page)
    ↓
Direct to #/en/admin/login
    ↓
Enter Credentials → Get mfaToken
    ↓
Enter HOTP Code → Verify
    ↓
Redirect to #/en/admin-dashboard
```

---

## How to Use

### 1. Landing Page Login Button
Currently routes to old modal. To update, modify Header.tsx:

```typescript
// Before
const handleLoginClick = () => {
  setShowLandingLogin(true);
};

// After
const handleLoginClick = () => {
  navigate('#/en/auth'); // Route to universal auth page
};
```

### 2. Direct Navigation
```typescript
// Patient/Non-Admin Users
window.location.hash = '#/en/auth';

// Admin
window.location.hash = '#/en/admin/login';
```

### 3. Programmatic Redirect After Auth
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

const userRole = response.user.role;
navigate(roleRoutes[userRole] || 'home');
```

---

## Backend Endpoints Used

### Universal Auth (OTP-based)
```bash
# Send OTP
POST /api/auth/send-otp
{
  "email_or_phone": "user@example.com"
}

# Verify OTP & Login
POST /api/auth/verify-otp
{
  "email_or_phone": "user@example.com",
  "otp": "123456"
}
```

### Admin Auth (MFA-required)
```bash
# Step 1: Initiate Admin Login
POST /api/auth/admin-login
{
  "email": "admin@example.com",
  "password": "securepassword"
  // OR
  // "phone": "+919876543210",
  // "otp": "123456"
}

# Step 2: Verify HOTP Code
POST /api/auth/admin-login/verify-mfa
{
  "mfaToken": "<from-step-1>",
  "hotp_code": "123456"
}
```

---

## Architecture Benefits

| Feature | Benefit |
|---------|---------|
| **Universal Page** | One consistent auth UX for 7 user types; easier to update styling/flow |
| **Admin Separate** | MFA enforced; admin not exposed in public role selector |
| **OTP-only** | No password storage for non-admin users; lower compliance burden |
| **Token Rotation** | Refresh tokens are one-time-use with family tracking |
| **Replay Detection** | Reused tokens automatically revoke entire family |
| **Fingerprinting** | MFA challenge locked to IP + User-Agent (admin) |
| **Logout Revocation** | One logout revokes all active sessions (family) |

---

## Testing

### Verify Build
```bash
npm run build
# ✓ built in 10.48s
```

### Test Universal Auth (Manual)
1. Open `#/en/auth`
2. Click "Patient" → Enter email → Send OTP
3. Verify 6-digit code
4. Should redirect to profile-setup page

### Test Admin Login (Manual)
1. On universal auth page, click "🔐 Secure Admin Portal"
2. Or navigate directly to `#/en/admin/login`
3. Enter admin email + password (or phone + OTP)
4. Should show "Enter MFA Code" form
5. Get HOTP code from authenticator app (or backend logs in dev)
6. Enter code → Should redirect to admin dashboard

### Test Security (Automated)
```bash
npm run test:security-smoke
# Expected: ok: true (all 8 checks pass)
```

---

## File Changes Summary

### Created
- ✅ `frontend/main-app/pages/UniversalAuthPage.tsx` (450 lines)
- ✅ `UNIVERSAL_AUTH_ARCHITECTURE.md` (comprehensive guide)
- ✅ `UNIVERSAL_AUTH_QUICK_START.md` (this file)

### Modified
- ✅ `App.tsx` - Added import, route, and view state
- ✅ `View routing` - Added 'auth' route mapping

### Existing (No Changes)
- AdminLogin.tsx (already built, just wired up)
- AuthContext.tsx (already handles both flows)
- authUnifiedController.js (already handles both endpoints)
- Database migrations (already applied)

---

## Next Steps

### Short-term (MVP)
1. ✅ Universal auth page built
2. ✅ Admin login integrated
3. Next: Update Landing Page links to use universal auth page instead of modal
4. Next: Remove old LoginModal if not needed elsewhere

### Medium-term (Enhanced)
1. Add role-specific branding in universal page
2. Add plan selection UI for enterprise roles (Corporate, Healthcare)
3. Implement email verification step
4. Add password reset flow for admin

### Long-term (Scale)
1. Multi-language support in auth page
2. Social login buttons (same as old modal)
3. Single sign-on (SSO) for Corporate
4. Biometric login for mobile app
5. Magic link (passwordless) login

---

## Common Questions

**Q: Why is admin separate?**  
A: Admin requires MFA (mandatory security), different credentials (password not OTP), and should not appear in public role picker.

**Q: What if user picks wrong role?**  
A: They can click "← Back" to return to role selector. Old data is not saved.

**Q: Does OTP work for phone and email?**  
A: Yes, user enters email or phone, system detects format and sends OTP appropriately.

**Q: What about password reset for non-admin?**  
A: Non-admin users don't have passwords; OTP is their auth. No reset needed.

**Q: Can I customize colors/branding per role?**  
A: Yes, `ROLE_OPTIONS` array has `color` field for each role. Update in `UniversalAuthPage.tsx` line ~70.

**Q: How do I update role redirects?**  
A: In `App.tsx`, update `roleRoutes` object inside the `{currentView === 'auth'}` handler (line ~490).

---

## Rollback Plan

If you need to revert to old modal-based auth:

```bash
# Undo App.tsx changes
git checkout HEAD~1 -- App.tsx

# Remove UniversalAuthPage.tsx
rm frontend/main-app/pages/UniversalAuthPage.tsx
```

---

## Support

For issues or questions:
1. Check [UNIVERSAL_AUTH_ARCHITECTURE.md](UNIVERSAL_AUTH_ARCHITECTURE.md) for full details
2. Review [SECURITY_SMOKE_EVIDENCE.md](SECURITY_SMOKE_EVIDENCE.md) for validation results
3. Check backend logs: `tail -f backend/logs/app.log`

---

**Version:** 1.0  
**Last Updated:** 2025-02-27  
**Status:** Ready for QA  

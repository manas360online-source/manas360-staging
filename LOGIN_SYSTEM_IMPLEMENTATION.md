# Login System - Complete Implementation Guide

## 🎯 Overview

Manas360 implements a **dual-path authentication system**:

1. **UniversalAuthPage** - For 7 non-admin user types (OTP-based)
2. **Admin Login** - For system administrators (Password + HOTP MFA)

---

## 📍 Where Each Component Lives

### 1. Landing Page (Entry Point)

**File:** [App.tsx](App.tsx#L462-L495)
**View State:** `currentView === 'landing'`
**Components:**
- BackgroundParticles
- Header (with Login button)
- Hero
- TrustBar
- HowItWorks
- Testimonial
- FinalCTA

**What It Does:**
- Shows marketing content
- Header has "Login" button that navigates to `/auth`
- Shows login modal on landing page (optional)

**Login Button Behavior:**
```typescript
onLoginClick={(role) => {
  setLoginRole(role || null);
  setShowLandingLogin(true);  // Shows LoginModal
  // OR should navigate to 'auth' directly
  navigate('auth');
}}
```

---

### 2. UniversalAuthPage (Main Auth Component)

**File:** [frontend/main-app/pages/UniversalAuthPage.tsx](frontend/main-app/pages/UniversalAuthPage.tsx) (457 lines)

**View State:** `currentView === 'auth'`

**Route:** `/auth`

**Props:**
```typescript
interface UniversalAuthPageProps {
  onSuccess: (role: string, user: UserData) => void;
  onAdminLoginClick?: () => void;
}
```

**Features:**
- 7 role selection icons (Patient, Therapist, Corporate, Education, Healthcare, Insurance, Government)
- Email/Phone OTP login
- 6-digit OTP verification
- Admin login link
- Role-specific redirects on success

**Auth Modes:**
- `'role-select'` - Shows 7 roles to choose from
- `'login'` - Email/phone input form
- `'otp'` - OTP entry field
- `'success'` - Success confirmation
- `'loading'` - API call in progress

**Core Logic:**
```typescript
const [authMode, setAuthMode] = useState<AuthMode>('role-select');
const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
const [email, setEmail] = useState('');
const [otp, setOtp] = useState('');

// When user selects role:
const handleRoleSelect = (role: UserRole) => {
  setSelectedRole(role);
  setAuthMode('login');  // Show email input
};

// When user enters email:
const handleSendOTP = async () => {
  // API: POST /api/auth/send-otp
  // Send OTP to email
};

// When user enters OTP:
const handleVerifyOTP = async () => {
  // API: POST /api/auth/verify-otp
  // Verify and get tokens
  // Call onSuccess if verified
};

// When user clicks admin link:
const handleAdminClick = () => {
  if (onAdminLoginClick) {
    onAdminLoginClick();  // App.tsx does navigate('admin/login')
  }
};
```

**Styling:**
- Dark mode compatible
- Responsive grid for 7 role icons
- Color-coded by role (blue, green, purple, yellow, red, indigo, gray)
- Loading spinners and error handling

**API Endpoints:**
- `POST /api/auth/send-otp` - Send OTP code
- `POST /api/auth/verify-otp` - Verify OTP and create session

---

### 3. Header Component (Login Button)

**File:** [frontend/main-app/components/Header.tsx](frontend/main-app/components/Header.tsx)

**Props:**
```typescript
interface HeaderProps {
  onLoginClick?: (role?: string) => void;
}
```

**Features:**
- Navigation bar (persistent across all pages)
- Logo/brand link
- Menu items (About, Contact, etc.)
- Login/Signup buttons
- LoginDropdown with role selector (optional)

**LoginDropdown:**
- Shows when user clicks [Login]
- Lists optional role shortcuts (Patient, Therapist, etc.)
- Each option calls `onLoginClick(role)`
- Used on landing page only

**Integration:**
```typescript
// In App.tsx landing section:
<Header
  onLoginClick={(role) => {
    setLoginRole(role || null);
    navigate('auth');  // Go to UniversalAuthPage
  }}
/>
```

---

### 4. Admin Login Page (TBD)

**File:** SHOULD BE `frontend/main-app/pages/AdminLoginPage.tsx` (not created yet)

**View State:** `currentView === 'admin/login'`

**Route:** `/admin/login`

**What It Should Do:**
1. Show admin login form
   - Email input
   - Password input
   - [Login] button

2. On submit:
   - API: `POST /api/auth/admin-login`
   - Server returns mfaToken + challenge

3. Show MFA form
   - HOTP code input
   - [Verify] button

4. On MFA verify:
   - API: `POST /api/auth/verify-mfa`
   - Server returns accessToken + refreshToken
   - Navigate to `/admin-dashboard`

**Template:**
```typescript
import React, { useState } from 'react';

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ 
  onSuccess, 
  onBackClick 
}) => {
  const [stage, setStage] = useState<'login' | 'mfa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hotp, setHotp] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async () => {
    // API call: POST /api/auth/admin-login
    // On success: setMfaToken, setStage('mfa')
  };

  const handleMFAVerify = async () => {
    // API call: POST /api/auth/verify-mfa
    // On success: call onSuccess
  };

  return (
    <div className="admin-login-container">
      {stage === 'login' && (
        <form onSubmit={handleAdminLogin}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">{loading ? 'Loading...' : 'Login'}</button>
        </form>
      )}

      {stage === 'mfa' && (
        <form onSubmit={handleMFAVerify}>
          <p>Enter HOTP code from authenticator app</p>
          <input value={hotp} onChange={(e) => setHotp(e.target.value)} maxLength="6" />
          <button type="submit">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      )}

      {error && <div className="error">{error}</div>}
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
```

---

### 5. Admin Dashboard

**File:** [frontend/main-app/admin/App.tsx](frontend/main-app/admin/App.tsx)

**View State:** `currentView === 'admin-dashboard'`

**Route:** `/admin-dashboard`

**Components:**
- Admin navigation
- User management
- Analytics
- Settings
- Support tickets
- Audit logs
- Etc.

**Access Control:**
- Only admin users can access
- Requires valid JWT token with `role: 'admin'`
- Protected routes verify token on every page load

---

## 🔄 Complete Data Flow

### Non-Admin User (OTP Flow)

```
1. Landing Page ➜ User clicks [Login]
   ↓
2. App.tsx ➜ Sets currentView = 'auth'
   ↓
3. UniversalAuthPage ➜ Renders 7 role icons
   ↓
4. User selects role (e.g., Patient)
   ↓
5. UniversalAuthPage ➜ authMode = 'login'
   ↓
6. User enters email + clicks [Send OTP]
   ↓
7. API: POST /api/auth/send-otp
   ├─ Backend: Generate 6-digit OTP
   ├─ Backend: Send to email
   └─ Backend: Cache OTP for 10 minutes
   ↓
8. UniversalAuthPage ➜ authMode = 'otp'
   ↓
9. User receives email with OTP code
   ↓
10. User enters OTP code
    ↓
11. API: POST /api/auth/verify-otp
    ├─ Backend: Validate OTP
    ├─ Backend: Create user if first-time
    ├─ Backend: Generate JWT tokens
    │  ├─ accessToken (15 min)
    │  ├─ refreshToken (7 days)
    │  └─ idempotencyToken (for idempotent ops)
    └─ Backend: Return tokens
    ↓
12. Frontend: Store tokens in localStorage
    ├─ localStorage.setItem('accessToken', token)
    ├─ localStorage.setItem('refreshToken', token)
    └─ Set authContext state
    ↓
13. UniversalAuthPage ➜ Call onSuccess(role, userData)
    ↓
14. App.tsx ➜ Handle redirect by role
    ├─ patient → currentView = 'profile-setup'
    ├─ therapist → currentView = 'therapist-onboarding'
    └─ etc.
    ↓
15. Role-specific dashboard loads
```

### Admin User (Password + MFA Flow)

```
1. Landing Page ➜ User clicks [Login]
   ↓
2. App.tsx ➜ Sets currentView = 'auth'
   ↓
3. UniversalAuthPage ➜ Renders 7 roles + Admin link
   ↓
4. User clicks [Admin Login for System Admin]
   ↓
5. App.tsx ➜ Sets currentView = 'admin/login'
   ↓
6. AdminLoginPage ➜ Renders email + password form
   ↓
7. User enters email + password, clicks [Login]
   ↓
8. API: POST /api/auth/admin-login
   ├─ Backend: Check email in database
   ├─ Backend: Verify password (bcrypt)
   ├─ Backend: Check role === 'admin'
   ├─ Backend: Generate mfaToken (temporary)
   └─ Backend: Return mfaToken + MFA challenge
   ↓
9. AdminLoginPage ➜ Stage = 'mfa'
   ↓
10. AdminLoginPage ➜ Renders HOTP code input
    ├─ Instructions: "Open Authenticator App"
    └─ Show: Google Authenticator, Microsoft Authenticator, Authy
    ↓
11. User opens authenticator app on phone/desktop
    ↓
12. User reads 6-digit HOTP code from app
    ↓
13. User enters HOTP code
    ↓
14. API: POST /api/auth/verify-mfa
    ├─ Backend: Verify HOTP token
    ├─ Backend: Check time-window (±30 sec)
    ├─ Backend: Generate full JWT tokens
    │  ├─ accessToken (15 min)
    │  ├─ refreshToken (7 days)
    │  └─ idempotencyToken
    └─ Backend: Return tokens
    ↓
15. Frontend: Store tokens in localStorage
    ↓
16. App.tsx ➜ Sets currentView = 'admin-dashboard'
    ↓
17. Admin Dashboard ➜ Full access to all admin functions
```

---

## 🔌 API Endpoints

### Public (No Auth Required)

```
POST /api/auth/send-otp
├─ Body: { email: string, role?: string }
└─ Response: { success: bool, message: string }

POST /api/auth/verify-otp
├─ Body: { email: string, otp: string }
├─ Response: {
│   success: bool,
│   accessToken: string,
│   refreshToken: string,
│   user: { id, email, role }
│ }
└─ Errors: { code, message }

POST /api/auth/admin-login
├─ Body: { email: string, password: string }
├─ Response: {
│   success: bool,
│   mfaToken: string (temporary),
│   message: string
│ }
└─ Errors: Invalid credentials

POST /api/auth/verify-mfa
├─ Body: { mfaToken: string, hotp: string }
├─ Response: {
│   success: bool,
│   accessToken: string,
│   refreshToken: string,
│   user: { id, email, role: 'admin' }
│ }
└─ Errors: Invalid HOTP
```

### Protected (Auth Required)

```
POST /api/auth/logout
├─ Headers: Authorization: Bearer <accessToken>
└─ Response: { success: bool }

POST /api/auth/refresh
├─ Body: { refreshToken: string }
├─ Response: { accessToken: string, refreshToken: string }
└─ Used for token refresh before expiry

GET /api/auth/me
├─ Headers: Authorization: Bearer <accessToken>
└─ Response: { user: { id, email, role, ... } }
```

---

## 🚀 How to Test Each Flow

### Test Non-Admin Login

```bash
# 1. Open app
http://localhost:3000

# 2. Click Login button
# See: UniversalAuthPage with 7 roles

# 3. Click "Patient Login"
# See: Email input form

# 4. Enter test email
patient@manas360.com

# 5. Click "Send OTP"
# Check: Email for OTP code (printed in console or sent actually)

# 6. Enter OTP code
123456  (or whatever was sent)

# 7. Click "Verify OTP"
# Result: Redirect to /profile-setup
```

### Test Admin Login

```bash
# 1. On UniversalAuthPage, scroll down
# See: "Admin Login for System Admin" link

# 2. Click admin login link
# Navigate to: /admin/login

# 3. Enter credentials
Email: admin@manas360.com
Password: admin@123

# 4. Click "Login"
# See: HOTP challenge

# 5. Open Google Authenticator or similar
# Get 6-digit code

# 6. Enter HOTP code
123456  (from authenticator app)

# 7. Click "Verify"
# Result: Redirect to /admin-dashboard
```

---

## 📋 Checklist for Implementation

### Core Components ✅
- [x] Landing page with Header
- [x] Header with Login button
- [x] UniversalAuthPage with 7 roles
- [ ] AdminLoginPage (needs creation)
- [x] Admin Dashboard (exists)

### API Endpoints ✅
- [x] POST /api/auth/send-otp
- [x] POST /api/auth/verify-otp
- [x] POST /api/auth/admin-login
- [x] POST /api/auth/verify-mfa
- [x] POST /api/auth/logout (optional)

### Routes in App.tsx ✅
- [x] 'landing' → Landing Page
- [x] 'auth' → UniversalAuthPage
- [ ] 'admin/login' → AdminLoginPage (needs creation)
- [x] 'admin-dashboard' → Admin Dashboard

### Tokens & Storage ✅
- [x] accessToken in localStorage
- [x] refreshToken in localStorage
- [x] Token refresh logic
- [x] Logout clears tokens

### Error Handling ✅
- [x] Invalid email
- [x] Expired OTP
- [x] Wrong OTP code
- [x] Invalid admin credentials
- [x] Invalid MFA code
- [x] Network errors

### User Experience ✅
- [x] Loading states
- [x] Error messages
- [x] Success messages
- [x] Countdown timer for OTP
- [x] Resend OTP link
- [x] Dark mode support
- [x] Mobile responsive

---

## 📁 File Structure

```
manas360-ui-main/
├── App.tsx (main router)
├── frontend/
│   └── main-app/
│       ├── components/
│       │   ├── Header.tsx (Login button)
│       │   ├── LoginModal.tsx (optional modal)
│       │   └── [other components]
│       │
│       ├── pages/
│       │   ├── UniversalAuthPage.tsx ✅ (457 lines)
│       │   ├── AdminLoginPage.tsx (TODO - needs creation)
│       │   └── [other pages]
│       │
│       └── admin/
│           ├── App.tsx (admin dashboard)
│           └── [admin pages]
│
└── backend/
    └── routes/
        └── auth.js (API endpoints)
```

---

## ✨ Summary

**User Journey:**
1. **Landing Page** → Intro/marketing
2. **Click Login** → UniversalAuthPage
3. **Select Role** → Email/OTP form
4. **Enter OTP** → Role-specific dashboard

**Admin Journey:**
1. **Landing Page** → Intro
2. **Click Login** → UniversalAuthPage
3. **Click Admin Link** → Admin login form
4. **Enter Password** → MFA challenge
5. **Enter HOTP** → Admin dashboard

**Key Files:**
- UniversalAuthPage: `frontend/main-app/pages/UniversalAuthPage.tsx` ✅
- AdminLoginPage: TBD (needs creation)
- Admin Dashboard: `frontend/main-app/admin/App.tsx` ✅
- Router: `App.tsx` ✅

**Status:**
- Non-admin flow: ✅ Complete
- Admin flow: ⚠️ Needs AdminLoginPage component

---

**Next Steps:**
1. Create AdminLoginPage component
2. Update App.tsx to route 'admin/login' to AdminLoginPage
3. Test full login flows for both user types
4. Deploy with confidence!

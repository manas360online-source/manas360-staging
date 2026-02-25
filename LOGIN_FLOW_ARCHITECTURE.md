# Login Flow Architecture - Complete Guide

## 📍 Current Login Flow

### Page Structure Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          MANAS360 APP                                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐          ┌──────────▼──────────┐
            │  Landing Page  │          │  Auth Pages         │
            │ (Intro/Home)   │          │  (Login Flows)      │
            └───────┬────────┘          └─────────┬───────────┘
                    │ "Login"                      │
                    │ button                       │
                    │                              │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  UniversalAuthPage          │
                    │  (7 user type roles)        │
                    │                              │
                    │ • Patient                    │
                    │ • Therapist                  │
                    │ • Corporate                  │
                    │ • Education                  │
                    │ • Healthcare                 │
                    │ • Insurance                  │
                    │ • Government                 │
                    │                              │
                    │ [Admin Login Link]  ◄──────┐ │
                    └──────────────┬───────────────┘ │
                                   │                 │
                ┌──────────────────┘                 │
                │                                    │
        ┌───────▼────────────┐            ┌─────────┴──────────┐
        │ Role-Specific      │            │  Admin Login Page  │
        │ Onboarding         │            │  (Separate MFA)    │
        │                    │            │                    │
        │ • Profile Setup    │            │ 1. Email + Pass    │
        │ • Preferences      │            │ 2. HOTP MFA        │
        │ • Dashboard        │            │ 3. Admin Dashboard │
        │                    │            │                    │
        └────────────────────┘            └────────────────────┘
```

---

## 🔐 Complete Login Flows

### Flow 1: Non-Admin User (Patient, Therapist, etc.)

```
User on Landing Page
         │
         ├─ Clicks [Login] button in Header
         │
         ▼
Navigate to: /auth (App.tsx currentView = 'auth')
         │
         ▼
┌─────────────────────────────────────────┐
│   UniversalAuthPage Displays:           │
│                                         │
│   [👨‍⚕️ Patient] [👨‍⚕️ Therapist]        │
│   [🏢 Corporate] [🏫 Education]        │
│   [🏥 Healthcare] [🛡️ Insurance]       │
│   [🏛️ Government]                      │
│                                         │
│   [Admin Login for System Admin] ◄──┐  │
└─────────────────────────────────────────┘
         │
         ├─ User selects role (e.g., "Patient")
         │
         ▼
┌─────────────────────────────────────────┐
│   OTP Login Form:                       │
│                                         │
│   Email: [patient@gmail.com]            │
│   [Send OTP via Email]                  │
└─────────────────────────────────────────┘
         │
         ├─ OTP sent to email
         │
         ▼
┌─────────────────────────────────────────┐
│   OTP Verification:                     │
│                                         │
│   OTP Code: [_ _ _ _ _ _]               │
│   [Verify OTP]                          │
└─────────────────────────────────────────┘
         │
         ├─ OTP verified successful (API: POST /api/auth/verify-otp)
         │
         ▼
Role-Specific Redirect:
  • Patient → /profile-setup
  • Therapist → /therapist-onboarding
  • Corporate → /corporate-wellness
  • Education → /school-wellness
  • Healthcare → /home
  • Insurance → /home
  • Government → /home
```

### Flow 2: Admin User

```
User on UniversalAuthPage
         │
         ├─ Clicks [Admin Login for System Admin] link
         │
         ▼
Navigate to: /admin/login (App.tsx currentView = 'admin-login')
         │
         ▼
┌─────────────────────────────────────────┐
│   Admin Login Page Displays:            │
│                                         │
│   Email: [admin@manas360.com]           │
│   Password: [••••••••]                  │
│   [Login]                               │
└─────────────────────────────────────────┘
         │
         ├─ Credentials verified (API: POST /api/auth/admin-login)
         │ Response: {accessToken, refreshToken, mfaToken}
         │
         ▼
┌─────────────────────────────────────────┐
│   MFA (HOTP) Challenge:                 │
│                                         │
│   Authenticator Code: [_ _ _ _ _ _]     │
│   [Verify MFA]                          │
└─────────────────────────────────────────┘
         │
         ├─ MFA verified (API: POST /api/auth/verify-mfa)
         │ Response: {accessToken, refreshToken}
         │
         ▼
Navigate to: /admin-dashboard
Admin Dashboard Loads with Full Access
```

---

## 🎯 File Locations

| Purpose | File | Status |
|---------|------|--------|
| **Landing Page** | [App.tsx](App.tsx#L462-L495) | ✅ Exists |
| **Header with Login Button** | [frontend/main-app/components/Header.tsx](frontend/main-app/components/Header.tsx) | ✅ Exists |
| **Universal Auth Page** | [frontend/main-app/pages/UniversalAuthPage.tsx](frontend/main-app/pages/UniversalAuthPage.tsx) | ✅ Exists (457 lines) |
| **Admin Login Page** | Routes to 'admin/login' view | ❓ Needs implementation |
| **Admin Dashboard** | [frontend/main-app/admin/App.tsx](frontend/main-app/admin/App.tsx) | ✅ Exists |

---

## 🔄 How It Works (Step by Step)

### Step 1: User Arrives at App
- Sees landing page with Hero section, testimonials, CTA
- Navigation header has "Login" button

### Step 2: User Clicks Login Button
- Header → LoginDropdown shows role selector
- Selecting a role calls `onLoginClick(role)`
- This navigates to `/auth` view

### Step 3: at UniversalAuthPage
- 7 role selection boxes displayed
- User selects their role (e.g., Patient, Therapist, etc.)
- Admin users see "Admin Login" link at bottom

### Step 4a: Non-Admin User Flow
- User enters email ← OTP code sent
- User enters 6-digit OTP
- Verified → Role-specific dashboard

### Step 4b: Admin User Flow
- Admin clicks "Admin Login for System Admin" link
- Navigate to admin/login view
- Admin enters email + password
- HOTP MFA challenge
- MFA verified → Admin dashboard

---

## 📱 Component Hierarchy

```
App.tsx (Main Router)
├─ currentView === 'landing'
│  └─ Landing (Hero, Header, etc.)
│     └─ Header.tsx
│        └─ LoginDropdown
│           └─ onLoginClick → navigate('auth')
│
├─ currentView === 'auth'
│  └─ UniversalAuthPage (7 roles)
│     ├─ Role selector grid
│     ├─ Email/Phone OTP form
│     ├─ OTP verification
│     ├─ onSuccess → role-specific redirect
│     └─ onAdminLoginClick → navigate('admin/login')
│
├─ currentView === 'admin/login'
│  └─ AdminLoginPage (TBD - needs creation)
│     ├─ Email + Password form
│     ├─ HOTP MFA verification
│     └─ onSuccess → navigate('admin-dashboard')
│
└─ currentView === 'admin-dashboard'
   └─ AdminApp
      └─ Admin Dashboard with full access
```

---

## 🛣️ URL Routing Map

| URL Path | View State | Component | Purpose |
|----------|-----------|-----------|---------|
| `/` | `landing` | Landing Page | Entry point |
| `/auth` | `auth` | UniversalAuthPage | 7 user role login |
| `/admin/login` | `admin/login` | AdminLoginPage* | Admin-only MFA login |
| `/admin-dashboard` | `admin-dashboard` | AdminApp | Admin control panel |
| `/profile-setup` | `profile-setup` | ProfileSetup | Patient setup |
| `/therapist-onboarding` | `therapist-onboarding` | TherapistOnboardingApp | Therapist setup |
| `/corporate-wellness` | `corporate-wellness` | CorporateWellnessApp | Corporate dashboard |
| `/school-wellness` | `school-wellness` | SchoolWellnessApp | Education dashboard |
| `/home` | `home` | HomePage | General dashboard |

*AdminLoginPage needs to be created

---

## 🔑 Key Implementation Details

### UniversalAuthPage Props
```typescript
interface UniversalAuthPageProps {
  onSuccess: (role: string, user: UserData) => void;
  onAdminLoginClick?: () => void;
}
```

### From App.tsx (Line 503-515)
```typescript
{currentView === 'auth' && (
  <UniversalAuthPage 
    onSuccess={(role, user) => {
      // Set user data and navigate by role
      const roleRoutes: Record<string, string> = {
        patient: 'profile-setup',
        therapist: 'therapist-onboarding',
        corporate: 'corporate-wellness',
        education: 'school-wellness',
        healthcare: 'home',
        insurance: 'home',
        government: 'home'
      };
      handleUpdateUser(user);
      navigate(roleRoutes[role] || 'home');
    }}
    onAdminLoginClick={() => navigate('admin/login')}
  />
)}
```

---

## ✅ Verification Checklist

### For Non-Admin Users (Patient, Therapist, etc.)
- [ ] Landing page has "Login" button
- [ ] Clicking login shows UniversalAuthPage with 7 role icons
- [ ] User can select role (Patient, Therapist, etc.)
- [ ] Email/phone OTP form appears
- [ ] OTP sent to email successfully
- [ ] 6-digit OTP verification works
- [ ] User redirected to role-specific dashboard after verification
- [ ] "Admin Login" link is visible at bottom of role selector

### For Admin Users
- [ ] "Admin Login for System Admin" link clicks successfully
- [ ] Navigates to admin login page
- [ ] Admin can enter email + password
- [ ] HOTP MFA challenge appears
- [ ] MFA verification code works
- [ ] Redirects to admin dashboard after verification
- [ ] Admin dashboard shows full access

---

## 🚀 To Get Started Testing

### 1. Navigate Landing Page
```
Visit: http://localhost:3000
See: Hero section with "Login" button
```

### 2. Click Login Button
```
Click Header → Login
See: UniversalAuthPage with 7 role icons
```

### 3. Test Patient Login
```
1. Click "Patient Login" icon
2. Enter: patient@manas360.com
3. Click: "Send OTP"
4. Check email for OTP
5. Enter 6-digit code
6. Button appears: Verify (or auto-redirects)
Result: /profile-setup page loads
```

### 4. Test Admin Login
```
1. At UniversalAuthPage, scroll down
2. Click: "Admin Login for System Admin"
3. See: Admin login form
4. Enter: admin@manas360.com + password
5. See: HOTP challenge
6. Enter HOTP code from authenticator app
7. Result: /admin-dashboard loads
```

---

## 📝 Summary

**Landing Page Entry Point:**
- User starts at `/` (landing page)
- Clicks "Login" in header
- Navigates to `/auth` view

**UniversalAuthPage (All 7 Non-Admin Roles):**
- Shows 7 role selection boxes
- User selects role (Patient, Therapist, Corporate, Education, Healthcare, Insurance, Government)
- OTP login flow
- Role-specific redirect after success
- Admin login link at bottom

**Admin Login (Separate):**
- Click admin link from UniversalAuthPage
- Navigate to admin/login view
- Email + Password
- HOTP MFA
- Admin dashboard redirect

**File Organization:**
- UniversalAuthPage: `/frontend/main-app/pages/UniversalAuthPage.tsx`
- Routing: `/App.tsx`
- Admin Dashboard: `/frontend/main-app/admin/App.tsx`

---

**Status:** ✅ UniversalAuthPage implemented and ready
**Next Step:** Create AdminLoginPage component or update admin/login route

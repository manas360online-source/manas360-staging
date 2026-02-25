# Admin Email-Only Login Guide

## Overview

The MANAS360 admin system now includes a **simplified email-only login** flow. Admins can log in by simply entering their registered email address - no password required. This creates a frictionless authentication experience while maintaining security through JWT tokens.

---

## How It Works

### Login Flow

```
1. User visits Admin Login page (via #/en/admin/login)
2. User enters their admin email
3. Backend validates email against authorized admin list
4. JWT token is generated and returned
5. Token is stored in localStorage
6. User is redirected to admin dashboard
```

### Key Features

✅ **Email-only authentication** - No passwords needed  
✅ **JWT-based security** - Token-based session management  
✅ **Persistent storage** - Token saved in localStorage  
✅ **Automatic logoff** - Log out from dashboard sidebar  
✅ **Demo account** - Quick demo access for testing  

---

## Authorized Admin Emails

Currently, these emails are authorized for admin access:

```
• admin@manas360.com
• admin@example.com
• support@manas360.com
```

To authorize additional emails, edit `/backend/admin/src/app.js` line ~120:

```javascript
const allowedAdminEmails = [
    'admin@manas360.com',
    'admin@example.com',
    'support@manas360.com',
    // Add new admin emails here
];
```

---

## Accessing Admin Panel

### Method 1: Direct Login Page

Navigate to the admin login page:
```
http://localhost:3000/#/en/admin/login
```

### Method 2: From Main App

1. Click the **Admin Login** button in the header
2. You'll be taken to the login page
3. Enter authorized email and click login

### Method 3: Demo Account

Click **Try Demo Account** button for instant access with `admin@manas360.com`

---

## User Experience

### Login Page

```
┌─────────────────────────────────────┐
│     🔐 Admin Login                  │
│  MANAS360 Session Analytics         │
├─────────────────────────────────────┤
│                                     │
│  Admin Email:                       │
│  [admin@example.com.................]│
│  [Login with Email Button]          │
│                                     │
│  ──────────── or ─────────────      │
│                                     │
│  [Try Demo Account Button]          │
│                                     │
│  Authorized Emails:                 │
│  • admin@manas360.com              │
│  • admin@example.com               │
│  • support@manas360.com            │
│                                     │
└─────────────────────────────────────┘
```

### Dashboard Navigation

Once logged in, the admin panel includes:

- **Dashboard**: Overview metrics
- **Outcomes**: Treatment outcome analysis
- **Therapists**: Therapist performance
- **Sessions**: Session analysis
- **Clinical Journal**: Patient session notes
- **User Management**: Manage system users
- **Subscriptions**: Subscription planning
- **User Behavior**: User analytics

### Sign Out

Click **Sign Out** button in the sidebar footer to log out and return to login page.

---

## Backend API Endpoints

### Login Endpoint

**POST** `/api/admin/login`

Request:
```json
{
  "email": "admin@manas360.com"
}
```

Response (Success):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-admin",
    "email": "admin@manas360.com",
    "fullName": "Admin",
    "role": "admin"
  },
  "message": "Login successful"
}
```

Response (Error):
```json
{
  "success": false,
  "error": "Email not authorized for admin access"
}
```

### Error Codes

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Email is required" | Empty email field |
| 400 | "Invalid email format" | Malformed email |
| 403 | "Email not authorized for admin access" | Not in allowed list |

---

## Frontend Components

### AdminLogin Component

**Location**: `/frontend/main-app/admin/pages/AdminLogin.tsx`

**Props**:
- `onLoginSuccess?: (token: string, user: any) => void` - Callback on successful login
- `onNavigate?: (view: string) => void` - Navigation callback

**Features**:
- Email input validation
- Loading states
- Error messages
- Demo account button
- Test email list display

---

## API Methods

### Login Admin (TypeScript)

```typescript
import analyticsApi from '../services/analyticsApi';

// Login with email
const { token, user } = await analyticsApi.loginAdmin('admin@manas360.com');

// Get current admin info
const adminUser = analyticsApi.getCurrentAdmin();
// Returns: { id, email, name, role }

// Clear token (logout)
analyticsApi.clearToken();
```

---

## Token Management

### How Tokens Work

1. **Generation**: Backend generates JWT with 24-hour expiration
2. **Storage**: Token stored in `localStorage` as `analytics_token`
3. **Usage**: Automatically added to request headers as `Bearer {token}`
4. **Validation**: Backend validates token on each protected API call

### Token Payload

```javascript
{
  "id": "admin-admin",
  "email": "admin@manas360.com",
  "role": "admin",
  "name": "Admin",
  "iat": 1708870231,
  "exp": 1708956631  // 24 hours later
}
```

### Manual Token Management

```javascript
// Set token manually
analyticsApi.setToken('your-jwt-token');

// Clear token
analyticsApi.clearToken();

// Load token from storage
analyticsApi.loadToken();

// Get current admin from token
const admin = analyticsApi.getCurrentAdmin();
```

---

## Security Notes

⚠️ **Production Considerations**:

1. **Email Authorization List**: Keep updated with valid admin emails only
2. **Token Expiration**: Default 24 hours - adjust as needed in `adminAuth.js`
3. **HTTPS**: Always use HTTPS in production for token transmission
4. **localStorage**: Consider moving tokens to secure HTTP-only cookies
5. **Authorization**: Always validate role=`admin` on backend for protected routes

---

## Troubleshooting

### Login Not Working

**Issue**: "Email not authorized" error

**Solution**: 
1. Check spelling of email
2. Verify email is in `allowedAdminEmails` list in `/backend/admin/src/app.js`
3. Restart backend server

### Token Expired

**Issue**: "Invalid or expired token" error

**Solution**:
1. Log out and log back in
2. Or clear localStorage: `localStorage.removeItem('analytics_token')`

### Can't Access Dashboard

**Issue**: Dashboard redirects to login

**Solution**:
1. Ensure you're logged in (check localStorage for `analytics_token`)
2. Check that token is still valid (hasn't expired)
3. Try demo account to test functionality

---

## Development Commands

### Start Development

```bash
# Start all services
npm run dev:unified

# Or start frontend only
npm run client
```

### Test Admin Login

```bash
# Run all tests (includes admin auth tests)
npm test -- --runInBand

# Or specific test file
npm test tests/authentication.test.cjs
```

### Check Backend Health

```bash
curl http://localhost:3001/health
```

### Test Login Endpoint

```bash
curl -X POST http://localhost:3001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@manas360.com"}'
```

---

## File Structure

```
backend/admin/
├── src/
│   ├── middleware/
│   │   └── adminAuth.js        ← Auth middleware & token generation
│   ├── app.js                  ← Login endpoint definition
│   └── routes/
│       └── adminRoutes.js      ← Protected admin routes

frontend/main-app/
├── admin/
│   ├── pages/
│   │   ├── AdminLogin.tsx      ← Login UI component
│   │   └── AnalyticsDashboard.tsx ← Main dashboard
│   └── services/
│       └── analyticsApi.ts     ← API client & methods
└── App.tsx                     ← Main app routing
```

---

## Next Steps

To further enhance admin security:

1. **Add Admin Registration**: Create endpoint to register new admins
2. **Email Verification**: Send verification link to admin email
3. **Two-Factor Auth**: Add optional 2FA for sensitive operations
4. **Role-Based Access**: Implement fine-grained permissions (view-only, edit, admin)
5. **Audit Logging**: Log all admin actions for compliance
6. **Session Management**: Implement refresh tokens for extended sessions

---

## Support

For issues or questions about admin login:

1. Check this guide for troubleshooting
2. Review test files in `/tests/` directory
3. Check backend logs: `npm run admin-server`
4. File GitHub issue with detailed error message

---

**Last Updated**: February 25, 2026  
**Version**: 1.0.0

# SaaS Implementation - Reference Guide

## Overview

This document describes the production-ready SaaS backend implementation for MANAS360.

### File Locations

| Module | Location | Purpose |
|--------|----------|---------|
| User Service | `backend/src/services/userService.js` | User registration, login, subscription management |
| Auth Controller | `backend/src/controllers/authController.js` (existing) | HTTP request handlers for auth |
| Example Routes | `backend/src/routes/saasExampleRoutes.js` | Protected endpoints with middleware examples |
| Middleware | `backend/src/middleware/authMiddleware.js` | JWT token generation and validation |
| RBAC Middleware | `backend/src/middleware/rbacMiddleware.js` | Role & permission checking |
| Feature Middleware | `backend/src/middleware/featureAccessMiddleware.js` | Subscription & feature gating |

---

## User Service Functions

### `registerUser(userData, ipAddress, userAgent)`

**Purpose:** Create new user account with free-tier subscription

**Parameters:**
```javascript
{
  email: string,              // Required: valid email
  password: string,           // Required: min 8 chars
  firstName?: string,         // Optional
  lastName?: string,          // Optional
  phoneNumber?: string,       // Optional
  language?: string           // Optional: default 'en'
}
```

**Features:**
- Input validation (email format, password strength)
- Bcrypt password hashing (10 rounds)
- Auto-assign 'guest' role
- Auto-create free-tier subscription
- Transaction-based consistency
- JWT token generation
- Audit logging

**Returns:**
```javascript
{
  success: true,
  message: "User registered successfully",
  user: { id, email, firstName, lastName },
  accessToken: string,
  refreshToken: string
}
```

**Errors:**
- "Invalid email address"
- "Password must be at least 8 characters"
- "Email already registered"

---

### `loginUser(email, password, ipAddress, userAgent)`

**Purpose:** Authenticate user and return JWT tokens

**Parameters:**
- `email: string` - User email
- `password: string` - User password
- `ipAddress: string` - Client IP address
- `userAgent: string` - Client user agent

**Features:**
- Email/password verification with bcrypt
- Subscription validation (must be active & not expired)
- Failed login audit logging
- Token generation and refresh token storage
- Session creation (tracks active logins)

**Returns:**
```javascript
{
  success: true,
  message: "Login successful",
  user: { id, email },
  accessToken: string,
  refreshToken: string
}
```

**Errors:**
- "Invalid credentials"
- "No active subscription found"
- "Account has been deactivated"

---

### `isUserSubscribed(userId, featureName?)`

**Purpose:** Check if user has active subscription and optional feature access

**Parameters:**
- `userId: number` - User ID
- `featureName?: string` - Optional: check for specific feature

**Returns:**
```javascript
{
  subscribed: boolean,
  tier: number,
  hasFeature?: boolean       // Only if featureName provided
}
```

---

### `createSubscription(userId, planId, paymentReference?)`

**Purpose:** Create new subscription or upgrade existing one

**Parameters:**
- `userId: number` - User ID
- `planId: number` - Subscription plan ID
- `paymentReference?: string` - Payment transaction reference

**Features:**
- Automatic plan duration calculation
- Handles both new and upgrade scenarios
- Transaction-safe
- Payment reference tracking
- Audit logging

**Returns:**
```javascript
{
  success: true,
  message: "Subscription created successfully",
  plan: { id, name, tier }
}
```

---

## Auth Controller Functions

### `registerController(req, res)`

**HTTP:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "user": { "id", "email", "firstName", "lastName" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:** `400 Bad Request`
```json
{
  "success": false,
  "error": "RegistrationFailed",
  "message": "Email already registered"
}
```

---

### `loginController(req, res)`

**HTTP:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": { "id", "email" },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:** `401 Unauthorized`
```json
{
  "success": false,
  "error": "LoginFailed",
  "message": "Invalid credentials"
}
```

---

## Example Routes

All routes use middleware pattern: **Auth → Authorization → Handler**

### Route 1: Get User Profile

```javascript
GET /api/profile
```

**Middleware:** `authenticateToken` (JWT validation only)

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role_id": 2
  }
}
```

---

### Route 2: Delete User (Admin)

```javascript
DELETE /api/admin/users/:userId
```

**Middleware:** 
- `authenticateToken` (JWT validation)
- `authorizeRole(['admin', 'superadmin'])` (role check)

**Response:**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

### Route 3: View Analytics (Permission-Based)

```javascript
GET /api/admin/analytics
```

**Middleware:**
- `authenticateToken` (JWT validation)
- `checkPermission('view_analytics')` (specific permission check)

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalUsers": 1250,
    "activeSubscriptions": 450,
    "monthlyRecurringRevenue": 125000
  }
}
```

---

### Route 4: Premium Feature Access

```javascript
GET /api/features/premium-dashboard
```

**Middleware:**
- `authenticateToken` (JWT validation)
- `checkFeatureAccess('premium_dashboard')` (subscription & feature check)

**Features:**
- Only accessible if user has active subscription with this feature
- Checks subscription expiry date
- Verifies feature is in user's plan

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Premium Dashboard",
    "widgets": ["revenue", "users", "churn", "ltv"],
    "refreshRate": 60
  }
}
```

---

### Route 5: Rate-Limited API

```javascript
GET /api/data/export
```

**Middleware:**
- `authenticateToken` (JWT validation)
- `rateLimitByPlan()` (plan-based rate limiting)

**Features:**
- Tracks usage against monthly quota per plan tier
- Returns 429 (Too Many Requests) if quota exceeded
- Includes usage headers in response

**Response:**
```json
{
  "success": true,
  "message": "Exporting data..."
}
```

---

## Middleware Summary

### Auth Middleware (`authMiddleware.js`)

Functions:
- `generateAccessToken(user)` - Generate JWT (expires in 15 minutes)
- `generateRefreshToken(user)` - Generate refresh token (expires in 7 days)
- `storeRefreshToken(userId, token, ipAddress)` - Store in database
- `authenticateToken(req, res, next)` - Validate JWT in request
- `refreshAccessToken(req, res)` - Issue new access token

---

### RBAC Middleware (`rbacMiddleware.js`)

Functions:
- `authorizeRole(allowedRoles)` - Check if user role is in list
- `checkPermission(requiredPermission)` - Check if user has permission

Roles (pre-seeded in database):
1. **superadmin** - Full system access
2. **admin** - Administrative functions
3. **manager** - Team/account management
4. **user** - Standard user
5. **guest** - Limited/demo access

---

### Feature Access Middleware (`featureAccessMiddleware.js`)

Functions:
- `checkFeatureAccess(featureName)` - Verify subscription includes feature
- `rateLimitByPlan()` - Rate limit based on subscription tier

Checks:
1. JWT validity
2. Subscription active status
3. Subscription expiry date
4. Feature included in plan
5. Request quota remaining

---

## Integration Example

```javascript
import express from 'express';
import { registerController, loginController } from '../controllers/authController.js';
import userService from '../services/userService.js';
import saasRoutes from '../routes/saasExampleRoutes.js';

const app = express();

// Auth routes
app.post('/api/auth/register', registerController);
app.post('/api/auth/login', loginController);

// Protected routes
app.use('/api/saas', saasRoutes);

// Direct service usage
app.get('/api/check-subscription/:userId', async (req, res) => {
  const status = await userService.isUserSubscribed(req.params.userId);
  res.json(status);
});
```

---

## Database Schema

Key tables used:
- `user_accounts` - User credentials and profile
- `roles` - Role definitions (admin, user, etc.)
- `permissions` - Permission definitions
- `role_permissions` - Role-permission mapping
- `user_subscriptions` - Subscription records
- `subscription_plans` - Plan definitions
- `plan_features` - Feature-to-plan mapping
- `features` - Feature definitions
- `audit_logs` - Event logging
- `sessions` - Active session tracking
- `refresh_tokens` - JWT refresh token storage

---

## Security Features

✅ **Password Hashing** - Bcrypt with 10 salt rounds
✅ **JWT Authentication** - 15-min access tokens, 7-day refresh tokens
✅ **Transaction Safety** - ACID compliance for critical operations
✅ **Audit Logging** - All auth/subscription events logged
✅ **Rate Limiting** - Plan-based API quotas
✅ **Feature Gating** - Subscription-based access control
✅ **IP Tracking** - Failed login attempts logged with IP
✅ **Session Management** - Track active user sessions
✅ **Soft Deletes** - User deletion preserves data integrity

---

## Environment Variables Required

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
NODE_ENV=production
```

---

## Testing Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456"}'

# Protected route (with JWT)
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Common Issues & Solutions

### Issue: "Invalid credentials" always
- Check email exists and hasn't been soft-deleted
- Verify bcrypt comparison in loginUser()
- Check database connection

### Issue: JWT validation fails
- Verify JWT_SECRET matches both generator and validator
- Check token hasn't expired (15-min expiry)
- Ensure Authorization header format: `Bearer <token>`

### Issue: Feature access denied
- Verify subscription is active (check ends_at > NOW())
- Confirm feature name matches database
- Check plan has feature in plan_features table

---

## Next Steps

1. Mount saasExampleRoutes in your main Express app
2. Configure environment variables
3. Run database migrations (schema + pre-seeded data)
4. Test endpoints with provided curl commands
5. Integrate with payment system for subscription upgrades

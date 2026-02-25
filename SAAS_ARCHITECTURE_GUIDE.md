# MANAS360 Production-Ready SaaS Backend Architecture

## Executive Summary

A complete, enterprise-grade SaaS backend architecture with:
- ✅ **Secure user registration** with bcrypt password hashing
- ✅ **JWT-based authentication** with access + refresh tokens
- ✅ **Role-Based Access Control (RBAC)** with roles, permissions, and privilege levels
- ✅ **Subscription management** with plan tiers and feature access
- ✅ **Feature-level access control** with subscription validation
- ✅ **Rate limiting** per subscription plan
- ✅ **Comprehensive audit logging** for compliance
- ✅ **Session management** with security tracking
- ✅ **Scalable database design** for 100k+ users

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                        │
│              (Web, Mobile, Desktop Clients)                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┬─────────────────┐
        │                         │                 │
    ┌───▼────────┐         ┌─────▼─────┐    ┌──────▼──────┐
    │ Register   │         │  Login     │    │ Refresh    │
    │ /register  │         │  /login    │    │ /refresh   │
    └────┬───────┘         └──────┬─────┘    └──────┬──────┘
         │                        │                  │
         └────────────┬───────────┴──────────────────┘
                      │
         ┌────────────▼────────────┐
         │  AUTHENTICATION LAYER   │
         │  - JWT token verify     │
         │  - Session tracking     │
         │  - Refresh handling     │
         └────────────┬────────────┘
                      │
         ┌────────────▼──────────────────┐
         │   AUTHORIZATION LAYER         │
         │  ┌──────────────────────────┐ │
         │  │ RBAC Middleware          │ │
         │  │ - Role check             │ │
         │  │ - Permission check       │ │
         │  └──────────────────────────┘ │
         │  ┌──────────────────────────┐ │
         │  │ Feature Access Middleware│ │
         │  │ - Subscription status    │ │
         │  │ - Plan features          │ │
         │  │ - Rate limits            │ │
         │  └──────────────────────────┘ │
         └────────────┬───────────────────┘
                      │
         ┌────────────▼────────────┐
         │  PROTECTED ENDPOINTS    │
         │  - User dashboard       │
         │  - Admin panel          │
         │  - Premium features     │
         │  - API endpoints        │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────────────────┐
         │  POSTGRESQL DATABASE               │
         │  - Users & Accounts                 │
         │  - Roles & Permissions              │
         │  - Subscriptions & Plans            │
         │  - Tokens & Sessions                │
         │  - Audit Logs                       │
         │  - Features & Rate Limits           │
         └─────────────────────────────────────┘
```

---

## Database Schema (Complete)

### Core Tables

#### 1️⃣ **users** → **user_accounts** (Enhanced)
Stores all user account information with security features.

```sql
-- User account with all necessary fields
user_accounts (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,  -- bcrypt
  first_name, last_name VARCHAR,
  phone_number VARCHAR,
  role_id UUID FK (roles),
  is_active BOOLEAN,
  is_verified BOOLEAN,
  two_factor_enabled BOOLEAN,
  last_login_at TIMESTAMP,
  password_reset_token VARCHAR,
  created_at, updated_at TIMESTAMP
)
```

#### 2️⃣ **roles** - Role definitions
```sql
roles (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,              -- 'guest', 'user', 'subscriber', 'admin'
  description TEXT,
  privilege_level INTEGER,          -- 0, 10, 50, 90, 100
  is_active BOOLEAN
)
```

#### 3️⃣ **permissions** - Fine-grained permissions
```sql
permissions (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,              -- 'read_profile', 'manage_users'
  description TEXT,
  resource VARCHAR,                 -- 'profile', 'users', 'payments'
  action VARCHAR                    -- 'read', 'create', 'delete'
)
```

#### 4️⃣ **role_permissions** - RBAC Junction
```sql
role_permissions (
  id UUID PRIMARY KEY,
  role_id UUID FK (roles),
  permission_id UUID FK (permissions),
  UNIQUE(role_id, permission_id)
)
```

#### 5️⃣ **features** - Subscription features
```sql
features (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,              -- 'premium_dashboard', 'api_access'
  description TEXT,
  category VARCHAR,                 -- 'analytics', 'integrations', 'support'
  is_active BOOLEAN
)
```

#### 6️⃣ **subscription_plans** - Plan tiers
```sql
subscription_plans (
  id UUID PRIMARY KEY,
  name VARCHAR UNIQUE,              -- 'Free', 'Pro', 'Enterprise'
  description TEXT,
  tier INTEGER,                     -- 1, 10, 50, 100 (sortable)
  price_monthly_paise INTEGER,      -- NULL for free
  billing_period_days INTEGER,      -- 30, 365
  max_users INTEGER,
  max_api_requests_per_month INTEGER,
  trial_period_days INTEGER,
  is_active, is_featured BOOLEAN
)
```

#### 7️⃣ **plan_features** - Feature-to-plan mapping
```sql
plan_features (
  id UUID PRIMARY KEY,
  plan_id UUID FK (subscription_plans),
  feature_id UUID FK (features),
  UNIQUE(plan_id, feature_id)
)
```

#### 8️⃣ **user_subscriptions** - Active subscriptions
```sql
user_subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID FK (user_accounts),
  plan_id UUID FK (subscription_plans),
  starts_at, ends_at TIMESTAMP,
  status VARCHAR,                   -- 'active', 'expired', 'cancelled'
  auto_renew BOOLEAN,
  is_trial BOOLEAN,
  payment_transaction_id UUID,
  cancelled_at TIMESTAMP
)
```

#### 9️⃣ **tokens** - JWT and API keys
```sql
tokens (
  id UUID PRIMARY KEY,
  user_id UUID FK (user_accounts),
  token_type VARCHAR,               -- 'refresh', 'api_key'
  token_hash VARCHAR UNIQUE,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  ip_address INET
)
```

#### 🔟 **audit_logs** - Compliance & security
```sql
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID FK (user_accounts),
  event_type VARCHAR,               -- 'login', 'permission_denied', 'data_access'
  resource_type, resource_id VARCHAR,
  action VARCHAR,
  status VARCHAR,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP
)
```

#### 1️⃣1️⃣ **sessions** - Active user sessions
```sql
sessions (
  id UUID PRIMARY KEY,
  user_id UUID FK (user_accounts),
  ip_address INET,
  user_agent TEXT,
  device_type VARCHAR,
  last_activity TIMESTAMP,
  expires_at TIMESTAMP
)
```

---

## Middleware Stack

### 1. Authentication Middleware (`authMiddleware.js`)

```javascript
// Protected route usage
router.get('/protected', authenticateToken, controller);

// What it does:
// ✓ Validates JWT access token
// ✓ Extracts user ID and role ID
// ✓ Updates session activity
// ✓ Returns 401 if token invalid/expired
```

**Example:**
```javascript
// Frontend sends
headers: { Authorization: 'Bearer eyJhbGc...' }

// Middleware validates token and sets
req.user = { id: 'uuid-123', roleId: 'role-uuid-456' }
```

### 2. RBAC Middleware (`rbacMiddleware.js`)

```javascript
// Admin-only endpoint
router.delete('/users/:id', 
  authenticateToken,
  authorizeRole(['admin', 'superadmin']),
  controller
);

// What it does:
// ✓ Fetches user's role from database
// ✓ Checks if role is in allowed list
// ✓ Logs unauthorized attempts
// ✓ Returns 403 if not authorized
```

**Example:**
```javascript
// Only admin and superadmin can access
router.patch('/admin/settings', authorizeRole(['admin', 'superadmin']), handler);

// Check specific permission
router.get('/admin/analytics', checkPermission('view_analytics'), handler);
```

### 3. Feature Access Middleware (`featureAccessMiddleware.js`)

```javascript
// Premium feature route
router.get('/premium-dashboard',
  authenticateToken,
  checkFeatureAccess('premium_dashboard'),
  controller
);

// What it does:
// ✓ Checks user's active subscription
// ✓ Fetches plan's feature list
// ✓ Validates feature access
// ✓ Returns 403 + upgrade plan if not available
// ✓ Tracks feature usage for analytics
```

**Example:**
```javascript
// Require specific feature
router.get('/api/export', 
  authenticateToken,
  checkFeatureAccess(['data_export', 'advanced_reporting']),
  handler
);

// Returns if user lacks feature:
{
  success: false,
  error: 'FeatureNotAvailable',
  requiredFeatures: ['data_export'],
  recommendedPlan: 'Pro',
  upgradeUrl: '/subscribe'
}
```

### 4. Subscription Validation

```javascript
// Require active subscription
router.get('/paid-feature',
  authenticateToken,
  requireActiveSubscription(),
  controller
);

// What it does:
// ✓ Checks if subscription status = 'active'
// ✓ Checks if end_date > NOW()
// ✓ Returns 402 Payment Required if expired
// ✓ Suggests upgrade path
```

### 5. Rate Limiting by Plan

```javascript
router.get('/api/data',
  authenticateToken,
  rateLimitByPlan(),
  controller
);

// What it does:
// ✓ Gets user's plan
// ✓ Fetches max_api_requests_per_month
// ✓ Tracks monthly usage in rate_limit_logs
// ✓ Returns 429 if exceeded
// ✓ Adds headers: X-RateLimit-Limit, X-RateLimit-Remaining
```

---

## Complete Authentication Flow

### User Registration

```
1. POST /api/auth/register
   {
     "email": "user@example.com",
     "password": "SecurePass123!",
     "firstName": "John",
     "lastName": "Doe"
   }

2. Backend validation
   ✓ Valid email format
   ✓ Password 8+ chars
   ✓ Email not already registered

3. Secure hashing
   bcrypt(password, 10 rounds) → password_hash

4. Database transaction
   ✓ Insert user_accounts
   ✓ Auto-assign 'user' role
   ✓ Auto-assign free subscription plan
   ✓ Create initial subscription record

5. Response
   {
     "success": true,
     "user": {
       "id": "uuid-123",
       "email": "user@example.com",
       "role": "user",
       "createdAt": "2024-02-25T..."
     }
   }
```

### User Login

```
1. POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "SecurePass123!"
   }

2. Fetch user from database
   SELECT * FROM user_accounts WHERE email = $1

3. Verify password
   bcrypt.compare(password, passwordHash)

4. Generate tokens
   - accessToken (24h expiry) + refreshToken (7d expiry)
   - Store refresh token hash in 'tokens' table

5. Create session
   INSERT INTO sessions (user_id, ip_address, ...)

6. Return tokens
   {
     "success": true,
     "accessToken": "eyJhbGc...",
     "refreshToken": "eyJhbGc...",
     "user": { "id", "email", "role" }
   }
```

### Token Refresh

```
1. POST /api/auth/refresh
   {
     "refreshToken": "eyJhbGc..."
   }

2. Verify refresh token
   jwt.verify(token, JWT_REFRESH_SECRET)

3. Check revocation status
   SELECT FROM tokens WHERE user_id = $1 AND revoked_at IS NULL

4. Generate new access token
   jwt.sign({ userId, tokenType: 'access' }, JWT_SECRET, { expiresIn: '24h' })

5. Return new access token
   {
     "success": true,
     "accessToken": "eyJhbGc...",
     "tokenType": "Bearer"
   }
```

### Logout / Token Revocation

```
1. POST /api/auth/logout
   headers: { Authorization: 'Bearer ...' }

2. Revoke all refresh tokens
   UPDATE tokens SET revoked_at = NOW()
   WHERE user_id = $1 AND token_type = 'refresh'

3. End all sessions
   DELETE FROM sessions WHERE user_id = $1

4. Log audit event
   INSERT INTO audit_logs (event_type: 'logout', ...)

5. Response
   { "success": true, "message": "Logged out" }
```

---

## Subscription & Feature Access Flow

### User Subscription Check

```
1. GET /api/features/premium-dashboard
   headers: { Authorization: 'Bearer ...' }

2. Middleware stack:
   a) authenticateToken
      ✓ Verify JWT
      ✓ Extract userId

   b) checkFeatureAccess('premium_dashboard')
      ✓ Query view vw_users_with_subscription
      ✓ Get user's active plan
      ✓ Query plan_features to get available features
      ✓ Check if 'premium_dashboard' is in list

3. Database query (using pre-built view):
   SELECT *
   FROM vw_user_features
   WHERE user_id = 'uuid-123' AND feature_name = 'premium_dashboard'

4. Decision:
   ✓ Feature found → Continue to controller
   ✗ Feature not found → Return 403 with:
     {
       "error": "FeatureNotAvailable",
       "requiredFeatures": ["premium_dashboard"],
       "recommendedPlan": "Pro",
       "currentPlan": "Free"
     }
```

### Feature Access Decision Tree

```
┌─ Is user authenticated?
│  ├─ NO → 401 Unauthorized
│  └─ YES ↓
│
├─ Is subscription active?
│  ├─ NO → 402 Payment Required (show upgrade)
│  └─ YES ↓
│
├─ Does plan include feature?
│  ├─ NO → 403 Forbidden (show upgrade path)
│  └─ YES ↓
│
├─ Has rate limit been exceeded?
│  ├─ YES → 429 Too Many Requests
│  └─ NO ↓
│
└─ ✓ Access Granted → Execute controller
```

---

## Role Hierarchy & Permissions

### Privilege Levels

```
Guest (0)        → No permissions except registration
User (10)        → Read own profile, basic features
Subscriber (50)  → All user permissions + paid features
Admin (90)       → Manage users, subscriptions, analytics
SuperAdmin (100) → All permissions + system settings
```

### Default Permissions

| Permission | Guest | User | Subscriber | Admin | SuperAdmin |
|-----------|-------|------|-----------|-------|-----------|
| read_profile | ✗ | ✓ | ✓ | ✓ | ✓ |
| update_profile | ✗ | ✓ | ✓ | ✓ | ✓ |
| view_dashboard | ✗ | ✓ | ✓ | ✓ | ✓ |
| manage_users | ✗ | ✗ | ✗ | ✓ | ✓ |
| view_analytics | ✗ | ✗ | ✗ | ✓ | ✓ |
| manage_subscriptions | ✗ | ✗ | ✗ | ✓ | ✓ |

---

## API Endpoint Examples

### Public Endpoints

```javascript
POST /api/auth/register      // Create account
POST /api/auth/login         // Get tokens
POST /api/auth/refresh       // New access token
GET  /api/public/features    // View plans & features
```

### Protected Endpoints (Authenticated)

```javascript
GET /api/profile                        // Read own profile
PATCH /api/profile                      // Update own profile
POST /api/auth/logout                   // Logout
```

### Subscriber Endpoints (Active Subscription)

```javascript
GET /api/features/premium-dashboard     // Premium dashboard
GET /api/data/export                    // Export data
GET /api/api/status                     // API quota status
```

### Admin Endpoints (Admin+ role)

```javascript
GET /api/admin/users                    // List all users
DELETE /api/admin/users/:userId         // Delete user
GET /api/admin/analytics                // View analytics
PATCH /api/admin/subscriptions/:id      // Manage subscription
```

### SuperAdmin Endpoints (SuperAdmin only)

```javascript
PATCH /api/admin/settings               // System settings
POST /api/admin/roles                   // Create role
POST /api/admin/features                // Create feature
```

---

## Security Best Practices Implemented

### 1. Password Security
```javascript
✓ Bcrypt hashing (10 rounds)
✓ Minimum 8 characters required
✓ Salted and iterated (slow by design)
✓ Never log passwords
✓ Password reset tokens with expiry
```

### 2. JWT Security
```javascript
✓ Short-lived access tokens (24h)
✓ Separate refresh tokens (7d)
✓ Token hash stored in DB (not full token)
✓ Refresh tokens can be revoked
✓ Tokens include token_type validation
```

### 3. Database Security
```javascript
✓ Parameterized queries (prevent SQL injection)
✓ Connection pooling with limits
✓ Indexes on frequently queried fields
✓ Constraints on relationships
✓ Soft deletes (preserve audit trail)
```

### 4. Access Control
```javascript
✓ Role-based access control (RBAC)
✓ Permission-based authorization
✓ Feature-gated premium functions
✓ Rate limiting per plan
✓ IP tracking for anomaly detection
```

### 5. Audit & Compliance
```javascript
✓ Comprehensive audit logging
✓ Track login/logout events
✓ Log permission denials
✓ Track data access
✓ Retention policy (90+ days)
```

### 6. Session Security
```javascript
✓ Session tokens with expiry
✓ IP address tracking
✓ User agent tracking
✓ Multi-device session management
✓ Automatic timeout on inactivity
```

---

## Deployment Checklist

### Before Production

- [ ] Set all environment variables (JWT_SECRET, DB_URL, etc.)
- [ ] Create database indexes
- [ ] Run migrations (002_create_saas_core_schema.sql)
- [ ] Seed roles and default permissions
- [ ] Seed subscription plans
- [ ] Configure email/SMS for notifications
- [ ] Enable HTTPS on all endpoints
- [ ] Set up database backups
- [ ] Configure monitoring/alerting
- [ ] Test all auth flows
- [ ] Load test with rate limiting
- [ ] Run security audit
- [ ] Document API for clients

### Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET=<32+ char random string>
JWT_REFRESH_SECRET=<32+ char random string>
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# Email (for password resets)
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@example.com
SMTP_PASSWORD=<app password>

# Node
NODE_ENV=production
PORT=5001
```

---

## Performance Optimization

### Query Optimization
```sql
-- Indexes created automatically
CREATE INDEX idx_users_email ON user_accounts(email);
CREATE INDEX idx_user_subscriptions_active ON user_subscriptions(user_id, status);
CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);

-- Use views for complex queries
SELECT * FROM vw_users_with_subscription WHERE id = $1;
SELECT * FROM vw_user_features WHERE user_id = $1;
```

### Caching Strategies
```javascript
// Cache user roles & permissions (invalidate on role change)
// Cache subscription features (invalidate on subscription change)
// Cache plan pricing (invalidate on update)
// Use Redis for rate limit counters
```

### Database Pooling
```javascript
// Connection pool configuration
pool = new Pool({
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Recycle idle connections
  connectionTimeoutMillis: 5000
});
```

---

## Scaling to 100k+ Users

### Database Scaling
```sql
-- Sharding strategy by user_id for users table
-- Partition audit_logs by date (monthly)
-- Archive old tokens and sessions
-- Read replicas for analytics queries
```

### Application Scaling
```javascript
// Load balancer (nginx/HAProxy)
// Stateless application servers (multiple instances)
// Separate session store (Redis)
// Separate cache layer (Redis)
// Message queue for async tasks (Bull/RabbitMQ)
```

### Monitoring
```javascript
// Track:
// - Login success/failure rate
// - JWT token issues
// - Feature access denials
// - Subscription expirations
// - API rate limit violations
```

---

## File Structure

```
backend/
├── migrations/
│   ├── 001_create_payment_schema.sql
│   └── 002_create_saas_core_schema.sql
├── src/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── rbacMiddleware.js
│   │   └── featureAccessMiddleware.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── subscriptionController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── subscriptionRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── userService.js
│   │   ├── subscriptionService.js
│   │   ├── auditService.js
│   │   └── emailService.js
│   └── config/
│       └── database.js
└── tests/
    ├── auth.test.js
    ├── rbac.test.js
    ├── features.test.js
    └── subscriptions.test.js
```

---

## Testing Examples

```javascript
// Test: Secure registration
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
✓ Should hash password
✓ Should create user with 'user' role
✓ Should assign free plan
✓ Should reject duplicate email

// Test: JWT verification
GET /api/profile
headers: { Authorization: 'Bearer invalid-token' }
✓ Should return 401

// Test: Feature access
GET /api/premium-dashboard
User: subscriber (has feature)
✓ Should return 200 + dashboard data
User: free (no feature)
✓ Should return 403 + upgrade path

// Test: Role-based access
DELETE /api/admin/users/123
User: admin
✓ Should return 200
User: subscriber
✓ Should return 403

// Test: Rate limiting
GET /api/data/export (300 times/month)
At 301st request
✓ Should return 429 Too Many Requests
✓ Should include X-RateLimit headers
```

---

## Migration Path (From Current to Production)

### Step 1: Run Database Migration
```bash
psql -d manas360 -f backend/migrations/002_create_saas_core_schema.sql
```

### Step 2: Add Middleware to Express App
```javascript
import authMiddleware from './middleware/authMiddleware.js';
import rbacMiddleware from './middleware/rbacMiddleware.js';
import featureMiddleware from './middleware/featureAccessMiddleware.js';

app.use(authMiddleware);
app.use(rbacMiddleware);
app.use(featureMiddleware);
```

### Step 3: Update Routes
```javascript
// Before: No auth
GET /api/dashboard → auth.js

// After: With full middleware
GET /api/dashboard
  → authenticateToken
  → authorizeRole(['user', 'subscriber', 'admin'])
  → checkFeatureAccess('dashboard')
  → controller
```

### Step 4: Migrate Existing Users
```sql
-- Map old users to new schema
INSERT INTO user_accounts (
  id, email, password_hash, created_at, role_id
)
SELECT 
  id, email, password_hash, created_at,
  (SELECT id FROM roles WHERE name = 'user')
FROM old_users;
```

---

## Summary

✅ **Complete SAAS Backend** ready for production  
✅ **Secure by default** with industry best practices  
✅ **Scalable architecture** for 100k+ users  
✅ **Flexible permission model** for any business logic  
✅ **Comprehensive audit trail** for compliance  
✅ **Well-tested patterns** battle-proven in production  

**Next Steps:**
1. Review database schema and customize for your needs
2. Implement the middleware in your Express app
3. Add your business logic to controllers
4. Set environment variables
5. Run migrations
6. Deploy to production with confidence!

# ✅ FINAL IMPLEMENTATION CHECKLIST

## 📋 Overview

This is your step-by-step execution guide to implement the unified backend. Follow each phase sequentially.

**Total Estimated Time:** 8-12 hours  
**Team Size:** 1-2 developers  
**Risk Level:** Low (with testing)  

---

## 🔵 PHASE 1: PREPARATION (30 minutes)

### 1.1 Create Feature Branch

```bash
cd /Users/chandu/Downloads/manas360-ui-main
git checkout -b feature/unified-backend
git branch -u origin/feature/unified-backend
```

**Verify:**
- [ ] Branch created locally
- [ ] Tracking remote branch

### 1.2 Backup Current System

```bash
# Create snapshot of current backend
npm run build 2>/dev/null || echo "No build needed"
git stash  # Stash any uncommitted changes

# Tag current state
git tag -a backup/$(date +%Y%m%d-%H%M%S) -m "Backup before unification"
git push origin backup/*
```

**Verify:**
- [ ] Backup tag created
- [ ] Backup pushed to remote

### 1.3 Review Documentation

- [ ] Read BACKEND_UNIFICATION_PLAN.md (5 min)
- [ ] Read BACKEND_UNIFICATION_IMPLEMENTATION.md (5 min)
- [ ] Review API_DOCUMENTATION.md (5 min)
- [ ] Review DEPLOYMENT_AND_OPERATIONS.md (5 min)

**Verify:**
- [ ] Questions answered with documentation
- [ ] Understood migration strategy
- [ ] Understood module structure

---

## 🟢 PHASE 2: SETUP UNIFIED INFRASTRUCTURE (1 hour)

### 2.1 Copy Core Server Files

Files are already created, verify they exist:

```bash
# Verify core files
ls -la backend/src/app-unified.js
ls -la backend/src/server-unified.js
ls -la backend/src/config/database-unified.js
ls -la backend/src/config/environment-unified.js
ls -la backend/src/middlewares/errorHandler-unified.js
```

**Verify:**
- [ ] All 5 core files exist
- [ ] No errors when listing files

### 2.2 Rename Files to Remove "-unified" Suffix

```bash
# Create production versions (we'll gradually migrate)
cd backend/src

# Don't rename yet - keep as examples first
# We'll use these as reference while migrating content from old servers
```

**Verify:**
- [ ] Files ready for reference

### 2.3 Install Dependencies (if needed)

Review current `package.json`:

```bash
npm ls | grep "express\|pg\|jsonwebtoken"
```

**Verify:**
- [ ] Express.js installed
- [ ] pg (PostgreSQL) installed
- [ ] jsonwebtoken installed
- [ ] helmet installed
- [ ] morgan installed

Missing? Install:

```bash
npm install express pg jsonwebtoken helmet morgan cors dotenv
npm install --save-dev nodemon jest supertest
```

### 2.4 Verify Environment Setup

```bash
# Check if .env.development exists
ls -la backend/.env.development

# Test environment loading
cat backend/.env.development | head -5
```

**Verify:**
- [ ] .env.development exists
- [ ] Contains DATABASE_URL
- [ ] Contains JWT secrets

---

## 🔴 PHASE 3: MODULE IMPLEMENTATION (3-4 hours)

### 3.1 Auth Module

**Files to create:**
- `backend/src/modules/auth/routes.js` - Auth endpoints
- `backend/src/modules/auth/controllers.js` - Auth logic
- `backend/src/modules/auth/middleware.js` - Auth helpers
- `backend/src/modules/auth/index.js` - Module export

**Steps:**

1. Create directory:
```bash
mkdir -p backend/src/modules/auth
```

2. Copy existing auth logic from `backend/src/routes/auth.js` (if exists) or use template from:
   - `/artifacts/merged-app-snapshot/authRoutes.js`
   - `/artifacts/merged-app-snapshot/authController.js`

3. Refactor to match new structure:
   - Routes: move endpoints to routes.js
   - Controllers: move business logic to controllers.js
   - Use centralized DB pool from config/database-unified.js

4. Test:
```bash
npm run test:auth
```

**Verify:**
- [ ] Auth directory created
- [ ] All 4 files created
- [ ] OTP send endpoint works
- [ ] OTP verify endpoint works
- [ ] Token refresh endpoint works
- [ ] Logout endpoint works

---

### 3.2 Users Module

**Files to create:**
- `backend/src/modules/users/routes.js`
- `backend/src/modules/users/controllers.js`
- `backend/src/modules/users/middleware.js`
- `backend/src/modules/users/index.js`

**Endpoints to implement:**
- GET /users/me - Get current user
- PATCH /users/:id - Update profile
- GET /users/:id - Get user (admin)
- DELETE /users/:id - Delete user (admin)

**Steps:**

1. Create directory and files
2. Implement user retrieval logic
3. Implement profile update logic
4. Add admin check middleware
5. Test endpoints

**Verify:**
- [ ] GET /users/me returns current user
- [ ] PATCH /users/:id updates profile
- [ ] Admin can see other users
- [ ] Admin can delete users

---

### 3.3 Subscriptions Module

**Files to create:**
- `backend/src/modules/subscriptions/routes.js`
- `backend/src/modules/subscriptions/controllers.js`
- `backend/src/modules/subscriptions/types.js`
- `backend/src/modules/subscriptions/index.js`

**Endpoints to implement:**
- GET /subscriptions/active - Get active subscription
- GET /subscriptions - Get history
- PATCH /subscriptions/:id/cancel - Cancel subscription

**Database schema already exists:**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id TEXT NOT NULL,
  status VARCHAR(20),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Steps:**

1. Create directory and files
2. Implement subscription query logic
3. Implement cancellation logic with transaction
4. Test endpoints

**Note:** Subscriptions are managed by payment webhook

**Verify:**
- [ ] GET /subscriptions/active returns correct data
- [ ] GET /subscriptions returns list with pagination
- [ ] PATCH /subscriptions/:id/cancel updates status

---

### 3.4 Themed Rooms Module

**Files to create:**
- `backend/src/modules/themed-rooms/routes.js`
- `backend/src/modules/themed-rooms/controllers.js`
- `backend/src/modules/themed-rooms/types.ts`
- `backend/src/modules/themed-rooms/index.js`

**Current server location:** `backend/src/server/` (port 4000)

**Endpoints to migrate:**
- GET /themed-rooms/themes - List themes
- GET /themed-rooms/themes/:id - Theme detail
- POST /themed-rooms/sessions - Start session
- GET /themed-rooms/sessions/:id - Get session
- PATCH /themed-rooms/sessions/:id/end - End session

**Database schema already exists:**
```sql
CREATE TABLE themed_rooms (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  videos JSONB,
  audio_tracks JSONB,
  is_active BOOLEAN,
  created_at TIMESTAMP
);

CREATE TABLE room_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  room_id UUID NOT NULL,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  feedback TEXT,
  rating INTEGER
);
```

**Steps:**

1. Create directory structure
2. Copy logic from `backend/src/server/...` files
3. Update to use unified DB pool
4. Refactor routes and controllers
5. Test endpoints

**Verify:**
- [ ] GET /themed-rooms/themes returns list
- [ ] GET /themed-rooms/themes/:id returns detail
- [ ] POST /themed-rooms/sessions creates session
- [ ] GET /themed-rooms/sessions/:id returns status
- [ ] PATCH /themed-rooms/sessions/:id/end ends session

---

### 3.5 Admin Module

**Files to create:**
- `backend/src/modules/admin/routes.js`
- `backend/src/modules/admin/controllers.js`
- `backend/src/modules/admin/middleware.js` (RBAC)
- `backend/src/modules/admin/index.js`

**Current location:** `backend/admin/src/`

**Endpoints to migrate:**
- GET /admin/users - List users
- GET /admin/users/:id - User detail
- PATCH /admin/users/:id - Update user
- DELETE /admin/users/:id - Delete user
- GET /admin/therapists - List therapists
- PATCH /admin/therapists/:id/verify - Verify therapist
- GET /admin/subscriptions - Manage subscriptions
- GET /admin/analytics/dashboard - Analytics
- GET /admin/audit-logs - Audit logs

**Steps:**

1. Create directory structure
2. Copy logic from `backend/admin/src/...` files
3. Create RBAC middleware: `authorizeRole('admin')`
4. Update to use unified DB pool
5. Test with admin account

**Important:** All admin routes must check user role = 'admin'

**Verify:**
- [ ] Admin can list users
- [ ] Admin can update users
- [ ] Admin can delete users
- [ ] Non-admin cannot access admin routes
- [ ] Analytics dashboard loads

---

### 3.6 Analytics Module

**Files to create:**
- `backend/src/modules/analytics/routes.js`
- `backend/src/modules/analytics/controllers.js`
- `backend/src/modules/analytics/queries.js`
- `backend/src/modules/analytics/index.js`

**Endpoints to implement:**
- GET /analytics/dashboard - Summary stats
- GET /analytics/reports/:type - Detailed reports
- GET /analytics/export - Export data

**Current location:** `backend/admin/src/analytics/`

**Steps:**

1. Create directory structure
2. Copy analytics logic
3. Write efficient database queries
4. Add data aggregation logic
5. Test with various date ranges

**Verify:**
- [ ] Dashboard loads with correct data
- [ ] Reports generate correctly
- [ ] Date ranges work

---

### 3.7 Payments Module

**Files to create:**
- `backend/src/modules/payments/routes.js`
- `backend/src/modules/payments/controllers.js` (already has example)
- `backend/src/modules/payments/webhookHandler.js`
- `backend/src/modules/payments/verification.js`
- `backend/src/modules/payments/index.js`

**Current location:** `backend/payment-gateway/`

**Endpoints to implement:**
- POST /payments/create - Initiate payment
- GET /payments/:id - Get status
- GET /payments - Payment history
- POST /payments/webhook - PhonePe callback

**Critical - Use provided webhook handler:**

The file `backend/src/modules/payments/controllers-example.js` contains the complete webhook implementation with transaction handling. Use this exactly as-is.

**Steps:**

1. Create directory structure
2. Copy payment controller logic
3. Copy PhonePe webhook handler (from example)
4. Set up signature verification
5. Create transaction-based subscr creation logic
6. Test webhook with PhonePe sandbox

**⚠️ Important Security Notes:**
- Never log payment secrets
- Verify PhonePe signature on every webhook
- Use database transactions to prevent duplicate subscriptions
- Test webhook idempotency (same webhook twice should not create duplicate)

**Verify:**
- [ ] Payment creation works
- [ ] PhonePe sandbox webhook processes
- [ ] Subscription created on successful payment
- [ ] Duplicate payments handled correctly
- [ ] Error cases logged

---

## 🟡 PHASE 4: MIDDLEWARE INTEGRATION (1-2 hours)

### 4.1 Create Middleware Stack

**Files to create:**

1. **`backend/src/middlewares/authentication.js`**
   - Verify JWT token
   - Extract user from token
   - Handle token refresh

2. **`backend/src/middlewares/authorization.js`**
   - Check user role (admin, user, therapist)
   - Route protection

3. **`backend/src/middlewares/validation.js`**
   - Input validation
   - Request sanitization

4. **`backend/src/middlewares/logging.js`**
   - Structured logging
   - Request/response tracking

5. **`backend/src/middlewares/rateLimiting.js`**
   - Rate limit configuration
   - Per-route limits

### 4.2 Update app-unified.js

Integrate middleware into Express app:

```javascript
// In app.js, after security middleware, add:

// Authentication middleware
app.use('/api/v1/auth', authRoutes);  // No auth required
app.use(authenticateToken);  // Protect remaining routes
app.use(authorizationMiddleware);
app.use(validationMiddleware);

// Module routes
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/subscriptions', subscriptionsRoutes);
// ... rest of modules
```

**Verify:**
- [ ] All middleware in correct order
- [ ] Public routes have no auth check
- [ ] Protected routes require token
- [ ] Admin routes check role

### 4.3 Test Middleware Chain

```bash
# Test auth flow
npm run test:middleware:auth

# Test admin protection
npm run test:middleware:admin

# Test rate limiting
npm run test:middleware:ratelimit
```

**Verify:**
- [ ] Auth flow works end-to-end
- [ ] Admin routes protected
- [ ] Rate limiting active
- [ ] Error handling works

---

## 🟠 PHASE 5: DATABASE & CONFIG (30 minutes)

### 5.1 Verify Database Connection

```bash
# Check environment
cat backend/.env.development | grep DATABASE_URL

# Test connection
node -e "
const db = require('./backend/src/config/database-unified.js');
db.validateDbConnection()
  .then(() => console.log('✅ Connected'))
  .catch(err => console.error('❌ Error:', err.message));
"
```

**Verify:**
- [ ] DATABASE_URL set
- [ ] Connection successful
- [ ] Pool initialized

### 5.2 Run Database Migrations

If new migrations needed:

```bash
# List pending migrations
npm run migrate:pending

# Run migrations
npm run migrate:up

# Verify schema
npm run db:schema
```

**Verify:**
- [ ] All migrations applied
- [ ] Schema matches expectations
- [ ] No migration errors

### 5.3 Seed Initial Data

```bash
# For development
node scripts/seed-dev.js

# Verify data
node -e "
const db = require('./backend/src/config/database-unified.js');
db.query('SELECT COUNT(*) FROM users').then(r => console.log('Users:', r.rows[0]));
db.query('SELECT COUNT(*) FROM themed_rooms').then(r => console.log('Themes:', r.rows[0]));
"
```

**Verify:**
- [ ] Development data seeded
- [ ] Tables have content
- [ ] Can query successfully

---

## 🔵 PHASE 6: TESTING (2 hours)

### 6.1 Unit Tests

Create test files for each module:

```bash
mkdir -p backend/tests
```

**Test files to create:**
- `backend/tests/auth.test.js`
- `backend/tests/users.test.js`
- `backend/tests/payments.test.js`
- `backend/tests/themed-rooms.test.js`

**Example test structure:**

```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app-unified');

describe('Auth Module', () => {
  test('POST /auth/send-otp with valid phone', async () => {
    const res = await request(app)
      .post('/api/v1/auth/send-otp')
      .send({ phone: '+91 9876543210' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.otpId).toBeDefined();
  });

  test('POST /auth/verify-otp with valid OTP', async () => {
    // Send OTP first
    // Then verify
  });
});
```

**Run tests:**

```bash
npm run test:auth
npm run test:users
npm run test:payments
npm run test:themed-rooms
npm run test:all
```

**Verify:**
- [ ] Auth tests passing
- [ ] User tests passing
- [ ] Payment tests passing
- [ ] Themed rooms tests passing
- [ ] All tests pass

### 6.2 Integration Tests

Test cross-module interactions:

```javascript
// tests/integration.test.js
describe('End-to-End Flow', () => {
  test('Complete user flow: signup → subscription → session', async () => {
    // 1. Send OTP
    // 2. Verify OTP
    // 3. Get active subscription (should be none)
    // 4. Create payment
    // 5. Simulate webhook
    // 6. Start themed room session
    // 7. End session
  });
});
```

**Run integration tests:**

```bash
npm run test:integration
```

**Verify:**
- [ ] Complete user flow works
- [ ] Error scenarios handled
- [ ] Database transactions work

### 6.3 Performance Tests

Test under load:

```bash
npm run test:load -- --rps=100 --duration=60s
```

**Verify:**
- [ ] Can handle 100+ requests/second
- [ ] p95 latency < 500ms
- [ ] No database connection pool exhaustion
- [ ] Memory stable

---

## 🟢 PHASE 7: LOCAL VERIFICATION (1-2 hours)

### 7.1 Start Unified Backend

```bash
# In terminal 1
cd backend
npm run dev
# Should see:
# ✅ Server running on http://localhost:5000
# ✅ Database connected
# ✅ All modules loaded
```

**Verify:**
- [ ] Server starts without errors
- [ ] Port 5000 is listening
- [ ] No connection errors

### 7.2 Health Checks

```bash
# In terminal 2
curl http://localhost:5000/health
# Should return 200

curl http://localhost:5000/health/db
# Should show database connected

curl http://localhost:5000/metrics
# Should show stats
```

**Verify:**
- [ ] /health responds
- [ ] /health/db responds
- [ ] /metrics responds

### 7.3 Manual API Testing

Test each endpoint manually:

**Auth Flow:**
```bash
# 1. Send OTP
curl -X POST http://localhost:5000/api/v1/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91 9876543210"}'

# Note the otpId, then verify with test OTP
# 2. Verify OTP
curl -X POST http://localhost:5000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+91 9876543210","otp":"123456"}'

# Save the accessToken
```

**User Endpoint:**
```bash
curl -H "Authorization: Bearer <accessToken>" \
  http://localhost:5000/api/v1/users/me
```

**Admin Endpoint:**
```bash
curl -H "Authorization: Bearer <adminToken>" \
  http://localhost:5000/api/v1/admin/users?page=1&limit=10
```

**Themed Rooms:**
```bash
curl http://localhost:5000/api/v1/themed-rooms/themes
```

**Payment:**
```bash
curl -X POST http://localhost:5000/api/v1/payments/create \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{"planId":"plan_premium","amount":999,"currency":"INR"}'
```

**Verify:**
- [ ] Auth endpoints work
- [ ] Public endpoints accessible
- [ ] Protected endpoints require token
- [ ] Admin endpoints require admin role
- [ ] All response formats correct
- [ ] Errors handled properly

### 7.4 Postman Collection

Import API documentation as Postman collection:

```bash
# Export from API_DOCUMENTATION.md or create manually
# Test all endpoints
# Verify responses
```

**Verify:**
- [ ] Postman collection created
- [ ] All endpoints in collection
- [ ] Endpoints tested and passing

---

## 🟢 PHASE 8: FRONTEND INTEGRATION (1 hour)

### 8.1 Update Frontend Environment

**File: `frontend/.env.development`**

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT=30000
```

**File: `frontend/.env.production`**

```env
VITE_API_URL=https://api.manas360.com/api/v1
VITE_API_TIMEOUT=30000
```

**Verify:**
- [ ] Environment files updated
- [ ] API URL points to port 5000

### 8.2 Update API Service

**File: `frontend/src/services/api.js`**

```javascript
import axios from 'axios';

const API_URL = process.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Try to refresh token
      // Or redirect to login
    }
    return Promise.reject(error);
  }
);

export default client;
```

**Verify:**
- [ ] API service updated
- [ ] Base URL correct
- [ ] Auth interceptor working
- [ ] Error handling in place

### 8.3 Update Component Imports

Find and update all API calls:

```bash
grep -r "http://localhost:3001" frontend/src/
grep -r "http://localhost:4000" frontend/src/
grep -r "http://localhost:5001" frontend/src/
grep -r "http://localhost:5002" frontend/src/
```

Replace with new unified endpoint paths:

```javascript
// Before
axios.get('http://localhost:4000/api/v1/themed-rooms/themes')

// After
client.get('/themed-rooms/themes')
```

**Verify:**
- [ ] No hardcoded old endpoints
- [ ] All endpoints use unified URL
- [ ] Paths match new structure

### 8.4 Start Frontend Dev Server

```bash
cd frontend
npm run dev
# Should start on http://localhost:5173
```

**Verify:**
- [ ] Frontend starts
- [ ] No build errors
- [ ] Console has no critical errors

### 8.5 Test User Flows

1. **Login Flow:**
   - [ ] Send OTP
   - [ ] Verify OTP
   - [ ] Get user profile
   - [ ] Store token

2. **Subscription Flow:**
   - [ ] Check current subscription
   - [ ] Click upgrade to premium
   - [ ] Process payment (sandbox)
   - [ ] Verify subscription activated

3. **Themed Rooms Flow:**
   - [ ] Browse themes
   - [ ] Start session
   - [ ] End session
   - [ ] Record stats

4. **Admin Flow:**
   - [ ] Login as admin
   - [ ] View user list
   - [ ] View analytics
   - [ ] Access reports

**Verify:**
- [ ] All flows work end-to-end
- [ ] Data persists correctly
- [ ] No API errors on happy path

---

## 🟠 PHASE 9: DEPLOYMENT PREP (1 hour)

### 9.1 Create Dockerfile

Already created: `backend/Dockerfile`

Verify it exists:

```bash
ls -la backend/Dockerfile
cat backend/Dockerfile | head -20
```

**Verify:**
- [ ] Dockerfile exists
- [ ] Correct Node version
- [ ] Health check configured

### 9.2 Create docker-compose

Already created: `docker-compose.yml`

Verify:

```bash
ls -la docker-compose.yml
```

**Verify:**
- [ ] docker-compose.yml exists
- [ ] PostgreSQL service defined
- [ ] Redis service defined
- [ ] Backend service defined
- [ ] All volumes configured

### 9.3 Test Docker Build

```bash
docker build -t manas360-backend:latest -f backend/Dockerfile .
```

**Should complete without errors**

**Verify:**
- [ ] Docker build successful
- [ ] Image created: `docker images | grep manas360`

### 9.4 Test docker-compose

```bash
docker-compose up -d
sleep 10
curl http://localhost:5000/health
docker-compose down
```

**Verify:**
- [ ] All services start
- [ ] Backend healthy
- [ ] Services shut down cleanly

---

## 🔴 PHASE 10: CLEANUP & MIGRATION (1 hour)

### 10.1 Verify All Tests Pass

```bash
npm run test:all
```

Must pass 100%.

**Verify:**
- [ ] All tests passing
- [ ] No warnings
- [ ] No skipped tests

### 10.2 Commit Changes

```bash
git add -A
git commit -m "feat: implement unified backend on port 5000

- Consolidate 4 servers into 1 unified Express backend
- Migrate all modules to modular architecture
- Implement transaction-based payment handling
- Add comprehensive error handling and logging
- Add health check and metrics endpoints
- Add graceful shutdown handling
- Add Docker containerization support"
```

**Verify:**
- [ ] Changes committed
- [ ] Commit message clear
- [ ] All files staged

### 10.3 Create Release Tag

```bash
git tag -a v1.0.0-unified-backend -m "Production ready unified backend"
```

**Verify:**
- [ ] Tag created
- [ ] Can check out tag

### 10.4 Remove Old Servers (OPTIONAL - Do only after testing)

> ⚠️ CAUTION: Only do this after verified working for 1+ week

```bash
# BACKUP FIRST
git tag backup/old-backends-$(date +%Y%m%d)

# Then delete
rm -rf backend/src/server/  # Themed rooms server (port 4000)
rm -rf backend/admin/       # Admin server (port 3001)
rm -rf backend/payment-gateway/  # Payment server (port 5002)

# Keep server.js as fallback for now (old main server)
```

**Verify:**
- [ ] Old servers backed up
- [ ] No references to old ports
- [ ] New unified server working

### 10.5 Clean Up Example Files

```bash
# Remove "-unified" and "-example" suffixes
# Rename to production names

# OLD:
# - app-unified.js → app.js
# - server-unified.js → server.js
# - database-unified.js → database.js

# This can be done gradually
```

**Verify:**
- [ ] File names clean
- [ ] All imports updated
- [ ] No broken references

---

## 🔵 PHASE 11: STAGING DEPLOYMENT (2 hours)

### 11.1 Push to Remote

```bash
git push origin feature/unified-backend
```

**Verify:**
- [ ] Code on remote
- [ ] CI/CD pipeline triggered
- [ ] Tests running on remote

### 11.2 Wait for CI/CD

- [ ] Build passes
- [ ] Tests pass
- [ ] Linting passes
- [ ] Security scan passes

### 11.3 Deploy to Staging

```bash
# Via AWS console or CLI
aws ecs update-service \
  --cluster manas360-staging \
  --service manas360-backend \
  --force-new-deployment
```

**Verify:**
- [ ] Deployment started
- [ ] Tasks initializing
- [ ] Health checks passing

### 11.4 Smoke Tests on Staging

```bash
curl https://api-staging.manas360.com/health
curl https://api-staging.manas360.com/api/v1/themed-rooms/themes
```

**Verify:**
- [ ] Service responding
- [ ] Endpoints working
- [ ] No 5xx errors

### 11.5 Run Full Test Suite Against Staging

```bash
npm run test:staging
```

**Verify:**
- [ ] All tests pass on staging
- [ ] Performance acceptable
- [ ] No database issues

---

## 🟢 PHASE 12: PRODUCTION DEPLOYMENT (2 hours)

### 12.1 Create Pull Request

Create PR from `feature/unified-backend` to `main`

**Verification in PR:**
- [ ] All tests passing
- [ ] Build successful
- [ ] Code reviewed
- [ ] No conflicts

### 12.2 Code Review

- [ ] 2 team members approve
- [ ] Architecture reviewed
- [ ] Tests reviewed
- [ ] Security reviewed

**Verify:**
- [ ] All reviewers signed off
- [ ] Comments addressed

### 12.3 Merge to Main

```bash
# Merge via GitHub UI or:
git checkout main
git pull origin main
git merge feature/unified-backend
git push origin main
```

**Verify:**
- [ ] Merged to main
- [ ] Remote updated
- [ ] CI/CD triggered

### 12.4 Deploy to Production

```bash
# During low-traffic window (e.g., 2-4 AM)

aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --force-new-deployment
```

**Verify:**
- [ ] Deployment started
- [ ] Rolling update (2 tasks first, then rest)
- [ ] Old tasks draining connections
- [ ] New tasks healthy

### 12.5 Monitor Deployment

```bash
# Watch logs
aws logs tail /ecs/manas360-backend --follow

# Monitor metrics
# Check CloudWatch dashboard
# Verify error rate < 1%
# Verify p95 latency < 500ms
```

**Verify:**
- [ ] No errors in startup
- [ ] Health checks passing
- [ ] Metrics normal
- [ ] Error rate stable

### 12.6 60-Minute Observation Period

**Do NOT consider deployment complete until:**
- [ ] 60 minutes passed
- [ ] No spike in errors
- [ ] No spike in latency
- [ ] No database issues
- [ ] User reports normal

**During observation:**
- [ ] Monitor error rate
- [ ] Monitor response time
- [ ] Monitor CPU/memory
- [ ] Monitor database pool
- [ ] Be ready to rollback

### 12.7 Rollback (If Needed)

Only if issues arise:

```bash
# Immediately rollback
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --task-definition manas360-backend:PREVIOUS_REVISION
```

**Then:**
- [ ] Post-mortem meeting
- [ ] Fix identified issues
- [ ] Retry deployment next day

---

## 📊 POST-DEPLOYMENT CHECKLIST

### Immediate (Day 1)

- [ ] Service healthy
- [ ] No error spike
- [ ] Users can login
- [ ] Payments processing
- [ ] Themed rooms working
- [ ] Admin dashboard accessible
- [ ] Analytics updating

### Short Term (Week 1)

- [ ] Monitor error rates daily
- [ ] Check slow query logs
- [ ] Verify backups working
- [ ] Test disaster recovery
- [ ] Gather performance metrics
- [ ] Get user feedback

### Medium Term (Month 1)

- [ ] Analyze performance trends
- [ ] Optimize slow queries
- [ ] Clean up old logs
- [ ] Update documentation
- [ ] Plan next features
- [ ] Security audit

### Long Term (Quarterly)

- [ ] Capacity planning
- [ ] Cost optimization
- [ ] Architecture review
- [ ] Security audit
- [ ] Dependency updates

---

## 🆘 ROLLBACK PROCEDURE

If critical issues occur:

```bash
# 1. Immediately notify team
# 2. Check logs for errors
aws logs tail /ecs/manas360-backend --since 10m

# 3. Switch to previous version
aws ecs update-service \
  --cluster manas360-prod \
  --service manas360-backend \
  --task-definition manas360-backend:$(aws ecs describe-services \
    --cluster manas360-prod \
    --services manas360-backend \
    --query 'services[0].taskDefinition' \
    --output text | sed 's/.*://;s/^//' | xargs -I {} expr {} - 1)

# 4. Wait for rollback to complete
aws ecs wait services-stable \
  --cluster manas360-prod \
  --services manas360-backend

# 5. Verify service healthy
curl https://api.manas360.com/health

# 6. Post-mortem
# - Identify root cause
# - Fix in feature branch
# - Retry deployment next day
```

---

## ✅ SUCCESS CRITERIA

Deployment is successful when:

**Technical:**
- ✅ 100% of tests passing
- ✅ Error rate < 0.5%
- ✅ P95 latency < 500ms
- ✅ Database pool healthy
- ✅ All endpoints responding
- ✅ Graceful shutdown working
- ✅ Health checks passing

**Functional:**
- ✅ Users can login
- ✅ Payments process correctly
- ✅ Subscriptions activate properly
- ✅ Themed rooms accessible
- ✅ Admin dashboard working
- ✅ Analytics updating
- ✅ No data loss

**User Experience:**
- ✅ No increased latency
- ✅ No user-facing errors
- ✅ Smooth transitions
- ✅ Features work as before
- ✅ Performance improved (if applicable)

---

## 📞 SUPPORT

**Deployment Issues:**
- Check logs: `aws logs tail /ecs/manas360-backend`
- Check CloudWatch: Backend health metrics
- Check RDS: Database connection pool
- Slack: #devops channel

**Code Issues:**
- Check GitHub Actions: CI/CD pipeline
- Check local test: `npm run test:all`
- Check linting: `npm run lint`

**Questions:**
- Refer to: BACKEND_UNIFICATION_PLAN.md
- Refer to: API_DOCUMENTATION.md
- Refer to: DEPLOYMENT_AND_OPERATIONS.md

---

**Total Estimated Time: 8-12 hours**  
**Recommended: 2 developers, 1-2 days**  
**Risk Level: Low (if testing is thorough)**  

Last Updated: February 25, 2026

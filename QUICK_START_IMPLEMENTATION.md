# Quick Start: Full-Stack Stabilization Implementation

## ⚡ 5-Minute Setup

### 1. Clone/Check Repository
```bash
cd /Users/chandu/Downloads/manas360-ui-main
git status  # Verify all new files are present
```

### 2. Create Environment File
```bash
# Create .env file
cat > .env << 'EOF'
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/manas360_db

# JWT Secrets (generate your own)
JWT_SECRET=your-super-secret-key-at-least-64-characters-long-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-64-characters-long-change-this

# CORS
CORS_ORIGIN=http://localhost:5173

# Payment Gateway (optional for now)
PHONPE_API_KEY=your-api-key
PHONPE_API_SECRET=your-api-secret
PHONPE_MERCHANT_ID=your-merchant-id

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
EOF
```

**Generate secure secrets:**
```bash
# Terminal command
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup Database
```bash
# Create PostgreSQL database
createdb manas360_db

# Run schema migration
psql manas360_db < backend/migrations/unified-schema.sql

# Verify table creation
psql manas360_db -c "\dt"
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Server
```bash
# Option 1: Development mode (with hot reload)
npm run dev

# Option 2: Direct start
node backend/src/unified-server.js

# Should see:
# ✅ Environment validation passed
# ✅ Database connected
# 🚀 Server running on http://localhost:5000
```

### 6. Test Health Endpoint
```bash
# Terminal
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2026-02-24T..."}
```

**Done! ✅ Server is ready.**

---

## 📋 Complete Implementation Roadmap

### Phase 1: Backend Routes (2-3 hours)
**Goal:** Create all endpoint handlers

**Tasks:**
1. [ ] Create `/backend/src/routes/` directory
2. [ ] Create `authRoutes.js` with endpoints:
   - POST `/api/v1/auth/send-otp` - Send OTP to mobile
   - POST `/api/v1/auth/verify-otp` - Verify OTP, return tokens
   - POST `/api/v1/auth/refresh` - Refresh access token
   - POST `/api/v1/auth/logout` - Logout user

3. [ ] Create `userRoutes.js`:
   - GET `/api/v1/users/me` - Get current user
   - PATCH `/api/v1/users/me` - Update profile

4. [ ] Create `subscriptionRoutes.js`:
   - GET `/api/v1/subscriptions/plans` - List plans
   - GET `/api/v1/subscriptions/current` - Get user's subscription
   - POST `/api/v1/subscriptions/upgrade` - Upgrade plan
   - POST `/api/v1/subscriptions/cancel` - Cancel subscription

5. [ ] Create `paymentRoutes.js`:
   - POST `/api/v1/payments/create` - Initiate payment
   - POST `/api/v1/payments/webhook` - PhonePe webhook
   - GET `/api/v1/payments/:id` - Get payment status

6. [ ] Create `themedRoomsRoutes.js`:
   - GET `/api/v1/themed-rooms/themes` - List meditation themes
   - POST `/api/v1/themed-rooms/sessions` - Start session
   - PATCH `/api/v1/themed-rooms/sessions/:id` - End session

7. [ ] Create `adminRoutes.js`:
   - GET `/api/v1/admin/users` - List users
   - PUT `/api/v1/admin/users/:id/suspend` - Suspend user
   - DELETE `/api/v1/admin/users/:id/suspend` - Unsuspend user

8. [ ] Update `unified-server.js` to import all routes:
   ```javascript
   import authRoutes from './routes/authRoutes.js';
   import userRoutes from './routes/userRoutes.js';
   // ... import all routes
   
   app.use('/api/v1/auth', authRoutes);
   app.use('/api/v1/users', userRoutes);
   // ... register all routes
   ```

**Verification Checklist:**
- [ ] All routes return 2xx or proper error codes
- [ ] Auth required routes return 401 without token
- [ ] Admin routes return 403 without admin role
- [ ] Request/response match API contract

---

### Phase 2: Controllers & Business Logic (2 hours)
**Goal:** Move business logic to controllers

**File Structure:**
```
backend/src/controllers/
├── authController.js
├── userController.js
├── subscriptionController.js
├── paymentController.js
├── themedRoomsController.js
└── adminController.js
```

**Example Controller Pattern:**
```javascript
// backend/src/controllers/authController.js
export async function sendOtp(req, res, next) {
  try {
    const { mobile } = req.body;
    
    // Validate
    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number'
      });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Send via SMS (PhonePe or custom)
    // await smsSender.send(mobile, `Your OTP is ${otp}`);
    
    // Save to cache/DB for verification
    // await otpStore.set(mobile, otp, 10 * 60); // 10 min expiry
    
    return res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    next(error);
  }
}
```

---

### Phase 3: Frontend Integration (1.5 hours)
**Goal:** Update React app to use new API

**Tasks:**
1. [ ] Copy `apiClient-unified.ts` to `frontend/utils/`
2. [ ] Update API base URL in components:
   ```typescript
   import apiClient from '@/utils/apiClient-unified';
   
   // Before: fetch('http://localhost:3001/users/profile')
   // After:
   const user = await apiClient.users.getProfile();
   ```

3. [ ] Add token refresh interceptor handling
4. [ ] Update error handling for new response format
5. [ ] Update authentication flow (OTP instead of password)
6. [ ] Add permission checks in UI:
   ```typescript
   import { apiClient } from '@/utils/apiClient-unified';
   
   if (apiClient.userHasRole('premium')) {
     // Show premium feature
   }
   ```

---

### Phase 4: Testing (2-3 hours)
**Goal:** Run verification tests

**Test Files to Create:**
```
tests/
├── 1-auth.test.cjs         # OTP, tokens, refresh
├── 2-rbac.test.cjs         # Role/permission checks
├── 3-subscriptions.test.cjs # Plan, upgrade, feature gating
├── 4-payments.test.cjs      # Payment flow, webhook
├── 5-themedRooms.test.cjs   # Sessions, tracking
└── 6-security.test.cjs      # Rate limiting, injection, XSS
```

**Run Tests:**
```bash
npm test                    # All tests
npm test -- 1-auth        # Only auth tests
npm test -- --coverage    # With coverage report
```

**Success Criteria:**
- [ ] All 100+ test cases passing
- [ ] Code coverage > 80%
- [ ] No critical security issues

---

### Phase 5: Deployment (4-8 hours)
**Goal:** Deploy to production

**Pre-Deployment Checklist:**
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Performance benchmarked

**Deployment Steps:**
```bash
# 1. Create backup
pg_dump manas360_db > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Run migration on production database
psql production_db < backend/migrations/unified-schema.sql

# 3. Build and deploy backend
npm run build
npm start

# 4. Deploy frontend
npm run build:frontend
# Deploy to static hosting

# 5. Smoke test
curl https://api.yourdomain.com/health
```

**Post-Deployment Monitoring:**
- [ ] Monitor error logs
- [ ] Track payment webhooks
- [ ] Check API response times
- [ ] Monitor database connections
- [ ] Verify all endpoints accessible

---

## 🔑 Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| `FULL_STACK_STABILIZATION_PLAN.md` | 10-phase roadmap | 40KB |
| `backend/src/unified-server.js` | Main Express app | 280+ |
| `backend/migrations/unified-schema.sql` | Database schema | 350+ |
| `backend/src/middleware/authMiddleware-unified.js` | Token management | 280+ |
| `backend/src/middleware/rbacMiddleware-unified.js` | Access control | 250+ |
| `backend/src/middleware/subscriptionGating.js` | Feature gating | 250+ |
| `backend/src/middleware/errorHandler.js` | Error handling | 280+ |
| `backend/src/config/database.js` | DB connection | 70 |
| `backend/src/config/environment.js` | Config validation | 180+ |
| `frontend/utils/apiClient-unified.ts` | API client | 450+ |
| `TESTING_CHECKLIST.md` | Test specifications | 600+ |
| `PRODUCTION_READINESS_VERDICT.md` | Deployment approval | 800+ |

---

## 🧪 Sample Test Execution

```javascript
// Example: Test auth flow
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAuthFlow() {
  try {
    // Step 1: Send OTP
    const otpRes = await axios.post(`${BASE_URL}/auth/send-otp`, {
      mobile: '9876543210'
    });
    console.log('✓ OTP sent:', otpRes.data);
    
    // Step 2: Verify OTP (use 123456 in dev)
    const verifyRes = await axios.post(`${BASE_URL}/auth/verify-otp`, {
      mobile: '9876543210',
      otp: '123456'
    });
    console.log('✓ OTP verified:', verifyRes.data);
    
    const { accessToken, refreshToken } = verifyRes.data;
    
    // Step 3: Get user profile
    const profileRes = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    console.log('✓ Profile fetched:', profileRes.data);
    
    // Step 4: Refresh token
    const refreshRes = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken
    });
    console.log('✓ Token refreshed:', refreshRes.data);
    
    console.log('\n✅ All auth tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAuthFlow();
```

**Run test:**
```bash
node test-auth-flow.js
```

---

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 5000 in use** | Change PORT in .env or `lsof -i :5000` to kill |
| **Database connection fails** | Check DATABASE_URL, verify PostgreSQL running |
| **JWT secret too short** | Use 64+ character secrets, run generation command |
| **Token refresh loop** | Check secret length, verify token expiry times |
| **CORS error** | Add frontend URL to CORS_ORIGIN in .env |
| **Admin routes 403** | Verify user role is 'admin', check RBAC middleware |
| **Payment webhook not firing** | Check PhonePe credentials, whitelist IP, test webhook URL |
| **Tests failing** | Check database seeded, clear cache, restart server |

---

## 📞 Quick Support

### Check Server Status
```bash
# Health check
curl http://localhost:5000/health

# Database check
curl http://localhost:5000/health/db

# Full diagnostics
curl http://localhost:5000/health/full
```

### View Logs
```bash
# Development mode
NODE_ENV=development node backend/src/unified-server.js 2>&1 | tail -100

# With filtering
npm run dev 2>&1 | grep "ERROR\|WARNING"
```

### Reset Database
```bash
# ⚠️ WARNING: This deletes all data
dropdb manas360_db
createdb manas360_db
psql manas360_db < backend/migrations/unified-schema.sql
```

---

## ✅ Implementation Checklist

**Before Starting:**
- [ ] Read FULL_STACK_STABILIZATION_PLAN.md
- [ ] Review all middleware files
- [ ] Understand database schema
- [ ] Setup local PostgreSQL

**Phase 1 (Routes):**
- [ ] Create routes directory
- [ ] Implement all 28 endpoints
- [ ] Wire routes into unified-server.js
- [ ] Test all endpoints with curl/Postman

**Phase 2 (Controllers):**
- [ ] Extract business logic to controllers
- [ ] Add database queries
- [ ] Add error handling
- [ ] Test with real data

**Phase 3 (Frontend):**
- [ ] Copy apiClient-unified.ts
- [ ] Update components to use new API
- [ ] Test token refresh flow
- [ ] Add permission checks

**Phase 4 (Testing):**
- [ ] Run unit tests
- [ ] Run integration tests
- [ ] Run security tests
- [ ] Achieve > 80% coverage

**Phase 5 (Deployment):**
- [ ] Setup production database
- [ ] Configure environment
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Smoke test all endpoints

---

## 🎯 Success Metrics

**End of Day 1:**
- [ ] Server running, health endpoint responding
- [ ] Auth routes tested and working
- [ ] Database schema loaded

**End of Day 2:**
- [ ] All routes implemented
- [ ] Frontend updated and integrated
- [ ] > 50% tests passing

**End of Day 3:**
- [ ] 100+ tests passing
- [ ] All RBAC enforced
- [ ] Payment flow tested

**End of Week 1:**
- [ ] 95%+ integration verified
- [ ] Deployed to staging
- [ ] Performance benchmarked
- [ ] Ready for production

---

## 📚 Documentation Links

- [Full Stabilization Plan](./FULL_STACK_STABILIZATION_PLAN.md)
- [Testing Checklist](./TESTING_CHECKLIST.md)
- [Production Readiness](./PRODUCTION_READINESS_VERDICT.md)
- [All Deliverables](./STABILIZATION_DELIVERABLES.md)

---

## 🚀 Ready to Begin!

**Next Steps:**
1. Execute 5-minute setup above
2. Start server: `npm run dev`
3. Follow Phase 1 (Routes) in roadmap
4. Execute tests from TESTING_CHECKLIST.md
5. Deploy when all tests pass

**Estimated Timeline:**
- Phase 1 (Routes): 2-3 hours
- Phase 2 (Controllers): 2 hours
- Phase 3 (Frontend): 1.5 hours
- Phase 4 (Testing): 2-3 hours
- Phase 5 (Deployment): 4-8 hours
- **Total: 8-12 hours** with 2 developers

---

**Status:** ✅ Ready to implement  
**Created:** Feb 24, 2026  
**Version:** 1.0

# 🏗️ BACKEND UNIFICATION MASTER PLAN

**Date:** February 25, 2026  
**Scope:** Consolidate 4 isolated backend servers into 1 unified Express backend  
**Status:** READY FOR IMPLEMENTATION

---

## 📊 CURRENT STATE ANALYSIS

### 4 Separate Server Instances

| Server | Port | Location | Purpose | Issues |
|--------|------|----------|---------|--------|
| Main Backend | 5001 | `server.js` | Auth + Admin (imported) | Dynamic import, no consistency |
| Themed Rooms | 4000 | `backend/src/server/` | AR meditation video API | No DB, isolated |
| Admin Analytics | 3001 | `backend/admin/src/` | Analytics + Admin ops | CommonJS, separate pool |
| Payment Gateway | 5002 | `backend/payment-gateway/` | Payment processing | CommonJS, no auth checks |

### Duplication Issues

```
❌ Database Connections: 3 separate Pool instances
❌ Middleware: Auth applied inconsistently  
❌ Error Handling: 4 different error patterns
❌ Logging: No centralized logging
❌ CORS: 4 different CORS configurations
❌ Rate Limiting: Only in analytics
❌ Security: Helmet only in analytics
❌ Routes: Not versioned consistently
```

---

## 🎯 MIGRATION STRATEGY (PHASE-BASED)

### PHASE 1: PREPARATION (No Code Changes)

**Week 1, Day 1-2:**

- [ ] **Audit all 4 backends for:**
  - Unique business logic
  - Database queries
  - Middleware functions
  - Webhook signatures
  - Payment verification logic
  - Auth flows
  
- [ ] **Document:**
  - All environment variables used
  - All database tables accessed
  - All external APIs called
  - All error codes returned
  - All webhooks received

- [ ] **Create:**
  - Mapping of endpoints to modules
  - List of dependencies to import
  - Test coverage for each route
  - Rollback plan

---

### PHASE 2: STRUCTURE SETUP (New Folder, No Logic)

**Week 1, Day 3-4:**

- [ ] Create new folder structure in `backend/unified/`
- [ ] Create all module folders (empty)
- [ ] Copy all middleware files to unified location
- [ ] Copy database config
- [ ] Create new app.js (template only)
- [ ] Create new server.js (template only)
- [ ] NO CHANGES to current servers yet (keep both running)

---

### PHASE 3: MIGRATE ONE MODULE AT A TIME

**Week 2-3:**

**Module Order (testability sequence):**

1. **Auth Module** (Test: Login/Register flow)
2. **Users Module** (Test: Profile management)
3. **Subscriptions Module** (Test: Plan selection)
4. **Admin Module** (Test: Admin-only routes)
5. **Analytics Module** (Test: Data collection)
6. **Payments Module** (Test: Payment webhook)
7. **Themed Rooms Module** (Test: Video streaming)

**For each module:**

- [ ] Copy all routes to `modules/<name>/routes.js`
- [ ] Copy all controllers to `modules/<name>/controllers.js`
- [ ] Create `modules/<name>/index.js` as entry point
- [ ] Mount in unified app.js
- [ ] Write integration tests
- [ ] Run tests against unified backend
- [ ] Keep old server running (parallel testing)
- [ ] After tests pass: Commit, tag as "Module-X-Ready"

---

### PHASE 4: MIDDLEWARE CONSOLIDATION

**Week 3:**

- [ ] Move all auth middleware → `middlewares/auth.js`
- [ ] Move all RBAC → `middlewares/rbac.js`
- [ ] Move all security → `middlewares/security.js`
- [ ] Create error handler → `middlewares/errorHandler.js`
- [ ] Create request logger → `middlewares/logger.js`
- [ ] Apply globally in app.js

---

### PHASE 5: DATABASE CONSOLIDATION

**Week 3-4:**

- [ ] Create single Pool in `config/database.js`
- [ ] Remove all duplicate connections
- [ ] Test connection pooling under load
- [ ] Verify all migrations run correctly
- [ ] Add health check endpoint

---

### PHASE 6: TESTING & VALIDATION

**Week 4:**

| Test | Command | Pass/Fail |
|------|---------|-----------|
| Auth flow | `npm run test:auth` | ? |
| User CRUD | `npm run test:users` | ? |
| Subscription create | `npm run test:subscriptions` | ? |
| Admin access | `npm run test:admin` | ? |
| Analytics tracking | `npm run test:analytics` | ? |
| Payment webhook | `npm run test:payments` | ? |
| Themed rooms | `npm run test:rooms` | ? |
| Load test 1000 req/s | `npm run test:load` | ? |
| Security scan | `npm run test:security` | ? |

---

### PHASE 7: FRONTEND MIGRATION

**Week 4-5:**

- [ ] Update API base URL to `http://localhost:5000/api/v1`
- [ ] Test all axios calls against new paths
- [ ] Update admin panel base URL
- [ ] Update payment integration endpoints
- [ ] Remove hardcoded theme data (connect to API)

---

### PHASE 8: DEPLOYMENT & CLEANUP

**Week 5:**

- [ ] Deploy unified backend to staging
- [ ] Run smoke tests
- [ ] Verify all integrations
- [ ] Delete old server files (keep as backup branches)
- [ ] Update Docker configuration
- [ ] Document new architecture

---

## 🗂️ TARGET FOLDER STRUCTURE

```
backend/
├── src/
│   ├── app.js                          # Express app setup + middleware
│   ├── server.js                       # Port 5000 listener
│   │
│   ├── config/
│   │   ├── database.js                 # Single DB pool
│   │   ├── environment.js              # Env validation
│   │   └── constants.js                # App constants
│   │
│   ├── middlewares/
│   │   ├── auth.js                     # JWT + OTP validation
│   │   ├── rbac.js                     # Role-based access
│   │   ├── security.js                 # Helmet, CORS, rate limit
│   │   ├── errorHandler.js             # Central error handling
│   │   ├── logger.js                   # Request logging
│   │   ├── validateInput.js            # Input validation
│   │   └── paymentVerification.js      # Webhook signature verification
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   └── index.js
│   │   ├── users/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   └── index.js
│   │   ├── subscriptions/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   └── index.js
│   │   ├── admin/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   └── index.js
│   │   ├── analytics/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   └── index.js
│   │   ├── payments/
│   │   │   ├── routes.js
│   │   │   ├── controllers.js
│   │   │   ├── verification.js         # PhonePe signature verify
│   │   │   └── index.js
│   │   └── themedRooms/
│   │       ├── routes.js
│   │       ├── controllers.js
│   │       └── index.js
│   │
│   ├── routes/                         # Legacy routes (can be removed after migration)
│   │   ├── authRoutes.js
│   │   └── saasExampleRoutes.js
│   │
│   ├── utils/
│   │   ├── logger.js                   # Winston logger
│   │   ├── errors.js                   # Custom error classes
│   │   ├── validators.js               # Input validators
│   │   └── helpers.js                  # Utility functions
│   │
│   └── db.js                           # Legacy database (can be removed)
│
├── migrations/
│   ├── PRODUCTION_COMPLETE_SCHEMA.sql
│   └── 20260131_create_themed_rooms.sql
│
├── admin/                               # DELETE after migration
├── payment-gateway/                     # DELETE after migration
│
├── .env.development
├── .env.production
├── .env.example
├── Dockerfile
└── docker-compose.yml
```

---

## 🔄 WHAT TO DELETE AFTER MIGRATION

```
❌ server.js                            (Old main server)
❌ backend/src/server/index.js          (Themed rooms server)
❌ backend/admin/                       (Admin server)
❌ backend/payment-gateway/             (Payment server)
```

---

## ✅ WHAT TO PRESERVE

```
✅ backend/src/db.js                    (Database queries - refactor into modules)
✅ backend/src/controllers/             (Business logic)
✅ backend/src/middleware/              (All middleware)
✅ backend/src/routes/                  (Routes - convert to modules)
✅ backend/migrations/                  (Schema - unchanged)
✅ All database schema & queries
✅ All webhook verification logic
✅ All payment signature validation
```

---

## 🚀 ENDPOINT MIGRATION MAP

### Auth Routes
```
✅ /api/auth/send-otp                → /api/v1/auth/send-otp
✅ /api/auth/verify-otp              → /api/v1/auth/verify-otp
✅ /api/auth/refresh                 → /api/v1/auth/refresh
```

### Admin Routes  
```
✅ /api/v1/admin/users               → /api/v1/admin/users
✅ /api/v1/admin/therapists          → /api/v1/admin/therapists
✅ /api/v1/admin/users/:id/verify    → /api/v1/admin/users/:id/verify
```

### Analytics Routes
```
✅ /api/analytics/overview           → /api/v1/analytics/overview
✅ /api/analytics/sessions           → /api/v1/analytics/sessions
✅ /api/analytics/outcomes           → /api/v1/analytics/outcomes
```

### Payment Routes
```
✅ /api/v1/payment/create            → /api/v1/payments/create
✅ /api/v1/payment/verify            → /api/v1/payments/verify
✅ /api/v1/payment/webhook           → /api/v1/payments/webhook
```

### Themed Rooms Routes
```
✅ /api/v1/themed-rooms              → /api/v1/themed-rooms
✅ /api/v1/themed-rooms/:id          → /api/v1/themed-rooms/:id
✅ /api/v1/themed-rooms/sessions     → /api/v1/themed-rooms/sessions
```

### New Routes
```
✨ GET /health                        → Service health check
✨ GET /health/db                     → Database connectivity
✨ GET /metrics                       → Performance metrics
```

---

## 📋 TESTING CHECKLIST

### Before Deletion of Old Servers

- [ ] All auth routes working
- [ ] All admin operations working
- [ ] All analytics endpoints working
- [ ] Payment webhooks processing correctly
- [ ] Themed rooms API responding
- [ ] Database transactions working
- [ ] Error handling consistent
- [ ] CORS working with frontend
- [ ] Rate limiting applied
- [ ] Security headers present
- [ ] Load test passes (1000 req/s)
- [ ] No database connection leaks
- [ ] Graceful shutdown working

### After Old Servers Deleted

- [ ] Frontend connects to new unified backend
- [ ] All integrations working end-to-end
- [ ] No performance regression
- [ ] Monitoring/alerting configured
- [ ] Logs centralized and searchable
- [ ] Deployment automated

---

## ROLLBACK PLAN

If migration fails:

1. **Immediate:** Switch frontend base URL back to old servers
2. **Keep:** Git branch with old servers as `backup/legacy-multi-server`
3. **Analyze:** Identify what went wrong
4. **Fix:** Apply fixes to unified backend
5. **Retry:** Attempt migration again

---

## 🎓 LESSONS FROM THIS ARCHITECTURE

1. **Start monolithic, split when needed** - Multi-server from day 1 = tragedy
2. **Middleware sharing is critical** - Auth/logging/error handling must be centralized
3. **Database pooling matters** - Don't create separate pools (resource waste)
4. **Environment configuration is foundational** - All servers must read same .env
5. **Module structure enables scaling** - Easy to extract microservices later if needed

---

**Next Step:** Proceed to Implementation Phase 1 - Structure Setup

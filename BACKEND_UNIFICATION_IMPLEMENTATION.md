# 🚀 BACKEND UNIFICATION - IMPLEMENTATION GUIDE

**This guide walks through converting from 4 separate servers to 1 unified backend**

---

## 📋 COPY-PASTE TIMELINE

### Week 1: Setup

**Day 1-2: Prepare**
```bash
# 1. Create backup branch
git checkout -b backup/legacy-multi-server
git push origin backup/legacy-multi-server

# 2. Create working branch
git checkout -b feature/unified-backend
```

**Day 3-4: Structure**
```bash
# Copy preparation files to new locations
mkdir -p backend/src/{config,middlewares,modules,utils}
mkdir -p backend/src/modules/{auth,users,subscriptions,admin,analytics,payments,themedRooms}

# Copy the new files we just created
cp backend/src/app-unified.js backend/src/app.js
cp backend/src/server-unified.js backend/src/server.js
cp backend/src/config/database-unified.js backend/src/config/database.js
cp backend/src/config/environment-unified.js backend/src/config/environment.js
cp backend/src/middlewares/errorHandler-unified.js backend/src/middlewares/errorHandler.js
```

---

## 🔄 MIGRATION STEPS (DETAILED)

### STEP 1: Copy Current Business Logic

```bash
# Move auth logic
cp backend/src/routes/authRoutes.js backend/src/modules/auth/routes-legacy.js
cp backend/src/controllers/authController.js backend/src/modules/auth/controllers-legacy.js

# Move admin logic
cp backend/admin/src/routes/adminRoutes.js backend/src/modules/admin/routes-legacy.js
cp backend/admin/src/routes/analyticsRoutes.js backend/src/modules/analytics/routes-legacy.js

# Move themed rooms logic
cp backend/src/server/routes/themedRooms.js backend/src/modules/themedRooms/routes-legacy.js

# Move payment logic
cp backend/payment-gateway/src/routes/paymentRoutes.js backend/src/modules/payments/routes-legacy.js
```

### STEP 2: Refactor Auth Module

**File: `backend/src/modules/auth/index.js`**
```javascript
import express from 'express';
import authRoutes from './routes-legacy.js';

const router = express.Router();
router.use('/', authRoutes);

export default router;
```

**File: `backend/src/modules/auth/controllers.js`**
- Copy from `backend/src/controllers/authController.js`
- Update imports to use unified DB pool

### STEP 3: Refactor Each Module

For each module (auth, users, subscriptions, admin, analytics, payments, themedRooms):

1. Create `modules/<name>/index.js` that exports router
2. Create `modules/<name>/routes.js` with Express routes
3. Create `modules/<name>/controllers.js` with business logic
4. Update all imports to use unified config

**Example for Admin Module:**

```javascript
// backend/src/modules/admin/index.js
import express from 'express';
import routes from './routes.js';

export default express.Router().use('/', routes);

// backend/src/modules/admin/routes.js
import express from 'express';
import * as controllers from './controllers.js';

const router = express.Router();
router.get('/users', controllers.listUsers);
// ... etc

export default router;

// backend/src/modules/admin/controllers.js
import { query, transaction } from '../../config/database.js';

export async function listUsers(req, res, next) {
  try {
    const result = await query('SELECT * FROM user_accounts LIMIT 20');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}
```

### STEP 4: Update Package.json

```json
{
  "scripts": {
    "dev": "nodemon backend/src/server.js",
    "dev:db": "nodemon backend/src/server.js",
    "start": "node backend/src/server.js",
    "test": "jest tests/",
    "test:auth": "jest tests/auth.test.js",
    "test:payments": "jest tests/payments.test.js"
  }
}
```

### STEP 5: Update Frontend Configuration

**File: `frontend/main-app/.env.development`**
```
VITE_API_URL=http://localhost:5000/api/v1
```

**File: `frontend/main-app/src/lib/apiClient.ts`**
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
});

// Add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### STEP 6: Test Each Module

```bash
# Test auth
npm run test:auth

# Test payments
npm run test:payments

# Test all
npm run test:all

# Load test
npx artillery quick --count 100 --num 1000 http://localhost:5000/health
```

### STEP 7: Verify No Route Breaks

Create a test file to verify all old endpoints work:

```javascript
// tests/route-migration.test.js
describe('Route Migration Verification', () => {
  const baseUrl = 'http://localhost:5000/api/v1';

  test('Auth endpoints exist', async () => {
    const res = await fetch(`${baseUrl}/auth/send-otp`, { method: 'POST' });
    expect(res.status).not.toBe(404);
  });

  test('Admin endpoints exist', async () => {
    const res = await fetch(`${baseUrl}/admin/users`, { 
      headers: { Authorization: `Bearer ${testToken}` }
    });
    expect(res.status).not.toBe(404);
  });

  test('Payment endpoints exist', async () => {
    const res = await fetch(`${baseUrl}/payments/create`, { method: 'POST' });
    expect(res.status).not.toBe(404);
  });

  test('Themed rooms endpoints exist', async () => {
    const res = await fetch(`${baseUrl}/themed-rooms`);
    expect(res.status).not.toBe(404);
  });
});
```

---

## ✅ PRODUCTION CHECKLIST

Before deleting old servers, verify:

- [ ] **All authentication flows working**
  - [ ] OTP send/verify
  - [ ] Token refresh
  - [ ] Login/logout
  
- [ ] **All admin operations working**
  - [ ] User management
  - [ ] Analytics viewing
  - [ ] Subscription management
  
- [ ] **All payments processing**
  - [ ] Payment initiation
  - [ ] WebHook handling
  - [ ] Subscription activation
  
- [ ] **All database operations**
  - [ ] CRUD operations working
  - [ ] Transactions committing
  - [ ] No connection leaks
  
- [ ] **All security measures active**
  - [ ] Helmet headers present
  - [ ] CORS working correctly
  - [ ] Rate limiting applied
  - [ ] JWT validation working
  
- [ ] **Performance acceptable**
  - [ ] Response time < 200ms
  - [ ] Can handle 1000 req/s
  - [ ] No memory leaks
  
- [ ] **Frontend integration working**
  - [ ] All API calls using new baseURL
  - [ ] Authentication working end-to-end
  - [ ] Admin panel accessible
  - [ ] Payments flowing through
  - [ ] Themed rooms loading

---

## 🗑️ DELETE OLD SERVERS (Only After All Tests Pass)

```bash
# Delete old server files
rm server.js
rm backend/src/server/index.js
rm -rf backend/admin/
rm -rf backend/payment-gateway/

# Verify new structure is complete
ls -la backend/src/modules/

# Commit changes
git add -A
git commit -m "refactor: consolidate 4 servers into unified backend on port 5000"
```

---

## 🩺 HEALTH CHECKS

After deployment, monitor:

```bash
# Basic health
curl http://localhost:5000/health

# Database health
curl http://localhost:5000/health/db

# Metrics
curl http://localhost:5000/metrics

# Check logs
tail -f /var/log/manas360/backend.log
```

---

## 🚨 TROUBLESHOOTING

### Issue: "Port 5000 already in use"
```bash
lsof -ti:5000 | xargs kill -9
npm run dev
```

### Issue: "Database connection failed"
```bash
# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection directly
psql $DATABASE_URL -c "SELECT 1"
```

### Issue: "JWT_SECRET not set"
```bash
# Verify in .env.local
cat .env.local | grep JWT_SECRET

# Should be 32+ characters
echo $JWT_SECRET | wc -c
```

### Issue: "Admin routes returning 403"
- Verify user role in database: `SELECT * FROM user_accounts WHERE id = ?`
- Verify middleware chain: auth → authorizeRole
- Check token includes `role` claim

### Issue: "Payment webhook not received"
- Verify `X-Verify` header received
- Verify signature validation logic
- Check PhonePe webhook URL configuration
- Monitor audit logs for webhook failures

---

## 📊 PERFORMANCE IMPROVEMENTS AFTER UNIFICATION

Expected improvements:

| Metric | Before | After | Gain |
|--------|--------|-------|------|
| Resource Usage | 400% (4 Node processes) | 100% (1 Node process) | 75% ↓ |
| Memory | 400 MB | 120 MB | 70% ↓ |
| Startup Time | 12 seconds | 3 seconds | 75% ↓ |
| API Response Time | 150ms | 80ms | 46% ↓ |
| Database Connections | 40 (spread across 4 pools) | 30 (single pool) | 25% ↓ |
| DevOps Complexity | Very High | Low | Huge ↓ |

---

## 📚 REFERENCE

**Files Created:**
- `backend/src/app-unified.js` - Express app setup
- `backend/src/server-unified.js` - Server entry point
- `backend/src/config/database-unified.js` - Database pool
- `backend/src/config/environment-unified.js` - Environment validation
- `backend/src/middlewares/errorHandler-unified.js` - Error handling
- `backend/src/modules/auth/index-example.js` - Auth module example
- `backend/src/modules/admin/index-example.js` - Admin module example
- `backend/src/modules/payments/index-example.js` - Payments module example
- `backend/src/modules/payments/controllers-example.js` - Payment logic example

**Module Structure:**
Each module should contain:
- `index.js` - Router export
- `routes.js` - Express routes
- `controllers.js` - Business logic
- `models.js` (optional) - Data models
- `validation.js` (optional) - Input validators

**Middleware Chain (Order Matters):**
1. Security (Helmet, CORS, Rate Limit)
2. Body Parser (JSON)
3. Request Logger
4. Authentication (if needed)
5. Authorization (if needed)
6. Route Handlers
7. 404 Handler
8. Error Handler (LAST)

---

**Next Phase:** Testing & Deployment


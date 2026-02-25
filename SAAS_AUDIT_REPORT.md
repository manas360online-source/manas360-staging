# MANAS360 Backend Architecture Audit Report

**Date:** February 25, 2026  
**Assessment:** Current implementation vs Production SaaS Requirements  
**Status:** ⚠️ **PARTIALLY COMPLETE** - Core infrastructure missing RBAC & subscription features

---

## Executive Summary

### Current State
- ✅ **Basic users table** exists but incomplete
- ✅ **Payment system** well-designed with PhonePe integration
- ✅ **OTP authentication** via WhatsApp working
- ✅ **Session/therapy analytics** tables present
- ❌ **No RBAC** (roles, permissions, role_permissions tables missing)
- ❌ **No subscription plans** feature definitions
- ❌ **No feature access control** middleware
- ❌ **No comprehensive JWT middleware stack**

### Required for Production SaaS
- ✅ User registration with hashing
- ✅ JWT authentication
- ✅ RBAC with roles & permissions
- ✅ Subscription plans with features
- ✅ Feature-level access control
- ✅ Rate limiting per plan
- ✅ Audit logging
- ✅ Scalable to 100k+ users

---

## Detailed Assessment

### 1. DATABASE SCHEMA

| Component | Current | Required | Gap |
|-----------|---------|----------|-----|
| **users table** | ✓ Basic (id, email, created_at) | ✓ Enhanced (password_hash, role_id, is_active, 2fa, etc.) | Missing 15+ fields |
| **roles table** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **permissions table** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **role_permissions** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **subscription_plans** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **features table** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **plan_features** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **user_subscriptions** | ✓ Exists | ✓ Exists | Needs review for active field |
| **tokens table** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **audit_logs table** | ✓ Payment audit | ✓ Full auth audit | Partial - only payments |
| **sessions table** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **rate_limit_logs** | ✗ | ✓ | **NOT IMPLEMENTED** |

**Gap Analysis:** 8 out of 12 core tables **missing**

---

### 2. AUTHENTICATION

| Feature | Current | Required | Status |
|---------|---------|----------|--------|
| **Password hashing** | ✗ OTP only | ✓ bcrypt + OTP | Alternative path |
| **Email/password login** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **JWT tokens** | ✓ Basic JWT | ✓ Access + Refresh | Incomplete |
| **Token refresh** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **Session tracking** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **Logout (revoke)** | ✗ | ✓ | **NOT IMPLEMENTED** |
| **2FA support** | ✗ | ✓ Optional | Not planned |

**Current Auth Flow:**
```
User → Phone Number Input → OTP via WhatsApp → JWT token
```

**Required Auth Flow:**
```
Register → Email + Password (hashed) → Verify email (OTP) → Login
↓
Phone Number (optional) → 2FA (optional)
```

**Action:** OTP auth can coexist with email/password. Need to enhance user registration with bcrypt fallback.

---

### 3. ROLE-BASED ACCESS CONTROL (RBAC)

| Feature | Status | Impact |
|---------|--------|--------|
| Roles table | ❌ Missing | Can't define roles (admin, user, subscriber) |
| Permissions | ❌ Missing | Can't define granular permissions |
| RBAC middleware | ❌ Missing | Can't enforce role-based access |
| Role assignment | ❌ Missing | All users get same permissions |
| Admin panel | ❌ Missing | No admin features available |

**Critical Gap:** **ZERO RBAC implemented**  
**Risk:** All authenticated users have same permissions → Security vulnerability

---

### 4. SUBSCRIPTION & FEATURES

| Feature | Current | Required | Status |
|---------|---------|----------|--------|
| **Subscription plans** | ✗ Not defined | ✓ Free/Pro/Enterprise | **NOT IMPLEMENTED** |
| **Features table** | ✗ | ✓ Premium features | **NOT IMPLEMENTED** |
| **Plan-feature mapping** | ✗ | ✓ Which features in which plan | **NOT IMPLEMENTED** |
| **Feature access check** | ✗ | ✓ Middleware | **NOT IMPLEMENTED** |
| **Feature access logs** | ✗ | ✓ Audit trail | **NOT IMPLEMENTED** |
| **Rate limiting** | ✗ | ✓ API quota per plan | **NOT IMPLEMENTED** |

**Current Subscription State:**
```
User → Hardcoded payments → No subscription tiers
```

**Required for SaaS:**
```
User → Select plan (Free/Pro/Business) → See available features
        → Subscribe → Access tier-specific features
        → Upgrade → More features & higher limits
```

---

### 5. MIDDLEWARE STACK

| Middleware | Current | Required | Gap |
|-----------|---------|----------|-----|
| **authenticateToken** | ✓ Basic | ✓ Enhanced | Exists, needs refinement |
| **authorizeRole** | ✗ | ✓ RBAC | **NOT IMPLEMENTED** |
| **checkPermission** | ✗ | ✓ Permissions | **NOT IMPLEMENTED** |
| **checkFeatureAccess** | ✗ | ✓ Subscription gates | **NOT IMPLEMENTED** |
| **rateLimiting** | ✗ | ✓ Per-plan quotas | **NOT IMPLEMENTED** |
| **auditLogging** | ✓ Payment only | ✓ Auth events | Partial |

**Usage:**
```
// Current:
GET /api/protected → authenticateToken → controller

// Required:
GET /api/admin/users
  → authenticateToken
  → authorizeRole(['admin'])
  → checkPermission('manage_users')
  → auditLog
  → controller
```

---

### 6. EXISTING IMPLEMENTATION STRENGTHS

✅ **Payment system** - Well-designed with:
- Transaction tracking
- PhonePe integration
- Settlement tracking (60/40 split)
- Comprehensive audit logs
- Error handling

✅ **OTP authentication** - Clean implementation:
- WhatsApp integration via Heyoo
- Rate limiting on OTP requests
- Expiration handling

✅ **Therapy analytics** - Detailed session tracking:
- Assessment scoring (PHQ-9, GAD-7)
- Session outcomes
- Provider analytics

✅ **Database foundation** - PostgreSQL with:
- UUID primary keys
- Timestamped records
- Proper indexing

---

### 7. GAPS & RISKS

| Gap | Risk | Severity |
|-----|------|----------|
| No RBAC | All users have same permissions | 🔴 **CRITICAL** |
| No subscription tiers | Can't monetize properly | 🔴 **CRITICAL** |
| No feature gating | Premium features accessible to all | 🔴 **CRITICAL** |
| No admin panel | Can't manage users or subscriptions | 🔴 **CRITICAL** |
| No permission logging | No audit trail for compliance | 🟠 **HIGH** |
| No rate limiting | API abuse possible | 🟠 **HIGH** |
| No token refresh | Sessions don't refresh | 🟠 **HIGH** |
| No email password | OTP-only (mobile-first but limits desktop) | 🟡 **MEDIUM** |

---

## Implementation Roadmap

### Phase 1: Core RBAC (Week 1)
- [ ] Create roles, permissions, and role_permissions tables
- [ ] Implement authorizeRole middleware
- [ ] Implement checkPermission middleware
- [ ] Seed default roles
- [ ] Update users table with role_id
- **Deliverable:** Role-based access control working

### Phase 2: Subscription Plans (Week 2)
- [ ] Create subscription_plans table
- [ ] Create features table
- [ ] Create plan_features mapping
- [ ] Implement checkFeatureAccess middleware
- [ ] Add plan/feature views
- **Deliverable:** Feature gates working

### Phase 3: User Management (Week 2-3)
- [ ] Create tokens table
- [ ] Implement token refresh endpoint
- [ ] Create comprehensive audit_logs
- [ ] Enhance audit logging middleware
- [ ] Add email password registration (optional)
- **Deliverable:** Enhanced auth + logging

### Phase 4: Admin Features (Week 3-4)
- [ ] Create admin controllers
- [ ] Implement admin routes
- [ ] Add admin dashboard backend
- [ ] User management endpoints
- [ ] Subscription management endpoints
- **Deliverable:** Admin panel backend

### Phase 5: Rate Limiting & Optimization (Week 4)
- [ ] Create rate_limit_logs table
- [ ] Implement rateLimitByPlan middleware
- [ ] Add monitoring/alerts
- [ ] Performance optimization
- **Deliverable:** Rate limiting + monitoring

### Phase 6: Documentation & Testing (Ongoing)
- [ ] Document all endpoints
- [ ] Create API specification (OpenAPI)
- [ ] Write unit tests
- [ ] Integration tests
- [ ] Load testing
- **Deliverable:** Production-ready documentation

---

## Quick Start: Minimum Viable Implementation

To get RBAC + features working in **1 day**:

### Step 1: Run Migration (15 min)
```bash
psql -d manas360 -f backend/migrations/002_create_saas_core_schema.sql
```

### Step 2: Copy Middleware Files (15 min)
```bash
# Copy these files from SAAS_IMPLEMENTATION_EXAMPLES.js:
cp authMiddleware.js backend/src/middleware/
cp rbacMiddleware.js backend/src/middleware/
cp featureAccessMiddleware.js backend/src/middleware/
```

### Step 3: Update Express App (30 min)
```javascript
import authMiddleware from './middleware/authMiddleware.js';
import rbacMiddleware from './middleware/rbacMiddleware.js';
import featureMiddleware from './middleware/featureAccessMiddleware.js';

app.use(express.json());
app.get('/protected', authMiddleware.authenticateToken, handler);
```

### Step 4: Test Auth Flow (30 min)
```bash
npm test
# Should pass:
# ✓ Register user
# ✓ Login and get tokens
# ✓ Admin access denied for non-admin
# ✓ Premium feature denied for free users
```

### Step 5: Migrate Existing Users (30 min)
```sql
-- Map old users to new schema
UPDATE user_accounts 
SET role_id = (SELECT id FROM roles WHERE name = 'user')
WHERE role_id IS NULL;
```

**Total Time:** ~2.5 hours → Full RBAC system operational

---

## Recommendations

### Priority 1: IMPLEMENT IMMEDIATELY
```
1. Add roles, permissions, RBAC tables
2. Create authorizeRole & checkPermission middleware
3. Add feature gating middleware
4. Seed default roles & permissions
5. Update existing routes with middleware
```

**Why:** Security + monetization depend on this

### Priority 2: IMPLEMENT THIS SPRINT
```
1. Create tokens table + refresh endpoint
2. Add comprehensive audit logging
3. Create sessions table
4. Enhanced user account fields
5. Subscription management endpoints
```

**Why:** Operations + compliance + user experience

### Priority 3: NICE TO HAVE
```
1. Email + password registration (keep OTP)
2. 2FA support
3. Admin dashboard UI
4. Advanced analytics
5. White-label options
```

**Why:** Enhances user experience but not critical

---

## Conclusion

**Current State:** ✅ Good foundation (payments, OTP, analytics)  
**Missing:** ❌ Core SaaS infrastructure (RBAC, features, rate limiting)  
**Risk Level:** 🔴 **HIGH** - Cannot monetize without subscription tiers  
**Time to Production:** 2-3 weeks with this architecture

**Next Action:** 
1. ✅ Review SAAS_ARCHITECTURE_GUIDE.md
2. ✅ Run migration SQL
3. ✅ Implement middleware
4. ✅ Update routes with RBAC
5. ✅ Deploy to staging
6. ✅ Run security audit
7. ✅ Deploy to production

**Questions?** Review the complete guide at `SAAS_ARCHITECTURE_GUIDE.md`

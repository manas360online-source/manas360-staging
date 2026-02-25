# FULL-STACK STABILIZATION: TESTING CHECKLIST

**Status:** For Team Verification  
**Date:** February 25, 2026  
**Estimated Duration:** 4-6 hours  

---

## PHASE 1: UNIT TESTS

### Backend Middleware Tests

#### Authentication Tests
- [ ] `authenticateToken` allows requests with valid token
- [ ] `authenticateToken` rejects requests without token (401)
- [ ] `authenticateToken` rejects invalid tokens (401)
- [ ] `authenticateToken` rejects expired tokens with code TOKEN_EXPIRED
- [ ] `refreshTokenHandler` issues new access token
- [ ] `refreshTokenHandler` rotates refresh token
- [ ] `refreshTokenHandler` rejects invalid refresh token
- [ ] `logoutHandler` revokes all refresh tokens
- [ ] `logoutHandler` returns success response

#### RBAC Tests
- [ ] `authorizeRole(['admin'])` allows admin users (200)
- [ ] `authorizeRole(['admin'])` blocks non-admin users (403)
- [ ] `authorizeRole` works with multiple roles
- [ ] `authorizePermission` checks user permissions
- [ ] `authorizePermission` blocks users without permission (403)
- [ ] `checkResourceOwnership` allows owner access
- [ ] `checkResourceOwnership` allows admin access
- [ ] `checkResourceOwnership` blocks non-owner access

#### Subscription Gating Tests
- [ ] `requireSubscription` blocks non-subscribers (402)
- [ ] `requireSubscription` allows active subscribers (200)
- [ ] `requireSubscription` with feature name checks feature access
- [ ] `requireTier` blocks lower tier users (403)
- [ ] `requireTier` allows higher tier users (200)
- [ ] Expired subscriptions are treated as inactive

#### Error Handler Tests
- [ ] `globalErrorHandler` catches 500 errors
- [ ] `asyncHandler` wraps async functions
- [ ] Validation errors return 400 with field details
- [ ] Database constraint errors map to 409 Conflict

---

## PHASE 2: INTEGRATION TESTS

### Authentication Flow

#### OTP Login
- [ ] POST `/auth/send-otp` with valid email sends OTP
- [ ] POST `/auth/send-otp` rate limits after 10 attempts
- [ ] POST `/auth/verify-otp` with correct OTP returns tokens
- [ ] POST `/auth/verify-otp` with wrong OTP returns 401
- [ ] Returned tokens are properly formatted
- [ ] Token includes userId, email, role, permissions

#### Token Refresh
- [ ] POST `/auth/refresh` with valid refresh token returns new access token
- [ ] New access token is valid for 15 minutes
- [ ] Refresh generates new refresh token
- [ ] Old refresh token can still be used once
- [ ] POST `/auth/refresh` with invalid token returns 401
- [ ] POST `/auth/refresh` with expired token returns 401

#### Logout
- [ ] POST `/auth/logout` requires authentication
- [ ] POST `/auth/logout` revokes all refresh tokens
- [ ] Using old refresh token after logout fails
- [ ] Can log back in after logout

### User Management

#### Profile Access
- [ ] GET `/users/me` returns current user data
- [ ] GET `/users/:id` allows self-access
- [ ] GET `/users/:id` allows admin access
- [ ] GET `/users/:id` blocks non-owner access
- [ ] PATCH `/users/me` updates profile
- [ ] Sensitive fields not returned (password_hash)

#### Admin Users Endpoint
- [ ] GET `/admin/users` requires admin role
- [ ] GET `/admin/users` returns paginated list
- [ ] Non-admin users get 403 on /admin/users
- [ ] Admin can suspend users

### Subscription System

#### Current Subscription
- [ ] GET `/subscriptions/current` returns active subscription
- [ ] GET `/subscriptions/current` returns null for non-subscribers
- [ ] Subscription includes plan name, status, expiry date
- [ ] Expired subscriptions not returned as active

#### Subscription Gates
- [ ] Premium features block non-subscribers (402)
- [ ] Premium features block expired subscriptions
- [ ] Premium features allow active subscribers
- [ ] Subscription tier blocking works correctly
- [ ] Feature checking prevents unauthorized access

### Payments & Subscription Creation

#### Payment Initiation
- [ ] POST `/payments/create` requires auth
- [ ] POST `/payments/create` requires planId
- [ ] POST `/payments/create` returns paymentUrl
- [ ] POST `/payments/create` returns merchantTransactionId
- [ ] Payment URL is valid PhonePe redirect

#### Webhook Processing
- [ ] POST `/payments/webhook` with valid signature succeeds
- [ ] POST `/payments/webhook` with invalid signature rejected (401)
- [ ] Successful payment creates subscription automatically
- [ ] Subscription status set to 'active'
- [ ] subscription.starts_at and ends_at populated
- [ ] Subscription ends_at is 30 days after starts_at
- [ ] Old subscription cancelled when new one activated
- [ ] Webhook idempotent (same payment processed once)

### Themed Rooms

#### Theme Listing
- [ ] GET `/themed-rooms/themes` returns all themes
- [ ] GET `/themed-rooms/themes` no auth required
- [ ] Returns theme id, name, description, audio_url
- [ ] Premium themes marked with is_premium flag

#### Session Management
- [ ] POST `/themed-rooms/sessions` requires auth
- [ ] POST `/themed-rooms/sessions` requires themeId
- [ ] Premium themes require active subscription
- [ ] Free themes accessible to all authenticated users
- [ ] POST creates session record in DB
- [ ] Response includes session id and start time

#### Session Completion
- [ ] PATCH `/themed-rooms/sessions/:id/end` requires auth
- [ ] PATCH updates ended_at time
- [ ] PATCH updates duration_seconds
- [ ] PATCH stores session_data (notes)
- [ ] Can retrieve completed sessions

### Analytics

#### Access Control
- [ ] GET `/analytics/overview` requires view_analytics permission
- [ ] GET `/analytics/sessions` requires view_analytics permission
- [ ] Non-analysts get 403
- [ ] Admins have analytics permission by default

#### Analytics Data
- [ ] `/analytics/overview` returns meaningful metrics
- [ ] `/analytics/sessions` returns session data
- [ ] Data is accurate and recent

---

## PHASE 3: END-TO-END TESTS

### Complete User Journey

#### New User Journey
```
1. ✓ User visits app
2. ✓ User enters email → POST /auth/send-otp
3. ✓ User receives OTP in email (mock)
4. ✓ User enters OTP → POST /auth/verify-otp
5. ✓ Frontend receives accessToken + refreshToken
6. ✓ Frontend stores tokens
7. ✓ User redirected to dashboard
8. ✓ GET /users/me shows user profile
9. ✓ No active subscription shown
```

#### Payment Journey
```
1. ✓ User clicks "Subscribe"
2. ✓ POST /payments/create → paymentUrl returned
3. ✓ Frontend redirects to PhonePe payment page
4. ✓ User completes payment
5. ✓ PhonePe sends webhook
6. ✓ Webhook creates subscription
7. ✓ GET /subscriptions/current shows active subscription
8. ✓ Premium features unlocked
9. ✓ Frontend shows "Premium" badge
```

#### Premium Feature Journey
```
1. ✓ User is subscriber
2. ✓ User clicks "Try Premium Theme"
3. ✓ POST /themed-rooms/sessions succeeds
4. ✓ Frontend blocks premium themes for non-subscribers
5. ✓ User completes session
6. ✓ PATCH sessions/:id/end records completion
7. ✓ Session visible in history
```

#### Admin Journey
```
1. ✓ Admin logs in
2. ✓ User role is 'admin'
3. ✓ GET /admin/users returns all users
4. ✓ Admin can suspend users
5. ✓ GET /analytics/* returns overview and sessions
6. ✓ Non-admins blocked from admin routes (403)
```

---

## PHASE 4: API CONTRACT VERIFICATION

### Frontend → Backend Mapping

| Frontend Feature | API Call | Backend Route | Status |
|-----------------|----------|---------------|--------|
| OTP Login | POST `/auth/send-otp` | ✓ Unified | |
| OTP Verify | POST `/auth/verify-otp` | ✓ Unified | |
| Token Refresh | POST `/auth/refresh` | ✓ Unified | |
| User Profile | GET `/users/me` | ✓ Unified | |
| Admin Dashboard | GET `/admin/users` | ✓ Unified | |
| Payments | POST `/payments/create` | ✓ Unified | |
| Themed Rooms | GET `/themed-rooms/themes` | ✓ Unified | |
| Themed Sessions | POST `/themed-rooms/sessions` | ✓ Unified | |
| Analytics | GET `/analytics/overview` | ✓ Unified | |

### Database Schema Verification

- [ ] Single `subscriptions` table exists
- [ ] No `user_subscriptions` table
- [ ] All columns use UUID types (not VARCHAR)
- [ ] Dates use `starts_at` and `ends_at` (not start_date)
- [ ] Status field uses enum values
- [ ] Indexes created for query performance
- [ ] Foreign keys enforce referential integrity

---

## PHASE 5: SECURITY TESTS

### Authentication Security
- [ ] Tokens not stored in URL
- [ ] Tokens not in browser cache
- [ ] HTTPS enforced in production
- [ ] Token refresh works without exposing old token
- [ ] Rate limiting prevents brute force (max 10 attempts / 15m)

### Authorization Security
- [ ] Admin routes require admin role
- [ ] Premium features check subscription
- [ ] Resource ownership prevents cross-user access
- [ ] Direct ID manipulation blocked

### Data Security
- [ ] Password hashes not returned
- [ ] API keys not returned
- [ ] Secrets not logged
- [ ] Errors don't reveal DB structure

### Infrastructure Security
- [ ] Helmet headers applied
- [ ] CORS restricts to frontend origin
- [ ] Rate limiting active
- [ ] SQL injection prevented (parameterized queries)
- [ ] XSS prevented (no user input in HTML)

---

## PHASE 6: PERFORMANCE TESTS

### Response Times
- [ ] `/health` → < 50ms
- [ ] `/auth/verify-otp` → < 500ms
- [ ] `/users/me` → < 200ms
- [ ] `/subscriptions/current` → < 200ms
- [ ] `/admin/users` → < 300ms

### Load Testing (100 concurrent users)
- [ ] No 5xx errors
- [ ] P95 latency < 1 second
- [ ] Database connections stable
- [ ] Memory usage stable

### Database Performance
- [ ] Subscription query uses index
- [ ] No N+1 queries
- [ ] Slow queries logged (>1 second)

---

## PHASE 7: ERROR HANDLING TESTS

### Invalid Input
- [ ] Missing required fields → 400 with error details
- [ ] Invalid email format → 400
- [ ] Invalid UUID → 400
- [ ] Missing auth token → 401

### Business Logic Errors
- [ ] Non-existent user → 404
- [ ] Expired subscription → 402 or business logic
- [ ] Duplicate email → 409 Conflict
- [ ] Payment failed → Payment status updated

### System Errors
- [ ] Database unavailable → 503 with message
- [ ] Unhandled error → 500 with generic message
- [ ] Errors logged for debugging

---

## PHASE 8: FRONTEND INTEGRATION TESTS

### API Client
- [ ] All requests include Authorization header
- [ ] 401 triggers token refresh
- [ ] Refresh queues simultaneous requests
- [ ] Refresh failure redirects to login
- [ ] Errors displayed to user

### Token Management
- [ ] Token stored in localStorage
- [ ] Token cleared on logout
- [ ] Token expires shown to user
- [ ] Cannot access protected routes without token

### Error UI
- [ ] 401 error → "Session expired, please login"
- [ ] 403 error → "Access denied"
- [ ] 402 error → "Subscription required"
- [ ] 500 error → "Something went wrong"

---

## FINAL VERIFICATION CHECKLIST

### Server Start
- [ ] `npm run dev` starts without errors
- [ ] Server listens on port 5000
- [ ] Backend responds to health check
- [ ] Database connected
- [ ] Old ports 3001, 4000, 5001, 5002 NOT listening

### All Routes Work
- [ ] GET /health → 200
- [ ] POST /api/v1/auth/send-otp → 200 (with valid email) or 400
- [ ] POST /api/v1/auth/verify-otp → 200 (with valid otp) or 401
- [ ] GET /api/v1/users/me → 200 (with auth) or 401
- [ ] GET /admin/users → 200 (admin) or 403 (non-admin)
- [ ] POST /api/v1/payments/create → 200 (with planId)
- [ ] GET /api/v1/subscriptions/current → 200 (with auth)

### Frontend Works
- [ ] Frontend loads on localhost:5173
- [ ] API calls use localhost:5000
- [ ] Login flow works end-to-end
- [ ] Token refresh works automatically
- [ ] Premium features gate correctly

### Database Works
- [ ] All tables exist
- [ ] No orphaned data
- [ ] Subscription records persistent
- [ ] Payment records tracked
- [ ] Session records stored

---

## TEST DATA SETUP

### Users to Create
```sql
-- Test user (free)
INSERT INTO users (email, role_id) VALUES (
  'user@example.com', 
  (SELECT id FROM roles WHERE name = 'user')
);

-- Test admin
INSERT INTO users (email, role_id) VALUES (
  'admin@example.com',
  (SELECT id FROM roles WHERE name = 'admin')
);

-- Test subscriber
INSERT INTO users (email, role_id) VALUES (
  'subscriber@example.com',
  (SELECT id FROM roles WHERE name = 'user')
);
-- Plus subscription record for subscriber
```

### Plans/Features Already Seeded
- Plans: Free, Basic, Premium, Enterprise
- Features: premium_dashboard, premium_themed_rooms, api_access, etc.
- Themes: Ocean Waves, Mountain Peak, Forest Rain, etc.

---

## SIGN-OFF

When all tests pass:

- [ ] Mark as "READY FOR STAGING"
- [ ] Create release notes
- [ ] Deploy to staging environment
- [ ] Smoke test in staging
- [ ] Approve for production

**Approved By:** ___________________  
**Date:** ___________________  
**Bugs Found:** 0 (If > 0, fix before deployment)

---


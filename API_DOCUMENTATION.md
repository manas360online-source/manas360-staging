# 📚 UNIFIED BACKEND API DOCUMENTATION

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api/v1` (development)  
**Base URL:** `https://api.manas360.com/api/v1` (production)  
**Content-Type:** `application/json`

---

## 📖 Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Rate Limiting](#rate-limiting)
4. [Endpoints](#endpoints)
   - [Auth](#auth-endpoints)
   - [Users](#users-endpoints)
   - [Subscriptions](#subscriptions-endpoints)
   - [Themed Rooms](#themed-rooms-endpoints)
   - [Admin](#admin-endpoints)
   - [Analytics](#analytics-endpoints)
   - [Payments](#payments-endpoints)
5. [Health Checks](#health-checks)
6. [Examples](#examples)

---

## Authentication

### Bearer Token

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token:** 24 hours validity, used for API requests
- **Refresh Token:** 7 days validity, used to get new access token

### Getting Tokens

1. User sends OTP request: `POST /auth/send-otp`
2. Backend sends OTP via WhatsApp
3. User verifies OTP: `POST /auth/verify-otp` → receives tokens
4. Use access token for subsequent requests
5. Before token expires, refresh: `POST /auth/refresh`

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "AUTH_001",
    "message": "Invalid credentials",
    "details": "Email not found"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Valid request processed |
| 201 | Created | User created successfully |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid or expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Email already registered |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected error |

### Error Codes

| Code | Message | Status | Description |
|------|---------|--------|-------------|
| AUTH_001 | Invalid credentials | 401 | OTP verification failed |
| AUTH_002 | Token expired | 401 | Access token past expiry |
| AUTH_003 | Invalid token | 401 | Token signature invalid |
| USER_001 | User not found | 404 | User ID doesn't exist |
| USER_002 | Email exists | 409 | Email already registered |
| SUB_001 | No active subscription | 400 | User has no active subscription |
| SUB_002 | Subscription expired | 400 | Subscription past end date |
| PAY_001 | Payment failed | 400 | PhonePe rejected transaction |
| ROOM_001 | Theme not found | 404 | Theme ID doesn't exist |
| ADMIN_001 | Insufficient permissions | 403 | Not an admin user |

---

## Rate Limiting

### Global Limits

- **Unauthenticated:** 100 requests/15 minutes
- **Authenticated:** 1000 requests/15 minutes

### Endpoint-Specific Limits

- Auth endpoints: 10 requests/minute (prevent brute force)
- Payment webhook: Unlimited (verified by signature)

### Response Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1645123456
```

---

## Endpoints

### Auth Endpoints

#### 1. Send OTP

**Endpoint:** `POST /auth/send-otp`  
**Authentication:** None (Public)  
**Rate Limit:** 10/minute

**Request:**
```json
{
  "phone": "+91 98765 43210"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "otpId": "otp_12345",
    "expiresIn": 300
  }
}
```

**Errors:**
- 400: Invalid phone format
- 429: Too many OTP requests

---

#### 2. Verify OTP

**Endpoint:** `POST /auth/verify-otp`  
**Authentication:** None (Public)  
**Rate Limit:** 5/minute (prevent brute force)

**Request:**
```json
{
  "phone": "+91 98765 43210",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "id": "user_123",
      "phone": "+91 98765 43210",
      "name": "John Doe",
      "role": "user"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc...",
      "expiresIn": 86400
    }
  }
}
```

**Errors:**
- 400: Invalid OTP
- 400: OTP expired
- 404: Phone not found (new user - handle registration)

---

#### 3. Refresh Token

**Endpoint:** `POST /auth/refresh`  
**Authentication:** Requires bearer token  
**Rate Limit:** 100/minute

**Request:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGc...",
    "expiresIn": 86400
  }
}
```

**Errors:**
- 401: Invalid refresh token
- 401: Refresh token expired

---

#### 4. Logout

**Endpoint:** `POST /auth/logout`  
**Authentication:** Required (Bearer Token)  
**Rate Limit:** Unlimited

**Request:**
```json
{}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Users Endpoints

#### 5. Get Current User

**Endpoint:** `GET /users/me`  
**Authentication:** Required  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "phone": "+91 98765 43210",
    "email": "john@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "role": "user",
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-02-25T14:22:00Z"
  }
}
```

---

#### 6. Update Profile

**Endpoint:** `PATCH /users/:id`  
**Authentication:** Required  
**Role Required:** None (users update own profile)

**Request:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

#### 7. Get User (Admin Only)

**Endpoint:** `GET /users/:id`  
**Authentication:** Required  
**Role Required:** admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "phone": "+91 98765 43210",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "user",
    "subscription": {
      "planId": "plan_premium",
      "status": "active",
      "startDate": "2026-01-15",
      "endDate": "2026-02-15"
    }
  }
}
```

---

### Subscriptions Endpoints

#### 8. Get Active Subscription

**Endpoint:** `GET /subscriptions/active`  
**Authentication:** Required  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "sub_xyz",
    "userId": "user_123",
    "planId": "plan_premium",
    "planName": "Premium Plan",
    "status": "active",
    "startDate": "2026-01-15T00:00:00Z",
    "endDate": "2026-02-15T00:00:00Z",
    "price": 999,
    "currency": "INR",
    "features": [
      "Unlimited meditation sessions",
      "AR themed rooms access",
      "Ad-free experience"
    ]
  }
}
```

**Errors:**
- 400: No active subscription

---

#### 9. Get Subscription History

**Endpoint:** `GET /subscriptions?page=1&limit=10`  
**Authentication:** Required  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "sub_123",
        "planName": "Premium Plan",
        "status": "active",
        "startDate": "2026-01-15T00:00:00Z",
        "endDate": "2026-02-15T00:00:00Z",
        "price": 999
      },
      {
        "id": "sub_122",
        "planName": "Basic Plan",
        "status": "expired",
        "startDate": "2025-12-15T00:00:00Z",
        "endDate": "2026-01-15T00:00:00Z",
        "price": 199
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  }
}
```

---

#### 10. Cancel Subscription

**Endpoint:** `PATCH /subscriptions/:id/cancel`  
**Authentication:** Required  
**Role Required:** admin or subscription owner

**Request:**
```json
{
  "reason": "Too expensive"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Subscription cancelled",
  "data": {
    "id": "sub_123",
    "status": "cancelled",
    "cancelledAt": "2026-02-25T14:22:00Z",
    "reason": "Too expensive"
  }
}
```

---

### Themed Rooms Endpoints

#### 11. List Themes

**Endpoint:** `GET /themed-rooms/themes?page=1&limit=20`  
**Authentication:** Not required (public) | Optional (track stats)  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "themes": [
      {
        "id": "theme_001",
        "name": "Forest Meditation",
        "category": "nature",
        "description": "Peaceful forest environment for deep meditation",
        "thumbnail": "https://...",
        "duration": 1800,
        "sessions": 12,
        "rating": 4.8,
        "isActive": true
      },
      {
        "id": "theme_002",
        "name": "Ocean Waves",
        "category": "nature",
        "description": "Calming ocean sounds with AR waves",
        "thumbnail": "https://...",
        "duration": 1200,
        "sessions": 8,
        "rating": 4.7,
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

---

#### 12. Get Theme Detail

**Endpoint:** `GET /themed-rooms/themes/:id`  
**Authentication:** Optional  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "theme_001",
    "name": "Forest Meditation",
    "category": "nature",
    "description": "Peaceful forest environment for deep meditation",
    "longDescription": "...",
    "thumbnail": "https://...",
    "videos": [
      {
        "id": "vid_001",
        "name": "Forest Ambiance",
        "url": "https://...",
        "duration": 1800,
        "type": "main"
      },
      {
        "id": "vid_002",
        "name": "Bird Sounds - Optional",
        "url": "https://...",
        "duration": 1800,
        "type": "overlay"
      }
    ],
    "audioTracks": [
      {
        "id": "aud_001",
        "name": "Nature Sounds",
        "url": "https://...",
        "duration": 1800
      }
    ],
    "instructions": "Follow the guide as video plays...",
    "difficulty": "beginner",
    "benefits": [
      "Stress relief",
      "Better focus",
      "Improved sleep"
    ],
    "rating": 4.8,
    "reviews": 234
  }
}
```

---

#### 13. Start Session

**Endpoint:** `POST /themed-rooms/sessions`  
**Authentication:** Required  
**Role Required:** None

**Request:**
```json
{
  "themeId": "theme_001",
  "deviceInfo": "iPhone 14 Pro"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Session started",
  "data": {
    "sessionId": "sess_xyz",
    "themeId": "theme_001",
    "startedAt": "2026-02-25T14:22:00Z",
    "estimatedDuration": 1800
  }
}
```

---

#### 14. Get Session Status

**Endpoint:** `GET /themed-rooms/sessions/:sessionId`  
**Authentication:** Required  
**Role Required:** None (owner only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "sess_xyz",
    "themeId": "theme_001",
    "themeName": "Forest Meditation",
    "status": "in_progress",
    "startedAt": "2026-02-25T14:22:00Z",
    "elapsedTime": 360,
    "estimatedDuration": 1800,
    "completionPercentage": 20
  }
}
```

---

#### 15. End Session

**Endpoint:** `PATCH /themed-rooms/sessions/:sessionId/end`  
**Authentication:** Required  
**Role Required:** None (owner only)

**Request:**
```json
{
  "feedback": "Very relaxing!",
  "rating": 5
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session ended",
  "data": {
    "sessionId": "sess_xyz",
    "completedAt": "2026-02-25T14:28:00Z",
    "duration": 360,
    "feedback": "Very relaxing!",
    "rating": 5,
    "points": 50
  }
}
```

---

### Admin Endpoints

#### 16. Get All Users (Admin)

**Endpoint:** `GET /admin/users?page=1&limit=50&role=user`  
**Authentication:** Required  
**Role Required:** admin

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 50) - Items per page
- `role` (optional) - Filter by role: admin, user, therapist
- `search` (optional) - Search by name/email/phone
- `sortBy` (optional) - createdAt, name, email
- `order` (optional) - asc, desc

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user_123",
        "phone": "+91 98765 43210",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "status": "active",
        "createdAt": "2026-01-15T10:30:00Z",
        "subscription": {
          "planId": "plan_premium",
          "status": "active",
          "endDate": "2026-02-15T00:00:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1234,
      "pages": 25
    }
  }
}
```

---

#### 17. Get User Details (Admin)

**Endpoint:** `GET /admin/users/:id`  
**Authentication:** Required  
**Role Required:** admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "phone": "+91 98765 43210",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "createdAt": "2026-01-15T10:30:00Z",
    "subscriptions": [
      {
        "id": "sub_123",
        "planId": "plan_premium",
        "status": "active",
        "startDate": "2026-01-15T00:00:00Z",
        "endDate": "2026-02-15T00:00:00Z"
      }
    ],
    "sessions": 42,
    "totalMinutes": 2340,
    "lastActive": "2026-02-25T14:22:00Z"
  }
}
```

---

#### 18. Update User (Admin)

**Endpoint:** `PATCH /admin/users/:id`  
**Authentication:** Required  
**Role Required:** admin

**Request:**
```json
{
  "name": "John Doe Updated",
  "role": "therapist",
  "status": "active"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated",
  "data": {
    "id": "user_123",
    "name": "John Doe Updated",
    "role": "therapist",
    "status": "active"
  }
}
```

---

#### 19. Delete User (Admin)

**Endpoint:** `DELETE /admin/users/:id`  
**Authentication:** Required  
**Role Required:** admin

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

#### 20. Get Analytics Dashboard

**Endpoint:** `GET /admin/analytics/dashboard?period=30d`  
**Authentication:** Required  
**Role Required:** admin

**Query Parameters:**
- `period` (optional, default: 30d) - 7d, 30d, 90d, 1y

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "30d",
    "summary": {
      "totalUsers": 5432,
      "newUsers": 234,
      "activeUsers": 3421,
      "totalSessions": 45678,
      "avgSessionDuration": 1420,
      "totalSubscriptions": 2345,
      "activeSubscriptions": 1876,
      "revenue": 1876000,
      "avgOrderValue": 999
    },
    "daily": [
      {
        "date": "2026-02-25",
        "users": 145,
        "sessions": 234,
        "revenue": 23400
      }
    ],
    "topThemes": [
      {
        "id": "theme_001",
        "name": "Forest Meditation",
        "sessions": 5432,
        "rating": 4.8
      }
    ]
  }
}
```

---

#### 21. Get Audit Logs (Admin)

**Endpoint:** `GET /admin/audit-logs?page=1&limit=100`  
**Authentication:** Required  
**Role Required:** admin

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_001",
        "timestamp": "2026-02-25T14:22:00Z",
        "userId": "user_123",
        "action": "user_updated",
        "resource": "users",
        "resourceId": "user_456",
        "changes": {
          "role": "user → therapist"
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 100,
      "total": 5432,
      "pages": 55
    }
  }
}
```

---

### Payments Endpoints

#### 22. Create Payment

**Endpoint:** `POST /payments/create`  
**Authentication:** Required  
**Role Required:** None

**Request:**
```json
{
  "planId": "plan_premium",
  "amount": 999,
  "currency": "INR"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "transactionId": "txn_xyz",
    "redirectUrl": "https://phonpe-gateway.com/pay?ref=txn_xyz",
    "expiresIn": 600
  }
}
```

---

#### 23. Get Payment Status

**Endpoint:** `GET /payments/:transactionId`  
**Authentication:** Required  
**Role Required:** None (owner only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_xyz",
    "status": "completed",
    "planId": "plan_premium",
    "planName": "Premium Plan",
    "amount": 999,
    "currency": "INR",
    "createdAt": "2026-02-25T14:22:00Z",
    "completedAt": "2026-02-25T14:23:00Z",
    "subscription": {
      "id": "sub_123",
      "startDate": "2026-02-25T00:00:00Z",
      "endDate": "2026-03-25T00:00:00Z"
    }
  }
}
```

---

#### 24. Get Payment History

**Endpoint:** `GET /payments?page=1&limit=20`  
**Authentication:** Required  
**Role Required:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "transactionId": "txn_123",
        "planName": "Premium Plan",
        "amount": 999,
        "status": "completed",
        "createdAt": "2026-02-25T14:22:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

#### 25. Payment Webhook (PhonePe)

**Endpoint:** `POST /payments/webhook`  
**Authentication:** PhonePe Signature Verification  
**Rate Limit:** Unlimited (signature verified)

**Headers Required:**
```
X-Verify: SHA256_HMAC_signature
Content-Type: application/json
```

**Webhook Payload (from PhonePe):**
```json
{
  "success": true,
  "code": "PAYMENT_SUCCESS",
  "data": {
    "transactionId": "txn_xyz",
    "merchantTransactionId": "txn_xyz",
    "amount": 99900,
    "state": "COMPLETED",
    "responseCode": "SUCCESS"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Webhook processed",
  "acknowledgement": "txn_xyz"
}
```

---

### Health Checks

#### 26. Service Health

**Endpoint:** `GET /health`  
**Authentication:** None  
**Rate Limit:** Unlimited

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-25T14:22:00Z",
  "uptime": 3600
}
```

---

#### 27. Database Health

**Endpoint:** `GET /health/db`  
**Authentication:** None  
**Rate Limit:** Unlimited

**Response (200):**
```json
{
  "status": "ok",
  "database": "connected",
  "poolStats": {
    "checked_out": 5,
    "idle": 25,
    "waiting": 0,
    "poolSize": 30
  }
}
```

---

#### 28. Metrics

**Endpoint:** `GET /metrics`  
**Authentication:** None (or admin only in production)  
**Rate Limit:** Limited

**Response (200):**
```json
{
  "timestamp": "2026-02-25T14:22:00Z",
  "uptime": 3600,
  "memory": {
    "heapUsed": "125MB",
    "heapTotal": "512MB",
    "rss": "380MB"
  },
  "requests": {
    "total": 45678,
    "avgResponseTime": "125ms",
    "errorRate": "0.2%"
  },
  "database": {
    "poolSize": 30,
    "activeConnections": 5,
    "idleConnections": 25
  }
}
```

---

## Examples

### Login Flow

```
1. Send OTP
   POST /auth/send-otp
   {
     "phone": "+91 98765 43210"
   }

2. Verify OTP
   POST /auth/verify-otp
   {
     "phone": "+91 98765 43210",
     "otp": "123456"
   }
   ← Receive accessToken & refreshToken

3. Use Token
   GET /users/me
   Authorization: Bearer <accessToken>

4. Refresh Before Expiry
   POST /auth/refresh
   {
     "refreshToken": "<refreshToken>"
   }
   ← Receive new accessToken
```

### Payment Flow

```
1. Create Payment
   POST /payments/create
   {
     "planId": "plan_premium",
     "amount": 999,
     "currency": "INR"
   }
   ← Redirect to PhonePe

2. PhonePe Processes Payment
   User completes payment in PhonePe app

3. Webhook Notification
   POST /payments/webhook
   (from PhonePe servers)
   ← Creates subscription if successful

4. Check Status
   GET /payments/txn_xyz
   ← Subscription shows as active
```

---

**Last Updated:** February 25, 2026

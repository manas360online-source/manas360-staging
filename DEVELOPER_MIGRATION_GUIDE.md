# 🚀 DEVELOPER MIGRATION GUIDE - UNIFIED API CLIENT

## Quick Start: How to Use the New Architecture

### 1. Import the Unified API Client

**Before:**
```typescript
import analyticsApi from '../services/analyticsApi';
// or
const response = await fetch('/api/v1/users/me', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
});
```

**After:**
```typescript
import { api } from '@/utils/apiClient-unified';

const response = await api.users.getMe();
// Token injection + error handling automatic!
```

---

## 2. Use AuthContext for Authentication

**Before:**
```typescript
const token = localStorage.getItem('accessToken');
const user = decodeToken(token);
```

**After:**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, role, isAuthenticated, login, logout } = useAuth();
  
  // Auto-updates when user changes
  return <div>{user?.phone}</div>;
}
```

---

## 3. Use SubscriptionContext for Feature Checks

**Before:**
```typescript
const subscription = await fetch('/api/v1/subscriptions/current');
const hasFeature = subscription.features?.includes('themed_rooms');
```

**After:**
```typescript
import { useSubscription } from '@/contexts/SubscriptionContext';

function MyComponent() {
  const { hasFeature, subscription } = useSubscription();
  
  if (!hasFeature('themed_rooms')) {
    return <UpgradePrompt />;
  }
  
  return <PremiumContent />;
}
```

---

## 4. Protect Routes with Guards

**Admin Route:**
```tsx
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';

<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

**Premium Feature:**
```tsx
import { RequireFeature } from '@/components/guards/RequireFeature';

<RequireFeature feature="themed_rooms">
  <ThemedRoomPlayer />
</RequireFeature>
```

---

## API Endpoint Reference

### Auth Endpoints
```typescript
api.auth.sendOtp(email)               // POST /api/v1/auth/send-otp
api.auth.verifyOtp(email, otp)        // POST /api/v1/auth/verify-otp
api.auth.refresh(refreshToken)        // POST /api/v1/auth/refresh
api.auth.logout()                     // POST /api/v1/auth/logout
```

### User Endpoints
```typescript
api.users.getMe()                     // GET /api/v1/users/me
api.users.getProfile(userId)          // GET /api/v1/users/:id
api.users.updateProfile(data)         // PATCH /api/v1/users/me
```

### Subscription Endpoints
```typescript
api.subscriptions.getCurrent()        // GET /api/v1/subscriptions/current
api.subscriptions.getStatus()         // GET /api/v1/subscriptions/status
api.subscriptions.listAll()           // GET /api/v1/subscriptions
```

### Payment Endpoints
```typescript
api.payments.create(planId)           // POST /api/v1/payments/create
api.payments.getHistory()             // GET /api/v1/payments/history
```

### Themed Rooms Endpoints
```typescript
api.themedRooms.getThemes()           // GET /api/v1/themed-rooms/themes
api.themedRooms.createSession(themeId) // POST /api/v1/themed-rooms/sessions
api.themedRooms.endSession(id, duration, notes) // PATCH /api/v1/themed-rooms/sessions/:id/end
api.themedRooms.getSessions()         // GET /api/v1/themed-rooms/sessions
```

### Admin Endpoints
```typescript
api.admin.getUsers(filters)           // GET /api/v1/admin/users
api.admin.getUserById(userId)         // GET /api/v1/admin/users/:id
api.admin.getMetrics()                // GET /api/v1/admin/metrics
api.admin.getSubscriptions(filters)   // GET /api/v1/admin/subscriptions
api.admin.verifyTherapist(userId)     // PATCH /api/v1/admin/therapists/:id/verify
```

### Analytics Endpoints
```typescript
api.analytics.getOverview(dateRange)  // GET /api/v1/analytics/overview
api.analytics.getSessions(dateRange)  // GET /api/v1/analytics/sessions
api.analytics.getOutcomes(dateRange)  // GET /api/v1/analytics/outcomes
```

---

## Common Migration Patterns

### Pattern 1: Replace Direct Fetch
```typescript
// ❌ OLD
const response = await fetch('/api/v1/users/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();

// ✅ NEW
const response = await api.users.getMe();
const data = response.data;
```

### Pattern 2: Replace Custom Service
```typescript
// ❌ OLD
import analyticsApi from './services/analyticsApi';
const users = await analyticsApi.getAdminUsers(filters);

// ✅ NEW
import { api } from '@/utils/apiClient-unified';
const response = await api.admin.getUsers(filters);
const users = response.data.data;
```

### Pattern 3: Token Management
```typescript
// ❌ OLD
localStorage.setItem('accessToken', token);
const token = localStorage.getItem('accessToken');

// ✅ NEW
import { useAuth } from '@/contexts/AuthContext';
const { login, logout, user } = useAuth();
// AuthContext handles token storage automatically
```

---

## Error Handling

The unified API client automatically:
- ✅ Injects Bearer token on every request
- ✅ Refreshes token on 401 errors
- ✅ Logs out user if refresh fails
- ✅ Retries failed requests after refresh

**You don't need to handle these manually anymore!**

---

## TypeScript Support

All API methods are fully typed:

```typescript
import { api } from '@/utils/apiClient-unified';

// Autocomplete works!
const response = await api.users.getMe();
//    ^-- TypeScript knows this returns { data: { user: User } }

const user = response.data.user;
//    ^-- TypeScript knows user has { id, phone, role, ... }
```

---

## Best Practices

### ✅ DO:
- Use `api.*` methods for all backend calls
- Use `useAuth()` for authentication state
- Use `useSubscription()` for feature checks
- Wrap admin routes in `<ProtectedRoute>`
- Wrap premium features in `<RequireFeature>`

### ❌ DON'T:
- Don't use `fetch()` directly (unless external API)
- Don't access `localStorage.getItem('accessToken')` directly
- Don't create custom axios instances
- Don't hardcode API URLs
- Don't manually handle 401 errors

---

## Troubleshooting

### "Property 'api' does not exist on type 'AxiosInstance'"
**Fix**: Import `{ api }` not `apiClient`:
```typescript
import { api } from '@/utils/apiClient-unified';  // ✅
import apiClient from '@/utils/apiClient-unified'; // ❌
```

### "Cannot find module '../contexts/AuthContext'"
**Fix**: Use correct path from component location:
```typescript
import { useAuth } from '@/contexts/AuthContext';       // ✅ (with tsconfig paths)
import { useAuth } from '../../contexts/AuthContext';  // ✅ (relative)
```

### API call returns undefined
**Fix**: Check response structure:
```typescript
const response = await api.users.getMe();
const user = response.data.user;  // ✅ Backend wraps in { data: ... }
```

---

## Examples

### Example 1: Fetch User Profile
```typescript
import { useEffect, useState } from 'react';
import { api } from '@/utils/apiClient-unified';

function ProfilePage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.users.getMe();
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);
  
  return <div>{user?.phone}</div>;
}
```

### Example 2: Create Payment
```typescript
import { api } from '@/utils/apiClient-unified';

async function handleUpgrade() {
  try {
    const response = await api.payments.create('premium_monthly');
    
    if (response.data.redirectUrl) {
      window.location.href = response.data.redirectUrl;
    }
  } catch (error) {
    console.error('Payment failed:', error);
  }
}
```

### Example 3: Load Themed Rooms
```typescript
import { useEffect, useState } from 'react';
import { api } from '@/utils/apiClient-unified';

function ThemedRoomsPage() {
  const [themes, setThemes] = useState([]);
  
  useEffect(() => {
    const fetchThemes = async () => {
      const response = await api.themedRooms.getThemes();
      setThemes(response.data.themes);
    };
    fetchThemes();
  }, []);
  
  return (
    <div>
      {themes.map(theme => (
        <ThemeCard key={theme.id} theme={theme} />
      ))}
    </div>
  );
}
```

---

## Need Help?

- 📖 Full docs: [FRONTEND_STABILIZATION_COMPLETE.md](FRONTEND_STABILIZATION_COMPLETE.md)
- 🔍 API client source: [frontend/utils/apiClient-unified.ts](frontend/utils/apiClient-unified.ts)
- 🔐 Auth context: [frontend/main-app/contexts/AuthContext.tsx](frontend/main-app/contexts/AuthContext.tsx)
- 💳 Subscription context: [frontend/main-app/contexts/SubscriptionContext.tsx](frontend/main-app/contexts/SubscriptionContext.tsx)

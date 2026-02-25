# CRITICAL FIXES FOR PRODUCTION DEPLOYMENT
## Enterprise Security Audit - Week 1-2 Priority

### 1. FIX: Implement Security Middleware Suite
**File:** backend/src/server/index.js  
**Priority:** P0 - CRITICAL

#### Problem:
- No Helmet.js (missing security headers)
- No CORS configuration
- No rate limiting
- No input validation
- No request timeout protection

#### Solution Implementation:

```javascript
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// 1. Security Headers (Helmet)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    hsts: {
        maxAge: 63072000, // 2 years
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true
}));

// 2. CORS Configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
}));

// 3. Body Parser with Size Limits
app.use(express.json({ 
    limit: '10kb',  // Prevent large payload attacks
    strict: true    // Only parse arrays/objects
}));
app.use(express.urlencoded({ 
    limit: '10kb', 
    extended: false 
}));

// 4. Data Sanitization (prevent NoSQL injection)
app.use(mongoSanitize());

// 5. Request Timeout
app.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds
    res.setTimeout(30000);
    next();
});

// 6. Global Rate Limiting (for all requests)
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.ip === process.env.INTERNAL_IP, // Skip internal IPs
    keyGenerator: (req) => req.ip || req.connection.remoteAddress
});
app.use(globalLimiter);

// 7. Strict Rate Limiting for Auth Endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Max 5 login attempts per 15 mins
    message: 'Too many login attempts, please try again later',
    skipSuccessfulRequests: true,
    skipFailedRequests: false
});
app.post('/api/v1/auth/login', authLimiter, ...);
app.post('/api/v1/auth/register', authLimiter, ...);
app.post('/api/v1/auth/refresh', authLimiter, ...);

// 8. Input Validation Middleware
export function validateRequest(validations) {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'ValidationError',
                message: 'Request validation failed',
                errors: errors.array().map(e => ({
                    field: e.param,
                    message: e.msg
                }))
            });
        }
        next();
    };
}

// 9. Request Logger Middleware (structured logging)
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'manas360-api' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

app.use((req, res, next) => {
    const requestId = req.headers['x-request-id'] || crypto.randomUUID();
    req.id = requestId;
    
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info('HTTP Request', {
            requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    next();
});

// 10. Enhanced Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled Error', {
        requestId: req.id,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    // Don't leak stack traces in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        success: false,
        error: err.code || 'InternalServerError',
        message: err.message || 'An internal server error occurred',
        requestId: req.id,
        ...(isDevelopment && { stack: err.stack })
    });
});

export default app;
```

#### Required Dependencies:
```bash
npm install helmet express-rate-limit express-validator express-mongo-sanitize winston
```

#### Environment Variables:
```env
ALLOWED_ORIGINS=http://localhost:3000,https://app.manas360.com
INTERNAL_IP=127.0.0.1
LOG_LEVEL=info
NODE_ENV=production
```

---

### 2. FIX: Fix Token Generation Function Signature Mismatch
**File:** backend/src/middleware/authMiddleware.js  
**Priority:** P0 - CRITICAL

#### Problem:
```javascript
// Line 18: Function definition expects (userId, roleId)
export function generateAccessToken(userId, roleId) { ... }

// Line 163: Called with object {id, email, roleId}
const tokens = await generateAccessToken({
    id: user.id,
    email: user.email,
    roleId: user.role_id
});
```

#### Solution:
```javascript
// Unified function signature with proper JWT structure
export function generateAccessToken(userId, roleId, email = null) {
    const payload = {
        userId,
        roleId,
        email,
        tokenType: 'access',
        iat: Math.floor(Date.now() / 1000),
        iss: 'manas360-api'
    };
    
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY || '24h',
        algorithm: 'HS256'
    });
    
    return token;
}

// Update all call sites:
// BEFORE:
const tokens = await generateAccessToken({ id: user.id, email: user.email, roleId: user.role_id });

// AFTER:
const accessToken = generateAccessToken(user.id, user.role_id, user.email);
const refreshToken = generateRefreshToken(user.id);

return {
    accessToken,
    refreshToken,
    expiresIn: JWT_EXPIRY
};
```

---

### 3. FIX: Add Rate Limiting to Auth Endpoints
**File:** Multiple (see above in Security Middleware)  
**Priority:** P0 - CRITICAL

#### Problem:
- No rate limiting on `/api/auth/login`
- No account lockout on failed attempts
- Enables brute force attacks

#### Solution:
```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from 'redis';

// Connect to Redis for distributed rate limiting
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
});

// 1. Login attempt limiter
const loginLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'login_limit:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 failed attempts
    skipSuccessfulRequests: true, // Don't count successful logins
    skipFailedRequests: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            error: 'TooManyAttempts',
            message: 'Account temporarily locked due to multiple failed login attempts',
            retryAfter: 900 // 15 * 60 seconds
        });
    }
});

// 2. Registration limiter (per IP)
const registerLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'register_limit:'
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 registrations per hour
    message: 'Too many accounts created from this IP'
});

// 3. Token refresh limiter
const refreshLimiter = rateLimit({
    store: new RedisStore({
        client: redisClient,
        prefix: 'refresh_limit:'
    }),
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // 20 refreshes per 5 mins (normal usage)
    skipSuccessfulRequests: false
});

// Apply to routes
router.post('/auth/login', loginLimiter, loginController);
router.post('/auth/register', registerLimiter, registerController);
router.post('/auth/refresh', refreshLimiter, refreshController);
```

#### Account Lockout Strategy:
```javascript
// Track failed attempts in database
async function recordFailedLogin(email) {
    const now = new Date();
    const fifteenMinsAgo = new Date(now.getTime() - 15 * 60 * 1000);
    
    const query = `
        INSERT INTO login_attempts (email, attempt_at, success)
        VALUES ($1, $2, false)
    `;
    await pool.query(query, [email, now]);
    
    // Check failed attempts
    const result = await pool.query(`
        SELECT COUNT(*) as failed_count
        FROM login_attempts
        WHERE email = $1 AND success = false AND attempt_at > $2
    `, [email, fifteenMinsAgo]);
    
    return result.rows[0].failed_count;
}

export async function loginUser(email, password, ipAddress, userAgent) {
    try {
        // Check if account is locked
        const failedCount = await recordFailedLogin(email);
        if (failedCount > 5) {
            throw new Error('Account temporarily locked. Try again after 15 minutes.');
        }
        
        // ... rest of login logic ...
        
        // On success, clear failed attempts
        if (passwordMatch) {
            await pool.query(
                'DELETE FROM login_attempts WHERE email = $1 AND success = false',
                [email]
            );
        }
    }
}
```

---

### 4. FIX: Remove Subscription Requirement from Login
**File:** backend/src/services/userService.js  
**Priority:** P1 - HIGH

#### Problem (Line 152):
```javascript
// WRONG: Blocks free users from logging in!
if (subscriptionResult.rows.length === 0) {
    throw new Error('No active subscription found');
}
```

#### Solution:
```javascript
export async function loginUser(email, password, ipAddress, userAgent) {
    try {
        const userResult = await pool.query(
            'SELECT id, email, password_hash, role_id FROM user_accounts WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );

        if (userResult.rows.length === 0) {
            await logAuditEvent({
                userId: null,
                action: 'login_failed',
                reason: 'User not found',
                ipAddress,
                userAgent
            });
            throw new Error('Invalid credentials');
        }

        const user = userResult.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            await logAuditEvent({
                userId: user.id,
                action: 'login_failed',
                reason: 'Invalid password',
                ipAddress,
                userAgent
            });
            throw new Error('Invalid credentials');
        }

        // ✅ REMOVED: Don't require active subscription for login
        // Free tier users (with 100-year expiry) should still be able to login

        const accessToken = generateAccessToken(user.id, user.role_id, user.email);
        const refreshToken = generateRefreshToken(user.id);
        
        await storeRefreshToken(user.id, refreshToken, ipAddress, userAgent);

        await logAuditEvent({
            userId: user.id,
            action: 'login_success',
            ipAddress,
            userAgent
        });

        return {
            success: true,
            user: { id: user.id, email: user.email },
            accessToken,
            refreshToken,
            expiresIn: 86400 // 24 hours
        };

    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}
```

---

### 5. FIX: Add Input Validation to All Routes
**File:** backend/src/routes/saasExampleRoutes.js & All Routes  
**Priority:** P1 - HIGH

#### Problem:
```javascript
// NO VALIDATION:
router.delete('/admin/users/:userId', authenticateToken, authorizeRole(...), (req, res) => {
    const { userId } = req.params;  // What if it's not a valid UUID?
    await pool.query('UPDATE user_accounts SET deleted_at = NOW() WHERE id = $1', [userId]);
});
```

#### Solution:
```javascript
import { body, param, query, validationResult } from 'express-validator';
import { validateRequest } from '../middleware/validationMiddleware.js';

// Example validation middleware
function validateUserId(paramName = 'userId') {
    return param(paramName)
        .isUUID()
        .withMessage('Invalid user ID format')
        .trim();
}

function validateEmail() {
    return body('email')
        .isEmail()
        .withMessage('Invalid email address')
        .normalizeEmail()
        .toLowerCase();
}

function validatePassword() {
    return body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be 8-128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character');
}

// Apply to routes
router.delete('/admin/users/:userId',
    authenticateToken,
    authorizeRole(['admin', 'superadmin']),
    [
        validateUserId('userId'),
        body('reason').optional().isString().trim().isLength({ max: 500 })
    ],
    validateRequest,  // Validation middleware
    async (req, res) => {
        const { userId } = req.params;
        
        // Additional check: prevent self-deletion
        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                error: 'InvalidOperation',
                message: 'Cannot delete your own account'
            });
        }
        
        await pool.query(
            'UPDATE user_accounts SET deleted_at = NOW() WHERE id = $1',
            [userId]
        );
        
        res.json({ success: true, message: 'User deleted' });
    }
);

router.post('/auth/login',
    [
        validateEmail(),
        validatePassword()
    ],
    validateRequest,
    async (req, res) => {
        // Input is already validated here
        const { email, password } = req.body;
        // ... login logic ...
    }
);
```

---

### 6. FIX: Fix Feature Access Middleware Query
**File:** backend/src/middleware/featureAccessMiddleware.js  
**Priority:** P1 - HIGH

#### Problem (Lines 65-73):
```javascript
// DANGEROUS: Ambiguous column reference
const subscriptionResult = await pool.query(
    `SELECT sp.name, sp.tier 
     FROM vw_users_with_subscription 
     JOIN subscription_plans sp ON sp.id = (
        SELECT id FROM subscription_plans WHERE tier = 
        (SELECT tier FROM subscription_plans 
         WHERE id IN (SELECT id FROM features WHERE name = $1))
        LIMIT 1
     )
     WHERE id = $1`,  // ❌ Which table's id?
    [features[0]]
);
```

#### Solution:
```javascript
export function checkFeatureAccess(requiredFeatures = []) {
    const features = Array.isArray(requiredFeatures) 
        ? requiredFeatures 
        : [requiredFeatures];

    return async (req, res, next) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // Simpler, clearer query
            const query = `
                SELECT DISTINCT f.name as feature_name
                FROM user_subscriptions us
                JOIN subscription_plans sp ON us.plan_id = sp.id
                JOIN plan_features pf ON sp.id = pf.plan_id
                JOIN features f ON pf.feature_id = f.id
                WHERE us.user_id = $1 
                  AND f.is_active = true
                  AND us.status = 'active'
                  AND us.ends_at > NOW()
            `;

            const result = await pool.query(query, [userId]);
            const userFeatures = result.rows.map(row => row.feature_name);

            const hasFeature = features.some(feat => 
                userFeatures.includes(feat)
            );

            if (!hasFeature) {
                await logAuditEvent({
                    userId,
                    action: 'feature_access_denied',
                    features: features,
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent')
                });

                // Get recommended plan
                const planQuery = `
                    SELECT sp.name, sp.tier, sp.price_monthly
                    FROM subscription_plans sp
                    JOIN plan_features pf ON sp.id = pf.plan_id
                    JOIN features f ON pf.feature_id = f.id
                    WHERE f.name = $1 AND sp.tier > (
                        SELECT sp2.tier
                        FROM user_subscriptions us
                        JOIN subscription_plans sp2 ON us.plan_id = sp2.id
                        WHERE us.user_id = $2 AND us.status = 'active'
                        LIMIT 1
                    )
                    ORDER BY sp.tier ASC
                    LIMIT 1
                `;
                
                const planResult = await pool.query(planQuery, [features[0], userId])
                    .catch(() => ({ rows: [] }));

                return res.status(403).json({
                    success: false,
                    error: 'FeatureNotAvailable',
                    message: 'This feature requires a subscription upgrade',
                    requiredFeatures: features,
                    recommendedPlan: planResult.rows[0] || null,
                    userFeatures: userFeatures
                });
            }

            req.user.features = userFeatures;
            next();

        } catch (error) {
            console.error('Feature access check error:', error);
            res.status(500).json({
                success: false,
                error: 'FeatureCheckError',
                message: 'Failed to verify feature access'
            });
        }
    };
}
```

---

### 7. FIX: Implement Permission Caching in JWT
**File:** backend/src/middleware/authMiddleware.js & rbacMiddleware.js  
**Priority:** P1 - HIGH

#### Problem:
Every request queries database for roles/permissions (N+1)

#### Solution:
```javascript
// authMiddleware.js - Enhanced JWT with permissions
export async function generateAccessToken(userId, roleId, email = null) {
    // Fetch user permissions once during token generation
    const permQuery = `
        SELECT DISTINCT p.name
        FROM role_permissions rp
        JOIN permissions p ON rp.permission_id = p.id
        WHERE rp.role_id = $1
    `;
    
    const permResult = await pool.query(permQuery, [roleId]);
    const permissions = permResult.rows.map(r => r.name);
    
    // Get role name
    const roleResult = await pool.query(
        'SELECT name, privilege_level FROM roles WHERE id = $1',
        [roleId]
    );
    const role = roleResult.rows[0];
    
    const payload = {
        userId,
        roleId,
        email,
        role: role.name,
        privilegeLevel: role.privilege_level,
        permissions,  // ✅ Cache permissions in JWT
        tokenType: 'access',
        iat: Math.floor(Date.now() / 1000),
        iss: 'manas360-api'
    };
    
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY || '24h',
        algorithm: 'HS256'
    });
}

// rbacMiddleware.js - Use cached permissions from JWT
export function checkPermission(requiredPermissions = []) {
    const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

    return async (req, res, next) => {
        try {
            const userPermissions = req.user?.permissions || [];

            const hasPermission = permissions.some(perm => 
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                await logAuditEvent({
                    userId: req.user?.id,
                    action: 'permission_denied',
                    required_permissions: permissions,
                    endpoint: req.originalUrl,
                    ipAddress: req.ip
                });

                return res.status(403).json({
                    success: false,
                    error: 'PermissionDenied',
                    message: `Missing required permission: ${permissions.join(' or ')}`
                });
            }

            next();

        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                error: 'PermissionCheckError',
                message: 'Failed to verify permission'
            });
        }
    };
}

// Middleware to populate req.user from JWT
export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ['HS256']
        });

        if (decoded.tokenType !== 'access') {
            throw new Error('Invalid token type');
        }

        // Populate req.user with all claims from JWT (including cached permissions)
        req.user = {
            id: decoded.userId,
            roleId: decoded.roleId,
            email: decoded.email,
            role: decoded.role,
            privilegeLevel: decoded.privilegeLevel,
            permissions: decoded.permissions  // ✅ No DB query needed!
        };

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'TokenExpired',
                message: 'Access token has expired. Please refresh.'
            });
        }
        throw error;
    }
}
```

---

## PHASE 2: Database Performance (Week 2-3)

### 8. FIX: Database Connection Pool Configuration

```javascript
// backend/src/server/db.js
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
    // Connection Pool Settings
    max: parseInt(process.env.DB_POOL_MAX || '30'),
    min: parseInt(process.env.DB_POOL_MIN || '5'),
    
    // Connection Timeouts
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    
    // Statement Timeout
    statement_timeout: 30000,
    
    // Connection Validation
    query_timeout: 10000
});

// Add connection error handler
pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', {
        error: err.message,
        stack: err.stack
    });
});

// Connection pool draining (for graceful shutdown)
export async function closePool() {
    await pool.end();
}
```

### 9. FIX: Add Database Indexes

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_user_accounts_email ON public.user_accounts(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_accounts_role_id ON public.user_accounts(role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id) WHERE status = 'active';
CREATE INDEX idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);
CREATE INDEX idx_sessions_user_id_created ON public.sessions(user_id, created_at);
CREATE INDEX idx_tokens_user_id_revoked ON public.tokens(user_id, revoked_at);
CREATE INDEX idx_tokens_expires_at ON public.tokens(expires_at);
CREATE INDEX idx_audit_logs_user_id_action ON public.audit_logs(user_id, action, created_at DESC);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_login_attempts_email_time ON public.login_attempts(email, attempt_at DESC);

-- Indexes on views (materialized)
CREATE INDEX idx_vw_user_features_user_id ON vw_user_features(user_id);
CREATE INDEX idx_vw_users_with_subscription_id ON vw_users_with_subscription(id);
```

---

## PHASE 3: Scalability & Observability (Week 3-4)

### 10. FIX: Implement Graceful Shutdown

```javascript
// server.js
import { closePool } from './db.js';

const server = app.listen(port, () => {
    logger.info(`API server listening on port ${port}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    logger.info(`Received ${signal}, starting graceful shutdown`);
    
    // Stop accepting new requests
    server.close(async () => {
        logger.info('HTTP server closed');
        
        // Close database connections
        await closePool();
        logger.info('Database connections closed');
        
        process.exit(0);
    });
    
    // Force shutdown after timeout
    setTimeout(() => {
        logger.error('Could not close connections in time, forcing shutdown');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

### 11. FIX: Enhanced Health Check Endpoint

```javascript
app.get('/api/health', async (req, res) => {
    try {
        // Check database connectivity
        const dbResult = await pool.query('SELECT NOW()');
        const dbHealth = dbResult.rows.length > 0 ? 'healthy' : 'unhealthy';
        
        // Check memory usage
        const memUsage = process.memoryUsage();
        const heapPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        
        const status = heapPercentage < 90 && dbHealth === 'healthy' ? 'ok' : 'degraded';
        
        res.status(status === 'ok' ? 200 : 503).json({
            status,
            timestamp: new Date().toISOString(),
            database: dbHealth,
            memory: {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
                percentage: heapPercentage.toFixed(2) + '%'
            },
            uptime: process.uptime()
        });
    } catch (error) {
        logger.error('Health check failed', { error: error.message });
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});
```

---

## Summary of Critical Fixes

| Fix | File | Impact | Effort |
|---|---|---|---|
| Security Middleware Suite | index.js | Prevents 5 attack vectors | 8 hours |
| Token Generation Fix | authMiddleware.js | Fixes JWT payload | 2 hours |
| Rate Limiting on Auth | Multiple | Prevents brute force | 4 hours |
| Remove Subscription Login Requirement | userService.js | Fixes free tier access | 1 hour |
| Input Validation | All routes | Prevents injection attacks | 8 hours |
| Fix Feature Middleware Query | featureAccessMiddleware.js | Fixes access control | 2 hours |
| Permission Caching in JWT | authMiddleware.js | Eliminates N+1 queries | 6 hours |
| DB Connection Pool Config | db.js | Enables 100K users | 2 hours |
| Add Database Indexes | Migration | Improves query performance | 1 hour |
| Graceful Shutdown | server.js | Production reliability | 3 hours |
| Enhanced Health Check | index.js | Enables monitoring | 2 hours |

**Total Implementation Time: 39 hours (roughly 1 week for one developer)**


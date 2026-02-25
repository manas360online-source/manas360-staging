import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pg from 'pg';
import authRoutes from './backend/src/routes/authRoutes.js';
import userRoutes from './backend/src/routes/userRoutes.js';
import subscriptionRoutes from './backend/src/routes/subscriptionRoutes.js';
import paymentRoutes from './backend/src/routes/paymentRoutes.js';
import themedRoomsRoutes from './backend/src/routes/themedRoomsRoutes.js';
import adminRoutes from './backend/src/routes/adminRoutes.js';
import analyticsRoutes from './backend/src/routes/analyticsRoutes.js';
import { authenticateToken } from './backend/src/middleware/authMiddleware-unified.js';
import { authorizeRole, authorizePermission } from './backend/src/middleware/rbacMiddleware-unified.js';
import { requireAdminMfa } from './backend/src/middleware/adminMfaMiddleware.js';
import { logSecurityEvent } from './backend/src/utils/securityLogger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env first (defaults), then .env.local (explicit overrides)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env.local'), override: true });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();

const allowedOrigins = (
  process.env.CORS_ORIGINS
  || process.env.CORS_ALLOWED_ORIGINS
  || process.env.CORS_ORIGIN
  || process.env.FRONTEND_ORIGIN
  || 'http://localhost:3000,http://localhost:5001,http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_GLOBAL_MAX || 500),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_AUTH_MAX || 50),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' }
});

const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_ADMIN_AUTH_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many admin authentication attempts. Please try again later.' }
});

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((value) => value.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const index = item.indexOf('=');
      if (index > 0) {
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});
}

app.use(helmet());
app.use(globalLimiter);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS policy'));
  },
  credentials: true
}));

app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  const mutatingMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!mutatingMethods.includes(method) || !req.path.startsWith('/api/v1')) {
    return next();
  }

  const cookies = parseCookies(req.headers.cookie || '');
  const accessCookie = cookies.access_token;

  if (!accessCookie) {
    return next();
  }

  const csrfExempt = new Set([
    '/api/v1/auth/send-otp',
    '/api/v1/auth/verify-otp',
    '/api/v1/auth/login',
    '/api/v1/auth/admin-login',
    '/api/v1/auth/admin-login/verify-mfa'
  ]);

  if (csrfExempt.has(req.path)) {
    return next();
  }

  const csrfCookie = cookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      success: false,
      message: 'CSRF validation failed'
    });
  }

  return next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Unified v1 routes
app.use('/api/v1/auth/admin-login', adminAuthLimiter);
app.use('/api/v1/auth/admin-login/verify-mfa', adminAuthLimiter);
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', authenticateToken, userRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/themed-rooms', themedRoomsRoutes);
app.use('/api/v1/admin', authenticateToken, requireAdminMfa, authorizeRole(['admin']), adminRoutes);
app.use('/api/v1/analytics', authenticateToken, authorizePermission(['view_analytics']), analyticsRoutes);

app.use((err, _req, res, _next) => {
  logSecurityEvent('server_error', {
    message: err?.message || 'unknown_error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
    code: err?.code || null
  });
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const port = Number(process.env.PORT || 5001);

async function startServer() {
  const listen = () => {
    app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   MANAS360 Unified Backend              ║
║   Main API + Admin Analytics             ║
╠════════════════════════════════════════╣
║   Port: ${port}                              ║
║   Status: Running                      ║
╠════════════════════════════════════════╣
║   Main Routes:                         ║
║   • GET /health                        ║
║   • POST /api/v1/auth/send-otp         ║
║   • POST /api/v1/auth/verify-otp       ║
║   • /api/v1/admin/*                    ║
║   • /api/v1/analytics/*                ║
╚════════════════════════════════════════╝`);
    });
  };

  try {
    const client = await pool.connect();
    console.log('✅ Database connected');
    client.release();
    listen();
  } catch (error) {
    console.warn('⚠️  Database connection failed; starting server without DB. Error:', error && error.message ? error.message : error);
    listen();
  }
}

startServer();

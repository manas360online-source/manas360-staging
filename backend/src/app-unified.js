// ================================================================
// MANAS360 Unified Backend - Express Application
// ================================================================
// Single entry point for all API routes with production security
// Port: 5000
// Version: 2.0 (Unified)
// ================================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import config
import { pool, validateDbConnection } from './config/database.js';
import { validateEnvironment } from './config/environment.js';

// Import middlewares
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';
import { authenticateToken } from './middlewares/auth.js';
import { authorizeRole } from './middlewares/rbac.js';

// Import module routers
import authModule from './modules/auth/index.js';
import usersModule from './modules/users/index.js';
import subscriptionsModule from './modules/subscriptions/index.js';
import adminModule from './modules/admin/index.js';
import analyticsModule from './modules/analytics/index.js';
import paymentsModule from './modules/payments/index.js';
import themedRoomsModule from './modules/themedRooms/index.js';

// ================================================================
// INITIALIZATION
// ================================================================

// Validate environment at startup
export function validateConfig() {
  try {
    validateEnvironment();
    console.log('✅ Environment variables validated');
  } catch (error) {
    console.error('❌ Environment validation failed:', error.message);
    process.exit(1);
  }
}

// Create Express app
export const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// ================================================================
// SECURITY MIDDLEWARE (Applied First)
// ================================================================

// Helmet: Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:4173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: process.env.JSON_LIMIT || '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Compression
app.use(compression());

// Request timeout
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// ================================================================
// LOGGING & MONITORING
// ================================================================

// Morgan HTTP request logger
app.use(morgan(isDevelopment ? 'dev' : 'combined', {
  skip: (req) => req.path === '/health', // Don't log health checks
}));

// Custom request logger
app.use(requestLogger());

// ================================================================
// RATE LIMITING
// ================================================================

// Global rate limit: 1000 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: false,
  skip: (req) => req.path === '/health',
});

// Auth rate limit: 5 attempts per 15 minutes (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: false,
  skip: (req) => !req.path.includes('/auth'),
});

app.use(globalLimiter);
app.use('/api/v1/auth', authLimiter);

// ================================================================
// HEALTH CHECK ENDPOINTS
// ================================================================

// Basic health check
app.get('/health', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      service: 'MANAS360 Unified Backend',
      version: '2.0',
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();

    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].now,
      poolStats: {
        checked_out: pool.checked_out,
        idle: pool.idleCount,
        waiting: pool.waitingCount,
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      service: 'MANAS360 Unified Backend',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: {
        poolSize: pool.totalCount,
        idleCount: pool.idleCount,
        checkedOut: pool.checked_out,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
});

// ================================================================
// PUBLIC ROUTES
// ================================================================

// Auth module (no auth required)
app.use('/api/v1/auth', authModule);

// ================================================================
// PROTECTED ROUTES (Require authentication)
// ================================================================

// Users module
app.use('/api/v1/users', authenticateToken, usersModule);

// Subscriptions module
app.use('/api/v1/subscriptions', authenticateToken, subscriptionsModule);

// Themed rooms module
app.use('/api/v1/themed-rooms', authenticateToken, themedRoomsModule);

// ================================================================
// ADMIN-ONLY ROUTES (Require admin role)
// ================================================================

// Admin module
app.use('/api/v1/admin', authenticateToken, authorizeRole(['admin', 'superadmin']), adminModule);

// Analytics module
app.use('/api/v1/analytics', authenticateToken, authorizeRole(['admin', 'superadmin']), analyticsModule);

// ================================================================
// PAYMENT ROUTES (Special webhook handling)
// ================================================================

// Payments module (includes public webhook)
app.use('/api/v1/payments', paymentsModule);

// ================================================================
// 404 HANDLER
// ================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// ================================================================
// GLOBAL ERROR HANDLER (Applied Last)
// ================================================================

app.use(errorHandler());

// ================================================================
// EXPORT
// ================================================================

export default app;

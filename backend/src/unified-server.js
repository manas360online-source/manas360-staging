/**
 * ════════════════════════════════════════════════════════════════════
 * MANAS360 UNIFIED BACKEND SERVER — PRODUCTION READY
 * ════════════════════════════════════════════════════════════════════
 * 
 * Consolidates 4 isolated servers into ONE unified Express app:
 * - Main Auth (was port 5001)
 * - Admin Analytics (was port 3001)
 * - Payment Gateway (was port 5002)
 * - Themed Rooms (was port 4000)
 * 
 * NOW: Single port 5000 with all routes under /api/v1/*
 * 
 * Author: DevOps Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import database pool
import { pool } from './config/database.js';

// Import middleware
import { authenticateToken, refreshTokenHandler } from './middleware/authMiddleware-unified.js';
import { authorizeRole, authorizePermission } from './middleware/rbacMiddleware.js';
import { requireSubscription } from './middleware/subscriptionGating.js';
import { globalErrorHandler, asyncHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import themedRoomsRoutes from './routes/themedRoomsRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

// ════════════════════════════════════════════════════════════════════
// EXPRESS APP SETUP
// ════════════════════════════════════════════════════════════════════

const app = express();

// ─────────────────────────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────────────────────────

// Helmet: Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

// CORS: Allow frontend origin
const corsOptions = {
  origin: NODE_ENV === 'production' ? CORS_ORIGIN : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// ─────────────────────────────────────────────────────────────────
// Performance Middleware
// ─────────────────────────────────────────────────────────────────

app.use(compression()); // Gzip compression
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev')); // HTTP logging

// ─────────────────────────────────────────────────────────────────
// Body Parsing Middleware
// ─────────────────────────────────────────────────────────────────

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// ─────────────────────────────────────────────────────────────────
// Rate Limiting
// ─────────────────────────────────────────────────────────────────

// General rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  skipSuccessfulRequests: true, // Don't count successful requests
  message: { success: false, message: 'Too many login attempts, please try again later' }
});

app.use('/api/', limiter);
app.use('/api/v1/auth/send-otp', authLimiter);
app.use('/api/v1/auth/verify-otp', authLimiter);

// ════════════════════════════════════════════════════════════════════
// ROUTES
// ════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────
// Health Check Endpoints
// ─────────────────────────────────────────────────────────────────

/**
 * Basic health check
 * Response: { status: 'ok' }
 */
app.get('/health', asyncHandler(async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}));

/**
 * Database health check
 * Response: { status: 'ok', database: 'connected' }
 */
app.get('/health/db', asyncHandler(async (req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: result.rows[0].now
  });
}));

/**
 * Metrics endpoint (for monitoring)
 * Response: { uptime, connections, environment }
 */
app.get('/metrics', asyncHandler(async (req, res) => {
  const poolStats = pool._pool;
  res.json({
    uptime: process.uptime(),
    environment: NODE_ENV,
    port: PORT,
    memory: process.memoryUsage(),
    database: {
      connections: poolStats?.length || 0,
      available: pool.idleCount || 0,
      waitingCount: pool.waitingCount || 0
    }
  });
}));

// ─────────────────────────────────────────────────────────────────
// Public Routes (No Authentication Required)
// ─────────────────────────────────────────────────────────────────

// Auth routes (send-otp, verify-otp, refresh, logout)
app.use('/api/v1/auth', authRoutes);

// Public themed rooms (list themes)
app.use('/api/v1/themed-rooms/themes', (req, res, next) => {
  req.path = '/'; // Ensure /themes maps to list endpoint
  next();
});

// ─────────────────────────────────────────────────────────────────
// Protected Routes (Authentication Required)
// ─────────────────────────────────────────────────────────────────

// Apply authentication middleware to all protected routes
app.use('/api/v1', authenticateToken);

// User routes
app.use('/api/v1/users', userRoutes);

// Themed rooms (with auth)
app.use('/api/v1/themed-rooms', themedRoomsRoutes);

// Subscription routes
app.use('/api/v1/subscriptions', subscriptionRoutes);

// Payment routes (with auth for non-webhook endpoints)
app.use('/api/v1/payments', paymentRoutes);

// ─────────────────────────────────────────────────────────────────
// Admin Routes (Authentication + Admin Role Required)
// ─────────────────────────────────────────────────────────────────

app.use('/api/v1/admin', authorizeRole(['admin']), adminRoutes);

// ─────────────────────────────────────────────────────────────────
// Analytics Routes (Authentication + Analytics Permission Required)
// ─────────────────────────────────────────────────────────────────

app.use(
  '/api/v1/analytics',
  authorizePermission(['view_analytics']),
  analyticsRoutes
);

// ════════════════════════════════════════════════════════════════════
// ERROR HANDLING
// ════════════════════════════════════════════════════════════════════

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    path: req.path
  });
});

// Global Error Handler (must be last)
app.use(globalErrorHandler);

// ════════════════════════════════════════════════════════════════════
// SERVER STARTUP & GRACEFUL SHUTDOWN
// ════════════════════════════════════════════════════════════════════

let server;

async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', result.rows[0].now);

    // Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 MANAS360 UNIFIED BACKEND - PRODUCTION READY              ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║   Environment: ${NODE_ENV.padEnd(45)} ║
║   Port: ${String(PORT).padEnd(54)} ║
║   CORS Origin: ${CORS_ORIGIN.padEnd(42)} ║
║                                                               ║
╠═══════════════════════════════════════════════════════════════╣
║   Available Endpoints:                                        ║
║                                                               ║
║   📍 Health Checks:                                           ║
║      GET http://localhost:${PORT}/health                     ║
║      GET http://localhost:${PORT}/health/db                  ║
║      GET http://localhost:${PORT}/metrics                    ║
║                                                               ║
║   🔐 Authentication:                                          ║
║      POST /api/v1/auth/send-otp                              ║
║      POST /api/v1/auth/verify-otp                            ║
║      POST /api/v1/auth/refresh                               ║
║      POST /api/v1/auth/logout                                ║
║                                                               ║
║   👤 User:                                                    ║
║      GET /api/v1/users/me                                    ║
║      GET /api/v1/users/:id                                   ║
║                                                               ║
║   💳 Payments:                                                ║
║      POST /api/v1/payments/create                            ║
║      POST /api/v1/payments/webhook                           ║
║                                                               ║
║   📅 Subscriptions:                                           ║
║      GET /api/v1/subscriptions/current                       ║
║      GET /api/v1/subscriptions/status                        ║
║                                                               ║
║   🌿 Themed Rooms:                                            ║
║      GET /api/v1/themed-rooms/themes                         ║
║      POST /api/v1/themed-rooms/sessions                      ║
║      PATCH /api/v1/themed-rooms/sessions/:id/end             ║
║                                                               ║
║   👨‍💼 Admin (admin role only):                                  ║
║      GET /api/v1/admin/users                                 ║
║      POST /api/v1/admin/suspend-user/:id                     ║
║      GET /api/v1/admin/analytics                             ║
║                                                               ║
║   📊 Analytics (analytics permission only):                   ║
║      GET /api/v1/analytics/overview                          ║
║      GET /api/v1/analytics/sessions                          ║
║      GET /api/v1/analytics/outcomes                          ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);
    });

    // Graceful shutdown handlers
    const gracefulShutdown = async (signal) => {
      console.log(`\n📛 ${signal} received. Shutting down gracefully...`);

      // Stop accepting new requests
      server.close(async () => {
        console.log('✅ HTTP server closed');

        // Close database pool
        try {
          await pool.end();
          console.log('✅ Database pool closed');
        } catch (error) {
          console.error('❌ Error closing database pool:', error);
        }

        console.log('✅ Process exited cleanly');
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown (timeout)');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export { app, pool };

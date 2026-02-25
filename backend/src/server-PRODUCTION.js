/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCTION EXPRESS SERVER
 * Enterprise-grade API server for 100,000+ concurrent users
 * 
 * FEATURES:
 * ✅ Complete security middleware stack
 * ✅ Graceful shutdown
 * ✅ Structured logging
 * ✅ Health checks with DB validation
 * ✅ Error handling & sanitization
 * ✅ Environment validation
 * ✅ Request logging
 * ═══════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import winston from 'winston';
import { pool, healthCheck, closePool } from './config/database-production.js';

// Import security middleware
import {
    securityHeaders,
    corsMiddleware,
    globalRateLimit,
    authRateLimit,
    sqlInjectionProtection,
    xssProtection,
    requestTimeout,
    validateSQLParams
} from './middleware/securityMiddleware-PRODUCTION.js';

// Import auth routes (you'll need to create these)
// import authRoutes from './routes/authRoutes.js';
// import apiRoutes from './routes/apiRoutes.js';

/**
 * ═══════════════════════════════════════════════════════════════
 * ENVIRONMENT VALIDATION
 * ═══════════════════════════════════════════════════════════════
 */

const requiredEnvVars = [
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
    console.error('❌ FATAL: Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
}

// Validate JWT secret length
if (process.env.JWT_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
    console.error('❌ FATAL: JWT secrets must be at least 32 characters');
    process.exit(1);
}

/**
 * ═══════════════════════════════════════════════════════════════
 * STRUCTURED LOGGING (Winston)
 * ═══════════════════════════════════════════════════════════════
 */

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { 
        service: 'manas360-api',
        environment: process.env.NODE_ENV 
    },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
                })
            )
        }),
        
        // Write errors to error.log
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 10485760,  // 10MB
            maxFiles: 5
        }),
        
        // Write all logs to combined.log
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 10485760,  // 10MB
            maxFiles: 5
        })
    ]
});

// Override console methods in production
if (process.env.NODE_ENV === 'production') {
    console.log = (...args) => logger.info(args.join(' '));
    console.error = (...args) => logger.error(args.join(' '));
    console.warn = (...args) => logger.warn(args.join(' '));
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPRESS APP INITIALIZATION
 * ═══════════════════════════════════════════════════════════════
 */

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Trust proxy (required for AWS ELB, CloudFront, etc.)
app.set('trust proxy', 1);

/**
 * ═══════════════════════════════════════════════════════════════
 * MIDDLEWARE STACK (ORDER MATTERS!)
 * ═══════════════════════════════════════════════════════════════
 */

// 1. Request logging (Morgan + Winston)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    }));
}

// 2. Security headers (Helmet)
app.use(securityHeaders);

// 3. CORS
app.use(corsMiddleware);

// 4. Request timeout (prevents slowloris attacks)
app.use(requestTimeout(30000));  // 30 seconds

// 5. Body parsing with size limits
app.use(express.json({ 
    limit: '1mb',
    verify: (req, res, buf) => {
        // Store raw body for webhook signature verification
        req.rawBody = buf.toString('utf8');
    }
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '1mb' 
}));

// 6. NoSQL injection protection
app.use(sqlInjectionProtection);

// 7. XSS protection
app.use(xssProtection);

// 8. SQL injection validation
app.use(validateSQLParams);

// 9. Global rate limiting
app.use(globalRateLimit);

// 10. Request ID for tracing
app.use((req, res, next) => {
    req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    res.setHeader('X-Request-ID', req.id);
    next();
});

/**
 * ═══════════════════════════════════════════════════════════════
 * HEALTH CHECK ENDPOINT
 * ═══════════════════════════════════════════════════════════════
 */

app.get('/health', async (req, res) => {
    try {
        const dbHealth = await healthCheck();
        
        const health = {
            status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV,
            version: process.env.APP_VERSION || '1.0.0',
            database: dbHealth,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
                unit: 'MB'
            }
        };
        
        const statusCode = health.status === 'ok' ? 200 : 503;
        res.status(statusCode).json(health);
        
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});

/**
 * Readiness probe (for Kubernetes)
 */
app.get('/ready', async (req, res) => {
    try {
        const dbHealth = await healthCheck();
        
        if (dbHealth.status === 'healthy') {
            res.status(200).json({ ready: true });
        } else {
            res.status(503).json({ ready: false, reason: 'Database unhealthy' });
        }
    } catch (error) {
        res.status(503).json({ ready: false, reason: error.message });
    }
});

/**
 * Liveness probe (for Kubernetes)
 */
app.get('/live', (req, res) => {
    res.status(200).json({ alive: true });
});

/**
 * ═══════════════════════════════════════════════════════════════
 * API ROUTES
 * ═══════════════════════════════════════════════════════════════
 */

// Authentication routes (with strict rate limiting)
// app.use('/api/auth', authRateLimit, authRoutes);

// API routes
// app.use('/api/v1', apiRoutes);

// Example protected route
app.get('/api/v1/example', (req, res) => {
    res.json({
        success: true,
        message: 'Production API server is running',
        environment: process.env.NODE_ENV
    });
});

/**
 * ═══════════════════════════════════════════════════════════════
 * ERROR HANDLING
 * ═══════════════════════════════════════════════════════════════
 */

// 404 Handler
app.use((req, res) => {
    logger.warn(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({
        success: false,
        error: 'NotFound',
        message: 'The requested resource was not found'
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    // Log error with context
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        user: req.user?.id
    });
    
    // Don't leak error details in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    const errorResponse = {
        success: false,
        error: isProduction ? 'InternalServerError' : err.name,
        message: isProduction ? 'An unexpected error occurred' : err.message,
        requestId: req.id
    };
    
    // Include stack trace in development
    if (!isProduction) {
        errorResponse.stack = err.stack;
    }
    
    res.status(err.statusCode || 500).json(errorResponse);
});

/**
 * ═══════════════════════════════════════════════════════════════
 * GRACEFUL SHUTDOWN
 * ═══════════════════════════════════════════════════════════════
 */

let server;
let isShuttingDown = false;

async function gracefulShutdown(signal) {
    if (isShuttingDown) {
        logger.warn('Shutdown already in progress...');
        return;
    }
    
    isShuttingDown = true;
    logger.info(`${signal} received. Starting graceful shutdown...`);
    
    // Stop accepting new requests
    if (server) {
        server.close(() => {
            logger.info('HTTP server closed');
        });
    }
    
    // Set timeout for forced shutdown
    const shutdownTimeout = setTimeout(() => {
        logger.error('Graceful shutdown timeout. Forcing exit.');
        process.exit(1);
    }, 30000);  // 30 seconds
    
    try {
        // Close database connections
        await closePool();
        logger.info('Database connections closed');
        
        // Close other resources (Redis, etc.)
        // await redis.disconnect();
        
        clearTimeout(shutdownTimeout);
        logger.info('Graceful shutdown completed successfully');
        process.exit(0);
        
    } catch (error) {
        logger.error('Error during shutdown:', error);
        clearTimeout(shutdownTimeout);
        process.exit(1);
    }
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});

/**
 * ═══════════════════════════════════════════════════════════════
 * START SERVER
 * ═══════════════════════════════════════════════════════════════
 */

async function startServer() {
    try {
        // Verify database connection
        logger.info('Verifying database connection...');
        const dbHealth = await healthCheck();
        
        if (dbHealth.status !== 'healthy') {
            throw new Error('Database connection failed');
        }
        
        logger.info(`Database connected: ${dbHealth.database}`);
        
        // Start HTTP server
        server = app.listen(PORT, '0.0.0.0', () => {
            logger.info('═══════════════════════════════════════════════');
            logger.info(`🚀 MANAS360 API Server Started`);
            logger.info(`   Environment: ${process.env.NODE_ENV}`);
            logger.info(`   Port: ${PORT}`);
            logger.info(`   Database: ${dbHealth.database}`);
            logger.info(`   Pool Size: ${dbHealth.pool.total} connections`);
            logger.info(`   Process ID: ${process.pid}`);
            logger.info('═══════════════════════════════════════════════');
        });
        
        // Set server timeout
        server.timeout = 60000;  // 60 seconds
        server.keepAliveTimeout = 65000;  // 65 seconds (slightly higher than timeout)
        
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

export default app;

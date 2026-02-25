/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 - PRODUCTION SERVER CONFIGURATION
 * Enterprise-grade Express application setup with security hardening
 * ═══════════════════════════════════════════════════════════════
 */

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import winston from 'winston';
import crypto from 'crypto';
import { pool } from './db.js';

// ═══════════════════════════════════════════════════════════════
// 1. STRUCTURED LOGGING SETUP
// ═══════════════════════════════════════════════════════════════
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'manas360-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// ═══════════════════════════════════════════════════════════════
// 2. CREATE EXPRESS APP
// ═══════════════════════════════════════════════════════════════
const app = express();

// ═══════════════════════════════════════════════════════════════
// 3. SECURITY HEADERS (HELMET)
// ═══════════════════════════════════════════════════════════════
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"], // Restrict in production
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    hsts: {
        maxAge: 63072000, // 2 years in seconds
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true, // Prevent MIME sniffing
    xssFilter: true, // Legacy XSS protection
    crossOriginEmbedderPolicy: false // Allow cross-origin resource embedding
}));

// ═══════════════════════════════════════════════════════════════
// 4. CORS CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin.trim())) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200
}));

// ═══════════════════════════════════════════════════════════════
// 5. BODY PARSING & DATA SANITIZATION
// ═══════════════════════════════════════════════════════════════
// Strict size limits to prevent DoS attacks
app.use(express.json({ 
    limit: '10kb',
    type: 'application/json',
    strict: true // Only parse arrays and objects
}));

app.use(express.urlencoded({ 
    limit: '10kb', 
    extended: false,
    parameterLimit: 50
}));

// Remove $ and . from request body to prevent NoSQL injection
app.use(mongoSanitize());

// ═══════════════════════════════════════════════════════════════
// 6. REQUEST TIMEOUT
// ═══════════════════════════════════════════════════════════════
app.use((req, res, next) => {
    req.setTimeout(30000);  // 30 second timeout
    res.setTimeout(30000);
    next();
});

// ═══════════════════════════════════════════════════════════════
// 7. REQUEST ID MIDDLEWARE (for distributed tracing)
// ═══════════════════════════════════════════════════════════════
app.use((req, res, next) => {
    req.id = req.headers['x-request-id'] || crypto.randomUUID();
    res.setHeader('X-Request-ID', req.id);
    next();
});

// ═══════════════════════════════════════════════════════════════
// 8. GLOBAL RATE LIMITING
// ═══════════════════════════════════════════════════════════════
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req, res) => {
        // Tighter limit for public endpoints
        if (req.path.includes('/public')) return 100;
        return 1000; // 1000 requests per 15 mins per IP
    },
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => req.ip === process.env.INTERNAL_IP, // Skip internal IPs
    keyGenerator: (req) => req.ip || req.connection.remoteAddress,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', {
            requestId: req.id,
            ip: req.ip,
            path: req.path
        });
        res.status(429).json({
            success: false,
            error: 'TooManyRequests',
            message: 'Too many requests. Please try again later.',
            requestId: req.id,
            retryAfter: 900 // 15 minutes
        });
    }
});
app.use(globalLimiter);

// ═══════════════════════════════════════════════════════════════
// 9. REQUEST LOGGING MIDDLEWARE
// ═══════════════════════════════════════════════════════════════
app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
        
        logger[logLevel]('HTTP Request', {
            requestId: req.id,
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('content-length'),
            ip: req.ip,
            userAgent: req.get('user-agent'),
            userId: req.user?.id,
            timestamp: new Date().toISOString()
        });
    });
    
    next();
});

// ═══════════════════════════════════════════════════════════════
// 10. HEALTH CHECK ENDPOINT
// ═══════════════════════════════════════════════════════════════
app.get('/api/health', async (req, res) => {
    try {
        // Check database connectivity
        const startTime = Date.now();
        const dbResult = await pool.query('SELECT NOW()');
        const dbLatency = Date.now() - startTime;
        
        const dbHealth = dbResult.rows.length > 0 ? 'healthy' : 'unhealthy';
        
        // Check memory usage
        const memUsage = process.memoryUsage();
        const heapPercentage = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        
        // Determine overall status
        const healthy = heapPercentage < 90 && dbHealth === 'healthy' && dbLatency < 1000;
        
        res.status(healthy ? 200 : 503).json({
            status: healthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            version: process.env.API_VERSION || '1.0.0',
            uptime: process.uptime(),
            database: {
                status: dbHealth,
                latency: `${dbLatency}ms`
            },
            memory: {
                heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
                heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB',
                percentage: heapPercentage.toFixed(2) + '%',
                external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
            },
            requestId: req.id
        });
    } catch (error) {
        logger.error('Health check failed', {
            requestId: req.id,
            error: error.message,
            stack: error.stack
        });
        
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Internal health check error',
            requestId: req.id
        });
    }
});

// ═══════════════════════════════════════════════════════════════
// 11. ROUTE MOUNTING
// ═══════════════════════════════════════════════════════════════
// Example: Import and mount routers here
// import authRoutes from './routes/auth.js';
// import userRoutes from './routes/users.js';
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);

// ═══════════════════════════════════════════════════════════════
// 12. 404 HANDLER
// ═══════════════════════════════════════════════════════════════
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'NotFound',
        message: `Route not found: ${req.method} ${req.path}`,
        requestId: req.id
    });
});

// ═══════════════════════════════════════════════════════════════
// 13. GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const statusCode = err.status || err.statusCode || 500;
    
    logger.error('Unhandled Error', {
        requestId: req.id,
        statusCode,
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id
    });
    
    // Don't leak stack traces in production
    const response = {
        success: false,
        error: err.code || 'InternalServerError',
        message: err.message || 'An internal server error occurred',
        requestId: req.id,
        timestamp: new Date().toISOString()
    };
    
    if (isDevelopment) {
        response.stack = err.stack;
        response.details = err;
    }
    
    res.status(statusCode).json(response);
});

// ═══════════════════════════════════════════════════════════════
// 14. GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════
export async function startServer() {
    const port = parseInt(process.env.PORT || '4000', 10);
    
    const server = app.listen(port, () => {
        logger.info(`API server started`, {
            port,
            environment: process.env.NODE_ENV || 'development',
            nodeVersion: process.version
        });
    });
    
    // Handle graceful shutdown
    const gracefulShutdown = async (signal) => {
        logger.info(`Received ${signal}, starting graceful shutdown...`);
        
        // Stop accepting new requests
        server.close(async () => {
            logger.info('HTTP server closed');
            
            // Close database connections
            try {
                await pool.end();
                logger.info('Database connections closed');
            } catch (error) {
                logger.error('Error closing database', { error: error.message });
            }
            
            process.exit(0);
        });
        
        // Force shutdown after timeout
        setTimeout(() => {
            logger.error('Could not close connections in time, forcing shutdown');
            process.exit(1);
        }, 30000); // 30 second timeout
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    return server;
}

// ═══════════════════════════════════════════════════════════════
// 15. UNCAUGHT EXCEPTION HANDLER
// ═══════════════════════════════════════════════════════════════
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
    });
    // Exit process as it's in an unknown state
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', {
        reason: reason instanceof Error ? reason.message : JSON.stringify(reason),
        promise: promise.toString()
    });
});

export { app, logger };

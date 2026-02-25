/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCTION SECURITY MIDDLEWARE STACK
 * Enterprise-grade security hardening for 100K+ users
 * 
 * INCLUDES:
 * ✅ Helmet (security headers)
 * ✅ CORS (cross-origin protection)
 * ✅ Rate limiting (DDoS protection)
 * ✅ Input validation & sanitization
 * ✅ Request timeout
 * ✅ SQL injection protection
 * ═══════════════════════════════════════════════════════════════
 */

import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { query } from '../config/database-production.js';

/**
 * ═══════════════════════════════════════════════════════════════
 * HELMET - SECURITY HEADERS
 * ═══════════════════════════════════════════════════════════════
 */

export const securityHeaders = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],  // Adjust based on your needs
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    
    // Cross-Origin-Embedder-Policy
    crossOriginEmbedderPolicy: true,
    
    // Cross-Origin-Opener-Policy
    crossOriginOpenerPolicy: { policy: "same-origin" },
    
    // Cross-Origin-Resource-Policy
    crossOriginResourcePolicy: { policy: "same-origin" },
    
    // DNS Prefetch Control
    dnsPrefetchControl: { allow: false },
    
    // Frameguard (X-Frame-Options)
    frameguard: { action: "deny" },
    
    // Hide Powered-By header
    hidePoweredBy: true,
    
    // HSTS (HTTP Strict Transport Security)
    hsts: {
        maxAge: 31536000,  // 1 year
        includeSubDomains: true,
        preload: true,
    },
    
    // IE No Open
    ieNoOpen: true,
    
    // No Sniff (X-Content-Type-Options)
    noSniff: true,
    
    // Origin Agent Cluster
    originAgentCluster: true,
    
    // Permitted Cross-Domain Policies
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    
    // Referrer Policy
    referrerPolicy: { policy: "no-referrer" },
    
    // X-XSS-Protection
    xssFilter: true,
});

/**
 * ═══════════════════════════════════════════════════════════════
 * CORS - CROSS-ORIGIN RESOURCE SHARING
 * ═══════════════════════════════════════════════════════════════
 */

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:4173'];

export const corsMiddleware = cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = `CORS policy does not allow access from origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400,  // 24 hours
});

/**
 * ═══════════════════════════════════════════════════════════════
 * RATE LIMITING - DDoS PROTECTION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Global Rate Limiter (applies to all routes)
 * 100 requests per 15 minutes per IP
 */
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,  // Limit each IP to 100 requests per window
    message: {
        success: false,
        error: 'TooManyRequests',
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,  // Return rate limit info in headers
    legacyHeaders: false,
    
    // Skip rate limiting for trusted IPs (load balancers, etc.)
    skip: (req) => {
        const trustedIPs = process.env.TRUSTED_IPS?.split(',') || [];
        return trustedIPs.includes(req.ip);
    },
    
    // Custom key generator (use user ID if authenticated, otherwise IP)
    keyGenerator: (req) => {
        return req.user?.id || req.ip;
    },
});

/**
 * Strict Auth Rate Limiter
 * 5 requests per 15 minutes (login, register, forgot password)
 */
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 5,  // 5 attempts per window
    message: {
        success: false,
        error: 'TooManyAuthAttempts',
        message: 'Too many authentication attempts. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,  // Don't count successful logins
    
    // Store in database for distributed systems
    store: undefined,  // TODO: Use Redis store for production clustering
});

/**
 * API Rate Limiter (for API routes)
 * 1000 requests per hour
 */
export const apiRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 1000,
    message: {
        success: false,
        error: 'APIRateLimitExceeded',
        message: 'API rate limit exceeded. Please upgrade your plan.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.user?.id || req.ip,
});

/**
 * ═══════════════════════════════════════════════════════════════
 * INPUT SANITIZATION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * NoSQL Injection Protection
 * Removes $ and . from request data
 */
export const sqlInjectionProtection = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`[SECURITY] Potential NoSQL injection attempt from ${req.ip}: ${key}`);
    },
});

/**
 * XSS Protection - strip HTML tags from input
 */
export function xssProtection(req, res, next) {
    try {
        // Sanitize req.body
        if (req.body) {
            req.body = sanitizeObject(req.body);
        }
        
        // Sanitize req.query
        if (req.query) {
            req.query = sanitizeObject(req.query);
        }
        
        // Sanitize req.params
        if (req.params) {
            req.params = sanitizeObject(req.params);
        }
        
        next();
    } catch (error) {
        console.error('[XSS] Sanitization error:', error);
        next();  // Don't block request on sanitization error
    }
}

/**
 * Recursively sanitize object values
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return sanitizeValue(obj);
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
    }
    
    return sanitized;
}

/**
 * Sanitize individual value
 */
function sanitizeValue(value) {
    if (typeof value !== 'string') {
        return value;
    }
    
    // Remove HTML tags and dangerous characters
    return value
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * REQUEST TIMEOUT
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Request timeout middleware
 * Prevents slowloris attacks and hanging requests
 */
export function requestTimeout(timeoutMs = 30000) {
    return (req, res, next) => {
        // Set timeout
        req.setTimeout(timeoutMs, () => {
            console.warn(`[TIMEOUT] Request timeout from ${req.ip} to ${req.path}`);
            
            if (!res.headersSent) {
                res.status(408).json({
                    success: false,
                    error: 'RequestTimeout',
                    message: 'Request took too long to process'
                });
            }
        });
        
        // Set response timeout
        res.setTimeout(timeoutMs, () => {
            console.warn(`[TIMEOUT] Response timeout from ${req.ip} to ${req.path}`);
            
            if (!res.headersSent) {
                res.status(408).json({
                    success: false,
                    error: 'ResponseTimeout',
                    message: 'Response took too long to generate'
                });
            }
        });
        
        next();
    };
}

/**
 * ═══════════════════════════════════════════════════════════════
 * SQL INJECTION PROTECTION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Validate SQL input parameters
 * Prevents SQL injection through parameter validation
 */
export function validateSQLParams(req, res, next) {
    try {
        const dangerousPatterns = [
            /(\bUNION\b)|(\bSELECT\b)|(\bDROP\b)|(\bDELETE\b)|(\bINSERT\b)|(\bUPDATE\b)/i,
            /--/,
            /;/,
            /\/\*/,
            /\*\//,
            /xp_/i,
        ];
        
        // Check all input sources
        const inputSources = [
            { name: 'body', data: req.body },
            { name: 'query', data: req.query },
            { name: 'params', data: req.params },
        ];
        
        for (const source of inputSources) {
            if (source.data && typeof source.data === 'object') {
                for (const [key, value] of Object.entries(source.data)) {
                    if (typeof value === 'string') {
                        for (const pattern of dangerousPatterns) {
                            if (pattern.test(value)) {
                                console.warn(`[SQL INJECTION] Potential SQL injection from ${req.ip}: ${value}`);
                                
                                return res.status(400).json({
                                    success: false,
                                    error: 'InvalidInput',
                                    message: 'Invalid or potentially malicious input detected',
                                    field: key
                                });
                            }
                        }
                    }
                }
            }
        }
        
        next();
    } catch (error) {
        console.error('[SQL VALIDATION] Error:', error);
        next();  // Don't block on validation error
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * IP WHITELIST (OPTIONAL)
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * IP Whitelist middleware for admin routes
 */
export function ipWhitelist(allowedIPs = []) {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        
        // If no whitelist configured, allow all
        if (!allowedIPs || allowedIPs.length === 0) {
            return next();
        }
        
        if (!allowedIPs.includes(clientIP)) {
            console.warn(`[IP WHITELIST] Blocked access from ${clientIP} to ${req.path}`);
            
            return res.status(403).json({
                success: false,
                error: 'IPNotWhitelisted',
                message: 'Your IP address is not authorized to access this resource'
            });
        }
        
        next();
    };
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

export default {
    securityHeaders,
    corsMiddleware,
    globalRateLimit,
    authRateLimit,
    apiRateLimit,
    sqlInjectionProtection,
    xssProtection,
    requestTimeout,
    validateSQLParams,
    ipWhitelist
};

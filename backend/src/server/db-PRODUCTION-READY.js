/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 - DATABASE CONNECTION POOL (PRODUCTION)
 * PostgreSQL connection pooling with proper configuration
 * ═══════════════════════════════════════════════════════════════
 */

import pkg from 'pg';
const { Pool } = pkg;
import winston from 'winston';

// ═══════════════════════════════════════════════════════════════
// LOGGING
// ═══════════════════════════════════════════════════════════════
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'database' },
    transports: [
        new winston.transports.File({ filename: 'logs/db-error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/db.log' }),
        new winston.transports.Console()
    ]
});

// ═══════════════════════════════════════════════════════════════
// ENVIRONMENT VALIDATION
// ═══════════════════════════════════════════════════════════════
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}

// ═══════════════════════════════════════════════════════════════
// CONNECTION POOL CONFIGURATION
// ═══════════════════════════════════════════════════════════════

/**
 * Pool sizing guidelines for 100,000 users:
 * 
 * - min: 5-10 (warm connections for immediate use)
 * - max: 30-50 (depends on CPU cores and concurrent requests)
 * - For high concurrency: pool_size = (CPU_CORES × 2) + spare_connections
 * 
 * Example for 4-core server:
 * - min: 5
 * - max: 20 (4 × 2 + 12 spare)
 * 
 * These settings should be tuned based on actual load testing.
 */

const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    
    // ═══════════════════════════════════════════════════════════
    // CONNECTION POOL SIZING
    // ═══════════════════════════════════════════════════════════
    // Minimum connections to keep open
    min: parseInt(process.env.DB_POOL_MIN || '5', 10),
    
    // Maximum connections allowed
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    
    // ═══════════════════════════════════════════════════════════
    // CONNECTION TIMEOUT SETTINGS
    // ═══════════════════════════════════════════════════════════
    // Time to wait for a connection from the pool (milliseconds)
    connectionTimeoutMillis: 10000, // 10 seconds
    
    // How long a client is allowed to remain idle (milliseconds)
    idleTimeoutMillis: 30000, // 30 seconds
    
    // How often to check for idle clients to close (milliseconds)
    reapIntervalMillis: 1000, // 1 second
    
    // ═══════════════════════════════════════════════════════════
    // QUERY TIMEOUT
    // ═══════════════════════════════════════════════════════════
    // Server-side statement timeout (milliseconds)
    statement_timeout: 30000, // 30 seconds
    
    query_timeout: 10000, // 10 seconds
    
    // ═══════════════════════════════════════════════════════════
    // APPLICATION NAME (for PostgreSQL logs)
    // ═══════════════════════════════════════════════════════════
    application_name: 'manas360-api'
};

// Create pool
export const pool = new Pool(poolConfig);

// ═══════════════════════════════════════════════════════════════
// POOL EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════

// Log connection errors
pool.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', {
        error: err.message,
        code: err.code,
        stack: err.stack,
        clientConnecting: client.connecting,
        clientConnected: client.connected
    });
    
    // Attempt to recover by closing the failed connection
    try {
        client.end();
    } catch (endErr) {
        logger.error('Error ending failed client connection', {
            error: endErr.message
        });
    }
});

// Log connection events
pool.on('connect', () => {
    logger.debug('New client connected to pool');
});

pool.on('remove', () => {
    logger.debug('Client removed from pool');
});

// ═══════════════════════════════════════════════════════════════
// HEALTH CHECK FUNCTION
// ═══════════════════════════════════════════════════════════════

export async function healthCheck() {
    try {
        const result = await pool.query('SELECT NOW() as current_time');
        return {
            healthy: true,
            timestamp: result.rows[0].current_time
        };
    } catch (error) {
        logger.error('Database health check failed', {
            error: error.message
        });
        return {
            healthy: false,
            error: error.message
        };
    }
}

// ═══════════════════════════════════════════════════════════════
// POOL STATISTICS FUNCTION
// ═══════════════════════════════════════════════════════════════

export function getPoolStats() {
    return {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
        activeCount: pool.totalCount - pool.idleCount,
        configuration: {
            min: poolConfig.min,
            max: poolConfig.max,
            connectionTimeoutMillis: poolConfig.connectionTimeoutMillis,
            idleTimeoutMillis: poolConfig.idleTimeoutMillis
        }
    };
}

// ═══════════════════════════════════════════════════════════════
// GRACEFUL POOL SHUTDOWN
// ═══════════════════════════════════════════════════════════════

export async function closePool() {
    try {
        logger.info('Closing database connection pool...');
        const stats = getPoolStats();
        
        logger.info('Pool stats before shutdown', stats);
        
        await pool.end();
        
        logger.info('Database connection pool closed successfully');
    } catch (error) {
        logger.error('Error closing database pool', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════
// QUERY WRAPPER WITH MONITORING
// ═══════════════════════════════════════════════════════════════

/**
 * Monitored query execution with logging and metrics
 * Usage: await queryWithMonitoring('SELECT * FROM users WHERE id = $1', [userId])
 */
export async function queryWithMonitoring(text, values = [], timeout = 5000) {
    const startTime = Date.now();
    
    try {
        const result = await pool.query({
            text,
            values,
            timeout
        });
        
        const duration = Date.now() - startTime;
        
        // Log slow queries
        if (duration > 1000) {
            logger.warn('Slow query detected', {
                query: text.substring(0, 100),
                duration: `${duration}ms`,
                rowCount: result.rowCount
            });
        }
        
        return result;
        
    } catch (error) {
        const duration = Date.now() - startTime;
        
        logger.error('Query error', {
            error: error.message,
            code: error.code,
            query: text.substring(0, 100),
            duration: `${duration}ms`
        });
        
        throw error;
    }
}

// ═══════════════════════════════════════════════════════════════
// CONNECTION INITIALIZER
// ═══════════════════════════════════════════════════════════════

export async function initializePool() {
    try {
        logger.info('Initializing database connection pool...');
        
        // Test connection
        const health = await healthCheck();
        if (!health.healthy) {
            throw new Error('Database health check failed');
        }
        
        logger.info('Database connection pool initialized successfully');
        
        // Log pool configuration
        logger.info('Pool configuration', {
            min: poolConfig.min,
            max: poolConfig.max,
            connectionTimeoutMillis: poolConfig.connectionTimeoutMillis,
            idleTimeoutMillis: poolConfig.idleTimeoutMillis
        });
        
        return true;
        
    } catch (error) {
        logger.error('Failed to initialize database pool', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

export default {
    pool,
    healthCheck,
    getPoolStats,
    closePool,
    queryWithMonitoring,
    initializePool
};

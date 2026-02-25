/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCTION DATABASE CONNECTION POOL
 * Optimized PostgreSQL configuration for 100,000+ concurrent users
 * ═══════════════════════════════════════════════════════════════
 */

import pg from 'pg';
const { Pool } = pg;

// Validate critical environment variables at startup
const requiredEnvVars = [
    'DATABASE_URL',
    'NODE_ENV'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`FATAL: Missing required environment variable: ${varName}`);
    }
});

/**
 * PRODUCTION POOL CONFIGURATION
 * 
 * Sizing guidelines for AWS RDS/ECS:
 * - Small (< 10K users): max=20, min=5
 * - Medium (10K-50K users): max=50, min=10
 * - Large (50K-100K users): max=100, min=20
 * - Enterprise (100K+ users): max=200, min=50
 */
const poolConfig = {
    connectionString: process.env.DATABASE_URL,
    
    // Connection pool sizing
    max: parseInt(process.env.DB_POOL_MAX || '50', 10),           // Maximum connections
    min: parseInt(process.env.DB_POOL_MIN || '10', 10),           // Minimum idle connections
    
    // Timeout configurations (milliseconds)
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),      // 30s - release idle clients
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECT_TIMEOUT || '10000', 10), // 10s - fail fast
    
    // Query timeout
    statement_timeout: parseInt(process.env.DB_STATEMENT_TIMEOUT || '30000', 10),  // 30s - prevent long-running queries
    
    // Application name for monitoring
    application_name: process.env.APP_NAME || 'manas360-api',
    
    // SSL configuration (required for AWS RDS)
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false  // AWS RDS uses self-signed certs
    } : false,
    
    // Connection retry
    query_timeout: 30000,
    
    // Logging
    log: process.env.DB_LOG_LEVEL === 'debug' ? console.log : undefined
};

// Create production pool
export const pool = new Pool(poolConfig);

// Pool event handlers for monitoring
pool.on('connect', (client) => {
    if (process.env.DB_LOG_LEVEL === 'debug') {
        console.log('[DB] New client connected to pool');
    }
});

pool.on('acquire', (client) => {
    if (process.env.DB_LOG_LEVEL === 'debug') {
        console.log('[DB] Client acquired from pool');
    }
});

pool.on('error', (err, client) => {
    console.error('[DB] Unexpected error on idle client:', err);
    // Don't exit the process - pool will recover
    // In production, send to error tracking (Sentry, DataDog, etc.)
});

pool.on('remove', (client) => {
    if (process.env.DB_LOG_LEVEL === 'debug') {
        console.log('[DB] Client removed from pool');
    }
});

/**
 * Health check query - validates database connectivity
 */
export async function healthCheck() {
    try {
        const start = Date.now();
        const result = await pool.query('SELECT NOW(), current_database(), current_user');
        const duration = Date.now() - start;
        
        return {
            status: 'healthy',
            database: result.rows[0].current_database,
            user: result.rows[0].current_user,
            timestamp: result.rows[0].now,
            latency_ms: duration,
            pool: {
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount
            }
        };
    } catch (error) {
        console.error('[DB] Health check failed:', error);
        return {
            status: 'unhealthy',
            error: error.message,
            pool: {
                total: pool.totalCount,
                idle: pool.idleCount,
                waiting: pool.waitingCount
            }
        };
    }
}

/**
 * Get pool statistics for monitoring
 */
export function getPoolStats() {
    return {
        total_connections: pool.totalCount,
        idle_connections: pool.idleCount,
        waiting_requests: pool.waitingCount,
        max_connections: poolConfig.max,
        min_connections: poolConfig.min
    };
}

/**
 * Graceful shutdown - drain pool connections
 */
export async function closePool() {
    try {
        console.log('[DB] Closing database pool...');
        await pool.end();
        console.log('[DB] Database pool closed successfully');
    } catch (error) {
        console.error('[DB] Error closing pool:', error);
        throw error;
    }
}

/**
 * Query helper with automatic error logging
 */
export async function query(text, params) {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        
        // Log slow queries (> 1 second)
        if (duration > 1000) {
            console.warn(`[DB] Slow query (${duration}ms):`, text);
        }
        
        return result;
    } catch (error) {
        console.error('[DB] Query error:', error);
        console.error('[DB] Query:', text);
        console.error('[DB] Params:', params);
        throw error;
    }
}

/**
 * Transaction helper
 */
export async function transaction(callback) {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Export pool as default
export default pool;

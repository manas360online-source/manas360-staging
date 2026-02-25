// ================================================================
// Database Configuration - Single Pool for Entire Application
// ================================================================
// Centralized PostgreSQL connection management
// No more duplicate pools across multiple servers
// ================================================================

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// ================================================================
// DATABASE POOL CONFIGURATION
// ================================================================

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX) : 30,
  min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN) : 5,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : 30000,
  connectionTimeoutMillis: process.env.DB_CONNECTION_TIMEOUT ? parseInt(process.env.DB_CONNECTION_TIMEOUT) : 5000,
  statementTimeoutMillis: process.env.DB_STATEMENT_TIMEOUT ? parseInt(process.env.DB_STATEMENT_TIMEOUT) : 30000,
};

console.log('📦 Database Pool Configuration:', {
  max: poolConfig.max,
  min: poolConfig.min,
  idleTimeoutMillis: poolConfig.idleTimeoutMillis,
  connectionTimeoutMillis: poolConfig.connectionTimeoutMillis,
});

// ================================================================
// CREATE POOL
// ================================================================

export const pool = new Pool(poolConfig);

// ================================================================
// POOL EVENT HANDLERS
// ================================================================

pool.on('connect', () => {
  console.log('✅ New database connection established');
});

pool.on('remove', () => {
  console.log('❌ Database connection removed from pool');
});

pool.on('error', (error) => {
  console.error('❌ Database pool error:', error);
});

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

/**
 * Validate database connection at startup
 */
export async function validateDbConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Execute a query with the pool
 * @param {string} text - SQL query
 * @param {array} values - Query parameters
 * @returns {Promise} Query result
 */
export async function query(text, values) {
  const start = Date.now();
  try {
    const result = await pool.query(text, values);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
      console.warn(`⚠️  Slow query (${duration}ms):`, text.substring(0, 100));
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Query error (${duration}ms):`, text.substring(0, 100), error.message);
    throw error;
  }
}

/**
 * Execute a transaction
 * @param {Function} callback - Transaction callback
 * @returns {Promise} Transaction result
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

/**
 * Get pool statistics
 * @returns {Object} Pool stats
 */
export function getPoolStats() {
  return {
    totalCount: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount,
  };
}

// ================================================================
// EXPORT
// ================================================================

export default pool;

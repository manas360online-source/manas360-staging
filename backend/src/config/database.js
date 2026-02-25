/**
 * ════════════════════════════════════════════════════════════════════════════
 * DATABASE CONFIGURATION
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * PostgreSQL connection pool configuration
 * Single authoritative pool for entire application
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env.local'), override: true });

const { Pool } = pg;

/**
 * Create and export database pool
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 30, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

/**
 * Connection pool event handlers
 */
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('✅ New database connection established');
});

pool.on('remove', () => {
  console.log('📊 Database connection removed from pool');
});

/**
 * Test connection
 */
export async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

/**
 * Close pool (for graceful shutdown)
 */
export async function closePool() {
  await pool.end();
  console.log('✅ Database pool closed');
}

export default pool;

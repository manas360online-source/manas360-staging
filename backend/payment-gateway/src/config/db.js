
const { Pool } = require('pg');
require('dotenv').config();

// Validate required database configuration
if (!process.env.DATABASE_URL && (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_PASSWORD)) {
    throw new Error('FATAL: DATABASE_URL or DB_USER/DB_HOST/DB_PASSWORD must be set. Do not use mock DB in production.');
}

let pool;
try {
    if (process.env.DATABASE_URL) {
        pool = new Pool({ 
            connectionString: process.env.DATABASE_URL,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
    } else {
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME || 'manas360',
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
    }
    
    // Test connection immediately
    pool.on('error', (err) => {
        console.error('FATAL: Database connection error:', err);
        process.exit(1);
    });
} catch (e) {
    console.error("FATAL: DB Configuration Error:", e.message);
    process.exit(1);
}

// Production: no fallback mocking - database failures are immediately visible
const query = async (text, params) => {
    try {
        if (!pool) throw new Error("Database pool not initialized");
        return await pool.query(text, params);
    } catch (err) {
        console.error(`FATAL: Query failed: ${text.substring(0, 80)}... Error: ${err.message}`);
        throw err; // Don't catch - let caller handle
    }
};

module.exports = {
    query: query,
    pool: pool
};

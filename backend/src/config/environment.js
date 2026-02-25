/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENVIRONMENT CONFIGURATION & VALIDATION
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Validates all required environment variables at startup
 * Provides sensible defaults for optional variables
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

import dotenv from 'dotenv';

dotenv.config();

/**
 * Required environment variables (must be set)
 */
const REQUIRED_VARS = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET'
];

/**
 * Optional environment variables with defaults
 */
const OPTIONAL_VARS = {
  CORS_ORIGIN: 'http://localhost:5173',
  PHONPE_API_KEY: '',
  PHONPE_API_SECRET: '',
  PHONPE_MERCHANT_ID: '',
  REDIS_URL: 'redis://localhost:6379',
  LOG_LEVEL: 'info',
  DB_POOL_MAX: '30',
  SESSION_TIMEOUT_HOURS: '24',
  REFRESH_TOKEN_EXPIRY_DAYS: '7'
};

/**
 * Validate required variables
 */
export function validateEnvironment() {
  const missingVars = [];

  // Check required variables
  REQUIRED_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach((v) => console.error(`   - ${v}`));
    console.error('\nPlease set these variables in .env or environment');
    process.exit(1);
  }

  // Validate values
  const nodeEnv = process.env.NODE_ENV;
  if (!['development', 'staging', 'production'].includes(nodeEnv)) {
    console.error('❌ NODE_ENV must be one of: development, staging, production');
    process.exit(1);
  }

  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error('❌ PORT must be a valid port number (1-65535)');
    process.exit(1);
  }

  // Warn about weak secrets in production
  if (nodeEnv === 'production') {
    if ((process.env.JWT_SECRET || '').length < 64) {
      console.warn('⚠️  JWT_SECRET should be at least 64 characters for production');
    }
    if ((process.env.JWT_REFRESH_SECRET || '').length < 64) {
      console.warn('⚠️  JWT_REFRESH_SECRET should be at least 64 characters for production');
    }
  }

  console.log('✅ Environment validation passed');
}

/**
 * Get environment variable with optional default
 */
export function getEnv(varName, defaultValue = null) {
  const value = process.env[varName];

  if (value === undefined) {
    if (defaultValue === null && REQUIRED_VARS.includes(varName)) {
      throw new Error(`Required environment variable not set: ${varName}`);
    }
    return defaultValue;
  }

  return value;
}

/**
 * Environment configuration object
 */
export const config = {
  // Application
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',

  // Server
  port: parseInt(process.env.PORT || '5000', 10),

  // Database
  database: {
    url: process.env.DATABASE_URL,
    poolMax: parseInt(process.env.DB_POOL_MAX || '30', 10),
    poolMin: parseInt(process.env.DB_POOL_MIN || '5', 10)
  },

  // JWT & Auth
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d',
    cookieMaxAge: 24 * 60 * 60 * 1000 // 24 hours
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  },

  // PhonePe Payment Gateway
  phonepe: {
    apiKey: process.env.PHONPE_API_KEY || '',
    apiSecret: process.env.PHONPE_API_SECRET || '',
    merchantId: process.env.PHONPE_MERCHANT_ID || '',
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
  },

  // Redis (optional)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  },

  // Session
  session: {
    timeoutHours: parseInt(process.env.SESSION_TIMEOUT_HOURS || '24', 10)
  },

  // Refresh Token
  refreshToken: {
    expiryDays: parseInt(process.env.REFRESH_TOKEN_EXPIRY_DAYS || '7', 10)
  }
};

/**
 * Print configuration summary (dev only)
 */
export function printConfigSummary() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                   ENVIRONMENT CONFIGURATION                   ║
╠═══════════════════════════════════════════════════════════════╣
║ Environment:     ${config.env.padEnd(45)} ║
║ Port:            ${String(config.port).padEnd(45)} ║
║ Database:        ${(config.database.url.split('@')[1] || 'unknown').padEnd(45)} ║
║ CORS Origin:     ${config.cors.origin.padEnd(45)} ║
║ JWT Expiry:      ${config.jwt.expiresIn.padEnd(45)} ║
║ Refresh Expiry:  ${config.jwt.refreshExpiresIn.padEnd(45)} ║
║ Log Level:       ${config.logging.level.padEnd(45)} ║
║ PhonePe Env:     ${config.phonepe.environment.padEnd(45)} ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

/**
 * Initialize configuration
 */
export function initializeConfig() {
  validateEnvironment();
  if (config.isDevelopment) {
    printConfigSummary();
  }
  return config;
}

export default config;

// ================================================================
// Environment Configuration Validation
// ================================================================
// Ensures all required environment variables are set
// Fails fast if configuration is incomplete
// ================================================================

/**
 * Validate all required environment variables
 * @throws {Error} If required variables are missing
 */
export function validateEnvironment() {
  const required = [
    'NODE_ENV',
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT',
  ];

  const optional = [
    'CORS_ORIGINS',
    'DB_POOL_MAX',
    'DB_POOL_MIN',
    'DB_IDLE_TIMEOUT',
    'DB_CONNECTION_TIMEOUT',
    'DB_STATEMENT_TIMEOUT',
    'GEMINI_API_KEY',
    'HEYOO_WHATSAPP_TOKEN',
    'HEYOO_PHONE_NUMBER_ID',
    'PHONEME_API_KEY',
    'LOG_LEVEL',
  ];

  const missing = [];

  // Check required variables
  for (const variable of required) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set them in .env.local or .env.${process.env.NODE_ENV}`
    );
  }

  // Validate JWT secrets length
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('❌ JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('❌ JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  // Validate PORT is numeric
  if (isNaN(Number(process.env.PORT))) {
    throw new Error('❌ PORT must be a numeric value');
  }

  // Log optional variables that are missing
  const missingOptional = optional.filter(v => !process.env[v]);
  if (missingOptional.length > 0) {
    console.warn('⚠️  Optional environment variables not set:', missingOptional.join(', '));
  }

  // Success
  console.log('✅ Environment validation passed');
  return true;
}

/**
 * Get configuration object
 * @returns {Object} Configuration
 */
export function getConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [],
    dbPoolMax: Number(process.env.DB_POOL_MAX || 30),
    dbPoolMin: Number(process.env.DB_POOL_MIN || 5),
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

/**
 * Check if running in production
 * @returns {boolean}
 */
export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 * @returns {boolean}
 */
export function isDevelopment() {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

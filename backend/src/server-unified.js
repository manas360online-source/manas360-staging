// ================================================================
// MANAS360 Unified Backend - Server Entry Point
// ================================================================
// Listens on PORT 5000 (configurable via .env)
// Handles graceful shutdown and database cleanup
// ================================================================

import app, { validateConfig } from './app-unified.js';
import { pool, validateDbConnection } from './config/database.js';

// Configuration
const PORT = Number(process.env.PORT || 5000);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ================================================================
// STARTUP
// ================================================================

async function startServer() {
  try {
    // 1. Validate environment first
    console.log('🔍 Validating environment configuration...');
    validateConfig();

    // 2. Validate database connection
    console.log('📡 Testing database connection...');
    await validateDbConnection();
    console.log('✅ Database connected successfully');

    // 3. Start HTTP server
    const server = app.listen(PORT, () => {
      const startupBanner = `
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         🚀 MANAS360 UNIFIED BACKEND                            ║
║             Production-Grade Modular Architecture              ║
║                                                                ║
╠════════════════════════════════════════════════════════════════╣
║  Status:        ✅ Running                                     ║
║  Version:       2.0 (Unified)                                  ║
║  Port:          ${PORT}                                              ║
║  Environment:   ${NODE_ENV}                                  ║
║  Uptime:        ${new Date().toISOString()}                 ║
╠════════════════════════════════════════════════════════════════╣
║  API Endpoints:                                                ║
║  • /api/v1/auth              (Authentication)                  ║
║  • /api/v1/users             (User Management)                 ║
║  • /api/v1/subscriptions     (Subscription Plans)              ║
║  • /api/v1/admin             (Admin Operations)                ║
║  • /api/v1/analytics         (Analytics Data)                  ║
║  • /api/v1/payments          (Payment Processing)              ║
║  • /api/v1/themed-rooms      (AR Meditation)                   ║
╠════════════════════════════════════════════════════════════════╣
║  Health Checks:                                                ║
║  • GET /health               (Basic health)                    ║
║  • GET /health/db            (Database connectivity)           ║
║  • GET /metrics              (Performance metrics)             ║
╠════════════════════════════════════════════════════════════════╣
║  Security Features:                                            ║
║  ✅ Helmet (Security Headers)                                  ║
║  ✅ CORS (Restricted Origins)                                  ║
║  ✅ Rate Limiting (Global + Auth)                              ║
║  ✅ JWT Authentication                                         ║
║  ✅ RBAC (Role-Based Access Control)                           ║
║  ✅ Request Timeout (30s)                                      ║
║  ✅ Structured Logging (Morgan + Winston)                      ║
║  ✅ Error Handling (Centralized)                               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
      `;
      console.log(startupBanner);
    });

    // ================================================================
    // GRACEFUL SHUTDOWN
    // ================================================================

    const gracefulShutdown = async (signal) => {
      console.log(`\n⚠️  Received ${signal}, starting graceful shutdown...`);

      // Stop accepting new requests
      server.close(async () => {
        console.log('🛑 HTTP server closed');

        try {
          // Close database pool
          console.log('📭 Closing database connections...');
          await pool.end();
          console.log('✅ Database pool closed');

          console.log('✨ Graceful shutdown complete');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after 30 seconds');
        process.exit(1);
      }, 30000);
    };

    // Handle termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('💥 Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// ================================================================
// RUN
// ================================================================

startServer();

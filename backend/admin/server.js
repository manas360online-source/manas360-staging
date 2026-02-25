// ================================================
// MANAS360 Session Analytics - Standalone Server
// Story 3.6: Session Analytics
// Standalone start script (for backward compatibility)
// ================================================

require('dotenv').config();
const { app, testConnection } = require('./src/app');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`
╔══════════════════════════════════════════════════╗
║   MANAS360 Session Analytics API                  ║
║   Story 3.6: Session Analytics                   ║
╠══════════════════════════════════════════════════╣
║   Server running on: http://localhost:${PORT}       ║
║   Environment: ${process.env.NODE_ENV || 'development'}                      ║
║                                                  ║
║   Endpoints:                                     ║
║   • GET /api/analytics/overview                  ║
║   • GET /api/analytics/sessions                  ║
║   • GET /api/analytics/outcomes                  ║
║   • GET /api/analytics/therapists                ║
║   • GET /api/analytics/trends                    ║
║   • GET /api/analytics/dropoff                   ║
║   • GET /api/analytics/export/excel              ║
║   • GET /api/analytics/export/pdf                ║
╚══════════════════════════════════════════════════╝
            `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

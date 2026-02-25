import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import authRoutes from './backend/src/routes/authRoutes.js';

// Note: Admin analytics routes are dynamically loaded via require
// to support CommonJS modules

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);

// =========================================
// Mount Admin Analytics Routes
// =========================================
// Dynamically import CommonJS admin app and mount on /api
(async () => {
  try {
    const { app: adminApp } = await import('./backend/admin/src/app.js');
    app.use('/', adminApp);
  } catch (error) {
    console.warn('⚠️  Admin analytics module failed to load:', error.message);
    console.warn('Admin endpoints will not be available. Continuing with main backend...');
  }
})();

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: 'Internal server error.' });
});

const port = Number(process.env.PORT || 5001);

async function startServer() {
  const listen = () => {
    app.listen(port, () => {
      console.log(`
╔════════════════════════════════════════╗
║   MANAS360 Unified Backend              ║
║   Main API + Admin Analytics             ║
╠════════════════════════════════════════╣
║   Port: ${port}                              ║
║   Status: Running                      ║
╠════════════════════════════════════════╣
║   Main Routes:                         ║
║   • GET /health                        ║
║   • POST /api/auth/send-otp            ║
║                                        ║
║   Admin Routes:                        ║
║   • /api/admin/*                       ║
║   • /api/analytics/*                   ║
║   • /api/v1/admin/*                    ║
╚════════════════════════════════════════╝`);
    });
  };

  try {
    const client = await pool.connect();
    console.log('✅ Database connected');
    client.release();
    listen();
  } catch (error) {
    console.warn('⚠️  Database connection failed; starting server without DB. Error:', error && error.message ? error.message : error);
    listen();
  }
}

startServer();

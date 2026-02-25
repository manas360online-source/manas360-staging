// ================================================
// MANAS360 Session Analytics - Express Server
// Story 3.6: Session Analytics
// ================================================

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { testConnection } = require('./config/database');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { generateToken } = require('./middleware/adminAuth');

const app = express();
const PORT = process.env.PORT || 3001;

// =========================================
// Security & Performance Middleware
// =========================================
app.use(helmet());
app.use(compression());

// CORS Configuration - Support multiple dev ports
const corsOptions = {
    credentials: true
};

if (process.env.NODE_ENV === 'production') {
    // Production: Only allow specified origin
    corsOptions.origin = process.env.CORS_ORIGIN || 'https://yourdomain.com';
} else {
    // Development: Allow localhost on any port (3000-3010)
    corsOptions.origin = (origin, callback) => {
        const allowedHosts = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:3010',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:3002'
        ];
        
        if (!origin || allowedHosts.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    };
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    message: { success: false, error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// =========================================
// Health Check
// =========================================
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'MANAS360 Session Analytics API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// =========================================
// Admin Login (Email-only)
// =========================================
app.post('/api/admin/login', (req, res) => {
    const { email } = req.body;

    if (!email || !email.trim()) {
        return res.status(400).json({
            success: false,
            error: 'Email is required'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email format'
        });
    }

    // Allow hardcoded admin emails for testing/demo
    const allowedAdminEmails = [
        'admin@manas360.com',
        'admin@example.com',
        'support@manas360.com'
    ];

    if (!allowedAdminEmails.includes(email)) {
        return res.status(403).json({
            success: false,
            error: 'Email not authorized for admin access'
        });
    }

    // Generate admin user object
    const adminUser = {
        id: 'admin-' + email.split('@')[0].toLowerCase(),
        email,
        fullName: email.split('@')[0].split('.').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' '),
        role: 'admin'
    };

    const token = generateToken(adminUser);

    res.json({
        success: true,
        token,
        user: adminUser,
        message: 'Login successful'
    });
});

// =========================================
// Test Token Generation (Development Only)
// =========================================
if (process.env.NODE_ENV !== 'production') {
    app.get('/api/test-token', (req, res) => {
        const testAdmin = {
            id: 'a1111111-1111-1111-1111-111111111111',
            email: 'admin@manas360.com',
            fullName: 'Admin User',
            role: 'admin'
        };
        const token = generateToken(testAdmin);
        res.json({
            success: true,
            token,
            user: testAdmin,
            usage: 'Add to Authorization header as: Bearer <token>'
        });
    });
}

// =========================================
// API Routes
// =========================================
app.use('/api/analytics', analyticsRoutes);
app.use('/api/v1/admin', adminRoutes);

// =========================================
// 404 Handler
// =========================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /health',
            'GET /api/analytics/overview',
            'GET /api/analytics/sessions',
            'GET /api/analytics/outcomes',
            'GET /api/analytics/therapists',
            'GET /api/analytics/trends',
            'GET /api/analytics/dropoff',
            'GET /api/analytics/export/excel',
            'GET /api/analytics/export/pdf'
        ]
    });
});

// =========================================
// Error Handler
// =========================================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// =========================================
// Module Export (for integration with main server)
// =========================================
module.exports = { app, testConnection };
module.exports.default = { app, testConnection };

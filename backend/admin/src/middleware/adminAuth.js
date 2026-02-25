// ================================================
// MANAS360 Session Analytics - Admin Auth Middleware
// Story 3.6: Session Analytics
// Role-based access control for Admin users only
// ================================================

const jwt = require('jsonwebtoken');

// HARDENED: JWT_SECRET now mandatory - no dev fallback
if (!process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is required. Do not use dev defaults in any environment.');
}

const JWT_SECRET = process.env.JWT_SECRET;

// =========================================
// Verify JWT Token
// =========================================
const verifyToken = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token.'
        });
    }
};

// =========================================
// Check Admin Role
// =========================================
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required.'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Access forbidden. Admin role required.'
        });
    }

    next();
};

// =========================================
// Combined Admin Auth Middleware
// =========================================
const adminAuth = [verifyToken, requireAdmin];

// =========================================
// Generate Token (for testing)
// =========================================
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.fullName
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// =========================================
// Optional Auth (for public endpoints)
// =========================================
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            req.user = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            // Token invalid but continue without user
        }
    }
    next();
};

module.exports = {
    verifyToken,
    requireAdmin,
    adminAuth,
    generateToken,
    optionalAuth
};

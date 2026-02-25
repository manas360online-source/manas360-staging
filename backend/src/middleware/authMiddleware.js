/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 AUTHENTICATION MIDDLEWARE
 * JWT verification, token refresh, secure session management
 * ═══════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { logAuditEvent } from '../services/auditService.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET environment variables required');
}

/**
 * Generate JWT Access Token (short-lived)
 */
export function generateAccessToken(userId, roleId) {
    return jwt.sign(
        { userId, roleId, tokenType: 'access' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

/**
 * Generate JWT Refresh Token (long-lived)
 */
export function generateRefreshToken(userId) {
    return jwt.sign(
        { userId, tokenType: 'refresh' },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRY }
    );
}

/**
 * Store refresh token in database
 */
export async function storeRefreshToken(userId, refreshToken, ipAddress, userAgent) {
    const tokenHash = jwt.sign({ hash: Date.now() }, JWT_REFRESH_SECRET);
    
    const query = `
        INSERT INTO tokens (user_id, token_type, token_hash, expires_at, ip_address, user_agent)
        VALUES ($1, 'refresh', $2, NOW() + INTERVAL '7 days', $3, $4)
        RETURNING id
    `;
    
    await pool.query(query, [userId, tokenHash, ipAddress, userAgent]);
}

/**
 * MIDDLEWARE: Verify JWT Access Token
 * Extracts user info and attaches to req.user
 * 
 * Usage: router.get('/protected', authenticateToken, controller);
 */
export function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'No access token provided'
            });
        }

        const token = authHeader.substring(7);

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            if (decoded.tokenType !== 'access') {
                throw new Error('Invalid token type');
            }

            req.user = {
                id: decoded.userId,
                roleId: decoded.roleId
            };

            // Update last activity
            pool.query(
                'UPDATE sessions SET last_activity = NOW() WHERE user_id = $1',
                [decoded.userId]
            ).catch(err => console.error('Session update failed:', err));

            next();
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'TokenExpired',
                    message: 'Access token has expired. Please refresh.'
                });
            }
            throw jwtError;
        }

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid token'
        });
    }
}

/**
 * MIDDLEWARE: Refresh Access Token
 * Endpoint: POST /api/auth/refresh
 */
export async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'MissingRefreshToken',
                message: 'Refresh token is required'
            });
        }

        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

            if (decoded.tokenType !== 'refresh') {
                throw new Error('Invalid token type');
            }

            // Verify token exists in database and hasn't been revoked
            const tokenQuery = `
                SELECT * FROM tokens 
                WHERE user_id = $1 
                AND token_type = 'refresh' 
                AND revoked_at IS NULL 
                AND expires_at > NOW()
                LIMIT 1
            `;
            
            const result = await pool.query(tokenQuery, [decoded.userId]);
            
            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'TokenRevoked',
                    message: 'Refresh token has been revoked'
                });
            }

            // Generate new access token
            const newAccessToken = generateAccessToken(decoded.userId, decoded.roleId);

            // Log token refresh
            await logAuditEvent(decoded.userId, 'token_refresh', 'success', 
                req.ip, req.get('user-agent'));

            res.json({
                success: true,
                accessToken: newAccessToken,
                tokenType: 'Bearer',
                expiresIn: JWT_EXPIRY
            });

        } catch (jwtError) {
            await logAuditEvent(null, 'token_refresh', 'failure', 
                req.ip, req.get('user-agent'), { reason: 'Invalid refresh token' });

            return res.status(401).json({
                success: false,
                error: 'InvalidRefreshToken',
                message: 'Refresh token is invalid or expired'
            });
        }

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            error: 'InternalServerError',
            message: 'Failed to refresh token'
        });
    }
}

/**
 * MIDDLEWARE: Logout (revoke tokens)
 * Endpoint: POST /api/auth/logout
 */
export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Not authenticated' });
        }

        // Revoke all refresh tokens for this user
        const query = `
            UPDATE tokens 
            SET revoked_at = NOW() 
            WHERE user_id = $1 AND token_type = 'refresh' AND revoked_at IS NULL
        `;
        
        await pool.query(query, [userId]);

        // End all active sessions
        await pool.query(
            'DELETE FROM sessions WHERE user_id = $1',
            [userId]
        );

        // Log logout
        await logAuditEvent(userId, 'logout', 'success', 
            req.ip, req.get('user-agent'));

        res.json({ success: true, message: 'Logged out successfully' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ success: false, error: 'Logout failed' });
    }
}

/**
 * MIDDLEWARE: Verify user owns resource (for delete/update)
 */
export function verifyResourceOwner(req, res, next) {
    try {
        const userId = req.user?.id;
        const resourceUserId = req.params.userId || req.body.userId;

        if (userId !== resourceUserId) {
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'You do not have permission to access this resource'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, error: 'Verification failed' });
    }
}

export default {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    authenticateToken,
    refreshAccessToken,
    logout,
    verifyResourceOwner
};

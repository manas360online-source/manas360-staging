/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 - PRODUCTION AUTH MIDDLEWARE
 * JWT token handling with permission caching
 * ═══════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { logAuditEvent } from '../services/auditService.js';

// ═══════════════════════════════════════════════════════════════
// ENVIRONMENT VALIDATION
// ═══════════════════════════════════════════════════════════════
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
}

if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters');
}

// ═══════════════════════════════════════════════════════════════
// 1. GENERATE ACCESS TOKEN (with permission caching)
// ═══════════════════════════════════════════════════════════════
export async function generateAccessToken(userId, roleId, email = null) {
    try {
        if (!userId || !roleId) {
            throw new Error('userId and roleId are required');
        }

        // Fetch user's role and privilege level
        const roleQuery = `
            SELECT name, privilege_level
            FROM roles
            WHERE id = $1 AND is_active = true
        `;
        const roleResult = await pool.query(roleQuery, [roleId]);
        
        if (roleResult.rows.length === 0) {
            throw new Error('Role not found or inactive');
        }
        
        const role = roleResult.rows[0];

        // Fetch user's permissions (cache in JWT)
        const permQuery = `
            SELECT DISTINCT p.name
            FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = $1 AND p.is_active = true
            ORDER BY p.name
        `;
        
        const permResult = await pool.query(permQuery, [roleId]);
        const permissions = permResult.rows.map(row => row.name);

        // Create JWT payload with all necessary claims
        const payload = {
            userId,      // User ID
            roleId,      // Role ID
            email,       // User email
            role: role.name,
            privilegeLevel: role.privilege_level,
            permissions: permissions, // ✅ Cached permissions
            tokenType: 'access',
            iat: Math.floor(Date.now() / 1000),
            iss: 'manas360-api',
            nbf: Math.floor(Date.now() / 1000) // Not before claim
        };

        // Sign token
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRY,
            algorithm: 'HS256',
            noTimestamp: false
        });

        return token;

    } catch (error) {
        console.error('Error generating access token:', error.message);
        throw new Error(`Failed to generate access token: ${error.message}`);
    }
}

// ═══════════════════════════════════════════════════════════════
// 2. GENERATE REFRESH TOKEN
// ═══════════════════════════════════════════════════════════════
export function generateRefreshToken(userId) {
    if (!userId) {
        throw new Error('userId is required');
    }

    const payload = {
        userId,
        tokenType: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        iss: 'manas360-api'
    };

    const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRY,
        algorithm: 'HS256'
    });

    return token;
}

// ═══════════════════════════════════════════════════════════════
// 3. STORE REFRESH TOKEN (in database)
// ═══════════════════════════════════════════════════════════════
export async function storeRefreshToken(userId, token, ipAddress, userAgent) {
    try {
        // Hash the token for storage (never store plain tokens)
        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Decode token to get expiry
        const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
        const expiresAt = new Date(decoded.exp * 1000);

        // Store in database
        const query = `
            INSERT INTO tokens (
                user_id, token_hash, token_type, 
                ip_address, user_agent, expires_at, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id
        `;

        const result = await pool.query(query, [
            userId,
            tokenHash,
            'refresh',
            ipAddress,
            userAgent,
            expiresAt
        ]);

        return result.rows[0].id;

    } catch (error) {
        console.error('Error storing refresh token:', error.message);
        throw new Error('Failed to store refresh token');
    }
}

// ═══════════════════════════════════════════════════════════════
// 4. AUTHENTICATE TOKEN MIDDLEWARE
// ═══════════════════════════════════════════════════════════════
export async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'No authentication token provided',
                requestId: req.id
            });
        }

        // Verify JWT signature and expiry
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET, {
                algorithms: ['HS256']
            });
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                await logAuditEvent(null, 'token_expired', 'failure', 
                    req.ip, req.get('user-agent'), {
                        requestId: req.id
                    });

                return res.status(401).json({
                    success: false,
                    error: 'TokenExpired',
                    message: 'Access token has expired. Please refresh.',
                    requestId: req.id
                });
            }
            throw jwtError;
        }

        // Validate token type and structure
        if (decoded.tokenType !== 'access') {
            throw new Error('Invalid token type. Expected access token.');
        }

        if (!decoded.userId || !decoded.roleId) {
            throw new Error('Invalid token structure. Missing required claims.');
        }

        // Optional: Check if token is NOT blacklisted (if implementing token revocation)
        // const isBlacklisted = await checkTokenBlacklist(token);
        // if (isBlacklisted) {
        //     return res.status(401).json({
        //         success: false,
        //         error: 'TokenRevoked',
        //         message: 'Token has been revoked'
        //     });
        // }

        // Attach user info to request (all from JWT - no DB query needed)
        req.user = {
            id: decoded.userId,
            roleId: decoded.roleId,
            email: decoded.email,
            role: decoded.role,
            privilegeLevel: decoded.privilegeLevel,
            permissions: decoded.permissions || [] // ✅ Cached permissions
        };

        next();

    } catch (error) {
        console.error('Authentication middleware error:', error.message);
        
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Invalid or malformed token',
            requestId: req.id
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 5. REFRESH ACCESS TOKEN
// ═══════════════════════════════════════════════════════════════
export async function refreshAccessToken(req, res) {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'MissingRefreshToken',
                message: 'Refresh token is required in request body',
                requestId: req.id
            });
        }

        // Verify refresh token JWT
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET, {
                algorithms: ['HS256']
            });
        } catch (jwtError) {
            await logAuditEvent(null, 'token_refresh_failed', 'failure',
                req.ip, req.get('user-agent'), {
                    reason: 'Invalid refresh token',
                    requestId: req.id
                });

            return res.status(401).json({
                success: false,
                error: 'InvalidRefreshToken',
                message: 'Refresh token is invalid or expired',
                requestId: req.id
            });
        }

        if (decoded.tokenType !== 'refresh') {
            throw new Error('Invalid token type. Expected refresh token.');
        }

        // Verify token exists in database and hasn't been revoked
        const tokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        const tokenQuery = `
            SELECT * FROM tokens 
            WHERE user_id = $1 
            AND token_hash = $2
            AND token_type = 'refresh' 
            AND revoked_at IS NULL 
            AND expires_at > NOW()
            LIMIT 1
        `;
        
        const tokenResult = await pool.query(tokenQuery, [decoded.userId, tokenHash]);
        
        if (tokenResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'TokenRevoked',
                message: 'Refresh token has been revoked or expired',
                requestId: req.id
            });
        }

        // Fetch user to get current role (in case permissions changed)
        const userQuery = `
            SELECT id, email, role_id FROM user_accounts 
            WHERE id = $1 AND deleted_at IS NULL
        `;
        const userResult = await pool.query(userQuery, [decoded.userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'UserNotFound',
                message: 'User no longer exists',
                requestId: req.id
            });
        }

        const user = userResult.rows[0];

        // Generate new access token
        const newAccessToken = await generateAccessToken(user.id, user.role_id, user.email);

        // Log successful refresh
        await logAuditEvent(user.id, 'token_refresh_success', 'success',
            req.ip, req.get('user-agent'), {
                requestId: req.id
            });

        res.json({
            success: true,
            accessToken: newAccessToken,
            tokenType: 'Bearer',
            expiresIn: JWT_EXPIRY,
            requestId: req.id
        });

    } catch (error) {
        console.error('Refresh token error:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'TokenRefreshError',
            message: 'Failed to refresh token',
            requestId: req.id
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 6. LOGOUT (revoke tokens)
// ═══════════════════════════════════════════════════════════════
export async function logout(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'User not authenticated',
                requestId: req.id
            });
        }

        // Revoke all refresh tokens for this user
        const revokeQuery = `
            UPDATE tokens 
            SET revoked_at = NOW() 
            WHERE user_id = $1 AND token_type = 'refresh' AND revoked_at IS NULL
        `;
        
        await pool.query(revokeQuery, [userId]);

        // Log logout
        await logAuditEvent(userId, 'logout_success', 'success',
            req.ip, req.get('user-agent'), {
                requestId: req.id
            });

        res.json({
            success: true,
            message: 'Logged out successfully',
            requestId: req.id
        });

    } catch (error) {
        console.error('Logout error:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'LogoutError',
            message: 'Failed to logout',
            requestId: req.id
        });
    }
}

// ═══════════════════════════════════════════════════════════════
// 7. VERIFY RESOURCE OWNER (for delete/update operations)
// ═══════════════════════════════════════════════════════════════
export function verifyResourceOwner(resourceIdParam = 'userId') {
    return (req, res, next) => {
        try {
            const userId = req.user?.id;
            const resourceUserId = req.params[resourceIdParam] || req.body.userId;

            if (userId === resourceUserId) {
                next();
            } else if (req.user.role === 'superadmin' || req.user.role === 'admin') {
                // Admins can access any resource
                next();
            } else {
                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: 'You do not have permission to access this resource',
                    requestId: req.id
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'VerificationError',
                message: 'Failed to verify resource ownership',
                requestId: req.id
            });
        }
    };
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

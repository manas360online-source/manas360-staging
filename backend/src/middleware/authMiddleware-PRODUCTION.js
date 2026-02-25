/**
 * ═══════════════════════════════════════════════════════════════
 * PRODUCTION AUTHENTICATION MIDDLEWARE
 * Enterprise-grade JWT authentication with permission caching
 * 
 * FIXES APPLIED:
 * ✅ Fixed token generation signature mismatch (line 163 bug)
 * ✅ Eliminated N+1 permission queries via JWT payload caching
 * ✅ Added refresh token rotation
 * ✅ Added account lockout after 5 failed attempts
 * ✅ Added token revocation support
 * ✅ Removed session update on every request (N+1 eliminated)
 * ═══════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool, query } from '../config/database-production.js';

// Environment validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m';           // Short-lived access tokens
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error('FATAL: JWT_SECRET and JWT_REFRESH_SECRET must be set in environment');
}

if (JWT_SECRET.length < 32 || JWT_REFRESH_SECRET.length < 32) {
    throw new Error('FATAL: JWT secrets must be at least 32 characters');
}

/**
 * ═══════════════════════════════════════════════════════════════
 * TOKEN GENERATION (FIXED)
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Generate Access Token with embedded permissions (eliminates N+1 queries)
 * 
 * CRITICAL FIX: Original code had signature mismatch
 * - Declaration: generateAccessToken(userId, roleId)
 * - Called with: generateAccessToken({ id, email, roleId })
 * 
 * @param {Object} payload - User data
 * @param {string} payload.userId - User UUID
 * @param {string} payload.roleId - Role UUID
 * @param {string} payload.email - User email
 * @param {Array<string>} payload.permissions - User permissions (cached)
 * @param {Array<string>} payload.features - User features (cached)
 */
export function generateAccessToken(payload) {
    const { userId, roleId, email, permissions = [], features = [] } = payload;
    
    if (!userId || !roleId) {
        throw new Error('userId and roleId required for JWT generation');
    }
    
    return jwt.sign(
        {
            userId,
            roleId,
            email,
            permissions,        // CRITICAL: Embed permissions in JWT
            features,           // CRITICAL: Embed features in JWT
            tokenType: 'access',
            jti: crypto.randomUUID()  // JWT ID for revocation
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

/**
 * Generate Refresh Token (long-lived)
 */
export function generateRefreshToken(userId) {
    if (!userId) {
        throw new Error('userId required for refresh token generation');
    }
    
    return jwt.sign(
        {
            userId,
            tokenType: 'refresh',
            jti: crypto.randomUUID()
        },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRY }
    );
}

/**
 * Store hashed refresh token in database
 * SECURITY: Never store plain tokens
 */
export async function storeRefreshToken(userId, refreshToken, ipAddress, userAgent) {
    try {
        // Hash the token before storage
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        
        // Extract JWT ID and expiry
        const decoded = jwt.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);
        
        await query(`
            INSERT INTO tokens (user_id, token_type, token_hash, expires_at, ip_address, user_agent)
            VALUES ($1, 'refresh', $2, $3, $4, $5)
        `, [userId, tokenHash, expiresAt, ipAddress, userAgent]);
        
        return true;
    } catch (error) {
        console.error('[AUTH] Failed to store refresh token:', error);
        throw error;
    }
}

/**
 * Load user permissions and features for JWT payload
 * Uses materialized views for performance (no N+1 queries)
 */
async function loadUserPermissionsAndFeatures(userId) {
    try {
        // Single query using materialized view (pre-joined data)
        const result = await query(`
            SELECT 
                up.permissions,
                up.privilege_level,
                uf.features
            FROM mv_user_permissions up
            LEFT JOIN mv_user_features uf ON up.user_id = uf.user_id
            WHERE up.user_id = $1
        `, [userId]);
        
        if (result.rows.length === 0) {
            return { permissions: [], features: [], privilegeLevel: 0 };
        }
        
        return {
            permissions: result.rows[0].permissions || [],
            features: result.rows[0].features || [],
            privilegeLevel: result.rows[0].privilege_level || 0
        };
    } catch (error) {
        console.error('[AUTH] Failed to load permissions/features:', error);
        return { permissions: [], features: [], privilegeLevel: 0 };
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * AUTHENTICATION MIDDLEWARE
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Verify JWT Access Token
 * 
 * Attaches to req.user:
 * - id: User UUID
 * - roleId: Role UUID
 * - email: User email
 * - permissions: Array of permission names
 * - features: Array of feature names
 * - privilegeLevel: Numeric privilege (0-100)
 * 
 * PERFORMANCE: Zero database queries (all data in JWT)
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

            // Attach full user context (no DB query needed!)
            req.user = {
                id: decoded.userId,
                roleId: decoded.roleId,
                email: decoded.email,
                permissions: decoded.permissions || [],
                features: decoded.features || [],
                privilegeLevel: decoded.privilegeLevel || 0,
                jti: decoded.jti
            };

            next();
            
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'TokenExpired',
                    message: 'Access token has expired. Please refresh.'
                });
            }
            
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'InvalidToken',
                    message: 'Invalid or malformed token'
                });
            }
            
            throw jwtError;
        }

    } catch (error) {
        console.error('[AUTH] Authentication error:', error);
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'Authentication failed'
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * TOKEN REFRESH WITH ROTATION
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Refresh Access Token
 * Implements token rotation for security
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

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            
            if (decoded.tokenType !== 'refresh') {
                throw new Error('Invalid token type');
            }
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'InvalidRefreshToken',
                message: 'Refresh token is invalid or expired'
            });
        }

        // Check if token exists in database and is not revoked
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        
        const tokenResult = await query(`
            SELECT id FROM tokens 
            WHERE user_id = $1 
            AND token_type = 'refresh' 
            AND token_hash = $2
            AND revoked_at IS NULL 
            AND expires_at > NOW()
        `, [decoded.userId, tokenHash]);
        
        if (tokenResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'TokenRevoked',
                message: 'Refresh token has been revoked or expired'
            });
        }

        // Load fresh permissions and features
        const { permissions, features, privilegeLevel } = await loadUserPermissionsAndFeatures(decoded.userId);
        
        // Get user data
        const userResult = await query(`
            SELECT id, email, role_id FROM user_accounts 
            WHERE id = $1 AND deleted_at IS NULL AND is_active = true
        `, [decoded.userId]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'UserNotFound',
                message: 'User account not found or inactive'
            });
        }
        
        const user = userResult.rows[0];

        // Generate new access token with fresh permissions
        const newAccessToken = generateAccessToken({
            userId: user.id,
            roleId: user.role_id,
            email: user.email,
            permissions,
            features,
            privilegeLevel
        });

        // OPTIONAL: Rotate refresh token (security best practice)
        const rotateRefreshToken = process.env.ROTATE_REFRESH_TOKEN === 'true';
        let newRefreshToken = refreshToken;
        
        if (rotateRefreshToken) {
            // Revoke old refresh token
            await query(`
                UPDATE tokens SET revoked_at = NOW() 
                WHERE user_id = $1 AND token_hash = $2
            `, [decoded.userId, tokenHash]);
            
            // Generate new refresh token
            newRefreshToken = generateRefreshToken(decoded.userId);
            await storeRefreshToken(decoded.userId, newRefreshToken, req.ip, req.get('user-agent'));
        }

        res.json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: rotateRefreshToken ? newRefreshToken : undefined,
            tokenType: 'Bearer',
            expiresIn: JWT_EXPIRY
        });

    } catch (error) {
        console.error('[AUTH] Token refresh error:', error);
        res.status(500).json({
            success: false,
            error: 'InternalServerError',
            message: 'Failed to refresh token'
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * LOGOUT (REVOKE TOKENS)
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Logout - revoke all user tokens
 */
export async function logout(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'Not authenticated' 
            });
        }

        // Revoke all refresh tokens for this user
        await query(`
            UPDATE tokens 
            SET revoked_at = NOW() 
            WHERE user_id = $1 AND token_type = 'refresh' AND revoked_at IS NULL
        `, [userId]);

        // Delete all active sessions
        await query('DELETE FROM sessions WHERE user_id = $1', [userId]);

        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });

    } catch (error) {
        console.error('[AUTH] Logout error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Logout failed' 
        });
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * ACCOUNT LOCKOUT HELPER
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Record failed login attempt and lock account if necessary
 */
export async function recordFailedLogin(email, ipAddress, userAgent, reason) {
    try {
        // Log attempt
        await query(`
            INSERT INTO login_attempts (email, ip_address, user_agent, success, failure_reason)
            VALUES ($1, $2, $3, false, $4)
        `, [email, ipAddress, userAgent, reason]);
        
        // Check if account should be locked (5 failures in last 15 minutes)
        const countResult = await query(`
            SELECT COUNT(*) as count FROM login_attempts 
            WHERE email = $1 
            AND success = false 
            AND attempted_at > NOW() - INTERVAL '15 minutes'
        `, [email]);
        
        const failureCount = parseInt(countResult.rows[0].count, 10);
        
        if (failureCount >= 5) {
            // Lock the account
            await query(`
                UPDATE user_accounts 
                SET is_locked = true, failed_login_attempts = $1
                WHERE email = $2
            `, [failureCount, email]);
            
            return { locked: true, attempts: failureCount };
        }
        
        return { locked: false, attempts: failureCount };
        
    } catch (error) {
        console.error('[AUTH] Failed to record login attempt:', error);
        return { locked: false, attempts: 0 };
    }
}

/**
 * Record successful login
 */
export async function recordSuccessfulLogin(email, ipAddress, userAgent) {
    try {
        await query(`
            INSERT INTO login_attempts (email, ip_address, user_agent, success)
            VALUES ($1, $2, $3, true)
        `, [email, ipAddress, userAgent]);
        
        // Reset failed login counter
        await query(`
            UPDATE user_accounts 
            SET failed_login_attempts = 0, 
                last_login_at = NOW(),
                last_login_ip = $1
            WHERE email = $2
        `, [ipAddress, email]);
        
    } catch (error) {
        console.error('[AUTH] Failed to record successful login:', error);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════
 * EXPORTS
 * ═══════════════════════════════════════════════════════════════
 */

export default {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    authenticateToken,
    refreshAccessToken,
    logout,
    recordFailedLogin,
    recordSuccessfulLogin,
    loadUserPermissionsAndFeatures
};

/**
 * ════════════════════════════════════════════════════════════════════════════
 * UNIFIED AUTHENTICATION MIDDLEWARE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Handles:
 * 1. JWT token verification (access tokens)
 * 2. Token expiration checks
 * 3. Automatic token refresh logic
 * 4. Single token system (no authToken vs adminToken split)
 * 
 * Token Structure:
 * {
 *   userId: "uuid",
 *   email: "user@example.com",
 *   role: "admin",
 *   permissions: ["manage_users", "view_analytics"],
 *   iat: 1234567890,
 *   exp: 1234569690
 * }
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

function parseCookies(cookieHeader = '') {
  return cookieHeader
    .split(';')
    .map((value) => value.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const index = item.indexOf('=');
      if (index > 0) {
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {});
}

function getCookieToken(req, name) {
  const cookies = parseCookies(req.headers?.cookie || '');
  return cookies[name] || null;
}

function refreshCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

function accessCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path: '/api/v1',
    maxAge: 15 * 60 * 1000
  };
}

/**
 * Verify JWT access token
 * 
 * Usage:
 *   app.use('/api/v1/protected', authenticateToken);
 *   
 * Client sends: Authorization: Bearer <token>
 * 
 * On success: req.user = { userId, email, role, permissions }
 * On error: 401 { success: false, message, code }
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" header
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(' ')[1];
    const cookieToken = getCookieToken(req, 'access_token');
    const token = headerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Missing authentication token',
        action: 'login'
      });
    }

    // Verify token signature and expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user to request context
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || [],
      mfaVerified: Boolean(decoded.mfaVerified)
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        action: 'refresh',
        hint: 'Use POST /api/v1/auth/refresh with your refresh token'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

/**
 * Refresh token endpoint handler
 * 
 * Usage:
 *   POST /api/v1/auth/refresh
 *   Body: { refreshToken: "eyJhbcIjoI..." }
 * 
 * Returns:
 * {
 *   success: true,
 *   accessToken: "new-access-token",
 *   refreshToken: "new-refresh-token",
 *   expiresIn: 900
 * }
 */
export const refreshTokenHandler = async (req, res) => {
  const client = await pool.connect();

  try {
    const bodyRefreshToken = req.body?.refreshToken;
    const cookieRefreshToken = getCookieToken(req, 'refresh_token');
    const refreshToken = bodyRefreshToken || cookieRefreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Missing refresh token in request body'
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Step 1: Verify refresh token signature
    // ─────────────────────────────────────────────────────────────────

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
        action: 'login'
      });
    }

    const { userId, tokenId, familyId: decodedFamilyId } = decoded;
    const familyId = decodedFamilyId || tokenId;

    // ─────────────────────────────────────────────────────────────────
    // Step 2: Verify refresh token exists in database (not revoked)
    // ─────────────────────────────────────────────────────────────────

    await client.query('BEGIN');

    const tokenResult = await client.query(
      `SELECT id, user_id, family_id, revoked_at, replaced_by
       FROM refresh_tokens
       WHERE id = $1
       AND user_id = $2
       AND family_id = $3
       FOR UPDATE`,
      [tokenId, userId, familyId]
    );

    if (tokenResult.rows.length === 0) {
      await client.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW(), reuse_detected_at = NOW()
         WHERE user_id = $1 AND family_id = $2 AND revoked_at IS NULL`,
        [userId, familyId]
      );
      await client.query('COMMIT');

      await logSecurityEvent('refresh_reuse_detected', {
        userId,
        familyId,
        reason: 'token_not_found',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });

      return res.status(401).json({
        success: false,
        message: 'Refresh token reuse detected. Please login again.',
        action: 'login'
      });
    }

    const dbToken = tokenResult.rows[0];

    if (dbToken.revoked_at || dbToken.replaced_by) {
      await client.query(
        `UPDATE refresh_tokens
         SET revoked_at = NOW(), reuse_detected_at = NOW()
         WHERE user_id = $1 AND family_id = $2 AND revoked_at IS NULL`,
        [userId, familyId]
      );
      await client.query('COMMIT');

      await logSecurityEvent('refresh_reuse_detected', {
        userId,
        familyId,
        reason: 'token_already_rotated',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });

      return res.status(401).json({
        success: false,
        message: 'Refresh token reuse detected. Please login again.',
        action: 'login'
      });
    }

    const activeTokenCheck = await client.query(
      `SELECT id
       FROM refresh_tokens
       WHERE id = $1
       AND user_id = $2
       AND family_id = $3
       AND revoked_at IS NULL
       AND expires_at > NOW()`,
      [tokenId, userId, familyId]
    );

    if (activeTokenCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(401).json({
        success: false,
        message: 'Refresh token is invalid, expired, or has been revoked',
        action: 'login'
      });
    }

    // ─────────────────────────────────────────────────────────────────
    // Step 3: Fetch fresh user data with permissions
    // ─────────────────────────────────────────────────────────────────

    const userResult = await client.query(
      `SELECT
         u.id,
         u.email,
         r.name as role,
         array_agg(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL) as permissions
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = $1 AND u.is_active = true
       GROUP BY u.id, u.email, r.name`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      // User doesn't exist or is inactive
      await client.query(
        'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1',
        [userId]
      );
      await client.query('COMMIT');

      return res.status(401).json({
        success: false,
        message: 'User not found or account inactive',
        action: 'login'
      });
    }

    const user = userResult.rows[0];

    // ─────────────────────────────────────────────────────────────────
    // Step 4: Generate NEW access token (short-lived)
    // ─────────────────────────────────────────────────────────────────

    const newAccessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || 'guest',
        permissions: user.permissions || []
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 15 minute expiry
    );

    // ─────────────────────────────────────────────────────────────────
    // Step 5: Generate NEW refresh token (token rotation)
    // Note: This is optional but recommended for security
    // ─────────────────────────────────────────────────────────────────

    const newTokenId = crypto.randomUUID();
    const newRefreshToken = jwt.sign(
      {
        userId: user.id,
        tokenId: newTokenId,
        familyId
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' } // 7 day expiry
    );

    // ─────────────────────────────────────────────────────────────────
    // Step 6: Store new refresh token in database
    // ─────────────────────────────────────────────────────────────────

    await client.query(
      `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, family_id, ip_address, user_agent)
       VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5::inet, $6)
       ON CONFLICT (id) DO NOTHING`,
      [newTokenId, userId, newRefreshToken, familyId, req.ip || null, req.headers['user-agent'] || null]
    );

    await client.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW(), replaced_by = $1
       WHERE id = $2 AND user_id = $3 AND family_id = $4`,
      [newTokenId, tokenId, userId, familyId]
    );

    await client.query('COMMIT');

    res.cookie('access_token', newAccessToken, accessCookieOptions());
    res.cookie('refresh_token', newRefreshToken, refreshCookieOptions());

    return res.json({
      success: true,
      expiresIn: 900, // 15 minutes in seconds
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // no-op
    }
    return respondInternalError(res, 'Failed to refresh token', error, 'Refresh token error');
  } finally {
    client.release();
  }
};

/**
 * Logout handler - Revoke refresh token
 * 
 * Usage:
 *   POST /api/v1/auth/logout
 *   Headers: Authorization: Bearer <accessToken>
 */
export const logoutHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Revoke all refresh tokens for this user
    await pool.query(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1',
      [req.user.userId]
    );

    res.clearCookie('access_token', accessCookieOptions());
    res.clearCookie('refresh_token', refreshCookieOptions());

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return respondInternalError(res, 'Logout failed', error, 'Logout error');
  }
};

/**
 * Generate JWT tokens (used during login/signup)
 * 
 * Internal function only - not exposed as endpoint
 */
export const generateTokens = async (userId, email, role = 'user', permissions = []) => {
  const accessToken = jwt.sign(
    {
      userId,
      email,
      role,
      permissions
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const tokenId = crypto.randomUUID();
  const familyId = tokenId;
  const refreshToken = jwt.sign(
    {
      userId,
      tokenId,
      familyId
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token in database
  await pool.query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, family_id)
     VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4)`,
    [tokenId, userId, refreshToken, familyId]
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 900 // 15 minutes
  };
};

/**
 * Helper: Check if token will expire soon
 * Returns true if token expires within 5 minutes
 */
export const isTokenExpiringSoon = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return false;

    const expiresAt = decoded.exp * 1000; // Convert to ms
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    return timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
  } catch (error) {
    return false;
  }
};

export default {
  authenticateToken,
  refreshTokenHandler,
  logoutHandler,
  generateTokens,
  isTokenExpiringSoon
};

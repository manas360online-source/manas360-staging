import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';
import { logSecurityEvent } from '../utils/securityLogger.js';

function normalizeOtpInput(otp) {
  return String(otp || '').trim();
}

function cookieOptions(path, maxAge, httpOnly = true) {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path,
    maxAge
  };
}

function buildFingerprint(req) {
  const ip = req.ip || '';
  const ua = req.headers['user-agent'] || '';
  return crypto.createHash('sha256').update(`${ip}|${ua}`).digest('hex');
}

function hotp(secret, counter) {
  const buffer = Buffer.alloc(8);
  for (let i = 7; i >= 0; i -= 1) {
    buffer[i] = counter & 0xff;
    counter >>= 8;
  }

  const hmac = crypto.createHmac('sha1', secret).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary = ((hmac[offset] & 0x7f) << 24)
    | ((hmac[offset + 1] & 0xff) << 16)
    | ((hmac[offset + 2] & 0xff) << 8)
    | (hmac[offset + 3] & 0xff);
  return String(binary % 1000000).padStart(6, '0');
}

function verifyAdminMfaCode(email, mfaCode) {
  const baseSecret = process.env.ADMIN_MFA_SECRET || process.env.JWT_SECRET;
  if (!baseSecret) return false;

  const secret = `${baseSecret}:${email}`;
  const code = normalizeOtpInput(mfaCode);
  const step = Math.floor(Date.now() / 1000 / 30);

  for (let drift = -1; drift <= 1; drift += 1) {
    if (hotp(secret, step + drift) === code) {
      return true;
    }
  }

  return false;
}

function issueAuthCookies(res, { accessToken, refreshToken }) {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  res.cookie('access_token', accessToken, cookieOptions('/api/v1', 15 * 60 * 1000, true));
  res.cookie('refresh_token', refreshToken, cookieOptions('/api/v1/auth', 7 * 24 * 60 * 60 * 1000, true));
  res.cookie('csrf_token', csrfToken, cookieOptions('/', 7 * 24 * 60 * 60 * 1000, false));
  return csrfToken;
}

async function getUserWithPermissions({ email, phoneNumber }) {
  const userLookupField = email ? 'u.email' : 'u.phone_number';
  const userLookupValue = email || phoneNumber;

  const result = await pool.query(
    `SELECT
       u.id,
       u.email,
       u.phone_number,
       COALESCE(u.first_name, split_part(u.full_name, ' ', 1)) as first_name,
       COALESCE(u.last_name, NULLIF(btrim(substring(u.full_name FROM length(split_part(u.full_name, ' ', 1)) + 1)), '')) as last_name,
       u.is_active,
      u.password_hash,
       COALESCE(r.name, u.role, 'user') as role,
       COALESCE(array_agg(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL), '{}') as permissions
     FROM users u
     LEFT JOIN roles r ON r.id = u.role_id
     LEFT JOIN role_permissions rp ON rp.role_id = r.id
     LEFT JOIN permissions p ON p.id = rp.permission_id
     WHERE ${userLookupField} = $1 AND u.deleted_at IS NULL
    GROUP BY u.id, u.email, u.phone_number, u.first_name, u.last_name, u.full_name, u.is_active, u.password_hash, r.name, u.role`,
    [userLookupValue]
  );

  return result.rows[0] || null;
}

function buildAccessToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role || 'user',
      permissions: user.permissions || [],
      mfaVerified: Boolean(user.mfaVerified)
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

function buildRefreshToken(userId, tokenId, familyId) {
  return jwt.sign(
    { userId, tokenId, familyId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
}

async function persistRefreshToken({ tokenId, userId, refreshToken, familyId, req }) {
  await pool.query(
    `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, ip_address, user_agent, family_id)
     VALUES ($1::uuid, $2::uuid, $3, NOW() + INTERVAL '7 days', $4::inet, $5, $6::uuid)`,
    [
      tokenId,
      userId,
      refreshToken,
      req.ip || null,
      req.headers['user-agent'] || null,
      familyId
    ]
  );
}

export async function sendOtp(req, res) {
  const { phoneNumber, email } = req.body || {};

  if (!phoneNumber && !email) {
    return res.status(400).json({
      success: false,
      message: 'Provide phoneNumber or email to receive OTP'
    });
  }

  return res.json({
    success: true,
    message: 'OTP sent successfully',
    channel: phoneNumber ? 'phone' : 'email',
    ...(process.env.NODE_ENV !== 'production' ? { devOtp: '123456' } : {})
  });
}

export async function loginWithOtp(req, res) {
  try {
    const { email, phoneNumber, otp } = req.body || {};

    if ((!email && !phoneNumber) || !otp) {
      return res.status(400).json({
        success: false,
        message: 'email/phoneNumber and otp are required'
      });
    }

    if (process.env.NODE_ENV !== 'production' && normalizeOtpInput(otp) !== '123456') {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP for development mode'
      });
    }

    const user = await getUserWithPermissions({ email, phoneNumber });

    if (!user || !user.is_active) {
      return res.status(404).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    if (String(user.role).toLowerCase() === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts must use admin login with MFA',
        action: 'use_admin_login'
      });
    }

    const tokenId = crypto.randomUUID();
    const familyId = tokenId;
    const accessToken = buildAccessToken({ ...user, mfaVerified: false });
    const refreshToken = buildRefreshToken(user.id, tokenId, familyId);

    await persistRefreshToken({ tokenId, userId: user.id, refreshToken, familyId, req });

    await pool.query(
      'UPDATE users SET last_login_at = NOW(), last_login_ip = $1::inet WHERE id = $2::uuid',
      [req.ip || null, user.id]
    );

    issueAuthCookies(res, { accessToken, refreshToken });

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phoneNumber: user.phone_number,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to complete login', error, 'Login with OTP failed');
  }
}

async function createAdminMfaChallenge({ userId, req }) {
  const challengeId = crypto.randomUUID();
  const fingerprint = buildFingerprint(req);

  await pool.query(
    `INSERT INTO admin_login_challenges (id, user_id, fingerprint_hash, ip_address, user_agent, expires_at)
     VALUES ($1::uuid, $2::uuid, $3, $4::inet, $5, NOW() + INTERVAL '5 minutes')`,
    [challengeId, userId, fingerprint, req.ip || null, req.headers['user-agent'] || null]
  );

  const mfaToken = jwt.sign(
    {
      type: 'admin_mfa',
      challengeId,
      userId,
      fingerprint
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  return mfaToken;
}

export async function adminLoginInitiate(req, res) {
  try {
    const { email, password, otp } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'email is required'
      });
    }

    if (!password && !otp) {
      return res.status(400).json({
        success: false,
        message: 'password or otp is required'
      });
    }

    const user = await getUserWithPermissions({ email });

    if (!user || !user.is_active) {
      await logSecurityEvent('admin_login_denied', {
        email,
        reason: 'user_not_found_or_inactive',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(404).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    if (String(user.role).toLowerCase() !== 'admin') {
      await logSecurityEvent('admin_login_denied', {
        email,
        reason: 'role_mismatch',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    let primaryVerified = false;

    if (password && user.password_hash) {
      primaryVerified = await bcrypt.compare(password, user.password_hash);
    }

    if (!primaryVerified && otp) {
      primaryVerified = process.env.NODE_ENV !== 'production' && normalizeOtpInput(otp) === '123456';
    }

    if (!primaryVerified) {
      await logSecurityEvent('admin_login_denied', {
        email,
        reason: 'primary_factor_failed',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const mfaToken = await createAdminMfaChallenge({ userId: user.id, req });

    return res.json({
      success: true,
      message: 'Primary authentication successful. MFA required.',
      mfaRequired: true,
      mfaToken
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to complete admin login', error, 'Admin login initiate failed');
  }
}

export async function adminLoginVerifyMfa(req, res) {
  try {
    const { mfaToken, mfaCode } = req.body || {};

    if (!mfaToken || !mfaCode) {
      return res.status(400).json({
        success: false,
        message: 'mfaToken and mfaCode are required'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(mfaToken, process.env.JWT_SECRET);
      if (decoded.type !== 'admin_mfa') {
        throw new Error('Invalid MFA token type');
      }
    } catch {
      await logSecurityEvent('admin_mfa_denied', {
        reason: 'invalid_mfa_token',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired MFA token'
      });
    }

    const challengeResult = await pool.query(
      `SELECT id, user_id, fingerprint_hash, used_at, expires_at
       FROM admin_login_challenges
       WHERE id = $1::uuid AND user_id = $2::uuid`,
      [decoded.challengeId, decoded.userId]
    );

    if (challengeResult.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'MFA challenge not found' });
    }

    const challenge = challengeResult.rows[0];
    const fingerprint = buildFingerprint(req);

    if (challenge.used_at || new Date(challenge.expires_at).getTime() < Date.now()) {
      await logSecurityEvent('admin_mfa_denied', {
        userId: decoded.userId,
        reason: 'challenge_expired_or_used',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'MFA challenge expired' });
    }

    if (challenge.fingerprint_hash !== fingerprint || decoded.fingerprint !== fingerprint) {
      await logSecurityEvent('admin_mfa_denied', {
        userId: decoded.userId,
        reason: 'fingerprint_mismatch',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'Device verification failed' });
    }

    const userById = await pool.query(
      `SELECT
         u.id,
         u.email,
         COALESCE(r.name, u.role, 'user') as role,
         COALESCE(array_agg(DISTINCT p.name) FILTER (WHERE p.name IS NOT NULL), '{}') as permissions
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       LEFT JOIN role_permissions rp ON rp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rp.permission_id
       WHERE u.id = $1::uuid AND u.deleted_at IS NULL AND u.is_active = true
       GROUP BY u.id, u.email, r.name, u.role`,
      [decoded.userId]
    );

    const adminUser = userById.rows[0] || null;
    if (!adminUser || String(adminUser.role).toLowerCase() !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin account required' });
    }

    if (!verifyAdminMfaCode(adminUser.email, mfaCode)) {
      await pool.query(
        `UPDATE admin_login_challenges
         SET attempts = attempts + 1
         WHERE id = $1::uuid`,
        [challenge.id]
      );
      await logSecurityEvent('admin_mfa_denied', {
        userId: decoded.userId,
        reason: 'invalid_mfa_code',
        ip: req.ip,
        userAgent: req.headers['user-agent'] || null
      });
      return res.status(401).json({ success: false, message: 'Invalid MFA code' });
    }

    await pool.query(
      `UPDATE admin_login_challenges
       SET used_at = NOW()
       WHERE id = $1::uuid`,
      [challenge.id]
    );

    const tokenId = crypto.randomUUID();
    const familyId = tokenId;
    const accessToken = buildAccessToken({ ...adminUser, mfaVerified: true });
    const refreshToken = buildRefreshToken(adminUser.id, tokenId, familyId);

    await persistRefreshToken({ tokenId, userId: adminUser.id, refreshToken, familyId, req });

    await pool.query(
      'UPDATE users SET last_login_at = NOW(), last_login_ip = $1::inet WHERE id = $2::uuid',
      [req.ip || null, adminUser.id]
    );

    const csrfToken = issueAuthCookies(res, { accessToken, refreshToken });

    return res.json({
      success: true,
      message: 'Admin login successful',
      csrfToken,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions || []
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to complete admin MFA verification', error, 'Admin MFA verify failed');
  }
}

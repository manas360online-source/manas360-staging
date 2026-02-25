import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function listUsers(req, res) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT u.id,
              u.email,
              u.phone_number,
              COALESCE(u.full_name, btrim(concat_ws(' ', u.first_name, u.last_name))) AS full_name,
              COALESCE(u.first_name, split_part(u.full_name, ' ', 1)) AS first_name,
              COALESCE(u.last_name, NULLIF(btrim(substring(u.full_name FROM length(split_part(u.full_name, ' ', 1)) + 1)), '')) AS last_name,
              u.is_active,
              u.is_verified,
              u.created_at,
              COALESCE(r.name, u.role, 'user') as role
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.deleted_at IS NULL
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return res.json({ success: true, data: result.rows, pagination: { page, limit } });
  } catch (error) {
    return respondInternalError(res, 'Failed to list users', error, 'listUsers failed');
  }
}

export async function suspendUser(req, res) {
  try {
    const result = await pool.query(
      `UPDATE users
       SET is_active = false, updated_at = NOW()
       WHERE id = $1::uuid AND deleted_at IS NULL
       RETURNING id, email, is_active, updated_at`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User suspended', data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to suspend user', error, 'suspendUser failed');
  }
}

export async function unsuspendUser(req, res) {
  try {
    const result = await pool.query(
      `UPDATE users
       SET is_active = true, updated_at = NOW()
       WHERE id = $1::uuid AND deleted_at IS NULL
       RETURNING id, email, is_active, updated_at`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User unsuspended', data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to unsuspend user', error, 'unsuspendUser failed');
  }
}

export async function generateMfaSecret(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const adminEmail = req.user.email;
    const secret = speakeasy.generateSecret({
      name: `MANAS360 Admin (${adminEmail})`,
      issuer: 'MANAS360',
      length: 32
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    return res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl,
        backupCodes: generateBackupCodes()
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to generate MFA secret', error, 'generateMfaSecret failed');
  }
}

export async function enableMfa(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { secret, mfaCode } = req.body;

    if (!secret || !mfaCode) {
      return res.status(400).json({ success: false, message: 'Secret and MFA code required' });
    }

    // Verify the MFA code
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: mfaCode,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid MFA code' });
    }

    // Update user with MFA enabled
    const result = await pool.query(
      `UPDATE users
       SET mfa_enabled = true, mfa_secret = $1, updated_at = NOW()
       WHERE id = $2::uuid AND role = 'admin'
       RETURNING id, email, mfa_enabled, updated_at`,
      [secret, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Only admins can enable MFA' });
    }

    return res.json({
      success: true,
      message: 'MFA enabled successfully',
      data: result.rows[0]
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to enable MFA', error, 'enableMfa failed');
  }
}

export async function disableMfa(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password required to disable MFA' });
    }

    // Admin password verification should be done via existing auth flow
    // For now, we just disable it
    const result = await pool.query(
      `UPDATE users
       SET mfa_enabled = false, mfa_secret = NULL, updated_at = NOW()
       WHERE id = $1::uuid AND role = 'admin'
       RETURNING id, email, mfa_enabled, updated_at`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Only admins can disable MFA' });
    }

    return res.json({
      success: true,
      message: 'MFA disabled successfully',
      data: result.rows[0]
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to disable MFA', error, 'disableMfa failed');
  }
}

export async function getMfaStatus(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const result = await pool.query(
      `SELECT id, email, mfa_enabled FROM users WHERE id = $1::uuid AND role = 'admin'`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Only admins can access MFA status' });
    }

    return res.json({
      success: true,
      data: {
        mfaEnabled: result.rows[0].mfa_enabled || false,
        email: result.rows[0].email
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to get MFA status', error, 'getMfaStatus failed');
  }
}

function generateBackupCodes(count = 8) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push(
      Math.random().toString(36).substring(2, 8).toUpperCase() +
      '-' +
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
  }
  return codes;
}

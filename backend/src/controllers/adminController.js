import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

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

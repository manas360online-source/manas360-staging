import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

export async function getCurrentUser(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.email,
         u.phone_number,
         COALESCE(u.first_name, split_part(u.full_name, ' ', 1)) AS first_name,
         COALESCE(u.last_name, NULLIF(btrim(substring(u.full_name FROM length(split_part(u.full_name, ' ', 1)) + 1)), '')) AS last_name,
         COALESCE(u.full_name, btrim(concat_ws(' ', u.first_name, u.last_name))) AS full_name,
         u.profile_picture_url,
         u.bio,
         u.timezone,
         u.language,
         u.is_verified,
         u.created_at,
         COALESCE(r.name, u.role, 'user') AS role
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.id = $1::uuid AND u.deleted_at IS NULL`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch profile', error, 'getCurrentUser failed');
  }
}

export async function updateCurrentUser(req, res) {
  try {
    const { firstName, lastName, bio, timezone, language, profilePictureUrl } = req.body || {};

    const result = await pool.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           bio = COALESCE($3, bio),
           timezone = COALESCE($4, timezone),
           language = COALESCE($5, language),
           profile_picture_url = COALESCE($6, profile_picture_url),
           updated_at = NOW()
       WHERE id = $7::uuid AND deleted_at IS NULL
       RETURNING id, email, phone_number, first_name, last_name, bio, timezone, language, profile_picture_url, updated_at`,
      [firstName, lastName, bio, timezone, language, profilePictureUrl, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'Profile updated', data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to update profile', error, 'updateCurrentUser failed');
  }
}

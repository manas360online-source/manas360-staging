import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

export async function listThemes(req, res) {
  try {
    const showPremium = Boolean(req.user);

    const result = await pool.query(
      `SELECT id, name, description, background_url, audio_url, duration_minutes, is_premium, category, tags
       FROM themed_room_themes
       WHERE is_active = true
         AND ($1::boolean = true OR is_premium = false)
       ORDER BY is_premium ASC, name ASC`,
      [showPremium]
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch themes', error, 'listThemes failed');
  }
}

export async function createSession(req, res) {
  try {
    const { themeId, sessionData = {} } = req.body || {};

    if (!themeId) {
      return res.status(400).json({ success: false, message: 'themeId is required' });
    }

    const exists = await pool.query(
      'SELECT id FROM themed_room_themes WHERE id = $1::uuid AND is_active = true',
      [themeId]
    );

    if (exists.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Theme not found' });
    }

    const created = await pool.query(
      `INSERT INTO themed_room_sessions (user_id, theme_id, session_data)
       VALUES ($1::uuid, $2::uuid, $3::jsonb)
       RETURNING id, user_id, theme_id, started_at, session_data`,
      [req.user.userId, themeId, JSON.stringify(sessionData)]
    );

    return res.status(201).json({ success: true, data: created.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to create session', error, 'createSession failed');
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const { sessionData = {} } = req.body || {};

    const result = await pool.query(
      `UPDATE themed_room_sessions
       SET ended_at = NOW(),
           duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))::int,
           session_data = COALESCE(session_data, '{}'::jsonb) || $1::jsonb
       WHERE id = $2::uuid AND user_id = $3::uuid
       RETURNING id, started_at, ended_at, duration_seconds, session_data`,
      [JSON.stringify(sessionData), id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return respondInternalError(res, 'Failed to end session', error, 'endSession failed');
  }
}

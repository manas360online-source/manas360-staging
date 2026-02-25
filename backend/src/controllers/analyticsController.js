import { pool } from '../config/database.js';
import { respondInternalError } from '../utils/safeError.js';

export async function getOverview(req, res) {
  try {
    const [sessions, users, subscriptions] = await Promise.all([
      pool.query(
        `SELECT
           COUNT(*)::int as total_sessions,
           COUNT(*) FILTER (WHERE ended_at IS NOT NULL)::int as completed_sessions,
           COALESCE(AVG(duration_seconds) FILTER (WHERE duration_seconds IS NOT NULL), 0)::int as avg_duration_seconds
         FROM themed_room_sessions`
      ),
      pool.query('SELECT COUNT(*)::int as total_users FROM users WHERE deleted_at IS NULL'),
      pool.query("SELECT COUNT(*)::int as active_subscriptions FROM subscriptions WHERE status = 'active' AND ends_at > NOW()")
    ]);

    return res.json({
      success: true,
      data: {
        totalUsers: users.rows[0].total_users,
        totalSessions: sessions.rows[0].total_sessions,
        completedSessions: sessions.rows[0].completed_sessions,
        avgDurationSeconds: sessions.rows[0].avg_duration_seconds,
        activeSubscriptions: subscriptions.rows[0].active_subscriptions
      }
    });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch analytics overview', error, 'getOverview failed');
  }
}

export async function getSessionsMetrics(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         t.id as theme_id,
         t.name as theme_name,
         COUNT(s.id)::int as sessions,
         COALESCE(AVG(s.duration_seconds) FILTER (WHERE s.duration_seconds IS NOT NULL), 0)::int as avg_duration_seconds
       FROM themed_room_themes t
       LEFT JOIN themed_room_sessions s ON s.theme_id = t.id
       WHERE t.is_active = true
       GROUP BY t.id, t.name
       ORDER BY sessions DESC, t.name ASC`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch session metrics', error, 'getSessionsMetrics failed');
  }
}

export async function getOutcomeMetrics(req, res) {
  try {
    const result = await pool.query(
      `SELECT
         DATE_TRUNC('day', started_at)::date as date,
         COUNT(*)::int as sessions_started,
         COUNT(*) FILTER (WHERE ended_at IS NOT NULL)::int as sessions_completed
       FROM themed_room_sessions
       GROUP BY DATE_TRUNC('day', started_at)::date
       ORDER BY date DESC
       LIMIT 30`
    );

    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return respondInternalError(res, 'Failed to fetch outcome metrics', error, 'getOutcomeMetrics failed');
  }
}

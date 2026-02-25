import express from 'express';
import { query, getClient } from '../db.js';

const router = express.Router();

const toNumber = (value) => (value === undefined || value === null ? null : Number(value));

const isValidInteger = (value) => Number.isInteger(value) && value >= 0;

const requireThemeId = (themeId) => typeof themeId === 'string' && themeId.trim().length > 0;

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT theme_id, name_en, name_hi, description_en, icon_emoji, thumbnail_url,
              is_premium, therapeutic_uses, best_time_of_day, video_duration_seconds, color_palette
         FROM themed_rooms
        WHERE is_active = true
        ORDER BY display_order ASC, name_en ASC`
    );

    const themes = rows.map((row) => ({
      theme_id: row.theme_id,
      name: row.name_en,
      name_hi: row.name_hi,
      description: row.description_en,
      icon: row.icon_emoji,
      thumbnail_url: row.thumbnail_url,
      is_premium: row.is_premium,
      therapeutic_uses: row.therapeutic_uses ?? [],
      best_time: row.best_time_of_day,
      duration_seconds: row.video_duration_seconds,
      color_palette: row.color_palette ?? {}
    }));

    const totalCount = themes.length;
    const premiumCount = themes.filter((theme) => theme.is_premium).length;
    const freeCount = totalCount - premiumCount;

    res.json({
      status: 'success',
      data: {
        themes,
        total_count: totalCount,
        free_count: freeCount,
        premium_count: premiumCount
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:themeId', async (req, res, next) => {
  const { themeId } = req.params;

  if (!requireThemeId(themeId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid theme_id.' });
  }

  try {
    const { rows } = await query(
      `SELECT tr.*, 
              pa.id AS primary_id, pa.title AS primary_title, pa.url AS primary_url, pa.duration_seconds AS primary_duration,
              sa.id AS secondary_id, sa.title AS secondary_title, sa.url AS secondary_url, sa.duration_seconds AS secondary_duration
         FROM themed_rooms tr
         LEFT JOIN audio_tracks pa ON tr.primary_audio_track_id = pa.id
         LEFT JOIN audio_tracks sa ON tr.secondary_audio_track_id = sa.id
        WHERE tr.theme_id = $1 AND tr.is_active = true
        LIMIT 1`,
      [themeId]
    );

    if (!rows.length) {
      return res.status(404).json({ status: 'error', message: 'Theme not found.' });
    }

    const theme = rows[0];
    const avgDurationMinutes = theme.avg_session_duration_seconds
      ? Number((Number(theme.avg_session_duration_seconds) / 60).toFixed(1))
      : 0;

    res.json({
      status: 'success',
      data: {
        theme_id: theme.theme_id,
        name: theme.name_en,
        name_hi: theme.name_hi,
        video: {
          url_1080p: theme.video_url_1080p,
          url_720p: theme.video_url_720p,
          duration_seconds: theme.video_duration_seconds,
          file_size_mb: theme.video_file_size_mb
        },
        audio: {
          primary: theme.primary_id
            ? {
                track_id: theme.primary_id,
                title: theme.primary_title,
                url: theme.primary_url,
                duration_seconds: theme.primary_duration
              }
            : null,
          secondary: theme.secondary_id
            ? {
                track_id: theme.secondary_id,
                title: theme.secondary_title,
                url: theme.secondary_url,
                duration_seconds: theme.secondary_duration
              }
            : null
        },
        analytics: {
          total_sessions: theme.total_sessions ?? 0,
          avg_duration_minutes: avgDurationMinutes,
          avg_rating: Number(theme.avg_rating ?? 0)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/sessions', async (req, res, next) => {
  const {
    theme_id: themeId,
    timer_seconds: timerSeconds,
    audio_enabled: audioEnabled = true,
    audio_track_id: audioTrackId,
    mood_before: moodBefore,
    user_id: bodyUserId
  } = req.body || {};

  if (!requireThemeId(themeId)) {
    return res.status(400).json({ status: 'error', message: 'theme_id is required.' });
  }

  if (timerSeconds !== undefined && !isValidInteger(timerSeconds)) {
    return res.status(400).json({ status: 'error', message: 'timer_seconds must be a positive integer.' });
  }

  if (moodBefore !== undefined && moodBefore !== null) {
    const moodValue = Number(moodBefore);
    if (!Number.isInteger(moodValue) || moodValue < 1 || moodValue > 10) {
      return res.status(400).json({ status: 'error', message: 'mood_before must be between 1 and 10.' });
    }
  }

  const headerUserId = req.header('x-user-id');
  const userId = headerUserId || bodyUserId || process.env.DEFAULT_USER_ID;

  if (!userId) {
    return res.status(400).json({ status: 'error', message: 'User id is required.' });
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    const themeResult = await client.query(
      `SELECT theme_id, video_url_1080p, video_url_720p, primary_audio_track_id
         FROM themed_rooms
        WHERE theme_id = $1 AND is_active = true`,
      [themeId]
    );

    if (!themeResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'error', message: 'Theme not found.' });
    }

    const theme = themeResult.rows[0];
    const selectedAudioId = audioTrackId || theme.primary_audio_track_id;

    const insertResult = await client.query(
      `INSERT INTO themed_room_sessions (
         user_id, theme_id, timer_setting_seconds, audio_track_id, audio_enabled, mood_before
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, started_at`,
      [userId, themeId, timerSeconds ?? null, selectedAudioId ?? null, !!audioEnabled, moodBefore ?? null]
    );

    let audioUrl = null;
    if (audioEnabled && selectedAudioId) {
      const audioResult = await client.query(
        'SELECT url FROM audio_tracks WHERE id = $1 LIMIT 1',
        [selectedAudioId]
      );
      audioUrl = audioResult.rows[0]?.url ?? null;
    }

    await client.query('COMMIT');

    res.json({
      status: 'success',
      data: {
        session_id: insertResult.rows[0].id,
        started_at: insertResult.rows[0].started_at,
        timer_seconds: timerSeconds ?? null,
        video_url: theme.video_url_1080p,
        audio_url: audioUrl
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

router.patch('/sessions/:sessionId', async (req, res, next) => {
  const { sessionId } = req.params;
  const {
    action,
    mood_after: moodAfter,
    rating,
    completed_full_timer: completedFullTimer,
    paused_count: pausedCount,
    screenshot_taken: screenshotTaken,
    audio_enabled: audioEnabled,
    audio_track_id: audioTrackId
  } = req.body || {};

  if (!sessionId) {
    return res.status(400).json({ status: 'error', message: 'sessionId is required.' });
  }

  if (rating !== undefined && rating !== null) {
    const ratingValue = Number(rating);
    if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ status: 'error', message: 'rating must be between 1 and 5.' });
    }
  }

  if (moodAfter !== undefined && moodAfter !== null) {
    const moodValue = Number(moodAfter);
    if (!Number.isInteger(moodValue) || moodValue < 1 || moodValue > 10) {
      return res.status(400).json({ status: 'error', message: 'mood_after must be between 1 and 10.' });
    }
  }

  const client = await getClient();

  try {
    await client.query('BEGIN');

    const sessionResult = await client.query(
      `SELECT id, theme_id, started_at, ended_at, duration_seconds
         FROM themed_room_sessions
        WHERE id = $1
        FOR UPDATE`,
      [sessionId]
    );

    if (!sessionResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'error', message: 'Session not found.' });
    }

    const session = sessionResult.rows[0];
    const shouldEnd = action === 'end';
    const endedAt = shouldEnd ? new Date() : session.ended_at;
    const durationSeconds = shouldEnd
      ? Math.max(0, Math.floor((endedAt.getTime() - new Date(session.started_at).getTime()) / 1000))
      : session.duration_seconds;

    const updateResult = await client.query(
      `UPDATE themed_room_sessions
          SET ended_at = COALESCE($1, ended_at),
              duration_seconds = COALESCE($2, duration_seconds),
              mood_after = COALESCE($3, mood_after),
              rating = COALESCE($4, rating),
              completed_full_timer = COALESCE($5, completed_full_timer),
              paused_count = COALESCE($6, paused_count),
              screenshot_taken = COALESCE($7, screenshot_taken),
              audio_enabled = COALESCE($8, audio_enabled),
              audio_track_id = COALESCE($9, audio_track_id)
        WHERE id = $10
        RETURNING id, ended_at, duration_seconds`,
      [
        endedAt,
        durationSeconds,
        moodAfter ?? null,
        rating ?? null,
        completedFullTimer ?? null,
        pausedCount ?? null,
        screenshotTaken ?? null,
        audioEnabled ?? null,
        audioTrackId ?? null,
        sessionId
      ]
    );

    if (shouldEnd) {
      await client.query(
        `UPDATE themed_rooms
            SET total_sessions = total_sessions + 1,
                avg_session_duration_seconds =
                  CASE
                    WHEN total_sessions + 1 = 0 THEN $2
                    ELSE ((avg_session_duration_seconds * total_sessions) + $2) / (total_sessions + 1)
                  END,
                avg_rating =
                  CASE
                    WHEN $3::numeric IS NULL THEN avg_rating
                    ELSE ((avg_rating * total_sessions) + $3) / (total_sessions + 1)
                  END
          WHERE theme_id = $1`,
        [session.theme_id, durationSeconds ?? 0, rating ?? null]
      );
    }

    await client.query('COMMIT');

    res.json({
      status: 'success',
      data: {
        session_id: updateResult.rows[0].id,
        ended_at: updateResult.rows[0].ended_at,
        duration_seconds: updateResult.rows[0].duration_seconds
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

export default router;

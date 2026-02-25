CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Minimal dependency tables for local development (safe if already exists)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) UNIQUE NOT NULL,
    url VARCHAR(500) NOT NULL,
    duration_seconds INTEGER,
    file_size_mb DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themed_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id VARCHAR(50) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    icon_emoji VARCHAR(10),
    thumbnail_url VARCHAR(500),

    -- Video Assets
    video_url_1080p VARCHAR(500) NOT NULL,
    video_url_720p VARCHAR(500),
    video_duration_seconds INTEGER NOT NULL,
    video_file_size_mb DECIMAL(5,2),

    -- Paired Audio (FK to audio_tracks)
    primary_audio_track_id UUID REFERENCES audio_tracks(id),
    secondary_audio_track_id UUID REFERENCES audio_tracks(id),

    -- Metadata
    color_palette JSONB,
    therapeutic_uses TEXT[],
    best_time_of_day VARCHAR(20),

    -- Premium/Free
    is_premium BOOLEAN DEFAULT false,

    -- Analytics
    total_sessions INTEGER DEFAULT 0,
    avg_session_duration_seconds INTEGER DEFAULT 0,
    avg_rating DECIMAL(2,1) DEFAULT 0.0,

    -- Status
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS themed_room_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    theme_id VARCHAR(50) NOT NULL REFERENCES themed_rooms(theme_id),

    -- Session Details
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    timer_setting_seconds INTEGER,

    -- Audio played
    audio_track_id UUID REFERENCES audio_tracks(id),
    audio_enabled BOOLEAN DEFAULT true,

    -- User Actions
    paused_count INTEGER DEFAULT 0,
    screenshot_taken BOOLEAN DEFAULT false,
    completed_full_timer BOOLEAN DEFAULT false,

    -- Feedback
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,

    -- Context
    mood_before INTEGER,
    mood_after INTEGER,
    device_type VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_themed_rooms_active ON themed_rooms(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_themed_rooms_therapeutic ON themed_rooms USING GIN(therapeutic_uses);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON themed_room_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_theme ON themed_room_sessions(theme_id, started_at DESC);

-- Seed audio tracks
INSERT INTO audio_tracks (title, url, duration_seconds)
VALUES
  ('Morning Raga - Bansuri', 'https://cdn.mans360.in/audio/bansuri_morning_raga_10min.mp3', 600),
  ('432Hz Nature Calm', 'https://cdn.mans360.in/audio/432hz_nature_calm_15min.mp3', 900),
  ('Ocean Waves Binaural', 'https://cdn.mans360.in/audio/ocean_waves_binaural_20min.mp3', 1200),
  ('528Hz Water Healing', 'https://cdn.mans360.in/audio/528hz_water_healing_15min.mp3', 900),
  ('Japanese Flute Zen', 'https://cdn.mans360.in/audio/japanese_flute_zen_12min.mp3', 720),
  ('Singing Bowl Meditation', 'https://cdn.mans360.in/audio/singing_bowl_meditation_10min.mp3', 600),
  ('Forest Ambience Birds', 'https://cdn.mans360.in/audio/forest_ambience_birds_30min.mp3', 1800),
  ('Rain on Leaves', 'https://cdn.mans360.in/audio/rain_on_leaves_20min.mp3', 1200),
  ('Himalayan Singing Bowls', 'https://cdn.mans360.in/audio/himalayan_singing_bowls_15min.mp3', 900),
  ('Om Chanting 432Hz', 'https://cdn.mans360.in/audio/om_chanting_432hz_10min.mp3', 600)
ON CONFLICT (title) DO NOTHING;

-- Seed themed rooms
INSERT INTO themed_rooms (
    theme_id, name_en, name_hi, description_en, description_hi, icon_emoji,
    thumbnail_url,
    video_url_1080p, video_url_720p, video_duration_seconds, video_file_size_mb,
    primary_audio_track_id, secondary_audio_track_id,
    color_palette, therapeutic_uses, best_time_of_day, is_premium, display_order
) VALUES
(
    'butterfly_meadow',
    'Butterfly Meadow',
    'तितली का मैदान',
    'Watch gentle butterflies dance among wildflowers',
    'जंगली फूलों के बीच नाचती तितलियों को देखें',
    '🦋',
    'https://cdn.mans360.in/themes/thumbs/butterfly.jpg',
    'https://cdn.mans360.in/themes/butterfly_1080p.mp4',
    'https://cdn.mans360.in/themes/butterfly_720p.mp4',
    30, 15.0,
    (SELECT id FROM audio_tracks WHERE title = 'Morning Raga - Bansuri' LIMIT 1),
    (SELECT id FROM audio_tracks WHERE title = '432Hz Nature Calm' LIMIT 1),
    '{"primary": "#E6E6FA", "secondary": "#FFD700", "accent": "#90EE90"}',
    ARRAY['anxiety', 'grounding', 'children'],
    'anytime',
    false, 1
),
(
    'ocean_waves',
    'Ocean Waves',
    'समुद्र की लहरें',
    'Peaceful waves lapping at a tropical shore',
    'उष्णकटिबंधीय तट पर शांत लहरें',
    '🏖️',
    'https://cdn.mans360.in/themes/thumbs/ocean.jpg',
    'https://cdn.mans360.in/themes/ocean_1080p.mp4',
    'https://cdn.mans360.in/themes/ocean_720p.mp4',
    60, 25.0,
    (SELECT id FROM audio_tracks WHERE title = 'Ocean Waves Binaural' LIMIT 1),
    (SELECT id FROM audio_tracks WHERE title = '528Hz Water Healing' LIMIT 1),
    '{"primary": "#20B2AA", "secondary": "#F5DEB3", "accent": "#FF7F50"}',
    ARRAY['stress', 'sleep', 'ptsd'],
    'evening',
    false, 2
),
(
    'sakura_garden',
    'Sakura Garden',
    'सकुरा बगीचा',
    'Cherry blossoms gently falling in a zen garden',
    'ज़ेन गार्डन में धीरे-धीरे गिरते चेरी ब्लॉसम',
    '🌸',
    'https://cdn.mans360.in/themes/thumbs/sakura.jpg',
    'https://cdn.mans360.in/themes/sakura_1080p.mp4',
    'https://cdn.mans360.in/themes/sakura_720p.mp4',
    45, 20.0,
    (SELECT id FROM audio_tracks WHERE title = 'Japanese Flute Zen' LIMIT 1),
    (SELECT id FROM audio_tracks WHERE title = 'Singing Bowl Meditation' LIMIT 1),
    '{"primary": "#FFB7C5", "secondary": "#708090", "accent": "#8FBC8F"}',
    ARRAY['mindfulness', 'anger', 'focus'],
    'anytime',
    false, 3
),
(
    'enchanted_forest',
    'Enchanted Forest',
    'जादुई जंगल',
    'Mystical forest with dancing fireflies',
    'नाचती जुगनुओं के साथ रहस्यमय जंगल',
    '🌲',
    'https://cdn.mans360.in/themes/thumbs/forest.jpg',
    'https://cdn.mans360.in/themes/forest_1080p.mp4',
    'https://cdn.mans360.in/themes/forest_720p.mp4',
    45, 22.0,
    (SELECT id FROM audio_tracks WHERE title = 'Forest Ambience Birds' LIMIT 1),
    (SELECT id FROM audio_tracks WHERE title = 'Rain on Leaves' LIMIT 1),
    '{"primary": "#228B22", "secondary": "#FFFF99", "accent": "#708090"}',
    ARRAY['nature', 'grounding', 'sleep'],
    'evening',
    true, 4
),
(
    'himalayan_sunrise',
    'Himalayan Sunrise',
    'हिमालय में सूर्योदय',
    'Majestic mountain peaks bathed in golden light',
    'सुनहरी रोशनी में नहाई राजसी पर्वत चोटियाँ',
    '🏔️',
    'https://cdn.mans360.in/themes/thumbs/himalaya.jpg',
    'https://cdn.mans360.in/themes/himalaya_1080p.mp4',
    'https://cdn.mans360.in/themes/himalaya_720p.mp4',
    60, 28.0,
    (SELECT id FROM audio_tracks WHERE title = 'Himalayan Singing Bowls' LIMIT 1),
    (SELECT id FROM audio_tracks WHERE title = 'Om Chanting 432Hz' LIMIT 1),
    '{"primary": "#FFFAFA", "secondary": "#FFD700", "accent": "#87CEEB"}',
    ARRAY['spiritual', 'morning', 'inspiration'],
    'morning',
    true, 5
)
ON CONFLICT (theme_id) DO NOTHING;

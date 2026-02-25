-- ============================================

-- OFFLINE SYNC TRACKING

-- ============================================

-- Sync status for each entity type

CREATE TABLE sync_status (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id),

  entity_type VARCHAR(50) NOT NULL, -- 'mood', 'journal', 'assessment'

  last_synced_at TIMESTAMP,

  last_local_change_at TIMESTAMP,

  pending_count INTEGER DEFAULT 0,

  sync_errors JSONB DEFAULT '[]',

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW(),

  

  UNIQUE(user_id, entity_type),

  INDEX idx_user_sync (user_id),

  INDEX idx_entity_type (entity_type)

);

-- Offline entries queue (server-side tracking)

CREATE TABLE offline_sync_queue (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL REFERENCES users(id),

  entity_type VARCHAR(50) NOT NULL,

  entity_id UUID NOT NULL,

  operation VARCHAR(20) NOT NULL, -- 'create', 'update', 'delete'

  payload JSONB NOT NULL,

  client_timestamp TIMESTAMP NOT NULL,

  server_timestamp TIMESTAMP DEFAULT NOW(),

  sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'failed', 'conflict'

  conflict_resolution JSONB,

  attempts INTEGER DEFAULT 0,

  last_attempt_at TIMESTAMP,

  error_message TEXT,

  

  INDEX idx_user_queue (user_id, sync_status),

  INDEX idx_entity (entity_type, entity_id),

  INDEX idx_status (sync_status, created_at)

);

-- ============================================

-- ACCESSIBILITY PREFERENCES

-- ============================================

CREATE TABLE accessibility_preferences (

  user_id UUID PRIMARY KEY REFERENCES users(id),

  

  -- Visual settings

  high_contrast_mode BOOLEAN DEFAULT false,

  large_text_mode BOOLEAN DEFAULT false,

  font_size_multiplier DECIMAL(3,2) DEFAULT 1.0, -- 0.8 to 2.0

  dyslexia_friendly_font BOOLEAN DEFAULT false,

  reduce_motion BOOLEAN DEFAULT false,

  dark_mode VARCHAR(20) DEFAULT 'system', -- 'system', 'light', 'dark'

  

  -- Audio settings

  screen_reader_optimized BOOLEAN DEFAULT false,

  voice_control_enabled BOOLEAN DEFAULT false,

  text_to_speech_enabled BOOLEAN DEFAULT false,

  tts_voice_preference VARCHAR(100),

  tts_speed DECIMAL(3,2) DEFAULT 1.0, -- 0.5 to 2.0

  tts_pitch DECIMAL(3,2) DEFAULT 1.0,

  

  -- Language preferences

  primary_language VARCHAR(10) DEFAULT 'en-IN',

  speech_recognition_language VARCHAR(10) DEFAULT 'en-IN',

  

  -- Navigation preferences

  keyboard_navigation_hints BOOLEAN DEFAULT true,

  focus_highlight_color VARCHAR(7) DEFAULT '#667eea',

  

  -- Notification preferences

  vibration_enabled BOOLEAN DEFAULT true,

  sound_enabled BOOLEAN DEFAULT true,

  

  created_at TIMESTAMP DEFAULT NOW(),

  updated_at TIMESTAMP DEFAULT NOW()

);

-- ============================================

-- OFFLINE CONTENT CACHE METADATA

-- ============================================

CREATE TABLE offline_content_cache (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES users(id), -- NULL for global content

  content_type VARCHAR(50) NOT NULL, -- 'meditation', 'article', 'exercise'

  content_id UUID NOT NULL,

  content_hash VARCHAR(64) NOT NULL, -- SHA256 for change detection

  file_size_bytes INTEGER,

  cached_at TIMESTAMP DEFAULT NOW(),

  expires_at TIMESTAMP,

  last_accessed_at TIMESTAMP,

  access_count INTEGER DEFAULT 0,

  

  UNIQUE(user_id, content_type, content_id),

  INDEX idx_user_cache (user_id, content_type),

  INDEX idx_expiry (expires_at)

);

-- ============================================

-- PWA INSTALLATION TRACKING

-- ============================================

CREATE TABLE pwa_installations (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID REFERENCES users(id),

  device_id VARCHAR(255) NOT NULL,

  platform VARCHAR(50), -- 'android', 'ios', 'windows', 'macos', 'linux'

  browser VARCHAR(50),

  installed_at TIMESTAMP DEFAULT NOW(),

  last_launch_at TIMESTAMP,

  launch_count INTEGER DEFAULT 0,

  push_subscription JSONB, -- Web Push subscription object

  is_active BOOLEAN DEFAULT true,

  

  UNIQUE(user_id, device_id),

  INDEX idx_user_pwa (user_id),

  INDEX idx_active (is_active)

);

-- ============================================
-- MANAS360 Session Analytics - Database Schema
-- Story 3.6: Session Analytics
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. THERAPY SESSIONS TABLE
-- Core table storing all therapy session data
-- ============================================
CREATE TABLE IF NOT EXISTS therapy_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL,
    therapist_id UUID NOT NULL,
    session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('CBT', 'DBT', 'Mindfulness', 'Psychotherapy', 'Counseling', 'Group')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
    session_mode VARCHAR(20) NOT NULL DEFAULT 'video' CHECK (session_mode IN ('video', 'audio', 'chat', 'in_person')),
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_patient ON therapy_sessions(patient_id);
CREATE INDEX idx_sessions_therapist ON therapy_sessions(therapist_id);
CREATE INDEX idx_sessions_scheduled ON therapy_sessions(scheduled_at);
CREATE INDEX idx_sessions_status ON therapy_sessions(status);
CREATE INDEX idx_sessions_type ON therapy_sessions(session_type);

-- ============================================
-- 2. SESSION OUTCOMES TABLE
-- Tracks PHQ-9, GAD-7 and other assessment scores
-- ============================================
CREATE TABLE IF NOT EXISTS session_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES therapy_sessions(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL,
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN ('PHQ-9', 'GAD-7', 'DASS-21', 'PSS-10', 'WHO-5')),
    pre_score INTEGER NOT NULL CHECK (pre_score >= 0),
    post_score INTEGER CHECK (post_score >= 0),
    improvement_score INTEGER GENERATED ALWAYS AS (pre_score - COALESCE(post_score, pre_score)) STORED,
    severity_pre VARCHAR(20),
    severity_post VARCHAR(20),
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_outcomes_session ON session_outcomes(session_id);
CREATE INDEX idx_outcomes_patient ON session_outcomes(patient_id);
CREATE INDEX idx_outcomes_type ON session_outcomes(assessment_type);
CREATE INDEX idx_outcomes_date ON session_outcomes(assessed_at);

-- ============================================
-- 3. THERAPIST METRICS TABLE
-- Aggregated therapist performance data
-- ============================================
CREATE TABLE IF NOT EXISTS therapist_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    therapist_id UUID NOT NULL,
    metric_date DATE NOT NULL,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    cancelled_sessions INTEGER DEFAULT 0,
    no_show_sessions INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration DECIMAL(6,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_patients INTEGER DEFAULT 0,
    new_patients INTEGER DEFAULT 0,
    returning_patients INTEGER DEFAULT 0,
    avg_outcome_improvement DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(therapist_id, metric_date)
);

CREATE INDEX idx_therapist_metrics_date ON therapist_metrics(metric_date);
CREATE INDEX idx_therapist_metrics_therapist ON therapist_metrics(therapist_id);

-- ============================================
-- 4. SESSION ANALYTICS DAILY TABLE
-- Platform-wide daily aggregated metrics
-- ============================================
CREATE TABLE IF NOT EXISTS session_analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE NOT NULL UNIQUE,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    cancelled_sessions INTEGER DEFAULT 0,
    no_show_sessions INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    avg_duration_minutes DECIMAL(6,2) DEFAULT 0,
    total_unique_patients INTEGER DEFAULT 0,
    new_patients INTEGER DEFAULT 0,
    active_therapists INTEGER DEFAULT 0,
    sessions_by_type JSONB DEFAULT '{}',
    sessions_by_mode JSONB DEFAULT '{}',
    avg_phq9_improvement DECIMAL(5,2) DEFAULT 0,
    avg_gad7_improvement DECIMAL(5,2) DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    revenue_total DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_daily_date ON session_analytics_daily(metric_date);

-- ============================================
-- 5. USERS TABLE (Reference for joins)
-- Simplified for analytics purposes
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'therapist', 'patient')),
    specialization VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. VIEWS FOR ANALYTICS
-- ============================================

-- View: Session Summary Statistics
CREATE OR REPLACE VIEW v_session_summary AS
SELECT 
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_sessions,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_show_sessions,
    ROUND(COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as completion_rate,
    ROUND(AVG(duration_minutes) FILTER (WHERE status = 'completed'), 2) as avg_duration,
    ROUND(AVG(rating) FILTER (WHERE rating IS NOT NULL), 2) as avg_rating,
    COUNT(DISTINCT patient_id) as unique_patients,
    COUNT(DISTINCT therapist_id) as active_therapists
FROM therapy_sessions
WHERE scheduled_at >= CURRENT_DATE - INTERVAL '30 days';

-- View: Therapist Performance Ranking
CREATE OR REPLACE VIEW v_therapist_rankings AS
SELECT 
    t.therapist_id,
    u.full_name as therapist_name,
    u.specialization,
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE t.status = 'completed') as completed_sessions,
    ROUND(COUNT(*) FILTER (WHERE t.status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as completion_rate,
    ROUND(AVG(t.duration_minutes) FILTER (WHERE t.status = 'completed'), 2) as avg_duration,
    ROUND(AVG(t.rating) FILTER (WHERE t.rating IS NOT NULL), 2) as avg_rating,
    COUNT(DISTINCT t.patient_id) as unique_patients,
    ROUND(AVG(o.improvement_score), 2) as avg_outcome_improvement
FROM therapy_sessions t
LEFT JOIN users u ON t.therapist_id = u.id
LEFT JOIN session_outcomes o ON t.id = o.session_id
WHERE t.scheduled_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY t.therapist_id, u.full_name, u.specialization
ORDER BY completion_rate DESC, avg_rating DESC;

-- View: Outcome Trends
CREATE OR REPLACE VIEW v_outcome_trends AS
SELECT 
    DATE_TRUNC('week', assessed_at)::DATE as week_start,
    assessment_type,
    COUNT(*) as assessments_count,
    ROUND(AVG(pre_score), 2) as avg_pre_score,
    ROUND(AVG(post_score), 2) as avg_post_score,
    ROUND(AVG(improvement_score), 2) as avg_improvement
FROM session_outcomes
WHERE assessed_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE_TRUNC('week', assessed_at), assessment_type
ORDER BY week_start DESC;

-- ============================================
-- 7. FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function: Aggregate daily analytics
CREATE OR REPLACE FUNCTION fn_aggregate_daily_analytics(target_date DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO session_analytics_daily (
        metric_date,
        total_sessions,
        completed_sessions,
        cancelled_sessions,
        no_show_sessions,
        completion_rate,
        avg_duration_minutes,
        total_unique_patients,
        active_therapists,
        sessions_by_type,
        sessions_by_mode,
        avg_phq9_improvement,
        avg_gad7_improvement,
        avg_rating
    )
    SELECT 
        target_date,
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'completed'),
        COUNT(*) FILTER (WHERE status = 'cancelled'),
        COUNT(*) FILTER (WHERE status = 'no_show'),
        ROUND(COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2),
        ROUND(AVG(duration_minutes) FILTER (WHERE status = 'completed'), 2),
        COUNT(DISTINCT patient_id),
        COUNT(DISTINCT therapist_id),
        jsonb_object_agg(COALESCE(session_type, 'Unknown'), type_count),
        jsonb_object_agg(COALESCE(session_mode, 'Unknown'), mode_count),
        (SELECT ROUND(AVG(improvement_score), 2) FROM session_outcomes WHERE assessment_type = 'PHQ-9' AND DATE(assessed_at) = target_date),
        (SELECT ROUND(AVG(improvement_score), 2) FROM session_outcomes WHERE assessment_type = 'GAD-7' AND DATE(assessed_at) = target_date),
        ROUND(AVG(rating) FILTER (WHERE rating IS NOT NULL), 2)
    FROM therapy_sessions t
    LEFT JOIN LATERAL (
        SELECT session_type, COUNT(*) as type_count FROM therapy_sessions WHERE DATE(scheduled_at) = target_date GROUP BY session_type
    ) st ON true
    LEFT JOIN LATERAL (
        SELECT session_mode, COUNT(*) as mode_count FROM therapy_sessions WHERE DATE(scheduled_at) = target_date GROUP BY session_mode
    ) sm ON true
    WHERE DATE(scheduled_at) = target_date
    ON CONFLICT (metric_date) DO UPDATE SET
        total_sessions = EXCLUDED.total_sessions,
        completed_sessions = EXCLUDED.completed_sessions,
        cancelled_sessions = EXCLUDED.cancelled_sessions,
        no_show_sessions = EXCLUDED.no_show_sessions,
        completion_rate = EXCLUDED.completion_rate,
        avg_duration_minutes = EXCLUDED.avg_duration_minutes,
        total_unique_patients = EXCLUDED.total_unique_patients,
        active_therapists = EXCLUDED.active_therapists,
        avg_rating = EXCLUDED.avg_rating,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. SEED DATA FOR TESTING
-- ============================================

-- Insert sample users
INSERT INTO users (id, email, full_name, role, specialization) VALUES
    ('a1111111-1111-1111-1111-111111111111', 'admin@manas360.com', 'Admin User', 'admin', NULL),
    ('b2222222-2222-2222-2222-222222222222', 'dr.rajesh@manas360.com', 'Dr. Rajesh Kumar', 'therapist', 'CBT'),
    ('c3333333-3333-3333-3333-333333333333', 'dr.priya@manas360.com', 'Dr. Priya Sharma', 'therapist', 'DBT'),
    ('d4444444-4444-4444-4444-444444444444', 'dr.amit@manas360.com', 'Dr. Amit Singh', 'therapist', 'Mindfulness'),
    ('e5555555-5555-5555-5555-555555555555', 'patient1@gmail.com', 'Patient One', 'patient', NULL),
    ('f6666666-6666-6666-6666-666666666666', 'patient2@gmail.com', 'Patient Two', 'patient', NULL),
    ('77777777-7777-7777-7777-777777777777', 'patient3@gmail.com', 'Patient Three', 'patient', NULL);

-- Generate sample sessions for the last 90 days
INSERT INTO therapy_sessions (patient_id, therapist_id, session_type, scheduled_at, started_at, ended_at, duration_minutes, status, session_mode, rating)
SELECT 
    (ARRAY['e5555555-5555-5555-5555-555555555555', 'f6666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777'])[(random()*2+1)::int]::uuid,
    (ARRAY['b2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', 'd4444444-4444-4444-4444-444444444444'])[(random()*2+1)::int]::uuid,
    (ARRAY['CBT', 'DBT', 'Mindfulness', 'Psychotherapy', 'Counseling'])[(random()*4+1)::int],
    CURRENT_TIMESTAMP - (random() * 90 || ' days')::interval,
    CURRENT_TIMESTAMP - (random() * 90 || ' days')::interval,
    CURRENT_TIMESTAMP - (random() * 90 || ' days')::interval + interval '50 minutes',
    45 + (random() * 30)::int,
    (ARRAY['completed', 'completed', 'completed', 'completed', 'cancelled', 'no_show'])[(random()*5+1)::int],
    (ARRAY['video', 'video', 'video', 'audio', 'chat'])[(random()*4+1)::int],
    3 + (random() * 2)::int
FROM generate_series(1, 500);

-- Generate sample outcomes
INSERT INTO session_outcomes (session_id, patient_id, assessment_type, pre_score, post_score, severity_pre, severity_post, assessed_at)
SELECT 
    ts.id,
    ts.patient_id,
    (ARRAY['PHQ-9', 'GAD-7'])[(random()+1)::int],
    10 + (random() * 17)::int,
    5 + (random() * 15)::int,
    CASE WHEN random() < 0.3 THEN 'Mild' WHEN random() < 0.6 THEN 'Moderate' ELSE 'Severe' END,
    CASE WHEN random() < 0.5 THEN 'Mild' WHEN random() < 0.8 THEN 'Moderate' ELSE 'None' END,
    ts.scheduled_at
FROM therapy_sessions ts
WHERE ts.status = 'completed'
LIMIT 300;

-- ============================================
-- Done!
-- ============================================

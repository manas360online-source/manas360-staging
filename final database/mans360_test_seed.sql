
-- ═══════════════════════════════════════════════════════════════
-- MANAS360 TEST DATA SEED — Run this single file to set up everything
-- Target: PostgreSQL 15+ (Supabase / AWS RDS / Lightsail)
-- Generated: 2026-02-17
-- Usage:  psql -U mans360admin -d mans360_dev -f mans360_test_seed.sql
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────
-- 0. EXTENSIONS
-- ─────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────
-- 1. DROP EXISTING (safe for re-runs)
-- ─────────────────────────────────────
DROP TABLE IF EXISTS test_scenarios CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS cbt_session_data CASCADE;
DROP TABLE IF EXISTS patient_profiles CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS provider_credentials CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS iam_role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;
DROP TYPE IF EXISTS subscription_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS session_type CASCADE;
DROP TYPE IF EXISTS session_mode CASCADE;
DROP TYPE IF EXISTS phq9_severity CASCADE;
DROP TYPE IF EXISTS gad7_severity CASCADE;
DROP TYPE IF EXISTS payout_status CASCADE;
DROP TYPE IF EXISTS profile_status CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;

-- ─────────────────────────────────────
-- 2. ENUMS
-- ─────────────────────────────────────
CREATE TYPE user_role AS ENUM (
    'patient', 'therapist', 'psychiatrist', 'coach',
    'asha_worker', 'corporate_admin', 'ops_admin', 'super_admin',
    'referring_doctor'
);

CREATE TYPE subscription_tier AS ENUM (
    'free', 'trial', 'premium', 'corporate'
);

CREATE TYPE subscription_status AS ENUM (
    'active', 'expired', 'cancelled', 'payment_failed', 'suspended', 'pending'
);

CREATE TYPE payment_status AS ENUM (
    'paid', 'unpaid', 'overdue', 'failed', 'refunded', 'waived', 'corporate_billed'
);

CREATE TYPE session_type AS ENUM (
    'individual', 'group', 'psychiatric_consult', 'crisis', 'ivr_phq9', 'follow_up'
);

CREATE TYPE session_mode AS ENUM (
    'video', 'audio', 'chat', 'in_person', 'phone_ivr'
);

CREATE TYPE phq9_severity AS ENUM (
    'minimal', 'mild', 'moderate', 'mod_severe', 'severe', 'N/A'
);

CREATE TYPE gad7_severity AS ENUM (
    'minimal', 'mild', 'moderate', 'severe', 'N/A'
);

CREATE TYPE payout_status AS ENUM (
    'processed', 'processing', 'pending', 'held', 'failed', 'N/A'
);

CREATE TYPE profile_status AS ENUM (
    'active', 'provisional', 'suspended', 'deactivated', 'pending'
);

CREATE TYPE verification_status AS ENUM (
    'verified', 'pending', 'rejected', 'expired'
);

-- ─────────────────────────────────────
-- 3. TABLES
-- ─────────────────────────────────────

-- 3a. USERS
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY,
    role user_role NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(20),
    age INTEGER,
    city VARCHAR(100),
    state VARCHAR(100),
    language_primary VARCHAR(50),
    languages_all TEXT[],
    aadhaar_last4 VARCHAR(4),
    pan_masked VARCHAR(15),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    profile_complete_pct INTEGER DEFAULT 0 CHECK (profile_complete_pct BETWEEN 0 AND 100),
    notes TEXT,
    -- Referral System
    referred_by_doctor UUID, -- FK to doctor_profiles(id) added later
    referral_session_id VARCHAR(100),
    -- Indexes
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$' OR email = 'N/A')
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_phone ON users(phone);

-- 3b. SUBSCRIPTIONS
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    tier subscription_tier NOT NULL DEFAULT 'free',
    status subscription_status NOT NULL DEFAULT 'active',
    plan_type VARCHAR(30),  -- monthly, yearly, corporate, trial, free
    plan_price_monthly INTEGER DEFAULT 0,  -- in INR
    trial_started_at TIMESTAMP,
    trial_ends_at TIMESTAMP,
    premium_started_at TIMESTAMP,
    premium_ends_at TIMESTAMP,
    payment_method VARCHAR(100),
    payment_status payment_status DEFAULT 'unpaid',
    auto_renew BOOLEAN DEFAULT FALSE,
    last_payment_date TIMESTAMP,
    next_billing_date TIMESTAMP,
    days_remaining INTEGER DEFAULT 0,
    renewal_reminders_sent INTEGER DEFAULT 0,
    corporate_org VARCHAR(200),
    festival_free_access BOOLEAN DEFAULT FALSE,
    promo_code_used VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)  -- one active subscription per user
);

CREATE INDEX idx_subs_user ON subscriptions(user_id);
CREATE INDEX idx_subs_tier ON subscriptions(tier);
CREATE INDEX idx_subs_status ON subscriptions(status);
CREATE INDEX idx_subs_expires ON subscriptions(premium_ends_at);

-- 3c. WALLETS
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    balance INTEGER DEFAULT 0,  -- in INR
    total_earned INTEGER DEFAULT 0,
    total_withdrawn INTEGER DEFAULT 0,
    total_spent_leads INTEGER DEFAULT 0,
    pending_payout INTEGER DEFAULT 0,
    last_credit_date TIMESTAMP,
    last_debit_date TIMESTAMP,
    last_payout_date TIMESTAMP,
    payout_bank VARCHAR(100),
    payout_status payout_status DEFAULT 'N/A',
    min_payout_threshold INTEGER DEFAULT 0,
    leads_purchased_total INTEGER DEFAULT 0,
    leads_purchased_this_month INTEGER DEFAULT 0,
    session_credits_remaining INTEGER DEFAULT 0,
    bonus_credits INTEGER DEFAULT 0,
    referral_credits INTEGER DEFAULT 0,
    festival_bonus INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_wallets_balance ON wallets(balance);

-- 3d. SESSIONS (with before/after clinical data)
CREATE TABLE sessions (
    id VARCHAR(20) PRIMARY KEY,
    patient_id VARCHAR(20) REFERENCES users(id),
    patient_name VARCHAR(200),
    provider_id VARCHAR(20),  -- can be 'SYSTEM' for IVR
    provider_name VARCHAR(200),
    provider_role VARCHAR(20),
    session_date DATE NOT NULL,
    session_time TIME,
    duration_min INTEGER,
    session_type session_type NOT NULL,
    session_mode session_mode NOT NULL,
    session_number INTEGER DEFAULT 1,
    language VARCHAR(50),
    -- Pre-session assessments
    pre_phq9_score INTEGER CHECK (pre_phq9_score BETWEEN 0 AND 27),
    pre_phq9_severity phq9_severity,
    pre_gad7_score INTEGER CHECK (pre_gad7_score BETWEEN 0 AND 21),
    pre_gad7_severity gad7_severity,
    pre_mood_self_rated INTEGER CHECK (pre_mood_self_rated BETWEEN 0 AND 10),
    pre_sleep_hours NUMERIC(3,1),
    pre_energy_level INTEGER CHECK (pre_energy_level BETWEEN 0 AND 10),
    -- Post-session assessments
    post_phq9_score INTEGER CHECK (post_phq9_score BETWEEN 0 AND 27),
    post_phq9_severity phq9_severity,
    post_gad7_score INTEGER CHECK (post_gad7_score BETWEEN 0 AND 21),
    post_gad7_severity gad7_severity,
    post_mood_self_rated INTEGER CHECK (post_mood_self_rated BETWEEN 0 AND 10),
    post_sleep_hours NUMERIC(3,1),
    post_energy_level INTEGER CHECK (post_energy_level BETWEEN 0 AND 10),
    -- Calculated deltas
    phq9_delta INTEGER GENERATED ALWAYS AS (post_phq9_score - pre_phq9_score) STORED,
    gad7_delta INTEGER GENERATED ALWAYS AS (post_gad7_score - pre_gad7_score) STORED,
    mood_delta INTEGER GENERATED ALWAYS AS (post_mood_self_rated - pre_mood_self_rated) STORED,
    -- Ratings & billing
    session_rating_patient INTEGER CHECK (session_rating_patient BETWEEN 1 AND 5),
    session_rating_provider INTEGER CHECK (session_rating_provider BETWEEN 1 AND 5),
    session_fee INTEGER DEFAULT 0,
    fee_payment_status payment_status DEFAULT 'unpaid',
    provider_payout INTEGER DEFAULT 0,
    notes_summary TEXT,
    crisis_flag BOOLEAN DEFAULT FALSE,
    follow_up_scheduled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_patient ON sessions(patient_id);
CREATE INDEX idx_sessions_provider ON sessions(provider_id);
CREATE INDEX idx_sessions_date ON sessions(session_date DESC);
CREATE INDEX idx_sessions_crisis ON sessions(crisis_flag) WHERE crisis_flag = TRUE;
CREATE INDEX idx_sessions_type ON sessions(session_type);

-- 3e. PROVIDER CREDENTIALS
CREATE TABLE provider_credentials (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    qualification VARCHAR(200),
    license_type VARCHAR(50),
    license_number VARCHAR(50),
    issuing_body VARCHAR(200),
    license_status VARCHAR(20) DEFAULT 'active',
    license_expiry DATE,
    verification_status verification_status DEFAULT 'pending',
    verified_date DATE,
    specializations TEXT[],
    years_experience INTEGER,
    session_rate_min INTEGER,
    session_rate_max INTEGER,
    rating_avg NUMERIC(3,1) DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_patients INTEGER DEFAULT 0,
    completion_rate_pct NUMERIC(5,2) DEFAULT 0,
    no_show_rate_pct NUMERIC(5,2) DEFAULT 0,
    contract_signed BOOLEAN DEFAULT FALSE,
    contract_date DATE,
    insurance_valid BOOLEAN DEFAULT FALSE,
    background_check BOOLEAN DEFAULT FALSE,
    training_complete BOOLEAN DEFAULT FALSE,
    profile_status profile_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX idx_creds_user ON provider_credentials(user_id);
CREATE INDEX idx_creds_status ON provider_credentials(profile_status);
CREATE INDEX idx_creds_verification ON provider_credentials(verification_status);

-- 3f. IAM PERMISSIONS (normalized)
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    feature VARCHAR(200) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE iam_role_permissions (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    permission_id INTEGER REFERENCES permissions(id),
    access_level VARCHAR(50) NOT NULL,  -- 'full', 'none', 'conditional'
    condition_desc TEXT,  -- describes the condition if access_level='conditional'
    UNIQUE(role, permission_id)
);

-- 3g. PATIENT PROFILES
CREATE TABLE patient_profiles (
    user_id VARCHAR(20) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    medical_history TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    goals TEXT,
    medications TEXT,
    family_history TEXT,
    lifestyle_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3h. CBT SESSION DATA
CREATE TABLE cbt_session_data (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(20) REFERENCES sessions(id) ON DELETE CASCADE,
    worksheet_type VARCHAR(50), -- 'thought_record', 'activity_log', 'safety_plan', 'behavioral_experiment'
    data JSONB,
    therapist_notes TEXT,
    patient_visibility BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_cbt_session ON cbt_session_data(session_id);

-- 3i. ASSESSMENTS (Standalone / Historical)
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    assessment_type VARCHAR(50) NOT NULL, -- 'PHQ-9', 'GAD-7', 'BDI', 'K-10'
    score INTEGER,
    severity VARCHAR(50),
    answers JSONB,
    taken_at TIMESTAMP DEFAULT NOW(),
    next_due_date DATE,
    referral_id UUID
);
CREATE INDEX idx_assessments_user ON assessments(user_id);

-- 3j. CERTIFICATES
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    certificate_type VARCHAR(50), -- 'course_completion', 'workshop', 'therapy_milestone'
    title VARCHAR(200),
    issued_at TIMESTAMP DEFAULT NOW(),
    certificate_url VARCHAR(255),
    verification_code VARCHAR(50) UNIQUE
);
CREATE INDEX idx_certificates_user ON certificates(user_id);

-- 3k. LEADS (Matching System)
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'accepted', 'rejected', 'expired', 'completed'
    therapist_id VARCHAR(20) REFERENCES users(id),
    match_score INTEGER, -- 0-100 compatibility
    requirements TEXT,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    accepted_at TIMESTAMP
);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_therapist ON leads(therapist_id);

-- 3l. WALLET TRANSACTIONS
CREATE TABLE wallet_transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- 'credit', 'debit'
    category VARCHAR(50), -- 'session_fee', 'payout', 'refund', 'topup', 'referral_bonus'
    status VARCHAR(20) DEFAULT 'success',
    reference_id VARCHAR(100), -- external payment ID or session ID
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX idx_transactions_created ON wallet_transactions(created_at DESC);

-- 3m. AUDIT LOGS
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20), -- Nullable in case of system actions or deleted users
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(50),
    ip_address VARCHAR(45),
    changes JSONB,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- 3n. DOCTOR PROFILES & REFERRALS
CREATE TABLE doctor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional info
    doctor_code VARCHAR(20) UNIQUE NOT NULL,  -- DR-KA-0042
    full_name VARCHAR(255) NOT NULL,
    credentials VARCHAR(255),                  -- MBBS, MD, etc.
    registration_number VARCHAR(50),           -- MCI/State council number
    registration_council VARCHAR(100),         -- Karnataka Medical Council
    specialization VARCHAR(100),               -- General Physician, Cardiologist
    hospital_clinic VARCHAR(255),
    
    -- Location
    city VARCHAR(100),
    state VARCHAR(50),
    pincode VARCHAR(10),
    
    -- Contact
    clinic_phone VARCHAR(20),
    clinic_email VARCHAR(255),
    
    -- Experience
    experience_years INT,
    photo_url VARCHAR(500),
    
    -- Verification
    verification_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (verification_status IN ('pending', 'verified', 'rejected', 'suspended')),
    verified_at TIMESTAMP,
    verified_by VARCHAR(20) REFERENCES users(id),
    rejection_reason TEXT,
    
    -- Documents
    registration_doc_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    
    -- QR & Referral
    referral_url VARCHAR(255),
    qr_code_url VARCHAR(500),
    qr_generated_at TIMESTAMP,
    
    -- Preferences
    notify_on_referral BOOLEAN DEFAULT TRUE,
    notification_method VARCHAR(20) DEFAULT 'whatsapp',
    
    -- Tier
    referral_tier VARCHAR(20) DEFAULT 'bronze'
        CHECK (referral_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id),
    UNIQUE(registration_number, registration_council)
);
CREATE INDEX idx_doctor_profiles_code ON doctor_profiles(doctor_code);

CREATE TABLE doctor_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE SET NULL,
    doctor_code VARCHAR(20),
    session_id VARCHAR(100) NOT NULL,
    scan_timestamp TIMESTAMP DEFAULT NOW(),
    device_type VARCHAR(50),
    city VARCHAR(100),
    state VARCHAR(50),
    
    -- Funnel
    signup_completed_at TIMESTAMP,
    patient_id VARCHAR(20) REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(30) DEFAULT 'scanned',
    
    -- Subscription
    subscription_tier VARCHAR(20),
    subscription_amount DECIMAL(10,2),
    
    -- Value
    lifetime_value DECIMAL(10,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_doctor_referrals_doctor ON doctor_referrals(doctor_id);

CREATE TABLE doctor_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES doctor_referrals(id) ON DELETE SET NULL,
    credits INT NOT NULL,
    credit_type VARCHAR(30) NOT NULL,
    base_credits INT,
    multiplier DECIMAL(3,2) DEFAULT 1.0,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctor_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    credits_redeemed INT NOT NULL,
    reward_type VARCHAR(50) NOT NULL,
    reward_value VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE doctor_asset_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctor_profiles(id) ON DELETE CASCADE,
    order_number VARCHAR(20) UNIQUE,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2),
    shipping_city VARCHAR(100),
    fulfillment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fact_qr_tracking (
    id SERIAL PRIMARY KEY,
    qr_id VARCHAR(50),
    doctor_id UUID REFERENCES doctor_profiles(id),
    doctor_code VARCHAR(20),
    scan_time TIMESTAMP DEFAULT NOW(),
    location VARCHAR(100),
    device VARCHAR(100),
    conversion_status VARCHAR(50)
);

ALTER TABLE assessments ADD CONSTRAINT fk_referral FOREIGN KEY (referral_id) REFERENCES doctor_referrals(id);

-- ─────────────────────────────────────
-- 4. SEED DATA — USERS
-- ─────────────────────────────────────

INSERT INTO users (id, role, first_name, last_name, email, phone, gender, age, city, state, language_primary, languages_all, aadhaar_last4, pan_masked, created_at, last_login, is_active, is_verified, profile_complete_pct, notes) VALUES
-- Patients
('USR-PAT-001','patient','Priya','Sharma','priya.sharma@gmail.com','+919876543210','Female',28,'Bengaluru','Karnataka','Kannada',ARRAY['Kannada','English','Hindi'],'4521','ABCPS****K','2025-11-19','2026-02-17 08:00',TRUE,TRUE,100,'Premium active. 12 sessions completed. High engagement.'),
('USR-PAT-002','patient','Rahul','Verma','rahul.v@outlook.com','+919812345678','Male',34,'Delhi','Delhi','Hindi',ARRAY['Hindi','English'],'7832','BCDPV****J','2026-01-03','2026-02-17 04:00',TRUE,TRUE,95,'Trial user. Day 25 of 30. High conversion candidate.'),
('USR-PAT-003','patient','Meena','Krishnan','meena.k@yahoo.com','+919845678901','Female',41,'Chennai','Tamil Nadu','Tamil',ARRAY['Tamil','English'],'3156','CDEFK****M','2025-10-19','2026-02-02 08:00',TRUE,TRUE,85,'Premium expired 15 days ago. Win-back target.'),
('USR-PAT-004','patient','Arjun','Patil','arjun.p@gmail.com','+919823456789','Male',22,'Dharwad','Karnataka','Kannada',ARRAY['Kannada','Hindi','English'],'9045','DEFGP****L','2026-02-07','2026-02-17 09:00',TRUE,TRUE,70,'Free tier. GenZ. Came via Instagram. Incomplete profile.'),
('USR-PAT-005','patient','Fatima','Begum','fatima.b@gmail.com','+919867891234','Female',55,'Hyderabad','Telangana','Telugu',ARRAY['Telugu','Hindi','Urdu'],'6789','EFGHB****N','2025-08-01','2026-01-03 08:00',FALSE,TRUE,90,'Cancelled subscription. Churned. 6 sessions total.'),
('USR-PAT-006','patient','Vikram','Joshi','vikram.j@techcorp.com','+919834567890','Male',31,'Bengaluru','Karnataka','English',ARRAY['English','Hindi','Marathi'],'2345','FGHIJ****P','2025-12-18','2026-02-17 02:00',TRUE,TRUE,100,'Corporate (TechCorp). Premium via employer. Shift worker.'),
('USR-PAT-007','patient','Deepa','Nair','deepa.n@gmail.com','+919856789012','Female',19,'Kochi','Kerala','Malayalam',ARRAY['Malayalam','English'],'8901','GHIJK****Q','2026-02-12','2026-02-17 07:00',TRUE,FALSE,40,'New signup. Trial Day 5. Incomplete onboarding. Student.'),
('USR-PAT-008','patient','Suresh','Reddy','suresh.r@gmail.com','+919878901234','Male',47,'Visakhapatnam','Andhra Pradesh','Telugu',ARRAY['Telugu','English'],'5678','HIJKL****R','2026-01-17','2026-02-16 16:00',TRUE,TRUE,95,'Premium. Payment failed on last renewal. Grace period active.'),
('USR-PAT-009','patient','Anjali','Gupta','anjali.g@gmail.com','+919889012345','Female',36,'Mumbai','Maharashtra','Hindi',ARRAY['Hindi','English','Marathi'],'1234','IJKLM****S','2025-02-17','2026-02-17 02:00',TRUE,TRUE,100,'Long-term premium. 48 sessions. Power user. Referred 3 friends.'),
('USR-PAT-010','patient','Karthik','Sundaram','karthik.s@gmail.com','+919890123456','Male',25,'Trichy','Tamil Nadu','Tamil',ARRAY['Tamil','English'],'0123','JKLMN****T','2026-02-14','2026-02-17 09:30',TRUE,TRUE,60,'Free. Chai pe Charcha van. Rural. Feature phone IVR user.'),
-- Therapists
('USR-THR-001','therapist','Dr. Lakshmi','Iyer','lakshmi.iyer@gmail.com','+919801234567','Female',38,'Bengaluru','Karnataka','English',ARRAY['English','Kannada','Tamil'],'3456','KLMNP****U','2025-08-17','2026-02-17 09:00',TRUE,TRUE,100,'Active. RCI licensed. CBT specialist. 120+ sessions. Top rated.'),
('USR-THR-002','therapist','Dr. Anil','Kumar','anil.kumar.therapy@gmail.com','+919812345670','Male',45,'Delhi','Delhi','Hindi',ARRAY['Hindi','English','Punjabi'],'6789','LMNOP****V','2025-11-19','2026-02-14 08:00',TRUE,TRUE,100,'Active. M.Phil Clinical Psych. Trauma + PTSD. 60 sessions.'),
('USR-THR-003','therapist','Neha','Patel','neha.p.counselor@gmail.com','+919823456780','Female',29,'Ahmedabad','Gujarat','Gujarati',ARRAY['Gujarati','Hindi','English'],'9012','MNOPQ****W','2026-01-28','2026-02-17 04:00',TRUE,FALSE,75,'Provisional. Pending license verification. Training incomplete.'),
('USR-THR-004','therapist','Dr. Rajesh','Menon','rajesh.m@gmail.com','+919834567891','Male',52,'Kochi','Kerala','Malayalam',ARRAY['Malayalam','English','Tamil'],'2345','NOPQR****X','2025-04-17','2026-01-18 08:00',FALSE,TRUE,100,'Suspended. Patient complaint under review. 200+ sessions historically.'),
('USR-THR-005','therapist','Sunita','Deshmukh','sunita.d@gmail.com','+919845678902','Female',33,'Pune','Maharashtra','Marathi',ARRAY['Marathi','Hindi','English'],'5678','OPQRS****Y','2026-02-10','2026-02-17 08:00',TRUE,TRUE,90,'New. Just completed onboarding. 0 sessions yet.'),
-- Psychiatrists
('USR-PSY-001','psychiatrist','Dr. Sindhuja','Rao','sindhuja.rao@dimhans.org','+919856789013','Female',48,'Dharwad','Karnataka','Kannada',ARRAY['Kannada','English','Hindi'],'8901','PQRST****Z','2025-09-17','2026-02-17 06:00',TRUE,TRUE,100,'Clinical Advisory Board Chair. DIMHANS. MD Psychiatry. 80 prescriptions.'),
('USR-PSY-002','psychiatrist','Dr. Amit','Sinha','amit.sinha.psych@gmail.com','+919867890124','Male',42,'Bengaluru','Karnataka','English',ARRAY['English','Hindi','Bengali'],'1234','QRSTU****A','2025-12-18','2026-02-15 08:00',TRUE,TRUE,100,'Active. NIMHANS trained. 30 prescriptions. Telepsychiatry.'),
-- Coaches
('USR-COA-001','coach','Ravi','Shankar','ravi.coach@mans360.com','+919878901235','Male',27,'Bengaluru','Karnataka','Kannada',ARRAY['Kannada','English','Hindi'],'4567','RSTUV****B','2025-11-09','2026-02-17 09:00',TRUE,TRUE,100,'Senior coach. Certified. 200+ onboardings.'),
('USR-COA-002','coach','Divya','Mohan','divya.coach@mans360.com','+919889012346','Female',24,'Dharwad','Karnataka','Kannada',ARRAY['Kannada','Hindi'],'7890','STUVW****C','2026-01-18','2026-02-17 05:00',TRUE,TRUE,85,'New coach. 15 onboardings so far. Dharwad region.'),
-- ASHA Workers
('USR-ASH-001','asha_worker','Savitri','Gowda','N/A','+919890123457','Female',35,'Dharwad Rural','Karnataka','Kannada',ARRAY['Kannada'],'0123','N/A','2025-12-18','2026-02-10 08:00',TRUE,TRUE,70,'5Why certified. Referred 8 patients. Feature phone.'),
('USR-ASH-002','asha_worker','Lakshmi','Devi','N/A','+919801234568','Female',42,'Trichy Rural','Tamil Nadu','Tamil',ARRAY['Tamil'],'3456','N/A','2026-01-03','2026-02-03 08:00',TRUE,FALSE,50,'Training in progress. 5Why quiz not passed yet.'),
-- Corporate Admin
('USR-COR-001','corporate_admin','Anand','Pillai','anand.pillai@techcorp.com','+919812345679','Male',39,'Bengaluru','Karnataka','English',ARRAY['English','Malayalam','Hindi'],'6789','TUVWX****D','2025-12-18','2026-02-16 08:00',TRUE,TRUE,100,'TechCorp HR Head. 50-seat corporate plan.'),
-- Platform Admins
('USR-ADM-001','super_admin','Mahan','Founder','mahan@mans360.com','+919823456781','Male',35,'Bengaluru','Karnataka','English',ARRAY['English','Kannada','Hindi'],'9012','UVWXY****E','2025-01-13','2026-02-17 09:50',TRUE,TRUE,100,'Founder. Super admin. All access.'),
('USR-ADM-002','ops_admin','Kavitha','Ramesh','kavitha@mans360.com','+919834567892','Female',30,'Bengaluru','Karnataka','English',ARRAY['English','Kannada','Tamil'],'2345','VWXYZ****F','2025-08-01','2026-02-17 07:00',TRUE,TRUE,100,'Operations admin. Manages onboarding, support, content.'),
('USR-DOC-001','referring_doctor','Dr. Rajesh','Gupta','rajesh.gp@gmail.com','+919988776655','Male',50,'Bengaluru','Karnataka','English',ARRAY['English','Kannada'],'9988','DOCPAN****X','2025-10-10','2026-02-18 09:00',TRUE,TRUE,100,'General Physician. High volume referrer.');

-- ─────────────────────────────────────
-- 5. SEED DATA — SUBSCRIPTIONS
-- ─────────────────────────────────────

INSERT INTO subscriptions (user_id, tier, status, plan_type, plan_price_monthly, trial_started_at, trial_ends_at, premium_started_at, premium_ends_at, payment_method, payment_status, auto_renew, last_payment_date, next_billing_date, days_remaining, renewal_reminders_sent, corporate_org, festival_free_access, promo_code_used, notes) VALUES
('USR-PAT-001','premium','active','monthly',299,'2025-11-19','2025-12-19','2025-12-19','2026-03-02','UPI (PhonePe)','paid',TRUE,'2026-01-17','2026-03-02',13,0,'',FALSE,'WELCOME50','Standard premium. Auto-renewing.'),
('USR-PAT-002','trial','active','trial',0,'2026-01-23','2026-02-22',NULL,NULL,'','unpaid',FALSE,NULL,NULL,5,1,'',FALSE,'','Trial day 25. Upgrade nudge pending.'),
('USR-PAT-003','premium','expired','monthly',299,'2025-10-19','2025-11-19','2025-11-19','2026-02-02','Credit Card','overdue',TRUE,'2026-01-02',NULL,0,3,'',FALSE,'','Expired. 3 reminders sent. Payment failed.'),
('USR-PAT-004','free','active','free',0,'2026-02-07','2026-03-09',NULL,NULL,'','unpaid',FALSE,NULL,NULL,0,0,'',FALSE,'','Free tier. Never started trial.'),
('USR-PAT-005','premium','cancelled','monthly',299,'2025-08-01','2025-08-31','2025-08-31','2026-01-03','UPI (GPay)','refunded',FALSE,'2025-12-03',NULL,0,0,'',FALSE,'','Cancelled by user. Win-back candidate.'),
('USR-PAT-006','corporate','active','corporate',0,'2025-12-18','2026-01-17','2026-01-17','2026-04-01','Corporate billing','corporate_billed',TRUE,'2026-01-17','2026-04-01',43,0,'TechCorp (USR-COR-001)',FALSE,'','Corporate seat. Employer pays.'),
('USR-PAT-007','trial','active','trial',0,'2026-02-12','2026-03-14',NULL,NULL,'','unpaid',FALSE,NULL,NULL,25,0,'',FALSE,'','Trial day 5. Onboarding incomplete.'),
('USR-PAT-008','premium','payment_failed','monthly',299,'2025-12-18','2026-01-17','2026-01-17','2026-02-17','UPI (PhonePe)','failed',TRUE,'2026-01-17','2026-02-17',0,2,'',FALSE,'','Payment failed today. Grace period 3 days.'),
('USR-PAT-009','premium','active','yearly',2999,'2025-02-17','2025-03-17','2025-03-17','2026-03-17','Credit Card','paid',TRUE,'2025-03-17','2026-03-17',28,0,'',FALSE,'ANNUAL20','Yearly subscriber. Power user.'),
('USR-PAT-010','free','active','free',0,NULL,NULL,NULL,NULL,'','unpaid',FALSE,NULL,NULL,0,0,'',TRUE,'','Free. Festival free ON (Pongal). IVR-only.'),
-- Therapists
('USR-THR-001','premium','active','monthly',499,NULL,NULL,'2025-08-17','2026-04-06','UPI','paid',TRUE,'2026-01-17','2026-04-06',48,0,'',FALSE,'','Profile boosted. Auto-lead matching.'),
('USR-THR-002','trial','active','trial',0,'2025-11-19','2025-12-19',NULL,NULL,'','unpaid',FALSE,NULL,NULL,0,0,'',FALSE,'','Trial expired. Using free features.'),
('USR-THR-003','free','pending','free',0,NULL,NULL,NULL,NULL,'','unpaid',FALSE,NULL,NULL,0,0,'',FALSE,'','Provisional. Onboarding not complete.'),
('USR-THR-004','premium','suspended','monthly',499,NULL,NULL,'2025-04-01','2026-03-01','Credit Card','paid',TRUE,'2026-02-01',NULL,0,0,'',FALSE,'','Suspended. Under review.'),
('USR-THR-005','trial','active','trial',0,'2026-02-10','2026-03-12',NULL,NULL,'','unpaid',FALSE,NULL,NULL,23,0,'',FALSE,'NEWTHERAPIST','New therapist. Trial day 7.'),
-- Psychiatrists
('USR-PSY-001','premium','active','yearly',4999,NULL,NULL,'2025-09-17','2026-08-16','Bank Transfer','paid',TRUE,'2025-09-17','2026-08-16',180,0,'',FALSE,'','Advisory board. Special rate.'),
('USR-PSY-002','premium','active','monthly',499,NULL,NULL,'2025-12-17','2026-04-06','UPI','paid',TRUE,'2026-01-17','2026-04-06',48,0,'',FALSE,'','Standard plan.');

-- ─────────────────────────────────────
-- 6. SEED DATA — WALLETS
-- ─────────────────────────────────────

INSERT INTO wallets (user_id, balance, total_earned, total_withdrawn, total_spent_leads, pending_payout, last_credit_date, last_debit_date, last_payout_date, payout_bank, payout_status, min_payout_threshold, leads_purchased_total, leads_purchased_this_month, session_credits_remaining, bonus_credits, referral_credits, festival_bonus, notes) VALUES
('USR-PAT-001',150,0,0,0,0,'2026-02-10','2026-02-15',NULL,'','N/A',0,0,0,2,0,150,0,'Referral credit from inviting friend.'),
('USR-PAT-002',0,0,0,0,0,NULL,NULL,NULL,'','N/A',0,0,0,0,0,0,0,'Trial user. No wallet activity.'),
('USR-PAT-003',50,0,0,0,0,'2025-12-25','2026-01-15',NULL,'','N/A',0,0,0,0,50,0,0,'Leftover Diwali promo credit.'),
('USR-PAT-006',500,500,0,0,0,'2026-02-01',NULL,NULL,'','N/A',0,0,0,5,500,0,0,'Corporate credits. 5 sessions pre-loaded.'),
('USR-PAT-009',450,600,0,0,0,'2026-02-10','2026-02-05',NULL,'','N/A',0,0,0,3,0,450,0,'Power referrer. 3 friends = 450 credit.'),
('USR-PAT-010',0,0,0,0,0,NULL,NULL,NULL,'','N/A',0,0,0,0,0,0,0,'Free/IVR user. No wallet.'),
-- Therapists
('USR-THR-001',18500,85000,62000,4500,3500,'2026-02-16','2026-02-14','2026-02-10','HDFC ****4521','processed',500,35,8,0,0,0,0,'Top earner. Regular payouts.'),
('USR-THR-002',8200,32000,20000,3800,2500,'2026-02-14','2026-02-13','2026-02-01','SBI ****7832','processed',500,22,5,0,0,0,0,'Steady earner. Monthly payouts.'),
('USR-THR-003',0,0,0,0,0,NULL,NULL,NULL,'ICICI ****9012','pending',500,0,0,0,0,0,0,'New. No earnings yet.'),
('USR-THR-004',12000,95000,83000,0,0,'2026-01-15',NULL,'2026-01-10','Federal ****2345','held',500,0,0,0,0,0,0,'SUSPENDED. Payout frozen.'),
('USR-THR-005',0,0,0,0,0,NULL,NULL,NULL,'Kotak ****5678','pending',500,0,0,0,0,0,0,'Just onboarded. Zero activity.'),
-- Psychiatrists
('USR-PSY-001',22000,120000,98000,0,5000,'2026-02-15',NULL,'2026-02-05','Canara ****8901','processed',1000,0,0,0,0,0,0,'High earner. Advisory fee separate.'),
('USR-PSY-002',6500,18000,11500,0,2000,'2026-02-13',NULL,'2026-02-01','Axis ****1234','processing',1000,0,0,0,0,0,0,'Growing. Payout processing.');

-- ─────────────────────────────────────
-- 7. SEED DATA — SESSIONS (Before/After)
-- ─────────────────────────────────────

INSERT INTO sessions (id, patient_id, patient_name, provider_id, provider_name, provider_role, session_date, session_time, duration_min, session_type, session_mode, session_number, language, pre_phq9_score, pre_phq9_severity, pre_gad7_score, pre_gad7_severity, pre_mood_self_rated, pre_sleep_hours, pre_energy_level, post_phq9_score, post_phq9_severity, post_gad7_score, post_gad7_severity, post_mood_self_rated, post_sleep_hours, post_energy_level, session_rating_patient, session_rating_provider, session_fee, fee_payment_status, provider_payout, notes_summary, crisis_flag, follow_up_scheduled) VALUES
-- Priya: 4 sessions showing improvement arc (18 → 5)
('SES-001','USR-PAT-001','Priya Sharma','USR-THR-001','Dr. Lakshmi Iyer','therapist','2025-12-02','10:00',50,'individual','video',1,'English',18,'mod_severe',15,'severe',3,4,2,18,'mod_severe',14,'moderate',4,4,3,4,4,800,'paid',680,'Initial intake. Severe anxiety + moderate depression. CBT plan started.',FALSE,TRUE),
('SES-002','USR-PAT-001','Priya Sharma','USR-THR-001','Dr. Lakshmi Iyer','therapist','2025-12-09','10:00',50,'individual','video',2,'English',17,'mod_severe',14,'moderate',3,5,3,16,'mod_severe',12,'moderate',4,5,3,5,4,800,'paid',680,'Thought record introduced. Sleep improving.',FALSE,TRUE),
('SES-006','USR-PAT-001','Priya Sharma','USR-THR-001','Dr. Lakshmi Iyer','therapist','2026-01-06','10:00',50,'individual','video',6,'English',12,'moderate',10,'moderate',5,6,5,10,'moderate',8,'mild',6,7,6,5,5,800,'paid',680,'Mid-treatment. Significant improvement. Behavioral activation working.',FALSE,TRUE),
('SES-012','USR-PAT-001','Priya Sharma','USR-THR-001','Dr. Lakshmi Iyer','therapist','2026-02-10','10:00',50,'individual','video',12,'English',6,'mild',5,'mild',7,7,7,5,'mild',4,'minimal',8,7.5,8,5,5,800,'paid',680,'Near end of acute phase. PHQ-9 18→5. Remarkable progress.',FALSE,TRUE),
-- Rahul: Trial user, 2 sessions
('SES-013','USR-PAT-002','Rahul Verma','USR-THR-002','Dr. Anil Kumar','therapist','2026-01-28','18:00',45,'individual','video',1,'Hindi',14,'moderate',11,'moderate',4,5,3,13,'moderate',10,'moderate',5,5,4,4,4,600,'paid',510,'First session. Work stress. Hindi-medium.',FALSE,TRUE),
('SES-014','USR-PAT-002','Rahul Verma','USR-THR-002','Dr. Anil Kumar','therapist','2026-02-04','18:00',45,'individual','video',2,'Hindi',13,'moderate',10,'moderate',5,5,4,11,'moderate',8,'mild',6,6,5,5,4,600,'paid',510,'Second session. Improving. Premium conversion candidate.',FALSE,TRUE),
-- Meena: Last session before expiry
('SES-015','USR-PAT-003','Meena Krishnan','USR-THR-001','Dr. Lakshmi Iyer','therapist','2026-01-20','14:00',50,'individual','video',6,'Tamil',9,'mild',7,'mild',6,6,6,8,'mild',6,'mild',7,7,7,4,5,800,'paid',680,'Last session before expiry. Risk of regression.',FALSE,FALSE),
-- Vikram: Corporate + psychiatry
('SES-016','USR-PAT-006','Vikram Joshi','USR-PSY-001','Dr. Sindhuja Rao','psychiatrist','2026-02-05','11:00',30,'psychiatric_consult','video',1,'English',16,'mod_severe',13,'moderate',3,3,2,16,'mod_severe',13,'moderate',4,3,3,5,5,1500,'corporate_billed',1275,'Psychiatric eval. Escitalopram 10mg + Zolpidem 5mg PRN prescribed.',FALSE,TRUE),
('SES-017','USR-PAT-006','Vikram Joshi','USR-THR-001','Dr. Lakshmi Iyer','therapist','2026-02-12','18:30',50,'individual','video',1,'English',15,'mod_severe',12,'moderate',4,4,3,13,'moderate',10,'moderate',5,5,4,5,5,800,'corporate_billed',680,'Therapy alongside medication. CBT for insomnia.',FALSE,TRUE),
-- Anjali: Group session (power user)
('SES-048','USR-PAT-009','Anjali Gupta','USR-THR-002','Dr. Anil Kumar','therapist','2026-02-07','16:00',90,'group','video',48,'Hindi',4,'minimal',3,'minimal',8,7,8,3,'minimal',2,'minimal',9,7.5,9,5,5,400,'paid',340,'Group session. Maintenance phase. Peer support leader.',FALSE,TRUE),
-- Karthik: IVR screening
('SES-IVR-001','USR-PAT-010','Karthik Sundaram','SYSTEM','IVR Automated','system','2026-02-14','08:30',8,'ivr_phq9','phone_ivr',1,'Tamil',16,'mod_severe',0,'N/A',3,0,0,0,'N/A',0,'N/A',0,0,0,NULL,NULL,0,'waived',0,'IVR PHQ-9 screening. Score 16 = mod-severe. Auto-referred.',FALSE,TRUE),
-- Suresh: Payment failed mid-treatment
('SES-019','USR-PAT-008','Suresh Reddy','USR-THR-002','Dr. Anil Kumar','therapist','2026-02-10','09:00',50,'individual','video',4,'Telugu',11,'moderate',9,'mild',5,6,5,9,'mild',7,'mild',6,6.5,6,5,4,600,'paid',510,'Good progress. Payment fails tomorrow. Needs retention.',FALSE,TRUE),
-- Arjun: CRISIS
('SES-020','USR-PAT-004','Arjun Patil','USR-THR-001','Dr. Lakshmi Iyer','therapist','2026-02-15','20:00',60,'crisis','video',1,'Kannada',22,'severe',18,'severe',1,3,1,20,'severe',16,'severe',3,3,2,5,5,0,'waived',0,'CRISIS. Suicidal ideation. Safety plan created. Family contacted.',TRUE,TRUE);

-- ─────────────────────────────────────
-- 8. SEED DATA — PROVIDER CREDENTIALS
-- ─────────────────────────────────────

INSERT INTO provider_credentials (user_id, role, qualification, license_type, license_number, issuing_body, license_status, license_expiry, verification_status, verified_date, specializations, years_experience, session_rate_min, session_rate_max, rating_avg, total_sessions, total_patients, completion_rate_pct, no_show_rate_pct, contract_signed, contract_date, insurance_valid, background_check, training_complete, profile_status, notes) VALUES
('USR-THR-001','therapist','M.Phil Clinical Psychology','RCI','A12345','Rehabilitation Council of India','active','2027-06-30','verified','2025-08-20',ARRAY['CBT','Anxiety','Depression','OCD'],12,700,1200,4.8,120,45,96.0,3.0,TRUE,'2025-08-17',TRUE,TRUE,TRUE,'active','Top-rated. Consistently high outcomes.'),
('USR-THR-002','therapist','M.Phil Clinical Psychology','RCI','A23456','Rehabilitation Council of India','active','2026-12-31','verified','2025-11-25',ARRAY['Trauma','PTSD','Grief','Hindi-medium'],18,500,900,4.5,60,28,92.0,5.0,TRUE,'2025-11-20',TRUE,TRUE,TRUE,'active','Strong Hindi-medium. Delhi-based.'),
('USR-THR-003','therapist','M.Sc Counseling Psychology','State Council','GJ-CP-789','Gujarat State Council','active','2027-03-31','pending',NULL,ARRAY['Relationship counseling','Youth','Gujarati-medium'],3,400,600,0,0,0,0,0,FALSE,NULL,FALSE,FALSE,FALSE,'provisional','License verification in progress.'),
('USR-THR-004','therapist','PhD Clinical Psychology','RCI','A34567','Rehabilitation Council of India','active','2027-09-30','verified','2025-04-05',ARRAY['Addiction','CBT','Family therapy'],25,800,1500,4.2,200,85,88.0,8.0,TRUE,'2025-04-01',TRUE,TRUE,TRUE,'suspended','Under review. Complaint filed 2026-01-15.'),
('USR-THR-005','therapist','M.A. Psychology + PG Diploma Counseling','State Council','MH-CP-456','Maharashtra State Council','active','2028-01-31','verified','2026-02-08',ARRAY['Youth','Academic stress','Marathi-medium'],5,400,700,0,0,0,0,0,TRUE,'2026-02-09',TRUE,TRUE,TRUE,'active','Newly onboarded. Ready for patients.'),
('USR-PSY-001','psychiatrist','MD Psychiatry','NMC (MCI)','KA-PSY-12345','National Medical Commission','active','2027-12-31','verified','2025-09-10',ARRAY['Depression','Anxiety','Bipolar','Pharmacotherapy'],22,1200,2000,4.9,80,60,98.0,1.0,TRUE,'2025-09-15',TRUE,TRUE,TRUE,'active','Advisory board chair. DIMHANS. 2% equity.'),
('USR-PSY-002','psychiatrist','MD Psychiatry','NMC (MCI)','KA-PSY-23456','National Medical Commission','active','2028-06-30','verified','2025-12-20',ARRAY['Depression','Anxiety','OCD','Telepsychiatry'],15,1000,1800,4.6,30,22,95.0,3.0,TRUE,'2025-12-18',TRUE,TRUE,TRUE,'active','NIMHANS trained. Telepsychiatry focus.');

-- ─────────────────────────────────────
-- 8b. SEED DATA — NEW TABLES
-- ─────────────────────────────────────

-- Patient Profiles
INSERT INTO patient_profiles (user_id, medical_history, emergency_contact_name, emergency_contact_phone, goals, medications) VALUES
('USR-PAT-001', 'Hypertension, diagnosed 2023.', 'Rohan Sharma', '+919999999999', 'Reduce anxiety, improve sleep quality.', 'Amlodipine 5mg'),
('USR-PAT-006', 'Insomnia, chronic back pain.', 'Sarah Joshi', '+918888888888', 'Better sleep hygiene, stress management.', 'Zolpidem 5mg PRN'),
('USR-PAT-004', 'None reported.', 'Father', '+917777777777', 'Manage study stress.', 'None');

-- CBT Session Data
INSERT INTO cbt_session_data (session_id, worksheet_type, data, therapist_notes) VALUES
('SES-002', 'thought_record', '{"trigger": "Meeting boss", "auto_thought": "He will fire me", "emotion": "Fear 90%", "rational_response": "He praised me last week", "outcome": "Fear 40%"}', 'Patient grasped the concept well.'),
('SES-006', 'activity_log', '{"activities": ["Walk", "Reading", "Cooking"], "pleasure_rating": [8, 9, 7], "mastery_rating": [5, 6, 8]}', 'Behavioral activation showing positive results.');

-- Assessments (Historical)
INSERT INTO assessments (user_id, assessment_type, score, severity, taken_at, answers) VALUES
('USR-PAT-001', 'PHQ-9', 20, 'severe', '2025-11-20 10:00:00', '{"q1":3,"q2":3,"q9":1}'),
('USR-PAT-001', 'GAD-7', 18, 'severe', '2025-11-20 10:15:00', '{"q1":3,"q2":3}'),
('USR-PAT-006', 'PHQ-9', 16, 'mod_severe', '2026-02-01 09:00:00', '{"q1":2,"q2":3}');

-- Certificates
INSERT INTO certificates (user_id, certificate_type, title, certificate_url) VALUES
('USR-THR-001', 'course_completion', 'Advanced CBT for Trauma', 'https://certs.mans360.com/cbt-adv-001'),
('USR-PAT-001', 'therapy_milestone', 'Anxiety Management Program Completed', 'https://certs.mans360.com/milestone-pat-001');

-- Leads
INSERT INTO leads (patient_id, status, therapist_id, match_score, requirements, created_at) VALUES
('USR-PAT-007', 'open', NULL, NULL, 'Female therapist, Malayalam speaking, anxiety focus', '2026-02-12 10:00:00'),
('USR-PAT-002', 'accepted', 'USR-THR-002', 95, 'Hindi speaking, male, evening slots', '2026-01-25 14:00:00'),
('USR-PAT-003', 'expired', NULL, NULL, 'Tamil speaking, low cost', '2025-10-15 09:00:00');

-- Wallet Transactions
INSERT INTO wallet_transactions (wallet_id, amount, transaction_type, category, status, description, created_at) VALUES
((SELECT id FROM wallets WHERE user_id='USR-THR-001'), 3500, 'debit', 'payout', 'success', 'Weekly payout processed', '2026-02-14 10:00:00'),
((SELECT id FROM wallets WHERE user_id='USR-THR-001'), 680, 'credit', 'session_fee', 'success', 'Session SES-012 fee', '2026-02-10 11:00:00'),
((SELECT id FROM wallets WHERE user_id='USR-PAT-001'), 150, 'credit', 'referral_bonus', 'success', 'Referral bonus: Friend joined', '2026-02-10 09:00:00');

-- Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, changes) VALUES
('USR-ADM-001', 'update_user', 'users', 'USR-THR-004', '192.168.1.50', '{"is_active": false, "reason": "suspension"}'),
('USR-PAT-001', 'login', 'auth', 'USR-PAT-001', '10.0.0.5', NULL);

-- Doctor Profiles
INSERT INTO doctor_profiles (user_id, doctor_code, full_name, credentials, registration_number, registration_council, specialization, city, state, verification_status, referral_tier) VALUES
('USR-DOC-001', 'DR-KA-0001', 'Dr. Rajesh Gupta', 'MBBS, MD', 'KMC-12345', 'Karnataka Medical Council', 'General Physician', 'Bengaluru', 'Karnataka', 'verified', 'silver');

-- Doctor Referrals
INSERT INTO doctor_referrals (doctor_id, doctor_code, session_id, patient_id, status, scan_timestamp) VALUES
((SELECT id FROM doctor_profiles WHERE doctor_code='DR-KA-0001'), 'DR-KA-0001', 'sess_abc123', 'USR-PAT-001', 'subscribed', '2025-11-18 10:00:00');

-- ─────────────────────────────────────
-- 9. HELPER VIEWS (for quick queries)
-- ─────────────────────────────────────

-- Doctor Dashboard View
CREATE OR REPLACE VIEW v_doctor_dashboard AS
SELECT 
    dp.id AS doctor_id, dp.doctor_code, dp.full_name, dp.referral_tier,
    COUNT(dr.id) AS total_referrals,
    COUNT(CASE WHEN dr.status = 'subscribed' THEN 1 END) AS total_subscriptions,
    COALESCE(SUM(dc.credits), 0) AS total_credits_earned
FROM doctor_profiles dp
LEFT JOIN doctor_referrals dr ON dp.id = dr.doctor_id
LEFT JOIN doctor_credits dc ON dp.id = dc.doctor_id
GROUP BY dp.id, dp.doctor_code, dp.full_name, dp.referral_tier;

-- ─────────────────────────────────────
-- 10. FUNCTIONS & TRIGGERS
-- ─────────────────────────────────────

CREATE OR REPLACE FUNCTION generate_doctor_code(p_state VARCHAR) RETURNS VARCHAR AS $$
DECLARE
    state_code VARCHAR(2);
    next_num INT;
BEGIN
    state_code := CASE p_state WHEN 'Karnataka' THEN 'KA' ELSE 'XX' END;
    SELECT COALESCE(MAX(CAST(SUBSTRING(doctor_code FROM 'DR-' || state_code || '-(\d+)') AS INT)), 0) + 1
    INTO next_num FROM doctor_profiles WHERE doctor_code LIKE 'DR-' || state_code || '-%';
    RETURN 'DR-' || state_code || '-' || LPAD(next_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_doctor_profiles_updated BEFORE UPDATE ON doctor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────
-- 11. QUICK VALIDATION QUERIES
-- ─────────────────────────────────────

-- Active patients with subscription + wallet in one view
CREATE OR REPLACE VIEW v_patient_360 AS
SELECT
    u.id, u.first_name || ' ' || u.last_name AS full_name, u.role,
    u.city, u.state, u.language_primary, u.is_active,
    s.tier, s.status AS sub_status, s.plan_price_monthly,
    s.days_remaining, s.festival_free_access, s.corporate_org,
    w.balance AS wallet_balance, w.referral_credits, w.bonus_credits,
    w.session_credits_remaining,
    (SELECT COUNT(*) FROM sessions ss WHERE ss.patient_id = u.id) AS total_sessions,
    (SELECT MIN(pre_phq9_score) FROM sessions ss WHERE ss.patient_id = u.id) AS best_phq9,
    (SELECT MAX(pre_phq9_score) FROM sessions ss WHERE ss.patient_id = u.id) AS worst_phq9
FROM users u
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN wallets w ON w.user_id = u.id
WHERE u.role = 'patient';

-- Provider performance dashboard
CREATE OR REPLACE VIEW v_provider_dashboard AS
SELECT
    u.id, u.first_name || ' ' || u.last_name AS full_name, u.role,
    pc.specializations, pc.rating_avg, pc.total_sessions, pc.total_patients,
    pc.completion_rate_pct, pc.profile_status, pc.verification_status,
    w.balance AS wallet_balance, w.total_earned, w.pending_payout, w.payout_status,
    s.tier, s.status AS sub_status
FROM users u
LEFT JOIN provider_credentials pc ON pc.user_id = u.id
LEFT JOIN wallets w ON w.user_id = u.id
LEFT JOIN subscriptions s ON s.user_id = u.id
WHERE u.role IN ('therapist', 'psychiatrist');

-- Session outcome tracking
CREATE OR REPLACE VIEW v_session_outcomes AS
SELECT
    s.id, s.patient_name, s.provider_name, s.session_date,
    s.session_type, s.session_number,
    s.pre_phq9_score, s.post_phq9_score, s.phq9_delta,
    s.pre_gad7_score, s.post_gad7_score, s.gad7_delta,
    s.mood_delta, s.crisis_flag,
    s.session_fee, s.fee_payment_status
FROM sessions s
ORDER BY s.patient_id, s.session_date;

-- ─────────────────────────────────────
-- 10. QUICK VALIDATION QUERIES
-- ─────────────────────────────────────

-- Uncomment these to verify data after loading:
-- SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role;
-- SELECT tier, status, COUNT(*) FROM subscriptions GROUP BY tier, status;
-- SELECT session_type, COUNT(*), AVG(phq9_delta) FROM sessions GROUP BY session_type;
-- SELECT * FROM v_patient_360;
-- SELECT * FROM v_provider_dashboard;
-- SELECT * FROM v_session_outcomes;

COMMIT;

-- ═══════════════════════════════════════════════════════════════
-- DONE. Run validation queries above to confirm.
-- Total: 25 users, 19 subscriptions, 13 wallets, 12 sessions,
--        7 provider credentials, 3 views
-- ═══════════════════════════════════════════════════════════════

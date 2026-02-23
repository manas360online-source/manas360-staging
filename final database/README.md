# 🧠 MANAS360 Test Database Setup

Complete database setup package for MANAS360 mental health platform test environment.

## 📦 What's Included

```
data base new/
├── mans360_test_seed.sql      # Complete SQL seed file (schema + data)
├── load_test_data.py          # Python data loader script
├── .env.template              # Database config template
└── README.md                  # This file
```

## 🚀 Quick Start

### Option 1: Direct SQL Load (Recommended)

If you have `psql` command-line tool:

```bash
# 1. Edit database credentials
cp .env.template .env
# Edit .env with your database details

# 2. Load using psql
psql -U mans360admin -d mans360_dev -f mans360_test_seed.sql

# 3. Verify
psql -U mans360admin -d mans360_dev -c "SELECT role, COUNT(*) FROM users GROUP BY role;"
```

### Option 2: Python Loader (More Control)

```bash
# 1. Install dependencies
pip install psycopg2-binary openpyxl

# 2. Configure database
cp .env.template .env
# Edit .env with your database credentials

# 3. Load data
python load_test_data.py --mode sql

# 4. Validate
python load_test_data.py --mode validate
```

## 📊 Test Data Overview

| Category | Count | Description |
|----------|-------|-------------|
| **Users** | 25 | Across all roles |
| - Patients | 10 | Various subscription states |
| - Therapists | 5 | Different experience levels |
| - Psychiatrists | 2 | MD certified professionals |
| - Coaches | 2 | Onboarding specialists |
| - ASHA Workers | 2 | Community health workers |
| - Admins | 4 | Corporate + platform admins |
| **Subscriptions** | 19 | Free, trial, premium, corporate |
| **Wallets** | 13 | With credits and transactions |
| **Sessions** | 12 | Including before/after assessments |
| **Provider Credentials** | 7 | Licensed professionals |
| **Helper Views** | 3 | Pre-built analytics queries |

## 🎯 Key Test Scenarios

### Patient Journey Examples

1. **Priya Sharma (USR-PAT-001)** - Success Story
   - 12 therapy sessions completed
   - PHQ-9: 18 → 5 (dramatic improvement)
   - Premium subscriber, high engagement

2. **Rahul Verma (USR-PAT-002)** - Trial Conversion
   - Day 25 of 30-day trial
   - 2 sessions completed
   - Showing improvement, high conversion potential

3. **Arjun Patil (USR-PAT-004)** - Crisis Intervention
   - Crisis flag: Suicidal ideation
   - Emergency session logged
   - Safety plan activated

4. **Karthik Sundaram (USR-PAT-010)** - IVR User
   - Rural user, feature phone
   - IVR PHQ-9 screening (score: 16)
   - Auto-referred for follow-up

### Provider Examples

1. **Dr. Lakshmi Iyer (USR-THR-001)** - Top Performer
   - 120+ sessions, 4.8 rating
   - CBT specialist
   - ₹18,500 wallet balance

2. **Dr. Sindhuja Rao (USR-PSY-001)** - Clinical Advisor
   - Advisory board chair (DIMHANS)
   - 80 prescriptions
   - Telepsychiatry expert

## 🗄️ Database Schema

### Core Tables

- **users** - All platform users (patients, providers, admins)
- **subscriptions** - Subscription tiers and payment status
- **wallets** - Credits, earnings, payouts
- **sessions** - Clinical sessions with PHQ-9/GAD-7 tracking
- **provider_credentials** - Professional licenses and verification
- **permissions** - RBAC permission matrix
- **iam_role_permissions** - Role-based access control

### Helper Views

- **v_patient_360** - Patient overview (subscription + wallet + sessions)
- **v_provider_dashboard** - Provider performance metrics
- **v_session_outcomes** - Clinical outcome tracking

## 🔧 Configuration Options

### Local PostgreSQL

```env
MANS360_DB_HOST=localhost
MANS360_DB_PORT=5432
MANS360_DB_NAME=mans360_dev
MANS360_DB_USER=mans360admin
MANS360_DB_PASSWORD=your_password
```

### AWS RDS / Lightsail

```env
MANS360_DB_HOST=ls-xxxxx.ap-south-1.rds.amazonaws.com
MANS360_DB_PORT=5432
MANS360_DB_NAME=mans360_dev
MANS360_DB_USER=postgres
MANS360_DB_PASSWORD=your_rds_password
```

### Supabase

```env
MANS360_DB_HOST=db.xxxxx.supabase.co
MANS360_DB_PORT=5432
MANS360_DB_NAME=postgres
MANS360_DB_USER=postgres
MANS360_DB_PASSWORD=your_supabase_password
```

## 📝 Python Loader Usage

### Basic Commands

```bash
# Load from SQL seed
python load_test_data.py --mode sql

# Drop all tables and reload (fresh start)
python load_test_data.py --mode sql --reset

# Validate data after loading
python load_test_data.py --mode validate

# Generate .env template
python load_test_data.py --mode env

# Load from Excel (if you have the Excel file)
python load_test_data.py --mode excel --file MANAS360_Test_Data_Complete.xlsx
```

### Environment Variables

The loader reads from:
1. Environment variables (set in `.env`)
2. Default values in `DB_CONFIG` (edit `load_test_data.py`)

## 🧪 Validation Queries

After loading, run these to verify:

```sql
-- User distribution
SELECT role, COUNT(*) FROM users GROUP BY role ORDER BY role;

-- Subscription status
SELECT tier, status, COUNT(*) FROM subscriptions GROUP BY tier, status;

-- Session outcomes
SELECT session_type, COUNT(*), AVG(phq9_delta) FROM sessions GROUP BY session_type;

-- Crisis cases
SELECT COUNT(*) FROM sessions WHERE crisis_flag = TRUE;

-- Provider performance
SELECT * FROM v_provider_dashboard;

-- Patient 360 view
SELECT * FROM v_patient_360;
```

## 📋 Features & Capabilities

### Clinical Features
- ✅ PHQ-9 depression screening (before/after)
- ✅ GAD-7 anxiety assessment (before/after)
- ✅ Calculated deltas (improvement tracking)
- ✅ Crisis flag system
- ✅ Multi-modal sessions (video, audio, phone IVR)
- ✅ Multi-lingual support (Kannada, Hindi, Tamil, etc.)

### Business Features
- ✅ Multiple subscription tiers (free, trial, premium, corporate)
- ✅ Wallet/credits system
- ✅ Referral credits
- ✅ Festival promotions
- ✅ Corporate billing
- ✅ Provider payout tracking
- ✅ Lead purchasing system (for providers)

### Access Control
- ✅ 8 distinct user roles
- ✅ RBAC permissions framework
- ✅ Profile verification workflows
- ✅ License validation for providers

## 🔍 Troubleshooting

### Connection Issues

```bash
# Test connection
psql -U mans360admin -d mans360_dev -c "SELECT version();"

# Check if database exists
psql -U postgres -l | grep mans360
```

### Permission Errors

```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mans360_dev TO mans360admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mans360admin;
```

### Reset Everything

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS mans360_dev;"
psql -U postgres -c "CREATE DATABASE mans360_dev OWNER mans360admin;"

# Reload
python load_test_data.py --mode sql
```

## 📖 Next Steps

1. **Set up database** - Create PostgreSQL database and user
2. **Configure credentials** - Copy `.env.template` to `.env` and edit
3. **Load data** - Run `python load_test_data.py --mode sql`
4. **Validate** - Run validation queries or `--mode validate`
5. **Build application** - Connect your app to the database
6. **Test scenarios** - Use the test data for development/QA

## 🆘 Support

For issues or questions:
- Review the SQL comments in `mans360_test_seed.sql`
- Check validation output for data integrity
- Examine specific test scenarios in the seed data
- Adjust `DB_CONFIG` in `load_test_data.py` if needed

## 📅 Version Info

- **Generated**: 2026-02-17
- **PostgreSQL**: 15+ (tested with 15.x, 16.x)
- **Target Platforms**: Local, AWS RDS/Lightsail, Supabase
- **Total Records**: 76+ across 7 tables

---

**🧠 MANAS360** - Mental health platform test database

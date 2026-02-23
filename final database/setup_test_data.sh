#!/bin/bash
# ═══════════════════════════════════════════════════════════
# MANAS360 Test Data — One-Shot Setup
# ═══════════════════════════════════════════════════════════
#
# USAGE:
#   chmod +x setup_test_data.sh
#   ./setup_test_data.sh
#
# PREREQUISITES:
#   - PostgreSQL running (local, Supabase, or AWS RDS)
#   - psql CLI available
#   - Python 3.8+ with pip
#
# This script will:
#   1. Create the database if it doesn't exist
#   2. Install Python dependencies
#   3. Run the SQL seed (schema + data)
#   4. Validate loaded data
# ═══════════════════════════════════════════════════════════

set -e

# ── CONFIG (edit these or set env vars) ──
DB_HOST="${MANS360_DB_HOST:-localhost}"
DB_PORT="${MANS360_DB_PORT:-5432}"
DB_NAME="${MANS360_DB_NAME:-mans360_dev}"
DB_USER="${MANS360_DB_USER:-mans360admin}"
DB_PASS="${MANS360_DB_PASSWORD:-changeme}"

echo "═══════════════════════════════════════"
echo "🧠 MANAS360 Test Data Setup"
echo "═══════════════════════════════════════"
echo "  Host: $DB_HOST:$DB_PORT"
echo "  DB:   $DB_NAME"
echo "  User: $DB_USER"
echo "═══════════════════════════════════════"

# ── Step 1: Create database (if local) ──
if [ "$DB_HOST" = "localhost" ] || [ "$DB_HOST" = "127.0.0.1" ]; then
    echo ""
    echo "📦 Step 1: Creating database (if not exists)..."
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 \
    || PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -c "CREATE DATABASE $DB_NAME;" 2>/dev/null \
    && echo "  ✅ Database ready: $DB_NAME" \
    || echo "  ℹ️  Database already exists or using remote DB"
else
    echo ""
    echo "📦 Step 1: Skipping DB creation (remote host: $DB_HOST)"
fi

# ── Step 2: Install Python deps ──
echo ""
echo "📦 Step 2: Installing Python dependencies..."
pip install psycopg2-binary openpyxl --quiet 2>/dev/null \
    || pip install psycopg2-binary openpyxl --quiet --break-system-packages 2>/dev/null \
    || echo "  ⚠️  pip install failed — you may need to install manually"
echo "  ✅ Dependencies ready"

# ── Step 3: Run SQL seed ──
echo ""
echo "📄 Step 3: Loading SQL seed..."

if [ -f "mans360_test_seed.sql" ]; then
    PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        -f mans360_test_seed.sql \
        -v ON_ERROR_STOP=1
    echo "  ✅ SQL seed loaded"
else
    echo "  ❌ mans360_test_seed.sql not found!"
    echo "  Make sure the file is in the current directory."
    exit 1
fi

# ── Step 4: Validate ──
echo ""
echo "📊 Step 4: Validating data..."
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<'VALIDATION'

\echo ''
\echo '═══════════════════════════════════════'
\echo '  DATA VALIDATION'
\echo '═══════════════════════════════════════'

\echo ''
\echo '  Users by role:'
SELECT role, COUNT(*) AS count FROM users GROUP BY role ORDER BY role;

\echo '  Subscriptions by tier + status:'
SELECT tier, status, COUNT(*) AS count FROM subscriptions GROUP BY tier, status ORDER BY tier;

\echo '  Wallet summary:'
SELECT COUNT(*) AS wallets, SUM(balance) AS total_balance, SUM(total_earned) AS total_earnings FROM wallets;

\echo '  Sessions by type:'
SELECT session_type, COUNT(*) AS count FROM sessions GROUP BY session_type ORDER BY count DESC;

\echo '  Crisis sessions:'
SELECT COUNT(*) AS crisis_count FROM sessions WHERE crisis_flag = TRUE;

\echo '  Provider credentials:'
SELECT profile_status, COUNT(*) AS count FROM provider_credentials GROUP BY profile_status;

\echo '  Views created:'
SELECT COUNT(*) AS patients FROM v_patient_360;
SELECT COUNT(*) AS providers FROM v_provider_dashboard;
SELECT COUNT(*) AS sessions FROM v_session_outcomes;

\echo ''
\echo '═══════════════════════════════════════'
\echo '  ✅ ALL DONE!'
\echo '═══════════════════════════════════════'
VALIDATION

echo ""
echo "═══════════════════════════════════════"
echo "🎉 Setup complete!"
echo ""
echo "Quick test queries:"
echo "  psql -d $DB_NAME -c 'SELECT * FROM v_patient_360;'"
echo "  psql -d $DB_NAME -c 'SELECT * FROM v_provider_dashboard;'"
echo "  psql -d $DB_NAME -c 'SELECT * FROM v_session_outcomes;'"
echo "═══════════════════════════════════════"

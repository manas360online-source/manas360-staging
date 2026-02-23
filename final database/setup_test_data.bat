@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════════════════
echo   MANAS360 Test Data Setup (Windows)
echo ═══════════════════════════════════════════════════════════

REM Step 1: Install Dependencies
echo.
echo [Step 1] Installing Python dependencies...
python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies. Check your Python installation.
    pause
    exit /b %ERRORLEVEL%
)

REM Step 2: Ensure Database Exists
echo.
echo [Step 2] Checking Database...
python -X utf8 setup_database.py
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to setup database.
    pause
    exit /b %ERRORLEVEL%
)

REM Step 3: Load Data
echo.
echo [Step 3] Loading ^& Validating Data...
python -X utf8 load_test_data.py --mode sql
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to load data. Use python load_test_data.py --mode sql manually to debug.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ═══════════════════════════════════════════════════════════
echo   ✅ ALL DONE! Database is ready.
echo ═══════════════════════════════════════════════════════════
pause

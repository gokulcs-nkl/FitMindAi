@echo off
REM FitMind AI Django Quick Start Script for Windows

echo.
echo ============================================
echo   FitMind AI - Django Quick Start
echo ============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Install dependencies if requirements.txt exists
if exist requirements.txt (
    echo [1/4] Installing dependencies...
    pip install -r requirements.txt -q
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ERROR: requirements.txt not found
    pause
    exit /b 1
)

REM Run migrations
echo [2/4] Setting up database...
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Database migration failed
    pause
    exit /b 1
)

REM Ask if user wants to create superuser
echo.
echo [3/4] Create superuser for Django admin? (optional)
set /p create_superuser="Enter 'yes' to create superuser or press Enter to skip: "
if /i "%create_superuser%"=="yes" (
    python manage.py createsuperuser
)

REM Start development server
echo.
echo [4/4] Starting development server...
echo.
echo ============================================
echo   Server running at http://localhost:8000
echo   Admin panel at http://localhost:8000/admin/
echo   Press CTRL+C to stop the server
echo ============================================
echo.

python manage.py runserver

pause

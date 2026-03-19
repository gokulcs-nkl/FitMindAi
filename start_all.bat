@echo off
REM FitMind AI - Django + Streamlit Starter Script

color 0A
title FitMind AI - Django + Streamlit

echo.
echo ========================================
echo    FitMind AI - Full Stack Startup
echo ========================================
echo.

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Python not found!
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Install dependencies
echo [1/3] Installing dependencies...
pip install -r requirements.txt -q
if errorlevel 1 (
    color 0C
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo [1/3] Dependencies installed ✓

REM Django migrations
echo [2/3] Setting up Django database...
python manage.py migrate -q

echo [2/3] Django database ready ✓

REM Start both servers
echo.
echo [3/3] Starting servers...
echo.
echo ========================================
echo    🚀 Starting Django Backend...
echo    🎨 Starting Streamlit Frontend...
echo ========================================
echo.
echo   Backend:   http://localhost:8000
echo   Frontend:  http://localhost:8501
echo   Admin:     http://localhost:8000/admin
echo.
echo Press CTRL+C in any terminal to stop
echo ========================================
echo.

REM Start Django in background
start "Django Backend" cmd /k python manage.py runserver

REM Give Django a moment to start
timeout /t 2 /nobreak

REM Start Streamlit
echo.
echo Starting Streamlit...
streamlit run streamlit_app.py

pause

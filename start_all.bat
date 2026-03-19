@echo off
REM Start FitMind AI with Original HTML/CSS/JS Template

color 0A
title FitMind AI - Streamlit

echo.
echo ==========================================
echo    FitMind AI - Streamlit Frontend
echo ==========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Python not found!
    pause
    exit /b 1
)

REM Install dependencies
echo [1/2] Installing dependencies...
pip install -r requirements.txt -q

echo [1/2] Dependencies installed ✓
echo.

REM Start Streamlit
echo [2/2] Starting Streamlit...
echo.
echo ==========================================
echo   🎨 Streamlit UI
echo   Local:  http://localhost:8501
echo   
echo   (Optional) Run Django separately:
echo   python manage.py runserver
echo ==========================================
echo.

streamlit run streamlit_app.py

pause

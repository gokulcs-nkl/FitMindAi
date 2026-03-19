#!/bin/bash
# Start FitMind AI with Streamlit

echo ""
echo "=========================================="
echo "    FitMind AI - Streamlit + Django"
echo "=========================================="
echo ""

# Install dependencies if needed
if ! command -v streamlit &> /dev/null; then
    echo "[1/2] Installing dependencies..."
    pip install -r requirements.txt -q
fi

echo "[1/2] Dependencies ready ✓"

# Start Streamlit with the original HTML/CSS/JS template
echo "[2/2] Starting Streamlit..."
echo ""
echo "=========================================="
echo "  🎨 Streamlit UI: http://localhost:8501"
echo "  🔧 Django Backend: http://localhost:8000 (optional)"
echo "  📊 Admin Panel: http://localhost:8000/admin (optional)"
echo "=========================================="
echo ""

streamlit run streamlit_app.py

echo ""

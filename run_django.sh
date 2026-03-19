#!/bin/bash
# FitMind AI Django Quick Start Script for Linux/Mac

echo ""
echo "============================================"
echo "   FitMind AI - Django Quick Start"
echo "============================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.11+ from https://python.org"
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f requirements.txt ]; then
    echo "[1/4] Installing dependencies..."
    pip install -r requirements.txt -q
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
else
    echo "ERROR: requirements.txt not found"
    exit 1
fi

# Run migrations
echo "[2/4] Setting up database..."
python3 manage.py migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Database migration failed"
    exit 1
fi

# Ask if user wants to create superuser
echo ""
echo "[3/4] Create superuser for Django admin? (optional)"
read -p "Enter 'yes' to create superuser or press Enter to skip: " create_superuser
if [ "$create_superuser" = "yes" ]; then
    python3 manage.py createsuperuser
fi

# Start development server
echo ""
echo "[4/4] Starting development server..."
echo ""
echo "============================================"
echo "   Server running at http://localhost:8000"
echo "   Admin panel at http://localhost:8000/admin/"
echo "   Press CTRL+C to stop the server"
echo "============================================"
echo ""

python3 manage.py runserver

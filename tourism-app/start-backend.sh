#!/bin/bash
echo "🌿 Starting Tourism Backend (Flask)..."
cd "$(dirname "$0")/backend"
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "📦 Installing dependencies..."
pip install -r requirements.txt -q
echo ""
echo "🚀 Starting Flask on http://localhost:5000"
echo "   HealthCheck: http://localhost:5000/api/health"
echo ""
python run.py

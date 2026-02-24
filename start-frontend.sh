#!/bin/bash
echo "🌿 Starting Tourism Frontend (Next.js)..."
cd "$(dirname "$0")/frontend"
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js packages (first time — may take 2–3 mins)..."
    npm install
fi
echo ""
echo "🚀 Starting Next.js on http://localhost:3000"
echo ""
npm run dev

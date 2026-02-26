#!/bin/bash

# ============================================
# MANAS360 Admin Dashboard - Quick Start
# ============================================

echo "🚀 Starting MANAS360 Admin Dashboard..."
echo ""

# Step 1: Ensure clean ports
echo "🧹 Cleaning ports..."
lsof -i :3001 -t 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -i :3000 -t 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 2
echo "✅ Ports cleaned"
echo ""

# Step 2: Setup backend
echo "📦 Starting Unified Backend..."
echo "   Location: project root"
echo "   Port: 5001"
echo "   API: /api/v1/*"
echo ""

cd "$(dirname "$0")"

# Start backend in background
npm run server &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
sleep 3
echo ""

# Step 3: Setup merged frontend
echo "📦 Starting Frontend..."
echo "   Location: frontend/main-app (merged admin UI)"
echo "   Port: 3000"
echo ""

# Check if root node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing root dependencies..."
    npm install
    echo ""
fi

# Start root Vite client
npm run client &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

# Step 4: Status
echo "============================================"
echo "✅ MANAS360 Admin Dashboard is starting!"
echo "============================================"
echo ""
echo "Backend:  http://localhost:5001"
echo "Frontend: http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "   Backend:  Check terminal"
echo "   Frontend: Check terminal"
echo ""
echo "🌐 Open your browser: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for processes
wait

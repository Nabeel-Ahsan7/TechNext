#!/bin/bash

# URL Shortener Application Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting URL Shortener Application..."
echo "================================================"

# Check if concurrently is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Node.js/npm not found. Please install Node.js first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🔥 Starting development servers..."
echo "📊 Backend will run on: http://localhost:3001"
echo "🌐 Frontend will run on: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"

# Start both servers concurrently
npm run dev
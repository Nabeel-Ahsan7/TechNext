@echo off
REM URL Shortener Application Startup Script for Windows

echo 🚀 Starting URL Shortener Application...
echo ================================================

REM Check if npm exists
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js/npm not found. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing root dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend && npm install && cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend && npm install && cd ..
)

echo.
echo 🔥 Starting development servers...
echo 📊 Backend will run on: http://localhost:3001
echo 🌐 Frontend will run on: http://localhost:5173
echo.
echo Press Ctrl+C to stop both servers
echo ================================================

REM Start both servers concurrently
npm run dev

pause
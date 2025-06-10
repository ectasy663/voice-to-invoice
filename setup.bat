@echo off
echo 🚀 Voice to Invoice App - Complete Setup
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup environment files
echo 📝 Setting up environment files...
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo ✅ Created root .env file from template
    ) else (
        echo ⚠️  No .env.example found in root directory
    )
)

if not exist backend\.env (
    if exist backend\.env.example (
        copy backend\.env.example backend\.env >nul
        echo ✅ Created backend .env file from template
    ) else (
        echo ⚠️  No backend\.env.example found
    )
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully
cd ..

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed successfully
cd ..

REM Install concurrently for running both servers
echo 📦 Installing development utilities...
call npm install concurrently
if %errorlevel% neq 0 (
    echo ⚠️  Could not install concurrently - you'll need to start servers manually
) else (
    echo ✅ Development utilities installed
)

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo Next steps:
echo 1. Configure your environment variables in .env and backend\.env
echo 2. Read SECURITY_SETUP.md for security configuration
echo 3. Start the application with: npm start
echo.
echo Available commands:
echo - npm start          # Start both frontend and backend
echo - npm run dev:frontend  # Start only frontend
echo - npm run dev:backend   # Start only backend
echo - npm run build         # Build frontend for production
echo.
echo Happy coding! 🚀
pause

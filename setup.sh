#!/bin/bash

# Voice to Invoice App - Complete Setup Script
# This script sets up both frontend and backend components

echo "🚀 Voice to Invoice App - Complete Setup"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup environment files
echo "📝 Setting up environment files..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created root .env file from template"
    else
        echo "⚠️  No .env.example found in root directory"
    fi
fi

if [ ! -f backend/.env ]; then
    if [ -f backend/.env.example ]; then
        cp backend/.env.example backend/.env
        echo "✅ Created backend .env file from template"
    else
        echo "⚠️  No backend/.env.example found"
    fi
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if npm install; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if python -m pip install -r requirements.txt; then
    echo "✅ Backend dependencies installed successfully"
elif python3 -m pip install -r requirements.txt; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

# Install concurrently for running both servers
echo "📦 Installing development utilities..."
if npm install concurrently; then
    echo "✅ Development utilities installed"
else
    echo "⚠️  Could not install concurrently - you'll need to start servers manually"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Configure your environment variables in .env and backend/.env"
echo "2. Read SECURITY_SETUP.md for security configuration"
echo "3. Start the application with: npm start"
echo ""
echo "Available commands:"
echo "- npm start          # Start both frontend and backend"
echo "- npm run dev:frontend  # Start only frontend"
echo "- npm run dev:backend   # Start only backend"
echo "- npm run build         # Build frontend for production"
echo ""
echo "Happy coding! 🚀"

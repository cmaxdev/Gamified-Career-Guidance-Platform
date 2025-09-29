#!/bin/bash

# Career Guidance Platform Setup Script

echo "🚀 Setting up Career Guidance Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies  
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Setup environment files
echo "🔧 Setting up environment files..."

# Server environment
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env from template"
    echo "⚠️  Please update the environment variables in server/.env"
else
    echo "✅ server/.env already exists"
fi

# Client environment
if [ ! -f "client/.env" ]; then
    cp client/env.example client/.env
    echo "✅ Created client/.env from template"
else
    echo "✅ client/.env already exists"
fi

# Check if MongoDB is running (optional)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found. You can either:"
    echo "   1. Install MongoDB locally"
    echo "   2. Use Docker Compose: docker-compose up -d mongodb"
    echo "   3. Use a cloud MongoDB service (MongoDB Atlas)"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start MongoDB (if not using Docker)"
echo "2. Update environment variables in server/.env"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo "4. Run 'npm run seed' in the server directory to create admin user"
echo ""
echo "Default admin credentials:"
echo "Email: admin@platform.com"
echo "Password: admin123"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:5000"

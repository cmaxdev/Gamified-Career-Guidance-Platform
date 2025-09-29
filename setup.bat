@echo off
echo 🚀 Setting up Career Guidance Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

:: Install root dependencies
echo 📦 Installing root dependencies...
call npm install

:: Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
cd ..

:: Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

:: Setup environment files
echo 🔧 Setting up environment files...

:: Server environment
if not exist "server\.env" (
    copy "server\env.example" "server\.env"
    echo ✅ Created server\.env from template
    echo ⚠️  Please update the environment variables in server\.env
) else (
    echo ✅ server\.env already exists
)

:: Client environment
if not exist "client\.env" (
    copy "client\env.example" "client\.env"
    echo ✅ Created client\.env from template
) else (
    echo ✅ client\.env already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Start MongoDB (if not using Docker)
echo 2. Update environment variables in server\.env
echo 3. Run 'npm run dev' to start both frontend and backend
echo 4. Run 'npm run seed' in the server directory to create admin user
echo.
echo Default admin credentials:
echo Email: admin@platform.com
echo Password: admin123
echo.
echo 🌐 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo.
pause

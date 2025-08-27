@echo off
echo 🏥 Hospital Management System - Database Setup
echo ================================================
echo.

echo 🔧 Step 1: Creating .env file...
if not exist .env (
    copy config.env .env
    echo ✅ .env file created from config.env
    echo ⚠️  Please edit .env file with your MySQL credentials
    echo.
    pause
) else (
    echo ✅ .env file already exists
)

echo.
echo 🗄️  Step 2: Setting up database...
npm run setup-db

echo.
echo 📋 Step 3: Creating tables...
npm run migrate

echo.
echo 🌱 Step 4: Inserting sample data...
npm run seed

echo.
echo 🎉 Database setup completed!
echo.
echo 📋 Next steps:
echo 1. Start the backend server: npm run dev
echo 2. Start the frontend server: cd ../frontend && npm run dev
echo 3. Test the system at: http://localhost:5173
echo.
pause

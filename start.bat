@echo off
echo 🍎 Starting Calorie Counter App...
echo.

echo 📦 Installing dependencies...
call npm install
cd client
call npm install
cd ..

echo.
echo 🚀 Starting server and client...
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo.

call npm run dev:full 
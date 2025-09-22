@echo off
echo ========================================
echo PWD System Mobile Testing Setup
echo ========================================
echo.

echo Starting Laravel Backend Server...
start "Laravel Backend" cmd /k "cd /d C:\Users\User\Desktop\capstone2pwd\pwd-backend && php artisan serve --host=0.0.0.0 --port=8000"

timeout /t 3 /nobreak >nul

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd /d C:\Users\User\Desktop\capstone2pwd\pwd-frontend && npm start"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Servers Started Successfully!
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo For Mobile Testing:
echo 1. Find your computer's IP address
echo 2. Open http://[YOUR_IP]:3000 on your mobile device
echo 3. Ensure both devices are on the same network
echo.
echo Mobile Testing Guide: MOBILE_TESTING_GUIDE.md
echo.
echo Press any key to exit...
pause >nul

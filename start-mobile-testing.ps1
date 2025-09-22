# PWD System Mobile Testing Setup
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PWD System Mobile Testing Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Laravel Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\User\Desktop\capstone2pwd\pwd-backend'; php artisan serve --host=0.0.0.0 --port=8000"

Start-Sleep -Seconds 3

Write-Host "Starting React Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\User\Desktop\capstone2pwd\pwd-frontend'; npm start"

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Servers Started Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend: http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "For Mobile Testing:" -ForegroundColor Cyan
Write-Host "1. Find your computer's IP address" -ForegroundColor White
Write-Host "2. Open http://[YOUR_IP]:3000 on your mobile device" -ForegroundColor White
Write-Host "3. Ensure both devices are on the same network" -ForegroundColor White
Write-Host ""
Write-Host "Mobile Testing Guide: MOBILE_TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

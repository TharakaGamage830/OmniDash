@echo off
echo Starting Anu Creation Full-Stack System...

:: Start Backend
start cmd /k "cd backend && npm start"
echo Backend starting...
timeout /t 2

:: Start Public Frontend
start cmd /k "cd frontend && npm run dev"
echo Public Frontend starting...

:: Start Admin Frontend
start cmd /k "cd admin-frontend && npm run dev"
echo Admin Frontend starting...

echo All systems initiated!
pause

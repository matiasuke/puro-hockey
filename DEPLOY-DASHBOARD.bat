@echo off
REM Deployment via Vercel Dashboard - Sin CLI
REM PURO HOCKEY v1.0.0

cd /d "C:\Users\Alumno\Documents\App\hockey-app"

powershell -ExecutionPolicy Bypass -File ".\DEPLOYMENT-VERCEL-DASHBOARD.ps1"

pause

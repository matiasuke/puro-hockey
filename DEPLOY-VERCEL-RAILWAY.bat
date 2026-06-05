@echo off
REM Deployment automatizado - Vercel + Railway

setlocal enabledelayedexpansion

cls
echo.
echo ===========================================
echo    DEPLOY VERCEL + RAILWAY
echo    PURO HOCKEY v1.0.0
echo ===========================================
echo.

cd /d "C:\Users\Alumno\Documents\App\hockey-app"

if errorlevel 1 (
    echo Error: No se encontro la carpeta
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File ".\deploy-vercel-railway.ps1"

exit /b 0

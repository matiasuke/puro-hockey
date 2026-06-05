@echo off
REM Deployment 100% Automatico - Vercel + Railway
REM PURO HOCKEY v1.0.0

setlocal enabledelayedexpansion

cls
echo.
echo ====================================================
echo    DEPLOYMENT AUTOMATICO 100%%
echo    PURO HOCKEY v1.0.0
echo ====================================================
echo.

cd /d "C:\Users\Alumno\Documents\App\hockey-app"

if errorlevel 1 (
    echo Error: No se encontro la carpeta
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File ".\deploy-automatico-completo.ps1"

exit /b 0

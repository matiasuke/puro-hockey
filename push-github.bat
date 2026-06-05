@echo off
REM ============================================================================
REM PUSH A GITHUB - PURO HOCKEY
REM Script batch que abre el menu interactivo en PowerShell
REM ============================================================================

setlocal enabledelayedexpansion

cls
echo.
echo 🚀 ==========================================
echo    PUSH A GITHUB - PURO HOCKEY
echo ==========================================
echo.
echo Abriendo menu interactivo...
echo.

REM Cambiar a la carpeta del proyecto
cd /d "C:\Users\Alumno\Documents\App\hockey-app"

if errorlevel 1 (
    echo Cancelado
    pause
    exit /b 1
)

REM Ejecutar el script PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ejecutar-push.ps1"

exit /b 0

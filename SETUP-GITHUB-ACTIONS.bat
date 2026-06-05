@echo off
REM Setup GitHub Actions - Deployments Automaticos
REM PURO HOCKEY v1.0.0

cd /d "C:\Users\Alumno\Documents\App\hockey-app"

powershell -ExecutionPolicy Bypass -File ".\SETUP-GITHUB-ACTIONS.ps1"

pause

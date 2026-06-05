# Automatizacion Vercel - Simple
# PURO HOCKEY v1.0.0

Clear-Host

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host ""
Write-Host "================================================================"
Write-Host "   AUTOMATIZACION VERCEL"
Write-Host "   PURO HOCKEY v1.0.0"
Write-Host "================================================================"
Write-Host ""

# PASO 1: VERIFICAR
Write-Host "PASO 1: Verificando..."
if ((git --version 2>$null) -and (node --version 2>$null)) {
    Write-Host "  OK"
} else {
    Write-Host "  ERROR"
    exit 1
}

Write-Host ""

# PASO 2: LIMPIAR TAILWIND
Write-Host "PASO 2: Corrigiendo Tailwind..."
Remove-Item "postcss.config.js" -Force -ErrorAction SilentlyContinue
Write-Host "  OK"

Write-Host ""
Write-Host "  Reinstalando npm..."
npm install --legacy-peer-deps -q
Write-Host "  OK"

Write-Host ""

# PASO 3: GIT
Write-Host "PASO 3: Pusheando a GitHub..."
git add -A
git commit -m "Fix: Vercel deployment - Tailwind"
git push origin main
Write-Host "  OK"

Write-Host ""

# PASO 4: VERCEL
Write-Host "PASO 4: Abriendo Vercel..."
Start-Process "https://vercel.com/dashboard/puro-hockey"

Write-Host ""
Write-Host "Vercel iniciara build automaticamente..."
Write-Host "Espera 2-5 minutos"
Write-Host ""

Write-Host "En Vercel:"
Write-Host "1. Deberia ver Building"
Write-Host "2. Espera a que termine"
Write-Host "3. Copia la URL"
Write-Host ""

$vercelUrl = Read-Host "Pega URL de Vercel"

if ($vercelUrl -like "*vercel.app*") {
    Write-Host "OK: $vercelUrl"
    $vercelUrl | Out-File "VERCEL_URL.txt" -Encoding UTF8
    Write-Host ""
    Write-Host "URL guardada en VERCEL_URL.txt"
    Write-Host ""
    Write-Host "Siguiente paso: Railway"
    Write-Host ".\RAILWAY-AUTO.ps1"
} else {
    Write-Host "URL invalida"
    exit 1
}

Write-Host ""
Read-Host "Presiona Enter"

# Automatizacion Vercel - Completamente No-Interactiva
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   VERCEL DEPLOYMENT - NON-INTERACTIVE" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

# ═══════════════════════════════════════════════════════════════════════
# PASO 1: VERIFICAR REQUISITOS
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 1: Verificando requisitos..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

try {
    $gitVersion = git --version
    Write-Host "  Git: OK - $gitVersion" -ForegroundColor $Green
} catch {
    Write-Host "  Git: ERROR" -ForegroundColor $Red
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Host "  Node.js: OK - $nodeVersion" -ForegroundColor $Green
} catch {
    Write-Host "  Node.js: ERROR" -ForegroundColor $Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "  npm: OK - $npmVersion" -ForegroundColor $Green
} catch {
    Write-Host "  npm: ERROR" -ForegroundColor $Red
    exit 1
}

$remote = git config --get remote.origin.url
if ($remote -like "*puro-hockey*") {
    Write-Host "  GitHub: OK - $remote" -ForegroundColor $Green
} else {
    Write-Host "  GitHub: ERROR" -ForegroundColor $Red
    exit 1
}

if (Test-Path ".\vercel.json") {
    Write-Host "  vercel.json: OK" -ForegroundColor $Green
} else {
    Write-Host "  vercel.json: NOT FOUND" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "  Todos los requisitos OK" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 2: INSTALAR VERCEL CLI
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 2: Instalando Vercel CLI..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "  Vercel CLI: YA INSTALADO ($vercelVersion)" -ForegroundColor $Green
} catch {
    Write-Host "  Instalando Vercel CLI..." -ForegroundColor $Cyan
    npm install -g vercel -q
    Write-Host "  Vercel CLI: INSTALADO" -ForegroundColor $Green
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 3: OBTENER TOKEN VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 3: Configurando autenticacion..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "OPCION 1: Si ya tienes token de Vercel" -ForegroundColor $Cyan
Write-Host "  Obtenerlo en: https://vercel.com/account/tokens" -ForegroundColor $Blue
Write-Host ""
Write-Host "OPCION 2: Si no tienes token" -ForegroundColor $Cyan
Write-Host "  1. Abre: https://vercel.com/account/tokens" -ForegroundColor $Blue
Write-Host "  2. Click: 'Create'" -ForegroundColor $Blue
Write-Host "  3. Nombre: puro-hockey-deploy" -ForegroundColor $Blue
Write-Host "  4. Copia el token" -ForegroundColor $Blue
Write-Host ""

$vercelToken = Read-Host "Pega tu token de Vercel"

if ($vercelToken.Length -lt 10) {
    Write-Host ""
    Write-Host "ERROR: Token invalido" -ForegroundColor $Red
    exit 1
}

Write-Host "Token guardado" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 4: DEPLOY A VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 4: Ejecutando deployment..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Ejecutando: vercel --prod --token=***" -ForegroundColor $Cyan
Write-Host ""

# Set env var para el token
$env:VERCEL_TOKEN = $vercelToken

# Deploy
$deployOutput = & vercel --prod --yes --token=$vercelToken 2>&1

Write-Host $deployOutput
Write-Host ""

if ($LASTEXITCODE -eq 0) {
    Write-Host "Status: EXITO" -ForegroundColor $Green
} else {
    Write-Host "Status: ERROR (intenta manualmente en https://vercel.com/new)" -ForegroundColor $Yellow
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 5: OBTENER URL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 5: Obteniendo URL..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo dashboard de Vercel..." -ForegroundColor $Cyan
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "Ve a: https://vercel.com/dashboard" -ForegroundColor $Blue
Write-Host "Proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host ""

$vercelUrl = Read-Host "Pega la URL de Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"

if (-not ($vercelUrl -like "*vercel.app*")) {
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Frontend URL: $vercelUrl" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# RESUMEN
# ═══════════════════════════════════════════════════════════════════════

Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   VERCEL DEPLOYMENT COMPLETADO" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Write-Host "Frontend: $vercelUrl" -ForegroundColor $Cyan
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor $Yellow
Write-Host "1. Ejecuta Railway:" -ForegroundColor $Blue
Write-Host "   .\RAILWAY-AUTO.ps1" -ForegroundColor $Cyan
Write-Host ""
Write-Host "2. O deployment completo:" -ForegroundColor $Blue
Write-Host "   .\DEPLOYMENT-FULL-AUTO.ps1" -ForegroundColor $Cyan
Write-Host ""

# Guardar URL en archivo para Railway
$vercelUrl | Out-File "VERCEL_URL.txt" -Encoding UTF8

Write-Host ""
Read-Host "Presiona Enter"

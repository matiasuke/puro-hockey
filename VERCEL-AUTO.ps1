# Automatizacion Completa de Vercel
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   AUTOMATIZACION VERCEL - SIN INTERACCION" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 1: VERIFICAR REQUISITOS
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 1: Verificando requisitos..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "Git: OK" -ForegroundColor $Green
} catch {
    Write-Host "Git: ERROR" -ForegroundColor $Red
    exit 1
}

# Verificar Node
try {
    $nodeVersion = node --version
    Write-Host "Node.js: OK" -ForegroundColor $Green
} catch {
    Write-Host "Node.js: ERROR" -ForegroundColor $Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "npm: OK" -ForegroundColor $Green
} catch {
    Write-Host "npm: ERROR" -ForegroundColor $Red
    exit 1
}

# Verificar código en GitHub
try {
    $remote = git config --get remote.origin.url
    if ($remote -like "*puro-hockey*") {
        Write-Host "GitHub: OK - puro-hockey" -ForegroundColor $Green
    } else {
        Write-Host "GitHub: ERROR - No es puro-hockey" -ForegroundColor $Red
        exit 1
    }
} catch {
    Write-Host "GitHub: ERROR" -ForegroundColor $Red
    exit 1
}

# Verificar vercel.json
if (Test-Path ".\vercel.json") {
    Write-Host "vercel.json: OK" -ForegroundColor $Green
} else {
    Write-Host "vercel.json: ERROR - No encontrado" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Todos los requisitos OK" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 2: INSTALAR VERCEL CLI
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 2: Verificando Vercel CLI..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

$vercelInstalled = $false
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "Vercel CLI: YA INSTALADO" -ForegroundColor $Green
    $vercelInstalled = $true
} catch {
    Write-Host "Vercel CLI: No instalado, instalando..." -ForegroundColor $Yellow
    npm install -g vercel -q 2>$null
    Write-Host "Vercel CLI: INSTALADO" -ForegroundColor $Green
    $vercelInstalled = $true
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 3: VERIFICAR AUTENTICACION
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 3: Verificando autenticacion en Vercel..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo navegador para autenticacion..." -ForegroundColor $Cyan
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor $Yellow
Write-Host "1. Haz login con GitHub en el navegador" -ForegroundColor $Blue
Write-Host "2. Autoriza acceso a Vercel" -ForegroundColor $Blue
Write-Host "3. Cierra el navegador cuando termine" -ForegroundColor $Blue
Write-Host ""

# Intentar login
Start-Process "https://vercel.com/auth/login"

Write-Host ""
Write-Host "¿Ya completaste el login?" -ForegroundColor $Yellow
$loginDone = Read-Host "(s/n)"

if ($loginDone -ne "s") {
    Write-Host ""
    Write-Host "Intenta de nuevo con: vercel login" -ForegroundColor $Yellow
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 4: DEPLOY A VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 4: Ejecutando deployment en Vercel..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Ejecutando: vercel --prod --yes" -ForegroundColor $Cyan
Write-Host ""

# Ejecutar deploy
$deployOutput = vercel --prod --yes 2>&1

Write-Host $deployOutput
Write-Host ""

# Verificar resultado
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment: OK" -ForegroundColor $Green
    Write-Host ""

    # Extraer URL del output
    $urlMatch = $deployOutput | Select-String -Pattern "https://[a-zA-Z0-9-]+\.vercel\.app"
    if ($urlMatch) {
        $vercelUrl = $urlMatch.Matches[0].Value
        Write-Host "URL de Vercel: $vercelUrl" -ForegroundColor $Cyan
    } else {
        Write-Host "URL: Revisar en https://vercel.com/dashboard" -ForegroundColor $Yellow
    }
} else {
    Write-Host ""
    Write-Host "ERROR: Deploy falló" -ForegroundColor $Red
    Write-Host ""
    Write-Host "SOLUCIONES:" -ForegroundColor $Yellow
    Write-Host "1. Verifica que estés logueado: vercel login" -ForegroundColor $Blue
    Write-Host "2. Ve a https://vercel.com/dashboard" -ForegroundColor $Blue
    Write-Host "3. Importa manualmente el repositorio" -ForegroundColor $Blue
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 5: OBTENER URL FINAL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 5: Obteniendo URL final..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

if ($vercelUrl) {
    Write-Host "Frontend URL: $vercelUrl" -ForegroundColor $Green
} else {
    $vercelUrl = Read-Host "Pega tu URL de Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   VERCEL DEPLOYMENT COMPLETADO" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Write-Host "Frontend URL: $vercelUrl" -ForegroundColor $Cyan
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor $Yellow
Write-Host "1. Verifica que el frontend carga:" -ForegroundColor $Blue
Write-Host "   $vercelUrl" -ForegroundColor $Cyan
Write-Host ""
Write-Host "2. Continua con Railway deployment:" -ForegroundColor $Blue
Write-Host "   .\RAILWAY-AUTO.ps1" -ForegroundColor $Cyan
Write-Host ""

Write-Host ""
Read-Host "Presiona Enter para terminar"

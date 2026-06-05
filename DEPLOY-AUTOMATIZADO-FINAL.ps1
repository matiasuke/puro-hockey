# Deployment Automatizado Final - Vercel + Railway
# PURO HOCKEY v1.0.0
# Completamente automatizado sin interaccion innecesaria

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   DEPLOYMENT AUTOMATIZADO - VERCEL + RAILWAY" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# FASE 1: VERCEL
# ═══════════════════════════════════════════════════════════════════

Write-Host "FASE 1: VERCEL DEPLOYMENT" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Paso 1: Verificando requisitos..." -ForegroundColor $Cyan
if ((git --version 2>$null) -and (node --version 2>$null) -and (npm --version 2>$null)) {
    Write-Host "  ✓ Git, Node, npm: OK" -ForegroundColor $Green
} else {
    Write-Host "  ✗ Faltan requisitos" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Paso 2: Instalando Vercel CLI..." -ForegroundColor $Cyan
try {
    $null = vercel --version 2>$null
    Write-Host "  ✓ Vercel CLI: Ya instalado" -ForegroundColor $Green
} catch {
    Write-Host "  Instalando..." -ForegroundColor $Yellow
    npm install -g vercel -q
    Write-Host "  ✓ Vercel CLI: Instalado" -ForegroundColor $Green
}

Write-Host ""
Write-Host "Paso 3: Build local..." -ForegroundColor $Cyan
npm run build --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Build: OK" -ForegroundColor $Green
} else {
    Write-Host "  ✗ Build: FALLÓ" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Paso 4: Deploy a Vercel (usando CLI existente)..." -ForegroundColor $Cyan
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor $Yellow
Write-Host "1. Se abrirá navegador para LOGIN" -ForegroundColor $Blue
Write-Host "2. Autoriza con GitHub" -ForegroundColor $Blue
Write-Host "3. El deploy ocurrirá automáticamente" -ForegroundColor $Blue
Write-Host "4. Cuando veas la URL, copiala" -ForegroundColor $Blue
Write-Host ""

# Deploy
$deployOutput = vercel --prod --yes 2>&1

# Mostrar output
Write-Host $deployOutput
Write-Host ""

# Extraer URL
$urlMatch = $deployOutput | Select-String -Pattern "https://[a-zA-Z0-9\-]+\.vercel\.app" | Select-Object -First 1
if ($urlMatch) {
    $vercelUrl = $urlMatch.ToString().Trim()
    Write-Host "✓ URL detectada: $vercelUrl" -ForegroundColor $Green
} else {
    Write-Host ""
    Write-Host "⚠ No se detectó URL automáticamente" -ForegroundColor $Yellow
    Write-Host "Abre: https://vercel.com/dashboard" -ForegroundColor $Blue
    Write-Host "Busca proyecto: puro-hockey" -ForegroundColor $Blue
    $vercelUrl = Read-Host "Pega la URL"
}

if (-not ($vercelUrl -like "*vercel.app*")) {
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "✓ Frontend: $vercelUrl" -ForegroundColor $Green
Write-Host ""

# Guardar URL
$vercelUrl | Out-File "VERCEL_URL.txt" -Encoding UTF8

# ═══════════════════════════════════════════════════════════════════
# FASE 2: RAILWAY
# ═══════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "FASE 2: RAILWAY DEPLOYMENT" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo Railway..." -ForegroundColor $Cyan
Start-Process "https://railway.app"

Write-Host ""
Write-Host "INSTRUCCIONES EN RAILWAY:" -ForegroundColor $Green
Write-Host ""
Write-Host "1. Login con GitHub" -ForegroundColor $Blue
Write-Host "2. Click: 'Start a New Project'" -ForegroundColor $Blue
Write-Host "3. Click: 'Deploy from GitHub repo'" -ForegroundColor $Blue
Write-Host "4. Selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. CREAR SERVICIOS:" -ForegroundColor $Blue
Write-Host "   A) PostgreSQL:" -ForegroundColor $Cyan
Write-Host "      - Add Service > Database > PostgreSQL" -ForegroundColor $Blue
Write-Host "      - Espera 1-2 minutos" -ForegroundColor $Blue
Write-Host ""
Write-Host "   B) Node.js Backend:" -ForegroundColor $Cyan
Write-Host "      - Add Service > GitHub Repo" -ForegroundColor $Blue
Write-Host "      - Repo: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "      - Name: puro-hockey-backend" -ForegroundColor $Blue
Write-Host ""
Write-Host "6. EN SERVICIO NODE.JS - CLICK: Variables" -ForegroundColor $Blue
Write-Host ""
Write-Host "   Agrega EXACTAMENTE:" -ForegroundColor $Yellow
Write-Host "   NODE_ENV = production" -ForegroundColor $Cyan
Write-Host "   PORT = 5000" -ForegroundColor $Cyan
Write-Host "   LOG_LEVEL = info" -ForegroundColor $Cyan
Write-Host "   DATABASE_URL = " -NoNewline -ForegroundColor $Cyan
Write-Host "`${{Postgres.DATABASE_URL}}" -ForegroundColor $Blue
Write-Host "   JWT_SECRET = ClaveSeguraMinimo32Caracteres123456" -ForegroundColor $Cyan
Write-Host "   CORS_ORIGIN = $vercelUrl" -ForegroundColor $Cyan
Write-Host ""
Write-Host "7. Click: Save" -ForegroundColor $Blue
Write-Host "8. Espera 5-10 minutos para deploy" -ForegroundColor $Blue
Write-Host ""

$continueRailway = Read-Host "Presiona Enter cuando hayas creado servicios y variables"

Write-Host ""
Write-Host "Obteniendo URL de Railway..." -ForegroundColor $Cyan
Write-Host ""
Write-Host "En Railway:" -ForegroundColor $Yellow
Write-Host "1. Click en: puro-hockey-backend" -ForegroundColor $Blue
Write-Host "2. Busca: 'Public URL'" -ForegroundColor $Blue
Write-Host "3. Copia la URL" -ForegroundColor $Blue
Write-Host ""

$railwayUrl = Read-Host "Pega la URL de Railway"

if (-not ($railwayUrl -like "*railway.app*")) {
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host "✓ Backend: $railwayUrl" -ForegroundColor $Green
Write-Host ""

# Guardar URL
$railwayUrl | Out-File "RAILWAY_URL.txt" -Encoding UTF8

# ═══════════════════════════════════════════════════════════════════
# FASE 3: CONECTAR VERCEL + RAILWAY
# ═══════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "FASE 3: CONECTAR VERCEL + RAILWAY" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo Vercel Dashboard..." -ForegroundColor $Cyan
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:" -ForegroundColor $Green
Write-Host ""
Write-Host "1. Abre proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host "2. Settings > Environment Variables" -ForegroundColor $Blue
Write-Host "3. Edita o crea:" -ForegroundColor $Blue
Write-Host ""
Write-Host "   VITE_API_URL = $railwayUrl" -ForegroundColor $Cyan
$railwayHost = $railwayUrl -replace "https://", ""
Write-Host "   VITE_WS_URL = wss://$railwayHost" -ForegroundColor $Cyan
Write-Host ""
Write-Host "4. Click: Save" -ForegroundColor $Blue
Write-Host "5. Vercel se redeployará automáticamente" -ForegroundColor $Blue
Write-Host ""

$vercelUpdated = Read-Host "Presiona Enter cuando hayas actualizado Vercel"

Write-Host ""

# ═══════════════════════════════════════════════════════════════════
# VERIFICACION FINAL
# ═══════════════════════════════════════════════════════════════════

Write-Host "VERIFICACION FINAL" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "1. Frontend (debería cargar):" -ForegroundColor $Cyan
Write-Host "   $vercelUrl" -ForegroundColor $Blue
Write-Host ""
Write-Host "2. Health Check (JSON):" -ForegroundColor $Cyan
Write-Host "   $railwayUrl/health" -ForegroundColor $Blue
Write-Host ""
Write-Host "3. Login:" -ForegroundColor $Cyan
Write-Host "   Email: admin@example.com" -ForegroundColor $Blue
Write-Host "   Password: password" -ForegroundColor $Blue
Write-Host ""

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   DEPLOYMENT COMPLETADO" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Write-Host "URLs en vivo:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Frontend: $vercelUrl" -ForegroundColor $Cyan
Write-Host "Backend:  $railwayUrl" -ForegroundColor $Cyan
Write-Host "GitHub:   https://github.com/matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host ""

Write-Host "Status: EN PRODUCCION" -ForegroundColor $Green
Write-Host ""

Write-Host "URLs guardadas en:" -ForegroundColor $Yellow
Write-Host "  - VERCEL_URL.txt" -ForegroundColor $Blue
Write-Host "  - RAILWAY_URL.txt" -ForegroundColor $Blue
Write-Host ""

Read-Host "Presiona Enter para terminar"

# Deployment Automatizado Final - Vercel + Railway
# PURO HOCKEY v1.0.0

Clear-Host

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host ""
Write-Host "================================================================"
Write-Host "   DEPLOYMENT AUTOMATIZADO - VERCEL + RAILWAY"
Write-Host "   PURO HOCKEY v1.0.0"
Write-Host "================================================================"
Write-Host ""

# FASE 1: VERCEL
Write-Host "FASE 1: VERCEL DEPLOYMENT"
Write-Host "================================================================"
Write-Host ""

Write-Host "Paso 1: Verificando requisitos..."
if ((git --version 2>$null) -and (node --version 2>$null) -and (npm --version 2>$null)) {
    Write-Host "  OK - Git, Node, npm"
} else {
    Write-Host "  ERROR - Faltan requisitos"
    exit 1
}

Write-Host ""
Write-Host "Paso 2: Instalando Vercel CLI..."
try {
    $null = vercel --version 2>$null
    Write-Host "  OK - Vercel CLI instalado"
} catch {
    Write-Host "  Instalando Vercel CLI..."
    npm install -g vercel -q
    Write-Host "  OK - Vercel CLI instalado"
}

Write-Host ""
Write-Host "Paso 3: Build local..."
npm run build --silent
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Build completado"
} else {
    Write-Host "  ERROR - Build fallo"
    exit 1
}

Write-Host ""
Write-Host "Paso 4: Deploy a Vercel..."
Write-Host ""
Write-Host "INSTRUCCIONES:"
Write-Host "1. Se abrira navegador para LOGIN"
Write-Host "2. Autoriza con GitHub"
Write-Host "3. El deploy ocurrira automaticamente"
Write-Host "4. Cuando veas la URL, copiala"
Write-Host ""

# Deploy
$deployOutput = vercel --prod --yes 2>&1

Write-Host $deployOutput
Write-Host ""

# Extraer URL
$urlMatch = $deployOutput | Select-String -Pattern "https://[a-zA-Z0-9\-]+\.vercel\.app" | Select-Object -First 1
if ($urlMatch) {
    $vercelUrl = $urlMatch.ToString().Trim()
    Write-Host "URL detectada: $vercelUrl"
} else {
    Write-Host ""
    Write-Host "No se detecto URL automaticamente"
    Write-Host "Abre: https://vercel.com/dashboard"
    $vercelUrl = Read-Host "Pega la URL"
}

if (-not ($vercelUrl -like "*vercel.app*")) {
    Write-Host "ERROR: URL invalida"
    exit 1
}

Write-Host ""
Write-Host "OK - Frontend: $vercelUrl"
Write-Host ""

# Guardar URL
$vercelUrl | Out-File "VERCEL_URL.txt" -Encoding UTF8

# FASE 2: RAILWAY
Write-Host ""
Write-Host "FASE 2: RAILWAY DEPLOYMENT"
Write-Host "================================================================"
Write-Host ""

Write-Host "Abriendo Railway..."
Start-Process "https://railway.app"

Write-Host ""
Write-Host "INSTRUCCIONES EN RAILWAY:"
Write-Host ""
Write-Host "1. Login con GitHub"
Write-Host "2. Click: Start a New Project"
Write-Host "3. Click: Deploy from GitHub repo"
Write-Host "4. Selecciona: matiasuke/puro-hockey"
Write-Host ""
Write-Host "5. CREAR SERVICIOS:"
Write-Host "   A) PostgreSQL:"
Write-Host "      - Add Service > Database > PostgreSQL"
Write-Host "      - Espera 1-2 minutos"
Write-Host ""
Write-Host "   B) Node.js Backend:"
Write-Host "      - Add Service > GitHub Repo"
Write-Host "      - Repo: matiasuke/puro-hockey"
Write-Host "      - Name: puro-hockey-backend"
Write-Host ""
Write-Host "6. EN SERVICIO NODE.JS - CLICK: Variables"
Write-Host ""
Write-Host "   Agrega EXACTAMENTE:"
Write-Host "   NODE_ENV = production"
Write-Host "   PORT = 5000"
Write-Host "   LOG_LEVEL = info"
Write-Host "   DATABASE_URL = DOLLAR_BRACE_BRACKET_Postgres.DATABASE_URL BRACKET_DOLLAR_BRACE"
Write-Host "   JWT_SECRET = ClaveSeguraMinimo32Caracteres123456"
Write-Host "   CORS_ORIGIN = $vercelUrl"
Write-Host ""
Write-Host "7. Click: Save"
Write-Host "8. Espera 5-10 minutos para deploy"
Write-Host ""

$continueRailway = Read-Host "Presiona Enter cuando hayas creado servicios y variables"

Write-Host ""
Write-Host "Obteniendo URL de Railway..."
Write-Host ""
Write-Host "En Railway:"
Write-Host "1. Click en: puro-hockey-backend"
Write-Host "2. Busca: Public URL"
Write-Host "3. Copia la URL"
Write-Host ""

$railwayUrl = Read-Host "Pega la URL de Railway"

if (-not ($railwayUrl -like "*railway.app*")) {
    Write-Host "ERROR: URL invalida"
    exit 1
}

Write-Host "OK - Backend: $railwayUrl"
Write-Host ""

# Guardar URL
$railwayUrl | Out-File "RAILWAY_URL.txt" -Encoding UTF8

# FASE 3: CONECTAR
Write-Host ""
Write-Host "FASE 3: CONECTAR VERCEL + RAILWAY"
Write-Host "================================================================"
Write-Host ""

Write-Host "Abriendo Vercel Dashboard..."
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:"
Write-Host ""
Write-Host "1. Abre proyecto: puro-hockey"
Write-Host "2. Settings > Environment Variables"
Write-Host "3. Edita o crea:"
Write-Host ""
Write-Host "   VITE_API_URL = $railwayUrl"
$railwayHost = $railwayUrl -replace "https://", ""
Write-Host "   VITE_WS_URL = wss://$railwayHost"
Write-Host ""
Write-Host "4. Click: Save"
Write-Host "5. Vercel se redeployara automaticamente"
Write-Host ""

$vercelUpdated = Read-Host "Presiona Enter cuando hayas actualizado Vercel"

Write-Host ""

# VERIFICACION FINAL
Write-Host "VERIFICACION FINAL"
Write-Host "================================================================"
Write-Host ""

Write-Host "1. Frontend (deberia cargar):"
Write-Host "   $vercelUrl"
Write-Host ""
Write-Host "2. Health Check (JSON):"
Write-Host "   $railwayUrl/health"
Write-Host ""
Write-Host "3. Login:"
Write-Host "   Email: admin@example.com"
Write-Host "   Password: password"
Write-Host ""

Write-Host ""
Write-Host "================================================================"
Write-Host "   DEPLOYMENT COMPLETADO"
Write-Host "================================================================"
Write-Host ""

Write-Host "URLs en vivo:"
Write-Host ""
Write-Host "Frontend: $vercelUrl"
Write-Host "Backend:  $railwayUrl"
Write-Host "GitHub:   https://github.com/matiasuke/puro-hockey"
Write-Host ""

Write-Host "Status: EN PRODUCCION"
Write-Host ""

Write-Host "URLs guardadas en:"
Write-Host "  - VERCEL_URL.txt"
Write-Host "  - RAILWAY_URL.txt"
Write-Host ""

Read-Host "Presiona Enter para terminar"

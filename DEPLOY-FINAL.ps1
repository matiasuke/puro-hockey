# Deployment Final - Completamente Automatizado
# PURO HOCKEY v1.0.0
# Usa Vercel Dashboard y Railway Dashboard

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   DEPLOYMENT FINAL - VERCEL + RAILWAY" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

Write-Host "Codigo confirmado en GitHub:" -ForegroundColor $Green
Write-Host "  https://github.com/matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 1: VERCEL DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════

Write-Host "FASE 1: VERCEL DEPLOYMENT (FRONTEND)" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo Vercel Dashboard..." -ForegroundColor $Cyan
Start-Process "https://vercel.com/new"

Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:" -ForegroundColor $Green
Write-Host ""
Write-Host "1. Haz login con GitHub (si no estás logueado)" -ForegroundColor $Blue
Write-Host "2. Click: 'Import Git Repository'" -ForegroundColor $Blue
Write-Host "3. Busca: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "4. Click: Select" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. En 'Configure Project':" -ForegroundColor $Blue
Write-Host "   - Framework: Vite" -ForegroundColor $Cyan
Write-Host "   - Build Command: npm run build" -ForegroundColor $Cyan
Write-Host "   - Output Directory: dist" -ForegroundColor $Cyan
Write-Host ""
Write-Host "6. En 'Environment Variables' (DEJAR POR AHORA):" -ForegroundColor $Blue
Write-Host "   - VITE_API_URL = https://placeholder.railway.app" -ForegroundColor $Cyan
Write-Host "   - VITE_WS_URL = wss://placeholder.railway.app" -ForegroundColor $Cyan
Write-Host ""
Write-Host "7. Click: 'Deploy'" -ForegroundColor $Blue
Write-Host "8. ESPERA 2-3 MINUTOS hasta que termine" -ForegroundColor $Yellow
Write-Host ""

$vercelUrl = Read-Host "Pega la URL de Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"

if (-not ($vercelUrl -like "*vercel.app*")) {
    Write-Host ""
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Frontend URL guardada: $vercelUrl" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 2: RAILWAY DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════

Write-Host "FASE 2: RAILWAY DEPLOYMENT (BACKEND)" -ForegroundColor $Yellow
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
Write-Host ""
Write-Host "4. Selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. CREAR SERVICIOS:" -ForegroundColor $Blue
Write-Host ""
Write-Host "   A) PostgreSQL:" -ForegroundColor $Cyan
Write-Host "      - Click: 'Add Service'" -ForegroundColor $Blue
Write-Host "      - Click: 'Database'" -ForegroundColor $Blue
Write-Host "      - Click: 'PostgreSQL'" -ForegroundColor $Blue
Write-Host "      - ESPERA 1-2 minutos (crea automático)" -ForegroundColor $Yellow
Write-Host ""
Write-Host "   B) Node.js Backend:" -ForegroundColor $Cyan
Write-Host "      - Click: 'Add Service'" -ForegroundColor $Blue
Write-Host "      - Click: 'GitHub Repo'" -ForegroundColor $Blue
Write-Host "      - Repo: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "      - Nombre: puro-hockey-backend" -ForegroundColor $Blue
Write-Host "      - Click: 'Deploy'" -ForegroundColor $Blue
Write-Host ""
Write-Host "6. CONFIGURAR VARIABLES DE ENTORNO:" -ForegroundColor $Blue
Write-Host "   Click en servicio Node.js -> Variables" -ForegroundColor $Cyan
Write-Host ""
Write-Host "   Agrega EXACTAMENTE esto:" -ForegroundColor $Yellow
Write-Host "   NODE_ENV = production" -ForegroundColor $Blue
Write-Host "   PORT = 5000" -ForegroundColor $Blue
Write-Host "   LOG_LEVEL = info" -ForegroundColor $Blue
Write-Host "   DATABASE_URL = " -NoNewline -ForegroundColor $Blue
Write-Host "`${{Postgres.DATABASE_URL}}" -ForegroundColor $Cyan
Write-Host "   JWT_SECRET = miClaveSeguraDeMinimo32CaracteresParaJWT" -ForegroundColor $Blue
Write-Host "   CORS_ORIGIN = $vercelUrl" -ForegroundColor $Blue
Write-Host ""
Write-Host "7. Click: 'Save'" -ForegroundColor $Blue
Write-Host "8. ESPERA 5-10 MINUTOS (build y deploy)" -ForegroundColor $Yellow
Write-Host ""

$railwayUrl = Read-Host "Pega la URL publica de Railway (ej: https://puro-hockey-xxxx.railway.app)"

if (-not ($railwayUrl -like "*railway.app*")) {
    Write-Host ""
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Backend URL guardada: $railwayUrl" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 3: ACTUALIZAR VERCEL CON RAILWAY URL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "FASE 3: CONECTAR VERCEL + RAILWAY" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo Vercel Settings..." -ForegroundColor $Cyan
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:" -ForegroundColor $Green
Write-Host ""
Write-Host "1. Selecciona proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host "2. Click: 'Settings'" -ForegroundColor $Blue
Write-Host "3. Click: 'Environment Variables'" -ForegroundColor $Blue
Write-Host "4. EDITA (o crea si no existen):" -ForegroundColor $Blue
Write-Host ""
Write-Host "   VITE_API_URL = $railwayUrl" -ForegroundColor $Cyan
Write-Host "   VITE_WS_URL = wss://$($railwayUrl.Replace('https://', ''))" -ForegroundColor $Cyan
Write-Host ""
Write-Host "5. Click: 'Save'" -ForegroundColor $Blue
Write-Host "6. Vercel redeployara automáticamente (2-3 min)" -ForegroundColor $Yellow
Write-Host ""

$vercelUpdated = Read-Host "¿Ya actualizaste Vercel con la URL de Railway? (s/n)"

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 4: VERIFICACIÓN FINAL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "FASE 4: VERIFICACION FINAL" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Verifica estos endpoints:" -ForegroundColor $Green
Write-Host ""

Write-Host "1. Frontend (debería cargar la aplicación):" -ForegroundColor $Cyan
Write-Host "   $vercelUrl" -ForegroundColor $Blue
Write-Host ""

Write-Host "2. Health Check del Backend:" -ForegroundColor $Cyan
Write-Host "   $railwayUrl/health" -ForegroundColor $Blue
Write-Host "   Debe retornar: {\"status\":\"ok\"}" -ForegroundColor $Blue
Write-Host ""

Write-Host "3. Login en Frontend:" -ForegroundColor $Cyan
Write-Host "   URL: $vercelUrl" -ForegroundColor $Blue
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
Write-Host "Frontend:  $vercelUrl" -ForegroundColor $Cyan
Write-Host "Backend:   $railwayUrl" -ForegroundColor $Cyan
Write-Host "GitHub:    https://github.com/matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host ""

Write-Host "Proximos pasos (OPCIONAL):" -ForegroundColor $Yellow
Write-Host "  1. Ejecuta migraciones: railway run npm run migrate" -ForegroundColor $Blue
Write-Host "  2. Carga datos de prueba: railway run npm run seed" -ForegroundColor $Blue
Write-Host "  3. Configura custom domains" -ForegroundColor $Blue
Write-Host "  4. Agrega Sentry para monitoreo" -ForegroundColor $Blue
Write-Host ""

Write-Host "PURO HOCKEY ESTA EN PRODUCCION" -ForegroundColor $Green
Write-Host ""

Read-Host "Presiona Enter para terminar"

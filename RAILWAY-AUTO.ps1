# Automatizacion Completa de Railway
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   AUTOMATIZACION RAILWAY - GUIDED SETUP" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 1: OBTENER URL DE VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 1: Configuracion de Vercel" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

$vercelUrl = Read-Host "Pega la URL de Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"

if (-not ($vercelUrl -like "*vercel.app*")) {
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host "Vercel URL guardada: $vercelUrl" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 2: ABRIR RAILWAY
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 2: Abriendo Railway..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo navegador a Railway..." -ForegroundColor $Cyan
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
Write-Host "   A) PostgreSQL:" -ForegroundColor $Cyan
Write-Host "      - Add Service > Database > PostgreSQL" -ForegroundColor $Blue
Write-Host "      - Espera 1-2 minutos" -ForegroundColor $Blue
Write-Host ""
Write-Host "   B) Node.js:" -ForegroundColor $Cyan
Write-Host "      - Add Service > GitHub Repo" -ForegroundColor $Blue
Write-Host "      - Repo: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "      - Name: puro-hockey-backend" -ForegroundColor $Blue
Write-Host ""
Write-Host "6. En el servicio Node.js, click: 'Variables'" -ForegroundColor $Blue
Write-Host ""

Write-Host ""
Write-Host "Presiona Enter cuando hayas creado los servicios..."
Read-Host

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 3: CONFIGURAR VARIABLES
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 3: Configurando variables de entorno..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Agrega EXACTAMENTE estas variables en Railway:" -ForegroundColor $Green
Write-Host ""

Write-Host "NODE_ENV=production" -ForegroundColor $Cyan
Write-Host "PORT=5000" -ForegroundColor $Cyan
Write-Host "LOG_LEVEL=info" -ForegroundColor $Cyan
Write-Host "DATABASE_URL=" -NoNewline -ForegroundColor $Cyan
Write-Host "`${{Postgres.DATABASE_URL}}" -ForegroundColor $Blue
Write-Host "JWT_SECRET=miClaveSeguraDeMinimo32CaracteresParaJWT" -ForegroundColor $Cyan
Write-Host "CORS_ORIGIN=$vercelUrl" -ForegroundColor $Cyan
Write-Host ""

Write-Host "IMPORTANTE:" -ForegroundColor $Yellow
Write-Host "- Copia EXACTAMENTE DATABASE_URL = " -NoNewline -ForegroundColor $Blue
Write-Host "`${{Postgres.DATABASE_URL}}" -ForegroundColor $Red
Write-Host "- JWT_SECRET debe ser UNICO y muy largo" -ForegroundColor $Blue
Write-Host "- CORS_ORIGIN = $vercelUrl" -ForegroundColor $Blue
Write-Host ""

Write-Host "Presiona Enter cuando hayas configurado todas las variables..."
Read-Host

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 4: OBTENER URL DE RAILWAY
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 4: Obteniendo URL publica de Railway..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "En Railway Dashboard:" -ForegroundColor $Cyan
Write-Host "1. Click en servicio: puro-hockey-backend" -ForegroundColor $Blue
Write-Host "2. Busca: 'Public URL'" -ForegroundColor $Blue
Write-Host "3. Copia la URL" -ForegroundColor $Blue
Write-Host ""

$railwayUrl = Read-Host "Pega la URL publica de Railway (ej: https://puro-hockey-xxxx.railway.app)"

if (-not ($railwayUrl -like "*railway.app*")) {
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host "Railway URL guardada: $railwayUrl" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 5: ACTUALIZAR VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 5: Actualizando Vercel..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo Vercel Dashboard..." -ForegroundColor $Cyan
Start-Process "https://vercel.com/dashboard"

Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:" -ForegroundColor $Green
Write-Host ""
Write-Host "1. Abre tu proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host "2. Settings > Environment Variables" -ForegroundColor $Blue
Write-Host "3. EDITA:" -ForegroundColor $Blue
Write-Host ""
Write-Host "   VITE_API_URL = $railwayUrl" -ForegroundColor $Cyan
Write-Host "   VITE_WS_URL = wss://$($railwayUrl.Replace('https://', ''))" -ForegroundColor $Cyan
Write-Host ""
Write-Host "4. Click: Save" -ForegroundColor $Blue
Write-Host "5. Vercel redeploy automático (2-3 min)" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Presiona Enter cuando hayas actualizado Vercel..."
Read-Host

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 6: MIGRACIONES (OPCIONAL)
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 6: Migraciones (OPCIONAL)" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Para crear tablas en la BD:" -ForegroundColor $Cyan
Write-Host "En Railway Dashboard:" -ForegroundColor $Blue
Write-Host "1. Click en servicio: puro-hockey-backend" -ForegroundColor $Blue
Write-Host "2. Click: 'Connect'" -ForegroundColor $Blue
Write-Host "3. Terminal:" -ForegroundColor $Blue
Write-Host "   npm run migrate" -ForegroundColor $Cyan
Write-Host "   npm run seed" -ForegroundColor $Cyan
Write-Host ""

$migraciones = Read-Host "¿Ya ejecutaste migraciones? (s/n)"

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════════════════

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

Write-Host "VERIFICACION:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Frontend (deberia cargar):" -ForegroundColor $Blue
Write-Host "   $vercelUrl" -ForegroundColor $Cyan
Write-Host ""
Write-Host "2. Health Check (deberia retornar JSON):" -ForegroundColor $Blue
Write-Host "   $railwayUrl/health" -ForegroundColor $Cyan
Write-Host ""
Write-Host "3. Login:" -ForegroundColor $Blue
Write-Host "   Email: admin@example.com" -ForegroundColor $Cyan
Write-Host "   Password: password" -ForegroundColor $Cyan
Write-Host ""

Write-Host ""
Write-Host "PURO HOCKEY ESTA EN PRODUCCION" -ForegroundColor $Green
Write-Host ""

Read-Host "Presiona Enter para terminar"

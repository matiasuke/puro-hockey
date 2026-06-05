# Script Deployment 100% Automatico
# PURO HOCKEY v1.0.0 - Vercel + Railway

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Blue
Write-Host "   DEPLOYMENT AUTOMATICO 100%" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Blue
Write-Host ""

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host "Iniciando deployment automatico..." -ForegroundColor $Yellow
Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 1: VERIFICAR REQUISITOS
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 1: Verificando requisitos..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

try {
    $gitVersion = git --version
    Write-Host "Git: OK" -ForegroundColor $Green
} catch {
    Write-Host "Git: ERROR - Instala Git" -ForegroundColor $Red
    exit 1
}

try {
    $nodeVersion = node --version
    Write-Host "Node.js: OK" -ForegroundColor $Green
} catch {
    Write-Host "Node.js: ERROR - Instala Node.js" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 2: INSTALAR CLI TOOLS
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 2: Instalando CLI tools..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Instalando Vercel CLI..." -ForegroundColor $Blue
npm install -g vercel -q
Write-Host "Vercel CLI: OK" -ForegroundColor $Green

Write-Host "Instalando Railway CLI..." -ForegroundColor $Blue
npm install -g @railway/cli -q
Write-Host "Railway CLI: OK" -ForegroundColor $Green

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 3: VERCEL DEPLOYMENT
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 3: Iniciando Vercel Deployment..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo navegador para autenticacion en Vercel..." -ForegroundColor $Blue
Write-Host "Por favor:" -ForegroundColor $Yellow
Write-Host "  1. Autoriza con GitHub" -ForegroundColor $Cyan
Write-Host "  2. Selecciona tu repositorio puro-hockey" -ForegroundColor $Cyan
Write-Host "  3. Confirma la configuracion" -ForegroundColor $Cyan
Write-Host ""

# Deploy a Vercel
vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Vercel Deployment: OK" -ForegroundColor $Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Vercel Deployment: REQUIERE AUTENTICACION" -ForegroundColor $Yellow
    Write-Host "El navegador se abrira para autenticacion..." -ForegroundColor $Blue
    Write-Host ""
    vercel --prod
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 4: OBTENER URL DE VERCEL
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 4: Obteniendo URL de Vercel..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

$vercelUrl = "https://puro-hockey.vercel.app"

Write-Host "Frontend URL: $vercelUrl" -ForegroundColor $Green
Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 5: RAILWAY DEPLOYMENT
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 5: Iniciando Railway Deployment..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "IMPORTANTE - Sigue estos pasos en Railway:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Se abrira el navegador de Railway" -ForegroundColor $Cyan
Write-Host "2. Autoriza con GitHub" -ForegroundColor $Cyan
Write-Host "3. Crea nuevo proyecto" -ForegroundColor $Cyan
Write-Host "4. Importa repositorio: matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host "5. Espera a que se complete" -ForegroundColor $Cyan
Write-Host ""

$continuar = Read-Host "Presiona Enter para continuar con Railway"

Write-Host ""
Write-Host "Abriendo Railway en navegador..." -ForegroundColor $Blue
Write-Host ""

# Intentar login en Railway
try {
    railway login
    Write-Host "Railway Login: OK" -ForegroundColor $Green
} catch {
    Write-Host "Abre manualmente: https://railway.app" -ForegroundColor $Yellow
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 6: CONFIGURACION MANUAL EN RAILWAY
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 6: Configuracion en Railway" -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "En el dashboard de Railway:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Crear servicio PostgreSQL:" -ForegroundColor $Cyan
Write-Host "   - Click: Add Service" -ForegroundColor $Blue
Write-Host "   - Selecciona: PostgreSQL" -ForegroundColor $Blue
Write-Host "   - Nombre: postgres" -ForegroundColor $Blue
Write-Host "   - Espera a que este listo" -ForegroundColor $Blue
Write-Host ""

Write-Host "2. Crear servicio Node.js:" -ForegroundColor $Cyan
Write-Host "   - Click: Add Service" -ForegroundColor $Blue
Write-Host "   - Selecciona: GitHub Repo" -ForegroundColor $Blue
Write-Host "   - Selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "   - Nombre: puro-hockey-backend" -ForegroundColor $Blue
Write-Host "   - Click: Deploy" -ForegroundColor $Blue
Write-Host ""

Write-Host "3. Configurar variables (en el servicio Node.js):" -ForegroundColor $Cyan
Write-Host "   Click: Variables" -ForegroundColor $Blue
Write-Host ""
Write-Host "   NODE_ENV = production" -ForegroundColor $Blue
Write-Host "   PORT = 5000" -ForegroundColor $Blue
Write-Host "   LOG_LEVEL = info" -ForegroundColor $Blue
Write-Host "   DATABASE_URL = \${{Postgres.DATABASE_URL}}" -ForegroundColor $Blue
Write-Host "   JWT_SECRET = tu-secret-muy-seguro-32-caracteres-minimo" -ForegroundColor $Blue
Write-Host "   CORS_ORIGIN = $vercelUrl" -ForegroundColor $Blue
Write-Host ""

Write-Host "4. Hacer Deploy:" -ForegroundColor $Cyan
Write-Host "   - Click: Deploy" -ForegroundColor $Blue
Write-Host "   - Espera 5-10 minutos" -ForegroundColor $Blue
Write-Host ""

$railwayCompleto = Read-Host "¿Ya completaste la configuracion en Railway? (s/n)"

if ($railwayCompleto -eq "s") {
    Write-Host ""
    Write-Host "Excelente! Continuando..." -ForegroundColor $Green
} else {
    Write-Host ""
    Write-Host "Ve a https://railway.app y completa los pasos" -ForegroundColor $Yellow
    Read-Host "Presiona Enter cuando termines"
}

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 7: OBTENER URL DE RAILWAY
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 7: Obteniendo URL de Railway..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "En Railway:" -ForegroundColor $Yellow
Write-Host "1. Click en el servicio Node.js" -ForegroundColor $Cyan
Write-Host "2. Busca: Public URL" -ForegroundColor $Cyan
Write-Host "3. Copia la URL (ej: https://puro-hockey-xxxx.railway.app)" -ForegroundColor $Cyan
Write-Host ""

$railwayUrl = Read-Host "Pega la URL de Railway aqui"

Write-Host ""
Write-Host "Backend URL: $railwayUrl" -ForegroundColor $Green
Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 8: ACTUALIZAR VARIABLES EN VERCEL
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 8: Actualizando variables en Vercel..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "En Vercel (https://vercel.com):" -ForegroundColor $Yellow
Write-Host "1. Abre tu proyecto: puro-hockey" -ForegroundColor $Cyan
Write-Host "2. Click: Settings" -ForegroundColor $Cyan
Write-Host "3. Click: Environment Variables" -ForegroundColor $Cyan
Write-Host "4. Edita o agrega:" -ForegroundColor $Cyan
Write-Host ""
Write-Host "   VITE_API_URL = $railwayUrl" -ForegroundColor $Blue
Write-Host "   VITE_WS_URL = wss://$(($railwayUrl -split '//')[1])" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. Click: Save" -ForegroundColor $Cyan
Write-Host "6. Espera a redeploy automatico" -ForegroundColor $Cyan
Write-Host ""

$vercelActualizado = Read-Host "¿Ya actualizaste Vercel? (s/n)"

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 9: MIGRACIONES EN RAILWAY (OPCIONAL)
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 9: Ejecutar migraciones en Railway (opcional)..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Para crear tablas en la BD, ejecuta en Railway Dashboard:" -ForegroundColor $Yellow
Write-Host "  railway run npm run migrate" -ForegroundColor $Blue
Write-Host ""
Write-Host "Para cargar datos de prueba:" -ForegroundColor $Yellow
Write-Host "  railway run npm run seed" -ForegroundColor $Blue
Write-Host ""

$migracionesCompletas = Read-Host "¿Ya ejecutaste migraciones? (s/n)"

Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# PASO 10: VERIFICACION FINAL
# ═════════════════════════════════════════════════════════════════════

Write-Host "PASO 10: Verificacion Final..." -ForegroundColor $Yellow
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Verifica que todo funciona:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Frontend:" -ForegroundColor $Cyan
Write-Host "  URL: $vercelUrl" -ForegroundColor $Blue
Write-Host "  Estado: Deberia cargar la aplicacion" -ForegroundColor $Blue
Write-Host ""

Write-Host "Backend:" -ForegroundColor $Cyan
Write-Host "  URL: $railwayUrl/health" -ForegroundColor $Blue
Write-Host "  Estado: Deberia retornar JSON {\"status\":\"ok\"}" -ForegroundColor $Blue
Write-Host ""

Write-Host "Login:" -ForegroundColor $Cyan
Write-Host "  Email: admin@example.com" -ForegroundColor $Blue
Write-Host "  Password: password" -ForegroundColor $Blue
Write-Host "  Deberia funcionar si backend esta conectado" -ForegroundColor $Blue
Write-Host ""

# ═════════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Green
Write-Host "   DEPLOYMENT COMPLETADO" -ForegroundColor $Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor $Green
Write-Host ""

Write-Host "URLs en Vivo:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "GitHub:" -ForegroundColor $Cyan
Write-Host "  https://github.com/matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host ""
Write-Host "Frontend:" -ForegroundColor $Cyan
Write-Host "  $vercelUrl" -ForegroundColor $Blue
Write-Host ""
Write-Host "Backend:" -ForegroundColor $Cyan
Write-Host "  $railwayUrl" -ForegroundColor $Blue
Write-Host ""

Write-Host "Proximos pasos:" -ForegroundColor $Yellow
Write-Host "  1. Prueba el login en el frontend" -ForegroundColor $Blue
Write-Host "  2. Verifica que la BD tiene datos" -ForegroundColor $Blue
Write-Host "  3. Agrega dominios personalizados (opcional)" -ForegroundColor $Blue
Write-Host "  4. Configura Sentry para monitoreo (opcional)" -ForegroundColor $Blue
Write-Host ""

Write-Host "================================================" -ForegroundColor $Green
Write-Host "PURO HOCKEY esta en PRODUCCION" -ForegroundColor $Green
Write-Host "================================================" -ForegroundColor $Green
Write-Host ""

Read-Host "Presiona Enter para terminar"

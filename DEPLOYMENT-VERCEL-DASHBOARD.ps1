# Deployment via Vercel Dashboard - Sin CLI
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   DEPLOYMENT VERCEL VIA DASHBOARD (SIN CLI)" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

# Paso 1: Verificar repositorio en GitHub
Write-Host "PASO 1: Verificando repositorio en GitHub..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

$gitStatus = git status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git: OK - Repositorio local valido" -ForegroundColor $Green

    $remote = git config --get remote.origin.url
    Write-Host "Remote URL: $remote" -ForegroundColor $Cyan

    if ($remote -like "*puro-hockey*") {
        Write-Host "Repositorio: puro-hockey confirmado" -ForegroundColor $Green
    } else {
        Write-Host "ERROR: No es el repositorio puro-hockey" -ForegroundColor $Red
        exit 1
    }
} else {
    Write-Host "ERROR: No es un repositorio Git valido" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# Paso 2: Verificar codigo en GitHub
Write-Host "PASO 2: Verificando codigo en GitHub..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo: https://github.com/matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host ""

# Abrir GitHub en navegador
Start-Process "https://github.com/matiasuke/puro-hockey"

Write-Host "Verificando que el codigo este en GitHub:" -ForegroundColor $Yellow
Write-Host "  [ ] ¿Se abrió GitHub?" -ForegroundColor $Blue
Write-Host "  [ ] ¿Ves los archivos del proyecto?" -ForegroundColor $Blue
Write-Host "  [ ] ¿Está la rama 'main'?" -ForegroundColor $Blue
Write-Host ""

$confirmGithub = Read-Host "¿El codigo esta en GitHub? (s/n)"

if ($confirmGithub -ne "s") {
    Write-Host ""
    Write-Host "ERROR: Necesitas pushear el codigo a GitHub primero" -ForegroundColor $Red
    Write-Host "Ejecuta: .\push-automatico.ps1" -ForegroundColor $Yellow
    exit 1
}

Write-Host ""

# Paso 3: Abrir Vercel Dashboard
Write-Host "PASO 3: Preparando deployment en Vercel..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Se abrira el dashboard de Vercel" -ForegroundColor $Cyan
Write-Host ""
Write-Host "INSTRUCCIONES EN VERCEL:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Haz login con GitHub" -ForegroundColor $Blue
Write-Host "2. Click 'Add New' -> 'Project'" -ForegroundColor $Blue
Write-Host "3. Click 'Import Git Repository'" -ForegroundColor $Blue
Write-Host "4. Busca y selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. En 'Configure Project':" -ForegroundColor $Blue
Write-Host "   - Framework: Vite" -ForegroundColor $Cyan
Write-Host "   - Build Command: npm run build" -ForegroundColor $Cyan
Write-Host "   - Output Directory: dist" -ForegroundColor $Cyan
Write-Host ""
Write-Host "6. En 'Environment Variables' (IMPORTANTES):" -ForegroundColor $Blue
Write-Host "   - VITE_API_URL = https://tu-railway-url.railway.app" -ForegroundColor $Cyan
Write-Host "   - VITE_WS_URL = wss://tu-railway-url.railway.app" -ForegroundColor $Cyan
Write-Host ""
Write-Host "7. Click 'Deploy'" -ForegroundColor $Blue
Write-Host "8. Espera 2-3 minutos" -ForegroundColor $Blue
Write-Host ""

# Abrir Vercel
Start-Process "https://vercel.com/new"

Write-Host ""
$deploymentUrl = Read-Host "Pega la URL de tu deployment en Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"

if ($deploymentUrl -like "*vercel.app*") {
    Write-Host ""
    Write-Host "OK - Frontend URL registrada:" -ForegroundColor $Green
    Write-Host "$deploymentUrl" -ForegroundColor $Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# Paso 4: Railway
Write-Host "PASO 4: Continuando con Railway (Backend)..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Se abrira Railway para configurar el backend" -ForegroundColor $Cyan
Write-Host ""
Write-Host "INSTRUCCIONES EN RAILWAY:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "1. Ve a: https://railway.app" -ForegroundColor $Blue
Write-Host "2. Click 'Start a New Project'" -ForegroundColor $Blue
Write-Host "3. Click 'Deploy from GitHub repo'" -ForegroundColor $Blue
Write-Host ""
Write-Host "4. Selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. Crea Servicios:" -ForegroundColor $Blue
Write-Host "   a) PostgreSQL:" -ForegroundColor $Cyan
Write-Host "      - Click 'Add Service' -> 'Database' -> 'PostgreSQL'" -ForegroundColor $Blue
Write-Host "      - Nombre: postgres" -ForegroundColor $Blue
Write-Host ""
Write-Host "   b) Node.js Backend:" -ForegroundColor $Cyan
Write-Host "      - Click 'Add Service' -> 'GitHub Repo'" -ForegroundColor $Blue
Write-Host "      - Repo: matiasuke/puro-hockey" -ForegroundColor $Blue
Write-Host "      - Nombre: puro-hockey-backend" -ForegroundColor $Blue
Write-Host ""
Write-Host "6. Configura Variables de Entorno en el servicio Node.js:" -ForegroundColor $Blue
Write-Host "   NODE_ENV = production" -ForegroundColor $Cyan
Write-Host "   PORT = 5000" -ForegroundColor $Cyan
Write-Host "   LOG_LEVEL = info" -ForegroundColor $Cyan
Write-Host "   DATABASE_URL = " -NoNewline -ForegroundColor $Cyan
Write-Host "`${{Postgres.DATABASE_URL}}" -ForegroundColor $Blue
Write-Host "   JWT_SECRET = tu-clave-muy-segura-32-caracteres-minimo" -ForegroundColor $Cyan
Write-Host "   CORS_ORIGIN = $deploymentUrl" -ForegroundColor $Cyan
Write-Host ""
Write-Host "7. Click 'Deploy'" -ForegroundColor $Blue
Write-Host "8. Espera 5-10 minutos" -ForegroundColor $Blue
Write-Host ""

Start-Process "https://railway.app"

Write-Host ""
$railwayUrl = Read-Host "Pega la URL publica de Railway (ej: https://puro-hockey-xxxx.railway.app)"

if ($railwayUrl -like "*railway.app*") {
    Write-Host ""
    Write-Host "OK - Backend URL registrada:" -ForegroundColor $Green
    Write-Host "$railwayUrl" -ForegroundColor $Cyan
} else {
    Write-Host ""
    Write-Host "ERROR: URL invalida" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# Paso 5: Actualizar Vercel con Railway URL
Write-Host "PASO 5: Actualizando variables en Vercel..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Vuelve a Vercel para actualizar variables:" -ForegroundColor $Cyan
Write-Host ""
Write-Host "1. Ve a: https://vercel.com/dashboard" -ForegroundColor $Blue
Write-Host "2. Selecciona proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host "3. Click 'Settings'" -ForegroundColor $Blue
Write-Host "4. Click 'Environment Variables'" -ForegroundColor $Blue
Write-Host ""
Write-Host "5. Edita o crea:" -ForegroundColor $Blue
Write-Host "   VITE_API_URL = $railwayUrl" -ForegroundColor $Cyan
Write-Host "   VITE_WS_URL = wss://$($railwayUrl.Replace('https://', ''))" -ForegroundColor $Cyan
Write-Host ""
Write-Host "6. Click 'Save'" -ForegroundColor $Blue
Write-Host "7. Vercel redeployara automaticamente" -ForegroundColor $Blue
Write-Host ""

Start-Process "https://vercel.com/dashboard"

Write-Host ""
$vercelActualizado = Read-Host "¿Ya actualizaste Vercel con la URL de Railway? (s/n)"

Write-Host ""

# Paso 6: Migraciones en Railway (opcional)
Write-Host "PASO 6: Ejecutar migraciones en Railway (OPCIONAL)..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Para crear tablas en la BD, en Railway Dashboard:" -ForegroundColor $Cyan
Write-Host "  1. Click en el servicio Node.js" -ForegroundColor $Blue
Write-Host "  2. Click 'Connect'" -ForegroundColor $Blue
Write-Host "  3. Ejecuta: npm run migrate" -ForegroundColor $Cyan
Write-Host ""
Write-Host "Para cargar datos de prueba:" -ForegroundColor $Cyan
Write-Host "  npm run seed" -ForegroundColor $Cyan
Write-Host ""

$migraciones = Read-Host "¿Ya ejecutaste migraciones? (s/n)"

Write-Host ""

# Paso 7: Verificacion Final
Write-Host "PASO 7: Verificacion Final" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "Verifica los siguientes endpoints:" -ForegroundColor $Yellow
Write-Host ""

Write-Host "1. Frontend (deberia cargar la aplicacion):" -ForegroundColor $Cyan
Write-Host "   $deploymentUrl" -ForegroundColor $Blue
Write-Host ""

Write-Host "2. Health Check del Backend:" -ForegroundColor $Cyan
Write-Host "   $railwayUrl/health" -ForegroundColor $Blue
Write-Host "   Deberia retornar: {\"status\":\"ok\"}" -ForegroundColor $Cyan
Write-Host ""

Write-Host "3. Login en el Frontend:" -ForegroundColor $Cyan
Write-Host "   Usuario: admin@example.com" -ForegroundColor $Blue
Write-Host "   Contrasena: password" -ForegroundColor $Blue
Write-Host ""

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   DEPLOYMENT COMPLETADO" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Write-Host "URLs en vivo:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "Frontend:  $deploymentUrl" -ForegroundColor $Cyan
Write-Host "Backend:   $railwayUrl" -ForegroundColor $Cyan
Write-Host "GitHub:    https://github.com/matiasuke/puro-hockey" -ForegroundColor $Cyan
Write-Host ""

Write-Host ""
Read-Host "Presiona Enter para terminar"

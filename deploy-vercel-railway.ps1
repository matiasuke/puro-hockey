# Script de Deployment Automatizado - Vercel + Railway
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"

Write-Host ""
Write-Host "=========================================="
Write-Host "   DEPLOYMENT VERCEL + RAILWAY"
Write-Host "   PURO HOCKEY v1.0.0"
Write-Host "=========================================="
Write-Host ""

Write-Host "Configuracion:" -ForegroundColor $Yellow
Write-Host "  Proyecto: puro-hockey" -ForegroundColor $Green
Write-Host "  Usuario: matiasuke" -ForegroundColor $Green
Write-Host "  Repositorio: GitHub" -ForegroundColor $Green
Write-Host ""

# Paso 1: Verificar requisitos
Write-Host "PASO 1: Verificando requisitos..." -ForegroundColor $Yellow
Write-Host "=========================================="
Write-Host ""

$requisitosOK = $true

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "  Git: OK - $gitVersion" -ForegroundColor $Green
} catch {
    Write-Host "  Git: ERROR - No instalado" -ForegroundColor $Red
    $requisitosOK = $false
}

# Verificar Node
try {
    $nodeVersion = node --version
    Write-Host "  Node.js: OK - $nodeVersion" -ForegroundColor $Green
} catch {
    Write-Host "  Node.js: ERROR - No instalado" -ForegroundColor $Red
    $requisitosOK = $false
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "  npm: OK - $npmVersion" -ForegroundColor $Green
} catch {
    Write-Host "  npm: ERROR - No instalado" -ForegroundColor $Red
    $requisitosOK = $false
}

if (-not $requisitosOK) {
    Write-Host ""
    Write-Host "ERROR: Faltan requisitos" -ForegroundColor $Red
    Write-Host "Instala: Git, Node.js, npm" -ForegroundColor $Yellow
    Read-Host "Presiona Enter"
    exit 1
}

Write-Host ""
Write-Host "  Todos los requisitos OK" -ForegroundColor $Green
Write-Host ""

# Paso 2: Verificar CLI tools
Write-Host "PASO 2: Verificando CLI tools..." -ForegroundColor $Yellow
Write-Host "=========================================="
Write-Host ""

$vercelCLI = $null
$railwayCLI = $null

try {
    vercel --version 2>$null
    $vercelCLI = $true
    Write-Host "  Vercel CLI: OK (instalado)" -ForegroundColor $Green
} catch {
    Write-Host "  Vercel CLI: NO instalado" -ForegroundColor $Yellow
    Write-Host "    Para instalar: npm i -g vercel" -ForegroundColor $Blue
}

try {
    railway --version 2>$null
    $railwayCLI = $true
    Write-Host "  Railway CLI: OK (instalado)" -ForegroundColor $Green
} catch {
    Write-Host "  Railway CLI: NO instalado" -ForegroundColor $Yellow
    Write-Host "    Para instalar: npm i -g @railway/cli" -ForegroundColor $Blue
}

Write-Host ""

# Paso 3: Menu de opciones
Write-Host "PASO 3: Selecciona opcion..." -ForegroundColor $Yellow
Write-Host "=========================================="
Write-Host ""
Write-Host "  1. Deploy en Vercel (Frontend)" -ForegroundColor $Green
Write-Host "  2. Deploy en Railway (Backend)" -ForegroundColor $Green
Write-Host "  3. Deploy en AMBOS (recomendado)" -ForegroundColor $Green
Write-Host "  4. Ver instrucciones completas" -ForegroundColor $Green
Write-Host "  0. Salir" -ForegroundColor $Red
Write-Host ""

$opcion = Read-Host "Selecciona (0-4)"

switch ($opcion) {
    "1" {
        # Vercel Deploy
        Write-Host ""
        Write-Host "=========================================="
        Write-Host "DEPLOY EN VERCEL - FRONTEND"
        Write-Host "=========================================="
        Write-Host ""

        if (-not $vercelCLI) {
            Write-Host "Instalando Vercel CLI..." -ForegroundColor $Yellow
            npm install -g vercel
            Write-Host "OK - Vercel CLI instalado" -ForegroundColor $Green
        }

        Write-Host ""
        Write-Host "Iniciando deploy en Vercel..." -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Se abrira el navegador para autenticacion" -ForegroundColor $Blue
        Write-Host ""

        try {
            # Cambiar a carpeta del proyecto
            $projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
            Set-Location $projectPath

            # Deploy
            vercel --prod

            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "=========================================="
                Write-Host "VERCEL DEPLOYMENT EXITOSO" -ForegroundColor $Green
                Write-Host "=========================================="
                Write-Host ""
                Write-Host "Tu frontend esta en:" -ForegroundColor $Yellow
                Write-Host "https://puro-hockey.vercel.app" -ForegroundColor $Blue
                Write-Host ""
                Write-Host "Proximos pasos:" -ForegroundColor $Yellow
                Write-Host "1. Configura Railway para el backend" -ForegroundColor $Blue
                Write-Host "2. Agrega variables de entorno en Vercel:" -ForegroundColor $Blue
                Write-Host "   VITE_API_URL=https://tu-backend.railway.app" -ForegroundColor $Blue
                Write-Host "3. Redeploy en Vercel" -ForegroundColor $Blue
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "ERROR en deploy" -ForegroundColor $Red
                Write-Host "Verifica que:" -ForegroundColor $Yellow
                Write-Host "- Estas logueado en Vercel" -ForegroundColor $Blue
                Write-Host "- El proyecto existe en GitHub" -ForegroundColor $Blue
                Write-Host "- Tienes acceso a la cuenta" -ForegroundColor $Blue
            }
        } catch {
            Write-Host "ERROR: $_" -ForegroundColor $Red
        }
    }
    "2" {
        # Railway Deploy
        Write-Host ""
        Write-Host "=========================================="
        Write-Host "DEPLOY EN RAILWAY - BACKEND"
        Write-Host "=========================================="
        Write-Host ""

        if (-not $railwayCLI) {
            Write-Host "Instalando Railway CLI..." -ForegroundColor $Yellow
            npm install -g @railway/cli
            Write-Host "OK - Railway CLI instalado" -ForegroundColor $Green
        }

        Write-Host ""
        Write-Host "Iniciando deploy en Railway..." -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Se abrira el navegador para autenticacion" -ForegroundColor $Blue
        Write-Host ""

        try {
            # Cambiar a carpeta del proyecto
            $projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
            Set-Location $projectPath

            # Login en Railway
            railway login

            # Deploy
            railway up --backend

            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "=========================================="
                Write-Host "RAILWAY DEPLOYMENT EXITOSO" -ForegroundColor $Green
                Write-Host "=========================================="
                Write-Host ""
                Write-Host "Tu backend esta en:" -ForegroundColor $Yellow
                Write-Host "https://tu-proyecto.railway.app" -ForegroundColor $Blue
                Write-Host ""
                Write-Host "Proximos pasos:" -ForegroundColor $Yellow
                Write-Host "1. Obtener URL del backend desde Railway" -ForegroundColor $Blue
                Write-Host "2. Actualizar variables en Vercel" -ForegroundColor $Blue
                Write-Host "3. Redeploy en Vercel" -ForegroundColor $Blue
                Write-Host ""
            } else {
                Write-Host ""
                Write-Host "Configurar manualmente en:" -ForegroundColor $Yellow
                Write-Host "https://railway.app" -ForegroundColor $Blue
                Write-Host ""
            }
        } catch {
            Write-Host "ERROR: $_" -ForegroundColor $Red
            Write-Host ""
            Write-Host "Configurar manualmente en:" -ForegroundColor $Yellow
            Write-Host "https://railway.app" -ForegroundColor $Blue
        }
    }
    "3" {
        # Ambos
        Write-Host ""
        Write-Host "=========================================="
        Write-Host "DEPLOY EN VERCEL + RAILWAY"
        Write-Host "=========================================="
        Write-Host ""

        Write-Host "Fase 1: Vercel (Frontend)" -ForegroundColor $Yellow
        Write-Host "=========================================="

        if (-not $vercelCLI) {
            Write-Host "Instalando Vercel CLI..." -ForegroundColor $Blue
            npm install -g vercel
        }

        try {
            $projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
            Set-Location $projectPath

            Write-Host ""
            Write-Host "Ejecutando: vercel --prod" -ForegroundColor $Blue
            Write-Host "Se abrira navegador para autenticacion..." -ForegroundColor $Yellow
            Write-Host ""

            vercel --prod

            Write-Host ""
            Write-Host "OK - Vercel deployment completado" -ForegroundColor $Green
        } catch {
            Write-Host "ERROR en Vercel: $_" -ForegroundColor $Red
        }

        Write-Host ""
        Write-Host "Fase 2: Railway (Backend)" -ForegroundColor $Yellow
        Write-Host "=========================================="

        if (-not $railwayCLI) {
            Write-Host "Instalando Railway CLI..." -ForegroundColor $Blue
            npm install -g @railway/cli
        }

        Write-Host ""
        Write-Host "Abre en navegador: https://railway.app" -ForegroundColor $Blue
        Write-Host ""
        Write-Host "Pasos en Railway:" -ForegroundColor $Yellow
        Write-Host "1. Click 'New Project'" -ForegroundColor $Blue
        Write-Host "2. Selecciona 'Deploy from GitHub repo'" -ForegroundColor $Blue
        Write-Host "3. Selecciona 'matiasuke/puro-hockey'" -ForegroundColor $Blue
        Write-Host "4. Crea servicio PostgreSQL" -ForegroundColor $Blue
        Write-Host "5. Crea servicio Node.js" -ForegroundColor $Blue
        Write-Host "6. Configura variables de entorno" -ForegroundColor $Blue
        Write-Host ""

        $continuar = Read-Host "¿Ya configuraste Railway? (s/n)"

        if ($continuar -eq "s") {
            Write-Host ""
            Write-Host "=========================================="
            Write-Host "DEPLOY COMPLETADO" -ForegroundColor $Green
            Write-Host "=========================================="
            Write-Host ""
            Write-Host "Frontend:" -ForegroundColor $Yellow
            Write-Host "  https://puro-hockey.vercel.app" -ForegroundColor $Blue
            Write-Host ""
            Write-Host "Backend:" -ForegroundColor $Yellow
            Write-Host "  https://tu-proyecto.railway.app" -ForegroundColor $Blue
            Write-Host ""
            Write-Host "Proximos pasos:" -ForegroundColor $Yellow
            Write-Host "1. Actualiza VITE_API_URL en Vercel" -ForegroundColor $Blue
            Write-Host "2. Redeploy en Vercel" -ForegroundColor $Blue
            Write-Host "3. Prueba en el navegador" -ForegroundColor $Blue
            Write-Host ""
        }
    }
    "4" {
        # Instrucciones
        Clear-Host

        Write-Host ""
        Write-Host "INSTRUCCIONES DETALLADAS - VERCEL + RAILWAY" -ForegroundColor $Green
        Write-Host "=========================================="
        Write-Host ""

        Write-Host "PASO 1: DEPLOY EN VERCEL (FRONTEND)" -ForegroundColor $Green
        Write-Host "=========================================="
        Write-Host ""
        Write-Host "Opcion A: Usar Vercel CLI (rapido)" -ForegroundColor $Yellow
        Write-Host "  1. Instala: npm i -g vercel" -ForegroundColor $Blue
        Write-Host "  2. Ve a carpeta: cd puro-hockey" -ForegroundColor $Blue
        Write-Host "  3. Deploy: vercel --prod" -ForegroundColor $Blue
        Write-Host "  4. Sigue las instrucciones del navegador" -ForegroundColor $Blue
        Write-Host ""

        Write-Host "Opcion B: Usar Dashboard de Vercel" -ForegroundColor $Yellow
        Write-Host "  1. Ve a: https://vercel.com/new" -ForegroundColor $Blue
        Write-Host "  2. Importa repo: matiasuke/puro-hockey" -ForegroundColor $Blue
        Write-Host "  3. Configura variables de entorno" -ForegroundColor $Blue
        Write-Host "  4. Deploy" -ForegroundColor $Blue
        Write-Host ""

        Write-Host "PASO 2: DEPLOY EN RAILWAY (BACKEND)" -ForegroundColor $Green
        Write-Host "=========================================="
        Write-Host ""
        Write-Host "1. Ve a: https://railway.app" -ForegroundColor $Blue
        Write-Host "2. Sign up / Login con GitHub" -ForegroundColor $Blue
        Write-Host "3. Nuevo Proyecto -> 'Deploy from GitHub repo'" -ForegroundColor $Blue
        Write-Host "4. Selecciona: matiasuke/puro-hockey" -ForegroundColor $Blue
        Write-Host "5. Agrega servicio PostgreSQL" -ForegroundColor $Blue
        Write-Host "6. Agrega servicio Node.js" -ForegroundColor $Blue
        Write-Host ""

        Write-Host "PASO 3: CONFIGURAR VARIABLES DE ENTORNO" -ForegroundColor $Green
        Write-Host "=========================================="
        Write-Host ""

        Write-Host "En Vercel:" -ForegroundColor $Yellow
        Write-Host "  VITE_API_URL=https://tu-backend.railway.app" -ForegroundColor $Blue
        Write-Host "  VITE_WS_URL=wss://tu-backend.railway.app" -ForegroundColor $Blue
        Write-Host ""

        Write-Host "En Railway:" -ForegroundColor $Yellow
        Write-Host "  NODE_ENV=production" -ForegroundColor $Blue
        Write-Host "  PORT=5000" -ForegroundColor $Blue
        Write-Host "  DATABASE_URL=postgresql://..." -ForegroundColor $Blue
        Write-Host "  JWT_SECRET=tu-secret-muy-seguro" -ForegroundColor $Blue
        Write-Host "  CORS_ORIGIN=https://puro-hockey.vercel.app" -ForegroundColor $Blue
        Write-Host ""

        Write-Host "PASO 4: VERIFICAR DEPLOYMENT" -ForegroundColor $Green
        Write-Host "=========================================="
        Write-Host ""
        Write-Host "Frontend: https://puro-hockey.vercel.app" -ForegroundColor $Blue
        Write-Host "Backend: https://tu-proyecto.railway.app/health" -ForegroundColor $Blue
        Write-Host ""

        Read-Host "Presiona Enter para volver"
        & $PSCommandPath
    }
    "0" {
        Write-Host ""
        Write-Host "Hasta luego" -ForegroundColor $Yellow
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "Opcion invalida" -ForegroundColor $Red
        Start-Sleep -Seconds 2
        & $PSCommandPath
    }
}

Write-Host ""
Read-Host "Presiona Enter para terminar"

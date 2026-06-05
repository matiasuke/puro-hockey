# Setup GitHub Actions para Deployments Automáticos
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   SETUP GITHUB ACTIONS - DEPLOYMENTS AUTOMATICOS" -ForegroundColor $Blue
Write-Host "   PURO HOCKEY v1.0.0" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

Write-Host "Este setup configura deployments automáticos en:" -ForegroundColor $Yellow
Write-Host "  • Vercel (cada push a main)" -ForegroundColor $Cyan
Write-Host "  • Railway (cada push a main)" -ForegroundColor $Cyan
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 1: OBTENER TOKENS
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 1: Obteniendo tokens necesarios..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "VERCEL TOKEN:" -ForegroundColor $Green
Write-Host "1. Ve a: https://vercel.com/account/tokens" -ForegroundColor $Blue
Write-Host "2. Click: 'Create'" -ForegroundColor $Blue
Write-Host "3. Nombre: github-actions" -ForegroundColor $Blue
Write-Host "4. COPIA el token" -ForegroundColor $Blue
Write-Host ""

$vercelToken = Read-Host "Pega tu Vercel Token"

if ($vercelToken.Length -lt 10) {
    Write-Host "ERROR: Token inválido" -ForegroundColor $Red
    exit 1
}

Write-Host "Vercel Token guardado" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════

Write-Host "VERCEL ORG ID:" -ForegroundColor $Green
Write-Host "1. Ve a: https://vercel.com/account/settings" -ForegroundColor $Blue
Write-Host "2. Busca: 'Team ID' (si es personal, usa tu username)" -ForegroundColor $Blue
Write-Host "3. COPIA el ID" -ForegroundColor $Blue
Write-Host ""

$vercelOrgId = Read-Host "Pega tu Vercel Org ID"

if ($vercelOrgId.Length -lt 3) {
    Write-Host "ERROR: Org ID inválido" -ForegroundColor $Red
    exit 1
}

Write-Host "Vercel Org ID guardado" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════

Write-Host "VERCEL PROJECT ID:" -ForegroundColor $Green
Write-Host "1. Ve a: https://vercel.com/dashboard" -ForegroundColor $Blue
Write-Host "2. Abre proyecto: puro-hockey" -ForegroundColor $Blue
Write-Host "3. Settings → General" -ForegroundColor $Blue
Write-Host "4. Busca: 'Project ID'" -ForegroundColor $Blue
Write-Host "5. COPIA el ID" -ForegroundColor $Blue
Write-Host ""

$vercelProjectId = Read-Host "Pega tu Vercel Project ID"

if ($vercelProjectId.Length -lt 10) {
    Write-Host "ERROR: Project ID inválido" -ForegroundColor $Red
    exit 1
}

Write-Host "Vercel Project ID guardado" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════

Write-Host "RAILWAY TOKEN:" -ForegroundColor $Green
Write-Host "1. Ve a: https://railway.app/account/tokens" -ForegroundColor $Blue
Write-Host "2. Click: 'Create'" -ForegroundColor $Blue
Write-Host "3. COPIA el token" -ForegroundColor $Blue
Write-Host ""

$railwayToken = Read-Host "Pega tu Railway Token"

if ($railwayToken.Length -lt 10) {
    Write-Host "ERROR: Token inválido" -ForegroundColor $Red
    exit 1
}

Write-Host "Railway Token guardado" -ForegroundColor $Green
Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 2: CONFIGURAR GITHUB SECRETS
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 2: Configurando GitHub Secrets..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

Write-Host "INSTRUCCIONES:" -ForegroundColor $Green
Write-Host "1. Ve a: https://github.com/matiasuke/puro-hockey/settings/secrets/actions" -ForegroundColor $Blue
Write-Host ""
Write-Host "2. Click: 'New repository secret'" -ForegroundColor $Blue
Write-Host ""
Write-Host "3. Agrega estos secrets:" -ForegroundColor $Blue
Write-Host ""
Write-Host "   VERCEL_TOKEN:" -ForegroundColor $Cyan
Write-Host "   " -NoNewline
Write-Host $vercelToken -ForegroundColor $Yellow
Write-Host ""
Write-Host "   VERCEL_ORG_ID:" -ForegroundColor $Cyan
Write-Host "   " -NoNewline
Write-Host $vercelOrgId -ForegroundColor $Yellow
Write-Host ""
Write-Host "   VERCEL_PROJECT_ID:" -ForegroundColor $Cyan
Write-Host "   " -NoNewline
Write-Host $vercelProjectId -ForegroundColor $Yellow
Write-Host ""
Write-Host "   RAILWAY_TOKEN:" -ForegroundColor $Cyan
Write-Host "   " -NoNewline
Write-Host $railwayToken -ForegroundColor $Yellow
Write-Host ""

Write-Host "Abriendo GitHub..." -ForegroundColor $Cyan
Start-Process "https://github.com/matiasuke/puro-hockey/settings/secrets/actions"

Write-Host ""
Write-Host "Presiona Enter cuando hayas configurado todos los secrets..."
Read-Host

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# PASO 3: COMMIT Y PUSH
# ═══════════════════════════════════════════════════════════════════════

Write-Host "PASO 3: Activando GitHub Actions..." -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host "Verificando archivos de workflow..." -ForegroundColor $Cyan

if ((Test-Path ".\.github\workflows\deploy-vercel.yml") -and (Test-Path ".\.github\workflows\deploy-railway.yml")) {
    Write-Host "Workflows encontrados: OK" -ForegroundColor $Green
} else {
    Write-Host "ERROR: Workflows no encontrados" -ForegroundColor $Red
    exit 1
}

Write-Host ""
Write-Host "Preparando commit..." -ForegroundColor $Cyan

git add .github/workflows/
git commit -m "Add GitHub Actions workflows for automatic deployments"

Write-Host "Push a GitHub..." -ForegroundColor $Cyan
git push

if ($LASTEXITCODE -eq 0) {
    Write-Host "Push completado: OK" -ForegroundColor $Green
} else {
    Write-Host "ERROR en push" -ForegroundColor $Red
    exit 1
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# RESULTADO FINAL
# ═══════════════════════════════════════════════════════════════════════

Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   GITHUB ACTIONS CONFIGURADO" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Write-Host "Deployments automáticos activados:" -ForegroundColor $Yellow
Write-Host ""
Write-Host "✓ Cada push a 'main' → Deploy a Vercel" -ForegroundColor $Green
Write-Host "✓ Cada push a 'main' → Deploy a Railway" -ForegroundColor $Green
Write-Host ""

Write-Host "VER DEPLOYMENTS EN:" -ForegroundColor $Yellow
Write-Host "  GitHub Actions:" -ForegroundColor $Blue
Write-Host "  https://github.com/matiasuke/puro-hockey/actions" -ForegroundColor $Cyan
Write-Host ""
Write-Host "  Vercel:" -ForegroundColor $Blue
Write-Host "  https://vercel.com/dashboard" -ForegroundColor $Cyan
Write-Host ""
Write-Host "  Railway:" -ForegroundColor $Blue
Write-Host "  https://railway.app/dashboard" -ForegroundColor $Cyan
Write-Host ""

Write-Host "PROXIMOS PASOS:" -ForegroundColor $Yellow
Write-Host "1. Cada push a 'main' deployará automáticamente" -ForegroundColor $Blue
Write-Host "2. Ve a GitHub Actions para ver el progreso" -ForegroundColor $Blue
Write-Host "3. Ve a Vercel/Railway para ver URLs finales" -ForegroundColor $Blue
Write-Host ""

Write-Host ""
Read-Host "Presiona Enter para terminar"

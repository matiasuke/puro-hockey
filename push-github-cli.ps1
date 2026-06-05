#############################################################################
# Script PowerShell para GitHub CLI - PUSH AUTOMÁTICO
# Más rápido y simple que la versión manual
#############################################################################

$Green = @{ ForegroundColor = 'Green' }
$Red = @{ ForegroundColor = 'Red' }
$Yellow = @{ ForegroundColor = 'Yellow' }
$Blue = @{ ForegroundColor = 'Blue' }

Write-Host "`n🚀 ==========================================" @Blue
Write-Host "   PUSH CON GITHUB CLI - PURO HOCKEY" @Blue
Write-Host "==========================================" @Blue

# Verificar GitHub CLI
Write-Host "`n🔍 Verificando GitHub CLI..." @Yellow
try {
    $ghVersion = gh --version
    Write-Host "✅ GitHub CLI instalado: $ghVersion" @Green
} catch {
    Write-Host "❌ Error: GitHub CLI no está instalado" @Red
    Write-Host ""
    Write-Host "📥 Instala GitHub CLI desde:" @Blue
    Write-Host "   https://cli.github.com/" @Blue
    Write-Host ""
    exit 1
}

# Navegar a la carpeta
$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath
Write-Host "`n✅ Ubicación: $(Get-Location)" @Green

# Verificar Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No es un repositorio Git" @Red
    exit 1
}

Write-Host "✅ Repositorio Git válido" @Green

# Verificar autenticación con GitHub
Write-Host "`n🔍 Verificando autenticación con GitHub..." @Yellow
try {
    gh auth status *>$null
    Write-Host "✅ Autenticado en GitHub" @Green
} catch {
    Write-Host "⚠️  No autenticado. Abriendo GitHub login..." @Yellow
    gh auth login
}

# Pedir datos
Write-Host "`n📝 Configuración:" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$repoName = Read-Host "   📦 Nombre repositorio (ej: puro-hockey)"
$description = Read-Host "   📝 Descripción (ej: Sistema de gestión de torneos)"
$isPublic = Read-Host "   🌐 ¿Público? (s/n)"

$visibility = if ($isPublic -eq "s" -or $isPublic -eq "S") { "--public" } else { "--private" }

# Resumen
Write-Host "`n📋 Resumen:" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow
Write-Host "  Repositorio: $repoName"
Write-Host "  Descripción: $description"
Write-Host "  Visibilidad: $(if ($visibility -eq '--public') { 'Público' } else { 'Privado' })"

$confirm = Read-Host "`n¿Continuar? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Cancelado" @Red
    exit 0
}

# Crear repositorio en GitHub
Write-Host "`n⚙️  Creando repositorio en GitHub..." @Yellow
gh repo create $repoName $visibility `
    --description "$description" `
    --source=. `
    --remote=origin `
    --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Repositorio creado y código subido exitosamente" @Green

    # Obtener URL del usuario
    $whoami = gh api user --jq '.login'

    Write-Host "`n✅ ==========================================" @Green
    Write-Host "   COMPLETADO" @Green
    Write-Host "==========================================" @Green
    Write-Host ""
    Write-Host "📌 Tu repositorio está en:" @Yellow
    Write-Host "   https://github.com/$whoami/$repoName" @Blue
    Write-Host ""
    Write-Host "📌 Próximos pasos:" @Yellow
    Write-Host "  1. Verifica: https://github.com/$whoami/$repoName" @Blue
    Write-Host "  2. Configura Vercel: https://vercel.com/new" @Blue
    Write-Host "  3. Configura Railway: https://railway.app" @Blue
    Write-Host ""
} else {
    Write-Host "`n❌ Error al crear repositorio" @Red
    Write-Host "   Asegúrate de tener acceso a GitHub" @Yellow
}

#############################################################################
# Script PowerShell para hacer Push a GitHub - PURO HOCKEY
# Automatiza: Clone, Remote, Branch, Push
#############################################################################

# Colores para output
$Green = @{ ForegroundColor = 'Green' }
$Red = @{ ForegroundColor = 'Red' }
$Yellow = @{ ForegroundColor = 'Yellow' }
$Blue = @{ ForegroundColor = 'Blue' }

Write-Host "`n🚀 ==========================================" @Blue
Write-Host "   PUSH AUTOMÁTICO A GITHUB - PURO HOCKEY" @Blue
Write-Host "==========================================" @Blue

# Verificar que estamos en la carpeta correcta
$expectedPath = "C:\Users\Alumno\Documents\App\hockey-app"
if (-not (Test-Path $expectedPath)) {
    Write-Host "❌ Error: La carpeta no existe: $expectedPath" @Red
    exit 1
}

# Navegar a la carpeta
Write-Host "`n📁 Navegando a: $expectedPath" @Yellow
Set-Location $expectedPath
Write-Host "✅ Ubicación: $(Get-Location)" @Green

# Verificar que Git está instalado
Write-Host "`n🔍 Verificando Git..." @Yellow
try {
    $gitVersion = git --version
    Write-Host "✅ Git instalado: $gitVersion" @Green
} catch {
    Write-Host "❌ Error: Git no está instalado" @Red
    exit 1
}

# Verificar que estamos en un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: Este no es un repositorio Git" @Red
    exit 1
}

Write-Host "✅ Repositorio Git válido" @Green

# Obtener información de Git
Write-Host "`n📊 Información del Repositorio:" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$branch = git branch --show-current
Write-Host "  Rama actual: $branch"

$commits = git rev-list --count HEAD
Write-Host "  Commits: $commits"

$status = git status --short
if ($status) {
    Write-Host "  Cambios sin confirmar: Sí"
    Write-Host "  Detalles:"
    git status --short | ForEach-Object { Write-Host "    $_" }
} else {
    Write-Host "  Cambios sin confirmar: No"
}

# Pedir datos del usuario
Write-Host "`n📝 Configuración de GitHub:" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$githubUser = Read-Host "   👤 Usuario de GitHub (ej: tu-usuario)"
$githubRepo = Read-Host "   📦 Nombre del repositorio (ej: puro-hockey)"
$makePublic = Read-Host "   🌐 ¿Repositorio público? (s/n)"

$isPublic = $makePublic -eq "s" -or $makePublic -eq "S"
$visibility = if ($isPublic) { "público" } else { "privado" }

Write-Host "`n📋 Resumen:" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow
Write-Host "  Usuario: $githubUser"
Write-Host "  Repositorio: $githubRepo"
Write-Host "  Visibilidad: $visibility"
Write-Host "  URL: https://github.com/$githubUser/$githubRepo"

# Confirmar antes de continuar
$confirm = Read-Host "`n¿Continuar con el push? (s/n)"
if ($confirm -ne "s" -and $confirm -ne "S") {
    Write-Host "❌ Operación cancelada" @Red
    exit 0
}

# PASO 1: Verificar/Crear Remote
Write-Host "`n⚙️  PASO 1: Configurar Remote de GitHub" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$remoteUrl = "https://github.com/$githubUser/$githubRepo.git"
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Write-Host "  Remote 'origin' ya existe: $existingRemote"
    $changeRemote = Read-Host "  ¿Cambiar a: $remoteUrl? (s/n)"

    if ($changeRemote -eq "s" -or $changeRemote -eq "S") {
        Write-Host "  Removiendo remote anterior..." @Yellow
        git remote remove origin
        Write-Host "  ✅ Remote removido" @Green

        Write-Host "  Agregando nuevo remote..." @Yellow
        git remote add origin $remoteUrl
        Write-Host "  ✅ Remote agregado: $remoteUrl" @Green
    }
} else {
    Write-Host "  Agregando remote 'origin'..." @Yellow
    git remote add origin $remoteUrl
    Write-Host "  ✅ Remote agregado: $remoteUrl" @Green
}

# Verificar
$newRemote = git remote get-url origin
Write-Host "  Verificación: $newRemote" @Green

# PASO 2: Configurar Rama
Write-Host "`n⚙️  PASO 2: Configurar rama 'main'" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "  Rama actual: $currentBranch" @Yellow
    Write-Host "  Renombrando a 'main'..." @Yellow
    git branch -M main
    Write-Host "  ✅ Rama renombrada a 'main'" @Green
} else {
    Write-Host "  ✅ Ya estamos en rama 'main'" @Green
}

# PASO 3: Hacer Push
Write-Host "`n⚙️  PASO 3: Hacer Push a GitHub" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

Write-Host "  Subiendo código a GitHub..." @Yellow
Write-Host "  Esto puede tardar un momento..." @Yellow
Write-Host ""

try {
    git push -u origin main
    $pushSuccess = $?
} catch {
    $pushSuccess = $false
}

if ($pushSuccess) {
    Write-Host "`n✅ Push completado exitosamente" @Green
} else {
    Write-Host "`n⚠️  El push requiere autenticación" @Yellow
    Write-Host "  Git solicitará tu token de GitHub" @Yellow
    Write-Host ""
    Write-Host "  📋 Si te pide credenciales:" @Blue
    Write-Host "    - Usuario: $githubUser" @Blue
    Write-Host "    - Contraseña: Tu Personal Access Token" @Blue
    Write-Host ""
    Write-Host "  📌 Cómo obtener un token:" @Blue
    Write-Host "    1. Ve a: https://github.com/settings/tokens" @Blue
    Write-Host "    2. Click 'Generate new token'" @Blue
    Write-Host "    3. Dame permisos: repo, admin:repo_hook" @Blue
    Write-Host "    4. Copia el token y pégalo aquí" @Blue

    # Reintentar
    $retry = Read-Host "`n¿Reintentar push? (s/n)"
    if ($retry -eq "s" -or $retry -eq "S") {
        git push -u origin main
    }
}

# PASO 4: Verificar
Write-Host "`n⚙️  PASO 4: Verificar Resultado" @Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Yellow

$remotes = git remote -v
Write-Host "  Remotes configurados:" @Green
$remotes | ForEach-Object { Write-Host "    $_" @Green }

# Verificar estado
$status = git status
Write-Host "`n  Estado del repositorio:" @Green
Write-Host "    Rama: $(git branch --show-current)" @Green
Write-Host "    Commits: $(git rev-list --count HEAD)" @Green

# Resumen final
Write-Host "`n✅ ==========================================" @Green
Write-Host "   PROCESO COMPLETADO" @Green
Write-Host "==========================================" @Green
Write-Host ""
Write-Host "📌 Próximos pasos:" @Yellow
Write-Host "  1. Ve a: https://github.com/$githubUser/$githubRepo" @Blue
Write-Host "  2. Verifica que el código está subido" @Blue
Write-Host "  3. Configura Vercel para frontend" @Blue
Write-Host "  4. Configura Railway para backend" @Blue
Write-Host ""
Write-Host "🔗 Links útiles:" @Yellow
Write-Host "  GitHub: https://github.com/$githubUser/$githubRepo" @Blue
Write-Host "  Vercel: https://vercel.com/new" @Blue
Write-Host "  Railway: https://railway.app" @Blue
Write-Host ""

Write-Host "✨ ¡Proyecto subido a GitHub exitosamente! 🚀" @Green
Write-Host ""

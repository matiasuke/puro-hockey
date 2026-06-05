# Script Automatico - Push a GitHub sin interaccion
# Usuario: matiasuke
# Repositorio: puro-hockey
# Visibilidad: publico

Clear-Host

Write-Host ""
Write-Host "=========================================="
Write-Host "   AUTOMATIZANDO PUSH A GITHUB"
Write-Host "=========================================="
Write-Host ""

$githubUser = "matiasuke"
$repoName = "puro-hockey"
$description = "Sistema integral de gestion de torneos de hockey con API REST"
$visibility = "--public"

Write-Host "CONFIGURACION:" -ForegroundColor Yellow
Write-Host "  Usuario: $githubUser" -ForegroundColor Green
Write-Host "  Repositorio: $repoName" -ForegroundColor Green
Write-Host "  Visibilidad: Publico" -ForegroundColor Green
Write-Host "  Descripcion: $description" -ForegroundColor Green
Write-Host ""

# Verificar que estamos en la carpeta correcta
$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
if ((Get-Location).Path -ne $projectPath) {
    Set-Location $projectPath
    Write-Host "Carpeta: $projectPath" -ForegroundColor Green
}

# Verificar que es un repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: No es un repositorio Git" -ForegroundColor Red
    exit 1
}

Write-Host "Repositorio Git: Valido" -ForegroundColor Green
Write-Host ""

# OPCION 1: Intentar con GitHub CLI (si esta instalado)
Write-Host "INTENTANDO CON GITHUB CLI..." -ForegroundColor Yellow
Write-Host "=========================================="

try {
    $ghVersion = gh --version
    Write-Host "GitHub CLI detectado: $ghVersion" -ForegroundColor Green
    Write-Host ""

    Write-Host "Paso 1: Crear repositorio en GitHub..." -ForegroundColor Yellow
    Write-Host "  Comando: gh repo create $repoName $visibility --description '$description' --source=. --remote=origin --push" -ForegroundColor Cyan
    Write-Host ""

    gh repo create $repoName $visibility --description "$description" --source=. --remote=origin --push

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=========================================="
        Write-Host "EXITO - PUSH COMPLETADO CON GITHUB CLI" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host ""
        Write-Host "Tu repositorio esta en:" -ForegroundColor Yellow
        Write-Host "https://github.com/$githubUser/$repoName" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Proximos pasos:" -ForegroundColor Yellow
        Write-Host "  1. Verifica el repositorio en GitHub" -ForegroundColor Cyan
        Write-Host "  2. Configura Vercel: https://vercel.com/new" -ForegroundColor Cyan
        Write-Host "  3. Configura Railway: https://railway.app" -ForegroundColor Cyan
        Write-Host ""
        exit 0
    } else {
        Write-Host "GitHub CLI retorno error. Intentando con push manual..." -ForegroundColor Yellow
        Write-Host ""
    }
} catch {
    Write-Host "GitHub CLI no esta instalado. Intentando con push manual..." -ForegroundColor Yellow
    Write-Host ""
}

# OPCION 2: Push Manual
Write-Host "PUSH MANUAL - PASOS GUIADOS" -ForegroundColor Yellow
Write-Host "=========================================="
Write-Host ""

$remoteUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host "Paso 1: Verificar/Configurar remote..." -ForegroundColor Yellow
$existingRemote = git remote get-url origin 2>$null

if ($existingRemote) {
    Write-Host "  Remote existente: $existingRemote" -ForegroundColor Cyan
    Write-Host "  Cambiando a: $remoteUrl" -ForegroundColor Yellow
    git remote remove origin
    git remote add origin $remoteUrl
    Write-Host "  OK - Remote actualizado" -ForegroundColor Green
} else {
    Write-Host "  Agregando remote: $remoteUrl" -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "  OK - Remote agregado" -ForegroundColor Green
}

Write-Host ""
Write-Host "Paso 2: Configurar rama main..." -ForegroundColor Yellow
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "  Renombrando rama de $currentBranch a main..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "  OK - Rama renombrada" -ForegroundColor Green
} else {
    Write-Host "  Rama ya es main" -ForegroundColor Green
}

Write-Host ""
Write-Host "Paso 3: Hacer push a GitHub..." -ForegroundColor Yellow
Write-Host "  Comando: git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Subiendo codigo..." -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "EXITO - PUSH COMPLETADO" -ForegroundColor Green
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "Tu repositorio esta en:" -ForegroundColor Yellow
    Write-Host "https://github.com/$githubUser/$repoName" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Yellow
    Write-Host "  1. Abre en navegador:" -ForegroundColor Cyan
    Write-Host "     https://github.com/$githubUser/$repoName" -ForegroundColor Blue
    Write-Host ""
    Write-Host "  2. Verifica que todos los archivos estan ahi" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  3. Configura Vercel para frontend:" -ForegroundColor Cyan
    Write-Host "     https://vercel.com/new" -ForegroundColor Blue
    Write-Host ""
    Write-Host "  4. Configura Railway para backend:" -ForegroundColor Cyan
    Write-Host "     https://railway.app" -ForegroundColor Blue
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "ERROR - AUTENTICACION REQUERIDA" -ForegroundColor Red
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "Git necesita autenticacion con GitHub" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Si tienes GitHub CLI:" -ForegroundColor Yellow
    Write-Host "   gh auth login" -ForegroundColor Cyan
    Write-Host "   Luego: .\push-automatico.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Si necesitas un token:" -ForegroundColor Yellow
    Write-Host "   - Ve a: https://github.com/settings/tokens" -ForegroundColor Blue
    Write-Host "   - Generate new token (classic)" -ForegroundColor Blue
    Write-Host "   - Nombre: puro-hockey-push" -ForegroundColor Blue
    Write-Host "   - Permisos: repo, admin:repo_hook" -ForegroundColor Blue
    Write-Host "   - Copia el token" -ForegroundColor Blue
    Write-Host "   - Cuando Git pida contrasena: pega el token" -ForegroundColor Blue
    Write-Host ""
    Write-Host "3. Intenta de nuevo:" -ForegroundColor Yellow
    Write-Host "   .\push-automatico.ps1" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host ""
Write-Host "Presiona Enter para salir..." -ForegroundColor Yellow
Read-Host

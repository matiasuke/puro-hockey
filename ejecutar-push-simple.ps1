# Menu interactivo para push a GitHub

Clear-Host

Write-Host ""
Write-Host "=========================================="
Write-Host "   PUSH A GITHUB - PURO HOCKEY"
Write-Host "=========================================="
Write-Host ""

Write-Host "Selecciona una opcion:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. GitHub CLI (RECOMENDADO - mas rapido)" -ForegroundColor Green
Write-Host "  2. Push Manual (control total)" -ForegroundColor Green
Write-Host "  3. Ver instrucciones" -ForegroundColor Green
Write-Host "  0. Salir" -ForegroundColor Red
Write-Host ""

$opcion = Read-Host "Selecciona (0-3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando GitHub CLI..." -ForegroundColor Yellow
        Write-Host ""

        try {
            $ghVersion = gh --version
            Write-Host "GitHub CLI instalado: $ghVersion" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: GitHub CLI no esta instalado" -ForegroundColor Red
            Write-Host "Instala desde: https://cli.github.com/" -ForegroundColor Blue
            Read-Host "Presiona Enter para salir"
            exit 1
        }

        Write-Host ""
        Write-Host "Configuracion:" -ForegroundColor Yellow
        Write-Host "=========================================="

        $repoName = Read-Host "Nombre del repositorio (ej: puro-hockey)"
        $description = Read-Host "Descripcion (ej: Sistema de gestion de torneos)"
        $isPublic = Read-Host "Publico? (s/n)"

        $visibility = if ($isPublic -eq "s") { "--public" } else { "--private" }

        Write-Host ""
        Write-Host "Repositorio: $repoName" -ForegroundColor Green
        Write-Host "Visibilidad: $(if ($visibility -eq '--public') { 'Publico' } else { 'Privado' })" -ForegroundColor Green

        $confirm = Read-Host "`nContinuar? (s/n)"
        if ($confirm -ne "s") {
            Write-Host "Cancelado" -ForegroundColor Red
            exit 0
        }

        Write-Host ""
        Write-Host "Creando repositorio..." -ForegroundColor Yellow

        gh repo create $repoName $visibility --description "$description" --source=. --remote=origin --push

        if ($LASTEXITCODE -eq 0) {
            $whoami = gh api user --jq '.login'

            Write-Host ""
            Write-Host "=========================================="
            Write-Host "COMPLETADO EXITOSAMENTE" -ForegroundColor Green
            Write-Host "=========================================="
            Write-Host ""
            Write-Host "Tu repositorio esta en:" -ForegroundColor Yellow
            Write-Host "https://github.com/$whoami/$repoName" -ForegroundColor Blue
            Write-Host ""
        } else {
            Write-Host "ERROR al crear repositorio" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Push Manual - Pasos guiados" -ForegroundColor Yellow
        Write-Host "=========================================="
        Write-Host ""

        $githubUser = Read-Host "Usuario de GitHub (ej: tu-usuario)"
        $githubRepo = Read-Host "Nombre repositorio (ej: puro-hockey)"

        $remoteUrl = "https://github.com/$githubUser/$githubRepo.git"

        Write-Host ""
        Write-Host "Configurando..." -ForegroundColor Yellow
        Write-Host "Usuario: $githubUser" -ForegroundColor Green
        Write-Host "Repositorio: $githubRepo" -ForegroundColor Green
        Write-Host "URL: $remoteUrl" -ForegroundColor Green

        $confirm = Read-Host "`nContinuar? (s/n)"
        if ($confirm -ne "s") {
            Write-Host "Cancelado" -ForegroundColor Red
            exit 0
        }

        Write-Host ""
        Write-Host "PASO 1: Configurar remote..." -ForegroundColor Yellow
        git remote add origin $remoteUrl
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK - Remote configurado" -ForegroundColor Green
        } else {
            Write-Host "Nota: Remote puede ya existir" -ForegroundColor Yellow
            git remote set-url origin $remoteUrl
        }

        Write-Host ""
        Write-Host "PASO 2: Renombrar rama a main..." -ForegroundColor Yellow
        git branch -M main
        Write-Host "OK - Rama configurada" -ForegroundColor Green

        Write-Host ""
        Write-Host "PASO 3: Hacer push..." -ForegroundColor Yellow
        git push -u origin main

        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "=========================================="
            Write-Host "PUSH COMPLETADO" -ForegroundColor Green
            Write-Host "=========================================="
            Write-Host ""
            Write-Host "Repositorio: https://github.com/$githubUser/$githubRepo" -ForegroundColor Blue
            Write-Host ""
        } else {
            Write-Host ""
            Write-Host "ERROR: Autenticacion fallida" -ForegroundColor Red
            Write-Host "Usa un Personal Access Token como contrasena" -ForegroundColor Yellow
        }
    }
    "3" {
        Clear-Host
        Write-Host ""
        Write-Host "INSTRUCCIONES PASO A PASO" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host ""

        Write-Host "OPCION A: GitHub CLI (RECOMENDADO)" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host "1. Instala GitHub CLI desde:" -ForegroundColor Cyan
        Write-Host "   https://cli.github.com/" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "2. Abre PowerShell en la carpeta del proyecto:" -ForegroundColor Cyan
        Write-Host "   cd 'C:\Users\Alumno\Documents\App\hockey-app'" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "3. Ejecuta: .\ejecutar-push-simple.ps1" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "4. Selecciona opcion 1" -ForegroundColor Cyan
        Write-Host ""

        Write-Host "OPCION B: Push Manual" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host "Ejecuta estos comandos en PowerShell:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "git remote add origin https://github.com/TU_USUARIO/puro-hockey.git" -ForegroundColor Yellow
        Write-Host "git branch -M main" -ForegroundColor Yellow
        Write-Host "git push -u origin main" -ForegroundColor Yellow
        Write-Host ""

        Write-Host "Cuando pida credenciales:" -ForegroundColor Cyan
        Write-Host "- Usuario: Tu usuario de GitHub" -ForegroundColor Yellow
        Write-Host "- Contrasena: Personal Access Token" -ForegroundColor Yellow
        Write-Host ""

        Write-Host "OBTENER PERSONAL ACCESS TOKEN" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host "1. Ve a: https://github.com/settings/tokens" -ForegroundColor Cyan
        Write-Host "2. Click: Generate new token (classic)" -ForegroundColor Cyan
        Write-Host "3. Nombre: puro-hockey-push" -ForegroundColor Cyan
        Write-Host "4. Selecciona permisos:" -ForegroundColor Cyan
        Write-Host "   - repo" -ForegroundColor Yellow
        Write-Host "   - admin:repo_hook" -ForegroundColor Yellow
        Write-Host "5. Copia el token (solo lo veras una vez)" -ForegroundColor Red
        Write-Host ""

        Write-Host "VERIFICAR RESULTADO" -ForegroundColor Green
        Write-Host "=========================================="
        Write-Host "Abre en navegador:" -ForegroundColor Cyan
        Write-Host "https://github.com/TU_USUARIO/puro-hockey" -ForegroundColor Yellow
        Write-Host ""

        Read-Host "Presiona Enter para volver al menu"
        & $PSCommandPath
    }
    "0" {
        Write-Host ""
        Write-Host "Hasta luego" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "Opcion invalida" -ForegroundColor Red
        Start-Sleep -Seconds 2
        & $PSCommandPath
    }
}

Write-Host ""
Read-Host "Presiona Enter para terminar"

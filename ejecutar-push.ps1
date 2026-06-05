#############################################################################
# MENÚ INTERACTIVO PARA PUSH A GITHUB - PURO HOCKEY
# Selecciona la opción que prefieres
#############################################################################

$Green = @{ ForegroundColor = 'Green' }
$Red = @{ ForegroundColor = 'Red' }
$Yellow = @{ ForegroundColor = 'Yellow' }
$Blue = @{ ForegroundColor = 'Blue' }
$Cyan = @{ ForegroundColor = 'Cyan' }

Clear-Host

Write-Host "
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 PUSH A GITHUB - PURO HOCKEY                         ║
║   Selecciona cómo hacer push de tu código                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
" @Blue

Write-Host "¿Qué prefieres?" @Yellow
Write-Host ""
Write-Host "  1️⃣  GitHub CLI (RECOMENDADO - más rápido)" @Green
Write-Host "     - Crea repositorio automáticamente" @Cyan
Write-Host "     - Hace push automático" @Cyan
Write-Host "     - Requiere: GitHub CLI instalado" @Cyan
Write-Host ""
Write-Host "  2️⃣  Push Manual (tradicional)" @Green
Write-Host "     - Control total del proceso" @Cyan
Write-Host "     - Pasos guiados" @Cyan
Write-Host "     - Requiere: Usuario y Token de GitHub" @Cyan
Write-Host ""
Write-Host "  3️⃣  Instrucciones Paso a Paso" @Green
Write-Host "     - Guía visual de cómo hacerlo" @Cyan
Write-Host "     - Perfecta si es la primera vez" @Cyan
Write-Host ""
Write-Host "  0️⃣  Salir" @Red
Write-Host ""

$opcion = Read-Host "Selecciona (0-3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "Iniciando GitHub CLI..." @Yellow
        Write-Host ""

        # Ejecutar el script de GitHub CLI
        $scriptPath = Join-Path (Get-Location) "push-github-cli.ps1"
        if (Test-Path $scriptPath) {
            & $scriptPath
        } else {
            Write-Host "❌ Error: No se encontró el script" @Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "Iniciando Push Manual..." @Yellow
        Write-Host ""

        # Ejecutar el script manual
        $scriptPath = Join-Path (Get-Location) "push-github.ps1"
        if (Test-Path $scriptPath) {
            & $scriptPath
        } else {
            Write-Host "❌ Error: No se encontró el script" @Red
        }
    }
    "3" {
        Clear-Host
        Write-Host "
╔═══════════════════════════════════════════════════════════╗
║         GUÍA PASO A PASO: PUSH A GITHUB                  ║
╚═══════════════════════════════════════════════════════════╝
" @Blue

        Write-Host "📋 OPCIÓN A: Con GitHub CLI (RECOMENDADO)" @Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Green
        Write-Host ""
        Write-Host "1. Verifica que tienes GitHub CLI:" @Yellow
        Write-Host "   gh --version" @Cyan
        Write-Host ""
        Write-Host "2. Abre PowerShell en la carpeta del proyecto:" @Yellow
        Write-Host "   cd 'C:\Users\Alumno\Documents\App\hockey-app'" @Cyan
        Write-Host ""
        Write-Host "3. Ejecuta el script:" @Yellow
        Write-Host "   .\push-github-cli.ps1" @Cyan
        Write-Host ""
        Write-Host "4. Sigue las instrucciones (muy simple)" @Yellow
        Write-Host ""

        Write-Host "📋 OPCIÓN B: Push Manual" @Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Green
        Write-Host ""
        Write-Host "1. Abre PowerShell en la carpeta:" @Yellow
        Write-Host "   cd 'C:\Users\Alumno\Documents\App\hockey-app'" @Cyan
        Write-Host ""
        Write-Host "2. Ejecuta los comandos:" @Yellow
        Write-Host ""
        Write-Host "   # Configura el remote" @Cyan
        Write-Host "   git remote add origin https://github.com/TU_USUARIO/puro-hockey.git" @Cyan
        Write-Host ""
        Write-Host "   # Cambia a rama main" @Cyan
        Write-Host "   git branch -M main" @Cyan
        Write-Host ""
        Write-Host "   # Hace push" @Cyan
        Write-Host "   git push -u origin main" @Cyan
        Write-Host ""
        Write-Host "3. Cuando pida credenciales:" @Yellow
        Write-Host "   - Usuario: Tu usuario de GitHub" @Cyan
        Write-Host "   - Contraseña: Personal Access Token" @Cyan
        Write-Host ""

        Write-Host "🔑 OBTENER PERSONAL ACCESS TOKEN" @Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Green
        Write-Host ""
        Write-Host "1. Ve a: https://github.com/settings/tokens" @Cyan
        Write-Host ""
        Write-Host "2. Click: 'Generate new token' → 'Generate new token (classic)'" @Yellow
        Write-Host ""
        Write-Host "3. Nombre: 'puro-hockey-push'" @Yellow
        Write-Host ""
        Write-Host "4. Permisos necesarios:" @Yellow
        Write-Host "   ✓ repo" @Cyan
        Write-Host "   ✓ admin:repo_hook" @Cyan
        Write-Host ""
        Write-Host "5. Click: 'Generate token'" @Yellow
        Write-Host ""
        Write-Host "6. COPIA el token (solo lo verás una vez)" @Red
        Write-Host ""

        Write-Host "💡 TIPS" @Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Green
        Write-Host ""
        Write-Host "• Guarda el token en un lugar seguro" @Yellow
        Write-Host "• Nunca lo compartas públicamente" @Yellow
        Write-Host "• Puedes regenerarlo en GitHub" @Yellow
        Write-Host "• GitHub CLI es lo más fácil (opción recomendada)" @Yellow
        Write-Host ""

        Write-Host "✅ VERIFICAR QUE FUNCIONÓ" @Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" @Green
        Write-Host ""
        Write-Host "1. Abre en el navegador:" @Yellow
        Write-Host "   https://github.com/TU_USUARIO/puro-hockey" @Cyan
        Write-Host ""
        Write-Host "2. Deberías ver:" @Yellow
        Write-Host "   ✓ Todos tus archivos" @Green
        Write-Host "   ✓ Los commits" @Green
        Write-Host "   ✓ El historio de Git" @Green
        Write-Host ""

        Write-Host "Presiona Enter para volver al menú..." @Yellow
        Read-Host
        & $PSCommandPath
    }
    "0" {
        Write-Host "Hasta luego 👋" @Yellow
        exit 0
    }
    default {
        Write-Host "❌ Opción inválida" @Red
        Start-Sleep -Seconds 2
        & $PSCommandPath
    }
}

Write-Host ""
Write-Host "Presiona Enter para terminar..." @Yellow
Read-Host

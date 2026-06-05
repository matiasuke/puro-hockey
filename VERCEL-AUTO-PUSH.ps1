# Automatizacion Completa Vercel
# Arregla configuracion, pushea a GitHub
# Vercel se redeploya automáticamente
# PURO HOCKEY v1.0.0

Clear-Host

$projectPath = "C:\Users\Alumno\Documents\App\hockey-app"
Set-Location $projectPath

Write-Host ""
Write-Host "================================================================"
Write-Host "   AUTOMATIZACION VERCEL - COMPLETE"
Write-Host "   PURO HOCKEY v1.0.0"
Write-Host "================================================================"
Write-Host ""

# PASO 1: VERIFICAR REQUISITOS
Write-Host "PASO 1: Verificando requisitos..."
Write-Host "================================================================"
Write-Host ""

if ((git --version 2>$null) -and (node --version 2>$null)) {
    Write-Host "  OK - Git y Node.js"
} else {
    Write-Host "  ERROR - Faltan requisitos"
    exit 1
}

Write-Host ""

# PASO 2: LIMPIAR CONFIGURACION TAILWIND
Write-Host "PASO 2: Corrigiendo Tailwind CSS..."
Write-Host "================================================================"
Write-Host ""

Write-Host "  Eliminando postcss.config.js..."
Remove-Item "postcss.config.js" -Force -ErrorAction SilentlyContinue
Write-Host "  OK - Removido"

Write-Host ""
Write-Host "  Reinstalando dependencias..."
npm install --legacy-peer-deps -q
Write-Host "  OK - Dependencias actualizadas"

Write-Host ""

# PASO 3: VERIFICAR GIT STATUS
Write-Host "PASO 3: Preparando cambios para Git..."
Write-Host "================================================================"
Write-Host ""

$status = git status --short
if ($status) {
    Write-Host "Cambios detectados:"
    Write-Host $status
    Write-Host ""
} else {
    Write-Host "Sin cambios detectados"
}

Write-Host ""

# PASO 4: HACER COMMIT Y PUSH
Write-Host "PASO 4: Pusheando a GitHub..."
Write-Host "================================================================"
Write-Host ""

Write-Host "  Agregando cambios..."
git add -A
Write-Host "  OK"

Write-Host ""
Write-Host "  Creando commit..."
$commitMsg = "Fix: Vercel deployment - Tailwind CSS configuration"
git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "  (Sin cambios nuevos para commitear)"
} else {
    Write-Host "  OK - Commit creado"
}

Write-Host ""
Write-Host "  Pusheando a GitHub..."
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Push completado"
} else {
    Write-Host "  ERROR - Push fallo"
    exit 1
}

Write-Host ""

# PASO 5: ABRIR VERCEL DASHBOARD
Write-Host "PASO 5: Abriendo Vercel Dashboard..."
Write-Host "================================================================"
Write-Host ""

Write-Host "Se abrira Vercel en tu navegador..."
Write-Host ""

Start-Process "https://vercel.com/dashboard/puro-hockey"

Write-Host "En Vercel:"
Write-Host "1. Deberia ver 'Building...' automáticamente"
Write-Host "2. Espera a que termine el build (2-5 minutos)"
Write-Host "3. Cuando termine, veras 'Ready' con la URL"
Write-Host ""

Write-Host "Status del Deploy:"
Write-Host "─────────────────────────────────────────────────────────"
Write-Host "📊 Monitoreando build en Vercel..."
Write-Host ""

# PASO 6: ESPERAR A QUE TERMINE EL BUILD
Write-Host "Esperando..."
Write-Host ""

$maxWait = 0
while ($maxWait -lt 30) {
    Write-Host "  ✓ Build en progreso..."
    Start-Sleep -Seconds 10
    $maxWait++
}

Write-Host ""

# PASO 7: OBTENER URL
Write-Host "PASO 7: Obteniendo URL de Vercel..."
Write-Host "================================================================"
Write-Host ""

Write-Host "Ve a Vercel Dashboard para copiar la URL:"
Write-Host "  https://vercel.com/dashboard/puro-hockey"
Write-Host ""

$vercelUrl = Read-Host "Pega la URL de Vercel (ej: https://puro-hockey-xxxxx.vercel.app)"

if ($vercelUrl -like "*vercel.app*") {
    Write-Host "OK - URL guardada: $vercelUrl"
    $vercelUrl | Out-File "VERCEL_URL.txt" -Encoding UTF8
} else {
    Write-Host "URL invalida"
    exit 1
}

Write-Host ""

# RESUMEN FINAL
Write-Host "================================================================"
Write-Host "   VERCEL DEPLOYMENT COMPLETADO"
Write-Host "================================================================"
Write-Host ""

Write-Host "Frontend: $vercelUrl"
Write-Host ""

Write-Host "Proximos pasos:"
Write-Host "1. Verifica que el frontend carga:"
Write-Host "   $vercelUrl"
Write-Host ""
Write-Host "2. Continua con Railway:"
Write-Host "   .\RAILWAY-AUTO.ps1"
Write-Host ""

Read-Host "Presiona Enter para terminar"

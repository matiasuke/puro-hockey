# Deployment Completo Automatizado
# Vercel + Railway
# PURO HOCKEY v1.0.0

Clear-Host

$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Red = "Red"
$Cyan = "Cyan"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host "   DEPLOYMENT PURO HOCKEY - COMPLETO" -ForegroundColor $Blue
Write-Host "   Vercel + Railway Automatizado" -ForegroundColor $Blue
Write-Host "================================================================" -ForegroundColor $Blue
Write-Host ""

Write-Host "Este script automatiza el deployment:" -ForegroundColor $Yellow
Write-Host "  1. Vercel (Frontend)" -ForegroundColor $Cyan
Write-Host "  2. Railway (Backend)" -ForegroundColor $Cyan
Write-Host "  3. Conexion entre servicios" -ForegroundColor $Cyan
Write-Host ""

$continuar = Read-Host "Continuar? (s/n)"
if ($continuar -ne "s") {
    exit 0
}

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 1: VERCEL
# ═══════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host "   FASE 1: VERCEL DEPLOYMENT" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

& ".\VERCEL-AUTO.ps1"

Write-Host ""

# ═══════════════════════════════════════════════════════════════════════
# FASE 2: RAILWAY
# ═══════════════════════════════════════════════════════════════════════

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host "   FASE 2: RAILWAY DEPLOYMENT" -ForegroundColor $Yellow
Write-Host "================================================================" -ForegroundColor $Yellow
Write-Host ""

& ".\RAILWAY-AUTO.ps1"

Write-Host ""
Write-Host "================================================================" -ForegroundColor $Green
Write-Host "   PURO HOCKEY EN PRODUCCION" -ForegroundColor $Green
Write-Host "================================================================" -ForegroundColor $Green
Write-Host ""

Read-Host "Presiona Enter para terminar"

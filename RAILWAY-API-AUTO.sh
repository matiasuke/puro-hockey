#!/bin/bash

# Automatizacion Railway via API
# PURO HOCKEY v1.0.0

clear

echo "================================================================"
echo "   RAILWAY DEPLOYMENT - SEMI-AUTOMATIZADO"
echo "   PURO HOCKEY v1.0.0"
echo "================================================================"
echo ""

PROJECT_PATH="/c/Users/Alumno/Documents/App/hockey-app"
cd "$PROJECT_PATH"

# ═══════════════════════════════════════════════════════════════════
# PASO 1: OBTENER URL DE VERCEL
# ═══════════════════════════════════════════════════════════════════

echo "PASO 1: Leyendo URL de Vercel..."
echo "================================================================"
echo ""

if [ -f "VERCEL_URL.txt" ]; then
    VERCEL_URL=$(cat VERCEL_URL.txt)
    echo "✓ URL de Vercel leída: $VERCEL_URL"
else
    echo "⚠ VERCEL_URL.txt no encontrado"
    read -p "Pega la URL de Vercel: " VERCEL_URL
    echo "$VERCEL_URL" > VERCEL_URL.txt
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 2: INSTRUCCIONES PARA RAILWAY
# ═══════════════════════════════════════════════════════════════════

echo "PASO 2: Abriendo Railway..."
echo "================================================================"
echo ""

echo "Se abrirá Railway en tu navegador"
echo ""

# Intentar abrir navegador (Windows)
if command -v cmd &> /dev/null; then
    cmd /c "start https://railway.app"
else
    # Linux/Mac
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://railway.app"
    fi
fi

echo ""
echo "INSTRUCCIONES EN RAILWAY:"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Login con GitHub"
echo "2. Click: 'Start a New Project'"
echo "3. Click: 'Deploy from GitHub repo'"
echo "4. Selecciona: matiasuke/puro-hockey"
echo ""
echo "5. CREAR SERVICIOS:"
echo ""
echo "   A) PostgreSQL:"
echo "      - Add Service > Database > PostgreSQL"
echo "      - ESPERA 1-2 minutos"
echo ""
echo "   B) Node.js:"
echo "      - Add Service > GitHub Repo"
echo "      - Repo: matiasuke/puro-hockey"
echo "      - Name: puro-hockey-backend"
echo ""
echo "6. EN EL SERVICIO NODE.JS - VARIABLES:"
echo "   Click: Variables"
echo ""
echo "   Agrega EXACTAMENTE:"
echo "   ┌─────────────────────────────────────────────────┐"
echo "   │ NODE_ENV = production                           │"
echo "   │ PORT = 5000                                     │"
echo "   │ LOG_LEVEL = info                                │"
echo "   │ DATABASE_URL = \${{Postgres.DATABASE_URL}}        │"
echo "   │ JWT_SECRET = miClaveSeguraMinimo32Caracteres    │"
echo "   │ CORS_ORIGIN = $VERCEL_URL                        │"
echo "   └─────────────────────────────────────────────────┘"
echo ""
echo "7. Click: Save"
echo "8. ESPERA 5-10 minutos para el deploy"
echo ""

read -p "Presiona Enter cuando hayas creado los servicios y configurado las variables..."

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 3: OBTENER URL DE RAILWAY
# ═══════════════════════════════════════════════════════════════════

echo "PASO 3: Obteniendo URL de Railway..."
echo "================================================================"
echo ""

echo "En Railway Dashboard:"
echo "1. Click en servicio: puro-hockey-backend"
echo "2. Busca: 'Public URL'"
echo "3. COPIA la URL"
echo ""

read -p "Pega la URL publica de Railway: " RAILWAY_URL

if [ -z "$RAILWAY_URL" ]; then
    echo "ERROR: URL vacía"
    exit 1
fi

echo "✓ Railway URL guardada: $RAILWAY_URL"
echo "$RAILWAY_URL" > RAILWAY_URL.txt
echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 4: ACTUALIZAR VERCEL
# ═══════════════════════════════════════════════════════════════════

echo "PASO 4: Actualizando Vercel con URL de Railway..."
echo "================================================================"
echo ""

echo "Abriendo Vercel Dashboard..."
echo ""

if command -v cmd &> /dev/null; then
    cmd /c "start https://vercel.com/dashboard"
fi

echo ""
echo "INSTRUCCIONES EN VERCEL:"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Abre tu proyecto: puro-hockey"
echo "2. Settings > Environment Variables"
echo "3. EDITA estas variables:"
echo ""
echo "   VITE_API_URL = $RAILWAY_URL"
RAILWAY_HOST=$(echo "$RAILWAY_URL" | sed 's/https:\/\///')
echo "   VITE_WS_URL = wss://$RAILWAY_HOST"
echo ""
echo "4. Click: Save"
echo "5. Vercel se redeployará automáticamente (2-3 min)"
echo ""

read -p "Presiona Enter cuando hayas actualizado Vercel..."

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 5: MIGRACIONES
# ═══════════════════════════════════════════════════════════════════

echo "PASO 5: Migraciones (OPCIONAL)"
echo "================================================================"
echo ""

echo "Para crear tablas en la BD, en Railway Dashboard:"
echo "1. Click en servicio: puro-hockey-backend"
echo "2. Click: 'Connect'"
echo "3. Terminal:"
echo "   npm run migrate"
echo "   npm run seed"
echo ""

read -p "¿Ya ejecutaste migraciones? (s/n): " MIGRATIONS

echo ""

# ═══════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════════════

echo "================================================================"
echo "   DEPLOYMENT COMPLETADO"
echo "================================================================"
echo ""

echo "Frontend: $VERCEL_URL"
echo "Backend:  $RAILWAY_URL"
echo "GitHub:   https://github.com/matiasuke/puro-hockey"
echo ""

echo "VERIFICACION:"
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "1. Frontend (debería cargar):"
echo "   $VERCEL_URL"
echo ""
echo "2. Health Check (debería retornar JSON):"
echo "   $RAILWAY_URL/health"
echo ""
echo "3. Login:"
echo "   Usuario: admin@example.com"
echo "   Contraseña: password"
echo ""

echo "✓ URLs guardadas en: VERCEL_URL.txt y RAILWAY_URL.txt"
echo ""

echo "================================================================"
echo "   PURO HOCKEY EN PRODUCCION"
echo "================================================================"
echo ""

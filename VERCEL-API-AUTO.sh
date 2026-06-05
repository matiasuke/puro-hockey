#!/bin/bash

# Automatizacion Vercel via API
# PURO HOCKEY v1.0.0
# Completamente automatizado sin interaccion

clear

echo "================================================================"
echo "   VERCEL DEPLOYMENT - API AUTOMATIZADO"
echo "   PURO HOCKEY v1.0.0"
echo "================================================================"
echo ""

PROJECT_PATH="/c/Users/Alumno/Documents/App/hockey-app"
cd "$PROJECT_PATH"

# ═══════════════════════════════════════════════════════════════════
# PASO 1: VERIFICAR REQUISITOS
# ═══════════════════════════════════════════════════════════════════

echo "PASO 1: Verificando requisitos..."
echo "================================================================"
echo ""

# Verificar Git
if git --version &> /dev/null; then
    echo "✓ Git: OK"
else
    echo "✗ Git: ERROR"
    exit 1
fi

# Verificar Node
if node --version &> /dev/null; then
    echo "✓ Node.js: OK"
else
    echo "✗ Node.js: ERROR"
    exit 1
fi

# Verificar npm
if npm --version &> /dev/null; then
    echo "✓ npm: OK"
else
    echo "✗ npm: ERROR"
    exit 1
fi

# Verificar curl
if curl --version &> /dev/null; then
    echo "✓ curl: OK"
else
    echo "✗ curl: ERROR"
    exit 1
fi

# Verificar código en GitHub
REMOTE=$(git config --get remote.origin.url)
if [[ $REMOTE == *"puro-hockey"* ]]; then
    echo "✓ GitHub: puro-hockey"
else
    echo "✗ GitHub: ERROR"
    exit 1
fi

# Verificar vercel.json
if [ -f "vercel.json" ]; then
    echo "✓ vercel.json: OK"
else
    echo "✗ vercel.json: NOT FOUND"
    exit 1
fi

echo ""
echo "✓ Todos los requisitos OK"
echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 2: INSTALAR VERCEL CLI
# ═══════════════════════════════════════════════════════════════════

echo "PASO 2: Verificando Vercel CLI..."
echo "================================================================"
echo ""

if vercel --version &> /dev/null; then
    echo "✓ Vercel CLI: Ya instalado"
else
    echo "Instalando Vercel CLI..."
    npm install -g vercel -q
    echo "✓ Vercel CLI: Instalado"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 3: OBTENER TOKEN VERCEL
# ═══════════════════════════════════════════════════════════════════

echo "PASO 3: Configurando autenticacion..."
echo "================================================================"
echo ""

# Verificar si hay token en archivo
if [ -f ".vercel/auth.json" ]; then
    echo "✓ Token almacenado encontrado"
    TOKEN_EXISTS=true
else
    echo "Token no encontrado"
    echo ""
    echo "Necesitamos un token de Vercel:"
    echo "1. Abre: https://vercel.com/account/tokens"
    echo "2. Click: Create"
    echo "3. Nombre: puro-hockey-auto"
    echo "4. COPIA el token"
    echo ""
    read -p "Pega tu token de Vercel: " VERCEL_TOKEN

    if [ -z "$VERCEL_TOKEN" ]; then
        echo "ERROR: Token vacío"
        exit 1
    fi

    export VERCEL_TOKEN
    TOKEN_EXISTS=false
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 4: BUILD LOCAL
# ═══════════════════════════════════════════════════════════════════

echo "PASO 4: Build local..."
echo "================================================================"
echo ""

echo "Ejecutando: npm run build"
npm run build

if [ $? -ne 0 ]; then
    echo "ERROR: Build falló"
    exit 1
fi

echo "✓ Build completado"
echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 5: DEPLOY A VERCEL
# ═══════════════════════════════════════════════════════════════════

echo "PASO 5: Desplegando a Vercel..."
echo "================================================================"
echo ""

echo "Ejecutando: vercel --prod"

# Deploy con token
if [ "$TOKEN_EXISTS" = true ]; then
    DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
else
    DEPLOY_OUTPUT=$(vercel --prod --yes --token="$VERCEL_TOKEN" 2>&1)
fi

echo "$DEPLOY_OUTPUT"
echo ""

# Extraer URL
VERCEL_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[a-zA-Z0-9\-]+\.vercel\.app' | head -1)

if [ -z "$VERCEL_URL" ]; then
    echo "ERROR: No se pudo obtener URL de Vercel"
    echo ""
    echo "Ve a: https://vercel.com/dashboard"
    echo "Selecciona proyecto: puro-hockey"
    read -p "Pega la URL manualmente: " VERCEL_URL
fi

if [ -z "$VERCEL_URL" ]; then
    echo "ERROR: URL vacía"
    exit 1
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# PASO 6: GUARDAR URL Y VERIFICAR
# ═══════════════════════════════════════════════════════════════════

echo "PASO 6: Verificando deployment..."
echo "================================================================"
echo ""

echo "Guardando URL: $VERCEL_URL"
echo "$VERCEL_URL" > VERCEL_URL.txt

echo "Esperando a que Vercel esté listo..."
sleep 5

# Intentar acceder a la URL
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$VERCEL_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Frontend verificado: $VERCEL_URL"
else
    echo "⚠ Frontend aún se está inicializando (HTTP $HTTP_CODE)"
    echo "   Intenta en unos segundos: $VERCEL_URL"
fi

echo ""

# ═══════════════════════════════════════════════════════════════════
# RESUMEN FINAL
# ═══════════════════════════════════════════════════════════════════

echo "================================================================"
echo "   VERCEL DEPLOYMENT COMPLETADO"
echo "================================================================"
echo ""

echo "Frontend: $VERCEL_URL"
echo ""

echo "PROXIMOS PASOS:"
echo "1. Verifica que el frontend carga:"
echo "   $VERCEL_URL"
echo ""
echo "2. Continua con Railway:"
echo "   bash RAILWAY-API-AUTO.sh"
echo ""

echo "✓ URL guardada en: VERCEL_URL.txt"
echo ""

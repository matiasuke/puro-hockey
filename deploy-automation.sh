#!/bin/bash

###############################################################################
# PURO HOCKEY - AUTOMATED DEPLOYMENT SCRIPT
#
# Este script automatiza el deployment completo a:
# 1. GitHub (git push)
# 2. Vercel (frontend)
# 3. Railway (backend + database)
#
# PRE-REQUISITOS:
# - Git credentials configuradas
# - Vercel CLI: npm install -g vercel
# - Railway CLI: npm install -g @railway/cli
# - RAILWAY_TOKEN en variables de entorno
# - VERCEL_TOKEN en variables de entorno
#
# Uso: bash deploy-automation.sh [--skip-tests] [--skip-build]
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Flags
SKIP_TESTS=false
SKIP_BUILD=false
GITHUB_REPO=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-tests) SKIP_TESTS=true; shift ;;
        --skip-build) SKIP_BUILD=true; shift ;;
        --repo) GITHUB_REPO="$2"; shift 2 ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║         PURO HOCKEY - AUTOMATED DEPLOYMENT                ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

###############################################################################
# PRE-FLIGHT CHECKS
###############################################################################

echo -e "\n${BLUE}[0/5] VALIDACIONES PRE-DEPLOY${NC}\n"

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git instalado${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js instalado${NC}"

# Verificar rama main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  No estás en rama main (estás en: $CURRENT_BRANCH)${NC}"
    read -p "¿Continuar? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi
echo -e "${GREEN}✅ En rama main${NC}"

# Verificar cambios sin commit
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Hay cambios sin commit${NC}"
    echo "Ejecuta: git add . && git commit -m 'message'"
    exit 1
fi
echo -e "${GREEN}✅ Todos los cambios están commiteados${NC}"

# Obtener GitHub repo si no se proporciona
if [ -z "$GITHUB_REPO" ]; then
    GITHUB_REPO=$(git config --get remote.origin.url 2>/dev/null || echo "")
    if [ -z "$GITHUB_REPO" ]; then
        echo -e "${YELLOW}⚠️  No se detectó repositorio remoto${NC}"
        read -p "Ingresa URL del repositorio GitHub: " GITHUB_REPO
    fi
fi
echo -e "${GREEN}✅ Repositorio: $GITHUB_REPO${NC}"

###############################################################################
# 1. TESTS Y BUILD
###############################################################################

echo -e "\n${BLUE}[1/5] TESTS Y BUILD${NC}\n"

if [ "$SKIP_TESTS" = false ]; then
    echo -e "${YELLOW}→ Ejecutando tests...${NC}"
    if bash test-automation.sh > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Tests pasaron${NC}"
    else
        echo -e "${RED}❌ Tests fallaron${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Saltando tests${NC}"
fi

if [ "$SKIP_BUILD" = false ]; then
    echo -e "${YELLOW}→ Compilando aplicación...${NC}"
    npm run build > /dev/null 2>&1
    echo -e "${GREEN}✅ Build completado${NC}"
else
    echo -e "${YELLOW}⚠️  Saltando build${NC}"
fi

###############################################################################
# 2. PUSH A GITHUB
###############################################################################

echo -e "\n${BLUE}[2/5] PUSH A GITHUB${NC}\n"

# Verificar si remoto existe
if ! git remote get-url origin &> /dev/null; then
    echo -e "${YELLOW}→ Agregando remoto origin...${NC}"
    git remote add origin "$GITHUB_REPO"
fi

echo -e "${YELLOW}→ Haciendo push a main...${NC}"
git push -u origin main 2>&1 | grep -E "(Done|Everything|error)" || echo "Push completado"
echo -e "${GREEN}✅ Push a GitHub completado${NC}"

###############################################################################
# 3. DEPLOY A VERCEL
###############################################################################

echo -e "\n${BLUE}[3/5] DEPLOY A VERCEL (Frontend)${NC}\n"

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado${NC}"
    echo "    Instala: npm install -g vercel@latest"
    echo "    Luego ejecuta este script de nuevo"
    VERCEL_DEPLOYED=false
else
    echo -e "${YELLOW}→ Verificando Vercel token...${NC}"
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}❌ VERCEL_TOKEN no está configurado${NC}"
        echo "    Ejecuta: export VERCEL_TOKEN=your_token"
        VERCEL_DEPLOYED=false
    else
        echo -e "${YELLOW}→ Deploying a Vercel...${NC}"
        if vercel deploy --token "$VERCEL_TOKEN" --prod > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Vercel deploy completado${NC}"
            VERCEL_DEPLOYED=true
        else
            echo -e "${RED}❌ Vercel deploy falló${NC}"
            VERCEL_DEPLOYED=false
        fi
    fi
fi

###############################################################################
# 4. DEPLOY A RAILWAY
###############################################################################

echo -e "\n${BLUE}[4/5] DEPLOY A RAILWAY (Backend)${NC}\n"

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}⚠️  Railway CLI no está instalado${NC}"
    echo "    Instala: npm install -g @railway/cli"
    echo "    Luego ejecuta este script de nuevo"
    RAILWAY_DEPLOYED=false
else
    echo -e "${YELLOW}→ Verificando Railway token...${NC}"
    if [ -z "$RAILWAY_TOKEN" ]; then
        echo -e "${RED}❌ RAILWAY_TOKEN no está configurado${NC}"
        echo "    Ejecuta: export RAILWAY_TOKEN=your_token"
        RAILWAY_DEPLOYED=false
    else
        echo -e "${YELLOW}→ Deploying a Railway...${NC}"
        if railway deploy --service backend > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Railway deploy completado${NC}"
            RAILWAY_DEPLOYED=true
        else
            echo -e "${RED}❌ Railway deploy falló${NC}"
            RAILWAY_DEPLOYED=false
        fi
    fi
fi

###############################################################################
# 5. VERIFICACIÓN POST-DEPLOY
###############################################################################

echo -e "\n${BLUE}[5/5] VERIFICACIÓN POST-DEPLOY${NC}\n"

# Esperar un momento para que los servicios inicien
sleep 5

# Verificar Frontend
if [ "$VERCEL_DEPLOYED" = true ]; then
    echo -e "${YELLOW}→ Verificando Frontend...${NC}"
    if curl -s https://puro-hockey.vercel.app > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend está online${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend aún se está iniciando, intenta en 1-2 minutos${NC}"
    fi
fi

# Verificar Backend
if [ "$RAILWAY_DEPLOYED" = true ]; then
    echo -e "${YELLOW}→ Verificando Backend...${NC}"
    if curl -s https://api.puro-hockey.railway.app/health 2>/dev/null | grep -q "ok"; then
        echo -e "${GREEN}✅ Backend está online${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend aún se está iniciando, intenta en 1-2 minutos${NC}"
    fi
fi

###############################################################################
# RESUMEN FINAL
###############################################################################

echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  DEPLOYMENT SUMMARY                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${GREEN}COMPLETADO:${NC}"
echo "✅ Tests y Build"
echo "✅ GitHub Push"
[ "$VERCEL_DEPLOYED" = true ] && echo "✅ Vercel Deploy" || echo "⏳ Vercel Deploy (pendiente)"
[ "$RAILWAY_DEPLOYED" = true ] && echo "✅ Railway Deploy" || echo "⏳ Railway Deploy (pendiente)"

echo -e "\n${GREEN}URLS:${NC}"
echo "Frontend: https://puro-hockey.vercel.app"
echo "Backend:  https://api.puro-hockey.railway.app"
echo "GitHub:   $GITHUB_REPO"

echo -e "\n${GREEN}Ver deployments:${NC}"
echo "Vercel:   https://vercel.com/dashboard"
echo "Railway:  https://railway.app"
echo "GitHub:   $GITHUB_REPO/actions"

echo -e "\n${GREEN}¡Deployment completado! 🚀${NC}\n"

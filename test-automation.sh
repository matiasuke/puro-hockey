#!/bin/bash

###############################################################################
# PURO HOCKEY - AUTOMATED TESTING SCRIPT
#
# Ejecuta todos los tests:
# 1. Validación de sintaxis
# 2. Linting
# 3. Type checking
# 4. Build tests
# 5. Docker validation
# 6. API endpoint tests (si backend está corriendo)
#
# Uso: bash test-automation.sh
###############################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
TESTS_PASSED=0
TESTS_FAILED=0
START_TIME=$(date +%s)

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║         PURO HOCKEY - AUTOMATED TESTING SUITE             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

###############################################################################
# FUNCIONES AUXILIARES
###############################################################################

test_result() {
    local test_name=$1
    local exit_code=$2

    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ PASSED${NC}: $test_name"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAILED${NC}: $test_name"
        ((TESTS_FAILED++))
    fi
}

run_test() {
    local test_name=$1
    local command=$2

    echo -e "${YELLOW}→${NC} $test_name..."
    if eval "$command" > /dev/null 2>&1; then
        test_result "$test_name" 0
    else
        test_result "$test_name" 1
    fi
}

###############################################################################
# 1. VALIDACIÓN DE SINTAXIS
###############################################################################

echo -e "${BLUE}[1/6] VALIDACIÓN DE SINTAXIS${NC}\n"

# JavaScript/TypeScript files
echo -e "${YELLOW}→${NC} Verificando errores de sintaxis..."
SYNTAX_ERRORS=0
for file in $(find src backend -name "*.ts" -o -name "*.tsx" -o -name "*.js" 2>/dev/null | head -20); do
    if ! node -c "$file" 2>/dev/null; then
        ((SYNTAX_ERRORS++))
    fi
done

if [ $SYNTAX_ERRORS -eq 0 ]; then
    test_result "Sintaxis válida" 0
else
    test_result "Sintaxis válida ($SYNTAX_ERRORS errores)" 1
fi

###############################################################################
# 2. LINTING
###############################################################################

echo -e "\n${BLUE}[2/6] LINTING${NC}\n"

# ESLint Frontend
if [ -f .eslintrc.json ] || [ -f eslint.config.js ]; then
    run_test "ESLint Frontend" "npm run lint --if-present"
fi

###############################################################################
# 3. TYPE CHECKING
###############################################################################

echo -e "\n${BLUE}[3/6] TYPE CHECKING${NC}\n"

# TypeScript compilation
run_test "TypeScript Frontend" "npx tsc --noEmit --project tsconfig.json"

###############################################################################
# 4. BUILD TESTS
###############################################################################

echo -e "\n${BLUE}[4/6] BUILD TESTS${NC}\n"

# Frontend build
run_test "Frontend Build" "npm run build"

# Backend package validation
run_test "Backend Package" "cd backend && npm list > /dev/null && cd .."

###############################################################################
# 5. DOCKER VALIDATION
###############################################################################

echo -e "\n${BLUE}[5/6] DOCKER VALIDATION${NC}\n"

if command -v docker &> /dev/null; then
    # Dockerfile.frontend
    run_test "Dockerfile.frontend" "docker build -f Dockerfile.frontend -t hockey-frontend:test . --quiet"

    # Dockerfile.backend
    run_test "Dockerfile.backend" "docker build -f Dockerfile.backend -t hockey-backend:test . --quiet"

    # docker-compose
    run_test "docker-compose.yml" "docker-compose config > /dev/null"
else
    echo -e "${YELLOW}⚠️  Docker no instalado, saltando Docker tests${NC}"
fi

###############################################################################
# 6. API ENDPOINT TESTS
###############################################################################

echo -e "\n${BLUE}[6/6] API ENDPOINT TESTS${NC}\n"

# Verificar si backend está corriendo
if curl -s http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${YELLOW}→ Backend está corriendo, ejecutando tests...${NC}\n"

    # Health check
    run_test "GET /health" "curl -s http://localhost:5000/health | grep -q 'ok'"

    # Auth endpoints
    run_test "POST /auth/login (endpoint exists)" "curl -s -X POST http://localhost:5000/api/auth/login -H 'Content-Type: application/json' -d '{}'  | grep -q -E '(invalid|missing|error|email)'"

else
    echo -e "${YELLOW}⚠️  Backend no está corriendo en localhost:5000${NC}"
    echo -e "${YELLOW}   Para ejecutar tests de API: docker-compose up -d${NC}"
fi

###############################################################################
# RESUMEN FINAL
###############################################################################

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "\n${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    TEST RESULTS SUMMARY                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "⏱️  Duración: ${DURATION}s"
echo -e "${GREEN}✅ Tests Pasados: $TESTS_PASSED${NC}"
echo -e "${RED}❌ Tests Fallidos: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✨ TODOS LOS TESTS PASARON ✨${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    exit 0
else
    echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}⚠️  ALGUNOS TESTS FALLARON${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    exit 1
fi

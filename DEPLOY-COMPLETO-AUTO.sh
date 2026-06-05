#!/bin/bash

# Deployment Completo Automatizado
# Vercel + Railway
# PURO HOCKEY v1.0.0

clear

echo "================================================================"
echo "   DEPLOYMENT PURO HOCKEY - COMPLETO"
echo "   Vercel + Railway Automatizado"
echo "================================================================"
echo ""

PROJECT_PATH="/c/Users/Alumno/Documents/App/hockey-app"
cd "$PROJECT_PATH"

# Ejecutar Vercel
echo "FASE 1: VERCEL DEPLOYMENT"
echo "================================================================"
echo ""

bash VERCEL-API-AUTO.sh

if [ $? -ne 0 ]; then
    echo "ERROR en Vercel deployment"
    exit 1
fi

echo ""

# Ejecutar Railway
echo ""
echo "FASE 2: RAILWAY DEPLOYMENT"
echo "================================================================"
echo ""

bash RAILWAY-API-AUTO.sh

if [ $? -ne 0 ]; then
    echo "ERROR en Railway deployment"
    exit 1
fi

echo ""
echo "================================================================"
echo "   PURO HOCKEY EN PRODUCCION"
echo "================================================================"
echo ""

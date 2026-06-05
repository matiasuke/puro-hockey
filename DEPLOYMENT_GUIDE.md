# 🚀 DEPLOYMENT REAL - GUÍA PASO A PASO

## 📋 Requisitos Previos

- ✅ Repositorio GitHub creado
- ✅ Cuenta Vercel (vercel.com)
- ✅ Cuenta Railway (railway.app)
- ✅ Dominio personalizado (opcional)
- ✅ Git instalado localmente

---

## 🔧 PASO 1: Preparar Repositorio GitHub

### 1.1 Crear repositorio

```bash
cd ~/Documents/App/hockey-app
git init
git branch -M main
git add .
git commit -m "Initial commit: PURO HOCKEY v1.0.0"
git remote add origin https://github.com/usuario/hockey-app.git
git push -u origin main
```

### 1.2 Crear ramas para desarrollo

```bash
git branch develop
git push origin develop

# Crear rama para features
git checkout -b feature/payment-system
git push origin feature/payment-system
```

### 1.3 Configurar Branch Protection (GitHub Web UI)

```
Settings → Branches → Add rule
├─ Branch name pattern: main
├─ Require pull request reviews before merging: ✓
├─ Require status checks to pass before merging: ✓
└─ Include administrators: ✓
```

---

## 🌐 PASO 2: Deploy Frontend a Vercel

### 2.1 Crear cuenta y proyecto

```bash
# 1. Ir a https://vercel.com/signup
# 2. Registrarse con GitHub
# 3. Autorizar acceso a repositorio
# 4. Seleccionar hockey-app
```

### 2.2 Configurar proyecto en Vercel

```
Import Project
├─ Repository: hockey-app
├─ Build Settings:
│  ├─ Framework: Vite
│  ├─ Build Command: npm run build
│  └─ Output Directory: dist
└─ Environment Variables (ver paso 2.3)
```

### 2.3 Agregar variables de entorno

En Vercel Dashboard → Settings → Environment Variables:

```
Variable Name: VITE_API_URL
Production:    https://api.puro-hockey.com/api
Preview:       https://api-staging.puro-hockey.com/api
Development:   http://localhost:5000/api

Variable Name: VITE_WS_URL
Production:    wss://api.puro-hockey.com
Preview:       wss://api-staging.puro-hockey.com
Development:   ws://localhost:5000

Variable Name: VITE_SENTRY_DSN
Value:         [Tu Sentry DSN - opcional]
```

### 2.4 Generar Vercel tokens

```bash
# En Vercel Dashboard → Settings → Tokens
# Crear "VERCEL_TOKEN"
# Crear "VERCEL_ORG_ID"
# Crear "VERCEL_PROJECT_ID"

# Agregar a GitHub → Settings → Secrets:
VERCEL_TOKEN=<token>
VERCEL_ORG_ID=<org-id>
VERCEL_PROJECT_ID=<project-id>
```

### 2.5 Configurar dominio personalizado

```
Vercel Dashboard → Settings → Domains
├─ Add Domain: puro-hockey.com
├─ Verificar DNS (A record o CNAME)
└─ Add Domain: www.puro-hockey.com
```

### 2.6 Verificar deployment

```bash
# Hacer un commit para trigger deploy
git commit -m "Setup Vercel deployment"
git push origin main

# Ver deploy en Vercel Dashboard
# URL: https://puro-hockey.com
```

---

## 🚂 PASO 3: Deploy Backend a Railway

### 3.1 Crear cuenta y proyecto

```bash
# 1. Ir a https://railway.app/login
# 2. Registrarse con GitHub
# 3. Autorizar acceso
# 4. Crear nuevo proyecto
```

### 3.2 Crear servicio PostgreSQL

```
New → Database → PostgreSQL
├─ Railway crea automáticamente
├─ Obtener DATABASE_URL
└─ Guardar para paso 3.3
```

### 3.3 Agregar servicio Backend

```
New → GitHub Repo
├─ Seleccionar hockey-app
├─ Configure:
│  ├─ Build: npm ci --prefix backend
│  ├─ Start: npm start --prefix backend
│  └─ Port: 5000
└─ Crear servicio
```

### 3.4 Agregar variables de entorno

En Railway → Project → Variables:

```
NODE_ENV = production
PORT = 5000
LOG_LEVEL = info
JWT_SECRET = [generar 32+ caracteres aleatorios]
CORS_ORIGIN = https://puro-hockey.com
DATABASE_URL = [copiar desde servicio PostgreSQL]
```

```bash
# Generar JWT_SECRET seguro:
openssl rand -base64 32
```

### 3.5 Ejecutar migraciones

```bash
# Via Railway CLI o Dashboard:
railway run --service backend npm run migrate
```

### 3.6 Generar Railway token

```bash
# En https://railway.app/account/tokens
# Crear token
# Agregar a GitHub → Settings → Secrets:

RAILWAY_TOKEN=<token>
```

### 3.7 Configurar dominio personalizado

```
Railway Dashboard → Services → Backend → Settings
├─ Add Domain: api.puro-hockey.com
├─ Configurar DNS CNAME
└─ Esperar verificación
```

### 3.8 Verificar deployment

```bash
# Test health endpoint:
curl https://api.puro-hockey.com/health

# Esperar respuesta:
# {"status": "ok"}
```

---

## 🔐 PASO 4: Configurar GitHub Secrets

En GitHub → Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN = [token de Vercel]
VERCEL_ORG_ID = [org id de Vercel]
VERCEL_PROJECT_ID = [project id de Vercel]
RAILWAY_TOKEN = [token de Railway]
SLACK_WEBHOOK = [opcional para notificaciones]
```

---

## ✅ PASO 5: Testing Workflows

### 5.1 Trigger test workflow

```bash
git checkout -b test/ci-cd
git add .
git commit -m "Test CI/CD workflows"
git push origin test/ci-cd

# Ir a GitHub → Actions
# Ver workflow en progress
```

### 5.2 Crear Pull Request

```bash
# GitHub UI → Compare & pull request
# Escribir descripción
# Merge cuando tests pasen ✓
```

### 5.3 Verificar deploys

Después de merge a main:

```bash
# Frontend:
# - Vercel despliega automáticamente
# - Ver en https://puro-hockey.com
# - Check: Lighthouse > 85

# Backend:
# - Railway despliega automáticamente
# - Ver en https://api.puro-hockey.com/health
# - Check: Response 200 {"status":"ok"}
```

---

## 📊 PASO 6: Configurar Monitoreo

### 6.1 Sentry (Error Tracking)

```bash
# 1. Crear cuenta en https://sentry.io
# 2. Crear proyecto → Next.js (frontend)
# 3. Crear proyecto → Node (backend)
# 4. Copiar DSN
```

```typescript
// Frontend: src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

```javascript
// Backend: backend/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 6.2 Agregar variables de entorno

**Vercel:**
```
VITE_SENTRY_DSN = [DSN de frontend]
```

**Railway:**
```
SENTRY_DSN = [DSN de backend]
```

### 6.3 Google Analytics (opcional)

```bash
# 1. Crear cuenta en https://analytics.google.com
# 2. Crear propiedad para puro-hockey.com
# 3. Copiar Measurement ID
```

```typescript
// src/main.tsx
import ReactGA from "react-ga4";

ReactGA.initialize(import.meta.env.VITE_GA_ID);
```

---

## 🔄 PASO 7: Configurar CI/CD Automático

### 7.1 Crear rama de staging

```bash
git checkout -b staging
git push origin staging

# En GitHub → Settings → Branches
# Agregar rama staging
```

### 7.2 Automatizar staging deploys

Editar `.github/workflows/deploy-backend.yml`:

```yaml
on:
  push:
    branches: [ main, staging ]
```

Editar `.github/workflows/deploy-frontend.yml`:

```yaml
on:
  push:
    branches: [ main, staging ]
```

### 7.3 Crear ambiente staging en Vercel

```
Project → Environments
├─ Production: main
└─ Preview: pull requests
```

### 7.4 Crear ambiente staging en Railway

```
New Project Staging
├─ Backend Staging
├─ Database Staging
└─ Variables para staging
```

---

## 📈 PASO 8: Verificación Post-Deployment

### 8.1 Checklist Funcional

```bash
# Frontend
[ ] Página carga sin errores
[ ] Login funciona
[ ] Todos los roles funcionan
[ ] Pagos flujo completo
[ ] Búsqueda en tiempo real
[ ] Notificaciones toast

# Backend
[ ] Health endpoint (/health) → 200
[ ] Login devuelve JWT
[ ] CRUD operaciones funcionan
[ ] Pagos endpoint funciona
[ ] Database conecta correctamente
[ ] Migrations ejecutadas

# API
[ ] CORS configurado
[ ] JWT validación funciona
[ ] Rate limiting activo
[ ] Errores retornan JSON
```

### 8.2 Performance Check

```bash
# Lighthouse
[ ] Performance > 85
[ ] Accessibility > 85
[ ] Best Practices > 85
[ ] SEO > 85

# API Response Times
[ ] GET requests < 200ms
[ ] POST requests < 300ms
[ ] Database queries < 100ms

# Sentry
[ ] Sin errores críticos
[ ] Eventos siendo capturados
[ ] Source maps configuradas
```

### 8.3 Security Scan

```bash
[ ] HTTPS funciona
[ ] Headers de seguridad presentes
[ ] No secrets en código
[ ] Database backup activo
[ ] Logs centralizados
```

---

## 🚨 Troubleshooting

### Error: "Frontend no se despliega en Vercel"

```bash
# Solución:
1. Verificar que npm run build funciona localmente
2. Verificar variables de entorno en Vercel
3. Ver logs en Vercel Dashboard
4. Hacer commit nuevo: git push origin main
```

### Error: "Backend no se despliega en Railway"

```bash
# Solución:
1. Verificar que npm start funciona
2. Verificar DATABASE_URL está correcta
3. Ejecutar migraciones manually
4. Ver logs: railway logs -s backend
5. Restart servicio: railway restart -s backend
```

### Error: "Frontend no conecta a API"

```bash
# Verificar:
1. VITE_API_URL en Vercel es correcto
2. CORS_ORIGIN en Railway es correcto
3. Backend está en línea: curl https://api.puro-hockey.com/health
4. JWT token es válido
```

### Error: "Database connection failed"

```bash
# Verificar:
1. DATABASE_URL está correcta
2. PostgreSQL está en línea
3. Migraciones ejecutadas
4. Passwords son correctos
```

---

## 📞 Soporte Post-Deployment

### Monitoreo 24/7

- Sentry: errores en tiempo real
- Railway: dashboard con métricas
- Vercel: logs de deploy
- Uptime monitoring: https://uptimerobot.com

### Escalamiento

Si necesitas más recursos:

```
Railway:
├─ Aumentar replicas: 1 → 2
├─ Aumentar memoria: 512MB → 1GB
└─ Upgrade database

Vercel:
├─ Pro plan para más builds
└─ Edge middleware si es necesario
```

---

## 🎉 ¡DEPLOYMENT COMPLETADO!

Frontend: https://puro-hockey.com
Backend API: https://api.puro-hockey.com
Admin Dashboard: https://puro-hockey.com/admin

**Monitorear regularmente:**
- Sentry alerts
- Railway metrics
- Vercel analytics
- Database backups

¡Tu aplicación PURO HOCKEY está en PRODUCCIÓN! 🚀

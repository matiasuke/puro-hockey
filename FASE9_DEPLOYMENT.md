# 🚀 FASE 9 - DEPLOYMENT Y PRODUCCIÓN

## 🎯 Objetivo de Fase 9

Preparar y desplegar la aplicación **PURO HOCKEY** a producción con:
- ✅ Dockerización (frontend, backend, base de datos)
- ✅ CI/CD con GitHub Actions
- ✅ Deploy automático a Vercel (frontend)
- ✅ Deploy automático a Railway/Heroku (backend)
- ✅ Configuración de variables de entorno
- ✅ Testing automatizado
- ✅ Monitoreo y logging
- ✅ Documentación completa

---

## 📋 Plan de Deployment

### **Paso 1: Preparación de Repositorio GitHub**

```bash
# 1. Crear repositorio público
cd ~/Documents/App/hockey-app
git init
git remote add origin https://github.com/usuario/hockey-app.git

# 2. Crear rama main
git branch -M main

# 3. Crear .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Frontend build
/build
/dist
.env.local
.env.*.local

# Backend
.env
.env.local
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Database
*.db
database/*.sql
EOF

# 4. Hacer commits y push
git add .
git commit -m "Initial commit: PURO HOCKEY v1.0.0"
git push -u origin main
```

### **Paso 2: Dockerización**

#### **2.1 Dockerfile Frontend (Vite + React)**

```dockerfile
# archivo: Dockerfile.frontend
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve para servir la aplicación
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### **2.2 Dockerfile Backend (Node.js + Express)**

```dockerfile
# archivo: Dockerfile.backend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/ .

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

#### **2.3 Docker Compose (Local Development)**

```yaml
# archivo: docker-compose.yml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    container_name: hockey-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend
    networks:
      - hockey-network

  # Backend
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: hockey-backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/hockey_db
      - JWT_SECRET=${JWT_SECRET:-your-secret-key-change-in-production}
      - VITE_API_URL=http://localhost:3000
    depends_on:
      - db
    networks:
      - hockey-network
    restart: unless-stopped

  # PostgreSQL Database
  db:
    image: postgres:15-alpine
    container_name: hockey-db
    environment:
      - POSTGRES_USER=hockey_user
      - POSTGRES_PASSWORD=hockey_password
      - POSTGRES_DB=hockey_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    networks:
      - hockey-network
    restart: unless-stopped

networks:
  hockey-network:
    driver: bridge

volumes:
  postgres_data:
```

#### **2.4 Comandos Docker**

```bash
# Build images
docker-compose build

# Start services (desarrollo)
docker-compose up -d

# Stop services
docker-compose down

# Ver logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Ejecutar migraciones
docker-compose exec backend npm run migrate
```

---

### **Paso 3: CI/CD con GitHub Actions**

#### **3.1 Workflow para Testing**

```yaml
# archivo: .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  # Backend Tests
  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: cd backend && npm ci

    - name: Run linter
      run: cd backend && npm run lint

    - name: Run tests
      run: cd backend && npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        JWT_SECRET: test-secret

  # Frontend Tests
  frontend-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm test

    - name: Build
      run: npm run build
```

#### **3.2 Workflow para Deploy a Vercel**

```yaml
# archivo: .github/workflows/deploy-frontend.yml
name: Deploy Frontend to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Vercel
      uses: vercel/action@master
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

#### **3.3 Workflow para Deploy a Railway**

```yaml
# archivo: .github/workflows/deploy-backend.yml
name: Deploy Backend to Railway

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Deploy to Railway
      uses: railway-app/deploy-action@main
      with:
        railway-token: ${{ secrets.RAILWAY_TOKEN }}
        service: backend
```

---

### **Paso 4: Configuración de Variables de Entorno**

#### **4.1 Frontend (.env.production)**

```env
# API
VITE_API_URL=https://api.puro-hockey.com/api
VITE_WS_URL=wss://api.puro-hockey.com

# Analytics (opcional)
VITE_GA_ID=UA-XXXXXXXXX-X

# Sentry (monitoreo)
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

#### **4.2 Backend (.env.production)**

```env
# Node
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@host:5432/hockey_db_prod
DB_POOL_SIZE=20

# JWT
JWT_SECRET=your-very-secure-secret-key-here-change-me
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=https://puro-hockey.com

# Server
PORT=5000
LOG_LEVEL=info

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@puro-hockey.com
SMTP_PASS=your-app-password

# Sentry (monitoreo)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=production
```

---

### **Paso 5: Deploy a Vercel (Frontend)**

#### **5.1 Crear cuenta y conectar repositorio**

```bash
# 1. Ir a https://vercel.com
# 2. Sign up con GitHub
# 3. Import project → hockey-app
# 4. Configure build settings:
#    - Framework: Vite
#    - Build command: npm run build
#    - Output directory: dist
```

#### **5.2 Agregar variables de entorno en Vercel**

```
Settings → Environment Variables
├─ VITE_API_URL=https://api.puro-hockey.com/api
├─ VITE_WS_URL=wss://api.puro-hockey.com
└─ VITE_SENTRY_DSN=...
```

#### **5.3 Configurar dominios**

```
Settings → Domains
├─ Agregar: puro-hockey.com
├─ Agregar: www.puro-hockey.com
└─ Configurar DNS en registrador
```

---

### **Paso 6: Deploy a Railway (Backend)**

#### **6.1 Crear cuenta y proyecto**

```bash
# 1. Ir a https://railway.app
# 2. Sign up con GitHub
# 3. New Project → GitHub Repo
# 4. Seleccionar hockey-app
```

#### **6.2 Configurar servicio PostgreSQL**

```
+ Add Service → PostgreSQL
├─ Railway crea automáticamente
├─ Obtener DATABASE_URL
└─ Guardar en variables de entorno
```

#### **6.3 Agregar variables de entorno**

```
Variables → Add Variable
├─ NODE_ENV=production
├─ DATABASE_URL=... (Railroad auto-populate)
├─ JWT_SECRET=your-secure-key
├─ CORS_ORIGIN=https://puro-hockey.com
├─ PORT=5000
└─ ... otras variables
```

#### **6.4 Configurar dominio**

```
Settings → Domains
├─ Agregar: api.puro-hockey.com
└─ Configurar DNS CNAME
```

---

### **Paso 7: Testing Automatizado**

#### **7.1 Backend Tests (Jest)**

```bash
# backend/package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### **7.2 Crear tests básicos**

```javascript
// backend/tests/pagos.test.js
const request = require('supertest');
const app = require('../app');

describe('Pagos API', () => {
  it('GET /api/pagos should return 200', async () => {
    const res = await request(app)
      .get('/api/pagos')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/pagos should create payment', async () => {
    const res = await request(app)
      .post('/api/pagos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        torneo_id: '...',
        plan_id: 'apertura',
        numero_referencia: 'TEST001',
        fecha_transferencia: '2025-06-05'
      });
    
    expect(res.statusCode).toBe(201);
  });
});
```

#### **7.3 Frontend Tests (Vitest)**

```bash
# package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

### **Paso 8: Monitoreo y Logging**

#### **8.1 Sentry para Error Tracking**

```bash
# Backend
npm install @sentry/node

# frontend
npm install @sentry/react
```

```javascript
// backend/sentry.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 1.0,
});

module.exports = Sentry;
```

```javascript
// src/main.tsx (Frontend)
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
});
```

#### **8.2 Logging Centralizado**

```bash
npm install winston
```

```javascript
// backend/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
```

---

### **Paso 9: Documentación de Deployment**

#### **9.1 README.md actualizado**

```markdown
# PURO HOCKEY - Gestión de Torneos

## 🚀 Deployment

### Requisitos
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (opcional)

### Variables de Entorno
Ver `.env.example` para configuración requerida.

### Instalación Local

\`\`\`bash
# Install dependencies
npm install
cd backend && npm install

# Run database migrations
npm run migrate

# Start development
docker-compose up
\`\`\`

### Deployment a Producción

#### Frontend (Vercel)
- Push a main branch
- Vercel despliega automáticamente
- Deploy time: ~2 minutos

#### Backend (Railway)
- Push a main branch
- Railway despliega automáticamente
- Deploy time: ~3 minutos

### Monitoreo
- Error tracking: https://sentry.io
- Uptime monitoring: https://uptimerobot.com
- Analytics: Google Analytics

### Support
Email: support@puro-hockey.com
```

---

## 📊 Arquitectura de Producción

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (Browser)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    VERCEL (Frontend)
                    puro-hockey.com
                   React + Vite (SPA)
                              ↓
                    API Gateway / CORS
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  RAILWAY (Backend)                           │
│              api.puro-hockey.com:5000                        │
│         Node.js + Express + Socket.io                        │
│                              ↓                               │
│           PostgreSQL 15 (Railway Database)                   │
│           Backups automáticos diarios                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   SERVICIOS EXTERNOS                         │
│  ├─ Sentry (Error Tracking)                                 │
│  ├─ Google Analytics                                        │
│  ├─ Gmail SMTP (Emails)                                     │
│  └─ SendGrid (Emails masivos)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Checklist de Seguridad Producción

- [ ] HTTPS habilitado (Vercel + Railway automático)
- [ ] CORS configurado correctamente
- [ ] JWT secret seguro (>32 caracteres)
- [ ] Database password seguro
- [ ] Variables sensibles en secrets/env
- [ ] Rate limiting en API
- [ ] SQL injection prevention (prepared statements)
- [ ] XSS protection (Content-Security-Policy)
- [ ] CSRF protection (tokens)
- [ ] Database backups automáticos
- [ ] Logs centralizados
- [ ] Monitoreo de errores (Sentry)
- [ ] Uptime monitoring

---

## 📈 Métricas de Performance

### Target
- Lighthouse Score: > 90
- API Response Time: < 200ms
- Database Query Time: < 100ms
- Page Load Time: < 3s
- Uptime: 99.9%

### Herramientas
- Google PageSpeed Insights
- New Relic (APM)
- Datadog (Monitoring)

---

## 🔄 Proceso de Release

```
1. Feature branch
   ↓
2. Pull Request
   ↓
3. Tests en CI/CD ✅
   ↓
4. Code Review ✅
   ↓
5. Merge a main
   ↓
6. Auto-deploy a Staging
   ↓
7. QA Testing
   ↓
8. Tag release (v1.0.1)
   ↓
9. Auto-deploy a Production
   ↓
10. Monitor Sentry + Analytics
```

---

## 🚨 Runbook de Emergencia

### Aplicación caída
```bash
# 1. Check status
curl https://api.puro-hockey.com/health

# 2. Check logs
railway logs -s backend

# 3. Rollback anterior version
git revert HEAD
git push main

# 4. Manual restart
railway restart -s backend
```

### Database down
```bash
# 1. Check connection
psql -h HOST -U USER -d hockey_db

# 2. Restore from backup
# Railway tiene backups automáticos
railway db restore --backup-id XXX
```

---

## 📅 Roadmap Deployment

- [ ] **Semana 1:** Dockerizar + GitHub Actions
- [ ] **Semana 2:** Deploy a Vercel (frontend)
- [ ] **Semana 3:** Deploy a Railway (backend)
- [ ] **Semana 4:** Testing + Monitoreo
- [ ] **Semana 5:** Optimización performance
- [ ] **Semana 6:** Documentación + Training
- [ ] **Semana 7:** Go live a producción
- [ ] **Semana 8:** Monitoreo post-launch

---

## 💡 Tips de Deployment

1. **Staging primero:** Siempre test en staging antes de prod
2. **Blue-green deployment:** Zero downtime deploys
3. **Database migrations:** Ejecutar ANTES del app deploy
4. **Secrets management:** Usar Vercel + Railway secrets
5. **Monitoring:** Configurar alertas para errores críticos
6. **Backups:** Backup BD cada 6 horas
7. **SSL/TLS:** Forzar HTTPS en todas partes
8. **Scaling:** Vercel y Railway escalan automáticamente

---

**FASE 9: Ready for Production Deployment**

La aplicación está lista para ser desplegada a producción con CI/CD, monitoreo, y todas las prácticas de seguridad y performance.

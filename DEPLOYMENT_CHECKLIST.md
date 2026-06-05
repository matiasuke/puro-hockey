# ✅ DEPLOYMENT CHECKLIST - PURO HOCKEY

## 📋 PRE-DEPLOYMENT

### Código
- [ ] Tests pasan localmente (`npm test`)
- [ ] Build funciona localmente (`npm run build`)
- [ ] No hay console.log() o debuggers en producción
- [ ] Linter pasa (`npm run lint`)
- [ ] Documentación actualizada
- [ ] README.md actualizado
- [ ] CHANGELOG.md actualizado

### Base de Datos
- [ ] Migraciones SQL creadas
- [ ] Migraciones testeadas localmente
- [ ] Backup estrategia definida
- [ ] Seeders para datos iniciales

### Seguridad
- [ ] JWT_SECRET generado (32+ caracteres)
- [ ] Database password seguro
- [ ] No hay secrets en .env.example
- [ ] .gitignore configurado correctamente
- [ ] No hay API keys en código

### GitHub
- [ ] Repositorio público/privado según corresponda
- [ ] Branches creadas (main, develop, staging)
- [ ] Branch protection en main activado
- [ ] README.md con instrucciones
- [ ] LICENSE agregada

---

## 🌐 VERCEL DEPLOYMENT (Frontend)

### Pre-Deploy
- [ ] Vercel account creada
- [ ] GitHub conectado a Vercel
- [ ] Proyecto importado en Vercel

### Configuration
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 18

### Environment Variables
- [ ] `VITE_API_URL` configurada (producción)
- [ ] `VITE_WS_URL` configurada (producción)
- [ ] `VITE_SENTRY_DSN` configurada (opcional)
- [ ] `VITE_GA_ID` configurada (opcional)

### Vercel Secrets (GitHub Actions)
- [ ] `VERCEL_TOKEN` agregado
- [ ] `VERCEL_ORG_ID` agregado
- [ ] `VERCEL_PROJECT_ID` agregado

### Dominio
- [ ] Dominio principal: puro-hockey.com
- [ ] Wildcard: *.puro-hockey.com
- [ ] DNS CNAME apunta a Vercel
- [ ] SSL/TLS automático activado

### Verificación
- [ ] `npm run build` funciona
- [ ] Deploy automático funciona
- [ ] URL pública accesible
- [ ] Lighthouse score > 85

---

## 🚂 RAILWAY DEPLOYMENT (Backend)

### Pre-Deploy
- [ ] Railway account creada
- [ ] GitHub conectado a Railway

### Database Setup
- [ ] PostgreSQL servicio creado
- [ ] DATABASE_URL copiada
- [ ] Migraciones ejecutadas
- [ ] Datos iniciales cargados

### Backend Configuration
- [ ] Build command: `npm ci --prefix backend`
- [ ] Start command: `npm start --prefix backend`
- [ ] Port: 5000
- [ ] Node version: 18

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `LOG_LEVEL=info`
- [ ] `DATABASE_URL=...` (from PostgreSQL)
- [ ] `JWT_SECRET=...` (32+ caracteres)
- [ ] `CORS_ORIGIN=https://puro-hockey.com`
- [ ] `SENTRY_DSN=...` (opcional)

### Railway Secrets (GitHub Actions)
- [ ] `RAILWAY_TOKEN` agregado a GitHub

### Dominio
- [ ] API domain: api.puro-hockey.com
- [ ] DNS CNAME configurado
- [ ] Health endpoint: /health

### Verificación
- [ ] `curl https://api.puro-hockey.com/health` → 200
- [ ] Deploy automático funciona
- [ ] Database conectada
- [ ] Logs accesibles

---

## 🔄 CI/CD WORKFLOWS (GitHub Actions)

### Files Created
- [ ] `.github/workflows/test.yml`
- [ ] `.github/workflows/deploy-frontend.yml`
- [ ] `.github/workflows/deploy-backend.yml`

### Test Workflow
- [ ] Runs on: push to main/develop, PR
- [ ] Frontend build completes
- [ ] Backend tests pass
- [ ] Docker images build

### Frontend Workflow
- [ ] Runs on: push to main
- [ ] Vercel deployment succeeds
- [ ] URL comentada en PR (si aplica)

### Backend Workflow
- [ ] Runs on: push to main
- [ ] Railway deployment succeeds
- [ ] Migraciones ejecutadas
- [ ] Health check pasa

---

## 🔐 SEGURIDAD POST-DEPLOYMENT

### HTTPS/TLS
- [ ] HTTPS forzado en frontend
- [ ] HTTPS automático en backend
- [ ] Certificados válidos
- [ ] SSL Labs A+ grade

### Headers de Seguridad
- [ ] Content-Security-Policy
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY
- [ ] X-XSS-Protection: 1; mode=block
- [ ] Strict-Transport-Security

### API Security
- [ ] CORS configurado (origen correcto)
- [ ] Rate limiting activo
- [ ] JWT validation funciona
- [ ] SQL injection prevention
- [ ] XSS protection

### Database Security
- [ ] Password fuerte
- [ ] Conexión encriptada
- [ ] Backups automáticos
- [ ] No connection strings en logs
- [ ] Firewall configurado

---

## 📊 MONITOREO Y LOGGING

### Sentry Setup
- [ ] Cuenta Sentry creada
- [ ] Proyecto frontend creado
- [ ] Proyecto backend creado
- [ ] DSN en variables de entorno
- [ ] Source maps cargados
- [ ] Alertas configuradas

### Logging
- [ ] Winston logger en backend
- [ ] Logs centralizados
- [ ] Log levels configurados
- [ ] Error logs en alertas

### Uptime Monitoring
- [ ] UptimeRobot configurado (opcional)
- [ ] Health checks configurados
- [ ] Alertas vía email/Slack

### Analytics (opcional)
- [ ] Google Analytics configurado
- [ ] Tracking ID en variables
- [ ] Events siendo capturados
- [ ] Dashboard creado

---

## 🚀 FIRST DEPLOYMENT

### Day Before
- [ ] Equipo notificado
- [ ] Runbook de emergencia revisado
- [ ] Backup confirmado
- [ ] Rollback plan definido

### Deployment Day
- [ ] Todos los checks verdes
- [ ] Monitoreo activo
- [ ] Team en standby
- [ ] Comunicación lista

### Post-Deployment (Primeras 24h)
- [ ] Monitoring activo 24/7
- [ ] Smoke tests ejecutados
- [ ] User feedback recopilado
- [ ] Logs revisados por errores

---

## 👥 TESTING EN PRODUCCIÓN

### Funcional
- [ ] Homepage carga
- [ ] Login funciona
- [ ] Roles funcionan (admin, club, arbitro)
- [ ] CRUD operaciones
- [ ] Pagos flujo completo
- [ ] Búsqueda/filtrado
- [ ] Notificaciones toast
- [ ] Validaciones

### Performance
- [ ] Page load < 3s
- [ ] API response < 200ms
- [ ] Database queries < 100ms
- [ ] Lighthouse score > 85
- [ ] Mobile responsive

### Security
- [ ] HTTPS funciona
- [ ] Headers correctos
- [ ] JWT válido
- [ ] CORS restrictivo
- [ ] No se exponen datos sensibles

### API
- [ ] Todos endpoints responden
- [ ] Error handling correcto
- [ ] Status codes correctos
- [ ] JSON válido
- [ ] Rate limiting activo

---

## 🔄 ROLLBACK PLAN

### Si hay problema crítico

```bash
# Frontend (Vercel)
1. Vercel Dashboard → Deployments
2. Click en deployment anterior ✓
3. Click "Redeploy"

# Backend (Railway)
1. Railway Dashboard → Deployments
2. Click en deployment anterior ✓
3. Click "Revert"

# Base de Datos
1. Railway → PostgreSQL → Backups
2. Seleccionar backup anterior
3. Restore to a point in time
```

---

## 📞 POST-LAUNCH (Semanas 1-4)

### Semana 1
- [ ] Monitoreo intensivo (24/7)
- [ ] Reporte de bugs diarios
- [ ] Performance baseline establecida
- [ ] Usuarios reportan feedback

### Semana 2
- [ ] Patches de bugs aplicados
- [ ] Performance optimizaciones
- [ ] UX improvements basados en feedback
- [ ] Documentation updates

### Semana 3
- [ ] Monitoring reduce a 8h/día
- [ ] Feature improvements
- [ ] Analytics revisadas
- [ ] Roadmap update

### Semana 4
- [ ] Transition a soporte normal
- [ ] Playbook de operaciones creado
- [ ] SLA documentado
- [ ] Escalation policy definida

---

## ✨ FINAL VERIFICATION

### Overall
- [ ] ✅ Frontend deployado
- [ ] ✅ Backend deployado
- [ ] ✅ Database conectada
- [ ] ✅ CI/CD funcionando
- [ ] ✅ Monitoreo activo
- [ ] ✅ Backups configurados
- [ ] ✅ Documentación completa

### URLs Accesibles
- [ ] ✅ https://puro-hockey.com (frontend)
- [ ] ✅ https://api.puro-hockey.com (backend)
- [ ] ✅ https://api.puro-hockey.com/health (health)
- [ ] ✅ Admin dashboard funciona

### Team Ready
- [ ] ✅ Support team entrenado
- [ ] ✅ Runbook distribuido
- [ ] ✅ Contacts actualizados
- [ ] ✅ Escalation chain definida

---

## 🎉 DEPLOYMENT COMPLETADO!

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           ✅ PURO HOCKEY EN PRODUCCIÓN ✅               ║
║                                                            ║
║  Frontend: https://puro-hockey.com                       ║
║  Backend:  https://api.puro-hockey.com                   ║
║  Status:   Healthy & Monitored                           ║
║                                                            ║
║  Fecha: 2025-06-05                                       ║
║  Responsable: [Tu nombre]                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

**Próximas revisiones:**
- [ ] Weekly performance review
- [ ] Monthly security audit
- [ ] Quarterly scalability assessment

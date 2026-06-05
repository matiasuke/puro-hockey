# 🚀 GUÍA COMPLETA: DEPLOYMENT VERCEL + RAILWAY

## PURO HOCKEY v1.0.0

---

## ⭐ FORMA MÁS FÁCIL (Recomendado)

### Ejecuta el script automatizado:

**Opción 1: Haz doble click**
```
C:\Users\Alumno\Documents\App\hockey-app\DEPLOY-VERCEL-RAILWAY.bat
```

**Opción 2: PowerShell**
```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
.\deploy-vercel-railway.ps1
```

---

## 📋 GUÍA MANUAL PASO A PASO

### FASE 1: VERCEL (FRONTEND)

#### Paso 1: Instalar Vercel CLI (Opcional)
```powershell
npm install -g vercel
```

#### Paso 2: Opción A - Deploy con CLI (Rápido)
```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
vercel --prod
```

Sigue las instrucciones:
1. Autoriza con GitHub
2. Selecciona proyecto
3. Confirma configuración
4. Deploy inicia automáticamente

#### Paso 2: Opción B - Deploy con Dashboard (Visual)

1. **Ve a:** https://vercel.com/new
2. **Haz login** con GitHub
3. **Click:** "Import Git Repository"
4. **Busca:** `matiasuke/puro-hockey`
5. **Selecciona el repositorio**
6. **Configura:**
   - Framework: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     ```
     VITE_API_URL = https://tu-backend.railway.app
     VITE_WS_URL = wss://tu-backend.railway.app
     ```
7. **Click:** "Deploy"
8. **Espera:** 2-3 minutos
9. **Resultado:**
   ```
   https://puro-hockey.vercel.app
   ```

---

### FASE 2: RAILWAY (BACKEND)

#### Paso 1: Ve a Railway
```
https://railway.app
```

#### Paso 2: Crea Cuenta
1. Click "Start a New Project"
2. "Deploy from GitHub repo"
3. Autoriza acceso a GitHub

#### Paso 3: Importa Repositorio
1. Busca: `matiasuke/puro-hockey`
2. Click "Deploy Now"

#### Paso 4: Crea Servicios

**Servicio 1: PostgreSQL**
1. Click "Add Service"
2. Selecciona "PostgreSQL"
3. Nombre: `postgres`
4. Click "Deploy"
5. Espera 1-2 minutos

**Servicio 2: Node.js Backend**
1. Click "Add Service"
2. Selecciona "GitHub Repo"
3. Selecciona `matiasuke/puro-hockey`
4. Nombre: `puro-hockey-backend`
5. Click "Deploy"

#### Paso 5: Configura Variables de Entorno

En Railway, para el servicio Node.js:

1. Click en el servicio "puro-hockey-backend"
2. Click "Variables"
3. Agrega estas variables:

```
NODE_ENV = production
PORT = 5000
LOG_LEVEL = info

DATABASE_URL = ${{Postgres.DATABASE_URL}}

JWT_SECRET = your-super-secret-key-32-chars-minimum

CORS_ORIGIN = https://puro-hockey.vercel.app

SENTRY_DSN = (opcional)
```

**Nota:** Railway crea automáticamente `DATABASE_URL` desde PostgreSQL

4. Click "Deploy"

#### Paso 6: Obtener URL del Backend

En Railway:
1. Click en el servicio Node.js
2. Busca "Public URL"
3. Copia la URL:
   ```
   https://puro-hockey-xxxx.railway.app
   ```

---

### FASE 3: CONECTAR FRONTEND Y BACKEND

#### En Vercel:

1. Ve a tu proyecto en Vercel
2. Click "Settings"
3. Click "Environment Variables"
4. Actualiza:
   ```
   VITE_API_URL = https://puro-hockey-xxxx.railway.app
   VITE_WS_URL = wss://puro-hockey-xxxx.railway.app
   ```
5. Reemplaza `xxxx` con tu URL de Railway

6. Click "Redeploy"

#### Verificar Conexión:

1. Abre: https://puro-hockey.vercel.app
2. Intenta hacer login
3. Debería conectar al backend

---

## 🔐 VARIABLES DE ENTORNO NECESARIAS

### Frontend (Vercel)
```
VITE_API_URL=https://tu-backend.railway.app
VITE_WS_URL=wss://tu-backend.railway.app
```

### Backend (Railway)
```
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=tu-secret-muy-seguro-minimo-32-caracteres
CORS_ORIGIN=https://puro-hockey.vercel.app
SENTRY_DSN=(opcional)
```

---

## ✅ VERIFICACIÓN

### Frontend
```
https://puro-hockey.vercel.app
↓
Debería cargar la aplicación
```

### Backend Health Check
```
https://tu-backend.railway.app/health
↓
Debería retornar JSON: {"status":"ok"}
```

### Login
```
Intenta hacer login en el frontend:
Email: admin@example.com
Contraseña: password
↓
Debería funcionar si backend está conectado
```

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot connect to backend"

**Solución:**
1. Verifica que Railway está corriendo
2. Verifica que la URL de Railway es correcta
3. Actualiza VITE_API_URL en Vercel
4. Redeploy en Vercel

### Error: "Database connection failed"

**Solución:**
1. Verifica DATABASE_URL en Railway
2. Ejecuta migraciones:
   ```
   railway run npm run migrate
   ```
3. Carga datos de prueba:
   ```
   railway run npm run seed
   ```

### Frontend se ve roto (sin estilos)

**Solución:**
1. Verifica que Vite build es correcto
2. En Vercel > Settings > Build & Development
3. Build Command: `npm run build`
4. Output Directory: `dist`

### CORS Errors

**Solución:**
1. Verifica CORS_ORIGIN en Railway
2. Debe ser: `https://puro-hockey.vercel.app`
3. Redeploy en Railway

---

## 📊 COSTOS ESPERADOS

### Primer Mes (Con créditos gratuitos)
```
Vercel:  $0  (siempre gratis)
Railway: $5  (créditos iniciales gratis)
Total:   $0
```

### Después (Uso pequeño)
```
Vercel:   $0   (siempre gratis)
Railway: $10   (backend pequeño)
Total:   $10/mes
```

---

## 🚀 DESPUÉS DEL DEPLOYMENT

### 1. Configura Custom Domains (Opcional)
```
Vercel:
  - Settings > Domains
  - Agrega tu dominio personalizado
  - Sigue instrucciones DNS

Railway:
  - Settings > Domains
  - Agrega tu dominio personalizado
```

### 2. Configura Sentry (Monitoreo de Errores)
```
1. Ve a https://sentry.io
2. Crea proyecto
3. Copia SENTRY_DSN
4. Agrega en Railway
5. Los errores se verán en Sentry
```

### 3. Configura GitHub Secrets (CI/CD)
```
En GitHub > Settings > Secrets:

VERCEL_TOKEN = (obtener de Vercel)
VERCEL_PROJECT_ID = (obtener de Vercel)
RAILWAY_TOKEN = (obtener de Railway)
```

### 4. Activar Auto-Deploy
```
Vercel:
  - Auto-deploys en cada push a main
  - Ya está habilitado

Railway:
  - Auto-deploys en cada push a main
  - Ya está habilitado
```

---

## 📞 URLS ÚTILES

| Servicio | URL | Acción |
|----------|-----|--------|
| Vercel | https://vercel.com | Dashboard |
| Railway | https://railway.app | Dashboard |
| GitHub | https://github.com/matiasuke/puro-hockey | Repositorio |
| Sentry | https://sentry.io | Monitoreo |

---

## 🎯 RESUMEN RÁPIDO

**5 minutos:**
1. Deploy en Vercel: `vercel --prod`
2. Obtener URL de Railway (después de crear servicios)
3. Actualizar VITE_API_URL en Vercel
4. Redeploy en Vercel
5. ✅ Listo

**Más seguro:**
1. Usar dashboard de Vercel y Railway
2. Configurar manualmente cada variable
3. Verificar cada servicio
4. Hacer pruebas antes de producción

---

## 💡 TIPS

- ✅ Mantén `JWT_SECRET` muy seguro
- ✅ No expongas credenciales en GitHub
- ✅ Usa Railway para ambiente de prueba
- ✅ Vercel redeploy es instantáneo
- ✅ Railway redeploy toma 2-5 minutos
- ✅ Monitoring es importante

---

**¡Listo para deployment!** 🚀

Próximo paso: Ejecuta el script o sigue esta guía.

# 🚀 DEPLOYMENT MANUAL PASO A PASO
## PURO HOCKEY v1.0.0

**Código en GitHub:** ✅ https://github.com/matiasuke/puro-hockey

---

## PARTE 1: VERCEL (5 minutos)

### Paso 1: Abre Vercel
```
https://vercel.com/new
```

### Paso 2: Importa Repositorio
1. Haz login con GitHub (si no estás logueado)
2. Click: **"Import Git Repository"**
3. Busca: `matiasuke/puro-hockey`
4. Click: **Select**

### Paso 3: Configura Proyecto
Espera a que cargue la página de configuración. Deberías ver:

```
Framework: Vite (seleccionar si no está)
Build Command: npm run build
Output Directory: dist
```

### Paso 4: Agrega Variables de Entorno
En la sección "Environment Variables", agrega:

```
VITE_API_URL = https://placeholder.railway.app
VITE_WS_URL = wss://placeholder.railway.app
```

*(Las cambiaremos después con la URL real de Railway)*

### Paso 5: Deploy
Click: **"Deploy"**

⏳ **Espera 2-3 minutos** hasta que termine

### Paso 6: Obtén URL de Vercel
Cuando termine, verás una URL como:
```
https://puro-hockey-xxxxx.vercel.app
```

**Copia esta URL y guárdala**

✅ **Frontend listo**

---

## PARTE 2: RAILWAY (10 minutos)

### Paso 1: Abre Railway
```
https://railway.app
```

### Paso 2: Login
1. Login con GitHub
2. Click: **"Start a New Project"**
3. Click: **"Deploy from GitHub repo"**

### Paso 3: Selecciona Repositorio
1. Busca: `matiasuke/puro-hockey`
2. Click: **Select**

### Paso 4: Crea Servicio PostgreSQL
1. Click: **"Add Service"**
2. Click: **"Database"**
3. Click: **"PostgreSQL"**
4. **ESPERA 1-2 minutos** (se crea automáticamente)

### Paso 5: Crea Servicio Node.js
1. Click: **"Add Service"**
2. Click: **"GitHub Repo"**
3. Selecciona: `matiasuke/puro-hockey`
4. En "Service Name": `puro-hockey-backend`
5. Click: **"Deploy"**

### Paso 6: Configura Variables de Entorno
1. Click en el servicio **"puro-hockey-backend"**
2. Click en la pestaña: **"Variables"**
3. Agrega estas variables EXACTAMENTE:

```
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=miClaveSeguraDeMinimo32CaracteresParaJWT
CORS_ORIGIN=https://puro-hockey-xxxxx.vercel.app
```

**IMPORTANTE:**
- Reemplaza `xxxxx` con tu URL de Vercel
- JWT_SECRET debe ser UNICO y MUY largo (mínimo 32 caracteres)

4. Click: **"Save"**

⏳ **Espera 5-10 minutos** para el build y deploy

### Paso 7: Obtén URL Pública de Railway
1. Click en el servicio **"puro-hockey-backend"**
2. Busca: **"Public URL"** (lado derecho)
3. Copia la URL:
```
https://puro-hockey-xxxx.railway.app
```

**Copia esta URL y guárdala**

✅ **Backend listo**

---

## PARTE 3: CONECTAR VERCEL + RAILWAY (2 minutos)

### Paso 1: Vuelve a Vercel
```
https://vercel.com/dashboard
```

### Paso 2: Abre tu Proyecto
1. Click en: **"puro-hockey"**
2. Click en: **"Settings"**
3. Click en: **"Environment Variables"**

### Paso 3: Actualiza Variables
Edita las variables que creaste antes:

```
VITE_API_URL = https://puro-hockey-xxxx.railway.app
VITE_WS_URL = wss://puro-hockey-xxxx.railway.app
```

**Reemplaza `xxxx` con tu URL de Railway**

### Paso 4: Guarda
1. Click: **"Save"**
2. Vercel redeployará automáticamente
3. **Espera 2-3 minutos**

✅ **Conectado**

---

## VERIFICACIÓN FINAL

### ✅ Frontend
Abre en navegador:
```
https://puro-hockey-xxxxx.vercel.app
```
Deberías ver la aplicación cargada completamente

### ✅ Backend Health Check
Abre en navegador:
```
https://puro-hockey-xxxx.railway.app/health
```
Deberías ver:
```json
{"status":"ok"}
```

### ✅ Login
1. Ve a tu frontend: `https://puro-hockey-xxxxx.vercel.app`
2. Intenta hacer login:
   - Email: `admin@example.com`
   - Password: `password`
3. Si funciona, ¡está todo conectado! ✅

---

## 🗄️ MIGRACIONES EN RAILWAY (OPCIONAL)

Para crear tablas en la base de datos:

1. Ve a tu proyecto en Railway
2. Click en servicio **"puro-hockey-backend"**
3. Click en pestaña: **"Connect"**
4. En la terminal, ejecuta:
   ```bash
   npm run migrate
   ```

Para cargar datos de prueba:
```bash
npm run seed
```

---

## 📊 RESUMEN FINAL

### URLs en Vivo
```
Frontend:  https://puro-hockey-xxxxx.vercel.app
Backend:   https://puro-hockey-xxxx.railway.app
GitHub:    https://github.com/matiasuke/puro-hockey

Estado: ✅ EN PRODUCCION
```

### Credenciales de Prueba
```
Email:    admin@example.com
Password: password
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Cannot connect to backend"
- Verifica que VITE_API_URL en Vercel es correcto
- Verifica que el servicio en Railway está corriendo (verde)
- Redeploy en Vercel después de cambios

### Error: "Database connection failed"
- Verifica DATABASE_URL en Railway
- Ejecuta: `npm run migrate` en Railway

### Frontend se ve roto (sin estilos)
- Espera a que termine el build en Vercel
- Hard refresh: **Ctrl+Shift+R**

### Código 500 del backend
- Verifica JWT_SECRET en Railway
- Verifica CORS_ORIGIN es la URL de Vercel

---

## 🎉 ¡LISTO!

Tu aplicación **PURO HOCKEY** está en **PRODUCCIÓN**.

**Próximos pasos opcionales:**
1. Configura custom domains
2. Agrega Sentry para monitoreo
3. Configura GitHub Actions para CI/CD
4. Agrega analytics

---

**Tiempo total: ~15 minutos**

¿Necesitas ayuda con algún paso?

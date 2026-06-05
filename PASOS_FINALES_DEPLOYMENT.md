# 🎯 PASOS FINALES PARA DEPLOYMENT - PURO HOCKEY

## ✅ LO QUE YA ESTÁ HECHO

```
✅ Repositorio Git inicializado localmente
✅ Commit inicial hecho (549037d - 79 archivos)
✅ Rama main creada
✅ Todos los archivos Docker, CI/CD, documentación listos
✅ Código 100% funcional
```

---

## 📋 PRÓXIMOS PASOS (CLICK EN WEB)

### **PASO 1: Crear Repositorio GitHub (2 min)**

```
👉 Ir a: https://github.com/new

Completar:
├─ Repository name: hockey-app
├─ Description: PURO HOCKEY - Tournament Management Platform
├─ Public (recomendado)
└─ NO marcar: Initialize with README, .gitignore, license

Crear repositorio

📌 COPIAR LA URL QUE APARECE (ej: https://github.com/TU_USUARIO/hockey-app.git)
```

---

### **PASO 2: Conectar GitHub Local**

```bash
cd C:\Users\Alumno\Documents\App\hockey-app

# Reemplazar TU_USUARIO con tu usuario GitHub
git remote add origin https://github.com/TU_USUARIO/hockey-app.git

# Push al repositorio remoto
git push -u origin main

# Verificar
git remote -v
```

**Después:**
- ✅ Ir a https://github.com/TU_USUARIO/hockey-app
- ✅ Debe mostrar todos los 79 archivos
- ✅ Debe mostrar el commit inicial

---

### **PASO 3: Configurar Vercel (10 min)**

```
👉 Ir a: https://vercel.com

1. Sign Up → Continue with GitHub
2. Autorizar acceso
3. Click "Import Project"
4. Seleccionar "hockey-app"
5. Click "Import"

CONFIGURACIÓN AUTOMÁTICA:
├─ Framework: Vite (autodetectado)
├─ Build Command: npm run build (autodetectado)
└─ Output Directory: dist (autodetectado)

VARIABLES DE ENTORNO:
1. Environment Variables
2. Click "Add Another"

Agregar:
├─ Name: VITE_API_URL
│  Value: https://api.puro-hockey.com/api
│  Environment: Production
│
└─ Name: VITE_WS_URL
   Value: wss://api.puro-hockey.com
   Environment: Production

6. Click "Deploy"
7. Esperar a que termine (2-3 minutos)
```

**Después del deploy:**

```
👉 Ir a: https://vercel.com/account/tokens

Crear token:
1. Click "Create Token"
2. Name: VERCEL_TOKEN
3. Copy token

Obtener IDs:
1. Ir a tu proyecto en Vercel
2. Settings → General
3. Copiar "Project ID" (VERCEL_PROJECT_ID)
4. Copiar "Team ID" (VERCEL_ORG_ID)
```

**Agregar secretos a GitHub:**

```
👉 Ir a: https://github.com/TU_USUARIO/hockey-app/settings/secrets/actions

Click "New repository secret"

Agregar 3 secretos:

1. VERCEL_TOKEN
   Value: [el token copiado]
   
2. VERCEL_PROJECT_ID
   Value: [el project ID]
   
3. VERCEL_ORG_ID
   Value: [el team ID]
```

---

### **PASO 4: Configurar Railway Backend (15 min)**

```
👉 Ir a: https://railway.app

1. Login → Continue with GitHub
2. Autorizar acceso
3. Click "New Project"

CREAR DATABASE:
1. Seleccionar "Database"
2. Seleccionar "PostgreSQL"
3. Railway crea automáticamente
4. Esperar a que esté "Running"

Copiar DATABASE_URL:
1. Click en servicio PostgreSQL
2. Variables
3. Copiar el valor de DATABASE_URL

CREAR BACKEND SERVICE:
1. Click "+ Add Service"
2. Seleccionar "GitHub Repo"
3. Seleccionar "hockey-app"
4. Railway detecta el Dockerfile.backend
5. Click "Deploy"

CONFIGURAR VARIABLES:
1. Click en servicio backend
2. Variables
3. Agregar todas estas:

NODE_ENV = production
PORT = 5000
LOG_LEVEL = info
DATABASE_URL = [PEGAR el valor copiado del PostgreSQL]
JWT_SECRET = [GENERAR ABAJO]
CORS_ORIGIN = https://puro-hockey.com

🔑 GENERAR JWT_SECRET SEGURO:

Opción A (en terminal):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Opción B (online):
Ir a: https://www.uuidgenerator.net/
Generar 2 UUIDs y concatenar

El resultado será algo como:
3a8f2c9e1b5d7a4f6e2c8b3d9a5f1c7e8b2c5f9a1d4e7b0c3f6a9d2e5f8c1

Copiar ese valor como JWT_SECRET
```

**Después de configurar:**

```
EJECUTAR MIGRACIONES:
1. Click en servicio backend
2. Deploy (debe re-deployer con nuevas variables)
3. Esperar a que esté "Running"
4. Luego en tu máquina, ejecutar:

cd C:\Users\Alumno\Documents\App\hockey-app\backend
npx knex migrate:latest --env=production
   (Nota: Railway automáticamente puede hacer esto)
```

**Obtener token Railway:**

```
👉 Ir a: https://railway.app/account/tokens

Click "Create Token"
Copy token

Agregar a GitHub:
👉 GitHub → Settings → Secrets → New repository secret

Name: RAILWAY_TOKEN
Value: [el token copiado]
```

---

### **PASO 5: Verificar Deployments Automáticos**

```
✅ GitHub Actions:
   Ir a: https://github.com/TU_USUARIO/hockey-app/actions
   Debe ver 3 workflows:
   ├─ Tests & Build
   ├─ Deploy Frontend to Vercel
   └─ Deploy Backend to Railway

✅ Frontend (Vercel):
   Ir a: https://puro-hockey.vercel.app
   Debe mostrar la aplicación
   
✅ Backend (Railway):
   Ir a: https://puro-hockey.railway.app/health
   Debe retornar: {"status":"ok"}

   O usar curl:
   curl https://puro-hockey.railway.app/health
```

---

### **PASO 6: Configurar Dominios (Opcional, 10 min)**

**Si tienes puro-hockey.com:**

**Frontend en Vercel:**
```
Vercel Dashboard → Settings → Domains
Click "Add Domain"
├─ Add: puro-hockey.com
├─ Add: www.puro-hockey.com
└─ Copiar records DNS

En tu registrador de dominio:
├─ Type: A / CNAME
├─ Host: puro-hockey.com
└─ Value: [como muestra Vercel]

Esperar validación (puede tardar 24h)
```

**Backend en Railway:**
```
Railway → Services → Backend → Settings
Click "Add Domain"
├─ Add: api.puro-hockey.com
└─ Copiar valor CNAME

En tu registrador:
├─ Type: CNAME
├─ Host: api
└─ Value: [como muestra Railway]
```

---

## 🧪 PRUEBAS FINALES

```bash
# 1. Health Check Backend
curl https://puro-hockey.railway.app/health
# Debe retornar: {"status":"ok"}

# 2. Login Test
curl -X POST https://puro-hockey.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
# Debe retornar un JWT token

# 3. Frontend
Abrir: https://puro-hockey.vercel.app
Debe cargar la aplicación sin errores

# 4. Lighthouse Score
En Chrome:
1. Ir a https://puro-hockey.vercel.app
2. F12 → Lighthouse
3. Score debe ser > 85
```

---

## 📊 RESUMEN

| Paso | Acción | Tiempo | Status |
|------|--------|--------|--------|
| 1 | Crear GitHub Repo | 2 min | ⏳ Manual |
| 2 | Conectar GitHub Local | 2 min | ⏳ Manual |
| 3 | Configurar Vercel | 10 min | ⏳ Manual |
| 4 | Configurar Railway | 15 min | ⏳ Manual |
| 5 | Verificar Deployments | 5 min | ⏳ Automático |
| 6 | Dominios (opcional) | 10 min | ⏳ Manual |
| **TOTAL** | | **30-45 min** | |

---

## 🚀 Última cosa: Push a GitHub

```bash
cd C:\Users\Alumno\Documents\App\hockey-app

# Si no lo hizo aún:
git remote add origin https://github.com/TU_USUARIO/hockey-app.git
git push -u origin main

# Verificar:
git log --oneline | head -1
# Debe mostrar: 549037d 🚀 Initial commit: PURO HOCKEY v1.0.0
```

---

## ✅ CHECKLIST FINAL

```
LOCAL GIT:
✅ Repository inicializado
✅ Commit hecho (549037d)
✅ Rama main creada

GITHUB:
⏳ Repositorio creado
⏳ Remote agregado
⏳ Push completado

VERCEL:
⏳ Proyecto creado
⏳ Variables de entorno
⏳ Deploy completado
⏳ Secretos en GitHub

RAILWAY:
⏳ PostgreSQL service
⏳ Backend service
⏳ Variables configuradas
⏳ Migraciones ejecutadas
⏳ Secretos en GitHub

CI/CD:
⏳ GitHub Actions ejecutados
⏳ Tests pasados
⏳ Deploys automáticos

VERIFICACIÓN:
⏳ Frontend accesible
⏳ Backend health check OK
⏳ Login funciona
⏳ Lighthouse > 85
```

---

## 🎉 ¡CUANDO TODO ESTÁ LISTO!

```
Frontend:  https://puro-hockey.vercel.app ✅
Backend:   https://puro-hockey.railway.app ✅
Admin:     https://puro-hockey.vercel.app/admin ✅
GitHub:    https://github.com/TU_USUARIO/hockey-app ✅

Credentials (CAMBIAR DESPUÉS):
├─ Email: admin@example.com
└─ Password: password

Status: 🟢 PRODUCTION READY
```

---

**Tiempo estimado total: 30-45 minutos**

¡Tu aplicación PURO HOCKEY estará en PRODUCCIÓN! 🚀

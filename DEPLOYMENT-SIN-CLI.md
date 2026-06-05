# 🚀 DEPLOYMENT SIN CLI - VERCEL + RAILWAY

## PURO HOCKEY v1.0.0

---

## ⚠️ POR QUÉ SIN CLI

El deployment via CLI requiere autenticación compleja que puede fallar. **Esta es la forma más confiable y rápida.**

---

## 📋 PRE-REQUISITOS

- [ ] Código pusheado a GitHub: https://github.com/matiasuke/puro-hockey
- [ ] Cuenta en GitHub creada
- [ ] Cuenta en Vercel creada (login con GitHub)
- [ ] Cuenta en Railway creada (login con GitHub)

---

## 🎯 PROCESO COMPLETO (15 minutos)

### FASE 1: VERCEL (Frontend) - 5 minutos

**Paso 1: Abre Vercel**
```
https://vercel.com/new
```

**Paso 2: Importa Repositorio**
- Haz login con GitHub
- Click: "Import Git Repository"
- Busca: `matiasuke/puro-hockey`
- Click: Select

**Paso 3: Configura Proyecto**
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

**Paso 4: Agrega Variables (IMPORTANTE)**
```
VITE_API_URL = https://tu-railway-url.railway.app
VITE_WS_URL = wss://tu-railway-url.railway.app
```

*Nota: La URL de Railway la completarás después, por ahora puedes dejar valores temporales*

**Paso 5: Deploy**
- Click: "Deploy"
- Espera 2-3 minutos
- Copia tu URL: `https://puro-hockey-xxxxx.vercel.app`

✅ **Frontend listo**

---

### FASE 2: RAILWAY (Backend) - 10 minutos

**Paso 1: Abre Railway**
```
https://railway.app
```

**Paso 2: Nuevo Proyecto**
- Click: "Start a New Project"
- Click: "Deploy from GitHub repo"
- Login con GitHub
- Selecciona: `matiasuke/puro-hockey`

**Paso 3: Crea Servicio PostgreSQL**
- Click: "Add Service"
- Click: "Database"
- Selecciona: "PostgreSQL"
- Espera 1-2 minutos (se creará automáticamente)

**Paso 4: Crea Servicio Node.js**
- Click: "Add Service"
- Click: "GitHub Repo"
- Selecciona: `matiasuke/puro-hockey`
- Nombre: `puro-hockey-backend`
- Click: "Deploy"

**Paso 5: Configura Variables en Node.js**

Click en el servicio Node.js → "Variables"

Agrega estas variables:

```
NODE_ENV = production
PORT = 5000
LOG_LEVEL = info
DATABASE_URL = ${{Postgres.DATABASE_URL}}
JWT_SECRET = tu-secret-muy-seguro-minimo-32-caracteres
CORS_ORIGIN = https://puro-hockey-xxxxx.vercel.app
```

**Importante:** 
- Reemplaza `xxxxx` con tu URL de Vercel
- JWT_SECRET debe ser ÚNICO y muy seguro (32+ caracteres)

**Paso 6: Obtén URL Pública**
- Click en servicio Node.js
- Busca: "Public URL"
- Copia la URL: `https://puro-hockey-xxxx.railway.app`

✅ **Backend listo**

---

### FASE 3: CONECTAR FRONTEND + BACKEND - 2 minutos

**Vuelve a Vercel:**

1. Dashboard → Proyecto `puro-hockey`
2. Click: "Settings"
3. Click: "Environment Variables"
4. Edita:
   ```
   VITE_API_URL = https://puro-hockey-xxxx.railway.app
   VITE_WS_URL = wss://puro-hockey-xxxx.railway.app
   ```
5. Click: "Save"
6. Vercel se redeployará automáticamente

✅ **Conectado**

---

## 🧪 VERIFICACIÓN

### ✅ Frontend
```
https://puro-hockey-xxxxx.vercel.app
↓
Debería cargar la aplicación completa
```

### ✅ Backend Health Check
```
https://puro-hockey-xxxx.railway.app/health
↓
Debería retornar: {"status":"ok"}
```

### ✅ Login
```
Frontend: https://puro-hockey-xxxxx.vercel.app
Email: admin@example.com
Password: password
↓
Debería funcionar si backend está conectado
```

---

## 🗄️ MIGRACIONES EN RAILWAY (Opcional)

En Railway Dashboard:

1. Click en servicio Node.js
2. Click "Connect"
3. Terminal / Variables

Ejecuta:
```bash
# Crear tablas
npm run migrate

# Cargar datos de prueba
npm run seed
```

---

## 🎉 RESUMEN FINAL

```
Frontend:  https://puro-hockey-xxxxx.vercel.app
Backend:   https://puro-hockey-xxxx.railway.app
GitHub:    https://github.com/matiasuke/puro-hockey

Status: ✅ EN PRODUCCION
```

---

## ❌ TROUBLESHOOTING

### Error: "Cannot connect to backend"
- Verifica VITE_API_URL en Vercel
- Redeploy en Vercel después de cambios
- Verifica que Railway está corriendo

### Error: "Database connection failed"
- Ejecuta migraciones: `npm run migrate`
- Verifica DATABASE_URL en Railway

### Error: "Frontend se ve roto (sin estilos)"
- Espera a que termine el build en Vercel
- Hard refresh del navegador (Ctrl+Shift+R)

---

**¡Listo para producción!** 🚀

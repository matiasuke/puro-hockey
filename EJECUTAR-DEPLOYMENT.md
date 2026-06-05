# 🚀 COMO EJECUTAR EL DEPLOYMENT

## PURO HOCKEY v1.0.0

---

## ⚡ OPCION 1: MAS RAPIDA (RECOMENDADO)

### Paso 1: Abre PowerShell

1. Presiona: **Windows + R**
2. Escribe: `powershell`
3. Presiona: **Enter**

### Paso 2: Ve a la carpeta del proyecto

```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
```

### Paso 3: Ejecuta el script

```powershell
.\VERCEL-NONINTERACTIVE.ps1
```

### Paso 4: Cuando pida token

1. Abre: https://vercel.com/account/tokens
2. Click: **Create**
3. Nombre: `puro-hockey-deploy`
4. Click: **Create**
5. **Copia el token**
6. Pega en PowerShell y presiona **Enter**

### Paso 5: Cuando pida URL de Vercel

1. Espera a que termine el deploy
2. Ve a: https://vercel.com/dashboard
3. Selecciona proyecto: `puro-hockey`
4. Copia la URL (ej: `https://puro-hockey-xxxxx.vercel.app`)
5. Pega en PowerShell y presiona **Enter**

**¡Listo! Vercel está deployado** ✅

---

## ⚡ OPCION 2: DOBLE CLICK

### Paso 1: En File Explorer

Navega a:
```
C:\Users\Alumno\Documents\App\hockey-app
```

### Paso 2: Busca y haz doble click

```
DEPLOY-COMPLETO.bat
```

Se abrirá PowerShell automáticamente.

---

## 📋 PASOS GENERALES

### Flujo Completo

```
1. PowerShell abierto en carpeta
   ↓
2. Ejecuta: .\VERCEL-NONINTERACTIVE.ps1
   ↓
3. Verifica requisitos (automático)
   ↓
4. Instala Vercel CLI (automático)
   ↓
5. Pide token de Vercel (TÚ copias y pegas)
   ↓
6. Deploy automático a Vercel
   ↓
7. Pide URL de Vercel (TÚ copias y pegas)
   ↓
8. Muestra URL final
   ↓
9. ¡VERCEL LISTO!
```

---

## 🔑 OBTENER TOKEN DE VERCEL

### Método 1: Desde el script

El script te abrirá automáticamente:
```
https://vercel.com/account/tokens
```

### Método 2: Manual

1. Abre: https://vercel.com/account/tokens
2. Login si es necesario
3. Click: **Create**
4. Completa:
   - Name: `puro-hockey-deploy`
   - Expiration: `No expiration`
   - Scope: `Full Account`
5. Click: **Create**
6. **Copia el token** (aparece una sola vez)
7. Guárdalo en un lugar seguro

---

## ⚠️ IMPORTANT

- El token se muestra **UNA SOLA VEZ**
- Si lo pierdes, crea otro
- NO compartas el token en GitHub
- El token expire después del deployment es seguro

---

## 🎯 CUANDO EJECUTES EL SCRIPT

### Ve viendo estos mensajes

```
PASO 1: Verificando requisitos...
  ✓ Git: OK
  ✓ Node.js: OK
  ✓ npm: OK
  ✓ GitHub: OK - puro-hockey
  ✓ vercel.json: OK

PASO 2: Instalando Vercel CLI...
  [Instala paquetes...]
  ✓ Vercel CLI: INSTALADO

PASO 3: Configurando autenticacion...
  [Pide token de Vercel]
  Pega tu token de Vercel: [COPIAS Y PEGAS AQUI]

PASO 4: Ejecutando deployment...
  vercel --prod --token=***
  [Output del deploy...]
  Status: EXITO

PASO 5: Obteniendo URL...
  [Abre navegador a Vercel]
  Pega la URL de Vercel: [COPIAS Y PEGAS AQUI]

VERCEL DEPLOYMENT COMPLETADO
  Frontend: https://puro-hockey-xxxxx.vercel.app
```

---

## ✅ VERIFICA QUE TODO FUNCIONA

1. Abre en navegador:
   ```
   https://puro-hockey-xxxxx.vercel.app
   ```

2. Debería cargar la aplicación

3. Si no carga, espera 30 segundos y recarga (F5)

---

## 📝 DESPUES DE VERCEL

### Ejecuta Railway

```powershell
.\RAILWAY-AUTO.ps1
```

O completo (ambos):

```powershell
.\DEPLOYMENT-FULL-AUTO.ps1
```

---

## ❌ SI ALGO FALLA

### Error: "PowerShell no encontrado"

Ve a PowerShell:
1. Windows + R
2. Escribe: `powershell`
3. Presiona: Enter

### Error: "Acceso denegado"

Ejecuta como Administrador:
1. Click derecho en PowerShell
2. "Run as administrator"
3. Intenta de nuevo

### Error: "Script no encontrado"

Verifica carpeta:
```powershell
ls *.ps1
```

Deberías ver:
- VERCEL-NONINTERACTIVE.ps1
- RAILWAY-AUTO.ps1
- DEPLOYMENT-FULL-AUTO.ps1

### Error: "Token inválido"

1. Ve a: https://vercel.com/account/tokens
2. Crea uno nuevo
3. Intenta de nuevo con el nuevo token

---

## 🚀 COMIENZA AHORA

### Opción 1: PowerShell (rápido)
```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
.\VERCEL-NONINTERACTIVE.ps1
```

### Opción 2: Doble click (más fácil)
```
Busca: DEPLOY-COMPLETO.bat
Haz doble click
```

---

**¿Listo? ¡Comienza!** 🎯

**Tiempo estimado: 5-10 minutos**

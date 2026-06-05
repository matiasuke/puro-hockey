# 🚀 Instrucciones de Push a GitHub - PURO HOCKEY

## ⭐ FORMA MÁS FÁCIL (Recomendado)

### Opción 1: Ejecutar archivo Batch (más simple)

1. **Abre el Explorador de Archivos**
   - Ve a: `C:\Users\Alumno\Documents\App\hockey-app`

2. **Haz doble click en:**
   ```
   PUSH-GITHUB.bat
   ```

3. **Se abrirá un menú interactivo** donde puedes elegir:
   - GitHub CLI (recomendado)
   - Push Manual
   - Ver instrucciones

4. **Sigue los pasos en pantalla**

---

## 🔧 Opción 2: Ejecutar desde PowerShell

### Paso 1: Abre PowerShell
- Presiona: `Windows + R`
- Escribe: `powershell`
- Presiona: `Enter`

### Paso 2: Ve a la carpeta del proyecto
```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
```

### Paso 3: Ejecuta el menú interactivo
```powershell
.\ejecutar-push.ps1
```

### Paso 4: Selecciona una opción
```
1 = GitHub CLI (más rápido)
2 = Push Manual (control total)
3 = Ver instrucciones
0 = Salir
```

---

## 📋 Scripts Disponibles

### 1. `PUSH-GITHUB.bat` (RECOMENDADO)
- ✅ Haz doble click y listo
- ✅ Interfaz gráfica interactiva
- ✅ Perfecto para principiantes

### 2. `ejecutar-push.ps1` (Menú Interactivo)
- Ejecuta desde PowerShell
- Menú con 3 opciones
- Instrucciones paso a paso

### 3. `push-github-cli.ps1` (GitHub CLI)
- Más rápido y simple
- Requiere GitHub CLI instalado
- Crea repo automáticamente

### 4. `push-github.ps1` (Push Manual)
- Control total del proceso
- Pasos detallados
- Requiere token de GitHub

---

## 🎯 Recomendaciones por Situación

### Si es la PRIMERA VEZ que usas GitHub:
1. Ejecuta: `PUSH-GITHUB.bat`
2. Selecciona opción: `3` (Ver instrucciones)
3. Sigue todo paso a paso

### Si tienes GITHUB CLI instalado:
1. Ejecuta: `PUSH-GITHUB.bat`
2. Selecciona opción: `1` (GitHub CLI)
3. ¡Automático en segundos!

### Si quieres CONTROL TOTAL:
1. Ejecuta: `PUSH-GITHUB.bat`
2. Selecciona opción: `2` (Push Manual)
3. Verás cada paso

---

## 🔐 Obtener Personal Access Token

Si necesitas un token para autenticación:

1. **Ve a GitHub:**
   ```
   https://github.com/settings/tokens
   ```

2. **Click en:** "Generate new token" → "Generate new token (classic)"

3. **Nombre:** `puro-hockey-push`

4. **Permisos necesarios:**
   - ✅ `repo` (acceso a repositorio)
   - ✅ `admin:repo_hook` (webhooks)

5. **Click:** "Generate token"

6. **COPIA el token** (solo lo verás una vez)

7. **Usa el token como contraseña** cuando Git lo pida

---

## ✅ Verificar que Funcionó

Después de hacer push, verifica:

1. **Abre en el navegador:**
   ```
   https://github.com/TU_USUARIO/puro-hockey
   ```

2. **Deberías ver:**
   - ✓ Todos tus archivos
   - ✓ Los commits
   - ✓ El historial de Git

---

## 🆘 Troubleshooting

### "No se reconoce como comando interno"
**Solución:** Ejecuta PowerShell como Administrador
```powershell
# En PowerShell (como admin):
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "GitHub CLI no está instalado"
**Solución:** Instala desde:
```
https://cli.github.com/
```

### "Authentication failed"
**Solución:** 
1. Usa un Personal Access Token (no contraseña)
2. Ve a: https://github.com/settings/tokens
3. Genera un nuevo token y úsalo como contraseña

### "fatal: not a git repository"
**Solución:** Asegúrate de estar en la carpeta correcta:
```powershell
cd "C:\Users\Alumno\Documents\App\hockey-app"
```

---

## 📊 Resumen de Archivos

```
hockey-app/
├── PUSH-GITHUB.bat                 ← EJECUTA ESTO (doble click)
├── ejecutar-push.ps1               ← Menú interactivo
├── push-github-cli.ps1             ← Opción GitHub CLI
├── push-github.ps1                 ← Opción Manual
└── INSTRUCCIONES-PUSH-GITHUB.md   ← Este archivo
```

---

## 🚀 Quick Start (30 segundos)

```powershell
# 1. Abre PowerShell

# 2. Ve a la carpeta
cd "C:\Users\Alumno\Documents\App\hockey-app"

# 3. Ejecuta
.\ejecutar-push.ps1

# 4. Selecciona opción 1 (GitHub CLI)

# 5. Sigue las instrucciones
```

---

## 📞 Ayuda

- 📖 Lee `GITHUB_PUSH_INSTRUCTIONS.md` para detalles manuales
- 📋 Lee `PROYECTO_COMPLETADO.md` para resumen del proyecto
- 💻 Abre PowerShell y ejecuta: `git --version` para verificar Git

---

**¡Listo! Tu proyecto está automatizado para GitHub!** 🎉

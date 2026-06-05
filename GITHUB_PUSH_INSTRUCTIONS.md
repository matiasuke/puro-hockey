# Instrucciones para Push a GitHub

## 🚀 Pasos para Hacer Push del Código a GitHub

### Opción 1: Usando GitHub.com (Interfaz Web)

#### 1. Crear Repositorio en GitHub
1. Ir a [https://github.com/new](https://github.com/new)
2. Llenar formulario:
   - **Repository name**: `puro-hockey`
   - **Description**: `Sistema de gestión de torneos de hockey - API REST + Frontend React`
   - **Visibility**: `Public` o `Private` (según prefieras)
   - **Initialize with**: Dejar sin seleccionar
3. Click en "Create repository"

#### 2. Agregar Remote a Git Local
```bash
cd "C:\Users\Alumno\Documents\App\hockey-app"
git remote add origin https://github.com/TU_USUARIO/puro-hockey.git
git branch -M main
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu usuario de GitHub.

### Opción 2: Usando GitHub CLI (Más Rápido)

Si tienes `gh` instalado:

```bash
cd "C:\Users\Alumno\Documents\App\hockey-app"
gh repo create puro-hockey --public --source=. --remote=origin --push
```

### Opción 3: Usando Token de GitHub (Para Automatización)

Si necesitas automatizar sin interacción:

```bash
cd "C:\Users\Alumno\Documents\App\hockey-app"

# 1. Crear repositorio remoto (requiere token)
# Usa la API de GitHub
curl -H "Authorization: token TU_TOKEN" \
  -d '{"name":"puro-hockey","description":"Sistema de gestión de torneos de hockey"}' \
  https://api.github.com/user/repos

# 2. Agregar remote y hacer push
git remote add origin https://TU_USUARIO:TU_TOKEN@github.com/TU_USUARIO/puro-hockey.git
git push -u origin main
```

**Nota**: Nunca compartas tokens en código público. Úsalos solo en scripts privados.

## 📋 Verificación Post-Push

Después de hacer push, verifica:

1. **Visita tu repositorio**: `https://github.com/TU_USUARIO/puro-hockey`
2. **Verifica commits**: Deberías ver 5 commits (Initial, Automation, Deployment, Backend, Documentation)
3. **Verifica archivos**: Asegúrate que todos los archivos estén presentes
4. **Verifica ramas**: Click en "Branches" y confirma que estás en "main"

## 🔑 Configurar Tokens de GitHub

### Personal Access Token (PAT)

1. Ir a [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Click en "Generate new token" → "Generate new token (classic)"
3. Dale nombre: `puro-hockey-deploy`
4. Selecciona permisos:
   - ✅ `repo` (acceso completo a repositorio)
   - ✅ `admin:repo_hook` (webhooks)
5. Click en "Generate token"
6. **COPIA el token** (solo lo verás una vez)

### Usar Token en Git

```bash
# Configurar git con token (para este repo)
git remote set-url origin https://TU_USUARIO:TU_TOKEN@github.com/TU_USUARIO/puro-hockey.git

# O agregar al helper de credenciales de Windows
git config --global credential.helper wincred
# Luego hacer push y guardar credenciales cuando se pida
```

## 🔄 Workflow Posterior

Una vez que tengas el repositorio en GitHub:

### 1. Crear GitHub Actions para CI/CD
Los workflows ya están en `.github/workflows/`:
- `test.yml` - Ejecutar tests
- `deploy-frontend.yml` - Deploy a Vercel
- `deploy-backend.yml` - Deploy a Railway

### 2. Conectar Vercel
```bash
# El repositorio debe estar en GitHub primero
# Luego ve a https://vercel.com/new
# Selecciona "Import Git Repository"
# Selecciona tu repo puro-hockey
```

### 3. Conectar Railway
```bash
# Ir a https://railway.app
# Create New Project
# Seleccionar "Deploy from GitHub repo"
# Conectar tu repo puro-hockey
```

## ⚙️ Configuración de Secrets en GitHub

Después de hacer push, configura secrets para CI/CD:

1. Ir a tu repo en GitHub
2. Settings → Secrets and variables → Actions
3. Agregar secrets:

```
VERCEL_TOKEN=<token_de_vercel>
VERCEL_PROJECT_ID=<project_id>
RAILWAY_TOKEN=<token_de_railway>
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=<secret_muy_seguro_minimo_32_caracteres>
```

## 📝 Pasos Rápidos (Resumidos)

```bash
# 1. Crear repo en GitHub.com manualmente

# 2. Configurar remote
cd "C:\Users\Alumno\Documents\App\hockey-app"
git remote add origin https://github.com/TU_USUARIO/puro-hockey.git

# 3. Hacer push
git push -u origin main

# 4. Verificar en GitHub.com
# https://github.com/TU_USUARIO/puro-hockey
```

## 🆘 Troubleshooting

### Error: "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TU_USUARIO/puro-hockey.git
```

### Error: "Authentication failed"
```bash
# Reconfigurar credenciales
git config --global user.email "tu@email.com"
git config --global user.name "Tu Nombre"
git credential-manager-core erase https://github.com
# Luego intentar push nuevamente
```

### Push rechazado (different histories)
```bash
git pull origin main --rebase
git push -u origin main
```

## ✅ Checklist

- [ ] Repo creado en GitHub
- [ ] Remote configurado localmente
- [ ] Push completado exitosamente
- [ ] 5 commits visibles en GitHub
- [ ] Todos los archivos presentes
- [ ] README.md visible
- [ ] `.gitignore` funcionando
- [ ] Rama `main` es la default
- [ ] Secrets configurados para CI/CD
- [ ] GitHub Actions habilitadas

---

**Después de completar estos pasos, estará listo para configurar Vercel y Railway para deployment en producción.**

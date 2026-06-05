# PURO HOCKEY - Backend API

Backend API REST completo para el sistema de gestión de torneos de hockey.

## 🚀 Inicio Rápido

### Requisitos
- Node.js v18+
- npm v9+
- PostgreSQL 12+
- Docker (opcional)

### Instalación Local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo .env
cp .env.example .env

# 3. Editar .env con tus valores
nano .env

# 4. Ejecutar migraciones
npm run migrate

# 5. Cargar datos iniciales (seeds)
npm run seed

# 6. Iniciar servidor
npm start
```

Para desarrollo con auto-reload:
```bash
npm run dev
```

### Instalación con Docker

```bash
# Desde el directorio raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f backend
```

## 📋 Variables de Entorno

```env
# Servidor
NODE_ENV=development
PORT=5000
HOST=localhost
LOG_LEVEL=debug

# Base de datos
DATABASE_URL=postgresql://hockey_user:hockey_password@localhost:5432/hockey_db

# Seguridad
JWT_SECRET=dev-secret-key-change-in-production-minimum-32-chars
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Monitoreo (opcional)
SENTRY_DSN=https://key@sentry.io/projectid
```

## 📁 Estructura del Proyecto

```
backend/
├── config/                    # Configuración
│   └── database.js           # Pool de conexión PostgreSQL
├── middleware/               # Middlewares
│   └── auth.js              # JWT y RBAC
├── models/                   # Modelos de datos
│   ├── Usuario.js
│   ├── Club.js
│   ├── Torneo.js
│   ├── Equipo.js
│   ├── Jugador.js
│   ├── Asignacion.js
│   └── Pago.js
├── controllers/             # Lógica de negocio
│   ├── authController.js
│   ├── usuariosController.js
│   ├── clubsController.js
│   ├── torneosController.js
│   ├── equiposController.js
│   ├── jugadoresController.js
│   └── asignacionesController.js
├── routes/                  # Definición de rutas
│   ├── auth.js
│   ├── usuarios.js
│   ├── clubs.js
│   ├── torneos.js
│   ├── equipos.js
│   ├── jugadores.js
│   ├── asignaciones.js
│   ├── pagos.js
│   └── config.js
├── database/
│   └── migrations/         # Migraciones SQL
│       ├── 001_create_usuarios_table.sql
│       ├── 002_create_clubs_table.sql
│       ├── 003_create_torneos_table.sql
│       ├── 004_create_equipos_table.sql
│       ├── 005_create_jugadores_table.sql
│       └── 006_create_asignaciones_table.sql
├── scripts/
│   ├── migrate.js          # Ejecutar migraciones
│   └── seed.js             # Cargar datos iniciales
├── __tests__/              # Tests
│   └── auth.test.js
├── app.js                  # Punto de entrada
├── package.json
└── .env.example
```

## 🔌 Endpoints API

### Autenticación
```
POST   /api/auth/registrar      # Registrar usuario
POST   /api/auth/login          # Iniciar sesión
GET    /api/auth/perfil         # Obtener perfil
PUT    /api/auth/perfil         # Actualizar perfil
PUT    /api/auth/cambiar-password # Cambiar contraseña
```

### Usuarios (Admin)
```
GET    /api/usuarios            # Listar todos
GET    /api/usuarios/:id        # Por ID
GET    /api/usuarios/rol/:role  # Por rol
POST   /api/usuarios            # Crear
PUT    /api/usuarios/:id        # Actualizar
DELETE /api/usuarios/:id        # Eliminar
```

### Clubs
```
GET    /api/clubs               # Listar todos
GET    /api/clubs/:id           # Por ID
GET    /api/clubs/usuario/:usuario_id # Por usuario
GET    /api/clubs/:id/equipos   # Equipos del club
POST   /api/clubs               # Crear
PUT    /api/clubs/:id           # Actualizar
DELETE /api/clubs/:id           # Eliminar
```

### Torneos
```
GET    /api/torneos             # Listar todos
GET    /api/torneos/:id         # Por ID
GET    /api/torneos/estado/:estado # Por estado
GET    /api/torneos/:id/equipos # Equipos del torneo
POST   /api/torneos             # Crear
PUT    /api/torneos/:id         # Actualizar
PATCH  /api/torneos/:id/estado  # Cambiar estado
DELETE /api/torneos/:id         # Eliminar
```

### Equipos
```
GET    /api/equipos             # Listar todos
GET    /api/equipos/:id         # Por ID
GET    /api/equipos/club/:club_id # Por club
GET    /api/equipos/:id/jugadores # Jugadores
POST   /api/equipos             # Crear
PUT    /api/equipos/:id         # Actualizar
DELETE /api/equipos/:id         # Eliminar
```

### Jugadores
```
GET    /api/jugadores           # Listar todos
GET    /api/jugadores/:id       # Por ID
GET    /api/jugadores/equipo/:equipo_id # Por equipo
GET    /api/jugadores/equipo/:equipo_id/posicion/:posicion # Por posición
POST   /api/jugadores           # Crear
PUT    /api/jugadores/:id       # Actualizar
DELETE /api/jugadores/:id       # Eliminar
```

### Asignaciones
```
GET    /api/asignaciones        # Listar todas
GET    /api/asignaciones/:id    # Por ID
GET    /api/asignaciones/torneo/:torneo_id # Por torneo
GET    /api/asignaciones/club/:club_id # Por club
GET    /api/asignaciones/equipo/:equipo_id # Por equipo
POST   /api/asignaciones        # Crear
PUT    /api/asignaciones/:id    # Actualizar
DELETE /api/asignaciones/:id    # Eliminar
```

## 🔐 Autenticación

### Obtener Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### Usar Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/usuarios
```

## 🧪 Testing

### Ejecutar Tests
```bash
npm test
```

### Ver Cobertura
```bash
npm run test:coverage
```

### Tests en Watch Mode
```bash
npm run test:watch
```

## 📊 Scripts Disponibles

```bash
npm start              # Inicia el servidor
npm run dev           # Inicia con auto-reload (nodemon)
npm run migrate       # Ejecuta migraciones
npm run seed          # Carga datos iniciales
npm run test          # Ejecuta tests
npm run test:watch    # Tests en watch mode
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run lint:fix      # ESLint auto-fix
npm run setup         # Todo: npm install + migrate + seed
```

## 🗄️ Base de Datos

### Tablas
- `usuarios` - Usuarios del sistema
- `clubs` - Clubs participantes
- `torneos` - Torneos
- `equipos` - Equipos
- `jugadores` - Jugadores
- `asignaciones` - Asignación equipo-torneo
- `pagos` - Pagos
- `config` - Configuración

### Migraciones
Todas las migraciones se ejecutan automáticamente con:
```bash
npm run migrate
```

## 🔄 Flujo de Desarrollo

1. **Crear rama feature**
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Hacer cambios**
   ```bash
   # Editar archivos
   npm run lint:fix    # Formatear código
   npm test            # Pasar tests
   ```

3. **Hacer commit**
   ```bash
   git add .
   git commit -m "feat: descripción de cambios"
   ```

4. **Push a GitHub**
   ```bash
   git push origin feature/nueva-funcionalidad
   ```

5. **Pull Request**
   - Ir a GitHub y crear PR
   - Esperar revisión y CI/CD

## 🚀 Deployment

### Vercel (Recomendado para Frontend)
Ver `DEPLOYMENT_GUIDE.md` en raíz del proyecto.

### Railway (Recomendado para Backend)
Ver `DEPLOYMENT_GUIDE.md` en raíz del proyecto.

### Heroku
```bash
# Crear aplicación
heroku create puro-hockey-api

# Agregar PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Configurar variables
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 📚 Documentación

- `FASE10_BACKEND_COMPLETO.md` - Documentación completa de Fase 10
- `SISTEMA_PAGOS.md` - Sistema de pagos (Fase 8)
- `DEPLOYMENT_GUIDE.md` - Guía de deployment
- `GITHUB_PUSH_INSTRUCTIONS.md` - Instrucciones para GitHub

## 🆘 Troubleshooting

### Error: "ENOENT: no such file or directory"
```bash
# Asegúrate de tener node_modules
npm install
```

### Error: "Port 5000 is already in use"
```bash
# Cambiar puerto en .env
PORT=5001
```

### Error: "Database connection refused"
```bash
# Verificar que PostgreSQL está corriendo
# Windows: pg_ctl -D "C:\Program Files\PostgreSQL\data" start
# Linux: sudo systemctl start postgresql
# Mac: brew services start postgresql
```

### Error: "Migrations already exist"
```bash
# Las migraciones son idempotentes (seguro correr varias veces)
# Si hay error, revisar logs
npm run migrate
```

## 🔗 Enlaces Útiles

- [Express.js Docs](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Docs](https://jwt.io/)
- [Socket.io Docs](https://socket.io/docs/)

## 📞 Contacto

Para preguntas o issues, abrir un issue en GitHub.

---

**Versión**: 1.0.0  
**Última actualización**: 2024-06-05  
**Autor**: PURO HOCKEY Team

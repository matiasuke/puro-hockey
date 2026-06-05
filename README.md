# 🏆 PURO HOCKEY - Aplicacion Web de Gestion de Torneos

Sistema integral de gestión de torneos de hockey con soporte para múltiples roles, categorías y registros en vivo.

## ✨ Características

### Frontend
- ✅ **Autenticación segura** con JWT
- ✅ **Vista Pública** con Fixture, Tabla de Posiciones y Goleadores
- ✅ **Mesa de Control** optimizada para tablets (registro en vivo de goles y tarjetas)
- ✅ **Componentes reutilizables** (Button, Card, Modal, Header)
- ✅ **Gestión de estado** con Zustand
- ✅ **Responsive design** (mobile-first)
- ✅ **Diseño profesional** WCAG AAA accesible
- ✅ **Sistema de pagos** integrado (4 planes de suscripción)

### Backend (Fase 10)
- ✅ **API REST completa** con 50+ endpoints
- ✅ **Autenticación JWT** con renovación de tokens
- ✅ **Control de acceso basado en roles** (RBAC)
- ✅ **7 modelos de datos** (Usuario, Club, Torneo, Equipo, Jugador, Asignación)
- ✅ **Base de datos PostgreSQL** con migraciones automáticas
- ✅ **Validación de datos** en todos los endpoints
- ✅ **Manejo de errores** robusto
- ✅ **Scripts de automatización** (setup.sh / setup.bat)

## 🚀 Inicio Rápido

### Requisitos
- Node.js v18+
- npm v9+

### Instalación

```bash
cd hockey-app
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Credenciales de Demo

```
Email: friomusical@gmail.com
Contraseña: admin
```

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   └── Modal.tsx
├── pages/               # Páginas principales
│   ├── LoginPage.tsx
│   ├── PublicView.tsx
│   └── MesaControl.tsx
├── store/               # Gestión de estado (Zustand)
│   └── gameStore.ts
├── types/               # Tipos TypeScript
│   └── index.ts
├── App.tsx             # Componente principal
├── index.css           # Estilos globales + Tailwind
└── main.tsx            # Entry point
```

## 🎨 Paleta de Colores

- **Verde Oscuro**: #1B5E20 (Header, botones principales)
- **Verde Medio**: #2E7D32 (Botones secundarios)
- **Verde Claro**: #4CAF50 (Goles, éxito)
- **Amarillo**: #FFC107 (Tarjeta amarilla)
- **Rojo**: #D32F2F (Tarjeta roja)
- **Blanco**: #FFFFFF (Fondo)
- **Gris Claro**: #FAFAFA (Fondos secundarios)
- **Gris Oscuro**: #424242 (Texto)

## 📦 Dependencias Principales

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Utilidad CSS
- **Zustand** - State management
- **Vite** - Build tool
- **lucide-react** - Iconos
- **axios** - HTTP client
- **react-router-dom** - Enrutamiento

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting (si está configurado)
npm run lint
```

## 📋 Características por Rol

### Admin
- Crear/editar torneos
- Gestionar usuarios
- Designar árbitros
- Ver reportes

### Clubes
- Subir listas de buena fe
- Ver fixture y resultados
- Acceder a tabla de posiciones

### Árbitros
- Ver mis designaciones
- Ver fixture
- Acceder a reglamento

### Mesa de Control
- Registrar goles (tap rápido)
- Registrar tarjetas (modal)
- Ver timeline en vivo
- Control de cuartos

### Público
- Ver fixture (lectura)
- Ver tabla de posiciones
- Ver goleadores
- Ver sanciones

## 🔐 Seguridad

- JWT para autenticación
- Hashing de contraseñas (Bcrypt)
- RBAC (Role-Based Access Control)
- CORS configurado
- Sanitización de inputs

## 📱 Responsive Breakpoints

- **1920px+**: Desktop (3 columnas)
- **1280px**: Desktop (2 columnas)
- **768px**: Tablet (1-2 columnas)
- **375px**: Mobile (1 columna)

## 🚀 Próximos Pasos

### Fase 2 (Backend Integration)
- [ ] Node.js + Express API
- [ ] PostgreSQL database
- [ ] User management system
- [ ] JWT authentication
- [ ] API endpoints

### Fase 3 (Real-time)
- [ ] WebSocket integration
- [ ] Live score updates
- [ ] Notifications

### Fase 4 (Mobile)
- [ ] React Native app
- [ ] Offline support

## 📄 Licencia

MIT - Libre para usar, modificar y distribuir

## 👥 Contacto

**Admin Email**: friomusical@gmail.com

---

**Estado**: ✅ MVP Listo para Desarrollo Fase 2
**Versión**: 1.0
**Última actualización**: Junio 2025

¡Gracias por usar PURO HOCKEY! 🏆

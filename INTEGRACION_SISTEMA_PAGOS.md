# 🔗 GUÍA DE INTEGRACIÓN - SISTEMA DE PAGOS Y CONFIGURACIÓN

## 📋 Resumen de Cambios

Se ha integrado completamente el sistema de pagos por transferencia con configuración dinámica de planes en el dashboard administrativo.

---

## 🔧 Paso 1: Backend - Crear Tablas en BD

### Ejecutar migraciones SQL:

```bash
# Conectarse a PostgreSQL
psql -U usuario -d hockey_db

# Ejecutar migraciones
\i backend/database/migrations/create_pagos_table.sql
\i backend/database/migrations/create_config_table.sql
```

O ejecutar en el cliente:
```sql
-- Copiar y pegar el contenido de ambos archivos SQL
```

---

## 🔌 Paso 2: Backend - Integrar Rutas

### Archivo: `backend/app.js` o `backend/server.js`

Agregar al final antes de `app.listen()`:

```javascript
// Rutas de Pagos y Configuración
const pagosRoutes = require('./routes/pagos');
const configRoutes = require('./routes/config');

app.use('/api/pagos', pagosRoutes);
app.use('/api/config', configRoutes);
```

### Verificar que existan middleware:

```javascript
const { verifyToken, verifyRole } = require('./middleware/auth');
```

---

## 💻 Paso 3: Frontend - Archivos Creados

Los siguientes archivos ya están creados:

### Servicios:
- ✅ `src/services/configService.ts` - Servicio para configuración

### Datos:
- ✅ `src/data/pricingPlans.ts` - Planes y datos bancarios

### Componentes:
- ✅ `src/components/PricingCard.tsx` - Tarjeta de plan
- ✅ `src/components/PaymentModal.tsx` - Modal de pago
- ✅ `src/components/PaymentAdmin.tsx` - Panel para admin
- ✅ `src/components/ConfiguracionPlanes.tsx` - Editor de configuración

### Vistas:
- ✅ `src/pages/AdminDashboard.tsx` - Dashboard con tabs
- ✅ `src/pages/PagosView.tsx` - Vista de pagos
- ✅ `src/pages/AdminView.tsx` - Actualizado con activeTab

### Routing:
- ✅ `src/components/RoleRouter.tsx` - Actualizado a usar AdminDashboard

---

## 🎯 Paso 4: Verificar Integración

### 1. Verificar que el Admin Dashboard tenga tabs:
```
🎯 Panel Administrativo
[🏆 Torneos] [👥 Usuarios] [💳 Pagos] [⚙️ Configuración]
```

### 2. Tab "Configuración" debe mostrar:
- Formulario para editar planes de pago
- Formulario para editar datos bancarios
- Botones para guardar cambios

### 3. Tab "Pagos" debe mostrar:
- Para admin: pagos pendientes y completados
- Para club: registro de pago y historial

---

## 📱 Estructura del Dashboard Admin

```
AdminDashboard.tsx
├── Estado local: planes, bankInfo, activeTab
├── useEffect: cargarConfiguracion()
│
└── Render:
    ├── Header + Notificaciones Toast
    ├── Tabs:
    │   ├── 🏆 Torneos → AdminView (activeTab='torneos')
    │   ├── 👥 Usuarios → AdminView (activeTab='usuarios')
    │   ├── 💳 Pagos → PagosView (userRole='admin')
    │   └── ⚙️ Configuración → ConfiguracionPlanes
    │
    └── Funciones:
        ├── cargarConfiguracion()
        ├── handleUpdatePlanes()
        └── handleUpdateBankInfo()
```

---

## 🔄 Flujo de Datos

### Al cargar AdminDashboard:

```
1. useEffect → cargarConfiguracion()
   ↓
2. configService.getConfig()
   ↓
3. respuesta: { planes[], banco_info{} }
   ↓
4. setPlanes() + setBankInfo()
   ↓
5. Render componentes con datos actualizados
```

### Al actualizar un plan:

```
1. User edita precio en ConfiguracionPlanes
   ↓
2. handleUpdatePlan(planId, 'precio', 25000)
   ↓
3. setEditingPlanes([...])
   ↓
4. Click "Guardar Cambios"
   ↓
5. handleUpdatePlanes(editingPlanes)
   ↓
6. configService.updatePlanes(planes)
   ↓
7. PUT /api/config/planes → Backend
   ↓
8. Backend actualiza BD
   ↓
9. Toast: "Planes actualizados correctamente"
   ↓
10. setPlanes(nuevosPlanes)
```

---

## 🔐 Permisos y Roles

### Admin:
- ✅ Ver tab Configuración
- ✅ Editar planes de pago
- ✅ Editar datos bancarios
- ✅ Ver pagos pendientes
- ✅ Confirmar/Rechazar pagos

### Club:
- ✅ Ver tab Pagos
- ✅ Registrar pagos
- ✅ Ver historial de pagos
- ❌ NO puede ver Configuración

### Árbitro/Mesa Control/Público:
- ❌ NO tienen acceso a Admin

---

## 📝 API Endpoints Integrados

### Configuración:
```
GET    /api/config              → Obtener configuración
GET    /api/config/planes       → Obtener planes
GET    /api/config/bank-info    → Obtener datos bancarios
PUT    /api/config/planes       → Actualizar planes (admin)
PUT    /api/config/bank-info    → Actualizar banco (admin)
POST   /api/config/reset        → Resetear (admin)
```

### Pagos:
```
GET    /api/pagos               → Obtener pagos
GET    /api/pagos/pendientes    → Pagos pendientes (admin)
POST   /api/pagos               → Crear pago (club)
PUT    /api/pagos/:id/confirmar → Confirmar (admin)
PUT    /api/pagos/:id/rechazar  → Rechazar (admin)
```

---

## 🧪 Testing Manual

### 1. Entrar como Admin:

```
1. Login con admin@example.com
2. Ir a Panel Administrativo
3. Clic en tab "⚙️ Configuración"
4. Verifica que carguen los planes y datos bancarios
```

### 2. Editar un Plan:

```
1. En "Configuración" → "📊 Planes de Pago"
2. Buscar plan "Plan Anual"
3. Cambiar precio: 35000 → 40000
4. Click "✓ Guardar Cambios"
5. Toast verde: "Planes de pago actualizados correctamente"
6. Verificar que el precio cambió en BD
```

### 3. Editar Datos Bancarios:

```
1. En "Configuración" → "🏦 Datos Bancarios"
2. Cambiar alias: puro.hockey.pagos → hockey.payments
3. Click "✓ Guardar Cambios"
4. Toast verde: "Datos bancarios actualizados correctamente"
```

### 4. Ver Pagos como Admin:

```
1. En AdminDashboard, click tab "💳 Pagos"
2. Verifica que muestre "Pagos Pendientes de Confirmación"
3. Para cada pago, puedes:
   - Ver comprobante (link)
   - Confirmar (habilita torneo)
   - Rechazar (ingresa motivo)
```

### 5. Registrar Pago como Club:

```
1. Login con club@example.com
2. Ir a ClubView
3. Click en "💳 Pagos"
4. Click "💳 Registrar Pago" en torneo pendiente
5. Modal de 3 pasos:
   a) Seleccionar Plan (Expres/Apertura/Clausura/Anual)
   b) Ingresar datos de transferencia
   c) Confirmar
6. Toast: "Pago registrado correctamente. Pendiente de confirmación admin."
```

---

## 🔍 Troubleshooting

### "Error al cargar configuración"

**Causa:** La tabla `config` no existe o no tiene datos

**Solución:**
```sql
-- Ejecutar manualmente en PostgreSQL
\i backend/database/migrations/create_config_table.sql

-- Verificar que exista
SELECT * FROM config;
```

### "No puedo editar los datos bancarios"

**Causas posibles:**
1. No eres admin
2. Token JWT expirado
3. El backend no está ejecutando la ruta /api/config

**Solución:**
```bash
# Verificar que el backend esté corriendo
npm run dev

# Verificar que las rutas estén integradas en app.js
grep -n "configRoutes" backend/app.js
```

### "Planes no se actualizan en el dropdown"

**Causa:** ConfiguracionPlanes está usando valores por defecto de pricingPlans.ts

**Solución:** 
- Asegurar que AdminDashboard cargue la configuración en useEffect
- Pasar `planes` como prop a ConfiguracionPlanes

### "Los cambios no se guardan en BD"

**Verifica:**
1. ¿Eres admin? (role: 'admin')
2. ¿El token JWT es válido?
3. ¿La tabla `config` existe?
4. ¿El middleware `verifyToken` está funcionando?

```bash
# Ver logs del backend
tail -f backend.log
```

---

## 📊 Base de Datos - Nueva Tabla Config

```sql
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  planes JSONB,              -- Array de planes de pago
  banco_info JSONB,          -- Objeto con datos bancarios
  fecha_creacion TIMESTAMP,
  fecha_actualizacion TIMESTAMP
);
```

**Ejemplo de datos:**
```json
{
  "id": 1,
  "planes": [
    {
      "id": "anual",
      "nombre": "Plan Anual",
      "precio": 40000,
      ...
    }
  ],
  "banco_info": {
    "banco": "Banco Puro Hockey",
    "alias": "hockey.payments",
    ...
  }
}
```

---

## 🚀 Próximos Pasos (Opcionales)

1. **Estadísticas de Pagos:**
   - Reportes de ingresos mensuales
   - Gráficos de planes más vendidos
   - Análisis de tasa de conversión

2. **Automatización:**
   - Email cuando se confirma pago
   - Recordatorio a clubs que no pagaron
   - Auto-expiración de pagos pendientes

3. **Métodos de Pago Alternativos:**
   - Tarjeta de crédito (integrar Stripe)
   - Billetera virtual
   - QR para transferencias

4. **Auditoría:**
   - Historial de cambios en configuración
   - Quién cambió qué y cuándo
   - Reporte de cambios de precios

---

## ✅ Checklist de Integración

**Backend:**
- [ ] Tabla `pagos` creada
- [ ] Tabla `config` creada
- [ ] Rutas `/api/pagos` integradas en app.js
- [ ] Rutas `/api/config` integradas en app.js
- [ ] Middleware de auth funcionando
- [ ] Base de datos con datos de prueba

**Frontend:**
- [ ] AdminDashboard funciona con 4 tabs
- [ ] Tab "Configuración" muestra formularios
- [ ] Tab "Pagos" muestra panel de admin
- [ ] ConfiguracionPlanes guarda cambios
- [ ] Planes actualizados se reflejan en PaymentModal
- [ ] Toast notifications funcionan

**Testing:**
- [ ] Admin puede ver configuración
- [ ] Admin puede editar planes
- [ ] Admin puede editar datos bancarios
- [ ] Club puede registrar pago
- [ ] Admin puede confirmar pago
- [ ] Torneo se habilita después de confirmar pago

---

## 📚 Documentación Relacionada

- `SISTEMA_PAGOS.md` - Descripción del sistema
- `backend/routes/pagos.js` - Endpoints de pagos
- `backend/routes/config.js` - Endpoints de configuración
- `src/services/configService.ts` - Cliente de API para config
- `src/data/pricingPlans.ts` - Datos por defecto

---

**Integración completada. El sistema está listo para usar. 🎉**

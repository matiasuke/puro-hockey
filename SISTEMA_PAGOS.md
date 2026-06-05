# 💳 SISTEMA DE PAGOS POR TRANSFERENCIA - PURO HOCKEY

## 🎯 Descripción General

Sistema completo de gestión de pagos por transferencia bancaria para la habilitación de torneos. Los clubs registran sus transferencias con comprobante y los admins las confirman para habilitar el torneo.

---

## 📋 Planes de Pago

| Plan | Duración | Precio | Características |
|------|----------|--------|-----------------|
| **Expres** | 1 mes | $5,000 | Para torneos puntuales |
| **Clausura** | 6 meses (Ago-Ene) | $20,000 | Segunda mitad del año |
| **Apertura** | 6 meses (Feb-Jul) | $20,000 | Primera mitad del año |
| **Anual** | 12 meses | $35,000 | Acceso completo (con descuento) |

---

## 🏦 Datos Bancarios

```
Banco: Banco Puro Hockey
Titular: PURO HOCKEY SRL
CBU: 0123456789012345678901
Alias: puro.hockey.pagos
Cuenta: 1234567890
CUIT: 30-12345678-9
```

---

## 🔄 Flujo de Pago

### Paso 1: Club crea Torneo
```
Club → AdminView → Crear Torneo
    → Estado: "PENDIENTE_PAGO"
    → No se puede usar hasta pagar
```

### Paso 2: Club Registra Pago
```
Club → PagosView → "Registrar Pago"
    ↓
Modal de Pago:
  1. Seleccionar Plan (Expres/Apertura/Clausura/Anual)
  2. Ver datos bancarios
  3. Ingresar datos de transferencia:
     - Número de referencia (CBU, número transacción)
     - Fecha de transferencia
     - URL del comprobante
  4. Confirmar
    ↓
Estado: "PENDIENTE" (awaiting admin confirmation)
```

### Paso 3: Admin Verifica Pago
```
Admin → PagosView → "Pagos Pendientes"
    ↓
Para cada pago:
  - Ver datos de la transferencia
  - Ver comprobante (link)
  - Ver monto, referencia, fecha
  ↓
Opciones:
  a) CONFIRMAR → Estado: "COMPLETADO"
               → Torneo: Estado cambia a "ACTIVO"
               → ✅ Torneo habilitado para usar
  
  b) RECHAZAR → Estado: "RECHAZADO"
              → Club debe volver a pagar
              → Motivo de rechazo (opcional)
```

### Paso 4: Torneo Habilitado
```
Estado: "ACTIVO"
    ↓
El club puede:
  ✓ Crear equipos
  ✓ Cargar jugadores
  ✓ Crear partidos
  ✓ Registrar resultados
```

---

## 📁 Estructura de Archivos

### Frontend

```
src/
├── data/
│   └── pricingPlans.ts          ✨ NUEVO - Configuración de planes
│
├── components/
│   ├── PricingCard.tsx           ✨ NUEVO - Tarjeta individual de plan
│   ├── PaymentModal.tsx          ✨ NUEVO - Modal para registrar pago
│   └── PaymentAdmin.tsx          ✨ NUEVO - Panel para admin
│
├── pages/
│   └── PagosView.tsx             ✨ NUEVO - Vista de pagos
│
└── services/
    └── api.ts                    ✏️ ACTUALIZADO - Agregado pagosService
```

### Backend

```
backend/
├── models/
│   └── Pago.js                   ✨ NUEVO - Modelo de pagos
│
├── controllers/
│   └── pagosController.js        ✨ NUEVO - Lógica de pagos
│
├── routes/
│   └── pagos.js                  ✨ NUEVO - Rutas de API
│
├── constants/
│   └── paymentStatus.js          ✨ NUEVO - Estados y constantes
│
└── database/
    └── migrations/
        └── create_pagos_table.sql ✨ NUEVO - Tabla SQL
```

---

## 🔌 API Endpoints

### Para Clubs

```
POST /api/pagos
├─ Crear un nuevo pago
├─ Body: {
│  torneo_id: string,
│  plan_id: "expres" | "clausura" | "apertura" | "anual",
│  numero_referencia: string,
│  fecha_transferencia: "YYYY-MM-DD",
│  comprobante_url: string (opcional)
│}
└─ Response: { success, data }

GET /api/pagos
├─ Obtener mis pagos
└─ Response: { data: Pago[] }

GET /api/pagos/torneo/:torneoId
├─ Obtener pagos de un torneo
└─ Response: { data: Pago[] }
```

### Para Admins

```
GET /api/pagos
├─ Obtener todos los pagos
├─ Query: ?estado=PENDIENTE&torneo_id=xxx
└─ Response: { data: Pago[], count }

GET /api/pagos/pendientes
├─ Obtener solo pagos pendientes
└─ Response: { data: Pago[] }

GET /api/pagos/:id
├─ Obtener un pago específico
└─ Response: { data: Pago }

PUT /api/pagos/:id/confirmar
├─ Confirmar un pago
├─ Body: { notas?: string }
└─ Response: { success, data }
│  Effect: Torneo → "ACTIVO"

PUT /api/pagos/:id/rechazar
├─ Rechazar un pago
├─ Body: { motivo: string }
└─ Response: { success, data }
│  Effect: Pago → "RECHAZADO"

DELETE /api/pagos/:id
├─ Eliminar un pago
└─ Response: { success, data }
```

---

## 💾 Modelo de Datos - Tabla `pagos`

```sql
CREATE TABLE pagos (
  id UUID PRIMARY KEY,
  
  -- Relaciones
  torneo_id UUID NOT NULL,
  club_id UUID,
  
  -- Datos del pago
  plan_id VARCHAR(50), -- 'expres', 'clausura', 'apertura', 'anual'
  monto DECIMAL(10, 2),
  estado VARCHAR(20), -- 'PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'EXPIRADO'
  
  -- Transferencia
  numero_referencia VARCHAR(255),
  fecha_transferencia DATE,
  comprobante_url TEXT,
  
  -- Auditoría
  fecha_creacion TIMESTAMP,
  fecha_confirmacion TIMESTAMP,
  fecha_rechazo TIMESTAMP,
  notas TEXT,
  motivo_rechazo TEXT
);
```

---

## 🔐 Permisos y Roles

### Club
- ✅ Crear pagos (POST /api/pagos)
- ✅ Ver propios pagos (GET /api/pagos)
- ✅ Ver datos bancarios

### Admin
- ✅ Ver todos los pagos
- ✅ Ver pagos pendientes
- ✅ Confirmar pagos
- ✅ Rechazar pagos
- ✅ Ver comprobantes
- ✅ Eliminar pagos

### Público / Árbitro / Mesa Control
- ❌ No tienen acceso a pagos

---

## 📊 Estados Posibles

### Estado del Pago
```
PENDIENTE → (Admin confirma) → COMPLETADO ✅
         → (Admin rechaza)  → RECHAZADO ❌
         → (Expira)         → EXPIRADO ⏳
```

### Estado del Torneo
```
PENDIENTE_PAGO → (Pago confirmado) → ACTIVO ✅
              → (Se cancela)      → SUSPENDIDO ⚠️
              → (Termina)         → FINALIZADO ✓
```

---

## 🎨 Componentes Frontend

### PricingCard.tsx
```typescript
<PricingCard
  plan={PRICING_PLANS[0]}
  isSelected={selectedPlan === 'expres'}
  onSelect={setSelectedPlan}
/>
// Muestra:
// - Nombre del plan
// - Duración
// - Precio
// - Características
// - Botón de selección
```

### PaymentModal.tsx
```typescript
<PaymentModal
  isOpen={showPaymentModal}
  torneoNombre="Torneo Apertura 2025"
  onClose={() => setShowPaymentModal(false)}
  onSubmit={handleCrearPago}
  isLoading={false}
/>
// Flujo de 3 pasos:
// 1. Seleccionar plan
// 2. Ingresar datos de transferencia
// 3. Resumen y confirmación
```

### PaymentAdmin.tsx
```typescript
<PaymentAdmin
  pagos={pagos}
  onConfirmar={handleConfirmarPago}
  onRechazar={handleRechazarPago}
/>
// Muestra:
// - Pagos pendientes (expandibles)
// - Pagos confirmados (tabla)
// - Botones para confirmar/rechazar
```

### PagosView.tsx
```typescript
<PagosView userRole="club" />
// O
<PagosView userRole="admin" />
// Vista principal que agrupa todo
```

---

## 🚀 Integración en Rutas

Agregar a `src/components/RoleRouter.tsx`:

```typescript
import { PagosView } from '../pages/PagosView';

// En el router:
<Route path="/pagos" element={<PagosView userRole={userRole} />} />
```

Agregar a `backend/app.js` o `server.js`:

```typescript
const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', pagosRoutes);
```

---

## ✅ Checklist de Implementación

### Frontend
- ✅ pricingPlans.ts creado
- ✅ PricingCard.tsx creado
- ✅ PaymentModal.tsx creado
- ✅ PaymentAdmin.tsx creado
- ✅ PagosView.tsx creado
- ✅ pagosService en api.ts

### Backend
- ✅ Pago.js (modelo) creado
- ✅ pagosController.js creado
- ✅ pagos.js (rutas) creado
- ✅ paymentStatus.js (constantes) creado
- ✅ create_pagos_table.sql creado

### Próximos Pasos
- [ ] Ejecutar SQL para crear tabla
- [ ] Integrar rutas en backend app.js
- [ ] Integrar vista en RoleRouter.tsx
- [ ] Agregar link a navbar/menu
- [ ] Pruebas end-to-end
- [ ] Despliegue

---

## 📧 Información para el Club

### Cómo Registrar un Pago

1. **Ir a Pagos** → Sección de pagos
2. **Seleccionar Torneo** → Torneos pendientes de pago
3. **Registrar Pago:**
   - Selecciona el plan (Expres, Apertura, Clausura, Anual)
   - Observa los datos bancarios
   - Realiza la transferencia
   - Registra número de referencia y fecha
   - Sube comprobante (URL)
4. **Esperar Confirmación** → El admin confirmará tu pago en 24-48hs
5. **¡Torneo Habilitado!** → Recibe notificación cuando esté activo

---

## 🔍 Troubleshooting

### "El torneo sigue pendiente de pago"
- Verificar que el pago fue creado en la BD
- Admin debe ir a "Pagos Pendientes" y confirmar

### "El comprobante no se ve"
- La URL debe ser pública (Imgur, Google Drive compartido, etc.)
- Verificar que la URL sea correcta en la BD

### "Error al confirmar pago"
- Verificar que el usuario sea admin (role: 'admin')
- Verificar JWT token válido

---

## 📞 Soporte

Para consultas sobre:
- **Datos bancarios:** Contactar con administrador
- **Planes:** Ver detalles en el modal de pago
- **Estados:** Ver tabla de estados arriba

---

**Sistema de Pagos creado en Fase 8 - Funcionalidades Avanzadas**

Próxima fase: Optimizaciones, reportes estadísticos, y deployment.

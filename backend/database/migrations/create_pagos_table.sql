-- Crear tabla de Pagos
-- Esta tabla registra todos los pagos por transferencia de los torneos

CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  torneo_id UUID NOT NULL REFERENCES torneos(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,

  -- Datos del pago
  plan_id VARCHAR(50) NOT NULL, -- 'expres', 'clausura', 'apertura', 'anual'
  monto DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'EXPIRADO'

  -- Datos de la transferencia
  numero_referencia VARCHAR(255) NOT NULL, -- CBU, número de transacción, etc.
  fecha_transferencia DATE NOT NULL,
  comprobante_url TEXT,

  -- Auditoría
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_confirmacion TIMESTAMP,
  fecha_rechazo TIMESTAMP,

  -- Notas del admin
  notas TEXT,
  motivo_rechazo TEXT,

  -- Índices
  CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'EXPIRADO')),
  CONSTRAINT chk_plan CHECK (plan_id IN ('expres', 'clausura', 'apertura', 'anual'))
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_pagos_torneo_id ON pagos(torneo_id);
CREATE INDEX idx_pagos_club_id ON pagos(club_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_plan_id ON pagos(plan_id);
CREATE INDEX idx_pagos_fecha_creacion ON pagos(fecha_creacion DESC);

-- Agregar columnas a tabla torneos si no existen
ALTER TABLE torneos
ADD COLUMN IF NOT EXISTS estado VARCHAR(50) DEFAULT 'ACTIVO',
ADD COLUMN IF NOT EXISTS plan_id VARCHAR(50),
ADD CONSTRAINT chk_torneo_estado CHECK (estado IN ('PENDIENTE_PAGO', 'ACTIVO', 'SUSPENDIDO', 'FINALIZADO'));

-- Crear índice para torneos por estado
CREATE INDEX IF NOT EXISTS idx_torneos_estado ON torneos(estado);

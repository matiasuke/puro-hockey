-- Crear tabla de Configuración
-- Esta tabla almacena la configuración global de la plataforma

CREATE TABLE IF NOT EXISTS config (
  id SERIAL PRIMARY KEY,

  -- Configuración
  planes JSONB DEFAULT '[]',
  banco_info JSONB DEFAULT '{}',

  -- Auditoría
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_config_fecha_actualizacion ON config(fecha_actualizacion DESC);

-- Insertar configuración por defecto
INSERT INTO config (planes, banco_info, fecha_actualizacion)
VALUES (
  '[
    {
      "id": "expres",
      "nombre": "Plan Expres",
      "duracion": "1 mes",
      "meses": 1,
      "precio": 5000,
      "descripcion": "Para torneos puntuales y eventos especiales",
      "caracteristicas": ["1 mes de acceso", "Hasta 10 equipos", "Estadísticas básicas"]
    },
    {
      "id": "clausura",
      "nombre": "Plan Clausura",
      "duracion": "6 meses (Ago - Ene)",
      "meses": 6,
      "precio": 20000,
      "descripcion": "Clausura del año - Segunda mitad",
      "caracteristicas": ["6 meses de acceso", "Equipos ilimitados", "Todas las estadísticas", "Reportes PDF"]
    },
    {
      "id": "apertura",
      "nombre": "Plan Apertura",
      "duracion": "6 meses (Feb - Jul)",
      "meses": 6,
      "precio": 20000,
      "descripcion": "Apertura del año - Primera mitad",
      "caracteristicas": ["6 meses de acceso", "Equipos ilimitados", "Todas las estadísticas", "Reportes PDF"]
    },
    {
      "id": "anual",
      "nombre": "Plan Anual",
      "duracion": "12 meses",
      "meses": 12,
      "precio": 35000,
      "descripcion": "Acceso completo todo el año - Mejor opción",
      "caracteristicas": ["12 meses de acceso", "Equipos ilimitados", "Todas las estadísticas", "Reportes PDF + Excel", "Soporte prioritario", "¡10% de descuento!"]
    }
  ]'::jsonb,
  '{
    "banco": "Banco Puro Hockey",
    "cuenta": "1234567890",
    "cbu": "0123456789012345678901",
    "alias": "puro.hockey.pagos",
    "titular": "PURO HOCKEY SRL",
    "cuit": "30-12345678-9"
  }'::jsonb,
  NOW()
)
ON CONFLICT DO NOTHING;

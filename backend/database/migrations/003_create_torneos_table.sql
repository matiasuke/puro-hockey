CREATE TABLE IF NOT EXISTS torneos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(50) DEFAULT 'PENDIENTE',
    plan_id VARCHAR(50),
    fecha_inicio DATE,
    fecha_fin DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_torneos_estado ON torneos(estado);
CREATE INDEX idx_torneos_plan_id ON torneos(plan_id);
CREATE INDEX idx_torneos_fecha_creacion ON torneos(fecha_creacion);

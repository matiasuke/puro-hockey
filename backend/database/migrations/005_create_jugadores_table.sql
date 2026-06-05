CREATE TABLE IF NOT EXISTS jugadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    numero_camiseta INTEGER NOT NULL,
    equipo_id INTEGER NOT NULL,
    posicion VARCHAR(100),
    estado BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    UNIQUE(numero_camiseta, equipo_id)
);

CREATE INDEX idx_jugadores_equipo_id ON jugadores(equipo_id);
CREATE INDEX idx_jugadores_posicion ON jugadores(posicion);

CREATE TABLE IF NOT EXISTS equipos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    club_id INTEGER NOT NULL,
    ciudad VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

CREATE INDEX idx_equipos_club_id ON equipos(club_id);
CREATE INDEX idx_equipos_nombre ON equipos(nombre);

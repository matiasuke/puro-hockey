CREATE TABLE IF NOT EXISTS asignaciones (
    id SERIAL PRIMARY KEY,
    torneo_id INTEGER NOT NULL,
    equipo_id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    estado VARCHAR(50) DEFAULT 'REGISTRADO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (torneo_id) REFERENCES torneos(id) ON DELETE CASCADE,
    FOREIGN KEY (equipo_id) REFERENCES equipos(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
);

CREATE INDEX idx_asignaciones_torneo_id ON asignaciones(torneo_id);
CREATE INDEX idx_asignaciones_equipo_id ON asignaciones(equipo_id);
CREATE INDEX idx_asignaciones_club_id ON asignaciones(club_id);
CREATE INDEX idx_asignaciones_estado ON asignaciones(estado);

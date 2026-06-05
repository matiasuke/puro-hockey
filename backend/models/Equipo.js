import pool from '../config/database.js';

export class Equipo {
    static async crear(datos) {
        const { nombre, club_id, ciudad } = datos;

        const result = await pool.query(
            `INSERT INTO equipos (nombre, club_id, ciudad, fecha_creacion)
             VALUES ($1, $2, $3, NOW())
             RETURNING id, nombre, club_id, ciudad, fecha_creacion`,
            [nombre, club_id, ciudad]
        );

        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT e.id, e.nombre, e.club_id, e.ciudad, c.nombre as nombre_club,
                    COUNT(j.id) as cantidad_jugadores, e.fecha_creacion
             FROM equipos e
             LEFT JOIN clubs c ON e.club_id = c.id
             LEFT JOIN jugadores j ON e.id = j.equipo_id
             WHERE e.id = $1
             GROUP BY e.id, e.nombre, e.club_id, e.ciudad, c.nombre, e.fecha_creacion`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT e.id, e.nombre, e.club_id, e.ciudad, c.nombre as nombre_club,
                    COUNT(j.id) as cantidad_jugadores, e.fecha_creacion
             FROM equipos e
             LEFT JOIN clubs c ON e.club_id = c.id
             LEFT JOIN jugadores j ON e.id = j.equipo_id
             GROUP BY e.id, e.nombre, e.club_id, e.ciudad, c.nombre, e.fecha_creacion
             ORDER BY e.fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async obtenerPorClub(club_id) {
        const result = await pool.query(
            `SELECT e.id, e.nombre, e.club_id, e.ciudad,
                    COUNT(j.id) as cantidad_jugadores, e.fecha_creacion
             FROM equipos e
             LEFT JOIN jugadores j ON e.id = j.equipo_id
             WHERE e.club_id = $1
             GROUP BY e.id, e.nombre, e.club_id, e.ciudad, e.fecha_creacion
             ORDER BY e.nombre`,
            [club_id]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { nombre, ciudad } = datos;
        const result = await pool.query(
            `UPDATE equipos
             SET nombre = COALESCE($1, nombre),
                 ciudad = COALESCE($2, ciudad),
                 fecha_actualizacion = NOW()
             WHERE id = $3
             RETURNING id, nombre, ciudad, fecha_actualizacion`,
            [nombre, ciudad, id]
        );
        return result.rows[0];
    }

    static async obtenerJugadores(equipo_id) {
        const result = await pool.query(
            `SELECT id, nombre, numero_camiseta, posicion, estado, fecha_creacion
             FROM jugadores
             WHERE equipo_id = $1
             ORDER BY numero_camiseta`,
            [equipo_id]
        );
        return result.rows;
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM equipos WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM equipos');
        return parseInt(result.rows[0].total);
    }
}

export default Equipo;

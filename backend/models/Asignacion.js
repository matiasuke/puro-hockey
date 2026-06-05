import pool from '../config/database.js';

export class Asignacion {
    static async crear(datos) {
        const { torneo_id, equipo_id, club_id, estado = 'REGISTRADO' } = datos;

        const result = await pool.query(
            `INSERT INTO asignaciones (torneo_id, equipo_id, club_id, estado, fecha_creacion)
             VALUES ($1, $2, $3, $4, NOW())
             RETURNING id, torneo_id, equipo_id, club_id, estado, fecha_creacion`,
            [torneo_id, equipo_id, club_id, estado]
        );

        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                    t.nombre as nombre_torneo, e.nombre as nombre_equipo,
                    c.nombre as nombre_club, a.fecha_creacion
             FROM asignaciones a
             LEFT JOIN torneos t ON a.torneo_id = t.id
             LEFT JOIN equipos e ON a.equipo_id = e.id
             LEFT JOIN clubs c ON a.club_id = c.id
             WHERE a.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                    t.nombre as nombre_torneo, e.nombre as nombre_equipo,
                    c.nombre as nombre_club, a.fecha_creacion
             FROM asignaciones a
             LEFT JOIN torneos t ON a.torneo_id = t.id
             LEFT JOIN equipos e ON a.equipo_id = e.id
             LEFT JOIN clubs c ON a.club_id = c.id
             ORDER BY a.fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async obtenerPorTorneo(torneo_id) {
        const result = await pool.query(
            `SELECT a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                    e.nombre as nombre_equipo, c.nombre as nombre_club,
                    COUNT(j.id) as cantidad_jugadores, a.fecha_creacion
             FROM asignaciones a
             LEFT JOIN equipos e ON a.equipo_id = e.id
             LEFT JOIN clubs c ON a.club_id = c.id
             LEFT JOIN jugadores j ON e.id = j.equipo_id
             WHERE a.torneo_id = $1
             GROUP BY a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                     e.nombre, c.nombre, a.fecha_creacion
             ORDER BY a.fecha_creacion DESC`,
            [torneo_id]
        );
        return result.rows;
    }

    static async obtenerPorClub(club_id) {
        const result = await pool.query(
            `SELECT a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                    t.nombre as nombre_torneo, e.nombre as nombre_equipo,
                    a.fecha_creacion
             FROM asignaciones a
             LEFT JOIN torneos t ON a.torneo_id = t.id
             LEFT JOIN equipos e ON a.equipo_id = e.id
             WHERE a.club_id = $1
             ORDER BY a.fecha_creacion DESC`,
            [club_id]
        );
        return result.rows;
    }

    static async obtenerPorEquipo(equipo_id) {
        const result = await pool.query(
            `SELECT a.id, a.torneo_id, a.equipo_id, a.club_id, a.estado,
                    t.nombre as nombre_torneo, t.plan_id, a.fecha_creacion
             FROM asignaciones a
             LEFT JOIN torneos t ON a.torneo_id = t.id
             WHERE a.equipo_id = $1
             ORDER BY a.fecha_creacion DESC`,
            [equipo_id]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { estado } = datos;
        const result = await pool.query(
            `UPDATE asignaciones
             SET estado = COALESCE($1, estado),
                 fecha_actualizacion = NOW()
             WHERE id = $2
             RETURNING id, torneo_id, equipo_id, club_id, estado, fecha_actualizacion`,
            [estado, id]
        );
        return result.rows[0];
    }

    static async verificarExistencia(torneo_id, equipo_id) {
        const result = await pool.query(
            `SELECT id FROM asignaciones
             WHERE torneo_id = $1 AND equipo_id = $2`,
            [torneo_id, equipo_id]
        );
        return result.rows.length > 0;
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM asignaciones WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM asignaciones');
        return parseInt(result.rows[0].total);
    }
}

export default Asignacion;

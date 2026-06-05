import pool from '../config/database.js';

export class Club {
    static async crear(datos) {
        const { nombre, email, telefono, ciudad, usuario_id } = datos;

        const result = await pool.query(
            `INSERT INTO clubs (nombre, email, telefono, ciudad, usuario_id, fecha_creacion)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING id, nombre, email, telefono, ciudad, usuario_id, fecha_creacion`,
            [nombre, email, telefono, ciudad, usuario_id]
        );

        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT c.id, c.nombre, c.email, c.telefono, c.ciudad, c.usuario_id,
                    u.nombre as nombre_usuario, c.fecha_creacion
             FROM clubs c
             LEFT JOIN usuarios u ON c.usuario_id = u.id
             WHERE c.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT c.id, c.nombre, c.email, c.telefono, c.ciudad, c.usuario_id,
                    u.nombre as nombre_usuario, c.fecha_creacion
             FROM clubs c
             LEFT JOIN usuarios u ON c.usuario_id = u.id
             ORDER BY c.fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { nombre, email, telefono, ciudad } = datos;
        const result = await pool.query(
            `UPDATE clubs
             SET nombre = COALESCE($1, nombre),
                 email = COALESCE($2, email),
                 telefono = COALESCE($3, telefono),
                 ciudad = COALESCE($4, ciudad),
                 fecha_actualizacion = NOW()
             WHERE id = $5
             RETURNING id, nombre, email, telefono, ciudad, fecha_actualizacion`,
            [nombre, email, telefono, ciudad, id]
        );
        return result.rows[0];
    }

    static async obtenerPorUsuario(usuario_id) {
        const result = await pool.query(
            `SELECT id, nombre, email, telefono, ciudad, usuario_id, fecha_creacion
             FROM clubs
             WHERE usuario_id = $1`,
            [usuario_id]
        );
        return result.rows[0];
    }

    static async obtenerEquipos(club_id) {
        const result = await pool.query(
            `SELECT id, nombre, ciudad, cantidad_jugadores, fecha_creacion
             FROM equipos
             WHERE club_id = $1
             ORDER BY nombre`,
            [club_id]
        );
        return result.rows;
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM clubs WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM clubs');
        return parseInt(result.rows[0].total);
    }
}

export default Club;

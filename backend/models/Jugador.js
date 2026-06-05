import pool from '../config/database.js';

export class Jugador {
    static async crear(datos) {
        const { nombre, numero_camiseta, equipo_id, posicion, estado = true } = datos;

        const result = await pool.query(
            `INSERT INTO jugadores (nombre, numero_camiseta, equipo_id, posicion, estado, fecha_creacion)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING id, nombre, numero_camiseta, equipo_id, posicion, estado, fecha_creacion`,
            [nombre, numero_camiseta, equipo_id, posicion, estado]
        );

        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT j.id, j.nombre, j.numero_camiseta, j.equipo_id, j.posicion, j.estado,
                    e.nombre as nombre_equipo, e.club_id, j.fecha_creacion
             FROM jugadores j
             LEFT JOIN equipos e ON j.equipo_id = e.id
             WHERE j.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT j.id, j.nombre, j.numero_camiseta, j.equipo_id, j.posicion, j.estado,
                    e.nombre as nombre_equipo, j.fecha_creacion
             FROM jugadores j
             LEFT JOIN equipos e ON j.equipo_id = e.id
             ORDER BY j.fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async obtenerPorEquipo(equipo_id) {
        const result = await pool.query(
            `SELECT id, nombre, numero_camiseta, equipo_id, posicion, estado, fecha_creacion
             FROM jugadores
             WHERE equipo_id = $1
             ORDER BY numero_camiseta`,
            [equipo_id]
        );
        return result.rows;
    }

    static async obtenerPorPosicion(equipo_id, posicion) {
        const result = await pool.query(
            `SELECT id, nombre, numero_camiseta, equipo_id, posicion, estado, fecha_creacion
             FROM jugadores
             WHERE equipo_id = $1 AND posicion = $2
             ORDER BY numero_camiseta`,
            [equipo_id, posicion]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { nombre, numero_camiseta, posicion, estado } = datos;
        const result = await pool.query(
            `UPDATE jugadores
             SET nombre = COALESCE($1, nombre),
                 numero_camiseta = COALESCE($2, numero_camiseta),
                 posicion = COALESCE($3, posicion),
                 estado = COALESCE($4, estado),
                 fecha_actualizacion = NOW()
             WHERE id = $5
             RETURNING id, nombre, numero_camiseta, posicion, estado, fecha_actualizacion`,
            [nombre, numero_camiseta, posicion, estado, id]
        );
        return result.rows[0];
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM jugadores WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async contarPorEquipo(equipo_id) {
        const result = await pool.query(
            'SELECT COUNT(*) as total FROM jugadores WHERE equipo_id = $1',
            [equipo_id]
        );
        return parseInt(result.rows[0].total);
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM jugadores');
        return parseInt(result.rows[0].total);
    }
}

export default Jugador;

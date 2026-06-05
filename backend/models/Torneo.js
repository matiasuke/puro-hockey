import pool from '../config/database.js';

export class Torneo {
    static async crear(datos) {
        const { nombre, descripcion, estado = 'PENDIENTE', plan_id, fecha_inicio, fecha_fin } = datos;

        const result = await pool.query(
            `INSERT INTO torneos (nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin, fecha_creacion)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id, nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin, fecha_creacion`,
            [nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin]
        );

        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT id, nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin,
                    fecha_creacion, fecha_actualizacion
             FROM torneos WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT id, nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin,
                    fecha_creacion
             FROM torneos
             ORDER BY fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async obtenerPorEstado(estado, limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT id, nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin,
                    fecha_creacion
             FROM torneos
             WHERE estado = $1
             ORDER BY fecha_creacion DESC
             LIMIT $2 OFFSET $3`,
            [estado, limit, offset]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { nombre, descripcion, estado, fecha_inicio, fecha_fin } = datos;
        const result = await pool.query(
            `UPDATE torneos
             SET nombre = COALESCE($1, nombre),
                 descripcion = COALESCE($2, descripcion),
                 estado = COALESCE($3, estado),
                 fecha_inicio = COALESCE($4, fecha_inicio),
                 fecha_fin = COALESCE($5, fecha_fin),
                 fecha_actualizacion = NOW()
             WHERE id = $6
             RETURNING id, nombre, descripcion, estado, fecha_actualizacion`,
            [nombre, descripcion, estado, fecha_inicio, fecha_fin, id]
        );
        return result.rows[0];
    }

    static async cambiarEstado(id, nuevoEstado) {
        const result = await pool.query(
            `UPDATE torneos
             SET estado = $1, fecha_actualizacion = NOW()
             WHERE id = $2
             RETURNING id, nombre, estado, fecha_actualizacion`,
            [nuevoEstado, id]
        );
        return result.rows[0];
    }

    static async obtenerEquipos(torneo_id) {
        const result = await pool.query(
            `SELECT DISTINCT e.id, e.nombre, e.ciudad, COUNT(j.id) as cantidad_jugadores
             FROM equipos e
             LEFT JOIN jugadores j ON e.id = j.equipo_id
             WHERE e.id IN (
                SELECT DISTINCT equipo_id FROM asignaciones WHERE torneo_id = $1
             )
             GROUP BY e.id, e.nombre, e.ciudad
             ORDER BY e.nombre`,
            [torneo_id]
        );
        return result.rows;
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM torneos WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM torneos');
        return parseInt(result.rows[0].total);
    }
}

export default Torneo;

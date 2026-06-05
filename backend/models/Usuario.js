import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export class Usuario {
    static async crear(datos) {
        const { nombre, email, password, role = 'club', estado = true } = datos;
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO usuarios (nombre, email, password, role, estado, fecha_creacion)
             VALUES ($1, $2, $3, $4, $5, NOW())
             RETURNING id, nombre, email, role, estado, fecha_creacion`,
            [nombre, email, hashedPassword, role, estado]
        );

        return result.rows[0];
    }

    static async obtenerPorEmail(email) {
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    static async obtenerPorId(id) {
        const result = await pool.query(
            `SELECT id, nombre, email, role, estado, fecha_creacion, fecha_actualizacion
             FROM usuarios WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    static async obtenerTodos(limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT id, nombre, email, role, estado, fecha_creacion
             FROM usuarios
             ORDER BY fecha_creacion DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    }

    static async actualizar(id, datos) {
        const { nombre, email, role, estado } = datos;
        const result = await pool.query(
            `UPDATE usuarios
             SET nombre = COALESCE($1, nombre),
                 email = COALESCE($2, email),
                 role = COALESCE($3, role),
                 estado = COALESCE($4, estado),
                 fecha_actualizacion = NOW()
             WHERE id = $5
             RETURNING id, nombre, email, role, estado, fecha_actualizacion`,
            [nombre, email, role, estado, id]
        );
        return result.rows[0];
    }

    static async actualizarPassword(id, passwordAnterior, passwordNueva) {
        const usuario = await this.obtenerPorId(id);
        if (!usuario) throw new Error('Usuario no encontrado');

        const esValido = await bcrypt.compare(passwordAnterior, usuario.password);
        if (!esValido) throw new Error('Contraseña anterior incorrecta');

        const hashedPassword = await bcrypt.hash(passwordNueva, 10);
        const result = await pool.query(
            `UPDATE usuarios SET password = $1, fecha_actualizacion = NOW()
             WHERE id = $2
             RETURNING id, nombre, email, role`,
            [hashedPassword, id]
        );
        return result.rows[0];
    }

    static async verificarPassword(passwordIngresada, hashGuardado) {
        return bcrypt.compare(passwordIngresada, hashGuardado);
    }

    static async eliminar(id) {
        const result = await pool.query(
            'DELETE FROM usuarios WHERE id = $1 RETURNING id',
            [id]
        );
        return result.rows[0];
    }

    static async obtenerPorRole(role, limit = 50, offset = 0) {
        const result = await pool.query(
            `SELECT id, nombre, email, role, estado, fecha_creacion
             FROM usuarios
             WHERE role = $1
             ORDER BY fecha_creacion DESC
             LIMIT $2 OFFSET $3`,
            [role, limit, offset]
        );
        return result.rows;
    }

    static async contar() {
        const result = await pool.query('SELECT COUNT(*) as total FROM usuarios');
        return parseInt(result.rows[0].total);
    }
}

export default Usuario;

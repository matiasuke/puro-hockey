/**
 * PURO HOCKEY - Conexión a PostgreSQL
 * Inicializa la base de datos y crea tablas
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Crear pool de conexiones
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('localhost')
        ? false
        : { rejectUnauthorized: false }
});

// Manejo de errores de conexión
pool.on('error', (err) => {
    console.error('Error inesperado en pool:', err);
});

/**
 * Inicializar base de datos - Crear tablas si no existen
 */
export async function initializeDatabase() {
    // Verificar si DATABASE_URL está configurada
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️  DATABASE_URL no configurada. Ejecutando en modo DEMO sin persistencia.');
        console.warn('   Para usar la base de datos, configura DATABASE_URL en las variables de entorno.');
        return;
    }

    const client = await pool.connect();

    try {
        console.log('Inicializando base de datos...');

        // Tabla de usuarios
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                nombre VARCHAR(255) NOT NULL,
                rol VARCHAR(50) DEFAULT 'usuario',
                activo BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de torneos
        await client.query(`
            CREATE TABLE IF NOT EXISTS torneos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                descripcion TEXT,
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NOT NULL,
                ubicacion VARCHAR(255),
                max_equipos INTEGER DEFAULT 16,
                estado VARCHAR(50) DEFAULT 'planificado',
                organizador_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de equipos
        await client.query(`
            CREATE TABLE IF NOT EXISTS equipos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL,
                torneo_id INTEGER REFERENCES torneos(id),
                capitán_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tabla de partidos
        await client.query(`
            CREATE TABLE IF NOT EXISTS partidos (
                id SERIAL PRIMARY KEY,
                torneo_id INTEGER REFERENCES torneos(id),
                equipo1_id INTEGER REFERENCES equipos(id),
                equipo2_id INTEGER REFERENCES equipos(id),
                fecha_hora TIMESTAMP,
                estado VARCHAR(50) DEFAULT 'programado',
                resultado VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Base de datos inicializada correctamente');

        // Crear usuario admin si no existe
        const adminExists = await client.query(
            'SELECT * FROM users WHERE email = $1',
            ['admin@puro-hockey.com']
        );

        if (adminExists.rows.length === 0) {
            // Importar bcryptjs para hash
            const bcrypt = await import('bcryptjs');
            const hashedPassword = await bcrypt.default.hash('admin', 10);

            await client.query(
                `INSERT INTO users (email, password, nombre, rol)
                 VALUES ($1, $2, $3, $4)`,
                ['admin@puro-hockey.com', hashedPassword, 'Admin', 'admin']
            );

            console.log('✅ Usuario admin creado: admin@puro-hockey.com / admin');
        }

    } catch (error) {
        console.error('Error al inicializar base de datos:', error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Ejecutar consulta
 */
export async function query(text, params) {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('Error en consulta:', error);
        throw error;
    }
}

/**
 * Obtener un registro
 */
export async function getOne(text, params) {
    const result = await query(text, params);
    return result.rows[0];
}

/**
 * Obtener todos los registros
 */
export async function getAll(text, params) {
    const result = await query(text, params);
    return result.rows;
}

/**
 * Cerrar pool de conexiones
 */
export async function closePool() {
    await pool.end();
}

export default pool;

#!/usr/bin/env node

/**
 * Script de Seeds - PURO HOCKEY
 * Carga datos iniciales en la base de datos
 */

import db from '../config/database';
import bcrypt from 'bcryptjs';

// Colores para output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function seedDatabase() {
    log('\n🌱 ==========================================', 'blue');
    log('   CARGANDO DATOS INICIALES - PURO HOCKEY', 'blue');
    log('==========================================\n', 'blue');

    try {
        // Hash de contraseña por defecto
        const hashedPassword = await bcrypt.hash('password', 10);

        log('Cargando usuarios...', 'blue');

        // Insertar admin
        await db.query(
            `INSERT INTO usuarios (nombre, email, password, role, estado)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Admin', 'admin@example.com', hashedPassword, 'admin', true]
        );

        // Insertar club
        await db.query(
            `INSERT INTO usuarios (nombre, email, password, role, estado)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Club Ejemplo', 'club@example.com', hashedPassword, 'club', true]
        );

        // Insertar árbitro
        await db.query(
            `INSERT INTO usuarios (nombre, email, password, role, estado)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Árbitro Ejemplo', 'arbitro@example.com', hashedPassword, 'arbitro', true]
        );

        // Insertar mesa control
        await db.query(
            `INSERT INTO usuarios (nombre, email, password, role, estado)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Mesa Control', 'mesa@example.com', hashedPassword, 'mesa_control', true]
        );

        log('✅ Usuarios cargados\n', 'green');

        log('Cargando clubs...', 'blue');

        // Insertar un club
        const clubResult = await db.query(
            `INSERT INTO clubs (nombre, email, telefono, ciudad)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (email) DO NOTHING
             RETURNING id`,
            ['Club Ejemplo', 'club@example.com', '+54 123 456 7890', 'Buenos Aires']
        );

        const clubId = clubResult.rows[0]?.id;
        log('✅ Clubs cargados\n', 'green');

        if (clubId) {
            log('Cargando torneos...', 'blue');

            // Insertar torneos
            await db.query(
                `INSERT INTO torneos (nombre, descripcion, estado, plan_id)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (nombre) DO NOTHING`,
                ['Torneo Apertura 2025', 'Primer torneo del año', 'ACTIVO', 'apertura']
            );

            await db.query(
                `INSERT INTO torneos (nombre, descripcion, estado, plan_id)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (nombre) DO NOTHING`,
                ['Torneo Clausura 2025', 'Segundo torneo del año', 'PENDIENTE_PAGO', 'clausura']
            );

            log('✅ Torneos cargados\n', 'green');

            log('Cargando equipos...', 'blue');

            // Insertar equipos
            const equipoResult = await db.query(
                `INSERT INTO equipos (nombre, club_id, ciudad)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (nombre) DO NOTHING
                 RETURNING id`,
                ['Equipo Ejemplo A', clubId, 'Buenos Aires']
            );

            const equipoId = equipoResult.rows[0]?.id;
            log('✅ Equipos cargados\n', 'green');

            if (equipoId) {
                log('Cargando jugadores...', 'blue');

                // Insertar jugadores
                for (let i = 1; i <= 10; i++) {
                    await db.query(
                        `INSERT INTO jugadores (nombre, numero_camiseta, equipo_id, posicion)
                         VALUES ($1, $2, $3, $4)
                         ON CONFLICT (numero_camiseta, equipo_id) DO NOTHING`,
                        [`Jugador ${i}`, i, equipoId, ['portero', 'defensor', 'centrocampista', 'delantero'][i % 4]]
                    );
                }

                log('✅ Jugadores cargados\n', 'green');
            }
        }

        log('╔════════════════════════════════════════════╗', 'green');
        log('║  ✅ SEEDS CARGADOS EXITOSAMENTE ✅        ║', 'green');
        log('╚════════════════════════════════════════════╝\n', 'green');

        log('📋 Datos cargados:', 'blue');
        log('   Usuarios:     4 (admin, club, arbitro, mesa_control)', 'blue');
        log('   Clubs:        1', 'blue');
        log('   Torneos:      2', 'blue');
        log('   Equipos:      1', 'blue');
        log('   Jugadores:    10\n', 'blue');

        log('🔑 Credenciales de prueba:', 'yellow');
        log('   Email:    admin@example.com', 'yellow');
        log('   Password: password\n', 'yellow');

        process.exit(0);
    } catch (error) {
        log(`\n❌ Error: ${error.message}\n`, 'red');
        console.error(error);
        process.exit(1);
    } finally {
        await db.end();
    }
}

// Ejecutar
seedDatabase();

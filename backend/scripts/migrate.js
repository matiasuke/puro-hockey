#!/usr/bin/env node

/**
 * Script de Migraciones - PURO HOCKEY
 * Ejecuta todas las migraciones SQL contra la base de datos
 */

import fs from 'fs';
import path from 'path';
import db from '../config/database';

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

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '../database/migrations');

    log('\n🚀 ==========================================', 'blue');
    log('   EJECUTANDO MIGRACIONES - PURO HOCKEY', 'blue');
    log('==========================================\n', 'blue');

    try {
        // Obtener archivos de migración
        const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql'));

        if (files.length === 0) {
            log('⚠️  No hay migraciones para ejecutar', 'yellow');
            process.exit(0);
        }

        log(`📋 Encontradas ${files.length} migraciones\n`, 'blue');

        // Ejecutar cada migración
        for (const file of files) {
            const filepath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filepath, 'utf8');

            try {
                log(`Ejecutando: ${file}...`, 'blue');
                await db.query(sql);
                log(`✅ ${file} completado\n`, 'green');
            } catch (error) {
                // Si el error es porque ya existe (código 42P07), ignorar
                if (error.code === '42P07') {
                    log(`✅ ${file} (ya existe, saltado)\n`, 'yellow');
                } else {
                    log(`❌ Error en ${file}: ${error.message}\n`, 'red');
                    throw error;
                }
            }
        }

        log('╔════════════════════════════════════════════╗', 'green');
        log('║  ✅ TODAS LAS MIGRACIONES COMPLETADAS ✅  ║', 'green');
        log('╚════════════════════════════════════════════╝\n', 'green');

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
runMigrations();

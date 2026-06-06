/**
 * PURO HOCKEY - Base de datos en memoria para DEMO
 * Se usa cuando DATABASE_URL no está configurada
 */

import bcryptjs from 'bcryptjs';

// Almacenamiento en memoria
let users = [];
let torneos = [];
let equipos = [];
let partidos = [];

// Inicializar con usuario admin
async function initializeDemoDatabase() {
    const hashedPassword = await bcryptjs.hash('admin', 10);

    users = [
        {
            id: 1,
            email: 'admin@puro-hockey.com',
            password: hashedPassword,
            nombre: 'Admin',
            rol: 'admin',
            activo: true,
            created_at: new Date(),
            updated_at: new Date()
        },
        {
            id: 2,
            email: 'friomusical@gmail.com',
            password: hashedPassword,
            nombre: 'Usuario Demo',
            rol: 'usuario',
            activo: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    ];

    console.log('✅ Base de datos DEMO inicializada (en memoria)');
    console.log('   - Usuario admin: admin@puro-hockey.com / admin');
    console.log('   - Usuario demo: friomusical@gmail.com / admin');
}

// Simulación de query
export async function query(text, params) {
    // Simulación muy básica para INSERT/UPDATE/SELECT
    if (text.includes('INSERT INTO users')) {
        const [email, password, nombre, rol] = params;
        const newUser = {
            id: users.length + 1,
            email,
            password,
            nombre,
            rol,
            activo: true,
            created_at: new Date(),
            updated_at: new Date()
        };
        users.push(newUser);
        return { rows: [newUser] };
    }

    if (text.includes('INSERT INTO torneos')) {
        const [nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, max_equipos, organizador_id] = params;
        const newTorneo = {
            id: torneos.length + 1,
            nombre,
            descripcion,
            fecha_inicio,
            fecha_fin,
            ubicacion,
            max_equipos,
            estado: 'planificado',
            organizador_id,
            created_at: new Date(),
            updated_at: new Date()
        };
        torneos.push(newTorneo);
        return { rows: [newTorneo] };
    }

    return { rows: [] };
}

// Simulación de getOne
export async function getOne(text, params) {
    if (text.includes('FROM users')) {
        const email = params[0];
        return users.find(u => u.email === email && u.activo === true);
    }

    if (text.includes('FROM torneos')) {
        const id = params[0];
        const torneo = torneos.find(t => t.id === parseInt(id));
        if (torneo) {
            const organizador = users.find(u => u.id === torneo.organizador_id);
            return {
                ...torneo,
                organizador: organizador?.nombre || 'Desconocido'
            };
        }
    }

    return null;
}

// Simulación de getAll
export async function getAll(text, params) {
    if (text.includes('FROM torneos')) {
        return torneos.map(t => {
            const organizador = users.find(u => u.id === t.organizador_id);
            return {
                ...t,
                organizador: organizador?.nombre || 'Desconocido'
            };
        }).sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio));
    }

    return [];
}

export { initializeDemoDatabase };

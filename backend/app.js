/**
 * PURO HOCKEY - Backend Completo con Autenticación
 * API REST + WebSockets + JWT Authentication
 * v1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { initializeDatabase, query, getOne, getAll } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'puro-hockey-secret-key-2024';

// ============================================================================
// MIDDLEWARE
// ============================================================================

app.use(cors({
    origin: process.env.CORS_ORIGIN || ['https://puro-hockey.vercel.app', 'http://localhost:3000', '*'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware de autenticación JWT
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado',
            error: 'NO_TOKEN'
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            error: 'INVALID_TOKEN'
        });
    }
}

/**
 * Generar JWT
 */
function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            nombre: user.nombre,
            rol: user.rol
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// ============================================================================
// RUTAS PÚBLICAS
// ============================================================================

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        service: 'puro-hockey-backend'
    });
});

// API Version
app.get('/api/version', (req, res) => {
    res.json({
        version: '1.0.0',
        name: 'PURO HOCKEY API',
        backend: 'Node.js Express + PostgreSQL',
        authentication: 'JWT'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🏆 PURO HOCKEY API v1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            version: '/api/version',
            auth: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                check: 'GET /api/auth/check'
            },
            torneos: 'GET /api/torneos',
            status: '/status'
        }
    });
});

// Status endpoint
app.get('/status', (req, res) => {
    res.json({
        status: 'active',
        service: 'puro-hockey-backend',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        node_version: process.version
    });
});

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================

/**
 * Login
 * POST /api/auth/login
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar entrada
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const user = await getOne(
            'SELECT id, email, password, nombre, rol FROM users WHERE email = $1 AND activo = true',
            [email]
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado o inactivo'
            });
        }

        // Verificar contraseña
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        // Generar token
        const token = generateToken(user);

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                email: user.email,
                nombre: user.nombre,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

/**
 * Registro
 * POST /api/auth/register
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, nombre } = req.body;

        // Validar entrada
        if (!email || !password || !nombre) {
            return res.status(400).json({
                success: false,
                message: 'Email, contraseña y nombre son requeridos'
            });
        }

        // Verificar si usuario ya existe
        const existingUser = await getOne(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        // Hash de contraseña
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Crear usuario
        const result = await query(
            'INSERT INTO users (email, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, rol',
            [email, hashedPassword, nombre, 'usuario']
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                nombre: newUser.nombre,
                rol: newUser.rol
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

/**
 * Verificar autenticación
 * GET /api/auth/check
 */
app.get('/api/auth/check', authMiddleware, (req, res) => {
    res.json({
        success: true,
        authenticated: true,
        user: req.user
    });
});

// ============================================================================
// RUTAS DE TORNEOS (Protegidas)
// ============================================================================

/**
 * Obtener todos los torneos
 * GET /api/torneos
 */
app.get('/api/torneos', authMiddleware, async (req, res) => {
    try {
        const torneos = await getAll(
            `SELECT t.id, t.nombre, t.descripcion, t.fecha_inicio, t.fecha_fin,
                    t.ubicacion, t.max_equipos, t.estado, u.nombre as organizador
             FROM torneos t
             LEFT JOIN users u ON t.organizador_id = u.id
             ORDER BY t.fecha_inicio DESC`,
            []
        );

        res.json({
            success: true,
            data: torneos,
            total: torneos.length
        });
    } catch (error) {
        console.error('Error al obtener torneos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener torneos',
            error: error.message
        });
    }
});

/**
 * Crear torneo
 * POST /api/torneos
 */
app.post('/api/torneos', authMiddleware, async (req, res) => {
    try {
        const { nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, max_equipos } = req.body;

        if (!nombre || !fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, fecha inicio y fecha fin son requeridos'
            });
        }

        const result = await query(
            `INSERT INTO torneos (nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, max_equipos, organizador_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [nombre, descripcion, fecha_inicio, fecha_fin, ubicacion, max_equipos || 16, req.user.id]
        );

        res.status(201).json({
            success: true,
            message: 'Torneo creado exitosamente',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error al crear torneo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear torneo',
            error: error.message
        });
    }
});

/**
 * Obtener torneo por ID
 * GET /api/torneos/:id
 */
app.get('/api/torneos/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        const torneo = await getOne(
            `SELECT t.*, u.nombre as organizador
             FROM torneos t
             LEFT JOIN users u ON t.organizador_id = u.id
             WHERE t.id = $1`,
            [id]
        );

        if (!torneo) {
            return res.status(404).json({
                success: false,
                message: 'Torneo no encontrado'
            });
        }

        res.json({
            success: true,
            data: torneo
        });

    } catch (error) {
        console.error('Error al obtener torneo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener torneo',
            error: error.message
        });
    }
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.path,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const startServer = async () => {
    try {
        // Inicializar base de datos
        await initializeDatabase();

        // Iniciar servidor
        const server = app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('🏆 PURO HOCKEY Backend v1.0.0');
            console.log('✅ Servidor ejecutándose en puerto', PORT);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');
            console.log('📍 Endpoints principales:');
            console.log('   Health Check:      GET  /health');
            console.log('   Login:             POST /api/auth/login');
            console.log('   Register:          POST /api/auth/register');
            console.log('   Check Auth:        GET  /api/auth/check');
            console.log('   Torneos:           GET  /api/torneos');
            console.log('   Crear Torneo:      POST /api/torneos');
            console.log('');
            console.log('🔐 Credenciales demo:');
            console.log('   Email: admin@puro-hockey.com');
            console.log('   Pass:  admin');
            console.log('');
            console.log('🌍 CORS Origin:', process.env.CORS_ORIGIN || 'Multiple');
            console.log('📝 Environment:', process.env.NODE_ENV || 'development');
            console.log('═══════════════════════════════════════════════════════════');
            console.log('');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM recibido, cerrando servidor...');
            server.close(() => {
                console.log('Servidor cerrado');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

// Iniciar si no es un módulo importado
startServer();

export default app;

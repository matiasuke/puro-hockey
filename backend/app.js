/**
 * Servidor Principal - PURO HOCKEY
 * API REST + WebSockets
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import winston from 'winston';

// Cargar variables de entorno
dotenv.config();

// ============================================================================
// CONFIGURACIÓN DE LOGGER
// ============================================================================
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

// ============================================================================
// CONFIGURACIÓN DE EXPRESS
// ============================================================================
const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    },
});

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// RUTAS BÁSICAS
// ============================================================================

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Version
app.get('/api/version', (req, res) => {
    res.json({ version: '1.0.0', name: 'PURO HOCKEY' });
});

// Root
app.get('/', (req, res) => {
    res.json({
        message: '🏆 PURO HOCKEY API v1.0.0',
        documentation: '/api/docs',
        health: '/health',
        endpoints: {
            auth: '/api/auth',
            torneos: '/api/torneos',
            equipos: '/api/equipos',
            jugadores: '/api/jugadores',
            partidos: '/api/partidos',
            usuarios: '/api/usuarios',
            asignaciones: '/api/asignaciones',
            pagos: '/api/pagos',
        },
    });
});

// ============================================================================
// IMPORTAR RUTAS
// ============================================================================
import authRoutes from './routes/auth.js';
import usuariosRoutes from './routes/usuarios.js';
import clubsRoutes from './routes/clubs.js';
import torneosRoutes from './routes/torneos.js';
import equiposRoutes from './routes/equipos.js';
import jugadoresRoutes from './routes/jugadores.js';
import asignacionesRoutes from './routes/asignaciones.js';
import pagosRoutes from './routes/pagos.js';
import configRoutes from './routes/config.js';

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/torneos', torneosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/jugadores', jugadoresRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/config', configRoutes);

// ============================================================================
// WEBSOCKETS
// ============================================================================
io.on('connection', (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`);

    // Eventos de ejemplo
    socket.on('mensaje', (data) => {
        logger.info(`Mensaje recibido: ${data}`);
        io.emit('mensaje', data);
    });

    socket.on('disconnect', () => {
        logger.info(`Cliente desconectado: ${socket.id}`);
    });
});

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.path,
    });
});

// Error handling
app.use((err, req, res, next) => {
    logger.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { error: err }),
    });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

httpServer.listen(PORT, HOST, () => {
    logger.info(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
    logger.info(`📊 Modo: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 CORS: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Servidor apagándose...');
    httpServer.close(() => {
        logger.info('Servidor apagado');
        process.exit(0);
    });
});

export default app;

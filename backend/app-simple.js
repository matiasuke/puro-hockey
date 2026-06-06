/**
 * PURO HOCKEY - Backend Simplificado
 * API REST + WebSockets
 * v1.0.0
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// RUTAS BÁSICAS
// ============================================================================

// Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Version
app.get('/api/version', (req, res) => {
    res.json({
        version: '1.0.0',
        name: 'PURO HOCKEY API',
        backend: 'Node.js Express'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🏆 PURO HOCKEY API v1.0.0',
        status: 'running',
        documentation: '/api/docs',
        health: '/health',
        version: '/api/version'
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
// RUTAS PLACEHOLDER (para demostración)
// ============================================================================

app.get('/api/torneos', (req, res) => {
    res.json({
        success: true,
        data: [],
        message: 'Backend operativo - próximamente más endpoints'
    });
});

app.get('/api/auth/check', (req, res) => {
    res.json({
        success: true,
        authenticated: false,
        message: 'Backend funcionando correctamente'
    });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint no encontrado',
        path: req.path
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'production' ? undefined : err.message
    });
});

// ============================================================================
// INICIAR SERVIDOR
// ============================================================================

const server = app.listen(PORT, () => {
    console.log(`🏆 PURO HOCKEY Backend v1.0.0`);
    console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
    console.log(`📝 Node Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

export default app;

import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/perfil', verifyToken, authController.obtenerPerfil);
router.put('/perfil', verifyToken, authController.actualizarPerfil);
router.put('/cambiar-password', verifyToken, authController.cambiarPassword);

export default router;

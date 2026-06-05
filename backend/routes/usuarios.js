import express from 'express';
import * as usuariosController from '../controllers/usuariosController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los usuarios (solo admin)
router.get('/', verifyToken, verifyRole('admin'), usuariosController.obtenerTodos);

// Obtener usuarios por rol (solo admin)
router.get('/rol/:role', verifyToken, verifyRole('admin'), usuariosController.obtenerPorRole);

// Obtener usuario por ID
router.get('/:id', verifyToken, usuariosController.obtenerPorId);

// Crear nuevo usuario (solo admin)
router.post('/', verifyToken, verifyRole('admin'), usuariosController.crear);

// Actualizar usuario (solo admin o el mismo usuario)
router.put('/:id', verifyToken, usuariosController.actualizar);

// Eliminar usuario (solo admin)
router.delete('/:id', verifyToken, verifyRole('admin'), usuariosController.eliminar);

export default router;

import express from 'express';
import * as clubsController from '../controllers/clubsController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los clubs
router.get('/', verifyToken, clubsController.obtenerTodos);

// Obtener club por ID
router.get('/:id', verifyToken, clubsController.obtenerPorId);

// Obtener club por usuario
router.get('/usuario/:usuario_id', verifyToken, clubsController.obtenerPorUsuario);

// Obtener equipos de un club
router.get('/:id/equipos', verifyToken, clubsController.obtenerEquipos);

// Crear nuevo club (solo admin)
router.post('/', verifyToken, verifyRole('admin'), clubsController.crear);

// Actualizar club (solo admin o el club dueño)
router.put('/:id', verifyToken, clubsController.actualizar);

// Eliminar club (solo admin)
router.delete('/:id', verifyToken, verifyRole('admin'), clubsController.eliminar);

export default router;

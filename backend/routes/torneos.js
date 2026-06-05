import express from 'express';
import * as torneosController from '../controllers/torneosController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los torneos
router.get('/', verifyToken, torneosController.obtenerTodos);

// Obtener torneos por estado
router.get('/estado/:estado', verifyToken, torneosController.obtenerPorEstado);

// Obtener torneo por ID
router.get('/:id', verifyToken, torneosController.obtenerPorId);

// Obtener equipos de un torneo
router.get('/:id/equipos', verifyToken, torneosController.obtenerEquipos);

// Crear nuevo torneo (solo admin)
router.post('/', verifyToken, verifyRole('admin'), torneosController.crear);

// Actualizar torneo (solo admin)
router.put('/:id', verifyToken, verifyRole('admin'), torneosController.actualizar);

// Cambiar estado del torneo (solo admin)
router.patch('/:id/estado', verifyToken, verifyRole('admin'), torneosController.cambiarEstado);

// Eliminar torneo (solo admin)
router.delete('/:id', verifyToken, verifyRole('admin'), torneosController.eliminar);

export default router;

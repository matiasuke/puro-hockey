import express from 'express';
import * as equiposController from '../controllers/equiposController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los equipos
router.get('/', verifyToken, equiposController.obtenerTodos);

// Obtener equipo por ID
router.get('/:id', verifyToken, equiposController.obtenerPorId);

// Obtener equipos por club
router.get('/club/:club_id', verifyToken, equiposController.obtenerPorClub);

// Obtener jugadores de un equipo
router.get('/:id/jugadores', verifyToken, equiposController.obtenerJugadores);

// Crear nuevo equipo (club o admin)
router.post('/', verifyToken, verifyRole('club', 'admin'), equiposController.crear);

// Actualizar equipo (club o admin)
router.put('/:id', verifyToken, verifyRole('club', 'admin'), equiposController.actualizar);

// Eliminar equipo (club o admin)
router.delete('/:id', verifyToken, verifyRole('club', 'admin'), equiposController.eliminar);

export default router;

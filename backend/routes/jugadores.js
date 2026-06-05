import express from 'express';
import * as jugadoresController from '../controllers/jugadoresController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los jugadores
router.get('/', verifyToken, jugadoresController.obtenerTodos);

// Obtener jugador por ID
router.get('/:id', verifyToken, jugadoresController.obtenerPorId);

// Obtener jugadores por equipo
router.get('/equipo/:equipo_id', verifyToken, jugadoresController.obtenerPorEquipo);

// Obtener jugadores por posición
router.get('/equipo/:equipo_id/posicion/:posicion', verifyToken, jugadoresController.obtenerPorPosicion);

// Crear nuevo jugador (club o admin)
router.post('/', verifyToken, verifyRole('club', 'admin'), jugadoresController.crear);

// Actualizar jugador (club o admin)
router.put('/:id', verifyToken, verifyRole('club', 'admin'), jugadoresController.actualizar);

// Eliminar jugador (club o admin)
router.delete('/:id', verifyToken, verifyRole('club', 'admin'), jugadoresController.eliminar);

export default router;

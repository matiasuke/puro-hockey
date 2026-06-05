import express from 'express';
import * as asignacionesController from '../controllers/asignacionesController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las asignaciones
router.get('/', verifyToken, asignacionesController.obtenerTodos);

// Obtener asignación por ID
router.get('/:id', verifyToken, asignacionesController.obtenerPorId);

// Obtener asignaciones por torneo
router.get('/torneo/:torneo_id', verifyToken, asignacionesController.obtenerPorTorneo);

// Obtener asignaciones por club
router.get('/club/:club_id', verifyToken, asignacionesController.obtenerPorClub);

// Obtener asignaciones por equipo
router.get('/equipo/:equipo_id', verifyToken, asignacionesController.obtenerPorEquipo);

// Crear nueva asignación (club o admin)
router.post('/', verifyToken, verifyRole('club', 'admin'), asignacionesController.crear);

// Actualizar asignación (admin)
router.put('/:id', verifyToken, verifyRole('admin'), asignacionesController.actualizar);

// Eliminar asignación (admin)
router.delete('/:id', verifyToken, verifyRole('admin'), asignacionesController.eliminar);

export default router;

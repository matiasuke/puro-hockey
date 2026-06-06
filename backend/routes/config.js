/**
 * Rutas de Configuración
 * Gestiona los endpoints para configurar la plataforma
 */

import express from 'express';
import configController from '../controllers/configController.js';
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/config
 * Obtener configuración actual (público)
 */
router.get('/', configController.getConfig);

/**
 * GET /api/config/planes
 * Obtener planes de pago (público)
 */
router.get('/planes', configController.getPlanes);

/**
 * GET /api/config/bank-info
 * Obtener datos bancarios (público)
 */
router.get('/bank-info', configController.getBankInfo);

/**
 * PUT /api/config/planes
 * Actualizar planes de pago (admin)
 * Body: {
 *   planes: Array<{
 *     id: string,
 *     nombre: string,
 *     duracion: string,
 *     meses: number,
 *     precio: number,
 *     descripcion: string,
 *     caracteristicas: string[]
 *   }>
 * }
 */
router.put('/planes', verifyToken, verifyRole(['admin']), configController.updatePlanes);

/**
 * PUT /api/config/bank-info
 * Actualizar datos bancarios (admin)
 * Body: {
 *   banco: string,
 *   cuenta: string,
 *   cbu: string,
 *   alias?: string,
 *   titular: string,
 *   cuit?: string
 * }
 */
router.put('/bank-info', verifyToken, verifyRole(['admin']), configController.updateBankInfo);

/**
 * POST /api/config/reset
 * Resetear configuración a valores por defecto (admin)
 */
router.post('/reset', verifyToken, verifyRole(['admin']), configController.resetConfig);

export default router;

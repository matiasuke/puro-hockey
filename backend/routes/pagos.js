/**
 * Rutas de Pagos
 * Gestiona todos los endpoints relacionados con pagos por transferencia
 */

const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');
const { verifyToken, verifyRole } = require('../middleware/auth');

/**
 * Rutas públicas (requieren autenticación)
 */

/**
 * GET /api/pagos
 * Obtener todos los pagos (admin) o propios (club)
 * Query params: estado, torneo_id
 */
router.get('/', verifyToken, pagosController.obtenerTodos);

/**
 * GET /api/pagos/pendientes
 * Obtener pagos pendientes de confirmación (admin)
 */
router.get('/pendientes', verifyToken, verifyRole(['admin']), pagosController.obtenerPendientes);

/**
 * GET /api/pagos/torneo/:torneoId
 * Obtener pagos de un torneo específico
 */
router.get('/torneo/:torneoId', verifyToken, pagosController.obtenerPorTorneo);

/**
 * GET /api/pagos/:id
 * Obtener un pago específico
 */
router.get('/:id', verifyToken, pagosController.obtenerPorId);

/**
 * POST /api/pagos
 * Crear un nuevo pago (club registra su comprobante)
 * Body: {
 *   torneo_id: string,
 *   plan_id: string (expres, clausura, apertura, anual),
 *   numero_referencia: string,
 *   fecha_transferencia: string (YYYY-MM-DD),
 *   comprobante_url: string (opcional)
 * }
 */
router.post('/', verifyToken, verifyRole(['club']), pagosController.crear);

/**
 * PUT /api/pagos/:id/confirmar
 * Confirmar un pago (admin)
 * Body: {
 *   notas?: string
 * }
 */
router.put('/:id/confirmar', verifyToken, verifyRole(['admin']), pagosController.confirmar);

/**
 * PUT /api/pagos/:id/rechazar
 * Rechazar un pago (admin)
 * Body: {
 *   motivo: string (opcional)
 * }
 */
router.put('/:id/rechazar', verifyToken, verifyRole(['admin']), pagosController.rechazar);

/**
 * DELETE /api/pagos/:id
 * Eliminar un pago (admin)
 */
router.delete('/:id', verifyToken, verifyRole(['admin']), pagosController.eliminar);

module.exports = router;

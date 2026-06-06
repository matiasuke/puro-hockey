/**
 * Controlador de Pagos
 * Gestiona las operaciones de pagos por transferencia
 */

import Pago from '../models/Pago.js';
import { PAYMENT_STATUS, TORNEO_STATUS } from '../constants/paymentStatus.js';

/**
 * GET /api/pagos
 * Obtener todos los pagos (admin)
 * Filtros: estado, torneo_id
 */
const obtenerTodos = async (req, res) => {
  try {
    const { estado, torneo_id } = req.query;

    const filtros = {};
    if (estado) filtros.estado = estado;
    if (torneo_id) filtros.torneo_id = torneo_id;

    const pagos = await Pago.obtenerTodos(filtros);

    res.json({
      success: true,
      data: pagos,
      count: pagos.length,
    });
  } catch (error) {
    console.error('Error en obtenerTodos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos',
      error: error.message,
    });
  }
};

/**
 * GET /api/pagos/pendientes
 * Obtener pagos pendientes de confirmación (admin)
 */
const obtenerPendientes = async (req, res) => {
  try {
    const pagos = await Pago.obtenerPendientes();

    res.json({
      success: true,
      data: pagos,
      count: pagos.length,
    });
  } catch (error) {
    console.error('Error en obtenerPendientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos pendientes',
      error: error.message,
    });
  }
};

/**
 * GET /api/pagos/:id
 * Obtener un pago específico
 */
const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const pago = await Pago.obtenerPorId(id);

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado',
      });
    }

    res.json({
      success: true,
      data: pago,
    });
  } catch (error) {
    console.error('Error en obtenerPorId:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pago',
      error: error.message,
    });
  }
};

/**
 * GET /api/pagos/torneo/:torneoId
 * Obtener pagos de un torneo específico
 */
const obtenerPorTorneo = async (req, res) => {
  try {
    const { torneoId } = req.params;

    const pagos = await Pago.obtenerPorTorneo(torneoId);

    res.json({
      success: true,
      data: pagos,
      count: pagos.length,
    });
  } catch (error) {
    console.error('Error en obtenerPorTorneo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pagos del torneo',
      error: error.message,
    });
  }
};

/**
 * POST /api/pagos
 * Crear un nuevo pago (club registra su transferencia)
 */
const crear = async (req, res) => {
  try {
    const { torneo_id, plan_id, numero_referencia, fecha_transferencia, comprobante_url } =
      req.body;
    const club_id = req.user.id; // Del token JWT

    // Validaciones
    if (!torneo_id || !plan_id || !numero_referencia || !fecha_transferencia) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos',
      });
    }

    const pago = await Pago.crear({
      torneo_id,
      plan_id,
      numero_referencia,
      fecha_transferencia,
      comprobante_url,
      club_id,
    });

    res.status(201).json({
      success: true,
      message: 'Pago registrado correctamente. Pendiente de confirmación.',
      data: pago,
    });
  } catch (error) {
    console.error('Error en crear:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear pago',
      error: error.message,
    });
  }
};

/**
 * PUT /api/pagos/:id/confirmar
 * Confirmar un pago y habilitar el torneo (admin)
 */
const confirmar = async (req, res) => {
  try {
    const { id } = req.params;
    const { notas } = req.body;

    // Verificar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden confirmar pagos',
      });
    }

    const pago = await Pago.confirmar(id, notas || '');

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Pago confirmado. Torneo habilitado.',
      data: pago,
    });
  } catch (error) {
    console.error('Error en confirmar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al confirmar pago',
      error: error.message,
    });
  }
};

/**
 * PUT /api/pagos/:id/rechazar
 * Rechazar un pago (admin)
 */
const rechazar = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;

    // Verificar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden rechazar pagos',
      });
    }

    const pago = await Pago.rechazar(id, motivo || '');

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Pago rechazado',
      data: pago,
    });
  } catch (error) {
    console.error('Error en rechazar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar pago',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/pagos/:id
 * Eliminar un pago (solo admin)
 */
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden eliminar pagos',
      });
    }

    const pago = await Pago.eliminar(id);

    if (!pago) {
      return res.status(404).json({
        success: false,
        message: 'Pago no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Pago eliminado',
      data: pago,
    });
  } catch (error) {
    console.error('Error en eliminar:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar pago',
      error: error.message,
    });
  }
};

export default {
  obtenerTodos,
  obtenerPendientes,
  obtenerPorId,
  obtenerPorTorneo,
  crear,
  confirmar,
  rechazar,
  eliminar,
};

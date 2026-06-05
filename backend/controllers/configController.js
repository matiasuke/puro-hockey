/**
 * Controlador de Configuración
 * Gestiona la configuración global de la plataforma (planes de pago, datos bancarios, etc.)
 */

const db = require('../config/database');
const { PRICING_PLANS, BANK_INFO } = require('../data/pricingPlans');

/**
 * GET /api/config
 * Obtener configuración actual
 */
exports.getConfig = async (req, res) => {
  try {
    // Obtener de la BD si existe, si no usar defaults
    const result = await db.query(
      `SELECT planes, banco_info, fecha_actualizacion FROM config LIMIT 1`
    );

    if (result.rows.length > 0) {
      const config = result.rows[0];
      return res.json({
        success: true,
        data: {
          planes: config.planes || PRICING_PLANS,
          banco_info: config.banco_info || BANK_INFO,
          fecha_actualizacion: config.fecha_actualizacion,
        },
      });
    }

    // Si no existe, crear con valores por defecto
    res.json({
      success: true,
      data: {
        planes: PRICING_PLANS,
        banco_info: BANK_INFO,
        fecha_actualizacion: new Date(),
      },
    });
  } catch (error) {
    console.error('Error en getConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener configuración',
      error: error.message,
    });
  }
};

/**
 * GET /api/config/planes
 * Obtener solo los planes de pago
 */
exports.getPlanes = async (req, res) => {
  try {
    const result = await db.query(`SELECT planes FROM config LIMIT 1`);

    const planes = result.rows.length > 0 ? result.rows[0].planes : PRICING_PLANS;

    res.json({
      success: true,
      data: planes,
    });
  } catch (error) {
    console.error('Error en getPlanes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener planes',
      error: error.message,
    });
  }
};

/**
 * GET /api/config/bank-info
 * Obtener solo datos bancarios
 */
exports.getBankInfo = async (req, res) => {
  try {
    const result = await db.query(`SELECT banco_info FROM config LIMIT 1`);

    const bankInfo = result.rows.length > 0 ? result.rows[0].banco_info : BANK_INFO;

    res.json({
      success: true,
      data: bankInfo,
    });
  } catch (error) {
    console.error('Error en getBankInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos bancarios',
      error: error.message,
    });
  }
};

/**
 * PUT /api/config/planes
 * Actualizar planes de pago (admin)
 */
exports.updatePlanes = async (req, res) => {
  try {
    const { planes } = req.body;

    if (!Array.isArray(planes)) {
      return res.status(400).json({
        success: false,
        message: 'Los planes deben ser un array',
      });
    }

    // Validar que todos los planes tengan los campos requeridos
    const planesValidos = planes.every(
      (p) => p.id && p.nombre && p.precio && typeof p.precio === 'number'
    );

    if (!planesValidos) {
      return res.status(400).json({
        success: false,
        message: 'Planes con formato inválido',
      });
    }

    // Verificar si existe config
    const existe = await db.query(`SELECT id FROM config LIMIT 1`);

    if (existe.rows.length > 0) {
      // Actualizar
      await db.query(
        `UPDATE config
        SET planes = $1, fecha_actualizacion = NOW()`,
        [JSON.stringify(planes)]
      );
    } else {
      // Crear
      await db.query(
        `INSERT INTO config (planes, banco_info, fecha_actualizacion)
        VALUES ($1, $2, NOW())`,
        [JSON.stringify(planes), JSON.stringify(BANK_INFO)]
      );
    }

    res.json({
      success: true,
      message: 'Planes actualizados correctamente',
      data: planes,
    });
  } catch (error) {
    console.error('Error en updatePlanes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar planes',
      error: error.message,
    });
  }
};

/**
 * PUT /api/config/bank-info
 * Actualizar datos bancarios (admin)
 */
exports.updateBankInfo = async (req, res) => {
  try {
    const { banco, cuenta, cbu, alias, titular, cuit } = req.body;

    // Validar campos requeridos
    if (!banco || !cuenta || !cbu || !titular) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos (banco, cuenta, cbu, titular)',
      });
    }

    const bankInfo = {
      banco,
      cuenta,
      cbu,
      alias: alias || '',
      titular,
      cuit: cuit || '',
    };

    // Verificar si existe config
    const existe = await db.query(`SELECT id FROM config LIMIT 1`);

    if (existe.rows.length > 0) {
      // Actualizar
      await db.query(
        `UPDATE config
        SET banco_info = $1, fecha_actualizacion = NOW()`,
        [JSON.stringify(bankInfo)]
      );
    } else {
      // Crear
      await db.query(
        `INSERT INTO config (planes, banco_info, fecha_actualizacion)
        VALUES ($1, $2, NOW())`,
        [JSON.stringify(PRICING_PLANS), JSON.stringify(bankInfo)]
      );
    }

    res.json({
      success: true,
      message: 'Datos bancarios actualizados correctamente',
      data: bankInfo,
    });
  } catch (error) {
    console.error('Error en updateBankInfo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar datos bancarios',
      error: error.message,
    });
  }
};

/**
 * POST /api/config/reset
 * Resetear configuración a valores por defecto (admin)
 */
exports.resetConfig = async (req, res) => {
  try {
    // Verificar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden resetear configuración',
      });
    }

    // Borrar configuración actual
    await db.query(`DELETE FROM config`);

    // Insertar valores por defecto
    await db.query(
      `INSERT INTO config (planes, banco_info, fecha_actualizacion)
      VALUES ($1, $2, NOW())`,
      [JSON.stringify(PRICING_PLANS), JSON.stringify(BANK_INFO)]
    );

    res.json({
      success: true,
      message: 'Configuración reseteada a valores por defecto',
      data: {
        planes: PRICING_PLANS,
        banco_info: BANK_INFO,
      },
    });
  } catch (error) {
    console.error('Error en resetConfig:', error);
    res.status(500).json({
      success: false,
      message: 'Error al resetear configuración',
      error: error.message,
    });
  }
};

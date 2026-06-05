/**
 * Modelo de Pago
 * Registra los pagos por transferencia de los torneos
 */

const db = require('../config/database');
const { PAYMENT_STATUS, TORNEO_STATUS } = require('../constants/paymentStatus');

class Pago {
  /**
   * Crear un nuevo pago
   */
  static async crear(pagoData) {
    const {
      torneo_id,
      plan_id,
      numero_referencia,
      fecha_transferencia,
      comprobante_url,
      club_id,
    } = pagoData;

    try {
      // Obtener información del plan para obtener el monto
      const { data: planes } = require('../data/pricingPlans');
      const plan = planes.find((p) => p.id === plan_id);
      const monto = plan ? plan.precio : 0;

      const result = await db.query(
        `INSERT INTO pagos (
          torneo_id,
          plan_id,
          monto,
          estado,
          numero_referencia,
          fecha_transferencia,
          comprobante_url,
          club_id,
          fecha_creacion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING *`,
        [torneo_id, plan_id, monto, PAYMENT_STATUS.PENDIENTE, numero_referencia, fecha_transferencia, comprobante_url, club_id]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los pagos (con filtros opcionales)
   */
  static async obtenerTodos(filtros = {}) {
    try {
      let query = `
        SELECT
          p.*,
          t.nombre as torneo_nombre,
          c.nombre as club_nombre
        FROM pagos p
        LEFT JOIN torneos t ON p.torneo_id = t.id
        LEFT JOIN clubs c ON p.club_id = c.id
        WHERE 1=1
      `;

      const params = [];

      if (filtros.estado) {
        query += ` AND p.estado = $${params.length + 1}`;
        params.push(filtros.estado);
      }

      if (filtros.torneo_id) {
        query += ` AND p.torneo_id = $${params.length + 1}`;
        params.push(filtros.torneo_id);
      }

      if (filtros.club_id) {
        query += ` AND p.club_id = $${params.length + 1}`;
        params.push(filtros.club_id);
      }

      query += ` ORDER BY p.fecha_creacion DESC`;

      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      throw error;
    }
  }

  /**
   * Obtener pago por ID
   */
  static async obtenerPorId(pagoId) {
    try {
      const result = await db.query(
        `SELECT
          p.*,
          t.nombre as torneo_nombre,
          c.nombre as club_nombre
        FROM pagos p
        LEFT JOIN torneos t ON p.torneo_id = t.id
        LEFT JOIN clubs c ON p.club_id = c.id
        WHERE p.id = $1`,
        [pagoId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al obtener pago:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos de un torneo
   */
  static async obtenerPorTorneo(torneoId) {
    try {
      const result = await db.query(
        `SELECT
          p.*,
          t.nombre as torneo_nombre,
          c.nombre as club_nombre
        FROM pagos p
        LEFT JOIN torneos t ON p.torneo_id = t.id
        LEFT JOIN clubs c ON p.club_id = c.id
        WHERE p.torneo_id = $1
        ORDER BY p.fecha_creacion DESC`,
        [torneoId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error al obtener pagos del torneo:', error);
      throw error;
    }
  }

  /**
   * Obtener pagos pendientes
   */
  static async obtenerPendientes() {
    try {
      const result = await db.query(
        `SELECT
          p.*,
          t.nombre as torneo_nombre,
          c.nombre as club_nombre
        FROM pagos p
        LEFT JOIN torneos t ON p.torneo_id = t.id
        LEFT JOIN clubs c ON p.club_id = c.id
        WHERE p.estado = $1
        ORDER BY p.fecha_creacion ASC`,
        [PAYMENT_STATUS.PENDIENTE]
      );

      return result.rows;
    } catch (error) {
      console.error('Error al obtener pagos pendientes:', error);
      throw error;
    }
  }

  /**
   * Confirmar un pago
   */
  static async confirmar(pagoId, notas = '') {
    try {
      // Actualizar estado del pago
      const pagoResult = await db.query(
        `UPDATE pagos
        SET estado = $1,
            fecha_confirmacion = NOW(),
            notas = $2
        WHERE id = $3
        RETURNING *`,
        [PAYMENT_STATUS.COMPLETADO, notas, pagoId]
      );

      const pago = pagoResult.rows[0];

      if (pago) {
        // Actualizar estado del torneo a ACTIVO
        await db.query(
          `UPDATE torneos
          SET estado = $1, plan_id = $2
          WHERE id = $3`,
          [TORNEO_STATUS.ACTIVO, pago.plan_id, pago.torneo_id]
        );
      }

      return pago;
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      throw error;
    }
  }

  /**
   * Rechazar un pago
   */
  static async rechazar(pagoId, motivo = '') {
    try {
      const result = await db.query(
        `UPDATE pagos
        SET estado = $1,
            fecha_rechazo = NOW(),
            motivo_rechazo = $2
        WHERE id = $3
        RETURNING *`,
        [PAYMENT_STATUS.RECHAZADO, motivo, pagoId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error al rechazar pago:', error);
      throw error;
    }
  }

  /**
   * Eliminar un pago (solo admin)
   */
  static async eliminar(pagoId) {
    try {
      const result = await db.query(`DELETE FROM pagos WHERE id = $1 RETURNING *`, [pagoId]);

      return result.rows[0];
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      throw error;
    }
  }
}

module.exports = Pago;

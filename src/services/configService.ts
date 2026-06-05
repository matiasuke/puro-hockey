/**
 * Servicio de Configuración
 * Gestiona la configuración de planes de pago y otros datos globales
 */

import apiClient from './api';

export interface PricingPlan {
  id: string;
  nombre: string;
  duracion: string;
  meses: number;
  precio: number;
  descripcion: string;
  caracteristicas: string[];
}

export interface BankInfo {
  banco: string;
  cuenta: string;
  cbu: string;
  alias: string;
  titular: string;
  cuit: string;
}

export interface Config {
  id: string;
  planes: PricingPlan[];
  banco_info: BankInfo;
  fecha_actualizacion: string;
}

export const configService = {
  /**
   * Obtener configuración actual
   */
  getConfig: () => apiClient.get('/config'),

  /**
   * Actualizar planes de pago
   */
  updatePlanes: (planes: PricingPlan[]) =>
    apiClient.put('/config/planes', { planes }),

  /**
   * Actualizar datos bancarios
   */
  updateBankInfo: (bankInfo: BankInfo) =>
    apiClient.put('/config/bank-info', bankInfo),

  /**
   * Obtener planes de pago
   */
  getPlanes: () => apiClient.get('/config/planes'),

  /**
   * Obtener datos bancarios
   */
  getBankInfo: () => apiClient.get('/config/bank-info'),

  /**
   * Resetear configuración a valores por defecto
   */
  resetConfig: () => apiClient.post('/config/reset'),
};

/**
 * Planes de pago y configuración de precios
 */

export interface PricingPlan {
  id: string;
  nombre: string;
  duracion: string;
  meses: number;
  precio: number;
  descripcion: string;
  caracteristicas: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'expres',
    nombre: 'Plan Expres',
    duracion: '1 mes',
    meses: 1,
    precio: 5000,
    descripcion: 'Para torneos puntuales y eventos especiales',
    caracteristicas: ['1 mes de acceso', 'Hasta 10 equipos', 'Estadísticas básicas'],
  },
  {
    id: 'clausura',
    nombre: 'Plan Clausura',
    duracion: '6 meses (Ago - Ene)',
    meses: 6,
    precio: 20000,
    descripcion: 'Clausura del año - Segunda mitad',
    caracteristicas: ['6 meses de acceso', 'Equipos ilimitados', 'Todas las estadísticas', 'Reportes PDF'],
  },
  {
    id: 'apertura',
    nombre: 'Plan Apertura',
    duracion: '6 meses (Feb - Jul)',
    meses: 6,
    precio: 20000,
    descripcion: 'Apertura del año - Primera mitad',
    caracteristicas: ['6 meses de acceso', 'Equipos ilimitados', 'Todas las estadísticas', 'Reportes PDF'],
  },
  {
    id: 'anual',
    nombre: 'Plan Anual',
    duracion: '12 meses',
    meses: 12,
    precio: 35000,
    descripcion: 'Acceso completo todo el año - Mejor opción',
    caracteristicas: [
      '12 meses de acceso',
      'Equipos ilimitados',
      'Todas las estadísticas',
      'Reportes PDF + Excel',
      'Soporte prioritario',
      '¡10% de descuento!',
    ],
  },
];

/**
 * Datos bancarios para transferencias
 */
export const BANK_INFO = {
  banco: 'Banco Puro Hockey',
  cuenta: '1234567890',
  cbu: '0123456789012345678901',
  alias: 'puro.hockey.pagos',
  titular: 'PURO HOCKEY SRL',
  cuit: '30-12345678-9',
};

/**
 * Estados posibles de un pago
 */
export enum PAYMENT_STATUS {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  RECHAZADO = 'RECHAZADO',
  EXPIRADO = 'EXPIRADO',
}

/**
 * Estados posibles de un torneo respecto a pagos
 */
export enum TORNEO_STATUS {
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  ACTIVO = 'ACTIVO',
  SUSPENDIDO = 'SUSPENDIDO',
  FINALIZADO = 'FINALIZADO',
}

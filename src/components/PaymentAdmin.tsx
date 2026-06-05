import React, { useState } from 'react';
import { PRICING_PLANS, PAYMENT_STATUS } from '../data/pricingPlans';

interface Pago {
  id: string;
  torneo_id: string;
  torneo_nombre: string;
  plan_id: string;
  monto: number;
  estado: string;
  numero_referencia: string;
  fecha_transferencia: string;
  comprobante_url: string;
  fecha_creacion: string;
}

interface PaymentAdminProps {
  pagos: Pago[];
  onConfirmar: (pagoId: string, notas?: string) => void;
  onRechazar: (pagoId: string, motivo: string) => void;
  isLoading?: boolean;
}

export const PaymentAdmin: React.FC<PaymentAdminProps> = ({
  pagos,
  onConfirmar,
  onRechazar,
  isLoading = false,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rejectMotivo, setRejectMotivo] = useState<Record<string, string>>({});

  const pagosPendientes = pagos.filter((p) => p.estado === PAYMENT_STATUS.PENDIENTE);
  const pagosCompletados = pagos.filter((p) => p.estado === PAYMENT_STATUS.COMPLETADO);

  const getPlanInfo = (planId: string) => {
    return PRICING_PLANS.find((p) => p.id === planId);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case PAYMENT_STATUS.PENDIENTE:
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case PAYMENT_STATUS.COMPLETADO:
        return 'bg-green-100 text-green-900 border-green-300';
      case PAYMENT_STATUS.RECHAZADO:
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* PAGOS PENDIENTES */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ⏳ Pagos Pendientes de Confirmación ({pagosPendientes.length})
        </h3>

        {pagosPendientes.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
            No hay pagos pendientes
          </div>
        ) : (
          <div className="space-y-3">
            {pagosPendientes.map((pago) => {
              const plan = getPlanInfo(pago.plan_id);

              return (
                <div
                  key={pago.id}
                  className="border-2 border-yellow-200 rounded-lg overflow-hidden bg-white"
                >
                  {/* Header */}
                  <button
                    onClick={() => setExpandedId(expandedId === pago.id ? null : pago.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-yellow-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="text-2xl">📄</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{pago.torneo_nombre}</h4>
                        <p className="text-sm text-gray-600">
                          {plan?.nombre} • Ref: {pago.numero_referencia}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${pago.monto.toLocaleString('es-AR')}</div>
                      <div className="text-xs text-gray-500">{pago.fecha_transferencia}</div>
                    </div>
                    <div className="ml-4 text-xl">{expandedId === pago.id ? '▲' : '▼'}</div>
                  </button>

                  {/* Expandido */}
                  {expandedId === pago.id && (
                    <div className="bg-yellow-50 border-t-2 border-yellow-200 px-4 py-4 space-y-4">
                      {/* Datos del pago */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 font-semibold">Referencia:</span>
                          <p className="text-gray-900 font-mono">{pago.numero_referencia}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-semibold">Fecha Transf.:</span>
                          <p className="text-gray-900">{pago.fecha_transferencia}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-semibold">Plan:</span>
                          <p className="text-gray-900">{plan?.nombre}</p>
                        </div>
                        <div>
                          <span className="text-gray-600 font-semibold">Monto:</span>
                          <p className="text-gray-900 font-bold">${pago.monto.toLocaleString('es-AR')}</p>
                        </div>
                      </div>

                      {/* Comprobante */}
                      {pago.comprobante_url && (
                        <div>
                          <span className="text-sm text-gray-600 font-semibold block mb-2">
                            Comprobante:
                          </span>
                          <a
                            href={pago.comprobante_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-hockey-verde-oscuro hover:underline text-sm"
                          >
                            🔗 Ver comprobante
                          </a>
                        </div>
                      )}

                      {/* Motivo de rechazo */}
                      <div>
                        <label className="text-sm text-gray-600 font-semibold block mb-2">
                          Motivo de Rechazo (opcional):
                        </label>
                        <input
                          type="text"
                          placeholder="Comprobante inválido, monto incorrecto, etc."
                          value={rejectMotivo[pago.id] || ''}
                          onChange={(e) =>
                            setRejectMotivo({ ...rejectMotivo, [pago.id]: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      {/* Botones de acción */}
                      <div className="flex gap-3 pt-3 border-t border-yellow-200">
                        <button
                          onClick={() => onRechazar(pago.id, rejectMotivo[pago.id] || '')}
                          disabled={isLoading}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          ✗ Rechazar
                        </button>
                        <button
                          onClick={() => onConfirmar(pago.id)}
                          disabled={isLoading}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                        >
                          ✓ Confirmar Pago
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <hr className="my-6" />

      {/* PAGOS COMPLETADOS */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          ✓ Pagos Confirmados ({pagosCompletados.length})
        </h3>

        {pagosCompletados.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
            No hay pagos confirmados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-2 text-left font-bold">Torneo</th>
                  <th className="px-4 py-2 text-left font-bold">Plan</th>
                  <th className="px-4 py-2 text-left font-bold">Referencia</th>
                  <th className="px-4 py-2 text-right font-bold">Monto</th>
                  <th className="px-4 py-2 text-left font-bold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pagosCompletados.map((pago) => {
                  const plan = getPlanInfo(pago.plan_id);
                  return (
                    <tr key={pago.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-semibold">{pago.torneo_nombre}</td>
                      <td className="px-4 py-2">{plan?.nombre}</td>
                      <td className="px-4 py-2 font-mono text-xs">{pago.numero_referencia}</td>
                      <td className="px-4 py-2 text-right font-bold">
                        ${pago.monto.toLocaleString('es-AR')}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">{pago.fecha_transferencia}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

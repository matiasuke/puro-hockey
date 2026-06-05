import React, { useState, useEffect } from 'react';
import { useToast } from '../components/Toast';
import { PaymentModal } from '../components/PaymentModal';
import { PaymentAdmin } from '../components/PaymentAdmin';
import { pagosService, torneosService } from '../services/api';
import { TORNEO_STATUS, PAYMENT_STATUS } from '../data/pricingPlans';

interface Torneo {
  id: string;
  nombre: string;
  estado_pago: string;
  plan_id?: string;
}

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

export const PagosView: React.FC<{ userRole: string }> = ({ userRole }) => {
  const { toasts, showToast, removeToast } = useToast();
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedTorneo, setSelectedTorneo] = useState<Torneo | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [userRole]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar torneos
      const torneosRes = await torneosService.getAll();
      setTorneos(torneosRes.data);

      // Cargar pagos
      const pagosRes = userRole === 'admin' ? await pagosService.getAll() : await pagosService.getAll();
      setPagos(pagosRes.data);
    } catch (error) {
      showToast('Error al cargar datos', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPago = async (data: {
    plan_id: string;
    numero_referencia: string;
    fecha_transferencia: string;
    comprobante_url: string;
  }) => {
    try {
      if (!selectedTorneo) return;

      await pagosService.crear({
        torneo_id: selectedTorneo.id,
        ...data,
      });

      showToast('Pago registrado correctamente. Pendiente de confirmación admin.', 'success');
      setShowPaymentModal(false);
      setSelectedTorneo(null);
      await cargarDatos();
    } catch (error) {
      showToast('Error al registrar pago', 'error');
      console.error(error);
    }
  };

  const handleConfirmarPago = async (pagoId: string) => {
    try {
      await pagosService.confirmar(pagoId);
      showToast('Pago confirmado. Torneo habilitado.', 'success');
      await cargarDatos();
    } catch (error) {
      showToast('Error al confirmar pago', 'error');
      console.error(error);
    }
  };

  const handleRechazarPago = async (pagoId: string, motivo: string) => {
    try {
      await pagosService.rechazar(pagoId, motivo);
      showToast('Pago rechazado', 'info');
      await cargarDatos();
    } catch (error) {
      showToast('Error al rechazar pago', 'error');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600 font-semibold">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notificaciones Toast */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg text-white font-semibold shadow-lg animate-pulse ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                  ? 'bg-red-500'
                  : toast.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* VISTA PARA CLUBS */}
      {userRole === 'club' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-hockey-verde-oscuro to-hockey-verde-claro text-white rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-2">💳 Gestión de Pagos</h2>
            <p>Registra el pago de tus torneos por transferencia bancaria</p>
          </div>

          {/* Torneos sin pago */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ⚠️ Torneos Pendientes de Pago
            </h3>

            {torneos.filter((t) => t.estado_pago === TORNEO_STATUS.PENDIENTE_PAGO).length === 0 ? (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">✓</div>
                <p className="text-green-900 font-semibold">Todos tus torneos están pagados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {torneos
                  .filter((t) => t.estado_pago === TORNEO_STATUS.PENDIENTE_PAGO)
                  .map((torneo) => (
                    <div
                      key={torneo.id}
                      className="border-2 border-red-300 rounded-lg p-4 bg-red-50"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{torneo.nombre}</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Este torneo requiere pago para poder ser utilizado
                      </p>
                      <button
                        onClick={() => {
                          setSelectedTorneo(torneo);
                          setShowPaymentModal(true);
                        }}
                        className="w-full bg-hockey-verde-oscuro text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        💳 Registrar Pago
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Pagos realizados */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Mis Pagos</h3>

            {pagos.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                No has registrado pagos aún
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left font-bold">Torneo</th>
                      <th className="px-4 py-2 text-left font-bold">Plan</th>
                      <th className="px-4 py-2 text-right font-bold">Monto</th>
                      <th className="px-4 py-2 text-left font-bold">Estado</th>
                      <th className="px-4 py-2 text-left font-bold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pagos.map((pago) => (
                      <tr key={pago.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-semibold">{pago.torneo_nombre}</td>
                        <td className="px-4 py-2">{pago.plan_id}</td>
                        <td className="px-4 py-2 text-right font-bold">
                          ${pago.monto.toLocaleString('es-AR')}
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              pago.estado === PAYMENT_STATUS.COMPLETADO
                                ? 'bg-green-100 text-green-900'
                                : pago.estado === PAYMENT_STATUS.PENDIENTE
                                  ? 'bg-yellow-100 text-yellow-900'
                                  : 'bg-red-100 text-red-900'
                            }`}
                          >
                            {pago.estado === PAYMENT_STATUS.COMPLETADO
                              ? '✓ Confirmado'
                              : pago.estado === PAYMENT_STATUS.PENDIENTE
                                ? '⏳ Pendiente'
                                : '✗ Rechazado'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {new Date(pago.fecha_creacion).toLocaleDateString('es-AR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VISTA PARA ADMIN */}
      {userRole === 'admin' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-hockey-verde-oscuro to-hockey-verde-claro text-white rounded-lg p-6">
            <h2 className="text-3xl font-bold mb-2">💰 Administración de Pagos</h2>
            <p>Revisa y confirma los pagos de transferencia de los torneos</p>
          </div>

          <PaymentAdmin
            pagos={pagos}
            onConfirmar={handleConfirmarPago}
            onRechazar={handleRechazarPago}
            isLoading={loading}
          />
        </div>
      )}

      {/* Modal de Pago */}
      {selectedTorneo && (
        <PaymentModal
          isOpen={showPaymentModal}
          torneoNombre={selectedTorneo.nombre}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedTorneo(null);
          }}
          onSubmit={handleCrearPago}
          isLoading={loading}
        />
      )}
    </div>
  );
};

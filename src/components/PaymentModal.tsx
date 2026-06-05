import React, { useState } from 'react';
import { Modal } from './Modal';
import { PRICING_PLANS, BANK_INFO, PricingPlan } from '../data/pricingPlans';
import { PricingCard } from './PricingCard';

interface PaymentModalProps {
  isOpen: boolean;
  torneoNombre: string;
  onClose: () => void;
  onSubmit: (data: {
    plan_id: string;
    numero_referencia: string;
    fecha_transferencia: string;
    comprobante_url: string;
  }) => void;
  isLoading?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  torneoNombre,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [numeroReferencia, setNumeroReferencia] = useState('');
  const [fechaTransferencia, setFechaTransferencia] = useState('');
  const [comprobanteUrl, setComprobanteUrl] = useState('');
  const [step, setStep] = useState<'plan' | 'datos' | 'resumen'>('plan');

  const plan = selectedPlan ? PRICING_PLANS.find((p) => p.id === selectedPlan) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan || !numeroReferencia || !fechaTransferencia) {
      alert('Por favor completa todos los campos');
      return;
    }

    onSubmit({
      plan_id: selectedPlan,
      numero_referencia: numeroReferencia,
      fecha_transferencia: fechaTransferencia,
      comprobante_url: comprobanteUrl,
    });

    // Reset
    setSelectedPlan(null);
    setNumeroReferencia('');
    setFechaTransferencia('');
    setComprobanteUrl('');
    setStep('plan');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Registrar Pago - ${torneoNombre}`} size="lg">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setStep('plan')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              step === 'plan'
                ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            1. Seleccionar Plan
          </button>
          <button
            onClick={() => selectedPlan && setStep('datos')}
            disabled={!selectedPlan}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              step === 'datos'
                ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            } ${!selectedPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            2. Datos de Transferencia
          </button>
          <button
            onClick={() => selectedPlan && setStep('resumen')}
            disabled={!selectedPlan}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              step === 'resumen'
                ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            } ${!selectedPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            3. Resumen
          </button>
        </div>

        {/* PASO 1: Seleccionar Plan */}
        {step === 'plan' && (
          <div className="space-y-4">
            <p className="text-gray-700 font-semibold">Selecciona el plan que deseas contratar:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRICING_PLANS.map((p) => (
                <PricingCard
                  key={p.id}
                  plan={p}
                  isSelected={selectedPlan === p.id}
                  onSelect={(id) => {
                    setSelectedPlan(id);
                    setStep('datos');
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* PASO 2: Datos de Transferencia */}
        {step === 'datos' && plan && (
          <div className="space-y-6">
            {/* Datos bancarios */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-3">📋 Datos para Transferencia</h4>
              <div className="space-y-2 text-sm text-blue-900 font-mono">
                <div>
                  <span className="font-bold">Banco:</span> {BANK_INFO.banco}
                </div>
                <div>
                  <span className="font-bold">Titular:</span> {BANK_INFO.titular}
                </div>
                <div>
                  <span className="font-bold">CBU:</span> {BANK_INFO.cbu}
                </div>
                <div>
                  <span className="font-bold">Alias:</span> {BANK_INFO.alias}
                </div>
                <div>
                  <span className="font-bold">CUIT:</span> {BANK_INFO.cuit}
                </div>
                <hr className="my-2" />
                <div className="bg-yellow-100 p-2 rounded">
                  💰 <span className="font-bold">Monto a transferir:</span> $
                  {plan.precio.toLocaleString('es-AR')}
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Referencia
                </label>
                <input
                  type="text"
                  placeholder="Ej: CBU12345 o Transf-001"
                  value={numeroReferencia}
                  onChange={(e) => setNumeroReferencia(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Número de operación o referencia de tu transferencia
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fecha de Transferencia
                </label>
                <input
                  type="date"
                  value={fechaTransferencia}
                  onChange={(e) => setFechaTransferencia(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL del Comprobante (Imagen)
                </label>
                <input
                  type="url"
                  placeholder="https://ejemplo.com/comprobante.jpg"
                  value={comprobanteUrl}
                  onChange={(e) => setComprobanteUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sube la captura del comprobante a un servicio de almacenamiento (Imgur, etc.)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('resumen')}
                className="w-full bg-hockey-verde-oscuro text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Siguiente →
              </button>
            </form>
          </div>
        )}

        {/* PASO 3: Resumen */}
        {step === 'resumen' && plan && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-bold text-gray-900">📊 Resumen del Pago</h4>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Plan:</span>
                  <p className="font-bold text-gray-900">{plan.nombre}</p>
                </div>
                <div>
                  <span className="text-gray-600">Duración:</span>
                  <p className="font-bold text-gray-900">{plan.duracion}</p>
                </div>
                <div>
                  <span className="text-gray-600">Referencia:</span>
                  <p className="font-bold text-gray-900">{numeroReferencia}</p>
                </div>
                <div>
                  <span className="text-gray-600">Fecha:</span>
                  <p className="font-bold text-gray-900">{fechaTransferencia}</p>
                </div>
              </div>

              <hr />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Monto Total:</span>
                <span className="text-hockey-verde-oscuro">${plan.precio.toLocaleString('es-AR')}</span>
              </div>

              <div className="bg-green-100 border border-green-400 text-green-900 px-3 py-2 rounded text-sm">
                ✓ Una vez confirmado, el torneo estará habilitado para usar
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('datos')}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← Anterior
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-hockey-verde-oscuro text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {isLoading ? '⏳ Guardando...' : '✓ Registrar Pago'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

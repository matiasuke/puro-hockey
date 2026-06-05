import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { PricingPlan, BankInfo } from '../services/configService';

interface ConfiguracionPlanesProps {
  planes: PricingPlan[];
  bankInfo: BankInfo;
  onUpdatePlanes: (planes: PricingPlan[]) => Promise<void>;
  onUpdateBankInfo: (bankInfo: BankInfo) => Promise<void>;
  isLoading?: boolean;
}

export const ConfiguracionPlanes: React.FC<ConfiguracionPlanesProps> = ({
  planes,
  bankInfo,
  onUpdatePlanes,
  onUpdateBankInfo,
  isLoading = false,
}) => {
  const [editingPlanes, setEditingPlanes] = useState<PricingPlan[]>(planes);
  const [editingBankInfo, setEditingBankInfo] = useState<BankInfo>(bankInfo);
  const [tab, setTab] = useState<'planes' | 'banco'>('planes');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  useEffect(() => {
    setEditingPlanes(planes);
    setEditingBankInfo(bankInfo);
  }, [planes, bankInfo]);

  const handleUpdatePlan = (planId: string, field: string, value: any) => {
    setEditingPlanes(
      editingPlanes.map((p) =>
        p.id === planId ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSavePlanes = async () => {
    try {
      await onUpdatePlanes(editingPlanes);
      setEditingPlanId(null);
    } catch (error) {
      console.error('Error al guardar planes:', error);
    }
  };

  const handleSaveBankInfo = async () => {
    try {
      await onUpdateBankInfo(editingBankInfo);
    } catch (error) {
      console.error('Error al guardar datos bancarios:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200">
        <button
          onClick={() => setTab('planes')}
          className={`px-4 py-3 font-bold transition-all border-b-4 ${
            tab === 'planes'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Planes de Pago
        </button>
        <button
          onClick={() => setTab('banco')}
          className={`px-4 py-3 font-bold transition-all border-b-4 ${
            tab === 'banco'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🏦 Datos Bancarios
        </button>
      </div>

      {/* TAB 1: PLANES */}
      {tab === 'planes' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              📝 Edita los planes de pago que estarán disponibles para los clubs. Los cambios se
              aplicarán inmediatamente.
            </p>
          </div>

          {editingPlanes.map((plan) => (
            <div
              key={plan.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-hockey-verde-oscuro transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Nombre */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Nombre del Plan
                  </label>
                  <input
                    type="text"
                    value={plan.nombre}
                    onChange={(e) => handleUpdatePlan(plan.id, 'nombre', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                  />
                </div>

                {/* Duración */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Duración (texto)
                  </label>
                  <input
                    type="text"
                    value={plan.duracion}
                    onChange={(e) => handleUpdatePlan(plan.id, 'duracion', e.target.value)}
                    placeholder="Ej: 6 meses"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                  />
                </div>

                {/* Meses */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Duración (meses)
                  </label>
                  <input
                    type="number"
                    value={plan.meses}
                    onChange={(e) =>
                      handleUpdatePlan(plan.id, 'meses', parseInt(e.target.value))
                    }
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                  />
                </div>

                {/* Precio */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    value={plan.precio}
                    onChange={(e) =>
                      handleUpdatePlan(plan.id, 'precio', parseFloat(e.target.value))
                    }
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={plan.descripcion}
                    onChange={(e) => handleUpdatePlan(plan.id, 'descripcion', e.target.value)}
                    placeholder="Breve descripción del plan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                  />
                </div>
              </div>

              {/* Características */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Características (una por línea)
                </label>
                <textarea
                  value={plan.caracteristicas.join('\n')}
                  onChange={(e) =>
                    handleUpdatePlan(
                      plan.id,
                      'caracteristicas',
                      e.target.value.split('\n').filter((c) => c.trim())
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro font-mono text-sm"
                  placeholder="Característica 1&#10;Característica 2&#10;Característica 3"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSavePlanes}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? '⏳ Guardando...' : '✓ Guardar Cambios'}
          </button>
        </div>
      )}

      {/* TAB 2: DATOS BANCARIOS */}
      {tab === 'banco' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              🏦 Estos datos se mostrarán a los clubs cuando registren un pago.
            </p>
          </div>

          <div className="border-2 border-gray-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Banco */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Banco
                </label>
                <input
                  type="text"
                  value={editingBankInfo.banco}
                  onChange={(e) =>
                    setEditingBankInfo({ ...editingBankInfo, banco: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                />
              </div>

              {/* Titular */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Titular
                </label>
                <input
                  type="text"
                  value={editingBankInfo.titular}
                  onChange={(e) =>
                    setEditingBankInfo({ ...editingBankInfo, titular: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                />
              </div>

              {/* Cuenta */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  value={editingBankInfo.cuenta}
                  onChange={(e) =>
                    setEditingBankInfo({ ...editingBankInfo, cuenta: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                />
              </div>

              {/* CBU */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  CBU (22 dígitos)
                </label>
                <input
                  type="text"
                  value={editingBankInfo.cbu}
                  onChange={(e) => setEditingBankInfo({ ...editingBankInfo, cbu: e.target.value })}
                  maxLength={22}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro font-mono"
                />
              </div>

              {/* Alias */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Alias (CVU)
                </label>
                <input
                  type="text"
                  value={editingBankInfo.alias}
                  onChange={(e) =>
                    setEditingBankInfo({ ...editingBankInfo, alias: e.target.value })
                  }
                  placeholder="Ej: puro.hockey.pagos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                />
              </div>

              {/* CUIT */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  CUIT
                </label>
                <input
                  type="text"
                  value={editingBankInfo.cuit}
                  onChange={(e) =>
                    setEditingBankInfo({ ...editingBankInfo, cuit: e.target.value })
                  }
                  placeholder="Ej: 30-12345678-9"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-bold text-gray-900 mb-2">📋 Vista Previa</h4>
              <div className="space-y-1 text-sm font-mono text-gray-700">
                <div>
                  <span className="font-bold">Banco:</span> {editingBankInfo.banco}
                </div>
                <div>
                  <span className="font-bold">Titular:</span> {editingBankInfo.titular}
                </div>
                <div>
                  <span className="font-bold">Cuenta:</span> {editingBankInfo.cuenta}
                </div>
                <div>
                  <span className="font-bold">CBU:</span> {editingBankInfo.cbu}
                </div>
                <div>
                  <span className="font-bold">Alias:</span> {editingBankInfo.alias}
                </div>
                <div>
                  <span className="font-bold">CUIT:</span> {editingBankInfo.cuit}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveBankInfo}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? '⏳ Guardando...' : '✓ Guardar Cambios'}
          </button>
        </div>
      )}
    </div>
  );
};

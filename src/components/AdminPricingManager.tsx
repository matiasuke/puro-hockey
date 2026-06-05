import React, { useState, useEffect } from 'react';
import { PRICING_PLANS, BANK_INFO, PricingPlan } from '../data/pricingPlans';
import { Modal } from './Modal';
import { Button } from './Button';

interface AdminPricingManagerProps {
  onSave?: (plans: any[], bankInfo: any) => void;
}

export const AdminPricingManager: React.FC<AdminPricingManagerProps> = ({ onSave }) => {
  const [plans, setPlans] = useState(PRICING_PLANS);
  const [bankInfo, setBankInfo] = useState(BANK_INFO);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingBankInfo, setEditingBankInfo] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);

  // Editar plan
  const handleEditarPlan = (plan: PricingPlan) => {
    setCurrentPlan(plan);
    setEditingPlanId(plan.id);
    setShowEditModal(true);
  };

  const handleGuardarPlan = (plan: PricingPlan) => {
    const updatedPlans = plans.map((p) => (p.id === plan.id ? plan : p));
    setPlans(updatedPlans);
    setShowEditModal(false);
    setCurrentPlan(null);
    setEditingPlanId(null);

    if (onSave) {
      onSave(updatedPlans, bankInfo);
    }
  };

  // Editar datos bancarios
  const handleGuardarBankInfo = () => {
    setEditingBankInfo(false);
    if (onSave) {
      onSave(plans, bankInfo);
    }
  };

  return (
    <div className="space-y-6">
      {/* PLANES DE PAGO */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">💰 Gestión de Planes de Pago</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-hockey-verde-oscuro transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{plan.nombre}</h4>
                  <p className="text-xs text-gray-600">{plan.duracion}</p>
                </div>
                {plan.id === 'anual' && (
                  <span className="text-xs bg-amber-400 text-white px-2 py-1 rounded">
                    ⭐ Best
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-2xl font-bold text-hockey-verde-oscuro">
                  ${plan.precio.toLocaleString('es-AR')}
                </div>
                <p className="text-xs text-gray-600">{plan.descripcion}</p>
              </div>

              <hr className="my-3" />

              <ul className="text-xs space-y-1 mb-4">
                {plan.caracteristicas.slice(0, 2).map((feature, idx) => (
                  <li key={idx} className="text-gray-700">
                    ✓ {feature}
                  </li>
                ))}
                {plan.caracteristicas.length > 2 && (
                  <li className="text-gray-600">
                    +{plan.caracteristicas.length - 2} más...
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleEditarPlan(plan)}
                className="w-full bg-hockey-verde-oscuro text-white py-2 rounded font-semibold text-sm hover:bg-opacity-90 transition-colors"
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-6" />

      {/* DATOS BANCARIOS */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-900">🏦 Datos Bancarios</h3>
          <button
            onClick={() => setEditingBankInfo(!editingBankInfo)}
            className="px-4 py-2 bg-hockey-verde-oscuro text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            {editingBankInfo ? '✓ Listo' : '✏️ Editar'}
          </button>
        </div>

        {!editingBankInfo ? (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 font-semibold">Banco:</span>
                <p className="text-gray-900 font-mono">{bankInfo.banco}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Titular:</span>
                <p className="text-gray-900 font-mono">{bankInfo.titular}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">CBU:</span>
                <p className="text-gray-900 font-mono">{bankInfo.cbu}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Alias:</span>
                <p className="text-gray-900 font-mono">{bankInfo.alias}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">Cuenta:</span>
                <p className="text-gray-900 font-mono">{bankInfo.cuenta}</p>
              </div>
              <div>
                <span className="text-gray-600 font-semibold">CUIT:</span>
                <p className="text-gray-900 font-mono">{bankInfo.cuit}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Banco</label>
                <input
                  type="text"
                  value={bankInfo.banco}
                  onChange={(e) => setBankInfo({ ...bankInfo, banco: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titular</label>
                <input
                  type="text"
                  value={bankInfo.titular}
                  onChange={(e) => setBankInfo({ ...bankInfo, titular: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CBU</label>
                <input
                  type="text"
                  value={bankInfo.cbu}
                  onChange={(e) => setBankInfo({ ...bankInfo, cbu: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Alias</label>
                <input
                  type="text"
                  value={bankInfo.alias}
                  onChange={(e) => setBankInfo({ ...bankInfo, alias: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cuenta</label>
                <input
                  type="text"
                  value={bankInfo.cuenta}
                  onChange={(e) => setBankInfo({ ...bankInfo, cuenta: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CUIT</label>
                <input
                  type="text"
                  value={bankInfo.cuit}
                  onChange={(e) => setBankInfo({ ...bankInfo, cuit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleGuardarBankInfo}
              className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              ✓ Guardar Cambios
            </button>
          </div>
        )}
      </div>

      {/* MODAL DE EDICIÓN DE PLAN */}
      {showEditModal && currentPlan && (
        <PlanEditModal
          plan={currentPlan}
          onSave={handleGuardarPlan}
          onCancel={() => {
            setShowEditModal(false);
            setCurrentPlan(null);
            setEditingPlanId(null);
          }}
        />
      )}
    </div>
  );
};

// Componente para editar un plan individual
interface PlanEditModalProps {
  plan: PricingPlan;
  onSave: (plan: PricingPlan) => void;
  onCancel: () => void;
}

const PlanEditModal: React.FC<PlanEditModalProps> = ({ plan, onSave, onCancel }) => {
  const [editedPlan, setEditedPlan] = useState(plan);
  const [newFeature, setNewFeature] = useState('');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setEditedPlan({
        ...editedPlan,
        caracteristicas: [...editedPlan.caracteristicas, newFeature],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setEditedPlan({
      ...editedPlan,
      caracteristicas: editedPlan.caracteristicas.filter((_, i) => i !== index),
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={`Editar Plan: ${plan.nombre}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Plan</label>
          <input
            type="text"
            value={editedPlan.nombre}
            onChange={(e) => setEditedPlan({ ...editedPlan, nombre: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
          />
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Duración</label>
          <input
            type="text"
            value={editedPlan.duracion}
            onChange={(e) => setEditedPlan({ ...editedPlan, duracion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
          />
        </div>

        {/* Meses */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Meses</label>
          <input
            type="number"
            value={editedPlan.meses}
            onChange={(e) => setEditedPlan({ ...editedPlan, meses: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Precio ($)
          </label>
          <input
            type="number"
            value={editedPlan.precio}
            onChange={(e) => setEditedPlan({ ...editedPlan, precio: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={editedPlan.descripcion}
            onChange={(e) => setEditedPlan({ ...editedPlan, descripcion: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hockey-verde-oscuro focus:border-transparent"
          />
        </div>

        {/* Características */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Características</label>

          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {editedPlan.caracteristicas.map((feature, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{feature}</span>
                <button
                  onClick={() => handleRemoveFeature(idx)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva característica"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleAddFeature}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
            >
              + Agregar
            </button>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(editedPlan)}
            className="flex-1 px-4 py-2 bg-hockey-verde-oscuro text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            ✓ Guardar Plan
          </button>
        </div>
      </div>
    </Modal>
  );
};

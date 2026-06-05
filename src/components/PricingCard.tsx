import React from 'react';
import { PricingPlan } from '../data/pricingPlans';

interface PricingCardProps {
  plan: PricingPlan;
  isSelected?: boolean;
  onSelect: (planId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ plan, isSelected, onSelect }) => {
  return (
    <div
      className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'border-hockey-verde-oscuro bg-hockey-verde-oscuro/5'
          : 'border-gray-200 hover:border-hockey-verde-oscuro'
      } ${plan.id === 'anual' ? 'ring-2 ring-amber-400 ring-offset-2' : ''}`}
      onClick={() => onSelect(plan.id)}
    >
      {/* Etiqueta de mejor opción */}
      {plan.id === 'anual' && (
        <div className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          ⭐ MEJOR OPCIÓN
        </div>
      )}

      {/* Nombre y duración */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.nombre}</h3>
      <p className="text-sm text-gray-600 mb-4">{plan.duracion}</p>

      {/* Precio */}
      <div className="mb-4">
        <span className="text-4xl font-bold text-hockey-verde-oscuro">
          ${plan.precio.toLocaleString('es-AR')}
        </span>
        <p className="text-xs text-gray-500 mt-1">{plan.descripcion}</p>
      </div>

      {/* Línea divisoria */}
      <hr className="my-4" />

      {/* Características */}
      <ul className="space-y-2 mb-6">
        {plan.caracteristicas.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm text-gray-700">
            <span className="text-hockey-verde-oscuro mr-2 font-bold">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Botón de selección */}
      <button
        className={`w-full py-2 rounded-lg font-semibold transition-colors ${
          isSelected
            ? 'bg-hockey-verde-oscuro text-white'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {isSelected ? '✓ Seleccionado' : 'Seleccionar Plan'}
      </button>
    </div>
  );
};

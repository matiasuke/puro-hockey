import React, { useState, useEffect } from 'react';
import { AdminView } from './AdminView';
import { PagosView } from './PagosView';
import { Toast, useToast } from '../components/Toast';
import { ConfiguracionPlanes } from '../components/ConfiguracionPlanes';
import { configService, PricingPlan, BankInfo } from '../services/configService';
import { PRICING_PLANS, BANK_INFO } from '../data/pricingPlans';

export const AdminDashboard: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'torneos' | 'usuarios' | 'pagos' | 'configuracion'>(
    'torneos'
  );
  const [planes, setPlanes] = useState<PricingPlan[]>(PRICING_PLANS);
  const [bankInfo, setBankInfo] = useState<BankInfo>(BANK_INFO);
  const [loadingConfig, setLoadingConfig] = useState(false);

  // Cargar configuración al montar
  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoadingConfig(true);
      const res = await configService.getConfig();
      if (res.data) {
        setPlanes(res.data.planes || PRICING_PLANS);
        setBankInfo(res.data.banco_info || BANK_INFO);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
      // Usar valores por defecto si hay error
      setPlanes(PRICING_PLANS);
      setBankInfo(BANK_INFO);
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleUpdatePlanes = async (nuevosPlanes: PricingPlan[]) => {
    try {
      setLoadingConfig(true);
      await configService.updatePlanes(nuevosPlanes);
      setPlanes(nuevosPlanes);
      showToast('Planes de pago actualizados correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar planes:', error);
      showToast('Error al actualizar planes', 'error');
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleUpdateBankInfo = async (nuevoBankInfo: BankInfo) => {
    try {
      setLoadingConfig(true);
      await configService.updateBankInfo(nuevoBankInfo);
      setBankInfo(nuevoBankInfo);
      showToast('Datos bancarios actualizados correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar datos bancarios:', error);
      showToast('Error al actualizar datos bancarios', 'error');
    } finally {
      setLoadingConfig(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-hockey-verde-oscuro to-hockey-verde-claro text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">🎯 Panel Administrativo</h1>
        <p className="text-sm opacity-90">Gestiona todos los aspectos de la plataforma PURO HOCKEY</p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b-2 border-gray-300 overflow-x-auto">
        <button
          onClick={() => setActiveTab('torneos')}
          className={`px-4 py-3 font-bold whitespace-nowrap transition-all border-b-4 ${
            activeTab === 'torneos'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🏆 Torneos
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`px-4 py-3 font-bold whitespace-nowrap transition-all border-b-4 ${
            activeTab === 'usuarios'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 Usuarios
        </button>
        <button
          onClick={() => setActiveTab('pagos')}
          className={`px-4 py-3 font-bold whitespace-nowrap transition-all border-b-4 ${
            activeTab === 'pagos'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          💳 Pagos
        </button>
        <button
          onClick={() => setActiveTab('configuracion')}
          className={`px-4 py-3 font-bold whitespace-nowrap transition-all border-b-4 ${
            activeTab === 'configuracion'
              ? 'border-hockey-verde-oscuro text-hockey-verde-oscuro'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          ⚙️ Configuración
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {/* TORNEOS Y USUARIOS */}
        {(activeTab === 'torneos' || activeTab === 'usuarios') && <AdminView activeTab={activeTab} />}

        {/* PAGOS */}
        {activeTab === 'pagos' && <PagosView userRole="admin" />}

        {/* CONFIGURACIÓN */}
        {activeTab === 'configuracion' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-bold text-blue-900 mb-2">⚙️ Configuración del Sistema</h3>
              <p className="text-sm text-blue-800">
                Aquí puedes editar los planes de pago y datos bancarios que verán los clubs
              </p>
            </div>

            <ConfiguracionPlanes
              planes={planes}
              bankInfo={bankInfo}
              onUpdatePlanes={handleUpdatePlanes}
              onUpdateBankInfo={handleUpdateBankInfo}
              isLoading={loadingConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
};

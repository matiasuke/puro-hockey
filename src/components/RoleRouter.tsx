import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { AdminDashboard } from '../pages/AdminDashboard';
import { AdminView } from '../pages/AdminView';
import { ClubView } from '../pages/ClubView';
import { ArbitroView } from '../pages/ArbitroView';
import { PublicView } from '../pages/PublicView';
import { MesaControl } from '../pages/MesaControl';
import { PagosView } from '../pages/PagosView';
import { Header } from './Header';

interface RoleRouterProps {
  showMesaControl?: boolean;
}

export const RoleRouter: React.FC<RoleRouterProps> = ({ showMesaControl = false }) => {
  const { user } = useGameStore();
  const [currentView, setCurrentView] = useState<'main' | 'pagos'>('main');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  // Si se solicita explícitamente Mesa de Control, mostrarla
  if (showMesaControl) {
    return (
      <>
        <Header />
        <MesaControl />
      </>
    );
  }

  // Mostrar Pagos si está seleccionado
  if (currentView === 'pagos') {
    return (
      <>
        <Header
          onNavigateToPagos={() => setCurrentView('pagos')}
          onNavigateToAdmin={() => setCurrentView('main')}
        />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PagosView userRole={user.role} />
        </div>
      </>
    );
  }

  // Routing según rol del usuario
  switch (user.role) {
    case 'admin':
      return (
        <>
          <Header
            onNavigateToPagos={() => setCurrentView('pagos')}
            onNavigateToAdmin={() => setCurrentView('main')}
          />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <AdminView activeTab="torneos" />
          </div>
        </>
      );

    case 'club':
      return (
        <>
          <Header
            onNavigateToPagos={() => setCurrentView('pagos')}
            onNavigateToAdmin={undefined}
          />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <ClubView />
          </div>
        </>
      );

    case 'arbitro':
      return (
        <>
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <ArbitroView />
          </div>
        </>
      );

    case 'mesa_control':
      return (
        <>
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <MesaControl />
          </div>
        </>
      );

    case 'public':
    default:
      return (
        <>
          <Header />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <PublicView />
          </div>
        </>
      );
  }
};

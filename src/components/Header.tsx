import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from './Button';

interface HeaderProps {
  onNavigateToPagos?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToPagos, onNavigateToAdmin }) => {
  const { user, logout } = useGameStore();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-hockey-verde-oscuro text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-h1 font-bold">🏆 PURO HOCKEY</h1>
            <p className="text-sm opacity-90">Gestión de Torneos</p>
          </div>

          {/* Navegación rápida */}
          {user && (
            <nav className="hidden md:flex gap-2">
              {(user.role === 'club') && (
                <button
                  onClick={onNavigateToPagos}
                  className="px-3 py-1 text-sm hover:bg-white/10 rounded transition-colors"
                >
                  💳 Pagos
                </button>
              )}
              {(user.role === 'admin') && (
                <>
                  <button
                    onClick={onNavigateToAdmin}
                    className="px-3 py-1 text-sm hover:bg-white/10 rounded transition-colors"
                  >
                    ⚙️ Admin
                  </button>
                  <button
                    onClick={onNavigateToPagos}
                    className="px-3 py-1 text-sm hover:bg-white/10 rounded transition-colors"
                  >
                    📊 Pagos
                  </button>
                </>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <p className="text-sm font-semibold">{user.nombre}</p>
                <p className="text-xs opacity-75 capitalize">{user.role}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <span className="text-sm">No autenticado</span>
          )}
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useGameStore } from './store/gameStore';
import { Header } from './components/Header';
import { LoginPage } from './pages/LoginPage';
import { RoleRouter } from './components/RoleRouter';
import './index.css';

function App() {
  const { user } = useGameStore();
  const [showMesaControl, setShowMesaControl] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-hockey-gris-claro">
      {user && <Header />}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {!user ? (
          <LoginPage />
        ) : (
          <div className="space-y-4">
            {/* Mostrar botones de control para usuarios mesa_control y admin */}
            {(user.role === 'mesa_control' || user.role === 'admin') && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMesaControl(false)}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    !showMesaControl
                      ? 'bg-hockey-verde-oscuro text-white'
                      : 'bg-white text-hockey-verde-oscuro hover:bg-gray-100'
                  }`}
                >
                  {user.role === 'admin' ? 'Panel Admin' : 'Vista Principal'}
                </button>
                <button
                  onClick={() => setShowMesaControl(true)}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    showMesaControl
                      ? 'bg-hockey-verde-oscuro text-white'
                      : 'bg-white text-hockey-verde-oscuro hover:bg-gray-100'
                  }`}
                >
                  Mesa de Control
                </button>
              </div>
            )}

            {/* Router de vistas según rol */}
            <RoleRouter showMesaControl={showMesaControl} />
          </div>
        )}
      </main>

      <footer className="bg-hockey-gris-oscuro text-white text-center py-4 mt-8">
        <p className="text-sm">© 2025 PURO HOCKEY - Sistema de Gestion de Torneos</p>
      </footer>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('friomusical@gmail.com');
  const [password, setPassword] = useState('admin');
  const { login, loading, error } = useGameStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      // Error ya está en el store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-hockey-verde-oscuro to-hockey-verde-medio flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-h2 font-bold text-hockey-verde-oscuro mb-2">🏆 PURO HOCKEY</h2>
          <p className="text-gray-600">Iniciar sesión</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <Button variant="primary" className="w-full" type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-gray-600 mb-2">📝 Demo credenciales:</p>
          <code className="text-xs bg-gray-100 p-2 block rounded mb-2">
            Email: friomusical@gmail.com<br/>
            Pass: admin
          </code>
          <p className="text-xs text-gray-500">O registra un nuevo usuario</p>
        </div>
      </Card>
    </div>
  );
};

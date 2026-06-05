import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Card } from '../components/Card';

export const PublicView: React.FC = () => {
  const { partidos, loading, fetchPartidos } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<'fixture' | 'tabla' | 'goleadores'>('fixture');

  useEffect(() => {
    fetchPartidos();
  }, [fetchPartidos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Cargando partidos...</p>
      </div>
    );
  }

  const goleadores = [
    { jugador: 'Juan Martínez', goles: 5, equipo: 'Ushuaia RC' },
    { jugador: 'María López', goles: 4, equipo: 'Club Las Malvinas' },
    { jugador: 'Carlos Ruiz', goles: 3, equipo: 'Colegio del Sur' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200">
        {(['fixture', 'tabla', 'goleadores'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 font-semibold transition-all ${
              selectedTab === tab
                ? 'text-hockey-verde-oscuro border-b-2 border-hockey-verde-oscuro'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab === 'fixture' && '📅 Fixture'}
            {tab === 'tabla' && '📊 Tabla'}
            {tab === 'goleadores' && '⚽ Goleadores'}
          </button>
        ))}
      </div>

      {selectedTab === 'fixture' && (
        <div className="grid gap-4 md:grid-cols-2">
          {partidos.length === 0 ? (
            <p className="text-gray-600">No hay partidos registrados</p>
          ) : (
            partidos.map((partido) => (
              <Card key={partido.id} title={partido.categoria}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold">{partido.equipo_a_nombre}</p>
                    </div>
                    <div className="text-center px-3">
                      <div className="text-4xl font-bold text-hockey-verde-oscuro">
                        {partido.goles_a} - {partido.goles_b}
                      </div>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-semibold">{partido.equipo_b_nombre}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded">
                    <span>{partido.fecha} {partido.hora}</span>
                    <span className={`font-semibold ${
                      partido.estado === 'en_juego' ? 'text-hockey-verde-claro' :
                      partido.estado === 'finalizado' ? 'text-gray-600' :
                      'text-yellow-600'
                    }`}>
                      {partido.estado === 'en_juego' ? '🔴 EN VIVO' :
                       partido.estado === 'finalizado' ? '✓ Finalizado' :
                       'Pendiente'}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedTab === 'tabla' && (
        <Card title="Tabla de Posiciones">
          {partidos.length === 0 ? (
            <p className="text-gray-600">No hay datos de tabla</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left px-2 py-2">Pos</th>
                  <th className="text-left px-2 py-2">Equipo</th>
                  <th className="text-center px-2 py-2">PJ</th>
                  <th className="text-center px-2 py-2">Pts</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2 font-bold">{i}</td>
                    <td className="px-2 py-2">Equipo {i}</td>
                    <td className="px-2 py-2 text-center">{5}</td>
                    <td className="px-2 py-2 text-center font-bold">{15 - i * 2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {selectedTab === 'goleadores' && (
        <div className="grid gap-4">
          {goleadores.map((g, idx) => (
            <Card key={idx} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{g.jugador}</p>
                <p className="text-xs text-gray-600">{g.equipo}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-hockey-verde-oscuro">⚽</div>
                <p className="text-lg font-bold">{g.goles}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

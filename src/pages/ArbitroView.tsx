import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { asignacionesService } from '../services/api';
import { useGameStore } from '../store/gameStore';

interface PartidoAsignacion {
  id: string;
  fecha: string;
  hora: string;
  equipo_a: string;
  equipo_b: string;
  categoria: string;
  cancha: string;
  estado: 'pendiente' | 'en_curso' | 'finalizado';
  resultado?: string;
}

interface CalendarioEvento {
  fecha: string;
  partidos: number;
}

export const ArbitroView: React.FC = () => {
  const { user } = useGameStore();
  const [activeTab, setActiveTab] = useState<'asignaciones' | 'calendario' | 'historial'>('asignaciones');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todas');

  const [asignaciones, setAsignaciones] = useState<PartidoAsignacion[]>([]);
  const [calendario, setCalendario] = useState<CalendarioEvento[]>([]);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingCalendario, setLoadingCalendario] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar asignaciones al montar
  useEffect(() => {
    const fetchAsignaciones = async () => {
      try {
        if (user?.id) {
          const res = await asignacionesService.getAsignacionesArbitro(user.id);
          setAsignaciones(res.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar asignaciones');
      } finally {
        setLoadingAsignaciones(false);
      }
    };

    fetchAsignaciones();
  }, [user?.id]);

  // Cargar calendario
  useEffect(() => {
    const fetchCalendario = async () => {
      try {
        const res = await asignacionesService.getCalendario();
        setCalendario(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar calendario');
      } finally {
        setLoadingCalendario(false);
      }
    };

    fetchCalendario();
  }, []);

  const categorias = ['Todas', 'Sub 12', 'Sub 14', '1ra División', '2da División'];
  const estados = ['Todas', 'Pendiente', 'En Curso', 'Finalizado'];

  const filtrarAsignaciones = () => {
    return asignaciones.filter((asignacion) => {
      const categoriaOk = filtroCategoria === 'todas' || asignacion.categoria === filtroCategoria;
      const estadoOk = filtroEstado === 'todas' || asignacion.estado === filtroEstado.toLowerCase().replace(' ', '_');
      return categoriaOk && estadoOk;
    });
  };

  const estadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_curso':
        return 'bg-green-100 text-green-800';
      case 'finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_curso':
        return 'En Curso';
      case 'finalizado':
        return 'Finalizado';
      default:
        return estado;
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline mt-2"
          >
            Descartar
          </button>
        </div>
      )}

      <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-6 rounded-lg">
        <h1 className="text-h1 font-bold mb-2">Panel de Árbitro</h1>
        <p className="text-sm opacity-90">Consulta tus asignaciones y participa en los partidos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('asignaciones')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'asignaciones'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Mis Asignaciones
        </button>
        <button
          onClick={() => setActiveTab('calendario')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'calendario'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Calendario
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'historial'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Historial
        </button>
      </div>

      {/* ASIGNACIONES TAB */}
      {activeTab === 'asignaciones' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <label className="block text-sm font-semibold mb-2">Filtrar por Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="input-field"
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </Card>
            <Card>
              <label className="block text-sm font-semibold mb-2">Filtrar por Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="input-field"
              >
                {estados.map((est) => (
                  <option key={est} value={est.toLowerCase()}>{est}</option>
                ))}
              </select>
            </Card>
          </div>

          <Card title="Partidos Asignados">
            <div className="space-y-3">
              {filtrarAsignaciones().length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay asignaciones con los filtros seleccionados</p>
              ) : (
                filtrarAsignaciones().map((partido) => (
                  <div
                    key={partido.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 uppercase mb-1">{partido.fecha} - {partido.hora}</p>
                        <p className="font-bold text-lg">
                          {partido.equipo_a} <span className="text-gray-400 mx-2">vs</span> {partido.equipo_b}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-3 ${estadoColor(partido.estado)}`}>
                        {getEstadoTexto(partido.estado)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600 text-xs">Categoría</p>
                        <p className="font-semibold">{partido.categoria}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Cancha</p>
                        <p className="font-semibold">{partido.cancha}</p>
                      </div>
                      {partido.resultado && (
                        <div>
                          <p className="text-gray-600 text-xs">Resultado</p>
                          <p className="font-semibold text-lg">{partido.resultado}</p>
                        </div>
                      )}
                    </div>

                    {partido.estado === 'pendiente' && (
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" className="flex-1">
                          Confirmar Asistencia
                        </Button>
                        <Button variant="secondary" size="sm">
                          Justificar Ausencia
                        </Button>
                      </div>
                    )}
                    {partido.estado === 'en_curso' && (
                      <Button variant="primary" size="sm" className="w-full">
                        Ir a Mesa de Control
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}

      {/* CALENDARIO TAB */}
      {activeTab === 'calendario' && (
        <Card title="Calendario de Partidos">
          <div className="space-y-2">
            {calendario.map((evento, idx) => {
              const fecha = new Date(evento.fecha);
              const diaSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][fecha.getDay()];
              const dia = fecha.getDate();

              return (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center bg-purple-100 px-4 py-2 rounded">
                      <p className="text-xs font-semibold text-purple-600">{diaSemana}</p>
                      <p className="text-2xl font-bold text-purple-600">{dia}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{evento.fecha}</p>
                      <p className="text-sm text-gray-600">{evento.partidos} partido(s) asignados</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* HISTORIAL TAB */}
      {activeTab === 'historial' && (
        <Card title="Historial de Partidos">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Partido</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Resultado</th>
                  <th className="text-left p-3">Cancha</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones
                  .filter((a) => a.estado === 'finalizado')
                  .map((partido) => (
                    <tr key={partido.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{partido.fecha} {partido.hora}</td>
                      <td className="p-3 font-semibold">
                        {partido.equipo_a} vs {partido.equipo_b}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {partido.categoria}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-lg">{partido.resultado}</td>
                      <td className="p-3 text-gray-600">{partido.cancha}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100">
          <p className="text-4xl font-bold text-purple-600">
            {asignaciones.filter((a) => a.estado === 'pendiente').length}
          </p>
          <p className="text-gray-600 text-sm mt-2">Asignaciones Pendientes</p>
        </Card>
        <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100">
          <p className="text-4xl font-bold text-green-600">
            {asignaciones.filter((a) => a.estado === 'finalizado').length}
          </p>
          <p className="text-gray-600 text-sm mt-2">Partidos Dirigidos</p>
        </Card>
        <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <p className="text-4xl font-bold text-blue-600">
            {calendario.reduce((sum, c) => sum + c.partidos, 0)}
          </p>
          <p className="text-gray-600 text-sm mt-2">Partidos Próximos</p>
        </Card>
      </div>
    </div>
  );
};

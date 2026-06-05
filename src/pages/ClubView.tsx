import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SearchInput } from '../components/SearchInput';
import { equiposService, jugadoresService } from '../services/api';
import { useGameStore } from '../store/gameStore';

interface ClubJugador {
  id: string;
  nombre: string;
  dorsal: number;
  posicion: string;
  categoria: string;
}

interface ClubEquipo {
  id: string;
  nombre: string;
  categoria: string;
  jugadores: number;
  estado: 'activo' | 'inactivo';
}

interface ClubTorneoParticipacion {
  id: string;
  torneo: string;
  equipo: string;
  categoria: string;
  posicion: number;
  puntos: number;
  pj: number;
  pg: number;
  pp: number;
  gf: number;
  gc: number;
}

export const ClubView: React.FC = () => {
  const { user } = useGameStore();
  const { toasts, showToast, removeToast } = useToast();

  const [activeTab, setActiveTab] = useState<'equipos' | 'jugadores' | 'torneos'>('equipos');
  const [showJugadorModal, setShowJugadorModal] = useState(false);
  const [showEquipoModal, setShowEquipoModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [selectedEquipo, setSelectedEquipo] = useState<ClubEquipo | null>(null);
  const [editingEquipo, setEditingEquipo] = useState<any | null>(null);
  const [editingJugador, setEditingJugador] = useState<any | null>(null);

  const [jugadorForm, setJugadorForm] = useState({ nombre: '', dorsal: '', posicion: '', categoria: '' });
  const [equipoForm, setEquipoForm] = useState({ nombre: '', categoria: '' });

  const [equipos, setEquipos] = useState<ClubEquipo[]>([]);
  const [jugadores, setJugadores] = useState<ClubJugador[]>([]);
  const [searchEquipos, setSearchEquipos] = useState('');
  const [searchJugadores, setSearchJugadores] = useState('');
  const [loadingEquipos, setLoadingEquipos] = useState(true);
  const [loadingJugadores, setLoadingJugadores] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar equipos al montar
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const res = await equiposService.getAll();
        setEquipos(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar equipos');
      } finally {
        setLoadingEquipos(false);
      }
    };

    fetchEquipos();
  }, []);

  // Cargar jugadores
  useEffect(() => {
    const fetchJugadores = async () => {
      try {
        const res = await jugadoresService.getAll();
        setJugadores(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar jugadores');
      } finally {
        setLoadingJugadores(false);
      }
    };

    fetchJugadores();
  }, []);

  const [torneos] = useState<ClubTorneoParticipacion[]>([
    {
      id: '1',
      torneo: 'Torneo Apertura 2025',
      equipo: 'Club A - Sub 12',
      categoria: 'Sub 12',
      posicion: 2,
      puntos: 18,
      pj: 8,
      pg: 6,
      pp: 0,
      gf: 32,
      gc: 12
    },
    {
      id: '2',
      torneo: 'Torneo Apertura 2025',
      equipo: 'Club A - Sub 14',
      categoria: 'Sub 14',
      posicion: 3,
      puntos: 16,
      pj: 8,
      pg: 5,
      pp: 1,
      gf: 28,
      gc: 15
    },
    {
      id: '3',
      torneo: 'Torneo Apertura 2025',
      equipo: 'Club A - 1ra División',
      categoria: '1ra División',
      posicion: 1,
      puntos: 21,
      pj: 8,
      pg: 7,
      pp: 0,
      gf: 42,
      gc: 8
    },
  ]);

  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (confirmAction) {
      try {
        await confirmAction();
        showToast('Eliminado correctamente', 'success');
        setShowConfirm(false);
      } catch (err: any) {
        showToast(err.response?.data?.error || 'Error al eliminar', 'error');
      }
    }
  };

  const handleAgregarJugador = async () => {
    if (!jugadorForm.nombre.trim() || !selectedEquipo) {
      showToast('Nombre de jugador es requerido', 'warning');
      return;
    }
    try {
      const res = await jugadoresService.create({
        nombre: jugadorForm.nombre,
        numero_camiseta: parseInt(jugadorForm.dorsal) || null,
        posicion: jugadorForm.posicion || 'Volante',
        equipo_id: selectedEquipo.id,
      });
      setJugadores([...jugadores, res.data]);
      setJugadorForm({ nombre: '', dorsal: '', posicion: '', categoria: '' });
      setShowJugadorModal(false);
      showToast('Jugador agregado correctamente', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error al agregar jugador', 'error');
    }
  };

  const handleCrearEquipo = async () => {
    if (!equipoForm.nombre.trim() || !equipoForm.categoria) {
      showToast('Nombre y categoría son requeridos', 'warning');
      return;
    }
    try {
      const res = await equiposService.create({
        nombre: equipoForm.nombre,
        categoria_id: equipoForm.categoria,
        club_id: user?.id || 'default-club-id',
      });
      setEquipos([...equipos, res.data]);
      setEquipoForm({ nombre: '', categoria: '' });
      setShowEquipoModal(false);
      showToast('Equipo creado correctamente', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error al crear equipo', 'error');
    }
  };

  const handleEliminarJugador = (id: string) => {
    const jugador = jugadores.find((j) => j.id === id);
    openConfirmDialog(
      'Eliminar Jugador',
      `¿Estás seguro de que deseas eliminar a "${jugador?.nombre}"?`,
      async () => {
        await jugadoresService.delete(id);
        setJugadores(jugadores.filter((j) => j.id !== id));
      }
    );
  };

  const handleEliminarEquipo = (id: string) => {
    const equipo = equipos.find((e) => e.id === id);
    openConfirmDialog(
      'Eliminar Equipo',
      `¿Estás seguro de que deseas eliminar "${equipo?.nombre}"?`,
      async () => {
        await equiposService.delete(id);
        setEquipos(equipos.filter((e) => e.id !== id));
      }
    );
  };

  const filteredEquipos = equipos.filter((e) =>
    e.nombre.toLowerCase().includes(searchEquipos.toLowerCase())
  );

  const filteredJugadores = jugadores.filter((j) =>
    j.nombre.toLowerCase().includes(searchJugadores.toLowerCase())
  );

  const categorias = ['Sub 12', 'Sub 14', '1ra División', '2da División', 'Veteranos'];
  const posiciones = ['Arquero', 'Defensa', 'Volante', 'Delantera'];

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2 z-40">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        title={confirmTitle}
        message={confirmMessage}
        isDangerous={true}
        confirmText="Eliminar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />

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

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-lg">
        <h1 className="text-h1 font-bold mb-2">Gestión de Club</h1>
        <p className="text-sm opacity-90">Administra tus equipos, jugadores y participaciones en torneos</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('equipos')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'equipos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Equipos
        </button>
        <button
          onClick={() => setActiveTab('jugadores')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'jugadores'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Jugadores
        </button>
        <button
          onClick={() => setActiveTab('torneos')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'torneos'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Torneos
        </button>
      </div>

      {/* EQUIPOS TAB */}
      {activeTab === 'equipos' && (
        <Card title="Equipos del Club" className="space-y-4">
          <Button variant="primary" onClick={() => {
            setEditingEquipo(null);
            setEquipoForm({ nombre: '', categoria: '' });
            setShowEquipoModal(true);
          }}>
            + Crear Nuevo Equipo
          </Button>

          <SearchInput
            placeholder="Buscar equipo..."
            value={searchEquipos}
            onChange={setSearchEquipos}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEquipos.map((equipo) => (
              <div key={equipo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{equipo.nombre}</h3>
                    <p className="text-sm text-gray-600">{equipo.categoria}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    equipo.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {equipo.estado}
                  </span>
                </div>
                <p className="text-sm mb-4 text-gray-700">
                  <span className="font-semibold">{equipo.jugadores}</span> jugadores
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedEquipo(equipo)}
                    className="flex-1"
                  >
                    Ver Detalles
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* JUGADORES TAB */}
      {activeTab === 'jugadores' && (
        <Card title="Listado de Jugadores" className="space-y-4">
          <Button variant="primary" onClick={() => {
            setEditingJugador(null);
            setJugadorForm({ nombre: '', dorsal: '', posicion: '', categoria: '' });
            setShowJugadorModal(true);
          }}>
            + Agregar Jugador
          </Button>

          <SearchInput
            placeholder="Buscar jugador..."
            value={searchJugadores}
            onChange={setSearchJugadores}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Dorsal</th>
                  <th className="text-left p-3">Posición</th>
                  <th className="text-left p-3">Categoría</th>
                  <th className="text-left p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredJugadores.map((jugador) => (
                  <tr key={jugador.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold">{jugador.nombre}</td>
                    <td className="p-3">#{jugador.dorsal}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {jugador.posicion}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{jugador.categoria}</td>
                    <td className="p-3 space-x-2">
                      <Button variant="secondary" size="sm">Editar</Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleEliminarJugador(jugador.id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TORNEOS TAB */}
      {activeTab === 'torneos' && (
        <Card title="Participaciones en Torneos" className="space-y-4">
          <div className="space-y-4">
            {torneos.map((torneo) => (
              <div key={torneo.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Torneo</p>
                    <p className="font-bold text-sm">{torneo.torneo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Equipo</p>
                    <p className="font-bold text-sm">{torneo.equipo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Posición</p>
                    <p className="font-bold text-lg text-blue-600">#{torneo.posicion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold">Puntos</p>
                    <p className="font-bold text-lg">{torneo.puntos}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                    <div>
                      <p className="text-gray-600">PJ</p>
                      <p className="font-bold">{torneo.pj}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">PG</p>
                      <p className="font-bold text-green-600">{torneo.pg}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">PP</p>
                      <p className="font-bold text-red-600">{torneo.pp}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">GF</p>
                      <p className="font-bold text-blue-600">{torneo.gf}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">GC</p>
                      <p className="font-bold">{torneo.gc}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">DG</p>
                      <p className="font-bold">{torneo.gf - torneo.gc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* MODAL: Crear Equipo */}
      <Modal
        isOpen={showEquipoModal}
        title="Crear Nuevo Equipo"
        onClose={() => setShowEquipoModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre del Equipo</label>
            <input
              type="text"
              value={equipoForm.nombre}
              onChange={(e) => setEquipoForm({ ...equipoForm, nombre: e.target.value })}
              className="input-field"
              placeholder="Ej: Club A - Sub 12"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Categoría</label>
            <select
              value={equipoForm.categoria}
              onChange={(e) => setEquipoForm({ ...equipoForm, categoria: e.target.value })}
              className="input-field"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" className="w-full" onClick={handleCrearEquipo}>
            Crear Equipo
          </Button>
        </div>
      </Modal>

      {/* MODAL: Agregar Jugador */}
      <Modal
        isOpen={showJugadorModal}
        title="Agregar Jugador"
        onClose={() => setShowJugadorModal(false)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input
              type="text"
              value={jugadorForm.nombre}
              onChange={(e) => setJugadorForm({ ...jugadorForm, nombre: e.target.value })}
              className="input-field"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Dorsal</label>
            <input
              type="number"
              value={jugadorForm.dorsal}
              onChange={(e) => setJugadorForm({ ...jugadorForm, dorsal: e.target.value })}
              className="input-field"
              placeholder="1"
              min="1"
              max="99"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Posición</label>
            <select
              value={jugadorForm.posicion}
              onChange={(e) => setJugadorForm({ ...jugadorForm, posicion: e.target.value })}
              className="input-field"
            >
              <option value="">Selecciona posición</option>
              {posiciones.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Categoría</label>
            <select
              value={jugadorForm.categoria}
              onChange={(e) => setJugadorForm({ ...jugadorForm, categoria: e.target.value })}
              className="input-field"
            >
              <option value="">Selecciona categoría</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <Button variant="primary" className="w-full" onClick={handleAgregarJugador}>
            Agregar
          </Button>
        </div>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { Toast, useToast } from '../components/Toast';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SearchInput } from '../components/SearchInput';
import { AdminPricingManager } from '../components/AdminPricingManager';
import { PagosView } from './PagosView';
import { torneosService, usuariosService } from '../services/api';

interface AdminViewProps {
  activeTab?: 'torneos' | 'usuarios' | 'planes' | 'pagos';
}

export const AdminView: React.FC<AdminViewProps> = ({ activeTab: initialTab = 'torneos' }) => {
  const { toasts, showToast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<'torneos' | 'usuarios' | 'planes' | 'pagos'>(initialTab);

  const [showTorneoModal, setShowTorneoModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  const [torneoName, setTorneoName] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('club');

  const [editingTorneo, setEditingTorneo] = useState<any | null>(null);
  const [editingUsuario, setEditingUsuario] = useState<any | null>(null);

  const [torneos, setTorneos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [searchTorneos, setSearchTorneos] = useState('');
  const [searchUsuarios, setSearchUsuarios] = useState('');
  const [loadingTorneos, setLoadingTorneos] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [torneosRes, usuariosRes] = await Promise.all([
          torneosService.getAll(),
          usuariosService.getAll(),
        ]);
        setTorneos(torneosRes.data);
        setUsuarios(usuariosRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar datos');
        console.error('Error:', err);
      } finally {
        setLoadingTorneos(false);
        setLoadingUsuarios(false);
      }
    };

    fetchData();
  }, []);

  const handleCrearTorneo = async () => {
    if (!torneoName.trim()) return;
    try {
      const res = await torneosService.create({
        nombre: torneoName,
        fecha_inicio: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
      });
      setTorneos([...torneos, res.data]);
      setTorneoName('');
      setShowTorneoModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear torneo');
    }
  };

  const handleCrearUsuario = async () => {
    if (!userName.trim() || !userEmail.trim()) return;
    try {
      const res = await usuariosService.create({
        nombre: userName,
        email: userEmail,
        role: userRole,
        password: 'password123', // Contraseña por defecto
      });
      setUsuarios([...usuarios, res.data]);
      setUserName('');
      setUserEmail('');
      setUserRole('club');
      setShowUserModal(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    }
  };

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

  const handleEliminarTorneo = (id: string) => {
    const torneo = torneos.find((t) => t.id === id);
    openConfirmDialog(
      'Eliminar Torneo',
      `¿Estás seguro de que deseas eliminar "${torneo?.nombre}"?`,
      async () => {
        await torneosService.delete(id);
        setTorneos(torneos.filter((t) => t.id !== id));
      }
    );
  };

  const handleEliminarUsuario = (id: string) => {
    const usuario = usuarios.find((u) => u.id === id);
    openConfirmDialog(
      'Eliminar Usuario',
      `¿Estás seguro de que deseas eliminar a "${usuario?.nombre}"?`,
      async () => {
        await usuariosService.delete(id);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      }
    );
  };

  const handleEditarTorneo = (torneo: any) => {
    setEditingTorneo(torneo);
    setTorneoName(torneo.nombre);
    setShowTorneoModal(true);
  };

  const handleEditarUsuario = (usuario: any) => {
    setEditingUsuario(usuario);
    setUserName(usuario.nombre);
    setUserEmail(usuario.email);
    setUserRole(usuario.role);
    setShowUserModal(true);
  };

  const handleGuardarTorneo = async () => {
    if (!torneoName.trim()) {
      showToast('El nombre del torneo es requerido', 'warning');
      return;
    }
    try {
      if (editingTorneo) {
        const res = await torneosService.update(editingTorneo.id, {
          nombre: torneoName,
        });
        setTorneos(torneos.map((t) => (t.id === editingTorneo.id ? res.data : t)));
        showToast('Torneo actualizado correctamente', 'success');
      } else {
        const res = await torneosService.create({
          nombre: torneoName,
          fecha_inicio: new Date().toISOString().split('T')[0],
          estado: 'pendiente',
        });
        setTorneos([...torneos, res.data]);
        showToast('Torneo creado correctamente', 'success');
      }
      setTorneoName('');
      setEditingTorneo(null);
      setShowTorneoModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error al guardar torneo', 'error');
    }
  };

  const handleGuardarUsuario = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      showToast('Nombre y email son requeridos', 'warning');
      return;
    }
    try {
      if (editingUsuario) {
        const res = await usuariosService.update(editingUsuario.id, {
          nombre: userName,
          role: userRole,
        });
        setUsuarios(usuarios.map((u) => (u.id === editingUsuario.id ? res.data : u)));
        showToast('Usuario actualizado correctamente', 'success');
      } else {
        const res = await usuariosService.create({
          nombre: userName,
          email: userEmail,
          role: userRole,
          password: 'password123',
        });
        setUsuarios([...usuarios, res.data]);
        showToast('Usuario creado correctamente', 'success');
      }
      setUserName('');
      setUserEmail('');
      setUserRole('club');
      setEditingUsuario(null);
      setShowUserModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error al guardar usuario', 'error');
    }
  };

  const filteredTorneos = torneos.filter((t) =>
    t.nombre.toLowerCase().includes(searchTorneos.toLowerCase())
  );

  const filteredUsuarios = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(searchUsuarios.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUsuarios.toLowerCase())
  );

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

      {/* HEADER CON TABS */}
      <div className="bg-gradient-to-r from-hockey-verde-oscuro to-hockey-verde-claro text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">⚙️ Panel de Administración</h1>

        <div className="flex gap-2 border-b border-white/20 flex-wrap">
          <button
            onClick={() => setActiveTab('torneos')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'torneos'
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            🏆 Torneos
          </button>
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'usuarios'
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setActiveTab('planes')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'planes'
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            💰 Planes de Pago
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`px-4 py-2 font-semibold border-b-2 transition-all ${
              activeTab === 'pagos'
                ? 'border-white text-white'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            📊 Pagos
          </button>
        </div>
      </div>

      {/* SECCIÓN DE TORNEOS */}
      {activeTab === 'torneos' && (
      <Card title="Torneos" className="space-y-4">
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => {
            setEditingTorneo(null);
            setTorneoName('');
            setShowTorneoModal(true);
          }} className="flex-1">
            + Crear Nuevo Torneo
          </Button>
        </div>

        <SearchInput
          placeholder="Buscar torneo..."
          value={searchTorneos}
          onChange={setSearchTorneos}
        />

        <div className="space-y-2">
          {filteredTorneos.map((torneo) => (
            <div key={torneo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-semibold">{torneo.nombre}</p>
                <p className="text-xs text-gray-600">
                  Estado: <span className={`font-bold ${torneo.estado === 'en_curso' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {torneo.estado}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEditarTorneo(torneo)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleEliminarTorneo(torneo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      )}

      {/* SECCIÓN DE USUARIOS */}
      {activeTab === 'usuarios' && (
      <Card title="Usuarios del Sistema" className="space-y-4">
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => {
            setEditingUsuario(null);
            setUserName('');
            setUserEmail('');
            setUserRole('club');
            setShowUserModal(true);
          }} className="flex-1">
            + Crear Nuevo Usuario
          </Button>
        </div>

        <SearchInput
          placeholder="Buscar usuario..."
          value={searchUsuarios}
          onChange={setSearchUsuarios}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Rol</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.nombre}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 bg-hockey-verde-claro text-white text-xs rounded-full capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditarUsuario(user)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleEliminarUsuario(user.id)}
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

      {/* Estadísticas - mostrar en ambas tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <p className="text-4xl font-bold text-hockey-verde-oscuro">{torneos.length}</p>
          <p className="text-gray-600 text-sm">Torneos Activos</p>
        </Card>
        <Card className="text-center p-6">
          <p className="text-4xl font-bold text-hockey-verde-oscuro">{usuarios.length}</p>
          <p className="text-gray-600 text-sm">Usuarios Registrados</p>
        </Card>
        <Card className="text-center p-6">
          <p className="text-4xl font-bold text-hockey-verde-oscuro">24</p>
          <p className="text-gray-600 text-sm">Partidos Esta Semana</p>
        </Card>
      </div>
      )}

      <Modal
        isOpen={showTorneoModal}
        title={editingTorneo ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        onClose={() => {
          setShowTorneoModal(false);
          setEditingTorneo(null);
          setTorneoName('');
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre del Torneo</label>
            <input
              type="text"
              value={torneoName}
              onChange={(e) => setTorneoName(e.target.value)}
              className="input-field"
              placeholder="Torneo Apertura 2025"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Fecha Inicio</label>
            <input type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Fecha Fin</label>
            <input type="date" className="input-field" />
          </div>
          <Button variant="primary" className="w-full" onClick={handleGuardarTorneo}>
            {editingTorneo ? 'Guardar Cambios' : 'Crear Torneo'}
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showUserModal}
        title={editingUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        onClose={() => {
          setShowUserModal(false);
          setEditingUsuario(null);
          setUserName('');
          setUserEmail('');
          setUserRole('club');
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="input-field"
              placeholder="Juan Perez"
            />
          </div>
          {!editingUsuario && (
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="input-field"
                placeholder="usuario@example.com"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2">Rol</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="input-field"
            >
              <option value="club">Club</option>
              <option value="arbitro">Arbitro</option>
              <option value="mesa_control">Mesa de Control</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button variant="primary" className="w-full" onClick={handleGuardarUsuario}>
            {editingUsuario ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </Modal>

      {/* SECCIÓN DE PLANES DE PAGO */}
      {activeTab === 'planes' && (
        <div>
          <AdminPricingManager onSave={(plans, bankInfo) => {
            showToast('Configuración de planes guardada', 'success');
          }} />
        </div>
      )}

      {/* SECCIÓN DE PAGOS */}
      {activeTab === 'pagos' && (
        <PagosView userRole="admin" />
      )}
    </div>
  );
};

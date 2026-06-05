import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (email: string, password: string, nombre: string, role: string) =>
    apiClient.post('/auth/register', { email, password, nombre, role }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const partidosService = {
  getAll: (params?: any) => apiClient.get('/partidos', { params }),
  getById: (id: string) => apiClient.get(`/partidos/${id}`),
  create: (data: any) => apiClient.post('/partidos', data),
  updateMarcador: (id: string, goles_a: number, goles_b: number, estado: string) =>
    apiClient.put(`/partidos/${id}/marcador`, { goles_a, goles_b, estado }),
  getEventos: (id: string) => apiClient.get(`/partidos/${id}/eventos`),
  registrarEvento: (id: string, tipo: string, equipo_id: string, jugador_id?: string, minuto?: number) =>
    apiClient.post(`/partidos/${id}/eventos`, { tipo, equipo_id, jugador_id, minuto }),
};

export const torneosService = {
  getAll: () => apiClient.get('/torneos'),
  getById: (id: string) => apiClient.get(`/torneos/${id}`),
  create: (data: any) => apiClient.post('/torneos', data),
  update: (id: string, data: any) => apiClient.put(`/torneos/${id}`, data),
  delete: (id: string) => apiClient.delete(`/torneos/${id}`),
};

export const equiposService = {
  getAll: () => apiClient.get('/equipos'),
  getById: (id: string) => apiClient.get(`/equipos/${id}`),
  getByClub: (clubId: string) => apiClient.get(`/equipos/club/${clubId}`),
  create: (data: any) => apiClient.post('/equipos', data),
  update: (id: string, data: any) => apiClient.put(`/equipos/${id}`, data),
  delete: (id: string) => apiClient.delete(`/equipos/${id}`),
};

export const jugadoresService = {
  getAll: () => apiClient.get('/jugadores'),
  getById: (id: string) => apiClient.get(`/jugadores/${id}`),
  getByEquipo: (equipoId: string) => apiClient.get(`/jugadores/equipo/${equipoId}`),
  create: (data: any) => apiClient.post('/jugadores', data),
  update: (id: string, data: any) => apiClient.put(`/jugadores/${id}`, data),
  delete: (id: string) => apiClient.delete(`/jugadores/${id}`),
};

export const usuariosService = {
  getAll: () => apiClient.get('/usuarios'),
  getById: (id: string) => apiClient.get(`/usuarios/${id}`),
  create: (data: any) => apiClient.post('/usuarios', data),
  update: (id: string, data: any) => apiClient.put(`/usuarios/${id}`, data),
  delete: (id: string) => apiClient.delete(`/usuarios/${id}`),
};

export const asignacionesService = {
  getCalendario: () => apiClient.get('/asignaciones/calendario'),
  getPartidosByFecha: (fecha: string) => apiClient.get(`/asignaciones/calendario/${fecha}`),
  getAsignacionesArbitro: (arbitroId: string) => apiClient.get(`/asignaciones/arbitro/${arbitroId}`),
  getAll: () => apiClient.get('/asignaciones'),
  assignArbitro: (partidoId: string, arbitroId: string) =>
    apiClient.post('/asignaciones/assign', { partidoId, arbitroId }),
  unassignArbitro: (partidoId: string) => apiClient.delete(`/asignaciones/unassign/${partidoId}`),
};

export const pagosService = {
  // Obtener pagos de un torneo
  getByTorneo: (torneoId: string) => apiClient.get(`/pagos/torneo/${torneoId}`),

  // Obtener todos los pagos (admin)
  getAll: (params?: any) => apiClient.get('/pagos', { params }),

  // Crear solicitud de pago (club sube comprobante)
  crear: (data: {
    torneo_id: string;
    plan_id: string;
    comprobante_url: string;
    numero_referencia: string;
    fecha_transferencia: string;
  }) => apiClient.post('/pagos', data),

  // Confirmar pago (admin valida comprobante)
  confirmar: (pagoId: string, notas?: string) =>
    apiClient.put(`/pagos/${pagoId}/confirmar`, { notas }),

  // Rechazar pago (admin rechaza comprobante)
  rechazar: (pagoId: string, motivo: string) =>
    apiClient.put(`/pagos/${pagoId}/rechazar`, { motivo }),

  // Obtener pendientes de confirmación
  getPendientes: () => apiClient.get('/pagos/pendientes'),
};

export default apiClient;

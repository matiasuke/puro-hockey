import { create } from 'zustand';
import { authService, partidosService } from '../services/api';
import type { Partido, User, Evento } from '../types';

interface GameState {
  user: User | null;
  partidos: Partido[];
  partidoActual: Partido | null;
  loading: boolean;
  error: string | null;
  
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setPartidos: (partidos: Partido[]) => void;
  setPartidoActual: (partido: Partido | null) => void;
  fetchPartidos: () => Promise<void>;
  registrarEvento: (tipo: Evento['tipo'], equipoId: string, jugador: string, minuto: string) => Promise<void>;
  actualizarMarcador: (goles_a: number, goles_b: number, estado: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  user: null,
  partidos: [],
  partidoActual: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, loading: false });
    } catch (err: any) {
      const error = err.response?.data?.error || 'Error al iniciar sesión';
      set({ error, loading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, partidoActual: null, partidos: [] });
  },

  setPartidos: (partidos) => set({ partidos }),

  setPartidoActual: (partido) => set({ partidoActual: partido }),

  fetchPartidos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await partidosService.getAll();
      set({ partidos: response.data, loading: false });
    } catch (err: any) {
      const error = err.response?.data?.error || 'Error al obtener partidos';
      set({ error, loading: false });
    }
  },

  registrarEvento: async (tipo, equipoId, jugador, minuto) => {
    const estado = get();
    if (!estado.partidoActual) {
      set({ error: 'No hay partido seleccionado' });
      return;
    }

    set({ loading: true, error: null });
    try {
      await partidosService.registrarEvento(
        estado.partidoActual.id,
        tipo,
        equipoId,
        jugador,
        parseInt(minuto)
      );

      // Recargar eventos
      const eventosResponse = await partidosService.getEventos(estado.partidoActual.id);
      const actualizado = {
        ...estado.partidoActual,
        eventos: eventosResponse.data,
      };

      if (tipo === 'gol') {
        if (equipoId === estado.partidoActual.equipo_a_id) {
          actualizado.goles_a += 1;
        } else {
          actualizado.goles_b += 1;
        }
      }

      set({ partidoActual: actualizado, loading: false });
    } catch (err: any) {
      const error = err.response?.data?.error || 'Error al registrar evento';
      set({ error, loading: false });
    }
  },

  actualizarMarcador: async (goles_a, goles_b, estado) => {
    const state = get();
    if (!state.partidoActual) {
      set({ error: 'No hay partido seleccionado' });
      return;
    }

    set({ loading: true, error: null });
    try {
      await partidosService.updateMarcador(state.partidoActual.id, goles_a, goles_b, estado);
      const actualizado = {
        ...state.partidoActual,
        goles_a,
        goles_b,
        estado,
      };
      set({ partidoActual: actualizado, loading: false });
    } catch (err: any) {
      const error = err.response?.data?.error || 'Error al actualizar marcador';
      set({ error, loading: false });
    }
  },
}));

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Socket conectado:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Eventos del socket
export const socketEvents = {
  // Enviar eventos
  joinPartido: (partidoId: string) => {
    getSocket().emit('join-partido', partidoId);
  },

  registrarGol: (partidoId: string, equipo: string, jugador: string, minuto: string) => {
    getSocket().emit('gol', { partidoId, equipo, jugador, minuto });
  },

  registrarTarjeta: (partidoId: string, color: 'amarilla' | 'roja', equipo: string, jugador: string) => {
    getSocket().emit('tarjeta', { partidoId, color, equipo, jugador });
  },

  actualizarMarcador: (partidoId: string, goles_a: number, goles_b: number) => {
    getSocket().emit('marcador-actualizado', { partidoId, goles_a, goles_b });
  },

  cambiarCuarto: (partidoId: string, cuarto: number) => {
    getSocket().emit('cuarto-cambio', { partidoId, cuarto });
  },

  // Escuchar eventos
  onUserJoined: (callback: (data: any) => void) => {
    getSocket().on('user-joined', callback);
  },

  onGolRegistrado: (callback: (data: any) => void) => {
    getSocket().on('gol-registrado', callback);
  },

  onTarjetaRegistrada: (callback: (data: any) => void) => {
    getSocket().on('tarjeta-registrada', callback);
  },

  onMarcadorCambio: (callback: (data: any) => void) => {
    getSocket().on('marcador-cambio', callback);
  },

  onCuartoActualizado: (callback: (data: any) => void) => {
    getSocket().on('cuarto-actualizado', callback);
  },

  // Dejar de escuchar
  offUserJoined: () => {
    getSocket().off('user-joined');
  },

  offGolRegistrado: () => {
    getSocket().off('gol-registrado');
  },

  offTarjetaRegistrada: () => {
    getSocket().off('tarjeta-registrada');
  },

  offMarcadorCambio: () => {
    getSocket().off('marcador-cambio');
  },

  offCuartoActualizado: () => {
    getSocket().off('cuarto-actualizado');
  },
};

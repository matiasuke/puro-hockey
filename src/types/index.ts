export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'admin' | 'club' | 'arbitro' | 'mesa_control' | 'public';
  club_id?: string;
}

export interface Equipo {
  id: string;
  nombre: string;
  club_id: string;
  categoria_id: string;
  goles: number;
  goles_contra: number;
  partidos_jugados: number;
}

export interface Evento {
  id: number;
  tipo: 'gol' | 'tarjeta_amarilla' | 'tarjeta_roja';
  equipo: string;
  jugador: string;
  minuto: string;
  timestamp?: number;
}

export interface Partido {
  id: string;
  equipo_a_id: string;
  equipo_b_id: string;
  equipo_a_nombre: string;
  equipo_b_nombre: string;
  goles_a: number;
  goles_b: number;
  categoria: string;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'en_juego' | 'finalizado';
  eventos: Evento[];
  cuarto_actual: number;
  tiempo_cuarto: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  genero: 'Masculino' | 'Femenino' | 'Mixto';
}

export interface Club {
  id: string;
  nombre: string;
  ciudad: string;
}

import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { partidosService } from '../services/api';
import { socketEvents, initSocket, getSocket } from '../services/socket';

export const MesaControl: React.FC = () => {
  const { partidoActual, setPartidoActual, registrarEvento, loading } = useGameStore();
  const [partidos, setPartidos] = useState<any[]>([]);
  const [showTarjetaModal, setShowTarjetaModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'a' | 'b'>('a');
  const [tarjetaColor, setTarjetaColor] = useState<'amarilla' | 'roja'>('amarilla');
  const [nombreJugador, setNombreJugador] = useState('');
  const [loadingPartidos, setLoadingPartidos] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Inicializar Socket.io
  useEffect(() => {
    initSocket();

    return () => {
      socketEvents.offUserJoined();
      socketEvents.offGolRegistrado();
      socketEvents.offTarjetaRegistrada();
      socketEvents.offMarcadorCambio();
      socketEvents.offCuartoActualizado();
    };
  }, []);

  // Cargar partidos y conectar a socket
  useEffect(() => {
    const fetchPartidos = async () => {
      try {
        const response = await partidosService.getAll();
        setPartidos(response.data);
        if (response.data.length > 0) {
          const firstPartido = response.data[0];
          const eventosResponse = await partidosService.getEventos(firstPartido.id);
          const updatedPartido = { ...firstPartido, eventos: eventosResponse.data };
          setPartidoActual(updatedPartido);

          // Unirse a la sala del partido
          socketEvents.joinPartido(firstPartido.id);
        }
      } catch (err) {
        console.error('Error al obtener partidos:', err);
      } finally {
        setLoadingPartidos(false);
      }
    };

    fetchPartidos();
  }, [setPartidoActual]);

  // Escuchar eventos en tiempo real
  useEffect(() => {
    if (!partidoActual) return;

    socketEvents.onGolRegistrado((data) => {
      setNotification(`⚽ GOOOL! ${data.equipo} - ${data.jugador}`);
      setTimeout(() => setNotification(null), 3000);

      // Actualizar estado local (opcional, depende de la API)
      if (data.equipo === partidoActual.equipo_a_nombre) {
        setPartidoActual({
          ...partidoActual,
          goles_a: (partidoActual.goles_a || 0) + 1,
        });
      } else {
        setPartidoActual({
          ...partidoActual,
          goles_b: (partidoActual.goles_b || 0) + 1,
        });
      }
    });

    socketEvents.onTarjetaRegistrada((data) => {
      const icon = data.color === 'amarilla' ? '🟡' : '🔴';
      setNotification(`${icon} TARJETA ${data.color.toUpperCase()} - ${data.jugador}`);
      setTimeout(() => setNotification(null), 3000);
    });

    socketEvents.onMarcadorCambio((data) => {
      if (partidoActual) {
        setPartidoActual({
          ...partidoActual,
          goles_a: data.goles_a,
          goles_b: data.goles_b,
        });
      }
    });

    socketEvents.onCuartoActualizado((data) => {
      if (partidoActual) {
        setPartidoActual({
          ...partidoActual,
          cuarto_actual: data.cuarto,
        });
      }
      setNotification(`⏱️ CUARTO ${data.cuarto}`);
      setTimeout(() => setNotification(null), 2000);
    });

    socketEvents.onUserJoined((data) => {
      console.log('Evento:', data.message);
    });

    return () => {
      socketEvents.offGolRegistrado();
      socketEvents.offTarjetaRegistrada();
      socketEvents.offMarcadorCambio();
      socketEvents.offCuartoActualizado();
    };
  }, [partidoActual, setPartidoActual]);

  if (loadingPartidos) {
    return <div className="flex items-center justify-center min-h-screen"><p>Cargando partidos...</p></div>;
  }

  if (!partidoActual) {
    return <div className="text-center text-gray-600"><p>No hay partidos disponibles</p></div>;
  }

  const handleGol = async (teamId: 'a' | 'b') => {
    const equipo_id = teamId === 'a' ? partidoActual.equipo_a_id : partidoActual.equipo_b_id;
    const equipo_nombre = teamId === 'a' ? partidoActual.equipo_a_nombre : partidoActual.equipo_b_nombre;
    const jugador = `Jugador ${Math.floor(Math.random() * 20) + 1}`;

    // Registrar en API
    await registrarEvento('gol', equipo_id, jugador, '00:00');

    // Enviar por WebSocket (broadcast a todos)
    socketEvents.registrarGol(partidoActual.id, equipo_nombre, jugador, '00:00');
  };

  const handleTarjeta = async () => {
    if (!nombreJugador.trim()) return;
    const tipo = tarjetaColor === 'amarilla' ? 'tarjeta_amarilla' : 'tarjeta_roja';
    const equipo_id = selectedTeam === 'a' ? partidoActual.equipo_a_id : partidoActual.equipo_b_id;
    const equipo_nombre = selectedTeam === 'a' ? partidoActual.equipo_a_nombre : partidoActual.equipo_b_nombre;

    // Registrar en API
    await registrarEvento(tipo, equipo_id, nombreJugador, '00:00');

    // Enviar por WebSocket
    socketEvents.registrarTarjeta(partidoActual.id, tarjetaColor, equipo_nombre, nombreJugador);

    setNombreJugador('');
    setShowTarjetaModal(false);
  };

  const handleCambiarCuarto = (nuevoQuarto: number) => {
    socketEvents.cambiarCuarto(partidoActual.id, nuevoQuarto);
    setPartidoActual({
      ...partidoActual,
      cuarto_actual: nuevoQuarto,
    });
  };

  return (
    <div className="space-y-6">
      {notification && (
        <div className="fixed top-4 right-4 bg-hockey-verde-oscuro text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <p className="text-lg font-bold">{notification}</p>
        </div>
      )}

      <Card className="bg-gradient-to-r from-hockey-verde-oscuro to-hockey-verde-medio text-white">
        <div className="space-y-4">
          <h2 className="text-h2 font-bold">{partidoActual.equipo_a_nombre} vs {partidoActual.equipo_b_nombre}</h2>
          <p className="text-sm opacity-90">{partidoActual.categoria} • {partidoActual.fecha} {partidoActual.hora}</p>

          <div className="flex justify-around items-center py-6 bg-white bg-opacity-10 rounded-lg">
            <div className="text-center flex-1">
              <p className="text-sm opacity-75">{partidoActual.equipo_a_nombre}</p>
              <div className="text-6xl font-bold">{partidoActual.goles_a}</div>
            </div>
            <div className="px-4">
              <p className="text-2xl opacity-75">-</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm opacity-75">{partidoActual.equipo_b_nombre}</p>
              <div className="text-6xl font-bold">{partidoActual.goles_b}</div>
            </div>
          </div>

          <div className="flex justify-between items-center bg-white bg-opacity-20 px-4 py-2 rounded">
            <span>Cuarto {partidoActual.cuarto_actual || 1} de 4</span>
            <span className="font-mono font-bold text-lg">EN VIVO 🔴</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card title={partidoActual.equipo_a_nombre} className="space-y-3 p-4">
          <Button
            variant="primary"
            className="w-full h-20 text-lg font-bold"
            onClick={() => handleGol('a')}
            disabled={loading}
          >
            ⚽ GOL
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSelectedTeam('a');
              setShowTarjetaModal(true);
            }}
            disabled={loading}
          >
            🟡 TARJETA
          </Button>
        </Card>

        <Card title={partidoActual.equipo_b_nombre} className="space-y-3 p-4">
          <Button
            variant="primary"
            className="w-full h-20 text-lg font-bold"
            onClick={() => handleGol('b')}
            disabled={loading}
          >
            ⚽ GOL
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSelectedTeam('b');
              setShowTarjetaModal(true);
            }}
            disabled={loading}
          >
            🟡 TARJETA
          </Button>
        </Card>
      </div>

      <Card title="Minuto a Minuto (EN VIVO)" className="max-h-96 overflow-y-auto border-2 border-hockey-verde-claro">
        <div className="space-y-2">
          {(!partidoActual.eventos || partidoActual.eventos.length === 0) ? (
            <p className="text-gray-500 text-sm">Sin eventos aún</p>
          ) : (
            partidoActual.eventos.map((evento) => (
              <div
                key={evento.id}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border-l-4 animate-slideIn"
                style={{borderColor: evento.tipo === 'gol' ? '#4CAF50' : '#FFC107'}}
              >
                <span className="text-2xl">
                  {evento.tipo === 'gol' ? '⚽' : evento.tipo === 'tarjeta_amarilla' ? '🟡' : '🔴'}
                </span>
                <div>
                  <p className="font-semibold text-sm">{evento.equipo}</p>
                  <p className="text-xs text-gray-600">{evento.jugador}</p>
                  <p className="text-xs text-gray-500">{evento.minuto}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card title="Control de Cuartos">
        <div className="flex gap-2 justify-between mb-4">
          {[1, 2, 3, 4].map((q) => (
            <Button
              key={q}
              variant={partidoActual.cuarto_actual === q ? 'primary' : 'secondary'}
              onClick={() => handleCambiarCuarto(q)}
              className="flex-1"
            >
              {q}
            </Button>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center">Cambios en tiempo real a todos los usuarios</p>
      </Card>

      <Modal isOpen={showTarjetaModal} title="Registrar Tarjeta" onClose={() => setShowTarjetaModal(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Equipo</label>
            <p className="text-sm text-gray-600">
              {selectedTeam === 'a' ? partidoActual.equipo_a_nombre : partidoActual.equipo_b_nombre}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Color</label>
            <div className="flex gap-2">
              <Button
                variant={tarjetaColor === 'amarilla' ? 'primary' : 'secondary'}
                onClick={() => setTarjetaColor('amarilla')}
                className="flex-1"
              >
                Amarilla
              </Button>
              <Button
                variant={tarjetaColor === 'roja' ? 'danger' : 'secondary'}
                onClick={() => setTarjetaColor('roja')}
                className="flex-1"
              >
                Roja
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nombre Jugador</label>
            <input
              type="text"
              value={nombreJugador}
              onChange={(e) => setNombreJugador(e.target.value)}
              className="input-field"
              placeholder="Nombre completo"
            />
          </div>

          <Button variant="primary" className="w-full" onClick={handleTarjeta} disabled={!nombreJugador.trim() || loading}>
            Registrar
          </Button>
        </div>
      </Modal>

      <div className="text-center text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
        <p className="font-semibold mb-2">🔌 WebSocket Conectado</p>
        <p>Los cambios se transmiten en tiempo real a todos los usuarios</p>
      </div>
    </div>
  );
};

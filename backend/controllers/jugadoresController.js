import Jugador from '../models/Jugador.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const jugadores = await Jugador.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Jugador.contar();

        res.json({
            success: true,
            data: jugadores,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugadores',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const jugador = await Jugador.obtenerPorId(req.params.id);

        if (!jugador) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        res.json({
            success: true,
            data: jugador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugador',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, numero_camiseta, equipo_id, posicion, estado } = req.body;

        if (!nombre || !numero_camiseta || !equipo_id || !posicion) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, número de camiseta, equipo_id y posición son requeridos'
            });
        }

        const jugador = await Jugador.crear({
            nombre,
            numero_camiseta,
            equipo_id,
            posicion,
            estado
        });

        res.status(201).json({
            success: true,
            message: 'Jugador creado exitosamente',
            data: jugador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear jugador',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, numero_camiseta, posicion, estado } = req.body;

        const jugador = await Jugador.actualizar(id, {
            nombre,
            numero_camiseta,
            posicion,
            estado
        });

        res.json({
            success: true,
            message: 'Jugador actualizado exitosamente',
            data: jugador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar jugador',
            error: error.message
        });
    }
};

export const obtenerPorEquipo = async (req, res) => {
    try {
        const { equipo_id } = req.params;
        const jugadores = await Jugador.obtenerPorEquipo(equipo_id);

        res.json({
            success: true,
            data: jugadores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugadores del equipo',
            error: error.message
        });
    }
};

export const obtenerPorPosicion = async (req, res) => {
    try {
        const { equipo_id, posicion } = req.params;
        const jugadores = await Jugador.obtenerPorPosicion(equipo_id, posicion);

        res.json({
            success: true,
            data: jugadores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener jugadores por posición',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const jugador = await Jugador.eliminar(id);

        if (!jugador) {
            return res.status(404).json({
                success: false,
                message: 'Jugador no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Jugador eliminado exitosamente',
            data: jugador
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar jugador',
            error: error.message
        });
    }
};

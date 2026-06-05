import Equipo from '../models/Equipo.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const equipos = await Equipo.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Equipo.contar();

        res.json({
            success: true,
            data: equipos,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener equipos',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const equipo = await Equipo.obtenerPorId(req.params.id);

        if (!equipo) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        res.json({
            success: true,
            data: equipo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener equipo',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, club_id, ciudad } = req.body;

        if (!nombre || !club_id) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y club_id son requeridos'
            });
        }

        const equipo = await Equipo.crear({ nombre, club_id, ciudad });

        res.status(201).json({
            success: true,
            message: 'Equipo creado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear equipo',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, ciudad } = req.body;

        const equipo = await Equipo.actualizar(id, { nombre, ciudad });

        res.json({
            success: true,
            message: 'Equipo actualizado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar equipo',
            error: error.message
        });
    }
};

export const obtenerPorClub = async (req, res) => {
    try {
        const { club_id } = req.params;
        const equipos = await Equipo.obtenerPorClub(club_id);

        res.json({
            success: true,
            data: equipos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener equipos del club',
            error: error.message
        });
    }
};

export const obtenerJugadores = async (req, res) => {
    try {
        const { id } = req.params;
        const jugadores = await Equipo.obtenerJugadores(id);

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

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const equipo = await Equipo.eliminar(id);

        if (!equipo) {
            return res.status(404).json({
                success: false,
                message: 'Equipo no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Equipo eliminado exitosamente',
            data: equipo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar equipo',
            error: error.message
        });
    }
};

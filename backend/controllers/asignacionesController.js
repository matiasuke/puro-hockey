import Asignacion from '../models/Asignacion.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const asignaciones = await Asignacion.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Asignacion.contar();

        res.json({
            success: true,
            data: asignaciones,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener asignaciones',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const asignacion = await Asignacion.obtenerPorId(req.params.id);

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: 'Asignación no encontrada'
            });
        }

        res.json({
            success: true,
            data: asignacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener asignación',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { torneo_id, equipo_id, club_id, estado } = req.body;

        if (!torneo_id || !equipo_id || !club_id) {
            return res.status(400).json({
                success: false,
                message: 'torneo_id, equipo_id y club_id son requeridos'
            });
        }

        const existe = await Asignacion.verificarExistencia(torneo_id, equipo_id);
        if (existe) {
            return res.status(400).json({
                success: false,
                message: 'El equipo ya está asignado a este torneo'
            });
        }

        const asignacion = await Asignacion.crear({
            torneo_id,
            equipo_id,
            club_id,
            estado
        });

        res.status(201).json({
            success: true,
            message: 'Asignación creada exitosamente',
            data: asignacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear asignación',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'Estado es requerido'
            });
        }

        const asignacion = await Asignacion.actualizar(id, { estado });

        res.json({
            success: true,
            message: 'Asignación actualizada exitosamente',
            data: asignacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar asignación',
            error: error.message
        });
    }
};

export const obtenerPorTorneo = async (req, res) => {
    try {
        const { torneo_id } = req.params;
        const asignaciones = await Asignacion.obtenerPorTorneo(torneo_id);

        res.json({
            success: true,
            data: asignaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener asignaciones del torneo',
            error: error.message
        });
    }
};

export const obtenerPorClub = async (req, res) => {
    try {
        const { club_id } = req.params;
        const asignaciones = await Asignacion.obtenerPorClub(club_id);

        res.json({
            success: true,
            data: asignaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener asignaciones del club',
            error: error.message
        });
    }
};

export const obtenerPorEquipo = async (req, res) => {
    try {
        const { equipo_id } = req.params;
        const asignaciones = await Asignacion.obtenerPorEquipo(equipo_id);

        res.json({
            success: true,
            data: asignaciones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener asignaciones del equipo',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const asignacion = await Asignacion.eliminar(id);

        if (!asignacion) {
            return res.status(404).json({
                success: false,
                message: 'Asignación no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Asignación eliminada exitosamente',
            data: asignacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar asignación',
            error: error.message
        });
    }
};

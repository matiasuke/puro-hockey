import Torneo from '../models/Torneo.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const torneos = await Torneo.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Torneo.contar();

        res.json({
            success: true,
            data: torneos,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener torneos',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const torneo = await Torneo.obtenerPorId(req.params.id);

        if (!torneo) {
            return res.status(404).json({
                success: false,
                message: 'Torneo no encontrado'
            });
        }

        res.json({
            success: true,
            data: torneo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener torneo',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, descripcion, estado, plan_id, fecha_inicio, fecha_fin } = req.body;

        if (!nombre || !plan_id) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y plan_id son requeridos'
            });
        }

        const torneo = await Torneo.crear({
            nombre,
            descripcion,
            estado,
            plan_id,
            fecha_inicio,
            fecha_fin
        });

        res.status(201).json({
            success: true,
            message: 'Torneo creado exitosamente',
            data: torneo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear torneo',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, estado, fecha_inicio, fecha_fin } = req.body;

        const torneo = await Torneo.actualizar(id, {
            nombre,
            descripcion,
            estado,
            fecha_inicio,
            fecha_fin
        });

        res.json({
            success: true,
            message: 'Torneo actualizado exitosamente',
            data: torneo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar torneo',
            error: error.message
        });
    }
};

export const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'Estado es requerido'
            });
        }

        const torneo = await Torneo.cambiarEstado(id, estado);

        res.json({
            success: true,
            message: 'Estado del torneo actualizado exitosamente',
            data: torneo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado del torneo',
            error: error.message
        });
    }
};

export const obtenerEquipos = async (req, res) => {
    try {
        const { id } = req.params;
        const equipos = await Torneo.obtenerEquipos(id);

        res.json({
            success: true,
            data: equipos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener equipos del torneo',
            error: error.message
        });
    }
};

export const obtenerPorEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        const torneos = await Torneo.obtenerPorEstado(estado, parseInt(limit), parseInt(offset));

        res.json({
            success: true,
            data: torneos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener torneos por estado',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const torneo = await Torneo.eliminar(id);

        if (!torneo) {
            return res.status(404).json({
                success: false,
                message: 'Torneo no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Torneo eliminado exitosamente',
            data: torneo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar torneo',
            error: error.message
        });
    }
};

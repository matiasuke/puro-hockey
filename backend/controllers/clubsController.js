import Club from '../models/Club.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const clubs = await Club.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Club.contar();

        res.json({
            success: true,
            data: clubs,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener clubs',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const club = await Club.obtenerPorId(req.params.id);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club no encontrado'
            });
        }

        res.json({
            success: true,
            data: club
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener club',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, email, telefono, ciudad, usuario_id } = req.body;

        if (!nombre || !email || !usuario_id) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y usuario_id son requeridos'
            });
        }

        const club = await Club.crear({ nombre, email, telefono, ciudad, usuario_id });

        res.status(201).json({
            success: true,
            message: 'Club creado exitosamente',
            data: club
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear club',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, ciudad } = req.body;

        const club = await Club.actualizar(id, { nombre, email, telefono, ciudad });

        res.json({
            success: true,
            message: 'Club actualizado exitosamente',
            data: club
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar club',
            error: error.message
        });
    }
};

export const obtenerEquipos = async (req, res) => {
    try {
        const { id } = req.params;
        const equipos = await Club.obtenerEquipos(id);

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

export const obtenerPorUsuario = async (req, res) => {
    try {
        const { usuario_id } = req.params;
        const club = await Club.obtenerPorUsuario(usuario_id);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club no encontrado para este usuario'
            });
        }

        res.json({
            success: true,
            data: club
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener club del usuario',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const club = await Club.eliminar(id);

        if (!club) {
            return res.status(404).json({
                success: false,
                message: 'Club no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Club eliminado exitosamente',
            data: club
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar club',
            error: error.message
        });
    }
};

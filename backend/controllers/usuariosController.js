import Usuario from '../models/Usuario.js';

export const obtenerTodos = async (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        const usuarios = await Usuario.obtenerTodos(parseInt(limit), parseInt(offset));
        const total = await Usuario.contar();

        res.json({
            success: true,
            data: usuarios,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

export const obtenerPorId = async (req, res) => {
    try {
        const usuario = await Usuario.obtenerPorId(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuario',
            error: error.message
        });
    }
};

export const obtenerPorRole = async (req, res) => {
    try {
        const { role } = req.params;
        const { limit = 50, offset = 0 } = req.query;
        const usuarios = await Usuario.obtenerPorRole(role, parseInt(limit), parseInt(offset));

        res.json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios por rol',
            error: error.message
        });
    }
};

export const crear = async (req, res) => {
    try {
        const { nombre, email, password, role = 'club' } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y contraseña son requeridos'
            });
        }

        const usuarioExistente = await Usuario.obtenerPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está registrado'
            });
        }

        const usuario = await Usuario.crear({ nombre, email, password, role });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear usuario',
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, role, estado } = req.body;

        const usuario = await Usuario.actualizar(id, { nombre, email, role, estado });

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await Usuario.eliminar(id);

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario',
            error: error.message
        });
    }
};

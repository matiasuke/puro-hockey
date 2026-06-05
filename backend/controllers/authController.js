import Usuario from '../models/Usuario.js';
import { generarToken } from '../middleware/auth.js';

export const registrar = async (req, res) => {
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

        const token = generarToken(usuario);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    role: usuario.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email y contraseña son requeridos'
            });
        }

        const usuario = await Usuario.obtenerPorEmail(email);
        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const esValido = await Usuario.verificarPassword(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const token = generarToken(usuario);

        res.json({
            success: true,
            message: 'Sesión iniciada exitosamente',
            data: {
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    role: usuario.role
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.obtenerPorId(req.usuario.id);

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
            message: 'Error al obtener perfil',
            error: error.message
        });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const { nombre, email } = req.body;

        const usuario = await Usuario.actualizar(req.usuario.id, { nombre, email });

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};

export const cambiarPassword = async (req, res) => {
    try {
        const { passwordAnterior, passwordNueva } = req.body;

        if (!passwordAnterior || !passwordNueva) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña anterior y nueva son requeridas'
            });
        }

        const usuario = await Usuario.actualizarPassword(
            req.usuario.id,
            passwordAnterior,
            passwordNueva
        );

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente',
            data: usuario
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Error al cambiar contraseña',
            error: error.message
        });
    }
};

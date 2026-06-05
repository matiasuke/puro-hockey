import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-minimum-32-chars';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token no proporcionado'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

export const verifyRole = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (rolesPermitidos.includes(req.usuario.role)) {
            next();
        } else {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Rol insuficiente'
            });
        }
    };
};

export const generarToken = (usuario) => {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            role: usuario.role,
            nombre: usuario.nombre
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

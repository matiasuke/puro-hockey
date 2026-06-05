import request from 'supertest';
import app from '../app.js';

describe('Auth Endpoints', () => {
    describe('POST /api/auth/registrar', () => {
        it('Debería registrar un nuevo usuario', async () => {
            const res = await request(app)
                .post('/api/auth/registrar')
                .send({
                    nombre: 'Test Usuario',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'club'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
            expect(res.body.data.usuario.email).toBe('test@example.com');
        });

        it('Debería rechazar email duplicado', async () => {
            const res = await request(app)
                .post('/api/auth/registrar')
                .send({
                    nombre: 'Test Usuario 2',
                    email: 'admin@example.com',
                    password: 'password123',
                    role: 'club'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('Debería rechazar datos incompletos', async () => {
            const res = await request(app)
                .post('/api/auth/registrar')
                .send({
                    nombre: 'Test Usuario',
                    email: 'test2@example.com'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('Debería iniciar sesión con credenciales válidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@example.com',
                    password: 'password'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('token');
        });

        it('Debería rechazar credenciales inválidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@example.com',
                    password: 'contraseña_incorrecta'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('Debería rechazar usuario inexistente', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'noexiste@example.com',
                    password: 'password'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });

    describe('GET /api/auth/perfil', () => {
        it('Debería obtener perfil sin autenticación', async () => {
            const res = await request(app)
                .get('/api/auth/perfil');

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });

        it('Debería obtener perfil con token válido', async () => {
            // Primero hacer login para obtener token
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'admin@example.com',
                    password: 'password'
                });

            const token = loginRes.body.data.token;

            const res = await request(app)
                .get('/api/auth/perfil')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.email).toBe('admin@example.com');
        });
    });
});

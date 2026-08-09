import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { login } from './login.js';
import { loginSchema } from './login.schema.js';
import { logout } from './logout.js';
import { logoutSchema } from './logout.schema.js';
import { me } from './me.js';
import { meSchema } from './me.schema.js';
import { refresh } from './refresh.js';
import { refreshSchema } from './refresh.schema.js';
import { register } from './register.js';
import { registerSchema } from './register.schema.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', { schema: registerSchema }, register);
  app.post('/auth/login', { schema: loginSchema }, login);
  app.post('/auth/refresh', { schema: refreshSchema }, refresh);
  app.post('/auth/logout', { schema: logoutSchema }, logout);
  app.get('/auth/me', { schema: meSchema, onRequest: [verifyJwt] }, me);
}

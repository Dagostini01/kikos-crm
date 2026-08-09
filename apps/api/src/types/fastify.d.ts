import 'fastify';

import type { UserRole } from '../repositories/users-repository.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      sub: string;
      role: UserRole;
    };
  }
}

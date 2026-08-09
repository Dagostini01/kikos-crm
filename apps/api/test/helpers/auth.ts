import type { FastifyInstance, InjectOptions } from 'fastify';

import { JoseEncrypter } from '@/cryptography/jose-encrypter.js';
import { env } from '@/env/index.js';
import type { UserRole } from '@/repositories/users-repository.js';

export async function createAccessToken(
  userId = 'test-user-id',
  role: UserRole = 'ADMIN',
) {
  const encrypter = new JoseEncrypter(env.JWT_SECRET, env.JWT_ACCESS_EXPIRES_IN);

  return encrypter.encrypt({ sub: userId, role });
}

export async function authHeader(
  userId = 'test-user-id',
  role: UserRole = 'ADMIN',
) {
  const accessToken = await createAccessToken(userId, role);

  return {
    authorization: `Bearer ${accessToken}`,
  };
}

export async function withAuth(
  app: FastifyInstance,
  options: { userId?: string; role?: UserRole } = {},
) {
  const headers = await authHeader(
    options.userId ?? 'test-user-id',
    options.role ?? 'ADMIN',
  );
  const originalInject = app.inject.bind(app);

  app.inject = ((opts: InjectOptions | string) => {
    if (typeof opts === 'string') {
      return originalInject(opts);
    }

    return originalInject({
      ...opts,
      headers: {
        ...headers,
        ...opts.headers,
      },
    });
  }) as typeof app.inject;

  return app;
}

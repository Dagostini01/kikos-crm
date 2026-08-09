import type { FastifyReply, FastifyRequest } from 'fastify';

import { JoseEncrypter } from '@/cryptography/jose-encrypter.js';
import { env } from '@/env/index.js';
import type { UserRole } from '@/repositories/users-repository.js';

const encrypter = new JoseEncrypter(env.JWT_SECRET, env.JWT_ACCESS_EXPIRES_IN);

function isUserRole(value: unknown): value is UserRole {
  return value === 'ADMIN' || value === 'MEMBER';
}

export async function verifyJwt(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }

  try {
    const payload = await encrypter.decrypt(token);
    const sub = payload.sub;
    const role = payload.role;

    if (typeof sub !== 'string' || !sub || !isUserRole(role)) {
      return reply.status(401).send({ message: 'Unauthorized.' });
    }

    request.user = { sub, role };
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }
}

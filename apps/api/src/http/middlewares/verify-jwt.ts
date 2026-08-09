import type { FastifyReply, FastifyRequest } from 'fastify';

import { JoseEncrypter } from '@/cryptography/jose-encrypter.js';
import { env } from '@/env/index.js';

const encrypter = new JoseEncrypter(env.JWT_SECRET, env.JWT_ACCESS_EXPIRES_IN);

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

    if (typeof sub !== 'string' || !sub) {
      return reply.status(401).send({ message: 'Unauthorized.' });
    }

    request.user = { sub };
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }
}

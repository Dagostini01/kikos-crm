import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeGetProfileUseCase } from '@/use-cases/auth/factories/make-get-profile-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeUser } from './serialize-user.js';

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user?.sub;

  if (!userId) {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }

  const getProfileUseCase = makeGetProfileUseCase();

  try {
    const { user } = await getProfileUseCase.execute({
      userId,
    });

    return reply.status(200).send({
      user: serializeUser(user),
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

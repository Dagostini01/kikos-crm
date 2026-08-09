import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidRefreshTokenError } from '@/use-cases/auth/errors/invalid-refresh-token-error.js';
import { makeRefreshAccessTokenUseCase } from '@/use-cases/auth/factories/make-refresh-access-token-use-case.js';

const refreshBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const body = refreshBodySchema.parse(request.body);
  const refreshAccessTokenUseCase = makeRefreshAccessTokenUseCase();

  try {
    const { accessToken, refreshToken } =
      await refreshAccessTokenUseCase.execute(body);

    return reply.status(200).send({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof InvalidRefreshTokenError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}

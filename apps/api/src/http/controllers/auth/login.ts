import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCredentialsError } from '@/use-cases/auth/errors/invalid-credentials-error.js';
import { makeAuthenticateUserUseCase } from '@/use-cases/auth/factories/make-authenticate-user-use-case.js';
import { serializeUser } from './serialize-user.js';

const loginBodySchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = loginBodySchema.parse(request.body);
  const authenticateUserUseCase = makeAuthenticateUserUseCase();

  try {
    const { user, accessToken, refreshToken } =
      await authenticateUserUseCase.execute(body);

    return reply.status(200).send({
      user: serializeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}

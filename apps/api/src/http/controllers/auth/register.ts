import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidPasswordError } from '@/use-cases/auth/errors/invalid-password-error.js';
import { UserAlreadyExistsError } from '@/use-cases/auth/errors/user-already-exists-error.js';
import { makeRegisterUserUseCase } from '@/use-cases/auth/factories/make-register-user-use-case.js';
import { serializeUser } from './serialize-user.js';

const registerBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = registerBodySchema.parse(request.body);
  const registerUserUseCase = makeRegisterUserUseCase();

  try {
    const { user, accessToken, refreshToken } =
      await registerUserUseCase.execute(body);

    return reply.status(201).send({
      user: serializeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof InvalidPasswordError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}

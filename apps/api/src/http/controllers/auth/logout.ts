import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeLogoutUserUseCase } from '@/use-cases/auth/factories/make-logout-user-use-case.js';

const logoutBodySchema = z.object({
  refreshToken: z.string().min(1),
});

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const body = logoutBodySchema.parse(request.body);
  const logoutUserUseCase = makeLogoutUserUseCase();

  await logoutUserUseCase.execute(body);

  return reply.status(204).send();
}

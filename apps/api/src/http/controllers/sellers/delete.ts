import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeDeleteSellerUseCase } from '@/use-cases/sellers/factories/make-delete-seller-use-case.js';

const deleteSellerParamsSchema = z.object({
  id: z.string().min(1),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteSellerParamsSchema.parse(request.params);
  const deleteSellerUseCase = makeDeleteSellerUseCase();

  try {
    await deleteSellerUseCase.execute({ sellerId: id });
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

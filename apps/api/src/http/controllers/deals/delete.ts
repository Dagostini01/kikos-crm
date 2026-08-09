import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeDeleteDealUseCase } from '@/use-cases/deals/factories/make-delete-deal-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const deleteDealParamsSchema = z.object({
  id: z.string().min(1),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteDealParamsSchema.parse(request.params);
  const deleteDealUseCase = makeDeleteDealUseCase();

  try {
    await deleteDealUseCase.execute({ dealId: id });
    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

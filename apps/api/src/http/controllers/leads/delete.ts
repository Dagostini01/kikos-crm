import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeDeleteLeadUseCase } from '@/use-cases/leads/factories/make-delete-lead-use-case.js';

const deleteLeadParamsSchema = z.object({
  id: z.string().min(1),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteLeadParamsSchema.parse(request.params);

  const deleteLeadUseCase = makeDeleteLeadUseCase();

  try {
    await deleteLeadUseCase.execute({
      leadId: id,
    });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}

import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeGetLeadUseCase } from '@/use-cases/factories/make-get-lead-use-case.js';

const getLeadParamsSchema = z.object({
  id: z.string().min(1),
});

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getLeadParamsSchema.parse(request.params);

  const getLeadUseCase = makeGetLeadUseCase();

  try {
    const { lead } = await getLeadUseCase.execute({
      leadId: id,
    });

    return reply.status(200).send({
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    throw error;
  }
}

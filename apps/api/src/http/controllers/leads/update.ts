import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { LeadAlreadyExistsError } from '@/use-cases/errors/lead-already-exists-error.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeUpdateLeadUseCase } from '@/use-cases/factories/make-update-lead-use-case.js';

const updateLeadParamsSchema = z.object({
  id: z.string().min(1),
});

const updateLeadBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateLeadParamsSchema.parse(request.params);
  const body = updateLeadBodySchema.parse(request.body);

  const updateLeadUseCase = makeUpdateLeadUseCase();

  try {
    const { lead } = await updateLeadUseCase.execute({
      leadId: id,
      name: body.name,
      email: body.email,
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

    if (error instanceof LeadAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}

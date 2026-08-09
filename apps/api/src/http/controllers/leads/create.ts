import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { LeadAlreadyExistsError } from '@/use-cases/leads/errors/lead-already-exists-error.js';
import { makeCreateLeadUseCase } from '@/use-cases/leads/factories/make-create-lead-use-case.js';

const createLeadBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = createLeadBodySchema.parse(request.body);

  const createLeadUseCase = makeCreateLeadUseCase();

  try {
    const { lead } = await createLeadUseCase.execute(body);

    return reply.status(201).send({
      lead: {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof LeadAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      });
    }

    throw error;
  }
}

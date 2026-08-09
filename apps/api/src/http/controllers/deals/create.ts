import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidDealValueError } from '@/use-cases/deals/errors/invalid-deal-value-error.js';
import { makeCreateDealUseCase } from '@/use-cases/deals/factories/make-create-deal-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const createDealBodySchema = z.object({
  title: z.string().min(1),
  valueInCents: z.number().int().positive(),
  leadId: z.string().min(1),
  sellerId: z.string().min(1),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = createDealBodySchema.parse(request.body);
  const createDealUseCase = makeCreateDealUseCase();

  try {
    const { deal } = await createDealUseCase.execute(body);

    return reply.status(201).send({
      deal: {
        ...deal,
        createdAt: deal.createdAt.toISOString(),
        updatedAt: deal.updatedAt.toISOString(),
        lead: deal.lead,
        seller: deal.seller,
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof InvalidDealValueError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}

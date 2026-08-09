import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { DealAlreadyClosedError } from '@/use-cases/deals/errors/deal-already-closed-error.js';
import { InvalidDealValueError } from '@/use-cases/deals/errors/invalid-deal-value-error.js';
import { makeUpdateDealUseCase } from '@/use-cases/deals/factories/make-update-deal-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const updateDealParamsSchema = z.object({
  id: z.string().min(1),
});

const updateDealBodySchema = z.object({
  title: z.string().min(1),
  valueInCents: z.number().int().positive(),
  leadId: z.string().min(1),
  sellerId: z.string().min(1),
});

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateDealParamsSchema.parse(request.params);
  const body = updateDealBodySchema.parse(request.body);
  const updateDealUseCase = makeUpdateDealUseCase();

  try {
    const { deal } = await updateDealUseCase.execute({
      dealId: id,
      ...body,
    });

    return reply.status(200).send({
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

    if (error instanceof DealAlreadyClosedError) {
      return reply.status(409).send({ message: error.message });
    }

    if (error instanceof InvalidDealValueError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}

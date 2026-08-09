import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { DealAlreadyClosedError } from '@/use-cases/deals/errors/deal-already-closed-error.js';
import { InvalidDealStatusTransitionError } from '@/use-cases/deals/errors/invalid-deal-status-transition-error.js';
import { makeMarkDealWonUseCase } from '@/use-cases/deals/factories/make-mark-deal-won-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const markDealWonParamsSchema = z.object({
  id: z.string().min(1),
});

export async function markWon(request: FastifyRequest, reply: FastifyReply) {
  const { id } = markDealWonParamsSchema.parse(request.params);
  const markDealWonUseCase = makeMarkDealWonUseCase();

  try {
    const { deal } = await markDealWonUseCase.execute({ dealId: id });

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

    if (
      error instanceof DealAlreadyClosedError ||
      error instanceof InvalidDealStatusTransitionError
    ) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

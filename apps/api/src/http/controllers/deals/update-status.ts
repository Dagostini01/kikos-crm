import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { DealAlreadyClosedError } from '@/use-cases/deals/errors/deal-already-closed-error.js';
import { InvalidDealStatusTransitionError } from '@/use-cases/deals/errors/invalid-deal-status-transition-error.js';
import { makeUpdateDealStatusUseCase } from '@/use-cases/deals/factories/make-update-deal-status-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const updateDealStatusParamsSchema = z.object({
  id: z.string().min(1),
});

const updateDealStatusBodySchema = z.object({
  status: z.literal('IN_PROGRESS'),
});

export async function updateStatus(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateDealStatusParamsSchema.parse(request.params);
  const { status } = updateDealStatusBodySchema.parse(request.body);
  const updateDealStatusUseCase = makeUpdateDealStatusUseCase();

  try {
    const { deal } = await updateDealStatusUseCase.execute({
      dealId: id,
      status,
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

    if (
      error instanceof DealAlreadyClosedError ||
      error instanceof InvalidDealStatusTransitionError
    ) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

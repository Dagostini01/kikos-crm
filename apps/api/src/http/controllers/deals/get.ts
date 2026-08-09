import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeGetDealUseCase } from '@/use-cases/deals/factories/make-get-deal-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const getDealParamsSchema = z.object({
  id: z.string().min(1),
});

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getDealParamsSchema.parse(request.params);
  const getDealUseCase = makeGetDealUseCase();

  try {
    const { deal } = await getDealUseCase.execute({ dealId: id });

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

    throw error;
  }
}

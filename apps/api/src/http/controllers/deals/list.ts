import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeListDealsUseCase } from '@/use-cases/deals/factories/make-list-deals-use-case.js';

const listDealsQuerySchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'WON', 'LOST']).optional(),
});

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const query = listDealsQuerySchema.parse(request.query);
  const listDealsUseCase = makeListDealsUseCase();
  const { deals } = await listDealsUseCase.execute(
    query.status ? { status: query.status } : {},
  );

  return reply.status(200).send({
    deals: deals.map((deal) => ({
      ...deal,
      createdAt: deal.createdAt.toISOString(),
      updatedAt: deal.updatedAt.toISOString(),
      lead: deal.lead,
      seller: deal.seller,
    })),
  });
}

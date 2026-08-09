import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeListDealsUseCase } from '@/use-cases/deals/factories/make-list-deals-use-case.js';

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listDealsUseCase = makeListDealsUseCase();
  const { deals } = await listDealsUseCase.execute();

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

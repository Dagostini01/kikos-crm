import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeListSellersUseCase } from '@/use-cases/sellers/factories/make-list-sellers-use-case.js';

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listSellersUseCase = makeListSellersUseCase();
  const { sellers } = await listSellersUseCase.execute();

  return reply.status(200).send({
    sellers: sellers.map((seller) => ({
      ...seller,
      createdAt: seller.createdAt.toISOString(),
      updatedAt: seller.updatedAt.toISOString(),
    })),
  });
}

import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeGetSellerUseCase } from '@/use-cases/sellers/factories/make-get-seller-use-case.js';

const getSellerParamsSchema = z.object({
  id: z.string().min(1),
});

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getSellerParamsSchema.parse(request.params);
  const getSellerUseCase = makeGetSellerUseCase();

  try {
    const { seller } = await getSellerUseCase.execute({ sellerId: id });

    return reply.status(200).send({
      seller: {
        ...seller,
        createdAt: seller.createdAt.toISOString(),
        updatedAt: seller.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';
import { makeUpdateSellerUseCase } from '@/use-cases/sellers/factories/make-update-seller-use-case.js';

const updateSellerParamsSchema = z.object({
  id: z.string().min(1),
});

const updateSellerBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateSellerParamsSchema.parse(request.params);
  const body = updateSellerBodySchema.parse(request.body);
  const updateSellerUseCase = makeUpdateSellerUseCase();

  try {
    const { seller } = await updateSellerUseCase.execute({
      sellerId: id,
      ...body,
    });

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

    if (error instanceof SellerAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';
import { makeCreateSellerUseCase } from '@/use-cases/sellers/factories/make-create-seller-use-case.js';

const createSellerBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = createSellerBodySchema.parse(request.body);
  const createSellerUseCase = makeCreateSellerUseCase();

  try {
    const { seller } = await createSellerUseCase.execute(body);

    return reply.status(201).send({
      seller: {
        ...seller,
        createdAt: seller.createdAt.toISOString(),
        updatedAt: seller.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof SellerAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
}

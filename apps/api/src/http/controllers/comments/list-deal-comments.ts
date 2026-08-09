import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeListDealCommentsUseCase } from '@/use-cases/comments/factories/make-list-deal-comments-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const listDealCommentsParamsSchema = z.object({
  dealId: z.string().min(1),
});

export async function listDealComments(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { dealId } = listDealCommentsParamsSchema.parse(request.params);
  const listDealCommentsUseCase = makeListDealCommentsUseCase();

  try {
    const { comments } = await listDealCommentsUseCase.execute({ dealId });

    return reply.status(200).send({
      comments: comments.map(serializeComment),
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

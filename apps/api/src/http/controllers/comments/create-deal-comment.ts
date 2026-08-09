import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCommentContentError } from '@/use-cases/comments/errors/invalid-comment-content-error.js';
import { makeCreateDealCommentUseCase } from '@/use-cases/comments/factories/make-create-deal-comment-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const createDealCommentParamsSchema = z.object({
  dealId: z.string().min(1),
});

const createDealCommentBodySchema = z.object({
  content: z.string().min(1),
});

export async function createDealComment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authorId = request.user?.sub;

  if (!authorId) {
    return reply.status(401).send({ message: 'Unauthorized.' });
  }

  const { dealId } = createDealCommentParamsSchema.parse(request.params);
  const body = createDealCommentBodySchema.parse(request.body);
  const createDealCommentUseCase = makeCreateDealCommentUseCase();

  try {
    const { comment } = await createDealCommentUseCase.execute({
      dealId,
      content: body.content,
      authorId,
    });

    return reply.status(201).send({
      comment: serializeComment(comment),
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof InvalidCommentContentError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
}

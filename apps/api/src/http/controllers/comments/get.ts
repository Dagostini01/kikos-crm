import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeGetCommentUseCase } from '@/use-cases/comments/factories/make-get-comment-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const getCommentParamsSchema = z.object({
  id: z.string().min(1),
});

export async function get(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getCommentParamsSchema.parse(request.params);
  const getCommentUseCase = makeGetCommentUseCase();

  try {
    const { comment } = await getCommentUseCase.execute({ commentId: id });

    return reply.status(200).send({
      comment: serializeComment(comment),
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

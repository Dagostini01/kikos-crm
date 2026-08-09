import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeDeleteCommentUseCase } from '@/use-cases/comments/factories/make-delete-comment-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const deleteCommentParamsSchema = z.object({
  id: z.string().min(1),
});

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const { id } = deleteCommentParamsSchema.parse(request.params);
  const deleteCommentUseCase = makeDeleteCommentUseCase();

  try {
    await deleteCommentUseCase.execute({ commentId: id });

    return reply.status(204).send();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    throw error;
  }
}

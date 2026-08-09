import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCommentContentError } from '@/use-cases/comments/errors/invalid-comment-content-error.js';
import { makeUpdateCommentUseCase } from '@/use-cases/comments/factories/make-update-comment-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const updateCommentParamsSchema = z.object({
  id: z.string().min(1),
});

const updateCommentBodySchema = z.object({
  content: z.string().min(1),
});

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = updateCommentParamsSchema.parse(request.params);
  const body = updateCommentBodySchema.parse(request.body);
  const updateCommentUseCase = makeUpdateCommentUseCase();

  try {
    const { comment } = await updateCommentUseCase.execute({
      commentId: id,
      content: body.content,
    });

    return reply.status(200).send({
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

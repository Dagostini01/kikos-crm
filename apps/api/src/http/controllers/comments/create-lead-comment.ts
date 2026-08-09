import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { InvalidCommentContentError } from '@/use-cases/comments/errors/invalid-comment-content-error.js';
import { makeCreateLeadCommentUseCase } from '@/use-cases/comments/factories/make-create-lead-comment-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const createLeadCommentParamsSchema = z.object({
  leadId: z.string().min(1),
});

const createLeadCommentBodySchema = z.object({
  content: z.string().min(1),
});

export async function createLeadComment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { leadId } = createLeadCommentParamsSchema.parse(request.params);
  const body = createLeadCommentBodySchema.parse(request.body);
  const createLeadCommentUseCase = makeCreateLeadCommentUseCase();

  try {
    const { comment } = await createLeadCommentUseCase.execute({
      leadId,
      content: body.content,
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

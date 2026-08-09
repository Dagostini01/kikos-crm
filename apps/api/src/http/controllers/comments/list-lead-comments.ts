import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeListLeadCommentsUseCase } from '@/use-cases/comments/factories/make-list-lead-comments-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { serializeComment } from './serialize-comment.js';

const listLeadCommentsParamsSchema = z.object({
  leadId: z.string().min(1),
});

export async function listLeadComments(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { leadId } = listLeadCommentsParamsSchema.parse(request.params);
  const listLeadCommentsUseCase = makeListLeadCommentsUseCase();

  try {
    const { comments } = await listLeadCommentsUseCase.execute({ leadId });

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

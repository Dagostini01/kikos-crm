import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.issues,
    });
  }

  if (error.validation) {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error.validation,
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    message: 'Internal server error.',
  });
}

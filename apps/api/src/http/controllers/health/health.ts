import type { FastifyReply, FastifyRequest } from 'fastify';

import type { Database } from '@/lib/prisma.js';

export function health(database: Database) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await database.ping();

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      request.log.error(error, 'Database health check failed');

      return reply.status(503).send({
        status: 'error',
        database: 'unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  };
}

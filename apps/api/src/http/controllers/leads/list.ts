import type { FastifyReply, FastifyRequest } from 'fastify';

import { makeListLeadsUseCase } from '@/use-cases/leads/factories/make-list-leads-use-case.js';

export async function list(_request: FastifyRequest, reply: FastifyReply) {
  const listLeadsUseCase = makeListLeadsUseCase();

  const { leads } = await listLeadsUseCase.execute();

  return reply.status(200).send({
    leads: leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    })),
  });
}

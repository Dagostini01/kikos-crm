import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { AiNotConfiguredError } from '@/use-cases/deals/errors/ai-not-configured-error.js';
import { AiProviderError } from '@/use-cases/deals/errors/ai-provider-error.js';
import { makeGenerateDealAiInsightsUseCase } from '@/use-cases/deals/factories/make-generate-deal-ai-insights-use-case.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const paramsSchema = z.object({
  id: z.string().min(1),
});

export async function aiInsights(request: FastifyRequest, reply: FastifyReply) {
  const { id } = paramsSchema.parse(request.params);
  const useCase = makeGenerateDealAiInsightsUseCase();

  try {
    const insights = await useCase.execute({ dealId: id });
    return reply.status(200).send(insights);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message });
    }

    if (error instanceof AiNotConfiguredError) {
      return reply.status(503).send({ message: error.message });
    }

    if (error instanceof AiProviderError) {
      return reply.status(502).send({ message: error.message });
    }

    throw error;
  }
}

import { OpenAiChatCompletionsClient } from '@/ai/openai-chat-completions-client.js';
import { env } from '@/env/index.js';
import { PrismaCommentsRepository } from '@/repositories/prisma/prisma-comments-repository.js';
import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { GenerateDealAiInsightsUseCase } from '@/use-cases/deals/generate-deal-ai-insights.js';

export function makeGenerateDealAiInsightsUseCase() {
  const chatClient = env.OPENAI_API_KEY
    ? new OpenAiChatCompletionsClient(env.OPENAI_API_KEY)
    : null;

  return new GenerateDealAiInsightsUseCase(
    new PrismaDealsRepository(),
    new PrismaCommentsRepository(),
    chatClient,
    env.OPENAI_MODEL,
  );
}

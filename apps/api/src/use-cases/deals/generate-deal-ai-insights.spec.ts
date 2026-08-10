import { describe, expect, it } from 'vitest';

import type { ChatCompletionsClient } from '@/ai/chat-completions-client.js';
import { makeCommentTestSetup } from '@/use-cases/comments/comment-test-setup.js';
import { AiNotConfiguredError } from '@/use-cases/deals/errors/ai-not-configured-error.js';
import { GenerateDealAiInsightsUseCase } from '@/use-cases/deals/generate-deal-ai-insights.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

describe('GenerateDealAiInsightsUseCase', () => {
  it('returns summary and next step from the chat client', async () => {
    const setup = makeCommentTestSetup();
    const author = await setup.createAuthor();
    const { deal } = await setup.createDeal();

    await setup.commentsRepository.create({
      content: 'Cliente pediu proposta até sexta',
      dealId: deal.id,
      authorId: author.id,
    });

    const chatClient: ChatCompletionsClient = {
      async completeJson() {
        return JSON.stringify({
          summary: 'Lead interessado em proposta até sexta.',
          nextStep: 'Enviar proposta comercial com prazo e condições.',
        });
      },
    };

    const sut = new GenerateDealAiInsightsUseCase(
      setup.dealsRepository,
      setup.commentsRepository,
      chatClient,
      'gpt-4o-mini',
    );

    const result = await sut.execute({ dealId: deal.id });

    expect(result.summary).toContain('proposta');
    expect(result.nextStep).toContain('Enviar');
    expect(result.model).toBe('gpt-4o-mini');
  });

  it('throws when OpenAI is not configured', async () => {
    const setup = makeCommentTestSetup();
    const { deal } = await setup.createDeal();

    const sut = new GenerateDealAiInsightsUseCase(
      setup.dealsRepository,
      setup.commentsRepository,
      null,
      'gpt-4o-mini',
    );

    await expect(sut.execute({ dealId: deal.id })).rejects.toBeInstanceOf(
      AiNotConfiguredError,
    );
  });

  it('throws when deal does not exist', async () => {
    const setup = makeCommentTestSetup();
    const chatClient: ChatCompletionsClient = {
      async completeJson() {
        return '{}';
      },
    };

    const sut = new GenerateDealAiInsightsUseCase(
      setup.dealsRepository,
      setup.commentsRepository,
      chatClient,
      'gpt-4o-mini',
    );

    await expect(
      sut.execute({ dealId: 'missing-deal' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

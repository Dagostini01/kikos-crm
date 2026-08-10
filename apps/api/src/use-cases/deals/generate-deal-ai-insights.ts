import { z } from 'zod';

import type { ChatCompletionsClient } from '@/ai/chat-completions-client.js';
import type {
  CommentWithAuthor,
  CommentsRepository,
} from '@/repositories/comments-repository.js';
import type {
  DealWithRelations,
  DealsRepository,
} from '@/repositories/deals-repository.js';
import { AiNotConfiguredError } from '@/use-cases/deals/errors/ai-not-configured-error.js';
import { AiProviderError } from '@/use-cases/deals/errors/ai-provider-error.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

const insightsSchema = z.object({
  summary: z.string().min(1),
  nextStep: z.string().min(1),
});

type GenerateDealAiInsightsRequest = {
  dealId: string;
};

type GenerateDealAiInsightsResponse = {
  summary: string;
  nextStep: string;
  model: string;
};

const STATUS_LABEL: Record<DealWithRelations['status'], string> = {
  NEW: 'Novo',
  IN_PROGRESS: 'Em andamento',
  WON: 'Ganho',
  LOST: 'Perdido',
};

function formatValueInReais(valueInCents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
}

function buildPrompt(deal: DealWithRelations, comments: CommentWithAuthor[]) {
  const commentsBlock =
    comments.length === 0
      ? '- (sem comentários registrados)'
      : comments
          .map((comment) => {
            const when = comment.createdAt.toISOString();
            return `- [${when}] ${comment.author.name}: ${comment.content}`;
          })
          .join('\n');

  return [
    'Negócio:',
    `- Título: ${deal.title}`,
    `- Status: ${STATUS_LABEL[deal.status]} (${deal.status})`,
    `- Valor: ${formatValueInReais(deal.valueInCents)}`,
    `- Lead: ${deal.lead.name} <${deal.lead.email}>`,
    `- Vendedor: ${deal.seller.name} <${deal.seller.email}>`,
    '',
    'Comentários (do mais antigo para o mais recente):',
    commentsBlock,
  ].join('\n');
}

export class GenerateDealAiInsightsUseCase {
  constructor(
    private dealsRepository: DealsRepository,
    private commentsRepository: CommentsRepository,
    private chatClient: ChatCompletionsClient | null,
    private model: string,
  ) {}

  async execute({
    dealId,
  }: GenerateDealAiInsightsRequest): Promise<GenerateDealAiInsightsResponse> {
    if (!this.chatClient) {
      throw new AiNotConfiguredError();
    }

    const deal = await this.dealsRepository.findById(dealId);

    if (!deal) {
      throw new ResourceNotFoundError();
    }

    const comments = await this.commentsRepository.findManyByDealId(dealId);

    const system = [
      'Você é um assistente comercial de um CRM de equipamentos fitness (Kikos).',
      'Responda sempre em português do Brasil.',
      'Retorne APENAS um JSON válido com as chaves "summary" e "nextStep".',
      '"summary": resumo objetivo (2 a 4 frases) do histórico e contexto do negócio.',
      '"nextStep": uma ação prática e concreta que o vendedor deve fazer a seguir.',
      'Se não houver comentários, baseie-se apenas nos dados do negócio e seja explícito sobre a falta de histórico.',
    ].join(' ');

    const raw = await this.chatClient.completeJson({
      system,
      user: buildPrompt(deal, comments),
      model: this.model,
    });

    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new AiProviderError('Não foi possível interpretar a resposta da IA');
    }

    const insights = insightsSchema.safeParse(parsed);

    if (!insights.success) {
      throw new AiProviderError('Resposta da IA em formato inválido');
    }

    return {
      summary: insights.data.summary.trim(),
      nextStep: insights.data.nextStep.trim(),
      model: this.model,
    };
  }
}

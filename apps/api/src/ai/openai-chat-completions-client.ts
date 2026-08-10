import type { ChatCompletionsClient } from '@/ai/chat-completions-client.js';
import { AiProviderError } from '@/use-cases/deals/errors/ai-provider-error.js';

type OpenAiChatResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
    code?: string;
    type?: string;
  };
};

function mapOpenAiErrorMessage(message: string | undefined, status: number) {
  const normalized = (message ?? '').toLowerCase();

  if (
    status === 402 ||
    normalized.includes('credits remaining') ||
    normalized.includes('insufficient_quota') ||
    normalized.includes('exceeded your current quota') ||
    normalized.includes('billing')
  ) {
    return 'Sem créditos na OpenAI. Adicione créditos em platform.openai.com para usar o Assistente IA.';
  }

  if (status === 401 || normalized.includes('incorrect api key')) {
    return 'Chave da OpenAI inválida. Verifique OPENAI_API_KEY na API.';
  }

  if (status === 429 || normalized.includes('rate limit')) {
    return 'Limite de uso da OpenAI atingido. Tente novamente em instantes.';
  }

  return message?.trim() || 'Falha ao consultar o provedor de IA';
}

export class OpenAiChatCompletionsClient implements ChatCompletionsClient {
  constructor(
    private apiKey: string,
    private baseUrl = 'https://api.openai.com/v1',
  ) {}

  async completeJson(input: {
    system: string;
    user: string;
    model: string;
  }): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: input.model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: input.system },
          { role: 'user', content: input.user },
        ],
      }),
    });

    const payload = (await response.json()) as OpenAiChatResponse;

    if (!response.ok) {
      throw new AiProviderError(
        mapOpenAiErrorMessage(payload.error?.message, response.status),
      );
    }

    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new AiProviderError('Resposta vazia do provedor de IA');
    }

    return content;
  }
}

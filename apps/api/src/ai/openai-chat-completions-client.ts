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
  };
};

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
        payload.error?.message ?? 'Falha ao consultar o provedor de IA',
      );
    }

    const content = payload.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new AiProviderError('Resposta vazia do provedor de IA');
    }

    return content;
  }
}

import { ApiError, getErrorMessage } from '@/shared/http/errors';

export function mapAiErrorMessage(error: unknown) {
  const message = getErrorMessage(
    error,
    'Não foi possível gerar insights com IA.',
  );
  const normalized = message.toLowerCase();
  const status = error instanceof ApiError ? error.status : null;

  if (
    status === 402 ||
    normalized.includes('credits remaining') ||
    normalized.includes('insufficient_quota') ||
    normalized.includes('exceeded your current quota') ||
    normalized.includes('add credits') ||
    (normalized.includes('billing') && normalized.includes('openai')) ||
    normalized.includes('sem créditos na openai')
  ) {
    return 'Sem créditos na OpenAI. Adicione créditos em platform.openai.com para usar o Assistente IA.';
  }

  if (
    status === 503 ||
    normalized.includes('não configurada') ||
    normalized.includes('not configured')
  ) {
    return 'Assistente IA indisponível: OPENAI_API_KEY não configurada na API.';
  }

  if (status === 429 || normalized.includes('rate limit')) {
    return 'Limite de uso da OpenAI atingido. Tente novamente em instantes.';
  }

  return message;
}

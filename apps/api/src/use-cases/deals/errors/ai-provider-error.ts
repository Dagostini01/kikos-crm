export class AiProviderError extends Error {
  constructor(message = 'Falha ao gerar insights com IA') {
    super(message);
    this.name = 'AiProviderError';
  }
}

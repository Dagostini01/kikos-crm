export class AiNotConfiguredError extends Error {
  constructor(message = 'Integração de IA não configurada') {
    super(message);
    this.name = 'AiNotConfiguredError';
  }
}

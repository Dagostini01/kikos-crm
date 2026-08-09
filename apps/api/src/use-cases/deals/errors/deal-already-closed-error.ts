export class DealAlreadyClosedError extends Error {
  constructor() {
    super('Deal is already closed.');
    this.name = 'DealAlreadyClosedError';
  }
}

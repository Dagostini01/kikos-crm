export class InvalidDealValueError extends Error {
  constructor() {
    super('Deal value must be greater than zero.');
    this.name = 'InvalidDealValueError';
  }
}

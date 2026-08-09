export class InvalidDealStatusTransitionError extends Error {
  constructor() {
    super('Invalid deal status transition.');
    this.name = 'InvalidDealStatusTransitionError';
  }
}

export class LeadAlreadyExistsError extends Error {
  constructor() {
    super('Lead already exists.');
    this.name = 'LeadAlreadyExistsError';
  }
}

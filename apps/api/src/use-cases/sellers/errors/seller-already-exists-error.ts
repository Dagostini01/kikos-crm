export class SellerAlreadyExistsError extends Error {
  constructor() {
    super('Seller already exists.');
    this.name = 'SellerAlreadyExistsError';
  }
}

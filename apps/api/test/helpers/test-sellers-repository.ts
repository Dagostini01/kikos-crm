import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';

export const testSellersRepository = new InMemorySellersRepository();

export function resetTestSellersRepository() {
  testSellersRepository.items = [];
}

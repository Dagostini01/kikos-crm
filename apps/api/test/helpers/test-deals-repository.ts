import { InMemoryDealsRepository } from '@/repositories/in-memory/in-memory-deals-repository.js';
import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';

export const testDealLeadsRepository = new InMemoryLeadsRepository();
export const testDealSellersRepository = new InMemorySellersRepository();
export const testDealsRepository = new InMemoryDealsRepository(
  testDealLeadsRepository,
  testDealSellersRepository,
);

export function resetTestDealsRepository() {
  testDealsRepository.items = [];
  testDealLeadsRepository.items = [];
  testDealSellersRepository.items = [];
}

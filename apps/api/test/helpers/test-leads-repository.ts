import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';

export const testLeadsRepository = new InMemoryLeadsRepository();

export function resetTestLeadsRepository() {
  testLeadsRepository.items = [];
}

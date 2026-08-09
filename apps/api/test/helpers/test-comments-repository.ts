import { InMemoryCommentsRepository } from '@/repositories/in-memory/in-memory-comments-repository.js';
import { InMemoryDealsRepository } from '@/repositories/in-memory/in-memory-deals-repository.js';
import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';

export const testCommentLeadsRepository = new InMemoryLeadsRepository();
export const testCommentSellersRepository = new InMemorySellersRepository();
export const testCommentDealsRepository = new InMemoryDealsRepository(
  testCommentLeadsRepository,
  testCommentSellersRepository,
);
export const testCommentsRepository = new InMemoryCommentsRepository();

export function resetTestCommentsRepository() {
  testCommentsRepository.items = [];
  testCommentDealsRepository.items = [];
  testCommentLeadsRepository.items = [];
  testCommentSellersRepository.items = [];
}

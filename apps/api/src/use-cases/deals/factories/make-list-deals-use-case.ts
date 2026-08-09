import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { ListDealsUseCase } from '@/use-cases/deals/list-deals.js';

export function makeListDealsUseCase() {
  return new ListDealsUseCase(new PrismaDealsRepository());
}

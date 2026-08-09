import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { DeleteDealUseCase } from '@/use-cases/deals/delete-deal.js';

export function makeDeleteDealUseCase() {
  return new DeleteDealUseCase(new PrismaDealsRepository());
}

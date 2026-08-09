import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { MarkDealWonUseCase } from '@/use-cases/deals/mark-deal-won.js';

export function makeMarkDealWonUseCase() {
  return new MarkDealWonUseCase(new PrismaDealsRepository());
}

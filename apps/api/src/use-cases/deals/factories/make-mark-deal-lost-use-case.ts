import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { MarkDealLostUseCase } from '@/use-cases/deals/mark-deal-lost.js';

export function makeMarkDealLostUseCase() {
  return new MarkDealLostUseCase(new PrismaDealsRepository());
}

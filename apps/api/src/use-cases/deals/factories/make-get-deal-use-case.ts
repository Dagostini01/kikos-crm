import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { GetDealUseCase } from '@/use-cases/deals/get-deal.js';

export function makeGetDealUseCase() {
  return new GetDealUseCase(new PrismaDealsRepository());
}

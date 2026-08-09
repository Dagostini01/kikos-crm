import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { UpdateDealStatusUseCase } from '@/use-cases/deals/update-deal-status.js';

export function makeUpdateDealStatusUseCase() {
  return new UpdateDealStatusUseCase(new PrismaDealsRepository());
}

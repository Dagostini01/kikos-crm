import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { UpdateDealUseCase } from '@/use-cases/deals/update-deal.js';

export function makeUpdateDealUseCase() {
  return new UpdateDealUseCase(
    new PrismaDealsRepository(),
    new PrismaLeadsRepository(),
    new PrismaSellersRepository(),
  );
}

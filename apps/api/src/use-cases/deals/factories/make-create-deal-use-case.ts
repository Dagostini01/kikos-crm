import { PrismaDealsRepository } from '@/repositories/prisma/prisma-deals-repository.js';
import { PrismaLeadsRepository } from '@/repositories/prisma/prisma-leads-repository.js';
import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { CreateDealUseCase } from '@/use-cases/deals/create-deal.js';

export function makeCreateDealUseCase() {
  return new CreateDealUseCase(
    new PrismaDealsRepository(),
    new PrismaLeadsRepository(),
    new PrismaSellersRepository(),
  );
}

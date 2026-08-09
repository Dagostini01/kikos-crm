import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { CreateSellerUseCase } from '@/use-cases/sellers/create-seller.js';

export function makeCreateSellerUseCase() {
  const sellersRepository = new PrismaSellersRepository();
  const createSellerUseCase = new CreateSellerUseCase(sellersRepository);

  return createSellerUseCase;
}

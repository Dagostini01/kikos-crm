import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { UpdateSellerUseCase } from '@/use-cases/sellers/update-seller.js';

export function makeUpdateSellerUseCase() {
  const sellersRepository = new PrismaSellersRepository();
  const updateSellerUseCase = new UpdateSellerUseCase(sellersRepository);

  return updateSellerUseCase;
}

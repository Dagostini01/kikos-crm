import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { GetSellerUseCase } from '@/use-cases/sellers/get-seller.js';

export function makeGetSellerUseCase() {
  const sellersRepository = new PrismaSellersRepository();
  const getSellerUseCase = new GetSellerUseCase(sellersRepository);

  return getSellerUseCase;
}

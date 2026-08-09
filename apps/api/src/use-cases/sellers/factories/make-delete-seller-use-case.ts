import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { DeleteSellerUseCase } from '@/use-cases/sellers/delete-seller.js';

export function makeDeleteSellerUseCase() {
  const sellersRepository = new PrismaSellersRepository();
  const deleteSellerUseCase = new DeleteSellerUseCase(sellersRepository);

  return deleteSellerUseCase;
}

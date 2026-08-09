import { PrismaSellersRepository } from '@/repositories/prisma/prisma-sellers-repository.js';
import { ListSellersUseCase } from '@/use-cases/sellers/list-sellers.js';

export function makeListSellersUseCase() {
  const sellersRepository = new PrismaSellersRepository();
  const listSellersUseCase = new ListSellersUseCase(sellersRepository);

  return listSellersUseCase;
}

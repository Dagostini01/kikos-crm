import type { Seller, SellersRepository } from '@/repositories/sellers-repository.js';

type ListSellersUseCaseResponse = {
  sellers: Seller[];
};

export class ListSellersUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute(): Promise<ListSellersUseCaseResponse> {
    const sellers = await this.sellersRepository.findMany();

    return { sellers };
  }
}

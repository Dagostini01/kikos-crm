import type { Seller, SellersRepository } from '@/repositories/sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type GetSellerUseCaseRequest = {
  sellerId: string;
};

type GetSellerUseCaseResponse = {
  seller: Seller;
};

export class GetSellerUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute({ sellerId }: GetSellerUseCaseRequest): Promise<GetSellerUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      throw new ResourceNotFoundError();
    }

    return { seller };
  }
}

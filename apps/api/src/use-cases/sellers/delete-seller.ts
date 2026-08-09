import type { SellersRepository } from '@/repositories/sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

type DeleteSellerUseCaseRequest = {
  sellerId: string;
};

export class DeleteSellerUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute({ sellerId }: DeleteSellerUseCaseRequest): Promise<void> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      throw new ResourceNotFoundError();
    }

    await this.sellersRepository.delete(sellerId);
  }
}

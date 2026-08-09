import type { Seller, SellersRepository } from '@/repositories/sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';

type UpdateSellerUseCaseRequest = {
  sellerId: string;
  name: string;
  email: string;
};

type UpdateSellerUseCaseResponse = {
  seller: Seller;
};

export class UpdateSellerUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute({
    sellerId,
    name,
    email,
  }: UpdateSellerUseCaseRequest): Promise<UpdateSellerUseCaseResponse> {
    const seller = await this.sellersRepository.findById(sellerId);

    if (!seller) {
      throw new ResourceNotFoundError();
    }

    if (email !== seller.email) {
      const sellerWithSameEmail = await this.sellersRepository.findByEmail(email);

      if (sellerWithSameEmail) {
        throw new SellerAlreadyExistsError();
      }
    }

    const updatedSeller = await this.sellersRepository.update(sellerId, {
      name,
      email,
    });

    return { seller: updatedSeller };
  }
}

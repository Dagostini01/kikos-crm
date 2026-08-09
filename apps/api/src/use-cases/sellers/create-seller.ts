import type { Seller, SellersRepository } from '@/repositories/sellers-repository.js';
import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';

type CreateSellerUseCaseRequest = {
  name: string;
  email: string;
};

type CreateSellerUseCaseResponse = {
  seller: Seller;
};

export class CreateSellerUseCase {
  constructor(private sellersRepository: SellersRepository) {}

  async execute({ name, email }: CreateSellerUseCaseRequest): Promise<CreateSellerUseCaseResponse> {
    const sellerWithSameEmail = await this.sellersRepository.findByEmail(email);

    if (sellerWithSameEmail) {
      throw new SellerAlreadyExistsError();
    }

    const seller = await this.sellersRepository.create({
      name,
      email,
    });

    return { seller };
  }
}

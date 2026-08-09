import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { GetSellerUseCase } from './get-seller.js';

describe('Get Seller Use Case', () => {
  let sellersRepository: InMemorySellersRepository;
  let sut: GetSellerUseCase;

  beforeEach(() => {
    sellersRepository = new InMemorySellersRepository();
    sut = new GetSellerUseCase(sellersRepository);
  });

  it('should be able to get a seller by id', async () => {
    const createdSeller = await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { seller } = await sut.execute({
      sellerId: createdSeller.id,
    });

    expect(seller).toEqual(createdSeller);
  });

  it('should not be able to get a seller that does not exist', async () => {
    await expect(
      sut.execute({
        sellerId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

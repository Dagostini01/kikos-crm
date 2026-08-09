import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { DeleteSellerUseCase } from './delete-seller.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

describe('Delete Seller Use Case', () => {
  let sellersRepository: InMemorySellersRepository;
  let sut: DeleteSellerUseCase;

  beforeEach(() => {
    sellersRepository = new InMemorySellersRepository();
    sut = new DeleteSellerUseCase(sellersRepository);
  });

  it('should be able to delete a seller', async () => {
    const createdSeller = await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await sut.execute({
      sellerId: createdSeller.id,
    });

    expect(sellersRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a seller that does not exist', async () => {
    await expect(
      sut.execute({
        sellerId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

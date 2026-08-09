import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';
import { UpdateSellerUseCase } from './update-seller.js';

describe('Update Seller Use Case', () => {
  let sellersRepository: InMemorySellersRepository;
  let sut: UpdateSellerUseCase;

  beforeEach(() => {
    sellersRepository = new InMemorySellersRepository();
    sut = new UpdateSellerUseCase(sellersRepository);
  });

  it('should be able to update a seller', async () => {
    const createdSeller = await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { seller } = await sut.execute({
      sellerId: createdSeller.id,
      name: 'Jane Updated',
      email: 'jane.updated@example.com',
    });

    expect(seller.name).toBe('Jane Updated');
    expect(seller.email).toBe('jane.updated@example.com');
    expect(sellersRepository.items[0]).toEqual(seller);
  });

  it('should be able to update a seller keeping the same email', async () => {
    const createdSeller = await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { seller } = await sut.execute({
      sellerId: createdSeller.id,
      name: 'Jane Updated',
      email: 'jane@example.com',
    });

    expect(seller.name).toBe('Jane Updated');
    expect(seller.email).toBe('jane@example.com');
  });

  it('should not be able to update a seller that does not exist', async () => {
    await expect(
      sut.execute({
        sellerId: 'non-existing-id',
        name: 'Jane Updated',
        email: 'jane.updated@example.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update a seller email to an already used email', async () => {
    await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const sellerToUpdate = await sellersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    await expect(
      sut.execute({
        sellerId: sellerToUpdate.id,
        name: 'John Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(SellerAlreadyExistsError);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { CreateSellerUseCase } from './create-seller.js';
import { SellerAlreadyExistsError } from '@/use-cases/sellers/errors/seller-already-exists-error.js';

describe('Create Seller Use Case', () => {
  let sellersRepository: InMemorySellersRepository;
  let sut: CreateSellerUseCase;

  beforeEach(() => {
    sellersRepository = new InMemorySellersRepository();
    sut = new CreateSellerUseCase(sellersRepository);
  });

  it('should be able to create a seller', async () => {
    const { seller } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(seller.id).toEqual(expect.any(String));
    expect(seller.name).toBe('Jane Doe');
    expect(seller.email).toBe('jane@example.com');
  });

  it('should persist the seller in the repository', async () => {
    const { seller } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(sellersRepository.items).toHaveLength(1);
    expect(sellersRepository.items[0]).toEqual(seller);
  });

  it('should not be able to create a seller with the same email twice', async () => {
    await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(SellerAlreadyExistsError);
  });
});

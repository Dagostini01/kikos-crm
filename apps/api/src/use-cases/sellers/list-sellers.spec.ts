import { beforeEach, describe, expect, it } from 'vitest';

import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { ListSellersUseCase } from './list-sellers.js';

describe('List Sellers Use Case', () => {
  let sellersRepository: InMemorySellersRepository;
  let sut: ListSellersUseCase;

  beforeEach(() => {
    sellersRepository = new InMemorySellersRepository();
    sut = new ListSellersUseCase(sellersRepository);
  });

  it('should be able to list sellers', async () => {
    await sellersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await sellersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const { sellers } = await sut.execute();

    expect(sellers).toHaveLength(2);
    expect(sellers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'jane@example.com' }),
        expect.objectContaining({ email: 'john@example.com' }),
      ]),
    );
  });

  it('should return an empty list when there are no sellers', async () => {
    const { sellers } = await sut.execute();

    expect(sellers).toEqual([]);
  });
});

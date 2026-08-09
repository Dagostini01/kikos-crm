import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { ListLeadsUseCase } from './list-leads.js';

describe('List Leads Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository;
  let sut: ListLeadsUseCase;

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository();
    sut = new ListLeadsUseCase(leadsRepository);
  });

  it('should be able to list leads', async () => {
    await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await leadsRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    const { leads } = await sut.execute();

    expect(leads).toHaveLength(2);
    expect(leads).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: 'jane@example.com' }),
        expect.objectContaining({ email: 'john@example.com' }),
      ]),
    );
  });

  it('should return an empty list when there are no leads', async () => {
    const { leads } = await sut.execute();

    expect(leads).toEqual([]);
  });
});

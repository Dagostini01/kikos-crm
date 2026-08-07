import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { ResourceNotFoundError } from './errors/resource-not-found-error.js';
import { GetLeadUseCase } from './get-lead.js';

describe('Get Lead Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository;
  let sut: GetLeadUseCase;

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository();
    sut = new GetLeadUseCase(leadsRepository);
  });

  it('should be able to get a lead by id', async () => {
    const createdLead = await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { lead } = await sut.execute({
      leadId: createdLead.id,
    });

    expect(lead).toEqual(createdLead);
  });

  it('should not be able to get a lead that does not exist', async () => {
    await expect(
      sut.execute({
        leadId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

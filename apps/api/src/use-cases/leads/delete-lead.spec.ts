import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { DeleteLeadUseCase } from './delete-lead.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';

describe('Delete Lead Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository;
  let sut: DeleteLeadUseCase;

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository();
    sut = new DeleteLeadUseCase(leadsRepository);
  });

  it('should be able to delete a lead', async () => {
    const createdLead = await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await sut.execute({
      leadId: createdLead.id,
    });

    expect(leadsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a lead that does not exist', async () => {
    await expect(
      sut.execute({
        leadId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

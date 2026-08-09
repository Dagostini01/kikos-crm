import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { LeadAlreadyExistsError } from '@/use-cases/leads/errors/lead-already-exists-error.js';
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { UpdateLeadUseCase } from './update-lead.js';

describe('Update Lead Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository;
  let sut: UpdateLeadUseCase;

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository();
    sut = new UpdateLeadUseCase(leadsRepository);
  });

  it('should be able to update a lead', async () => {
    const createdLead = await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { lead } = await sut.execute({
      leadId: createdLead.id,
      name: 'Jane Updated',
      email: 'jane.updated@example.com',
    });

    expect(lead.name).toBe('Jane Updated');
    expect(lead.email).toBe('jane.updated@example.com');
    expect(leadsRepository.items[0]).toEqual(lead);
  });

  it('should be able to update a lead keeping the same email', async () => {
    const createdLead = await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const { lead } = await sut.execute({
      leadId: createdLead.id,
      name: 'Jane Updated',
      email: 'jane@example.com',
    });

    expect(lead.name).toBe('Jane Updated');
    expect(lead.email).toBe('jane@example.com');
  });

  it('should not be able to update a lead that does not exist', async () => {
    await expect(
      sut.execute({
        leadId: 'non-existing-id',
        name: 'Jane Updated',
        email: 'jane.updated@example.com',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to update a lead email to an already used email', async () => {
    await leadsRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    const leadToUpdate = await leadsRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
    });

    await expect(
      sut.execute({
        leadId: leadToUpdate.id,
        name: 'John Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(LeadAlreadyExistsError);
  });
});

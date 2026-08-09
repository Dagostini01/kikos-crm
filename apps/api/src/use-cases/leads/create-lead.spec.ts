import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { CreateLeadUseCase } from './create-lead.js';
import { LeadAlreadyExistsError } from '@/use-cases/leads/errors/lead-already-exists-error.js';

describe('Create Lead Use Case', () => {
  let leadsRepository: InMemoryLeadsRepository;
  let sut: CreateLeadUseCase;

  beforeEach(() => {
    leadsRepository = new InMemoryLeadsRepository();
    sut = new CreateLeadUseCase(leadsRepository);
  });

  it('should be able to create a lead', async () => {
    const { lead } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(lead.id).toEqual(expect.any(String));
    expect(lead.name).toBe('Jane Doe');
    expect(lead.email).toBe('jane@example.com');
  });

  it('should persist the lead in the repository', async () => {
    const { lead } = await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    expect(leadsRepository.items).toHaveLength(1);
    expect(leadsRepository.items[0]).toEqual(lead);
  });

  it('should not be able to create a lead with the same email twice', async () => {
    await sut.execute({
      name: 'Jane Doe',
      email: 'jane@example.com',
    });

    await expect(
      sut.execute({
        name: 'John Doe',
        email: 'jane@example.com',
      }),
    ).rejects.toBeInstanceOf(LeadAlreadyExistsError);
  });
});

import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { CreateDealUseCase } from './create-deal.js';
import { makeDealTestSetup } from './deal-test-setup.js';
import { InvalidDealValueError } from './errors/invalid-deal-value-error.js';

describe('Create Deal Use Case', () => {
  let setup: ReturnType<typeof makeDealTestSetup>;
  let sut: CreateDealUseCase;

  beforeEach(() => {
    setup = makeDealTestSetup();
    sut = new CreateDealUseCase(
      setup.dealsRepository,
      setup.leadsRepository,
      setup.sellersRepository,
    );
  });

  it('should create a new deal with its relations', async () => {
    const { lead, seller } = await setup.createRelations();

    const { deal } = await sut.execute({
      title: 'New gym',
      valueInCents: 10_000,
      leadId: lead.id,
      sellerId: seller.id,
    });

    expect(deal).toEqual(
      expect.objectContaining({
        title: 'New gym',
        valueInCents: 10_000,
        status: 'NEW',
        lead: { id: lead.id, name: lead.name, email: lead.email },
        seller: { id: seller.id, name: seller.name, email: seller.email },
      }),
    );
    expect(setup.dealsRepository.items).toHaveLength(1);
  });

  it('should reject a non-positive value', async () => {
    const { lead, seller } = await setup.createRelations();

    await expect(
      sut.execute({
        title: 'Invalid',
        valueInCents: 0,
        leadId: lead.id,
        sellerId: seller.id,
      }),
    ).rejects.toBeInstanceOf(InvalidDealValueError);
  });

  it('should reject a missing relation', async () => {
    const { seller } = await setup.createRelations();

    await expect(
      sut.execute({
        title: 'Invalid',
        valueInCents: 10_000,
        leadId: 'missing-lead',
        sellerId: seller.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

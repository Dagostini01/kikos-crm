import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeDealTestSetup } from './deal-test-setup.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { InvalidDealValueError } from './errors/invalid-deal-value-error.js';
import { UpdateDealUseCase } from './update-deal.js';

describe('Update Deal Use Case', () => {
  let setup: ReturnType<typeof makeDealTestSetup>;
  let sut: UpdateDealUseCase;

  beforeEach(() => {
    setup = makeDealTestSetup();
    sut = new UpdateDealUseCase(
      setup.dealsRepository,
      setup.leadsRepository,
      setup.sellersRepository,
    );
  });

  it('should update an open deal and its relations', async () => {
    const { deal } = await setup.createDeal();
    const lead = await setup.leadsRepository.create({
      name: 'Other Lead',
      email: 'other-lead@example.com',
    });
    const seller = await setup.sellersRepository.create({
      name: 'Other Seller',
      email: 'other-seller@example.com',
    });

    const result = await sut.execute({
      dealId: deal.id,
      title: 'Updated deal',
      valueInCents: 20_000,
      leadId: lead.id,
      sellerId: seller.id,
    });

    expect(result.deal).toEqual(
      expect.objectContaining({
        title: 'Updated deal',
        valueInCents: 20_000,
        lead: expect.objectContaining({ id: lead.id }),
        seller: expect.objectContaining({ id: seller.id }),
      }),
    );
  });

  it('should reject a non-positive value', async () => {
    const { deal, lead, seller } = await setup.createDeal();

    await expect(
      sut.execute({
        dealId: deal.id,
        title: deal.title,
        valueInCents: -1,
        leadId: lead.id,
        sellerId: seller.id,
      }),
    ).rejects.toBeInstanceOf(InvalidDealValueError);
  });

  it('should reject a missing relation', async () => {
    const { deal, seller } = await setup.createDeal();

    await expect(
      sut.execute({
        dealId: deal.id,
        title: deal.title,
        valueInCents: deal.valueInCents,
        leadId: 'missing',
        sellerId: seller.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not update a closed deal', async () => {
    const { deal, lead, seller } = await setup.createDeal();
    await setup.dealsRepository.updateStatus(deal.id, 'WON');

    await expect(
      sut.execute({
        dealId: deal.id,
        title: deal.title,
        valueInCents: deal.valueInCents,
        leadId: lead.id,
        sellerId: seller.id,
      }),
    ).rejects.toBeInstanceOf(DealAlreadyClosedError);
  });
});

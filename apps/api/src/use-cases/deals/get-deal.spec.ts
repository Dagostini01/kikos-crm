import { describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeDealTestSetup } from './deal-test-setup.js';
import { GetDealUseCase } from './get-deal.js';

describe('Get Deal Use Case', () => {
  it('should return a deal with its relations', async () => {
    const setup = makeDealTestSetup();
    const { deal, lead, seller } = await setup.createDeal();
    const sut = new GetDealUseCase(setup.dealsRepository);

    const result = await sut.execute({ dealId: deal.id });

    expect(result.deal.lead.id).toBe(lead.id);
    expect(result.deal.seller.id).toBe(seller.id);
  });

  it('should reject a missing deal', async () => {
    const setup = makeDealTestSetup();
    const sut = new GetDealUseCase(setup.dealsRepository);

    await expect(sut.execute({ dealId: 'missing' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});

import { describe, expect, it } from 'vitest';

import { makeDealTestSetup } from './deal-test-setup.js';
import { ListDealsUseCase } from './list-deals.js';

describe('List Deals Use Case', () => {
  it('should list deals with their relations', async () => {
    const setup = makeDealTestSetup();
    await setup.createDeal();
    const sut = new ListDealsUseCase(setup.dealsRepository);

    const { deals } = await sut.execute();

    expect(deals).toHaveLength(1);
    expect(deals[0]).toEqual(
      expect.objectContaining({
        lead: expect.objectContaining({ email: 'lead@example.com' }),
        seller: expect.objectContaining({ email: 'seller@example.com' }),
      }),
    );
  });
});

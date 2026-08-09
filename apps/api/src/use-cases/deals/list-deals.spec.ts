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
        lead: expect.objectContaining({
          email: expect.stringContaining('lead-'),
        }),
        seller: expect.objectContaining({
          email: expect.stringContaining('seller-'),
        }),
      }),
    );
  });

  it('should filter deals by status', async () => {
    const setup = makeDealTestSetup();
    const { deal: openDeal } = await setup.createDeal({ title: 'Open deal' });
    const { deal: wonDeal } = await setup.createDeal({ title: 'Won deal' });
    await setup.dealsRepository.updateStatus(wonDeal.id, 'WON');
    const sut = new ListDealsUseCase(setup.dealsRepository);

    const { deals } = await sut.execute({ status: 'WON' });

    expect(deals).toHaveLength(1);
    expect(deals[0]?.id).toBe(wonDeal.id);
    expect(openDeal.id).not.toBe(wonDeal.id);
  });
});

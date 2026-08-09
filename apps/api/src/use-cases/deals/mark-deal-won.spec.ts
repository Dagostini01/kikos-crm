import { describe, expect, it } from 'vitest';

import { makeDealTestSetup } from './deal-test-setup.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { MarkDealWonUseCase } from './mark-deal-won.js';

describe('Mark Deal Won Use Case', () => {
  it.each(['NEW', 'IN_PROGRESS'] as const)('should mark a %s deal as won', async (status) => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    if (status === 'IN_PROGRESS') {
      await setup.dealsRepository.updateStatus(deal.id, status);
    }
    const sut = new MarkDealWonUseCase(setup.dealsRepository);

    const result = await sut.execute({ dealId: deal.id });

    expect(result.deal.status).toBe('WON');
  });

  it('should reject a closed deal', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    await setup.dealsRepository.updateStatus(deal.id, 'LOST');
    const sut = new MarkDealWonUseCase(setup.dealsRepository);

    await expect(sut.execute({ dealId: deal.id })).rejects.toBeInstanceOf(
      DealAlreadyClosedError,
    );
  });
});

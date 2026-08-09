import { describe, expect, it } from 'vitest';

import { makeDealTestSetup } from './deal-test-setup.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { MarkDealLostUseCase } from './mark-deal-lost.js';

describe('Mark Deal Lost Use Case', () => {
  it.each(['NEW', 'IN_PROGRESS'] as const)('should mark a %s deal as lost', async (status) => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    if (status === 'IN_PROGRESS') {
      await setup.dealsRepository.updateStatus(deal.id, status);
    }
    const sut = new MarkDealLostUseCase(setup.dealsRepository);

    const result = await sut.execute({ dealId: deal.id });

    expect(result.deal.status).toBe('LOST');
  });

  it('should reject a closed deal', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    await setup.dealsRepository.updateStatus(deal.id, 'WON');
    const sut = new MarkDealLostUseCase(setup.dealsRepository);

    await expect(sut.execute({ dealId: deal.id })).rejects.toBeInstanceOf(
      DealAlreadyClosedError,
    );
  });
});

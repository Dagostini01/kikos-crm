import { describe, expect, it } from 'vitest';

import { makeDealTestSetup } from './deal-test-setup.js';
import { DealAlreadyClosedError } from './errors/deal-already-closed-error.js';
import { InvalidDealStatusTransitionError } from './errors/invalid-deal-status-transition-error.js';
import { UpdateDealStatusUseCase } from './update-deal-status.js';

describe('Update Deal Status Use Case', () => {
  it('should move a new deal to in progress', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    const sut = new UpdateDealStatusUseCase(setup.dealsRepository);

    const result = await sut.execute({ dealId: deal.id, status: 'IN_PROGRESS' });

    expect(result.deal.status).toBe('IN_PROGRESS');
  });

  it('should reject any other open transition', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    const sut = new UpdateDealStatusUseCase(setup.dealsRepository);

    await expect(sut.execute({ dealId: deal.id, status: 'WON' })).rejects.toBeInstanceOf(
      InvalidDealStatusTransitionError,
    );
  });

  it('should reject transitions from a closed deal', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    await setup.dealsRepository.updateStatus(deal.id, 'LOST');
    const sut = new UpdateDealStatusUseCase(setup.dealsRepository);

    await expect(
      sut.execute({ dealId: deal.id, status: 'IN_PROGRESS' }),
    ).rejects.toBeInstanceOf(DealAlreadyClosedError);
  });
});

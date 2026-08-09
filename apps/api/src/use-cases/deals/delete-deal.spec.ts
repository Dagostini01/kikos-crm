import { describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeDealTestSetup } from './deal-test-setup.js';
import { DeleteDealUseCase } from './delete-deal.js';

describe('Delete Deal Use Case', () => {
  it('should delete a deal', async () => {
    const setup = makeDealTestSetup();
    const { deal } = await setup.createDeal();
    const sut = new DeleteDealUseCase(setup.dealsRepository);

    await sut.execute({ dealId: deal.id });

    expect(setup.dealsRepository.items).toHaveLength(0);
  });

  it('should reject a missing deal', async () => {
    const setup = makeDealTestSetup();
    const sut = new DeleteDealUseCase(setup.dealsRepository);

    await expect(sut.execute({ dealId: 'missing' })).rejects.toBeInstanceOf(
      ResourceNotFoundError,
    );
  });
});

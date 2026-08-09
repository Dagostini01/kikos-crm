import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { ListDealCommentsUseCase } from './list-deal-comments.js';

describe('List Deal Comments Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: ListDealCommentsUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new ListDealCommentsUseCase(
      setup.commentsRepository,
      setup.dealsRepository,
    );
  });

  it('should list comments for a deal in chronological order', async () => {
    const { deal } = await setup.createDeal();
    const first = await setup.commentsRepository.create({
      content: 'First',
      dealId: deal.id,
    });
    const second = await setup.commentsRepository.create({
      content: 'Second',
      dealId: deal.id,
    });

    const { comments } = await sut.execute({ dealId: deal.id });

    expect(comments.map((comment) => comment.id)).toEqual([
      first.id,
      second.id,
    ]);
  });

  it('should reject a missing deal', async () => {
    await expect(
      sut.execute({ dealId: 'missing-deal' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

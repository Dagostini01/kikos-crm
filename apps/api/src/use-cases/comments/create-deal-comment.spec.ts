import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { CreateDealCommentUseCase } from './create-deal-comment.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

describe('Create Deal Comment Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: CreateDealCommentUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new CreateDealCommentUseCase(
      setup.commentsRepository,
      setup.dealsRepository,
    );
  });

  it('should create a comment for a deal with author', async () => {
    const { deal } = await setup.createDeal();
    const author = await setup.createAuthor();

    const { comment } = await sut.execute({
      content: '  Follow up call  ',
      dealId: deal.id,
      authorId: author.id,
    });

    expect(comment).toEqual(
      expect.objectContaining({
        content: 'Follow up call',
        dealId: deal.id,
        leadId: null,
        authorId: author.id,
      }),
    );
  });

  it('should reject empty content', async () => {
    const { deal } = await setup.createDeal();
    const author = await setup.createAuthor();

    await expect(
      sut.execute({
        content: '',
        dealId: deal.id,
        authorId: author.id,
      }),
    ).rejects.toBeInstanceOf(InvalidCommentContentError);
  });

  it('should reject a missing deal', async () => {
    const author = await setup.createAuthor();

    await expect(
      sut.execute({
        content: 'Hello',
        dealId: 'missing-deal',
        authorId: author.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

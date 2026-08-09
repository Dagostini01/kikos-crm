import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { GetCommentUseCase } from './get-comment.js';

describe('Get Comment Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: GetCommentUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new GetCommentUseCase(setup.commentsRepository);
  });

  it('should get a comment by id', async () => {
    const lead = await setup.createLead();
    const created = await setup.commentsRepository.create({
      content: 'Note',
      leadId: lead.id,
    });

    const { comment } = await sut.execute({ commentId: created.id });

    expect(comment).toEqual(created);
  });

  it('should reject a missing comment', async () => {
    await expect(
      sut.execute({ commentId: 'missing-comment' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

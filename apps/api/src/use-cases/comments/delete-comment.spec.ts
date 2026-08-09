import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { DeleteCommentUseCase } from './delete-comment.js';

describe('Delete Comment Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: DeleteCommentUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new DeleteCommentUseCase(setup.commentsRepository);
  });

  it('should delete a comment', async () => {
    const lead = await setup.createLead();
    const created = await setup.commentsRepository.create({
      content: 'Note',
      leadId: lead.id,
    });

    await sut.execute({ commentId: created.id });

    expect(setup.commentsRepository.items).toHaveLength(0);
  });

  it('should reject a missing comment', async () => {
    await expect(
      sut.execute({ commentId: 'missing-comment' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

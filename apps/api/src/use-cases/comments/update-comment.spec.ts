import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';
import { UpdateCommentUseCase } from './update-comment.js';

describe('Update Comment Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: UpdateCommentUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new UpdateCommentUseCase(setup.commentsRepository);
  });

  it('should update a comment content', async () => {
    const lead = await setup.createLead();
    const created = await setup.commentsRepository.create({
      content: 'Old note',
      leadId: lead.id,
    });

    const { comment } = await sut.execute({
      commentId: created.id,
      content: '  Updated note  ',
    });

    expect(comment.content).toBe('Updated note');
    expect(setup.commentsRepository.items[0]?.content).toBe('Updated note');
  });

  it('should reject empty content', async () => {
    const lead = await setup.createLead();
    const created = await setup.commentsRepository.create({
      content: 'Old note',
      leadId: lead.id,
    });

    await expect(
      sut.execute({
        commentId: created.id,
        content: '   ',
      }),
    ).rejects.toBeInstanceOf(InvalidCommentContentError);
  });

  it('should reject a missing comment', async () => {
    await expect(
      sut.execute({
        commentId: 'missing-comment',
        content: 'Updated',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

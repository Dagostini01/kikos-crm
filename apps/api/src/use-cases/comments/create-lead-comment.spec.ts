import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { CreateLeadCommentUseCase } from './create-lead-comment.js';
import { InvalidCommentContentError } from './errors/invalid-comment-content-error.js';

describe('Create Lead Comment Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: CreateLeadCommentUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new CreateLeadCommentUseCase(
      setup.commentsRepository,
      setup.leadsRepository,
    );
  });

  it('should create a comment for a lead with author', async () => {
    const lead = await setup.createLead();
    const author = await setup.createAuthor();

    const { comment } = await sut.execute({
      content: '  First contact  ',
      leadId: lead.id,
      authorId: author.id,
    });

    expect(comment).toEqual(
      expect.objectContaining({
        content: 'First contact',
        leadId: lead.id,
        dealId: null,
        authorId: author.id,
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
        },
      }),
    );
    expect(setup.commentsRepository.items).toHaveLength(1);
  });

  it('should reject empty content', async () => {
    const lead = await setup.createLead();
    const author = await setup.createAuthor();

    await expect(
      sut.execute({
        content: '   ',
        leadId: lead.id,
        authorId: author.id,
      }),
    ).rejects.toBeInstanceOf(InvalidCommentContentError);
  });

  it('should reject a missing lead', async () => {
    const author = await setup.createAuthor();

    await expect(
      sut.execute({
        content: 'Hello',
        leadId: 'missing-lead',
        authorId: author.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

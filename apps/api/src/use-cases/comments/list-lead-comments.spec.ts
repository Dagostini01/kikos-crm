import { beforeEach, describe, expect, it } from 'vitest';

import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js';
import { makeCommentTestSetup } from './comment-test-setup.js';
import { ListLeadCommentsUseCase } from './list-lead-comments.js';

describe('List Lead Comments Use Case', () => {
  let setup: ReturnType<typeof makeCommentTestSetup>;
  let sut: ListLeadCommentsUseCase;

  beforeEach(() => {
    setup = makeCommentTestSetup();
    sut = new ListLeadCommentsUseCase(
      setup.commentsRepository,
      setup.leadsRepository,
    );
  });

  it('should list comments for a lead in chronological order', async () => {
    const lead = await setup.createLead();
    const first = await setup.commentsRepository.create({
      content: 'First',
      leadId: lead.id,
    });
    const second = await setup.commentsRepository.create({
      content: 'Second',
      leadId: lead.id,
    });

    const { comments } = await sut.execute({ leadId: lead.id });

    expect(comments.map((comment) => comment.id)).toEqual([
      first.id,
      second.id,
    ]);
  });

  it('should not include comments from other targets', async () => {
    const lead = await setup.createLead();
    const { deal } = await setup.createDeal();

    await setup.commentsRepository.create({
      content: 'Lead note',
      leadId: lead.id,
    });
    await setup.commentsRepository.create({
      content: 'Deal note',
      dealId: deal.id,
    });

    const { comments } = await sut.execute({ leadId: lead.id });

    expect(comments).toHaveLength(1);
    expect(comments[0]?.content).toBe('Lead note');
  });

  it('should reject a missing lead', async () => {
    await expect(
      sut.execute({ leadId: 'missing-lead' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

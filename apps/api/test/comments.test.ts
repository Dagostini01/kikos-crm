import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import type { Database } from '@/lib/prisma.js';
import { CreateDealCommentUseCase } from '@/use-cases/comments/create-deal-comment.js';
import { CreateLeadCommentUseCase } from '@/use-cases/comments/create-lead-comment.js';
import { DeleteCommentUseCase } from '@/use-cases/comments/delete-comment.js';
import { GetCommentUseCase } from '@/use-cases/comments/get-comment.js';
import { ListDealCommentsUseCase } from '@/use-cases/comments/list-deal-comments.js';
import { ListLeadCommentsUseCase } from '@/use-cases/comments/list-lead-comments.js';
import { UpdateCommentUseCase } from '@/use-cases/comments/update-comment.js';
import { withAuth } from './helpers/auth.js';
import {
  resetTestCommentsRepository,
  testCommentDealsRepository,
  testCommentLeadsRepository,
  testCommentSellersRepository,
  testCommentsRepository,
} from './helpers/test-comments-repository.js';

vi.mock(
  '@/use-cases/comments/factories/make-create-lead-comment-use-case.js',
  () => ({
    makeCreateLeadCommentUseCase: () =>
      new CreateLeadCommentUseCase(
        testCommentsRepository,
        testCommentLeadsRepository,
      ),
  }),
);
vi.mock(
  '@/use-cases/comments/factories/make-list-lead-comments-use-case.js',
  () => ({
    makeListLeadCommentsUseCase: () =>
      new ListLeadCommentsUseCase(
        testCommentsRepository,
        testCommentLeadsRepository,
      ),
  }),
);
vi.mock(
  '@/use-cases/comments/factories/make-create-deal-comment-use-case.js',
  () => ({
    makeCreateDealCommentUseCase: () =>
      new CreateDealCommentUseCase(
        testCommentsRepository,
        testCommentDealsRepository,
      ),
  }),
);
vi.mock(
  '@/use-cases/comments/factories/make-list-deal-comments-use-case.js',
  () => ({
    makeListDealCommentsUseCase: () =>
      new ListDealCommentsUseCase(
        testCommentsRepository,
        testCommentDealsRepository,
      ),
  }),
);
vi.mock('@/use-cases/comments/factories/make-get-comment-use-case.js', () => ({
  makeGetCommentUseCase: () => new GetCommentUseCase(testCommentsRepository),
}));
vi.mock(
  '@/use-cases/comments/factories/make-update-comment-use-case.js',
  () => ({
    makeUpdateCommentUseCase: () =>
      new UpdateCommentUseCase(testCommentsRepository),
  }),
);
vi.mock(
  '@/use-cases/comments/factories/make-delete-comment-use-case.js',
  () => ({
    makeDeleteCommentUseCase: () =>
      new DeleteCommentUseCase(testCommentsRepository),
  }),
);

function createDatabaseMock(): Database {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
  };
}

const apps: FastifyInstance[] = [];

async function createApp() {
  const app = await buildApp({ database: createDatabaseMock() });
  apps.push(app);
  return withAuth(app);
}

async function createLead() {
  return testCommentLeadsRepository.create({
    name: 'Jane Lead',
    email: 'jane@example.com',
  });
}

async function createDeal() {
  const lead = await createLead();
  const seller = await testCommentSellersRepository.create({
    name: 'John Seller',
    email: 'john@kikos.com',
  });
  const deal = await testCommentDealsRepository.create({
    title: 'Commercial Treadmill',
    valueInCents: 250_000,
    leadId: lead.id,
    sellerId: seller.id,
  });

  return { deal, lead, seller };
}

beforeEach(resetTestCommentsRepository);

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('Comments routes', () => {
  describe('POST /leads/:leadId/comments', () => {
    it('creates a lead comment', async () => {
      const app = await createApp();
      const lead = await createLead();

      const response = await app.inject({
        method: 'POST',
        url: `/leads/${lead.id}/comments`,
        payload: { content: 'First contact made' },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        comment: {
          content: 'First contact made',
          leadId: lead.id,
          dealId: null,
        },
      });
    });

    it('returns 404 when the lead does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/leads/missing-lead/comments',
        payload: { content: 'Hello' },
      });

      expect(response.statusCode).toBe(404);
    });

    it('returns 400 when content is blank', async () => {
      const app = await createApp();
      const lead = await createLead();

      const response = await app.inject({
        method: 'POST',
        url: `/leads/${lead.id}/comments`,
        payload: { content: '   ' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /leads/:leadId/comments', () => {
    it('lists only comments for that lead in chronological order', async () => {
      const app = await createApp();
      const lead = await createLead();
      const { deal } = await createDeal();

      const older = await testCommentsRepository.create({
        content: 'Older lead note',
        leadId: lead.id,
      });
      older.createdAt = new Date('2026-01-01T10:00:00.000Z');

      const newer = await testCommentsRepository.create({
        content: 'Newer lead note',
        leadId: lead.id,
      });
      newer.createdAt = new Date('2026-01-02T10:00:00.000Z');

      await testCommentsRepository.create({
        content: 'Deal note',
        dealId: deal.id,
      });

      const response = await app.inject({
        method: 'GET',
        url: `/leads/${lead.id}/comments`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().comments).toHaveLength(2);
      expect(response.json().comments.map((comment: { id: string }) => comment.id)).toEqual([
        older.id,
        newer.id,
      ]);
      expect(
        response.json().comments.every(
          (comment: { dealId: string | null }) => comment.dealId === null,
        ),
      ).toBe(true);
    });

    it('returns 404 when the lead does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/leads/missing-lead/comments',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /deals/:dealId/comments', () => {
    it('creates a deal comment even when the deal is closed', async () => {
      const app = await createApp();
      const { deal } = await createDeal();
      deal.status = 'WON';

      const response = await app.inject({
        method: 'POST',
        url: `/deals/${deal.id}/comments`,
        payload: { content: 'Post-win follow-up' },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        comment: {
          content: 'Post-win follow-up',
          dealId: deal.id,
          leadId: null,
        },
      });
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/deals/missing-deal/comments',
        payload: { content: 'Hello' },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /deals/:dealId/comments', () => {
    it('lists only comments for that deal', async () => {
      const app = await createApp();
      const lead = await createLead();
      const { deal } = await createDeal();

      await testCommentsRepository.create({
        content: 'Lead note',
        leadId: lead.id,
      });
      const dealComment = await testCommentsRepository.create({
        content: 'Deal note',
        dealId: deal.id,
      });

      const response = await app.inject({
        method: 'GET',
        url: `/deals/${deal.id}/comments`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().comments).toEqual([
        expect.objectContaining({
          id: dealComment.id,
          content: 'Deal note',
          dealId: deal.id,
          leadId: null,
        }),
      ]);
    });
  });

  describe('GET /comments/:id', () => {
    it('returns a comment by id', async () => {
      const app = await createApp();
      const lead = await createLead();
      const comment = await testCommentsRepository.create({
        content: 'Lookup me',
        leadId: lead.id,
      });

      const response = await app.inject({
        method: 'GET',
        url: `/comments/${comment.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        comment: {
          id: comment.id,
          content: 'Lookup me',
          leadId: lead.id,
        },
      });
    });

    it('returns 404 when the comment does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/comments/missing-comment',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /comments/:id', () => {
    it('updates a comment', async () => {
      const app = await createApp();
      const lead = await createLead();
      const comment = await testCommentsRepository.create({
        content: 'Draft',
        leadId: lead.id,
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/comments/${comment.id}`,
        payload: { content: 'Updated note' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        comment: {
          id: comment.id,
          content: 'Updated note',
        },
      });
    });

    it('returns 400 when content is blank', async () => {
      const app = await createApp();
      const lead = await createLead();
      const comment = await testCommentsRepository.create({
        content: 'Draft',
        leadId: lead.id,
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/comments/${comment.id}`,
        payload: { content: '   ' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /comments/:id', () => {
    it('deletes a comment', async () => {
      const app = await createApp();
      const lead = await createLead();
      const comment = await testCommentsRepository.create({
        content: 'Temporary',
        leadId: lead.id,
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/comments/${comment.id}`,
      });

      expect(response.statusCode).toBe(204);
      expect(await testCommentsRepository.findById(comment.id)).toBeNull();
    });

    it('returns 404 when the comment does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'DELETE',
        url: '/comments/missing-comment',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});

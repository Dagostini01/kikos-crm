import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import type { Database } from '@/lib/prisma.js';
import { CreateDealUseCase } from '@/use-cases/deals/create-deal.js';
import { DeleteDealUseCase } from '@/use-cases/deals/delete-deal.js';
import { GetDealUseCase } from '@/use-cases/deals/get-deal.js';
import { ListDealsUseCase } from '@/use-cases/deals/list-deals.js';
import { MarkDealLostUseCase } from '@/use-cases/deals/mark-deal-lost.js';
import { MarkDealWonUseCase } from '@/use-cases/deals/mark-deal-won.js';
import { UpdateDealStatusUseCase } from '@/use-cases/deals/update-deal-status.js';
import { UpdateDealUseCase } from '@/use-cases/deals/update-deal.js';
import {
  resetTestDealsRepository,
  testDealLeadsRepository,
  testDealsRepository,
  testDealSellersRepository,
} from './helpers/test-deals-repository.js';

vi.mock('@/use-cases/deals/factories/make-create-deal-use-case.js', () => ({
  makeCreateDealUseCase: () =>
    new CreateDealUseCase(
      testDealsRepository,
      testDealLeadsRepository,
      testDealSellersRepository,
    ),
}));
vi.mock('@/use-cases/deals/factories/make-list-deals-use-case.js', () => ({
  makeListDealsUseCase: () => new ListDealsUseCase(testDealsRepository),
}));
vi.mock('@/use-cases/deals/factories/make-get-deal-use-case.js', () => ({
  makeGetDealUseCase: () => new GetDealUseCase(testDealsRepository),
}));
vi.mock('@/use-cases/deals/factories/make-update-deal-use-case.js', () => ({
  makeUpdateDealUseCase: () =>
    new UpdateDealUseCase(
      testDealsRepository,
      testDealLeadsRepository,
      testDealSellersRepository,
    ),
}));
vi.mock('@/use-cases/deals/factories/make-delete-deal-use-case.js', () => ({
  makeDeleteDealUseCase: () => new DeleteDealUseCase(testDealsRepository),
}));
vi.mock('@/use-cases/deals/factories/make-update-deal-status-use-case.js', () => ({
  makeUpdateDealStatusUseCase: () =>
    new UpdateDealStatusUseCase(testDealsRepository),
}));
vi.mock('@/use-cases/deals/factories/make-mark-deal-won-use-case.js', () => ({
  makeMarkDealWonUseCase: () => new MarkDealWonUseCase(testDealsRepository),
}));
vi.mock('@/use-cases/deals/factories/make-mark-deal-lost-use-case.js', () => ({
  makeMarkDealLostUseCase: () => new MarkDealLostUseCase(testDealsRepository),
}));

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
  return app;
}

async function createRelations() {
  const lead = await testDealLeadsRepository.create({
    name: 'Jane Lead',
    email: 'jane@example.com',
  });
  const seller = await testDealSellersRepository.create({
    name: 'John Seller',
    email: 'john@kikos.com',
  });

  return { lead, seller };
}

async function createDeal() {
  const { lead, seller } = await createRelations();
  const deal = await testDealsRepository.create({
    title: 'Commercial Treadmill',
    valueInCents: 250_000,
    leadId: lead.id,
    sellerId: seller.id,
  });

  return { deal, lead, seller };
}

beforeEach(resetTestDealsRepository);

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('Deals routes', () => {
  describe('POST /deals', () => {
    it('creates a deal with NEW status and its relations', async () => {
      const app = await createApp();
      const { lead, seller } = await createRelations();

      const response = await app.inject({
        method: 'POST',
        url: '/deals',
        payload: {
          title: 'Commercial Treadmill',
          valueInCents: 250_000,
          leadId: lead.id,
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        deal: {
          title: 'Commercial Treadmill',
          valueInCents: 250_000,
          status: 'NEW',
          lead: { id: lead.id, email: lead.email },
          seller: { id: seller.id, email: seller.email },
        },
      });
      expect(testDealsRepository.items).toHaveLength(1);
    });

    it('returns 400 for an invalid payload', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/deals',
        payload: {
          title: '',
          valueInCents: 0,
          leadId: '',
          sellerId: '',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ message: 'Validation error.' });
    });

    it('returns 404 when a relation does not exist', async () => {
      const app = await createApp();
      const { seller } = await createRelations();

      const response = await app.inject({
        method: 'POST',
        url: '/deals',
        payload: {
          title: 'Commercial Treadmill',
          valueInCents: 250_000,
          leadId: 'missing-lead',
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Resource not found.' });
    });
  });

  describe('GET /deals', () => {
    it('lists deals with their relations', async () => {
      const app = await createApp();
      await createDeal();

      const response = await app.inject({ method: 'GET', url: '/deals' });

      expect(response.statusCode).toBe(200);
      expect(response.json().deals).toHaveLength(1);
      expect(response.json().deals[0]).toMatchObject({
        title: 'Commercial Treadmill',
        status: 'NEW',
        lead: { name: 'Jane Lead' },
        seller: { name: 'John Seller' },
      });
    });

    it('returns an empty list', async () => {
      const app = await createApp();

      const response = await app.inject({ method: 'GET', url: '/deals' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ deals: [] });
    });
  });

  describe('GET /deals/:id', () => {
    it('returns a deal by id', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'GET',
        url: `/deals/${deal.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        deal: { id: deal.id, status: 'NEW' },
      });
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/deals/missing-id',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Resource not found.' });
    });
  });

  describe('PUT /deals/:id', () => {
    it('updates an open deal', async () => {
      const app = await createApp();
      const { deal, lead, seller } = await createDeal();

      const response = await app.inject({
        method: 'PUT',
        url: `/deals/${deal.id}`,
        payload: {
          title: 'Updated Treadmill',
          valueInCents: 300_000,
          leadId: lead.id,
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        deal: {
          id: deal.id,
          title: 'Updated Treadmill',
          valueInCents: 300_000,
          status: 'NEW',
        },
      });
    });

    it('returns 400 for an invalid payload', async () => {
      const app = await createApp();
      const { deal, lead, seller } = await createDeal();

      const response = await app.inject({
        method: 'PUT',
        url: `/deals/${deal.id}`,
        payload: {
          title: 'Updated Treadmill',
          valueInCents: 0,
          leadId: lead.id,
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();
      const { lead, seller } = await createRelations();

      const response = await app.inject({
        method: 'PUT',
        url: '/deals/missing-id',
        payload: {
          title: 'Updated Treadmill',
          valueInCents: 300_000,
          leadId: lead.id,
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(404);
    });

    it('returns 409 when the deal is already closed', async () => {
      const app = await createApp();
      const { deal, lead, seller } = await createDeal();
      await testDealsRepository.updateStatus(deal.id, 'WON');

      const response = await app.inject({
        method: 'PUT',
        url: `/deals/${deal.id}`,
        payload: {
          title: 'Updated Treadmill',
          valueInCents: 300_000,
          leadId: lead.id,
          sellerId: seller.id,
        },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Deal is already closed.',
      });
    });
  });

  describe('DELETE /deals/:id', () => {
    it('deletes a deal', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'DELETE',
        url: `/deals/${deal.id}`,
      });

      expect(response.statusCode).toBe(204);
      expect(testDealsRepository.items).toHaveLength(0);
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'DELETE',
        url: '/deals/missing-id',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /deals/:id/status', () => {
    it('moves a NEW deal to IN_PROGRESS', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/status`,
        payload: { status: 'IN_PROGRESS' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        deal: { id: deal.id, status: 'IN_PROGRESS' },
      });
    });

    it('returns 400 for an unsupported status', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/status`,
        payload: { status: 'WON' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'PATCH',
        url: '/deals/missing-id/status',
        payload: { status: 'IN_PROGRESS' },
      });

      expect(response.statusCode).toBe(404);
    });

    it('returns 409 when the transition is invalid', async () => {
      const app = await createApp();
      const { deal } = await createDeal();
      await testDealsRepository.updateStatus(deal.id, 'IN_PROGRESS');

      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/status`,
        payload: { status: 'IN_PROGRESS' },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Invalid deal status transition.',
      });
    });
  });

  describe('PATCH /deals/:id/won', () => {
    it('marks an open deal as won', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/won`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        deal: { id: deal.id, status: 'WON' },
      });
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'PATCH',
        url: '/deals/missing-id/won',
      });

      expect(response.statusCode).toBe(404);
    });

    it('keeps WON final and returns 409 when closing it again', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      await app.inject({ method: 'PATCH', url: `/deals/${deal.id}/won` });
      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/lost`,
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Deal is already closed.',
      });
      expect(testDealsRepository.items[0]?.status).toBe('WON');
    });
  });

  describe('PATCH /deals/:id/lost', () => {
    it('marks an open deal as lost', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/lost`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        deal: { id: deal.id, status: 'LOST' },
      });
    });

    it('returns 404 when the deal does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'PATCH',
        url: '/deals/missing-id/lost',
      });

      expect(response.statusCode).toBe(404);
    });

    it('keeps LOST final and returns 409 on later transitions', async () => {
      const app = await createApp();
      const { deal } = await createDeal();

      await app.inject({ method: 'PATCH', url: `/deals/${deal.id}/lost` });
      const response = await app.inject({
        method: 'PATCH',
        url: `/deals/${deal.id}/status`,
        payload: { status: 'IN_PROGRESS' },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Deal is already closed.',
      });
      expect(testDealsRepository.items[0]?.status).toBe('LOST');
    });
  });
});

import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import type { Database } from '@/lib/prisma.js';
import { CreateLeadUseCase } from '@/use-cases/create-lead.js';
import { DeleteLeadUseCase } from '@/use-cases/delete-lead.js';
import { GetLeadUseCase } from '@/use-cases/get-lead.js';
import { ListLeadsUseCase } from '@/use-cases/list-leads.js';
import { UpdateLeadUseCase } from '@/use-cases/update-lead.js';
import {
  resetTestLeadsRepository,
  testLeadsRepository,
} from './helpers/test-leads-repository.js';

vi.mock('@/use-cases/factories/make-create-lead-use-case.js', () => ({
  makeCreateLeadUseCase: () => new CreateLeadUseCase(testLeadsRepository),
}));

vi.mock('@/use-cases/factories/make-list-leads-use-case.js', () => ({
  makeListLeadsUseCase: () => new ListLeadsUseCase(testLeadsRepository),
}));

vi.mock('@/use-cases/factories/make-get-lead-use-case.js', () => ({
  makeGetLeadUseCase: () => new GetLeadUseCase(testLeadsRepository),
}));

vi.mock('@/use-cases/factories/make-update-lead-use-case.js', () => ({
  makeUpdateLeadUseCase: () => new UpdateLeadUseCase(testLeadsRepository),
}));

vi.mock('@/use-cases/factories/make-delete-lead-use-case.js', () => ({
  makeDeleteLeadUseCase: () => new DeleteLeadUseCase(testLeadsRepository),
}));

function createDatabaseMock(overrides: Partial<Database> = {}): Database {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const apps: FastifyInstance[] = [];

async function createApp() {
  const app = await buildApp({ database: createDatabaseMock() });
  apps.push(app);
  return app;
}

beforeEach(() => {
  resetTestLeadsRepository();
});

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('Leads routes', () => {
  describe('POST /leads', () => {
    it('creates a lead', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/leads',
        payload: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        lead: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      });
      expect(response.json().lead.id).toEqual(expect.any(String));
      expect(testLeadsRepository.items).toHaveLength(1);
    });

    it('returns 409 when email is already in use', async () => {
      const app = await createApp();

      await app.inject({
        method: 'POST',
        url: '/leads',
        payload: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/leads',
        payload: {
          name: 'John Doe',
          email: 'jane@example.com',
        },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Lead already exists.',
      });
    });

    it('returns 400 when payload is invalid', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'POST',
        url: '/leads',
        payload: {
          name: '',
          email: 'not-an-email',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({
        message: 'Validation error.',
      });
    });
  });

  describe('GET /leads', () => {
    it('lists leads', async () => {
      const app = await createApp();

      await testLeadsRepository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      await testLeadsRepository.create({
        name: 'John Doe',
        email: 'john@example.com',
      });

      const response = await app.inject({
        method: 'GET',
        url: '/leads',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json().leads).toHaveLength(2);
      expect(response.json().leads).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ email: 'jane@example.com' }),
          expect.objectContaining({ email: 'john@example.com' }),
        ]),
      );
    });

    it('returns an empty list when there are no leads', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/leads',
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ leads: [] });
    });
  });

  describe('GET /leads/:id', () => {
    it('returns a lead by id', async () => {
      const app = await createApp();
      const lead = await testLeadsRepository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      const response = await app.inject({
        method: 'GET',
        url: `/leads/${lead.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        lead: {
          id: lead.id,
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      });
    });

    it('returns 404 when lead does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'GET',
        url: '/leads/non-existing-id',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        message: 'Resource not found.',
      });
    });
  });

  describe('PUT /leads/:id', () => {
    it('updates a lead', async () => {
      const app = await createApp();
      const lead = await testLeadsRepository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/leads/${lead.id}`,
        payload: {
          name: 'Jane Updated',
          email: 'jane.updated@example.com',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        lead: {
          id: lead.id,
          name: 'Jane Updated',
          email: 'jane.updated@example.com',
        },
      });
    });

    it('returns 404 when lead does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'PUT',
        url: '/leads/non-existing-id',
        payload: {
          name: 'Jane Updated',
          email: 'jane.updated@example.com',
        },
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        message: 'Resource not found.',
      });
    });

    it('returns 409 when updating to an email already in use', async () => {
      const app = await createApp();

      await testLeadsRepository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      const leadToUpdate = await testLeadsRepository.create({
        name: 'John Doe',
        email: 'john@example.com',
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/leads/${leadToUpdate.id}`,
        payload: {
          name: 'John Doe',
          email: 'jane@example.com',
        },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({
        message: 'Lead already exists.',
      });
    });
  });

  describe('DELETE /leads/:id', () => {
    it('deletes a lead', async () => {
      const app = await createApp();
      const lead = await testLeadsRepository.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/leads/${lead.id}`,
      });

      expect(response.statusCode).toBe(204);
      expect(testLeadsRepository.items).toHaveLength(0);
    });

    it('returns 404 when lead does not exist', async () => {
      const app = await createApp();

      const response = await app.inject({
        method: 'DELETE',
        url: '/leads/non-existing-id',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({
        message: 'Resource not found.',
      });
    });
  });
});

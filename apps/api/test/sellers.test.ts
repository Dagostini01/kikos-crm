import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import type { Database } from '@/lib/prisma.js';
import { CreateSellerUseCase } from '@/use-cases/sellers/create-seller.js';
import { DeleteSellerUseCase } from '@/use-cases/sellers/delete-seller.js';
import { GetSellerUseCase } from '@/use-cases/sellers/get-seller.js';
import { ListSellersUseCase } from '@/use-cases/sellers/list-sellers.js';
import { UpdateSellerUseCase } from '@/use-cases/sellers/update-seller.js';
import { withAuth } from './helpers/auth.js';
import {
  resetTestSellersRepository,
  testSellersRepository,
} from './helpers/test-sellers-repository.js';

vi.mock('@/use-cases/sellers/factories/make-create-seller-use-case.js', () => ({
  makeCreateSellerUseCase: () => new CreateSellerUseCase(testSellersRepository),
}));
vi.mock('@/use-cases/sellers/factories/make-get-seller-use-case.js', () => ({
  makeGetSellerUseCase: () => new GetSellerUseCase(testSellersRepository),
}));
vi.mock('@/use-cases/sellers/factories/make-list-sellers-use-case.js', () => ({
  makeListSellersUseCase: () => new ListSellersUseCase(testSellersRepository),
}));
vi.mock('@/use-cases/sellers/factories/make-update-seller-use-case.js', () => ({
  makeUpdateSellerUseCase: () => new UpdateSellerUseCase(testSellersRepository),
}));
vi.mock('@/use-cases/sellers/factories/make-delete-seller-use-case.js', () => ({
  makeDeleteSellerUseCase: () => new DeleteSellerUseCase(testSellersRepository),
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
  return withAuth(app);
}

beforeEach(resetTestSellersRepository);

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('Sellers routes', () => {
  describe('POST /sellers', () => {
    it('creates a seller', async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'POST',
        url: '/sellers',
        payload: { name: 'Jane Seller', email: 'jane@kikos.com' },
      });

      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        seller: { name: 'Jane Seller', email: 'jane@kikos.com' },
      });
      expect(testSellersRepository.items).toHaveLength(1);
    });

    it('returns 400 for an invalid payload', async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'POST',
        url: '/sellers',
        payload: { name: '', email: 'invalid' },
      });

      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ message: 'Validation error.' });
    });

    it('returns 409 when email is already in use', async () => {
      const app = await createApp();
      const payload = { name: 'Jane Seller', email: 'jane@kikos.com' };

      await app.inject({ method: 'POST', url: '/sellers', payload });
      const response = await app.inject({
        method: 'POST',
        url: '/sellers',
        payload: { ...payload, name: 'Another Seller' },
      });

      expect(response.statusCode).toBe(409);
      expect(response.json()).toEqual({ message: 'Seller already exists.' });
    });
  });

  describe('GET /sellers', () => {
    it('lists sellers', async () => {
      const app = await createApp();
      await testSellersRepository.create({
        name: 'Jane Seller',
        email: 'jane@kikos.com',
      });

      const response = await app.inject({ method: 'GET', url: '/sellers' });

      expect(response.statusCode).toBe(200);
      expect(response.json().sellers).toHaveLength(1);
    });

    it('returns an empty list', async () => {
      const app = await createApp();
      const response = await app.inject({ method: 'GET', url: '/sellers' });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ sellers: [] });
    });
  });

  describe('GET /sellers/:id', () => {
    it('returns a seller', async () => {
      const app = await createApp();
      const seller = await testSellersRepository.create({
        name: 'Jane Seller',
        email: 'jane@kikos.com',
      });

      const response = await app.inject({
        method: 'GET',
        url: `/sellers/${seller.id}`,
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({ seller: { id: seller.id } });
    });

    it('returns 404 when seller does not exist', async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'GET',
        url: '/sellers/missing-id',
      });

      expect(response.statusCode).toBe(404);
      expect(response.json()).toEqual({ message: 'Resource not found.' });
    });
  });

  describe('PUT /sellers/:id', () => {
    it('updates a seller', async () => {
      const app = await createApp();
      const seller = await testSellersRepository.create({
        name: 'Jane Seller',
        email: 'jane@kikos.com',
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/sellers/${seller.id}`,
        payload: { name: 'Jane Updated', email: 'updated@kikos.com' },
      });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        seller: { name: 'Jane Updated', email: 'updated@kikos.com' },
      });
    });

    it('returns 404 when seller does not exist', async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'PUT',
        url: '/sellers/missing-id',
        payload: { name: 'Jane Updated', email: 'updated@kikos.com' },
      });

      expect(response.statusCode).toBe(404);
    });

    it('returns 409 when email is already in use', async () => {
      const app = await createApp();
      await testSellersRepository.create({
        name: 'Jane Seller',
        email: 'jane@kikos.com',
      });
      const seller = await testSellersRepository.create({
        name: 'John Seller',
        email: 'john@kikos.com',
      });

      const response = await app.inject({
        method: 'PUT',
        url: `/sellers/${seller.id}`,
        payload: { name: 'John Seller', email: 'jane@kikos.com' },
      });

      expect(response.statusCode).toBe(409);
    });
  });

  describe('DELETE /sellers/:id', () => {
    it('deletes a seller', async () => {
      const app = await createApp();
      const seller = await testSellersRepository.create({
        name: 'Jane Seller',
        email: 'jane@kikos.com',
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/sellers/${seller.id}`,
      });

      expect(response.statusCode).toBe(204);
      expect(testSellersRepository.items).toHaveLength(0);
    });

    it('returns 404 when seller does not exist', async () => {
      const app = await createApp();
      const response = await app.inject({
        method: 'DELETE',
        url: '/sellers/missing-id',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});

import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildApp } from '@/app.js';
import type { Database } from '@/lib/prisma.js';

function createDatabaseMock(overrides: Partial<Database> = {}): Database {
  return {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

const apps: FastifyInstance[] = [];

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('GET /health', () => {
  it('returns ok when the database is available', async () => {
    const database = createDatabaseMock();
    const app = await buildApp({ database });
    apps.push(app);

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
    expect(database.ping).toHaveBeenCalledOnce();
  });

  it('returns service unavailable when the database cannot be reached', async () => {
    const database = createDatabaseMock({
      ping: vi.fn().mockRejectedValue(new Error('database unavailable')),
    });
    const app = await buildApp({ database });
    apps.push(app);

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toMatchObject({
      status: 'error',
      database: 'unavailable',
    });
  });
});

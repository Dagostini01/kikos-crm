import swagger from '@fastify/swagger';
import scalarApiReference from '@scalar/fastify-api-reference';
import Fastify, { type FastifyBaseLogger } from 'fastify';

import { env } from '@/env/index.js';
import { dealsRoutes } from '@/http/controllers/deals/routes.js';
import { healthRoutes } from '@/http/controllers/health/routes.js';
import { leadsRoutes } from '@/http/controllers/leads/routes.js';
import { sellersRoutes } from '@/http/controllers/sellers/routes.js';
import { errorHandler } from '@/http/error-handler.js';
import { database as prismaDatabase, type Database } from '@/lib/prisma.js';

type AppOptions = {
  database: Database;
  logger?: boolean | FastifyBaseLogger | Record<string, unknown>;
};

export async function buildApp({ database, logger = false }: AppOptions) {
  const app = Fastify({ logger });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Kikos CRM API',
        description: 'HTTP API for the Kikos CRM',
        version: '0.1.0',
      },
    },
  });

  await app.register(scalarApiReference, {
    routePrefix: '/reference',
  });

  app.setErrorHandler(errorHandler);

  app.addHook('onReady', async () => {
    await database.connect();
  });

  app.addHook('onClose', async () => {
    await database.disconnect();
  });

  await app.register(healthRoutes, { database });
  await app.register(leadsRoutes);
  await app.register(sellersRoutes);
  await app.register(dealsRoutes);

  return app;
}

export const app = await buildApp({
  database: prismaDatabase,
  logger: {
    level: env.LOG_LEVEL,
    ...(env.NODE_ENV === 'development'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          },
        }
      : {}),
  },
});

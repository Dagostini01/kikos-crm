import type { FastifyPluginAsync } from 'fastify';

import type { Database } from '@/lib/prisma.js';
import { health } from './health.js';
import { healthSchema } from './health.schema.js';

type HealthRoutesOptions = {
  database: Database;
};

export const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = async (
  app,
  { database },
) => {
  app.get('/health', { schema: healthSchema }, health(database));
};

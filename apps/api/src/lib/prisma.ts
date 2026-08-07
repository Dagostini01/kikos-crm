import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '@/env/index.js';
import { PrismaClient } from '@/generated/prisma/client.js';

const adapter = new PrismaPg(env.DATABASE_URL);
export const prisma = new PrismaClient({ adapter });

export interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  ping(): Promise<void>;
}

function createPrismaDatabase(client: PrismaClient): Database {
  return {
    async connect() {
      await client.$connect();
    },
    async disconnect() {
      await client.$disconnect();
    },
    async ping() {
      await client.$queryRaw`SELECT 1`;
    },
  };
}

export const database = createPrismaDatabase(prisma);

import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { verifyUserRole } from '@/http/middlewares/verify-user-role.js';
import { create } from './create.js';
import { createSellerSchema } from './create.schema.js';
import { remove } from './delete.js';
import { deleteSellerSchema } from './delete.schema.js';
import { get } from './get.js';
import { getSellerSchema } from './get.schema.js';
import { list } from './list.js';
import { listSellersSchema } from './list.schema.js';
import { update } from './update.js';
import { updateSellerSchema } from './update.schema.js';

export async function sellersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post(
    '/sellers',
    { schema: createSellerSchema, onRequest: [verifyUserRole('ADMIN')] },
    create,
  );
  app.get('/sellers', { schema: listSellersSchema }, list);
  app.get('/sellers/:id', { schema: getSellerSchema }, get);
  app.put(
    '/sellers/:id',
    { schema: updateSellerSchema, onRequest: [verifyUserRole('ADMIN')] },
    update,
  );
  app.delete(
    '/sellers/:id',
    { schema: deleteSellerSchema, onRequest: [verifyUserRole('ADMIN')] },
    remove,
  );
}

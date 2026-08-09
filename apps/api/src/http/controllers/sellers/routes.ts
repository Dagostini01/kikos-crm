import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
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

  app.post('/sellers', { schema: createSellerSchema }, create);
  app.get('/sellers', { schema: listSellersSchema }, list);
  app.get('/sellers/:id', { schema: getSellerSchema }, get);
  app.put('/sellers/:id', { schema: updateSellerSchema }, update);
  app.delete('/sellers/:id', { schema: deleteSellerSchema }, remove);
}

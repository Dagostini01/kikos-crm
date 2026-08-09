import type { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { create } from './create.js';
import { createLeadSchema } from './create.schema.js';
import { remove } from './delete.js';
import { deleteLeadSchema } from './delete.schema.js';
import { get } from './get.js';
import { getLeadSchema } from './get.schema.js';
import { list } from './list.js';
import { listLeadsSchema } from './list.schema.js';
import { update } from './update.js';
import { updateLeadSchema } from './update.schema.js';

export async function leadsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt);

  app.post('/leads', { schema: createLeadSchema }, create);
  app.get('/leads', { schema: listLeadsSchema }, list);
  app.get('/leads/:id', { schema: getLeadSchema }, get);
  app.put('/leads/:id', { schema: updateLeadSchema }, update);
  app.delete('/leads/:id', { schema: deleteLeadSchema }, remove);
}

import type { FastifyInstance } from 'fastify';

import { create } from './create.js';
import { createDealSchema } from './create.schema.js';
import { remove } from './delete.js';
import { deleteDealSchema } from './delete.schema.js';
import { get } from './get.js';
import { getDealSchema } from './get.schema.js';
import { list } from './list.js';
import { listDealsSchema } from './list.schema.js';
import { markLost } from './mark-lost.js';
import { markDealLostSchema } from './mark-lost.schema.js';
import { markWon } from './mark-won.js';
import { markDealWonSchema } from './mark-won.schema.js';
import { updateStatus } from './update-status.js';
import { updateDealStatusSchema } from './update-status.schema.js';
import { update } from './update.js';
import { updateDealSchema } from './update.schema.js';

export async function dealsRoutes(app: FastifyInstance) {
  app.post('/deals', { schema: createDealSchema }, create);
  app.get('/deals', { schema: listDealsSchema }, list);
  app.get('/deals/:id', { schema: getDealSchema }, get);
  app.put('/deals/:id', { schema: updateDealSchema }, update);
  app.delete('/deals/:id', { schema: deleteDealSchema }, remove);
  app.patch(
    '/deals/:id/status',
    { schema: updateDealStatusSchema },
    updateStatus,
  );
  app.patch('/deals/:id/won', { schema: markDealWonSchema }, markWon);
  app.patch('/deals/:id/lost', { schema: markDealLostSchema }, markLost);
}

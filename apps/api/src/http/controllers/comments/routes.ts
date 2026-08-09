import type { FastifyInstance } from 'fastify';

import { createDealComment } from './create-deal-comment.js';
import { createDealCommentSchema } from './create-deal-comment.schema.js';
import { createLeadComment } from './create-lead-comment.js';
import { createLeadCommentSchema } from './create-lead-comment.schema.js';
import { remove } from './delete.js';
import { deleteCommentSchema } from './delete.schema.js';
import { get } from './get.js';
import { getCommentSchema } from './get.schema.js';
import { listDealComments } from './list-deal-comments.js';
import { listDealCommentsSchema } from './list-deal-comments.schema.js';
import { listLeadComments } from './list-lead-comments.js';
import { listLeadCommentsSchema } from './list-lead-comments.schema.js';
import { update } from './update.js';
import { updateCommentSchema } from './update.schema.js';

export async function commentsRoutes(app: FastifyInstance) {
  app.post(
    '/leads/:leadId/comments',
    { schema: createLeadCommentSchema },
    createLeadComment,
  );
  app.get(
    '/leads/:leadId/comments',
    { schema: listLeadCommentsSchema },
    listLeadComments,
  );
  app.post(
    '/deals/:dealId/comments',
    { schema: createDealCommentSchema },
    createDealComment,
  );
  app.get(
    '/deals/:dealId/comments',
    { schema: listDealCommentsSchema },
    listDealComments,
  );
  app.get('/comments/:id', { schema: getCommentSchema }, get);
  app.put('/comments/:id', { schema: updateCommentSchema }, update);
  app.delete('/comments/:id', { schema: deleteCommentSchema }, remove);
}

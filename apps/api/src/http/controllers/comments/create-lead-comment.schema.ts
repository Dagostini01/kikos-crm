import {
  commentBodySchema,
  commentResponseSchema,
  errorResponseSchema,
  leadIdParamsSchema,
} from './schemas.js';

export const createLeadCommentSchema = {
  tags: ['Comments'],
  summary: 'Create a comment for a lead',
  params: leadIdParamsSchema,
  body: commentBodySchema,
  response: {
    201: commentResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
} as const;

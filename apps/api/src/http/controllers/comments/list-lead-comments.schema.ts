import {
  commentsResponseSchema,
  errorResponseSchema,
  leadIdParamsSchema,
} from './schemas.js';

export const listLeadCommentsSchema = {
  tags: ['Comments'],
  summary: 'List comments for a lead',
  params: leadIdParamsSchema,
  response: {
    200: commentsResponseSchema,
    404: errorResponseSchema,
  },
} as const;

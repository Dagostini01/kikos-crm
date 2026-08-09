import {
  commentsResponseSchema,
  dealIdParamsSchema,
  errorResponseSchema,
} from './schemas.js';

export const listDealCommentsSchema = {
  tags: ['Comments'],
  summary: 'List comments for a deal',
  params: dealIdParamsSchema,
  response: {
    200: commentsResponseSchema,
    404: errorResponseSchema,
  },
} as const;

import {
  commentBodySchema,
  commentResponseSchema,
  dealIdParamsSchema,
  errorResponseSchema,
} from './schemas.js';

export const createDealCommentSchema = {
  tags: ['Comments'],
  summary: 'Create a comment for a deal',
  params: dealIdParamsSchema,
  body: commentBodySchema,
  response: {
    201: commentResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
} as const;

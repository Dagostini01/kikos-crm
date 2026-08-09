import {
  commentBodySchema,
  commentResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const updateCommentSchema = {
  tags: ['Comments'],
  summary: 'Update a comment',
  params: idParamsSchema,
  body: commentBodySchema,
  response: {
    200: commentResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
} as const;

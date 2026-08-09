import {
  commentResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const getCommentSchema = {
  tags: ['Comments'],
  summary: 'Get a comment by id',
  params: idParamsSchema,
  response: {
    200: commentResponseSchema,
    404: errorResponseSchema,
  },
} as const;

import {
  errorResponseSchema,
  refreshBodySchema,
  tokensResponseSchema,
} from './schemas.js';

export const refreshSchema = {
  tags: ['Auth'],
  summary: 'Rotate access and refresh tokens',
  body: refreshBodySchema,
  response: {
    200: tokensResponseSchema,
    401: errorResponseSchema,
  },
} as const;

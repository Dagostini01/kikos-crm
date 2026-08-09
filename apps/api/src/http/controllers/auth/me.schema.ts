import { errorResponseSchema, userResponseSchema } from './schemas.js';

export const meSchema = {
  tags: ['Auth'],
  summary: 'Get the authenticated user profile',
  security: [{ bearerAuth: [] }],
  response: {
    200: userResponseSchema,
    401: errorResponseSchema,
    404: errorResponseSchema,
  },
} as const;

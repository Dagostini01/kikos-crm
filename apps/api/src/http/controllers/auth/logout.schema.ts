import { errorResponseSchema, refreshBodySchema } from './schemas.js';

export const logoutSchema = {
  tags: ['Auth'],
  summary: 'Revoke a refresh token',
  body: refreshBodySchema,
  response: {
    204: {
      type: 'null',
      description: 'Logged out successfully',
    },
    400: errorResponseSchema,
  },
} as const;

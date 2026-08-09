import {
  authSessionResponseSchema,
  errorResponseSchema,
  loginBodySchema,
} from './schemas.js';

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Authenticate a user',
  body: loginBodySchema,
  response: {
    200: authSessionResponseSchema,
    401: errorResponseSchema,
  },
} as const;

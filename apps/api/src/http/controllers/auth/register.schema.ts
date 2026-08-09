import {
  authSessionResponseSchema,
  errorResponseSchema,
  registerBodySchema,
} from './schemas.js';

export const registerSchema = {
  tags: ['Auth'],
  summary: 'Register a new user',
  body: registerBodySchema,
  response: {
    201: authSessionResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
} as const;

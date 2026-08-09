import {
  dealBodySchema,
  dealResponseSchema,
  errorResponseSchema,
} from './schemas.js';

export const createDealSchema = {
  tags: ['Deals'],
  summary: 'Create a deal',
  body: dealBodySchema,
  response: {
    201: dealResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
  },
} as const;

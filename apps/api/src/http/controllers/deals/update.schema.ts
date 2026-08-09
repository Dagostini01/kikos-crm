import {
  dealBodySchema,
  dealResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const updateDealSchema = {
  tags: ['Deals'],
  summary: 'Update a deal',
  params: idParamsSchema,
  body: dealBodySchema,
  response: {
    200: dealResponseSchema,
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
} as const;

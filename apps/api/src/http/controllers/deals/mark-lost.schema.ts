import {
  dealResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const markDealLostSchema = {
  tags: ['Deals'],
  summary: 'Mark a deal as lost',
  params: idParamsSchema,
  response: {
    200: dealResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
} as const;

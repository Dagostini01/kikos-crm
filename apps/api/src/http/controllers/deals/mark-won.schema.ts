import {
  dealResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const markDealWonSchema = {
  tags: ['Deals'],
  summary: 'Mark a deal as won',
  params: idParamsSchema,
  response: {
    200: dealResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
} as const;

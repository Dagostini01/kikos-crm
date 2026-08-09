import {
  dealResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const getDealSchema = {
  tags: ['Deals'],
  summary: 'Get a deal by id',
  params: idParamsSchema,
  response: {
    200: dealResponseSchema,
    404: errorResponseSchema,
  },
} as const;

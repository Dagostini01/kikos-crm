import {
  dealResponseSchema,
  errorResponseSchema,
  idParamsSchema,
} from './schemas.js';

export const updateDealStatusSchema = {
  tags: ['Deals'],
  summary: 'Move a deal to in progress',
  params: idParamsSchema,
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['IN_PROGRESS'] },
    },
  },
  response: {
    200: dealResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
  },
} as const;

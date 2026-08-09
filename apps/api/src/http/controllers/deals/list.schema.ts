import { dealSchema } from './schemas.js';

export const listDealsSchema = {
  tags: ['Deals'],
  summary: 'List deals',
  querystring: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['NEW', 'IN_PROGRESS', 'WON', 'LOST'],
      },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['deals'],
      properties: {
        deals: {
          type: 'array',
          items: dealSchema,
        },
      },
    },
  },
} as const;

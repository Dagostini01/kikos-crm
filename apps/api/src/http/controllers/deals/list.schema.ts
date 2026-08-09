import { dealSchema } from './schemas.js';

export const listDealsSchema = {
  tags: ['Deals'],
  summary: 'List deals',
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

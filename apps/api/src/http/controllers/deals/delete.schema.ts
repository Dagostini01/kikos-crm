import { errorResponseSchema, idParamsSchema } from './schemas.js';

export const deleteDealSchema = {
  tags: ['Deals'],
  summary: 'Delete a deal',
  params: idParamsSchema,
  response: {
    204: {
      type: 'null',
    },
    404: errorResponseSchema,
  },
} as const;

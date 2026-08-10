import { errorResponseSchema, idParamsSchema } from './schemas.js';

export const generateDealAiInsightsSchema = {
  tags: ['Deals'],
  summary: 'Generate AI summary and next-step suggestion for a deal',
  params: idParamsSchema,
  response: {
    200: {
      type: 'object',
      required: ['summary', 'nextStep', 'model'],
      properties: {
        summary: { type: 'string' },
        nextStep: { type: 'string' },
        model: { type: 'string' },
      },
    },
    404: errorResponseSchema,
    502: errorResponseSchema,
    503: errorResponseSchema,
  },
} as const;

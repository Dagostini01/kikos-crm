export const healthSchema = {
  tags: ['Health'],
  summary: 'Check API and database health',
  response: {
    200: {
      type: 'object',
      required: ['status', 'database', 'timestamp'],
      properties: {
        status: { type: 'string' },
        database: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
    503: {
      type: 'object',
      required: ['status', 'database', 'timestamp'],
      properties: {
        status: { type: 'string' },
        database: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  },
} as const;

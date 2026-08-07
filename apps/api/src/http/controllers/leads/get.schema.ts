export const getLeadSchema = {
  tags: ['Leads'],
  summary: 'Get a lead by id',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      required: ['lead'],
      properties: {
        lead: {
          type: 'object',
          required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    404: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
} as const;

export const listLeadsSchema = {
  tags: ['Leads'],
  summary: 'List leads',
  response: {
    200: {
      type: 'object',
      required: ['leads'],
      properties: {
        leads: {
          type: 'array',
          items: {
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
    },
  },
} as const;

export const listSellersSchema = {
  tags: ['Sellers'],
  summary: 'List sellers',
  response: {
    200: {
      type: 'object',
      required: ['sellers'],
      properties: {
        sellers: {
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
